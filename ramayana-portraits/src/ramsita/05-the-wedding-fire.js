// Bala Kanda (sarga 73) — Janaka places Sita's hand in Rama's: "This is my daughter Sita, who will follow you in dharma.
// Take her hand in yours." They walk around the sacred fire as the gods shower flowers and the drums of heaven sound.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['05-the-wedding-fire'] = {
    title: 'The Wedding by the Sacred Fire', W: 1800, H: 1200, seed: 5105, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff3a1a', '#ffffff', '#ff8ac0', '#8a5aff'],
    flow: RP.flows.radial(900, 760, 0.1), turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(900, 760, 30, 1400, ['#fffbe0', '#ffd23a', '#ff7a2a', '#c0204a', '#3a0a4a']));
      // the wedding canopy
      for (const x of [260, 1540]) K.fill(K.poly([[x - 26, 1200], [x - 26, 180], [x + 26, 180], [x + 26, 1200]]), K.split(x - 26, 0, x + 26, 0, ['#fff3a0', '#ffc22a', '#c0701a', '#5a2010']));
      K.fill(K.path([[180, 220], [900, 80], [1620, 220], [1620, 280], [900, 160], [180, 280]]), K.split(180, 0, 1620, 0, ['#ff6a4a', '#e8182a', '#9a0a3a', '#4a0a3a']));
      K.fill(K.poly([[0, 1060], [W, 1060], [W, H], [0, H]]), K.lin(0, 1060, 0, H, ['#ffd890', '#c87a4a', '#5a1a2a']));
      K.altar(900, 1110, 90);
      // Rama and Sita circling the fire, hands joined
      const r = K.rama({ x: 640, y: 1130, h: 860, turn: 0.35, look: 'groom', pose: { legs: 'walk', armL: K.poses.rest, armR: [0.75, 0.4] } });
      const s = K.sita({ x: 1150, y: 1130, h: 800, turn: -0.35, look: 'bride', pose: { legs: 'walk', armL: [0.8, 0.4], armR: K.poses.chest }, face: { eyes: 'down' } });
      // the knot of their garments
      K.overlay((pen) => { pen.line([r.T(0.1, -0.55), [900, 760], s.T(-0.1, -0.55)], { w: 10, color: '#fff3a0', taper: 0 }); });
      K.petals(200, [0, 0, W, 900], ['#ff2a5a', '#ffd23a', '#ffffff', '#ff8a1a']);
      K.sparks(60, [780, 700, 1020, 1060]);
    },
  };
})();
