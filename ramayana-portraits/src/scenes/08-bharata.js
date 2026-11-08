// 08 — Bharata: the brother who refused the throne, carrying Rama's sandals on his head back to Ayodhya.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['08-bharata'] = {
    title: 'Bharata — the Sandals on the Throne',
    seed: 808,
    accents: ['#ffd23a', '#ff6a1a', '#3ad0ff', '#ffffff', '#b06aff'],
    flow: (x, y, n) => (y < 700 ? 0.1 : 0.4) + n(x * 0.003, y * 0.003) * 1.4,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#1a1a7a', '#3a2aa0', '#a02a8a', '#ff7a2a', '#ffd23a']));
      // Ayodhya skyline at dusk
      for (let i = 0; i < 7; i++) {
        const x = 60 + i * 180, h = K.R(140, 260);
        K.fill(K.path([[x - 70, 1500], [x - 70, 1150 - h * 0.3], [x - 30, 1150 - h * 0.8], [x, 1150 - h], [x + 30, 1150 - h * 0.8], [x + 70, 1150 - h * 0.3], [x + 70, 1500]]), K.pick(['#5a1a7a', '#3a1a6a', '#7a2a6a']), 0.9);
      }
      K.blob(600, 1350, 500, '#ffb02a', 0.6);
      const F = K.head({ x: 600, y: 600, s: 225, turn: 0.1, tilt: 0.12, jaw: 0.45 });
      const T = F.T;
      K.jata(F, { colors: ['#c0803a', '#7a4a1a', '#3a1a10', '#1a0a08'], strands: ['#ffc070', '#5a2a10', '#e0a050'] });
      K.bust(F, { colors: ['#ffc85a', '#e8702a', '#8a3a3a', '#2a1030'], sw: 1.7 });
      const bark = K.path([T(-2.2, 2.2), T(-0.6, 1.7), T(0.6, 1.7), T(2.2, 2.2), T(2.3, 4.4), T(-2.3, 4.4)]);
      K.fill(bark, K.skinGrad(F, ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], -2.2, 2.2));
      K.focus(bark, 0.45);
      K.flow(bark, Math.PI / 2);
      // Rama's golden padukas on a red cloth in the foreground
      const cloth = K.path([[180, 1500], [260, 1230], [600, 1180], [940, 1230], [1020, 1500]]);
      K.fill(cloth, K.lin(200, 1200, 1000, 1500, ['#ff4a3a', '#e0182a', '#8a0a3a']));
      K.focus(cloth, 0.6);
      for (const side of [-1, 1]) {
        const cx = 600 + side * 120, cy = 1350;
        const pad = K.path([[cx - 58, cy - 40], [cx, cy - 120], [cx + 58, cy - 40], [cx + 50, cy + 90], [cx, cy + 120], [cx - 50, cy + 90]]);
        K.fill(pad, K.lin(cx - 60, cy - 100, cx + 60, cy + 120, ['#fff6b0', '#ffc21a', '#d0701a', '#6a2a10']));
        K.focus(pad, 0.95);
        K.flow(pad, Math.PI / 2);
      }
      K.face(F, {
        skin: ['#ffe08a', '#f08a3a', '#8a3a9a', '#2a1a6a'], glow: '#fff4c0', cheek: '#ff6a3a',
        eyes: 'half', brow: 'sad', mouth: 'calm', gaze: [0, 0.9], tilak: 'vaishnava', tears: true,
        patches: [[0.4, 0.3, 0.25, '#5a6aff', 0.4], [-0.35, 0.5, 0.2, '#ff3a6a', 0.4]],
        contourColor: '#2a0a5a', contourLight: '#ffd040',
      });
      K.necklace([T(-0.6, 1.45), T(-0.4, 2.1), T(0, 2.3), T(0.4, 2.1), T(0.6, 1.45)], { w: 8, color: '#7a2a10', gems: ['#5a1a0a'], gemR: 9, step: 2 });
      K.overlay((pen) => {
        const s = F.s;
        // straps and glints on the padukas
        for (const side of [-1, 1]) {
          const cx = 600 + side * 120, cy = 1350;
          pen.line([[cx - 56, cy - 40], [cx, cy - 118], [cx + 56, cy - 40], [cx + 48, cy + 88], [cx, cy + 118], [cx - 48, cy + 88], [cx - 56, cy - 40]], { w: 7, color: '#7a3010', taper: 0 });
          pen.line([[cx, cy - 70], [cx, cy - 30]], { w: 14, color: '#ffe07a' });
          pen.dab(cx, cy - 78, 16, '#e0102a');
          pen.dab(cx - 4, cy - 82, 5, '#ffffff');
          for (let k = 0; k < 5; k++) pen.dab(cx + K.R(-30, 30), cy + K.R(-20, 80), 4, '#fffbe0', 0.9);
        }
        // marigold petals scattered in offering
        for (let k = 0; k < 30; k++) pen.dab(K.R(220, 980), K.R(1240, 1480), K.R(7, 12), K.pick(['#ff9a1a', '#ffd23a', '#ff5a1a']));
        // lamps along the city wall
        for (let i = 0; i < 9; i++) pen.dab(70 + i * 135, 1190 + (i % 2) * 30, 9, '#fff6a0');
      });
    },
  };
})();
