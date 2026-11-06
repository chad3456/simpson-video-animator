// Season 1: the frame story (Vyasa recites, Ganesha writes) and the wide landscapes of the epic.
// Adds faces, figures, sets and pieces on top of lib.js / pieces.js.

Object.assign(WOMEN, {
  amba: { skin: '#b07a52', sari: '#8a1c3a', border: GOLD }, ambika: { skin: '#c8987a', sari: '#d27a2a', border: GOLD },
  ambalika: { skin: '#d8b090', sari: '#6a4a9a', border: GOLD }, kuntiY: { skin: '#b88a62', sari: '#c7362b', border: GOLD },
  gandhariY: { skin: '#c4946a', sari: '#7a5a2a', border: GOLD }, maid: { skin: '#7a4c32', sari: '#e8dcc0', border: '#c9b57a' },
});
Object.assign(FACES, {
  amba: { skin: '#b07a52', W: 0.7, cheek: 0.4, jaw: 0.08, chin: 0.95, nose: 'fine', eye: 1.12, brow: 'arch', lips: '#a3283a', stache: null, beard: null, hair: '#0e0a08', hairStyle: 'woman', crown: 'tikka', tilak: 'bindi', ear: 'jhumka', chest: 'necklace', cloth: '#8a1c3a', female: 1, nath: 1, expr: 'stern' },
  ambika: { skin: '#c8987a', W: 0.72, cheek: 0.5, jaw: 0.05, chin: 0.94, nose: 'fine', eye: 1.08, brow: 'arch', lips: '#b0404a', stache: null, beard: null, hair: '#1a120d', hairStyle: 'woman', crown: 'flowers', tilak: 'bindi', ear: 'jhumka', chest: 'necklace', cloth: '#d27a2a', female: 1, expr: 'fear' },
  ambalika: { skin: '#d8b090', W: 0.68, cheek: 0.4, jaw: 0.05, chin: 0.94, nose: 'fine', eye: 1.1, brow: 'arch', lips: '#b05060', stache: null, beard: null, hair: '#2a1a12', hairStyle: 'woman', crown: 'tikka', tilak: 'bindi', ear: 'jhumka', chest: 'pearls', cloth: '#6a4a9a', female: 1, expr: 'fear' },
  kuntiY: { skin: '#b88a62', W: 0.7, cheek: 0.4, jaw: 0.06, chin: 0.95, nose: 'fine', eye: 1.12, brow: 'arch', lips: '#a0303a', stache: null, beard: null, hair: '#120d0a', hairStyle: 'woman', crown: 'tikka', tilak: 'bindi', ear: 'jhumka', chest: 'necklace', cloth: '#c7362b', female: 1, nath: 1, expr: 'calm' },
  madri: { skin: '#c8a07e', W: 0.7, cheek: 0.5, jaw: 0.05, chin: 0.94, nose: 'fine', eye: 1.12, brow: 'arch', lips: '#b02a3a', stache: null, beard: null, hair: '#0e0a08', hairStyle: 'woman', crown: 'flowers', tilak: 'bindi', ear: 'jhumka', chest: 'necklace', cloth: '#5a2a6a', female: 1, nath: 1, expr: 'smile' },
  gandhariY: { skin: '#c4946a', W: 0.67, jaw: 0.1, chin: 0.95, nose: 'fine', eye: 1.1, brow: 'arch', lips: '#a0303a', stache: null, beard: null, hair: '#2a201a', hairStyle: 'woman', crown: 'tikka', tilak: 'bindi', ear: 'jhumka', chest: 'necklace', cloth: '#7a5a2a', female: 1, nath: 1, expr: 'calm' },
  pandu: { skin: '#d8c0a8', W: 0.72, long: 1.02, jaw: 0.4, chin: 1.0, nose: 'straight', eye: 0.96, brow: 'soft', lips: '#9a5050', stache: 'thin', beard: null, hair: '#2a1a12', hairStyle: 'straight', crown: 'royal', tilak: 'line', ear: 'kundala', chest: 'pearls', cloth: '#f0e8d8', expr: 'calm' },
  dhritaY: { skin: '#b68a64', W: 0.8, cheek: 0.3, jaw: 0.55, chin: 1.0, nose: 'straight', eye: 0.9, brow: 'soft', lips: '#8a3e34', stache: 'full', beard: 'short', hair: '#1a120d', hairStyle: 'straight', crown: 'royal', tilak: 'chandan', ear: 'kundala', chest: 'pearls', cloth: '#6a1a2a', blind: 1, expr: 'calm' },
  vichitra: { skin: '#c49a78', W: 0.68, cheek: 0.3, long: 0.98, jaw: 0.15, chin: 0.96, nose: 'fine', eye: 1.0, brow: 'soft', lips: '#a04a4a', stache: 'thin', beard: null, hair: '#1a120d', hairStyle: 'curls', crown: 'mukut', tilak: 'line', ear: 'kundala', chest: 'pearls', cloth: '#2f6f9a', expr: 'calm' },
  shalva: { skin: '#a8784e', W: 0.74, jaw: 0.55, chin: 1.0, nose: 'aquiline', eye: 0.94, brow: 'arch', lips: '#8a3e34', stache: 'full', beard: null, hair: '#16100c', hairStyle: 'straight', crown: 'mukutLow', tilak: 'line', ear: 'kundala', chest: 'armour', cloth: '#3a5a2a', expr: 'stern' },
  surya: { skin: '#e8a860', W: 0.76, cheek: 0.4, jaw: 0.3, chin: 0.98, nose: 'straight', eye: 1.02, brow: 'arch', lips: '#b0402a', stache: 'thin', beard: null, hair: '#3a1a0a', hairStyle: 'curls', crown: 'sun', tilak: 'namam', ear: 'makara', chest: 'kavacha', cloth: '#f0a020', expr: 'divine', sheen: '#fff0b0' },
  durvasa: { skin: '#9a6a44', W: 0.66, long: 1.12, jaw: 0.4, chin: 1.04, nose: 'hook', eye: 0.9, brow: 'whiteFurrow', lips: '#7a3a2a', stache: 'grey', beard: 'grey', hair: '#bdb6aa', hairStyle: 'wild', crown: 'jata', tilak: 'tripundra', ear: 'rudra', chest: 'rudraksha', cloth: '#b06a2a', expr: 'anger', age: 1 },
  maid: { skin: '#7a4c32', W: 0.7, cheek: 0.4, jaw: 0.08, chin: 0.95, nose: 'fine', eye: 1.08, brow: 'soft', lips: '#8a3a3a', stache: null, beard: null, hair: '#0c0808', hairStyle: 'woman', crown: 'flowers', tilak: 'bindi', ear: 'jhumka', chest: 'white', cloth: '#e8dcc0', female: 1, expr: 'calm' },
  pratipa: { skin: '#c2916a', W: 0.72, jaw: 0.45, chin: 1.0, nose: 'straight', eye: 0.88, brow: 'white', lips: '#8a5048', stache: 'white', beard: 'long', hair: '#e8e4dc', hairStyle: 'straight', crown: 'royal', tilak: 'chandan', ear: 'kundala', chest: 'pearls', cloth: '#7a1a2a', expr: 'calm', age: 1 },
  vyasa: { skin: '#6e4a30', W: 0.66, long: 1.1, jaw: 0.4, chin: 1.0, nose: 'aquiline', eye: 0.88, brow: 'whiteFurrow', lips: '#6a3a30', stache: 'grey', beard: 'long', hair: '#9a948a', hairStyle: 'jata', crown: 'jata', tilak: 'tripundra', ear: 'rudra', chest: 'rudraksha', cloth: '#c8762a', expr: 'calm', age: 1 },
  vasishtha: { skin: '#c49a70', W: 0.68, long: 1.08, jaw: 0.4, chin: 1.0, nose: 'straight', eye: 0.86, brow: 'white', lips: '#8a5048', stache: 'white', beard: 'long', hair: '#f1eee6', hairStyle: 'jata', crown: 'jata', tilak: 'tripundra', ear: 'rudra', chest: 'rudraksha', cloth: '#f0e8d0', expr: 'calm', age: 1 },
  parashurama: { skin: '#a8683e', W: 0.8, cheek: 0.2, long: 1.04, jaw: 0.8, chin: 1.02, nose: 'aquiline', eye: 0.9, brow: 'whiteFurrow', lips: '#7a3a2a', stache: 'full', beard: 'full', hair: '#3a2a1e', hairStyle: 'jata', crown: 'jataBand', tilak: 'tripundra', ear: 'rudra', chest: 'rudraksha', cloth: '#a0401a', expr: 'stern' },
  dashraj: { skin: '#7a5034', W: 0.78, cheek: 0.3, jaw: 0.6, chin: 1.0, nose: 'broad', eye: 0.88, brow: 'soft', lips: '#6a3a2a', stache: 'grey', beard: 'grey', hair: '#6a6258', hairStyle: 'straight', crown: 'turban', tilak: 'line', ear: 'kundala', chest: 'necklace', cloth: '#c8b890', expr: 'calm', age: 1 },
  boy: { skin: '#b9875c', W: 0.76, cheek: 0.6, long: 0.9, jaw: 0.1, chin: 0.94, nose: 'fine', eye: 1.12, brow: 'arch', lips: '#9a4a3a', stache: null, beard: null, hair: '#16100c', hairStyle: 'curls', crown: 'band', tilak: 'line', ear: 'kundala', chest: 'pearls', cloth: '#ece6d6', expr: 'stern' },
  vasu: { skin: '#e0b88a', W: 0.72, cheek: 0.4, jaw: 0.2, chin: 0.96, nose: 'fine', eye: 1.04, brow: 'arch', lips: '#a03a3a', stache: 'thin', beard: null, hair: '#1a120d', hairStyle: 'curls', crown: 'mukut', tilak: 'namam', ear: 'kundala', chest: 'necklace', cloth: '#f0c040', expr: 'smile', sheen: '#fff0b0' },
});
Object.assign(CAST, {
  pandu: { skin: '#d8c0a8', dhoti: '#f0e8d8', patka: '#d2a23a', scarf: '#e0a43a', crown: 'mukut', hair: '#2a1a12', beard: 'stache', jewel: GOLD },
  dhritaY: { skin: '#b68a64', dhoti: '#6a1a2a', patka: '#d2a23a', scarf: '#e0a43a', crown: 'mukut', hair: '#1a120d', beard: 'short', jewel: GOLD },
  vichitra: { skin: '#c49a78', dhoti: '#2f6f9a', patka: '#d2a23a', scarf: '#e0a43a', crown: 'mukut', hair: '#1a120d', beard: null, jewel: GOLD },
  shalva: { skin: '#a8784e', dhoti: '#3a5a2a', patka: '#d2a23a', scarf: '#6a4a2a', crown: 'mukut', hair: '#16100c', beard: 'stache', jewel: GOLD },
  king: { skin: '#a8784e', dhoti: '#6a2a4a', patka: '#d2a23a', scarf: '#2f6f9a', crown: 'mukut', hair: '#16100c', beard: 'stache', jewel: GOLD },
  pratipa: { skin: '#c2916a', dhoti: '#7a1a2a', patka: '#d2a23a', scarf: '#e0a43a', crown: 'mukut', hair: '#e8e4dc', beard: 'long', jewel: GOLD, age: 1 },
  vyasa: { skin: '#6e4a30', dhoti: '#c8762a', patka: '#8a4a1a', scarf: '#d8903a', crown: 'bun', hair: '#9a948a', beard: 'long', jewel: '#cfc6a8', age: 1 },
  vasishtha: { skin: '#c49a70', dhoti: '#f0e8d0', patka: '#c9b57a', scarf: '#f4efe2', crown: 'bun', hair: '#f1eee6', beard: 'long', jewel: '#cfc6a8', age: 1 },
  parashurama: { skin: '#a8683e', dhoti: '#a0401a', patka: '#6a2a10', scarf: '#c8602a', crown: 'bun', hair: '#3a2a1e', beard: 'short', jewel: '#cfc6a8', bulk: 1.15 },
  boy: { skin: '#b9875c', dhoti: '#ece6d6', patka: '#c9b57a', scarf: '#f4efe2', crown: 'band', hair: '#16100c', beard: null, jewel: GOLD },
  vasu: { skin: '#e0b88a', dhoti: '#f0c040', patka: '#c7362b', scarf: '#f6e6b0', crown: 'mukut', hair: '#1a120d', beard: null, jewel: GOLD },
  courtier: { skin: '#a8784e', dhoti: '#5a2a4a', patka: '#d2a23a', scarf: '#c7362b', crown: 'turban', hair: '#16100c', beard: 'stache', jewel: GOLD },
  charioteer: { skin: '#9a6a44', dhoti: '#4a5a3a', patka: '#a0522d', scarf: null, crown: 'turban', hair: '#16100c', beard: 'stache', jewel: '#8a7a5a' },
});

// ---------------------------------------------------------------- small helpers ---
function shikhara(P, bx, by, bw, th, col, ink = INK) {
  const sp = []; for (let i = 0; i <= 8; i++) { const k = i / 8; sp.push([bx - bw * (1 - Math.pow(k, 1.6) * 0.75), by - th * k]); } for (let i = 8; i >= 0; i--) { const k = i / 8; sp.push([bx + bw * (1 - Math.pow(k, 1.6) * 0.75), by - th * k]); }
  P.shape(sp, col, 220, ink, 0.9);
  for (let i = 1; i < 5; i++) { const k = i / 5, ww = bw * (1 - Math.pow(k, 1.6) * 0.75); P.line([[bx - ww, by - th * k], [bx + ww, by - th * k]], shade(col, -0.3), 0.6, 'ink', 0); }
  P.shape(circlePts(bx, by - th - bw * 0.12, bw * 0.34, 12, 1, 0.45), shade(col, 0.15), 220, ink, 0.7);
  P.line([[bx, by - th - bw * 0.2], [bx, by - th - bw * 0.9]], ink, 0.8, 'ink', 0);
  P.wash([[bx, by - th - bw * 0.9], [bx + bw * 0.6, by - th - bw * 0.8], [bx, by - th - bw * 0.65]], '#c7362b', 220, 0.004);
}
function lamp(P, x, y, s = 1, t = 0) {   // a brass oil lamp with its flame
  P.solid = true;
  P.shape([[x - 26 * s, y], [x + 26 * s, y], [x + 12 * s, y - 10 * s], [x - 12 * s, y - 10 * s]], GOLD, 240, INK, 1);
  P.shape([[x - 4 * s, y - 10 * s], [x + 4 * s, y - 10 * s], [x + 3 * s, y - 40 * s], [x - 3 * s, y - 40 * s]], shade(GOLD, -0.2), 240, INK, 0.8);
  P.shape(circlePts(x, y - 44 * s, 18 * s, 16, 1, 0.4), GOLD2, 240, INK, 0.9);
  P.solid = false;
  flames(P, x + 10 * s, y - 48 * s, 10 * s, 30 * s, t);
}
function palmLeaves(P, x, y, w, n = 6, col = '#d8b878') {   // a tied bundle of palm-leaf pages
  P.solid = true;
  for (let i = 0; i < n; i++) { const yy = y - i * 7; P.shape([[x - w / 2, yy], [x + w / 2, yy - 2], [x + w / 2 + 4, yy - 9], [x - w / 2 + 3, yy - 8]], shade(col, (i % 2) * 0.06 - 0.04), 245, INK, 0.7); }
  P.shape([[x - w * 0.5 - 6, y + 4], [x + w * 0.5 + 6, y + 2], [x + w * 0.5 + 8, y - 6], [x - w * 0.5 - 4, y - 4]], '#6a3a1a', 245, INK, 0.8);
  P.shape([[x - w * 0.5 - 4, y - n * 7], [x + w * 0.5 + 6, y - n * 7 - 2], [x + w * 0.5 + 8, y - n * 7 - 10], [x - w * 0.5 - 2, y - n * 7 - 8]], '#6a3a1a', 245, INK, 0.8);
  P.line([[x - w * 0.15, y + 4], [x - w * 0.15, y - n * 7 - 10]], '#b3202a', 1.6, 'ink', 0); P.line([[x + w * 0.15, y + 2], [x + w * 0.15, y - n * 7 - 12]], '#b3202a', 1.6, 'ink', 0);
  P.solid = false;
}
function cow(P, x, y, s, f = 1, col = '#f4efe2', t = 0) {   // a gentle white cow (Nandini)
  const T = (p) => [x + p[0] * s * f, y + p[1] * s]; const pts = (a) => a.map(T); const iw = Math.max(0.7, s / 300);
  P.solid = true;
  for (const [lx, ph] of [[-0.3, 0], [-0.2, 1], [0.24, 2], [0.32, 3]]) { const sw = Math.sin(t * 2 + ph) * 3; P.shape(pts(capsule([lx, -0.38], [lx + 0.01 * sw, -0.02], 0.045, 0.03)), shade(col, -0.08), 235, INK, iw); P.shape(pts(circlePts(lx + 0.01 * sw, -0.01, 0.03, 8, 1, 0.6)), '#3a2a20', 240, INK, iw); }
  P.shape(pts(chaikin([[-0.42, -0.42], [-0.38, -0.66], [-0.1, -0.7], [0.18, -0.74], [0.3, -0.7], [0.4, -0.5], [0.34, -0.36], [-0.32, -0.34]], 2)), col, 240, INK, iw * 1.2);
  P.shape(pts(chaikin([[0.12, -0.72], [0.2, -0.86], [0.3, -0.84], [0.32, -0.72]], 1)), col, 240, INK, iw);    // hump
  P.shape(pts(chaikin([[0.3, -0.7], [0.44, -0.78], [0.62, -0.7], [0.66, -0.58], [0.58, -0.5], [0.44, -0.52], [0.36, -0.56]], 2)), col, 240, INK, iw * 1.1);   // head
  P.shape(pts([[0.48, -0.78], [0.44, -0.92], [0.5, -0.94], [0.52, -0.79]]), '#cfc6a8', 240, INK, iw); P.shape(pts([[0.56, -0.77], [0.6, -0.9], [0.65, -0.9], [0.6, -0.76]]), '#cfc6a8', 240, INK, iw);
  P.shape(pts([[0.4, -0.74], [0.32, -0.8], [0.36, -0.7]]), shade(col, -0.12), 240, INK, iw);
  P.dot(...T([0.54, -0.66]), s * 0.012, INK); P.shape(pts(circlePts(0.64, -0.56, 0.035, 10)), '#d8a090', 240, null);
  P.line(pts([[0.3, -0.56], [0.24, -0.46], [0.3, -0.38]]), '#b3202a', iw * 1.6, 'gold', 0.5);   // garland
  for (let i = 0; i < 6; i++) P.dot(...T([0.3 - Math.sin(i / 5 * 3.1) * 0.06, -0.56 + i * 0.035]), s * 0.012, i % 2 ? '#f2b23a' : '#e04a6a');
  const tail = []; for (let i = 0; i < 6; i++) { const k = i / 5; tail.push([-0.42 - k * 0.06, -0.62 + k * 0.36 + Math.sin(t * 3 + k * 2) * 0.03]); } P.line(pts(tail), shade(col, -0.25), iw * 2, 'ink', 0.5);
  P.solid = false;
}
function elephant(P, x, y, s, f = 1, col = '#7a6a64', t = 0, howdah = 1) {   // a royal elephant (procession)
  const T = (p) => [x + p[0] * s * f, y + p[1] * s]; const pts = (a) => a.map(T); const iw = Math.max(0.6, s / 300);
  P.solid = true;
  for (const [lx, ph] of [[-0.3, 0], [-0.18, 1.6], [0.2, 0.8], [0.32, 2.4]]) { const sw = Math.sin(t * 2.4 + ph) * 0.02; P.shape(pts([[lx - 0.07, -0.42], [lx + 0.07, -0.42], [lx + 0.07 + sw, 0], [lx - 0.07 + sw, 0]]), shade(col, -0.1), 235, INK, iw); }
  P.shape(pts(chaikin([[-0.44, -0.4], [-0.46, -0.7], [-0.2, -0.9], [0.2, -0.92], [0.42, -0.78], [0.48, -0.5], [0.38, -0.36], [-0.36, -0.34]], 2)), col, 240, INK, iw * 1.2);
  P.shape(pts(chaikin([[0.36, -0.86], [0.56, -0.92], [0.66, -0.74], [0.64, -0.48], [0.6, -0.2], [0.66, -0.06], [0.6, -0.04], [0.52, -0.22], [0.52, -0.5], [0.42, -0.6]], 2)), col, 240, INK, iw);
  P.shape(pts(chaikin([[0.34, -0.84], [0.22, -0.8], [0.18, -0.58], [0.3, -0.5], [0.4, -0.6]], 1)), shade(col, -0.12), 240, INK, iw);   // ear
  P.line(pts([[0.6, -0.56], [0.72, -0.5], [0.74, -0.44]]), '#f4efe2', iw * 2.4, 'ink', 0.5);
  P.dot(...T([0.56, -0.76]), s * 0.012, INK);
  P.shape(pts([[-0.3, -0.88], [0.22, -0.9], [0.26, -0.5], [-0.34, -0.5]]), '#b3202a', 235, INK, iw);   // caparison
  for (let i = 0; i < 6; i++) P.dot(...T([-0.26 + i * 0.09, -0.52]), s * 0.016, GOLD2);
  P.shape(pts([[0.44, -0.86], [0.64, -0.84], [0.64, -0.7], [0.5, -0.66]]), GOLD, 235, INK, iw);   // forehead plate
  if (howdah) { P.shape(pts([[-0.24, -0.9], [0.16, -0.92], [0.12, -1.1], [-0.2, -1.1]]), GOLD, 240, INK, iw); P.shape(pts([[-0.26, -1.1], [0.18, -1.12], [-0.04, -1.3]]), '#b3202a', 240, INK, iw); }
  P.solid = false;
}
function tinyFolk(P, x, y, s, col, t = 0, ph = 0, load = 0) {   // a walking villager for wide shots
  const wasFast = P.fast; P.fast = true; const b = Math.sin(t * 5 + ph) * s * 0.02, sw = Math.sin(t * 5 + ph) * s * 0.08;
  P.shape([[x - s * 0.06, y - s * 0.25 + b], [x + s * 0.06, y - s * 0.25 + b], [x + s * 0.09, y - s * 0.62 + b], [x - s * 0.09, y - s * 0.62 + b]], col, 255, null);
  P.line([[x, y - s * 0.27 + b], [x - sw, y]], '#2a1a10', Math.max(1, s * 0.03), 'ink', 0); P.line([[x, y - s * 0.27 + b], [x + sw, y]], '#2a1a10', Math.max(1, s * 0.03), 'ink', 0);
  P.dot(x, y - s * 0.7 + b, s * 0.07, '#5a3a26');
  if (load) P.shape([[x - s * 0.1, y - s * 0.78 + b], [x + s * 0.1, y - s * 0.78 + b], [x + s * 0.07, y - s * 0.92 + b], [x - s * 0.07, y - s * 0.92 + b]], '#b5774a', 255, null);
  P.fast = wasFast;
}

// ---------------------------------------------------------------- Ganesha, the scribe ---
// (x, y) is the middle of the seat, S the seated height. hand: 0 leaves out the writing arm (it is animated separately).
function ganesha(P, o) {
  const x = o.x, y = o.y, S = o.S || 400, t = o.t || 0, f = o.f || 1;
  const T = (u, v) => [x + u * S * f, y - v * S]; const TT = (a) => a.map(p => T(p[0], p[1])); const iw = Math.max(0.8, S / 360);
  const skin = o.skin || '#e8906a', skD = shade(skin, -0.28), skDD = shade(skin, -0.45), skL = shade(skin, 0.22), cloth = '#f0b429', clothD = shade(cloth, -0.3), red = '#b3202a', grn = '#2e7a3a';
  const limb = (a, b, w0, w1) => chaikin(capsule(a, b, w0, w1), 1);
  const ear = Math.sin(t * 1.6) * 0.012;
  P.solid = true; P.noSilhouette();
  // ---- prabhavali: a flaming arch behind him ----
  for (let i = 0; i < 26; i++) { const a = (195 - i * 210 / 25) * D2R, r0 = 0.5, r1 = 0.56 + (i % 2) * 0.04; P.shape(TT([[Math.cos(a - 0.05) * r0, 0.62 + Math.sin(a - 0.05) * r0], [Math.cos(a) * r1, 0.62 + Math.sin(a) * r1], [Math.cos(a + 0.05) * r0, 0.62 + Math.sin(a + 0.05) * r0]]), i % 2 ? '#f08a24' : GOLD2, 235, '#7a2a08', iw * 0.6); }
  P.shape(TT(chaikin(arcPts(0, 0.62, 0.5, -15, 195, 30).concat(arcPts(0, 0.62, 0.44, 195, -15, 30)), 1)), GOLD, 245, '#7a4a10', iw);
  for (let i = 0; i < 15; i++) { const a = (190 - i * 200 / 14) * D2R; P.dot(...T(Math.cos(a) * 0.47, 0.62 + Math.sin(a) * 0.47), S * 0.008, i % 2 ? red : '#2a7a5a'); }
  P.wash(TT(circlePts(0, 0.66, 0.42, 30)), '#ffe6a0', 60, 0.04, 0.3, 0.2);
  // ---- double lotus pedestal ----
  P.shape(TT(chaikin([[-0.56, -0.12], [0.56, -0.12], [0.5, -0.05], [-0.5, -0.05]], 1)), '#6a1414', 250, INK, iw);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 13; i++) { const u = -0.54 + i * 0.09 + r * 0.045, v0 = r ? -0.05 : -0.1, h = r ? 0.08 : -0.06; if (u > 0.55) continue; P.shape(TT(chaikin([[u - 0.05, v0], [u - 0.03, v0 + h * 0.7], [u, v0 + h], [u + 0.03, v0 + h * 0.7], [u + 0.05, v0]], 1)), r ? (i % 2 ? '#f6b8c8' : '#ec8aa8') : '#c85a7a', 245, INK, iw * 0.6); }
  // ---- upper arms raised out past the ears: goad (left) and axe (right) ----
  for (const s of [-1, 1]) {
    const sh0 = [s * 0.2, 0.5], el = [s * 0.47, 0.55], hd = [s * 0.53, 0.72];
    P.shape(TT(limb(sh0, el, 0.055, 0.045)), skin, 248, INK, iw); P.shape(TT(limb(el, hd, 0.045, 0.035)), skin, 248, INK, iw);
    P.wash(TT(limb([el[0], el[1] + 0.01], [hd[0] - s * 0.01, hd[1] - 0.02], 0.016, 0.012)), skD, 120, 0.03);
    P.line(TT([[s * 0.33, 0.56], [s * 0.35, 0.5]]), GOLD, iw * 3.2, 'gold', 0); P.line(TT([[s * 0.5, 0.66], [s * 0.55, 0.66]]), GOLD, iw * 2.6, 'gold', 0);
  }
  // goad (ankusha) in the left hand: a gold shaft with a hooked tip
  P.line(TT([[-0.54, 0.62], [-0.53, 1.0]]), '#7a4a1a', iw * 2.6, 'ink', 0); P.line(TT([[-0.54, 0.62], [-0.53, 1.0]]), GOLD, iw * 1, 'gold', 0);
  P.shape(TT(chaikin([[-0.545, 0.98], [-0.53, 1.1], [-0.515, 0.98]], 1)), GOLD2, 252, '#7a4a10', iw * 0.8);
  P.line(TT(chaikin([[-0.53, 1.0], [-0.49, 1.02], [-0.47, 0.99], [-0.49, 0.96]], 2, false)), GOLD2, iw * 2.4, 'gold', 0.3);
  // axe (parashu) in the right hand: a wooden haft with a steel crescent blade
  P.line(TT([[0.54, 0.6], [0.53, 1.02]]), '#6a3a1a', iw * 2.8, 'ink', 0);
  P.shape(TT(chaikin([[0.535, 0.98], [0.6, 1.04], [0.65, 1.0], [0.655, 0.93], [0.62, 0.88], [0.535, 0.92]], 1)), '#cdd6de', 252, INK, iw * 0.9);
  P.line(TT(chaikin([[0.6, 1.03], [0.645, 0.99], [0.65, 0.93], [0.62, 0.89]], 2, false)), '#f6fafc', iw * 1.6, 'ink', 0.3);
  P.shape(TT([[0.52, 0.91], [0.55, 0.91], [0.55, 0.99], [0.52, 0.99]]), GOLD, 252, '#7a4a10', iw * 0.6);
  // the raised hands, palms forward
  for (const s of [-1, 1]) { P.shape(TT(chaikin(circlePts(s * 0.535, 0.72, 0.04, 10, 0.9, 1.1), 1)), skin, 252, INK, iw); for (let i = 0; i < 3; i++) P.line(TT([[s * 0.515 + i * 0.016, 0.745], [s * 0.515 + i * 0.016, 0.7]]), skD, iw * 0.7, 'ink', 0); }
  // ---- crossed legs, dhoti with border and folds ----
  P.shape(TT(chaikin([[-0.5, -0.04], [0.5, -0.04], [0.52, 0.1], [0.32, 0.2], [0.0, 0.17], [-0.32, 0.2], [-0.52, 0.1]], 2)), cloth, 248, INK, iw * 1.1);
  P.wash(TT([[-0.5, -0.02], [0.5, -0.02], [0.48, 0.04], [-0.48, 0.04]]), clothD, 110, 0.02);
  P.line(TT([[-0.5, -0.02], [0.5, -0.02]]), red, iw * 3.5, 'gold', 0); P.line(TT([[-0.5, 0.0], [0.5, 0.0]]), GOLD, iw * 1.2, 'gold', 0);
  for (let i = 0; i < 6; i++) P.line(TT([[-0.42 + i * 0.16, 0.03], [-0.36 + i * 0.15, 0.15]]), clothD, iw * 0.7, 'ink', 0.4);
  // the front pleats fan
  P.shape(TT([[-0.04, 0.16], [0.04, 0.16], [0.09, -0.06], [-0.09, -0.06]]), shade(cloth, 0.08), 250, INK, iw); for (let i = 0; i < 4; i++) P.line(TT([[-0.02 + i * 0.013, 0.15], [-0.07 + i * 0.045, -0.05]]), clothD, iw * 0.6, 'ink', 0);
  P.line(TT([[-0.09, -0.06], [0.09, -0.06]]), red, iw * 2.5, 'gold', 0);
  // the visible foot with red alta and an anklet
  P.shape(TT(chaikin([[0.18, 0.04], [0.36, 0.06], [0.42, 0.1], [0.36, 0.13], [0.2, 0.1]], 2)), skin, 250, INK, iw);
  P.line(TT([[0.38, 0.06], [0.42, 0.1], [0.37, 0.13]]), '#c1121f', iw * 1.6, 'ink', 0.5); for (let i = 0; i < 5; i++) P.dot(...T(0.2 + i * 0.012, 0.06 + i * 0.008), S * 0.006, GOLD2);
  // ---- belly and chest ----
  P.shape(TT(chaikin([[-0.22, 0.16], [0.22, 0.16], [0.3, 0.28], [0.27, 0.44], [0.21, 0.54], [-0.21, 0.54], [-0.27, 0.44], [-0.3, 0.28]], 2)), skin, 250, INK, iw * 1.1);
  P.wash(TT(chaikin([[0.12, 0.18], [0.29, 0.28], [0.26, 0.44], [0.14, 0.4], [0.18, 0.28]], 1)), skD, 120, 0.03);
  P.wash(TT(chaikin([[-0.2, 0.26], [-0.08, 0.22], [-0.04, 0.34], [-0.14, 0.38]], 1)), skL, 100, 0.03);
  P.wash(TT(chaikin([[-0.2, 0.5], [0.2, 0.5], [0.16, 0.44], [-0.16, 0.44]], 1)), skD, 70, 0.03);   // chest fold
  P.shape(TT(circlePts(0.0, 0.27, 0.014, 10, 1, 0.7)), skDD, 240, null);   // navel
  // serpent belt with a raised hood
  const belt = arcPts(0, 0.3, 0.24, 200, 340, 24).map(p => [p[0], 0.6 - p[1]]);
  P.line(belt, grn, iw * 5, 'ink', 0.5); P.line(belt.map(p => [p[0], p[1] + 0.004]), '#7ac07a', iw * 1.2, 'ink', 0.5);
  P.line(TT(belt), grn, iw * 5, 'ink', 0.5); P.line(TT(belt.map(p => [p[0], p[1] + 0.004])), '#8ad08a', iw * 1.2, 'ink', 0.5);
  P.shape(TT(chaikin([[0.2, 0.17], [0.24, 0.2], [0.26, 0.26], [0.22, 0.27], [0.19, 0.22]], 1)), grn, 252, INK, iw * 0.8); P.dot(...T(0.235, 0.24), S * 0.005, '#f6dc7a');
  // sacred thread and the orange shawl over one shoulder
  P.line(TT([[-0.19, 0.53], [-0.04, 0.38], [0.16, 0.2]]), '#f6f1e4', iw * 1.8, 'ink', 0.5);
  P.shape(TT(chaikin([[0.14, 0.54], [0.28, 0.52], [0.36, 0.42], [0.38, 0.24], [0.33, 0.24], [0.3, 0.4], [0.2, 0.47]], 1)), '#d8501a', 245, INK, iw); P.line(TT([[0.33, 0.24], [0.38, 0.24]]), GOLD, iw * 2, 'gold', 0);
  // ---- lower left hand holds the palm leaf on the knee ----
  P.shape(TT(limb([-0.22, 0.48], [-0.31, 0.31], 0.05, 0.045)), skin, 250, INK, iw); P.shape(TT(limb([-0.31, 0.31], [-0.17, 0.21], 0.045, 0.036)), skin, 250, INK, iw);
  P.line(TT([[-0.33, 0.33], [-0.28, 0.3]]), GOLD, iw * 3, 'gold', 0);
  P.shape(TT([[-0.32, 0.2], [0.08, 0.215], [0.08, 0.25], [-0.32, 0.235]]), '#e0c080', 252, INK, iw);
  P.line(TT([[-0.32, 0.2], [0.08, 0.215]]), shade('#e0c080', -0.25), iw * 0.8, 'ink', 0);
  for (let i = 0; i < 6; i++) P.line(TT([[-0.29, 0.222 + (i % 2) * 0.01], [-0.29 + 0.05 + i * 0.03, 0.224 + (i % 2) * 0.01]]), '#3a2a1a', iw * 0.6, 'ink', 0);
  P.shape(TT(chaikin([[-0.2, 0.2], [-0.13, 0.205], [-0.12, 0.235], [-0.19, 0.24]], 1)), skin, 252, INK, iw);   // palm under the leaf
  for (let i = 0; i < 3; i++) P.line(TT([[-0.19 + i * 0.022, 0.24], [-0.19 + i * 0.022, 0.255]]), skD, iw * 0.8, 'ink', 0);
  // a bowl of modaks on the seat
  P.shape(TT(chaikin([[-0.52, 0.0], [-0.38, 0.0], [-0.4, 0.06], [-0.5, 0.06]], 1)), GOLD, 250, '#7a4a10', iw);
  for (const [mu, mv] of [[-0.48, 0.08], [-0.44, 0.085], [-0.46, 0.115]]) P.shape(TT(chaikin([[mu - 0.022, mv - 0.01], [mu + 0.022, mv - 0.01], [mu + 0.006, mv + 0.035], [mu, mv + 0.045], [mu - 0.006, mv + 0.035]], 1)), '#f2e2b8', 252, INK, iw * 0.7);
  // the mouse, his mount
  P.shape(TT(chaikin([[0.42, -0.04], [0.56, -0.04], [0.6, 0.0], [0.56, 0.05], [0.46, 0.05], [0.42, 0.01]], 2)), '#8a8088', 250, INK, iw);
  P.shape(TT(circlePts(0.57, 0.05, 0.02, 10)), '#d8a0a8', 250, INK, iw * 0.6); P.dot(...T(0.59, 0.02), S * 0.005, INK); P.line(TT([[0.42, 0.0], [0.36, -0.03], [0.33, 0.0]]), '#8a8088', iw * 1.2, 'ink', 0.5);
  P.shape(TT(chaikin([[0.6, -0.01], [0.64, -0.01], [0.63, 0.02], [0.61, 0.025]], 1)), '#f2e2b8', 252, INK, iw * 0.6);
  // ---- necklaces and a garland of marigold and jasmine ----
  P.line(TT(arcPts(0, 0.6, 0.12, 200, 340, 18).map(p => [p[0], 1.2 - p[1]])), GOLD, iw * 3, 'gold', 0.5);
  P.line(TT(arcPts(0, 0.6, 0.16, 200, 340, 18).map(p => [p[0], 1.2 - p[1]])), red, iw * 2, 'gold', 0.5);
  P.shape(TT(chaikin([[0, 0.43], [0.03, 0.46], [0, 0.49], [-0.03, 0.46]], 1)), GOLD2, 252, '#7a4a10', iw * 0.7); P.dot(...T(0, 0.46), S * 0.01, red);
  for (let i = 0; i <= 30; i++) { const a = (205 + i * 130 / 30) * D2R; P.dot(...T(Math.cos(a) * 0.23, 0.58 + Math.sin(a) * 0.33), S * 0.013, i % 3 === 2 ? '#f6f1e4' : i % 3 ? '#f08a24' : '#f2b23a', 252); }
  // ---- ears with painted borders ----
  for (const s of [-1, 1]) {
    const E = [[s * 0.1, 0.8], [s * 0.3, 0.88 + ear], [s * 0.4, 0.76], [s * 0.39, 0.6], [s * 0.3, 0.5 - ear], [s * 0.2, 0.52], [s * 0.12, 0.6]];
    P.shape(TT(chaikin(E, 2)), skin, 250, INK, iw);
    P.shape(TT(chaikin([[s * 0.15, 0.77], [s * 0.29, 0.83 + ear], [s * 0.35, 0.74], [s * 0.34, 0.62], [s * 0.28, 0.55 - ear], [s * 0.18, 0.58]], 2)), '#f4b8a0', 230, null);
    P.line(TT(chaikin([[s * 0.16, 0.79], [s * 0.3, 0.855 + ear], [s * 0.375, 0.75], [s * 0.37, 0.61], [s * 0.3, 0.525 - ear]], 2, false)), red, iw * 2.2, 'ink', 0.5);
    for (let i = 0; i < 7; i++) { const k = i / 6, p = [s * (0.2 + 0.15 * Math.sin(k * 2.6)), 0.82 - k * 0.27]; P.dot(...T(p[0], p[1]), S * 0.009, i % 2 ? GOLD2 : '#2a7a5a'); }
    P.wash(TT(chaikin([[s * 0.14, 0.62], [s * 0.22, 0.58], [s * 0.18, 0.7]], 1)), skD, 80, 0.03);
    P.circle(...T(s * 0.31, 0.5), S * 0.024, GOLD2, 245, '#7a4a10', iw * 0.6); P.dot(...T(s * 0.31, 0.5), S * 0.01, red);
  }
  // ---- head: domed brow with two bumps ----
  P.shape(TT(chaikin([[-0.17, 0.6], [-0.2, 0.74], [-0.16, 0.84], [-0.08, 0.89], [0, 0.865], [0.08, 0.89], [0.16, 0.84], [0.2, 0.74], [0.17, 0.6], [0.09, 0.54], [-0.09, 0.54]], 2)), skin, 252, INK, iw * 1.1);
  P.wash(TT(chaikin([[0.08, 0.6], [0.16, 0.66], [0.16, 0.78], [0.1, 0.72]], 1)), skD, 100, 0.03);
  P.wash(TT(chaikin([[-0.12, 0.76], [-0.04, 0.8], [-0.06, 0.84], [-0.13, 0.81]], 1)), skL, 90, 0.03);
  // mouth under the trunk, a small smile
  P.shape(TT(chaikin([[-0.06, 0.58], [0.06, 0.58], [0.04, 0.555], [-0.04, 0.555]], 1)), '#b04a4a', 245, INK, iw * 0.7);
  // eyes: almond, lidded, lined with kohl
  for (const s of [-1, 1]) {
    const E = [[s * 0.035, 0.715], [s * 0.07, 0.733], [s * 0.11, 0.722], [s * 0.12, 0.712], [s * 0.075, 0.703]];
    P.shape(TT(chaikin(E, 1)), '#fbf4e6', 252, null);
    P.circle(...T(s * 0.077, 0.716), S * 0.011, '#3a2412', 252); P.dot(...T(s * 0.077, 0.716), S * 0.006, '#0a0605', 255); P.dot(...T(s * 0.074, 0.72), S * 0.003, '#ffffff', 255);
    P.line(TT([[s * 0.03, 0.716], [s * 0.07, 0.736], [s * 0.115, 0.725], [s * 0.135, 0.73]]), INK, iw * 1.6, 'ink', 0.5);
    P.line(TT([[s * 0.035, 0.712], [s * 0.075, 0.701], [s * 0.12, 0.71]]), INK, iw * 0.7, 'ink', 0.5);
    P.line(TT([[s * 0.04, 0.752], [s * 0.08, 0.762], [s * 0.12, 0.755]]), skDD, iw * 1.2, 'ink', 0.5);   // brow fold
  }
  // tilak: three white lines with a red mark
  for (let i = 0; i < 3; i++) P.line(TT([[-0.07, 0.785 + i * 0.016], [0.07, 0.785 + i * 0.016]]), '#f6f1e4', iw * 1.5, 'ink', 0.2);
  P.shape(TT(chaikin([[0, 0.77], [0.015, 0.8], [0, 0.835], [-0.015, 0.8]], 1)), '#c1121f', 252, null);
  // ---- trunk: tapering, ringed, curling with a modak at its tip ----
  const tr = chaikin([[0, 0.7], [-0.004, 0.62], [-0.016, 0.54], [-0.05, 0.47], [-0.1, 0.42], [-0.16, 0.42], [-0.19, 0.46], [-0.17, 0.5], [-0.13, 0.5]], 2, false);
  P.shape(TT(ribbon(tr, 0.058, 0.018)), skin, 252, INK, iw);
  P.wash(TT(ribbon(tr.slice(0, Math.floor(tr.length * 0.6)).map(p => [p[0] + 0.03, p[1]]), 0.025, 0.01)), skD, 110, 0.02);
  for (let i = 2; i < tr.length - 3; i += 2) { const a = tr[i], b = tr[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = (0.058 + (0.018 - 0.058) * i / (tr.length - 1)) * 0.9; P.line(TT([[a[0] - dy / l * w, a[1] + dx / l * w], [a[0] + dx * 0.4, a[1] + dy * 0.4 - 0.004], [a[0] + dy / l * w, a[1] - dx / l * w]]), skDD, iw * 0.7, 'ink', 0.6); }
  P.shape(TT(chaikin([[-0.15, 0.49], [-0.11, 0.49], [-0.12, 0.53], [-0.13, 0.54], [-0.14, 0.53]], 1)), '#f2e2b8', 252, INK, iw * 0.7);   // modak in the trunk
  // tusks: the whole one curving out, the broken stub
  P.shape(TT(chaikin([[-0.045, 0.6], [-0.08, 0.585], [-0.115, 0.535], [-0.11, 0.525], [-0.075, 0.56], [-0.035, 0.58]], 1)), '#fbf4e6', 252, INK, iw * 0.8);
  P.shape(TT(chaikin([[0.04, 0.6], [0.07, 0.585], [0.078, 0.565], [0.05, 0.575]], 1)), '#fbf4e6', 252, INK, iw * 0.8);
  // ---- crown: tiered kirita with jewels, side flares and a pearl string ----
  P.shape(TT([[-0.16, 0.84], [0.16, 0.84], [0.15, 0.9], [-0.15, 0.9]]), GOLD, 252, '#7a4a10', iw * 1.1);
  for (let i = 0; i < 9; i++) P.dot(...T(-0.14 + i * 0.035, 0.87), S * 0.008, i % 2 ? red : '#2a7a5a');
  P.shape(TT(chaikin([[-0.14, 0.9], [0.14, 0.9], [0.12, 0.99], [0.08, 1.07], [0.03, 1.13], [0, 1.16], [-0.03, 1.13], [-0.08, 1.07], [-0.12, 0.99]], 1)), GOLD2, 252, '#7a4a10', iw * 1.2);
  for (let i = 0; i < 3; i++) { const v = 0.94 + i * 0.06, w = 0.13 - i * 0.03; P.line(TT([[-w, v], [w, v]]), shade(GOLD, -0.2), iw * 1.2, 'gold', 0); for (let k = -2; k <= 2; k++) P.dot(...T(k * w / 2.5, v + 0.02), S * 0.006, k % 2 ? red : GOLD); }
  P.shape(TT(chaikin([[0, 0.92], [0.03, 0.96], [0, 1.0], [-0.03, 0.96]], 1)), red, 252, '#7a4a10', iw * 0.8); P.dot(...T(0, 0.96), S * 0.008, '#f6f1e4');
  for (const s of [-1, 1]) P.shape(TT(chaikin([[s * 0.15, 0.86], [s * 0.24, 0.92], [s * 0.22, 0.98], [s * 0.16, 0.94]], 1)), GOLD, 250, '#7a4a10', iw * 0.8);
  P.shape(TT(chaikin([[-0.012, 1.15], [0.012, 1.15], [0, 1.21]], 1)), GOLD2, 252, '#7a4a10', iw * 0.6); P.dot(...T(0, 1.2), S * 0.008, red);
  for (let i = 0; i < 9; i++) P.dot(...T(-0.12 + i * 0.03, 0.835 - Math.sin(i / 8 * Math.PI) * 0.02), S * 0.006, '#f6f1e4');
  // lower right hand: the broken tusk as a stylus, writing
  if (o.hand !== 0) ganeshaHand(P, o);
  P.solid = false;
}
function ganeshaHand(P, o) {
  const x = o.x, y = o.y, S = o.S || 400, t = o.t || 0, f = o.f || 1;
  const T = (u, v) => [x + u * S * f, y - v * S]; const TT = (a) => a.map(p => T(p[0], p[1])); const iw = Math.max(0.8, S / 360);
  const skin = o.skin || '#e8906a', skD = shade(skin, -0.28);
  const k = o.write === 0 ? 0.6 : (Math.sin(t * 2.2) * 0.5 + 0.5), ww = Math.sin(t * 17) * 0.006;
  const hand = [-0.18 + k * 0.22, 0.26 + ww], el = [0.31, 0.32];
  P.solid = true;
  P.shape(TT(chaikin(capsule([0.22, 0.48], el, 0.05, 0.045), 1)), skin, 250, INK, iw); P.shape(TT(chaikin(capsule(el, hand, 0.045, 0.036), 1)), skin, 250, INK, iw);
  P.line(TT([[el[0] - 0.03, el[1] + 0.06], [el[0] + 0.035, el[1] + 0.07]]), GOLD, iw * 3, 'gold', 0);
  const bx = hand[0] + (el[0] - hand[0]) * 0.18, by = hand[1] + (el[1] - hand[1]) * 0.18; P.line(TT([[bx - 0.015, by + 0.03], [bx + 0.02, by - 0.01]]), GOLD, iw * 2.4, 'gold', 0);   // bangle
  P.shape(TT(chaikin(circlePts(hand[0], hand[1], 0.036, 10, 1.1, 0.9), 1)), skin, 252, INK, iw);
  for (let i = 0; i < 3; i++) P.line(TT([[hand[0] - 0.03 + i * 0.018, hand[1] + 0.025], [hand[0] - 0.034 + i * 0.018, hand[1] - 0.005]]), skD, iw * 0.7, 'ink', 0);
  P.shape(TT(chaikin([[hand[0] + 0.012, hand[1] + 0.045], [hand[0] + 0.022, hand[1] + 0.04], [hand[0] - 0.03, hand[1] - 0.03], [hand[0] - 0.036, hand[1] - 0.032]], 1)), '#fbf4e6', 252, INK, iw * 0.7);   // tusk stylus
  P.solid = false;
}

// ---------------------------------------------------------------- Vyasa seated ---
function vyasaSeated(P, o) {
  const x = o.x, y = o.y, S = o.S || 400, t = o.t || 0, f = o.f || 1;
  const T = (u, v) => [x + u * S * f, y - v * S]; const TT = (a) => a.map(p => T(p[0], p[1])); const iw = Math.max(0.8, S / 360);
  const skin = '#6e4a30', cloth = '#c8762a';
  P.solid = true; P.noSilhouette();
  const skD = shade(skin, -0.3), skL = shade(skin, 0.18), clD = shade(cloth, -0.3), clL = shade(cloth, 0.15), bark = '#8a5a32';
  const limb = (a, b, w0, w1) => chaikin(capsule(a, b, w0, w1), 1);
  // deer-skin mat with its spots, the head and legs trailing
  P.shape(TT(chaikin([[-0.66, 0.0], [-0.5, 0.03], [0.5, 0.03], [0.66, 0.0], [0.7, -0.05], [0.6, -0.09], [-0.6, -0.09], [-0.7, -0.05]], 2)), '#b08450', 245, INK, iw);
  P.wash(TT([[-0.6, -0.06], [0.6, -0.06], [0.6, -0.09], [-0.6, -0.09]]), '#7a5430', 120, 0.02);
  for (let i = 0; i < 16; i++) P.dot(...T(-0.56 + i * 0.075 + (i % 2) * 0.02, -0.03 - (i % 3) * 0.015), S * 0.009, '#f4efe2', 220);
  P.shape(TT(chaikin([[0.66, 0.0], [0.78, 0.01], [0.82, -0.03], [0.74, -0.06], [0.68, -0.05]], 1)), '#9a7040', 245, INK, iw * 0.8);
  // wooden water pot (kamandalu)
  P.shape(TT(chaikin([[0.5, 0.02], [0.62, 0.02], [0.66, 0.08], [0.62, 0.15], [0.5, 0.15], [0.46, 0.08]], 2)), '#5a3a20', 250, INK, iw); P.wash(TT(chaikin([[0.52, 0.05], [0.56, 0.05], [0.56, 0.12], [0.52, 0.12]], 1)), '#8a6040', 120, 0.02);
  P.line(TT(chaikin([[0.6, 0.15], [0.62, 0.22], [0.54, 0.24], [0.52, 0.16]], 2, false)), '#3a2412', iw * 1.6, 'ink', 0.3); P.line(TT([[0.64, 0.12], [0.7, 0.16]]), '#5a3a20', iw * 2.2, 'ink', 0);
  // crossed legs in bark-coloured ochre cloth, with folds and a hem
  P.shape(TT(chaikin([[-0.52, 0.02], [0.52, 0.02], [0.54, 0.12], [0.36, 0.21], [0.0, 0.18], [-0.36, 0.21], [-0.54, 0.12]], 2)), cloth, 245, INK, iw * 1.1);
  P.wash(TT([[-0.52, 0.03], [0.52, 0.03], [0.5, 0.08], [-0.5, 0.08]]), clD, 110, 0.02);
  P.line(TT([[-0.52, 0.04], [0.52, 0.04]]), bark, iw * 3, 'ink', 0); P.line(TT([[-0.52, 0.06], [0.52, 0.06]]), '#e8c070', iw * 1, 'gold', 0);
  for (let i = 0; i < 6; i++) P.line(TT([[-0.44 + i * 0.17, 0.08], [-0.38 + i * 0.16, 0.17]]), clD, iw * 0.7, 'ink', 0.4);
  // the upturned sole of one foot on the thigh
  P.shape(TT(chaikin([[-0.34, 0.12], [-0.2, 0.14], [-0.14, 0.17], [-0.2, 0.2], [-0.32, 0.18]], 2)), skin, 250, INK, iw); P.wash(TT(chaikin([[-0.3, 0.14], [-0.2, 0.155], [-0.21, 0.18]], 1)), '#a0705a', 140, 0.02);
  for (let i = 0; i < 4; i++) P.dot(...T(-0.15 - i * 0.012, 0.185 - i * 0.004), S * 0.006, skD);
  // torso: lean chest, ribs and the line of the belly
  P.shape(TT(chaikin([[-0.23, 0.16], [0.23, 0.16], [0.25, 0.3], [0.24, 0.44], [0.17, 0.52], [-0.17, 0.52], [-0.24, 0.44], [-0.25, 0.3]], 2)), skin, 245, INK, iw);
  P.wash(TT(chaikin([[0.1, 0.18], [0.24, 0.3], [0.22, 0.46], [0.12, 0.4]], 1)), skD, 120, 0.03); P.wash(TT(chaikin([[-0.2, 0.3], [-0.08, 0.28], [-0.06, 0.42], [-0.18, 0.44]], 1)), skL, 90, 0.03);
  for (let i = 0; i < 3; i++) P.line(TT(chaikin([[-0.16, 0.42 - i * 0.04], [-0.09, 0.4 - i * 0.04], [-0.04, 0.41 - i * 0.04]], 1, false)), skD, iw * 0.7, 'ink', 0.5);
  P.line(TT([[0, 0.3], [0, 0.36]]), skD, iw * 0.8, 'ink', 0.5);
  // sacred thread and rudraksha mala
  P.line(TT([[-0.17, 0.51], [-0.02, 0.36], [0.18, 0.18]]), '#f6f1e4', iw * 1.6, 'ink', 0.5);
  for (let i = 0; i <= 22; i++) { const k = i / 22, a = Math.PI * (1.08 + k * 0.84); P.dot(...T(Math.cos(a) * 0.15, 0.53 + Math.sin(a) * 0.24), S * 0.011, '#6a2a1a'); }
  // the upper cloth draped over the left shoulder, with a dark border and folds
  const dr = chaikin([[-0.25, 0.44], [-0.12, 0.54], [0.04, 0.52], [0.26, 0.24], [0.25, 0.16], [0.1, 0.16], [-0.04, 0.3], [-0.2, 0.36]], 2);
  P.shape(TT(dr), cloth, 245, INK, iw); P.wash(TT(chaikin([[0.04, 0.5], [0.24, 0.24], [0.18, 0.2], [0.02, 0.4]], 1)), clD, 120, 0.03);
  P.wash(TT(chaikin([[-0.2, 0.42], [-0.08, 0.5], [-0.06, 0.45], [-0.16, 0.38]], 1)), clL, 110, 0.03);
  P.line(TT(chaikin([[-0.2, 0.36], [-0.04, 0.3], [0.1, 0.16]], 1, false)), bark, iw * 2.6, 'ink', 0.4);
  for (let i = 0; i < 4; i++) P.line(TT([[-0.1 + i * 0.07, 0.48 - i * 0.07], [-0.02 + i * 0.07, 0.36 - i * 0.06]]), clD, iw * 0.7, 'ink', 0.5);
  // right arm: resting on the knee, holding the rosary
  P.shape(TT(limb([0.2, 0.46], [0.33, 0.3], 0.05, 0.042)), skin, 248, INK, iw); P.shape(TT(limb([0.33, 0.3], [0.38, 0.15], 0.042, 0.034)), skin, 248, INK, iw);
  P.wash(TT(limb([0.25, 0.42], [0.33, 0.31], 0.015, 0.012)), skD, 110, 0.03);
  P.line(TT([[0.35, 0.21], [0.4, 0.2]]), '#3a2412', iw * 2.2, 'ink', 0);   // rudraksha bracelet
  P.shape(TT(chaikin([[0.35, 0.16], [0.42, 0.16], [0.44, 0.12], [0.4, 0.09], [0.35, 0.1]], 2)), skin, 250, INK, iw);
  for (let i = 0; i < 3; i++) P.line(TT([[0.37 + i * 0.02, 0.15], [0.375 + i * 0.02, 0.1]]), skD, iw * 0.7, 'ink', 0);
  for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; P.dot(...T(0.4 + Math.cos(a) * 0.045, 0.06 + Math.sin(a) * 0.055), S * 0.009, '#5a2a1a'); }
  // left hand raised in the teaching mudra, thumb and finger joined
  const lift = Math.sin(t * 1.1) * 0.01;
  P.shape(TT(limb([-0.2, 0.46], [-0.33, 0.31], 0.05, 0.042)), skin, 248, INK, iw); P.shape(TT(limb([-0.33, 0.31], [-0.29, 0.46 + lift], 0.042, 0.034)), skin, 248, INK, iw);
  P.wash(TT(limb([-0.26, 0.42], [-0.32, 0.33], 0.015, 0.012)), skD, 110, 0.03);
  P.line(TT([[-0.33, 0.4 + lift], [-0.27, 0.41 + lift]]), '#3a2412', iw * 2.2, 'ink', 0);
  const hx = -0.29, hy = 0.5 + lift;
  P.shape(TT(chaikin([[hx - 0.035, hy - 0.035], [hx + 0.03, hy - 0.035], [hx + 0.035, hy + 0.02], [hx - 0.035, hy + 0.02]], 2)), skin, 250, INK, iw);
  for (let i = 0; i < 3; i++) P.shape(TT(limb([hx - 0.012 + i * 0.022, hy + 0.015], [hx - 0.014 + i * 0.024, hy + 0.07 - Math.abs(i - 1) * 0.01], 0.011, 0.009)), skin, 252, INK, iw * 0.7);
  P.circle(...T(hx - 0.04, hy + 0.01), S * 0.014, skin, 252, INK, iw * 0.7); P.dot(...T(hx - 0.04, hy + 0.01), S * 0.005, skD);
  P.dot(...T(hx, hy - 0.01), S * 0.008, '#c1121f');
  P.solid = false;
  // the head and bust from the portrait painter, scaled to the seated body
  portrait(P, 'vyasa', { x: x + 0.03 * S * f, y: y - 0.7 * S, R: S * 0.125, f, expr: o.expr || 'calm', t, talk: o.talk });
}

// ---------------------------------------------------------------- sets ---
Object.assign(SETS, {
  // Vyasa's cave high in the Himalaya: rock arch open to the peaks, lamplight inside
  cave(P, o) {
    const view = o.view || 'night';
    P.flat([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], '#140c0a');
    // the view through the mouth of the cave
    const vx = o.mouth || 800;
    const pal = TOD[view] || TOD.night; skyBands(P, pal, 0, 620, 6, 200);
    if (view === 'night') { stars(P, 140, '#efe6cf', 520); P.wash(circlePts(vx + 260, 160, 60, 24), '#f2ecd0', 230, 0.02); }
    if (view === 'dawn') sunDisc(P, vx + 160, 470, 70, '#e8703a');
    for (let L = 0; L < 3; L++) { const base = 420 + L * 70, col = mixc(view === 'night' ? '#8aa0c8' : '#f2e6d6', view === 'night' ? '#1a2238' : '#8a6a6a', 0.2 + L * 0.3); const pts = [[-60, 760]]; for (let x2 = -60; x2 <= 1660; x2 += 50) pts.push([x2, base - Math.abs(Math.sin(x2 * 0.007 + L * 2.1)) * (200 - L * 50) - P.r(0, 20)]); pts.push([1660, 760]); P.wash(pts, col, 230, 0.01, 0.5, 0.3); }
    cloudBank(P, 560, view === 'night' ? '#3a4a6a' : '#f6efe6', 100, 6, 40);
    // rock frame around the mouth
    P.solid = true;
    const rock = '#3a2620', rk2 = '#2a1a16';
    const rockPts = [[-60, -60], [1660, -60], [1660, 960], [vx + 520, 960], [vx + 470, 640], [vx + 420, 330], [vx + 300, 130], [vx + 80, 60], [vx - 160, 80], [vx - 360, 180], [vx - 470, 380], [vx - 520, 640], [vx - 560, 960], [-60, 960]];
    P.flat(rockPts, rock); P.shape(rockPts, rock, 252, INK, 1.4);
    for (let i = 0; i < 26; i++) { const ang = P.r(0, 6.28), rr = P.r(560, 900), px = vx + Math.cos(ang) * rr, py = 420 + Math.sin(ang) * rr * 0.75; P.wash(circlePts(px, py, P.r(40, 120), 12, 1.4, 0.7), i % 2 ? rk2 : shade(rock, 0.1), 90, 0.03, 0.5, 0.3); }
    for (let i = 0; i < 18; i++) { const x0 = P.r(-60, 1660), y0 = P.r(0, 900); P.line([[x0, y0], [x0 + P.r(-80, 80), y0 + P.r(30, 140)]], '#120a08', 1, 'ink', 0.4); }
    // floor
    P.shape([[-60, 760], [1660, 760], [1660, 960], [-60, 960]], '#2e1e18', 250, null);
    P.wash([[-60, 760], [1660, 760], [1660, 800], [-60, 800]], '#4a3026', 150, 0.02);
    P.solid = false;
    // lamplight
    for (const lx of (o.lamps || [520, 1100])) { lampGlow(P, lx, 700, 260, '#ff9a40'); lamp(P, lx, 790, 1.1, 0); }
    if (o.leaves !== 0) { palmLeaves(P, o.lx || 1250, 830, 150, 8); palmLeaves(P, (o.lx || 1250) + 170, 845, 130, 5); palmLeaves(P, (o.lx || 1250) - 900, 840, 120, 4); }
  },
  // a sweep of country: layered ranges, a river winding from the foreground into the distance, groves, perhaps a far city
  valley(P, o) {
    const pal = o.sky || TOD[o.tod || 'dawn'], hz = o.hz || 470;
    sky(P, Object.assign({ hz: hz + 40 }, o));
    for (let L = 0; L < 3; L++) { const base = hz - 40 + L * 40, col = mixc(pal[2], '#3a4a5a', 0.25 + L * 0.2); const pts = [[-60, 960]]; for (let x2 = -60; x2 <= 1660; x2 += 40) pts.push([x2, base - Math.abs(Math.sin(x2 * 0.004 + L * 1.3 + (o.seed || 0))) * (140 - L * 40)]); pts.push([1660, 960]); P.wash(pts, col, 210, 0.01, 0.5, 0.3); }
    if (o.city) { P.solid = true; const cx = o.city[0], cw = o.city[1] || 260; for (let i = 0; i < 9; i++) shikhara(P, cx - cw / 2 + i * cw / 8, hz + 10, 8 + (i % 3) * 4, 30 + (i % 4) * 14, mixc('#c98a5a', pal[1], 0.4)); P.shape([[cx - cw / 2 - 20, hz + 14], [cx + cw / 2 + 20, hz + 14], [cx + cw / 2 + 20, hz + 2], [cx - cw / 2 - 20, hz + 2]], mixc('#a0704a', pal[1], 0.4), 230, INK, 0.6); P.solid = false; }
    ground(P, hz + 10, mixc(o.land || '#6a7a3a', pal[1], 0.35), 230);
    // fields as soft bands
    for (let i = 0; i < 7; i++) { const y0 = hz + 30 + i * i * 9; P.wash([[-60, y0], [1660, y0 - 6], [1660, y0 + 6 + i * 4], [-60, y0 + 10 + i * 4]], i % 2 ? mixc('#9a9a4a', pal[1], 0.3) : mixc('#5a7a3a', pal[1], 0.3), 90, 0.02, 0.6, 0.3); }
    // the river: narrow far away, wide in front
    const rx = o.riverX || 900, wc = mixc('#4a86a8', pal[0], 0.3);
    const L1 = [], R1 = []; for (let i = 0; i <= 20; i++) { const k = i / 20, yy = hz + 12 + k * k * (960 - hz), w = 6 + k * k * 380, cx = rx + Math.sin(k * 5.5 + (o.seed || 0)) * (60 + 220 * k) - k * 200; L1.push([cx - w, yy]); R1.push([cx + w, yy]); }
    P.wash(L1.concat(R1.reverse()), wc, 225, 0.01, 0.5, 0.2);
    P.noMask(); for (let i = 0; i < 12; i++) { const k = 0.3 + i / 16, yy = hz + 12 + k * k * (960 - hz), cx = rx + Math.sin(k * 5.5 + (o.seed || 0)) * (60 + 220 * k) - k * 200; P.line([[cx - 30 - k * 120, yy], [cx + 30 + k * 120, yy + 2]], shade(pal[0], 0.3), 0.8, 'fine', 0.2); } P.mask();
    // groves
    for (let i = 0; i < (o.groves ?? 14); i++) { const k = P.r(0.1, 0.9), yy = hz + 20 + k * k * 380, xx = P.r(-60, 1660), s = 8 + k * 40; for (let j = 0; j < 3; j++) P.shape(circlePts(xx + j * s * 0.8, yy - s * 0.6, s * 0.6, 10, 1.1, 0.8), mixc(['#2e5a34', '#3a6a3a', '#4a7a3a'][j], pal[1], 0.4 - k * 0.3), 220, null); }
    if (o.mist !== 0) { P.noMask(); for (let i = 0; i < 3; i++) P.wash([[-60, hz - 10 + i * 30], [1660, hz - 20 + i * 30], [1660, hz + 20 + i * 30], [-60, hz + 30 + i * 30]], '#f2f0e8', 60, 0.04, 0.6, 0.3); P.mask(); }
  },
  // Hastinapura from across the Ganga: walls, gates, temple towers, palace, flags
  city(P, o) {
    const pal = o.sky || TOD[o.tod || 'gold'], hz = o.hz || 560;
    sky(P, Object.assign({ hz: hz + 40 }, o));
    hills(P, hz - 70, 40, shade(pal[2], -0.35), 150, 3);
    P.solid = true;
    const wall = o.col || '#c98a5a';
    for (let i = 0; i < 22; i++) { const bx = 40 + i * 72 + P.r(-10, 10), h = P.r(60, 200) * (1 - Math.abs(i - 11) / 22); shikhara(P, bx, hz - 40, 14 + h * 0.08, h, mixc(shade(wall, P.r(-0.1, 0.12)), pal[1], 0.35)); }
    palace(P, 520, hz - 30, 560, 320, mixc(wall, pal[1], 0.2));
    P.shape([[-60, hz - 40], [1660, hz - 40], [1660, hz + 30], [-60, hz + 30]], shade(wall, -0.2), 245, INK, 1);
    for (let i = 0; i < 40; i++) P.shape([[i * 42 - 40, hz - 40], [i * 42 - 20, hz - 40], [i * 42 - 20, hz - 54], [i * 42 - 40, hz - 54]], shade(wall, -0.2), 245, INK, 0.7);
    for (const gx of [260, 800, 1340]) { P.shape([[gx - 60, hz + 30], [gx + 60, hz + 30], [gx + 60, hz - 110], [gx + 30, hz - 140], [gx - 30, hz - 140], [gx - 60, hz - 110]], shade(wall, -0.05), 245, INK, 1); P.shape([[gx - 26, hz + 30], [gx + 26, hz + 30], [gx + 26, hz - 30], [gx, hz - 50], [gx - 26, hz - 30]], '#2a1410', 250, INK, 0.8); }
    for (let i = 0; i < 9; i++) { const fx = 120 + i * 175; P.line([[fx, hz - 54], [fx, hz - 110]], INK, 1, 'ink', 0); P.wash([[fx, hz - 110], [fx + 30, hz - 104], [fx, hz - 96]], i % 2 ? '#c7362b' : GOLD, 230, 0.004); }
    P.solid = false;
    // the river in front
    const wc = mixc(pal[1], '#2a5a7a', 0.55); riverWaves(P, hz + 40, 960, wc, shade(wc, -0.4));
    P.noMask(); for (let i = 0; i < 5; i++) { const y = hz + 50 + i * 20; P.wash([[-60, y], [1660, y - 6], [1660, y + 10], [-60, y + 14]], pal[2], 60 - i * 10, 0.03, 0.6, 0.2); } P.mask();
    if (o.ghats) { P.solid = true; for (let i = 0; i < 6; i++) P.shape([[200 + i * 30, hz + 30 + i * 12], [1400 - i * 30, hz + 30 + i * 12], [1400 - i * 30, hz + 42 + i * 12], [200 + i * 30, hz + 42 + i * 12]], shade('#b89a7a', -i * 0.04), 245, INK, 0.7); P.solid = false; }
  },
  // a forest hermitage: huts, a sacred fire, a cow, a stream
  ashram(P, o) {
    SETS.forest(P, Object.assign({ tod: o.tod || 'day' }, o, { hut: undefined }));
    P.solid = true;
    for (const [hx, s] of (o.huts || [[420, 1], [1180, 0.8]])) { P.shape([[hx - 130 * s, 780], [hx + 130 * s, 780], [hx + 130 * s, 780 - 140 * s], [hx - 130 * s, 780 - 140 * s]], '#8a6a3a', 240, INK, 1); P.shape([[hx - 170 * s, 780 - 130 * s], [hx, 780 - 250 * s], [hx + 170 * s, 780 - 130 * s]], '#b8964a', 240, INK, 1.2); P.shape([[hx - 36 * s, 780], [hx + 36 * s, 780], [hx + 36 * s, 780 - 90 * s], [hx - 36 * s, 780 - 90 * s]], '#1a0e08', 245, INK, 1); }
    const fx = o.fire || 800; P.shape([[fx - 70, 830], [fx + 70, 830], [fx + 60, 800], [fx - 60, 800]], '#8a5a3a', 245, INK, 1); P.shape([[fx - 50, 800], [fx + 50, 800], [fx + 44, 790], [fx - 44, 790]], '#5a3a26', 245, INK, 0.8);
    P.solid = false;
    flames(P, fx, 792, 60, 80, 0);
    P.noMask(); for (let i = 0; i < 5; i++) P.wash(circlePts(fx + i * 18 + P.r(-10, 10), 700 - i * 70, 30 + i * 12, 14, 1.3, 0.8), '#e8e4dc', 40, 0.06, 0.6, 0.3); P.mask();
    if (o.cow) cow(P, o.cow[0], o.cow[1], o.cow[2] || 220, o.cow[3] || 1);
  },
  // above the clouds, the realm of the gods
  sky_realm(P, o) {
    skyBands(P, o.sky || ['#3a2a6a', '#c86a8a', '#f6c890'], 0, 900, 8, 170);
    sunDisc(P, o.sunX || 1180, o.sunY || 300, 90, '#f6d070', 230);
    for (let i = 0; i < 7; i++) cloudBank(P, 420 + i * 70, ['#fff4e8', '#f8e0d0', '#f0c8b8', '#e8b8c0'][i % 4], 170, 7, 80);
    if (o.peak) { const pts = [[o.peak - 420, 960], [o.peak - 120, 520], [o.peak, 420], [o.peak + 160, 540], [o.peak + 460, 960]]; P.wash(pts, '#eef2f4', 240, 0.01, 0.4, 0.3); P.line(pts.slice(1, -1), '#8aa0c0', 1, 'ink', 0.3); }
  },
});

// ---------------------------------------------------------------- pieces ---
Object.assign(PIECES, {
  // a reed basket carrying a baby down the river, golden light inside
  basket: (P, t, a) => { P.fast = true; const x = (a.x || 800) + t * (a.speed || 18), y = (a.y || 720) + Math.sin(t * 1.3) * 4, s = a.s || 1; P.solid = true;
    P.wash(circlePts(x, y - 30 * s, 90 * s, 20), '#ffd890', 70, 0.04); P.shape([[x - 70 * s, y - 20 * s], [x + 70 * s, y - 20 * s], [x + 54 * s, y + 18 * s], [x - 54 * s, y + 18 * s]], '#b8964a', 250, INK, 1);
    for (let i = 0; i < 7; i++) P.line([[x - 62 * s + i * 20 * s, y - 18 * s], [x - 50 * s + i * 17 * s, y + 16 * s]], '#7a5a2a', 1, 'ink', 0);
    P.shape(circlePts(x, y - 26 * s, 34 * s, 16, 1.3, 0.5), '#f0c040', 250, INK, 0.8); P.circle(x + 18 * s, y - 34 * s, 12 * s, '#c8925c', 250, INK, 0.7); P.dot(x + 14 * s, y - 34 * s, 5 * s, GOLD2);
    P.solid = false; },
  ganesha: (P, t, a) => ganesha(P, Object.assign({ t }, a)),
  ganeshaHand: (P, t, a) => { P.fast = true; ganeshaHand(P, Object.assign({ t }, a)); },
  vyasa: (P, t, a) => vyasaSeated(P, Object.assign({ t }, a)),
  leaves: (P, t, a) => palmLeaves(P, a.x || 800, a.y || 800, a.w || 160, (a.cnt || a.n) || 6),
  // lamp flames that flicker (additive)
  lampFlicker: (P, t, a) => { for (const [x, y, s] of (a.at || [[520, 742, 1.1], [1100, 742, 1.1]])) { const k = 0.8 + 0.2 * Math.sin(t * 7 + x) * Math.sin(t * 3.3 + y); P.dot(x, y - 8, 9 * s * k, '#ffd070', 230); P.dot(x, y - 18 * s * k, 5 * s, '#fff0c0', 230); for (let i = 0; i < 3; i++) P.dot(x + Math.sin(t * 2 + i) * 30, y - 60 - ((t * 30 + i * 40) % 120), 2.2, '#ff9040', 120); } },
  // text appearing on a leaf as Ganesha writes (ink strokes growing)
  inkLines: (P, t, a) => { P.fast = true; const x = a.x, y = a.y, w = a.w || 200, n = Math.floor(t * (a.rate || 6)); for (let i = 0; i < Math.min(n, 60); i++) { const row = Math.floor(i / 12), col = i % 12; const xx = x + col * w / 12, yy = y + row * 6; P.line([[xx, yy], [xx + w / 16, yy + (i % 3 - 1)]], '#2a1a10', 1.4, 'ink', 0); } },
  cow: (P, t, a) => cow(P, a.x || 800, a.y || 860, a.s || 300, a.f || 1, a.col || '#f4efe2', t),
  // the eight Vasus: radiant figures in a row (sizes for wide shots)
  vasus: (P, t, a) => { const n = (a.cnt || a.n) || 8, x0 = a.x0 || 260, x1 = a.x1 || 1340, y = a.y || 620, S = a.S || 220; P.solid = true; for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * i / (n - 1), yy = y + Math.sin(i * 1.7) * 20; P.wash(circlePts(x, yy - S * 0.75, S * 0.35, 20), '#fff0b0', 90, 0.04, 0.3, 0.2); figure(P, { who: 'vasu', x, y: yy, S, f: i < n / 2 ? 1 : -1, pose: i === a.lead ? 'spear' : 'stand', t }); } P.solid = false; },
  // the Ganga stopped by a wall of arrows; the boy archer on the bank
  arrowDam: (P, t, a) => {
    const y = a.y || 640; P.solid = true;
    // dry riverbed below the dam, sand and stones and the last puddles
    P.shape([[-60, y + 10], [1660, y - 10], [1660, 960], [-60, 960]], '#c8a878', 250, null);
    P.wash([[-60, y + 10], [1660, y - 10], [1660, 960], [-60, 960]], '#a88858', 120, 0.02, 0.6, 0.3);
    for (let i = 0; i < 40; i++) { const sx = P.r(-40, 1640), sy = P.r(y + 30, 940); P.shape(circlePts(sx, sy, P.r(6, 18), 10, 1.4, 0.7), ['#8a7a6a', '#6a5a4a', '#a09080'][i % 3], 240, INK, 0.6); }
    for (let i = 0; i < 6; i++) { const sx = P.r(100, 1500), sy = P.r(y + 80, 900); P.shape(circlePts(sx, sy, P.r(30, 70), 14, 2.2, 0.4), '#6a9ab0', 220, null); }
    for (let i = 0; i < 5; i++) { const sx = P.r(200, 1400), sy = P.r(y + 60, 900); P.shape([[sx - 10, sy], [sx + 14, sy - 3], [sx + 6, sy + 4]], '#c0c8d0', 240, INK, 0.5); }   // stranded fish
    // the water held back, heaped against the dam
    P.shape([[-60, y - 70], [1660, y - 90], [1660, y - 10], [-60, y + 10]], '#3a7a9a', 250, INK, 1);
    for (let i = 0; i < 30; i++) { const fx = P.r(-40, 1640), fy = y - 20 - P.r(0, 40) - fx * 0.0125; P.wash(circlePts(fx, fy, P.r(10, 26), 10, 1.6, 0.6), '#e8f4f8', 200, 0.02); }
    // the wall of arrows
    for (let i = 0; i < 150; i++) { const x = -40 + i * 11.4 + P.r(-3, 3), yb = y + 8 - x * 0.0125, h = P.r(60, 110), lean = P.r(-10, 10); P.line([[x, yb], [x + lean, yb - h]], '#6a4a2a', 2, 'ink', 0); P.shape([[x + lean - 3, yb - h], [x + lean + 3, yb - h], [x + lean, yb - h - 10]], '#d0d0d0', 250, null); if (i % 3 === 0) P.line([[x + lean * 0.1, yb - 6], [x + lean * 0.1 - 5, yb + 4]], '#f4efe2', 1.4, 'ink', 0); }
    P.solid = false;
  },
  // a royal procession crossing a wide landscape, small figures
  procession: (P, t, a) => {
    P.fast = true; const y = a.y || 760, s = a.s || 120, dir = a.dir || 1, x0 = a.x0 ?? -200, sp = a.speed || 30, n = (a.cnt || a.n) || 10;
    for (let i = 0; i < n; i++) {
      const x = x0 + (i * s * 1.6 + t * sp) * dir, kind = i % 5;
      if (kind === 2) elephant(P, x, y, s * 1.1, dir, '#7a6a64', t + i);
      else if (kind === 4) horse(P, x, y, s * 0.9, dir, t + i, '#efe8da', 0.4);
      else tinyFolk(P, x, y, s * 0.9, ['#b3202a', '#e9b52f', '#2f6f9a', '#f4efe2'][i % 4], t, i, i % 3 === 0);
    }
  },
  // villagers along a riverbank (static or walking)
  folk: (P, t, a) => { const r = mulberry(a.seed || 5); for (let i = 0; i < ((a.cnt || a.n) || 14); i++) { const x = (a.x0 || 0) + r() * (a.w || 1600) + t * (a.speed || 0) * (i % 2 ? 1 : -1), y = (a.y || 820) + r() * (a.dy || 60), s = (a.s || 60) * (0.8 + r() * 0.4); tinyFolk(P, x, y, s, ['#b3202a', '#e9b52f', '#2f6f9a', '#f4efe2', '#5a7a3a'][i % 5], a.speed ? t : 0, i, r() > 0.6); } },
  // the boat that carries Satyavati, small and far
  farBoat: (P, t, a) => { P.fast = true; const x = (a.x || 800) + t * (a.speed || 0), y = (a.y || 700) + Math.sin(t * 1.4) * 3, s = a.s || 80; P.solid = true; P.shape([[x - s, y - s * 0.1], [x + s, y - s * 0.1], [x + s * 0.7, y + s * 0.18], [x - s * 0.7, y + s * 0.18]], '#6a3a1a', 245, INK, 0.8); P.line([[x, y - s * 0.1], [x, y - s * 0.9]], '#3a2a1a', 1.2, 'ink', 0); P.shape([[x + 2, y - s * 0.86], [x + s * 0.5, y - s * 0.5], [x + 2, y - s * 0.2]], '#e8dcc0', 240, INK, 0.6); tinyFolk(P, x - s * 0.4, y - s * 0.1, s * 0.7, '#2f8a6a', 0, 0); P.solid = false; },
  // a hunting party of riders (wide shot)
  riders: (P, t, a) => { P.fast = true; const n = (a.cnt || a.n) || 3, y = a.y || 800, s = a.s || 160; for (let i = 0; i < n; i++) { const x = (a.x || 300) + i * s * 1.3 + t * (a.speed || 60); horse(P, x, y + i * 10, s, a.f || 1, t + i * 0.4, i ? '#cfc6ae' : '#f2ede0', 1); tinyFolk(P, x + s * 0.05, y - s * 0.62 + i * 10, s * 0.7, i ? '#2f4f8f' : '#7a1a2a', 0, 0); } },
  // a duel seen from afar: two archers, arrows streaking between them
  duel: (P, t, a) => { const xL = a.xL || 360, xR = a.xR || 1240, y = a.y || 780, s = a.s || 160; P.fast = true; for (let i = 0; i < 14; i++) { const ph = (t * 0.9 + i / 14) % 1, dir = i % 2 ? 1 : -1, x = dir > 0 ? xL + (xR - xL) * ph : xR - (xR - xL) * ph, yy = y - s * 0.7 - Math.sin(ph * 3.14) * 120 - (i % 3) * 10; P.line([[x, yy], [x - dir * 40, yy + 4]], dir > 0 ? '#ffe0a0' : '#c0d8ff', 2, 'ink', 0); } P.fast = false; },
});
