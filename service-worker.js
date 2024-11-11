const CACHE_NAME = 'my-site-cache-v1';
const assets = [
  "/Sri-Portofolio/",
  "/Sri-Portofolio/index.html",
  "/Sri-Portofolio/style.css",
  "/Sri-Portofolio/script.js",
  "/Sri-Portofolio/manifest.json",
  "/Sri-Portofolio/icon-192x192.png",
  "/Sri-Portofolio/image.jpeg",
  "/Sri-Portofolio/certificate 1.png",
  "/Sri-Portofolio/certificate 2.png",
  "/Sri-Portofolio/certificate 3.png"
];

// Install Service Worker dan caching file-file yang penting
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(assets).catch(function(error) {
          console.error('Failed to cache some assets: ', error);
        });
      })
  );
});

// Aktivasi Service Worker - Menghapus cache lama
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Menangani permintaan fetch dan mengembalikan cache jika ada
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Jika resource ada di cache, kembalikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, lakukan fetch ke network
        return fetch(event.request).catch(function(error) {
          console.error('Failed to fetch from network: ', error);
          return new Response('Resource tidak tersedia', { status: 404 });
        });
      })
  );
});

// Menangani pesan untuk menampilkan notifikasi
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const title = 'Hallo!';
    const options = {
      body: 'Selamat Datang di Web Portfolio Tuti. Terima kasih telah mengunjungi!',
      icon: '/Sri-Portofolio/icon-192x192.png'
    };

    if (Notification.permission === 'granted') {
      self.registration.showNotification(title, options);
    } else {
      console.error('Izin notifikasi belum diberikan.');
    }
  }
});

// Menangani klik pada notifikasi
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Menutup notifikasi saat diklik
  event.waitUntil(
    clients.openWindow('https://srihastut.github.io/Sri-Portofolio/') // URL yang akan dibuka saat notifikasi diklik
  );
});
