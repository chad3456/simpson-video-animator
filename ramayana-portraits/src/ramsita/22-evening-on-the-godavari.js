// Aranya Kanda — the days at Panchavati: at sunset Rama and Sita sit on the sandbank of the Godavari, the river on fire
// with evening light, swans and chakravaka birds drifting home.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['22-evening-on-the-godavari'] = {
    title: 'Evening on the Godavari', W: 1200, H: 1800, seed: 5122, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff6a3a', '#ff8ac0', '#ffffff', '#8a5aff'],
    flow: (x, y, n) => (y > 900 ? 0.0 : 0.3) + n(x * 0.002, y * 0.002) * 1.2, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#3a1a7a', '#a03a9a', '#ff6a5a', '#ffb03a', '#fff0a0']));
      K.blob(600, 760, 150, '#fff6c0', 1); K.blob(600, 760, 360, '#ffd23a', 0.45);
      K.mountain([[0, 820], [200, 700], [450, 780], [750, 660], [1000, 760], [1200, 700], [1200, 860], [0, 860]], ['#a04a8a', '#6a2a7a', '#3a1a5a', '#1a0a3a'], 0.3);
      K.fill(K.poly([[0, 850], [W, 850], [W, 1400], [0, 1400]]), K.lin(0, 850, 0, 1400, ['#ffe08a', '#ff9a4a', '#c04a7a', '#5a2a8a']));
      K.flow(K.poly([[0, 850], [W, 850], [W, 1400], [0, 1400]]), 0.0);
      K.overlay((pen) => { for (let k = 0; k < 30; k++) { const y = K.R(870, 1300), w = K.R(40, 160) * (1 - (y - 850) / 900); pen.line([[600 - w, y], [600 + w, y]], { w: 4, color: '#fff6c0', alpha: 0.8, taper: 1 }); } for (let k = 0; k < 6; k++) { const x = K.R(80, 1100), y = K.R(300, 600); pen.line([[x - 18, y], [x, y + 8], [x + 18, y]], { w: 4, color: '#2a0a3a' }); } });
      // swans
      for (const [x, y] of [[180, 1100], [1000, 1180]]) K.overlay((pen) => { pen.fill(K.ell(x, y, 46, 18), '#ffffff'); pen.line([[x + 30, y - 6], [x + 40, y - 40], [x + 56, y - 46]], { w: 9, color: '#ffffff' }); pen.dab(x + 60, y - 45, 5, '#ff8a1a'); });
      K.fill(K.path([[0, 1800], [0, 1420], [400, 1380], [900, 1400], [1200, 1440], [1200, 1800]]), K.lin(0, 1380, 0, H, ['#fff0c0', '#e0b08a', '#8a5a5a', '#3a1a2a']));
      // seated together on the sand, her head on his shoulder
      K.rama({ x: 420, y: 1720 + 0.44 * 1000, h: 1000, turn: 0.2, look: 'forest', pose: { legs: 'lotus', armL: K.poses.lap, armR: [0.55, -0.6] }, face: { eyes: 'soft', gaze: [0.4, -0.3] } });
      K.sita({ x: 760, y: 1730 + 0.44 * 860, h: 860, turn: -0.1, rot: -0.12, look: 'forest', pose: { legs: 'lotus', armL: K.poses.lap, armR: K.poses.lap }, face: { eyes: 'soft', mouth: 'smile', gaze: [-0.2, -0.4] } });
    },
  };
})();
