// 09 — Uma-Maheshvara: Shiva and Parvati seated together on Kailash, the lake Manasarovar below them silver under the
// moon, Nandi resting at their feet: the union of consciousness and energy, Shiva and Shakti.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['09-shiva-and-parvati-on-kailash'] = {
    title: 'Shiva and Parvati on Kailash', W: 1800, H: 1200, seed: 6109, layers: RP.eventLayers,
    accents: ['#ffffff', '#ffd23a', '#ff6a8a', '#8ad0ff', '#c08aff'],
    flow: (x, y, n) => 0.4 + n(x * 0.002, y * 0.002) * 1.4, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#0a0a3a', '#2a2a8a', '#6a5ac0', '#c8a0e0', '#3a3a7a']));
      K.overlay((pen) => { for (let k = 0; k < 160; k++) pen.dab(K.R(0, W), K.R(0, 500), K.R(1.5, 4), '#ffffff', K.R(0.5, 1)); });
      K.moon(1500, 220, 70);
      K.mountain([[300, 760], [700, 160], [1100, 760]], ['#ffffff', '#d8e0ff', '#8a9ae0', '#3a3a8a'], 0.4);
      K.mountain([[0, 820], [200, 560], [420, 760], [1300, 760], [1550, 520], [1800, 760], [1800, 860], [0, 860]], ['#e8f0ff', '#a0b0e0', '#5a6ab0', '#1a1a4a'], 0.3);
      K.fill(K.poly([[0, 820], [W, 820], [W, 960], [0, 960]]), K.lin(0, 820, 0, 960, ['#c8d8ff', '#6a8ae0', '#2a3a8a']));
      K.overlay((pen) => { for (let k = 0; k < 20; k++) { const y = K.R(830, 950); pen.line([[1500 - K.R(30, 90), y], [1500 + K.R(30, 90), y]], { w: 3, color: '#ffffff', alpha: 0.7 }); } });
      K.fill(K.path([[0, 1200], [0, 960], [600, 920], [1200, 930], [1800, 980], [1800, 1200]]), K.lin(0, 920, 0, H, ['#ffffff', '#c8d0f0', '#7a80c0', '#2a2a5a']));
      K.fill(K.ell(880, 1080, 380, 60), K.lin(500, 0, 1260, 0, ['#ffe08a', '#f0a030', '#b0581a', '#ffe08a']));
      K.blob(880, 600, 380, '#fff0d0', 0.45);
      K.shiva({ x: 760, y: 1070 + 0.44 * 760, h: 760, turn: 0.15, pose: { legs: 'lotus', armL: [0.4, -1.0], armR: [1.0, -0.6] }, face: { eyes: 'soft', mouth: 'smile', gaze: [0.5, 0.2] }, head2: { thirdEye: 'closed' } });
      K.parvati({ x: 1030, y: 1075 + 0.44 * 680, h: 680, turn: -0.2, pose: { legs: 'lotus', armL: [0.5, -1.4], armR: K.poses.lap }, face: { eyes: 'soft', mouth: 'smile', gaze: [-0.5, 0.1] } });
      K.trishul(560, 1090, 640, -0.05, { glow: '#c8f0ff' });
      K.nandi(1420, 1150, 330, { dir: -1 });
    },
  };
})();
