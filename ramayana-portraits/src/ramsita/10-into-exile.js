// Ayodhya Kanda (sargas 37–40) — Sita puts on the bark garment over her silk, and with Rama and Lakshmana leaves Ayodhya
// in Sumantra's chariot as the weeping citizens run behind.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['10-into-exile'] = {
    title: 'Leaving Ayodhya for the Forest', W: 1800, H: 1200, seed: 5110, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff8a3a', '#ffffff', '#3ad0a0', '#8a5aff'],
    flow: (x, y, n) => 0.05 + n(x * 0.002, y * 0.002) * 1.2, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, 0, ['#ffd8a0', '#ffb07a', '#c8709a', '#5a3aa0', '#2a1a5a']));
      for (let i = 0; i < 6; i++) K.palace(80 + i * 140, 760, 120, K.R(160, 300), { roof: i % 2 ? 'dome' : 'shikhara', colors: ['#ffffff', '#fff0d8', '#d8a8c8', '#7a4a8a'], window: '#7a2a5a', focus: 0.3 });
      for (let i = 0; i < 5; i++) K.tree(1150 + i * 150, 780, K.R(260, 380), { leaves: ['#5ac07a', '#2a8a5a', '#0a5a4a', '#0a2a3a'], n: 5 });
      K.fill(K.poly([[0, 760], [W, 740], [W, H], [0, H]]), K.lin(0, 740, 0, H, ['#e8c88a', '#b0804a', '#5a3a2a']));
      K.crowd(-20, 640, 1180, 3, { scale: 1.0, raised: 0.7, colors: ['#ffffff', '#ffd23a', '#ff8a1a', '#ff5a8a'] });
      // the three walking, Sita between the brothers
      K.figure({ x: 1580, y: 1130, h: 720, skin: ['#ffe0b0', '#f0a870', '#b0605a', '#4a1a3a'], head: 'jata', ascetic: true, earrings: false, hairColors: ['#3a2a2a', '#22161a', '#120a0e', '#060306'], cloth: RP_BARK(), scarf: RP_BARK(), turn: 0.35, pose: { legs: 'walk', armL: K.poses.rest, armR: [0.3, 0.2] }, face: { eyes: 'soft', mouth: 'calm', gaze: [0.8, 0] } });
      K.sita({ x: 1260, y: 1140, h: 720, turn: -0.3, look: 'forest', pose: { legs: 'walk', armL: K.poses.chest, armR: K.poses.rest }, face: { eyes: 'soft', mouth: 'calm', gaze: [-0.9, 0.1] } });
      K.rama({ x: 960, y: 1150, h: 800, turn: 0.35, look: 'forest', pose: { legs: 'walk', armL: [0.3, 0.1], armR: [0.3, 0.1] }, face: { mouth: 'calm' } });
      function RP_BARK() { return ['#f0b860', '#c07a3a', '#7a3a2a', '#2a0a1a']; }
    },
  };
})();
