// Funciones extraídas con referencias explícitas al contexto compartido.
export function dibujoEpitelio(contextoModulo,tipo,conTitulo=true){
          const svg=contextoModulo.svgNodo("svg",{viewBox:"0 0 360 145",class:"study-small-svg",role:"img","aria-label":conTitulo?tipo:"Esquema de epitelio para identificar"});
          svg.append(contextoModulo.svgNodo("path",{d:"M15 122 H345",stroke:"#bb8999","stroke-width":4}));
          const plano=tipo==="Plano simple",transicion=tipo==="Transición (urotelio)",cepillo=tipo.includes("cepillo");
          const filas=transicion?3:1,alto=plano?16:transicion?25:55;
          for(let fila=0;fila<filas;fila++)for(let i=0;i<7;i++){
            const x=20+i*46+(fila%2?7:0),y=121-(fila+1)*alto;
            svg.append(contextoModulo.svgNodo("rect",{x,y,width:44,height:alto-2,rx:transicion&&fila===2?17:plano?7:9,fill:transicion?"#b998ca":"#dfb4b0",stroke:"#8e647a","stroke-width":1.5}));
            svg.append(contextoModulo.svgNodo("ellipse",{cx:x+22,cy:y+alto*.58,rx:plano?9:7,ry:plano?3:7,fill:"#765482"}));
            if(cepillo)for(let j=0;j<9;j++)svg.append(contextoModulo.svgNodo("path",{d:`M${x+j*5} ${y}v-10`,stroke:"#a36880","stroke-width":2}));
          }
          svg.append(contextoModulo.svgNodo("text",{x:180,y:22,"text-anchor":"middle","font-size":12},conTitulo?tipo:"Luz"));return svg;
        }
