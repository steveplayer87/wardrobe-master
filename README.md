# Wardrobe Master

這是一個可安裝到 iPhone 主畫面的個人衣櫥、穿搭與洗衣管理 PWA（Wardrobe Master）。資料預設保存在目前瀏覽器／網站來源中，並可透過 App 內的「設定 → 匯出備份／匯入備份」搬移。

## 專案與發布網址
- GitHub 倉庫：[https://github.com/steveplayer87/wardrobe-master](https://github.com/steveplayer87/wardrobe-master)
- GitHub Pages：[https://steveplayer87.github.io/wardrobe-master/](https://steveplayer87.github.io/wardrobe-master/)

## 使用方式

發布後請用 iPhone Safari 開啟 GitHub Pages 網址（`https://steveplayer87.github.io/wardrobe-master/`），選擇「分享 → 加入主畫面」，再開啟「以 Web App 開啟」。之後從手機桌面開啟即可像一般 App 使用。

## 開發方式

這個專案不需要 build step。修改 `index.html`、`styles.css`、`app.js` 或 `seed-items.js` 後推送到 `main`，GitHub Actions 會自動部署到 GitHub Pages。若更新 JavaScript 或 CSS，請同步更新 `index.html` 與 `sw.js` 中的 query-string 版本及 service worker cache 名稱，避免舊快取殘留。

## 備份

localStorage 不會跨網站來源自動同步。從舊版本移轉時，請先在舊版本使用「設定 → 匯出備份」，再在新版本使用「設定 → 匯入備份」。圖片會包含在 JSON 備份中。

---

## 📌 即將推進待辦事項（個人形象 2.0 ＆ 氣候換季升級）

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

