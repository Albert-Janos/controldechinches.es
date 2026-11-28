// Minimal local static server for testing (no dependencies). Mimics the production rules that matter:
//  - directory -> index.html, real 404 with 404.html, no caching
//  - non-public paths are NOT served (same list as .deployignore)
// Usage: node tools/serve.mjs [port] [root]
import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = normalize(process.argv[3] || join(here, '..'));
const port = Number(process.argv[2] || 4173);
const blocked = ['.git', 'docs', 'tools', 'tests', 'data', 'content', 'templates', 'raw-images', '_archive-private', 'reports', 'node_modules', '.claude'];
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm' };

const compressible = /^(text\/|application\/(json|xml|javascript)|image\/svg)/;
const gz = new Map();
async function send(res, code, file, req) {
  let body = await readFile(file);
  const type = mime[extname(file)] || 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Cache-Control': 'no-store', ...(process.env.NOINDEX_HEADER === '0' ? {} : { 'X-Robots-Tag': 'noindex' }) };
  // mimic production: gzip for text, long cache for static assets (set COMPRESS=0 / PRODLIKE=0 to disable)
  if (process.env.PRODLIKE !== '0') {
    if (/\.(webp|avif|png|jpe?g|svg|ico|woff2?)$/.test(file)) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    else if (/\.(css|js)$/.test(file)) headers['Cache-Control'] = 'public, max-age=2592000';
    else headers['Cache-Control'] = 'public, max-age=0, must-revalidate';
    if (compressible.test(type) && /gzip/.test(req?.headers['accept-encoding'] || '')) { const k = file + body.length; if (!gz.has(k)) gz.set(k, gzipSync(body)); body = gz.get(k); headers['Content-Encoding'] = 'gzip'; headers['Vary'] = 'Accept-Encoding'; }
  }
  // byte ranges (what Apache does for video): lets <video preload="metadata"> fetch only the start of the file
  const rg = /^bytes=(\d*)-(\d*)$/.exec(req?.headers.range || '');
  if (rg && /^video\//.test(type) && code === 200) {
    const total = body.length, start = rg[1] === '' ? Math.max(0, total - Number(rg[2])) : Number(rg[1]), end = rg[1] !== '' && rg[2] !== '' ? Math.min(Number(rg[2]), total - 1) : total - 1;
    res.writeHead(206, { ...headers, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${total}`, 'Content-Length': end - start + 1 });
    return res.end(body.subarray(start, end + 1));
  }
  if (/^video\//.test(type)) headers['Accept-Ranges'] = 'bytes';
  res.writeHead(code, headers);
  res.end(body);
}
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    let p = decodeURIComponent(url.pathname);
    const first = p.split('/').filter(Boolean)[0];
    if (blocked.includes(first) || p.includes('..') || /\.(md|csv|log|zip)$/i.test(p)) return send(res, 404, join(root, '404.html'), req);
    let file = normalize(join(root, p));
    if (!file.startsWith(root)) return send(res, 404, join(root, '404.html'), req);
    let st = await stat(file).catch(() => null);
    if (st?.isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' + url.search }); return res.end(); }
      file = join(file, 'index.html'); st = await stat(file).catch(() => null);
    }
    if (!st) return send(res, 404, join(root, '404.html'), req);
    return send(res, 200, file, req);
  } catch (e) { res.writeHead(500); res.end(String(e)); }
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} on http://127.0.0.1:${port}`));
