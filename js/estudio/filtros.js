// Funciones extraídas con referencias explícitas al contexto compartido.
export function filtros(contextoModulo){
          const fila=contextoModulo.nodo("div",null,{class:"study-flex"});
          const seccion=contextoModulo.nodo("select",null,{"aria-label":"Filtrar por sección"}),dificultad=contextoModulo.nodo("select",null,{"aria-label":"Filtrar por dificultad"});
          seccion.append(contextoModulo.nodo("option","Todas las secciones",{value:"todas"}));contextoModulo.contextoModulo.SECCIONES.forEach(x=>seccion.append(contextoModulo.nodo("option",x,{value:x})));
          dificultad.append(contextoModulo.nodo("option","Todas las dificultades",{value:"todas"}));[...new Set(contextoModulo.contextoModulo.BANCO.map(q=>String(q.dificultad)))].sort().forEach(x=>dificultad.append(contextoModulo.nodo("option",x,{value:x})));
          seccion.value=contextoModulo.filtroSeccion;dificultad.value=contextoModulo.filtroDificultad;
          seccion.onchange=()=>contextoModulo.filtroSeccion=seccion.value;dificultad.onchange=()=>contextoModulo.filtroDificultad=dificultad.value;
          fila.append(seccion,dificultad);contextoModulo.contenido.append(fila);
        }
export function bancoFiltrado(contextoModulo){return contextoModulo.contextoModulo.BANCO.filter(q=>(contextoModulo.filtroSeccion==="todas"||q.seccion===contextoModulo.filtroSeccion)&&(contextoModulo.filtroDificultad==="todas"||String(q.dificultad)===contextoModulo.filtroDificultad)&&(!contextoModulo.soloErrores||contextoModulo.progreso.errores[q.id]?.pendiente));}
