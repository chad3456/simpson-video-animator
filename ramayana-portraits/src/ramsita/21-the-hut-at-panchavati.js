// Aranya Kanda (sarga 15) — at Panchavati, by the Godavari, Lakshmana raises a leaf-hut of clay, bamboo and kusha grass,
// and Rama and Sita stand before their new home among flowering trees, the river shining below.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['21-the-hut-at-panchavati'] = {
    title: 'The Hut at Panchavati', W: 1800, H: 1200, seed: 5121, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff8ac0', '#3ad0ff', '#ffffff', '#3ad07a'],
    flow: (x, y, n) => (y > 800 ? 0.1 : 0.9) + n(x * 0.002, y * 0.002) * 1.3, turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#8ad8ff', '#d8f8ff', '#fff4c0', '#a0e08a', '#2a6a3a']));
      K.mountain([[0, 640], [260, 420], [520, 560], [800, 380], [1100, 540], [1400, 400], [1800, 600], [1800, 700], [0, 700]], ['#c8e0ff', '#8aa8e0', '#5a6ab0', '#2a2a6a'], 0.3);
      K.river([[0, 730], [600, 700], [1200, 720], [1800, 690]], 90);
      for (const [x, h] of [[90, 900], [330, 640], [1480, 700], [1720, 980]]) K.tree(x, 860, h, { leaves: ['#a0ffb0', '#3ad07a', '#0a8a5a', '#0a4a3a'], flowers: ['#ffffff', '#ff8ac0', '#ffd23a'], n: 8 });
      K.fill(K.path([[0, 1200], [0, 800], [700, 770], [1300, 790], [1800, 800], [1800, 1200]]), K.lin(0, 770, 0, H, ['#d0f08a', '#7ab04a', '#2a5a2a']));
      K.hut(1260, 900, 420);
      // Lakshmana finishing the thatch
      K.figure({ x: 1470, y: 930, h: 430, skin: ['#ffe0b0', '#f0a870', '#b0605a', '#4a1a3a'], head: 'jata', ascetic: true, earrings: false, hairColors: ['#3a2a2a', '#22161a', '#120a0e', '#060306'], cloth: K.RS.bark, scarf: K.RS.bark, turn: -0.5, pose: { armL: [2.4, 0.3], armR: [2.6, 0.2] }, face: { eyes: 'open', mouth: 'smile', gaze: [-0.8, -0.4] } });
      // Rama and Sita before their home, hand in hand
      const r = K.rama({ x: 560, y: 1170, h: 840, turn: 0.25, look: 'forest', pose: { armL: K.poses.rest, armR: [0.55, 0.2] }, face: { gaze: [0.6, -0.1] } });
      K.sita({ x: 820, y: 1175, h: 760, turn: 0.15, look: 'forest', pose: { armL: [0.5, 0.2], armR: K.poses.chest }, face: { eyes: 'open', mouth: 'smile', gaze: [0.7, -0.2] } });
      K.bowAt([r.handL[0] - 30, r.handL[1] - 180], 460, -1.5, { w: 12 });
      K.peacock(250, 1120, 170, { dir: 1, fan: true });
      K.petals(70, [0, 0, W, 900], ['#ffd23a', '#ffffff', '#ff8ac0']);
    },
  };
})();
