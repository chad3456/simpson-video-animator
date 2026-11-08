// Ayodhya Kanda — exiled, in bark garments, Rama, Sita and Lakshmana are ferried across the Ganga at Shringaverapura by
// Guha, king of the Nishadas, as the sun goes down over the river.
(function () {
  RP.events['02-crossing-the-ganga'] = {
    title: 'Crossing the Ganga with Guha',
    W: 1800, H: 1200, seed: 2002,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff6a3a', '#ffffff', '#3ad0ff', '#b05aff'],
    flow: (x, y, n) => (y > 640 ? 0.0 : 0.15) + n(x * 0.002, y * 0.002) * 0.9,
    turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, 640, ['#3a1a8a', '#b03a8a', '#ff6a3a', '#ffc23a']));
      K.blob(1250, 560, 260, '#fff4b0', 1); // setting sun
      K.fill(K.poly([[0, 640], [W, 640], [W, H], [0, H]]), K.lin(0, 640, 0, H, ['#ffb03a', '#e0602a', '#7a2a8a', '#1a2a8a']));
      K.flow(K.poly([[0, 650], [W, 650], [W, H], [0, H]]), 0.0);
      K.fill(K.ell(1250, 760, 90, 260), 'rgba(255,240,160,0.75)'); // sun's reflection
      // far banks with palms
      K.fill(K.poly([[0, 600], [520, 620], [700, 660], [0, 680]]), '#1a4a3a');
      K.fill(K.poly([[1500, 640], [W, 590], [W, 680], [1450, 670]]), '#1a4a3a');
      for (const [x, h] of [[90, 260], [220, 320], [360, 230], [1600, 280], [1720, 330]]) K.palm(x, 650, h, { lean: K.R(-0.2, 0.2) });
      // the boat
      K.boat(880, 930, 980);
      const rama = K.figure({ x: 760, y: 990, h: 520, skin: ['#9ef0ff', '#3fa8f0', '#2a52c8', '#22167a'], head: 'jata', hairColors: ['#3a2a7a', '#22164a', '#120a2a', '#06030e'], ascetic: true, earrings: false,
        cloth: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], scarf: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], turn: 0.3,
        pose: { legs: 'sit', armL: K.poses.lap, armR: [0.6, -0.8] }, face: { eyes: 'soft', mouth: 'calm', tilak: 'vaishnava', gaze: [0.6, 0.2] } });
      const sita = K.figure({ x: 940, y: 990, h: 480, female: true, skin: ['#ffe6b8', '#f2a46e', '#c0507a', '#4a1a5a'], head: 'veil', veil: ['#fff27a', '#ffc21a', '#e08a1a', '#7a3a1a'], turn: -0.2,
        top: ['#fff27a', '#ffc21a', '#e08a1a', '#7a3a1a'], cloth: ['#fff27a', '#ffc21a', '#e08a1a', '#7a3a1a'],
        pose: { legs: 'sit', armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'closed', mouth: 'calm', tilak: 'bindi' } });
      const lak = K.figure({ x: 560, y: 990, h: 520, skin: ['#ffe85a', '#ff9a2a', '#1aa08a', '#1a3a8a'], head: 'jata', hairColors: ['#3a2a7a', '#22164a', '#120a2a', '#06030e'], ascetic: true, earrings: false,
        cloth: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], turn: 0.3, pose: { legs: 'sit', armL: K.poses.rest, armR: [0.4, -1.2] }, face: { eyes: 'open', mouth: 'grim', tilak: 'vaishnava', gaze: [0.7, 0] } });
      K.bowAt([lak.handR[0] + 40, lak.handR[1] - 140], 360, -1.45, { w: 12 });
      // Guha, standing at the stern with the long oar
      const guha = K.figure({ x: 1280, y: 930, h: 600, skin: ['#d89a5a', '#a0582a', '#5a2a3a', '#1a0a1a'], head: 'long', hairColors: ['#3a2a3a', '#1a0a1a', '#0a0408', '#000000'], earrings: false,
        cloth: ['#ff4a3a', '#c0101a', '#6a0a2a', '#2a0a1a'], turn: -0.4, mustache: '#140808',
        pose: { legs: 'walk', armL: [0.9, -0.2], armR: [0.5, -1.0] }, face: { eyes: 'soft', mouth: 'smile', gaze: [-0.8, 0.2] } });
      K.overlay((pen) => {
        pen.line([[guha.handL[0] + 140, guha.handL[1] - 260], guha.handL, [guha.handR[0] - 40, guha.handR[1] + 60], [1420, 1110]], { w: 12, color: '#6a3a1a', taper: 0 });
        pen.fill(K.ell(1430, 1120, 22, 60, 0.4), '#6a3a1a');
        // ripples
        for (let k = 0; k < 90; k++) { const y = K.R(700, 1190), x = K.R(0, W), w = 10 + (y - 700) / 15; pen.line([[x - w, y], [x + w, y]], { w: 2 + (y - 700) / 160, color: K.pick(['#fff4b0', '#ffb03a', '#c08aff', '#5a8aff']), alpha: 0.7 }); }
        // birds homing at dusk
        for (let k = 0; k < 7; k++) { const x = 300 + k * 90, y = 220 + Math.sin(k) * 40; pen.line([[x - 18, y + 6], [x, y], [x + 18, y + 6]], { w: 4, color: '#2a0a3a' }); }
      });
    },
  };
})();
