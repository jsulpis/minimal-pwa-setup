const CACHE_NAME = "cache-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles/style.css",
  "./scripts/install.js",
  "./manifest.json",
  "./images/icons/lightning-icon-16x16.png",
  "./images/icons/lightning-icon-32x32.png",
  "./images/icons/lightning-icon-128x128.png",
  "./images/icons/lightning-icon-512x512.png",
  "./images/lighthouse-score.png",
];

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

// Interceptor for all network requests
self.addEventListener("fetch", async (evt) => {
  const request = evt.request;
  console.log("[ServiceWorker]: Intercepting request to ", request.url);

  // Using the cache-first strategy for simplicity.
  // You might want to consider other strategies such as stale-while-revalidate (see https://web.dev/stale-while-revalidate/)
  evt.respondWith(cacheFirst(request));
});

// Returns the cached response if available, or get the response from the network
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  cachedResponse = await cache.match(request);
  if (!!cachedResponse) {
    console.log(
      `[ServiceWorker]: Found the response for ${request.url} in the cache.`
    );
    return cachedResponse;
  }

  console.log(
    `[ServiceWorker]: Fetching the response for ${request.url} from the network.`
  );
  return fetch(request);
}
