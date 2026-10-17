// Funciones extraídas con referencias explícitas al contexto compartido.
export function actualizarCorte(contextoModulo) {
        const eje=contextoModulo.$("clip-axis").value;
        const fraccion=Number(contextoModulo.$("clip-position").value)/100;
        const caja=contextoModulo.cajaCuerpo;
        const minimo=caja.min[eje]-.1,maximo=caja.max[eje]+.1;
        contextoModulo.planoCorte.normal.set(eje==="x"?-1:0,eje==="y"?-1:0,eje==="z"?-1:0);
        contextoModulo.planoCorte.constant=contextoModulo.T.MathUtils.lerp(minimo,maximo,fraccion);
        contextoModulo.estado.corte=contextoModulo.$("clip-enabled").checked;
        contextoModulo.aplicarEstado();
      }
