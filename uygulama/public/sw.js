// Basit önbellek: uygulama kabuğu çevrimdışı açılabilsin. Veri her zaman Firebase'den canlı gelir.
const CACHE = 'ges-robotu-v1';
const FILES = ['./', './index.html', './styles.css', './app.js', './firebase-config.js', './manifest.json', './icons/icon-192.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
