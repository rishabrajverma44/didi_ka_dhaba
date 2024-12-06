const CACHE_VERSION = "v2";
const CACHE_NAME = `PWA-${CACHE_VERSION}`;
const CACHE_ASSETS = [
  "https://cdn.jsdelivr.net/npm/tailwindcss@3.2.7/dist/tailwind.min.css",
  "/static/js/main.chunk.js",
  "/static/js/0.chunk.js",
  "/static/js/bundle.js",
  "/static/css/main.chunk.css",
  "/bootstrap.min.css",
  "/index.html",
  "/",
  "/images/logo.png",
  "/images/BG.png",
  "/images/avatar-1.jpg",
  "/images/img.jpg",
  "/images/m3m.png",
  "/images/sidbi.png",
  "/images/Ekta.png",
  "/images/jbf.jpg",
];

// Install Event
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        console.log("Caching files...");
        await cache.addAll(CACHE_ASSETS);
      } catch (error) {
        console.error("Failed to cache assets:", error);
      }
    })()
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Removing old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request);
        if (event.request.method === "GET" && networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        console.error(
          "Fetch failed, serving cached content if available:",
          error
        );
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }

        return new Response("Network error and no cache available.", {
          status: 503,
          statusText: "Service Unavailable",
        });
      }
    })()
  );
});
