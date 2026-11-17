// III. CHILDREN OF DUNE — "The Golden Path."
// Leto II takes the sandtrout onto his skin and begins to become something no longer human, so that humankind may
// survive. He stands on the last high dune and sees the road: a thin line of gold running out across the sand into
// thousands of years. Behind him rain clouds and green spread over Arrakis; ahead, the desert and the last worm.
// The painting is about sacrifice and time: one being gives up his humanity so that the many may have a future.
(function () {
  D.scenes = D.scenes || {};
  D.scenes['3-children-of-dune'] = {
    title: 'Children of Dune — The Golden Path', W: 2400, H: 1350, seed: 1976,
    draw(K) {
      const { W, H } = K;
      // dawn: teal and jade above, a band of gold at the far horizon
      K.bg(K.lin(0, 0, 0, 860, ['#06202a', '#0e4a50', '#3a8a7a', '#c8c88a', '#ffd890']));
      K.stars(220, [0, 0, W, 360], ['#ffffff', '#d8fff0']);
      K.glow(1700, 830, 1000, '#ffd080', 0.45);
      K.glow(1700, 830, 300, '#fff6d8', 0.8);
      // rain clouds over the greening west, with veils of rain
      // a bank of rain cloud: one bumpy mass, lit on top, with a darker belly
      { const pts = []; for (let k = 0; k <= 24; k++) { const t = k / 24, x = -120 + 1150 * t; pts.push([x, 470 - 120 * Math.sin(t * Math.PI) - 60 * Math.abs(Math.sin(t * 11)) - 30 * K.noise(t * 6, 2)]); }
        pts.push([1030, 560], [700, 600], [300, 590], [-120, 580]);
        const cl = K.path(pts, true);
        K.blur(() => K.fill(cl, K.lin(0, 300, 0, 600, ['#9ab8b0', '#4a6a72', '#22384a', '#1a2a3a'])), 5);
        K.brush(cl, { n: 400, angle: () => K.R(-0.4, 0.4), len: [30, 120], w: [3, 10], colors: ['#b8d0c0', '#5a7a82', '#22384a'], alpha: [0.05, 0.18] });
        K.blur(() => K.stroke(pts.slice(0, 25), 10, '#e8f0d0', 0.35, 0.6), 4);
        K.blur(() => { for (let i = 0; i < 7; i++) { const x = K.R(60, 900); K.fill(K.poly([[x, 580], [x + 120, 580], [x + 40, 880], [x - 80, 880]]), K.lin(0, 580, 0, 880, [D.rgba('#5a7a8a', 0.45), D.rgba('#5a7a8a', 0)])); } }, 14); }

      // far land: green on the left, sand on the right
      K.duneField({ y: 880, n: 12, w: [120, 260], h: [10, 40], lightDir: -1, colors: ['#9ab88a', '#c8b88a', '#e8b880'], shadow: '#5a6a5a', shadowAlpha: 0.35, crest: '#fff0c0', crestAlpha: 0.4, strokes: 80, gradH: 120 });
      K.fill(K.poly([[0, 850], [1100, 850], [900, 990], [0, 990]]), K.lin(0, 0, 1100, 0, [D.rgba('#2a8a4a', 0.85), D.rgba('#5aa060', 0.5), D.rgba('#3a8a5a', 0)]));
      for (let i = 0; i < 160; i++) { const x = K.R(0, 900), y = K.R(860, 980); K.stroke([[x, y], [x + K.R(-3, 3), y - K.R(4, 14)]], 2, K.pick(['#2a6a3a', '#5ab06a', '#1a4a2a']), 0.7, 0.6); }
      K.blur(() => K.fill(K.poly([[0, 800], [W, 800], [W, 930], [0, 930]]), K.lin(0, 800, 0, 930, [D.rgba('#fff0c0', 0), D.rgba('#fff0c0', 0.5), D.rgba('#fff0c0', 0)])), 20);
      // the last worm, diving far away
      // the back of the last worm, arching out of the sand far away
      { const arc = []; for (let k = 0; k <= 20; k++) { const t = k / 20; arc.push([1960 + 300 * t, 908 - 42 * Math.sin(t * Math.PI)]); } K.stroke(arc, 40, '#6a3a2a', 1, 0.2); for (let k = 0; k < 12; k++) K.stroke([[1700 + k * 20, 912], [1700 + k * 20 + 40, 912]], 2, '#f0d0a8', 0.4, 0.5); K.stroke(arc.map(([x, y]) => [x, y - 9]), 10, '#e8b888', 0.8, 0.5); K.blur(() => { K.fill(K.ell(1960, 905, 70, 16), D.rgba('#f0d0a8', 0.8)); K.fill(K.ell(2220, 905, 70, 16), D.rgba('#f0d0a8', 0.8)); }, 6); }
      // middle dunes
      const mid = K.duneField({ y: 1010, n: 6, w: [260, 520], h: [40, 110], lightDir: -1, colors: ['#e8a868', '#b8703e', '#5a2a1e'], shadow: '#2a1018', shadowAlpha: 0.6, crest: '#fff0c0', crestAlpha: 0.6, strokes: 180, ripples: 40, gradH: 300 });
      // the high dune he stands on, in the foreground left
      const f = K.duneField({ y: 1350, humps: [[620, 760, 420], [1700, 600, 120]], lightDir: -1, colors: ['#8a4a2a', '#4a1e16', '#14060a'], shadow: '#0a0206', shadowAlpha: 0.7, crest: '#ffe0a0', crestW: 4, strokes: 300, ripples: 80, gradH: 380 });
      const fx = 640, fy = f.Y(fx);
      // the Golden Path: a thin line of light running out across the dunes to the sunrise
      const gpPath = K.path([[fx + 20, fy + 4], [860, fy + 140], [1060, 1230], [1320, 1180], [1420, 1080], [1560, 990], [1640, 920], [1700, 868]], false); const gp = []; { const cps = [[fx + 20, fy + 4], [860, fy + 140], [1060, 1230], [1320, 1180], [1420, 1080], [1560, 990], [1640, 920], [1700, 868]]; for (let i = 0; i < cps.length - 1; i++) for (let k = 0; k < 10; k++) { const t = k / 10, p0 = cps[Math.max(0, i - 1)], p1 = cps[i], p2 = cps[i + 1], p3 = cps[Math.min(cps.length - 1, i + 2)]; const cr = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t); gp.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])]); } gp.push(cps[cps.length - 1]); }
      K.blur(() => K.stroke(gp, 40, '#ffc040', 0.55, 0.9), 14);
      K.stroke(gp, 9, '#fff0b0', 0.95, 0.9);
      for (let k = 0; k < 40; k++) { const p = gp[(K.rand() * gp.length) | 0]; K.glow(p[0] + K.R(-6, 6), p[1], K.R(6, 18), '#ffe080', 0.6); }
      // Leto: the sandtrout skin is a dark membrane with a cold sheen
      const P = K.figure(fx, fy + 2, 170, { ink: '#0a0a12', rim: '#ffe8a0', rimSide: 1, hood: false, wind: -0.5, eyes: '#5ac8ff' });
      for (let k = 0; k < 40; k++) { const u = K.R(-0.09, 0.09), v = K.R(0.05, 0.85); const q = P(u, v); K.fill(K.ell(q[0], q[1], K.R(2, 5), K.R(1, 3)), K.pick(['#6a7a9a', '#3a4a6a', '#a0b0d0']), K.R(0.4, 0.8)); }
      K.glow(...P(0, 0.5), 120, '#5ac8ff', 0.18);
      K.sand(200, [0, 900, W, H], ['#ffe8c0', '#ffd090', '#c88a5a'], -0.05);
      K.finish({ bloom: 44, bloomAlpha: 0.32, vignette: '#04080a', vignetteAlpha: 0.55, grain: 16 });
    },
  };
})();
