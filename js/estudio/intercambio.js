import {validarBanco} from "./bancos.js";
// CSV con comillas, saltos de línea y comillas escapadas; sin evaluar contenido.
export function leerCSV(texto,delimitador=','){
 const filas=[];let fila=[],campo='',comillas=false;
 for(let i=0;i<texto.length;i++){const c=texto[i];if(c==='"'){if(comillas&&texto[i+1]==='"'){campo+='"';i++;}else if(comillas)comillas=false;else if(!campo)comillas=true;else throw new Error('Comilla inesperada en CSV.');}else if(c===delimitador&&!comillas){fila.push(campo);campo='';}else if((c==='\n'||c==='\r')&&!comillas){if(c==='\r'&&texto[i+1]==='\n')i++;fila.push(campo);if(fila.some(x=>x.trim()))filas.push(fila);fila=[];campo='';}else campo+=c;}
 if(comillas)throw new Error('Hay comillas sin cerrar.');fila.push(campo);if(fila.some(x=>x.trim()))filas.push(fila);return filas;
}
export function escribirCSV(filas){return '\ufeff'+filas.map(f=>f.map(v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"').join(',')).join('\r\n');}
function objetoSeguro(x){if(x&&typeof x==='object')for(const [k,v]of Object.entries(x)){if(['__proto__','constructor','prototype'].includes(k))throw new Error('El archivo contiene una clave no permitida.');objetoSeguro(v);}}
export function validarProgreso(datos){
 objetoSeguro(datos);if(!datos||datos.version!==1||!datos.progreso)throw new Error('Se requiere una exportación Atlas de progreso, versión 1.');
 const p=datos.progreso;for(const k of ['tarjetas','errores','autoevaluacion'])if(!p[k]||typeof p[k]!=='object'||Array.isArray(p[k]))throw new Error('Campo de progreso inválido: '+k);
 if(!Array.isArray(p.sesiones))throw new Error('Sesiones inválidas.');
 for(const [id,t]of Object.entries(p.tarjetas)){if(!id||!t||typeof t!=='object')throw new Error('Tarjeta inválida.');for(const k of ['caja','vence'])if(k in t&&(!Number.isFinite(t[k])||t[k]<0))throw new Error('Intervalo de tarjeta inválido.');if(t.sm2)for(const k of ['repeticiones','intervalo','factor','vence'])if(!Number.isFinite(t.sm2[k])||t.sm2[k]<0)throw new Error('Datos SM-2 inválidos.');}
 for(const e of Object.values(p.errores))if(!e||![e.intentos,e.fallos].every(v=>Number.isFinite(v)&&v>=0)||e.fallos>e.intentos)throw new Error('Registro de errores inválido.');
 for(const v of Object.values(p.autoevaluacion))if(typeof v!=='boolean')throw new Error('Autoevaluación inválida.');
 for(const s of p.sesiones)if(!s||![s.fecha,s.total,s.aciertos].every(v=>Number.isFinite(v)&&v>=0)||s.aciertos>s.total)throw new Error('Sesión inválida.');
 if(datos.extra){if(datos.extra.version!==1||!Array.isArray(datos.extra.bancos)||!Array.isArray(datos.extra.historial)||!datos.extra.notas||typeof datos.extra.notas!=='object')throw new Error('Datos complementarios inválidos.');}
 if(datos.extra){const e=datos.extra;if(!['leitner','sm2'].includes(e.algoritmo??'leitner')||!Number.isFinite(e.metaDiaria??20)||(e.metaDiaria??20)<1||(e.metaDiaria??20)>500)throw new Error('Preferencias inválidas.');
 for(const n of Object.values(e.notas)){if(!n||typeof n!=='object')throw new Error('Nota inválida.');for(const k of ['texto','pista','mnemotecnia'])if(k in n&&(typeof n[k]!=='string'||n[k].length>20000))throw new Error('Texto de nota inválido.');if('repasar' in n&&typeof n.repasar!=='boolean')throw new Error('Marcador inválido.');}
 for(const s of e.historial)if(!s||![s.fecha,s.total,s.aciertos].every(v=>Number.isFinite(v)&&v>=0)||s.aciertos>s.total)throw new Error('Historial inválido.');}
 if(datos.extra?.bancos?.length)datos.extra.bancos=validarBanco(datos.extra.bancos);
 return datos;
}
export function bancoCSV(banco){const keys=['id','pregunta','respuesta','seccion','dificultad','tipo','estructuraRelacionada','pasos'];return escribirCSV([keys,...banco.map(q=>keys.map(k=>Array.isArray(q[k])?JSON.stringify(q[k]):q[k]||''))]);}
export function progresoCSV(datos){return escribirCSV([['tipo','id','datos'],['version','','1'],...Object.entries(datos.progreso).flatMap(([tipo,valor])=>Array.isArray(valor)?valor.map((v,i)=>[tipo,String(i),JSON.stringify(v)]):Object.entries(valor).map(([id,v])=>[tipo,id,JSON.stringify(v)])),['extra','',JSON.stringify(datos.extra)]]);}
export function importarProgreso(texto){if(texto.trimStart().startsWith('{'))return validarProgreso(JSON.parse(texto));const filas=leerCSV(texto.replace(/^\ufeff/,''));if(filas.shift()?.join(',')!=='tipo,id,datos')throw new Error('Cabecera CSV de progreso inválida.');const d={version:1,progreso:{tarjetas:{},errores:{},autoevaluacion:{},sesiones:[]}};for(const [tipo,id,valor]of filas){if(tipo==='version'){if(valor!=='1')throw new Error('Versión no soportada.');continue;}if(tipo==='extra'){d.extra=JSON.parse(valor);continue;}if(!Object.hasOwn(d.progreso,tipo)||['__proto__','constructor','prototype'].includes(id))throw new Error('Fila de progreso no permitida.');if(tipo==='sesiones')d.progreso.sesiones.push(JSON.parse(valor));else d.progreso[tipo][id]=JSON.parse(valor);}return validarProgreso(d);}
export function ankiTSV(banco){const limpiar=s=>String(s??'').replace(/[\t\r\n]+/g,' ').trim();return '#separator:Tab\n#html:false\n#tags column:3\n#columns:Pregunta\tRespuesta\tTags\n'+banco.map(q=>[limpiar(q.pregunta),limpiar(q.respuesta),limpiar(q.seccion).replace(/\s+/g,'_')].join('\t')).join('\n');}
export function descargar(nombre,texto,tipo='application/json'){const url=URL.createObjectURL(new Blob([texto],{type:tipo}));const a=document.createElement('a');a.href=url;a.download=nombre;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
