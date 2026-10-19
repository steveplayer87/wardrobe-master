/**
 * Wardrobe Master & Life Sync - Cloudflare Worker
 * 具備「動靜分離」極致瘦身架構的雲端同步後端
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
        return new Response(JSON.stringify({ status: "ok", service: "wardrobe-sync-worker" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 2. 日常輕量狀態同步（純文字資料：衣服清單、洗滌狀態、穿搭紀錄、耗材，~800KB 或單次增量 <10KB）
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

      // 4. 全量完整備份端點（包含全量 JSON，用於一次性搬移與匯出）
      if (path === "/api/backup") {
        if (request.method === "GET") {
          const backup = await env.WARDROBE_STORE.get("full_backup", "json");
          return new Response(JSON.stringify(backup || {}), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (request.method === "POST") {
          const body = await request.json();
          await env.WARDROBE_STORE.put("full_backup", JSON.stringify(body));
          return new Response(JSON.stringify({ success: true, size: JSON.stringify(body).length }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
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
