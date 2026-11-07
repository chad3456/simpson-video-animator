// Ramayana pop-up book renderer.
// Look: a flat, open book lies in a pastel room drawn in faint line art; each page turn pops up a cut-paper diorama
// of flat-coloured figures, trees and palaces; a bright diagonal colour band sweeps in the next page's palette;
// short story beats appear as white label tags. Toon.renderAt(t) draws one frame at time t (seconds).
const Popup = (() => {
  const W = 1280, H = 720;
  let c, EP, TL;

  // ---------------------------------------------------------------- utilities
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => (t = clamp(t), t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const eOut = t => 1 - Math.pow(1 - clamp(t), 3);
  const eIn = t => Math.pow(clamp(t), 2);
  const back = t => { t = clamp(t); const c1 = 2.2, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixc = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); };
  const dark = (a, t) => mixc(a, '#000000', t);
  const light = (a, t) => mixc(a, '#ffffff', t);

  // ---------------------------------------------------------------- palettes (one per page)
  const PAL = {
    cover:     { bg: '#dfe6c9', band: '#b4ef2e', L: '#f4b51c', R: '#f4b51c' },
    ayodhya:   { bg: '#dfe6c9', band: '#b4ef2e', L: '#a6e63a', R: '#f4b51c' },
    bow:       { bg: '#cfe5f1', band: '#16a5ea', L: '#1e9fe0', R: '#f0e43c' },
    exile:     { bg: '#cbcaee', band: '#7b7aea', L: '#6f6fe2', R: '#f08c2c' },
    deer:      { bg: '#d6eacb', band: '#1fae5f', L: '#2fb35e', R: '#f2e03a' },
    abduction: { bg: '#ecd5e8', band: '#ec37a9', L: '#e43aa6', R: '#b56ae0' },
    hanuman:   { bg: '#eadfcf', band: '#a88763', L: '#f0d23c', R: '#3cb46a' },
    leap:      { bg: '#cde9f3', band: '#22c6e8', L: '#2f8fe6', R: '#36d0d8' },
    bridge:    { bg: '#cfeee0', band: '#2ad69a', L: '#21a07a', R: '#f2c23a' },
    battle:    { bg: '#f2d4cc', band: '#f0583a', L: '#e8483a', R: '#6a6ae0' },
    return:    { bg: '#f6e2c4', band: '#f5a21c', L: '#f08a2c', R: '#e43aa6' },
    end:       { bg: '#f7d9d8', band: '#ec2f4b', L: '#3cc6ec', R: '#ea3a98' },
  };

  // ---------------------------------------------------------------- book projection
  const BK = { cx: 640, yf: 652, yb: 486, hwf: 468, hwb: 382 };
  const hw = v => lerp(BK.hwf, BK.hwb, v);
  const P = (u, v) => [BK.cx + u * hw(v), lerp(BK.yf, BK.yb, v)];
  const S = v => hw(v) / BK.hwf;

  // ---------------------------------------------------------------- drawing helpers
  const fill = (col) => { c.fillStyle = col; c.fill(); };
  function poly(pts, col) { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); if (col) fill(col); }
  function circ(x, y, r, col) { c.beginPath(); c.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2); if (col) fill(col); }
  function ell(x, y, rx, ry, col, rot = 0) { c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, Math.PI * 2); if (col) fill(col); }
  function rr(x, y, w, h, r, col) { c.beginPath(); c.roundRect(x, y, w, h, r); if (col) fill(col); }
  function line(pts, col, w, cap = 'round') { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.strokeStyle = col; c.lineWidth = w; c.lineCap = cap; c.lineJoin = 'round'; c.stroke(); }
  function onion(x, y0, r, col) {
    c.beginPath(); c.moveTo(x - r, y0);
    c.bezierCurveTo(x - r * 1.35, y0 - r * 0.9, x - r * 0.15, y0 - r * 1.3, x, y0 - r * 2.1);
    c.bezierCurveTo(x + r * 0.15, y0 - r * 1.3, x + r * 1.35, y0 - r * 0.9, x + r, y0);
    c.closePath(); fill(col);
  }
  function flame(x, y, s, t, seed = 0) {
    const f = 1 + 0.18 * Math.sin(t * 17 + seed * 3) + 0.1 * Math.sin(t * 29 + seed);
    const sw = Math.sin(t * 11 + seed) * 0.25;
    c.save(); c.translate(x, y); c.scale(s, s * f);
    c.beginPath(); c.moveTo(-10, 0); c.bezierCurveTo(-12, -14, -2 + sw * 8, -18, sw * 10, -34); c.bezierCurveTo(4 + sw * 8, -20, 12, -14, 10, 0); c.closePath(); fill('#f2632a');
    c.beginPath(); c.moveTo(-5, 0); c.bezierCurveTo(-6, -8, 0, -12, sw * 6, -22); c.bezierCurveTo(3, -12, 6, -8, 5, 0); c.closePath(); fill('#ffd23a');
    c.restore();
  }
  function txt(s, x, y, size, col, font = 'Nunito', weight = 800, align = 'center') {
    c.font = `${weight} ${size}px ${font}`; c.fillStyle = col; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y);
  }

  // ---------------------------------------------------------------- characters (drawn in a 100-unit box, feet at 0)
  const FIG = 1.3;
  const SK = { rama: '#3d6fd6', fair: '#f1b78e', tan: '#d99566', monkey: '#e07a2a', vanara: '#9a6234', ravana: '#4a3b72', kid: '#f1b78e' };
  function person(o) {
    const k = (o.h || 80) / 100 * (o.raw ? 1 : FIG), f = o.face || 1, t = o.t || 0;
    c.save(); c.scale(k * f, k);
    const walk = o.walk ? Math.sin(t * 9) : 0, bob = o.walk ? Math.abs(Math.cos(t * 9)) * 2 : 0;
    c.translate(0, -bob);
    if (o.tail) { line([[-10, -40], [-30, -38], [-42, -62], [-30, -84], [-22, -80]], o.skin, 5); }
    // legs
    for (const i of [-1, 1]) {
      c.save(); c.translate(i * 5, -42); c.rotate(i * walk * 0.38 + (o.kneel && i > 0 ? -1.2 : 0));
      rr(-3.5, 0, 7, 42, 3, o.skin); ell(2, 41, 6, 3, dark(o.skin, .3)); c.restore();
    }
    const sad = o.pose === 'sad' ? 1 : 0;
    // lower garment
    if (o.sari) poly([[-13, -54], [13, -54], [19, -3], [-19, -3]], o.bottom);
    else if (o.robe) poly([[-14, -54], [14, -54], [17, -6], [-17, -6]], o.bottom);
    else poly([[-13, -54], [13, -54], [17, -24], [-17, -24]], o.bottom);
    // torso
    rr(-12, -77, 24, 29, 8, o.top || o.skin);
    if (o.sash) poly([[-12, -75], [-5, -77], [12, -54], [5, -51]], o.sash);
    if (o.sari) poly([[-12, -76], [2, -77], [12, -52], [-12, -50]], o.bottom);
    line([[-9, -74], [0, -66], [9, -74]], '#f5c542', 2.4);
    // arms
    const sh = [[-11, -72], [11, -72]];
    let hands = [[-15, -46], [15, -46]];
    const p = o.pose || 'stand';
    if (p === 'raise') hands = [[-21, -104 + Math.sin(t * 8) * 3], [21, -104 - Math.sin(t * 8) * 3]];
    else if (p === 'point') hands = [[-15, -46], [38, -80]];
    else if (p === 'namaste') hands = [[3, -66], [5, -66]];
    else if (p === 'bow') hands = [[2 - (o.draw || 0) * 4, -72], [36, -72]];
    else if (p === 'carry') hands = [[-8, -104], [8, -104]];
    else if (p === 'wave') hands = [[-15, -46], [24, -100 + Math.sin(t * 10) * 6]];
    else if (p === 'mace') hands = [[-15, -46], [16, -60]];
    else if (p === 'sword') hands = [[-15, -46], [30, -86 + Math.sin(t * 7) * 8]];
    else if (p === 'garland') hands = [[18, -62], [22, -62]];
    line([sh[0], hands[0]], o.skin, 7); line([sh[1], hands[1]], o.skin, 7);
    if (p === 'garland') { c.beginPath(); c.ellipse(20, -52, 9, 12, 0, 0, Math.PI * 2); c.strokeStyle = '#ff7a3a'; c.lineWidth = 3; c.setLineDash([2, 2]); c.stroke(); c.setLineDash([]); }
    if (p === 'bow') {
      const d = o.draw || 0;
      c.beginPath(); c.arc(8, -72, 30, -1.12, 1.12); c.strokeStyle = '#7a3d18'; c.lineWidth = 4; c.stroke();
      line([[8 + 30 * Math.cos(-1.12), -72 + 30 * Math.sin(-1.12)], [2 - d * 4, -72], [8 + 30 * Math.cos(1.12), -72 + 30 * Math.sin(1.12)]], '#5b3a22', 1.2);
      if (o.arrow) line([[2 - d * 4, -72], [48, -72]], o.arrow, 2.4);
    }
    if (p === 'mace') { line([[16, -60], [24, -102]], '#c9902a', 4); circ(25, -106, 9, '#f2c23a'); circ(22, -109, 3, '#fff1a8'); }
    if (p === 'sword') { line([hands[1], [hands[1][0] + 18, hands[1][1] - 28]], '#c9d4e0', 4, 'butt'); }
    if (p === 'carry') { ell(0, -112, 16, 11, o.rock || '#9aa3ad'); }
    // head
    const hx = 2 + sad * 3, hy = -88 + sad * 5;
    if (o.longhair) rr(-12, hy - 6, 13, 34, 6, o.hair);
    circ(hx, hy, 12, o.skin);
    if (o.muzzle) ell(hx + 7, hy + 3, 7, 6, o.muzzle);
    if (o.hair && !o.crown) { c.beginPath(); c.arc(hx, hy, 12.5, Math.PI * 0.95, Math.PI * 2.05); fill(o.hair); }
    if (o.hair && o.crown) { c.beginPath(); c.arc(hx, hy, 12.5, Math.PI * 0.75, Math.PI * 1.25); fill(o.hair); }
    if (o.beard) poly([[hx - 4, hy + 4], [hx + 12, hy + 4], [hx + 6, hy + 20], [hx - 2, hy + 14]], o.beard);
    circ(hx + 7, hy - 1, 1.7, '#1d1d2b');
    if (o.crown) { poly([[hx - 9, hy - 9], [hx + 9, hy - 9], [hx + 6, hy - 22], [hx, hy - 32], [hx - 6, hy - 22]], '#f2c23a'); circ(hx, hy - 15, 2.4, '#e8344a'); }
    if (o.bun) circ(hx - 6, hy - 12, 6, o.hair);
    c.restore();
  }
  const CAST = {
    rama:      (x = {}) => ({ skin: SK.rama, bottom: '#f6c21a', sash: '#f08c2c', hair: '#1f1a2e', crown: 1, ...x }),
    ramaF:     (x = {}) => ({ skin: SK.rama, bottom: '#c98a3a', sash: '#8a5a2a', hair: '#1f1a2e', bun: 1, ...x }),
    sita:      (x = {}) => ({ skin: SK.fair, bottom: '#e8344a', top: '#f6c21a', hair: '#1f1a2e', longhair: 1, sari: 1, ...x }),
    sitaF:     (x = {}) => ({ skin: SK.fair, bottom: '#d98a3a', top: '#c97a2a', hair: '#1f1a2e', longhair: 1, sari: 1, ...x }),
    lakshmana: (x = {}) => ({ skin: SK.fair, bottom: '#2fae5a', sash: '#f6c21a', hair: '#1f1a2e', crown: 1, ...x }),
    lakshF:    (x = {}) => ({ skin: SK.fair, bottom: '#b07a3a', sash: '#7a5a2a', hair: '#1f1a2e', bun: 1, ...x }),
    dasharatha:(x = {}) => ({ skin: SK.fair, bottom: '#c8344a', top: '#e8504a', beard: '#f4f4f4', hair: '#f4f4f4', crown: 1, robe: 1, ...x }),
    janaka:    (x = {}) => ({ skin: SK.tan, bottom: '#7b5ae0', top: '#9a7af0', beard: '#3a2a2a', hair: '#2a1a1a', crown: 1, robe: 1, ...x }),
    kaikeyi:   (x = {}) => ({ skin: SK.fair, bottom: '#7a3ad0', top: '#f2c23a', hair: '#1f1a2e', longhair: 1, sari: 1, crown: 1, ...x }),
    bharata:   (x = {}) => ({ skin: SK.tan, bottom: '#e8b41a', sash: '#2fae5a', hair: '#1f1a2e', crown: 1, ...x }),
    hanuman:   (x = {}) => ({ skin: SK.monkey, muzzle: '#f6d2a8', bottom: '#e8344a', sash: '#f6c21a', crown: 1, hair: SK.monkey, tail: 1, ...x }),
    sugriva:   (x = {}) => ({ skin: '#c08a3a', muzzle: '#f2d8b0', bottom: '#2f8fe6', sash: '#f2c23a', crown: 1, hair: '#c08a3a', tail: 1, ...x }),
    vanara:    (x = {}) => ({ skin: SK.vanara, muzzle: '#e8c49a', bottom: x.bottom || '#2fae5a', hair: SK.vanara, tail: 1, ...x }),
    rakshasa:  (x = {}) => ({ skin: '#5a4a8a', bottom: '#2a2a3a', sash: '#e8344a', hair: '#1a1a2a', ...x }),
    citizen:   (x = {}) => ({ skin: SK.tan, bottom: x.bottom || '#3cb46a', top: x.top, hair: '#1f1a2e', ...x }),
  };
  function ravana(o) {
    const k = (o.h || 130) / 100 * 1.15, t = o.t || 0;
    c.save(); c.scale(k * (o.face || 1), k);
    person({ skin: SK.ravana, bottom: '#1e1a2e', top: '#b8203a', sash: '#f2c23a', pose: o.pose || 'sword', t, h: 100, robe: 1, raw: 1 });
    c.restore();
    c.save(); c.scale(k * (o.face || 1), k);
    for (let i = 0; i < 10; i++) {
      const x = -58 + i * 13 + 2, y = -90 - Math.cos((i - 4.5) / 5) * 8 + Math.sin(t * 3 + i) * 1.2;
      circ(x, y, 9, SK.ravana); poly([[x - 7, y - 7], [x + 7, y - 7], [x + 4, y - 17], [x, y - 22], [x - 4, y - 17]], '#f2c23a');
      circ(x + 4, y - 1, 1.4, '#ffd23a'); line([[x - 1, y + 4], [x + 7, y + 4]], '#120d1e', 1.6);
    }
    c.restore();
  }
  function deer(o) {
    const k = (o.h || 60) / 100, t = o.t || 0, run = o.run ? 1 : 0, col = o.col || '#f2b51c';
    c.save(); c.scale(k * (o.face || 1), k);
    c.translate(0, -Math.abs(Math.sin(t * 7)) * 8 * run);
    [[-24, 0], [-14, 1.5], [18, 3], [27, 4.5]].forEach(([x, ph]) => {
      c.save(); c.translate(x, -42); c.rotate(Math.sin(t * 14 + ph) * 0.55 * run); rr(-2.5, 0, 5, 42, 2, dark(col, .15)); c.restore();
    });
    ell(0, -50, 34, 15, col);
    poly([[18, -58], [28, -60], [42, -88], [34, -92]], col);
    ell(42, -92, 11, 6.5, col, -0.3); poly([[34, -96], [30, -108], [38, -98]], col);
    line([[38, -98], [36, -118], [30, -126]], '#7a4a1a', 2.5); line([[36, -112], [44, -122]], '#7a4a1a', 2.5);
    line([[42, -98], [44, -116], [52, -124]], '#7a4a1a', 2.5);
    circ(46, -94, 1.6, '#1d1d2b'); poly([[-32, -56], [-42, -64], [-34, -50]], col);
    for (const [x, y] of [[-16, -54], [-4, -46], [8, -55], [14, -45], [-24, -46], [2, -58]]) circ(x, y, 3, o.spot || '#fff6c8');
    c.restore();
  }
  function bird(o) { // Jatayu: a big vulture
    const k = (o.h || 80) / 100, t = o.t || 0, flap = o.down ? 0.2 : Math.sin(t * 9);
    c.save(); c.scale(k * (o.face || 1), k); if (o.down) c.rotate(0.3);
    poly([[-10, -40], [-60, -40 - 40 * flap], [-70, -30 - 34 * flap], [-20, -30]], '#7a4a2a');
    ell(0, -36, 30, 13, '#8a5a32');
    poly([[-26, -40], [-48, -46], [-46, -30]], '#5a3a22');
    poly([[10, -42], [50, -42 - 40 * flap], [60, -32 - 34 * flap], [16, -30]], '#9a6a3a');
    circ(30, -48, 9, '#f4f0e8'); poly([[37, -50], [48, -46], [38, -43]], '#f2c23a'); circ(32, -50, 1.5, '#1d1d2b');
    c.restore();
  }
  function butterfly(x, y, s, t, col) {
    const f = Math.abs(Math.sin(t * 14)) * 0.8 + 0.2;
    c.save(); c.translate(x, y); c.scale(s, s);
    ell(-6 * f, -3, 7 * f, 5, col, -0.4); ell(6 * f, -3, 7 * f, 5, col, 0.4);
    ell(-4 * f, 4, 4 * f, 3, light(col, .3)); ell(4 * f, 4, 4 * f, 3, light(col, .3));
    line([[0, -6], [0, 6]], '#2a2a3a', 1.5); c.restore();
  }
  function smallBird(x, y, s, t, col = '#2a2a3a') {
    const f = Math.sin(t * 10) * 6;
    line([[x - 9 * s, y - f * s], [x, y], [x + 9 * s, y - f * s]], col, 2.2 * s);
  }

  // ---------------------------------------------------------------- scenery
  function tree(o) {
    const h = o.h || 160, r = rng(o.seed || 1), leaf = o.leaf || '#1f7a46', trunk = o.trunk || '#e35aa0';
    line([[0, 0], [2, -h * .35], [-2, -h * .6]], trunk, h * 0.06);
    line([[1, -h * .38], [h * .18, -h * .62]], trunk, h * 0.035); line([[0, -h * .45], [-h * .2, -h * .66]], trunk, h * 0.035);
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2 + r(); const R = h * (0.12 + r() * 0.1);
      circ(Math.cos(a) * h * 0.2, -h * 0.72 + Math.sin(a) * h * 0.12, R, i % 2 ? leaf : light(leaf, .08));
    }
    circ(0, -h * 0.78, h * 0.22, leaf);
  }
  function pine(o) { // flat bonsai pine with tiered cloud pads
    const h = o.h || 140, trunk = o.trunk || '#e35aa0', leaf = o.leaf || '#18664a', sw = Math.sin((o.t || 0) * 1.5) * 2;
    line([[0, 0], [-h * .12, -h * .3], [h * .1, -h * .55], [sw, -h * .82]], trunk, h * 0.07);
    line([[-h * .08, -h * .35], [-h * .4, -h * .42]], trunk, h * 0.04); line([[h * .06, -h * .55], [h * .38, -h * .62]], trunk, h * 0.04);
    ell(-h * .42, -h * .47, h * .2, h * .07, leaf); ell(h * .38, -h * .67, h * .22, h * .07, leaf); ell(sw, -h * .88, h * .26, h * .09, leaf);
    ell(-h * .44, -h * .5, h * .12, h * .04, light(leaf, .25)); ell(h * .36, -h * .7, h * .12, h * .04, light(leaf, .25));
  }
  function palm(o) {
    const h = o.h || 140, t = o.t || 0, leaf = o.leaf || '#2fae5a';
    line([[0, 0], [h * .05, -h * .5], [-h * .02, -h * .9]], o.trunk || '#b7793a', h * 0.05);
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + (i - 2.5) * 0.55 + Math.sin(t * 2 + i) * 0.05;
      const ex = Math.cos(a) * h * .4, ey = -h * .9 + Math.sin(a) * h * .25 + h * .12;
      c.beginPath(); c.moveTo(-h * .02, -h * .9); c.quadraticCurveTo(ex * .6, -h * .9 + Math.sin(a) * h * .35, ex, ey);
      c.quadraticCurveTo(ex * .5, -h * .9 + Math.sin(a) * h * .2, -h * .02, -h * .88); fill(i % 2 ? leaf : dark(leaf, .15));
    }
  }
  function bush(o) { const w = o.w || 60, col = o.col || '#2f9a5a'; for (let i = 0; i < 4; i++) circ((i - 1.5) * w * .25, -w * (.18 + (i % 2) * .08), w * .26, i % 2 ? col : light(col, .1)); if (o.flowers) for (let i = 0; i < 5; i++) circ((i - 2) * w * .18, -w * (.3 + (i % 3) * .08), w * .06, o.flowers); }
  function rock(o) { const w = o.w || 60; c.beginPath(); c.moveTo(-w / 2, 0); c.lineTo(-w * .38, -w * .4); c.lineTo(-w * .05, -w * .6); c.lineTo(w * .3, -w * .45); c.lineTo(w / 2, 0); c.closePath(); fill(o.col || '#9a8f86'); poly([[-w * .05, -w * .6], [w * .3, -w * .45], [w * .1, -w * .2]], light(o.col || '#9a8f86', .2)); }
  function palace(o) {
    const w = o.w || 260, h = o.h || 220, wall = o.wall || '#f7efe0', dome = o.dome || '#f2c23a', win = o.win || '#3d8fe0';
    rr(-w / 2, -h * .58, w, h * .58, 2, wall);
    rr(-w / 2 - 8, -h * .6, w + 16, 10, 2, dark(wall, .1));
    for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) {
      const x = -w / 2 + w * (i + .5) / 6 - 7, y = -h * .5 + r * h * .2;
      rr(x, y, 14, 22, [7, 7, 0, 0], win);
    }
    rr(-18, -48, 36, 48, [18, 18, 0, 0], dark(o.door || '#e8344a', 0));
    rr(-w * .17, -h * .72, w * .34, h * .13, 2, light(wall, 0));
    onion(0, -h * .72, w * .16, dome);
    line([[0, -h * .72 - w * .33], [0, -h * .72 - w * .45]], '#7a4a1a', 2.5);
    poly([[0, -h * .72 - w * .45], [22, -h * .72 - w * .41], [0, -h * .72 - w * .37]], o.flag || '#f2632a');
    for (const s of [-1, 1]) {
      rr(s * w * .42 - 14, -h * .72, 28, h * .13, 2, wall);
      onion(s * w * .42, -h * .72, 16, dome);
    }
  }
  function tower(o) {
    const w = o.w || 50, h = o.h || 180, col = o.col || '#f2c23a', burn = o.burn || 0, t = o.t || 0;
    rr(-w / 2, -h * .7, w, h * .7, 1, col);
    poly([[-w / 2, -h * .7], [w / 2, -h * .7], [w * .2, -h * .95], [0, -h], [-w * .2, -h * .95]], dark(col, .12));
    for (let i = 0; i < 4; i++) rr(-w * .3, -h * .62 + i * h * .15, w * .6, h * .07, 2, o.win || '#b8203a');
    if (burn > 0) { flame(0, -h * .92, burn * w * .06, t, w); flame(-w * .3, -h * .55, burn * w * .045, t, w + 3); flame(w * .3, -h * .35, burn * w * .04, t, w + 7); }
  }
  function hut(o) {
    const w = o.w || 110;
    rr(-w * .4, -w * .5, w * .8, w * .5, 2, '#d9a066');
    rr(-w * .12, -w * .34, w * .24, w * .34, [w * .12, w * .12, 0, 0], '#6a3a1a');
    poly([[-w * .55, -w * .45], [0, -w * .95], [w * .55, -w * .45]], '#f2c23a');
    for (let i = -2; i <= 2; i++) line([[i * w * .08, -w * .9], [i * w * .2, -w * .47]], '#d29a1a', 1.5);
  }
  function throne(o) {
    const w = o.w || 90;
    rr(-w * .45, -w * 1.1, w * .9, w * .8, [w * .45, w * .45, 4, 4], '#f2c23a');
    rr(-w * .32, -w * .98, w * .64, w * .6, [w * .32, w * .32, 4, 4], '#e8344a');
    rr(-w * .5, -w * .38, w, w * .14, 3, '#d9a21a');
    rr(-w * .42, -w * .26, w * .1, w * .26, 2, '#d9a21a'); rr(w * .32, -w * .26, w * .1, w * .26, 2, '#d9a21a');
    if (o.sandals) { rr(-w * .2, -w * .45, w * .16, w * .08, 4, '#7a4a1a'); rr(w * .04, -w * .45, w * .16, w * .08, 4, '#7a4a1a'); if (o.glow) circ(0, -w * .5, w * .25 * o.glow, 'rgba(255,240,160,.35)'); }
  }
  function chariot(o) { // Pushpaka, the flying chariot
    const w = o.w || 170, t = o.t || 0;
    for (let i = 0; i < 5; i++) circ(-w * .4 + i * w * .2, w * .05 + Math.sin(t * 3 + i) * 3, w * .12, i % 2 ? '#ffffff' : '#f4f6ff');
    (o.riders || []).forEach((r, i) => { c.save(); c.translate(-w * .2 + i * w * .17, -w * .08); r(); c.restore(); });
    poly([[-w * .5, -w * .2], [w * .42, -w * .2], [w * .36, w * .02], [-w * .4, w * .02]], '#f2c23a');
    line([[w * .42, -w * .2], [w * .56, -w * .36], [w * .5, -w * .44]], '#f2c23a', 7);
    circ(w * .5, -w * .45, 6, '#2f8fe6');
    for (let i = 0; i < 4; i++) circ(-w * .36 + i * w * .22, -w * .09, 5, '#e8344a');
    rr(-w * .48, -w * .56, 5, w * .36, 1, '#d9a21a'); rr(-w * .22, -w * .56, 5, w * .36, 1, '#d9a21a');
    rr(-w * .52, -w * .6, w * .36, 8, 3, '#e8344a'); onion(-w * .34, -w * .6, 15, '#e8344a');
  }
  function diya(o) {
    const s = o.s || 1, t = o.t || 0;
    c.save(); c.scale(s, s);
    if (o.lit !== 0) circ(0, -16, 12 * (o.lit || 1), 'rgba(255,214,90,.28)');
    c.beginPath(); c.moveTo(-12, -8); c.quadraticCurveTo(0, 6, 12, -8); c.closePath(); fill('#c8682a');
    ell(0, -8, 12, 3, '#e58a3a');
    if (o.lit !== 0) flame(0, -9, 0.32 * (o.lit || 1), t, o.seed || 0);
    c.restore();
  }
  function scroll(o) {
    const w = o.w || 110, h = o.h || 260;
    line([[-w * .3, -h - 20], [0, -h - 40], [w * .3, -h - 20]], '#c8344a', 2.5); circ(0, -h - 40, 5, '#f2632a');
    rr(-w / 2, -h, w, h * .95, 2, '#f7efd8');
    rr(-w / 2 - 8, -h - 8, w + 16, 12, 6, '#8a4a22'); rr(-w / 2 - 8, -h * .07, w + 16, 12, 6, '#8a4a22');
    (o.text || []).forEach((s, i) => txt(s, 0, -h * .78 + i * h * .3, w * .5, '#1d1d2b', 'Rozha', 400));
  }
  function arch(o) {
    const w = o.w || 160, h = o.h || 240, col = o.col || '#f2c23a';
    rr(-w / 2, -h, w, h, [w / 2, w / 2, 0, 0], col);
    rr(-w * .38, -h * .9, w * .76, h * .9, [w * .38, w * .38, 0, 0], o.inner || light(col, .55));
    if (o.panes) { line([[0, -h * .9], [0, 0]], col, 3); line([[-w * .38, -h * .5], [w * .38, -h * .5]], col, 3); }
  }
  function sheet(o) { c.save(); c.rotate(o.rot || 0); rr(-o.w / 2, -o.h, o.w, o.h, 3, o.col); if (o.lines) for (let i = 0; i < 6; i++) rr(-o.w * .35, -o.h * .85 + i * o.h * .12, o.w * (i % 2 ? .5 : .7), 4, 2, dark(o.col, .12)); c.restore(); }
  function cloud(o) { const w = o.w || 120, col = o.col || '#ffffff'; circ(-w * .25, -w * .12, w * .18, col); circ(0, -w * .2, w * .25, col); circ(w * .27, -w * .1, w * .17, col); rr(-w * .42, -w * .15, w * .84, w * .15, w * .07, col); }
  function hill(o) { const w = o.w || 300, h = o.h || 120; c.beginPath(); c.moveTo(-w / 2, 0); c.bezierCurveTo(-w * .35, -h * 1.1, w * .25, -h * 1.2, w / 2, 0); c.closePath(); fill(o.col || '#8a6a4a'); }
  function waves(o) {
    const w = o.w || 240, t = o.t || 0, col = o.col || '#1a7ad0', n = Math.round(w / 34);
    for (let row = 0; row < 2; row++) {
      c.beginPath(); c.moveTo(-w / 2, 0);
      for (let i = 0; i <= n; i++) { const x = -w / 2 + i * w / n; const y = -18 - row * 10 - Math.sin(t * 2.4 + i * 1.3 + row) * 5; c.quadraticCurveTo(x - w / n / 2, y - 12, x, y); }
      c.lineTo(w / 2, 0); c.closePath(); fill(row ? light(col, .25) : col);
    }
  }
  function stone(o) { ell(0, -12, 26, 13, '#9aa6b2'); ell(-4, -16, 18, 7, '#b6c0ca'); txt('राम', 0, -12, 18, '#5a2a12', 'Rozha', 400); }

  // ---------------------------------------------------------------- background line art (the room behind the book)
  function roomArt(id, pal) {
    const ink = dark(pal.bg, .2), r = rng(id.length * 31 + id.charCodeAt(0));
    c.save(); c.globalAlpha = .55; c.strokeStyle = ink; c.lineWidth = 1.6; c.lineJoin = 'round';
    const S_ = (pts) => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); };
    S_([[0, 470], [W, 470]]);
    // arched window
    const wx = 760 + r() * 200, wy = 70;
    c.beginPath(); c.moveTo(wx, 400); c.lineTo(wx, wy + 90); c.arc(wx + 90, wy + 90, 90, Math.PI, 0); c.lineTo(wx + 180, 400); c.stroke();
    c.beginPath(); c.moveTo(wx + 14, 400); c.lineTo(wx + 14, wy + 92); c.arc(wx + 90, wy + 92, 76, Math.PI, 0); c.lineTo(wx + 166, 400); c.stroke();
    S_([[wx + 90, wy + 16], [wx + 90, 400]]); S_([[wx + 14, 250], [wx + 166, 250]]);
    // shelf with books
    const sx = 40 + r() * 120, sy = 230;
    S_([[sx, sy], [sx + 230, sy]]); S_([[sx, sy + 120], [sx + 230, sy + 120]]);
    for (let i = 0; i < 9; i++) { const bx = sx + 10 + i * 18, bh = 60 + r() * 40; c.strokeRect(bx, sy - bh, 14, bh); }
    for (let i = 0; i < 6; i++) { const bx = sx + 20 + i * 22, bh = 50 + r() * 50; c.strokeRect(bx, sy + 120 - bh, 18, bh); }
    // lamp
    const lx = 470 + r() * 120; S_([[lx, 470], [lx, 330], [lx + 60, 260]]); c.beginPath(); c.moveTo(lx + 40, 250); c.lineTo(lx + 100, 240); c.lineTo(lx + 90, 290); c.closePath(); c.stroke();
    // plant
    const px = 1140 - r() * 60; c.strokeRect(px, 400, 60, 70);
    for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(px + 30 + (i - 2) * 16, 370 - (i % 2) * 30, 14, 30, (i - 2) * .4, 0, Math.PI * 2); c.stroke(); }
    // a reader's outline, faint, behind the book (the person turning these pages)
    if (r() < .6) {
      const ox = 520 + r() * 160;
      c.beginPath(); c.arc(ox, 200, 46, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.moveTo(ox - 120, 470); c.bezierCurveTo(ox - 120, 300, ox - 60, 270, ox, 268); c.bezierCurveTo(ox + 60, 270, ox + 120, 300, ox + 120, 470); c.stroke();
      S_([[ox - 90, 350], [ox - 150, 440], [ox - 60, 458]]);
    }
    // globe
    const gx = 300 + r() * 80; c.beginPath(); c.arc(gx, 400, 34, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.ellipse(gx, 400, 14, 34, 0, 0, Math.PI * 2); c.stroke(); S_([[gx, 434], [gx, 470]]); S_([[gx - 20, 470], [gx + 20, 470]]);
    c.restore();
  }

  // ---------------------------------------------------------------- scene compositions
  // it(u, v, draw, opts): u -1..1 across the book, v 0 (front) .. 1 (back); draw(k) in pixels at the front-edge scale.
  // opts: d (pop delay after the page lands), tin(k) / tout(k) (local times to pop in / fold away), pos(k) -> {u,v,z}, flat
  const it = (u, v, draw, o = {}) => ({ u, v, draw, ...o });
  const F = (u, v, pts, col, o = {}) => ({ u, v, flat: true, pts, col, ...o });
  const SCENES = {
    ayodhya: () => [
      F(0, .55, [[-1, .48], [-.4, .56], [.2, .5], [1, .58], [1, .68], [.2, .61], [-.4, .67], [-1, .6]], '#3fb4e8'),
      it(0, .9, k => palace({ w: 300, h: 250, wall: '#fff3e0', dome: '#f2c23a', win: '#3d8fe0' }), { d: 0 }),
      it(-.52, .86, k => tower({ w: 46, h: 200, col: '#f7e3c0', win: '#3d8fe0' }), { d: .1 }),
      it(.52, .86, k => tower({ w: 46, h: 210, col: '#f7e3c0', win: '#3d8fe0' }), { d: .12 }),
      it(-.86, .78, k => tree({ h: 190, seed: 3 }), { d: .2 }),
      it(.86, .74, k => tree({ h: 170, seed: 5, leaf: '#26875a' }), { d: .22 }),
      it(.66, .72, k => palm({ h: 150, t: k.lt }), { d: .3 }),
      it(-.66, .35, k => pine({ h: 130, t: k.lt }), { d: .35 }),
      it(.25, .58, k => { rr(-30, -14, 60, 12, 6, '#f2632a'); line([[0, -14], [0, -46]], '#7a4a1a', 2); poly([[0, -46], [20, -22], [0, -22]], '#fff'); }, { pos: k => ({ u: .1 + Math.sin(k.lt * .3) * .25, v: .58, z: 0 }), d: .4 }),
      it(-.3, .3, k => person(CAST.dasharatha({ h: 100, pose: k.lt > k.L(1) ? 'raise' : 'stand', t: k.lt })), { d: .45 }),
      ...[0, 1, 2, 3].map(i => it(-.05 + i * .17, .22 - (i % 2) * .05, k => person({ ...[CAST.rama(), CAST.bharata(), CAST.lakshmana(), CAST.citizen({ bottom: '#e8344a', sash: '#f2c23a', crown: 1 })][i], h: 52, crown: 0, hair: '#1f1a2e', pose: 'wave', t: k.lt + i }), { tin: k => k.L(1) + 2.2 + i * .45 })),
      it(.75, .25, k => bush({ w: 70, flowers: '#ff6fae' }), { d: .5 }),
      it(-.88, .22, k => bush({ w: 60, col: '#3cae6a', flowers: '#f2e03a' }), { d: .55 }),
    ],
    bow: () => [
      it(0, .95, k => arch({ w: 300, h: 300, col: '#ff6fae', inner: '#ffd1e6', panes: 1 }), { d: 0 }),
      it(-.55, .9, k => sheet({ w: 120, h: 220, col: '#f2632a', rot: -.08, lines: 1 }), { d: .08 }),
      it(.6, .9, k => sheet({ w: 140, h: 200, col: '#2a7ae0', rot: .06 }), { d: .1 }),
      it(-.88, .7, k => tree({ h: 200, seed: 8, leaf: '#1d6e4a' }), { d: .15 }),
      it(.88, .7, k => tree({ h: 180, seed: 9 }), { d: .17 }),
      it(-.7, .38, k => person(CAST.janaka({ h: 98, pose: k.lt < k.L(1) ? 'point' : 'raise', t: k.lt })), { d: .3 }),
      it(-.45, .3, k => person(CAST.sita({ h: 80, pose: 'garland', t: k.lt })), { d: .35, pos: k => ({ u: lerp(-.45, .02, ease((k.lt - k.L(1) - 4.2) / 1.5)), v: .3, z: 0 }) }),
      it(.65, .42, k => person(CAST.citizen({ h: 76, bottom: '#7b5ae0', crown: 1, pose: k.lt < k.L(0) + 4 ? 'carry' : 'sad', rock: '#7a3d18', face: -1, t: k.lt })), { d: .4, tout: k => k.L(1) + .2 }),
      it(.82, .35, k => person(CAST.citizen({ h: 80, bottom: '#f2632a', crown: 1, pose: k.lt > k.L(0) + 5 ? 'sad' : 'stand', face: -1, t: k.lt })), { d: .42, tout: k => k.L(1) + .3 }),
      it(.3, .28, k => {   // Shiva's bow on its stand, then in Rama's hands, then broken
        const lt = k.lt, L1 = k.L(1), snap = L1 + .35;
        rr(-70, -16, 140, 16, 3, '#7a3d18');
        if (lt < L1 - 0.6) { c.beginPath(); c.ellipse(0, -22, 80, 18, 0, Math.PI, 0); c.strokeStyle = '#8a4a1a'; c.lineWidth = 8; c.stroke(); return; }
        if (lt < snap) { const lift = eOut((lt - (L1 - .6)) / .5); c.beginPath(); c.arc(0, -40 - lift * 80, 70, Math.PI * 1.05, Math.PI * 1.95); c.strokeStyle = '#8a4a1a'; c.lineWidth = 8; c.stroke(); return; }
        const s = eOut((lt - snap) / .8);
        for (const d of [-1, 1]) { c.save(); c.translate(d * (20 + s * 60), -120 + s * 100); c.rotate(d * s * 1.4); c.beginPath(); c.arc(-d * 35, 0, 40, d < 0 ? Math.PI * 1.05 : Math.PI * 1.5, d < 0 ? Math.PI * 1.5 : Math.PI * 1.95); c.strokeStyle = '#8a4a1a'; c.lineWidth = 8; c.stroke(); c.restore(); }
        if (lt < snap + .6) for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; line([[Math.cos(a) * 20 * (1 + s * 3), -120 + Math.sin(a) * 20 * (1 + s * 3)], [Math.cos(a) * 34 * (1 + s * 3), -120 + Math.sin(a) * 34 * (1 + s * 3)]], '#ffd23a', 4); }
      }, { d: .25 }),
      it(.05, .24, k => person(CAST.rama({ h: 86, face: 1, pose: k.lt > k.L(1) - .6 && k.lt < k.L(1) + .4 ? 'raise' : k.lt > k.L(1) + 4 ? 'namaste' : 'stand', t: k.lt })), { tin: k => k.L(0) + 3, pos: k => ({ u: lerp(.05, .14, ease((k.lt - k.L(1) - 4.2) / 1.5)), v: .24, z: 0 }) }),
      it(.08, .26, k => { for (let i = 0; i < 14; i++) { const r = rng(i + 3); const y = ((k.lt * 40 + r() * 300) % 300); circ((r() - .5) * 260, -320 + y, 5, i % 2 ? '#ff6fae' : '#ffd23a'); } }, { tin: k => k.L(1) + 4.6 }),
    ],
    exile: () => [
      F(0, .5, [[-1, .2], [-.6, .3], [-.1, .32], [.4, .5], [1, .55], [1, .62], [.4, .58], [-.1, .4], [-.6, .38], [-1, .3]], '#f6d8a8'),
      it(-.62, .9, k => palace({ w: 210, h: 190, wall: '#efe6ff', dome: '#f2c23a', win: '#6f6fe2' }), { d: 0 }),
      it(.45, .88, k => tree({ h: 200, seed: 11, leaf: '#1d6e4a', trunk: '#7a4a2a' }), { d: .1 }),
      it(.72, .82, k => tree({ h: 220, seed: 12, leaf: '#26875a', trunk: '#7a4a2a' }), { d: .12 }),
      it(.92, .7, k => pine({ h: 160, trunk: '#7a4a2a', t: k.lt }), { d: .14 }),
      it(.15, .85, k => tree({ h: 160, seed: 13, leaf: '#3a9a5a', trunk: '#7a4a2a' }), { d: .16 }),
      it(-.78, .36, k => person(CAST.dasharatha({ h: 96, pose: 'sad', t: k.lt })), { d: .3, tout: k => k.L(2) - .2 }),
      it(-.5, .3, k => { person(CAST.kaikeyi({ h: 86, pose: 'point', t: k.lt })); for (let i = 0; i < 2; i++) { const y = -130 - Math.sin(k.lt * 2 + i) * 6; rr(14 + i * 34, y, 26, 30, 3, '#f7efd8'); rr(12 + i * 34, y - 3, 30, 6, 3, '#8a4a22'); txt('वर', 27 + i * 34, y + 16, 13, '#5a2a12', 'Rozha', 400); } }, { d: .35, tout: k => k.L(2) - .2 }),
      ...[CAST.lakshF, CAST.ramaF, CAST.sitaF].map((m, i) => it(0, .3, k => person(m({ h: [80, 86, 78][i], walk: k.lt > k.L(1), t: k.lt + i * .3 })), {
        tin: k => k.L(1) - .2 + i * .15, pos: k => { const q = clamp((k.lt - k.L(1)) / 9); return { u: -.15 + i * .13 + q * .75, v: .34 + q * .14, z: 0 }; } })),
      it(-.55, .4, k => throne({ w: 96, sandals: 1, glow: .6 + .4 * Math.sin(k.lt * 3) }), { tin: k => k.L(2) + .1 }),
      it(-.28, .3, k => person(CAST.bharata({ h: 86, pose: 'namaste', face: -1, t: k.lt })), { tin: k => k.L(2) + .4 }),
    ],
    deer: () => [
      it(-.55, .62, k => hut({ w: 130 }), { d: 0 }),
      ...[[-.92, .85, 210, 21], [-.2, .92, 230, 22], [.3, .88, 200, 23], [.75, .9, 240, 24], [.98, .7, 180, 25]].map(([u, v, h, s], i) => it(u, v, k => tree({ h, seed: s, leaf: i % 2 ? '#1d6e4a' : '#26875a', trunk: i % 2 ? '#e35aa0' : '#7a4a2a' }), { d: .05 + i * .04 })),
      it(.05, .7, k => pine({ h: 150, t: k.lt }), { d: .25 }),
      it(-.85, .3, k => bush({ w: 80, flowers: '#ff6fae' }), { d: .3 }),
      it(.88, .3, k => bush({ w: 70, flowers: '#ffffff' }), { d: .32 }),
      it(-.3, .55, k => person(CAST.lakshF({ h: 80, t: k.lt, pose: 'bow' })), { d: .35 }),
      it(-.45, .28, k => person(CAST.sitaF({ h: 78, pose: k.lt < k.L(1) ? 'point' : 'stand', t: k.lt })), { d: .4 }),
      it(0, .3, k => {
        const lt = k.lt, rev = clamp((lt - k.L(1) - .8) / .6);
        if (rev < 1) { c.globalAlpha = 1 - rev; deer({ h: 70, run: lt > k.L(0) + 3.5, t: lt, col: '#f2b51c' }); c.globalAlpha = 1; }
        if (rev > 0) { c.save(); c.globalAlpha = rev; c.scale(1, rev); person(CAST.rakshasa({ h: 95, pose: 'raise', t: lt })); c.restore(); }
      }, { d: .45, pos: k => { const q = clamp((k.lt - k.L(0) - 3.5) / 5); return { u: .05 + q * .62, v: .3 + q * .1, z: 0 }; } }),
      it(-.1, .25, k => person(CAST.ramaF({ h: 86, pose: 'bow', walk: k.lt > k.L(0) + 4 && k.lt < k.L(0) + 9, t: k.lt })), {
        tin: k => k.L(0) + 3, pos: k => { const q = clamp((k.lt - k.L(0) - 4) / 5); return { u: -.1 + q * .5, v: .25 + q * .08, z: 0 }; } }),
    ],
    abduction: () => [
      it(-.6, .62, k => hut({ w: 120 }), { d: 0 }),
      it(-.9, .8, k => tree({ h: 200, seed: 31, leaf: '#1d6e4a' }), { d: .05 }),
      it(.85, .85, k => tree({ h: 190, seed: 32, leaf: '#2a5a8a', trunk: '#7a4a2a' }), { d: .08 }),
      it(.2, .9, k => cloud({ w: 200, col: '#9a8ab8' }), { d: .1, pos: k => ({ u: .2 + Math.sin(k.lt * .4) * .05, v: .9, z: 160 }) }),
      it(-.25, .95, k => cloud({ w: 160, col: '#b6a6d0' }), { d: .12, pos: k => ({ u: -.25, v: .95, z: 210 }) }),
      it(-.25, .32, k => ravana({ h: 130, t: k.lt, pose: 'raise' }), { d: .3, tout: k => k.L(0) + 3.4 }),
      it(-.05, .3, k => person(CAST.sitaF({ h: 78, pose: 'raise', t: k.lt, face: -1 })), { d: .35, tout: k => k.L(0) + 3.4 }),
      it(0, .5, k => chariot({ w: 180, t: k.lt, riders: [() => ravana({ h: 70, t: k.lt, pose: 'stand' }), () => {}, () => person(CAST.sitaF({ h: 46, pose: 'raise', t: k.lt }))] }), {
        tin: k => k.L(0) + 3.3, pos: k => { const q = ease((k.lt - k.L(0) - 3.5) / (k.D - k.L(0) - 4)); return { u: -.35 + q * 1.0, v: .45 + q * .3, z: 20 + q * 230 }; } }),
      it(.7, .4, k => { const lt = k.lt, hit = k.L(1) + 2.3; bird({ h: 110, t: lt, face: -1, down: lt > hit + 1 }); if (lt > hit && lt < hit + 1.6) for (let i = 0; i < 6; i++) { const r = rng(i); ell((r() - .5) * 120, -60 + (lt - hit) * 60 * r(), 6, 2.5, '#7a4a2a', r() * 3); } }, {
        tin: k => k.L(1) - .3, pos: k => { const lt = k.lt, a = k.L(1), hit = a + 2.3;
          if (lt < hit) { const q = ease((lt - a) / 2.3); return { u: .9 - q * .25, v: .55 + q * .15, z: 60 + q * 160 }; }
          const q = eIn((lt - hit) / 1.2); return { u: .65 - q * .1, v: .7 - q * .35, z: 220 * (1 - q) }; } }),
    ],
    hanuman: () => [
      it(-.4, .92, k => hill({ w: 360, h: 170, col: '#b9895a' }), { d: 0 }),
      it(.35, .95, k => hill({ w: 420, h: 210, col: '#a8784a' }), { d: .05 }),
      it(.9, .82, k => palm({ h: 180, t: k.lt }), { d: .1 }),
      it(-.88, .8, k => palm({ h: 160, t: k.lt + 1, leaf: '#3cb46a' }), { d: .12 }),
      it(-.1, .78, k => rock({ w: 90 }), { d: .15 }),
      it(-.72, .3, k => person(CAST.lakshF({ h: 82, t: k.lt })), { d: .3 }),
      it(-.55, .26, k => person(CAST.ramaF({ h: 88, pose: k.lt > k.L(0) + 2.5 ? 'namaste' : 'stand', t: k.lt })), { d: .32 }),
      it(-.18, .26, k => person(CAST.hanuman({ h: 90, face: -1, pose: k.lt > k.L(0) + 2.5 && k.lt < k.L(1) ? 'namaste' : 'mace', t: k.lt })), { tin: k => k.L(0) + 1.3 }),
      it(.05, .3, k => person(CAST.sugriva({ h: 88, face: -1, pose: k.lt > k.L(1) ? 'raise' : 'stand', t: k.lt })), { tin: k => k.L(0) + 2.4 }),
      ...Array.from({ length: 14 }, (_, i) => it(.25 + (i % 5) * .17, .3 + Math.floor(i / 5) * .17 + (i % 2) * .04, k => person(CAST.vanara({ h: 60, face: -1, bottom: ['#2fae5a', '#e8344a', '#2f8fe6', '#f2c23a'][i % 4], pose: i % 3 ? 'raise' : 'mace', t: k.lt + i })), { tin: k => k.L(1) + .4 + i * .14 })),
    ],
    leap: () => [
      F(.15, .5, [[-.45, .02], [1, .02], [1, .98], [-.45, .98], [-.55, .5]], '#2a7ae0'),
      it(.05, .55, k => waves({ w: 300, t: k.lt }), { d: 0 }),
      it(.1, .25, k => waves({ w: 260, t: k.lt + 1, col: '#1a6ac0' }), { d: .05 }),
      it(-.78, .55, k => hill({ w: 200, h: 120, col: '#2fae5a' }), { d: .08 }),
      it(.72, .88, k => hill({ w: 300, h: 110, col: '#8a5a3a' }), { d: .1 }),
      ...[[.55, .9, 46, 190], [.7, .92, 56, 240], [.86, .9, 44, 180], [.62, .84, 36, 140], [.8, .84, 40, 150]].map(([u, v, w, h], i) =>
        it(u, v, k => tower({ w, h, col: '#f2c23a', t: k.lt, burn: clamp((k.lt - k.L(2) - .5 - i * .4) / 1.5) }), { d: .12 + i * .03 })),
      it(.48, .45, k => tree({ h: 170, seed: 41, leaf: '#e8344a', trunk: '#7a4a2a' }), { d: .2 }),   // the Ashoka tree
      it(.62, .4, k => { person(CAST.sitaF({ h: 74, t: k.lt, pose: k.lt > k.L(1) + 3 ? 'namaste' : 'stand', face: -1 })); if (k.lt > k.L(1) + 2.2 && k.lt < k.L(1) + 5) { const q = clamp((k.lt - k.L(1) - 2.2) / 1); circ(-30 * (1 - q), -70, 6, 'rgba(255,230,120,.5)'); c.beginPath(); c.arc(-30 * (1 - q), -70, 4, 0, 7); c.strokeStyle = '#f2c23a'; c.lineWidth = 2.5; c.stroke(); } }, { tin: k => k.L(1) - .4 }),
      it(-.7, .5, k => {
        const lt = k.lt, a = k.L(0) + .4, q = clamp((lt - a) / 2.6), grow = 1 + Math.sin(q * Math.PI) * .9;
        c.save(); c.scale(grow, grow); c.rotate(q > 0 && q < 1 ? -.3 : 0);
        person(CAST.hanuman({ h: 90, pose: q > 0 && q < 1 ? 'raise' : 'mace', t: lt, face: lt > k.L(1) + 1.5 && lt < k.L(2) ? -1 : 1 }));
        if (lt > k.L(2) + .2) { flame(-40, -70, .9, lt, 3); flame(-46, -82, .6, lt, 5); }
        c.restore();
      }, { d: .3, pos: k => {
        const lt = k.lt, a = k.L(0) + .4, q = ease(clamp((lt - a) / 2.6));
        if (lt < k.L(2) + .3) return { u: lerp(-.7, .4, q), v: lerp(.5, .42, q), z: Math.sin(q * Math.PI) * 300 };
        const j = (lt - k.L(2) - .3) / .8, n = Math.floor(j), f = j - n, xs = [.4, .55, .7, .86, .62, .8];
        const u0 = xs[Math.min(n, 5)], u1 = xs[Math.min(n + 1, 5)];
        return { u: lerp(u0, u1, f), v: .8, z: 150 + Math.sin(f * Math.PI) * 70 };
      } }),
    ],
    bridge: () => [
      F(0, .5, [[-.5, .02], [.55, .02], [.6, .98], [-.55, .98]], '#2a8ae0'),
      it(0, .2, k => waves({ w: 240, t: k.lt }), { d: 0 }),
      it(0, .8, k => waves({ w: 220, t: k.lt + 2 }), { d: .02 }),
      it(.06, .96, k => scroll({ w: 120, h: 280, text: ['श्री', 'राम'] }), { d: .05, pos: k => ({ u: .06, v: .96, z: 60 + Math.sin(k.lt * 1.2) * 6 }) }),
      it(.8, .85, k => { hill({ w: 200, h: 90, col: '#8a5a3a' }); c.translate(0, -60); tower({ w: 40, h: 170, col: '#f2c23a' }); c.translate(40, 10); tower({ w: 34, h: 130, col: '#e8b41a' }); }, { d: .1 }),
      it(-.82, .82, k => palm({ h: 170, t: k.lt }), { d: .12 }),
      it(-.65, .78, k => palm({ h: 140, t: k.lt + 2, leaf: '#3cb46a' }), { d: .14 }),
      ...Array.from({ length: 9 }, (_, i) => it(-.48 + i * .12, .5, k => stone({}), { tin: k => k.L(0) + .3 + i * .55 })),
      ...Array.from({ length: 6 }, (_, i) => it(-.92 + (i % 3) * .14, .25 + Math.floor(i / 3) * .2, k => person(CAST.vanara({ h: 58, bottom: ['#e8344a', '#2f8fe6', '#f2c23a'][i % 3], pose: 'carry', walk: 1, t: k.lt + i })), { d: .3 + i * .05 })),
      it(-.75, .55, k => person(CAST.ramaF({ h: 84, pose: 'bow', t: k.lt })), { d: .3 }),
      it(-.6, .58, k => person(CAST.hanuman({ h: 84, pose: 'namaste', t: k.lt })), { d: .33 }),
    ],
    battle: () => [
      it(.65, .92, k => { hill({ w: 320, h: 80, col: '#8a3a3a' }); [[-80, 46, 200], [-20, 56, 250], [50, 44, 190], [100, 36, 150]].forEach(([x, w, h]) => { c.save(); c.translate(x, -40); tower({ w, h, col: '#f2c23a', burn: .5, t: k.lt }); c.restore(); }); }, { d: 0 }),
      it(-.75, .85, k => cloud({ w: 180, col: '#f6b0a0' }), { d: .05, pos: k => ({ u: -.75 + Math.sin(k.lt * .5) * .05, v: .85, z: 200 }) }),
      ...Array.from({ length: 10 }, (_, i) => it(-.4 + (i % 5) * .2, .55 + Math.floor(i / 5) * .15, k => {
        const m = i % 2 ? CAST.rakshasa({ h: 60, face: -1, pose: 'sword' }) : CAST.vanara({ h: 58, pose: 'mace', bottom: '#2f8fe6' });
        c.translate(Math.sin(k.lt * 4 + i) * 6, 0); person({ ...m, t: k.lt + i });
      }, { d: .2 + i * .05, tout: k => k.L(1) + 2.4 + (i % 3) * .1 })),
      it(-.25, .4, k => { for (let i = 0; i < 5; i++) { const q = (k.lt * 1.3 + i * .37) % 1; line([[-200 + q * 500, -150 - i * 18 + q * 30], [-175 + q * 500, -152 - i * 18 + q * 30]], '#3a2a2a', 2.2); } }, { d: .4, tout: k => k.L(1) }),
      it(-.72, .28, k => person(CAST.lakshF({ h: 82, pose: 'bow', t: k.lt })), { d: .35 }),
      it(-.88, .4, k => person(CAST.hanuman({ h: 86, pose: 'mace', t: k.lt })), { d: .38 }),
      it(-.55, .22, k => { const d = clamp((k.lt - k.L(1) - .2) / 1); person(CAST.ramaF({ h: 92, pose: 'bow', draw: k.lt < k.L(1) + 1.4 ? d : 0, arrow: k.lt < k.L(1) + 1.4 && k.lt > k.L(1) ? '#ffd23a' : 0, t: k.lt })); }, { d: .3 }),
      it(.45, .3, k => { const f = eIn((k.lt - k.L(1) - 2.5) / .9); c.rotate(f * 1.2); ravana({ h: 150, t: k.lt, face: -1, pose: k.lt < k.L(1) + 2.4 ? 'sword' : 'raise' }); }, { d: .25, tout: k => k.L(1) + 3.6 }),
    ],
    return: () => [
      it(0, .92, k => palace({ w: 330, h: 260, wall: '#fff3e0', dome: '#f2c23a', win: '#f08a2c', flag: '#e43aa6' }), { d: 0 }),
      it(-.6, .85, k => tower({ w: 48, h: 200, col: '#f7e3c0', win: '#f08a2c' }), { d: .05 }),
      it(.6, .85, k => tower({ w: 48, h: 200, col: '#f7e3c0', win: '#f08a2c' }), { d: .07 }),
      it(-.88, .75, k => palm({ h: 160, t: k.lt }), { d: .1 }),
      it(.88, .72, k => tree({ h: 180, seed: 51, leaf: '#26875a' }), { d: .12 }),
      it(0, .6, k => chariot({ w: 190, t: k.lt, riders: [() => person(CAST.lakshmana({ h: 46 })), () => person(CAST.rama({ h: 50 })), () => person(CAST.sita({ h: 44 }))] }), {
        d: .2, tout: k => k.L(2) - .1, pos: k => { const q = ease(k.lt / (k.L(1) + 1.5)); return { u: lerp(.9, 0, q), v: .65, z: lerp(330, 190, q) + Math.sin(k.lt * 2) * 6 }; } }),
      ...Array.from({ length: 18 }, (_, i) => it(-.92 + (i % 9) * .23, .1 + Math.floor(i / 9) * .62 + (i % 2) * .03, k => diya({ s: 1.4, t: k.lt, seed: i }), { tin: k => k.L(1) + i * .1 })),
      ...Array.from({ length: 8 }, (_, i) => it(-.85 + i * .24 + (i > 3 ? .1 : 0), .45 + (i % 2) * .08, k => person(CAST.citizen({ h: 58, bottom: ['#e43aa6', '#2f8fe6', '#2fae5a', '#7b5ae0'][i % 4], pose: 'wave', longhair: i % 2, sari: i % 2, top: i % 2 ? '#f2c23a' : undefined, t: k.lt + i })), { tin: k => k.L(1) + .8 + i * .1 })),
      it(-.06, .32, k => throne({ w: 110 }), { tin: k => k.L(2) - .2 }),
      it(-.12, .3, k => person(CAST.rama({ h: 86, pose: 'stand', t: k.lt })), { tin: k => k.L(2) }),
      it(.06, .3, k => person(CAST.sita({ h: 78, pose: 'namaste', face: -1, t: k.lt })), { tin: k => k.L(2) + .15 }),
      it(0, .3, k => { for (let i = 0; i < 16; i++) { const r = rng(i + 9); const y = ((k.lt * 50 + r() * 320) % 320); circ((r() - .5) * 400, -340 + y, 5, ['#ff6fae', '#ffd23a', '#f2632a'][i % 3]); } }, { tin: k => k.L(2) + .3 }),
    ],
    end: () => [
      ...Array.from({ length: 13 }, (_, i) => it(-.9 + (i % 13) * .15, .08 + (i % 2) * .05, k => diya({ s: 1.2, t: k.lt, seed: i }), { d: .1 + i * .05 })),
      ...[
        [-.78, k => tree({ h: 120, seed: 61, leaf: '#1d6e4a' })], [-.62, k => deer({ h: 50, t: k.lt })], [-.82, k => person(CAST.hanuman({ h: 60, pose: 'mace', t: k.lt }))],
        [-.6, k => cloud({ w: 90 })], [-.75, k => { c.beginPath(); c.arc(0, -40, 34, Math.PI * 1.1, Math.PI * 1.9); c.strokeStyle = '#8a4a1a'; c.lineWidth = 5; c.stroke(); }],
        [.62, k => palm({ h: 120, t: k.lt })], [.8, k => chariot({ w: 90, t: k.lt })], [.7, k => person(CAST.sita({ h: 54, t: k.lt }))],
        [.82, k => bush({ w: 60, flowers: '#ff6fae' })], [.62, k => person(CAST.rama({ h: 58, pose: 'bow', t: k.lt }))],
      ].map(([u, fn], i) => it(u, .5, k => { c.rotate(Math.sin(k.lt * .8 + i) * .08); fn(k); }, { d: .2 + i * .08, pos: k => ({ u: u + Math.sin(k.lt * .5 + i) * .03, v: .5, z: ((i * 70 + k.lt * 18) % 380) }) })),
    ],
  };

  // ---------------------------------------------------------------- book, page turn, bands, labels, HUD
  function drawBook(pal, prev, k, turnQ) {
    const left = turnQ >= 1 ? pal.L : prev.L;
    // page block thickness
    poly([P(-1, 0), P(1, 0), [P(1, 0)[0] + 3, P(1, 0)[1] + 12], [P(-1, 0)[0] - 3, P(-1, 0)[1] + 12]], '#f7f1e2');
    line([[P(-1, 0)[0] - 3, P(-1, 0)[1] + 12], [P(1, 0)[0] + 3, P(1, 0)[1] + 12]], 'rgba(0,0,0,.18)', 2);
    for (let i = 1; i < 4; i++) line([[P(-1, 0)[0], P(-1, 0)[1] + i * 3], [P(1, 0)[0], P(1, 0)[1] + i * 3]], 'rgba(0,0,0,.06)', 1);
    poly([P(-1, 0), P(0, 0), P(0, 1), P(-1, 1)], left);
    poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)], pal.R);
    // printed text marks on the page corners
    for (const [u0, col] of [[-.86, left], [.48, pal.R]]) for (let i = 0; i < 4; i++) {
      const v = .1 + i * .05; const a = P(u0, v), b = P(u0 + .3 - (i % 2) * .08, v);
      line([a, b], dark(col, .14), 4, 'butt');
    }
    line([P(0, 0), P(0, 1)], 'rgba(0,0,0,.12)', 2);
  }
  function drawTurningPage(theta, front, backc, coverTitle) {
    if (theta <= 0 || theta >= Math.PI) return;
    const N = 16, k = 0.55 * Math.sin(theta);
    const pts = v => { const out = []; let x = 0, z = 0; for (let i = 0; i <= N; i++) { const u = i / N; const a = theta - k * u; if (i) { x += Math.cos(a) / N; z += Math.sin(a) / N; } out.push([BK.cx + x * hw(v), lerp(BK.yf, BK.yb, v) - z * hw(v) * .78]); } return out; };
    const f = pts(0), b = pts(1);
    const showBack = theta > Math.PI / 2;
    const col = showBack ? backc : front;
    const shade = Math.abs(Math.cos(theta));
    poly([...f, ...b.reverse()], mixc(col, '#000000', (1 - shade) * .18));
    if (!showBack && coverTitle) { /* the cover title is drawn only while the cover lies flat */ }
  }
  function bandsStatic(pal) {
    c.save();
    c.beginPath(); c.moveTo(0, 0); c.lineTo(250, 0); c.lineTo(0, 250); c.closePath(); c.fillStyle = pal.band; c.globalAlpha = .0; c.fill(); c.globalAlpha = 1;
    poly([[0, 252], [252, 0], [298, 0], [0, 298]], pal.band);
    poly([[W, H - 252], [W - 252, H], [W - 298, H], [W, H - 298]], pal.band);
    c.restore();
  }
  function wipe(prev, pal, q) {   // the next page's colour band sweeps diagonally across the room
    const c0 = lerp(W + H + 120, -160, ease(q));
    c.save();
    poly([[c0, 0], [W + H, 0], [W + H, H], [c0 - H, H]], pal.bg);
    poly([[c0 - 70, 0], [c0, 0], [c0 - H, H], [c0 - H - 70, H]], pal.band);
    c.restore();
  }
  function label(s, x, y, q, pal) {
    if (!s || q <= 0) return;
    c.font = '800 19px Nunito'; const w = c.measureText(s).width + 28, h = 38;
    const ww = w * eOut(q / .6);
    c.save();
    rr(x + 4, y + 4, ww, h, 2, '#1d1d2b');
    rr(x, y, ww, h, 2, '#ffffff');
    c.lineWidth = 1.5; c.strokeStyle = '#1d1d2b'; c.stroke();
    c.beginPath(); c.rect(x, y, ww, h); c.clip();
    c.globalAlpha = clamp((q - .12) / .3); txt(s, x + 14, y + h / 2 + 1, 19, '#1d1d2b', 'Nunito', 800, 'left');
    c.restore();
  }
  function hud(pal, k) {
    rr(24, 22, 148, 42, 2, pal.band); c.lineWidth = 2; c.strokeStyle = '#1d1d2b'; c.stroke();
    txt('RAMAYANA', 98, 44, 20, '#1d1d2b', 'Nunito', 900);
    let x = W - 24;
    const tags = ['Courage', 'Love', 'Duty'];
    for (const s of tags) { c.font = '800 14px Nunito'; const w = c.measureText(s).width + 14; x -= w; rr(x, 22, w, 24, 1, pal.band); c.lineWidth = 1.2; c.strokeStyle = '#1d1d2b'; c.stroke(); txt(s, x + w / 2, 35, 14, '#1d1d2b', 'Nunito', 800); x -= 4; }
    c.font = '400 13px Rozha'; const sw = c.measureText('रामायण की कथा').width + 14;
    rr(W - 24 - sw, 50, sw, 22, 1, '#ffffff'); c.lineWidth = 1.2; c.strokeStyle = '#1d1d2b'; c.stroke();
    txt('रामायण की कथा', W - 24 - sw / 2, 62, 13, '#1d1d2b', 'Rozha', 400);
  }
  function bubble(s, x, y, a) {
    if (a <= 0) return;
    c.save(); c.globalAlpha = a; c.font = '800 13px Nunito'; const w = c.measureText(s).width + 22;
    rr(x - w / 2, y - 14, w, 28, 14, '#ffffff'); c.lineWidth = 1.2; c.strokeStyle = '#1d1d2b'; c.stroke();
    poly([[x - w / 2 + 10, y + 10], [x - w / 2 + 2, y + 22], [x - w / 2 + 20, y + 12]], '#ffffff');
    txt(s, x, y + 1, 13, '#1d1d2b'); c.restore();
  }
  function arrowBtn(x, y, pal, s, dir = 1) {
    if (s <= 0) return;
    c.save(); c.translate(x, y); c.scale(s, s);
    circ(0, 0, 26, pal.band); c.lineWidth = 2; c.strokeStyle = '#1d1d2b'; c.stroke();
    line([[-5 * dir, -10], [6 * dir, 0], [-5 * dir, 10]], '#1d1d2b', 2.5);
    c.restore();
  }

  // ---------------------------------------------------------------- scene drawing
  const cache = {};
  function items(id) { return cache[id] || (cache[id] = SCENES[id]()); }
  function kfor(si, lt) {
    const sc = TL.scenes[si];
    return { lt, si, sc, t0: si === 0 ? .8 : 0, D: sc.end - sc.start, L: i => (sc.lines[Math.min(i, sc.lines.length - 1)] || { start: 0 }).start - sc.start };
  }
  function popAmount(item, k) {
    const base = k.t0 + 0.95;
    const tin = item.tin ? item.tin(k) : base + (item.d || 0);
    let p = back((k.lt - tin) / .55);
    if (k.lt < tin) p = 0;
    if (item.tout) p *= 1 - eIn((k.lt - item.tout(k)) / .4);
    return p;
  }
  function drawItems(id, k, fold) {
    const list = items(id);
    // flat pieces lie on the page
    for (const f of list.filter(x => x.flat)) {
      const p = clamp(popAmount(f, k)) * fold; if (p <= 0) continue;
      c.save(); c.globalAlpha = clamp(p * 1.5);
      const [cx, cy] = P(f.u, f.v);
      poly(f.pts.map(([u, v]) => { const [x, y] = P(u, v); return [cx + (x - cx) * p, cy + (y - cy) * p]; }), f.col);
      c.restore();
    }
    const stand = list.filter(x => !x.flat).map(x => ({ x, pos: x.pos ? x.pos(k) : { u: x.u, v: x.v, z: 0 } }));
    stand.sort((a, b) => b.pos.v - a.pos.v);
    for (const { x, pos } of stand) {
      const p = popAmount(x, k) * fold; if (p <= 0.001) continue;
      const [sx, sy] = P(pos.u, pos.v), s = S(pos.v);
      c.save();
      c.translate(sx, sy - (pos.z || 0) * s);
      if (!pos.z) { c.save(); c.globalAlpha = .12 * clamp(p); ell(0, 2, 34 * s * (x.sh || 1), 6 * s, '#000'); c.restore(); }
      c.scale(s * (1 + (1 - clamp(p)) * .15), s * p);
      x.draw(k);
      c.restore();
    }
  }
  function floaters(id, pal, k) {
    const r = rng(id.length * 7 + 3);
    for (let i = 0; i < 3; i++) {
      const x0 = r() * W, y0 = 140 + r() * 260, vx = (r() - .5) * 60, col = ['#b56ae0', '#f2e03a', '#ffffff', '#ff6fae', '#2fd0e0'][Math.floor(r() * 5)];
      const x = ((x0 + vx * k.lt) % (W + 100) + W + 100) % (W + 100) - 50, y = y0 + Math.sin(k.lt * 1.3 + i * 2) * 30;
      butterfly(x, y, 1.1, k.lt + i, col);
    }
    for (let i = 0; i < 2; i++) { const x = ((r() * W + k.lt * 50) % (W + 200)) - 100, y = 110 + r() * 120 + Math.sin(k.lt + i) * 10; smallBird(x, y, 1, k.lt + i * .3); }
  }
  function drawScene(si, lt, opts = {}) {
    const sc = TL.scenes[si], id = sc.id, pal = PAL[id], k = kfor(si, lt);
    const prevId = si > 0 ? TL.scenes[si - 1].id : 'cover', prev = PAL[prevId];
    const turnStart = k.t0 + .05, turnDur = 1.15, tq = clamp((lt - turnStart) / turnDur);
    // room
    const wq = clamp((lt - k.t0) / 1.0);
    c.fillStyle = prev.bg; c.fillRect(0, 0, W, H);
    if (si > 0 && wq < 1) { roomArt(prevId, prev); bandsStatic(prev); }
    if (si === 0 || wq > 0) { c.save(); if (si > 0 && wq < 1) { const c0 = lerp(W + H + 120, -160, ease(wq)); c.beginPath(); c.moveTo(c0, 0); c.lineTo(W + H, 0); c.lineTo(W + H, H); c.lineTo(c0 - H, H); c.closePath(); c.clip(); }
      c.fillStyle = pal.bg; c.fillRect(0, 0, W, H); roomArt(id, pal); bandsStatic(pal); c.restore(); }
    if (si > 0 && wq < 1) wipe(prev, pal, wq);
    // camera: a slow push in
    const z = 1 + .055 * ease(lt / k.D) + (id === 'end' ? 0 : 0);
    c.save(); c.translate(640, 460); c.scale(z, z); c.translate(-640, -460);
    drawBook(pal, prev, k, tq);
    if (si === 0 && lt < turnStart) {   // the cover, lying on the right-hand page
      poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)], '#f4b51c');
      const [x, y] = P(.5, .5);
      c.save(); c.translate(x, y); c.transform(1, 0, -.15, .55, 0, 0); txt('रामायण', 0, -30, 72, '#1d1d2b', 'Rozha', 400); txt('RAMAYANA', 0, 40, 34, '#1d1d2b', 'Nunito', 900); c.restore();
    }
    // previous scene folds down while the page turns
    if (si > 0 && lt < .5) { const pk = kfor(si - 1, TL.scenes[si - 1].end - TL.scenes[si - 1].start); drawItems(prevId, pk, 1 - eIn(lt / .45)); }
    drawTurningPage(Math.PI * ease(tq), si === 0 ? '#f4b51c' : prev.R, pal.L);
    drawItems(id, k, 1);
    if (id === 'battle') {   // Rama's arrow, and the flash when it lands
      const a = k.L(1) + 1.4, q = (lt - a) / 1.0;
      if (q > 0 && q < 1) { const [x0, y0] = P(-.5, .22), [x1, y1] = P(.45, .3); const x = lerp(x0 + 30, x1, eIn(q)), y = lerp(y0 - 70, y1 - 150, eIn(q)) - Math.sin(q * Math.PI) * 60;
        line([[x - 60, y + 6], [x, y]], '#ffd23a', 5); circ(x, y, 12, 'rgba(255,240,150,.6)'); }
      const fl = 1 - clamp((lt - a - 1) / .6); if (lt > a + 1 && fl > 0) { c.save(); c.globalAlpha = fl * .7; c.fillStyle = '#fff7d0'; c.fillRect(-200, -200, W + 400, H + 400); c.restore(); }
    }
    if (id === 'end') {
      const q = clamp((lt - 1.4) / 1);
      c.save(); c.globalAlpha = q;
      txt('रामायण', 640, 230, 64, '#1d1d2b', 'Rozha', 400);
      txt('RAMAYANA', 640, 300, 54, '#1d1d2b', 'Nunito', 900);
      c.globalAlpha = clamp((lt - 2.4) / 1);
      txt('A story of duty, love and courage.', 640, 352, 18, '#1d1d2b', 'Nunito', 700);
      c.restore();
    }
    c.restore();
    floaters(id, pal, k);
    // labels
    sc.lines.forEach((ln, i) => {
      const q = lt - (ln.start - sc.start) + .15;
      label(ln.label, 150 + i * 26, 112 + i * 52, q, pal);
    });
    hud(pal, k);
    bubble('turn the page', 1010, 610, clamp((lt - k.t0 - 1.6) / .4) * (1 - clamp((lt - k.D + .8) / .3)));
    if (id !== 'end') arrowBtn(1080, 330, pal, back((lt - k.t0 - 1.4) / .4) * (lt > k.D - .5 ? 1 - .2 * Math.sin(clamp((lt - k.D + .5) / .5) * Math.PI) : 1));
  }

  function renderAt(t) {
    let si = TL.scenes.findIndex(s => t < s.end); if (si < 0) si = TL.scenes.length - 1;
    const lt = t - TL.scenes[si].start;
    c.save(); drawScene(si, lt); c.restore();
    const fin = clamp(t / .5), fout = clamp((TL.duration - t) / 1.2);
    const a = 1 - Math.min(fin, fout);
    if (a > 0) { c.fillStyle = `rgba(0,0,0,${a})`; c.fillRect(0, 0, W, H); }
  }
  return {
    init(canvas, ep, tl) { c = canvas.getContext('2d'); EP = ep; TL = tl; return { duration: tl.duration, renderAt }; },
  };
})();
