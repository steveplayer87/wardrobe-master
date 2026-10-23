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
          return new Response(imgData, {
            headers: {
              ...corsHeaders,
              "Content-Type": "text/plain",
              "Cache-Control": "public, max-age=31536000, immutable"
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

      // 7. 手動或 App 重新進入時觸發日記至生活標籤同步；不再使用定時排程
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
