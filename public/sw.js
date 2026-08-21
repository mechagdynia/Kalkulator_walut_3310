const CACHE = 'waluta-3310-v3';
const FLAG_CODES = ['ae', 'af', 'al', 'am', 'ao', 'ar', 'au', 'aw', 'az', 'ba', 'bb', 'bd', 'bg', 'bh', 'bi', 'bn', 'bo', 'br', 'bs', 'bw', 'by', 'bz', 'ca', 'cd', 'ch', 'cl', 'cn', 'co', 'cr', 'cu', 'cv', 'cw', 'cz', 'dj', 'dk', 'do', 'dz', 'eg', 'er', 'et', 'eu', 'fj', 'gb', 'ge', 'gh', 'gi', 'gm', 'gn', 'gt', 'gy', 'hk', 'hn', 'ht', 'hu', 'id', 'il', 'in', 'iq', 'ir', 'is', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'km', 'kr', 'kw', 'kz', 'la', 'lb', 'lk', 'lr', 'ls', 'ly', 'ma', 'md', 'mg', 'mk', 'mm', 'mn', 'mo', 'mr', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'ng', 'ni', 'no', 'np', 'nz', 'om', 'pa', 'pe', 'pg', 'ph', 'pk', 'pl', 'py', 'qa', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sl', 'so', 'sr', 'ss', 'st', 'sv', 'sy', 'sz', 'th', 'tj', 'tm', 'tn', 'to', 'tr', 'tt', 'tw', 'tz', 'ua', 'ug', 'un', 'us', 'uy', 'uz', 've', 'vn', 'vu', 'ws', 'ye', 'za', 'zm', 'zw'];
const SHELL = ['./', './index.html', './manifest.webmanifest', './manifest.pl.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', ...FLAG_CODES.map((code) => `./flags/${code}.svg`)];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).pathname.startsWith('/api/')) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && response.type === 'basic') caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
  );
});
