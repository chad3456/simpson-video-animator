// Aranya Kanda — Sita's companions at Panchavati were the deer and peacocks of the ashrama (she later grieves that no
// one will feed them). Here she kneels with grain in her palm while Rama watches, leaning on his bow.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['24-sita-feeds-the-deer'] = {
    title: 'Sita Feeds the Forest Deer', W: 1200, H: 1800, seed: 5124, layers: RP.eventLayers,
    accents: ['#ffd23a', '#3ad0a0', '#ff8ac0', '#ffffff', '#5ab0ff'],
    flow: (x, y, n) => 1.4 + n(x * 0.002, y * 0.002) * 1.5, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#0a5a4a', '#3aa06a', '#c8f08a', '#fff0b0', '#4a8a4a']));
      for (let i = 0; i < 5; i++) K.fill(K.poly([[700 + i * 120, -20], [760 + i * 120, -20], [420 + i * 120, 1300], [340 + i * 120, 1300]]), 'rgba(255,250,200,0.25)');
      for (const [x, h] of [[60, 1300], [1150, 1200], [600, 800]]) K.tree(x, 1150, h, { leaves: ['#8ae08a', '#2aa05a', '#0a6a4a', '#06302a'], flowers: ['#ffffff', '#ffd23a'], n: 8 });
      K.fill(K.path([[0, 1800], [0, 1150], [600, 1120], [1200, 1150], [1200, 1800]]), K.lin(0, 1120, 0, H, ['#d0f08a', '#7ab04a', '#3a6a2a', '#1a3a1a']));
      K.hut(280, 1180, 300);
      // Rama watching
      const r = K.rama({ x: 300, y: 1560, h: 900, turn: 0.35, look: 'forest', pose: { armL: [0.15, 0.1], armR: K.poses.hip }, face: { eyes: 'soft', gaze: [0.8, 0.3] } });
      K.bowAt([r.handL[0] - 10, r.handL[1] - 240], 560, -1.55, { w: 13 });
      // Sita kneeling, hand held out to a fawn
      const s = K.sita({ x: 720, y: 1700, h: 820, turn: 0.3, look: 'forest', pose: { legs: 'kneel', armL: K.poses.lap, armR: [1.05, 0.5] }, face: { eyes: 'soft', mouth: 'smile', gaze: [0.8, 0.4] } });
      K.overlay((pen) => { for (let k = 0; k < 8; k++) pen.dab(s.handR[0] + K.R(-14, 14), s.handR[1] + K.R(-8, 6), 4, '#ffe8a0'); });
      const fawn = ['#ffe8c8', '#e0a87a', '#a06a4a', '#4a2a1a'];
      K.deer(1040, 1720, 280, { dir: -1, plain: true, colors: fawn });
      K.deer(1130, 1500, 200, { dir: -1, plain: true, colors: fawn });
      K.peacock(560, 1780, 200, { dir: 1 });
      K.petals(50, [0, 0, W, 1200], ['#ffffff', '#ffd23a']);
    },
  };
})();
