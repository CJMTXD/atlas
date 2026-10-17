// Funciones extraídas con referencias explícitas al contexto compartido.
export function configurarExamen(contextoModulo){
          contextoModulo.soloErrores=false;contextoModulo.titulo("Simulacro de examen");if(contextoModulo.faltaBanco())return;contextoModulo.filtros();
          const label=contextoModulo.nodo("label","Duración en minutos "),input=contextoModulo.nodo("input",null,{type:"number",min:1,max:120,value:20,id:"exam-minutes","aria-label":"Minutos del simulacro"});label.append(input);contextoModulo.contenido.append(label);
          contextoModulo.contenido.append(contextoModulo.mensaje("20 preguntas distintas. No se muestra retroalimentación ni se resalta la estructura hasta finalizar. El reloj continúa si cierras el panel."));
          contextoModulo.contenido.append(contextoModulo.boton("Iniciar simulacro",()=>{const minutos=Number(input.value);if(!Number.isFinite(minutos)||minutos<1||minutos>120){contextoModulo.contextoModulo.avisar("Elige una duración entre 1 y 120 minutos.");return;}contextoModulo.comenzarSesion(true,minutos);}));
        }

export default {id:"examen",titulo:"Simulacro",montar:configurarExamen,desmontar(){}};
