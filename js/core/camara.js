// Funciones extraídas con referencias explícitas al contexto compartido.
export function moverCamara(contextoModulo,posicion,objetivo,duracion=700) {
        contextoModulo.controles.autoRotate=false;
        contextoModulo.$("auto-rotate").setAttribute("aria-pressed","false");
        contextoModulo.transicion={
          desde:contextoModulo.camara.position.clone(),hasta:posicion.clone(),
          objetivoDesde:contextoModulo.controles.target.clone(),objetivoHasta:objetivo.clone(),
          inicio:performance.now(),
          duracion:matchMedia("(prefers-reduced-motion: reduce)").matches?1:duracion
        };
        contextoModulo.solicitarRender();
      }
export function enfocarParte(contextoModulo,parte) {
        const caja=new contextoModulo.T.Box3().setFromObject(parte.grupo);
        const centro=caja.getCenter(new contextoModulo.T.Vector3());
        const tam=caja.getSize(new contextoModulo.T.Vector3());
        const radio=Math.max(.15,tam.length()/2);
        const mitadVertical=contextoModulo.T.MathUtils.degToRad(contextoModulo.camara.fov/2);
        const mitadHorizontal=Math.atan(Math.tan(mitadVertical)*contextoModulo.camara.aspect);
        const distancia=radio/Math.sin(Math.min(mitadVertical,mitadHorizontal))*1.22;
        const direccion=contextoModulo.camara.position.clone().sub(contextoModulo.controles.target).normalize();
        contextoModulo.moverCamara(centro.clone().addScaledVector(direccion,distancia),centro);
      }
export function vista(contextoModulo,tipo) {
        const caja=new contextoModulo.T.Box3();
        for(const p of contextoModulo.partes.values()) caja.expandByObject(p.grupo,true);
        const size=caja.getSize(new contextoModulo.T.Vector3());
        const center=caja.getCenter(new contextoModulo.T.Vector3());
        const radio=Math.max(1,size.length()/2);
        const fov=contextoModulo.T.MathUtils.degToRad(contextoModulo.camara.fov/2);
        const hfov=Math.atan(Math.tan(fov)*contextoModulo.camara.aspect);
        const distancia=radio/Math.sin(Math.min(fov,hfov))*1.08;
        contextoModulo.moverCamara(center.clone().addScaledVector(new contextoModulo.T.Vector3(...contextoModulo.VISTAS[tipo]).normalize(),distancia),center);
      }
