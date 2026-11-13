// Render paintings to JPEG. usage: node ramayana/tools/export.mjs [--only 2,15] [--scale 1.5] [--out dir] [--q 90] [--off grain,vig]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import http from 'http'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const only = arg('only'), scale = +arg('scale', 1.5), out = path.resolve(arg('out', path.join(root, 'ramayana/images'))), q = +arg('q', 90), off = arg('off');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.json': 'application/json' };
const srv = http.createServer((req, res) => { const p = path.join(root, decodeURIComponent(req.url.split('?')[0])); fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); res.end(); } else { res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); res.end(b); } }); }).listen(0);
const port = srv.address().port;
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: scale })).newPage();
page.on('pageerror', (e) => console.log('  pageerror:', String(e).slice(0, 400)));
await page.goto(`http://localhost:${port}/ramayana/view.html?still=1`);
await page.waitForFunction('window.R && R.paintings.length');
const list = await page.evaluate(() => R.paintings.map((p) => ({ n: p.n, slug: p.slug, title: p.title, kanda: p.kanda, ref: p.ref || '', text: p.text, aside: p.aside || '' })).sort((a, b) => a.n - b.n));
fs.mkdirSync(out, { recursive: true });
const want = only ? only.split(',').flatMap((s) => { const m = s.split('-').map(Number); return m.length === 2 ? Array.from({ length: m[1] - m[0] + 1 }, (_, i) => m[0] + i) : [m[0]]; }) : null;
for (const m of list) {
  if (want && !want.includes(m.n)) continue;
  await page.goto(`http://localhost:${port}/ramayana/view.html?still=1&p=${m.n}${off ? '&off=' + off : ''}`);
  await page.waitForFunction('window.__ready === true', null, { timeout: 90000 });
  await page.screenshot({ path: path.join(out, `${String(m.n).padStart(3, '0')}-${m.slug}.jpg`), type: 'jpeg', quality: q });
  console.log(m.n, m.slug);
}
if (!want && !arg('out')) fs.writeFileSync(path.join(root, 'ramayana/paintings.json'), JSON.stringify(list, null, 1));
await b.close(); srv.close();
