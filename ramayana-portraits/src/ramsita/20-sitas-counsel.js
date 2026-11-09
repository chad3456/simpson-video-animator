// Aranya Kanda (sarga 9) — by a lotus pool Sita gently counsels Rama not to take up arms without cause: "Weapons kindle
// the urge to strike. Be compassionate, and let your dharma be the dharma of the forest." Rama answers that he is bound by
// his promise to protect the sages.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['20-sitas-counsel'] = {
    title: "Sita's Counsel by the Lotus Pool", W: 1800, H: 1200, seed: 5120, layers: RP.eventLayers,
    accents: ['#ff8ac0', '#ffffff', '#3ad0a0', '#ffd23a', '#5a7aff'],
    flow: (x, y, n) => (y > 800 ? 0.0 : 0.6) + n(x * 0.002, y * 0.002) * 1.3, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#ffc8a0', '#ffe8c0', '#c8f0d0', '#5ab0a0', '#1a5a6a']));
      for (const [x, h] of [[100, 800], [1700, 900]]) K.tree(x, 820, h, { leaves: ['#a0ffb0', '#3ad07a', '#0a8a5a', '#0a4a3a'], flowers: ['#ff8ac0'], n: 7 });
      const pool = K.ell(900, 1020, 1000, 230); K.fill(pool, K.lin(0, 800, 0, 1250, ['#c8f4ff', '#5ad0ff', '#2a7ad0'])); K.flow(pool, 0.0);
      K.overlay((pen) => { for (let k = 0; k < 22; k++) { const x = K.R(100, 1700), y = K.R(900, 1180), r = K.R(26, 44); pen.fill(K.ell(x, y, r * 1.4, r * 0.45), '#2aa05a'); for (let j = 0; j < 5; j++) pen.line([[x, y - 4], [x + (j - 2) * r * 0.25, y - r * 0.9]], { w: r * 0.35, color: j % 2 ? '#ff8ac0' : '#ffffff', taper: 1 }); } });
      // seated on a rock at the pool's edge
      K.fill(K.path([[500, 1000], [560, 820], [1250, 800], [1320, 1000]]), K.split(500, 0, 1320, 0, ['#e8d8c8', '#a89a9a', '#5a4a6a', '#2a1a3a']));
      K.rama({ x: 1050, y: 830, h: 720, turn: -0.3, look: 'forest', pose: { legs: 'sit', armL: [0.4, 0.5], armR: K.poses.rest }, face: { mouth: 'calm', gaze: [-0.8, 0.1] } });
      K.bowAt([1250, 620], 460, -1.4, { w: 12 });
      K.sita({ x: 760, y: 830, h: 680, turn: 0.35, look: 'forest', pose: { legs: 'sit', armL: K.poses.lap, armR: [1.0, -0.4] }, face: { eyes: 'open', mouth: 'calm', gaze: [0.8, 0] } });
      K.petals(60, [0, 0, W, 800], ['#ff8ac0', '#ffffff']);
    },
  };
})();
