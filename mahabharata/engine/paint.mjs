// Paint driver: node paint.mjs jobs.json [--workers 3]
// jobs: [{shot, layer, t, seed, out, mask:true|false, png:false}]  out = path without extension (writes out.jpg/.png and out.mask.png)
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const root = path.dirname(new URL(import.meta.url).pathname);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = http.createServer((req, res) => { const p = path.join(root, decodeURIComponent(req.url.split('?')[0])); if (!p.startsWith(root) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res); }).listen(0);
const port = server.address().port;
let jobs = JSON.parse(fs.readFileSync(args[0], 'utf8'));
if (!args.includes('--force')) jobs = jobs.filter(j => !fs.existsSync(j.out + (j.png ? '.png' : '.jpg')));
const nW = Math.min(Number(opt('workers', 3)), Math.max(1, jobs.length));
const W = Number(opt('w', 1600)), H = Number(opt('h', 900));
console.log(`${jobs.length} jobs, ${nW} workers`);
const browser = await chromium.launch();
let next = 0, done = 0; const t0 = Date.now();
async function openPage() {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on('pageerror', e => console.log('PAGE ERROR', e.message)); page.on('console', m => { if (m.type() === 'error' || m.text().startsWith('LOG')) console.log('console:', m.text()); });
  await page.goto(`http://127.0.0.1:${port}/paint.html?w=${W}&h=${H}`); await page.waitForFunction('window.__ready === true');
  return page;
}
async function worker(id) {
  let page = await openPage(), sinceOpen = 0;
  while (next < jobs.length) {
    const j = jobs[next++];
    let r = null;
    for (let attempt = 0; attempt < 3 && !r; attempt++) {
      try { r = await page.evaluate(job => window.paint(job), j); }
      catch (e) { console.log(`worker ${id} retry ${j.out}: ${e.message.split('\n')[0]}`); try { await page.close(); } catch { } page = await openPage(); sinceOpen = 0; }
    }
    if (!r) { console.log('FAILED', j.out); continue; }
    fs.mkdirSync(path.dirname(j.out), { recursive: true });
    fs.writeFileSync(j.out + (j.png ? '.png' : '.jpg'), Buffer.from(r.rgb.split(',')[1], 'base64'));
    if (r.mask) fs.writeFileSync(j.out + '.mask.png', Buffer.from(r.mask.split(',')[1], 'base64'));
    done++; if (done % 25 === 0 || jobs.length < 30) console.log(`${done}/${jobs.length} ${((Date.now() - t0) / 1000).toFixed(0)}s ${j.out}`);
    if (++sinceOpen >= 150) { await page.close(); page = await openPage(); sinceOpen = 0; }   // keep memory bounded
  }
}
await Promise.all([...Array(nW)].map((_, i) => worker(i)));
await browser.close(); server.close();
