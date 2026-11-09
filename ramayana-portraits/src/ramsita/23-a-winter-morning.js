// Aranya Kanda (sarga 16) — Hemanta, the cold season: at dawn the three walk down to the Godavari to bathe. Mist lies on
// the water, the sun is pale as the moon, and dew hangs on the barley. Rama walks with Sita through the silver haze.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['23-a-winter-morning'] = {
    title: 'A Winter Morning at Panchavati', W: 1800, H: 1200, seed: 5123, layers: RP.eventLayers,
    accents: ['#ffffff', '#c8e0ff', '#ffd23a', '#ff8ac0', '#8ad0ff'],
    flow: (x, y, n) => 0.05 + n(x * 0.0015, y * 0.002) * 1.0, turbulence: 0.4,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#c8d8ff', '#eef0ff', '#fff4e0', '#d0e0e8', '#8aa0b0']));
      K.blob(1300, 330, 80, '#fffbe8', 1); K.blob(1300, 330, 240, '#ffe8c0', 0.4);
      K.mountain([[0, 600], [300, 460], [620, 560], [980, 420], [1300, 540], [1800, 470], [1800, 700], [0, 700]], ['#f0f4ff', '#c8d0f0', '#9aa0d0', '#6a6aa0'], 0.2);
      for (let i = 0; i < 8; i++) K.tree(60 + i * 240, 760, K.R(380, 560), { leaves: ['#e8f4f0', '#a0c0c0', '#5a7a8a', '#2a3a5a'], n: 5 });
      K.river([[0, 820], [700, 790], [1300, 810], [1800, 780]], 120, ['#ffffff', '#d8e8ff', '#a0b8e0', '#6a7ab0']);
      K.fill(K.path([[0, 1200], [0, 870], [800, 850], [1800, 860], [1800, 1200]]), K.lin(0, 850, 0, H, ['#e8f0e0', '#a8c0a0', '#5a7a6a', '#2a3a3a']));
      // dewy barley
      K.overlay((pen) => { for (let k = 0; k < 160; k++) { const x = K.R(0, W), y = K.R(980, 1200); pen.line([[x, y], [x + K.R(-10, 10), y - K.R(40, 90)]], { w: 3, color: K.pick(['#d0e0a0', '#a0b080', '#ffffff']), taper: 1 }); } for (let k = 0; k < 90; k++) pen.dab(K.R(0, W), K.R(940, 1180), 3, '#ffffff', 0.9); });
      // Lakshmana ahead with the water pot
      K.figure({ x: 1430, y: 930, h: 380, skin: ['#ffe0b0', '#f0a870', '#b0605a', '#4a1a3a'], head: 'jata', ascetic: true, earrings: false, hairColors: ['#3a2a2a', '#22161a', '#120a0e', '#060306'], cloth: K.RS.bark, scarf: K.RS.bark, turn: 0.5, pose: { legs: 'walk', armL: K.poses.rest, armR: [0.6, -1.6] }, face: { eyes: 'open', mouth: 'calm', gaze: [0.8, 0] } });
      // Rama's shawl around Sita against the cold
      K.rama({ x: 640, y: 1150, h: 820, turn: 0.3, look: 'forest', pose: { legs: 'walk', armL: K.poses.rest, armR: [0.75, -0.6] }, face: { gaze: [0.7, 0.1] } });
      K.sita({ x: 880, y: 1150, h: 740, turn: 0.2, look: 'forest', saree: ['#fff6e8', '#f0d8b0', '#c09a7a', '#6a4a3a'], pose: { legs: 'walk', armL: K.poses.chest, armR: K.poses.chest }, face: { eyes: 'soft', mouth: 'smile', gaze: [-0.6, -0.2] } });
      // drifting mist
      for (let k = 0; k < 9; k++) K.fill(K.ell(K.R(0, W), K.R(700, 1000), K.R(200, 420), K.R(30, 60)), 'rgba(255,255,255,0.35)');
    },
  };
})();
