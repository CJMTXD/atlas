import os
URL=os.environ.get("ATLAS_TEST_URL","http://127.0.0.1:8000/atlas/")
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']);c=b.new_context(viewport={'width':1440,'height':1000},service_workers='block');c.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(status=200,body='',content_type='text/css'))
 # Instrumentación exclusiva de la prueba; el archivo del proyecto permanece intacto.
 src=(root/'js/core/aplicacion.js').read_text().replace('estudioUI=iniciarEstudio();','estudioUI=iniciarEstudio();window.__pruebaAtlas=contextoCompartido;')
 c.route('**/js/core/aplicacion.js',lambda r:r.fulfill(status=200,body=src,content_type='text/javascript'))
 q=c.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(URL);q.wait_for_function("document.getElementById('loading').hidden",timeout=70000)
 result=q.evaluate('''()=>{const a=window.__pruebaAtlas;a.estudiarUrinario();a.seleccionar('rinon_derecho');const centro=new a.T.Box3().setFromObject(a.partes.get('rinon_derecho').grupo).getCenter(new a.T.Vector3());document.getElementById('clip-enabled').checked=true;document.getElementById('clip-axis').value='z';document.getElementById('clip-position').value=100*(centro.z-(a.cajaCuerpo.min.z-.1))/(a.cajaCuerpo.max.z-a.cajaCuerpo.min.z+.2);a.actualizarCorte();return ['corteza','medula','piramides','columnas','papila','calices_menores','calices_mayores','pelvis_renal','hilio'].map(id=>{const p=a.partes.get(id+'_derecha');return {id,existe:!!p,visible:!!p?.grupo.visible,conCorte:p?.grupo.children.filter(m=>m.isMesh).every(m=>m.material.clippingPlanes?.includes(a.planoCorte))}})}''')
 q.wait_for_timeout(800);q.screenshot(path=str(root/'pruebas/resultados/corte-renal.png'));assert all(x['existe'] and x['visible'] and x['conCorte'] for x in result),result;assert not errors,errors;print(json.dumps(result),flush=True);(root/'pruebas/resultados/renal.json').write_text(json.dumps(result,indent=2));b.close()
