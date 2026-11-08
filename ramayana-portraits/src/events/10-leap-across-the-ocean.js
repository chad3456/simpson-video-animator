// Sundara Kanda — from the summit of Mount Mahendra Hanuman grows to an immense size and leaps across the hundred-yojana
// ocean towards Lanka, his shadow racing across the waves.
(function () {
  RP.events['10-leap-across-the-ocean'] = {
    title: 'Hanuman Leaps the Ocean',
    W: 1800, H: 1200, seed: 6006,
    layers: RP.eventLayers,
    accents: ['#ffffff', '#ffd23a', '#3ad0ff', '#ff6a3a', '#8a5aff'],
    flow: (x, y, n) => (y > 760 ? 0.02 : -0.25) + n(x * 0.002, y * 0.002) * 1.0,
    turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#2a6ae0', '#5aa0ff', '#ffd890', '#ff9a5a', '#1a5ad0']));
      K.blob(1450, 330, 330, '#fff8d0', 0.9);
      K.blob(300, 160, 380, '#ffffff', 0.5);
      K.blob(1200, 140, 300, '#ffffff', 0.45);
      // Mount Mahendra on the left shore, Lanka gleaming on the far right horizon
      K.mountain([[-50, 1200], [-50, 520], [120, 420], [260, 560], [420, 760], [560, 1200]], ['#8affc0', '#2ab07a', '#1a6a6a', '#0a2a3a'], 0.3);
      K.fill(K.poly([[0, 780], [W, 780], [W, H], [0, H]]), K.lin(0, 780, 0, H, ['#3ad0ff', '#1a7ad0', '#0a2a8a']));
      K.flow(K.poly([[0, 780], [W, 780], [W, H], [0, H]]), 0.0);
      for (let i = 0; i < 6; i++) K.palace(1540 + i * 45, 790, 40, K.R(40, 90), { roof: 'shikhara', colors: ['#fff6b0', '#ffd23a', '#e0902a', '#7a3a1a'], flag: false, focus: 0.4 });
      // Hanuman in flight, body stretched, arms forward
      const han = K.vanara({
        x: 360, y: 700, h: 960, rot: 1.15, turn: 0.3, gaze: 1, tilak: true, crownSmall: true,
        pose: { legs: 'fly', armL: [0.1, 0.05], armR: [2.95, 0.05] },
        fur: ['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'], cloth: ['#ff4a3a', '#d0101a', '#7a0a2a', '#2a0a1a'], scarf: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'],
      });
      // his shadow on the waves and the wake of wind
      K.fill(K.ell(900, 1000, 440, 40, -0.02), 'rgba(10,20,80,0.55)');
      K.overlay((pen) => {
        for (let k = 0; k < 26; k++) {
          const y = K.R(380, 760), x = K.R(0, 500);
          pen.line([[x, y], [x + K.R(80, 220), y - K.R(10, 50)]], { w: K.R(3, 7), color: '#ffffff', alpha: 0.6, taper: 1 });
        }
      });
      K.waves(800, 1200, { n: 160 });
    },
  };
})();
