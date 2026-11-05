// Every painted layer of the film. Plate space is 1600 x 900. A layer's draw(P, t) paints it with p5.brush:
// plates are painted once (t = 0); anim layers are painted again for each animation frame (t in seconds).
// mode 'add' layers are painted on black and added as light; other layers are painted on paper and cut out by their mask.

const SIL = '#160f19';                     // shadow-puppet silhouette ink
const hero = (P, o, k = 0.14) => { P.solid = true; P.silhouette(o.sil || SIL, k); return figure(P, o); };
const colourHero = (P, o) => { P.solid = true; P.noSilhouette(); return figure(P, o); };

// ---------- shared painted pieces ----------
function stormSky(P, top, mid, low) { skyBands(P, [top, mid, low], 0, 900, 8, 150); cloudBank(P, 260, shade(top, -0.2), 80, 7, 90); cloudBank(P, 420, shade(mid, -0.25), 70, 6, 70); }
function mandala(P, x, y, R, col, n = 5) {
  for (let i = 0; i < n; i++) { const r = R * (1 - i * 0.17); P.line(arcPts(x, y, r, 0, 360, 72), col, 1.2 - i * 0.12, 'gold', 0.5); }
  for (let i = 0; i < 24; i++) { const a = i * 15, p1 = [x + Math.cos(a * D2R) * R * 0.34, y + Math.sin(a * D2R) * R * 0.34], p2 = [x + Math.cos((a + 7.5) * D2R) * R * 0.5, y + Math.sin((a + 7.5) * D2R) * R * 0.5], p3 = [x + Math.cos((a + 15) * D2R) * R * 0.34, y + Math.sin((a + 15) * D2R) * R * 0.34]; P.line([p1, p2, p3], col, 0.9, 'gold', 0.6); }
  for (let i = 0; i < 48; i++) { const a = i * 7.5 * D2R; P.dot(x + Math.cos(a) * R * 0.92, y + Math.sin(a) * R * 0.92, 2.2, col, 230); }
}
function lightning(P, x, y0, y1, seed, col = '#dfefff', w = 2.2) {
  const r = mulberry(seed); let p = [x, y0]; const pts = [p];
  while (p[1] < y1) { p = [p[0] + (r() - 0.5) * 70, p[1] + 30 + r() * 40]; pts.push(p); if (r() < 0.25) { const b = [p, [p[0] + (r() - 0.5) * 140, p[1] + 60 + r() * 50]]; P.line(b, col, w * 0.5, 'ink', 0); } }
  P.line(pts, col, w, 'ink', 0); P.line(pts, shade(col, 0.4), w * 2.6, 'dry', 0);
}
function fieldDawn(P, sunX = 1100, sunY = 520, warm = 1) {
  skyBands(P, ['#f3dcae', '#ec9b5e', '#b5482f'], 0, 720, 7, 140);
  cloudBank(P, 300, '#f6c890', 70, 6, 50);
  sunDisc(P, sunX, sunY, 110, '#d23a22');
  hills(P, 640, 60, '#7a3f2e', 160, 1); hills(P, 680, 30, '#5a2e24', 180, 3);
  ground(P, 690, '#8a5a3e', 180);
}
function court(P, tone = '#5a1a16') {
  P.wash([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], tone, 230, 0.005, 0.6, 0.2);
  P.wash([[-60, 620], [1660, 620], [1660, 960], [-60, 960]], shade(tone, -0.35), 220, 0.005, 0.6, 0.2);
  for (let i = 0; i < 6; i++) { const x = 100 + i * 280; P.solid = true; P.noSilhouette(); pillar(P, x, 80, 640, 64, '#8a4a2e'); }
  P.solid = false;
  for (let i = 0; i < 5; i++) { const x = 240 + i * 280; P.line(arcPts(x, 260, 120, 180, 360, 20), GOLD, 1.4, 'gold', 0.5); }
  for (let i = 0; i < 9; i++) { const x = 60 + i * 190; P.line([[x - 120, 900], [x, 640]], shade(tone, -0.55), 0.8, 'ink', 0); }
  P.line([[-60, 640], [1660, 640]], GOLD, 1.6, 'gold', 0);
}
function lampGlow(P, x, y, r, col = '#ffb050') { for (let i = 0; i < 3; i++) P.wash(circlePts(x, y, r * (1 - i * 0.3), 24), col, 70 + i * 50, 0.03, 0.3, 0.2); }
function rays(P, x, y, n, r0, r1, col, rot, w = 1.4) { for (let i = 0; i < n; i++) { const a = (rot + i * 360 / n) * D2R, wob = 1 + 0.15 * Math.sin(i * 3.7); P.line([[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1 * wob, y + Math.sin(a) * r1 * wob]], col, w, 'dry', 0); } }
function particles(P, t, n, col, opt = {}) {
  const r = mulberry(opt.seed || 9);
  for (let i = 0; i < n; i++) {
    const x0 = r() * 1700 - 50, y0 = r() * 950, sp = (opt.vy ?? -18) * (0.5 + r()), sx = (opt.vx ?? 6) * (r() - 0.3);
    let x = x0 + sx * t + Math.sin(t * 0.8 + i) * 12, y = ((y0 + sp * t) % 950 + 950) % 950;
    const sz = (opt.sz || 2.2) * (0.5 + r()), tw = 0.5 + 0.5 * Math.sin(t * (2 + r() * 3) + i);
    P.dot(x, y, sz, col, 80 + 170 * tw);
  }
}
function lyingFigure(P, who, x, y, S) { return hero(P, { who, x, y, S, f: 1, pose: 'stand', rot: -90, poseOver: { aF: [20, 30], aB: [-10, 0] } }, 0.16); }
function frontalHead(P, x, y, R, skin, fierce = 0) {
  const face = [[0, -1.0], [0.55, -0.85], [0.78, -0.4], [0.76, 0.1], [0.6, 0.55], [0.3, 0.9], [0, 1.0], [-0.3, 0.9], [-0.6, 0.55], [-0.76, 0.1], [-0.78, -0.4], [-0.55, -0.85]].map(p => [x + p[0] * R, y + p[1] * R]);
  P.shape(face, skin, 220, INK, 1.4, 0.006);
  for (const sd of [-1, 1]) {
    const ex = x + sd * R * 0.34, ey = y - R * 0.12;
    P.shape([[ex - sd * R * 0.2, ey], [ex, ey - R * 0.1], [ex + sd * R * 0.24, ey - R * 0.02], [ex, ey + R * 0.08]], fierce ? '#fff0c0' : '#f6f1e4', 240, INK, 1.2, 0.003);
    P.dot(ex + sd * R * 0.01, ey - R * 0.005, R * 0.05, fierce ? '#b3202a' : INK, 255);
    P.line([[ex - sd * R * 0.24, ey - R * 0.2], [ex, ey - R * 0.27], [ex + sd * R * 0.28, ey - R * 0.16]], INK, 1.6, 'ink', 0.6);
  }
  P.line([[x, y - R * 0.12], [x - R * 0.06, y + R * 0.3], [x + R * 0.06, y + R * 0.34]], INK, 1.2, 'ink', 0.4);
  if (fierce) { P.shape([[x - R * 0.34, y + R * 0.5], [x + R * 0.34, y + R * 0.5], [x + R * 0.22, y + R * 0.78], [x - R * 0.22, y + R * 0.78]], '#3a0806', 240, INK, 1.2); P.wash([[x - R * 0.26, y + R * 0.56], [x + R * 0.26, y + R * 0.56], [x + R * 0.16, y + R * 0.74], [x - R * 0.16, y + R * 0.74]], '#f08a24', 200, 0.01); for (const sd of [-1, 1]) P.shape([[x + sd * R * 0.2, y + R * 0.5], [x + sd * R * 0.26, y + R * 0.5], [x + sd * R * 0.23, y + R * 0.66]], '#f6f1e4', 250, INK, 0.8); }
  else P.shape([[x - R * 0.16, y + R * 0.56], [x, y + R * 0.52], [x + R * 0.16, y + R * 0.56], [x, y + R * 0.64]], '#b3202a', 230, INK, 0.8);
  P.dot(x, y - R * 0.42, R * 0.05, '#b3202a'); P.line([[x - R * 0.06, y - R * 0.38], [x, y - R * 0.66], [x + R * 0.06, y - R * 0.38]], '#f6f1e4', 2, 'gold', 0.3);
  // crown
  const cr = [[-0.72, -0.62], [-0.8, -1.05], [-0.5, -1.2], [-0.42, -1.6], [-0.18, -1.7], [0, -2.15], [0.18, -1.7], [0.42, -1.6], [0.5, -1.2], [0.8, -1.05], [0.72, -0.62], [0, -0.82]].map(p => [x + p[0] * R, y + p[1] * R]);
  P.shape(cr, GOLD, 235, INK, 1.4, 0.006);
  P.line([[x - R * 0.74, y - R * 0.74], [x, y - R * 0.92], [x + R * 0.74, y - R * 0.74]], '#8a1c1c', 3, 'gold', 0.4);
  for (let i = -2; i <= 2; i++) P.dot(x + i * R * 0.22, y - R * 1.1 - (2 - Math.abs(i)) * R * 0.12, R * 0.05, i === 0 ? '#2a7a5a' : '#b3202a');
  for (const sd of [-1, 1]) { P.circle(x + sd * R * 0.82, y + R * 0.2, R * 0.12, GOLD2, 240, INK, 1); }
}
function frontalBody(P, x, y, S, skin, cloth) { // seated-frontal torso for the cosmic form (y = navel)
  const tor = [[-0.2, 0.05], [-0.24, -0.15], [-0.36, -0.36], [-0.3, -0.44], [-0.08, -0.47], [0.08, -0.47], [0.3, -0.44], [0.36, -0.36], [0.24, -0.15], [0.2, 0.05]].map(p => [x + p[0] * S, y + p[1] * S]);
  P.shape(tor, skin, 220, INK, 1.6, 0.006);
  P.shape([[-0.24, 0.0], [0.24, 0.0], [0.42, 0.42], [0.0, 0.5], [-0.42, 0.42]].map(p => [x + p[0] * S, y + p[1] * S]), cloth, 225, INK, 1.6, 0.006);
  for (let i = 0; i < 3; i++) P.line(arcPts(x, y - S * 0.42, S * (0.12 + i * 0.06), 20, 160, 12), i === 1 ? '#f2efe2' : GOLD, 2.6 - i * 0.4, 'gold', 0.5);
  P.line([[x - S * 0.24, y], [x, y + S * 0.03], [x + S * 0.24, y]], GOLD, 4, 'gold', 0.4);
}
function cosmicArms(P, x, y, S, skin, n, items, spread = 290) {
  for (let i = 0; i < n; i++) {
    const k = i / (n - 1), a = -spread / 2 + k * spread, sd = a < 0 ? -1 : 1;
    const sh = [x + sd * S * 0.3, y - S * 0.4]; const dir = [Math.sin(a * D2R), -Math.cos(a * D2R)];
    const el = [sh[0] + dir[0] * S * 0.32, sh[1] + dir[1] * S * 0.32]; const bend = (a + sd * 25) * D2R;
    const wr = [el[0] + Math.sin(bend) * S * 0.28, el[1] - Math.cos(bend) * S * 0.28];
    P.shape(capsule(sh, el, S * 0.05, S * 0.04), skin, 215, INK, 1.2, 0.006); P.shape(capsule(el, wr, S * 0.04, S * 0.03), skin, 215, INK, 1.2, 0.006);
    P.line([lerp2(el, wr, 0.85), lerp2(el, wr, 0.88)], GOLD, 4, 'gold'); P.circle(wr[0], wr[1], S * 0.035, skin, 220, INK, 1);
    const it = items[i % items.length];
    if (it === 'chakra') { P.circle(wr[0], wr[1] - S * 0.07, S * 0.06, GOLD2, 230, INK, 1); for (let q = 0; q < 8; q++) { const aa = q * 45 * D2R; P.line([[wr[0], wr[1] - S * 0.07], [wr[0] + Math.cos(aa) * S * 0.06, wr[1] - S * 0.07 + Math.sin(aa) * S * 0.06]], '#7a4a10', 1, 'ink', 0); } }
    if (it === 'conch') P.shape(circlePts(wr[0], wr[1] - S * 0.05, S * 0.05, 14, 1.3, 0.8), '#f4efe0', 240, INK, 1);
    if (it === 'mace') { P.line([wr, [wr[0] + dir[0] * S * 0.25, wr[1] + dir[1] * S * 0.25]], '#5a3416', 3, 'ink', 0); P.circle(wr[0] + dir[0] * S * 0.27, wr[1] + dir[1] * S * 0.27, S * 0.05, GOLD, 235, INK, 1); }
    if (it === 'lotus') { for (let q = 0; q < 5; q++) { const aa = (-90 + (q - 2) * 28) * D2R; P.shape([[wr[0], wr[1]], [wr[0] + Math.cos(aa - 0.25) * S * 0.05, wr[1] + Math.sin(aa - 0.25) * S * 0.05], [wr[0] + Math.cos(aa) * S * 0.1, wr[1] + Math.sin(aa) * S * 0.1], [wr[0] + Math.cos(aa + 0.25) * S * 0.05, wr[1] + Math.sin(aa + 0.25) * S * 0.05]], '#f08aa0', 230, INK, 0.8); } }
    if (it === 'bow') P.line(arcPts(wr[0], wr[1], S * 0.18, a - 90 - 50, a - 90 + 50, 10), '#5a3416', 2.4, 'ink', 0.5);
    if (it === 'sword') { P.line([wr, [wr[0] + dir[0] * S * 0.3, wr[1] + dir[1] * S * 0.3]], '#e8e8e8', 3, 'ink', 0); }
    if (it === 'fire') P.wash(circlePts(wr[0], wr[1] - S * 0.06, S * 0.05, 10), '#f08a24', 220, 0.02);
  }
}

// ---------- the shots ----------
const SHOTS = {
  s01_ink: { layers: {
    bloom: { mode: 'add', draw(P, t) {
      const k = ease(t / 6.5), r = 40 + k * 520;
      P.wash(circlePts(800, 450, r * 1.1, 40), '#5a0c06', 120, 0.06, 0.6, 0.4);
      P.wash(circlePts(800, 450, r * 0.75, 40), '#a3241e', 120, 0.05, 0.6, 0.4);
      P.wash(circlePts(800, 450, r * 0.4, 36), '#e0602a', 90 * k, 0.05, 0.5, 0.3);
      rays(P, 800, 450, 36, r * 0.5, r * 1.15, '#7a2a10', t * 4, 0.9);
    } } } },

  s02_field: { layers: {
    bg: { draw(P) { fieldDawn(P, 820, 520); army(P, 690, 900, -1, '#221510', '#b3202a'); army(P, 690, 900, 1, '#221510', '#2f4f8f'); } },
    dust: { mode: 'add', draw(P, t) { particles(P, t, 140, '#c07a4a', { vy: -6, vx: 14, sz: 2.4, seed: 4 }); for (let i = 0; i < 5; i++) { const y = 700 + i * 40; P.wash([[-60, y], [1660, y - 20], [1660, y + 30], [-60, y + 50]].map(p => [p[0] + Math.sin(t * 0.3 + i) * 60, p[1]]), '#4a2412', 40, 0.05, 0.7, 0.3); } } } } },

  s03_title: { layers: {
    bg: { bg: '#141634', draw(P) { P.wash([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], '#141634', 240, 0.005, 0.6, 0.2); P.wash(circlePts(800, 450, 420, 48), '#262a5a', 160, 0.04, 0.6, 0.3); mandala(P, 800, 450, 400, GOLD, 6); mandala(P, 800, 450, 230, '#b5862a', 3); } },
    rays: { mode: 'add', draw(P, t) { rays(P, 800, 450, 48, 120, 760, '#5a4010', t * 6, 1.6); P.wash(circlePts(800, 450, 160 + 10 * Math.sin(t * 2), 36), '#3a2a08', 140, 0.05, 0.5, 0.3); } },
    swipe: { draw(P) { P.solid = true; const pts = []; for (let i = 0; i <= 20; i++) pts.push([180 + i * 62, 400 + Math.sin(i * 0.7) * 10 - (i === 0 || i === 20 ? 0 : 30)]); for (let i = 20; i >= 0; i--) pts.push([180 + i * 62, 500 + Math.sin(i * 0.9) * 12 + (i === 0 || i === 20 ? 0 : 30)]); P.shape(pts, '#5a0c0a', 230, null); for (let i = 0; i < 10; i++) P.line([[180 + P.r(0, 100), 380 + i * 14], [1420 - P.r(0, 100), 384 + i * 14]], '#3a0606', 1.2, 'dry', 0.2); } } } },

  h_bhishma: { layers: {
    bg: { bg: '#1a2240', draw(P) { stormSky(P, '#141c3a', '#2a3a6a', '#4a5a7a'); palace(P, 1120, 640, 300, 200, '#2a3048'); riverWaves(P, 640, 960, '#2a4a6a', '#122436'); } },
    bolt: { mode: 'add', draw(P, t) { for (const [t0, x, sd] of [[0.15, 1250, 3], [2.6, 980, 7], [4.9, 1380, 11]]) { const k = t - t0; if (k > 0 && k < 0.5) { const fl = k < 0.08 ? 1 : 1 - k / 0.5; lightning(P, x, -20, 600, sd, mixc('#000000', '#e0f0ff', fl), 2.4); P.wash([[-60, -60], [1660, -60], [1660, 700], [-60, 700]], mixc('#000000', '#20305a', fl), 160, 0.01); } } } },
    hero: { draw(P) { hero(P, { who: 'bhishma', x: 560, y: 900, S: 780, f: 1, pose: 'vow', wind: 1.2 }); } },
    spray: { mode: 'add', draw(P, t) { particles(P, t, 120, '#6a8ab0', { vy: -40, vx: 10, sz: 2, seed: 2 }); } } } },

  h_yudhi: { layers: {
    bg: { draw(P) { skyBands(P, ['#f6e7b8', '#eac27a', '#c9a060'], 0, 720, 7, 140); hills(P, 660, 80, '#7a8a5a', 160, 2); hills(P, 700, 40, '#4a5a3a', 180, 5); ground(P, 700, '#5a5a32', 190); P.solid = true; palace(P, 300, 690, 220, 160, '#b58a5a'); } },
    wheel: { mode: 'add', draw(P, t) { const x = 560, y = 420, R = 300, rr = t * 8; P.line(arcPts(x, y, R, 0, 360, 72), '#7a5a1a', 2.2, 'ink', 0.5); P.line(arcPts(x, y, R * 0.9, 0, 360, 72), '#5a4010', 1.4, 'ink', 0.5); for (let i = 0; i < 24; i++) { const a = (rr + i * 15) * D2R; P.line([[x + Math.cos(a) * 40, y + Math.sin(a) * 40], [x + Math.cos(a) * R * 0.9, y + Math.sin(a) * R * 0.9]], '#6a4a14', 1.4, 'ink', 0); } P.circle(x, y, 44, '#5a4010', 160); } },
    hero: { draw(P) { hero(P, { who: 'yudhi', x: 1080, y: 900, S: 760, f: -1, pose: 'spear', weapon: 'spear', wind: 0.6 }); } },
    motes: { mode: 'add', draw(P, t) { particles(P, t, 90, '#8a6a20', { vy: -10, vx: 4, sz: 2.2, seed: 6 }); } } } },

  h_bhima: { layers: {
    bg: { bg: '#221c2c', draw(P) { stormSky(P, '#1a1a2a', '#3a2a4a', '#5a3a3a'); hills(P, 560, 160, '#2a2030', 190, 4); for (let i = 0; i < 7; i++) { const x = 100 + i * 230, y = 860, r = 80 + P.r(0, 70); P.shape([[x - r, y + 40], [x - r * 0.8, y - r * 0.6], [x - r * 0.1, y - r], [x + r * 0.7, y - r * 0.5], [x + r, y + 40]], '#241c22', 220, INK, 1.2); } ground(P, 860, '#1c161a', 230); } },
    hero: { draw(P) { hero(P, { who: 'bhima', x: 600, y: 900, S: 660, f: 1, pose: 'maceUp', weapon: 'mace', maceAng: -10, wind: 1.4 }); } },
    wind: { mode: 'add', draw(P, t) { const r = mulberry(5); for (let i = 0; i < 26; i++) { const y = r() * 900, x0 = ((r() * 2000 + t * 900 * (0.6 + r())) % 2200) - 300, L = 160 + r() * 260; const pts = []; for (let q = 0; q < 6; q++) pts.push([x0 + q * L / 5, y + Math.sin(q * 0.9 + i + t * 2) * 18]); P.line(pts, '#b0b0c8', 1.2 + r() * 1.6, 'ink', 0.6); } } } } },

  h_arjuna: { layers: {
    bg: { bg: '#1a3a4a', draw(P) { skyBands(P, ['#0f2a3a', '#1f5a6a', '#6a9a9a'], 0, 760, 8, 150); sunDisc(P, 1240, 640, 70, '#e9b06a', 150); hills(P, 700, 50, '#123040', 180, 2); ground(P, 740, '#0e2028', 220);
      // the target: a wooden bird on a tall pole
      P.solid = true; P.line([[1360, 740], [1360, 300]], INK, 2.4, 'ink', 0); P.shape([[1320, 300], [1400, 296], [1420, 286], [1404, 306], [1330, 312]], '#a8742a', 230, INK, 1.2); P.dot(1395, 296, 3.2, '#b3202a'); } },
    hero: { draw(P) { hero(P, { who: 'arjuna', x: 470, y: 900, S: 760, f: 1, pose: 'draw', weapon: 'bowDrawn', wind: 1 }); } },
    hero2: { draw(P) { hero(P, { who: 'arjuna', x: 470, y: 900, S: 760, f: 1, pose: 'release', weapon: 'bow', wind: 1.2 }); } },
    arrow: { mode: 'add', draw(P, t) {
      const sx = 470 + 0.33 * 760, sy = 900 - 0.52 * 760 - 0.3 * 760 + 0.035 * 760, tx = 1395, ty = 296;
      if (t < 3.6) { const g = 0.6 + 0.4 * Math.sin(t * 6); P.wash(circlePts(sx + 140, sy + 6, 14 + 6 * g, 16), '#4a8aa0', 140, 0.03); return; }
      const k = clamp01((t - 3.6) / 0.5), px = sx + (tx - sx) * k, py = sy + (ty - sy) * k;
      P.line([[px - (tx - sx) * 0.25, py - (ty - sy) * 0.25], [px, py]], '#bff2ff', 3, 'ink', 0); P.line([[px - (tx - sx) * 0.4, py - (ty - sy) * 0.4], [px, py]], '#3a8aa0', 6, 'dry', 0);
      if (t > 4.1) { const q = clamp01((t - 4.1) / 0.8); rays(P, tx, ty, 18, 10, 30 + q * 140, mixc('#9fe8ff', '#000000', q), 0, 2); P.wash(circlePts(tx, ty, 20 + q * 60, 18), mixc('#6ab0c0', '#000000', q), 160, 0.03); }
    } } } },

  h_draupadi: { layers: {
    bg: { bg: '#1a0606', draw(P) { P.wash([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], '#1a0606', 240, 0.005, 0.6, 0.2); P.wash(circlePts(800, 900, 700, 40), '#3a0a08', 160, 0.05); P.solid = true; P.shape([[560, 900], [600, 800], [1000, 800], [1040, 900]], '#3a1a10', 230, INK, 1.4); for (let i = 0; i < 6; i++) P.line([[600 + i * 80, 800], [580 + i * 90, 900]], '#5a2a1a', 1, 'ink', 0); } },
    fireback: { mode: 'add', draw(P, t) { flames(P, 800, 860, 900, 820, t, ['#3a0802', '#8a1e08', '#c2480f', '#e08a2a']); } },
    hero: { draw(P) { P.solid = true; P.silhouette(SIL, 0.22); woman(P, { x: 1020, y: 860, S: 740, f: -1, sari: '#b3202a', wind: 1.4, t: 0.6 }); } },
    embers: { mode: 'add', draw(P, t) { particles(P, t, 160, '#ff8a30', { vy: -70, vx: 10, sz: 2.2, seed: 3 }); } } } },

  h_karna: { layers: {
    bg: { bg: '#e89a3a', draw(P) { skyBands(P, ['#f6c060', '#e88a2a', '#b2401a'], 0, 900, 8, 150); P.wash(circlePts(560, 420, 330, 48), '#f6d070', 220, 0.03); P.wash(circlePts(560, 420, 300, 48), '#ffe8a0', 200, 0.02); hills(P, 760, 50, '#7a2a10', 190, 2); ground(P, 780, '#4a1a0a', 220); } },
    sunrays: { mode: 'add', draw(P, t) { rays(P, 560, 420, 40, 320, 900, '#6a3a08', t * 5, 2.2); rays(P, 560, 420, 20, 300, 640, '#8a5a10', -t * 3, 3); } },
    hero: { draw(P) { hero(P, { who: 'karna', x: 600, y: 900, S: 790, f: 1, pose: 'bless', weapon: 'bow', wind: 0.8 }, 0.18); } } } },

  h_duryo: { layers: {
    bg: { bg: '#2a0808', draw(P) { stormSky(P, '#1a0606', '#4a0e0e', '#7a2a1a'); P.solid = true; palace(P, 150, 700, 420, 300, '#2a1010'); P.line([[1400, 760], [1400, 120]], INK, 3, 'ink', 0); const fl = []; for (let i = 0; i < 8; i++) fl.push([1400 + i * 30, 140 + Math.sin(i) * 14]); P.shape(ribbon(fl, 36, 24), '#2a2a1a', 230, INK, 1.2); P.line([[1430, 150], [1460, 130], [1490, 150], [1520, 135]], GOLD, 2, 'gold', 0.6); ground(P, 760, '#1a0a0a', 230); } },
    bolt: { mode: 'add', draw(P, t) { for (const [t0, x, sd] of [[0.1, 1180, 4], [3.2, 300, 9]]) { const k = t - t0; if (k > 0 && k < 0.5) { const fl = k < 0.08 ? 1 : 1 - k / 0.5; lightning(P, x, -20, 650, sd, mixc('#000000', '#ffb0a0', fl), 2.4); P.wash([[-60, -60], [1660, -60], [1660, 700], [-60, 700]], mixc('#000000', '#4a1010', fl), 160, 0.01); } } } },
    hero: { draw(P) { hero(P, { who: 'duryo', x: 1060, y: 900, S: 780, f: -1, pose: 'mace', weapon: 'mace', maceAng: 30 }); } } } },

  h_krishna: { layers: {
    bg: { bg: '#0a1430', draw(P) { skyBands(P, ['#07102a', '#102a5a', '#1f4a7a'], 0, 700, 8, 160); stars(P, 120, '#e8e0c8', 520); P.wash(circlePts(380, 220, 90, 36), '#f2ecd0', 230, 0.02); hills(P, 640, 40, '#0a1a30', 190, 1); riverWaves(P, 660, 760, '#14385a', '#0a1a30'); ground(P, 760, '#0a1a20', 230);
      P.solid = true; P.line([[250, 770], [270, 420]], '#1a120c', 8, 'ink', 0.3); for (let i = 0; i < 9; i++) { const x = 150 + P.r(0, 260), y = 380 + P.r(0, 160); P.shape(circlePts(x, y, 60 + P.r(0, 40), 16), '#0f2a1a', 220, INK, 1); } for (let i = 0; i < 16; i++) P.dot(150 + P.r(0, 260), 360 + P.r(0, 200), 5, '#e9b52f'); } },
    hero: { draw(P) { colourHero(P, { who: 'krishna', x: 1060, y: 880, S: 760, f: -1, pose: 'flute', weapon: 'flute', wind: 0.6 }); } },
    flies: { mode: 'add', draw(P, t) { particles(P, t, 70, '#c8e070', { vy: -6, vx: 6, sz: 2.8, seed: 8 }); } } } },

  e_dice: { layers: {
    bg: { bg: '#4a1210', draw(P) { court(P, '#4a1210'); P.solid = true; const bx = 800, by = 760; P.shape([[bx - 420, by + 60], [bx + 420, by + 60], [bx + 300, by - 50], [bx - 300, by - 50]], '#7a1a14', 230, INK, 1.2); P.shape([[bx - 70, by + 60], [bx + 70, by + 60], [bx + 50, by - 50], [bx - 50, by - 50]], '#c79a52', 230, INK, 1); P.shape([[bx - 400, by + 20], [bx + 400, by + 20], [bx + 380, by - 10], [bx - 380, by - 10]], '#c79a52', 230, INK, 1); lampGlow(P, 240, 300, 60); lampGlow(P, 1360, 300, 60); } },
    players: { draw(P) { hero(P, { who: 'shakuni', x: 420, y: 880, S: 640, f: 1, pose: 'dice' }, 0.2); hero(P, { who: 'yudhi', x: 1180, y: 880, S: 640, f: -1, pose: 'dice', poseOver: { aF: [60, 40], lean: 16, head: 20 } }, 0.2); } },
    dice: { draw(P, t) {
      P.fast = true;
      for (const [t0, x0, dir, sd] of [[1.0, 560, 1, 1], [3.0, 1040, -1, 2], [6.0, 560, 1, 3]]) {
        const k = clamp01((t - t0) / 1.1); if (t < t0) continue; const ee = 1 - Math.pow(1 - k, 3);
        for (let d = 0; d < 2; d++) {
          const x = x0 + dir * (120 + d * 60) * ee + dir * 40, y = 740 - Math.abs(Math.sin(ee * Math.PI * 3)) * 60 * (1 - ee) + d * 14, ang = (1 - ee) * 720 * dir + d * 20, s = 26;
          const sq = [[-s, -s], [s, -s], [s, s], [-s, s]].map(p => rot2(p, ang)).map(p => [x + p[0], y + p[1] * 0.8]);
          P.shape(sq, '#efe6cf', 240, INK, 1.2, 0.004); const pips = (sd + d + Math.floor(ee * 5)) % 6 + 1; for (let q = 0; q < pips; q++) { const pp = rot2([(q % 3 - 1) * s * 0.5, (Math.floor(q / 3) - 0.5) * s * 0.6], ang); P.dot(x + pp[0], y + pp[1] * 0.8, 3.5, q === 0 && pips === 1 ? '#b3202a' : INK); }
        }
      }
    } } } },

  e_sari: { layers: {
    bg: { bg: '#3a1014', draw(P) { court(P, '#3a1014'); P.solid = true; P.shape([[600, 640], [1000, 640], [960, 560], [640, 560]], '#5a2a1a', 230, INK, 1.2); P.shape([[700, 560], [900, 560], [880, 300], [800, 240], [720, 300]], '#7a3a1a', 230, INK, 1.2); lampGlow(P, 240, 320, 50); lampGlow(P, 1360, 320, 50); } },
    people: { draw(P) {
      for (let i = 0; i < 3; i++) hero(P, { who: i === 0 ? 'bhishma' : i === 1 ? 'drona' : 'yudhi', x: 140 + i * 150, y: 880, S: 480, f: 1, pose: 'despair', noScarf: true }, 0.12);
      P.solid = true; P.silhouette(SIL, 0.25); woman(P, { x: 800, y: 870, S: 640, f: 1, sari: '#b3202a', wind: 0.4, arm: [168, 175], head: -14 });
      hero(P, { who: 'duryo', x: 1300, y: 880, S: 640, f: -1, pose: 'charge', poseOver: { lean: -18, aF: [80, 95], aB: [70, 90], lF: [-20, -10], lB: [30, 10] }, noScarf: true, style: { crown: 'band' } }, 0.12);
    } },
    sari: { draw(P, t) {
      P.fast = true; const k = clamp01(t / 9);
      // the endless sari pours from Draupadi to the pulling hands and piles into a rising spiral
      const a = [820, 560], b = [1180, 520]; const line = []; for (let i = 0; i <= 10; i++) { const q = i / 10; line.push([a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q + Math.sin(q * 6 + t * 5) * 18]); }
      P.shape(ribbon(line, 20, 26), '#c7362b', 230, INK, 1); P.line(line.map(p => [p[0], p[1] - 22]), GOLD, 2.4, 'gold', 0.5);
      const turns = 1 + k * 5; const sp = []; for (let i = 0; i <= 60; i++) { const q = i / 60, ang = q * turns * 360 + t * 40, rr = 60 + q * 160; sp.push([1250 + Math.cos(ang * D2R) * rr * 0.6, 700 - q * (120 + k * 520) + Math.sin(ang * D2R) * rr * 0.15]); }
      P.shape(ribbon(sp, 16, 24), '#b3202a', 220, INK, 0.9); P.line(sp, GOLD, 2, 'gold', 0.5);
    } },
    light: { mode: 'add', draw(P, t) { const k = clamp01((t - 4.6) / 2); if (k <= 0) return; P.wash([[700, -60], [900, -60], [960, 900], [640, 900]], mixc('#000000', '#6a5010', k), 160, 0.05); rays(P, 800, 300, 30, 60, 400 * k, mixc('#000000', '#8a6a18', k), t * 10, 2); particles(P, t, 60, mixc('#000000', '#ffd070', k), { vy: -20, vx: 2, sz: 2.4, seed: 7 }); } } } },

  e_exile: { layers: {
    bg: { draw(P) { skyBands(P, ['#d9c49a', '#b9935a', '#7a6a3a'], 0, 700, 7, 140); hills(P, 600, 60, '#5a5a3a', 170, 2); ground(P, 720, '#4a3a20', 210);
      P.solid = true; for (let i = 0; i < 14; i++) { const x = P.r(-40, 1640), h = P.r(380, 640), base = 760 + P.r(0, 60); P.shape([[x - 14, base], [x + 14, base], [x + 8, base - h], [x - 8, base - h]], '#2a1c12', 230, INK, 1); for (let q = 0; q < 5; q++) { const cx = x + P.r(-120, 120), cy = base - h + P.r(-60, 120); P.shape(circlePts(cx, cy, P.r(60, 120), 14, 1, 0.75), [ '#8a3a14', '#b5661c', '#6a4a1a', '#a3241e'][q % 4], 200, INK, 0.8); } } } },
    walkers: { draw(P) { const who = ['yudhi', 'bhima', 'arjuna', 'abhi', 'abhi']; who.forEach((w, i) => hero(P, { who: w, x: 520 + i * 120, y: 860, S: 300, f: 1, pose: 'stand', poseOver: { lF: [18, 6], lB: [-16, -4], lean: 4 }, noScarf: true, style: w === 'abhi' && i === 4 ? { crown: 'band' } : {} }, 0.1)); P.solid = true; P.silhouette(SIL, 0.15); woman(P, { x: 450, y: 860, S: 290, f: 1, wind: 0.3, sari: '#b3202a' }); } },
    leaves: { draw(P, t) { P.solid = false; const r = mulberry(11); for (let i = 0; i < 44; i++) { const x0 = r() * 1700, y0 = r() * 900, sp = 40 + r() * 50; const x = (x0 + t * 30 + Math.sin(t * 1.5 + i) * 40) % 1700, y = (y0 + t * sp) % 950 - 20, a = t * 120 * (r() - 0.5) + i * 40; const lf = [[-26, 0], [-8, -12], [26, 0], [-8, 12]].map(p => rot2(p, a)).map(p => [x + p[0], y + p[1]]); P.shape(lf, ['#b5661c', '#8a3a14', '#d2a23a'][i % 3], 240, INK, 0.8, 0.003); P.line([lf[0], lf[2]], '#4a2a10', 0.6, 'fine', 0); } } } } },

  e_refuse: { layers: {
    bg: { bg: '#2a0e12', draw(P) { court(P, '#2a0e12'); P.solid = true; P.shape([[1060, 820], [1460, 820], [1440, 760], [1080, 760]], '#5a2a1a', 230, INK, 1.2); P.shape([[1120, 760], [1400, 760], [1380, 360], [1260, 300], [1140, 360]], '#6a1a1a', 230, INK, 1.2); P.line(arcPts(1260, 420, 110, 180, 360, 20), GOLD, 2.4, 'gold', 0.5); } },
    court: { draw(P) { colourHero(P, { who: 'krishna', x: 480, y: 880, S: 700, f: 1, pose: 'bless', wind: 0.3, noScarf: false }); hero(P, { who: 'duryo', x: 1240, y: 800, S: 640, f: -1, pose: 'dice', poseOver: { aF: [70, 160], lean: -6, head: -6 } }, 0.16); } } } },

  e_armies: { layers: {
    bg: { draw(P) { fieldDawn(P, 800, 420); } },
    host: { draw(P) { army(P, 650, 900, -1, '#1a0f0a', '#b3202a', 1.2); army(P, 650, 900, 1, '#1a0f0a', '#2f4f8f', 1.2); P.solid = true; P.silhouette(SIL, 0.15); for (let i = 0; i < 4; i++) chariot(P, 160 + i * 380, 880 - (i % 2) * 40, 260, i < 2 ? 1 : -1, '#a8742a', 0, i < 2 ? '#b3202a' : '#2f4f8f', i === 1 ? 'monkey' : null); } },
    dust: { mode: 'add', draw(P, t) { particles(P, t, 160, '#b06a3a', { vy: -8, vx: 18, sz: 2.6, seed: 12 }); } } } },

  g_chariot: { layers: {
    bg: { draw(P) { fieldDawn(P, 1200, 470); army(P, 690, 760, -1, '#2a1a12', '#b3202a', 0.6); army(P, 690, 760, 1, '#2a1a12', '#2f4f8f', 0.6); } },
    car: { draw(P) { P.solid = true; P.silhouette(SIL, 0.16); const x = 640, y = 860;
      hero(P, { who: 'arjuna', x: x - 40, y: y - 150, S: 420, f: 1, pose: 'stand', weapon: 'bowRest', wind: 1 }, 0.16);
      P.solid = true; P.noSilhouette(); figure(P, { who: 'krishna', x: x + 110, y: y - 130, S: 330, f: 1, pose: 'charge', poseOver: { lean: 10, aF: [80, 90], aB: [70, 85], lF: [10, 0], lB: [-6, 0] }, wind: 1 });
      P.silhouette(SIL, 0.16); chariot(P, x, y, 300, 1, '#a8742a', 0, '#c7362b', 'monkey'); } },
    horses: { draw(P, t) { P.fast = true; P.silhouette(SIL, 0.3); const x = 640, y = 860; for (let i = 0; i < 2; i++) horse(P, x + 330 + i * 70, y + 10 - i * 18, 260, 1, t + i * 0.2, '#efe8da', 1); } },
    dust: { mode: 'add', draw(P, t) { particles(P, t, 120, '#a0603a', { vy: -10, vx: -30, sz: 2.6, seed: 13 }); } } } },

  g_despair: { layers: {
    bg: { draw(P) { skyBands(P, ['#cdb79a', '#a88870', '#6a5248'], 0, 760, 7, 140); hills(P, 690, 30, '#5a4640', 160, 3); ground(P, 720, '#4a3a32', 200); P.solid = true; P.silhouette('#3a2e2e', 0.1); figure(P, { who: 'bhishma', x: 1180, y: 700, S: 300, f: -1, pose: 'stand', weapon: 'bowRest' }); figure(P, { who: 'drona', x: 1360, y: 710, S: 300, f: -1, pose: 'stand', weapon: 'spear' }); P.noSilhouette(); } },
    hero: { draw(P) { hero(P, { who: 'arjuna', x: 600, y: 900, S: 760, f: 1, pose: 'despair', wind: 0.5 }); } },
    bow: { draw(P) { P.solid = true; P.silhouette(SIL, 0.2); const g = [560, 600]; const bowL = [[g[0] - 10, g[1] - 300], [g[0] + 20, g[1] - 160], [g[0] + 26, g[1]], [g[0] + 20, g[1] + 160], [g[0] - 10, g[1] + 300]]; P.shape(ribbon(bowL, 5, 5), '#6a3a1a', 230, INK, 1); P.line([bowL[0], bowL[4]], '#f1ead8', 0.8, 'fine', 0); } } } },

  g_krishna: { layers: {
    bg: { draw(P) { skyBands(P, ['#f6e0a8', '#9ab0d0', '#4a6a9a'], 0, 900, 8, 150); cloudBank(P, 400, '#f6ecd0', 80, 6, 60); } },
    halo: { mode: 'add', draw(P, t) { const hx = 900 - 0.0 * 820, hy = 880 - 0.83 * 820; rays(P, 900, 200, 36, 90, 420, '#5a4a20', t * 6, 1.6); P.line(arcPts(900, 200, 120 + Math.sin(t * 2) * 6, 0, 360, 48), '#7a6020', 2.4, 'ink', 0.5); P.line(arcPts(900, 200, 150, 0, 360, 48), '#4a3a14', 1.4, 'ink', 0.5); } },
    hero: { draw(P) { colourHero(P, { who: 'krishna', x: 900, y: 940, S: 860, f: -1, pose: 'bless', wind: 0.6 }); } } } },

  g_vishva1: { layers: {
    bg: { bg: '#06061a', draw(P) { P.wash([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], '#06061a', 250, 0.005, 0.6, 0.2); for (let i = 0; i < 7; i++) P.wash(circlePts(P.r(0, 1600), P.r(0, 900), P.r(150, 380), 24), ['#1a0f3a', '#2a0f2a', '#0f2a4a'][i % 3], 120, 0.05, 0.6, 0.3); stars(P, 260, '#f6efd8'); } },
    cosmos: { mode: 'add', draw(P, t) { galaxy(P, 260, 200, 160, '#5a6ab0', 3, t * 12); galaxy(P, 1340, 260, 200, '#a0608a', 4, -t * 10); galaxy(P, 1300, 760, 140, '#6a8ab0', 3, t * 15); rays(P, 800, 380, 60, 200, 900, '#3a2a0a', t * 4, 1.6); particles(P, t, 120, '#d0c8ff', { vy: 0, vx: 0, sz: 1.8, seed: 21 }); } },
    form: { draw(P) { P.solid = true; P.noSilhouette(); const x = 800, y = 720, S = 560, skin = '#3f6db0';
      P.wash(circlePts(x, y - 260, 330, 48), '#f6c94a', 200, 0.02); P.wash(circlePts(x, y - 260, 280, 48), '#fbe39a', 200, 0.02);
      cosmicArms(P, x, y, S, '#3a64a6', 16, ['chakra', 'conch', 'mace', 'lotus', 'bow', 'sword', 'fire', 'lotus'], 300);
      frontalBody(P, x, y, S, skin, '#e9b52f');
      for (const [dx, sc] of [[-260, 0.55], [260, 0.55], [-150, 0.68], [150, 0.68]]) frontalHead(P, x + dx, y - S * 0.62 + (1 - sc) * 60, 90 * sc, '#36609e');
      frontalHead(P, x, y - S * 0.66, 100, skin);
      galaxy(P, x, y - S * 0.25, 60, '#f6efd8', 3, 0); } },
    chakra: { mode: 'add', draw(P, t) { const x = 800, y = 720 - 560 * 0.66, R = 230 * ease(clamp01((t - 1.5) / 2.5)); if (t < 1.5) return; const a = t * 120; P.line(arcPts(x, y, R, 0, 360, 36), '#f6c94a', 2.6, 'ink', 0.5); for (let i = 0; i < 12; i++) { const q = (a + i * 30) * D2R; P.line([[x, y], [x + Math.cos(q) * R, y + Math.sin(q) * R]], '#d9a536', 1.6, 'ink', 0); P.line([[x + Math.cos(q) * R, y + Math.sin(q) * R], [x + Math.cos(q + 0.3) * R * 1.25, y + Math.sin(q + 0.3) * R * 1.25]], '#f08a24', 1.6, 'ink', 0); } P.wash(circlePts(x, y, R * 1.6, 24), '#5a3a08', 140, 0.04); } },
    arjuna: { draw(P) { hero(P, { who: 'arjuna', x: 800, y: 920, S: 260, f: 1, pose: 'bowLow', weapon: 'bowRest', poseOver: { lean: 30, head: 30, aF: [120, 160], aB: [110, 160] } }, 0.1); } } } },

  g_vishva2: { layers: {
    bg: { bg: '#120404', draw(P) { P.wash([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], '#120404', 250, 0.005, 0.6, 0.2); for (let i = 0; i < 6; i++) P.wash(circlePts(P.r(0, 1600), P.r(0, 900), P.r(200, 420), 24), ['#3a0a06', '#2a0a1a', '#4a1a06'][i % 3], 130, 0.05, 0.6, 0.3); stars(P, 120, '#ffd0a0'); } },
    streams: { mode: 'add', draw(P, t) { const r = mulberry(31); const mx = 800, my = 430; for (let i = 0; i < 130; i++) { const a = r() * 360 * D2R, d0 = 900 + r() * 300, sp = 0.15 + r() * 0.2; const q = ((t * sp + r()) % 1); const d = d0 * (1 - q); const x = mx + Math.cos(a) * d * 1.2, y = my + Math.sin(a) * d * 0.8; const tail = 40 + 60 * q; P.line([[x, y], [x - Math.cos(a) * tail, y - Math.sin(a) * tail]], mixc('#000000', '#ff9a4a', Math.min(1, q * 1.5)), 2.2 + q * 3, 'ink', 0); P.dot(x, y, 2.5, mixc('#000000', '#ffd080', q), 220); } P.wash(circlePts(mx, my, 90 + 10 * Math.sin(t * 3), 24), '#8a2a06', 180, 0.04); } },
    face: { draw(P) { P.solid = true; P.noSilhouette(); for (const [dx, dy, sc] of [[-520, 120, 0.7], [520, 120, 0.7], [-300, 30, 0.85], [300, 30, 0.85]]) frontalHead(P, 800 + dx, 380 + dy, 150 * sc, '#2e4e86', 1); frontalHead(P, 800, 300, 200, '#3a5c9a', 1); } } } },

  g_rise: { layers: {
    bg: { draw(P) { fieldDawn(P, 1180, 460); army(P, 690, 820, 1, '#2a1a12', '#b3202a', 0.7); } },
    hero: { draw(P) { hero(P, { who: 'arjuna', x: 600, y: 900, S: 760, f: 1, pose: 'bowLow', weapon: 'bowRest', wind: 0.6 }); } },
    hero2: { draw(P) { hero(P, { who: 'arjuna', x: 600, y: 900, S: 760, f: 1, pose: 'draw', weapon: 'bowDrawn', wind: 1.4, poseOver: { aF: [120, 118], aB: [-80, 110], aBl: [0.55, 1] } }); } },
    dust: { mode: 'add', draw(P, t) { particles(P, t, 120, '#c08a4a', { vy: -14, vx: 20, sz: 2.4, seed: 15 }); } } } },

  w_bhishma: { layers: {
    bg: { bg: '#a04a2a', draw(P) { skyBands(P, ['#f0a860', '#c2482a', '#5a1a14'], 0, 760, 8, 150); sunDisc(P, 1200, 600, 120, '#f06a2a'); hills(P, 700, 40, '#3a1410', 190, 2); ground(P, 720, '#2a0e0a', 220); } },
    bed: { draw(P) { P.solid = true; P.silhouette(SIL, 0.18); for (let i = 0; i < 70; i++) { const x = 420 + P.r(0, 760), y0 = 690 + P.r(-10, 10), a = P.r(-35, 35); P.line([[x, y0 + 130], [x + Math.sin(a * D2R) * 200, y0 - Math.cos(a * D2R) * 200]], '#1a1210', 1.6, 'ink', 0); const tp = [x + Math.sin(a * D2R) * 200, y0 - Math.cos(a * D2R) * 200]; P.shape([[tp[0] - 6, tp[1] + 10], [tp[0], tp[1] - 8], [tp[0] + 6, tp[1] + 10]], '#b3202a', 230, null); } lyingFigure(P, 'bhishma', 1180, 640, 700); for (let i = 0; i < 40; i++) { const x = 420 + P.r(0, 760), a = P.r(-25, 25); P.line([[x, 820], [x + Math.sin(a * D2R) * 170, 820 - Math.cos(a * D2R) * 170]], '#1a1210', 1.6, 'ink', 0); } } },
    embers: { mode: 'add', draw(P, t) { particles(P, t, 140, '#ff7a30', { vy: -40, vx: 6, sz: 2, seed: 17 }); } } } },

  w_abhi: { layers: {
    bg: { bg: '#6a3a22', draw(P) { P.wash([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], '#6a3a22', 230, 0.005, 0.6, 0.2); P.wash(circlePts(800, 470, 520, 48), '#8a5a32', 160, 0.04); P.wash(circlePts(800, 470, 220, 36), '#c0884a', 150, 0.03); } },
    ring: { draw(P, t) { brush.set('ink', '#1c1218', 1.2); const heads = [];
      for (let ring = 0; ring < 5; ring++) { const R = 260 + ring * 90, n = 22 + ring * 6, rr = (ring % 2 ? 1 : -1) * t * (8 - ring); for (let i = 0; i < n; i++) { const a = (rr + i * 360 / n) * D2R, x = 800 + Math.cos(a) * R * 1.25, y = 470 + Math.sin(a) * R * 0.62; const s = 0.7 + 0.3 * (Math.sin(a) + 1) / 2; brush.line(x, y, x - Math.cos(a) * 40 * s, y - 70 * s); P.mline([[x, y], [x - Math.cos(a) * 40 * s, y - 70 * s]], 3); heads.push([x, y, s]); } }
      brush.reDraw(); noStroke(); fill('#1c1218'); for (const [x, y, s] of heads) { ellipse(x, y - 8 * s, 22 * s, 24 * s); rect(x - 13 * s, y, 26 * s, 30 * s, 6 * s); P.mcirc(x, y + 4 * s, 18 * s); fill('#5a2a1a'); circle(x + 8 * s, y + 10 * s, 18 * s); fill('#1c1218'); } } },
    boy: { draw(P) { hero(P, { who: 'abhi', x: 800, y: 700, S: 440, f: 1, pose: 'maceUp', weapon: 'wheel', wind: 1.2 }, 0.22); } } } },

  w_karna: { layers: {
    bg: { draw(P) { skyBands(P, ['#e8b070', '#b05a2a', '#4a1a10'], 0, 760, 8, 150); sunDisc(P, 300, 560, 90, '#f0902a'); hills(P, 720, 40, '#3a1a10', 190, 4); P.wash([[-60, 760], [1660, 740], [1660, 960], [-60, 960]], '#2a1408', 230, 0.01, 0.7, 0.3); } },
    scene: { draw(P) { P.solid = true; P.silhouette(SIL, 0.14); chariot(P, 860, 900, 320, -1, '#a8742a', 0.3, '#a3241e', null); hero(P, { who: 'karna', x: 620, y: 880, S: 620, f: 1, pose: 'charge', poseOver: { lean: 30, aF: [40, 20], aB: [30, 10], lF: [70, 10], lB: [-30, -10] }, wind: 1 }, 0.2); P.wash([[400, 860], [1100, 860], [1100, 920], [400, 920]], '#1a0e08', 240, 0.01); } },
    streak: { mode: 'add', draw(P, t) { if (t < 3.9) return; const k = clamp01((t - 3.9) / 0.45); const sx = 1700, sy = 260, tx = 680, ty = 470; const px = sx + (tx - sx) * k, py = sy + (ty - sy) * k; P.line([[px + 300, py - 60], [px, py]], '#fff2b0', 3.4, 'ink', 0); P.line([[px + 500, py - 100], [px, py]], '#8a6a20', 7, 'dry', 0); if (t > 4.35) { const q = clamp01((t - 4.35) / 1.2); P.wash(circlePts(tx, ty, 40 + q * 400, 30), mixc('#fff0c0', '#000000', q), 200, 0.03); } } } } },

  w_mace: { layers: {
    bg: { bg: '#5a3a5a', draw(P) { skyBands(P, ['#c8a0b0', '#7a4a6a', '#2a1a3a'], 0, 640, 8, 150); sunDisc(P, 800, 560, 80, '#f08a5a', 170); P.wash([[-60, 600], [1660, 600], [1660, 760], [-60, 760]], '#3a3a5a', 220, 0.005); riverWaves(P, 610, 740, '#4a4a6a', '#2a2a3a'); ground(P, 760, '#1a1018', 230); for (let i = 0; i < 12; i++) P.line([[P.r(0, 1600), 760], [P.r(0, 1600), 700]], '#1a1018', 1.2, 'ink', 0.5); } },
    duel: { draw(P) { hero(P, { who: 'bhima', x: 600, y: 900, S: 700, f: 1, pose: 'maceUp', weapon: 'mace', maceAng: -10, wind: 1.2 }); hero(P, { who: 'duryo', x: 1040, y: 900, S: 680, f: -1, pose: 'mace', weapon: 'mace', maceAng: 25, poseOver: { lean: -8 } }); } },
    duel2: { draw(P) { hero(P, { who: 'bhima', x: 680, y: 900, S: 700, f: 1, pose: 'charge', weapon: 'mace', maceAng: 110, poseOver: { aF: [120, 130] }, wind: 1.6 }); hero(P, { who: 'duryo', x: 1180, y: 880, S: 640, f: -1, pose: 'despair', rot: 72, noScarf: true }); } },
    clash: { mode: 'add', draw(P, t) { if (t < 3.4) return; const q = clamp01((t - 3.45) / 1.0); P.wash(circlePts(930, 600, 30 + q * 520, 32), mixc('#ffe8c0', '#000000', Math.min(1, q * 1.4)), 220, 0.03); rays(P, 930, 600, 26, 20 + q * 40, 120 + q * 500, mixc('#ffd090', '#000000', q), 0, 2.4); } } } },

  f_dawn: { layers: {
    bg: { draw(P) { skyBands(P, ['#f6ecd0', '#f0c890', '#c88a6a'], 0, 760, 8, 140); sunDisc(P, 800, 600, 130, '#f0a050', 180); hills(P, 690, 40, '#8a6a5a', 160, 2); ground(P, 710, '#6a4a3a', 200); } },
    field: { draw(P) { P.solid = true; P.silhouette('#2a1e20', 0.12);
      for (let i = 0; i < 6; i++) { const x = 140 + i * 270 + P.r(-40, 40), y = 830 + P.r(-20, 30), R = 55 + P.r(0, 30), tilt = P.r(0.35, 0.6), rot = P.r(-20, 20);
        const ring = (r) => circlePts(x, y, r, 28, 1, tilt).map(p => [x + (p[0] - x) * Math.cos(rot * D2R) - (p[1] - y) * Math.sin(rot * D2R), y + (p[0] - x) * Math.sin(rot * D2R) + (p[1] - y) * Math.cos(rot * D2R)]);
        const o = ring(R), inr = ring(R * 0.8); P.line(o.concat([o[0]]), '#2a1e20', 3, 'ink', 0.2); P.line(inr.concat([inr[0]]), '#2a1e20', 1.6, 'ink', 0.2);
        for (let q = 0; q < 10; q++) if (q % 4 !== 1) P.line([[x, y], inr[q * 2 % 28]], '#2a1e20', 1.4, 'ink', 0); P.dot(x, y, 6, '#2a1e20'); }
      for (let i = 0; i < 30; i++) { const x = P.r(0, 1600), a = P.r(-30, 30); P.line([[x, 860], [x + Math.sin(a * D2R) * 160, 860 - Math.cos(a * D2R) * 160]], '#2a1e20', 1.4, 'ink', 0); }
      for (let i = 0; i < 3; i++) { const x = 200 + i * 560; P.line([[x, 860], [x + 10, 520]], '#2a1e20', 2.4, 'ink', 0); P.shape(ribbon([[x + 10, 524], [x + 60, 540], [x + 90, 570], [x + 100, 610]], 18, 6), '#6a1a14', 220, INK, 1); } } },
    pair: { draw(P) { hero(P, { who: 'arjuna', x: 760, y: 800, S: 380, f: 1, pose: 'stand', weapon: 'bowRest', wind: 0.6 }, 0.12); P.solid = true; P.noSilhouette(); figure(P, { who: 'krishna', x: 880, y: 800, S: 380, f: -1, pose: 'flute', weapon: 'flute', wind: 0.6 }); } },
    motes: { mode: 'add', draw(P, t) { particles(P, t, 100, '#8a6a3a', { vy: -8, vx: 4, sz: 2.2, seed: 19 }); } } } },

  f_end: { layers: {
    bg: { bg: '#0f1230', draw(P) { P.wash([[-60, -60], [1660, -60], [1660, 960], [-60, 960]], '#0f1230', 240, 0.005, 0.6, 0.2); mandala(P, 800, 450, 430, '#9a7424', 6); P.wash(circlePts(800, 450, 300, 48), '#141838', 200, 0.03); } },
    rays: { mode: 'add', draw(P, t) { rays(P, 800, 450, 40, 300, 800, '#3a2a08', t * 3, 1.6); } } } },
};
