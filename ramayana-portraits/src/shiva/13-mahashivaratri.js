// 13 — Mahashivaratri: the great night of Shiva. In a mountain shrine the lingam is bathed in milk and covered in bilva
// leaves; lamps burn through the night, bells ring, and devotees keep vigil until dawn.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['13-mahashivaratri'] = {
    title: 'Mahashivaratri', W: 1800, H: 1200, seed: 6113, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff8a1a', '#ffffff', '#3ad07a', '#8a5aff'],
    flow: RP.flows.radial(900, 700, 0.2), turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(900, 700, 40, 1200, ['#ffe8a0', '#ff9a3a', '#a03a5a', '#2a0a4a', '#06041a']));
      // the shrine arch
      K.fill(K.path([[380, 1200], [380, 420], [520, 180], [900, 80], [1280, 180], [1420, 420], [1420, 1200], [1300, 1200], [1300, 450], [1200, 290], [900, 210], [600, 290], [500, 450], [500, 1200]]), K.split(380, 0, 1420, 0, ['#a07ab0', '#5a3a7a', '#2a1a4a', '#0a0414']));
      K.overlay((pen) => { for (let k = 0; k < 9; k++) pen.dab(520 + k * 95, 300 - Math.sin(k / 8 * Math.PI) * 80, 10, '#ffd23a'); });
      // hanging bell and lamp chains
      K.overlay((pen) => { pen.line([[900, 210], [900, 380]], { w: 4, color: '#c8a050', taper: 0 }); pen.fill(K.path([[870, 430], [880, 390], [920, 390], [930, 430]]), '#ffc22a'); pen.dab(900, 436, 8, '#8a5a1a'); });
      K.blob(900, 760, 420, '#fff0a0', 0.55);
      K.fill(K.poly([[500, 960], [1300, 960], [1300, 1200], [500, 1200]]), K.lin(0, 960, 0, 1200, ['#8a6a5a', '#4a2a2a', '#1a0a10']));
      K.lingam(900, 960, 420, { serpent: true });
      // the milk abhisheka pouring from a copper vessel above
      K.overlay((pen) => {
        pen.line([[900, 300], [900, 450]], { w: 3, color: '#c8a050', taper: 0 }); pen.fill(K.path([[875, 450], [925, 450], [915, 470], [955, 500], [950, 540], [900, 562], [850, 540], [845, 500], [885, 470]]), '#c86a3a'); pen.line([[860, 500], [870, 535]], { w: 6, color: '#ffc08a', alpha: 0.8, taper: 1 }); pen.line([[870, 452], [930, 452]], { w: 8, color: '#a04a2a', taper: 0 });
        pen.line([[900, 560], [905, 620], [902, 680]], { w: 10, color: '#ffffff', alpha: 0.9, taper: 0 });
        for (let k = 0; k < 10; k++) pen.dab(900 + K.R(-60, 60), 700 + K.R(0, 30), 5, '#ffffff');
      });
      // lamps along the floor
      for (let k = 0; k < 9; k++) { const x = 180 + k * 180; if (x > 560 && x < 1240) continue; K.flame(x, 1100, 22, 60); K.blob(x, 1080, 50, '#ffd23a', 0.6); K.overlay((pen) => pen.fill(K.ell(x, 1108, 26, 9), '#c0703a')); }
      for (const x of [620, 1180]) { K.flame(x, 1060, 26, 70); K.blob(x, 1040, 60, '#ffd23a', 0.6); K.overlay((pen) => pen.fill(K.ell(x, 1068, 30, 10), '#c0703a')); }
      // devotees in silhouette, keeping vigil
      for (const [x, h, sd] of [[140, 360, 1], [260, 320, 1], [1560, 340, -1], [1680, 380, -1]]) K.figure({ x, y: 1230, h, turn: 0.4 * sd, skin: ['#2a1a3a', '#1a0a2a', '#0a0414', '#000000'], head: 'veil', veil: ['#3a1a3a', '#2a0a2a', '#140414', '#000000'], cloth: ['#2a1a3a', '#1a0a2a', '#0a0414', '#000000'], long: true, female: x < 200 || x > 1600, pose: { legs: 'hidden', armL: K.poses.anjali, armR: K.poses.anjali } });
      K.sparks(50, [400, 200, 1400, 1000], ['#fff6a0', '#ffd23a']);
    },
  };
})();
