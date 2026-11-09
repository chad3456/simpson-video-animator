// 14 — Lord of Kashi: Varanasi at dusk, the city Shiva is said never to leave. Lamps float on the Ganga, aarti flames
// rise from the ghats, and above the temple spires his form appears in the clouds, blessing the city.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['14-lord-of-kashi'] = {
    title: 'Lord of Kashi', W: 1800, H: 1200, seed: 6114, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff8a1a', '#ffffff', '#8ad0ff', '#c08aff'],
    flow: (x, y, n) => (y > 860 ? 0.0 : 0.5) + n(x * 0.002, y * 0.002) * 1.3, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#2a1a6a', '#6a3a9a', '#e07a8a', '#ffb05a', '#ffd88a']));
      // the cloud form
      for (let k = 0; k < 12; k++) K.blob(900 + K.R(-650, 650), K.R(380, 620), K.R(120, 220), K.pick(['#ffe0c0', '#e8c0e0', '#c8b0f0']), 0.6);
      K.blob(900, 340, 380, '#e8f0ff', 0.6);
      const ghost = ['#e8f0ff', '#b0c0f0', '#7a7ad0', '#4a3a9a'];
      K.shiva({ x: 900, y: 1150, h: 1050, skin: ghost, cloth: ghost, pose: { legs: 'hidden', armL: [0.6, 1.6], armR: [0.35, 0.1] }, face: { eyes: 'half', mouth: 'smile', gaze: [0, 0.6], lips: '#6a4a9a', lips2: '#8a6ab0', contourColor: '#3a2a8a' }, head2: { thirdEye: 'closed' } });
      // temple spires and the ghats
      for (const [x, h] of [[160, 300], [330, 380], [520, 260], [1260, 280], [1450, 400], [1650, 300]]) {
        K.fill(K.path([[x - h * 0.22, 900], [x - h * 0.2, 900 - h * 0.5], [x - h * 0.1, 900 - h * 0.85], [x, 900 - h], [x + h * 0.1, 900 - h * 0.85], [x + h * 0.2, 900 - h * 0.5], [x + h * 0.22, 900]]), K.split(x - h * 0.22, 0, x + h * 0.22, 0, ['#ffd8a0', '#e0905a', '#8a4a4a', '#3a1a2a']));
        K.overlay((pen) => { pen.line([[x, 900 - h], [x, 900 - h - 50]], { w: 3, color: '#3a1a2a' }); pen.fill(K.path([[x, 900 - h - 50], [x + 40, 900 - h - 38], [x, 900 - h - 26]]), '#ff6a1a'); });
      }
      K.fill(K.poly([[0, 880], [W, 880], [W, 960], [0, 960]]), K.lin(0, 880, 0, 960, ['#c08a6a', '#8a5a4a', '#4a2a2a']));
      K.overlay((pen) => { for (let k = 0; k < 4; k++) pen.line([[0, 900 + k * 18], [W, 900 + k * 18]], { w: 3, color: '#3a1a1a', alpha: 0.5 }); });
      // aarti priests with flaming lamps
      for (let k = 0; k < 5; k++) { const x = 380 + k * 260; K.figure({ x, y: 900, h: 150, skin: ['#ffd8a0', '#f09a5a', '#a04a6a', '#3a1a4a'], head: 'none', cloth: ['#ffd23a', '#ff8a1a', '#c0401a', '#4a1a0a'], pose: { armL: [0.3, 0.1], armR: [2.6, 0.2] } }); K.flame(x + 22, 760, 40, 90); K.blob(x + 22, 740, 70, '#ffd23a', 0.7); }
      // the Ganga with floating lamps
      K.fill(K.poly([[0, 960], [W, 960], [W, H], [0, H]]), K.lin(0, 960, 0, H, ['#ffd08a', '#e07a5a', '#6a3a8a', '#1a1a4a']));
      K.waves(960, 1200, { n: 70 });
      K.overlay((pen) => { for (let k = 0; k < 50; k++) { const x = K.R(0, W), y = K.R(990, 1190); pen.fill(K.ell(x, y, 12, 5), '#e0a050'); pen.dab(x, y - 8, 6, '#fff6a0'); pen.line([[x, y + 6], [x, y + 40]], { w: 3, color: '#ffd23a', alpha: 0.5, taper: 1 }); } });
    },
  };
})();
