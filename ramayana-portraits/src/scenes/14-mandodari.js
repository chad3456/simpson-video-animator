// 14 — Mandodari: queen of golden Lanka, who counselled Ravana to return Sita, watching the sea where the bridge was built.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['14-mandodari'] = {
    title: 'Mandodari — Queen of Golden Lanka',
    seed: 1414,
    accents: ['#ffd23a', '#3ad0ff', '#ffffff', '#ff3a6a', '#14c08a'],
    flow: (x, y, n) => (y > 1000 ? 0.05 : 1.6) + n(x * 0.004, y * 0.004) * 1.2,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#ffd23a', '#ff9a1a', '#e05a2a', '#1a6ad0', '#0a2a8a']));
      // golden towers of Lanka
      for (let i = 0; i < 6; i++) {
        const x = 80 + i * 210, h = K.R(380, 640);
        K.fill(K.path([[x - 60, 1050], [x - 60, 1050 - h * 0.6], [x - 25, 1050 - h * 0.85], [x, 1050 - h], [x + 25, 1050 - h * 0.85], [x + 60, 1050 - h * 0.6], [x + 60, 1050]]), K.pick(['#ffe07a', '#ffb02a', '#ff8a1a']), 0.85);
      }
      const F = K.head({ x: 600, y: 640, s: 222, turn: 0.15, tilt: 0.05, female: true });
      const T = F.T;
      K.hairBack(F, { len: 1.9, w: 0.95 });
      K.bust(F, { colors: ['#ff5a8a', '#e0185a', '#7a0a5a', '#2a0a3a'], sw: 1.65, flow: 1.2 });
      K.face(F, {
        skin: ['#ffe8b0', '#ffaa6a', '#2a8aaa', '#1a2a6a'], glow: '#fff8e0', cheek: '#ff6a5a', cheek2: '#1a5a8a',
        eyes: 'soft', brow: 'sad', mouth: 'calm', gaze: [-0.6, 0.1], tilak: 'bindi', lashes: true,
        patches: [[0.4, 0.3, 0.25, '#3ad0ff', 0.4], [-0.4, -0.5, 0.2, '#fff4a0', 0.45], [-0.3, 0.45, 0.18, '#ff6a8a', 0.4]],
        contourColor: '#0a1a5a', contourLight: '#ffffff',
      });
      K.hairFront(F, { part: 0 });
      K.crown(F, { h: 0.7, bw: 0.76, jewels: ['#3ad0ff', '#e0102a', '#ffffff'], centre: '#3ad0ff' });
      K.earrings(F, { r: 0.12, gem: '#3ad0ff' });
      K.noseRing(F);
      K.necklace([T(-0.45, 1.35), T(-0.25, 1.7), T(0, 1.78), T(0.25, 1.7), T(0.45, 1.35)], { w: 12, gems: ['#3ad0ff', '#e0102a'] });
      K.necklace([T(-0.75, 1.45), T(-0.45, 2.2), T(0, 2.4), T(0.45, 2.2), T(0.75, 1.45)], { w: 14, gems: ['#ffffff', '#14c08a'] });
      K.overlay((pen) => {
        // waves of the sea
        for (let k = 0; k < 40; k++) {
          const x = K.R(0, 1200), y = K.R(1060, 1480);
          if (Math.abs(x - 600) < 330 && y < 1400) continue;
          pen.line([[x - 30, y], [x, y - 10], [x + 30, y]], { w: 6, color: K.pick(['#ffffff', '#8ae0ff', '#ffd23a']), alpha: 0.8 });
        }
      });
    },
  };
})();
