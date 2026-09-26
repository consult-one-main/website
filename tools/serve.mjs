import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Liegt in tools/, bedient bzw. schreibt aber das Projektverzeichnis darüber.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.pdf':  'application/pdf',
  '.xml':  'application/xml',
  '.txt':  'text/plain',
  '.ttf':  'font/ttf',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

// Bildet das Verhalten von GitHub Pages nach: /pfad/ wird aus /pfad/index.html
// bedient, alles Unbekannte landet auf 404.html.
function resolve(urlPath) {
  const candidates = [urlPath];
  if (urlPath.endsWith('/')) candidates.push(urlPath + 'index.html');
  else candidates.push(urlPath + '/index.html');
  for (const c of candidates) {
    const f = path.join(ROOT, c);
    try { if (fs.statSync(f).isFile()) return f; } catch {}
  }
  return null;
}

function serve404(res) {
  const notFound = path.join(ROOT, '404.html');
  try {
    const body = fs.readFileSync(notFound);
    res.writeHead(404, { 'Content-Type': MIME['.html'], 'Content-Length': body.length });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = resolve(urlPath);
  if (!filePath) { serve404(res); return; }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) { serve404(res); return; }

    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    const range = req.headers.range;

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end   = endStr ? parseInt(endStr, 10) : stat.size - 1;
      const chunk = end - start + 1;
      res.writeHead(206, {
        'Content-Range':  `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges':  'bytes',
        'Content-Length': chunk,
        'Content-Type':   mime,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type':   mime,
        'Accept-Ranges':  'bytes',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}).listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
