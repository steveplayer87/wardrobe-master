# 元件規範:ItemBrowser

> 要新增或修改任何「列出單品」的畫面之前,先讀完這份。
> 規則由 `tests/itembrowser.test.js` 強制檢查,繞過元件會讓測試失敗。

## 為什麼有這個元件

以前每個列單品的畫面(衣櫥、試穿選擇器…)各自複製一份分類/排序/篩選/搜尋,
功能不一致、改一處要改多處。現在統一成 `createItemBrowser()`:
**只要用它建立的畫面,自動有同一套工具列,行為完全一致。**

## 三條硬規則

1. **列單品一律用 `createItemBrowser()`。** 不准手寫 `.item-grid`、不准在別處呼叫 `buildItemCard()`。
2. **搜尋/排序/篩選/選取的狀態只存在 browser 實例內**(`browser.state`)。不准另開全域變數。
3. **要「回到上一層」的子視窗用 `pushModal(id)`**,不要新增 `modalReturnTo = '…'`。

## 三層架構(由下而上,上層只依賴下層)

| 層 | 內容 | 特性 |
|---|---|---|
| 1. 查詢層 | `queryItems(items, {cat, matchCategory, query, filters, sort})`、`SORTERS`、`itemMatchesSearch`、`itemMatchesFilters` | 純函式,無 DOM、無全域狀態,可單獨測試 |
| 2. 卡片層 | `buildItemCard(item, opts)` | 純函式,一切行為由 `opts` 傳入 |
| 3. 元件層 | `createItemBrowser(cfg)` | 建立工具列 + 清單 + 選取列,管理自己的 state |

搜尋範圍:名稱、價格、購買日、最近穿著日、標籤、分類名稱(日期用 `/` 格式搜尋)。

## 設定項 `cfg`

必填:

| 欄位 | 說明 |
|---|---|
| `id` | 唯一字串,會寫進 `data-ib`,測試與除錯用 |
| `mount` | 要渲染進去的元素 |
| `getItems()` | **範圍**:這個畫面可能顯示的所有單品(不含分類/搜尋/篩選) |
| `onItemTap(item)` | 點卡片要做什麼 |

選填:

| 欄位 | 說明 |
|---|---|
| `categories()` → `[{id,label}]` \| `null` | 分類列;`null` = 不顯示 |
| `matchCategory(item, catId)` | 有 `categories` 時必填 |
| `defaultCat` / `defaultSort` / `sortKeys[]` | 預設值;`sortKeys` 取自 `SORTERS` 的 key |
| `addCategory()` | 提供就會多一顆「+ 新增分類」 |
| `features` | `{count, search, filter, select}`;預設只有 `select` 是關的 |
| `selectActions` | `[{label, kind:'danger'?, run(ids, browser)}]`,`run` 要自己彈確認 |
| `onSelectModeChange(on)` | 例如進入選取時隱藏新增按鈕 |
| `onLongPress(item)` | 長按卡片 |
| `badge(item, idx, B)` / `subtitle(item)` | 卡片角標 / 副標題 |
| `renderExtra(B)` / `footer(B)` | 工具列下方 / 清單下方的自訂區塊(回傳 Node 或 null) |
| `emptyText(B)` | 回傳字串,或 `null` 使用內建預設 |

實例方法:`render()`、`reset(overrides?)`、`setSelectMode(on)`;`B.visible` 是目前可見的單品。
開發時可在 devtools 用 `window.itemBrowsers`。

## 新增一個列單品畫面:四步驟

以「洗衣籃待洗清單」為例:

```html
<!-- 1. index.html:只放一個掛載點 -->
<div id="basketBrowserMount"></div>
```
```js
// 2. initBrowsers() 裡建立
basketBrowser = createItemBrowser({
  id: 'basket',
  mount: document.getElementById('basketBrowserMount'),
  getItems: () => state.items.filter(i => i.status === 'dirty'),
  onItemTap: item => openItemDetail(item.id),
});
// 3. 打開畫面時重置狀態
function openBasketOverview() { basketBrowser.reset(); openModal('modal-basket'); }
```
4. 把 `'basket'` 加進 `tests/itembrowser.test.js` 的「toolbar parity」迴圈,並把它加進 `window.itemBrowsers`。

資料變動後呼叫 `renderAll()` 即可;若新增了 browser,記得在 `renderAll()` 裡呼叫它的 `render()`。

## 狀態策略

- **常駐型**(衣櫥、常穿排行):建立一次,保留上次的排序/篩選。
- **選擇型**(試穿選擇器、暫存衣架總覽):每次打開前 `reset()`,避免上次的搜尋殘留。

## 現有畫面對照

| 畫面 | 狀態 |
|---|---|
| 衣櫥 | ✅ `wardrobe`(分類 + 選取 + 長按編輯 + 刪除自訂分類) |
| 試穿選擇器(含外套/配件切換) | ✅ `tryon`;補登穿搭的各欄位也走這個 |
| 暫存衣架總覽 | ✅ `rack` |
| 常穿排行 | ✅ `rank`(預設依累計穿著排序,顯示 #名次) |
| 首頁洗衣籃/暫存衣架小標籤 | 摘要,不適用 |
| 日曆單日明細、通知列 | 明細/待辦,不適用 |
| 耗材卡片 | 不是單品,不適用 |
| **洗衣籃彈出卡片** | ⏳ 目前只有洗衣日資訊,尚未列出待洗單品 — 建議作為第一個「照規範新增」的畫面 |

判斷標準:畫面要「讓使用者在一群衣物單品裡瀏覽/挑選」→ 必須用 ItemBrowser;只是摘要或單筆明細 → 不用。

## Modal 規則

- 子視窗要回到上一層:`pushModal('modal-xxx')`;關閉(含右滑、點背景、按鈕)會自動返回。
- 舊機制 `modalReturnTo`(目前只有設定 → 數字九宮格)與 `closeModal()` 裡針對補登的特例是**待清理的舊債**,
  請勿再擴充;有機會就改成 `pushModal`。測試會檢查 `modalReturnTo = '…'` 的數量只能減少不能增加。

## 已知問題(暫停中,尚未修)

這些是使用者回報、但被明確要求暫停的項目,接手時請先確認是否恢復:
- 照片調整器按「套用」會關掉整個新增表單(`openPhotoAdjust` 沒設定返回目標,應改用 `pushModal`)。
- 縮放滑桿不能縮小、不是以中心縮放、無雙指手勢。
- 透明底圖片在衣櫥/日曆顯示成黑色(要白底);舊版已存的圖片需重新上傳。
- 日曆上洗浴巾的藍點記錄的是「開始使用日」而非「換洗當天」(`handleConsumableReset`)。
- 日曆縮圖的上衣/褲子寬度對齊。

## 測試

```
npm install
npm test
```
包含行為測試與「規則檢查」(例如:`buildItemCard` 只能有一個呼叫點、index.html 不得出現手寫的 `item-grid`)。
新增畫面請同步補測試。

## 發佈檢查清單

1. `npm test` 全過。
2. 更新 `index.html` 內三個資源的 `?v=` 版本號(`styles.css`、`seed-items.js`、`app.js`)。
3. 在 `sw.js` 同步更新 `ASSETS` 裡的 `?v=`,並把 `CACHE_NAME` 加一。
4. 部署後在 Netlify 確認「Publish」的是最新一筆部署。

> 注意:整個資料夾一起部署時,`docs/`、`tests/`、`package.json` 也會被一起公開(內容無敏感資訊)。
