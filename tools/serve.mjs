// Minimal local static server for testing (no dependencies). Mimics the production rules that matter:
//  - directory -> index.html, real 404 with 404.html, no caching
//  - non-public paths are NOT served (same list as .deployignore)
// Usage: node tools/serve.mjs [port] [root]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = normalize(process.argv[3] || join(here, '..'));
const port = Number(process.argv[2] || 4173);
const blocked = ['.git', 'docs', 'tools', 'tests', 'data', 'content', 'templates', 'raw-images', '_archive-private', 'reports', 'node_modules', '.claude'];
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2' };

async function send(res, code, file) {
  const body = await readFile(file);
  res.writeHead(code, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' });
  res.end(body);
}
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    let p = decodeURIComponent(url.pathname);
    const first = p.split('/').filter(Boolean)[0];
    if (blocked.includes(first) || p.includes('..') || /\.(md|csv|log|zip)$/i.test(p)) return send(res, 404, join(root, '404.html'));
    let file = normalize(join(root, p));
    if (!file.startsWith(root)) return send(res, 404, join(root, '404.html'));
    let st = await stat(file).catch(() => null);
    if (st?.isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' + url.search }); return res.end(); }
      file = join(file, 'index.html'); st = await stat(file).catch(() => null);
    }
    if (!st) return send(res, 404, join(root, '404.html'));
    return send(res, 200, file);
  } catch (e) { res.writeHead(500); res.end(String(e)); }
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} on http://127.0.0.1:${port}`));
