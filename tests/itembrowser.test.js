/* Run: npm install && npm test
   Two kinds of checks:
   1. behaviour — every item-listing screen works and has the shared toolbar
   2. RULES     — fail if someone bypasses ItemBrowser (see docs/COMPONENTS.md) */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const html = read('index.html');
const appJs = read('app.js');
const seedJs = read('seed-items.js');

const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'dangerously', pretendToBeVisual: true });
const { window } = dom;
window.setInterval = () => 0;
window.confirm = () => true;
const errors = [];
window.addEventListener('error', e => errors.push(e.error || e.message));
window.eval(seedJs + '\n' + appJs);
window.init();
const doc = window.document;

let passed = 0;
function assert(cond, msg) { if (!cond) throw new Error('FAIL: ' + msg); passed++; console.log('OK  ', msg); }
const click = el => el.dispatchEvent(new window.Event('click', { bubbles: true }));
const $ = (sel, scope) => (scope || doc).querySelector(sel);
const $$ = (sel, scope) => Array.from((scope || doc).querySelectorAll(sel));
const mount = id => $(`[data-ib="${id}"]`);
const role = (id, r) => $(`[data-ib="${id}"] [data-role="${r}"]`);
const cards = id => $$(`[data-ib="${id}"] [data-role="grid"] .item-card`);
const typeInto = (input, v) => { input.value = v; input.dispatchEvent(new window.Event('input', { bubbles: true })); };
const activeSheet = () => { const s = $('.modal-sheet.is-active'); return s && s.id; };
const B = window.itemBrowsers;
const S = window.state;

/* ================= RULES (these protect the architecture) ================= */
console.log('\n# rules');
assert((appJs.match(/buildItemCard\(/g) || []).length === 2,
  'buildItemCard is called from exactly one place (inside createItemBrowser) — never build item cards by hand');
assert(!/class="item-grid"/.test(html),
  'index.html has no hand-written item-grid — item lists are mounted by ItemBrowser');
assert(!/id="(sortSelect|tryonSortSelect|btnSearch|btnTryonSearch|btnFilter|btnTryonFilter|selectBar)"/.test(html),
  'no duplicated per-screen toolbar markup (sort/search/filter/select) in index.html');
assert((appJs.match(/modalReturnTo = '/g) || []).length <= 1,
  "legacy modalReturnTo = '<sheet>' may only shrink (use pushModal in new code)");
assert(!/\b(uiWardrobe\w*|uiSearchQuery|uiSelect\w*|tryonSearchQuery|tryonSort)\b/.test(appJs),
  'no per-screen search/sort/filter/select state variables — state lives inside the browser instance');
for (const id of ['wardrobe', 'tryon', 'rack', 'rank']) {
  assert(!!mount(id), `a browser is mounted for "${id}"`);
}

/* ================= pure query layer ================= */
console.log('\n# queryItems');
const mkItem = (o) => Object.assign({ id: 'x' + Math.random(), name: 'n', category: 'top', tags: [], image: null, price: null, purchaseDate: '', wearCount: 0, totalWearCount: 0, status: 'clean', lastWornDate: null, createdAt: 1 }, o);
const sample = [
  mkItem({ id: 'a', name: '白T', price: 590, tags: ['短', '白'], status: 'clean', createdAt: 1, totalWearCount: 5 }),
  mkItem({ id: 'b', name: '黑褲', category: 'bottom', price: 790, tags: ['長'], status: 'resting', createdAt: 3, purchaseDate: '2024-03-02', totalWearCount: 9 }),
  mkItem({ id: 'c', name: '藍襯衫', price: 100, tags: ['短'], status: 'dirty', createdAt: 2, totalWearCount: 1 }),
];
const q = o => window.queryItems(sample, Object.assign({ cat: null, query: '', filters: { status: 'all', tags: [] }, sort: 'recent' }, o)).map(i => i.id).join('');
assert(q({}) === 'bca', 'default sort = most recently added first');
assert(q({ query: '590' }) === 'a', 'search matches price');
assert(q({ query: '2024/03/02' }) === 'b', 'search matches purchase date (slash format)');
assert(q({ query: '短' }) === 'ca', 'search matches tags');
assert(q({ filters: { status: 'dirty', tags: [] } }) === 'c', 'status filter');
assert(q({ filters: { status: 'all', tags: ['短', '白'] } }) === 'a', 'tag filter requires ALL selected tags');
assert(q({ sort: 'totalWear' }) === 'bac', 'sort by total wears');
assert(q({ sort: 'name' }).length === 3, 'sort by name keeps all items');

/* ================= every browser has the SAME toolbar ================= */
console.log('\n# toolbar parity');
for (const id of ['wardrobe', 'tryon', 'rack', 'rank']) {
  assert(!!role(id, 'sort') && !!role(id, 'filter') && !!role(id, 'search') && !!role(id, 'search-input'),
    `"${id}" has sort + filter + search`);
}
assert(!!role('wardrobe', 'select-toggle'), 'wardrobe additionally has select mode');
assert(!role('tryon', 'select-toggle') && !role('rack', 'select-toggle'), 'select mode is opt-in per browser');

/* ================= wardrobe ================= */
console.log('\n# wardrobe browser');
const nonRetired = S.items.filter(i => i.status !== 'retired').length;
assert(cards('wardrobe').length === nonRetired, `default category shows all non-retired items (${nonRetired})`);
assert(role('wardrobe', 'count').textContent === `${nonRetired} 件`, 'item count label');
click($('[data-ib="wardrobe"] [data-cat="bottom"]'));
assert(cards('wardrobe').length === S.items.filter(i => i.category === 'bottom' && i.status !== 'retired').length, 'category chip filters the grid');
click($('[data-ib="wardrobe"] [data-cat="all"]'));

click(role('wardrobe', 'search'));
assert(!role('wardrobe', 'search-row').classList.contains('is-hidden'), 'search icon opens the search row');
typeInto(role('wardrobe', 'search-input'), '590');
assert(cards('wardrobe').length > 0 && cards('wardrobe').length < nonRetired, 'search narrows the grid');
click(role('wardrobe', 'search-clear'));
assert(cards('wardrobe').length === nonRetired && role('wardrobe', 'search-row').classList.contains('is-hidden'), 'cancel clears search and closes the row');
typeInto(role('wardrobe', 'search-input'), 'zzzz-no-such-item');
assert(role('wardrobe', 'empty').textContent === '沒有符合的單品' && !role('wardrobe', 'empty').hidden, 'empty search shows a helpful message');
click(role('wardrobe', 'search-clear'));

/* select mode */
click(role('wardrobe', 'select-toggle'));
assert(!role('wardrobe', 'select-bar').classList.contains('is-hidden'), 'select mode shows the action bar');
assert($('#btnAddItem').classList.contains('is-hidden'), 'select mode hides the add FAB (onSelectModeChange hook)');
click(role('wardrobe', 'select-action')); // retire with nothing selected
assert(activeSheet() !== 'modal-confirm', 'action with nothing selected does not open a confirm');
click(role('wardrobe', 'select-all'));
assert(role('wardrobe', 'select-count').textContent === `已選 ${nonRetired} 件`, 'select-all selects everything visible');
click($('[data-ib="wardrobe"] [data-cat="hat"]'));
const hatCount = S.items.filter(i => i.category === 'hat' && i.status !== 'retired').length;
assert(role('wardrobe', 'select-count').textContent === `已選 ${hatCount} 件`, 'selection is pruned to what is visible (batch actions can never touch hidden items)');
click(role('wardrobe', 'select-action'));
assert(activeSheet() === 'modal-confirm', 'retire action asks for confirmation');
const confirmBtns = $$('#confirmActions button');
click(confirmBtns[confirmBtns.length - 1]);
assert(S.items.filter(i => i.category === 'hat' && i.status !== 'retired').length === 0, 'confirmed batch retire actually retires the selected items');
assert(role('wardrobe', 'select-bar').classList.contains('is-hidden'), 'select mode exits after the action');
click($('[data-ib="wardrobe"] [data-cat="all"]'));

/* custom category delete lives in the footer */
S.customCategories.push({ id: 'custom-t', label: '測試' });
S.items.push(mkItem({ id: 'ct1', name: '自訂', category: 'custom-t' }));
B.wardrobe.render();
click($('[data-ib="wardrobe"] [data-cat="custom-t"]'));
const delBtn = $$('[data-ib="wardrobe"] .btn-danger').find(b => b.textContent === '刪除此分類');
assert(!!delBtn, 'custom category shows a delete button at the bottom of its list');
click(delBtn);
const cb2 = $$('#confirmActions button');
click(cb2[cb2.length - 1]);
assert(!S.customCategories.some(c => c.id === 'custom-t') && window.findItem('ct1').category === 'accessory', 'deleting a category (after confirm) moves its items to accessory');
assert(B.wardrobe.state.cat === 'all', 'browser falls back to the all-items view');

/* ================= try-on picker ================= */
console.log('\n# try-on browser');
window.openTryonPicker('top');
assert(activeSheet() === 'modal-tryon', 'try-on picker opens');
assert(role('tryon', 'categories').classList.contains('is-hidden'), 'single-slot picker has no category bar');
assert(cards('tryon').every(c => true) && cards('tryon').length === S.items.filter(i => i.category === 'top' && i.status !== 'dirty' && i.status !== 'retired').length, 'only wearable tops are listed');
typeInto(role('tryon', 'search-input'), '白');
click(role('tryon', 'search')); // search row must be openable too
click(role('tryon', 'search-clear'));
const topsBefore = cards('tryon').length;
click(role('tryon', 'filter'));
assert(activeSheet() === 'modal-filter', 'filter sheet opens from the picker');
click($('#filterStatusChips [data-status="resting"]'));
assert(cards('tryon').length <= topsBefore, 'status filter applies live to the picker behind the sheet');
click($('#btnFilterClear'));
assert(cards('tryon').length === topsBefore, 'clear filters restores the picker');
click($('#btnFilterApply'));
assert(activeSheet() === 'modal-tryon', 'closing the filter RETURNS to the picker (modal stack), not to nothing');
const firstTop = cards('tryon')[0];
click(firstTop);
assert(!$('#modal-item').classList.contains('is-active'), 'tapping a card in the picker does not also open item detail');
assert(!doc.getElementById('modalOverlay').classList.contains('is-open'), 'tapping a card selects it and closes the picker');
assert(!!S.today.top, 'the tapped item became today’s top');

window.openExtrasPicker();
assert(!role('tryon', 'categories').classList.contains('is-hidden') && $$('[data-ib="tryon"] [data-role="categories"] .chip').length === 2, 'extras picker shows an outer/accessory switcher');
click($('[data-ib="tryon"] [data-cat="accessory"]'));
assert(cards('tryon').every(c => true) && B.tryon.state.cat === 'accessory', 'switching category re-queries the same browser');
window.forceCloseModal();

/* ================= rack overview ================= */
console.log('\n# rack browser');
S.items.slice(0, 3).forEach(i => { i.status = 'resting'; });
window.renderAll();
click($('#card-rack'));
assert(activeSheet() === 'modal-rack-overview', 'clicking the rack card opens the overview');
assert(cards('rack').length === S.items.filter(i => i.status === 'resting').length, 'overview lists every resting item (not just the first 8)');
window.forceCloseModal();

/* ================= rank ================= */
console.log('\n# rank browser');
S.items.forEach(i => { i.totalWearCount = 0; });
S.items[0].totalWearCount = 3; S.items[1].totalWearCount = 8; S.items[2].totalWearCount = 5;
window.renderAll();
const rankCards = cards('rank');
assert(rankCards.length === 3, 'only items that have been worn are ranked');
assert($('.rank-badge', rankCards[0]).textContent === '#1' && rankCards[0].textContent.includes('穿過 8 次'), 'ranked by total wears with #1 badge');
B.rank.state.sort = 'name'; B.rank.render();
assert(!$('.rank-badge', cards('rank')[0]), 'rank badges only appear while sorted by total wears');

if (errors.length) { console.error('Runtime errors:', errors); process.exit(1); }
console.log(`\nALL ${passed} CHECKS PASSED`);
process.exit(0);
