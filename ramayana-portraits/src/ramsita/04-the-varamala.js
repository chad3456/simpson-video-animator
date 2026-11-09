// The garland of choice (varamala): after the bow is broken, Sita comes forward and places the garland around Rama's neck
// (told most fully in the Ramcharitmanas; Valmiki moves straight to Janaka's consent).
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['04-the-varamala'] = {
    title: 'Sita Garlands Rama', W: 1200, H: 1800, seed: 5104, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff3a6a', '#ffffff', '#ff8a1a', '#3ad0a0'],
    flow: RP.flows.radial(600, 600, 0.2), turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(600, 600, 30, 1300, ['#fffbe0', '#ffe48a', '#ff9a4a', '#e0305a', '#5a0a4a']));
      K.blob(600, 560, 420, '#fff6c0', 0.5);
      K.fill(K.poly([[0, 1560], [W, 1560], [W, H], [0, H]]), K.lin(0, 1560, 0, H, ['#ffd890', '#c87a4a', '#5a1a2a']));
      const r = K.rama({ x: 760, y: 1700, h: 1450, turn: -0.3, look: 'groom', pose: { armL: K.poses.rest, armR: [0.5, 0.2] }, face: { gaze: [-0.7, 0.3] } });
      const s = K.sita({ x: 380, y: 1740, h: 1300, turn: 0.35, look: 'bride', pose: { armL: [1.15, -0.5], armR: [1.2, -0.4] }, face: { eyes: 'down', gaze: [0.5, 0.5] } });
      // the garland, just settling on his shoulders
      K.overlay((pen) => {
        const T = r.T; const pts = RP.sampleCurve([T(-0.11, -0.8), T(-0.08, -0.66), T(0, -0.6), T(0.08, -0.66), T(0.11, -0.8)], 10);
        pts.forEach((p, i) => { pen.dab(p[0], p[1], 20, ['#ff2a5a', '#ffffff', '#ffd23a', '#ff6a1a'][i % 4]); pen.dab(p[0] + 8, p[1] - 8, 11, '#2aa05a', 0.9); });
      });
      K.petals(220, [0, 0, W, 1600], ['#ff2a5a', '#ffd23a', '#ffffff', '#ff8a1a']);
    },
  };
})();
