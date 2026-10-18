// Respaldo esquemático original: geometrías y orden conservados.
export function crear_endocrino_1(contextoModulo){
let p;
p=contextoModulo.crearParte("hipofisis",[0,8.87,.08]);
contextoModulo.ovalo(p,[0,0,0],[.085,.065,.07]);
contextoModulo.segmento(p,[0,.03,0],[0,.15,0],.023);
p=contextoModulo.crearParte("tiroides",[0,7.92,.29]);
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.14,0,0],[.095,.18,.07]);
contextoModulo.segmento(p,[-.1,-.01,0],[.1,-.01,0],.035);
p=contextoModulo.crearParte("suprarrenales");
for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.64,s<0?5.66:5.79,-.33],[.16,.09,.12]);
}
