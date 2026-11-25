# Notas de la conversión (support.js/x-dc → HTML/CSS/JS plano)

Resumen de cómo se migró `/home/claude/santi-br/mixtape/index.html` (un artifact de
Design Canvas, con `<x-dc>` + un `<script type="text/x-dc">` ejecutado por el runtime
propietario) a esta carpeta, en HTML/CSS/JS estándar. El objetivo fue mantener el
mismo diseño y comportamiento exactos; estas son las partes donde conviene una
revisión visual/funcional tuya, y los criterios que usé donde el original no era
100% explícito.

## Qué se hizo

- `index.html`: markup estático (nav, hero, demo, números, "quién", privacidad,
  bajar, novedades, faq, footer) copiado tal cual del original, reemplazando los
  `{{binding}}`, `<sc-for>` y `<sc-if>` del template propietario por contenedores
  vacíos con `id` (`files-list`, `rueda-root`, `work-root`, `full-root`,
  `clearres-root`, `chips-list`, `faq-list`) que `js/main.js` llena a mano.
- `css/style.css`: es el CSS del artifact concatenado sin cambios (el bloque de
  `<helmet><style>`, el bloque de rendimiento `#mx-fluido` que estaba en `<head>`,
  y el CSS del gate/novedades que estaba al final del body). No se tocó ninguna
  regla.
- `js/main.js`: tiene tres partes independientes (como en el original, que eran
  tres `<script>` separados):
  1. Los datos (`var D = {...}`) y toda la lógica del componente interactivo
     (`data()`, `apply()`, `open()`, `stepRueda()`, `renderVals()`, el manejo de
     drag/pointer, teclado, scroll del nav, detección de touch), reescrita a mano
     en JS plano con un `render()` manual que actualiza el DOM. Esto reemplaza el
     motor de reactividad propietario — **no es una copia de ese runtime**, es una
     reimplementación de cero pensada sólo para este componente.
  2. El gate de clave ("casete") + las descargas vía `version.json` + el pintado
     de "Novedades": esto en el original **ya era JS estándar**, sin depender del
     runtime propietario, así que se copió literal.
  3. El bloque que evita que iOS robe el scroll/gestos mientras se arrastra un
     archivo de la prueba: también ya era JS estándar, copiado literal.
- Assets (`fonts/`, `img/`, `icon.png`, `icon-512.png`, `version.json`,
  `actualizaciones/`, `.nojekyll`, `README.md`) copiados sin modificar.
  `version.json` se sirve desde la misma ruta relativa (`./version.json`), igual
  que antes.
- `fonts/` se copió igual, pero **no encontré ninguna referencia a esa carpeta**
  ni en el `index.html` original ni en `support.js` (no hay ningún `@font-face`
  que la use ni ningún string `fonts/...`). La tipografía real de la página sale
  toda del `<link>` de Google Fonts. Puede ser un asset que quedó de otro template
  y no se esté usando; lo dejé igual por las dudas, pero valdría la pena
  confirmarlo.
- No encontré ninguna sub-ruta `/celu/` ni ningún `manifest.webmanifest` en el
  checkout clonado (sólo aparece la palabra "celu" en comentarios de código,
  como forma corta de "celular/mobile", no como ruta). No inventé nada ahí.

## Cosas que quedaron afuera a propósito (código muerto en el original)

Revisando qué bindings usa realmente el HTML, hay varios campos que
`renderVals()` calculaba pero que ningún elemento del markup de esta versión
"para amigos" llega a leer. Los dejé afuera para no arrastrar complejidad sin
sentido, pero si en algún momento tu `index.html` fuente cambia y empieza a usar
alguno de estos, hay que portarlo:

- El modal de legales (términos/privacidad/devoluciones, clase `.lgm`): el CSS
  existe en la hoja de estilos pero no hay ningún botón ni `div.lgm-bg` en el
  body que lo abra.
- Los "modos" alternativos de navbar (`navMode` a/b/c/e) y los "variantes" de
  sección (`sx` a/b/c): el estado siempre queda fijo en `navMode:'d'` / `sx:'d'`
  porque no hay ningún botón en el markup que los cambie (`nbA..nbE`, `setSxA..D`
  no se usan).
- El comparador de planes (`showCmp`/`toggleCmp`, clase `.cmp-wrap`): sin botón
  que lo abra en este body.
- El método `rel(e)` del componente original: no lo llama nada.

## Aproximación que vale la pena revisar visualmente

- **Arquitectura de eventos**: el original usaba un framework tipo React, que
  reconcilia el DOM (no destruye los nodos existentes si la estructura no
  cambió) y delega los eventos de forma centralizada. En JS plano repliqué eso
  con **un solo listener por tipo de evento, puesto en `document`**, en vez de
  listeners atados a cada elemento. Esto es importante porque partes del demo
  (`#files-list`, `#rueda-root`, etc.) se vuelven a dibujar con `innerHTML` en
  cada cambio de estado; si hubiera puesto los listeners en los nodos
  individuales, se habrían perdido en cada render. El contenedor `#desk` nunca
  se destruye (igual que en el original no se recreaba), así que
  `setPointerCapture`/`focus()` sobre él se mantienen estables durante un
  arrastre.
- **Swipe de la "rueda" (`.r-strip`) fuera de su propio rectángulo**: en el
  original, el seguimiento del swipe (`rMove`) está atado como handler nativo
  directamente al `.r-strip`, así que si el dedo/mouse se sale muy rápido del
  rectángulo del strip sin soltar, deja de recibir movimiento (no hay
  `setPointerCapture` ahí). En mi versión, decidí seguir el gesto de forma
  global mientras dura el swipe (sin importar si el puntero sigue exactamente
  sobre el strip), porque es más robusto y el resultado visual para un usuario
  normal es el mismo o mejor. Es la única diferencia de comportamiento
  consciente que dejé así; si preferís la fidelidad exacta (incluyendo ese
  "corte" si el gesto se escapa del rectángulo), avisame y lo ajusto.
- **Detección de sistema operativo para elegir instalador**: no la agregué yo;
  ya estaba resuelta en el original exactamente así — los links de
  `data-dl="win"` / `data-dl="mac"` / `data-dl="midipro"` no auto-detectan el
  SO del visitante, simplemente apuntan a la URL que indique `version.json`
  (`windows.url`, `mac.url`, y el primer "extra" cuyo nombre matchee `/midi/i`).
  Lo copié literal. Si en algún momento quisiste que detecte el SO del
  visitante y recomiende un botón, eso no estaba implementado en el original
  tampoco, así que no lo inventé.
- **Clave "casete"**: el login es exactamente como en el original — guarda en
  `localStorage` bajo la clave `mx-ok` el hash SHA-256 (hex) de
  `"mixtape:" + clave_en_minúsculas_sin_espacios`, y lo compara contra la
  constante embebida `2a486f52...`. Lo copié literal, sin tocar el hash ni la
  lógica.

## Qué no toqué

- `version.json`, `actualizaciones/`, `.nojekyll`, `README.md`: copiados sin
  ninguna modificación.
- El checkout original en `/home/claude/santi-br/mixtape/` no fue modificado.

## Sugerencia de verificación manual

Antes de publicar, conviene abrir `index.html` en el navegador y comparar con
el original al menos:
1. El drag & drop de los 4 archivos de ejemplo + Shift, en escritorio y en
   celular (con el botón "Shift" flotante).
2. El swipe/scroll de la "rueda" de acciones y la conversión a un formato.
3. El toggle Noche/Día.
4. Los chips "¿A qué te dedicás?" en la sección "Todo lo que hace" (atenúa las
   herramientas que no matchean).
5. El acordeón de preguntas frecuentes.
6. El gate de clave (con una clave incorrecta y con la correcta).
7. Que las novedades carguen desde `version.json` y que los tres botones de
   descarga (`Bajar para Windows` / `Bajar para Mac` / `Bajar MIDI Pro`) apunten
   bien.
