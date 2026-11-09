// Beautiful Idiot: episode renderer. Shares the trailer's pop-collage core (Pop) and cast drawings (Cast).
// Draws sets, wide / two / close / mcu / insert shots from the timeline, plus OP, title cards, cards and the ED.
(function () {
  const { W, H, P, ease, clamp, lerp, jit, popAt, hash } = Pop;
  const C = Cast;
  const INK = '#1b1515';

  // ───────────── cast registry ─────────────
  const ex = (o) => (c, x, y, s, st) => C.extra(c, x, y, s, Object.assign({}, o, st, { pal: Object.assign({}, o.pal, st.pal || {}) }));
  const R = {
    haru: { draw: C.haru, legs: { trous: '#6b4a2e', shoe: '#fffaf0' }, col: [P.yellow, P.lime], expr: 'smile' },
    nana: { draw: C.nana, legs: { skin: '#fde3d4', boots: INK, skirt: INK }, col: [P.pink, P.hot], expr: 'smirk' },
    ryuji: { draw: (c, x, y, s, st) => C.ryuji(c, x, y, s, st), legs: { trous: '#fbf8f0', shoe: INK }, col: [P.red, P.ink], expr: 'smirk' },
    aya: { draw: ex({ style: 'ponytail', glasses: true, eye: 'round', pal: { hair: '#1b1515', top: '#19b3a6', iris: '#3a2a1a', lip: '#b0303a', skin: '#fbe0cf' }, seed: 11 }), legs: { trous: '#2a3a5a', shoe: '#8a3a2a' }, col: [P.teal, P.paper], expr: 'neutral' },
    kobayashi: { draw: ex({ style: 'bald', glasses: true, mustache: '#cfcac2', eye: 'round', pal: { hair: '#cfcac2', top: '#a0662e', skin: '#f3d2b5', iris: '#3a2a1a' }, seed: 12 }), legs: { trous: '#5a5a5a', shoe: '#3a2a1a' }, col: [P.orange, P.yellow], expr: 'smile' },
    kenta: { draw: ex({ style: 'spiky', eye: 'round', pal: { hair: '#1b1515', top: '#2e7fe0', iris: '#2a1a10', skin: '#f6d1b8' }, seed: 13 }), legs: { trous: '#d9a441', shoe: P.red, shorts: true }, col: [P.blue, P.yellow], expr: 'smirk', kid: true },
    togashi: { draw: ex({ style: 'side', mustache: '#8a8a90', eye: 'round', pal: { hair: '#9a9aa0', top: '#2a2a33', iris: '#1a1a1a', skin: '#f0cfb5' }, seed: 14 }), legs: { trous: '#2a2a33', shoe: INK }, col: [P.grey, P.ink], expr: 'serious' },
    grandma: { draw: C.grandma, legs: { skirt: '#4a6fa5', skin: '#f6dcc6', shoe: '#5a3a2a' }, col: [P.sky, P.yellow], expr: 'smile' },
    mika: { draw: (c, x, y, s, st) => C.friend(c, 0, x, y, s, st), legs: { skin: '#fde3d4', skirt: P.pink, shoe: P.white }, col: [P.blue, P.pink], expr: 'smile' },
    rin: { draw: (c, x, y, s, st) => C.friend(c, 1, x, y, s, st), legs: { skin: '#fde3d4', skirt: P.yellow, shoe: P.pink }, col: [P.pink, P.yellow], expr: 'smile' },
    taku: { draw: (c, x, y, s, st) => C.friend(c, 2, x, y, s, st), legs: { trous: '#141010', shoe: P.lime }, col: [P.lime, P.ink], expr: 'smirk' },
    sora: { draw: (c, x, y, s, st) => C.friend(c, 3, x, y, s, st), legs: { trous: '#19b3a6', shoe: INK }, col: [P.purple, P.teal], expr: 'smirk' },
    boss: { draw: (c, x, y, s, st) => C.boss(c, x, y, s, st), legs: { trous: '#2a2a33', shoe: INK }, col: [P.grey, P.paper], expr: 'neutral' },
    doorman: { draw: ex({ style: 'side', eye: 'round', pal: { hair: '#1b1515', top: '#7a2a52', iris: '#1a1a1a', skin: '#f0cfb5' }, seed: 15 }), legs: { trous: '#7a2a52', shoe: INK }, col: [P.purple, P.gold], expr: 'serious' }
  };
  const FRIENDS4 = ['mika', 'rin', 'taku', 'sora'];

  function lookVec(l) {
    if (Array.isArray(l)) return l;
    return { left: [-0.9, 0], right: [0.9, 0], down: [0, 0.9], up: [0, -0.8], front: [0, 0], cam: [0, 0] }[l] || [0, 0];
  }

  // ───────────── full figure for wide shots ─────────────
  function figure(ctx, who, x, y, s, st, walk = 0) {
    const r = R[who]; if (!r) return;
    const g = r.legs || {}; const kid = r.kid ? 0.78 : 1; s *= kid;
    const legA = Math.sin(walk) * 0.4 * (walk ? 1 : 0);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (const [sd, a] of [[-1, legA], [1, -legA]]) {
      ctx.save(); ctx.translate(sd * 40, 330); ctx.rotate(a);
      ctx.fillStyle = g.trous || g.skin || '#fde3d4'; ctx.fillRect(-24, 0, 48, 260); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.strokeRect(-24, 0, 48, 260);
      if (g.shorts) { ctx.fillStyle = '#f6d1b8'; ctx.fillRect(-24, 110, 48, 150); ctx.strokeRect(-24, 110, 48, 150); }
      if (g.boots) { ctx.fillStyle = g.boots; ctx.fillRect(-26, 150, 52, 110); }
      ctx.fillStyle = g.shoe || INK; ctx.beginPath(); ctx.ellipse(sd * 10, 268, 40, 18, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    if (g.skirt) { ctx.beginPath(); ctx.moveTo(-100, 300); ctx.lineTo(100, 300); ctx.lineTo(125, 410); ctx.lineTo(-125, 410); ctx.closePath(); ctx.fillStyle = g.skirt; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
    ctx.restore();
    r.draw(ctx, x, y, s, st);
  }

  // ───────────── sets ─────────────
  const SETS = {};
  function floor(ctx, y, col, col2) { ctx.fillStyle = col; ctx.fillRect(0, y, W, H - y); if (col2) { ctx.fillStyle = Pop.dots(ctx, col2, 2.5, 9); ctx.fillRect(0, y, W, H - y); } ctx.fillStyle = INK; ctx.fillRect(0, y - 3, W, 5); }
  function windowFrame(ctx, x, y, w, h, inner) {
    Pop.card(ctx, x, y, w, h, { seed: Math.floor(x + y), fill: P.sky, border: 10, inner });
    ctx.save(); ctx.fillStyle = '#c99a4b'; ctx.fillRect(x + w / 2 - 6, y, 12, h); ctx.fillRect(x, y + h / 2 - 6, w, 12); ctx.restore();
  }
  SETS.room_haru = (ctx, t, o) => {
    Pop.fill(ctx, '#f6e2b8'); Pop.halftoneWash(ctx, 'rgba(200,120,60,0.25)', 0, 0, W, 520, 2.5, 10);
    windowFrame(ctx, 470, 70, 340, 260, (c, w, h) => { c.fillStyle = o.night ? '#1d2a4a' : P.sky; c.fillRect(0, 0, w, h); Pop.skyline(c, h + 40, 0, 5, 0.5, { shadow: false }); if (o.night) { c.fillStyle = P.white; c.beginPath(); c.arc(w * 0.75, 50, 24, 0, 7); c.fill(); } });
    C.cactus(ctx, 760, 330, 0.55, { label: false });
    floor(ctx, 520, '#d8c27a', 'rgba(120,90,30,0.3)');
    ctx.strokeStyle = 'rgba(80,60,20,0.5)'; ctx.lineWidth = 3; for (let x = 0; x < W; x += 160) { ctx.beginPath(); ctx.moveTo(x, 520); ctx.lineTo(x - 80, H); ctx.stroke(); }
    C.books(ctx, 140, 560, 0.8, 9, 2); C.books(ctx, 1140, 560, 0.7, 6, 5);
    Pop.card(ctx, 900, 600, 300, 70, { seed: 4, fill: '#ffffff', border: 0, inner: (c, w, h) => { c.fillStyle = P.blue; for (let i = 0; i < w; i += 30) c.fillRect(i, 0, 15, h); } });
  };
  SETS.penthouse = (ctx, t, o) => {
    Pop.fill(ctx, '#ffd1e3'); Pop.stripes(ctx, ['#ffd1e3', '#ffc2da'], 50, 0, 0);
    Pop.card(ctx, 150, 50, 980, 420, { seed: 6, fill: o.night ? '#121a36' : '#8fd3ff', border: 12, inner: (c, w, h) => {
      if (!o.night) Pop.sunburst(c, w / 2, h + 60, 24, ['#8fd3ff', '#a8ddff'], t * 0.05);
      Pop.skyline(c, h + 40, 0, 17, 0.75, { shadow: false, lit: o.night ? P.yellow : '#ffffff', body: o.night ? '#3a4560' : '#d9d3c7' });
      if (o.night) for (let i = 0; i < 40; i++) { c.fillStyle = P.white; c.fillRect(hash(i) * w, hash(i * 3) * h * 0.4, 2, 2); }
    } });
    ctx.fillStyle = P.gold; ctx.fillRect(630, 50, 20, 420);
    // chandelier
    ctx.save(); ctx.translate(W / 2, 0); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 60); ctx.stroke();
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(0, 60); ctx.quadraticCurveTo(i * 30, 90, i * 40, 100); ctx.stroke(); ctx.fillStyle = P.yellow; ctx.beginPath(); ctx.arc(i * 40, 104, 8, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.restore();
    floor(ctx, 520, '#fff6ee', 'rgba(255,62,143,0.25)');
    Pop.card(ctx, 760, 470, 460, 130, { seed: 2, fill: '#ffffff', border: 0, inner: (c, w, h) => { c.fillStyle = Pop.dots(c, 'rgba(255,62,143,0.35)', 2, 8); c.fillRect(0, 0, w, h); } });
    Pop.heart(ctx, 980, 520, 0.6, P.hot);
  };
  SETS.crossing = (ctx, t, o) => {
    Pop.fill(ctx, '#5b5f66'); Pop.halftoneWash(ctx, 'rgba(0,0,0,0.3)', 0, 0, W, H, 2, 8);
    Pop.sunburst(ctx, W / 2, 250, 24, o.night ? ['#1d2a4a', '#24365f'] : [P.sky, '#a8ddff'], t * 0.05);
    ctx.fillStyle = '#5b5f66'; ctx.fillRect(0, 300, W, H);
    for (let i = 0; i < 9; i++) { ctx.fillStyle = P.white; ctx.beginPath(); ctx.moveTo(-100 + i * 170, H); ctx.lineTo(-20 + i * 170, H); ctx.lineTo(380 + i * 70, 300); ctx.lineTo(340 + i * 70, 300); ctx.closePath(); ctx.fill(); }
    Pop.skyline(ctx, 320, t, 21, 0.8, { body: '#c9c2b4' });
  };
  SETS.street = (ctx, t, o) => {
    Pop.sunburst(ctx, W / 2, 200, 28, o.night ? ['#1d2a4a', '#24365f'] : [P.yellow, '#ffe680'], t * 0.04);
    Pop.skyline(ctx, 540, t, 31, 1.0, { body: '#e7dcc6', lit: o.night ? P.yellow : P.pink });
    floor(ctx, 540, '#9a9590', 'rgba(0,0,0,0.25)');
    // shop sign
    Pop.label(ctx, o.sign || 'OPEN 24H', 1040, 200, { fam: 'RubikMono', size: 26, bg: P.red, fill: P.white, rot: 0.04, seed: 9 });
  };
  SETS.office = (ctx, t, o) => {
    Pop.fill(ctx, P.cream); Pop.checker(ctx, 470, ['#d9d3c7', '#f2e6cc'], 0, 0, 70);
    Pop.halftoneWash(ctx, 'rgba(120,110,100,0.25)', 0, 0, W, 470, 2.5, 9);
    Pop.card(ctx, 940, 90, 220, 150, { seed: 3, fill: P.paper, inner: (c, w, h) => { c.strokeStyle = P.red; c.lineWidth = 4; c.beginPath(); c.moveTo(20, h - 20); c.lineTo(80, 70); c.lineTo(130, 100); c.lineTo(200, 20); c.stroke(); } });
  };
  SETS.bus = (ctx, t, o) => {
    Pop.fill(ctx, P.yellow);
    ctx.save(); ctx.beginPath(); ctx.roundRect(90, 70, 1100, 420, 30); ctx.clip();
    Pop.fill(ctx, o.rain ? '#7f93a8' : P.sky); ctx.translate(-((t * 260) % 600), 0); Pop.skyline(ctx, 520, 0, 33, 0.9, {}); ctx.translate(600, 0); Pop.skyline(ctx, 520, 0, 33, 0.9, {});
    ctx.restore();
    ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.beginPath(); ctx.roundRect(90, 70, 1100, 420, 30); ctx.stroke(); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(640, 70); ctx.lineTo(640, 490); ctx.stroke();
    floor(ctx, 560, '#2e9a6a', 'rgba(0,0,0,0.2)');
  };
  SETS.konbini = (ctx, t, o) => {
    Pop.fill(ctx, '#f4fbff'); Pop.halftoneWash(ctx, 'rgba(46,179,166,0.18)', 0, 0, W, H, 2, 9);
    for (let r = 0; r < 4; r++) { ctx.fillStyle = '#c9d6dc'; ctx.fillRect(60, 110 + r * 100, 1160, 12); for (let i = 0; i < 26; i++) { ctx.fillStyle = [P.red, P.yellow, P.blue, P.lime, P.pink, P.orange][(i + r) % 6]; ctx.fillRect(70 + i * 44, 60 + r * 100, 34, 50); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.strokeRect(70 + i * 44, 60 + r * 100, 34, 50); } }
    ctx.fillStyle = P.teal; ctx.fillRect(0, 0, W, 30); ctx.fillStyle = P.orange; ctx.fillRect(0, 30, W, 12);
    floor(ctx, 520, '#e8eef0', 'rgba(0,0,0,0.12)');
  };
  SETS.park = (ctx, t, o) => {
    Pop.sunburst(ctx, W / 2, 520, 26, o.night ? ['#1d2a4a', '#24365f'] : [P.sky, '#a8ddff'], t * 0.04);
    for (const [x, r, c] of [[150, 140, '#4fa34a'], [380, 110, '#6cc04a'], [1000, 150, '#4fa34a'], [1180, 100, '#6cc04a']]) {
      ctx.fillStyle = '#7a5a3a'; ctx.fillRect(x - 15, 380, 30, 160); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.strokeRect(x - 15, 380, 30, 160);
      ctx.beginPath(); ctx.arc(x, 360, r, 0, 7); ctx.fillStyle = o.autumn ? P.orange : c; ctx.fill(); ctx.stroke(); ctx.save(); ctx.clip(); ctx.fillStyle = Pop.dots(ctx, 'rgba(0,40,0,0.3)', 3, 10); ctx.fillRect(x, 220, r, 300); ctx.restore();
    }
    floor(ctx, 540, '#8fd16a', 'rgba(0,80,0,0.25)');
    // bench
    ctx.fillStyle = '#c9783a'; ctx.fillRect(470, 520, 340, 24); ctx.fillRect(470, 470, 340, 20); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.strokeRect(470, 520, 340, 24); ctx.strokeRect(470, 470, 340, 20);
  };
  SETS.party = (ctx, t, o) => {
    Pop.fill(ctx, '#2a0f2a'); Pop.sunburst(ctx, W / 2, 0, 30, ['#3a1240', '#2a0f2a'], t * 0.05);
    for (let i = 0; i < 9; i++) { const x = 80 + i * 140, y = 120 + Math.sin(t * 1.5 + i) * 10; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + 50); ctx.lineTo(x + 10, y + 160); ctx.stroke(); ctx.beginPath(); ctx.ellipse(x, y, 40, 50, 0, 0, 7); ctx.fillStyle = [P.pink, P.gold, P.white, P.hot][i % 4]; ctx.fill(); ctx.lineWidth = 3; ctx.stroke(); }
    Pop.label(ctx, 'HAPPY 25TH NANA', W / 2, 60, { fam: 'fat', size: 44, bg: P.gold, fill: P.ink, rot: -0.02, seed: 4 });
    // fireplace on the right
    Pop.card(ctx, 920, 300, 300, 240, { seed: 5, fill: '#7a2a20', border: 0, inner: (c, w, h) => { c.fillStyle = '#100404'; c.fillRect(40, 60, w - 80, h - 60); } });
    C.flames(ctx, 1070, 540, 0.45 + (o.fire || 0), t);
    floor(ctx, 540, '#3a1a3a', 'rgba(255,200,80,0.2)');
    for (let i = 0; i < 30; i++) { ctx.fillStyle = [P.gold, P.pink, P.white][i % 3]; ctx.fillRect(hash(i) * W, (hash(i * 7) * 700 + t * 60 * (0.5 + hash(i))) % 700, 6, 10); }
  };
  SETS.bookshop = (ctx, t, o) => {
    Pop.fill(ctx, '#e9d9b8');
    for (let r = 0; r < 4; r++) { ctx.fillStyle = '#7a5a3a'; ctx.fillRect(0, 150 + r * 110, W, 16); for (let i = 0; i < 60; i++) { const w = 14 + hash(i + r * 9) * 14, h = 60 + hash(i * 3 + r) * 40; const x = i * 22; ctx.fillStyle = [P.red, P.blue, P.teal, P.yellow, P.purple, '#5a3a22', P.orange][(i * 3 + r) % 7]; ctx.fillRect(x, 150 + r * 110 - h, w, h); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.strokeRect(x, 150 + r * 110 - h, w, h); } }
    Pop.label(ctx, 'ISHIDA BOOKS · USED & LOVED', W / 2, 40, { fam: 'fat', size: 34, bg: P.teal, fill: P.white, seed: 3 });
    floor(ctx, 560, '#a0662e', 'rgba(0,0,0,0.25)');
    Pop.card(ctx, 760, 520, 420, 90, { seed: 3, fill: '#8a5a32', border: 0 });
  };
  SETS.rooftop = (ctx, t, o) => {
    Pop.fill(ctx, '#121a36');
    for (let i = 0; i < 120; i++) { const tw = 0.5 + 0.5 * Math.sin(t * 3 + i); ctx.fillStyle = `rgba(255,250,220,${tw})`; ctx.fillRect(hash(i) * W, hash(i * 5) * 380, 2.5, 2.5); }
    ctx.fillStyle = P.white; ctx.beginPath(); ctx.arc(1060, 110, 46, 0, 7); ctx.fill(); ctx.fillStyle = '#121a36'; ctx.beginPath(); ctx.arc(1080, 98, 40, 0, 7); ctx.fill();
    Pop.skyline(ctx, 520, t, 41, 0.7, { body: '#3a4560', lit: P.yellow, shadow: false });
    floor(ctx, 520, '#5a6070', 'rgba(0,0,0,0.25)');
    ctx.strokeStyle = '#d0d0d0'; ctx.lineWidth = 4; for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 430); ctx.lineTo(x, 520); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(0, 430); ctx.lineTo(W, 430); ctx.stroke();
    // Kobayashi's vegetable boxes
    for (let i = 0; i < 3; i++) { Pop.card(ctx, 40 + i * 130, 560, 110, 60, { seed: 30 + i, fill: '#7a5a3a', border: 0 }); for (let k = 0; k < 3; k++) { ctx.fillStyle = '#4fa34a'; ctx.beginPath(); ctx.arc(65 + i * 130 + k * 30, 555, 14, 0, 7); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke(); } }
  };
  SETS.cafe = (ctx, t, o) => {
    Pop.fill(ctx, P.cream); Pop.stripes(ctx, ['#ffe9c2', '#fff3dc'], 40, 0, 0);
    Pop.card(ctx, 100, 60, 380, 240, { seed: 7, fill: P.sky, inner: (c, w, h) => Pop.skyline(c, h + 40, 0, 51, 0.5, { shadow: false }) });
    Pop.label(ctx, 'CAFÉ POCHI', 900, 120, { fam: 'fat', size: 56, bg: P.red, fill: P.white, rot: -0.03, seed: 2 });
    Pop.checker(ctx, 520, [INK, P.white], 0, 0, 60);
    for (const x of [300, 980]) { ctx.fillStyle = P.white; ctx.beginPath(); ctx.ellipse(x, 560, 130, 28, 0, 0, 7); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = INK; ctx.fillRect(x - 8, 586, 16, 120); }
  };
  SETS.den = (ctx, t, o) => {   // Ryuji's apartment: dark, screens of charts, gold
    Pop.fill(ctx, '#0d0d12'); Pop.halftoneWash(ctx, 'rgba(245,183,0,0.12)', 0, 0, W, H, 2.5, 10);
    for (let i = 0; i < 4; i++) { const x = 90 + i * 290; Pop.card(ctx, x, 80, 250, 160, { seed: 60 + i, fill: '#071a10', border: 6, edge: '#333', inner: (c, w, h) => { c.strokeStyle = i % 2 ? P.lime : P.red; c.lineWidth = 3; c.beginPath(); for (let k = 0; k <= 20; k++) { const v = h * (0.8 - 0.6 * hash(k + i * 20 + Math.floor(t * 2)) * (i % 2 ? k / 20 : 1 - k / 20)); k ? c.lineTo(k * w / 20, v) : c.moveTo(0, v); } c.stroke(); } }); }
    floor(ctx, 540, '#1b1b22', 'rgba(245,183,0,0.15)');
    Pop.card(ctx, 140, 470, 420, 110, { seed: 5, fill: '#2a2a33', border: 0 });
    ctx.save(); ctx.translate(1060, 470); ctx.fillStyle = P.gold; ctx.beginPath(); ctx.moveTo(-40, 70); ctx.lineTo(-30, -20); ctx.lineTo(30, -20); ctx.lineTo(40, 70); ctx.closePath(); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  };
  SETS.lighthouse = (ctx, t, o) => {
    Pop.sunburst(ctx, W / 2, 470, 26, o.sunset ? ['#ff6a3d', '#ffb347'] : [P.sky, '#a8ddff'], t * 0.05);
    if (o.sunset) { ctx.beginPath(); ctx.arc(W / 2, 470, 120, Math.PI, 0); ctx.fillStyle = P.yellow; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); }
    ctx.fillStyle = o.sunset ? '#b0406a' : '#2e6fb0'; ctx.fillRect(0, 470, W, 250);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; for (let i = 0; i < 12; i++) { const y = 490 + i * 20, off = (t * 30 + i * 40) % 120; ctx.beginPath(); for (let x = -120 + off; x < W; x += 120) { ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 30, y - 8, x + 60, y); } ctx.stroke(); }
    ctx.fillStyle = '#c9b48a'; ctx.beginPath(); ctx.ellipse(1000, 600, 420, 90, 0, 0, 7); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    C.lighthouse(ctx, 1080, 570, 0.95, t);
  };
  SETS.station = (ctx, t, o) => {
    Pop.fill(ctx, P.cream); Pop.halftoneWash(ctx, 'rgba(46,127,224,0.22)', 0, 0, W, H, 2.5, 10);
    Pop.card(ctx, 80, 120, 1120, 260, { seed: 8, fill: '#d0d6dc', border: 8, inner: (c, w, h) => { c.fillStyle = P.lime; c.fillRect(0, h - 60, w, 22); for (let i = 0; i < 6; i++) { c.fillStyle = '#8fd3ff'; c.fillRect(40 + i * 180, 40, 140, 100); c.lineWidth = 4; c.strokeStyle = INK; c.strokeRect(40 + i * 180, 40, 140, 100); } } });
    Pop.label(ctx, 'FERRY TERMINAL ← 3 MIN', 360, 70, { fam: 'RubikMono', size: 22, bg: P.blue, fill: P.white, seed: 6 });
    floor(ctx, 520, '#b8b2a8', 'rgba(0,0,0,0.2)'); ctx.fillStyle = P.yellow; ctx.fillRect(0, 528, W, 14);
  };
  SETS.chapel = (ctx, t, o) => {
    Pop.fill(ctx, '#fffaf0'); Pop.rings(ctx, W / 2, 200, ['#fffaf0', '#fbefe0'], t * 0.2, 50);
    ctx.save(); ctx.translate(W / 2, 520); ctx.lineWidth = 26; ctx.strokeStyle = '#f7c6d8'; ctx.beginPath(); ctx.arc(0, 0, 330, Math.PI, 0); ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 343, Math.PI, 0); ctx.arc(0, 0, 317, 0, Math.PI, true); ctx.stroke();
    for (let i = 0; i < 14; i++) { const a = Math.PI + i / 13 * Math.PI; ctx.fillStyle = [P.hot, P.white, P.pink][i % 3]; ctx.beginPath(); ctx.arc(Math.cos(a) * 330, Math.sin(a) * 330, 22, 0, 7); ctx.fill(); ctx.lineWidth = 2.5; ctx.stroke(); }
    ctx.restore();
    Pop.checker(ctx, 520, ['#f7c6d8', P.white], 0, 0, 70);
  };
  SETS.ferry = (ctx, t, o) => {
    Pop.sunburst(ctx, W / 2, 400, 26, o.sunset ? ['#ff6a3d', '#ffb347'] : [P.sky, '#a8ddff'], t * 0.05);
    ctx.fillStyle = o.sunset ? '#b0406a' : '#2e6fb0'; ctx.fillRect(0, 400, W, 320);
    ctx.fillStyle = P.white; ctx.fillRect(0, 470, W, 30); ctx.fillStyle = P.red; ctx.fillRect(0, 500, W, 220); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.strokeRect(-5, 470, W + 10, 260);
    ctx.strokeStyle = P.white; ctx.lineWidth = 6; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 470); ctx.lineTo(x, 400); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(0, 400); ctx.lineTo(W, 400); ctx.stroke();
  };
  SETS.lobby = (ctx, t, o) => {
    Pop.fill(ctx, '#f5e9d0'); Pop.stripes(ctx, ['#f5e9d0', '#efdfbf'], 30, 0, 0);
    for (const x of [200, 1080]) { ctx.fillStyle = P.gold; ctx.fillRect(x - 30, 60, 60, 460); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.strokeRect(x - 30, 60, 60, 460); }
    Pop.label(ctx, 'HOTEL KUROSAKI', W / 2, 90, { fam: 'fat', size: 56, bg: INK, fill: P.gold, seed: 8 });
    ctx.fillStyle = '#c4122f'; ctx.fillRect(500, 520, 280, 200);
    Pop.checker(ctx, 520, ['#2a2a33', '#f5e9d0'], 0, 0, 80);
    ctx.fillStyle = 'rgba(196,18,47,0.85)'; ctx.beginPath(); ctx.moveTo(560, 520); ctx.lineTo(720, 520); ctx.lineTo(900, H); ctx.lineTo(380, H); ctx.closePath(); ctx.fill();
  };
  SETS.blank = (ctx, t, o) => { Pop.fill(ctx, P.cream); Pop.halftoneWash(ctx, 'rgba(255,62,143,0.2)', 0, 0, W, H, 3, 12); };

  function drawSet(ctx, name, t, o) {
    (SETS[name] || SETS.blank)(ctx, t, o);
    if (o.night && !['rooftop', 'den', 'party'].includes(name)) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(70,80,150,0.55)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  }
  function rain(ctx, t) {
    ctx.save(); ctx.strokeStyle = 'rgba(220,240,255,0.7)'; ctx.lineWidth = 2;
    for (let i = 0; i < 140; i++) { const x = (hash(i) * 1500 + t * 300) % 1500 - 100, y = (hash(i * 7) * 800 + t * 900 * (0.8 + hash(i * 3) * 0.4)) % 800 - 40; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 28); ctx.stroke(); }
    ctx.restore();
  }

  // ───────────── close-up backgrounds by mood ─────────────
  function moodBg(ctx, expr, who, t, seed) {
    const col = (R[who] || R.haru).col;
    switch (expr) {
      case 'laugh': case 'smile': Pop.sunburst(ctx, W / 2, 330, 26, [col[0], P.white], t * 0.12); break;
      case 'wow': Pop.sunburst(ctx, W / 2, 330, 20, [P.yellow, INK], t * 0.3, 0.05); break;
      case 'angry': Pop.sunburst(ctx, W / 2, 330, 18, [P.red, INK], -t * 0.3, 0.07); break;
      case 'sad': Pop.rings(ctx, W / 2, 330, ['#9fc2e8', '#c9dcf2'], t * 0.3, 54); break;
      case 'swoon': Pop.rings(ctx, W / 2, 330, [P.pink, '#ffd1e3'], t * 1.2, 40); break;
      case 'smirk': Pop.spiral(ctx, W / 2, 330, [col[0], col[1] === P.ink ? '#3a1a1a' : col[1]], t * 0.4, 12, 2); break;
      case 'serious': Pop.fill(ctx, P.cream); Pop.halftoneWash(ctx, 'rgba(46,127,224,0.32)', 0, 0, W, H, 3.2, 12); break;
      default: Pop.stripes(ctx, [col[0], P.paper], 60, 0.5 + (seed % 3) * 0.3, t * 20);
    }
  }

  // ───────────── inserts ─────────────
  function insert(ctx, kind, text, t, k) {
    Pop.sunburst(ctx, W / 2, H / 2, 24, [P.paper, '#f3e2c0'], t * 0.1);
    const s = ease.back(clamp(k * 3));
    ctx.save(); ctx.translate(W / 2, H / 2 - 20); ctx.scale(s, s); ctx.translate(-W / 2, -(H / 2 - 20));
    switch (kind) {
      case 'phone': C.phone(ctx, W / 2, 340, 2.3, { screen: '#24365f', text: (text || '').replace(/\\n/g, '\n'), textSize: 26 }); break;
      case 'cactus': C.cactus(ctx, W / 2, 400, 3.0); break;
      case 'briefcase': C.briefcase(ctx, W / 2, 380, 1.8, 1); break;
      case 'umbrella': C.umbrella(ctx, W / 2, 330, 1.7, 0.1); break;
      case 'goat': C.goat(ctx, W / 2 - 60, 420, 1.8, t); break;
      case 'lighthouse': SETS.lighthouse(ctx, t, { sunset: true }); break;
      case 'books': C.books(ctx, W / 2, 600, 1.6, 12, 4); break;
      case 'photo': Pop.card(ctx, 380, 90, 520, 520, { seed: 9, fill: P.white, rot: -0.04, inner: (c, w, h) => { c.fillStyle = '#8fd3ff'; c.fillRect(20, 20, w - 40, h - 110); c.save(); c.beginPath(); c.rect(20, 20, w - 40, h - 110); c.clip(); c.fillStyle = '#2e6fb0'; c.fillRect(20, h - 170, w, 90); C.lighthouse(c, w * 0.72, h - 150, 0.95, t); C.grandma(c, w * 0.3, h - 250, 0.55, { t }); C.haru(c, w * 0.5, h - 160, 0.3, { t, expr: 'smile' }); c.restore(); c.fillStyle = INK; c.font = '30px Marker'; c.textAlign = 'center'; c.fillText(text || 'Grandma & me', w / 2, h - 40); } }); break;
      case 'letter': case 'receipt': case 'ticket': case 'sign': case 'book': case 'clock': {
        const dims = { letter: [700, 420, P.paper], receipt: [360, 480, P.white], ticket: [640, 260, P.yellow], sign: [800, 300, P.red], book: [460, 560, P.teal], clock: [460, 460, P.white] }[kind];
        Pop.card(ctx, W / 2 - dims[0] / 2, 330 - dims[1] / 2, dims[0], dims[1], { seed: 12, fill: dims[2], rot: -0.03, inner: (c, w, h) => {
          c.fillStyle = kind === 'sign' ? P.white : INK; c.textAlign = 'center'; c.textBaseline = 'middle';
          const lines = (text || '').split('\\n'); const fs = kind === 'letter' ? 34 : kind === 'sign' ? 64 : 40;
          c.font = `${fs}px ${kind === 'letter' ? 'Marker' : kind === 'receipt' ? 'RubikMono' : kind === 'book' ? 'Abril' : 'Anton'}`;
          if (kind === 'book') { c.fillStyle = P.paper; }
          if (kind === 'clock') { c.beginPath(); c.arc(w / 2, h / 2, 180, 0, 7); c.lineWidth = 8; c.strokeStyle = INK; c.stroke(); c.font = '70px Anton'; }
          lines.forEach((l, i) => c.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * fs * 1.3));
        } });
        break;
      }
      case 'keychain': ctx.save(); ctx.translate(W / 2, 330); ctx.scale(1.4, 1.4); ctx.beginPath(); ctx.arc(0, -150, 30, 0, 7); ctx.lineWidth = 8; ctx.strokeStyle = '#aaa'; ctx.stroke(); C.lighthouse(ctx, 0, 120, 0.8, t); ctx.restore(); break;
      case 'medallion': ctx.beginPath(); ctx.arc(W / 2, 330, 160, 0, 7); ctx.fillStyle = P.gold; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); Pop.word(ctx, '¥', W / 2, 340, { fam: 'anton', size: 200, fill: INK, ext: null }); break;
      case 'cake': ctx.save(); ctx.translate(W / 2, 420); Pop.card(ctx, -260, -120, 520, 200, { seed: 4, fill: P.pink, border: 0 }); Pop.card(ctx, -180, -260, 360, 150, { seed: 5, fill: P.white, border: 0 }); for (let i = 0; i < 5; i++) { ctx.fillStyle = P.yellow; ctx.fillRect(-120 + i * 60, -320, 14, 60); C.flames(ctx, -113 + i * 60, -320, 0.08, t, 3); } ctx.restore(); Pop.word(ctx, '25', W / 2, 420, { size: 120, fill: P.white, ext: P.hot }); break;
      default: Pop.word(ctx, (text || kind).toUpperCase(), W / 2, 330, { size: 120 });
    }
    ctx.restore();
  }

  // ───────────── shots ─────────────
  function defaultX(n, i) { return n === 1 ? 640 : n === 2 ? [420, 860][i] : 200 + i * (880 / (n - 1)); }
  function placed(sh) {
    const ks = Object.keys(sh.place || {});
    return ks.map((k, i) => { const p = sh.place[k]; return { who: k, x: p.x !== undefined ? p.x : defaultX(ks.length, i), p }; });
  }
  function autoLook(me, all) {
    if (me.p.look) return lookVec(me.p.look);
    const others = all.filter(o => o.who !== me.who); if (!others.length) return [0, 0];
    const near = others.reduce((a, b) => Math.abs(a.x - me.x) < Math.abs(b.x - me.x) ? a : b);
    return [near.x > me.x ? 0.8 : -0.8, 0];
  }
  function actXform(ctx, act, k, t, cx, cy) {
    if (!act) return;
    if (act === 'bounce') ctx.translate(0, -Math.abs(Math.sin(t * 9)) * 22);
    if (act === 'shake') ctx.translate(jit(t, 5, 6), jit(t, 9, 3));
    if (act === 'nod') ctx.translate(0, Math.max(0, Math.sin(t * 8)) * 10);
    if (act === 'lean') { ctx.translate(cx, cy + 300); ctx.rotate(0.08); ctx.translate(-cx, -cy - 300); }
    if (act === 'faint') { const f = ease.inout(clamp((k - 0.6) / 0.3)); ctx.translate(cx, cy + 640 * f * f); ctx.rotate(-1.4 * f); ctx.translate(-cx, -cy); }
    if (act === 'swoon') { ctx.translate(cx, cy + 300); ctx.rotate(Math.sin(t * 3) * 0.1); ctx.translate(-cx, -cy - 300); }
  }
  function stFor(S, who, p, extra) {
    const r = R[who] || {};
    return Object.assign({ t: S.T + (who.length * 0.37), mouth: S.m(who), expr: (p && p.expr) || r.expr || 'smile' }, extra);
  }

  function drawShot(ctx, sh, S, segOpts) {
    const shot = sh.shot || 'wide', [kind, arg, arg2] = shot.split(':');
    const k = S.t / Math.max(0.01, sh.dur);
    const setO = { night: segOpts.time === 'night', sunset: segOpts.time === 'sunset', rain: segOpts.weather === 'rain', sign: segOpts.sign, fire: segOpts.fire ? Number(segOpts.fire) : 0, autumn: segOpts.season === 'autumn' };
    const all = placed(sh);
    const speaker = sh.who, act = sh.o && sh.o.act;
    if (kind === 'wide' || kind === 'ext' || kind === 'two' || kind === 'mcu') {
      ctx.save();
      const z = kind === 'two' ? 1.12 : kind === 'mcu' ? 1.3 : 1.0;
      const focus = kind === 'mcu' ? (all.find(a => a.who === arg) || { x: 640 }).x : 640;
      const zz = z * (1 + 0.03 * ease.inout(k));
      ctx.translate(focus, 400); ctx.scale(zz, zz); ctx.translate(-(kind === 'mcu' ? lerp(640, focus, 0.6) : 640), -400);
      drawSet(ctx, segOpts.set, S.T, setO);
      ctx.restore();
      if (kind !== 'ext') {
        // props
        for (const pr of (sh.props || [])) drawProp(ctx, pr, S.T);
        const list = kind === 'mcu' ? all.filter(a => a.who === arg) : all;
        list.sort((a, b) => (a.p.z || 0) - (b.p.z || 0));
        for (const a of list) {
          const st = stFor(S, a.who, a.p, { look: autoLook(a, all) });
          if (a.who === speaker && sh.o.expr) st.expr = sh.o.expr;
          ctx.save();
          const sc = a.p.s || 1;
          if (kind === 'wide') {
            const y = 300 + (a.p.y || 0) + (R[a.who] && R[a.who].kid ? 75 : 0);
            if (a.who === speaker) actXform(ctx, act, k, S.t, a.x, y);
            const walk = a.p.walk ? S.t * 9 : 0, wx = a.p.walk ? lerp(a.p.walk === 'left' ? 1450 : -170, a.x, ease.out(clamp(S.t / 1.4))) : a.x;
            figure(ctx, a.who, wx, y, 0.42 * sc, st, a.p.walk && S.t < 1.4 ? walk : 0);
          } else {
            const s0 = (kind === 'mcu' ? 1.0 : 0.8) * sc * (R[a.who] && R[a.who].kid ? 0.82 : 1);
            const x = kind === 'mcu' ? 640 + (a.x - 640) * 0.35 : a.x, y = (kind === 'mcu' ? 320 : 345) + (a.p.y || 0) + (R[a.who] && R[a.who].kid ? 60 : 0);
            if (a.who === speaker) actXform(ctx, act, k, S.t, x, y);
            (R[a.who] || R.haru).draw(ctx, x, y, s0, st);
          }
          ctx.restore();
        }
      }
      if (setO.rain) rain(ctx, S.T);
    } else if (kind === 'close') {
      const who = arg || speaker || 'haru';
      const p = (sh.place || {})[who] || {};
      const st = stFor(S, who, p, {});
      if (who === speaker && sh.o.expr) st.expr = sh.o.expr;
      const other = all.find(a => a.who !== who); const me = all.find(a => a.who === who);
      st.look = p.look ? lookVec(p.look) : (other && me ? [other.x > me.x ? 0.55 : -0.55, 0] : [0, 0]);
      if (sh.o.look) st.look = lookVec(sh.o.look);
      ctx.save(); const z = 1 + 0.04 * ease.inout(k); ctx.translate(640, 360); ctx.scale(z, z); ctx.translate(-640, -360);
      moodBg(ctx, st.expr, who, S.T, sh.start * 10 | 0);
      if (who === 'friends') {
        FRIENDS4.forEach((f, i) => { const x = 200 + i * 293; Pop.card(ctx, x - 125, 140, 250, 400, { seed: 40 + i, fill: [P.blue, P.pink, P.lime, P.purple][i], rot: (i % 2 ? 0.04 : -0.04), inner: (c, w, h) => C.friend(c, i, w / 2, h * 0.4, 0.85, { t: S.T + i, mouth: S.m('friends') * (0.5 + hash(i) * 0.5), expr: st.expr === 'smirk' ? 'smirk' : st.expr }) }); });
      } else if (who !== 'narr') {
        ctx.save(); actXform(ctx, sh.o.act, k, S.t, 640, 320);
        (R[who] || R.haru).draw(ctx, 640, 320, R[who] && R[who].kid ? 0.95 : 1.05, st);
        ctx.restore();
      }
      ctx.restore();
      if (sh.o.phone) { C.phone(ctx, 960, 470, 0.8, { rot: 0.25, screen: P.hot }); Pop.label(ctx, 'ON THE PHONE', 1080, 640, { fam: 'RubikMono', size: 20, bg: INK, fill: P.yellow, seed: 3 }); }
      if (setO.rain) rain(ctx, S.T);
    } else if (kind === 'insert') {
      insert(ctx, arg, arg2 !== undefined ? shot.split(':').slice(2).join(':') : sh.o.text, S.T, S.t);
    }
    if (sh.o && sh.o.memory) { ctx.save(); ctx.globalCompositeOperation = 'color'; ctx.fillStyle = 'rgba(190,140,90,0.75)'; ctx.fillRect(0, 0, W, H); ctx.restore(); ctx.save(); ctx.strokeStyle = P.white; ctx.lineWidth = 40; ctx.strokeRect(0, 0, W, H); ctx.restore(); }
    // kinetic words
    (sh.words || []).forEach((w, i) => {
      const t0 = w.t, sc = popAt(S.t, t0), seed = Math.floor(sh.start * 7) + i;
      const x = 640 + (hash(seed) - 0.5) * 520, y = 105 + i * 95, rot = (hash(seed * 3) - 0.5) * 0.18;
      const style = w.style || ['comic', 'label', 'comic', 'ransom', 'label'][seed % 5];
      if (style === 'ransom') Pop.ransom(ctx, w.text, 640, y, { size: 74, t: S.t, t0, seed });
      else if (style === 'label') Pop.label(ctx, w.text, x, y, { fam: ['fat', 'anton', 'marker'][seed % 3], size: 54, bg: [P.paper, P.yellow, P.ink, P.pink][seed % 4], fill: [P.red, P.ink, P.yellow, P.white][seed % 4], sc, rot, seed });
      else if (style === 'stamp') { if (S.t > t0) C.stamp(ctx, w.text, x, y + 80, 1.4 - 0.4 * ease.out((S.t - t0) / 0.12), rot); }
      else Pop.word(ctx, w.text, x, y, { size: 96, fill: [P.yellow, P.white, P.lime, P.pink][seed % 4], ext: [P.red, P.hot, P.blue, INK][seed % 4], sc, rot });
    });
  }

  function drawProp(ctx, pr, t) {
    const x = pr.x || 640, y = pr.y || 560, s = pr.s || 1;
    switch (pr.name) {
      case 'cactus': C.cactus(ctx, x, y, s); break;
      case 'books': C.books(ctx, x, y, s, 8, 3); break;
      case 'goat': C.goat(ctx, x, y, s, t); break;
      case 'briefcase': C.briefcase(ctx, x, y, s, pr.open ? 1 : 0); break;
      case 'umbrella': C.umbrella(ctx, x, y, s, pr.rot || 0); break;
      case 'phone': C.phone(ctx, x, y, s, { screen: P.hot }); break;
      case 'flames': C.flames(ctx, x, y, s, t); break;
      case 'cake': Pop.card(ctx, x - 90 * s, y - 60 * s, 180 * s, 90 * s, { seed: 3, fill: P.pink, border: 0 }); break;
      case 'heart': Pop.heart(ctx, x, y, s, P.hot); break;
      case 'desk': Pop.card(ctx, x - 220 * s, y, 440 * s, 200, { seed: 3, fill: '#7a5a3a', border: 0 }); break;
      case 'table': ctx.fillStyle = P.white; ctx.beginPath(); ctx.ellipse(x, y, 150 * s, 30 * s, 0, 0, 7); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); break;
      case 'cup': ctx.fillStyle = P.white; ctx.fillRect(x - 18 * s, y - 40 * s, 36 * s, 40 * s); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.strokeRect(x - 18 * s, y - 40 * s, 36 * s, 40 * s); break;
      case 'money': for (let i = 0; i < 6; i++) C.banknote(ctx, x + (hash(i) - 0.5) * 300, y - ((t * 120 + i * 90) % 500), 0.7 * s, t * 3 + i); break;
      case 'sign': Pop.label(ctx, pr.text || 'SIGN', x, y, { size: 40 * s, bg: P.yellow, fill: INK, seed: 4 }); break;
    }
  }

  // ───────────── OP / title / card / ED ─────────────
  function op(ctx, t, S) {
    const parts = [3.5, 7.5, 11.5, 15, 18.5, 22, 26, 30];
    const i = parts.findIndex(p => t < p), t0 = i ? parts[i - 1] : 0, lt = t - t0;
    const tag = (txt, sub, x, y, c1, c2) => { Pop.label(ctx, txt, x, y, { fam: 'fat', size: 58, bg: c1, fill: c2, sc: popAt(lt, 0.2), rot: -0.05, seed: i }); if (sub) Pop.label(ctx, sub, x, y + 70, { fam: 'RubikMono', size: 22, bg: INK, fill: P.yellow, sc: popAt(lt, 0.5), rot: 0.03, seed: i + 3 }); };
    if (i === 0) { Pop.spiral(ctx, W / 2, H / 2, [P.hot, P.yellow], t * 0.6, 14, 2.2); Pop.ransom(ctx, 'BEAUTIFUL', W / 2, 260, { size: 100, t, t0: 0.3, per: 0.08, seed: 7 }); Pop.word(ctx, 'IDIOT', W / 2, 440, { size: 230, fill: P.yellow, ext: P.red, depth: 16, sc: popAt(t, 1.9, 0.3) }); }
    else if (i === 1) { Pop.sunburst(ctx, W / 2, 330, 26, [P.yellow, P.lime], t * 0.2); C.haru(ctx, 640, 320, 1.0, { t, expr: lt > 2 ? 'laugh' : 'smile' }); C.cactus(ctx, 990, 560, 1.1); tag('HARU MISHIMA', '30 · UNEMPLOYED · HAPPY', 270, 140, P.paper, P.ink); }
    else if (i === 2) { Pop.spiral(ctx, W / 2, 330, [P.pink, P.hot], t * 0.5, 12, 2); C.nana(ctx, 640, 320, 1.0, { t, expr: 'smirk', look: [0.6, 0] }); tag('NANA KUROSAKI', '25 · HEIRESS · BORED', 1010, 140, P.paper, P.red); }
    else if (i === 3) { Pop.sunburst(ctx, W / 2, H / 2, 32, [P.yellow, P.pink, P.blue, P.pink], t * 0.2); FRIENDS4.forEach((f, j) => { const k2 = popAt(lt, 0.1 + j * 0.15); if (!k2) return; ctx.save(); ctx.translate(200 + j * 293, 330); ctx.scale(k2, k2); Pop.card(ctx, -125, -190, 250, 380, { seed: 40 + j, fill: [P.blue, P.pink, P.lime, P.purple][j], rot: (j % 2 ? 0.05 : -0.05), inner: (c, w, h) => C.friend(c, j, w / 2, h * 0.42, 0.85, { t: t + j, expr: 'smile' }) }); ctx.restore(); Pop.label(ctx, f.toUpperCase(), 200 + j * 293, 560, { fam: 'anton', size: 40, bg: INK, fill: P.white, sc: k2, seed: j }); }); tag('THE GLITTER FOUR', null, 640, 70, P.gold, P.ink); }
    else if (i === 4) { Pop.sunburst(ctx, W / 2, 330, 18, [P.red, INK], t * 0.3, 0.07); C.ryuji(ctx, 640, 320, 1.0, {}); C.briefcase(ctx, 1030, 560, 0.6, 1); tag('RYUJI GOZEN', 'CRYPTO KING', 270, 140, P.gold, P.ink); }
    else if (i === 5) { SETS.bookshop(ctx, t, {}); R.aya.draw(ctx, 330, 340, 0.85, { t, expr: 'smirk', look: [0.6, 0] }); R.kobayashi.draw(ctx, 760, 350, 0.75, { t, expr: 'smile', look: [-0.5, 0] }); R.kenta.draw(ctx, 1040, 420, 0.62, { t, expr: 'smirk', look: [-0.6, 0] }); tag('AYA · MR. KOBAYASHI · KENTA', null, 640, 640, P.paper, P.ink); }
    else if (i === 6) { SETS.crossing(ctx, t, {}); const kk = clamp(lt / 3); figure(ctx, 'haru', lerp(-200, 560, ease.inout(kk)), 300, 0.48, { t, expr: 'smile', look: [1, 0] }, t * 9); figure(ctx, 'nana', lerp(1480, 740, ease.inout(kk)), 300, 0.48, { t, expr: 'neutral', look: [0, 1] }, t * 10); if (lt > 3) { Pop.burst(ctx, 650, 300, 230 * ease.back((lt - 3) / 0.25), P.yellow, { n: 16 }); Pop.word(ctx, 'CRASH!', 650, 300, { size: 130, fill: P.red, ext: INK, stroke: P.white, sc: popAt(lt, 3, 0.25) }); } }
    else { Pop.spiral(ctx, W / 2, H / 2, [P.hot, P.yellow, P.pink, P.yellow], t * 0.35, 16, 2.2); Pop.ransom(ctx, 'BEAUTIFUL', W / 2, 250, { size: 108, t: 99, seed: 7 }); Pop.word(ctx, 'IDIOT', W / 2, 430, { size: 250, fill: P.yellow, ext: P.red, depth: 18, sc: popAt(lt, 0.1, 0.35), rot: -0.04 }); Pop.label(ctx, "loosely after Dostoevsky's THE IDIOT", W / 2, 590, { fam: 'serif', size: 26, bg: P.paper, fill: INK, sc: popAt(lt, 0.6) }); }
  }
  function titleCard(ctx, t, meta) {
    Pop.stripes(ctx, [P.yellow, P.paper], 70, -0.5, t * 40);
    Pop.ransom(ctx, 'EPISODE ' + (meta.episode || ''), W / 2, 210, { size: 70, t, t0: 0.1, per: 0.05, seed: Number(meta.episode || 1) });
    const title = (meta.title || '').toUpperCase(); const size = Math.min(150, 1900 / Math.max(6, title.length));
    Pop.word(ctx, title, W / 2, 400, { size, fill: P.hot, ext: INK, stroke: INK, depth: 12, sc: popAt(t, 0.7, 0.35), rot: -0.03 });
    if (meta.sub) Pop.label(ctx, meta.sub, W / 2, 540, { fam: 'serif', size: 28, bg: P.paper, fill: INK, sc: popAt(t, 1.3) });
  }
  function card(ctx, t, o) {
    Pop.checker(ctx, -800, [P.ink, P.white], t, 0.3, 100); Pop.fill(ctx, 'rgba(0,0,0,0)');
    Pop.stripes(ctx, [o.c1 || P.blue, o.c2 || P.sky], 80, 0.7, t * 80);
    Pop.ransom(ctx, (o.text || '').toUpperCase(), W / 2, 330, { size: 84, t, t0: 0.1, per: 0.04, seed: (o.text || '').length });
    if (o.sub) Pop.label(ctx, o.sub, W / 2, 470, { fam: 'marker', size: 34, bg: P.paper, fill: INK, sc: popAt(t, 0.6), seed: 3 });
  }
  function ed(ctx, t, d, meta, S) {
    Pop.fill(ctx, P.cream); Pop.halftoneWash(ctx, 'rgba(255,62,143,0.22)', 0, 0, W, H, 3, 12);
    const credits = ['BEAUTIFUL IDIOT', '', 'Episode ' + (meta.episode || '') + ': ' + (meta.title || ''), '', 'Loosely adapted from', "Fyodor Dostoevsky's THE IDIOT (1869)", '', 'Original story, characters,', 'designs and music', '', 'Voices: Kokoro', 'Lev the cactus as himself', '', 'Thank you for watching!'];
    ctx.save(); ctx.beginPath(); ctx.rect(60, 40, 600, 540); ctx.clip();
    const y0 = 560 - t * 24;
    credits.forEach((c, i) => { if (!c) return; const big = i === 0; ctx.font = big ? '56px Bangers' : '28px "DejaVu Serif"'; ctx.fillStyle = big ? P.hot : INK; ctx.textAlign = 'center'; ctx.fillText(c, 360, y0 + i * 46); });
    ctx.restore();
    Pop.card(ctx, 760, 210, 210, 260, { seed: 81, fill: P.blue, rot: -0.06, inner: (c, w, h) => C.haru(c, w / 2, h * 0.45, 0.66, { t, expr: S.m('haru') ? 'smile' : 'smile', look: [1, 0], mouth: S.m('haru') }) });
    Pop.card(ctx, 1010, 230, 210, 260, { seed: 82, fill: P.lime, rot: 0.06, inner: (c, w, h) => C.nana(c, w / 2, h * 0.45, 0.66, { t, expr: 'smirk', look: [-1, 0], mouth: S.m('nana') }) });
    C.cactus(ctx, 1190, 560, 0.7);
    if (meta.next) { Pop.label(ctx, 'NEXT TIME', 990, 70, { fam: 'RubikMono', size: 30, bg: INK, fill: P.yellow, sc: popAt(t, 2.0), seed: 2 }); Pop.label(ctx, meta.next, 990, 140, { fam: 'fat', size: 34, bg: P.paper, fill: P.red, sc: popAt(t, 2.4), seed: 5 }); }
    const fo = clamp((t - (d - 1.2)) / 1.2); if (fo > 0) { ctx.fillStyle = `rgba(10,6,6,${fo})`; ctx.fillRect(0, 0, W, H); }
  }

  // ───────────── driver ─────────────
  function draw(ctx, tl, T) {
    T = Math.max(0, Math.min(tl.total - 1e-3, T));
    const seg = tl.segs.find(s => T >= s.start && T < s.start + s.dur) || tl.segs[tl.segs.length - 1];
    const segIdx = tl.segs.indexOf(seg);
    const S = {
      T, t: T - seg.start,
      m: who => {
        for (const l of tl.lines) if (l.who === who && T >= l.start && T < l.start + l.dur) {
          const x = (T - l.start) * 30, i = Math.floor(x), e = l.env; const v = ((e[i] || 0) + (e[i + 1] || 0)) / 2; return v > 0.12 ? Math.min(1, v * 1.1) : 0;
        }
        return 0;
      }
    };
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
    if (seg.kind === 'op') op(ctx, S.t, S);
    else if (seg.kind === 'title') titleCard(ctx, S.t, tl.meta);
    else if (seg.kind === 'card') card(ctx, S.t, seg.opts);
    else if (seg.kind === 'ed') ed(ctx, S.t, seg.dur, tl.meta, S);
    else {
      const sh = tl.shots.filter(s => s.seg === segIdx).find(s => T >= s.start && T < s.start + s.dur) || tl.shots.filter(s => s.seg === segIdx)[0];
      if (sh) drawShot(ctx, sh, Object.assign({}, S, { t: T - sh.start }), seg.opts);
    }
    ctx.restore();
    Pop.finish(ctx, T);
    const cur = tl.lines.find(l => T >= l.start - 0.05 && T < l.start + l.dur + 0.3);
    if (cur) {
      const txt = cur.text.replace(/\*[^*]*\*/g, '').trim();
      const name = cur.who === 'narr' ? '' : ((tl.names && tl.names[cur.who]) || cur.who).toUpperCase() + ': ';
      Pop.subtitle(ctx, (cur.flags || []).includes('thought') ? `(${txt})` : name + txt, cur.who, T - cur.start + 0.05);
    }
  }
  window.Episode = { draw, R, SETS };
})();
