const URLBASE = 'https://me.nishiduka.dev/PWA-temperatura/';
const CACHE_NAME = 'temp-agora1';
const assets = [
  URLBASE,
  URLBASE + 'index.html',
  URLBASE + 'manifest.json',
  URLBASE + 'js/instalar.js',
  URLBASE + 'js/app.js',
  URLBASE + 'img/icon.icon',
  URLBASE + 'img/icon.png  ',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
