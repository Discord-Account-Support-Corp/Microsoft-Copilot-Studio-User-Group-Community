const CACHE_NAME = 'copilot-studio-shell-v1';
const FILES_TO_CACHE = [
  '/',                // GitHub Pages root
  '/index.html',      // splash page
  '/manifest.json',   // PWA manifest
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: cache all local PWA shell files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: remove old caches
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

// Fetch: respond with cached resources first
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
