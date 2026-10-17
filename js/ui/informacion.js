// Funciones extraídas con referencias explícitas al contexto compartido.
export function mostrarInformacion(contextoModulo,id) {
        const meta=contextoModulo.catalogo.get(id);
        contextoModulo.$("empty-info").hidden=true;
        contextoModulo.$("part-info").hidden=false;
        contextoModulo.$("info-name").textContent=meta.nombre;
        contextoModulo.$("info-name").title=meta.modelo||"";
        contextoModulo.$("info-latin").textContent=meta.latin;
        contextoModulo.$("info-system").textContent=contextoModulo.SISTEMAS[meta.sistema].nombre;
        contextoModulo.$("info-system").style.borderColor=contextoModulo.SISTEMAS[meta.sistema].color;
        contextoModulo.$("info-description").textContent=meta.descripcion + (meta.modelo ? " " + meta.modelo : "");
        contextoModulo.$("info-function").textContent=meta.funcion;
        contextoModulo.$("info-location").textContent=meta.ubicacion;
        contextoModulo.$("info-fact").textContent=meta.datosCuriosos;
        contextoModulo.$("info-related").replaceChildren();
        const explicitas={
          corazon:["aorta","vena_cava","pulmon_derecho","pulmon_izquierdo"],
          cerebro:["cerebelo","tronco","medula","hipofisis"],
          estomago:["esofago","pancreas","intestino_delgado"],
          higado:["vesicula","pancreas","intestino_delgado"],
          vejiga:["ureter_derecho","ureter_izquierdo","rinon_derecho","rinon_izquierdo"],
          rinon_derecho:["ureter_derecho","suprarrenales","vejiga"],
          rinon_izquierdo:["ureter_izquierdo","suprarrenales","vejiga"]
        };
        const relacionados=(meta.relaciones || explicitas[id] || [...contextoModulo.partes.keys()]
          .filter(otro=>otro!==id && contextoModulo.catalogo.get(otro).sistema===meta.sistema))
          .filter(otro=>contextoModulo.partes.has(otro)).slice(0,5);
        if(!relacionados.length) contextoModulo.$("info-related").textContent="Sin asociaciones disponibles.";
        relacionados.forEach(otro=>{
          const b=document.createElement("button");
          b.textContent=contextoModulo.catalogo.get(otro).nombre;
          b.onclick=()=>contextoModulo.seleccionar(otro);
          contextoModulo.$("info-related").append(b);
        });
      }
