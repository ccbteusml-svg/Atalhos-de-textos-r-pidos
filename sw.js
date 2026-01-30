self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('quicktext-store').then((cache) => cache.addAll([
      './',
      './index.html',
      './style.css',  // <--- O erro estava aqui (estava .js)
      './app.js'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
