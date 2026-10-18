from navegacion import abrir_modo
import os
URL=os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8000/atlas/")
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path(__file__).resolve().parent/'resultados';out.mkdir(exist_ok=True);errores=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 c.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(status=200,body='',content_type='text/css'));c.route('**/favicon.ico',lambda r:r.fulfill(status=204,body=''))
 q=c.new_page();q.on('pageerror',lambda e:(errores.append(str(e)),print('JS',e,flush=True)));q.goto(URL);q.wait_for_function("document.getElementById('loading').hidden",timeout=70000)
 q.evaluate('navigator.serviceWorker.ready');q.wait_for_function('navigator.serviceWorker.controller!==null',timeout=60000)
 cache=q.evaluate("caches.keys().then(async keys=>({keys,archivos:(await (await caches.open(keys[0])).keys()).length}))");print('Caché:',cache,flush=True)
 c.set_offline(True);q.reload(wait_until='domcontentloaded');q.wait_for_function("document.getElementById('loading').hidden",timeout=70000);assert 'BodyParts3D' in q.locator('#model-status').inner_text();q.locator('#study-open').click();abrir_modo(q,"nefrona");assert q.locator('#study-content svg').count();print('Recarga móvil sin red + mallas + nefrona: OK',flush=True);c.close()
 c=b.new_context(viewport={'width':1000,'height':800},service_workers='block');c.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(status=200,body='',content_type='text/css'));c.route('**/favicon.ico',lambda r:r.fulfill(status=204,body=''));c.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Bloqueado','SecurityError')}});Object.defineProperty(window,'indexedDB',{get(){throw new DOMException('Bloqueado','SecurityError')}});")
 q=c.new_page();q.on('pageerror',lambda e:(errores.append(str(e)),print('JS',e,flush=True)));q.goto(URL);q.wait_for_function("document.getElementById('loading').hidden",timeout=70000);q.locator('#study-open').click();abrir_modo(q,"notas");q.get_by_label('Notas personales',exact=True).fill('Nota temporal');assert 'No se pudo guardar' in q.locator('#study-content').inner_text();abrir_modo(q,"oclusion");q.wait_for_timeout(200);assert 'memoria temporal' in q.locator('#study-content').inner_text();print('Almacenamiento bloqueado: uso en memoria y avisos OK',flush=True);c.close();b.close()
assert not errores,errores
(out/'offline.json').write_text(json.dumps({'cache':cache,'offline':'OK','almacenamiento_bloqueado':'OK','errores':errores},ensure_ascii=False,indent=2))
