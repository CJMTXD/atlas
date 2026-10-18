// Funciones extraídas con referencias explícitas al contexto compartido.
export function inicio(contextoModulo){
          contextoModulo.montarMenu();
          contextoModulo.contenido.append(contextoModulo.mensaje(contextoModulo.contextoModulo.FUENTE_DOCX?"Fuente: "+contextoModulo.contextoModulo.FUENTE_DOCX:"Falta adjuntar el DOCX para completar el banco y la autoevaluación.",contextoModulo.contextoModulo.FUENTE_DOCX?"study-status":"study-alert"));
          contextoModulo.contenido.append(contextoModulo.mensaje(contextoModulo.contextoModulo.BANCO.length+" preguntas del documento · 7 secciones · progreso local"));
          const card=contextoModulo.nodo("div",null,{class:"study-card"});card.append(contextoModulo.nodo("strong","Atajos de estudio"),contextoModulo.nodo("p","1–4: elegir opción · Enter: siguiente · Espacio: voltear flashcard · Esc: cerrar Estudiar."));contextoModulo.contenido.append(card);
          if(contextoModulo.contextoModulo.OBSERVACIONES_DOCX.length){const notas=contextoModulo.nodo("details",null,{class:"study-card"});notas.append(contextoModulo.nodo("summary","Notas sobre la fuente y los esquemas"));contextoModulo.contextoModulo.OBSERVACIONES_DOCX.forEach(t=>notas.append(contextoModulo.nodo("p",t)));contextoModulo.contenido.append(notas);}
          if(!contextoModulo.persistente)contextoModulo.contenido.append(contextoModulo.mensaje("El navegador no permite guardar el progreso. Puedes estudiar durante esta sesión.","study-alert"));
          if(contextoModulo.progreso.sesiones.length){const ultima=contextoModulo.progreso.sesiones.at(-1);contextoModulo.contenido.append(contextoModulo.mensaje("Última sesión: "+ultima.aciertos+" / "+ultima.total+" · "+contextoModulo.formatoTiempo(ultima.segundos)));}
        }

export default {id:"inicio",titulo:"Inicio",montar:inicio,desmontar(){}};
