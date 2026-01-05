const CACHE = 'copilot-user-group-nav-v1';
const OFFLINE_INDEX = '/index.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.add(OFFLINE_INDEX) // only offline fallback
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => self.clients.claim());

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Never touch external origins
  if (url.origin !== self.location.origin) return;

  // Network-first navigation fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() =>
        caches.open(CACHE).then(cache => cache.match(OFFLINE_INDEX))
      )
    );
    return;
  }

  // Only cache static assets (CSS, JS, images)
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
