// Trading Journal by Tanzanite Capital — push notification service worker
// Must be served from the same origin/path as index.html (e.g. the repo root),
// so its scope covers the whole app.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let payload = { title: "Price alert", body: "Price is near one of your watched entries.", url: "./" };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch (e) {
    // ignore malformed payloads, fall back to defaults
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "icon-192.png",
      badge: "icon-192.png",
      data: { url: payload.url || "./" },
      tag: payload.tag || "price-alert",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "./";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
