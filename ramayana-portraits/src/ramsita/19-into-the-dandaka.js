// Aranya Kanda (sarga 11) — they walk into the vast Dandaka forest in single file: Rama in front, Sita in the middle,
// Lakshmana behind with his bow, past lotus pools, cranes and herds of deer.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['19-into-the-dandaka'] = {
    title: 'Into the Dandaka Forest', W: 1800, H: 1200, seed: 5119, layers: RP.eventLayers,
    accents: ['#ffd23a', '#3ad0a0', '#ffffff', '#ff8a3a', '#5a7aff'],
    flow: (x, y, n) => 1.5 + n(x * 0.002, y * 0.002) * 1.6, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#0a4a3a', '#2a8a5a', '#a0e08a', '#fff0a0', '#3a8a5a']));
      for (let i = 0; i < 6; i++) K.fill(K.poly([[900 + i * 140, -20], [960 + i * 140, -20], [700 + i * 140, 1000], [600 + i * 140, 1000]]), 'rgba(255,250,200,0.28)');
      for (const [x, h] of [[60, 1100], [380, 900], [1500, 1000], [1750, 1150], [1150, 700]]) K.tree(x, 940, h, { leaves: ['#7ae07a', '#2aa05a', '#0a6a4a', '#06302a'], n: 8 });
      K.fill(K.path([[0, 1200], [0, 960], [600, 900], [1200, 860], [1800, 900], [1800, 1200]]), K.lin(0, 860, 0, H, ['#c8e08a', '#6a9a4a', '#2a4a2a']));
      K.fill(K.path([[300, 1200], [700, 940], [1100, 880], [1300, 900], [1000, 1200]]), K.lin(0, 880, 0, H, ['#fff0c0', '#e0c08a', '#a07a4a']));
      K.figure({ x: 470, y: 1180, h: 720, skin: ['#ffe0b0', '#f0a870', '#b0605a', '#4a1a3a'], head: 'jata', ascetic: true, earrings: false, hairColors: ['#3a2a2a', '#22161a', '#120a0e', '#060306'], cloth: K.RS.bark, scarf: K.RS.bark, turn: 0.4, pose: { legs: 'walk', armL: K.poses.rest, armR: [0.3, 0.2] }, face: { eyes: 'soft', mouth: 'calm', gaze: [0.8, 0] } });
      K.bowAt([430, 640], 480, -1.5, { w: 12 });
      K.sita({ x: 780, y: 1080, h: 640, turn: 0.4, look: 'forest', pose: { legs: 'walk', armL: K.poses.rest, armR: [0.4, 0.3] }, face: { eyes: 'open', mouth: 'smile', gaze: [0.8, -0.2] } });
      K.rama({ x: 1060, y: 1000, h: 620, turn: 0.4, look: 'forest', pose: { legs: 'walk', armL: [0.3, 0.1], armR: [0.6, 0.4] }, face: { gaze: [0.9, 0] } });
      K.deer(1480, 1040, 220, { dir: -1 });
      K.petals(80, [0, 0, W, 1000], ['#ffd23a', '#ffffff', '#ff8a3a']);
    },
  };
})();
