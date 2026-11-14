// node tools/render.mjs [--fps 30] [--w 1920] [--workers 3] [--from s --to s]  -> build/lamplight.mp4
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import http from 'http'; import { spawn, execFileSync } from 'child_process';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = +arg('fps', 30), WD = +arg('w', 1920), WORKERS = +arg('workers', 3);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.wav': 'audio/wav', '.json': 'application/json' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0);
const url = `http://localhost:${srv.address().port}/film.html?w=${WD}`;
const durs = JSON.parse(fs.readFileSync(path.join(root, 'build/durations.json')));
const B = path.join(root, 'build'); fs.mkdirSync(B, { recursive: true });
const browser = await chromium.launch();
async function page() { const pg = await browser.newPage({ viewport: { width: 640, height: 360 } }); pg.on('pageerror', e => console.log('ERR', e.message)); await pg.goto(url); await pg.evaluate(() => window.ready); return pg; }
const p0 = await page();
const S = await p0.evaluate((d) => { const S = window.setup(d); return { total: S.total, lines: S.lines, acts: S.acts.map(a => ({ i: a.i, start: a.start, end: a.end })) }; }, durs);
fs.writeFileSync(path.join(B, 'timeline.json'), JSON.stringify(S, null, 1));
const T0 = +arg('from', 0), T1 = +arg('to', S.total);
console.log('film length', S.total.toFixed(1), 's; rendering', T0, '->', T1.toFixed(1));
// ---- audio
if (!process.argv.includes('--noaudio')) {
  const n = await p0.evaluate(() => window.renderAudio());
  const fd = fs.openSync(path.join(B, 'film.pcm'), 'w');
  for (let off = 0; off < n; off += 4 << 20) fs.writeSync(fd, Buffer.from(await p0.evaluate(([o, l]) => window.pcmChunk(o, l), [off, 4 << 20]), 'base64'));
  fs.closeSync(fd);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', '48000', '-ac', '2', '-i', path.join(B, 'film.pcm'), path.join(B, 'film.wav')]);
  fs.unlinkSync(path.join(B, 'film.pcm'));
  console.log('audio done');
}
// ---- frames
const nF = Math.ceil((T1 - T0) * FPS);
const per = Math.ceil(nF / WORKERS);
const started = Date.now();
await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
  const pg = w === 0 ? p0 : await page();
  await pg.evaluate((d) => window.setup(d), durs);
  const a = w * per, b = Math.min(nF, a + per);
  const seg = path.join(B, `seg${w}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = a; f < b; f++) {
    const d = await pg.evaluate((t) => window.frameJPEG(t, 0.92), T0 + f / FPS);
    if (!ff.stdin.write(Buffer.from(d.slice(d.indexOf(',') + 1), 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (w === 0 && f % 300 === 0) { const el = (Date.now() - started) / 1000; console.log(`frame ${f}/${b} ${el.toFixed(0)}s, eta ${((b - f) * el / Math.max(1, f - a)).toFixed(0)}s`); }
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
}));
fs.writeFileSync(path.join(B, 'segs.txt'), Array.from({ length: WORKERS }, (_, w) => `file 'seg${w}.mp4'`).join('\n'));
const out = path.join(B, arg('out', 'lamplight.mp4'));
const hasAudio = fs.existsSync(path.join(B, 'film.wav'));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(B, 'segs.txt'),
  ...(hasAudio ? ['-ss', String(T0), '-t', String(T1 - T0), '-i', path.join(B, 'film.wav'), '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []), '-c:v', 'copy', '-movflags', '+faststart', out]);
console.log('wrote', out, ((Date.now() - started) / 1000).toFixed(0), 's');
await browser.close(); srv.close();
