"""Regenera el manifiesto de caché tras cambiar archivos de ejecución."""
from pathlib import Path
import hashlib,json
p=Path(__file__).resolve().parents[1]
archivos=['index.html','manifest.webmanifest']
for carpeta in ['css','js','data','assets','vendor']:
 archivos += [str(f.relative_to(p)) for f in (p/carpeta).rglob('*') if f.is_file()]
archivos=sorted(archivos);h=hashlib.sha256()
for f in archivos:h.update(f.encode());h.update((p/f).read_bytes())
version=h.hexdigest()[:16]
s="const VERSION="+json.dumps(version)+";\nconst ARCHIVOS="+json.dumps(['./'+f for f in archivos])+";\n"+'''
const PREFIJO='atlas-'+new URL(self.registration.scope).pathname+'-',CACHE=PREFIJO+VERSION;
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ARCHIVOS);})()));
self.addEventListener('message',event=>{if(event.data?.tipo==='ACTIVAR')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIJO)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==location.origin||!u.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);if(event.request.mode==='navigate'){try{return await fetch(event.request);}catch{return (await cache.match('./index.html'))||Response.error();}}
 const key=new Request(u.origin+u.pathname);const hit=await cache.match(key);return hit||fetch(event.request);})());});
'''
(p/'sw.js').write_text(s);print('Caché',version,len(archivos),'archivos')
