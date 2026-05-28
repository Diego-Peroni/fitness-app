const CACHE_NAME = 'fitness-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/app.css',
  '/js/app.js',
  '/js/utils/storage.js',
  '/js/utils/export.js',
  '/js/components/navbar.js',
  '/js/components/chart.js',
  '/js/components/progress-bar.js',
  '/js/components/modal.js',
  '/js/pages/dashboard.js',
  '/js/pages/weight.js',
  '/js/pages/water.js',
  '/js/pages/diet.js',
  '/js/pages/workout.js',
  '/js/pages/performance.js',
  '/js/pages/recovery.js',
  '/js/pages/history.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
