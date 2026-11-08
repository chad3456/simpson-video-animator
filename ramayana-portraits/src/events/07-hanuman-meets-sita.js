// Sundara Kanda — Hanuman finds Sita in the Ashoka grove at night, beneath the shimshapa tree, and gives her Rama's signet ring
// so that she will trust he is Rama's messenger. Valmiki describes her thin with grief, in a single faded yellow garment,
// guarded by sleeping rakshasis.
(function () {
  RP.events['07-hanuman-meets-sita'] = {
    title: "Hanuman Offers Rama's Ring to Sita",
    W: 1800, H: 1200, seed: 7007,
    layers: RP.eventLayers,
    accents: ['#ff3a2a', '#ffd23a', '#3ad0a0', '#ffffff', '#8a6aff'],
    flow: (x, y, n) => 0.25 + n(x * 0.002, y * 0.002) * 1.6,
    turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, H, ['#0a1a5a', '#14307a', '#0a5a6a', '#0a4a3a', '#06241e']));
      K.blob(1530, 180, 300, '#cfe8ff', 0.9); K.blob(1530, 180, 95, '#ffffff', 1); // moon
      K.blob(1150, 650, 360, '#3a8aa0', 0.5);
      // shimshapa tree behind Sita, its canopy full of red ashoka blossom
      const trunk = K.limbPath([300, 1250], [360, 300], 170, 110);
      K.fill(trunk, K.lin(200, 0, 460, 0, ['#8a4a3a', '#4a1a2a', '#1a0814'])); K.focus(trunk, 0.35); K.flow(trunk, Math.PI / 2);
      K.strokeRef([[360, 380], [600, 220], [950, 160], [1250, 230]], 70, '#3a1424');
      for (let i = 0; i < 34; i++) {
        const x = K.R(-50, 1350), y = K.R(-40, 360);
        K.fill(K.patch(x, y, K.R(80, 140), K.R(60, 100), 0), K.pick(['#0a7a5a', '#14a06a', '#0a5a4a', '#1a8a7a']), 0.95);
        for (let j = 0; j < 3; j++) K.blob(x + K.R(-60, 60), y + K.R(-40, 40), K.R(22, 40), K.pick(['#ff2a1a', '#ff7a1a', '#e0102a', '#ffb02a']), 1);
      }
      // sleeping rakshasi guards far off
      for (const [x, y] of [[1050, 1010], [1250, 1050], [1700, 1000]]) {
        K.fill(K.ell(x, y, 110, 40, 0.06), K.lin(x - 110, y, x + 110, y, ['#7a3aa0', '#3a1460', '#140828']), 0.95);
        K.fill(K.ell(x - 95, y - 22, 30, 26), '#4a7a4a', 0.95);
      }
      // Sita, mid-shot, thin with grief, in a single faded yellow garment
      const sita = K.figure({
        x: 600, y: 1990, h: 1520, female: true,
        skin: ['#ffe6b8', '#f2a46e', '#a04a7a', '#3a1a4a'], cloth: ['#fff2a0', '#e8c04a', '#a0702a', '#4a2a2a'], top: ['#fff4b0', '#ecc450', '#a8702a', '#4a2a2a'],
        scarf: ['#fff0a0', '#e0b84a', '#9a6a2a', '#4a2a2a'], border: '#c08a2a', head: 'veil', veil: ['#fff0a0', '#e0b84a', '#9a6a2a', '#4a2a2a'], turn: 0.3,
        pose: { legs: 'stand', armL: K.poses.chest, armR: [1.0, 0.25] }, earrings: false,
        face: { eyes: 'soft', gaze: [0.85, 0.1], brow: 'sad', mouth: 'calm', tilak: 'bindi', tears: true, lashes: true,
          patches: [[0.42, 0.3, 0.25, '#7a6aff', 0.35], [-0.4, -0.5, 0.25, '#fff4d0', 0.4]] },
      });
      // Hanuman, humble, holding up the ring, tail curled behind him
      const han = K.vanara({
        x: 1360, y: 1720, h: 1100, turn: -0.45, gaze: -1, smile: 1, tilak: true, crownSmall: true,
        pose: { legs: 'stand', armL: [1.75, 0.75], armR: K.poses.chest },
        cloth: ['#ff6a3a', '#e0301a', '#8a0a2a', '#3a0a1a'], scarf: ['#ffd23a', '#ff9a1a', '#c0501a', '#5a1a1a'],
      });
      K.blob(han.handL[0], han.handL[1] - 10, 110, '#fff6b0', 0.85);
      K.overlay((pen) => {
        const [rx, ry] = [han.handL[0], han.handL[1] - 18];
        pen.line([[rx - 18, ry], [rx, ry - 16], [rx + 18, ry], [rx, ry + 16], [rx - 18, ry]], { w: 8, color: '#ffd23a', taper: 0 });
        pen.dab(rx, ry - 18, 9, '#e0102a');
        for (let k = 0; k < 14; k++) { const a = (k / 14) * Math.PI * 2; pen.line([[rx + Math.cos(a) * 30, ry + Math.sin(a) * 30], [rx + Math.cos(a) * 62, ry + Math.sin(a) * 62]], { w: 3.5, color: '#fff6c0', taper: 1 }); }
        for (let k = 0; k < 34; k++) pen.dab(K.R(0, W), K.R(300, 1100), K.R(3, 6), '#e8ffa0', 0.9); // fireflies
        for (let k = 0; k < 26; k++) pen.dab(K.R(0, W), K.R(380, 1200), K.R(5, 9), K.pick(['#ff3a2a', '#ff8a1a']), 0.95); // falling blossoms
      });
    },
  };
})();
