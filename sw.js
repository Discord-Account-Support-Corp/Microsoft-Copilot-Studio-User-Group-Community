// sw.js — Safe, minimal service worker for your PWA shell

const CACHE_NAME = 'copilot-studio-shell-v1';
const SHELL_FILES = [
  '/',                  // index.html
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install – cache local PWA shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

// Activate – remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch – serve cached shell, fallback to network for everything else
self.addEventListener('fetch', event => {
  const request = event.request;

  // NEVER try to cache the external user group URL
  if (request.url.startsWith('https://techcommunity.microsoft.com/')) return;

  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request).catch(() => caches.match('/index.html'));
    })
  );
});
