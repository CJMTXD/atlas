// Funciones extraídas con referencias explícitas al contexto compartido.
export function prepararRutaOrina(contextoModulo) {
        const ids=["papila_derecha","calices_menores_derecha","calices_mayores_derecha","pelvis_renal_derecha","ureter_derecho_abdominal","ureter_derecho_pelvica","vejiga",...(contextoModulo.urinario.sexo==="masculino"?["uretra_prostatica","uretra_membranosa","uretra_esponjosa"]:["uretra_femenino"])];
        contextoModulo.estacionesOrina=ids.map(id=>({id,nombre:contextoModulo.catalogo.get(id).nombre,p:contextoModulo.puntoParte(id)}));
        const salida=contextoModulo.estacionesOrina.at(-1).p.clone().add(new contextoModulo.T.Vector3(0,-.12,.15));
        contextoModulo.estacionesOrina.push({id:null,nombre:"Exterior · excreción",p:salida});
        contextoModulo.rutaOrina=new contextoModulo.T.CatmullRomCurve3(contextoModulo.estacionesOrina.map(x=>x.p),false,"centripetal");
        contextoModulo.urinario.t=0;contextoModulo.urinario.estacion=-1;
      }
export function actualizarOrina(contextoModulo,dt) {
        if(!contextoModulo.particulasOrina || !contextoModulo.urinario.flujo)return false;
        if(!contextoModulo.urinario.pausa)contextoModulo.urinario.t=(contextoModulo.urinario.t+dt*.045*contextoModulo.urinario.velocidad)%1;
        const matriz=new contextoModulo.T.Matrix4();
        for(let i=0;i<28;i++){const t=Math.max(0,Math.min(1,contextoModulo.urinario.t-i*.008));matriz.makeTranslation(...contextoModulo.rutaOrina.getPoint(t).toArray());contextoModulo.particulasOrina.setMatrixAt(i,matriz);}
        contextoModulo.particulasOrina.instanceMatrix.needsUpdate=true;
        const estacion=Math.min(contextoModulo.estacionesOrina.length-1,Math.floor(contextoModulo.urinario.t*(contextoModulo.estacionesOrina.length-1)+1e-6));
        if(estacion!==contextoModulo.urinario.estacion){contextoModulo.urinario.estacion=estacion;contextoModulo.urinario.callback?.(contextoModulo.estacionesOrina[estacion].nombre);}
        return !contextoModulo.urinario.pausa;
      }
