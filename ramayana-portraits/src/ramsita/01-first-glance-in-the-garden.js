// The first glance in King Janaka's flower garden (Pushpa Vatika). Valmiki does not tell this meeting; it comes from
// Tulsidas's Ramcharitmanas (Bala Kanda): Rama, gathering flowers for his guru, sees Sita through the bowers as she goes to
// worship Gauri, and each is lost in the other.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['01-first-glance-in-the-garden'] = {
    title: 'The First Glance in the Garden', W: 1200, H: 1800, seed: 5101, layers: RP.eventLayers,
    accents: ['#ff8ac0', '#ffd23a', '#ffffff', '#3ad0a0', '#a07aff'],
    flow: (x, y, n) => 1.3 + n(x * 0.002, y * 0.002) * 1.8, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#fff6d0', '#c8f0b0', '#5ad08a', '#1a8a6a', '#0a4a4a']));
      for (let i = 0; i < 5; i++) K.fill(K.poly([[200 + i * 220, -20], [280 + i * 220, -20], [420 + i * 220, 1500], [300 + i * 220, 1500]]), 'rgba(255,250,200,0.3)');
      for (const [x, h] of [[100, 1300], [1120, 1250], [600, 900]]) K.tree(x, 1500, h, { leaves: ['#a0ffb0', '#3ad07a', '#0a8a5a', '#0a4a3a'], flowers: ['#ff8ac0', '#ffffff', '#ffd23a'], n: 9 });
      K.fill(K.poly([[0, 1450], [W, 1420], [W, H], [0, H]]), K.lin(0, 1420, 0, H, ['#8ad06a', '#3a8a4a', '#1a4a2a']));
      // Sita in the foreground, turning shyly; Rama glimpsed through the flowering bower behind
      K.rama({ x: 330, y: 1300, h: 900, turn: 0.3, look: 'prince', pose: { armL: [0.5, 0.6], armR: K.poses.rest }, face: { gaze: [0.8, 0.1] } });
      K.overlay((pen) => { for (let k = 0; k < 120; k++) pen.dab(K.R(80, 650), K.R(380, 1250), K.R(6, 12), K.pick(['#ff8ac0', '#ffffff', '#ffd23a', '#ff5a9a']), 0.95); });
      K.sita({ x: 790, y: 1760, h: 1350, turn: -0.35, look: 'princess', pose: { armL: [0.6, 1.0], armR: K.poses.chest }, face: { eyes: 'down', gaze: [-0.6, 0.4] } });
      K.petals(160, [0, 0, W, 1700], ['#ff8ac0', '#ffffff', '#ffd23a', '#ffb0d0']);
    },
  };
})();
