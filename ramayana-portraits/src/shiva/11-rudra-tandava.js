// 11 — Rudra Tandava: the dance of dissolution at the end of an age. Shiva's dark form whirls against a sky of fire,
// the trishul raised, his locks lashing the stars, the worlds breaking into light around him.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['11-rudra-tandava'] = {
    title: 'Rudra Tandava', W: 1800, H: 1200, seed: 6111, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff3a1a', '#ffffff', '#ff8a1a', '#8a3aff'],
    flow: RP.flows.swirl(900, 560), turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(900, 560, 40, 1100, ['#fff6c0', '#ffd23a', '#ff6a1a', '#c0102a', '#3a0a3a', '#06020a']));
      for (let k = 0; k < 7; k++) { const a = k * 0.9; K.blob(900 + Math.cos(a) * 700, 560 + Math.sin(a) * 450, 160, K.pick(['#2a0a3a', '#5a0a2a', '#1a0a4a']), 0.8); }
      // planets and stars breaking apart
      K.overlay((pen) => {
        for (const [x, y, r] of [[260, 220, 40], [1560, 300, 55], [1440, 900, 30], [330, 860, 35]]) { pen.fill(K.ell(x, y, r, r), '#3a1a5a'); pen.line([[x - r * 0.7, y - r * 0.2], [x + r * 0.8, y + r * 0.3]], { w: 3, color: '#ffd23a' }); }
        for (let k = 0; k < 40; k++) { const a = K.R(0, 6.28), d = K.R(350, 800); const x = 900 + Math.cos(a) * d, y = 560 + Math.sin(a) * d * 0.7; pen.line([[x, y], [x + Math.cos(a) * 60, y + Math.sin(a) * 40]], { w: K.R(3, 8), color: K.pick(['#fff6a0', '#ffd23a', '#ffffff']), taper: 1 }); }
      });
      K.fill(K.path([[0, 1200], [0, 1080], [600, 1040], [1200, 1050], [1800, 1090], [1800, 1200]]), '#0a0410');
      // the dark dancer
      const ink = ['#2a1a4a', '#140a2a', '#0a0414', '#000000'];
      const r = K.figure({ x: 900, y: 1060, h: 900, skin: ink, head: 'jata', ascetic: true, earrings: false, hairColors: ink, cloth: ink, border: '#ffd23a', pose: { legs: 'dance', armL: [2.5, 0.2], armR: [1.4, -0.4] }, arms2: [[1.4, 0.6], [2.3, 0.3]], face: { eyes: 'fierce', brow: 'furrow', mouth: 'grim', tilak: 'none' } });
      if (r.headF) K.shivaHead(r.headF, { thirdEye: 'fire', ganga: false, tripundra: true });
      K.overlay((pen) => {
        const hc = r.hc;
        for (let k = 0; k < 18; k++) { const sd = k % 2 ? 1 : -1, j = k >> 1; pen.line([[hc[0], hc[1] - 30], [hc[0] + sd * (150 + j * 22), hc[1] - 90 + j * 12], [hc[0] + sd * (280 + j * 30), hc[1] - 60 + j * 30 + K.R(-30, 30)]], { w: 10, color: '#0a0414', taper: 1 }); }
        K.damaruPen(pen, r.hands2[0][0], r.hands2[0][1], 32, 0.3);
      });
      K.trishul(r.handL[0], r.handL[1] + 400, 860, -0.12, { glow: '#fff6c0' });
      K.sparks(160, [0, 0, W, H]);
    },
  };
})();
