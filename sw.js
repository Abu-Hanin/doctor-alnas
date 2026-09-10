const CACHE_NAME = 'doctor-alnas-v1';
const urlsToCache = ['./', './index.html', './icon-512.png', './manifest.json'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(c => Promise.all(urlsToCache.map(u => c.add(u).catch(() => {})))));
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(caches.keys().then(names => Promise.all(names.map(n => n !== CACHE_NAME ? caches.delete(n) : null))));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(r => {
        if (r && r.status === 200) {
          const c = r.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, c));
        }
        return r;
      })
      .catch(() => caches.match(event.request))
  );
});
