// Yuddha Kanda — the great battle before the gates of Lanka. The vanaras charge with trees and boulders, the rakshasas
// pour out with spears and chariots, and above them all Rama stands on the ridge, his bow sounding like thunder.
(function () {
  RP.events['16-the-war-of-lanka'] = {
    title: 'The War of Lanka',
    W: 1800, H: 1200, seed: 2424,
    layers: RP.eventLayers,
    accents: ['#fff3a0', '#ffd23a', '#ff3a1a', '#ffffff', '#8a3aff'],
    flow: RP.flows.radial(560, 520, 0.12),
    turbulence: 0.7,
    draw(K) {
      const { W, H } = K;
      const ink = '#12061c';
      K.bg(K.rad(560, 520, 20, 1500, ['#ffffff', '#fff3a0', '#ffb02a', '#ff4a1a', '#a0103a', '#2a0630']));
      K.fill(K.ell(560, 520, 300, 300), K.rad(560, 520, 10, 300, ['#ffffff', '#fffbe0', '#ffe48a', '#ffb04a']));
      for (let i = 0; i < 6; i++) K.blob(K.R(900, 1800), K.R(100, 500), K.R(150, 260), '#5a0a3a', 0.45);
      // Lanka's towers on the far ridge
      for (let i = 0; i < 12; i++) { const x = 1150 + i * 58, h = K.R(80, 220); K.fill(K.path([[x - 24, 860], [x - 22, 860 - h], [x, 860 - h - 50], [x + 22, 860 - h], [x + 24, 860]]), '#3a0a2a'); }
      // the plain and the ridge
      K.fill(K.poly([[0, 860], [W, 840], [W, H], [0, H]]), K.lin(0, 840, 0, H, ['#5a1a2a', '#2a0a1a', ink]));
      K.fill(K.path([[-40, 1200], [-40, 930], [300, 880], [620, 900], [900, 1000], [1000, 1200]]), ink);
      // the clash: vanaras from the left, rakshasas from the right
      for (let k = 0; k < 16; k++) { const x = 760 + k * 34 + K.R(-10, 10), y = 1060 + K.R(-30, 40); K.sil.warrior(x, y, K.R(150, 200), { ink, kind: 'vanara', weapon: K.pick(['mace', 'tree', 'rock']), dir: 1 }); }
      for (let k = 0; k < 14; k++) { const x = 1300 + k * 38 + K.R(-10, 10), y = 1040 + K.R(-30, 40); K.sil.warrior(x, y, K.R(150, 200), { ink, kind: 'rakshasa', weapon: 'spear', dir: -1 }); }
      K.sil.horse(1650, 960, 180, { ink, dir: -1 }); K.sil.chariot(1760, 960, 150, { ink, dir: -1 });
      // Rama on the ridge, the sun behind his drawn bow
      const r = K.sil.archer(520, 890, 700, { ink, rim: '#fff3a0' });
      K.overlay((pen) => {
        // a volley of arrows streaking from his bow into the rakshasa ranks
        for (let k = 0; k < 34; k++) { const t = K.R(0.15, 1), tx = K.R(1250, 1800), ty = K.R(860, 1080), sx = r.tip[0] + 40, sy = r.tip[1]; const x = sx + (tx - sx) * t, y = sy + (ty - sy) * t * t; const a = Math.atan2((ty - sy) * 2 * t, tx - sx); pen.line([[x - Math.cos(a) * 60, y - Math.sin(a) * 60], [x, y]], { w: 4, color: '#fff3c0', alpha: 0.9, taper: 0.1 }); }
        for (let k = 0; k < 30; k++) pen.dab(K.R(0, W), K.R(0, 800), K.R(3, 6), K.pick(['#fff3a0', '#ffb02a', '#ff5a1a']), 0.8);
      });
    },
  };
})();
