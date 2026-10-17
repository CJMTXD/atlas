// Contenido adicional, verificar con tu material. Animación cualitativa sin escala clínica de presión o tiempo.
export const fisiologia={activa:false,tiempo:0,velocidad:1,llenado:.5,automatico:false};
export function actualizarFisiologia(ctx,dt){
 if(!fisiologia.activa)return false;fisiologia.tiempo+=dt*fisiologia.velocidad;const t=fisiologia.tiempo;
 if(fisiologia.automatico)fisiologia.llenado=(1-Math.cos(t*.35))/2;
 for(const mesh of ctx.mallas){const d=mesh.userData,base=d.posicionesBase;if(!base)continue;const pos=mesh.geometry.attributes.position;
  if(d.ureterAnimable){const seg=mesh.geometry.parameters.tubularSegments,rad=mesh.geometry.parameters.radialSegments;for(let i=0;i<pos.count;i++){const u=Math.floor(i/(rad+1))/seg,c=d.curva.getPointAt(u);const distancia=Math.abs(u-((t*.22)%1)),factor=1-.48*Math.exp(-(distancia*distancia)/.004);pos.setXYZ(i,c.x+(base[i*3]-c.x)*factor,c.y+(base[i*3+1]-c.y)*factor,c.z+(base[i*3+2]-c.z)*factor);}}
  if(d.vejigaAnimable||d.mucosaAnimable){const f=.72+.28*fisiologia.llenado,c=d.centroBase||[0,0,0];for(let i=0;i<pos.count;i++){const x=base[i*3]-c[0],y=base[i*3+1]-c[1],z=base[i*3+2]-c[2];const pliegue=d.mucosaAnimable?1+.045*(1-fisiologia.llenado)*Math.sin(Math.atan2(z,x)*14+y*55):1;pos.setXYZ(i,c[0]+x*f*pliegue,c[1]+y*(.82+.18*fisiologia.llenado),c[2]+z*f*pliegue);}}
  pos.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();
 }
 return true;
}
export function restaurarFisiologia(ctx){fisiologia.activa=false;for(const mesh of ctx.mallas){const base=mesh.userData.posicionesBase;if(base){mesh.geometry.attributes.position.array.set(base);mesh.geometry.attributes.position.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();}}ctx.solicitarRender();}
