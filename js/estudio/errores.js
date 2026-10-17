// Funciones extraídas con referencias explícitas al contexto compartido.
export function panelErrores(contextoModulo){
          contextoModulo.limpiar(contextoModulo.contenido);contextoModulo.titulo("Preguntas a reforzar");if(contextoModulo.faltaBanco())return;
          const lista=contextoModulo.contextoModulo.BANCO.filter(q=>contextoModulo.progreso.errores[q.id]?.fallos>0).sort((a,b)=>contextoModulo.progreso.errores[b.id].fallos-contextoModulo.progreso.errores[a.id].fallos);
          if(!lista.length){contextoModulo.contenido.append(contextoModulo.mensaje("Aún no hay errores registrados."));return;}
          contextoModulo.contenido.append(contextoModulo.boton("Repasar sólo mis errores pendientes",()=>{const pool=lista.filter(q=>contextoModulo.progreso.errores[q.id].pendiente);contextoModulo.soloErrores=true;contextoModulo.modo="quiz";contextoModulo.comenzarSesion(false,20,pool);}));
          lista.forEach(q=>{const e=contextoModulo.progreso.errores[q.id],card=contextoModulo.nodo("div",null,{class:"study-card"});card.append(contextoModulo.nodo("p",q.pregunta),contextoModulo.mensaje(e.fallos+" fallos / "+e.intentos+" intentos · "+(e.pendiente?"Pendiente de repaso":"Acertada en el último repaso")),contextoModulo.boton("Repasar esta pregunta",()=>{contextoModulo.modo="quiz";contextoModulo.comenzarSesion(false,20,[q]);}));contextoModulo.contenido.append(card);});
        }

export default {id:"errores",titulo:"Errores",montar:panelErrores,desmontar(){}};
