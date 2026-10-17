// Funciones extraídas con referencias explícitas al contexto compartido.
export function seleccionar(contextoModulo,id,{revelar=true,estudio=false}={}) {
        if(!contextoModulo.partes.has(id)) return;
        if(contextoModulo.estado.quiz.activo && !estudio) {
          contextoModulo.avisar("Termina el quiz para explorar otras estructuras.");
          return;
        }
        const p=contextoModulo.partes.get(id);
        if(p.meta.sexo && p.meta.sexo!==contextoModulo.urinario.sexo)contextoModulo.cambiarSexoUrinario(p.meta.sexo);
        if(p.meta.contexto)contextoModulo.urinario.comparar=true;
        if(contextoModulo.urinario.solo&&!p.meta.urinaria)contextoModulo.urinario.solo=false;
        contextoModulo.estado.seleccionado=id;
        if(revelar) {
          contextoModulo.estado.ocultos.delete(id);
          contextoModulo.estado.aislado=null;
          contextoModulo.estado.region="todas";
          contextoModulo.$("region").value="todas";
          document.querySelectorAll(".tree-region").forEach(r=>r.hidden=false);
          const s=contextoModulo.SISTEMAS[p.meta.sistema];
          s.visible=true;
          s.opacidad=Math.max(.55,s.opacidad);
          contextoModulo.sincronizarCapas();
        }
        document.querySelectorAll(".tree-part").forEach(b=>{
          const seleccionada=!estudio && b.dataset.id===id;
          b.classList.toggle("selected",seleccionada);
          b.setAttribute("aria-pressed",String(seleccionada));
          if(seleccionada) {
            let padre=b.parentElement;
            while(padre && padre!==contextoModulo.$("tree")) {
              if(padre.tagName==="DETAILS") padre.open=true;
              padre=padre.parentElement;
            }
          }
        });
        if(!estudio) {
          contextoModulo.mostrarInformacion(id);
          contextoModulo.$("right-panel").scrollTop=0;
          if(contextoModulo.vistaMovil.matches && contextoModulo.$("study-panel")?.hidden!==false) {
            contextoModulo.$("search").blur();
            contextoModulo.panel("right",true,{enfocar:false});
          }
          contextoModulo.$("search").value="";
          contextoModulo.limpiarResultados();
        } else {
          contextoModulo.$("part-info").hidden=true;
          contextoModulo.$("empty-info").hidden=false;
        }
        contextoModulo.aplicarEstado();
        contextoModulo.enfocarParte(p);
      }
export function deseleccionar(contextoModulo) {
        if(contextoModulo.estado.quiz.activo) contextoModulo.terminarQuiz();
        contextoModulo.estado.seleccionado=null;
        contextoModulo.estado.hover=null;
        contextoModulo.$("part-info").hidden=true;
        contextoModulo.$("empty-info").hidden=false;
        document.querySelectorAll(".tree-part.selected").forEach(b=>{
          b.classList.remove("selected");
          b.setAttribute("aria-pressed","false");
        });
        contextoModulo.actualizarContorno();
        contextoModulo.solicitarRender();
      }
export function aislar(contextoModulo) {
        if(!contextoModulo.estado.seleccionado || contextoModulo.estado.quiz.activo) return;
        contextoModulo.estado.aislado=contextoModulo.estado.seleccionado;
        contextoModulo.aplicarEstado();
      }
export function ocultarSeleccionada(contextoModulo) {
        if(!contextoModulo.estado.seleccionado || contextoModulo.estado.quiz.activo) return;
        const id=contextoModulo.estado.seleccionado;
        contextoModulo.estado.ocultos.add(id);
        contextoModulo.estado.aislado=null;
        contextoModulo.deseleccionar();
        contextoModulo.aplicarEstado();
      }
export function restaurar(contextoModulo) {
        contextoModulo.urinario.solo=false;contextoModulo.urinario.comparar=false;contextoModulo.urinario.flujo=false;
        if(contextoModulo.particulasOrina)contextoModulo.particulasOrina.visible=false;
        if(contextoModulo.estado.quiz.activo) contextoModulo.terminarQuiz();
        contextoModulo.estado.ocultos.clear();
        contextoModulo.estado.aislado=null;
        contextoModulo.estado.region="todas";
        contextoModulo.$("region").value="todas";
        // Se restablece una vista del interior legible; piel y músculos quedan disponibles.
        for(const [id,s] of Object.entries(contextoModulo.SISTEMAS)) {
          s.visible=!["piel","muscular"].includes(id);
          s.opacidad=id==="esqueletico"?.72:id==="respiratorio"?.72:id==="piel"?.18:1;
        }
        contextoModulo.estado.corte=false;
        contextoModulo.$("clip-enabled").checked=false;
        contextoModulo.estado.explosionObjetivo=0;
        contextoModulo.$("explode").value=0;
        contextoModulo.$("explode-value").textContent="0%";
        contextoModulo.sincronizarCapas();
        contextoModulo.aplicarEstado();
      }
