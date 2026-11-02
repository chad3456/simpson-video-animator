// Render the showreel to MP4: headless Chromium draws each frame, ffmpeg encodes and muxes the soundtrack.
// Usage: node render.mjs [--fps 30] [--stills 1,9.5,...] [--out showreel.mp4] [--crf 20]
import { spawn, execSync } from 'node:child_process';
// use a local playwright if installed, otherwise the global one
const { chromium } = await import('playwright').catch(() => import(execSync('npm root -g').toString().trim() + '/playwright/index.js')).then(m => m.default || m);
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const fps = Number(opt('fps', 30)), stills = opt('stills', null);
const root = path.dirname(new URL(import.meta.url).pathname);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/reel.html?render=1`);
await page.waitForFunction('window.__ready === true');
const duration = await page.evaluate('Reel.duration');
const shot = () => page.locator('#stage').screenshot({ type: 'jpeg', quality: 92 });
if (stills) {
  fs.mkdirSync(path.join(root, 'stills'), { recursive: true });
  for (const s of stills.split(',')) { await page.evaluate(t => Reel.renderAt(t), Number(s)); await page.waitForTimeout(30);
    fs.writeFileSync(path.join(root, 'stills', `t${s}.jpg`), await shot()); }
  console.log('stills written'); await browser.close(); server.close(); process.exit(0);
}
fs.writeFileSync(path.join(root, 'cuts.json'), JSON.stringify({ duration, cuts: await page.evaluate('Reel.cuts') }));
const frames = Math.ceil(duration * fps), out = path.resolve(root, opt('out', 'showreel.mp4'));
const wav = path.join(root, 'showreel.wav');
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  ...(fs.existsSync(wav) ? ['-i', wav, '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', String(opt('crf', 20)), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  await page.evaluate(t => Reel.renderAt(t), f / fps);
  const buf = await shot();
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % (fps * 10) === 0) console.log(`frame ${f}/${frames} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r));
await browser.close(); server.close(); console.log('wrote', out);
