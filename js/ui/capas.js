// Funciones extraídas con referencias explícitas al contexto compartido.
export function sincronizarCapas(contextoModulo) {
        Object.entries(contextoModulo.SISTEMAS).forEach(([id,s])=>{
          contextoModulo.$("layer-"+id).checked=s.visible;
          contextoModulo.$("opacity-"+id).value=Math.round(s.opacidad*100);
          contextoModulo.$("output-"+id).textContent=Math.round(s.opacidad*100)+"%";
        });
      }
