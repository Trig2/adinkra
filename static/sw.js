const CACHE_NAME = "adinkra-learning-v5";
const urlsToCache = [
  "/",
  "/static/js/app.js",
  "/static/manifest.json",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching app shell");
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache:", error);
      });
    }),
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  // Claim clients immediately
  return self.clients.claim();
});

// Fetch Strategy: Network First, Fallback to Cache
self.addEventListener("fetch", (event) => {
  // Skip caching for external resources (CDNs)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();

        // Cache the fetched response for future use
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }

          // If not in cache, return offline page or error
          return new Response("Offline - Content not available", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });
        });
      }),
  );
});
