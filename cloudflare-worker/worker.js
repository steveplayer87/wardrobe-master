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

      // 2. 日常輕量狀態同步（純文字資料：衣服清單、洗滌狀態、穿搭紀錄、耗材，~120KB）
      if (path === "/api/state") {
        if (request.method === "GET") {
          const state = await env.WARDROBE_STORE.get("app_state_text", "json");
          return new Response(JSON.stringify(state || {}), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (request.method === "POST") {
          const body = await request.json();
          body.updatedAt = Date.now();
          await env.WARDROBE_STORE.put("app_state_text", JSON.stringify(body));
          return new Response(JSON.stringify({ success: true, updatedAt: body.updatedAt }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      }

      // 3. 獨立單品照片儲存池（動靜分離：只有新加入衣服或換照片才上傳，終身快取）
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
          await env.WARDROBE_STORE.put("img_" + imageId, body);
          return new Response(JSON.stringify({ success: true, id: imageId }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      }

      // 4. 生活耗材雙向同步（與 Notion 生活標籤追蹤資料庫雙向對齊）
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
            notionItems[title] = { pageId: page.id, date: date || null };
          }
        }

        const clientPayload = request.method === "POST" ? await request.json() : {};
        const clientDates = clientPayload.items || {};

        const resolved = {};
        const updatedNotion = [];
        const updatedClient = [];

        // 需同步之生活項目映射
        const trackKeys = ["洗衣服", "洗床單枕頭套/棉被", "換電動牙刷頭", "換刮鬍刀片"];

        // 亦掃描日記資料庫最新「註記」欄位，實現日記更新後生活標籤自動跟著更新
        const diaryDbId = env.NOTION_DIARY_DB_ID || "50adbc0959024715a90484ddc73b62d6";
        const diaryDates = {};
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
          let nDate = notionInfo?.date || null;
          const dDate = diaryDates[key] || null;

          // 若日記日期比生活標籤新，以日記日期更新生活標籤
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
              updatedNotion.push(key);
            }
          }

          if (cDate && (!nDate || cDate > nDate)) {
            // App 端日期較新，反向更新 Notion
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
              updatedNotion.push(key);
            }
          } else if (nDate && (!cDate || nDate > cDate)) {
            // Notion (或日記) 日期較新，指示 App 端更新
            resolved[key] = nDate;
            updatedClient.push(key);
          } else {
            resolved[key] = nDate || cDate || null;
          }
        }

        const result = {
          success: true,
          syncedAt: Date.now(),
          resolved,
          updatedNotion,
          updatedClient
        };

        // 存入 KV 供超級儀表板與離線快取使用
        await env.WARDROBE_STORE.put("last_consumables_sync", JSON.stringify(result));

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 5. 阿鵝管家三項雙向同步（供超級儀表板直連 Notion）
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

      // 6. 手動/外部觸發全量自動同步日記至生活標籤
      if (path === "/api/cron-sync") {
        const result = await syncAllDiaryToNotion(env);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  },

  // Cloudflare 雲端定時排程（Cron Triggers 每 5 分鐘全自動觸發）
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(syncAllDiaryToNotion(env));
  }
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
  await env.WARDROBE_STORE.put("last_cron_sync_result", JSON.stringify(result));
  return result;
}
