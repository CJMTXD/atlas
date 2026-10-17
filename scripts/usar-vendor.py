"""Selecciona Three.js local o CDN sin cambiar su versión."""
from pathlib import Path
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--cdn',action='store_true');args=parser.parse_args()
p=Path(__file__).resolve().parents[1]/'index.html';s=p.read_text()
a='https://cdn.jsdelivr.net/npm/three@0.180.0/';b='./vendor/three/'
s=s.replace(b,a) if args.cdn else s.replace(a,b)
p.write_text(s)
print('Configurado CDN' if args.cdn else 'Configurado Three.js local 0.180.0')
