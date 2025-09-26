const CACHE = 'rv-pos-cache-v2';

const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : Promise.resolve())))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    event.respondWith(
        caches.match(req).then(hit => hit || fetch(req).then(res => {
            if (req.method === 'GET' && new URL(req.url).origin === location.origin) {
                const copy = res.clone();
                caches.open(CACHE).then(c => c.put(req, copy));
            }
            return res;
        }).catch(() => caches.match('./index.html')))
    );
});