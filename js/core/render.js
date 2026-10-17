// Funciones extraídas con referencias explícitas al contexto compartido.
export function solicitarRender(contextoModulo) {
        if(!contextoModulo.frame && !contextoModulo.dibujando) contextoModulo.frame=requestAnimationFrame(contextoModulo.renderizar);
      }
export function renderizar(contextoModulo,tiempo) {
        contextoModulo.frame=0;
        contextoModulo.dibujando=true;
        const dt=Math.min((tiempo-(contextoModulo.ultimoTiempo||tiempo))/1000,.05);
        contextoModulo.ultimoTiempo=tiempo;
        let animando=contextoModulo.actualizarOrina(dt);
        if(contextoModulo.transicion) {
          const avance=Math.min((tiempo-contextoModulo.transicion.inicio)/contextoModulo.transicion.duracion,1);
          const suave=avance<.5?4*avance**3:1-((-2*avance+2)**3)/2;
          contextoModulo.camara.position.lerpVectors(contextoModulo.transicion.desde,contextoModulo.transicion.hasta,suave);
          contextoModulo.controles.target.lerpVectors(contextoModulo.transicion.objetivoDesde,contextoModulo.transicion.objetivoHasta,suave);
          if(avance>=1) contextoModulo.transicion=null;
          else animando=true;
        }
        if(Math.abs(contextoModulo.estado.explosion-contextoModulo.estado.explosionObjetivo)>.0005) {
          contextoModulo.estado.explosion=contextoModulo.T.MathUtils.damp(contextoModulo.estado.explosion,contextoModulo.estado.explosionObjetivo,8,dt||.016);
          if(Math.abs(contextoModulo.estado.explosion-contextoModulo.estado.explosionObjetivo)<.001)
            contextoModulo.estado.explosion=contextoModulo.estado.explosionObjetivo;
          for(const p of contextoModulo.partes.values()) p.grupo.position.copy(p.base)
            .addScaledVector(p.direccion,contextoModulo.estado.explosion*2.3);
          animando=true;
        }
        if(contextoModulo.controles.autoRotate) { contextoModulo.controles.update(dt); animando=true; }
        else contextoModulo.controles.update();
        contextoModulo.actualizarEtiquetas();
        contextoModulo.compositor.render();
        contextoModulo.dibujando=false;
        if(animando || contextoModulo.transicion) contextoModulo.solicitarRender();
      }
