// Renders the Ramayana reel: Ken Burns over each painting, stuti captions, Diwali finale. Frames are piped to ffmpeg.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const ROOT = process.argv[2], OUT = process.argv[3], FPS = 30, DUR = 93, W = 1920, H = 1080;
const ev = fs.readdirSync(path.join(ROOT, 'out-events')).filter(f => /^\d\d-.*\.jpg$/.test(f)).sort();
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
    const STUTI = [
      'श्री रामचन्द्र कृपालु भजु मन हरण भवभय दारुणम्', 'नव कंज लोचन कंज मुख कर कंज पद कंजारुणम्',
      'कन्दर्प अगणित अमित छवि नव नील नीरद सुन्दरम्', 'पट पीत मानहुँ तड़ित रुचि शुचि नौमि जनक सुतावरम्',
      'भजु दीनबन्धु दिनेश दानव दैत्य वंश निकन्दनम्', 'रघुनन्द आनन्द कन्द कौशल चन्द दशरथ नन्दनम्',
      'सिर मुकुट कुंडल तिलक चारु उदारु अंग विभूषणम्', 'आजानु भुज शर चाप धर संग्राम जित खरदूषणम्',
      'इति वदति तुलसीदास शंकर शेष मुनि मन रंजनम्', 'मम हृदय कंज निवास कुरु कामादि खल दल गंजनम्'];
    const ease = (t) => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
    const segs = [{ s: 0, d: 7, kind: 'intro' }];
    IM.forEach((im, i) => segs.push({ s: 6 + i * 5, d: 6, im, i, kind: i === 15 ? 'finale' : 'ev' }));
    segs[16].s = 81; segs[16].d = 12;
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
          text('श्री राम स्तुति', 96, 'Tiro', H * 0.42, a * ease((t - 0.8) / 1.5), '#ffd86a', 'rgba(255,140,30,0.9)');
          text('THE RAMAYANA IN PAINT', 44, 'Cinzel', H * 0.55, a * ease((t - 1.8) / 1.5), '#fff4dc');
          text('after Valmiki', 30, 'Cinzel', H * 0.62, a * ease((t - 2.6) / 1.5), '#ffcf9a');
          x.restore();
        } else {
          kb(g.im, u, g.i);
          if (g.kind === 'ev') {
            const ta = a * ease((t - g.s - 0.8) / 0.8) * ease((g.s + g.d - 0.9 - t) / 0.8);
            x.save(); x.globalAlpha = ta; x.font = '30px Cinzel'; x.textAlign = 'left'; x.textBaseline = 'middle';
            x.shadowColor = 'rgba(0,0,0,0.9)'; x.shadowBlur = 12; x.fillStyle = '#fff1d0';
            x.fillText(String(g.i + 1).padStart(2, '0') + '  ·  ' + TT[g.i], 60, 70); x.restore();
          }
        }
      }
      x.globalAlpha = 1;
      // stuti captions, one half-line every 7.5 s through the paintings
      if (t >= 6 && t < 81) {
        const k = Math.floor((t - 6) / 7.5), lt = (t - 6) - k * 7.5;
        const ca = ease(lt / 0.7) * ease((7.5 - lt) / 0.7);
        const gr = x.createLinearGradient(0, H - 230, 0, H); gr.addColorStop(0, 'rgba(10,4,20,0)'); gr.addColorStop(1, 'rgba(10,4,20,0.75)');
        x.fillStyle = gr; x.fillRect(0, H - 230, W, 230);
        text(STUTI[k], 54, 'Tiro', H - 95, ca, '#ffe7a8', 'rgba(0,0,0,0.95)');
      }
      // Diwali finale: twinkles, greetings, fade to black
      if (t >= 81) {
        const ft = t - 81;
        x.save(); x.globalCompositeOperation = 'lighter';
        for (let k = 0; k < 90; k++) {
          const px = R(k) * W, py = R(k + 50) * H * 0.75, tw = 0.5 + 0.5 * Math.sin(ft * (2 + R(k + 9) * 4) + k);
          const r = 2 + R(k + 3) * 4; x.globalAlpha = tw * 0.8 * ease(ft / 2);
          const g2 = x.createRadialGradient(px, py, 0, px, py, r * 4); g2.addColorStop(0, '#fff6c8'); g2.addColorStop(1, 'rgba(255,180,60,0)');
          x.fillStyle = g2; x.fillRect(px - r * 4, py - r * 4, r * 8, r * 8);
        }
        x.restore();
        const ga = ease((ft - 2.5) / 1.5);
        const gr = x.createLinearGradient(0, H * 0.62, 0, H); gr.addColorStop(0, 'rgba(10,4,20,0)'); gr.addColorStop(1, 'rgba(10,4,20,0.7)');
        x.globalAlpha = ga; x.fillStyle = gr; x.fillRect(0, H * 0.62, W, H * 0.38); x.globalAlpha = 1;
        text('Happy Diwali', 130, 'Cinzel', H * 0.78, ga, '#ffd86a', 'rgba(255,150,30,0.95)');
        text('शुभ दीपावली  ·  जय श्री राम', 56, 'Tiro', H * 0.9, ease((ft - 4) / 1.5), '#fff1d0', 'rgba(0,0,0,0.9)');
        const fb = ease((t - (DUR - 1.8)) / 1.6); if (fb > 0) { x.globalAlpha = fb; x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
      }
      return c.toDataURL('image/jpeg', 0.9);
    };
  }, { W, H, DUR });
  if (process.argv[4]) {  // preview stills: comma-separated times
    for (const t of process.argv[4].split(',')) { const d = await p.evaluate((t) => frame(t), +t); fs.writeFileSync(`${__dirname}/still-${t}.jpg`, Buffer.from(d.split(',')[1], 'base64')); }
    await b.close(); return;
  }
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-i', path.join(__dirname, 'music.wav'),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = DUR * FPS;
  for (let i = 0; i < n; i++) {
    const d = await p.evaluate((t) => frame(t), i / FPS);
    if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log('frame', i, '/', n);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done');
})();
