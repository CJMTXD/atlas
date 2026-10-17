// Funciones extraídas con referencias explícitas al contexto compartido.
export function intersectar(contextoModulo,evento) {
        const rect=contextoModulo.renderer.domElement.getBoundingClientRect();
        contextoModulo.puntero.set(
          (evento.clientX-rect.left)/rect.width*2-1,
          -(evento.clientY-rect.top)/rect.height*2+1
        );
        contextoModulo.rayo.setFromCamera(contextoModulo.puntero,contextoModulo.camara);
        const candidatas=contextoModulo.mallas.filter(m=>contextoModulo.partes.get(m.userData.parte)?.grupo.visible);
        const hits=contextoModulo.rayo.intersectObjects(candidatas,false);
        return hits.find(h=>!contextoModulo.estado.corte || contextoModulo.planoCorte.distanceToPoint(h.point)>=0);
      }
