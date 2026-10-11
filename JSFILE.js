const CACHE_NAME = 'audit-sanitair-v3';
const urlsToCache = [
  './INTERFACE',
  './JSONFILE',
  './JSFILE',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install Service worker dan simpan file di Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate Service Worker dan Hapus Cache Lama agar memori tidak menumpuk
self.addEventListener('activate', event => {
  const cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheAllowlist.includes(cacheName)) {
            console.log('Menghapus cache versi lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Menangkap request saat internet offline dan melayani dari Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, berikan dari cache. Jika tidak, minta dari jaringan.
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback untuk menjaga PWA tidak error saat offline total dan URL tidak tercache
        if (event.request.mode === 'navigate') {
            return caches.match('./INTERFACE');
        }
      })
  );
});