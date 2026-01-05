const CACHE = 'copilot-user-group-nav-v1';
const OFFLINE_INDEX = '/index.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.add(OFFLINE_INDEX) // Cache index.html for offline fallback
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // 🚫 Never touch external origins (Copilot Studio untouched)
  if (url.origin !== self.location.origin) return;

  // ✅ Navigation: network-first, offline fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() =>
        caches.open(CACHE).then(cache =>
          cache.match(OFFLINE_INDEX)
        )
      )
    );
    return;
  }

  // 🚫 Never cache HTML documents
  if (req.headers.get('accept')?.includes('text/html')) return;

  // ✅ Static assets only
  if (url.pathname.match(/\.(css|js|png|jpg|svg|webp|woff2)$/)) {
    event.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(req).then(cached =>
          cached ||
          fetch(req).then(res => {
            cache.put(req, res.clone());
            return res;
          })
        )
      )
    );
  }
});
