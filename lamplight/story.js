/* Lamplight: the nine acts.
   Each act is driven by one number p (0..1). Narration lines fire at their p,
   steps say how p moves (auto, hold, tap, reach, near, sweep), and draw(p, t, L)
   returns what is on the cloth. The live page and the film share all of it. */
(function (root) {
  const LL = root.LL;
  const K = LL.K, C = LL.cast;
  const { clamp, lerp, seg, ease } = LL;
  const G = 812; // the ground line
  const env = (p, a, b, c, d) => Math.min(seg(p, a, b), 1 - seg(p, c, d));
  const P = (draw, x, y, o) => Object.assign({ draw, x, y, d: 0, ink: 0, puppet: true }, o || {});
  const person = (cast, extra) => (g) => K.person(g, Object.assign({}, cast, extra || {}));
  const walk = (t, on) => (on ? Math.sin(t * 6.5) * 0.85 : 0);
  const glow = (x, y, r, a, col) => (g) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${col || '255,226,160'},${a})`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  };
  const REST = [[-0.15, 0.2], [0.15, 0.3]];
  const BOW = { hold: (g, x, y) => { g.translate(x, y); K.bow(g, 260, 0.1); } };

  function title(act, a) {
    return P((g) => {
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillStyle = K.INK;
      g.font = '46px "Tiro Devanagari Sanskrit", serif';
      g.fillText(act.dev, 0, -78);
      g.font = '600 112px "Cormorant Garamond", Georgia, serif';
      g.fillText(act.title, 0, 18);
      g.font = 'italic 500 40px "Cormorant Garamond", Georgia, serif';
      g.fillText(act.sub, 0, 100);
      g.fillStyle = '#fff4d8';
      for (let i = -6; i <= 6; i++) { g.beginPath(); g.arc(i * 26, 148, 3, 0, 6.28); g.fill(); }
    }, 800, 430, { alpha: a, puppet: false });
  }
  const TITLE = { from: 0, to: 0.05, type: 'auto', film: 3.4 };

  const ACTS = (LL.ACTS = []);

  // ===================================================================== 0
  ACTS.push({
    id: 'wick', title: 'Lamplight', dev: 'दीपः', sub: 'a Ramayana in shadow',
    mood: (p) => ({ drone: p < 0.2 ? 0.5 : 1, flute: p > 0.3 ? 0.7 : 0, scale: [0, 3, 5, 7, 9], seed: 1 }),
    lines: [
      { p: 0.02, text: 'Come closer. Tonight there are no screens to watch. Only a cloth, a lamp, and some very old leather.' },
      { p: 0.1, text: 'My family has carried these puppets from village to village for eleven generations. Tonight, you hold the lamp.' },
      { p: 0.18, text: 'Where the light goes, the story goes. Touch the dark, and light the wick.' },
      { p: 0.38, text: 'Long ago, a poet named Valmiki was walking by the river Tamasa, when he saw two cranes dancing together.' },
      { p: 0.56, text: "A hunter's arrow struck one of them. Its mate cried out, circling, and would not stop." },
      { p: 0.72, text: "Valmiki's grief burst out of him in a new kind of speech, measured, like music. It was the first verse ever made." },
      { p: 0.87, text: 'And with that verse, he began to tell the story of Rama. This is how it goes.' },
    ],
    steps: [
      { from: 0, to: 0.2, type: 'auto', film: 6 },
      { from: 0.2, to: 0.215, type: 'tap', n: 1, hint: 'Touch the dark to light the lamp', film: 1.2 },
      { from: 0.215, to: 0.38, type: 'auto', film: 6.5 },
      { from: 0.38, to: 1, type: 'auto', film: 18 },
    ],
    sfx: [{ p: 0.205, name: 'strike' }, { p: 0.585, name: 'arrow' }, { p: 0.6, name: 'fall' }, { p: 0.72, name: 'chime' }],
    backstage: [[0.185, 0.3]],
    lampOn: (p) => seg(p, 0.205, 0.25),
    lamp: (p, t) => ({ x: 800 + Math.sin(t * 0.3) * 60, y: 460 }),
    draw(p, t, L) {
      const items = [], fx = [];
      if (p < 0.21) fx.push((g) => { // the unlit wick: a single ember waiting
        const a = 0.35 + 0.15 * Math.sin(t * 2.2);
        glow(L.x, L.y, 26, a, '255,140,60')(g);
      });
      items.push(Object.assign(title(this, 1), { alpha: env(p, 0.25, 0.27, 0.34, 0.37) }));
      const a = seg(p, 0.37, 0.41) * (1 - 0.6 * seg(p, 0.93, 1));
      if (a > 0) {
        items.push(P((g) => K.waves(g, 1800, t * 0.6, null, 0.6), 800, 850, { alpha: a, puppet: false }));
        items.push(P((g) => K.tree(g, 380, '#5a9a4a', t, 2), 120, G, { alpha: a, puppet: false }));
        items.push(P((g) => K.tree(g, 300, '#6aa04a', t, 5), 1500, G, { alpha: a, puppet: false, d: 0.18, ink: 0.7 }));
        const grief = seg(p, 0.6, 0.72);
        items.push(P(person(C.valmiki, { arms: [[-0.1, 0.2], [lerp(0.4, 2.3, seg(p, 0.7, 0.76)), lerp(0.4, 0.5, grief)]], headTilt: grief * 0.15 }), 360, G, { s: 1.05, alpha: a }));
        // cranes
        const fallen = seg(p, 0.6, 0.66);
        items.push(P((g) => K.crane(g, t, 0), 1000, G - 10, { s: 1.2, alpha: a }));
        items.push(P((g) => K.crane(g, fallen > 0 ? 0 : t, 1.6), 1180 + fallen * 30, G - 10 + fallen * 40, { s: 1.2, flip: true, rot: -fallen * 1.45, alpha: a }));
        if (p > 0.6) items[items.length - 2].y = G - 10 - Math.abs(Math.sin(t * 3)) * 30 * (1 - seg(p, 0.85, 0.95));
        const fa = seg(p, 0.575, 0.6);
        if (fa > 0 && fa < 1) items.push(P((g) => K.arrow(g, 120), lerp(1750, 1190, fa), lerp(420, 640, fa), { rot: Math.PI + 0.35, puppet: false }));
        const v = env(p, 0.73, 0.77, 0.95, 1);
        if (v > 0) fx.push((g) => {
          g.globalAlpha = v;
          g.font = '58px "Tiro Devanagari Sanskrit", serif';
          g.textAlign = 'center';
          g.fillStyle = 'rgba(255,200,120,0.9)';
          g.fillText('मा निषाद प्रतिष्ठां त्वमगमः शाश्वतीः समाः', 800, 190);
          g.font = 'italic 500 30px "Cormorant Garamond", serif';
          g.fillStyle = 'rgba(255,220,170,0.75)';
          g.fillText('the first verse', 800, 240);
          g.globalAlpha = 1;
        });
      }
      return { items, fx, dim: 1 - 0.35 * seg(p, 0.95, 1) };
    },
  });

  // ===================================================================== 1
  ACTS.push({
    id: 'bow', title: 'The Bow', dev: 'बालकाण्ड', sub: 'Book of Childhood',
    mood: (p) => ({ flute: 0.8, scale: [0, 2, 4, 6, 7, 9, 11], seed: 2, drums: p > 0.38 && p < 0.76 ? 0.25 + 0.5 * seg(p, 0.54, 0.74) : 0, tempo: 96 + 50 * seg(p, 0.54, 0.74) }),
    lines: [
      { p: 0.05, text: 'In the city of Ayodhya, King Dasharatha had four sons. The eldest, Rama, was as calm as deep water.' },
      { p: 0.2, text: 'In Mithila, King Janaka kept a bow that had once belonged to Shiva himself. Whoever could string it would marry his daughter, Sita.' },
      { p: 0.38, text: 'Kings came from everywhere. Kings failed.' },
      { p: 0.5, text: 'Then Rama stepped forward. Hold down the light, and help him bend it.' },
      { p: 0.76, text: 'He bent it so far that it broke, and the crack rolled across the three worlds.' },
      { p: 0.88, text: 'And Sita walked forward and placed a garland of flowers around his neck.' },
    ],
    steps: [TITLE,
      { from: 0.05, to: 0.54, type: 'auto', film: 16 },
      { from: 0.54, to: 0.74, type: 'hold', hint: 'Press and hold to bend the bow', film: 4.5, at: { x: 760, y: 500 } },
      { from: 0.74, to: 1, type: 'auto', film: 9 },
    ],
    sfx: [{ p: 0.43, name: 'fall' }, { p: 0.49, name: 'fall' }, { p: 0.745, name: 'crack' }, { p: 0.96, name: 'chime' }],
    backstage: [[0.6, 0.7]],
    draw(p, t, L) {
      const items = [], fx = [];
      items.push(Object.assign(title(this, 1), { alpha: env(p, 0, 0.01, 0.04, 0.055) }));
      // Ayodhya: the princes
      const a1 = env(p, 0.05, 0.07, 0.18, 0.21);
      if (a1 > 0) {
        items.push(P((g) => K.palace(g, 1500, t), 800, G + 20, { s: 0.85, d: 0.12, ink: 0.55, alpha: a1 * 0.8, puppet: false }));
        const wx = lerp(250, 760, ease(seg(p, 0.05, 0.12)));
        items.push(P(person(C.rama, { stride: walk(t, p < 0.12) }), wx, G, { s: 1.1, alpha: a1 }));
        [[C.lakshmana, 470], [C.bharata, 1040], [C.lakshmana, 1210]].forEach(([c, x], i) =>
          items.push(P(person(c, { arms: REST }), x, G + 10, { s: 0.82, d: 0.22, ink: 0.85, alpha: a1 * seg(p, 0.08 + i * 0.02, 0.11 + i * 0.02), flip: i === 0 ? false : true })));
      }
      // Mithila
      const a2 = seg(p, 0.19, 0.22);
      if (a2 > 0) {
        const bend = seg(p, 0.54, 0.74);
        const brk = seg(p, 0.745, 0.79);
        const ramaX = p < 0.5 ? 380 : lerp(380, 600, ease(seg(p, 0.5, 0.54)));
        const holding = p >= 0.54;
        // the stand and the bow lying on it, until Rama lifts it
        items.push(P((g) => { K.shape(g, [[-160, 0], [160, 0], [140, -60], [-140, -60]], '#a8642a', { smooth: false, perf: 12 }); }, 860, G, { alpha: a2, puppet: false }));
        if (!holding) {
          const shake = p > 0.38 && p < 0.5 ? Math.sin(t * 40) * 0.02 : 0;
          items.push(P((g) => { g.rotate(-Math.PI / 2); K.bow(g, 460, 0, '#c8782a'); }, 860, G - 70, { alpha: a2, rot: shake, puppet: false }));
        }
        // the failing kings, in shadow
        for (let k = 0; k < 2; k++) {
          const f = seg(p, 0.38 + k * 0.06, 0.44 + k * 0.06);
          if (f > 0 && f < 1) {
            const fall = seg(f, 0.55, 0.9);
            items.push(P(person(C.king, { arms: [[1.2, 0.4], [1.0, 0.5]], lean: 0.25 - fall * 0.6, stride: 0.3 }), 700 - fall * 120, G, { s: 1.0, d: 0.2, ink: 0.92, rot: -fall * 0.5, alpha: env(f, 0, 0.15, 0.8, 1) }));
          }
        }
        // Rama
        const arms = holding && brk < 1 ? [[lerp(0.4, 1.35, seg(p, 0.54, 0.58)), lerp(0.2, -1.9 - bend * 0.7, seg(p, 0.54, 0.6))], [1.57, 0]] : brk >= 1 ? [[-0.15, 0.2], [lerp(0.15, 0.6, seg(p, 0.9, 0.96)), 0.9]] : REST;
        items.push(P(person(C.rama, { arms, stride: walk(t, p > 0.5 && p < 0.54), lean: holding && brk < 1 ? -0.05 - bend * 0.06 : 0 }), ramaX, G, { s: 1.1, alpha: a2 }));
        if (holding) {
          const hx = ramaX + 168 * 1.1, hy = G - 273 * 1.1;
          const j = bend > 0.6 && brk === 0 ? Math.sin(t * 50) * bend * 0.02 : 0;
          if (brk === 0) {
            items.push(P((g) => K.bow(g, 420, bend, '#c8782a'), hx, hy, { rot: j, puppet: false }));
            if (bend > 0) fx.push(glow(hx, hy, 140 + bend * 200, 0.12 + bend * 0.3));
          } else if (brk < 1 || p < 0.88) {
            const fall = seg(p, 0.745, 0.85);
            for (const sgn of [-1, 1]) {
              items.push(P((g) => {
                g.save(); g.beginPath(); g.rect(-100, sgn < 0 ? -300 : 0, 200, 300); g.clip();
                K.bow(g, 420, 0.3, '#c8782a'); g.restore();
              }, hx + sgn * brk * 60 + fall * 40 * sgn, hy + sgn * brk * 140 + fall * fall * 260, { rot: sgn * brk * 1.4 + fall * 0.8, puppet: false, alpha: 1 - seg(p, 0.84, 0.88) }));
            }
            if (brk < 1) fx.push((g) => {
              for (let i = 0; i < 26; i++) {
                const a = i * 2.39, r = brk * (200 + (i % 5) * 70);
                g.fillStyle = `rgba(255,220,140,${1 - brk})`;
                g.beginPath(); g.arc(hx + Math.cos(a) * r, hy + Math.sin(a) * r, 4, 0, 6.28); g.fill();
              }
            });
          }
        }
        // Sita
        const sx = lerp(1280, 820, ease(seg(p, 0.88, 0.94)));
        const given = seg(p, 0.94, 0.97);
        items.push(P(person(C.sita, { flip: false, arms: [[-0.1, 0.2], [lerp(0.6, 1.4, seg(p, 0.9, 0.95)), 0.6]], stride: walk(t, p > 0.88 && p < 0.94), hold: given < 1 ? (g, x, y) => { g.translate(x + 6, y + 26); K.garland(g, 22); } : null }), sx, G, { s: 1.0, flip: true, alpha: a2 }));
        if (given >= 1) items.push(P((g) => K.garland(g, 30), ramaX + 30, G - 270 * 1.1, { s: 1, puppet: false }));
      }
      const flash = env(p, 0.744, 0.748, 0.75, 0.78) * 0.9;
      const shake = env(p, 0.744, 0.75, 0.76, 0.8);
      return { items, fx, flash, shake };
    },
  });

  // ===================================================================== 2
  ACTS.push({
    id: 'sandals', title: 'The Sandals', dev: 'अयोध्याकाण्ड', sub: 'Book of Ayodhya',
    mood: () => ({ flute: 0.9, scale: [0, 1, 3, 5, 7, 8, 10], seed: 3 }),
    lines: [
      { p: 0.05, text: 'But a promise is a dangerous thing. Years before, the king had promised Queen Kaikeyi any two wishes she liked.' },
      { p: 0.2, text: 'Now she named them. Her own son, Bharata, would be king. And Rama would live in the forest for fourteen years.' },
      { p: 0.34, text: 'Rama did not argue. Sita and Lakshmana would not stay behind. Lead them into the forest with your light.' },
      { p: 0.62, text: 'Bharata ran after him, and begged him to come home and be king. But Rama would not break his father\'s word.' },
      { p: 0.8, text: "So Bharata carried Rama's sandals home on his head, placed them on the throne, and ruled as their servant until his brother came back." },
    ],
    steps: [TITLE,
      { from: 0.05, to: 0.38, type: 'auto', film: 14 },
      { from: 0.38, to: 0.6, type: 'reach', hint: 'Move the light ahead of them, into the forest', film: 7, r: 260, target: () => ({ x: 1150, y: 470 }) },
      { from: 0.6, to: 1, type: 'auto', film: 15 },
    ],
    sfx: [{ p: 0.08, name: 'chime' }, { p: 0.21, name: 'gong' }, { p: 0.98, name: 'chime' }],
    draw(p, t, L) {
      const items = [], fx = [];
      items.push(Object.assign(title(this, 1), { alpha: env(p, 0, 0.01, 0.04, 0.055) }));
      const a1 = env(p, 0.05, 0.07, 0.33, 0.37);
      if (a1 > 0) {
        items.push(P((g) => K.palace(g, 1700, t), 800, G + 30, { s: 0.9, d: 0.1, ink: 0.5, alpha: a1 * 0.7, puppet: false }));
        items.push(P((g) => K.throne(g), 420, G, { s: 1.1, alpha: a1, puppet: false }));
        const sorrow = seg(p, 0.21, 0.27);
        items.push(P(person(C.dasharatha, { sit: true, arms: [[-0.1, 0.3], [lerp(0.9, 0.3, sorrow), lerp(0.8, 1.6, sorrow)]], headTilt: sorrow * 0.35, lean: sorrow * 0.15 }), 440, G - 10, { s: 1.0, alpha: a1 }));
        items.push(P(person(C.kaikeyi, { arms: [[-0.1, 0.2], [lerp(0.3, 1.9, seg(p, 0.2, 0.24)), 0.1]] }), 1080, G, { s: 1.0, flip: true, alpha: a1 }));
        // the two wishes, drifting from the king to the queen
        for (let i = 0; i < 2; i++) {
          const f = seg(p, 0.07 + i * 0.03, 0.17 + i * 0.03);
          if (f > 0) {
            const x = lerp(520, 1010, ease(f)), y = 430 - Math.sin(f * Math.PI) * 120 + i * 40;
            fx.push(glow(x, y, 50, 0.6 * (1 - seg(p, 0.2, 0.26)), '255,210,140'));
          }
        }
        const ra = seg(p, 0.27, 0.31);
        items.push(P(person(C.rama, { arms: [[-0.1, 0.2], [0.9, 1.3]] }), 760, G, { s: 1.05, alpha: a1 * ra }));
      }
      // into the forest
      const a2 = env(p, 0.34, 0.38, 0.6, 0.63);
      if (a2 > 0) {
        const f = seg(p, 0.38, 0.6);
        const scroll = f * 1500;
        const moving = p > 0.38 && p < 0.6;
        items.push(P((g) => K.palace(g, 1200, t), 300 - scroll * 1.1, G + 30, { s: 0.9, alpha: a2, puppet: false }));
        for (let i = 0; i < 9; i++) {
          const x = 900 + i * 300 - scroll;
          if (x > -300 && x < 1900) items.push(P((g) => K.tree(g, 340 + (i % 3) * 50, i % 2 ? '#4c9a4a' : '#6aa84a', t, i), x, G, { alpha: a2, puppet: false }));
          const x2 = 1100 + i * 380 - scroll * 0.6;
          if (x2 > -400 && x2 < 2000) items.push(P((g) => K.tree(g, 420, '#4c9a4a', t, i + 3), x2, G, { d: 0.22, ink: 0.9, alpha: a2 * 0.8, puppet: false }));
        }
        items.push(P(person(C.lakshmanaForest, { stride: walk(t + 0.3, moving), hold: BOW.hold }), 520, G, { s: 1.0, alpha: a2 }));
        items.push(P(person(C.sitaForest, { stride: walk(t + 0.6, moving) }), 680, G, { s: 0.95, alpha: a2 }));
        items.push(P(person(C.ramaForest, { stride: walk(t, moving), hold: BOW.hold }), 850, G, { s: 1.05, alpha: a2 }));
      }
      // Bharata in the forest
      const a3 = env(p, 0.6, 0.63, 0.88, 0.9);
      if (a3 > 0) {
        [180, 1450].forEach((x, i) => items.push(P((g) => K.tree(g, 400, '#4c9a4a', t, i), x, G, { alpha: a3, puppet: false })));
        items.push(P(person(C.ramaForest, { arms: [[-0.1, 0.2], [lerp(0.2, 1.0, seg(p, 0.76, 0.8)), 0.8]], hold: null }), 1000, G, { s: 1.05, flip: true, alpha: a3 }));
        const bx = lerp(-100, 640, ease(seg(p, 0.62, 0.7)));
        const knee = seg(p, 0.7, 0.72) > 0 && p < 0.8;
        const leave = seg(p, 0.8, 0.88);
        const sandalsUp = p > 0.8;
        items.push(P(person(C.bharata, {
          stride: walk(t, (p < 0.7 && p > 0.62) || (p > 0.82)), kneel: knee,
          arms: knee ? [[1.2, 0.5], [1.5, 0.3]] : sandalsUp ? [[2.6, 0.4], [2.7, 0.3]] : REST,
          hold: sandalsUp ? (g, x, y) => { g.translate(x - 30, y - 30); K.sandals(g); } : null,
        }), bx - leave * 900, G, { s: 1.0, flip: sandalsUp, alpha: a3 }));
      }
      // the sandals on the throne
      const a4 = seg(p, 0.88, 0.92);
      if (a4 > 0) {
        items.push(P((g) => K.palace(g, 1700, t), 800, G + 30, { s: 0.9, d: 0.1, ink: 0.5, alpha: a4 * 0.7, puppet: false }));
        items.push(P((g) => K.throne(g), 790, G, { s: 1.25, alpha: a4, puppet: false }));
        items.push(P((g) => K.sandals(g), 800, G - 150, { s: 1.3, alpha: a4, puppet: false }));
        fx.push(glow(820, G - 120, 160, 0.4 * a4 * (0.8 + 0.2 * Math.sin(t * 2))));
      }
      return { items, fx };
    },
  });

  // ===================================================================== 3
  ACTS.push({
    id: 'deer', title: 'The Golden Deer', dev: 'अरण्यकाण्ड', sub: 'Book of the Forest',
    mood: (p) => ({ flute: p < 0.4 ? 0.9 : 0.4, scale: [0, 2, 4, 7, 9], seed: 4, drums: p > 0.78 ? 0.5 : 0, tempo: 128, low: p > 0.42 }),
    lines: [
      { p: 0.05, text: 'Thirteen years passed in the forest. Then one morning, a deer made of gold stepped out of the trees.' },
      { p: 0.2, text: 'Sita had never seen anything so beautiful. But here is a secret every puppeteer knows. A puppet can lie. Its shadow cannot.' },
      { p: 0.38, text: 'Pull the lamp far to one side, and look at its shadow.' },
      { p: 0.61, text: 'The deer was Maricha, a demon in disguise, sent by Ravana, the king of Lanka, to lure Rama away.' },
      { p: 0.78, text: 'Rama chased it deep into the forest. And while he was gone, Ravana came.' },
    ],
    steps: [TITLE,
      { from: 0.05, to: 0.42, type: 'auto', film: 15 },
      { from: 0.42, to: 0.6, type: 'reach', hint: 'Pull the light far to the left', film: 6, r: 300, target: () => ({ x: 230, y: 520 }), offset: [0, 0] },
      { from: 0.6, to: 1, type: 'auto', film: 13 },
    ],
    sfx: [{ p: 0.07, name: 'chime' }, { p: 0.5, name: 'roar' }, { p: 0.8, name: 'whoosh' }, { p: 0.97, name: 'gong' }],
    backstage: [[0.4, 0.47]],
    draw(p, t, L) {
      const items = [], fx = [];
      items.push(Object.assign(title(this, 1), { alpha: env(p, 0, 0.01, 0.04, 0.055) }));
      const a = seg(p, 0.05, 0.08) * (1 - seg(p, 0.92, 0.98));
      if (a <= 0) return { items, fx };
      items.push(P((g) => K.hut(g), 300, G, { alpha: a, puppet: false }));
      items.push(P((g) => K.tree(g, 420, '#4c9a4a', t, 1), 1480, G, { alpha: a, puppet: false }));
      items.push(P((g) => K.tree(g, 360, '#5aa04a', t, 2), 90, G, { alpha: a, puppet: false }));
      const sitaArms = p > 0.12 && p < 0.42 ? [[-0.1, 0.2], [1.6, 0.4]] : REST;
      items.push(P(person(C.sitaForest, { arms: sitaArms }), 500, G, { s: 0.95, alpha: a }));
      // deer
      const enter = seg(p, 0.05, 0.15), run = seg(p, 0.8, 0.9);
      const dx = run > 0 ? lerp(1060, 1900, run) : lerp(1750, 1060, ease(enter));
      const gait = enter < 1 || run > 0 ? 9 : 0;
      const bob = gait ? 0 : Math.abs(Math.sin(t * 1.6)) * 10;
      items.push(P((g) => K.deer(g, t, gait), dx, G - bob, { s: 1.25, flip: run === 0, alpha: a }));
      // its true shadow
      const lampRev = clamp((dx - 300 - L.x) / 650);
      const rev = Math.max(lampRev * (p < 0.78 ? 1 : 0), env(p, 0.44, 0.58, 0.72, 0.8));
      if (rev > 0.01) {
        items.push(P((g) => K.demonShade(g, t), dx - 60, G, { s: 1.15, d: 0.34, ink: 1, alpha: rev * a, puppet: false }));
      }
      // Rama
      const rx = run > 0 ? lerp(760, 2000, seg(p, 0.82, 0.95)) : 760;
      const ra = seg(p, 0.15, 0.2);
      items.push(P(person(C.ramaForest, { stride: walk(t, run > 0), hold: BOW.hold, arms: run > 0 ? [[-0.4, 0.3], [1.4, 0]] : REST }), rx, G, { s: 1.05, alpha: a * ra }));
      const dark = seg(p, 0.92, 1);
      return { items, fx, tint: rev > 0 ? `rgb(255,${Math.round(255 - rev * 60)},${Math.round(255 - rev * 90)})` : null, dim: 1 - dark * 0.5 };
    },
  });

  // ===================================================================== 4
  ACTS.push({
    id: 'jatayu', title: 'The Vulture King', dev: 'अरण्यकाण्ड', sub: 'Book of the Forest',
    mood: (p) => ({ flute: p > 0.86 ? 0.8 : 0.3, scale: [0, 1, 4, 5, 7, 8, 11], seed: 5, drums: p > 0.25 && p < 0.56 ? 0.75 : p > 0.05 && p < 0.25 ? 0.3 : 0, tempo: 138, low: true }),
    lines: [
      { p: 0.05, text: 'Ravana came dressed as a wandering holy man, asking for food. When Sita stepped out to give it, he seized her and rose into the sky.' },
      { p: 0.25, text: "An old vulture, Jatayu, a friend of Rama's father, saw them, and flew straight at the chariot of the king of demons. Tap to help him strike." },
      { p: 0.5, text: "He smashed the chariot to pieces. But he was old, and Ravana's sword was sharp. Jatayu fell." },
      { p: 0.66, text: 'As she was carried south, Sita let her jewels fall, one by one, a trail of light. Follow them.' },
      { p: 0.87, text: 'Jatayu lived just long enough to tell Rama which way she had gone.' },
    ],
    steps: [TITLE,
      { from: 0.05, to: 0.3, type: 'auto', film: 15 },
      { from: 0.3, to: 0.5, type: 'tap', n: 6, hint: 'Tap to strike', film: 5, sfx: 'hit', at: { x: 760, y: 380 } },
      { from: 0.5, to: 0.7, type: 'auto', film: 10 },
      { from: 0.7, to: 0.86, type: 'reach', hint: 'Follow the falling jewels', film: 6.5, r: 230, target: (p) => jewelTarget(p), offset: [0, -40] },
      { from: 0.86, to: 1, type: 'auto', film: 7 },
    ],
    sfx: [{ p: 0.15, name: 'roar' }, { p: 0.19, name: 'whoosh' }, { p: 0.27, name: 'wings' }, { p: 0.5, name: 'boom' }, { p: 0.55, name: 'fall' },
      ...[0, 1, 2, 3, 4, 5].map((i) => ({ p: 0.7 + i * 0.026, name: 'jewel' })),
      ...[0, 1, 2, 3, 4, 5].map((i) => ({ p: 0.3 + (i + 0.5) * (0.2 / 6), name: 'hit', film: true }))],
    draw(p, t, L) {
      const items = [], fx = [];
      items.push(Object.assign(title(this, 1), { alpha: env(p, 0, 0.01, 0.04, 0.055) }));
      const a = seg(p, 0.05, 0.08);
      if (a <= 0) return { items, fx };
      const groundA = a * (1 - seg(p, 0.26, 0.3)) + seg(p, 0.86, 0.9);
      items.push(P((g) => K.hut(g), 300, G, { alpha: groundA * (p < 0.5 ? 1 : 0), puppet: false }));
      [90, 1500].forEach((x, i) => items.push(P((g) => K.tree(g, 380, '#4c9a4a', t, i), x, G, { alpha: a, puppet: false })));
      // the disguise and the seizing
      const reveal = seg(p, 0.14, 0.17);
      const rise = ease(seg(p, 0.17, 0.25));
      const cx = lerp(760, 880, rise), cy = lerp(G + 40, 600, rise);
      if (reveal < 1) {
        items.push(P(person(Object.assign({}, C.valmiki, { skin: '#a8604a' }), { arms: [[-0.1, 0.2], [1.2, 0.7]] }), 760, G, { s: 1.05, flip: true, alpha: a * (1 - reveal) }));
        items.push(P(person(C.sitaForest, { arms: [[-0.1, 0.2], [lerp(0.2, 1.4, seg(p, 0.08, 0.12)), 0.5]] }), lerp(470, 560, seg(p, 0.07, 0.12)), G, { s: 0.95, alpha: a }));
      }
      const broken = p < 0.5 ? seg(p, 0.3, 0.5) * 0.25 : 0.25 + seg(p, 0.5, 0.58) * 0.75;
      const flying = p >= 0.5;
      // the Ravana group moves as one
      let gx = cx, gy = cy, gs = 0.72;
      if (flying) {
        const f = seg(p, 0.5, 0.86);
        gx = lerp(880, 1420, f); gy = lerp(600, 470, f) + Math.sin(t * 2) * 10; gs = lerp(0.72, 0.42, f);
      }
      this._g = { gx, gy, gs };
      if (reveal > 0 && p < 0.87) {
        const shake = p > 0.3 && p < 0.5 ? Math.sin(t * 30) * 4 : 0;
        if (broken < 1) items.push(P((g) => K.chariot(g, t, broken > 0.25 ? broken : 0), gx + 10 + shake, gy + 6, { s: gs * 1.7, flip: true, alpha: reveal * (1 - seg(p, 0.55, 0.6)), puppet: false }));
        const sy = reveal < 1 ? G : gy;
        const sx = reveal < 1 ? 760 : gx;
        const ss = reveal < 1 ? 1.05 : gs + 0.2;
        items.push(P(person(C.sitaForest, { arms: [[-0.6, 0.4], [2.4, 0.6]], lean: -0.2, headTilt: -0.2 }), sx - 50 * ss, sy - 30 * ss, { s: ss * 0.9, rot: -0.25, flip: true, alpha: reveal }));
        items.push(P((g) => K.ravana(g, { arms: [[1.4, 0.6], [2.2, 0.5]], heads: [1, 1, 1, 1, 1, 1, 1, 1, 1], hold: (g, x, y) => { g.translate(x, y); g.rotate(-0.5); g.fillStyle = '#ddd'; K.shape(g, [[-4, 0], [4, 0], [3, -90], [0, -104], [-3, -90]], '#e0e0e0', { smooth: false, lw: 2 }); } }), sx + 40 * ss, sy, { s: ss, flip: true, alpha: reveal }));
      }
      // Jatayu
      if (p > 0.25 && p < 0.66) {
        const inF = ease(seg(p, 0.25, 0.3));
        const tapPhase = seg(p, 0.3, 0.5) * 6;
        const lunge = p > 0.3 && p < 0.5 ? Math.pow(Math.sin((tapPhase % 1) * Math.PI), 2) : 0;
        let jx = lerp(-250, 470, inF) + lunge * 150, jy = lerp(300, 420, inF) - lunge * 30, rot = 0;
        const fall = seg(p, 0.54, 0.64);
        if (fall > 0) { jx = lerp(560, 760, fall); jy = lerp(400, G - 30, fall * fall); rot = fall * 2.4; }
        items.push(P((g) => K.vulture(g, t, fall > 0 ? 30 * (1 - fall) : 9), jx, jy, { s: 1.5, rot, alpha: 1 }));
        if (lunge > 0.7) fx.push((g) => { for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(255,220,160,0.6)'; g.beginPath(); g.arc(gx - 150 + i * 13, gy - 60 + Math.sin(i * 3 + t * 20) * 50, 4, 0, 6.28); g.fill(); } });
      }
      // jewels
      for (let i = 0; i < 6; i++) {
        const j = jewel(i, p);
        if (!j) continue;
        fx.push(glow(j.x, j.y, 40, 0.75, '255,215,120'));
        fx.push((g) => { g.fillStyle = '#fff2c0'; g.beginPath(); g.arc(j.x, j.y, 6, 0, 6.28); g.fill(); });
        if (j.falling) fx.push((g) => { g.strokeStyle = 'rgba(255,210,120,0.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(j.x, j.y); g.lineTo(j.x - 10, j.y - 120); g.stroke(); });
      }
      // Rama finds Jatayu
      const fA = seg(p, 0.87, 0.91);
      if (fA > 0) {
        items.push(P((g) => K.vulture(g, 0, 0), 900, G - 20, { s: 1.4, rot: 0.25, alpha: fA, flip: true }));
        items.push(P(person(C.ramaForest, { kneel: true, arms: [[0.3, 0.4], [1.3, 0.6]] }), 620, G, { s: 1.05, alpha: fA }));
        items.push(P(person(C.lakshmanaForest, { arms: REST, hold: BOW.hold }), 400, G, { s: 1.0, alpha: fA }));
      }
      return { items, fx, tint: '#ffe6d0', shake: p > 0.3 && p < 0.5 ? 0.15 : env(p, 0.5, 0.505, 0.52, 0.56) };
    },
  });
  function jewel(i, p) {
    const t0 = 0.7 + i * 0.026;
    if (p < t0) return null;
    const f = seg(p, t0, t0 + 0.05);
    const gx0 = lerp(880, 1420, seg(t0, 0.5, 0.86));
    const gy0 = lerp(600, 470, seg(t0, 0.5, 0.86)) - 150;
    const x = gx0 - 40 * i * f;
    const y = lerp(gy0 + 20, G - 20 - (i % 3) * 8, f * f);
    return { x, y, falling: f < 1 };
  }
  function jewelTarget(p) {
    let last = { x: 900, y: 450 };
    for (let i = 0; i < 6; i++) { const j = jewel(i, p); if (j) last = j; }
    return last;
  }

  // ===================================================================== 5
  ACTS.push({
    id: 'leap', title: 'The Leap', dev: 'सुन्दरकाण्ड', sub: 'The Beautiful Book',
    mood: (p) => ({ flute: 0.8, scale: [0, 2, 5, 7, 9], seed: 6, drums: p > 0.38 && p < 0.82 ? 0.3 + 0.4 * seg(p, 0.38, 0.6) : 0, tempo: 112 + 40 * seg(p, 0.38, 0.6), bells: p > 0.6 && p < 0.8 ? 0.6 : 0 }),
    lines: [
      { p: 0.05, text: 'In the hills of Kishkindha, Rama found friends: Sugriva, the king of the vanaras, and his wisest minister, Hanuman.' },
      { p: 0.2, text: 'They searched in every direction, and came at last to the edge of the southern sea. Far across it lay Lanka.' },
      { p: 0.34, text: 'Hanuman did not know how strong he was. Old Jambavan, the bear, had to remind him. Bring the lamp close, and remind him.' },
      { p: 0.61, text: 'Hanuman grew until his head was lost in the clouds. Then he leapt.' },
      { p: 0.8, text: 'In a grove of ashoka trees in Lanka, he found Sita, and gave her Rama\'s ring. He is coming, he told her.' },
    ],
    steps: [TITLE,
      { from: 0.05, to: 0.38, type: 'auto', film: 16 },
      { from: 0.38, to: 0.6, type: 'near', hint: 'Press and hold to bring the lamp closer', film: 6.5, at: { x: 660, y: 760 } },
      { from: 0.6, to: 1, type: 'auto', film: 16 },
    ],
    sfx: [{ p: 0.4, name: 'grow' }, { p: 0.66, name: 'whoosh' }, { p: 0.7, name: 'whoosh' }, { p: 0.9, name: 'chime' }],
    backstage: [[0.39, 0.46]],
    lamp: (p, t, L) => {
      if (p >= 0.38 && p < 0.6) return { x: 660, y: 800 };
      if (p >= 0.6 && p < 0.68) return { z: lerp(0.3, 1, ease(seg(p, 0.6, 0.67))), x: lerp(660, 800, seg(p, 0.6, 0.67)), y: lerp(800, 430, seg(p, 0.6, 0.67)) };
      return {};
    },
    draw(p, t, L) {
      const items = [], fx = [];
      items.push(Object.assign(title(this, 1), { alpha: env(p, 0, 0.01, 0.04, 0.055) }));
      const a1 = env(p, 0.05, 0.07, 0.18, 0.21);
      if (a1 > 0) {
        items.push(P((g) => K.hills(g, 1800), 800, G + 30, { alpha: a1, puppet: false }));
        items.push(P(person(C.ramaForest, { hold: BOW.hold, arms: [[-0.1, 0.2], [1.0, 0.8]] }), 480, G, { s: 1.05, alpha: a1 }));
        items.push(P(person(C.hanuman, { kneel: true, arms: [[1.0, 1.0], [1.1, 1.0]], drawExtra: (g) => K.tail(g, t) }), 800, G, { s: 1.0, flip: true, alpha: a1 }));
        items.push(P(person(C.vanara, { arms: REST, head: { crown: 'small' }, drawExtra: (g) => K.tail(g, t + 1, '#a8682a') }), 1080, G, { s: 1.0, flip: true, alpha: a1 }));
      }
      const a2 = env(p, 0.19, 0.22, 0.78, 0.82);
      const leap = seg(p, 0.64, 0.8);
      if (a2 > 0) {
        items.push(P((g) => K.waves(g, 1800, t, null, 1), 800, G + 10, { alpha: a2, puppet: false }));
        items.push(P((g) => K.lanka(g), 1400, G + 10, { s: 0.85, alpha: a2, puppet: false }));
        items.push(P((g) => K.shape(g, [[-160, 20], [-130, -40], [-40, -70], [60, -50], [120, 20]], '#8a7a5a', { perf: 12 }), 620, G, { alpha: a2 * (1 - leap), puppet: false }));
        for (let i = 0; i < 4; i++) items.push(P(person(C.vanara, { arms: [[0.4, 0.8], [2.4, 0.4]], drawExtra: (g) => K.tail(g, t + i) }), 90 + i * 70, G - 20, { s: 0.6, d: 0.14, ink: 0.9, alpha: a2 * (1 - leap), puppet: false }));
        // Hanuman grows with the lamp
        if (leap <= 0) {
          const grow = seg(p, 0.38, 0.6);
          items.push(P(person(C.hanuman, { arms: [[-0.2, 0.3], [lerp(0.2, 2.6, grow), 0.3]], hold: (g, x, y) => { g.translate(x, y); K.mace(g); }, drawExtra: (g) => K.tail(g, t) }), 620, G - 50, { s: 0.85, d: 0.16 * seg(p, 0.33, 0.4), ink: 0.85 * seg(p, 0.38, 0.5), sharp: 0.35, alpha: a2 }));
        } else {
          const x = lerp(620, 1400, ease(leap));
          const y = lerp(G + 100, G - 40, leap) - Math.sin(leap * Math.PI) * 330;
          items.push(P(person(C.hanuman, { arms: [[2.6, 0.2], [2.8, 0.1]], stride: -0.8, lean: 0.9, drawExtra: (g) => K.tail(g, t) }), x, y, { s: lerp(1.5, 0.45, ease(leap)), rot: 0.6, alpha: a2 }));
          for (let i = 0; i < 3; i++) {
            const cxp = 1800 - ((leap * 2600 + i * 700) % 2400);
            items.push(P((g) => K.cloud(g, 160), cxp, 180 + i * 90, { d: 0.12, ink: 0.4, alpha: a2 * 0.8, puppet: false }));
          }
        }
      }
      const a3 = seg(p, 0.8, 0.84);
      if (a3 > 0) {
        [140, 480, 1180, 1480].forEach((x, i) => items.push(P((g) => K.tree(g, 400 + (i % 2) * 60, '#d8503a', t, i), x, G, { alpha: a3, puppet: false, d: i % 2 ? 0.1 : 0, ink: i % 2 ? 0.6 : 0 })));
        items.push(P(person(C.sitaForest, { sit: true, arms: [[-0.1, 0.4], [lerp(0.6, 1.2, seg(p, 0.9, 0.94)), 0.9]], headTilt: lerp(0.25, 0, seg(p, 0.9, 0.95)) }), 900, G - 10, { s: 1.0, flip: true, alpha: a3 }));
        items.push(P(person(C.hanuman, { kneel: true, arms: [[0.4, 0.3], [1.5, 0.2]], drawExtra: (g) => K.tail(g, t) }), 620, G, { s: 0.75, alpha: a3 }));
        const rx = lerp(620 + 120, 820, seg(p, 0.88, 0.93)), ry = G - 190;
        fx.push(glow(rx, ry, 70, 0.7 * a3));
        fx.push((g) => { g.save(); g.translate(rx, ry); K.ring(g); g.restore(); });
      }
      return { items, fx, tint: p > 0.8 ? '#ffe8e0' : null };
    },
  });

  // ===================================================================== 6
  const STONES = 8;
  ACTS.push({
    id: 'bridge', title: 'The Bridge', dev: 'युद्धकाण्ड', sub: 'Book of War',
    mood: (p) => ({ flute: 0.8, scale: [0, 2, 4, 7, 9], seed: 7, drums: p > 0.22 && p < 0.56 ? 0.35 : 0.12, tempo: 104, bells: 0.4 }),
    lines: [
      { p: 0.05, text: "Rama's army of vanaras reached the shore. Between them and Lanka lay a hundred leagues of open sea." },
      { p: 0.18, text: "They wrote Rama's name on stones, threw them into the water, and the stones floated. Tap the water to throw a stone." },
      { p: 0.56, text: 'Even a little squirrel helped. It rolled in the sand, then ran out onto the bridge and shook the sand off its back.' },
      { p: 0.74, text: 'The monkeys laughed at it. But Rama lifted the squirrel up and stroked its back, and the three lines his fingers left are still there, on every squirrel you see.' },
    ],
    steps: [TITLE,
      { from: 0.05, to: 0.22, type: 'auto', film: 9 },
      { from: 0.22, to: 0.55, type: 'tap', n: STONES, hint: 'Tap to throw a stone', film: 7, sfx: 'splash', at: { x: 900, y: 650 } },
      { from: 0.55, to: 1, type: 'auto', film: 18 },
    ],
    sfx: [...Array.from({ length: STONES }, (_, i) => ({ p: 0.22 + ((i + 0.9) * 0.33) / STONES, name: 'splash', film: true })), { p: 0.9, name: 'chime' }],
    draw(p, t, L) {
      const items = [], fx = [];
      items.push(Object.assign(title(this, 1), { alpha: env(p, 0, 0.01, 0.04, 0.055) }));
      const a = seg(p, 0.05, 0.08);
      if (a <= 0) return { items, fx };
      items.push(P((g) => K.lanka(g), 1450, G - 20, { s: 0.75, alpha: a, puppet: false }));
      items.push(P((g) => K.waves(g, 1500, t, null, 1), 1080, G - 24, { alpha: a, puppet: false }));
      items.push(P((g) => K.shape(g, [[-260, 40], [-260, -40], [-60, -60], [120, -30], [200, 40]], '#c8a86a', { perf: 14 }), 160, G + 10, { alpha: a, puppet: false }));
      const crowd = 1 - 0.3 * seg(p, 0.74, 0.8);
      for (let i = 0; i < 6; i++) items.push(P(person(C.vanara, { arms: i % 2 ? [[0.5, 0.6], [2.5, 0.4]] : REST, drawExtra: (g) => K.tail(g, t + i) }), 40 + i * 52, G - 40 - (i % 2) * 20, { s: 0.62, d: 0.16, ink: 0.9, alpha: a * crowd, puppet: false }));
      const stonesF = seg(p, 0.22, 0.55) * STONES;
      const stx = (i) => 420 + i * 132, sty = (i) => G - 52 + Math.sin(t * 1.5 + i) * 4;
      for (let i = 0; i < STONES; i++) {
        const f = clamp(stonesF - i);
        if (f <= 0) continue;
        const land = clamp(f / 0.9);
        const x = lerp(260, stx(i), land), y = lerp(500, sty(i), land) - Math.sin(land * Math.PI) * 180;
        items.push(P((g) => K.stone(g, true), x, y, { s: 1.6, rot: (1 - land) * 4, puppet: false }));
        if (land >= 1 && f < 1) fx.push(glow(stx(i), sty(i), 90, 0.5 * (1 - (f - 0.9) * 10)));
      }
      // squirrel
      const sqRun = seg(p, 0.56, 0.78), sqLift = seg(p, 0.8, 0.86);
      const ramaX = lerp(300, 380, seg(p, 0.76, 0.8));
      let qx, qy, qflip = false, run = false;
      if (sqLift > 0) {
        qx = lerp(450, ramaX + 175, ease(sqLift)); qy = lerp(G - 82, G - 300, ease(sqLift));
      } else if (sqRun > 0) {
        const ph = sqRun * 3;
        const f = ph % 1, dir = Math.floor(ph) % 2;
        qx = dir === 0 ? lerp(330, 1100, f) : lerp(1100, 330, f);
        qflip = dir === 1; run = true;
        qy = G - 82;
      }
      const stripes = seg(p, 0.86, 0.92);
      if (qx != null) items.push(P((g) => K.squirrel(g, t, run, stripes), qx, qy, { s: 1.2, flip: qflip }));
      if (stripes > 0) fx.push(glow(qx, qy - 30, 120, stripes * 0.6));
      items.push(P(person(C.ramaForest, { hold: sqLift > 0 ? null : BOW.hold, arms: sqLift > 0 ? [[lerp(-0.1, 1.5, seg(p, 0.85, 0.88)), lerp(0.2, 0.5, seg(p, 0.86, 0.92)) + Math.sin(t * 3) * 0.1 * stripes], [1.4, 0.3]] : REST }), ramaX, G - 40, { s: 0.95, alpha: a }));
      return { items, fx, tint: '#f6f0ff' };
    },
  });

  // ===================================================================== 7
  const HEADS = 9;
  ACTS.push({
    id: 'heads', title: 'Ten Heads', dev: 'युद्धकाण्ड', sub: 'Book of War',
    mood: (p) => ({ flute: p > 0.86 ? 0.6 : 0, scale: [0, 1, 4, 5, 7, 8, 11], seed: 8, drums: p < 0.86 ? 0.85 : 0, tempo: p < 0.5 ? 150 : 120, low: true, pattern: ['thom', 'tha', 'tha', 'thom', 'dhin', 'tha', 'thom', 'tha'] }),
    lines: [
      { p: 0.05, text: 'Then came the war. Kumbhakarna, the giant, woke from his long sleep, and fell. Indrajit, the prince of Lanka, fell. At last, Ravana himself came out to fight.' },
      { p: 0.24, text: 'Rama cut off one of his heads, and another grew in its place. Sweep the light across the heads.' },
      { p: 0.5, text: 'Then Matali, the charioteer of the gods, reminded Rama of one weapon he had not yet used: the arrow of Brahma.' },
      { p: 0.64, text: "Hold the light on Ravana's heart." },
      { p: 0.81, text: 'The arrow flew like the sun, straight through the heart of the king of Lanka. And all ten heads that had laughed at the gods fell silent.' },
    ],
    steps: [TITLE,
      { from: 0.05, to: 0.28, type: 'auto', film: 15 },
      { from: 0.28, to: 0.5, type: 'sweep', hint: 'Sweep the light across his heads', film: 6, at: { x: 1060, y: 330 } },
      { from: 0.5, to: 0.67, type: 'auto', film: 8 },
      { from: 0.67, to: 0.8, type: 'reach', hint: 'Hold the light over his heart', film: 4.5, r: 170, target: () => ({ x: 1050, y: 560 }), offset: [0, 0] },
      { from: 0.8, to: 1, type: 'auto', film: 13 },
    ],
    sfx: [{ p: 0.11, name: 'boom' }, { p: 0.19, name: 'boom' }, { p: 0.22, name: 'roar' },
      ...Array.from({ length: HEADS }, (_, k) => ({ p: 0.28 + (k + 0.5) * (0.22 / HEADS), name: 'hit', film: true })),
      { p: 0.56, name: 'gong' }, { p: 0.8, name: 'arrow' }, { p: 0.83, name: 'crack' }, { p: 0.9, name: 'fall' }],
    backstage: [[0.58, 0.66]],
    lamp: (p, t) => (p >= 0.28 && p < 0.5 ? { x: 1060 + Math.sin(t * 2.6) * 240, y: 320 } : {}),
    draw(p, t, L) {
      const items = [], fx = [];
      items.push(Object.assign(title(this, 1), { alpha: env(p, 0, 0.01, 0.04, 0.055) }));
      const a = seg(p, 0.05, 0.08);
      if (a <= 0) return { items, fx };
      // war montage
      const m = env(p, 0.05, 0.07, 0.22, 0.25);
      if (m > 0) {
        const kf = seg(p, 0.09, 0.12);
        items.push(P(person(C.ravana, { arms: [[1.4, 0.5], [2.4, 0.3]], head: { crown: 'small', demon: true, moustache: true } }), 1100 + kf * 100, G + 20, { s: 1.45, d: 0.16, ink: 1, rot: kf * 1.3, flip: true, alpha: m * (1 - seg(p, 0.13, 0.15)), puppet: false }));
        const inf = seg(p, 0.16, 0.19);
        if (p > 0.14) items.push(P(person(C.king, { arms: [[1.3, 0.3], [1.6, 0]], hold: BOW.hold }), 1050 + inf * 60, G, { s: 1.1, d: 0.18, ink: 0.95, rot: inf * 1.4, flip: true, alpha: m, puppet: false }));
        for (let i = 0; i < 5; i++) items.push(P(person(C.vanara, { arms: [[2.3, 0.5], [2.6, 0.2]], stride: Math.sin(t * 5 + i), drawExtra: (g) => K.tail(g, t + i) }), 120 + i * 120, G - Math.abs(Math.sin(t * 4 + i)) * 60, { s: 0.7, d: 0.12, ink: 0.9, alpha: m, puppet: false }));
        fx.push((g) => {
          for (let i = 0; i < 7; i++) {
            const f = ((t * 0.9 + i * 0.37) % 1);
            const x = lerp(-100, 1700, f), y = 200 + i * 60 + Math.sin(i) * 30;
            g.strokeStyle = 'rgba(255,220,150,0.7)'; g.lineWidth = 3;
            g.beginPath(); g.moveTo(x, y); g.lineTo(x - 80, y + 6); g.stroke();
          }
        });
      }
      // Rama and Ravana
      const d = seg(p, 0.22, 0.26);
      if (d > 0) {
        const heads = [];
        for (let k = 0; k < HEADS; k++) {
          const c = 0.28 + (k + 0.5) * (0.22 / HEADS);
          const cut = seg(p, c - 0.002, c);
          const regrow = seg(p, c + 0.02, c + 0.035);
          heads.push(p < c ? 1 : regrow);
          const fly = seg(p, c, c + 0.03);
          if (fly > 0 && fly < 1 && cut > 0) {
            const ang = Math.PI * (0.96 - (k / 8) * 0.82);
            const hx = 1080 - (2 + Math.cos(ang) * 108) * 1.15, hy = G - (350 + Math.sin(ang) * 86) * 1.15;
            items.push(P((g) => { g.scale(0.8, 0.8); K.head(g, { skin: '#b8342a', demon: true, moustache: true, crown: 'small' }); }, hx - fly * 120, hy - Math.sin(fly * Math.PI) * 160 + fly * 300, { rot: -fly * 5, flip: true, alpha: 1 - fly, puppet: false }));
            fx.push(glow(hx, hy, 120, 0.6 * (1 - fly)));
          }
        }
        const fall = seg(p, 0.84, 0.95);
        items.push(P((g) => K.ravana(g, { heads, extraArms: true, arms: [[1.6, 0.4], [1.9, 0.3]], headTilt: fall * 0.4, hold: (g, x, y) => { g.translate(x, y); K.bow(g, 260, 0.2, '#6a2a2a'); } }), 1080 + fall * 80, G, { s: 1.15, flip: true, rot: fall * 1.35, alpha: d }));
        // Rama with the arrow of Brahma
        const draw = seg(p, 0.52, 0.6);
        items.push(P(person(C.ramaForest, { arms: [[lerp(0.2, 1.35, draw), lerp(0.3, -2.2, draw)], [1.57, 0]], hold: (g, x, y) => { g.translate(x, y); K.bow(g, 280, draw * (1 - seg(p, 0.8, 0.805)) * 0.9); } }), 360, G, { s: 1.1, alpha: d }));
        const hx = 360 + 168 * 1.1, hy = G - 273 * 1.1;
        if (draw > 0 && p < 0.8) {
          items.push(P((g) => K.arrow(g, 160, '#ffe08a'), hx + 10, hy, { puppet: false }));
          fx.push(glow(hx - 60, hy, 160 + 120 * seg(p, 0.6, 0.8), 0.3 + 0.5 * seg(p, 0.6, 0.8)));
        }
        const aim = seg(p, 0.64, 0.8);
        if (aim > 0 && p < 0.8) fx.push((g) => {
          g.strokeStyle = `rgba(255,220,150,${0.3 + aim * 0.6})`; g.lineWidth = 3;
          g.beginPath(); g.arc(1050, 560, 90 - aim * 50, 0, 6.28); g.stroke();
          glow(1050, 560, 160, aim * 0.5)(g);
        });
        const fly = seg(p, 0.8, 0.83);
        if (fly > 0 && fly < 1) {
          const x = lerp(hx, 1050, fly);
          items.push(P((g) => K.arrow(g, 160, '#ffe08a'), x, lerp(hy, 560, fly), { puppet: false }));
          fx.push(glow(x, lerp(hy, 560, fly), 260, 0.8));
        }
      }
      const flash = env(p, 0.828, 0.832, 0.836, 0.87);
      return { items, fx, tint: p < 0.86 ? '#ffc9a8' : '#ffe0c8', flash, shake: env(p, 0.83, 0.835, 0.85, 0.88) + (p > 0.09 && p < 0.13 ? 0.4 : 0) };
    },
  });

  // ===================================================================== 8
  const DIYAS = 12;
  const diyaPos = (i) => ({ x: 140 + i * 120, y: i % 2 ? 640 : 600 });
  const diyaAt = (i) => 0.27 + (i + 0.6) * (0.35 / DIYAS);
  ACTS.push({
    id: 'lamps', title: 'The Lamps', dev: 'दीपावली', sub: 'The Return',
    mood: (p) => ({ flute: p < 0.95 ? 1 : 0.3, scale: [0, 2, 4, 7, 9], seed: 9, drums: p > 0.2 && p < 0.7 ? 0.3 : 0, tempo: 100, bells: p > 0.25 && p < 0.75 ? 0.6 : 0, drone: 1 - seg(p, 0.95, 1) }),
    lines: [
      { p: 0.05, text: 'Sita came back to Rama. The fourteen years were over, and the flying chariot Pushpaka carried them home.' },
      { p: 0.2, text: 'It was the night of the new moon, the darkest night of the year. So the people of Ayodhya lit lamps, every one of them, to show their king the way home. Carry your flame along the walls.' },
      { p: 0.63, text: 'That is why, every Diwali, we still light them.' },
      { p: 0.73, text: 'Look. When every lamp is lit, nothing casts a shadow. And that is where a shadow play has to end.' },
      { p: 0.87, text: 'Blow out your lamp, little one. The story will wait for you. It always has.' },
    ],
    steps: [TITLE,
      { from: 0.05, to: 0.26, type: 'auto', film: 12 },
      { from: 0.26, to: 0.62, type: 'reach', hint: 'Carry your flame from lamp to lamp', film: 10, r: 120, target: (p) => { for (let i = 0; i < DIYAS; i++) if (p < diyaAt(i)) return diyaPos(i); return diyaPos(DIYAS - 1); }, offset: [0, -30] },
      { from: 0.62, to: 0.92, type: 'auto', film: 16 },
      { from: 0.92, to: 0.93, type: 'tap', n: 1, hint: 'Touch to blow out the lamp', film: 1.5 },
      { from: 0.93, to: 1, type: 'auto', film: 9 },
    ],
    sfx: [{ p: 0.06, name: 'whoosh' }, ...Array.from({ length: DIYAS }, (_, i) => ({ p: diyaAt(i), name: 'chime' })), { p: 0.925, name: 'blow' }],
    backstage: [[0.4, 0.5]],
    tail: 2,
    lampOn: (p) => 1 - seg(p, 0.925, 0.94),
    draw(p, t, L) {
      const items = [], fx = [];
      items.push(Object.assign(title(this, 1), { alpha: env(p, 0, 0.01, 0.04, 0.055) }));
      const lit = clamp(Array.from({ length: DIYAS }, (_, i) => seg(p, diyaAt(i) - 0.008, diyaAt(i))).reduce((s, v) => s + v, 0) / DIYAS);
      const flood = seg(p, 0.75, 0.86);
      const fade = 1 - 0.85 * flood;
      const f1 = env(p, 0.05, 0.07, 0.18, 0.21);
      if (f1 > 0) {
        const f = seg(p, 0.05, 0.2);
        const x = lerp(-300, 1900, f), y = 330 + Math.sin(t * 1.3) * 16;
        for (let i = 0; i < 4; i++) items.push(P((g) => K.cloud(g, 140), 1800 - ((f * 2400 + i * 600) % 2200), 160 + (i % 2) * 360, { d: 0.12, ink: 0.4, alpha: f1 * 0.8, puppet: false }));
        items.push(P((g) => {
          g.save(); g.translate(-60, 0); g.scale(0.7, 0.7); K.person(g, Object.assign({}, C.sita, { arms: [[-0.1, 0.2], [0.7, 0.8]] })); g.restore();
          g.save(); g.translate(50, 0); g.scale(0.75, 0.75); K.person(g, Object.assign({}, C.rama, { arms: [[-0.1, 0.2], [2.2, 0.4]] })); g.restore();
          K.pushpaka(g, t);
        }, x, y + 120, { s: 1.15, alpha: f1 }));
      }
      const a2 = seg(p, 0.19, 0.23);
      if (a2 > 0) {
        items.push(P((g) => K.palace(g, 1560, t), 800, G + 30, { alpha: a2 * fade, puppet: false }));
        items.push(P(person(C.rama, { arms: [[-0.1, 0.2], [lerp(0.2, 2.2, seg(p, 0.64, 0.7)), 0.4]] }), 900, G, { s: 0.9, alpha: a2 * seg(p, 0.3, 0.36) * fade }));
        items.push(P(person(C.sita, { arms: [[-0.1, 0.2], [0.9, 1.0]] }), 720, G, { s: 0.85, alpha: a2 * seg(p, 0.32, 0.38) * fade }));
        for (let i = 0; i < DIYAS; i++) {
          const pos = diyaPos(i);
          const l = seg(p, diyaAt(i) - 0.008, diyaAt(i));
          items.push(P((g) => K.diya(g, 0, t, i), pos.x, pos.y, { s: 1.2, alpha: a2 * Math.max(fade, 0.4), puppet: false }));
          if (l > 0) {
            const flick = 0.85 + 0.15 * Math.sin(t * 9 + i * 2);
            fx.push(glow(pos.x, pos.y - 14, 110 + lit * 40, 0.55 * l * flick));
            fx.push((g) => K.flame(g, pos.x, pos.y - 8, 14 * l, t + i));
          }
        }
      }
      // closing card
      const end = seg(p, 0.95, 0.98);
      if (end > 0) fx.push((g) => {
        g.globalAlpha = end;
        g.textAlign = 'center';
        g.fillStyle = 'rgba(255,214,150,0.95)';
        g.font = '600 92px "Cormorant Garamond", Georgia, serif';
        g.fillText('Lamplight', 800, 360);
        g.font = 'italic 500 34px "Cormorant Garamond", Georgia, serif';
        g.fillStyle = 'rgba(255,214,150,0.75)';
        g.fillText("after Valmiki's Ramayana, and the Tholu Bommalata", 800, 420);
        g.fillText('leather-puppet players of Andhra Pradesh', 800, 462);
        g.globalAlpha = 1;
      });
      const amb = lit * 0.22 + flood * 0.75;
      const out = seg(p, 0.925, 0.95);
      return { items, fx, ambient: amb * (1 - out * 0.95) };
    },
  });

  if (typeof module !== 'undefined') module.exports = LL;
})(typeof window !== 'undefined' ? window : globalThis);
