// Define un nombre y versión para la caché.
// Cambia el número de la versión (ej. 'v2') cuando actualices tus archivos.
const CACHE_NAME = 'aes-256-app-v1';

// Lista de archivos que se guardarán en la caché.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Evento de instalación: se dispara cuando el navegador instala el service worker.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de activación: se dispara cuando el service worker se activa.
// Aquí es donde se limpian las cachés antiguas.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si la caché no es la actual, se elimina.
          if (CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento fetch: se dispara cada vez que la página solicita un recurso.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en la caché, lo devuelve. Si no, lo busca en la red.
        return response || fetch(event.request);
      })
  );
});