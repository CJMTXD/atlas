"""Servidor local del atlas; sin dependencias de Python externas."""
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--puerto',type=int,default=8000)
args=parser.parse_args()
handler=partial(SimpleHTTPRequestHandler,directory=str(Path(__file__).resolve().parent))
print(f'Atlas disponible en http://localhost:{args.puerto}/ (Ctrl+C para salir)',flush=True)
try:ThreadingHTTPServer(('127.0.0.1',args.puerto),handler).serve_forever()
except KeyboardInterrupt:pass
