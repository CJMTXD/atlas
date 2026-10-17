import {prepararPWA} from "./core/pwa.js";
// Entrada pequeña: captura también fallos de importación y de datos JSON.
import('./core/aplicacion.js').then(()=>prepararPWA()).catch(error=>{
 console.error(error);
 document.getElementById('load-text').textContent='No se pudo iniciar Atlas. Usa un servidor HTTP y comprueba los archivos y la conexión. '+error.message;
 document.getElementById('reload').hidden=false;
});
