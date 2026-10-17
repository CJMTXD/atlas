// SM-2: calidad 0–5, intervalo en días y factor mínimo 1,3.
export function programarSM2(anterior={},calidad=4,ahora=Date.now()){
 const q=Math.max(0,Math.min(5,Math.round(Number(calidad)||0)));
 let repeticiones=Number(anterior.repeticiones)||0,intervalo=Number(anterior.intervalo)||0,factor=Math.max(1.3,Number(anterior.factor)||2.5);
 if(q<3){repeticiones=0;intervalo=1;}else{intervalo=repeticiones===0?1:repeticiones===1?6:Math.max(1,Math.round(intervalo*factor));repeticiones++;}
 factor=Math.max(1.3,factor+.1-(5-q)*(.08+(5-q)*.02));
 return {repeticiones,intervalo,factor,vence:ahora+intervalo*86400000,ultima:ahora,calidad:q};
}
