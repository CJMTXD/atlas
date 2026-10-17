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
