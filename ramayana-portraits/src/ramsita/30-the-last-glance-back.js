// Aranya Kanda (sarga 44) — the moment before the story turns: at the edge of the clearing Rama looks back once at Sita,
// standing at the door of their hut at Panchavati, then goes after the deer. The last image of their forest life together.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['30-the-last-glance-back'] = {
    title: 'The Last Glance Back', W: 1200, H: 1800, seed: 5130, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff8a3a', '#ff6ab0', '#ffffff', '#8a5aff'],
    flow: (x, y, n) => 0.8 + n(x * 0.002, y * 0.002) * 1.5, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#5a2a8a', '#c04a8a', '#ff8a5a', '#ffd08a', '#6a5a3a']));
      K.blob(820, 700, 220, '#fff0a0', 0.6);
      for (const [x, h] of [[1150, 1300], [850, 760], [600, 600]]) K.tree(x, 1000, h, { leaves: ['#c06a7a', '#7a3a6a', '#3a1a4a', '#14081a'], n: 6 });
      K.fill(K.path([[0, 1800], [0, 1000], [600, 980], [1200, 1000], [1200, 1800]]), K.lin(0, 980, 0, H, ['#ffd08a', '#c08a4a', '#5a3a2a', '#1a0a10']));
      K.fill(K.path([[260, 1800], [700, 1060], [860, 1020], [900, 1040], [620, 1800]]), K.lin(0, 1000, 0, H, ['#fff0c0', '#e0b08a', '#a07a5a']));
      // Rama on the path, turned back toward her
      const r = K.rama({ x: 820, y: 1180, h: 520, turn: -0.35, look: 'forest', pose: { legs: 'walk', armL: K.poses.rest, armR: [0.5, 0.3] }, face: { eyes: 'soft', mouth: 'calm', gaze: [-0.9, 0.1] } });
      K.bowAt([r.handR[0] + 10, r.handR[1] - 130], 320, -1.6, { w: 9 });
      // the hut door and Sita, large in the foreground
      K.fill(K.poly([[-20, 1800], [-20, 700], [180, 640], [200, 1800]]), K.split(0, 0, 200, 0, ['#e8c890', '#b08a5a', '#6a4a2a', '#2a1a10']));
      K.fill(K.path([[-40, 760], [80, 520], [420, 560], [260, 700]]), K.split(0, 0, 420, 0, ['#ffe08a', '#d0a04a', '#8a6a2a', '#3a2a10']));
      K.sita({ x: 380, y: 2150, h: 1500, turn: 0.35, look: 'forest', pose: { legs: 'hidden', armL: [1.0, -1.6], armR: K.poses.chest }, face: { eyes: 'soft', mouth: 'calm', gaze: [0.9, -0.2] } });
      K.petals(60, [0, 0, W, 1400], ['#ffd23a', '#ff8ac0', '#ffffff']);
    },
  };
})();
