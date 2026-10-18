// Respaldo esquemático original: geometrías y orden conservados.
export function crear_circulatorio_1(contextoModulo){
let p;
p=contextoModulo.crearParte("corazon",[.18,6.38,.3]);
const h=contextoModulo.ovalo(p,[0,0,0],[.35,.46,.29],"#c54860");
h.rotation.z=-.35;
contextoModulo.ovalo(p,[-.17,.22,0],[.22,.23,.21],"#d2697b");
contextoModulo.tubo(p,[[0,.3,0],[.02,.65,0],[-.22,.72,-.03]],.08,"#e66569");
contextoModulo.tubo(p,[[.2,.25,.22],[.18,-.08,.27],[0,-.32,.18]],.022,"#efb18d");
p=contextoModulo.crearParte("aorta");
contextoModulo.tubo(p,[[.15,6.62,.2],[.1,7,.14],[-.23,7.05,-.02],[-.3,6.6,-.15],[-.24,5.5,-.2],[-.2,4.6,-.23]],.085,"#dd4c53");
contextoModulo.miembros(p,[[[.2,4.6,-.23],[.53,3.6,-.15]]],.045,"#dd4c53");
p=contextoModulo.crearParte("vena_cava");
contextoModulo.tubo(p,[[-.16,7.6,-.1],[-.2,6.7,-.08],[-.13,6.4,-.05]],.09,"#5b8cc5");
contextoModulo.tubo(p,[[-.13,6.25,-.08],[-.08,5.5,-.15],[-.06,4.5,-.14]],.095,"#5b8cc5");
}
