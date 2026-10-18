// Respaldo esquemático original: geometrías y orden conservados.
export function crear_digestivo_1(contextoModulo){
let p;
p=contextoModulo.crearParte("lengua",[0,8.5,.43]);
contextoModulo.ovalo(p,[0,0,0],[.19,.06,.18],"#cd6b7a");
p=contextoModulo.crearParte("esofago");
contextoModulo.tubo(p,[[0,8.1,-.12],[0,7.1,-.17],[.04,6.1,-.12],[.37,5.65,.02]],.06,"#cda292");
p=contextoModulo.crearParte("higado",[-.4,5.62,.25]);
const hig=contextoModulo.ovalo(p,[0,0,0],[.69,.33,.4],"#91504d");
hig.rotation.z=.12;
p=contextoModulo.crearParte("vesicula",[-.43,5.35,.47]);
contextoModulo.ovalo(p,[0,0,0],[.12,.2,.1],"#7eaa58");
p=contextoModulo.crearParte("estomago",[.5,5.33,.25]);
const est=contextoModulo.ovalo(p,[0,0,0],[.35,.43,.25],"#dda5a0");
est.rotation.z=-.45;
contextoModulo.tubo(p,[[-.12,.3,0],[-.15,.53,-.05]],.075,"#dda5a0");
p=contextoModulo.crearParte("pancreas",[.08,5.12,-.11]);
const pan=contextoModulo.ovalo(p,[0,0,0],[.55,.12,.15],"#dbbb78");
pan.rotation.z=.12;
p=contextoModulo.crearParte("intestino_delgado",[0,4.55,.29]);
const asas=[];
for(let fila=0;fila<5;fila++) {
          const direccion=fila%2 ? -1:1;
          for(let i=0;i<7;i++) asas.push([
            direccion*(-.5+i/6), .47-fila*.22,
            .03*Math.sin(i*1.5+fila)
          ]);
        }
contextoModulo.tubo(p,asas,.078,"#dba78f");
p=contextoModulo.crearParte("colon",[0,4.66,.24]);
const marco=[
          [-.78,-.55,0],[-.82,.1,0],[-.78,.7,0],
          [-.3,.8,0],[.3,.77,0],[.76,.63,0],
          [.8,.1,0],[.73,-.45,0],[.3,-.65,.02],[.03,-.86,0]
        ];
contextoModulo.tubo(p,marco,.12,"#bb8a79");
p=contextoModulo.crearParte("recto",[0,3.82,-.08]);
contextoModulo.tubo(p,[[.08,.26,0],[.03,0,0],[0,-.36,.04]],.11,"#ba8d83");
}
