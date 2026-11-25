// Online-first ARK Tribe HQ: never serve a stale document pointing to deleted Vite assets.
// Previous releases cached HTML; stale asset references could cause a blank mobile PWA.
const OLD_CACHE_PREFIX='arktribehq-';
self.addEventListener('install',event=>{event.waitUntil(self.skipWaiting());});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(OLD_CACHE_PREFIX)).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
// No fetch handler: browser performs normal network requests and HTTP caching.
// Never cache /, /index.html, or JS/CSS bundles as an offline document fallback.
