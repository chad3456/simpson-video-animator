// Ayodhya Kanda (sarga 46) — midstream in Guha's boat, Sita joins her palms and prays to the Ganga: "Protect the son
// of Dasharatha in the forest; when we return after fourteen years I will worship you with joy."
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['11-prayer-to-the-ganga'] = {
    title: 'Sita Prays to the Ganga', W: 1800, H: 1200, seed: 5111, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff8a3a', '#ffffff', '#3ad0ff', '#8a5aff'],
    flow: (x, y, n) => (y > 700 ? 0.0 : 0.1) + n(x * 0.002, y * 0.002) * 1.1, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#ff9a6a', '#ffc88a', '#fff0c0', '#8ad8ff', '#2a7ad0']));
      K.blob(1450, 520, 170, '#fff6c0', 0.95);
      for (let i = 0; i < 6; i++) K.palm(1100 + i * 120, 680, K.R(200, 300), { lean: K.R(-0.2, 0.2) });
      K.fill(K.poly([[0, 680], [W, 670], [W, H], [0, H]]), K.lin(0, 670, 0, H, ['#fff0c0', '#8ad8ff', '#3a9ae0', '#0a3a8a']));
      K.flow(K.poly([[0, 680], [W, 670], [W, H], [0, H]]), 0.0);
      K.boat(820, 1070, 1100);
      K.figure({ x: 1300, y: 1040, h: 560, skin: ['#e8b080', '#b0703a', '#6a3a2a', '#2a1010'], head: 'long', turn: -0.3, hairColors: ['#2a1a1a', '#1a0a0a', '#0a0404', '#000000'], cloth: ['#ff5a3a', '#e0182a', '#8a0a2a', '#3a0a1a'], pose: { armL: [1.2, 0.2], armR: [1.0, 0.3] }, face: { eyes: 'open', mouth: 'calm' } });
      K.overlay((pen) => pen.line([[1380, 640], [1460, 1180]], { w: 12, color: '#6a3a1a', taper: 0 }));
      K.rama({ x: 520, y: 1290, h: 640, turn: 0.3, look: 'forest', pose: { legs: 'hidden', armL: K.poses.rest, armR: K.poses.lap } });
      K.sita({ x: 820, y: 1275, h: 600, turn: 0.4, look: 'forest', pose: { legs: 'hidden', armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'closed', mouth: 'calm' } });
      K.waves(760, 1200, { n: 140 });
      K.petals(50, [600, 600, 1200, 1000], ['#ffd23a', '#ff8a3a', '#ffffff']);
    },
  };
})();
