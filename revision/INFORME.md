# Entrega integral: fases 2, 3 y 4

## Estado

Implementación en ramas de revisión, sin fusionar en main ni cambiar el sitio publicado. La referencia funcional original permanece en `referencia/index-funcional-2026-10-17.html`.

## Integridad

- Las 53 preguntas y respuestas originales coinciden exactamente con el banco del HTML de referencia.
- El binario extraído conserva la geometría integrada original: 52 registros, 356.006 vértices, 713.710 triángulos y 10.700.556 bytes.
- Las mejoras urinarias se aplican en módulos procedurales; no alteran el binario fuente.
- Se conservaron identificadores anteriores, claves `atlas-theme` y `atlas-urinario-estudio-v1`, licencias y aviso educativo.
- Los nuevos datos usan `atlas-estudio-extra-v1`; las láminas se guardan en `atlas-histologia-v1` de IndexedDB.
- CSS separado conservando su orden original. Three.js continúa en 0.180.0, ahora disponible localmente.

## Pruebas realizadas

- Sintaxis de módulos y prueba de algoritmos: SM-2, CSV con comillas/saltos de línea, importación inválida, exportación/importación del banco completo, racha y tolerancia de nombres.
- Regresión en Chromium de escritorio y emulación móvil: carga, búsqueda, clic 3D en riñón aislado, control de corte Y, ambos quizzes, flashcards, temas y ancho/desplazamiento de la interfaz.
- Modos nuevos: persistencia SM-2, estadísticas, meta, banco propio, notas tratadas como texto, exportación de progreso, imagen local con máscara, examen práctico, fisiología y enfoque.
- Corte renal: existencia, visibilidad y plano de corte compartido por corteza, médula, pirámides, columnas, papila, cálices, pelvis e hilio; captura inspeccionada.
- PWA: caché completa bajo /atlas/ y recarga móvil con red desactivada; carga de mallas y nefrona.
- localStorage e IndexedDB bloqueados: continuidad en memoria y avisos visibles.

## Límites conocidos

- Pruebas con Chromium y renderizado software, no en un iPhone físico ni Safari/WebKit. La voz audible y la instalación real en la pantalla de inicio requieren comprobación en el dispositivo del usuario.
- No se certifica anatomía clínica, precisión métrica ni 60 FPS en todo hardware. Las superficies y animaciones añadidas se identifican como esquemas didácticos complementarios.
- Se mantiene la ambigüedad documental «cuatro órganos» frente a dos riñones, dos uréteres, vejiga y uretra. No se corrigió el material fuente.
- El binario original contiene dos triángulos degenerados en el cerebro, ya documentados en el diagnóstico. No impiden la carga y se conservaron para mantener íntegro el recurso fuente.
- La API de GitHub devuelve Forbidden en este entorno: las ramas pueden subirse por Git, pero la creación de PR queda pendiente mientras ese acceso esté bloqueado. No se ha simulado ni afirmado la creación de PR.

## Revisión

`ramas.json` describe las ramas apiladas y su base inmediata. Revisa los cambios en orden: una rama posterior depende de las anteriores. `scripts/crear-prs.py` crea los PR cuando gh disponga de acceso; nunca fusiona.
