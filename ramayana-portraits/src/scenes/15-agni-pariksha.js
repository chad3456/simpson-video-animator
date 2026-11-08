// 15 — Agni Pariksha: Sita steps into the fire to prove her truth; the flames do not touch her.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['15-agni-pariksha'] = {
    title: 'Agni Pariksha — Untouched by Fire',
    seed: 1515,
    accents: ['#fff6b0', '#ffd23a', '#ff3a1a', '#3ad0ff', '#ffffff'],
    flow: RP.flows.rising(1.4),
    turbulence: 1.2,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#1a0a4a', '#5a0a5a', '#c0102a', '#ff6a1a', '#ffd23a']));
      for (let i = 0; i < 26; i++) {
        const x = K.R(-60, W + 60);
        const near = Math.abs(x - 600) < 300;
        K.flame(x, H + 60, K.R(140, 280), near ? K.R(500, 800) : K.R(800, 1450), null, K.R(-90, 90));
      }
      K.blob(600, 640, 420, '#fff8d0', 0.75); // she glows
      const F = K.head({ x: 600, y: 620, s: 220, tilt: 0.0, female: true });
      const T = F.T;
      K.hairBack(F, { len: 2.4, w: 0.95 });
      K.bust(F, { colors: ['#fff27a', '#ffc21a', '#e0601a', '#8a1a3a'], sw: 1.6, flow: Math.PI / 2 });
      K.face(F, {
        skin: ['#fff4c8', '#ffc070', '#d04a6a', '#5a1a6a'], glow: '#ffffff', cheek: '#ff8a5a', cheek2: '#8a2a8a',
        eyes: 'closed', brow: 'calm', mouth: 'smile', tilak: 'bindi',
        patches: [[0.42, 0.3, 0.25, '#3a8aff', 0.35], [-0.4, -0.5, 0.25, '#ffffff', 0.5]],
        contourColor: '#3a0a4a', contourLight: '#ffffff', lips: '#b01a3a', lips2: '#e85a5a',
      });
      K.hairFront(F, { part: 0 });
      K.earrings(F, { r: 0.09 });
      K.necklace([T(-0.45, 1.35), T(-0.25, 1.7), T(0, 1.78), T(0.25, 1.7), T(0.45, 1.35)], { w: 10, gems: ['#e0102a', '#ffffff'] });
      K.overlay((pen) => {
        // a halo of light and rising sparks
        for (let k = 0; k < 48; k++) {
          const a = (k / 48) * Math.PI * 2;
          pen.line([T(Math.cos(a) * 1.35, Math.sin(a) * 1.4 - 0.1), T(Math.cos(a) * 1.6, Math.sin(a) * 1.65 - 0.1)], { w: 8, color: k % 2 ? '#fff8c0' : '#ffd23a', alpha: 0.7, taper: 1 });
        }
        for (let k = 0; k < 90; k++) {
          const x = K.R(0, 1200), y = K.R(200, 1500);
          if (Math.abs(x - 600) < 260 && y < 1300) continue;
          pen.line([[x, y], [x + K.R(-8, 8), y - K.R(16, 46)]], { w: K.R(2, 6), color: K.pick(['#fff3a0', '#ffb02a', '#ffffff']), taper: 1 });
        }
        // lotus at her heart
        for (let p = -2; p <= 2; p++) {
          const a = -Math.PI / 2 + p * 0.38;
          pen.line([T(0, 2.45), T(Math.cos(a) * 0.3, 2.45 + Math.sin(a) * 0.3)], { w: 36, color: p % 2 ? '#ff8ab0' : '#ffd0e0', taper: 0.9 });
        }
      });
    },
  };
})();
