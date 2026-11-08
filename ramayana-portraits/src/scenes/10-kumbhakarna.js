// 10 — Kumbhakarna: the giant brother of Ravana, woken from six months of sleep by drums and elephants — an extreme close-up.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['10-kumbhakarna'] = {
    title: 'Kumbhakarna Awakens',
    seed: 1010,
    accents: ['#ffd23a', '#ff3a1a', '#3ad0a0', '#ffffff', '#3a6aff'],
    flow: RP.flows.radial(600, 820, 0.5),
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(600, 800, 100, 1000, ['#ffd23a', '#ff7a1a', '#e0102a', '#6a0a5a', '#1a0a3a']));
      for (let i = 0; i < 14; i++) K.flame(K.R(-50, W + 50), H + 40, K.R(160, 300), K.R(400, 900), null, K.R(-80, 80));
      K.blob(600, 300, 500, '#4a0a6a', 0.6);
      const F = K.head({ x: 600, y: 760, s: 400, turn: 0.04, tilt: 0.04, jaw: 0.2, width: 0.82 });
      const T = F.T;
      K.hairBack(F, { len: 1.5, w: 1.18, colors: ['#4a2a8a', '#2a1460', '#140838', '#08041a'], focus: 0.4 });
      K.face(F, {
        skin: ['#c8e05a', '#5ab04a', '#3a3a9a', '#1a0a3a'], glow: '#f0ffa0', cheek: '#ff6a3a', cheek2: '#5a2aa0',
        eyes: 'half', brow: 'furrow', mouth: 'roar', gaze: [0.2, 0.2], tilak: 'ash', browW: 0.07, browHair: '#2a1a3a',
        patches: [[0.4, 0.25, 0.25, '#ff4a8a', 0.45], [-0.45, 0.35, 0.22, '#ffb02a', 0.5], [0.0, -0.75, 0.3, '#ffe060', 0.4]],
        contourColor: '#14063a', contourLight: '#ffe04a', lips: '#5a0a2a', lips2: '#8a1a3a', mouthW: 0.28, mouthY: 0.66, irisR: 0.05,
        iris: '#7a1a0a', iris2: '#e04a1a', white: '#fff2c8',
      });
      K.mustache(F, { strands: ['#1a0a14', '#2a1440', '#4a2a6a', '#0a0408'], curl: 0.15, n: 60, w: 0.045 });
      K.crown(F, { h: 0.65, bw: 0.85, jewels: ['#3ad0a0', '#e0102a'] });
      K.earrings(F, { r: 0.13, gem: '#3ad0a0' });
      K.overlay((pen) => {
        // sleep still in the eyes: heavy lid bags
        for (const side of [-1, 1]) pen.line([T(side * 0.3 - 0.13, 0.08), T(side * 0.3, 0.12), T(side * 0.3 + 0.13, 0.08)], { w: F.s * 0.015, color: '#2a1a5a', alpha: 0.6 });
      });
    },
  };
})();
