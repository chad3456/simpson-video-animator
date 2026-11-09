// 05 — Nataraja, Lord of the Dance: within a ring of fire he dances creation and dissolution. Upper right hand: the
// damaru, the drum of creation. Upper left: agni, the fire of dissolution. Front right: abhaya, "do not fear". Front
// left points to the raised foot, the refuge. The right foot crushes Apasmara, the dwarf of ignorance; his locks and
// the Ganga fly out with the whirl of the dance.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['05-nataraja'] = {
    title: 'Nataraja', W: 1200, H: 1800, seed: 6105, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff6a1a', '#ffffff', '#3ad0ff', '#c03aff'],
    flow: RP.flows.swirl(600, 900), turbulence: 0.4,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(600, 880, 40, 1200, ['#fff6c8', '#ffb03a', '#c03a6a', '#3a0a6a', '#06041a']));
      const cx = 600, cy = 900, R = 560;
      // prabha mandala: the ring of fire
      K.overlay((pen) => {
        const ring = []; for (let k = 0; k <= 72; k++) { const a = Math.PI * 0.86 - k / 72 * Math.PI * 1.72; ring.push([cx + Math.cos(a) * R, cy - Math.sin(a) * R]); }
        pen.line(ring, { w: 26, color: '#7a2a10', taper: 0 }); pen.line(ring, { w: 12, color: '#ffd23a', taper: 0 });
        for (let k = 0; k < 40; k++) { const a = Math.PI * 0.86 - k / 39 * Math.PI * 1.72, x = cx + Math.cos(a) * R, y = cy - Math.sin(a) * R; const ox = Math.cos(a), oy = -Math.sin(a); pen.line([[x, y], [x + ox * 40 + oy * 10, y + oy * 40 - ox * 10], [x + ox * 75, y + oy * 75]], { w: 18, color: K.pick(['#ffd23a', '#ff8a1a', '#ff3a1a']), taper: 1 }); }
      });
      // the lotus pedestal
      K.fill(K.ell(600, 1560, 420, 70), K.lin(180, 0, 1020, 0, ['#ffe08a', '#c08a3a', '#6a3a1a', '#2a1008']));
      K.overlay((pen) => { for (let k = 0; k < 11; k++) { const x = 220 + k * 76; pen.fill(K.path([[x - 34, 1560], [x, 1490], [x + 34, 1560]]), '#e8b04a'); pen.line([[x - 34, 1560], [x, 1490], [x + 34, 1560]], { w: 4, color: '#6a3a1a', taper: 0 }); } });
      // Apasmara, face down on the pedestal
      K.figure({ x: 820, y: 1480, h: 300, rot: -Math.PI / 2 + 0.05, skin: ['#8a7ab0', '#5a4a8a', '#2a1a4a', '#0a0414'], head: 'none', cloth: ['#c08a4a', '#8a5a2a', '#4a2a1a', '#1a0a04'], pose: { armL: [1.2, 0.5], armR: [0.6, 1.0] } });
      const h = 1150;
      const r = K.shiva({ x: 600, y: 1500, h, pose: { legs: 'dance', armL: [0.75, 1.55], armR: [1.55, -2.35] }, arms2: [[1.65, 1.15], [1.65, 1.15]], face: { eyes: 'open', mouth: 'smile', gaze: [0, 0.1] }, head2: { thirdEye: 'closed' } });
      // flying locks and the Ganga in them
      const hc = r.hc;
      K.overlay((pen) => {
        for (let k = 0; k < 16; k++) { const sd = k % 2 ? 1 : -1, j = k >> 1; pen.line([[hc[0] + sd * 40, hc[1] - 20 + j * 8], [hc[0] + sd * (160 + j * 20), hc[1] - 60 + j * 16], [hc[0] + sd * (300 + j * 20), hc[1] - 20 + j * 26 + K.R(-20, 20)]], { w: 10, color: K.pick(K.SH.hair), taper: 1 }); pen.dab(hc[0] + sd * (300 + j * 20), hc[1] - 20 + j * 26, 7, K.pick(['#ffffff', '#ffd23a', '#ff6a1a'])); }
        K.damaruPen(pen, r.hands2[0][0], r.hands2[0][1] - 20, 30, 0.4);
      });
      K.flame(r.hands2[1][0], r.hands2[1][1] + 10, 70, 150);
      K.blob(r.hands2[1][0], r.hands2[1][1] - 50, 90, '#ffd23a', 0.7);
      K.sparks(60, [0, 0, W, H]);
    },
  };
})();
