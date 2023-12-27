self.addEventListener("install", async (e) => {
  console.log("service worker installed");

  var cache = await caches.open("staticFlixplay");
  cache.addAll([
    "./", 
    "./index.html", 
    "./favoritos.html", 
    "./faqs.html",
    "./styles/style.css", 
    "./app.js",
    "./manifest.json",
    "./imgs/Flixplay.png",
    "./imgs/corazon.svg",
    "./imgs/cruz.svg",
    "./imgs/fecha.svg",
    "./imgs/estrella.svg",
    "./imgs/Flixplay.svg",
    "./imgs/logo-16.png",
    "./imgs/logo-144.png",
    "./imgs/logo.ico",
    "./imgs/lupa.svg",
    "./imgs/play.svg",
    "./imgs/menu.svg",
    "./imgs/reloj.svg",
  ]);
});

self.addEventListener("activate", () => {
  console.log("service worker activated");
});

self.addEventListener("fetch", function (event) {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  return (await caches.match(req)) || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open("staticFlixplay");
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    const cachedResponse = await cache.match(req);
    return cachedResponse || (await caches.match("./manifest.json"));
  }
}
