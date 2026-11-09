// Ayodhya Kanda (sargas 24–27) — when Rama tells Sita of his exile, she refuses to stay behind: "A wife's place is with her
// husband. I will walk ahead of you in the forest, crushing the thorns. Without you, heaven itself would be hell."
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['09-where-you-are-is-ayodhya'] = {
    title: '"I Will Walk Before You in the Forest"', W: 1200, H: 1800, seed: 5109, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff5a3a', '#ffffff', '#3ad0a0', '#8a5aff'],
    flow: (x, y, n) => 0.4 + n(x * 0.002, y * 0.002) * 1.4, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#3a1a6a', '#8a2a7a', '#e0603a', '#ffb04a', '#ffe8a0']));
      // the palace window opening on to a distant forest
      K.fill(K.path([[620, 1100], [620, 420], [800, 260], [980, 420], [980, 1100]]), K.lin(0, 260, 0, 1100, ['#ffe8a0', '#c8f0a0', '#3a9a5a', '#0a4a3a']));
      for (let i = 0; i < 5; i++) K.tree(660 + i * 75, 1100, K.R(220, 320), { leaves: ['#7ae07a', '#2aa05a', '#0a6a4a', '#0a3a3a'], n: 4 });
      K.fill(K.poly([[0, 1600], [W, 1600], [W, H], [0, H]]), K.lin(0, 1600, 0, H, ['#e0a070', '#8a4a4a', '#2a0a1a']));
      // Rama, troubled; Sita resolute, clasping his hand
      K.rama({ x: 360, y: 1760, h: 1300, turn: 0.3, look: 'prince', pose: { armL: K.poses.rest, armR: [0.7, 0.3] }, face: { eyes: 'soft', mouth: 'calm', brow: 'sad', gaze: [0.6, 0.2] } });
      K.sita({ x: 800, y: 1780, h: 1220, turn: -0.35, look: 'princess', saree: ['#fff0a0', '#ffc21a', '#e07a1a', '#7a2a1a'], pose: { armL: [0.75, 0.3], armR: K.poses.chest }, face: { eyes: 'open', mouth: 'calm', gaze: [-0.8, -0.1] } });
    },
  };
})();
