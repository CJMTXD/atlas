// Funciones extraídas con referencias explícitas al contexto compartido.
export function liberarRecursos(contextoModulo) {
        contextoModulo.estudioUI?.detener();
        contextoModulo.observadorTamano.disconnect();
        clearTimeout(contextoModulo.toastTimer);
        contextoModulo.vistaMovil.removeEventListener("change",contextoModulo.adaptarPaneles);
        cancelAnimationFrame(contextoModulo.frame);
        contextoModulo.controles.dispose();
        const geometrias=new Set(), mats=new Set(), texturas=new Set();
        contextoModulo.escena.traverse(obj=>{
          if(obj.geometry) geometrias.add(obj.geometry);
          if(obj.material) {
            const lista=Array.isArray(obj.material)?obj.material:[obj.material];
            lista.forEach(mat=>{
              mats.add(mat);
              Object.values(mat).forEach(v=>{ if(v?.isTexture) texturas.add(v); });
            });
          }
        });
        texturas.forEach(t=>t.dispose());
        mats.forEach(m=>m.dispose());
        geometrias.forEach(g=>g.dispose());
        contextoModulo.contorno.dispose();
        contextoModulo.compositor.dispose();
        contextoModulo.renderer.dispose();
      }
