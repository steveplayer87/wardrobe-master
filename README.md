# Wardrobe Master

這是一個可安裝到 iPhone 主畫面的個人衣櫥、穿搭與洗衣管理 PWA（Wardrobe Master）。主要資料保存在本機 IndexedDB（localStorage 作相容備援），並可同步至 Cloudflare Worker + KV；也可透過 App 內的「設定 → 匯出備份／匯入備份」搬移。

## 專案與發布網址
- GitHub 倉庫：[https://github.com/steveplayer87/wardrobe-master](https://github.com/steveplayer87/wardrobe-master)
- GitHub Pages：[https://steveplayer87.github.io/wardrobe-master/](https://steveplayer87.github.io/wardrobe-master/)
- 目前版本：v91（2026-10-22）

## 使用方式

發布後請用 iPhone Safari 開啟 GitHub Pages 網址（`https://steveplayer87.github.io/wardrobe-master/`），選擇「分享 → 加入主畫面」，再開啟「以 Web App 開啟」。之後從手機桌面開啟即可像一般 App 使用。

## 開發與發布

這個專案不需要 build step。修改 `index.html`、`styles.css`、`app.js` 或 `seed-items.js` 後，請先在自己的功能分支提交並測試，再透過 Pull Request 合併到 `main`；`main` 是正式版本的唯一來源。避免多個 AI 直接同時推送 `main`，也不要對 `main` 使用 force push。

每次更新 JavaScript、CSS 或 HTML 後，請同步更新 `index.html` 和 `sw.js` 的資產 query-string 版本、service worker cache 名稱及版本提示，避免舊快取殘留。發布後要驗證 GitHub Pages 實際載入的版本。

## 雲端狀態與單向同步

- Cloudflare Worker 的 `/api/state` 是 App 雲端狀態讀寫入口；`/api/laundry-history-import` 提供從 Notion 日記取得洗衣日期的後端來源。
- 外部工具或後端作業若要修改雲端資料，應先讀取最新雲端狀態，只修改目標欄位，再合併寫回，保留其他欄位；寫入後重新讀取並驗證結果。
- App 的一般單向同步不得因生命消耗品同步等背景流程，自動將整份可能過期的本機狀態覆寫回雲端。只有明確的使用者備份操作才會進行整份狀態備份；使用前應確認本機資料是最新的。
- Notion 洗衣歷史回填按鈕已從設定介面移除，避免把一次性修復操作留在一般使用流程中。後端 Notion 日期來源與雲端狀態 API 保留，供受控的外部維護作業使用；回填不應修改 Notion 日記或建立衣物個別洗滌紀錄。
- v91：四項生活紀錄在 App 端保存隱藏的毫秒級 `updatedAt`，同步時比較 App 修改時間與 Notion 頁面／日記最後修改時間；沒有時間戳的舊資料才回退比較日期值。
- v91：「雙向同步」會額外唯讀比對衣櫥其他資料區與 Cloudflare 的差異，只報告、不自動覆蓋其他欄位，以免缺少逐筆版本時間時造成資料遺失。
- v91：Worker 的 `/api/state` 會在狀態內容真正變更時，將被取代的不同版本保存到 `app_state_history`，最多保留 20 個不同內容版本；`/api/state/history` 列出版本，`/api/state/history/:id` 讀取指定版本。`updatedAt` 與同步時間戳本身不計入內容差異。這是部署後開始累積的版本歷史，無法還原部署前 KV 未保存的舊版本。

## 備份

localStorage 不會跨網站來源自動同步。從舊版本移轉時，請先在舊版本使用「設定 → 匯出備份」，再在新版本使用「設定 → 匯入備份」。圖片會包含在 JSON 備份中。

---

## 📌 待辦事項（個人形象 2.0 ＆ 氣候換季升級）

- [ ] **中央氣象署 (CWA) 溫濕度 API 串接**：即時取得平鎮/中壢即時體感溫度與降雨機率。
- [ ] **四級氣候溫標過濾推薦邏輯**：
  - 寒流極冷（< 15°C）：發熱衣 + 針織/高領 + 重磅大衣/羽絨 + 圍巾。
  - 涼感深秋（15 ~ 22°C）：夏冬交替黃金期（短T疊穿夾克/長袖襯衫 + 寬版長褲）。
  - 舒適微風（23 ~ 28°C）：長短混搭、薄襯衫外搭。
  - 酷熱盛夏（> 28°C）：透氣涼感短T、短褲、防曬配件。
- [ ] **基底配件庫（Essentials）分類建檔**：
  - 280~320 磅高磅純棉羅紋中筒白襪（耐洗不易鬆垮，百搭鞋款）。
  - 水洗復古老帽（Washed Cap，修飾身形頭身比）。
- [ ] **夏冬交替過渡模組**：自動標記換季過渡期穿搭組合，方便一鍵檢視「早晚溫差 7°C 以上」的機動外搭。
