// Aranya Kanda — a night at Panchavati: outside the hut, Rama names the stars for Sita, the Seven Sages, Rohini by the
// moon, while the Godavari murmurs below and fireflies drift through the trees.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['26-under-the-stars'] = {
    title: 'Under the Stars', W: 1200, H: 1800, seed: 5126, layers: RP.eventLayers,
    accents: ['#ffffff', '#c8d0ff', '#ffd23a', '#8a5aff', '#3ad0ff'],
    flow: (x, y, n) => 0.2 + n(x * 0.0015, y * 0.0015) * 1.4, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#06061a', '#14145a', '#3a2a8a', '#6a4ab0', '#1a2a3a']));
      K.overlay((pen) => { for (let k = 0; k < 260; k++) pen.dab(K.R(0, W), K.R(0, 1000), K.R(1.5, 4.5), K.pick(['#ffffff', '#fff6c0', '#c8d8ff']), K.R(0.5, 1)); });
      // the Saptarishi (Great Bear)
      const big = [[640, 300], [740, 280], [830, 310], [910, 350], [1000, 330], [1030, 430], [930, 450]];
      K.overlay((pen) => { pen.line(big, { w: 1.5, color: '#c8d0ff', alpha: 0.35, taper: 0 }); big.forEach(([x, y]) => { pen.dab(x, y, 9, '#ffffff'); pen.dab(x, y, 22, '#c8d8ff', 0.3); }); });
      K.moon(220, 260, 70);
      for (let i = 0; i < 5; i++) K.tree(i < 2 ? 40 + i * 180 : 900 + (i - 2) * 140, 1150, K.R(500, 750), { leaves: ['#3a4a8a', '#1a2a5a', '#0a1430', '#04081a'], n: 5 });
      K.hut(1020, 1240, 360, { roof: ['#8a7ab0', '#5a4a8a', '#2a1a5a', '#0a0a2a'] });
      K.blob(1020, 1180, 120, '#ffb02a', 0.6);
      K.fill(K.path([[0, 1800], [0, 1220], [600, 1200], [1200, 1230], [1200, 1800]]), K.lin(0, 1200, 0, H, ['#3a3a7a', '#1a1a4a', '#06061a']));
      K.fill(K.ell(560, 1560, 420, 90), K.lin(0, 1470, 0, 1650, ['#7a7ab0', '#3a3a6a', '#14142a']));
      // seated on the rock: Rama points to the sky, Sita looks up
      K.rama({ x: 440, y: 1520 + 0.44 * 760, h: 760, turn: 0.25, look: 'forest', pose: { legs: 'lotus', armL: K.poses.lap, armR: [2.35, 0.15] }, face: { eyes: 'open', gaze: [0.5, -0.8] } });
      K.sita({ x: 720, y: 1530 + 0.44 * 680, h: 680, turn: -0.15, look: 'forest', pose: { legs: 'lotus', armL: K.poses.lap, armR: K.poses.chest }, face: { eyes: 'open', mouth: 'smile', gaze: [0.2, -0.9] } });
      K.overlay((pen) => { for (let k = 0; k < 60; k++) pen.dab(K.R(0, W), K.R(900, 1700), K.R(3, 6), '#fff6a0', 0.9); });
    },
  };
})();
