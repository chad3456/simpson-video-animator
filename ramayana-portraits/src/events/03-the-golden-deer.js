// Aranya Kanda — at the hermitage in Panchavati, by the Godavari, the rakshasa Maricha appears as a golden deer with silver
// spots. Sita, enchanted, asks Rama to catch it; Lakshmana warns that it is an illusion.
(function () {
  RP.events['03-the-golden-deer'] = {
    title: 'The Golden Deer at Panchavati',
    W: 1800, H: 1200, seed: 3003,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff3a6a', '#ffffff', '#3ad0a0', '#8a5aff'],
    flow: (x, y, n) => 1.2 + n(x * 0.002, y * 0.002) * 1.8,
    turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#14a07a', '#3ad07a', '#ffe07a', '#2a9a6a', '#0a4a4a']));
      for (let i = 0; i < 6; i++) K.fill(K.poly([[300 + i * 260, -20], [380 + i * 260, -20], [620 + i * 260, 1100], [480 + i * 260, 1100]]), 'rgba(255,250,190,0.35)');
      for (const [x, h] of [[60, 900], [1650, 950], [1420, 700], [320, 650]]) K.tree(x, 1000, h, { leaves: ['#7aff9a', '#2ac07a', '#0a7a5a', '#0a3a3a'], flowers: ['#ff6ab0', '#ffd23a'] });
      // the Godavari behind, the leaf hut
      K.fill(K.poly([[0, 760], [W, 720], [W, 800], [0, 830]]), K.lin(0, 0, W, 0, ['#5ad0ff', '#2a8ad0', '#5ad0ff']));
      K.fill(K.poly([[0, 800], [W, 780], [W, H], [0, H]]), K.lin(0, 780, 0, H, ['#5ab04a', '#2a7a3a', '#1a4a2a']));
      const hut = K.path([[120, 960], [140, 700], [330, 560], [520, 700], [540, 960]]);
      K.fill(hut, K.lin(120, 0, 540, 0, ['#ffe08a', '#d0a04a', '#8a5a2a', '#3a2010'])); K.focus(hut, 0.4);
      K.fill(K.poly([[290, 960], [290, 800], [380, 800], [380, 960]]), '#2a1008');
      // Lakshmana by the hut, wary
      K.figure({ x: 610, y: 1040, h: 560, skin: ['#ffe85a', '#ff9a2a', '#1aa08a', '#1a3a8a'], head: 'jata', hairColors: ['#3a2a7a', '#22164a', '#120a2a', '#06030e'], ascetic: true, earrings: false,
        cloth: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], turn: 0.3, pose: { armL: K.poses.rest, armR: K.poses.hip }, face: { eyes: 'fierce', brow: 'furrow', mouth: 'grim', tilak: 'vaishnava', gaze: [0.8, 0] } });
      // Sita, pointing at the deer
      const sita = K.figure({ x: 850, y: 1080, h: 680, female: true, skin: ['#ffe6b8', '#f2a46e', '#c0507a', '#4a1a5a'], head: 'veil', veil: ['#fff27a', '#ffc21a', '#e08a1a', '#7a3a1a'], turn: 0.4,
        top: ['#fff27a', '#ffc21a', '#e08a1a', '#7a3a1a'], cloth: ['#fff27a', '#ffc21a', '#e08a1a', '#7a3a1a'], long: true,
        pose: { armL: K.poses.chest, armR: [1.75, 0.1] }, face: { eyes: 'wide', mouth: 'smile', tilak: 'bindi', gaze: [0.9, 0], lashes: true } });
      // Rama, bow in hand, turning to look
      const rama = K.figure({ x: 1080, y: 1100, h: 760, skin: ['#9ef0ff', '#3fa8f0', '#2a52c8', '#22167a'], head: 'jata', hairColors: ['#3a2a7a', '#22164a', '#120a2a', '#06030e'], ascetic: true, earrings: false,
        cloth: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], scarf: ['#e8a04a', '#b0602a', '#6a2a2a', '#2a0a1a'], turn: 0.35,
        pose: { legs: 'walk', armL: [0.3, 0.1], armR: K.poses.hip }, face: { eyes: 'open', mouth: 'calm', tilak: 'vaishnava', gaze: [0.8, 0] } });
      K.bowAt([rama.handL[0], rama.handL[1] - 40], 520, -1.5, { w: 14 });
      // the golden deer in the glade
      K.blob(1470, 820, 220, '#fff6b0', 0.8);
      K.deer(1460, 980, 380, { dir: -1 });
      K.petals(60, [0, 0, W, 900], ['#ff6ab0', '#ffd23a', '#ffffff']);
    },
  };
})();
