// 05 — Ravana, Dashanana: ten crowned heads, each a different mood, against Lanka in flames.
(function () {
  RP.scenes = RP.scenes || {};
  const moods = [
    { mouth: 'roar', brow: 'angry', eyes: 'wide' },
    { mouth: 'grim', brow: 'raised', eyes: 'half' },
    { mouth: 'grim', brow: 'furrow', eyes: 'fierce' },
    { mouth: 'open', brow: 'raised', eyes: 'wide' },
    { mouth: 'fangs', brow: 'angry', eyes: 'fierce' },
    { mouth: 'calm', brow: 'sad', eyes: 'down' },
    { mouth: 'smile', brow: 'angry', eyes: 'fierce' },
    { mouth: 'grim', brow: 'calm', eyes: 'closed' },
    { mouth: 'roar', brow: 'furrow', eyes: 'fierce' },
  ];
  RP.scenes['05-ravana'] = {
    title: 'Ravana — Dashanana',
    seed: 505,
    accents: ['#ffd23a', '#ff2a1a', '#14c0a0', '#b03aff', '#ffffff'],
    flow: RP.flows.rising(1.2),
    turbulence: 1.1,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, H, 0, 0, ['#ffb81a', '#ff4a10', '#c0102a', '#4a0a3a', '#14061e']));
      for (let i = 0; i < 18; i++) {
        const x = K.R(-50, W + 50), w = K.R(120, 260);
        K.flame(x, H + 40, w, K.R(500, 1100), null, K.R(-80, 80));
      }
      K.blob(600, 200, 380, '#5a1a8a', 0.7);
      // nine heads behind, then the main face
      const spots = [
        [600, 255, 112], [395, 330, 116], [805, 330, 116], [215, 470, 116], [985, 470, 116],
        [110, 680, 112], [1090, 680, 112], [330, 620, 124], [870, 620, 124],
      ];
      const order = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      order.forEach((i) => {
        const [x, y, s] = spots[i];
        const F = K.head({ x, y, s, turn: (x - 600) / 900, tilt: (x - 600) / 2500, jaw: 0.35 });
        const m = moods[i];
        const sk = i % 2 ? ['#ff9a4a', '#d04a3a', '#3a5a9a', '#140a3a'] : ['#ffc05a', '#e86a2a', '#5a2a8a', '#1a0a3a'];
        K.face(F, Object.assign({ skin: sk, ears: false, neck: false, tilak: 'tripundra', contourColor: '#0a0a3a', contourLight: '#ffd040', lips: '#6a0a2a', lips2: '#a02a3a', faceFlow: true }, m));
        K.mustache(F, { color: '#140a18', curl: 0.45, n: 12, w: 0.045 });
        K.crown(F, { h: 0.85, bw: 0.82, jewels: ['#14c0a0', '#e0102a', '#ffffff'] });
      });
      const F = K.head({ x: 600, y: 720, s: 200, turn: 0.05, jaw: 0.3, width: 0.76 });
      const T = F.T;
      K.bust(F, { colors: ['#ffc23a', '#c8501a', '#4a1a6a', '#14061e'], sw: 2.1, top: 1.3 });
      // gold armour plates
      const plate = K.path([T(-1.3, 1.85), T(0, 2.2), T(1.3, 1.85), T(1.6, 3.6), T(0, 4.1), T(-1.6, 3.6)]);
      K.fill(plate, K.skinGrad(F, ['#fff07a', '#ffb01a', '#a03a1a', '#3a0a2a'], -1.6, 1.6));
      K.focus(plate, 0.55);
      K.face(F, {
        skin: ['#ffd06a', '#f06a2a', '#4a2a9a', '#14063a'], glow: '#fff0a0', cheek: '#ff3a2a', cheek2: '#2a2a8a',
        eyes: 'fierce', brow: 'angry', mouth: 'grim', gaze: [0, 0], tilak: 'tripundra', browW: 0.06,
        patches: [[0.4, 0.3, 0.25, '#14a0a0', 0.5], [-0.4, 0.4, 0.2, '#ff2a6a', 0.45]],
        contourColor: '#0a0a3a', contourLight: '#ffe04a', lips: '#6a0a2a', lips2: '#a02a3a',
      });
      K.mustache(F, { color: '#100816', curl: 0.5, n: 30, w: 0.045 });
      K.earrings(F, { r: 0.12, gem: '#14c0a0' });
      K.crown(F, { h: 1.05, bw: 0.88, centre: '#14c0a0' });
      K.necklace([T(-0.7, 1.5), T(-0.4, 2.0), T(0, 2.15), T(0.4, 2.0), T(0.7, 1.5)], { w: 14, gems: ['#e0102a', '#14c0a0'] });
      K.necklace([T(-1.0, 1.7), T(-0.6, 2.6), T(0, 2.85), T(0.6, 2.6), T(1.0, 1.7)], { w: 12, gems: ['#ffffff'] });
      K.overlay((pen) => {
        for (let k = 0; k < 60; k++) {
          const x = K.R(0, 1200), y = K.R(900, 1500);
          pen.line([[x, y], [x + K.R(-10, 10), y - K.R(20, 60)]], { w: K.R(2, 6), color: K.pick(['#fff3a0', '#ffb02a', '#ff6a1a']), taper: 1 });
        }
      });
    },
  };
})();
