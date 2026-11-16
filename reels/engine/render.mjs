// Render a reel to two 1080x1920 MP4s: reel.mp4 (with the score) and reel_nomusic.mp4 (voice + effects only,
// for adding a track from Instagram's music library when posting). Also writes poster.jpg (the cover).
// Usage: node reels/engine/render.mjs reels/days/<slug> [--fps 30] [--stills 1,10,30] [--crf 21]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');   // works with a global or a local install
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const dir = path.resolve(args[0]);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const fps = Number(opt('fps', 30)), stills = opt('stills', null);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.wav': 'audio/wav' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') console.log('page:', m.text()); });
const rel = path.relative(path.join(root, 'reels/engine'), dir);
await page.goto(`http://127.0.0.1:${port}/reels/engine/player.html?render=1&ep=${encodeURIComponent(rel)}`);
await page.waitForFunction('window.__ready === true', null, { timeout: 120000 });
const duration = await page.evaluate('Toon.duration');
const shot = async t => { await page.evaluate(t => Toon.renderAt(t), t); return page.screenshot({ type: 'jpeg', quality: 90 }); };

if (stills) {
  for (const s of stills.split(',')) fs.writeFileSync(path.join(dir, `still-${s}.jpg`), await shot(Number(s)));
  console.log('stills written'); await browser.close(); server.close(); process.exit(0);
}
const out = path.join(dir, 'reel.mp4');
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  '-i', path.join(dir, 'reel.wav'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', String(opt('crf', 24)),
  '-profile:v', 'high', '-r', String(fps), '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const frames = Math.ceil(duration * fps), t0 = Date.now();
for (let f = 0; f < frames; f++) {
  const buf = await shot(f / fps);
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % (fps * 10) === 0) console.log(`frame ${f}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r));
fs.writeFileSync(path.join(dir, 'poster.jpg'), await shot(Number(opt('poster', 2.2))));
await browser.close(); server.close();
spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', out, '-i', path.join(dir, 'reel_nomusic.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
  '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(dir, 'reel_nomusic.mp4')], { stdio: 'inherit' });
console.log('wrote', out);
