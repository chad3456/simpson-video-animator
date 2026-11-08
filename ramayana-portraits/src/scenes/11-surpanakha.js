// 11 — Surpanakha: Ravana's sister, whose desire and humiliation in the Panchavati forest lit the war.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['11-surpanakha'] = {
    title: 'Surpanakha in Panchavati',
    seed: 1111,
    accents: ['#3ad0a0', '#ffd23a', '#ff3a8a', '#ffffff', '#2a5aff'],
    flow: RP.flows.radial(600, 600, -0.6),
    turbulence: 1.2,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#ff1a5a', '#e0102a', '#8a0a6a', '#14a08a', '#0a5a6a']));
      K.blob(1050, 250, 380, '#ff8a1a', 0.8);
      K.blob(150, 1250, 420, '#0aa08a', 0.85);
      const F = K.head({ x: 600, y: 640, s: 240, turn: 0.22, tilt: 0.12, female: true });
      const T = F.T;
      // wild hair spreading like flames
      const hair = [];
      for (let k = 0; k < 22; k++) {
        const a = -Math.PI * 1.1 + (k / 21) * Math.PI * 1.25, r = K.R(1.5, 2.3);
        hair.push(T(Math.cos(a) * r * 1.1, Math.sin(a) * r * 0.95 + 0.4));
        hair.push(T(Math.cos(a + 0.07) * 0.9, Math.sin(a + 0.07) * 0.9 + 0.3));
      }
      const hp = K.path(hair);
      K.fill(hp, K.skinGrad(F, ['#4a1a8a', '#2a0a5a', '#14063a', '#080214'], -2, 2));
      K.focus(hp, 0.4);
      K.bust(F, { colors: ['#b8f070', '#3ab04a', '#3a2a8a', '#14063a'], sw: 1.6 });
      const garb = K.path([T(-2, 2.3), T(0, 2.0), T(2, 2.3), T(2.1, 4.4), T(-2.1, 4.4)]);
      K.fill(garb, K.skinGrad(F, ['#ffd23a', '#ff7a1a', '#c0102a', '#4a0a3a'], -2, 2));
      K.flow(garb, 0.3);
      K.face(F, {
        skin: ['#c8f07a', '#4ab04a', '#5a2a8a', '#1a0a3a'], glow: '#f8ffb0', cheek: '#ff4a8a', cheek2: '#2a2a8a',
        eyes: 'wide', brow: 'angry', mouth: 'fangs', gaze: [-0.5, 0], lips: '#4a0a4a', lips2: '#8a1a6a', lashes: true,
        iris: '#c09a10', iris2: '#ffe04a', irisR: 0.05, tilak: 'bindi',
        patches: [[0.4, 0.3, 0.25, '#ff3a8a', 0.4], [-0.4, -0.5, 0.25, '#ffff8a', 0.45], [0.3, -0.5, 0.2, '#3ad0ff', 0.4]],
        contourColor: '#14063a', contourLight: '#ffe04a',
      });
      K.earrings(F, { r: 0.12, gem: '#ff2a8a' });
      K.noseRing(F, { r: 0.15 });
      K.necklace([T(-0.5, 1.4), T(-0.3, 1.8), T(0, 1.9), T(0.3, 1.8), T(0.5, 1.4)], { w: 10, gems: ['#3ad0a0', '#ff2a8a'] });
      K.overlay((pen) => {
        // flowing locks, curling outward
        for (let k = 0; k < 70; k++) {
          const a = -Math.PI * 1.1 + K.R(0, Math.PI * 1.25), r0 = K.R(0.95, 1.2), r1 = r0 + K.R(0.5, 1.0);
          const c = K.R(0.2, 0.45) * (Math.cos(a) > 0 ? 1 : -1);
          pen.line([T(Math.cos(a) * r0, Math.sin(a) * r0 + 0.3), T(Math.cos(a + c * 0.5) * (r0 + r1) / 2, Math.sin(a + c * 0.5) * (r0 + r1) / 2 + 0.35), T(Math.cos(a + c) * r1, Math.sin(a + c) * r1 + 0.45)], { w: K.R(5, 12), color: K.pick(['#6a3ad0', '#2a0a5a', '#ff3a8a', '#14063a', '#3ad0ff']), alpha: 0.7, taper: 1 });
        }
      });
    },
  };
})();
