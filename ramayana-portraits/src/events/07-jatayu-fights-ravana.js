// Aranya Kanda — Ravana carries Sita off through the sky in his golden chariot. The aged vulture-king Jatayu flies at him,
// shatters the chariot and fights until Ravana cuts off his wings. Sita lets her jewellery fall as a trail.
(function () {
  RP.events['07-jatayu-fights-ravana'] = {
    title: 'Jatayu Fights Ravana in the Sky',
    W: 1800, H: 1200, seed: 4004,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff3a1a', '#ffffff', '#3ad0ff', '#8a3aff'],
    flow: RP.flows.swirl(950, 520),
    turbulence: 0.7,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#1a1a6a', '#6a1a8a', '#e0302a', '#ff8a2a', '#3a1a6a']));
      K.blob(1450, 900, 260, '#ffd23a', 0.7);
      // the land far below
      K.mountain([[0, 1200], [0, 1000], [300, 930], [600, 1010], [900, 950], [1300, 1020], [1800, 940], [1800, 1200]], ['#3ab07a', '#1a7a5a', '#0a4a4a', '#0a2a3a'], 0.2);
      // Ravana's flying chariot
      const ch = K.chariot(620, 760, 420, { dir: 1, flag: '#e0102a' });
      const ravana = K.figure({ x: 600, y: 760, h: 620, skin: ['#ffc05a', '#e86a2a', '#5a2a8a', '#1a0a3a'], head: 'crown', crown: { h: 1.1 }, turn: 0.35, mustache: '#100816', curl: 0.5,
        cloth: ['#7a2aa0', '#4a1a7a', '#2a0a4a', '#0a0418'], scarf: ['#ffd23a', '#e08a1a', '#7a3a1a', '#2a0a0a'],
        pose: { legs: 'hidden', armL: [0.9, -1.4], armR: [2.4, 0.2] }, face: { eyes: 'fierce', brow: 'angry', mouth: 'roar', tilak: 'tripundra', gaze: [0.9, -0.2] } });
      // extra heads fanned behind his crown, hinting at all ten
      for (let k = 0; k < 4; k++) for (const sd of [-1, 1]) {
        const hx = 600 + sd * (60 + k * 46) + 10, hy = 760 - 0.935 * 620 + k * 12 + 10;
        K.smallHead(hx, hy, 26 - k * 2, { skin: ['#ffc05a', '#e86a2a', '#5a2a8a', '#1a0a3a'], focus: 0.75 });
        K.fill(K.poly([[hx - 16, hy - 20], [hx, hy - 52], [hx + 16, hy - 20]]), '#ffc22a');
      }
      // Sita struggling in his grip, dropping her ornaments
      const sita = K.figure({ x: 420, y: 840, h: 520, rot: -0.5, female: true, skin: ['#ffe6b8', '#f2a46e', '#c0507a', '#4a1a5a'], head: 'long', turn: -0.4,
        top: ['#fff27a', '#ffc21a', '#e08a1a', '#7a3a1a'], cloth: ['#fff27a', '#ffc21a', '#e08a1a', '#7a3a1a'], long: true,
        pose: { armL: [2.3, 0.3], armR: [1.2, 0.5] }, face: { eyes: 'wide', brow: 'sad', mouth: 'open', tilak: 'bindi', gaze: [-0.6, -0.4], tears: true } });
      // Ravana's sword raised against the bird
      const [rx, ry] = ravana.handR;
      K.overlay((pen) => {
        pen.line([[rx, ry], [rx + 120, ry - 170]], { w: 16, color: '#e8f0ff', taper: 0.4 });
        pen.line([[rx - 22, ry + 16], [rx + 22, ry - 16]], { w: 12, color: '#ffd23a', taper: 0 });
        // falling jewellery
        for (let k = 0; k < 10; k++) pen.dab(300 + K.R(-40, 60), 900 + k * 28, K.R(6, 10), K.pick(['#ffd23a', '#e0102a', '#14c08a']));
      });
      // Jatayu diving in, wings spread
      const jx = 1260, jy = 420;
      const wingPts = (sx, sy, a0, a1, len) => {
        for (let k = 0; k < 12; k++) {
          const t = k / 11, a = a0 + (a1 - a0) * t, L = len * (0.6 + 0.4 * Math.sin(t * Math.PI));
          const tip = [sx + Math.cos(a) * L, sy + Math.sin(a) * L];
          const f = K.path([[sx, sy], [sx + Math.cos(a) * L * 0.5 - Math.sin(a) * 30, sy + Math.sin(a) * L * 0.5 + Math.cos(a) * 30], tip, [sx + Math.cos(a) * L * 0.5 + Math.sin(a) * 30, sy + Math.sin(a) * L * 0.5 - Math.cos(a) * 30]]);
          K.fill(f, K.lin(sx, sy, tip[0], tip[1], ['#3a1420', '#8a4a22', '#e8c08a', '#ffffff'])); K.focus(f, 0.7);
          K.flowStroke([[sx, sy], tip], 40);
        }
      };
      wingPts(jx - 40, jy, -2.9, -1.7, 420);
      wingPts(jx + 60, jy, -1.4, -0.2, 420);
      const body = K.ell(jx, jy + 80, 110, 170, -0.5);
      K.fill(body, K.lin(jx - 110, 0, jx + 110, 0, ['#e8b07a', '#8a4a2a', '#3a1420'])); K.focus(body, 0.7);
      const head = K.ell(jx - 120, jy + 150, 70, 60);
      K.fill(head, K.lin(jx - 190, 0, jx - 50, 0, ['#fff4e0', '#e0c0a0', '#8a6a7a'])); K.focus(head, 0.95);
      const beak = K.path([[jx - 170, jy + 130], [jx - 260, jy + 160], [jx - 290, jy + 200], [jx - 250, jy + 190], [jx - 175, jy + 175]]);
      K.fill(beak, K.lin(jx - 290, 0, jx - 170, 0, ['#ffd23a', '#ff9a1a', '#7a3a10'])); K.focus(beak, 1);
      K.overlay((pen) => {
        pen.fill(K.ell(jx - 140, jy + 135, 13, 12), '#ffd21a'); pen.fill(K.ell(jx - 142, jy + 135, 6, 6), '#0a0408');
        pen.line([[jx - 175, jy + 115], [jx - 140, jy + 112], [jx - 110, jy + 122]], { w: 9, color: '#3a0a2a' });
        // talons
        for (let k = 0; k < 3; k++) pen.line([[jx - 30 + k * 18, jy + 230], [jx - 70 + k * 14, jy + 300], [jx - 90 + k * 14, jy + 290]], { w: 9, color: '#ffc22a', taper: 0.6 });
        // feathers torn loose
        for (let k = 0; k < 16; k++) { const x = K.R(900, 1500), y = K.R(300, 900), a = K.R(0, 3); pen.line([[x, y], [x + Math.cos(a) * 40, y + Math.sin(a) * 40]], { w: 10, color: K.pick(['#fff4e0', '#e8c08a', '#8a4a2a']), taper: 1 }); }
      });
    },
  };
})();
