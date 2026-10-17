// Funciones extraídas con referencias explícitas al contexto compartido.
export function configurarQuiz(contextoModulo){contextoModulo.soloErrores=false;contextoModulo.titulo("Quiz del banco");if(contextoModulo.faltaBanco())return;contextoModulo.filtros();contextoModulo.contenido.append(contextoModulo.mensaje("Combina opción múltiple, completar, verdadero/falso y ordenar el recorrido renal. Las respuestas y los distractores proceden del banco del documento."));contextoModulo.contenido.append(contextoModulo.boton("Comenzar",()=>contextoModulo.comenzarSesion(false)));}

export default {id:"quiz",titulo:"Quiz del banco",montar:configurarQuiz,desmontar(){}};
