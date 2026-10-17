const memoria=new Map();
export function leer(clave,defecto){try{const raw=localStorage.getItem(clave);return raw===null?(memoria.get(clave)??defecto):JSON.parse(raw);}catch{return memoria.get(clave)??defecto;}}
export function guardar(clave,valor){memoria.set(clave,valor);try{localStorage.setItem(clave,JSON.stringify(valor));return true;}catch{return false;}}
export function quitar(clave){memoria.delete(clave);try{localStorage.removeItem(clave);return true;}catch{return false;}}
