(function () {
'use strict';

/* ======================================================================
   MIXTAPE — web para amigos
   Reimplementación en JS plano de la demo interactiva (antes dependía
   de un runtime de terceros propietario). La lógica de abajo es un
   port 1 a 1 de los métodos del componente original (data(), apply(),
   open(), stepRueda(), renderVals(), etc.), reemplazando el motor de
   reactividad por un render manual sobre el DOM. Ver NOTAS-CONVERSION.md
   para detalles y aproximaciones.
   ====================================================================== */

var D = {"whoex": {"of": ["Uní 20 PDFs para el informe.", "Comprimí las fotos para mandarlas por mail.", "Renombrá 200 facturas de una.", "Pasá un escaneo a texto para copiarlo."], "di": ["Sacale el fondo a una foto.", "Agrandá una imagen chica sin que se pixele.", "Pasá un video horizontal a 9:16.", "Blureá las caras de la gente que no firmó."], "mu": ["Separá la voz, la batería y el bajo.", "Sacá tono y BPM, y renombrá con la key.", "Pasá una melodía a MIDI.", "Todo a WAV, AIFF o MP3 320 en tanda."]}, "tools": {"convertir": ["CONVERTIR", "Convertir", "Audio, video, imagen y PDF al formato que necesites", ["#7D62F0", "#A895FF", "#6A6AEA"], "free", "url('img/d81fc7e27534888a37128ba1011f08f4.webp')"], "comprimir": ["COMPRIMIR", "Comprimir", "Más liviano, con la misma calidad a la vista", ["#4C78EE", "#86A9FF", "#3C62DC"], "free", "url('img/6e423a612e6f85f66d8a960bd862f0ce.webp')"], "unir": ["UNIR PDF", "Unir PDF", "Varios PDFs en uno, en el orden que quieras", ["#6683DE", "#A9BBF5", "#536EC6"], "free", "url('img/ffb6230f10a549113a669a8e09b4fe17.webp')"], "separar": ["SEPARAR PÁGINAS", "Separar PDF", "Un PDF en páginas sueltas o por partes", ["#7C88C2", "#BAC2E8", "#6873AC"], "premium", "url('img/31c493d18c6f9fdcb9eedfe9f0f62147.webp')"], "renombrar": ["RENOMBRAR ARCHIVOS", "Renombrar", "Cientos de archivos con el nombre que quieras, de una", ["#9878E6", "#CBB6FF", "#8063D4"], "premium", "url('img/2bdeb920fc83263cb625cfe4cc9cd407.webp')"], "stems": ["STEMS", "Stems", "Voz, batería, bajo, guitarra, piano y otros por separado", ["#6D5BE6", "#A193FF", "#5B52D4"], "premium", "url('img/993841189738effc91f2978f3e158f93.webp')"], "voz": ["VOZ / INST", "Voz / Inst", "La voz por un lado y la pista por el otro", ["#4BA6E4", "#95D0F7", "#3A7CD4"], "pro", "url('img/64bfe844dcf899e193d542941174864b.webp')"], "midi": ["A MIDI", "A MIDI", "Melodía, armonía, bajo o batería a MIDI, con acordes y tempo", ["#5573E4", "#96A9FF", "#4760D2"], "premium", "url('img/b226e206af88dd2972903b4d9f7ecd4e.webp')"], "key": ["KEY / BPM", "Key / BPM", "Tono en Camelot y tempo, y lo renombra solo", ["#8B5DE8", "#BC9AFF", "#7750D8"], "premium", "url('img/d60edaa5ace0cce44a5bbf333cf0c254.webp')"], "texto": ["A TEXTO", "A texto", "Audio, video o escaneo a texto y subtítulos", ["#6C76A6", "#A9B1D6", "#5D6694"], "premium", "url('img/c5e8280726c2ffed1b198422b64e5d72.webp')"], "video": ["CORTAR VIDEO", "Cortar video", "Cortá y encuadrá en 9:16, 1:1, 4:5 o 16:9", ["#8A4DE4", "#BE92FF", "#7140D0"], "pro", "url('img/a6db9754be8e6d608951f205495fa5d4.webp')"], "sinfondo": ["QUITAR FONDO", "Sin fondo", "Recorta a la persona o el objeto, con borde limpio", ["#5A98DE", "#A2CAF3", "#4880CA"], "pro", "url('img/f844e2565747b90c6c77508975896244.webp')"], "mejorar": ["MEJORAR", "Mejorar", "Fotos ×4 sin que se pixelen y videos hasta 4K, con IA", ["#9C68E6", "#D2AEFF", "#8654D4"], "premium", "url('img/d11dd7e665dff66e7e12418119ac0e71.webp')"], "caras": ["BLUREAR", "Blurear caras", "Encuentra las caras en fotos y videos y las blurea", ["#6D6DD6", "#ABABF4", "#5A5AC2"], "premium", "url('img/bad3a036d06b29f5afcbc39c84ceef11.webp')"], "todas": ["TODAS", "Todas", "Recortar, tamaño, poner fondo, rotar, normalizar, editar y unir videos, PDF a imagen, metadata…", ["#E4E4E9", "#FBFBFD", "#BDBEC5"], "free", "url('img/4511142a5ff46680db6e829c6e4765a7.webp')"]}, "files": [{"id": "pdf", "name": "Informe (20 PDFs)", "ext": "PDF", "count": "×20", "kind": "unir", "tools": [["unir", "Los 20 PDFs quedaron en uno solo, en el orden que elegiste.", [["Informe completo.pdf", "18,4 MB"]]], ["comprimir", "De 18,4 MB a 3,1 MB. Ya lo podés mandar por mail.", [["Informe (comprimido).pdf", "3,1 MB"]]], ["texto", "Texto sacado de los 20 archivos, escaneos incluidos.", [["Informe.txt", "212 KB"]]], ["renombrar", "Renombrados en orden, de Informe_01 a Informe_20.", [["Informe_01.pdf", ""], ["Informe_02.pdf", ""], ["… y 18 más", ""]]]]}, {"id": "fotos", "name": "Fotos del evento (48 JPG)", "ext": "JPG", "count": "×48", "kind": "sinfondo", "tools": [["comprimir", "De 412 MB a 38 MB. Entran en un solo mail.", [["Fotos del evento (comprimidas)", "48 archivos · 38 MB"]]], ["renombrar", "Renombradas de Evento_001 a Evento_048.", [["Evento_001.jpg", ""], ["Evento_002.jpg", ""], ["… y 46 más", ""]]], ["convertir", "Pasadas a WEBP para subirlas a la web.", [["Fotos del evento (webp)", "48 archivos · 29 MB"]]], ["sinfondo", "Fondo quitado en las 48, con el borde limpio.", [["Fotos del evento (sin fondo)", "48 PNG"]]], ["mejorar", "Agrandadas x2 para imprimir.", [["Fotos del evento (x2)", "48 archivos"]]]]}, {"id": "beat", "name": "beat_final_FINAL.wav", "ext": "WAV", "count": "", "kind": "stems", "tools": [["stems", "Separado en voz, batería, bajo, guitarra, piano y otros.", [["beat_final_FINAL (voz).wav", "8,1 MB"], ["beat_final_FINAL (batería).wav", "8,1 MB"], ["… y 4 pistas más", ""]]], ["key", "8A · La menor · 95 BPM. Ya quedó renombrado con la key.", [["beat_final_FINAL (8A - 95 BPM).wav", "32 MB"]]], ["midi", "Melodía y bajo pasados a MIDI.", [["beat_final_FINAL (melodía).mid", "4 KB"], ["beat_final_FINAL (bajo).mid", "2 KB"]]], ["voz", "La voz por un lado y la pista por el otro.", [["beat_final_FINAL (voz).wav", "32 MB"], ["beat_final_FINAL (instrumental).wav", "32 MB"]]], ["convertir", "Convertido a MP3 320 kbps.", [["beat_final_FINAL.mp3", "7,4 MB"]]]]}, {"id": "clip", "name": "clip_boda.mov", "ext": "MOV", "count": "", "kind": "video", "tools": [["video", "Cortado y pasado a 9:16 para Reels y TikTok.", [["clip_boda (9x16).mp4", "48 MB"]]], ["comprimir", "De 1,2 GB a 140 MB, con la misma calidad a la vista.", [["clip_boda (comprimido).mp4", "140 MB"]]], ["caras", "Se blurearon 7 caras automáticamente.", [["clip_boda (caras).mp4", "1,1 GB"]]], ["texto", "Subtítulos sacados del audio.", [["clip_boda.srt", "6 KB"], ["clip_boda.txt", "4 KB"]]], ["convertir", "Convertido a MP4.", [["clip_boda.mp4", "310 MB"]]]]}], "recents": [["renombrar", "Facturas octubre (200 archivos)", "Renombrar · hace 1 h"], ["unir", "Presupuesto final.pdf", "Unir PDF · 6 archivos · hace 3 h"], ["key", "Set sábado — 32 temas", "Key / BPM · ayer"]], "def": ["convertir", "comprimir", "unir", "stems", "voz", "midi", "key", "texto", "video", "todas"], "faq": [["¿Es gratis?", "Sí, para vos. Esta es la versión para amigos: trae todo, sin claves ni límites."], ["¿Mis archivos se suben a algún lado?", "No. Todo se procesa en tu compu. Solo se conecta a internet para buscar actualizaciones, bajar los paquetes de IA la primera vez y, si usás Bajar de un link, para bajar eso."], ["¿Cómo se actualiza?", "Sola. MIXTAPE se fija si hay una versión nueva, la baja y te avisa: tocás el aviso y reinicia en la nueva."], ["¿Anda en Mac?", "Sí, en Mac con chip Apple (M1 en adelante) y con Intel. La primera vez la Mac pide permiso: abrí MIXTAPE y tocá Listo en el aviso → Configuración del Sistema → Privacidad y seguridad → bajá hasta el final y tocá Abrir de todos modos. Se hace una sola vez."], ["Windows dice que protegió mi PC", "Es porque la app no está firmada todavía. Tocá Más información → Ejecutar de todas formas."], ["¿Qué compu necesito?", "Cualquier compu con Windows 10/11 o Mac anda para convertir, comprimir y PDF. Lo de IA (stems, MIDI, texto, mejorar) va mucho más rápido con placa de video NVIDIA o en una Mac con chip Apple."], ["¿Toca mis archivos originales?", "Nunca. El resultado se guarda al lado del original, con otro nombre."], ["No me aparece la rueda", "Arrastrá el archivo y, sin soltarlo, apretá Shift (o la tecla que elijas en Ajustes). Funciona desde el Explorador, el escritorio y el navegador; en Ajustes podés activar que funcione desde cualquier programa."], ["¿Algo no anda?", "Escribile a Santi. Si podés, mandale una captura y qué archivo estabas usando."]], "demo": {"tapa": {"compress": "comprimir", "rmbg": "sinfondo", "upscale": "mejorar", "vupscale": "mejorar", "ocr": "texto", "transcribe": "texto", "blur": "caras", "crop": "todas", "rotate": "todas", "rename": "renombrar", "stems": "stems", "stems2": "voz", "midi": "midi", "keybpm": "key", "normalize": "todas", "vtrim": "video", "vedit": "video", "mute": "video", "split": "separar", "merge": "unir", "strip": "todas"}, "ic": {"compress": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M4%204l5%205M9%205v4H5M20%2020l-5-5M15%2019v-4h4M20%204l-5%205M15%205v4h4M4%2020l5-5M5%2015h4v4%22%2F%3E%3C%2Fsvg%3E')", "crop": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%202v16h16M2%206h16v16%22%2F%3E%3C%2Fsvg%3E')", "text": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M4%206V4h16v2M12%204v16M9%2020h6M17%2013h4M17%2017h4%22%2F%3E%3C%2Fsvg%3E')", "trim": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209a3%203%200%201%200%200-6%203%203%200%200%200%200%206zM6%2021a3%203%200%201%200%200-6%203%203%200%200%200%200%206zM20%204L8.12%2015.88M14.47%2014.48L20%2020M8.12%208.12L12%2012%22%2F%3E%3C%2Fsvg%3E')", "vedit": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%205h18v9H3zM7.5%205v9M16.5%205v9M3%2018.5h7M13%2018.5h8M11.5%2016.5v4%22%2F%3E%3C%2Fsvg%3E')", "rmbg": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12%206.2a2.6%202.6%200%201%201%200%205.2%202.6%202.6%200%200%201%200-5.2zM7.2%2017.6c.7-2.6%202.6-4%204.8-4s4.1%201.4%204.8%204M3%207.5V4h3.5M21%207.5V4h-3.5M3%2016.5V20h3.5M21%2016.5V20h-3.5%22%2F%3E%3C%2Fsvg%3E')", "upscale": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M11%203l1.8%204.7%204.7%201.8-4.7%201.8L11%2016l-1.8-4.7L4.5%209.5l4.7-1.8zM18.5%2014l.9%202.1%202.1.9-2.1.9-.9%202.1-.9-2.1-2.1-.9%202.1-.9z%22%2F%3E%3C%2Fsvg%3E')", "blur": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12%203a9%209%200%201%200%200%2018a9%209%200%201%200%200-18M8%208.5h.01M12%208.5h.01M16%208.5h.01M8%2012h.01M12%2012h.01M16%2012h.01M8%2015.5h.01M12%2015.5h.01M16%2015.5h.01%22%2F%3E%3C%2Fsvg%3E')", "stems": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M4%206h16M4%2012h16M4%2018h16M8%204v4M15%2010v4M11%2016v4%22%2F%3E%3C%2Fsvg%3E')", "vocal": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12%203a3%203%200%200%200-3%203v6a3%203%200%200%200%206%200V6a3%203%200%200%200-3-3zM5%2011a7%207%200%200%200%2014%200M12%2018v3%22%2F%3E%3C%2Fsvg%3E')", "normalize": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%2012h1M7%208v8M11%204v16M15%208v8M19%2010v4M21%2012h0%22%2F%3E%3C%2Fsvg%3E')", "mute": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M4%209h4l5-4v14l-5-4H4zM17%209l4%206M21%209l-4%206%22%2F%3E%3C%2Fsvg%3E')", "keybpm": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M9%203h6l4%2018H5zM12%2017l5-10M8.5%2013h7%22%2F%3E%3C%2Fsvg%3E')", "midi": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%206a2%202%200%200%201%202-2h14a2%202%200%200%201%202%202v12a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2zM8%204v10M12%204v16M16%204v10M8%2014v6M16%2014v6%22%2F%3E%3C%2Fsvg%3E')", "rename": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%207h9M3%2012h6M3%2017h9M16%205v14M13.5%205h5M13.5%2019h5%22%2F%3E%3C%2Fsvg%3E')", "rotate": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M20%2012a8%208%200%201%201-2.3-5.7M20%204v5h-5%22%2F%3E%3C%2Fsvg%3E')", "strip": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%2012l8.5-8.5H20V12l-8.5%208.5zM15.5%208.5h.01M4%2020L20%204%22%2F%3E%3C%2Fsvg%3E')", "merge": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M5%204v4a4%204%200%200%200%204%204h6a4%204%200%200%201%204%204v4M19%204v4a4%204%200%200%201-4%204M16%2017l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')", "split": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12%203v7M12%2010l-6%206v5M12%2010l6%206v5M3%2018l3%203%203-3M15%2018l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')"}, "icl": {"compress": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M4%204l5%205M9%205v4H5M20%2020l-5-5M15%2019v-4h4M20%204l-5%205M15%205v4h4M4%2020l5-5M5%2015h4v4%22%2F%3E%3C%2Fsvg%3E')", "crop": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%202v16h16M2%206h16v16%22%2F%3E%3C%2Fsvg%3E')", "text": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M4%206V4h16v2M12%204v16M9%2020h6M17%2013h4M17%2017h4%22%2F%3E%3C%2Fsvg%3E')", "trim": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209a3%203%200%201%200%200-6%203%203%200%200%200%200%206zM6%2021a3%203%200%201%200%200-6%203%203%200%200%200%200%206zM20%204L8.12%2015.88M14.47%2014.48L20%2020M8.12%208.12L12%2012%22%2F%3E%3C%2Fsvg%3E')", "vedit": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%205h18v9H3zM7.5%205v9M16.5%205v9M3%2018.5h7M13%2018.5h8M11.5%2016.5v4%22%2F%3E%3C%2Fsvg%3E')", "rmbg": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12%206.2a2.6%202.6%200%201%201%200%205.2%202.6%202.6%200%200%201%200-5.2zM7.2%2017.6c.7-2.6%202.6-4%204.8-4s4.1%201.4%204.8%204M3%207.5V4h3.5M21%207.5V4h-3.5M3%2016.5V20h3.5M21%2016.5V20h-3.5%22%2F%3E%3C%2Fsvg%3E')", "upscale": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M11%203l1.8%204.7%204.7%201.8-4.7%201.8L11%2016l-1.8-4.7L4.5%209.5l4.7-1.8zM18.5%2014l.9%202.1%202.1.9-2.1.9-.9%202.1-.9-2.1-2.1-.9%202.1-.9z%22%2F%3E%3C%2Fsvg%3E')", "blur": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12%203a9%209%200%201%200%200%2018a9%209%200%201%200%200-18M8%208.5h.01M12%208.5h.01M16%208.5h.01M8%2012h.01M12%2012h.01M16%2012h.01M8%2015.5h.01M12%2015.5h.01M16%2015.5h.01%22%2F%3E%3C%2Fsvg%3E')", "stems": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M4%206h16M4%2012h16M4%2018h16M8%204v4M15%2010v4M11%2016v4%22%2F%3E%3C%2Fsvg%3E')", "vocal": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12%203a3%203%200%200%200-3%203v6a3%203%200%200%200%206%200V6a3%203%200%200%200-3-3zM5%2011a7%207%200%200%200%2014%200M12%2018v3%22%2F%3E%3C%2Fsvg%3E')", "normalize": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%2012h1M7%208v8M11%204v16M15%208v8M19%2010v4M21%2012h0%22%2F%3E%3C%2Fsvg%3E')", "mute": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M4%209h4l5-4v14l-5-4H4zM17%209l4%206M21%209l-4%206%22%2F%3E%3C%2Fsvg%3E')", "keybpm": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M9%203h6l4%2018H5zM12%2017l5-10M8.5%2013h7%22%2F%3E%3C%2Fsvg%3E')", "midi": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%206a2%202%200%200%201%202-2h14a2%202%200%200%201%202%202v12a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2zM8%204v10M12%204v16M16%204v10M8%2014v6M16%2014v6%22%2F%3E%3C%2Fsvg%3E')", "rename": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%207h9M3%2012h6M3%2017h9M16%205v14M13.5%205h5M13.5%2019h5%22%2F%3E%3C%2Fsvg%3E')", "rotate": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M20%2012a8%208%200%201%201-2.3-5.7M20%204v5h-5%22%2F%3E%3C%2Fsvg%3E')", "strip": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%2012l8.5-8.5H20V12l-8.5%208.5zM15.5%208.5h.01M4%2020L20%204%22%2F%3E%3C%2Fsvg%3E')", "merge": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M5%204v4a4%204%200%200%200%204%204h6a4%204%200%200%201%204%204v4M19%204v4a4%204%200%200%201-4%204M16%2017l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')", "split": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c1c1e%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M12%203v7M12%2010l-6%206v5M12%2010l6%206v5M3%2018l3%203%203-3M15%2018l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')"}, "kind": {"image": ["linear-gradient(135deg,#8fb4ff,#6f86ff 55%,#4a3fd1)", "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M4%205h16v14H4zM4%2015l5-5%205%205M13%2013l2-2%205%205M15.5%208.5h.01%22%2F%3E%3C%2Fsvg%3E')"], "audio": ["linear-gradient(135deg,#5ec8e5,#002FA7)", "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M9%2018V5l11-2v13M9%2018a3%203%200%201%201-6%200%203%203%200%200%201%206%200zM20%2016a3%203%200%201%201-6%200%203%203%200%200%201%206%200z%22%2F%3E%3C%2Fsvg%3E')"], "video": ["linear-gradient(135deg,#b39cff,#5b3fd6)", "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%206h12v12H3zM15%2010l6-3v10l-6-3%22%2F%3E%3C%2Fsvg%3E')"], "pdf": ["linear-gradient(135deg,#6c7a96,#2b3450)", "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%203h9l4%204v14H6zM14%203v5h5M9%2013h6M9%2017h6%22%2F%3E%3C%2Fsvg%3E')"], "doc": ["linear-gradient(135deg,#b8c0cc,#6b7686)", "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%203h9l4%204v14H6zM14%203v5h5M9%2012h6M9%2015h6M9%2018h4%22%2F%3E%3C%2Fsvg%3E')"], "midi": ["linear-gradient(135deg,#7fe0cf,#2a9d9a)", "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%206a2%202%200%200%201%202-2h14a2%202%200%200%201%202%202v12a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2zM8%204v10M12%204v16M16%204v10M8%2014v6M16%2014v6%22%2F%3E%3C%2Fsvg%3E')"], "folder": ["linear-gradient(135deg,#9fb0d8,#4a5a8c)", "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M3%207a2%202%200%200%201%202-2h4l2%202h8a2%202%200%200%201%202%202v8a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2z%22%2F%3E%3C%2Fsvg%3E')"]}, "photo": {"vacaciones": "radial-gradient(circle at 70% 34%, #FFE7A8 0 9%, transparent 10%), linear-gradient(180deg,#FF9E7A 0%,#FFC58F 40%,#3E6FB8 41%,#264E8C 100%)", "logo": "radial-gradient(circle at 50% 50%, #FFFFFF 0 26%, transparent 27%), linear-gradient(135deg,#1B1B26,#3A2E6E)"}, "acts": {"compress": ["Comprimir", "compress"], "rmbg": ["Quitar fondo", "rmbg"], "upscale": ["Mejorar", "upscale"], "ocr": ["A texto", "text"], "blur": ["Blurear", "blur"], "crop": ["Recortar", "crop"], "rotate": ["Rotar", "rotate"], "rename": ["Renombrar", "rename"], "stems": ["Stems", "stems"], "stems2": ["Voz / Inst", "vocal"], "midi": ["A MIDI", "midi"], "keybpm": ["Key / BPM", "keybpm"], "transcribe": ["A texto", "text"], "normalize": ["Normalizar", "normalize"], "vtrim": ["Recortar", "trim"], "vedit": ["Editar / unir", "vedit"], "mute": ["Sin audio", "mute"], "vupscale": ["Mejorar", "upscale"], "split": ["Separar", "split"], "merge": ["Unir", "merge"], "strip": ["Metadata", "strip"]}, "files": [{"id": "vac", "name": "vacaciones", "ext": "jpg", "kind": "image", "photo": "vacaciones", "x": 16, "y": 22, "acts": ["compress", "rmbg", "upscale", "ocr", "blur", "crop", "rotate", "rename"], "fmts": ["PNG", "WEBP", "AVIF", "PDF", "GIF"], "out": {"compress": ["vacaciones (comprimida).jpg", "image"], "rmbg": ["vacaciones (sin fondo).png", "image"], "upscale": ["vacaciones (x4).jpg", "image"], "ocr": ["vacaciones.txt", "doc"], "blur": ["vacaciones (blur).jpg", "image"], "crop": ["vacaciones (recorte).jpg", "image"], "rotate": ["vacaciones (rotada).jpg", "image"], "rename": ["Vacaciones 2026.jpg", "image"]}}, {"id": "beat", "name": "beat_final_FINAL", "ext": "wav", "kind": "audio", "x": 73, "y": 16, "acts": ["stems", "stems2", "midi", "keybpm", "transcribe", "normalize", "vtrim", "vedit"], "fmts": ["MP3", "FLAC", "AIFF", "M4A", "OGG"], "out": {"stems": ["beat_final_FINAL (stems)", "folder"], "stems2": ["beat_final_FINAL (voz).wav", "audio"], "midi": ["beat_final_FINAL.mid", "midi"], "keybpm": ["beat_final_FINAL (8A - 95 BPM).wav", "audio"], "transcribe": ["beat_final_FINAL.srt", "doc"], "normalize": ["beat_final_FINAL (normalizado).wav", "audio"], "vtrim": ["beat_final_FINAL (recorte).wav", "audio"], "vedit": ["beat_final_FINAL (editado).mp4", "video"]}}, {"id": "clip", "name": "clip_boda", "ext": "mov", "kind": "video", "x": 84, "y": 64, "acts": ["vtrim", "rotate", "compress", "transcribe", "vupscale", "mute", "stems2", "keybpm", "rename"], "fmts": ["MP4", "WEBM", "GIF", "MP3", "WAV"], "out": {"vtrim": ["clip_boda (9x16).mp4", "video"], "rotate": ["clip_boda (rotado).mov", "video"], "compress": ["clip_boda (comprimido).mp4", "video"], "transcribe": ["clip_boda.srt", "doc"], "vupscale": ["clip_boda (x2).mp4", "video"], "mute": ["clip_boda (sin audio).mov", "video"], "stems2": ["clip_boda (voz).wav", "audio"], "keybpm": ["clip_boda (5A - 120 BPM).mov", "video"], "rename": ["Boda Martina y Juan.mov", "video"]}}, {"id": "inf", "name": "informe", "ext": "pdf", "kind": "pdf", "x": 30, "y": 70, "acts": ["split", "merge", "rotate", "strip", "compress", "rename"], "fmts": ["PNG", "JPG", "WEBP", "TXT"], "out": {"split": ["informe (páginas)", "folder"], "merge": ["informe completo.pdf", "pdf"], "rotate": ["informe (rotado).pdf", "pdf"], "strip": ["informe (sin metadata).pdf", "pdf"], "compress": ["informe (comprimido).pdf", "pdf"], "rename": ["Informe Q3.pdf", "pdf"]}}, {"id": "logo", "name": "logo_cliente", "ext": "png", "kind": "image", "photo": "logo", "x": 52, "y": 44, "acts": ["rmbg", "upscale", "compress", "crop", "rotate", "rename"], "fmts": ["JPG", "WEBP", "ICO", "PDF", "AVIF"], "out": {"rmbg": ["logo_cliente (sin fondo).png", "image"], "upscale": ["logo_cliente (x4).png", "image"], "compress": ["logo_cliente (comprimido).png", "image"], "crop": ["logo_cliente (recorte).png", "image"], "rotate": ["logo_cliente (rotado).png", "image"], "rename": ["Logo cliente final.png", "image"]}}], "fmtkind": {"PNG": "image", "JPG": "image", "WEBP": "image", "AVIF": "image", "GIF": "image", "ICO": "image", "PDF": "pdf", "TXT": "doc", "MP3": "audio", "WAV": "audio", "FLAC": "audio", "AIFF": "audio", "M4A": "audio", "OGG": "audio", "MP4": "video", "WEBM": "video"}}};
// ---------------------------------------------------------------------
// esc(): escapar texto antes de insertarlo como HTML (los {{...}} del
// original escapaban texto automáticamente; acá lo hacemos a mano).
// ---------------------------------------------------------------------
function esc(t) {
  return String(t).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

// ---------------------------------------------------------------------
// Estado (equivalente a this.state del componente original). Se dejaron
// afuera los campos que en el original existían pero ninguna parte del
// markup de esta versión "para amigos" llegaba a usar: theme/faq/pos/
// sel/drag/rueda/work/results/used/full/vshift/touch/tab/navSc/navHid
// son los únicos que el HTML de arriba realmente lee. "rz" se usa
// igual que en el original: no arranca en el estado inicial, se setea
// sólo durante un arrastre.
// ---------------------------------------------------------------------
var state = {
  theme: 'night', faq: -1, pos: {}, sel: null, drag: null, rueda: null,
  work: null, results: [], used: false, full: false, vshift: false,
  touch: false, tab: 'all', navSc: false, navHid: false, rz: null
};
D.demo.files.forEach(function (f) { state.pos[f.id] = [f.x, f.y]; });

function setState(patch) {
  Object.assign(state, patch);
  render();
}

// ---------------------------------------------------------------------
// Referencias sueltas que en el componente original vivían en "self"
// (self._dr, self._sw, etc.) — acá son variables de módulo.
// ---------------------------------------------------------------------
var dragRef = null;      // self._dr  (arrastre de un archivo .fi)
var swipeRef = null;     // self._sw  (swipe sobre el r-strip de la rueda)
var lastX = 0;           // self._lastX
var upTime = 0;          // self._upT
var noClickUntil = 0;    // self._noClick
var wheelAcc = 0;        // self._wAcc
var wheelT = 0;          // self._wT
var raf = 0;             // self._raf
var applyTimer = null;   // this.timer

// ---------------------------------------------------------------------
// Métodos del componente original, portados tal cual.
// ---------------------------------------------------------------------
function fileById(id) {
  var f = D.demo.files.filter(function (x) { return x.id === id; })[0];
  if (f) return f;
  return state.results.filter(function (r) { return r.id === id; })[0] || null;
}

function thumb(f) {
  var DM = D.demo;
  if (f.photo) return 'background-image: ' + DM.photo[f.photo];
  var k = DM.kind[f.kind] || DM.kind.doc;
  return 'background-image: ' + k[1] + ', ' + k[0] + '; background-size: 52%, cover; background-repeat: no-repeat; background-position: center';
}

function stepRueda(st) {
  var rr = state.rueda; if (!rr) return;
  var ff = fileById(rr.id); if (!ff || !ff.acts) return;
  var nf = Math.max(0, Math.min(ff.acts.length - 1, rr.front + st));
  if (nf !== rr.front) setState({ rueda: Object.assign({}, rr, { front: nf }) });
}

function tryOpen(px) {
  var dr = dragRef;
  if (!dr || !dr.moved || state.rueda) return;
  var f = fileById(dr.id);
  if (!f || !f.acts) return;
  openRueda(dr.id, Math.max(28, Math.min(72, dr.x)), Math.max(20, Math.min(50, dr.y)), 'drag', px || dr.sx);
}

function openRueda(id, x, y, mode, px) {
  var f = fileById(id);
  if (!f || !f.acts) return;
  if (window.innerWidth < 720) x = 50; // celu: la rueda centrada para que entre entera
  setState({ rueda: { id: id, x: x, y: y, mode: mode, px0: px || 0, front: 0 }, sel: id, used: true });
}

function applyAction(kind, val) {
  var s = state, r = s.rueda;
  if (!r) return;
  var f = fileById(r.id);
  var DM = D.demo;
  var out, label;
  if (kind === 'fmt') {
    out = [f.name + '.' + val.toLowerCase(), DM.fmtkind[val] || 'doc']; label = 'Convirtiendo a ' + val;
  } else {
    var a = f.acts[val]; out = f.out[a]; label = DM.acts[a][0] + '…';
  }
  if (s.results.length >= 6) { setState({ rueda: null, full: true }); return; }
  var base = s.pos[f.id] || [r.x, r.y];
  var nx = r.x, ny = r.y;
  nx = base[0] > 70 ? base[0] - 22 : base[0] + 22; ny = base[1] > 70 ? base[1] - 16 : base[1] + 16;
  nx = Math.max(8, Math.min(92, nx)); ny = Math.max(10, Math.min(88, ny));
  setState({ rueda: null, work: { x: nx, y: ny, text: label } });
  if (applyTimer) clearTimeout(applyTimer);
  applyTimer = setTimeout(function () {
    var id = 'r' + Date.now();
    var res = { id: id, label: out[0], kind: out[1], photo: (out[1] === 'image' && f.photo) ? f.photo : null, isNew: true };
    var pos = Object.assign({}, state.pos); pos[id] = [nx, ny];
    var results = state.results.map(function (x) { return Object.assign({}, x, { isNew: false }); }).concat([res]);
    setState({ work: null, results: results, pos: pos, sel: id });
  }, 1300);
}

// ---------------------------------------------------------------------
// computeVals(): equivalente a renderVals(), calcula todos los valores
// derivados del estado que el render después vuelca al DOM.
// ---------------------------------------------------------------------
function computeVals() {
  var s = state, DM = D.demo;
  var night = s.theme === 'night';
  var rootStyle = night
    ? '--bg:#140F2A;--b1:rgba(122,74,214,.55);--b2:rgba(38,72,196,.5);--b3:rgba(176,60,220,.5);--ink:#F5F3FC;--ink2:rgba(245,243,252,.7);--ink3:rgba(245,243,252,.45);--glass:rgba(255,255,255,.055);--line:rgba(255,255,255,.16);--rib:rgba(255,255,255,.07);--ribd:rgba(0,0,0,.16);--shadow:rgba(8,4,30,.45);--lc0:#ffffff;--lc1:#d5d9e0;--lc2:#8d939d;--lc3:#eef0f3;--lc4:#b7bcc4;--lc-hole:rgba(13,20,36,.75)'
    : '--bg:#ECE9F7;--b1:rgba(172,140,255,.5);--b2:rgba(124,164,255,.42);--b3:rgba(232,150,244,.4);--ink:#18142C;--ink2:rgba(24,20,44,.7);--ink3:rgba(24,20,44,.46);--glass:rgba(255,255,255,.45);--line:rgba(24,20,44,.12);--rib:rgba(255,255,255,.6);--ribd:rgba(24,20,44,.05);--shadow:rgba(60,40,140,.18);--lc0:#6b7489;--lc1:#2f3a52;--lc2:#0d1424;--lc3:#4a5570;--lc4:#1c2538;--lc-hole:#e9eef6';

  var all = DM.files.map(function (f) { return Object.assign({ label: f.name + '.' + f.ext }, f); }).concat(s.results);
  var files = all.map(function (f) {
    var p = s.pos[f.id] || [50, 50];
    return {
      id: f.id,
      label: f.label,
      cls: 'fi' + (s.sel === f.id ? ' sel' : '') + (f.isNew ? ' new' : '') + (s.drag && s.drag.id === f.id && s.drag.moved ? ' dragging' + (s.rueda ? ' withr' : '') : ''),
      style: (s.drag && s.drag.id === f.id && s.drag.moved) ? 'left: ' + s.drag.x + '%; top: ' + s.drag.y + '%' : 'left: ' + p[0] + '%; top: ' + p[1] + '%',
      icStyle: thumb(f),
      isRes: !f.acts
    };
  });

  var r = s.rueda, rf = r ? fileById(r.id) : null;
  var cards = [], dots = [], fmts = [], trackStyle = '';
  if (rf) {
    var n = rf.acts.length;
    rf.acts.forEach(function (a, i) {
      var A = DM.acts[a];
      var k = i - r.front, front = k === 0, ak = Math.abs(k);
      cards.push({
        idx: i,
        label: A[0],
        cls: 'r-card' + (front ? ' front' : ' glass2'),
        style: ak >= 3 ? 'opacity: 0; pointer-events: none' : (ak === 2 ? 'opacity: .55' : ''),
        ic: 'background-image: ' + (front ? DM.icl[A[1]] : DM.ic[A[1]])
      });
    });
    var cx = r.front * (92 + 10) + 56;
    trackStyle = 'transform: translateX(' + (220 - cx) + 'px)';
    for (var j = 0; j < n; j++) dots.push({ cls: j === r.front ? 'on' : '' });
    fmts = rf.fmts.map(function (m) { return { label: m, cls: 'r-chip' + (s.rz && s.rz.fmt === m ? ' on' : '') }; });
  }

  var faq = D.faq.map(function (q, i) {
    var open = s.faq === i;
    return { q: q[0], a: q[1], cls: open ? 'fa open' : 'fa', idx: i };
  });

  var vac = s.pos.vac || [16, 22];

  return {
    rootStyle: rootStyle,
    nightCls: night ? 'on' : '', dayCls: night ? '' : 'on',
    secCls: 'sx sx-d t-' + s.tab,
    tabsD: [['all', 'Todo'], ['of', 'Oficina y estudio'], ['di', 'Diseño y video'], ['mu', 'Música y DJs']].map(function (t) {
      return { key: t[0], label: t[1], cls: s.tab === t[0] ? 'on' : '' };
    }),
    exLine: s.tab === 'all' ? 'Tocá a qué te dedicás y te marco las que más vas a usar.' : D.whoex[s.tab].join(' · '),
    navCls: 'wrap navbar m-d isla' + (s.navSc ? ' sc' : '') + (s.navHid ? ' hid' : ''),
    faq: faq, files: files, trackStyle: trackStyle, cards: cards, dots: dots, fmts: fmts,
    showRueda: !!rf, showWork: !!s.work,
    hasResults: s.results.length > 0,
    deskCls: 'desk' + (s.touch ? ' touch' : ''),
    showFull: !!s.full,
    vshiftCls: 'vshift' + (s.vshift ? ' on' : ''),
    ruedaStyle: rf ? 'left: ' + r.x + '%; top: ' + r.y + '%' : '',
    pillThumb: rf ? thumb(rf) : '',
    pillCls: 'r-pill glass2' + (s.rz && s.rz.zone === 'cancel' ? ' cancel' : ''),
    pillName: rf ? (s.rz && s.rz.zone === 'cancel' ? 'Cancelar' : (rf.label || (rf.name + '.' + rf.ext))) : '',
    pillAct: rf ? (s.rz && s.rz.zone === 'cancel' ? 'soltá acá' : (s.rz && s.rz.fmt ? '→ ' + s.rz.fmt : '→ ' + DM.acts[rf.acts[r.front]][0])) : '',
    ruedaCls: 'rueda' + (s.rz && s.rz.zone === 'none' ? ' out' : ''),
    ruedaHint: rf ? (r.mode === 'drag' ? (s.rz && (s.rz.zone === 'none' || s.rz.zone === 'cancel') ? 'Soltá para cancelar' : (s.rz && s.rz.fmt ? 'Soltá para convertir a ' + s.rz.fmt : 'Elegí arriba o un formato abajo · soltá sobre el nombre para cancelar')) : 'Deslizá o scrolleá a los costados · tocá la del medio para usarla') : '',
    workStyle: s.work ? 'left: ' + s.work.x + '%; top: ' + s.work.y + '%' : '',
    workText: s.work ? s.work.text : '',
    noteStyle: 'left: calc(' + vac[0] + '% + 50px); top: calc(' + vac[1] + '% - 62px)' + (s.used ? '; opacity: 0' : '')
  };
}

// ---------------------------------------------------------------------
// DOM: referencias (ids puestos a propósito en index.html)
// ---------------------------------------------------------------------
var mxroot = document.getElementById('mxroot');
var navwrap = document.getElementById('navwrap');
var btnNight = document.getElementById('btn-night');
var btnDay = document.getElementById('btn-day');
var desk = document.getElementById('desk');
var deskNote = document.getElementById('desk-note');
var filesList = document.getElementById('files-list');
var vshiftBtn = document.getElementById('vshift-btn');
var clearresRoot = document.getElementById('clearres-root');
var fullRoot = document.getElementById('full-root');
var workRoot = document.getElementById('work-root');
var ruedaRoot = document.getElementById('rueda-root');
var quien = document.getElementById('quien');
var chipsList = document.getElementById('chips-list');
var exline = document.getElementById('exline');
var faqList = document.getElementById('faq-list');

function renderFileHTML(f) {
  return '<div data-id="' + esc(f.id) + '" class="' + f.cls + '" style="' + f.style + '">' +
    '<span class="fi-ic" style="' + f.icStyle + '"></span>' +
    '<span class="fi-n">' + esc(f.label) + '</span>' +
    (f.isRes ? '<button class="fi-x" title="Borrar">×</button>' : '') +
    '</div>';
}

function renderRuedaHTML(v) {
  return '<div class="' + v.ruedaCls + '" style="' + v.ruedaStyle + '">' +
    '<div class="r-strip">' +
    '<div class="r-track" style="' + v.trackStyle + '">' +
    v.cards.map(function (c) {
      return '<button class="' + c.cls + '" style="' + c.style + '" data-ridx="' + c.idx + '"><span class="r-ic" style="' + c.ic + '"></span><span class="r-lb">' + esc(c.label) + '</span></button>';
    }).join('') +
    '</div>' +
    '</div>' +
    '<div class="r-dots">' + v.dots.map(function (d) { return '<i class="' + d.cls + '"></i>'; }).join('') + '</div>' +
    '<div class="' + v.pillCls + '"><span class="r-thumb" style="' + v.pillThumb + '"></span><span class="r-ptx"><b>' + esc(v.pillName) + '</b><span>' + esc(v.pillAct) + '</span></span></div>' +
    '<div class="r-fmts glass2"><span class="r-fl">Convertir a</span>' +
    v.fmts.map(function (m) { return '<button class="' + m.cls + '" data-rfmt="' + esc(m.label) + '">' + esc(m.label) + '</button>'; }).join('') +
    '</div>' +
    '<div class="r-hint">' + esc(v.ruedaHint) + '</div>' +
    '</div>';
}

function render() {
  var v = computeVals();

  mxroot.setAttribute('style', v.rootStyle);
  // navwrap: la clase base + sc/hid se maneja también directo desde el
  // scroll handler (ver componentDidMount más abajo); acá sólo nos
  // ocupamos de que el estado base (m-d isla) y el toggle de tema no la
  // pisen — por eso sólo actualizamos si cambió por fuera del scroll.
  navwrap.className = v.navCls;
  btnNight.className = v.nightCls;
  btnDay.className = v.dayCls;

  desk.className = v.deskCls;
  deskNote.setAttribute('style', v.noteStyle);

  filesList.innerHTML = v.files.map(renderFileHTML).join('');

  vshiftBtn.className = v.vshiftCls;

  clearresRoot.innerHTML = v.hasResults ? '<button class="clear-res glass2" data-action="clear-res">Borrar resultados</button>' : '';

  fullRoot.innerHTML = v.showFull
    ? '<div class="full glass2"><b>Llegaste al máximo de la prueba</b><span>Son 6 archivos a la vez. Borrá alguno para seguir probando, o bajá MIXTAPE y usala con tus archivos de verdad.</span><div class="full-b"><button class="full-btn" data-action="clear-res">Borrar resultados</button><a class="full-btn hot" href="#bajar" data-action="close-full">Bajar</a></div></div>'
    : '';

  workRoot.innerHTML = v.showWork
    ? '<div class="work glass2" style="' + v.workStyle + '"><span class="spin"></span><span>' + esc(v.workText) + '</span></div>'
    : '';

  ruedaRoot.innerHTML = v.showRueda ? renderRuedaHTML(v) : '';

  quien.className = v.secCls;
  chipsList.innerHTML = v.tabsD.map(function (t) {
    return '<button class="' + t.cls + '" data-tab="' + t.key + '">' + esc(t.label) + '</button>';
  }).join('');
  exline.textContent = v.exLine;

  faqList.innerHTML = v.faq.map(function (q) {
    return '<div class="' + q.cls + '"><button data-action="faq-toggle" data-faq="' + q.idx + '"><span>' + esc(q.q) + '</span><span class="fa-x mono">+</span></button><div class="fa-b"><div><p>' + esc(q.a) + '</p></div></div></div>';
  }).join('');
}

// ---------------------------------------------------------------------
// Eventos: un único listener por tipo, en document (equivalente a cómo
// React delega los eventos). Esto hace que el drag/pointer-capture no
// se rompa cuando innerHTML vuelve a dibujar las partes internas del
// desk en cada setState (el nodo #desk nunca se destruye).
// ---------------------------------------------------------------------

document.addEventListener('pointerdown', function (e) {
  if (e.button && e.button !== 0) return;

  var delBtn = e.target.closest('.fi-x');
  if (delBtn) { e.stopPropagation(); return; } // f.xDown

  var strip = e.target.closest('.r-strip');
  if (strip) { swipeRef = { x: e.clientX, moved: false }; return; } // rDown

  var vshift = e.target.closest('.vshift');
  if (vshift) {
    e.stopPropagation();
    var on = !state.vshift;
    setState({ vshift: on });
    if (on) tryOpen(lastX || 0);
    return; // vshiftDown
  }

  var fi = e.target.closest('.fi');
  if (fi && desk.contains(fi)) {
    var id = fi.getAttribute('data-id');
    var p = state.pos[id] || [50, 50];
    try { desk.focus({ preventScroll: true }); desk.setPointerCapture(e.pointerId); } catch (er) {}
    dragRef = { id: id, sx: e.clientX, sy: e.clientY, p0: p.slice() };
    setState({ sel: id, rueda: null });
    return; // f.pDown
  }
});

document.addEventListener('pointermove', function (e) {
  // rMove: swipe del r-strip. En el original sólo corre mientras el
  // puntero sigue físicamente sobre .r-strip (no hay setPointerCapture
  // acá); replicamos ese detalle, salvo que seguimos el gesto aunque el
  // puntero se salga un poco del strip, para que un swipe rápido no se
  // "pierda" (ver NOTAS-CONVERSION.md).
  var sw = swipeRef;
  if (sw) {
    var dx = e.clientX - sw.x;
    if (Math.abs(dx) >= 46) { stepRueda(dx < 0 ? 1 : -1); sw.x = e.clientX; sw.moved = true; }
  }

  // pMove: arrastre de un archivo .fi sobre el desk.
  var dr = dragRef; if (!dr) return;
  lastX = e.clientX;
  var rect = desk.getBoundingClientRect();
  if (!dr.moved && Math.hypot(e.clientX - dr.sx, e.clientY - dr.sy) < 5) return;
  dr.moved = true;
  dr.x = Math.max(6, Math.min(94, (e.clientX - rect.left) / rect.width * 100));
  dr.y = Math.max(8, Math.min(90, (e.clientY - rect.top) / rect.height * 100));
  if ((e.shiftKey || state.vshift) && !state.rueda) { tryOpen(e.clientX); }
  var rr = state.rueda;
  if (rr && rr.mode === 'drag') {
    var ff = fileById(rr.id);
    var ru = desk.querySelector('.rueda');
    var zone = 'none', fmt = null;
    var inR = function (el, m) { if (!el) return false; var b = el.getBoundingClientRect(); m = m || 0; return e.clientX >= b.left - m && e.clientX <= b.right + m && e.clientY >= b.top - m && e.clientY <= b.bottom + m; };
    if (ru) {
      var st = ru.querySelector('.r-strip'), pl = ru.querySelector('.r-pill'), fb = ru.querySelector('.r-fmts');
      if (inR(pl, 6)) zone = 'cancel';
      else if (fb && inR(fb, 10)) {
        var chips = fb.querySelectorAll('.r-chip');
        for (var ci = 0; ci < chips.length; ci++) if (inR(chips[ci], 4)) { zone = 'fmt'; fmt = chips[ci].textContent; }
      } else if (st && inR(st, 0)) {
        zone = 'strip';
        var sb = st.getBoundingClientRect(), sc = sb.width / 440, n = ff.acts.length;
        var swd = Math.min(64, 400 / n), x0 = 220 - (n * swd) / 2;
        var fr = Math.max(0, Math.min(n - 1, Math.floor(((e.clientX - sb.left) / sc - x0) / swd)));
        if (fr !== rr.front) dr.front = fr;
      }
    }
    dr.rz = { zone: zone, fmt: fmt };
  }
  if (raf) return;
  raf = requestAnimationFrame(function () {
    raf = 0;
    var d2 = dragRef; if (!d2) return;
    var up = { drag: { id: d2.id, x: d2.x, y: d2.y, moved: true } };
    if (d2.rz) { var oz = state.rz; if (!oz || oz.zone !== d2.rz.zone || oz.fmt !== d2.rz.fmt) up.rz = d2.rz; }
    var r2 = state.rueda;
    if (r2 && r2.mode === 'drag' && d2.front !== undefined && d2.front !== r2.front) up.rueda = Object.assign({}, r2, { front: d2.front });
    setState(up);
  });
});

function rUpLogic() {
  var sw = swipeRef; swipeRef = null;
  if (sw && sw.moved) { noClickUntil = Date.now(); }
}

document.addEventListener('pointerup', function (e) {
  rUpLogic();

  var dr = dragRef; dragRef = null; upTime = Date.now();
  if (raf) { cancelAnimationFrame(raf); raf = 0; }
  if (!dr) return;
  var rr = state.rueda;
  if (rr && rr.mode === 'drag') {
    var z = dr.rz || { zone: 'strip' };
    if (z.zone !== 'strip' && z.zone !== 'fmt') { setState({ drag: null, vshift: false, rueda: null, rz: null }); return; }
    var fr = dr.front !== undefined ? dr.front : rr.front;
    setState({ drag: null, vshift: false, rz: null, rueda: Object.assign({}, rr, { front: fr }) });
    if (z.zone === 'fmt' && z.fmt) applyAction('fmt', z.fmt); else applyAction('act', fr);
    return;
  }
  if (!dr.moved) {
    if ((state.vshift || (e && e.shiftKey)) && !rr) {
      var q = dr.p0 || [50, 40];
      setState({ drag: null, vshift: false });
      openRueda(dr.id, Math.max(28, Math.min(72, q[0])), Math.max(20, Math.min(50, q[1])), 'tap', dr.sx);
      return;
    }
    setState({ drag: null }); return;
  }
  var pos = Object.assign({}, state.pos); pos[dr.id] = [dr.x, dr.y];
  setState({ pos: pos, drag: null });
});

document.addEventListener('pointercancel', function () {
  rUpLogic();
  dragRef = null;
  setState({ drag: null, rueda: null, rz: null });
});

document.addEventListener('wheel', function (e) {
  if (!e.target.closest('.r-strip')) return;
  var rr = state.rueda; if (!rr) return;
  var dl = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  try { e.preventDefault(); } catch (er) {}
  wheelAcc = (wheelAcc || 0) + dl;
  var now = Date.now();
  if (Math.abs(wheelAcc) < 30 || (wheelT && now - wheelT < 110)) return;
  wheelT = now; var st = wheelAcc > 0 ? 1 : -1; wheelAcc = 0;
  stepRueda(st);
}, { passive: false });

document.addEventListener('click', function (e) {
  // rClickCap: swallow el click que sigue a un swipe del r-strip.
  if (e.target.closest('.r-strip')) {
    if (noClickUntil && Date.now() - noClickUntil < 350) {
      e.stopPropagation(); try { e.preventDefault(); } catch (er) {}
      noClickUntil = 0;
      return;
    }
  }

  var card = e.target.closest('.r-card');
  if (card && ruedaRoot.contains(card)) {
    var idx = +card.getAttribute('data-ridx');
    if (idx === state.rueda.front) applyAction('act', idx);
    else setState({ rueda: Object.assign({}, state.rueda, { front: idx }) });
    return;
  }
  var chip = e.target.closest('.r-chip');
  if (chip && ruedaRoot.contains(chip)) {
    applyAction('fmt', chip.getAttribute('data-rfmt'));
    return;
  }
  var clearBtn = e.target.closest('[data-action="clear-res"]');
  if (clearBtn) {
    setState({ results: [], sel: null, full: false });
    return;
  }
  var closeFullBtn = e.target.closest('[data-action="close-full"]');
  if (closeFullBtn) {
    setState({ full: false });
    return; // no preventDefault: deja navegar a #bajar, igual que el original
  }
  var faqBtn = e.target.closest('[data-action="faq-toggle"]');
  if (faqBtn) {
    var fi2 = +faqBtn.getAttribute('data-faq');
    setState({ faq: state.faq === fi2 ? -1 : fi2 });
    return;
  }
  var tabBtn = e.target.closest('[data-tab]');
  if (tabBtn) {
    setState({ tab: tabBtn.getAttribute('data-tab') });
    return;
  }
  var themeBtn = e.target.closest('[data-action="theme"]');
  if (themeBtn) {
    setState({ theme: themeBtn.getAttribute('data-v') });
    return;
  }
  // "stop": clicks dentro de los popups .full / .rueda que no matchearon
  // nada de lo anterior no deben llegar al onDeskClick de abajo.
  if (e.target.closest('.full') || e.target.closest('.rueda')) return;

  // onDeskClick (sólo si el click está dentro de #desk)
  if (e.target.closest('#desk')) {
    if (upTime && Date.now() - upTime < 250) return;
    if (e.target.closest('.fi, .rueda, .vshift, .clear-res')) return;
    if (state.rueda) setState({ rueda: null }); else setState({ sel: null });
  }
}, true);

document.addEventListener('keydown', function (e) {
  if (document.activeElement !== desk) return;
  var rr = state.rueda;
  if (e.key === 'Shift' && !rr) { tryOpen(lastX || 0); return; }
  if (!rr) return;
  var ff = fileById(rr.id);
  if (e.key === 'ArrowRight') { e.preventDefault(); setState({ rueda: Object.assign({}, rr, { front: Math.min(ff.acts.length - 1, rr.front + 1) }) }); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); setState({ rueda: Object.assign({}, rr, { front: Math.max(0, rr.front - 1) }) }); }
  else if (e.key === 'Enter') { e.preventDefault(); applyAction('act', rr.front); }
  else if (e.key === 'Escape') { if (dragRef) { dragRef.moved = false; dragRef = null; } setState({ rueda: null, drag: null, rz: null, vshift: false }); }
});

// ---------------------------------------------------------------------
// componentDidMount: detección de touch + barra de nav que se achica al
// scrollear. Se deja igual que el original: toca el classList del
// navbar directo (sin pasar por setState) para que sea instantáneo.
// ---------------------------------------------------------------------
try {
  if (('ontouchstart' in window) || navigator.maxTouchPoints > 0 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)) setState({ touch: true });
} catch (er) {}

(function () {
  var last = 0;
  var onScrollRaw = function (e) {
    var t = e.target, y = (t && t.nodeType === 1) ? t.scrollTop : (document.scrollingElement || document.documentElement).scrollTop;
    if (t && t.nodeType === 1 && t.scrollHeight - t.clientHeight < 200) return;
    var sc = y > 40, hid = sc && y > last + 2 ? true : (y < last - 2 ? false : state.navHid);
    if (!sc) hid = false;
    last = y;
    if (sc !== state.navSc || hid !== state.navHid) {
      state.navSc = sc; state.navHid = hid;
      var nb = document.querySelector('.navbar');
      if (nb) { nb.classList.toggle('sc', sc); nb.classList.toggle('hid', hid); } else render();
    }
  };
  var tick = false, ev = null;
  var onScroll = function (e) { ev = e; if (tick) return; tick = true; requestAnimationFrame(function () { tick = false; onScrollRaw(ev); }); };
  window.addEventListener('scroll', onScroll, { capture: true, passive: true });
})();

render();

})();
// ---------------------------------------------------------------------
// Clave "casete" (gate) + descargas desde version.json + novedades.
// Esto en el original ya era JS plano, independiente del runtime del
// artifact, así que se copia tal cual.
// ---------------------------------------------------------------------
(function () {
const CLAVE = '2a486f5298482aec2f6523f518a58ff80f27cddbb030e9a95c27b72b11b6ff76';
const sha = async (t) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))].map(x => x.toString(16).padStart(2, '0')).join('');
const gate = document.getElementById('gate');
let ok = false; try { ok = localStorage.getItem('mx-ok') === CLAVE } catch (e) {}
if (ok) gate.hidden = true; else setTimeout(() => document.getElementById('gin').focus(), 60);
document.getElementById('gform').addEventListener('submit', async (e) => {
  e.preventDefault();
  const v = document.getElementById('gin').value.trim().toLowerCase();
  if (await sha('mixtape:' + v) === CLAVE) { try { localStorage.setItem('mx-ok', CLAVE) } catch (e) {} gate.hidden = true }
  else document.getElementById('gerr').textContent = 'Esa no es. Pedile la clave a Santi.';
});
// descargas: los links salen de version.json (así no hay que tocar la página en cada versión)
let V = null; const urls = {};
fetch('version.json', { cache: 'no-store' }).then(r => r.json()).then(v => {
  V = v; urls.win = (v.windows || {}).url; urls.mac = (v.mac || {}).url;
  const mp = (v.extras || []).find?.(x => /midi/i.test(x.name || x.label || x.url || ''));
  urls.midipro = mp ? mp.url : 'https://github.com/Santi-br/mixtape/releases/latest/download/MIXTAPE-MIDI-Pro.exe';
  paintNovs();
}).catch(() => {});
document.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('[data-dl]'); if (!a) return; const u = urls[a.getAttribute('data-dl')]; if (u) { e.preventDefault(); e.stopPropagation(); location.href = u; } }, true);
// color de fondo del celu (barra de arriba y lo que se ve al estirar): igual al de la página, de noche y de día
const tc = document.querySelector('meta[name="theme-color"]');
function syncBg() {
  const mx = document.querySelector('.mx'); if (!mx) return; const c = getComputedStyle(mx).backgroundColor; if (!c || c === 'rgba(0, 0, 0, 0)') return;
  { const cs = getComputedStyle(mx), R = document.documentElement.style; ['--bg', '--b1', '--b2', '--b3'].forEach(k => { const v = cs.getPropertyValue(k).trim(); if (v && R.getPropertyValue(k) !== v) R.setProperty(k, v); }); }
  if (document.documentElement.style.backgroundColor !== c) { document.documentElement.style.backgroundColor = c; document.body.style.backgroundColor = c; document.documentElement.style.setProperty('--mxbg', c); if (tc) tc.setAttribute('content', c); }
}
let sbT = 0; const sbLater = () => { clearTimeout(sbT); sbT = setTimeout(syncBg, 60); setTimeout(syncBg, 500); };
document.addEventListener('click', sbLater, true);
(function first(n) { syncBg(); if (n > 0) setTimeout(() => first(n - 1), 400); })(6);
{ const mo = new MutationObserver(() => { const mx = document.querySelector('.mx'); if (mx) { mo.disconnect(); syncBg(); new MutationObserver(sbLater).observe(mx, { attributes: true, attributeFilter: ['style', 'class'] }); } }); mo.observe(document.body, { childList: true, subtree: true }); }
// novedades
const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fecha = (d) => { try { return new Date(d + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) } catch (e) { return d } };
function paintNovs() {
  const box = document.getElementById('novs'); if (!box || !V) return;
  const list = [{ version: V.version, date: V.date, notes: V.notes }, ...(V.history || [])].filter(x => x && x.version).slice(0, 12);
  const html = list.map(x => '<div class="nv"><b>' + esc(x.version) + '</b><span>' + esc(x.notes || '') + (x.date ? '<small>' + esc(fecha(x.date)) + '</small>' : '') + '</span></div>').join('');
  if (box.getAttribute('data-v') !== V.version || !box.firstChild) { box.innerHTML = html; box.setAttribute('data-v', V.version); }
}
// el diseño se dibuja después: esperar a que aparezca la caja y volver a llenarla si se redibuja
{ let nT = 0; new MutationObserver(() => { if (nT) return; nT = requestAnimationFrame(() => { nT = 0; const b = document.getElementById('novs'); if (b && !b.firstChild) paintNovs(); }); }).observe(document.body, { childList: true, subtree: true }); }
})();

// ---------------------------------------------------------------------
// iOS: mientras se arrastra un archivo de la prueba, la página no
// scrollea ni abre menús. Copiado tal cual del original.
// ---------------------------------------------------------------------
(function () {
  var on = false;
  document.addEventListener('touchstart', function (e) {
    var t = e.target && e.target.closest ? e.target : null; if (!t) return;
    if (t.closest('.fi') && !t.closest('.fi-x')) { on = true; e.preventDefault(); }
    else if (t.closest('.vshift')) { e.preventDefault(); }
    else if (t.closest('.rueda') && document.querySelector('.fi.drag,.fi.dragging')) { on = true; }
  }, { passive: false, capture: true });
  document.addEventListener('touchmove', function (e) { if (on || document.querySelector('.fi.drag,.fi.dragging')) e.preventDefault(); }, { passive: false, capture: true });
  var off = function () { on = false; }; document.addEventListener('touchend', off, true); document.addEventListener('touchcancel', off, true);
})();
