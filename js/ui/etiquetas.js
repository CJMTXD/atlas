// Funciones extraídas con referencias explícitas al contexto compartido.
export function actualizarEtiquetas(contextoModulo) {
        for(const p of contextoModulo.partes.values()) p.etiqueta.hidden=true;
        contextoModulo.geometriaGuias.setDrawRange(0,0);
        if(!contextoModulo.estado.etiquetas || contextoModulo.estado.quiz.activo) return;
        const rect=contextoModulo.$("stage").getBoundingClientRect();
        const ocupados=[];
        const candidatas=[...contextoModulo.partes.values()].filter(p=>p.grupo.visible)
          .sort((a,b)=>(a.id===contextoModulo.estado.seleccionado?-1:b.id===contextoModulo.estado.seleccionado?1:0));
        let cuenta=0;
        for(const p of candidatas) {
          if(cuenta>=18) break;
          const centro=new contextoModulo.T.Box3().setFromObject(p.grupo).getCenter(new contextoModulo.T.Vector3());
          if(contextoModulo.estado.corte && contextoModulo.planoCorte.distanceToPoint(centro)<0) continue;
          const ndc=centro.clone().project(contextoModulo.camara);
          if(ndc.z<-1 || ndc.z>1 || Math.abs(ndc.x)>.94 || Math.abs(ndc.y)>.91) continue;
          const origen=contextoModulo.camara.position.clone();
          const direccion=centro.clone().sub(origen).normalize();
          contextoModulo.rayo.set(origen,direccion);
          const hits=contextoModulo.rayo.intersectObjects(contextoModulo.mallas.filter(m=>contextoModulo.partes.get(m.userData.parte)?.grupo.visible),false)
            .filter(h=>!contextoModulo.estado.corte || contextoModulo.planoCorte.distanceToPoint(h.point)>=0);
          if(hits[0] && hits[0].object.userData.parte!==p.id) continue;
          const lado=ndc.x<0?-1:1;
          const x=(ndc.x*.5+.5)*rect.width+lado*70;
          const y=(-ndc.y*.5+.5)*rect.height;
          if(x<65 || x>rect.width-65 || y<55 || y>rect.height-80) continue;
          if(ocupados.some(o=>Math.abs(o.x-x)<145 && Math.abs(o.y-y)<27)) continue;
          ocupados.push({x,y});
          p.etiqueta.hidden=false;
          p.etiqueta.style.left=x+"px";
          p.etiqueta.style.top=y+"px";
          const fin=new contextoModulo.T.Vector3(x/rect.width*2-1,-y/rect.height*2+1,ndc.z).unproject(contextoModulo.camara);
          contextoModulo.bufferGuias.set([...centro.toArray(),...fin.toArray()],cuenta*6);
          cuenta++;
        }
        contextoModulo.geometriaGuias.attributes.position.needsUpdate=true;
        contextoModulo.geometriaGuias.setDrawRange(0,cuenta*2);
      }
