// Funciones extraídas con referencias explícitas al contexto compartido.
export function crearProcedural(contextoModulo) {
        let p;
        p=contextoModulo.crearParte("piel");
        contextoModulo.ovalo(p,[0,9,0],[.65,.85,.6]);
        contextoModulo.ovalo(p,[0,6.55,0],[1.2,1.55,.65]);
        contextoModulo.ovalo(p,[0,4.75,0],[.95,.85,.58]);
        contextoModulo.segmento(p,[0,8.3,0],[0,7.7,0],.34);
        contextoModulo.miembros(p,[
          [[1,7.45,0],[1.75,5.75,0]],
          [[1.75,5.75,0],[2.03,4.08,.1]],
          [[.55,4.3,0],[.6,2.45,0]],
          [[.6,2.45,0],[.6,.45,0]]
        ],.3);
        for(const s of [-1,1]) {
          contextoModulo.ovalo(p,[s*2.05,3.8,.12],[.18,.35,.12]);
          contextoModulo.ovalo(p,[s*.6,.25,.2],[.27,.2,.5]);
        }

        p=contextoModulo.crearParte("deltoides");
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*1.15,7.28,0],[.38,.5,.38]);
        p=contextoModulo.crearParte("biceps");
        for(const s of [-1,1]) {
          const m=contextoModulo.ovalo(p,[s*1.48,6.5,.16],[.24,.65,.22]);
          m.rotation.z=s*.32;
        }
        p=contextoModulo.crearParte("triceps");
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*1.47,6.5,-.22],[.24,.62,.23]);
        p=contextoModulo.crearParte("pectoral");
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.51,7.03,.54],[.58,.45,.16]);
        p=contextoModulo.crearParte("recto_abdominal");
        for(const s of [-1,1]) for(let i=0;i<4;i++)
          contextoModulo.ovalo(p,[s*.24,5.98-i*.33,.56],[.21,.16,.1]);
        p=contextoModulo.crearParte("gluteo");
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.47,4.35,-.48],[.5,.55,.25]);
        p=contextoModulo.crearParte("cuadriceps");
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.6,3.35,.16],[.35,.9,.3]);
        p=contextoModulo.crearParte("gastrocnemio");
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.6,1.65,-.18],[.26,.66,.27]);

        p=contextoModulo.crearParte("craneo",[0,9,0]);
        contextoModulo.ovalo(p,[0,.1,-.03],[.61,.72,.55]);
        contextoModulo.ovalo(p,[0,-.38,.17],[.43,.3,.33]);
        // Órbitas oscuras como referencias de orientación, no mallas seleccionables separadas.
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.23,-.12,.5],[.15,.14,.055],"#514b47");
        p=contextoModulo.crearParte("mandibula",[0,8.48,.1]);
        contextoModulo.tubo(p,[[-.39,.25,0],[-.4,-.02,.19],[0,-.14,.35],[.4,-.02,.19],[.39,.25,0]],.065);
        p=contextoModulo.crearParte("claviculas");
        contextoModulo.miembros(p,[[[.08,7.65,.5],[1.13,7.5,.12]]],.065);
        p=contextoModulo.crearParte("esternon",[0,6.8,.62]);
        contextoModulo.ovalo(p,[0,0,0],[.13,.68,.065]);
        p=contextoModulo.crearParte("costillas",[0,6.8,0]);
        for(let i=0;i<9;i++) {
          const ancho=.65+Math.sin((i/10)*Math.PI)*.45;
          const y=.72-i*.21;
          const puntos=[];
          for(let k=0;k<24;k++) {
            const a=k/24*Math.PI*2;
            puntos.push([Math.cos(a)*ancho,y+.13*Math.sin(a),Math.sin(a)*.6]);
          }
          contextoModulo.tubo(p,puntos,.035,undefined,true);
        }
        p=contextoModulo.crearParte("columna",[0,6,-.5]);
        for(let i=0;i<22;i++) {
          contextoModulo.ovalo(p,[0,2.05-i*.175,0],[.15,.085,.13]);
          contextoModulo.segmento(p,[0,2.05-i*.175,0],[0,2.05-i*.175,-.17],.035);
        }
        p=contextoModulo.crearParte("humeros");
        contextoModulo.miembros(p,[[[1.1,7.38,0],[1.73,5.8,0]]],.105);
        p=contextoModulo.crearParte("radios");
        contextoModulo.miembros(p,[[[1.82,5.78,.02],[2.13,4.12,.08]]],.065);
        p=contextoModulo.crearParte("cubitos");
        contextoModulo.miembros(p,[[[1.66,5.8,-.04],[1.98,4.12,.02]]],.06);
        p=contextoModulo.crearParte("pelvis_osea",[0,4.55,0]);
        for(const s of [-1,1]) {
          const m=contextoModulo.ovalo(p,[s*.64,0,-.1],[.4,.57,.21]);
          m.rotation.z=-s*.25;
          contextoModulo.tubo(p,[[s*.78,-.2,0],[s*.58,-.53,.27],[s*.17,-.45,.36],[s*.1,-.08,.25]],.095);
        }
        p=contextoModulo.crearParte("femures");
        contextoModulo.miembros(p,[[[.57,4.18,0],[.6,2.48,0]]],.125);
        p=contextoModulo.crearParte("rotulas");
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.6,2.43,.17],[.15,.19,.09]);
        p=contextoModulo.crearParte("tibias");
        contextoModulo.miembros(p,[[[.55,2.3,0],[.55,.48,0]]],.095);
        p=contextoModulo.crearParte("perones");
        contextoModulo.miembros(p,[[[.76,2.28,-.02],[.76,.43,-.02]]],.045);

        p=contextoModulo.crearParte("corazon",[.18,6.38,.3]);
        const h=contextoModulo.ovalo(p,[0,0,0],[.35,.46,.29],"#c54860");
        h.rotation.z=-.35;
        contextoModulo.ovalo(p,[-.17,.22,0],[.22,.23,.21],"#d2697b");
        contextoModulo.tubo(p,[[0,.3,0],[.02,.65,0],[-.22,.72,-.03]],.08,"#e66569");
        contextoModulo.tubo(p,[[.2,.25,.22],[.18,-.08,.27],[0,-.32,.18]],.022,"#efb18d");

        p=contextoModulo.crearParte("aorta");
        contextoModulo.tubo(p,[[.15,6.62,.2],[.1,7,.14],[-.23,7.05,-.02],[-.3,6.6,-.15],[-.24,5.5,-.2],[-.2,4.6,-.23]],.085,"#dd4c53");
        contextoModulo.miembros(p,[[[.2,4.6,-.23],[.53,3.6,-.15]]],.045,"#dd4c53");
        p=contextoModulo.crearParte("vena_cava");
        contextoModulo.tubo(p,[[-.16,7.6,-.1],[-.2,6.7,-.08],[-.13,6.4,-.05]],.09,"#5b8cc5");
        contextoModulo.tubo(p,[[-.13,6.25,-.08],[-.08,5.5,-.15],[-.06,4.5,-.14]],.095,"#5b8cc5");

        p=contextoModulo.crearParte("cerebro",[0,9.17,.02]);
        for(const s of [-1,1]) {
          contextoModulo.ovalo(p,[s*.235,0,0],[.28,.47,.43],"#edbc9e");
          for(let i=0;i<7;i++) {
            const y=-.28+i*.085;
            contextoModulo.tubo(p,[[s*.07,y,.35],[s*.24,y+.04,.4],[s*.43,y,.24]],.024,"#c98d83");
          }
        }
        p=contextoModulo.crearParte("cerebelo",[0,8.76,-.27]);
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.19,0,0],[.22,.21,.21],"#d6ad86");
        p=contextoModulo.crearParte("tronco",[0,8.55,-.13]);
        contextoModulo.ovalo(p,[0,0,0],[.12,.33,.13]);
        p=contextoModulo.crearParte("medula",[0,6.85,-.37]);
        contextoModulo.segmento(p,[0,1.45,0],[0,-1.65,0],.045);
        p=contextoModulo.crearParte("nervios");
        contextoModulo.miembros(p,[
          [[.08,7.5,-.25],[1.1,7.32,-.18]],
          [[1.1,7.32,-.18],[1.8,5.72,-.12]],
          [[1.8,5.72,-.12],[2.05,4.2,.1]],
          [[.08,5.05,-.35],[.52,4.05,-.2]],
          [[.52,4.05,-.2],[.65,2.4,-.14]],
          [[.65,2.4,-.14],[.64,.5,-.1]]
        ],.027);

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

        p=contextoModulo.crearParte("rinon_derecho",[-.65,5.26,-.34]);
        const rd=contextoModulo.ovalo(p,[0,0,0],[.22,.34,.18]); rd.rotation.z=-.22;
        p=contextoModulo.crearParte("rinon_izquierdo",[.65,5.39,-.34]);
        const ri=contextoModulo.ovalo(p,[0,0,0],[.22,.34,.18]); ri.rotation.z=.22;
        p=contextoModulo.crearParte("ureter_derecho");
        contextoModulo.tubo(p,[[-.52,5.1,-.25],[-.45,4.6,-.2],[-.28,3.91,.08]],.028,"#dbbf8b");
        p=contextoModulo.crearParte("ureter_izquierdo");
        contextoModulo.tubo(p,[[.52,5.23,-.25],[.45,4.6,-.2],[.28,3.91,.08]],.028,"#dbbf8b");
        p=contextoModulo.crearParte("vejiga",[0,3.85,.28]);
        contextoModulo.ovalo(p,[0,0,0],[.3,.28,.22],"#c7a28d");

        p=contextoModulo.crearParte("bazo",[.87,5.56,-.11]);
        const bz=contextoModulo.ovalo(p,[0,0,0],[.17,.33,.18],"#8c5e89"); bz.rotation.z=-.2;
        p=contextoModulo.crearParte("timo",[0,7.13,.43]);
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.095,0,0],[.115,.24,.075]);
        p=contextoModulo.crearParte("ganglios");
        for(const s of [-1,1]) {
          for(let i=0;i<4;i++) {
            contextoModulo.ovalo(p,[s*(.28+i*.06),8.07-i*.11,.04],[.045,.06,.04]);
            contextoModulo.ovalo(p,[s*(1.01+i*.025),7.1-i*.09,.02],[.05,.065,.05]);
            contextoModulo.ovalo(p,[s*(.3+i*.12),4.2-i*.05,.22],[.05,.06,.05]);
          }
        }
        p=contextoModulo.crearParte("hipofisis",[0,8.87,.08]);
        contextoModulo.ovalo(p,[0,0,0],[.085,.065,.07]);
        contextoModulo.segmento(p,[0,.03,0],[0,.15,0],.023);
        p=contextoModulo.crearParte("tiroides",[0,7.92,.29]);
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.14,0,0],[.095,.18,.07]);
        contextoModulo.segmento(p,[-.1,-.01,0],[.1,-.01,0],.035);
        p=contextoModulo.crearParte("suprarrenales");
        for(const s of [-1,1]) contextoModulo.ovalo(p,[s*.64,s<0?5.66:5.79,-.33],[.16,.09,.12]);
      }
