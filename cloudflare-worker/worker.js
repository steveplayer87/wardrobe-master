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

        for (const key of trackKeys) {
          const notionInfo = notionItems[key];
          const cDate = clientDates[key] || null;
          const nDate = notionInfo?.date || null;

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
            // Notion 日期較新（例如日記中已標記），指示 App 端更新
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

        for (const key of trackKeys) {
          const notionInfo = gooseItems[key];
          const cDate = clientDates[key];
          const nDate = notionInfo?.date;

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
          bath: resolved["洗阿鵝"] || "2026-10-09",
          walk: resolved["遛阿鵝"] || "2026-10-10",
          nails: resolved["阿鵝剪指甲"] || "2026-10-01"
        }), {
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
  }
};
