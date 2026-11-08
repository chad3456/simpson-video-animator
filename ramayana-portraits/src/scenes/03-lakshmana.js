// 03 — Lakshmana on watch: the younger brother guarding the forest hut at night, bow ready, firelight on his face.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['03-lakshmana'] = {
    title: 'Lakshmana — the Sleepless Guardian',
    seed: 303,
    accents: ['#ff8a1a', '#ffd23a', '#2ad0c0', '#b06aff', '#ffffff'],
    flow: RP.flows.swirl(250, 1100),
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(W, 0, 0, H, ['#1a1a6a', '#3a1a8a', '#24106a', '#4a1a5a']));
      K.blob(80, 1150, 620, '#ff6a10', 0.95); // the watch-fire
      K.blob(60, 1300, 340, '#ffe04a', 1);
      K.blob(1150, 250, 420, '#0a8a8a', 0.8);
      K.blob(1100, 900, 300, '#2a3aa0', 0.7);
      for (let i = 0; i < 40; i++) K.blob(K.R(700, W), K.R(0, 500), K.R(4, 10), '#fff6c0', 1); // stars
      const F = K.head({ x: 590, y: 620, s: 235, turn: 0.25, tilt: 0.02, jaw: 0.4 });
      const T = F.T;
      K.hairBack(F, { len: 1.9, w: 0.95 });
      K.bow(1580, 820, 760, 2.65, 3.65, { w: 24, color: '#4a1a10', light: '#ffc04a' });
      const skin = ['#ffe85a', '#ff9a2a', '#1aa08a', '#1a3a8a'];
      K.bust(F, { colors: ['#ffd84a', '#ff8a2a', '#1a8a7a', '#1a2a6a'], sw: 1.85 });
      const cloth = K.path([T(-2.2, 2.6), T(-1.2, 2.2), T(1.0, 3.0), T(2.3, 3.4), T(2.4, 4.4), T(-2.4, 4.4)]);
      K.fill(cloth, K.lin(...T(-2, 2.5), ...T(2, 4), ['#ff3a6a', '#c01a5a', '#5a1a7a']));
      K.flow(cloth, 0.2);
      K.face(F, {
        skin, glow: '#fff8b0', cheek: '#ff5a2a', cheek2: '#14706a',
        eyes: 'fierce', brow: 'furrow', mouth: 'grim', gaze: [0.7, 0], tilak: 'vaishnava',
        patches: [[0.42, 0.3, 0.28, '#2a8aff', 0.45], [-0.3, 0.55, 0.22, '#ff4a2a', 0.5], [0.15, -0.6, 0.22, '#ffb03a', 0.5]],
        contourColor: '#0a1a5a', contourLight: '#ff3a1a', lips: '#9a2a3a', lips2: '#d0504a',
      });
      K.earrings(F, { r: 0.09 });
      K.crown(F, { h: 0.75, bw: 0.78, jewels: ['#14c0a0', '#e0102a'] });
      K.necklace([T(-0.55, 1.45), T(-0.3, 1.82), T(0, 1.9), T(0.3, 1.82), T(0.55, 1.45)], { w: 11 });
      K.arrow(380, 1480, 700, 1180, { tip: '#e8f8ff', fletch: '#ffd040' });
      K.overlay((pen) => {
        // sparks from the fire
        for (let k = 0; k < 40; k++) {
          const x = K.R(0, 450), y = K.R(700, 1450);
          pen.line([[x, y], [x + K.R(-8, 12), y - K.R(14, 40)]], { w: K.R(2, 5), color: K.pick(['#fff3a0', '#ffb02a', '#ff6a1a']), taper: 1 });
        }
      });
    },
  };
})();
