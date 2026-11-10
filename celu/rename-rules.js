// Reglas del renombrador masivo (las usan la compu y el celu).
// computeNames(items, rules) → [{ base, ext, name, clash }]
//   items: [{ name: 'IMG_4021.jpg', mtime: ms, tags?: { artist, title }, manual?: 'Roberto' }] en el orden de la numeración
//   Un nombre puesto a mano (manual) o de la lista de nombres gana: a ese archivo no se le aplican las otras reglas.
//   rules: ver DEFAULT_RULES. Se aplican en este orden: etiquetas (como punto de partida), nombre + número,
//   buscar y reemplazar, agregar texto, mayúsculas, limpiar, fecha. La extensión nunca se toca.
(function (root) {
  const DEFAULT_RULES = {
    list: { on: false, text: '' },                // un nombre por línea, en orden
    base: { on: true, text: '', start: 1, digits: 3, pos: 'end' },
    replace: { on: false, find: '', with: '', caseSens: false },
    add: { on: false, before: '', after: '' },
    case: { on: false, mode: 'title' },          // lower | upper | title | sentence
    clean: { on: false, underscores: true, accents: false, doubles: true },
    date: { on: false, pos: 'start' },           // start | end  (AAAA-MM-DD)
    tags: { on: false, mode: 'artist-title' },   // artist-title | title
  };

  function splitName(n) {
    const i = n.lastIndexOf('.');
    if (i <= 0 || i === n.length - 1) return [n, ''];
    return [n.slice(0, i), n.slice(i)];
  }
  const pad = (n, d) => String(n).padStart(d, '0');
  const ymd = (ms) => { const d = new Date(ms || Date.now()); return `${d.getFullYear()}-${pad(d.getMonth() + 1, 2)}-${pad(d.getDate(), 2)}`; };
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const titleCase = (s) => s.toLocaleLowerCase('es').replace(/(^|[\s\-_(\[])(\p{L})/gu, (m, a, b) => a + b.toLocaleUpperCase('es'));
  const sentence = (s) => { const t = s.toLocaleLowerCase('es'); return t.replace(/\p{L}/u, (c) => c.toLocaleUpperCase('es')); };
  // caracteres que Windows/Mac no aceptan en un nombre
  const safe = (s) => s.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-').replace(/[. ]+$/g, '').trim();

  function computeNames(items, rules, existing) {
    const r = { ...DEFAULT_RULES, ...rules };
    const list = r.list && r.list.on ? String(r.list.text || '').split(/\r?\n/) : [];
    const out = items.map((it, i) => {
      const [orig, ext] = splitName(it.name);
      const fixed = (it.manual != null && String(it.manual).trim()) || (list[i] || '').trim();
      if (fixed) {
        const fb = safe(splitName(fixed)[1].toLowerCase() === ext.toLowerCase() ? splitName(fixed)[0] : fixed) || orig;
        return { base: fb, ext, name: fb + ext, clash: false, same: fb + ext === it.name, fixed: it.manual ? 'manual' : 'list' };
      }
      let b = orig;
      if (r.tags.on && it.tags && (it.tags.title || it.tags.artist)) {
        b = r.tags.mode === 'title' || !it.tags.artist ? (it.tags.title || b) : `${it.tags.artist} - ${it.tags.title || b}`;
      }
      if (r.base.on) {
        const txt = String(r.base.text || '').trim();
        const num = r.base.digits > 0 ? pad(Number(r.base.start || 0) + i, Number(r.base.digits)) : '';
        const core = txt || b;
        b = !num ? core : r.base.pos === 'start' ? `${num} ${core}` : `${core} ${num}`;
      }
      if (r.replace.on && r.replace.find) {
        b = b.replace(new RegExp(escRe(r.replace.find), r.replace.caseSens ? 'g' : 'gi'), r.replace.with || '');
      }
      if (r.add.on) b = `${r.add.before || ''}${b}${r.add.after || ''}`;
      if (r.case.on) {
        b = r.case.mode === 'lower' ? b.toLocaleLowerCase('es') : r.case.mode === 'upper' ? b.toLocaleUpperCase('es')
          : r.case.mode === 'sentence' ? sentence(b) : titleCase(b);
      }
      if (r.clean.on) {
        if (r.clean.underscores) b = b.replace(/[_]+/g, ' ');
        if (r.clean.accents) b = b.normalize('NFD').replace(/[̀-ͯ]/g, '');
        if (r.clean.doubles) b = b.replace(/\s{2,}/g, ' ').trim();
      }
      if (r.date.on) b = r.date.pos === 'end' ? `${b} ${ymd(it.mtime)}` : `${ymd(it.mtime)} ${b}`;
      b = safe(b) || orig;
      return { base: b, ext, name: b + ext, clash: false, same: b + ext === it.name };
    });
    // choques: dentro de la tanda, o con archivos que ya están en la carpeta (y que no se renombran)
    //   existing: nombres que ya hay en cada carpeta, como "carpeta|nombre" (en el celu no hace falta)
    const key = (dir, n) => `${dir || ''}|${n}`.toLowerCase();
    const taken = new Set((existing || []).map((n) => n.toLowerCase()));
    const leaving = new Set(items.map((it) => key(it.dir, it.name)));
    const used = new Set();
    out.forEach((o, i) => {
      const dir = items[i].dir;
      let name = o.name, k = 2;
      const busy = (n) => used.has(key(dir, n)) || (taken.has(key(dir, n)) && !leaving.has(key(dir, n)));
      while (busy(name)) { name = `${o.base} (${k++})${o.ext}`; }
      if (name !== o.name) { o.clash = true; o.name = name; o.same = false; }
      used.add(key(dir, name));
    });
    return out;
  }

  const api = { DEFAULT_RULES, computeNames, splitName };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MXRename = api;
})(typeof window !== 'undefined' ? window : globalThis);
