const CACHE='arktribehq-shell-crafting-v3';
const PRECACHE=['/','/manifest.webmanifest','/icons/arktribehq-192.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 // Live accounts, timers, API calls and advertisements must never be cached.
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(response=>{
   if(response.ok){const copy=response.clone();void caches.open(CACHE).then(cache=>cache.put('/',copy));}
   return response;
  }).catch(()=>caches.match('/')));
 }
});
