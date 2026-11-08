// Kishkindha Kanda (sarga 12) — to give Sugriva faith, Rama looses a single arrow that pierces seven great sala trees,
// the hill behind them and the earth below, then returns to his quiver.
(function () {
  RP.events['20-seven-sala-trees'] = {
    title: 'One Arrow Through Seven Sala Trees',
    W: 1800, H: 1200, seed: 2020,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ffffff', '#3ad0a0', '#ff6a3a', '#8a5aff'],
    flow: (x, y, n) => (y < 700 ? -0.1 : 0.05) + n(x * 0.002, y * 0.002) * 1.1,
    turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#3a8ae0', '#8ac8ff', '#fff0c0', '#ffb07a', '#5a9a5a']));
      K.blob(1550, 240, 260, '#fff8d8', 0.8);
      K.mountain([[700, 860], [1000, 560], [1250, 480], [1500, 560], [1850, 760], [1850, 860]], ['#c8a8ff', '#8a6ad0', '#4a3a8a', '#1a1a4a'], 0.25);
      K.fill(K.poly([[0, 860], [W, 840], [W, H], [0, H]]), K.lin(0, 840, 0, H, ['#9ad06a', '#4a8a4a', '#1a3a2a']));
      // seven sala trees in a receding row
      const trees = [];
      for (let i = 0; i < 7; i++) {
        const x = 780 + i * 140, base = 900 - i * 6, h = 560 - i * 40;
        trees.push([x, base - h * 0.4]);
        const trunk = K.limbPath([x, base], [x, base - h * 0.75], 34 - i * 2, 22 - i * 2);
        K.fill(trunk, K.lin(x - 30, 0, x + 30, 0, ['#c08a5a', '#7a4a2a', '#2a140a'])); K.focus(trunk, 0.5);
        for (let k = 0; k < 4; k++) { const by = base - h * K.R(0.6, 1.0), r = h * 0.17; K.fill(K.patch(x + K.R(-50, 50), by, r * 0.8, r, 0), K.split(x - r, by, x + r, by, ['#8ae07a', '#3aa05a', '#0a6a4a', '#0a3a3a']), 0.95); }
      }
      // Sugriva and Hanuman watching in wonder
      K.vanara({ x: 660, y: 1150, h: 470, turn: 0.2, gaze: 1, fur: ['#d8a06a', '#a0603a', '#5a2a2a', '#2a0a14'], crownSmall: true, pose: { legs: 'stand', armL: [0.9, -0.4], armR: K.poses.chest } });
      K.vanara({ x: 520, y: 1160, h: 500, turn: 0.2, gaze: 1, tilak: true, fur: ['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'], pose: { legs: 'stand', armL: K.poses.anjali, armR: K.poses.anjali } });
      // Rama and Lakshmana
      K.figure({ x: 90, y: 1170, h: 700, skin: ['#ffe0b0', '#f0a870', '#b0605a', '#4a1a3a'], head: 'jata', ascetic: true, turn: 0.4, earrings: false,
        hairColors: ['#3a2a2a', '#22161a', '#120a0e', '#060306'], cloth: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'],
        pose: { legs: 'stand', armL: [0.3, 0.1], armR: [0.4, 0.1] }, face: { eyes: 'soft', mouth: 'calm', gaze: [1, 0] } });
      const r = K.archer({ x: 300, y: 1170, h: 820, forest: true });
      K.overlay((pen) => {
        // the arrow's path straight through every trunk and into the hill
        const [bx, by] = r.bow, y0 = by;
        const path = [[bx + 140, y0], ...trees.map(([x], i) => [x, y0 + (i + 1) * 6]), [1800, y0 + 60]];
        pen.line(path, { w: 26, color: '#fff6c0', alpha: 0.4, taper: 0.2 });
        pen.line(path, { w: 7, color: '#ffffff', taper: 0 });
        trees.forEach(([x], i) => { const y = y0 + (i + 1) * 6; pen.dab(x, y, 16, '#2a140a'); for (let k = 0; k < 6; k++) pen.line([[x, y], [x + K.R(10, 50), y + K.R(-40, 40)]], { w: 4, color: '#ffe8a0', taper: 1 }); });
      });
      K.petals(60, [700, 300, 1800, 900], ['#ffffff', '#ffe08a', '#ffb0c8']);
    },
  };
})();
