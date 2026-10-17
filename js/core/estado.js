// Funciones extraídas con referencias explícitas al contexto compartido.
export function materiales(contextoModulo,mesh) {
        return Array.isArray(mesh.material)?mesh.material:[mesh.material];
      }
export function estaVisible(contextoModulo,parte) {
        const s=contextoModulo.SISTEMAS[parte.meta.sistema];
        return (!parte.meta.sexo || parte.meta.sexo===contextoModulo.urinario.sexo) &&
          (!parte.meta.contexto || contextoModulo.urinario.comparar) &&
          (!contextoModulo.urinario.solo || !!parte.meta.urinaria) &&
          s.visible && s.opacidad>.025 &&
          !contextoModulo.estado.ocultos.has(parte.id) &&
          (!contextoModulo.estado.aislado || contextoModulo.estado.aislado===parte.id) &&
          (contextoModulo.estado.region==="todas" || contextoModulo.estado.region===parte.meta.region);
      }
export function aplicarEstado(contextoModulo) {
        for(const parte of contextoModulo.partes.values()) {
          parte.grupo.visible=contextoModulo.estaVisible(parte);
          parte.grupo.traverse(obj=>{
            if(!obj.isMesh) return;
            for(const mat of contextoModulo.materiales(obj)) {
              const s=contextoModulo.SISTEMAS[parte.meta.sistema];
              const transparente=s.opacidad<.995;
              if(mat.transparent!==transparente) {
                mat.transparent=transparente;
                mat.needsUpdate=true;
              }
              mat.opacity=s.opacidad;
              mat.depthWrite=!transparente;
              const activo=mat.clippingPlanes?.length>0;
              if(activo!==contextoModulo.estado.corte) {
                mat.clippingPlanes=contextoModulo.estado.corte?[contextoModulo.planoCorte]:[];
                mat.needsUpdate=true;
              }
            }
          });
        }
        contextoModulo.actualizarContorno();
        document.querySelectorAll(".tree-part").forEach(b=>{
          b.classList.toggle("dim",!contextoModulo.estaVisible(contextoModulo.partes.get(b.dataset.id)));
        });
        contextoModulo.solicitarRender();
      }
export function actualizarContorno(contextoModulo) {
        const ids=new Set([contextoModulo.estado.seleccionado,contextoModulo.estado.hover].filter(Boolean));
        contextoModulo.contorno.selectedObjects=[...ids].map(id=>contextoModulo.partes.get(id)?.grupo)
          .filter(g=>g?.visible);
      }
