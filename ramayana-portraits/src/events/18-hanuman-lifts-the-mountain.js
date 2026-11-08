// Yuddha Kanda (sarga 74) — with Lakshmana and the army struck down by Indrajit, Jambavan sends Hanuman to the Himalayas
// for the four healing herbs. When the herbs hide themselves, Hanuman tears up the whole peak, the Mountain of Herbs,
// and flies back through the night sky "like a second sun", the herbs blazing on its slopes.
(function () {
  RP.events['18-hanuman-lifts-the-mountain'] = {
    title: 'Hanuman Carries the Mountain of Herbs',
    W: 1800, H: 1200, seed: 1010,
    layers: RP.eventLayers,
    accents: ['#ffffff', '#ffd23a', '#3ad0ff', '#8affc0', '#b05aff'],
    flow: (x, y, n) => -0.45 + n(x * 0.002, y * 0.002) * 1.1,
    turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, H, W, 0, ['#0a0630', '#1a1a6a', '#3a3ab0', '#6a5ad0', '#140a40']));
      K.blob(1550, 180, 120, '#fff8d0', 1); K.blob(1550, 180, 240, '#8aa0ff', 0.45); // moon
      for (let i = 0; i < 90; i++) K.blob(K.R(0, W), K.R(0, 650), K.R(3, 6), '#ffffff', 1);
      // the snow peaks of the Himalayas falling away behind him
      K.mountain([[-50, 1200], [-50, 760], [150, 640], [300, 720], [470, 560], [640, 700], [820, 620], [1000, 800], [1100, 1200]], ['#ffffff', '#c8d8ff', '#6a7ad0', '#1a1a5a'], 0.3);
      K.mountain([[700, 1200], [900, 980], [1200, 900], [1500, 960], [1850, 900], [1850, 1200]], ['#3a4a9a', '#22306a', '#121a40', '#060a1a'], 0.2);
      // Hanuman in flight, rising towards Lanka, fist thrust forward, the mountain held aloft
      const han = K.vanara({
        x: 420, y: 1130, h: 760, rot: 1.05, turn: 0.35, gaze: 1, brow: 1, tilak: true, crownSmall: true,
        pose: { legs: 'fly', armL: [1.75, 0.15], armR: [2.95, 0.05] },
        fur: ['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'], cloth: ['#ff4a3a', '#d0101a', '#7a0a2a', '#2a0a1a'], scarf: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'],
      });
      const [mx, my] = han.handL;
      const M = (u, v) => [mx + u, my + v];
      const mtn = [M(-260, 10), M(-220, -120), M(-130, -200), M(-50, -320), M(30, -250), M(100, -300), M(190, -170), M(260, 10), M(130, 40), M(-130, 40)];
      K.mountain(mtn, ['#d8ffe0', '#5ad0a0', '#1a7a7a', '#0a2a4a'], 0.7);
      K.fill(K.poly([M(-70, -280), M(-40, -330), M(0, -290), M(-30, -260)]), '#ffffff');
      K.blob(mx, my - 150, 330, '#d8ffb0', 0.35);
      K.overlay((pen) => {
        for (let k = 0; k < 46; k++) pen.dab(mx + K.R(-180, 180), my + K.R(-260, 0), K.R(4, 8), K.pick(['#fff6a0', '#d8ff7a', '#ffffff', '#8affe0']), 0.95);
        for (let k = 0; k < 12; k++) { const a = -Math.PI / 2 + K.R(-1.2, 1.2); pen.line([M(Math.cos(a) * 250, -150 + Math.sin(a) * 200), M(Math.cos(a) * 340, -150 + Math.sin(a) * 280)], { w: 4, color: '#fff6c0', alpha: 0.7, taper: 1 }); }
        // wind streaming past
        for (let k = 0; k < 30; k++) { const x = K.R(0, 700), y = K.R(500, 1150); pen.line([[x, y], [x - K.R(80, 220), y + K.R(40, 120)]], { w: K.R(3, 6), color: '#c8d8ff', alpha: 0.55, taper: 1 }); }
      });
    },
  };
})();
