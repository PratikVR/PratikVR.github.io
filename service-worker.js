// Define the cache name and assets to cache
const cacheName = 'portfolio-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/index.css',
  '/main.js',
  '/images/bg_img.jpeg',
  '/images/icons/icon-72.svg',
  '/images/icons/icon-192.svg',
  '/images/icons/icon-512.svg',
  // Add more assets as needed
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== cacheName) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached assets if available, otherwise fetch from the network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
