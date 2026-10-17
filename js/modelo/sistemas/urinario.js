// Funciones extraídas con referencias explícitas al contexto compartido.
export function fichaUrinaria(contextoModulo,id,nombre,latin,descripcion,funcion,ubicacion,relaciones=[],opciones={}) {
        const meta={id,nombre,latin,sistema:"urinario",region:"abdomen",descripcion,funcion,ubicacion,
          datosCuriosos:"Esquema didáctico: las proporciones de las estructuras internas se amplían para facilitar su estudio.",
          relaciones,urinaria:true,modelo:"Geometría procedural de estudio; no representa una imagen clínica.",...opciones};
        contextoModulo.catalogo.set(id,meta);
        [id,nombre,latin].forEach(n=>contextoModulo.nombres.set(contextoModulo.normalizar(n),id));
        return contextoModulo.crearParte(id);
      }
export function puntoParte(contextoModulo,id) {
        const p=contextoModulo.partes.get(id);
        return p ? new contextoModulo.T.Box3().setFromObject(p.grupo).getCenter(new contextoModulo.T.Vector3()) : new contextoModulo.T.Vector3();
      }
export function tuboUrinario(contextoModulo,p,puntos,radio,color) {const curva=new contextoModulo.T.CatmullRomCurve3(puntos.map(a=>new contextoModulo.T.Vector3(...a)));return contextoModulo.agregarMalla(p,new contextoModulo.T.TubeGeometry(curva,Math.max(48,puntos.length*12),radio,16,false),[1,1,1],[0,0,0],color);}
export function agregarAnatomiaUrinaria(contextoModulo) {
        for(const p of contextoModulo.partes.values()) if(p.meta.sistema==="urinario") p.meta.urinaria=true;
        for(const [lado,suf,signo] of [["derecho","derecha",-1],["izquierdo","izquierda",1]]) {
          const idR="rinon_"+lado;
          const ri=contextoModulo.partes.get(idR),c=contextoModulo.puntoParte(idR);
          const dim=new contextoModulo.T.Box3().setFromObject(ri.grupo).getSize(new contextoModulo.T.Vector3());
          const sx=dim.x*.48,sy=dim.y*.48,sz=dim.z*.37;
          const ix=id=>id+"_"+suf;
          const interno=(id,nombre,latin,desc,func,rel=[])=>{
            const p=contextoModulo.fichaUrinaria(ix(id),nombre+" · riñón "+lado,latin,desc,func,"Interior del riñón "+lado,rel,
              {padre:idR,interno:true});
            p.grupo.position.copy(c);return p;
          };
          // Corteza: anillo tridimensional con un espacio central para el seno renal.
          const forma=new contextoModulo.T.Shape();
          for(let i=0;i<=64;i++) {
            const a=i/64*Math.PI*2;
            const x=Math.cos(a),y=Math.sin(a);
            const hendidura=1-.28*Math.exp(-Math.pow((x+signo)/.5,2))*Math.exp(-y*y*8);
            const px=x*sx*hendidura,py=y*sy;
            if(i===0)forma.moveTo(px,py);else forma.lineTo(px,py);
          }
          const hueco=new contextoModulo.T.Path();hueco.absellipse(0,0,sx*.68,sy*.74,0,Math.PI*2,true,0);forma.holes.push(hueco);
          let p=interno("corteza","Corteza renal","Cortex renalis","Región periférica del parénquima renal.",
            "Contiene corpúsculos renales y segmentos tubulares que participan en filtración y transporte.",[idR,ix("medula")]);
          const geo=new contextoModulo.T.ExtrudeGeometry(forma,{depth:sz*1.4,bevelEnabled:false,curveSegments:36});
          contextoModulo.agregarMalla(p,geo,[1,1,1],[0,0,-sz*.7],"#bd7760");
          p=interno("medula","Médula renal","Medulla renalis","Región interna organizada en pirámides renales.",
            "Aloja asas y conductos que participan en la concentración y conducción de la orina.",[ix("piramides"),ix("corteza")]);
          contextoModulo.ovalo(p,[0,0,-sz*.5],[sx*.65,sy*.75,sz*.35],"#a05d77");
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
            const base=new contextoModulo.T.Vector3(signo*Math.cos(a)*sx*.7,Math.sin(a)*sy*.82,-sz*.05);
            const vertice=new contextoModulo.T.Vector3(-signo*sx*.12,Math.sin(a)*sy*.38,-sz*.2);
            const altura=base.distanceTo(vertice);
            const cono=new contextoModulo.T.ConeGeometry(sx*.31,altura,20);
            const m=contextoModulo.agregarMalla(pir,cono,[1,1,1],base.clone().add(vertice).multiplyScalar(.5).toArray(),"#ae5e63");
            m.quaternion.setFromUnitVectors(new contextoModulo.T.Vector3(0,1,0),vertice.clone().sub(base).normalize());
            contextoModulo.ovalo(pap,vertice.toArray(),[sx*.1,sy*.065,sz*.22],"#f2b588");
            const fin=new contextoModulo.T.Vector3(-signo*sx*.4,Math.sin(a)*sy*.25,-sz*.2);
            contextoModulo.tuboUrinario(menores,[vertice.toArray(),fin.toArray()],sx*.07,"#e4c99b");
            contextoModulo.tuboUrinario(mayores,[fin.toArray(),[-signo*sx*.4,0,-sz*.2]],sx*.095,"#d9bd83");
            if(i<4) {
              const aa=a+.28;
              contextoModulo.tuboUrinario(col,[[signo*Math.cos(aa)*sx*.85,Math.sin(aa)*sy*.9,sz*.18],[-signo*sx*.05,Math.sin(aa)*sy*.42,sz*.18]],sx*.07,"#d28d73");
            }
          }
          p=interno("pelvis_renal","Pelvis renal","Pelvis renalis","Cavidad en forma de embudo que continúa con el uréter.",
            "Reunir la orina de los cálices mayores y entregarla al uréter.",[ix("calices_mayores"),"ureter_"+lado]);
          contextoModulo.ovalo(p,[-signo*sx*.4,0,-sz*.2],[sx*.22,sy*.28,sz*.4],"#dec087");
          contextoModulo.tuboUrinario(p,[[-signo*sx*.4,0,-sz*.2],[-signo*sx*.7,-sy*.35,-sz*.2]],sx*.09,"#dec087");
          p=interno("hilio","Hilio renal","Hilum renale","Depresión del borde medial por donde pasan vasos y pelvis renal.",
            "Permitir el paso de las estructuras del pedículo renal.",[ix("arteria_renal"),ix("vena_renal"),ix("pelvis_renal")]);
          const aro=contextoModulo.agregarMalla(p,new contextoModulo.T.TorusGeometry(1,.12,8,32),[sy*.32,sz*.7,sx*.2],[-signo*sx*.8,0,0],"#d0b69b");aro.rotation.y=Math.PI/2;
          for(const [tipo,color,z] of [["arteria","#c64b56",-.06],["vena","#5d8dc0",.07]]) {
            p=contextoModulo.fichaUrinaria(ix(tipo+"_renal"),(tipo==="arteria"?"Arteria":"Vena")+" renal "+suf,
              tipo==="arteria"?"Arteria renalis":"Vena renalis",tipo==="arteria"?"Rama de la aorta abdominal que lleva sangre al riñón.":"Vaso que drena sangre renal hacia la vena cava inferior.",
              tipo==="arteria"?"Aportar sangre al lecho vascular renal.":"Retornar la sangre del riñón a la circulación venosa.","Pedículo renal "+lado,[idR,ix("hilio")],{sistema:"circulatorio",padre:idR});
            contextoModulo.tuboUrinario(p,[[0,c.y+.04,c.z+z],[c.x-signo*sx,c.y,c.z+z],[c.x-signo*sx*.55,c.y,c.z+z]],.028,color);
          }
          ri.meta.relaciones=[ix("corteza"),ix("medula"),ix("pelvis_renal"),ix("hilio"),"ureter_"+lado];
          const vej=contextoModulo.puntoParte("vejiga");
          const inicio=c.clone().add(new contextoModulo.T.Vector3(-signo*sx*.65,-sy*.35,0));
          const cambio=new contextoModulo.T.Vector3(c.x*.75,vej.y+.45,c.z-.05),fin=vej.clone().add(new contextoModulo.T.Vector3(signo*.14,.1,-.03));
          for(const [por,n,desde,hasta] of [["abdominal","abdominal",inicio,cambio],["pelvica","pélvica",cambio,fin]]) {
            p=contextoModulo.fichaUrinaria("ureter_"+lado+"_"+por,"Uréter "+lado+" · porción "+n,"Pars "+(por==="abdominal"?"abdominalis":"pelvica")+" ureteris",
              "Segmento "+n+" del uréter "+lado+".","Conducir orina por peristaltismo hacia la vejiga.",por==="abdominal"?"Retroperitoneo, por delante del psoas mayor.":"Pared lateral de la pelvis hacia la vejiga.",
              ["ureter_"+lado,"psoas_"+lado,"vejiga"],{padre:"ureter_"+lado,region:por==="abdominal"?"abdomen":"pelvis"});
            contextoModulo.tuboUrinario(p,[desde.toArray(),desde.clone().lerp(hasta,.5).add(new contextoModulo.T.Vector3(signo*.035,0,.035)).toArray(),hasta.toArray()],.018,"#dcb783");
          }
          p=contextoModulo.fichaUrinaria("psoas_"+lado,"Psoas mayor "+lado,"Musculus psoas major","Músculo de la pared abdominal posterior relacionado con el uréter abdominal.",
            "Flexionar la cadera y contribuir a estabilizar la columna lumbar.","A los lados de la columna lumbar; el uréter desciende por delante.",["ureter_"+lado+"_abdominal"],{sistema:"muscular",contextoUrinario:true});
          const m=contextoModulo.ovalo(p,[signo*.26,(inicio.y+fin.y)/2,c.z-.16],[.13,(inicio.y-fin.y)*.56,.11],"#a85466");m.rotation.z=signo*.12;
        }
        const vb=contextoModulo.puntoParte("vejiga"),tam=new contextoModulo.T.Box3().setFromObject(contextoModulo.partes.get("vejiga").grupo).getSize(new contextoModulo.T.Vector3());
        const interior=(id,nombre,latin,desc,func,rel=[])=>{
          const p=contextoModulo.fichaUrinaria(id,nombre,latin,desc,func,"Vejiga urinaria",rel,{padre:"vejiga",region:"pelvis",interno:true});p.grupo.position.copy(vb);return p;
        };
        let p=interior("detrusor","Músculo detrusor","Musculus detrusor vesicae","Músculo liso de la pared de la vejiga.","Contraerse durante la micción para expulsar la orina.",["vejiga","trigono"]);
        for(let i=0;i<14;i++) {
          const a=i/14*Math.PI;
          const pts=Array.from({length:33},(_,j)=>{const t=j/32*Math.PI*2;return [Math.sin(t)*tam.x*.43*Math.cos(a),Math.cos(t)*tam.y*.43,Math.sin(t)*tam.z*.43*Math.sin(a)];});
          contextoModulo.tuboUrinario(p,pts,.008,"#b87879");
        }
        p=interior("trigono","Trígono vesical","Trigonum vesicae","Área triangular delimitada por los dos orificios ureterales y el orificio uretral interno.","Delimitar la zona de entrada ureteral y salida uretral.",["orificio_ureteral_derecho","orificio_ureteral_izquierdo","orificio_uretral_interno"]);
        const tri=new contextoModulo.T.Shape();tri.moveTo(-.14,.07);tri.lineTo(.14,.07);tri.lineTo(0,-.11);tri.closePath();
        contextoModulo.agregarMalla(p,new contextoModulo.T.ExtrudeGeometry(tri,{depth:.018,bevelEnabled:false}),[1,1,1],[0,0,-.035],"#e4aaa2");
        for(const [id,nombre,x,y] of [["orificio_ureteral_derecho","Orificio ureteral derecho",-.14,.07],["orificio_ureteral_izquierdo","Orificio ureteral izquierdo",.14,.07],["orificio_uretral_interno","Orificio uretral interno",0,-.11]]) {
          p=interior(id,nombre,id==="orificio_uretral_interno"?"Ostium urethrae internum":"Ostium ureteris",id==="orificio_uretral_interno"?"Abertura de la vejiga hacia la uretra.":"Abertura de un uréter en la vejiga.","Permitir el paso de la orina.",["trigono","vejiga"]);
          contextoModulo.agregarMalla(p,new contextoModulo.T.TorusGeometry(.025,.008,8,24),[1,1,1],[x,y,-.01],"#f1d39a");
        }
        const salida=vb.clone().add(new contextoModulo.T.Vector3(0,-tam.y*.4,.02));
        const rutas={
          masculino:[salida.toArray(),[0,salida.y-.18,.03],[0,salida.y-.32,.02],[0,salida.y-.52,.12],[0,salida.y-.61,.44],[0,salida.y-.63,.79]],
          femenino:[salida.toArray(),[0,salida.y-.13,.09],[0,salida.y-.26,.16]]
        };
        for(const sexo of ["masculino","femenino"]) {
          p=contextoModulo.fichaUrinaria("uretra_"+sexo,"Uretra "+(sexo==="masculino"?"masculina":"femenina"),sexo==="masculino"?"Urethra masculina":"Urethra feminina",
            "Conducto de salida de la orina. Longitud aproximada según la guía del laboratorio 11: "+(sexo==="masculino"?"15–20 cm.":"3–6 cm."),
            "Conducir la orina desde la vejiga hasta el exterior.","Desde el cuello vesical hasta el orificio uretral externo.",
            sexo==="masculino"?["uretra_prostatica","uretra_membranosa","uretra_esponjosa"]:["vejiga","vagina_contexto"],{region:"pelvis",sexo});
          contextoModulo.tuboUrinario(p,rutas[sexo],.023,"#d6b784");
        }
        for(const [id,nombre,latin,desc,pts] of [
          ["uretra_prostatica","Uretra prostática","Pars prostatica urethrae","Porción que atraviesa la próstata.",rutas.masculino.slice(0,2)],
          ["uretra_membranosa","Uretra membranosa","Pars membranacea urethrae","Porción corta que atraviesa la región del esfínter uretral externo.",rutas.masculino.slice(1,3)],
          ["uretra_esponjosa","Uretra esponjosa o peneana","Pars spongiosa urethrae","Porción que recorre el cuerpo esponjoso del pene.",rutas.masculino.slice(2)]
        ]) {
          p=contextoModulo.fichaUrinaria(id,nombre,latin,desc,"Conducir la orina hacia el exterior.","Uretra masculina",["uretra_masculino","vejiga"],{region:"pelvis",sexo:"masculino",padre:"uretra_masculino"});
          contextoModulo.tuboUrinario(p,pts,.027,id==="uretra_prostatica"?"#d0a76f":id==="uretra_membranosa"?"#a5c2cb":"#d99f91");
        }
        // Relaciones pélvicas: sólo se muestran al abrir el comparador.
        for(const [id,nombre,latin,sexo,pos,escala,desc] of [
          ["recto_contexto","Recto: relación con la vejiga masculina","Rectum","masculino",[0,vb.y,-.31],[.12,.35,.1],"En el varón, el recto se encuentra posterior a la vejiga, con estructuras interpuestas."],
          ["utero_contexto","Útero: relación con la vejiga","Uterus","femenino",[0,vb.y+.15,-.26],[.17,.21,.1],"En la mujer, el útero se sitúa posterior y superior a la vejiga."],
          ["vagina_contexto","Vagina: relación con la vejiga","Vagina","femenino",[0,vb.y-.13,-.19],[.1,.24,.07],"La vejiga y la uretra se sitúan por delante de la vagina."]
        ]) {p=contextoModulo.fichaUrinaria(id,nombre,latin,desc,"Servir como referencia de relación topográfica en este esquema.","Pelvis",["vejiga"],{sexo,region:"pelvis",contexto:true});contextoModulo.ovalo(p,pos,escala,"#a97fa6");}
        contextoModulo.partes.get("vejiga").meta.relaciones=["trigono","detrusor","orificio_uretral_interno","uretra_masculino","uretra_femenino"];
        const g=new contextoModulo.T.SphereGeometry(.018,8,6),m=new contextoModulo.T.MeshBasicMaterial({color:0x8ffff0,transparent:true,opacity:.95,depthTest:false,depthWrite:false});
        contextoModulo.particulasOrina=new contextoModulo.T.InstancedMesh(g,m,28);contextoModulo.particulasOrina.visible=false;contextoModulo.particulasOrina.frustumCulled=false;contextoModulo.particulasOrina.renderOrder=30;contextoModulo.escena.add(contextoModulo.particulasOrina);
        contextoModulo.prepararRutaOrina();
      }
export function estudiarUrinario(contextoModulo,sexo=contextoModulo.urinario.sexo) {
        if(contextoModulo.estado.quiz.activo)contextoModulo.terminarQuiz();
        contextoModulo.urinario.solo=true;contextoModulo.urinario.sexo=sexo;
        contextoModulo.estado.aislado=null;contextoModulo.estado.region="todas";contextoModulo.estado.ocultos.clear();contextoModulo.$("region").value="todas";
        for(const id of ["urinario","circulatorio","muscular"])contextoModulo.SISTEMAS[id].visible=true;
        contextoModulo.sincronizarCapas();contextoModulo.aplicarEstado();
        const box=new contextoModulo.T.Box3();for(const p of contextoModulo.partes.values())if(p.grupo.visible)box.expandByObject(p.grupo);
        const c=box.getCenter(new contextoModulo.T.Vector3());contextoModulo.moverCamara(c.clone().add(new contextoModulo.T.Vector3(0,.15,6)),c);
      }
export function cambiarSexoUrinario(contextoModulo,sexo){contextoModulo.urinario.sexo=sexo;contextoModulo.prepararRutaOrina();contextoModulo.aplicarEstado();contextoModulo.estudioUI?.sincronizarSexo?.();}
