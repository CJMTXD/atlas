// Respaldo esquemático original: geometrías y orden conservados.
export function crear_nervioso_1(contextoModulo){
let p;
p=contextoModulo.crearParte("cerebro",[0,9.17,.02]);
for(const s of [-1,1]) {
          contextoModulo.ovalo(p,[s*.235,0,0],[.28,.47,.43],"#edbc9e");
          for(let i=0;i<7;i++) {
            const y=-.28+i*.085;
            contextoModulo.tubo(p,[[s*.07,y,.35],[s*.24,y+.04,.4],[s*.43,y,.24]],.024,"#c98d83");
          }
        }
p=contextoModulo.crearParte("cerebelo",[0,8.76,-.27]);
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.19,0,0],[.22,.21,.21],"#d6ad86");
p=contextoModulo.crearParte("tronco",[0,8.55,-.13]);
contextoModulo.ovalo(p,[0,0,0],[.12,.33,.13]);
p=contextoModulo.crearParte("medula",[0,6.85,-.37]);
contextoModulo.segmento(p,[0,1.45,0],[0,-1.65,0],.045);
p=contextoModulo.crearParte("nervios");
contextoModulo.miembros(p,[
          [[.08,7.5,-.25],[1.1,7.32,-.18]],
          [[1.1,7.32,-.18],[1.8,5.72,-.12]],
          [[1.8,5.72,-.12],[2.05,4.2,.1]],
          [[.08,5.05,-.35],[.52,4.05,-.2]],
          [[.52,4.05,-.2],[.65,2.4,-.14]],
          [[.65,2.4,-.14],[.64,.5,-.1]]
        ],.027);
}
