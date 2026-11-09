// Bala Kanda (sarga 67) — in Janaka's hall, before the assembled kings, Rama lifts the great bow of Shiva, strings it and
// breaks it in the middle with a sound like thunder; Sita, watching, knows her vow is fulfilled.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['03-sita-watches-the-bow'] = {
    title: 'Sita Watches Rama Break the Bow', W: 1800, H: 1200, seed: 5103, layers: RP.eventLayers,
    accents: ['#ffffff', '#ffd23a', '#3ad0ff', '#ff3a6a', '#8a5aff'],
    flow: RP.flows.radial(1250, 300, 0.15), turbulence: 0.7,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(1250, 300, 30, 1500, ['#ffffff', '#c8f0ff', '#5a9aff', '#5a2ab0', '#2a0a4a']));
      for (const x of [700, 1750]) K.fill(K.poly([[x - 40, 1200], [x - 40, 0], [x + 40, 0], [x + 40, 1200]]), K.split(x - 40, 0, x + 40, 0, ['#ffe8a0', '#d0904a', '#8a3a2a', '#3a0a1a']));
      K.fill(K.poly([[0, 1050], [W, 1050], [W, H], [0, H]]), K.lin(0, 1050, 0, H, ['#c08a5a', '#6a3a2a', '#2a0a1a']));
      // Rama in the distance, the bow snapping above his head
      const r = K.rama({ x: 1240, y: 1040, h: 600, turn: 0.1, look: 'prince', pose: { legs: 'stride', armL: [2.7, 0.15], armR: [2.7, 0.15] }, face: { mouth: 'calm', gaze: [0, -0.4] } });
      K.overlay((pen) => {
        const [a, b] = [r.handL, r.handR]; const m = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 30];
        pen.line([[a[0] - 160, a[1] + 60], a, [m[0] - 10, m[1]]], { w: 18, color: '#6a240c', taper: 0.3 }); pen.line([[m[0] + 10, m[1]], b, [b[0] + 160, b[1] + 60]], { w: 18, color: '#6a240c', taper: 0.3 });
        for (let k = 0; k < 28; k++) { const g = k / 28 * 6.283; pen.line([m, [m[0] + Math.cos(g) * K.R(60, 200), m[1] + Math.sin(g) * K.R(60, 200)]], { w: K.R(3, 8), color: K.pick(['#ffffff', '#fff3a0', '#bff0ff']), taper: 1 }); }
      });
      // Sita in the foreground holding the varamala, radiant with joy
      const s = K.sita({ x: 420, y: 1250, h: 1250, turn: 0.35, look: 'bride', pose: { legs: 'hidden', armL: K.poses.lap, armR: K.poses.lap }, face: { eyes: 'open', mouth: 'smile', gaze: [0.8, -0.3] } });
      K.overlay((pen) => { const a = s.handL, b = s.handR; const pts = RP.sampleCurve([a, [(a[0] + b[0]) / 2 - 30, Math.max(a[1], b[1]) + 120], b], 10); pts.forEach((p, i) => pen.dab(p[0], p[1], 14, ['#ff2a5a', '#ffffff', '#ffd23a'][i % 3])); });
      K.sparks(60, [900, 100, 1600, 700], ['#ffffff', '#fff3a0', '#bff0ff']);
    },
  };
})();
