// I. DUNE — "The sleeper must awaken."
// Dawn on Arrakis. A shai-hulud breaks the surface, vast as a cathedral, and a single figure on the crest stands
// his ground. "I must not fear. Fear is the mind-killer." The painting is about scale: a man facing what is far
// larger than himself, and choosing not to run.
(function () {
  D.scenes = D.scenes || {};
  D.scenes['1-dune'] = {
    title: 'Dune — The Sleeper Must Awaken', W: 2400, H: 1350, seed: 1965,
    draw(K) {
      const { W, H, ctx } = K;
      // sky: apricot dawn into dusty violet, a cool band at the zenith
      K.bg(K.lin(0, 0, 0, H * 0.7, ['#2a3a5a', '#7a6a8a', '#e8a88a', '#ffd8a8', '#ffe8c8']));
      K.glow(560, 760, 900, '#ffb070', 0.55);
      K.glow(560, 760, 260, '#fff4e0', 0.9);
      K.fill(K.ell(560, 760, 120, 120), '#fff8ec');
      // the two moons
      K.fill(K.ell(1880, 230, 70, 70), K.rad(1860, 210, 5, 70, ['#fff0e0', '#e8c8c0', '#b09aa8']), 0.95);
      K.fill(K.ell(1900, 236, 58, 58), D.rgba('#7a6a8a', 0.55));
      K.fill(K.ell(2050, 330, 28, 28), K.rad(2045, 325, 2, 28, ['#fff4ec', '#d8c0c0']), 0.9);
      // high thin cloud
      for (let i = 0; i < 9; i++) { const y = K.R(160, 520), x = K.R(-200, W); K.blur(() => K.fill(K.ell(x, y, K.R(300, 700), K.R(6, 20)), D.rgba('#ffe8d8', K.R(0.15, 0.4))), 6); }
      K.rays(560, 760, 22, 2000, '#ffd8a8', 0.07, 0.9, -Math.PI / 2 + 0.2);
      // far dunes dissolving into haze
      K.duneField({ y: 870, n: 9, w: [160, 340], h: [20, 60], colors: ['#f0c0a8', '#e0a898', '#d09890'], shadow: '#a87888', shadowAlpha: 0.5, crest: '#fff0e0', crestAlpha: 0.4, strokes: 80, gradH: 200 });
      K.blur(() => K.fill(K.poly([[0, 780], [W, 780], [W, 940], [0, 940]]), K.lin(0, 780, 0, 940, [D.rgba('#ffe0c8', 0), D.rgba('#ffe0c8', 0.55), D.rgba('#ffe0c8', 0)])), 24);
      K.duneField({ y: 960, n: 7, w: [200, 420], h: [40, 100], colors: ['#e8a888', '#c88070', '#a06068'], shadow: '#7a4058', shadowAlpha: 0.6, crest: '#ffe8d8', crestAlpha: 0.45, strokes: 120, gradH: 300 });
      // the worm, rising from the mid-ground, maw turned toward the light
      const spine = []; for (let k = 0; k <= 20; k++) { const t = k / 20; spine.push([1840 - 260 * t - 60 * Math.sin(t * 3), 1100 - 760 * t]); }
      K.worm(spine, 190, { colors: ['#f6c8a0', '#b8724e', '#5a2a2a', '#1a0a10'], mawRX: 200, mawRY: 130, mawRot: -0.3, throat: '#ffa860', teeth: '#f8e0c8' });
      // sand pouring from the risen body, and a dust bloom at its base
      for (let i = 0; i < 220; i++) { const t = K.R(0.2, 0.85), sp = spine[Math.round(t * 20)], x = sp[0] + K.R(-170, 170), y = sp[1] + K.R(-30, 60); K.stroke([[x, y], [x + K.R(0, 30), y + K.R(80, 300)]], K.R(1, 3.5), K.pick(['#f0c8a0', '#d89a70', '#ffe8c8']), K.R(0.08, 0.35), 0.9); }
      K.blur(() => { for (let i = 0; i < 16; i++) K.fill(K.ell(1830 + K.R(-380, 300), 1060 + K.R(-80, 40), K.R(120, 300), K.R(40, 120)), D.rgba(K.pick(['#e8b090', '#f0c8a8', '#c08a7a']), 0.55)); }, 26);
      // near dunes, warmer and darker
      K.duneField({ y: 1110, n: 5, w: [260, 520], h: [50, 130], colors: ['#d8865e', '#a04e3a', '#5a2026'], shadow: '#3a1424', shadowAlpha: 0.7, crest: '#ffd0a0', strokes: 220, ripples: 60, gradH: 300 });
      // the crest the figure stands on
      const f = K.duneField({ y: 1330, humps: [[560, 900, 340], [1700, 700, 150], [2300, 400, 120]], colors: ['#b85a3a', '#6a2a2a', '#200a14'], shadow: '#14060e', shadowAlpha: 0.8, crest: '#ffc890', crestW: 4, strokes: 300, ripples: 80, gradH: 360 });
      const fy = f.Y(560);
      // the figure's long shadow, thrown away from the sun
      K.fill(K.poly([[562, fy], [580, fy], [980, fy + 140], [955, fy + 150]]), D.rgba('#14060e', 0.45));
      K.figure(570, fy + 2, 130, { ink: '#12060c', rim: '#ffd8a8', rimSide: -1, hood: true, wind: 0.55 });
      // the thumper planted beside him
      K.stroke([[650, f.Y(650) + 4], [654, f.Y(650) - 44]], 5, '#12060c', 1, 0);
      K.sand(260, [0, 860, W, H], ['#ffe8c8', '#f0b890', '#ffd8b0'], -0.04);
      K.finish({ bloom: 40, bloomAlpha: 0.3, vignette: '#14060e', vignetteAlpha: 0.55, grain: 16 });
    },
  };
})();
