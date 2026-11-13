/* Ramayana paintings: ready-made stages (forest, court, shore...) and a few late additions to the kit. */
(function () {
  const R = window.R, C = R.C, n = R.n, W = R.W, H = R.H;
  const { path, line, circ, ell, g, rect, pat } = R;
  const ol = (c, w = 1.4) => ({ stroke: R.dark(c, 0.4), 'stroke-width': w, 'stroke-linejoin': 'round' });
  R.S = {
    // woodland: sky, far hills, a grove, ground and framing leaves
    forest(P, o = {}) {
      const sd = o.seed || 7, gy = o.gy || 720;
      R.sky(P, Object.assign({ time: 'day', seed: sd }, o.sky || {}, o.time ? { time: o.time } : {}));
      if (o.hills !== false) P.sky(R.hills(sd + 1, gy - 30, o.nh || 5, o.hcols || [C.teal, C.forest, C.moss], o.hill || {}));
      if (o.far !== 0) P.bg(R.grove(sd + 2, -60, W + 60, gy - 6, o.far || 9, { kinds: o.kinds, cols: o.cols, s0: o.s0 || 0.95, s1: o.s1 || 1.5, fl: o.fl, fcols: o.fcols }));
      P.bg(R.ground(gy, o.gcol || C.olive, { seed: sd, flowers: o.flowers || 0, c2: o.g2, c3: o.g3, tufts: o.tufts, amp: o.amp }));
      if (o.fronds !== false) P.fg(R.fronds(sd + 3, 'L', { n: o.nf || 5, cols: o.fcol }) + R.fronds(sd + 4, 'R', { n: o.nf || 5, cols: o.fcol }));
      return P;
    },
    // palace interior: a patterned wall pierced by cusped arches, frieze above, floor and carpet below
    court(P, o = {}) {
      const fy = o.fy || 720, top = o.top != null ? o.top : 100;
      R.sky(P, Object.assign({ time: o.inner || 'rose', seed: o.seed || 2, bands: 3, motes: 0 }, o.sky || {}));
      P.bg(R.arcade(-80, W + 80, top, fy, o.arches || [[800, 560, 540, 9], [250, 300, 420, 7], [1350, 300, 420, 7]], { fill: pat(o.wpat || 'flower', o.wall || C.navy, o.wall2 || R.light(o.wall || C.navy, 0.14), 1.3), border: o.border || C.red, trim: o.trim, bw: o.bw || 18 }));
      if (o.frieze !== false) P.bg(R.frieze(0, top + 4, o.fcol || C.mustard, o.fcol2 || C.pink, { edge: o.border || C.red }));
      P.bg(R.ground(fy - 4, o.floor || C.mustard, { stripes: 2, tufts: 0, amp: 3, c2: o.floor2 || R.dark(o.floor || C.mustard, 0.1), c3: o.floor3 || R.light(o.floor || C.mustard, 0.3) }));
      if (o.carpet !== false) P.bg(R.carpet(o.cx || 800, fy, o.cw || 760, H - fy + 20, o.carpet || C.red, C.gold));
      (o.lamps || []).forEach((x) => P.bg(R.lampHang(x, top, o.lampLen || 90, 1.3)));
      return P;
    },
    // open water to the horizon
    sea(P, o = {}) {
      const hy = o.hy || 470;
      R.sky(P, Object.assign({ time: 'day', seed: o.seed || 5, h: hy }, o.sky || {}, o.time ? { time: o.time } : {}));
      R.water(P, 'bg', hy, H, Object.assign({ seed: o.seed || 5, bands: 9, curls: 20, ticks: 50 }, o.water || {}));
      return P;
    },
    // battlefield before Lanka
    field(P, o = {}) {
      const gy = o.gy || 700;
      R.sky(P, Object.assign({ time: 'dusk', seed: o.seed || 9 }, o.sky || {}, o.time ? { time: o.time } : {}));
      if (o.lanka !== false) P.sky(R.lanka(o.lx || 1250, gy + 10, o.ls || 0.8, { lamps: 1 }));
      P.bg(R.ground(gy, o.gcol || C.clay, { seed: o.seed || 9, stripes: 4, tufts: 10, c2: o.g2 || C.brown, c3: o.g3 || C.ochre }));
      return P;
    },
  };
  // humped bull
  R.bull = function (x, y, s, o = {}) {
    const c = o.col || C.white, dk = R.dark(c, 0.3); let t = '';
    const leg = (x0, far) => rect(x0 - 7, -64, 14, 64, far ? R.dark(c, 0.14) : c, ol(c)) + rect(x0 - 8, -8, 16, 8, C.ink);
    t += line('M-78,-98 Q-104,-70 -98,-28', c, 6) + circ(-98, -24, 7, C.ink) + leg(-50, 1) + leg(40, 1);
    t += path('M-80,-104 C-60,-124 -10,-118 10,-116 C16,-146 44,-150 56,-122 C74,-116 76,-80 62,-64 C20,-52 -40,-52 -70,-62 C-88,-72 -90,-92 -80,-104 Z', c, ol(c));
    t += leg(-62) + leg(52);
    t += path('M52,-118 C70,-134 100,-132 112,-112 C122,-96 118,-76 104,-72 C92,-70 84,-80 74,-84 C62,-90 54,-102 52,-118 Z', c, ol(c)) + path('M70,-130 C62,-152 76,-166 92,-166 C82,-156 82,-142 86,-132 Z', C.gold, ol(C.amber)) + g(path('M-12,0 Q0,-11 13,-1 Q0,6 -12,0 Z', C.white) + circ(1, -1.5, 4.2, C.ink) + line('M-14,1 Q0,-13 15,-2', C.ink, 2.4), 'translate(92,-110) scale(.62)') + circ(112, -86, 2.2, C.ink) + path('M60,-126 q-14,6 -16,22 q10,-6 20,-10 Z', dk);
    t += path('M-40,-112 Q0,-122 30,-112 L26,-74 Q0,-66 -38,-74 Z', pat('flower', o.cloth || C.red, C.gold, 0.8), ol(o.cloth || C.red)) + line('M64,-82 Q72,-60 62,-52', C.gold, 3) + circ(62, -50, 5, C.gold);
    return g(t, R.tf(x, y, s, 0, o.flip || 1));
  };
  // Sudarshana, the discus
  R.chakra = (x, y, r) => R.wheel(x, y, r, C.gold, C.red) + Array.from({ length: 12 }, (_, i) => g(path('M-5,0 L0,-12 L5,0 Z', C.gold), `translate(${n(x + Math.cos(i * 0.5236) * r * 1.08)},${n(y + Math.sin(i * 0.5236) * r * 1.08)}) rotate(${i * 30 + 90})`)).join('');
  // a baby wrapped for the lap
  R.baby = (x, y, s, skin, wrap = C.cream) => g(ell(0, -14, 26, 15, wrap, ol(wrap)) + circ(22, -26, 14, skin, ol(skin)) + path('M10,-34 Q22,-44 34,-34 Q22,-38 10,-34 Z', C.black) + line('M17,-26 q4,-3 8,0', C.ink, 1.6) + line('M22,-20 q3,2 6,0', C.crimson, 1.4) + path('M19.5,-37 l2.5,5 l2.5,-5 Z', C.red), R.tf(x, y, s));
})();
