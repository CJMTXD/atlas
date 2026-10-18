// Respaldo esquemático original: geometrías y orden conservados.
export function crear_esqueletico_1(contextoModulo){
let p;
p=contextoModulo.crearParte("craneo",[0,9,0]);
contextoModulo.ovalo(p,[0,.1,-.03],[.61,.72,.55]);
contextoModulo.ovalo(p,[0,-.38,.17],[.43,.3,.33]);
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.23,-.12,.5],[.15,.14,.055],"#514b47");
p=contextoModulo.crearParte("mandibula",[0,8.48,.1]);
contextoModulo.tubo(p,[[-.39,.25,0],[-.4,-.02,.19],[0,-.14,.35],[.4,-.02,.19],[.39,.25,0]],.065);
p=contextoModulo.crearParte("claviculas");
contextoModulo.miembros(p,[[[.08,7.65,.5],[1.13,7.5,.12]]],.065);
p=contextoModulo.crearParte("esternon",[0,6.8,.62]);
contextoModulo.ovalo(p,[0,0,0],[.13,.68,.065]);
p=contextoModulo.crearParte("costillas",[0,6.8,0]);
for(let i=0;i<9;i++) {
          const ancho=.65+Math.sin((i/10)*Math.PI)*.45;
          const y=.72-i*.21;
          const puntos=[];
          for(let k=0;k<24;k++) {
            const a=k/24*Math.PI*2;
            puntos.push([Math.cos(a)*ancho,y+.13*Math.sin(a),Math.sin(a)*.6]);
          }
          contextoModulo.tubo(p,puntos,.035,undefined,true);
        }
p=contextoModulo.crearParte("columna",[0,6,-.5]);
for(let i=0;i<22;i++) {
          contextoModulo.ovalo(p,[0,2.05-i*.175,0],[.15,.085,.13]);
          contextoModulo.segmento(p,[0,2.05-i*.175,0],[0,2.05-i*.175,-.17],.035);
        }
p=contextoModulo.crearParte("humeros");
contextoModulo.miembros(p,[[[1.1,7.38,0],[1.73,5.8,0]]],.105);
p=contextoModulo.crearParte("radios");
contextoModulo.miembros(p,[[[1.82,5.78,.02],[2.13,4.12,.08]]],.065);
p=contextoModulo.crearParte("cubitos");
contextoModulo.miembros(p,[[[1.66,5.8,-.04],[1.98,4.12,.02]]],.06);
p=contextoModulo.crearParte("pelvis_osea",[0,4.55,0]);
for(const s of [-1,1]) {
          const m=contextoModulo.ovalo(p,[s*.64,0,-.1],[.4,.57,.21]);
          m.rotation.z=-s*.25;
          contextoModulo.tubo(p,[[s*.78,-.2,0],[s*.58,-.53,.27],[s*.17,-.45,.36],[s*.1,-.08,.25]],.095);
        }
p=contextoModulo.crearParte("femures");
contextoModulo.miembros(p,[[[.57,4.18,0],[.6,2.48,0]]],.125);
p=contextoModulo.crearParte("rotulas");
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.6,2.43,.17],[.15,.19,.09]);
p=contextoModulo.crearParte("tibias");
contextoModulo.miembros(p,[[[.55,2.3,0],[.55,.48,0]]],.095);
p=contextoModulo.crearParte("perones");
contextoModulo.miembros(p,[[[.76,2.28,-.02],[.76,.43,-.02]]],.045);
}
