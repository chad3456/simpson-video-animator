// 07 — Valmiki: the first poet, at the moment grief over the slain krauncha bird became the first shloka.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['07-valmiki'] = {
    title: 'Valmiki — the First Poet',
    seed: 707,
    accents: ['#ffffff', '#ffd23a', '#ff6a9a', '#3ad0a0', '#3a7aff'],
    flow: (x, y, n) => (x < 600 ? 1.9 : 1.2) + n(x * 0.004, y * 0.004) * 1.2,
    draw(K) {
      const { W, H } = K;
      // Einstein-like split: green-blue dusk on the left, burning orange on the right
      K.bg(K.lin(0, 0, W, 0, ['#1a4ad0', '#14a07a', '#2ac07a', '#ff8a1a', '#ff3a1a', '#e0102a']));
      K.blob(1000, 300, 300, '#ffd23a', 0.8);
      K.blob(200, 1200, 400, '#1a2a9a', 0.8);
      const F = K.head({ x: 640, y: 600, s: 225, turn: -0.15, tilt: -0.06, jaw: 0.45 });
      const T = F.T;
      K.jata(F, { colors: ['#ffffff', '#e8e0f0', '#b0b0d8', '#6a6aa0'], strands: ['#ffffff', '#d8d0ff', '#fff0c0', '#a0a8e0'], rudraksha: true });
      const skin = ['#ffe25a', '#ff9a2a', '#1f9a8a', '#1a3a8a'];
      K.bust(F, { colors: ['#ffc85a', '#ff8a2a', '#c04a1a', '#4a1a3a'], sw: 1.8 });
      const shawl = K.path([T(-2.2, 1.9), T(-1.0, 1.6), T(0.4, 2.8), T(1.0, 4.4), T(-2.4, 4.4)]);
      K.fill(shawl, K.lin(...T(-2, 2), ...T(0.5, 4), ['#ffb01a', '#ff6a1a', '#c0301a']));
      K.flow(shawl, 1.0);
      K.face(F, {
        skin, glow: '#fff8b0', cheek: '#ff5a2a', cheek2: '#14706a',
        eyes: 'soft', brow: 'sad', mouth: 'calm', gaze: [-0.4, -0.6], tilak: 'ash', browHair: '#ffffff', browW: 0.05, browInk: '#e8e8ff',
        patches: [[0.42, 0.3, 0.28, '#2a8aff', 0.45], [0.15, -0.6, 0.22, '#ffb03a', 0.5]],
        contourColor: '#0a1a5a', contourLight: '#ff3a1a', lips: '#9a2a3a', lips2: '#d0504a',
      });
      K.wrinkles(F, { color: '#6a2a4a' });
      K.beard(F, { len: 1.5, n: 110 });
      K.mustache(F, { strands: ['#ffffff', '#f0f0ff', '#d8e0ff', '#fff0d0'], n: 30, w: 0.045 });
      // rudraksha mala
      K.necklace([T(-0.9, 1.5), T(-0.6, 2.6), T(0, 2.95), T(0.6, 2.6), T(0.9, 1.5)], { w: 8, color: '#7a2a10', gems: ['#7a2a10', '#5a1a0a'], gemR: 10, step: 2 });
      K.overlay((pen) => {
        // the pair of krauncha birds
        const bird = (x, y, sc, c) => {
          pen.line([[x - 60 * sc, y + 10 * sc], [x - 20 * sc, y - 30 * sc], [x, y]], { w: 9 * sc, color: c, taper: 0.8 });
          pen.line([[x, y], [x + 30 * sc, y - 40 * sc], [x + 80 * sc, y - 20 * sc]], { w: 9 * sc, color: c, taper: 0.8 });
          pen.line([[x - 5 * sc, y], [x - 40 * sc, y + 25 * sc]], { w: 6 * sc, color: c, taper: 0.5 });
        };
        bird(210, 260, 1.4, '#ffffff');
        bird(330, 200, 1.1, '#ffd0e0');
      });
    },
  };
})();
