// Funciones extraídas con referencias explícitas al contexto compartido.
export function nefrona(contextoModulo){
          contextoModulo.titulo("Nefrona interactiva");
          const svg=contextoModulo.svgNodo("svg",{viewBox:"0 0 440 560",class:"study-diagram",role:"group","aria-label":"Nefrona y procesos de formación de orina"});contextoModulo.svgActivo=svg;
          const detalle=contextoModulo.nodo("div",null,{class:"study-card","aria-live":"polite"});
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
          const seleccionarSVG=id=>{const a=info[id];contextoModulo.limpiar(detalle);detalle.append(contextoModulo.nodo("h3",a[0]),contextoModulo.nodo("p","Epitelio / estructura: "+a[1]),contextoModulo.nodo("p","Función: "+a[2]));};
          function interactivo(el,id){el.setAttribute("role","button");el.setAttribute("tabindex","0");el.setAttribute("aria-label",info[id][0]);el.onclick=()=>seleccionarSVG(id);el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopPropagation();seleccionarSVG(id);}};svg.append(el);return el;}
          svg.append(contextoModulo.svgNodo("text",{x:20,y:24,"font-size":12},"CORTEZA"),contextoModulo.svgNodo("path",{d:"M12 240H428",stroke:"#8498a7","stroke-dasharray":"5 5"}),contextoModulo.svgNodo("text",{x:20,y:262,"font-size":12},"MÉDULA"));
          interactivo(contextoModulo.svgNodo("ellipse",{cx:102,cy:100,rx:61,ry:62,fill:"#e4c9a333",stroke:"#e4b58a","stroke-width":9}),"parietal");
          interactivo(contextoModulo.svgNodo("ellipse",{cx:102,cy:100,rx:49,ry:49,fill:"transparent",stroke:"#e5cea5","stroke-width":7}),"espacio");
          const glom=contextoModulo.svgNodo("g");for(let i=0;i<8;i++)glom.append(contextoModulo.svgNodo("ellipse",{cx:83+(i%3)*17,cy:78+Math.floor(i/3)*17,rx:17,ry:12,fill:"none",stroke:"#cb606c","stroke-width":7}));interactivo(glom,"glomerulo");
          const podo=contextoModulo.svgNodo("g");for(let i=0;i<7;i++){const a=i/7*Math.PI*2;podo.append(contextoModulo.svgNodo("circle",{cx:102+Math.cos(a)*43,cy:100+Math.sin(a)*43,r:4,fill:"#be99ce"}));}interactivo(podo,"visceral");
          const paths={proximal:"M160 113 C195 65 235 80 220 120 S175 160 225 175 S300 155 270 207",asa:"M270 207 V422 Q270 492 220 492 Q180 492 180 433 V233",distal:"M180 233 C130 220 145 174 180 187 S238 235 270 211 S314 164 330 199",conector:"M330 199 Q350 220 365 212",colector:"M365 65 V518"};
          const colores={proximal:"#d6a57a",asa:"#d8bd8e",distal:"#8cbfcb",conector:"#a6caa1",colector:"#bd95c9"};
          for(const [id,d]of Object.entries(paths))interactivo(contextoModulo.svgNodo("path",{d,fill:"none",stroke:colores[id],"stroke-width":id==="colector"?18:14,"stroke-linecap":"round"}),id);
          for(const [texto,x,y]of [["Corpúsculo",44,178],["Proximal",208,61],["Distal",269,154],["Conector",313,242],["Asa de Henle",194,527],["Colector",370,48]])svg.append(contextoModulo.svgNodo("text",{x,y,"font-size":11},texto));
          svg.append(contextoModulo.svgNodo("path",{d:"M32 196 V465",stroke:"#ad5869","stroke-width":8,fill:"none"}));
          const particula=contextoModulo.svgNodo("circle",{r:6,fill:"#85f3d8",visibility:"hidden"}),movimiento=contextoModulo.svgNodo("animateMotion",{dur:"3s",repeatCount:"indefinite"});particula.append(movimiento);svg.append(particula);
          contextoModulo.contenido.append(svg,detalle);svg.pauseAnimations?.();seleccionarSVG("bowman");
          const procesos={filtracion:["Filtración","M95 96 Q126 92 152 113","Del capilar glomerular al espacio de Bowman."],reabsorcion:["Reabsorción","M218 151 Q120 173 32 225","Del líquido tubular hacia el intersticio y la sangre."],secrecion:["Secreción","M32 225 Q120 173 218 151","Desde la sangre/intersticio hacia la luz tubular."],excrecion:["Excreción","M365 240 V518","Eliminación final de la orina al exterior. Aquí se ilustra la salida del colector; continúa hasta el exterior en Recorrido."]};
          const fila=contextoModulo.nodo("div",null,{class:"study-flex"}),leyenda=contextoModulo.mensaje("Pulsa una parte para ver su epitelio y función.");
          Object.entries(procesos).forEach(([id,[nombre,path,explicacion]])=>fila.append(contextoModulo.boton(nombre,()=>{particula.setAttribute("visibility","visible");movimiento.setAttribute("path",path);svg.unpauseAnimations?.();movimiento.beginElement?.();leyenda.textContent=nombre+": "+explicacion;contextoModulo.animacionSVG=id;})));
          fila.append(contextoModulo.boton("Pausar",()=>svg.pauseAnimations?.()),contextoModulo.boton("Continuar",()=>svg.unpauseAnimations?.()));contextoModulo.contenido.append(fila,leyenda,contextoModulo.mensaje("Esquema funcional ampliado con información anatómica complementaria al banco literal. Los conductos colectores reciben el flujo de varias nefronas; no son una única prolongación exclusiva de una nefrona."));
          const lista=contextoModulo.nodo("div",null,{class:"study-flex"});Object.entries(info).forEach(([id,a])=>lista.append(contextoModulo.boton(a[0],()=>seleccionarSVG(id))));contextoModulo.contenido.append(lista);
        }

export default {id:"nefrona",titulo:"Nefrona",montar:nefrona,desmontar(){}};
