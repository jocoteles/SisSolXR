// sw.js
const CACHE_NAME = 'sissolxr-assets-cache-v1.1'; // Mude a versão se atualizar os assets
const urlsToCache = [
  // Arquivos principais
  '/index.html', // Ou '/' se seu servidor mapeia / para index.html

  // Scripts A-Frame e de configuração
  '/aframe/aframe-locals.js',
  '/aframe/info-message.js',
  '/aframe/color-change.js',
  '/aframe/button.js',
  '/aframe/menu.js',
  '/aframe/pressable.js',
  '/aframe/event-manager.js',
  '/aframe/message.html',
  '/config/orbitais.js',

  // Assets - Imagens
  '/assets/sol.jpg',
  '/assets/mercurio.png',
  '/assets/venus.jpg',
  '/assets/terra.jpg',
  '/assets/marte.jpg',
  '/assets/jupiter.jpg',
  '/assets/saturno.jpg',
  '/assets/aneis_saturno.png',
  '/assets/urano.jpg',
  '/assets/netuno.jpg',

  // Assets - Áudio
  '/assets/space.wav',
  '/assets/sun.wav',

  // Ícones Favicon para cache
  '/assets/icon-192x192.png',
  '/assets/icon-32x32.png',
  '/assets/icon-16x16.png'
  
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Adiciona todos os URLs definidos, mas não falha se algum individualmente falhar
        const promises = urlsToCache.map(url => {
            return cache.add(url).catch(err => {
                console.warn(`[SW] Failed to cache ${url}:`, err.message);
            });
        });
        return Promise.all(promises);
      })
      .then(() => self.skipWaiting())
  );
});

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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('/socket.io/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Servir do cache
        }
        return fetch(event.request); // Buscar na rede se não estiver no cache
      })
  );
});