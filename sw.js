const CACHE_NAME = 'copilot-studio-pwa-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install: cache core app shell
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

// Fetch: safety rails added
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // ❗ Never touch external sites (Microsoft Tech Community, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // ✅ SAFETY RAIL #1:
  // Always serve index.html for navigation requests
  // (prevents blank screens & stuck loading bars)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html')
        .then(response => response || fetch(request))
    );
    return;
  }

  // ✅ SAFETY RAIL #2:
  // Cache-first for all other same-origin requests
  // Network fallback prevents frozen loads
  event.respondWith(
    caches.match(request)
      .then(response => response || fetch(request))
  );
});
