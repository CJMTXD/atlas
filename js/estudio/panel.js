// Funciones extraídas con referencias explícitas al contexto compartido.
export function iniciarEstudio(contextoModulo) {
        // Toda inserción de texto se realiza mediante textContent. No se evalúan datos.
        const nodo=(tag,texto,attrs={})=>{const n=document.createElement(tag);if(texto!==null&&texto!==undefined)n.textContent=texto;for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
        const boton=(texto,fn,attrs={})=>{const b=nodo("button",texto,{type:"button",...attrs});b.onclick=fn;return b;};
        const svgNodo=(tag,attrs={},texto)=>{const n=document.createElementNS("http://www.w3.org/2000/svg",tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));if(texto!==undefined)n.textContent=texto;return n;};
        const limpiar=n=>n.replaceChildren();
        const mensaje=(texto,clase="study-status")=>nodo("p",texto,{class:clase});
        const barajar=lista=>{const x=[...lista];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
        const canon=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
        // Respuestas equivalentes no deben aparecer como distractores entre sí.
        const claveRespuesta=s=>/urotelio/i.test(s)?"epiteliodetransicionurotelio":canon(s);
        const clave="atlas-urinario-estudio-v1";
        let progreso={tarjetas:{},errores:{},autoevaluacion:{},sesiones:[]},persistente=true;
        try{const x=JSON.parse(localStorage.getItem(clave)||"null");if(x&&typeof x==="object")for(const k of ["tarjetas","errores","autoevaluacion"])if(x[k]&&typeof x[k]==="object"&&!Array.isArray(x[k]))progreso[k]=x[k];if(Array.isArray(x?.sesiones))progreso.sesiones=x.sesiones.slice(-50);}catch{persistente=false;}
        function guardar(){try{localStorage.setItem(clave,JSON.stringify(progreso));}catch{persistente=false;}}
        let modo="inicio",sesion=null,cronometro=null,flash=null,svgActivo=null,animacionSVG=null;
        let filtroSeccion="todas",filtroDificultad="todas",soloErrores=false;
        const panelEst=nodo("section",null,{id:"study-panel",class:"study-panel","aria-label":"Estudiar aparato urinario"});panelEst.hidden=true;
        const cab=nodo("div",null,{class:"study-header"});cab.append(nodo("h2","Estudiar"),boton("Cerrar",cerrar,{"aria-label":"Cerrar panel Estudiar"}));
        const navegacion=nodo("nav",null,{class:"study-nav","aria-label":"Modos de estudio"}),contenido=nodo("div",null,{class:"study-body",id:"study-content",tabindex:"-1"});
        panelEst.append(cab,navegacion,contenido);document.querySelector("main").append(panelEst);
        const abrir=boton("Estudiar",()=>{if(contextoModulo.vistaMovil.matches){contextoModulo.estadoPanel("left",false);contextoModulo.estadoPanel("right",false);}panelEst.hidden=false;abrir.setAttribute("aria-expanded","true");if(contextoModulo.estado.quiz.activo)contextoModulo.terminarQuiz();if(svgActivo)svgActivo.unpauseAnimations?.();contenido.focus({preventScroll:true});},{id:"study-open","aria-expanded":"false","aria-controls":"study-panel"});
        document.querySelector(".header-actions").prepend(abrir);
        const tabs=[["inicio","Inicio"],["quiz","Quiz del banco"],["flash","Flashcards"],["ruta","Recorrido"],["nefrona","Nefrona"],["histologia","Histología"],["epitelios","Epitelios"],["comparar","Hombre / mujer"],["auto","Autoevaluación"],["examen","Simulacro"],["errores","Errores"]];
        tabs.forEach(([id,label])=>navegacion.append(boton(label,()=>cambiarModo(id),{"data-mode":id,"aria-pressed":"false"})));
        function cerrar({devolverFoco=true}={}){panelEst.hidden=true;abrir.setAttribute("aria-expanded","false");svgActivo?.pauseAnimations?.();if(contextoModulo.urinario.flujo){contextoModulo.urinario.pausa=true;if(contextoModulo.$("urine-play"))contextoModulo.$("urine-play").textContent="Continuar";}contextoModulo.solicitarRender();if(devolverFoco)abrir.focus({preventScroll:true});}
        function cambiarModo(nuevo){
          if(sesion&&!sesion.terminada){finalizarSesion("Sesión interrumpida al cambiar de modo");return;}
          if(modo==="flash"&&flash?.vistas){resumenFlash();return;}
          svgActivo?.pauseAnimations?.();svgActivo=null;animacionSVG=null;
          if(modo==="ruta"){contextoModulo.urinario.flujo=false;contextoModulo.particulasOrina.visible=false;contextoModulo.urinario.callback=null;contextoModulo.solicitarRender();}
          if(modo==="comparar"){contextoModulo.urinario.comparar=false;contextoModulo.aplicarEstado();}
          modo=nuevo;limpiar(contenido);navegacion.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.mode===modo)));
          const vistas={inicio:inicio,quiz:configurarQuiz,flash:iniciarFlash,ruta:recorrido,nefrona:nefrona,histologia:histologia,epitelios:tablaEpitelios,comparar:comparador,auto:autoevaluacion,examen:configurarExamen,errores:panelErrores};vistas[modo]();
          contenido.scrollTop=0;
        }
        function faltaBanco(){if(contextoModulo.BANCO.length)return false;contenido.append(mensaje("Pendiente del DOCX: este modo necesita las preguntas y respuestas exactas de Cuestionario_Aparato_Urinario_Laboratorio_11.docx. No se han creado preguntas de sustitución.","study-alert"));return true;}
        function titulo(texto){contenido.append(nodo("h3",texto));}
        function inicio(){
          titulo("Aparato urinario · laboratorio 11");
          contenido.append(mensaje(contextoModulo.FUENTE_DOCX?"Fuente: "+contextoModulo.FUENTE_DOCX:"Falta adjuntar el DOCX para completar el banco y la autoevaluación.",contextoModulo.FUENTE_DOCX?"study-status":"study-alert"));
          contenido.append(mensaje(contextoModulo.BANCO.length+" preguntas del documento · 7 secciones · progreso local"));
          const acciones=nodo("div",null,{class:"study-flex"});acciones.append(boton("Explorar aparato urinario",()=>contextoModulo.estudiarUrinario()),boton("Ver interior del riñón",()=>{contextoModulo.estudiarUrinario();contextoModulo.seleccionar("rinon_derecho");const c=contextoModulo.puntoParte("rinon_derecho");contextoModulo.$("clip-enabled").checked=true;contextoModulo.$("clip-axis").value="z";contextoModulo.$("clip-position").value=100*(c.z-(contextoModulo.cajaCuerpo.min.z-.1))/(contextoModulo.cajaCuerpo.max.z-contextoModulo.cajaCuerpo.min.z+.2);contextoModulo.actualizarCorte();}),boton("Volver al cuerpo completo",()=>{contextoModulo.urinario.solo=false;contextoModulo.urinario.comparar=false;contextoModulo.restaurar();contextoModulo.vista("front");}));contenido.append(acciones);
          contenido.append(nodo("p","Explora el riñón en corte, sigue el recorrido de la orina y compara los epitelios. Los esquemas complementarios están identificados como representaciones didácticas."));
          const card=nodo("div",null,{class:"study-card"});card.append(nodo("strong","Atajos de estudio"),nodo("p","1–4: elegir opción · Enter: siguiente · Espacio: voltear flashcard · Esc: cerrar Estudiar."));contenido.append(card);
          if(contextoModulo.OBSERVACIONES_DOCX.length){const notas=nodo("details",null,{class:"study-card"});notas.append(nodo("summary","Notas sobre la fuente y los esquemas"));contextoModulo.OBSERVACIONES_DOCX.forEach(t=>notas.append(nodo("p",t)));contenido.append(notas);}
          if(!persistente)contenido.append(mensaje("El navegador no permite guardar el progreso. Puedes estudiar durante esta sesión.","study-alert"));
          if(progreso.sesiones.length){const ultima=progreso.sesiones.at(-1);contenido.append(mensaje("Última sesión: "+ultima.aciertos+" / "+ultima.total+" · "+formatoTiempo(ultima.segundos)));}
        }
        function filtros(){
          const fila=nodo("div",null,{class:"study-flex"});
          const seccion=nodo("select",null,{"aria-label":"Filtrar por sección"}),dificultad=nodo("select",null,{"aria-label":"Filtrar por dificultad"});
          seccion.append(nodo("option","Todas las secciones",{value:"todas"}));contextoModulo.SECCIONES.forEach(x=>seccion.append(nodo("option",x,{value:x})));
          dificultad.append(nodo("option","Todas las dificultades",{value:"todas"}));[...new Set(contextoModulo.BANCO.map(q=>String(q.dificultad)))].sort().forEach(x=>dificultad.append(nodo("option",x,{value:x})));
          seccion.value=filtroSeccion;dificultad.value=filtroDificultad;
          seccion.onchange=()=>filtroSeccion=seccion.value;dificultad.onchange=()=>filtroDificultad=dificultad.value;
          fila.append(seccion,dificultad);contenido.append(fila);
        }
        function bancoFiltrado(){return contextoModulo.BANCO.filter(q=>(filtroSeccion==="todas"||q.seccion===filtroSeccion)&&(filtroDificultad==="todas"||String(q.dificultad)===filtroDificultad)&&(!soloErrores||progreso.errores[q.id]?.pendiente));}
        function configurarQuiz(){soloErrores=false;titulo("Quiz del banco");if(faltaBanco())return;filtros();contenido.append(mensaje("Combina opción múltiple, completar, verdadero/falso y ordenar el recorrido renal. Las respuestas y los distractores proceden del banco del documento."));contenido.append(boton("Comenzar",()=>comenzarSesion(false)));}
        function configurarExamen(){
          soloErrores=false;titulo("Simulacro de examen");if(faltaBanco())return;filtros();
          const label=nodo("label","Duración en minutos "),input=nodo("input",null,{type:"number",min:1,max:120,value:20,id:"exam-minutes","aria-label":"Minutos del simulacro"});label.append(input);contenido.append(label);
          contenido.append(mensaje("20 preguntas distintas. No se muestra retroalimentación ni se resalta la estructura hasta finalizar. El reloj continúa si cierras el panel."));
          contenido.append(boton("Iniciar simulacro",()=>{const minutos=Number(input.value);if(!Number.isFinite(minutos)||minutos<1||minutos>120){contextoModulo.avisar("Elige una duración entre 1 y 120 minutos.");return;}comenzarSesion(true,minutos);}));
        }
        function candidatosDistractores(q){
          return barajar(contextoModulo.BANCO.filter(o=>o.id!==q.id&&o.seccion===q.seccion&&claveRespuesta(o.respuesta)!==claveRespuesta(q.respuesta)))
            .sort((a,b)=>Number(b.estructuraRelacionada===q.estructuraRelacionada)-Number(a.estructuraRelacionada===q.estructuraRelacionada));
        }
        function prepararPregunta(q,i){
          const tipo=q.tipo==="ordenar"&&Array.isArray(q.pasos)?"ordenar":["multiple","completar","vf"][i%3];
          const item={q,tipo,respuesta:null,correcta:null};
          if(tipo==="multiple"){
            const unicas=[...new Map(candidatosDistractores(q).map(o=>[claveRespuesta(o.respuesta),o.respuesta])).values()].slice(0,3);
            if(unicas.length<3)item.tipo="completar";else item.opciones=barajar([q.respuesta,...unicas]);
          }
          if(item.tipo==="completar"){
            const palabras=[...q.respuesta.matchAll(/[\p{L}\p{N}][\p{L}\p{N},.–-]*/gu)].filter(m=>m[0].length>=4||/\d/.test(m[0]));
            const hueco=palabras.length?palabras[Math.floor(Math.random()*palabras.length)]:{0:q.respuesta,index:0};
            item.solucion=hueco[0];item.plantilla=q.respuesta.slice(0,hueco.index)+" ______ "+q.respuesta.slice(hueco.index+hueco[0].length);
          }
          if(item.tipo==="vf"){
            const candidato=candidatosDistractores(q)[0];item.esVerdad=!candidato||Math.random()>.5;item.propuesta=item.esVerdad?q.respuesta:candidato.respuesta;
          }
          if(item.tipo==="ordenar")item.orden=barajar(q.pasos);
          return item;
        }
        function comenzarSesion(examen,minutos=20,lista=null){
          const pool=lista||bancoFiltrado();if(!pool.length){contextoModulo.avisar("No hay preguntas con esos filtros.");return;}
          if(examen&&pool.length<20){contextoModulo.avisar("Se necesitan al menos 20 preguntas distintas con los filtros elegidos.");return;}
          const preguntas=barajar(pool).slice(0,examen?20:10);
          sesion={examen,inicio:Date.now(),limite:examen?Date.now()+minutos*60000:null,items:preguntas.map(prepararPregunta),indice:0,terminada:false};
          if(contextoModulo.estado.quiz.activo)contextoModulo.terminarQuiz();
          if(examen){clearInterval(cronometro);cronometro=setInterval(actualizarReloj,500);}
          mostrarPregunta();
        }
        function formatoTiempo(seg){seg=Math.max(0,Math.round(seg));return Math.floor(seg/60)+":"+String(seg%60).padStart(2,"0");}
        function actualizarReloj(){if(!sesion||sesion.terminada||!sesion.examen)return;const quedan=Math.max(0,(sesion.limite-Date.now())/1000);const n=contextoModulo.$("study-clock");if(n)n.textContent="Tiempo restante: "+formatoTiempo(quedan);if(quedan<=0)finalizarSesion("Tiempo agotado");}
        document.addEventListener("visibilitychange",actualizarReloj);
        function mostrarPregunta(){
          limpiar(contenido);const item=sesion.items[sesion.indice],q=item.q;
          titulo((sesion.examen?"Simulacro":"Quiz")+" · "+(sesion.indice+1)+" / "+sesion.items.length);
          contenido.append(mensaje(q.seccion+" · dificultad: "+q.dificultad));
          if(sesion.examen){contenido.append(nodo("p","",{id:"study-clock",class:"study-timer","aria-live":"off"}));actualizarReloj();if(sesion.terminada)return;}
          contenido.append(nodo("p",q.pregunta));
          const zona=nodo("div",null,{class:"study-options",id:"study-options"});contenido.append(zona);
          if(item.tipo==="multiple")item.opciones.forEach((s,i)=>zona.append(boton((i+1)+". "+s,()=>responder(s),{"data-answer-index":i})));
          if(item.tipo==="vf"){
            zona.append(nodo("p","Respuesta propuesta: "+item.propuesta));
            zona.append(mensaje("¿Corresponde a la respuesta del documento para esta pregunta?"));
            [true,false].forEach((v,i)=>zona.append(boton((i+1)+". "+(v?"Verdadero":"Falso"),()=>responder(v),{"data-answer-index":i})));
          }
          if(item.tipo==="completar"){
            zona.append(nodo("p",item.plantilla));const input=nodo("input",null,{type:"text",autocomplete:"off","aria-label":"Completar el espacio en blanco",id:"study-blank"});
            const enviar=()=>{if(!input.value.trim())return;responder(input.value);};input.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();e.stopPropagation();enviar();}};zona.append(input,boton("Comprobar",enviar));
          }
          if(item.tipo==="ordenar")dibujarOrden(zona,item);
          contenido.append(nodo("div",null,{id:"study-feedback","aria-live":"polite"}));
          const next=boton(sesion.indice===sesion.items.length-1?"Finalizar":"Siguiente",siguiente,{id:"study-next"});next.disabled=true;contenido.append(next);
          contenido.append(boton("Finalizar sesión",()=>finalizarSesion("Sesión finalizada"),{style:"margin-left:8px"}));
          contenido.scrollTop=0;
        }
        function dibujarOrden(zona,item){
          const lista=nodo("ol",null,{class:"study-ordered"});zona.append(lista);
          const pintar=()=>{limpiar(lista);item.orden.forEach((texto,i)=>{const li=nodo("li");li.append(nodo("span",texto));for(const [delta,simbolo]of [[-1,"↑"],[1,"↓"]]){const b=boton(simbolo,()=>{const j=i+delta;[item.orden[i],item.orden[j]]=[item.orden[j],item.orden[i]];pintar();},{"aria-label":(delta<0?"Subir ":"Bajar ")+texto});b.disabled=i+delta<0||i+delta>=item.orden.length;li.append(b);}lista.append(li);});};pintar();zona.append(boton("Comprobar orden",()=>responder([...item.orden])));
        }
        function responder(valor){
          if(!sesion||sesion.terminada)return;const item=sesion.items[sesion.indice];if(item.correcta!==null)return;
          if(sesion.examen&&Date.now()>=sesion.limite){finalizarSesion("Tiempo agotado");return;}
          item.respuesta=valor;item.correcta=item.tipo==="multiple"?valor===item.q.respuesta:item.tipo==="completar"?canon(valor)===canon(item.solucion):item.tipo==="vf"?valor===item.esVerdad:JSON.stringify(valor)===JSON.stringify(item.q.pasos);
          contextoModulo.$("study-options").querySelectorAll("button,input").forEach(b=>b.disabled=true);contextoModulo.$("study-next").disabled=false;
          if(!sesion.examen){
            const feedback=contextoModulo.$("study-feedback");feedback.className="study-feedback"+(item.correcta?"":" error");feedback.textContent=(item.correcta?"Correcto. ":"Para repasar. ")+"Respuesta del documento: "+item.q.respuesta;
            resaltarEstructura(item.q.estructuraRelacionada);
          }else contextoModulo.$("study-feedback").textContent="Respuesta registrada.";
        }
        function resaltarEstructura(id){if(Array.isArray(id))id=id[0];if(id&&contextoModulo.partes.has(id)){if(contextoModulo.estado.quiz.activo)contextoModulo.terminarQuiz();contextoModulo.seleccionar(id);}}
        function siguiente(){if(!sesion||sesion.terminada||sesion.items[sesion.indice].correcta===null)return;if(++sesion.indice>=sesion.items.length)finalizarSesion("Sesión completada");else mostrarPregunta();}
        function finalizarSesion(motivo){
          if(!sesion||sesion.terminada)return;sesion.terminada=true;clearInterval(cronometro);cronometro=null;
          const temas={},total=sesion.examen?sesion.items.length:sesion.items.filter(x=>x.correcta!==null).length;let aciertos=0;
          for(const item of sesion.items){if(!sesion.examen&&item.correcta===null)continue;const q=item.q;const correcta=item.correcta===true;if(correcta)aciertos++;(temas[q.seccion]??={total:0,aciertos:0}).total++;if(correcta)temas[q.seccion].aciertos++;
            if(item.correcta===null)continue;const previo=progreso.errores[q.id]||{},e={intentos:Number(previo.intentos)||0,fallos:Number(previo.fallos)||0,pendiente:!!previo.pendiente};e.intentos++;if(!correcta){e.fallos++;e.pendiente=true;}else e.pendiente=false;progreso.errores[q.id]=e;}
          const resumen={aciertos,total,segundos:(Date.now()-sesion.inicio)/1000,temas,fecha:Date.now()};progreso.sesiones.push(resumen);progreso.sesiones=progreso.sesiones.slice(-50);guardar();
          limpiar(contenido);titulo(motivo);contenido.append(nodo("p",aciertos+" / "+total,{class:"study-result"}),mensaje("Tiempo: "+formatoTiempo(resumen.segundos)+" · "+Math.round(aciertos/Math.max(1,total)*100)+"%"));
          const tabla=nodo("table",null,{class:"study-table"});const cab=nodo("tr");cab.append(nodo("th","Sección"),nodo("th","Resultado"));tabla.append(cab);Object.entries(temas).forEach(([nombre,t])=>{const tr=nodo("tr");tr.append(nodo("td",nombre),nodo("td",t.aciertos+" / "+t.total));tabla.append(tr);});contenido.append(tabla);
          const reforzar=Object.entries(temas).filter(([,t])=>t.aciertos<t.total).map(([s])=>s);contenido.append(mensaje(total===0?"No se respondieron preguntas.":reforzar.length?"Temas a reforzar: "+reforzar.join("; "):"Todas las preguntas de esta sesión fueron correctas."));
          for(const item of sesion.items){const d=nodo("details",null,{class:"study-card"});d.append(nodo("summary",(item.correcta?"✓ ":item.correcta===null?"Sin responder · ":"Repasar · ")+item.q.pregunta),nodo("p","Tu respuesta: "+(item.respuesta===null?"Sin responder":Array.isArray(item.respuesta)?item.respuesta.join(" → "):typeof item.respuesta==="boolean"?(item.respuesta?"Verdadero":"Falso"):String(item.respuesta))),nodo("p","Respuesta del documento: "+item.q.respuesta));if(item.q.estructuraRelacionada)d.append(boton("Ver estructura",()=>resaltarEstructura(item.q.estructuraRelacionada)));contenido.append(d);}
          contenido.append(boton("Otra sesión",()=>{sesion=null;soloErrores=false;cambiarModo(modo==="examen"?"examen":"quiz");}),boton("Repasar errores",()=>{sesion=null;cambiarModo("errores");}));
        }
        function iniciarFlash(){soloErrores=false;titulo("Flashcards · Leitner de 3 cajas");if(faltaBanco())return;filtros();contenido.append(mensaje("Caja 1: repaso inicial; caja 2: 3 días; caja 3: 7 días. «Repasar» devuelve la tarjeta a caja 1 para revisarla en 10 minutos."));contenido.append(boton("Estudiar tarjetas pendientes",()=>{
          const ahora=Date.now(),lista=barajar(bancoFiltrado().filter(q=>Number(progreso.tarjetas[q.id]?.vence||0)<=ahora));
          if(!lista.length){contextoModulo.avisar("No hay tarjetas pendientes con estos filtros.");return;}
          flash={lista,indice:0,volteada:false,vistas:0,sabidas:0,reforzar:[],inicio:Date.now()};mostrarFlash();}));}
        function mostrarFlash(){
          limpiar(contenido);const q=flash.lista[flash.indice];titulo("Flashcard "+(flash.indice+1)+" / "+flash.lista.length);
          const caja=Math.max(1,Math.min(3,Number(progreso.tarjetas[q.id]?.caja)||1));contenido.append(mensaje(q.seccion+" · Caja "+caja));flash.volteada=false;
          const tarjeta=boton(q.pregunta,voltear,{class:"study-flash",id:"study-flash","aria-pressed":"false"});contenido.append(tarjeta,mensaje("Pulsa la tarjeta o Espacio para mostrar la respuesta."));
          const fila=nodo("div",null,{class:"study-flex"});fila.append(boton("Lo sabía",()=>calificarFlash(true),{id:"flash-yes"}),boton("Repasar",()=>calificarFlash(false),{id:"flash-no"}));fila.querySelectorAll("button").forEach(b=>b.disabled=true);contenido.append(fila,boton("Terminar",resumenFlash));
        }
        function voltear(){if(!flash)return;flash.volteada=!flash.volteada;const q=flash.lista[flash.indice];contextoModulo.$("study-flash").textContent=flash.volteada?q.respuesta:q.pregunta;contextoModulo.$("study-flash").setAttribute("aria-pressed",String(flash.volteada));if(flash.volteada){contextoModulo.$("flash-yes").disabled=false;contextoModulo.$("flash-no").disabled=false;}}
        function calificarFlash(sabida){const q=flash.lista[flash.indice];const anterior=Math.max(1,Math.min(3,Number(progreso.tarjetas[q.id]?.caja)||1));const caja=sabida?Math.min(3,anterior+1):1;progreso.tarjetas[q.id]={caja,vence:Date.now()+(sabida?(caja===2?3:7)*86400000:600000)};guardar();flash.vistas++;if(sabida)flash.sabidas++;else flash.reforzar.push(q.seccion);if(++flash.indice===flash.lista.length)resumenFlash();else mostrarFlash();}
        function resumenFlash(){if(!flash)return;const f=flash;flash=null;limpiar(contenido);titulo("Resumen de flashcards");contenido.append(nodo("p",f.sabidas+" recordadas de "+f.vistas,{class:"study-result"}),mensaje("Tiempo: "+formatoTiempo((Date.now()-f.inicio)/1000)),mensaje(f.reforzar.length?"Temas a reforzar: "+[...new Set(f.reforzar)].join("; "):"Sin temas pendientes en las tarjetas calificadas."),mensaje("Las tarjetas marcadas «Repasar» volverán antes. La autoevaluación de recuerdo no equivale a una nota de examen."),boton("Volver a flashcards",()=>cambiarModo("flash")));}
        function panelErrores(){
          limpiar(contenido);titulo("Preguntas a reforzar");if(faltaBanco())return;
          const lista=contextoModulo.BANCO.filter(q=>progreso.errores[q.id]?.fallos>0).sort((a,b)=>progreso.errores[b.id].fallos-progreso.errores[a.id].fallos);
          if(!lista.length){contenido.append(mensaje("Aún no hay errores registrados."));return;}
          contenido.append(boton("Repasar sólo mis errores pendientes",()=>{const pool=lista.filter(q=>progreso.errores[q.id].pendiente);soloErrores=true;modo="quiz";comenzarSesion(false,20,pool);}));
          lista.forEach(q=>{const e=progreso.errores[q.id],card=nodo("div",null,{class:"study-card"});card.append(nodo("p",q.pregunta),mensaje(e.fallos+" fallos / "+e.intentos+" intentos · "+(e.pendiente?"Pendiente de repaso":"Acertada en el último repaso")),boton("Repasar esta pregunta",()=>{modo="quiz";comenzarSesion(false,20,[q]);}));contenido.append(card);});
        }
        function autoevaluacion(){
          titulo("Autoevaluación del documento");if(contextoModulo.AUTOEVALUACION.length!==7){contenido.append(mensaje("Las siete casillas se incorporarán literalmente al recibir el DOCX. No se han sustituido por una lista genérica.","study-alert"));return;}
          const progresoBar=nodo("progress",null,{max:7,value:0,"aria-label":"Progreso de autoevaluación"}),texto=mensaje("");contenido.append(progresoBar,texto);
          const actualizar=()=>{const n=contextoModulo.AUTOEVALUACION.filter(x=>progreso.autoevaluacion[x.id]).length;progresoBar.value=n;texto.textContent=n+" de 7 objetivos · "+Math.round(n/7*100)+"%";};
          contextoModulo.AUTOEVALUACION.forEach(x=>{const label=nodo("label",null,{class:"study-check"}),check=nodo("input",null,{type:"checkbox"});check.checked=!!progreso.autoevaluacion[x.id];check.onchange=()=>{progreso.autoevaluacion[x.id]=check.checked;guardar();actualizar();};label.append(check,nodo("span",x.texto));contenido.append(label);});actualizar();
        }
        function tablaEpitelios(){
          titulo("Tabla de epitelios");let tapadas=true;
          const toggle=boton("Mostrar todas las respuestas",()=>{tapadas=!tapadas;toggle.textContent=tapadas?"Mostrar todas las respuestas":"Tapar todas las respuestas";pintar();});contenido.append(toggle);
          const tabla=nodo("table",null,{class:"study-table"});contenido.append(tabla);
          function pintar(){limpiar(tabla);const h=nodo("tr");h.append(nodo("th","Estructura"),nodo("th","Epitelio"));tabla.append(h);contextoModulo.EPITELIOS.forEach(x=>{const tr=nodo("tr"),td=nodo("td"),b=boton(tapadas?"Revelar respuesta":x.epitelio,()=>{const revelado=b.getAttribute("aria-expanded")==="true";b.textContent=revelado?"Revelar respuesta":x.epitelio;b.setAttribute("aria-expanded",String(!revelado));},{"aria-expanded":String(!tapadas),"aria-label":"Epitelio de "+x.estructura});td.append(b);tr.append(nodo("td",x.estructura),td);tabla.append(tr);});}pintar();
          contenido.append(mensaje("Tabla transcrita literalmente del apartado «Repaso rápido: epitelios que debes memorizar» del DOCX."));
        }
        function recorrido(){
          titulo("Recorrido de la orina");contextoModulo.estudiarUrinario();contextoModulo.urinario.comparar=false;contextoModulo.estado.explosion=contextoModulo.estado.explosionObjetivo=0;contextoModulo.$("explode").value=0;contextoModulo.$("explode-value").textContent="0%";for(const p of contextoModulo.partes.values())p.grupo.position.copy(p.base);contextoModulo.prepararRutaOrina();
          const rotulo=nodo("p",contextoModulo.estacionesOrina[0].nombre,{class:"study-feedback","aria-live":"polite",id:"urine-station"});contenido.append(rotulo);
          contextoModulo.urinario.callback=t=>rotulo.textContent=t;
          const play=boton("Iniciar",()=>{contextoModulo.urinario.flujo=true;contextoModulo.urinario.pausa=!contextoModulo.urinario.pausa;if(!contextoModulo.particulasOrina.visible)contextoModulo.urinario.pausa=false;contextoModulo.particulasOrina.visible=true;play.textContent=contextoModulo.urinario.pausa?"Continuar":"Pausar";contextoModulo.solicitarRender();},{id:"urine-play"});
          const paso=boton("Paso a paso",()=>{contextoModulo.urinario.flujo=true;contextoModulo.urinario.pausa=true;contextoModulo.particulasOrina.visible=true;contextoModulo.urinario.t=Math.min(1,(Math.max(0,contextoModulo.urinario.estacion)+1)/(contextoModulo.estacionesOrina.length-1));play.textContent="Continuar";contextoModulo.actualizarOrina(0);contextoModulo.solicitarRender();});
          const speed=nodo("select",null,{"aria-label":"Velocidad del recorrido"});[.5,1,2,4].forEach(v=>speed.append(nodo("option",v+"×",{value:v})));speed.value="1";speed.onchange=()=>contextoModulo.urinario.velocidad=Number(speed.value);
          const fila=nodo("div",null,{class:"study-flex"});fila.append(play,paso,speed,boton("Reiniciar",()=>{contextoModulo.urinario.t=0;contextoModulo.urinario.estacion=-1;contextoModulo.urinario.pausa=true;play.textContent="Continuar";contextoModulo.actualizarOrina(0);contextoModulo.solicitarRender();}));contenido.append(fila);
          const lista=nodo("ol");contextoModulo.estacionesOrina.forEach((x,i)=>{const li=nodo("li");li.append(boton(x.nombre,()=>{contextoModulo.urinario.flujo=true;contextoModulo.urinario.pausa=true;contextoModulo.particulasOrina.visible=true;contextoModulo.urinario.t=i/(contextoModulo.estacionesOrina.length-1);contextoModulo.actualizarOrina(0);rotulo.textContent=x.nombre;if(x.id)resaltarEstructura(x.id);contextoModulo.solicitarRender();}));lista.append(li);});contenido.append(lista,mensaje("Las partículas ilustran el trayecto; su velocidad y cantidad no representan el flujo fisiológico. Según la guía: aproximadamente 1,500 mL de orina al día, aunque la cantidad varía."));
          const orden=nodo("div",null,{class:"study-card"}),pasos=["Papila","Cáliz menor","Cáliz mayor","Pelvis renal","Uréter"];
          orden.append(nodo("h3","Ordena el tramo renal"));const item={orden:barajar(pasos)},ul=nodo("ol",null,{class:"study-ordered"});orden.append(ul);
          const pintar=()=>{limpiar(ul);item.orden.forEach((x,i)=>{const li=nodo("li");li.append(nodo("span",x));for(const d of [-1,1]){const b=boton(d<0?"↑":"↓",()=>{[item.orden[i],item.orden[i+d]]=[item.orden[i+d],item.orden[i]];pintar();},{"aria-label":(d<0?"Subir ":"Bajar ")+x});b.disabled=i+d<0||i+d>=5;li.append(b);}ul.append(li);});};pintar();const feedback=mensaje("");orden.append(boton("Comprobar orden",()=>feedback.textContent=JSON.stringify(item.orden)===JSON.stringify(pasos)?"Correcto: "+pasos.join(" → "):"Repasa el trayecto: "+pasos.join(" → ")),feedback);contenido.append(orden);
        }
        function comparador(){
          titulo("Comparador hombre / mujer");contextoModulo.urinario.comparar=true;contextoModulo.estudiarUrinario();
          const fila=nodo("div",null,{class:"study-flex"});for(const [sexo,label]of [["masculino","Hombre"],["femenino","Mujer"]])fila.append(boton(label,()=>{contextoModulo.cambiarSexoUrinario(sexo);contextoModulo.estudiarUrinario(sexo);sincronizarSexo();},{"data-sex":sexo,"aria-pressed":String(sexo===contextoModulo.urinario.sexo)}));contenido.append(fila);
          const table=nodo("table",null,{class:"study-table"});for(const row of [["Característica","Hombre","Mujer"],["Longitud uretral","15–20 cm","3–6 cm"],["Porciones","Prostática, membranosa, esponjosa o peneana","No se divide en esas tres porciones masculinas"],["Relación vesical posterior","Recto, con estructuras interpuestas","Útero y vagina"],["Función urinaria","Conducir orina al exterior","Conducir orina al exterior"]]){const tr=nodo("tr");row.forEach((x,i)=>tr.append(nodo(i===0?"th":"td",x)));table.append(tr);}contenido.append(table,mensaje("Longitudes aproximadas conservadas de la respuesta 52 del DOCX. Las dos variantes se muestran de forma excluyente; el contexto pélvico femenino es procedural y no una segmentación del cuerpo masculino de BodyParts3D."));
        }
        function sincronizarSexo(){panelEst.querySelectorAll("[data-sex]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.sex===contextoModulo.urinario.sexo)));}

        /* Esquemas SVG y juegos histológicos: construidos con nodos DOM. */
        function dibujoEpitelio(tipo,conTitulo=true){
          const svg=svgNodo("svg",{viewBox:"0 0 360 145",class:"study-small-svg",role:"img","aria-label":conTitulo?tipo:"Esquema de epitelio para identificar"});
          svg.append(svgNodo("path",{d:"M15 122 H345",stroke:"#bb8999","stroke-width":4}));
          const plano=tipo==="Plano simple",transicion=tipo==="Transición (urotelio)",cepillo=tipo.includes("cepillo");
          const filas=transicion?3:1,alto=plano?16:transicion?25:55;
          for(let fila=0;fila<filas;fila++)for(let i=0;i<7;i++){
            const x=20+i*46+(fila%2?7:0),y=121-(fila+1)*alto;
            svg.append(svgNodo("rect",{x,y,width:44,height:alto-2,rx:transicion&&fila===2?17:plano?7:9,fill:transicion?"#b998ca":"#dfb4b0",stroke:"#8e647a","stroke-width":1.5}));
            svg.append(svgNodo("ellipse",{cx:x+22,cy:y+alto*.58,rx:plano?9:7,ry:plano?3:7,fill:"#765482"}));
            if(cepillo)for(let j=0;j<9;j++)svg.append(svgNodo("path",{d:`M${x+j*5} ${y}v-10`,stroke:"#a36880","stroke-width":2}));
          }
          svg.append(svgNodo("text",{x:180,y:22,"text-anchor":"middle","font-size":12},conTitulo?tipo:"Luz"));return svg;
        }
        function histologia(){
          titulo("Histología del aparato urinario");const tipos=["Plano simple","Cúbico simple con borde en cepillo","Cúbico simple","Transición (urotelio)"];
          tipos.forEach(t=>{const card=nodo("div",null,{class:"study-card"});card.append(nodo("h3",t),dibujoEpitelio(t),mensaje(t.includes("cepillo")?"Túbulo proximal: el borde en cepillo corresponde a microvellosidades apicales; su luz suele verse menos definida.":t==="Cúbico simple"?"Túbulo distal: sin borde en cepillo prominente; luz más definida o más amplia en el esquema de comparación.":t==="Plano simple"?"Capa parietal de la cápsula de Bowman.":"Uréter y vejiga; epitelio especializado para distenderse."));contenido.append(card);});
          const juego=nodo("div",null,{class:"study-card"});contenido.append(juego);let aciertos=0,total=0;
          function preguntar(distal=false){limpiar(juego);const elegido=distal?barajar([tipos[1],tipos[2]])[0]:barajar(tipos)[0];juego.append(nodo("h3",distal?"¿Túbulo proximal o distal?":"¿Qué epitelio es?"),dibujoEpitelio(elegido,false));const respuesta=mensaje(""),fila=nodo("div",null,{class:"study-options"});
            const options=distal?["Proximal","Distal"]:tipos;options.forEach(x=>fila.append(boton(x,()=>{const ok=distal?(x==="Proximal"?elegido===tipos[1]:elegido===tipos[2]):x===elegido;total++;if(ok)aciertos++;respuesta.textContent=(ok?"Correcto. ":"Repasa: ")+elegido+". "+(elegido.includes("cepillo")?"El borde en cepillo identifica el proximal.":elegido===tipos[2]?"La luz más definida sin borde en cepillo orienta al distal.":"")+" Resultado: "+aciertos+" / "+total;fila.querySelectorAll("button").forEach(b=>b.disabled=true);})));juego.append(fila,respuesta,boton("Otra imagen",()=>preguntar(distal)),boton(distal?"Juego de epitelios":"Distinguir proximal/distal",()=>preguntar(!distal)));}preguntar();
          contenido.append(mensaje("Esquemas simplificados, no microfotografías. Las pistas de identificación están cotejadas con las respuestas 27 y 29 del DOCX: proximal con borde en cepillo y luz menos definida; distal sin borde en cepillo prominente y luz más amplia y clara."));
        }
        function nefrona(){
          titulo("Nefrona interactiva");
          const svg=svgNodo("svg",{viewBox:"0 0 440 560",class:"study-diagram",role:"group","aria-label":"Nefrona y procesos de formación de orina"});svgActivo=svg;
          const detalle=nodo("div",null,{class:"study-card","aria-live":"polite"});
          const info={
            glomerulo:["Glomérulo","Endotelio capilar fenestrado; forma parte de la barrera de filtración.","Filtrar agua y solutos del plasma, con restricción de células y la mayoría de proteínas."],
            bowman:["Cápsula de Bowman","Capa parietal: epitelio plano simple. Capa visceral: podocitos.","Rodear el ovillo capilar y recibir el filtrado en el espacio capsular."],
            parietal:["Capa parietal","Plano simple.","Delimitar externamente el espacio de Bowman."],
            visceral:["Capa visceral y podocitos","Podocitos, células epiteliales especializadas con pedicelos.","Participar en la barrera de filtración mediante las hendiduras entre pedicelos."],
            espacio:["Espacio de Bowman","Espacio entre las capas parietal y visceral; no es un epitelio.","Recibir el filtrado glomerular."],
            proximal:["Túbulo contorneado proximal","Cúbico simple con borde en cepillo.","Reabsorber gran parte del agua y solutos filtrados y secretar determinadas sustancias."],
            asa:["Asa de Henle","Segmentos delgados: plano simple; segmentos gruesos: cúbico simple.","Contribuir al gradiente osmótico medular y al manejo de agua y solutos."],
            distal:["Túbulo contorneado distal","Cúbico simple, sin borde en cepillo prominente.","Ajustar el transporte de electrolitos en segmentos distales."],
            conector:["Conducto conector","Epitelio simple, con tipos celulares especializados.","Conectar el túbulo distal con el sistema colector y ajustar el transporte tubular."],
            colector:["Conducto colector","Simple cúbico a cilíndrico según su nivel.","Ajustar el agua y electrolitos y conducir la orina hacia conductos papilares."]
          };
          const seleccionarSVG=id=>{const a=info[id];limpiar(detalle);detalle.append(nodo("h3",a[0]),nodo("p","Epitelio / estructura: "+a[1]),nodo("p","Función: "+a[2]));};
          function interactivo(el,id){el.setAttribute("role","button");el.setAttribute("tabindex","0");el.setAttribute("aria-label",info[id][0]);el.onclick=()=>seleccionarSVG(id);el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopPropagation();seleccionarSVG(id);}};svg.append(el);return el;}
          svg.append(svgNodo("text",{x:20,y:24,"font-size":12},"CORTEZA"),svgNodo("path",{d:"M12 240H428",stroke:"#8498a7","stroke-dasharray":"5 5"}),svgNodo("text",{x:20,y:262,"font-size":12},"MÉDULA"));
          interactivo(svgNodo("ellipse",{cx:102,cy:100,rx:61,ry:62,fill:"#e4c9a333",stroke:"#e4b58a","stroke-width":9}),"parietal");
          interactivo(svgNodo("ellipse",{cx:102,cy:100,rx:49,ry:49,fill:"transparent",stroke:"#e5cea5","stroke-width":7}),"espacio");
          const glom=svgNodo("g");for(let i=0;i<8;i++)glom.append(svgNodo("ellipse",{cx:83+(i%3)*17,cy:78+Math.floor(i/3)*17,rx:17,ry:12,fill:"none",stroke:"#cb606c","stroke-width":7}));interactivo(glom,"glomerulo");
          const podo=svgNodo("g");for(let i=0;i<7;i++){const a=i/7*Math.PI*2;podo.append(svgNodo("circle",{cx:102+Math.cos(a)*43,cy:100+Math.sin(a)*43,r:4,fill:"#be99ce"}));}interactivo(podo,"visceral");
          const paths={proximal:"M160 113 C195 65 235 80 220 120 S175 160 225 175 S300 155 270 207",asa:"M270 207 V422 Q270 492 220 492 Q180 492 180 433 V233",distal:"M180 233 C130 220 145 174 180 187 S238 235 270 211 S314 164 330 199",conector:"M330 199 Q350 220 365 212",colector:"M365 65 V518"};
          const colores={proximal:"#d6a57a",asa:"#d8bd8e",distal:"#8cbfcb",conector:"#a6caa1",colector:"#bd95c9"};
          for(const [id,d]of Object.entries(paths))interactivo(svgNodo("path",{d,fill:"none",stroke:colores[id],"stroke-width":id==="colector"?18:14,"stroke-linecap":"round"}),id);
          for(const [texto,x,y]of [["Corpúsculo",44,178],["Proximal",208,61],["Distal",269,154],["Conector",313,242],["Asa de Henle",194,527],["Colector",370,48]])svg.append(svgNodo("text",{x,y,"font-size":11},texto));
          svg.append(svgNodo("path",{d:"M32 196 V465",stroke:"#ad5869","stroke-width":8,fill:"none"}));
          const particula=svgNodo("circle",{r:6,fill:"#85f3d8",visibility:"hidden"}),movimiento=svgNodo("animateMotion",{dur:"3s",repeatCount:"indefinite"});particula.append(movimiento);svg.append(particula);
          contenido.append(svg,detalle);svg.pauseAnimations?.();seleccionarSVG("bowman");
          const procesos={filtracion:["Filtración","M95 96 Q126 92 152 113","Del capilar glomerular al espacio de Bowman."],reabsorcion:["Reabsorción","M218 151 Q120 173 32 225","Del líquido tubular hacia el intersticio y la sangre."],secrecion:["Secreción","M32 225 Q120 173 218 151","Desde la sangre/intersticio hacia la luz tubular."],excrecion:["Excreción","M365 240 V518","Eliminación final de la orina al exterior. Aquí se ilustra la salida del colector; continúa hasta el exterior en Recorrido."]};
          const fila=nodo("div",null,{class:"study-flex"}),leyenda=mensaje("Pulsa una parte para ver su epitelio y función.");
          Object.entries(procesos).forEach(([id,[nombre,path,explicacion]])=>fila.append(boton(nombre,()=>{particula.setAttribute("visibility","visible");movimiento.setAttribute("path",path);svg.unpauseAnimations?.();movimiento.beginElement?.();leyenda.textContent=nombre+": "+explicacion;animacionSVG=id;})));
          fila.append(boton("Pausar",()=>svg.pauseAnimations?.()),boton("Continuar",()=>svg.unpauseAnimations?.()));contenido.append(fila,leyenda,mensaje("Esquema funcional ampliado con información anatómica complementaria al banco literal. Los conductos colectores reciben el flujo de varias nefronas; no son una única prolongación exclusiva de una nefrona."));
          const lista=nodo("div",null,{class:"study-flex"});Object.entries(info).forEach(([id,a])=>lista.append(boton(a[0],()=>seleccionarSVG(id))));contenido.append(lista);
        }
        function atajo(e){
          if(panelEst.hidden)return false;
          if(e.key==="Escape"){e.preventDefault();cerrar();return true;}
          if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest("input,textarea,select"))return false;
          if(/^[1-4]$/.test(e.key)){const b=contenido.querySelector('[data-answer-index="'+(Number(e.key)-1)+'"]');if(b&&!b.disabled){e.preventDefault();b.click();return true;}}
          if(e.target.closest("button")&&e.key==="Enter")return false;
          if(e.key===" "&&e.target.closest("button")?.id!=="study-flash"&&e.target.closest("button"))return false;
          if(e.key==="Enter"&&sesion&&!sesion.terminada&&sesion.items[sesion.indice].correcta!==null){e.preventDefault();siguiente();return true;}
          if(e.key===" "&&modo==="flash"&&flash){e.preventDefault();voltear();return true;}
          return false;
        }
        inicio();
        return {atajo,sincronizarSexo,cerrar,detener(){clearInterval(cronometro);document.removeEventListener("visibilitychange",actualizarReloj);svgActivo?.pauseAnimations?.();}};
      }
