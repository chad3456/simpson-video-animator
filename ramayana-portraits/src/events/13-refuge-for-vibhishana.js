// Yuddha Kanda (sargas 17–18) — Ravana's brother Vibhishana flies across the sea with four companions and asks for
// refuge. The vanaras suspect a spy; Rama answers with his vow: whoever comes to him even once, saying "I am yours",
// he protects from all beings.
(function () {
  RP.events['13-refuge-for-vibhishana'] = {
    title: 'Rama Grants Refuge to Vibhishana',
    W: 1800, H: 1200, seed: 2323,
    layers: RP.eventLayers,
    accents: ['#fff3a0', '#ffd23a', '#ff6a3a', '#ffffff', '#8a5aff'],
    flow: RP.flows.radial(1000, 640, 0.1),
    turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      const ink = '#140a24';
      K.bg(K.lin(0, 0, 0, H, ['#2a1a6a', '#8a2a7a', '#ff5a3a', '#ffb04a', '#fff0a0']));
      K.fill(K.ell(1000, 700, 330, 330), K.rad(1000, 700, 10, 330, ['#ffffff', '#fff6c0', '#ffd23a', '#ff8a2a']));
      K.blob(1000, 700, 520, '#ffb04a', 0.35);
      // the sea, burning gold under the setting sun
      K.fill(K.poly([[0, 760], [W, 760], [W, H], [0, H]]), K.lin(0, 760, 0, H, ['#ffd23a', '#ff7a3a', '#8a2a6a', '#2a0a3a']));
      K.flow(K.poly([[0, 760], [W, 760], [W, H], [0, H]]), 0.0);
      // the shore rocks
      const shore = K.path([[0, 1200], [0, 960], [400, 930], [800, 960], [1150, 900], [1500, 940], [1800, 980], [1800, 1200]]);
      K.fill(shore, ink); K.focus(shore, 0.9);
      // Rama standing with bow, palm raised in protection
      K.sil.standing(1260, 925, 660, { ink, rim: '#fff6c0' });
      // Vibhishana kneeling before him, palms joined, his crown at his feet
      const P = (u, v) => [930 + u * 420, 925 - v * 420];
      const f = (p) => { K.fill(p, ink); K.focus(p, 0.95); };
      f(K.path([P(-0.24, 0.0), P(0.2, 0.0), P(0.18, 0.18), P(0.06, 0.24), P(0.12, 0.52), P(0.04, 0.66), P(-0.1, 0.62), P(-0.14, 0.4), P(-0.06, 0.22), P(-0.22, 0.16)]));
      f(K.ell(...P(0.06, 0.74), 0.065 * 420, 0.08 * 420));
      f(K.limbPath(P(0.06, 0.6), P(0.22, 0.54), 15, 12)); f(K.limbPath(P(0.22, 0.54), P(0.22, 0.7), 12, 9));
      f(K.path([P(0.3, 0.0), P(0.32, 0.12), P(0.36, 0.2), P(0.4, 0.12), P(0.42, 0.0)]));
      // Sugriva, Hanuman and the vanaras watching warily
      K.sil.warrior(260, 960, 330, { ink, kind: 'vanara', weapon: 'mace', stride: 0.4, lean: 0.05 });
      K.sil.warrior(420, 950, 300, { ink, kind: 'vanara', weapon: 'tree', stride: 0.3, lean: 0.02 });
      K.sil.warrior(110, 980, 280, { ink, kind: 'vanara', weapon: 'rock', stride: 0.5 });
      // his four companions waiting in the sky
      for (let k = 0; k < 4; k++) K.sil.warrior(520 + k * 80, 380 + (k % 2) * 30, 90, { ink: '#3a1a4a', kind: 'rakshasa', weapon: 'spear', stride: 0.2, lean: 0 });
      K.overlay((pen) => {
        for (let k = 0; k < 40; k++) { const a = K.R(0, 6.283), r = K.R(360, 600); pen.line([[1000 + Math.cos(a) * r, 700 + Math.sin(a) * r * 0.8], [1000 + Math.cos(a) * (r + 60), 700 + Math.sin(a) * (r + 60) * 0.8]], { w: 3, color: '#fff6c0', alpha: 0.5, taper: 1 }); }
        for (let k = 0; k < 50; k++) { const y = K.R(780, 900), x = K.R(500, 1500); pen.line([[x - 30, y], [x + 30, y]], { w: 3, color: '#fff6c0', alpha: 0.7, taper: 1 }); }
      });
    },
  };
})();
