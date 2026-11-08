// Renders the Ramayana reel: Ken Burns over each painting, a Diwali greeting, and a closing quote of Rama from Valmiki. Frames are piped to ffmpeg.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
// usage: node reel.js <project root> <out.mp4> <audio file> [preview times]
const ROOT = process.argv[2], OUT = process.argv[3], AUDIO = process.argv[4], FPS = 25, W = 1920, H = 1080;
const DUR = Math.round(+require('child_process').execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${AUDIO}"`).toString());
// story order (Valmiki): the event files are numbered in sequence; 25 is the Diwali scene, 26 the closing image
const ORDER = fs.readdirSync(path.join(ROOT, 'src/events')).filter(f => /^\d\d-.*\.js$/.test(f)).sort().map(f => f.replace('.js', ''));
const ev = ORDER.map(n => n + '.jpg');
const titles = ev.map(f => { const m = fs.readFileSync(path.join(ROOT, 'src/events', f.replace('.jpg', '.js')), 'utf8').match(/title: (['"])(.*?)\1/); return m[2]; });
const b64 = (p) => 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64');
const font = (p) => 'data:font/ttf;base64,' + fs.readFileSync(p).toString('base64');
const data = { imgs: ev.map(f => b64(path.join(ROOT, 'out-events', f))), titles, intro: b64(path.join(ROOT, 'out/01-rama.jpg')) };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.setContent(`<style>
    @font-face{font-family:Tiro;src:url(${font(path.join(__dirname, 'fonts/tiro.ttf'))})}
    @font-face{font-family:Cinzel;src:url(${font(path.join(__dirname, 'fonts/cinzel.ttf'))})}
    body{margin:0;background:#000}</style><canvas id=c width=${W} height=${H}></canvas>
    <span style="font-family:Tiro">श्री</span><span style="font-family:Cinzel">a</span>`);
  await p.evaluate(async (d) => {
    await document.fonts.ready;
    const load = (s) => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
    window.IM = await Promise.all(d.imgs.map(load)); window.INTRO = await load(d.intro); window.TT = d.titles;
  }, data);
  await p.evaluate(({ W, H, DUR }) => {
    const c = document.getElementById('c'), x = c.getContext('2d');
    const ease = (t) => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
    const FIN = DUR - 18, DIW = FIN - 11, NEV = IM.length - 2, STEP = (DIW + 1 - 7) / NEV;
    const segs = [{ s: 0, d: 8, kind: 'intro' }];
    IM.forEach((im, i) => segs.push(i === NEV + 1 ? { s: FIN, d: 18, im, i, kind: 'finale' } : i === NEV ? { s: DIW, d: 12, im, i, kind: 'diwali' } : { s: 7 + i * STEP, d: STEP + 1, im, i, kind: 'ev' }));
    const kb = (im, u, i) => {  // Ken Burns: cover, slow zoom and drift
      const cover = Math.max(W / im.width, H / im.height);
      const zin = i % 2 === 0; const z = cover * (zin ? 1 + 0.08 * u : 1.08 - 0.08 * u);
      const dw = im.width * z, dh = im.height * z;
      const dx = [(-1), 1, 0.5, -0.5][i % 4] * (dw - W) * 0.25 * (u - 0.5), dy = (i % 3 - 1) * (dh - H) * 0.3 * (u - 0.5);
      x.drawImage(im, (W - dw) / 2 + dx, (H - dh) / 2 + dy, dw, dh);
    };
    const text = (s, px, fam, y, a, col, glow) => {
      x.save(); x.globalAlpha = a; x.font = `${px}px ${fam}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.shadowColor = glow || 'rgba(0,0,0,0.85)'; x.shadowBlur = px * 0.35; x.fillStyle = col; x.fillText(s, W / 2, y);
      x.shadowBlur = 0; x.lineWidth = 1; x.fillText(s, W / 2, y); x.restore();
    };
    const R = (k) => { const v = Math.sin(k * 127.1) * 43758.5453; return v - Math.floor(v); };
    window.frame = (t) => {
      x.globalAlpha = 1; x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      for (const g of segs) {
        if (t < g.s || t > g.s + g.d) continue;
        const u = (t - g.s) / g.d, a = ease((t - g.s) / 1.0) * (g.kind === 'finale' ? 1 : ease((g.s + g.d - t) / 1.0));
        x.globalAlpha = a;
        if (g.kind === 'intro') {
          x.filter = 'blur(28px) brightness(0.55)'; const z = Math.max(W / INTRO.width, H / INTRO.height) * 1.1;
          x.drawImage(INTRO, (W - INTRO.width * z) / 2, (H - INTRO.height * z) / 2, INTRO.width * z, INTRO.height * z); x.filter = 'none';
          const s = (H * 0.92) / INTRO.height * (1 + 0.04 * u); const iw = INTRO.width * s, ih = INTRO.height * s;
          x.drawImage(INTRO, W * 0.3 - iw / 2, (H - ih) / 2, iw, ih);
          x.save(); x.translate(W * 0.2, 0);
          text('मर्यादा पुरुषोत्तम श्री राम', 84, 'Tiro', H * 0.42, a * ease((t - 0.8) / 1.5), '#ffd86a', 'rgba(255,140,30,0.9)');
          text('THE RAMAYANA IN PAINT', 44, 'Cinzel', H * 0.55, a * ease((t - 1.8) / 1.5), '#fff4dc');
          text('after Valmiki', 30, 'Cinzel', H * 0.62, a * ease((t - 2.6) / 1.5), '#ffcf9a');
          x.restore();
        } else {
          kb(g.im, u, g.i);
          if (g.kind === 'ev') {
            const ta = a * ease((t - g.s - 0.8) / 0.8) * ease((g.s + g.d - 0.9 - t) / 0.8);
            x.save(); x.globalAlpha = ta; x.font = '30px Cinzel'; x.textAlign = 'left'; x.textBaseline = 'middle';
            x.shadowColor = 'rgba(0,0,0,0.9)'; x.shadowBlur = 12; x.fillStyle = '#fff1d0';
            x.fillText(TT[g.i], 60, 70); x.restore();
          }
        }
      }
      x.globalAlpha = 1;
      // Diwali: twinkles and greetings
      if (t >= DIW && t < FIN + 1) {
        const ft = t - DIW, out = ease((FIN + 1 - t) / 1.0);
        x.save(); x.globalCompositeOperation = 'lighter';
        for (let k = 0; k < 90; k++) {
          const px = R(k) * W, py = R(k + 50) * H * 0.75, tw = 0.5 + 0.5 * Math.sin(ft * (2 + R(k + 9) * 4) + k);
          const r = 2 + R(k + 3) * 4; x.globalAlpha = tw * 0.8 * ease(ft / 2) * out;
          const g2 = x.createRadialGradient(px, py, 0, px, py, r * 4); g2.addColorStop(0, '#fff6c8'); g2.addColorStop(1, 'rgba(255,180,60,0)');
          x.fillStyle = g2; x.fillRect(px - r * 4, py - r * 4, r * 8, r * 8);
        }
        x.restore();
        const ga = ease((ft - 1.5) / 1.5) * out;
        const gr = x.createLinearGradient(0, H * 0.62, 0, H); gr.addColorStop(0, 'rgba(10,4,20,0)'); gr.addColorStop(1, 'rgba(10,4,20,0.7)');
        x.globalAlpha = ga; x.fillStyle = gr; x.fillRect(0, H * 0.62, W, H * 0.38); x.globalAlpha = 1;
        text('Happy Diwali', 130, 'Cinzel', H * 0.78, ga, '#ffd86a', 'rgba(255,150,30,0.95)');
        text('शुभ दीपावली', 60, 'Tiro', H * 0.9, ease((ft - 3) / 1.5) * out, '#fff1d0', 'rgba(0,0,0,0.9)');
      }
      // closing: Rama's vow of refuge (Valmiki Ramayana, Yuddha Kanda 18.33), then fade to black
      if (t >= FIN) {
        const ft = t - FIN;
        const ga = ease((ft - 1.5) / 2);
        const gr = x.createLinearGradient(0, H * 0.5, 0, H); gr.addColorStop(0, 'rgba(8,4,20,0)'); gr.addColorStop(0.35, 'rgba(8,4,20,0.72)'); gr.addColorStop(1, 'rgba(8,4,20,0.9)');
        x.globalAlpha = ga; x.fillStyle = gr; x.fillRect(0, H * 0.5, W, H * 0.5); x.globalAlpha = 1;
        text('सकृदेव प्रपन्नाय तवास्मीति च याचते ।', 54, 'Tiro', H * 0.665, ga, '#ffe39a', 'rgba(255,150,40,0.9)');
        text('अभयं सर्वभूतेभ्यो ददाम्येतद् व्रतं मम ॥', 54, 'Tiro', H * 0.735, ga, '#ffe39a', 'rgba(255,150,40,0.9)');
        const ea = ease((ft - 4.5) / 2);
        text('“Whoever comes to me even once and says ‘I am yours’,', 34, 'Cinzel', H * 0.82, ea, '#fff4dc');
        text('I grant him protection from all beings. This is my vow.”', 34, 'Cinzel', H * 0.865, ea, '#fff4dc');
        text('— Shri Rama  ·  Valmiki Ramayana, Yuddha Kanda 18.33', 26, 'Cinzel', H * 0.925, ease((ft - 6.5) / 2), '#ffcf9a');
        const fb = ease((t - (DUR - 5)) / 1.5); if (fb > 0) { x.globalAlpha = fb; x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
        text('जय श्री राम', 96, 'Tiro', H * 0.5, ease((t - (DUR - 3.6)) / 1.2) * ease((DUR - 0.2 - t) / 0.8), '#ffd86a', 'rgba(255,150,30,0.95)');
      }
      return c.toDataURL('image/jpeg', 0.9);
    };
  }, { W, H, DUR });
  if (process.argv[5]) {  // preview stills: comma-separated times
    for (const t of process.argv[5].split(',')) { const d = await p.evaluate((t) => frame(t), +t); fs.writeFileSync(`${__dirname}/still-${t}.jpg`, Buffer.from(d.split(',')[1], 'base64')); }
    await b.close(); return;
  }
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-i', AUDIO,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '24', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = DUR * FPS;
  for (let i = 0; i < n; i++) {
    const d = await p.evaluate((t) => frame(t), i / FPS);
    if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log('frame', i, '/', n);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done');
})();
