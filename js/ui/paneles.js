// Funciones extraídas con referencias explícitas al contexto compartido.
export function estadoPanel(contextoModulo,lado,visible) {
        const nodo=contextoModulo.$(lado+"-panel");
        nodo.classList.toggle("collapsed",!visible);
        nodo.inert=!visible;
        nodo.setAttribute("aria-hidden",String(!visible));
        contextoModulo.$("toggle-"+lado).setAttribute("aria-expanded",String(visible));
      }
export function panel(contextoModulo,lado,abrir,{enfocar=true}={}) {
        const nodo=contextoModulo.$(lado+"-panel");
        const visible=abrir ?? nodo.classList.contains("collapsed");
        if(visible && contextoModulo.vistaMovil.matches) {
          contextoModulo.estadoPanel(lado==="left"?"right":"left",false);
          contextoModulo.estudioUI?.cerrar({devolverFoco:false});
        }
        contextoModulo.estadoPanel(lado,visible);
        if(enfocar) {
          if(visible)requestAnimationFrame(()=>{if(!nodo.inert)nodo.querySelector("button,select,input")?.focus({preventScroll:true});});
          else contextoModulo.$("toggle-"+lado).focus({preventScroll:true});
        }
      }
export function adaptarPaneles(contextoModulo){
        for(const lado of ["left","right"])contextoModulo.estadoPanel(lado,!contextoModulo.vistaMovil.matches);
        contextoModulo.solicitarRender();
      }
