// 13 — Kaikeyi in the chamber of anger: jewels thrown off, hair unbound, demanding the two boons.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['13-kaikeyi'] = {
    title: 'Kaikeyi — the Two Boons',
    seed: 1313,
    accents: ['#14c08a', '#ffd23a', '#ffffff', '#ff2a4a', '#8a3aff'],
    flow: (x, y, n) => 2.3 + n(x * 0.003, y * 0.003) * 1.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(W, 0, 0, H, ['#e0102a', '#8a0a2a', '#2a0a2a', '#0a3a3a', '#0a6a4a']));
      K.blob(1100, 200, 400, '#ff4a1a', 0.7);
      K.blob(100, 1300, 450, '#0aa070', 0.8);
      const F = K.head({ x: 620, y: 620, s: 228, turn: -0.28, tilt: -0.08, female: true });
      const T = F.T;
      // unbound hair, loose and spreading
      const hair = K.path([T(-0.6, -1.0), T(0.3, -1.15), T(1.0, -0.6), T(1.4, 0.5), T(1.8, 2.0), T(1.2, 3.6), T(-1.4, 3.6), T(-1.9, 2.0), T(-1.4, 0.3), T(-1.1, -0.6)]);
      K.fill(hair, K.skinGrad(F, ['#3a2a7a', '#22164a', '#0e0828', '#06030e'], -1.8, 1.8));
      K.focus(hair, 0.4);
      K.flow(hair, Math.PI / 2 - 0.1);
      K.bust(F, { colors: ['#14a07a', '#0a6a5a', '#0a3a4a', '#061a24'], sw: 1.55, flow: 1.4 });
      K.face(F, {
        skin: ['#ffe0a0', '#ff9a5a', '#a03a7a', '#3a1450'], glow: '#fff4d0', cheek: '#ff4a4a', cheek2: '#4a2a8a',
        eyes: 'fierce', brow: 'angry', mouth: 'grim', gaze: [0.9, 0], tilak: 'bindi', lashes: true,
        patches: [[0.4, 0.3, 0.25, '#14a0a0', 0.4], [-0.4, -0.5, 0.2, '#fff0a0', 0.45]],
        contourColor: '#1a063a', contourLight: '#ffd040', lips: '#8a0a2a', lips2: '#c02a3a',
      });
      K.hairFront(F, { part: -0.15 });
      K.earrings(F, { r: 0.1, gem: '#14c08a' });
      K.noseRing(F);
      K.overlay((pen) => {
        // loose strands across the face
        for (let k = 0; k < 8; k++) pen.line([T(-0.5 + k * 0.05, -0.75), T(-0.75 + k * 0.03, 0.0), T(-0.85 + k * 0.05, 0.8)], { w: 5, color: '#14082a', alpha: 0.75, taper: 1 });
        // thrown-off jewellery on the floor
        for (let k = 0; k < 14; k++) pen.dab(K.R(60, 1140), K.R(1320, 1460), K.R(8, 16), K.pick(['#ffd23a', '#e0102a', '#14c08a', '#ffffff']));
        pen.line([[120, 1400], [260, 1350], [380, 1420]], { w: 9, color: '#ffc22a', taper: 0 });
        pen.line([[800, 1430], [920, 1360], [1060, 1410]], { w: 9, color: '#ffc22a', taper: 0 });
      });
    },
  };
})();
