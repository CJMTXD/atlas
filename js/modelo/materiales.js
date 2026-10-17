// Funciones extraídas con referencias explícitas al contexto compartido.
export function texturaSuperficie(contextoModulo,tipo) {
        if(contextoModulo.texturasDetalle.has(tipo)) return contextoModulo.texturasDetalle.get(tipo);
        const c=document.createElement("canvas"); c.width=c.height=128;
        const ctx=c.getContext("2d"), image=ctx.createImageData(128,128);
        let semilla=817;
        for(let y=0;y<128;y++) for(let x=0;x<128;x++) {
          semilla=(Math.imul(1664525,semilla)+1013904223)>>>0;
          const ruido=(semilla/4294967296-.5)*24;
          const fibra=tipo==="muscular" ? Math.sin(x*.7+Math.sin(y*.06)*1.6)*23 : 0;
          const n=Math.max(0,Math.min(255,140+ruido+fibra));
          const i=(y*128+x)*4;
          image.data.set([n,n,n,255],i);
        }
        ctx.putImageData(image,0,0);
        const tex=new contextoModulo.T.CanvasTexture(c);
        tex.wrapS=tex.wrapT=contextoModulo.T.RepeatWrapping;
        tex.repeat.set(tipo==="muscular"?3:4,4);
        contextoModulo.texturasDetalle.set(tipo,tex);
        return tex;
      }
export function material(contextoModulo,color,sistema="esqueletico") {
        const hueso=sistema==="esqueletico";
        const musculo=sistema==="muscular";
        return new contextoModulo.T.MeshPhysicalMaterial({
          color, roughness:hueso?.7:musculo?.48:.43, metalness:0,
          clearcoat:hueso?.04:.18, clearcoatRoughness:.5,
          sheen:hueso?0:.15, sheenColor:new contextoModulo.T.Color(color),
          bumpMap:contextoModulo.texturaSuperficie(sistema), bumpScale:hueso?.008:.005,
          transparent:false, side:contextoModulo.T.DoubleSide, clippingPlanes:[]
        });
      }
