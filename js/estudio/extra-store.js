import {leer,guardar} from '../core/almacenamiento.js';
export const CLAVE='atlas-estudio-extra-v1';
const base={version:1,algoritmo:'leitner',metaDiaria:20,notas:{},bancos:[],historial:[]};
const previo=leer(CLAVE,null);
export const extra=previo&&previo.version===1?{...base,...previo}:base;
for(const key of ['bancos','historial'])if(!Array.isArray(extra[key]))extra[key]=[];
if(!extra.notas||typeof extra.notas!=='object'||Array.isArray(extra.notas))extra.notas={};
export let persistente=true;
export function salvar(){persistente=guardar(CLAVE,extra);return persistente;}
export function registrar(resumen){if(!extra.historial.some(x=>x.fecha===resumen.fecha))extra.historial.push(resumen);extra.historial=extra.historial.slice(-5000);salvar();}
export function fechaLocal(fecha=Date.now()){const d=new Date(fecha);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
