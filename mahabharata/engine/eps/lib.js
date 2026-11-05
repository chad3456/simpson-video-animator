// Series painter: every layer of every episode is described as data in series/epNN.json and painted here.
// A layer spec is one of
//   {set: 'river', tod: 'dawn', ...}             a painted set (SETS below)
//   {portrait: {who, x, y, R, f, expr, ...}}     a close-up face (faces.js)
//   {figs: [{who, x, y, S, f, pose, weapon}]}    full figures (kit.js figure / woman)
//   {fx: {kind, n, ...}}                         an animated effect, usually painted on black and added as light
//   {draw: 'name', args: {...}}                  a custom piece (PIECES below)
// Several of these may be combined in one layer; they are painted in that order.

const TOD = {
  dawn: ['#f3dcae', '#ec9b5e', '#b5482f'], day: ['#9cc0d8', '#d8e4e0', '#efe0c0'], dusk: ['#2a2a5a', '#b85a4a', '#f0a860'],
  night: ['#05091c', '#0d1c40', '#1c3358'], storm: ['#101828', '#2a3858', '#4a5a78'], crimson: ['#2a0608', '#6e1414', '#c0401e'],
  gold: ['#f6e6b0', '#f0c060', '#d08030'], violet: ['#1a0e2a', '#4a2a6a', '#a05a8a'], teal: ['#0c2a34', '#1f5a64', '#5a9a90'],
  mist: ['#c8ccc8', '#e0ddd0', '#efe6d0'], ash: ['#3a3634', '#6a5e54', '#a08a74'], snow: ['#6a8ab0', '#b8cce0', '#eef2f4'],
};
const R1 = (P) => P.r(0, 1);

function sky(P, o) {
  const pal = o.sky || TOD[o.tod || 'dawn']; skyBands(P, pal, 0, o.hz || 720, 8, 150);
  if (o.tod === 'night' || o.stars) stars(P, o.stars || 160, '#efe6cf', (o.hz || 700) - 60);
  if (o.sun) sunDisc(P, o.sun[0], o.sun[1], o.sun[2] || 100, o.sunCol || '#d9442a');
  if (o.moon) { P.wash(circlePts(o.moon[0], o.moon[1], (o.moon[2] || 70) * 1.8, 30), '#c8d8f0', 50, 0.04); P.wash(circlePts(o.moon[0], o.moon[1], o.moon[2] || 70, 30), '#f2ecd0', 235, 0.02); }
  if (o.clouds !== 0) { const pal2 = pal.map(c => shade(c, -0.18)); cloudBank(P, (o.hz || 720) * 0.35, pal2[0], 80, 6, 80); cloudBank(P, (o.hz || 720) * 0.6, pal2[1], 70, 6, 60); }
}
function trees(P, x0, x1, y, n, col, canopy, h = 380, seed = 1) {
  for (let i = 0; i < n; i++) {
    const x = x0 + (x1 - x0) * (i + P.r(-0.3, 0.3)) / n, hh = h * P.r(0.7, 1.2), w = 16 * hh / 380;
    P.shape([[x - w, y], [x + w, y], [x + w * 0.6, y - hh * 0.75], [x - w * 0.6, y - hh * 0.75]], col, 220, INK, 0.9);
    for (let k = 0; k < 7; k++) { const cx = x + P.r(-1, 1) * hh * 0.35, cy = y - hh * (0.62 + P.r(0, 0.4)), rr = hh * P.r(0.14, 0.26); P.shape(circlePts(cx, cy, rr, 16, 1.1, 0.85), canopy[k % canopy.length], 210, INK, 0.8, 0.02, 0.5); }
  }
}
function lotus(P, x, y, s, col = '#f0a0b4') {
  P.shape(circlePts(x, y + s * 0.2, s * 1.3, 18, 1, 0.3), '#2e6a44', 220, INK, 0.7);
  for (let q = 0; q < 7; q++) { const a = (-90 + (q - 3) * 24) * D2R; P.shape([[x, y], [x + Math.cos(a - 0.3) * s * 0.5, y + Math.sin(a - 0.3) * s * 0.5], [x + Math.cos(a) * s, y + Math.sin(a) * s], [x + Math.cos(a + 0.3) * s * 0.5, y + Math.sin(a + 0.3) * s * 0.5]], q % 2 ? col : shade(col, 0.3), 230, INK, 0.6); }
}
function throne(P, x, y, s, col = GOLD, cush = '#8a1c1c') {
  P.shape([[x - s * 0.5, y], [x + s * 0.5, y], [x + s * 0.45, y - s * 0.45], [x - s * 0.45, y - s * 0.45]], shade(col, -0.2), 230, INK, 1);
  P.shape([[x - s * 0.4, y - s * 0.45], [x + s * 0.4, y - s * 0.45], [x + s * 0.36, y - s * 1.3], [x, y - s * 1.55], [x - s * 0.36, y - s * 1.3]], col, 230, INK, 1.2);
  P.shape([[x - s * 0.3, y - s * 0.5], [x + s * 0.3, y - s * 0.5], [x + s * 0.27, y - s * 1.15], [x, y - s * 1.32], [x - s * 0.27, y - s * 1.15]], cush, 230, INK, 0.8);
  for (let i = 0; i < 5; i++) P.dot(x - s * 0.3 + i * s * 0.15, y - s * 0.25, s * 0.03, i % 2 ? '#2a7a5a' : '#b3202a');
  P.circle(x, y - s * 1.45, s * 0.07, '#b3202a', 240, INK, 0.8);
}

const SETS = {
  sky(P, o) { sky(P, o); if (o.hills !== 0) { hills(P, (o.hz || 700) - 40, 60, shade((o.sky || TOD[o.tod || 'dawn'])[2], -0.35), 170, 1); hills(P, (o.hz || 700), 30, shade((o.sky || TOD[o.tod || 'dawn'])[2], -0.5), 190, 3); } if (o.ground) ground(P, (o.hz || 700) + 10, o.ground, 220); },
  river(P, o) {
    const hz = o.hz || 560, pal = o.sky || TOD[o.tod || 'dawn'];
    sky(P, Object.assign({ hz: hz + 60 }, o));
    hills(P, hz - 10, 50, shade(pal[2], -0.35), 160, 2);
    if (o.palace) palace(P, o.palace[0], hz + 5, o.palace[1] || 420, o.palace[2] || 300, shade(pal[2], -0.15));
    hills(P, hz + 10, 18, shade(pal[2], -0.5), 190, 5);
    const wc = o.water || mixc(pal[1], '#2a5a7a', 0.55);
    riverWaves(P, hz + 20, 960, wc, shade(wc, -0.4));
    P.noMask(); for (let i = 0; i < 4; i++) { const y = hz + 30 + i * 18; P.wash([[-60, y], [1660, y - 6], [1660, y + 10], [-60, y + 14]], pal[2], 70 - i * 12, 0.03, 0.6, 0.2); } P.mask();
    if (o.reeds) for (let i = 0; i < 70; i++) { const x = P.r(-40, 1640), y = P.r(820, 900); P.line([[x, y + 40], [x + P.r(-14, 14), y - P.r(40, 120)]], '#1e2a1a', 1.2, 'ink', 0.3); }
    if (o.lotus) for (let i = 0; i < o.lotus; i++) lotus(P, P.r(100, 1500), P.r(hz + 120, 860), P.r(18, 34));
    if (o.bank) { P.solid = true; P.shape([[-60, 900], [-60, 720], [200, 700], [o.bank, 760], [o.bank + 120, 960]], o.bankCol || '#5a4630', 235, INK, 1); P.solid = false; }
  },
  court(P, o) { court(P, o.tone || '#5a1a16'); if (o.throne) { P.solid = true; throne(P, o.throne[0], o.throne[1] || 640, o.throne[2] || 220); P.solid = false; } if (o.lamps !== 0) { lampGlow(P, 240, 300, 60); lampGlow(P, 1360, 300, 60); } if (o.canopy) { P.solid = true; P.shape([[400, 60], [1200, 60], [1100, 200], [500, 200]], '#8a1c1c', 230, INK, 1); for (let i = 0; i < 9; i++) P.line([[500 + i * 75, 200], [500 + i * 75, 240]], GOLD, 2.2, 'gold'); P.solid = false; } },
  chamber(P, o) {
    const tone = o.tone || '#2a1418'; P.flat([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], tone);
    P.wash([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], shade(tone, 0.12), 200, 0.01, 0.7, 0.2);
    P.solid = true; const wx = o.window || 1150; P.shape([[wx - 140, 600], [wx + 140, 600], [wx + 140, 250], [wx + 100, 170], [wx, 130], [wx - 100, 170], [wx - 140, 250]], o.windowCol || '#1c3358', 235, GOLD, 2);
    if (o.moon) P.circle(wx + 30, 260, 40, '#f2ecd0', 240);
    P.shape([[-60, 640], [1660, 640], [1660, 960], [-60, 960]], shade(tone, -0.3), 235, null);
    for (let i = 0; i < 2; i++) { const cx = i ? 1500 : 100; P.shape([[cx - 90, -60], [cx + 90, -60], [cx + 60 + Math.sin(i) * 20, 700], [cx - 70, 700]], o.curtain || '#6e1414', 230, INK, 1); }
    P.solid = false; lampGlow(P, o.lamp || 420, 520, 90); P.solid = true; P.shape([[ (o.lamp || 420) - 18, 600], [(o.lamp || 420) + 18, 600], [(o.lamp || 420) + 8, 540], [(o.lamp || 420) - 8, 540]], GOLD, 240, INK, 1); P.solid = false; flames(P, o.lamp || 420, 540, 22, 50, 0);
  },
  forest(P, o) {
    const pal = o.sky || TOD[o.tod || 'day']; sky(P, Object.assign({ hz: 720 }, o));
    hills(P, 600, 50, shade(pal[2], -0.25), 150, 1);
    const can = o.season === 'autumn' ? ['#c0602a', '#d8902a', '#a03a1a', '#e0b040'] : o.tod === 'night' ? ['#0f2a1a', '#14301e', '#0a2014'] : ['#3a6a3a', '#4a7a3a', '#2e5a34', '#5a8a44'];
    trees(P, -100, 1700, 720, 9, o.tod === 'night' ? '#0a0a0a' : '#4a3020', can.map(c => mixc(c, pal[1], 0.35)), 420, 2);
    ground(P, 700, o.groundCol || (o.tod === 'night' ? '#0a140c' : '#5a5a2a'), 230);
    trees(P, -200, 1800, 900, 5, o.tod === 'night' ? '#050505' : '#2a1a10', can, 700, 3);
    if (o.hut) { P.solid = true; const x = o.hut; P.shape([[x - 130, 760], [x + 130, 760], [x + 130, 620], [x - 130, 620]], '#8a6a3a', 230, INK, 1); P.shape([[x - 170, 630], [x, 520], [x + 170, 630]], '#b8964a', 230, INK, 1.2); for (let i = 0; i < 9; i++) P.line([[x - 160 + i * 40, 630], [x - 10 + i * 4, 525]], '#6a5020', 0.8, 'ink', 0); P.shape([[x - 40, 760], [x + 40, 760], [x + 40, 670], [x - 40, 670]], '#1a0e08', 240, INK, 1); P.solid = false; }
  },
  field(P, o) { fieldDawn(P, o.sunX || 820, o.sunY || 520); if (o.armies !== 0) { army(P, 690, 900, -1, '#221510', '#b3202a', o.density || 1); army(P, 690, 900, 1, '#221510', '#2f4f8f', o.density || 1); } if (o.dead) { P.solid = true; for (let i = 0; i < 24; i++) { const x = P.r(0, 1600), y = P.r(740, 900); P.line([[x - 40, y], [x + 40, y - P.r(10, 60)]], '#2a1a10', 2, 'ink', 0); } for (let i = 0; i < 6; i++) { const x = P.r(100, 1500), y = P.r(760, 880); P.line(arcPts(x, y, 40, 0, 360, 20), '#3a2414', 3, 'ink', 0.4); for (let q = 0; q < 6; q++) { const a = q * 60 * D2R; P.line([[x, y], [x + Math.cos(a) * 40, y + Math.sin(a) * 40]], '#3a2414', 2, 'ink', 0); } } P.solid = false; } },
  himalaya(P, o) {
    const pal = o.sky || TOD.snow; sky(P, Object.assign({ hz: 760, clouds: 0 }, o));
    for (let L = 0; L < 3; L++) { const base = 520 + L * 120, col = mixc('#eef2f4', '#5a6a88', 0.25 + L * 0.25); const pts = [[-60, 960]]; for (let x = -60; x <= 1660; x += 60) pts.push([x, base - Math.abs(Math.sin(x * 0.006 + L * 1.7)) * (260 - L * 60) - P.r(0, 30)]); pts.push([1660, 960]); P.wash(pts, col, 220, 0.01, 0.5, 0.3); P.line(pts.slice(1, -1).filter((_, i) => i % 2 === 0), shade(col, -0.35), 0.9, 'ink', 0.3); }
    cloudBank(P, 600, '#f6f8fa', 110, 7, 50);
    ground(P, 820, '#d8e0e8', 230);
  },
  lake(P, o) {
    const pal = o.sky || TOD[o.tod || 'mist']; sky(P, Object.assign({ hz: 520, clouds: 0 }, o));
    trees(P, -100, 1700, 520, 12, '#3a3a30', ['#5a6a50', '#4a5a44', '#6a7a5a'].map(c => mixc(c, pal[1], 0.4)), 260, 4);
    P.wash([[-60, 520], [1660, 515], [1660, 960], [-60, 960]], mixc(pal[1], '#3a6a7a', 0.5), 220, 0.01, 0.6, 0.2);
    P.noMask(); for (let i = 0; i < 8; i++) { const y = 540 + i * 45; P.line([[P.r(0, 600), y], [P.r(900, 1600), y + P.r(-4, 4)]], shade(pal[0], 0.3), 0.8, 'fine', 0.2); } P.mask();
    for (let i = 0; i < (o.lotus ?? 12); i++) lotus(P, P.r(60, 1540), P.r(600, 880), P.r(16, 30));
    P.noMask(); for (let i = 0; i < 4; i++) P.wash([[-60, 480 + i * 40], [1660, 470 + i * 40], [1660, 520 + i * 40], [-60, 530 + i * 40]], '#f2f0e8', 60, 0.04, 0.6, 0.3); P.mask();
  },
  arena(P, o) {
    sky(P, { tod: o.tod || 'day', hz: 500 });
    for (let r = 0; r < 4; r++) { const y = 260 + r * 90; P.shape([[-60, y], [1660, y], [1660, y + 90], [-60, y + 90]], shade('#8a5a3a', -r * 0.08), 230, INK, 1); P.fast = true; for (let i = 0; i < 70; i++) { const x = i * 24 + (r % 2) * 12 - 40; const c = ['#7a2a1a', '#2a4a6a', '#a07a2a', '#5a2a5a', '#3a5a3a'][(i * 7 + r) % 5]; P.dot(x, y + 40, 9, '#5a3a26'); P.dot(x, y + 22, 7, '#2a1a10'); P.shape([[x - 9, y + 50], [x + 9, y + 50], [x + 10, y + 88], [x - 10, y + 88]], c, 255, null); } P.fast = false; }
    for (let i = 0; i < 7; i++) { const x = 80 + i * 240; P.line([[x, 260], [x, 120]], '#4a2a12', 3, 'ink', 0); P.wash([[x, 124], [x + 60, 134], [x, 150]], i % 2 ? '#b3202a' : GOLD, 230, 0.004); }
    P.wash([[-60, 620], [1660, 620], [1660, 960], [-60, 960]], '#d8b07a', 235, 0.01, 0.6, 0.2);
    P.line([[-60, 622], [1660, 622]], GOLD, 2, 'gold', 0);
  },
  palace(P, o) { sky(P, Object.assign({ hz: 700 }, o)); hills(P, 660, 50, shade((o.sky || TOD[o.tod || 'dusk'])[2], -0.4), 180, 2); P.solid = true; palace(P, o.x || 380, o.y || 700, o.w || 840, o.h || 560, o.col || '#c98a5a'); P.solid = false; ground(P, 700, o.ground || '#4a3020', 230); },
  cosmos(P, o) {
    P.flat([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], o.base || '#04030c');
    for (let i = 0; i < 5; i++) P.wash(circlePts(P.r(0, 1600), P.r(0, 900), P.r(200, 500), 30, 1.4, 0.8), ['#2a0a4a', '#0a2a5a', '#4a0a2a', '#0a3a4a', '#3a1a5a'][i], 70, 0.08, 0.7, 0.4);
    stars(P, 520, '#f6efd8', 900);
    for (let i = 0; i < (o.galaxies ?? 5); i++) galaxy(P, P.r(100, 1500), P.r(80, 820), P.r(70, 160), ['#c8b0ff', '#ffd8a0', '#a0d8ff', '#ffb0c8'][i % 4], 3, P.r(0, 360));
  },
  heaven(P, o) {
    skyBands(P, ['#fff4d0', '#f6d890', '#f0b860'], 0, 900, 8, 160);
    for (let i = 0; i < 6; i++) cloudBank(P, 300 + i * 100, ['#fff8e8', '#f8e8c8', '#f0d8a8'][i % 3], 150, 7, 70);
    if (o.gate) { P.solid = true; const x = o.gate; pillar(P, x - 240, 120, 760, 70, '#e8c070'); pillar(P, x + 240, 120, 760, 70, '#e8c070'); P.shape([[x - 300, 120], [x + 300, 120], [x + 270, 60], [x, 0], [x - 270, 60]], GOLD2, 240, '#7a4a10', 1.4); P.solid = false; mandala(P, x, 420, 200, GOLD); }
  },
  camp(P, o) { sky(P, { tod: 'night', hz: 640, moon: [1250, 180, 60] }); hills(P, 620, 40, '#0a1020', 220, 1); ground(P, 640, '#0e0c10', 235); P.solid = true; for (let i = 0; i < 7; i++) { const x = 80 + i * 230, s = 0.7 + (i % 3) * 0.2; P.shape([[x - 110 * s, 700], [x, 560 - 40 * s], [x + 110 * s, 700]], ['#3a2a2a', '#2a2a3a', '#3a3020'][i % 3], 235, INK, 1); } P.solid = false; for (let i = 0; i < 4; i++) lampGlow(P, 200 + i * 400, 720, 70, '#ff9040'); },
  void(P, o) { P.flat([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], o.base || '#0a1030'); P.wash(circlePts(800, 450, 700, 40), shade(o.base || '#0a1030', 0.15), 140, 0.05, 0.6, 0.3); if (o.mandala) mandala(P, o.mx || 800, o.my || 450, o.mandala, o.mcol || GOLD); },
  dark(P, o) { P.flat([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], o.base || '#0a0608'); P.wash(circlePts(o.lx || 800, o.ly || 450, o.lr || 600, 40), o.glow || '#3a1a14', 160, 0.05, 0.6, 0.3); },
};

// ---------------------------------------------------------------- effects (anim) ---
const FX = {
  sparkle(P, t, o) { const r = mulberry(o.seed || 3); for (let i = 0; i < (o.n || 60); i++) { const x = r() * 1600, y = (o.y0 || 600) + r() * ((o.y1 || 900) - (o.y0 || 600)); const tw = Math.max(0, Math.sin(t * (1.5 + r() * 3) + i * 2.1)); if (tw > 0.2) P.dot(x + Math.sin(t + i) * 8, y, (o.sz || 2.4) * tw, o.col || '#fff4d0', 220 * tw); } },
  embers(P, t, o) { particles(P, t, o.n || 80, o.col || '#ff9040', { vy: o.vy ?? -40, vx: o.vx ?? 8, sz: o.sz || 2.6, seed: o.seed || 5 }); },
  dust(P, t, o) { particles(P, t, o.n || 120, o.col || '#c07a4a', { vy: o.vy ?? -6, vx: o.vx ?? 14, sz: o.sz || 2.4, seed: o.seed || 4 }); },
  fireflies(P, t, o) { particles(P, t, o.n || 60, o.col || '#c8e070', { vy: -5, vx: 5, sz: 2.8, seed: o.seed || 8 }); },
  stars(P, t, o) { const r = mulberry(o.seed || 2); for (let i = 0; i < (o.n || 120); i++) { const x = r() * 1600, y = r() * (o.y1 || 900), tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 3) + i); P.dot(x, y, (o.sz || 1.8) * (0.6 + tw * 0.6), o.col || '#fff8e0', 120 + 130 * tw); } },
  rain(P, t, o) { const r = mulberry(o.seed || 6); brush.set('fine', o.col || '#9ab0d0', 0.7); for (let i = 0; i < (o.n || 160); i++) { const x = ((r() * 1800 + t * 260) % 1800) - 100, y = ((r() * 1000 + t * 1300) % 1000) - 50; brush.line(x, y, x - 10, y + 40); } brush.noStroke(); },
  snow(P, t, o) { particles(P, t, o.n || 140, o.col || '#ffffff', { vy: 30, vx: -14, sz: o.sz || 2.6, seed: o.seed || 7 }); },
  petals(P, t, o) { // flowers raining from the sky (colour layer, masked)
    P.fast = true; const r = mulberry(o.seed || 11); const cols = o.cols || ['#f0a0b4', '#f6f1e4', '#f2b23a', '#e04a6a'];
    for (let i = 0; i < (o.n || 90); i++) { const x0 = r() * 1700 - 50, y0 = r() * 1000 - 100, sp = 40 + r() * 60, x = x0 + Math.sin(t * 1.3 + i) * 30, y = ((y0 + sp * t) % 1000) - 50; const a = t * 2 + i, s = 7 + r() * 6; P.shape([[x + Math.cos(a) * s, y + Math.sin(a) * s * 0.5], [x - Math.sin(a) * s * 0.4, y + Math.cos(a) * s * 0.4], [x - Math.cos(a) * s, y - Math.sin(a) * s * 0.5], [x + Math.sin(a) * s * 0.4, y - Math.cos(a) * s * 0.4]], cols[i % cols.length], 255, null); }
  },
  leaves(P, t, o) { P.fast = true; const r = mulberry(o.seed || 12); const cols = o.cols || ['#c0602a', '#d8902a', '#a03a1a', '#e0b040']; for (let i = 0; i < (o.n || 40); i++) { const x0 = r() * 1800 - 100, y0 = r() * 1000, x = x0 - t * 40 + Math.sin(t * 1.7 + i) * 40, y = ((y0 + t * (50 + r() * 40)) % 1000) - 50, a = t * 3 + i, s = 12 + r() * 8; P.shape([[x + Math.cos(a) * s, y + Math.sin(a) * s * 0.6], [x - Math.sin(a) * s * 0.3, y + Math.cos(a) * s * 0.3], [x - Math.cos(a) * s, y - Math.sin(a) * s * 0.6], [x + Math.sin(a) * s * 0.3, y - Math.cos(a) * s * 0.3]], cols[i % cols.length], 255, null); } },
  rays(P, t, o) { rays(P, o.x || 800, o.y || 300, o.n || 36, o.r0 || 80, o.r1 || 900, o.col || '#f6d890', (o.rot || 0) + t * (o.spin ?? 3), o.w || 1.6); },
  glow(P, t, o) { const k = 0.8 + 0.2 * Math.sin(t * (o.rate || 2)); for (let i = 0; i < 12; i++) P.wash(circlePts(o.x || 800, o.y || 450, (o.r || 260) * (1 - i * 0.075) * k, 36), o.col || '#f6d890', 16, 0.08, 0.2, 0.1); },
  fire(P, t, o) { for (const [x, y, w, h] of (o.at || [[800, 760, 300, 300]])) flames(P, x, y, w, h, t); particles(P, t, o.n || 50, '#ff9040', { vy: -60, vx: 10, sz: 2.4, seed: 5 }); },
  flash(P, t, o) { for (const t0 of (o.at || [])) { const k = t - t0; if (k >= 0 && k < 0.5) { P.wash([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], o.col || '#dfefff', 255 * (1 - k / 0.5), 0.01, 0.2, 0.1); if (o.bolt) lightning(P, o.bolt + Math.sin(t0) * 200, 0, 700, Math.floor(t0 * 10)); } } },
  ripples(P, t, o) { for (let i = 0; i < (o.n || 5); i++) { const k = ((t * 0.4 + i / (o.n || 5)) % 1); P.line(arcPts(o.x || 800, o.y || 700, 30 + k * (o.r || 400), 0, 360, 48).map(p => [p[0], (o.y || 700) + (p[1] - (o.y || 700)) * 0.22]), o.col || '#dff0ff', 1.4 * (1 - k), 'fine', 0.3); } },
  wheel(P, t, o) { // a turning ring of light (chakras, mandalas)
    const x = o.x || 800, y = o.y || 450, R = o.r || 200, rot = t * (o.spin ?? 30); P.line(arcPts(x, y, R, 0, 360, 72), o.col || GOLD2, 2.2, 'gold', 0.5);
    for (let i = 0; i < (o.spokes || 24); i++) { const a = (rot + i * 360 / (o.spokes || 24)) * D2R; P.line([[x + Math.cos(a) * R * 0.3, y + Math.sin(a) * R * 0.3], [x + Math.cos(a) * R, y + Math.sin(a) * R]], o.col || GOLD2, 1.2, 'fine', 0); }
  },
};

// ---------------------------------------------------------------- figures ---
const SERIES_CAST = {
  shantanu: { skin: '#b9875c', dhoti: '#7a1a2a', patka: '#d2a23a', scarf: '#e0a43a', crown: 'mukut', hair: '#1c140e', beard: 'short', jewel: GOLD },
  devavrata: { skin: '#b9875c', dhoti: '#ece6d6', patka: '#c9b57a', scarf: '#f4efe2', crown: 'mukut', hair: '#16100c', beard: 'stache', jewel: GOLD },
  dhrita: { skin: '#b68a64', dhoti: '#6a1a2a', patka: '#d2a23a', scarf: '#e0a43a', crown: 'mukut', hair: '#bdb6aa', beard: 'long', jewel: GOLD, age: 1 },
  vidura: { skin: '#b08660', dhoti: '#d8c8a0', patka: '#a0522d', scarf: '#d9c9a0', crown: 'bun', hair: '#a8a298', beard: 'short', jewel: '#cfc6a8', age: 1 },
  nakula: { skin: '#b48058', dhoti: '#2f7a6a', patka: '#e3a43a', scarf: '#d24a2a', crown: 'mukut', hair: '#1a120d', beard: 'stache', jewel: GOLD },
  sahadeva: { skin: '#ad7b54', dhoti: '#5a4a9a', patka: '#e3a43a', scarf: '#6a8f4e', crown: 'mukut', hair: '#1a120d', beard: 'stache', jewel: GOLD },
  dushasana: { skin: '#94603c', dhoti: '#5a1a1a', patka: '#6e1d22', scarf: '#3a1a3a', crown: 'mukut', hair: '#0e0a08', beard: 'stache', jewel: '#b88b2e', bulk: 1.2 },
  ashwa: { skin: '#a8784e', dhoti: '#6a3a1a', patka: '#a0522d', scarf: '#3a2a1a', crown: 'bun', hair: '#120d0a', beard: 'stache', jewel: '#cfc6a8' },
  shikhandi: { skin: '#a9784e', dhoti: '#8a2a5a', patka: '#e3a43a', scarf: '#f0c040', crown: 'mukut', hair: '#120d0a', beard: null, jewel: GOLD },
  jayadratha: { skin: '#a27350', dhoti: '#3a3a6a', patka: '#6e1d22', scarf: '#5a3a1a', crown: 'mukut', hair: '#120d0a', beard: 'short', jewel: '#b88b2e' },
  indra: { skin: '#d0a27a', dhoti: '#3a6ab0', patka: '#e9b52f', scarf: '#f0c040', crown: 'mukut', hair: '#1a120d', beard: 'stache', jewel: GOLD },
  dharma: { skin: '#c99a5a', dhoti: '#f0c040', patka: '#c7362b', scarf: '#f6e6b0', crown: 'mukut', hair: '#1a120d', beard: 'short', jewel: GOLD },
  shiva: { skin: '#7d8fa8', dhoti: '#6a4a2a', patka: '#3a2a1a', scarf: '#8a6a3a', crown: 'bun', hair: '#2a2430', beard: null, jewel: '#cfc6a8' },
  brahmin: { skin: '#a8784e', dhoti: '#e8dcc0', patka: '#d9c9a0', scarf: '#e8dcc0', crown: 'bun', hair: '#16100c', beard: 'stache', jewel: '#cfc6a8' },
  soldier: { skin: '#94603c', dhoti: '#5a3a2a', patka: '#3a2a1a', scarf: null, crown: 'band', hair: '#120d0a', beard: 'stache', jewel: '#8a7a5a' },
  fisher: { skin: '#8a5a3a', dhoti: '#c8b890', patka: '#6a5a3a', scarf: null, crown: 'turban', hair: '#3a3530', beard: 'goatee', jewel: '#8a7a5a', age: 1 },
};
Object.assign(CAST, SERIES_CAST);
const WOMEN = {
  draupadi: { skin: '#7a4c32', sari: '#b3202a', border: GOLD }, kunti: { skin: '#b88a62', sari: '#f2ede0', border: '#c9b57a' },
  gandhari: { skin: '#c4946a', sari: '#7a5a2a', border: GOLD }, ganga: { skin: '#c8a07e', sari: '#2f6f9a', border: '#e8f0f0' },
  satyavati: { skin: '#94603e', sari: '#2f8a6a', border: GOLD }, madri: { skin: '#b88a62', sari: '#5a2a6a', border: GOLD },
};
function drawFigs(P, figs, t) {
  for (const g of figs) {
    if (g.sil) P.silhouette(g.sil === true ? '#160f19' : g.sil, g.silK ?? 0.14); else P.noSilhouette();
    P.solid = true;
    if (WOMEN[g.who] || g.woman) woman(P, Object.assign({}, WOMEN[g.who] || {}, g, { t }));
    else figure(P, Object.assign({}, g, { t }));
    P.noSilhouette();
  }
  P.solid = false;
}

// ---------------------------------------------------------------- dispatcher ---
const PIECES = {};
function drawSpec(P, L, t, job) {
  if (L.set) SETS[L.set](P, L);
  if (L.draw) PIECES[L.draw](P, t, L.args || {}, job);
  if (L.figs) drawFigs(P, L.figs, t);
  if (L.portrait) { const ps = Array.isArray(L.portrait) ? L.portrait : [L.portrait]; for (const p of ps) portrait(P, p.who, Object.assign({}, p, { t })); }
  if (L.fx) { const fs = Array.isArray(L.fx) ? L.fx : [L.fx]; for (const f of fs) FX[f.kind](P, t, f); }
}
