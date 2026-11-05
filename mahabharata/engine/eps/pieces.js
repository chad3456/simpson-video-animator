// Custom painted pieces for the series (props, effects and the Vishvarupa). PIECES[name](P, t, args, job).

// ---------- frontal divine face (Vishvarupa, Kala) ----------
function frontFace(P, x, y, R, o = {}) {
  const skin = o.skin || '#3a6cb4', iw = Math.max(1, R / 60), fierce = o.fierce || 0, W = o.W || 0.74;
  const Q = (u, v) => [x + u * W * R, y + v * R]; const QQ = (a) => a.map(p => Q(p[0], p[1]));
  P.solid = true; P.noSilhouette();
  // ears + kundala
  for (const s of [-1, 1]) { P.shape(chaikin(QQ([[s * 0.92, -0.25], [s * 1.08, -0.2], [s * 1.12, 0.05], [s * 1.04, 0.3], [s * 0.9, 0.3]]), 1), skin, 240, INK, iw); const k = Q(s * 1.04, 0.42); P.circle(k[0], k[1], R * 0.12, GOLD2, 245, '#7a4a10', iw); P.dot(k[0], k[1], R * 0.05, '#b3202a'); }
  // face
  const half = [[0, -1.02], [0.5, -0.96], [0.85, -0.66], [0.92, -0.25], [0.9, 0.15], [0.78, 0.52], [0.52, 0.84], [0.22, 1.0], [0, 1.03]];
  const face = half.concat(half.slice(1, -1).reverse().map(p => [-p[0], p[1]]));
  P.shape(chaikin(QQ(face), 2), skin, 240, INK, iw);
  P.wash(QQ([[-0.9, -0.2], [-0.55, -0.1], [-0.45, 0.5], [-0.2, 0.95], [-0.7, 0.6]]), shade(skin, -0.3), 90, 0.03);
  P.wash(QQ([[0.9, -0.2], [0.55, -0.1], [0.45, 0.5], [0.2, 0.95], [0.7, 0.6]]), shade(skin, -0.3), 90, 0.03);
  if (o.sheen) P.wash(QQ([[-0.3, -0.85], [0.3, -0.85], [0.2, -0.5], [-0.2, -0.5]]), o.sheen, 80, 0.03);
  // eyes
  for (const s of [-1, 1]) {
    const eu = s * 0.4, ev = -0.15, hw = 0.27, h = fierce ? 0.13 : 0.1;
    const pts = [[eu - s * hw, ev + 0.02], [eu - s * hw * 0.3, ev - h], [eu + s * hw * 0.5, ev - h * 0.85], [eu + s * hw * 1.1, ev - 0.04], [eu + s * hw * 0.5, ev + h * 0.6], [eu - s * hw * 0.4, ev + h * 0.6]];
    P.shape(QQ(pts), fierce ? '#fff0c0' : '#f6f1e4', 250, null);
    const ic = Q(eu, ev - 0.01); P.circle(ic[0], ic[1], R * h * 0.85, fierce ? '#c1121f' : '#2a1a12', 252, null); P.circle(ic[0], ic[1], R * h * 0.45, '#050303', 255, null); P.dot(ic[0] + R * 0.03, ic[1] - R * 0.03, R * 0.022, '#ffffff');
    P.shape(QQ([pts[0], pts[1], pts[2], pts[3], [eu + s * hw * 1.1, ev - h - 0.12], [eu - s * hw * 1.1, ev - h - 0.12]]), skin, 252, null);
    P.shape(QQ([pts[3], pts[4], pts[5], pts[0], [eu - s * hw * 1.1, ev + h + 0.1], [eu + s * hw * 1.1, ev + h + 0.1]]), skin, 252, null);
    P.line(QQ([pts[0], pts[1], pts[2], pts[3], [eu + s * hw * 1.38, ev - 0.1]]), INK, iw * 2, 'ink', 0.5);
    P.line(QQ([pts[3], pts[4], pts[5], pts[0]]), INK, iw * 0.8, 'ink', 0.5);
    const ba = fierce ? 0.09 : -0.01;
    P.shape(QQ(ribbon([[s * 0.1, -0.36 + ba], [s * 0.4, -0.48], [s * 0.72, -0.4 - ba * 0.4]], 0.04, 0.015)), '#120c0a', 245, null);
  }
  // nose, mouth
  P.line(QQ([[-0.05, -0.22], [-0.04, 0.1], [-0.1, 0.3], [-0.04, 0.38], [0.04, 0.38], [0.1, 0.3]]), INK, iw * 0.9, 'ink', 0.5);
  if (fierce) {
    P.shape(chaikin(QQ([[-0.42, 0.52], [0, 0.46], [0.42, 0.52], [0.3, 0.86], [0, 0.94], [-0.3, 0.86]]), 1), '#2a0606', 250, INK, iw);
    P.wash(QQ([[-0.3, 0.58], [0.3, 0.58], [0.2, 0.84], [-0.2, 0.84]]), '#ff7a20', 230, 0.02);
    for (const s of [-1, 1]) { P.shape(QQ([[s * 0.24, 0.52], [s * 0.34, 0.52], [s * 0.28, 0.76]]), '#f6f1e4', 252, INK, iw * 0.6); P.shape(QQ([[s * 0.2, 0.9], [s * 0.3, 0.88], [s * 0.24, 0.7]]), '#f6f1e4', 252, INK, iw * 0.6); }
  } else {
    const sm = o.smile ?? 0.04;
    P.shape(QQ([[-0.24, 0.6 - sm], [-0.1, 0.55], [0, 0.57], [0.1, 0.55], [0.24, 0.6 - sm], [0.1, 0.7], [-0.1, 0.7]]), o.lips || '#b02a3a', 245, null);
    P.line(QQ([[-0.24, 0.6 - sm], [0, 0.62], [0.24, 0.6 - sm]]), INK, iw, 'ink', 0.5);
  }
  // marks: third eye / namam
  if (o.third) { const e = Q(0, -0.5); P.shape([[e[0] - R * 0.05, e[1]], [e[0], e[1] - R * 0.14], [e[0] + R * 0.05, e[1]], [e[0], e[1] + R * 0.14]], fierce ? '#ff4020' : '#f6f1e4', 250, INK, iw * 0.7); P.dot(e[0], e[1], R * 0.03, '#c1121f'); }
  else { P.shape(QQ([[-0.14, -0.82], [-0.08, -0.82], [-0.05, -0.42], [0.05, -0.42], [0.08, -0.82], [0.14, -0.82], [0.1, -0.34], [-0.1, -0.34]]), '#f6f1e4', 245, null); P.shape(QQ([[-0.03, -0.84], [0.03, -0.84], [0.02, -0.38], [-0.02, -0.38]]), '#c1121f', 250, null); }
  // hair line + crown
  P.shape(chaikin(QQ([[-0.95, -0.2], [-0.95, -0.75], [-0.5, -1.1], [0.5, -1.1], [0.95, -0.75], [0.95, -0.2], [0.82, -0.6], [0.4, -0.86], [-0.4, -0.86], [-0.82, -0.6]]), 1), '#0d0a14', 245, INK, iw);
  const ch = o.crownH || 2.4, cw = 0.92;
  const cr = [[0, -0.95], [cw, -0.88], [cw, -1.15], [cw * 0.78, -1.3], [cw * 0.85, -1.55], [cw * 0.6, -1.7], [cw * 0.6, -1.95], [cw * 0.32, -2.05], [cw * 0.28, -2.3 * ch / 2.4], [0.1, -2.5 * ch / 2.4], [0, -2.7 * ch / 2.4]];
  P.shape(QQ(cr.concat(cr.slice(1, -1).reverse().map(p => [-p[0], p[1]]))), o.crownCol || GOLD, 248, '#5a3410', iw);
  P.wash(QQ([[-0.3, -1.0], [0.3, -1.0], [0.25, -2.0], [-0.25, -2.0]]), '#fff0b0', 90, 0.02);
  for (const v of [-1.18, -1.58, -1.95]) P.line(QQ([[-cw, v], [0, v - 0.06], [cw, v]]), '#7a4a10', iw, 'ink', 0.4);
  for (let i = 0; i < 9; i++) { const u = -0.8 + i * 0.2; P.shape(QQ([[u - 0.09, -0.97], [u, -1.17], [u + 0.09, -0.97]]), GOLD2, 248, '#5a3410', iw * 0.6); }
  for (let i = 0; i < 5; i++) P.dot(...Q(-0.6 + i * 0.3, -1.38), R * 0.045, i % 2 ? '#2a7a5a' : '#b3202a');
  for (let i = 0; i < 3; i++) P.dot(...Q(-0.3 + i * 0.3, -1.78), R * 0.04, i === 1 ? '#1d3f8f' : '#b3202a');
  P.circle(...Q(0, -2.62 * ch / 2.4), R * 0.08, '#b3202a', 250, '#5a3410', iw);
  for (const s of [-1, 1]) P.shape(QQ([[s * 0.92, -1.05], [s * 1.35, -0.85], [s * 1.28, -0.5], [s * 0.95, -0.55]]), GOLD, 248, '#5a3410', iw * 0.8);
  P.solid = false;
}

// ---------- small props ----------
PIECES.floatLamps = (P, t, a) => { const r = mulberry(5); for (let i = 0; i < 7; i++) { const x0 = 300 + i * 170 + r() * 60, y = 640 + r() * 160, x = x0 + t * (8 + r() * 6); const k = 0.7 + 0.3 * Math.sin(t * 3 + i); P.dot(x, y, 7 * k, '#ffb050', 240); P.dot(x, y + 12, 5, '#ff9040', 120); } };
PIECES.boat = (P, t, a) => { const x = a.x || 800, y = a.y || 700, s = a.s || 1; P.solid = true; P.shape([[x - 300 * s, y], [x + 300 * s, y], [x + 360 * s, y - 50 * s], [x + 200 * s, y + 40 * s], [x - 220 * s, y + 40 * s], [x - 360 * s, y - 50 * s]], '#5a3416', 235, INK, 1.2); P.line([[x - 300 * s, y + 8], [x + 300 * s, y + 8]], GOLD, 2, 'gold'); P.line([[x + 120 * s, y], [x + 260 * s, y - 380 * s]], '#3a2410', 3, 'ink', 0); P.solid = false; };
PIECES.fiveLights = (P, t, a) => { const cols = ['#f6e6b0', '#a0d8ff', '#ffd060', '#c0ffd0', '#c0ffd0']; for (let i = 0; i < 5; i++) { const k = clamp01((t - 1 - i * 1.6) / 2.5); if (k <= 0) continue; const x0 = 300 + i * 250, y0 = -40, x1 = 800, y1 = 470; const x = x0 + (x1 - x0) * ease(k), y = y0 + (y1 - y0) * ease(k); P.dot(x, y, 14 * (1 - k * 0.5), cols[i], 240 * (1 - k * 0.6)); for (let q = 1; q < 8; q++) P.dot(x - (x1 - x0) * q * 0.02, y - (y1 - y0) * q * 0.02, 6 - q * 0.6, cols[i], 120 - q * 14); } };
PIECES.jars = (P, t, a) => { P.solid = true; for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) { const x = 980 + i * 70 + r * 35, y = 800 - r * 90, s = 34; P.shape(circlePts(x, y - s, s, 16, 0.85, 1), '#a86a3a', 235, INK, 1); P.shape([[x - s * 0.4, y - s * 2], [x + s * 0.4, y - s * 2], [x + s * 0.3, y - s * 1.7], [x - s * 0.3, y - s * 1.7]], '#8a5028', 235, INK, 0.8); P.line([[x - s * 0.8, y - s], [x + s * 0.8, y - s]], GOLD, 1.6, 'gold'); } P.solid = false; };
PIECES.woodBird = (P, t, a) => { const x = a.x || 1200, y = a.y || 330, s = a.s || 1; P.solid = true; P.line([[x, y + 30 * s], [x, 900]], '#3a2410', 4 * s, 'ink', 0); P.shape([[x - 40 * s, y], [x + 30 * s, y - 14 * s], [x + 46 * s, y - 4 * s], [x + 30 * s, y + 14 * s], [x - 30 * s, y + 12 * s], [x - 56 * s, y - 16 * s]], '#a8742a', 240, INK, 1.2); P.shape([[x + 44 * s, y - 6 * s], [x + 60 * s, y - 2 * s], [x + 44 * s, y + 2 * s]], '#c79a52', 240, INK, 1); P.circle(x + 32 * s, y - 6 * s, 5 * s, '#f6f1e4', 250, INK, 1); P.dot(x + 33 * s, y - 6 * s, 2.4 * s, '#b3202a'); P.solid = false; };
PIECES.arrowStreak = (P, t, a) => { const k = clamp01((t - a.t0) / 0.35); if (t < a.t0) return; const x = a.x0 + (a.x1 - a.x0) * k, y = a.y0 + (a.y1 - a.y0) * k; const fade = clamp01(1 - (t - a.t0 - 0.35) / 1.2); for (let i = 0; i < 18; i++) { const q = i / 18; P.dot(x - (a.x1 - a.x0) * q * 0.22, y - (a.y1 - a.y0) * q * 0.22, 7 * (1 - q), '#fff4c0', 240 * fade * (1 - q)); } if (k >= 1) for (let i = 0; i < 3; i++) P.wash(circlePts(a.x1, a.y1, (40 + i * 40) * (1 + (t - a.t0) * 1.5), 24), '#fff0c0', 120 * fade, 0.03); };
PIECES.fishWheel = (P, t, a) => { const x = a.x || 800, y = a.y || 230, s = a.s || 1, rot = t * 60; P.solid = true; P.line([[x, y], [x, 760]], '#5a3416', 6, 'ink', 0); P.line(arcPts(x, y, 110 * s, 0, 360, 40), GOLD, 3, 'gold', 0.4); for (let i = 0; i < 8; i++) { const ang = (rot + i * 45) * D2R; P.line([[x, y], [x + Math.cos(ang) * 110 * s, y + Math.sin(ang) * 110 * s]], '#7a4a10', 2, 'ink', 0); } const fa = rot * D2R, fx = x + Math.cos(fa) * 110 * s, fy = y + Math.sin(fa) * 110 * s * 0.35; P.shape([[fx - 40 * s, fy], [fx - 10 * s, fy - 16 * s], [fx + 34 * s, fy - 6 * s], [fx + 46 * s, fy - 18 * s], [fx + 46 * s, fy + 18 * s], [fx + 34 * s, fy + 6 * s], [fx - 10 * s, fy + 16 * s]], a.hit && t > a.hit ? '#e0a040' : '#c0c8d0', 245, INK, 1.2); P.circle(fx - 26 * s, fy - 3 * s, 5 * s, '#f6f1e4', 250, INK, 1); P.dot(fx - 26 * s, fy - 3 * s, 2.5 * s, '#120c0a'); P.solid = false; };
PIECES.oilPool = (P, t, a) => { const x = a.x || 800, y = a.y || 780, w = a.w || 1; P.solid = true; P.shape(circlePts(x, y, 260 * w, 40, 1, 0.22), '#7a5a20', 240, GOLD, 2); P.shape(circlePts(x, y, 220 * w, 40, 1, 0.18), a.col || '#2a1a08', 245, null); P.solid = false; P.noMask(); for (let i = 0; i < 4; i++) P.line(arcPts(x, y, 60 + i * 40, 200, 340, 16).map(p => [p[0], y + (p[1] - y) * 0.2]), '#e8c070', 1, 'fine', 0.3); P.mask(); };
PIECES.diceFloat = (P, t, a) => { P.fast = true; for (let i = 0; i < 3; i++) { const x = (a.x || 1180) + i * 70 - 70 + Math.sin(t * 1.3 + i) * 10, y = (a.y || 600) - i * 30 + Math.sin(t * 2 + i * 2) * 14, r = t * 40 + i * 30; const s = 26; const c = Math.cos(r * D2R), sn = Math.sin(r * D2R); const sq = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [x + (u * c - v * sn) * s, y + (u * sn + v * c) * s * 0.6]); P.shape(sq, '#efe6cf', 255, INK, 1); for (let d = 0; d < 1 + i; d++) P.dot(x + (d - i / 2) * 12, y, 3.5, '#120c0a'); } };
PIECES.diceBoard = (P, t, a) => { P.solid = true; const bx = 800, by = 760; P.shape([[bx - 420, by + 60], [bx + 420, by + 60], [bx + 300, by - 50], [bx - 300, by - 50]], '#7a1a14', 235, INK, 1.2); P.shape([[bx - 70, by + 60], [bx + 70, by + 60], [bx + 50, by - 50], [bx - 50, by - 50]], '#c79a52', 235, INK, 1); P.shape([[bx - 400, by + 20], [bx + 400, by + 20], [bx + 380, by - 10], [bx - 380, by - 10]], '#c79a52', 235, INK, 1); for (let i = 0; i < 8; i++) P.line([[bx - 280 + i * 80, by - 50], [bx - 400 + i * 114, by + 60]], '#3a0a08', 1, 'ink', 0); P.solid = false; };
PIECES.diceRoll = (P, t, a) => { P.fast = true; for (const t0 of (a.times || [1])) { const k = clamp01((t - t0) / 1.1); if (t < t0 || t > t0 + 2.9) continue; const e = 1 - Math.pow(1 - k, 3); for (let i = 0; i < 2; i++) { const x = 560 + e * 240 + i * 40, y = 700 - Math.abs(Math.sin(e * 9)) * 60 * (1 - e) + i * 10, r = (1 - e) * 720 + i * 40, s = 16; const c = Math.cos(r * D2R), sn = Math.sin(r * D2R); P.shape([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [x + (u * c - v * sn) * s, y + (u * sn + v * c) * s * 0.7]), '#efe6cf', 255, INK, 1); P.dot(x, y, 3, '#120c0a'); } } };
PIECES.diceFall = (P, t, a) => { P.fast = true; const k = clamp01(t / 1.0), e = 1 - Math.pow(1 - k, 3); for (let i = 0; i < 3; i++) { const x = 700 + i * 60, y = 200 + e * 560 - Math.abs(Math.sin(e * 7)) * 40 * (1 - e), r = (1 - e) * 900 + i * 50, s = 22; const c = Math.cos(r * D2R), sn = Math.sin(r * D2R); P.shape([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [x + (u * c - v * sn) * s, y + (u * sn + v * c) * s]), '#efe6cf', 255, INK, 1.2); for (let d = 0; d <= i; d++) P.dot(x + (d - i / 2) * 9, y, 3, '#120c0a'); } };
PIECES.endlessSari = (P, t, a) => { // the sari pours upward in an endless helix of cloth, and piles up at Dushasana's feet
  P.fast = true; const x0 = a.x || 900, cols = ['#b3202a', '#d8902a', '#c7362b', '#e0b040', '#8a1c50'];
  const top = 880 - Math.min(1000, 120 + t * 90);
  for (let y = 880; y > top; y -= 5) { const k = (880 - y) / 900, ph = y * 0.025 - t * 3.2, r = 70 + k * 120; const x = x0 + Math.sin(ph) * r, z = Math.cos(ph); P.dot(x, y, 16 + z * 5, shade(cols[Math.floor((y + t * 160) / 70) % 5 < 0 ? 0 : Math.floor((y + t * 160) / 70) % 5], z * 0.2), 255); if (Math.floor(y / 5) % 9 === 0) P.dot(x, y, 4, GOLD2, 255); }
  const n = Math.min(26, 2 + t * 2.2); for (let i = 0; i < n; i++) { const x = 330 + (i % 7) * 40 + Math.sin(i * 2.3) * 30, y = 890 - Math.floor(i / 7) * 34; P.shape(circlePts(x, y, 80 - (i % 5) * 6, 14, 1.4, 0.45), cols[i % 5], 255, INK, 0.8); }
};
PIECES.yakshaForm = (P, t, a) => { const x = a.x || 1050, y = a.y || 430; P.solid = true; P.wash(circlePts(x, y, 380, 30, 1, 1.1), '#e8ece8', 120, 0.06); P.shape(chaikin([[x - 220, 900], [x - 160, y + 60], [x - 90, y - 160], [x, y - 240], [x + 90, y - 160], [x + 160, y + 60], [x + 220, 900]], 2), '#9aa8a4', 200, '#4a5a58', 1.4); frontFace(P, x, y - 220, 90, { skin: '#9aa8a4', fierce: 0, third: 1, crownH: 1.8, crownCol: '#c8c0a0' }); P.solid = false; };
PIECES.warChariot = (P, t, a) => { P.solid = true; const x = a.x || 800, y = a.y || 860; for (let i = 0; i < 4; i++) horse(P, x + 260 - i * 22, y - i * 8, 300, 1, t + i * 0.3, i % 2 ? '#f2ede0' : '#e6dfcc', 0.7); chariot(P, x - 120, y, 560, 1, '#c79a52', t, '#c7362b', 'monkey'); figure(P, { who: 'krishna', x: x + 40, y: y - 330, S: 300, f: 1, pose: 'spear', t }); figure(P, { who: 'arjuna', x: x - 120, y: y - 330, S: 330, f: 1, pose: 'stand', weapon: 'bowRest', t }); P.solid = false; };

// ---------- the war ----------
PIECES.arrowRain = (P, t, a) => { const r = mulberry(17); brush.set('fine', '#2a1a10', 1.2); for (let i = 0; i < 70; i++) { const ph = (r() + t * 0.6) % 1, x = 900 + r() * 900 - ph * 800, y = -50 + ph * 950; brush.line(x, y, x - 30, y + 26); } brush.noStroke(); };
PIECES.arrowBed = (P, t, a) => { const x = a.x || 800, y = a.y || 740, s = a.s || 1; P.solid = true; P.line([[x - 380 * s, y + 6], [x + 380 * s, y + 6]], '#2a1a10', 2, 'ink', 0); for (let i = 0; i < 60; i++) { const xx = x - 360 * s + i * 12 * s, ang = -90 + Math.sin(i * 1.7) * 18, L = 120 + (i % 5) * 18; P.line([[xx, y + 120], [xx + Math.cos(ang * D2R) * L * 0.3, y + 120 + Math.sin(ang * D2R) * L]], '#3a2410', 1.4, 'ink', 0); P.shape([[xx - 4, y + 120 + Math.sin(ang * D2R) * L], [xx + 4, y + 120 + Math.sin(ang * D2R) * L], [xx, y + 140 + Math.sin(ang * D2R) * L]], '#c7362b', 240, null); } figure(P, { who: 'bhishma', x: x - 330 * s, y: y - 40, S: 560 * s, f: 1, pose: 'stand', rot: -90, poseOver: { aF: [20, 30], aB: [-10, 0] } }); P.solid = false; };
PIECES.vyuhaRing = (P, t, a) => { P.fast = true; const x = a.x || 800, y = a.y || 450; for (let r = 0; r < 6; r++) { const R = 130 + r * 70 - (a.close ? t * 4 : 0), n = 16 + r * 8, rot = t * (r % 2 ? 14 : -12) + r * 7; for (let i = 0; i < n; i++) { const ang = (rot + i * 360 / n) * D2R, px = x + Math.cos(ang) * R * 1.4, py = y + Math.sin(ang) * R * 0.8; P.dot(px, py + 6, 11, '#3a2414', 255); P.dot(px, py - 6, 8, r % 2 ? '#6e1414' : '#2a2a40', 255); P.line([[px, py], [px + 4, py - 34]], '#2a1a10', 1, 'ink', 0); } } };
PIECES.eclipse = (P, t, a) => { const x = a.x || 1000, y = a.y || 380; const cover = t < 3 ? 0 : t < 6 ? (t - 3) / 3 : t < 10.6 ? 1 : Math.max(0, 1 - (t - 10.6) * 2); P.solid = true; P.flat([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], mixc('#f0a860', '#0a0a20', cover * 0.85), 255 * cover * 0.7); P.circle(x, y, 120, '#f6c060', 250, null); P.circle(x - 240 * (1 - cover), y, 128, '#1a1a2a', 250 * cover, GOLD, 2); for (let i = 0; i < 12; i++) { const an = (t * 120 + i * 30) * D2R; P.line([[x - 240 * (1 - cover), y], [x - 240 * (1 - cover) + Math.cos(an) * 128, y + Math.sin(an) * 128]], GOLD2, 2 * cover, 'fine', 0); } P.solid = false; };
PIECES.sinkingSun = (P, t, a) => { const y = (a.y || 640) + t * 10; for (let i = 0; i < 3; i++) P.wash(circlePts(a.x || 800, y, 200 * (1 - i * 0.25), 30), '#ff7a30', 80 + i * 40, 0.04); };
PIECES.dog = (P, t, a) => { const x = a.x || 700, y = a.y || 860, s = (a.s || 1) * 100; P.solid = true; const T2 = (u, v) => [x + u * s, y + v * s]; const legs = [[-0.4, 0], [-0.25, 1.5], [0.35, 0.7], [0.5, 2.2]]; for (const [lx, ph] of legs) { const sw = Math.sin(t * 6 + ph) * 0.12; P.shape(capsule(T2(lx, -0.55), T2(lx + sw, 0), s * 0.06, s * 0.05), '#d8c8a8', 240, INK, 0.9); } P.shape(chaikin([T2(-0.6, -0.5), T2(-0.55, -0.85), T2(0.5, -0.9), T2(0.7, -0.6), T2(0.5, -0.45), T2(-0.4, -0.45)], 2), '#e8dcc0', 240, INK, 1); P.shape(chaikin([T2(0.5, -0.8), T2(0.7, -1.2), T2(0.95, -1.18), T2(1.1, -1.0), T2(0.9, -0.9), T2(0.7, -0.7)], 1), '#e8dcc0', 240, INK, 1); P.shape([T2(0.72, -1.15), T2(0.78, -1.4), T2(0.86, -1.16)], '#c8b898', 240, INK, 0.8); P.dot(...T2(0.88, -1.08), s * 0.04, INK); P.line([T2(-0.6, -0.75), T2(-0.9, -1.0 + Math.sin(t * 8) * 0.1), T2(-1.0, -1.1)], '#e8dcc0', s * 0.07, 'ink', 0.5); P.solid = false; };

// ---------- the Vishvarupa ----------
PIECES.thousandSuns = (P, t, a) => { const r = mulberry(31); for (let i = 0; i < 60; i++) { const t0 = r() * 8, x = r() * 1600, y = r() * 900, k = clamp01((t - t0) / 1.5); if (k <= 0) continue; const R0 = (20 + r() * 60) * ease(k); P.dot(x, y, R0 * 0.25, '#fff8e0', 255); P.wash(circlePts(x, y, R0, 20), '#ffd890', 70, 0.04, 0.3, 0.2); } };
PIECES.cosmicHalo = (P, t, a) => { const x = 800, y = 400; for (let i = 0; i < 6; i++) { const R = 260 + i * 70, rot = t * (i % 2 ? 9 : -7) * (1 + i * 0.2); P.line(arcPts(x, y, R, 0, 360, 96), i % 2 ? '#ffe08a' : '#c0a0ff', 1.6, 'gold', 0.5); const n = 12 + i * 6; for (let q = 0; q < n; q++) { const an = (rot + q * 360 / n) * D2R; P.dot(x + Math.cos(an) * R, y + Math.sin(an) * R, 2.6 + (q % 3), i % 2 ? '#fff0b0' : '#d8c0ff', 220); } } for (let i = 0; i < 40; i++) { const an = (t * 4 + i * 9) * D2R, L = 560 + 60 * Math.sin(t * 2 + i); P.line([[x + Math.cos(an) * 220, y + Math.sin(an) * 220], [x + Math.cos(an) * L, y + Math.sin(an) * L]], i % 2 ? '#ff9a40' : '#ffd060', 1.6, 'dry', 0); } };
PIECES.vishvaArms = (P, t, a) => { // a wheel of arms behind the form, each holding a weapon or emblem
  P.solid = true; P.noSilhouette(); const skin = '#3a6cb4', x = 800, y = 560, items = ['chakra', 'conch', 'mace', 'lotus', 'bow', 'sword', 'fire', 'chakra', 'lotus', 'conch', 'mace', 'bow'];
  for (let side = -1; side <= 1; side += 2) for (let i = 0; i < 9; i++) {
    const ang = (-170 + i * 18) * D2R, dir = [Math.cos(ang) * side * -1, Math.sin(ang)], sh = [x + side * 140, y - 150];
    const el = [sh[0] + dir[0] * 190, sh[1] + dir[1] * 150], wr = [el[0] + dir[0] * 170 + side * 10, el[1] + dir[1] * 120 - 30];
    P.shape(capsule(sh, el, 30, 24), shade(skin, -0.1 + i * 0.02), 235, INK, 1.3); P.shape(capsule(el, wr, 24, 18), shade(skin, -0.05 + i * 0.02), 235, INK, 1.3);
    P.line([lerp2(el, wr, 0.85), lerp2(el, wr, 0.9)], GOLD, 6, 'gold'); P.line([lerp2(sh, el, 0.4), lerp2(sh, el, 0.45)], GOLD, 7, 'gold');
    P.circle(wr[0], wr[1], 22, skin, 240, INK, 1.2);
    const it = items[(i + (side > 0 ? 3 : 0)) % items.length];
    if (it === 'chakra') { P.circle(wr[0], wr[1] - 44, 38, GOLD2, 245, '#7a4a10', 1.4); for (let q = 0; q < 12; q++) { const aa = q * 30 * D2R; P.line([[wr[0], wr[1] - 44], [wr[0] + Math.cos(aa) * 36, wr[1] - 44 + Math.sin(aa) * 36]], '#7a4a10', 1.4, 'ink', 0); } P.dot(wr[0], wr[1] - 44, 8, '#b3202a'); }
    if (it === 'conch') P.shape(chaikin(circlePts(wr[0], wr[1] - 34, 32, 14, 1.3, 0.8), 1), '#f4efe0', 245, INK, 1.2);
    if (it === 'mace') { P.line([wr, [wr[0], wr[1] - 150]], '#5a3416', 5, 'ink', 0); P.circle(wr[0], wr[1] - 160, 34, GOLD, 245, INK, 1.4); }
    if (it === 'lotus') lotus(P, wr[0], wr[1] - 20, 40, '#f08aa0');
    if (it === 'bow') P.line(arcPts(wr[0], wr[1], 110, -150, -30, 16), '#5a3416', 4, 'ink', 0.5);
    if (it === 'sword') { P.shape([[wr[0] - 6, wr[1]], [wr[0] + 6, wr[1]], [wr[0] + 4, wr[1] - 170], [wr[0], wr[1] - 190], [wr[0] - 4, wr[1] - 170]], '#e8e8e8', 245, INK, 1); }
    if (it === 'fire') { flames(P, wr[0], wr[1] - 10, 60, 90, 0); }
  }
  P.solid = false;
};
PIECES.vishvarupa = (P, t, a) => {
  // the universal form: a colossal body whose chest opens onto the cosmos, a central face, a crown of eleven heads
  P.solid = true; P.noSilhouette(); const skin = '#3a6cb4', x = 800, y = 560;
  // aureole of flame behind
  for (let i = 0; i < 44; i++) { const an = (-200 + i * (220 / 43)) * D2R, R0 = 330, R1 = 420 + (i % 2) * 60; P.shape([[x + Math.cos(an - 0.05) * R0, y - 140 + Math.sin(an - 0.05) * R0], [x + Math.cos(an) * R1, y - 140 + Math.sin(an) * R1], [x + Math.cos(an + 0.05) * R0, y - 140 + Math.sin(an + 0.05) * R0]], i % 2 ? '#f08a24' : '#fbd56a', 230, '#7a2a08', 1); }
  // torso
  const tor = chaikin([[x - 260, 920], [x - 250, y + 40], [x - 300, y - 150], [x - 200, y - 230], [x - 70, y - 250], [x + 70, y - 250], [x + 200, y - 230], [x + 300, y - 150], [x + 250, y + 40], [x + 260, 920]], 2);
  P.shape(tor, skin, 240, INK, 1.8);
  // the chest is a window onto the universe
  const win = chaikin(circlePts(x, y - 40, 170, 24, 1, 1.15), 1); P.shape(win, '#06041a', 250, GOLD, 3);
  stars(P, 0, '#fff'); for (let i = 0; i < 90; i++) { const an = P.r(0, 6.28), rr = P.r(0, 160); P.dot(x + Math.cos(an) * rr, y - 40 + Math.sin(an) * rr * 1.1, P.r(0.8, 2.6), ['#fff8e0', '#c8d8ff', '#ffd0a0'][i % 3], 240); }
  galaxy(P, x, y - 40, 110, '#d8c0ff', 3, 40);
  // pitambara, garland, jewels
  P.shape(chaikin([[x - 260, y + 140], [x + 260, y + 140], [x + 300, 920], [x - 300, 920]], 1), '#e9b52f', 245, INK, 1.6);
  for (let i = 0; i < 5; i++) P.line([[x - 220 + i * 110, y + 150], [x - 240 + i * 120, 900]], '#b8862a', 1.2, 'ink', 0.4);
  P.line([[x - 260, y + 140], [x, y + 160], [x + 260, y + 140]], GOLD, 10, 'gold', 0.4);
  const gcols = ['#f2efe2', '#e04a6a', '#f2b23a', '#e9e0c0', '#c7362b']; for (let i = 0; i <= 40; i++) { const an = (10 + i * 160 / 40) * D2R; P.dot(x + Math.cos(an) * 250, y - 220 + Math.sin(an) * 370, 13, gcols[i % 5], 252); }
  for (let i = 0; i < 3; i++) P.line(arcPts(x, y - 250, 120 + i * 30, 20, 160, 24), i === 1 ? '#f6f1e4' : GOLD, 7 - i, 'gold', 0.5);
  // crown of heads: gods and beings on either side of the central face
  const heads = [[-330, -470, 70, '#c99a5a'], [330, -470, 70, '#7d8fa8'], [-250, -560, 78, '#d0a27a'], [250, -560, 78, '#c8a07e'], [-150, -620, 82, '#b9814f'], [150, -620, 82, '#9a6440'], [-400, -380, 60, '#5a8a5a'], [400, -380, 60, '#a8784e']];
  for (const [dx, dy, R0, sk] of heads) frontFace(P, x + dx, y + dy, R0, { skin: sk, W: 0.72, crownH: 1.9, smile: 0.02, third: Math.abs(dx) > 300 });
  frontFace(P, x, y - 470, 130, { skin, W: 0.76, crownH: 2.6, smile: 0.045, sheen: '#9cc6ff' });
  if (a.stage === 3) { /* the form gathers back into Krishna: painted the same, faded by the compositor */ }
  P.solid = false;
};
PIECES.universeWithin = (P, t, a) => { const x = 800, y = 520; for (let i = 0; i < 70; i++) { const an = t * 0.5 + i * 0.37, rr = (i * 7 + t * 20) % 160; P.dot(x + Math.cos(an) * rr, y + Math.sin(an) * rr * 1.1, 1.5 + (i % 3), ['#fff8e0', '#c8d8ff', '#ffd0a0'][i % 3], 200); } for (let i = 0; i < 5; i++) { const an = t * 0.4 + i * 1.26, rr = 60 + i * 22; P.dot(x + Math.cos(an) * rr, y + Math.sin(an) * rr, 7 + i * 1.5, ['#f6c060', '#6ab0ff', '#e05a3a', '#a0e0a0', '#f0e0ff'][i], 230); } };
PIECES.kalaFaces = (P, t, a) => { P.solid = true; frontFace(P, 800, 420, 220, { skin: '#2a4a8a', fierce: 1, third: 1, W: 0.8, crownH: 2.0, crownCol: '#c98a2a' }); for (const [dx, dy, R0] of [[-420, 60, 140], [420, 60, 140], [-700, 160, 100], [700, 160, 100]]) frontFace(P, 800 + dx, 420 + dy, R0, { skin: '#2a3a7a', fierce: 1, third: 1, W: 0.78, crownH: 1.8, crownCol: '#b0782a' }); P.solid = false; };
PIECES.warriorStreams = (P, t, a) => { P.fast = true; const r = mulberry(23); const mouths = [[800, 610], [380, 600], [1220, 600], [100, 650], [1500, 650]]; for (let i = 0; i < 90; i++) { const m = mouths[i % mouths.length], ph = (r() + t * 0.18) % 1, sx = r() * 1600, sy = 900; const x = sx + (m[0] - sx) * ph, y = sy + (m[1] - sy) * ph, s = 26 * (1 - ph * 0.8); P.dot(x, y - s * 1.2, s * 0.32, '#160f19'); P.shape([[x - s * 0.3, y - s], [x + s * 0.3, y - s], [x + s * 0.2, y], [x - s * 0.2, y]], '#160f19', 255, null); P.line([[x + s * 0.3, y - s], [x + s * 0.5, y - s * 2]], '#160f19', 1.2, 'ink', 0); } };
