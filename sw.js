const CACHE_NAME = 'cgt-nomina-v4-secure';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png'
];

// Instalación: Forzar que el nuevo código tome el control inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación: Limpiar cachés viejas y tomar control de las pestañas
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});