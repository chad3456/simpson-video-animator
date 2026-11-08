// 04 — Hanuman: the devoted messenger, gaze lifted in devotion, mace on his shoulder, the sun he once tried to swallow blazing behind him.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['04-hanuman'] = {
    title: 'Hanuman — Sankat Mochan',
    seed: 404,
    accents: ['#2a6aff', '#14c0a0', '#ffffff', '#ff2a3a', '#ffe04a'],
    flow: RP.flows.radial(600, 520, 0.35),
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(600, 520, 40, 950, ['#ffffff', '#fff27a', '#ffc21a', '#ff6a1a', '#2a7ad8', '#1a3ab0']));
      K.blob(80, 1350, 500, '#14a080', 0.8);
      K.blob(1150, 1300, 460, '#2a2ab0', 0.8);
      const F = K.head({ x: 600, y: 640, s: 230, turn: -0.1, tilt: -0.04, jaw: 0.35, width: 0.78 });
      const T = F.T;
      // fur ruff around the face
      const ruff = K.path([T(-1.15, -0.2), T(-1.0, -0.95), T(0, -1.2), T(1.0, -0.95), T(1.15, -0.2), T(1.2, 0.7), T(0.75, 1.35), T(0, 1.55), T(-0.75, 1.35), T(-1.2, 0.7)]);
      K.fill(ruff, K.skinGrad(F, ['#ffb84a', '#ff7a1a', '#c8301a', '#6a1a3a'], -1.2, 1.2));
      K.focus(ruff, 0.6);
      // gada (mace) over the right shoulder
      const shaft = [[860, 1500], [1000, 900], [1060, 700]];
      K.strokeRef(shaft, 38, '#c0601a');
      const head = K.ell(1080, 610, 130, 150, 0.2);
      K.fill(head, K.rad(1040, 560, 10, 170, ['#fff8c0', '#ffc21a', '#e0701a', '#7a2a10']));
      K.focus(head, 0.75);
      K.bust(F, { colors: ['#ffb05a', '#ff6a1a', '#b02a2a', '#4a1a4a'], sw: 1.95 });
      const skin = ['#ff9a4a', '#e8501a', '#a01a3a', '#4a0a3a'];
      K.face(F, {
        skin, glow: '#ffc06a', cheek: '#ff2a1a', lips: '#7a1a2a', lips2: '#b03a3a',
        eyes: 'soft', brow: 'raised', mouth: 'calm', gaze: [-0.1, -0.7], tilak: 'line', mouthY: 0.68, mouthW: 0.3,
        nose: false, contourColor: '#5a0a3a', contourLight: '#ffffff', eyeSep: 0.29,
        patches: [[-0.3, -0.08, 0.24, '#ffd8a8', 0.75], [0.3, -0.08, 0.24, '#ffc89a', 0.7], [0.0, -0.5, 0.3, '#ffb060', 0.4]],
        extraOverlay: (pen, F) => {
          const T = F.T, s = F.s;
          // broad muzzle line and small monkey nose
          pen.line([T(-0.55, 0.3), T(-0.62, 0.6), T(-0.35, 0.95), T(0, 1.02), T(0.35, 0.95), T(0.62, 0.6), T(0.55, 0.3)], { w: s * 0.025, color: '#7a2a2a', alpha: 0.7 });
          pen.fill(K.ell(...T(-0.04, 0.38), s * 0.12, s * 0.06, F.tilt), '#5a1a2a');
          pen.dab(...T(-0.08, 0.36), s * 0.025, '#ffffff', 0.7);
          pen.line([T(-0.04, 0.44), T(-0.04, 0.6)], { w: s * 0.015, color: '#5a1a2a', alpha: 0.7 });
        },
      });
      // pale muzzle in the reference (drawn after the face fill, under the crisp features)
      K.fill(K.patch(...T(-0.03, 0.62), F.s * 0.5, F.s * 0.4, F.tilt), K.rad(...T(-0.2, 0.5), 10, F.s * 0.6, ['#fff0d0', '#ffc890', '#e07a5a']), 0.95);
      K.crown(F, { h: 0.9, bw: 0.85 });
      K.earrings(F, { r: 0.11 });
      const mala = [T(-0.7, 1.35), T(-0.4, 1.95), T(0, 2.15), T(0.4, 1.95), T(0.7, 1.35)];
      K.necklace(mala, { w: 12, gems: ['#e0102a', '#ffffff'] });
      K.overlay((pen) => {
        // fur wisps radiating like a mane
        for (let k = 0; k < 220; k++) {
          const a = K.R(-Math.PI * 1.05, Math.PI * 0.05);
          const r0 = K.R(0.8, 1.05), r1 = r0 + K.R(0.3, 0.6);
          const p0 = T(Math.cos(a) * r0 * 1.05, Math.sin(a) * r0 * 1.0 + 0.1), p1 = T(Math.cos(a + 0.12) * r1 * 1.08, Math.sin(a + 0.12) * r1 + 0.1);
          pen.line([p0, p1], { w: K.R(6, 15), color: K.pick(['#ffe07a', '#ff9a2a', '#ff5a1a', '#fff4c0', '#c8301a']), alpha: 0.8, taper: 1 });
        }
        // mace ornament bands
        for (const t of [0, 1, 2]) pen.line([[990 + t * 12, 760 - t * 40], [1150 + t * 10, 820 - t * 40]], { w: 10, color: '#7a2a10', alpha: 0.7 });
        pen.dab(1030, 545, 26, '#fffbe0', 0.9);
      });
    },
  };
})();
