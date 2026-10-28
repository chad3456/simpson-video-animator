// Render an episode to MP4: headless Chromium draws each frame, ffmpeg encodes and muxes the soundtrack.
// Usage: node engine/render.mjs episodes/<slug> [--fps 24] [--from 0] [--to 99999] [--stills 10,42,...] [--player engine/player.html] [--out file.mp4]
// Explainer episodes: node engine/render.mjs explainer/episodes/<slug> --player explainer/engine/player.html --fps 30
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const epDir = path.resolve(args[0] || 'episodes/suicidal-empathy');
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const meta = JSON.parse(fs.readFileSync(path.join(epDir, 'episode.json'), 'utf8')).meta || {};
const fps = Number(opt('fps', meta.fps || 24)), from = Number(opt('from', 0)), to = Number(opt('to', 1e9));
const stills = opt('stills', null);
const player = opt('player', 'engine/player.html');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

// tiny static server so the page can fetch json/fonts
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const rel = path.relative(path.join(root, path.dirname(player)), epDir);
await page.goto(`http://127.0.0.1:${port}/${player}?render=1&ep=${encodeURIComponent(rel)}`);
await page.waitForFunction('window.__ready === true');
const duration = await page.evaluate('Toon.duration');

if (stills) {
  for (const s of stills.split(',')) {
    await page.evaluate(t => Toon.renderAt(t), Number(s));
    await page.screenshot({ path: path.join(epDir, `still-${s}.png`) });
  }
  console.log('stills written'); await browser.close(); server.close(); process.exit(0);
}

const end = Math.min(duration, to), frames = Math.ceil((end - from) * fps);
const out = path.resolve(epDir, opt('out', 'episode.mp4'));
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  '-ss', String(from), '-t', String(end - from), '-i', path.join(epDir, 'episode.wav'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '23', '-tune', 'animation',
  '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });

const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  await page.evaluate(t => Toon.renderAt(t), from + f / fps);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % (fps * 10) === 0) console.log(`frame ${f}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close(); server.close();
console.log('wrote', out);
