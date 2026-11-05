// Mahabharata paint kit: a thin painter over p5.brush (washes, ink lines, hatching) that also records
// every shape into a soft mask, a skeleton figure kit (heroes in profile, Indian-miniature faces),
// and painted sets (skies, armies, rivers, palaces, fire, cosmos). Plate space is 1600 x 900.

const PAPER = '#efe4cb';
const INK = '#1d130d';
const GOLD = '#d9a536';
const GOLD2 = '#f3cf6a';

function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const D2R = Math.PI / 180;
const dirv = (a) => [Math.sin(a * D2R), Math.cos(a * D2R)];          // 0 = down, 90 = forward, 180 = up
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const rot2 = (p, a) => { const c = Math.cos(a * D2R), s = Math.sin(a * D2R); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };
const ease = (x) => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;

let BRUSHES_ADDED = false;
function addBrushes() {
  if (BRUSHES_ADDED) return; BRUSHES_ADDED = true;
  brush.add('ink', { type: 'standard', weight: 0.75, vibration: 0.12, definition: 0.85, quality: 10, opacity: 235, spacing: 0.12, blend: false, pressure: { type: 'standard', curve: [0.15, 0.2], min_max: [1.5, 0.55] }, rotate: 'natural' });
  brush.add('fine', { type: 'standard', weight: 0.45, vibration: 0.06, definition: 0.9, quality: 8, opacity: 220, spacing: 0.1, blend: false, pressure: { type: 'standard', curve: [0.1, 0.2], min_max: [1.3, 0.7] }, rotate: 'natural' });
  brush.add('dry', { type: 'standard', weight: 1.6, vibration: 0.9, definition: 0.35, quality: 14, opacity: 170, spacing: 0.25, blend: true, pressure: { type: 'standard', curve: [0.2, 0.25], min_max: [1.3, 0.7] }, rotate: 'natural' });
  brush.add('gold', { type: 'standard', weight: 1.4, vibration: 0.1, definition: 0.9, quality: 10, opacity: 240, spacing: 0.15, blend: false, pressure: { type: 'standard', curve: [0.2, 0.2], min_max: [1.1, 0.8] }, rotate: 'natural' });
}
const P = {
  s: 1, rec: true, mode: 'paint', rng: Math.random,
  begin(seed, s, mode) { addBrushes(); brush.seed(seed); this.s = s; this.rec = true; this.mode = mode; this.rng = mulberry(seed * 7919 + 13); this.mblur = 0; this.sil = null; this.opk = 1; this.solid = false; this.fast = false; this.keep = new Set([GOLD, GOLD2, '#b3202a', '#f6f1e4', '#f1ead8', '#2a7a5a', '#8a1c1c', '#d8a63a', '#f6dc7a', '#f6c94a', '#e9a21f', '#2b7a64', '#d7b23a', '#1d3f8f']); },
  end() { },
  r(a = 0, b = 1) { return a + this.rng() * (b - a); },
  g(m = 0, sd = 1) { const u = 1 - this.rng(), v = this.rng(); return m + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); },
  sil: null, silK: 0.2, silInk: INK, opk: 1,
  silhouette(c, k = 0.2, ink = INK) { this.sil = c; this.silK = k; this.silInk = ink; }, noSilhouette() { this.sil = null; },
  tint(col) { if (!this.sil || (this.keep && this.keep.has(col))) return col; return mixc(this.sil, col, this.silK); },
  noMask() { this.rec = false; }, mask() { this.rec = true; },
  // ---- mask recording (Canvas2D, white on black) ----
  mpoly(pts, a = 1) {
    if (!this.rec || pts.length < 3) return;
    mctx.save(); mctx.setTransform(this.s, 0, 0, this.s, 0, 0);
    mctx.fillStyle = `rgba(255,255,255,${a})`; mctx.beginPath();
    pts.forEach((p, i) => i ? mctx.lineTo(p[0], p[1]) : mctx.moveTo(p[0], p[1]));
    mctx.closePath(); mctx.fill(); mctx.restore();
  },
  mline(pts, w, a = 1) {
    if (!this.rec) return;
    mctx.save(); mctx.setTransform(this.s, 0, 0, this.s, 0, 0);
    mctx.strokeStyle = `rgba(255,255,255,${a})`; mctx.lineWidth = w; mctx.lineCap = 'round'; mctx.lineJoin = 'round';
    mctx.beginPath(); pts.forEach((p, i) => i ? mctx.lineTo(p[0], p[1]) : mctx.moveTo(p[0], p[1])); mctx.stroke(); mctx.restore();
  },
  mcirc(x, y, r, a = 1) { if (!this.rec) return; mctx.save(); mctx.setTransform(this.s, 0, 0, this.s, 0, 0); mctx.fillStyle = `rgba(255,255,255,${a})`; mctx.beginPath(); mctx.arc(x, y, r, 0, 7); mctx.fill(); mctx.restore(); },
  // ---- painting ----
  wash(pts, col, op = 160, bleed = 0.02, tex = 0.35, border = 0.3) {
    brush.noStroke(); brush.noHatch(); brush.fill(col, op); brush.bleed(bleed); brush.fillTexture(tex, border);
    brush.polygon(pts); brush.noFill(); this.mpoly(pts);
  },
  flat(pts, col, a = 255) {  // fast plain p5 fill (for big dark grounds); still recorded
    noStroke(); const c = color(col); c.setAlpha(a); fill(c); beginShape(); for (const p of pts) vertex(p[0], p[1]); endShape(CLOSE); this.mpoly(pts);
  },
  line(pts, col, w = 1, name = 'ink', curv = 0.5) {
    if (name === 'HB' || name === 'pen') name = 'ink';
    if (name !== 'gold') col = this.tint(col);
    brush.noFill(); brush.noHatch(); brush.set(name, col, w);
    if (pts.length === 2) brush.line(pts[0][0], pts[0][1], pts[1][0], pts[1][1]); else brush.spline(pts, curv);
    brush.noStroke(); this.mline(pts, Math.max(2, w * 2.2));
  },
  outline(pts, col = INK, w = 0.9, name = 'ink') { this.line(pts.concat([pts[0]]), col, w, name, 0.15); },
  shape(pts, col, op = 170, ink = INK, w = 0.9, bleed = 0.015, tex = 0.4) {
    col = this.tint(col); if (ink === INK && this.sil) ink = this.silInk;
    if (this.fast) { noStroke(); fill(col); beginShape(); for (const p of pts) vertex(p[0], p[1]); endShape(CLOSE); this.mpoly(pts); if (ink) this.outline(pts, ink, w); return; }
    if (this.solid) { brush.reBlend(); brush.reDraw(); noStroke(); fill(shade(col, 0.12)); beginShape(); for (const p of pts) vertex(p[0], p[1]); endShape(CLOSE); }
    this.wash(pts, shade(col, -0.05), Math.min(255, op * this.opk), bleed * (this.solid ? 0.3 : 1), tex, 0.35);
    if (this.solid) brush.reBlend(); if (ink) this.outline(pts, ink, w); },
  hatch(pts, col, dist = 6, ang = 45, w = 0.6, rand = 0.15) {
    brush.noFill(); brush.noStroke(); brush.hatch(dist, ang, { rand, continuous: false, gradient: 0.2 }); brush.setHatch('HB', col, w);
    brush.polygon(pts); brush.noHatch();
  },
  circle(x, y, r, col, op = 170, ink = null, w = 0.8, bleed = 0.015) { this.shape(circlePts(x, y, r, Math.max(14, Math.min(48, r * 0.8 | 0))), col, op, ink, w, bleed); },
  dot(x, y, r, col, op = 220) { if (this.fast) { noStroke(); const c = color(this.tint(col)); c.setAlpha(op); fill(c); circle(x, y, r * 2); this.mcirc(x, y, r); return; } if (this.mode === 'add') { noStroke(); const c = color(col); c.setAlpha(op * 0.35); fill(c); circle(x, y, r * 4.2); c.setAlpha(op); fill(c); circle(x, y, r * 1.6); return; } if (!this.solid) { this.wash(circlePts(x, y, r, 10), col, op, 0.005, 0.2, 0.1); return; } brush.reBlend(); brush.reDraw(); noStroke(); const c = color(this.tint(col)); c.setAlpha(op); fill(c); circle(x, y, r * 2); this.mcirc(x, y, r); },
  spray(x, y, rad, n, col, w = 1) { brush.set('spray', col, w); for (let i = 0; i < n; i++) { const a = this.r(0, 360), d = Math.abs(this.g(0, rad)); const px = x + Math.cos(a * D2R) * d, py = y + Math.sin(a * D2R) * d; brush.line(px, py, px + this.r(-2, 2), py + this.r(-2, 2)); } brush.noStroke(); this.mcirc(x, y, rad * 1.6); },
  strokeOnly(pts, col, w, name = 'gold', curv = 0.5) { this.line(pts, col, w, name, curv); },
};

function circlePts(x, y, r, n = 24, rx = 1, ry = 1, a0 = 0) { const o = []; for (let i = 0; i < n; i++) { const a = a0 + i / n * Math.PI * 2; o.push([x + Math.cos(a) * r * rx, y + Math.sin(a) * r * ry]); } return o; }
function arcPts(x, y, r, a0, a1, n = 16) { const o = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * D2R; o.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } return o; }
// tapered capsule from A to B
function capsule(A, B, wa, wb, bulge = 0.12, n = 5) {
  const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const pts = [], M = lerp2(A, B, 0.4), wm = (wa + wb) / 2 * (1 + bulge);
  pts.push([A[0] + nx * wa, A[1] + ny * wa], [M[0] + nx * wm, M[1] + ny * wm], [B[0] + nx * wb, B[1] + ny * wb]);
  for (let i = 1; i < n; i++) { const a = Math.atan2(ny, nx) - Math.PI * i / n; pts.push([B[0] + Math.cos(a) * wb, B[1] + Math.sin(a) * wb]); }
  pts.push([B[0] - nx * wb, B[1] - ny * wb], [M[0] - nx * wm * 0.9, M[1] - ny * wm * 0.9], [A[0] - nx * wa, A[1] - ny * wa]);
  for (let i = 1; i < n; i++) { const a = Math.atan2(-ny, -nx) - Math.PI * i / n; pts.push([A[0] + Math.cos(a) * wa, A[1] + Math.sin(a) * wa]); }
  return pts;
}
// ribbon along a polyline with widths
function ribbon(line, w0, w1) {
  const L = [], R = []; const n = line.length;
  for (let i = 0; i < n; i++) {
    const a = line[Math.max(0, i - 1)], b = line[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; const w = w0 + (w1 - w0) * i / (n - 1);
    L.push([line[i][0] - dy / l * w, line[i][1] + dx / l * w]); R.push([line[i][0] + dy / l * w, line[i][1] - dx / l * w]);
  }
  return L.concat(R.reverse());
}
function shade(hex, k) { // k<0 darker, k>0 lighter
  const c = color(hex); let r = red(c), g = green(c), b = blue(c);
  if (k < 0) { r *= 1 + k; g *= 1 + k; b *= 1 + k; } else { r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k; }
  return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}
function mixc(h1, h2, t) { const a = color(h1), b = color(h2); return '#' + [red(a) + (red(b) - red(a)) * t, green(a) + (green(b) - green(a)) * t, blue(a) + (blue(b) - blue(a)) * t].map(v => Math.round(v).toString(16).padStart(2, '0')).join(''); }

// ============================================================ FIGURES ====
// Every figure stands with its feet at (x, y) and is S pixels tall. f = 1 faces right, -1 faces left.
const CAST = {
  arjuna: { skin: '#a8714a', dhoti: '#c7362b', patka: '#2f4f8f', scarf: '#e0a43a', crown: 'mukut', hair: '#1a1210', beard: 'stache', jewel: GOLD },
  krishna: { skin: '#3f6db0', dhoti: '#e9b52f', patka: '#b8322a', scarf: '#c7362b', crown: 'peacock', hair: '#120d0a', beard: null, jewel: GOLD, garland: '#f2efe2' },
  bhishma: { skin: '#b9875f', dhoti: '#ece6d6', patka: '#c9b57a', scarf: '#f4efe2', crown: 'bun', hair: '#f2efe6', beard: 'long', jewel: '#cfc6a8', age: 1 },
  yudhi: { skin: '#b07a50', dhoti: '#efe7d0', patka: '#d2a23a', scarf: '#6a8f4e', crown: 'mukut', hair: '#1a1210', beard: 'short', jewel: GOLD },
  bhima: { skin: '#8f5b38', dhoti: '#7a2f8a', patka: '#e3a43a', scarf: '#c7362b', crown: 'band', hair: '#140e0b', beard: 'stache', jewel: GOLD, bulk: 1.35 },
  karna: { skin: '#b9814f', dhoti: '#a3241e', patka: '#e3a43a', scarf: '#f0c040', crown: 'sun', hair: '#1a1210', beard: 'stache', jewel: GOLD2, armor: 'kavacha' },
  duryo: { skin: '#9c6640', dhoti: '#2c2d55', patka: '#6e1d22', scarf: '#5b1a5e', crown: 'serpent', hair: '#120d0a', beard: 'stache', jewel: '#b88b2e', bulk: 1.15 },
  abhi: { skin: '#b07a50', dhoti: '#d24a2a', patka: '#2f4f8f', scarf: '#e9c34a', crown: 'mukut', hair: '#1a1210', beard: null, jewel: GOLD, young: 1 },
  drona: { skin: '#b08560', dhoti: '#e8dcc0', patka: '#a0522d', scarf: '#d9c9a0', crown: 'bun', hair: '#d8d4cc', beard: 'long', jewel: '#cfc6a8', age: 1 },
  shakuni: { skin: '#a77a55', dhoti: '#3a5a3a', patka: '#7a6a20', scarf: '#2d4a3a', crown: 'turban', hair: '#3a3530', beard: 'goatee', jewel: '#b88b2e' },
};

const POSES = {
  stand: { lean: 0, head: 0, aF: [10, 25], aB: [-8, 5], lF: [4, 0], lB: [-6, -2] },
  draw: { lean: -4, head: 2, aF: [92, 90], aB: [-100, 92], aBl: [0.55, 1.0], lF: [22, 8], lB: [-22, -6] },          // bow drawn, front arm holds bow
  release: { lean: -2, head: 0, aF: [92, 90], aB: [-110, -60], aBl: [0.7, 0.9], lF: [22, 8], lB: [-22, -6] },
  vow: { lean: -6, head: -12, aF: [168, 178], aB: [-10, 30], lF: [8, 2], lB: [-10, -4] },           // hand raised to the sky
  mace: { lean: 6, head: 0, aF: [40, 150], aB: [-15, 60], lF: [28, 10], lB: [-26, -8] },            // mace on shoulder
  maceUp: { lean: 10, head: -4, aF: [150, 205], aB: [140, 200], lF: [30, 12], lB: [-30, -10] },     // mace raised overhead
  spear: { lean: 0, head: 0, aF: [55, 150], aB: [-6, 10], lF: [6, 2], lB: [-8, -2] },
  bless: { lean: 0, head: 0, aF: [35, 120], aB: [-10, 20], lF: [4, 0], lB: [-6, -2] },
  flute: { lean: 2, head: 6, aF: [62, 140], aB: [55, 155], lF: [-12, -10], lB: [10, 6] },            // flute, ankles crossed
  despair: { lean: 18, head: 25, aF: [-8, -2], aB: [-12, -6], lF: [0, 0], lB: [-4, -2] },           // slumped, bow fallen
  charge: { lean: 16, head: -2, aF: [70, 110], aB: [-40, -10], lF: [55, 10], lB: [-40, -30] },
  dice: { lean: 10, head: 6, aF: [70, 85], aB: [30, 70], lF: [80, 0], lB: [80, 0], seat: 1 },
  bowLow: { lean: 4, head: 8, aF: [30, 60], aB: [-10, 10], lF: [6, 0], lB: [-8, -2] },
};

function figure(P, o) {
  const c = Object.assign({}, CAST[o.who] || {}, o.style || {});
  const pose = Object.assign({}, POSES[o.pose || 'stand'], o.poseOver || {});
  const S = o.S || 400, f = o.f || 1, X = o.x, Y = o.y, bulk = c.bulk || 1;
  const RO = o.rot || 0;
  const T = (p) => { if (RO) p = rot2(p, RO); return [X + p[0] * S * f, Y + p[1] * S]; };      // local -> plate
  const A = (a) => a;                                                       // angles already in "forward" convention
  const fw = (a) => { const d = dirv(a); return [d[0], d[1]]; };
  const inkW = Math.max(0.6, S / 520);
  const skinB = shade(c.skin, -0.22);
  // ---- skeleton (local units, feet at y=0, height 1) ----
  const seat = pose.seat;
  const hip = seat ? [0, -0.30] : [0, -0.52];
  const up = fw(180 - pose.lean);
  const neck = add(hip, up, 0.30);
  const headC = add(neck, fw(180 - pose.lean - pose.head * 0.6), 0.072);
  const shF = add(neck, rot2([0.03, 0.035], pose.lean)), shB = add(neck, rot2([-0.035, 0.03], pose.lean));
  const arm = (sh, ang, ls = [1, 1]) => { const el = add(sh, fw(ang[0]), 0.165 * ls[0]); const wr = add(el, fw(ang[1]), 0.15 * ls[1]); return [sh, el, wr]; };
  const [_, elF, wrF] = arm(shF, pose.aF, pose.aFl), [__, elB, wrB] = arm(shB, pose.aB, pose.aBl);
  const hipF = add(hip, [0.025, 0.0]), hipB = add(hip, [-0.02, 0.0]);
  const leg = (hp, ang) => { const kn = add(hp, fw(ang[0]), 0.255); const an = add(kn, fw(ang[1]), seat ? 0.2 : 0.245); return [hp, kn, an]; };
  let [, knF, anF] = leg(hipF, pose.lF), [, knB, anB] = leg(hipB, pose.lB);
  if (seat) { knF = add(hipF, [0.24, 0.0]); anF = add(knF, [-0.05, 0.12]); knB = add(hipB, [0.22, 0.02]); anB = add(knB, [-0.1, 0.1]); }
  const out = { hip: T(hip), neck: T(neck), head: T(headC), wrF: T(wrF), wrB: T(wrB), elF: T(elF), shF: T(shF), S, f };
  const pts = (arr) => arr.map(T);
  const limb = (a, b, wa, wb, col, ink = true) => {
    const cp = capsule(a, b, wa * bulk, wb * bulk); P.shape(pts(cp), col, 185, null, inkW, 0.01, 0.35);
    if (ink) { P.line(pts([cp[0], cp[1], cp[2]]), INK, inkW, 'ink', 0.5); const n = cp.length; P.line(pts([cp[3 + 4], cp[3 + 5], cp[3 + 6]].filter(Boolean)), INK, inkW, 'ink', 0.5); }
  };
  const hand = (el, wr, col) => { const d = [wr[0] - el[0], wr[1] - el[1]], L = Math.hypot(d[0], d[1]) || 1; const tip = add(wr, [d[0] / L, d[1] / L], 0.05); P.shape(pts(capsule(wr, tip, 0.02 * bulk, 0.015 * bulk, 0.3)), col, 200, INK, inkW * 0.8, 0.006); };

  // ---- scarf behind (angavastra), flowing with wind ----
  const wind = o.wind ?? 1, ph = (o.t || 0) * 2.2 + (o.phase || 0);
  if (c.scarf && !o.noScarf) {
    // angavastra: a narrow coloured cloth over the shoulders that streams back in the wind
    const keepScarf = P.keep; if (P.sil) P.keep = new Set([...P.keep, c.scarf]);
    for (const [base, len, w0, ph2] of [[shB, 0.34, 0.014, 0]]) {
      const line = []; for (let i = 0; i < 10; i++) { const k = i / 9; const drop = k < 0.35 ? k * 0.25 : 0.0875 + (k - 0.35) * (0.12 - 0.1 * wind);
        line.push([base[0] - 0.01 - Math.max(0, k - 0.2) * len * wind * 1.2, base[1] + 0.02 + drop + Math.sin(ph + ph2 + k * 5.5) * 0.04 * k * (0.4 + wind)]); }
      P.shape(pts(ribbon(line, w0 * 0.45, w0 * 1.1)), c.scarf, 210, INK, inkW * 0.7, 0.006, 0.5);
    }
    P.keep = keepScarf;
  }
  const keepHair = P.keep; if (P.sil && c.age) P.keep = new Set([...P.keep, c.hair]);
  // ---- hair behind ----
  if (c.crown !== 'bun' && c.crown !== 'turban') {
    const hb = []; for (let i = 0; i < 8; i++) { const k = i / 7; hb.push(add(headC, [-0.035 - k * 0.07 * wind - Math.sin(ph * 0.8 + k * 4) * 0.015 * k, -0.03 + k * 0.2])); }
    P.shape(pts(ribbon(hb, 0.04, 0.018)), c.hair, 220, INK, inkW * 0.8, 0.008, 0.3);
    for (let i = 0; i < 3; i++) P.line(pts(hb.map((p, k) => add(p, [(i - 1) * 0.012, 0]))), shade(c.hair, 0.25), inkW * 0.6, 'fine', 0.5);
  }
  // ---- back arm, back leg ----
  limb(shB, elB, 0.027, 0.022, skinB); limb(elB, wrB, 0.022, 0.016, skinB);
  hand(elB, wrB, skinB);
  limb(hipB, knB, 0.045, 0.032, skinB); limb(knB, anB, 0.031, 0.019, skinB);
  P.shape(pts([add(anB, [-0.02, -0.01]), add(anB, [0.07, 0.005]), add(anB, [0.075, 0.018]), add(anB, [-0.022, 0.02])]), skinB, 190, INK, inkW);
  // ---- back hand weapon (drawn string hand etc.) handled by weapon() after ----
  // ---- torso ----
  const tor = [[-0.055, 0.02], [-0.062, -0.1], [-0.07, -0.22], [-0.05, -0.29], [-0.02, -0.305], [0.03, -0.305], [0.085, -0.27], [0.095, -0.21], [0.075, -0.16], [0.062, -0.08], [0.058, 0.02]]
    .map(p => add(hip, rot2([p[0] * bulk, p[1]], pose.lean)));
  if (c.female) { }
  const torsoCol = c.armor ? '#d8a63a' : c.skin;
  P.shape(pts(tor), torsoCol, 190, INK, inkW, 0.01, 0.35);
  if (c.armor) { // kavacha: scaled golden armour
    for (let r = 0; r < 6; r++) for (let q = 0; q < 4; q++) { const p = add(hip, rot2([(-0.045 + q * 0.03 + (r % 2) * 0.015) * bulk, -0.05 - r * 0.04], pose.lean)); P.line(pts(arcPts(p[0], p[1], 0.014, 20, 160, 5)), '#7a4a10', inkW * 0.7, 'HB', 0.3); }
    P.circle(...T(add(hip, rot2([0.03, -0.2], pose.lean))), S * 0.025, '#f6dc7a', 220, INK, inkW);
  } else {
    // musculature hint
    P.line(pts([add(hip, rot2([0.07, -0.2], pose.lean)), add(hip, rot2([0.03, -0.17], pose.lean)), add(hip, rot2([0.0, -0.19], pose.lean))]), shade(c.skin, -0.35), inkW * 0.7, 'HB', 0.6);
    P.line(pts([add(hip, rot2([0.045, -0.06], pose.lean)), add(hip, rot2([0.04, -0.03], pose.lean))]), shade(c.skin, -0.35), inkW * 0.6, 'HB', 0.6);
  }
  // sacred thread / necklace
  P.line(pts([add(neck, rot2([0.05, 0.03], pose.lean)), add(hip, rot2([0.0, -0.17], pose.lean)), add(hip, rot2([-0.05, -0.04], pose.lean))]), '#efe9d6', inkW * 0.9, 'pen', 0.6);
  for (let i = 0; i < 2; i++) P.line(pts(arcPts(...add(neck, rot2([0.02, 0.0], pose.lean)), 0.045 + i * 0.022, 20, 160, 8)), i ? (c.garland || c.jewel) : c.jewel, inkW * (2.2 - i * 0.5), 'gold', 0.5);
  // ---- dhoti ----
  const wb = add(hip, rot2([-0.065 * bulk, -0.035], pose.lean)), wf = add(hip, rot2([0.065 * bulk, -0.035], pose.lean));
  const dh = [wb, wf, add(lerp2(hipF, knF, 0.5), [0.055, 0]), add(knF, [0.055, 0.035]), add(knF, [-0.01, 0.05]), lerp2(knF, knB, 0.5), add(knB, [0.01, 0.05]), add(knB, [-0.055, 0.035]), add(lerp2(hipB, knB, 0.5), [-0.06, 0])];
  P.shape(pts(dh), c.dhoti, 200, INK, inkW, 0.01, 0.45);
  for (let i = 0; i < 4; i++) { const a = lerp2(wb, wf, 0.2 + i * 0.2), b = lerp2(add(knB, [0, 0.04]), add(knF, [0, 0.03]), 0.2 + i * 0.2); P.line(pts([a, lerp2(a, b, 0.5), b]), shade(c.dhoti, -0.35), inkW * 0.7, 'HB', 0.5); }
  // ---- front leg ----
  limb(knF, anF, 0.031, 0.019, c.skin);
  P.shape(pts([add(anF, [-0.02, -0.01]), add(anF, [0.07, 0.005]), add(anF, [0.075, 0.018]), add(anF, [-0.022, 0.02])]), c.skin, 190, INK, inkW);
  P.line(pts([add(anF, [-0.02, -0.012]), add(anF, [0.03, -0.01])]), c.jewel, inkW * 2, 'gold');
  // ---- patka (front sash) and belt ----
  const pk = [lerp2(wb, wf, 0.55), lerp2(wb, wf, 0.85), add(lerp2(knF, hipF, 0.3), [0.04, 0.02]), add(lerp2(knF, hipF, 0.3), [-0.01, 0.04])];
  P.shape(pts(pk), c.patka, 210, INK, inkW, 0.008, 0.4);
  P.line(pts([wb, lerp2(wb, wf, 0.5), wf]), c.jewel, inkW * 3.2, 'gold', 0.3);
  // ---- head ----
  head(P, c, T, headC, pose, inkW, o);
  // ---- front arm ----
  if (!o.noFrontArm) {
    P.shape(pts(circlePts(shF[0] - 0.005, shF[1] + 0.012, 0.034 * bulk, 14)), c.skin, 190, null);
    limb(shF, elF, 0.028, 0.022, c.skin); limb(elF, wrF, 0.022, 0.016, c.skin);
    P.line(pts([lerp2(shF, elF, 0.45), lerp2(shF, elF, 0.47)]), c.jewel, inkW * 3, 'gold'); // armlet
    P.line(pts([lerp2(elF, wrF, 0.88), lerp2(elF, wrF, 0.9)]), c.jewel, inkW * 3, 'gold');
    hand(elF, wrF, c.skin);
  }
  P.keep = keepHair;
  out.local = { T, hip, neck, headC, wrF, wrB, elF, elB, shF, shB };
  if (o.weapon) weapon(P, o.weapon, out, c, o, inkW);
  return out;
}

function head(P, c, T, hc, pose, inkW, o) {
  const pts = (arr) => arr.map(p => T(add(hc, rot2(p, -pose.head * 0.4))));
  const prof = [[-0.05, 0.0], [-0.052, -0.035], [-0.03, -0.062], [0.01, -0.068], [0.04, -0.05], [0.05, -0.025], [0.055, -0.008], [0.071, 0.014], [0.058, 0.02], [0.06, 0.03], [0.053, 0.036], [0.056, 0.044], [0.046, 0.058], [0.02, 0.066], [-0.01, 0.06], [-0.03, 0.045], [-0.035, 0.075], [0.012, 0.09], [-0.045, 0.09], [-0.05, 0.04]];
  P.shape(pts(prof), c.skin, 205, INK, inkW, 0.006, 0.3);
  // fish-shaped eye, brow, ear
  P.shape(pts([[0.018, -0.006], [0.034, -0.014], [0.047, -0.006], [0.034, 0.0]]), '#f6f1e4', 230, INK, inkW * 0.9, 0.003, 0.1);
  P.dot(...pts([[0.032, -0.007]])[0], Math.max(1.2, o.S * 0.0045), INK, 255);
  P.line(pts([[0.012, -0.024], [0.032, -0.03], [0.05, -0.022]]), INK, inkW * 1.2, 'HB', 0.6);
  P.line(pts([[0.03, -0.0], [0.004, 0.004]]), INK, inkW * 0.8, 'HB', 0.3); // eye tail
  P.shape(pts(circlePts(-0.008, 0.008, 0.012, 8)), shade(c.skin, -0.15), 180, INK, inkW * 0.7);
  P.dot(...pts([[-0.006, 0.026]])[0], Math.max(1.5, o.S * 0.006), c.jewel, 240); // kundala earring
  if (c.crown === 'sun') P.circle(...pts([[-0.006, 0.03]])[0], o.S * 0.012, GOLD2, 240, INK, inkW);
  if (c.female) { P.dot(...pts([[0.045, -0.034]])[0], Math.max(1.2, o.S * 0.004), '#c1121f', 255); }
  // beard / moustache
  if (c.beard === 'stache') P.line(pts([[0.04, 0.028], [0.055, 0.026], [0.064, 0.031]]), c.hair, inkW * 1.8, 'HB', 0.6);
  if (c.beard === 'short') P.shape(pts([[0.0, 0.05], [0.025, 0.068], [0.05, 0.06], [0.058, 0.032], [0.06, 0.05], [0.045, 0.08], [0.015, 0.085], [-0.025, 0.06]]), c.hair, 215, INK, inkW * 0.8, 0.006);
  if (c.beard === 'goatee') P.shape(pts([[0.03, 0.058], [0.05, 0.06], [0.045, 0.1], [0.035, 0.09]]), c.hair, 215, INK, inkW * 0.8, 0.006);
  if (c.beard === 'long') {
    P.shape(pts([[-0.02, 0.03], [0.02, 0.05], [0.05, 0.034], [0.062, 0.03], [0.064, 0.06], [0.05, 0.12], [0.02, 0.19], [0.0, 0.17], [-0.02, 0.1]]), c.hair, 225, INK, inkW * 0.8, 0.006);
    for (let i = 0; i < 5; i++) P.line(pts([[0.0 + i * 0.01, 0.06], [0.01 + i * 0.01, 0.12], [0.012 + i * 0.006, 0.17]]), shade(c.hair, -0.3), inkW * 0.6, 'HB', 0.5);
  }
  // headgear
  const cr = c.crown;
  if (cr === 'mukut' || cr === 'peacock' || cr === 'sun' || cr === 'serpent') {
    const tall = cr === 'serpent' ? 0.8 : 1;
    const half = [[0.0, -0.04], [0.052, -0.04], [0.054, -0.078], [0.04, -0.088], [0.05, -0.125], [0.03, -0.14], [0.024, -0.175], [0.012, -0.2], [0.004, -0.225]];
    const m = half.map(p => [p[0] - 0.0, -0.04 + (p[1] + 0.04) * tall]).concat(half.slice().reverse().map(p => [-p[0] - 0.0, -0.04 + (p[1] + 0.04) * tall]));
    P.shape(pts(m.map(p => [p[0] * 1.05, p[1]])), cr === 'serpent' ? '#3b3524' : GOLD, 225, INK, inkW, 0.006, 0.5);
    P.line(pts([[-0.052, -0.06], [0.0, -0.066], [0.052, -0.06]]), '#8a1c1c', inkW * 2.6, 'gold', 0.4);
    P.line(pts([[-0.042, -0.115], [0.0, -0.12], [0.042, -0.115]]), '#7a4a10', inkW * 1.2, 'ink', 0.4);
    for (let i = 0; i < 3; i++) P.dot(...pts([[-0.028 + i * 0.028, -0.09 - (i === 1 ? 0.006 : 0)]])[0], Math.max(1.4, o.S * 0.005), i === 1 ? '#2a7a5a' : '#b3202a');
    P.dot(...pts([[0.0, -0.04 - 0.19 * tall]])[0], Math.max(1.6, o.S * 0.006), '#b3202a');
    if (cr === 'peacock') { // peacock feather
      const fl = [[-0.02, -0.12], [-0.04, -0.2], [-0.06, -0.26], [-0.085, -0.3]];
      P.line(pts(fl), '#2e5a3a', inkW * 1.4, 'HB', 0.6);
      const e = pts([[-0.085, -0.3]])[0];
      P.circle(e[0], e[1], o.S * 0.03, '#2b7a64', 220, INK, inkW * 0.8); P.circle(e[0], e[1], o.S * 0.019, '#d7b23a', 230); P.circle(e[0], e[1], o.S * 0.011, '#1d3f8f', 240);
      for (let i = 0; i < 9; i++) { const a = -150 + i * 22; P.line([e, add(e, [Math.cos(a * D2R) * o.S * 0.05, Math.sin(a * D2R) * o.S * 0.05])], '#3b7a40', inkW * 0.7, 'HB'); }
    }
    if (cr === 'sun') { const e = pts([[0.0, -0.26]])[0]; P.circle(e[0], e[1], o.S * 0.028, '#f6c94a', 230, '#8a4a10', inkW); for (let i = 0; i < 12; i++) { const a = i * 30 * D2R; P.line([add(e, [Math.cos(a) * o.S * 0.032, Math.sin(a) * o.S * 0.032]), add(e, [Math.cos(a) * o.S * 0.05, Math.sin(a) * o.S * 0.05])], '#e9a21f', inkW * 1.4, 'gold'); } }
    if (cr === 'serpent') { const hood = pts([[-0.01, -0.2], [0.03, -0.24], [0.06, -0.2], [0.05, -0.16], [0.02, -0.14]]); P.shape(hood, '#2b3b2a', 225, INK, inkW); }
  } else if (cr === 'bun') {
    P.shape(pts([[-0.05, -0.02], [-0.045, -0.06], [-0.02, -0.075], [0.03, -0.065], [0.045, -0.045], [0.0, -0.05]]), c.hair, 225, INK, inkW);
    P.shape(pts(circlePts(-0.025, -0.085, 0.028, 12)), c.hair, 225, INK, inkW);
    P.line(pts([[-0.05, -0.045], [0.04, -0.05]]), c.jewel, inkW * 2, 'gold');
  } else if (cr === 'band') {
    P.shape(pts([[-0.055, -0.01], [-0.05, -0.05], [-0.02, -0.075], [0.03, -0.07], [0.048, -0.04], [0.0, -0.045]]), c.hair, 225, INK, inkW);
    P.line(pts([[-0.052, -0.04], [0.0, -0.058], [0.048, -0.045]]), GOLD, inkW * 3.4, 'gold');
    P.dot(...pts([[0.01, -0.06]])[0], Math.max(1.5, o.S * 0.006), '#b3202a');
  } else if (cr === 'turban') {
    P.shape(pts([[-0.056, -0.005], [-0.06, -0.06], [-0.03, -0.09], [0.02, -0.095], [0.05, -0.06], [0.05, -0.03], [0.0, -0.04]]), '#7a6a20', 225, INK, inkW);
    for (let i = 0; i < 3; i++) P.line(pts([[-0.05, -0.02 - i * 0.022], [0.0, -0.045 - i * 0.02], [0.048, -0.035 - i * 0.015]]), '#4a3e10', inkW * 0.8, 'HB', 0.5);
  }
  if (c.female) {
    // long open hair over the back and a pallu over the head
    P.shape(pts([[-0.05, -0.01], [-0.03, -0.06], [0.02, -0.07], [0.05, -0.04], [-0.01, -0.03], [-0.035, 0.03], [-0.04, 0.1]]), c.hair, 220, INK, inkW);
  }
}

function weapon(P, w, F, c, o, inkW) {
  const { T, wrF, wrB, headC } = F.local; const S = F.S;
  const pts = (arr) => arr.map(T);
  if (w === 'bow' || w === 'bowDrawn' || w === 'bowRest') {
    // Gandiva: tall recurved bow held in the front hand
    const g = wrF, drawn = w === 'bowDrawn';
    const pull = drawn ? Math.max(0.03, Math.abs(wrB[0] - g[0])) : 0.0;
    const top = add(g, [-0.04, -0.4]), bot = add(g, [-0.04, 0.4]);
    const bowL = [add(top, [0.03, -0.02]), top, add(g, [0.02, -0.22]), add(g, [0.012, 0]), add(g, [0.02, 0.22]), bot, add(bot, [0.03, 0.02])];
    P.shape(pts(ribbon(bowL, 0.006, 0.006)), '#6a3a1a', 230, INK, inkW, 0.004, 0.3);
    P.line(pts([add(g, [0.01, -0.04]), add(g, [0.01, 0.04])]), GOLD, inkW * 3, 'gold');
    const sTop = add(top, [0.0, 0.0]), sBot = add(bot, [0.0, 0.0]);
    if (drawn) {
      const hand = wrB; P.line(pts([sTop, hand]), '#f1ead8', inkW * 0.8, 'pen', 0); P.line(pts([hand, sBot]), '#f1ead8', inkW * 0.8, 'pen', 0);
      // arrow nocked
      const tip = add(g, [0.2, 0]); P.line(pts([add(hand, [-0.02, 0]), tip]), '#3a2410', inkW * 1.4, 'HB', 0);
      P.shape(pts([tip, add(tip, [-0.04, -0.012]), add(tip, [-0.03, 0]), add(tip, [-0.04, 0.012])]), '#c9c9c9', 240, INK, inkW * 0.7, 0.002);
      P.shape(pts([add(hand, [-0.01, 0]), add(hand, [-0.06, -0.015]), add(hand, [-0.05, 0]), add(hand, [-0.06, 0.015])]), '#b3202a', 220, INK, inkW * 0.6, 0.003);
    } else P.line(pts([sTop, sBot]), '#f1ead8', inkW * 0.8, 'pen', 0);
  }
  if (w === 'mace') { // gada: shaft from the hand, head above shoulder
    const g = wrF, head = add(g, rot2([0, -0.3], (o.maceAng ?? -25) * (o.f || 1) * 0 + (o.maceAng ?? -25)));
    P.shape(pts(ribbon([add(g, [0, 0.06]), head], 0.012, 0.01)), '#7a4a1a', 230, INK, inkW);
    P.shape(pts(circlePts(head[0], head[1], 0.075, 18, 1, 1.15)), GOLD, 235, INK, inkW * 1.2, 0.006);
    for (let i = 0; i < 3; i++) P.line(pts(arcPts(head[0], head[1], 0.075 - i * 0.002, -60 + i * 50, -20 + i * 50, 6)), '#7a4a10', inkW, 'HB', 0.5);
    P.dot(...pts([add(head, [0, -0.09])])[0], S * 0.012, GOLD2);
    P.shape(pts(circlePts(g[0], g[1], 0.024, 10)), c.skin, 210, INK, inkW);
  }
  if (w === 'spear') { const g = wrF; const a = add(g, [0.02, 0.35]), b = add(g, [-0.06, -0.55]); P.line(pts([a, b]), '#5a3a1a', inkW * 2, 'HB', 0); P.shape(pts([b, add(b, [-0.02, 0.06]), add(b, [-0.006, -0.08]), add(b, [0.012, 0.06])]), '#d0d0d0', 240, INK, inkW, 0.002); P.shape(pts(circlePts(g[0], g[1], 0.024, 10)), c.skin, 210, INK, inkW); }
  if (w === 'flute') { const a = add(headC, [0.06, 0.05]), b = add(headC, [0.27, 0.16]); P.shape(pts(ribbon([a, b], 0.007, 0.007)), '#a8742a', 240, INK, inkW, 0.003); for (let i = 1; i < 6; i++) P.dot(...pts([lerp2(a, b, 0.3 + i * 0.1)])[0], S * 0.003, INK); P.line(pts([lerp2(a, b, 0.92), add(lerp2(a, b, 0.92), [0.0, 0.08])]), '#c7362b', inkW * 1.5, 'gold'); P.shape(pts(circlePts(wrB[0], wrB[1], 0.022, 10)), shade(c.skin, -0.1), 210, INK, inkW); }
  if (w === 'wheel') { const g = lerp2(wrF, wrB, 0.5), c0 = add(g, [0, -0.1]), R = 0.12; P.shape(pts(circlePts(c0[0], c0[1], R, 24)), '#5a3416', 220, INK, inkW * 1.3); P.shape(pts(circlePts(c0[0], c0[1], R * 0.8, 24)), '#a8742a', 120, INK, inkW); for (let i = 0; i < 8; i++) { const a = i * 45 * D2R; P.line(pts([c0, add(c0, [Math.cos(a) * R * 0.8, Math.sin(a) * R * 0.8])]), '#5a3416', inkW * 1.5, 'ink', 0); } }
  if (w === 'conch') { const g = wrF; P.shape(pts(circlePts(g[0] + 0.02, g[1] - 0.02, 0.04, 14, 1.3, 0.8)), '#f4efe0', 240, INK, inkW); }
}

// Draupadi: a standing woman in a sari, drawn separately (no dhoti/torso kit)
function woman(P, o) {
  const S = o.S, f = o.f || 1, X = o.x, Y = o.y, inkW = Math.max(0.6, S / 520), t = o.t || 0;
  const T = (p) => [X + p[0] * S * f, Y + p[1] * S]; const pts = (a) => a.map(T);
  const skin = o.skin || '#a8714a', sari = o.sari || '#b3202a', border = o.border || GOLD, hair = '#120d0a', wind = o.wind ?? 1;
  const ph = t * 2 + (o.phase || 0);
  // flowing hair behind
  const hl = []; for (let i = 0; i < 9; i++) { const k = i / 8; hl.push([-0.05 - k * 0.22 * wind, -0.86 + k * 0.42 + Math.sin(ph + k * 4) * 0.03 * k * wind]); }
  P.shape(pts(ribbon(hl, 0.04, 0.012)), hair, 230, INK, inkW);
  // pallu flying
  const pl = []; for (let i = 0; i < 10; i++) { const k = i / 9; pl.push([-0.02 - k * 0.5 * wind, -0.72 + k * 0.1 + Math.sin(ph * 1.2 + k * 5) * 0.06 * k * wind]); }
  P.shape(pts(ribbon(pl, 0.03, 0.07)), sari, 170, INK, inkW, 0.01, 0.5);
  // skirt
  const sk = [[-0.07, -0.5], [0.07, -0.5], [0.11, -0.25], [0.16, 0.0], [0.05, 0.015], [-0.08, 0.01], [-0.14, 0.0], [-0.1, -0.25]];
  P.shape(pts(sk), sari, 210, INK, inkW, 0.01, 0.45);
  for (let i = 0; i < 6; i++) P.line(pts([[-0.04 + i * 0.02, -0.48], [-0.07 + i * 0.045, -0.2], [-0.1 + i * 0.05, -0.0]]), shade(sari, -0.35), inkW * 0.7, 'HB', 0.5);
  P.line(pts([[-0.14, -0.005], [0.0, 0.012], [0.16, -0.005]]), border, inkW * 4, 'gold', 0.3);
  // torso + blouse
  P.shape(pts([[-0.055, -0.5], [-0.06, -0.62], [-0.05, -0.76], [0.0, -0.79], [0.05, -0.76], [0.07, -0.68], [0.06, -0.6], [0.06, -0.5]]), skin, 200, INK, inkW);
  P.shape(pts([[-0.06, -0.63], [-0.05, -0.76], [0.05, -0.76], [0.07, -0.67], [0.04, -0.62]]), shade(sari, -0.15), 220, INK, inkW);
  // sari drape across the chest
  P.shape(pts([[0.065, -0.5], [0.07, -0.58], [0.04, -0.66], [-0.03, -0.77], [-0.06, -0.74], [0.0, -0.62], [-0.03, -0.5]]), sari, 200, INK, inkW);
  P.line(pts([[-0.03, -0.77], [0.04, -0.66], [0.07, -0.58]]), border, inkW * 3, 'gold', 0.5);
  // arms
  const aF = o.arm || [30, 60];
  const sh = [0.035, -0.75], el = add(sh, dirv(aF[0]), 0.15), wr = add(el, dirv(aF[1]), 0.14);
  P.shape(pts(capsule(sh, el, 0.022, 0.017)), skin, 200, INK, inkW); P.shape(pts(capsule(el, wr, 0.017, 0.013)), skin, 200, INK, inkW);
  for (let i = 0; i < 3; i++) P.line(pts([lerp2(el, wr, 0.8 + i * 0.04), lerp2(el, wr, 0.81 + i * 0.04)]), i % 2 ? '#b3202a' : GOLD, inkW * 2.5, 'gold');
  P.shape(pts(circlePts(wr[0], wr[1], 0.02, 10)), skin, 210, INK, inkW);
  // head
  const hc = [0.0, -0.86];
  const c = { skin, hair, crown: null, beard: null, jewel: GOLD, female: 1 };
  head(P, c, T, hc, { head: o.head || 0 }, inkW, o);
  P.line(pts([[-0.05, -0.9], [0.0, -0.925], [0.045, -0.905]]), GOLD, inkW * 2, 'gold', 0.4);
  P.dot(...pts([[0.0, -0.93]])[0], S * 0.006, '#b3202a');
  for (let i = 0; i < 2; i++) P.line(pts(arcPts(0.01, -0.76, 0.04 + i * 0.02, 20, 160, 8)), GOLD, inkW * 2, 'gold', 0.5);
  return { T, head: T(hc), hand: T(wr) };
}

// ============================================================ SETS ====
function skyBands(P, cols, y0 = 0, y1 = 900, n = 7, op = 120) {
  // layered horizontal washes from top colour to bottom colour (cols = [top, ..., bottom])
  P.noMask();
  for (let i = 0; i < n; i++) {
    const k = i / (n - 1), col = cols.length === 2 ? mixc(cols[0], cols[1], k) : mixc(cols[Math.min(cols.length - 2, Math.floor(k * (cols.length - 1)))], cols[Math.min(cols.length - 1, Math.floor(k * (cols.length - 1)) + 1)], (k * (cols.length - 1)) % 1);
    const yA = y0 + (y1 - y0) * (i / n) - 40, yB = y0 + (y1 - y0) * ((i + 1.6) / n);
    const pts = []; for (let x = -60; x <= 1660; x += 120) pts.push([x, yA + P.r(-25, 25)]); for (let x = 1660; x >= -60; x -= 120) pts.push([x, yB + P.r(-25, 25)]);
    P.wash(pts, col, op, 0.02, 0.55, 0.15);
  }
  P.mask();
}
function cloudBank(P, y, col, op = 90, n = 6, h = 60) {
  P.noMask(); for (let i = 0; i < n; i++) { const x = P.r(-100, 1600), w = P.r(200, 500); const pts = []; for (let k = 0; k <= 12; k++) { const a = k / 12 * Math.PI; pts.push([x + Math.cos(a) * w, y - Math.sin(a) * h * P.r(0.6, 1.2)]); } P.wash(pts, col, op, 0.04, 0.6, 0.3); } P.mask();
}
function sunDisc(P, x, y, r, col = '#d9442a', op = 200) { P.noMask(); P.circle(x, y, r * 1.5, shade(col, 0.4), 60, null, 1, 0.06); P.circle(x, y, r, col, op, null, 1, 0.02); P.mask(); }
function hills(P, y, amp, col, op = 170, seed = 0, ink = null) {
  const pts = [[-60, 960]]; for (let x = -60; x <= 1660; x += 40) pts.push([x, y - amp * (0.5 + 0.5 * Math.sin(x * 0.004 + seed) * Math.sin(x * 0.0013 + seed * 2)) - P.r(0, amp * 0.15)]); pts.push([1660, 960]);
  P.wash(pts, col, op, 0.015, 0.5, 0.35); if (ink) P.line(pts.slice(1, -1).filter((_, i) => i % 2 === 0), ink, 0.8, 'HB', 0.4); return pts;
}
function ground(P, y, col, op = 200) { P.wash([[-60, y], [1660, y - 10], [1660, 960], [-60, 960]], col, op, 0.01, 0.6, 0.2); }
// massed army: rows of spears, shields and banners receding to the horizon
function army(P, yH, yNear, side, col = '#2a1d16', banner = '#b3202a', density = 1, haze = '#8a6a56') {
  // massed host: crowds of helmets and round shields, a forest of thin spears, banners on tall poles, each rank hazier with distance
  const x0 = side < 0 ? -60 : 880, x1 = side < 0 ? 720 : 1660;
  for (let r = 0; r < 9; r++) {
    const k = r / 8, y = yH + (yNear - yH) * k * k, sz = 0.2 + k * 1.1, tone = mixc(haze, col, 0.2 + k * 0.8);
    const n = Math.floor((x1 - x0) / (13 * sz + 3) * density);
    brush.set('fine', tone, 0.45 + k * 0.8);
    for (let i = 0; i < n * 0.8; i++) { const x = x0 + P.r(0, x1 - x0), h = P.r(50, 95) * sz, lean = P.r(-3, 3) * sz - side * 3 * sz; brush.line(x, y - 4 * sz, x + lean, y - h); P.mline([[x, y], [x + lean, y - h]], 1.2 + sz); }
    brush.reDraw(); brush.reBlend();
    noStroke(); const c = color(tone);
    for (let i = 0; i < n; i++) { const x = x0 + (i + P.r(-0.4, 0.4)) * (x1 - x0) / n, yy = y + P.r(-3, 3) * sz; fill(c); ellipse(x, yy - 12 * sz, 11 * sz, 12 * sz); rect(x - 7 * sz, yy - 7 * sz, 14 * sz, 22 * sz); P.mcirc(x, yy - 6 * sz, 12 * sz);
      if (P.rng() < 0.35) { fill(mixc(tone, side < 0 ? '#6a2a1a' : '#2a3a5a', 0.4)); circle(x + side * -5 * sz, yy + 2 * sz, 14 * sz); } }
    if (r % 2 === 1) for (let i = 0; i < 2 + r; i++) { const x = x0 + P.r(0, x1 - x0), h = 150 * sz, bw = 30 * sz; brush.set('ink', tone, 0.5 + sz * 0.5); brush.line(x, y, x, y - h); P.mline([[x, y], [x, y - h]], 2 * sz);
      const fl = []; for (let q = 0; q < 6; q++) { const kk = q / 5; fl.push([x - side * kk * bw * 1.6, y - h + 4 * sz + Math.sin(kk * 4 + i) * 4 * sz]); }
      P.wash(ribbon(fl, bw * 0.32, bw * 0.12), mixc(haze, i % 3 === 0 ? GOLD : banner, 0.35 + k * 0.65), 190 + k * 60, 0.004, 0.4, 0.3); }
    if (r < 8) { const yb = y + 6 * sz; P.noMask(); P.wash([[x0 - 40, yb - 30 * sz], [x1 + 40, yb - 30 * sz], [x1 + 40, yb + 18], [x0 - 40, yb + 18]], haze, 40 * (1 - k), 0.01, 0.6, 0.2); P.mask(); }
  }
  brush.noStroke();
}
function riverWaves(P, y0, y1, col = '#3d6f8f', ink = '#1f4058') {
  P.wash([[-60, y0], [1660, y0 - 10], [1660, y1], [-60, y1]], col, 170, 0.01, 0.6, 0.2);
  brush.field('waves');
  brush.set('HB', ink, 1); for (let i = 0; i < 26; i++) brush.flowLine(P.r(-100, 1500), P.r(y0 + 10, y1), P.r(150, 400), 0);
  brush.set('pen', '#e8f0f0', 0.8); for (let i = 0; i < 18; i++) brush.flowLine(P.r(-100, 1500), P.r(y0 + 10, y1), P.r(80, 200), 0);
  brush.noField(); brush.noStroke();
}
function palace(P, x, y, w, h, col = '#c98a5a', ink = INK) {
  // Hastinapura: a raised palace hall with carved arches and three curvilinear shikhara towers
  P.shape([[x, y], [x + w, y], [x + w, y - h * 0.45], [x, y - h * 0.45]], col, 210, ink, 1);
  for (let i = 0; i < 7; i++) { const ax = x + w * (0.07 + i * 0.13), aw = w * 0.08; P.shape([[ax, y - 4], [ax + aw, y - 4], [ax + aw, y - h * 0.26], [ax + aw * 0.75, y - h * 0.33], [ax + aw / 2, y - h * 0.36], [ax + aw * 0.25, y - h * 0.33], [ax, y - h * 0.26]], shade(col, -0.45), 220, ink, 0.8); }
  P.shape([[x - w * 0.03, y - h * 0.45], [x + w * 1.03, y - h * 0.45], [x + w * 1.0, y - h * 0.5], [x, y - h * 0.5]], shade(col, 0.2), 210, ink, 1);
  for (const [cx, sc] of [[0.2, 0.6], [0.5, 1], [0.8, 0.6]]) {
    const bx = x + w * cx, by = y - h * 0.5, bw = w * 0.13 * sc, th = h * 0.75 * sc;
    const sp = []; for (let i = 0; i <= 8; i++) { const k = i / 8; sp.push([bx - bw * (1 - Math.pow(k, 1.6) * 0.75), by - th * k]); } for (let i = 8; i >= 0; i--) { const k = i / 8; sp.push([bx + bw * (1 - Math.pow(k, 1.6) * 0.75), by - th * k]); }
    P.shape(sp, shade(col, 0.08), 215, ink, 1);
    for (let i = 1; i < 6; i++) { const k = i / 6, ww = bw * (1 - Math.pow(k, 1.6) * 0.75); P.line([[bx - ww, by - th * k], [bx + ww, by - th * k]], shade(col, -0.35), 0.7, 'ink', 0); }
    P.shape(circlePts(bx, by - th - 6 * sc, bw * 0.38, 14, 1, 0.45), shade(col, 0.15), 220, ink, 0.8);
    P.line([[bx, by - th - 10 * sc], [bx, by - th - 40 * sc]], ink, 1, 'ink', 0); P.dot(bx, by - th - 18 * sc, 4 * sc, GOLD);
    P.wash([[bx, by - th - 40 * sc], [bx + 26 * sc, by - th - 34 * sc], [bx, by - th - 28 * sc]], '#c7362b', 220, 0.004);
  }
}
function flames(P, x, y, w, h, t = 0, cols = ['#7a1408', '#d2361a', '#f08a24', '#fbd56a']) {
  cols.forEach((cl, li) => {
    const k = 1 - li * 0.22; for (let i = 0; i < 6; i++) {
      const fx = x + (i - 2.5) / 5 * w * k, fh = h * k * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7 + t * 3.1 + li))), sw = Math.sin(t * 4 + i * 2 + li) * w * 0.05;
      P.wash([[fx - w * 0.12 * k, y], [fx - w * 0.07 * k, y - fh * 0.4], [fx + sw, y - fh], [fx + w * 0.07 * k, y - fh * 0.45], [fx + w * 0.12 * k, y]], cl, 170, 0.02, 0.4, 0.3);
    }
  });
}
function stars(P, n, col = '#f6efd8', y1 = 900) { for (let i = 0; i < n; i++) P.dot(P.r(0, 1600), P.r(0, y1), P.r(0.6, 2.2), col, P.r(120, 255)); }
function galaxy(P, x, y, r, col, arms = 3, rot = 0) {
  brush.set('spray', col, 1.2);
  for (let a = 0; a < arms; a++) for (let i = 0; i < 70; i++) { const k = i / 70, ang = rot + a * 360 / arms + k * 300, rr = k * r; const px = x + Math.cos(ang * D2R) * rr, py = y + Math.sin(ang * D2R) * rr * 0.55; brush.line(px, py, px + P.r(-6, 6), py + P.r(-3, 3)); }
  brush.noStroke(); P.mcirc(x, y, r);
}
function pillar(P, x, y0, y1, w, col = '#b5774a') {
  P.shape([[x - w / 2, y1], [x + w / 2, y1], [x + w / 2, y0], [x - w / 2, y0]], col, 210, INK, 1);
  for (let i = 0; i < 3; i++) P.line([[x - w / 2 + w * (0.25 + i * 0.25), y0 + 20], [x - w / 2 + w * (0.25 + i * 0.25), y1 - 20]], shade(col, -0.35), 0.7, 'HB', 0);
  P.shape([[x - w * 0.7, y0], [x + w * 0.7, y0], [x + w * 0.55, y0 + 26], [x - w * 0.55, y0 + 26]], GOLD, 210, INK, 1);
  P.shape([[x - w * 0.7, y1], [x + w * 0.7, y1], [x + w * 0.55, y1 - 22], [x - w * 0.55, y1 - 22]], GOLD, 210, INK, 1);
}
function chariot(P, x, y, s, f = 1, col = '#a8742a', t = 0, flag = '#c7362b', emblem = 'monkey') {
  const T = (p) => [x + p[0] * s * f, y + p[1] * s]; const pts = (a) => a.map(T); const iw = Math.max(0.7, s / 300);
  // wheel
  const wc = [-0.05, -0.2], R = 0.2; P.shape(pts(circlePts(wc[0], wc[1], R, 28)), '#4a2a12', 200, INK, iw * 1.4); P.shape(pts(circlePts(wc[0], wc[1], R * 0.82, 28)), '#c79a52', 150, INK, iw);
  for (let i = 0; i < 12; i++) { const a = i * 30 + t * 90; P.line(pts([wc, add(wc, [Math.cos(a * D2R) * R * 0.82, Math.sin(a * D2R) * R * 0.82])]), '#4a2a12', iw * 1.2, 'HB', 0); }
  P.circle(...T(wc), s * 0.03, GOLD, 230, INK, iw);
  // body
  P.shape(pts([[-0.35, -0.38], [0.32, -0.38], [0.4, -0.62], [0.28, -0.58], [-0.3, -0.58], [-0.38, -0.66]]), col, 220, INK, iw * 1.2);
  for (let i = 0; i < 6; i++) P.dot(...T([-0.28 + i * 0.11, -0.48]), s * 0.012, i % 2 ? '#b3202a' : GOLD2);
  P.line(pts([[0.36, -0.42], [0.8, -0.36]]), '#4a2a12', iw * 2.5, 'HB', 0); // pole
  // flagpole and banner
  P.line(pts([[-0.3, -0.6], [-0.3, -1.6]]), '#4a2a12', iw * 1.6, 'HB', 0);
  const fl = []; for (let i = 0; i < 8; i++) { const k = i / 7; fl.push([-0.3 - k * 0.45, -1.56 + k * 0.05 + Math.sin(t * 5 + k * 5) * 0.04 * k]); }
  P.shape(pts(ribbon(fl, 0.09, 0.06)), flag, 210, INK, iw, 0.008);
  if (emblem === 'monkey') { const e = T([-0.48, -1.53]); P.circle(e[0], e[1], s * 0.04, '#e0a43a', 230, INK, iw); }
}
function horse(P, x, y, s, f = 1, t = 0, col = '#efe8da', gallop = 0) {
  const T = (p) => [x + p[0] * s * f, y + p[1] * s]; const pts = (a) => a.map(T); const iw = Math.max(0.7, s / 300);
  const b = Math.sin(t * 9) * 0.03 * gallop;
  const legs = [[-0.32, 0], [-0.22, 1.3], [0.22, 0.6], [0.32, 2]];
  for (const [lx, p] of legs) { const sw = Math.sin(t * 9 + p) * 25 * gallop; const top = [lx, -0.42 + b], kn = add(top, dirv(sw), 0.22), ft = add(kn, dirv(sw * 0.3 - 10 * gallop), 0.22); P.shape(pts(capsule(top, kn, 0.05, 0.03)), shade(col, -0.08), 210, INK, iw); P.shape(pts(capsule(kn, ft, 0.03, 0.025)), shade(col, -0.08), 210, INK, iw); }
  P.shape(pts([[-0.42, -0.45 + b], [-0.38, -0.66 + b], [0.1, -0.7 + b], [0.36, -0.68 + b], [0.42, -0.5 + b], [0.3, -0.4 + b], [-0.3, -0.38 + b]]), col, 215, INK, iw * 1.2);
  P.shape(pts([[0.3, -0.62 + b], [0.42, -0.95 + b], [0.5, -1.02 + b], [0.66, -0.92 + b], [0.68, -0.86 + b], [0.52, -0.84 + b], [0.44, -0.6 + b]]), col, 215, INK, iw * 1.2);
  const mane = []; for (let i = 0; i < 6; i++) { const k = i / 5; mane.push([0.46 - k * 0.2, -1.0 + k * 0.38 + b]); } P.shape(pts(ribbon(mane, 0.03, 0.012)), '#3a2a20', 210, INK, iw);
  P.dot(...T([0.56, -0.94 + b]), s * 0.012, INK); P.line(pts([[0.42, -0.95 + b], [0.36, -0.42 + b]]), '#b3202a', iw * 2, 'gold', 0); // harness
  const tail = []; for (let i = 0; i < 6; i++) { const k = i / 5; tail.push([-0.42 - k * 0.2, -0.6 + b + k * 0.3 + Math.sin(t * 6 + k * 3) * 0.04]); } P.shape(pts(ribbon(tail, 0.03, 0.01)), '#3a2a20', 200, INK, iw);
}
function grain(P, n = 400, col = '#000', op = 25) { brush.set('spray', col, 1); for (let i = 0; i < n; i++) { const x = P.r(0, 1600), y = P.r(0, 900); brush.line(x, y, x + 1, y + 1); } brush.noStroke(); }
