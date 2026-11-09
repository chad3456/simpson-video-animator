// 12 — Nandi Waits: the bull Nandi, Shiva's mount and first devotee, sits facing his lord forever. Far up the peak a
// light burns where Shiva sits in meditation; the northern sky ripples above Kailash.
(function () {
  RP.shiva = RP.shiva || {};
  RP.shiva['12-nandi-waits'] = {
    title: 'Nandi Waits', W: 1800, H: 1200, seed: 6112, layers: RP.eventLayers,
    accents: ['#3affd0', '#8a5aff', '#ffffff', '#ffd23a', '#3a8aff'],
    flow: (x, y, n) => (y < 600 ? 0.2 : 0.6) + n(x * 0.0015, y * 0.002) * 1.6, turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#04041a', '#0a2a5a', '#2a5ab0', '#5a4ab0', '#1a1a3a']));
      // aurora curtains
      for (let k = 0; k < 4; k++) K.fill(K.path([[0, 160 + k * 60], [500, 80 + k * 80], [1000, 220 + k * 50], [1500, 100 + k * 70], [1800, 200 + k * 60], [1800, 300 + k * 70], [1300, 230 + k * 60], [800, 360 + k * 50], [300, 240 + k * 70], [0, 300 + k * 60]]), K.pick(['rgba(58,255,208,0.35)', 'rgba(138,90,255,0.35)', 'rgba(90,200,255,0.3)']));
      K.overlay((pen) => { for (let k = 0; k < 160; k++) pen.dab(K.R(0, W), K.R(0, 650), K.R(1.5, 4), '#ffffff', K.R(0.5, 1)); });
      K.mountain([[600, 900], [1150, 260], [1700, 900]], ['#ffffff', '#c8d8ff', '#6a7ad0', '#1a1a5a'], 0.4);
      K.mountain([[0, 960], [300, 640], [620, 900], [1800, 900], [1800, 1000], [0, 1000]], ['#c8d8ff', '#7a8ad0', '#3a3a8a', '#0a0a2a'], 0.3);
      // the light of the meditating Shiva at the summit
      K.blob(1150, 330, 120, '#fff6c0', 1); K.blob(1150, 330, 260, '#ffd23a', 0.4);
      K.shiva({ x: 1150, y: 345 + 0.44 * 110, h: 110, pose: { legs: 'lotus', armL: K.poses.lap, armR: K.poses.lap }, vasuki: false });
      K.fill(K.path([[0, 1200], [0, 980], [700, 940], [1800, 990], [1800, 1200]]), K.lin(0, 940, 0, H, ['#e8f0ff', '#9aa8e0', '#4a4a8a', '#14143a']));
      K.lingam(1430, 1080, 150, { flowers: true });
      K.blob(560, 950, 340, '#c8d8ff', 0.35);
      K.nandi(480, 1150, 560, { dir: 1 });
    },
  };
})();
