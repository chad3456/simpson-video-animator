// Ayodhya Kanda (sarga 112) — as night falls Anasuya sends Sita back to Rama wearing her gifts: "Look, the birds have
// gone to their nests, the moon rises wrapped in moonlight. Go, and shine before Rama in these ornaments."
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['18-adorned-at-dusk'] = {
    title: 'Sita Returns Adorned at Dusk', W: 1800, H: 1200, seed: 5118, layers: RP.eventLayers,
    accents: ['#ffffff', '#ffd23a', '#c8d0ff', '#ff8ac0', '#8a5aff'],
    flow: (x, y, n) => 0.1 + n(x * 0.002, y * 0.002) * 1.2, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#1a1a6a', '#5a3ab0', '#c06ab0', '#ffb08a', '#5a7a5a']));
      K.moon(1500, 260, 100);
      for (let i = 0; i < 40; i++) K.blob(K.R(0, W), K.R(0, 500), K.R(2, 5), '#ffffff', 1);
      for (let i = 0; i < 7; i++) K.tree(80 + i * 270, 880, K.R(320, 480), { leaves: ['#5a8ab0', '#2a5a7a', '#14304a', '#06142a'], n: 5 });
      K.fill(K.poly([[0, 860], [W, 840], [W, H], [0, H]]), K.lin(0, 840, 0, H, ['#6a8a6a', '#3a5a4a', '#14202a']));
      // fireflies
      K.overlay((pen) => { for (let k = 0; k < 70; k++) pen.dab(K.R(0, W), K.R(500, 1150), K.R(3, 6), '#fff6a0', 0.9); });
      // Rama rises to meet her; she glows in Anasuya's garments
      K.rama({ x: 640, y: 1130, h: 820, turn: 0.35, look: 'forest', pose: { armL: K.poses.rest, armR: [0.9, 0.5] }, face: { gaze: [0.8, 0] } });
      K.blob(1000, 800, 300, '#fff0c0', 0.5);
      K.sita({ x: 1000, y: 1140, h: 780, turn: -0.35, look: 'princess', saree: ['#fffbe0', '#ffe08a', '#e0a03a', '#7a4a1a'], pose: { legs: 'walk', armL: [0.7, 0.4], armR: K.poses.chest }, face: { eyes: 'soft', mouth: 'smile' } });
    },
  };
})();
