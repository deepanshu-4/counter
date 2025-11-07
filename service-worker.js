const CACHE_NAME = "react-app-dynamic-cache-v2";

// INSTALL event – pre-cache the main shell files
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/favicon.ico",
        "/logo192.png",
        "/logo512.png",
        "images/IMG_0.jpg",
        "images/IMG_1.jpg",
        "images/IMG_2.jpg",
        "images/IMG_3.jpg",
        "images/IMG_4.jpg",
        "images/IMG_5.jpg",
      ]);
    })
  );
  self.skipWaiting();
});

// ACTIVATE event – clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// FETCH event – cache dynamically as files are requested
self.addEventListener("fetch", (event) => {
  // Ignore non-GET requests (like POST to APIs)
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Serve from cache if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // If not a valid response, skip caching
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Clone and cache the response
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          // Offline fallback for navigation requests (React Router)
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
