// Respaldo esquemático original: geometrías y orden conservados.
export function crear_urinario_1(contextoModulo){
let p;
p=contextoModulo.crearParte("rinon_derecho",[-.65,5.26,-.34]);
const rd=contextoModulo.ovalo(p,[0,0,0],[.22,.34,.18]);
rd.rotation.z=-.22;
p=contextoModulo.crearParte("rinon_izquierdo",[.65,5.39,-.34]);
const ri=contextoModulo.ovalo(p,[0,0,0],[.22,.34,.18]);
ri.rotation.z=.22;
p=contextoModulo.crearParte("ureter_derecho");
contextoModulo.tubo(p,[[-.52,5.1,-.25],[-.45,4.6,-.2],[-.28,3.91,.08]],.028,"#dbbf8b");
p=contextoModulo.crearParte("ureter_izquierdo");
contextoModulo.tubo(p,[[.52,5.23,-.25],[.45,4.6,-.2],[.28,3.91,.08]],.028,"#dbbf8b");
p=contextoModulo.crearParte("vejiga",[0,3.85,.28]);
contextoModulo.ovalo(p,[0,0,0],[.3,.28,.22],"#c7a28d");
}
