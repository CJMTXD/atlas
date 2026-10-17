// Funciones extraídas con referencias explícitas al contexto compartido.
export function establecerTema(contextoModulo,claro) {
        document.documentElement.dataset.theme=claro?"light":"dark";
        contextoModulo.$("theme").setAttribute("aria-pressed",String(claro));
        contextoModulo.$("theme").setAttribute("aria-label",claro?"Cambiar a tema oscuro":"Cambiar a tema claro");
        contextoModulo.rejilla.material.color.set(claro?0x8ca7b8:0x294354);
        contextoModulo.contorno.visibleEdgeColor.set(claro?"#087c65":"#8bffe3");
        try { localStorage.setItem("atlas-theme",claro?"light":"dark"); } catch {}
        contextoModulo.solicitarRender();
      }
