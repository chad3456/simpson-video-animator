// node tools/stills.mjs out_dir t1 t2 ...  (times in seconds, or a.p for act/progress)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import http from 'http';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } const ext = path.extname(f); r.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' }[ext] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0);
const port = srv.address().port;
const [out, ...ts] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
pg.on('console', m => console.log('console:', m.text())); pg.on('pageerror', e => console.log('ERR', e.message));
await pg.goto(`http://localhost:${port}/film.html?w=1280&captions=0`); await pg.evaluate(() => window.ready);
const durs = fs.existsSync(path.join(root, 'build/durations.json')) ? JSON.parse(fs.readFileSync(path.join(root, 'build/durations.json'))) : {};
const S = await pg.evaluate((d) => { const S = window.setup(d); return { total: S.total, acts: S.acts.map(a => [a.start, a.end]) }; }, durs);
console.log('total', S.total.toFixed(1), S.acts.map(a => a.map(x => x.toFixed(0)).join('-')).join(' '));
for (const ts0 of ts) {
  let t = +ts0;
  if (ts0.includes(':')) { const [a, p] = ts0.split(':').map(Number); t = await pg.evaluate(([a, p]) => LL.timeAtP(window.S.acts[a].knots, p), [a, p]); }
  const r = await pg.evaluate((t) => window.renderAt(t), t);
  const buf = Buffer.from((await pg.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', 0.85))).split(',')[1], 'base64');
  fs.writeFileSync(path.join(out, `${ts0.replace(':', '_')}.jpg`), buf);
}
await b.close(); srv.close();
