// Funciones extraídas con referencias explícitas al contexto compartido.
export function crearParte(contextoModulo,id, posicion=[0,0,0]) {
        const meta = contextoModulo.catalogo.get(id);
        const grupo = new contextoModulo.T.Group();
        grupo.name = id;
        grupo.position.fromArray(posicion);
        contextoModulo.cuerpo.add(grupo);
        const parte = { id, meta, grupo, base: grupo.position.clone(), direccion: new contextoModulo.T.Vector3(), etiqueta: null };
        contextoModulo.partes.set(id,parte);
        return parte;
      }
export function agregarMalla(contextoModulo,parte, geometria, escala, posicion=[0,0,0], color) {
        const mesh = new contextoModulo.T.Mesh(geometria,contextoModulo.material(color || contextoModulo.SISTEMAS[parte.meta.sistema].color, parte.meta.sistema));
        mesh.scale.fromArray(escala);
        mesh.position.fromArray(posicion);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.parte = parte.id;
        parte.grupo.add(mesh);
        contextoModulo.mallas.push(mesh);
        return mesh;
      }
