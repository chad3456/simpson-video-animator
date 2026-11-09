// Ayodhya Kanda (sarga 88) — on Chitrakuta Rama shows Sita the mountain: "Look, Vaidehi, at its peaks of many colours,
// silver, red and blue, its waterfalls and flowering trees, the kinnaras singing. Living here with you, I do not miss the
// kingdom."
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['13-rama-shows-sita-chitrakuta'] = {
    title: 'Rama Shows Sita the Beauty of Chitrakuta', W: 1800, H: 1200, seed: 5113, layers: RP.eventLayers,
    accents: ['#ffd23a', '#3ad0a0', '#ffffff', '#ff8ac0', '#5a7aff'],
    flow: (x, y, n) => 0.2 + n(x * 0.002, y * 0.002) * 1.3, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#7ab0ff', '#bfe0ff', '#fff6d0', '#ffd0a0', '#7ab06a']));
      // many-coloured peaks
      K.mountain([[700, 900], [900, 360], [1050, 200], [1200, 320], [1380, 180], [1560, 340], [1850, 560], [1850, 900]], ['#ffd0f0', '#c08ae0', '#6a4ab0', '#2a1a6a'], 0.4);
      K.mountain([[1000, 900], [1180, 520], [1300, 600], [1450, 430], [1700, 640], [1850, 900]], ['#ffe0a0', '#e08a5a', '#a04a5a', '#4a1a3a'], 0.4);
      K.overlay((pen) => { for (const x of [1210, 1470]) for (let k = 0; k < 14; k++) pen.line([[x + K.R(-14, 14), 560 + (x - 1210) * 0.2 + K.R(0, 40)], [x + K.R(-30, 30), 900]], { w: K.R(2, 5), color: K.pick(['#ffffff', '#c8f0ff']), alpha: 0.7, taper: 0.6 }); });
      for (let i = 0; i < 5; i++) K.tree(120 + i * 150, 920, K.R(300, 460), { leaves: ['#a0ffb0', '#3ad07a', '#0a8a5a', '#0a4a3a'], flowers: ['#ff8ac0', '#ffd23a', '#ff5a3a'], n: 6 });
      K.fill(K.poly([[0, 900], [W, 880], [W, H], [0, H]]), K.lin(0, 880, 0, H, ['#9ad06a', '#4a8a4a', '#1a4a2a']));
      // on a rock ledge: Rama pointing out the peaks, Sita leaning on his shoulder
      K.fill(K.path([[260, 1200], [300, 1040], [700, 1000], [1000, 1060], [1050, 1200]]), K.split(260, 0, 1050, 0, ['#e8d0b0', '#a08a7a', '#5a4a5a', '#2a1a2a']));
      K.sita({ x: 560, y: 1080, h: 760, turn: 0.4, look: 'forest', pose: { armL: [0.6, -1.4], armR: K.poses.chest }, face: { eyes: 'open', mouth: 'smile', gaze: [0.9, -0.3] } });
      K.rama({ x: 760, y: 1080, h: 840, turn: 0.4, look: 'forest', pose: { armL: K.poses.rest, armR: [2.1, 0.2] }, face: { gaze: [0.9, -0.3] } });
      K.petals(80, [0, 0, W, 900], ['#ff8ac0', '#ffd23a', '#ffffff']);
    },
  };
})();
