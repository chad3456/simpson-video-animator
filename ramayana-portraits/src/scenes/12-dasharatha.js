// 12 — Dasharatha: the old king of Ayodhya on the night his promise sent Rama into exile, grief in the lamplight.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['12-dasharatha'] = {
    title: 'Dasharatha — the Promise',
    seed: 1212,
    accents: ['#ffd23a', '#ff7a1a', '#ffffff', '#3ad0ff', '#ff3a6a'],
    flow: (x, y, n) => 1.4 + n(x * 0.003, y * 0.003) * 2,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#1a0a4a', '#3a1a7a', '#5a1a6a', '#2a0a4a']));
      // oil lamps
      for (const [x, y] of [[120, 1000], [1080, 950], [200, 330], [1000, 300]]) {
        K.blob(x, y, 260, '#ff8a1a', 0.8);
        K.blob(x, y, 110, '#ffe04a', 1);
      }
      const F = K.head({ x: 600, y: 640, s: 225, turn: -0.12, tilt: 0.14, jaw: 0.45 });
      const T = F.T;
      K.hairBack(F, { len: 1.6, w: 0.95, colors: ['#ffffff', '#d8d8f0', '#9a9ad0', '#4a4a8a'] });
      K.bust(F, { colors: ['#ffd84a', '#e08a1a', '#7a2a6a', '#1a0a3a'], sw: 1.9 });
      const robe = K.path([T(-2.2, 2.0), T(-0.7, 1.6), T(0.7, 1.6), T(2.2, 2.0), T(2.3, 4.4), T(-2.3, 4.4)]);
      K.fill(robe, K.skinGrad(F, ['#ff4a6a', '#c0103a', '#5a0a4a', '#1a0a2a'], -2.2, 2.2));
      K.focus(robe, 0.45);
      K.face(F, {
        skin: ['#ffd890', '#f08a3a', '#6a3a9a', '#24104a'], glow: '#fff4c0', cheek: '#ff5a3a', cheek2: '#3a2a8a',
        eyes: 'closed', brow: 'sad', mouth: 'sad', tears: 'both', tilak: 'line', browInk: '#f0f0ff', browW: 0.05,
        patches: [[0.4, 0.3, 0.25, '#3a8aff', 0.4], [-0.4, -0.5, 0.25, '#ffe08a', 0.45]],
        contourColor: '#14063a', contourLight: '#ffd040',
      });
      K.wrinkles(F, { color: '#5a2a5a' });
      K.beard(F, { len: 0.8, n: 80 });
      K.mustache(F, { strands: ['#ffffff', '#f0f0ff', '#d8e0ff'], n: 26, w: 0.045 });
      K.earrings(F, { r: 0.1 });
      K.crown(F, { h: 1.1, bw: 0.84, jewels: ['#e0102a', '#14a05a', '#ffffff'] });
      K.necklace([T(-0.9, 1.6), T(-0.5, 2.5), T(0, 2.7), T(0.5, 2.5), T(0.9, 1.6)], { w: 14, gems: ['#e0102a', '#14a05a'] });
      K.overlay((pen) => {
        for (const [x, y] of [[120, 1000], [1080, 950], [200, 330], [1000, 300]]) {
          pen.fill(K.ell(x, y + 40, 60, 22), '#c0601a');
          pen.line([[x, y + 30], [x - 6, y], [x, y - 50]], { w: 22, color: '#fff6b0', taper: 0.9 });
        }
      });
    },
  };
})();
