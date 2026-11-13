/* Ramayana paintings: core kit. Palette, seeded randomness, pattern fills, layers, ornament primitives.
   Everything is drawn as flat gouache shapes; the WebGL pass (shader.js) adds paint, paper and light. */
(function () {
  const R = (window.R = window.R || {});
  R.W = 1600; R.H = 900;

  const C = (R.C = {
    navy: '#1d2756', indigo: '#2a3878', blue: '#2c6aa0', azure: '#3f8fc4', sky: '#62abd2', pale: '#a8d4e2', ice: '#d5ebe6',
    teal: '#1c7c84', sea: '#2f9aa8', aqua: '#7cc7c4',
    mustard: '#e3a21f', gold: '#f6be2c', amber: '#d6861b', ochre: '#c88a2a', straw: '#f0cf78',
    orange: '#e77a1d', saffron: '#f08f22', peach: '#f4b072',
    red: '#c72f2c', vermilion: '#dd4a2b', crimson: '#9c1d2c', maroon: '#6e1626',
    pink: '#ee7c8f', rose: '#f3b6ae', magenta: '#c1367a', plum: '#6a2a66', violet: '#5b3f93',
    cream: '#f6ecd3', paper: '#f2e5c2', white: '#fcf7e8', bone: '#e6d9b8',
    green: '#2d7c4e', leaf: '#51994a', lime: '#9fbd3f', olive: '#878c2c', forest: '#1b5843', moss: '#3d6b3a',
    brown: '#7b4a2a', umber: '#4b2a1c', tan: '#c98b56', sand: '#dcc08a', clay: '#b5653a',
    ink: '#1a1430', black: '#15111d', grey: '#8d8b97', slate: '#4b5068', ash: '#c9c4bd', smoke: '#6b6676',
    sBlue: '#4ea5da', sFair: '#f1cba3', sWheat: '#e3ae7c', sTan: '#cf9562', sBrown: '#a4653b', sDark: '#70412b', sGrey: '#b9b3ae', sGreen: '#6f9a5a', sRak: '#5d6f8f', sRed: '#b6452f', sPurple: '#6d4f8f',
  });

  // ---------- randomness ----------
  R.rng = function (seed) {
    let a = (seed >>> 0) || 1;
    const f = function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    f.r = (a, b) => a + (b - a) * f();
    f.i = (a, b) => Math.floor(f.r(a, b + 1));
    f.pick = (arr) => arr[Math.floor(f() * arr.length)];
    return f;
  };
  const n = (R.n = (v) => Math.round(v * 10) / 10);
  const rad = (d) => (d * Math.PI) / 180;
  R.rad = rad;

  // ---------- colour helpers ----------
  const hex = (c) => { c = c.replace('#', ''); return [0, 2, 4].map((i) => parseInt(c.substr(i, 2), 16)); };
  R.mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  R.dark = (c, t = 0.25) => R.mix(c, '#15111d', t);
  R.light = (c, t = 0.25) => R.mix(c, '#fcf7e8', t);
  R.rgb = (c) => hex(c).map((v) => v / 255);

  // ---------- pattern registry (reset for every painting) ----------
  let defs = [], pid = 0, pcache = {};
  R.resetDefs = () => { defs = []; pid = 0; pcache = {}; };
  R.defs = () => defs.join('');
  R.pat = function (kind, a, b, k = 1) {
    const key = kind + a + b + k;
    if (pcache[key]) return pcache[key];
    const id = 'p' + pid++, s = (v) => n(v * k);
    let w = 16, h = 16, body = '';
    if (kind === 'dots') { w = h = 14; body = `<circle cx="${s(4)}" cy="${s(4)}" r="${s(1.9)}" fill="${b}"/><circle cx="${s(11)}" cy="${s(11)}" r="${s(1.9)}" fill="${b}"/>`; }
    else if (kind === 'bigdots') { w = h = 22; body = `<circle cx="${s(6)}" cy="${s(6)}" r="${s(3.6)}" fill="${b}"/><circle cx="${s(17)}" cy="${s(17)}" r="${s(3.6)}" fill="${b}"/>`; }
    else if (kind === 'rings') { w = h = 24; body = `<circle cx="${s(7)}" cy="${s(7)}" r="${s(3.6)}" fill="none" stroke="${b}" stroke-width="${s(1.6)}"/><circle cx="${s(19)}" cy="${s(19)}" r="${s(3.6)}" fill="none" stroke="${b}" stroke-width="${s(1.6)}"/>`; }
    else if (kind === 'stripes') { w = 12; h = 12; body = `<rect x="0" y="0" width="${s(5)}" height="${s(12)}" fill="${b}"/>`; }
    else if (kind === 'hstripes') { w = 12; h = 12; body = `<rect x="0" y="0" width="${s(12)}" height="${s(4.5)}" fill="${b}"/>`; }
    else if (kind === 'diag') { w = h = 12; body = `<path d="M-3,3 L3,-3 M0,12 L12,0 M9,15 L15,9" stroke="${b}" stroke-width="${s(3)}" transform="scale(${k})"/>`; }
    else if (kind === 'plus') { w = h = 20; body = `<path d="M5,2 V8 M2,5 H8 M15,12 V18 M12,15 H18" stroke="${b}" stroke-width="${s(1.8)}" stroke-linecap="round" transform="scale(${k})"/>`; }
    else if (kind === 'check') { w = h = 16; body = `<rect width="${s(8)}" height="${s(8)}" fill="${b}"/><rect x="${s(8)}" y="${s(8)}" width="${s(8)}" height="${s(8)}" fill="${b}"/>`; }
    else if (kind === 'zig') { w = 16; h = 10; body = `<path d="M0,8 L4,2 L8,8 L12,2 L16,8" fill="none" stroke="${b}" stroke-width="${s(1.8)}" transform="scale(${k})"/>`; }
    else if (kind === 'scale') { w = 20; h = 14; body = `<path d="M0,0 A10,10 0 0 0 20,0 M-10,7 A10,10 0 0 0 10,7 M10,7 A10,10 0 0 0 30,7 M0,14 A10,10 0 0 0 20,14" fill="none" stroke="${b}" stroke-width="${s(1.6)}" transform="scale(${k})"/>`; }
    else if (kind === 'leafs') { w = 22; h = 18; body = `<path d="M3,6 Q8,0 13,6 Q8,9 3,6 Z M12,15 Q17,9 22,15 Q17,18 12,15 Z" fill="${b}" transform="scale(${k})"/>`; }
    else if (kind === 'swirl') { w = h = 30; body = `<path d="M15,15 m0,-2 a2,2 0 1 1 -2,2 a5,5 0 1 1 5,5 a8,8 0 1 1 -8,-8" fill="none" stroke="${b}" stroke-width="${s(1.7)}" stroke-linecap="round" transform="scale(${k})"/>`; }
    else if (kind === 'flower') { w = h = 26; body = `<g transform="scale(${k})"><circle cx="8" cy="8" r="2" fill="${b}"/><path d="M8,2 v3 M8,11 v3 M2,8 h3 M11,8 h3" stroke="${b}" stroke-width="2" stroke-linecap="round"/><circle cx="21" cy="21" r="1.6" fill="${b}"/></g>`; }
    else if (kind === 'stone') { w = 64; h = 46; body = `<path d="M0,10 L14,4 L30,12 L46,3 L64,10 M14,4 L10,22 L26,30 L30,12 M46,3 L44,24 L26,30 M44,24 L64,32 M10,22 L0,32 M26,30 L22,46 M44,24 L50,46 M0,32 L0,33" fill="none" stroke="${b}" stroke-width="${s(2.2)}" stroke-linejoin="round" transform="scale(${k})"/>`; }
    else if (kind === 'brick') { w = 40; h = 24; body = `<path d="M0,0 H40 M0,12 H40 M10,0 V12 M30,12 V24" stroke="${b}" stroke-width="${s(1.8)}" transform="scale(${k})"/>`; }
    else if (kind === 'thatch') { w = 14; h = 18; body = `<path d="M3,0 L2,10 M8,4 L7,16 M12,0 L11,9" stroke="${b}" stroke-width="${s(1.6)}" stroke-linecap="round" transform="scale(${k})"/>`; }
    else if (kind === 'feather') { w = 26; h = 20; body = `<path d="M0,0 Q13,22 26,0 M-13,10 Q0,32 13,10 M13,10 Q26,32 39,10" fill="none" stroke="${b}" stroke-width="${s(2)}" transform="scale(${k})"/><path d="M13,2 V9" stroke="${b}" stroke-width="${s(1.2)}" transform="scale(${k})"/>`; }
    else if (kind === 'wave') { w = 40; h = 16; body = `<path d="M0,8 Q10,0 20,8 T40,8" fill="none" stroke="${b}" stroke-width="${s(2)}" transform="scale(${k})"/>`; }
    else if (kind === 'bark') { w = 18; h = 30; body = `<path d="M4,0 Q7,8 4,15 M12,10 Q15,20 12,30 M9,2 v5" fill="none" stroke="${b}" stroke-width="${s(1.6)}" stroke-linecap="round" transform="scale(${k})"/>`; }
    else if (kind === 'fur') { w = 16; h = 14; body = `<path d="M2,2 q2,4 0,7 M9,6 q2,4 0,7 M13,0 q2,3 0,5" fill="none" stroke="${b}" stroke-width="${s(1.4)}" stroke-linecap="round" transform="scale(${k})"/>`; }
    defs.push(`<pattern id="${id}" width="${s(w)}" height="${s(h)}" patternUnits="userSpaceOnUse"><rect width="${s(w)}" height="${s(h)}" fill="${a}"/>${body}</pattern>`);
    return (pcache[key] = `url(#${id})`);
  };
  R.grad = function (stops, dir = 'v', radial) {
    const id = 'g' + pid++;
    const st = stops.map((s, i) => `<stop offset="${s[1] != null ? s[1] : i / (stops.length - 1)}" stop-color="${s[0]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('');
    defs.push(radial ? `<radialGradient id="${id}" cx="${radial[0]}" cy="${radial[1]}" r="${radial[2]}" gradientUnits="userSpaceOnUse">${st}</radialGradient>`
      : `<linearGradient id="${id}" x1="0" y1="0" x2="${dir === 'h' ? 1 : 0}" y2="${dir === 'h' ? 0 : 1}">${st}</linearGradient>`);
    return `url(#${id})`;
  };

  // flatten any drawing to a single colour (shadows, apparitions, distant armies)
  R.sil = function (inner, col, op = 1) { const id = 'f' + pid++; defs.push(`<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feFlood flood-color="${col}"/><feComposite in2="SourceAlpha" operator="in"/></filter>`); return `<g filter="url(#${id})" opacity="${op}">${inner}</g>`; };
  // ---------- svg string helpers ----------
  const at = (o) => (o ? Object.keys(o).map((k) => ` ${k}="${o[k]}"`).join('') : '');
  R.path = (d, fill, o) => `<path d="${d}" fill="${fill || 'none'}"${at(o)}/>`;
  R.line = (d, stroke, w = 2, o) => `<path d="${d}"${at(Object.assign({ fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, o))}/>`;
  R.circ = (x, y, r, fill, o) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${fill || 'none'}"${at(o)}/>`;
  R.ell = (x, y, rx, ry, fill, o) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill || 'none'}"${at(o)}/>`;
  R.rect = (x, y, w, h, fill, o) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fill || 'none'}"${at(o)}/>`;
  R.g = (inner, tf, o) => `<g${tf ? ` transform="${tf}"` : ''}${at(o)}>${inner}</g>`;
  R.tf = (x, y, s = 1, rot = 0, flip = 1) => `translate(${n(x)},${n(y)})${rot ? ` rotate(${n(rot)})` : ''} scale(${n(s * flip * 100) / 100},${n(s * 100) / 100})`;
  R.poly = (pts, close) => pts.map((p, i) => (i ? 'L' : 'M') + n(p[0]) + ',' + n(p[1])).join(' ') + (close ? ' Z' : '');
  // smooth closed/open curve through points (Catmull-Rom to bezier)
  R.smooth = function (pts, close) {
    const P = pts, L = P.length; if (L < 3) return R.poly(P, close);
    const g = (i) => (close ? P[(i + L) % L] : P[Math.max(0, Math.min(L - 1, i))]);
    let d = `M${n(P[0][0])},${n(P[0][1])}`;
    for (let i = 0; i < (close ? L : L - 1); i++) {
      const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      d += ` C${n(p1[0] + (p2[0] - p0[0]) / 6)},${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)},${n(p2[1] - (p3[1] - p1[1]) / 6)} ${n(p2[0])},${n(p2[1])}`;
    }
    return d + (close ? ' Z' : '');
  };

  // ---------- ornament primitives (the motifs of the style) ----------
  R.spiral = function (x, y, r, col = C.white, w = 3, turns = 2.2, dir = 1, a0 = 0) {
    const pts = []; const N = Math.ceil(turns * 14);
    for (let i = 0; i <= N; i++) { const t = i / N, a = a0 + dir * t * turns * Math.PI * 2, rr = r * (0.08 + 0.92 * t); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
    return R.line(R.smooth(pts), col, w);
  };
  R.ring = (x, y, r, col = C.white, w = 3) => R.circ(x, y, r, 'none', { stroke: col, 'stroke-width': w });
  // scatter of spirals + rings + dots, the confetti of every painting
  R.motes = function (seed, box, count, cols, o = {}) {
    const f = R.rng(seed); let s = '';
    for (let i = 0; i < count; i++) {
      const x = f.r(box[0], box[2]), y = f.r(box[1], box[3]), c = f.pick(cols), k = f();
      const sz = f.r(o.min || 6, o.max || 22);
      if (o.kind === 'ring' || (!o.kind && k < 0.3)) s += R.ring(x, y, sz * 0.45, c, o.w || 2.6);
      else if (o.kind === 'dot' || (!o.kind && k < 0.5)) s += R.circ(x, y, sz * 0.2, c);
      else if (o.kind === 'star') s += R.star(x, y, sz * 0.35, c);
      else s += R.spiral(x, y, sz, c, o.w || 2.4, f.r(1.6, 2.6), f() < 0.5 ? 1 : -1, f.r(0, 6));
    }
    return s;
  };
  R.star = (x, y, r, col) => `<path d="M${n(x)},${n(y - r)} L${n(x + r * 0.28)},${n(y - r * 0.28)} L${n(x + r)},${n(y)} L${n(x + r * 0.28)},${n(y + r * 0.28)} L${n(x)},${n(y + r)} L${n(x - r * 0.28)},${n(y + r * 0.28)} L${n(x - r)},${n(y)} L${n(x - r * 0.28)},${n(y - r * 0.28)} Z" fill="${col}"/>`;
  // wavy horizontal band: top edge waves, bottom flat (or another wave)
  R.band = function (y, amp, wl, fill, o = {}) {
    const x0 = o.x0 != null ? o.x0 : -80, x1 = o.x1 != null ? o.x1 : R.W + 80, ph = o.ph || 0, bot = o.bot != null ? o.bot : R.H + 80;
    const pts = []; for (let x = x0; x <= x1 + 1; x += wl / 4) pts.push([x, y + Math.sin((x / wl) * Math.PI * 2 + ph) * amp + (o.tilt || 0) * (x - x0)]);
    let d = R.smooth(pts);
    if (o.h) { const p2 = []; for (let x = x1; x >= x0 - 1; x -= wl / 4) p2.push([x, y + o.h + Math.sin((x / wl) * Math.PI * 2 + ph + (o.ph2 || 1.3)) * amp * (o.amp2 || 1) + (o.tilt || 0) * (x - x0)]); d += ' L' + R.smooth(p2).slice(1) + ' Z'; }
    else d += ` L${x1},${bot} L${x0},${bot} Z`;
    return R.path(d, fill, o.attr);
  };
  // sunburst: white disc with brush-streak rays (as behind a deity)
  R.burst = function (x, y, r, o = {}) {
    const f = R.rng(o.seed || 7), col = o.col || C.white, N = o.n || 46; let s = '';
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + f.r(-0.05, 0.05), r0 = r * f.r(0.75, 1.02), r1 = r * f.r(1.5, o.len || 3.2), w = f.r(2, o.w || 7);
      s += `<path d="M${n(x + Math.cos(a) * r0)},${n(y + Math.sin(a) * r0)} L${n(x + Math.cos(a) * r1)},${n(y + Math.sin(a) * r1)}" stroke="${col}" stroke-width="${n(w)}" stroke-linecap="round" opacity="${n(f.r(0.8, 1))}"/>`;
      if (f() < 0.5) s += R.circ(x + Math.cos(a + 0.05) * r1 * f.r(1.02, 1.25), y + Math.sin(a + 0.05) * r1 * f.r(1.02, 1.25), f.r(1.5, 4), col);
    }
    // ragged disc
    const pts = []; for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2, rr = r * f.r(0.93, 1.07); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
    return s + R.path(R.smooth(pts, true), col);
  };
  // scalloped (cusped) arch opening path, used for palace frames
  R.archD = function (x, y, w, h, cusps = 5) {
    // x,y = bottom-left of the opening, w wide, h tall; top is a multi-foil arch
    const sh = Math.min(h * 0.45, w * 0.55), top = y - h, cx = x + w / 2; let d = `M${n(x)},${n(y)} L${n(x)},${n(top + sh)}`;
    const pts = []; for (let i = 0; i <= cusps; i++) { const t = i / cusps, a = Math.PI * (1 - t); pts.push([cx + Math.cos(a) * w / 2, top + sh - Math.sin(a) * sh * (0.75 + 0.25 * Math.sin(a))]); }
    for (let i = 1; i < pts.length; i++) { const p = pts[i - 1], q = pts[i], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1, k = L * 0.42; d += ` Q${n(mx + (dy / L) * k)},${n(my - (dx / L) * k)} ${n(q[0])},${n(q[1])}`; }
    return d + ` L${n(x + w)},${n(y)} Z`;
  };
  // squiggle line between two points (border ornament)
  R.squig = function (x0, y0, x1, y1, amp, wl, col, w = 3) {
    const L = Math.hypot(x1 - x0, y1 - y0), N = Math.max(4, Math.round(L / (wl / 2))), ux = (x1 - x0) / L, uy = (y1 - y0) / L; const pts = [];
    for (let i = 0; i <= N; i++) { const t = i / N, o = (i % 2 ? 1 : -1) * amp; pts.push([x0 + (x1 - x0) * t - uy * o, y0 + (y1 - y0) * t + ux * o]); }
    return R.line(R.smooth(pts), col, w);
  };
  // paisley / mango flame motif (torch flames, cypress trees, ornaments). Tip curls to +x.
  R.paisley = function (x, y, s, fill, inner, core, rot = 0, stripes) {
    let g = R.path('M0,40 C-34,40 -40,-6 -16,-34 C-4,-48 10,-62 30,-64 C18,-52 22,-40 28,-24 C40,6 30,40 0,40 Z', fill);
    if (stripes) for (let i = 0; i < 7; i++) g += R.line(`M${-26 + i * 2},${24 - i * 11} Q${-4 + i},${20 - i * 11} ${22 - i * 0.5},${28 - i * 12}`, stripes, 2.2);
    if (inner) g += R.path('M0,28 C-20,28 -24,0 -8,-18 C0,-27 8,-34 14,-36 C10,-26 14,-18 17,-8 C24,10 18,28 0,28 Z', inner);
    if (core) g += R.path('M0,20 C-10,20 -12,6 -4,-4 C0,-9 4,-12 6,-13 C5,-8 7,-4 9,2 C12,10 9,20 0,20 Z', core) + R.circ(0, 10, 4, R.C.gold);
    return R.g(g, R.tf(x, y, s, rot));
  };
  // scroll vine ornament along a horizontal run (palace friezes)
  R.scroll = function (x0, x1, y, r, col, w = 4, flip = 1) {
    let s = ''; const step = r * 3.1;
    for (let x = x0 + r, i = 0; x < x1 - r * 0.5; x += step, i++) {
      const d = (i % 2 ? -1 : 1) * flip;
      s += R.spiral(x, y, r, col, w, 1.6, d, d > 0 ? Math.PI : 0);
      s += R.line(`M${n(x + r * d * -1 * -1)},${n(y)} q${n(step * 0.3)},${n(-r * d)} ${n(step - r)},0`, col, w * 0.8);
      s += R.circ(x + step / 2, y + r * 0.75 * d, w * 0.9, col);
    }
    return s;
  };
  // flame tongue cluster in flat paint
  R.flame = function (x, y, s, seed = 1, cols) {
    const f = R.rng(seed); cols = cols || [C.crimson, C.vermilion, C.saffron, C.gold, C.white]; let out = '';
    cols.forEach((c, i) => {
      const k = 1 - i * 0.2, w = 60 * k, h = 150 * k, tips = 3 + (i < 2 ? 2 : 0); let d = `M${-w},0`;
      for (let j = 0; j < tips; j++) { const x0 = -w + (2 * w * j) / tips, x1 = -w + (2 * w * (j + 1)) / tips, th = h * f.r(0.55, 1) * (1 - Math.abs((j + 0.5) / tips - 0.5) * 0.9), sw = f.r(-14, 14); d += ` C${n(x0 - 6)},${n(-th * 0.4)} ${n((x0 + x1) / 2 + sw - 8)},${n(-th * 0.7)} ${n((x0 + x1) / 2 + sw)},${n(-th)} C${n((x0 + x1) / 2 + sw + 4)},${n(-th * 0.6)} ${n(x1 + 6)},${n(-th * 0.35)} ${n(x1)},${n(j === tips - 1 ? 0 : -h * 0.18)}`; }
      out += R.path(d + ` Q0,${n(26 * k)} ${-w},0 Z`, c);
    });
    return R.g(out, R.tf(x, y, s));
  };
  R.smoke = function (x, y, s, col, seed = 3, nn = 5) {
    const f = R.rng(seed); let out = '';
    for (let i = 0; i < nn; i++) out += R.spiral(f.r(-40, 40) + i * 14, -i * 62 - f.r(0, 20), f.r(26, 46) + i * 5, col, f.r(7, 12), 1.7, i % 2 ? 1 : -1, f.r(0, 6));
    return R.g(out, R.tf(x, y, s), { opacity: 0.85 });
  };
  // anime speed lines radiating to/from a point, within the frame
  R.speed = function (x, y, o = {}) {
    const f = R.rng(o.seed || 5), N = o.n || 70, col = o.col || C.white; let s = '';
    for (let i = 0; i < N; i++) { const a = f.r(o.a0 || 0, o.a1 || Math.PI * 2), r0 = f.r(o.r0 || 260, (o.r0 || 260) * 1.6), r1 = r0 + f.r(160, 900), w = f.r(1.5, o.w || 9); s += `<path d="M${n(x + Math.cos(a) * r0)},${n(y + Math.sin(a) * r0)} L${n(x + Math.cos(a) * r1)},${n(y + Math.sin(a) * r1)}" stroke="${col}" stroke-width="${n(w)}" stroke-linecap="round" opacity="${n(f.r(0.35, 0.95))}"/>`; }
    return s;
  };
  R.impact = function (x, y, r, cols, seed = 9, spikes = 14) {
    const f = R.rng(seed); let out = '';
    cols.forEach((c, k) => { const rr = r * (1 - k * 0.24), pts = []; for (let i = 0; i < spikes * 2; i++) { const a = (i / (spikes * 2)) * Math.PI * 2, q = i % 2 ? rr * f.r(0.42, 0.56) : rr * f.r(0.8, 1.15); pts.push([x + Math.cos(a) * q, y + Math.sin(a) * q]); } out += R.path(R.poly(pts, true), c); });
    return out;
  };
  // curling confetti streamers
  R.streamers = function (seed, box, count, col = C.cream, w = 5) {
    const f = R.rng(seed); let s = '';
    for (let i = 0; i < count; i++) { const x = f.r(box[0], box[2]), y = f.r(box[1], box[3]), a = f.r(-1.2, 1.2), L = f.r(40, 110), c = f.r(18, 50) * (f() < 0.5 ? 1 : -1); s += R.g(R.line(`M0,0 C${n(c)},${n(L * 0.3)} ${n(-c)},${n(L * 0.6)} ${n(c * 0.4)},${n(L)}`, Array.isArray(col) ? f.pick(col) : col, f.r(w * 0.6, w)), `translate(${n(x)},${n(y)}) rotate(${n(a * 57)})`); if (f() < 0.5) s += R.circ(x + f.r(-30, 30), y + f.r(-30, 30), f.r(3, 6), Array.isArray(col) ? f.pick(col) : col); }
    return s;
  };

  // ---------- painting context: depth layers + light cues for the shader ----------
  R.Painting = function (meta) {
    R.resetDefs();
    const P = { meta, L: { sky: [], bg: [], mid: [], fg: [], mask: [] }, fx: { glow: [], fire: [], rays: null, tint: null, motes: 1 }, notes: [] };
    ['sky', 'bg', 'mid', 'fg', 'mask'].forEach((k) => (P[k] = (...s) => { P.L[k].push(s.join('')); return P; }));
    P.water = (d) => P.mask(R.path(d, '#ff0000'));           // region whose paint flows and glitters
    P.waterRect = (x, y, w, h) => P.mask(R.rect(x, y, w, h, '#ff0000'));
    P.glow = (x, y, r, col = C.gold, i = 0.8) => { if (P.fx.glow.length < 4) P.fx.glow.push([x, y, r, i, col]); return P; };
    P.fire = (x, y, r, i = 1) => { if (P.fx.fire.length < 4) P.fx.fire.push([x, y, r, i]); return P; };
    P.rays = (x, y, i = 0.7, col = C.cream) => { P.fx.rays = [x, y, i, col]; return P; };
    P.note = (x, y, name, text, layer = 'mid') => { P.notes.push({ x, y, name, text, layer }); return P; };
    P.svg = (k, w, h) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${R.W} ${R.H}" width="${w || R.W}" height="${h || R.H}"><defs>${R.defs()}</defs>${P.L[k].join('')}</svg>`;
    return P;
  };
  R.paintings = [];
  R.add = (meta, draw) => R.paintings.push(Object.assign({ draw }, meta));
})();
