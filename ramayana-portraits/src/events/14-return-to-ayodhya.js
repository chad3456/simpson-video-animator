// Yuddha Kanda — the return to Ayodhya. The city is garlanded with mansions, conches and drums sound, and the citizens pour
// out to welcome Rama and Sita. (Valmiki has Rama on a chariot with Sugriva riding the great elephant Shatrunjaya; here,
// as asked, Rama and Sita ride the royal elephant beneath a white umbrella.)
(function () {
  RP.events['14-return-to-ayodhya'] = {
    title: 'Rama and Sita Welcomed into Ayodhya',
    W: 1800, H: 1200, seed: 1414,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff3a6a', '#ffffff', '#3ad0a0', '#ff8a1a'],
    flow: (x, y, n) => (y < 600 ? 0.1 : 0.3) + n(x * 0.002, y * 0.002) * 1.4,
    turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#3a2ab0', '#a03aa0', '#ff7a5a', '#ffc85a', '#ffe8a0']));
      K.blob(1500, 260, 280, '#fff6c0', 0.8);
      // Ayodhya: white and gold mansions, gate arch, banners
      for (let i = 0; i < 9; i++) {
        const x = 90 + i * 205, h = K.R(260, 420);
        K.palace(x, 760, K.R(150, 200), h, { roof: i % 3 ? 'dome' : 'shikhara', colors: ['#ffffff', '#fff0d8', '#d8a8c8', '#7a4a8a'], roofColors: ['#fff6b0', '#ffd23a', '#e08a2a', '#7a3a1a'], window: '#7a2a5a', flag: K.pick(['#ff7a1a', '#ff3a5a', '#ffd23a']), focus: 0.35 });
      }
      K.fill(K.poly([[0, 760], [W, 760], [W, H], [0, H]]), K.lin(0, 760, 0, H, ['#ffd890', '#f0a060', '#c06a5a']));
      // the royal elephant and its golden howdah
      const el = K.elephant({ x: 800, y: 1260, L: 860, dir: 1, hide: ['#e8e4ff', '#a8a8d8', '#5a5a9a', '#24245a'] });
      const [bx, by] = el.back;
      const seat = K.howdah(bx, by + 10, 470);
      K.umbrella(bx, by - 400, 190);
      const rama = K.figure({
        x: bx - 105, y: by + 230, h: 620, skin: ['#9ef0ff', '#3fa8f0', '#2a52c8', '#22167a'], head: 'crown', turn: 0.15,
        cloth: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'], scarf: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'],
        pose: { legs: 'hidden', armL: K.poses.rest, armR: K.poses.blessing },
        face: { eyes: 'soft', mouth: 'smile', tilak: 'vaishnava', gaze: [0.4, 0.3] },
      });
      const sita = K.figure({
        x: bx + 100, y: by + 235, h: 580, female: true, skin: ['#ffe6b8', '#f2a46e', '#c0507a', '#4a1a5a'], head: 'veil', turn: -0.1,
        top: ['#ff5a3a', '#e0182a', '#9a0a3a', '#4a0a3a'], cloth: ['#ff5a3a', '#e0182a', '#9a0a3a', '#4a0a3a'],
        pose: { legs: 'hidden', armL: K.poses.lap, armR: K.poses.anjali },
        face: { eyes: 'soft', mouth: 'smile', tilak: 'bindi', gaze: [0.2, 0.4] },
      });
      // the howdah's front rail and hanging cloth hide their lower bodies
      const rail = K.path([[bx - 250, by - 80], [bx + 250, by - 80], [bx + 255, by + 15], [bx - 255, by + 15]]);
      K.fill(rail, K.lin(bx - 250, 0, bx + 250, 0, ['#fff3a0', '#ffc22a', '#d0701a', '#6a2010'])); K.focus(rail, 0.85);
      K.overlay((pen) => {
        pen.line([[bx - 230, by - 58], [bx + 230, by - 58]], { w: 10, color: '#fff6c0', taper: 0 });
        for (let k = 0; k < 9; k++) pen.dab(bx - 200 + k * 50, by - 25, 12, K.pick(['#e0102a', '#14a05a', '#3a6aff']));
        for (let k = 0; k < 12; k++) pen.line([[bx - 230 + k * 42, by + 15], [bx - 230 + k * 42, by + 45]], { w: 6, color: '#ffd23a', taper: 0.6 });
      });
      // crowds on both sides, arms raised, offering flowers and lamps
      K.crowd(-20, 470, 1240, 4, { scale: 1.25, offerings: true, lamps: true, raised: 0.6 });
      K.crowd(1270, 1830, 1240, 4, { scale: 1.25, offerings: true, lamps: true, raised: 0.6 });
      K.overlay((pen) => {
        // garlands strung across the street
        for (const [a, b] of [[[0, 520], [600, 560]], [[1150, 560], [1800, 520]]]) {
          const pts = RP.sampleCurve([a, [(a[0] + b[0]) / 2, 640], b], 12);
          pts.forEach((p, i) => pen.dab(p[0], p[1], 9, i % 2 ? '#ff9a1a' : '#ffd23a'));
        }
        // diyas along the road
        for (let k = 0; k < 22; k++) { const x = 30 + k * 82; pen.fill(K.ell(x, 1180, 18, 7), '#c0601a'); pen.line([[x, 1176], [x - 3, 1162], [x, 1146]], { w: 9, color: '#fff3a0', taper: 0.9 }); }
      });
      K.petals(220, [0, 0, W, 1100]);
    },
  };
})();
