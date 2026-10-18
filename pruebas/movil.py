import os
URL=os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8000/atlas/")
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path(__file__).resolve().parent/'resultados';out.mkdir(exist_ok=True);errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']);c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block');c.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(status=200,body='',content_type='text/css'));q=c.new_page();q.on('pageerror',lambda e:(errors.append(str(e)),print(e,flush=True)));q.goto(URL);q.wait_for_function("document.getElementById('loading').hidden",timeout=70000);q.locator('#study-open').tap()
 for modo in ['estadisticas','transferencias','importador','notas','oclusion','practico','herramientas','fisiologia']:
  q.locator('[data-mode="'+modo+'"]').tap();q.wait_for_timeout(100);assert q.locator('#study-content').inner_text();assert q.evaluate('document.documentElement.scrollWidth<=innerWidth');assert q.evaluate('document.querySelector("main").scrollTop===0')
  if modo=='practico':
   q.get_by_role('button',name='Cerrar panel Estudiar').tap();q.locator('#study-open').tap();assert q.locator('#respuesta-practica').count();q.get_by_role('button',name='Terminar examen práctico',exact=True).tap()
 q.screenshot(path=str(out/'movil-funciones.png'));print('Ocho modos nuevos en móvil, cierre/reapertura del práctico y ancho: OK',flush=True);c.close();b.close()
assert not errors
(out/'movil-nuevos.json').write_text(json.dumps({'modos':8,'errores':errors},indent=2))
