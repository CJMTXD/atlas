// Contenido adicional, verificar con tu material: superficies didácticas, no reconstrucciones clínicas.
export function mejorarSuperficies(ctx){
 const {T,partes,mallas}=ctx;
 function sustituir(p,g,color){
  const anteriores=[];p.grupo.traverse(o=>{if(o.isMesh)anteriores.push(o);});
  for(const o of anteriores){o.removeFromParent();const i=mallas.indexOf(o);if(i>=0)mallas.splice(i,1);if(!mallas.some(x=>x.geometry===o.geometry)&&o.geometry!==ctx.geometriaEsfera&&o.geometry!==ctx.geometriaCilindro)o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}
  const mesh=ctx.agregarMalla(p,g,[1,1,1],[0,0,0],color);p.meta.modelo='Contenido adicional, verificar con tu material. Superficie procedural didáctica de mayor resolución.';return mesh;
 }
 const vej=partes.get('vejiga');if(!vej)return;
 const caja=new T.Box3().setFromObject(vej.grupo),centro=caja.getCenter(new T.Vector3()),tam=caja.getSize(new T.Vector3());
 const g=new T.SphereGeometry(1,64,40),pos=g.attributes.position;
 for(let i=0;i<pos.count;i++){const y=pos.getY(i),ancho=.76+.24*(y+1)/2;pos.setXYZ(i,pos.getX(i)*tam.x*.5*ancho,y*tam.y*.5,pos.getZ(i)*tam.z*.5*ancho);}
 g.translate(...vej.grupo.worldToLocal(centro.clone()).toArray());g.computeVertexNormals();const mesh=sustituir(vej,g,'#bb7b7c');mesh.userData.vejigaAnimable=true;mesh.userData.posicionesBase=g.attributes.position.array.slice();
 for(const [lado,signo]of [['derecho',-1],['izquierdo',1]]){
  const ri=partes.get('rinon_'+lado),ur=partes.get('ureter_'+lado);if(!ri||!ur)continue;
  const cr=new T.Box3().setFromObject(ri.grupo).getCenter(new T.Vector3());
  const puntos=[cr.clone().add(new T.Vector3(-signo*.10,-.07,0)),new T.Vector3(cr.x*.86,cr.y-.3,cr.z+.035),new T.Vector3(cr.x*.76,centro.y+.55,cr.z+.06),new T.Vector3(signo*.28,centro.y+.25,centro.z-.02),centro.clone().add(new T.Vector3(signo*.14,.07,-.01))].map(v=>ur.grupo.worldToLocal(v));
  const curva=new T.CatmullRomCurve3(puntos);const geo=new T.TubeGeometry(curva,96,.018,16,false);const m=sustituir(ur,geo,'#dcb783');m.userData.ureterAnimable=true;m.userData.posicionesBase=geo.attributes.position.array.slice();m.userData.curva=curva;
 }
}
