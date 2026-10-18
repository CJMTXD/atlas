import {leerCSV} from './intercambio.js';
export function validarBanco(lista){
 if(!Array.isArray(lista)||!lista.length||lista.length>3000)throw new Error('El banco debe contener entre 1 y 3000 preguntas.');const ids=new Set();
 return lista.map((q,i)=>{if(!q||typeof q!=='object')throw new Error('Fila '+(i+1)+': registro inválido.');for(const k of ['pregunta','respuesta','seccion'])if(typeof q[k]!=='string'||!q[k].trim()||q[k].length>10000)throw new Error('Fila '+(i+1)+': '+k+' vacío o demasiado largo.');
 const texto=q.pregunta.trim()+'|'+q.respuesta.trim()+'|'+q.seccion.trim();let h=2166136261;for(const c of texto)h=Math.imul(h^c.charCodeAt(0),16777619);const id='propia-'+(h>>>0).toString(16);if(ids.has(id))throw new Error('Pregunta duplicada en fila '+(i+1)+'.');ids.add(id);
 const tipo=q.tipo||'mixto';if(!['mixto','ordenar','multiple','completar','vf'].includes(tipo))throw new Error('Tipo de pregunta no permitido en fila '+(i+1));
 const dificultad=q.dificultad||'media';if(!['baja','básica','media','alta'].includes(dificultad))throw new Error('Dificultad no permitida en fila '+(i+1)+': usa baja, media o alta.');
 const estructura=typeof q.estructuraRelacionada==='string'?q.estructuraRelacionada:'';let pasos=q.pasos;if(typeof pasos==='string'&&pasos)try{pasos=JSON.parse(pasos);}catch{throw new Error('Pasos JSON inválidos en fila '+(i+1));}
 if(tipo==='ordenar'&&(!Array.isArray(pasos)||pasos.length<2||pasos.length>12||pasos.some(x=>typeof x!=='string'||!x.trim()||x.length>500)||new Set(pasos).size!==pasos.length))throw new Error('La pregunta de ordenar requiere 2–12 pasos distintos.');
 return {id,pregunta:q.pregunta.trim(),respuesta:q.respuesta.trim(),seccion:q.seccion.trim(),tipo,dificultad:dificultad==='baja'?'básica':dificultad,estructuraRelacionada:estructura,...(tipo==='ordenar'?{pasos}:{}),origen:'usuario',aviso:'Contenido adicional, verificar con tu material'};});
}
export function leerBanco(texto){
 if(texto.length>3*1024*1024)throw new Error('El banco supera 3 MB.');const t=texto.replace(/^\ufeff/,'').trim();
 if(t.startsWith('[')||t.startsWith('{')){const x=JSON.parse(t);return validarBanco(Array.isArray(x)?x:x.preguntas);}
 const primera=t.split(/\r?\n/)[0];const esCSV=/pregunta/i.test(primera)&&/respuesta/i.test(primera)&&primera.includes(',');
 if(esCSV){const filas=leerCSV(t),cab=filas.shift().map(x=>x.trim());if(!['pregunta','respuesta','seccion'].every(k=>cab.includes(k)))throw new Error('CSV: faltan pregunta, respuesta o seccion.');if(new Set(cab).size!==cab.length||cab.some(k=>['__proto__','prototype','constructor'].includes(k)))throw new Error('Cabeceras CSV inválidas.');return validarBanco(filas.map((f,i)=>{if(f.length!==cab.length)throw new Error('Fila '+(i+2)+': número de columnas incorrecto.');return Object.fromEntries(cab.map((k,j)=>[k,f[j]]));}));}
 return validarBanco(t.split(/\r?\n/).filter(x=>x.trim()).map((l,i)=>{const v=l.split('|').map(x=>x.trim());if(v.length!==3)throw new Error('Línea '+(i+1)+': usa pregunta | respuesta | sección.');return {pregunta:v[0],respuesta:v[1],seccion:v[2]};}));
}
