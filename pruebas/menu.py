import os
from pathlib import Path
from playwright.sync_api import sync_playwright
URL=os.environ.get('ATLAS_TEST_URL','http://127.0.0.1:8000/atlas/')
out=Path(__file__).resolve().parent/'resultados'
out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for width in [1440,390,320]:
  c=b.new_context(viewport={'width':width,'height':900 if width>850 else 844},is_mobile=width<850,has_touch=width<850)
  c.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(status=200,body='',content_type='text/css'))
  q=c.new_page();errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
  q.goto(URL);q.wait_for_function("document.getElementById('loading').hidden",timeout=90000)
  q.locator('#study-open').click()
  assert q.locator('[data-mode=quiz]').is_visible()
  q.screenshot(path=str(out/f'menu-{width}.png'))
  for area,ids in [('estudio',['quiz','flash','examen','practico','nefrona','histologia','epitelios','oclusion']),('exploracion',['ruta','fisiologia','comparar','herramientas']),('progreso',['estadisticas','errores','auto','notas','importador','transferencias'])]:
   q.locator(f'[data-area={area}]').click()
   for id in ids:
    q.locator(f'[data-mode={id}]').click()
    assert q.locator('.study-back').is_visible()
    assert q.locator('#study-content').inner_text().strip()
    q.locator('.study-back').click()
    assert q.locator(f'[data-mode={id}]').is_visible()
   assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
  q.locator('[data-area=estudio]').click();q.locator('[data-mode=anatomico]').click()
  assert q.locator('#study-panel').is_hidden()
  assert q.locator('#quiz-options button').count()==4
  q.locator('#quiz-options button').first.click();q.locator('#quiz-exit').click()
  q.locator('#study-open').click();q.locator('[data-mode=quiz]').click();q.get_by_role('button',name='Comenzar',exact=True).click()
  q.locator('[data-area=exploracion]').click()
  assert 'Sesión interrumpida' in q.locator('#study-content').inner_text()
  q.locator('[data-area=exploracion]').click();q.get_by_role('button',name='Ver interior del riñón',exact=True).click()
  assert q.locator('#study-panel').is_hidden();assert q.locator('#clip-enabled').is_checked()
  q.locator('#study-open').click();q.locator('[data-area=estudio]').click()
  q.locator('#theme').click();q.screenshot(path=str(out/f'menu-claro-{width}.png'))
  assert not errors,errors
  print(width,'OK: 18 modos, quiz anatómico, navegación con sesión, corte renal y temas',flush=True)
  c.close()
 b.close()
