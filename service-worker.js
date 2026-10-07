// service-worker.js — Hoshino's Daily offline cache
const CACHE_NAME = 'hoshino-daily-v1';

const PRECACHE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './expression/normal.png',
    './expression/squished.png',
    './expression/sleepy.png',
    './expression/happy.png',
    './expression/joking.png',
    './expression/surprised.png',
    './expression/embarrassed.png',
    './background/together.jpg',
    './background/together2.jpg',
    './background/abydos.jpg',
    './background/Committee_Room_Day.jpg',
    './background/BG_CommitteeRoom_Sunset.jpg',
    './background/Committee_Room_Night_1.jpg',
    './background/Committee_Room_Night_2.jpg',
    './background/BG_AbydosCouncilRoom.jpg',
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
                return Promise.all(
                    PRECACHE_ASSETS.map(url =>
                        cache.add(url).catch(err => console.warn('Failed to cache:', url, err))
                    )
                );
            })
    );
});

// Listen for SKIP_WAITING message from the app
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
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

// Fetch: network-first for HTML, cache-first for everything else
self.addEventListener('fetch', event => {
    const req = event.request;

    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;

    // HTML: network-first, cache as fallback
    if (req.mode === 'navigate' || req.destination === 'document') {
        event.respondWith(
            fetch(req)
                .then(response => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(req).then(cached => cached || caches.match('./index.html'));
                })
        );
        return;
    }

    // Everything else: cache-first
    event.respondWith(
        caches.match(req).then(cached => {
            if (cached) return cached;
            return fetch(req).then(response => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
                }
                return response;
            });
        })
    );
});

// Push notifications (ready for future use)
self.addEventListener('push', event => {
    let data = { title: "Hoshino's Daily", body: "Reminder~ 🐋" };
    try {
        data = event.data.json();
    } catch (e) {}

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || './icon-192.png',
            badge: data.badge || './icon-192.png'
        })
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            for (const client of clientList) {
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});