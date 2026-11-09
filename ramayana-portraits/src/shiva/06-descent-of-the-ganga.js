// 06 — Gangavatarana: moved by Bhagiratha's penance, Shiva stands on the Himalaya and receives the falling Ganga in his
// matted locks, so that her force does not split the earth; she flows out gently in seven streams.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['06-descent-of-the-ganga'] = {
    title: 'The Descent of the Ganga', W: 1200, H: 1800, seed: 6106, layers: RP.eventLayers,
    accents: ['#ffffff', '#8ad8ff', '#3a8aff', '#ffd23a', '#c08aff'],
    flow: (x, y, n) => (Math.abs(x - 640) < 220 && y < 700 ? Math.PI / 2 : 1.0) + n(x * 0.002, y * 0.002) * 1.2, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#fff6e8', '#c8e0ff', '#7a8ae0', '#5a4ab0', '#2a2a6a']));
      K.blob(640, 80, 360, '#ffffff', 0.9);
      // the torrent from heaven
      K.fill(K.path([[460, -20], [820, -20], [700, 520], [600, 520]]), K.lin(0, 0, 0, 520, ['#ffffff', '#c8f0ff', '#7ac8ff', '#e8fbff']));
      K.mountain([[0, 1800], [0, 1200], [220, 980], [420, 1150], [640, 940], [860, 1120], [1060, 1000], [1200, 1100], [1200, 1800]], ['#ffffff', '#c8d8ff', '#7a8ad0', '#2a2a6a'], 0.4);
      // seven gentle streams flowing out of the jata, behind him, down the mountain
      { const tx = 640, ty = 1480 - 1050 * 1.02; for (let k = 0; k < 7; k++) { const sd = k < 3 ? -1 : k > 3 ? 1 : 0, j = Math.abs(k - 3); if (!sd) continue; K.strokeRef([[tx + sd * 40, ty + 40], [tx + sd * (180 + j * 60), ty + 60], [tx + sd * (330 + j * 60), ty + 500], [tx + sd * (380 + j * 70), 1800]], 22, K.pick(['#e8fbff', '#8ad8ff', '#5ab0ff'])); } }
      const r = K.shiva({ x: 640, y: 1480, h: 1050, pose: { armL: [2.4, 0.4], armR: [0.8, -0.6] }, face: { eyes: 'half', gaze: [0, -0.4] }, head2: { thirdEye: 'closed', ganga: false } });
      K.trishul(r.handR[0], r.handR[1] + 300, 900, 0.08, { glow: '#c8f0ff' });
      const top = r.T(0, -1.05);
      K.overlay((pen) => {
        for (let k = 0; k < 18; k++) { const x0 = K.R(470, 800); pen.line([[x0, -10], [x0 + (top[0] - x0) * 0.6, top[1] * 0.6], [top[0] + K.R(-40, 40), top[1]]], { w: K.R(6, 16), color: K.pick(['#ffffff', '#c8f0ff', '#8ad8ff']), alpha: 0.85, taper: 0.5 }); }
        for (let k = 0; k < 60; k++) pen.dab(top[0] + K.R(-160, 160), top[1] + K.R(-60, 80), 4, '#ffffff');
      });
      // Bhagiratha, kneeling in thanks
      K.figure({ x: 250, y: 1700, h: 380, turn: 0.4, skin: ['#ffe0b0', '#f0a870', '#b0605a', '#4a1a3a'], head: 'crown', cloth: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'], pose: { legs: 'kneel', armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'open', gaze: [0.6, -0.8] } });
    },
  };
})();
