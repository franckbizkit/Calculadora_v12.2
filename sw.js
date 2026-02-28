const CACHE_NAME = 'cgt-nomina-v4-secure';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/2654/2654416.png'
];

// Instalar el Service Worker y guardar los archivos iniciales en caché
self.addEventListener('install', event => {
  self.skipWaiting(); // FUERZA LA ACTUALIZACIÓN INMEDIATA DEL NUEVO CÓDIGO
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados exitosamente');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar las peticiones de red para que funcione sin conexión
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo de la caché si existe, o haz la petición a la red
        return response || fetch(event.request);
      })
  );
});

// Limpiar memorias caché antiguas cuando se actualiza la versión del Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // TOMA EL CONTROL DE LOS CLIENTES AL INSTANTE
  );
});