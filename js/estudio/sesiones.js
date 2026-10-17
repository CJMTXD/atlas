import {registrar} from "./extra-store.js";
// Funciones extraídas con referencias explícitas al contexto compartido.
export function comenzarSesion(contextoModulo,examen,minutos=20,lista=null){
          const pool=lista||contextoModulo.bancoFiltrado();if(!pool.length){contextoModulo.contextoModulo.avisar("No hay preguntas con esos filtros.");return;}
          if(examen&&pool.length<20){contextoModulo.contextoModulo.avisar("Se necesitan al menos 20 preguntas distintas con los filtros elegidos.");return;}
          const preguntas=contextoModulo.barajar(pool).slice(0,examen?20:10);
          contextoModulo.sesion={examen,inicio:Date.now(),limite:examen?Date.now()+minutos*60000:null,items:preguntas.map(contextoModulo.prepararPregunta),indice:0,terminada:false};
          if(contextoModulo.contextoModulo.estado.quiz.activo)contextoModulo.contextoModulo.terminarQuiz();
          if(examen){clearInterval(contextoModulo.cronometro);contextoModulo.cronometro=setInterval(contextoModulo.actualizarReloj,500);}
          contextoModulo.mostrarPregunta();
        }
export function formatoTiempo(contextoModulo,seg){seg=Math.max(0,Math.round(seg));return Math.floor(seg/60)+":"+String(seg%60).padStart(2,"0");}
export function actualizarReloj(contextoModulo){if(!contextoModulo.sesion||contextoModulo.sesion.terminada||!contextoModulo.sesion.examen)return;const quedan=Math.max(0,(contextoModulo.sesion.limite-Date.now())/1000);const n=contextoModulo.contextoModulo.$("study-clock");if(n)n.textContent="Tiempo restante: "+contextoModulo.formatoTiempo(quedan);if(quedan<=0)contextoModulo.finalizarSesion("Tiempo agotado");}
export function mostrarPregunta(contextoModulo){
          contextoModulo.limpiar(contextoModulo.contenido);const item=contextoModulo.sesion.items[contextoModulo.sesion.indice],q=item.q;
          contextoModulo.titulo((contextoModulo.sesion.examen?"Simulacro":"Quiz")+" · "+(contextoModulo.sesion.indice+1)+" / "+contextoModulo.sesion.items.length);
          contextoModulo.contenido.append(contextoModulo.mensaje(q.seccion+" · dificultad: "+q.dificultad));
          if(contextoModulo.sesion.examen){contextoModulo.contenido.append(contextoModulo.nodo("p","",{id:"study-clock",class:"study-timer","aria-live":"off"}));contextoModulo.actualizarReloj();if(contextoModulo.sesion.terminada)return;}
          contextoModulo.contenido.append(contextoModulo.nodo("p",q.pregunta));
          const zona=contextoModulo.nodo("div",null,{class:"study-options",id:"study-options"});contextoModulo.contenido.append(zona);
          if(item.tipo==="multiple")item.opciones.forEach((s,i)=>zona.append(contextoModulo.boton((i+1)+". "+s,()=>contextoModulo.responder(s),{"data-answer-index":i})));
          if(item.tipo==="vf"){
            zona.append(contextoModulo.nodo("p","Respuesta propuesta: "+item.propuesta));
            zona.append(contextoModulo.mensaje("¿Corresponde a la respuesta del documento para esta pregunta?"));
            [true,false].forEach((v,i)=>zona.append(contextoModulo.boton((i+1)+". "+(v?"Verdadero":"Falso"),()=>contextoModulo.responder(v),{"data-answer-index":i})));
          }
          if(item.tipo==="completar"){
            zona.append(contextoModulo.nodo("p",item.plantilla));const input=contextoModulo.nodo("input",null,{type:"text",autocomplete:"off","aria-label":"Completar el espacio en blanco",id:"study-blank"});
            const enviar=()=>{if(!input.value.trim())return;contextoModulo.responder(input.value);};input.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();e.stopPropagation();enviar();}};zona.append(input,contextoModulo.boton("Comprobar",enviar));
          }
          if(item.tipo==="ordenar")contextoModulo.dibujarOrden(zona,item);
          contextoModulo.contenido.append(contextoModulo.nodo("div",null,{id:"study-feedback","aria-live":"polite"}));
          const next=contextoModulo.boton(contextoModulo.sesion.indice===contextoModulo.sesion.items.length-1?"Finalizar":"Siguiente",contextoModulo.siguiente,{id:"study-next"});next.disabled=true;contextoModulo.contenido.append(next);
          contextoModulo.contenido.append(contextoModulo.boton("Finalizar sesión",()=>contextoModulo.finalizarSesion("Sesión finalizada"),{style:"margin-left:8px"}));
          contextoModulo.contenido.scrollTop=0;
        }
export function responder(contextoModulo,valor){
          if(!contextoModulo.sesion||contextoModulo.sesion.terminada)return;const item=contextoModulo.sesion.items[contextoModulo.sesion.indice];if(item.correcta!==null)return;
          if(contextoModulo.sesion.examen&&Date.now()>=contextoModulo.sesion.limite){contextoModulo.finalizarSesion("Tiempo agotado");return;}
          item.respuesta=valor;item.correcta=item.tipo==="multiple"?valor===item.q.respuesta:item.tipo==="completar"?contextoModulo.canon(valor)===contextoModulo.canon(item.solucion):item.tipo==="vf"?valor===item.esVerdad:JSON.stringify(valor)===JSON.stringify(item.q.pasos);
          contextoModulo.contextoModulo.$("study-options").querySelectorAll("button,input").forEach(b=>b.disabled=true);contextoModulo.contextoModulo.$("study-next").disabled=false;
          if(!contextoModulo.sesion.examen){
            const feedback=contextoModulo.contextoModulo.$("study-feedback");feedback.className="study-feedback"+(item.correcta?"":" error");feedback.textContent=(item.correcta?"Correcto. ":"Para repasar. ")+(item.q.origen==="usuario"?"Contenido adicional, verificar con tu material. Respuesta del banco propio: ":"Respuesta del documento: ")+item.q.respuesta;
            contextoModulo.resaltarEstructura(item.q.estructuraRelacionada);
          }else contextoModulo.contextoModulo.$("study-feedback").textContent="Respuesta registrada.";
        }
export function siguiente(contextoModulo){if(!contextoModulo.sesion||contextoModulo.sesion.terminada||contextoModulo.sesion.items[contextoModulo.sesion.indice].correcta===null)return;if(++contextoModulo.sesion.indice>=contextoModulo.sesion.items.length)contextoModulo.finalizarSesion("Sesión completada");else contextoModulo.mostrarPregunta();}
export function finalizarSesion(contextoModulo,motivo){
          if(!contextoModulo.sesion||contextoModulo.sesion.terminada)return;contextoModulo.sesion.terminada=true;clearInterval(contextoModulo.cronometro);contextoModulo.cronometro=null;
          const temas={},total=contextoModulo.sesion.examen?contextoModulo.sesion.items.length:contextoModulo.sesion.items.filter(x=>x.correcta!==null).length;let aciertos=0;
          for(const item of contextoModulo.sesion.items){if(!contextoModulo.sesion.examen&&item.correcta===null)continue;const q=item.q;const correcta=item.correcta===true;if(correcta)aciertos++;(temas[q.seccion]??={total:0,aciertos:0}).total++;if(correcta)temas[q.seccion].aciertos++;
            if(item.correcta===null)continue;const previo=contextoModulo.progreso.errores[q.id]||{},e={intentos:Number(previo.intentos)||0,fallos:Number(previo.fallos)||0,pendiente:!!previo.pendiente};e.intentos++;if(!correcta){e.fallos++;e.pendiente=true;}else e.pendiente=false;contextoModulo.progreso.errores[q.id]=e;}
          const resumen={aciertos,total,segundos:(Date.now()-contextoModulo.sesion.inicio)/1000,temas,fecha:Date.now()};registrar(resumen);contextoModulo.progreso.sesiones.push(resumen);contextoModulo.progreso.sesiones=contextoModulo.progreso.sesiones.slice(-50);contextoModulo.guardar();
          contextoModulo.limpiar(contextoModulo.contenido);contextoModulo.titulo(motivo);contextoModulo.contenido.append(contextoModulo.nodo("p",aciertos+" / "+total,{class:"study-result"}),contextoModulo.mensaje("Tiempo: "+contextoModulo.formatoTiempo(resumen.segundos)+" · "+Math.round(aciertos/Math.max(1,total)*100)+"%"));
          const tabla=contextoModulo.nodo("table",null,{class:"study-table"});const cab=contextoModulo.nodo("tr");cab.append(contextoModulo.nodo("th","Sección"),contextoModulo.nodo("th","Resultado"));tabla.append(cab);Object.entries(temas).forEach(([nombre,t])=>{const tr=contextoModulo.nodo("tr");tr.append(contextoModulo.nodo("td",nombre),contextoModulo.nodo("td",t.aciertos+" / "+t.total));tabla.append(tr);});contextoModulo.contenido.append(tabla);
          const reforzar=Object.entries(temas).filter(([,t])=>t.aciertos<t.total).map(([s])=>s);contextoModulo.contenido.append(contextoModulo.mensaje(total===0?"No se respondieron preguntas.":reforzar.length?"Temas a reforzar: "+reforzar.join("; "):"Todas las preguntas de esta sesión fueron correctas."));
          for(const item of contextoModulo.sesion.items){const d=contextoModulo.nodo("details",null,{class:"study-card"});d.append(contextoModulo.nodo("summary",(item.correcta?"✓ ":item.correcta===null?"Sin responder · ":"Repasar · ")+item.q.pregunta),contextoModulo.nodo("p","Tu respuesta: "+(item.respuesta===null?"Sin responder":Array.isArray(item.respuesta)?item.respuesta.join(" → "):typeof item.respuesta==="boolean"?(item.respuesta?"Verdadero":"Falso"):String(item.respuesta))),contextoModulo.nodo("p",(item.q.origen==="usuario"?"Contenido adicional, verificar con tu material. Respuesta del banco propio: ":"Respuesta del documento: ")+item.q.respuesta));if(item.q.estructuraRelacionada)d.append(contextoModulo.boton("Ver estructura",()=>contextoModulo.resaltarEstructura(item.q.estructuraRelacionada)));contextoModulo.contenido.append(d);}
          contextoModulo.contenido.append(contextoModulo.boton("Otra sesión",()=>{contextoModulo.sesion=null;contextoModulo.soloErrores=false;contextoModulo.cambiarModo(contextoModulo.modo==="examen"?"examen":"quiz");}),contextoModulo.boton("Repasar errores",()=>{contextoModulo.sesion=null;contextoModulo.cambiarModo("errores");}));
        }
