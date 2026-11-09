// Ayodhya Kanda (sargas 109–110) — at Atri's hermitage the aged ascetic Anasuya embraces Sita, praises her devotion,
// and gives her a celestial garland, garments, ornaments and an ointment that will never fade.
(function () {
  RP.ramsita = RP.ramsita || {};
  RP.ramsita['17-anasuya-blesses-sita'] = {
    title: 'Anasuya Blesses Sita', W: 1200, H: 1800, seed: 5117, layers: RP.eventLayers,
    accents: ['#ffd23a', '#ffffff', '#ff8ac0', '#3ad0a0', '#8a5aff'],
    flow: RP.flows.radial(600, 500, 0.1), turbulence: 0.5,
    draw(K) {
      const { W, H } = K;
      K.bg(K.rad(600, 500, 30, 1400, ['#ffffff', '#fff0c0', '#ffc88a', '#a0d08a', '#2a6a5a']));
      K.fill(K.poly([[0, 1300], [W, 1280], [W, H], [0, H]]), K.lin(0, 1280, 0, H, ['#c8e08a', '#6a9a4a', '#2a4a2a']));
      K.altar(220, 1340, 60);
      // Anasuya, white-haired, placing a garland on Sita
      const a = K.figure({ x: 820, y: 1760, h: 1150, female: true, skin: ['#ffe0c0', '#e0a080', '#a0606a', '#3a1a3a'], head: 'veil', veil: ['#ffffff', '#f0f0f8', '#c8c0d8', '#6a6a8a'], top: ['#ffffff', '#f0f0f8', '#c8c0d8', '#6a6a8a'], cloth: ['#ffffff', '#f0f0f8', '#c8c0d8', '#6a6a8a'], long: true, hairColors: ['#ffffff', '#e8e8f0', '#b0b0c8', '#5a5a7a'], turn: -0.35, pose: { armL: [1.2, -0.6], armR: [1.1, -0.5] }, face: { eyes: 'soft', mouth: 'smile', gaze: [-0.8, 0.3] } });
      const s = K.sita({ x: 380, y: 1780, h: 1250, turn: 0.35, look: 'forest', pose: { armL: K.poses.anjali, armR: K.poses.anjali }, face: { eyes: 'down', mouth: 'smile' } });
      K.overlay((pen) => { const pts = RP.sampleCurve([a.handL, [(a.handL[0] + a.handR[0]) / 2 - 40, Math.max(a.handL[1], a.handR[1]) + 100], a.handR], 10); pts.forEach((p, i) => pen.dab(p[0], p[1], 15, ['#ffffff', '#ffd23a', '#ff8ac0'][i % 3])); });
      K.petals(100, [0, 0, W, 1500], ['#ffffff', '#ffd23a', '#ff8ac0']);
    },
  };
})();
