// Navegación por objetivos: las actividades conservan sus propios ciclos de vida.
export const areas={
 exploracion:{titulo:'Explorar 3D',descripcion:'Observa las estructuras y comprende cómo se relacionan.',grupos:[
  ['Anatomía en movimiento',['ruta','fisiologia','comparar']],
  ['Herramientas del visor',['herramientas']]]},
 estudio:{titulo:'Estudiar',descripcion:'Elige cómo quieres practicar hoy. Una actividad a la vez.',grupos:[
  ['Practicar y recordar',['quiz','flash','anatomico']],
  ['Preparar el examen',['examen','practico']],
  ['Histología y esquemas',['nefrona','histologia','epitelios','oclusion']]]},
 progreso:{titulo:'Mi progreso',descripcion:'Revisa tus resultados y organiza tu material personal.',grupos:[
  ['Mi aprendizaje',['estadisticas','errores','auto']],
  ['Mi material',['notas','importador','transferencias']]]}
};
const descripciones={
 quiz:'Preguntas del banco con retroalimentación.',flash:'Tarjetas con repetición espaciada.',
 anatomico:'Reconoce las partes señaladas en el cuerpo 3D.',examen:'Simulacro cronometrado con resultados al terminar.',
 practico:'Escribe el nombre de la estructura marcada en 3D.',nefrona:'Explora sus partes y procesos en un esquema interactivo.',
 histologia:'Compara tejidos y practica su identificación.',epitelios:'Consulta la tabla o tapa las respuestas para repasar.',
 oclusion:'Estudia tus láminas ocultando sus etiquetas.',ruta:'Sigue paso a paso el trayecto de la orina.',
 fisiologia:'Observa el movimiento del uréter y la vejiga.',comparar:'Compara la anatomía masculina y femenina.',
 herramientas:'Enfoque, pantalla completa y lectura en voz alta.',estadisticas:'Consulta tus aciertos, racha y metas.',
 errores:'Refuerza las preguntas que necesitan más repaso.',auto:'Comprueba qué temas ya dominas.',
 notas:'Tus apuntes, pistas y estructuras para repasar.',importador:'Añade preguntas de otros laboratorios.',
 transferencias:'Guarda o recupera tus bancos y tu progreso.'
};
export function areaDeModo(id){return Object.keys(areas).find(a=>areas[a].grupos.some(([,ids])=>ids.includes(id)));}
export function montarMenu(ctx,registro){
 const {nodo,boton,contenido}=ctx,area=areas[ctx.area];
 const intro=nodo('div',null,{class:'study-menu-intro'});
 intro.append(nodo('span','TU ESPACIO DE APRENDIZAJE',{class:'study-eyebrow'}),nodo('h3',area.titulo),nodo('p',area.descripcion));contenido.append(intro);
 if(ctx.area==='exploracion')acciones3D(ctx);
 for(const [titulo,ids] of area.grupos){
  const seccion=nodo('section',null,{class:'study-menu-group'});seccion.append(nodo('h4',titulo));
  const grid=nodo('div',null,{class:'study-menu-grid'});
  for(const id of ids){
   const nombre=id==='anatomico'?'Quiz anatómico':registro[id]?.titulo;
   if(!nombre)continue;
   const tarjeta=boton(null,()=>{
    if(id==='anatomico'){
     ctx.cerrarPanel();ctx.contextoModulo.$('quiz-toggle').click();
     ctx.contextoModulo.$('quiz-options')?.querySelector('button')?.focus({preventScroll:true});
    }else ctx.cambiarModo(id);
   },{class:'study-menu-card','data-mode':id});
   tarjeta.append(nodo('strong',nombre),nodo('span',descripciones[id]),nodo('span','Abrir →',{class:'study-card-link','aria-hidden':'true'}));grid.append(tarjeta);
  }
  seccion.append(grid);contenido.append(seccion);
 }
 // Los plugins añadidos al registro siguen siendo accesibles sin editar el menú.
 const otros=Object.values(registro).filter(p=>p.id!=='inicio'&&!areaDeModo(p.id));
 if(ctx.area==='estudio'&&otros.length){const grupo=nodo('section',null,{class:'study-menu-group'});grupo.append(nodo('h4','Más actividades'));for(const p of otros)grupo.append(boton(p.titulo,()=>ctx.cambiarModo(p.id),{'data-mode':p.id}));contenido.append(grupo);}
}
function acciones3D(contextoModulo){
          const acciones=contextoModulo.nodo("div",null,{class:"study-flex"});acciones.append(contextoModulo.boton("Explorar aparato urinario",()=>contextoModulo.contextoModulo.estudiarUrinario()),contextoModulo.boton("Ver interior del riñón",()=>{contextoModulo.contextoModulo.estudiarUrinario();contextoModulo.contextoModulo.seleccionar("rinon_derecho");const c=contextoModulo.contextoModulo.puntoParte("rinon_derecho");contextoModulo.contextoModulo.$("clip-enabled").checked=true;contextoModulo.contextoModulo.$("clip-axis").value="z";contextoModulo.contextoModulo.$("clip-position").value=100*(c.z-(contextoModulo.contextoModulo.cajaCuerpo.min.z-.1))/(contextoModulo.contextoModulo.cajaCuerpo.max.z-contextoModulo.contextoModulo.cajaCuerpo.min.z+.2);contextoModulo.contextoModulo.actualizarCorte();}),contextoModulo.boton("Volver al cuerpo completo",()=>{contextoModulo.contextoModulo.urinario.solo=false;contextoModulo.contextoModulo.urinario.comparar=false;contextoModulo.contextoModulo.restaurar();contextoModulo.contextoModulo.vista("front");}));contextoModulo.contenido.append(acciones);

          acciones.className="study-explore-actions";
          acciones.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>contextoModulo.cerrarPanel()));
}
