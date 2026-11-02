const CACHE_NAME = "shadow-system-09-fixed-shell-v1";
const SHELL = [
  "./Shadow_System_v09_fixed.html",
  "./Shadow_System_v09_fixed.webmanifest",
  "./shadow-system-icon-192.png",
  "./shadow-system-icon-512.png",
  "./shadow-system-icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith("shadow-system-09-fixed-shell-") && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request);
    }).catch(() => {
      if (request.mode === "navigate") return caches.match("./Shadow_System_v09_fixed.html");
      return Response.error();
    })
  );
});
