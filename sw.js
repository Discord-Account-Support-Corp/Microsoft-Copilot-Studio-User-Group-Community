self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('pwa-cache').then(cache => cache.addAll([
      '/index.html',
      '/icons/placeholder.png'
    ]))
  );
});

self.addEventListener('fetch', e => {
  // Only handle requests to your own site
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
  // External requests (like Microsoft Tech Community) are ignored
});
