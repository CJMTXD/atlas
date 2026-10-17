// Funciones extraídas con referencias explícitas al contexto compartido.
export function guardar(contextoModulo){try{localStorage.setItem(contextoModulo.clave,JSON.stringify(contextoModulo.progreso));}catch{contextoModulo.persistente=false;}}
