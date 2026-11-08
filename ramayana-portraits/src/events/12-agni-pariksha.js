// Yuddha Kanda — before the assembled vanaras and rakshasas, Sita enters the blazing fire to prove her purity. Agni himself
// rises from the flames and returns her, unharmed, to Rama.
(function () {
  RP.events['12-agni-pariksha'] = {
    title: 'Agni Pariksha — Sita Walks Through Fire',
    W: 1800, H: 1200, seed: 1212,
    layers: RP.eventLayers,
    accents: ['#fff6b0', '#ffd23a', '#ff3a1a', '#3ad0ff', '#ffffff'],
    flow: RP.flows.rising(1.2),
    turbulence: 0.8,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#1a0a4a', '#4a0a5a', '#a0102a', '#ff5a1a', '#ffd23a']));
      K.fill(K.poly([[0, 1020], [W, 1020], [W, H], [0, H]]), K.lin(0, 1020, 0, H, ['#7a2a1a', '#2a0a14']));
      // onlookers: Rama, Lakshmana, Hanuman, vanaras
      K.figure({ x: 260, y: 1150, h: 760, skin: ['#9ef0ff', '#3fa8f0', '#2a52c8', '#22167a'], head: 'crown', turn: 0.45, cloth: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'], scarf: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'], pose: { armL: [0.3, 0.1], armR: K.poses.chest }, face: { eyes: 'down', brow: 'sad', mouth: 'calm', tilak: 'vaishnava', gaze: [0.8, 0.2] } });
      K.figure({ x: 470, y: 1160, h: 640, skin: ['#ffe85a', '#ff9a2a', '#1aa08a', '#1a3a8a'], head: 'crown', crown: { h: 0.7 }, turn: 0.4, cloth: ['#ff5a8a', '#e0185a', '#7a0a4a', '#2a0a2a'], pose: { armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'sad', brow: 'sad', mouth: 'sad', tilak: 'vaishnava', gaze: [0.8, 0] } });
      K.vanara({ x: 1450, y: 1170, h: 640, turn: -0.4, gaze: -1, tilak: true, crownSmall: true, pose: { legs: 'kneel', armL: K.poses.anjali, armR: K.poses.anjali }, fur: ['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'] });
      for (const [x, h] of [[1640, 520], [1300, 380], [1200, 340], [640, 360]]) K.vanara({ x, y: 1030, h, turn: -0.3, fur: ['#d8a06a', '#a0603a', '#5a2a2a', '#2a0a14'], pose: { armL: K.poses.anjali, armR: K.poses.anjali } });
      // the pyre
      K.blob(900, 760, 420, '#fff6b0', 0.85);
      for (let i = 0; i < 22; i++) K.flame(900 + K.R(-280, 280), 1060, K.R(140, 260), K.R(500, 980), null, K.R(-60, 60));
      // Sita, serene within the flames, palms joined
      K.figure({ x: 900, y: 1040, h: 760, female: true, skin: ['#fff4c8', '#ffc070', '#d04a6a', '#5a1a6a'], head: 'long', turn: 0,
        top: ['#fff27a', '#ffc21a', '#e08a1a', '#7a3a1a'], cloth: ['#ff4a3a', '#e0182a', '#9a0a3a', '#4a0a3a'], scarf: ['#fff27a', '#ffc21a', '#e08a1a', '#7a3a1a'], long: true,
        pose: { armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'closed', mouth: 'smile', tilak: 'bindi' } });
      K.overlay((pen) => {
        for (let k = 0; k < 36; k++) { const a = (k / 36) * Math.PI * 2; pen.line([[900 + Math.cos(a) * 120, 330 + Math.sin(a) * 120], [900 + Math.cos(a) * 170, 330 + Math.sin(a) * 170]], { w: 6, color: '#fff6c0', alpha: 0.75, taper: 1 }); }
        for (let i = 0; i < 9; i++) pen.line([[620 + i * 70, 1080], [660 + i * 60, 1030]], { w: 22, color: '#5a1a0a', taper: 0 }); // logs
      });
      K.sparks(140, [500, 100, 1300, 1050]);
    },
  };
})();
