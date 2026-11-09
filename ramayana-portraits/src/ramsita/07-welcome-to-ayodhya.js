// Bala Kanda (sarga 77) — Kausalya, Sumitra and Kaikeyi welcome the new brides into Ayodhya with lamps and blessings;
// the princesses bow to the elders and the gods.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['07-welcome-to-ayodhya'] = {
    title: 'The Brides Welcomed to Ayodhya', W: 1800, H: 1200, seed: 5107, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff3a6a', '#ffffff', '#ff8a1a', '#3ad0a0'],
    flow: RP.flows.radial(900, 400, 0.1), turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#ffe8f0', '#ffd8a0', '#ffb07a', '#e0705a', '#7a2a4a']));
      // the palace gate with mango-leaf torana
      K.fill(K.path([[300, 1200], [300, 380], [600, 160], [900, 90], [1200, 160], [1500, 380], [1500, 1200], [1380, 1200], [1380, 420], [900, 230], [420, 420], [420, 1200]]), K.split(300, 0, 1500, 0, ['#ffffff', '#fff0d8', '#d8a8c8', '#7a4a8a']));
      K.overlay((pen) => { const pts = RP.sampleCurve([[430, 430], [900, 330], [1370, 430]], 14); pts.forEach((p, i) => pen.line([p, [p[0], p[1] + 34]], { w: 12, color: i % 2 ? '#2aa05a' : '#7ad04a', taper: 1 })); });
      K.fill(K.poly([[0, 1080], [W, 1080], [W, H], [0, H]]), K.lin(0, 1080, 0, H, ['#fff0c8', '#e0a070', '#7a3a4a']));
      // Kausalya with the lamp-plate
      K.figure({ x: 1250, y: 1120, h: 760, female: true, skin: ['#ffe0b8', '#f0a070', '#b0505a', '#4a1a3a'], head: 'veil', veil: ['#ffffff', '#f0e8ff', '#c0a8d8', '#5a4a7a'], top: ['#ffffff', '#f0e8ff', '#c0a8d8', '#5a4a7a'], cloth: ['#ffffff', '#f0e8ff', '#c0a8d8', '#5a4a7a'], long: true, turn: -0.35, pose: { armL: [0.9, -1.2], armR: [0.9, -1.2] }, face: { eyes: 'soft', mouth: 'smile', tilak: 'bindi', gaze: [-0.8, 0.2] } });
      K.overlay((pen) => { pen.fill(K.ell(1130, 760, 80, 20), '#ffd23a'); for (const x of [1090, 1130, 1170]) { pen.line([[x, 752], [x, 720]], { w: 10, color: '#fff3a0', taper: 1 }); } });
      // Rama and Sita entering
      K.rama({ x: 520, y: 1140, h: 860, turn: 0.35, look: 'groom', pose: { armL: K.poses.rest, armR: K.poses.anjali } });
      K.sita({ x: 820, y: 1150, h: 800, turn: 0.35, look: 'bride', pose: { armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'down' } });
      K.petals(140, [0, 0, W, 1000], ['#ff3a6a', '#ffd23a', '#ffffff']);
    },
  };
})();
