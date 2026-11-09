// Aranya Kanda (sarga 44) — to please Sita, Rama takes up his bow and follows the golden deer deep into the forest, the
// creature now near, now far, flickering between the trees; behind him, small at the hut, Sita watches him go.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['29-rama-follows-the-deer'] = {
    title: 'Rama Follows the Golden Deer', W: 1200, H: 1800, seed: 5129, layers: RP.eventLayers,
    accents: ['#ffd23a', '#fff6c0', '#3ad07a', '#ff8a1a', '#5ab0ff'],
    flow: (x, y, n) => 1.5 + n(x * 0.002, y * 0.002) * 1.6, turbulence: 0.7,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#06302a', '#0a5a4a', '#3a9a5a', '#c8e08a', '#1a3a2a']));
      for (let i = 0; i < 4; i++) K.fill(K.poly([[500 + i * 160, -20], [560 + i * 160, -20], [380 + i * 160, 1400], [300 + i * 160, 1400]]), 'rgba(255,250,200,0.22)');
      for (const [x, h] of [[30, 1500], [400, 900], [760, 1100], [1180, 1400]]) K.tree(x, 1100, h, { leaves: ['#5ab07a', '#1a7a5a', '#0a4a3a', '#041a14'], n: 7 });
      K.fill(K.path([[0, 1800], [0, 1100], [600, 1060], [1200, 1100], [1200, 1800]]), K.lin(0, 1060, 0, H, ['#a0d07a', '#4a8a4a', '#1a3a2a']));
      // far off: the hut and Sita watching
      K.hut(180, 1120, 170);
      K.sita({ x: 300, y: 1130, h: 230, turn: 0.4, look: 'forest', pose: { armL: K.poses.chest, armR: K.poses.rest }, face: { eyes: 'open', mouth: 'calm', gaze: [0.8, 0] } });
      // the deer leaping away between the trees
      K.blob(900, 720, 170, '#fff0a0', 0.5);
      K.deer(900, 800, 180, { dir: 1 });
      // Rama, bow drawn, stepping forward
      K.archer({ x: 420, y: 1720, h: 1000, forest: true, legs: 'stride', face: { eyes: 'open', brow: 'calm', mouth: 'calm', tilak: 'vaishnava', gaze: [1, -0.3] } });
    },
  };
})();
