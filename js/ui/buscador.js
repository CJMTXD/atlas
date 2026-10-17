// Funciones extraídas con referencias explícitas al contexto compartido.
export function limpiarResultados(contextoModulo) {
        contextoModulo.resultados=[];
        contextoModulo.indiceResultado=-1;
        contextoModulo.$("search-results").replaceChildren();
        contextoModulo.$("search").setAttribute("aria-expanded","false");
        contextoModulo.$("search").removeAttribute("aria-activedescendant");
      }
export function buscar(contextoModulo) {
        const q=contextoModulo.normalizar(contextoModulo.$("search").value);
        contextoModulo.limpiarResultados();
        if(!q) return;
        contextoModulo.resultados=[...contextoModulo.partes.values()].filter(p=>
          contextoModulo.normalizar(p.meta.nombre+" "+p.meta.latin+" "+p.id).includes(q)
        ).slice(0,12);
        if(!contextoModulo.resultados.length) {
          const vacio=document.createElement("p");
          vacio.className="muted";
          vacio.style.cssText="font-size:12px;padding:12px;margin:0";
          vacio.textContent="No se encontraron estructuras.";
          contextoModulo.$("search-results").append(vacio);
        }
        contextoModulo.resultados.forEach((p,i)=>{
          const b=document.createElement("button");
          b.className="result";
          b.id="resultado-"+i;
          b.setAttribute("role","option");
          b.setAttribute("aria-selected","false");
          const nombre=document.createElement("span");
          nombre.textContent=p.meta.nombre;
          const latin=document.createElement("small");
          latin.textContent=p.meta.latin;
          b.append(nombre,latin);
          b.onpointerdown=e=>e.preventDefault();
          b.onclick=()=>contextoModulo.seleccionar(p.id);
          contextoModulo.$("search-results").append(b);
        });
        contextoModulo.$("search").setAttribute("aria-expanded","true");
      }
