// Yuddha Kanda — the final duel. Indra sends his own chariot with the charioteer Matali; on Agastya's counsel Rama
// fires the Brahmastra, blazing like the fire of destruction, into Ravana's heart.
(function () {
  RP.events['11-rama-slays-ravana'] = {
    title: 'Rama Looses the Brahmastra at Ravana',
    W: 1800, H: 1200, seed: 1111,
    layers: RP.eventLayers,
    accents: ['#ffffff', '#ffd23a', '#ff3a1a', '#3ad0ff', '#8a3aff'],
    flow: (x, y, n) => -0.15 + n(x * 0.002, y * 0.002) * 1.4,
    turbulence: 0.8,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, W, 0, ['#2a6ae0', '#8a5ad0', '#ff5a3a', '#c0102a', '#3a0a2a']));
      K.blob(300, 260, 380, '#c8e8ff', 0.7);
      K.blob(1500, 300, 400, '#2a0a1a', 0.6);
      K.fill(K.poly([[0, 1000], [W, 980], [W, H], [0, H]]), K.lin(0, 980, 0, H, ['#c86a3a', '#6a2a2a', '#2a0a1a']));
      // Rama on Indra's chariot, drawing the bow
      K.horse(330, 1000, 300, { dir: 1, colors: ['#ffffff', '#e0e8ff', '#9aa8d8', '#3a4a8a'] });
      K.horse(230, 1040, 300, { dir: 1, colors: ['#ffffff', '#e0e8ff', '#9aa8d8', '#3a4a8a'] });
      K.chariot(520, 1060, 380, { dir: 1, flag: '#ffd23a', colors: ['#ffffff', '#ffe68a', '#d0a03a', '#6a4a1a'] });
      const rama = K.figure({ x: 520, y: 1000, h: 760, skin: ['#9ef0ff', '#3fa8f0', '#2a52c8', '#22167a'], head: 'crown', turn: 0.45,
        cloth: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'], scarf: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'],
        pose: { legs: 'hidden', armL: [1.6, 0.05], armR: [1.35, -1.9] }, face: { eyes: 'fierce', brow: 'furrow', mouth: 'grim', tilak: 'vaishnava', gaze: [1, 0] } });
      const [bx, by] = rama.handL;
      K.bowAt([bx + 20, by], 620, -1.52, { w: 16, pull: rama.handR, flip: true });
      // Ravana's chariot and its ten heads, recoiling
      K.chariot(1430, 1060, 420, { dir: -1, flag: '#3a0a3a', colors: ['#c8a0ff', '#7a3aa0', '#3a1a5a', '#140828'] });
      const rav = K.figure({ x: 1440, y: 1000, h: 820, skin: ['#ffc05a', '#e86a2a', '#5a2a8a', '#1a0a3a'], head: 'crown', crown: { h: 1.1 }, turn: -0.4, mustache: '#100816', curl: 0.5,
        cloth: ['#7a2aa0', '#4a1a7a', '#2a0a4a', '#0a0418'], scarf: ['#ffd23a', '#e08a1a', '#7a3a1a', '#2a0a0a'],
        pose: { legs: 'hidden', armL: [2.2, 0.4], armR: [1.4, 0.6] }, face: { eyes: 'wide', brow: 'angry', mouth: 'roar', tilak: 'tripundra', gaze: [-1, 0] } });
      for (let k = 0; k < 4; k++) for (const sd of [-1, 1]) {
        if (sd < 0 && k === 4) continue;
        const hx = 1440 + sd * (78 + k * 62), hy = 1000 - 0.935 * 820 + k * 16;
        K.smallHead(hx, hy, 34 - k * 2, { skin: ['#ffc05a', '#e86a2a', '#5a2a8a', '#1a0a3a'], focus: 0.8 });
        K.fill(K.poly([[hx - 22, hy - 26], [hx, hy - 70], [hx + 22, hy - 26]]), '#ffc22a');
      }
      K.figure({ x: 1250, y: 1000, h: 400, skin: ['#ffc05a', '#e86a2a', '#5a2a8a', '#1a0a3a'], head: 'none', cloth: ['#7a2aa0', '#4a1a7a', '#2a0a4a', '#0a0418'], pose: { legs: 'hidden', armL: [0.5, -1.2], armR: [0.5, -1.2] } });
      // the Brahmastra in flight, a streak of fire from bow to heart
      K.overlay((pen) => {
        const y0 = rama.handR[1] - 10;
        pen.line([[bx + 30, y0], [1300, y0 + 30], [1420, 1000 - 0.62 * 820]], { w: 14, color: '#ffffff', taper: 0.2 });
        pen.line([[bx + 30, y0], [1300, y0 + 30], [1420, 1000 - 0.62 * 820]], { w: 40, color: '#ffd23a', alpha: 0.5, taper: 0.4 });
        for (let k = 0; k < 40; k++) { const t = K.R(0, 1), x = bx + 30 + t * (1390 - bx), y = y0 + t * (1000 - 0.62 * 820 - y0); pen.line([[x, y], [x - K.R(30, 90), y + K.R(-30, 30)]], { w: K.R(3, 8), color: K.pick(['#fff6a0', '#ffd23a', '#ff7a1a']), taper: 1 }); }
        // arrows filling the sky
        for (let k = 0; k < 30; k++) { const x = K.R(500, 1300), y = K.R(80, 500), a = K.R(-0.4, 0.4) + (K.rand() < 0.5 ? 0 : Math.PI); pen.line([[x, y], [x + Math.cos(a) * 70, y + Math.sin(a) * 70]], { w: 4, color: '#2a0a2a', taper: 0.2 }); }
      });
    },
  };
})();
