// 01 — Mahadeva: "karpura-gauram karunavataram", camphor-white and compassion incarnate. Eyes half-closed in yoga, the
// Ganga springing from his matted locks, the crescent moon in his hair, Vasuki at his throat, Kailash behind.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['01-mahadeva'] = {
    title: 'Mahadeva', seed: 6101,
    accents: ['#ffffff', '#8ad0ff', '#c08aff', '#ffd23a', '#3ad0c0'],
    flow: RP.flows.radial(600, 560, 0.35),
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(600, 520, 40, 1100, ['#e8f4ff', '#8ab8ff', '#5a4ad0', '#2a1a7a', '#0a0a2a']));
      K.blob(130, 1250, 480, '#0a3a6a', 0.9); K.blob(1100, 1300, 460, '#3a0a6a', 0.9);
      // Kailash, far and faint on the horizon
      K.mountain([[0, 1150], [260, 900], [420, 980], [600, 760], [800, 960], [960, 880], [1200, 1100], [1200, 1200], [0, 1200]], ['#e8f0ff', '#9ab0f0', '#5a5ac0', '#2a1a7a'], 0.3);
      const F = K.head({ x: 600, y: 640, s: 215, turn: -0.04, tilt: 0.0, jaw: 0.46 });
      const T = F.T;
      K.hairBack(F, { len: 2.6, w: 1.15, colors: K.SH.hair });
      K.bust(F, { colors: ['#9cc0f0', '#6a90d8', '#3a50b0', '#151a5c'], sw: 1.9 });
      K.shivaJata(F);
      K.face(F, {
        skin: K.SH.skin, glow: '#ffffff', cheek: '#9aa8ff', cheek2: '#3a3aa0', eyes: 'half', gaze: [0, 1], brow: 'calm', mouth: 'calm', browW: 0.055,
        lips: '#5a2a5a', lips2: '#8a4a7a', tilak: 'none', jaw: 0.5, contourColor: '#1a0a5a', contourLight: '#ffffff', noseInk: '#1a1a6a',
        patches: [[0.45, 0.35, 0.3, '#8a5aff', 0.45], [-0.4, -0.5, 0.3, '#ffffff', 0.5], [0.2, 0.9, 0.3, '#5ab0ff', 0.4]],
      });
      K.shivaHead(F, { thirdEye: 'closed', gangaV: -2.15, moonV: -1.45, moonU: 0.5 });
      K.overlay((pen) => {
        // ash bands across the chest and the blue of the throat
        for (let k = 0; k < 3; k++) pen.line([T(-1.2, 2.75 + k * 0.17), T(-0.4, 2.65 + k * 0.17)], { w: 10, color: '#ffffff', alpha: 0.75 });
        for (let k = 0; k < 3; k++) pen.line([T(0.4, 2.65 + k * 0.17), T(1.2, 2.75 + k * 0.17)], { w: 10, color: '#ffffff', alpha: 0.75 });
        pen.fill(K.ell(...T(0, 1.32), 70, 40), K.SH.throat, 0.55);
        for (const v of [0, 1]) { const pts = RP.sampleCurve([T(-0.95 - v * 0.25, 1.5), T(-0.65 - v * 0.25, 2.4 + v * 0.45), T(0, 2.75 + v * 0.55), T(0.65 + v * 0.25, 2.4 + v * 0.45), T(0.95 + v * 0.25, 1.5)], 6); pen.line(pts, { w: 3, color: '#3a1a10', alpha: 0.7, taper: 0 }); pts.forEach((p, i) => i % 2 || K.bead(pen, p[0], p[1], 11)); }
        // Vasuki coiled at the throat, hood raised beside the face
        K.serpent(pen, [T(-1.1, 1.75), T(-0.6, 1.5), T(0, 1.62), T(0.6, 1.5), T(1.0, 1.15), T(1.2, 0.55)], 38, { hood: true, hoodAng: -1.5 });
      });
      K.trishul(1020, 1500, 1300, 0.05, { glow: '#c8f0ff' });
    },
  };
})();
