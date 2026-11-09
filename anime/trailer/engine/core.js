// Pop-collage core: palette, paper, halftone, backgrounds, cut-paper shapes and kinetic type.
// Everything is drawn with Canvas 2D at 1280x720. Time is in seconds; "on twos" motion steps at 12 fps for a cut-out feel.
(function () {
  const W = 1280, H = 720;
  const P = {
    cream: '#f2e6cc', paper: '#fbf3e0', ink: '#1b1515', pink: '#ff3e8f', hot: '#ff1f6e', red: '#e5322a',
    yellow: '#ffd21c', blue: '#2e7fe0', sky: '#7cc4ff', lime: '#a8e330', orange: '#ff8a1d', purple: '#7a4fd8',
    teal: '#19b3a6', gold: '#f5b700', grey: '#8d8a86', white: '#fffaf0', black: '#141010'
  };

  // ---------- deterministic noise ----------
  function hash(n) { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const two = t => Math.floor(t * 12) / 12;              // animate on twos
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = {
    out: k => 1 - Math.pow(1 - clamp(k), 3),
    inout: k => { k = clamp(k); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; },
    back: k => { k = clamp(k); const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
    pop: k => { k = clamp(k); return k < 0.6 ? 1.35 * ease.out(k / 0.6) : 1.35 - 0.35 * ease.out((k - 0.6) / 0.4); }
  };
  const jit = (t, seed, amt = 1.5) => (hash(Math.floor(t * 12) + seed * 17.3) - 0.5) * 2 * amt;   // boiling cut-outs

  // ---------- offscreen helpers ----------
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  const patCache = {};
  function dots(ctx, color, r = 2.2, gap = 8, bg = null, angle = 0.4) {
    const key = color + r + gap + bg;
    if (!patCache[key]) {
      const c = canvas(gap, gap), x = c.getContext('2d');
      if (bg) { x.fillStyle = bg; x.fillRect(0, 0, gap, gap); }
      x.fillStyle = color;
      x.beginPath(); x.arc(gap / 2, gap / 2, r, 0, 7); x.fill();
      x.beginPath(); for (const [a, b] of [[0, 0], [gap, 0], [0, gap], [gap, gap]]) { x.moveTo(a + r * 0.5, b); x.arc(a, b, r * 0.5, 0, 7); } x.fill();
      patCache[key] = c;
    }
    const p = ctx.createPattern(patCache[key], 'repeat');
    if (p.setTransform) p.setTransform(new DOMMatrix().rotate(angle * 57.3));
    return p;
  }
  function lines(ctx, color, w = 2, gap = 7) {
    const key = 'L' + color + w + gap;
    if (!patCache[key]) {
      const c = canvas(gap, gap), x = c.getContext('2d');
      x.strokeStyle = color; x.lineWidth = w;
      x.beginPath(); x.moveTo(-1, gap + 1); x.lineTo(gap + 1, -1); x.moveTo(-1, 1); x.lineTo(1, -1); x.moveTo(gap - 1, gap + 1); x.lineTo(gap + 1, gap - 1); x.stroke();
      patCache[key] = c;
    }
    return ctx.createPattern(patCache[key], 'repeat');
  }

  // paper grain + fibres, built once
  let grain = null;
  function buildGrain() {
    grain = [];
    for (let v = 0; v < 3; v++) {
      const c = canvas(W, H), x = c.getContext('2d'), r = rng(9 + v);
      const id = x.createImageData(W, H);
      for (let i = 0; i < id.data.length; i += 4) {
        const n = 128 + (r() - 0.5) * 60;
        id.data[i] = id.data[i + 1] = id.data[i + 2] = n; id.data[i + 3] = 255;
      }
      x.putImageData(id, 0, 0);
      x.globalAlpha = 0.08; x.strokeStyle = '#000';
      for (let k = 0; k < 220; k++) { x.lineWidth = r() * 1.2; x.beginPath(); const a = r() * W, b = r() * H; x.moveTo(a, b); x.quadraticCurveTo(a + r() * 30 - 15, b + r() * 30 - 15, a + r() * 60 - 30, b + r() * 60 - 30); x.stroke(); }
      // creases
      x.globalAlpha = 0.07; x.strokeStyle = '#fff'; x.lineWidth = 3;
      for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(r() * W, 0); x.lineTo(r() * W, H); x.stroke(); }
      grain.push(c);
    }
  }
  function finish(ctx, t, opts = {}) {
    if (!grain) buildGrain();
    ctx.save();
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.55;
    ctx.drawImage(grain[Math.floor(t * 12) % 3], 0, 0);
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1;
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(120,80,60,0.38)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(245,225,190,0.16)'; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // ---------- backgrounds ----------
  function fill(ctx, c) { ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); }
  function sunburst(ctx, cx, cy, n, cols, rot = 0, zig = 0) {
    const R = 1600;
    for (let i = 0; i < n; i++) {
      const a0 = rot + i / n * Math.PI * 2, a1 = rot + (i + 1) / n * Math.PI * 2;
      ctx.fillStyle = cols[i % cols.length];
      ctx.beginPath(); ctx.moveTo(cx, cy);
      if (!zig) { ctx.lineTo(cx + Math.cos(a0) * R, cy + Math.sin(a0) * R); ctx.lineTo(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R); }
      else {
        // lightning-edged ray
        const steps = 6;
        for (let k = 1; k <= steps; k++) { const r = R * k / steps, aa = a0 + (k % 2 ? zig : -zig) * (1 - k / steps * 0.5); ctx.lineTo(cx + Math.cos(aa) * r, cy + Math.sin(aa) * r); }
        for (let k = steps; k >= 1; k--) { const r = R * k / steps, aa = a1 + (k % 2 ? zig : -zig) * (1 - k / steps * 0.5); ctx.lineTo(cx + Math.cos(aa) * r, cy + Math.sin(aa) * r); }
      }
      ctx.closePath(); ctx.fill();
    }
  }
  function spiral(ctx, cx, cy, cols, rot = 0, arms = 10, twist = 2.4) {
    const R = 1500, seg = 60;
    for (let i = 0; i < arms; i++) {
      ctx.fillStyle = cols[i % cols.length];
      ctx.beginPath(); ctx.moveTo(cx, cy);
      const a0 = rot + i / arms * Math.PI * 2, a1 = rot + (i + 1) / arms * Math.PI * 2;
      for (let k = 0; k <= seg; k++) { const r = R * k / seg, tw = twist * Math.sqrt(k / seg) * 3; ctx.lineTo(cx + Math.cos(a0 + tw) * r, cy + Math.sin(a0 + tw) * r); }
      for (let k = seg; k >= 0; k--) { const r = R * k / seg, tw = twist * Math.sqrt(k / seg) * 3; ctx.lineTo(cx + Math.cos(a1 + tw) * r, cy + Math.sin(a1 + tw) * r); }
      ctx.closePath(); ctx.fill();
    }
  }
  function rings(ctx, cx, cy, cols, phase = 0, w = 46) {
    const n = Math.ceil(1500 / w) + 2;
    for (let i = n; i >= 0; i--) {
      const r = (i - (phase % 1)) * w; if (r <= 0) continue;
      ctx.fillStyle = cols[((i + Math.floor(phase)) % cols.length + cols.length) % cols.length];
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
    }
  }
  function checker(ctx, horizon, cols = [P.black, P.white], scroll = 0, tilt = 0, size = 90) {
    // perspective floor from horizon to bottom
    ctx.save();
    ctx.beginPath(); ctx.rect(0, horizon, W, H - horizon + 5); ctx.clip();
    if (tilt) { ctx.translate(W / 2, H); ctx.rotate(tilt); ctx.translate(-W / 2, -H); }
    const vx = W / 2, rows = 14;
    for (let r = 0; r < rows; r++) {
      const z0 = (r + (scroll % 1)) , z1 = z0 + 1;
      const y0 = horizon + (H - horizon) * Math.pow((z0) / rows, 2.0), y1 = horizon + (H - horizon) * Math.pow((z1) / rows, 2.0);
      const s0 = Math.pow(z0 / rows, 2.0), s1 = Math.pow(z1 / rows, 2.0);
      for (let c = -16; c < 16; c++) {
        ctx.fillStyle = cols[((c + r + Math.floor(scroll)) % 2 + 2) % 2];
        const xa0 = vx + c * size * 4 * s0, xb0 = vx + (c + 1) * size * 4 * s0, xa1 = vx + c * size * 4 * s1, xb1 = vx + (c + 1) * size * 4 * s1;
        ctx.beginPath(); ctx.moveTo(xa0, y0); ctx.lineTo(xb0, y0); ctx.lineTo(xb1, y1 + 1); ctx.lineTo(xa1, y1 + 1); ctx.fill();
      }
    }
    ctx.restore();
  }
  function stripes(ctx, cols, w = 60, ang = 0.5, off = 0) {
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(ang);
    const n = Math.ceil(1600 / w);
    for (let i = -n; i < n; i++) { ctx.fillStyle = cols[((i % cols.length) + cols.length) % cols.length]; ctx.fillRect(i * w + (off % (w * cols.length)), -1000, w + 1, 2000); }
    ctx.restore();
  }
  function halftoneWash(ctx, color, x, y, w, h, r = 3, gap = 10) {
    ctx.save(); ctx.fillStyle = dots(ctx, color, r, gap); ctx.fillRect(x, y, w, h); ctx.restore();
  }

  // ---------- cut paper ----------
  function tornPath(ctx, x, y, w, h, seed = 1, amp = 3, step = 9) {
    const r = rng(seed * 7919 + 13);
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let i = step; i < w; i += step) ctx.lineTo(x + i, y + (r() - 0.5) * amp * 2);
    ctx.lineTo(x + w, y);
    for (let i = step; i < h; i += step) ctx.lineTo(x + w + (r() - 0.5) * amp * 2, y + i);
    ctx.lineTo(x + w, y + h);
    for (let i = w - step; i > 0; i -= step) ctx.lineTo(x + i, y + h + (r() - 0.5) * amp * 2);
    ctx.lineTo(x, y + h);
    for (let i = h - step; i > 0; i -= step) ctx.lineTo(x + (r() - 0.5) * amp * 2, y + i);
    ctx.closePath();
  }
  // a paper card: white torn border, hard shadow, then fill (colour or callback drawing inside a clip)
  function card(ctx, x, y, w, h, opts = {}) {
    const { seed = 1, fill: f = P.paper, border = 8, shadow = 7, rot = 0, inner = null, edge = P.white, line = null } = opts;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.translate(-w / 2, -h / 2);
    if (shadow) { ctx.save(); ctx.translate(shadow, shadow); tornPath(ctx, -border, -border, w + border * 2, h + border * 2, seed, 3); ctx.fillStyle = 'rgba(30,10,10,0.38)'; ctx.fill(); ctx.restore(); }
    if (border) { tornPath(ctx, -border, -border, w + border * 2, h + border * 2, seed, 3); ctx.fillStyle = edge; ctx.fill(); }
    tornPath(ctx, 0, 0, w, h, seed + 3, border ? 1.2 : 3, 12); ctx.fillStyle = f; ctx.fill();
    if (line) { ctx.strokeStyle = line; ctx.lineWidth = 3; ctx.stroke(); }
    if (inner) { ctx.save(); tornPath(ctx, 0, 0, w, h, seed + 3, 1.2, 12); ctx.clip(); inner(ctx, w, h); ctx.restore(); }
    ctx.restore();
  }

  // ---------- type ----------
  const F = {
    comic: 'Bangers', anton: 'Anton', fat: 'Abril', mono: 'RubikMono', marker: 'Marker', sans: 'Inter', serif: 'DejaVu Serif'
  };
  function font(ctx, fam, size) { ctx.font = `${size}px "${F[fam] || fam}"`; }
  // comic word with outline and stepped extrude
  function word(ctx, text, x, y, o = {}) {
    const { fam = 'comic', size = 90, fill: f = P.yellow, stroke = P.ink, ext = P.red, depth = 8, rot = 0, sc = 1, align = 'center', lw = 0, skew = 0, alpha = 1, track = 0 } = o;
    if (sc <= 0.001 || alpha <= 0) return;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); if (skew) ctx.transform(1, 0, skew, 1, 0, 0);
    font(ctx, fam, size); ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    if (track) ctx.letterSpacing = track + 'px';
    const w = lw || size * 0.09;
    if (ext) { ctx.fillStyle = ext; ctx.strokeStyle = stroke; ctx.lineWidth = w * 2; for (let d = depth; d > 0; d -= 1.5) { ctx.strokeText(text, d, d); } for (let d = depth; d > 0; d -= 1.5) ctx.fillText(text, d, d); }
    ctx.strokeStyle = stroke; ctx.lineWidth = w * 2; ctx.strokeText(text, 0, 0);
    ctx.fillStyle = f; ctx.fillText(text, 0, 0);
    ctx.restore();
  }
  // a word on a torn paper label (ransom style)
  function label(ctx, text, x, y, o = {}) {
    const { fam = 'anton', size = 46, fill: f = P.ink, bg = P.paper, rot = 0, sc = 1, seed = 3, pad = 14, alpha = 1, shadow = 5 } = o;
    if (sc <= 0.001 || alpha <= 0) return;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    font(ctx, fam, size); const m = ctx.measureText(text), w = m.width + pad * 2, h = size * 1.18;
    card(ctx, -w / 2, -h / 2, w, h, { seed, fill: bg, border: 0, shadow });
    ctx.fillStyle = f; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, size * 0.05);
    ctx.restore();
  }
  // ransom-note: each letter its own label
  const RANSOM = [
    { fam: 'anton', bg: P.yellow, fill: P.ink }, { fam: 'fat', bg: P.paper, fill: P.red }, { fam: 'comic', bg: P.pink, fill: P.white },
    { fam: 'mono', bg: P.ink, fill: P.yellow }, { fam: 'fat', bg: P.blue, fill: P.white }, { fam: 'anton', bg: P.white, fill: P.blue },
    { fam: 'comic', bg: P.lime, fill: P.ink }, { fam: 'mono', bg: P.red, fill: P.paper }
  ];
  function ransom(ctx, text, x, y, o = {}) {
    const { size = 80, seed = 1, t = 99, t0 = 0, per = 0.06, gap = 6, rot = 0 } = o;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    // measure
    const items = [...text].map((ch, i) => { const st = RANSOM[(i * 5 + seed * 3) % RANSOM.length]; font(ctx, st.fam, size); return { ch, st, w: ch === ' ' ? size * 0.35 : ctx.measureText(ch).width + 18 }; });
    const tot = items.reduce((a, b) => a + b.w + gap, -gap); let cx = -tot / 2;
    items.forEach((it, i) => {
      const k = (t - t0 - i * per) / 0.22;
      if (it.ch !== ' ' && k > 0) {
        const r = (hash(i * 3.1 + seed) - 0.5) * 0.25, dy = (hash(i * 7.7 + seed) - 0.5) * size * 0.18;
        label(ctx, it.ch, cx + it.w / 2, dy, { fam: it.st.fam, size: size * (0.85 + hash(i + seed) * 0.3), fill: it.st.fill, bg: it.st.bg, rot: r, sc: ease.pop(k), seed: i + seed * 11, pad: 9 });
      }
      cx += it.w + gap;
    });
    ctx.restore();
  }
  // typewriter caption on a paper strip
  function typed(ctx, text, x, y, k, o = {}) {
    const { size = 34, fill: f = P.ink, bg = P.paper, fam = 'serif', rot = 0 } = o;
    const n = Math.floor(clamp(k) * text.length); if (!n) return;
    label(ctx, text.slice(0, n), x, y, { fam, size, fill: f, bg, rot, seed: 5 });
  }
  // pop-in envelope for an element that appears at t0
  const popAt = (t, t0, len = 0.28) => t < t0 ? 0 : ease.pop((t - t0) / len);

  // ---------- shapes ----------
  function star(ctx, x, y, r1, r2, n = 5, rot = -Math.PI / 2) {
    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r2 : r1, a = rot + i * Math.PI / n; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
    ctx.closePath();
  }
  function burst(ctx, x, y, r, col, o = {}) {
    const { n = 14, ink = P.ink, rot = 0, inner = 0.62, seed = 2 } = o;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) { const rr = (i % 2 ? r * inner : r * (0.85 + hash(i + seed) * 0.3)), a = i * Math.PI / n; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 5; ctx.stroke();
    ctx.restore();
  }
  function heart(ctx, x, y, s, col, ink = P.ink) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -30, -55, 0, -25); ctx.bezierCurveTo(30, -55, 60, -10, 0, 30); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); if (ink) { ctx.lineWidth = 4 / s; ctx.strokeStyle = ink; ctx.stroke(); }
    ctx.restore();
  }
  function arrow(ctx, x, y, len, ang, col) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(len - 26, -9); ctx.lineTo(len - 26, -22); ctx.lineTo(len, 0); ctx.lineTo(len - 26, 22); ctx.lineTo(len - 26, 9); ctx.lineTo(0, 9); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = P.ink; ctx.stroke(); ctx.restore();
  }
  // halftone grey city block cut-out
  function building(ctx, x, y, w, h, seed = 1, o = {}) {
    const { body = '#d9d3c7', win = P.ink, lit = P.yellow, shadow = true } = o;
    card(ctx, x, y, w, h, { seed, fill: body, border: 5, shadow: shadow ? 5 : 0, inner: (c, ww, hh) => {
      c.fillStyle = dots(c, 'rgba(40,30,30,0.5)', 1.6, 6); c.fillRect(ww * 0.55, 0, ww, hh);
      const r = rng(seed * 31); const cols = Math.max(2, Math.floor(ww / 26)), rows = Math.floor(hh / 30);
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        c.fillStyle = r() < 0.18 ? lit : win;
        c.fillRect(8 + i * (ww - 16) / cols, 10 + j * 30, (ww - 16) / cols - 9, 17);
      }
    } });
  }
  function skyline(ctx, base, t, seed = 1, scale = 1, o = {}) {
    const r = rng(seed); let x = -40;
    while (x < W + 40) {
      const w = (70 + r() * 90) * scale, h = (140 + r() * 260) * scale, rise = o.rise ? ease.back(clamp((o.rise - (x / W) * 0.6))) : 1;
      building(ctx, x, base - h * rise, w, h + 40, Math.floor(r() * 1000), o);
      x += w + 6 * scale - 10;
    }
  }

  // ---------- subtitles ----------
  function subtitle(ctx, text, who, k) {
    if (!text) return;
    ctx.save();
    font(ctx, 'Inter', 27); ctx.font = '700 27px Inter';
    const maxW = 980; const words = text.split(' '); const rows = []; let cur = '';
    for (const w of words) { const s = cur ? cur + ' ' + w : w; if (ctx.measureText(s).width > maxW && cur) { rows.push(cur); cur = w; } else cur = s; }
    rows.push(cur);
    const h = rows.length * 34 + 16, y = H - 26 - h;
    const w = Math.max(...rows.map(r => ctx.measureText(r).width)) + 40;
    ctx.globalAlpha = clamp(k * 4);
    ctx.fillStyle = 'rgba(20,14,14,0.82)'; tornPath(ctx, W / 2 - w / 2, y, w, h, 77, 2); ctx.fill();
    ctx.fillStyle = '#fff8e8'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    rows.forEach((r, i) => ctx.fillText(r, W / 2, y + 9 + i * 34));
    ctx.restore();
  }

  window.Pop = { W, H, P, hash, rng, two, clamp, lerp, ease, jit, canvas, dots, lines, finish, fill, sunburst, spiral, rings, checker, stripes,
    halftoneWash, tornPath, card, word, label, ransom, typed, popAt, star, burst, heart, arrow, building, skyline, subtitle, font };
})();
