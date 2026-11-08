// Yuddha Kanda — the coronation (pattabhisheka) in Ayodhya. Rama and Sita sit on the throne; Shatrughna holds the white
// umbrella, Sugriva and Vibhishana wave white whisks, Vayu brings a garland of a hundred golden lotuses, and Hanuman kneels
// at Rama's feet.
(function () {
  RP.events['24-coronation'] = {
    title: 'The Coronation of Rama',
    W: 1800, H: 1200, seed: 1515,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ffffff', '#ff3a5a', '#3ad0a0', '#8a5aff'],
    flow: RP.flows.radial(900, 420, 0.3),
    turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(900, 420, 40, 1200, ['#fff8d0', '#ffd23a', '#ff8a1a', '#d0204a', '#5a0a4a', '#1a0a3a']));
      // canopy and pillars
      for (const x of [260, 1540]) {
        const p = K.poly([[x - 40, 1200], [x - 40, 120], [x + 40, 120], [x + 40, 1200]]);
        K.fill(p, K.lin(x - 40, 0, x + 40, 0, ['#fff6b0', '#ffc22a', '#a0501a'])); K.focus(p, 0.35); K.flow(p, Math.PI / 2);
      }
      K.fill(K.path([[180, 140], [520, 40], [900, 0], [1280, 40], [1620, 140], [1620, 200], [180, 200]]), K.lin(180, 0, 1620, 0, ['#ff3a3a', '#c0102a', '#ff3a3a']));
      K.fill(K.poly([[0, 1060], [W, 1060], [W, H], [0, H]]), K.lin(0, 1060, 0, H, ['#ffd890', '#c07a4a']));
      // the throne
      const back = K.path([[640, 1000], [600, 480], [700, 300], [900, 240], [1100, 300], [1200, 480], [1160, 1000]]);
      K.fill(back, K.split(600, 0, 1200, 0, ['#fff6b0', '#ffd23a', '#d0802a', '#6a2a10'])); K.focus(back, 0.5);
      K.fill(K.poly([[560, 1060], [1240, 1060], [1240, 960], [560, 960]]), K.lin(560, 0, 1240, 0, ['#ff5a3a', '#c0102a', '#6a0a2a']));
      // Rama and Sita enthroned
      const rama = K.figure({ x: 800, y: 1020, h: 720, skin: ['#9ef0ff', '#3fa8f0', '#2a52c8', '#22167a'], head: 'crown', crown: { h: 1.1 }, turn: 0.1,
        cloth: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'], scarf: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'],
        pose: { legs: 'sit', armL: K.poses.lap, armR: K.poses.blessing }, face: { eyes: 'soft', mouth: 'smile', tilak: 'vaishnava', gaze: [0.1, 0.3] } });
      const sita = K.figure({ x: 1000, y: 1020, h: 670, female: true, skin: ['#ffe6b8', '#f2a46e', '#c0507a', '#4a1a5a'], head: 'veil', turn: -0.1,
        top: ['#ff5a3a', '#e0182a', '#9a0a3a', '#4a0a3a'], cloth: ['#ff5a3a', '#e0182a', '#9a0a3a', '#4a0a3a'], veil: ['#ff5a3a', '#e0182a', '#9a0a3a', '#4a0a3a'],
        pose: { legs: 'sit', armL: K.poses.lap, armR: K.poses.lap }, face: { eyes: 'soft', mouth: 'smile', tilak: 'bindi', lashes: true, gaze: [-0.1, 0.3] } });
      K.crown && sita.headF && K.crown(sita.headF, { h: 0.6, bw: 0.7, wings: false });
      // Shatrughna with the white umbrella, Lakshmana and Bharata with whisks
      const shat = K.figure({ x: 470, y: 1100, h: 700, skin: ['#ffe8a0', '#f0a050', '#7a3a8a', '#2a1a4a'], head: 'crown', crown: { h: 0.7 }, turn: 0.35, cloth: ['#7ae0ff', '#2aa0e0', '#1a4aa0', '#0a1a4a'], pose: { armL: [2.6, 0.1], armR: K.poses.rest }, face: { eyes: 'open', mouth: 'smile', tilak: 'vaishnava', gaze: [0.7, -0.3] } });
      K.umbrella(shat.handL[0] + 230, shat.handL[1] - 120, 200);
      for (const [x, sk, cl, side] of [[300, ['#ffe85a', '#ff9a2a', '#1aa08a', '#1a3a8a'], ['#ff5a8a', '#e0185a', '#7a0a4a', '#2a0a2a'], 1], [1340, ['#ffe08a', '#f08a3a', '#8a3a9a', '#2a1a6a'], ['#8affc0', '#2ac07a', '#0a6a5a', '#0a2a2a'], -1]]) {
        const f = K.figure({ x, y: 1120, h: 660, skin: sk, head: 'crown', crown: { h: 0.7 }, turn: 0.35 * side, cloth: cl, pose: { armL: side > 0 ? K.poses.rest : [2.0, 0.6], armR: side > 0 ? [2.0, 0.6] : K.poses.rest }, face: { eyes: 'open', mouth: 'smile', tilak: 'vaishnava', gaze: [0.6 * side, -0.2] } });
        const hnd = side > 0 ? f.handR : f.handL;
        K.overlay((pen) => { pen.line([hnd, [hnd[0] + side * 30, hnd[1] - 90]], { w: 8, color: '#ffd23a' }); for (let k = 0; k < 10; k++) pen.line([[hnd[0] + side * 30, hnd[1] - 90], [hnd[0] + side * (40 + K.R(-30, 30)), hnd[1] - 200 - K.R(0, 40)]], { w: 7, color: '#ffffff', taper: 1 }); });
      }
      // Hanuman kneeling at the feet
      K.vanara({ x: 1380, y: 1160, h: 520, turn: -0.5, gaze: -1, smile: 1, tilak: true, crownSmall: true, pose: { legs: 'kneel', armL: K.poses.anjali, armR: K.poses.anjali }, fur: ['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'], cloth: ['#ff4a3a', '#d0101a', '#7a0a2a', '#2a0a1a'] });
      // the garland of a hundred golden lotuses, and the guru's blessing light
      K.overlay((pen) => {
        const g = RP.sampleCurve([[690, 520], [800, 760], [900, 800], [1000, 760], [1110, 520]], 10);
        g.forEach((p, i) => pen.dab(p[0], p[1], 12, i % 2 ? '#ffd23a' : '#ff9a1a'));
        for (let k = 0; k < 30; k++) { const a = -Math.PI / 2 + (k - 15) * 0.09; pen.line([[900 + Math.cos(a) * 520, 600 + Math.sin(a) * 520], [900 + Math.cos(a) * 600, 600 + Math.sin(a) * 600]], { w: 5, color: '#fff6c0', alpha: 0.7, taper: 1 }); }
      });
      K.petals(160, [0, 0, W, 1000]);
    },
  };
})();
