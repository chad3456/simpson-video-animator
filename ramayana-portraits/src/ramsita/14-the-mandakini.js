// Ayodhya Kanda (sarga 89) — Rama takes Sita to the Mandakini: "Look at this lovely river, its sandbanks white as swans,
// its waters full of lotuses. Bathe here with me, and think of Chitrakuta as Ayodhya, and the river as the Sarayu."
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['14-the-mandakini'] = {
    title: 'By the Mandakini River', W: 1200, H: 1800, seed: 5114, layers: RP.eventLayers,
    accents: ['#ff8ac0', '#ffffff', '#3ad0ff', '#ffd23a', '#3ad0a0'],
    flow: (x, y, n) => (y > 900 ? 0.0 : 1.2) + n(x * 0.002, y * 0.002) * 1.2, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#bff0ff', '#e8fff0', '#8ae0c0', '#3ab0d0', '#1a5aa0']));
      for (const [x, h] of [[80, 1000], [1130, 1100]]) K.tree(x, 900, h, { leaves: ['#a0ffb0', '#3ad07a', '#0a8a5a', '#0a4a3a'], flowers: ['#ffffff', '#ff8ac0'], n: 8 });
      K.fill(K.poly([[0, 880], [W, 860], [W, H], [0, H]]), K.lin(0, 860, 0, H, ['#c8f4ff', '#5ad0ff', '#2a8ad0', '#0a3a8a']));
      K.flow(K.poly([[0, 880], [W, 860], [W, H], [0, H]]), 0.0);
      // lotuses on the water
      K.overlay((pen) => { for (let k = 0; k < 18; k++) { const x = K.R(40, 1160), y = K.R(1450, 1780), r = K.R(30, 50); pen.fill(K.ell(x, y, r * 1.4, r * 0.45), '#2aa05a'); for (let j = 0; j < 5; j++) pen.line([[x, y - 4], [x + (j - 2) * r * 0.25, y - r * 0.9]], { w: r * 0.35, color: j % 2 ? '#ff8ac0' : '#ffffff', taper: 1 }); } });
      // waist-deep in the river: Rama offers Sita a lotus
      const r = K.rama({ x: 380, y: 1700, h: 1400, turn: 0.35, look: 'forest', pose: { legs: 'hidden', armL: K.poses.rest, armR: [1.1, 0.4] } });
      const s = K.sita({ x: 820, y: 1720, h: 1300, turn: -0.3, look: 'forest', pose: { legs: 'hidden', armL: [0.9, 0.5], armR: K.poses.chest }, face: { eyes: 'soft', mouth: 'smile' } });
      K.overlay((pen) => { const [x, y] = r.handR; for (let j = 0; j < 7; j++) pen.line([[x, y], [x + (j - 3) * 12, y - 70]], { w: 22, color: j % 2 ? '#ff8ac0' : '#ffffff', taper: 1 }); pen.line([[x, y], [x - 10, y + 120]], { w: 6, color: '#2aa05a' }); });
      K.fill(K.poly([[0, 1520], [W, 1500], [W, H], [0, H]]), 'rgba(90,200,255,0.55)');
      K.waves(1500, 1800, { n: 120 });
    },
  };
})();
