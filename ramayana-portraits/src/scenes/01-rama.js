// 01 — Rama, Maryada Purushottama: blue-skinned prince against a saffron sunburst, Kodanda bow on his shoulder.
(function () {
  RP.scenes = RP.scenes || {};
  RP.scenes['01-rama'] = {
    title: 'Rama — Maryada Purushottama',
    seed: 101,
    accents: ['#ffd23a', '#ff4a1a', '#ff8ac0', '#ffffff', '#2a9aff'],
    flow: RP.flows.radial(600, 470, 0.25),
    draw(K) {
      const { W, H } = K;
      // saffron sunburst behind the head, violet-blue in the lower corners
      K.bg(K.rad(600, 430, 30, 1000, ['#fff6c8', '#ffd23a', '#ff8a1a', '#f2421c', '#c0124a', '#4a1a8a']));
      K.blob(80, 1300, 520, '#2a2ad0', 0.9);
      K.blob(1150, 1350, 480, '#3a1aa0', 0.85);
      K.blob(1120, 200, 300, '#ff5a7a', 0.6);
      K.blob(120, 180, 320, '#ffe24a', 0.6);

      const F = K.head({ x: 600, y: 600, s: 225, turn: -0.12, tilt: -0.03, jaw: 0.42 });
      K.hairBack(F, { len: 2.3, w: 1.0 });
      // Kodanda bow slung over the left shoulder
      K.bow(-260, 980, 640, -0.95, 0.9, { w: 26, color: '#5a1a0a', light: '#ffb84a' });
      const skin = ['#9ef0ff', '#3fa8f0', '#2a52c8', '#22167a'];
      K.bust(F, { colors: skin, sw: 1.85 });
      // pitambara — yellow silk across the chest
      const T = F.T;
      const silk = K.path([T(-1.9, 1.9), T(-1.3, 1.55), T(0.2, 2.6), T(1.6, 3.4), T(1.7, 4.3), T(0.6, 4.3), T(-0.6, 3.3)]);
      K.fill(silk, K.lin(...T(-1.6, 1.8), ...T(1.4, 3.6), ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a']));
      K.focus(silk, 0.55);
      K.flow(silk, 0.62);
      K.face(F, {
        skin, glow: '#d6fbff', cheek: '#7a8aff', cheek2: '#2a2aa0',
        lips: '#9a1a48', lips2: '#d83a6a', tilak: 'vaishnava', gaze: [-0.3, 0], brow: 'calm', mouth: 'calm',
        contourColor: '#1a0a5a', eyes: 'soft',
        patches: [[0.45, 0.35, 0.3, '#b23aa8', 0.55], [-0.35, -0.6, 0.3, '#c8ffe8', 0.5], [0.3, 0.9, 0.35, '#ff9a3a', 0.35], [-0.55, 0.45, 0.2, '#6ad0ff', 0.6], [0.15, -0.35, 0.18, '#7a5aff', 0.4]], contourLight: '#ffffff', noseInk: '#1a1a6a', noseLight: '#e8ffff',
      });
      K.earrings(F, { r: 0.1 });
      K.crown(F, { h: 1.0, bw: 0.82 });
      // vanamala garland and necklaces
      K.necklace([T(-0.55, 1.45), T(-0.3, 1.85), T(0, 1.95), T(0.3, 1.85), T(0.55, 1.45)], { w: 12 });
      K.necklace([T(-0.8, 1.55), T(-0.5, 2.25), T(0, 2.45), T(0.5, 2.25), T(0.8, 1.55)], { w: 10, gems: ['#e0102a'] });
      K.overlay((pen) => {
        const pts = RP.sampleCurve([T(-1.05, 1.6), T(-0.85, 2.7), T(-0.2, 3.35), T(0.5, 3.3), T(1.0, 2.6), T(1.1, 1.6)], 6);
        pts.forEach((p, i) => {
          pen.dab(p[0], p[1], 15, ['#ff2a5a', '#ffffff', '#ffd23a', '#ff6a1a'][i % 4]);
          pen.dab(p[0] + 8, p[1] - 6, 9, '#2aa05a', 0.9);
        });
        // sacred thread
        pen.line([T(-0.9, 1.55), T(-0.2, 2.6), T(0.7, 3.5), T(1.1, 4.2)], { w: 5, color: '#fff8e0', alpha: 0.85, taper: 0 });
      });
      // arrows over the right shoulder (quiver)
      K.arrow(1000, 860, 1130, 420, { tip: '#e8f4ff', fletch: '#ff2a3a' });
      K.arrow(1040, 900, 1180, 470, { tip: '#e8f4ff', fletch: '#2ad0ff' });
    },
  };
})();
