// 07 — Lingodbhava: when Brahma and Vishnu quarrelled over who was greater, a pillar of fire without beginning or end
// appeared between them. Brahma flew up as a swan and Vishnu dug down as a boar, and neither found its end. Then Shiva
// appeared within the pillar.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['07-pillar-of-light'] = {
    title: 'The Pillar of Light', W: 1200, H: 1800, seed: 6107, layers: RP.eventLayers,
    accents: ['#fff6c0', '#ffd23a', '#ff6a1a', '#8a5aff', '#3ad0ff'],
    flow: (x, y, n) => (Math.abs(x - 600) < 260 ? -Math.PI / 2 : 0.3) + n(x * 0.002, y * 0.002) * 1.2, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, 0, ['#06041a', '#2a0a5a', '#5a1a7a', '#2a0a5a', '#06041a']));
      K.overlay((pen) => { for (let k = 0; k < 220; k++) pen.dab(K.R(0, W), K.R(0, H), K.R(1.5, 4), K.pick(['#ffffff', '#c8d8ff', '#ffd8a0']), K.R(0.5, 1)); });
      K.blob(600, 900, 600, '#ff6a1a', 0.5);
      K.fill(K.poly([[380, -20], [820, -20], [820, H + 20], [380, H + 20]]), K.lin(380, 0, 820, 0, ['#ff3a1a', '#ffb02a', '#fff6c0', '#ffb02a', '#ff3a1a']));
      K.overlay((pen) => { for (let k = 0; k < 70; k++) { const x = K.R(380, 820), y = K.R(0, H); pen.line([[x, y], [x + K.R(-30, 30), y - K.R(60, 160)]], { w: K.R(6, 14), color: K.pick(['#fff6a0', '#ffd23a', '#ff6a1a']), taper: 1 }); } });
      // the opening in the pillar
      K.fill(K.ell(600, 900, 250, 380), K.rad(600, 900, 20, 380, ['#ffffff', '#c8e8ff', '#5a8aff', '#2a1a8a']));
      K.shiva({ x: 600, y: 1240, h: 640, pose: { armL: [0.6, 1.6], armR: [0.35, 0.1] }, arms2: [[1.65, 1.15], [1.65, 1.15]], face: { eyes: 'open', mouth: 'smile', gaze: [0, 0.2] }, head2: { thirdEye: 'closed' } });
      // Brahma as the swan, flying up
      K.overlay((pen) => {
        const x = 250, y = 260;
        pen.fill(K.ell(x, y, 70, 32, -0.5), '#ffffff');
        pen.line([[x + 40, y - 30], [x + 70, y - 90], [x + 100, y - 110]], { w: 16, color: '#ffffff', taper: 0.4 });
        pen.dab(x + 108, y - 112, 7, '#ff8a1a');
        for (const sd of [-1, 1]) pen.fill(K.path([[x - 10, y - 10], [x - 80 + sd * 30, y - 120 + sd * 10], [x + 30, y - 20]]), '#f0f4ff');
        pen.line([[x - 60, y + 20], [x - 60, y + 160]], { w: 3, color: '#ffffff', alpha: 0.4, taper: 1 });
      });
      // Vishnu as the boar Varaha, burrowing down into the earth
      K.overlay((pen) => {
        const x = 900, y = 1560, c = '#4a5ac0', c2 = '#2a2a7a';
        for (const [u, v] of [[-90, 40], [-40, 60], [40, 70], [80, 60]]) pen.line([[x + u, y + v], [x + u + 10, y + v + 60]], { w: 22, color: c2, taper: 0.3 });
        pen.fill(K.ell(x, y, 140, 80, 0.45), c);
        pen.fill(K.ell(x - 20, y - 30, 100, 40, 0.45), '#6a7ae0', 0.7);
        pen.line([[x - 120, y - 70], [x - 60, y - 95], [x + 20, y - 80], [x + 80, y - 40]], { w: 10, color: c2, taper: 0.5 });
        pen.fill(K.path([[x + 90, y + 10], [x + 150, y + 40], [x + 200, y + 110], [x + 185, y + 135], [x + 130, y + 110], [x + 80, y + 70]]), c);
        pen.fill(K.ell(x + 190, y + 128, 20, 14, 0.8), c2);
        pen.line([[x + 165, y + 105], [x + 190, y + 90], [x + 205, y + 70]], { w: 7, color: '#ffffff', taper: 1 });
        pen.fill(K.path([[x + 110, y + 10], [x + 125, y - 25], [x + 140, y + 15]]), c2);
        pen.fill(K.ell(x + 150, y + 55, 6, 6), '#ffd23a');
        for (let k = 0; k < 24; k++) pen.dab(x + K.R(120, 280), y + K.R(110, 230), K.R(5, 11), K.pick(['#8a5a3a', '#5a3a2a', '#c08a5a']));
      });
    },
  };
})();
