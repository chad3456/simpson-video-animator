// Ramcharitmanas (Bala Kanda) — Sita prays at the shrine of Goddess Gauri for the husband her heart has chosen, and the
// image of the goddess smiles and lets fall a garland in blessing.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['02-sita-prays-to-gauri'] = {
    title: 'Sita Prays to Gauri', W: 1200, H: 1800, seed: 5102, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ff5a3a', '#ffffff', '#ff8ac0', '#8a5aff'],
    flow: RP.flows.radial(600, 620, 0.1), turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(600, 620, 30, 1300, ['#fffbe0', '#ffd890', '#ff9a4a', '#c0305a', '#4a1a6a']));
      // temple doorway
      K.fill(K.path([[150, 1800], [150, 520], [300, 300], [600, 180], [900, 300], [1050, 520], [1050, 1800], [930, 1800], [930, 560], [600, 330], [270, 560], [270, 1800]]), K.split(150, 0, 1050, 0, ['#ffe8a0', '#d0904a', '#8a3a2a', '#3a0a1a']));
      // lamps along the door
      K.overlay((pen) => { for (let k = 0; k < 9; k++) for (const x of [210, 990]) { const y = 700 + k * 110; pen.dab(x, y, 12, '#c0601a'); pen.line([[x, y - 6], [x, y - 34]], { w: 9, color: '#fff3a0', taper: 1 }); } });
      // the image of Gauri, glowing
      K.blob(600, 520, 220, '#fff6c0', 0.7);
      K.figure({ x: 600, y: 760, h: 420, female: true, skin: ['#fff0d8', '#ffc0a0', '#e0607a', '#6a1a4a'], head: 'crown', top: ['#ff6a4a', '#e8182a', '#9a0a3a', '#4a0a3a'], cloth: ['#ff6a4a', '#e8182a', '#9a0a3a', '#4a0a3a'], long: true, pose: { legs: 'lotus', armL: K.poses.blessing, armR: K.poses.offer }, face: { eyes: 'soft', mouth: 'smile', tilak: 'bindi' } });
      // Sita kneeling, palms joined, a plate of flowers beside her
      K.sita({ x: 600, y: 1760, h: 1150, turn: 0.0, look: 'princess', saree: ['#fff0a0', '#ffc21a', '#e07a1a', '#7a2a1a'], pose: { legs: 'kneel', armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'closed', mouth: 'calm' } });
      K.overlay((pen) => { pen.fill(K.ell(880, 1720, 110, 30), '#ffd23a'); for (let k = 0; k < 24; k++) pen.dab(880 + K.R(-90, 90), 1700 + K.R(-20, 10), 10, K.pick(['#ff3a6a', '#ffffff', '#ff8a1a'])); });
      K.petals(90, [200, 300, 1000, 1500], ['#ff3a6a', '#ffd23a', '#ffffff']);
    },
  };
})();
