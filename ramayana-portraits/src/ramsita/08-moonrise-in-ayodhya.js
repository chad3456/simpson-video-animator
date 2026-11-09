// Bala Kanda (sarga 77) — for twelve years Rama and Sita live happily in Ayodhya; "her heart dwelt in his, and his in hers".
// A palace terrace at moonrise.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['08-moonrise-in-ayodhya'] = {
    title: 'Moonrise on the Palace Terrace', W: 1200, H: 1800, seed: 5108, layers: RP.eventLayers,
    accents: ['#ffffff', '#c8d0ff', '#ffd23a', '#ff8ac0', '#8a5aff'],
    flow: RP.flows.radial(820, 420, 0.1), turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#0a0a3a', '#2a1a7a', '#6a3ab0', '#d07ac0', '#ffd0a0']));
      for (let i = 0; i < 60; i++) K.blob(K.R(0, W), K.R(0, 900), K.R(2, 5), '#ffffff', 1);
      K.moon(860, 420, 140);
      // the city's domes below
      for (let i = 0; i < 7; i++) K.palace(60 + i * 180, 1340, 130, K.R(120, 260), { roof: 'dome', colors: ['#e8e0ff', '#b8a8e8', '#6a5ab0', '#2a1a5a'], roofColors: ['#fff3a0', '#ffc22a', '#c0701a', '#5a2010'], lit: true, flag: false, focus: 0.35 });
      // the terrace balustrade
      K.fill(K.poly([[0, 1340], [W, 1340], [W, H], [0, H]]), K.lin(0, 1340, 0, H, ['#fff0e0', '#d8b0c8', '#6a4a7a']));
      // Rama and Sita side by side, his arm around her
      K.rama({ x: 480, y: 1760, h: 1350, turn: 0.25, look: 'prince', pose: { armL: K.poses.rest, armR: [0.9, -1.1] }, face: { gaze: [0.6, 0.1] } });
      K.sita({ x: 760, y: 1770, h: 1250, turn: -0.2, look: 'princess', saree: ['#c8e0ff', '#7aa0ff', '#3a4ac0', '#1a1a5a'], pose: { armL: [0.5, -1.4], armR: K.poses.rest }, face: { gaze: [-0.5, -0.2] } });
      K.overlay((pen) => { for (let x = 30; x < W; x += 70) { pen.dab(x, 1352, 9, '#c0601a'); pen.line([[x, 1346], [x, 1324]], { w: 8, color: '#fff3a0', taper: 1 }); } });
      K.petals(60, [0, 0, W, 1300], ['#ffffff', '#ffd0e8', '#c8d0ff']);
    },
  };
})();
