/* Painted sets for the Mahagatha film: Pichwai and miniature landscapes, skies, courts and cosmic spaces.
   Each set returns layered SVG (back, and optionally front) for a 1280x720 world. Static layers are rasterised once
   by the renderer, so they can be as ornate as we like. Live motion (water, flames, flowers, birds) is drawn per frame
   by fx in pichwai.js. Exports window.PWSets = { SETS, motif helpers }. */
(function () {
  const { f1, path, circ, curve, line, shade, lotusBud, GOLD, GOLD_HI, GOLD_LO, PEARL, RUBY, LINE } = window.PWFig;
  const W = 1280, H = 720;
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x6d2b79f5 >>> 0) % 100000) / 100000; }
  const rect = (x, y, w, h, fill, o = '') => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}"${o}/>`;
  const PAL = {
    night: '#1c2a5e', night2: '#132049', indigo: '#22306a', ink: '#0e1533', rani: '#a3285e', rani2: '#7e1f4c',
    red: '#c0362c', red2: '#9a2620', saffron: '#f0a020', gold: GOLD, cream: '#f3e6c8', ivory: '#fbf3df',
    leaf: '#2f5e34', leaf2: '#1d3c24', pista: '#a9c47c', teal: '#1d5a58', pond: '#173f45', pink: '#e7a5b8', hill: '#e4a3c4', sky: '#9fc3d8'
  };

  // ---------- motifs ----------
  function curl(x, y, r, col, w = 2.4, flip = 1) {   // the spiral cloud curl of the reference plates
    const d = `M${f1(x - r * 2.4 * flip)},${f1(y + r * 0.4)} C${f1(x - r * 1.2 * flip)},${f1(y + r * 0.6)} ${f1(x - r * 0.4 * flip)},${f1(y + r * 0.2)} ${f1(x)},${f1(y - r * 0.2)} C${f1(x + r * 0.6 * flip)},${f1(y - r * 0.9)} ${f1(x + r * 1.3 * flip)},${f1(y - r * 0.2)} ${f1(x + r * 1.1 * flip)},${f1(y + r * 0.5)} C${f1(x + r * 0.9 * flip)},${f1(y + r * 1.1)} ${f1(x + r * 0.2 * flip)},${f1(y + r * 1.0)} ${f1(x + r * 0.25 * flip)},${f1(y + r * 0.45)} C${f1(x + r * 0.3 * flip)},${f1(y + r * 0.1)} ${f1(x + r * 0.7 * flip)},${f1(y + r * 0.15)} ${f1(x + r * 0.65 * flip)},${f1(y + r * 0.45)}`;
    return curve(d, col, w);
  }
  function swirls(x0, y0, w, h, n, col, seed, o = {}) {
    const R = rng(seed); let s = '';
    for (let i = 0; i < n; i++) { const r = (o.rmin || 9) + R() * (o.rvar || 12); s += curl(x0 + R() * w, y0 + R() * h, r, col, o.w || 2, R() > 0.5 ? 1 : -1); }
    return s;
  }
  function stars(x0, y0, w, h, n, seed, col = '#fdf6dc') {
    const R = rng(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + R() * w, y = y0 + R() * h, r = 0.8 + R() * 2.2;
      s += R() < 0.25 ? `<path d="M${f1(x)},${f1(y - r * 2.4)}L${f1(x + r * 0.5)},${f1(y)}L${f1(x)},${f1(y + r * 2.4)}L${f1(x - r * 0.5)},${f1(y)}ZM${f1(x - r * 2.4)},${f1(y)}L${f1(x)},${f1(y + r * 0.5)}L${f1(x + r * 2.4)},${f1(y)}L${f1(x)},${f1(y - r * 0.5)}Z" fill="${col}"/>` : circ(x, y, r * 0.7, col, { op: 0.5 + R() * 0.5 });
    }
    return s;
  }
  // miniature cloud scroll: a lobed bank with curled edges
  function cloudBank(x, y, w, col, edge, seed) {
    const R = rng(seed); const n = Math.max(3, Math.round(w / 60));
    let d = `M${f1(x)},${f1(y)}`;
    for (let i = 0; i < n; i++) { const x1 = x + (i + 1) * w / n, r = w / n / 2; d += ` A${f1(r)},${f1(r * (0.7 + R() * 0.5))} 0 0 1 ${f1(x1)},${f1(y)}`; }
    d += ` L${f1(x + w)},${f1(y + 18)} L${f1(x)},${f1(y + 18)}Z`;
    let s = path(d, col, { stroke: edge, sw: 2 });
    for (let i = 0; i < n; i++) s += curl(x + (i + 0.5) * w / n, y - w / n * 0.18, w / n * 0.16, edge, 1.6, i % 2 ? 1 : -1);
    return s;
  }
  function tree(x, y, sc, kind = 'round', seed = 1, o = {}) {
    const R = rng(seed); let s = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * 100) / 100})">`;
    const dark = o.dark || PAL.leaf2, mid = o.mid || '#2b5233';
    if (kind === 'round' || kind === 'kadamba' || kind === 'mango') {
      s += path('M-7,0 C-6,-30 -4,-50 -8,-70 L8,-70 C4,-50 6,-30 7,0Z', '#6b3a1e', { sw: 1.2 });
      const lobes = [[0, -120, 52], [-36, -96, 36], [36, -96, 36], [-22, -150, 34], [22, -150, 34], [0, -168, 28]];
      let d = '';
      for (const [lx, ly, lr] of lobes) d += `M${lx + lr},${ly} A${lr},${lr} 0 1 0 ${lx - lr},${ly} A${lr},${lr} 0 1 0 ${lx + lr},${ly}Z`;
      s += `<path d="${d}" fill="${dark}" stroke="${LINE}" stroke-width="1.6"/>`;
      // leaf texture: little fans of strokes
      for (let i = 0; i < 70; i++) {
        const a = R() * Math.PI * 2, rr = Math.sqrt(R()) * 62, lx = Math.cos(a) * rr * 1.05, ly = -126 + Math.sin(a) * rr * 0.85;
        s += `<path d="M${f1(lx)},${f1(ly)} l-4,-7 M${f1(lx)},${f1(ly)} l0,-8 M${f1(lx)},${f1(ly)} l4,-7" stroke="${mid}" stroke-width="1.5" stroke-linecap="round"/>`;
      }
      if (kind === 'kadamba') for (let i = 0; i < 16; i++) { const a = R() * 6.28, rr = Math.sqrt(R()) * 58; s += circ(Math.cos(a) * rr, -126 + Math.sin(a) * rr * 0.8, 5, '#f2a516', { stroke: LINE, sw: 0.8 }); }
      if (kind === 'mango') for (let i = 0; i < 10; i++) { const a = R() * 6.28, rr = Math.sqrt(R()) * 55; s += `<ellipse cx="${f1(Math.cos(a) * rr)}" cy="${f1(-120 + Math.sin(a) * rr * 0.8)}" rx="4" ry="6" fill="#f2c230" stroke="${LINE}" stroke-width="0.7"/>`; }
    } else if (kind === 'cypress') {
      s += path('M0,-200 C24,-150 26,-60 16,0 L-16,0 C-26,-60 -24,-150 0,-200Z', dark, { sw: 1.5 });
      for (let i = 0; i < 26; i++) s += curve(`M${f1(-14 + R() * 28)},${f1(-20 - R() * 160)} l3,-8`, mid, 1.4);
    } else if (kind === 'banana') {
      s += path('M-6,0 C-5,-40 -4,-80 -6,-110 L6,-110 C4,-80 5,-40 6,0Z', '#7aa04a', { sw: 1.2 });
      for (let i = 0; i < 6; i++) { const a = -150 + i * 22; s += `<path transform="rotate(${a + 90} 0 -110)" d="M0,-110 C20,-130 60,-136 90,-120 C60,-112 24,-106 0,-110Z" fill="#5c8f3a" stroke="${LINE}" stroke-width="1.3"/>`; }
    } else if (kind === 'palm') {
      s += path('M-5,0 C-8,-60 -2,-120 6,-170 L12,-168 C6,-120 6,-60 7,0Z', '#8a5a2a', { sw: 1.2 });
      for (let i = 0; i < 8; i++) { const a = i * 45; s += `<path transform="rotate(${a} 9 -170)" d="M9,-170 C30,-176 54,-168 70,-150 C50,-160 30,-162 9,-170Z" fill="${mid}" stroke="${LINE}" stroke-width="1.2"/>`; }
    }
    return s + '</g>';
  }
  function lotusLeaf(x, y, r, seed = 1, col = '#3f7a3a') {
    const a = rng(seed)() * 360;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(1 0.42) rotate(${f1(a)})"><path d="M0,0 L${f1(r)},-4 A${f1(r)},${f1(r)} 0 1 1 ${f1(r)},4Z" fill="${col}" stroke="${LINE}" stroke-width="2.2"/>${[0, 60, 120, 180, 240, 300].map(k => `<path transform="rotate(${k})" d="M0,0 L${f1(r * 0.9)},0" stroke="${shade(col, 0.25)}" stroke-width="2"/>`).join('')}</g>`;
  }
  function pond(x, y, w, h, seed, o = {}) {
    const R = rng(seed); let s = path(`M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h}Z`, o.water || PAL.pond, { stroke: false });
    for (let i = 0; i < h / 10; i++) { const yy = y + 6 + i * 10; s += curve(`M${x},${yy} ` + Array.from({ length: Math.ceil(w / 30) }, (_, k) => `q7.5,-4 15,0 t15,0`).join(' '), shade(o.water || PAL.pond, 0.18), 1.2, { op: 0.55 }); }
    for (let i = 0; i < (o.leaves || w * h / 5000); i++) s += lotusLeaf(x + 30 + R() * (w - 60), y + 14 + R() * (h - 20), 16 + R() * 18, i + seed);
    for (let i = 0; i < (o.flowers || w * h / 14000); i++) s += lotusBud(x + 30 + R() * (w - 60), y + 20 + R() * (h - 20), 0.7 + R() * 0.5, R() * 0.8 + 0.2, R() > 0.7 ? '#fbeef0' : '#ef8fae');
    return s;
  }
  // Pichwai sea: rows of scalloped waves with white crest curls
  function waves(x0, y0, w, h, base, crest, seed, o = {}) {
    const R = rng(seed); let s = path(`M${x0},${y0} L${x0 + w},${y0} L${x0 + w},${y0 + h} L${x0},${y0 + h}Z`, base, { stroke: false });
    const rows = Math.round(h / (o.rowh || 26));
    for (let r = 0; r < rows; r++) {
      const yy = y0 + 10 + r * (h / rows), sz = (o.size || 26) * (0.7 + r / rows * 0.6), off = (r % 2) * sz;
      let d = `M${x0 - sz},${f1(yy + sz * 0.6)}`;
      for (let x = x0 - sz + off; x < x0 + w + sz; x += sz * 2) d += ` C${f1(x + sz * 0.2)},${f1(yy - sz * 0.2)} ${f1(x + sz * 1.4)},${f1(yy - sz * 0.4)} ${f1(x + sz * 1.6)},${f1(yy + sz * 0.3)} C${f1(x + sz * 1.3)},${f1(yy + sz * 0.1)} ${f1(x + sz * 1.0)},${f1(yy + sz * 0.3)} ${f1(x + sz * 2)},${f1(yy + sz * 0.6)}`;
      s += curve(d, crest, o.w || 2, { op: o.op || 0.9 });
    }
    return s;
  }
  function hills(x0, yb, w, col, seed, o = {}) {   // rounded miniature hills with dotted shrubs
    const R = rng(seed); let s = '';
    const n = o.n || 4;
    for (let i = 0; i < n; i++) {
      const cx = x0 + (i + 0.5) * w / n + (R() - 0.5) * 60, hw = w / n * (0.7 + R() * 0.5), hh = (o.h || 140) * (0.6 + R() * 0.6);
      const d = `M${f1(cx - hw)},${yb} C${f1(cx - hw * 0.7)},${f1(yb - hh * 0.9)} ${f1(cx - hw * 0.2)},${f1(yb - hh * 1.1)} ${f1(cx)},${f1(yb - hh)} C${f1(cx + hw * 0.3)},${f1(yb - hh * 1.1)} ${f1(cx + hw * 0.7)},${f1(yb - hh * 0.8)} ${f1(cx + hw)},${yb}Z`;
      s += path(d, i % 2 ? col : shade(col, -0.08), { sw: 1.4 });
      for (let k = 0; k < 6; k++) s += curve(`M${f1(cx - hw * 0.8 + k * hw * 0.3)},${yb} C${f1(cx - hw * 0.5 + k * hw * 0.2)},${f1(yb - hh * 0.5)} ${f1(cx - hw * 0.2 + k * hw * 0.1)},${f1(yb - hh * 0.8)} ${f1(cx)},${f1(yb - hh * 0.95)}`, shade(col, -0.15), 1, { op: 0.5 });
      for (let k = 0; k < (o.shrubs ?? 8); k++) { const sx = cx + (R() - 0.5) * hw * 1.4, sy = yb - R() * hh * 0.8; if (sy < yb - 4) s += circ(sx, sy, 4 + R() * 3, '#3a5a3a', { stroke: LINE, sw: 0.6 }); }
    }
    return s;
  }
  function mountainPeaks(x0, yb, w, col, edge, seed, h = 260) {   // Kailash-type rock: rounded stacked lumps
    const R = rng(seed); let s = '';
    for (let i = 0; i < 9; i++) {
      const cx = x0 + R() * w, ww = 60 + R() * 120, hh = h * (0.4 + R() * 0.6);
      s += path(`M${f1(cx - ww)},${yb} C${f1(cx - ww * 0.8)},${f1(yb - hh * 0.6)} ${f1(cx - ww * 0.3)},${f1(yb - hh)} ${f1(cx)},${f1(yb - hh)} C${f1(cx + ww * 0.3)},${f1(yb - hh)} ${f1(cx + ww * 0.8)},${f1(yb - hh * 0.6)} ${f1(cx + ww)},${yb}Z`, i % 2 ? col : shade(col, -0.06), { stroke: edge, sw: 1.6 });
      for (let k = 0; k < 4; k++) s += curve(`M${f1(cx - ww * 0.6 + k * 12)},${f1(yb - hh * 0.3 - k * 10)} C${f1(cx - ww * 0.3)},${f1(yb - hh * 0.7)} ${f1(cx)},${f1(yb - hh * 0.8 + k * 6)} ${f1(cx + ww * 0.3 - k * 8)},${f1(yb - hh * 0.6)}`, edge, 1.1, { op: 0.45 });
    }
    return s;
  }
  // cusped (Mughal-Rajput) arch outline: returns a path for an opening
  function cuspArch(x, y, w, h) {
    const r = w / 2, top = y - h, sh = y - h + r * 1.1;
    const lobes = 5; let d = `M${f1(x - r)},${f1(y)} L${f1(x - r)},${f1(sh)}`;
    for (let i = 0; i < lobes; i++) {
      const a0 = Math.PI + i * Math.PI / lobes, a1 = Math.PI + (i + 1) * Math.PI / lobes;
      const px = x + Math.cos(a1) * r, py = sh + Math.sin(a1) * r * 1.1;
      d += ` A${f1(r * 0.36)},${f1(r * 0.36)} 0 0 1 ${f1(px)},${f1(py)}`;
    }
    d += ` L${f1(x + r)},${f1(y)}Z`;
    return d;
  }
  function vine(x0, y0, x1, y1, col = GOLD, leaf = '#3f7a3a', seed = 1) {   // ornamental border vine
    const R = rng(seed); const len = Math.hypot(x1 - x0, y1 - y0), n = Math.round(len / 34);
    let s = line([[x0, y0], [x1, y1]], col, 1.6);
    for (let i = 0; i < n; i++) {
      const p = (i + 0.5) / n, x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p, sgn = i % 2 ? 1 : -1;
      const ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
      s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})"><path d="M0,0 C4,${sgn * -8} 10,${sgn * -10} 14,${sgn * -6} C10,${sgn * -2} 4,${sgn * -1} 0,0Z" fill="${leaf}"/>${circ(-8, sgn * 6, 3.4, i % 3 ? RUBY : PEARL)}${circ(-8, sgn * 6, 1.3, GOLD_HI)}</g>`;
    }
    return s;
  }
  // the decorative painted frame that sits over every scene (rasterised once)
  function border(o = {}) {
    const b = o.b || 16, col = o.col || '#8e1f22', inner = o.inner || GOLD;
    let s = `<path d="M0,0H${W}V${H}H0Z M${b},${b}V${H - b}H${W - b}V${b}Z" fill="${col}" fill-rule="evenodd"/>`;
    s += `<rect x="${b - 3}" y="${b - 3}" width="${W - 2 * b + 6}" height="${H - 2 * b + 6}" fill="none" stroke="${inner}" stroke-width="2.4"/>`;
    s += `<rect x="3" y="3" width="${W - 6}" height="${H - 6}" fill="none" stroke="${inner}" stroke-width="1.2" opacity="0.8"/>`;
    for (let x = 22; x < W - 10; x += 22) s += circ(x, b / 2, 2.1, PEARL, { op: 0.9 }) + circ(x, H - b / 2, 2.1, PEARL, { op: 0.9 });
    for (let y = 22; y < H - 10; y += 22) s += circ(b / 2, y, 2.1, PEARL, { op: 0.9 }) + circ(W - b / 2, y, 2.1, PEARL, { op: 0.9 });
    for (const [x, y] of [[b / 2, b / 2], [W - b / 2, b / 2], [b / 2, H - b / 2], [W - b / 2, H - b / 2]]) s += circ(x, y, 6, GOLD, { stroke: LINE, sw: 1 }) + circ(x, y, 2.6, RUBY);
    return s;
  }
  // paper grain + painted vignette, rasterised once and laid over everything
  function grain(seed = 4) {
    return `<filter id="pwGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="${seed}"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0 0.2  0 0 0 0.55 0"/></filter>
      <filter id="pwBlot"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="${seed + 3}"/><feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.35 -0.08"/></filter>
      <radialGradient id="pwVig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#1a0c04" stop-opacity="0"/><stop offset="1" stop-color="#1a0c04" stop-opacity="0.55"/></radialGradient>
      <rect width="${W}" height="${H}" filter="url(#pwGrain)" opacity="0.32"/><rect width="${W}" height="${H}" filter="url(#pwBlot)" opacity="0.6"/><rect width="${W}" height="${H}" fill="url(#pwVig)"/>`;
  }
  function moon(x, y, r, phase = 'full') {
    let s = `<circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="url(#pwGlowSoft)" opacity="0.6"/>` + circ(x, y, r, '#fbf3d8', { stroke: LINE, sw: 1.4 });
    if (phase === 'crescent') s += circ(x + r * 0.45, y - r * 0.2, r * 0.9, PAL.night);
    else s += circ(x - r * 0.3, y - r * 0.2, r * 0.2, '#efe2bc') + circ(x + r * 0.3, y + r * 0.3, r * 0.14, '#efe2bc');
    return s;
  }
  function sun(x, y, r) {
    let s = `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="url(#pwGlowSoft)" opacity="0.8"/>`;
    for (let i = 0; i < 24; i++) s += `<path transform="translate(${x} ${y}) rotate(${i * 15})" d="M-6,${-r} L0,${-r * 1.5} L6,${-r}Z" fill="${i % 2 ? GOLD : '#f26a1e'}" stroke="${LINE}" stroke-width="1"/>`;
    return s + circ(x, y, r, '#f6b52a', { stroke: LINE, sw: 1.6 }) + circ(x, y, r * 0.7, '#fbd35a');
  }
  const defs = `<defs><linearGradient id="pwSeaShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a8a" stop-opacity="0.45"/><stop offset="0.35" stop-color="#3a4a8a" stop-opacity="0.12"/><stop offset="1" stop-color="#1a2050" stop-opacity="0.18"/></linearGradient><radialGradient id="pwGlowSoft"><stop offset="0" stop-color="#fff4c4" stop-opacity="0.9"/><stop offset="1" stop-color="#fff4c4" stop-opacity="0"/></radialGradient>
    <linearGradient id="pwSkyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101a40"/><stop offset="1" stop-color="#26357a"/></linearGradient>
    <linearGradient id="pwSkyDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3b7a"/><stop offset="0.55" stop-color="#c2566d"/><stop offset="1" stop-color="#f4b552"/></linearGradient>
    <linearGradient id="pwSkyGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c64e"/><stop offset="1" stop-color="#f19a3a"/></linearGradient>
    <linearGradient id="pwSkyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f8fc0"/><stop offset="1" stop-color="#bcd6dc"/></linearGradient></defs>`;

  // ---------- sets ----------
  const SETS = {
    // The opening: a temple wall where a painted pichwai cloth hangs between brass lamps.
    temple: c => ({
      back: defs + rect(0, 0, W, H, '#5a1418') +
        (() => { let s = ''; for (let y = 0; y < H; y += 48) for (let x = (y / 48 % 2) * 24; x < W; x += 48) s += `<g transform="translate(${x} ${y})" opacity="0.22">${lotusBud(0, 10, 0.5, 1, '#e8a14a')}</g>`; return s; })() +
        rect(0, 600, W, 120, '#3a0c10') + line([[0, 600], [W, 600]], GOLD, 3) +
        // the cloth on its rod
        rect(250, 70, 780, 520, '#1c2a5e', ` stroke="${LINE}" stroke-width="3"`) + rect(232, 58, 816, 14, GOLD_LO, ` stroke="${LINE}" stroke-width="2"`) + circ(232, 65, 12, GOLD, { stroke: LINE, sw: 1.5 }) + circ(1048, 65, 12, GOLD, { stroke: LINE, sw: 1.5 }) +
        `<g transform="translate(250 70) scale(${780 / W} ${520 / H})">${SETS.ocean(c).back}</g>` +
        rect(250, 70, 780, 520, 'none', ` stroke="${GOLD}" stroke-width="10"`) + rect(262, 82, 756, 496, 'none', ` stroke="#8e1f22" stroke-width="6"`) +
        // hanging garlands of marigold
        (() => { let s = ''; for (const gx of [190, 1090]) for (let i = 0; i < 24; i++) s += circ(gx, 40 + i * 18, 8, i % 4 === 3 ? '#fbf3df' : '#f29a1e', { stroke: LINE, sw: 0.8 }); return s; })() +
        // toran of mango leaves across the top
        (() => { let s = rect(0, 0, W, 26, '#8e1f22'); for (let x = 10; x < W; x += 30) s += `<path d="M${x},20 C${x - 8},34 ${x - 2},54 ${x + 6},62 C${x + 12},50 ${x + 14},32 ${x + 10},20Z" fill="#3f7a3a" stroke="${LINE}" stroke-width="1"/>`; return s; })() +
        // lamp stands
        [150, 1130].map(x => `<path d="M${x - 30},600 L${x + 30},600 L${x + 14},560 L${x + 6},420 L${x + 26},400 L${x - 26},400 L${x - 6},420 L${x - 14},560Z" fill="${GOLD}" stroke="${LINE}" stroke-width="2"/>`).join('')
    }),
    // Darkness before creation: deep indigo with faint curls
    void: c => ({ back: defs + rect(0, 0, W, H, '#0b1029') + swirls(0, 0, W, H, 40, '#1b2550', 11, { rmin: 14, rvar: 26, w: 2.4 }) + stars(0, 0, W, H, 60, 3, '#3d4a86') }),
    // The causal ocean: night sky of curls and stars above a milk-white Pichwai sea
    ocean: c => {
      const milk = c.time === 'dawn';
      return {
        back: defs + `<rect width="${W}" height="${H}" fill="url(#${milk ? 'pwSkyDawn' : 'pwSkyNight'})"/>` + swirls(0, 0, W, 360, 34, milk ? '#f6d5c0' : '#5a69ab', 21, { rmin: 10, rvar: 18 }) + stars(0, 0, W, 330, 120, 5) +
          cloudBank(-40, 330, 420, milk ? '#f6c9b0' : '#2c3c80', milk ? '#fff0e0' : '#8fa0d8', 2) + cloudBank(860, 320, 480, milk ? '#f6c9b0' : '#2c3c80', milk ? '#fff0e0' : '#8fa0d8', 3) +
          waves(0, 380, W, 340, milk ? '#e9e3d4' : '#cfd8ea', milk ? '#8299b8' : '#4a5f9e', 7, { size: 22, rowh: 24, w: 2.4 }) +
          `<rect x="0" y="380" width="${W}" height="340" fill="url(#pwSeaShade)"/>` +
          (() => { const R = rng(71); let f = ''; for (let i = 0; i < 26; i++) f += circ(R() * W, 400 + R() * 300, 1.6 + R() * 2, '#ffffff', { stroke: false, op: 0.8 }); return f; })()
      };
    },
    // The lotus heaven above the sea: golden sky, the vast lotus seat in the middle (drawn live as fx)
    lotusSky: c => ({
      back: defs + `<rect width="${W}" height="${H}" fill="url(#pwSkyGold)"/>` + swirls(0, 0, W, 420, 30, '#fbe2a0', 31, { rmin: 10, rvar: 14 }) +
        sun(1080, 120, 46) + cloudBank(-30, 300, 360, '#fbe6b4', '#e8913a', 5) + cloudBank(900, 290, 420, '#fbe6b4', '#e8913a', 6) +
        waves(0, 470, W, 250, '#efe6d2', '#c8a26a', 9, { size: 20, rowh: 22 })
    }),
    // Kailash: snow mountain of rounded lumps under a moonlit sky
    kailash: c => ({
      back: defs + `<rect width="${W}" height="${H}" fill="url(#pwSkyNight)"/>` + swirls(0, 0, W, 300, 26, '#46559a', 41) + stars(0, 0, W, 300, 90, 7) + moon(1040, 110, 34, 'crescent') +
        mountainPeaks(-100, 640, 1480, '#e9eef5', '#8aa0c0', 9, 420) + mountainPeaks(-60, 700, 1400, '#f6f8fb', '#9cb0cc', 10, 260) +
        rect(0, 640, W, 80, '#dfe7f0') + tree(110, 650, 0.9, 'cypress', 3, { dark: '#24402e' }) + tree(1180, 660, 1, 'cypress', 4, { dark: '#24402e' })
    }),
    // Brahma's court: a vermilion wall with a cusped arch, a flowered floor (as in the court reference plate)
    court: c => {
      const wall = c.wall || PAL.red;
      let s = defs + rect(0, 0, W, H, wall) + `<path d="${cuspArch(640, 520, 760, 520)}" fill="${shade(wall, 0.06)}" stroke="${LINE}" stroke-width="2"/>` +
        rect(0, 520, W, 200, '#f4ead2') + line([[0, 520], [W, 520]], LINE, 2);
      // a gold diaper pattern of little four-petal flowers over the wall, kept out of the arch
      for (let y = 70; y < 500; y += 44) for (let x = 130 + ((y / 44) % 2) * 22; x < 1160; x += 44) {
        if (Math.abs(x - 640) < 360 && y > 520 - 470) continue;
        s += `<g transform="translate(${x} ${y})" opacity="0.55">${circ(0, -5, 3, GOLD)}${circ(5, 0, 3, GOLD)}${circ(0, 5, 3, GOLD)}${circ(-5, 0, 3, GOLD)}${circ(0, 0, 2, shade(wall, -0.3))}</g>`;
      }
      // the arch outlined twice in gold with a bead line, and a deeper inner niche
      s += `<path d="${cuspArch(640, 520, 720, 490)}" fill="${shade(wall, -0.12)}" stroke="${GOLD}" stroke-width="3"/>`;
      s += `<path d="${cuspArch(640, 520, 760, 520)}" fill="none" stroke="${GOLD_LO}" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>`;
      // frieze along the top and a toran of mango leaves with marigold strings
      s += rect(0, 0, W, 34, '#7a2a14') + line([[0, 34], [W, 34]], GOLD, 3);
      for (let x = 12; x < W; x += 24) s += path(`M${x - 9},34 C${x - 8},48 ${x - 2},58 ${x},62 C${x + 2},58 ${x + 8},48 ${x + 9},34Z`, x % 48 < 24 ? '#3f7a3a' : '#5c9a4a', { sw: 1 });
      for (const [a, b] of [[150, 470], [810, 1130]]) {
        let d = `M${a},40 Q${(a + b) / 2},130 ${b},40`; s += curve(d, '#e8941e', 5);
        for (let k = 0; k <= 12; k++) { const u = k / 12, x = (1 - u) * (1 - u) * a + 2 * u * (1 - u) * (a + b) / 2 + u * u * b, y = (1 - u) * (1 - u) * 40 + 2 * u * (1 - u) * 130 + u * u * 40; s += circ(x, y, 5, k % 2 ? '#f2b21e' : '#e8641e', { stroke: LINE, sw: 0.6 }); }
      }
      // two hanging lamps either side of the arch
      for (const x of [230, 1050]) s += line([[x, 34], [x, 200]], GOLD_LO, 1.5) + path(`M${x - 22},200 L${x + 22},200 L${x + 12},222 L${x - 12},222Z`, GOLD, { sw: 1.2 }) + path(`M${x},184 C${x - 6},192 ${x - 4},200 ${x},200 C${x + 4},200 ${x + 6},192 ${x},184Z`, '#ffb43a', { stroke: false });
      const R = rng(12);
      for (let i = 0; i < 70; i++) { const x = R() * W, y = 530 + R() * 180; s += `<g transform="translate(${f1(x)} ${f1(y)})">${curve('M0,0 C4,-6 10,-8 14,-6', '#5c8a4a', 1.2)}${circ(0, 0, 3.2, '#d2475a')}${circ(5, -3, 2.4, '#d2475a')}${circ(10, -6, 2, '#5c8a4a')}</g>`; }
      s += vine(0, 512, W, 512, GOLD, '#3f7a3a', 4);
      // pillars
      for (const x of [70, 1210]) s += rect(x - 26, 40, 52, 480, '#e9cf8e', ` stroke="${LINE}" stroke-width="2"`) + vine(x, 60, x, 500, GOLD_LO, '#3f7a3a', x) + rect(x - 34, 30, 68, 20, GOLD, ` stroke="${LINE}" stroke-width="1.5"`) + rect(x - 34, 500, 68, 20, GOLD, ` stroke="${LINE}" stroke-width="1.5"`);
      return { back: s };
    },
    // An ashram glade in the miniature landscape style: green meadow, dark round trees, pink hills, a river and cranes
    glade: c => {
      const dusk = c.time === 'dusk', night = c.time === 'night';
      let s = defs + `<rect width="${W}" height="${H}" fill="url(#${night ? 'pwSkyNight' : dusk ? 'pwSkyDawn' : 'pwSkyDay'})"/>`;
      if (night) s += stars(0, 0, W, 240, 80, 8) + moon(1080, 100, 30);
      s += hills(-60, 300, 1400, night ? '#6a4a7a' : PAL.hill, 13, { n: 5, h: 120 });
      s += rect(0, 290, W, 430, night ? '#2f4a3a' : '#7fa35c');
      for (let i = 0; i < 9; i++) s += tree(60 + i * 150 + (i % 2) * 40, 330, 0.36, 'round', 30 + i);
      s += path(`M0,420 C200,400 380,450 640,430 C900,410 1100,450 1280,430 L1280,480 C1100,500 900,465 640,485 C380,505 200,455 0,475Z`, night ? '#56688a' : '#cfd9e0', { sw: 1.2 });
      s += curve(`M60,445 C200,440 300,460 420,455 M700,450 C820,440 960,460 1100,452`, night ? '#8494b4' : '#ffffff', 1.4, { op: 0.8 });
      for (let i = 0; i < 6; i++) { const x = 180 + i * 170, y = 470 + (i % 2) * 20; s += `<g transform="translate(${x} ${y}) scale(0.5)">${crane()}</g>`; }
      s += tree(80, 720, 1.3, 'round', 51) + tree(1210, 720, 1.25, 'mango', 52) + tree(330, 560, 0.6, 'kadamba', 53) + tree(1000, 560, 0.62, 'banana', 54);
      return { back: s };
    },
    // a lotus pond under a night sky (the classic Pichwai lower register)
    pond: c => ({
      back: defs + `<rect width="${W}" height="${H}" fill="url(#pwSkyNight)"/>` + stars(0, 0, W, 300, 100, 9) + swirls(0, 0, W, 280, 20, '#46559a', 51) + moon(220, 120, 36) +
        tree(80, 420, 1.1, 'kadamba', 61) + tree(1200, 420, 1.15, 'round', 62) + tree(980, 420, 0.8, 'banana', 63) +
        rect(0, 400, W, 30, '#3d6a3a') + pond(0, 420, W, 300, 64, { leaves: 50, flowers: 26 })
    }),
    // The infinite fire pillar: deep night sky on all sides
    pillarSky: c => ({ back: defs + `<rect width="${W}" height="${H}" fill="url(#pwSkyNight)"/>` + swirls(0, 0, W, H, 50, '#3a4890', 71, { rmin: 10, rvar: 20 }) + stars(0, 0, W, H, 160, 13) }),
    // Inside the cosmos: deep space with mandala rings (used for visions)
    cosmos: c => {
      let s = defs + rect(0, 0, W, H, '#0a0f2a') + stars(0, 0, W, H, 260, 17);
      for (let i = 0; i < 6; i++) s += `<circle cx="640" cy="360" r="${80 + i * 70}" fill="none" stroke="${['#c2366d', '#f2a516', '#3d6fc4', '#2e8a57', '#f2a516', '#c2366d'][i]}" stroke-width="2" stroke-dasharray="${2 + i} ${6 + i * 2}" opacity="0.5"/>`;
      s += swirls(0, 0, W, H, 30, '#2a3570', 81, { rmin: 12, rvar: 24 });
      return { back: s };
    },
    // a fire-altar hall for the yajna
    yajna: c => {
      let s = SETS.court(Object.assign({}, c, { wall: '#a8481e' })).back;
      s += rect(560, 560, 160, 60, '#8a3a1a', ` stroke="${LINE}" stroke-width="2"`) + rect(540, 545, 200, 20, '#b4562a', ` stroke="${LINE}" stroke-width="2"`);
      for (let i = 0; i < 5; i++) s += rect(548 + i * 40, 548, 20, 14, '#d27a3a');
      return { back: s };
    },
    // plain painted backdrop for cards
    card: c => ({ back: defs + rect(0, 0, W, H, c.col || PAL.night) + swirls(0, 0, W, H, 40, shade(c.col || PAL.night, 0.12), 91, { rmin: 12, rvar: 22 }) })
  };
  function crane() {
    return path('M-20,0 C-24,-14 -10,-22 6,-20 C16,-34 18,-56 26,-62 C32,-64 36,-60 34,-56 L46,-56 L34,-52 C26,-46 24,-30 22,-16 C18,-4 0,4 -20,0Z', '#fbf8f0', { sw: 1.4 }) + line([[-4, 2], [-6, 26]], LINE, 1.4) + line([[6, 2], [8, 26]], LINE, 1.4);
  }

  window.PWSets = { SETS, border, grain, defs, swirls, stars, curl, cloudBank, tree, pond, lotusLeaf, waves, hills, mountainPeaks, cuspArch, vine, moon, sun, crane, rng, PAL, rect };
})();
