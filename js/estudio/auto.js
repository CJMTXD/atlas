// Funciones extraídas con referencias explícitas al contexto compartido.
export function autoevaluacion(contextoModulo){
          contextoModulo.titulo("Autoevaluación del documento");if(contextoModulo.contextoModulo.AUTOEVALUACION.length!==7){contextoModulo.contenido.append(contextoModulo.mensaje("Las siete casillas se incorporarán literalmente al recibir el DOCX. No se han sustituido por una lista genérica.","study-alert"));return;}
          const progresoBar=contextoModulo.nodo("progress",null,{max:7,value:0,"aria-label":"Progreso de autoevaluación"}),texto=contextoModulo.mensaje("");contextoModulo.contenido.append(progresoBar,texto);
          const actualizar=()=>{const n=contextoModulo.contextoModulo.AUTOEVALUACION.filter(x=>contextoModulo.progreso.autoevaluacion[x.id]).length;progresoBar.value=n;texto.textContent=n+" de 7 objetivos · "+Math.round(n/7*100)+"%";};
          contextoModulo.contextoModulo.AUTOEVALUACION.forEach(x=>{const label=contextoModulo.nodo("label",null,{class:"study-check"}),check=contextoModulo.nodo("input",null,{type:"checkbox"});check.checked=!!contextoModulo.progreso.autoevaluacion[x.id];check.onchange=()=>{contextoModulo.progreso.autoevaluacion[x.id]=check.checked;contextoModulo.guardar();actualizar();};label.append(check,contextoModulo.nodo("span",x.texto));contextoModulo.contenido.append(label);});actualizar();
        }

export default {id:"auto",titulo:"Autoevaluaci\u00f3n",montar:autoevaluacion,desmontar(){}};
