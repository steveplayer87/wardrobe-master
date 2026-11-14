/**
 * Wardrobe Master & Life Sync - Cloudflare Worker
 * 具備「動靜分離」極致瘦身架構的雲端同步後端
 * 整合 Notion 生活標籤追蹤雙向同步
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 1. 健康檢查
      if (path === "/" || path === "/api/health") {
        return new Response(JSON.stringify({
          status: "ok",
          service: "wardrobe-sync-worker",
          notionConfigured: Boolean(env.NOTION_TOKEN && env.NOTION_LIFE_DB_ID)
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 2. 中央氣象署今明 36 小時預報。API key 僅存 Worker Secret，不傳回前端。
      if (path === "/api/weather-forecast" && request.method === "GET") {
        if (!env.CWA_API_KEY) {
          return new Response(JSON.stringify({ success: false, error: "CWA_API_KEY_NOT_CONFIGURED" }), {
            status: 503, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }
          });
        }
        const allowedCounties = new Set(["臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市", "基隆市", "新竹市", "嘉義市", "新竹縣", "苗栗縣", "彰化縣", "南投縣", "雲林縣", "嘉義縣", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣", "連江縣"]);
        const county = (url.searchParams.get("county") || "桃園市").replace(/^台/, "臺");
        if (!allowedCounties.has(county)) {
          return new Response(JSON.stringify({ success: false, error: "UNSUPPORTED_COUNTY" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const cwaUrl = new URL("https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001");
        cwaUrl.searchParams.set("Authorization", env.CWA_API_KEY);
        cwaUrl.searchParams.set("format", "JSON");
        cwaUrl.searchParams.set("locationName", county);
        const cwaRes = await fetch(cwaUrl.toString(), { headers: { "Accept": "application/json" } });
        if (!cwaRes.ok) {
          return new Response(JSON.stringify({ success: false, error: "CWA_UPSTREAM_FAILED", status: cwaRes.status }), {
            status: 502, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }
          });
        }
        const cwaJson = await cwaRes.json();
        const location = cwaJson.records?.location?.find(item => item.locationName === county) || cwaJson.records?.location?.[0];
        if (!location) {
          return new Response(JSON.stringify({ success: false, error: "CWA_LOCATION_NOT_FOUND" }), {
            status: 502, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }
          });
        }
        const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(new Date());
        const tomorrowDate = new Date(`${today}T12:00:00+08:00`);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const tomorrow = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(tomorrowDate);
        const getElement = name => location.weatherElement?.find(element => element.elementName === name)?.time || [];
        const valueForTomorrow = name => {
          const entry = getElement(name).find(time => String(time.startTime || "").slice(0, 10) === tomorrow);
          if (!entry) return null;
          const parameter = entry.parameter || {};
          const raw = parameter.parameterName ?? parameter.parameterValue;
          const numeric = Number(raw);
          return Number.isFinite(numeric) ? numeric : (raw == null ? null : String(raw));
        };
        return new Response(JSON.stringify({
          success: true,
          source: "CWA F-C0032-001",
          county: location.locationName,
          issuedAt: cwaJson.records?.datasetInfo?.issueTime || null,
          today,
          tomorrow,
          tomorrowMin: valueForTomorrow("MinT"),
          tomorrowMax: valueForTomorrow("MaxT"),
          tomorrowWeather: valueForTomorrow("Wx"),
          tomorrowPoP: valueForTomorrow("PoP"),
          fetchedAt: Date.now()
        }), { headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=1800" } });
      }

      // 2b. 中央氣象署詳細天氣（今日實測 + 鄉鎮預報 + 昨日對比與逐時回溯）
      if (path === "/api/weather-detail" && request.method === "GET") {
        if (!env.CWA_API_KEY) {
          return new Response(JSON.stringify({ success: false, error: "CWA_API_KEY_NOT_CONFIGURED" }), {
            status: 503, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }
          });
        }
        const rawCounty = (url.searchParams.get("county") || "桃園市").replace(/^台/, "臺").trim();
        const rawTown = (url.searchParams.get("town") || "").replace(/^台/, "臺").trim();
        const latParam = Number(url.searchParams.get("lat"));
        const lonParam = Number(url.searchParams.get("lon"));
        const hasCoords = Number.isFinite(latParam) && Number.isFinite(lonParam);

        const taipeiFmt = new Intl.DateTimeFormat("sv-SE", {
          timeZone: "Asia/Taipei",
          year: "numeric", month: "2-digit", day: "2-digit",
          hour: "2-digit", minute: "2-digit", hour12: false
        });
        const parts = Object.fromEntries(taipeiFmt.formatToParts(new Date()).map(p => [p.type, p.value]));
        const todayDate = `${parts.year}-${parts.month}-${parts.day}`;
        const currentHour = Math.min(23, Math.max(0, Number(parts.hour) || 0));
        const yDateObj = new Date(`${todayDate}T12:00:00+08:00`);
        yDateObj.setDate(yDateObj.getDate() - 1);
        const yesterdayDate = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(yDateObj);

        const normalizeTemp = val => {
          const n = Number(val);
          return Number.isFinite(n) && n > -50 && n < 60 ? Math.round(n * 10) / 10 : null;
        };
        const mapCwaWeatherToCode = (text, isNight = false) => {
          const s = String(text || "");
          if (!s || s === "X" || s === "-99") return 0;
          if (s.includes("雷")) return 95;
          if (s.includes("雪") || s.includes("冰霰")) return 71;
          if (s.includes("大雨") || s.includes("豪雨")) return 65;
          if (s.includes("短暫雨") || s.includes("陣雨")) return 80;
          if (s.includes("細雨") || s.includes("毛雨")) return 51;
          if (s.includes("雨")) return 61;
          if (s.includes("霧")) return 45;
          if (s.includes("陰")) return 3;
          if (s.includes("多雲")) return 2;
          if (s.includes("晴")) return s.includes("雲") ? 1 : 0;
          return isNight ? 1 : 0;
        };
        const pickStationCoords = st => {
          const coords = st?.GeoInfo?.Coordinates || [];
          const wgs = coords.find(c => String(c.CoordinateName || "").toUpperCase() === "WGS84") || coords[0];
          const slat = Number(wgs?.StationLatitude);
          const slon = Number(wgs?.StationLongitude);
          return Number.isFinite(slat) && Number.isFinite(slon) ? { lat: slat, lon: slon } : null;
        };
        const findBestStation = (stations, preferredId = null) => {
          if (!Array.isArray(stations) || !stations.length) return null;
          if (preferredId) {
            const exact = stations.find(st => st.StationId === preferredId && normalizeTemp(st?.WeatherElement?.AirTemperature) !== null);
            if (exact) return exact;
          }
          const valid = stations.filter(st => normalizeTemp(st?.WeatherElement?.AirTemperature) !== null);
          if (!valid.length) return null;
          const pickClosest = pool => {
            if (!pool.length) return null;
            if (!hasCoords) return pool[0];
            let best = null;
            let bestDist = Infinity;
            for (const st of pool) {
              const c = pickStationCoords(st);
              if (!c) continue;
              const d = (c.lat - latParam) ** 2 + (c.lon - lonParam) ** 2;
              if (d < bestDist) { bestDist = d; best = st; }
            }
            return best || pool[0];
          };
          if (rawTown) {
            const inTown = valid.filter(st => (st.GeoInfo?.TownName || "").replace(/^台/, "臺") === rawTown);
            const nonHighwayInTown = inTown.filter(st => !/^國[一二三四五六七八九十]/.test(st.StationName || ""));
            if (nonHighwayInTown.length) return pickClosest(nonHighwayInTown);
            if (inTown.length) return pickClosest(inTown);
          }
          const nonHighwayValid = valid.filter(st => !/^國[一二三四五六七八九十]/.test(st.StationName || ""));
          if (hasCoords && nonHighwayValid.length) return pickClosest(nonHighwayValid);
          if (hasCoords) return pickClosest(valid);
          const byCounty = valid.find(st => (st.GeoInfo?.CountyName || "").replace(/^台/, "臺") === rawCounty);
          return byCounty || valid[0];
        };
        const extractStationSnap = st => {
          if (!st) return null;
          const temp = normalizeTemp(st?.WeatherElement?.AirTemperature);
          if (temp === null) return null;
          const obsRaw = String(st?.ObsTime?.DateTime || "");
          const hour = obsRaw.length >= 13 ? Number(obsRaw.slice(11, 13)) : currentHour;
          const isNight = hour >= 18 || hour < 6;
          const wxRaw = String(st?.WeatherElement?.Weather || "");
          const wxLabel = wxRaw && wxRaw !== "X" && wxRaw !== "-99" ? wxRaw : "";
          const hum = Number(st?.WeatherElement?.RelativeHumidity);
          const high = normalizeTemp(st?.WeatherElement?.DailyExtreme?.DailyHigh?.TemperatureInfo?.AirTemperature);
          const low = normalizeTemp(st?.WeatherElement?.DailyExtreme?.DailyLow?.TemperatureInfo?.AirTemperature);
          return {
            stationId: st.StationId || "",
            stationName: st.StationName || "",
            county: (st.GeoInfo?.CountyName || rawCounty).replace(/^台/, "臺"),
            town: (st.GeoInfo?.TownName || rawTown).replace(/^台/, "臺"),
            obsTime: obsRaw || null,
            hour,
            temp,
            humidity: Number.isFinite(hum) && hum >= 0 && hum <= 100 ? Math.round(hum) : null,
            weatherText: wxLabel || "晴朗",
            code: mapCwaWeatherToCode(wxLabel, isNight),
            isDay: isNight ? 0 : 1,
            dailyHigh: high,
            dailyLow: low,
          };
        };

        // 1. 取得即時全測站逐時實測 (O-A0001-001)
        const obsUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${encodeURIComponent(env.CWA_API_KEY)}&format=JSON`;
        const obsRes = await fetch(obsUrl, { headers: { "Accept": "application/json" } });
        if (!obsRes.ok) {
          return new Response(JSON.stringify({ success: false, error: "CWA_OBS_FAILED", status: obsRes.status }), {
            status: 502, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }
          });
        }
        const obsJson = await obsRes.json();
        const bestStation = findBestStation(obsJson?.records?.Station || []);
        const currentSnap = extractStationSnap(bestStation);
        if (!currentSnap) {
          return new Response(JSON.stringify({ success: false, error: "CWA_STATION_NOT_FOUND" }), {
            status: 502, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }
          });
        }

        const cacheKeyId = (currentSnap.stationId || `${rawCounty}_${rawTown || "default"}`).replace(/[^a-zA-Z0-9_\-\u4e00-\u9fff]/g, "_");
        const todayKvKey = `weather_obs_${todayDate}_${cacheKeyId}`;
        const yesterdayKvKey = `weather_obs_${yesterdayDate}_${cacheKeyId}`;

        // 2. 更新 KV 中今日實測逐時紀錄
        let todayObsMap = {};
        try { todayObsMap = (await env.WARDROBE_STORE.get(todayKvKey, "json")) || {}; } catch (_) {}
        if (!todayObsMap || typeof todayObsMap !== "object") todayObsMap = {};
        const obsHourKey = String(currentSnap.hour).padStart(2, "0");
        const prevSlot = todayObsMap[obsHourKey];
        if (!prevSlot || prevSlot.temp !== currentSnap.temp || prevSlot.code !== currentSnap.code) {
          todayObsMap[obsHourKey] = {
            hour: currentSnap.hour,
            temp: currentSnap.temp,
            code: currentSnap.code,
            label: currentSnap.weatherText,
            isDay: currentSnap.isDay,
            actual: true
          };
          try {
            await env.WARDROBE_STORE.put(todayKvKey, JSON.stringify(todayObsMap), { expirationTtl: 60 * 60 * 24 * 7 });
          } catch (_) {}
        }

        // 3. 取得鄉鎮未來 3 天逐 3 小時預報 (各縣市 F-D0047-xxx) 補齊今日整天 24 小時趨勢
        const CWA_3D_DATASET_BY_COUNTY = {
          "宜蘭縣": "F-D0047-001", "桃園市": "F-D0047-005", "新竹縣": "F-D0047-009", "苗栗縣": "F-D0047-013",
          "彰化縣": "F-D0047-017", "南投縣": "F-D0047-021", "雲林縣": "F-D0047-025", "嘉義縣": "F-D0047-029",
          "屏東縣": "F-D0047-033", "臺東縣": "F-D0047-037", "花蓮縣": "F-D0047-041", "澎湖縣": "F-D0047-045",
          "基隆市": "F-D0047-049", "新竹市": "F-D0047-053", "嘉義市": "F-D0047-057", "臺北市": "F-D0047-061",
          "高雄市": "F-D0047-065", "新北市": "F-D0047-069", "臺中市": "F-D0047-073", "臺南市": "F-D0047-077",
          "連江縣": "F-D0047-081", "金門縣": "F-D0047-085"
        };
        const forecastNodes = [];
        try {
          const fcDatasetId = CWA_3D_DATASET_BY_COUNTY[currentSnap.county] || CWA_3D_DATASET_BY_COUNTY[rawCounty] || "F-D0047-089";
          const targetTown = rawTown || currentSnap.town || "";
          const fcUrl = new URL(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/${fcDatasetId}`);
          fcUrl.searchParams.set("Authorization", env.CWA_API_KEY);
          fcUrl.searchParams.set("format", "JSON");
          if (targetTown) fcUrl.searchParams.set("LocationName", targetTown);
          const fcRes = await fetch(fcUrl.toString(), { headers: { "Accept": "application/json" } });
          if (fcRes.ok) {
            const fcJson = await fcRes.json();
            const groups = fcJson?.records?.Locations || fcJson?.records?.locations || [];
            let matchedLoc = null;
            for (const g of groups) {
              const gName = String(g.LocationsName || g.locationsName || "").replace(/^台/, "臺");
              const locs = g.Location || g.location || [];
              const found = locs.find(l => {
                const lName = String(l.LocationName || l.locationName || "").replace(/^台/, "臺");
                return targetTown ? lName === targetTown && (!gName || gName === rawCounty || gName.includes(rawCounty.slice(0, 2))) : (!gName || gName === rawCounty);
              }) || locs[0];
              if (found) { matchedLoc = found; break; }
            }
            if (matchedLoc) {
              const elements = matchedLoc.WeatherElement || matchedLoc.weatherElement || [];
              const findEl = names => elements.find(el => names.includes(el.ElementName || el.elementName));
              const tempEl = findEl(["溫度", "T"]);
              const wxEl = findEl(["天氣現象", "Wx"]);
              const popEl = findEl(["3小時降雨機率", "PoP3h", "PoP"]);

              const wxByTime = new Map();
              for (const t of (wxEl?.Time || wxEl?.time || [])) {
                const start = String(t.StartTime || t.startTime || t.DataTime || t.dataTime || "");
                const ev = (t.ElementValue || t.elementValue || [])[0] || {};
                const label = ev.Weather || ev.value || ev.Value || "";
                if (start && label) wxByTime.set(start.slice(0, 16), String(label));
              }
              const popByTime = new Map();
              for (const t of (popEl?.Time || popEl?.time || [])) {
                const start = String(t.StartTime || t.startTime || t.DataTime || t.dataTime || "");
                const ev = (t.ElementValue || t.elementValue || [])[0] || {};
                const val = Number(ev.ProbabilityOfPrecipitation ?? ev.value ?? ev.Value);
                if (start && Number.isFinite(val)) popByTime.set(start.slice(0, 16), Math.round(val));
              }

              for (const t of (tempEl?.Time || tempEl?.time || [])) {
                const start = String(t.DataTime || t.dataTime || t.StartTime || t.startTime || "");
                const ev = (t.ElementValue || t.elementValue || [])[0] || {};
                const tempVal = normalizeTemp(ev.Temperature ?? ev.value ?? ev.Value);
                if (!start || tempVal === null) continue;
                const ms = Date.parse(start);
                if (!Number.isFinite(ms)) continue;
                const datePart = start.slice(0, 10);
                const hourPart = Number(start.slice(11, 13));
                const wxText = wxByTime.get(start.slice(0, 16)) || "";
                const popVal = popByTime.get(start.slice(0, 16)) ?? null;
                forecastNodes.push({
                  ms,
                  date: datePart,
                  hour: hourPart,
                  temp: tempVal,
                  weatherText: wxText,
                  code: wxText ? mapCwaWeatherToCode(wxText, hourPart >= 18 || hourPart < 6) : null,
                  pop: popVal
                });
              }
              forecastNodes.sort((a, b) => a.ms - b.ms);
            }
          }
        } catch (_) {}

        const buildDayHoursFromKnots = (dateStr, actualMap, knots) => {
          const validKnots = (knots || []).filter(k => Number.isFinite(k.temp)).sort((a, b) => a.hour - b.hour);
          const result = [];
          for (let h = 0; h < 24; h++) {
            const hh = String(h).padStart(2, "0");
            const act = actualMap[hh];
            if (act && act.temp != null) {
              result.push({
                hour: h,
                time: `${hh}:00`,
                temp: Math.round(act.temp * 10) / 10,
                code: Number.isFinite(Number(act.code)) ? Number(act.code) : currentSnap.code,
                label: act.label || currentSnap.weatherText,
                isDay: h >= 6 && h < 18 ? 1 : 0,
                actual: !!act.actual,
                pop: act.pop ?? null
              });
              continue;
            }
            if (validKnots.length) {
              let left = null;
              let right = null;
              for (const k of validKnots) {
                if (k.hour <= h) left = k;
                if (k.hour >= h && !right) right = k;
              }
              let interpTemp = null;
              let refKnot = left || right;
              if (left && right && left.hour !== right.hour) {
                const ratio = (h - left.hour) / (right.hour - left.hour);
                interpTemp = Math.round((left.temp + (right.temp - left.temp) * ratio) * 10) / 10;
                refKnot = ratio < 0.5 ? left : right;
              } else {
                interpTemp = (left || right).temp;
              }
              const isNight = h >= 18 || h < 6;
              const code = refKnot.code != null ? refKnot.code : mapCwaWeatherToCode(refKnot.weatherText, isNight);
              result.push({
                hour: h,
                time: `${hh}:00`,
                temp: interpTemp,
                code,
                label: refKnot.weatherText || "",
                isDay: isNight ? 0 : 1,
                actual: false,
                pop: refKnot.pop ?? null
              });
            } else {
              const isNight = h >= 18 || h < 6;
              result.push({
                hour: h,
                time: `${hh}:00`,
                temp: null,
                code: 0,
                label: "",
                isDay: isNight ? 0 : 1,
                actual: false,
                pop: null
              });
            }
          }
          return result;
        };

        // 4. 取得今日已過時段 & 昨日實測資料：優先讀取 KV；若尚未累積，透過 CWA historyapi (XML) 補齊
        const extractStationFromCwaXml = (xmlText, targetStationId, targetTown) => {
          if (!xmlText || typeof xmlText !== "string") return null;
          const findBlockContaining = needle => {
            if (!needle) return "";
            const idx = xmlText.indexOf(needle);
            if (idx < 0) return "";
            const start = xmlText.lastIndexOf("<Station>", idx);
            const end = xmlText.indexOf("</Station>", idx);
            if (start < 0 || end < 0 || end <= start) return "";
            return xmlText.slice(start, end + 10);
          };
          let block = findBlockContaining(`<StationId>${targetStationId}</StationId>`);
          if (!block && targetTown) {
            block = findBlockContaining(`<TownName>${targetTown}</TownName>`);
          }
          if (!block) return null;
          const tagVal = tag => {
            const m = block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
            return m ? m[1].trim() : "";
          };
          const temp = normalizeTemp(tagVal("AirTemperature"));
          if (temp === null) return null;
          const obsRaw = tagVal("DateTime");
          const hour = obsRaw.length >= 13 ? Number(obsRaw.slice(11, 13)) : 0;
          const isNight = hour >= 18 || hour < 6;
          const wxRaw = tagVal("Weather");
          const wxLabel = wxRaw && wxRaw !== "X" && wxRaw !== "-99" ? wxRaw : "晴朗";
          return {
            hour,
            temp,
            code: mapCwaWeatherToCode(wxLabel, isNight),
            label: wxLabel,
            isDay: isNight ? 0 : 1,
            actual: true
          };
        };

        const fetchCwaHistoryIntoMap = async (targetDate, targetHoursList, obsMap, kvKey) => {
          const missing = targetHoursList.filter(h => h >= 0 && h <= 23 && !obsMap[String(h).padStart(2, "0")]);
          if (!missing.length) return false;
          try {
            const metaUrl = new URL("https://opendata.cwa.gov.tw/historyapi/v1/getMetadata/O-A0001-001");
            metaUrl.searchParams.set("Authorization", env.CWA_API_KEY);
            metaUrl.searchParams.set("format", "JSON");
            metaUrl.searchParams.set("timeFrom", `${targetDate}T00:00:00`);
            metaUrl.searchParams.set("timeTo", `${targetDate}T23:59:59`);
            const metaRes = await fetch(metaUrl.toString(), { headers: { "Accept": "application/json" } });
            if (!metaRes.ok) return false;
            const metaJson = await metaRes.json();
            const resources = metaJson?.dataset?.resources?.resource?.data?.time ||
              metaJson?.resources?.resource?.data?.time ||
              metaJson?.data?.time ||
              [];
            const byHourUrl = new Map();
            for (const item of (Array.isArray(resources) ? resources : [])) {
              const tStr = String(item?.DateTime || item?.DataTime || item?.time || "");
              const fUrl = item?.ProductURL || item?.url || "";
              const h = tStr.length >= 13 ? Number(tStr.slice(11, 13)) : NaN;
              if (fUrl && Number.isFinite(h) && !byHourUrl.has(h)) byHourUrl.set(h, fUrl);
            }
            let updated = false;
            for (const h of missing) {
              const fUrl = byHourUrl.get(h);
              if (!fUrl) continue;
              try {
                const histRes = await fetch(fUrl);
                if (!histRes.ok) continue;
                const histText = await histRes.text();
                let snap = extractStationFromCwaXml(histText, currentSnap.stationId, currentSnap.town);
                if (!snap && histText.trim().startsWith("{")) {
                  const histJson = JSON.parse(histText);
                  const st = findBestStation(histJson?.records?.Station || histJson?.cwaopendata?.dataset?.Station || [], currentSnap.stationId);
                  const parsed = extractStationSnap(st);
                  if (parsed) {
                    snap = { hour: h, temp: parsed.temp, code: parsed.code, label: parsed.weatherText, isDay: h >= 6 && h < 18 ? 1 : 0, actual: true };
                  }
                }
                if (snap) {
                  obsMap[String(h).padStart(2, "0")] = { ...snap, hour: h };
                  updated = true;
                }
              } catch (_) {}
            }
            if (updated) {
              try {
                await env.WARDROBE_STORE.put(kvKey, JSON.stringify(obsMap), { expirationTtl: 60 * 60 * 24 * 7 });
              } catch (_) {}
            }
            return updated;
          } catch (_) {
            return false;
          }
        };

        // 補抓今日稍早整點實測（讓今天凌晨到現在也盡量是實測曲線）
        const todayEarlyHours = [0, 3, 6, 9, currentHour - 1].filter(h => h >= 0 && h < currentSnap.hour);
        await fetchCwaHistoryIntoMap(todayDate, todayEarlyHours, todayObsMap, todayKvKey);

        const todayKnots = forecastNodes
          .filter(n => n.date === todayDate)
          .map(n => ({ hour: n.hour, temp: n.temp, code: n.code, weatherText: n.weatherText, pop: n.pop }));
        for (const v of Object.values(todayObsMap)) {
          if (v && Number.isFinite(v.temp)) {
            todayKnots.push({ hour: Number(v.hour), temp: Number(v.temp), code: v.code, weatherText: v.label || "", pop: null });
          }
        }
        const todayHours = buildDayHoursFromKnots(todayDate, todayObsMap, todayKnots);

        let yesterdayObsMap = {};
        let yesterdaySource = "cwa-kv";
        try { yesterdayObsMap = (await env.WARDROBE_STORE.get(yesterdayKvKey, "json")) || {}; } catch (_) {}
        if (!yesterdayObsMap || typeof yesterdayObsMap !== "object") yesterdayObsMap = {};

        const yesterdayTargetHours = Array.from(new Set([
          currentHour,
          Math.min(23, currentHour + 1),
          0, 3, 6, 9, 12, 15, 18, 21, 23
        ]));
        const fetchedYesterday = await fetchCwaHistoryIntoMap(yesterdayDate, yesterdayTargetHours, yesterdayObsMap, yesterdayKvKey);
        if (fetchedYesterday) yesterdaySource = "cwa-history";

        const yesterdayKnots = Object.values(yesterdayObsMap)
          .filter(v => v && Number.isFinite(v.temp))
          .map(v => ({ hour: Number(v.hour), temp: Number(v.temp), code: v.code, weatherText: v.label || "", pop: null }));
        const yesterdayHours = buildDayHoursFromKnots(yesterdayDate, yesterdayObsMap, yesterdayKnots);

        const todayTemps = todayHours.map(h => h.temp).filter(v => v !== null);
        if (currentSnap.dailyHigh !== null) todayTemps.push(currentSnap.dailyHigh);
        if (currentSnap.dailyLow !== null) todayTemps.push(currentSnap.dailyLow);
        const todayMin = todayTemps.length ? Math.round(Math.min(...todayTemps) * 10) / 10 : currentSnap.temp;
        const todayMax = todayTemps.length ? Math.round(Math.max(...todayTemps) * 10) / 10 : currentSnap.temp;

        const yTemps = yesterdayHours.map(h => h.temp).filter(v => v !== null);
        const yesterdayMin = yTemps.length ? Math.round(Math.min(...yTemps) * 10) / 10 : null;
        const yesterdayMax = yTemps.length ? Math.round(Math.max(...yTemps) * 10) / 10 : null;
        let yesterdaySameHour = null;
        if (yesterdayHours[currentHour] && yesterdayHours[currentHour].temp !== null) {
          yesterdaySameHour = yesterdayHours[currentHour];
        } else {
          const nearby = [currentHour + 1, currentHour - 1].find(h => h >= 0 && h <= 23 && yesterdayHours[h] && yesterdayHours[h].temp !== null);
          if (nearby !== undefined) yesterdaySameHour = { ...yesterdayHours[nearby], approxHour: nearby };
        }

        return new Response(JSON.stringify({
          success: true,
          source: "CWA",
          yesterdaySource,
          county: currentSnap.county || rawCounty,
          town: currentSnap.town || rawTown,
          stationName: currentSnap.stationName,
          obsTime: currentSnap.obsTime,
          todayDate,
          yesterdayDate,
          currentHour,
          current: {
            temperature_2m: currentSnap.temp,
            weather_code: currentSnap.code,
            is_day: currentSnap.isDay,
            relative_humidity_2m: currentSnap.humidity,
            weather_label: currentSnap.weatherText,
          },
          todayMin,
          todayMax,
          yesterdayMin,
          yesterdayMax,
          yesterdaySameHour,
          todayHours,
          yesterdayHours,
          fetchedAt: Date.now()
        }), { headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=600" } });
      }

      // 3. 從 Notion 日記完整回填洗衣日期（唯讀查詢，不改動 Notion 日記）
      if (path === "/api/laundry-history-import" && request.method === "GET") {
        if (!env.NOTION_TOKEN) {
          return new Response(JSON.stringify({ error: "Notion token not configured on Worker" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const diaryDbId = env.NOTION_DIARY_DB_ID || "50adbc0959024715a90484ddc73b62d6";
        const dates = new Set();
        let startCursor;
        let scanned = 0;

        // Notion page_size 上限為 100；必須翻頁，不能只讀最近 30 筆。
        do {
          const payload = { page_size: 100 };
          if (startCursor) payload.start_cursor = startCursor;
          const diaryRes = await fetch(`https://api.notion.com/v1/databases/${diaryDbId}/query`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${env.NOTION_TOKEN}`,
              "Notion-Version": "2022-06-28",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (!diaryRes.ok) {
            const detail = await diaryRes.text();
            return new Response(JSON.stringify({ error: "Failed to query Notion diary", detail }), {
              status: 502,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
          }

          const diaryJson = await diaryRes.json();
          for (const page of diaryJson.results || []) {
            scanned += 1;
            const date = page.properties?.["Date"]?.date?.start;
            const tags = (page.properties?.["註記"]?.multi_select || []).map(tag => tag.name);
            if (date && tags.some(tag => tag === "洗衣服" || tag.includes("洗衣服"))) {
              dates.add(date.slice(0, 10));
            }
          }
          startCursor = diaryJson.has_more ? diaryJson.next_cursor : null;
        } while (startCursor);

        const sortedDates = Array.from(dates).sort();
        return new Response(JSON.stringify({
          success: true,
          source: "notion-diary",
          scanned,
          count: sortedDates.length,
          dates: sortedDates
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }
        });
      }

      // 4. 日常輕量狀態同步與去重歷史版本（保留最近 20 個不同內容版本）
      if (path === "/api/state/history" && request.method === "GET") {
        const history = await env.WARDROBE_STORE.get("app_state_history", "json") || [];
        const historyBytes = new TextEncoder().encode(JSON.stringify(history)).length;
        return new Response(JSON.stringify({
          success: true,
          limit: 10,
          count: history.length,
          historyBytes,
          versions: history.map(({ id, savedAt, hash, state }) => ({
            id, savedAt, hash, itemCount: Array.isArray(state?.items) ? state.items.length : 0,
            bytes: new TextEncoder().encode(JSON.stringify(state || {})).length
          }))
        }), { headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } });
      }
      if (path.startsWith("/api/state/history/") && request.method === "GET") {
        const id = decodeURIComponent(path.slice("/api/state/history/".length));
        const history = await env.WARDROBE_STORE.get("app_state_history", "json") || [];
        const version = history.find(entry => entry.id === id);
        if (!version) return new Response(JSON.stringify({ success: false, error: "History version not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
        const safeVersion = { ...version, state: { ...(version.state || {}) } };
        // 不在歷史版本端點額外暴露舊版 API 金鑰；還原時保留本機目前的金鑰即可。
        delete safeVersion.state.geminiApiKey;
        return new Response(JSON.stringify({ success: true, version: safeVersion }), {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }
        });
      }
      if (path === "/api/state") {
        if (request.method === "GET") {
          const state = await env.WARDROBE_STORE.get("app_state_text", "json");
          return new Response(JSON.stringify(state || {}), {
            headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }
          });
        }
        if (request.method === "POST") {
          const requestId = request.headers.get("cf-ray") || crypto.randomUUID();
          const startedAt = Date.now();
          const body = await request.json();
          const current = await env.WARDROBE_STORE.get("app_state_text", "json");
          // Safety net for already-open older clients: never accept an upload that silently drops
          // records or photo references already present in the cloud. Intentional deletions must
          // first be reconciled with the current cloud state rather than overwriting blindly.
          if (current) {
            const incomingItems = Array.isArray(body.items) ? body.items : [];
            const currentItems = Array.isArray(current.items) ? current.items : [];
            const incomingIds = new Set(incomingItems.map(item => item.id));
            const missingItemIds = currentItems.filter(item => !incomingIds.has(item.id)).map(item => item.id);
            const photoCount = items => items.reduce((count, item) => count + (item.image ? 1 : 0) + (item.imageBack ? 1 : 0), 0);
            const missingPhotos = photoCount(currentItems) - photoCount(incomingItems);
            const missingCollections = [];
            for (const [key, label] of [["ootdHistory", "歷史穿搭"], ["wishlist", "想買清單"], ["styleGallery", "風格圖庫"], ["haircuts", "理髮紀錄"], ["consumables", "生活耗材"], ["sandboxItems", "沙盒單品"], ["sandboxes", "沙盒"]]) {
              const currentCount = Array.isArray(current[key]) ? current[key].length : 0;
              const incomingCount = Array.isArray(body[key]) ? body[key].length : 0;
              if (incomingCount < currentCount) missingCollections.push({ key, label, currentCount, incomingCount });
            }
            if (missingItemIds.length || missingPhotos > 0 || missingCollections.length) {
              return new Response(JSON.stringify({
                success: false,
                error: "STALE_STATE_PROTECTED",
                message: "Upload blocked because the cloud contains records missing from this client. Restore or reconcile cloud data before uploading.",
                details: {
                  missingItemCount: missingItemIds.length,
                  missingItemIds: missingItemIds.slice(0, 25),
                  missingPhotoReferences: Math.max(0, missingPhotos),
                  missingCollections
                }
              }), {
                status: 409,
                headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }
              });
            }
          }
          const contentHash = async value => {
            const copy = { ...(value || {}) };
            delete copy.updatedAt;
            delete copy.syncMeta;
            const stable = value => {
              if (Array.isArray(value)) return value.map(stable);
              if (value && typeof value === "object") {
                return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
              }
              return value;
            };
            const bytes = new TextEncoder().encode(JSON.stringify(stable(copy)));
            const digest = await crypto.subtle.digest("SHA-256", bytes);
            return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
          };
          if (current) {
            const previousHash = await contentHash(current);
            const nextHash = await contentHash(body);
            if (previousHash === nextHash) {
              // 內容未變更時不重寫 KV，也不更新時間戳；避免無效寫入與歷史版本檢查。
              console.log(JSON.stringify({ event: "kv_write_audit", route: "/api/state", outcome: "unchanged", requestId, elapsedMs: Date.now() - startedAt }));
              return new Response(JSON.stringify({ success: true, unchanged: true, updatedAt: current.updatedAt || null }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
              });
            }
            const history = await env.WARDROBE_STORE.get("app_state_history", "json") || [];
            // 寫入歷史快照限流：同一個 15 分鐘區間只保存第一個版本，避免每次小修改都額外消耗一次 KV put。
            // 主狀態仍即時保存；歷史保留最多 20 個不同內容版本。
            const lastSnapshotAt = Number(history[0]?.savedAt) || 0;
            const snapshotIntervalMs = 15 * 60 * 1000;
            const hasThisVersion = history.some(entry => entry.hash === previousHash);
            const snapshotDue = !lastSnapshotAt || Date.now() - lastSnapshotAt >= snapshotIntervalMs;
            if (!hasThisVersion && snapshotDue) {
              const nextHistory = [{
                id: `${current.updatedAt || Date.now()}-${previousHash.slice(0, 12)}`,
                savedAt: Number(current.updatedAt) || Date.now(),
                hash: previousHash,
                state: current
              }, ...history];
              // KV 單一值有大小上限；不能只按版本數裁切，因每份衣櫥快照都可能很大。
              // 保留最多 10 份，並將整包限制在 16 MiB，為 JSON/KV 上限留足空間。
              const maxHistoryBytes = 16 * 1024 * 1024;
              let trimmedHistory = nextHistory.slice(0, 10);
              let historyPayload = JSON.stringify(trimmedHistory);
              while (trimmedHistory.length > 1 && new TextEncoder().encode(historyPayload).length > maxHistoryBytes) {
                trimmedHistory.pop();
                historyPayload = JSON.stringify(trimmedHistory);
              }
              const historyBytes = new TextEncoder().encode(historyPayload).length;
              if (historyBytes > maxHistoryBytes) {
                console.warn(JSON.stringify({ event: "kv_write_audit", route: "/api/state", key: "app_state_history", outcome: "skipped_too_large", requestId, bytes: historyBytes }));
              } else {
                // 歷史快照是附加功能：即使歷史寫入失敗，也不可阻斷主狀態保存。
                try {
                  await env.WARDROBE_STORE.put("app_state_history", historyPayload);
                  console.log(JSON.stringify({ event: "kv_write_audit", route: "/api/state", key: "app_state_history", outcome: "put", requestId, bytes: historyBytes, snapshots: trimmedHistory.length }));
                } catch (historyError) {
                  console.error(JSON.stringify({ event: "kv_write_audit", route: "/api/state", key: "app_state_history", outcome: "put_failed", requestId, bytes: historyBytes, message: String(historyError?.message || historyError) }));
                }
              }
            }
          }
          body.updatedAt = Date.now();
          const statePayload = JSON.stringify(body);
          await env.WARDROBE_STORE.put("app_state_text", statePayload);
          console.log(JSON.stringify({ event: "kv_write_audit", route: "/api/state", key: "app_state_text", outcome: "put", requestId, bytes: new TextEncoder().encode(statePayload).length, elapsedMs: Date.now() - startedAt, itemCount: Array.isArray(body.items) ? body.items.length : 0 }));
          return new Response(JSON.stringify({ success: true, updatedAt: body.updatedAt }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      }

      // 5. 獨立單品照片儲存池（動靜分離：只有新加入衣服或換照片才上傳，終身快取）
      if (path.startsWith("/api/image/")) {
        const imageId = path.replace("/api/image/", "");
        if (!imageId) return new Response("Missing image id", { status: 400, headers: corsHeaders });

        if (request.method === "GET") {
          const imgData = await env.WARDROBE_STORE.get("img_" + imageId);
          if (!imgData) {
            return new Response("Not found", { status: 404, headers: corsHeaders });
          }
          // KV stores the original Data URI (data:image/...;base64,...).
          // Decode it before responding so <img> receives actual image bytes.
          const dataUriMatch = String(imgData).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/);
          if (!dataUriMatch) {
            return new Response("Invalid image data", {
              status: 415,
              headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
            });
          }
          const mimeType = dataUriMatch[1].toLowerCase();
          const binary = atob(dataUriMatch[2].replace(/\s/g, ""));
          const imageBytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) imageBytes[i] = binary.charCodeAt(i);
          return new Response(imageBytes, {
            headers: {
              ...corsHeaders,
              "Content-Type": mimeType,
              "Content-Length": String(imageBytes.byteLength),
              "X-Content-Type-Options": "nosniff",
              "Cache-Control": "public, max-age=3600"
            }
          });
        }

        if (request.method === "POST") {
          const body = await request.text();
          // 照片 ID 由內容雜湊產生，理應不可變；跨裝置重傳相同照片時先比對，避免重複 KV put。
          const existing = await env.WARDROBE_STORE.get("img_" + imageId);
          if (existing === body) {
            console.log(JSON.stringify({ event: "kv_write_audit", route: "/api/image", key: "img_" + imageId, outcome: "unchanged", bytes: body.length }));
            return new Response(JSON.stringify({ success: true, id: imageId, unchanged: true }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
          }
          await env.WARDROBE_STORE.put("img_" + imageId, body);
          console.log(JSON.stringify({ event: "kv_write_audit", route: "/api/image", key: "img_" + imageId, outcome: "put", bytes: body.length }));
          return new Response(JSON.stringify({ success: true, id: imageId }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      }

      // 6. 生活耗材雙向同步（與 Notion 生活標籤追蹤資料庫雙向對齊）
      if (path === "/api/sync-consumables") {
        if (!env.NOTION_TOKEN || !env.NOTION_LIFE_DB_ID) {
          return new Response(JSON.stringify({ error: "Notion credentials not configured on Worker" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // 查詢 Notion 生活標籤追蹤資料庫
        const notionRes = await fetch(`https://api.notion.com/v1/databases/${env.NOTION_LIFE_DB_ID}/query`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.NOTION_TOKEN}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ page_size: 20 })
        });

        if (!notionRes.ok) {
          const errText = await notionRes.text();
          return new Response(JSON.stringify({ error: "Failed to query Notion", detail: errText }), {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const notionJson = await notionRes.json();
        const notionItems = {};
        for (const page of notionJson.results || []) {
          const title = page.properties?.["項目"]?.title?.[0]?.plain_text;
          const date = page.properties?.["上次日期"]?.date?.start;
          if (title) {
            notionItems[title] = { pageId: page.id, date: date || null, updatedAt: Date.parse(page.last_edited_time || "") || 0 };
          }
        }

        const clientPayload = request.method === "POST" ? await request.json() : {};
        const clientDates = clientPayload.items || {};
        const clientUpdatedAt = clientPayload.updatedAt || {};

        const resolved = {};
        const resolvedUpdatedAt = {};
        const updatedNotion = [];
        const updatedClient = [];

        // 需同步之生活項目映射
        const trackKeys = ["洗衣服", "洗床單枕頭套/棉被", "換電動牙刷頭", "換刮鬍刀片"];

        // 亦掃描日記資料庫最新「註記」欄位，實現日記更新後生活標籤自動跟著更新
        const diaryDbId = env.NOTION_DIARY_DB_ID || "50adbc0959024715a90484ddc73b62d6";
        const diaryDates = {};
        const diaryUpdatedAt = {};
        try {
          const diaryRes = await fetch(`https://api.notion.com/v1/databases/${diaryDbId}/query`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${env.NOTION_TOKEN}`,
              "Notion-Version": "2022-06-28",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              sorts: [{ property: "Date", direction: "descending" }],
              page_size: 30
            })
          });
          if (diaryRes.ok) {
            const diaryJson = await diaryRes.json();
            for (const page of diaryJson.results || []) {
              const d = page.properties?.["Date"]?.date?.start;
              const notes = (page.properties?.["註記"]?.multi_select || []).map(m => m.name);
              if (d && notes.length) {
                for (const note of notes) {
                  for (const key of trackKeys) {
                    if (note === key || note.includes(key)) {
                      if (!diaryDates[key] || d > diaryDates[key]) {
                        diaryDates[key] = d;
                        diaryUpdatedAt[key] = Date.parse(page.last_edited_time || "") || 0;
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
          console.warn("Diary query error:", e);
        }

        for (const key of trackKeys) {
          const notionInfo = notionItems[key];
          const cDate = clientDates[key] || null;
          const cUpdatedAt = Number(clientUpdatedAt[key]) || 0;
          let nDate = notionInfo?.date || null;
          let nUpdatedAt = Number(notionInfo?.updatedAt) || 0;
          const dDate = diaryDates[key] || null;
          const dUpdatedAt = Number(diaryUpdatedAt[key]) || 0;

          // 日記標籤是 Notion 的另一個資料來源；記住該日記頁最後修改時間。
          if (dDate && (!nDate || dDate > nDate)) {
            nDate = dDate;
            nUpdatedAt = dUpdatedAt;
            if (notionInfo?.pageId) {
              await fetch(`https://api.notion.com/v1/pages/${notionInfo.pageId}`, {
                method: "PATCH",
                headers: {
                  "Authorization": `Bearer ${env.NOTION_TOKEN}`,
                  "Notion-Version": "2022-06-28",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  properties: {
                    "上次日期": { "date": { "start": dDate } }
                  }
                })
              });
              updatedNotion.push(key);
            }
          }

          const appWins = cDate && (
            (cUpdatedAt > 0 && nUpdatedAt > 0 && cUpdatedAt > nUpdatedAt) ||
            (!(cUpdatedAt > 0 && nUpdatedAt > 0) && (!nDate || cDate > nDate))
          );
          const notionWins = nDate && (
            (cUpdatedAt > 0 && nUpdatedAt > 0 && nUpdatedAt > cUpdatedAt) ||
            (!(cUpdatedAt > 0 && nUpdatedAt > 0) && (!cDate || nDate > cDate))
          );

          if (appWins) {
            // App 修改時間較新；舊資料尚無時間戳時，才回退比較日期值。
            resolved[key] = cDate;
            resolvedUpdatedAt[key] = Math.max(cUpdatedAt, Date.now());
            if (notionInfo?.pageId) {
              await fetch(`https://api.notion.com/v1/pages/${notionInfo.pageId}`, {
                method: "PATCH",
                headers: {
                  "Authorization": `Bearer ${env.NOTION_TOKEN}`,
                  "Notion-Version": "2022-06-28",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  properties: {
                    "上次日期": { "date": { "start": cDate } }
                  }
                })
              });
              updatedNotion.push(key);
            }
          } else if (notionWins) {
            // Notion 頁面／日記最後修改時間較新，指示 App 端更新。
            resolved[key] = nDate;
            resolvedUpdatedAt[key] = nUpdatedAt || cUpdatedAt || Date.now();
            updatedClient.push(key);
          } else {
            resolved[key] = nDate || cDate || null;
            resolvedUpdatedAt[key] = Math.max(cUpdatedAt, nUpdatedAt, dUpdatedAt);
          }
        }

        const result = {
          success: true,
          syncedAt: Date.now(),
          resolved,
          resolvedUpdatedAt,
          updatedNotion,
          updatedClient
        };

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 6. 阿鵝管家三項雙向同步（供超級儀表板直連 Notion）
      if (path === "/api/sync-goose") {
        if (!env.NOTION_TOKEN || !env.NOTION_LIFE_DB_ID) {
          return new Response(JSON.stringify({ error: "Notion credentials not configured on Worker" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const notionRes = await fetch(`https://api.notion.com/v1/databases/${env.NOTION_LIFE_DB_ID}/query`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.NOTION_TOKEN}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ page_size: 20 })
        });

        if (!notionRes.ok) {
          const errText = await notionRes.text();
          return new Response(JSON.stringify({ error: "Failed to query Notion", detail: errText }), {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const notionJson = await notionRes.json();
        const gooseItems = {};
        for (const page of notionJson.results || []) {
          const title = page.properties?.["項目"]?.title?.[0]?.plain_text;
          const date = page.properties?.["上次日期"]?.date?.start;
          if (title) {
            gooseItems[title] = { pageId: page.id, date: date || null };
          }
        }

        const clientPayload = request.method === "POST" ? await request.json() : {};
        const clientDates = {
          "洗阿鵝": clientPayload.bath || null,
          "遛阿鵝": clientPayload.walk || null,
          "阿鵝剪指甲": clientPayload.nails || null
        };

        const resolved = {};
        const trackKeys = ["洗阿鵝", "遛阿鵝", "阿鵝剪指甲"];

        // 亦掃描日記資料庫中的阿鵝項目
        const diaryDbId = env.NOTION_DIARY_DB_ID || "50adbc0959024715a90484ddc73b62d6";
        const diaryDates = {};
        const diaryUpdatedAt = {};
        try {
          const diaryRes = await fetch(`https://api.notion.com/v1/databases/${diaryDbId}/query`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${env.NOTION_TOKEN}`,
              "Notion-Version": "2022-06-28",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              sorts: [{ property: "Date", direction: "descending" }],
              page_size: 30
            })
          });
          if (diaryRes.ok) {
            const diaryJson = await diaryRes.json();
            for (const page of diaryJson.results || []) {
              const d = page.properties?.["Date"]?.date?.start;
              const notes = (page.properties?.["註記"]?.multi_select || []).map(m => m.name);
              if (d && notes.length) {
                for (const note of notes) {
                  for (const key of trackKeys) {
                    if (note === key || note.includes(key)) {
                      if (!diaryDates[key] || d > diaryDates[key]) {
                        diaryDates[key] = d;
                        diaryUpdatedAt[key] = Date.parse(page.last_edited_time || "") || 0;
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
          console.warn("Diary query error in goose:", e);
        }

        for (const key of trackKeys) {
          const notionInfo = gooseItems[key];
          const cDate = clientDates[key];
          let nDate = notionInfo?.date;
          const dDate = diaryDates[key];

          if (dDate && (!nDate || dDate > nDate)) {
            nDate = dDate;
            if (notionInfo?.pageId) {
              await fetch(`https://api.notion.com/v1/pages/${notionInfo.pageId}`, {
                method: "PATCH",
                headers: {
                  "Authorization": `Bearer ${env.NOTION_TOKEN}`,
                  "Notion-Version": "2022-06-28",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  properties: {
                    "上次日期": { "date": { "start": dDate } }
                  }
                })
              });
            }
          }

          if (cDate && (!nDate || cDate > nDate)) {
            resolved[key] = cDate;
            if (notionInfo?.pageId) {
              await fetch(`https://api.notion.com/v1/pages/${notionInfo.pageId}`, {
                method: "PATCH",
                headers: {
                  "Authorization": `Bearer ${env.NOTION_TOKEN}`,
                  "Notion-Version": "2022-06-28",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  properties: {
                    "上次日期": { "date": { "start": cDate } }
                  }
                })
              });
            }
          } else {
            resolved[key] = nDate || cDate || null;
          }
        }

        return new Response(JSON.stringify({
          success: true,
          syncedAt: Date.now(),
          bath: resolved["洗阿鵝"] || "2026-10-17",
          walk: resolved["遛阿鵝"] || "2026-10-10",
          nails: resolved["阿鵝剪指甲"] || "2026-10-01"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 7. 衣櫥洗衣事件即時回寫指定日期日記「註記」，再同步生活標籤追蹤
      if (path === "/api/laundry-diary-sync" && request.method === "POST") {
        if (!env.NOTION_TOKEN) {
          return new Response(JSON.stringify({ success: false, error: "Notion token not configured on Worker" }), {
            status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const body = await request.json();
        const date = String(body.date || "").slice(0, 10);
        const washed = body.washed !== false;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return new Response(JSON.stringify({ success: false, error: "Invalid date" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const diaryDbId = env.NOTION_DIARY_DB_ID || "50adbc0959024715a90484ddc73b62d6";
        const queryRes = await fetch(`https://api.notion.com/v1/databases/${diaryDbId}/query`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${env.NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
          body: JSON.stringify({ page_size: 20, filter: { property: "Date", date: { equals: date } } })
        });
        if (!queryRes.ok) {
          return new Response(JSON.stringify({ success: false, error: "Failed to query diary date", detail: await queryRes.text() }), {
            status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const queryJson = await queryRes.json();
        const pages = queryJson.results || [];
        if (!pages.length) {
          return new Response(JSON.stringify({ success: false, error: `找不到 ${date} 的 Notion 日記，未建立新頁面` }), {
            status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        let updatedPages = 0;
        for (const page of pages) {
          const oldTags = (page.properties?.["註記"]?.multi_select || []).map(tag => tag.name).filter(Boolean);
          const nextTags = washed
            ? [...new Set([...oldTags, "洗衣服"])]
            : oldTags.filter(tag => tag !== "洗衣服");
          if (oldTags.length === nextTags.length && oldTags.every((tag, i) => tag === nextTags[i])) continue;
          const patchRes = await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${env.NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
            body: JSON.stringify({ properties: { "註記": { multi_select: nextTags.map(name => ({ name })) } } })
          });
          if (!patchRes.ok) {
            return new Response(JSON.stringify({ success: false, error: "Failed to update diary tags", detail: await patchRes.text() }), {
              status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
          }
          updatedPages++;
        }
        const lifeSync = await syncAllDiaryToNotion(env);
        // 若取消的是最新洗衣日記，將生活標籤的日期回算到剩餘紀錄，而不是保留已取消的日期。
        if (!washed && env.NOTION_LIFE_DB_ID) {
          const latestRes = await fetch(`https://api.notion.com/v1/databases/${diaryDbId}/query`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${env.NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
            body: JSON.stringify({
              page_size: 1,
              sorts: [{ property: "Date", direction: "descending" }],
              filter: { property: "註記", multi_select: { contains: "洗衣服" } }
            })
          });
          if (latestRes.ok) {
            const latestJson = await latestRes.json();
            const latestDate = latestJson.results?.[0]?.properties?.["Date"]?.date?.start || null;
            const lifeRes = await fetch(`https://api.notion.com/v1/databases/${env.NOTION_LIFE_DB_ID}/query`, {
              method: "POST",
              headers: { "Authorization": `Bearer ${env.NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
              body: JSON.stringify({ page_size: 100 })
            });
            if (lifeRes.ok) {
              const lifeJson = await lifeRes.json();
              const laundryTrack = (lifeJson.results || []).find(page => {
                const title = page.properties?.["項目"]?.title?.[0]?.plain_text || "";
                return title === "洗衣服" || title.includes("洗衣服");
              });
              if (laundryTrack) {
                await fetch(`https://api.notion.com/v1/pages/${laundryTrack.id}`, {
                  method: "PATCH",
                  headers: { "Authorization": `Bearer ${env.NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
                  body: JSON.stringify({ properties: { "上次日期": { date: latestDate ? { start: latestDate } : null } } })
                });
              }
            }
          }
        }
        const success = !!lifeSync.success;
        return new Response(JSON.stringify({ success, date, washed, diaryPages: pages.length, updatedPages, lifeSync }), {
          status: success ? 200 : 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 8. 手動或 App 重新進入時觸發日記至生活標籤同步；不再使用定時排程
      if (path === "/api/cron-sync" && request.method === "POST") {
        const result = await syncAllDiaryToNotion(env);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (err) {
      console.error(JSON.stringify({ event: "worker_error", route: path, method: request.method, message: String(err?.message || err), name: err?.name || "Error" }));
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  },

};

/**
 * 全自動同步日記「註記」至「生活標籤追蹤」資料庫核心邏輯
 */
async function syncAllDiaryToNotion(env) {
  if (!env.NOTION_TOKEN || !env.NOTION_LIFE_DB_ID) {
    return { success: false, error: "Missing Notion credentials" };
  }

  const diaryDbId = env.NOTION_DIARY_DB_ID || "50adbc0959024715a90484ddc73b62d6";
  const lifeDbId = env.NOTION_LIFE_DB_ID;

  // 1. 取得生活標籤追蹤資料庫中現有項目
  const lifeRes = await fetch(`https://api.notion.com/v1/databases/${lifeDbId}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ page_size: 50 })
  });
  if (!lifeRes.ok) return { success: false, error: "Failed to query life database" };
  const lifeJson = await lifeRes.json();
  const lifeItems = {};
  for (const page of lifeJson.results || []) {
    const title = page.properties?.["項目"]?.title?.[0]?.plain_text;
    const date = page.properties?.["上次日期"]?.date?.start;
    if (title) {
      lifeItems[title] = { pageId: page.id, date: date || null };
    }
  }

  // 2. 取得日記資料庫最近 30 天的所有紀錄
  const diaryRes = await fetch(`https://api.notion.com/v1/databases/${diaryDbId}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sorts: [{ property: "Date", direction: "descending" }],
      page_size: 30
    })
  });
  if (!diaryRes.ok) return { success: false, error: "Failed to query diary database" };
  const diaryJson = await diaryRes.json();

  const allTrackKeys = Object.keys(lifeItems);
  const diaryLatest = {};
  for (const page of diaryJson.results || []) {
    const d = page.properties?.["Date"]?.date?.start;
    const notes = (page.properties?.["註記"]?.multi_select || []).map(m => m.name);
    if (d && notes.length) {
      for (const note of notes) {
        for (const key of allTrackKeys) {
          if (note === key || note.includes(key)) {
            if (!diaryLatest[key] || d > diaryLatest[key]) {
              diaryLatest[key] = d;
            }
          }
        }
      }
    }
  }

  // 3. 比對並自動回寫生活標籤追蹤
  const updated = [];
  for (const key of allTrackKeys) {
    const item = lifeItems[key];
    const dDate = diaryLatest[key];
    const nDate = item?.date;
    if (dDate && (!nDate || dDate > nDate)) {
      if (item?.pageId) {
        await fetch(`https://api.notion.com/v1/pages/${item.pageId}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${env.NOTION_TOKEN}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            properties: {
              "上次日期": { "date": { "start": dDate } }
            }
          })
        });
        updated.push({ key, oldDate: nDate, newDate: dDate });
      }
    }
  }

  const result = {
    success: true,
    timestamp: Date.now(),
    updatedCount: updated.length,
    updated
  };
  // 同步結果直接回傳呼叫端；沒有消費者讀取此 KV 紀錄，因此不額外寫入。
  return result;
}
