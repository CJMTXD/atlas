"""Crea PR apilados, sin fusionar. Requiere gh autenticado y acceso a la API."""
from pathlib import Path
import subprocess,json
root=Path(__file__).resolve().parents[1]
for paso in json.loads((root/'revision/ramas.json').read_text()):
    cmd=['gh','pr','list','--repo','CJMTXD/atlas','--head',paso['head'],'--base',paso['base'],'--json','number,url']
    r=subprocess.run(cmd,cwd=root,text=True,capture_output=True)
    if r.returncode:raise SystemExit('No se pudo consultar GitHub. No se continúa: '+r.stderr.strip())
    existentes=json.loads(r.stdout)
    if existentes:print('Ya existe:',existentes[0]['url']);continue
    subprocess.run(['gh','pr','create','--repo','CJMTXD/atlas','--base',paso['base'],'--head',paso['head'],'--title',paso['titulo'],'--body-file',str(root/paso['descripcion'])],cwd=root,check=True)
