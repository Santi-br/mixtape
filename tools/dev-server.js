// Servidor estático mínimo para abrir la web en el navegador con "Abrir (dev).bat".
// Hace falta porque js/main.js hace fetch('version.json'): abriendo index.html
// directo con file:// el navegador bloquea ese fetch (CORS). No tiene dependencias,
// solo usa los módulos propios de Node.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.PORT) || 5473;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Prohibido'); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('No encontrado: ' + urlPath); }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  const url = `http://localhost:${PORT}/`;
  console.log('Sirviendo ' + ROOT + ' en ' + url + ' (Ctrl+C para cerrar)');
  require('child_process').exec('start "" "' + url + '"');
});
