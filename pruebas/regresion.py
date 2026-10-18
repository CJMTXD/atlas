import os
URL=os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8000/atlas/")
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
out=Path(__file__).resolve().parent/'resultados';out.mkdir(exist_ok=True);errors=[];console=[];checks=[]
def responder_banco(q):
 if q.locator('[data-answer-index="0"]').count():q.locator('[data-answer-index="0"]').click()
 elif q.locator('#study-blank').count():q.locator('#study-blank').fill('prueba');q.get_by_role('button',name='Comprobar',exact=True).click()
 else:q.get_by_role('button',name='Comprobar orden',exact=True).click()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for mobile in [False,True]:
  c=b.new_context(viewport={'width':390 if mobile else 1440,'height':844 if mobile else 1000},is_mobile=mobile,has_touch=mobile)
  c.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(status=200,body='',content_type='text/css'))
  c.route('**/favicon.ico',lambda r:r.fulfill(status=204,body=''))
  q=c.new_page();q.on('pageerror',lambda e:(errors.append(str(e)),print('JS ERROR',str(e),flush=True)));q.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
  q.goto(URL);q.wait_for_function("document.getElementById('loading').hidden",timeout=70000)
  assert q.locator('#load-text').inner_text()=='Atlas preparado.'
  assert 'BodyParts3D' in q.locator('#model-status').inner_text()
  for url in ['css/base.css','js/main.js']:
   assert q.request.get(URL+url).status==200
  q.locator('#search').fill('riñón derecho');q.locator('#search-results .result').first.click();q.wait_for_timeout(800)
  assert 'Riñón derecho' in q.locator('#info-name').inner_text()
  q.locator('#isolate').click()
  if mobile:q.locator('[data-close="right"]').click();q.wait_for_timeout(300)
  q.keyboard.press('Escape');q.wait_for_timeout(300)
  rect=q.locator('#stage').bounding_box();q.mouse.click(rect['x']+rect['width']/2,rect['y']+rect['height']/2);q.wait_for_timeout(350)
  assert not q.locator('#part-info').evaluate('e=>e.hidden')
  assert 'Riñón derecho' in q.locator('#info-name').inner_text()
  if mobile:q.locator('#toggle-left').click();q.wait_for_timeout(300)
  q.locator('#clip-enabled').check();q.locator('#clip-axis').select_option('y');q.locator('#clip-position').fill('50');q.locator('#clip-position').dispatch_event('input')
  assert q.locator('#clip-axis').input_value()=='y'
  q.screenshot(path=str(out/('movil-corte.png' if mobile else 'escritorio-corte.png')))
  q.locator('#clip-enabled').uncheck()
  if mobile:q.locator('[data-close="left"]').click()
  q.locator('#restore').click()
  if mobile:q.locator('#toggle-left').click();q.wait_for_timeout(300)
  q.locator('#quiz-toggle').click()
  if mobile:q.locator('[data-close="left"]').click()
  assert q.locator('#quiz-options button').count()==4;q.locator('#quiz-options button').first.click();assert q.locator('#quiz-feedback').inner_text();q.locator('#quiz-exit').click()
  q.locator('#study-open').click();q.locator('[data-mode="quiz"]').click();q.get_by_role('button',name='Comenzar',exact=True).click();q.wait_for_timeout(150);responder_banco(q);assert 'Respuesta del documento' in q.locator('#study-feedback').inner_text();q.get_by_role('button',name='Finalizar sesión',exact=True).click()
  q.locator('[data-mode="flash"]').click();q.get_by_role('button',name='Estudiar tarjetas pendientes',exact=True).click();q.locator('#study-flash').click();assert q.locator('#flash-yes').is_enabled();q.locator('#flash-yes').click();q.get_by_role('button',name='Terminar',exact=True).click()
  q.get_by_role('button',name='Cerrar panel Estudiar').click()
  q.locator('#theme').click();assert q.evaluate('document.documentElement.dataset.theme')=='light';q.locator('#theme').click();assert q.evaluate('document.documentElement.dataset.theme')=='dark'
  assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert q.evaluate('document.querySelector("main").scrollTop===0')
  checks.append(('móvil' if mobile else 'escritorio')+': carga, ficha desde búsqueda y clic 3D en riñón aislado, corte Y, quizzes, flashcards, temas y layout OK')
  print(checks[-1],flush=True);c.close()
 b.close()
print('Errores JS:',errors,'Consola:',console,flush=True)
(out/'pruebas.json').write_text(json.dumps({'checks':checks,'errores_js':errors,'errores_consola':console},ensure_ascii=False,indent=2))
assert not errors and not console
