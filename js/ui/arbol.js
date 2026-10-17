// Funciones extraídas con referencias explícitas al contexto compartido.
export function construirArbol(contextoModulo) {
        contextoModulo.$("tree").replaceChildren();
        for(const [sistema,datos] of Object.entries(contextoModulo.SISTEMAS)) {
          const deSistema=[...contextoModulo.partes.values()].filter(p=>p.meta.sistema===sistema);
          if(!deSistema.length) continue;
          const raiz=document.createElement("details");
          const sum=document.createElement("summary");
          sum.textContent=datos.nombre+" · "+deSistema.length;
          raiz.append(sum);
          for(const [region,nombre] of Object.entries(contextoModulo.REGIONES)) {
            if(region==="todas") continue;
            const lista=deSistema.filter(p=>p.meta.region===region);
            if(!lista.length) continue;
            const rama=document.createElement("details");
            rama.className="tree-region";
            rama.dataset.region=region;
            const titulo=document.createElement("summary");
            titulo.textContent=nombre;
            rama.append(titulo);
            const contenedores=new Map();
            lista.forEach(p=>{
              let destino=rama;
              if(p.meta.padre){
                if(!contenedores.has(p.meta.padre)){
                  const grupo=document.createElement("details"),titulo=document.createElement("summary");
                  grupo.className="tree-region";
                  titulo.textContent=contextoModulo.catalogo.get(p.meta.padre)?.nombre || p.meta.padre;
                  grupo.append(titulo);rama.append(grupo);contenedores.set(p.meta.padre,grupo);
                }
                destino=contenedores.get(p.meta.padre);
              }
              const b=document.createElement("button");
              b.className="tree-part";b.dataset.id=p.id;b.textContent=p.meta.nombre;
              b.setAttribute("aria-pressed","false");b.onclick=()=>contextoModulo.seleccionar(p.id);destino.append(b);
            });
            raiz.append(rama);
          }
          contextoModulo.$("tree").append(raiz);
        }
      }
