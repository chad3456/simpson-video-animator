// Bala Kanda (sargas 29–30) — guarding Vishvamitra's sacrifice at Siddhashrama. When Maricha and Subahu swoop down
// raining blood on the altar, young Rama strikes Maricha with the Manava weapon and hurls him a hundred yojanas into the
// sea, then burns Subahu with the Agneya weapon.
(function () {
  RP.events['17-rama-guards-the-yajna'] = {
    title: "Rama Guards Vishvamitra's Sacrifice",
    W: 1800, H: 1200, seed: 1717,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff4a1a', '#ffffff', '#3ad0ff', '#a05aff'],
    flow: (x, y, n) => (y < 650 ? -0.35 : 0.1) + n(x * 0.002, y * 0.002) * 1.3,
    turbulence: 0.8,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#ffe8a0', '#ff9a4a', '#c0305a', '#4a1a8a', '#140a3a']));
      K.blob(260, 200, 300, '#fff8d8', 0.8);
      K.blob(1450, 260, 420, '#2a0a4a', 0.75);
      // forest of the ashrama
      for (let i = 0; i < 6; i++) K.tree(80 + i * 330 + K.R(-40, 40), 860, K.R(300, 420), { leaves: ['#7ae07a', '#2aa05a', '#0a6a4a', '#0a3a3a'], n: 6 });
      K.fill(K.poly([[0, 840], [W, 820], [W, H], [0, H]]), K.lin(0, 820, 0, H, ['#7ab04a', '#3a6a3a', '#1a2a2a']));
      // the sacrificial fire and Vishvamitra seated before it
      const altar = K.poly([[1000, 1090], [1260, 1090], [1240, 1030], [1020, 1030]]);
      K.fill(altar, K.split(1000, 0, 1260, 0, ['#ffe0a0', '#d08a4a', '#7a3a2a', '#2a0a1a'])); K.focus(altar, 0.7);
      K.flame(1130, 1040, 170, 300);
      K.figure({ x: 1420, y: 1150, h: 460, skin: ['#ffd8a0', '#e8904a', '#9a4a5a', '#3a1a3a'], head: 'jata', ascetic: true, beard: 1.2, turn: -0.4,
        hairColors: ['#ffffff', '#d8d8e8', '#8a8aa8', '#3a3a5a'], cloth: ['#ffb04a', '#f07a1a', '#a03a1a', '#3a0a1a'],
        pose: { legs: 'lotus', armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'closed', tilak: 'tripundra' } });
      // Maricha and Subahu diving out of the storm
      const m = K.rakshasa(1350, 420, 520, { rot: -2.3, turn: -0.3, legs: 'fly', armL: [2.6, 0.2], armR: [2.6, 0.2] });
      const s2 = K.rakshasa(1000, 260, 380, { rot: -2.0, turn: -0.3, legs: 'fly', armL: [2.6, 0.2], armR: [2.2, 0.5], skin: ['#ff8a6a', '#c03a3a', '#6a1a3a', '#200818'] });
      // young Rama with the drawn bow, Lakshmana beside him
      K.figure({ x: 210, y: 1130, h: 600, skin: ['#ffe0b0', '#f0a870', '#b0605a', '#4a1a3a'], head: 'crown', turn: 0.4,
        cloth: ['#ff9aa0', '#ff4a5a', '#b01a3a', '#3a0a1a'], scarf: ['#ff9aa0', '#ff4a5a', '#b01a3a', '#3a0a1a'],
        pose: { legs: 'stand', armL: [0.3, 0.1], armR: [0.9, -0.6] }, face: { eyes: 'fierce', brow: 'furrow', mouth: 'calm', gaze: [1, -0.3] } });
      const r = K.archer({ x: 470, y: 1150, h: 760, legs: 'stride' });
      K.overlay((pen) => {
        // the Manava weapon streaking up to Maricha in a blaze of white light
        const [bx, by] = r.bow, tx = 1300, ty = 520;
        pen.line([[bx + 130, by], [900, 600], [tx, ty]], { w: 34, color: '#bff0ff', alpha: 0.45, taper: 0.4 });
        pen.line([[bx + 130, by], [900, 600], [tx, ty]], { w: 10, color: '#ffffff', taper: 0.2 });
        for (let k = 0; k < 18; k++) { const a = k / 18 * 6.283; pen.line([[tx, ty], [tx + Math.cos(a) * K.R(60, 130), ty + Math.sin(a) * K.R(60, 130)]], { w: K.R(4, 9), color: K.pick(['#ffffff', '#bff0ff', '#ffd23a']), taper: 1 }); }
        // a fire-arrow for Subahu
        pen.line([[bx + 130, by - 10], [700, 520], [960, 330]], { w: 9, color: '#ffd23a', taper: 0.2 });
        for (let k = 0; k < 14; k++) pen.line([[960 + K.R(-30, 30), 330 + K.R(-30, 30)], [960 + K.R(-40, 40), 330 - K.R(40, 120)]], { w: K.R(8, 16), color: K.pick(['#fff3a0', '#ff8a1a', '#ff3a1a']), taper: 1 });
        // blood-rain the demons scattered, turned to sparks
        for (let k = 0; k < 40; k++) { const x = K.R(900, 1700), y = K.R(500, 900); pen.line([[x, y], [x - 6, y + K.R(20, 50)]], { w: 3, color: K.pick(['#c0102a', '#ff4a3a']), alpha: 0.7, taper: 1 }); }
      });
      K.sparks(90, [950, 700, 1300, 1050]);
    },
  };
})();
