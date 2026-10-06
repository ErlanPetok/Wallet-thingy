// service-worker.js — Hoshino's Daily offline cache
const CACHE_NAME = 'hoshino-daily-v1';

// Assets to cache on install (adjust paths to match your files)
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    // Sprites
    './expression/normal.png',
    './expression/squished.png',
    './expression/sleepy.png',
    './expression/happy.png',
    './expression/joking.png',
    './expression/surprised.png',
    './expression/embarrassed.png',
    // Backgrounds
    './background/together.jpg',
    './background/together2.jpg',
    './background/abydos.jpg',
    './background/Committee_Room_Day.jpg',
    './background/BG_CommitteeRoom_Sunset.jpg',
    './background/Committee_Room_Night_1.jpg',
    './background/Committee_Room_Night_2.jpg',
    './background/BG_AbydosCouncilRoom.jpg',
    // Audio
    './audio/bgm_morning.mp3',
    './audio/bgm_noon.mp3',
    './audio/bgm_afternoon.mp3',
    './audio/bgm_night.mp3',
    './audio/bgm_latenight.mp3',
    './audio/login_greeting.mp3',
    './audio/squish.mp3'
];

// Install: pre-cache everything
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Use individual adds so one missing file doesn't break the whole install
                return Promise.all(
                    PRECACHE_ASSETS.map(url =>
                        cache.add(url).catch(err => console.warn('Failed to cache:', url, err))
                    )
                );
            })
            .then(() => self.skipWaiting())
    );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: cache-first for same-origin, network-fallback
self.addEventListener('fetch', event => {
    const req = event.request;

    // Only handle GET
    if (req.method !== 'GET') return;

    // Only cache same-origin
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(req).then(cached => {
            if (cached) return cached;
            return fetch(req).then(response => {
                // Cache successful responses for next time
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
                }
                return response;
            }).catch(() => {
                // Offline fallback for navigation requests
                if (req.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});