const CACHE_NAME = 'math-compass-v4.0.0';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './assets/interactive-learning-forum-logo.png',
  './assets/avatars/avatar-01.svg',
  './assets/avatars/avatar-02.svg',
  './assets/avatars/avatar-03.svg',
  './assets/avatars/avatar-04.svg',
  './assets/avatars/avatar-05.svg',
  './assets/avatars/avatar-06.svg',
  './assets/avatars/avatar-07.svg',
  './assets/avatars/avatar-08.svg',
  './assets/avatars/avatar-09.svg',
  './assets/avatars/avatar-10.svg',
  './assets/avatars/avatar-11.svg',
  './assets/avatars/avatar-12.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
