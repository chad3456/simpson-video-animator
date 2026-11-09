// From the folk tradition of the jhoola: in the season of new leaves Rama hangs a swing of vines from a kadamba bough at
// Panchavati and sets Sita swinging, flowers falling around them. (A beloved image in song, not Valmiki's text.)
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['27-the-forest-swing'] = {
    title: 'The Forest Swing', W: 1200, H: 1800, seed: 5127, layers: RP.eventLayers,
    accents: ['#ff6ab0', '#ffd23a', '#3ad07a', '#ffffff', '#5ab0ff'],
    flow: (x, y, n) => 1.6 + n(x * 0.002, y * 0.002) * 1.4, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#5ad0ff', '#c8f4ff', '#fff6c0', '#a0e08a', '#2a6a3a']));
      // the great bough across the top
      K.fill(K.path([[-40, 180], [400, 120], [900, 150], [1240, 110], [1240, 200], [900, 230], [400, 210], [-40, 270]]), K.lin(0, 110, 0, 270, ['#c08a5a', '#7a4a2a', '#3a1a10']));
      for (let k = 0; k < 16; k++) K.blob(K.R(0, W), K.R(0, 260), K.R(70, 150), K.pick(['#7ae07a', '#2aa05a', '#0a6a4a', '#ff8ac0']), 0.8);
      K.tree(1120, 1300, 900, { leaves: ['#a0ffb0', '#3ad07a', '#0a8a5a', '#0a4a3a'], flowers: ['#ffffff', '#ff8ac0'], n: 7 });
      K.fill(K.path([[0, 1800], [0, 1320], [600, 1290], [1200, 1320], [1200, 1800]]), K.lin(0, 1290, 0, H, ['#d0f08a', '#7ab04a', '#2a5a2a']));
      // Sita on the swing, mid-flight, the ropes slanting
      const h = 760, sx = 560, seat = 1080;
      for (const sd of [-1, 1]) { const x0 = sx + sd * 180 - 140, x1 = sx + sd * 180; K.fill(K.poly([[x0 - 5, 190], [x0 + 5, 190], [x1 + 5, seat], [x1 - 5, seat]]), '#5a8a3a'); }
      K.fill(K.poly([[sx - 230, seat - 10], [sx + 230, seat - 10], [sx + 230, seat + 14], [sx - 230, seat + 14]]), '#8a5a2a');
      K.overlay((pen) => { for (const sd of [-1, 1]) for (let k = 0; k < 16; k++) { const t = k / 15; pen.dab(sx + sd * 180 - 140 * (1 - t), 190 + (seat - 190) * t, 8, K.pick(['#ff6ab0', '#ffd23a', '#ffffff'])); } });
      K.sita({ x: sx, y: seat + 0.46 * h, h, turn: 0.15, look: 'princess', saree: K.RS.pink, pose: { legs: 'sit', armL: [0.9, -1.3], armR: [0.9, -1.3] }, face: { eyes: 'open', mouth: 'smile', gaze: [-0.5, 0.2] } });
      // Rama below, having just let go
      K.rama({ x: 260, y: 1720, h: 880, turn: 0.4, look: 'forest', pose: { legs: 'stride', armL: [1.4, 0.4], armR: [1.2, 0.5] }, face: { eyes: 'open', mouth: 'smile', gaze: [0.6, -0.7] } });
      K.peacock(980, 1700, 220, { dir: -1, fan: true });
      K.petals(110, [0, 200, W, 1600], ['#ff6ab0', '#ffffff', '#ffd23a']);
    },
  };
})();
