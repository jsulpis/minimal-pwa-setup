const CACHE_NAME = "cache-v1";

const FILES_TO_CACHE = ["/", "/index.html", "/styles/style.css"];

self.addEventListener("install", async () => {
  console.log("[ServiceWorker]: Install");
  const cache = await caches.open(CACHE_NAME);

  console.log("[ServiceWorker]: Adding static files to the cache");
  await cache.addAll(FILES_TO_CACHE);

  self.skipWaiting(); // move into the activate phase
});

self.addEventListener("activate", async () => {
  console.log("[ServiceWorker]: Activate");

  // Remove previous cached data from disk if the cache name changed
  const keyList = await caches.keys();
  await Promise.all(
    keyList.map((key) => {
      if (key !== CACHE_NAME) {
        console.log("[ServiceWorker]: Removing old cache", key);
        return caches.delete(key);
      }
    })
  );
  self.clients.claim();
});
