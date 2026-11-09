// 15 — Dakshinamurti: Shiva as the supreme teacher, facing south beneath the banyan tree. Youthful, he sits with his
// right foot on Apasmara and his hand in chin mudra; the aged sages at his feet find their doubts dissolved in his
// silence. "The guru is young, the disciples old; the teaching is silence, and their doubts are gone."
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['15-dakshinamurti'] = {
    title: 'Dakshinamurti', W: 1200, H: 1800, seed: 6115, layers: RP.eventLayers,
    accents: ['#ffd23a', '#3ad07a', '#ffffff', '#ff8ac0', '#8ad0ff'],
    flow: (x, y, n) => (y < 900 ? 1.5 : 0.4) + n(x * 0.002, y * 0.002) * 1.4, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#0a4a3a', '#2a8a5a', '#c8e08a', '#fff0b0', '#6a8a4a']));
      // the great banyan: canopy, trunk and hanging roots
      for (let k = 0; k < 14; k++) K.blob(K.R(0, W), K.R(0, 500), K.R(160, 280), K.pick(['#0a6a4a', '#1a8a5a', '#3aa06a', '#0a4a3a']), 0.9);
      K.fill(K.poly([[480, 420], [720, 420], [760, 1200], [440, 1200]]), K.split(440, 0, 760, 0, ['#c0905a', '#8a5a3a', '#4a2a1a', '#1a0a04']));
      K.overlay((pen) => { for (let k = 0; k < 18; k++) { const x = K.R(40, 1160); pen.line([[x, 380], [x + K.R(-10, 10), K.R(700, 1100)]], { w: K.R(3, 7), color: '#6a4a2a', alpha: 0.8, taper: 0.3 }); } });
      K.blob(600, 820, 360, '#fff6c0', 0.6);
      K.fill(K.path([[0, 1800], [0, 1240], [600, 1200], [1200, 1240], [1200, 1800]]), K.lin(0, 1200, 0, H, ['#e8e0a0', '#a0b06a', '#4a6a3a', '#1a2a1a']));
      // the rock seat at the foot of the tree
      const rock = K.path([[300, 1320], [330, 1080], [420, 1030], [780, 1030], [880, 1090], [900, 1320]]);
      K.fill(rock, K.split(300, 0, 900, 0, ['#d8d0e0', '#9a90b0', '#5a5070', '#1a1428'])); K.focus(rock, 0.5);
      K.fill(K.ell(600, 1040, 300, 40), K.lin(300, 0, 900, 0, ['#ffe08a', '#f0a030', '#b0581a', '#ffe08a']));
      // Apasmara under his foot
      K.figure({ x: 560, y: 1480, h: 200, rot: -Math.PI / 2 + 0.08, skin: ['#8a7ab0', '#5a4a8a', '#2a1a4a', '#0a0414'], head: 'none', cloth: ['#c08a4a', '#8a5a2a', '#4a2a1a', '#1a0a04'], pose: { armL: [1.2, 0.5], armR: [0.6, 1.0] } });
      const r = K.shiva({ x: 600, y: 1490, h: 960, pose: { legs: 'sit', armL: [0.5, -2.3], armR: [0.35, -0.6] }, arms2: [[1.65, 1.15], [1.65, 1.15]], face: { eyes: 'soft', mouth: 'smile', gaze: [0, 0.6] }, head2: { thirdEye: 'closed' } });
      // chin mudra in the front hand; rudraksha mala and fire in the back hands
      K.overlay((pen) => {
        const [x, y] = r.handL; pen.fill(K.ell(x, y, 14, 14), '#fff6e0', 0.9);
        const [ax, ay] = r.hands2[0]; pen.line([[ax, ay - 20], [ax - 20, ay + 40], [ax, ay + 80], [ax + 20, ay + 40], [ax, ay - 20]], { w: 3, color: '#6a2010', taper: 0 });
        for (let k = 0; k < 10; k++) { const a = k / 10 * 6.28; K.bead(pen, ax + Math.sin(a) * 20, ay + 30 - Math.cos(a) * 50, 6); }
      });
      K.flame(r.hands2[1][0], r.hands2[1][1] + 6, 40, 90);
      // the four aged sages
      for (const [x, y, sd] of [[150, 1640, 1], [330, 1720, 1], [880, 1720, -1], [1060, 1640, -1]]) K.figure({ x, y: y + 0.44 * 380, h: 380, turn: 0.5 * sd, skin: ['#ffe0b0', '#f0a870', '#b0605a', '#4a1a3a'], head: 'jata', ascetic: true, earrings: false, hairColors: ['#ffffff', '#e8e0f0', '#b0b0d8', '#6a6aa0'], beard: 1.2, cloth: ['#fff0c0', '#ffb04a', '#c0601a', '#4a1a0a'], scarf: ['#fff0c0', '#ffb04a', '#c0601a', '#4a1a0a'], pose: { legs: 'lotus', armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'soft', mouth: 'calm', tilak: 'ash', gaze: [0.4 * sd, -0.6] } });
      K.petals(50, [0, 0, W, 1200], ['#ffffff', '#ffd23a']);
    },
  };
})();
