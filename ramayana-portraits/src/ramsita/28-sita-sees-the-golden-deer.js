// Aranya Kanda (sarga 43) — gathering flowers by the hut, Sita sees a deer of gold and jewels grazing among the trees and
// calls to Rama: "Look, my lord, that wonderful deer! Catch it for me." Lakshmana, uneasy, warns it is Maricha.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['28-sita-sees-the-golden-deer'] = {
    title: 'Sita Sees the Golden Deer', W: 1800, H: 1200, seed: 5128, layers: RP.eventLayers,
    accents: ['#ffd23a', '#fff6c0', '#ff8ac0', '#3ad07a', '#ffffff'],
    flow: (x, y, n) => 1.3 + n(x * 0.002, y * 0.002) * 1.5, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#0a4a3a', '#3a9a5a', '#c8f08a', '#fff0a0', '#3a7a4a']));
      for (const [x, h] of [[60, 1050], [1300, 760], [1560, 900], [1780, 1100], [900, 640]]) K.tree(x, 920, h, { leaves: ['#8ae08a', '#2aa05a', '#0a6a4a', '#06302a'], flowers: ['#ffffff', '#ffd23a'], n: 8 });
      K.fill(K.path([[0, 1200], [0, 920], [800, 890], [1800, 920], [1800, 1200]]), K.lin(0, 890, 0, H, ['#d0f08a', '#7ab04a', '#2a5a2a']));
      K.hut(260, 960, 360);
      K.blob(1450, 860, 260, '#fff0a0', 0.6);
      K.deer(1450, 1000, 300, { dir: -1 });
      // Lakshmana behind, wary
      K.figure({ x: 470, y: 1060, h: 560, skin: ['#ffe0b0', '#f0a870', '#b0605a', '#4a1a3a'], head: 'jata', ascetic: true, earrings: false, hairColors: ['#3a2a2a', '#22161a', '#120a0e', '#060306'], cloth: K.RS.bark, scarf: K.RS.bark, turn: 0.4, pose: { armL: K.poses.rest, armR: [0.8, -1.4] }, face: { eyes: 'open', brow: 'furrow', mouth: 'calm', gaze: [0.9, 0] } });
      // Sita points, a basket of flowers on her arm; Rama turns to look
      const s = K.sita({ x: 820, y: 1160, h: 780, turn: 0.35, look: 'forest', pose: { legs: 'walk', armL: [0.5, -1.2], armR: [1.55, 0.05] }, face: { eyes: 'open', mouth: 'smile', gaze: [0.9, -0.1] } });
      K.overlay((pen) => { const [x, y] = s.handL; pen.fill(K.ell(x, y + 20, 50, 26), '#b08a4a'); for (let k = 0; k < 9; k++) pen.dab(x + K.R(-40, 40), y + K.R(-6, 10), 10, K.pick(['#ffffff', '#ffd23a', '#ff8ac0'])); });
      const r = K.rama({ x: 640, y: 1170, h: 840, turn: 0.4, look: 'forest', pose: { armL: K.poses.rest, armR: [0.4, 0.2] }, face: { eyes: 'open', gaze: [0.9, -0.1] } });
      K.bowAt([r.handL[0] - 20, r.handL[1] - 200], 500, -1.55, { w: 12 });
    },
  };
})();
