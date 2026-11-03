const CACHE = "smart-classroom-v2";
const ASSETS = ["./", "./index.html", "./style.css", "./app.js", "./manifest.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const r=e.request; if(r.method!=="GET") return;
  const u=new URL(r.url); if(u.origin!==self.location.origin) return;
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(cache=>cache.put(r,c));}return res;}).catch(()=>caches.match("./index.html"))));
});