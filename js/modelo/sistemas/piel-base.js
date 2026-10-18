// Respaldo esquemático original: geometrías y orden conservados.
export function crear_piel_1(contextoModulo){
let p;
p=contextoModulo.crearParte("piel");
contextoModulo.ovalo(p,[0,9,0],[.65,.85,.6]);
contextoModulo.ovalo(p,[0,6.55,0],[1.2,1.55,.65]);
contextoModulo.ovalo(p,[0,4.75,0],[.95,.85,.58]);
contextoModulo.segmento(p,[0,8.3,0],[0,7.7,0],.34);
contextoModulo.miembros(p,[
          [[1,7.45,0],[1.75,5.75,0]],
          [[1.75,5.75,0],[2.03,4.08,.1]],
          [[.55,4.3,0],[.6,2.45,0]],
          [[.6,2.45,0],[.6,.45,0]]
        ],.3);
for(const s of [-1,1]) {
          contextoModulo.ovalo(p,[s*2.05,3.8,.12],[.18,.35,.12]);
          contextoModulo.ovalo(p,[s*.6,.25,.2],[.27,.2,.5]);
        }
}
