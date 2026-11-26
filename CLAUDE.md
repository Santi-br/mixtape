# SHIX — web "para amigos" (HTML/CSS/JS plano)

Página de descarga de la versión para amigos de SHIX: https://santi-br.github.io/shix/
Repo público. Solo la página y los instaladores (en Releases); el código de la app está en `shix-app`.
(Hasta el 26/11 se llamaba MIXTAPE y este repo/la web eran `mixtape`; los instaladores y la carpeta
instalada en las compus de los usuarios todavía dicen MIXTAPE hasta que se publique un instalador nuevo.)
Dueño: Santi Brons. Textos en español rioplatense (voseo).

## Reglas que no se rompen
- En ningún texto usar la palabra "pagar": decir "comprar", "activar", "una sola vez".
- Se dice "bajar" acá (a diferencia de la web de venta, que dice "descargar").
- En este repo se trabaja directo en `main`: commitear y pushear ahí, sin crear rama por cada cambio.
- La demo de arrastrar archivo + Shift (`#que`) no se toca salvo que Santi lo pida: es una reimplementación
  a mano del componente original (ver `NOTAS-CONVERSION.md`), no uses el patrón de otros sitios sin revisar antes.

## Cómo se abre
Doble clic en `Abrir (dev).bat`. Levanta `tools/dev-server.js` (servidor estático sin dependencias, con Node)
y abre el navegador en `http://localhost:5473/`. Hace falta un servidor (no sirve abrir `index.html` con
`file://`) porque `js/main.js` hace `fetch('version.json')`, que el navegador bloquea por CORS en local.

## Dónde está cada cosa
- `index.html` / `css/style.css`: markup y estilos, migrados tal cual desde un artifact de Design Canvas
  (ver `NOTAS-CONVERSION.md` para el detalle completo de esa migración y lo que quedó pendiente de revisar).
- `js/main.js`: todo el JS. Tiene un "render()" central que recalcula todo (`computeVals()`) y vuelca al DOM;
  **ojo**: algunas partes rearman su `innerHTML` en cada render (ver nota de abajo) — si agregás algo que
  deba animarse con una transición CSS (como el acordeón de FAQ), ese contenido tiene que armarse una sola vez
  y después solo tocarle clases, no reconstruirlo.
- `version.json` + `actualizaciones/`: lo que lee la app para "Novedades" y los links de descarga. No tocar
  a mano salvo que sepas el formato (lo arma el flujo de publicación de `shix-app`). Los links de
  `windows`/`mac`/`extras` siguen apuntando a archivos `MIXTAPE-*.exe/.dmg` (los instaladores reales que
  hay en Releases); recién van a decir `SHIX-*` cuando se publique un instalador nuevo con ese nombre.
- El gate de clave (`#gate` / `.mx-gate` en `index.html`/`css/style.css`): clave SHA-256 contra una constante
  embebida en `js/main.js` (`CLAVE`). **Encontramos y arreglamos un bug real**: habían quedado unas etiquetas
  `<style>`/`</style>` sueltas dentro de `css/style.css` (resto de la conversión del artifact) que rompían el
  parseo de la regla `.mx-gate{position:fixed;...}`, así que el gate aparecía como un bloque suelto al final
  de la página en vez de taparla entera. Si ves algo parecido (una regla de CSS que no aplica), revisá que no
  haya texto HTML colado en los `.css`.

## Probar
- Sintaxis: `node --check js/main.js`.
- En el navegador: el gate (clave incorrecta/correcta), la demo de arrastrar + Shift (hay que arrastrar de
  verdad, no alcanza con clickear: `js/main.js` espera `dragRef.moved === true` antes de abrir la rueda con
  Shift), el toggle Noche/Día, el acordeón de Preguntas, y que las Novedades carguen desde `version.json`.
