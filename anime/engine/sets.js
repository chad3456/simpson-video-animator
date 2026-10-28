/* Painted backgrounds for the anime engine. Each set returns:
     back(ctx)       static painted layer behind the characters (rasterised once per scene look, so it can be rich)
     front(ctx)      optional static layer in front of the characters (railings, desks, seat backs)
     dyn(ctx, T)     live layer behind the characters (water shimmer, washer drums, flicker, signs with web fonts)
     dynFront(ctx,T) live layer in front of the characters
     slots           named character positions {x, y, s, pose}
     light(ctx)      {amb, amt, key}: how lamplight tints the characters
   ctx = {time: night|dusk|day|dawn, weather: clear|rain|storm|snow, season: summer|autumn|winter|spring, gap, ...}
   World space is 1280x720. Loaded before anime.js; exposes window.AnimeSets. */
(function () {
  const W = 1280, H = 720;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const f1 = v => Math.round(v * 10) / 10;
  function hash(str) { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let s = hash(seed) || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
  const rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, c => c + c); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const hex = a => '#' + a.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, p) => { const x = rgb(a), y = rgb(b); return hex(x.map((v, i) => lerp(v, y[i], p))); };
  let gid = 0; const nid = p => 's' + p + (gid++);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- painterly helpers ----------
  function lin(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
    const id = nid('lg');
    return [`url(#${id})`, `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ''}/>`).join('')}</linearGradient>`];
  }
  function rad(cx, cy, r, color, op = 0.6, mid = 0.35) {
    const id = nid('rg');
    return `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="${mid}" stop-color="${color}" stop-opacity="${op * 0.35}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="url(#${id})"/>`;
  }
  function erad(cx, cy, rx, ry, color, op = 0.6) {
    const id = nid('er');
    return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="0.5" stop-color="${color}" stop-opacity="${op * 0.4}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="url(#${id})"/>`;
  }
  const blurDef = (sd) => { const id = nid('bl'); return [id, `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`]; };
  // watercolour paper grain, baked into the raster
  function grain(op = 0.08, seed = 3) {
    const id = nid('gr');
    return `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 ${op}"/></feComponentTransfer></filter><rect width="${W}" height="${H}" filter="url(#${id})" style="mix-blend-mode:multiply"/>` +
      (() => { const id2 = nid('gb'); return `<filter id="${id2}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="3" seed="${seed + 7}"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 ${op * 0.9}"/></feComponentTransfer></filter><rect width="${W}" height="${H}" filter="url(#${id2})" style="mix-blend-mode:soft-light"/>`; })();
  }
  // a soft cumulus made of overlapping puffs, lit from above
  function cloud(cx, cy, w, h, base, lit, seed, op = 1) {
    const r = rng(seed); let s = '', sh = '';
    const n = 7 + Math.floor(w / 60);
    for (let i = 0; i < n; i++) {
      const x = cx - w / 2 + (i + 0.5) * w / n + (r() - 0.5) * 20, py = cy - Math.sin((i + 0.5) / n * Math.PI) * h * (0.5 + r() * 0.4);
      const rr = h * (0.35 + r() * 0.35) * (0.6 + Math.sin((i + 0.5) / n * Math.PI) * 0.6);
      s += `<circle cx="${f1(x)}" cy="${f1(py)}" r="${f1(rr)}"/>`;
      sh += `<circle cx="${f1(x - rr * 0.15)}" cy="${f1(py - rr * 0.25)}" r="${f1(rr * 0.8)}"/>`;
    }
    const [bid, bdef] = blurDef(2.2);
    return `${bdef}<g filter="url(#${bid})" opacity="${op}"><g fill="${base}">${s}<rect x="${f1(cx - w / 2)}" y="${f1(cy - h * 0.25)}" width="${f1(w)}" height="${f1(h * 0.3)}" rx="${f1(h * 0.15)}"/></g><g fill="${lit}" opacity="0.55">${sh}</g></g>`;
  }
  function stars(n, seed, y0, y1, color = '#fff7e0') {
    const r = rng(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const x = r() * W, y = y0 + Math.pow(r(), 1.4) * (y1 - y0), rr = 0.5 + r() * r() * 1.8;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${color}" opacity="${f1(0.35 + r() * 0.6)}"/>`;
      if (rr > 1.7) s += `<path d="M${f1(x - 5)} ${f1(y)}H${f1(x + 5)}M${f1(x)} ${f1(y - 5)}V${f1(y + 5)}" stroke="${color}" stroke-width="0.6" opacity="0.5"/>`;
    }
    return s;
  }
  function moon(x, y, r, color = '#fff4d6', phase = 0.0) {
    return rad(x, y, r * 7, '#c8d8ff', 0.22, 0.25) + rad(x, y, r * 2.4, '#fff0c8', 0.35, 0.3) +
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>` +
      `<circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.22}" fill="#e9dcb8" opacity="0.5"/><circle cx="${x + r * 0.35}" cy="${y + r * 0.3}" r="${r * 0.16}" fill="#e9dcb8" opacity="0.45"/><circle cx="${x + r * 0.1}" cy="${y - r * 0.45}" r="${r * 0.1}" fill="#e9dcb8" opacity="0.4"/>` +
      (phase ? `<circle cx="${x + r * phase}" cy="${y - r * 0.1}" r="${r}" fill="#0e1a3c" opacity="0.92"/>` : '');
  }

  // ---------- skies by time of day ----------
  const SKY = {
    night: { stops: [[0, '#081129'], [0.45, '#14275a'], [0.8, '#2d4a85'], [1, '#55628f']], cloud: ['#22355f', '#6d82b8'], star: 1, glow: '#7b6f9a' },
    dusk: { stops: [[0, '#2b2d6b'], [0.4, '#6a4c8f'], [0.72, '#e48a7a'], [1, '#ffcf91']], cloud: ['#8a5f8f', '#ffc49a'], star: 0.25, glow: '#ffb27a' },
    day: { stops: [[0, '#4f9be0'], [0.6, '#9fd0f0'], [1, '#e9f6ff']], cloud: ['#dfeaf6', '#ffffff'], star: 0, glow: '#ffffff' },
    dawn: { stops: [[0, '#5e7fc0'], [0.5, '#b6b9e0'], [0.8, '#f6c9c4'], [1, '#ffe2b8']], cloud: ['#c9b6d6', '#fff0dc'], star: 0.1, glow: '#ffe0b0' },
    storm: { stops: [[0, '#0a0f1c'], [0.5, '#1a2236'], [1, '#2e3850']], cloud: ['#1d2538', '#3a4560'], star: 0, glow: '#3a4560' },
    snow: { stops: [[0, '#1a2040'], [0.5, '#3a4570'], [1, '#7a83a8']], cloud: ['#4a5580', '#8a93b8'], star: 0.15, glow: '#9aa3c8' },
  };
  const skyKey = c => c.weather === 'storm' || c.weather === 'rain' ? (c.time === 'day' ? 'day' : 'storm') : c.weather === 'snow' && c.time === 'night' ? 'snow' : (c.time || 'night');
  function sky(c, y1 = H, opts = {}) {
    const k = SKY[skyKey(c)] || SKY.night;
    const [fill, def] = lin(k.stops.map(([o, col]) => [o, col]));
    let s = def + `<rect width="${W}" height="${f1(y1)}" fill="${fill}"/>`;
    if (k.star) s += `<g opacity="${k.star}">${stars(opts.stars || 160, 'st' + (opts.seed || 1), 0, y1 * 0.85)}</g>`;
    if ((c.time === 'night' || !c.time) && c.weather !== 'storm' && c.weather !== 'rain' && opts.moon !== false) s += moon(opts.mx || 1010, opts.my || 110, opts.mr || 30, '#fff4d6', c.moonPhase || 0);
    if (c.time === 'day' && c.weather !== 'rain') s += rad(opts.mx || 1050, opts.my || 90, 220, '#fffbe8', 0.65, 0.2);
    const r = rng('cl' + (opts.seed || 1));
    const nc = c.weather === 'storm' || c.weather === 'rain' ? 9 : (opts.clouds ?? 4);
    for (let i = 0; i < nc; i++) {
      const cx = r() * W, cy = 60 + r() * y1 * 0.45, w = 180 + r() * 320, h = 40 + r() * 50;
      s += cloud(cx, cy, w, h, k.cloud[0], k.cloud[1], 'c' + i + (opts.seed || 1), c.weather === 'storm' ? 1 : 0.85);
    }
    s += erad(W / 2, y1, W * 0.7, y1 * 0.35, k.glow, 0.35);
    return s;
  }

  // ---------- reusable painted props ----------
  function windowsRow(x, y, w, h, n, seed, litP = 0.45, warm = '#ffd98a') {
    const r = rng(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const wx = x + (i + 0.5) * w / n - 5, wy = y + r() * h;
      if (r() < litP) s += `<rect x="${f1(wx)}" y="${f1(wy)}" width="${f1(4 + r() * 6)}" height="${f1(4 + r() * 5)}" fill="${warm}" opacity="${f1(0.55 + r() * 0.45)}"/>`;
    }
    return s;
  }
  function townSilhouette(y, c, seed, col, litP = 0.4) {
    const r = rng(seed); let s = '', x = -20, p = `M-20 ${H}`;
    while (x < W + 40) {
      const bw = 30 + r() * 70, bh = 30 + r() * 90 + (r() < 0.12 ? 80 : 0);
      p += `L${f1(x)} ${f1(y - bh)}L${f1(x + bw)} ${f1(y - bh)}`;
      if (c.time !== 'day') for (let k = 0; k < bw / 14; k++) for (let j = 0; j < bh / 16; j++) if (r() < litP * 0.35) s += `<rect x="${f1(x + 4 + k * 14)}" y="${f1(y - bh + 6 + j * 16)}" width="5" height="6" fill="#ffd98a" opacity="${f1(0.4 + r() * 0.6)}"/>`;
      x += bw;
    }
    p += `L${W + 40} ${H}Z`;
    return `<path d="${p}" fill="${col}"/>` + s;
  }
  function pole(x, y0, y1, col = '#1b2238') {
    return `<rect x="${x - 6}" y="${y0}" width="12" height="${y1 - y0}" fill="${col}"/><rect x="${x - 34}" y="${y0 + 18}" width="68" height="6" fill="${col}"/><rect x="${x - 26}" y="${y0 + 44}" width="52" height="5" fill="${col}"/>` +
      `<circle cx="${x - 30}" cy="${y0 + 14}" r="3.5" fill="${col}"/><circle cx="${x + 30}" cy="${y0 + 14}" r="3.5" fill="${col}"/><rect x="${x + 8}" y="${y0 + 70}" width="20" height="26" rx="3" fill="${col}"/>`;
  }
  function wires(pts, col = '#141a2c', sag = 30) {
    let s = '';
    for (let k = 0; k < 3; k++) {
      let d = `M${pts[0][0]} ${pts[0][1] + k * 9}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        d += `Q${f1((x0 + x1) / 2)} ${f1((y0 + y1) / 2 + sag + k * 6)} ${x1} ${y1 + k * 9}`;
      }
      s += `<path d="${d}" fill="none" stroke="${col}" stroke-width="${1.6 - k * 0.3}"/>`;
    }
    return s;
  }
  function lamp(x, yTop, yBase, glowOn = true, col = '#2a3044') {
    return `<rect x="${x - 4}" y="${yTop}" width="8" height="${yBase - yTop}" fill="${col}"/><path d="M${x} ${yTop}q0 -22 26 -22h8" fill="none" stroke="${col}" stroke-width="6"/>` +
      `<path d="M${x + 22} ${yTop - 26}h24l-4 10h-16z" fill="${col}"/>` +
      (glowOn ? `<ellipse cx="${x + 34}" cy="${yTop - 14}" rx="9" ry="4" fill="#fff3c4"/>` + rad(x + 34, yTop - 12, 160, '#ffd98a', 0.5, 0.25) : '');
  }
  function lampCone(x, yTop, yBase, w = 170) {
    const [fill, def] = lin([[0, '#ffe7a8', 0.38], [1, '#ffe7a8', 0.0]]);
    return def + `<path d="M${x + 26} ${yTop - 12}L${x + 46} ${yTop - 12}L${x + 36 + w} ${yBase}L${x + 36 - w} ${yBase}Z" fill="${fill}"/>` + erad(x + 36, yBase, w * 1.1, 26, '#ffdf9a', 0.45);
  }
  function vending(x, y, w = 92, h = 150) {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#d9dde3"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="none" stroke="#5a6070" stroke-width="2"/>`;
    s += rad(x + w / 2, y + h * 0.4, 150, '#f4fbff', 0.6, 0.25);
    s += `<rect x="${x + 6}" y="${y + 8}" width="${w - 12}" height="${h * 0.55}" fill="#f7fbff"/>`;
    const cols = ['#c0392b', '#2d6cb5', '#e1a43b', '#3a8f5a', '#6b4a3a', '#e8e1c8'];
    for (let row = 0; row < 3; row++) for (let i = 0; i < 5; i++) {
      const cx = x + 13 + i * ((w - 26) / 4), cy = y + 22 + row * (h * 0.17);
      s += `<rect x="${f1(cx - 5)}" y="${f1(cy - 9)}" width="10" height="18" rx="2" fill="${cols[(row * 5 + i * 2) % cols.length]}"/><rect x="${f1(cx - 4)}" y="${f1(cy + 12)}" width="8" height="3" fill="#2d7fd6"/>`;
    }
    s += `<rect x="${x + 10}" y="${y + h * 0.72}" width="${w - 20}" height="${h * 0.16}" rx="2" fill="#2a2f3a"/><rect x="${x + w - 26}" y="${y + h * 0.62}" width="12" height="8" fill="#ff5a3a"/>`;
    return s;
  }
  function tree(x, y, season, scale = 1, seed = 't') {
    const r = rng(seed); let s = '';
    const trunk = '#2e2626';
    s += `<path d="M${x - 14 * scale} ${y}C${x - 10 * scale} ${y - 80 * scale} ${x - 30 * scale} ${y - 150 * scale} ${x - 10 * scale} ${y - 230 * scale}L${x + 6 * scale} ${y - 228 * scale}C${x - 6 * scale} ${y - 150 * scale} ${x + 12 * scale} ${y - 80 * scale} ${x + 14 * scale} ${y}Z" fill="${trunk}"/>`;
    const br = [[-0.9, 170, 120], [-0.4, 200, 150], [0.3, 190, 140], [0.8, 160, 110], [-0.1, 230, 90]];
    for (const [a, l, yy] of br) s += `<path d="M${x} ${y - yy * scale}Q${f1(x + a * l * 0.5 * scale)} ${f1(y - (yy + 60) * scale)} ${f1(x + a * l * scale)} ${f1(y - (yy + l * 0.55) * scale)}" stroke="${trunk}" stroke-width="${f1(5 * scale)}" fill="none" stroke-linecap="round"/>`;
    if (season === 'winter') return s;
    const pal = { summer: ['#1f4a3a', '#2f6b4a', '#4f8f5a'], autumn: ['#7a2e22', '#c0582e', '#e39a3c'], spring: ['#d98fa8', '#f2b8c8', '#ffe0ea'] }[season] || ['#1f4a3a', '#2f6b4a', '#4f8f5a'];
    const n = season === 'autumn' ? 26 : 40;
    const [bid, bdef] = blurDef(1.2);
    let leaves = '';
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r());
      const cx = x + Math.cos(a) * 170 * d * scale, cy = y - 300 * scale + Math.sin(a) * 110 * d * scale;
      leaves += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1((26 + r() * 30) * scale)}" fill="${pal[Math.floor(r() * 3)]}" opacity="${f1(0.75 + r() * 0.25)}"/>`;
    }
    return s + bdef + `<g filter="url(#${bid})">${leaves}</g>`;
  }
  function canal(y0, c, glows = []) {
    const k = SKY[skyKey(c)] || SKY.night;
    const [fill, def] = lin([[0, mix(k.stops[k.stops.length - 1][1], '#0a1428', 0.45)], [1, mix(k.stops[0][1], '#050a18', 0.4)]]);
    let s = def + `<rect x="0" y="${y0}" width="${W}" height="${H - y0}" fill="${fill}"/>`;
    for (const [gx, col, w] of glows) s += erad(gx, y0 + (H - y0) * 0.45, w || 40, (H - y0) * 0.5, col, 0.35);
    return s;
  }
  function shimmer(T, y0, y1, xs, seed, col = '#ffe0a0') {   // live: wobbling light streaks on water
    const r = rng(seed); let s = '';
    for (const [x, w, cc] of xs) {
      for (let i = 0; i < 9; i++) {
        const yy = y0 + (i + 0.5) * (y1 - y0) / 9, ph = r() * 6, ww = w * (0.4 + r() * 0.8) * (1 - i / 14);
        const dx = Math.sin(T * (0.8 + r()) + ph) * 6;
        s += `<rect x="${f1(x - ww / 2 + dx)}" y="${f1(yy)}" width="${f1(ww)}" height="2.2" rx="1.1" fill="${cc || col}" opacity="${f1(0.25 + 0.3 * (0.5 + 0.5 * Math.sin(T * 1.7 + ph)))}"/>`;
      }
    }
    return s;
  }
  function wallText(x, y, s, size, o = {}) {
    return `<text x="${x}" y="${y}" font-family="${o.font || 'Nunito, sans-serif'}" font-size="${size}" font-weight="${o.weight || 800}" fill="${o.fill || '#333'}" text-anchor="${o.anchor || 'middle'}"${o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${esc(s)}</text>`;
  }

  // ---------- washer and dryer ----------
  function washer(x, y, w, h, label) {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#eceee8"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="#9aa09a" stroke-width="2"/>`;
    s += `<rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="30" rx="5" fill="#d7dbd4"/><rect x="${x + 12}" y="${y + 12}" width="34" height="14" rx="2" fill="#2f3a35"/><circle cx="${x + w - 22}" cy="${y + 19}" r="7" fill="#b9bfb8" stroke="#8a908a"/><rect x="${x + w - 50}" y="${y + 13}" width="14" height="12" rx="2" fill="#c8a24a"/>`;
    const cx = x + w / 2, cy = y + 34 + (h - 34) / 2 + 4, R = Math.min(w, h - 34) * 0.36;
    s += `<circle cx="${cx}" cy="${cy}" r="${R + 9}" fill="#c7ccc6" stroke="#8d938d" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#26303a"/>`;
    s += `<path d="M${f1(cx - R * 0.6)} ${f1(cy - R * 0.5)}A${R} ${R} 0 0 1 ${f1(cx + R * 0.3)} ${f1(cy - R * 0.85)}" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.35"/>`;
    s += `<rect x="${x + 6}" y="${y + h - 8}" width="${w - 12}" height="5" fill="#b9beb6"/>`;
    return s;
  }
  function drum(T, cx, cy, R, cols, speed, seed) {   // live: tumbling laundry behind the porthole glass
    const r = rng(seed); let s = `<clipPath id="${nid('dc')}"></clipPath>`;
    const id = nid('dr');
    s = `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath><g clip-path="url(#${id})"><circle cx="${cx}" cy="${cy}" r="${R}" fill="#3b4a5a"/>`;
    const a0 = T * speed;
    for (let i = 0; i < cols.length; i++) {
      const a = a0 + i * 2.3 + r() * 0.6, d = R * (0.45 + r() * 0.3);
      const fall = Math.max(0, Math.sin(a)) * R * 0.25;
      const px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d * 0.7 + fall;
      s += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(R * (0.4 + r() * 0.2))}" ry="${f1(R * 0.26)}" fill="${cols[i]}" transform="rotate(${f1(a * 57 % 360)} ${f1(px)} ${f1(py)})"/>`;
    }
    s += `<ellipse cx="${cx}" cy="${cy + R * 0.75}" rx="${R}" ry="${R * 0.35}" fill="#a9c8de" opacity="0.35"/></g>`;
    s += `<path d="M${f1(cx - R * 0.65)} ${f1(cy - R * 0.45)}A${R} ${R} 0 0 1 ${f1(cx + R * 0.25)} ${f1(cy - R * 0.85)}" stroke="#fff" stroke-width="4" fill="none" opacity="0.4"/>`;
    return s;
  }

  // ===================== SETS =====================
  const SETS = {};

  // ---- coin laundry, inside ----
  const WASHERS = [[205, 140], [345, 140], [485, 140], [625, 140], [765, 140]];
  SETS.laundry_int = {
    slots(c) {
      const g = c.gap == null ? 200 : c.gap;
      return { benchL: { x: 600 - g, y: 548, pose: 'sit' }, benchR: { x: 600 + g, y: 548, pose: 'sit' }, benchC: { x: 600, y: 548, pose: 'sit' },
        standL: { x: 360, y: 650, pose: 'stand' }, standR: { x: 860, y: 650, pose: 'stand' }, door: { x: 110, y: 650, pose: 'stand' },
        cat_dryer: { x: 1050, y: 262 }, cat_bench: { x: 600, y: 548 }, cat_floor: { x: 980, y: 660 } };
    },
    light: c => ({ amb: '#d7ecff', amt: 0.06, key: '#ffffff' }),
    back(c) {
      let s = '';
      const [wall, wdef] = lin([[0, '#f3efdf'], [0.6, '#e6e1cd'], [1, '#d6d0ba']]);
      s += wdef + `<rect width="${W}" height="610" fill="${wall}"/>`;
      // tiled wainscot
      s += `<rect y="380" width="${W}" height="230" fill="#c6dccf"/>`;
      for (let x = 0; x < W; x += 34) s += `<path d="M${x} 380V610" stroke="#a9c2b5" stroke-width="1.2"/>`;
      for (let y = 380; y < 610; y += 34) s += `<path d="M0 ${y}H${W}" stroke="#a9c2b5" stroke-width="1.2"/>`;
      s += `<rect y="376" width="${W}" height="8" fill="#9fb8aa"/>`;
      // ceiling and tubes
      s += `<rect width="${W}" height="46" fill="#e9e6d8"/><rect y="46" width="${W}" height="4" fill="#cfcab4"/>`;
      for (const x of [240, 700]) s += `<rect x="${x}" y="52" width="300" height="14" rx="7" fill="#ffffff"/>` + erad(x + 150, 66, 420, 170, '#ffffff', 0.55);
      // window / glass door on the left with night outside
      s += `<rect x="18" y="120" width="176" height="490" fill="#8f9a9c"/>`;
      const [nfill, ndef] = lin([[0, '#0d1834'], [0.7, '#1e325e'], [1, '#2a3a5a']]);
      s += ndef + `<rect x="28" y="130" width="156" height="470" fill="${nfill}"/>`;
      s += rad(150, 260, 90, '#ffd98a', 0.55) + `<rect x="146" y="280" width="5" height="320" fill="#121a2c"/>`;
      s += `<path d="M28 520 Q110 500 184 515 V600 H28Z" fill="#0b1222" opacity="0.8"/>` + `<rect x="28" y="364" width="156" height="6" fill="#8f9a9c"/><rect x="100" y="130" width="6" height="470" fill="#8f9a9c"/>`;
      s += `<path d="M40 150 L90 150 L40 260Z" fill="#ffffff" opacity="0.08"/><path d="M120 380 L176 380 L120 470Z" fill="#ffffff" opacity="0.06"/>`;
      s += `<rect x="120" y="420" width="56" height="6" rx="3" fill="#c9cdd0"/>`;
      // wall posters and clock
      s += `<rect x="236" y="168" width="120" height="150" rx="3" fill="#fbf6e8" stroke="#c9bfa4"/><rect x="246" y="180" width="100" height="58" fill="#cfe1ea"/><circle cx="296" cy="208" r="18" fill="#f2c14e" opacity="0.8"/>`;
      s += `<rect x="252" y="250" width="88" height="5" fill="#b9ad8e"/><rect x="252" y="262" width="70" height="5" fill="#b9ad8e"/><rect x="252" y="274" width="80" height="5" fill="#b9ad8e"/>`;
      s += `<rect x="780" y="150" width="150" height="104" rx="3" fill="#fff8ec" stroke="#cbbf9e"/>`;
      s += `<circle cx="620" cy="190" r="40" fill="#fbfaf4" stroke="#8a8270" stroke-width="5"/>`;
      // washers
      for (const [x] of WASHERS) s += washer(x, 405, 128, 196);
      // dryers on the right, two stacks
      for (const [x, y] of [[960, 270], [1110, 270], [960, 440], [1110, 440]]) s += washer(x, y, 140, 166);
      s += `<rect x="955" y="264" width="300" height="8" fill="#b8bdb4"/>`;
      // counter under the window side
      s += `<rect x="18" y="604" width="${W}" height="10" fill="#9b9786"/>`;
      // floor
      const [ffill, fdef] = lin([[0, '#cfcab8'], [1, '#a9a490']]);
      s += fdef + `<rect y="610" width="${W}" height="110" fill="${ffill}"/>`;
      for (let i = -12; i <= 12; i++) s += `<path d="M${640 + i * 60} 610L${640 + i * 150} 720" stroke="#9b967f" stroke-width="1.2" opacity="0.6"/>`;
      for (const y of [628, 652, 682]) s += `<path d="M0 ${y}H${W}" stroke="#9b967f" stroke-width="1.2" opacity="0.6"/>`;
      // the bench
      s += `<rect x="300" y="590" width="16" height="70" fill="#5a4030"/><rect x="884" y="590" width="16" height="70" fill="#5a4030"/>` + erad(600, 664, 340, 16, '#3a3020', 0.4);
      s += `<rect x="286" y="540" width="628" height="20" rx="5" fill="#a87a50"/><rect x="286" y="556" width="628" height="34" rx="4" fill="#8a5f3c"/><path d="M290 548H910" stroke="#c4986a" stroke-width="3"/><path d="M292 573H908" stroke="#6f4a2e" stroke-width="2"/>`;
      // light pools
      s += erad(600, 610, 640, 60, '#ffffff', 0.25);
      return s + grain(0.07, 11);
    },
    dyn(c, T) {
      let s = '';
      const runA = c.washers || [1, 3];
      WASHERS.forEach(([x], i) => { if (runA.includes(i)) s += drum(T, x + 64, 405 + 34 + 162 / 2 + 4, 128 * 0.36, ['#e8e2d0', '#5a7fa8', '#f2c14e', '#e8e2d0', '#b8323a', '#7a8a6a'].slice(0, 4 + (i % 2)), i === 1 ? 2.2 : 1.6, 'w' + i); });
      if (c.dryer !== false) s += drum(T, 1030, 270 + 34 + 132 / 2 + 4, 140 * 0.36 * 0.94, ['#d9d2c0', '#7d93ad', '#d9d2c0'], 3.1, 'dr');
      // clock hands: slow, real minutes
      const mins = (c.clock || 22.25) * 60 + T / 60;
      const ma = (mins % 60) / 60 * 360, ha = ((mins / 60) % 12) / 12 * 360;
      s += `<path d="M620 190L${f1(620 + Math.sin(ha * Math.PI / 180) * 20)} ${f1(190 - Math.cos(ha * Math.PI / 180) * 20)}" stroke="#2a2a2a" stroke-width="4" stroke-linecap="round"/><path d="M620 190L${f1(620 + Math.sin(ma * Math.PI / 180) * 30)} ${f1(190 - Math.cos(ma * Math.PI / 180) * 30)}" stroke="#2a2a2a" stroke-width="2.5" stroke-linecap="round"/><circle cx="620" cy="190" r="3" fill="#c0392b"/>`;
      // signs (live text so they use the web fonts)
      s += wallText(296, 300, 'PLEASE DO NOT', 10, { fill: '#7a6a4a' }) + wallText(296, 312, 'LEAVE LAUNDRY', 10, { fill: '#7a6a4a' });
      s += wallText(855, 178, 'コインランドリー 星空', 15, { font: 'Mincho, serif', fill: '#3a3428', weight: 400 }) + wallText(855, 202, 'OPEN 24 HOURS', 14, { fill: '#7a5a3a' }) + wallText(855, 226, 'WASH 300 YEN', 13, { fill: '#5a6a7a' });
      const fixed = c.signFixed;
      s += `<g transform="rotate(-3 1180 305)"><rect x="1128" y="286" width="104" height="44" fill="#fffbe6" stroke="#d9cfa0"/><rect x="1170" y="281" width="22" height="10" fill="#e8e0b0" opacity="0.8"/>` +
        wallText(1180, 304, fixed ? 'DRYER 10 MINUTES' : 'DRYER 10 MINUTS', fixed ? 9.5 : 10.5, { fill: '#c0392b', font: 'Caveat, cursive', weight: 700 }) + wallText(1180, 322, '100 YEN', 12, { fill: '#c0392b', font: 'Caveat, cursive', weight: 700 }) +
        (fixed ? `<path d="M1206 296l3 -6" stroke="#2a3a8a" stroke-width="1.4"/>` : '') + `</g>`;
      // fluorescent flicker (rare)
      const fl = (Math.sin(T * 13.1) > 0.995 && Math.sin(T * 0.7) > 0.6) ? 0.12 : 0;
      if (fl) s += `<rect width="${W}" height="${H}" fill="#000" opacity="${fl}"/>`;
      // weather on the window
      if (c.weather === 'rain' || c.weather === 'storm') s += rainOn(T, 28, 130, 156, 470, 'win', 0.6);
      if (c.weather === 'snow') s += snowOn(T, 28, 130, 156, 470, 'win', 40);
      return s;
    },
  };

  function rainOn(T, x, y, w, h, seed, op = 0.5, n = 70, len = 26, slope = 0.18) {
    const r = rng('rain' + seed); let s = '';
    for (let i = 0; i < n; i++) {
      const sp = 900 + r() * 400, ph = r() * h;
      const yy = y + ((ph + T * sp) % (h + len)) - len, xx = x + r() * w + (yy - y) * slope;
      s += `<path d="M${f1(xx)} ${f1(yy)}l${f1(len * slope)} ${len}" stroke="#cfe0ff" stroke-width="${f1(0.8 + r())}" opacity="${f1(op * (0.4 + r() * 0.6))}"/>`;
    }
    const id = nid('rc');
    return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${s}</g>`;
  }
  function snowOn(T, x, y, w, h, seed, n = 90, op = 0.9) {
    const r = rng('snow' + seed); let s = '';
    for (let i = 0; i < n; i++) {
      const sp = 22 + r() * 40, ph = r() * h, rr = 1 + r() * 2.8;
      const yy = y + ((ph + T * sp) % (h + 10)) - 5, xx = x + ((r() * w + Math.sin(T * (0.5 + r()) + i) * 14) % w + w) % w;
      s += `<circle cx="${f1(xx)}" cy="${f1(yy)}" r="${f1(rr)}" fill="#ffffff" opacity="${f1(op * (0.5 + r() * 0.5))}"/>`;
    }
    const id = nid('sc');
    return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${s}</g>`;
  }
  function petals(T, n, seed, col = ['#f7c6d4', '#ffe3ec'], speed = 40) {
    const r = rng('pt' + seed); let s = '';
    for (let i = 0; i < n; i++) {
      const sp = speed * (0.6 + r() * 0.8), ph = r() * (H + 40);
      const yy = ((ph + T * sp) % (H + 40)) - 20, xx = ((r() * W + T * sp * 0.7 + Math.sin(T * (0.6 + r()) + i) * 30) % (W + 40) + W + 40) % (W + 40) - 20;
      const rot = (T * 90 * (r() - 0.5) + i * 40) % 360;
      s += `<ellipse cx="${f1(xx)}" cy="${f1(yy)}" rx="${f1(4 + r() * 3)}" ry="${f1(2.2 + r() * 1.4)}" fill="${col[i % col.length]}" transform="rotate(${f1(rot)} ${f1(xx)} ${f1(yy)})" opacity="0.9"/>`;
    }
    return s;
  }
  function leavesFall(T, n, seed) { return petals(T, n, 'lf' + seed, ['#c0582e', '#e39a3c', '#8a3a22'], 50); }
  function fireflies(T, n, seed, x0 = 0, x1 = W, y0 = 300, y1 = 640) {
    const r = rng('ff' + seed); let s = '';
    for (let i = 0; i < n; i++) {
      const bx = x0 + r() * (x1 - x0), by = y0 + r() * (y1 - y0), ph = r() * 6;
      const x = bx + Math.sin(T * 0.4 + ph) * 40, y = by + Math.cos(T * 0.31 + ph * 2) * 25;
      const on = Math.max(0, Math.sin(T * (0.9 + r()) + ph));
      if (on > 0.05) s += rad(x, y, 14, '#d9ff8a', 0.7 * on, 0.2) + `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.8" fill="#f4ffc8" opacity="${f1(on)}"/>`;
    }
    return s;
  }
  function moths(T, cx, cy, n = 3) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = T * (2.5 + i * 0.7) + i * 2, x = cx + Math.cos(a) * (14 + i * 6), y = cy + Math.sin(a * 1.3) * (10 + i * 4);
      s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="2.4" ry="1.4" fill="#fff6dc" opacity="0.8"/>`;
    }
    return s;
  }
  function weather(c, T, seed = 'w') {
    if (c.weather === 'rain') return rainOn(T, 0, 0, W, H, seed, 0.45, 160, 34, 0.12);
    if (c.weather === 'storm') return rainOn(T, 0, 0, W, H, seed, 0.6, 260, 40, 0.3) + (Math.sin(T * 0.9) > 0.985 ? `<rect width="${W}" height="${H}" fill="#dfe8ff" opacity="0.35"/>` : '');
    if (c.weather === 'snow') return snowOn(T, 0, 0, W, H, seed, 140);
    if (c.season === 'spring' && c.petals !== false) return petals(T, 22, seed);
    if (c.season === 'autumn' && c.leaves) return leavesFall(T, 10, seed);
    return '';
  }

  // ---- coin laundry, outside on the canal ----
  SETS.laundry_ext = {
    slots: c => ({ benchL: { x: 905, y: 538, s: 0.62, pose: 'sit' }, benchR: { x: 1010 - Math.max(0, 140 - (c.gap || 200)) * 0.2, y: 538, s: 0.62, pose: 'sit' },
      standL: { x: 820, y: 600, s: 0.62, pose: 'stand' }, standR: { x: 960, y: 600, s: 0.62, pose: 'stand' }, door: { x: 470, y: 600, s: 0.62, pose: 'stand' }, farR: { x: 1200, y: 610, s: 0.5, pose: 'stand' },
      cat_bench: { x: 958, y: 538, s: 0.6 }, cat_floor: { x: 760, y: 602, s: 0.6 } }),
    light: c => c.time === 'day' ? { amb: '#ffffff', amt: 0.02 } : { amb: '#3a4a7c', amt: 0.18, key: '#ffd98a' },
    back(c) {
      let s = sky(c, 460, { mx: 1060, my: 96, seed: 2 });
      s += townSilhouette(430, c, 'town1', mix('#1a2448', SKY[skyKey(c)].stops[2][1], 0.25), 0.5);
      s += wires([[-20, 150], [300, 132], [700, 160], [1300, 140]], '#111827', 22);
      s += pole(300, 120, 610, '#141b2e');
      // building
      s += `<rect x="120" y="150" width="600" height="450" fill="#5a5a66"/><rect x="120" y="150" width="600" height="160" fill="#4b4b58"/>`;
      s += `<rect x="110" y="140" width="620" height="14" fill="#3a3a46"/>`;
      for (const x of [180, 420]) s += `<rect x="${x}" y="190" width="150" height="90" fill="#2a2f44"/><rect x="${x + 70}" y="190" width="6" height="90" fill="#4b4b58"/>` + (x === 420 ? `<rect x="${x}" y="190" width="150" height="90" fill="#ffcf80" opacity="0.55"/><rect x="${x + 12}" y="196" width="40" height="80" fill="#c05a3a" opacity="0.5"/>` : '');
      s += `<rect x="610" y="200" width="70" height="44" fill="#9aa0a8"/><rect x="616" y="206" width="58" height="32" fill="#7a808a"/>`;   // aircon
      // lit storefront
      s += `<rect x="140" y="330" width="560" height="60" fill="#e9efe6"/>` + rad(420, 360, 340, '#f6fff2', 0.5, 0.2);
      s += `<rect x="140" y="390" width="560" height="210" fill="#2a3036"/>`;
      s += `<rect x="150" y="398" width="540" height="196" fill="#e8f2e4"/>` + rad(420, 480, 320, '#ffffff', 0.6, 0.3);
      for (let i = 0; i < 4; i++) s += `<rect x="${170 + i * 100}" y="470" width="86" height="120" rx="6" fill="#cfd8cf" stroke="#9aa79c"/><circle cx="${213 + i * 100}" cy="532" r="26" fill="#55687a"/>`;
      s += `<rect x="580" y="430" width="96" height="160" rx="6" fill="#cfd8cf" stroke="#9aa79c"/><circle cx="628" cy="500" r="30" fill="#55687a"/>`;
      s += `<rect x="150" y="398" width="540" height="6" fill="#c9d4c6"/>` + [330, 510].map(x => `<rect x="${x}" y="398" width="6" height="196" fill="#3a4046"/>`).join('');
      s += `<path d="M170 410 L240 410 L170 520Z" fill="#fff" opacity="0.18"/><path d="M520 410 L560 410 L520 470Z" fill="#fff" opacity="0.14"/>`;
      // spill of light on the pavement
      s += `<rect y="600" width="${W}" height="30" fill="#2c3346"/>` + erad(420, 612, 360, 34, '#f0ffe8', 0.45);
      s += `<rect y="626" width="${W}" height="8" fill="#5a6070"/>`;
      // bicycle by the door
      s += `<g stroke="#1b2032" stroke-width="3" fill="none"><circle cx="90" cy="582" r="18"/><circle cx="150" cy="582" r="18"/><path d="M90 582L110 556L140 556L150 582M110 556L120 582L140 556M108 548h12M140 556l-4 -12h10"/></g>`;
      // vending machine, bench, lamp
      s += vending(745, 430, 96, 170);
      s += `<rect x="868" y="530" width="180" height="12" rx="4" fill="#7a5a40"/><rect x="868" y="540" width="180" height="14" fill="#5f4430"/><rect x="878" y="552" width="8" height="48" fill="#3a2a20"/><rect x="1030" y="552" width="8" height="48" fill="#3a2a20"/><rect x="868" y="500" width="180" height="10" rx="3" fill="#7a5a40"/>`;
      s += lamp(1090, 330, 600, true) + lampCone(1090, 330, 600, 170);
      s += tree(1215, 610, c.season, 1.0, 'cherry');
      // canal edge and water
      s += `<rect y="634" width="${W}" height="10" fill="#7a7a80"/>` + [60, 180, 300, 420, 540, 660, 780, 900, 1020, 1140, 1260].map(x => `<rect x="${x}" y="606" width="6" height="30" fill="#6a6a72"/>`).join('') + `<rect y="604" width="${W}" height="5" fill="#7a7a84"/>`;
      s += canal(644, c, [[420, '#e8ffe0', 200], [1124, '#ffd98a', 80], [790, '#f4fbff', 60]]);
      return s + grain(0.08, 21);
    },
    dyn(c, T) {
      let s = '';
      const fl = 0.85 + 0.15 * Math.sin(T * 3.1);
      s += `<rect x="168" y="336" width="504" height="48" rx="4" fill="#fdfff8"/>` + wallText(420, 368, 'COIN LAUNDRY  ·  24H', 26, { fill: '#2f5a8a', weight: 900, ls: 2 });
      s += wallText(420, 324, 'コインランドリー 星空', 20, { font: 'Mincho, serif', fill: '#fff3c8', weight: 400, op: f1(fl) });
      s += moths(T, 1124, 318);
      s += shimmer(T, 650, 715, [[420, 220, '#e8ffe0'], [1124, 70, '#ffd98a'], [790, 50, '#f4fbff'], [1060, 30, '#fff4d6']], 'ext');
      if (c.season === 'summer' && c.time === 'night' && !c.weather) s += fireflies(T, 8, 'ext', 900, 1280, 420, 640);
      s += weather(c, T, 'ext');
      return s;
    },
  };

  // ---- the canal bridge (they stand at the railing) ----
  SETS.bridge = {
    slots: c => { const g = (c.gap == null ? 200 : c.gap) * 0.7; return { railL: { x: 640 - g, y: 640, s: 1, pose: 'stand' }, railR: { x: 640 + g, y: 640, s: 1, pose: 'stand' }, farL: { x: 380, y: 640, s: 1, pose: 'stand' }, farR: { x: 1000, y: 640, s: 1, pose: 'stand' } }; },
    light: c => c.time === 'day' ? { amb: '#ffffff', amt: 0.03 } : c.time === 'dusk' ? { amb: '#8a5a7a', amt: 0.14 } : { amb: '#3a4a7c', amt: 0.17 },
    back(c) {
      let s = sky(c, 420, { mx: 900, my: 120, mr: 34, seed: 5, clouds: 5 });
      s += townSilhouette(400, c, 'farbank', mix('#141c38', SKY[skyKey(c)].stops[1][1], 0.3), 0.6);
      s += `<rect y="396" width="${W}" height="10" fill="#1a2238"/>`;
      s += `<rect x="70" y="350" width="90" height="46" fill="#e8f2e4" opacity="0.9"/>` + rad(115, 372, 120, '#efffe8', 0.4);
      s += canal(404, c, [[900, '#fff4d6', 60], [115, '#efffe8', 50], [500, '#ffd98a', 30]]);
      s += pole(1180, 160, 400, '#11172a') + wires([[1180, 172], [1400, 190]], '#11172a', 10) + wires([[-40, 120], [1180, 172]], '#11172a', 26);
      return s + grain(0.07, 31);
    },
    front(c) {
      let s = '';
      s += `<rect y="545" width="${W}" height="175" fill="#4a4e5e"/><rect y="545" width="${W}" height="10" fill="#6a6e80"/>`;
      s += `<rect y="470" width="${W}" height="16" rx="4" fill="#7a7f90"/><rect y="484" width="${W}" height="6" fill="#4a4e5e"/>`;
      for (let x = 20; x < W; x += 46) s += `<rect x="${x}" y="488" width="12" height="58" fill="#626778"/><rect x="${x + 2}" y="488" width="4" height="58" fill="#7c8192"/>`;
      s += `<rect x="40" y="380" width="20" height="170" fill="#55596a"/><rect x="1220" y="380" width="20" height="170" fill="#55596a"/>`;
      if (c.time !== 'day') s += rad(50, 372, 120, '#ffe0a0', 0.55) + `<circle cx="50" cy="372" r="12" fill="#fff4cf"/>` + rad(1230, 372, 120, '#ffe0a0', 0.55) + `<circle cx="1230" cy="372" r="12" fill="#fff4cf"/>`;
      else s += `<circle cx="50" cy="372" r="12" fill="#e0e4ea"/><circle cx="1230" cy="372" r="12" fill="#e0e4ea"/>`;
      s += `<path d="M0 470H${W}" stroke="#9aa0b0" stroke-width="2"/>`;
      return s;
    },
    dyn(c, T) {
      return shimmer(T, 412, 540, [[900, 90, '#fff4d6'], [115, 70, '#efffe8'], [500, 40, '#ffd98a'], [760, 26, '#ffd98a']], 'br') + (c.season === 'summer' && c.time === 'night' && !c.weather ? fireflies(T, 6, 'br', 0, W, 380, 470) : '');
    },
    dynFront: (c, T) => weather(c, T, 'br'),
  };

  // ---- night street (walking home) ----
  SETS.street = {
    slots: c => ({ walkL: { x: 560, y: 650, s: 0.9, pose: 'stand' }, walkR: { x: 720, y: 650, s: 0.9, pose: 'stand' }, standL: { x: 520, y: 650, s: 0.9, pose: 'stand' }, standR: { x: 760, y: 650, s: 0.9, pose: 'stand' } }),
    light: c => ({ amb: '#3a4a7c', amt: 0.18 }),
    back(c) {
      let s = sky(c, 380, { mx: 640, my: 90, mr: 22, seed: 9, clouds: 3 });
      // road in perspective
      s += `<path d="M0 720L560 380H720L1280 720Z" fill="#2a2f40"/>` + `<path d="M638 380L620 720" stroke="#c9c2a0" stroke-width="3" stroke-dasharray="26 22" opacity="0.6"/>`;
      s += `<path d="M0 720L560 380L0 380Z" fill="#232838"/><path d="M1280 720L720 380L1280 380Z" fill="#232838"/>`;
      // houses left/right, block walls, gates
      const L = [[0, 180, 300, 200], [180, 250, 210, 150], [330, 300, 130, 110], [430, 330, 90, 70]];
      for (const [x, y, w, h] of L) {
        s += `<path d="M${x} ${y}L${x + w / 2} ${y - 40 * w / 300}L${x + w} ${y}V${y + h * 1.8}H${x}Z" fill="#363b52"/>` + `<rect x="${x + w * 0.2}" y="${y + h * 0.3}" width="${w * 0.25}" height="${h * 0.3}" fill="#ffcf7a" opacity="0.75"/>`;
        s += `<path d="M${x + w * 0.2} ${y + h * 0.3}h${w * 0.25}" stroke="#2a2a3a"/>`;
      }
      for (const [x, y, w, h] of L) { const X = W - x - w; s += `<path d="M${X} ${y}L${X + w / 2} ${y - 40 * w / 300}L${X + w} ${y}V${y + h * 1.8}H${X}Z" fill="#323750"/>` + `<rect x="${X + w * 0.55}" y="${y + h * 0.3}" width="${w * 0.22}" height="${h * 0.3}" fill="#ffcf7a" opacity="${x === 180 ? 0.15 : 0.7}"/>`; }
      s += `<path d="M0 560L560 400V420L0 620Z" fill="#4a4e60"/><path d="M1280 560L720 400V420L1280 620Z" fill="#4a4e60"/>`;
      s += vending(1000, 470, 70, 120);
      s += pole(230, 140, 640) + pole(1060, 150, 640) + pole(500, 300, 420) + wires([[-30, 150], [230, 152], [500, 312], [640, 360]], '#111827', 16) + wires([[1300, 150], [1060, 162], [780, 330], [640, 360]], '#111827', 16);
      s += lamp(330, 330, 590) + lampCone(330, 330, 650, 140) + lamp(880, 380, 470, true);
      s += erad(640, 384, 60, 20, '#ffffff', 0.4);   // convenience store far away
      return s + grain(0.08, 41);
    },
    dyn: (c, T) => weather(c, T, 'st') + moths(T, 364, 318, 2),
  };

  // ---- sky shot (cutaways, OP, endings) ----
  SETS.sky = {
    slots: () => ({}), light: () => ({ amb: '#2c3a66', amt: 0.3 }),
    back(c) { let s = sky(c, H, { mx: 820, my: 260, mr: 48, seed: 13, stars: 260, clouds: 6 }); s += townSilhouette(720, c, 'roofs', '#0c1226', 0.4); s += wires([[-20, 600], [700, 640], [1300, 590]], '#0a0f1e', 30); return s + grain(0.06, 51); },
    dyn: (c, T) => weather(c, T, 'sky'),
  };

  // ---- Itsuki's room ----
  SETS.room_him = {
    slots: () => ({ desk: { x: 640, y: 640, s: 1.3, pose: 'sit' }, floor: { x: 900, y: 650, pose: 'stand' } }),
    light: () => ({ amb: '#ffb870', amt: 0.12 }),
    back(c) {
      let s = `<rect width="${W}" height="${H}" fill="#4a4038"/>`;
      const [wfill, wdef] = lin([[0, '#5a4e42'], [1, '#3e352e']]);
      s += wdef + `<rect width="${W}" height="${H}" fill="${wfill}"/>`;
      // window with night city
      s += `<rect x="420" y="80" width="440" height="300" fill="#2a2420"/>`;
      s += `<svg x="430" y="90" width="420" height="280" viewBox="0 0 ${W} ${H * 0.66}" preserveAspectRatio="xMidYMid slice">${sky(c, H * 0.66, { mx: 900, my: 120, seed: 61, clouds: 2 })}${townSilhouette(H * 0.66, c, 'rhtown', '#141a30', 0.6)}</svg>`;
      s += `<rect x="636" y="90" width="8" height="280" fill="#2a2420"/><rect x="430" y="226" width="420" height="6" fill="#2a2420"/>`;
      s += `<path d="M420 80h110v300h-110z" fill="#8a7a6a" opacity="0.65"/>`;   // curtain
      // shelves crammed with books
      for (const [x, y] of [[60, 120], [60, 260], [60, 400], [1000, 140], [1000, 290]]) {
        s += `<rect x="${x}" y="${y + 110}" width="230" height="10" fill="#3a2a20"/>`;
        const r = rng('bk' + x + y); let bx = x + 6;
        while (bx < x + 222) { const bw = 10 + r() * 14, bh = 70 + r() * 36; s += `<rect x="${f1(bx)}" y="${f1(y + 110 - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="${['#7a3a2a', '#2f4a5a', '#c9b48a', '#5a6a3a', '#8a7a5a', '#3a3a4a'][Math.floor(r() * 6)]}"/>`; bx += bw + 1; }
      }
      s += `<rect x="40" y="560" width="300" height="90" fill="#3a2e26"/>` + [0, 1, 2, 3].map(i => `<rect x="${60 + i * 60}" y="${520 - i * 6}" width="50" height="${40 + i * 6}" fill="${['#c9b48a', '#7a3a2a', '#e8e0cc', '#5a6a3a'][i]}"/>`).join('');
      s += rad(640, 470, 520, '#ffc070', 0.35, 0.3);
      return s + grain(0.08, 61);
    },
    front(c) {
      let s = `<rect x="200" y="540" width="880" height="26" rx="4" fill="#8a6440"/><rect x="220" y="566" width="840" height="160" fill="#6a4a30"/><path d="M200 546H1080" stroke="#a87c52" stroke-width="3"/>`;
      s += `<path d="M900 540l40 -110h18l-24 110z" fill="#2a2a2a"/><path d="M930 440q40 -40 80 -10l-20 30q-30 -16 -50 6z" fill="#3a3a3a"/>` + rad(985, 450, 260, '#ffcf80', 0.45, 0.25) + `<ellipse cx="985" cy="455" rx="16" ry="6" fill="#fff0c0"/>`;
      s += `<rect x="300" y="520" width="150" height="22" fill="#f4efe0" transform="rotate(-4 375 531)"/><rect x="306" y="510" width="150" height="22" fill="#fbf7ec" transform="rotate(3 381 521)"/>`;
      s += `<rect x="760" y="514" width="44" height="28" rx="3" fill="#4a3a30"/><path d="M804 522q12 0 12 9t-12 9" stroke="#4a3a30" stroke-width="4" fill="none"/>`;
      return s;
    },
    dyn: (c, T) => (c.weather ? `<svg x="430" y="90" width="420" height="280" viewBox="0 0 420 280">${c.weather === 'snow' ? snowOn(T, 0, 0, 420, 280, 'rh', 40) : rainOn(T, 0, 0, 420, 280, 'rh', 0.5, 50)}</svg>` : ''),
  };

  // ---- Mio's room ----
  SETS.room_her = {
    slots: () => ({ desk: { x: 640, y: 640, s: 1.3, pose: 'sit' } }),
    light: () => ({ amb: '#ffc890', amt: 0.1 }),
    back(c) {
      const [wfill, wdef] = lin([[0, '#6a6a8a'], [1, '#4a4a66']]);
      let s = wdef + `<rect width="${W}" height="${H}" fill="${wfill}"/>`;
      s += `<rect x="440" y="70" width="400" height="300" fill="#e8e0d0"/><svg x="452" y="82" width="376" height="276" viewBox="0 0 ${W} ${H * 0.7}" preserveAspectRatio="xMidYMid slice">${sky(c, H * 0.7, { mx: 400, my: 160, mr: 40, seed: 71, stars: 300, clouds: 2 })}${townSilhouette(H * 0.7, c, 'hertown', '#1a1a34', 0.4)}</svg>`;
      s += `<rect x="636" y="82" width="8" height="276" fill="#e8e0d0"/>`;
      // string lights
      let d = 'M440 70'; for (let i = 0; i <= 8; i++) d += `Q${470 + i * 50 - 25} ${92} ${470 + i * 50} 76`;
      s += `<path d="${d}" stroke="#3a3a4a" fill="none" stroke-width="1.5"/>` + Array.from({ length: 9 }, (_, i) => rad(470 + i * 50, 84, 22, '#ffe08a', 0.8, 0.2) + `<circle cx="${470 + i * 50}" cy="84" r="4" fill="#fff0b0"/>`).join('');
      // grandfather's shelf, and boxes still not unpacked
      s += `<rect x="40" y="90" width="280" height="460" fill="#5a3e2a"/>`;
      for (let k = 0; k < 4; k++) {
        const y = 110 + k * 110; s += `<rect x="50" y="${y + 92}" width="260" height="10" fill="#3a2818"/>`;
        const r = rng('gb' + k); let bx = 56;
        while (bx < 300) { const bw = 12 + r() * 12, bh = 66 + r() * 24; s += `<rect x="${f1(bx)}" y="${f1(y + 92 - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="${['#6a2a22', '#2a3a5a', '#7a6a4a', '#3a5a3a', '#8a4a2a'][Math.floor(r() * 5)]}"/><rect x="${f1(bx + 2)}" y="${f1(y + 92 - bh + 8)}" width="${f1(bw - 4)}" height="3" fill="#d9b86a" opacity="0.7"/>`; bx += bw + 1; }
      }
      s += `<rect x="960" y="430" width="220" height="140" fill="#c9a77a"/><rect x="960" y="430" width="220" height="16" fill="#b8956a"/><rect x="1000" y="330" width="170" height="104" fill="#d4b285"/><rect x="1000" y="330" width="170" height="14" fill="#c09e70"/>`;
      s += `<rect x="1020" y="620" width="200" height="40" rx="6" fill="#e6a8b8"/>`;
      s += rad(640, 480, 520, '#ffd090', 0.32, 0.3);
      return s + grain(0.07, 71);
    },
    front(c) {
      let s = `<rect x="220" y="540" width="840" height="24" rx="4" fill="#c9a87a"/><rect x="240" y="564" width="800" height="160" fill="#a8865a"/><path d="M220 546H1060" stroke="#e0c49a" stroke-width="3"/>`;
      s += `<path d="M330 540l30 -100h14l-20 100z" fill="#f2d8a0"/><path d="M350 450q40 -40 80 -10l-20 30q-30 -16 -50 6z" fill="#f2c870"/>` + rad(400, 462, 240, '#ffd890', 0.45, 0.25);
      s += `<rect x="860" y="470" width="90" height="72" rx="4" fill="#5a4030"/><rect x="868" y="478" width="74" height="56" fill="#e8dcc4"/>`;   // photo frame
      s += `<circle cx="890" cy="500" r="10" fill="#d9c0a0"/><path d="M878 534q12 -26 24 0" fill="#7a6a5a"/><circle cx="916" cy="512" r="7" fill="#e8c8a8"/><path d="M908 534q8 -16 16 0" fill="#e0a93b"/>`;
      return s;
    },
    dyn: (c, T) => '',
  };

  // ---- local train (afternoon) ----
  SETS.train = {
    slots: () => ({ seatL: { x: 480, y: 560, pose: 'sit' }, seatR: { x: 760, y: 560, pose: 'sit' }, seatC: { x: 640, y: 560, pose: 'sit' } }),
    light: c => c.time === 'night' ? { amb: '#d0e0ff', amt: 0.08 } : { amb: '#ffd8a8', amt: 0.1 },
    back(c) {
      let s = `<rect width="${W}" height="${H}" fill="#cfcabb"/><rect y="0" width="${W}" height="70" fill="#e8e4d8"/>`;
      s += `<rect x="60" y="120" width="1160" height="250" rx="16" fill="#8a8a80"/>`;
      s += `<rect y="380" width="${W}" height="200" fill="#bfb8a6"/><rect y="440" width="${W}" height="110" rx="10" fill="#4a6a8a"/><rect y="440" width="${W}" height="16" rx="8" fill="#5a7a9a"/>`;
      s += `<rect y="580" width="${W}" height="140" fill="#8a8578"/>`;
      for (let x = 100; x < W; x += 240) s += `<path d="M${x} 72v40" stroke="#8a8a8a" stroke-width="2"/><ellipse cx="${x}" cy="118" rx="12" ry="8" fill="none" stroke="#8a8a8a" stroke-width="3"/>`;
      return s + grain(0.06, 81);
    },
    dyn(c, T) {
      // the landscape scrolls past in the window band
      const id = nid('tw');
      let land = sky(Object.assign({}, c, { weather: c.weather }), 250, { seed: 83, clouds: 3, mx: 900, my: 60 });
      const off = (T * 160) % 400;
      for (let i = -1; i < 6; i++) { const x = i * 400 - off; land += `<path d="M${x} 250Q${x + 100} ${150} ${x + 200} 200T${x + 400} 190V250Z" fill="${c.time === 'dusk' ? '#5a4a6a' : '#6a9a6a'}"/>`; }
      const off2 = (T * 600) % 300;
      for (let i = -1; i < 7; i++) { const x = i * 300 - off2; land += `<rect x="${x}" y="40" width="5" height="210" fill="#3a3a3a" opacity="0.8"/>`; }
      land += `<path d="M0 60Q320 80 640 60T1280 60" stroke="#2a2a2a" fill="none" opacity="0.6"/>`;
      return `<svg x="72" y="132" width="1136" height="226" viewBox="0 0 1280 250" preserveAspectRatio="none"><clipPath id="${id}"><rect width="1280" height="250" rx="10"/></clipPath><g clip-path="url(#${id})">${land}</g></svg>` +
        [400, 880].map(x => `<rect x="${x}" y="132" width="12" height="226" fill="#8a8a80"/>`).join('');
    },
  };

  // ---- care home (Itsuki's mother) ----
  SETS.carehome = {
    slots: () => ({ chairL: { x: 470, y: 560, pose: 'sit' }, chairR: { x: 790, y: 560, pose: 'sit' } }),
    light: () => ({ amb: '#fff2d8', amt: 0.06 }),
    back(c) {
      let s = `<rect width="${W}" height="${H}" fill="#efe6d4"/><rect y="460" width="${W}" height="260" fill="#d9ccb0"/>`;
      s += `<rect x="360" y="70" width="560" height="360" fill="#f8f4ea"/><svg x="372" y="82" width="536" height="336" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${sky({ time: 'day', season: c.season }, H, { seed: 91, clouds: 3 })}<rect y="520" width="${W}" height="200" fill="#a8c890"/>${tree(640, 700, 'spring', 1.6, 'plum')}</svg>`;
      s += `<rect x="636" y="82" width="8" height="336" fill="#f8f4ea"/><path d="M300 60h80v400h-80z" fill="#e8d0b0"/><path d="M900 60h80v400h-80z" fill="#e8d0b0"/>`;
      s += `<path d="M350 430h580l60 40H290z" fill="#f2ecdf"/>`;
      s += `<rect x="1000" y="380" width="160" height="200" rx="8" fill="#c9b090"/><rect x="1030" y="330" width="40" height="60" rx="6" fill="#e8f0f8"/><path d="M1050 330q-30 -40 -10 -60q10 30 30 10q0 30 -20 50" fill="#7aa86a"/>`;
      for (const x of [470, 790]) s += `<rect x="${x - 90}" y="450" width="180" height="130" rx="20" fill="#b89a7a"/><rect x="${x - 80}" y="540" width="160" height="40" rx="10" fill="#a8896a"/>`;
      s += rad(640, 260, 700, '#fff6dc', 0.4, 0.3);
      return s + grain(0.06, 91);
    },
    dyn: (c, T) => petals(T, 6, 'ch', ['#ffffff', '#f7d6e0'], 18).replace(/<ellipse/g, '<ellipse opacity="0.8"'),
  };

  // ---- station platform (early morning) ----
  SETS.station = {
    slots: c => ({ platL: { x: 520, y: 640, pose: 'stand' }, platR: { x: 780, y: 640, pose: 'stand' }, door: { x: 980, y: 640, pose: 'stand' } }),
    light: c => ({ amb: '#ffd8c0', amt: 0.1 }),
    back(c) {
      let s = sky(c, 520, { seed: 101, mx: 200, my: 220, clouds: 4 });
      s += townSilhouette(470, c, 'stn', '#6a6080', 0.1);
      s += `<rect y="450" width="${W}" height="80" fill="#6a6a78"/><rect x="760" y="300" width="560" height="230" rx="18" fill="#e8e4dc"/><rect x="760" y="420" width="560" height="14" fill="#3a8a5a"/><rect x="760" y="436" width="560" height="6" fill="#e0a83a"/>`;
      for (let i = 0; i < 4; i++) s += `<rect x="${800 + i * 130}" y="330" width="90" height="70" rx="6" fill="#9ab4c8"/>`;
      s += `<rect x="1000" y="330" width="60" height="190" fill="#c8d0d8" stroke="#8a9098"/>`;
      s += `<rect y="530" width="${W}" height="190" fill="#b8b0a0"/><rect y="530" width="${W}" height="14" fill="#e8d870"/>` + Array.from({ length: 40 }, (_, i) => `<rect x="${i * 34}" y="533" width="18" height="8" fill="#c8b840"/>`).join('');
      s += `<rect y="0" width="${W}" height="50" fill="#6a6878"/>` + [120, 460, 800, 1140].map(x => `<rect x="${x}" y="50" width="16" height="480" fill="#7a7888"/>`).join('');
      s += `<rect x="190" y="150" width="240" height="70" rx="6" fill="#fafafa" stroke="#4a5a8a" stroke-width="4"/>`;
      return s + grain(0.06, 101);
    },
    dyn: (c, T) => wallText(310, 182, c.station === 'tokyo' ? '東京' : '川辺', 30, { font: 'Mincho, serif', fill: '#222', weight: 400 }) + wallText(310, 208, c.station === 'tokyo' ? 'TOKYO' : 'KAWABE', 16, { fill: '#4a5a8a', weight: 900, ls: 4 }) + weather(c, T, 'stn'),
  };

  // ---- painted card backdrop (titles, next-episode) ----
  SETS.card = {
    slots: () => ({}), light: () => ({ amb: '#000', amt: 0 }),
    back(c) { let s = sky(c, H, { seed: 111, stars: 200, mx: 1000, my: 160, mr: 30, clouds: 5 }); s += townSilhouette(720, c, 'cardtown', '#0c1226', 0.35); return s + grain(0.08, 111); },
    dyn: (c, T) => weather(c, T, 'card'),
  };

  window.AnimeSets = { SETS, sky, rad, erad, lin, cloud, moon, stars, washer, drum, petals, snowOn, rainOn, fireflies, weather, wallText, grain, tree, vending, mix, rng, hash, nid: p => nid(p), resetIds: () => { gid = 0; } };
})();
