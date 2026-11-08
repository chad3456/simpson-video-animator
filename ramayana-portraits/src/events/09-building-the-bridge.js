// Yuddha Kanda — at the southern shore the vanaras uproot trees and boulders, and under the engineer Nala they build a
// causeway across the ocean to Lanka in five days, while Rama watches from the shore.
(function () {
  RP.events['09-building-the-bridge'] = {
    title: 'Building the Bridge to Lanka',
    W: 1800, H: 1200, seed: 9009,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ffffff', '#3ad0ff', '#ff6a3a', '#8a5aff'],
    flow: (x, y, n) => (y > 600 ? 0.02 : -0.1) + n(x * 0.002, y * 0.002) * 1.0,
    turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, 600, ['#ff7a3a', '#ffc85a', '#fff0b0', '#8ad0ff']));
      K.blob(1300, 380, 220, '#ffffff', 0.9);
      K.fill(K.poly([[0, 560], [W, 560], [W, H], [0, H]]), K.lin(0, 560, 0, H, ['#5ad0ff', '#1a8ad0', '#0a3a9a', '#06206a']));
      K.flow(K.poly([[0, 570], [W, 570], [W, H], [0, H]]), 0.0);
      // Lanka on the horizon
      for (let i = 0; i < 7; i++) K.palace(1560 + i * 36, 575, 32, K.R(30, 70), { roof: 'shikhara', colors: ['#fff6b0', '#ffd23a', '#e0902a', '#7a3a1a'], flag: false, focus: 0.4 });
      // the causeway of boulders running out to sea, narrowing with distance
      for (let i = 0; i < 70; i++) {
        const t = i / 69, x = 260 + t * 1300 + K.R(-20, 20), y = 1100 - t * 500, r = 130 * (1 - t * 0.85);
        K.fill(K.patch(x, y, r, r * 0.55, 0), K.split(x - r, y, x + r, y, ['#fff4e0', '#d8c8b0', '#8a7a8a', '#3a3a5a']));
        K.focus(K.patch(x, y, r, r * 0.55, 0), 0.5);
      }
      // the shore and Rama
      K.fill(K.poly([[0, 940], [500, 1000], [700, 1200], [0, 1200]]), K.lin(0, 940, 0, H, ['#ffe0a0', '#d0a060', '#8a5a3a']));
      const rama = K.figure({ x: 220, y: 1170, h: 780, skin: ['#9ef0ff', '#3fa8f0', '#2a52c8', '#22167a'], head: 'jata', hairColors: ['#3a2a7a', '#22164a', '#120a2a', '#06030e'], ascetic: true, earrings: false,
        cloth: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], scarf: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], turn: 0.4,
        pose: { armL: [0.3, 0.1], armR: K.poses.blessing }, face: { eyes: 'soft', mouth: 'smile', tilak: 'vaishnava', gaze: [0.9, -0.1] } });
      K.bowAt([rama.handL[0], rama.handL[1] - 50], 520, -1.5, { w: 13 });
      // vanaras hauling boulders and trees
      const cy = (x) => 1080 - ((x - 260) / 1300) * 500 + 30;
      const crew = [[640, 0, 440, [1.9, 0.9], [1.9, 0.9]], [880, 0, 360, [2.5, 0.1], [2.5, 0.1]], [1080, 0, 290, [2.4, 0.2], [2.4, 0.2]], [1240, 0, 230, [1.0, 0.4], [2.6, 0.1]], [1380, 0, 180, [2.5, 0.1], [2.5, 0.1]]];
      crew.forEach(([x, y, h, aL, aR], i) => {
        const v = K.vanara({ x, y: cy(x), h, turn: 0.4, gaze: 1, fur: i % 2 ? ['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'] : ['#d8a06a', '#a0603a', '#5a2a2a', '#2a0a14'], pose: { legs: 'walk', armL: aL, armR: aR } });
        if (aL[0] > 2) {
          const cx = (v.handL[0] + v.handR[0]) / 2, cy = Math.min(v.handL[1], v.handR[1]) - h * 0.1;
          K.fill(K.patch(cx, cy, h * 0.2, h * 0.14, 0), K.split(cx - h * 0.2, cy, cx + h * 0.2, cy, ['#e8dccb', '#a89a8a', '#6a5a5a', '#2a2228']));
          K.focus(K.patch(cx, cy, h * 0.2, h * 0.14, 0), 0.8);
          K.overlay((pen) => { pen.dab(cx - h * 0.05, cy - h * 0.03, h * 0.025, '#ff7a1a', 0.8); pen.dab(cx + h * 0.04, cy + h * 0.02, h * 0.02, '#4a3a4a', 0.7); });
        }
      });
      K.waves(600, 1200, { n: 160, colors: ['#ffffff', '#bff0ff', '#5ab0ff'] });
      K.overlay((pen) => {
        // floating stones marked with Rama's name glow faintly
        for (let i = 0; i < 12; i++) { const t = i / 11, x = 300 + t * 1250, y = 1060 - t * 480; pen.dab(x, y - 10, 9 * (1 - t * 0.7), '#ffd23a', 0.9); }
        // gulls
        for (let k = 0; k < 6; k++) { const x = 700 + k * 120, y = 150 + Math.cos(k) * 50; pen.line([[x - 20, y + 6], [x, y], [x + 20, y + 6]], { w: 4, color: '#2a1a4a' }); }
      });
    },
  };
})();
