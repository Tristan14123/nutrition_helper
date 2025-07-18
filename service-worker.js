const CACHE_NAME = "nutrition-helper-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/recette.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "https://cdn.tailwindcss.com",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
