// Funciones extraídas con referencias explícitas al contexto compartido.
export function idDeMalla(contextoModulo,mesh) {
        let objeto=mesh;
        while(objeto && objeto!==contextoModulo.cuerpo) {
          const id=contextoModulo.nombres.get(contextoModulo.normalizar(objeto.name || ""));
          if(id) return id;
          objeto=objeto.parent;
        }
        return null;
      }
export function clonarMateriales(contextoModulo,mesh) {
        const convertir = origen => {
          const m=origen ? origen.clone() : contextoModulo.material("#bec8cc");
          m.clippingPlanes=[];
          m.side=contextoModulo.T.DoubleSide;
          return m;
        };
        mesh.material=Array.isArray(mesh.material)
          ? mesh.material.map(convertir) : convertir(mesh.material);
      }
export async function cargarExternos(contextoModulo) {
        const configuraciones=contextoModulo.MODO_MODELO==="unico"
          ? [{...contextoModulo.MODELO_UNICO,id:null}]
          : contextoModulo.MODELOS.filter(x=>x.habilitado!==false);
        const loader=new contextoModulo.GLTFLoader();
        let completados=0, errores=0;
        for(const cfg of configuraciones) {
          try {
            const gltf=await loader.loadAsync(cfg.archivo,event=>{
              if(event.total>0) contextoModulo.setProgress(
                12+75*(completados+event.loaded/event.total)/Math.max(1,configuraciones.length),
                "Cargando "+cfg.archivo
              );
            });
            const root=gltf.scene;
            root.scale.setScalar(cfg.escala ?? 1);
            root.position.fromArray(cfg.posicion ?? [0,0,0]);
            root.rotation.fromArray(cfg.rotacion ?? [0,0,0]);
            contextoModulo.cuerpo.add(root);
            root.updateWorldMatrix(true,true);
            const encontradas=[];
            root.traverse(obj=>{
              if(obj.isMesh) encontradas.push(obj);
            });
            let desconocidas=0;
            for(const mesh of encontradas) {
              let id=cfg.id || contextoModulo.idDeMalla(mesh);
              if(!id || !contextoModulo.catalogo.has(id)) {
                id="externa_"+contextoModulo.normalizar(mesh.name || "malla")+"_"+contextoModulo.partes.size;
                const sistema=contextoModulo.SISTEMAS[cfg.sistema] ? cfg.sistema : "esqueletico";
                contextoModulo.catalogo.set(id,{
                  id,nombre:mesh.name || "Estructura sin identificar",
                  latin:"Sin correspondencia terminológica",
                  sistema,region:"torax",
                  descripcion:"Malla externa sin asociación en el catálogo. Su identificación anatómica no ha sido verificada.",
                  funcion:"Añade su función al diccionario de metadatos.",
                  ubicacion:"Definida por el archivo externo.",
                  datosCuriosos:"Asocia el nombre de esta malla mediante ALIAS_MALLAS."
                });
                desconocidas++;
              }
              if(!contextoModulo.partes.has(id)) contextoModulo.crearParte(id);
              const parte=contextoModulo.partes.get(id);
              if(cfg.id===id) {
                if(cfg.descripcion) parte.meta.descripcion=cfg.descripcion;
                if(cfg.funcion) parte.meta.funcion=cfg.funcion;
                if(cfg.datosCuriosos) parte.meta.datosCuriosos=cfg.datosCuriosos;
              }
              // attach conserva la transformación mundial, incluidos huesos de modelos estáticos.
              parte.grupo.attach(mesh);
              contextoModulo.clonarMateriales(mesh);
              mesh.castShadow=true;
              mesh.receiveShadow=true;
              mesh.userData.parte=id;
              contextoModulo.mallas.push(mesh);
            }
            root.removeFromParent();
            if(desconocidas) contextoModulo.avisar(desconocidas+" mallas sin correspondencia anatómica; revisa ALIAS_MALLAS.");
          } catch(error) {
            errores++;
            console.warn("Fallo al cargar",cfg.archivo,error);
          }
          completados++;
          contextoModulo.setProgress(12+75*completados/Math.max(1,configuraciones.length),"Preparando las estructuras…");
        }
        return { errores,total:configuraciones.length };
      }
