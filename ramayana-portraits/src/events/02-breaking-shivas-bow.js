// Bala Kanda — in King Janaka's court at Mithila, before Vishvamitra and the assembled kings, Rama lifts Shiva's great bow,
// strings it, and draws it until it breaks in the middle with a sound like thunder. Sita waits with the victor's garland.
(function () {
  RP.events['02-breaking-shivas-bow'] = {
    title: "Rama Breaks Shiva's Bow",
    W: 1800, H: 1200, seed: 1001,
    layers: RP.eventLayers,
    accents: ['#ffffff', '#ffd23a', '#3ad0ff', '#ff3a6a', '#8a5aff'],
    flow: RP.flows.radial(900, 300, 0.2),
    turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(900, 300, 30, 1200, ['#ffffff', '#c8f0ff', '#5aa0ff', '#7a2ab0', '#c0102a', '#3a0a2a']));
      // pillared hall of Mithila
      for (const x of [120, 380, 1420, 1680]) {
        const p = K.poly([[x - 45, 1200], [x - 45, 160], [x + 45, 160], [x + 45, 1200]]);
        K.fill(p, K.lin(x - 45, 0, x + 45, 0, ['#ffd890', '#e08a3a', '#7a2a3a'])); K.focus(p, 0.3); K.flow(p, Math.PI / 2);
      }
      K.fill(K.poly([[0, 0], [W, 0], [W, 120], [0, 120]]), K.lin(0, 0, W, 0, ['#7a1a3a', '#c0302a', '#7a1a3a']));
      K.fill(K.poly([[0, 1040], [W, 1040], [W, H], [0, H]]), K.lin(0, 1040, 0, H, ['#c06a3a', '#6a2a3a']));
      // the assembled kings watching
      K.crowd(150, 560, 1060, 2, { scale: 1.0, raised: 0.3, colors: ['#ff4a3a', '#ffd23a', '#3ad0a0', '#6a5aff', '#ffffff'] });
      K.crowd(1240, 1650, 1060, 2, { scale: 1.0, raised: 0.3, colors: ['#ff4a3a', '#ffd23a', '#3ad0a0', '#6a5aff', '#ffffff'] });
      // Vishvamitra (left) and Lakshmana
      K.figure({ x: 330, y: 1150, h: 560, skin: ['#ffd890', '#e0904a', '#8a4a6a', '#3a1a4a'], cloth: ['#ffb84a', '#ff7a1a', '#b0401a', '#4a1a1a'], scarf: ['#ffb84a', '#ff7a1a', '#b0401a', '#4a1a1a'], head: 'jata', hairColors: ['#ffffff', '#e0e0f0', '#a0a0d0', '#5a5a9a'], strands: ['#ffffff', '#d0d0ff'], beard: 1.2, ascetic: true, turn: 0.4, pose: { armL: K.poses.rest, armR: K.poses.blessing }, face: { eyes: 'soft', gaze: [0.7, -0.4], mouth: 'smile', tilak: 'ash', browInk: '#ffffff' } });
      K.figure({ x: 560, y: 1150, h: 600, skin: ['#ffe85a', '#ff9a2a', '#1aa08a', '#1a3a8a'], cloth: ['#ff5a8a', '#e0185a', '#7a0a4a', '#2a0a2a'], head: 'crown', crown: { h: 0.7 }, turn: 0.45, pose: { armL: K.poses.rest, armR: K.poses.hip }, face: { eyes: 'wide', gaze: [0.8, -0.4], mouth: 'smile', tilak: 'vaishnava' } });
      // Sita with the varamala garland
      const sita = K.figure({ x: 1360, y: 1150, h: 640, female: true, skin: ['#ffe6b8', '#f2a46e', '#c0507a', '#4a1a5a'], head: 'veil', turn: -0.45, top: ['#ff5a3a', '#e0182a', '#9a0a3a', '#4a0a3a'], cloth: ['#ff5a3a', '#e0182a', '#9a0a3a', '#4a0a3a'], long: true, pose: { armL: [0.5, -1.4], armR: [0.5, -1.4] }, face: { eyes: 'soft', gaze: [-0.8, -0.3], mouth: 'smile', tilak: 'bindi', lashes: true } });
      K.blob(900, 260, 220, '#ffffff', 0.9);
      // Rama, centre, arms raised, the bow snapping above him
      const rama = K.figure({
        x: 900, y: 1170, h: 900, skin: ['#9ef0ff', '#3fa8f0', '#2a52c8', '#22167a'], head: 'crown', turn: 0,
        cloth: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'], scarf: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'],
        pose: { legs: 'stride', armL: [2.35, 0.35], armR: [2.35, 0.35] },
        face: { eyes: 'fierce', mouth: 'calm', tilak: 'vaishnava', gaze: [0, -0.5], brow: 'furrow' },
      });
      const [lx, ly] = rama.handL, [rx, ry] = rama.handR;
      K.overlay((pen) => {
        // two halves of the broken bow
        pen.line([[lx - 260, ly + 70], [lx - 120, ly - 20], [lx, ly], [lx + 110, ly - 60], [880, ly - 150]], { w: 30, color: '#5a1a0a', taper: 0.3 });
        pen.line([[920, ly - 150], [rx - 110, ry - 60], [rx, ry], [rx + 120, ry - 20], [rx + 260, ry + 70]], { w: 30, color: '#5a1a0a', taper: 0.3 });
        for (const pts of [[[lx - 260, ly + 70], [lx, ly], [880, ly - 150]], [[920, ly - 150], [rx, ry], [rx + 260, ry + 70]]]) pen.line(pts, { w: 8, color: '#ffc04a', alpha: 0.8, taper: 0.5 });
        // the thunder-crack at the break
        for (let k = 0; k < 40; k++) { const a = K.R(0, Math.PI * 2), r0 = K.R(20, 60), r1 = r0 + K.R(60, 260); pen.line([[900 + Math.cos(a) * r0, ly - 150 + Math.sin(a) * r0], [900 + Math.cos(a) * r1, ly - 150 + Math.sin(a) * r1]], { w: K.R(3, 9), color: K.pick(['#ffffff', '#c8f0ff', '#fff6a0']), taper: 1 }); }
        pen.dab(900, ly - 150, 40, '#ffffff');
        // garland in Sita's hands
        const g = RP.sampleCurve([[sita.handL[0], sita.handL[1]], [(sita.handL[0] + sita.handR[0]) / 2, sita.handL[1] + 90], [sita.handR[0], sita.handR[1]]], 8);
        g.forEach((p, i) => pen.dab(p[0], p[1], 11, ['#ff3a5a', '#ffffff', '#ffd23a'][i % 3]));
      });
    },
  };
})();
