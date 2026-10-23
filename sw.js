const CACHE_NAME = 'bursa-kerja-cache-v1';
const urlsToCache = [
  '/',
  '/search',
  '/p/offline.html' // Halaman fallback saat tidak ada internet
];

// Instalasi Service Worker & Caching Aset
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache berhasil dibuka');
        return cache.addAll(urlsToCache);
      })
  );
});

// Aktivasi & Pembersihan Cache Lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Strategi Fetch (Cache First, Network Fallback)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Gunakan versi cache jika ada
        }
        return fetch(event.request).catch(() => {
          // Tampilkan halaman offline jika internet putus dan data tidak di-cache
          if (event.request.mode === 'navigate') {
            return caches.match('/p/offline.html');
          }
        });
      })
  );
});