// Sundara Kanda (sarga 36), as Sita recalls it to Hanuman — at Chitrakuta, tired from their wanderings, Rama slept with
// his head in her lap, and when a crow troubled her he woke and drove it off with a blade of grass charged as a weapon.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['15-head-in-her-lap'] = {
    title: 'Resting at Chitrakuta', W: 1800, H: 1200, seed: 5115, layers: RP.eventLayers,
    accents: ['#ffd23a', '#3ad0a0', '#ffffff', '#ff8ac0', '#8a5aff'],
    flow: (x, y, n) => 1.4 + n(x * 0.002, y * 0.002) * 1.6, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#ffe8a0', '#a0e08a', '#3aa07a', '#14705a', '#0a3a3a']));
      for (let i = 0; i < 5; i++) K.fill(K.poly([[200 + i * 300, -20], [280 + i * 300, -20], [480 + i * 300, 1000], [360 + i * 300, 1000]]), 'rgba(255,250,200,0.3)');
      K.tree(320, 960, 1000, { leaves: ['#b0ffb0', '#3ad07a', '#0a8a5a', '#0a4a3a'], flowers: ['#ffd23a', '#ff8ac0'], n: 9 });
      K.fill(K.poly([[0, 920], [W, 900], [W, H], [0, H]]), K.lin(0, 900, 0, H, ['#a0e070', '#4a9a4a', '#1a4a2a']));
      // Sita seated against the tree, Rama asleep with his head in her lap
      const s = K.sita({ x: 520, y: 1080 + 0.44 * 820, h: 820, turn: 0.35, look: 'forest', pose: { legs: 'lotus', armL: [0.5, -0.9], armR: [0.4, 0.6] }, face: { eyes: 'down', mouth: 'smile', gaze: [0.5, 0.6] } });
      K.rama({ x: 610 + 0.935 * 820, y: 1030, h: 820, rot: -Math.PI / 2 + 0.08, turn: 0.2, look: 'forest', pose: { armL: [0.4, 0.5], armR: K.poses.rest }, face: { eyes: 'closed', mouth: 'calm' } });
      K.overlay((pen) => { const x = 1350, y = 330; pen.line([[x - 40, y], [x, y - 14], [x + 40, y]], { w: 10, color: '#14102a' }); });
      K.petals(90, [0, 0, W, 1100], ['#ffd23a', '#ffffff', '#ff8ac0']);
    },
  };
})();
