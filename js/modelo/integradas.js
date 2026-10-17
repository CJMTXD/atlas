// Funciones extraídas con referencias explícitas al contexto compartido.
export async function aplicarAnatomiaIntegrada(contextoModulo) {
        const {manifest,buffer}=await contextoModulo.cargarMallas(contextoModulo.setProgress);
        const preparadas=[];
        const colores={
          piel:"#cfaa91", muscular:"#a74650", esqueletico:"#e3d4b5",
          circulatorio:"#b8374c", nervioso:"#e4c47b", respiratorio:"#c68fa1",
          digestivo:"#c78e74", urinario:"#9e555f", linfatico:"#81a68a", endocrino:"#c19baa"
        };
        const tonos={
          higado:"#864d46", vesicula:"#8c9c59", estomago:"#c99691",
          pancreas:"#d0b583", intestino_delgado:"#ca9a83", colon:"#ba8c7b",
          cerebro:"#d6b7a4", cerebelo:"#c7aa91", tronco:"#d8bd9c",
          aorta:"#bc3e49", vena_cava:"#547ca5", corazon:"#a44151",
          bazo:"#785772", vejiga:"#c2a38d", traquea:"#c1bfa5"
        };
        try {
          for(let i=0;i<manifest.length;i++) {
            const registro=manifest[i];
            if(!contextoModulo.catalogo.has(registro.id)) continue;
            const fuente=new Int16Array(buffer,registro.offset,registro.vertices*3);
            const posiciones=new Float32Array(fuente.length);
            for(let j=0;j<fuente.length;j++) posiciones[j]=fuente[j]/2500;
            const inicio=registro.offset+registro.vertices*6;
            const indices=new Uint32Array(buffer.slice(inicio,inicio+registro.indices*4));
            const geometria=new contextoModulo.T.BufferGeometry();
            geometria.setAttribute("position",new contextoModulo.T.BufferAttribute(posiciones,3));
            geometria.setIndex(new contextoModulo.T.BufferAttribute(indices,1));
            geometria.computeBoundingBox();
            const centro=geometria.boundingBox.getCenter(new contextoModulo.T.Vector3());
            geometria.translate(-centro.x,-centro.y,-centro.z);
            geometria.computeVertexNormals();
            geometria.computeBoundingSphere();
            const uv=new Float32Array(registro.vertices*2);
            const tintes=new Float32Array(registro.vertices*3);
            const sistema=contextoModulo.catalogo.get(registro.id).sistema;
            for(let j=0;j<registro.vertices;j++) {
              const x=posiciones[j*3],y=posiciones[j*3+1],z=posiciones[j*3+2];
              uv[j*2]=Math.atan2(z,x)/(2*Math.PI)+.5;
              uv[j*2+1]=y*.8;
              const ruido=(Math.sin(x*47+y*23+z*31)*Math.sin(y*59-z*17))*.025;
              const tono=.96+ruido;
              tintes[j*3]=tono;
              tintes[j*3+1]=tono;
              tintes[j*3+2]=tono;
            }
            geometria.setAttribute("uv",new contextoModulo.T.BufferAttribute(uv,2));
            geometria.setAttribute("color",new contextoModulo.T.BufferAttribute(tintes,3));
            const mat=contextoModulo.material(tonos[registro.id] || colores[sistema],sistema);
            mat.vertexColors=true;
            // La capa de piel es un contexto translúcido; no oculta los órganos por defecto.
            if(sistema==="piel") { mat.roughness=.67; mat.sheen=.3; }
            const mesh=new contextoModulo.T.Mesh(geometria,mat);
            mesh.name="BodyParts3D_"+registro.id;
            mesh.userData.parte=registro.id;
            mesh.castShadow=true;
            mesh.receiveShadow=true;
            preparadas.push({registro,centro,mesh});
            contextoModulo.setProgress(25+60*(i+1)/manifest.length,"Preparando anatomía: "+contextoModulo.catalogo.get(registro.id).nombre);
            // Permitir que el navegador actualice el progreso en equipos modestos.
            if(i%7===0) await new Promise(resolve=>setTimeout(resolve,0));
          }
        } catch(error) {
          for(const p of preparadas) { p.mesh.geometry.dispose(); p.mesh.material.dispose(); }
          throw error;
        }
        // Reemplazo después de construir y validar todas las geometrías.
        for(const {registro,centro,mesh} of preparadas) {
          const parte=contextoModulo.partes.get(registro.id) || contextoModulo.crearParte(registro.id);
          const anteriores=new Set();
          parte.grupo.traverse(obj=>{ if(obj.isMesh) anteriores.add(obj); });
          for(let j=contextoModulo.mallas.length-1;j>=0;j--) if(anteriores.has(contextoModulo.mallas[j])) contextoModulo.mallas.splice(j,1);
          const geometrias=new Set();
          for(const anterior of anteriores) {
            if(anterior.geometry!==contextoModulo.geometriaEsfera && anterior.geometry!==contextoModulo.geometriaCilindro)
              geometrias.add(anterior.geometry);
            (Array.isArray(anterior.material)?anterior.material:[anterior.material]).forEach(m=>m.dispose());
          }
          geometrias.forEach(g=>g.dispose());
          parte.grupo.clear();
          parte.grupo.position.copy(centro);
          parte.grupo.add(mesh);
          parte.meta.modelo="Superficie anatómica BodyParts3D adaptada para visualización.";
          parte.meta.fuentesFMA=registro.fuentes;
          contextoModulo.mallas.push(mesh);
        }
        // Estructuras complementarias: conservan una representación esquemática,
        // adaptada a las proporciones y a la postura del modelo integrado.
        const ajustes={
          recto_abdominal:{escala:[.8,1,1],desplazamiento:[0,.9,-.01]},
          lengua:{escala:[1,1,1],desplazamiento:[0,.37,-.03]},
          tiroides:{escala:[.8,.8,.8],posicion:[0,8.48,.28]},
          suprarrenales:{escala:[.65,1,.8],desplazamiento:[0,1.18,.1]},
          ganglios:{escala:[.78,1,1],desplazamiento:[0,.48,-.03]}
        };
        for(const [id,ajuste] of Object.entries(ajustes)) {
          const p=contextoModulo.partes.get(id);
          if(!p || p.meta.fuentesFMA) continue;
          p.grupo.scale.fromArray(ajuste.escala);
          if(ajuste.posicion) p.grupo.position.fromArray(ajuste.posicion);
          else p.grupo.position.add(new contextoModulo.T.Vector3(...ajuste.desplazamiento));
        }
        // Red periférica de referencia, más delgada y alineada con las extremidades.
        const nervios=contextoModulo.partes.get("nervios");
        if(nervios && !nervios.meta.fuentesFMA) {
          const previos=new Set();
          nervios.grupo.traverse(o=>{if(o.isMesh) previos.add(o);});
          for(let i=contextoModulo.mallas.length-1;i>=0;i--) if(previos.has(contextoModulo.mallas[i])) contextoModulo.mallas.splice(i,1);
          previos.forEach(o=>{o.material.dispose();});
          nervios.grupo.clear();
          contextoModulo.miembros(nervios,[
            [[.05,8.15,-.25],[.9,7.75,-.14]],
            [[.9,7.75,-.14],[1.32,6.25,-.04]],
            [[1.32,6.25,-.04],[1.76,4.95,.05]],
            [[.04,5.8,-.23],[.57,4.9,-.15]],
            [[.57,4.9,-.15],[.62,2.5,-.12]],
            [[.62,2.5,-.12],[.62,.55,-.06]]
          ],.014,"#d9b866");
        }
        for(const p of contextoModulo.partes.values()) if(!p.meta.fuentesFMA)
          p.meta.modelo="Representación esquemática complementaria; esta estructura no dispone de una malla BodyParts3D integrada.";
        contextoModulo.setProgress(90,"Aplicando materiales y preparando el visor…");
      }
