// Имя кэша
const CACHE_NAME = 'stories-off-cache-v1';
// Файлы для кэширования
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx', // Добавьте сюда пути к вашим основным файлам
  // Добавьте другие ресурсы, которые нужно кэшировать (CSS, JS, изображения, шрифты)
];

// Установка Service Worker и кэширование статических файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Перехват запросов и отдача из кэша или сети
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если ресурс найден в кэше, отдаем его
        if (response) {
          return response;
        }
        // Иначе, запрашиваем из сети
        return fetch(event.request);
      })
  );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Удаляем старые кэши
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
