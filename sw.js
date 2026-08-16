/* Kasa — obsługa pracy bez internetu.

   Pliki aplikacji trzymamy na telefonie, więc otwiera się natychmiast
   i działa w sklepie bez zasięgu. Same dane budżetu synchronizuje
   Firebase (ma własną pamięć podręczną) — tego pliku to nie dotyczy. */

const CACHE = "kasa-v1";

const PLIKI = [
  "./",
  "./index.html",
  "./konfiguracja.js",
  "./manifest.webmanifest",
  "./ikona-192.png",
  "./ikona-512.png",
  "./ikona-maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(PLIKI.map((p) => c.add(p))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((klucze) => Promise.all(klucze.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Ruch do Firebase i skrypty Google zawsze prosto z sieci —
  // nigdy z pamięci podręcznej, żeby nie serwować starych danych.
  if (e.request.method !== "GET" ||
      /firestore|googleapis|gstatic|firebaseio|identitytoolkit/.test(url.host)) {
    return;
  }

  // Strona główna: najpierw sieć (żeby podbić wersję), w razie czego z pamięci.
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((o) => {
          const kopia = o.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", kopia));
          return o;
        })
        .catch(() => caches.match("./index.html").then((o) => o || caches.match("./")))
    );
    return;
  }

  // Reszta: najpierw pamięć, w tle odświeżenie.
  e.respondWith(
    caches.match(e.request).then((zPamieci) => {
      const zSieci = fetch(e.request)
        .then((o) => {
          if (o && o.status === 200 && o.type === "basic") {
            const kopia = o.clone();
            caches.open(CACHE).then((c) => c.put(e.request, kopia));
          }
          return o;
        })
        .catch(() => zPamieci);
      return zPamieci || zSieci;
    })
  );
});
