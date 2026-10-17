// Funciones extraídas con referencias explícitas al contexto compartido.
export function tablaEpitelios(contextoModulo){
          contextoModulo.titulo("Tabla de epitelios");let tapadas=true;
          const toggle=contextoModulo.boton("Mostrar todas las respuestas",()=>{tapadas=!tapadas;toggle.textContent=tapadas?"Mostrar todas las respuestas":"Tapar todas las respuestas";pintar();});contextoModulo.contenido.append(toggle);
          const tabla=contextoModulo.nodo("table",null,{class:"study-table"});contextoModulo.contenido.append(tabla);
          function pintar(){contextoModulo.limpiar(tabla);const h=contextoModulo.nodo("tr");h.append(contextoModulo.nodo("th","Estructura"),contextoModulo.nodo("th","Epitelio"));tabla.append(h);contextoModulo.contextoModulo.EPITELIOS.forEach(x=>{const tr=contextoModulo.nodo("tr"),td=contextoModulo.nodo("td"),b=contextoModulo.boton(tapadas?"Revelar respuesta":x.epitelio,()=>{const revelado=b.getAttribute("aria-expanded")==="true";b.textContent=revelado?"Revelar respuesta":x.epitelio;b.setAttribute("aria-expanded",String(!revelado));},{"aria-expanded":String(!tapadas),"aria-label":"Epitelio de "+x.estructura});td.append(b);tr.append(contextoModulo.nodo("td",x.estructura),td);tabla.append(tr);});}pintar();
          contextoModulo.contenido.append(contextoModulo.mensaje("Tabla transcrita literalmente del apartado «Repaso rápido: epitelios que debes memorizar» del DOCX."));
        }

export default {id:"epitelios",titulo:"Epitelios",montar:tablaEpitelios,desmontar(){}};
