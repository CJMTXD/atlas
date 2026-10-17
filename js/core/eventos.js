// Cada suscripción devuelve su función de retirada.
export function crearBus(){const mapa=new Map();return {on(nombre,fn){if(!mapa.has(nombre))mapa.set(nombre,new Set());mapa.get(nombre).add(fn);return ()=>mapa.get(nombre)?.delete(fn);},off(nombre,fn){mapa.get(nombre)?.delete(fn);},emit(nombre,valor){for(const fn of mapa.get(nombre)||[])fn(valor);},limpiar(){mapa.clear();}};}
