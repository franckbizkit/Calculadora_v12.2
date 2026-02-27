// Nombre del caché y versión (Cámbialo si haces actualizaciones grandes)
const CACHE_NAME = 'cgt-nomina-v1';

// Lista de archivos que la App guardará para funcionar sin internet
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'sw.js',
  'icono.png'
];

// Evento de Instalación: Se ejecuta la primera vez que el usuario abre la web
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Guardamos todos los archivos en el caché del navegador
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Evento de Activación: Limpia versiones antiguas del caché si existen
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

// Evento Fetch: Intercepta las peticiones para servir los archivos desde el caché
// Esto es lo que permite que la App cargue instantáneamente y funcione OFFLINE
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si el archivo está en el caché, lo devuelve; si no, intenta ir a internet
      return response || fetch(event.request);
    })
  );
});