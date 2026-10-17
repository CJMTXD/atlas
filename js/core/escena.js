// Funciones extraídas con referencias explícitas al contexto compartido.
export function redimensionar(contextoModulo) {
        const rect=contextoModulo.$("stage").getBoundingClientRect();
        const w=Math.max(1,rect.width),h=Math.max(1,rect.height);
        contextoModulo.camara.aspect=w/h;
        contextoModulo.camara.updateProjectionMatrix();
        contextoModulo.renderer.setSize(w,h);
        contextoModulo.compositor.setSize(w,h);
        contextoModulo.solicitarRender();
      }
