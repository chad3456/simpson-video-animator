// Render the film, or a slice of it. usage: node ramayana/tools/film.mjs --from 1 --to 25 --out seg1.mp4 [--secs 6] [--fps 24] [--title]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import http from 'http'; import fs from 'fs'; import path from 'path'; import { spawn } from 'child_process'; import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const from = +arg('from', 1), to = +arg('to', 100), secs = +arg('secs', 6), fps = +arg('fps', 24), out = arg('out', 'film.mp4'), title = process.argv.includes('--title');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf' };
const srv = http.createServer((req, res) => { const p = path.join(root, decodeURIComponent(req.url.split('?')[0])); fs.readFile(p, (e, b) => { if (e) { res.writeHead(404); res.end(); } else { res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); res.end(b); } }); }).listen(0);
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 })).newPage();
page.on('pageerror', (e) => console.log('pageerror', String(e).slice(0, 300)));
await page.goto(`http://localhost:${srv.address().port}/ramayana/view.html?film=1`); await page.waitForFunction('window.__ready === true'); await page.evaluate(() => document.fonts.ready);
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
const shot = async (n, big, dur) => { await page.evaluate(([n, big]) => window.__film.load(n, big), [n, big]); const N = Math.round(dur * fps); for (let f = 0; f < N; f++) { await page.evaluate(([u, s]) => window.__film.draw(u, s), [f / (N - 1), dur]); const buf = await page.screenshot({ type: 'jpeg', quality: 92 }); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r)); } };
if (title) await shot(15, 'Ramayana in one hundred paintings', 7);
for (let n = from; n <= to; n++) { await shot(n, null, secs); console.log(n); }
ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await b.close(); srv.close();
