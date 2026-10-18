# Atlas anatómico 3D y estudio del aparato urinario

Aplicación modular sin compilación; Three.js 0.180.0 es la única biblioteca de ejecución. Conserva la referencia monolítica en `referencia/`.

## Ejecutar

Ejecuta `python iniciar.py` y abre la dirección indicada. También sirve `python -m http.server 8000`. HTTP es necesario para módulos ES, JSON, binarios y posteriormente service workers; abrir el HTML mediante doble clic no basta.

Sube **toda la carpeta** al alojamiento estático; no solo index.html. Las rutas son relativas y compatibles con GitHub Pages bajo `/atlas/`.

## Estructura

- `index.html`, `css/`: interfaz y estilos.
- `js/main.js`: entrada y error de arranque.
- `js/core/`: coordinación, estado, escena, cámara, render, almacenamiento y eventos.
- `js/modelo/`: cargadores, primitivas, superficies integradas y anatomía procedural.
- `js/ui/`: controles, selección, árbol, buscador, temas y paneles.
- `js/estudio/`: modos y motores de estudio.
- `js/plugins/registro.js`: registro de modos.
- `data/`: catálogo, preguntas literales, tablas y configuración.
- `assets/atlas-mesh.bin`: posiciones Int16 e índices Uint32; `data/mesh-manifest.json` describe offsets.
- `vendor/three/`: copia de Three.js 0.180.0 y addons necesarios, con licencia.

El contexto compartido usa referencias explícitas para mantener un único estado. `core/aplicacion.js` compone los módulos; no exporta estado en window. Los modos históricos conservan una capa de adaptación de sus funciones originales.

## Añadir un modo

Crea un módulo que exporte por defecto `{id, titulo, montar(ctx), desmontar()}`. `montar` recibe el contexto de estudio: `contenido`, ayudantes DOM, progreso y acceso al atlas. `desmontar` debe retirar recursos y listeners propios. Añade una línea `export {default as miModo} from '../estudio/mi-modo.js';` al registro. Emplea textContent para todos los datos y textos de usuario.

## Añadir un sistema anatómico

Añade su identificador, nombre, color, opacidad y visibilidad a `data/sistemas.json`. Añade estructuras con IDs estables al catálogo. Implementa su geometría mediante las primitivas y registra cada malla con `userData.parte`, `partes` y `mallas`; coordina su creación antes del cálculo de centros en `core/aplicacion.js`. Conserva unidades y relaciones. Para GLB configura `data/modelos.json`: no se distribuyen los GLB de ejemplo. Verifica escala, alias y alineación de los interiores urinarios.

## Three.js sin red

Ejecuta `python scripts/usar-vendor.py` para utilizar los archivos distribuidos en vendor. Para volver a jsDelivr, `python scripts/usar-vendor.py --cdn`. La versión no cambia. Las fuentes de Google son opcionales y tienen fuente de sistema de respaldo.

## Verificación

Consulta `pruebas/no-regresion.md`. La referencia y banco original permiten comparar las extracciones. El ZIP monolítico histórico no representa esta versión modular.

## Contenido y licencia

53 preguntas literales del documento de laboratorio, siete secciones, autoevaluación y tabla de epitelios. Se conserva la ambigüedad entre «cuatro órganos» y la enumeración de dos riñones, dos uréteres, vejiga y uretra. Consulta `data/observaciones.json`.

Geometría: BodyParts3D, © The Database Center for Life Science. Adaptaciones bajo CC BY-SA 2.1 Japan: https://creativecommons.org/licenses/by-sa/2.1/jp/deed.es. Las atribuciones originales permanecen en la interfaz y referencia. Three.js conserva su licencia MIT en vendor.

**Contenido educativo. No sustituye el consejo médico profesional.**

## Pistas y mnemotecnias

Desde una ficha pulsa **Notas y repasar luego**, o abre el modo Notas. Cada estructura conserva notas, mnemotecnia, pista opcional y marcador. El examen práctico ofrece la pista escrita para la estructura señalada, únicamente cuando existe; no genera datos médicos. Estos campos están incluidos en la exportación de progreso.

## Funciones de estudio añadidas

- **Flashcards:** elige Leitner o SM-2. Los intervalos se guardan por separado; SM-2 ofrece Difícil, Bien y Fácil, y Repasar reinicia la secuencia.
- **Estadísticas:** aciertos por sección, gráfico de los últimos siete días, últimas sesiones, racha según la fecha local y meta diaria.
- **Importar / exportar:** progreso y banco en JSON o CSV; TSV para Anki. Primero exporta tu progreso antes de reemplazarlo. Las imágenes de oclusión están en IndexedDB y no se incluyen en ese JSON.
- **Mis bancos:** JSON, CSV con cabeceras `pregunta,respuesta,seccion`, o líneas `pregunta | respuesta | sección`. Valida y previsualiza antes de importar. Las preguntas propias tienen IDs separados y nunca reemplazan las 53 originales.
- **Notas y marcadores:** notas, mnemotecnias, pistas y Repasar luego por estructura.
- **Oclusión:** PNG/JPEG/WebP hasta 8 MB y 24 megapíxeles, almacenados únicamente en el navegador. Dibuja máscaras o introdúcelas con teclado; en estudio, pulsa cada máscara para revelar. Si IndexedDB falla se usa memoria temporal y se avisa. Borrar los datos del navegador elimina estas imágenes.
- **Examen práctico:** identifica la estructura marcada. Acepta tildes, mayúsculas y erratas limitadas, y presenta un resumen. Las pistas solo son las escritas por el usuario.
- **Enfoque y voz:** pantalla completa cuando el navegador la admite, modo enfoque reversible y lectura mediante las voces disponibles del dispositivo/navegador.
- **Fisiología 3D:** peristaltismo y ciclo de llenado/vaciado con pliegues de mucosa. Son esquemas cualitativos identificados como contenido adicional, sin medidas clínicas.

Las superficies de uréteres y vejiga y los conductos uretrales tienen mayor detalle procedural. Los interiores renales mantienen selección, corte y relaciones. Hay cuatro preguntas de orden derivadas de respuestas originales, con `fuenteId`; el banco literal no se modifica.

## Instalar y usar sin conexión

La distribución final utiliza Three.js local. Abre el atlas en HTTPS o localhost y espera a **Disponible sin conexión**. El service worker prepara toda la aplicación y las mallas; la primera descarga puede tardar. Después puedes recargar sin red. Instala desde la opción del navegador **Añadir a pantalla de inicio**; en iPhone puede hacerse desde Compartir en Safari si el navegador actual no ofrece esa opción.

Las actualizaciones muestran **Actualizar atlas** y se activan al pulsarlo, no durante una sesión automáticamente. Tras cambiar archivos de ejecución, ejecuta `python scripts/generar-sw.py`. No cambies a CDN si necesitas que la copia completa funcione sin red. Las fuentes de Google tienen respaldo de sistema y no son necesarias para estudiar sin conexión.

La disponibilidad sin conexión depende del almacenamiento del navegador: el sistema puede eliminar cachés por falta de espacio. Exporta periódicamente el progreso importante. No se suben notas, bancos ni láminas a servidores.

## Ejecutar las pruebas

La aplicación no necesita Node ni Playwright. Solo las comprobaciones de desarrollo los utilizan:

1. `node pruebas/algoritmos.mjs` comprueba SM-2, CSV/JSON, validaciones, tolerancia y estadísticas.
2. Sirve esta carpeta mediante `python iniciar.py`.
3. Con Playwright Python 1.62.0 y Chromium disponibles, ejecuta los scripts de `pruebas/` definiendo `ATLAS_TEST_URL=http://127.0.0.1:8000/` si sirves desde la raíz del proyecto. Por defecto prueban bajo `/atlas/`.
4. Los scripts usan `/usr/bin/chromium`; adapta esa ruta si tu instalación de pruebas usa otra. No afecta a la aplicación.

Pruebas automatizadas: `regresion.py`, `modos-nuevos.py`, `movil.py`, `renal.py` y `offline.py`. Los resultados están en `pruebas/resultados/`. La prueba renal añade instrumentación únicamente a la respuesta servida al navegador de prueba; no escribe variables de diagnóstico en el código de producción.

Consulta `revision/INFORME.md` para resultados, límites y ramas. No se garantiza una tasa de 60 FPS en cualquier dispositivo; existe calidad baja y las animaciones se detienen cuando no son necesarias.

## Navegación por apartados

El botón **Estudiar** abre tres destinos: **Explorar 3D** (recorrido, animaciones,
comparador y herramientas del visor), **Estudiar** (quizzes, flashcards, exámenes
y esquemas) y **Mi progreso** (estadísticas, errores, notas y bancos).
Cada actividad se abre desde una tarjeta; **Volver al menú** devuelve a su
apartado. Al salir de un quiz activo se muestra primero su resumen.
En móvil, los controles de recorrido, comparación y fisiología ocupan parte
inferior de la pantalla para dejar visible el modelo.

La distribución y las descripciones de las tarjetas están en
`js/estudio/menu.js`. Los plugins nuevos sin categoría aparecen automáticamente
en «Más actividades». Las pruebas de navegación se ejecutan con
`python pruebas/menu.py` (requiere Playwright y Chromium, como las demás pruebas).
