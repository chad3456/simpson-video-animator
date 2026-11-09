// 04 — The Yogi of Kailash: Shiva seated in samadhi on a tiger skin at the summit of Kailash, the trishul planted beside
// him, the crescent moon rising and the night sky turning around him like a wheel.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['04-yogi-of-kailash'] = {
    title: 'The Yogi of Kailash', W: 1200, H: 1800, seed: 6104, layers: RP.eventLayers,
    accents: ['#ffffff', '#8ad0ff', '#c08aff', '#3affd0', '#ffd23a'],
    flow: RP.flows.swirl(600, 700), turbulence: 0.4,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(600, 700, 60, 1300, ['#e8f4ff', '#8aa8ff', '#5a3ad0', '#2a0a7a', '#06041a']));
      K.overlay((pen) => { for (let k = 0; k < 200; k++) { const a = K.R(0, 6.28), d = K.R(500, 1100); pen.line([[600 + Math.cos(a) * d, 700 + Math.sin(a) * d], [600 + Math.cos(a + 0.05) * d, 700 + Math.sin(a + 0.05) * d]], { w: 2, color: K.pick(['#ffffff', '#c8d8ff', '#a0ffe0']), alpha: 0.7, taper: 0.5 }); } });
      K.moon(980, 330, 60);
      // the snow peak
      K.mountain([[0, 1800], [0, 1500], [300, 1300], [600, 1180], [900, 1300], [1200, 1480], [1200, 1800]], ['#ffffff', '#c8d8ff', '#7a8ad0', '#2a2a6a'], 0.4);
      K.mountain([[0, 1800], [0, 1650], [400, 1550], [800, 1600], [1200, 1700], [1200, 1800]], ['#e8f0ff', '#a0b0e0', '#5a6ab0', '#1a1a4a'], 0.3);
      // tiger skin
      K.fill(K.ell(600, 1240, 380, 70), K.lin(220, 0, 980, 0, ['#ffe08a', '#f0a030', '#b0581a', '#ffe08a']));
      K.overlay((pen) => { for (let k = 0; k < 14; k++) { const x = 260 + k * 50; pen.line([[x, 1205], [x + 6, 1235], [x - 2, 1262]], { w: 4, color: '#2a0a04', taper: 1 }); } });
      K.blob(600, 700, 420, '#e8f4ff', 0.5);
      K.trishul(980, 1250, 900, 0.04, { glow: '#c8f0ff' });
      K.shiva({ x: 600, y: 1235 + 0.44 * 1150, h: 1150, pose: { legs: 'lotus', armL: [0.45, -0.7], armR: [0.45, -0.7] }, face: { eyes: 'closed' }, head2: { thirdEye: 'closed' } });
      K.nandi(200, 1700, 320, { dir: 1 });
    },
  };
})();
