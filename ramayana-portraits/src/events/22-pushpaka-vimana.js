// Yuddha Kanda — the victors fly home in the Pushpaka, the flying palace "like a swan", and Rama points out to Sita the
// places of their exile one by one: the bridge, Kishkindha, Panchavati, Chitrakuta, and at last Ayodhya.
(function () {
  RP.events['22-pushpaka-vimana'] = {
    title: 'Flying Home in the Pushpaka Vimana',
    W: 1800, H: 1200, seed: 1313,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ffffff', '#ff6ab0', '#3ad0ff', '#8affc0'],
    flow: (x, y, n) => -0.2 + n(x * 0.002, y * 0.002) * 1.2,
    turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#ff8ac0', '#ffc88a', '#fff0b0', '#8ad0ff', '#3a8ad0']));
      K.blob(1500, 200, 260, '#ffffff', 0.9);
      for (let i = 0; i < 8; i++) K.blob(K.R(0, W), K.R(200, 650), K.R(120, 220), '#ffffff', 0.55);
      // the land below: river, fields, the white city on the horizon
      K.fill(K.poly([[0, 820], [W, 760], [W, H], [0, H]]), K.lin(0, 760, 0, H, ['#8ad08a', '#3aa06a', '#1a6a5a']));
      K.strokeRef([[0, 1100], [400, 1000], [800, 1060], [1300, 900], [1800, 860]], 40, '#7ad0ff');
      for (let i = 0; i < 6; i++) K.palace(1480 + i * 50, 800, 44, K.R(40, 70), { roof: 'dome', colors: ['#ffffff', '#fff0d8', '#d8a8c8', '#7a4a8a'], flag: false, focus: 0.4 });
      // the flying palace: a golden swan-prowed pavilion
      const cx = 820, cy = 600;
      const hull = K.path([[cx - 460, cy + 40], [cx + 380, cy + 40], [cx + 470, cy - 40], [cx + 540, cy - 200], [cx + 500, cy - 230], [cx + 420, cy - 120], [cx + 340, cy + 120], [cx - 380, cy + 140]]);
      K.fill(hull, K.split(cx - 460, cy, cx + 540, cy, ['#fff6b0', '#ffd23a', '#e08a2a', '#7a3a1a'])); K.focus(hull, 0.7);
      const wing = K.path([[cx - 420, cy + 60], [cx - 640, cy - 60], [cx - 560, cy + 40], [cx - 700, cy + 40], [cx - 520, cy + 120]]);
      K.fill(wing, K.split(cx - 700, cy, cx - 420, cy, ['#ffffff', '#fff0c0', '#e0b06a', '#8a5a2a'])); K.focus(wing, 0.6);
      K.palace(cx - 120, cy + 30, 300, 120, { roof: 'shikhara', colors: ['#fff6d8', '#ffd890', '#d0905a', '#6a3a4a'], focus: 0.55, flag: '#ff3a5a' });
      // passengers: Rama pointing, Sita, Lakshmana, Hanuman
      const rama = K.figure({ x: cx + 140, y: cy + 210, h: 440, skin: ['#9ef0ff', '#3fa8f0', '#2a52c8', '#22167a'], head: 'crown', turn: 0.3, cloth: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'], scarf: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'], pose: { legs: 'hidden', armL: K.poses.rest, armR: [1.9, 0.2] }, face: { eyes: 'soft', mouth: 'smile', tilak: 'vaishnava', gaze: [0.8, 0.3] } });
      K.figure({ x: cx + 290, y: cy + 210, h: 410, female: true, skin: ['#ffe6b8', '#f2a46e', '#c0507a', '#4a1a5a'], head: 'veil', turn: 0.3, top: ['#ff5a3a', '#e0182a', '#9a0a3a', '#4a0a3a'], cloth: ['#ff5a3a', '#e0182a', '#9a0a3a', '#4a0a3a'], pose: { legs: 'hidden', armL: K.poses.chest, armR: K.poses.lap }, face: { eyes: 'open', mouth: 'smile', tilak: 'bindi', gaze: [0.8, 0.4] } });
      K.figure({ x: cx - 20, y: cy + 210, h: 420, skin: ['#ffe85a', '#ff9a2a', '#1aa08a', '#1a3a8a'], head: 'crown', crown: { h: 0.7 }, turn: 0.3, cloth: ['#ff5a8a', '#e0185a', '#7a0a4a', '#2a0a2a'], pose: { legs: 'hidden', armL: K.poses.rest, armR: K.poses.rest }, face: { eyes: 'open', mouth: 'smile', tilak: 'vaishnava', gaze: [0.8, 0.2] } });
      K.vanara({ x: cx - 220, y: cy + 210, h: 400, turn: 0.4, gaze: 1, smile: 1, tilak: true, crownSmall: true, pose: { legs: 'hidden', armL: K.poses.anjali, armR: K.poses.anjali }, fur: ['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'] });
      // the rail in front of them
      const rail = K.poly([[cx - 380, cy + 10], [cx + 400, cy + 10], [cx + 380, cy + 60], [cx - 400, cy + 60]]);
      K.fill(rail, K.lin(cx - 400, 0, cx + 400, 0, ['#fff6b0', '#ffc22a', '#c0601a'])); K.focus(rail, 0.85);
      K.overlay((pen) => {
        pen.line([[cx - 380, cy + 12], [cx + 400, cy + 12]], { w: 8, color: '#fffbe0', taper: 0 });
        for (let k = 0; k < 14; k++) pen.dab(cx - 360 + k * 54, cy + 36, 10, K.pick(['#e0102a', '#14a05a', '#3a6aff', '#ffffff']));
        // swan head
        pen.fill(K.ell(cx + 525, cy - 222, 30, 22, -0.4), '#ffffff');
        pen.dab(cx + 535, cy - 228, 5, '#140a20');
        pen.fill(K.poly([[cx + 550, cy - 220], [cx + 600, cy - 205], [cx + 550, cy - 205]]), '#ff9a1a');
        // trailing ribbons and flowers
        for (let k = 0; k < 4; k++) pen.line([[cx - 440, cy + 70 + k * 20], [cx - 600, cy + 120 + k * 30], [cx - 760, cy + 90 + k * 40]], { w: 10, color: K.pick(['#ff3a5a', '#ffd23a', '#3ad0a0']), taper: 0.8 });
      });
      K.petals(90, [0, 0, W, 900], ['#ff6ab0', '#ffffff', '#ffd23a']);
    },
  };
})();
