import {mejorarSuperficies} from "../modelo/detalle-urinario.js";
import {iniciarEstudio as extraido_iniciarEstudio} from '../estudio/panel.js';
import {avisar as extraido_avisar} from '../ui/avisos.js';
import {mostrarInformacion as extraido_mostrarInformacion} from '../ui/informacion.js';
import {seleccionar as extraido_seleccionar} from '../ui/seleccion.js';
import {deseleccionar as extraido_deseleccionar} from '../ui/seleccion.js';
import {aislar as extraido_aislar} from '../ui/seleccion.js';
import {ocultarSeleccionada as extraido_ocultarSeleccionada} from '../ui/seleccion.js';
import {restaurar as extraido_restaurar} from '../ui/seleccion.js';
import {intersectar as extraido_intersectar} from '../ui/punteros.js';
import {sincronizarCapas as extraido_sincronizarCapas} from '../ui/capas.js';
import {construirArbol as extraido_construirArbol} from '../ui/arbol.js';
import {limpiarResultados as extraido_limpiarResultados} from '../ui/buscador.js';
import {buscar as extraido_buscar} from '../ui/buscador.js';
import {actualizarEtiquetas as extraido_actualizarEtiquetas} from '../ui/etiquetas.js';
import {mezclar as extraido_mezclar} from '../ui/quiz-anatomico.js';
import {iniciarQuiz as extraido_iniciarQuiz} from '../ui/quiz-anatomico.js';
import {siguientePregunta as extraido_siguientePregunta} from '../ui/quiz-anatomico.js';
import {responderQuiz as extraido_responderQuiz} from '../ui/quiz-anatomico.js';
import {terminarQuiz as extraido_terminarQuiz} from '../ui/quiz-anatomico.js';
import {actualizarCorte as extraido_actualizarCorte} from '../ui/controles.js';
import {establecerTema as extraido_establecerTema} from '../ui/tema.js';
import {estadoPanel as extraido_estadoPanel} from '../ui/paneles.js';
import {panel as extraido_panel} from '../ui/paneles.js';
import {adaptarPaneles as extraido_adaptarPaneles} from '../ui/paneles.js';
import {texturaSuperficie as extraido_texturaSuperficie} from '../modelo/materiales.js';
import {material as extraido_material} from '../modelo/materiales.js';
import {crearParte as extraido_crearParte} from '../modelo/partes.js';
import {agregarMalla as extraido_agregarMalla} from '../modelo/partes.js';
import {ovalo as extraido_ovalo} from '../modelo/primitivas.js';
import {segmento as extraido_segmento} from '../modelo/primitivas.js';
import {tubo as extraido_tubo} from '../modelo/primitivas.js';
import {miembros as extraido_miembros} from '../modelo/primitivas.js';
import {aplicarAnatomiaIntegrada as extraido_aplicarAnatomiaIntegrada} from '../modelo/integradas.js';
import {crearProcedural as extraido_crearProcedural} from '../modelo/procedural.js';
import {idDeMalla as extraido_idDeMalla} from '../modelo/loader-gltf.js';
import {clonarMateriales as extraido_clonarMateriales} from '../modelo/loader-gltf.js';
import {cargarExternos as extraido_cargarExternos} from '../modelo/loader-gltf.js';
import {fichaUrinaria as extraido_fichaUrinaria} from '../modelo/sistemas/urinario.js';
import {puntoParte as extraido_puntoParte} from '../modelo/sistemas/urinario.js';
import {tuboUrinario as extraido_tuboUrinario} from '../modelo/sistemas/urinario.js';
import {agregarAnatomiaUrinaria as extraido_agregarAnatomiaUrinaria} from '../modelo/sistemas/urinario.js';
import {prepararRutaOrina as extraido_prepararRutaOrina} from '../modelo/recorrido.js';
import {actualizarOrina as extraido_actualizarOrina} from '../modelo/recorrido.js';
import {estudiarUrinario as extraido_estudiarUrinario} from '../modelo/sistemas/urinario.js';
import {cambiarSexoUrinario as extraido_cambiarSexoUrinario} from '../modelo/sistemas/urinario.js';
import {materiales as extraido_materiales} from './estado.js';
import {estaVisible as extraido_estaVisible} from './estado.js';
import {aplicarEstado as extraido_aplicarEstado} from './estado.js';
import {actualizarContorno as extraido_actualizarContorno} from './estado.js';
import {solicitarRender as extraido_solicitarRender} from './render.js';
import {renderizar as extraido_renderizar} from './render.js';
import {redimensionar as extraido_redimensionar} from './escena.js';
import {moverCamara as extraido_moverCamara} from './camara.js';
import {enfocarParte as extraido_enfocarParte} from './camara.js';
import {vista as extraido_vista} from './camara.js';
import {liberarRecursos as extraido_liberarRecursos} from './recursos.js';
import {datos} from "./datos.js";
import {cargarMallas} from "../modelo/loader-mallas.js";

    // Fuente: DOCX del laboratorio 11. Preguntas y respuestas literales; dificultad didáctica añadida.
    const BANCO=[...datos["banco-urinario"],...datos["orden-urinario"]];
    const FUENTE_DOCX=datos["fuente"];
    const AUTOEVALUACION=datos["autoevaluacion"];
    const SECCIONES=datos["secciones"];
    const EPITELIOS=datos["epitelios"];
    const OBSERVACIONES_DOCX=datos["observaciones"];

    /*
     * CONFIGURACIÓN DE MODELOS
     * Sustituye el respaldo por GLB con licencia compatible y atribución.
     * Puedes obtener anatomía de proyectos como BodyParts3D o Z-Anatomy,
     * o de autores de Sketchfab. Verifica la licencia de cada recurso.
     *
     * "procedural": no solicita archivos.
     * "unico": carga un GLB y asocia sus mallas por nombre.
     * "multiple": carga los elementos habilitados de MODELOS.
     *
     * Los GLB deben usar metros/unidades coherentes. Ajusta escala, posición
     * y rotación para encajarlos en el cuerpo de referencia, de 0 a 10 en Y.
     * Los archivos locales externos suelen requerir un servidor HTTP.
     */
    const {modo:MODO_MODELO,unico:MODELO_UNICO,multiples:MODELOS,alias:ALIAS_MALLAS}=datos.modelos;
    const $ = id => document.getElementById(id);
    const setProgress = (value, message) => {
      $("load-progress").value = value;
      $("load-text").textContent = message;
    };

    try {
      const [
        THREE, { OrbitControls }, { GLTFLoader },
        { EffectComposer }, { RenderPass }, { OutlinePass }, { OutputPass }
      ] = await Promise.all([
        import("three"),
        import("three/addons/controls/OrbitControls.js"),
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/postprocessing/EffectComposer.js"),
        import("three/addons/postprocessing/RenderPass.js"),
        import("three/addons/postprocessing/OutlinePass.js"),
        import("three/addons/postprocessing/OutputPass.js")
      ]);
      await iniciar(THREE, OrbitControls, GLTFLoader, EffectComposer, RenderPass, OutlinePass, OutputPass);
    } catch (error) {
      console.error("No se pudo iniciar Atlas:", error);
      setProgress(0, "No se pudo iniciar el visor. Comprueba la conexión al CDN y la disponibilidad de WebGL 2. Detalle: " + error.message);
      $("reload").hidden = false;
    }

    async function iniciar(T, OrbitControls, GLTFLoader, EffectComposer, RenderPass, OutlinePass, OutputPass) {
const contextoCompartido={get SISTEMAS(){return SISTEMAS;},set SISTEMAS(v){SISTEMAS=v;},get urinario(){return urinario;},set urinario(v){urinario=v;},get estado(){return estado;},set estado(v){estado=v;},get actualizarContorno(){return actualizarContorno;},set actualizarContorno(v){actualizarContorno=v;},get solicitarRender(){return solicitarRender;},set solicitarRender(v){solicitarRender=v;},get partes(){return partes;},set partes(v){partes=v;},get estaVisible(){return estaVisible;},set estaVisible(v){estaVisible=v;},get materiales(){return materiales;},set materiales(v){materiales=v;},get planoCorte(){return planoCorte;},set planoCorte(v){planoCorte=v;},get contorno(){return contorno;},set contorno(v){contorno=v;},get frame(){return frame;},set frame(v){frame=v;},get dibujando(){return dibujando;},set dibujando(v){dibujando=v;},get renderizar(){return renderizar;},set renderizar(v){renderizar=v;},get ultimoTiempo(){return ultimoTiempo;},set ultimoTiempo(v){ultimoTiempo=v;},get actualizarOrina(){return actualizarOrina;},set actualizarOrina(v){actualizarOrina=v;},get transicion(){return transicion;},set transicion(v){transicion=v;},get controles(){return controles;},set controles(v){controles=v;},get actualizarEtiquetas(){return actualizarEtiquetas;},set actualizarEtiquetas(v){actualizarEtiquetas=v;},get compositor(){return compositor;},set compositor(v){compositor=v;},get camara(){return camara;},set camara(v){camara=v;},get T(){return T;},set T(v){T=v;},get $(){return $;},set $(v){$=v;},get renderer(){return renderer;},set renderer(v){renderer=v;},get moverCamara(){return moverCamara;},set moverCamara(v){moverCamara=v;},get VISTAS(){return VISTAS;},set VISTAS(v){VISTAS=v;},get estudioUI(){return estudioUI;},set estudioUI(v){estudioUI=v;},get vistaMovil(){return vistaMovil;},set vistaMovil(v){vistaMovil=v;},get adaptarPaneles(){return adaptarPaneles;},set adaptarPaneles(v){adaptarPaneles=v;},get escena(){return escena;},set escena(v){escena=v;},get texturasDetalle(){return texturasDetalle;},set texturasDetalle(v){texturasDetalle=v;},get texturaSuperficie(){return texturaSuperficie;},set texturaSuperficie(v){texturaSuperficie=v;},get catalogo(){return catalogo;},set catalogo(v){catalogo=v;},get cuerpo(){return cuerpo;},set cuerpo(v){cuerpo=v;},get material(){return material;},set material(v){material=v;},get mallas(){return mallas;},set mallas(v){mallas=v;},get agregarMalla(){return agregarMalla;},set agregarMalla(v){agregarMalla=v;},get geometriaEsfera(){return geometriaEsfera;},set geometriaEsfera(v){geometriaEsfera=v;},get geometriaCilindro(){return geometriaCilindro;},set geometriaCilindro(v){geometriaCilindro=v;},get segmento(){return segmento;},set segmento(v){segmento=v;},get cargarMallas(){return cargarMallas;},set cargarMallas(v){cargarMallas=v;},get setProgress(){return setProgress;},set setProgress(v){setProgress=v;},get crearParte(){return crearParte;},set crearParte(v){crearParte=v;},get miembros(){return miembros;},set miembros(v){miembros=v;},get ovalo(){return ovalo;},set ovalo(v){ovalo=v;},get tubo(){return tubo;},set tubo(v){tubo=v;},get nombres(){return nombres;},set nombres(v){nombres=v;},get normalizar(){return normalizar;},set normalizar(v){normalizar=v;},get MODO_MODELO(){return MODO_MODELO;},set MODO_MODELO(v){MODO_MODELO=v;},get MODELO_UNICO(){return MODELO_UNICO;},set MODELO_UNICO(v){MODELO_UNICO=v;},get MODELOS(){return MODELOS;},set MODELOS(v){MODELOS=v;},get GLTFLoader(){return GLTFLoader;},set GLTFLoader(v){GLTFLoader=v;},get avisar(){return avisar;},set avisar(v){avisar=v;},get idDeMalla(){return idDeMalla;},set idDeMalla(v){idDeMalla=v;},get clonarMateriales(){return clonarMateriales;},set clonarMateriales(v){clonarMateriales=v;},get puntoParte(){return puntoParte;},set puntoParte(v){puntoParte=v;},get particulasOrina(){return particulasOrina;},set particulasOrina(v){particulasOrina=v;},get prepararRutaOrina(){return prepararRutaOrina;},set prepararRutaOrina(v){prepararRutaOrina=v;},get tuboUrinario(){return tuboUrinario;},set tuboUrinario(v){tuboUrinario=v;},get fichaUrinaria(){return fichaUrinaria;},set fichaUrinaria(v){fichaUrinaria=v;},get estacionesOrina(){return estacionesOrina;},set estacionesOrina(v){estacionesOrina=v;},get rutaOrina(){return rutaOrina;},set rutaOrina(v){rutaOrina=v;},get terminarQuiz(){return terminarQuiz;},set terminarQuiz(v){terminarQuiz=v;},get sincronizarCapas(){return sincronizarCapas;},set sincronizarCapas(v){sincronizarCapas=v;},get aplicarEstado(){return aplicarEstado;},set aplicarEstado(v){aplicarEstado=v;},get toastTimer(){return toastTimer;},set toastTimer(v){toastTimer=v;},get seleccionar(){return seleccionar;},set seleccionar(v){seleccionar=v;},get cambiarSexoUrinario(){return cambiarSexoUrinario;},set cambiarSexoUrinario(v){cambiarSexoUrinario=v;},get enfocarParte(){return enfocarParte;},set enfocarParte(v){enfocarParte=v;},get mostrarInformacion(){return mostrarInformacion;},set mostrarInformacion(v){mostrarInformacion=v;},get limpiarResultados(){return limpiarResultados;},set limpiarResultados(v){limpiarResultados=v;},get panel(){return panel;},set panel(v){panel=v;},get deseleccionar(){return deseleccionar;},set deseleccionar(v){deseleccionar=v;},get puntero(){return puntero;},set puntero(v){puntero=v;},get rayo(){return rayo;},set rayo(v){rayo=v;},get REGIONES(){return REGIONES;},set REGIONES(v){REGIONES=v;},get resultados(){return resultados;},set resultados(v){resultados=v;},get indiceResultado(){return indiceResultado;},set indiceResultado(v){indiceResultado=v;},get geometriaGuias(){return geometriaGuias;},set geometriaGuias(v){geometriaGuias=v;},get bufferGuias(){return bufferGuias;},set bufferGuias(v){bufferGuias=v;},get siguientePregunta(){return siguientePregunta;},set siguientePregunta(v){siguientePregunta=v;},get mezclar(){return mezclar;},set mezclar(v){mezclar=v;},get responderQuiz(){return responderQuiz;},set responderQuiz(v){responderQuiz=v;},get cajaCuerpo(){return cajaCuerpo;},set cajaCuerpo(v){cajaCuerpo=v;},get rejilla(){return rejilla;},set rejilla(v){rejilla=v;},get estadoPanel(){return estadoPanel;},set estadoPanel(v){estadoPanel=v;},get BANCO(){return BANCO;},set BANCO(v){BANCO=v;},get FUENTE_DOCX(){return FUENTE_DOCX;},set FUENTE_DOCX(v){FUENTE_DOCX=v;},get OBSERVACIONES_DOCX(){return OBSERVACIONES_DOCX;},set OBSERVACIONES_DOCX(v){OBSERVACIONES_DOCX=v;},get estudiarUrinario(){return estudiarUrinario;},set estudiarUrinario(v){estudiarUrinario=v;},get actualizarCorte(){return actualizarCorte;},set actualizarCorte(v){actualizarCorte=v;},get restaurar(){return restaurar;},set restaurar(v){restaurar=v;},get vista(){return vista;},set vista(v){vista=v;},get SECCIONES(){return SECCIONES;},set SECCIONES(v){SECCIONES=v;},get AUTOEVALUACION(){return AUTOEVALUACION;},set AUTOEVALUACION(v){AUTOEVALUACION=v;},get EPITELIOS(){return EPITELIOS;},set EPITELIOS(v){EPITELIOS=v;}};







      const SISTEMAS=structuredClone(datos.sistemas);
      const REGIONES=structuredClone(datos.regiones);

      /*
       * Catálogo educativo. Cada registro incluye una descripción y función
       * específicas. Las posiciones son únicamente para el respaldo esquemático.
       * Formato: id | español | latín | sistema | región | descripción | función
       *         | ubicación | dato curioso
       */
      const catalogo = new Map(datos.catalogo.map(x=>[x.id,{...x}]));
      const normalizar = texto => String(texto).normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
      const nombres = new Map();
      for (const m of catalogo.values()) {
        [m.id,m.nombre,m.latin].forEach(n => nombres.set(normalizar(n),m.id));
      }
      Object.entries(ALIAS_MALLAS).forEach(([alias,id]) => nombres.set(normalizar(alias),id));

      const vistaMovil=matchMedia("(max-width:850px)");
      const calidadMovilInicial=matchMedia("(max-width:850px) and (pointer:coarse)").matches;
      const escena = new T.Scene();
      const cuerpo = new T.Group();
      escena.add(cuerpo);
      const renderer = new T.WebGLRenderer({ antialias: !calidadMovilInicial, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(calidadMovilInicial?1:Math.min(devicePixelRatio,1.75));
      renderer.shadowMap.enabled = !calidadMovilInicial;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.02;
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.localClippingEnabled = true;
      renderer.setClearColor(0,0);
      renderer.domElement.tabIndex = 0;
      renderer.domElement.setAttribute("aria-label","Modelo anatómico 3D. Arrastra para rotar; usa los controles para seleccionar vistas.");
      $("canvas-wrap").append(renderer.domElement);

      const camara = new T.PerspectiveCamera(38,1,.03,250);
      camara.position.set(0,5,19);
      const controles = new OrbitControls(camara,renderer.domElement);
      controles.target.set(0,4.8,0);
      controles.enableDamping = false; // Las transiciones se animan explícitamente.
      controles.minDistance = .35;
      controles.maxDistance = 45;
      controles.autoRotateSpeed = .8;
      controles.enablePan = true;

      escena.add(new T.HemisphereLight(0xe7f1ff,0x35404b,1.7));
      const principal = new T.DirectionalLight(0xffe8d6,2.8);
      principal.position.set(-5,12,8);
      principal.castShadow = true;
      principal.shadow.mapSize.set(1024,1024);
      principal.shadow.camera.left = -6;
      principal.shadow.camera.right = 6;
      principal.shadow.camera.top = 12;
      principal.shadow.camera.bottom = -2;
      principal.shadow.camera.near = .1;
      principal.shadow.camera.far = 35;
      principal.shadow.normalBias = .035;
      escena.add(principal);
      const relleno = new T.DirectionalLight(0xbad4ff,1.7);
      relleno.position.set(5,7,-5);
      escena.add(relleno);

      const suelo = new T.Mesh(
        new T.PlaneGeometry(200,200),
        new T.ShadowMaterial({ color: 0x000000, opacity: .22 })
      );
      suelo.rotation.x = -Math.PI/2;
      suelo.position.y = -.13;
      suelo.receiveShadow = true;
      escena.add(suelo);
      const rejilla = new T.GridHelper(20,40,0x577082,0x294354);
      rejilla.position.y = -.12;
      rejilla.material.transparent = true;
      rejilla.material.opacity = .13;
      escena.add(rejilla);

      const compositor = new EffectComposer(renderer);
      compositor.addPass(new RenderPass(escena,camara));
      const contorno = new OutlinePass(new T.Vector2(1,1),escena,camara);
      contorno.visibleEdgeColor.set("#8bffe3");
      contorno.hiddenEdgeColor.set("#286b60");
      contorno.edgeStrength = 4;
      contorno.edgeGlow = calidadMovilInicial?0:.65;
      contorno.edgeThickness = 1.6;
      contorno.pulsePeriod = 0;
      compositor.addPass(contorno);
      compositor.addPass(new OutputPass());

      const partes = new Map();
      const mallas = [];
      const geometriaEsfera = new T.SphereGeometry(1,24,16);
      const geometriaCilindro = new T.CylinderGeometry(1,1,1,12);
      const planoCorte = new T.Plane(new T.Vector3(-1,0,0),5);
      const rayo = new T.Raycaster();
      const puntero = new T.Vector2();
      const centroCuerpo = new T.Vector3(0,5,0);
      const estado = {
        seleccionado: null, hover: null, aislado: null,
        ocultos: new Set(), region: "todas",
        explosion: 0, explosionObjetivo: 0,
        corte: false, etiquetas: false, baja: calidadMovilInicial,
        quiz: { activo: false, id: null, aciertos: 0, total: 0, respondido: false }
      };
      let transicion = null, frame = 0, ultimoTiempo = 0, toastTimer, dibujando = false;
      let pointerDown = null, ultimoHover = null, tiempoHover = 0;

      function avisar(...args){return extraido_avisar(contextoCompartido,...args);}
      const texturasDetalle = new Map();
      function texturaSuperficie(...args){return extraido_texturaSuperficie(contextoCompartido,...args);}
      function material(...args){return extraido_material(contextoCompartido,...args);}
      function crearParte(...args){return extraido_crearParte(contextoCompartido,...args);}
      function agregarMalla(...args){return extraido_agregarMalla(contextoCompartido,...args);}
      function ovalo(...args){return extraido_ovalo(contextoCompartido,...args);}
      function segmento(...args){return extraido_segmento(contextoCompartido,...args);}
      function tubo(...args){return extraido_tubo(contextoCompartido,...args);}
      function miembros(...args){return extraido_miembros(contextoCompartido,...args);}

      /*
       * Mallas BodyParts3D integradas en el propio HTML.
       * No se descargan modelos al abrir el visor. Se descomprime un bloque
       * binario y se construye una BufferGeometry indexada por estructura.
       * Conservamos el respaldo para los elementos ausentes en esta edición.
       */
      function aplicarAnatomiaIntegrada(...args){return extraido_aplicarAnatomiaIntegrada(contextoCompartido,...args);}

      // Generación del respaldo: anatomía volumétrica simplificada, no clínica.
      function crearProcedural(...args){return extraido_crearProcedural(contextoCompartido,...args);}

      /*
       * Carga y normalización de GLB.
       * Un archivo múltiple puede contener varias mallas por órgano.
       * En modo único, se busca el nombre de cada malla y sus ancestros.
       */
      function idDeMalla(...args){return extraido_idDeMalla(contextoCompartido,...args);}
      function clonarMateriales(...args){return extraido_clonarMateriales(contextoCompartido,...args);}
      function cargarExternos(...args){return extraido_cargarExternos(contextoCompartido,...args);}

      // Anatomía urinaria complementaria: volúmenes didácticos procedurales.
      // Se registra cada estructura en el catálogo, las mallas y los controles existentes.
      const urinario={sexo:"masculino",solo:false,comparar:false,flujo:false,pausa:false,velocidad:1,t:0,estacion:-1,callback:null};
      let estudioUI=null,particulasOrina=null,rutaOrina=null,estacionesOrina=[];
      function fichaUrinaria(...args){return extraido_fichaUrinaria(contextoCompartido,...args);}
      function puntoParte(...args){return extraido_puntoParte(contextoCompartido,...args);}
      function tuboUrinario(...args){return extraido_tuboUrinario(contextoCompartido,...args);}
      function agregarAnatomiaUrinaria(...args){return extraido_agregarAnatomiaUrinaria(contextoCompartido,...args);}
      function prepararRutaOrina(...args){return extraido_prepararRutaOrina(contextoCompartido,...args);}
      function actualizarOrina(...args){return extraido_actualizarOrina(contextoCompartido,...args);}
      function estudiarUrinario(...args){return extraido_estudiarUrinario(contextoCompartido,...args);}
      function cambiarSexoUrinario(...args){return extraido_cambiarSexoUrinario(contextoCompartido,...args);}

      setProgress(10,"Preparando catálogo anatómico…");
      let respaldo=MODO_MODELO==="procedural";
      let resultado={errores:0,total:0};
      if(!respaldo) {
        resultado=await cargarExternos();
        respaldo=partes.size===0;
      }
      if(respaldo) {
        crearProcedural();
        try {
          await aplicarAnatomiaIntegrada();
          $("model-status").textContent="BodyParts3D · anatomía detallada";
        } catch (error) {
          console.warn("No se pudo decodificar el modelo integrado:", error);
          $("model-status").textContent="Modelo esquemático · educativo";
          avisar("Tu navegador no pudo abrir las mallas integradas. Se muestra el respaldo esquemático.");
        }
        if(MODO_MODELO!=="procedural") avisar("No se pudieron cargar modelos utilizables. Se activó el cuerpo esquemático.");
      } else {
        $("model-status").textContent=resultado.errores
          ? "Modelos externos · carga parcial" : "Modelos externos · GLB";
        if(resultado.errores) avisar("Algunos archivos no se cargaron; se muestran las estructuras disponibles.");
      }
      if(!mallas.length) throw new Error("El modelo no contiene mallas utilizables.");

      mejorarSuperficies(contextoCompartido);
      agregarAnatomiaUrinaria();

      // Centros y direcciones de separación para cada estructura.
      cuerpo.updateWorldMatrix(true,true);
      const cajaCuerpo=new T.Box3().setFromObject(cuerpo);
      if(!respaldo) {
        cajaCuerpo.getCenter(centroCuerpo);
        controles.target.copy(centroCuerpo);
        suelo.position.y=cajaCuerpo.min.y-.04;
        rejilla.position.y=suelo.position.y+.005;
      }
      for(const parte of partes.values()) {
        const centro=new T.Box3().setFromObject(parte.grupo).getCenter(new T.Vector3());
        parte.base.copy(parte.grupo.position);
        parte.direccion.copy(centro).sub(centroCuerpo);
        const hash=[...parte.id].reduce((a,c)=>a+c.charCodeAt(0),0);
        if(parte.direccion.length()<.3) parte.direccion.set((hash%2?1:-1),.1,.6);
        parte.direccion.normalize();
        parte.direccion.z+=(hash%2?1:-1)*.45;
        parte.direccion.normalize();
      }

      function materiales(...args){return extraido_materiales(contextoCompartido,...args);}
      function estaVisible(...args){return extraido_estaVisible(contextoCompartido,...args);}
      function aplicarEstado(...args){return extraido_aplicarEstado(contextoCompartido,...args);}
      function actualizarContorno(...args){return extraido_actualizarContorno(contextoCompartido,...args);}

      // Renderizado bajo demanda. Sólo se mantiene el bucle durante animaciones.
      function solicitarRender(...args){return extraido_solicitarRender(contextoCompartido,...args);}
      function renderizar(...args){return extraido_renderizar(contextoCompartido,...args);}
      controles.addEventListener("change",solicitarRender);
      controles.addEventListener("start",()=>{ transicion=null; });

      function redimensionar(...args){return extraido_redimensionar(contextoCompartido,...args);}
      new ResizeObserver(redimensionar).observe($("stage"));

      function moverCamara(...args){return extraido_moverCamara(contextoCompartido,...args);}
      function enfocarParte(...args){return extraido_enfocarParte(contextoCompartido,...args);}
      const VISTAS={
        front:[0,0,1],back:[0,0,-1],left:[1,0,0],
        right:[-1,0,0],top:[0,1,.001],bottom:[0,-1,.001]
      };
      function vista(...args){return extraido_vista(contextoCompartido,...args);}

      function mostrarInformacion(...args){return extraido_mostrarInformacion(contextoCompartido,...args);}
      function seleccionar(...args){return extraido_seleccionar(contextoCompartido,...args);}
      function deseleccionar(...args){return extraido_deseleccionar(contextoCompartido,...args);}
      function aislar(...args){return extraido_aislar(contextoCompartido,...args);}
      function ocultarSeleccionada(...args){return extraido_ocultarSeleccionada(contextoCompartido,...args);}
      function restaurar(...args){return extraido_restaurar(contextoCompartido,...args);}

      // Raycasting: descarta partes ocultas y fragmentos eliminados por el corte.
      function intersectar(...args){return extraido_intersectar(contextoCompartido,...args);}
      // Un pellizco o arrastre nunca debe interpretarse como selección de órgano.
      const punterosActivos=new Set();
      renderer.domElement.addEventListener("pointerdown",event=>{
        punterosActivos.add(event.pointerId);
        pointerDown=punterosActivos.size===1 && event.button===0
          ? {id:event.pointerId,x:event.clientX,y:event.clientY,tiempo:performance.now()} : null;
      });
      const cancelarPuntero=event=>{punterosActivos.delete(event.pointerId);pointerDown=null;};
      renderer.domElement.addEventListener("pointercancel",cancelarPuntero);
      renderer.domElement.addEventListener("lostpointercapture",cancelarPuntero);
      window.addEventListener("blur",()=>{punterosActivos.clear();pointerDown=null;});
      renderer.domElement.addEventListener("pointermove",event=>{
        if(pointerDown && Math.hypot(event.clientX-pointerDown.x,event.clientY-pointerDown.y)>8)pointerDown=null;
        if(event.pointerType==="touch" || event.buttons || estado.quiz.activo) {
          $("tooltip").hidden=true;
          return;
        }
        if(performance.now()-tiempoHover<40) return;
        tiempoHover=performance.now();
        const hit=intersectar(event);
        const id=hit?.object.userData.parte || null;
        if(id!==ultimoHover) {
          ultimoHover=id;
          estado.hover=id;
          actualizarContorno();
          solicitarRender();
        }
        $("tooltip").hidden=!id;
        renderer.domElement.style.cursor=id?"pointer":"grab";
        if(id) {
          $("tooltip").textContent=catalogo.get(id).nombre;
          $("tooltip").style.left=Math.min(event.clientX+15,innerWidth-210)+"px";
          $("tooltip").style.top=Math.max(5,event.clientY-35)+"px";
        }
      });
      renderer.domElement.addEventListener("pointerleave",()=>{
        $("tooltip").hidden=true;
        estado.hover=null;
        ultimoHover=null;
        actualizarContorno();
        solicitarRender();
      });
      renderer.domElement.addEventListener("pointerup",event=>{
        punterosActivos.delete(event.pointerId);
        const toque=pointerDown;pointerDown=null;
        if(!toque || toque.id!==event.pointerId || punterosActivos.size || estado.quiz.activo)return;
        if(Math.hypot(event.clientX-toque.x,event.clientY-toque.y)<8 && performance.now()-toque.tiempo<700) {
          const hit=intersectar(event);
          if(hit) seleccionar(hit.object.userData.parte,{revelar:false});
        }
      });

      // Capas y árbol: controles reales, accesibles por teclado.
      Object.entries(REGIONES).forEach(([id,nombre])=>{
        $("region").add(new Option(nombre,id));
      });
      Object.entries(SISTEMAS).forEach(([id,s])=>{
        const div=document.createElement("div");
        div.className="layer";
        const cabecera=document.createElement("div");cabecera.className="layer-head";
        const etiqueta=document.createElement("label");etiqueta.htmlFor="layer-"+id;
        const check=document.createElement("input");check.id="layer-"+id;check.type="checkbox";
        const swatch=document.createElement("span");swatch.className="swatch";swatch.style.background=s.color;
        const nombre=document.createElement("span");nombre.textContent=s.nombre;
        etiqueta.append(check,swatch,nombre);cabecera.append(etiqueta);
        const rango=document.createElement("div");rango.className="layer-range";
        const slider=document.createElement("input");slider.id="opacity-"+id;slider.type="range";slider.min=0;slider.max=100;slider.setAttribute("aria-label","Opacidad de "+s.nombre);
        const salida=document.createElement("output");salida.id="output-"+id;rango.append(slider,salida);div.append(cabecera,rango);
        $("layers").append(div);
        $("layer-"+id).onchange=e=>{
          if(estado.quiz.activo) terminarQuiz();
          s.visible=e.target.checked;
          aplicarEstado();
        };
        $("opacity-"+id).oninput=e=>{
          s.opacidad=Number(e.target.value)/100;
          $("output-"+id).textContent=Math.round(s.opacidad*100)+"%";
          aplicarEstado();
        };
      });
      function sincronizarCapas(...args){return extraido_sincronizarCapas(contextoCompartido,...args);}
      function construirArbol(...args){return extraido_construirArbol(contextoCompartido,...args);}
      construirArbol();
      sincronizarCapas();
      $("region").onchange=e=>{
        if(estado.quiz.activo) terminarQuiz();
        estado.region=e.target.value;
        document.querySelectorAll(".tree-region").forEach(r=>{
          r.hidden=!!r.dataset.region && estado.region!=="todas" && r.dataset.region!==estado.region;
        });
        aplicarEstado();
      };

      // Búsqueda con autocompletado y navegación mediante flechas y Enter.
      let resultados=[],indiceResultado=-1;
      function limpiarResultados(...args){return extraido_limpiarResultados(contextoCompartido,...args);}
      function buscar(...args){return extraido_buscar(contextoCompartido,...args);}
      $("search").addEventListener("input",buscar);
      $("search").addEventListener("keydown",e=>{
        if(e.key==="Escape") { limpiarResultados(); return; }
        if(!resultados.length) return;
        if(e.key==="ArrowDown" || e.key==="ArrowUp") {
          e.preventDefault();
          indiceResultado=(indiceResultado+(e.key==="ArrowDown"?1:-1)+resultados.length)%resultados.length;
          resultados.forEach((p,i)=>{
            const b=$("resultado-"+i);
            b.classList.toggle("active",i===indiceResultado);
            b.setAttribute("aria-selected",String(i===indiceResultado));
          });
          $("search").setAttribute("aria-activedescendant","resultado-"+indiceResultado);
          $("resultado-"+indiceResultado).scrollIntoView({block:"nearest"});
        } else if(e.key==="Enter") {
          e.preventDefault();
          seleccionar(resultados[Math.max(0,indiceResultado)].id);
        }
      });
      document.addEventListener("pointerdown",e=>{
        if(!e.target.closest(".search-wrap")) limpiarResultados();
      });

      /*
       * Etiquetas DOM y líneas guía WebGL.
       * Se muestran hasta 18, priorizando la selección y evitando solapamientos.
       * Se omiten etiquetas cuya estructura queda oculta detrás de otra.
       */
      const geometriaGuias=new T.BufferGeometry();
      const bufferGuias=new Float32Array(18*6);
      geometriaGuias.setAttribute("position",new T.BufferAttribute(bufferGuias,3));
      geometriaGuias.setDrawRange(0,0);
      const guias=new T.LineSegments(geometriaGuias,new T.LineBasicMaterial({
        color:0x89cbbd,transparent:true,opacity:.7,depthTest:false
      }));
      guias.frustumCulled=false;
      guias.renderOrder=20;
      escena.add(guias);
      for(const p of partes.values()) {
        const b=document.createElement("button");
        b.className="part-label";
        b.textContent=p.meta.nombre;
        b.hidden=true;
        b.onclick=()=>seleccionar(p.id);
        p.etiqueta=b;
        $("labels").append(b);
      }
      function actualizarEtiquetas(...args){return extraido_actualizarEtiquetas(contextoCompartido,...args);}

      // Cuestionario: evita mostrar la respuesta en fichas, etiquetas o tooltip.
      function mezclar(...args){return extraido_mezclar(contextoCompartido,...args);}
      function iniciarQuiz(...args){return extraido_iniciarQuiz(contextoCompartido,...args);}
      function siguientePregunta(...args){return extraido_siguientePregunta(contextoCompartido,...args);}
      function responderQuiz(...args){return extraido_responderQuiz(contextoCompartido,...args);}
      function terminarQuiz(...args){return extraido_terminarQuiz(contextoCompartido,...args);}

      function actualizarCorte(...args){return extraido_actualizarCorte(contextoCompartido,...args);}
      $("clip-enabled").onchange=actualizarCorte;
      $("clip-axis").onchange=actualizarCorte;
      $("clip-position").oninput=actualizarCorte;
      $("explode").oninput=e=>{
        if(urinario.flujo){urinario.flujo=false;particulasOrina.visible=false;}
        estado.explosionObjetivo=Number(e.target.value)/100;
        $("explode-value").textContent=e.target.value+"%";
        solicitarRender();
      };
      $("labels-toggle").onclick=()=>{
        estado.etiquetas=!estado.etiquetas;
        $("labels-toggle").setAttribute("aria-pressed",String(estado.etiquetas));
        $("labels-toggle").textContent=estado.etiquetas?"Ocultar etiquetas":"Mostrar etiquetas";
        solicitarRender();
      };
      $("quiz-toggle").onclick=()=>estado.quiz.activo?terminarQuiz():iniciarQuiz();
      $("quiz-next").onclick=siguientePregunta;
      $("quiz-exit").onclick=terminarQuiz;
      $("isolate").onclick=aislar;
      $("hide-part").onclick=ocultarSeleccionada;
      $("deselect").onclick=deseleccionar;
      $("restore").onclick=()=>{
        restaurar();
        document.querySelectorAll(".tree-region").forEach(r=>r.hidden=false);
        vista("front");
      };
      $("reset-camera").onclick=()=>{ $("view").value="front"; vista("front"); };
      $("view").onchange=e=>vista(e.target.value);
      $("auto-rotate").onclick=()=>{
        transicion=null;
        controles.autoRotate=!controles.autoRotate;
        $("auto-rotate").setAttribute("aria-pressed",String(controles.autoRotate));
        solicitarRender();
      };
      $("low-quality").checked=estado.baja;
      $("low-quality").onchange=e=>{
        estado.baja=e.target.checked;
        const ratio=estado.baja?1:Math.min(devicePixelRatio,1.75);
        renderer.setPixelRatio(ratio);
        compositor.setPixelRatio(ratio);
        renderer.shadowMap.enabled=!estado.baja;
        principal.shadow.needsUpdate=true;
        mallas.forEach(m=>materiales(m).forEach(mat=>mat.needsUpdate=true));
        contorno.edgeGlow=estado.baja?0:.65;
        redimensionar();
      };
      function establecerTema(...args){return extraido_establecerTema(contextoCompartido,...args);}
      $("theme").onclick=()=>establecerTema(document.documentElement.dataset.theme!=="light");
      try { establecerTema(localStorage.getItem("atlas-theme")==="light"); } catch {}

      function estadoPanel(...args){return extraido_estadoPanel(contextoCompartido,...args);}
      function panel(...args){return extraido_panel(contextoCompartido,...args);}
      $("toggle-left").onclick=()=>panel("left");
      $("toggle-right").onclick=()=>panel("right");
      document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>panel(b.dataset.close,false));
      function adaptarPaneles(...args){return extraido_adaptarPaneles(contextoCompartido,...args);}
      vistaMovil.addEventListener("change",adaptarPaneles);
      adaptarPaneles();
      document.addEventListener("keydown",e=>{
        if(estudioUI?.atajo(e))return;
        if(e.target.closest("input,textarea,select") || e.ctrlKey || e.metaKey || e.altKey) return;
        if(e.key==="Escape") {
          deseleccionar();
          if(matchMedia("(max-width:850px)").matches) {
            panel("left",false); panel("right",false);
          }
        } else if(e.key.toLowerCase()==="r") vista("front");
        else if(e.key.toLowerCase()==="h") ocultarSeleccionada();
        else if(e.key.toLowerCase()==="i") aislar();
      });

      // Los recursos se conservan al ocultar para que Restaurar sea inmediato.
      // Se liberan al abandonar la página; no se destruyen buffers reutilizables.
      function liberarRecursos(...args){return extraido_liberarRecursos(contextoCompartido,...args);}
      window.addEventListener("pagehide",event=>{
        // Una página guardada en bfcache puede volver a mostrarse.
        if(!event.persisted) liberarRecursos();
      });

      function iniciarEstudio(...args){return extraido_iniciarEstudio(contextoCompartido,...args);}

      estudioUI=iniciarEstudio();

      $("structure-count").textContent=partes.size+" estructuras · 10 sistemas";
      aplicarEstado();
      redimensionar();
      setProgress(100,"Atlas preparado.");
      $("loading").hidden=true;
      vista("front");
      solicitarRender();
    }
  