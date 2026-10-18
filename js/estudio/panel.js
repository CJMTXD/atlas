import {areas, areaDeModo, montarMenu} from "./menu.js";
import * as registro from "../plugins/registro.js";
import {inicio as extraido_inicio} from './inicio.js';
import {configurarQuiz as extraido_configurarQuiz} from './quiz.js';
import {iniciarFlash as extraido_iniciarFlash} from './flash.js';
import {recorrido as extraido_recorrido} from './ruta.js';
import {nefrona as extraido_nefrona} from './nefrona.js';
import {histologia as extraido_histologia} from './histologia.js';
import {tablaEpitelios as extraido_tablaEpitelios} from './epitelios.js';
import {comparador as extraido_comparador} from './comparar.js';
import {autoevaluacion as extraido_autoevaluacion} from './auto.js';
import {configurarExamen as extraido_configurarExamen} from './examen.js';
import {panelErrores as extraido_panelErrores} from './errores.js';
import {guardar as extraido_guardar} from './progreso.js';
import {filtros as extraido_filtros} from './filtros.js';
import {bancoFiltrado as extraido_bancoFiltrado} from './filtros.js';
import {candidatosDistractores as extraido_candidatosDistractores} from './motor-preguntas.js';
import {prepararPregunta as extraido_prepararPregunta} from './motor-preguntas.js';
import {comenzarSesion as extraido_comenzarSesion} from './sesiones.js';
import {formatoTiempo as extraido_formatoTiempo} from './sesiones.js';
import {actualizarReloj as extraido_actualizarReloj} from './sesiones.js';
import {mostrarPregunta as extraido_mostrarPregunta} from './sesiones.js';
import {dibujarOrden as extraido_dibujarOrden} from './motor-preguntas.js';
import {responder as extraido_responder} from './sesiones.js';
import {siguiente as extraido_siguiente} from './sesiones.js';
import {finalizarSesion as extraido_finalizarSesion} from './sesiones.js';
import {mostrarFlash as extraido_mostrarFlash} from './leitner.js';
import {voltear as extraido_voltear} from './leitner.js';
import {calificarFlash as extraido_calificarFlash} from './leitner.js';
import {resumenFlash as extraido_resumenFlash} from './leitner.js';
import {dibujoEpitelio as extraido_dibujoEpitelio} from './esquemas-svg.js';
// Funciones extraídas con referencias explícitas al contexto compartido.
export function iniciarEstudio(contextoModulo) {
const contextoCompartido={
  get area(){return area;},
  montarMenu(){montarMenu(contextoCompartido,registro);},
  cerrarPanel(){cerrar();},
  get titulo(){return titulo;},set titulo(v){titulo=v;},
  get contenido(){return contenido;},set contenido(v){contenido=v;},
  get mensaje(){return mensaje;},set mensaje(v){mensaje=v;},
  get contextoModulo(){return contextoModulo;},set contextoModulo(v){contextoModulo=v;},
  get nodo(){return nodo;},set nodo(v){nodo=v;},
  get boton(){return boton;},set boton(v){boton=v;},
  get persistente(){return persistente;},set persistente(v){persistente=v;},
  get progreso(){return progreso;},set progreso(v){progreso=v;},
  get formatoTiempo(){return formatoTiempo;},set formatoTiempo(v){formatoTiempo=v;},
  get soloErrores(){return soloErrores;},set soloErrores(v){soloErrores=v;},
  get faltaBanco(){return faltaBanco;},set faltaBanco(v){faltaBanco=v;},
  get filtros(){return filtros;},set filtros(v){filtros=v;},
  get comenzarSesion(){return comenzarSesion;},set comenzarSesion(v){comenzarSesion=v;},
  get barajar(){return barajar;},set barajar(v){barajar=v;},
  get bancoFiltrado(){return bancoFiltrado;},set bancoFiltrado(v){bancoFiltrado=v;},
  get flash(){return flash;},set flash(v){flash=v;},
  get mostrarFlash(){return mostrarFlash;},set mostrarFlash(v){mostrarFlash=v;},
  get resaltarEstructura(){return resaltarEstructura;},set resaltarEstructura(v){resaltarEstructura=v;},
  get limpiar(){return limpiar;},set limpiar(v){limpiar=v;},
  get svgNodo(){return svgNodo;},set svgNodo(v){svgNodo=v;},
  get svgActivo(){return svgActivo;},set svgActivo(v){svgActivo=v;},
  get animacionSVG(){return animacionSVG;},set animacionSVG(v){animacionSVG=v;},
  get dibujoEpitelio(){return dibujoEpitelio;},set dibujoEpitelio(v){dibujoEpitelio=v;},
  get sincronizarSexo(){return sincronizarSexo;},set sincronizarSexo(v){sincronizarSexo=v;},
  get guardar(){return guardar;},set guardar(v){guardar=v;},
  get modo(){return modo;},set modo(v){modo=v;},
  get clave(){return clave;},set clave(v){clave=v;},
  get filtroSeccion(){return filtroSeccion;},set filtroSeccion(v){filtroSeccion=v;},
  get filtroDificultad(){return filtroDificultad;},set filtroDificultad(v){filtroDificultad=v;},
  get claveRespuesta(){return claveRespuesta;},set claveRespuesta(v){claveRespuesta=v;},
  get candidatosDistractores(){return candidatosDistractores;},set candidatosDistractores(v){candidatosDistractores=v;},
  get sesion(){return sesion;},set sesion(v){sesion=v;},
  get prepararPregunta(){return prepararPregunta;},set prepararPregunta(v){prepararPregunta=v;},
  get mostrarPregunta(){return mostrarPregunta;},set mostrarPregunta(v){mostrarPregunta=v;},
  get cronometro(){return cronometro;},set cronometro(v){cronometro=v;},
  get actualizarReloj(){return actualizarReloj;},set actualizarReloj(v){actualizarReloj=v;},
  get finalizarSesion(){return finalizarSesion;},set finalizarSesion(v){finalizarSesion=v;},
  get dibujarOrden(){return dibujarOrden;},set dibujarOrden(v){dibujarOrden=v;},
  get siguiente(){return siguiente;},set siguiente(v){siguiente=v;},
  get responder(){return responder;},set responder(v){responder=v;},
  get canon(){return canon;},set canon(v){canon=v;},
  get cambiarModo(){return cambiarModo;},set cambiarModo(v){cambiarModo=v;},
  get voltear(){return voltear;},set voltear(v){voltear=v;},
  get resumenFlash(){return resumenFlash;},set resumenFlash(v){resumenFlash=v;},
  get calificarFlash(){return calificarFlash;},set calificarFlash(v){calificarFlash=v;}
};

        // Toda inserción de texto se realiza mediante textContent. No se evalúan datos.
        const nodo=(tag,texto,attrs={})=>{const n=document.createElement(tag);if(texto!==null&&texto!==undefined)n.textContent=texto;for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
        const boton=(texto,fn,attrs={})=>{const b=nodo("button",texto,{type:"button",...attrs});b.onclick=fn;return b;};
        const svgNodo=(tag,attrs={},texto)=>{const n=document.createElementNS("http://www.w3.org/2000/svg",tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));if(texto!==undefined)n.textContent=texto;return n;};
        const limpiar=n=>n.replaceChildren();
        const mensaje=(texto,clase="study-status")=>nodo("p",texto,{class:clase});
        const barajar=lista=>{const x=[...lista];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
        const canon=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
        // Respuestas equivalentes no deben aparecer como distractores entre sí.
        const claveRespuesta=s=>/urotelio/i.test(s)?"epiteliodetransicionurotelio":canon(s);
        const clave="atlas-urinario-estudio-v1";
        let progreso={tarjetas:{},errores:{},autoevaluacion:{},sesiones:[]},persistente=true;
        try{const x=JSON.parse(localStorage.getItem(clave)||"null");if(x&&typeof x==="object")for(const k of ["tarjetas","errores","autoevaluacion"])if(x[k]&&typeof x[k]==="object"&&!Array.isArray(x[k]))progreso[k]=x[k];if(Array.isArray(x?.sesiones))progreso.sesiones=x.sesiones.slice(-50);}catch{persistente=false;}
        function guardar(...args){return extraido_guardar(contextoCompartido,...args);}
        let area="estudio";
        let modo="inicio",sesion=null,cronometro=null,flash=null,svgActivo=null,animacionSVG=null;
        let filtroSeccion="todas",filtroDificultad="todas",soloErrores=false;
        const panelEst=nodo("section",null,{id:"study-panel",class:"study-panel","aria-label":"Estudiar aparato urinario"});panelEst.hidden=true;
        const cab=nodo("div",null,{class:"study-header"});cab.append(nodo("h2","Atlas · aprender"),boton("Cerrar",cerrar,{"aria-label":"Cerrar panel Estudiar"}));
        const navegacion=nodo("nav",null,{class:"study-nav","aria-label":"Apartados del atlas"}),contenido=nodo("div",null,{class:"study-body",id:"study-content",tabindex:"-1"});
        panelEst.append(cab,navegacion,contenido);document.querySelector("main").append(panelEst);
        const abrir=boton("Estudiar",()=>{if(contextoModulo.vistaMovil.matches){contextoModulo.estadoPanel("left",false);contextoModulo.estadoPanel("right",false);}panelEst.hidden=false;abrir.setAttribute("aria-expanded","true");if(contextoModulo.estado.quiz.activo)contextoModulo.terminarQuiz();if(svgActivo)svgActivo.unpauseAnimations?.();registro[modo]?.reanudar?.();contenido.focus({preventScroll:true});},{id:"study-open","aria-expanded":"false","aria-controls":"study-panel"});
        document.querySelector(".header-actions").prepend(abrir);
        const volver=boton("← Volver al menú",()=>cambiarModo("inicio"),{class:"study-back"});
        volver.hidden=true;panelEst.insertBefore(volver,contenido);
        for(const [id,datos] of Object.entries(areas))navegacion.append(boton(datos.titulo,()=>cambiarModo("inicio",id),{"data-area":id,"aria-pressed":String(id===area)}));
        function sincronizarMenu(){
          navegacion.querySelectorAll("[data-area]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.area===area)));
          volver.hidden=modo==="inicio";
          panelEst.dataset.activeMode=modo;
        }
        function cerrar({devolverFoco=true}={}){registro[modo]?.pausar?.();panelEst.hidden=true;abrir.setAttribute("aria-expanded","false");svgActivo?.pauseAnimations?.();if(contextoModulo.urinario.flujo){contextoModulo.urinario.pausa=true;if(contextoModulo.$("urine-play"))contextoModulo.$("urine-play").textContent="Continuar";}contextoModulo.solicitarRender();if(devolverFoco)abrir.focus({preventScroll:true});}
        function cambiarModo(nuevo,nuevaArea){
          if(sesion&&!sesion.terminada){finalizarSesion("Sesión interrumpida al cambiar de modo");return;}
          if(modo==="flash"&&flash?.vistas){resumenFlash();return;}
          svgActivo?.pauseAnimations?.();svgActivo=null;animacionSVG=null;
          if(modo==="ruta"){contextoModulo.urinario.flujo=false;contextoModulo.particulasOrina.visible=false;contextoModulo.urinario.callback=null;contextoModulo.solicitarRender();}
          if(modo==="comparar"){contextoModulo.urinario.comparar=false;contextoModulo.aplicarEstado();}
          registro[modo]?.desmontar();
          modo=nuevo;area=nuevaArea||areaDeModo(nuevo)||area;limpiar(contenido);sincronizarMenu();
          registro[modo].montar(contextoCompartido);
          contenido.scrollTop=0;contenido.focus({preventScroll:true});
        }
        function faltaBanco(){if(contextoModulo.BANCO.length)return false;contenido.append(mensaje("Pendiente del DOCX: este modo necesita las preguntas y respuestas exactas de Cuestionario_Aparato_Urinario_Laboratorio_11.docx. No se han creado preguntas de sustitución.","study-alert"));return true;}
        function titulo(texto){contenido.append(nodo("h3",texto));}
        function inicio(...args){return extraido_inicio(contextoCompartido,...args);}
        function filtros(...args){return extraido_filtros(contextoCompartido,...args);}
        function bancoFiltrado(...args){return extraido_bancoFiltrado(contextoCompartido,...args);}
        function configurarQuiz(...args){return extraido_configurarQuiz(contextoCompartido,...args);}
        function configurarExamen(...args){return extraido_configurarExamen(contextoCompartido,...args);}
        function candidatosDistractores(...args){return extraido_candidatosDistractores(contextoCompartido,...args);}
        function prepararPregunta(...args){return extraido_prepararPregunta(contextoCompartido,...args);}
        function comenzarSesion(...args){return extraido_comenzarSesion(contextoCompartido,...args);}
        function formatoTiempo(...args){return extraido_formatoTiempo(contextoCompartido,...args);}
        function actualizarReloj(...args){return extraido_actualizarReloj(contextoCompartido,...args);}
        document.addEventListener("visibilitychange",actualizarReloj);
        function mostrarPregunta(...args){return extraido_mostrarPregunta(contextoCompartido,...args);}
        function dibujarOrden(...args){return extraido_dibujarOrden(contextoCompartido,...args);}
        function responder(...args){return extraido_responder(contextoCompartido,...args);}
        function resaltarEstructura(id){if(Array.isArray(id))id=id[0];if(id&&contextoModulo.partes.has(id)){if(contextoModulo.estado.quiz.activo)contextoModulo.terminarQuiz();contextoModulo.seleccionar(id);}}
        function siguiente(...args){return extraido_siguiente(contextoCompartido,...args);}
        function finalizarSesion(...args){return extraido_finalizarSesion(contextoCompartido,...args);}
        function iniciarFlash(...args){return extraido_iniciarFlash(contextoCompartido,...args);}
        function mostrarFlash(...args){return extraido_mostrarFlash(contextoCompartido,...args);}
        function voltear(...args){return extraido_voltear(contextoCompartido,...args);}
        function calificarFlash(...args){return extraido_calificarFlash(contextoCompartido,...args);}
        function resumenFlash(...args){return extraido_resumenFlash(contextoCompartido,...args);}
        function panelErrores(...args){return extraido_panelErrores(contextoCompartido,...args);}
        function autoevaluacion(...args){return extraido_autoevaluacion(contextoCompartido,...args);}
        function tablaEpitelios(...args){return extraido_tablaEpitelios(contextoCompartido,...args);}
        function recorrido(...args){return extraido_recorrido(contextoCompartido,...args);}
        function comparador(...args){return extraido_comparador(contextoCompartido,...args);}
        function sincronizarSexo(){panelEst.querySelectorAll("[data-sex]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.sex===contextoModulo.urinario.sexo)));}

        /* Esquemas SVG y juegos histológicos: construidos con nodos DOM. */
        function dibujoEpitelio(...args){return extraido_dibujoEpitelio(contextoCompartido,...args);}
        function histologia(...args){return extraido_histologia(contextoCompartido,...args);}
        function nefrona(...args){return extraido_nefrona(contextoCompartido,...args);}
        function atajo(e){
          if(panelEst.hidden)return false;
          if(e.key==="Escape"){e.preventDefault();cerrar();return true;}
          if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest("input,textarea,select"))return false;
          if(/^[1-4]$/.test(e.key)){const b=contenido.querySelector('[data-answer-index="'+(Number(e.key)-1)+'"]');if(b&&!b.disabled){e.preventDefault();b.click();return true;}}
          if(e.target.closest("button")&&e.key==="Enter")return false;
          if(e.key===" "&&e.target.closest("button")?.id!=="study-flash"&&e.target.closest("button"))return false;
          if(e.key==="Enter"&&sesion&&!sesion.terminada&&sesion.items[sesion.indice].correcta!==null){e.preventDefault();siguiente();return true;}
          if(e.key===" "&&modo==="flash"&&flash){e.preventDefault();voltear();return true;}
          return false;
        }
        registro.inicio.montar(contextoCompartido);
        return {atajo,sincronizarSexo,cerrar,abrirModo(id){abrir.click();cambiarModo(id);},detener(){registro[modo]?.desmontar();clearInterval(cronometro);document.removeEventListener("visibilitychange",actualizarReloj);svgActivo?.pauseAnimations?.();}};
      }
