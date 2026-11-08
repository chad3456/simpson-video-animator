// Finale — Deepavali. Ayodhya lit its lamps to welcome Rama home, and India still does: families light rows of diyas,
// draw rangoli and set fireworks against the night, while the silhouettes of Rama and Sita look down from a glowing cloud.
(function () {
  RP.events['25-happy-diwali'] = {
    title: 'Happy Diwali',
    W: 1800, H: 1200, seed: 1616,
    layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff8a1a', '#ff3a8a', '#ffffff', '#3ad0ff'],
    flow: (x, y, n) => (y < 620 ? Math.atan2(y - 300, x - 900) + Math.PI / 2 : 0.15) + n(x * 0.002, y * 0.002) * 0.9,
    turbulence: 0.6,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#06041e', '#1a0a4a', '#3a1260', '#8a2a5a', '#e0703a']));
      K.blob(250, 150, 260, '#2a1a7a', 0.6);
      K.blob(1550, 140, 260, '#2a1a7a', 0.6);
      // the glowing cloud and the radiance behind Rama and Sita
      K.fill(K.ell(900, 330, 470, 300), K.rad(890, 300, 10, 470, ['#fffbe0', '#ffe48a', '#ffb04a', '#c0507a', 'rgba(60,20,100,0)']));
      [[560, 520, 170, 95], [740, 560, 200, 100], [960, 570, 220, 105], [1180, 545, 190, 95], [1330, 500, 140, 80], [470, 470, 110, 70],
        [650, 470, 130, 80], [1120, 470, 140, 85]].forEach(([x, y, rx, ry]) => {
        const c = K.patch(x, y, rx, ry, 0);
        K.fill(c, K.lin(x, y - ry, x, y + ry, ['#fff6e0', '#ffd8a8', '#e890b0', '#7a4aa0']));
        K.focus(c, 0.4);
      });
      // silhouettes of Rama (bow in hand, raising his hand in blessing) and Sita (veiled, palms joined)
      const ink = '#140a36';
      const sil = (p) => { K.fill(p, ink); K.focus(p, 0.95); };
      const rx = 820;
      sil(K.ell(rx, 150, 25, 31));
      sil(K.path([[rx - 24, 132], [rx - 20, 96], [rx - 8, 84], [rx, 64], [rx + 8, 84], [rx + 20, 96], [rx + 24, 132]]));
      sil(K.limbPath([rx, 170], [rx, 200], 14, 16));
      sil(K.path([[rx - 50, 196], [rx - 54, 220], [rx - 34, 300], [rx - 58, 420], [rx - 62, 520], [rx + 62, 520], [rx + 58, 420], [rx + 34, 300], [rx + 54, 220], [rx + 50, 196], [rx, 186]]));
      sil(K.limbPath([rx - 48, 202], [rx - 66, 290], 15, 12)); sil(K.limbPath([rx - 66, 290], [rx - 84, 350], 12, 10));
      sil(K.limbPath([rx + 48, 202], [rx + 64, 280], 15, 12)); sil(K.limbPath([rx + 64, 280], [rx + 68, 226], 12, 11));
      sil(K.patch(rx + 68, 216, 12, 16, 0.1));
      K.strokeRef([[rx - 100, 150], [rx - 128, 260], [rx - 132, 350], [rx - 124, 440], [rx - 98, 540]], 12, ink);
      K.strokeRef([[rx - 100, 150], [rx - 98, 540]], 3, ink);
      const sx = 975;
      sil(K.ell(sx, 186, 21, 26));
      sil(K.path([[sx - 26, 182], [sx - 20, 152], [sx, 146], [sx + 22, 154], [sx + 34, 200], [sx + 52, 290], [sx + 40, 300], [sx + 22, 220]]));
      sil(K.limbPath([sx, 206], [sx, 228], 11, 13));
      sil(K.path([[sx - 40, 226], [sx - 42, 250], [sx - 26, 320], [sx - 50, 430], [sx - 56, 520], [sx + 56, 520], [sx + 50, 430], [sx + 28, 320], [sx + 44, 250], [sx + 40, 226], [sx, 218]]));
      sil(K.limbPath([sx - 38, 232], [sx - 30, 296], 12, 10)); sil(K.limbPath([sx - 30, 296], [sx, 270], 10, 9));
      sil(K.limbPath([sx + 38, 232], [sx + 30, 296], 12, 10)); sil(K.limbPath([sx + 30, 296], [sx + 2, 268], 10, 9));
      sil(K.path([[sx - 6, 276], [sx, 240], [sx + 6, 276]]));
      // cloud wisps drifting across their feet
      [[700, 540, 220, 55], [900, 560, 260, 60], [1080, 540, 200, 50]].forEach(([x, y, a, b]) => K.fill(K.patch(x, y, a, b, 0), K.lin(x, y - b, x, y + b, ['#fff6e0', '#ffc8b0', '#d880b0'])));
      // the town below: houses lit for Deepavali
      for (let i = 0; i < 10; i++) {
        const x = 40 + i * 190 + K.R(-20, 20);
        K.palace(x, 900, K.R(160, 200), K.R(150, 240), { roof: i % 3 ? 'dome' : 'shikhara', colors: ['#ffd8a0', '#e88a5a', '#9a3a5a', '#3a1040'], roofColors: ['#ffb07a', '#e0604a', '#8a2a4a', '#2a0a30'], lit: true, flag: K.pick(['#ff7a1a', '#ffd23a', '#ff3a7a']), focus: 0.45 });
      }
      K.fill(K.poly([[0, 900], [W, 900], [W, H], [0, H]]), K.lin(0, 900, 0, H, ['#8a2a4a', '#5a1a4a', '#2a0a2a']));
      // rangoli on the courtyard
      for (const [cx, cy] of [[400, 1110], [1400, 1110]]) {
        [[110, '#ff3a6a'], [85, '#ffd23a'], [60, '#3ad0a0'], [36, '#ff8a1a'], [14, '#ffffff']].forEach(([r, c]) => { const e = K.ell(cx, cy, r, r * 0.38); K.fill(e, c); K.focus(e, 0.8); });
      }
      // families celebrating, holding lamps and sparklers
      K.crowd(-20, 1830, 1080, 2, { scale: 1.1, lamps: true, offerings: true, raised: 0.55, colors: ['#ff4a3a', '#ffd23a', '#ff8a1a', '#3ad0a0', '#ff5aa0', '#6a5aff', '#ffffff'] });
      K.overlay((pen) => {
        // rows of diyas on the rooftops, the ledge and the ground
        const diya = (x, y, s) => { pen.fill(K.ell(x, y, s, s * 0.4), '#c0501a'); pen.line([[x, y - s * 0.2], [x - s * 0.2, y - s * 0.9], [x, y - s * 1.6]], { w: s * 0.5, color: '#fff3a0', taper: 0.9 }); pen.dab(x, y - s * 0.8, s * 0.9, '#ffb02a', 0.35); };
        for (let x = 20; x < W; x += 46) diya(x + K.R(-6, 6), 905, 13);
        for (let x = 30; x < W; x += 64) diya(x + K.R(-10, 10), 1180, 17);
        // fireworks bursting on either side of the cloud
        const burst = (cx, cy, r, cols) => {
          for (let k = 0; k < 28; k++) {
            const a = (k / 28) * Math.PI * 2, r1 = r * K.R(0.25, 0.4), r2 = r * K.R(0.85, 1.1);
            pen.line([[cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a) * r2, cy + Math.sin(a) * r2]], { w: K.R(4, 7), color: K.pick(cols), taper: 0.8, alpha: 0.95 });
            pen.dab(cx + Math.cos(a) * r2 * 1.08, cy + Math.sin(a) * r2 * 1.08, 5, K.pick(cols));
          }
          pen.dab(cx, cy, r * 0.12, '#ffffff');
        };
        burst(220, 220, 150, ['#ff3a8a', '#ffd23a', '#ffffff']);
        burst(1580, 200, 160, ['#3ad0ff', '#ffffff', '#a07aff']);
        burst(420, 560, 95, ['#ffd23a', '#ff8a1a', '#fff3a0']);
        burst(1420, 640, 100, ['#3aff9a', '#ffd23a', '#ffffff']);
        burst(120, 640, 70, ['#ff5a3a', '#ffd23a']);
        burst(1700, 520, 75, ['#ff3a8a', '#fff3a0']);
        // sky lanterns rising
        for (let k = 0; k < 10; k++) { const x = K.pick([K.R(40, 520), K.R(1300, 1760)]), y = K.R(330, 820); pen.fill(K.patch(x, y, 9, 12, 0), '#ffb02a'); pen.dab(x, y + 4, 6, '#fff3a0'); }
      });
      K.sparks(120, [0, 850, W, H], ['#fff3a0', '#ffd23a', '#ffffff']);
    },
  };
})();
