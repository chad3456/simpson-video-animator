// Yuddha Kanda — with Lakshmana struck down, Hanuman flies to the Himalayas for the healing herbs. Unable to tell them apart,
// he tears up the whole peak and carries it back through the night sky, the herbs glowing on its slopes.
(function () {
  RP.events['10-hanuman-lifts-the-mountain'] = {
    title: 'Hanuman Carries the Mountain of Herbs',
    W: 1800, H: 1200, seed: 1010,
    layers: RP.eventLayers,
    accents: ['#ffffff', '#ffd23a', '#3ad0ff', '#8affc0', '#b05aff'],
    flow: RP.flows.swirl(1100, 380),
    turbulence: 0.7,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(1000, 400, 60, 1300, ['#4a3ab0', '#2a1a8a', '#140a5a', '#0a0630', '#04020e']));
      K.blob(260, 200, 140, '#fff8d0', 1); K.blob(260, 200, 260, '#8aa0ff', 0.5); // moon
      for (let i = 0; i < 80; i++) K.blob(K.R(0, W), K.R(0, 700), K.R(3, 7), '#ffffff', 1);
      // the battlefield below, campfires at Lanka
      K.mountain([[0, 1200], [0, 1060], [400, 1000], [900, 1050], [1400, 990], [1800, 1040], [1800, 1200]], ['#2a3a7a', '#1a2a5a', '#0a1a3a', '#060a1a'], 0.2);
      for (let i = 0; i < 14; i++) K.blob(K.R(0, W), K.R(1050, 1180), K.R(20, 40), '#ff8a1a', 1);
      // the mountain on his raised palm
      const mtn = [[980, 380], [1060, 180], [1150, 120], [1230, 60], [1320, 140], [1400, 120], [1500, 260], [1560, 380], [1420, 420], [1180, 430]];
      K.mountain(mtn, ['#d8ffe0', '#5ad0a0', '#1a7a7a', '#0a2a4a'], 0.6);
      K.fill(K.poly([[1180, 70], [1230, 60], [1280, 90], [1260, 130], [1200, 120]]), '#ffffff');
      for (let i = 0; i < 26; i++) K.blob(K.R(1050, 1480), K.R(180, 400), K.R(10, 22), K.pick(['#d8ff7a', '#fff6a0', '#8affe0']), 1);
      const han = K.vanara({
        x: 900, y: 1000, h: 980, rot: 0.55, turn: 0.4, gaze: 1, brow: 1, tilak: true, crownSmall: true,
        pose: { legs: 'fly', armL: [1.6, 0.6], armR: [2.75, -0.15] },
        fur: ['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'], cloth: ['#ff4a3a', '#d0101a', '#7a0a2a', '#2a0a1a'], scarf: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'],
      });
      // gada in the other hand
      const [hx, hy] = han.handL;
      K.strokeRef([[hx - 40, hy + 80], [hx + 50, hy - 90]], 18, '#a0501a');
      K.fill(K.ell(hx + 70, hy - 130, 55, 65, 0.5), K.rad(hx + 60, hy - 150, 5, 80, ['#fff8c0', '#ffc22a', '#c0601a', '#5a2010']));
      K.overlay((pen) => {
        for (let k = 0; k < 40; k++) { const x = K.R(1050, 1500), y = K.R(160, 420); pen.dab(x, y, K.R(3, 6), K.pick(['#fff6a0', '#d8ff7a', '#ffffff']), 0.95); }
        for (let k = 0; k < 24; k++) { const y = K.R(500, 1000), x = K.R(0, 600); pen.line([[x, y], [x + K.R(80, 200), y - K.R(30, 90)]], { w: K.R(3, 6), color: '#c8d8ff', alpha: 0.55, taper: 1 }); }
      });
    },
  };
})();
