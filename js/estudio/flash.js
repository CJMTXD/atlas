// Funciones extraídas con referencias explícitas al contexto compartido.
export function iniciarFlash(contextoModulo){contextoModulo.soloErrores=false;contextoModulo.titulo("Flashcards · Leitner de 3 cajas");if(contextoModulo.faltaBanco())return;contextoModulo.filtros();contextoModulo.contenido.append(contextoModulo.mensaje("Caja 1: repaso inicial; caja 2: 3 días; caja 3: 7 días. «Repasar» devuelve la tarjeta a caja 1 para revisarla en 10 minutos."));contextoModulo.contenido.append(contextoModulo.boton("Estudiar tarjetas pendientes",()=>{
          const ahora=Date.now(),lista=contextoModulo.barajar(contextoModulo.bancoFiltrado().filter(q=>Number(contextoModulo.progreso.tarjetas[q.id]?.vence||0)<=ahora));
          if(!lista.length){contextoModulo.contextoModulo.avisar("No hay tarjetas pendientes con estos filtros.");return;}
          contextoModulo.flash={lista,indice:0,volteada:false,vistas:0,sabidas:0,reforzar:[],inicio:Date.now()};contextoModulo.mostrarFlash();}));}

export default {id:"flash",titulo:"Flashcards",montar:iniciarFlash,desmontar(){}};
