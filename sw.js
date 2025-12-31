// Service worker for PWA functionality

const CACHE_NAME = 'open-deck-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/logo.svg',
  '/manifest.json',
  '/offline.html',
  // Add all CSS and JS dependencies
  'https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap',
  'https://cdn.tailwindcss.com'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached files when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests for now
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request).catch(() => {
          // If fetch fails, return a fallback page
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});