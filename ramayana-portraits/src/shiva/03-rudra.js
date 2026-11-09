// 03 — Rudra: the fierce form. The third eye opens and its fire, which once burned Kama to ash, blazes across the brow;
// the locks fly loose and the trishul flames behind him.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['03-rudra'] = {
    title: 'Rudra', seed: 6103,
    accents: ['#ffd23a', '#ff3a1a', '#ffffff', '#ff8a1a', '#5a2aff'],
    flow: RP.flows.rising(1.2),
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, H, 0, 0, ['#1a0a2a', '#7a0a2a', '#e0201a', '#ff8a1a', '#ffd23a', '#2a0a3a']));
      for (let k = 0; k < 14; k++) K.flame(K.R(0, W), H + 40, K.R(140, 280), K.R(500, 1100), null, K.R(-80, 80));
      K.trishul(1060, 1500, 1350, 0.08, { glow: '#fff6a0' });
      const F = K.head({ x: 600, y: 680, s: 215, turn: 0, tilt: 0, jaw: 0.52 });
      const T = F.T;
      K.hairBack(F, { len: 2.6, w: 1.3, colors: K.SH.hair });
      K.bust(F, { colors: ['#9cc0f0', '#6a90d8', '#3a50b0', '#151a5c'], sw: 1.95 });
      K.shivaJata(F);
      K.face(F, {
        skin: K.SH.skin, glow: '#fff0d0', cheek: '#8a7aff', cheek2: '#3a2aa0', eyes: 'fierce', brow: 'furrow', mouth: 'grim', browW: 0.06, gaze: [0, 0],
        lips: '#4a1a3a', lips2: '#8a2a4a', tilak: 'none', contourColor: '#1a0a2a', contourLight: '#ffd23a', noseInk: '#1a0a3a',
      });
      K.blob(...T(0, -0.47), 70, '#ffb02a', 0.8);
      K.shivaHead(F, { thirdEye: 'fire', gangaV: -2.15, moonV: -1.45, moonU: 0.5 });
      K.overlay((pen) => {
        // flames streaming up from the third eye
        for (let k = 0; k < 12; k++) { const e = T(0, -0.58); pen.line([e, [e[0] + K.R(-30, 30), e[1] - K.R(40, 90)], [e[0] + K.R(-60, 60), e[1] - K.R(100, 200)]], { w: K.R(6, 14), color: K.pick(['#fff6a0', '#ffd23a', '#ff6a1a']), taper: 1 }); }
        // wild loose locks
        for (let k = 0; k < 14; k++) { const sd = k % 2 ? 1 : -1, v = -0.6 + (k >> 1) * 0.25; pen.line([T(sd * 0.8, v), T(sd * (1.4 + K.R(0, 0.3)), v - 0.2), T(sd * (2.0 + K.R(0, 0.4)), v - 0.6)], { w: K.R(10, 18), color: K.pick(K.SH.hair), taper: 1 }); }
        pen.fill(K.ell(...T(0, 1.32), 70, 40), K.SH.throat, 0.55);
        const pts = RP.sampleCurve([T(-0.95, 1.5), T(-0.65, 2.4), T(0, 2.75), T(0.65, 2.4), T(0.95, 1.5)], 6);
        pen.line(pts, { w: 3, color: '#3a1a10', alpha: 0.7, taper: 0 }); pts.forEach((p, i) => i % 2 || K.bead(pen, p[0], p[1], 11));
        K.serpent(pen, [T(-1.1, 1.75), T(-0.6, 1.5), T(0, 1.62), T(0.6, 1.5), T(1.0, 1.15), T(1.25, 0.6)], 38, { hood: true, hoodAng: -1.4 });
      });
      K.sparks(120, [0, 0, W, H]);
    },
  };
})();
