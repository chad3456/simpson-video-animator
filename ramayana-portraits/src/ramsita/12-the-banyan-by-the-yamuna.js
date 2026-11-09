// Ayodhya Kanda (sarga 49) — after crossing the Yamuna on a raft Lakshmana has bound with reeds, Sita bows to the great
// dark banyan called Shyama and prays for their safe return.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['12-the-banyan-by-the-yamuna'] = {
    title: 'The Great Banyan by the Yamuna', W: 1800, H: 1200, seed: 5112, layers: RP.eventLayers,
    accents: ['#ffd23a', '#3ad0a0', '#ffffff', '#ff8ac0', '#8a5aff'],
    flow: (x, y, n) => 1.4 + n(x * 0.002, y * 0.002) * 1.6, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#2a4ab0', '#3a8ad0', '#8ad0c0', '#3a9a6a', '#0a3a3a']));
      // the banyan: a vast dark crown, hanging roots
      const trunk = K.limbPath([1250, 1100], [1240, 520], 120, 80); K.fill(trunk, K.lin(1140, 0, 1360, 0, ['#8a6a5a', '#4a2a2a', '#1a0a14'])); K.focus(trunk, 0.5);
      for (let k = 0; k < 9; k++) { const x = 900 + k * 100 + K.R(-30, 30), y = K.R(160, 420), r = K.R(160, 240); K.fill(K.patch(x, y, r, r * 0.7, 0), K.split(x - r, y, x + r, y, ['#3ad08a', '#14806a', '#0a4a4a', '#06202a']), 0.97); }
      K.overlay((pen) => { for (let k = 0; k < 26; k++) { const x = K.R(950, 1650); pen.line([[x, K.R(380, 520)], [x + K.R(-10, 10), K.R(800, 1080)]], { w: K.R(4, 8), color: '#6a4a3a', alpha: 0.85, taper: 0.2 }); } });
      K.river([[0, 980], [500, 1000], 900 > 0 ? [900, 1040] : [0, 0]], 160, ['#5a7aff', '#2a3ac0', '#1a1a7a', '#0a0a3a']);
      K.fill(K.poly([[0, 1080], [W, 1040], [W, H], [0, H]]), K.lin(0, 1040, 0, H, ['#8ad06a', '#3a8a4a', '#1a4a2a']));
      // the raft at the water's edge
      K.overlay((pen) => { for (let k = 0; k < 8; k++) pen.line([[140 + k * 12, 1050], [460 + k * 12, 1010]], { w: 14, color: K.pick(['#c8a05a', '#a07a3a']), taper: 0 }); });
      K.rama({ x: 520, y: 1150, h: 780, turn: 0.35, look: 'forest', pose: { armL: K.poses.rest, armR: K.poses.anjali } });
      K.sita({ x: 820, y: 1150, h: 740, turn: 0.4, look: 'forest', pose: { legs: 'kneel', armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'down', mouth: 'calm' } });
      K.petals(60, [800, 100, 1700, 900], ['#ffffff', '#ffd23a']);
    },
  };
})();
