/* Ramayana paintings: skies, land, water, trees, architecture and stage properties. */
(function () {
  const R = window.R, C = R.C, n = R.n, W = R.W, H = R.H;
  const { path, line, circ, ell, g, rect, pat } = R;
  const ol = (c, w = 1.4) => ({ stroke: R.dark(c, 0.4), 'stroke-width': w, 'stroke-linejoin': 'round' });

  // ---------------- sky ----------------
  const SKY = {
    day: [C.sky, [C.pale, C.azure, C.ice], [C.white, C.cream]], noon: [C.pale, [C.ice, C.sky, C.cream], [C.white, C.gold]],
    dawn: [C.peach, [C.rose, C.straw, C.pink], [C.white, C.gold]], dusk: [C.orange, [C.saffron, C.magenta, C.vermilion, C.plum], [C.gold, C.cream]],
    night: [C.navy, [C.indigo, C.blue, C.ink], [C.gold, C.cream, C.pale]], deep: [C.ink, [C.navy, C.indigo, C.plum], [C.gold, C.pale]],
    gold: [C.mustard, [C.straw, C.amber, C.saffron], [C.white, C.cream]], storm: [C.slate, [C.smoke, C.indigo, C.ink], [C.ash, C.pale]],
    paper: [C.paper, [C.cream, C.bone, C.straw], [C.mustard, C.azure]], fire: [C.crimson, [C.vermilion, C.maroon, C.saffron], [C.gold, C.cream]],
    teal: [C.teal, [C.sea, C.forest, C.blue], [C.gold, C.cream]], rose: [C.rose, [C.pink, C.cream, C.peach], [C.white, C.gold]],
    plum: [C.plum, [C.magenta, C.violet, C.maroon], [C.gold, C.rose]], green: [C.forest, [C.green, C.moss, C.teal], [C.lime, C.gold]],
  };
  R.sky = function (P, o = {}) {
    const k = SKY[o.time || 'day'], f = R.rng(o.seed || 3); let s = rect(-80, -80, W + 160, H + 160, o.base || k[0]);
    const bands = o.bands != null ? o.bands : 5;
    for (let i = 0; i < bands; i++) {
      const y = f.r(40, (o.h || 620)), col = f.pick(k[1]);
      s += R.band(y, f.r(30, 95), f.r(620, 1300), col, { h: f.r(34, 110), ph: f.r(0, 6), ph2: f.r(0.4, 2.2), amp2: f.r(0.6, 1.3), tilt: f.r(-0.12, 0.12), attr: { opacity: n(f.r(0.5, 0.95)) } });
    }
    if (o.sun) s += R.burst(o.sun[0], o.sun[1], o.sun[2], { col: o.sun[3] || C.white, seed: o.seed, len: o.sun[4] || 3 });
    if (o.disc) s += circ(o.disc[0], o.disc[1], o.disc[2] * 1.22, o.disc[3] || C.gold, { opacity: 0.35 }) + circ(o.disc[0], o.disc[1], o.disc[2], o.disc[3] || C.gold) + R.ring(o.disc[0], o.disc[1], o.disc[2] * 0.8, o.disc[4] || C.saffron, 3);
    if (o.moon) { const m = o.moon; s += circ(m[0], m[1], m[2] * 1.35, C.pale, { opacity: 0.22 }) + circ(m[0], m[1], m[2], C.cream) + (m[3] ? circ(m[0] + m[2] * 0.36, m[1] - m[2] * 0.12, m[2] * 0.92, o.base || k[0]) : R.spiral(m[0], m[1], m[2] * 0.6, C.bone, 3, 1.6)); }
    const mo = o.motes != null ? o.motes : 26;
    if (mo) s += R.motes((o.seed || 3) + 1, o.box || [0, 0, W, o.h || 600], mo, o.mcols || k[2], { min: 8, max: o.mmax || 28 });
    if (o.stars) s += R.motes((o.seed || 3) + 2, [0, 0, W, o.h || 560], o.stars, [C.cream, C.gold, C.white], { kind: 'star', min: 8, max: 24 }) + R.motes((o.seed || 3) + 5, [0, 0, W, o.h || 560], o.stars * 2, [C.cream, C.pale], { kind: 'dot', min: 5, max: 12 });
    P.sky(s); return P;
  };
  // folk cloud: scalloped body with a curl
  R.cloud = function (x, y, s, col = C.white, col2) {
    col2 = col2 || R.dark(col, 0.14);
    return g(path('M-120,20 C-150,20 -150,-22 -112,-22 C-112,-56 -62,-66 -44,-40 C-30,-74 30,-74 40,-38 C60,-62 112,-50 106,-18 C146,-18 148,20 116,20 Z', col) + R.spiral(-66, -18, 22, col2, 4, 1.5, 1, 0) + R.spiral(8, -26, 26, col2, 4, 1.6, -1, 3) + R.spiral(78, -12, 20, col2, 4, 1.5, 1, 1), R.tf(x, y, s));
  };
  R.rain = function (seed, col = C.pale, cnt = 160, slant = -0.25) { const f = R.rng(seed); let s = ''; for (let i = 0; i < cnt; i++) { const x = f.r(-60, W + 60), y = f.r(-40, H), L = f.r(26, 70); s += `<path d="M${n(x)},${n(y)} l${n(L * slant)},${n(L)}" stroke="${col}" stroke-width="${n(f.r(1.6, 3.6))}" stroke-linecap="round" opacity="${n(f.r(0.4, 0.9))}"/>`; } return s; };
  R.bolt = function (x, y, len, col = C.white, seed = 4) { const f = R.rng(seed); const pts = [[x, y]]; let cx = x, cy = y; while (cy < y + len) { cx += f.r(-50, 50); cy += f.r(40, 80); pts.push([cx, cy]); } return line(R.poly(pts), C.gold, 12, { opacity: 0.5 }) + line(R.poly(pts), col, 5); };

  // ---------------- land ----------------
  R.ground = function (y, col, o = {}) {
    const f = R.rng(o.seed || 21); let s = R.band(y, o.amp != null ? o.amp : 10, o.wl || 520, col, { ph: o.ph || 0, tilt: o.tilt || 0 });
    const c2 = o.c2 || R.dark(col, 0.14), c3 = o.c3 || R.light(col, 0.22);
    for (let i = 0; i < (o.stripes != null ? o.stripes : 3); i++) s += R.band(y + 40 + i * (o.gap || 54) + f.r(-6, 6), f.r(5, 14), f.r(380, 700), i % 2 ? c3 : c2, { h: f.r(8, 20), ph: f.r(0, 6), attr: { opacity: 0.7 }, tilt: o.tilt || 0 });
    const tufts = o.tufts != null ? o.tufts : 26;
    for (let i = 0; i < tufts; i++) { const x = f.r(0, W), yy = y + f.r(14, H - y - 6) + (o.tilt || 0) * x, k = f.r(0.7, 1.5), c = f.pick(o.tcols || [c2, c3, C.lime]); s += g(line('M0,0 q-5,-9 -9,-13 M0,0 q0,-10 1,-17 M0,0 q5,-8 10,-12', c, 2.4), `translate(${n(x)},${n(yy)}) scale(${n(k)})`); }
    const fl = o.flowers || 0;
    for (let i = 0; i < fl; i++) { const x = f.r(0, W), yy = y + f.r(12, H - y - 8) + (o.tilt || 0) * x; s += g(R.item('flower', { col: f.pick(o.fcols || [C.white, C.pink, C.gold, C.vermilion]) }), `translate(${n(x)},${n(yy)}) scale(${n(f.r(0.5, 0.9))})`); }
    return s;
  };
  // rounded folk mountain with contour stripes
  R.peak = function (x, y, w, h, col, o = {}) {
    const lean = o.lean || 0, d = (k) => `M${n(x - (w / 2) * k)},${n(y)} C${n(x - w * 0.3 * k)},${n(y - h * 0.5 * k)} ${n(x - w * 0.16 * k + lean * k)},${n(y - h * k)} ${n(x + lean * k)},${n(y - h * k)} C${n(x + w * 0.16 * k + lean * k)},${n(y - h * k)} ${n(x + w * 0.3 * k)},${n(y - h * 0.5 * k)} ${n(x + (w / 2) * k)},${n(y)}`;
    let s = path(d(1) + ' Z', o.fill || col);
    const c2 = o.c2 || R.light(col, 0.2); for (let k = 0.82; k > 0.2; k -= o.step || 0.17) s += line(d(k), c2, o.lw || 4, { opacity: 0.8 });
    if (o.snow) s += path(`M${n(x - w * 0.12 + lean)},${n(y - h * 0.84)} Q${n(x + lean)},${n(y - h * 1.04)} ${n(x + w * 0.12 + lean)},${n(y - h * 0.84)} l${n(-w * 0.04)},${n(h * 0.05)} l${n(-w * 0.04)},${n(-h * 0.04)} l${n(-w * 0.04)},${n(h * 0.06)} l${n(-w * 0.04)},${n(-h * 0.04)} Z`, o.snow);
    return s;
  };
  R.hills = function (seed, y, cnt, cols, o = {}) { const f = R.rng(seed); let s = ''; for (let i = 0; i < cnt; i++) { const x = (o.x0 || -60) + (((o.x1 || W + 60) - (o.x0 || -60)) * (i + f.r(0.1, 0.9))) / cnt; s += R.peak(x, y, f.r(o.w0 || 340, o.w1 || 620), f.r(o.h0 || 120, o.h1 || 300), f.pick(cols), { lean: f.r(-30, 30), snow: o.snow, step: o.step }); } return s; };
  R.rocks = function (seed, x0, x1, y, cnt, col = C.slate, sz = 40) { const f = R.rng(seed); let s = ''; for (let i = 0; i < cnt; i++) { const x = f.r(x0, x1), k = f.r(0.6, 1.4) * sz; s += path(`M${n(x - k)},${n(y)} L${n(x - k * 0.8)},${n(y - k * 0.7)} L${n(x - k * 0.2)},${n(y - k * 1.1)} L${n(x + k * 0.6)},${n(y - k * 0.8)} L${n(x + k)},${n(y)} Z`, pat('stone', col, R.light(col, 0.3), 0.5), ol(col)); } return s; };

  // ---------------- water ----------------
  // flat painted water between y0 and y1 (or inside a path d) with bands, curls and wave ticks; registers the flow mask
  R.water = function (P, layer, y0, y1, o = {}) {
    const f = R.rng(o.seed || 31), col = o.col || C.blue, c2 = o.c2 || C.sky, c3 = o.c3 || C.navy; const hh = y1 - y0; let s = '';
    s += R.band(y0, o.amp != null ? o.amp : 12, o.wl || 300, col, { bot: y1 + 100, ph: o.ph || 0 });
    for (let i = 0; i < (o.bands != null ? o.bands : 5); i++) { const y = y0 + hh * f.r(0.08, 0.95); s += R.band(y, f.r(8, 26), f.r(260, 560), f.pick([c2, c3, c2, R.light(c2, 0.3)]), { h: f.r(10, 34), ph: f.r(0, 6), ph2: f.r(0.5, 2), attr: { opacity: n(f.r(0.5, 0.9)) } }); }
    for (let i = 0; i < (o.curls != null ? o.curls : 12); i++) s += R.spiral(f.r(0, W), y0 + hh * f.r(0.12, 0.96), f.r(12, 30), o.curl || C.white, 2.6, f.r(1.5, 2.4), f() < 0.5 ? 1 : -1, f.r(0, 6));
    for (let i = 0; i < (o.ticks != null ? o.ticks : 30); i++) { const x = f.r(0, W), y = y0 + hh * f.r(0.06, 0.98); s += line(`M${n(x)},${n(y)} q8,-8 16,0 q8,8 16,0`, o.curl || C.white, 2, { opacity: 0.7 }); }
    P[layer](o.clip ? g(s, null, { 'clip-path': o.clip }) : s);
    if (o.mask !== false) P.mask(R.band(y0, o.amp != null ? o.amp : 12, o.wl || 300, '#ff0000', { bot: y1 + 100, ph: o.ph || 0 }));
    return P;
  };
  R.fish = function (x, y, s, col = C.orange, col2 = C.gold, rot = 0, flip = 1) {
    return g(path('M-70,0 C-40,-34 30,-34 62,-4 L74,0 L62,6 C30,30 -40,32 -70,0 Z', col, ol(col)) + path('M-66,0 L-104,-26 Q-92,0 -104,26 Z', col2, ol(col2)) + line('M-40,-17 Q-30,0 -40,17 M-18,-22 Q-8,0 -18,22 M4,-21 Q14,0 4,21 M26,-15 Q34,0 26,15', col2, 3) + path('M-10,-24 Q6,-44 26,-26 Z', col2) + path('M36,-8 Q46,-15 58,-6 Q47,-1 36,-8 Z', C.white) + circ(47, -7, 3, C.ink) + line('M34,-9 Q46,-17 60,-6', C.ink, 1.8), R.tf(x, y, s, rot, flip));
  };
  R.lotusPad = (x, y, s, col = C.pink) => g(ell(0, 6, 44, 12, C.green, ol(C.green)) + line('M0,6 L26,0', C.forest, 2) + g(R.item('lotus'), 'translate(-6,6) scale(.9)').replace(/#f3b6ae/g, R.light(col, 0.4)), R.tf(x, y, s));

  // ---------------- trees ----------------
  function trunk(h, w, col = C.brown) { return path(`M${-w},0 Q${-w * 0.5},${-h * 0.5} ${-w * 0.6},${-h} L${w * 0.6},${-h} Q${w * 0.5},${-h * 0.5} ${w},0 Z`, pat('bark', col, R.dark(col, 0.3), 0.8), ol(col)); }
  R.tree = function (kind, x, y, s = 1, o = {}) {
    const c = o.c || C.green, c2 = o.c2 || R.light(c, 0.3), f = R.rng(o.seed || Math.round(x * 7 + y)); let t = '';
    if (kind === 'round') { t += trunk(150, 13, o.tc); [[-46, -176, 52], [44, -182, 56], [0, -226, 64], [-2, -168, 50]].forEach((q, i) => (t += circ(q[0], q[1], q[2], i % 2 ? pat('leafs', c, c2) : pat('scale', c, c2, 0.9), ol(c)))); t += line('M0,-150 q-20,-20 -40,-22 M0,-160 q22,-18 40,-22', R.dark(o.tc || C.brown, 0.1), 5); }
    else if (kind === 'tier') { t += trunk(170, 10, o.tc); [[0, -130, 86, 40], [0, -182, 70, 36], [0, -230, 52, 32], [0, -272, 32, 26]].forEach((q, i) => { t += ell(q[0], q[1], q[2], q[3], i % 2 ? c2 : c, ol(c)); for (let k = -3; k <= 3; k++) t += line(`M${k * q[2] * 0.25},${q[1] + q[3] * 0.5} q${k * 2},${-q[3] * 0.5} ${k * 3},${-q[3] * 0.8}`, i % 2 ? c : c2, 3); }); }
    else if (kind === 'cypress') { t += trunk(60, 7, o.tc) + R.paisley(0, -150, 2.3, c, c2, o.core, -24, R.dark(c, 0.2)); }
    else if (kind === 'palm') { t += line('M0,0 Q22,-140 -6,-290', R.dark(o.tc || C.brown, 0.35), 20) + line('M0,0 Q22,-140 -6,-290', pat('hstripes', o.tc || C.tan, C.brown, 1.4), 16); for (let i = 0; i < 9; i++) { const a = -200 + i * 28; t += g(path('M0,0 C40,-26 110,-20 150,14 C104,4 46,6 0,0 Z', i % 2 ? c : c2, ol(c)) + line('M10,-2 Q80,-12 140,12', R.dark(c, 0.25), 1.6), `translate(-6,-290) rotate(${a})`); } t += circ(-4, -282, 9, C.amber) + circ(8, -276, 8, C.amber); }
    else if (kind === 'sal') { t += trunk(330, 12, o.tc || C.umber); [[0, -330, 62, 34], [-26, -290, 46, 24], [30, -276, 44, 22], [0, -372, 40, 28]].forEach((q, i) => (t += ell(q[0], q[1], q[2], q[3], pat('leafs', i % 2 ? c2 : c, i % 2 ? c : c2), ol(c)))); }
    else if (kind === 'banyan') { t += path('M-40,0 C-30,-60 -34,-130 -60,-180 L60,-180 C34,-130 30,-60 40,0 Z', pat('bark', o.tc || C.brown, C.umber), ol(C.brown)); for (let i = 0; i < 7; i++) { const xx = -170 + i * 56 + f.r(-10, 10); t += line(`M${xx},-190 q${f.r(-8, 8)},70 ${f.r(-6, 6)},${f.r(120, 185)}`, o.tc || C.brown, f.r(3, 6)); } [[-130, -220, 86, 52], [0, -250, 120, 74], [130, -220, 90, 54], [-60, -290, 80, 50], [70, -296, 84, 50]].forEach((q, i) => (t += ell(q[0], q[1], q[2], q[3], i % 2 ? pat('leafs', c, c2) : pat('scale', c, c2), ol(c)))); }
    else if (kind === 'ashoka') { t += trunk(110, 11, o.tc); t += path('M0,-330 C70,-300 96,-200 80,-120 C60,-80 -60,-80 -80,-120 C-96,-200 -70,-300 0,-330 Z', pat('leafs', c, c2), ol(c)); for (let i = 0; i < 12; i++) { const xx = f.r(-56, 56), yy = f.r(-290, -110); t += circ(xx, yy, 9, o.fl || C.vermilion) + circ(xx + 7, yy + 6, 7, C.saffron) + circ(xx - 6, yy + 7, 6, o.fl || C.red); } }
    else if (kind === 'bare') { t += line('M0,0 Q-8,-90 4,-180 M2,-90 q-40,-40 -70,-50 M0,-120 q40,-40 80,-46 M4,-180 q-30,-40 -56,-50 M4,-180 q24,-40 44,-70 M-40,-124 q-12,-22 -8,-44 M50,-152 q20,-10 34,-30', o.tc || C.umber, 9); }
    else if (kind === 'plantain') { t += line('M0,0 Q4,-80 0,-150', C.leaf, 16); for (let i = 0; i < 6; i++) t += g(path('M0,0 C30,-40 40,-130 10,-190 C-24,-130 -22,-40 0,0 Z', i % 2 ? c : c2, ol(c)) + line('M2,-6 Q12,-90 8,-180', R.dark(c, 0.25), 2), `translate(0,-140) rotate(${-75 + i * 30})`); }
    else if (kind === 'bloom') { t += trunk(140, 11, o.tc); [[-44, -170, 50], [42, -176, 52], [0, -216, 60]].forEach((q) => (t += circ(q[0], q[1], q[2], c, ol(c)))); for (let i = 0; i < 26; i++) { const a = f.r(0, 6.28), r = f.r(0, 78); t += g(R.item('flower', { col: f.pick(o.fcols || [C.white, C.pink, C.gold]) }), `translate(${n(Math.cos(a) * r)},${n(-186 + Math.sin(a) * r * 0.75)}) scale(.62)`); } }
    else if (kind === 'bush') { [[-30, -24, 34], [26, -26, 36], [0, -44, 38]].forEach((q, i) => (t += circ(q[0], q[1], q[2], i % 2 ? pat('leafs', c, c2) : c, ol(c)))); if (o.fl) for (let i = 0; i < 7; i++) t += circ(f.r(-46, 46), f.r(-64, -10), 5.5, o.fl); }
    else if (kind === 'reed') { for (let i = 0; i < 7; i++) t += line(`M${i * 8 - 24},0 q${f.r(-10, 10)},-50 ${f.r(-16, 16)},${-f.r(80, 130)}`, i % 2 ? c : c2, 4); t += ell(-10, -122, 5, 14, C.brown) + ell(14, -104, 5, 13, C.brown); }
    return g(t, R.tf(x, y, s, o.rot || 0, o.flip || 1), o.op != null ? { opacity: o.op } : null);
  };
  R.grove = function (seed, x0, x1, y, cnt, o = {}) {
    const f = R.rng(seed), kinds = o.kinds || ['round', 'tier', 'cypress', 'sal'], cols = o.cols || [C.green, C.leaf, C.forest, C.moss, C.olive]; const items = [];
    for (let i = 0; i < cnt; i++) { const x = x0 + ((x1 - x0) * (i + f.r(0.15, 0.85))) / cnt; items.push([x, y + f.r(-(o.jy || 14), o.jy || 14), f.r(o.s0 || 0.8, o.s1 || 1.25), f.pick(kinds), f.pick(cols)]); }
    items.sort((a, b) => a[1] - b[1]);
    return items.map((t) => R.tree(t[3], t[0], t[1], t[2], { c: t[4], seed: Math.round(t[0]), fl: o.fl, fcols: o.fcols, tc: o.tc })).join('');
  };
  // big foreground leaves that frame a forest painting
  R.fronds = function (seed, side, o = {}) {
    const f = R.rng(seed), cols = o.cols || [C.forest, C.green, C.moss]; let s = '';
    const cnt = o.n || 7;
    for (let i = 0; i < cnt; i++) { const c = f.pick(cols), L = f.r(170, 320) * (o.s || 1), w = L * f.r(0.18, 0.28), a = (side === 'L' ? f.r(8, 80) : side === 'R' ? f.r(-80, -8) : f.r(-50, 50)); const x = side === 'L' ? f.r(-40, 40) : side === 'R' ? W + f.r(-40, 40) : f.r(0, W), y = side === 'T' ? f.r(-30, 10) : H + f.r(-10, 60); s += g(path(`M0,0 C${n(w)},${n(-L * 0.3)} ${n(w)},${n(-L * 0.8)} 0,${n(-L)} C${n(-w)},${n(-L * 0.8)} ${n(-w)},${n(-L * 0.3)} 0,0 Z`, c) + line(`M0,0 L0,${n(-L * 0.94)}`, R.light(c, 0.25), 3) + Array.from({ length: 5 }, (_, k) => line(`M0,${n(-L * (0.18 + k * 0.15))} l${n(w * 0.6)},${n(-L * 0.08)} M0,${n(-L * (0.18 + k * 0.15))} l${n(-w * 0.6)},${n(-L * 0.08)}`, R.light(c, 0.25), 2)).join(''), `translate(${n(x)},${n(y)}) rotate(${n(side === 'T' ? 180 + a : a)})`); }
    return s;
  };
  R.vine = function (x, y, len, col = C.leaf, seed = 2, fl) { const f = R.rng(seed); const pts = []; for (let i = 0; i <= 8; i++) pts.push([x + Math.sin(i * 1.3 + seed) * 22, y + (len * i) / 8]); let s = line(R.smooth(pts), col, 4); pts.forEach((p, i) => { if (i) s += g(path('M0,0 C10,-8 22,-6 26,4 C16,8 6,8 0,0 Z', col), `translate(${n(p[0])},${n(p[1])}) rotate(${i % 2 ? 20 : 160})`) + (fl && i % 2 ? circ(p[0] + (i % 4 ? 12 : -12), p[1] + 8, 6, fl) : ''); }); return s; };

  // ---------------- architecture ----------------
  R.pillar = function (x, y, h, w = 44, col = C.red, col2 = C.gold) {
    let s = rect(x - w / 2, y - h, w, h, pat('hstripes', col, R.dark(col, 0.18), 2.4), ol(col));
    s += rect(x - w / 2 - 10, y - 26, w + 20, 26, col2, ol(col2)) + rect(x - w / 2 - 12, y - h - 6, w + 24, 30, col2, ol(col2)) + path(`M${x - w / 2 - 12},${y - h - 6} q${(w + 24) / 2},-30 ${w + 24},0 Z`, col2, ol(col2));
    s += R.squig(x, y - h + 40, x, y - 40, 7, 34, col2, 3);
    return s;
  };
  // wall pierced by cusped arches: returns the wall as one even-odd path so the layer behind shows through
  R.arcade = function (x0, x1, yTop, yBase, arches, o = {}) {
    const col = o.col || C.navy; let d = `M${x0},${yTop} H${x1} V${yBase} H${x0} Z`, deco = '';
    arches.forEach((a) => { // a = [cx, w, h, cusps]
      d += ' ' + R.archD(a[0] - a[1] / 2, yBase, a[1], a[2], a[3] || 7);
      const bw = o.bw || 16, D = R.archD(a[0] - a[1] / 2, yBase, a[1], a[2], a[3] || 7);
      deco += path(D, 'none', { stroke: o.border || C.red, 'stroke-width': bw * 2, 'stroke-linejoin': 'round', 'clip-path': 'none' }) + path(D, 'none', { stroke: o.trim || C.gold, 'stroke-width': 3.2, 'stroke-dasharray': '2 9', 'stroke-linecap': 'round' });
      deco += path(R.archD(a[0] - a[1] / 2 - bw, yBase, a[1] + bw * 2, a[2] + bw, a[3] || 7), 'none', { stroke: o.trim || C.gold, 'stroke-width': 3.4 });
    });
    return deco + path(d, o.fill || col, { 'fill-rule': 'evenodd' });
  };
  R.frieze = function (y, h, col = C.mustard, col2 = C.pink, o = {}) {
    let s = rect(-80, y, W + 160, h, col) + line(`M-80,${y + h} H${W + 80}`, o.edge || C.red, 7) + line(`M-80,${y} H${W + 80}`, o.edge || C.red, 4);
    s += R.scroll(-40, W + 40, y + h / 2, h * 0.24, col2, 5);
    for (let x = 20; x < W; x += 82) s += circ(x, y + h - 14, 4, o.dot || C.red) + circ(x + 41, y + 13, 4, o.dot || C.azure);
    return s;
  };
  R.dome = function (x, y, s, col = C.gold, col2 = C.red) { return g(path('M-50,0 C-76,-40 -46,-92 0,-118 C46,-92 76,-40 50,0 Z', col, ol(col)) + line('M0,-118 L0,-158', col, 5) + circ(0, -140, 8, col) + path('M0,-158 L26,-150 L0,-140 Z', col2) + line('M-30,-8 Q-34,-60 0,-112 M30,-8 Q34,-60 0,-112 M0,-6 V-112', R.dark(col, 0.2), 2) + rect(-58, -4, 116, 12, col2), R.tf(x, y, s)); };
  // a palace or city front: tiers of little arches, domes and pennants
  R.palace = function (x, y, w, h, o = {}) {
    const f = R.rng(o.seed || 41), wall = o.wall || C.cream, trim = o.trim || C.red, roof = o.roof || C.gold; let s = '';
    const tiers = o.tiers || 2, th = h / tiers;
    for (let t = 0; t < tiers; t++) {
      const tw = w * (1 - t * 0.22), tx = x - tw / 2, ty = y - (t + 1) * th;
      s += rect(tx, ty, tw, th, t % 2 ? R.dark(wall, 0.08) : wall, ol(wall)) + rect(tx - 10, ty - 10, tw + 20, 14, trim) + line(`M${tx},${ty + 14} H${tx + tw}`, roof, 3, { 'stroke-dasharray': '2 10' });
      const na = Math.max(2, Math.round(tw / (o.aw || 90)));
      for (let i = 0; i < na; i++) { const ax = tx + (tw * (i + 0.5)) / na, aw = (tw / na) * 0.56; s += path(R.archD(ax - aw / 2, ty + th - 8, aw, th * 0.7, 5), o.win || C.navy) + path(R.archD(ax - aw / 2, ty + th - 8, aw, th * 0.7, 5), 'none', { stroke: trim, 'stroke-width': 4 }); if (o.lamps && f() < 0.5) s += circ(ax, ty + th * 0.56, 5, C.gold); }
    }
    const topw = w * (1 - (tiers - 1) * 0.22), ty = y - h;
    const nd = o.domes || 3; for (let i = 0; i < nd; i++) { const dx = x - topw / 2 + (topw * (i + 0.5)) / nd; s += R.dome(dx, ty - 8, (i === (nd - 1) / 2 ? 1 : 0.7) * (o.ds || 0.8), roof, trim); }
    return s;
  };
  R.city = function (seed, x0, x1, y, o = {}) {
    const f = R.rng(seed); let s = ''; const cnt = o.n || 9;
    for (let i = 0; i < cnt; i++) { const x = x0 + ((x1 - x0) * (i + f.r(0.2, 0.8))) / cnt, w = f.r(90, 190) * (o.s || 1), h = f.r(110, 300) * (o.s || 1); s += R.palace(x, y, w, h, { seed: seed + i, wall: f.pick(o.walls || [C.cream, C.rose, C.straw, C.peach, C.white]), trim: f.pick(o.trims || [C.red, C.azure, C.teal, C.orange]), roof: f.pick(o.roofs || [C.gold, C.red, C.azure]), tiers: f.i(1, 3), domes: f.i(1, 3), ds: 0.5, aw: 60, win: o.win, lamps: o.lamps }); }
    return s;
  };
  // Lanka: golden towers on the triple peak
  R.lanka = function (x, y, s, o = {}) {
    let t = R.peak(0, 0, 900, 300, o.rock || C.plum, { c2: o.rock2 || C.violet, lean: -30 }) + R.peak(-300, 0, 520, 200, o.rock || C.plum, { c2: o.rock2 || C.violet }) + R.peak(300, 0, 560, 220, o.rock || C.plum, { c2: o.rock2 || C.violet, lean: 20 });
    t += rect(-330, -250, 660, 60, pat('brick', C.amber, C.gold, 1.2), ol(C.amber)); for (let i = 0; i < 14; i++) t += rect(-330 + i * 48, -268, 26, 20, C.amber);
    t += R.city(o.seed || 77, -300, 300, -250, { n: 8, walls: [C.gold, C.mustard, C.straw, C.amber], trims: [C.red, C.crimson], roofs: [C.gold], win: o.win || C.maroon, lamps: o.lamps, s: 0.9 });
    t += path(R.archD(-36, -190, 72, 96, 5), o.win || C.maroon) + path(R.archD(-36, -190, 72, 96, 5), 'none', { stroke: C.red, 'stroke-width': 6 });
    return g(t, R.tf(x, y, s));
  };
  R.hut = function (x, y, s, o = {}) {
    return g(rect(-70, -90, 140, 90, pat('stripes', o.wall || C.sand, C.tan, 1.2), ol(C.tan)) + path('M-22,0 V-56 Q0,-76 22,-56 V0 Z', C.umber) + path('M-104,-84 C-70,-120 -30,-170 0,-196 C30,-170 70,-120 104,-84 Q0,-70 -104,-84 Z', pat('thatch', o.roof || C.ochre, C.brown), ol(C.brown)) + line('M0,-196 l-8,-18 M0,-196 l8,-18 M0,-196 v-22', C.brown, 3) + line('M-70,-44 H-22 M22,-44 H70', C.brown, 2.5), R.tf(x, y, s));
  };
  R.altar = function (x, y, s, seed = 5, fire = true) { return g(rect(-70, -34, 140, 34, pat('brick', C.clay, C.cream, 0.8), ol(C.clay)) + rect(-52, -52, 104, 20, pat('brick', C.vermilion, C.cream, 0.8), ol(C.clay)) + (fire ? R.flame(0, -48, 0.8, seed) : ''), R.tf(x, y, s)); };
  R.throne = function (x, y, s, o = {}) {
    const gd = C.gold, c = o.col || C.crimson;
    return g(path(R.archD(-92, -70, 184, 270, 7), gd, ol(gd)) + path(R.archD(-72, -70, 144, 236, 7), pat('flower', c, gd, 0.9)) + circ(0, -356, 16, gd, ol(gd)) + path('M0,-400 L10,-372 L-10,-372 Z', gd) + rect(-120, -80, 240, 34, gd, ol(gd)) + rect(-108, -112, 216, 36, pat('diag', c, R.dark(c, 0.2)), ol(c)) + rect(-132, -48, 264, 48, pat('zig', C.amber, gd, 1.4), ol(C.amber)) + path('M-132,-48 q-26,10 -22,48 h22 Z M132,-48 q26,10 22,48 h-22 Z', gd, ol(gd)) + circ(-120, -96, 17, gd, ol(gd)) + circ(120, -96, 17, gd, ol(gd)) + circ(-120, -96, 6, C.red) + circ(120, -96, 6, C.red), R.tf(x, y, s));
  };
  R.steps = function (x, y, w, cnt, col = C.cream, col2 = C.red) { let s = ''; for (let i = 0; i < cnt; i++) s += rect(x - w / 2 - i * 26, y + i * 22, w + i * 52, 23, i % 2 ? R.dark(col, 0.08) : col, ol(col)) + line(`M${x - w / 2 - i * 26},${y + i * 22 + 3} h${w + i * 52}`, col2, 2.5, { 'stroke-dasharray': '2 9' }); return s; };
  R.carpet = function (x, y, w, h, col = C.red, col2 = C.gold, taper = 0.72) { return path(`M${x - (w / 2) * taper},${y} L${x + (w / 2) * taper},${y} L${x + w / 2},${y + h} L${x - w / 2},${y + h} Z`, pat('flower', col, R.dark(col, 0.2), 1.3)) + line(`M${x - (w / 2) * taper},${y} L${x - w / 2},${y + h} M${x + (w / 2) * taper},${y} L${x + w / 2},${y + h}`, col2, 7, { 'stroke-dasharray': '2 14' }); };
  R.drape = function (x0, x1, y, col = C.red, col2 = C.gold, swags = 4, drop = 70) { let s = ''; const w = (x1 - x0) / swags; for (let i = 0; i < swags; i++) { const a = x0 + i * w; s += path(`M${n(a)},${y} Q${n(a + w / 2)},${y + drop * 2} ${n(a + w)},${y} Z`, i % 2 ? R.dark(col, 0.12) : col) + line(`M${n(a)},${y} Q${n(a + w / 2)},${y + drop * 2} ${n(a + w)},${y}`, col2, 4) + line(`M${n(a)},${y} Q${n(a + w / 2)},${y + drop * 1.3} ${n(a + w)},${y}`, col2, 2, { 'stroke-dasharray': '2 8' }); } for (let i = 0; i <= swags; i++) s += path(`M${n(x0 + i * w - 12)},${y} h24 l-6,${drop * 1.2} q-6,10 -12,0 Z`, col2) + circ(x0 + i * w, y + drop * 1.3 + 8, 7, col); return s; };
  R.lampHang = function (x, y, len, s = 1) { return line(`M${x},${y} v${len}`, C.gold, 2.5) + g(path('M-14,0 Q-18,26 0,32 Q18,26 14,0 Z', C.gold, ol(C.gold)) + R.flame(0, 2, 0.14, 3) + circ(0, 36, 4, C.red), R.tf(x, y + len, s)); };
  R.torch = function (x, y, s = 1, flip = 1) { return g(line('M0,0 V-170', C.forest, 7) + line('M0,0 V-170', C.green, 4) + R.paisley(4, -226, 1, C.vermilion, C.red, C.navy, 0, C.gold) + circ(0, -172, 8, C.gold), R.tf(x, y, s, 0, flip)); };
  R.diya = function (x, y, s = 1) { return g(path('M-16,0 Q0,16 16,0 L22,-4 L14,-2 Z', C.clay, ol(C.clay)) + path('M0,-2 C-8,-12 -2,-22 2,-30 C6,-20 10,-12 0,-2 Z', C.gold) + path('M1,-4 C-3,-10 0,-15 2,-19 C4,-14 6,-10 1,-4 Z', C.white), R.tf(x, y, s)); };
  R.flagpole = function (x, y, h, col = C.red, s = 1) { return g(R.item('flag', { col }), R.tf(x, y - h * 0 - 60 * s, s)); };
  R.bed = function (x, y, s, col = C.crimson) { return g(rect(-190, -70, 380, 26, C.gold, ol(C.gold)) + rect(-180, -96, 360, 30, pat('flower', col, C.gold, 0.9), ol(col)) + path('M-190,-70 v-70 q14,-14 28,0 v44 Z', C.gold, ol(C.gold)) + rect(-182, -44, 16, 44, C.gold) + rect(166, -44, 16, 44, C.gold) + ell(-138, -104, 36, 16, C.cream, ol(C.bone)), R.tf(x, y, s)); };
  R.gate = function (x, y, s, o = {}) { const c = o.col || C.amber; return g(rect(-200, -330, 110, 330, pat('brick', c, C.gold, 1.2), ol(c)) + rect(90, -330, 110, 330, pat('brick', c, C.gold, 1.2), ol(c)) + rect(-90, -300, 180, 80, pat('brick', c, C.gold, 1.2), ol(c)) + path(R.archD(-90, 0, 180, 250, 7), o.dark || C.maroon) + path(R.archD(-90, 0, 180, 250, 7), 'none', { stroke: C.red, 'stroke-width': 10 }) + R.dome(-145, -330, 0.9) + R.dome(145, -330, 0.9) + R.dome(0, -300, 0.6), R.tf(x, y, s)); };
  // tessellated stone causeway along a polyline (the bridge to Lanka), with a dark underside
  R.causeway = function (pts, w, o = {}) { const d = R.smooth(pts); return line(d, o.under || C.navy, w + 26, { 'stroke-linecap': 'butt', transform: 'translate(0,14)' }) + line(d, pat('stone', o.col || C.sand, o.crack || C.cream, o.k || 1), w, { 'stroke-linecap': 'butt' }) + line(d, o.edge || C.bone, w, { 'stroke-linecap': 'butt', 'stroke-dasharray': '0', fill: 'none', opacity: 0 }); };
  // the great silhouette of a god filling the sky (after the darshan painting)
  R.colossus = function (x, y, s, o = {}) {
    const c = o.col || C.mustard, c2 = o.col2 || C.amber;
    let t = '';
    [-1, 1].forEach((sd) => { // arms flung wide, palms open to the sky
      t += line(`M${sd * 150},-70 Q${sd * 420},-40 ${sd * 610},-300`, c2, 92, { 'stroke-linecap': 'round' });
      for (let i = 0; i < 5; i++) t += g(line('M0,0 Q4,-50 0,-96', c2, 27), `translate(${sd * 612},-316) rotate(${sd * (-34 + i * 21)}) scale(${i === 4 ? 0.8 : 1})`);
      t += line(`M${sd * 590},-262 q${sd * 22},-18 ${sd * 44},-12`, c, 5);
    });
    t += path('M-250,460 C-270,200 -250,-10 -170,-96 C-110,-140 110,-140 170,-96 C250,-10 270,200 250,460 Z', c);
    t += path('M-104,-150 C-140,-300 -90,-420 0,-430 C90,-420 140,-300 104,-150 C60,-110 -60,-110 -104,-150 Z', c);
    t += path('M-96,-380 L-110,-470 L-60,-430 L-30,-500 L0,-436 L30,-500 L60,-430 L110,-470 L96,-380 Q0,-420 -96,-380 Z', c2);
    if (o.eyes !== false) [-1, 1].forEach((sd) => (t += g(path('M-40,0 Q0,-30 44,-4 Q0,20 -40,0 Z', C.white) + R.ring(2, -4, 13, c2, 3) + circ(2, -4, 5, c2) + line('M-46,2 Q0,-36 52,-6', c2, 4) + line('M-44,-22 Q4,-48 54,-26', c2, 4), `translate(${sd * 50},-300) scale(${sd},1)`)));
    t += line('M-4,-290 L-10,-236 Q0,-226 14,-234', c2, 4) + path('M-26,-200 Q0,-186 26,-200 Q0,-176 -26,-200 Z', c2) + line('M-110,-96 Q0,-10 110,-96 M-90,-100 Q0,40 90,-100', c2, 7);
    return g(t, R.tf(x, y, s));
  };
  R.arrows = function (seed, x0, y0, x1, y1, cnt, o = {}) { const f = R.rng(seed); let s = ''; for (let i = 0; i < cnt; i++) { const t = f(), sp = o.spread || 120, ax = x0 + (x1 - x0) * t + f.r(-sp, sp) * 0.3, ay = y0 + (y1 - y0) * t + f.r(-sp, sp), ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI + f.r(-(o.jit || 6), o.jit || 6); s += g(R.item('arrow', { len: o.len || 90, tip: o.tip, fl: o.fl }), `translate(${n(ax)},${n(ay)}) rotate(${n(ang + 90)}) scale(${o.s || 0.7})`); } return s; };
  // decorative painted border around the whole sheet
  R.border = function (col = C.red, col2 = C.gold, w = 26) { return rect(w / 2, w / 2, W - w, H - w, 'none', { stroke: col, 'stroke-width': w }) + rect(w + 5, w + 5, W - 2 * w - 10, H - 2 * w - 10, 'none', { stroke: col2, 'stroke-width': 4 }) + rect(w / 2, w / 2, W - w, H - w, 'none', { stroke: col2, 'stroke-width': 3.5, 'stroke-dasharray': '2 13', 'stroke-linecap': 'round' }); };
  R.petals = function (seed, box, cnt, cols) { const f = R.rng(seed); let s = ''; for (let i = 0; i < cnt; i++) s += g(R.item('flower', { col: f.pick(cols || [C.white, C.pink, C.gold, C.vermilion]) }), `translate(${n(f.r(box[0], box[2]))},${n(f.r(box[1], box[3]))}) rotate(${n(f.r(0, 90))}) scale(${n(f.r(0.5, 1.1))})`); return s; };
})();
