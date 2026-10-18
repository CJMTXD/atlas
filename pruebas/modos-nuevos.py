import os
URL=os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8000/atlas/")
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
out=Path(__file__).resolve().parent/'resultados';out.mkdir(exist_ok=True);errores=[];pasos=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 c=b.new_context(viewport={'width':1440,'height':1000},service_workers='block');c.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(status=200,body='',content_type='text/css'));c.route('**/favicon.ico',lambda r:r.fulfill(status=204,body=''))
 q=c.new_page();q.on('pageerror',lambda e:(errores.append(str(e)),print('ERROR',e,flush=True)));q.on('console',lambda m:print('CONSOLE',m.text,flush=True) if m.type=='error' else None)
 q.goto(URL);q.wait_for_function("document.getElementById('loading').hidden",timeout=70000);q.locator('#study-open').click()
 def modo(id):q.locator('[data-mode="'+id+'"]').click();q.wait_for_timeout(150)
 def ok(t):pasos.append(t);print(t,flush=True)
 modo('flash');q.locator('#algoritmo').select_option('sm2');q.get_by_role('button',name='Estudiar tarjetas pendientes',exact=True).click();q.locator('#study-flash').click();q.locator('#sm2-calidad').select_option('5');q.locator('#flash-yes').click();q.get_by_role('button',name='Terminar',exact=True).click();assert q.evaluate("Object.values(JSON.parse(localStorage.getItem('atlas-urinario-estudio-v1')).tarjetas).some(t=>t.sm2?.intervalo===1)");ok('SM-2 guarda sin perder Leitner')
 modo('estadisticas');assert q.locator('#study-content svg').count()==1;q.locator('#meta-diaria').fill('12');q.locator('#meta-diaria').dispatch_event('change');ok('Estadísticas y meta persistida')
 modo('importador');q.get_by_label('Contenido del banco propio').fill('Pregunta de prueba | Respuesta de prueba | Laboratorio de prueba');q.get_by_role('button',name='Validar banco',exact=True).click();q.get_by_role('button',name='Importar preguntas validadas',exact=True).click();assert 'Banco importado' in q.locator('#study-content').inner_text();ok('Banco propio validado e importado')
 modo('notas');q.get_by_label('Notas personales',exact=True).fill('<img src=x onerror=alert(1)> nota local');q.get_by_label('Mnemotecnia personal').fill('Mi regla');q.get_by_label('Pista personal').fill('Mi pista');q.get_by_label('Repasar luego',exact=True).check();assert q.locator('#study-content img').count()==0;ok('Notas, pista y marcador; contenido tratado como texto')
 modo('transferencias');
 with q.expect_download() as dl:q.get_by_role('button',name='Progreso JSON',exact=True).click()
 dl.value.save_as(out/'progreso.json');data=json.loads((out/'progreso.json').read_text());assert data['extra']['notas'];ok('Exportación de progreso incluye notas y SM-2')
 modo('oclusion');q.get_by_label('Subir lámina de histología').set_input_files({'name':'lamina-prueba.png','mimeType':'image/png','buffer':__import__('base64').b64decode(q.evaluate("(()=>{const c=document.createElement('canvas');c.width=100;c.height=100;const x=c.getContext('2d');x.fillStyle='#eee';x.fillRect(0,0,100,100);x.fillStyle='#000';x.fillText('PRUEBA',10,40);return c.toDataURL().split(',')[1]})()"))});q.wait_for_function("document.querySelector('.occlusion-frame img')?.naturalWidth>0");q.get_by_role('button',name='Añadir recuadro',exact=True).click();assert q.locator('.occlusion-frame rect').count()==1;q.get_by_role('button',name='Estudiar máscaras',exact=True).click();q.locator('.occlusion-frame rect').click();assert q.locator('.occlusion-frame rect').get_attribute('fill')=='transparent';ok('Imagen local, máscara y revelado')
 modo('practico');q.get_by_label('Nombre de la estructura').fill('incorrecto');q.get_by_role('button',name='Comprobar nombre',exact=True).click();assert 'Para repasar.' in q.locator('#study-content').inner_text();q.get_by_role('button',name='Terminar examen práctico',exact=True).click();ok('Examen práctico y resumen')
 modo('fisiologia');q.get_by_role('button',name='Animar peristaltismo',exact=True).click();q.wait_for_timeout(300);q.get_by_role('button',name='Pausar',exact=True).click();q.get_by_label('Llenado vesical').fill('80');q.get_by_label('Llenado vesical').dispatch_event('input');q.get_by_role('button',name='Pausar',exact=True).click();ok('Peristaltismo, llenado y pausa')
 modo('herramientas');q.get_by_role('button',name='Activar modo enfoque',exact=True).click();assert q.locator('body').evaluate("e=>e.classList.contains('modo-enfoque')");q.get_by_role('button',name='Salir del modo enfoque',exact=True).click();ok('Modo enfoque reversible')
 q.screenshot(path=str(out/'general.png'));c.close();b.close()
(out/'nuevos.json').write_text(json.dumps({'pasos':pasos,'errores':errores},ensure_ascii=False,indent=2));assert not errores,errores
