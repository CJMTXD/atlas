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
    const BANCO=datos["banco-urinario"];
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
const contextoCompartido={get SISTEMAS(){return SISTEMAS;},set SISTEMAS(v){SISTEMAS=v;},get urinario(){return urinario;},set urinario(v){urinario=v;},get estado(){return estado;},set estado(v){estado=v;},get actualizarContorno(){return actualizarContorno;},set actualizarContorno(v){actualizarContorno=v;},get solicitarRender(){return solicitarRender;},set solicitarRender(v){solicitarRender=v;},get partes(){return partes;},set partes(v){partes=v;},get estaVisible(){return estaVisible;},set estaVisible(v){estaVisible=v;},get materiales(){return materiales;},set materiales(v){materiales=v;},get planoCorte(){return planoCorte;},set planoCorte(v){planoCorte=v;},get contorno(){return contorno;},set contorno(v){contorno=v;},get frame(){return frame;},set frame(v){frame=v;},get dibujando(){return dibujando;},set dibujando(v){dibujando=v;},get renderizar(){return renderizar;},set renderizar(v){renderizar=v;},get ultimoTiempo(){return ultimoTiempo;},set ultimoTiempo(v){ultimoTiempo=v;},get actualizarOrina(){return actualizarOrina;},set actualizarOrina(v){actualizarOrina=v;},get transicion(){return transicion;},set transicion(v){transicion=v;},get controles(){return controles;},set controles(v){controles=v;},get actualizarEtiquetas(){return actualizarEtiquetas;},set actualizarEtiquetas(v){actualizarEtiquetas=v;},get compositor(){return compositor;},set compositor(v){compositor=v;},get camara(){return camara;},set camara(v){camara=v;},get T(){return T;},set T(v){T=v;},get $(){return $;},set $(v){$=v;},get renderer(){return renderer;},set renderer(v){renderer=v;},get moverCamara(){return moverCamara;},set moverCamara(v){moverCamara=v;},get VISTAS(){return VISTAS;},set VISTAS(v){VISTAS=v;},get estudioUI(){return estudioUI;},set estudioUI(v){estudioUI=v;},get vistaMovil(){return vistaMovil;},set vistaMovil(v){vistaMovil=v;},get adaptarPaneles(){return adaptarPaneles;},set adaptarPaneles(v){adaptarPaneles=v;},get escena(){return escena;},set escena(v){escena=v;}};

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

      function avisar(texto) {
        clearTimeout(toastTimer);
        $("toast").textContent = texto;
        $("toast").hidden = false;
        toastTimer = setTimeout(() => $("toast").hidden = true,4200);
      }
      const texturasDetalle = new Map();
      function texturaSuperficie(tipo) {
        if(texturasDetalle.has(tipo)) return texturasDetalle.get(tipo);
        const c=document.createElement("canvas"); c.width=c.height=128;
        const ctx=c.getContext("2d"), image=ctx.createImageData(128,128);
        let semilla=817;
        for(let y=0;y<128;y++) for(let x=0;x<128;x++) {
          semilla=(Math.imul(1664525,semilla)+1013904223)>>>0;
          const ruido=(semilla/4294967296-.5)*24;
          const fibra=tipo==="muscular" ? Math.sin(x*.7+Math.sin(y*.06)*1.6)*23 : 0;
          const n=Math.max(0,Math.min(255,140+ruido+fibra));
          const i=(y*128+x)*4;
          image.data.set([n,n,n,255],i);
        }
        ctx.putImageData(image,0,0);
        const tex=new T.CanvasTexture(c);
        tex.wrapS=tex.wrapT=T.RepeatWrapping;
        tex.repeat.set(tipo==="muscular"?3:4,4);
        texturasDetalle.set(tipo,tex);
        return tex;
      }
      function material(color,sistema="esqueletico") {
        const hueso=sistema==="esqueletico";
        const musculo=sistema==="muscular";
        return new T.MeshPhysicalMaterial({
          color, roughness:hueso?.7:musculo?.48:.43, metalness:0,
          clearcoat:hueso?.04:.18, clearcoatRoughness:.5,
          sheen:hueso?0:.15, sheenColor:new T.Color(color),
          bumpMap:texturaSuperficie(sistema), bumpScale:hueso?.008:.005,
          transparent:false, side:T.DoubleSide, clippingPlanes:[]
        });
      }
      function crearParte(id, posicion=[0,0,0]) {
        const meta = catalogo.get(id);
        const grupo = new T.Group();
        grupo.name = id;
        grupo.position.fromArray(posicion);
        cuerpo.add(grupo);
        const parte = { id, meta, grupo, base: grupo.position.clone(), direccion: new T.Vector3(), etiqueta: null };
        partes.set(id,parte);
        return parte;
      }
      function agregarMalla(parte, geometria, escala, posicion=[0,0,0], color) {
        const mesh = new T.Mesh(geometria,material(color || SISTEMAS[parte.meta.sistema].color, parte.meta.sistema));
        mesh.scale.fromArray(escala);
        mesh.position.fromArray(posicion);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.parte = parte.id;
        parte.grupo.add(mesh);
        mallas.push(mesh);
        return mesh;
      }
      function ovalo(parte, posicion, escala, color) {
        return agregarMalla(parte,geometriaEsfera,escala,posicion,color);
      }
      function segmento(parte,a,b,radio=.08,color) {
        const va = new T.Vector3(...a), vb = new T.Vector3(...b);
        const mesh = agregarMalla(parte,geometriaCilindro,
          [radio,va.distanceTo(vb),radio],
          va.clone().add(vb).multiplyScalar(.5).toArray(),color);
        mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vb.sub(va).normalize());
        return mesh;
      }
      function tubo(parte,puntos,radio=.06,color,cerrado=false) {
        const curva = new T.CatmullRomCurve3(puntos.map(p => new T.Vector3(...p)),cerrado);
        return agregarMalla(parte,new T.TubeGeometry(curva,Math.max(20,puntos.length*5),radio,8,cerrado),[1,1,1],[0,0,0],color);
      }
      function miembros(parte,pares,radio,color) {
        for (const lado of [-1,1]) {
          pares.forEach(([a,b]) => segmento(parte,[a[0]*lado,a[1],a[2]],[b[0]*lado,b[1],b[2]],radio,color));
        }
      }

      /*
       * Mallas BodyParts3D integradas en el propio HTML.
       * No se descargan modelos al abrir el visor. Se descomprime un bloque
       * binario y se construye una BufferGeometry indexada por estructura.
       * Conservamos el respaldo para los elementos ausentes en esta edición.
       */
      async function aplicarAnatomiaIntegrada() {
        const {manifest,buffer}=await cargarMallas(setProgress);
        const preparadas=[];
        const colores={
          piel:"#cfaa91", muscular:"#a74650", esqueletico:"#e3d4b5",
          circulatorio:"#b8374c", nervioso:"#e4c47b", respiratorio:"#c68fa1",
          digestivo:"#c78e74", urinario:"#9e555f", linfatico:"#81a68a", endocrino:"#c19baa"
        };
        const tonos={
          higado:"#864d46", vesicula:"#8c9c59", estomago:"#c99691",
          pancreas:"#d0b583", intestino_delgado:"#ca9a83", colon:"#ba8c7b",
          cerebro:"#d6b7a4", cerebelo:"#c7aa91", tronco:"#d8bd9c",
          aorta:"#bc3e49", vena_cava:"#547ca5", corazon:"#a44151",
          bazo:"#785772", vejiga:"#c2a38d", traquea:"#c1bfa5"
        };
        try {
          for(let i=0;i<manifest.length;i++) {
            const registro=manifest[i];
            if(!catalogo.has(registro.id)) continue;
            const fuente=new Int16Array(buffer,registro.offset,registro.vertices*3);
            const posiciones=new Float32Array(fuente.length);
            for(let j=0;j<fuente.length;j++) posiciones[j]=fuente[j]/2500;
            const inicio=registro.offset+registro.vertices*6;
            const indices=new Uint32Array(buffer.slice(inicio,inicio+registro.indices*4));
            const geometria=new T.BufferGeometry();
            geometria.setAttribute("position",new T.BufferAttribute(posiciones,3));
            geometria.setIndex(new T.BufferAttribute(indices,1));
            geometria.computeBoundingBox();
            const centro=geometria.boundingBox.getCenter(new T.Vector3());
            geometria.translate(-centro.x,-centro.y,-centro.z);
            geometria.computeVertexNormals();
            geometria.computeBoundingSphere();
            const uv=new Float32Array(registro.vertices*2);
            const tintes=new Float32Array(registro.vertices*3);
            const sistema=catalogo.get(registro.id).sistema;
            for(let j=0;j<registro.vertices;j++) {
              const x=posiciones[j*3],y=posiciones[j*3+1],z=posiciones[j*3+2];
              uv[j*2]=Math.atan2(z,x)/(2*Math.PI)+.5;
              uv[j*2+1]=y*.8;
              const ruido=(Math.sin(x*47+y*23+z*31)*Math.sin(y*59-z*17))*.025;
              const tono=.96+ruido;
              tintes[j*3]=tono;
              tintes[j*3+1]=tono;
              tintes[j*3+2]=tono;
            }
            geometria.setAttribute("uv",new T.BufferAttribute(uv,2));
            geometria.setAttribute("color",new T.BufferAttribute(tintes,3));
            const mat=material(tonos[registro.id] || colores[sistema],sistema);
            mat.vertexColors=true;
            // La capa de piel es un contexto translúcido; no oculta los órganos por defecto.
            if(sistema==="piel") { mat.roughness=.67; mat.sheen=.3; }
            const mesh=new T.Mesh(geometria,mat);
            mesh.name="BodyParts3D_"+registro.id;
            mesh.userData.parte=registro.id;
            mesh.castShadow=true;
            mesh.receiveShadow=true;
            preparadas.push({registro,centro,mesh});
            setProgress(25+60*(i+1)/manifest.length,"Preparando anatomía: "+catalogo.get(registro.id).nombre);
            // Permitir que el navegador actualice el progreso en equipos modestos.
            if(i%7===0) await new Promise(resolve=>setTimeout(resolve,0));
          }
        } catch(error) {
          for(const p of preparadas) { p.mesh.geometry.dispose(); p.mesh.material.dispose(); }
          throw error;
        }
        // Reemplazo después de construir y validar todas las geometrías.
        for(const {registro,centro,mesh} of preparadas) {
          const parte=partes.get(registro.id) || crearParte(registro.id);
          const anteriores=new Set();
          parte.grupo.traverse(obj=>{ if(obj.isMesh) anteriores.add(obj); });
          for(let j=mallas.length-1;j>=0;j--) if(anteriores.has(mallas[j])) mallas.splice(j,1);
          const geometrias=new Set();
          for(const anterior of anteriores) {
            if(anterior.geometry!==geometriaEsfera && anterior.geometry!==geometriaCilindro)
              geometrias.add(anterior.geometry);
            (Array.isArray(anterior.material)?anterior.material:[anterior.material]).forEach(m=>m.dispose());
          }
          geometrias.forEach(g=>g.dispose());
          parte.grupo.clear();
          parte.grupo.position.copy(centro);
          parte.grupo.add(mesh);
          parte.meta.modelo="Superficie anatómica BodyParts3D adaptada para visualización.";
          parte.meta.fuentesFMA=registro.fuentes;
          mallas.push(mesh);
        }
        // Estructuras complementarias: conservan una representación esquemática,
        // adaptada a las proporciones y a la postura del modelo integrado.
        const ajustes={
          recto_abdominal:{escala:[.8,1,1],desplazamiento:[0,.9,-.01]},
          lengua:{escala:[1,1,1],desplazamiento:[0,.37,-.03]},
          tiroides:{escala:[.8,.8,.8],posicion:[0,8.48,.28]},
          suprarrenales:{escala:[.65,1,.8],desplazamiento:[0,1.18,.1]},
          ganglios:{escala:[.78,1,1],desplazamiento:[0,.48,-.03]}
        };
        for(const [id,ajuste] of Object.entries(ajustes)) {
          const p=partes.get(id);
          if(!p || p.meta.fuentesFMA) continue;
          p.grupo.scale.fromArray(ajuste.escala);
          if(ajuste.posicion) p.grupo.position.fromArray(ajuste.posicion);
          else p.grupo.position.add(new T.Vector3(...ajuste.desplazamiento));
        }
        // Red periférica de referencia, más delgada y alineada con las extremidades.
        const nervios=partes.get("nervios");
        if(nervios && !nervios.meta.fuentesFMA) {
          const previos=new Set();
          nervios.grupo.traverse(o=>{if(o.isMesh) previos.add(o);});
          for(let i=mallas.length-1;i>=0;i--) if(previos.has(mallas[i])) mallas.splice(i,1);
          previos.forEach(o=>{o.material.dispose();});
          nervios.grupo.clear();
          miembros(nervios,[
            [[.05,8.15,-.25],[.9,7.75,-.14]],
            [[.9,7.75,-.14],[1.32,6.25,-.04]],
            [[1.32,6.25,-.04],[1.76,4.95,.05]],
            [[.04,5.8,-.23],[.57,4.9,-.15]],
            [[.57,4.9,-.15],[.62,2.5,-.12]],
            [[.62,2.5,-.12],[.62,.55,-.06]]
          ],.014,"#d9b866");
        }
        for(const p of partes.values()) if(!p.meta.fuentesFMA)
          p.meta.modelo="Representación esquemática complementaria; esta estructura no dispone de una malla BodyParts3D integrada.";
        setProgress(90,"Aplicando materiales y preparando el visor…");
      }

      // Generación del respaldo: anatomía volumétrica simplificada, no clínica.
      function crearProcedural() {
        let p;
        p=crearParte("piel");
        ovalo(p,[0,9,0],[.65,.85,.6]);
        ovalo(p,[0,6.55,0],[1.2,1.55,.65]);
        ovalo(p,[0,4.75,0],[.95,.85,.58]);
        segmento(p,[0,8.3,0],[0,7.7,0],.34);
        miembros(p,[
          [[1,7.45,0],[1.75,5.75,0]],
          [[1.75,5.75,0],[2.03,4.08,.1]],
          [[.55,4.3,0],[.6,2.45,0]],
          [[.6,2.45,0],[.6,.45,0]]
        ],.3);
        for(const s of [-1,1]) {
          ovalo(p,[s*2.05,3.8,.12],[.18,.35,.12]);
          ovalo(p,[s*.6,.25,.2],[.27,.2,.5]);
        }

        p=crearParte("deltoides");
        for(const s of [-1,1]) ovalo(p,[s*1.15,7.28,0],[.38,.5,.38]);
        p=crearParte("biceps");
        for(const s of [-1,1]) {
          const m=ovalo(p,[s*1.48,6.5,.16],[.24,.65,.22]);
          m.rotation.z=s*.32;
        }
        p=crearParte("triceps");
        for(const s of [-1,1]) ovalo(p,[s*1.47,6.5,-.22],[.24,.62,.23]);
        p=crearParte("pectoral");
        for(const s of [-1,1]) ovalo(p,[s*.51,7.03,.54],[.58,.45,.16]);
        p=crearParte("recto_abdominal");
        for(const s of [-1,1]) for(let i=0;i<4;i++)
          ovalo(p,[s*.24,5.98-i*.33,.56],[.21,.16,.1]);
        p=crearParte("gluteo");
        for(const s of [-1,1]) ovalo(p,[s*.47,4.35,-.48],[.5,.55,.25]);
        p=crearParte("cuadriceps");
        for(const s of [-1,1]) ovalo(p,[s*.6,3.35,.16],[.35,.9,.3]);
        p=crearParte("gastrocnemio");
        for(const s of [-1,1]) ovalo(p,[s*.6,1.65,-.18],[.26,.66,.27]);

        p=crearParte("craneo",[0,9,0]);
        ovalo(p,[0,.1,-.03],[.61,.72,.55]);
        ovalo(p,[0,-.38,.17],[.43,.3,.33]);
        // Órbitas oscuras como referencias de orientación, no mallas seleccionables separadas.
        for(const s of [-1,1]) ovalo(p,[s*.23,-.12,.5],[.15,.14,.055],"#514b47");
        p=crearParte("mandibula",[0,8.48,.1]);
        tubo(p,[[-.39,.25,0],[-.4,-.02,.19],[0,-.14,.35],[.4,-.02,.19],[.39,.25,0]],.065);
        p=crearParte("claviculas");
        miembros(p,[[[.08,7.65,.5],[1.13,7.5,.12]]],.065);
        p=crearParte("esternon",[0,6.8,.62]);
        ovalo(p,[0,0,0],[.13,.68,.065]);
        p=crearParte("costillas",[0,6.8,0]);
        for(let i=0;i<9;i++) {
          const ancho=.65+Math.sin((i/10)*Math.PI)*.45;
          const y=.72-i*.21;
          const puntos=[];
          for(let k=0;k<24;k++) {
            const a=k/24*Math.PI*2;
            puntos.push([Math.cos(a)*ancho,y+.13*Math.sin(a),Math.sin(a)*.6]);
          }
          tubo(p,puntos,.035,undefined,true);
        }
        p=crearParte("columna",[0,6,-.5]);
        for(let i=0;i<22;i++) {
          ovalo(p,[0,2.05-i*.175,0],[.15,.085,.13]);
          segmento(p,[0,2.05-i*.175,0],[0,2.05-i*.175,-.17],.035);
        }
        p=crearParte("humeros");
        miembros(p,[[[1.1,7.38,0],[1.73,5.8,0]]],.105);
        p=crearParte("radios");
        miembros(p,[[[1.82,5.78,.02],[2.13,4.12,.08]]],.065);
        p=crearParte("cubitos");
        miembros(p,[[[1.66,5.8,-.04],[1.98,4.12,.02]]],.06);
        p=crearParte("pelvis_osea",[0,4.55,0]);
        for(const s of [-1,1]) {
          const m=ovalo(p,[s*.64,0,-.1],[.4,.57,.21]);
          m.rotation.z=-s*.25;
          tubo(p,[[s*.78,-.2,0],[s*.58,-.53,.27],[s*.17,-.45,.36],[s*.1,-.08,.25]],.095);
        }
        p=crearParte("femures");
        miembros(p,[[[.57,4.18,0],[.6,2.48,0]]],.125);
        p=crearParte("rotulas");
        for(const s of [-1,1]) ovalo(p,[s*.6,2.43,.17],[.15,.19,.09]);
        p=crearParte("tibias");
        miembros(p,[[[.55,2.3,0],[.55,.48,0]]],.095);
        p=crearParte("perones");
        miembros(p,[[[.76,2.28,-.02],[.76,.43,-.02]]],.045);

        p=crearParte("corazon",[.18,6.38,.3]);
        const h=ovalo(p,[0,0,0],[.35,.46,.29],"#c54860");
        h.rotation.z=-.35;
        ovalo(p,[-.17,.22,0],[.22,.23,.21],"#d2697b");
        tubo(p,[[0,.3,0],[.02,.65,0],[-.22,.72,-.03]],.08,"#e66569");
        tubo(p,[[.2,.25,.22],[.18,-.08,.27],[0,-.32,.18]],.022,"#efb18d");

        p=crearParte("aorta");
        tubo(p,[[.15,6.62,.2],[.1,7,.14],[-.23,7.05,-.02],[-.3,6.6,-.15],[-.24,5.5,-.2],[-.2,4.6,-.23]],.085,"#dd4c53");
        miembros(p,[[[.2,4.6,-.23],[.53,3.6,-.15]]],.045,"#dd4c53");
        p=crearParte("vena_cava");
        tubo(p,[[-.16,7.6,-.1],[-.2,6.7,-.08],[-.13,6.4,-.05]],.09,"#5b8cc5");
        tubo(p,[[-.13,6.25,-.08],[-.08,5.5,-.15],[-.06,4.5,-.14]],.095,"#5b8cc5");

        p=crearParte("cerebro",[0,9.17,.02]);
        for(const s of [-1,1]) {
          ovalo(p,[s*.235,0,0],[.28,.47,.43],"#edbc9e");
          for(let i=0;i<7;i++) {
            const y=-.28+i*.085;
            tubo(p,[[s*.07,y,.35],[s*.24,y+.04,.4],[s*.43,y,.24]],.024,"#c98d83");
          }
        }
        p=crearParte("cerebelo",[0,8.76,-.27]);
        for(const s of [-1,1]) ovalo(p,[s*.19,0,0],[.22,.21,.21],"#d6ad86");
        p=crearParte("tronco",[0,8.55,-.13]);
        ovalo(p,[0,0,0],[.12,.33,.13]);
        p=crearParte("medula",[0,6.85,-.37]);
        segmento(p,[0,1.45,0],[0,-1.65,0],.045);
        p=crearParte("nervios");
        miembros(p,[
          [[.08,7.5,-.25],[1.1,7.32,-.18]],
          [[1.1,7.32,-.18],[1.8,5.72,-.12]],
          [[1.8,5.72,-.12],[2.05,4.2,.1]],
          [[.08,5.05,-.35],[.52,4.05,-.2]],
          [[.52,4.05,-.2],[.65,2.4,-.14]],
          [[.65,2.4,-.14],[.64,.5,-.1]]
        ],.027);

        p=crearParte("pulmon_derecho",[-.63,6.8,.08]);
        ovalo(p,[0,0,0],[.44,.84,.39]);
        for(let i=0;i<2;i++) tubo(p,[[-.35,.18-i*.43,.27],[0,.02-i*.43,.39],[.32,-.04-i*.43,.23]],.015,"#a36d88");
        p=crearParte("pulmon_izquierdo",[.65,6.82,.06]);
        ovalo(p,[0,0,0],[.39,.79,.36]);
        tubo(p,[[-.28,.17,.27],[0,.02,.36],[.28,-.1,.24]],.015,"#a36d88");
        p=crearParte("traquea",[0,7.7,.12]);
        segmento(p,[0,.55,0],[0,-.55,0],.105,"#b9c5bd");
        for(let i=0;i<9;i++) {
          const aro=new T.TorusGeometry(.108,.018,6,16);
          const mesh=agregarMalla(p,aro,[1,1,1],[0,.48-i*.11,0],"#e6d5bc");
          mesh.rotation.x=Math.PI/2;
        }
        segmento(p,[0,-.5,0],[-.5,-.88,0],.07);
        segmento(p,[0,-.5,0],[.5,-.88,0],.07);
        p=crearParte("diafragma",[0,5.95,0]);
        ovalo(p,[0,0,0],[1,.15,.58],"#b96e79");

        p=crearParte("lengua",[0,8.5,.43]);
        ovalo(p,[0,0,0],[.19,.06,.18],"#cd6b7a");
        p=crearParte("esofago");
        tubo(p,[[0,8.1,-.12],[0,7.1,-.17],[.04,6.1,-.12],[.37,5.65,.02]],.06,"#cda292");
        p=crearParte("higado",[-.4,5.62,.25]);
        const hig=ovalo(p,[0,0,0],[.69,.33,.4],"#91504d");
        hig.rotation.z=.12;
        p=crearParte("vesicula",[-.43,5.35,.47]);
        ovalo(p,[0,0,0],[.12,.2,.1],"#7eaa58");
        p=crearParte("estomago",[.5,5.33,.25]);
        const est=ovalo(p,[0,0,0],[.35,.43,.25],"#dda5a0");
        est.rotation.z=-.45;
        tubo(p,[[-.12,.3,0],[-.15,.53,-.05]],.075,"#dda5a0");
        p=crearParte("pancreas",[.08,5.12,-.11]);
        const pan=ovalo(p,[0,0,0],[.55,.12,.15],"#dbbb78");
        pan.rotation.z=.12;

        p=crearParte("intestino_delgado",[0,4.55,.29]);
        const asas=[];
        for(let fila=0;fila<5;fila++) {
          const direccion=fila%2 ? -1:1;
          for(let i=0;i<7;i++) asas.push([
            direccion*(-.5+i/6), .47-fila*.22,
            .03*Math.sin(i*1.5+fila)
          ]);
        }
        tubo(p,asas,.078,"#dba78f");

        p=crearParte("colon",[0,4.66,.24]);
        const marco=[
          [-.78,-.55,0],[-.82,.1,0],[-.78,.7,0],
          [-.3,.8,0],[.3,.77,0],[.76,.63,0],
          [.8,.1,0],[.73,-.45,0],[.3,-.65,.02],[.03,-.86,0]
        ];
        tubo(p,marco,.12,"#bb8a79");
        p=crearParte("recto",[0,3.82,-.08]);
        tubo(p,[[.08,.26,0],[.03,0,0],[0,-.36,.04]],.11,"#ba8d83");

        p=crearParte("rinon_derecho",[-.65,5.26,-.34]);
        const rd=ovalo(p,[0,0,0],[.22,.34,.18]); rd.rotation.z=-.22;
        p=crearParte("rinon_izquierdo",[.65,5.39,-.34]);
        const ri=ovalo(p,[0,0,0],[.22,.34,.18]); ri.rotation.z=.22;
        p=crearParte("ureter_derecho");
        tubo(p,[[-.52,5.1,-.25],[-.45,4.6,-.2],[-.28,3.91,.08]],.028,"#dbbf8b");
        p=crearParte("ureter_izquierdo");
        tubo(p,[[.52,5.23,-.25],[.45,4.6,-.2],[.28,3.91,.08]],.028,"#dbbf8b");
        p=crearParte("vejiga",[0,3.85,.28]);
        ovalo(p,[0,0,0],[.3,.28,.22],"#c7a28d");

        p=crearParte("bazo",[.87,5.56,-.11]);
        const bz=ovalo(p,[0,0,0],[.17,.33,.18],"#8c5e89"); bz.rotation.z=-.2;
        p=crearParte("timo",[0,7.13,.43]);
        for(const s of [-1,1]) ovalo(p,[s*.095,0,0],[.115,.24,.075]);
        p=crearParte("ganglios");
        for(const s of [-1,1]) {
          for(let i=0;i<4;i++) {
            ovalo(p,[s*(.28+i*.06),8.07-i*.11,.04],[.045,.06,.04]);
            ovalo(p,[s*(1.01+i*.025),7.1-i*.09,.02],[.05,.065,.05]);
            ovalo(p,[s*(.3+i*.12),4.2-i*.05,.22],[.05,.06,.05]);
          }
        }
        p=crearParte("hipofisis",[0,8.87,.08]);
        ovalo(p,[0,0,0],[.085,.065,.07]);
        segmento(p,[0,.03,0],[0,.15,0],.023);
        p=crearParte("tiroides",[0,7.92,.29]);
        for(const s of [-1,1]) ovalo(p,[s*.14,0,0],[.095,.18,.07]);
        segmento(p,[-.1,-.01,0],[.1,-.01,0],.035);
        p=crearParte("suprarrenales");
        for(const s of [-1,1]) ovalo(p,[s*.64,s<0?5.66:5.79,-.33],[.16,.09,.12]);
      }

      /*
       * Carga y normalización de GLB.
       * Un archivo múltiple puede contener varias mallas por órgano.
       * En modo único, se busca el nombre de cada malla y sus ancestros.
       */
      function idDeMalla(mesh) {
        let objeto=mesh;
        while(objeto && objeto!==cuerpo) {
          const id=nombres.get(normalizar(objeto.name || ""));
          if(id) return id;
          objeto=objeto.parent;
        }
        return null;
      }
      function clonarMateriales(mesh) {
        const convertir = origen => {
          const m=origen ? origen.clone() : material("#bec8cc");
          m.clippingPlanes=[];
          m.side=T.DoubleSide;
          return m;
        };
        mesh.material=Array.isArray(mesh.material)
          ? mesh.material.map(convertir) : convertir(mesh.material);
      }
      async function cargarExternos() {
        const configuraciones=MODO_MODELO==="unico"
          ? [{...MODELO_UNICO,id:null}]
          : MODELOS.filter(x=>x.habilitado!==false);
        const loader=new GLTFLoader();
        let completados=0, errores=0;
        for(const cfg of configuraciones) {
          try {
            const gltf=await loader.loadAsync(cfg.archivo,event=>{
              if(event.total>0) setProgress(
                12+75*(completados+event.loaded/event.total)/Math.max(1,configuraciones.length),
                "Cargando "+cfg.archivo
              );
            });
            const root=gltf.scene;
            root.scale.setScalar(cfg.escala ?? 1);
            root.position.fromArray(cfg.posicion ?? [0,0,0]);
            root.rotation.fromArray(cfg.rotacion ?? [0,0,0]);
            cuerpo.add(root);
            root.updateWorldMatrix(true,true);
            const encontradas=[];
            root.traverse(obj=>{
              if(obj.isMesh) encontradas.push(obj);
            });
            let desconocidas=0;
            for(const mesh of encontradas) {
              let id=cfg.id || idDeMalla(mesh);
              if(!id || !catalogo.has(id)) {
                id="externa_"+normalizar(mesh.name || "malla")+"_"+partes.size;
                const sistema=SISTEMAS[cfg.sistema] ? cfg.sistema : "esqueletico";
                catalogo.set(id,{
                  id,nombre:mesh.name || "Estructura sin identificar",
                  latin:"Sin correspondencia terminológica",
                  sistema,region:"torax",
                  descripcion:"Malla externa sin asociación en el catálogo. Su identificación anatómica no ha sido verificada.",
                  funcion:"Añade su función al diccionario de metadatos.",
                  ubicacion:"Definida por el archivo externo.",
                  datosCuriosos:"Asocia el nombre de esta malla mediante ALIAS_MALLAS."
                });
                desconocidas++;
              }
              if(!partes.has(id)) crearParte(id);
              const parte=partes.get(id);
              if(cfg.id===id) {
                if(cfg.descripcion) parte.meta.descripcion=cfg.descripcion;
                if(cfg.funcion) parte.meta.funcion=cfg.funcion;
                if(cfg.datosCuriosos) parte.meta.datosCuriosos=cfg.datosCuriosos;
              }
              // attach conserva la transformación mundial, incluidos huesos de modelos estáticos.
              parte.grupo.attach(mesh);
              clonarMateriales(mesh);
              mesh.castShadow=true;
              mesh.receiveShadow=true;
              mesh.userData.parte=id;
              mallas.push(mesh);
            }
            root.removeFromParent();
            if(desconocidas) avisar(desconocidas+" mallas sin correspondencia anatómica; revisa ALIAS_MALLAS.");
          } catch(error) {
            errores++;
            console.warn("Fallo al cargar",cfg.archivo,error);
          }
          completados++;
          setProgress(12+75*completados/Math.max(1,configuraciones.length),"Preparando las estructuras…");
        }
        return { errores,total:configuraciones.length };
      }

      // Anatomía urinaria complementaria: volúmenes didácticos procedurales.
      // Se registra cada estructura en el catálogo, las mallas y los controles existentes.
      const urinario={sexo:"masculino",solo:false,comparar:false,flujo:false,pausa:false,velocidad:1,t:0,estacion:-1,callback:null};
      let estudioUI=null,particulasOrina=null,rutaOrina=null,estacionesOrina=[];
      function fichaUrinaria(id,nombre,latin,descripcion,funcion,ubicacion,relaciones=[],opciones={}) {
        const meta={id,nombre,latin,sistema:"urinario",region:"abdomen",descripcion,funcion,ubicacion,
          datosCuriosos:"Esquema didáctico: las proporciones de las estructuras internas se amplían para facilitar su estudio.",
          relaciones,urinaria:true,modelo:"Geometría procedural de estudio; no representa una imagen clínica.",...opciones};
        catalogo.set(id,meta);
        [id,nombre,latin].forEach(n=>nombres.set(normalizar(n),id));
        return crearParte(id);
      }
      function puntoParte(id) {
        const p=partes.get(id);
        return p ? new T.Box3().setFromObject(p.grupo).getCenter(new T.Vector3()) : new T.Vector3();
      }
      function tuboUrinario(p,puntos,radio,color) {return tubo(p,puntos,radio,color);}
      function agregarAnatomiaUrinaria() {
        for(const p of partes.values()) if(p.meta.sistema==="urinario") p.meta.urinaria=true;
        for(const [lado,suf,signo] of [["derecho","derecha",-1],["izquierdo","izquierda",1]]) {
          const idR="rinon_"+lado;
          const ri=partes.get(idR),c=puntoParte(idR);
          const dim=new T.Box3().setFromObject(ri.grupo).getSize(new T.Vector3());
          const sx=dim.x*.48,sy=dim.y*.48,sz=dim.z*.37;
          const ix=id=>id+"_"+suf;
          const interno=(id,nombre,latin,desc,func,rel=[])=>{
            const p=fichaUrinaria(ix(id),nombre+" · riñón "+lado,latin,desc,func,"Interior del riñón "+lado,rel,
              {padre:idR,interno:true});
            p.grupo.position.copy(c);return p;
          };
          // Corteza: anillo tridimensional con un espacio central para el seno renal.
          const forma=new T.Shape();
          for(let i=0;i<=64;i++) {
            const a=i/64*Math.PI*2;
            const x=Math.cos(a),y=Math.sin(a);
            const hendidura=1-.28*Math.exp(-Math.pow((x+signo)/.5,2))*Math.exp(-y*y*8);
            const px=x*sx*hendidura,py=y*sy;
            if(i===0)forma.moveTo(px,py);else forma.lineTo(px,py);
          }
          const hueco=new T.Path();hueco.absellipse(0,0,sx*.68,sy*.74,0,Math.PI*2,true,0);forma.holes.push(hueco);
          let p=interno("corteza","Corteza renal","Cortex renalis","Región periférica del parénquima renal.",
            "Contiene corpúsculos renales y segmentos tubulares que participan en filtración y transporte.",[idR,ix("medula")]);
          const geo=new T.ExtrudeGeometry(forma,{depth:sz*1.4,bevelEnabled:false,curveSegments:36});
          agregarMalla(p,geo,[1,1,1],[0,0,-sz*.7],"#bd7760");
          p=interno("medula","Médula renal","Medulla renalis","Región interna organizada en pirámides renales.",
            "Aloja asas y conductos que participan en la concentración y conducción de la orina.",[ix("piramides"),ix("corteza")]);
          ovalo(p,[0,0,-sz*.5],[sx*.65,sy*.75,sz*.35],"#a05d77");
          const pir=interno("piramides","Pirámides renales","Pyramides renales","Unidades cónicas de la médula, con bases hacia la corteza y vértices hacia el seno.",
            "Conducir el líquido tubular hacia los conductos papilares.",[ix("papila"),ix("columnas")]);
          const col=interno("columnas","Columnas renales","Columnae renales","Prolongaciones corticales entre las pirámides.",
            "Separar las pirámides y alojar vasos interlobares.",[ix("corteza"),ix("piramides")]);
          const pap=interno("papila","Papilas renales","Papillae renales","Vértices de las pirámides que protruyen en los cálices menores.",
            "Entregar la orina de los conductos papilares a los cálices menores.",[ix("calices_menores")]);
          const menores=interno("calices_menores","Cálices menores","Calices renales minores","Pequeñas cavidades colectoras alrededor de las papilas.",
            "Recoger orina de las papilas y conducirla a los cálices mayores.",[ix("papila"),ix("calices_mayores")]);
          const mayores=interno("calices_mayores","Cálices mayores","Calices renales majores","Ramas colectoras formadas por la confluencia de cálices menores.",
            "Conducir la orina hacia la pelvis renal.",[ix("pelvis_renal"),ix("calices_menores")]);
          for(let i=0;i<5;i++) {
            const a=-1.15+i*.575;
            const base=new T.Vector3(signo*Math.cos(a)*sx*.7,Math.sin(a)*sy*.82,-sz*.05);
            const vertice=new T.Vector3(-signo*sx*.12,Math.sin(a)*sy*.38,-sz*.2);
            const altura=base.distanceTo(vertice);
            const cono=new T.ConeGeometry(sx*.31,altura,20);
            const m=agregarMalla(pir,cono,[1,1,1],base.clone().add(vertice).multiplyScalar(.5).toArray(),"#ae5e63");
            m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vertice.clone().sub(base).normalize());
            ovalo(pap,vertice.toArray(),[sx*.1,sy*.065,sz*.22],"#f2b588");
            const fin=new T.Vector3(-signo*sx*.4,Math.sin(a)*sy*.25,-sz*.2);
            tuboUrinario(menores,[vertice.toArray(),fin.toArray()],sx*.07,"#e4c99b");
            tuboUrinario(mayores,[fin.toArray(),[-signo*sx*.4,0,-sz*.2]],sx*.095,"#d9bd83");
            if(i<4) {
              const aa=a+.28;
              tuboUrinario(col,[[signo*Math.cos(aa)*sx*.85,Math.sin(aa)*sy*.9,sz*.18],[-signo*sx*.05,Math.sin(aa)*sy*.42,sz*.18]],sx*.07,"#d28d73");
            }
          }
          p=interno("pelvis_renal","Pelvis renal","Pelvis renalis","Cavidad en forma de embudo que continúa con el uréter.",
            "Reunir la orina de los cálices mayores y entregarla al uréter.",[ix("calices_mayores"),"ureter_"+lado]);
          ovalo(p,[-signo*sx*.4,0,-sz*.2],[sx*.22,sy*.28,sz*.4],"#dec087");
          tuboUrinario(p,[[-signo*sx*.4,0,-sz*.2],[-signo*sx*.7,-sy*.35,-sz*.2]],sx*.09,"#dec087");
          p=interno("hilio","Hilio renal","Hilum renale","Depresión del borde medial por donde pasan vasos y pelvis renal.",
            "Permitir el paso de las estructuras del pedículo renal.",[ix("arteria_renal"),ix("vena_renal"),ix("pelvis_renal")]);
          const aro=agregarMalla(p,new T.TorusGeometry(1,.12,8,32),[sy*.32,sz*.7,sx*.2],[-signo*sx*.8,0,0],"#d0b69b");aro.rotation.y=Math.PI/2;
          for(const [tipo,color,z] of [["arteria","#c64b56",-.06],["vena","#5d8dc0",.07]]) {
            p=fichaUrinaria(ix(tipo+"_renal"),(tipo==="arteria"?"Arteria":"Vena")+" renal "+suf,
              tipo==="arteria"?"Arteria renalis":"Vena renalis",tipo==="arteria"?"Rama de la aorta abdominal que lleva sangre al riñón.":"Vaso que drena sangre renal hacia la vena cava inferior.",
              tipo==="arteria"?"Aportar sangre al lecho vascular renal.":"Retornar la sangre del riñón a la circulación venosa.","Pedículo renal "+lado,[idR,ix("hilio")],{sistema:"circulatorio",padre:idR});
            tuboUrinario(p,[[0,c.y+.04,c.z+z],[c.x-signo*sx,c.y,c.z+z],[c.x-signo*sx*.55,c.y,c.z+z]],.028,color);
          }
          ri.meta.relaciones=[ix("corteza"),ix("medula"),ix("pelvis_renal"),ix("hilio"),"ureter_"+lado];
          const vej=puntoParte("vejiga");
          const inicio=c.clone().add(new T.Vector3(-signo*sx*.65,-sy*.35,0));
          const cambio=new T.Vector3(c.x*.75,vej.y+.45,c.z-.05),fin=vej.clone().add(new T.Vector3(signo*.14,.1,-.03));
          for(const [por,n,desde,hasta] of [["abdominal","abdominal",inicio,cambio],["pelvica","pélvica",cambio,fin]]) {
            p=fichaUrinaria("ureter_"+lado+"_"+por,"Uréter "+lado+" · porción "+n,"Pars "+(por==="abdominal"?"abdominalis":"pelvica")+" ureteris",
              "Segmento "+n+" del uréter "+lado+".","Conducir orina por peristaltismo hacia la vejiga.",por==="abdominal"?"Retroperitoneo, por delante del psoas mayor.":"Pared lateral de la pelvis hacia la vejiga.",
              ["ureter_"+lado,"psoas_"+lado,"vejiga"],{padre:"ureter_"+lado,region:por==="abdominal"?"abdomen":"pelvis"});
            tuboUrinario(p,[desde.toArray(),desde.clone().lerp(hasta,.5).toArray(),hasta.toArray()],.018,"#dcb783");
          }
          p=fichaUrinaria("psoas_"+lado,"Psoas mayor "+lado,"Musculus psoas major","Músculo de la pared abdominal posterior relacionado con el uréter abdominal.",
            "Flexionar la cadera y contribuir a estabilizar la columna lumbar.","A los lados de la columna lumbar; el uréter desciende por delante.",["ureter_"+lado+"_abdominal"],{sistema:"muscular",contextoUrinario:true});
          const m=ovalo(p,[signo*.26,(inicio.y+fin.y)/2,c.z-.16],[.13,(inicio.y-fin.y)*.56,.11],"#a85466");m.rotation.z=signo*.12;
        }
        const vb=puntoParte("vejiga"),tam=new T.Box3().setFromObject(partes.get("vejiga").grupo).getSize(new T.Vector3());
        const interior=(id,nombre,latin,desc,func,rel=[])=>{
          const p=fichaUrinaria(id,nombre,latin,desc,func,"Vejiga urinaria",rel,{padre:"vejiga",region:"pelvis",interno:true});p.grupo.position.copy(vb);return p;
        };
        let p=interior("detrusor","Músculo detrusor","Musculus detrusor vesicae","Músculo liso de la pared de la vejiga.","Contraerse durante la micción para expulsar la orina.",["vejiga","trigono"]);
        for(let i=0;i<7;i++) {
          const a=i/7*Math.PI;
          const pts=Array.from({length:33},(_,j)=>{const t=j/32*Math.PI*2;return [Math.sin(t)*tam.x*.43*Math.cos(a),Math.cos(t)*tam.y*.43,Math.sin(t)*tam.z*.43*Math.sin(a)];});
          tuboUrinario(p,pts,.008,"#b87879");
        }
        p=interior("trigono","Trígono vesical","Trigonum vesicae","Área triangular delimitada por los dos orificios ureterales y el orificio uretral interno.","Delimitar la zona de entrada ureteral y salida uretral.",["orificio_ureteral_derecho","orificio_ureteral_izquierdo","orificio_uretral_interno"]);
        const tri=new T.Shape();tri.moveTo(-.14,.07);tri.lineTo(.14,.07);tri.lineTo(0,-.11);tri.closePath();
        agregarMalla(p,new T.ExtrudeGeometry(tri,{depth:.018,bevelEnabled:false}),[1,1,1],[0,0,-.035],"#e4aaa2");
        for(const [id,nombre,x,y] of [["orificio_ureteral_derecho","Orificio ureteral derecho",-.14,.07],["orificio_ureteral_izquierdo","Orificio ureteral izquierdo",.14,.07],["orificio_uretral_interno","Orificio uretral interno",0,-.11]]) {
          p=interior(id,nombre,id==="orificio_uretral_interno"?"Ostium urethrae internum":"Ostium ureteris",id==="orificio_uretral_interno"?"Abertura de la vejiga hacia la uretra.":"Abertura de un uréter en la vejiga.","Permitir el paso de la orina.",["trigono","vejiga"]);
          agregarMalla(p,new T.TorusGeometry(.025,.008,8,24),[1,1,1],[x,y,-.01],"#f1d39a");
        }
        const salida=vb.clone().add(new T.Vector3(0,-tam.y*.4,.02));
        const rutas={
          masculino:[salida.toArray(),[0,salida.y-.18,.03],[0,salida.y-.32,.02],[0,salida.y-.52,.12],[0,salida.y-.61,.44],[0,salida.y-.63,.79]],
          femenino:[salida.toArray(),[0,salida.y-.13,.09],[0,salida.y-.26,.16]]
        };
        for(const sexo of ["masculino","femenino"]) {
          p=fichaUrinaria("uretra_"+sexo,"Uretra "+(sexo==="masculino"?"masculina":"femenina"),sexo==="masculino"?"Urethra masculina":"Urethra feminina",
            "Conducto de salida de la orina. Longitud aproximada según la guía del laboratorio 11: "+(sexo==="masculino"?"15–20 cm.":"3–6 cm."),
            "Conducir la orina desde la vejiga hasta el exterior.","Desde el cuello vesical hasta el orificio uretral externo.",
            sexo==="masculino"?["uretra_prostatica","uretra_membranosa","uretra_esponjosa"]:["vejiga","vagina_contexto"],{region:"pelvis",sexo});
          tuboUrinario(p,rutas[sexo],.023,"#d6b784");
        }
        for(const [id,nombre,latin,desc,pts] of [
          ["uretra_prostatica","Uretra prostática","Pars prostatica urethrae","Porción que atraviesa la próstata.",rutas.masculino.slice(0,2)],
          ["uretra_membranosa","Uretra membranosa","Pars membranacea urethrae","Porción corta que atraviesa la región del esfínter uretral externo.",rutas.masculino.slice(1,3)],
          ["uretra_esponjosa","Uretra esponjosa o peneana","Pars spongiosa urethrae","Porción que recorre el cuerpo esponjoso del pene.",rutas.masculino.slice(2)]
        ]) {
          p=fichaUrinaria(id,nombre,latin,desc,"Conducir la orina hacia el exterior.","Uretra masculina",["uretra_masculino","vejiga"],{region:"pelvis",sexo:"masculino",padre:"uretra_masculino"});
          tuboUrinario(p,pts,.027,id==="uretra_prostatica"?"#d0a76f":id==="uretra_membranosa"?"#a5c2cb":"#d99f91");
        }
        // Relaciones pélvicas: sólo se muestran al abrir el comparador.
        for(const [id,nombre,latin,sexo,pos,escala,desc] of [
          ["recto_contexto","Recto: relación con la vejiga masculina","Rectum","masculino",[0,vb.y,-.31],[.12,.35,.1],"En el varón, el recto se encuentra posterior a la vejiga, con estructuras interpuestas."],
          ["utero_contexto","Útero: relación con la vejiga","Uterus","femenino",[0,vb.y+.15,-.26],[.17,.21,.1],"En la mujer, el útero se sitúa posterior y superior a la vejiga."],
          ["vagina_contexto","Vagina: relación con la vejiga","Vagina","femenino",[0,vb.y-.13,-.19],[.1,.24,.07],"La vejiga y la uretra se sitúan por delante de la vagina."]
        ]) {p=fichaUrinaria(id,nombre,latin,desc,"Servir como referencia de relación topográfica en este esquema.","Pelvis",["vejiga"],{sexo,region:"pelvis",contexto:true});ovalo(p,pos,escala,"#a97fa6");}
        partes.get("vejiga").meta.relaciones=["trigono","detrusor","orificio_uretral_interno","uretra_masculino","uretra_femenino"];
        const g=new T.SphereGeometry(.018,8,6),m=new T.MeshBasicMaterial({color:0x8ffff0,transparent:true,opacity:.95,depthTest:false,depthWrite:false});
        particulasOrina=new T.InstancedMesh(g,m,28);particulasOrina.visible=false;particulasOrina.frustumCulled=false;particulasOrina.renderOrder=30;escena.add(particulasOrina);
        prepararRutaOrina();
      }
      function prepararRutaOrina() {
        const ids=["papila_derecha","calices_menores_derecha","calices_mayores_derecha","pelvis_renal_derecha","ureter_derecho_abdominal","ureter_derecho_pelvica","vejiga",...(urinario.sexo==="masculino"?["uretra_prostatica","uretra_membranosa","uretra_esponjosa"]:["uretra_femenino"])];
        estacionesOrina=ids.map(id=>({id,nombre:catalogo.get(id).nombre,p:puntoParte(id)}));
        const salida=estacionesOrina.at(-1).p.clone().add(new T.Vector3(0,-.12,.15));
        estacionesOrina.push({id:null,nombre:"Exterior · excreción",p:salida});
        rutaOrina=new T.CatmullRomCurve3(estacionesOrina.map(x=>x.p),false,"centripetal");
        urinario.t=0;urinario.estacion=-1;
      }
      function actualizarOrina(dt) {
        if(!particulasOrina || !urinario.flujo)return false;
        if(!urinario.pausa)urinario.t=(urinario.t+dt*.045*urinario.velocidad)%1;
        const matriz=new T.Matrix4();
        for(let i=0;i<28;i++){const t=Math.max(0,Math.min(1,urinario.t-i*.008));matriz.makeTranslation(...rutaOrina.getPoint(t).toArray());particulasOrina.setMatrixAt(i,matriz);}
        particulasOrina.instanceMatrix.needsUpdate=true;
        const estacion=Math.min(estacionesOrina.length-1,Math.floor(urinario.t*(estacionesOrina.length-1)+1e-6));
        if(estacion!==urinario.estacion){urinario.estacion=estacion;urinario.callback?.(estacionesOrina[estacion].nombre);}
        return !urinario.pausa;
      }
      function estudiarUrinario(sexo=urinario.sexo) {
        if(estado.quiz.activo)terminarQuiz();
        urinario.solo=true;urinario.sexo=sexo;
        estado.aislado=null;estado.region="todas";estado.ocultos.clear();$("region").value="todas";
        for(const id of ["urinario","circulatorio","muscular"])SISTEMAS[id].visible=true;
        sincronizarCapas();aplicarEstado();
        const box=new T.Box3();for(const p of partes.values())if(p.grupo.visible)box.expandByObject(p.grupo);
        const c=box.getCenter(new T.Vector3());moverCamara(c.clone().add(new T.Vector3(0,.15,6)),c);
      }
      function cambiarSexoUrinario(sexo){urinario.sexo=sexo;prepararRutaOrina();aplicarEstado();estudioUI?.sincronizarSexo?.();}

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

      function mostrarInformacion(id) {
        const meta=catalogo.get(id);
        $("empty-info").hidden=true;
        $("part-info").hidden=false;
        $("info-name").textContent=meta.nombre;
        $("info-latin").textContent=meta.latin;
        $("info-system").textContent=SISTEMAS[meta.sistema].nombre;
        $("info-system").style.borderColor=SISTEMAS[meta.sistema].color;
        $("info-description").textContent=meta.descripcion + (meta.modelo ? " " + meta.modelo : "");
        $("info-function").textContent=meta.funcion;
        $("info-location").textContent=meta.ubicacion;
        $("info-fact").textContent=meta.datosCuriosos;
        $("info-related").replaceChildren();
        const explicitas={
          corazon:["aorta","vena_cava","pulmon_derecho","pulmon_izquierdo"],
          cerebro:["cerebelo","tronco","medula","hipofisis"],
          estomago:["esofago","pancreas","intestino_delgado"],
          higado:["vesicula","pancreas","intestino_delgado"],
          vejiga:["ureter_derecho","ureter_izquierdo","rinon_derecho","rinon_izquierdo"],
          rinon_derecho:["ureter_derecho","suprarrenales","vejiga"],
          rinon_izquierdo:["ureter_izquierdo","suprarrenales","vejiga"]
        };
        const relacionados=(meta.relaciones || explicitas[id] || [...partes.keys()]
          .filter(otro=>otro!==id && catalogo.get(otro).sistema===meta.sistema))
          .filter(otro=>partes.has(otro)).slice(0,5);
        if(!relacionados.length) $("info-related").textContent="Sin asociaciones disponibles.";
        relacionados.forEach(otro=>{
          const b=document.createElement("button");
          b.textContent=catalogo.get(otro).nombre;
          b.onclick=()=>seleccionar(otro);
          $("info-related").append(b);
        });
      }
      function seleccionar(id,{revelar=true,estudio=false}={}) {
        if(!partes.has(id)) return;
        if(estado.quiz.activo && !estudio) {
          avisar("Termina el quiz para explorar otras estructuras.");
          return;
        }
        const p=partes.get(id);
        if(p.meta.sexo && p.meta.sexo!==urinario.sexo)cambiarSexoUrinario(p.meta.sexo);
        if(p.meta.contexto)urinario.comparar=true;
        if(urinario.solo&&!p.meta.urinaria)urinario.solo=false;
        estado.seleccionado=id;
        if(revelar) {
          estado.ocultos.delete(id);
          estado.aislado=null;
          estado.region="todas";
          $("region").value="todas";
          document.querySelectorAll(".tree-region").forEach(r=>r.hidden=false);
          const s=SISTEMAS[p.meta.sistema];
          s.visible=true;
          s.opacidad=Math.max(.55,s.opacidad);
          sincronizarCapas();
        }
        document.querySelectorAll(".tree-part").forEach(b=>{
          const seleccionada=!estudio && b.dataset.id===id;
          b.classList.toggle("selected",seleccionada);
          b.setAttribute("aria-pressed",String(seleccionada));
          if(seleccionada) {
            let padre=b.parentElement;
            while(padre && padre!==$("tree")) {
              if(padre.tagName==="DETAILS") padre.open=true;
              padre=padre.parentElement;
            }
          }
        });
        if(!estudio) {
          mostrarInformacion(id);
          $("right-panel").scrollTop=0;
          if(vistaMovil.matches && $("study-panel")?.hidden!==false) {
            $("search").blur();
            panel("right",true,{enfocar:false});
          }
          $("search").value="";
          limpiarResultados();
        } else {
          $("part-info").hidden=true;
          $("empty-info").hidden=false;
        }
        aplicarEstado();
        enfocarParte(p);
      }
      function deseleccionar() {
        if(estado.quiz.activo) terminarQuiz();
        estado.seleccionado=null;
        estado.hover=null;
        $("part-info").hidden=true;
        $("empty-info").hidden=false;
        document.querySelectorAll(".tree-part.selected").forEach(b=>{
          b.classList.remove("selected");
          b.setAttribute("aria-pressed","false");
        });
        actualizarContorno();
        solicitarRender();
      }
      function aislar() {
        if(!estado.seleccionado || estado.quiz.activo) return;
        estado.aislado=estado.seleccionado;
        aplicarEstado();
      }
      function ocultarSeleccionada() {
        if(!estado.seleccionado || estado.quiz.activo) return;
        const id=estado.seleccionado;
        estado.ocultos.add(id);
        estado.aislado=null;
        deseleccionar();
        aplicarEstado();
      }
      function restaurar() {
        urinario.solo=false;urinario.comparar=false;urinario.flujo=false;
        if(particulasOrina)particulasOrina.visible=false;
        if(estado.quiz.activo) terminarQuiz();
        estado.ocultos.clear();
        estado.aislado=null;
        estado.region="todas";
        $("region").value="todas";
        // Se restablece una vista del interior legible; piel y músculos quedan disponibles.
        for(const [id,s] of Object.entries(SISTEMAS)) {
          s.visible=!["piel","muscular"].includes(id);
          s.opacidad=id==="esqueletico"?.72:id==="respiratorio"?.72:id==="piel"?.18:1;
        }
        estado.corte=false;
        $("clip-enabled").checked=false;
        estado.explosionObjetivo=0;
        $("explode").value=0;
        $("explode-value").textContent="0%";
        sincronizarCapas();
        aplicarEstado();
      }

      // Raycasting: descarta partes ocultas y fragmentos eliminados por el corte.
      function intersectar(evento) {
        const rect=renderer.domElement.getBoundingClientRect();
        puntero.set(
          (evento.clientX-rect.left)/rect.width*2-1,
          -(evento.clientY-rect.top)/rect.height*2+1
        );
        rayo.setFromCamera(puntero,camara);
        const candidatas=mallas.filter(m=>partes.get(m.userData.parte)?.grupo.visible);
        const hits=rayo.intersectObjects(candidatas,false);
        return hits.find(h=>!estado.corte || planoCorte.distanceToPoint(h.point)>=0);
      }
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
      function sincronizarCapas() {
        Object.entries(SISTEMAS).forEach(([id,s])=>{
          $("layer-"+id).checked=s.visible;
          $("opacity-"+id).value=Math.round(s.opacidad*100);
          $("output-"+id).textContent=Math.round(s.opacidad*100)+"%";
        });
      }
      function construirArbol() {
        $("tree").replaceChildren();
        for(const [sistema,datos] of Object.entries(SISTEMAS)) {
          const deSistema=[...partes.values()].filter(p=>p.meta.sistema===sistema);
          if(!deSistema.length) continue;
          const raiz=document.createElement("details");
          const sum=document.createElement("summary");
          sum.textContent=datos.nombre+" · "+deSistema.length;
          raiz.append(sum);
          for(const [region,nombre] of Object.entries(REGIONES)) {
            if(region==="todas") continue;
            const lista=deSistema.filter(p=>p.meta.region===region);
            if(!lista.length) continue;
            const rama=document.createElement("details");
            rama.className="tree-region";
            rama.dataset.region=region;
            const titulo=document.createElement("summary");
            titulo.textContent=nombre;
            rama.append(titulo);
            const contenedores=new Map();
            lista.forEach(p=>{
              let destino=rama;
              if(p.meta.padre){
                if(!contenedores.has(p.meta.padre)){
                  const grupo=document.createElement("details"),titulo=document.createElement("summary");
                  grupo.className="tree-region";
                  titulo.textContent=catalogo.get(p.meta.padre)?.nombre || p.meta.padre;
                  grupo.append(titulo);rama.append(grupo);contenedores.set(p.meta.padre,grupo);
                }
                destino=contenedores.get(p.meta.padre);
              }
              const b=document.createElement("button");
              b.className="tree-part";b.dataset.id=p.id;b.textContent=p.meta.nombre;
              b.setAttribute("aria-pressed","false");b.onclick=()=>seleccionar(p.id);destino.append(b);
            });
            raiz.append(rama);
          }
          $("tree").append(raiz);
        }
      }
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
      function limpiarResultados() {
        resultados=[];
        indiceResultado=-1;
        $("search-results").replaceChildren();
        $("search").setAttribute("aria-expanded","false");
        $("search").removeAttribute("aria-activedescendant");
      }
      function buscar() {
        const q=normalizar($("search").value);
        limpiarResultados();
        if(!q) return;
        resultados=[...partes.values()].filter(p=>
          normalizar(p.meta.nombre+" "+p.meta.latin+" "+p.id).includes(q)
        ).slice(0,12);
        if(!resultados.length) {
          const vacio=document.createElement("p");
          vacio.className="muted";
          vacio.style.cssText="font-size:12px;padding:12px;margin:0";
          vacio.textContent="No se encontraron estructuras.";
          $("search-results").append(vacio);
        }
        resultados.forEach((p,i)=>{
          const b=document.createElement("button");
          b.className="result";
          b.id="resultado-"+i;
          b.setAttribute("role","option");
          b.setAttribute("aria-selected","false");
          const nombre=document.createElement("span");
          nombre.textContent=p.meta.nombre;
          const latin=document.createElement("small");
          latin.textContent=p.meta.latin;
          b.append(nombre,latin);
          b.onpointerdown=e=>e.preventDefault();
          b.onclick=()=>seleccionar(p.id);
          $("search-results").append(b);
        });
        $("search").setAttribute("aria-expanded","true");
      }
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
      function actualizarEtiquetas() {
        for(const p of partes.values()) p.etiqueta.hidden=true;
        geometriaGuias.setDrawRange(0,0);
        if(!estado.etiquetas || estado.quiz.activo) return;
        const rect=$("stage").getBoundingClientRect();
        const ocupados=[];
        const candidatas=[...partes.values()].filter(p=>p.grupo.visible)
          .sort((a,b)=>(a.id===estado.seleccionado?-1:b.id===estado.seleccionado?1:0));
        let cuenta=0;
        for(const p of candidatas) {
          if(cuenta>=18) break;
          const centro=new T.Box3().setFromObject(p.grupo).getCenter(new T.Vector3());
          if(estado.corte && planoCorte.distanceToPoint(centro)<0) continue;
          const ndc=centro.clone().project(camara);
          if(ndc.z<-1 || ndc.z>1 || Math.abs(ndc.x)>.94 || Math.abs(ndc.y)>.91) continue;
          const origen=camara.position.clone();
          const direccion=centro.clone().sub(origen).normalize();
          rayo.set(origen,direccion);
          const hits=rayo.intersectObjects(mallas.filter(m=>partes.get(m.userData.parte)?.grupo.visible),false)
            .filter(h=>!estado.corte || planoCorte.distanceToPoint(h.point)>=0);
          if(hits[0] && hits[0].object.userData.parte!==p.id) continue;
          const lado=ndc.x<0?-1:1;
          const x=(ndc.x*.5+.5)*rect.width+lado*70;
          const y=(-ndc.y*.5+.5)*rect.height;
          if(x<65 || x>rect.width-65 || y<55 || y>rect.height-80) continue;
          if(ocupados.some(o=>Math.abs(o.x-x)<145 && Math.abs(o.y-y)<27)) continue;
          ocupados.push({x,y});
          p.etiqueta.hidden=false;
          p.etiqueta.style.left=x+"px";
          p.etiqueta.style.top=y+"px";
          const fin=new T.Vector3(x/rect.width*2-1,-y/rect.height*2+1,ndc.z).unproject(camara);
          bufferGuias.set([...centro.toArray(),...fin.toArray()],cuenta*6);
          cuenta++;
        }
        geometriaGuias.attributes.position.needsUpdate=true;
        geometriaGuias.setDrawRange(0,cuenta*2);
      }

      // Cuestionario: evita mostrar la respuesta en fichas, etiquetas o tooltip.
      function mezclar(lista) {
        const copia=[...lista];
        for(let i=copia.length-1;i>0;i--) {
          const j=Math.floor(Math.random()*(i+1));
          [copia[i],copia[j]]=[copia[j],copia[i]];
        }
        return copia;
      }
      function iniciarQuiz() {
        if(partes.size<4) { avisar("El quiz requiere al menos cuatro estructuras cargadas."); return; }
        estado.quiz={activo:true,id:null,aciertos:0,total:0,respondido:false};
        $("quiz-card").hidden=false;
        $("quiz-toggle").setAttribute("aria-pressed","true");
        $("quiz-toggle").textContent="Terminar quiz";
        $("tooltip").hidden=true;
        estado.hover=null;
        siguientePregunta();
      }
      function siguientePregunta() {
        const opcionesBase=[...partes.values()].filter(p=>!p.id.startsWith("externa_") && p.id!=="piel");
        if(opcionesBase.length<4) { terminarQuiz(); avisar("Faltan cuatro estructuras identificadas para generar preguntas."); return; }
        const candidatos=opcionesBase.filter(p=>p.id!==estado.quiz.id);
        const elegido=candidatos[Math.floor(Math.random()*candidatos.length)];
        estado.quiz.id=elegido.id;
        estado.quiz.respondido=false;
        estado.corte=false;
        $("clip-enabled").checked=false;
        $("quiz-feedback").textContent="";
        $("quiz-next").hidden=true;
        $("quiz-options").replaceChildren();
        $("quiz-score").textContent=estado.quiz.aciertos+" / "+estado.quiz.total;
        const distractores=mezclar(opcionesBase.filter(p=>p.id!==elegido.id)).slice(0,3);
        mezclar([elegido,...distractores]).forEach(p=>{
          const b=document.createElement("button");
          b.textContent=p.meta.nombre;
          b.onclick=()=>responderQuiz(p.id);
          $("quiz-options").append(b);
        });
        seleccionar(elegido.id,{estudio:true});
      }
      function responderQuiz(id) {
        if(estado.quiz.respondido) return;
        estado.quiz.respondido=true;
        estado.quiz.total++;
        const correcta=id===estado.quiz.id;
        if(correcta) estado.quiz.aciertos++;
        const meta=catalogo.get(estado.quiz.id);
        $("quiz-feedback").textContent=(correcta?"Correcto. ":"La respuesta es "+meta.nombre+". ")+meta.funcion;
        $("quiz-feedback").style.color=correcta?"var(--accent)":"var(--danger)";
        $("quiz-score").textContent=estado.quiz.aciertos+" / "+estado.quiz.total;
        [...$("quiz-options").children].forEach(b=>b.disabled=true);
        $("quiz-next").hidden=false;
      }
      function terminarQuiz() {
        const {aciertos,total}=estado.quiz;
        estado.quiz.activo=false;
        $("quiz-card").hidden=true;
        $("quiz-toggle").setAttribute("aria-pressed","false");
        $("quiz-toggle").textContent="Iniciar quiz anatómico";
        if(estado.seleccionado) mostrarInformacion(estado.seleccionado);
        solicitarRender();
        if(total) avisar("Quiz finalizado: "+aciertos+" respuestas correctas de "+total+".");
      }

      function actualizarCorte() {
        const eje=$("clip-axis").value;
        const fraccion=Number($("clip-position").value)/100;
        const caja=cajaCuerpo;
        const minimo=caja.min[eje]-.1,maximo=caja.max[eje]+.1;
        planoCorte.normal.set(eje==="x"?-1:0,eje==="y"?-1:0,eje==="z"?-1:0);
        planoCorte.constant=T.MathUtils.lerp(minimo,maximo,fraccion);
        estado.corte=$("clip-enabled").checked;
        aplicarEstado();
      }
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
      function establecerTema(claro) {
        document.documentElement.dataset.theme=claro?"light":"dark";
        $("theme").setAttribute("aria-pressed",String(claro));
        $("theme").setAttribute("aria-label",claro?"Cambiar a tema oscuro":"Cambiar a tema claro");
        rejilla.material.color.set(claro?0x8ca7b8:0x294354);
        contorno.visibleEdgeColor.set(claro?"#087c65":"#8bffe3");
        try { localStorage.setItem("atlas-theme",claro?"light":"dark"); } catch {}
        solicitarRender();
      }
      $("theme").onclick=()=>establecerTema(document.documentElement.dataset.theme!=="light");
      try { establecerTema(localStorage.getItem("atlas-theme")==="light"); } catch {}

      function estadoPanel(lado,visible) {
        const nodo=$(lado+"-panel");
        nodo.classList.toggle("collapsed",!visible);
        nodo.inert=!visible;
        nodo.setAttribute("aria-hidden",String(!visible));
        $("toggle-"+lado).setAttribute("aria-expanded",String(visible));
      }
      function panel(lado,abrir,{enfocar=true}={}) {
        const nodo=$(lado+"-panel");
        const visible=abrir ?? nodo.classList.contains("collapsed");
        if(visible && vistaMovil.matches) {
          estadoPanel(lado==="left"?"right":"left",false);
          estudioUI?.cerrar({devolverFoco:false});
        }
        estadoPanel(lado,visible);
        if(enfocar) {
          if(visible)requestAnimationFrame(()=>{if(!nodo.inert)nodo.querySelector("button,select,input")?.focus({preventScroll:true});});
          else $("toggle-"+lado).focus({preventScroll:true});
        }
      }
      $("toggle-left").onclick=()=>panel("left");
      $("toggle-right").onclick=()=>panel("right");
      document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>panel(b.dataset.close,false));
      function adaptarPaneles(){
        for(const lado of ["left","right"])estadoPanel(lado,!vistaMovil.matches);
        solicitarRender();
      }
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

      function iniciarEstudio() {
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
        function guardar(){try{localStorage.setItem(clave,JSON.stringify(progreso));}catch{persistente=false;}}
        let modo="inicio",sesion=null,cronometro=null,flash=null,svgActivo=null,animacionSVG=null;
        let filtroSeccion="todas",filtroDificultad="todas",soloErrores=false;
        const panelEst=nodo("section",null,{id:"study-panel",class:"study-panel","aria-label":"Estudiar aparato urinario"});panelEst.hidden=true;
        const cab=nodo("div",null,{class:"study-header"});cab.append(nodo("h2","Estudiar"),boton("Cerrar",cerrar,{"aria-label":"Cerrar panel Estudiar"}));
        const navegacion=nodo("nav",null,{class:"study-nav","aria-label":"Modos de estudio"}),contenido=nodo("div",null,{class:"study-body",id:"study-content",tabindex:"-1"});
        panelEst.append(cab,navegacion,contenido);document.querySelector("main").append(panelEst);
        const abrir=boton("Estudiar",()=>{if(vistaMovil.matches){estadoPanel("left",false);estadoPanel("right",false);}panelEst.hidden=false;abrir.setAttribute("aria-expanded","true");if(estado.quiz.activo)terminarQuiz();if(svgActivo)svgActivo.unpauseAnimations?.();contenido.focus({preventScroll:true});},{id:"study-open","aria-expanded":"false","aria-controls":"study-panel"});
        document.querySelector(".header-actions").prepend(abrir);
        const tabs=[["inicio","Inicio"],["quiz","Quiz del banco"],["flash","Flashcards"],["ruta","Recorrido"],["nefrona","Nefrona"],["histologia","Histología"],["epitelios","Epitelios"],["comparar","Hombre / mujer"],["auto","Autoevaluación"],["examen","Simulacro"],["errores","Errores"]];
        tabs.forEach(([id,label])=>navegacion.append(boton(label,()=>cambiarModo(id),{"data-mode":id,"aria-pressed":"false"})));
        function cerrar({devolverFoco=true}={}){panelEst.hidden=true;abrir.setAttribute("aria-expanded","false");svgActivo?.pauseAnimations?.();if(urinario.flujo){urinario.pausa=true;if($("urine-play"))$("urine-play").textContent="Continuar";}solicitarRender();if(devolverFoco)abrir.focus({preventScroll:true});}
        function cambiarModo(nuevo){
          if(sesion&&!sesion.terminada){finalizarSesion("Sesión interrumpida al cambiar de modo");return;}
          if(modo==="flash"&&flash?.vistas){resumenFlash();return;}
          svgActivo?.pauseAnimations?.();svgActivo=null;animacionSVG=null;
          if(modo==="ruta"){urinario.flujo=false;particulasOrina.visible=false;urinario.callback=null;solicitarRender();}
          if(modo==="comparar"){urinario.comparar=false;aplicarEstado();}
          modo=nuevo;limpiar(contenido);navegacion.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.mode===modo)));
          const vistas={inicio:inicio,quiz:configurarQuiz,flash:iniciarFlash,ruta:recorrido,nefrona:nefrona,histologia:histologia,epitelios:tablaEpitelios,comparar:comparador,auto:autoevaluacion,examen:configurarExamen,errores:panelErrores};vistas[modo]();
          contenido.scrollTop=0;
        }
        function faltaBanco(){if(BANCO.length)return false;contenido.append(mensaje("Pendiente del DOCX: este modo necesita las preguntas y respuestas exactas de Cuestionario_Aparato_Urinario_Laboratorio_11.docx. No se han creado preguntas de sustitución.","study-alert"));return true;}
        function titulo(texto){contenido.append(nodo("h3",texto));}
        function inicio(){
          titulo("Aparato urinario · laboratorio 11");
          contenido.append(mensaje(FUENTE_DOCX?"Fuente: "+FUENTE_DOCX:"Falta adjuntar el DOCX para completar el banco y la autoevaluación.",FUENTE_DOCX?"study-status":"study-alert"));
          contenido.append(mensaje(BANCO.length+" preguntas del documento · 7 secciones · progreso local"));
          const acciones=nodo("div",null,{class:"study-flex"});acciones.append(boton("Explorar aparato urinario",()=>estudiarUrinario()),boton("Ver interior del riñón",()=>{estudiarUrinario();seleccionar("rinon_derecho");const c=puntoParte("rinon_derecho");$("clip-enabled").checked=true;$("clip-axis").value="z";$("clip-position").value=100*(c.z-(cajaCuerpo.min.z-.1))/(cajaCuerpo.max.z-cajaCuerpo.min.z+.2);actualizarCorte();}),boton("Volver al cuerpo completo",()=>{urinario.solo=false;urinario.comparar=false;restaurar();vista("front");}));contenido.append(acciones);
          contenido.append(nodo("p","Explora el riñón en corte, sigue el recorrido de la orina y compara los epitelios. Los esquemas complementarios están identificados como representaciones didácticas."));
          const card=nodo("div",null,{class:"study-card"});card.append(nodo("strong","Atajos de estudio"),nodo("p","1–4: elegir opción · Enter: siguiente · Espacio: voltear flashcard · Esc: cerrar Estudiar."));contenido.append(card);
          if(OBSERVACIONES_DOCX.length){const notas=nodo("details",null,{class:"study-card"});notas.append(nodo("summary","Notas sobre la fuente y los esquemas"));OBSERVACIONES_DOCX.forEach(t=>notas.append(nodo("p",t)));contenido.append(notas);}
          if(!persistente)contenido.append(mensaje("El navegador no permite guardar el progreso. Puedes estudiar durante esta sesión.","study-alert"));
          if(progreso.sesiones.length){const ultima=progreso.sesiones.at(-1);contenido.append(mensaje("Última sesión: "+ultima.aciertos+" / "+ultima.total+" · "+formatoTiempo(ultima.segundos)));}
        }
        function filtros(){
          const fila=nodo("div",null,{class:"study-flex"});
          const seccion=nodo("select",null,{"aria-label":"Filtrar por sección"}),dificultad=nodo("select",null,{"aria-label":"Filtrar por dificultad"});
          seccion.append(nodo("option","Todas las secciones",{value:"todas"}));SECCIONES.forEach(x=>seccion.append(nodo("option",x,{value:x})));
          dificultad.append(nodo("option","Todas las dificultades",{value:"todas"}));[...new Set(BANCO.map(q=>String(q.dificultad)))].sort().forEach(x=>dificultad.append(nodo("option",x,{value:x})));
          seccion.value=filtroSeccion;dificultad.value=filtroDificultad;
          seccion.onchange=()=>filtroSeccion=seccion.value;dificultad.onchange=()=>filtroDificultad=dificultad.value;
          fila.append(seccion,dificultad);contenido.append(fila);
        }
        function bancoFiltrado(){return BANCO.filter(q=>(filtroSeccion==="todas"||q.seccion===filtroSeccion)&&(filtroDificultad==="todas"||String(q.dificultad)===filtroDificultad)&&(!soloErrores||progreso.errores[q.id]?.pendiente));}
        function configurarQuiz(){soloErrores=false;titulo("Quiz del banco");if(faltaBanco())return;filtros();contenido.append(mensaje("Combina opción múltiple, completar, verdadero/falso y ordenar el recorrido renal. Las respuestas y los distractores proceden del banco del documento."));contenido.append(boton("Comenzar",()=>comenzarSesion(false)));}
        function configurarExamen(){
          soloErrores=false;titulo("Simulacro de examen");if(faltaBanco())return;filtros();
          const label=nodo("label","Duración en minutos "),input=nodo("input",null,{type:"number",min:1,max:120,value:20,id:"exam-minutes","aria-label":"Minutos del simulacro"});label.append(input);contenido.append(label);
          contenido.append(mensaje("20 preguntas distintas. No se muestra retroalimentación ni se resalta la estructura hasta finalizar. El reloj continúa si cierras el panel."));
          contenido.append(boton("Iniciar simulacro",()=>{const minutos=Number(input.value);if(!Number.isFinite(minutos)||minutos<1||minutos>120){avisar("Elige una duración entre 1 y 120 minutos.");return;}comenzarSesion(true,minutos);}));
        }
        function candidatosDistractores(q){
          return barajar(BANCO.filter(o=>o.id!==q.id&&o.seccion===q.seccion&&claveRespuesta(o.respuesta)!==claveRespuesta(q.respuesta)))
            .sort((a,b)=>Number(b.estructuraRelacionada===q.estructuraRelacionada)-Number(a.estructuraRelacionada===q.estructuraRelacionada));
        }
        function prepararPregunta(q,i){
          const tipo=q.tipo==="ordenar"&&Array.isArray(q.pasos)?"ordenar":["multiple","completar","vf"][i%3];
          const item={q,tipo,respuesta:null,correcta:null};
          if(tipo==="multiple"){
            const unicas=[...new Map(candidatosDistractores(q).map(o=>[claveRespuesta(o.respuesta),o.respuesta])).values()].slice(0,3);
            if(unicas.length<3)item.tipo="completar";else item.opciones=barajar([q.respuesta,...unicas]);
          }
          if(item.tipo==="completar"){
            const palabras=[...q.respuesta.matchAll(/[\p{L}\p{N}][\p{L}\p{N},.–-]*/gu)].filter(m=>m[0].length>=4||/\d/.test(m[0]));
            const hueco=palabras.length?palabras[Math.floor(Math.random()*palabras.length)]:{0:q.respuesta,index:0};
            item.solucion=hueco[0];item.plantilla=q.respuesta.slice(0,hueco.index)+" ______ "+q.respuesta.slice(hueco.index+hueco[0].length);
          }
          if(item.tipo==="vf"){
            const candidato=candidatosDistractores(q)[0];item.esVerdad=!candidato||Math.random()>.5;item.propuesta=item.esVerdad?q.respuesta:candidato.respuesta;
          }
          if(item.tipo==="ordenar")item.orden=barajar(q.pasos);
          return item;
        }
        function comenzarSesion(examen,minutos=20,lista=null){
          const pool=lista||bancoFiltrado();if(!pool.length){avisar("No hay preguntas con esos filtros.");return;}
          if(examen&&pool.length<20){avisar("Se necesitan al menos 20 preguntas distintas con los filtros elegidos.");return;}
          const preguntas=barajar(pool).slice(0,examen?20:10);
          sesion={examen,inicio:Date.now(),limite:examen?Date.now()+minutos*60000:null,items:preguntas.map(prepararPregunta),indice:0,terminada:false};
          if(estado.quiz.activo)terminarQuiz();
          if(examen){clearInterval(cronometro);cronometro=setInterval(actualizarReloj,500);}
          mostrarPregunta();
        }
        function formatoTiempo(seg){seg=Math.max(0,Math.round(seg));return Math.floor(seg/60)+":"+String(seg%60).padStart(2,"0");}
        function actualizarReloj(){if(!sesion||sesion.terminada||!sesion.examen)return;const quedan=Math.max(0,(sesion.limite-Date.now())/1000);const n=$("study-clock");if(n)n.textContent="Tiempo restante: "+formatoTiempo(quedan);if(quedan<=0)finalizarSesion("Tiempo agotado");}
        document.addEventListener("visibilitychange",actualizarReloj);
        function mostrarPregunta(){
          limpiar(contenido);const item=sesion.items[sesion.indice],q=item.q;
          titulo((sesion.examen?"Simulacro":"Quiz")+" · "+(sesion.indice+1)+" / "+sesion.items.length);
          contenido.append(mensaje(q.seccion+" · dificultad: "+q.dificultad));
          if(sesion.examen){contenido.append(nodo("p","",{id:"study-clock",class:"study-timer","aria-live":"off"}));actualizarReloj();if(sesion.terminada)return;}
          contenido.append(nodo("p",q.pregunta));
          const zona=nodo("div",null,{class:"study-options",id:"study-options"});contenido.append(zona);
          if(item.tipo==="multiple")item.opciones.forEach((s,i)=>zona.append(boton((i+1)+". "+s,()=>responder(s),{"data-answer-index":i})));
          if(item.tipo==="vf"){
            zona.append(nodo("p","Respuesta propuesta: "+item.propuesta));
            zona.append(mensaje("¿Corresponde a la respuesta del documento para esta pregunta?"));
            [true,false].forEach((v,i)=>zona.append(boton((i+1)+". "+(v?"Verdadero":"Falso"),()=>responder(v),{"data-answer-index":i})));
          }
          if(item.tipo==="completar"){
            zona.append(nodo("p",item.plantilla));const input=nodo("input",null,{type:"text",autocomplete:"off","aria-label":"Completar el espacio en blanco",id:"study-blank"});
            const enviar=()=>{if(!input.value.trim())return;responder(input.value);};input.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();e.stopPropagation();enviar();}};zona.append(input,boton("Comprobar",enviar));
          }
          if(item.tipo==="ordenar")dibujarOrden(zona,item);
          contenido.append(nodo("div",null,{id:"study-feedback","aria-live":"polite"}));
          const next=boton(sesion.indice===sesion.items.length-1?"Finalizar":"Siguiente",siguiente,{id:"study-next"});next.disabled=true;contenido.append(next);
          contenido.append(boton("Finalizar sesión",()=>finalizarSesion("Sesión finalizada"),{style:"margin-left:8px"}));
          contenido.scrollTop=0;
        }
        function dibujarOrden(zona,item){
          const lista=nodo("ol",null,{class:"study-ordered"});zona.append(lista);
          const pintar=()=>{limpiar(lista);item.orden.forEach((texto,i)=>{const li=nodo("li");li.append(nodo("span",texto));for(const [delta,simbolo]of [[-1,"↑"],[1,"↓"]]){const b=boton(simbolo,()=>{const j=i+delta;[item.orden[i],item.orden[j]]=[item.orden[j],item.orden[i]];pintar();},{"aria-label":(delta<0?"Subir ":"Bajar ")+texto});b.disabled=i+delta<0||i+delta>=item.orden.length;li.append(b);}lista.append(li);});};pintar();zona.append(boton("Comprobar orden",()=>responder([...item.orden])));
        }
        function responder(valor){
          if(!sesion||sesion.terminada)return;const item=sesion.items[sesion.indice];if(item.correcta!==null)return;
          if(sesion.examen&&Date.now()>=sesion.limite){finalizarSesion("Tiempo agotado");return;}
          item.respuesta=valor;item.correcta=item.tipo==="multiple"?valor===item.q.respuesta:item.tipo==="completar"?canon(valor)===canon(item.solucion):item.tipo==="vf"?valor===item.esVerdad:JSON.stringify(valor)===JSON.stringify(item.q.pasos);
          $("study-options").querySelectorAll("button,input").forEach(b=>b.disabled=true);$("study-next").disabled=false;
          if(!sesion.examen){
            const feedback=$("study-feedback");feedback.className="study-feedback"+(item.correcta?"":" error");feedback.textContent=(item.correcta?"Correcto. ":"Para repasar. ")+"Respuesta del documento: "+item.q.respuesta;
            resaltarEstructura(item.q.estructuraRelacionada);
          }else $("study-feedback").textContent="Respuesta registrada.";
        }
        function resaltarEstructura(id){if(Array.isArray(id))id=id[0];if(id&&partes.has(id)){if(estado.quiz.activo)terminarQuiz();seleccionar(id);}}
        function siguiente(){if(!sesion||sesion.terminada||sesion.items[sesion.indice].correcta===null)return;if(++sesion.indice>=sesion.items.length)finalizarSesion("Sesión completada");else mostrarPregunta();}
        function finalizarSesion(motivo){
          if(!sesion||sesion.terminada)return;sesion.terminada=true;clearInterval(cronometro);cronometro=null;
          const temas={},total=sesion.examen?sesion.items.length:sesion.items.filter(x=>x.correcta!==null).length;let aciertos=0;
          for(const item of sesion.items){if(!sesion.examen&&item.correcta===null)continue;const q=item.q;const correcta=item.correcta===true;if(correcta)aciertos++;(temas[q.seccion]??={total:0,aciertos:0}).total++;if(correcta)temas[q.seccion].aciertos++;
            if(item.correcta===null)continue;const previo=progreso.errores[q.id]||{},e={intentos:Number(previo.intentos)||0,fallos:Number(previo.fallos)||0,pendiente:!!previo.pendiente};e.intentos++;if(!correcta){e.fallos++;e.pendiente=true;}else e.pendiente=false;progreso.errores[q.id]=e;}
          const resumen={aciertos,total,segundos:(Date.now()-sesion.inicio)/1000,temas,fecha:Date.now()};progreso.sesiones.push(resumen);progreso.sesiones=progreso.sesiones.slice(-50);guardar();
          limpiar(contenido);titulo(motivo);contenido.append(nodo("p",aciertos+" / "+total,{class:"study-result"}),mensaje("Tiempo: "+formatoTiempo(resumen.segundos)+" · "+Math.round(aciertos/Math.max(1,total)*100)+"%"));
          const tabla=nodo("table",null,{class:"study-table"});const cab=nodo("tr");cab.append(nodo("th","Sección"),nodo("th","Resultado"));tabla.append(cab);Object.entries(temas).forEach(([nombre,t])=>{const tr=nodo("tr");tr.append(nodo("td",nombre),nodo("td",t.aciertos+" / "+t.total));tabla.append(tr);});contenido.append(tabla);
          const reforzar=Object.entries(temas).filter(([,t])=>t.aciertos<t.total).map(([s])=>s);contenido.append(mensaje(total===0?"No se respondieron preguntas.":reforzar.length?"Temas a reforzar: "+reforzar.join("; "):"Todas las preguntas de esta sesión fueron correctas."));
          for(const item of sesion.items){const d=nodo("details",null,{class:"study-card"});d.append(nodo("summary",(item.correcta?"✓ ":item.correcta===null?"Sin responder · ":"Repasar · ")+item.q.pregunta),nodo("p","Tu respuesta: "+(item.respuesta===null?"Sin responder":Array.isArray(item.respuesta)?item.respuesta.join(" → "):typeof item.respuesta==="boolean"?(item.respuesta?"Verdadero":"Falso"):String(item.respuesta))),nodo("p","Respuesta del documento: "+item.q.respuesta));if(item.q.estructuraRelacionada)d.append(boton("Ver estructura",()=>resaltarEstructura(item.q.estructuraRelacionada)));contenido.append(d);}
          contenido.append(boton("Otra sesión",()=>{sesion=null;soloErrores=false;cambiarModo(modo==="examen"?"examen":"quiz");}),boton("Repasar errores",()=>{sesion=null;cambiarModo("errores");}));
        }
        function iniciarFlash(){soloErrores=false;titulo("Flashcards · Leitner de 3 cajas");if(faltaBanco())return;filtros();contenido.append(mensaje("Caja 1: repaso inicial; caja 2: 3 días; caja 3: 7 días. «Repasar» devuelve la tarjeta a caja 1 para revisarla en 10 minutos."));contenido.append(boton("Estudiar tarjetas pendientes",()=>{
          const ahora=Date.now(),lista=barajar(bancoFiltrado().filter(q=>Number(progreso.tarjetas[q.id]?.vence||0)<=ahora));
          if(!lista.length){avisar("No hay tarjetas pendientes con estos filtros.");return;}
          flash={lista,indice:0,volteada:false,vistas:0,sabidas:0,reforzar:[],inicio:Date.now()};mostrarFlash();}));}
        function mostrarFlash(){
          limpiar(contenido);const q=flash.lista[flash.indice];titulo("Flashcard "+(flash.indice+1)+" / "+flash.lista.length);
          const caja=Math.max(1,Math.min(3,Number(progreso.tarjetas[q.id]?.caja)||1));contenido.append(mensaje(q.seccion+" · Caja "+caja));flash.volteada=false;
          const tarjeta=boton(q.pregunta,voltear,{class:"study-flash",id:"study-flash","aria-pressed":"false"});contenido.append(tarjeta,mensaje("Pulsa la tarjeta o Espacio para mostrar la respuesta."));
          const fila=nodo("div",null,{class:"study-flex"});fila.append(boton("Lo sabía",()=>calificarFlash(true),{id:"flash-yes"}),boton("Repasar",()=>calificarFlash(false),{id:"flash-no"}));fila.querySelectorAll("button").forEach(b=>b.disabled=true);contenido.append(fila,boton("Terminar",resumenFlash));
        }
        function voltear(){if(!flash)return;flash.volteada=!flash.volteada;const q=flash.lista[flash.indice];$("study-flash").textContent=flash.volteada?q.respuesta:q.pregunta;$("study-flash").setAttribute("aria-pressed",String(flash.volteada));if(flash.volteada){$("flash-yes").disabled=false;$("flash-no").disabled=false;}}
        function calificarFlash(sabida){const q=flash.lista[flash.indice];const anterior=Math.max(1,Math.min(3,Number(progreso.tarjetas[q.id]?.caja)||1));const caja=sabida?Math.min(3,anterior+1):1;progreso.tarjetas[q.id]={caja,vence:Date.now()+(sabida?(caja===2?3:7)*86400000:600000)};guardar();flash.vistas++;if(sabida)flash.sabidas++;else flash.reforzar.push(q.seccion);if(++flash.indice===flash.lista.length)resumenFlash();else mostrarFlash();}
        function resumenFlash(){if(!flash)return;const f=flash;flash=null;limpiar(contenido);titulo("Resumen de flashcards");contenido.append(nodo("p",f.sabidas+" recordadas de "+f.vistas,{class:"study-result"}),mensaje("Tiempo: "+formatoTiempo((Date.now()-f.inicio)/1000)),mensaje(f.reforzar.length?"Temas a reforzar: "+[...new Set(f.reforzar)].join("; "):"Sin temas pendientes en las tarjetas calificadas."),mensaje("Las tarjetas marcadas «Repasar» volverán antes. La autoevaluación de recuerdo no equivale a una nota de examen."),boton("Volver a flashcards",()=>cambiarModo("flash")));}
        function panelErrores(){
          limpiar(contenido);titulo("Preguntas a reforzar");if(faltaBanco())return;
          const lista=BANCO.filter(q=>progreso.errores[q.id]?.fallos>0).sort((a,b)=>progreso.errores[b.id].fallos-progreso.errores[a.id].fallos);
          if(!lista.length){contenido.append(mensaje("Aún no hay errores registrados."));return;}
          contenido.append(boton("Repasar sólo mis errores pendientes",()=>{const pool=lista.filter(q=>progreso.errores[q.id].pendiente);soloErrores=true;modo="quiz";comenzarSesion(false,20,pool);}));
          lista.forEach(q=>{const e=progreso.errores[q.id],card=nodo("div",null,{class:"study-card"});card.append(nodo("p",q.pregunta),mensaje(e.fallos+" fallos / "+e.intentos+" intentos · "+(e.pendiente?"Pendiente de repaso":"Acertada en el último repaso")),boton("Repasar esta pregunta",()=>{modo="quiz";comenzarSesion(false,20,[q]);}));contenido.append(card);});
        }
        function autoevaluacion(){
          titulo("Autoevaluación del documento");if(AUTOEVALUACION.length!==7){contenido.append(mensaje("Las siete casillas se incorporarán literalmente al recibir el DOCX. No se han sustituido por una lista genérica.","study-alert"));return;}
          const progresoBar=nodo("progress",null,{max:7,value:0,"aria-label":"Progreso de autoevaluación"}),texto=mensaje("");contenido.append(progresoBar,texto);
          const actualizar=()=>{const n=AUTOEVALUACION.filter(x=>progreso.autoevaluacion[x.id]).length;progresoBar.value=n;texto.textContent=n+" de 7 objetivos · "+Math.round(n/7*100)+"%";};
          AUTOEVALUACION.forEach(x=>{const label=nodo("label",null,{class:"study-check"}),check=nodo("input",null,{type:"checkbox"});check.checked=!!progreso.autoevaluacion[x.id];check.onchange=()=>{progreso.autoevaluacion[x.id]=check.checked;guardar();actualizar();};label.append(check,nodo("span",x.texto));contenido.append(label);});actualizar();
        }
        function tablaEpitelios(){
          titulo("Tabla de epitelios");let tapadas=true;
          const toggle=boton("Mostrar todas las respuestas",()=>{tapadas=!tapadas;toggle.textContent=tapadas?"Mostrar todas las respuestas":"Tapar todas las respuestas";pintar();});contenido.append(toggle);
          const tabla=nodo("table",null,{class:"study-table"});contenido.append(tabla);
          function pintar(){limpiar(tabla);const h=nodo("tr");h.append(nodo("th","Estructura"),nodo("th","Epitelio"));tabla.append(h);EPITELIOS.forEach(x=>{const tr=nodo("tr"),td=nodo("td"),b=boton(tapadas?"Revelar respuesta":x.epitelio,()=>{const revelado=b.getAttribute("aria-expanded")==="true";b.textContent=revelado?"Revelar respuesta":x.epitelio;b.setAttribute("aria-expanded",String(!revelado));},{"aria-expanded":String(!tapadas),"aria-label":"Epitelio de "+x.estructura});td.append(b);tr.append(nodo("td",x.estructura),td);tabla.append(tr);});}pintar();
          contenido.append(mensaje("Tabla transcrita literalmente del apartado «Repaso rápido: epitelios que debes memorizar» del DOCX."));
        }
        function recorrido(){
          titulo("Recorrido de la orina");estudiarUrinario();urinario.comparar=false;estado.explosion=estado.explosionObjetivo=0;$("explode").value=0;$("explode-value").textContent="0%";for(const p of partes.values())p.grupo.position.copy(p.base);prepararRutaOrina();
          const rotulo=nodo("p",estacionesOrina[0].nombre,{class:"study-feedback","aria-live":"polite",id:"urine-station"});contenido.append(rotulo);
          urinario.callback=t=>rotulo.textContent=t;
          const play=boton("Iniciar",()=>{urinario.flujo=true;urinario.pausa=!urinario.pausa;if(!particulasOrina.visible)urinario.pausa=false;particulasOrina.visible=true;play.textContent=urinario.pausa?"Continuar":"Pausar";solicitarRender();},{id:"urine-play"});
          const paso=boton("Paso a paso",()=>{urinario.flujo=true;urinario.pausa=true;particulasOrina.visible=true;urinario.t=Math.min(1,(Math.max(0,urinario.estacion)+1)/(estacionesOrina.length-1));play.textContent="Continuar";actualizarOrina(0);solicitarRender();});
          const speed=nodo("select",null,{"aria-label":"Velocidad del recorrido"});[.5,1,2,4].forEach(v=>speed.append(nodo("option",v+"×",{value:v})));speed.value="1";speed.onchange=()=>urinario.velocidad=Number(speed.value);
          const fila=nodo("div",null,{class:"study-flex"});fila.append(play,paso,speed,boton("Reiniciar",()=>{urinario.t=0;urinario.estacion=-1;urinario.pausa=true;play.textContent="Continuar";actualizarOrina(0);solicitarRender();}));contenido.append(fila);
          const lista=nodo("ol");estacionesOrina.forEach((x,i)=>{const li=nodo("li");li.append(boton(x.nombre,()=>{urinario.flujo=true;urinario.pausa=true;particulasOrina.visible=true;urinario.t=i/(estacionesOrina.length-1);actualizarOrina(0);rotulo.textContent=x.nombre;if(x.id)resaltarEstructura(x.id);solicitarRender();}));lista.append(li);});contenido.append(lista,mensaje("Las partículas ilustran el trayecto; su velocidad y cantidad no representan el flujo fisiológico. Según la guía: aproximadamente 1,500 mL de orina al día, aunque la cantidad varía."));
          const orden=nodo("div",null,{class:"study-card"}),pasos=["Papila","Cáliz menor","Cáliz mayor","Pelvis renal","Uréter"];
          orden.append(nodo("h3","Ordena el tramo renal"));const item={orden:barajar(pasos)},ul=nodo("ol",null,{class:"study-ordered"});orden.append(ul);
          const pintar=()=>{limpiar(ul);item.orden.forEach((x,i)=>{const li=nodo("li");li.append(nodo("span",x));for(const d of [-1,1]){const b=boton(d<0?"↑":"↓",()=>{[item.orden[i],item.orden[i+d]]=[item.orden[i+d],item.orden[i]];pintar();},{"aria-label":(d<0?"Subir ":"Bajar ")+x});b.disabled=i+d<0||i+d>=5;li.append(b);}ul.append(li);});};pintar();const feedback=mensaje("");orden.append(boton("Comprobar orden",()=>feedback.textContent=JSON.stringify(item.orden)===JSON.stringify(pasos)?"Correcto: "+pasos.join(" → "):"Repasa el trayecto: "+pasos.join(" → ")),feedback);contenido.append(orden);
        }
        function comparador(){
          titulo("Comparador hombre / mujer");urinario.comparar=true;estudiarUrinario();
          const fila=nodo("div",null,{class:"study-flex"});for(const [sexo,label]of [["masculino","Hombre"],["femenino","Mujer"]])fila.append(boton(label,()=>{cambiarSexoUrinario(sexo);estudiarUrinario(sexo);sincronizarSexo();},{"data-sex":sexo,"aria-pressed":String(sexo===urinario.sexo)}));contenido.append(fila);
          const table=nodo("table",null,{class:"study-table"});for(const row of [["Característica","Hombre","Mujer"],["Longitud uretral","15–20 cm","3–6 cm"],["Porciones","Prostática, membranosa, esponjosa o peneana","No se divide en esas tres porciones masculinas"],["Relación vesical posterior","Recto, con estructuras interpuestas","Útero y vagina"],["Función urinaria","Conducir orina al exterior","Conducir orina al exterior"]]){const tr=nodo("tr");row.forEach((x,i)=>tr.append(nodo(i===0?"th":"td",x)));table.append(tr);}contenido.append(table,mensaje("Longitudes aproximadas conservadas de la respuesta 52 del DOCX. Las dos variantes se muestran de forma excluyente; el contexto pélvico femenino es procedural y no una segmentación del cuerpo masculino de BodyParts3D."));
        }
        function sincronizarSexo(){panelEst.querySelectorAll("[data-sex]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.sex===urinario.sexo)));}

        /* Esquemas SVG y juegos histológicos: construidos con nodos DOM. */
        function dibujoEpitelio(tipo,conTitulo=true){
          const svg=svgNodo("svg",{viewBox:"0 0 360 145",class:"study-small-svg",role:"img","aria-label":conTitulo?tipo:"Esquema de epitelio para identificar"});
          svg.append(svgNodo("path",{d:"M15 122 H345",stroke:"#bb8999","stroke-width":4}));
          const plano=tipo==="Plano simple",transicion=tipo==="Transición (urotelio)",cepillo=tipo.includes("cepillo");
          const filas=transicion?3:1,alto=plano?16:transicion?25:55;
          for(let fila=0;fila<filas;fila++)for(let i=0;i<7;i++){
            const x=20+i*46+(fila%2?7:0),y=121-(fila+1)*alto;
            svg.append(svgNodo("rect",{x,y,width:44,height:alto-2,rx:transicion&&fila===2?17:plano?7:9,fill:transicion?"#b998ca":"#dfb4b0",stroke:"#8e647a","stroke-width":1.5}));
            svg.append(svgNodo("ellipse",{cx:x+22,cy:y+alto*.58,rx:plano?9:7,ry:plano?3:7,fill:"#765482"}));
            if(cepillo)for(let j=0;j<9;j++)svg.append(svgNodo("path",{d:`M${x+j*5} ${y}v-10`,stroke:"#a36880","stroke-width":2}));
          }
          svg.append(svgNodo("text",{x:180,y:22,"text-anchor":"middle","font-size":12},conTitulo?tipo:"Luz"));return svg;
        }
        function histologia(){
          titulo("Histología del aparato urinario");const tipos=["Plano simple","Cúbico simple con borde en cepillo","Cúbico simple","Transición (urotelio)"];
          tipos.forEach(t=>{const card=nodo("div",null,{class:"study-card"});card.append(nodo("h3",t),dibujoEpitelio(t),mensaje(t.includes("cepillo")?"Túbulo proximal: el borde en cepillo corresponde a microvellosidades apicales; su luz suele verse menos definida.":t==="Cúbico simple"?"Túbulo distal: sin borde en cepillo prominente; luz más definida o más amplia en el esquema de comparación.":t==="Plano simple"?"Capa parietal de la cápsula de Bowman.":"Uréter y vejiga; epitelio especializado para distenderse."));contenido.append(card);});
          const juego=nodo("div",null,{class:"study-card"});contenido.append(juego);let aciertos=0,total=0;
          function preguntar(distal=false){limpiar(juego);const elegido=distal?barajar([tipos[1],tipos[2]])[0]:barajar(tipos)[0];juego.append(nodo("h3",distal?"¿Túbulo proximal o distal?":"¿Qué epitelio es?"),dibujoEpitelio(elegido,false));const respuesta=mensaje(""),fila=nodo("div",null,{class:"study-options"});
            const options=distal?["Proximal","Distal"]:tipos;options.forEach(x=>fila.append(boton(x,()=>{const ok=distal?(x==="Proximal"?elegido===tipos[1]:elegido===tipos[2]):x===elegido;total++;if(ok)aciertos++;respuesta.textContent=(ok?"Correcto. ":"Repasa: ")+elegido+". "+(elegido.includes("cepillo")?"El borde en cepillo identifica el proximal.":elegido===tipos[2]?"La luz más definida sin borde en cepillo orienta al distal.":"")+" Resultado: "+aciertos+" / "+total;fila.querySelectorAll("button").forEach(b=>b.disabled=true);})));juego.append(fila,respuesta,boton("Otra imagen",()=>preguntar(distal)),boton(distal?"Juego de epitelios":"Distinguir proximal/distal",()=>preguntar(!distal)));}preguntar();
          contenido.append(mensaje("Esquemas simplificados, no microfotografías. Las pistas de identificación están cotejadas con las respuestas 27 y 29 del DOCX: proximal con borde en cepillo y luz menos definida; distal sin borde en cepillo prominente y luz más amplia y clara."));
        }
        function nefrona(){
          titulo("Nefrona interactiva");
          const svg=svgNodo("svg",{viewBox:"0 0 440 560",class:"study-diagram",role:"group","aria-label":"Nefrona y procesos de formación de orina"});svgActivo=svg;
          const detalle=nodo("div",null,{class:"study-card","aria-live":"polite"});
          const info={
            glomerulo:["Glomérulo","Endotelio capilar fenestrado; forma parte de la barrera de filtración.","Filtrar agua y solutos del plasma, con restricción de células y la mayoría de proteínas."],
            bowman:["Cápsula de Bowman","Capa parietal: epitelio plano simple. Capa visceral: podocitos.","Rodear el ovillo capilar y recibir el filtrado en el espacio capsular."],
            parietal:["Capa parietal","Plano simple.","Delimitar externamente el espacio de Bowman."],
            visceral:["Capa visceral y podocitos","Podocitos, células epiteliales especializadas con pedicelos.","Participar en la barrera de filtración mediante las hendiduras entre pedicelos."],
            espacio:["Espacio de Bowman","Espacio entre las capas parietal y visceral; no es un epitelio.","Recibir el filtrado glomerular."],
            proximal:["Túbulo contorneado proximal","Cúbico simple con borde en cepillo.","Reabsorber gran parte del agua y solutos filtrados y secretar determinadas sustancias."],
            asa:["Asa de Henle","Segmentos delgados: plano simple; segmentos gruesos: cúbico simple.","Contribuir al gradiente osmótico medular y al manejo de agua y solutos."],
            distal:["Túbulo contorneado distal","Cúbico simple, sin borde en cepillo prominente.","Ajustar el transporte de electrolitos en segmentos distales."],
            conector:["Conducto conector","Epitelio simple, con tipos celulares especializados.","Conectar el túbulo distal con el sistema colector y ajustar el transporte tubular."],
            colector:["Conducto colector","Simple cúbico a cilíndrico según su nivel.","Ajustar el agua y electrolitos y conducir la orina hacia conductos papilares."]
          };
          const seleccionarSVG=id=>{const a=info[id];limpiar(detalle);detalle.append(nodo("h3",a[0]),nodo("p","Epitelio / estructura: "+a[1]),nodo("p","Función: "+a[2]));};
          function interactivo(el,id){el.setAttribute("role","button");el.setAttribute("tabindex","0");el.setAttribute("aria-label",info[id][0]);el.onclick=()=>seleccionarSVG(id);el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopPropagation();seleccionarSVG(id);}};svg.append(el);return el;}
          svg.append(svgNodo("text",{x:20,y:24,"font-size":12},"CORTEZA"),svgNodo("path",{d:"M12 240H428",stroke:"#8498a7","stroke-dasharray":"5 5"}),svgNodo("text",{x:20,y:262,"font-size":12},"MÉDULA"));
          interactivo(svgNodo("ellipse",{cx:102,cy:100,rx:61,ry:62,fill:"#e4c9a333",stroke:"#e4b58a","stroke-width":9}),"parietal");
          interactivo(svgNodo("ellipse",{cx:102,cy:100,rx:49,ry:49,fill:"transparent",stroke:"#e5cea5","stroke-width":7}),"espacio");
          const glom=svgNodo("g");for(let i=0;i<8;i++)glom.append(svgNodo("ellipse",{cx:83+(i%3)*17,cy:78+Math.floor(i/3)*17,rx:17,ry:12,fill:"none",stroke:"#cb606c","stroke-width":7}));interactivo(glom,"glomerulo");
          const podo=svgNodo("g");for(let i=0;i<7;i++){const a=i/7*Math.PI*2;podo.append(svgNodo("circle",{cx:102+Math.cos(a)*43,cy:100+Math.sin(a)*43,r:4,fill:"#be99ce"}));}interactivo(podo,"visceral");
          const paths={proximal:"M160 113 C195 65 235 80 220 120 S175 160 225 175 S300 155 270 207",asa:"M270 207 V422 Q270 492 220 492 Q180 492 180 433 V233",distal:"M180 233 C130 220 145 174 180 187 S238 235 270 211 S314 164 330 199",conector:"M330 199 Q350 220 365 212",colector:"M365 65 V518"};
          const colores={proximal:"#d6a57a",asa:"#d8bd8e",distal:"#8cbfcb",conector:"#a6caa1",colector:"#bd95c9"};
          for(const [id,d]of Object.entries(paths))interactivo(svgNodo("path",{d,fill:"none",stroke:colores[id],"stroke-width":id==="colector"?18:14,"stroke-linecap":"round"}),id);
          for(const [texto,x,y]of [["Corpúsculo",44,178],["Proximal",208,61],["Distal",269,154],["Conector",313,242],["Asa de Henle",194,527],["Colector",370,48]])svg.append(svgNodo("text",{x,y,"font-size":11},texto));
          svg.append(svgNodo("path",{d:"M32 196 V465",stroke:"#ad5869","stroke-width":8,fill:"none"}));
          const particula=svgNodo("circle",{r:6,fill:"#85f3d8",visibility:"hidden"}),movimiento=svgNodo("animateMotion",{dur:"3s",repeatCount:"indefinite"});particula.append(movimiento);svg.append(particula);
          contenido.append(svg,detalle);svg.pauseAnimations?.();seleccionarSVG("bowman");
          const procesos={filtracion:["Filtración","M95 96 Q126 92 152 113","Del capilar glomerular al espacio de Bowman."],reabsorcion:["Reabsorción","M218 151 Q120 173 32 225","Del líquido tubular hacia el intersticio y la sangre."],secrecion:["Secreción","M32 225 Q120 173 218 151","Desde la sangre/intersticio hacia la luz tubular."],excrecion:["Excreción","M365 240 V518","Eliminación final de la orina al exterior. Aquí se ilustra la salida del colector; continúa hasta el exterior en Recorrido."]};
          const fila=nodo("div",null,{class:"study-flex"}),leyenda=mensaje("Pulsa una parte para ver su epitelio y función.");
          Object.entries(procesos).forEach(([id,[nombre,path,explicacion]])=>fila.append(boton(nombre,()=>{particula.setAttribute("visibility","visible");movimiento.setAttribute("path",path);svg.unpauseAnimations?.();movimiento.beginElement?.();leyenda.textContent=nombre+": "+explicacion;animacionSVG=id;})));
          fila.append(boton("Pausar",()=>svg.pauseAnimations?.()),boton("Continuar",()=>svg.unpauseAnimations?.()));contenido.append(fila,leyenda,mensaje("Esquema funcional ampliado con información anatómica complementaria al banco literal. Los conductos colectores reciben el flujo de varias nefronas; no son una única prolongación exclusiva de una nefrona."));
          const lista=nodo("div",null,{class:"study-flex"});Object.entries(info).forEach(([id,a])=>lista.append(boton(a[0],()=>seleccionarSVG(id))));contenido.append(lista);
        }
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
        inicio();
        return {atajo,sincronizarSexo,cerrar,detener(){clearInterval(cronometro);document.removeEventListener("visibilitychange",actualizarReloj);svgActivo?.pauseAnimations?.();}};
      }

      estudioUI=iniciarEstudio();

      $("structure-count").textContent=partes.size+" estructuras · 10 sistemas";
      aplicarEstado();
      redimensionar();
      setProgress(100,"Atlas preparado.");
      $("loading").hidden=true;
      vista("front");
      solicitarRender();
    }
  