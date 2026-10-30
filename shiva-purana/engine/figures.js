/* Shiva Purana: inked, cel-shaded comic-book figures.
   Figures stand facing the viewer (the way gods are drawn in Indian mythology comics), with the head turned a little
   toward the direction they face. Heavy black ink outlines, a flat shadow tone on the side away from the key light
   (upper left), halftone dots in the shadows and a hard rim highlight. Origin at the feet; an adult is about 430 units
   tall. Every deity carries its canonical attributes (see CAST).
   Exports window.CBFig = { figure, creature, CAST, POSES, f1, shade, INK }. */
(function () {
  const f1 = v => Math.round(v * 10) / 10;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const INK = '#15100d';
  const GOLD = '#f2b632', GOLD_D = '#b77a14', GOLD_L = '#ffe07a', RUBY = '#d21f3c', PEARL = '#fff6e0', EMER = '#1f9a5a';
  const pt = (x, y) => `${f1(x)},${f1(y)}`;
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    if (amt < 0) { r = Math.round(r * (1 - p) + 30 * p * 0.4); g = Math.round(g * (1 - p) + 10 * p * 0.4); b = Math.round(b * (1 - p) + 60 * p * 0.4); }
    else { r = Math.round(r + (t - r) * p); g = Math.round(g + (t - g) * p); b = Math.round(b + (t - b) * p); }
    return '#' + ((1 << 24) + (Math.min(255, r) << 16) + (Math.min(255, g) << 8) + Math.min(255, b)).toString(16).slice(1);
  }
  function smooth(pts, closed = true, k = 0.55) {
    const n = pts.length;
    const P = i => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    let d = 'M' + pt(...P(0));
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      d += 'C' + pt(p1[0] + (p2[0] - p0[0]) * k / 3, p1[1] + (p2[1] - p0[1]) * k / 3) + ' ' + pt(p2[0] - (p3[0] - p1[0]) * k / 3, p2[1] - (p3[1] - p1[1]) * k / 3) + ' ' + pt(...p2);
    }
    return d + (closed ? 'Z' : '');
  }
  const poly = pts => 'M' + pts.map(p => pt(p[0], p[1])).join('L') + 'Z';
  const W = 2.6;   // base ink weight
  const P = (d, fill, o = {}) => `<path d="${d}" fill="${fill}"${o.ink === false ? '' : ` stroke="${o.col || INK}" stroke-width="${o.w || W}" stroke-linejoin="round" stroke-linecap="round"`}${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
  const L = (d, w = W, col = INK, op) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${op != null ? ` opacity="${op}"` : ''}/>`;
  const C = (x, y, r, fill, o = {}) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${fill}"${o.ink ? ` stroke="${o.col || INK}" stroke-width="${o.w || 1.6}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
  // a flat shadow tone + halftone dots (pattern #cbDots is defined by the renderer)
  const SH = (d, base, amt = -0.3) => `<path d="${d}" fill="${shade(base, amt)}"/><path d="${d}" fill="url(#cbDots)" opacity="0.5"/>`;
  const HI = (d, op = 0.55) => `<path d="${d}" fill="#fffbe8" opacity="${op}"/>`;

  // a limb as a tapered quad from a to b; returns the outline plus a shadow strip on the side away from the light
  function limb(a, b, ra, rb, col, o = {}) {
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    const A1 = [a[0] + nx * ra, a[1] + ny * ra], A2 = [a[0] - nx * ra, a[1] - ny * ra], B1 = [b[0] + nx * rb, b[1] + ny * rb], B2 = [b[0] - nx * rb, b[1] - ny * rb];
    const d = `M${pt(...A1)}L${pt(...B1)}A${f1(rb)},${f1(rb)} 0 0 1 ${pt(...B2)}L${pt(...A2)}A${f1(ra)},${f1(ra)} 0 0 1 ${pt(...A1)}Z`;
    // light from upper-left: shadow on the side whose normal points to +x/+y
    const s = (nx * 0.6 + ny * 0.8) > 0 ? 1 : -1;
    const m = 0.15;
    const S1 = [a[0] + nx * ra * s * m, a[1] + ny * ra * s * m], S2 = [b[0] + nx * rb * s * m, b[1] + ny * rb * s * m];
    const E1 = [a[0] + nx * ra * s * 0.96, a[1] + ny * ra * s * 0.96], E2 = [b[0] + nx * rb * s * 0.96, b[1] + ny * rb * s * 0.96];
    const sd = poly([S1, E1, E2, S2]);
    return { d, shadow: sd, out: P(d, col, o) + (o.flat ? '' : SH(sd, col, o.sh || -0.28)) + (o.flat ? '' : P(d, 'none', o)) };
  }
  // a whole arm (shoulder, elbow, wrist) as one smooth inked sausage with a shadow strip
  function armShape(S, E, H, r1, r2, r3, col) {
    const n = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l, dx / l, dy / l]; };
    const [n1x, n1y, d1x, d1y] = n(S, E), [n2x, n2y, d2x, d2y] = n(E, H);
    let bx = n1x + n2x, by = n1y + n2y; const bl = Math.hypot(bx, by) || 1; bx /= bl; by /= bl;
    const side = (k, f = 1) => [[S[0] + n1x * r1 * k * f, S[1] + n1y * r1 * k * f], [E[0] + bx * r2 * k * f, E[1] + by * r2 * k * f], [H[0] + n2x * r3 * k * f, H[1] + n2y * r3 * k * f]];
    const A = side(1), B = side(-1);
    const capH = [H[0] + d2x * r3, H[1] + d2y * r3], capS = [S[0] - d1x * r1, S[1] - d1y * r1];
    const d = smooth([A[0], A[1], A[2], capH, B[2], B[1], B[0], capS], true, 0.5);
    const s = (n1x * 0.6 + n1y * 0.8) > 0 ? 1 : -1;
    const sA = side(s, 0.2), sB = side(s, 0.97);
    const sd = smooth([sA[0], sA[1], sA[2], sB[2], sB[1], sB[0]], true, 0.4);
    return P(d, col, { ink: false }) + SH(sd, col, -0.28) + P(d, 'none', {});
  }
  // two-bone IK: shoulder S, target T, lengths, elbow bends outward (side s)
  function ik(S, T, l1, l2, s, bendUp) {
    let dx = T[0] - S[0], dy = T[1] - S[1]; let d = Math.hypot(dx, dy);
    const maxd = (l1 + l2) * 0.999; if (d > maxd) { dx *= maxd / d; dy *= maxd / d; d = maxd; }
    const a = Math.atan2(dy, dx);
    const cosb = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1), b = Math.acos(cosb);
    // choose the elbow side: away from the body (outward = s) unless bendUp says otherwise
    const c1 = a + b, c2 = a - b;
    const e1 = [S[0] + Math.cos(c1) * l1, S[1] + Math.sin(c1) * l1], e2 = [S[0] + Math.cos(c2) * l1, S[1] + Math.sin(c2) * l1];
    let E = (e1[0] - e2[0]) * s > 0 ? e1 : e2;
    if (bendUp === 'down') E = e1[1] > e2[1] ? e1 : e2;
    if (bendUp === 'up') E = e1[1] < e2[1] ? e1 : e2;
    return { E, H: [S[0] + dx, S[1] + dy] };
  }

  // ------------------------------------------------------------------ POSES ----
  // targets for the screen-right arm (x > 0); the left arm mirrors. hand: open | fist | down | point | namaste | cup | rest | flat
  const A = (x, y, hand = 'rest', o = {}) => Object.assign({ t: [x, y], hand }, o);
  const POSES = {
    rest:    { R: A(64, -178, 'rest'), L: A(64, -178, 'rest') },
    stand:   { R: A(60, -182, 'rest'), L: A(46, -238, 'fist', { bend: 'down' }) },
    hips:    { R: A(36, -236, 'fist', { bend: 'down' }), L: A(36, -236, 'fist', { bend: 'down' }) },
    bless:   { R: A(70, -322, 'open', { bend: 'down' }), L: A(66, -200, 'down') },        // abhaya (right) + varada (left)
    abhaya:  { R: A(70, -322, 'open', { bend: 'down' }), L: A(62, -182, 'rest') },
    hold:    { R: A(84, -262, 'fist', { bend: 'down' }), L: A(64, -186, 'rest') },
    holdUp:  { R: A(92, -318, 'fist', { bend: 'down' }), L: A(66, -320, 'open', { bend: 'down' }) },
    raise:   { R: A(110, -470, 'open'), L: A(64, -180, 'rest') },
    raise2:  { R: A(112, -462, 'open'), L: A(112, -462, 'open') },
    strike:  { R: A(70, -500, 'fist'), L: A(96, -300, 'open', { bend: 'down' }) },
    point:   { R: A(168, -340, 'point'), L: A(60, -186, 'rest') },
    pointUp: { R: A(120, -455, 'point'), L: A(62, -186, 'rest') },
    namaste: { R: A(6, -290, 'namaste', { bend: 'down' }), L: A(6, -290, 'namaste', { bend: 'down' }) },
    chest:   { R: A(14, -300, 'open', { bend: 'down' }), L: A(62, -186, 'rest') },
    offer:   { R: A(28, -268, 'cup', { bend: 'down' }), L: A(28, -268, 'cup', { bend: 'down' }) },
    fear:    { R: A(128, -352, 'open', { bend: 'down' }), L: A(104, -322, 'open', { bend: 'down' }) },
    grief:   { R: A(22, -296, 'flat', { bend: 'down' }), L: A(16, -284, 'flat', { bend: 'down' }) },
    head:    { R: A(30, -420, 'flat', { bend: 'down' }), L: A(30, -420, 'flat', { bend: 'down' }) },
    halt:    { R: A(150, -360, 'open'), L: A(62, -186, 'rest') },
    reach:   { R: A(160, -300, 'open'), L: A(150, -320, 'open') },
    beg:     { R: A(34, -250, 'cup', { bend: 'down' }), L: A(30, -246, 'cup', { bend: 'down' }) },
    bow:     { R: A(150, -335, 'fist'), L: A(-6, -350, 'fist', { bend: 'down' }) },        // drawing a bow: far hand out front, near hand at the cheek
    veena:   { R: A(20, -250, 'open', { bend: 'down' }), L: A(58, -292, 'fist', { bend: 'down' }) },
    trident: { R: A(70, -322, 'open', { bend: 'down' }), L: A(84, -258, 'fist', { bend: 'down' }) },
    tridentUp: { R: A(96, -300, 'open', { bend: 'down' }), L: A(80, -380, 'fist', { bend: 'down' }) },
    vishnu:  { R: A(66, -300, 'fist', { bend: 'down' }), L: A(72, -204, 'fist') },
    brahma:  { R: A(40, -292, 'fist', { bend: 'down' }), L: A(70, -208, 'fist') },
    mala:    { R: A(26, -282, 'fist', { bend: 'down' }), L: A(56, -190, 'down') },
    lamp:    { R: A(40, -280, 'cup', { bend: 'down' }), L: A(34, -276, 'cup', { bend: 'down' }) },
    garland: { R: A(60, -330, 'fist', { bend: 'down' }), L: A(60, -330, 'fist', { bend: 'down' }) },
    sword:   { R: A(96, -380, 'fist'), L: A(70, -250, 'open', { bend: 'down' }) },
    // extra arm pairs of many-armed deities (index 1, 2, ...)
    up1:     { R: A(112, -410, 'fist', { bend: 'down' }), L: A(112, -410, 'fist', { bend: 'down' }) },
    up2:     { R: A(146, -350, 'fist', { bend: 'down' }), L: A(146, -350, 'fist', { bend: 'down' }) },
    up3:     { R: A(150, -268, 'fist', { bend: 'down' }), L: A(150, -268, 'fist', { bend: 'down' }) },
    up4:     { R: A(126, -470, 'fist'), L: A(126, -470, 'fist') },
  };

  // -------------------------------------------------------------- ITEMS -------
  // drawn in hand space: grip at (0,0), item "up" is -y
  const ITEMS = {
    trishul: () => {   // trident with Shiva's damaru tied below the prongs
      let s = P('M-3,170L-3,-120L3,-120L3,170Z', '#6b4a2a');
      s += P('M-14,-118L14,-118L10,-108L-10,-108Z', GOLD);
      s += P('M0,-210C6,-182 7,-150 5,-122L-5,-122C-7,-150 -6,-182 0,-210Z', '#d9dde4');
      s += P('M-6,-124C-26,-130 -34,-150 -32,-186C-26,-160 -16,-146 -4,-140Z', '#d9dde4');
      s += P('M6,-124C26,-130 34,-150 32,-186C26,-160 16,-146 4,-140Z', '#d9dde4');
      s += L('M-2,-200L-2,-130', 1.4, '#ffffff', 0.7);
      s += P('M-11,-100L11,-100L4,-88L11,-76L-11,-76L-4,-88Z', '#c9873c');   // damaru
      s += L('M-11,-100L11,-76M11,-100L-11,-76', 1, INK, 0.6) + C(-16, -84, 2.4, INK) + C(16, -86, 2.4, INK) + L('M-11,-88L-16,-84M11,-88L16,-86', 1);
      s += L('M-4,-110C-14,-104 -18,-94 -14,-90', 1.6, '#c8372d');
      return s;
    },
    damaru: () => P('M-13,-16L13,-16L4,0L13,16L-13,16L-4,0Z', '#c9873c') + L('M-13,-16L13,16M13,-16L-13,16', 1, INK, 0.5) + C(-19, 4, 2.6, INK) + C(19, -4, 2.6, INK),
    chakra: (st) => {   // Sudarshana: spinning toothed discus balanced on the finger
      const a = ((st && st.t) || 0) * 240;
      let s = `<g transform="translate(0 -26) rotate(${f1(a)})">`;
      let teeth = ''; for (let i = 0; i < 16; i++) { const t = i / 16 * Math.PI * 2, t2 = t + Math.PI / 16; teeth += `${pt(Math.cos(t) * 24, Math.sin(t) * 24)}L${pt(Math.cos(t2) * 31, Math.sin(t2) * 31)}L`; }
      s += P('M' + teeth.slice(0, -1) + 'Z', '#ffd54a');
      s += C(0, 0, 20, '#ff9b2a', { ink: true, w: 2 }) + C(0, 0, 9, GOLD_L, { ink: true, w: 1.6 });
      for (let i = 0; i < 8; i++) { const t = i / 8 * Math.PI * 2; s += L(`M${pt(Math.cos(t) * 9, Math.sin(t) * 9)}L${pt(Math.cos(t) * 20, Math.sin(t) * 20)}`, 1.6); }
      s += `</g><circle cx="0" cy="-26" r="40" fill="url(#cbGlow)" opacity="0.55"/>`;
      return s;
    },
    shankha: () => P('M-10,-8C-20,-26 -12,-50 4,-58C20,-52 22,-30 14,-16C10,-6 2,0 -10,-8Z', '#fbf3e4') + L('M-6,-14C0,-24 6,-34 4,-50M2,-12C8,-22 12,-30 12,-42', 1.4, '#c9b8a0') + P('M4,-58C8,-66 14,-66 14,-60C12,-56 8,-56 4,-58Z', '#f0c8b0'),
    gada: () => P('M-4,10L-4,-80L4,-80L4,10Z', GOLD_D) + P('M0,-128C18,-126 22,-104 16,-88C10,-78 -10,-78 -16,-88C-22,-104 -18,-126 0,-128Z', GOLD) + L('M-14,-104L14,-104M-12,-92L12,-92', 1.6, GOLD_D) + C(0, -132, 4, GOLD, { ink: true }),
    padma: () => {   // a pink lotus held by its stalk
      let s = L('M0,0C2,-20 -2,-40 0,-56', 3, '#3f7a3a');
      const pet = (r, c) => `<path transform="rotate(${r} 0 -60)" d="M0,-60C-9,-70 -8,-88 0,-96C8,-88 9,-70 0,-60Z" fill="${c}" stroke="${INK}" stroke-width="1.6"/>`;
      s += pet(-50, '#f59ab8') + pet(50, '#f59ab8') + pet(-25, '#f7b0c8') + pet(25, '#f7b0c8') + pet(0, '#fbd0de');
      return s;
    },
    vajra: () => P('M-4,-20L4,-20L4,20L-4,20Z', GOLD_D) + P('M0,-20C-14,-30 -16,-50 0,-70C16,-50 14,-30 0,-20Z', GOLD) + P('M0,20C-14,30 -16,50 0,70C16,50 14,30 0,20Z', GOLD) + L('M0,-66L0,-24M0,24L0,66', 1.4, GOLD_D),
    bow: () => {   // Kama's sugarcane bow strung with a line of bees, a flower arrow
      let s = P('M-6,-120C-30,-70 -30,70 -6,120L0,120C-22,70 -22,-70 0,-120Z', '#7ab84a');
      for (let y = -100; y <= 100; y += 22) s += L(`M${f1(-24 + Math.abs(y) / 9)},${y}L${f1(-14 + Math.abs(y) / 9)},${y}`, 1.6, '#3f6a2a');
      s += L('M-2,-120L6,0L-2,120', 1.4, '#3a2a10', 0.85);
      for (let y = -100; y <= 100; y += 14) s += C(2 + (1 - Math.abs(y) / 120) * 4, y, 2.2, '#2a2210');
      return s;
    },
    arrow: () => L('M0,40L0,-90', 2.2, '#6b4a2a') + P('M0,-110C-10,-104 -10,-92 0,-88C10,-92 10,-104 0,-110Z', '#f27aa8') + C(0, -98, 3, GOLD_L) + L('M-6,40L0,30L6,40', 1.6),
    veena: () => {   // Narada's mahati veena across the body
      let s = '<g transform="translate(0 40)">' + P('M-6,-150L6,-150L6,90L-6,90Z', '#8a4a20');
      s += P('M0,60C-26,60 -36,90 -30,112C-22,134 22,134 30,112C36,90 26,60 0,60Z', '#c8822e');
      s += P('M0,-130C-20,-130 -28,-108 -22,-92C-16,-78 16,-78 22,-92C28,-108 20,-130 0,-130Z', '#c8822e');
      for (let i = -2; i <= 2; i++) s += L(`M${i * 2},-150L${i * 2},100`, 0.7, '#f4e6c8', 0.9);
      for (let y = -60; y < 50; y += 16) s += L(`M-7,${y}L7,${y}`, 1.2, GOLD);
      return s + '</g>';
    },
    kamandalu: () => `<g transform="translate(0 50)">` + P('M-16,-6C-22,-30 -12,-46 0,-46C12,-46 22,-30 16,-6C10,4 -10,4 -16,-6Z', '#7a4a24') + L('M-10,-40C-12,-60 12,-60 10,-40', 2.4) + P('M14,-28C26,-32 30,-40 28,-46L24,-44C24,-38 20,-34 14,-34Z', '#7a4a24') + '</g>',
    mala: () => { let s = ''; for (let i = 0; i < 14; i++) { const t = i / 14 * Math.PI * 2; s += C(Math.cos(t) * 12, 18 + Math.sin(t) * 22, 2.8, '#7a3a1a', { ink: true, w: 0.8 }); } return s; },
    book: () => P('M-28,-12L28,-12L28,4L-28,4Z', '#e8c98a') + L('M-28,-6L28,-6M-28,-1L28,-1', 1, '#9a6a2a') + P('M-30,-14L-24,-14L-24,6L-30,6ZM24,-14L30,-14L30,6L24,6Z', '#8a4a20'),
    sruva: () => L('M0,20L0,-80', 3.4, '#8a5a2a') + P('M0,-80C-10,-86 -10,-100 0,-104C10,-100 10,-86 0,-80Z', '#c99a5a'),
    sword: () => P('M-5,-8L5,-8L4,-140L0,-156L-4,-140Z', '#dfe5ee') + L('M0,-14L0,-144', 1, '#9aa4b4') + P('M-16,-10L16,-10L16,-4L-16,-4Z', GOLD) + P('M-3,-4L3,-4L3,18L-3,18Z', '#5a3a1a'),
    danda: () => L('M0,140L0,-150', 5, '#7a5a3a') + L('M0,140L0,-150', 2, '#a07a52'),
    lamp: () => P('M-18,0C-16,10 16,10 18,0L14,-6L-14,-6Z', '#c9873c') + `<path d="M0,-8C-6,-16 -4,-28 0,-36C4,-28 6,-16 0,-8Z" fill="#ffd54a"/><circle cx="0" cy="-22" r="26" fill="url(#cbGlow)" opacity="0.8"/>`,
    varmala: () => { let s = L('M-40,0C-40,60 40,60 40,0', 7, '#e85a2a'); for (let i = 0; i < 9; i++) { const t = i / 8; s += C(lerp(-40, 40, t), Math.sin(t * Math.PI) * 44, 5, i % 2 ? '#f2c230' : '#f5f0e0', { ink: true, w: 1 }); } return s; },
    noose: () => L('M0,0C20,20 30,50 10,70C-10,90 -30,70 -20,50C-10,30 10,40 10,60', 3, '#c8a25a'),
    potgold: () => P('M-22,-4C-28,-30 -14,-44 0,-44C14,-44 28,-30 22,-4C16,8 -16,8 -22,-4Z', GOLD) + C(-6, -48, 5, GOLD_L, { ink: true, w: 1.2 }) + C(6, -48, 5, GOLD_L, { ink: true, w: 1.2 }) + C(0, -54, 5, GOLD_L, { ink: true, w: 1.2 }),
    mirror: () => C(0, -40, 22, '#cfe6f2', { ink: true, w: 2.6 }) + L('M0,-18L0,10', 4, GOLD_D) + HI('M-12,-50C-8,-58 2,-60 6,-58C0,-52 -6,-48 -12,-50Z', 0.8),
    skullstaff: () => L('M0,140L0,-130', 4, '#8a6a4a') + P('M-10,-130C-12,-150 12,-150 10,-130L6,-122L-6,-122Z', '#e9e2cc'),
    flower: () => C(0, -6, 8, '#f6d24a', { ink: true }) + C(0, -6, 3, '#e8641e'),
    fruit: () => C(0, -8, 9, '#e8641e', { ink: true }),
    rice: () => P('M-20,-2C-18,8 18,8 20,-2Z', '#a0703a') + P('M-16,-4C-10,-12 10,-12 16,-4Z', '#fbf6e8'),
  };

  // --------------------------------------------------------------- HEAD -------
  // local head space: centre (0,0), crown at -30, chin at +29. turn > 0 turns the face toward +x.
  function face(o, st, turn) {
    const F = o.female, skin = o.skin, LC = o.ink || INK;
    const tw = turn * 7;   // feature shift
    const hw = F ? 19.5 : 21.5, sk = shade(skin, -0.3);
    const cR = 1 - 0.12 * Math.max(0, turn), cL = 1 + 0.05 * Math.max(0, turn);
    const X = (x) => x > 0 ? x * cR : x * cL;
    const jaw = o.jaw || (F ? 0.86 : 1);
    const outline = [[X(-hw + 1), -16], [X(-hw), -2], [X(-hw * 0.86 * jaw), 13], [X(-10 * jaw), 25], [tw * 0.4, 29.5], [X(10 * jaw), 25], [X(hw * 0.86 * jaw), 13], [X(hw), -2], [X(hw - 1), -16], [X(12), -27], [0, -30], [X(-12), -27]];
    const d = smooth(outline);
    let s = '';
    // ears
    s += P(`M${f1(X(-hw) + 1)},-6C${f1(X(-hw) - 7)},-9 ${f1(X(-hw) - 7)},8 ${f1(X(-hw) + 1)},7Z`, skin, { w: 2 });
    s += P(`M${f1(X(hw) - 1)},-6C${f1(X(hw) + 6)},-9 ${f1(X(hw) + 6)},8 ${f1(X(hw) - 1)},7Z`, skin, { w: 2 });
    if (o.earring !== false) { s += C(X(-hw) - 2, 12, F ? 4 : 3.4, GOLD, { ink: true, w: 1.3 }); s += C(X(hw) + 2, 12, F ? 4 : 3.4, GOLD, { ink: true, w: 1.3 }); }
    s += P(d, skin, { ink: false });
    // cel shadow: the far cheek and under the brow ridge
    s += SH(`M${f1(X(hw) - 1)},-16C${f1(X(hw) + 1)},-2 ${f1(X(hw * 0.86))},13 ${f1(X(10 * jaw))},25L${f1(tw * 0.4)},29.5C${f1(X(9))},18 ${f1(X(13))},4 ${f1(X(11))},-12Z`, skin, -0.26);
    s += HI(`M${f1(X(-hw + 4))},-14C${f1(X(-hw + 2))},-4 ${f1(X(-hw + 4))},6 ${f1(X(-hw + 7))},10C${f1(X(-hw + 7))},2 ${f1(X(-hw + 6))},-8 ${f1(X(-hw + 7))},-15Z`, 0.35);
    s += P(d, 'none', { w: 2.8, col: LC });
    // eyes
    const emo = st.emo || 'neutral', blink = st.blink || 0;
    let browIn = 0, browUp = 0, lid = 0;
    if (emo === 'angry' || emo === 'rage') { browIn = 4.5; lid = 1.4; }
    if (emo === 'fear' || emo === 'shock') { browUp = 3.5; lid = -1.4; }
    if (emo === 'sad') { browUp = 2.2; browIn = -3; lid = 0.8; }
    if (emo === 'calm' || emo === 'serene') { lid = 2.2; }
    if (emo === 'sly') { lid = 2; browIn = 1.5; }
    if (emo === 'joy' || emo === 'smile') { lid = 0.6; }
    const meditate = emo === 'meditate' || o.eyesClosed;
    for (const side of [-1, 1]) {
      const sc = side > 0 ? cR : cL;
      const ex = (side * 9.5) * sc + tw, ey = -3, ew = (F ? 6.8 : 6.2) * sc, eh = (F ? 4.2 : 3.4);
      if (meditate || blink > 0.85) {
        s += L(`M${f1(ex - ew)},${ey}C${f1(ex - ew / 2)},${ey + 3} ${f1(ex + ew / 2)},${ey + 3} ${f1(ex + ew)},${ey}`, 2.2, LC);
      } else {
        const top = ey - eh + lid, bot = ey + eh * 0.75;
        const ed = `M${f1(ex - ew)},${ey}C${f1(ex - ew * 0.5)},${f1(top)} ${f1(ex + ew * 0.5)},${f1(top)} ${f1(ex + ew)},${ey}C${f1(ex + ew * 0.5)},${f1(bot)} ${f1(ex - ew * 0.5)},${f1(bot)} ${f1(ex - ew)},${ey}Z`;
        s += P(ed, o.eyeWhite || '#fffaf0', { w: 1.2, col: LC });
        const gx = (st.look === 'left' ? -2.4 : st.look === 'right' ? 2.4 : turn * 2) , gy = st.look === 'up' ? -1.6 : st.look === 'down' ? 1.4 : 0;
        const id = 'ey' + (++CLIP);
        s += `<clipPath id="${id}"><path d="${ed}"/></clipPath><g clip-path="url(#${id})">${C(ex + gx, ey + gy + 0.4, F ? 3.4 : 3, o.iris || '#3a2414')}${C(ex + gx, ey + gy + 0.4, 1.5, '#0a0605')}${C(ex + gx - 1, ey + gy - 0.8, 0.9, '#ffffff')}</g>`;
        s += L(`M${f1(ex - ew - 1)},${ey + 0.5}C${f1(ex - ew * 0.5)},${f1(top - 0.6)} ${f1(ex + ew * 0.5)},${f1(top - 0.6)} ${f1(ex + ew + 1)},${ey - 0.5}`, F ? 2.6 : 2.4, LC);
        if (F) s += L(`M${f1(ex + side * ew)},${ey - 0.6}L${f1(ex + side * (ew + 2.6))},${ey - 2.4}`, 1.6, LC);
        if (blink > 0.1) s += P(`M${f1(ex - ew - 1)},${ey}C${f1(ex - ew * 0.5)},${f1(top - 1)} ${f1(ex + ew * 0.5)},${f1(top - 1)} ${f1(ex + ew + 1)},${ey}L${f1(ex + ew + 1)},${f1(ey + (bot - ey) * blink)}L${f1(ex - ew - 1)},${f1(ey + (bot - ey) * blink)}Z`, skin, { w: 1.2 });
      }
      // brows
      const bx0 = ex - side * ew * 1.05, bx1 = ex + side * ew * 1.1, by = -10.5 - browUp;
      const inner = side < 0 ? bx1 : bx0;
      const bw = o.browW || (F ? 1.6 : 2.6);
      const browCol = o.brow || o.hairCol || '#1a120c';
      s += P(`M${f1(bx0)},${f1(by + (side < 0 ? 0.6 : browIn))}C${f1(lerp(bx0, bx1, 0.4))},${f1(by - 2.4)} ${f1(lerp(bx0, bx1, 0.7))},${f1(by - 1.8)} ${f1(bx1)},${f1(by + (side < 0 ? browIn : 0.6))}L${f1(bx1)},${f1(by + (side < 0 ? browIn : 0.6) + bw * 0.4)}C${f1(lerp(bx0, bx1, 0.6))},${f1(by - 0.2 + bw)} ${f1(lerp(bx0, bx1, 0.3))},${f1(by - 0.2 + bw)} ${f1(bx0)},${f1(by + (side < 0 ? 0.6 : browIn) + bw)}Z`, browCol, { w: 1, col: browCol });
      void inner;
    }
    // nose
    const nx = tw * 1.25 + 1;
    s += L(`M${f1(nx + 1)},-1C${f1(nx + 2.4)},4 ${f1(nx + 3.4)},8 ${f1(nx + 2)},${F ? 9.5 : 11}`, 1.8, LC);
    s += L(`M${f1(nx - 4)},${F ? 10 : 11.5}C${f1(nx - 2)},${F ? 12 : 13.5} ${f1(nx + 1)},${F ? 12 : 13.5} ${f1(nx + 3)},${F ? 10.5 : 12}`, 1.6, LC);
    if (o.noseRing) s += L(`M${f1(nx - 4)},11C${f1(nx - 9)},13 ${f1(nx - 8)},20 ${f1(nx - 3)},18`, 1.3, GOLD_D);
    // mouth: upper lip, open interior from the voice envelope, lower lip
    const open = clamp(st.open || 0) * (F ? 5 : 6);
    const my = F ? 17.5 : 19, mw = F ? 6.6 : 7.4, mx = tw * 0.9;
    let smile = (emo === 'joy' || emo === 'smile') ? 2 : (emo === 'sad' || emo === 'angry' || emo === 'rage' || emo === 'fear') ? -1.6 : (emo === 'sly' ? 1 : 0.3);
    const lipCol = o.lips || (F ? '#c42e4a' : shade(skin, -0.35));
    if (open > 0.6) {
      s += P(`M${f1(mx - mw)},${my}C${f1(mx - mw / 2)},${f1(my - 1.2)} ${f1(mx + mw / 2)},${f1(my - 1.2)} ${f1(mx + mw)},${my}C${f1(mx + mw / 2)},${f1(my + open + 1)} ${f1(mx - mw / 2)},${f1(my + open + 1)} ${f1(mx - mw)},${my}Z`, '#4a0e12', { w: 1.6, col: LC });
      s += P(`M${f1(mx - mw * 0.6)},${f1(my - 0.4)}L${f1(mx + mw * 0.6)},${f1(my - 0.4)}L${f1(mx + mw * 0.5)},${f1(my + 1.4)}L${f1(mx - mw * 0.5)},${f1(my + 1.4)}Z`, '#fbf6ee', { ink: false });
      if (o.fangs) s += P(`M${f1(mx - mw * 0.6)},${my}l1.6,4l1.6,-4ZM${f1(mx + mw * 0.6 - 3.2)},${my}l1.6,4l1.6,-4Z`, '#fbf6ee', { w: 0.8 });
    } else {
      s += L(`M${f1(mx - mw)},${f1(my - smile * 0.6)}C${f1(mx - mw / 3)},${f1(my + smile * 0.8)} ${f1(mx + mw / 3)},${f1(my + smile * 0.8)} ${f1(mx + mw)},${f1(my - smile * 0.6)}`, 2, LC);
      if (o.fangs) s += P(`M${f1(mx - mw * 0.7)},${f1(my)}l1.5,4.6l1.5,-4.4ZM${f1(mx + mw * 0.7 - 3)},${f1(my)}l1.5,4.6l1.5,-4.4Z`, '#fbf6ee', { w: 0.8 });
    }
    if (F || o.lipsCol) s += P(`M${f1(mx - mw * 0.75)},${f1(my + 1.6 + open)}C${f1(mx - 2)},${f1(my + 4.6 + open)} ${f1(mx + 2)},${f1(my + 4.6 + open)} ${f1(mx + mw * 0.75)},${f1(my + 1.6 + open)}C${f1(mx + 2)},${f1(my + 2.6 + open)} ${f1(mx - 2)},${f1(my + 2.6 + open)} ${f1(mx - mw * 0.75)},${f1(my + 1.6 + open)}Z`, lipCol, { w: 1, col: LC });
    else s += L(`M${f1(mx - 3)},${f1(my + 4 + open)}L${f1(mx + 3)},${f1(my + 4 + open)}`, 1.4, LC, 0.6);
    // marks on the forehead
    if (o.tilak === 'tripundra') { for (const y of [-21, -17.5, -14]) s += L(`M${f1(-11 + tw)},${y}L${f1(11 + tw)},${y}`, 1.8, '#f4f1ea'); s += C(tw, -17.5, 1.6, '#d21f3c'); }
    if (o.tilak === 'vaishnav') { s += L(`M${f1(-4 + tw)},-24L${f1(-3 + tw)},-13C${f1(-1 + tw)},-10 ${f1(1 + tw)},-10 ${f1(3 + tw)},-13L${f1(4 + tw)},-24`, 1.8, '#f4f1ea'); s += L(`M${f1(tw)},-23L${f1(tw)},-13`, 1.8, '#d21f3c'); }
    if (o.tilak === 'bindi') s += C(tw, -13, 2.2, '#d21f3c');
    if (o.tilak === 'ash') for (const y of [-21, -17.5, -14]) s += L(`M${f1(-11 + tw)},${y}L${f1(11 + tw)},${y}`, 1.6, '#e8e4dc', 0.9);
    if (o.thirdEye) {
      const ex = tw, ey = -19;
      if (st.thirdOpen) { s += P(`M${f1(ex)},${ey - 7}C${f1(ex + 4)},${ey - 3} ${f1(ex + 4)},${ey + 3} ${f1(ex)},${ey + 7}C${f1(ex - 4)},${ey + 3} ${f1(ex - 4)},${ey - 3} ${f1(ex)},${ey - 7}Z`, '#ffeb9a', { w: 1.4 }) + C(ex, ey, 2.2, '#e8380a'); }
      else s += P(`M${f1(ex)},${ey - 6}C${f1(ex + 2.4)},${ey - 2} ${f1(ex + 2.4)},${ey + 2} ${f1(ex)},${ey + 6}C${f1(ex - 2.4)},${ey + 2} ${f1(ex - 2.4)},${ey - 2} ${f1(ex)},${ey - 6}Z`, '#c42e4a', { w: 1.2 });
    }
    // facial hair
    if (o.mustache) s += P(`M${f1(mx)},${f1(my - 3)}C${f1(mx - 4)},${f1(my - 6)} ${f1(mx - 11)},${f1(my - 4)} ${f1(mx - 13)},${f1(my + 1)}C${f1(mx - 9)},${f1(my - 1)} ${f1(mx - 4)},${f1(my - 1)} ${f1(mx)},${f1(my - 1.4)}C${f1(mx + 4)},${f1(my - 1)} ${f1(mx + 9)},${f1(my - 1)} ${f1(mx + 13)},${f1(my + 1)}C${f1(mx + 11)},${f1(my - 4)} ${f1(mx + 4)},${f1(my - 6)} ${f1(mx)},${f1(my - 3)}Z`, o.beardCol || o.hairCol || '#1a120c', { w: 1.2 });
    if (o.beard === 'short') s += P(`M${f1(X(-hw * 0.86))},12C${f1(X(-12))},30 ${f1(X(12))},30 ${f1(X(hw * 0.86))},12C${f1(X(12))},38 ${f1(X(-12))},38 ${f1(X(-hw * 0.86))},12Z`, o.beardCol || '#1a120c', { w: 1.6 });
    if (o.beard === 'long') {
      const bc = o.beardCol || '#e9e4d8';
      s += P(`M${f1(X(-hw * 0.9))},6C${f1(X(-hw))},26 ${f1(X(-14))},46 ${f1(tw * 0.5)},64C${f1(X(14))},46 ${f1(X(hw))},26 ${f1(X(hw * 0.9))},6C${f1(X(14))},22 ${f1(X(7))},${f1(my + 6 + open)} ${f1(mx)},${f1(my + 5 + open)}C${f1(X(-7))},${f1(my + 6 + open)} ${f1(X(-14))},22 ${f1(X(-hw * 0.9))},6Z`, bc, { w: 2 });
      s += L(`M${f1(X(-8))},30C${f1(X(-6))},42 ${f1(X(-3))},50 ${f1(tw * 0.5 - 2)},58M${f1(X(6))},32C${f1(X(5))},42 ${f1(X(3))},50 ${f1(tw * 0.5 + 2)},56`, 1.2, shade(bc, -0.35));
      s += SH(`M${f1(X(4))},${f1(my + 6)}C${f1(X(14))},22 ${f1(X(hw))},26 ${f1(X(hw * 0.9))},8C${f1(X(hw))},28 ${f1(X(14))},46 ${f1(tw * 0.5)},62C${f1(X(8))},44 ${f1(X(6))},30 ${f1(X(4))},${f1(my + 6)}Z`, bc, -0.2);
      if (o.mustache) s += P(`M${f1(mx)},${f1(my - 3)}C${f1(mx - 4)},${f1(my - 6)} ${f1(mx - 11)},${f1(my - 4)} ${f1(mx - 13)},${f1(my + 3)}C${f1(mx - 9)},${f1(my)} ${f1(mx - 4)},${f1(my - 1)} ${f1(mx)},${f1(my - 1.4)}C${f1(mx + 4)},${f1(my - 1)} ${f1(mx + 9)},${f1(my)} ${f1(mx + 13)},${f1(my + 3)}C${f1(mx + 11)},${f1(my - 4)} ${f1(mx + 4)},${f1(my - 6)} ${f1(mx)},${f1(my - 3)}Z`, bc, { w: 1.2 });
    }
    return s;
  }
  let CLIP = 0;

  // a profile head (facing +x) for the side faces of Brahma
  function profileHead(o, st) {
    const skin = o.skin;
    let s = '';
    const d = 'M-14,-28C4,-34 18,-28 20,-14C21,-8 22,-4 27,4C25,6 22,6 21,7C22,10 21,13 20,15C21,18 19,22 16,24C10,30 -4,30 -12,22C-22,14 -24,-14 -14,-28Z';
    s += P(d, skin, { w: 2.6 });
    s += SH('M-12,22C-22,14 -24,-14 -14,-28C-18,-10 -16,8 -6,20Z', skin, -0.28);
    s += P('M8,-5C11,-8 15,-7 16,-4C13,-2 10,-2 8,-5Z', '#fffaf0', { w: 1 }) + C(13, -4.6, 1.6, '#2a1a10');
    s += L('M6,-11C10,-13 15,-12 18,-10', 2.2);
    s += C(-4, 0, 4.2, skin, { ink: true, w: 2 });
    if (o.beard === 'long') s += P('M-8,8C-6,24 4,40 16,52C20,38 22,26 20,15C16,20 10,20 6,16C2,14 -4,10 -8,8Z', o.beardCol || '#eee', { w: 1.8 }) + P('M10,9C14,7 20,8 22,11C18,12 14,12 10,9Z', o.beardCol || '#eee', { w: 1 });
    // crown
    s += P('M-18,-26L-14,-50L-6,-40L2,-56L8,-40L16,-48L18,-26C6,-32 -6,-32 -18,-26Z', GOLD, { w: 2 }) + C(2, -40, 2.6, RUBY);
    return s;
  }

  // hair masses that sit behind the head and body
  function hairBack(o, st) {
    const hc = o.hairCol || '#1a120c', t = st.t || 0, sway = Math.sin(t * 1.3 + (o.seed || 0)) * 3;
    switch (o.hair) {
      case 'jata': return P(`M-22,-10C-36,20 -44,60 -40,${f1(96 + sway)}C-30,${f1(88 + sway)} -24,${f1(100 + sway)} -14,${f1(92 + sway)}L14,${f1(92 - sway)}C24,${f1(100 - sway)} 30,${f1(88 - sway)} 40,${f1(96 - sway)}C44,60 36,20 22,-10Z`, hc, { w: 2.4 }) +
        L(`M-30,30C-34,50 -34,70 -32,${f1(88 + sway)}M30,30C34,50 34,70 32,${f1(88 - sway)}M-20,40C-22,60 -22,74 -20,90M20,40C22,60 22,74 20,90`, 1.4, shade(hc, 0.25));
      case 'long': return P(`M-22,-14C-34,20 -36,70 -30,${f1(118 + sway)}C-10,${f1(124 + sway)} 10,${f1(124 - sway)} 30,${f1(118 - sway)}C36,70 34,20 22,-14Z`, hc, { w: 2.4 }) + L('M-24,40C-26,70 -24,96 -20,112M24,40C26,70 24,96 20,112', 1.4, shade(hc, 0.22));
      case 'kirit': case 'flow': return P(`M-22,-8C-32,16 -34,46 -28,${f1(64 + sway)}L28,${f1(64 - sway)}C34,46 32,16 22,-8Z`, hc, { w: 2.4 });
      case 'wild': return P(`M-24,-6C-48,10 -58,40 -50,70C-40,56 -36,70 -26,60C-20,74 -10,62 0,72C10,62 20,74 26,60C36,70 40,56 50,70C58,40 48,10 24,-6Z`, hc, { w: 2.4 });
      case 'rishi': return P(`M-22,-8C-30,16 -30,40 -24,56L24,56C30,40 30,16 22,-8Z`, hc, { w: 2.2 });
      default: return '';
    }
  }
  // hair and headgear on top of the face
  function hairFront(o, st, turn) {
    const hc = o.hairCol || '#1a120c', tw = turn * 6, t = st.t || 0;
    let s = '';
    const cap = (h = -30) => P(`M-22,-8C-24,-26 -12,${h - 4} 0,${h - 4}C12,${h - 4} 24,-26 22,-8C14,-20 6,-22 ${f1(tw)},-21C-6,-22 -14,-20 -22,-8Z`, hc, { w: 2.4 });
    switch (o.crown) {
      case 'jata': {   // Shiva: piled matted locks, crescent moon, Ganga springing from the locks, a band of rudraksha
        s += cap(-30);
        s += P('M-20,-24C-28,-50 -18,-80 -4,-92C2,-96 10,-94 14,-88C26,-76 30,-48 20,-24Z', hc, { w: 2.6 });
        for (let i = 0; i < 5; i++) s += L(`M${-14 + i * 6},-28C${-18 + i * 7},-50 ${-10 + i * 5},-72 ${-4 + i * 3},-88`, 1.4, shade(hc, 0.3));
        s += P('M-22,-30C-10,-36 10,-36 22,-30L22,-24C10,-30 -10,-30 -22,-24Z', '#7a3a1a', { w: 1.6 });
        for (let i = -3; i <= 3; i++) s += C(i * 6, -27.5, 2.2, '#9a4a20', { ink: true, w: 0.8 });
        if (o.moon !== false) s += P('M-26,-66C-34,-78 -30,-96 -16,-102C-24,-92 -26,-78 -18,-68C-12,-60 0,-58 6,-62C-2,-54 -18,-56 -26,-66Z', '#fdf6d8', { w: 2 });
        if (o.ganga) { const w = Math.sin(t * 4) * 2; s += P(`M12,-84C20,-100 30,-104 36,-100C30,-96 ${f1(26 + w)},-88 ${f1(24 + w)},-76C${f1(22 + w)},-70 18,-70 16,-76Z`, '#9fd8f2', { w: 1.8 }) + L(`M20,-90C26,-96 30,-98 33,-98`, 1.2, '#ffffff', 0.8); }
        if (o.snakeHair) s += P('M14,-60C24,-62 28,-54 22,-48C18,-46 14,-50 14,-54Z', '#3f8a5a', { w: 1.6 });
        break;
      }
      case 'kirit': {   // Vishnu's tall crown
        s += cap(-28);
        s += P('M-22,-24L-20,-62C-16,-80 -8,-92 0,-104C8,-92 16,-80 20,-62L22,-24C10,-30 -10,-30 -22,-24Z', GOLD, { w: 2.6 });
        s += SH('M6,-28L20,-62C16,-80 8,-92 0,-104C6,-80 8,-50 6,-28Z', GOLD, -0.25);
        s += P('M-22,-30C-10,-36 10,-36 22,-30L22,-22C10,-28 -10,-28 -22,-22Z', GOLD_D, { w: 1.6 });
        for (const [x, y, r, c] of [[0, -50, 5, RUBY], [-10, -40, 3, EMER], [10, -40, 3, EMER], [0, -72, 3.4, RUBY], [0, -88, 2.4, PEARL]]) s += C(x, y, r, c, { ink: true, w: 1.1 });
        s += P('M-6,-104L0,-118L6,-104Z', GOLD, { w: 1.6 });
        for (const x of [-26, 26]) s += P(`M${x},-30C${x + Math.sign(x) * 10},-40 ${x + Math.sign(x) * 12},-22 ${x + Math.sign(x) * 4},-14Z`, GOLD, { w: 1.6 });
        break;
      }
      case 'mukut': {   // a king's or deva's crown
        s += cap(-28);
        s += P('M-22,-24L-24,-46L-12,-38L-6,-58L0,-44L6,-58L12,-38L24,-46L22,-24C10,-30 -10,-30 -22,-24Z', o.crownCol || GOLD, { w: 2.4 });
        s += C(0, -34, 3.6, RUBY, { ink: true, w: 1.1 });
        break;
      }
      case 'brahma': {   // Brahma: a crowned bun of matted hair
        s += cap(-28);
        s += P('M-18,-24C-22,-44 -14,-62 0,-66C14,-62 22,-44 18,-24Z', o.hairCol || '#ece6d6', { w: 2.4 });
        s += P('M-22,-26L-20,-46L-10,-38L0,-54L10,-38L20,-46L22,-26C10,-32 -10,-32 -22,-26Z', GOLD, { w: 2.2 }) + C(0, -36, 3.4, RUBY, { ink: true, w: 1 });
        break;
      }
      case 'topknot': {   // Narada: a sage's shaved crown with a tied tuft and a flower
        s += P(`M-21,-10C-22,-26 -10,-32 0,-32C10,-32 22,-26 21,-10C14,-18 6,-20 0,-20C-6,-20 -14,-18 -21,-10Z`, hc, { w: 2.2 });
        s += P('M-8,-30C-12,-44 -4,-54 4,-52C12,-48 10,-36 6,-30Z', hc, { w: 2.2 }) + P('M-6,-36L8,-38L8,-33L-6,-31Z', '#f4f1ea', { w: 1.2 });
        if (o.flower) s += C(10, -50, 4.6, '#f6d24a', { ink: true, w: 1.2 }) + C(10, -50, 1.8, '#e8641e');
        break;
      }
      case 'shikha': {   // a brahmin's shaved head with a tuft
        s += P(`M-21,-10C-22,-26 -10,-31 0,-31C10,-31 22,-26 21,-10C14,-20 6,-24 0,-24C-6,-24 -14,-20 -21,-10Z`, shade(o.skin, -0.12), { w: 2.2 });
        s += P('M2,-30C-6,-40 -4,-50 4,-54C2,-46 8,-40 10,-34Z', hc, { w: 1.8 });
        break;
      }
      case 'rishi': {   // sage: grey matted bun
        s += cap(-29);
        s += P('M-14,-26C-18,-44 -8,-58 2,-58C12,-56 18,-42 14,-26Z', hc, { w: 2.4 });
        s += L('M-8,-30C-10,-42 -4,-52 2,-54M4,-30C6,-40 4,-50 0,-56', 1.2, shade(hc, -0.3));
        s += P('M-15,-30C-5,-34 5,-34 15,-30L15,-26C5,-30 -5,-30 -15,-26Z', '#c8822e', { w: 1.2 });
        break;
      }
      case 'female': case 'devi': case 'veil': case 'tapasvini': {
        // centre parting, hair over the ears
        s += P(`M-23,4C-26,-20 -14,-34 0,-34C14,-34 26,-20 23,4C20,-6 16,-16 6,-22C4,-18 2,-16 ${f1(tw * 0.2)},-15C-2,-16 -4,-18 -6,-22C-16,-16 -20,-6 -23,4Z`, hc, { w: 2.4 });
        s += L('M0,-33L0,-21', 1.6, '#d21f3c');
        if (o.crown === 'tapasvini') { s += P('M-14,-28C-18,-48 -6,-60 4,-58C14,-54 18,-40 14,-28Z', hc, { w: 2.2 }); s += P('M-15,-31C-5,-35 5,-35 15,-31L15,-27C5,-31 -5,-31 -15,-27Z', '#8a5a2a', { w: 1 }); break; }
        s += P('M-3,-21L3,-21L2,-14L0,-11L-2,-14Z', GOLD, { w: 1 });   // maang tikka
        if (o.crown === 'devi') { s += P('M-20,-24L-22,-42L-11,-34L-5,-52L0,-38L5,-52L11,-34L22,-42L20,-24C10,-30 -10,-30 -20,-24Z', GOLD, { w: 2.2 }) + C(0, -32, 3.2, RUBY, { ink: true, w: 1 }); }
        if (o.crown === 'veil') s += P(`M-30,10C-34,-24 -18,-42 0,-42C18,-42 34,-24 30,10C26,-12 18,-30 0,-30C-18,-30 -26,-12 -30,10Z`, o.veil || '#d84a6a', { w: 2.2 }) + L('M-28,0C-24,-22 -14,-34 0,-36C14,-34 24,-22 28,0', 2, GOLD, 0.9);
        break;
      }
      case 'wild': {   // Virabhadra and fierce beings: hair rising like flame
        const fl = Math.sin(t * 9) * 3;
        s += P(`M-24,-6C-30,-30 -40,-54 -30,${f1(-84 + fl)}C-26,-66 -20,-62 -16,-66C-18,-86 -8,-100 0,${f1(-112 - fl)}C8,-100 18,-86 16,-66C20,-62 26,-66 30,${f1(-84 + fl)}C40,-54 30,-30 24,-6C14,-20 -14,-20 -24,-6Z`, hc, { w: 2.6 });
        s += L('M-14,-30C-18,-50 -16,-66 -20,-74M0,-30C0,-60 -2,-80 0,-98M14,-30C18,-50 16,-66 20,-74', 1.6, shade(hc, 0.35));
        if (o.moon) s += P('M-16,-60C-22,-70 -18,-84 -6,-88C-12,-80 -14,-70 -8,-62C-4,-58 4,-56 8,-60C2,-52 -10,-52 -16,-60Z', '#fdf6d8', { w: 1.8 });
        break;
      }
      case 'asura': {   // a dark crown with a single spike and wild locks
        s += cap(-30);
        s += P('M-24,-22L-26,-50L-14,-40L-8,-66L0,-48L8,-66L14,-40L26,-50L24,-22C12,-30 -12,-30 -24,-22Z', o.crownCol || '#3a2a3a', { w: 2.4 });
        s += C(0, -34, 4, '#f2b632', { ink: true, w: 1.1 });
        break;
      }
      case 'turban': {
        s += P('M-24,-10C-28,-34 -12,-46 0,-46C14,-46 28,-34 24,-10C14,-18 -14,-18 -24,-10Z', o.turbanCol || '#c8372d', { w: 2.4 });
        s += L('M-22,-20C-8,-30 8,-36 22,-28M-20,-30C-6,-38 8,-42 18,-38', 1.4, shade(o.turbanCol || '#c8372d', -0.3));
        s += C(4, -34, 3, GOLD, { ink: true, w: 1 });
        break;
      }
      default: if (o.crown !== 'none') s += cap(-29);
    }
    return s;
  }

  // animal heads (Daksha's goat head after his revival; Narada's monkey face at the svayamvara)
  function animalHead(kind, o, st) {
    let s = '';
    if (kind === 'goat') {
      const c = '#efe6d2';
      s += P('M-30,-34C-50,-40 -58,-30 -56,-20C-46,-24 -36,-24 -26,-20Z', '#c9b48a', { w: 2 }) + P('M30,-34C50,-40 58,-30 56,-20C46,-24 36,-24 26,-20Z', '#c9b48a', { w: 2 });   // ears
      s += P('M-20,-30C-34,-60 -30,-80 -14,-88C-22,-74 -22,-54 -12,-34Z', '#a08a64', { w: 2 }) + P('M20,-30C34,-60 30,-80 14,-88C22,-74 22,-54 12,-34Z', '#a08a64', { w: 2 });   // horns
      s += P('M-24,-30C-24,-44 24,-44 24,-30C26,-6 18,20 10,36C4,44 -4,44 -10,36C-18,20 -26,-6 -24,-30Z', c, { w: 2.6 });
      s += SH('M8,-36C24,-36 26,-8 18,18C14,30 10,36 6,40C12,14 12,-14 8,-36Z', c, -0.22);
      s += P('M-10,-8C-6,-12 -2,-10 -2,-6C-6,-4 -8,-4 -10,-8ZM10,-8C6,-12 2,-10 2,-6C6,-4 8,-4 10,-8Z', '#f2c230', { w: 1 }) + C(-6, -7.6, 1.2, INK) + C(6, -7.6, 1.2, INK);
      s += P('M-6,32C-4,28 4,28 6,32C4,36 -4,36 -6,32Z', '#5a3a3a', { w: 1.2 });
      s += P('M-6,40C-8,54 -4,66 0,70C4,66 8,54 6,40Z', '#d8ccb2', { w: 1.6 });   // beard
      s += P('M-24,-30C-20,-40 20,-40 24,-30C14,-34 -14,-34 -24,-30Z', o.turbanCol || '#c8372d', { w: 1.6 });
      return s;
    }
    if (kind === 'monkey') {
      const fur = '#8a5a34', mug = '#f0c49a';
      s += C(-26, -2, 9, mug, { ink: true, w: 2.2 }) + C(26, -2, 9, mug, { ink: true, w: 2.2 });
      s += P('M-26,-14C-30,-36 -10,-40 0,-40C10,-40 30,-36 26,-14C30,10 20,32 0,34C-20,32 -30,10 -26,-14Z', fur, { w: 2.6 });
      s += P('M-18,-14C-20,-26 -4,-28 0,-22C4,-28 20,-26 18,-14C22,4 16,26 0,28C-16,26 -22,4 -18,-14Z', mug, { w: 2 });
      s += C(-8, -12, 3.6, '#fffaf0', { ink: true, w: 1.2 }) + C(8, -12, 3.6, '#fffaf0', { ink: true, w: 1.2 }) + C(-7, -12, 1.8, INK) + C(9, -12, 1.8, INK);
      s += L('M-16,-20C-10,-24 -4,-22 -2,-18M16,-20C10,-24 4,-22 2,-18', 2.2);
      s += P('M-5,2C-3,-2 3,-2 5,2C3,4 -3,4 -5,2Z', '#3a2210', { w: 1 });
      s += L(`M-10,${f1(14 + (st.open || 0) * 2)}C-4,${f1(20 + (st.open || 0) * 5)} 4,${f1(20 + (st.open || 0) * 5)} 10,${f1(14 + (st.open || 0) * 2)}`, 2.2);
      return s;
    }
    if (kind === 'elephant') {   // a ganesha-like gana head (unused for Ganesha himself in this volume)
      s += P('M-20,-30C-20,-44 20,-44 20,-30C24,0 10,30 4,60C2,70 -6,70 -6,60C-8,30 -24,0 -20,-30Z', '#9a9aa8', { w: 2.4 });
      return s;
    }
    return s;
  }

  // ---------------------------------------------------------- BODY PARTS -----
  function torsoPath(o) {
    const F = o.female, big = o.build === 'large' ? 1.18 : o.build === 'slim' ? 0.92 : o.build === 'child' ? 0.8 : 1;
    const sw = (F ? 40 : 50) * big, ww = (F ? 25 : 33) * big * (o.belly ? 1.25 : 1), hw = (F ? 44 : 39) * big;
    return { sw, ww, hw, d: smooth([[-10, -342], [-sw + 6, -336], [-sw - 2, -322], [-sw + 4, -296], [-ww - 2, -262], [-ww, -244], [-hw, -208], [0, -200], [hw, -208], [ww, -244], [ww + 2, -262], [sw - 4, -296], [sw + 2, -322], [sw - 6, -336], [10, -342], [0, -344]]) };
  }
  function lowerBody(o, st) {
    const F = o.female, t = st.t || 0;
    let s = '';
    const legCol = o.skin;
    const walk = st.walk ? Math.sin(t * 7) : 0;
    const lx = F ? 14 : 18;
    // legs / feet (visible below the garment)
    for (const side of [-1, 1]) {
      const kx = side * (lx + 2) + side * walk * 4, ax = side * lx + side * walk * 6;
      const lg = limb([kx, -110], [ax, -12], F ? 9 : 11, F ? 6 : 7.5, legCol, { flat: false });
      s += lg.out;
      s += P(`M${f1(ax - 8)},-12C${f1(ax - 10)},-2 ${f1(ax + side * 6 - 4)},2 ${f1(ax + side * 18)},1C${f1(ax + side * 22)},-2 ${f1(ax + side * 14)},-12 ${f1(ax + 6)},-14Z`, legCol, { w: 2.2 });
      if (o.anklet !== false) s += L(`M${f1(ax - 7)},-17L${f1(ax + 7)},-17`, 2.6, F ? GOLD : '#8a5a2a');
    }
    const g = o.lower || (F ? 'sari' : 'dhoti');
    if (g === 'dhoti' || g === 'pitambar') {
      const c = o.dhoti || '#f2c230', b = o.border || '#c8372d';
      const d = `M-40,-212C-44,-160 -42,-110 -34,-82C-24,-74 -10,-80 -4,-96L4,-96C10,-80 24,-74 34,-82C42,-110 44,-160 40,-212C14,-218 -14,-218 -40,-212Z`;
      s += P(d, c, { w: 2.6 });
      s += SH(`M8,-212C20,-170 22,-130 34,-82C42,-110 44,-160 40,-212Z`, c, -0.3);
      s += P('M-6,-206C-10,-170 -8,-128 -2,-96L6,-96C8,-130 8,-170 6,-206Z', shade(c, 0.12), { w: 1.8 });   // the front pleat
      s += L('M-2,-200L0,-100M2,-200L4,-102', 1.2, shade(c, -0.35));
      s += L('M-34,-82C-24,-74 -10,-80 -4,-96M34,-82C24,-74 10,-80 4,-96', 4, b);
      if (o.dhotiDots) for (let y = -196; y < -100; y += 18) for (let x = -32; x <= 32; x += 16) s += C(x + ((y / 18) % 2) * 8, y, 1.6, o.dhotiDots);
      s += P('M-42,-218C-14,-224 14,-224 42,-218L42,-206C14,-212 -14,-212 -42,-206Z', o.belt || GOLD, { w: 2 });
      s += C(0, -212, 4, RUBY, { ink: true, w: 1 });
    } else if (g === 'tiger') {   // Shiva's tiger skin
      const c = '#e8902a';
      const d = 'M-42,-214C-46,-170 -40,-140 -30,-118L-22,-128L-14,-112L-4,-126L6,-110L16,-126L26,-112L34,-124C42,-150 46,-180 42,-214C14,-220 -14,-220 -42,-214Z';
      s += P(d, c, { w: 2.6 });
      s += SH('M10,-214C22,-180 28,-150 26,-112L34,-124C42,-150 46,-180 42,-214Z', c, -0.3);
      for (const [x, y, r] of [[-30, -196, 10], [-14, -170, -14], [6, -196, 12], [22, -160, -10], [-26, -146, 12], [30, -186, 8], [-4, -144, -12]]) s += P(`M${x},${y}c${f1(r * 0.4)},6 ${f1(r * 0.2)},12 ${r},18c${f1(-r * 0.6)},-4 ${f1(-r * 0.6)},-12 ${f1(-r)},-18Z`, '#1a120c', { ink: false });
      s += P('M-30,-118C-34,-104 -28,-96 -22,-100C-24,-108 -24,-112 -22,-128Z', c, { w: 2 });   // a paw hanging at the front
      s += P('M-44,-222C-14,-228 14,-228 44,-222L44,-210C14,-216 -14,-216 -44,-210Z', '#5a3a1a', { w: 2 });
      // bare thighs above the knees
      s += limb([-18, -122], [-20, -108], 13, 11, o.skin, { flat: true }).out + limb([18, -122], [20, -108], 13, 11, o.skin, { flat: true }).out;
    } else if (g === 'valkala') {   // bark garment of an ascetic
      const c = '#9a6a3a';
      s += P('M-40,-214C-44,-170 -40,-120 -32,-80L32,-80C40,-120 44,-170 40,-214C14,-220 -14,-220 -40,-214Z', c, { w: 2.6 });
      for (let x = -32; x <= 32; x += 9) s += L(`M${x},-210C${x + 3},-170 ${x - 2},-120 ${x + 1},-84`, 1.3, shade(c, -0.35));
      s += SH('M10,-214C20,-170 24,-120 32,-80C40,-120 44,-170 40,-214Z', c, -0.25);
      s += P('M-42,-220C-14,-226 14,-226 42,-220L42,-208C14,-214 -14,-214 -42,-208Z', '#5a3a1a', { w: 2 });
    } else if (g === 'loin') {   // ganas
      const c = o.dhoti || '#5a2a2a';
      s += P('M-40,-214C-42,-180 -34,-150 -24,-130L24,-130C34,-150 42,-180 40,-214C14,-220 -14,-220 -40,-214Z', c, { w: 2.6 });
      s += limb([-18, -132], [-20, -108], 13, 11, o.skin, { flat: true }).out + limb([18, -132], [20, -108], 13, 11, o.skin, { flat: true }).out;
    } else if (g === 'sari' || g === 'lehenga') {
      const c = o.skirt || '#c8372d', b = o.border || GOLD, sway = Math.sin(t * 1.4 + (o.seed || 0)) * 3 + (st.walk ? Math.sin(t * 7) * 4 : 0);
      const d = `M-44,-214C-50,-150 -60,-70 ${f1(-66 + sway)},-8C-30,0 30,0 ${f1(66 + sway)},-8C60,-70 50,-150 44,-214C14,-220 -14,-220 -44,-214Z`;
      s += P(d, c, { w: 2.6 });
      s += SH(`M14,-214C26,-150 36,-70 ${f1(40 + sway)},-4C50,-4 58,-6 ${f1(66 + sway)},-8C60,-70 50,-150 44,-214Z`, c, -0.3);
      for (const x of [-20, -6, 8, 22]) s += L(`M${x * 0.5},-200C${x * 0.8},-140 ${f1(x * 1.3 + sway * 0.5)},-60 ${f1(x * 1.5 + sway)},-6`, 1.4, shade(c, -0.3));
      if (o.skirtDots) for (let y = -190; y < -30; y += 22) for (let x = -50; x <= 50; x += 20) { const w = 44 + (y + 214) * 0.12; if (Math.abs(x) < w - 6) s += C(x + ((y / 22) % 2) * 10, y, 2, o.skirtDots); }
      s += L(`M${f1(-66 + sway)},-8C-30,0 30,0 ${f1(66 + sway)},-8`, 5, b);
      s += P('M-46,-220C-14,-226 14,-226 46,-220L46,-208C14,-214 -14,-214 -46,-208Z', o.belt || GOLD, { w: 2 });
    }
    return s;
  }
  // crossed legs for the lotus seat (body is lifted so the hips sit at -50)
  function lotusLegs(o, st) {
    const c = o.lower === 'tiger' ? '#e8902a' : o.lower === 'valkala' ? '#9a6a3a' : o.lower === 'sari' ? (o.skirt || '#c8372d') : (o.dhoti || '#f2c230');
    let s = P('M-96,-20C-100,-50 -60,-66 0,-64C60,-66 100,-50 96,-20C70,-4 -70,-4 -96,-20Z', c, { w: 2.6 });
    s += SH('M10,-64C60,-66 100,-50 96,-20C80,-12 50,-8 20,-8C40,-30 34,-50 10,-64Z', c, -0.28);
    if (o.lower === 'tiger') for (const [x, y] of [[-60, -40], [-20, -50], [30, -36], [64, -44]]) s += P(`M${x},${y}c4,6 2,12 10,18c-6,-4 -6,-12 -10,-18Z`, '#1a120c', { ink: false });
    s += P('M-50,-34C-36,-46 -18,-44 -10,-36C-20,-26 -40,-24 -50,-34Z', o.skin, { w: 2 }) + P('M50,-34C36,-46 18,-44 10,-36C20,-26 40,-24 50,-34Z', o.skin, { w: 2 });
    return s;
  }

  function scarf(o, st, sw) {   // the uttariya draped over both arms
    if (!o.scarf) return { back: '', front: '' };
    const c = o.scarf, t = st.t || 0, w1 = Math.sin(t * 1.6 + (o.seed || 0)) * 6, w2 = Math.sin(t * 1.3 + 1 + (o.seed || 0)) * 6;
    const back = P(`M${-sw},-322C${-sw - 40},-300 ${-sw - 50},-240 ${f1(-sw - 40 + w1)},-150C${f1(-sw - 26 + w1)},-160 ${-sw - 24},-230 ${-sw + 2},-292Z`, c, { w: 2.2 }) +
      P(`M${sw},-322C${sw + 40},-300 ${sw + 50},-240 ${f1(sw + 40 + w2)},-150C${f1(sw + 26 + w2)},-160 ${sw + 24},-230 ${sw - 2},-292Z`, c, { w: 2.2 });
    const front = P(`M${-sw + 6},-330C-20,-300 20,-300 ${sw - 6},-330C${sw - 4},-318 ${sw - 10},-312 ${sw - 14},-310C20,-290 -20,-290 ${-sw + 14},-310C${-sw + 10},-312 ${-sw + 4},-318 ${-sw + 6},-330Z`, c, { w: 2 });
    return { back, front };
  }
  function snake(o, st) {   // Vasuki coiled around Shiva's neck, hood over the right shoulder
    const t = st.t || 0, w = Math.sin(t * 2.2) * 2;
    const c = '#3f8a6a', c2 = '#e9d98a';
    let s = P('M-34,-332C-30,-310 30,-310 34,-332C36,-322 34,-314 30,-308C10,-296 -10,-296 -30,-308C-34,-314 -36,-322 -34,-332Z', c, { w: 2.2 });
    s += L('M-28,-314C-10,-302 10,-302 28,-314', 1.4, c2);
    s += P(`M30,-320C40,-332 44,-350 ${f1(42 + w)},-368C${f1(52 + w)},-376 ${f1(60 + w)},-372 ${f1(58 + w)},-360C${f1(56 + w)},-348 46,-340 38,-312Z`, c, { w: 2.2 });
    s += P(`M${f1(36 + w)},-372C${f1(36 + w)},-388 ${f1(64 + w)},-388 ${f1(64 + w)},-372C${f1(60 + w)},-362 ${f1(40 + w)},-362 ${f1(36 + w)},-372Z`, c, { w: 2.2 });
    s += C(44 + w, -376, 1.6, '#f2c230') + C(56 + w, -376, 1.6, '#f2c230') + P(`M${f1(48 + w)},-370L${f1(50 + w)},-362L${f1(52 + w)},-370Z`, '#d21f3c', { ink: false });
    return s;
  }
  function necklaces(o, st) {
    let s = '';
    if (o.blueThroat) s += P('M-9,-346C-5,-338 5,-338 9,-346L9,-338C5,-334 -5,-334 -9,-338Z', '#3a6aa8', { ink: false, op: 0.85 });
    if (o.thread) s += L('M-30,-334C-20,-300 10,-260 30,-218', 2.2, '#fbf6e4');
    if (o.rudraksha) { let d = ''; for (let i = 0; i <= 12; i++) { const a = i / 12; d += C(lerp(-26, 26, a), -330 + Math.sin(a * Math.PI) * 48, 2.6, '#8a3a1a', { ink: true, w: 0.8 }); } s += d; }
    if (o.necklace !== false && !o.ascetic) {
      s += P('M-24,-338C-16,-312 16,-312 24,-338L20,-336C14,-318 -14,-318 -20,-336Z', GOLD, { w: 1.8 });
      s += C(0, -318, o.kaustubha ? 6 : 3.6, o.kaustubha ? RUBY : RUBY, { ink: true, w: 1.4 });
    }
    if (o.garland) {   // vanamala: a long forest garland
      const gc = o.garland === true ? '#3f9a4a' : o.garland;
      s += L('M-34,-332C-46,-250 -38,-160 0,-130C38,-160 46,-250 34,-332', 6, gc);
      for (let i = 0; i <= 10; i++) { const a = i / 10, ang = a * Math.PI; s += C(lerp(-40, 40, a) * Math.sin(ang * 0.5 + 0.2) * 0.9 + (a < 0.5 ? -4 : 4), -332 + Math.sin(ang) * 200 - 0, 3.4, i % 2 ? '#e8505a' : '#f6d24a', { ink: true, w: 0.8 }); }
    }
    if (o.skulls) for (let i = 0; i <= 6; i++) { const a = i / 6; s += P(`M${f1(lerp(-30, 30, a) - 5)},${f1(-320 + Math.sin(a * Math.PI) * 60)}c0,-8 10,-8 10,0l-2,4h-6Z`, '#ece4cc', { w: 1.2 }); }
    return s;
  }
  function hand(H, angle, type, skin, side) {
    // angle: direction of the forearm (radians, svg space); hand drawn as a mitten with the thumb toward the body
    const deg = angle * 180 / Math.PI - 90;
    let s = `<g transform="translate(${f1(H[0])} ${f1(H[1])}) rotate(${f1(deg)}) scale(${side} 1)">`;
    if (type === 'open' || type === 'flat') s += P('M-8,-2C-10,8 -9,20 -6,26C-3,28 4,28 7,24C10,16 10,6 8,-2Z', skin, { w: 2 }) + L('M-4,16L-4,26M0,16L0,28M4,16L4,26', 1.2) + P('M-8,2C-14,4 -16,10 -12,12C-10,10 -8,8 -6,8Z', skin, { w: 1.6 });
    else if (type === 'down') s += P('M-8,-2C-10,8 -9,20 -6,26C-3,28 4,28 7,24C10,16 10,6 8,-2Z', skin, { w: 2 }) + L('M-4,16L-4,26M0,16L0,28M4,16L4,26', 1.2);
    else if (type === 'point') s += P('M-8,-2C-10,6 -8,12 -4,14L-2,30C0,32 2,32 3,30L4,14C8,12 10,6 8,-2Z', skin, { w: 2 });
    else if (type === 'cup') s += P('M-10,0C-12,10 -6,18 0,18C6,18 12,10 10,0Z', skin, { w: 2 });
    else if (type === 'namaste') s += P('M-6,-2C-8,10 -4,24 2,30C4,22 4,8 6,-2Z', skin, { w: 2 });
    else s += P('M-8,-2C-11,6 -10,14 -4,16C2,18 9,14 9,6L8,-2Z', skin, { w: 2 });   // fist / rest
    return s + '</g>';
  }

  // ------------------------------------------------------------- FIGURE ------
  function poseOf(name) { return POSES[name] || POSES.rest; }
  function mixArm(a, b, m) {
    if (!b || m == null || m >= 1) return b || a;
    return { t: [lerp(a.t[0], b.t[0], m), lerp(a.t[1], b.t[1], m)], hand: m < 0.5 ? a.hand : b.hand, bend: m < 0.5 ? a.bend : b.bend };
  }
  function arm(o, st, side, spec, idx) {
    const shY = -326 + (idx ? -4 : 0), big = o.build === 'large' ? 1.18 : o.female ? 0.86 : o.build === 'child' ? 0.8 : 1;
    const S = [side * (o.female ? 34 : 44) * big + side * idx * 4, shY + idx * 2];
    const l1 = (o.female ? 70 : 78) * (o.build === 'child' ? 0.85 : 1), l2 = (o.female ? 64 : 70) * (o.build === 'child' ? 0.85 : 1);
    const T = [side * spec.t[0], spec.t[1]];
    const { E, H } = ik(S, T, l1, l2, side, spec.bend);
    const r1 = (o.female ? 8.5 : 11) * big, r2 = (o.female ? 6.5 : 8.5) * big;
    const skin = o.skin;
    let s = armShape(S, E, H, r1, r2 + 0.5, r2 - 1.5, skin);
    // ornaments: armband, bangles
    const mid = [lerp(S[0], E[0], 0.35), lerp(S[1], E[1], 0.35)];
    const ang = Math.atan2(E[1] - S[1], E[0] - S[0]);
    s += `<g transform="translate(${f1(mid[0])} ${f1(mid[1])}) rotate(${f1(ang * 180 / Math.PI + 90)})">${o.ascetic ? P('M-12,-2L12,-2L12,3L-12,3Z', '#8a3a1a', { w: 1.2 }) : P('M-12,-3L12,-3L12,3L-12,3Z', GOLD, { w: 1.4 }) + C(0, 0, 2.4, RUBY)}</g>`;
    const ang2 = Math.atan2(H[1] - E[1], H[0] - E[0]);
    const wr = [lerp(E[0], H[0], 0.86), lerp(E[1], H[1], 0.86)];
    s += `<g transform="translate(${f1(wr[0])} ${f1(wr[1])}) rotate(${f1(ang2 * 180 / Math.PI + 90)})">${P('M-9,-2.4L9,-2.4L9,2.4L-9,2.4Z', o.ascetic ? '#8a3a1a' : (o.female ? '#d21f3c' : GOLD), { w: 1.2 })}</g>`;
    return { svg: s, H, ang: ang2, S, E };
  }

  function figure(o, st) {
    st = st || {};
    const t = st.t || 0;
    const F = o.female;
    const turn = st.turn != null ? st.turn : (o.front ? 0 : 0.28);
    const seat = st.seat;
    const lift = seat === 'lotus' ? 160 : seat === 'kneel' ? 90 : 0;
    const big = o.build === 'large' ? 1.18 : o.build === 'child' ? 0.8 : 1;
    let back = '', mid = '', front = '';
    // pose: primary arms + extra pairs
    let pz = poseOf(st.pose || o.pose || 'rest');
    if (st.pose2) { const b = poseOf(st.pose2); pz = { R: mixArm(pz.R, b.R, st.poseMix), L: mixArm(pz.L, b.L, st.poseMix) }; }
    const arms = o.arms || 2;
    const items = o.items || {};      // items by arm slot: R0, L0, R1, L1 ...
    const extra = [];
    const upPoses = o.upPoses || ['up1', 'up2', 'up3', 'up4'];
    for (let i = 1; i < arms / 2; i++) extra.push(POSES[upPoses[i - 1]] || POSES.up1);
    const { sw, d: torsoD } = torsoPath(o);
    const sc = scarf(o, st, sw);
    // halo
    let halo = '';
    if (o.halo) {
      const hc = o.halo === true ? '#ffe9a0' : o.halo;
      halo += `<circle cx="0" cy="-384" r="${f1(70 * big)}" fill="url(#cbGlow)" opacity="0.9"/>`;
      halo += `<circle cx="0" cy="-384" r="${f1(46 * big)}" fill="${hc}" opacity="0.85" stroke="${INK}" stroke-width="2.4"/>`;
      for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 + t * 0.2; halo += L(`M${pt(Math.cos(a) * 50 * big, -384 + Math.sin(a) * 50 * big)}L${pt(Math.cos(a) * (58 + (i % 2) * 8) * big, -384 + Math.sin(a) * (58 + (i % 2) * 8) * big)}`, 2, GOLD_D, 0.8); }
    }
    back += halo;
    back += `<g transform="translate(0 -384)">${hairBack(o, st)}</g>`;
    back += sc.back;
    // extra arms sit behind the torso
    extra.forEach((pp, i) => {
      for (const side of [1, -1]) {
        const spec = side < 0 ? pp.R : pp.L, a = arm(o, st, side, spec, i + 1);
        back += a.svg;
        const it = items[(side < 0 ? 'R' : 'L') + (i + 1)];
        if (it && ITEMS[it]) back += `<g transform="translate(${f1(a.H[0])} ${f1(a.H[1])}) scale(${side} 1) rotate(${(spec.itemRot || 0)})">${ITEMS[it](st)}</g>`;
        back += hand(a.H, a.ang, spec.hand === 'open' ? 'open' : 'fist', o.skin, side);
      }
    });
    // body
    if (seat === 'lotus') mid += lotusLegs(o, st);
    else if (seat !== 'kneel') mid += lowerBody(o, st);
    else {
      // kneeling: hips lifted to -124, knees folded under on the ground
      mid += P('M-58,-6C-66,4 -20,6 -10,2L-12,-12Z', o.skin, { w: 2.2 }) + P('M58,-6C66,4 20,6 10,2L12,-12Z', o.skin, { w: 2.2 });
      mid += P('M-46,-126C-56,-80 -58,-30 -54,-4L54,-4C58,-30 56,-80 46,-126Z', o.dhoti || o.skirt || '#c8372d', { w: 2.6 });
    }
    let up = '';
    // neck
    up += limb([0, -356], [0, -334], F ? 8 : 10.5, F ? 9 : 12, o.skin, { flat: true }).out;
    up += SH(`M-10,-346C-4,-338 4,-338 10,-346L10,-336C4,-332 -4,-332 -10,-336Z`, o.skin, -0.3);
    // torso
    const tcol = o.skin;
    up += P(torsoD, tcol, { w: 2.8 });
    up += SH(`M8,-300C${f1(sw - 4)},-296 ${f1(sw + 2)},-322 ${f1(sw - 6)},-336L${f1(sw + 2)},-322C${f1(sw - 4)},-296 34,-262 33,-244L39,-208C20,-204 10,-210 12,-240C16,-260 12,-280 8,-300Z`, tcol, -0.26);
    if (!F) {
      up += L(`M-30,-300C-18,-292 -6,-292 -2,-298M30,-300C18,-292 6,-292 2,-298`, 1.8, shade(tcol, -0.4));
      if (o.build !== 'child' && !o.belly) up += L('M-8,-272C-6,-268 6,-268 8,-272M-8,-256C-6,-252 6,-252 8,-256', 1.3, shade(tcol, -0.35), 0.8);
      if (o.belly) up += P('M-30,-262C-36,-236 -26,-210 0,-208C26,-210 36,-236 30,-262Z', tcol, { w: 2 });
      up += C(0, -236, 1.8, shade(tcol, -0.4));
      up += HI('M-40,-326C-46,-312 -44,-300 -38,-290C-40,-304 -38,-316 -34,-326Z', 0.4);
    }
    if (F) {   // choli and the pallu across the body
      const ch = o.choli || '#2e8a57';
      up += P('M-36,-322C-30,-286 30,-286 36,-322C30,-332 -30,-332 -36,-322Z', ch, { w: 2.2 });
      up += P('M-38,-284C-20,-290 20,-290 38,-284L36,-278C20,-282 -20,-282 -36,-278Z', ch, { w: 1.6 });
      if (o.pallu !== false) {
        const pc = o.pallu || o.skirt || '#c8372d', w = Math.sin(t * 1.5) * 3;
        up += P(`M-38,-332C-20,-320 10,-280 34,-214L44,-214C36,-262 14,-306 -18,-338Z`, pc, { w: 2.2 });
        up += P(`M-36,-334C-44,-300 -48,-250 ${f1(-46 + w)},-196L${f1(-36 + w)},-198C-36,-250 -32,-300 -24,-334Z`, pc, { w: 2 });
        up += L('M-38,-332C-20,-320 10,-280 34,-214', 3, o.border || GOLD);
      }
    }
    up += necklaces(o, st);
    if (o.snake) up += snake(o, st);
    up += sc.front;
    mid += `<g transform="translate(0 ${lift})">${up}</g>`;
    // head
    let headS = '';
    const hscale = o.build === 'child' ? 1.18 : 1;
    const nod = st.nod || 0;
    if (o.headKind) headS += animalHead(o.headKind, o, st);
    else {
      if (o.heads >= 3) {   // Brahma: a frontal centre face between two profiles; the fifth face rises above
        headS += `<g transform="translate(-30 4) scale(-0.86 0.86)">${profileHead(o, st)}</g><g transform="translate(30 4) scale(0.86)">${profileHead(o, st)}</g>`;
        if (o.heads >= 5) headS += `<g transform="translate(0 -70) scale(0.7)">${face(o, Object.assign({}, st, { open: 0 }), 0)}${hairFront(Object.assign({}, o, { crown: 'brahma' }), st, 0)}</g>`;
      }
      headS += face(o, st, turn) + hairFront(o, st, turn);
    }
    mid += `<g transform="translate(0 ${f1(-384 + lift + nod)}) scale(${hscale})">${headS}</g>`;
    // primary arms: in front of the body
    for (const side of [-1, 1]) {
      const spec = side < 0 ? pz.R : pz.L, a = arm(o, st, side, spec, 0);
      const slot = (side < 0 ? 'R' : 'L') + '0';
      let it = items[slot];
      if (side < 0 && st.item !== undefined) it = st.item;
      if (side > 0 && st.itemL !== undefined) it = st.itemL;
      if (spec.hand === 'namaste' || spec.hand === 'flat') it = null;   // joined or covering hands hold nothing
      let itemS = '';
      if (it && ITEMS[it]) {
        let rot = spec.itemRot || 0;
        if (it === 'bow' && (st.pose === 'bow')) rot = 0;
        if (it === 'veena') rot = 32;   // neck leans outward, clear of the face
        itemS = `<g transform="translate(${f1(a.H[0])} ${f1(a.H[1] + lift)}) scale(${side} 1) rotate(${rot})">${ITEMS[it](st)}</g>`;
      }
      const handS = hand(a.H, spec.hand === 'namaste' ? -Math.PI / 2 : a.ang, spec.hand, o.skin, side);   // joined palms point up
      front += `<g transform="translate(0 ${lift})">${a.svg}</g>` + (it === 'veena' || it === 'varmala' ? itemS + `<g transform="translate(0 ${lift})">${handS}</g>` : `<g transform="translate(0 ${lift})">${handS}</g>` + itemS);
    }
    return `<g transform="translate(0 ${-lift * 0}) rotate(${f1(st.lean || 0)})">${back}${mid}${front}</g>`;
  }

  // ------------------------------------------------------------ CREATURES ----
  function creature(kind, st, p) {
    const t = (st && st.t) || 0;
    let s = '';
    if (kind === 'bull') {   // Nandi: white bull, side view facing +x, a hump, a bell and garland
      const c = '#f4f1ea';
      const legs = [[-60, 0], [-36, 0], [44, 0], [66, 0]];
      for (const [x] of legs) s += limb([x, -110], [x + 2, -6], 12, 8, c).out + P(`M${x - 8},-8L${x + 12},-8L${x + 10},2L${x - 8},2Z`, '#3a2a20', { w: 1.6 });
      s += P('M-96,-150C-104,-196 -60,-212 -10,-206C40,-218 78,-206 92,-168C100,-140 86,-110 60,-104C20,-96 -40,-96 -70,-104C-90,-112 -94,-130 -96,-150Z', c, { w: 2.8 });
      s += SH('M-90,-130C-60,-110 20,-104 60,-104C86,-110 100,-140 92,-168C80,-130 20,-118 -90,-130Z', c, -0.2);
      s += P('M-20,-206C-14,-236 22,-238 30,-210Z', c, { w: 2.4 });   // hump
      s += P('M78,-190C100,-206 124,-200 134,-176C140,-160 132,-142 118,-140C104,-140 92,-150 86,-160Z', c, { w: 2.6 });   // head
      s += P('M96,-200C92,-222 100,-232 108,-234C104,-222 104,-212 106,-202ZM112,-198C116,-220 128,-226 136,-224C128,-216 122,-206 118,-196Z', '#c9b48a', { w: 1.8 });
      s += P('M124,-150C130,-148 136,-150 138,-156C134,-160 128,-160 124,-156Z', '#d8a0a0', { w: 1.2 }) + C(112, -178, 2.6, INK);
      s += L('M80,-160C70,-140 70,-126 76,-112', 5, '#e8505a') + C(76, -106, 6, GOLD, { ink: true, w: 1.6 });
      s += P(`M-96,-160C-112,-150 ${f1(-118 + Math.sin(t * 2) * 4)},-120 ${f1(-112 + Math.sin(t * 2) * 4)},-96`, 'none', { w: 3 });
      s += P('M-40,-200C-20,-206 20,-206 40,-198L40,-150C20,-156 -20,-156 -40,-150Z', '#c8372d', { w: 2 });   // saddle cloth
      s += L('M-40,-160C-20,-166 20,-166 40,-158', 2, GOLD);
      return s;
    }
    if (kind === 'swan') {   // Brahma's hamsa
      const fl = Math.sin(t * 3) * 10;
      s += P('M-70,-60C-60,-20 40,-14 70,-40C80,-50 76,-70 60,-72C30,-74 -40,-80 -70,-60Z', '#fbfaf4', { w: 2.6 });
      s += P(`M-30,-70C-50,${f1(-120 - fl)} -10,${f1(-150 - fl)} 30,${f1(-120 - fl)}C10,-96 0,-80 -10,-66Z`, '#f0eee6', { w: 2.4 });
      s += P('M60,-70C70,-110 60,-140 76,-160C90,-176 112,-170 112,-156C104,-160 94,-158 88,-148C80,-130 86,-100 72,-62Z', '#fbfaf4', { w: 2.6 });
      s += P('M108,-162L132,-156L110,-150Z', '#f29a1e', { w: 1.6 }) + C(98, -160, 2.2, INK);
      s += P('M-70,-60L-96,-74L-84,-56Z', '#f0eee6', { w: 2 });
      return s;
    }
    if (kind === 'boar') {   // Vishnu's Varaha form diving
      const c = '#6a5a8a';
      s += P('M-90,-60C-96,-110 -40,-130 20,-124C60,-120 96,-100 110,-70C116,-50 104,-30 80,-28C20,-20 -60,-20 -86,-36Z', c, { w: 2.8 });
      s += SH('M-86,-40C-40,-26 40,-24 80,-30C104,-30 116,-50 110,-70C90,-46 20,-36 -86,-40Z', c, -0.3);
      s += P('M100,-80C120,-80 140,-70 144,-58C140,-50 124,-48 108,-52Z', '#8a7aaa', { w: 2.2 });
      s += P('M112,-60C120,-74 130,-84 140,-90C134,-78 128,-66 120,-56Z', '#fbf6e8', { w: 1.6 });
      s += C(96, -88, 2.6, '#f2c230', { ink: true, w: 1 });
      for (let x = -70; x < 60; x += 14) s += L(`M${x},-118L${x + 6},-132`, 2, INK);
      s += P('M-30,-130L-10,-150L10,-130Z', GOLD, { w: 2 });   // a small crown: this is Vishnu
      return s;
    }
    if (kind === 'parrot') {   // Kama's mount
      s += P('M-30,-30C-30,-70 0,-90 24,-80C40,-70 40,-40 24,-20C10,-6 -20,-6 -30,-30Z', '#3fb04a', { w: 2.4 });
      s += P('M24,-80C34,-84 42,-76 40,-66C34,-70 28,-70 24,-72Z', '#e8381e', { w: 1.6 }) + C(18, -70, 2, INK);
      s += P('M-24,-20L-60,10L-50,-14Z', '#2a8a3a', { w: 1.8 });
      return s;
    }
    if (kind === 'deer') {
      s += P('M-60,-90C-60,-120 40,-124 60,-96C64,-80 50,-70 30,-70L-40,-70C-56,-70 -60,-80 -60,-90Z', '#c9873c', { w: 2.4 });
      for (const x of [-46, -30, 30, 46]) s += L(`M${x},-74L${x},0`, 4);
      s += P('M50,-100C60,-130 80,-140 92,-130C96,-120 86,-110 70,-100Z', '#c9873c', { w: 2.2 });
      return s;
    }
    return s;
  }

  // ---------------------------------------------------------------- CAST -----
  const SHIVA = '#a8cde3', VISHNU = '#3557b0', BRAHMA = '#eaa45a', FAIR = '#f2c9a0', WARM = '#e3ad7c', TAN = '#c98a5c', DARK = '#7a4e34';
  const CAST = {
    shiva:     { name: { en: 'Shiva', hi: 'शिव' }, skin: SHIVA, crown: 'jata', hair: 'jata', hairCol: '#2a1a14', ganga: true, thirdEye: true, tilak: 'tripundra', snake: true, rudraksha: true, blueThroat: true, necklace: false, lower: 'tiger', items: { L0: 'trishul' }, pose: 'trident', halo: '#d8f0ff', ascetic: true, seed: 1, iris: '#1a1a3a' },
    shivafair: { name: { en: 'Shiva', hi: 'शिव' }, skin: '#d8e8f2', crown: 'jata', hair: 'jata', hairCol: '#2a1a14', ganga: true, thirdEye: true, tilak: 'tripundra', snake: true, garland: '#f6d24a', necklace: true, lower: 'pitambar', dhoti: '#fbf3df', border: GOLD, scarf: '#f2b632', items: { L0: 'trishul' }, pose: 'trident', halo: '#fff3c8', seed: 1 },
    bhairava:  { name: { en: 'Bhairava', hi: 'भैरव' }, skin: '#3a3a5a', ink: INK, crown: 'wild', hair: 'wild', hairCol: '#c8281e', thirdEye: true, fangs: true, mustache: true, beardCol: '#c8281e', build: 'large', lower: 'tiger', snake: true, skulls: false, items: { R0: 'sword' }, pose: 'sword', eyeWhite: '#ffe36a', iris: '#c00', seed: 2 },
    vishnu:    { name: { en: 'Vishnu', hi: 'विष्णु' }, skin: VISHNU, crown: 'kirit', hair: 'kirit', arms: 4, items: { R1: 'chakra', L1: 'shankha', R0: 'padma', L0: 'gada' }, upPoses: ['up1'], lower: 'pitambar', dhoti: '#f6c21e', border: '#c8372d', garland: true, kaustubha: true, thread: true, scarf: '#e8508a', tilak: 'vaishnav', halo: '#fff0a8', pose: 'vishnu', seed: 3 },
    brahma:    { name: { en: 'Brahma', hi: 'ब्रह्मा' }, skin: BRAHMA, crown: 'brahma', hair: 'rishi', hairCol: '#ece6d6', heads: 4, beard: 'long', beardCol: '#f2eee4', mustache: true, arms: 4, items: { R1: 'sruva', L1: 'book', R0: 'mala', L0: 'kamandalu' }, upPoses: ['up1'], lower: 'dhoti', dhoti: '#fbf3df', border: '#c8372d', thread: true, scarf: '#d84a2a', halo: '#ffe9a0', pose: 'brahma', front: true, seed: 4 },
    brahma5:   { name: { en: 'Brahma', hi: 'ब्रह्मा' }, skin: BRAHMA, crown: 'brahma', hair: 'rishi', hairCol: '#ece6d6', heads: 5, beard: 'long', beardCol: '#f2eee4', mustache: true, arms: 4, items: { R1: 'sruva', L1: 'book', R0: 'mala', L0: 'kamandalu' }, upPoses: ['up1'], lower: 'dhoti', dhoti: '#fbf3df', border: '#c8372d', thread: true, scarf: '#d84a2a', halo: '#ffe9a0', pose: 'brahma', front: true, seed: 4 },
    narad:     { name: { en: 'Narada', hi: 'नारद' }, skin: FAIR, crown: 'topknot', flower: true, hairCol: '#2a1a12', lower: 'dhoti', dhoti: '#fbf3df', border: '#f29a1e', scarf: '#f29a1e', thread: true, tilak: 'vaishnav', necklace: false, rudraksha: false, items: { L0: 'veena' }, pose: 'veena', seed: 5 },
    naradmonkey: { name: { en: 'Narada', hi: 'नारद' }, skin: FAIR, headKind: 'monkey', lower: 'pitambar', dhoti: '#f6c21e', border: '#c8372d', scarf: '#e8508a', thread: true, garland: true, items: { L0: 'veena' }, pose: 'veena', seed: 5 },
    suta:      { name: { en: 'Suta', hi: 'सूत' }, skin: TAN, crown: 'rishi', hair: 'rishi', hairCol: '#4a3a2a', beard: 'short', beardCol: '#3a2a1a', mustache: true, lower: 'dhoti', dhoti: '#fbf3df', border: '#c8822e', thread: true, tilak: 'tripundra', rudraksha: true, necklace: false, ascetic: true, items: { L0: 'book' }, pose: 'mala', seed: 6 },
    rishi:     { name: { en: 'Sage', hi: 'ऋषि' }, skin: TAN, crown: 'rishi', hair: 'rishi', hairCol: '#e6e0d2', beard: 'long', beardCol: '#ece6d8', mustache: true, lower: 'dhoti', dhoti: '#f29a1e', border: '#c8372d', thread: true, tilak: 'tripundra', necklace: false, ascetic: true, rudraksha: true, items: { R0: 'mala' }, pose: 'mala', seed: 7 },
    rishi2:    { name: { en: 'Sage', hi: 'ऋषि' }, skin: '#b8784e', crown: 'rishi', hair: 'rishi', hairCol: '#9a948a', beard: 'long', beardCol: '#a8a298', mustache: true, lower: 'dhoti', dhoti: '#fbf3df', border: '#c8822e', thread: true, tilak: 'tripundra', necklace: false, ascetic: true, items: { R0: 'danda' }, pose: 'hold', seed: 8 },
    ketaki:    { name: { en: 'Ketaki', hi: 'केतकी' }, creature: 'ketaki' },
    indra:     { name: { en: 'Indra', hi: 'इंद्र' }, skin: '#f0c08a', crown: 'mukut', hair: 'kirit', mustache: true, lower: 'pitambar', dhoti: '#f6c21e', border: '#2e5ac4', scarf: '#2e5ac4', items: { R0: 'vajra' }, pose: 'hold', halo: '#fff3c8', seed: 9 },
    kama:      { name: { en: 'Kama', hi: 'कामदेव' }, skin: '#f2c49a', crown: 'mukut', hair: 'flow', crownCol: '#f2b632', lower: 'pitambar', dhoti: '#f27aa8', border: '#f2c230', scarf: '#7ac24a', garland: '#f27aa8', items: { L0: 'bow', R0: 'arrow' }, pose: 'hold', seed: 10 },
    rati:      { name: { en: 'Rati', hi: 'रति' }, skin: '#f4cfa6', female: true, crown: 'devi', hair: 'long', skirt: '#f27aa8', choli: '#f2c230', pallu: '#f59ab8', border: GOLD, noseRing: true, tilak: 'bindi', pose: 'rest', seed: 11 },
    vasanta:   { name: { en: 'Vasanta', hi: 'वसंत' }, skin: '#e8c08a', crown: 'mukut', hair: 'flow', crownCol: '#7ac24a', lower: 'dhoti', dhoti: '#9ad84a', border: '#f27aa8', scarf: '#f6d24a', garland: '#f6d24a', items: { R0: 'flower' }, pose: 'hold', seed: 12 },
    daksha:    { name: { en: 'Daksha', hi: 'दक्ष' }, skin: FAIR, crown: 'mukut', hair: 'kirit', hairCol: '#3a2a1a', beard: 'short', beardCol: '#3a2a1a', mustache: true, lower: 'pitambar', dhoti: '#c8372d', border: GOLD, scarf: '#7a2a7a', garland: '#f2b632', items: { R0: 'sruva' }, pose: 'stand', seed: 13 },
    dakshagoat: { name: { en: 'Daksha', hi: 'दक्ष' }, skin: FAIR, headKind: 'goat', turbanCol: '#c8372d', lower: 'pitambar', dhoti: '#c8372d', border: GOLD, scarf: '#7a2a7a', pose: 'namaste', seed: 13 },
    sati:      { name: { en: 'Sati', hi: 'सती' }, skin: '#f4c8a0', female: true, crown: 'devi', hair: 'long', skirt: '#d21f3c', choli: '#1f8a5a', pallu: '#e8384a', border: GOLD, skirtDots: '#f6d24a', noseRing: true, tilak: 'bindi', pose: 'rest', halo: false, seed: 14 },
    satisita:  { name: { en: 'Sati', hi: 'सती' }, skin: '#f4c8a0', female: true, crown: 'female', hair: 'long', skirt: '#f2b632', choli: '#c8372d', pallu: '#f6d24a', border: '#c8372d', noseRing: true, tilak: 'bindi', pose: 'rest', seed: 14 },
    parvati:   { name: { en: 'Parvati', hi: 'पार्वती' }, skin: '#f0bf92', female: true, crown: 'devi', hair: 'long', skirt: '#1f8a5a', choli: '#d21f3c', pallu: '#2fa86a', border: GOLD, skirtDots: '#f6d24a', noseRing: true, tilak: 'bindi', pose: 'rest', seed: 15 },
    parvatiTapas: { name: { en: 'Parvati', hi: 'पार्वती' }, skin: '#e8b080', female: true, crown: 'tapasvini', hair: 'long', lower: 'valkala', choli: '#8a5a2a', pallu: '#9a6a3a', border: '#5a3a1a', tilak: 'ash', rudraksha: true, ascetic: true, necklace: false, earring: false, pose: 'namaste', seed: 15 },
    parvatiBride: { name: { en: 'Parvati', hi: 'पार्वती' }, skin: '#f0bf92', female: true, crown: 'veil', veil: '#d21f3c', hair: 'long', skirt: '#d21f3c', choli: '#f2b632', pallu: '#e8384a', border: GOLD, skirtDots: '#f6d24a', noseRing: true, tilak: 'bindi', pose: 'garland', items: { R0: 'varmala' }, seed: 15 },
    virabhadra: { name: { en: 'Virabhadra', hi: 'वीरभद्र' }, skin: '#2e2c4a', crown: 'wild', hair: 'wild', hairCol: '#e0401e', moon: true, thirdEye: true, fangs: true, mustache: true, beardCol: '#e0401e', build: 'large', arms: 8, upPoses: ['up1', 'up2', 'up3'], items: { R0: 'trishul', L0: 'sword', R1: 'gada', L1: 'chakra', R2: 'sword', L2: 'noose', R3: 'skullstaff', L3: 'damaru' }, lower: 'tiger', snake: true, skulls: true, necklace: false, eyeWhite: '#ffe36a', iris: '#c00', pose: 'hold', seed: 16 },
    mahakali:  { name: { en: 'Mahakali', hi: 'महाकाली' }, skin: '#2a2a3a', female: true, crown: 'wild', hair: 'wild', hairCol: '#1a1a24', thirdEye: true, fangs: true, arms: 4, upPoses: ['up1'], items: { R0: 'sword', L0: 'noose', R1: 'trishul', L1: 'damaru' }, lower: 'tiger', skirt: '#1a1a24', choli: '#7a1a1a', pallu: false, skulls: true, eyeWhite: '#ffe36a', iris: '#c00', lips: '#c41e2a', seed: 17 },
    nandi:     { name: { en: 'Nandi', hi: 'नंदी' }, creature: 'bull' },
    bull:      { name: { en: 'Bull', hi: 'बैल' }, creature: 'bull' },
    swan:      { name: { en: 'Swan', hi: 'हंस' }, creature: 'swan' },
    boar:      { name: { en: 'Boar', hi: 'वराह' }, creature: 'boar' },
    parrot:    { name: { en: 'Parrot', hi: 'तोता' }, creature: 'parrot' },
    deer:      { name: { en: 'Deer', hi: 'हिरण' }, creature: 'deer' },
    nandigana: { name: { en: 'Nandi', hi: 'नंदी' }, skin: '#d8b48a', crown: 'jata', hair: 'jata', hairCol: '#3a2a1a', moon: false, thirdEye: false, tilak: 'tripundra', mustache: true, build: 'large', lower: 'tiger', rudraksha: true, necklace: false, ascetic: true, items: { R0: 'trishul' }, pose: 'hold', seed: 18 },
    gana:      { name: { en: 'Gana', hi: 'गण' }, skin: '#6a8a4a', crown: 'wild', hair: 'wild', hairCol: '#2a1a12', fangs: true, belly: true, build: 'large', lower: 'loin', dhoti: '#5a2a2a', necklace: false, ascetic: true, eyeWhite: '#ffe36a', items: { R0: 'gada' }, pose: 'hold', seed: 19 },
    gana2:     { name: { en: 'Gana', hi: 'गण' }, skin: '#8a4a6a', crown: 'none', hair: 'wild', hairCol: '#e8a21e', mustache: true, belly: true, lower: 'loin', dhoti: '#2a3a5a', necklace: false, ascetic: true, items: { R0: 'damaru' }, pose: 'raise', seed: 20 },
    gana3:     { name: { en: 'Gana', hi: 'गण' }, skin: '#4a6a9a', crown: 'asura', hairCol: '#1a1a1a', fangs: true, build: 'slim', lower: 'loin', dhoti: '#e8641e', necklace: false, ascetic: true, items: { R0: 'trishul' }, pose: 'hold', seed: 21 },
    yamadoot:  { name: { en: "Yama's messenger", hi: 'यमदूत' }, skin: '#3a3a4a', crown: 'asura', hairCol: '#1a1a1a', crownCol: '#5a1a1a', fangs: true, mustache: true, build: 'large', lower: 'loin', dhoti: '#5a1a1a', necklace: false, items: { R0: 'noose' }, pose: 'hold', eyeWhite: '#ffe36a', iris: '#c00', seed: 22 },
    shivadoot: { name: { en: "Shiva's attendant", hi: 'शिवदूत' }, skin: '#a8cde3', crown: 'jata', hair: 'jata', hairCol: '#2a1a14', moon: true, thirdEye: true, tilak: 'tripundra', lower: 'tiger', rudraksha: true, necklace: false, ascetic: true, items: { R0: 'trishul' }, pose: 'hold', seed: 23 },
    gunanidhi: { name: { en: 'Gunanidhi', hi: 'गुणनिधि' }, skin: WARM, crown: 'shikha', hairCol: '#1a120c', lower: 'dhoti', dhoti: '#fbf3df', border: '#7a6a5a', thread: true, necklace: false, ascetic: true, build: 'slim', pose: 'rest', seed: 24 },
    yajnadatta: { name: { en: 'Yajnadatta', hi: 'यज्ञदत्त' }, skin: TAN, crown: 'shikha', hairCol: '#4a4a4a', beard: 'short', beardCol: '#6a6a6a', mustache: true, lower: 'dhoti', dhoti: '#fbf3df', border: '#c8822e', thread: true, tilak: 'tripundra', necklace: false, ascetic: true, pose: 'stand', seed: 25 },
    mother:    { name: { en: 'Mother', hi: 'माँ' }, skin: TAN, female: true, crown: 'veil', veil: '#e8a21e', hair: 'long', skirt: '#c8822e', choli: '#7a2a2a', pallu: '#e8a21e', border: '#c8372d', tilak: 'bindi', pose: 'rest', seed: 26 },
    gambler:   { name: { en: 'Gambler', hi: 'जुआरी' }, skin: '#b07a50', crown: 'turban', turbanCol: '#5a3a7a', mustache: true, lower: 'dhoti', dhoti: '#8a7a5a', border: '#3a2a2a', necklace: false, pose: 'hips', seed: 27 },
    guard:     { name: { en: 'Guard', hi: 'पहरेदार' }, skin: '#b07a50', crown: 'turban', turbanCol: '#c8372d', mustache: true, lower: 'dhoti', dhoti: '#5a5a3a', border: '#c8372d', necklace: false, items: { R0: 'danda' }, pose: 'hold', seed: 28 },
    devotee:   { name: { en: 'Devotee', hi: 'भक्त' }, skin: '#c48a5a', crown: 'shikha', hairCol: '#1a120c', lower: 'dhoti', dhoti: '#f29a1e', border: '#c8372d', thread: true, tilak: 'tripundra', rudraksha: true, necklace: false, ascetic: true, items: { R0: 'lamp' }, pose: 'lamp', seed: 29 },
    dama:      { name: { en: 'King Dama', hi: 'राजा दम' }, skin: WARM, crown: 'mukut', hair: 'kirit', mustache: true, lower: 'pitambar', dhoti: '#c8372d', border: GOLD, scarf: '#f2b632', tilak: 'tripundra', rudraksha: true, items: { R0: 'lamp' }, pose: 'lamp', seed: 30 },
    kubera:    { name: { en: 'Kubera', hi: 'कुबेर' }, skin: '#e8b87a', crown: 'mukut', hair: 'kirit', mustache: true, belly: true, lower: 'pitambar', dhoti: '#f2b632', border: '#2e8a57', scarf: '#2e8a57', garland: '#f6d24a', items: { R0: 'gada', L0: 'potgold' }, pose: 'hold', seed: 31 },
    kuberaTapas: { name: { en: 'The ascetic', hi: 'तपस्वी' }, skin: '#c89a6a', crown: 'rishi', hair: 'rishi', hairCol: '#3a2a1a', beard: 'short', beardCol: '#3a2a1a', lower: 'valkala', tilak: 'tripundra', rudraksha: true, necklace: false, ascetic: true, build: 'slim', pose: 'namaste', seed: 31 },
    yama:      { name: { en: 'Yama', hi: 'यम' }, skin: '#3a5a4a', crown: 'mukut', hair: 'kirit', crownCol: '#9a7a2a', mustache: true, lower: 'pitambar', dhoti: '#5a1a2a', border: GOLD, items: { R0: 'noose', L0: 'gada' }, pose: 'hold', seed: 32 },
    chanchula: { name: { en: 'Chanchula', hi: 'चंचुला' }, skin: '#ecb88e', female: true, crown: 'female', hair: 'long', skirt: '#7a2a7a', choli: '#e8641e', pallu: '#a83a8a', border: GOLD, noseRing: true, tilak: 'bindi', pose: 'rest', seed: 33 },
    chanchulaTapas: { name: { en: 'Chanchula', hi: 'चंचुला' }, skin: '#ecb88e', female: true, crown: 'tapasvini', hair: 'long', lower: 'valkala', choli: '#8a5a2a', pallu: '#9a6a3a', border: '#5a3a1a', tilak: 'ash', rudraksha: true, ascetic: true, necklace: false, earring: false, pose: 'namaste', seed: 33 },
    chanchulaDivine: { name: { en: 'Chanchula', hi: 'चंचुला' }, skin: '#f8e0c8', female: true, crown: 'devi', hair: 'long', skirt: '#fbf6ec', choli: '#a8d8f0', pallu: '#e8f4fa', border: GOLD, tilak: 'bindi', halo: '#e8f6ff', pose: 'namaste', seed: 33 },
    binduga:   { name: { en: 'Binduga', hi: 'बिंदुग' }, skin: '#b07a50', crown: 'shikha', hairCol: '#1a120c', mustache: true, lower: 'dhoti', dhoti: '#6a5a3a', border: '#2a1a1a', necklace: false, pose: 'hips', seed: 34 },
    pishacha:  { name: { en: 'The pishacha', hi: 'पिशाच' }, skin: '#5a6a5a', crown: 'wild', hair: 'wild', hairCol: '#2a2a1a', fangs: true, build: 'large', lower: 'loin', dhoti: '#3a2a1a', necklace: false, eyeWhite: '#e8f06a', iris: '#5a0a0a', pose: 'fear', seed: 35 },
    bindugaDivine: { name: { en: 'Binduga', hi: 'बिंदुग' }, skin: '#f0dcc4', crown: 'jata', hair: 'jata', hairCol: '#2a1a14', moon: true, tilak: 'tripundra', lower: 'pitambar', dhoti: '#fbf6ec', border: GOLD, scarf: '#a8d8f0', halo: '#e8f6ff', pose: 'namaste', seed: 34 },
    kathavachak: { name: { en: 'The storyteller', hi: 'कथावाचक' }, skin: TAN, crown: 'shikha', hairCol: '#2a2a2a', beard: 'short', beardCol: '#5a5a5a', mustache: true, lower: 'dhoti', dhoti: '#f29a1e', border: '#c8372d', thread: true, tilak: 'tripundra', rudraksha: true, necklace: false, ascetic: true, items: { L0: 'book' }, pose: 'bless', seed: 36 },
    tumburu:   { name: { en: 'Tumburu', hi: 'तुम्बुरु' }, skin: '#e8b87a', crown: 'mukut', hair: 'flow', lower: 'pitambar', dhoti: '#2e8ac4', border: GOLD, scarf: '#f2b632', items: { L0: 'veena' }, pose: 'veena', seed: 37 },
    shilanidhi: { name: { en: 'King Shilanidhi', hi: 'राजा शीलनिधि' }, skin: WARM, crown: 'mukut', hair: 'kirit', mustache: true, beard: 'short', lower: 'pitambar', dhoti: '#c8372d', border: GOLD, scarf: '#2e5ac4', pose: 'stand', seed: 38 },
    shrimati:  { name: { en: 'Shrimati', hi: 'श्रीमती' }, skin: '#f4cfa6', female: true, crown: 'devi', hair: 'long', skirt: '#2e5ac4', choli: '#f2b632', pallu: '#4a7ae0', border: GOLD, skirtDots: '#f6d24a', noseRing: true, tilak: 'bindi', items: { R0: 'varmala' }, pose: 'garland', seed: 39 },
    prince:    { name: { en: 'Prince', hi: 'राजकुमार' }, skin: '#e0a878', crown: 'mukut', hair: 'kirit', mustache: true, lower: 'pitambar', dhoti: '#7a2a7a', border: GOLD, scarf: '#e8641e', pose: 'stand', seed: 40 },
    vishnuking: { name: { en: 'The king', hi: 'राजा' }, skin: VISHNU, crown: 'kirit', hair: 'kirit', lower: 'pitambar', dhoti: '#f6c21e', border: '#c8372d', garland: true, scarf: '#e8508a', pose: 'stand', seed: 3 },
    ganadisguise: { name: { en: 'Gana', hi: 'गण' }, skin: TAN, crown: 'shikha', hairCol: '#1a120c', lower: 'dhoti', dhoti: '#fbf3df', border: '#c8822e', thread: true, tilak: 'tripundra', necklace: false, ascetic: true, pose: 'rest', seed: 41 },
    rama:      { name: { en: 'Rama', hi: 'राम' }, skin: '#3f7a9a', crown: 'tapasvini', hair: 'kirit', hairCol: '#1a120c', lower: 'valkala', ascetic: true, necklace: false, items: { L0: 'bow' }, pose: 'hold', seed: 42, front: false },
    lakshmana: { name: { en: 'Lakshmana', hi: 'लक्ष्मण' }, skin: '#e8c08a', crown: 'tapasvini', hair: 'kirit', hairCol: '#1a120c', lower: 'valkala', ascetic: true, necklace: false, items: { L0: 'bow' }, pose: 'hold', seed: 43 },
    dadhichi:  { name: { en: 'Dadhichi', hi: 'दधीचि' }, skin: '#c48a5a', crown: 'rishi', hair: 'rishi', hairCol: '#ece6d8', beard: 'long', beardCol: '#f2eee4', mustache: true, lower: 'dhoti', dhoti: '#e8641e', border: '#8a2a1a', thread: true, tilak: 'tripundra', rudraksha: true, necklace: false, ascetic: true, items: { R0: 'kamandalu' }, pose: 'point', seed: 44 },
    bhrigu:    { name: { en: 'Bhrigu', hi: 'भृगु' }, skin: TAN, crown: 'rishi', hair: 'rishi', hairCol: '#7a7a7a', beard: 'long', beardCol: '#9a9a9a', mustache: true, lower: 'dhoti', dhoti: '#fbf3df', border: '#c8372d', thread: true, tilak: 'vaishnav', necklace: false, ascetic: true, items: { R0: 'sruva' }, pose: 'hold', seed: 45 },
    asikni:    { name: { en: 'Asikni', hi: 'असिक्नी' }, skin: FAIR, female: true, crown: 'veil', veil: '#7a2a7a', hair: 'long', skirt: '#c8372d', choli: '#1f8a5a', pallu: '#a83a8a', border: GOLD, noseRing: true, tilak: 'bindi', pose: 'grief', seed: 46 },
    himavan:   { name: { en: 'Himavan', hi: 'हिमवान' }, skin: '#f0dcc8', crown: 'mukut', hair: 'kirit', hairCol: '#e8eef4', crownCol: '#cfe0f0', beard: 'long', beardCol: '#f4f6f8', mustache: true, lower: 'pitambar', dhoti: '#e8f0fa', border: '#3d6fc4', scarf: '#3d6fc4', garland: '#9ad0f0', pose: 'stand', seed: 47 },
    mena:      { name: { en: 'Mena', hi: 'मेना' }, skin: '#f2d2b2', female: true, crown: 'devi', hair: 'long', skirt: '#3d6fc4', choli: '#f2b632', pallu: '#6a9ae0', border: GOLD, noseRing: true, tilak: 'bindi', pose: 'rest', seed: 48 },
    taraka:    { name: { en: 'Taraka', hi: 'तारकासुर' }, skin: '#2e4a4a', crown: 'asura', hairCol: '#0e1a1a', crownCol: '#1a1a24', fangs: true, mustache: true, beard: 'short', beardCol: '#0e1a1a', build: 'large', arms: 4, upPoses: ['up1'], items: { R0: 'sword', L0: 'gada', R1: 'trishul', L1: 'noose' }, lower: 'pitambar', dhoti: '#5a1a5a', border: '#2ad0a0', scarf: '#2a8a6a', eyeWhite: '#ffe36a', iris: '#8a0f1a', pose: 'hips', seed: 49 },
    asura:     { name: { en: 'Asura', hi: 'असुर' }, skin: '#4a3a5a', crown: 'asura', hairCol: '#1a1a1a', fangs: true, mustache: true, build: 'large', lower: 'dhoti', dhoti: '#2a4a2a', border: '#f2c230', necklace: false, items: { R0: 'sword' }, pose: 'sword', eyeWhite: '#ffe36a', iris: '#8a0f1a', seed: 50 },
    deva:      { name: { en: 'A deva', hi: 'देवता' }, skin: '#f0c08a', crown: 'mukut', hair: 'flow', lower: 'pitambar', dhoti: '#f6c21e', border: '#c8372d', scarf: '#2fa86a', pose: 'namaste', halo: '#fff3c8', seed: 51 },
    agni:      { name: { en: 'Agni', hi: 'अग्नि' }, skin: '#e2582a', crown: 'wild', hair: 'wild', hairCol: '#f2a516', mustache: true, beardCol: '#f6d24a', lower: 'pitambar', dhoti: '#c8372d', border: '#f6d24a', scarf: '#f29a1e', items: { R0: 'sruva' }, pose: 'hold', seed: 52 },
    brihaspati: { name: { en: 'Brihaspati', hi: 'बृहस्पति' }, skin: '#f2c070', crown: 'mukut', hair: 'rishi', hairCol: '#ece6d8', beard: 'long', beardCol: '#f2eee4', lower: 'pitambar', dhoti: '#f6c21e', border: '#c8372d', thread: true, items: { R0: 'book' }, pose: 'bless', seed: 53 },
    vasishtha: { name: { en: 'Vasishtha', hi: 'वसिष्ठ' }, skin: TAN, crown: 'rishi', hair: 'rishi', hairCol: '#ece6d8', beard: 'long', beardCol: '#f2eee4', mustache: true, lower: 'dhoti', dhoti: '#f29a1e', border: '#c8372d', thread: true, tilak: 'tripundra', necklace: false, ascetic: true, items: { R0: 'danda' }, pose: 'hold', seed: 54 },
    arundhati: { name: { en: 'Arundhati', hi: 'अरुंधती' }, skin: '#e8b88a', female: true, crown: 'veil', veil: '#f29a1e', hair: 'long', skirt: '#f29a1e', choli: '#c8372d', pallu: '#f6b25a', border: '#c8372d', tilak: 'bindi', pose: 'namaste', seed: 55 },
    jatila:    { name: { en: 'The young ascetic', hi: 'जटिल ब्रह्मचारी' }, skin: '#d8a070', crown: 'rishi', hair: 'jata', hairCol: '#4a2a1a', lower: 'valkala', thread: true, tilak: 'tripundra', rudraksha: true, necklace: false, ascetic: true, items: { R0: 'danda', L0: 'kamandalu' }, pose: 'hold', seed: 56 },
    vijaya:    { name: { en: 'Vijaya', hi: 'विजया' }, skin: '#ecc09a', female: true, crown: 'female', hair: 'long', skirt: '#e8641e', choli: '#2e5ac4', pallu: '#f29a4a', border: GOLD, tilak: 'bindi', pose: 'rest', seed: 57 },
    chandra:   { name: { en: 'Chandra', hi: 'चंद्र' }, skin: '#eef2fa', crown: 'mukut', hair: 'flow', crownCol: '#dfe8f6', lower: 'pitambar', dhoti: '#dfe6f4', border: '#7d8fb8', scarf: '#bcd0ff', halo: '#eef4ff', pose: 'stand', seed: 58 },
  };

  window.CBFig = { figure, creature, CAST, POSES, ITEMS, f1, shade, INK, GOLD, GOLD_L, GOLD_D, RUBY, smooth, limb, P, L, C, SH };
})();
