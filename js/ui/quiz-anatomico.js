// Funciones extraídas con referencias explícitas al contexto compartido.
export function mezclar(contextoModulo,lista) {
        const copia=[...lista];
        for(let i=copia.length-1;i>0;i--) {
          const j=Math.floor(Math.random()*(i+1));
          [copia[i],copia[j]]=[copia[j],copia[i]];
        }
        return copia;
      }
export function iniciarQuiz(contextoModulo) {
        if(contextoModulo.partes.size<4) { contextoModulo.avisar("El quiz requiere al menos cuatro estructuras cargadas."); return; }
        contextoModulo.estado.quiz={activo:true,id:null,aciertos:0,total:0,respondido:false};
        contextoModulo.$("quiz-card").hidden=false;
        contextoModulo.$("quiz-toggle").setAttribute("aria-pressed","true");
        contextoModulo.$("quiz-toggle").textContent="Terminar quiz";
        contextoModulo.$("tooltip").hidden=true;
        contextoModulo.estado.hover=null;
        contextoModulo.siguientePregunta();
      }
export function siguientePregunta(contextoModulo) {
        const opcionesBase=[...contextoModulo.partes.values()].filter(p=>!p.id.startsWith("externa_") && p.id!=="piel");
        if(opcionesBase.length<4) { contextoModulo.terminarQuiz(); contextoModulo.avisar("Faltan cuatro estructuras identificadas para generar preguntas."); return; }
        const candidatos=opcionesBase.filter(p=>p.id!==contextoModulo.estado.quiz.id);
        const elegido=candidatos[Math.floor(Math.random()*candidatos.length)];
        contextoModulo.estado.quiz.id=elegido.id;
        contextoModulo.estado.quiz.respondido=false;
        contextoModulo.estado.corte=false;
        contextoModulo.$("clip-enabled").checked=false;
        contextoModulo.$("quiz-feedback").textContent="";
        contextoModulo.$("quiz-next").hidden=true;
        contextoModulo.$("quiz-options").replaceChildren();
        contextoModulo.$("quiz-score").textContent=contextoModulo.estado.quiz.aciertos+" / "+contextoModulo.estado.quiz.total;
        const distractores=contextoModulo.mezclar(opcionesBase.filter(p=>p.id!==elegido.id)).slice(0,3);
        contextoModulo.mezclar([elegido,...distractores]).forEach(p=>{
          const b=document.createElement("button");
          b.textContent=p.meta.nombre;
          b.onclick=()=>contextoModulo.responderQuiz(p.id);
          contextoModulo.$("quiz-options").append(b);
        });
        contextoModulo.seleccionar(elegido.id,{estudio:true});
      }
export function responderQuiz(contextoModulo,id) {
        if(contextoModulo.estado.quiz.respondido) return;
        contextoModulo.estado.quiz.respondido=true;
        contextoModulo.estado.quiz.total++;
        const correcta=id===contextoModulo.estado.quiz.id;
        if(correcta) contextoModulo.estado.quiz.aciertos++;
        const meta=contextoModulo.catalogo.get(contextoModulo.estado.quiz.id);
        contextoModulo.$("quiz-feedback").textContent=(correcta?"Correcto. ":"La respuesta es "+meta.nombre+". ")+meta.funcion;
        contextoModulo.$("quiz-feedback").style.color=correcta?"var(--accent)":"var(--danger)";
        contextoModulo.$("quiz-score").textContent=contextoModulo.estado.quiz.aciertos+" / "+contextoModulo.estado.quiz.total;
        [...contextoModulo.$("quiz-options").children].forEach(b=>b.disabled=true);
        contextoModulo.$("quiz-next").hidden=false;
      }
export function terminarQuiz(contextoModulo) {
        const {aciertos,total}=contextoModulo.estado.quiz;
        contextoModulo.estado.quiz.activo=false;
        contextoModulo.$("quiz-card").hidden=true;
        contextoModulo.$("quiz-toggle").setAttribute("aria-pressed","false");
        contextoModulo.$("quiz-toggle").textContent="Iniciar quiz anatómico";
        if(contextoModulo.estado.seleccionado) contextoModulo.mostrarInformacion(contextoModulo.estado.seleccionado);
        contextoModulo.solicitarRender();
        if(total) contextoModulo.avisar("Quiz finalizado: "+aciertos+" respuestas correctas de "+total+".");
      }
