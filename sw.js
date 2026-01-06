const CACHE_NAME = 'copilot-studio-pwa-v3';

const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json'
];

// Install: cache local app shell only
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for same-origin, offline fallback
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 🚫 Never touch external domains (critical)
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Update cache silently
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(
          response => response || caches.match('/offline.html')
        )
      )
  );
});
