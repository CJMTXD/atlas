// Funciones extraídas con referencias explícitas al contexto compartido.
export function candidatosDistractores(contextoModulo,q){
          return contextoModulo.barajar(contextoModulo.contextoModulo.BANCO.filter(o=>o.id!==q.id&&o.seccion===q.seccion&&contextoModulo.claveRespuesta(o.respuesta)!==contextoModulo.claveRespuesta(q.respuesta)))
            .sort((a,b)=>Number(b.estructuraRelacionada===q.estructuraRelacionada)-Number(a.estructuraRelacionada===q.estructuraRelacionada));
        }
export function prepararPregunta(contextoModulo,q,i){
          const tipo=q.tipo==="ordenar"&&Array.isArray(q.pasos)?"ordenar":["multiple","completar","vf"][i%3];
          const item={q,tipo,respuesta:null,correcta:null};
          if(tipo==="multiple"){
            const unicas=[...new Map(contextoModulo.candidatosDistractores(q).map(o=>[contextoModulo.claveRespuesta(o.respuesta),o.respuesta])).values()].slice(0,3);
            if(unicas.length<3)item.tipo="completar";else item.opciones=contextoModulo.barajar([q.respuesta,...unicas]);
          }
          if(item.tipo==="completar"){
            const palabras=[...q.respuesta.matchAll(/[\p{L}\p{N}][\p{L}\p{N},.–-]*/gu)].filter(m=>m[0].length>=4||/\d/.test(m[0]));
            const hueco=palabras.length?palabras[Math.floor(Math.random()*palabras.length)]:{0:q.respuesta,index:0};
            item.solucion=hueco[0];item.plantilla=q.respuesta.slice(0,hueco.index)+" ______ "+q.respuesta.slice(hueco.index+hueco[0].length);
          }
          if(item.tipo==="vf"){
            const candidato=contextoModulo.candidatosDistractores(q)[0];item.esVerdad=!candidato||Math.random()>.5;item.propuesta=item.esVerdad?q.respuesta:candidato.respuesta;
          }
          if(item.tipo==="ordenar")item.orden=contextoModulo.barajar(q.pasos);
          return item;
        }
export function dibujarOrden(contextoModulo,zona,item){
          const lista=contextoModulo.nodo("ol",null,{class:"study-ordered"});zona.append(lista);
          const pintar=()=>{contextoModulo.limpiar(lista);item.orden.forEach((texto,i)=>{const li=contextoModulo.nodo("li");li.append(contextoModulo.nodo("span",texto));for(const [delta,simbolo]of [[-1,"↑"],[1,"↓"]]){const b=contextoModulo.boton(simbolo,()=>{const j=i+delta;[item.orden[i],item.orden[j]]=[item.orden[j],item.orden[i]];pintar();},{"aria-label":(delta<0?"Subir ":"Bajar ")+texto});b.disabled=i+delta<0||i+delta>=item.orden.length;li.append(b);}lista.append(li);});};pintar();zona.append(contextoModulo.boton("Comprobar orden",()=>contextoModulo.responder([...item.orden])));
        }
