// Aranya Kanda — life at Panchavati, where Rama "passed the days happily with Sita". Rama has strung a garland of
// forest flowers, kadamba and jasmine, and offers it to her; she receives it with joined palms.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['25-a-garland-of-forest-flowers'] = {
    title: 'A Garland of Forest Flowers', W: 1200, H: 1800, seed: 5125, layers: RP.eventLayers,
    accents: ['#ffffff', '#ffd23a', '#ff6ab0', '#3ad07a', '#ff8a1a'],
    flow: RP.flows.radial(600, 800, 0.4), turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(600, 800, 40, 1300, ['#fffbe0', '#fff0a0', '#a0f0a0', '#2aa07a', '#0a3a4a']));
      for (let k = 0; k < 14; k++) { const a = K.R(0, 6.28), d = K.R(560, 820); K.blob(600 + Math.cos(a) * d, 800 + Math.sin(a) * d * 1.2, K.R(60, 140), K.pick(['#ff8ac0', '#ffffff', '#ffd23a', '#3ad07a']), 0.6); }
      const r = K.rama({ x: 360, y: 2050, h: 1500, turn: 0.35, look: 'forest', pose: { legs: 'hidden', armL: K.poses.offer, armR: K.poses.offer }, face: { eyes: 'soft', mouth: 'smile', gaze: [0.8, 0.1] } });
      K.sita({ x: 860, y: 2080, h: 1400, turn: -0.35, look: 'forest', pose: { legs: 'hidden', armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'soft', mouth: 'smile', gaze: [-0.8, 0.2] } });
      // the garland swinging between Rama's hands
      K.overlay((pen) => {
        const [ax, ay] = r.handL, [bx, by] = r.handR; const n = 26;
        const pts = Array.from({ length: n }, (_, k) => { const t = k / (n - 1); return [ax + (bx - ax) * t, ay + (by - ay) * t + Math.sin(Math.PI * t) * 160]; });
        pen.line(pts, { w: 4, color: '#2a8a3a', taper: 0 });
        pts.forEach(([x, y], k) => { pen.dab(x, y, 15, k % 3 === 0 ? '#ff8a1a' : k % 3 === 1 ? '#ffffff' : '#ffd23a'); pen.dab(x, y, 6, '#fff6c0'); });
      });
      K.petals(90, [0, 0, W, H], ['#ffffff', '#ffd23a', '#ff8ac0']);
    },
  };
})();
