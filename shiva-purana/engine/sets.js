/* Shiva Purana: comic-book backgrounds. Each set returns { back, front? } as SVG for the 1280x720 world.
   Bold gradient skies with halftone dot ramps, ink-outlined silhouettes, hatching and speed lines.
   Sets are rasterised once per (set, ctx) by the renderer.
   Exports window.CBSets = { SETS, rng }. */
(function () {
  const { f1, shade, INK, GOLD, GOLD_L, GOLD_D, RUBY, smooth } = window.CBFig;
  const W = 1280, H = 720;
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const P = (d, fill, o = {}) => `<path d="${d}" fill="${fill}"${o.ink === false ? '' : ` stroke="${o.col || INK}" stroke-width="${o.w || 3}" stroke-linejoin="round"`}${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
  const L = (d, w = 2, col = INK, op) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${op != null ? ` opacity="${op}"` : ''}/>`;
  let GID = 0;
  function grad(stops, vertical = true) {
    const id = 'sg' + (++GID);
    return { id, def: `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>` };
  }
  function sky(stops) { const g = grad(stops); return `<defs>${g.def}</defs><rect width="${W}" height="${H}" fill="url(#${g.id})"/>`; }
  // a halftone ramp: dots that grow from r0 to r1 across a band
  function ramp(x0, y0, x1, y1, col, r0 = 0.4, r1 = 3.4, step = 10, op = 0.35, vertical = true) {
    let s = `<g fill="${col}" opacity="${op}">`;
    for (let y = y0, row = 0; y < y1; y += step, row++) for (let x = x0 + (row % 2) * step / 2; x < x1; x += step) {
      const p = vertical ? (y - y0) / (y1 - y0) : (x - x0) / (x1 - x0);
      const r = r0 + (r1 - r0) * p; if (r > 0.3) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
    }
    return s + '</g>';
  }
  function stars(n, seed, y1 = H * 0.7, col = '#fff8e0') {
    const r = rng(seed); let s = '';
    for (let i = 0; i < n; i++) { const x = r() * W, y = r() * y1, k = r(); s += k > 0.93 ? `<path d="M${f1(x)},${f1(y - 7)}L${f1(x + 1.6)},${f1(y - 1.6)}L${f1(x + 7)},${f1(y)}L${f1(x + 1.6)},${f1(y + 1.6)}L${f1(x)},${f1(y + 7)}L${f1(x - 1.6)},${f1(y + 1.6)}L${f1(x - 7)},${f1(y)}L${f1(x - 1.6)},${f1(y - 1.6)}Z" fill="${col}"/>` : `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.6 + k * 1.6)}" fill="${col}" opacity="${f1(0.5 + k * 0.5)}"/>`; }
    return s;
  }
  function speed(cx, cy, n, col = INK, op = 0.18, r0 = 260, seed = 3) {
    const r = rng(seed); let s = `<g opacity="${op}">`;
    for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, w = 1 + r() * 5, rr = r0 + r() * 120; s += `<path d="M${f1(cx + Math.cos(a) * rr)},${f1(cy + Math.sin(a) * rr)}L${f1(cx + Math.cos(a - w / 400) * 1400)},${f1(cy + Math.sin(a - w / 400) * 1400)}L${f1(cx + Math.cos(a + w / 400) * 1400)},${f1(cy + Math.sin(a + w / 400) * 1400)}Z" fill="${col}"/>`; }
    return s + '</g>';
  }
  function ridge(y, amp, seed, n = 9, x0 = -40, x1 = W + 40) {
    const r = rng(seed); const pts = [];
    for (let i = 0; i <= n; i++) pts.push([x0 + (x1 - x0) * i / n, y - r() * amp]);
    return pts;
  }
  function mountains(pts, fill, opts = {}) {
    const d = 'M' + pts.map(p => `${f1(p[0])},${f1(p[1])}`).join('L') + `L${W + 60},${H + 40}L-60,${H + 40}Z`;
    let s = P(d, fill, { w: opts.w || 3 });
    // shadow side of each peak (right flank) with halftone
    for (let i = 1; i < pts.length - 1; i++) {
      const [x, y] = pts[i], [x2, y2] = pts[i + 1];
      if (y < pts[i - 1][1] && y < y2) s += `<path d="M${f1(x)},${f1(y)}L${f1(x2)},${f1(y2)}L${f1(x + (x2 - x) * 0.2)},${f1(H)}Z" fill="${shade(fill, -0.25)}" opacity="0.8"/>`;
    }
    if (opts.snow) for (let i = 1; i < pts.length - 1; i++) {
      const [x, y] = pts[i]; if (y > opts.snow) continue;
      const [xa, ya] = pts[i - 1], [xb, yb] = pts[i + 1], k = 0.28;
      s += P(`M${f1(x)},${f1(y)}L${f1(x + (xb - x) * k)},${f1(y + (yb - y) * k)}L${f1(x + (xb - x) * k * 0.6)},${f1(y + (yb - y) * k + 12)}L${f1(x + (xb - x) * k * 0.2)},${f1(y + (yb - y) * k * 0.6)}L${f1(x - (x - xa) * k * 0.3)},${f1(y + (ya - y) * k + 14)}L${f1(x - (x - xa) * k)},${f1(y + (ya - y) * k)}Z`, opts.snowCol || '#f4f8ff', { w: 2 });
    }
    return s;
  }
  function cloud(x, y, s, col = '#ffffff', ink = true) {
    const d = `M${x - 60 * s},${y}C${x - 70 * s},${y - 24 * s} ${x - 40 * s},${y - 40 * s} ${x - 20 * s},${y - 30 * s}C${x - 10 * s},${y - 56 * s} ${x + 30 * s},${y - 56 * s} ${x + 36 * s},${y - 30 * s}C${x + 60 * s},${y - 40 * s} ${x + 80 * s},${y - 16 * s} ${x + 66 * s},${y}Z`;
    return P(d, col, { w: ink ? 2.6 : 0, ink }) + `<path d="M${x - 50 * s},${y - 4 * s}C${x - 10 * s},${y - 14 * s} ${x + 30 * s},${y - 12 * s} ${x + 62 * s},${y - 4 * s}L${x + 66 * s},${y}L${x - 60 * s},${y}Z" fill="${shade(col, -0.18)}"/>`;
  }
  function tree(x, y, s, col = '#2e6a3a', trunk = '#5a3a22') {
    let o = P(`M${x - 10 * s},${y}L${x - 6 * s},${y - 90 * s}L${x + 6 * s},${y - 90 * s}L${x + 10 * s},${y}Z`, trunk, { w: 2.4 });
    o += P(`M${x},${y - 200 * s}C${x + 50 * s},${y - 190 * s} ${x + 80 * s},${y - 130 * s} ${x + 60 * s},${y - 90 * s}C${x + 30 * s},${y - 70 * s} ${x - 30 * s},${y - 70 * s} ${x - 60 * s},${y - 90 * s}C${x - 80 * s},${y - 130 * s} ${x - 50 * s},${y - 190 * s} ${x},${y - 200 * s}Z`, col, { w: 2.6 });
    o += `<path d="M${x + 10 * s},${y - 190 * s}C${x + 50 * s},${y - 180 * s} ${x + 76 * s},${y - 130 * s} ${x + 58 * s},${y - 92 * s}C${x + 34 * s},${y - 80 * s} ${x + 14 * s},${y - 80 * s} ${x + 4 * s},${y - 84 * s}C${x + 30 * s},${y - 120 * s} ${x + 26 * s},${y - 160 * s} ${x + 10 * s},${y - 190 * s}Z" fill="${shade(col, -0.3)}"/>`;
    return o;
  }
  function pine(x, y, s, col = '#1f4a3a') {
    return P(`M${x},${y - 170 * s}L${x + 30 * s},${y - 110 * s}L${x + 16 * s},${y - 112 * s}L${x + 44 * s},${y - 50 * s}L${x + 22 * s},${y - 52 * s}L${x + 54 * s},${y}L${x - 54 * s},${y}L${x - 22 * s},${y - 52 * s}L${x - 44 * s},${y - 50 * s}L${x - 16 * s},${y - 112 * s}L${x - 30 * s},${y - 110 * s}Z`, col, { w: 2.4 }) + `<path d="M${x},${y - 170 * s}L${x + 30 * s},${y - 110 * s}L${x + 16 * s},${y - 112 * s}L${x + 44 * s},${y - 50 * s}L${x + 22 * s},${y - 52 * s}L${x + 54 * s},${y}L${x + 6 * s},${y}Z" fill="${shade(col, -0.35)}"/>`;
  }
  function pillar(x, y0, y1, w, col, cap = GOLD) {
    let s = P(`M${x - w / 2},${y0}L${x + w / 2},${y0}L${x + w / 2},${y1}L${x - w / 2},${y1}Z`, col, { w: 3 });
    s += `<path d="M${x + w * 0.12},${y0}L${x + w / 2},${y0}L${x + w / 2},${y1}L${x + w * 0.12},${y1}Z" fill="${shade(col, -0.28)}"/>`;
    for (let y = y0 + 40; y < y1 - 20; y += 70) s += L(`M${x - w / 2},${y}L${x + w / 2},${y}`, 2.2, shade(col, -0.45));
    s += P(`M${x - w / 2 - 14},${y0}L${x + w / 2 + 14},${y0}L${x + w / 2 + 6},${y0 + 22}L${x - w / 2 - 6},${y0 + 22}Z`, cap, { w: 2.6 });
    s += P(`M${x - w / 2 - 12},${y1 - 20}L${x + w / 2 + 12},${y1 - 20}L${x + w / 2 + 16},${y1}L${x - w / 2 - 16},${y1}Z`, cap, { w: 2.6 });
    return s;
  }
  function floorTiles(y0, col1, col2) {
    let s = `<rect x="0" y="${y0}" width="${W}" height="${H - y0}" fill="${col1}"/>`;
    for (let i = -12; i <= 12; i++) s += L(`M${640 + i * 30},${y0}L${640 + i * 160},${H}`, 2, col2, 0.7);
    for (let k = 0; k < 6; k++) { const y = y0 + (H - y0) * Math.pow(k / 6, 1.6); s += L(`M0,${f1(y)}L${W},${f1(y)}`, 2, col2, 0.7); }
    return s + `<rect x="0" y="${y0}" width="${W}" height="${(H - y0)}" fill="url(#cbDots)" opacity="0.25"/>`;
  }
  const TIMES = {
    day:   { sky: [[0, '#4fb0e8'], [0.7, '#bfe6f6'], [1, '#fff4d6']], amb: 0 },
    dawn:  { sky: [[0, '#4a5aa8'], [0.5, '#f29a7a'], [1, '#ffd88a']], amb: 0.05 },
    dusk:  { sky: [[0, '#2a2a6a'], [0.45, '#c8406a'], [0.8, '#f2903a'], [1, '#ffd25a']], amb: 0.1 },
    night: { sky: [[0, '#070a24'], [0.6, '#1c2458'], [1, '#3a3a7a']], amb: 0.25 },
  };
  const tint = (time, op) => time === 'night' ? `<rect width="${W}" height="${H}" fill="#0a1040" opacity="${op || 0.35}"/>` : time === 'dusk' ? `<rect width="${W}" height="${H}" fill="#7a2a4a" opacity="${op || 0.12}"/>` : '';

  const SETS = {
    // the depths of space where the column of fire appears
    cosmos(c) {
      let s = sky([[0, '#05030f'], [0.5, '#160a38'], [1, '#2a0a3a']]);
      const r = rng(7);
      for (let i = 0; i < 7; i++) { const x = r() * W, y = r() * H, rr = 120 + r() * 220; s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rr)}" ry="${f1(rr * 0.5)}" fill="${['#5a1a7a', '#1a3a8a', '#8a1a4a', '#1a6a8a'][i % 4]}" opacity="0.32" transform="rotate(${f1(r() * 180)} ${f1(x)} ${f1(y)})"/>`; }
      s += ramp(0, 0, W, H, '#c88aff', 0.2, 1.8, 14, 0.18);
      s += stars(220, 5, H);
      s += speed(640, 360, 70, '#ffffff', 0.05, 240, 9);
      return { back: s };
    },
    // Vishnu's abode in the cosmic ocean
    vaikuntha(c) {
      let s = sky([[0, '#1a2a7a'], [0.5, '#3a6ac8'], [1, '#9ad0f0']]);
      s += ramp(0, 0, W, 300, '#ffffff', 2.6, 0.2, 14, 0.2);
      s += `<circle cx="640" cy="250" r="260" fill="url(#cbGlow)" opacity="0.6"/>`;
      for (const [x, y, k] of [[150, 160, 1.2], [1080, 130, 1.4], [420, 90, 0.9], [880, 220, 1]]) s += cloud(x, y, k, '#f4f8ff');
      // palace silhouette
      let d = 'M200,470L200,330L260,330L260,260L300,200L340,260L340,330L460,330L460,280L520,190L580,140L640,90L700,140L760,190L820,280L820,330L940,330L940,260L980,200L1020,260L1020,330L1080,330L1080,470Z';
      s += P(d, '#f2d68a', { w: 3 }) + `<path d="${d}" fill="url(#cbDots)" opacity="0.2"/>`;
      for (const x of [300, 520, 640, 760, 980]) s += `<rect x="${x - 16}" y="360" width="32" height="70" rx="16" fill="#3a2a6a" stroke="${INK}" stroke-width="2"/>`;
      // the ocean of milk
      s += `<rect x="0" y="470" width="${W}" height="250" fill="#eef4fb"/>`;
      for (let y = 490; y < H; y += 26) s += L(`M0,${y}C200,${y - 10} 300,${y + 10} 640,${y}S1080,${y - 10} ${W},${y}`, 2.4, '#a8c4e0');
      s += P('M0,470L1280,470', 'none', { w: 3 });
      return { back: s };
    },
    brahmaloka(c) {
      let s = sky([[0, '#f29a2a'], [0.6, '#ffd66a'], [1, '#fff3c8']]);
      s += speed(640, 300, 90, '#ffffff', 0.2, 120, 4);
      s += ramp(0, 400, W, H, '#c8641e', 0.3, 2.6, 12, 0.3);
      for (let i = 0; i < 9; i++) { const x = 80 + i * 140, y = 560 + (i % 2) * 40; for (let k = -2; k <= 2; k++) s += `<path transform="rotate(${k * 26} ${x} ${y})" d="M${x},${y}C${x - 18},${y - 20} ${x - 14},${y - 56} ${x},${y - 70}C${x + 14},${y - 56} ${x + 18},${y - 20} ${x},${y}Z" fill="${k % 2 ? '#f59ab8' : '#fbd0de'}" stroke="${INK}" stroke-width="2"/>`; }
      for (const [x, y, k] of [[180, 140, 1], [1100, 180, 1.2]]) s += cloud(x, y, k, '#fff6e0');
      return { back: s };
    },
    kailash(c) {
      const time = c.time || 'night', T = TIMES[time] || TIMES.night;
      let s = sky(T.sky);
      if (time === 'night') { s += stars(140, 11, 380); s += `<circle cx="1050" cy="120" r="48" fill="#fdf6d8" stroke="${INK}" stroke-width="3"/><circle cx="1050" cy="120" r="140" fill="url(#cbGlow)" opacity="0.5"/>`; }
      else s += ramp(0, 0, W, 260, '#ffffff', 2.4, 0.2, 14, 0.25);
      s += mountains(ridge(420, 160, 21, 7), time === 'night' ? '#5a6aa8' : '#9ab8e0', { snow: 360, snowCol: '#eef4ff' });
      // the great peak
      s += P('M380,560L560,240L620,150L660,130L700,160L760,250L940,560Z', time === 'night' ? '#6a7ab8' : '#b8d0ee', { w: 3.4 });
      s += `<path d="M660,130L700,160L760,250L940,560L700,560C720,420 700,240 660,130Z" fill="${time === 'night' ? '#4a5a98' : '#8aa8d0'}"/>`;
      s += P('M560,240L620,150L660,130L700,160L760,250L720,232L690,262L660,226L630,258L600,232Z', '#f6f9ff', { w: 2.6 });
      s += mountains(ridge(560, 70, 23, 10), time === 'night' ? '#3a4a7a' : '#7a9ac0', { snow: 520, snowCol: '#e8f0fa' });
      // a rocky ledge with a deodar or two
      s += P(`M-40,${H}L-40,600C200,580 420,610 640,604C860,598 1080,585 ${W + 40},600L${W + 40},${H}Z`, time === 'night' ? '#3a3a5a' : '#8a8aa0', { w: 3 });
      s += ramp(0, 620, W, H, INK, 0.3, 2.6, 10, 0.3);
      s += pine(90, 610, 1.1, time === 'night' ? '#1a3a3a' : '#2a5a4a') + pine(1200, 606, 1.3, time === 'night' ? '#1a3a3a' : '#2a5a4a');
      return { back: s + tint(time, 0.15) };
    },
    himalaya(c) {
      const time = c.time || 'day', T = TIMES[time] || TIMES.day;
      let s = sky(T.sky);
      if (time === 'night') s += stars(110, 13, 300);
      s += mountains(ridge(330, 150, 31, 8), '#a8bce0', { snow: 260 });
      s += mountains(ridge(450, 110, 33, 9), '#5a8a7a', { snow: 360, snowCol: '#e8f2f0' });
      // the river falling from the heights (Ganga)
      s += P('M840,420C860,500 830,560 870,620L940,720L1060,720L980,620C940,560 930,500 900,420Z', '#8ad0f0', { w: 3 });
      for (let i = 0; i < 6; i++) s += L(`M${860 + i * 8},${440 + i * 10}C${880 + i * 8},520 ${860 + i * 10},580 ${900 + i * 14},680`, 1.6, '#ffffff', 0.7);
      s += P(`M-40,${H}L-40,560C200,540 420,580 640,560C760,550 820,590 850,600L950,720Z`, '#4a7a3a', { w: 3 });
      s += P(`M1000,720L960,620C1060,600 1180,580 ${W + 40},590L${W + 40},${H}Z`, '#4a7a3a', { w: 3 });
      s += ramp(0, 600, W, H, INK, 0.2, 2.2, 10, 0.25);
      for (const [x, y, k] of [[60, 600, 1.2], [180, 580, 0.9], [1180, 610, 1.1], [1100, 640, 0.8]]) s += pine(x, y, k);
      // the mouth of a cave on the left
      s += P('M220,580C220,500 300,470 360,480C420,490 450,540 450,590Z', '#2a2a2a', { w: 3 }) + `<path d="M240,580C250,520 300,500 350,505C400,512 430,550 432,588Z" fill="#0e0a0a"/>`;
      return { back: s + tint(time) };
    },
    court(c) {
      const col = c.col || '#7a1a3a', time = c.time || 'day';
      let s = `<rect width="${W}" height="${H}" fill="${shade(col, -0.35)}"/>`;
      s += ramp(0, 0, W, 520, '#000000', 0.3, 3, 12, 0.25);
      // back wall with arches
      for (let i = 0; i < 5; i++) { const x = 128 + i * 256; s += P(`M${x - 90},520L${x - 90},250C${x - 90},150 ${x + 90},150 ${x + 90},250L${x + 90},520Z`, shade(col, 0.15), { w: 3 }); s += `<path d="M${x - 70},520L${x - 70},260C${x - 70},180 ${x + 70},180 ${x + 70},260L${x + 70},520Z" fill="${time === 'night' ? '#1a1a4a' : '#f2c27a'}"/>` + (time === 'night' ? stars(8, i + 3, 0).replace(/cx="([\d.]+)"/g, (m, v) => `cx="${f1(x - 60 + (v % 120))}"`).replace(/cy="([\d.]+)"/g, (m, v) => `cy="${f1(200 + (v % 200))}"`) : `<circle cx="${x}" cy="300" r="60" fill="url(#cbGlow)" opacity="0.6"/>`); }
      // drapes
      s += P('M0,0L1280,0L1280,40C1100,90 900,40 640,80C380,40 180,90 0,40Z', shade(col, 0.05), { w: 3 });
      s += L('M0,40C180,90 380,40 640,80C900,40 1100,90 1280,40', 4, GOLD);
      for (let i = 0; i <= 6; i++) s += pillar(i * 213, 60, 540, 46, shade(col, -0.1));
      s += floorTiles(540, shade(col, -0.2), shade(col, -0.5));
      s += P('M380,560L900,560L940,600L340,600Z', GOLD, { w: 3 }) + `<path d="M340,600L940,600L940,612L340,612Z" fill="${GOLD_D}"/>`;
      return { back: s + tint(time, 0.25) };
    },
    yajna(c) {
      const time = c.time || 'day', T = TIMES[time] || TIMES.day;
      let s = sky(T.sky);
      s += mountains(ridge(380, 80, 41, 8), '#7a9ac0');
      // the Ganga at Kanakhala and a far bank
      s += `<rect x="0" y="380" width="${W}" height="90" fill="#7ac0e0"/>`;
      for (let y = 392; y < 470; y += 14) s += L(`M0,${y}C300,${y - 4} 500,${y + 4} 800,${y}S1100,${y - 4} 1280,${y}`, 1.6, '#ffffff', 0.6);
      s += P(`M-20,470L1300,470L1300,${H + 10}L-20,${H + 10}Z`, '#d8b07a', { w: 3 });
      s += ramp(0, 480, W, H, '#7a4a1a', 0.3, 2.6, 11, 0.3);
      // pavilion: posts, a canopy with festoons
      for (const x of [140, 420, 860, 1140]) s += P(`M${x - 9},250L${x + 9},250L${x + 9},560L${x - 9},560Z`, '#c8822e', { w: 2.6 }) + L(`M${x - 9},300L${x + 9},320M${x - 9},360L${x + 9},380M${x - 9},420L${x + 9},440`, 2, '#f2c230');
      s += P('M100,250L1180,250L1220,210L60,210Z', '#d21f3c', { w: 3 }) + L('M60,210L1220,210', 4, GOLD);
      for (let i = 0; i < 18; i++) s += L(`M${100 + i * 60},252C${110 + i * 60},270 ${150 + i * 60},270 ${160 + i * 60},252`, 3, i % 2 ? '#f2c230' : '#f27a2a');
      // the altar (the fire itself is drawn live)
      s += P('M520,600L760,600L740,560L540,560Z', '#b8885a', { w: 3 }) + P('M540,560L740,560L720,530L560,530Z', '#d8a878', { w: 3 });
      return { back: s + tint(time) };
    },
    temple(c) {
      let s = `<rect width="${W}" height="${H}" fill="#1a0e10"/>`;
      s += `<circle cx="640" cy="380" r="420" fill="url(#cbWarm)" opacity="0.7"/>`;
      // sanctum doorway
      s += P('M380,720L380,220C380,120 900,120 900,220L900,720Z', '#4a2a1e', { w: 3.4 });
      s += P('M420,720L420,240C420,160 860,160 860,240L860,720Z', '#24120c', { w: 3 });
      for (let i = 0; i < 7; i++) s += L(`M${400 + i * 80},150L${400 + i * 80},170`, 3, GOLD);
      s += ramp(0, 0, W, H, '#000000', 3.2, 0.3, 11, 0.35);
      // carved side pillars
      s += pillar(260, 80, 720, 70, '#5a3a2a', '#b8822e') + pillar(1020, 80, 720, 70, '#5a3a2a', '#b8822e');
      // bells
      for (const x of [470, 810]) s += L(`M${x},120L${x},200`, 2, '#b8822e') + P(`M${x - 14},220C${x - 14},196 ${x + 14},196 ${x + 14},220Z`, GOLD, { w: 2 });
      s += `<rect x="0" y="640" width="${W}" height="80" fill="#2a1814"/>` + L('M0,640L1280,640', 3);
      return { back: s };
    },
    city(c) {
      const time = c.time || 'day', T = TIMES[time] || TIMES.day;
      let s = sky(T.sky);
      if (time === 'night') s += stars(90, 51, 260) + `<circle cx="1120" cy="100" r="34" fill="#fdf6d8" stroke="${INK}" stroke-width="3"/>`;
      const r = rng(c.seed || 61);
      // far skyline of towers and domes
      for (let i = 0; i < 12; i++) { const x = i * 116 + r() * 40, h = 120 + r() * 140, w = 70 + r() * 40, col = time === 'night' ? '#2a2a5a' : '#e8c89a'; s += P(`M${x},420L${x},${420 - h}L${x + w / 2},${420 - h - 40 - r() * 20}L${x + w},${420 - h}L${x + w},420Z`, col, { w: 2.4 }); }
      // street houses
      const cols = time === 'night' ? ['#4a3a6a', '#3a4a6a', '#5a3a4a'] : ['#f2a86a', '#e88a5a', '#f2c27a', '#d88aa0', '#9ac0d8'];
      for (let i = 0; i < 6; i++) {
        const x = i * 220 - 20, h = 200 + r() * 70, col = cols[i % cols.length];
        s += P(`M${x},560L${x},${560 - h}L${x + 200},${560 - h}L${x + 200},560Z`, col, { w: 3 });
        s += P(`M${x - 10},${560 - h}L${x + 100},${520 - h - 40}L${x + 210},${560 - h}Z`, shade(col, -0.25), { w: 3 });
        s += P(`M${x + 70},560L${x + 70},${500}C${x + 70},${470} ${x + 130},${470} ${x + 130},${500}L${x + 130},560Z`, '#3a2414', { w: 2.4 });
        for (const wx of [x + 26, x + 150]) s += `<rect x="${wx}" y="${600 - h}" width="28" height="40" fill="${time === 'night' ? '#ffd66a' : '#4a2a1a'}" stroke="${INK}" stroke-width="2"/>`;
        s += `<path d="M${x + 140},${560 - h}L${x + 200},${560 - h}L${x + 200},560L${x + 140},560Z" fill="url(#cbDots)" opacity="0.35"/>`;
      }
      // bunting
      s += L('M0,330C300,370 900,370 1280,330', 2, INK);
      for (let i = 0; i < 26; i++) { const x = i * 50 + 20, y = 334 + Math.sin(i / 25 * Math.PI) * 30; s += P(`M${x},${y}L${x + 20},${y}L${x + 10},${y + 22}Z`, ['#d21f3c', '#f2c230', '#2e8a57', '#3d6fc4'][i % 4], { w: 1.6 }); }
      s += `<rect x="0" y="560" width="${W}" height="160" fill="${time === 'night' ? '#3a3040' : '#c8a07a'}"/>` + L('M0,560L1280,560', 3);
      s += ramp(0, 570, W, H, INK, 0.3, 2.4, 10, 0.25);
      return { back: s + tint(time) };
    },
    forest(c) {
      const time = c.time || 'day', T = TIMES[time] || TIMES.day;
      let s = sky(T.sky);
      if (time === 'night') s += stars(80, 71, 260);
      for (let i = 0; i < 9; i++) s += tree(i * 160 + 20, 470, 1.1 + (i % 3) * 0.2, '#3a6a4a');
      s += `<rect x="0" y="470" width="${W}" height="250" fill="#6a9a4a"/>` + L('M0,470L1280,470', 3);
      s += ramp(0, 480, W, H, '#1a3a1a', 0.3, 2.6, 11, 0.3);
      // the great banyan
      s += P('M180,600L200,320L250,320L270,600Z', '#6a4a2a', { w: 3 });
      for (let i = 0; i < 6; i++) s += L(`M${120 + i * 40},330L${110 + i * 44},${560 + (i % 2) * 30}`, 2.4, '#5a3a22');
      s += P('M-20,340C0,200 120,140 230,150C340,140 460,200 480,330C420,360 300,340 230,350C140,360 40,370 -20,340Z', '#2e6a3a', { w: 3 });
      s += `<path d="M230,150C340,140 460,200 480,330C420,360 330,345 260,350C320,300 330,220 230,150Z" fill="#1f4a2a"/>`;
      // a hut
      s += P('M900,560L900,470L1060,470L1060,560Z', '#c8a26a', { w: 3 }) + P('M880,480L980,400L1080,480Z', '#9a7a3a', { w: 3 }) + `<rect x="960" y="500" width="40" height="60" fill="#3a2414" stroke="${INK}" stroke-width="2"/>`;
      return { back: s + tint(time) };
    },
    kashi(c) {
      const time = c.time || 'dawn', T = TIMES[time] || TIMES.dawn;
      let s = sky(T.sky);
      s += `<circle cx="300" cy="300" r="70" fill="#ffe08a" stroke="${INK}" stroke-width="3"/><circle cx="300" cy="300" r="200" fill="url(#cbGlow)" opacity="0.6"/>`;
      const r = rng(81);
      for (let i = 0; i < 10; i++) { const x = 500 + i * 80, h = 140 + r() * 120, col = ['#e8b07a', '#f2c27a', '#d8906a'][i % 3]; s += P(`M${x},430L${x},${430 - h}L${x + 30},${430 - h - 50}L${x + 60},${430 - h}L${x + 60},430Z`, col, { w: 2.6 }); s += P(`M${x + 28},${430 - h - 50}L${x + 30},${430 - h - 76}L${x + 34},${430 - h - 50}Z`, '#d21f3c', { w: 1.4 }); }
      for (let k = 0; k < 6; k++) s += `<rect x="460" y="${430 + k * 16}" width="${820}" height="16" fill="${k % 2 ? '#c8a07a' : '#b8906a'}" stroke="${INK}" stroke-width="1.6"/>`;
      s += `<rect x="0" y="526" width="${W}" height="194" fill="#6aa8c8"/>`;
      for (let y = 540; y < H; y += 16) s += L(`M0,${y}C300,${y - 5} 500,${y + 5} 800,${y}S1100,${y - 5} 1280,${y}`, 1.6, '#ffffff', 0.55);
      s += `<path d="M260,540L340,540L330,720L270,720Z" fill="#ffe08a" opacity="0.5"/>`;
      return { back: s + tint(time) };
    },
    hell(c) {
      let s = sky([[0, '#1a0204'], [0.6, '#5a0a0a'], [1, '#a82a0a']]);
      s += speed(640, 900, 60, '#ff6a1a', 0.12, 300, 5);
      s += mountains(ridge(470, 160, 91, 14), '#2a0a0a');
      s += ramp(0, 300, W, H, '#ff5a1a', 0.3, 3, 12, 0.25);
      return { back: s };
    },
    vindhya(c) {
      let s = sky([[0, '#0a1410'], [0.6, '#1a3a2a'], [1, '#4a6a3a']]);
      s += mountains(ridge(380, 180, 101, 7), '#1a2a22');
      s += mountains(ridge(520, 90, 103, 10), '#2a3a2a');
      const r = rng(105);
      for (let i = 0; i < 6; i++) { const x = r() * W, y = 560 + r() * 60; s += L(`M${x},${y}L${x + 6},${y - 140}M${x + 4},${y - 90}L${x + 40},${y - 130}M${x + 5},${y - 110}L${x - 30},${y - 150}`, 6, '#120c0a'); }
      s += `<rect x="0" y="600" width="${W}" height="120" fill="#1a1a14"/>` + ramp(0, 380, W, 640, '#9ae08a', 3, 0.2, 13, 0.12);
      return { back: s };
    },
    sky(c) {
      const time = c.time || 'day', T = TIMES[time] || TIMES.day;
      let s = sky(T.sky);
      if (time === 'night') s += stars(160, 111, H);
      s += ramp(0, 0, W, H, '#ffffff', 2.4, 0.2, 14, time === 'night' ? 0.06 : 0.2);
      for (const [x, y, k] of [[120, 560, 1.6], [500, 640, 2], [960, 600, 1.8], [1200, 680, 1.4], [760, 200, 0.9], [260, 180, 0.8]]) s += cloud(x, y, k, time === 'night' ? '#4a4a8a' : '#ffffff');
      return { back: s };
    },
    void(c) {
      const col = c.col || '#120a1a';
      let s = `<rect width="${W}" height="${H}" fill="${col}"/>`;
      s += speed(640, 360, 120, c.lines || '#ffffff', 0.12, 140, 13);
      return { back: s };
    },
    card(c) {
      const col = c.col || '#c8281e';
      let s = `<rect width="${W}" height="${H}" fill="${col}"/>`;
      s += speed(640, 360, 80, '#000000', 0.12, 80, 17);
      s += ramp(0, 0, W, H, '#000000', 0.2, 3.2, 12, 0.22);
      return { back: s };
    },
    pond(c) {   // a lotus lake (Mena's prayers, the mountain's gardens)
      const time = c.time || 'day', T = TIMES[time] || TIMES.day;
      let s = sky(T.sky);
      s += mountains(ridge(380, 140, 121, 8), '#a8bce0', { snow: 300 });
      s += `<rect x="0" y="420" width="${W}" height="300" fill="#4a9ac0"/>` + L('M0,420L1280,420', 3);
      for (let y = 440; y < H; y += 18) s += L(`M0,${y}C300,${y - 5} 500,${y + 5} 800,${y}S1100,${y - 5} 1280,${y}`, 1.6, '#ffffff', 0.5);
      const r = rng(123);
      for (let i = 0; i < 14; i++) { const x = r() * W, y = 470 + r() * 230; s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="40" ry="12" fill="#3f8a3a" stroke="${INK}" stroke-width="2"/>`; if (i % 2) s += `<path d="M${f1(x)},${f1(y - 4)}C${f1(x - 12)},${f1(y - 20)} ${f1(x - 6)},${f1(y - 36)} ${f1(x)},${f1(y - 40)}C${f1(x + 6)},${f1(y - 36)} ${f1(x + 12)},${f1(y - 20)} ${f1(x)},${f1(y - 4)}Z" fill="#f59ab8" stroke="${INK}" stroke-width="2"/>`; }
      return { back: s + tint(time) };
    },
  };
  window.CBSets = { SETS, rng, ramp, speed, cloud, stars };
})();
