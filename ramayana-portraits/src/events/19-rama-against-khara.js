// Aranya Kanda (sargas 24–30) — at Janasthana, Rama sends Lakshmana and Sita to a cave, dons armour that blazes "like
// fire", and alone, with one bow, destroys Khara, Dushana, Trishira and their fourteen thousand rakshasas.
(function () {
  RP.events['19-rama-against-khara'] = {
    title: "Rama Alone Against Khara's Fourteen Thousand",
    W: 1800, H: 1200, seed: 1919,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff3a1a', '#ffffff', '#3ad0ff', '#8a3aff'],
    flow: (x, y, n) => (y < 700 ? 0.05 : 0.1) + n(x * 0.002, y * 0.002) * 1.2,
    turbulence: 0.8,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, 0, ['#ffe8a0', '#ff9a3a', '#e0301a', '#8a0a3a', '#2a0a3a']));
      K.blob(280, 300, 360, '#fff8d8', 0.8);
      K.blob(1500, 260, 420, '#3a0a3a', 0.6);
      // dust of the onrushing army
      for (let i = 0; i < 6; i++) K.blob(1000 + i * 160, 820, 200, '#c86a5a', 0.5);
      K.fill(K.poly([[0, 900], [W, 860], [W, H], [0, H]]), K.lin(0, 860, 0, H, ['#d88a4a', '#8a4a2a', '#2a0a14']));
      // Rama on a rock, armour aflame
      K.mountain([[-40, 1200], [-40, 1020], [200, 990], [520, 1010], [680, 1200]], ['#c88a6a', '#8a5a4a', '#4a2a3a', '#1a0a14'], 0.35);
      const r = K.archer({ x: 360, y: 1020, h: 820, forest: true, cloth: ['#fff3a0', '#ffc22a', '#e0701a', '#7a2a10'], scarf: ['#fff3a0', '#ffd23a', '#ff8a1a', '#a03a10'] });
      // the horde: rows of rakshasas with spears, chariots behind
      for (let row = 0; row < 4; row++) {
        const n = 6 + row * 2, y = 860 + row * 90, h = 180 + row * 70;
        for (let k = 0; k < n; k++) { const x = 820 + (k + K.R(-0.2, 0.2)) * (1000 / n) + row * 20; K.rakshasa(x, y, h, { armL: [K.R(2.0, 2.8), 0.3], armR: [K.R(0.4, 1.4), 0.4] }); }
      }
      K.chariot(1650, 820, 200, { dir: -1, flag: '#3a0a3a', colors: ['#c8a0ff', '#7a3aa0', '#3a1a5a', '#140828'] });
      K.overlay((pen) => {
        // a storm of arrows fanning out from Rama's bow
        const [bx, by] = r.bow;
        for (let k = 0; k < 46; k++) {
          const tx = K.R(800, 1780), ty = K.R(700, 1180), sx = bx + 150 + K.R(0, 300), sy = by + (ty - by) * 0.15 + K.R(-30, 30);
          const a = Math.atan2(ty - sy, tx - sx), L = 70;
          pen.line([[tx - Math.cos(a) * L, ty - Math.sin(a) * L], [tx, ty]], { w: 4, color: '#fff3c0', taper: 0.1 });
          pen.line([[sx, sy], [tx - Math.cos(a) * L, ty - Math.sin(a) * L]], { w: 2, color: '#ffd23a', alpha: 0.35, taper: 1 });
        }
        // the blaze of his armour
        for (let k = 0; k < 24; k++) { const a = k / 24 * 6.283; pen.line([[360 + Math.cos(a) * 160, 640 + Math.sin(a) * 300], [360 + Math.cos(a) * 220, 640 + Math.sin(a) * 380]], { w: 6, color: '#ffd23a', alpha: 0.6, taper: 1 }); }
      });
      K.sparks(120, [800, 700, W, H]);
    },
  };
})();
