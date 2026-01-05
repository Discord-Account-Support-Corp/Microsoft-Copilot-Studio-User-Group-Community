const CACHE_NAME = 'copilot-studio-pwa-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install: cache only local files
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
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: ONLY handle same-origin requests
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ❗ Never touch Microsoft Tech Community
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
