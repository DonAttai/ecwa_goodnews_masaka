/* ECWA Goodnews PWA service worker. Bump VERSION to force client updates. */
const VERSION = "v3";
const SHELL_CACHE = `shell-${VERSION}`;
const PAGES_CACHE = `pages-${VERSION}`;
const IMAGES_CACHE = `images-${VERSION}`;

const PRECACHE = ["/", "/offline", "/icons/icon-192.png", "/icons/icon-512.png"];

const isSameOrigin = (url) => url.origin === self.location.origin;
const isStaticAsset = (pathname) =>
  pathname.startsWith("/_next/static/") ||
  pathname.startsWith("/icons/") ||
  pathname.startsWith("/images/") ||
  /\.(png|jpe?g|webp|avif|svg|ico|woff2?)$/i.test(pathname);

const isAppRoute = (pathname) =>
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/login") ||
  pathname.startsWith("/forgot-password") ||
  pathname.startsWith("/reset-password") ||
  pathname.startsWith("/set-password") ||
  pathname.startsWith("/api/");

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const keep = new Set([SHELL_CACHE, PAGES_CACHE, IMAGES_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

async function offlineFallback() {
  const cached = await caches.match("/offline");
  if (cached) return cached;
  return new Response("You are offline.", {
    status: 503,
    headers: { "Content-Type": "text/plain" },
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (!isSameOrigin(url)) return;

  // App + API traffic: network first, never serve stale data.
  if (isAppRoute(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((res) => res)
        .catch(async () =>
          request.mode === "navigate" ? offlineFallback() : Response.error()
        )
    );
    return;
  }

  // Static assets: cache first (immutable, hashed by Next).
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ??
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(IMAGES_CACHE).then((c) => c.put(request, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  // Public pages: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES_CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => (request.mode === "navigate" ? offlineFallback() : hit));
      return hit ?? network;
    })
  );
});

// Web push: show the notification…
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }
  const title = data.title ?? "ECWA Goodnews";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body ?? "You have a new update.",
      icon: data.icon ?? "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: data.tag,
      data: { url: data.url ?? "/dashboard" },
    })
  );
});

// …and deep-link on tap.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/dashboard";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windows) => {
        for (const w of windows) {
          if (new URL(w.url).pathname === new URL(url, self.location.origin).pathname) {
            return w.focus();
          }
        }
        return self.clients.openWindow(url);
      })
  );
});
