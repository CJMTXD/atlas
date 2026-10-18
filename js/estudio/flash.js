import {extra,salvar} from "./extra-store.js";
// Funciones extraídas con referencias explícitas al contexto compartido.
export function iniciarFlash(contextoModulo){contextoModulo.soloErrores=false;contextoModulo.titulo("Flashcards · repetición espaciada");
const explicar=()=>extra.algoritmo==="sm2"?"SM-2: el intervalo se calcula según la calidad del recuerdo (Difícil, Bien o Fácil). Repasar reinicia la secuencia.":"Leitner: caja 1 inicial, caja 2 a 3 días y caja 3 a 7 días. Repasar vuelve a caja 1 en 10 minutos.";const ayuda=contextoModulo.mensaje(explicar());
const selector=contextoModulo.nodo("select",null,{"aria-label":"Algoritmo de repetición",id:"algoritmo"});for(const [v,n] of [["leitner","Leitner · 3 cajas"],["sm2","SM-2"]])selector.append(contextoModulo.nodo("option",n,{value:v}));selector.value=extra.algoritmo;selector.onchange=()=>{extra.algoritmo=selector.value;ayuda.textContent=explicar();if(!salvar())contextoModulo.contextoModulo.avisar("No se pudo guardar la preferencia; se mantendrá en esta sesión.");};contextoModulo.contenido.append(selector,ayuda);if(contextoModulo.faltaBanco())return;contextoModulo.filtros();contextoModulo.contenido.append(contextoModulo.boton("Estudiar tarjetas pendientes",()=>{
          const ahora=Date.now(),lista=contextoModulo.barajar(contextoModulo.bancoFiltrado().filter(q=>Number((extra.algoritmo==="sm2"?contextoModulo.progreso.tarjetas[q.id]?.sm2?.vence:contextoModulo.progreso.tarjetas[q.id]?.vence)||0)<=ahora));
          if(!lista.length){contextoModulo.contextoModulo.avisar("No hay tarjetas pendientes con estos filtros.");return;}
          contextoModulo.flash={lista,indice:0,volteada:false,vistas:0,sabidas:0,reforzar:[],inicio:Date.now()};contextoModulo.mostrarFlash();}));}

export default {id:"flash",titulo:"Flashcards",montar:iniciarFlash,desmontar(){}};
