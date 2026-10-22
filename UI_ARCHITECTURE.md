# UI 元件與樣式架構

最後整理：2026-10-22（v96，尚未提交）

## 目標與原則

本專案使用原生 HTML、CSS、JavaScript，沒有 React/Vue 或前端建置流程。共用化以「呈現一致、行為分離」為原則：共用資料呈現與視覺原語；頁面仍各自管理選取、導覽、編輯、外部連結、模態視窗及特殊動畫。不要為了追求單一元件而把不同互動強行合併。

## 元件依賴圖

```text
衣物／願望清單資料
  ├─ itemPhotoMarkup(item) ──> .item-photo / .item-photo-image
  ├─ itemCardBrandMarkup(item) ──> brandIconMarkup() ──> .item-brand / .brand-icon
  ├─ itemCardNameMarkup(name) ──> .item-name
  └─ buildItemCard(item, opts)
       ├─ 衣櫃
       ├─ 洗衣清單（laundryMode）
       ├─ 衣架（rackMode）
       ├─ 試穿選擇（tryonMode）
       ├─ 沙盒衣櫃選擇
       └─ 唯讀模擬展示（readOnly）

renderSandboxPickerItems('wishlist')
  └─ 共用照片／品牌／名稱呈現原語
     └─ 保留沙盒加入動作與分類資訊

renderWishlist()
  └─ 獨立 wishlist-card
     ├─ 願望清單標籤
     ├─ 選取模式與選取列
     ├─ 編輯／參考網址操作
     └─ 自己的卡片比例與排版

openItemDetail(itemId)
  └─ 獨立詳情版面、正反面 2.5D 翻轉、保養操作、歷史紀錄

openModal() / closeModal() / forceCloseModal()
  └─ 共用模態視窗生命週期、返回位置與表單狀態
```

## 共用呈現原語

| 函式 | 職責 | 注意事項 |
|---|---|---|
| `itemPhotoMarkup(item)` | 統一有照片與無照片的內容標記 | 由外層 `.item-photo` 控制比例、背景與裁切；不要再為單一選擇器寫背景圖 inline style |
| `itemCardBrandMarkup(item, size)` | 統一品牌空位、品牌圖示與文字標記 | 品牌圖示仍交給 `brandIconMarkup()`；沒有品牌時可保留空位以維持卡片高度 |
| `itemCardNameMarkup(name)` | 統一衣物名稱標記及 HTML escaping | 名稱樣式由 `.item-name` 管理 |
| `brandIconMarkup(item, size)` | 品牌圖示呈現 | 不負責品牌搜尋、圖示載入或資料修改 |
| `buildItemCard(item, opts)` | 共用衣物卡片與衣櫃情境互動 | 目前仍包含模式差異、長按、選取、洗衣加成與點擊導向；大拆前需先補行為測試 |

v95 將沙盒中的願望清單選擇卡片改用共用照片、品牌、名稱呈現原語，移除該處照片與類別文字的 inline style。它仍然保留自己的 `addItemToSandbox()` 操作，不會被誤當成一般衣物卡片的詳情導向。

## 頁面為何不全部使用同一張卡片

- **衣櫃、洗衣、衣架、試穿、沙盒衣櫃**：可共用 `buildItemCard()`，透過 options 控制情境差異。
- **願望清單主頁**：保留 `.wishlist-card`，因為它有標籤、編輯、外部參考連結與批次選取等不同結構。應共用底層呈現原語，不應直接換成一般衣物卡片。
- **衣物詳情**：保留獨立版面與正反面翻轉互動，不應塞進縮圖卡片抽象。
- **試穿的空白／無帽選項**：是選擇器中的特殊選項，只有在樣式與無障礙行為能一致時才值得抽成元件。
- **風格圖庫拖曳**：獨立的 pointer/長按排序流程，勿與衣物卡片的 550ms 長按新增操作混用。

## CSS 維護規則

`styles.css` 有歷史追加的修正區塊；同一個選擇器出現多次不一定是錯誤，可能是後續針對手機尺寸、鞋類照片、封存狀態或特定頁面做的覆寫。請按以下順序整理：

1. 先記錄選擇器、行號、media query 與載入順序。
2. 區分基礎元件規則、情境修飾（例如 `.is-selected`、`.is-retired-view`）與響應式規則。
3. 只合併屬性和值都相同、且作用範圍一致的規則。
4. 保留有意義的頁面差異與較後方的修正；不要只靠文字搜尋次數決定刪除。
5. 每次整理後檢查一般衣櫃、封存衣物、洗衣清單、試穿、願望清單、沙盒及窄螢幕。

目前明確的共用卡片規則位於 `/* Unified Pure White Wardrobe & Picker Cards */` 區段；它橫跨多個容器，改動前須逐一確認各容器的卡片樣式。

## 模態視窗與互動安全

- `openModal()`、`closeModal()`、`forceCloseModal()` 是集中式生命週期入口；不要以直接移除 DOM 或任意清空表單取代。
- 保留 `modalReturnTo` 的回返行為，以及尚未儲存表單的提示／暫存狀態。
- `buildItemCard()` 的 `opts.onClick`、`returnTo`、`laundryMode`、`rackMode`、`tryonMode`、`readOnly` 各有語意；修改預設點擊前需檢查全部呼叫點。
- 保留長按新增、洗衣加成按鈕的事件阻擋，以及選取模式的視覺狀態。
- 詳情翻面動畫與風格圖庫拖曳是不同互動，不應共用同一事件處理器。

## 驗證清單

每次修改 UI 共用層後：

- [ ] `node --check app.js`
- [ ] `node --check sw.js`
- [ ] `git diff --check`
- [ ] 檢查衣物有照片、無照片、品牌有／無、鞋類照片。
- [ ] 檢查衣櫃選取模式、長按、待洗／休息狀態與洗衣加成。
- [ ] 檢查願望清單編輯、外部連結、批次選取及沙盒加入。
- [ ] 檢查衣物詳情翻面、返回來源與模態視窗表單狀態。
- [ ] 若更動 HTML/CSS/JS，保持 `index.html`、`sw.js` 的 query-string 版本、版本提示與 cache 名稱一致。
- [ ] 發布後驗證正式站實際載入版本。

## 本次 v95 範圍

- 新增 `itemCardBrandMarkup()`、`itemCardNameMarkup()` 共用呈現函式。
- `buildItemCard()` 改用共用品牌／名稱呈現函式。
- 沙盒願望清單卡片改用 `itemPhotoMarkup()`、`itemCardBrandMarkup()`、`itemCardNameMarkup()`，移除照片與分類文字的 inline style。
- 新增 `.sandbox-picker-category` 樣式。
- 更新 `index.html` 資產 query 版本與提示至 v95，更新 `sw.js` cache 名稱與資產 query 至 v95。
- 本次未重排整份 CSS，因為舊有覆寫需要依頁面實際呈現逐段驗證後才能安全合併。


## v96：匯入來源與圖片尺寸標準（尚未提交）

### 備份匯入

- 設定只保留「匯出備份」與「匯入備份」兩個入口。
- 「匯入備份」先選來源：本機 JSON 檔或 Cloudflare 雲端狀態。兩種匯入都會覆蓋目前本機完整狀態，必須保留確認提示；雲端匯入成功後更新同步指紋與時間戳。
- 舊的「匯入我的舊衣物清單」不再顯示於一般設定，避免與完整備份匯入混淆。

### 圖片尺寸標準

- 衣櫥與共用單品卡片的圖片視窗固定為正方形；照片統一以 `object-fit: contain`，顯示框內尺寸固定為 88%，不再提供全域卡片照片縮放設定，也不對鞋類單獨放大。卡片版面由固定圖片視窗、品牌預留行與名稱行維持一致。
- 衣櫥單品卡片：正方形圖片視窗，照片顯示框固定 88%，`object-fit: contain`，不按品類另外放大。品牌預留行與名稱行維持卡片高度一致。
- 月曆與每日穿搭共用同一組比例標準：上身／外套 `aspect-ratio: 1.08`、長褲 `0.78`、短褲 `1.15`。月曆縮圖以較窄的褲子框與輕微重疊呈現；每日穿搭以同一組比例安排穿搭版面。比例以 JavaScript 的 `HOME_SLOT_RATIOS`／`OUTFIT_SHORTS_RATIO` 為單一來源，啟動時同步到 CSS `--outfit-*-ratio`，避免月曆與每日穿搭各自漂移。
- 今日穿搭試穿區的物件排版／縮放工具仍保留；單品編輯中的照片裁切、縮放與平移功能不受影響。
- 舊備份中的 `profile.cardImageScale` 會在載入時移除，不再影響呈現。


## Notion 生活標籤同步（v97）

- Cloudflare 不再設定 Cron Trigger；`/api/cron-sync` 僅接受 POST，供 App 啟動／切回前景或設定中的手動按鈕呼叫。
- App 自動觸發最短間隔 15 分鐘；手動按鈕可立即執行。離線時略過自動同步。
