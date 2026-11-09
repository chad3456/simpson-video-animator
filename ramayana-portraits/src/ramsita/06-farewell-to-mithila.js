// Bala Kanda (sarga 74) — Janaka gives his daughters countless gifts and the procession leaves Mithila for Ayodhya;
// Sita rides beside Rama, looking back at the city of her childhood.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['06-farewell-to-mithila'] = {
    title: 'Farewell to Mithila', W: 1800, H: 1200, seed: 5106, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff8ac0', '#ffffff', '#3ad0a0', '#8a5aff'],
    flow: (x, y, n) => (y < 700 ? 0.15 : 0.05) + n(x * 0.002, y * 0.002) * 1.2, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#ffb0c8', '#ffd8a0', '#fff6d0', '#c8f0a0', '#5ab06a']));
      K.blob(1500, 300, 200, '#fffbe0', 0.9);
      // Mithila behind
      for (let i = 0; i < 7; i++) K.palace(1150 + i * 95, 720, 80, K.R(90, 180), { roof: i % 2 ? 'dome' : 'shikhara', colors: ['#ffffff', '#ffe8d8', '#d8a8c8', '#7a4a8a'], window: '#7a2a5a', focus: 0.35 });
      K.fill(K.poly([[0, 720], [W, 700], [W, H], [0, H]]), K.lin(0, 700, 0, H, ['#c8e88a', '#7ab04a', '#3a6a3a']));
      K.river([[0, 820], [600, 800], [1200, 830], [1800, 810]], 60);
      // the chariot carrying Rama and Sita
      K.horse(560, 1080, 330, { dir: -1, colors: ['#ffffff', '#f0e8ff', '#b0a8d8', '#4a4a8a'] });
      K.horse(480, 1110, 330, { dir: -1, colors: ['#ffffff', '#f0e8ff', '#b0a8d8', '#4a4a8a'] });
      K.chariot(1000, 1140, 440, { dir: -1, flag: '#ffd23a' });
      K.rama({ x: 910, y: 1000, h: 640, turn: 0.3, look: 'prince', pose: { legs: 'hidden', armL: K.poses.rest, armR: [0.6, 0.6] } });
      K.sita({ x: 1120, y: 1000, h: 590, turn: 0.45, look: 'bride', pose: { legs: 'hidden', armL: K.poses.lap, armR: K.poses.chest }, face: { eyes: 'soft', mouth: 'calm', gaze: [1, 0] } });
      K.petals(100, [0, 0, W, 900], ['#ff8ac0', '#ffffff', '#ffd23a']);
    },
  };
})();
