// Respaldo esquemático original: geometrías y orden conservados.
export function crear_muscular_1(contextoModulo){
let p;
p=contextoModulo.crearParte("deltoides");
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*1.15,7.28,0],[.38,.5,.38]);
p=contextoModulo.crearParte("biceps");
for(const s of [-1,1]) {
          const m=contextoModulo.ovalo(p,[s*1.48,6.5,.16],[.24,.65,.22]);
          m.rotation.z=s*.32;
        }
p=contextoModulo.crearParte("triceps");
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*1.47,6.5,-.22],[.24,.62,.23]);
p=contextoModulo.crearParte("pectoral");
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.51,7.03,.54],[.58,.45,.16]);
p=contextoModulo.crearParte("recto_abdominal");
for(const s of [-1,1]) for(let i=0;i<4;i++)
          contextoModulo.ovalo(p,[s*.24,5.98-i*.33,.56],[.21,.16,.1]);
p=contextoModulo.crearParte("gluteo");
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.47,4.35,-.48],[.5,.55,.25]);
p=contextoModulo.crearParte("cuadriceps");
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.6,3.35,.16],[.35,.9,.3]);
p=contextoModulo.crearParte("gastrocnemio");
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.6,1.65,-.18],[.26,.66,.27]);
}
