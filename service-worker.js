// Har baar jab aap bada change karein, v2 ko v3 kar sakti hain, 
// lekin skipWaiting ki wajah se ab ye auto-update hoga.
const CACHE_NAME = 'tictactoe-v2'; 
const assets = [
  './',
  './index.html',
  './manifest.json',
  // Agar aapke paas icon file ka naam alag hai (jaise icon-192.png), toh yahan wahi likhein
  './icon.png' 
];

// Install event - Naye version ko download karna
self.addEventListener('install', e => {
  // FORCE UPDATE: Naye service worker ko wait karne se rokta hai
  self.skipWaiting(); 
  
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(assets);
    })
  );
});

// Activate event - Purana cache saaf karna
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => {
      // Turant saare open tabs ka control le lena
      return self.clients.claim();
    })
  );
});

// Fetch event - Offline support ke liye
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});