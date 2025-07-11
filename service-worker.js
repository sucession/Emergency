// Cambia la versión de la caché para forzar la actualización.
const CACHE_NAME = 'aes-256-app-v4'; // nota: v4 para reflejar el cambio

// Lista de archivos que se guardarán en la caché, incluyendo fuentes e íconos.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './favicon-32x32.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto+Mono&display=swap'
];

// Evento de instalación: se dispara cuando el navegador instala el service worker.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta');
        // Es importante no fallar si alguna de las fuentes no se puede cachear.
        const cachePromises = urlsToCache.map(urlToCache => {
          return fetch(urlToCache).then(response => {
            if (response.ok) {
              return cache.put(urlToCache, response);
            }
            return Promise.resolve(); // Ignora errores de red para las fuentes
          }).catch(err => {
            console.warn(`No se pudo cachear ${urlToCache}:`, err);
          });
        });
        return Promise.all(cachePromises);
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
  const requestURL = new URL(event.request.url);

  // Estrategia "Cache First" para las fuentes de Google
  if (requestURL.origin === 'https://fonts.googleapis.com' || requestURL.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          // Si está en caché, la devuelve. Si no, la busca y la guarda.
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return; // Termina la ejecución para la lógica de las fuentes.
  }

  // Estrategia "Stale-While-Revalidate" para los recursos de la app.
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      });
    })
  );
});
