// Vertical reel renderer: draws any moment t of a reel onto a 1080x1920 canvas.
// Inputs (fetched from the reel folder): reel.json (script, art, verse), timeline.json (from build_audio.py),
// art/<key>.paint.jpg (from prep_art.py). Everything else (ink transitions, embers, rays, moon, scroll, stickers,
// kinetic captions, grain) is drawn here, so the look is the same every day.
// Instagram safe zones: keep text out of the bottom 380px (caption, handle) and the right 140px (buttons).
const Reel = (() => {
  const W = 1080, H = 1920;
  const C = { saffron: '#ff9a1f', gold: '#ffd23f', ink: '#120b07', paper: '#f3e3c3', red: '#c8281e', white: '#fffaf0', blue: '#2f7fff' };
  let cv, ctx, R, TL, base, imgs = {}, grain, paperTex, words = [], chunks = [];
  const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
  const easeOut = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  const spring = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.cos(x * 4.5 * Math.PI) * Math.exp(-x * 6);
  const lerp = (a, b, k) => a + (b - a) * k;
  function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

  async function load(ep) {
    base = ep.replace(/\/$/, '');
    cv = document.getElementById('c'); ctx = cv.getContext('2d');
    const f = async p => (await fetch(base + '/' + p)).json();
    R = await f('reel.json'); TL = await f('timeline.json');
    const fonts = [['Anton', 'Anton.woff2'], ['Marker', 'PermanentMarker.woff2'], ['Rozha', 'Rozha.ttf'], ['Tiro', 'Tiro.ttf'], ['Kalam', 'Kalam.ttf'], ['Nunito', 'Nunito.ttf']];
    await Promise.all(fonts.map(async ([n, file]) => { const ff = new FontFace(n, `url(fonts/${file})`); try { document.fonts.add(await ff.load()); } catch (e) { console.warn('font', n, e); } }));
    await Promise.all(Object.keys(R.art).map(k => new Promise(res => {
      const im = new Image(); im.onload = () => { imgs[k] = im; res(); }; im.onerror = () => { console.warn('art missing', k); res(); };
      im.src = base + '/art/' + k + '.paint.jpg';
    })));
    makeTextures(); buildCaptions();
    return true;
  }

  function makeTextures() {
    grain = document.createElement('canvas'); grain.width = 540; grain.height = 960;
    const g = grain.getContext('2d'), d = g.createImageData(540, 960), r = rng(5);
    for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (r() - 0.5) * 90; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 34; }
    g.putImageData(d, 0, 0);
    paperTex = document.createElement('canvas'); paperTex.width = 900; paperTex.height = 900;
    const p = paperTex.getContext('2d'); p.fillStyle = C.paper; p.fillRect(0, 0, 900, 900); const r2 = rng(9);
    for (let i = 0; i < 2600; i++) { p.fillStyle = `rgba(120,80,30,${r2() * 0.06})`; p.beginPath(); p.arc(r2() * 900, r2() * 900, r2() * 26 + 2, 0, 7); p.fill(); }
    for (let i = 0; i < 500; i++) { p.strokeStyle = `rgba(90,60,20,${r2() * 0.12})`; p.lineWidth = 0.6; p.beginPath(); const x = r2() * 900, y = r2() * 900; p.moveTo(x, y); p.lineTo(x + (r2() - 0.5) * 60, y + (r2() - 0.5) * 12); p.stroke(); }
  }

  // ---- captions: group words into 1-3 word chunks; a chunk lives from its first word to its last word
  function buildCaptions() {
    words = TL.words; chunks = [];
    let cur = [];
    const flush = () => { if (cur.length) chunks.push(cur); cur = []; };
    words.forEach((w, i) => {
      const prev = words[i - 1];
      if (cur.length && (prev.b !== w.b || cur.length >= 3 || cur.map(x => x.w).join(' ').length + w.w.length > 15 || /[.!?,:;]$/.test(prev.w) || w.s - prev.e > 0.18)) flush();
      cur.push(w);
    });
    flush();
  }

  const beatAt = t => { const bs = TL.beats; for (let i = bs.length - 1; i >= 0; i--) if (t >= bs[i].start) return i; return 0; };

  // ---- art layer: cover-fit with a focus point and zoom, eased across the beat, plus kick punches
  function drawArt(key, cam, k, punch, filter) {
    const im = imgs[key]; if (!im) { ctx.fillStyle = '#2a1a10'; ctx.fillRect(0, 0, W, H); return; }
    const [a, b] = cam || [[0.5, 0.5, 1], [0.5, 0.5, 1.1]];
    const e = ease(k), fx = lerp(a[0], b[0], e), fy = lerp(a[1], b[1], e), z = lerp(a[2], b[2], e) * (1 + punch);
    const s = Math.max(W / im.width, H / im.height) * z, w = im.width * s, h = im.height * s;
    let x = W / 2 - fx * w, y = H / 2 - fy * h;
    x = Math.min(0, Math.max(W - w, x)); y = Math.min(0, Math.max(H - h, y));
    if (w < W || h < H) { ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H); }
    ctx.save(); if (filter) ctx.filter = filter;
    ctx.drawImage(im, x, y, w, h); ctx.restore();
  }

  // ink-bleed mask: blotches that grow until they cover the frame
  function inkMask(p, seed) {
    const r = rng(seed); ctx.beginPath();
    for (let i = 0; i < 26; i++) {
      const cx = r() * W, cy = r() * H, rad = (180 + r() * 420) * easeOut(p * 1.25 - r() * 0.25) * 1.6;
      if (rad <= 0) continue;
      ctx.moveTo(cx + rad, cy);
      for (let a = 0; a <= 6.3; a += 0.35) { const wob = 1 + 0.18 * Math.sin(a * 5 + i); ctx.lineTo(cx + Math.cos(a) * rad * wob, cy + Math.sin(a) * rad * wob); }
    }
  }

  function punchAt(t, kind) {
    if (!['hook', 'twist', 'lesson', 'cta'].includes(kind)) return 0;
    let p = 0; for (const k of TL.kicks) { if (k <= t && t - k < 0.25) p = Math.max(p, 0.035 * Math.exp(-(t - k) / 0.08)); }
    return p;
  }

  function background(t, i) {
    const B = R.beats[i], T = TL.beats[i], k = (t - T.start) / (T.end - T.start);
    const desat = (B.fx || []).includes('desat') ? 'grayscale(0.65) contrast(1.15)' : null;
    const verseDim = B.kind === 'verse' ? 'brightness(0.55) blur(2px)' : null;
    drawArt(B.art, B.cam, k, punchAt(t, B.kind), desat || verseDim);
    const tin = t - T.start;
    if (i > 0 && tin < 0.5) {   // transition from the previous beat's art
      const P = R.beats[i - 1], PT = TL.beats[i - 1];
      const glitch = (B.fx || []).includes('glitch');
      ctx.save();
      if (glitch) {
        const p = tin / 0.5;
        if (p < 1) { const r = rng(Math.floor(t * 30)); for (let s = 0; s < 14; s++) { const y = r() * H, h = 30 + r() * 140, dx = (r() - 0.5) * 160 * (1 - p); ctx.drawImage(cv, 0, y, W, h, dx, y, W, h); } }
        ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.35 * (1 - p); ctx.fillStyle = '#f0f'; ctx.fillRect(-12, 0, W, H); ctx.fillStyle = '#0ff'; ctx.fillRect(12, 0, W, H);
      } else {
        // previous art painted on top, with the new art bleeding through ink blotches
        ctx.save(); inkMask(tin / 0.5, i * 7 + 3); ctx.rect(W, 0, -W, H); ctx.clip('evenodd');
        drawArt(P.art, P.cam, 1 + tin / (PT.end - PT.start), 0, null); ctx.restore();
      }
      ctx.restore();
    }
    // grade: warm vignette
    const g = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.25, W / 2, H * 0.5, H * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,5,0,0.62)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // readable band behind captions
    const cb = ctx.createLinearGradient(0, H * 0.5, 0, H); cb.addColorStop(0, 'rgba(0,0,0,0)'); cb.addColorStop(0.55, 'rgba(0,0,0,0.35)'); cb.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = cb; ctx.fillRect(0, H * 0.5, W, H * 0.5);
  }

  // ---- fx
  function embers(t, amt = 1) {
    const r = rng(17); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 70 * amt; i++) {
      const sp = 60 + r() * 140, x0 = r() * W, ph = r() * 20, life = (t * sp / H + ph) % 1;
      const x = x0 + Math.sin(t * (0.8 + r()) + i) * 40, y = H * (1.05 - life * 1.1), s = 2 + r() * 5;
      ctx.fillStyle = `rgba(255,${140 + r() * 80 | 0},40,${0.75 * Math.sin(life * Math.PI)})`;
      ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  function rays(t, a = 1) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(W / 2, -120);
    for (let i = 0; i < 14; i++) {
      const ang = (i / 14) * Math.PI * 0.9 + 0.15 * Math.PI + Math.sin(t * 0.3 + i) * 0.03 + t * 0.02;
      const g = ctx.createLinearGradient(0, 0, Math.cos(ang) * 2200, Math.sin(ang) * 2200);
      g.addColorStop(0, `rgba(255,210,110,${0.22 * a})`); g.addColorStop(1, 'rgba(255,210,110,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang - 0.04) * 2200, Math.sin(ang - 0.04) * 2200); ctx.lineTo(Math.cos(ang + 0.04) * 2200, Math.sin(ang + 0.04) * 2200); ctx.fill();
    }
    ctx.restore();
  }
  function moon(t, k) {
    const x = 780, y = 470, r = 120, p = easeOut(k * 2.5);
    ctx.save();
    const g = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 3); g.addColorStop(0, `rgba(255,245,210,${0.5 * p})`); g.addColorStop(1, 'rgba(255,245,210,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
    ctx.fillStyle = `rgba(255,248,225,${0.95 * p})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, -1.6, -1.6 + 6.3 * p); ctx.stroke();
    ctx.restore();
  }
  function flash(tin, a = 1) { if (tin < 0.25) { ctx.fillStyle = `rgba(255,250,235,${a * (1 - tin / 0.25)})`; ctx.fillRect(0, 0, W, H); } }

  // ---- text helpers
  function wrap(text, font, maxW) {
    ctx.font = font; const out = []; let line = '';
    for (const w of text.split(/ +/)) { const tst = line ? line + ' ' + w : w; if (ctx.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; }
    if (line) out.push(line); return out;
  }
  function stroked(text, x, y, fill, stroke = C.ink, lw = 12) {
    ctx.lineJoin = 'round'; ctx.miterLimit = 2; ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.strokeText(text, x, y); ctx.fillStyle = fill; ctx.fillText(text, x, y);
  }

  function header(t) {
    const p = Math.min(1, t / TL.duration);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, W, 10);
    ctx.fillStyle = C.saffron; ctx.fillRect(0, 0, W * p, 10);
    ctx.save(); ctx.font = '34px Anton'; ctx.textBaseline = 'middle';
    const tag = (R.tag || 'LEARNING FROM RAMA') + ` · DAY ${R.day}`, tw = ctx.measureText(tag).width;
    ctx.fillStyle = 'rgba(18,11,7,0.78)'; roundRect(48, 70, tw + 84, 62, 31); ctx.fill();
    ctx.fillStyle = C.saffron; ctx.font = '36px Anton'; ctx.fillText('🏹', 62, 102);
    ctx.font = '34px Anton'; ctx.fillStyle = C.white; ctx.fillText(tag, 112, 102); ctx.restore();
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  function title(t, i) {
    const B = R.beats[i], T = TL.beats[i]; if (!B.title) return;
    const tin = t - T.start, out = T.end - t;
    const a = Math.min(1, out / 0.2);
    ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    let y = 330;
    if (B.top) { const s = spring(tin / 0.5); ctx.font = '84px Marker'; ctx.save(); ctx.translate(110, y); ctx.rotate(-0.06); ctx.scale(s, s); ctx.textAlign = 'left'; stroked(B.top, 0, 0, C.gold, C.ink, 14); ctx.restore(); y += 40; }
    const lines = wrap(B.title.toUpperCase(), '120px Anton', 900);
    lines.forEach((ln, j) => {
      const s = spring((tin - 0.12 - j * 0.12) / 0.55); if (s <= 0) return;
      ctx.save(); ctx.translate(W / 2, y + 120 + j * 128); ctx.scale(s, s); ctx.rotate((j % 2 ? 1 : -1) * 0.015);
      ctx.font = '120px Anton'; const hl = (B.hl ? new RegExp(B.hl, 'i') : /TOMORROW|NOT|TWIST|RAMA/).test(ln);
      stroked(ln, 0, 0, hl ? C.gold : C.white, C.ink, 18); ctx.restore();
    });
    // brush underline
    const bw = Math.min(1, (tin - 0.35) / 0.4); if (bw > 0) {
      const yy = y + 150 + (lines.length - 1) * 128; ctx.strokeStyle = C.saffron; ctx.lineCap = 'round'; ctx.lineWidth = 16;
      ctx.beginPath(); ctx.moveTo(W / 2 - 330, yy); ctx.quadraticCurveTo(W / 2, yy + 20, W / 2 - 330 + 660 * bw, yy - 6); ctx.stroke();
    }
    ctx.restore();
  }


  // a big tilted label: GREEN FLAG ✅ / RED FLAG 🚩 / #1 SLEEP SCHEDULE, with an optional verse reference
  function badge(t, i) {
    const B = R.beats[i], T = TL.beats[i]; if (!B.badge) return;
    const bd = B.badge, tin = t - T.start, s = spring(tin / 0.5) * Math.min(1, (T.end - t) / 0.2); if (s <= 0) return;
    const col = { green: '#1fae4b', red: '#e0302a', saffron: C.saffron, gold: C.gold }[bd.color || 'saffron'];
    ctx.save(); ctx.translate(W / 2 - 30, 400); ctx.rotate(bd.color === 'red' ? 0.05 : -0.05); ctx.scale(s, s);
    ctx.font = '104px Anton'; const lines = wrap(bd.text.toUpperCase(), '104px Anton', 760);
    const tw = Math.max(...lines.map(l => ctx.measureText(l).width)) + (bd.emoji ? 150 : 0) + 90, th = 40 + lines.length * 112;
    ctx.fillStyle = col; roundRect(-tw / 2, -th / 2, tw, th, 28); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 10; ctx.stroke();
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const x0 = -tw / 2 + 45 + (bd.emoji ? 150 : 0);
    if (bd.emoji) { ctx.font = '112px "Noto Color Emoji"'; ctx.fillText(bd.emoji, -tw / 2 + 35, 6); }
    ctx.font = '104px Anton'; lines.forEach((l, j) => { ctx.fillStyle = bd.color === 'gold' || bd.color === 'saffron' ? C.ink : C.white; ctx.fillText(l, x0, 8 + (j - (lines.length - 1) / 2) * 112); });
    if (bd.ref) { ctx.font = '38px Anton'; ctx.textAlign = 'center'; stroked(bd.ref.toUpperCase(), 0, th / 2 + 52, C.gold, C.ink, 9); }
    ctx.restore();
  }

  function captions(t) {
    const c = chunks.find(ch => t >= ch[0].s - 0.04 && t < ch[ch.length - 1].e + 0.12);
    if (!c) return;
    const i = c[0].b, B = R.beats[i];
    if (B.kind === 'verse' && TL.beats[i].chant && t < TL.beats[i].chant.end) return;
    const yBase = B.kind === 'verse' ? 1370 : 1240;
    const age = t - c[0].s, s = 0.82 + 0.18 * spring(age / 0.3);
    const pops = (B.pops || []).map(p => p.at.toLowerCase());
    ctx.save(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.font = '104px Anton';
    const txt = c.map(w => w.w.replace(/\*/g, '').toUpperCase()), sp = 26;
    const ws = txt.map(x => ctx.measureText(x).width); let total = ws.reduce((a, b) => a + b, 0) + sp * (txt.length - 1);
    const scale = Math.min(1, 900 / total) * s;
    ctx.translate(W / 2 - 40, yBase); ctx.scale(scale, scale); ctx.rotate(-0.01);
    let x = -total / 2;
    c.forEach((w, j) => {
      const on = t >= w.s - 0.03, now = t >= w.s - 0.03 && t < w.e + 0.05;
      const key = pops.some(p => w.w.toLowerCase().includes(p)) || /^[A-Z]{3,}/.test(w.w.replace(/[^A-Za-z]/g, '')) && w.w.replace(/[^A-Za-z]/g, '').length > 2 && w.w === w.w.toUpperCase();
      const fill = now ? (key ? C.gold : C.saffron) : (on ? C.white : 'rgba(255,250,240,0.55)');
      if (now) { ctx.save(); ctx.fillStyle = 'rgba(18,11,7,0.0)'; ctx.restore(); }
      stroked(txt[j], x, 0, fill, C.ink, 16); x += ws[j] + sp;
    });
    ctx.restore();
  }

  function stickers(t, i) {
    for (let bi = Math.max(0, i - 1); bi <= i; bi++) {
      const B = R.beats[bi]; (B.pops || []).forEach((p, j) => {
        if (!p.sticker) return;
        const w = words.find(w => w.b === bi && w.w.toLowerCase().includes(p.at.toLowerCase())); if (!w) return;
        const age = t - w.s; if (age < 0 || age > 1.6) return;
        const r = rng(bi * 31 + j * 7), side = (j + bi) % 2 ? 1 : -1;
        const x = W / 2 + side * (220 + r() * 120) - 40, y = (B.kind === 'cta' ? 640 : 820) + r() * (B.kind === 'cta' ? 60 : 220), s = spring(age / 0.45) * (age > 1.3 ? 1 - (age - 1.3) / 0.3 : 1);
        ctx.save(); ctx.translate(x, y); ctx.rotate(side * (0.12 + r() * 0.15)); ctx.scale(s, s);
        ctx.font = '190px "Noto Color Emoji", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; ctx.fillText(p.sticker, 0, 0); ctx.restore();
      });
    }
  }

  // ---- the verse: a paper leaf slides up, the shloka is inked in during the recitation
  function verse(t, i) {
    const B = R.beats[i], T = TL.beats[i], V = R.verse, ch = T.chant || { start: T.start, end: T.start + 4 };
    const tin = t - T.start, out = T.end - t, k = easeOut(tin / 0.6) * Math.min(1, out / 0.3);
    if (k <= 0) return;
    const x = 70, w = W - 140 - 40, y = lerp(H, 430, k), h = 820;
    ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.5);
    // torn paper
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
    const r = rng(4); ctx.beginPath(); ctx.moveTo(x, y);
    for (let xx = x; xx <= x + w; xx += 24) ctx.lineTo(xx, y + (r() - 0.5) * 12);
    for (let yy = y; yy <= y + h; yy += 24) ctx.lineTo(x + w + (r() - 0.5) * 12, yy);
    for (let xx = x + w; xx >= x; xx -= 24) ctx.lineTo(xx, y + h + (r() - 0.5) * 12);
    for (let yy = y + h; yy >= y; yy -= 24) ctx.lineTo(x + (r() - 0.5) * 12, yy);
    ctx.closePath(); ctx.fillStyle = ctx.createPattern(paperTex, 'repeat'); ctx.fill(); ctx.restore();
    ctx.save(); ctx.clip(); ctx.restore();
    ctx.textAlign = 'center';
    ctx.font = '40px Anton'; ctx.fillStyle = C.red; ctx.fillText('VALMIKI LITERALLY WROTE THIS 👇', W / 2 - 20, y + 86);
    // Devanagari, revealed left to right line by line during the chant
    const lines = V.sanskrit.replace(/ ([।॥|])/g, '\u00a0$1').split('\n');
    const segsAll = []; lines.forEach(ln => wrap(ln, '58px Tiro', w - 90).forEach(sg => segsAll.push(sg)));
    const prog = Math.min(1, Math.max(0, (t - ch.start) / Math.max(0.5, ch.end - ch.start - 0.3)));
    ctx.font = '58px Tiro'; ctx.fillStyle = C.ink;
    let yy = y + 200;
    const lens = segsAll.map(sg => sg.length), totalLen = lens.reduce((a, b) => a + b, 0); let acc = 0;
    segsAll.forEach((sg, j) => {   // ink each line in turn, at the pace of the recitation
      const lp = Math.min(1, Math.max(0, (prog * totalLen - acc) / lens[j])); acc += lens[j];
      const mw = ctx.measureText(sg).width;
      ctx.save(); ctx.beginPath(); ctx.rect(W / 2 - 20 - mw / 2 - 10, yy - 80, (mw + 20) * lp, 120); ctx.clip();
      ctx.fillText(sg, W / 2 - 20, yy); ctx.restore(); yy += 84;
    });
    if (V.iast) {
      ctx.font = 'italic 32px Nunito'; ctx.fillStyle = 'rgba(40,25,10,0.75)';
      V.iast.split('\n').forEach((ln, j) => { wrap(ln, 'italic 32px Nunito', w - 90).forEach(sg => { ctx.fillText(sg, W / 2 - 20, yy + 10); yy += 44; }); });
    }
    // seal with the reference
    const sp = spring((t - ch.end + 0.2) / 0.5);
    if (sp > 0) {
      const refEn = `${{ bala: 'Bala', ayodhya: 'Ayodhya', aranya: 'Aranya', kishkindha: 'Kishkindha', sundara: 'Sundara', yuddha: 'Yuddha', uttara: 'Uttara' }[V.kanda]} Kanda ${V.sarga}.${V.shloka}`;
      ctx.save(); ctx.translate(W / 2 - 20, y + h - 90); ctx.rotate(-0.04); ctx.scale(sp, sp);
      const seal = 'VALMIKI RAMAYANA · ' + refEn.toUpperCase();
      ctx.font = '40px Anton'; const tw = ctx.measureText(seal).width + 60;
      ctx.strokeStyle = C.red; ctx.lineWidth = 6; roundRect(-tw / 2, -46, tw, 82, 12); ctx.stroke();
      ctx.fillStyle = C.red; ctx.fillText(seal, 0, 10); ctx.restore();
    }
    ctx.restore();
  }

  function cta(t, i) {
    const T = TL.beats[i], tin = t - T.start; const s = spring((tin - 0.6) / 0.5); if (s <= 0) return;
    ctx.save(); ctx.translate(W / 2 - 40, 900); ctx.scale(s, s);
    ctx.fillStyle = C.saffron; roundRect(-250, -70, 500, 140, 70); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.stroke();
    ctx.font = '84px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.ink; ctx.fillText('FOLLOW', 0, 6);
    const tap = (tin * 1.6) % 1; ctx.font = '110px "Noto Color Emoji"'; ctx.fillText('👆', 170 - tap * 10, 110 - tap * 14);
    ctx.restore();
    ctx.save(); ctx.font = '40px Anton'; ctx.textAlign = 'center'; ctx.fillStyle = C.white; ctx.globalAlpha = Math.min(1, tin / 0.8);
    stroked(R.cta_sub || `DAY ${R.day + 1} DROPS TOMORROW`, W / 2 - 40, 1060, C.white, C.ink, 10); ctx.restore();
  }

  function shake(t, i) {
    const B = R.beats[i], T = TL.beats[i]; if (!(B.fx || []).includes('shake')) return [0, 0];
    const tin = t - T.start, a = 22 * Math.exp(-tin / 0.35); return [Math.sin(t * 90) * a, Math.cos(t * 77) * a];
  }

  function draw(t) {
    const i = beatAt(t), B = R.beats[i], T = TL.beats[i], tin = t - T.start, k = (t - T.start) / (T.end - T.start);
    const fx = B.fx || [];
    ctx.save(); const [sx, sy] = shake(t, i); ctx.translate(sx, sy);
    background(t, i);
    if (fx.includes('rays')) rays(t, Math.min(1, tin / 0.6));
    if (fx.includes('moon')) moon(t, k);
    if (fx.includes('embers')) embers(t, 1);
    if (B.kind === 'verse') { embers(t, 0.4); verse(t, i); }
    ctx.restore();
    title(t, i);
    badge(t, i);
    if (B.kind === 'cta') cta(t, i);
    stickers(t, i);
    captions(t);
    header(t);
    if (fx.includes('flash')) flash(tin, 0.9);
    // film grain
    ctx.save(); ctx.globalCompositeOperation = 'overlay'; const gx = (t * 997) % 200, gy = (t * 613) % 300;
    ctx.drawImage(grain, -gx, -gy, W * 1.25, H * 1.25); ctx.restore();
    // fade in / out
    const fo = Math.max(0, 1 - t / 0.25, (t - (TL.duration - 0.35)) / 0.35);
    if (fo > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, fo)})`; ctx.fillRect(0, 0, W, H); }
  }

  return { load, draw, get duration() { return TL.duration; } };
})();
