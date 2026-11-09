// 08 — Halahala: the gods and asuras churn the ocean of milk with Mount Mandara as the rod and Vasuki as the rope. The
// first thing to rise is a black poison that begins to burn the worlds. Shiva gathers it in his palm and drinks it;
// Parvati presses his throat so it stays there, and he becomes Neelakantha.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['08-he-drinks-the-poison'] = {
    title: 'He Drinks the Poison', W: 1800, H: 1200, seed: 6108, layers: RP.eventLayers,
    accents: ['#3a5aff', '#8a3aff', '#3affd0', '#ffffff', '#ffd23a'],
    flow: (x, y, n) => (y > 860 ? 0.0 : 0.8) + n(x * 0.002, y * 0.002) * 1.5, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#0a0420', '#2a0a4a', '#4a2a8a', '#8a8ad0', '#e8f0ff']));
      // the ocean of milk
      K.fill(K.poly([[0, 860], [W, 860], [W, H], [0, H]]), K.lin(0, 860, 0, H, ['#ffffff', '#e8f0ff', '#a0b0e0', '#5a6ab0']));
      K.waves(860, 1200, { n: 90 });
      // Mandara with Vasuki wound about it, the churners small on either side
      K.mountain([[380, 900], [450, 560], [520, 420], [600, 400], [660, 560], [720, 900]], ['#c8a08a', '#8a6a5a', '#4a3a3a', '#1a1018'], 0.5);
      K.overlay((pen) => {
        for (let k = 0; k < 5; k++) pen.line([[420, 860 - k * 90], [550, 820 - k * 90], [690, 860 - k * 90]], { w: 18, color: '#2a8a6a', taper: 0 });
        pen.line([[420, 860], [200, 900], [40, 880]], { w: 18, color: '#2a8a6a', taper: 0 });
        pen.line([[690, 860], [880, 890], [1000, 880]], { w: 18, color: '#2a8a6a', taper: 0.6 });
      });
      for (let k = 0; k < 5; k++) K.figure({ x: 90 + k * 60, y: 905, h: 130, turn: 0.4, skin: ['#ffe0b0', '#f0a870', '#b0605a', '#4a1a3a'], head: 'crown', cloth: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'], pose: { legs: 'stride', armL: [1.3, 0.1], armR: [1.4, 0.1] } });
      for (let k = 0; k < 4; k++) K.figure({ x: 800 + k * 60, y: 905, h: 140, turn: -0.4, skin: ['#8a7ab0', '#5a4a8a', '#2a1a4a', '#0a0414'], head: 'jata', cloth: ['#e0402a', '#a01a2a', '#5a0a2a', '#1a0410'], pose: { legs: 'stride', armL: [1.4, 0.1], armR: [1.3, 0.1] } });
      // the poison cloud swirling up from the waters into his hand
      K.fill(K.path([[500, 860], [700, 700], [900, 520], [1100, 420], [1200, 520], [1000, 640], [800, 820], [640, 900]]), K.lin(500, 900, 1200, 400, ['#1a0a2a', '#3a0a5a', '#0a1a4a', '#000000']));
      K.overlay((pen) => { for (let k = 0; k < 30; k++) { const t = K.rand(); const x = 520 + t * 650, y = 880 - t * 450; pen.line([[x, y], [x + K.R(-60, 60), y + K.R(-60, 20)], [x + K.R(-80, 80), y - K.R(20, 90)]], { w: K.R(8, 18), color: K.pick(['#2a0a4a', '#4a1a8a', '#0a2a3a']), alpha: 0.8, taper: 1 }); } });
      K.blob(1380, 560, 420, '#c8e0ff', 0.45);
      K.parvati({ x: 1600, y: 1080, h: 760, turn: -0.35, pose: { legs: 'stand', armL: [1.2, -1.4], armR: K.poses.chest }, face: { eyes: 'soft', mouth: 'calm', gaze: [-0.8, -0.2] } });
      const r = K.shiva({ x: 1330, y: 1100, h: 900, turn: -0.2, neelkantha: true, pose: { armL: [1.0, -2.6], armR: [0.5, -0.4] }, face: { eyes: 'closed', gaze: [-0.2, -0.3] }, head2: { thirdEye: 'closed' } });
      K.blob(...r.T(0, -0.86), 60, '#3a6aff', 0.9);
      K.overlay((pen) => { const [x, y] = r.handL; pen.fill(K.ell(x, y - 14, 34, 18), '#1a0a3a'); pen.dab(x, y - 18, 12, '#5a2aff'); });
      K.trishul(1150, 1150, 800, -0.1, { glow: '#c8f0ff' });
    },
  };
})();
