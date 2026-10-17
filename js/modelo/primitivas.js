// Funciones extraídas con referencias explícitas al contexto compartido.
export function ovalo(contextoModulo,parte, posicion, escala, color) {
        return contextoModulo.agregarMalla(parte,contextoModulo.geometriaEsfera,escala,posicion,color);
      }
export function segmento(contextoModulo,parte,a,b,radio=.08,color) {
        const va = new contextoModulo.T.Vector3(...a), vb = new contextoModulo.T.Vector3(...b);
        const mesh = contextoModulo.agregarMalla(parte,contextoModulo.geometriaCilindro,
          [radio,va.distanceTo(vb),radio],
          va.clone().add(vb).multiplyScalar(.5).toArray(),color);
        mesh.quaternion.setFromUnitVectors(new contextoModulo.T.Vector3(0,1,0),vb.sub(va).normalize());
        return mesh;
      }
export function tubo(contextoModulo,parte,puntos,radio=.06,color,cerrado=false) {
        const curva = new contextoModulo.T.CatmullRomCurve3(puntos.map(p => new contextoModulo.T.Vector3(...p)),cerrado);
        return contextoModulo.agregarMalla(parte,new contextoModulo.T.TubeGeometry(curva,Math.max(20,puntos.length*5),radio,8,cerrado),[1,1,1],[0,0,0],color);
      }
export function miembros(contextoModulo,parte,pares,radio,color) {
        for (const lado of [-1,1]) {
          pares.forEach(([a,b]) => contextoModulo.segmento(parte,[a[0]*lado,a[1],a[2]],[b[0]*lado,b[1],b[2]],radio,color));
        }
      }
