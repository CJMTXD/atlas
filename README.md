# Atlas anatómico 3D · Aparato urinario

Aplicación educativa en un único `index.html`, con modelo anatómico BodyParts3D
integrado y ampliación procedural del aparato urinario.

## Descargar y abrir

1. Abre [atlas-urinario.zip](atlas-urinario.zip) y pulsa **Download raw file** (icono de descarga).
2. Extrae el ZIP y abre `index.html` en Chrome o Edge con conexión a Internet.
3. Pulsa **Estudiar** para acceder a quiz, flashcards, recorrido, nefrona SVG,
   histología, tabla de epitelios, comparación, autoevaluación, simulacro y errores.

También puedes usar **Code → Download ZIP** para descargar el repositorio.
No necesita instalación ni compilación. Requiere WebGL 2 y Three.js 0.180.0 por CDN.
Si el navegador restringe módulos desde archivos locales, sirve la carpeta con
`python3 -m http.server 8000`. El progreso se guarda en el navegador y origen utilizados.

## Contenido

- 53 preguntas y respuestas literales del cuestionario del laboratorio 11.
- 7 secciones, 7 casillas de autoevaluación y tabla de epitelios.
- Anatomía interna renal, uréteres, vejiga y variantes uretrales.
- Capas, búsqueda, árbol, corte, explosión, etiquetas, temas y controles originales.

El documento usa «cuatro órganos» en una casilla, pero enumera dos riñones, dos
uréteres, vejiga y uretra en la primera respuesta; ambos textos se conservan
y la aplicación señala la ambigüedad. La dificultad es una clasificación didáctica añadida.

## Atribución

Mallas adaptadas de BodyParts3D, © The Database Center for Life Science,
bajo [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.es).
Las atribuciones completas y adaptaciones se conservan dentro del HTML.
El detalle urinario adicional incluye geometrías procedurales educativas.

**Contenido educativo. No sustituye el consejo médico profesional.**
