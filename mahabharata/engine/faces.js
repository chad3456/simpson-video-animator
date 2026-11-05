// Faces of the Mahabharata: a painted three-quarter portrait for every character (close-ups, intros,
// dialogue), each with its own face shape, eyes, brows, nose, mouth, hair, crown, marks and jewels.
// portrait(P, who, {x, y, R, f, expr, look, t}) paints a bust; (x, y) is the face centre, R is half the
// face height (hairline to chin = 2R). f = 1 turns the face toward the right of the frame, -1 to the left.
// Expressions: calm, smile, stern, anger, sorrow, fear, awe, divine, speak, cruel.

const FACES = {
  krishna: { skin: '#3a6cb4', W: 0.78, cheek: 0.6, long: 0.95, jaw: 0.15, chin: 0.96, nose: 'fine', eye: 1.12, brow: 'arch', lips: '#b02a3a', stache: null, beard: null, hair: '#0d0a14', hairStyle: 'curls', crown: 'peacock', tilak: 'namam', ear: 'makara', chest: 'vaijayanti', cloth: '#e9b52f', expr: 'smile', sheen: '#9cc6ff' },
  arjuna: { skin: '#9e6a44', W: 0.72, long: 1.0, jaw: 0.35, chin: 0.98, nose: 'straight', eye: 1.0, brow: 'arch', lips: '#8e3a30', stache: 'thin', beard: null, hair: '#16100c', hairStyle: 'curls', crown: 'mukut', tilak: 'line', ear: 'kundala', chest: 'pearls', cloth: '#c7362b', expr: 'stern' },
  yudhi: { skin: '#c08c62', W: 0.74, cheek: 0.2, jaw: 0.3, chin: 1.0, nose: 'straight', eye: 0.92, brow: 'soft', lips: '#8a3e34', stache: 'full', beard: 'short', hair: '#1a120d', hairStyle: 'straight', crown: 'mukutLow', tilak: 'chandan', ear: 'ring', chest: 'pearls', cloth: '#efe7d0', expr: 'calm' },
  bhima: { skin: '#7e4c2e', W: 0.96, cheek: 0.3, long: 1.0, jaw: 0.95, chin: 1.04, nose: 'broad', eye: 0.86, brow: 'heavy', lips: '#7a2e26', stache: 'curl', beard: null, hair: '#100b08', hairStyle: 'wild', crown: 'band', tilak: 'red', ear: 'ring', chest: 'torque', cloth: '#7a2f8a', expr: 'stern', neck: 1.35 },
  nakula: { skin: '#b48058', W: 0.68, jaw: 0.25, chin: 0.97, nose: 'fine', eye: 1.04, brow: 'arch', lips: '#9a3e36', stache: 'thin', beard: null, hair: '#1a120d', hairStyle: 'curls', crown: 'mukutLow', tilak: 'line', ear: 'kundala', chest: 'pearls', cloth: '#2f7a6a', expr: 'calm' },
  sahadeva: { skin: '#ad7b54', W: 0.68, jaw: 0.25, chin: 0.97, nose: 'fine', eye: 1.04, brow: 'arch', lips: '#9a3e36', stache: 'thin', beard: null, hair: '#1a120d', hairStyle: 'curls', crown: 'mukutLow', tilak: 'chandan', ear: 'kundala', chest: 'pearls', cloth: '#5a4a9a', expr: 'calm' },
  karna: { skin: '#c8925c', W: 0.74, long: 1.02, jaw: 0.55, chin: 1.0, nose: 'aquiline', eye: 0.98, brow: 'arch', lips: '#8a3328', stache: 'thin', beard: null, hair: '#1a120d', hairStyle: 'straight', crown: 'sun', tilak: 'sun', ear: 'sun', chest: 'kavacha', cloth: '#a3241e', expr: 'stern' },
  duryo: { skin: '#a0603e', W: 0.8, long: 1.04, jaw: 0.75, chin: 1.02, nose: 'aquiline', eye: 0.9, brow: 'heavyUp', lips: '#6e2622', stache: 'twirl', beard: null, hair: '#0e0a08', hairStyle: 'straight', crown: 'serpent', tilak: 'darkred', ear: 'kundala', chest: 'armour', cloth: '#2c2d55', expr: 'cruel' },
  dushasana: { skin: '#94603c', W: 0.86, cheek: 0.3, jaw: 0.85, chin: 1.0, nose: 'broad', eye: 0.84, brow: 'heavy', lips: '#6a2420', stache: 'twirl', beard: 'stubble', hair: '#0e0a08', hairStyle: 'wild', crown: 'mukutLow', tilak: 'darkred', ear: 'ring', chest: 'armour', cloth: '#5a1a1a', expr: 'cruel' },
  bhishma: { skin: '#c2916a', W: 0.7, long: 1.08, jaw: 0.5, chin: 1.0, nose: 'aquiline', eye: 0.86, brow: 'white', lips: '#8a5048', stache: 'white', beard: 'long', hair: '#f1eee6', hairStyle: 'jata', crown: 'jataBand', tilak: 'tripundra', ear: 'rudra', chest: 'white', cloth: '#ece6d6', expr: 'stern', age: 1 },
  drona: { skin: '#b4885e', W: 0.64, long: 1.12, jaw: 0.4, chin: 1.0, nose: 'aquiline', eye: 0.86, brow: 'whiteFurrow', lips: '#7e4a40', stache: 'grey', beard: 'grey', hair: '#cfcac0', hairStyle: 'jata', crown: 'jata', tilak: 'tripundra', ear: 'rudra', chest: 'rudraksha', cloth: '#e8dcc0', expr: 'stern', age: 1 },
  shakuni: { skin: '#a28058', W: 0.58, long: 1.15, jaw: 0.2, chin: 1.08, nose: 'hook', eye: 0.78, brow: 'sly', lips: '#6a3a30', stache: 'thin', beard: 'goatee', hair: '#2a2420', hairStyle: 'straight', crown: 'turban', tilak: 'none', ear: 'ring', chest: 'pearls', cloth: '#3a5a3a', expr: 'cruel', age: 0.5 },
  abhi: { skin: '#b57c52', W: 0.72, cheek: 0.5, long: 0.92, jaw: 0.15, chin: 0.94, nose: 'fine', eye: 1.1, brow: 'arch', lips: '#a0403a', stache: null, beard: null, hair: '#16100c', hairStyle: 'curls', crown: 'mukut', tilak: 'line', ear: 'kundala', chest: 'pearls', cloth: '#d24a2a', expr: 'stern', young: 1 },
  ashwa: { skin: '#a8784e', W: 0.7, jaw: 0.6, chin: 1.0, nose: 'aquiline', eye: 0.9, brow: 'heavyUp', lips: '#7a3028', stache: 'thin', beard: 'stubble', hair: '#120d0a', hairStyle: 'jata', crown: 'jata', tilak: 'gem', ear: 'rudra', chest: 'rudraksha', cloth: '#6a3a1a', expr: 'anger' },
  dhrita: { skin: '#b68a64', W: 0.8, cheek: 0.3, jaw: 0.55, chin: 1.0, nose: 'straight', eye: 0.9, brow: 'whiteSoft', lips: '#80483e', stache: 'grey', beard: 'full', hair: '#bdb6aa', hairStyle: 'straight', crown: 'royal', tilak: 'chandan', ear: 'kundala', chest: 'pearls', cloth: '#6a1a2a', expr: 'sorrow', blind: 1, age: 1 },
  shantanu: { skin: '#b9875c', W: 0.73, jaw: 0.45, chin: 1.0, nose: 'straight', eye: 0.96, brow: 'soft', lips: '#8a3e34', stache: 'full', beard: 'short', hair: '#1c140e', hairStyle: 'straight', crown: 'royal', tilak: 'chandan', ear: 'kundala', chest: 'pearls', cloth: '#7a1a2a', expr: 'calm' },
  vidura: { skin: '#b08660', W: 0.68, jaw: 0.35, chin: 1.0, nose: 'straight', eye: 0.9, brow: 'whiteSoft', lips: '#7e4a40', stache: 'grey', beard: 'short', hair: '#a8a298', hairStyle: 'jata', crown: 'jata', tilak: 'chandan', ear: 'rudra', chest: 'rudraksha', cloth: '#d8c8a0', expr: 'calm', age: 1 },
  draupadi: { skin: '#7a4c32', W: 0.7, cheek: 0.4, jaw: 0.05, chin: 0.95, nose: 'fine', eye: 1.16, brow: 'arch', lips: '#a3202e', stache: null, beard: null, hair: '#0c0808', hairStyle: 'woman', crown: 'tikka', tilak: 'bindi', ear: 'jhumka', chest: 'necklace', cloth: '#b3202a', female: 1, nath: 1, expr: 'stern' },
  kunti: { skin: '#b88a62', W: 0.7, cheek: 0.2, jaw: 0.1, chin: 0.95, nose: 'fine', eye: 1.0, brow: 'arch', lips: '#8a3a3a', stache: null, beard: null, hair: '#3a302a', hairStyle: 'woman', crown: 'veil', veil: '#f2ede0', tilak: 'none', ear: 'jhumka', chest: 'white', cloth: '#f2ede0', female: 1, expr: 'sorrow', age: 0.6 },
  gandhari: { skin: '#c4946a', W: 0.67, jaw: 0.1, chin: 0.95, nose: 'fine', eye: 1.0, brow: 'arch', lips: '#8a3a3a', stache: null, beard: null, hair: '#2a201a', hairStyle: 'woman', crown: 'veil', veil: '#e9dcbc', tilak: 'bindi', ear: 'jhumka', chest: 'necklace', cloth: '#7a5a2a', female: 1, blindfold: '#1f2a44', expr: 'calm', age: 0.5 },
  ganga: { skin: '#c8a07e', W: 0.7, cheek: 0.4, jaw: 0.05, chin: 0.95, nose: 'fine', eye: 1.12, brow: 'arch', lips: '#a3303a', stache: null, beard: null, hair: '#16203a', hairStyle: 'woman', crown: 'goddess', tilak: 'bindi', ear: 'jhumka', chest: 'necklace', cloth: '#2f6f9a', female: 1, expr: 'calm', sheen: '#bfe6ff' },
  satyavati: { skin: '#94603e', W: 0.7, cheek: 0.4, jaw: 0.08, chin: 0.95, nose: 'fine', eye: 1.08, brow: 'arch', lips: '#a3283a', stache: null, beard: null, hair: '#0e0a08', hairStyle: 'woman', crown: 'flowers', tilak: 'bindi', ear: 'jhumka', chest: 'necklace', cloth: '#2f8a6a', female: 1, nath: 1, expr: 'calm' },
  shikhandi: { skin: '#a9784e', W: 0.67, jaw: 0.25, chin: 0.96, nose: 'fine', eye: 1.04, brow: 'arch', lips: '#9a3440', stache: null, beard: null, hair: '#120d0a', hairStyle: 'straight', crown: 'mukutLow', tilak: 'bindi', ear: 'jhumka', chest: 'armour', cloth: '#8a2a5a', expr: 'stern' },
  jayadratha: { skin: '#a27350', W: 0.74, jaw: 0.6, chin: 1.0, nose: 'broad', eye: 0.86, brow: 'heavy', lips: '#6e2a22', stache: 'twirl', beard: 'short', hair: '#120d0a', hairStyle: 'straight', crown: 'mukutLow', tilak: 'darkred', ear: 'ring', chest: 'armour', cloth: '#3a3a6a', expr: 'cruel' },
  devavrata: { skin: '#b9875c', W: 0.72, long: 1.02, jaw: 0.5, chin: 1.0, nose: 'aquiline', eye: 1.0, brow: 'arch', lips: '#8e3a30', stache: 'thin', beard: null, hair: '#16100c', hairStyle: 'curls', crown: 'mukut', tilak: 'chandan', ear: 'kundala', chest: 'pearls', cloth: '#ece6d6', expr: 'stern' },
  shiva: { skin: '#7d8fa8', W: 0.74, cheek: 0.3, jaw: 0.4, chin: 1.0, nose: 'straight', eye: 1.05, brow: 'arch', lips: '#7a3a44', stache: null, beard: null, hair: '#2a2430', hairStyle: 'jata', crown: 'shiva', tilak: 'third', ear: 'rudra', chest: 'serpent', cloth: '#6a4a2a', expr: 'divine', sheen: '#c8e0ff' },
  dharma: { skin: '#c99a5a', W: 0.74, cheek: 0.3, jaw: 0.4, chin: 1.0, nose: 'straight', eye: 1.0, brow: 'soft', lips: '#8a3a30', stache: 'full', beard: 'short', hair: '#1a120d', hairStyle: 'straight', crown: 'royal', tilak: 'chandan', ear: 'kundala', chest: 'pearls', cloth: '#f0c040', expr: 'divine', sheen: '#fff0b0' },
  indra: { skin: '#d0a27a', W: 0.74, jaw: 0.45, chin: 1.0, nose: 'straight', eye: 1.0, brow: 'arch', lips: '#9a3e36', stache: 'thin', beard: null, hair: '#1a120d', hairStyle: 'curls', crown: 'royal', tilak: 'line', ear: 'kundala', chest: 'pearls', cloth: '#3a6ab0', expr: 'calm' },
};

// expression presets: brow angle (+ = inner ends down / anger), brow lift, eye openness, mouth curve, mouth open
const EXPR = {
  calm: { ba: 0, bl: 0, eo: 1, mc: 0.01, mo: 0 }, smile: { ba: -0.01, bl: 0.01, eo: 0.92, mc: 0.05, mo: 0.0 },
  stern: { ba: 0.035, bl: -0.01, eo: 0.95, mc: -0.005, mo: 0 }, anger: { ba: 0.08, bl: -0.02, eo: 1.08, mc: -0.03, mo: 0.06, teeth: 1 },
  sorrow: { ba: -0.06, bl: 0.02, eo: 0.78, mc: -0.03, mo: 0 }, fear: { ba: -0.05, bl: 0.05, eo: 1.25, mc: -0.02, mo: 0.05 },
  awe: { ba: -0.04, bl: 0.05, eo: 1.2, mc: 0, mo: 0.05 }, divine: { ba: -0.01, bl: 0.01, eo: 0.82, mc: 0.035, mo: 0 },
  speak: { ba: 0.01, bl: 0, eo: 1, mc: 0, mo: 0.035 }, cruel: { ba: 0.05, bl: -0.01, eo: 0.82, mc: 0.03, mo: 0, sneer: 1 },
  roar: { ba: 0.1, bl: -0.02, eo: 1.15, mc: -0.02, mo: 0.16, teeth: 1 },
};

function chaikin(pts, it = 2, closed = true) {
  for (let k = 0; k < it; k++) { const o = []; const n = pts.length; for (let i = 0; i < (closed ? n : n - 1); i++) { const a = pts[i], b = pts[(i + 1) % n]; o.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } if (!closed) { o.unshift(pts[0]); o.push(pts[n - 1]); } pts = o; }
  return pts;
}
function portrait(P, who, o = {}) {
  const c = Object.assign({}, FACES[who] || FACES.arjuna, o.style || {});
  const x = o.x ?? 800, y = o.y ?? 420, R = o.R ?? 200, f = o.f ?? 1, t = o.t || 0;
  const E = Object.assign({}, EXPR[o.expr || c.expr || 'calm'], o.exprOver || {});
  const W = c.W, tilt = (o.tilt || 0) * D2R;
  const ct = Math.cos(tilt), st = Math.sin(tilt);
  const Q = (u, v) => { const a = u * W, b = v; return [x + (a * ct - b * st) * R * f, y + (a * st + b * ct) * R]; };   // u in face widths, v in half heights
  const QQ = (arr) => arr.map(p => Q(p[0], p[1]));
  const iw = Math.max(0.9, R / 70);                   // ink width
  const skin = c.skin, skD = shade(skin, -0.28), skL = shade(skin, 0.22);
  const mu = 0.3;                                     // facial midline (3/4 view)
  P.solid = true; P.noSilhouette();
  const wind = o.wind ?? 0.4, ph = t * 1.6 + (o.phase || 0);

  // ---------- behind the head: halo, back hair, veil ----------
  if (o.halo) { const hc = Q(-0.1, -0.5); for (let i = 0; i < 3; i++) P.wash(circlePts(hc[0], hc[1], R * (2.1 - i * 0.35), 48), i ? GOLD2 : '#f6e2a0', 90 + i * 30, 0.02, 0.3, 0.2); P.line(arcPts(hc[0], hc[1], R * 1.75, 0, 360, 72), GOLD, iw * 1.6, 'gold', 0.5); }
  if (c.crown === 'sun') { const hc = Q(0.05, -0.9); for (let i = 0; i < 28; i++) { const a = i * 360 / 28 * D2R, r0 = R * 0.95, r1 = R * (i % 2 ? 1.7 : 2.05); P.shape([[hc[0] + Math.cos(a - 0.06) * r0, hc[1] + Math.sin(a - 0.06) * r0], [hc[0] + Math.cos(a) * r1, hc[1] + Math.sin(a) * r1], [hc[0] + Math.cos(a + 0.06) * r0, hc[1] + Math.sin(a + 0.06) * r0]], i % 2 ? '#e9a21f' : GOLD2, 230, '#8a4a10', iw * 0.6, 0.004); } P.circle(hc[0], hc[1], R * 1.0, '#f6c94a', 235, '#8a4a10', iw); }
  if (c.crown === 'veil') {
    P.shape(QQ([[-1.35, -0.5], [-0.9, -1.3], [0.0, -1.42], [0.85, -1.15], [1.05, -0.5], [1.0, 0.3], [1.35, 1.4], [1.9, 2.6], [-2.0, 2.6], [-1.6, 1.4], [-1.5, 0.4]]), c.veil, 235, INK, iw, 0.006, 0.35);
    for (let i = 0; i < 5; i++) P.line(QQ([[-1.2 + i * 0.12, -0.2], [-1.4 + i * 0.1, 1.0], [-1.7 + i * 0.12, 2.5]]), shade(c.veil, -0.18), iw * 0.8, 'fine', 0.5);
  }
  const hs = c.hairStyle;
  if (hs === 'curls' || hs === 'straight' || hs === 'wild' || hs === 'woman') {
    const len = hs === 'woman' ? 3.0 : hs === 'wild' ? 1.7 : 2.2, spread = hs === 'wild' ? 1.5 : 1.0;
    const sw = (k) => Math.sin(ph + k * 3) * 0.06 * k * wind;
    const back = [], curl = hs === 'curls' || hs === 'wild' ? 0.07 : 0.025;
    for (let i = 0; i <= 16; i++) { const k = i / 16, a = (-100 - k * 95) * D2R; const rx = 1.0 * spread + 0.12 * k, ry = 1.15; let u = Math.cos(a) * rx * 1.05 - 0.05, v = -0.05 + Math.sin(a) * ry * -1 * -1; if (k > 0.5) { u = -1.15 * spread + sw(k) - (k - 0.5) * 0.2; v = -0.1 + (k - 0.5) / 0.5 * len; } u -= Math.sin(k * 23) * curl; back.push([u, v]); }
    back.push([-0.85 + sw(1), len + 0.05], [-0.45, len * 0.9], [-0.58, 0.9], [-0.66, 0.2], [-0.4, -0.3]);
    if (c.crown !== 'veil') P.shape(chaikin(QQ(back), 2), c.hair, 235, INK, iw, 0.006, 0.3);
    if (hs === 'woman' && c.crown !== 'veil') { // a long braid / open hair over the far shoulder too
      P.shape(chaikin(QQ([[0.7, -0.6], [1.0, -0.2], [1.02, 0.6], [1.0, 1.7 + sw(1)], [0.85, 2.3], [0.72, 1.5], [0.76, 0.5], [0.62, -0.1]]), 2), c.hair, 235, INK, iw, 0.006, 0.3);
    }
    if (hs === 'curls' || hs === 'wild') for (let i = 0; i < (hs === 'wild' ? 9 : 6); i++) {
      const k = i / 5, cx0 = -0.95 * spread + (i % 2) * 0.18 + sw(k), cy0 = -0.4 + i * 0.32;
      const lc = Q(cx0, cy0); P.line(arcPts(lc[0], lc[1], R * 0.11, 30, 330, 10), shade(c.hair, 0.3), iw * 0.8, 'fine', 0.5);
    }
    for (let i = 0; i < 5; i++) P.line(QQ([[-0.6 - i * 0.12, -0.7], [-0.95 - i * 0.07, 0.2], [-0.9 - i * 0.08 + sw(1), len * 0.85]]), shade(c.hair, 0.22), iw * 0.6, 'fine', 0.5);
  }
  if (hs === 'jata') { // matted hair falling behind, top knot drawn with the crown
    P.shape(QQ([[-0.5, -0.95], [-1.0, -0.6], [-1.08, 0.3], [-1.0, 1.0], [-0.7, 1.1], [-0.65, 0.3], [-0.45, -0.3]]), c.hair, 235, INK, iw, 0.006, 0.3);
    for (let i = 0; i < 4; i++) P.line(QQ([[-0.62 - i * 0.1, -0.6], [-0.85 - i * 0.05, 0.3], [-0.8 - i * 0.05, 1.0]]), shade(c.hair, c.age ? -0.2 : 0.25), iw * 0.6, 'fine', 0.5);
  }

  // ---------- neck, shoulders, chest ----------
  const nk = c.neck || 1;
  const shoulderW = (c.female ? 2.0 : 2.5) * nk;
  const ny = c.female ? 1.45 : 1.3;
  P.shape(chaikin(QQ([[-0.55 * nk, 0.5], [-0.58 * nk, ny], [-shoulderW * 0.6, ny + 0.2], [-shoulderW * 0.92, ny + 0.36], [-shoulderW * 1.08, ny + 0.7], [-shoulderW * 1.12, 3.2], [shoulderW * 0.98, 3.2], [shoulderW * 0.98, ny + 0.8], [shoulderW * 0.82, ny + 0.36], [shoulderW * 0.5, ny + 0.18], [0.45 * nk, ny - 0.02], [0.42 * nk, 0.6]]), 2), skin, 230, INK, iw, 0.006, 0.3);
  P.wash(QQ([[-0.6 * nk, 0.6], [0.45 * nk, 0.7], [0.42 * nk, 1.15], [-0.1, 1.05], [-0.6 * nk, 1.2]]), skD, 150, 0.02, 0.3, 0.2);   // throat shadow under the jaw
  if (!c.female) P.line(QQ([[-0.4 * nk, 1.75], [0.05, 1.9], [0.5, 1.75]]), skD, iw * 0.8, 'fine', 0.5);   // collarbone
  chest(P, c, Q, QQ, iw, R, shoulderW, t);

  // ---------- ear (near side) ----------
  const earC = [-0.95, 0.02];
  P.shape(QQ([[-0.86, -0.22], [-1.02, -0.2], [-1.08, -0.02], [-1.03, 0.2], [-0.92, 0.28], [-0.84, 0.18]]), skin, 230, INK, iw * 0.9, 0.005);
  P.line(QQ([[-0.9, -0.12], [-1.0, -0.08], [-1.0, 0.08], [-0.92, 0.16]]), skD, iw * 0.7, 'fine', 0.5);

  // ---------- face ----------
  const J = c.jaw, CH = c.chin, LG = c.long || 1, CF = c.cheek || 0;
  const lv = (v) => v > 0.2 ? 0.2 + (v - 0.2) * LG : v;
  const face = [[0.0, -1.02], [0.42, -0.97], [0.74, -0.72], [0.84, -0.38], [0.79, -0.19], [0.84, 0.02], [0.78 + CF * 0.05, 0.38], [0.6 - 0.04 * J + CF * 0.04, 0.7], [0.36 + 0.06 * J, 0.93 * CH], [0.18 + 0.06 * J, 1.0 * CH], [-0.04 - 0.08 * J, 1.0 * CH], [-0.32 - 0.12 * J, 0.9 * CH], [-0.64 - 0.14 * J - CF * 0.05, 0.62 + 0.04 * J], [-0.86 - 0.04 * J - CF * 0.06, 0.28], [-0.91, -0.1], [-0.87, -0.5], [-0.62, -0.88]].map(p => [p[0], lv(p[1])]);
  P.shape(chaikin(QQ(face), 2), skin, 235, INK, iw, 0.005, 0.25);
  // modelling: shadow down the near cheek and under the cheekbone, light on the far plane and brow
  P.wash(QQ([[-0.88, -0.35], [-0.6, -0.3], [-0.5, 0.05], [-0.42, 0.4], [-0.25, 0.85 * CH], [-0.55 - 0.1 * J, 0.62], [-0.86, 0.3]]), skD, 110, 0.03, 0.3, 0.2);
  P.wash(QQ([[0.1, -0.85], [0.55, -0.7], [0.62, -0.42], [0.28, -0.4], [0.0, -0.55]]), skL, 90, 0.03, 0.3, 0.2);
  P.wash(QQ([[0.4, 0.0], [0.7, -0.05], [0.68, 0.32], [0.48, 0.42]]), skL, 70, 0.03, 0.3, 0.2);
  if (c.sheen) { P.wash(QQ([[0.15, -0.8], [0.5, -0.6], [0.4, -0.45], [0.1, -0.6]]), c.sheen, 70, 0.03, 0.3, 0.2); P.wash(QQ([[0.38, 0.05], [0.6, 0.0], [0.55, 0.25]]), c.sheen, 60, 0.03, 0.3, 0.2); }
  if (c.female || c.young) P.wash(circlePts(...Q(-0.42, 0.28), R * 0.2, 16, W, 0.75), '#d0605a', 45, 0.03, 0.3, 0.2);
  // age: forehead lines, crow's feet, folds
  if (c.age) {
    const k = c.age;
    for (let i = 0; i < 3; i++) P.line(QQ([[-0.55, -0.62 + i * 0.08], [0.0, -0.68 + i * 0.08], [0.5, -0.6 + i * 0.08]]), skD, iw * 0.6 * k, 'fine', 0.5);
    P.line(QQ([[0.12, 0.38], [-0.05, 0.55], [-0.08, 0.72]]), skD, iw * 0.9 * k, 'fine', 0.5);
    for (let i = 0; i < 2; i++) P.line(QQ([[-0.66, -0.16 + i * 0.06], [-0.78, -0.12 + i * 0.1]]), skD, iw * 0.6 * k, 'fine', 0.5);
  }

  // ---------- eyes ----------
  const eo = E.eo * (o.blink ? 0.08 : 1);
  const lookU = (o.look ?? 0.2);
  eye(P, c, Q, QQ, iw, R, -0.34, -0.14, 0.26 * c.eye, 0.1 * c.eye * eo, -1, lookU, E);   // near eye, outer corner toward the ear
  eye(P, c, Q, QQ, iw, R, 0.56, -0.14, 0.17 * c.eye, 0.095 * c.eye * eo, 1, lookU, E);      // far eye, foreshortened
  if (c.blindfold) {
    P.shape(QQ([[-0.92, -0.32], [-0.2, -0.36], [0.5, -0.33], [0.83, -0.3], [0.8, -0.02], [0.4, -0.02], [-0.2, -0.0], [-0.9, 0.02]]), c.blindfold, 240, INK, iw, 0.004);
    P.shape(QQ([[-0.9, -0.2], [-1.25, -0.35], [-1.35, 0.2], [-1.1, 0.4], [-0.95, 0.05]]), c.blindfold, 240, INK, iw * 0.8, 0.004);
    P.line(QQ([[-0.85, -0.17], [0.0, -0.2], [0.8, -0.17]]), shade(c.blindfold, 0.3), iw * 0.6, 'fine', 0.4);
  }
  // brows
  brow(P, c, Q, QQ, iw, -1, E); brow(P, c, Q, QQ, iw, 1, E);

  // ---------- nose ----------
  const nz = c.nose, bump = nz === 'aquiline' ? 0.05 : nz === 'hook' ? 0.08 : 0, wide = nz === 'broad' ? 1.35 : nz === 'fine' ? 0.85 : 1;
  const tipU = mu + 0.17 + bump * 0.6, tipV = 0.33;
  P.wash(QQ([[mu - 0.08, -0.12], [mu + 0.0, 0.18], [mu - 0.1 * wide, 0.34], [mu - 0.18 * wide, 0.12]]), skD, 90, 0.03, 0.3, 0.2);
  P.line(QQ([[mu - 0.06, -0.16], [mu + 0.02 + bump, 0.0], [mu + 0.1 + bump * 0.6, 0.2], [tipU, tipV], [tipU - 0.03, tipV + 0.05]]), INK, iw * 0.9, 'ink', 0.5);
  if (nz === 'hook') P.line(QQ([[tipU, tipV], [tipU - 0.02, tipV + 0.1], [tipU - 0.08, tipV + 0.08]]), INK, iw * 0.9, 'ink', 0.4);
  P.line(QQ([[mu - 0.1 * wide, 0.28], [mu - 0.15 * wide, 0.36], [mu - 0.08 * wide, 0.41], [mu + 0.02, 0.39]]), INK, iw * 0.9, 'ink', 0.5);   // nostril wing
  P.dot(...Q(mu + 0.06, 0.39), Math.max(1, R * 0.012 * wide), shade(skin, -0.55), 220);
  if (c.nath) { const np = Q(mu - 0.05, 0.42); P.line(arcPts(np[0], np[1] + R * 0.06, R * 0.07, -100, 200, 14), GOLD2, iw * 1.1, 'gold', 0.5); P.dot(np[0] - R * 0.05 * f, np[1] + R * 0.12, R * 0.012, '#f6f1e4'); }

  // ---------- moustache, beard ----------
  facialHair(P, c, Q, QQ, iw, R, mu, E);
  // ---------- mouth ----------
  mouth(P, c, Q, QQ, iw, R, mu, E, o);

  // ---------- forehead mark ----------
  mark(P, c, Q, QQ, iw, R, mu, t);
  // ---------- earring ----------
  earring(P, c, Q, iw, R, t);
  // ---------- hair front + crown ----------
  crown(P, c, Q, QQ, iw, R, t, wind);
  P.solid = false;
  return { eyes: [Q(-0.34, -0.14), Q(0.56, -0.14)], mouth: Q(mu - 0.02, 0.62), top: Q(0, -1.0), R };
}

function eye(P, c, Q, QQ, iw, R, eu, ev, hw, h, s, look, E) {
  // lotus eye: almond with a long upswept outer corner; s = +1 when the outer corner points to +u
  const pts = [[eu - s * hw, ev + 0.01], [eu - s * hw * 0.35, ev - h], [eu + s * hw * 0.45, ev - h * 0.9], [eu + s * hw * 1.08, ev - 0.03], [eu + s * hw * 0.45, ev + h * 0.6], [eu - s * hw * 0.4, ev + h * 0.55]];
  const white = c.blind ? '#e8e2d6' : '#f6f1e4';
  P.shape(QQ(pts), white, 245, null, iw, 0.003, 0.1);
  if (!c.blind && h > 0.02) {
    const ir = Math.min(h * 0.95 * R, hw * 0.5 * c.W * R), ic = Q(eu + look * hw * 0.3, ev - h * 0.05);
    P.circle(ic[0], ic[1], ir, c.iris || '#3a2416', 250, null);
    P.circle(ic[0], ic[1], ir * 0.55, '#0a0605', 255, null);
    P.dot(ic[0] + ir * 0.3, ic[1] - ir * 0.35, Math.max(1, ir * 0.24), '#ffffff', 255);
    // lids over the iris overflow
    const up = [pts[0], pts[1], pts[2], pts[3]];
    P.shape(QQ(up.concat([[eu + s * hw * 1.1, ev - h - 0.1], [eu - s * hw * 1.1, ev - h - 0.12]])), c.skin, 250, null, 0, 0.002, 0.1);
    const lo = [pts[3], pts[4], pts[5], pts[0]];
    P.shape(QQ(lo.concat([[eu - s * hw * 1.1, ev + h + 0.1], [eu + s * hw * 1.1, ev + h + 0.08]])), c.skin, 250, null, 0, 0.002, 0.1);
  }
  // upper lid crease, kohl line with tail, lower lid
  P.line(QQ([[eu - s * hw * 0.8, ev - h - 0.04], [eu + s * hw * 0.2, ev - h - 0.07], [eu + s * hw * 0.95, ev - 0.06]]), shade(c.skin, -0.35), iw * 0.7, 'fine', 0.5);
  P.line(QQ([pts[0], pts[1], pts[2], pts[3], [eu + s * hw * 1.32, ev - 0.08]]), INK, iw * 1.9, 'ink', 0.5);
  P.line(QQ([pts[3], pts[4], pts[5], pts[0]]), INK, iw * 0.8, 'ink', 0.5);
  if (E.sorrow || (E.ba < -0.05)) P.line(QQ([[eu - s * hw * 0.3, ev + h + 0.06], [eu + s * hw * 0.3, ev + h + 0.07]]), shade(c.skin, -0.3), iw * 0.6, 'fine', 0.5);
}

function brow(P, c, Q, QQ, iw, side, E) {
  const near = side < 0;
  const inner = near ? [0.1, -0.33] : [0.42, -0.33], outer = near ? [-0.68, -0.36] : [0.8, -0.33];
  const peak = near ? [-0.35, -0.46] : [0.62, -0.44];
  const ba = E.ba, bl = E.bl;
  inner[1] += ba - bl; outer[1] -= ba * 0.4 + bl; peak[1] -= bl;
  const b = c.brow;
  const thick = b === 'heavy' || b === 'heavyUp' ? 0.055 : b === 'white' || b === 'whiteFurrow' ? 0.05 : b === 'sly' ? 0.022 : 0.032;
  const col = b.startsWith('white') ? '#ebe6dc' : c.hair === '#f1eee6' ? '#ebe6dc' : '#120c0a';
  if (b === 'heavyUp') outer[1] -= 0.06;
  if (b === 'sly') { peak[1] -= 0.04; outer[1] -= 0.02; }
  const line = [inner, peak, outer];
  P.shape(QQ(ribbon(line, thick * (near ? 1 : 0.8), thick * 0.35)), col, 240, b.startsWith('white') ? '#6a6058' : null, iw * 0.5, 0.004, 0.2);
  if (b === 'whiteFurrow' || E.ba > 0.06) P.line(QQ([[mu0(near) - 0.02, -0.42], [mu0(near), -0.3]]), shade(c.skin, -0.35), iw * 0.8, 'fine', 0.5);
}
function mu0(near) { return 0.24; }

function facialHair(P, c, Q, QQ, iw, R, mu, E) {
  const hc = c.stache === 'white' ? '#efebe3' : c.stache === 'grey' ? '#c8c2b8' : c.hair;
  const by = 0.5, bx = mu - 0.02;
  if (c.beard === 'stubble') P.wash(QQ([[-0.7, 0.45], [-0.3, 0.55], [bx + 0.35, 0.55], [0.55, 0.7], [0.2, 1.0], [-0.3, 0.9], [-0.62, 0.62]]), shade(c.skin, -0.4), 90, 0.04, 0.6, 0.3);
  if (c.beard === 'short' || c.beard === 'full') {
    const L = c.beard === 'full' ? 1.45 : 1.22;
    P.shape(chaikin(QQ([[-0.84, 0.15], [-0.75, 0.55], [-0.4, 0.8], [bx - 0.2, 0.72], [bx + 0.42, 0.7], [0.62, 0.62], [0.55, 0.95], [0.2, L], [-0.2, L - 0.05], [-0.62, 0.9], [-0.86, 0.45]]), 2), hc, 240, INK, iw * 0.8, 0.005, 0.3);
    for (let i = 0; i < 7; i++) P.line(QQ([[-0.6 + i * 0.16, 0.72], [-0.55 + i * 0.15, 0.95], [-0.45 + i * 0.13, L - 0.08]]), shade(hc, hc === c.hair ? 0.25 : -0.25), iw * 0.6, 'fine', 0.5);
  }
  if (c.beard === 'long' || c.beard === 'grey') {
    const L = c.beard === 'long' ? 2.5 : 2.1;
    P.shape(chaikin(QQ([[-0.86, 0.1], [-0.78, 0.55], [-0.4, 0.78], [bx + 0.42, 0.7], [0.66, 0.58], [0.6, 1.05], [0.42, 1.6], [0.12, L], [-0.1, L - 0.15], [-0.45, 1.5], [-0.75, 0.95]]), 2), hc, 245, '#6a6058', iw * 0.8, 0.005, 0.3);
    for (let i = 0; i < 9; i++) P.line(QQ([[-0.62 + i * 0.13, 0.8], [-0.5 + i * 0.11, 1.4], [-0.15 + i * 0.05, L - 0.2]]), shade(hc, -0.22), iw * 0.6, 'fine', 0.5);
  }
  if (c.beard === 'goatee') {
    P.shape(QQ([[bx - 0.2, 0.86], [bx + 0.15, 0.86], [bx + 0.1, 1.25], [bx - 0.05, 1.45], [bx - 0.12, 1.2]]), hc, 240, INK, iw * 0.8, 0.005);
    for (let i = 0; i < 3; i++) P.line(QQ([[bx - 0.12 + i * 0.08, 0.92], [bx - 0.08 + i * 0.05, 1.3]]), shade(hc, 0.3), iw * 0.5, 'fine', 0.5);
  }
  // moustache: two wings from under the nose
  const st = c.stache; if (!st) return;
  const nearW = { thin: [[bx - 0.02, by], [bx - 0.25, by + 0.03], [bx - 0.45, by + 0.0], [bx - 0.52, by - 0.06]], curl: [[bx - 0.02, by - 0.02], [bx - 0.3, by + 0.06], [bx - 0.58, by + 0.02], [bx - 0.7, by - 0.12], [bx - 0.62, by - 0.2]], twirl: [[bx - 0.02, by], [bx - 0.3, by + 0.05], [bx - 0.55, by - 0.04], [bx - 0.66, by - 0.24]], full: [[bx - 0.02, by], [bx - 0.28, by + 0.06], [bx - 0.45, by + 0.14]], white: [[bx - 0.02, by], [bx - 0.3, by + 0.08], [bx - 0.5, by + 0.22]], grey: [[bx - 0.02, by], [bx - 0.28, by + 0.08], [bx - 0.46, by + 0.2]] }[st];
  const farW = nearW.map(p => [bx + (bx - p[0]) * 0.55, p[1]]);
  const w0 = st === 'thin' ? 0.03 : st === 'curl' ? 0.075 : st === 'twirl' ? 0.055 : 0.065;
  for (const L of [nearW, farW]) P.shape(QQ(ribbon(L, w0, w0 * 0.25)), hc, 245, st === 'white' || st === 'grey' ? '#6a6058' : null, iw * 0.5, 0.004);
}

function mouth(P, c, Q, QQ, iw, R, mu, E, o) {
  const mx = mu - 0.04, my = 0.64, wn = c.female ? 0.26 : 0.3, wf = 0.17, curve = E.mc;
  const open = (E.mo || 0) + (o.talk ? Math.abs(Math.sin((o.t || 0) * 11)) * 0.05 : 0);
  const sneer = E.sneer ? 0.035 : 0;
  const L = [mx - wn, my - curve], Rr = [mx + wf, my - curve * 0.8 - sneer];
  const up = [L, [mx - wn * 0.5, my - 0.05], [mx - 0.02, my - 0.035], [mx + 0.02, my - 0.045], [mx + wf * 0.6, my - 0.04 - sneer * 0.5], Rr, [mx, my + open * 0.3]];
  const lo = [L, [mx, my + open * 0.3], Rr, [mx + wf * 0.4, my + 0.07 + open], [mx - wn * 0.4, my + 0.075 + open]];
  if (open > 0.02) {
    P.shape(QQ([L, [mx - wn * 0.4, my - 0.02], [mx + wf * 0.5, my - 0.02 - sneer], Rr, [mx + wf * 0.4, my + open + 0.02], [mx - wn * 0.4, my + open + 0.03]]), '#2a0a08', 250, null, 0, 0.002);
    if (E.teeth) P.shape(QQ([[mx - wn * 0.6, my - 0.015], [mx + wf * 0.6, my - 0.02], [mx + wf * 0.5, my + 0.03], [mx - wn * 0.5, my + 0.035]]), '#f2ece0', 250, null, 0, 0.002);
  }
  P.shape(QQ(lo), c.lips, 235, null, 0, 0.003, 0.2);
  P.shape(QQ(up.slice(0, 6)), shade(c.lips, -0.15), 235, null, 0, 0.003, 0.2);
  P.line(QQ([L, [mx - wn * 0.4, my + 0.005 + open * 0.2], [mx, my + 0.01 + open * 0.3], [mx + wf * 0.5, my + open * 0.2 - sneer * 0.5], Rr]), INK, iw * 1.0, 'ink', 0.5);
  if (E.mc > 0.025) { P.line(QQ([[L[0] - 0.04, L[1] - 0.04], [L[0] - 0.03, L[1] + 0.03]]), shade(c.skin, -0.35), iw * 0.7, 'fine', 0.5); }
  P.dot(...Q(mx - 0.02, my + 0.16), Math.max(1, R * 0.02), shade(c.skin, -0.18), 120);  // under-lip shadow
}

function mark(P, c, Q, QQ, iw, R, mu, t) {
  const fx = mu - 0.05, fy = -0.55, m = c.tilak;
  if (m === 'namam') { P.shape(QQ([[fx - 0.13, -0.78], [fx - 0.08, -0.78], [fx - 0.05, -0.42], [fx + 0.05, -0.42], [fx + 0.08, -0.78], [fx + 0.13, -0.78], [fx + 0.09, -0.34], [fx - 0.09, -0.34]]), '#f6f1e4', 245, null, 0, 0.002); P.shape(QQ([[fx - 0.025, -0.8], [fx + 0.025, -0.8], [fx + 0.02, -0.38], [fx - 0.02, -0.38]]), '#c1121f', 250, null, 0, 0.002); }
  if (m === 'line') P.shape(QQ([[fx - 0.02, -0.72], [fx + 0.02, -0.72], [fx + 0.015, -0.42], [fx - 0.015, -0.42]]), '#c1121f', 245, null, 0, 0.002);
  if (m === 'red') P.shape(QQ([[fx - 0.04, -0.75], [fx + 0.04, -0.75], [fx + 0.03, -0.4], [fx - 0.03, -0.4]]), '#c1121f', 245, null, 0, 0.002);
  if (m === 'darkred') { P.shape(QQ([[fx - 0.05, -0.74], [fx + 0.05, -0.74], [fx + 0.0, -0.4]]), '#6a0a10', 245, null, 0, 0.002); }
  if (m === 'chandan') { P.shape(QQ([[fx - 0.03, -0.74], [fx + 0.03, -0.74], [fx + 0.025, -0.44], [fx - 0.025, -0.44]]), '#f0d9a0', 240, null, 0, 0.002); P.dot(...Q(fx, -0.5), R * 0.025, '#c1121f', 250); }
  if (m === 'tripundra') { for (let i = 0; i < 3; i++) P.shape(QQ(ribbon([[fx - 0.45, -0.7 + i * 0.07], [fx, -0.73 + i * 0.07], [fx + 0.42, -0.69 + i * 0.07]], 0.016, 0.012)), '#efe9dc', 240, null, 0, 0.002); P.dot(...Q(fx, -0.62), R * 0.028, '#c1121f', 250); }
  if (m === 'sun') { const p = Q(fx, -0.58); P.circle(p[0], p[1], R * 0.05, '#e04a1a', 250, null); for (let i = 0; i < 8; i++) { const a = i * 45 * D2R; P.line([[p[0] + Math.cos(a) * R * 0.065, p[1] + Math.sin(a) * R * 0.065], [p[0] + Math.cos(a) * R * 0.1, p[1] + Math.sin(a) * R * 0.1]], '#e9a21f', iw * 0.9, 'gold'); } }
  if (m === 'third') { for (let i = 0; i < 3; i++) P.shape(QQ(ribbon([[fx - 0.45, -0.74 + i * 0.07], [fx, -0.77 + i * 0.07], [fx + 0.42, -0.73 + i * 0.07]], 0.016, 0.012)), '#efe9dc', 240, null, 0, 0.002); const e3 = Q(fx, -0.52); P.shape([[e3[0] - R * 0.035, e3[1]], [e3[0], e3[1] - R * 0.1], [e3[0] + R * 0.035, e3[1]], [e3[0], e3[1] + R * 0.1]], '#c1121f', 250, INK, iw * 0.7, 0.002); }
  if (m === 'bindi') P.dot(...Q(fx, -0.46), R * 0.035, '#c1121f', 255);
  if (m === 'gem') { const p = Q(fx, -0.6); P.wash(circlePts(p[0], p[1], R * 0.14, 20), '#9fe6ff', 80, 0.03); P.circle(p[0], p[1], R * 0.055, '#3aa8d8', 250, INK, iw * 0.7); P.dot(p[0] + R * 0.015, p[1] - R * 0.02, R * 0.016, '#ffffff'); }
}

function earring(P, c, Q, iw, R, t) {
  const p = Q(-0.97, 0.3), e = c.ear, sw = Math.sin(t * 2.3) * R * 0.02;
  if (e === 'kundala') { P.line(arcPts(p[0] + sw, p[1] + R * 0.1, R * 0.1, 0, 360, 24), GOLD, iw * 2.2, 'gold', 0.5); P.dot(p[0] + sw, p[1] + R * 0.2, R * 0.025, '#b3202a'); }
  if (e === 'ring') P.line(arcPts(p[0] + sw, p[1] + R * 0.06, R * 0.06, 0, 360, 18), GOLD, iw * 1.6, 'gold', 0.5);
  if (e === 'makara') { const q = [p[0] + sw, p[1] + R * 0.14]; P.shape([[q[0] - R * 0.1, q[1] - R * 0.02], [q[0], q[1] - R * 0.09], [q[0] + R * 0.1, q[1] - R * 0.03], [q[0] + R * 0.05, q[1] + R * 0.09], [q[0] - R * 0.04, q[1] + R * 0.12]], GOLD2, 245, '#7a4a10', iw * 0.8, 0.003); P.dot(q[0], q[1], R * 0.022, '#b3202a'); P.dot(q[0] - R * 0.05, q[1] + R * 0.13, R * 0.018, '#2a7a5a'); }
  if (e === 'sun') { const q = [p[0] + sw, p[1] + R * 0.14]; P.wash(circlePts(q[0], q[1], R * 0.28, 24), '#ffd060', 90, 0.03); P.circle(q[0], q[1], R * 0.11, '#f6c94a', 250, '#8a4a10', iw); P.circle(q[0], q[1], R * 0.045, '#d22a1a', 250, null); }
  if (e === 'jhumka') { const q = [p[0] + sw, p[1] + R * 0.05]; P.dot(q[0], q[1], R * 0.03, GOLD2); P.shape([[q[0] - R * 0.07, q[1] + R * 0.16], [q[0], q[1] + R * 0.04], [q[0] + R * 0.07, q[1] + R * 0.16]], GOLD, 245, '#7a4a10', iw * 0.8, 0.003); for (let i = 0; i < 4; i++) P.dot(q[0] - R * 0.06 + i * R * 0.04, q[1] + R * 0.18, R * 0.012, '#f6f1e4'); }
  if (e === 'rudra') { for (let i = 0; i < 3; i++) P.dot(p[0] + sw * 0.5, p[1] + R * (0.03 + i * 0.045), R * 0.022, '#6a3a1a'); }
}

function chest(P, c, Q, QQ, iw, R, sw, t) {
  const ch = c.chest;
  if (c.female) {   // blouse + sari across the chest and over the shoulder
    P.shape(QQ([[-sw * 1.05, 2.0], [-sw * 0.85, 1.6], [-0.3, 1.95], [0.5, 1.95], [sw * 0.8, 1.6], [sw, 2.1], [sw, 2.8], [-sw * 1.1, 2.8]]), shade(c.cloth, -0.25), 240, INK, iw, 0.005);
    P.shape(QQ([[sw * 0.85, 1.6], [sw * 1.0, 2.2], [sw * 1.0, 2.8], [-0.6, 2.8], [-0.2, 2.3], [0.5, 1.85]]), c.cloth, 240, INK, iw, 0.006, 0.4);
    P.line(QQ([[sw * 0.85, 1.6], [0.5, 1.85], [-0.2, 2.3], [-0.6, 2.8]]), GOLD, iw * 3, 'gold', 0.5);
    for (let i = 0; i < 4; i++) P.line(QQ([[sw * 0.9 - i * 0.12, 1.8 + i * 0.1], [0.4 - i * 0.1, 2.2 + i * 0.1], [0.1 - i * 0.1, 2.8]]), shade(c.cloth, -0.3), iw * 0.6, 'fine', 0.5);
  }
  if (ch === 'kavacha') {   // Karna's golden armour, born with him
    P.shape(QQ([[-sw * 1.05, 2.0], [-sw * 0.82, 1.55], [-0.4, 1.45], [0.5, 1.45], [sw * 0.78, 1.55], [sw, 2.05], [sw, 2.8], [-sw * 1.1, 2.8]]), '#d8a63a', 245, '#6a3a10', iw, 0.005);
    for (let r = 0; r < 6; r++) for (let q = 0; q < 11; q++) { const u = -sw + q * sw * 0.2 + (r % 2) * sw * 0.1, v = 1.65 + r * 0.2; if (Math.abs(u) > sw * (0.8 + r * 0.05)) continue; const pp = Q(u, v); P.line(arcPts(pp[0], pp[1], R * 0.09, 20, 160, 6), '#7a4a10', iw * 0.8, 'fine', 0.3); }
    const g = Q(0.05, 1.95); P.wash(circlePts(g[0], g[1], R * 0.35, 24), '#ffe08a', 90, 0.03); P.circle(g[0], g[1], R * 0.12, '#f6dc7a', 250, '#6a3a10', iw);
  }
  if (ch === 'armour') {
    P.shape(QQ([[-sw * 1.05, 2.0], [-sw * 0.82, 1.55], [-0.4, 1.5], [0.5, 1.5], [sw * 0.78, 1.55], [sw, 2.05], [sw, 2.8], [-sw * 1.1, 2.8]]), shade(c.cloth, -0.2), 245, INK, iw, 0.005);
    for (let i = 0; i < 3; i++) P.line(QQ([[-sw * 0.9, 1.85 + i * 0.28], [0, 1.95 + i * 0.28], [sw * 0.9, 1.85 + i * 0.28]]), '#b88b2e', iw * 1.6, 'gold', 0.5);
    P.circle(...Q(-sw * 0.75, 1.75), R * 0.16, '#b88b2e', 245, INK, iw);
  }
  if (ch === 'white') { P.shape(QQ([[-sw * 1.05, 2.0], [-sw * 0.85, 1.55], [-0.2, 1.75], [sw * 0.5, 2.8], [-sw * 1.1, 2.8]]), c.cloth, 240, '#8a8070', iw, 0.006, 0.4); for (let i = 0; i < 4; i++) P.line(QQ([[-sw * 0.8 + i * 0.2, 1.7 + i * 0.05], [-sw * 0.5 + i * 0.3, 2.7]]), shade(c.cloth, -0.18), iw * 0.6, 'fine', 0.5); }
  if (ch === 'pearls' || ch === 'torque' || ch === 'necklace' || ch === 'vaijayanti' || ch === 'kavacha' || ch === 'armour') {
    // uttariya over the far shoulder in the hero's colour
    if (!c.female && ch !== 'kavacha' && ch !== 'armour') { P.shape(QQ([[sw * 0.7, 1.55], [sw * 1.0, 2.0], [sw * 0.95, 2.8], [sw * 0.4, 2.8], [sw * 0.5, 2.1], [sw * 0.45, 1.6]]), c.cloth, 240, INK, iw, 0.006, 0.4); P.line(QQ([[sw * 0.45, 1.6], [sw * 0.5, 2.1], [sw * 0.4, 2.8]]), GOLD, iw * 2.4, 'gold', 0.5); }
    const nc = Q(0.0, 1.2);
    for (let i = 0; i < (ch === 'torque' ? 1 : 3); i++) { const r0 = R * (0.75 + i * 0.22); P.line(arcPts(nc[0], nc[1], r0, 20, 160, 24).map(p => [p[0], nc[1] + (p[1] - nc[1]) * 0.9]), i === 1 && ch === 'pearls' ? '#f6f1e4' : GOLD, iw * (ch === 'torque' ? 5 : 2.4 - i * 0.4), 'gold', 0.5); }
    if (ch !== 'torque') { const pd = Q(0.05, 2.12); P.circle(pd[0], pd[1], R * 0.07, '#b3202a', 250, '#7a4a10', iw * 0.8); }
  }
  if (ch === 'vaijayanti') { // garland of forest flowers
    const nc = Q(0.0, 1.05); const cols = ['#f2efe2', '#e04a6a', '#f2b23a', '#e9e0c0', '#c7362b'];
    for (let i = 0; i <= 26; i++) { const a = (15 + i * 150 / 26) * D2R, r0 = R * 1.25; const p = [nc[0] + Math.cos(a) * r0 * 0.95, nc[1] + Math.sin(a) * r0 * 1.15]; P.dot(p[0], p[1], R * 0.05, cols[i % 5], 250); P.dot(p[0], p[1], R * 0.016, '#7a4a10', 250); }
  }
  if (ch === 'serpent') { const nc = Q(0.0, 1.2); P.shape(ribbon(arcPts(nc[0], nc[1], R * 1.0, 10, 170, 20), R * 0.06, R * 0.04), '#3a6a3a', 245, INK, iw, 0.004); const hd = [nc[0] + Math.cos(10 * D2R) * R, nc[1] + Math.sin(10 * D2R) * R - R * 0.1]; P.shape(circlePts(hd[0], hd[1] - R * 0.15, R * 0.15, 14, 0.8, 1.1), '#3a6a3a', 245, INK, iw); P.dot(hd[0], hd[1] - R * 0.18, R * 0.02, '#d22a1a'); P.wash(QQ([[-0.5, 0.6], [0.45, 0.65], [0.42, 1.15], [-0.55, 1.2]]), '#3a5aa8', 90, 0.03); }
  if (ch === 'rudraksha') { const nc = Q(0.0, 1.2); for (let i = 0; i <= 18; i++) { const a = (20 + i * 140 / 18) * D2R, r0 = R * 0.95; P.dot(nc[0] + Math.cos(a) * r0, nc[1] + Math.sin(a) * r0, R * 0.035, '#5a2a12', 250); } P.shape(QQ([[-sw * 1.05, 2.0], [-sw * 0.85, 1.55], [-0.3, 1.8], [sw * 0.4, 2.8], [-sw * 1.1, 2.8]]), c.cloth, 240, '#8a7a60', iw, 0.006, 0.4); }
}

function crown(P, c, Q, QQ, iw, R, t, wind) {
  const cr = c.crown;
  // hairline / front hair for those without a full crown
  const hairCap = [[-0.92, -0.25], [-0.95, -0.7], [-0.6, -1.05], [0.0, -1.16], [0.55, -1.05], [0.82, -0.72], [0.76, -0.62], [0.4, -0.8], [0.0, -0.83], [-0.5, -0.78], [-0.78, -0.5]];
  if (cr !== 'veil') P.shape(chaikin(QQ(hairCap), 1), c.hair, 240, INK, iw, 0.005, 0.3);
  if (c.female && cr !== 'veil') { P.line(QQ([[0.05, -1.14], [0.1, -0.84]]), '#c1121f', iw * 1.6, 'ink', 0.3); for (let i = 0; i < 4; i++) P.line(QQ([[0.0 - i * 0.16, -1.1 + i * 0.03], [-0.3 - i * 0.14, -0.85 + i * 0.05], [-0.7 - i * 0.05, -0.5 + i * 0.1]]), shade(c.hair, 0.25), iw * 0.5, 'fine', 0.5); }
  if (cr === 'veil') { P.shape(QQ([[-1.2, -0.3], [-0.95, -1.1], [0.0, -1.3], [0.72, -1.05], [0.88, -0.55], [0.7, -0.6], [0.5, -0.9], [0.0, -1.02], [-0.6, -0.92], [-0.9, -0.4]]), c.veil, 245, INK, iw, 0.005, 0.3); P.line(QQ([[0.88, -0.55], [0.72, -1.05], [0.0, -1.3], [-0.95, -1.1]]), shade(c.veil, -0.25), iw * 1.2, 'ink', 0.5); }
  const band = (v0, v1, col) => { P.shape(QQ([[-0.98, v1], [-0.92, v0], [0.0, v0 - 0.1], [0.82, v0 + 0.02], [0.84, v1 + 0.02], [0.0, v1 - 0.08]]), col, 245, INK, iw, 0.004); };
  const gems = (v, n, x0, x1) => { for (let i = 0; i < n; i++) { const u = x0 + (x1 - x0) * i / (n - 1); P.dot(...Q(u, v - 0.06 * (1 - Math.abs(u - 0.0) / 1)), R * 0.035, i % 3 === 1 ? '#2a7a5a' : '#b3202a', 255); } };
  const tiers = (top, col, wide = 0.82) => {
    // three-tiered mukut rising above the brow, flared side plates over the temples
    const half = [[0.0, -0.95], [wide, -0.9], [wide * 0.98, -1.15], [wide * 0.78, -1.25], [wide * 0.84, -1.5], [wide * 0.6, -1.62], [wide * 0.6, -1.85], [wide * 0.35, -1.95], [wide * 0.3, -2.2 * top], [0.12, -2.4 * top], [0.0, -2.55 * top]];
    const pts = half.map(p => [p[0] * 0.95 - 0.04, p[1]]).concat(half.slice().reverse().map(p => [-p[0] * 1.12 - 0.04, p[1]]));
    P.shape(QQ(pts), col, 245, '#5a3410', iw, 0.005, 0.4);
    P.wash(QQ([[0.0, -1.0], [0.55, -0.95], [0.5, -1.8], [0.1, -2.2 * top]]), '#fff0b0', 90, 0.02, 0.3, 0.2);
    for (const v of [-1.18, -1.55, -1.88]) P.line(QQ([[-wide * 1.0, v], [-0.04, v - 0.08], [wide * 0.85, v + 0.01]]), '#7a4a10', iw * 0.9, 'ink', 0.4);
    gems(-1.32, 5, -0.7, 0.62); gems(-1.7, 3, -0.4, 0.36);
    P.circle(...Q(-0.04, -2.5 * top), R * 0.07, '#b3202a', 250, '#5a3410', iw * 0.8);
    // lotus petals around the base
    for (let i = 0; i < 7; i++) { const u = -0.9 + i * 0.28; P.shape(QQ([[u - 0.1, -0.98], [u, -1.18], [u + 0.1, -0.98]]), GOLD2, 245, '#5a3410', iw * 0.6, 0.003); }
    // side fan ornaments (karnaphool)
    P.shape(QQ([[-0.95, -1.05], [-1.3, -0.85], [-1.22, -0.6], [-0.98, -0.55]]), GOLD, 245, '#5a3410', iw * 0.8, 0.003);
    P.dot(...Q(-1.1, -0.8), R * 0.04, '#b3202a', 255);
  };
  if (cr === 'mukut') { band(-0.82, -0.98, GOLD); tiers(1, GOLD); }
  if (cr === 'mukutLow') { band(-0.82, -0.98, GOLD); tiers(0.82, GOLD, 0.75); }
  if (cr === 'royal') { band(-0.82, -0.98, GOLD); tiers(1.12, GOLD2, 0.9); }
  if (cr === 'peacock') {
    // feather first (behind the crown top), then crown
    const base = Q(-0.45, -1.6), sway = Math.sin(t * 1.4) * 0.05;
    const stem = [Q(-0.55, -1.3), Q(-0.8 + sway, -1.85), Q(-1.1 + sway * 1.5, -2.3)];
    P.line(stem, '#2e5a3a', iw * 1.4, 'ink', 0.5);
    const e = stem[2];
    for (let i = 0; i < 30; i++) { const a = (-90 + (i - 15) * 7) * D2R + (f0 => 0)(), L = R * (0.5 + 0.15 * Math.sin(i)); P.line([lerp2(stem[1], e, 0.3 + (i % 5) * 0.12), [e[0] + Math.cos(a) * L * 0.9, e[1] + Math.sin(a) * L]], i % 2 ? '#3b8a50' : '#2e6a44', iw * 0.8, 'fine', 0.5); }
    P.shape(circlePts(e[0], e[1], R * 0.24, 24, 0.8, 1.1), '#2b7a64', 245, INK, iw * 0.8, 0.003);
    P.shape(circlePts(e[0], e[1] + R * 0.02, R * 0.16, 20, 0.8, 1.05), '#d7b23a', 250, null, 0, 0.003);
    P.shape(circlePts(e[0], e[1] + R * 0.04, R * 0.09, 18, 0.8, 1.0), '#1d3f8f', 250, null, 0, 0.003);
    P.dot(e[0], e[1] + R * 0.05, R * 0.035, '#0a1430', 255);
    band(-0.82, -0.98, GOLD); tiers(0.9, GOLD);
  }
  if (cr === 'sun') { band(-0.82, -0.98, GOLD2); tiers(1.0, GOLD2); const s = Q(-0.04, -1.45); P.circle(s[0], s[1], R * 0.13, '#e04a1a', 250, '#5a3410', iw); }
  if (cr === 'serpent') {
    // dark crown with a five-hooded cobra fanned behind
    const hc = Q(-0.05, -1.85);
    for (let i = 0; i < 5; i++) { const a = (-150 + i * 30) * D2R, p = [hc[0] + Math.cos(a) * R * 0.5, hc[1] + Math.sin(a) * R * 0.55 + R * 0.25]; P.shape(circlePts(p[0], p[1], R * 0.2, 16, 0.75, 1.1), '#2b3b2a', 245, INK, iw, 0.004); P.dot(p[0] - R * 0.05, p[1] - R * 0.04, R * 0.02, '#d22a1a'); P.dot(p[0] + R * 0.05, p[1] - R * 0.04, R * 0.02, '#d22a1a'); P.line([[p[0], p[1] + R * 0.06], [p[0], p[1] + R * 0.16]], '#c9b57a', iw, 'fine'); }
    band(-0.82, -0.98, '#a07a2a'); tiers(0.85, '#8a6a2a', 0.8);
    const s = Q(-0.04, -1.3); P.circle(s[0], s[1], R * 0.1, '#5a0a14', 250, '#2a1a08', iw);
  }
  if (cr === 'band') {   // Bhima: wild hair bound with a red and gold band, no crown
    const sw = Math.sin(t * 2) * 0.04;
    P.shape(QQ([[-1.1, -0.4], [-1.25, -1.0], [-0.8, -1.4], [-0.2, -1.55], [0.4, -1.45], [0.85, -1.15], [0.95, -0.75], [0.6, -0.9], [0.0, -0.95], [-0.7, -0.75]]), c.hair, 245, INK, iw, 0.005, 0.3);
    for (let i = 0; i < 8; i++) { const u = -1.0 + i * 0.26; const p = Q(u, -1.3 - Math.sin(i * 1.3) * 0.12); P.line(arcPts(p[0], p[1], R * 0.1, 200, 520, 12), shade(c.hair, 0.3), iw * 0.8, 'fine', 0.5); }
    band(-0.82, -0.96, '#b3202a'); P.line(QQ([[-0.95, -0.9], [0.0, -0.98], [0.82, -0.88]]), GOLD, iw * 2.6, 'gold', 0.5);
    P.shape(QQ([[-1.0, -0.88], [-1.4, -0.7 + sw], [-1.55, -0.3 + sw], [-1.3, -0.45], [-1.05, -0.75]]), '#b3202a', 245, INK, iw * 0.8, 0.004);
    P.circle(...Q(-0.05, -0.97), R * 0.06, GOLD2, 250, '#5a3410', iw * 0.7);
  }
  if (cr === 'turban') {
    P.shape(QQ([[-0.98, -0.5], [-1.05, -1.1], [-0.6, -1.45], [0.1, -1.5], [0.7, -1.25], [0.88, -0.78], [0.5, -0.85], [0.0, -0.9], [-0.6, -0.82]]), c.cloth, 245, INK, iw, 0.005, 0.3);
    for (let i = 0; i < 4; i++) P.line(QQ([[-0.95, -0.7 - i * 0.16], [-0.1, -0.92 - i * 0.14], [0.8, -0.85 - i * 0.1]]), shade(c.cloth, -0.35), iw * 0.9, 'ink', 0.5);
    const j = Q(-0.1, -1.2); P.circle(j[0], j[1], R * 0.08, '#b88b2e', 250, INK, iw * 0.7);
    P.line([j, Q(-0.35, -1.8), Q(-0.6, -2.0)], '#e8dfc8', iw * 2.4, 'fine', 0.5);   // kalgi plume
  }
  if (cr === 'jata' || cr === 'jataBand') {
    const top = Q(-0.15, -1.3);
    P.shape(circlePts(top[0], top[1], R * 0.36, 20, 1.0, 0.85), c.hair, 245, c.age ? '#7a7268' : INK, iw, 0.005);
    for (let i = 0; i < 3; i++) P.line(arcPts(top[0], top[1], R * (0.12 + i * 0.09), 160, 400, 14), shade(c.hair, c.age ? -0.22 : 0.25), iw * 0.6, 'fine', 0.5);
    if (cr === 'jataBand') { P.line(QQ([[-0.92, -0.85], [0.0, -0.95], [0.8, -0.84]]), GOLD, iw * 2.4, 'gold', 0.5); P.circle(...Q(-0.04, -0.95), R * 0.05, '#2a7a5a', 250, '#5a3410', iw * 0.6); }
    else for (let i = 0; i < 7; i++) P.dot(top[0] - R * 0.3 + i * R * 0.1, top[1] + R * 0.28, R * 0.025, '#5a2a12', 250);
  }
  if (cr === 'shiva') {
    const top = Q(-0.12, -1.45);
    P.shape(chaikin([Q(-0.75, -0.95), Q(-0.7, -1.6), Q(-0.35, -2.05), Q(0.15, -2.1), Q(0.45, -1.7), Q(0.6, -1.0)], 2), c.hair, 245, INK, iw, 0.005);
    for (let i = 0; i < 6; i++) P.line([Q(-0.6 + i * 0.2, -1.0), Q(-0.55 + i * 0.17, -1.6), Q(-0.3 + i * 0.08, -2.0)], shade(c.hair, 0.3), iw * 0.7, 'fine', 0.5);
    for (let i = 0; i < 9; i++) P.dot(...Q(-0.7 + i * 0.16, -1.05 + Math.sin(i) * 0.03), R * 0.03, '#5a2a12', 250);
    const m = Q(0.28, -1.75); P.shape(arcPts(m[0], m[1], R * 0.22, 120, 300, 14).concat(arcPts(m[0] + R * 0.07, m[1] - R * 0.03, R * 0.17, 290, 130, 14)), '#f6f1e4', 250, '#8a8a9a', iw * 0.8, 0.003);
    const g0 = Q(-0.2, -2.05); P.line([g0, Q(-0.5, -2.4), Q(-0.4, -2.75)], '#9fd8ff', iw * 3, 'fine', 0.5);
  }
  if (cr === 'tikka') { P.line(QQ([[0.05, -1.14], [0.06, -0.86]]), GOLD, iw * 1.2, 'gold', 0.3); const p = Q(0.06, -0.82); P.shape([[p[0], p[1] - R * 0.05], [p[0] + R * 0.06, p[1] + R * 0.02], [p[0], p[1] + R * 0.09], [p[0] - R * 0.06, p[1] + R * 0.02]], GOLD2, 250, '#7a4a10', iw * 0.7, 0.003); P.dot(p[0], p[1] + R * 0.02, R * 0.022, '#b3202a'); for (let i = 0; i < 5; i++) P.dot(...Q(-0.8 + i * 0.07, -0.95 + i * 0.03), R * 0.045, i % 2 ? '#f6f1e4' : '#f2e6c0'); }
  if (cr === 'flowers') { for (let i = 0; i < 6; i++) { const p = Q(-0.9 + i * 0.05, -0.9 + i * 0.12); P.dot(p[0], p[1], R * 0.07, i % 2 ? '#f6f1e4' : '#e04a6a'); } }
  if (cr === 'goddess') { band(-0.82, -0.98, GOLD); tiers(0.9, GOLD, 0.7); const m = Q(-0.04, -1.55); P.line(arcPts(m[0], m[1], R * 0.18, 200, 340, 12), '#f6f1e4', iw * 2.4, 'gold', 0.5); for (let i = 0; i < 3; i++) P.line(QQ([[-0.9, -1.1 + i * 0.1], [-1.3, -0.9 + i * 0.15], [-1.5, -0.4 + i * 0.2]]), '#7ab8d8', iw * 1.2, 'fine', 0.5); }
}
