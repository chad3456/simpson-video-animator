// Kishkindha Kanda — on Mount Rishyamuka near Lake Pampa, Hanuman, sent by Sugriva, approaches the two brothers; hearing
// Rama speak, he bows with joined palms. Their friendship begins here.
(function () {
  RP.events['05-rama-meets-hanuman'] = {
    title: 'Rama Meets Hanuman at Rishyamuka',
    W: 1800, H: 1200, seed: 5005,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff6a3a', '#ffffff', '#3ad0ff', '#ff6ab0'],
    flow: (x, y, n) => (y > 820 ? 0.05 : 0.5) + n(x * 0.002, y * 0.002) * 1.6,
    turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#3a8aff', '#8ad0ff', '#ffe0a0', '#ff9a5a']));
      K.blob(300, 230, 230, '#fff8d0', 0.9);
      K.mountain([[0, 900], [200, 420], [420, 520], [640, 300], [900, 520], [1150, 360], [1400, 560], [1650, 330], [1800, 450], [1800, 900]], ['#ffb07a', '#c86a5a', '#6a3a7a', '#2a1a4a'], 0.25);
      K.fill(K.poly([[0, 760], [W, 760], [W, 880], [0, 880]]), K.lin(0, 760, 0, 880, ['#7ad0ff', '#2a8ad0'])); // Lake Pampa
      K.fill(K.poly([[0, 850], [W, 840], [W, H], [0, H]]), K.lin(0, 840, 0, H, ['#ffc86a', '#c87a3a', '#6a3a2a']));
      for (let k = 0; k < 18; k++) K.blob(K.R(0, W), K.R(780, 860), 22, K.pick(['#ff6ab0', '#ffffff', '#ffd23a']), 1); // lotuses
      K.tree(1680, 1000, 760, { leaves: ['#8aff7a', '#3ac06a', '#0a7a5a', '#0a3a3a'] });
      // Rama and Lakshmana
      const rama = K.figure({ x: 620, y: 1150, h: 860, skin: ['#9ef0ff', '#3fa8f0', '#2a52c8', '#22167a'], head: 'jata', hairColors: ['#3a2a7a', '#22164a', '#120a2a', '#06030e'], ascetic: true, earrings: false,
        cloth: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], scarf: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], turn: 0.3,
        pose: { armL: [0.3, 0.1], armR: [0.9, -1.6] }, face: { eyes: 'soft', mouth: 'smile', tilak: 'vaishnava', gaze: [0.8, 0.3] } });
      K.bowAt([rama.handL[0], rama.handL[1] - 60], 560, -1.5, { w: 14 });
      K.figure({ x: 380, y: 1150, h: 800, skin: ['#ffe85a', '#ff9a2a', '#1aa08a', '#1a3a8a'], head: 'jata', hairColors: ['#3a2a7a', '#22164a', '#120a2a', '#06030e'], ascetic: true, earrings: false,
        cloth: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], turn: 0.3, pose: { armL: K.poses.rest, armR: K.poses.rest }, face: { eyes: 'open', mouth: 'calm', tilak: 'vaishnava', gaze: [0.8, 0.2] } });
      // Hanuman kneeling, palms joined
      K.vanara({ x: 1130, y: 1150, h: 760, turn: -0.4, gaze: -1, smile: 1, tilak: true, crownSmall: true,
        pose: { legs: 'kneel', armL: K.poses.anjali, armR: K.poses.anjali },
        fur: ['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'], cloth: ['#ff4a3a', '#d0101a', '#7a0a2a', '#2a0a1a'], scarf: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'] });
      // Sugriva and the vanaras watching from the rocks
      for (const [x, y, h] of [[1450, 820, 260], [1560, 800, 230], [1340, 790, 220]]) K.vanara({ x, y, h, turn: -0.5, fur: ['#d8a06a', '#a0603a', '#5a2a2a', '#2a0a14'], pose: { armL: K.poses.rest, armR: K.poses.chest } });
      K.petals(70, [0, 0, W, 1100], ['#ff6ab0', '#ffffff', '#ffd23a']);
    },
  };
})();
