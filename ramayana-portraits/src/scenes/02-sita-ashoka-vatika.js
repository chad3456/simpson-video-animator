// 02 — Sita in the Ashoka grove: captive in Lanka, eyes lowered, a single tear, red ashoka blossoms all around.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['02-sita-ashoka-vatika'] = {
    title: 'Sita in the Ashoka Grove',
    seed: 202,
    accents: ['#ff3a2a', '#ffb02a', '#3ad0a0', '#ffffff', '#ff6ab0'],
    flow: (x, y, n) => n(x * 0.003, y * 0.003) * 3 + 0.4,
    turbulence: 1.0,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#0e6a5a', '#0a4a4a', '#123a6a', '#0a5a3a', '#064030']));
      K.blob(1000, 180, 260, '#cfe8ff', 0.85); // moon glow
      K.blob(1000, 180, 110, '#ffffff', 1);
      for (let i = 0; i < 26; i++) {
        const x = K.R(0, W), y = K.R(0, H);
        if (Math.hypot(x - 600, y - 700) < 380) continue;
        K.blob(x, y, K.R(50, 120), K.pick(['#ff2a1a', '#ff7a1a', '#e0102a', '#ffb02a']), 0.95);
        K.blob(x + K.R(-60, 60), y + K.R(-60, 60), K.R(60, 120), K.pick(['#1a8a4a', '#2ac07a', '#0a5a3a']), 0.7);
      }
      const F = K.head({ x: 610, y: 640, s: 228, turn: 0.18, tilt: 0.1, female: true });
      const T = F.T;
      // saree pallu over the head, falling behind
      const veil = K.path([T(-0.95, -0.4), T(-0.75, -1.05), T(0, -1.32), T(0.75, -1.05), T(0.98, -0.4), T(1.15, 0.8), T(1.5, 2.2), T(-1.5, 2.2), T(-1.1, 0.8)]);
      K.fill(veil, K.skinGrad(F, ['#ff4a3a', '#e0182a', '#9a0a3a', '#4a0a3a'], -1.3, 1.3));
      K.focus(veil, 0.5);
      K.flow(veil, Math.PI / 2 + 0.1);
      K.hairBack(F, { len: 1.2, w: 0.85, colors: ['#3a2a6a', '#22184a', '#120a2a', '#0a0618'] });
      const skin = ['#ffe2a8', '#ffa45a', '#c8466a', '#5a2a7a'];
      K.bust(F, { colors: ['#ff5a3a', '#e01a2a', '#a00a40', '#4a0a3a'], sw: 1.6, flow: 1.2 });
      // gold zari border of the pallu across the chest
      const zari = K.path([T(-1.25, 1.35), T(-1.0, 1.25), T(0.9, 3.2), T(0.55, 3.4)]);
      K.fill(zari, K.lin(...T(-1, 1.3), ...T(0.8, 3.3), ['#fff3a0', '#ffc21a', '#e07a1a']));
      K.focus(zari, 0.6);
      K.flow(zari, 0.85);
      K.face(F, {
        skin, glow: '#fff4d0', cheek: '#ff6a5a', lips: '#b01a3a', lips2: '#e84a5a',
        eyes: 'down', brow: 'sad', mouth: 'sad', tilak: 'bindi', tears: true, gaze: [0.2, 0.6], lashes: true,
        patches: [[0.45, 0.25, 0.25, '#e05aa0', 0.4], [-0.4, -0.55, 0.25, '#fff6c0', 0.45], [0.35, -0.5, 0.2, '#ff8a3a', 0.4]],
        contourColor: '#5a0a5a', contourLight: '#ffffff',
      });
      K.hairFront(F, { part: 0.05, colors: ['#4a3a8a', '#2a1a5a', '#140a30', '#0a0618'] });
      // front edge of the veil with gold zari border
      const edge = [T(-0.9, -0.2), T(-0.78, -0.85), T(0, -1.18), T(0.78, -0.85), T(0.92, -0.2)];
      const front = K.path(edge.concat([T(0.98, -0.4), T(0.75, -1.05), T(0, -1.32), T(-0.75, -1.05), T(-0.95, -0.4)]));
      K.fill(front, '#e0182a');
      K.focus(front, 0.8);
      K.overlay((pen) => {
        pen.line(edge, { w: F.s * 0.07, color: '#ffc22a', taper: 0.3 });
        pen.line(edge.map((p) => [p[0], p[1] - 6]), { w: F.s * 0.02, color: '#fff3b0', taper: 0.3 });
      });
      K.earrings(F, { r: 0.08, gem: '#14a05a' });
      K.noseRing(F);
      K.necklace([T(-0.45, 1.35), T(-0.25, 1.7), T(0, 1.78), T(0.25, 1.7), T(0.45, 1.35)], { w: 10, gems: ['#14a05a', '#e0102a'] });
    },
  };
})();
