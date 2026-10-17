// Descarga verificable: no se inventa un porcentaje sin Content-Length.
export async function cargarMallas(progreso) {
  if(location.protocol === 'file:') throw new Error('Abre el atlas mediante un servidor HTTP: python -m http.server 8000');
  const respuesta = await fetch('./data/mesh-manifest.json');
  if(!respuesta.ok) throw new Error('No se pudo cargar el manifiesto: HTTP '+respuesta.status);
  const manifest = await respuesta.json();
  const res = await fetch('./assets/atlas-mesh.bin');
  if(!res.ok) throw new Error('No se pudieron cargar las mallas: HTTP '+res.status);
  const total=Number(res.headers.get('Content-Length'))||0;
  const lector=res.body?.getReader(); const bloques=[];let recibidos=0;
  if(lector){while(true){const {done,value}=await lector.read();if(done)break;bloques.push(value);recibidos+=value.length;progreso(total?25+35*recibidos/total:25,'Descargando anatomía: '+(recibidos/1048576).toFixed(1)+' MB'+(total?' / '+(total/1048576).toFixed(1)+' MB':''));}}
  else {const b=new Uint8Array(await res.arrayBuffer());bloques.push(b);recibidos=b.length;}
  const bytes=new Uint8Array(recibidos);let cursor=0;for(const b of bloques){bytes.set(b,cursor);cursor+=b.length;}
  let fin=0;const ids=new Set();
  for(const m of manifest){if(ids.has(m.id)||![m.offset,m.vertices,m.indices].every(Number.isInteger)||m.offset!==fin||m.offset%2||m.vertices<=0||m.indices<=0||m.indices%3)throw new Error('Manifiesto inválido: '+m.id);ids.add(m.id);fin=m.offset+m.vertices*6+m.indices*4;if(fin>bytes.length)throw new Error('Mallas incompletas');const vista=new DataView(bytes.buffer,m.offset+m.vertices*6,m.indices*4);for(let i=0;i<m.indices;i++)if(vista.getUint32(i*4,true)>=m.vertices)throw new Error('Índice inválido: '+m.id);}
  if(fin!==bytes.length)throw new Error('El tamaño de las mallas no coincide con el manifiesto');
  progreso(60,'Construyendo las superficies anatómicas…');return {manifest,buffer:bytes.buffer};
}
