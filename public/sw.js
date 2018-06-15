importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

  workbox.routing.registerRoute(
    // Cache CSS files
    /\.(?:js|css)$/,
    workbox.strategies.cacheFirst({
      // Use a custom cache name
      cacheName: 'static-resources',
      cacheableResponse: {statuses: [0,200]}
    }),
  );
  
  workbox.routing.registerRoute(
    // Cache image files
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    // Use the cache if it's available
    workbox.strategies.cacheFirst({
      // Use a custom cache name
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.Plugin({
          // Cache for a maximum of a month
          maxAgeSeconds: 4 * 7 * 24 * 60 * 60,
        })
      ],
    })
  );

  self.addEventListener('fetch', event => {
    if(event.request.mode === 'navigate' ||
      (event.request.method === 'GET' &&
      event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
          fetch(event.request).catch(error => {
            return caches.match('offline.html');
          })
        );
      }
  });
