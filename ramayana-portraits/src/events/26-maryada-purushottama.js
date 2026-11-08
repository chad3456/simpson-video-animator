// Closing image — Rama as Maryada Purushottama, the ideal man: bow in one hand, the other raised to protect, with
// Sita and Lakshmana beside him and Hanuman at his feet, against the rising sun of his dynasty.
(function () {
  RP.events['26-maryada-purushottama'] = {
    title: 'Maryada Purushottama',
    W: 1800, H: 1200, seed: 2626,
    layers: RP.eventLayers,
    accents: ['#ffffff', '#fff3a0', '#ffd23a', '#ff8a3a', '#a07aff'],
    flow: RP.flows.radial(900, 470, 0.0),
    turbulence: 0.4,
    draw(K) {
      const { W, H } = K;
      const ink = '#120a26';
      K.bg(K.rad(900, 470, 20, 1300, ['#ffffff', '#fff6c8', '#ffd23a', '#ff8a2a', '#c0306a', '#3a1a7a']));
      K.fill(K.ell(900, 470, 330, 330), K.rad(900, 470, 10, 330, ['#ffffff', '#fffbe8', '#ffe8a0', '#ffc24a']));
      // hills
      K.fill(K.path([[-40, 1200], [-40, 960], [400, 900], [900, 860], [1400, 900], [1840, 960], [1840, 1200]]), ink);
      K.sil.standing(900, 900, 800, { ink, rim: '#ffffff' });
      // Sita and Lakshmana at either side, Hanuman kneeling at Rama's feet
      K.sil.sita(520, 905, 600, { ink });
      K.sil.standing(1360, 905, 640, { ink, bless: false });
      K.sil.kneel(1120, 905, 300, { ink, dir: -1 });
      K.overlay((pen) => {
        for (let k = 0; k < 64; k++) { const a = k / 64 * 6.283, r0 = 360 + K.R(0, 40), r1 = r0 + K.R(120, 420); pen.line([[900 + Math.cos(a) * r0, 470 + Math.sin(a) * r0], [900 + Math.cos(a) * r1, 470 + Math.sin(a) * r1]], { w: K.R(2, 6), color: K.pick(['#ffffff', '#fff3a0', '#ffd23a']), alpha: 0.6, taper: 1 }); }
        // a crown of light behind Rama's head
        pen.line(RP.sampleCurve([[900 + 70, 900 - 800 * 0.9], [900, 900 - 800 * 0.9 - 70], [900 - 70, 900 - 800 * 0.9], [900, 900 - 800 * 0.9 + 70]], 8, true).concat([[970, 900 - 800 * 0.9]]), { w: 5, color: '#ffffff', alpha: 0.9, taper: 0 });
      });
      K.petals(70, [0, 0, W, 900], ['#ffffff', '#fff3a0', '#ffb0c8']);
    },
  };
})();
