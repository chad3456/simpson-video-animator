// 09 — Shabari: the old forest devotee who waited a lifetime, offering Rama berries she had tasted to be sure they were sweet.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['09-shabari'] = {
    title: 'Shabari — the Tasted Berries',
    seed: 909,
    accents: ['#ffe04a', '#ffffff', '#ff3a5a', '#3ad0a0', '#8a5aff'],
    flow: (x, y, n) => 1.1 + n(x * 0.003, y * 0.003) * 1.2,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#0a6a4a', '#14a05a', '#1a6a8a', '#0a3a5a']));
      // shafts of light through the forest
      for (let i = 0; i < 5; i++) {
        const x = 150 + i * 230;
        K.fill(K.poly([[x, -20], [x + 90, -20], [x + 380, H], [x + 160, H]]), 'rgba(255,240,150,0.35)');
      }
      K.blob(1050, 180, 300, '#fff4a0', 0.8);
      K.blob(120, 1200, 380, '#2a2a9a', 0.7);
      const F = K.head({ x: 600, y: 620, s: 225, turn: -0.2, tilt: -0.1, female: true, width: 0.7 });
      const T = F.T;
      // white hair pulled into a bun
      const hair = K.path([T(-0.78, 0.0), T(-0.8, -0.7), T(-0.3, -1.12), T(0.35, -1.1), T(0.8, -0.7), T(0.8, 0.1), T(0.95, -0.6), T(1.05, -1.05), T(0.6, -1.3), T(0, -1.32), T(-0.7, -1.15), T(-0.95, -0.6)]);
      K.fill(hair, K.skinGrad(F, ['#ffffff', '#e8e4ff', '#a8b0e0', '#5a5aa0'], -1, 1));
      K.focus(hair, 0.75);
      K.bust(F, { colors: ['#fff0d8', '#e8c8a0', '#8a7aa0', '#3a2a5a'], sw: 1.6, flow: 1.3 });
      K.face(F, {
        skin: ['#f0b070', '#c06a3a', '#6a2a6a', '#2a1036'], glow: '#ffd890', cheek: '#ff6a4a', cheek2: '#3a2a8a',
        eyes: 'soft', brow: 'raised', mouth: 'smile', gaze: [0.4, -0.2], tears: true, lips: '#8a2a3a', lips2: '#b04a4a',
        patches: [[0.4, 0.2, 0.25, '#2a8a8a', 0.4], [-0.4, -0.5, 0.25, '#ffd070', 0.45]],
        contourColor: '#1a0a3a', contourLight: '#ffd040', browInk: '#e8e0f0', browW: 0.04,
      });
      K.wrinkles(F, { color: '#4a1a3a' });
      K.hairFront(F, { part: -0.1, colors: ['#ffffff', '#e0e0ff', '#b0b0e0', '#7a7ab0'], strands: ['#ffffff', '#c8c8ff'] });
      // leaf bowl of berries, held up in both hands
      const bowl = K.path([[330, 1260], [600, 1340], [870, 1260], [820, 1430], [600, 1480], [380, 1430]]);
      K.fill(bowl, K.lin(330, 1260, 870, 1460, ['#7ae05a', '#2aa04a', '#0a5a3a']));
      K.focus(bowl, 0.7);
      for (const side of [-1, 1]) {
        const hand = K.path([[600 + side * 230, 1320], [600 + side * 330, 1260], [600 + side * 360, 1380], [600 + side * 300, 1500], [600 + side * 200, 1480]]);
        K.fill(hand, K.lin(600 + side * 360, 1300, 600 + side * 200, 1480, ['#f0b070', '#c06a3a', '#6a2a6a']));
        K.focus(hand, 0.7);
      }
      K.overlay((pen) => {
        for (let k = 0; k < 34; k++) {
          const x = 600 + K.R(-230, 230), y = 1270 + K.R(-40, 30) - Math.abs(x - 600) * -0.05;
          pen.dab(x, y, K.R(13, 19), K.pick(['#d0102a', '#a00a3a', '#ff3a3a', '#7a0a2a']));
          pen.dab(x - 5, y - 5, 4, '#ffd0d0', 0.9);
        }
        for (const side of [-1, 1]) for (let f = 0; f < 4; f++) pen.line([[600 + side * (235 + f * 18), 1330 - f * 6], [600 + side * (215 + f * 15), 1290 - f * 8]], { w: 14, color: '#d08050', taper: 0.6 });
      });
    },
  };
})();
