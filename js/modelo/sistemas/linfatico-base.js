// Respaldo esquemático original: geometrías y orden conservados.
export function crear_linfatico_1(contextoModulo){
let p;
p=contextoModulo.crearParte("bazo",[.87,5.56,-.11]);
const bz=contextoModulo.ovalo(p,[0,0,0],[.17,.33,.18],"#8c5e89");
bz.rotation.z=-.2;
p=contextoModulo.crearParte("timo",[0,7.13,.43]);
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.095,0,0],[.115,.24,.075]);
p=contextoModulo.crearParte("ganglios");
for(const s of [-1,1]) {
          for(let i=0;i<4;i++) {
            contextoModulo.ovalo(p,[s*(.28+i*.06),8.07-i*.11,.04],[.045,.06,.04]);
            contextoModulo.ovalo(p,[s*(1.01+i*.025),7.1-i*.09,.02],[.05,.065,.05]);
            contextoModulo.ovalo(p,[s*(.3+i*.12),4.2-i*.05,.22],[.05,.06,.05]);
          }
        }
}
