// MIXTAPE para el celu: el hub Living en vertical, la hoja de "qué hago con estos archivos",
// Todas, el orden para unir en PDF y el procesado de imágenes y PDF en el propio celu.
const D = window.MX_DATA;
const { PDFDocument, degrees } = window.PDFLib;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ICO = {
  x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  grip: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/></svg>',
  pc: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#002FA7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5h18v11H3zM8 20h8M12 16v4"/></svg>',
};

// ---------------- tipos de archivo ----------------
const EXT = {
  image: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tif', 'tiff', 'heic', 'heif'],
  pdf: ['pdf'],
  audio: ['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg', 'opus', 'aif', 'aiff', 'wma', 'amr'],
  video: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v', '3gp', 'mpeg', 'mpg', 'mts', 'ts'],
};
const extOf = (n) => (String(n).match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase() || '';
const baseOf = (n) => String(n).replace(/\.[^.]+$/, '');
function kindOf(f) {
  const t = f.type || '';
  if (t === 'application/pdf') return 'pdf';
  if (t.startsWith('image/')) return 'image';
  if (t.startsWith('audio/')) return 'audio';
  if (t.startsWith('video/')) return 'video';
  const e = extOf(f.name);
  return Object.keys(EXT).find((k) => EXT[k].includes(e)) || null;
}
function groupKind(files) {
  if (!files.length) return null;
  if (files.some((f) => !kindOf(f))) return 'other';
  const ks = [...new Set(files.map(kindOf).filter(Boolean))];
  if (ks.length === 1) return ks[0];
  if (ks.every((k) => k === 'image' || k === 'pdf')) return 'docs';
  if (ks.includes('video') && ks.includes('audio') && ks.length === 2) return 'mix';
  return ks.length > 1 ? 'other' : ks[0];
}
const KNAME = { image: ['foto', 'fotos'], pdf: ['PDF', 'PDFs'], audio: ['audio', 'audios'], video: ['video', 'videos'], docs: ['archivo', 'archivos'], mix: ['archivo', 'archivos'], other: ['archivo', 'archivos'] };
const KLABEL = { image: 'Imágenes', pdf: 'PDF', audio: 'Audio', video: 'Video', docs: 'Imágenes + PDF', mix: 'Video + audio', other: 'Archivos' };

// dónde se hace cada cosa: 'local' en el celu, 'pc' en la compu (llega con el puente), 'soon' audio/video en el celu (próxima parte)
const A = {
  compress: { t: 'Comprimir', c: 'comprimir', w: 'local' }, crop: { t: 'Recortar', c: 'recortar', w: 'local', single: true },
  resize: { t: 'Tamaño', c: 'tamano', w: 'local' }, upscale: { t: 'Mejorar', c: 'mejorar', w: 'pc' }, rmbg: { t: 'Quitar fondo', c: 'rmbg', w: 'pc' }, blur: { t: 'Blurear', c: 'blur', w: 'pc' },
  background: { t: 'Fondo', c: 'fondo', w: 'local' }, rotate: { t: 'Rotar', c: 'rotar', w: 'local' }, strip: { t: 'Sin metadata', c: 'meta', w: 'local' },
  pdf_join: { t: 'Unir en PDF', c: 'pdf', w: 'local', multi: true }, merge: { t: 'Unir', c: 'merge', w: 'local', multi: true }, split: { t: 'Separar', c: 'split', w: 'local' },
  vtrim: { t: 'Recortar', c: 'video', w: 'soon', single: true }, vedit: { t: 'Editar / unir', c: 'vedit', w: 'pc' }, transcribe: { t: 'A texto', c: 'texto', w: 'pc' }, stems: { t: 'Stems', c: 'stems', w: 'pc' },
  stems2: { t: 'Voz / Inst', c: 'voz', w: 'pc' }, midi: { t: 'A MIDI', c: 'midi', w: 'pc' }, keybpm: { t: 'Key / BPM', c: 'key', w: 'pc' },
  normalize: { t: 'Normalizar', c: 'norm', w: 'soon' }, mute: { t: 'Sin audio', c: 'mute', w: 'soon' }, vcompress: { t: 'Comprimir', c: 'comprimir', w: 'soon' },
  astrip: { t: 'Sin metadata', c: 'meta', w: 'soon' }, rename: { t: 'Renombrar', c: 'rename', w: 'local' }, ocr: { t: 'Foto a texto', c: 'ocr', w: 'local' }, av_replace: { t: 'Reemplazar audio', c: 'mix', w: 'soon' }, av_mix: { t: 'Sumar audio', c: 'mix', w: 'soon' },
};
const CAT = {
  image: { formats: [['jpg', 'JPG'], ['png', 'PNG'], ['webp', 'WEBP'], ['pdf', 'PDF']], actions: ['compress', 'crop', 'rmbg', 'ocr', 'resize', 'rotate', 'background', 'strip', 'rename', 'upscale', 'blur'] },
  pdf: { formats: [['png', 'PNG'], ['jpg', 'JPG'], ['txt', 'TXT']], actions: ['merge', 'split', 'rotate', 'strip', 'rename'] },
  docs: { formats: [], actions: ['pdf_join', 'rename'] },
  other: { formats: [], actions: ['rename'] },
  audio: { formats: [['mp3', 'MP3'], ['wav', 'WAV'], ['m4a', 'M4A'], ['flac', 'FLAC'], ['ogg', 'OGG'], ['mp4', 'MP4']], fw: 'soon', actions: ['vtrim', 'normalize', 'astrip', 'transcribe', 'stems', 'stems2', 'midi', 'keybpm', 'rename'] },
  video: { formats: [['mp4', 'MP4'], ['mov', 'MOV'], ['webm', 'WEBM'], ['gif', 'GIF'], ['mp3', 'MP3'], ['wav', 'WAV']], fw: 'soon', actions: ['vedit', 'vtrim', 'vcompress', 'mute', 'transcribe', 'stems', 'stems2', 'midi', 'rename'] },
  mix: { formats: [], actions: ['av_replace', 'av_mix', 'rename'] },
};
// tapas del carrusel: qué abre cada una
const MAIN = [
  ['convertir', 'Convertir', 'Cambiá el formato de imágenes, audio, video o PDF', { pick: null, formats: true }],
  ['comprimir', 'Comprimir', 'Fotos más livianas, eligiendo la calidad', { pick: ['image'], id: 'compress' }],
  ['stems', 'Stems', 'Voz, batería, bajo, guitarra y piano por separado', { pick: ['audio', 'video'], id: 'stems' }],
  ['voz', 'Voz / Inst', 'La voz y el instrumental en dos archivos', { pick: ['audio', 'video'], id: 'stems2' }],
  ['midi', 'A MIDI', 'Melodía, acordes, bajo o batería a un .mid', { pick: ['audio', 'video'], id: 'midi' }],
  ['key', 'Key / BPM', 'Tonalidad (con Camelot) y tempo', { pick: ['audio'], id: 'keybpm' }],
  ['texto', 'A texto', 'La voz a texto y subtítulos (.srt)', { pick: ['audio', 'video'], id: 'transcribe' }],
  ['video', 'Cortar video', 'Cortá un video o un audio, y pasalo a 9:16', { pick: ['video', 'audio'], id: 'vtrim' }],
  ['link', 'Bajar link', 'Temas, playlists y álbumes: Spotify, YouTube, TikTok…', { link: true }],
  ['mas', 'Todas', 'Todo lo demás: Mejorar, Blurear, PDF, Tamaño, Fondo…', { todas: true }],
];
const art = (k, small) => `<span class="art" aria-hidden="true">${D.covers[small ? k + ':s' : k] || ''}</span>`;

// ---------------- avisos ----------------
function toast(t, ms = 2600) {
  const el = $('#toast'); el.textContent = t; el.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => { el.hidden = true; }, ms);
}
function busy(t, p) {
  if (t === false) { $('#busy').hidden = true; return; }
  $('#busy').hidden = false; $('#busyT').textContent = t; $('#busyBar').style.width = `${Math.round((p || 0) * 100)}%`;
}
const nextFrame = () => new Promise((r) => setTimeout(r, 0));

// ---------------- escenario del hub ----------------
function fitStage() {
  const k = Math.min(innerWidth / 390, innerHeight / 844);
  $('#stage').style.transform = `translateX(-50%) scale(${k})`;
}
function buildHub() {
  $('#bg').innerHTML = D.bg;
  $('#plant').innerHTML = D.plant;
  $('.logo').innerHTML = D.lockup;
  const tr = $('#track');
  tr.innerHTML = MAIN.map(([k, t], i) => `<button class="cv" data-i="${i}" aria-label="${esc(t)}">${art(k)}</button>`).join('');
  $('#dots').innerHTML = MAIN.map(() => '<i></i>').join('');
  tr.addEventListener('scroll', () => requestAnimationFrame(paintCovers), { passive: true });
  tr.addEventListener('click', (e) => {
    const b = e.target.closest('.cv'); if (!b) return;
    const i = +b.dataset.i;
    if (i !== active) return scrollToCover(i);
    runMain(i);
  });
  fitStage();
  requestAnimationFrame(() => { scrollToCover(2, true); paintCovers(); });
  paintShelf();
}
let active = 2;
function scrollToCover(i, instant) {
  const tr = $('#track'); const el = tr.children[i];
  tr.scrollTo({ left: el.offsetLeft - (tr.clientWidth - el.offsetWidth) / 2, behavior: instant ? 'instant' : 'smooth' });
}
function paintCovers() {
  const tr = $('#track'); const mid = tr.scrollLeft + tr.clientWidth / 2;
  let best = 0, bd = 1e9;
  [...tr.children].forEach((el, i) => {
    const c = el.offsetLeft + el.offsetWidth / 2; const d = Math.abs(c - mid);
    if (d < bd) { bd = d; best = i; }
    const s = 1 - 0.353 * Math.min(1, d / 205);
    const a = el.firstElementChild; a.style.transform = `scale(${s.toFixed(3)})`; el.style.zIndex = String(Math.max(1, 1000 - Math.round(d)));
  });
  if (best !== active || !$('#capT').textContent) {
    active = best;
    $('#capT').textContent = MAIN[best][1]; $('#capD').textContent = MAIN[best][2];
    $$('#dots i').forEach((d, i) => d.classList.toggle('on', i === best));
  }
}

// estante: lo último que hiciste (se guarda en este celu)
const SP = [['#002FA7', '#001f73'], ['#1b2a4a', '#0e1830'], ['#8fa3bf', '#647a99'], ['#dfe7f2', '#b3c0d3'], ['#2a9d9a', '#1b6f6d'], ['#5ec8e5', '#2f98b6'],
  ['#f4f6f9', '#c9d0da'], ['#2b2e35', '#15171b'], ['#6f86ff', '#4459d6'], ['#c7ccd4', '#9aa2ae']];
const LIGHT = new Set(['#dfe7f2', '#5ec8e5', '#f4f6f9', '#c7ccd4', '#8fa3bf']);
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
let recents = store.get('mx-recientes', []);
const lastOutputs = new Map(); // los archivos de esta sesión, para volver a compartirlos
function pushRecent(r) { recents = [r, ...recents].slice(0, 40); store.set('mx-recientes', recents); paintShelf(); }
function hash(s) { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
function paintShelf() {
  const el = $('#shelf');
  if (!recents.length) { el.innerHTML = '<div class="shelf-empty">Acá van a aparecer las cosas que hagas.<br>Tocá «Elegir archivos» para empezar.</div>'; return; }
  let html = '', w = 0;
  for (const [i, r] of recents.entries()) {
    const h = hash(r.name + r.t); const [c1, c2] = SP[h % SP.length];
    const big = i < 6; const ww = big ? 20 : 8 + (h % 4) * 2; if (w + ww > 250) break; w += ww + 1;
    const hh = big ? 92 + (h % 9) : 66 + (h % 30);
    html += `<button class="spine" data-r="${i}" aria-label="${esc(r.name)}" style="width:${ww}px;height:${hh}px;background:linear-gradient(90deg,${c2} 0%,${c1} 18%,${c1} 62%,${c2} 100%)">`
      + (big ? `<span style="color:${LIGHT.has(c1) ? '#141a26' : '#fff'}">${esc(r.name)}</span>` : '') + '</button>';
  }
  el.innerHTML = html;
}

// ---------------- hojas y pantallas ----------------
function openSheet(html, onClick) {
  closeAll();
  const s = $('#sheet'); $('.sheet-body', s).innerHTML = html;
  $('#veil').hidden = false; s.hidden = false;
  s.onclick = (e) => { if (e.target.closest('.x')) return closeAll(); const b = e.target.closest('button'); if (b && onClick) onClick(b, e); };
  return s;
}
function openScreen(html, onClick) {
  closeAll();
  const s = $('#screen'); s.innerHTML = `<div class="screen-in">${html}</div>`; s.hidden = false; s.scrollTop = 0;
  s.onclick = (e) => { if (e.target.closest('.back')) return closeAll(); const b = e.target.closest('button'); if (b && onClick) onClick(b, e); };
  return s;
}
function closeAll() {
  $('#veil').hidden = true; $('#sheet').hidden = true; $('#screen').hidden = true;
  $$('.bottom-bar').forEach((b) => b.remove());
}
$('#veil').addEventListener('click', closeAll);

// ---------------- elegir archivos ----------------
function pickFiles(kinds, multi = true) {
  return new Promise((resolve) => {
    const inp = $('#pick');
    const acc = { image: 'image/*', pdf: 'application/pdf,.pdf', audio: 'audio/*', video: 'video/*' };
    inp.accept = kinds === 'any' ? '' : (kinds || Object.keys(acc)).map((k) => acc[k]).join(',');
    inp.multiple = multi; inp.value = '';
    inp.onchange = () => resolve([...inp.files]);
    inp.click();
  });
}

const fmtSize = (b) => (b > 1e6 ? `${(b / 1e6).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);
function thumbsHTML(files) {
  const urls = [];
  const html = files.slice(0, 3).map((f, i) => {
    const k = kindOf(f); const st = `left:${i * 14}px;top:${i * 3}px;transform:rotate(${[-6, 3, 8][i]}deg)`;
    if (k === 'image' && !/heic|heif/i.test(f.type + f.name)) { const u = URL.createObjectURL(f); urls.push(u); return `<img src="${u}" alt="" style="${st}">`; }
    const bg = { pdf: '#2b3450', audio: '#002FA7', video: '#5b3fd6' }[k] || '#8fa3bf';
    return `<div style="${st};background:${bg}">${({ pdf: 'PDF', audio: '♪', video: '▶' })[k] || 'IMG'}</div>`;
  }).join('');
  return `<div class="thumbs" style="width:${46 + 14 * (Math.min(3, files.length) - 1)}px">${html}</div>`;
}

// la hoja principal: qué hacer con estos archivos (M2)
function sheetForFiles(files, only) {
  const kind = groupKind(files);
  if (!kind) return toast('Ese tipo de archivo todavía no lo soporto');
  const cat = CAT[kind];
  const n = files.length; const nm = KNAME[kind][n > 1 ? 1 : 0];
  const total = files.reduce((a, f) => a + f.size, 0);
  const fmts = (cat.formats || []).filter(([id]) => !(n === 1 && extOf(files[0].name).replace('jpeg', 'jpg') === id));
  const tile = (id) => {
    const a = A[id]; const off = (a.single && n > 1) || (a.multi && n < 2);
    const badge = a.w === 'pc' ? '<span class="badge">COMPU</span>' : a.w === 'soon' ? '<span class="badge">PRONTO</span>' : '';
    return `<button class="tile" data-a="${id}" ${off ? 'disabled' : ''}>${art(a.c, true)}<b>${esc(a.t)}</b>${badge}</button>`;
  };
  const head = `<div class="sh-head">${thumbsHTML(files)}<div style="min-width:0"><div class="sh-t">${n} ${esc(nm)}</div><div class="sh-s">${esc(KLABEL[kind])} · ${fmtSize(total)}</div></div><button class="x" aria-label="Cerrar">${ICO.x}</button></div>`;
  const html = head
    + (fmts.length ? `<div class="hh">${kind === 'image' && n > 1 ? 'CONVERTIR A (PDF = TODAS EN UNO)' : 'CONVERTIR A'}</div><div class="chips">${fmts.map(([id, l]) => `<button class="chip" data-f="${id}">${l}</button>`).join('')}</div>` : '')
    + (only === 'formats' ? '' : `<div class="hh">HERRAMIENTAS</div><div class="tiles">${cat.actions.map(tile).join('')}</div>`)
    + `<div class="pcrow">${ICO.pc}<div><div class="t">Lo pesado, en la compu</div><div class="s">Stems, MIDI, texto, mejorar y bajar links los va a hacer tu PC. Llega en la próxima parte.</div></div><button class="sw" disabled aria-label="Lo pesado en la compu"></button></div>`;
  openSheet(html, (b) => {
    if (b.dataset.f) return run(files, kind, { ring: 'format', id: b.dataset.f, w: cat.fw || 'local' });
    if (b.dataset.a) return run(files, kind, { ring: 'action', id: b.dataset.a, w: A[b.dataset.a].w });
  });
}

// ---------------- Todas (M3) ----------------
const TODAS = {
  Imagen: [['convertir', 'Convertir', 'JPG, PNG, WEBP o PDF', ['image'], 'f'], ['comprimir', 'Comprimir', 'Más livianas, eligiendo la calidad', ['image'], 'compress'],
    ['recortar', 'Recortar', '1:1, 4:5, 9:16, 16:9', ['image'], 'crop'], ['tamano', 'Tamaño', 'Más chicas o a un ancho justo', ['image'], 'resize'],
    ['rotar', 'Rotar', '90°, 180° o espejo', ['image'], 'rotate'], ['fondo', 'Fondo', 'La foto sobre un fondo de color, cuadrada', ['image'], 'background'],
    ['meta', 'Sin metadata', 'Sin ubicación ni datos de la cámara', ['image'], 'strip'], ['mejorar', 'Mejorar (IA)', 'Agrandar 2× o 4× recuperando detalle', ['image'], 'upscale'],
    ['blur', 'Blurear', 'Caras o zonas', ['image'], 'blur'], ['ocr', 'Foto a texto', 'Copiá el texto de un cartel, una captura o un papel', ['image'], 'ocr'], ['rmbg', 'Quitar fondo', 'PNG transparente de una persona u objeto', ['image'], 'rmbg']],
  Audio: [['convertir', 'Convertir', 'MP3, WAV, M4A, FLAC, OGG', ['audio'], 'f'], ['video', 'Recortar', 'Sobre la forma de onda', ['audio'], 'vtrim'],
    ['texto', 'A texto', 'Texto y subtítulos .srt', ['audio'], 'transcribe'], ['stems', 'Stems', 'Voz, batería, bajo, guitarra, piano', ['audio'], 'stems'],
    ['voz', 'Voz / Inst', 'Acapella e instrumental', ['audio'], 'stems2'], ['midi', 'A MIDI', 'Melodía, acordes, bajo o batería', ['audio'], 'midi'],
    ['key', 'Key / BPM', 'Tonalidad con Camelot y tempo', ['audio'], 'keybpm'], ['norm', 'Normalizar', 'A -14 LUFS sin saturar', ['audio'], 'normalize'],
    ['mp4', 'A MP4 con la tapa', 'Listo para subir', ['audio'], 'f:mp4'], ['meta', 'Sin metadata', 'Copia sin etiquetas', ['audio'], 'astrip']],
  Video: [['vedit', 'Editar y unir videos', 'Línea de tiempo con pistas y música', ['video'], 'vedit'], ['convertir', 'Convertir', 'MP4, MOV, WEBM, GIF o sacar el audio', ['video'], 'f'], ['video', 'Cortar y encuadrar', 'Y pasarlo a 9:16', ['video'], 'vtrim'],
    ['comprimir', 'Comprimir', 'Más liviano', ['video'], 'vcompress'], ['texto', 'A texto', 'Subtítulos .srt', ['video'], 'transcribe'],
    ['mix', 'Audio + video', 'Reemplazar o sumar el sonido', ['video', 'audio'], 'mix'], ['mute', 'Sin audio', 'El video mudo', ['video'], 'mute'],
    ['stems', 'Stems', 'Del audio del video', ['video'], 'stems'], ['midi', 'A MIDI', 'Del audio del video', ['video'], 'midi']],
  PDF: [['merge', 'Unir', 'PDFs y fotos en un PDF, en el orden que quieras', ['pdf', 'image'], 'join'], ['split', 'Separar páginas', 'Un PDF por página', ['pdf'], 'split'],
    ['pdfimg', 'PDF a imagen', 'Una imagen por página', ['pdf'], 'f:png'], ['pdftxt', 'PDF a texto', 'El texto en un .txt', ['pdf'], 'f:txt'],
    ['rotar', 'Rotar PDF', 'Todas las páginas 90°', ['pdf'], 'rotate'], ['meta', 'Sin metadata', 'Sin autor ni programa', ['pdf'], 'strip']],
  Más: [['rename', 'Renombrar', 'Muchos archivos de una: nombre + número, reemplazar, fecha…', null, 'rename'], ['link', 'Bajar de un link', 'Spotify, YouTube, TikTok, Instagram…', null, 'link'], ['link', 'Bajar una playlist o álbum', 'Toda la lista de Spotify o YouTube, eligiendo los temas', null, 'link']],
};
function whereOf(act) {
  if (act === 'f' || act === 'join' || act === 'link' || act === 'mix') return act === 'link' ? 'pc' : act === 'mix' ? 'soon' : 'local';
  if (act.startsWith('f:')) return act === 'f:mp4' ? 'soon' : 'local';
  return A[act]?.w || 'local';
}
function showTodas(tab = 'Imagen', q = '') {
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const rowsFor = (items, g) => items.map(([k, t, sub, kinds, act], i) => {
    const w = whereOf(act);
    return `<button class="row" data-g="${g}" data-i="${i}">${art(k, true)}<span style="flex:1;min-width:0"><b>${esc(t)}</b><small>${esc(sub)}</small></span>${w === 'pc' ? '<span class="tag">COMPU</span>' : w === 'soon' ? '<span class="tag">PRONTO</span>' : ''}</button>`;
  }).join('');
  let list;
  if (q) {
    const v = norm(q);
    list = Object.entries(TODAS).map(([g, items]) => {
      const hit = items.map((it, i) => [it, i]).filter(([it]) => norm(`${it[1]} ${it[2]} ${g}`).includes(v));
      return hit.length ? `<div class="grp">${g.toUpperCase()}</div>` + hit.map(([it, i]) => rowsFor([it], g).replace(`data-i="0"`, `data-i="${i}"`)).join('') : '';
    }).join('') || '<p class="note">No encontré nada con eso.</p>';
  } else list = rowsFor(TODAS[tab], tab);
  const s = openScreen(`<div class="sc-top"><button class="back" aria-label="Volver">${ICO.back}</button><div class="sc-t">Todo lo que hace</div></div>`
    + `<label class="search">${ICO.search}<input type="search" placeholder="Buscar: stems, pdf, subtítulos…" aria-label="Buscar herramienta" value="${esc(q)}"></label>`
    + `<div class="tabs" role="tablist">${Object.keys(TODAS).map((t) => `<button class="chip${t === tab && !q ? ' on' : ''}" data-tab="${t}" role="tab" aria-selected="${t === tab && !q}">${t}</button>`).join('')}</div>`
    + `<div class="rows">${list}</div>`, async (b) => {
    if (b.dataset.tab) return showTodas(b.dataset.tab);
    if (b.dataset.g) {
      const [, , , kinds, act] = TODAS[b.dataset.g][+b.dataset.i];
      const w = whereOf(act);
      if (act === 'link') return linkSheet();
      if (w !== 'local') return notYet(w);
      const files = await pickFiles(act === 'rename' ? 'any' : kinds, true); if (!files.length) return;
      const kind = groupKind(files);
      if (act === 'f') return sheetForFiles(files, 'formats');
      if (act === 'join') return run(files, kind, { ring: 'action', id: kind === 'pdf' ? 'merge' : 'pdf_join', w: 'local' });
      if (act.startsWith('f:')) return run(files, kind, { ring: 'format', id: act.slice(2), w: 'local' });
      return run(files, kind, { ring: 'action', id: act, w });
    }
  });
  const inp = $('input', s);
  inp.addEventListener('input', () => { const pos = inp.value; showTodas(tab, pos); const n = $('#screen input'); n.focus(); n.setSelectionRange(pos.length, pos.length); });
}

function notYet(w) {
  toast(w === 'pc' ? 'Esto lo va a hacer tu compu: llega con el puente celu → compu.' : 'Audio y video en el celu llegan en la próxima parte.', 3600);
}
function linkSheet() {
  openSheet(`<div class="sh-head"><div><div class="sh-t">Bajar de un link</div><div class="sh-s">Un tema, una playlist o un álbum: Spotify, YouTube, TikTok, Instagram…</div></div><button class="x" aria-label="Cerrar">${ICO.x}</button></div>`
    + `<div class="lbl">Pegá el link</div><input type="url" id="lnk" placeholder="https://" inputmode="url" autocomplete="off">`
    + `<p class="note">Bajar links lo hace tu compu (en el celu las páginas no dejan). Llega con el puente celu → compu.</p>`
    + `<div class="btns"><button class="btn pri" data-go="1">Bajar</button></div>`, (b) => { if (b.dataset.go) notYet('pc'); });
}

// ---------------- correr una herramienta ----------------
async function runMain(i) {
  const [, , , o] = MAIN[i];
  if (o.todas) return showTodas();
  if (o.link) return linkSheet();
  if (o.formats) { const f = await pickFiles(null, true); if (f.length) sheetForFiles(f, 'formats'); return; }
  const w = A[o.id].w;
  if (w !== 'local') return notYet(w);
  const files = await pickFiles(o.pick, true); if (!files.length) return;
  run(files, groupKind(files), { ring: 'action', id: o.id, w });
}

async function run(files, kind, job) {
  if (job.w !== 'local') return notYet(job.w);
  if (job.id === 'rename') return renameScreen(files);
  if (job.id === 'ocr') return ocrScreen(files);
  const joins = (job.id === 'merge' || job.id === 'pdf_join' || (job.ring === 'format' && job.id === 'pdf' && kind === 'image')) && files.length > 1;
  let opts = {};
  if (joins) { const ord = await orderScreen(files); if (!ord) return; files = ord; }
  if (job.ring === 'action' && OPTIONS[job.id]) { opts = await OPTIONS[job.id](files, kind); if (!opts) return; }
  closeAll();
  busy('Procesando…', 0); await nextFrame();
  try {
    const outs = await process(files, kind, job, opts, (p, t) => busy(t || 'Procesando…', p));
    busy(false);
    const label = job.ring === 'format' ? `A ${job.id.toUpperCase()}` : A[job.id]?.t || job.id;
    for (const o of outs) lastOutputs.set(o.name, o.blob);
    pushRecent({ name: outs[0].name, n: outs.length, label, t: Date.now() });
    showResults(outs, label);
  } catch (e) {
    busy(false); console.error(e);
    toast(`No se pudo: ${String(e.message || e).slice(0, 140)}`, 4200);
  }
}

// ---------------- opciones (hojas chicas) ----------------
function choose(title, groups, okLabel = 'Listo') {
  return new Promise((resolve) => {
    const state = Object.fromEntries(groups.map((g) => [g.key, g.def]));
    const html = `<div class="sh-head"><div><div class="sh-t">${esc(title)}</div></div><button class="x" aria-label="Cerrar">${ICO.x}</button></div><div class="opts">`
      + groups.map((g) => `<div class="lbl">${esc(g.label)}</div><div class="chips" data-key="${g.key}">${g.items.map(([v, l]) => `<button class="chip${v === g.def ? ' on' : ''}" data-v="${v}">${esc(l)}</button>`).join('')}</div>`).join('')
      + `</div><div class="btns"><button class="btn pri" data-ok="1">${esc(okLabel)}</button></div>`;
    const s = openSheet(html, (b) => {
      if (b.dataset.ok) { closeAll(); return resolve(state); }
      const c = b.closest('.chips');
      if (c && b.dataset.v !== undefined) { state[c.dataset.key] = b.dataset.v; $$('.chip', c).forEach((x) => x.classList.toggle('on', x === b)); }
    });
    const onClose = () => resolve(null);
    $('.x', s).addEventListener('click', onClose, { once: true });
    $('#veil').addEventListener('click', onClose, { once: true });
  });
}
const OPTIONS = {
  compress: () => choose('Comprimir', [{ key: 'q', label: 'Calidad', def: '0.72', items: [['0.85', 'Alta'], ['0.72', 'Media'], ['0.55', 'Baja']] },
    { key: 'max', label: 'Tamaño máximo', def: '2560', items: [['0', 'Original'], ['2560', '2560 px'], ['1600', '1600 px'], ['1080', '1080 px']] }], 'Comprimir'),
  crop: () => choose('Recortar (centrado)', [{ key: 'r', label: 'Proporción', def: '1', items: [['1', '1:1'], ['0.8', '4:5'], ['0.5625', '9:16'], ['1.7778', '16:9'], ['0.75', '3:4']] }], 'Recortar'),
  resize: () => choose('Cambiar tamaño', [{ key: 's', label: 'Tamaño', def: 'p50', items: [['p50', '50%'], ['p25', '25%'], ['w1080', '1080 px de ancho'], ['w2048', '2048 px de ancho'], ['w3840', '3840 px (4K)']] }], 'Cambiar'),
  rotate: (files, kind) => choose(kind === 'pdf' ? 'Rotar PDF' : 'Rotar', [{ key: 'a', label: 'Cómo', def: '90', items: kind === 'pdf' ? [['90', '90° derecha'], ['270', '90° izquierda'], ['180', '180°']] : [['90', '90° derecha'], ['270', '90° izquierda'], ['180', '180°'], ['flip', 'Espejo']] }], 'Rotar'),
  background: () => choose('Fondo', [{ key: 'c', label: 'Color', def: '#ffffff', items: [['#ffffff', 'Blanco'], ['#141a26', 'Negro'], ['#002FA7', 'Azul'], ['#e9edf2', 'Gris'], ['#f3ede2', 'Crema']] },
    { key: 'm', label: 'Margen', def: '0.08', items: [['0', 'Sin margen'], ['0.08', 'Chico'], ['0.16', 'Grande']] }], 'Listo'),
};

// ---------------- orden para unir en un PDF (M4) ----------------
function orderScreen(files) {
  return new Promise((resolve) => {
    let items = files.map((f, i) => ({ f, i, u: kindOf(f) === 'image' && !/heic|heif/i.test(f.type + f.name) ? URL.createObjectURL(f) : null }));
    const start = items.slice();
    const pagesOf = new Map();
    const render = () => {
      const pages = items.reduce((n, it) => n + (kindOf(it.f) === 'pdf' ? (pagesOf.get(it.f) || 0) : 1), 0);
      const known = items.every((it) => kindOf(it.f) !== 'pdf' || pagesOf.has(it.f));
      $('#screen .sc-s').textContent = `${items.length} archivos${known ? ` · ${pages} páginas` : ''}`;
      $('#olist').innerHTML = items.map((it, i) => {
        const k = kindOf(it.f); const pg = pagesOf.get(it.f);
        return `<div class="orow" data-i="${i}"><span class="onum">${i + 1}</span><span class="oth">${it.u ? `<img src="${it.u}" alt="">` : (k === 'pdf' ? 'PDF' : 'IMG')}</span>`
          + `<span class="oinf"><b>${esc(it.f.name)}</b><small>${k === 'pdf' ? `PDF${pg ? ` · ${pg} ${pg === 1 ? 'página' : 'páginas'}` : ''}` : 'Foto · 1 página'}</small></span>`
          + `<button class="grip" aria-label="Mover ${esc(it.f.name)}" data-grip="${i}">${ICO.grip}</button></div>`;
      }).join('');
    };
    const s = openScreen(`<div class="sc-top"><button class="back" aria-label="Volver">${ICO.back}</button><div><div class="sc-t">Unir en un PDF</div><div class="sc-s"></div></div></div>`
      + '<p class="note" style="margin-top:0">Arrastrá desde los puntitos (o mantené apretada una fila) para cambiar el orden. Así quedan en el PDF.</p>'
      + '<div class="chips" style="margin-top:12px"><button class="chip" data-o="name">Por nombre</button><button class="chip" data-o="rev">Invertir</button><button class="chip" data-o="reset">Como estaba</button></div>'
      + '<div class="olist" id="olist"></div>', (b) => {
      const coll = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });
      if (b.dataset.o === 'name') items.sort((a, c) => coll.compare(a.f.name, c.f.name));
      if (b.dataset.o === 'rev') items.reverse();
      if (b.dataset.o === 'reset') items = start.slice();
      if (b.dataset.o) render();
    });
    const bar = document.createElement('div'); bar.className = 'bottom-bar';
    bar.innerHTML = '<div class="btns"><button class="btn" data-c="1">Cancelar</button><button class="btn pri" data-u="1">Unir</button></div>';
    document.body.appendChild(bar);
    const done = (v) => { closeAll(); resolve(v); };
    bar.onclick = (e) => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.u) done(items.map((it) => it.f)); else done(null); };
    $('.back', s).addEventListener('click', () => resolve(null), { once: true });
    render();
    // páginas de cada PDF (en segundo plano)
    (async () => { for (const it of items) if (kindOf(it.f) === 'pdf') { try { const d = await PDFDocument.load(await it.f.arrayBuffer(), { ignoreEncryption: true, updateMetadata: false }); pagesOf.set(it.f, d.getPageCount()); } catch { pagesOf.set(it.f, 0); } render(); } })();
    // arrastrar para ordenar (con el dedo o el mouse)
    const list = $('#olist');
    let drag = null, timer = null;
    const startDrag = (row, y) => {
      const rows = $$('.orow', list); const i = +row.dataset.i;
      drag = { i, to: i, y0: y, h: row.offsetHeight + 10, row, rows };
      row.classList.add('drag'); navigator.vibrate?.(10);
    };
    list.addEventListener('pointerdown', (e) => {
      const row = e.target.closest('.orow'); if (!row) return;
      if (e.target.closest('.grip')) { e.preventDefault(); startDrag(row, e.clientY); list.setPointerCapture(e.pointerId); return; }
      const y = e.clientY; clearTimeout(timer);
      timer = setTimeout(() => { startDrag(row, y); try { list.setPointerCapture(e.pointerId); } catch {} }, 320);
      list.dataset.py = y;
    });
    list.addEventListener('pointermove', (e) => {
      if (!drag) { if (timer && Math.abs(e.clientY - +list.dataset.py) > 8) { clearTimeout(timer); timer = null; } return; }
      e.preventDefault();
      const dy = e.clientY - drag.y0;
      const to = Math.max(0, Math.min(items.length - 1, drag.i + Math.round(dy / drag.h)));
      drag.to = to;
      drag.rows.forEach((r, j) => {
        if (j === drag.i) { r.style.transform = `translateY(${dy}px) scale(1.02)`; return; }
        const shift = (drag.i < to && j > drag.i && j <= to) ? -drag.h : (drag.i > to && j < drag.i && j >= to) ? drag.h : 0;
        r.style.transform = shift ? `translateY(${shift}px)` : ''; r.style.transition = 'transform 120ms';
      });
    });
    const end = () => {
      clearTimeout(timer); timer = null;
      if (!drag) return;
      const { i, to } = drag; drag = null;
      const [it] = items.splice(i, 1); items.splice(to, 0, it);
      render();
    };
    list.addEventListener('pointerup', end); list.addEventListener('pointercancel', end);
  });
}


// ---------------- renombrar (en el celu: copias con el nombre nuevo) ----------------
function renameScreen(files) {
  const RR = window.MXRename;
  const rules = JSON.parse(JSON.stringify(RR.DEFAULT_RULES));
  Object.assign(rules, store.get('mx-rn', {}));
  rules.tags.on = false;
  let items = files.map((f) => ({ f, name: f.name, mtime: f.lastModified }));
  const start = items.slice();
  const nm = KNAME[groupKind(files)] || KNAME.other;
  const DIG = [['3', '001'], ['2', '01'], ['1', '1'], ['0', 'Sin número']];
  const lines = () => String(rules.list.text || '').split(/\r?\n/).filter((x) => x.trim()).length;
  const summary = {
    list: () => (rules.list.on && lines() ? `${lines()} ${lines() === 1 ? 'nombre' : 'nombres'}` : 'Apagado'),
    replace: () => (rules.replace.on && rules.replace.find ? `«${rules.replace.find}» → «${rules.replace.with}»` : 'Apagado'),
    add: () => (rules.add.on && (rules.add.before || rules.add.after) ? [rules.add.before && `«${rules.add.before}» antes`, rules.add.after && `«${rules.add.after}» al final`].filter(Boolean).join(' · ') : 'Apagado'),
    case: () => (rules.case.on ? { title: 'Tipo Título', sentence: 'Como oración', lower: 'minúsculas', upper: 'MAYÚSCULAS' }[rules.case.mode] : 'Igual'),
    clean: () => (rules.clean.on ? [rules.clean.underscores && '_ → espacio', rules.clean.accents && 'sin acentos', rules.clean.doubles && 'espacios'].filter(Boolean).join(', ') || 'Apagado' : 'Apagado'),
    date: () => (rules.date.on ? (rules.date.pos === 'end' ? 'Al final' : 'Al principio') : 'Apagado'),
  };
  const RULES = [['list', 'Lista de nombres'], ['replace', 'Buscar y reemplazar'], ['add', 'Agregar antes / después'], ['case', 'Mayúsculas'], ['clean', 'Limpiar'], ['date', 'Fecha']];
  let out = [];
  const paint = () => {
    store.set('mx-rn', { ...rules, list: { on: false, text: '' } }); // la lista y los nombres a mano son para esta tanda
    out = RR.computeNames(items, rules);
    const changed = out.filter((o) => !o.same).length;
    $('#rnN').textContent = `${items.length} ${nm[items.length > 1 ? 1 : 0]}`;
    $$('#rnDig .chip').forEach((b) => b.classList.toggle('on', String(rules.base.on ? rules.base.digits : 0) === b.dataset.d && (rules.base.on || b.dataset.d === '0')));
    $$('.rn-sum-v').forEach((el) => { el.textContent = summary[el.dataset.s](); el.style.color = /Apagado|Igual/.test(el.textContent) ? '' : '#002FA7'; });
    $('#rnPrev').innerHTML = items.slice(0, 40).map((it, i) => `<button class="rn-p${out[i].clash ? ' clash' : ''}${out[i].fixed ? ' fixed' : ''}" data-pi="${i}" aria-label="Cambiar el nombre de ${esc(it.name)}"><small>${esc(it.name)}</small><b>${esc(out[i].name)}</b><span class="ed" aria-hidden="true">✎</span></button>`).join('')
      + (items.length > 40 ? `<p class="note">y ${items.length - 40} más…</p>` : '');
    $('#rnGo').textContent = changed ? `Guardar ${changed} ${changed === 1 ? 'copia' : 'copias'}` : 'No cambia ningún nombre';
    $('#rnGo').disabled = !changed;
  };
  openScreen(`<div class="sc-top"><button class="back" aria-label="Volver">${ICO.back}</button><div><div class="sc-t">Renombrar</div><div class="sc-s" id="rnN"></div></div><span class="art" style="margin-left:auto;width:44px;height:44px;border-radius:6px;overflow:hidden" aria-hidden="true">${D.covers['rename:s'] || ''}</span></div>`
    + `<div class="lbl" style="margin-top:6px">Nombre nuevo</div><input type="text" id="rnText" placeholder="Vacío = mantener el nombre y solo numerar" value="${esc(rules.base.text || '')}" autocomplete="off">`
    + `<div class="chips" id="rnDig" style="margin-top:10px">${DIG.map(([d, l]) => `<button class="chip" data-d="${d}">${l}</button>`).join('')}</div>`
    + `<div class="rn-card">${RULES.map(([k, t]) => `<button class="rn-r" data-rule="${k}"><span>${t}</span><span class="rn-sum-v" data-s="${k}"></span><span aria-hidden="true">›</span></button>`).join('')}</div>`
    + `<div class="rn-ph"><span>Así van a quedar</span></div><p class="note" style="margin:-4px 0 10px">Tocá uno para ponerle el nombre que quieras.</p><div class="chips" id="rnOrd" style="margin-bottom:10px">${[['given', 'Como los elegiste'], ['name', 'Por nombre'], ['date', 'Por fecha']].map(([v, l], i) => `<button class="chip${i ? '' : ' on'}" data-ord="${v}">${l}</button>`).join('')}</div><div class="rn-list" id="rnPrev"></div>`, async (b) => {
    if (b.dataset.d !== undefined) { const d = +b.dataset.d; rules.base.on = d > 0 || !!(rules.base.text || '').trim(); rules.base.digits = d; return paint(); }
    if (b.dataset.ord) {
      $$('#rnOrd .chip').forEach((x) => x.classList.toggle('on', x === b));
      const coll = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });
      if (b.dataset.ord === 'given') items = start.slice();
      if (b.dataset.ord === 'name') items.sort((a, c) => coll.compare(a.name, c.name));
      if (b.dataset.ord === 'date') items.sort((a, c) => a.mtime - c.mtime);
      return paint();
    }
    if (b.dataset.rule) { await editRule(b.dataset.rule); paint(); }
    if (b.dataset.pi !== undefined) { await editName(+b.dataset.pi); paint(); }
  });
  const bar = document.createElement('div'); bar.className = 'bottom-bar';
  bar.innerHTML = '<div class="btns"><button class="btn pri" id="rnGo">Guardar</button></div><p class="note" style="text-align:center;margin-top:8px">En el celu se guardan copias con el nombre nuevo</p>';
  document.body.appendChild(bar);
  bar.querySelector('#rnGo').onclick = async () => {
    const outs = items.map((it, i) => ({ name: out[i].name, blob: it.f, same: out[i].same })).filter((o) => !o.same).map(({ name, blob }) => ({ name, blob }));
    closeAll();
    for (const o of outs) lastOutputs.set(o.name, o.blob);
    pushRecent({ name: outs[0].name, n: outs.length, label: 'Renombrar', t: Date.now() });
    showResults(outs, 'Renombrar');
  };
  $('#rnText').addEventListener('input', (e) => { rules.base.text = e.target.value; if (e.target.value.trim()) rules.base.on = true; else if (!rules.base.digits) rules.base.on = false; paint(); });
  paint();
  // editar una regla en una hoja chica (la pantalla queda abajo)
  function editRule(k) {
    return new Promise((resolve) => {
      const r = rules[k];
      const sw = `<div class="pcrow" style="margin-top:6px"><div><div class="t">Usar esta regla</div></div><button class="sw${r.on ? ' on' : ''}" data-sw="1" aria-label="Usar esta regla"></button></div>`;
      const body = {
        replace: `<div class="lbl">Buscar</div><input type="text" data-f="find" value="${esc(r.find)}" placeholder="ej. IMG_"><div class="lbl">Reemplazar por</div><input type="text" data-f="with" value="${esc(r.with)}" placeholder="(nada = borrarlo)">`,
        add: `<div class="lbl">Antes del nombre</div><input type="text" data-f="before" value="${esc(r.before)}"><div class="lbl">Después del nombre</div><input type="text" data-f="after" value="${esc(r.after)}" placeholder="ej. (edit)">`,
        case: `<div class="chips" data-c="mode">${[['title', 'Tipo Título'], ['sentence', 'Como oración'], ['lower', 'minúsculas'], ['upper', 'MAYÚSCULAS']].map(([v, l]) => `<button class="chip${r.mode === v ? ' on' : ''}" data-v="${v}">${l}</button>`).join('')}</div>`,
        clean: `<div class="chips">${[['underscores', '_ → espacio'], ['accents', 'Sin acentos'], ['doubles', 'Sin espacios dobles']].map(([v, l]) => `<button class="chip${r[v] ? ' on' : ''}" data-t="${v}">${l}</button>`).join('')}</div>`,
        list: `<div class="lbl">Un nombre por línea, en orden</div><textarea data-f="text" rows="6" placeholder="Roberto&#10;Liliana&#10;…">${esc(r.text || '')}</textarea><p class="note">El 1.º archivo se llama como la 1.ª línea, y así. Si una línea queda vacía, ese archivo sigue las otras reglas.</p>`,
        date: `<div class="chips" data-c="pos">${[['start', 'Al principio'], ['end', 'Al final']].map(([v, l]) => `<button class="chip${r.pos === v ? ' on' : ''}" data-v="${v}">${l}</button>`).join('')}</div><p class="note">La fecha de cada archivo, como 2026-11-05.</p>`,
      }[k];
      const veil = $('#veil'); veil.style.zIndex = '29'; veil.hidden = false; const s = $('#sheet'); s.style.zIndex = '30'; $('.sheet-body', s).innerHTML = `<div class="sh-head"><div><div class="sh-t">${esc(RULES.find((x) => x[0] === k)[1])}</div></div><button class="x" aria-label="Listo">${ICO.x}</button></div>${sw}<div class="opts">${body}</div><div class="btns"><button class="btn pri" data-ok="1">Listo</button></div>`;
      s.hidden = false;
      const onVeil = (e) => { e.stopImmediatePropagation(); finish(); };
      const finish = () => { s.hidden = true; veil.hidden = true; veil.style.zIndex = ''; s.style.zIndex = ''; veil.removeEventListener('click', onVeil, true); s.onclick = null; s.oninput = null; resolve(); };
      veil.addEventListener('click', onVeil, true);
      s.oninput = (e) => { const f = e.target.dataset.f; if (f) { r[f] = e.target.value; r.on = true; $('[data-sw]', s).classList.add('on'); } };
      s.onclick = (e) => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.ok || b.classList.contains('x')) return finish();
        if (b.dataset.sw) { r.on = !r.on; b.classList.toggle('on', r.on); return; }
        const c = b.closest('[data-c]');
        if (c && b.dataset.v) { r[c.dataset.c] = b.dataset.v; r.on = true; $$('.chip', c).forEach((x) => x.classList.toggle('on', x === b)); $('[data-sw]', s).classList.add('on'); }
        if (b.dataset.t) { r[b.dataset.t] = !r[b.dataset.t]; r.on = true; b.classList.toggle('on', r[b.dataset.t]); $('[data-sw]', s).classList.add('on'); }
      };
    });
  }
  // nombre puesto a mano para un archivo
  function editName(i) {
    return new Promise((resolve) => {
      const it = items[i]; const [b0, ext] = RR.splitName(out[i].name);
      const veil = $('#veil'); veil.style.zIndex = '29'; veil.hidden = false; const s = $('#sheet'); s.style.zIndex = '30';
      $('.sheet-body', s).innerHTML = `<div class="sh-head"><div><div class="sh-t">Nombre nuevo</div><div class="sh-s">${esc(it.name)}</div></div><button class="x" aria-label="Cerrar">${ICO.x}</button></div>`
        + `<div class="opts"><div class="nm-row"><input type="text" id="nmIn" value="${esc(it.manual ?? b0)}" autocomplete="off" enterkeyhint="done" aria-label="Nombre nuevo"><span class="nm-ext">${esc(ext)}</span></div></div>`
        + `<div class="btns">${it.manual ? '<button class="btn" data-clr="1">Volver a las reglas</button>' : ''}<button class="btn pri" data-ok="1">Listo</button></div>`;
      s.hidden = false;
      const inp = $('#nmIn', s); setTimeout(() => { inp.focus(); inp.select(); }, 60);
      const onVeil = (e) => { e.stopImmediatePropagation(); finish(true); };
      const finish = (keep, clear) => {
        if (clear) it.manual = null; else if (keep) it.manual = inp.value.trim() || null;
        s.hidden = true; veil.hidden = true; veil.style.zIndex = ''; s.style.zIndex = ''; veil.removeEventListener('click', onVeil, true); s.onclick = null; inp.onkeydown = null; resolve();
      };
      veil.addEventListener('click', onVeil, true);
      inp.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); finish(true); } };
      s.onclick = (e) => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.clr) return finish(false, true);
        if (b.dataset.ok) return finish(true);
        if (b.classList.contains('x')) return finish(false);
      };
    });
  }
}

// ---------------- foto a texto (OCR, sin internet) ----------------
const loadScript = (src) => new Promise((res, rej) => { if (document.querySelector(`script[data-src="${src}"]`)) return res(); const el = document.createElement('script'); el.src = src; el.dataset.src = src; el.onload = res; el.onerror = () => rej(new Error(`No cargó ${src}`)); document.head.appendChild(el); });
let ocrW = null, ocrProg = null;
function ocrWorker() {
  if (!ocrW) {
    ocrW = (async () => {
      await loadScript('vendor/ocr/tesseract.min.js');
      await Promise.all([loadScript('vendor/ocr/spa.js'), loadScript('vendor/ocr/eng.js')]);
      const b64 = (t) => { const bin = atob(t); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
      const base = new URL('vendor/ocr/', location.href).href;
      const w = await window.Tesseract.createWorker([{ code: 'spa', data: b64(window.MX_OCR.spa) }, { code: 'eng', data: b64(window.MX_OCR.eng) }], 1, {
        workerPath: base + 'worker.min.js', corePath: base, workerBlobURL: false, cacheMethod: 'none',
        logger: (m) => { if (m.status === 'recognizing text' && ocrProg) ocrProg(m.progress); },
      });
      await w.setParameters({ user_defined_dpi: '300' });
      return w;
    })().catch((e) => { ocrW = null; throw e; });
  }
  return ocrW;
}
// endereza, pasa a gris, lleva a ~2200 px y saca la luz despareja (divide por una versión muy borrosa)
async function ocrPrepare(f) {
  const bmp = await createImageBitmap(f, { imageOrientation: 'from-image' }).catch(() => createImageBitmap(f));
  const long = Math.max(bmp.width, bmp.height);
  const target = long < 1600 ? Math.min(2400, long * 2) : Math.min(long, 2600);
  const W = Math.round(bmp.width * target / long), H = Math.round(bmp.height * target / long);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d', { willReadFrequently: true }); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.imageSmoothingQuality = 'high'; x.drawImage(bmp, 0, 0, W, H); bmp.close?.();
  const sw = Math.max(8, Math.round(W / 40)), sh = Math.max(8, Math.round(H / 40));
  const s1 = document.createElement('canvas'); s1.width = sw; s1.height = sh; const sx = s1.getContext('2d'); sx.imageSmoothingQuality = 'high'; sx.drawImage(c, 0, 0, sw, sh);
  const bgc = document.createElement('canvas'); bgc.width = W; bgc.height = H; const bx = bgc.getContext('2d', { willReadFrequently: true }); bx.imageSmoothingQuality = 'high'; bx.drawImage(s1, 0, 0, W, H);
  const img = x.getImageData(0, 0, W, H), bg = bx.getImageData(0, 0, W, H).data, d = img.data;
  const g = new Uint8ClampedArray(W * H), hist = new Uint32Array(256);
  for (let i = 0, j = 0; j < g.length; i += 4, j++) {
    const v = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2], b = 0.299 * bg[i] + 0.587 * bg[i + 1] + 0.114 * bg[i + 2];
    g[j] = (v / Math.max(1, b)) * 255; hist[g[j]]++;
  }
  let lo = 0, hi = 255, acc = 0; const n = g.length;
  for (let k = 0; k < 256; k++) { acc += hist[k]; if (acc > n * 0.01) { lo = k; break; } }
  acc = 0; for (let k = 255; k >= 0; k--) { acc += hist[k]; if (acc > n * 0.01) { hi = k; break; } }
  const sc = 255 / Math.max(1, hi - lo);
  for (let i = 0, j = 0; j < g.length; i += 4, j++) { const v = (g[j] - lo) * sc; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  x.putImageData(img, 0, 0);
  return c;
}
function ocrTidy(t) {
  return t.replace(/\r/g, '').replace(/(\p{L})-\n(\p{Ll})/gu, '$1$2')
    .split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim().replace(/^[|¦]\s+/, '').replace(/\s+[|¦]$/, ''))
    .filter((l) => !/^[^\p{L}\p{N}]{1,3}$/u.test(l)).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
async function ocrScreen(files) {
  closeAll();
  const res = [];
  busy('Preparando el lector…', 0); await nextFrame();
  try {
    const w = await ocrWorker();
    for (let i = 0; i < files.length; i++) {
      const f = files[i], base = i / files.length, part = 1 / files.length;
      const label = files.length > 1 ? `Leyendo ${i + 1} de ${files.length}…` : 'Leyendo el texto…';
      busy(label, base);
      ocrProg = (p) => busy(label, base + part * (0.15 + 0.85 * p));
      try {
        const cv = await ocrPrepare(f);
        const { data } = await w.recognize(cv);
        const text = ocrTidy(data.text || '');
        res.push({ f, name: f.name, text, conf: Math.round(data.confidence || 0), words: text ? text.split(/\s+/).length : 0 });
      } catch (e) { console.error(e); res.push({ f, name: f.name, text: '', error: String(e.message || e) }); }
    }
  } catch (e) {
    busy(false); console.error(e);
    return toast('No se pudo abrir el lector de texto en este navegador. En la app instalada va a andar.', 5000);
  } finally { ocrProg = null; }
  busy(false);
  const good = res.filter((r) => r.text);
  const urls = [];
  const all = () => good.map((r) => (good.length > 1 ? `── ${r.name} ──\n${r.text}` : r.text)).join('\n\n');
  const s = openScreen(`<div class="sc-top"><button class="back" aria-label="Volver">${ICO.back}</button><div><div class="sc-t">Foto a texto</div><div class="sc-s">${good.length ? 'Podés corregirlo antes de copiar' : 'No encontré texto'}</div></div><span class="art" style="margin-left:auto;width:44px;height:44px;border-radius:6px;overflow:hidden" aria-hidden="true">${D.covers['ocr:s'] || ''}</span></div>`
    + res.map((r, i) => {
      const u = URL.createObjectURL(r.f); urls.push(u);
      const meta = r.text ? `${r.words} ${r.words === 1 ? 'palabra' : 'palabras'}${r.conf < 60 ? ' · revisalo' : ''}` : (r.error ? 'No se pudo leer' : 'Sin texto');
      return `<div class="oc-card"><div class="oc-h"><img src="${u}" alt=""><span><b>${esc(r.name)}</b><small${r.conf < 60 || !r.text ? ' class="warn"' : ''}>${meta}</small></span>${r.text ? `<button class="mini" data-cp="${i}">Copiar</button>` : ''}</div>`
        + (r.text ? `<textarea data-ti="${i}" rows="6" spellcheck="true" lang="es" aria-label="Texto de ${esc(r.name)}">${esc(r.text)}</textarea>` : '<p class="note" style="margin:0">Probá con la foto más de cerca, derecha y con buena luz.</p>') + '</div>';
    }).join(''), async (b) => {
    if (b.dataset.cp !== undefined) { const r = res[+b.dataset.cp]; try { await navigator.clipboard.writeText(r.text); toast('Copiado ✓'); } catch { toast('No se pudo copiar'); } }
  });
  $$('textarea[data-ti]', s).forEach((t) => {
    const fit = () => { t.style.height = 'auto'; t.style.height = Math.min(window.innerHeight * 0.55, t.scrollHeight + 4) + 'px'; };
    t.addEventListener('input', () => { res[+t.dataset.ti].text = t.value; fit(); }); requestAnimationFrame(fit);
  });
  if (!good.length) return;
  const bar = document.createElement('div'); bar.className = 'bottom-bar';
  bar.innerHTML = `<div class="btns"><button class="btn" id="ocTxt">Guardar .txt</button><button class="btn pri" id="ocAll">${good.length > 1 ? 'Copiar todo' : 'Copiar'}</button></div>`;
  document.body.appendChild(bar);
  bar.querySelector('#ocAll').onclick = async () => { try { await navigator.clipboard.writeText(all()); toast('Copiado ✓'); } catch { toast('No se pudo copiar'); } };
  bar.querySelector('#ocTxt').onclick = () => {
    const stem = good[0].name.replace(/\.[^.]+$/, '');
    const o = { name: `${stem}${good.length > 1 ? ` y ${good.length - 1} más` : ''}.txt`, blob: new Blob(['\ufeff' + all()], { type: 'text/plain' }) };
    lastOutputs.set(o.name, o.blob);
    pushRecent({ name: o.name, n: 1, label: 'Foto a texto', t: Date.now() });
    saveOrShare([o]);
  };
}

// ---------------- resultados ----------------
function showResults(outs, label) {
  const urls = [];
  const html = `<div class="sh-head"><div><div class="sh-t">Listo ✓</div><div class="sh-s">${esc(label)} · ${outs.length} ${outs.length === 1 ? 'archivo' : 'archivos'}</div></div><button class="x" aria-label="Cerrar">${ICO.x}</button></div>`
    + `<div class="res">${outs.slice(0, 30).map((o, i) => {
      const isImg = o.blob.type.startsWith('image/'); let th = o.name.split('.').pop().toUpperCase();
      if (isImg) { const u = URL.createObjectURL(o.blob); urls.push(u); th = `<img src="${u}" alt="">`; }
      return `<div class="ritem"><span class="oth">${th}</span><span class="oinf"><b>${esc(o.name)}</b><small>${fmtSize(o.blob.size)}</small></span><button class="mini" data-save="${i}">Guardar</button></div>`;
    }).join('')}${outs.length > 30 ? `<p class="note">y ${outs.length - 30} más…</p>` : ''}</div>`
    + `<div class="btns"><button class="btn pri" data-all="1">${canShareFiles(outs) ? 'Compartir / guardar todo' : 'Bajar todo'}</button></div>`
    + '<p class="note">«Compartir» te deja guardarlo en Fotos o Archivos, o mandarlo a otra app.</p>';
  openSheet(html, (b) => {
    if (b.dataset.save !== undefined) return saveOrShare([outs[+b.dataset.save]]);
    if (b.dataset.all) return saveOrShare(outs);
  });
}
const toFile = (o) => new File([o.blob], o.name, { type: o.blob.type || 'application/octet-stream' });
function canShareFiles(outs) { try { return !!navigator.canShare && navigator.canShare({ files: outs.slice(0, 1).map(toFile) }); } catch { return false; } }
// dentro de claude.ai (link de prueba) se guarda con el permiso de descargas; en la app, con Compartir
let dlCapP = null;
function getDl() {
  // se pide de nuevo si la primera vez el visor todavía no estaba listo
  if (!dlCapP) dlCapP = (async () => { try { return window.claude?.use ? await window.claude.use('downloads') : null; } catch { return null; } })().then((v) => { if (!v) dlCapP = null; return v; });
  return dlCapP;
}
setTimeout(getDl, 0);
const DL_OK = new Set('gif png jpg jpeg webp mp4 webm txt json md pdf zip csv svg html'.split(' '));
async function saveOrShare(outs) {
  // dentro de claude.ai el permiso de descargas puede tardar unos segundos en estar listo
  const inFrame = window.top !== window.self;
  if (inFrame) busy('Preparando…', 0);
  const dl = await Promise.race([getDl(), new Promise((r) => setTimeout(() => r(null), inFrame ? 10000 : 300))]);
  busy(false);
  if (!dl && inFrame) { toast('Desde este link no se puede guardar. Abrilo en el navegador (Compartir → Abrir en el navegador) y probá de nuevo.', 5000); return; }
  if (dl) {
    for (const o of outs) {
      if (!DL_OK.has(extOf(o.name))) { toast(`No se puede guardar .${extOf(o.name)} desde acá`); continue; }
      try { await dl.save({ filename: o.name, data: o.blob }); }
      catch (e) { if (e?.code === 'declined') return; if (e?.code === 'rate_limited') { await new Promise((r) => setTimeout(r, 1500)); try { await dl.save({ filename: o.name, data: o.blob }); } catch {} } else { toast(`No se pudo guardar (${e?.code || 'error'})`); console.warn('save', e); return; } }
    }
    return;
  }
  if (canShareFiles(outs)) {
    try { await navigator.share({ files: outs.map(toFile) }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
  }
  for (const o of outs) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(o.blob); a.download = o.name;
    document.body.appendChild(a); a.click(); a.remove();
    await new Promise((r) => setTimeout(r, 250));
  }
}

// ---------------- procesado: imágenes ----------------
const MIME = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
async function loadImg(file) {
  const u = URL.createObjectURL(file);
  const img = new Image(); img.decoding = 'async'; img.src = u;
  try { await img.decode(); } catch { URL.revokeObjectURL(u); throw new Error(`No pude abrir ${file.name}`); }
  return { img, w: img.naturalWidth, h: img.naturalHeight, free: () => URL.revokeObjectURL(u) };
}
function canvasOf(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
async function encode(canvas, fmt, q = 0.92) {
  const blob = await new Promise((r) => canvas.toBlob(r, MIME[fmt], q));
  if (!blob) throw new Error('No se pudo guardar la imagen');
  if (blob.type !== MIME[fmt]) { const b2 = await new Promise((r) => canvas.toBlob(r, 'image/png')); return { blob: b2, ext: 'png' }; }
  return { blob, ext: fmt };
}
function outName(file, suffix, ext) { return `${baseOf(file.name)}${suffix ? ` (${suffix})` : ''}.${ext}`; }
const keepFmt = (file) => { const e = extOf(file.name).replace('jpeg', 'jpg'); return MIME[e] ? e : 'jpg'; };
function drawFlat(ctx, img, w, h, fill) { if (fill) { ctx.fillStyle = fill; ctx.fillRect(0, 0, w, h); } ctx.drawImage(img, 0, 0, w, h); }

async function imgConvert(file, fmt) {
  const { img, w, h, free } = await loadImg(file);
  const c = canvasOf(w, h); drawFlat(c.getContext('2d'), img, w, h, fmt === 'jpg' ? '#ffffff' : null); free();
  const { blob, ext } = await encode(c, fmt, 0.92);
  return { name: outName(file, '', ext), blob };
}
async function imgCompress(file, o) {
  const { img, w, h, free } = await loadImg(file);
  const max = +o.max; const k = max && Math.max(w, h) > max ? max / Math.max(w, h) : 1;
  const c = canvasOf(w * k, h * k); const fmt = keepFmt(file) === 'png' ? 'webp' : keepFmt(file);
  drawFlat(c.getContext('2d'), img, c.width, c.height, fmt === 'jpg' ? '#ffffff' : null); free();
  let { blob, ext } = await encode(c, fmt, +o.q);
  if (ext === 'png') ({ blob, ext } = await encode(c, 'jpg', +o.q));
  return { name: outName(file, 'comprimido', ext), blob };
}
async function imgResize(file, o) {
  const { img, w, h, free } = await loadImg(file);
  const k = o.s.startsWith('p') ? +o.s.slice(1) / 100 : +o.s.slice(1) / w;
  const c = canvasOf(w * k, h * k); const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high';
  const fmt = keepFmt(file); drawFlat(ctx, img, c.width, c.height, fmt === 'jpg' ? '#ffffff' : null); free();
  const { blob, ext } = await encode(c, fmt, 0.92);
  return { name: outName(file, `${c.width}x${c.height}`, ext), blob };
}
async function imgRotate(file, o) {
  const { img, w, h, free } = await loadImg(file);
  const side = o.a === '90' || o.a === '270';
  const c = canvasOf(side ? h : w, side ? w : h); const ctx = c.getContext('2d');
  const fmt = keepFmt(file); if (fmt === 'jpg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); }
  ctx.translate(c.width / 2, c.height / 2);
  if (o.a === 'flip') ctx.scale(-1, 1); else ctx.rotate((+o.a * Math.PI) / 180);
  ctx.drawImage(img, -w / 2, -h / 2); free();
  const { blob, ext } = await encode(c, fmt, 0.92);
  return { name: outName(file, 'rotada', ext), blob };
}
async function imgCrop(file, o) {
  const { img, w, h, free } = await loadImg(file);
  const r = +o.r; let cw = w, ch = Math.round(w / r);
  if (ch > h) { ch = h; cw = Math.round(h * r); }
  const c = canvasOf(cw, ch); c.getContext('2d').drawImage(img, (w - cw) / 2, (h - ch) / 2, cw, ch, 0, 0, cw, ch); free();
  const { blob, ext } = await encode(c, keepFmt(file), 0.92);
  return { name: outName(file, 'recortada', ext), blob };
}
async function imgBackground(file, o) {
  const { img, w, h, free } = await loadImg(file);
  const side = Math.max(w, h) / (1 - 2 * +o.m);
  const c = canvasOf(side, side); const ctx = c.getContext('2d');
  ctx.fillStyle = o.c; ctx.fillRect(0, 0, c.width, c.height);
  ctx.shadowColor = 'rgba(0,0,0,0.22)'; ctx.shadowBlur = side * 0.025; ctx.shadowOffsetY = side * 0.01;
  ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h); free();
  const { blob, ext } = await encode(c, 'jpg', 0.92);
  return { name: outName(file, 'con fondo', ext), blob };
}
async function imgStrip(file) {
  const { img, w, h, free } = await loadImg(file);
  const c = canvasOf(w, h); const fmt = keepFmt(file); drawFlat(c.getContext('2d'), img, w, h, fmt === 'jpg' ? '#ffffff' : null); free();
  const { blob, ext } = await encode(c, fmt, 0.95);
  return { name: outName(file, 'sin metadata', ext), blob };
}
// imagen → página de PDF (JPG adentro, del tamaño de la foto)
async function embedImage(doc, file) {
  const { img, w, h, free } = await loadImg(file);
  const c = canvasOf(w, h); drawFlat(c.getContext('2d'), img, w, h, '#ffffff'); free();
  const { blob } = await encode(c, 'jpg', 0.9);
  const jpg = await doc.embedJpg(await blob.arrayBuffer());
  const pw = w * 0.75, ph = h * 0.75;
  doc.addPage([pw, ph]).drawImage(jpg, { x: 0, y: 0, width: pw, height: ph });
}

// ---------------- procesado: PDF ----------------
let pdfjs = null;
async function getPdfjs() {
  if (pdfjs) return pdfjs;
  pdfjs = await import('./vendor/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdf.worker.min.mjs', import.meta.url).href;
  return pdfjs;
}
const loadPdf = async (file) => PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true, updateMetadata: false });
const pdfBlob = async (doc) => new Blob([await doc.save()], { type: 'application/pdf' });
async function joinPdf(files, onP) {
  const out = await PDFDocument.create();
  for (const [i, f] of files.entries()) {
    onP(i / files.length, `Uniendo ${i + 1} de ${files.length}…`);
    if (kindOf(f) === 'pdf') { const src = await loadPdf(f); (await out.copyPages(src, src.getPageIndices())).forEach((p) => out.addPage(p)); }
    else await embedImage(out, f);
  }
  out.setProducer('MIXTAPE'); out.setCreator('MIXTAPE');
  return [{ name: outName(files[0], files.length > 1 ? 'unido' : '', 'pdf'), blob: await pdfBlob(out) }];
}
async function splitPdf(file) {
  const src = await loadPdf(file); const outs = [];
  for (const i of src.getPageIndices()) {
    const d = await PDFDocument.create(); const [p] = await d.copyPages(src, [i]); d.addPage(p);
    outs.push({ name: `${baseOf(file.name)} - página ${i + 1}.pdf`, blob: await pdfBlob(d) });
  }
  return outs;
}
async function rotatePdf(file, o) {
  const d = await loadPdf(file);
  for (const p of d.getPages()) p.setRotation(degrees((p.getRotation().angle + +o.a) % 360));
  return [{ name: outName(file, 'rotado', 'pdf'), blob: await pdfBlob(d) }];
}
async function stripPdf(file) {
  const d = await loadPdf(file);
  d.setTitle(''); d.setAuthor(''); d.setSubject(''); d.setKeywords([]); d.setProducer(''); d.setCreator('');
  return [{ name: outName(file, 'sin metadata', 'pdf'), blob: await pdfBlob(d) }];
}
async function pdfToImages(file, fmt, onP) {
  const lib = await getPdfjs();
  const doc = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const outs = [];
  for (let i = 1; i <= doc.numPages; i++) {
    onP((i - 1) / doc.numPages, `Página ${i} de ${doc.numPages}…`);
    const page = await doc.getPage(i); const vp = page.getViewport({ scale: 2 });
    const c = canvasOf(vp.width, vp.height); const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    const { blob, ext } = await encode(c, fmt, 0.92);
    outs.push({ name: `${baseOf(file.name)} - página ${i}.${ext}`, blob });
  }
  return outs;
}
async function pdfToText(file) {
  const lib = await getPdfjs();
  const doc = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  let txt = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const tc = await (await doc.getPage(i)).getTextContent();
    let line = '', lastY = null;
    for (const it of tc.items) { const y = it.transform?.[5]; if (lastY !== null && Math.abs(y - lastY) > 2) { txt += line.trimEnd() + '\n'; line = ''; } line += it.str; lastY = y; }
    txt += line.trimEnd() + '\n\n';
  }
  return [{ name: outName(file, '', 'txt'), blob: new Blob([txt], { type: 'text/plain' }) }];
}

// ---------------- despachador ----------------
async function process(files, kind, job, o, onP) {
  const outs = [];
  const each = async (list, fn) => { for (const [i, f] of list.entries()) { onP(i / list.length, list.length > 1 ? `Archivo ${i + 1} de ${list.length}…` : 'Procesando…'); await nextFrame(); [].concat(await fn(f)).forEach((x) => outs.push(x)); } };
  const imgs = files.filter((f) => kindOf(f) === 'image'), pdfs = files.filter((f) => kindOf(f) === 'pdf');
  if (job.id === 'pdf_join' || job.id === 'merge' || (job.ring === 'format' && job.id === 'pdf' && kind === 'image')) return joinPdf(files.filter((f) => ['image', 'pdf'].includes(kindOf(f))), onP);
  if (kind === 'image') {
    if (job.ring === 'format') await each(imgs, (f) => imgConvert(f, job.id));
    else {
      const fn = { compress: imgCompress, resize: imgResize, rotate: imgRotate, crop: imgCrop, background: imgBackground, strip: imgStrip }[job.id];
      if (!fn) throw new Error('Esa herramienta todavía no está en el celu');
      await each(imgs, (f) => fn(f, o));
    }
  } else if (kind === 'pdf') {
    if (job.ring === 'format') await each(pdfs, (f) => (job.id === 'txt' ? pdfToText(f) : pdfToImages(f, job.id, onP)));
    else {
      const fn = { split: splitPdf, rotate: rotatePdf, strip: stripPdf }[job.id];
      if (!fn) throw new Error('Esa herramienta todavía no está en el celu');
      await each(pdfs, (f) => fn(f, o));
    }
  } else throw new Error('Audio y video en el celu llegan en la próxima parte');
  if (!outs.length) throw new Error('No salió ningún archivo');
  return outs;
}

// ---------------- recientes y ajustes ----------------
function showRecents() {
  const html = `<div class="sh-head"><div><div class="sh-t">Lo último</div><div class="sh-s">Lo que hiciste en este celu</div></div><button class="x" aria-label="Cerrar">${ICO.x}</button></div>`
    + (recents.length ? `<div class="res">${recents.slice(0, 30).map((r, i) => `<div class="ritem"><span class="oinf"><b>${esc(r.name)}</b><small>${esc(r.label)}${r.n > 1 ? ` · ${r.n} archivos` : ''} · ${new Date(r.t).toLocaleString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</small></span>${lastOutputs.has(r.name) ? `<button class="mini" data-r="${i}">Compartir</button>` : ''}</div>`).join('')}</div>`
      + '<div class="btns"><button class="btn" data-clear="1">Borrar la lista</button></div>' : '<p class="note">Todavía no hiciste nada en este celu.</p>');
  openSheet(html, (b) => {
    if (b.dataset.r) { const r = recents[+b.dataset.r]; return saveOrShare([{ name: r.name, blob: lastOutputs.get(r.name) }]); }
    if (b.dataset.clear) { recents = []; store.set('mx-recientes', []); paintShelf(); closeAll(); }
  });
}
function showSettings() {
  openSheet(`<div class="sh-head"><div><div class="sh-t">Ajustes</div><div class="sh-s">MIXTAPE para el celu · versión de prueba</div></div><button class="x" aria-label="Cerrar">${ICO.x}</button></div>`
    + `<div class="pcrow">${ICO.pc}<div><div class="t">Conectar con la compu</div><div class="s">Para stems, MIDI, texto, mejorar y bajar links. Llega en la próxima parte.</div></div></div>`
    + '<p class="note">Las fotos y PDFs se procesan acá en el celu: no se sube nada a ningún lado.</p>');
}

// ---------------- arranque ----------------
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (a === 'elegir') return pickFiles(null, true).then((f) => f.length && sheetForFiles(f));
  if (a === 'todas') return showTodas();
  if (a === 'ajustes') return showSettings();
  if (a === 'recientes') return showRecents();
  if (a === 'link') return linkSheet();
});
$('#shelf').addEventListener('click', (e) => { if (e.target.closest('.spine')) showRecents(); });
addEventListener('resize', () => { fitStage(); paintCovers(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
buildHub();
// para pruebas y para la app instalada (que recibe archivos desde Compartir)
window.MX = { sheetForFiles, orderScreen, process, run, showTodas };
