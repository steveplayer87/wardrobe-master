// IMPORTANT for future updates: bump CACHE_NAME AND keep this ASSETS list's
// query-string versions in sync with the ones referenced in index.html
// (styles.css / seed-items.js / app.js). Mismatched versions just mean an
// extra network fetch on first load, not breakage — but keeping them in sync
// avoids stale duplicate entries piling up in the cache.
const CACHE_NAME = 'wardrobe-master-v100';
const ASSETS = [
  './',
  './index.html',
  './styles.css?v=20261023_100',
  './seed-items.js?v=20261023_100',
  './app.js?v=20261023_100',
  './manifest.json',
  './assets/weather/clear-day.svg',
  './assets/weather/clear-night.svg',
  './assets/weather/overcast.svg',
  './assets/weather/overcast-night.svg',
  './assets/weather/rain.svg',
  './assets/weather/partly-cloudy-night-rain.svg',
  './assets/weather/snow.svg',
  './assets/weather/partly-cloudy-night-snow.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/c-towel.jpg',
  './assets/c-towel-a.jpg',
  './assets/c-towel-b.jpg',
  './assets/c-sheets.jpg',
  './assets/c-toothbrush.jpg',
  './assets/c-razor.jpg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Network-first: always try to get the live version when online
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const isNavigate = event.request.mode === 'navigate' || event.request.url.endsWith('/') || event.request.url.includes('index.html');
  const fetchPromise = isNavigate ? fetch(event.request, { cache: 'no-store' }) : fetch(event.request);
  
  event.respondWith(
    fetchPromise
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
