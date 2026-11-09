// Shot-by-shot staging for "Beautiful Idiot". Each scene gets (ctx, S):
//   S.t local time, S.d shot length, S.T global time, S.at(i, frac) = local time of a point in line i,
//   S.L(i) = {s, e, d} of line i, S.m(who) = mouth opening of who (0 when silent), S.k = t/d.
(function () {
  const { W, H, P, ease, clamp, lerp, two, jit, popAt, hash } = Pop;
  const C = Cast;

  function cam(ctx, S, z0 = 1, z1 = 1.06, cx = W / 2, cy = H / 2) {
    const z = lerp(z0, z1, ease.inout(S.k));
    ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy);
  }
  function shake(ctx, S, t0, amt = 14, len = 0.35) {
    const k = (S.t - t0) / len; if (k < 0 || k > 1) return;
    ctx.translate(jit(S.t, 3, amt * (1 - k)), jit(S.t, 7, amt * (1 - k)));
  }
  const pa = (S, t0, len) => popAt(S.t, t0, len);
  const st = (S, who, o = {}) => Object.assign({ t: S.T, mouth: S.m(who) }, o);

  const SC = {};

  // 1 ── This city has fourteen million people.
  SC.cold_city = (ctx, S) => {
    Pop.fill(ctx, P.cream);
    ctx.save(); cam(ctx, S, 1.0, 1.08, W / 2, H * 0.7);
    Pop.halftoneWash(ctx, 'rgba(46,127,224,0.35)', 0, 0, W, 420, 3.4, 11);
    // sun
    ctx.beginPath(); ctx.arc(980, 170, 90, 0, 7); ctx.fillStyle = P.pink; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = P.ink; ctx.stroke();
    Pop.skyline(ctx, 560, S.t, 3, 1.0, { rise: two(S.t) * 1.4 + 0.3 });
    Pop.skyline(ctx, 760, S.t, 8, 1.3, { rise: two(S.t) * 1.4, body: '#c9c2b4' });
    ctx.restore();
    const a = S.at(0, 0.45);
    Pop.word(ctx, '14,000,000', W / 2, 300, { fam: 'anton', size: 170, fill: P.yellow, ext: P.red, depth: 12, sc: pa(S, a), rot: -0.04 });
    Pop.label(ctx, 'PEOPLE', W / 2 + 260, 410, { size: 54, bg: P.pink, fill: P.white, sc: pa(S, S.at(0, 0.82)), rot: 0.06 });
  };

  // 2 ── And exactly one idiot.
  SC.one_idiot = (ctx, S) => {
    const boom = S.at(0, 0.72);
    if (S.t < boom) {
      Pop.fill(ctx, P.cream);
      Pop.halftoneWash(ctx, 'rgba(255,62,143,0.35)', 0, 0, W, H, 3, 12);
      Pop.label(ctx, 'AND EXACTLY', W / 2, 250, { size: 60, sc: pa(S, 0.1), rot: -0.03 });
      Pop.ransom(ctx, 'ONE', W / 2, 400, { size: 110, t: S.t, t0: S.at(0, 0.4), seed: 2 });
    } else {
      ctx.save(); shake(ctx, S, boom, 20);
      Pop.sunburst(ctx, W / 2, H / 2, 24, [P.yellow, P.ink], S.t * 0.4, 0.04);
      Pop.ransom(ctx, 'ONE', W / 2, 150, { size: 80, t: 99, seed: 2 });
      Pop.word(ctx, 'IDIOT', W / 2, 400, { size: 300, fill: P.red, ext: P.ink, stroke: P.white, depth: 14, sc: pa(S, boom, 0.3), rot: -0.05 });
      ctx.restore();
    }
  };

  // 3 ── Haru: Oh! Hello! Lovely weather. Is it Tuesday?
  SC.haru_intro = (ctx, S) => {
    Pop.sunburst(ctx, W / 2, 330, 28, [P.yellow, P.pink], S.t * 0.15);
    Pop.halftoneWash(ctx, 'rgba(255,255,255,0.35)', 0, 0, W, H, 3, 10);
    ctx.save(); cam(ctx, S, 1.0, 1.05, W / 2, 300);
    const rise = ease.back(clamp(S.t / 0.4));
    C.haru(ctx, W / 2, 300 + (1 - rise) * 400, 1.0, st(S, 'haru', { expr: S.t < 0.8 ? 'wow' : 'smile', look: [0, 0] }));
    ctx.restore();
    Pop.label(ctx, 'HARU MISHIMA', 250, 140, { size: 64, bg: P.paper, fill: P.ink, sc: pa(S, 0.3), rot: -0.08 });
    Pop.label(ctx, 'AGE 30', 230, 225, { size: 46, bg: P.red, fill: P.white, sc: pa(S, 0.6), rot: 0.05, seed: 8 });
    Pop.word(ctx, 'TUESDAY?', 1010, 560, { size: 92, fill: P.lime, ext: P.blue, sc: pa(S, S.at(0, 0.72)), rot: 0.1 });
    C.cactus(ctx, 1040, 300, 1.0, { rot: Math.sin(S.T * 2) * 0.05 });
  };

  // 4 ── No job. No girlfriend. Ever. No money. And somehow, the happiest man in Tokyo.
  SC.haru_list = (ctx, S) => {
    Pop.fill(ctx, P.blue);
    Pop.stripes(ctx, ['#2e7fe0', '#2a72cc'], 40, 0.6, S.t * 30);
    // notebook page
    Pop.card(ctx, 70, 70, 560, 580, { seed: 4, fill: P.paper, rot: -0.03, inner: (c, w, h) => {
      c.strokeStyle = 'rgba(46,127,224,0.4)'; c.lineWidth = 2; for (let y = 60; y < h; y += 46) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
      c.strokeStyle = 'rgba(229,50,42,0.5)'; c.beginPath(); c.moveTo(60, 0); c.lineTo(60, h); c.stroke();
    } });
    const rows = [['JOB', 0.02], ['GIRLFRIEND', 0.17], ['MONEY', 0.38]];
    rows.forEach(([w, f], i) => {
      const t0 = S.at(0, f), y = 150 + i * 110;
      Pop.word(ctx, w, 160, y, { fam: 'anton', size: 66, fill: P.ink, ext: null, lw: 0.5, align: 'left', sc: pa(S, t0 - 0.05), rot: -0.03 });
      if (S.t > t0) Pop.word(ctx, '✗', 545, y, { fam: 'marker', size: 110, fill: P.red, ext: null, stroke: P.red, lw: 1, sc: pa(S, t0 + 0.12), rot: -0.1 });
    });
    Pop.label(ctx, '(EVER.)', 470, 300, { fam: 'marker', size: 34, bg: P.yellow, sc: pa(S, S.at(0, 0.28)), rot: 0.12 });
    // happiness gauge
    const g0 = S.at(0, 0.62), gk = S.t < g0 ? 0.05 : Math.min(1, 0.05 + ease.back((S.t - g0) / 1.6) * 0.95 + Math.sin(S.t * 30) * 0.01);
    ctx.save(); ctx.translate(0, (1 - pa(S, g0 - 0.6)) * 400);
    C.gauge(ctx, 345, 600, 0.95, gk);
    ctx.restore();
    if (S.t > S.at(0, 0.95)) Pop.burst(ctx, 470, 470, 70, P.yellow, { rot: S.t });
    Pop.word(ctx, '100%', 470, 470, { size: 60, fill: P.red, ext: P.ink, sc: pa(S, S.at(0, 0.95)), rot: 0.1 });
    // Haru, delighted
    C.haru(ctx, 960, 330, 0.95, st(S, 'haru', { expr: S.t > S.at(0, 0.62) ? 'laugh' : 'smile', look: [-0.6, 0.1] }));
  };

  // 5 ── Raised in a lighthouse by his grandmother... / Haru: Sunsets, mostly. And one very handsome goat.
  SC.haru_back = (ctx, S) => {
    const L1 = S.L(1);
    if (S.t < L1.s - 0.1) {
      Pop.fill(ctx, '#ffb347');
      Pop.rings(ctx, 380, 820, ['#ff8a1d', '#ffb347'], S.t * 0.6, 50);
      // polaroid: lighthouse + grandma
      Pop.card(ctx, 90, 80, 460, 520, { seed: 9, fill: P.white, rot: -0.06, inner: (c, w, h) => {
        c.fillStyle = '#8fd3ff'; c.fillRect(20, 20, w - 40, h - 120);
        c.save(); c.beginPath(); c.rect(20, 20, w - 40, h - 120); c.clip();
        c.fillStyle = '#2e6fb0'; c.fillRect(20, h - 190, w - 40, 100);
        C.lighthouse(c, w * 0.68, h - 170, 0.95, S.T);
        C.grandma(c, w * 0.3, h - 260, 0.55, { t: S.T });
        C.haru(c, w * 0.48, h - 170, 0.3, { t: S.T, expr: 'smile', pal: {} });   // little Haru
        c.restore();
        c.fillStyle = P.ink; c.font = '30px Marker'; c.textAlign = 'center'; c.fillText('Grandma & me, age 9', w / 2, h - 50);
      } });
      Pop.label(ctx, 'LIGHTHOUSE', 330, 640, { size: 50, bg: P.red, fill: P.white, sc: pa(S, S.at(0, 0.1)), rot: -0.04 });
      // books pile up
      const bk = S.at(0, 0.4);
      if (S.t > bk) C.books(ctx, 900, 640, 1.0, Math.min(14, 2 + Math.floor((S.t - bk) * 12)), 3);
      Pop.word(ctx, '3,000 BOOKS', 900, 140, { size: 84, fill: P.yellow, ext: P.blue, sc: pa(S, bk + 0.2), rot: 0.05 });
      const ft = S.at(0, 0.8);
      if (S.t > ft) {
        Pop.burst(ctx, 900, 300, 130, P.pink, { rot: 0.2 });
        Pop.word(ctx, '*FAINTS*', 900, 300, { fam: 'marker', size: 58, fill: P.white, ext: P.ink, sc: pa(S, ft), rot: -0.12 });
      }
    } else {
      // sunset + the goat
      const k = S.t - L1.s;
      Pop.sunburst(ctx, W / 2, 640, 22, ['#ff6a3d', '#ffb347'], S.t * 0.1);
      ctx.beginPath(); ctx.arc(W / 2, 640, 170, Math.PI, 0); ctx.fillStyle = P.yellow; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = P.ink; ctx.stroke();
      Pop.halftoneWash(ctx, 'rgba(120,30,60,0.35)', 0, 560, W, 160, 3, 9);
      C.haru(ctx, 360, 360, 0.9, st(S, 'haru', { expr: 'swoon', tilt: -0.08 }));
      const gx = lerp(1500, 930, ease.out(k / 0.6));
      C.goat(ctx, gx, 520, 1.15, S.T);
      Pop.label(ctx, 'VERY HANDSOME GOAT', 930, 220, { fam: 'fat', size: 44, bg: P.paper, fill: P.red, sc: pa(S, L1.s + L1.d * 0.6), rot: 0.06 });
      for (let i = 0; i < 4; i++) Pop.heart(ctx, 1040 + i * 40, 330 - ((S.t * 60 + i * 40) % 140), 0.5, P.hot);
    }
  };

  // 6 ── Interviewer / Haru: Alive, I hope! Is that too ambitious?  → REJECTED x41
  SC.haru_jobs = (ctx, S) => {
    Pop.fill(ctx, P.cream);
    Pop.checker(ctx, 470, ['#d9d3c7', '#f2e6cc'], 0, 0, 70);
    Pop.halftoneWash(ctx, 'rgba(120,110,100,0.25)', 0, 0, W, 470, 2.5, 9);
    const end = S.L(1).e;
    C.boss(ctx, 320, 300, 0.95, { mouth: S.m('boss') });
    // desk
    Pop.card(ctx, 60, 560, 560, 200, { seed: 3, fill: '#7a5a3a', border: 0 });
    C.haru(ctx, 930, 310, 0.95, st(S, 'haru', { expr: S.t < S.L(1).s ? 'neutral' : (S.t > end ? 'wow' : 'smile'), sweat: S.t > end }));
    Pop.label(ctx, 'JOB INTERVIEW #41', W / 2, 70, { size: 40, bg: P.ink, fill: P.yellow, sc: pa(S, 0.1), rot: -0.02 });
    const stamps = [[640, 360, -0.2], [380, 220, 0.15], [900, 500, -0.08], [500, 560, 0.25], [1050, 200, 0.12], [760, 180, -0.3]];
    stamps.forEach(([x, y, r], i) => { const t0 = end + 0.15 + i * 0.22; if (S.t > t0) C.stamp(ctx, 'REJECTED', x, y, 1.5 - 0.5 * ease.out((S.t - t0) / 0.12), r); });
    Pop.word(ctx, '×41', 1120, 620, { size: 110, fill: P.red, ext: P.ink, sc: pa(S, end + 0.9) });
  };

  // 7 ── Haru: I have a window, a library card, and Lev. What else does a person need?
  SC.haru_content = (ctx, S) => {
    Pop.sunburst(ctx, W / 2, H / 2, 20, [P.lime, P.ink], -S.t * 0.25, 0.05);
    const items = [['WINDOW', 0.12, 200, 200], ['LIBRARY CARD', 0.3, 1080, 170], ['LEV', 0.47, 1050, 520]];
    // window cut-out
    const w0 = pa(S, S.at(0, 0.12));
    if (w0) { ctx.save(); ctx.translate(200, 330); ctx.scale(w0, w0); ctx.rotate(-0.08);
      Pop.card(ctx, -110, -130, 220, 260, { seed: 2, fill: P.sky, inner: (c, w, h) => { c.fillStyle = P.white; c.beginPath(); c.arc(70, 80, 30, 0, 7); c.arc(110, 80, 40, 0, 7); c.arc(150, 85, 28, 0, 7); c.fill(); c.fillStyle = '#c99a4b'; c.fillRect(w / 2 - 6, 0, 12, h); c.fillRect(0, h / 2 - 6, w, 12); } });
      ctx.restore(); }
    const c0 = pa(S, S.at(0, 0.3));
    if (c0) { ctx.save(); ctx.translate(1080, 300); ctx.scale(c0, c0); ctx.rotate(0.1);
      Pop.card(ctx, -130, -80, 260, 160, { seed: 5, fill: P.yellow, inner: (c, w, h) => { c.fillStyle = P.ink; c.font = '28px Anton'; c.fillText('CITY LIBRARY', 20, 44); c.font = '20px Inter'; c.fillText('MISHIMA, HARU', 20, 80); c.fillText('BORROWED: 3,112', 20, 110); c.fillStyle = P.white; c.fillRect(170, 70, 70, 70); C.haru(c, 205, 100, 0.14, { t: 0, noBody: true }); } });
      ctx.restore(); }
    ctx.save(); cam(ctx, S, 1, 1.04, W / 2, 300);
    C.haru(ctx, W / 2, 320, 0.95, st(S, 'haru', { expr: 'smile', look: [0, -0.2] }));
    ctx.restore();
    C.cactus(ctx, 900, 560, 1.25 * pa(S, S.at(0, 0.47)), { rot: Math.sin(S.T * 3) * 0.06 });
    items.forEach(([w, f, x, y], i) => Pop.label(ctx, w, [200, 1080, 1030][i], [175, 195, 440][i], { size: 42, bg: [P.paper, P.pink, P.yellow][i], fill: P.ink, sc: pa(S, S.at(0, f) + 0.1), rot: (i - 1) * 0.08, seed: i + 2 }));
    Pop.word(ctx, 'WHAT ELSE?', W / 2, 100, { size: 100, fill: P.yellow, ext: P.hot, sc: pa(S, S.at(0, 0.75)), rot: -0.05 });
  };

  // 8 ── MEANWHILE...
  SC.meanwhile = (ctx, S) => {
    Pop.fill(ctx, P.ink);
    const k = ease.out(S.t / 0.35);
    ctx.save(); ctx.translate(0, 0); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W * 1.3 * k, 0); ctx.lineTo(W * 1.3 * k - 400, H); ctx.lineTo(0, H); ctx.clip();
    Pop.checker(ctx, -400, [P.pink, P.white], S.t * 2, 0, 100); Pop.fill(ctx, 'rgba(0,0,0,0)');
    Pop.stripes(ctx, [P.pink, P.white], 70, -0.7, S.t * 120);
    ctx.restore();
    Pop.ransom(ctx, 'MEANWHILE...', W / 2, H / 2, { size: 100, t: S.t, t0: 0.15, per: 0.09, seed: 4 });
  };

  // 9 ── Nana Kurosaki. Raised in a hotel penthouse by forty-two staff, and zero parents.
  SC.nana_intro = (ctx, S) => {
    Pop.spiral(ctx, W / 2, 330, [P.red, P.pink], S.t * 0.5, 12, 2.0);
    // penthouse tower behind her
    Pop.building(ctx, 140, 160, 160, 600, 12, { body: '#f0d6a0', lit: P.pink });
    Pop.building(ctx, 990, 230, 150, 520, 14, { body: '#f0d6a0', lit: P.pink });
    ctx.save(); cam(ctx, S, 1.02, 1.08, W / 2, 300);
    const rise = ease.back(clamp(S.t / 0.45));
    C.nana(ctx, W / 2, 300 + (1 - rise) * 420, 1.0, st(S, 'nana', { expr: 'smirk', look: [0.4, 0] }));
    ctx.restore();
    Pop.label(ctx, 'NANA KUROSAKI', 260, 110, { fam: 'fat', size: 60, bg: P.paper, fill: P.red, sc: pa(S, S.at(0, 0.05)), rot: -0.06 });
    Pop.label(ctx, 'AGE 25 · HEIRESS', 240, 195, { size: 34, bg: P.ink, fill: P.yellow, sc: pa(S, S.at(0, 0.2)), rot: 0.04, seed: 9 });
    Pop.word(ctx, '42 STAFF', 1040, 420, { fam: 'anton', size: 84, fill: P.yellow, ext: P.ink, sc: pa(S, S.at(0, 0.55)), rot: 0.06 });
    const z = S.at(0, 0.85);
    Pop.word(ctx, '0 PARENTS', 1030, 560, { fam: 'anton', size: 84, fill: P.white, ext: P.ink, sc: pa(S, z), rot: -0.05 });
    if (S.t > z + 0.25) { ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(870, 575); ctx.lineTo(870 + 330 * ease.out((S.t - z - 0.25) / 0.25), 545); ctx.stroke(); ctx.restore(); }
  };

  // 10 ── Two million followers. Four best friends. / Friends: Nana! Selfie!
  SC.nana_friends = (ctx, S) => {
    Pop.sunburst(ctx, W / 2, H / 2, 32, [P.yellow, P.pink, P.blue, P.pink], S.t * 0.2);
    const tiles = [[150, 170, P.blue], [1130, 170, P.yellow], [150, 540, P.lime], [1130, 540, P.pink]];
    const f0 = S.at(0, 0.55);
    tiles.forEach(([x, y, bg], i) => {
      const k = pa(S, f0 + i * 0.12); if (!k) return;
      ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
      Pop.card(ctx, -125, -150, 250, 300, { seed: i + 20, fill: bg, rot: (i % 2 ? 0.05 : -0.05), inner: (c, w, h) => {
        c.fillStyle = Pop.dots(c, 'rgba(0,0,0,0.18)', 2.5, 9); c.fillRect(0, 0, w, h);
        C.friend(c, i, w / 2, h * 0.45, 0.85, { t: S.T, mouth: S.m('friends') * (0.6 + 0.4 * hash(i)), expr: S.m('friends') > 0.05 ? 'wow' : 'smile', look: [i % 2 ? -0.7 : 0.7, 0] });
      } });
      ctx.restore();
    });
    C.nana(ctx, W / 2, 300, 0.9, st(S, 'nana', { expr: 'smile' }));
    C.phone(ctx, W / 2 + 230, 520, 0.75, { rot: 0.15, screen: P.hot, text: '2,000,000\nFOLLOWERS', textSize: 20 });
    for (let i = 0; i < 6; i++) { const y = 600 - ((S.t * 220 + i * 90) % 420); Pop.heart(ctx, W / 2 + 230 + Math.sin(S.t * 3 + i) * 50, y, 0.45, P.red); }
    Pop.label(ctx, 'THE GLITTER FOUR', W / 2, 650, { fam: 'fat', size: 48, bg: P.ink, fill: P.pink, sc: pa(S, S.at(0, 0.7)), rot: -0.02 });
    // camera flashes
    for (const fl of [S.at(1, 0.6), S.at(1, 0.9)]) { const k = (S.t - fl) / 0.15; if (k > 0 && k < 1) { ctx.fillStyle = `rgba(255,255,255,${0.9 * (1 - k)})`; ctx.fillRect(0, 0, W, H); } }
  };

  // 11 ── And nobody to call at three in the morning.
  SC.nana_alone = (ctx, S) => {
    Pop.fill(ctx, '#1d2a4a');
    Pop.halftoneWash(ctx, 'rgba(124,196,255,0.25)', 0, 0, W, H, 2.4, 10);
    // big window with city lights
    Pop.card(ctx, 760, 60, 440, 420, { seed: 6, fill: '#0e1730', border: 6, inner: (c, w, h) => {
      for (let i = 0; i < 60; i++) { c.fillStyle = hash(i) > 0.5 ? P.yellow : P.pink; c.fillRect(hash(i * 3) * w, h * 0.45 + hash(i * 7) * h * 0.55, 6, 6); }
      c.fillStyle = P.white; c.beginPath(); c.arc(w * 0.75, 80, 36, 0, 7); c.fill(); c.fillStyle = '#0e1730'; c.beginPath(); c.arc(w * 0.75 + 16, 70, 32, 0, 7); c.fill();
    } });
    ctx.save(); cam(ctx, S, 1.06, 1.0, 420, 360);
    C.nana(ctx, 420, 330, 0.95, { t: S.T, expr: 'sad', look: [0.2, 0.9], glasses: false, pal: { skin: '#e8d5e8', shade: '#9b8ac4', hair: '#d9d0e8', hairSh: '#a99cc8', tip: '#c25c9b', jacket: '#7a2a52' } });
    ctx.restore();
    C.phone(ctx, 560, 600, 0.9, { rot: -0.1, screen: '#24365f', text: '3:00\nAM', textSize: 44 });
    Pop.typed(ctx, 'NO NEW MESSAGES', 960, 560, (S.t - S.at(0, 0.5)) / 0.7, { size: 30, bg: P.paper, fam: 'RubikMono' });
  };

  // 12 ── Nana: Darling, I'm not lonely. I'm exclusive.
  SC.nana_sass = (ctx, S) => {
    Pop.rings(ctx, W / 2, 340, [P.hot, P.pink, P.white, P.pink], S.t * 1.2, 44);
    ctx.save(); cam(ctx, S, 1.1, 1.18, W / 2, 330);
    const flip = S.t > S.at(0, 0.6);
    C.nana(ctx, W / 2, 330, 1.1, st(S, 'nana', { expr: flip ? 'smirk' : 'neutral', look: flip ? [0.9, 0] : [0, 0], glasses: S.t < 0.3 ? 'on' : true }));
    ctx.restore();
    const e = S.at(0, 0.62);
    Pop.word(ctx, 'EXCLUSIVE', W / 2, 600, { fam: 'fat', size: 130, fill: P.gold, ext: P.ink, stroke: P.ink, sc: pa(S, e), rot: -0.04 });
    for (let i = 0; i < 7; i++) if (S.t > e) { const a = i / 7 * 6.28 + S.t; Pop.star(ctx, W / 2 + Math.cos(a) * 420, 580 + Math.sin(a) * 90, 22, 9, 4); ctx.fillStyle = P.white; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = P.ink; ctx.stroke(); }
    Pop.label(ctx, 'DARLING,', 230, 130, { fam: 'marker', size: 46, bg: P.yellow, sc: pa(S, 0.2), rot: -0.1 });
  };

  // 13 ── Then, one fine day...
  SC.one_fine_day = (ctx, S) => {
    Pop.sunburst(ctx, W / 2, 330, 30, [P.sky, P.blue], S.t * 0.3);
    Pop.checker(ctx, 420, [P.ink, P.white], S.t * 3, 0, 90);
    ctx.beginPath(); ctx.arc(W / 2, 330, 80, 0, 7); ctx.fillStyle = P.yellow; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = P.ink; ctx.stroke();
    ['ONE', 'FINE', 'DAY'].forEach((w, i) => Pop.word(ctx, w, 300 + i * 340, 220 + (i % 2) * 60, { size: 150, fill: [P.yellow, P.pink, P.white][i], ext: P.ink, depth: 12, sc: pa(S, 0.25 + i * 0.5), rot: (i - 1) * 0.08 }));
  };

  // 14 ── the collision on the zebra crossing
  SC.crash = (ctx, S) => {
    const hit = 1.4;
    ctx.save(); shake(ctx, S, hit, 26, 0.5);
    Pop.fill(ctx, '#5b5f66');
    // zebra crossing, top-down perspective
    Pop.halftoneWash(ctx, 'rgba(0,0,0,0.3)', 0, 0, W, H, 2, 8);
    for (let i = 0; i < 9; i++) { ctx.fillStyle = P.white; ctx.beginPath(); ctx.moveTo(-100 + i * 170, H); ctx.lineTo(-20 + i * 170, H); ctx.lineTo(380 + i * 70, 300); ctx.lineTo(340 + i * 70, 300); ctx.closePath(); ctx.fill(); }
    Pop.skyline(ctx, 320, S.t, 21, 0.8, { body: '#c9c2b4' });
    const k = clamp(S.t / hit);
    const hx = lerp(-200, 560, ease.inout(k)), nx = lerp(1480, 740, ease.inout(k));
    const after = S.t > hit;
    C.figure(ctx, 'haru', after ? 520 - (S.t - hit) * 40 : hx, 300, 0.48, { walk: S.t * 9, t: S.T, st: { expr: after ? 'wow' : 'smile', look: [1, 0], tilt: after ? -0.2 : 0 } });
    C.figure(ctx, 'nana', after ? 780 + (S.t - hit) * 40 : nx, 300, 0.48, { walk: S.t * 10 + 1, t: S.T, st: { expr: after ? 'angry' : 'neutral', look: after ? [-1, 0] : [0, 1], tilt: after ? 0.2 : 0 } });
    if (!after) C.phone(ctx, nx - 80, 420, 0.4, { screen: P.hot });
    ctx.restore();
    if (after) {
      const k2 = S.t - hit;
      Pop.burst(ctx, W / 2 + 10, 300, 230 * ease.back(k2 / 0.25), P.yellow, { n: 16, rot: 0.1 });
      Pop.word(ctx, 'CRASH!', W / 2 + 10, 300, { size: 130, fill: P.red, ext: P.ink, stroke: P.white, sc: pa(S, hit, 0.25), rot: -0.1 });
      // phone flying, spinning
      C.phone(ctx, lerp(700, 1150, clamp(k2 / 1.4)), 300 - 300 * Math.sin(clamp(k2 / 1.4) * Math.PI) + 200 * clamp(k2 / 1.4), 0.5, { rot: k2 * 12, screen: P.hot, cracked: k2 > 1.2 });
      for (let i = 0; i < 5; i++) { const a = i / 5 * 6.28 + S.t * 4; Pop.star(ctx, 520 + Math.cos(a) * 60, 110 + Math.sin(a) * 20, 18, 7); ctx.fillStyle = P.yellow; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = P.ink; ctx.stroke(); }
    }
  };

  // 15 ── Nana: Do you have any idea who I am? / Haru: No. Do you?
  SC.who_am_i = (ctx, S) => {
    const L1 = S.L(1);
    // diagonal split
    ctx.save(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(760, 0); ctx.lineTo(520, H); ctx.lineTo(0, H); ctx.clip();
    Pop.spiral(ctx, 300, 340, [P.hot, P.pink], S.t * 0.6, 10, 2);
    C.nana(ctx, 320, 330, 1.0, st(S, 'nana', { expr: S.t > L1.e ? 'wow' : 'angry', look: [0.8, 0] }));
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.moveTo(760, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(520, H); ctx.clip();
    Pop.sunburst(ctx, 960, 340, 24, [P.yellow, P.white], -S.t * 0.2);
    C.haru(ctx, 960, 330, 1.0, st(S, 'haru', { expr: S.t > L1.s ? 'smile' : 'neutral', look: [-0.8, 0], curl: S.t > L1.e ? 0.4 : 0 }));
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.moveTo(760, 0); ctx.lineTo(520, H); ctx.lineWidth = 14; ctx.strokeStyle = P.ink; ctx.stroke(); ctx.restore();
    Pop.label(ctx, 'WHO I AM?', 300, 640, { fam: 'fat', size: 52, bg: P.paper, fill: P.red, sc: pa(S, S.at(0, 0.6)), rot: -0.05 });
    Pop.label(ctx, 'NO.', 1000, 120, { size: 60, bg: P.ink, fill: P.white, sc: pa(S, S.at(1, 0.05)), rot: 0.06 });
    Pop.word(ctx, '?', 640, 330, { size: 300, fill: P.yellow, ext: P.hot, depth: 16, sc: pa(S, S.at(1, 0.6), 0.35), rot: Math.sin(S.t * 4) * 0.1 });
  };

  // 16 ── Haru: Oh no. You're beautiful. (faints) / Nana: Did he just... faint?
  SC.faint = (ctx, S) => {
    const L0 = S.L(0), ft = L0.e + 0.25, L1 = S.L(1);
    Pop.rings(ctx, W / 2, 330, [P.pink, '#ffd1e3'], S.t * 1.5, 40);
    const fall = clamp((S.t - ft) / 0.6);
    ctx.save();
    ctx.translate(W / 2, 330 + 600 * ease.inout(fall) ** 2); ctx.rotate(-1.4 * ease.inout(fall)); ctx.translate(-W / 2, -330);
    C.haru(ctx, W / 2, 330, 1.05, st(S, 'haru', { expr: S.t > L0.s + L0.d * 0.4 ? 'swoon' : 'wow', curl: Math.sin(S.t * 14) * 0.3 }));
    ctx.restore();
    for (let i = 0; i < 6 && fall < 0.3; i++) { const a = i / 6 * 6.28 + S.t * 2; Pop.heart(ctx, W / 2 + Math.cos(a) * 260, 300 + Math.sin(a) * 180, 0.6 * pa(S, L0.s + 0.5 + i * 0.05), P.hot); }
    Pop.word(ctx, 'BEAUTIFUL', W / 2, 110, { fam: 'fat', size: 110, fill: P.white, ext: P.hot, sc: pa(S, S.at(0, 0.55)) * (1 - fall), rot: -0.05 });
    if (fall > 0.8) {
      Pop.word(ctx, 'THUD.', W / 2, 560, { size: 150, fill: P.yellow, ext: P.ink, sc: pa(S, ft + 0.5), rot: 0.06 });
      // Nana leans in from the right
      const k = ease.out((S.t - L1.s + 0.3) / 0.4);
      C.nana(ctx, lerp(1500, 1050, k), 330, 0.9, st(S, 'nana', { expr: 'wow', look: [-0.6, 0.7], tilt: -0.25 }));
    }
  };

  // 17 ── Nana: Pick anything. My treat. / Haru: This umbrella! It's a very good umbrella.
  SC.montage_shop = (ctx, S) => {
    Pop.stripes(ctx, [P.yellow, P.white], 60, 0.4, S.t * 60);
    // shopping bags
    const bags = [[120, 520, P.pink, 'LUXE'], [260, 560, P.blue, 'Mode'], [1150, 520, P.ink, 'ÉLAN']];
    bags.forEach(([x, y, c, w], i) => { const k = pa(S, 0.1 + i * 0.1); if (!k) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate((i - 1) * 0.1);
      Pop.card(ctx, -70, -90, 140, 180, { seed: i + 40, fill: c, border: 0, inner: (cc, ww, hh) => { cc.fillStyle = c === P.ink ? P.gold : P.white; cc.font = '34px Abril'; cc.textAlign = 'center'; cc.fillText(w, ww / 2, hh / 2 + 12); } });
      ctx.beginPath(); ctx.arc(0, -90, 34, Math.PI, 0); ctx.lineWidth = 6; ctx.strokeStyle = P.ink; ctx.stroke(); ctx.restore(); });
    C.nana(ctx, 420, 330, 0.85, st(S, 'nana', { expr: S.t > S.L(1).e ? 'wow' : 'smirk', look: [0.8, 0] }));
    C.haru(ctx, 860, 340, 0.85, st(S, 'haru', { expr: 'smile', look: [-0.3, -0.3] }));
    C.umbrella(ctx, 1010, 230, 0.9 * pa(S, S.at(1, 0.15)), 0.25);
    const d = S.L(1).e + 0.1;
    if (S.t > d) Pop.card(ctx, 520, 470, 240, 180, { seed: 7, fill: P.white, rot: -0.05, inner: (c, w, h) => { c.fillStyle = P.ink; c.font = '22px RubikMono'; c.fillText('RECEIPT', 20, 40); c.font = '22px Inter'; c.fillText('umbrella ...... 1', 20, 80); c.font = '42px Anton'; c.fillStyle = P.red; c.fillText('TOTAL ¥100', 20, 140); } });
  };

  // 18 ── Nana: People just... sit here? Together?
  SC.montage_bus = (ctx, S) => {
    Pop.fill(ctx, P.yellow);
    // the city scrolling past the bus window
    ctx.save(); ctx.beginPath(); ctx.roundRect(90, 70, 1100, 420, 30); ctx.clip();
    Pop.fill(ctx, P.sky); ctx.translate(-((S.t * 260) % 600), 0); Pop.skyline(ctx, 520, 0, 33, 0.9, {}); ctx.translate(600, 0); Pop.skyline(ctx, 520, 0, 33, 0.9, {});
    ctx.restore();
    ctx.lineWidth = 16; ctx.strokeStyle = P.ink; ctx.beginPath(); ctx.roundRect(90, 70, 1100, 420, 30); ctx.stroke(); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(640, 70); ctx.lineTo(640, 490); ctx.stroke();
    // seat backs
    const bob = Math.sin(S.t * 18) * 3;
    C.nana(ctx, 470, 390 + bob, 0.8, st(S, 'nana', { expr: 'wow', look: [-0.5, -0.2], glasses: true }));
    C.haru(ctx, 820, 395 - bob, 0.8, st(S, 'haru', { expr: 'smile', look: [-0.9, 0] }));
    Pop.card(ctx, 200, 560, 880, 200, { seed: 8, fill: '#2e9a6a', border: 0, shadow: 0 });
    Pop.label(ctx, 'FIRST BUS RIDE', 300, 130, { size: 50, bg: P.red, fill: P.white, sc: pa(S, 0.2), rot: -0.06 });
    Pop.label(ctx, '(AGE 25)', 330, 205, { fam: 'marker', size: 36, bg: P.paper, sc: pa(S, 0.6), rot: 0.05, seed: 6 });
    Pop.word(ctx, 'TOGETHER?', 980, 620, { size: 100, fill: P.pink, ext: P.ink, sc: pa(S, S.at(0, 0.75)), rot: 0.06 });
  };

  // 19 ── Friends: Who is that idiot? / Haru: Me! It's a good name. Nobody expects me to lie.
  SC.montage_badge = (ctx, S) => {
    const L1 = S.L(1);
    Pop.sunburst(ctx, 900, 380, 26, [P.lime, P.yellow], S.t * 0.25, 0.03);
    // whispering friends, stacked tiles on the left
    [0, 1, 2, 3].forEach(i => { const x = 110 + (i % 2) * 220, y = 170 + Math.floor(i / 2) * 300;
      Pop.card(ctx, x - 95, y - 120, 190, 240, { seed: 50 + i, fill: [P.pink, P.blue, P.ink, P.purple][i], inner: (c, w, h) => C.friend(c, i, w / 2, h * 0.45, 0.65, { t: S.T, mouth: S.m('friends') * (0.5 + hash(i) * 0.5), expr: 'smirk', look: [1, 0] }) }); });
    Pop.label(ctx, 'WHO IS THAT IDIOT?', 290, 60, { fam: 'fat', size: 40, bg: P.paper, fill: P.hot, sc: pa(S, S.at(0, 0.2)), rot: -0.04 });
    C.haru(ctx, 880, 320, 1.0, st(S, 'haru', { expr: S.t > L1.s ? 'laugh' : 'wow', badge: ease.back(clamp((S.t - L1.s) / 0.35)) }));
    if (S.t > L1.s) for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28 + S.t; ctx.save(); ctx.translate(975 + Math.cos(a) * 80, 570 + Math.sin(a) * 80); ctx.rotate(a); ctx.fillStyle = P.white; ctx.fillRect(-14, -3, 28, 6); ctx.restore(); }
    Pop.word(ctx, 'NO LIES!', 1080, 110, { size: 90, fill: P.yellow, ext: P.red, sc: pa(S, S.at(1, 0.7)), rot: 0.08 });
  };

  // 20 ── Nana: He's nobody. So why can't I stop thinking about nobody?
  SC.nana_heart = (ctx, S) => {
    Pop.rings(ctx, W / 2, 360, ['#ffd1e3', '#ffe8f0'], S.t * 0.5, 60);
    const beat = 1 + 0.08 * Math.max(0, Math.sin(S.T * Math.PI * 4)) ** 8;
    Pop.heart(ctx, 900, 360, 4.2 * beat * pa(S, 0.1, 0.5), P.hot);
    C.nana(ctx, 520, 330, 1.0, st(S, 'nana', { expr: S.t > S.at(0, 0.45) ? 'sad' : 'neutral', look: [0.8, -0.3], glasses: false }));
    Pop.label(ctx, 'NOBODY', 1000, 160, { fam: 'anton', size: 56, bg: P.paper, fill: P.ink, sc: pa(S, S.at(0, 0.1)), rot: 0.08 });
    Pop.label(ctx, 'NOBODY', 950, 560, { fam: 'fat', size: 60, bg: P.ink, fill: P.pink, sc: pa(S, S.at(0, 0.85)), rot: -0.06, seed: 7 });
    // Haru in a tiny polaroid on the heart
    const k = pa(S, S.at(0, 0.6));
    if (k) { ctx.save(); ctx.translate(900, 360); ctx.scale(k, k); Pop.card(ctx, -80, -90, 160, 180, { seed: 70, fill: P.white, rot: 0.1, inner: (c, w, h) => { c.fillStyle = P.yellow; c.fillRect(10, 10, w - 20, h - 50); c.save(); c.beginPath(); c.rect(10, 10, w - 20, h - 50); c.clip(); C.haru(c, w / 2, 70, 0.42, { t: S.T, expr: 'smile' }); c.restore(); } }); ctx.restore(); }
  };

  // 21 ── Ryuji: A hundred million yen says she's mine.
  SC.ryuji = (ctx, S) => {
    Pop.sunburst(ctx, W / 2, 330, 18, [P.ink, P.red], S.t * 0.4, 0.07);
    ctx.save(); cam(ctx, S, 1.08, 1.0, W / 2, 330);
    C.ryuji(ctx, W / 2, 320, 1.0, { mouth: S.m('ryuji') });
    ctx.restore();
    Pop.label(ctx, 'RYUJI GOZEN', 230, 120, { size: 58, bg: P.gold, fill: P.ink, sc: pa(S, 0.15), rot: -0.06 });
    Pop.label(ctx, 'CRYPTO KING', 230, 200, { fam: 'RubikMono', size: 30, bg: P.ink, fill: P.lime, sc: pa(S, 0.45), rot: 0.04, seed: 3 });
    Pop.word(ctx, '¥100,000,000', W / 2, 560, { fam: 'anton', size: 104, fill: P.gold, ext: P.ink, sc: pa(S, S.at(0, 0.35)), rot: -0.03 });
    for (let i = 0; i < 10; i++) { const y = ((S.t * 200 + i * 80) % 800) - 60; C.banknote(ctx, (hash(i) * W), y, 0.8, S.t * 3 + i); }
  };

  // 22 ── Nana: You want to buy me? Watch your price burn.
  SC.fire = (ctx, S) => {
    const burn = S.L(0).e + 0.1, bk = clamp((S.t - burn) / 1.5);
    Pop.fill(ctx, P.ink); Pop.sunburst(ctx, 900, 500, 20, ['#3a0a10', '#1b0508'], S.t * 0.1);
    // fireplace
    Pop.card(ctx, 700, 280, 460, 360, { seed: 5, fill: '#7a2a20', border: 0, inner: (c, w, h) => { c.fillStyle = '#100404'; c.fillRect(60, 70, w - 120, h - 70); for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) { c.strokeStyle = 'rgba(0,0,0,0.5)'; c.lineWidth = 3; c.strokeRect(i * 80 + (j % 2) * 40 - 20, j * 24, 80, 24); } } });
    C.flames(ctx, 930, 640, 0.95 + bk * 0.6, S.T);
    C.briefcase(ctx, 1000, 220, 0.6, 1);
    if (S.t > burn) for (let i = 0; i < 9; i++) { const k = clamp((S.t - burn - i * 0.08) / 0.7); if (k > 0) C.banknote(ctx, lerp(1000, 880 + i * 15, k), lerp(220, 560, k) - Math.sin(k * 3.14) * 120, 0.8 * (1 - k * 0.5), k * 6 + i); }
    ctx.save(); ctx.globalAlpha = 0.25 + 0.15 * Math.sin(S.T * 20); ctx.fillStyle = P.orange; ctx.fillRect(0, 0, W, H); ctx.restore();
    C.nana(ctx, 360, 330, 1.05, st(S, 'nana', { expr: S.t > burn ? 'smirk' : 'angry', look: [0.7, 0], pal: { shade: '#e8642c' } }));
    Pop.word(ctx, 'BURN', 900, 130, { size: 200, fill: P.yellow, ext: P.red, depth: 14, sc: pa(S, burn), rot: -0.06 });
  };

  // 23 ── Haru: Nana. You don't have to prove anything. Not to them. Not to me.
  SC.haru_serious = (ctx, S) => {
    Pop.fill(ctx, P.cream);
    Pop.halftoneWash(ctx, 'rgba(46,127,224,0.32)', 0, 0, W, H, 3.4, 12);
    ctx.save(); cam(ctx, S, 1.15, 1.3, W / 2, 300);
    C.haru(ctx, W / 2, 320, 1.0, st(S, 'haru', { expr: 'serious', look: [0, 0.05] }));
    ctx.restore();
    Pop.typed(ctx, 'NOT TO ME.', 1020, 600, (S.t - S.at(0, 0.82)) / 0.4, { size: 40, fam: 'serif' });
  };

  // 24 ── He has nothing. / She has everything. / Together, they might finally have... enough.
  SC.rapid = (ctx, S) => {
    const L1 = S.L(1), L2 = S.L(2);
    if (S.t < L1.s - 0.05) {
      Pop.sunburst(ctx, W / 2, H / 2, 24, [P.blue, P.sky], S.t);
      C.haru(ctx, W / 2, 330, 0.9, { t: S.T, expr: 'smile', look: [0, -0.3] });
      Pop.word(ctx, 'HE HAS NOTHING.', W / 2, 620, { fam: 'anton', size: 96, fill: P.white, ext: P.ink, sc: pa(S, 0.15) });
    } else if (S.t < L2.s - 0.05) {
      Pop.spiral(ctx, W / 2, H / 2, [P.gold, P.yellow], S.t * 1.2, 12, 2);
      C.nana(ctx, W / 2, 330, 0.9, { t: S.T, expr: 'smirk', look: [0.5, 0] });
      for (let i = 0; i < 12; i++) { const y = ((S.t * 300 + i * 70) % 820) - 50; ctx.beginPath(); ctx.arc(hash(i + 3) * W, y, 22, 0, 7); ctx.fillStyle = P.gold; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = P.ink; ctx.stroke(); }
      Pop.word(ctx, 'SHE HAS EVERYTHING.', W / 2, 620, { fam: 'anton', size: 92, fill: P.hot, ext: P.ink, sc: pa(S, L1.s) });
    } else {
      Pop.sunburst(ctx, W / 2, H / 2, 32, [P.pink, P.yellow, P.blue, P.yellow], S.t * 0.4);
      C.haru(ctx, 820, 340, 0.85, { t: S.T, expr: 'smile', look: [-0.8, 0] });
      C.nana(ctx, 460, 340, 0.85, { t: S.T, expr: 'smile', look: [0.8, 0] });
      Pop.label(ctx, 'TOGETHER...', W / 2, 110, { fam: 'fat', size: 60, bg: P.paper, fill: P.ink, sc: pa(S, L2.s) });
      Pop.word(ctx, 'ENOUGH.', W / 2, 610, { size: 150, fill: P.yellow, ext: P.red, sc: pa(S, S.at(2, 0.82)), rot: -0.04 });
    }
  };

  // 25 ── Nana: You're an idiot. You know that? / Haru: I know! Isn't it wonderful?
  SC.together = (ctx, S) => {
    const L1 = S.L(1);
    Pop.sunburst(ctx, W / 2, 360, 28, [P.yellow, P.pink], S.t * 0.3);
    Pop.checker(ctx, 560, [P.ink, P.white], S.t * 2, 0, 70);
    const laugh = S.t > L1.e - 0.2;
    C.nana(ctx, 450, 320, 0.95, st(S, 'nana', { expr: laugh ? 'laugh' : 'smirk', look: [0.9, 0] }));
    C.haru(ctx, 830, 320, 0.95, st(S, 'haru', { expr: S.t > L1.s ? 'laugh' : 'smile', look: [-0.9, 0] }));
    Pop.label(ctx, 'IDIOT.', 300, 110, { fam: 'fat', size: 56, bg: P.ink, fill: P.yellow, sc: pa(S, S.at(0, 0.3)), rot: -0.08 });
    Pop.word(ctx, 'WONDERFUL!', 980, 110, { size: 96, fill: P.lime, ext: P.blue, sc: pa(S, S.at(1, 0.6)), rot: 0.06 });
    if (laugh) for (let i = 0; i < 8; i++) Pop.heart(ctx, 640 + Math.sin(i * 2.1 + S.t * 3) * 120, 420 - ((S.t * 160 + i * 60) % 380), 0.5, [P.hot, P.red][i % 2]);
  };

  // 26 ── TITLE: Beautiful Idiot.
  SC.title = (ctx, S) => {
    const drop = 2.0;    // the 4-beat drop
    Pop.spiral(ctx, W / 2, H / 2, [P.hot, P.yellow, P.pink, P.yellow], S.t * 0.35, 16, 2.2);
    // flying confetti words (the trailer's vocabulary)
    const vocab = ['IDIOT', 'NANA', 'HARU', 'LEV', 'BURN', '¥100', 'THUD.', 'TUESDAY?', 'NOBODY', 'EXCLUSIVE', 'GOAT', '3:00 AM', 'NO LIES', 'CRASH!'];
    vocab.forEach((w, i) => { const a = hash(i * 9.1) * 6.28, r = 120 + ease.out(clamp(S.t / 1.2)) * (160 + hash(i) * 200);
      Pop.label(ctx, w, W / 2 + Math.cos(a) * r * 1.4, H / 2 + Math.sin(a) * r * 0.8, { size: 26 + hash(i * 3) * 18, fam: ['anton', 'fat', 'comic', 'mono'][i % 4], bg: [P.paper, P.ink, P.yellow, P.blue][i % 4], fill: [P.ink, P.white, P.red, P.white][i % 4], rot: (hash(i * 5) - 0.5) * 0.6, seed: i + 30 }); });
    ctx.save(); if (S.t > drop) shake(ctx, S, drop, 16, 0.4);
    Pop.ransom(ctx, 'BEAUTIFUL', W / 2, 250, { size: 108, t: S.t, t0: 0.6, per: 0.07, seed: 7 });
    Pop.word(ctx, 'IDIOT', W / 2, 430, { size: 250, fill: P.yellow, ext: P.red, stroke: P.ink, depth: 18, sc: pa(S, 1.25, 0.35), rot: -0.04 });
    ctx.restore();
    Pop.label(ctx, "a loose adaptation of Dostoevsky's THE IDIOT", W / 2, 580, { fam: 'serif', size: 26, bg: P.paper, fill: P.ink, sc: pa(S, drop + 0.2), rot: 0.01 });
    // our two, in corner cut-outs
    const k = pa(S, drop);
    if (k) {
      ctx.save(); ctx.translate(140, 560); ctx.scale(k, k); Pop.card(ctx, -100, -120, 200, 240, { seed: 81, fill: P.blue, rot: -0.08, inner: (c, w, h) => C.haru(c, w / 2, h * 0.45, 0.62, { t: S.T, expr: 'smile', look: [1, 0], mouth: S.m('haru') }) }); ctx.restore();
      ctx.save(); ctx.translate(1140, 560); ctx.scale(k, k); Pop.card(ctx, -100, -120, 200, 240, { seed: 82, fill: P.lime, rot: 0.08, inner: (c, w, h) => C.nana(c, w / 2, h * 0.45, 0.62, { t: S.T, expr: 'smirk', look: [-1, 0] }) }); ctx.restore();
    }
    Pop.label(ctx, 'COMING SOON-ISH', W / 2, 668, { fam: 'RubikMono', size: 30, bg: P.ink, fill: P.yellow, sc: pa(S, S.at(1, 0.1)), rot: -0.02, seed: 4 });
    // final fade to black
    const fo = clamp((S.t - (S.d - 0.9)) / 0.9); if (fo > 0) { ctx.fillStyle = `rgba(10,6,6,${fo})`; ctx.fillRect(0, 0, W, H); }
  };

  // ───────────────────────────── driver ─────────────────────────────
  function draw(ctx, tl, T) {
    T = Math.max(0, Math.min(tl.total - 1e-3, T));
    const si = tl.shots.findIndex(s => T >= s.start && T < s.start + s.dur);
    const sh = tl.shots[si < 0 ? tl.shots.length - 1 : si];
    const idx = si < 0 ? tl.shots.length - 1 : si;
    const ls = tl.lines.filter(l => l.shot === idx);
    const t = T - sh.start;
    const S = {
      t, T, d: sh.dur, k: t / sh.dur,
      L: i => { const l = ls[i]; if (!l) return { s: 99, e: 99, d: 1 }; const s = l.start - sh.start; return { s, e: s + l.dur, d: l.dur }; },
      at: (i, f) => { const l = ls[i]; if (!l) return 99; return l.start - sh.start + l.dur * f; },
      m: who => {
        for (const l of ls) if (l.who === who && T >= l.start && T < l.start + l.dur) {
          const x = (T - l.start) * 30, i = Math.floor(x), e = l.env;
          const v = ((e[i] || 0) + (e[i + 1] || 0)) / 2; return v > 0.12 ? Math.min(1, v * 1.1) : 0;
        }
        return 0;
      }
    };
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
    (SC[sh.id] || ((c) => Pop.fill(c, '#f0f')))(ctx, S);
    ctx.restore();
    Pop.finish(ctx, T);
    // subtitle: current or just-finished line
    const cur = tl.lines.find(l => T >= l.start - 0.05 && T < l.start + l.dur + 0.35);
    if (cur) Pop.subtitle(ctx, cur.text, cur.who, (T - cur.start + 0.05));
  }
  window.Scenes = { draw, SC };
})();
