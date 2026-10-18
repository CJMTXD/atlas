// Respaldo esquemático original: geometrías y orden conservados.
export function crear_respiratorio_1(contextoModulo){
let p;
p=contextoModulo.crearParte("pulmon_derecho",[-.63,6.8,.08]);
contextoModulo.ovalo(p,[0,0,0],[.44,.84,.39]);
for(let i=0;i<2;i++) contextoModulo.tubo(p,[[-.35,.18-i*.43,.27],[0,.02-i*.43,.39],[.32,-.04-i*.43,.23]],.015,"#a36d88");
p=contextoModulo.crearParte("pulmon_izquierdo",[.65,6.82,.06]);
contextoModulo.ovalo(p,[0,0,0],[.39,.79,.36]);
contextoModulo.tubo(p,[[-.28,.17,.27],[0,.02,.36],[.28,-.1,.24]],.015,"#a36d88");
p=contextoModulo.crearParte("traquea",[0,7.7,.12]);
contextoModulo.segmento(p,[0,.55,0],[0,-.55,0],.105,"#b9c5bd");
for(let i=0;i<9;i++) {
          const aro=new contextoModulo.T.TorusGeometry(.108,.018,6,16);
          const mesh=contextoModulo.agregarMalla(p,aro,[1,1,1],[0,.48-i*.11,0],"#e6d5bc");
          mesh.rotation.x=Math.PI/2;
        }
contextoModulo.segmento(p,[0,-.5,0],[-.5,-.88,0],.07);
contextoModulo.segmento(p,[0,-.5,0],[.5,-.88,0],.07);
p=contextoModulo.crearParte("diafragma",[0,5.95,0]);
contextoModulo.ovalo(p,[0,0,0],[1,.15,.58],"#b96e79");
}
