// 02 — Neelakantha: when the churning of the ocean threw up the halahala poison, Shiva drank it to save the worlds and
// held it in his throat, which turned blue. Here the poison's dark smoke turns to stars around his calm face.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['02-neelakantha'] = {
    title: 'Neelakantha', seed: 6102,
    accents: ['#3a5aff', '#8a3aff', '#3affd0', '#ffffff', '#ffd23a'],
    flow: RP.flows.swirl(600, 900),
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(600, 900, 40, 1200, ['#5a8aff', '#2a2ab0', '#1a0a5a', '#0a0420', '#000000']));
      for (let k = 0; k < 9; k++) { const a = k * 0.7, d = 380 + k * 40; K.blob(600 + Math.cos(a) * d, 900 + Math.sin(a) * d * 0.9, 160, K.pick(['#3a0a6a', '#0a3a5a', '#2a0a3a']), 0.8); }
      K.overlay((pen) => { for (let k = 0; k < 150; k++) pen.dab(K.R(0, W), K.R(0, H), K.R(1.5, 4), K.pick(['#ffffff', '#c8d8ff', '#a0ffe0']), K.R(0.5, 1)); });
      const F = K.head({ x: 600, y: 660, s: 210, turn: 0.06, tilt: -0.04, jaw: 0.5 });
      const T = F.T;
      K.hairBack(F, { len: 2.6, w: 1.15, colors: K.SH.hair });
      K.bust(F, { colors: ['#9cc0f0', '#6a90d8', '#3a50b0', '#151a5c'], sw: 1.9 });
      K.shivaJata(F);
      K.face(F, {
        skin: K.SH.skin, glow: '#e8f4ff', cheek: '#7a8aff', cheek2: '#2a2aa0', eyes: 'closed', brow: 'calm', mouth: 'calm', browW: 0.055,
        lips: '#4a1a5a', lips2: '#7a3a8a', tilak: 'none', contourColor: '#0a0a4a', contourLight: '#ffffff', noseInk: '#1a1a6a',
        patches: [[0.4, 0.35, 0.3, '#5a3aff', 0.5], [-0.4, -0.5, 0.3, '#e8f4ff', 0.5]],
      });
      K.shivaHead(F, { thirdEye: 'closed', gangaV: -2.15, moonV: -1.45, moonU: 0.5 });
      // the throat, blazing blue
      K.blob(...T(0, 1.35), 150, '#3a6aff', 0.9);
      K.overlay((pen) => {
        pen.fill(K.ell(...T(0, 1.32), 80, 50), '#1a2ad0', 0.95);
        pen.fill(K.ell(...T(-0.05, 1.27), 40, 22), '#6a9aff', 0.8);
        // last wisps of the poison, curling up and turning into stars
        for (let k = 0; k < 8; k++) { const sd = k % 2 ? 1 : -1, x0 = T(sd * 0.3, 1.5); const pts = [x0, [x0[0] + sd * K.R(80, 200), x0[1] + K.R(80, 200)], [x0[0] + sd * K.R(250, 420), x0[1] + K.R(-50, 150)], [x0[0] + sd * K.R(350, 520), x0[1] - K.R(150, 450)]]; pen.line(pts, { w: K.R(10, 22), color: K.pick(['#2a0a4a', '#4a1a8a', '#1a1a5a']), alpha: 0.75, taper: 1 }); pen.dab(...pts[3], 6, '#ffffff'); }
        const pts = RP.sampleCurve([T(-0.95, 1.5), T(-0.65, 2.4), T(0, 2.75), T(0.65, 2.4), T(0.95, 1.5)], 6);
        pen.line(pts, { w: 3, color: '#3a1a10', alpha: 0.7, taper: 0 }); pts.forEach((p, i) => i % 2 || K.bead(pen, p[0], p[1], 11));
        K.serpent(pen, [T(1.1, 1.75), T(0.6, 1.55), T(0, 1.7), T(-0.6, 1.55), T(-1.0, 1.15), T(-1.2, 0.55)], 36, { hood: true, hoodAng: -1.6 });
      });
    },
  };
})();
