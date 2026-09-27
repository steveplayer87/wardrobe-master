# UI 設計與圖標規範

1. **嚴格禁止使用 Emoji 表情符號**：
   - 介面中所有按鈕、標籤、狀態文字、對話框、操作提示及微調選項，一律禁止使用系統 Emoji（如 🔄, ☀️, 🌙, ☁️, 🌧️, 📍, ✕, ✂️ 等）。
   - 一律使用精緻、俐落的向量圖標（Lucide SVG / ICONS 字典或 CSS 圖標）代替。

2. **視覺層次與陰影**：
   - 導覽列（Tab bar）、頂部標頭（Header）與重要卡片必須維持立體顯眼的柔和陰影（深海軍藍調投影），避免平面單調。

3. **iOS PWA 視口與底部導覽列（Tab bar）規範（嚴防「下巴」白邊重現）**：
   - **Tab bar 必須永遠為 `position: fixed; bottom: 0; left: 0; right: 0;`**，嚴禁改成 `position: absolute`！`position: absolute` 會依附於 `#app` 的計算高度，在 iOS PWA standalone 模式下容易因 safe area 或 viewport 高度差產生底部白邊（下巴）。
   - **嚴禁用 JavaScript 動態設定 `#app.style.height = screen.height` 或強制寫死 height**：這會使 WebKit body 產生溢出並破壞觸控座標映射（導致點擊日期整列位移）。
   - `#mainScroll` 必須具備 `padding-bottom: calc(96px + var(--safe-bottom))`，確保所有內容能平滑滾動至 Tab bar 上方而不被遮擋。
   - Header 圖標夜間模式樣式（`.icon-btn` 等）必須嚴格限定在 `#app.is-home-view.is-night-view`，禁止在日曆、衣櫥等淺色背景頁面套用深色夜間按鈕。

4. **對話框與資料儲存防禦性設計**：
   - 使用者在補登或表單點擊「儲存」時，必須優先寫入 state / localStorage 與觸發 render，再進入後續的確認或詢問流程（如洗衣狀態確認）。
   - 多步驟確認對話框（`openConfirm`）的動作按鈕若會接續開啟下一個對話框，必須加上 `keepOpen: true`，嚴禁中途被 `forceCloseModal()` 意外關閉中斷。

