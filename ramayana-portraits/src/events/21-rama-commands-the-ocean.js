// Yuddha Kanda (sargas 21–22) — after three days of prayer the ocean stays silent, so Rama, eyes red with anger, draws
// the Brahmastra to dry it up. The sea heaves in terror and Samudra rises from the waves with folded hands, offering a path.
(function () {
  RP.events['21-rama-commands-the-ocean'] = {
    title: 'Rama Commands the Ocean',
    W: 1800, H: 1200, seed: 2121,
    layers: RP.eventLayers,
    accents: ['#ffffff', '#3ad0ff', '#ffd23a', '#8a3aff', '#3affb0'],
    flow: (x, y, n) => (y > 700 ? 0.2 * Math.sin(x * 0.006) : -0.2) + n(x * 0.002, y * 0.002) * 1.5,
    turbulence: 1.0,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#0a0a2a', '#2a1a6a', '#5a3aa0', '#3a8ad0', '#0a2a6a']));
      K.blob(1300, 200, 400, '#140a3a', 0.8);
      K.blob(400, 150, 300, '#5a3aa0', 0.6);
      // the raging sea, waves rearing up
      K.fill(K.poly([[0, 720], [W, 680], [W, H], [0, H]]), K.lin(0, 680, 0, H, ['#3ad0ff', '#1a7ad0', '#0a2a8a', '#06103a']));
      for (let i = 0; i < 7; i++) {
        const x = 700 + i * 180, h = K.R(180, 340);
        const w = K.path([[x - 140, 780], [x - 80, 780 - h * 0.6], [x, 780 - h], [x + 60, 780 - h * 0.85], [x + 30, 780 - h * 0.6], [x + 140, 780]]);
        K.fill(w, K.lin(x, 780 - h, x, 780, ['#ffffff', '#8ae0ff', '#1a8ad0', '#0a3a8a'])); K.focus(w, 0.5);
      }
      // Samudra rising from the waves, palms joined
      K.figure({ x: 1400, y: 1000, h: 900, skin: ['#9affe0', '#3ac0b0', '#1a6a8a', '#0a2a4a'], head: 'crown', turn: -0.4,
        cloth: ['#c8f0ff', '#5ab0ff', '#2a5ad0', '#0a1a6a'], scarf: ['#ffffff', '#bff0ff', '#5ab0ff', '#1a3a8a'],
        pose: { legs: 'hidden', armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'soft', brow: 'calm', mouth: 'calm', gaze: [-1, 0.2] } });
      K.fill(K.poly([[1000, 900], [1800, 860], [1800, 1200], [1000, 1200]]), K.lin(0, 860, 0, H, ['#5ad0ff', '#1a6ad0', '#0a2a6a']));
      // the shore and Rama
      K.fill(K.path([[0, 1200], [0, 940], [300, 920], [620, 980], [820, 1200]]), K.split(0, 0, 820, 0, ['#ffe0a0', '#d0905a', '#7a4a3a', '#2a1420'])); K.focus(K.path([[0, 1200], [0, 940], [300, 920], [620, 980], [820, 1200]]), 0.4);
      const r = K.archer({ x: 330, y: 1180, h: 860, forest: true, glow: '#fff6c0', tip: '#fff6c0' });
      K.overlay((pen) => {
        for (let k = 0; k < 30; k++) { const x = K.R(600, 1800), y = K.R(560, 820); pen.line([[x, y], [x + K.R(-20, 20), y - K.R(20, 80)]], { w: K.R(4, 8), color: '#ffffff', alpha: 0.8, taper: 1 }); }
        // lightning
        pen.line([[900, 0], [860, 140], [940, 200], [880, 360]], { w: 6, color: '#ffffff', taper: 0.5 });
        pen.line([[1650, 0], [1600, 120], [1680, 190], [1620, 320]], { w: 5, color: '#e8f4ff', taper: 0.5 });
      });
      K.waves(720, 1200, { n: 180 });
    },
  };
})();
