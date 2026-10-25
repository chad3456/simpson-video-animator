/* Cinema look for LUMEN documentaries (meta.look: "cinema").
   Adds letterbox bars with source lines, film grain and flicker, archive palettes, rooms and corridors drawn in one-point
   perspective, maps of South Asia and the Islamic world (Natural Earth, public domain; see geo.js), aged documents,
   newspapers, dossier cards, claim verdicts, typewriter supers, a seance table, and intertitle / chapter / title / rolling
   credit cards. Everything is original vector art; real photographs can be dropped in with the "photo" element.
   Loaded after explainer.js; registers itself through Toon.ext. */
(function () {
  const X = window.Toon.ext;
  const { W, H, clamp, lerp, ease, easeOut, back, f1, rng, mix, shade, tint, esc, circ, ell, rrect, glow, vgrad, vignette, dust, nid } = X;
  const SERIF = "'Playfair Display', Georgia, serif", TYPE = "'Special Elite', 'Courier New', monospace", BEBAS = "'Bebas Neue', Impact, sans-serif", SANS = X.FONT;
  const FONTS = { serif: SERIF, type: TYPE, bebas: BEBAS, sans: SANS };
  const BAR = 58;                                   // letterbox bar height (about 2:1 picture)
  const RED = '#d7263d', GOLD = '#d9b26a', PAPER = '#e8dcc0', INKC = '#2b2118';
  const cinema = () => (X.EP && X.EP.meta && X.EP.meta.look) === 'cinema';

  function T(s, x, y, size, o = {}) {
    const lines = String(s).split('\n'), lh = size * (o.lh || 1.18), y0 = y - (lines.length - 1) * lh / 2;
    const font = FONTS[o.font] || o.font || SANS;
    return lines.map((l, i) => `<text x="${f1(x)}" y="${f1(y0 + i * lh)}" font-family="${font}" font-size="${size}" font-weight="${o.weight || 400}"${o.italic ? ' font-style="italic"' : ''} fill="${o.fill || '#f4ecdc'}" text-anchor="${o.anchor || 'middle'}" dominant-baseline="central"${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}>${esc(l)}</text>`).join('');
  }
  const TW = (s, size, weight, font) => X.textW(s, size, weight || 400, FONTS[font] || font || SANS);
  const typed = (s, n) => { s = String(s); return s.slice(0, Math.max(0, Math.floor(n))); };

  // ---------- palettes ----------
  Object.assign(X.PAL, {
    archive: { top: '#0d0a07', bot: '#3b2a1a', glow: '#e3a857', fx: '#f3d9a8' },
    ink: { top: '#040507', bot: '#161a22', glow: '#8aa0b8', fx: '#cfd8e3' },
    blood: { top: '#0b0304', bot: '#3d0b10', glow: '#e0393e', fx: '#ffb3a8' },
    smoke: { top: '#0e0f12', bot: '#2a2d33', glow: '#cbbf9f', fx: '#e8e0cc' },
    jade: { top: '#04100c', bot: '#123b30', glow: '#5fbf9a', fx: '#c8f0dd' },
    sepia: { top: '#1a120a', bot: '#5a4128', glow: '#f0c27a', fx: '#fbe3b8' },
  });

  // ---------- backgrounds ----------
  X.BG.void = (bg, t, cam, P) => {
    const [fill, def] = vgrad(P.top, P.bot);
    return def + `<rect x="-20" y="-20" width="${W + 40}" height="${H + 40}" fill="${fill}"/>` + glow(640 - cam.px * 0.1, 260, 560, P.glow, 0.16) + dust(t, 40, 'voiddust', P.fx, 0.2, cam) + vignette(0.7);
  };
  /* A dark room under one hanging lamp: back wall, floor, a cone of light with motes in it. */
  X.BG.room = (bg, t, cam, P) => {
    const lx = 640 - cam.px * 0.2, floorY = 520;
    const [wall, d1] = vgrad(shade(P.top, 0.1), P.bot), [flo, d2] = vgrad(shade(P.bot, 0.35), P.top);
    let s = d1 + d2 + `<rect x="-20" y="-20" width="${W + 40}" height="${floorY + 20}" fill="${wall}"/><rect x="-20" y="${floorY}" width="${W + 40}" height="${H - floorY + 20}" fill="${flo}"/>`;
    for (let i = -6; i <= 6; i++) s += `<path d="M${f1(lx + i * 60)} ${floorY}L${f1(lx + i * 260)} ${H + 20}" stroke="${P.glow}" stroke-opacity="0.05" stroke-width="2"/>`;
    const sway = Math.sin(t * 0.7) * 6, by = 170;
    s += `<path d="M${f1(lx)} -10V${by - 30}" stroke="#000" stroke-width="2.5"/><path d="M${f1(lx - 34 + sway * 0.2)} ${by}L${f1(lx - 16)} ${by - 32}H${f1(lx + 16)}L${f1(lx + 34 + sway * 0.2)} ${by}Z" fill="#14110d"/>`;
    const g = nid('cone');
    s += `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.glow}" stop-opacity="0.38"/><stop offset="1" stop-color="${P.glow}" stop-opacity="0.02"/></linearGradient>`;
    s += `<path d="M${f1(lx - 32 + sway * 0.2)} ${by}L${f1(lx - 330)} ${H + 20}H${f1(lx + 330)}L${f1(lx + 32 + sway * 0.2)} ${by}Z" fill="url(#${g})"/>`;
    s += glow(lx, by + 4, 120, tint(P.glow, 0.5), 0.8) + `<ellipse cx="${f1(lx)}" cy="${by + 2}" rx="20" ry="6" fill="${tint(P.glow, 0.8)}"/>`;
    s += glow(lx, floorY + 70, 360, P.glow, 0.16);
    const r = rng('motes');
    for (let i = 0; i < 46; i++) {
      const yy = by + 20 + ((r() * 560 + t * (4 + r() * 6)) % 560), spread = (yy - by) / (H - by) * 300, xx = lx + (r() - 0.5) * 2 * spread + Math.sin(t * 0.5 + i) * 6;
      s += `<circle cx="${f1(xx)}" cy="${f1(yy)}" r="${f1(0.8 + r() * 1.6)}" fill="${P.fx}" opacity="${f1(0.15 + r() * 0.35)}"/>`;
    }
    return s + vignette(0.75);
  };
  /* One-point perspective archive corridor; shelves of files slide past to fake a slow dolly forward. */
  X.BG.corridor = (bg, t, cam, P) => {
    const vx = 640 - cam.px * 0.3, vy = 330 - cam.py * 0.3, speed = (bg && bg.speed) == null ? 0.06 : bg.speed;
    const [wall, d1] = vgrad(P.top, P.bot);
    let s = d1 + `<rect x="-20" y="-20" width="${W + 40}" height="${H + 40}" fill="${wall}"/>`;
    const persp = z => 1 / z;   // depth z in (0.06 .. 1]
    const L = [-760, 760], top = -520, bot = 470;   // corridor half-width and height at z = 1
    const pt = (x, y, z) => [vx + x * persp(z) * 0.62, vy + y * persp(z) * 0.62];
    // floor and ceiling planes
    s += `<path d="M${pt(L[0], bot, 0.62).join(' ')}L${vx} ${vy}L${pt(L[1], bot, 0.62).join(' ')}Z" fill="${shade(P.bot, 0.55)}"/>`;
    s += `<path d="M${pt(L[0], top, 0.62).join(' ')}L${vx} ${vy}L${pt(L[1], top, 0.62).join(' ')}Z" fill="${shade(P.top, 0.2)}"/>`;
    const ph = (t * speed) % 1;
    for (let i = 14; i >= 0; i--) {      // far to near
      const z = Math.pow(0.82, i + ph * -1 + 1) ; if (z > 1.6) continue;
      const zn = z * 1.0, k = 1 / zn;
      const a = clamp(1.25 - zn * 0.9, 0, 1), fog = clamp(1 - k * 0.0, 0, 1);
      const ink = mix(P.glow, P.top, clamp(1 - zn * 1.1, 0, 0.92));
      for (const side of [-1, 1]) {
        const x0 = side * 760, [ax, ay] = pt(x0, top * 0.82, zn), [bx, by2] = pt(x0, bot, zn), [cx, cy] = pt(x0, top * 0.82, zn * 0.82), [dx, dy] = pt(x0, bot, zn * 0.82);
        s += `<path d="M${f1(ax)} ${f1(ay)}L${f1(cx)} ${f1(cy)}L${f1(dx)} ${f1(dy)}L${f1(bx)} ${f1(by2)}Z" fill="${shade(ink, 0.55)}" stroke="${ink}" stroke-opacity="${f1(0.35 * a)}" stroke-width="1"/>`;
        for (let sh = 1; sh < 6; sh++) {   // shelf boards and file spines
          const yy = lerp(top * 0.82, bot, sh / 6), [p1x, p1y] = pt(x0, yy, zn), [p2x, p2y] = pt(x0, yy, zn * 0.82);
          s += `<path d="M${f1(p1x)} ${f1(p1y)}L${f1(p2x)} ${f1(p2y)}" stroke="${ink}" stroke-opacity="${f1(0.5 * a)}" stroke-width="${f1(1 + 2 * a)}"/>`;
          const r = rng('spine' + i + side + sh);
          for (let b = 0; b < 5; b++) {
            const u = (b + 0.2) / 5, [qx, qy] = pt(x0, yy, zn * (1 - 0.18 * u)), hh = (bot - top * 0.82) / 6 * 0.7 * 0.62 / (zn * (1 - 0.18 * u));
            s += `<rect x="${f1(qx - (side > 0 ? 0 : 3 * a + 1))}" y="${f1(qy - hh)}" width="${f1(2 + 3 * a)}" height="${f1(hh)}" fill="${mix('#c9a46a', '#7a5c3a', r())}" opacity="${f1(0.55 * a)}"/>`;
          }
        }
      }
      const [lx1, ly1] = pt(-120, top, zn), [lx2] = pt(120, top, zn);   // ceiling lamps
      s += `<rect x="${f1(lx1)}" y="${f1(ly1)}" width="${f1(lx2 - lx1)}" height="${f1(Math.max(1.5, 10 / zn))}" fill="${tint(P.glow, 0.6)}" opacity="${f1(0.25 + 0.6 * a)}"/>`;
    }
    s += glow(vx, vy, 260, P.glow, 0.35);
    return s + vignette(0.7);
  };
  /* Aged paper filling the frame, for full-screen documents. */
  X.BG.paper = (bg, t, cam) => {
    const [fill, def] = vgrad('#ded0b0', '#b9a37c');
    let s = def + `<rect x="-20" y="-20" width="${W + 40}" height="${H + 40}" fill="${fill}"/>`;
    const r = rng('stains');
    for (let i = 0; i < 14; i++) s += `<circle cx="${f1(r() * W - cam.px * 0.1)}" cy="${f1(r() * H)}" r="${f1(30 + r() * 120)}" fill="#7a5a30" opacity="${f1(0.03 + r() * 0.05)}"/>`;
    for (let i = 0; i < 30; i++) s += `<path d="M0 ${f1(r() * H)}h${W}" stroke="#6b5434" stroke-opacity="0.05" stroke-width="1"/>`;
    const g = nid('pv');
    return s + `<radialGradient id="${g}" cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stop-color="#3a2410" stop-opacity="0"/><stop offset="1" stop-color="#2a1608" stop-opacity="0.65"/></radialGradient><rect width="${W}" height="${H}" fill="url(#${g})"/>`;
  };

  // ---------- maps ----------
  const UP = [[79.0, 31.4], [80.9, 30.2], [80.3, 28.8], [81.6, 28.0], [83.2, 27.4], [84.6, 27.3], [84.1, 26.6], [84.6, 25.3], [83.4, 24.8], [83.1, 23.9], [82.0, 24.3], [81.0, 24.9], [79.6, 25.0], [78.9, 24.4], [78.3, 25.4], [78.4, 24.4], [77.4, 25.9], [78.2, 26.8], [77.4, 27.2], [77.5, 28.4], [77.1, 29.0], [77.6, 30.4], [77.8, 31.0]];
  const CITY = {
    Lahore: [74.34, 31.55], Delhi: [77.21, 28.61], Lucknow: [80.95, 26.85], Aligarh: [78.08, 27.88], Deoband: [77.68, 29.69], Bijnor: [78.13, 29.37],
    Karachi: [67.0, 24.86], Bombay: [72.88, 19.08], Calcutta: [88.36, 22.57], Dacca: [90.41, 23.81], Allahabad: [81.85, 25.44], Kanpur: [80.33, 26.45],
    Meerut: [77.7, 28.98], Rampur: [79.03, 28.8], Azamgarh: [83.18, 26.07], Patna: [85.14, 25.6], Peshawar: [71.58, 34.01], Quetta: [66.99, 30.18],
    Medina: [39.61, 24.47], Mecca: [39.83, 21.42], Istanbul: [28.98, 41.01], Cairo: [31.24, 30.04], Ankara: [32.86, 39.93], Kabul: [69.17, 34.53],
    Tehran: [51.39, 35.69], Baghdad: [44.36, 33.31], Jerusalem: [35.21, 31.77], London: [-0.12, 51.5], Madras: [80.27, 13.08], Hyderabad: [78.47, 17.36], Bhopal: [77.41, 23.26],
    Raichur: [77.36, 16.2], Chittagong: [91.78, 22.36], Dhaka: [90.41, 23.81], Srinagar: [74.8, 34.08], Amritsar: [74.87, 31.63], Rawalpindi: [73.05, 33.6],
  };
  function proj(V) { const cl = Math.cos(V.lat0 * Math.PI / 180); return ([lo, la]) => [(lo - V.lon0) * V.k * cl, -(la - V.lat0) * V.k]; }
  const where = (c) => Array.isArray(c) ? c : (CITY[c] || [0, 0]);
  function samap(p, t, seed, age) {
    const V = (window.GEO || {})[p.view || 'sa']; if (!V) return '';
    const P = proj(V), z = p.k || 1, sw = 1.6 / z;
    const land = p.land || '#2a2620', nbFill = p.nbFill || '#16140f', edge = p.edge || '#5a4e3c';
    const nb = p.nb == null ? 1 : p.nb, und = p.und || 0, split = p.split || 0, draw = p.draw == null ? 1 : p.draw;
    let s = `<g transform="scale(${f1(z * 1000) / 1000})">`;
    if (nb > 0) for (const [code, d] of Object.entries(V.paths)) if (!['IN', 'PK', 'BD'].includes(code)) s += `<path d="${d}" fill="${(p.hi && p.hi[code]) || nbFill}" stroke="${edge}" stroke-width="${f1(sw * 0.8)}" opacity="${f1(nb)}"/>`;
    const pk = p.pkColor || '#2f6f5a', inn = p.inColor || land;
    for (const code of ['IN', 'PK', 'BD']) {
      const d = V.paths[code]; if (!d) continue;
      const base = code === 'IN' ? mix(land, inn, split) : mix(land, pk, split);
      s += `<path d="${d}" fill="${mix(base, GOLD, und * 0.18)}"/>`;
    }
    if (V.undivided) s += `<path d="${V.undivided}" fill="none" stroke="${GOLD}" stroke-width="${f1(sw * 1.4)}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f1((1 - draw) * 1000) / 1000}" opacity="${f1(0.5 + 0.5 * Math.max(und, 1 - split))}"/>`;
    if (split > 0) for (const code of ['PK', 'BD']) s += `<path d="${V.paths[code]}" fill="none" stroke="#f2e6c9" stroke-width="${f1(sw * 1.3)}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f1((1 - clamp(split * 1.2)) * 1000) / 1000}"/>`;
    if (p.up) {
      const d = 'M' + UP.map(c => P(c).map(v => v.toFixed(1)).join(' ')).join('L') + 'Z';
      const pulse = 0.85 + 0.15 * Math.sin(t * 2.2);
      s += `<path d="${d}" fill="#e0a040" opacity="${f1(0.5 * p.up * pulse)}" stroke="#ffd08a" stroke-width="${f1(sw * 1.2)}" stroke-opacity="${f1(p.up)}"/>`;
      if (p.upLabel !== false) { const [cx, cy] = P(p.upAt || [81.4, 25.6]); s += T(p.upLabel || 'UNITED PROVINCES', cx, cy, 13 / z, { font: 'sans', weight: 900, fill: '#fff2d6', ls: 2 / z, op: f1(p.up) }); }
    }
    for (const [ai, a] of (p.arcs || []).entries()) {
      const [x1, y1] = P(where(a.from)), [x2, y2] = P(where(a.to)), mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * (a.bend == null ? 0.3 : a.bend);
      const dr = p.arcDraw ? clamp(p.arcDraw[ai] || 0) : a.draw == null ? 1 : a.draw, col = a.color || GOLD; if (dr <= 0) continue;
      s += `<path d="M${f1(x1)} ${f1(y1)}Q${f1(mx)} ${f1(my)} ${f1(x2)} ${f1(y2)}" fill="none" stroke="${col}" stroke-width="${f1(sw * 1.8)}" stroke-linecap="round" pathLength="1" stroke-dasharray="${f1(dr * 1000) / 1000} 2" opacity="${a.o == null ? 0.9 : a.o}"/>`;
      if (dr > 0.97) s += `<circle cx="${f1(x2)}" cy="${f1(y2)}" r="${f1(5 / z)}" fill="${col}"/>`;
      if (a.label && dr > 0.5) s += T(a.label, mx, my + 10 / z, 15 / z, { font: 'type', fill: col, op: f1(clamp((dr - 0.5) * 2)) });
    }
    for (const L of p.labels || []) {
      const [x, y] = P(L.at); s += T(L.text, x, y, (L.size || 20) / z, { font: L.font || 'bebas', fill: L.color || '#f4ecdc', ls: (L.ls == null ? 4 : L.ls) / z, op: f1((L.o == null ? 1 : L.o) * (p.labelsOn == null ? 1 : p.labelsOn)) });
    }
    const lit = p.lit == null ? 99 : p.lit;
    (p.cities || []).forEach((c, i) => {
      const on = clamp(lit - i); if (on <= 0) return;
      const [x, y] = P(where(c.at || c.name)), col = c.color || '#ffd08a', r = (c.size || 5) / z, left = c.left;
      if (c.pin) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * (2 + 2.5 * ((t * 0.8) % 1)))}" fill="none" stroke="${col}" stroke-width="${f1(sw)}" opacity="${f1((1 - (t * 0.8) % 1) * on)}"/>`;
      s += glow(x, y, r * 6, col, 0.5 * on) + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * on)}" fill="${col}"/>`;
      if (c.name && c.label !== false) s += T(c.label || c.name, x + (left ? -1 : 1) * 10 / z, y - 1 / z, 16 / z, { font: 'sans', weight: 900, anchor: left ? 'end' : 'start', op: f1(on) });
      if (c.note) s += T(c.note, x + (left ? -1 : 1) * 10 / z, y + 17 / z, 13 / z, { font: 'type', anchor: left ? 'end' : 'start', fill: '#e8cfa0', op: f1(on) });
    });
    return s + '</g>';
  }

  // ---------- documents ----------
  function paperSheet(w, h, seed, color = PAPER) {
    const r = rng(seed), g = nid('pp');
    let s = `<path d="${rrect(-w / 2 + 8, -h / 2 + 12, w, h, 4)}" fill="#000" opacity="0.45"/>`;
    s += `<radialGradient id="${g}" cx="0.45" cy="0.4" r="0.8"><stop offset="0.4" stop-color="${color}"/><stop offset="1" stop-color="${mix(color, '#7a5a30', 0.45)}"/></radialGradient><path d="${rrect(-w / 2, -h / 2, w, h, 3)}" fill="url(#${g})"/>`;
    for (let i = 0; i < 5; i++) s += `<circle cx="${f1((r() - 0.5) * w)}" cy="${f1((r() - 0.5) * h)}" r="${f1(10 + r() * w * 0.2)}" fill="#8a6a3a" opacity="${f1(0.04 + r() * 0.05)}"/>`;
    return s;
  }
  /* An archival typed document: title, a reference line, typed body lines, a stamp and a red underline. */
  function doc(p, t, seed, age) {
    const w = p.w || 440, h = p.h || 540, pad = 36, size = p.size || 17, lines = p.lines || [];
    let s = paperSheet(w, h, seed, p.paper || PAPER);
    let y = -h / 2 + pad + 10;
    if (p.title) { s += T(p.title, -w / 2 + pad, y, size + 5, { font: 'type', anchor: 'start', fill: INKC }); y += size * 1.8; }
    if (p.meta) { s += T(p.meta, -w / 2 + pad, y, size - 4, { font: 'type', anchor: 'start', fill: '#6b5434' }); y += size * 1.2; }
    s += `<path d="M${-w / 2 + pad} ${f1(y)}H${w / 2 - pad}" stroke="${INKC}" stroke-opacity="0.35"/>`; y += size * 1.3;
    const total = lines.join('').length, cps = p.cps || 40;
    let budget = p.reveal != null ? p.reveal * total : (age || 0) * cps;
    lines.forEach((ln, i) => {
      const shown = typed(ln, budget); budget -= ln.length;
      if (shown) s += T(shown, -w / 2 + pad, y, size, { font: 'type', anchor: 'start', fill: INKC });
      if (p.hl === i && (p.hlOn || 0) > 0) { const lw = TW(ln, size, 400, 'type'); s += `<path d="M${-w / 2 + pad} ${f1(y + size * 0.7)}h${f1(lw * clamp(p.hlOn))}" stroke="${RED}" stroke-width="2.5" stroke-linecap="round"/>`; }
      y += size * 1.5;
    });
    if (p.stamp && (p.stampOn || 0) > 0) {
      const q = clamp(p.stampOn), sc = 1 + 0.6 * (1 - easeOut(q)), sw2 = TW(p.stamp, 30, 400, 'bebas') + 30;
      s += `<g transform="translate(${f1(w * 0.18)} ${f1(h * 0.3)}) rotate(-14) scale(${f1(sc * 100) / 100})" opacity="${f1(0.85 * q)}"><path d="${rrect(-sw2 / 2, -24, sw2, 48, 6)}" fill="none" stroke="${p.stampColor || RED}" stroke-width="4"/>${T(p.stamp, 0, 2, 30, { font: 'bebas', fill: p.stampColor || RED, ls: 3 })}</g>`;
    }
    return s;
  }
  /* A period newspaper page: masthead, date line, headline, columns of grey type. Generic, no real layout copied. */
  function paper(p, t, seed) {
    const w = p.w || 460, h = p.h || 560, pad = 26;
    let s = paperSheet(w, h, seed, p.paperColor || '#e6dcc4');
    s += T(p.mast || 'THE DAILY', 0, -h / 2 + 52, p.mastSize || 46, { font: 'serif', weight: 900, fill: '#1d1712' });
    s += `<path d="M${-w / 2 + pad} ${-h / 2 + 88}H${w / 2 - pad}M${-w / 2 + pad} ${-h / 2 + 114}H${w / 2 - pad}" stroke="#1d1712" stroke-width="1.5"/>`;
    s += T(p.date || '', 0, -h / 2 + 101, 12, { font: 'type', fill: '#3a2e22' });
    s += T(p.head || '', 0, -h / 2 + 160, p.headSize || 30, { font: 'serif', weight: 900, fill: '#14100c', lh: 1.1 });
    let y0 = -h / 2 + 160 + (String(p.head || '').split('\n').length) * (p.headSize || 30) * 0.6 + 26;
    if (p.sub) { s += T(p.sub, 0, y0, 15, { font: 'serif', italic: true, fill: '#3a2e22' }); y0 += 30; }
    const cols = p.cols || 3, cw = (w - pad * 2 - (cols - 1) * 14) / cols, r = rng(seed + 'np');
    for (let c = 0; c < cols; c++) for (let y = y0; y < h / 2 - pad; y += 11) {
      const x = -w / 2 + pad + c * (cw + 14), lw = cw * (r() < 0.12 ? 0.4 + r() * 0.4 : 0.92 + r() * 0.08);
      s += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(lw)}" height="4" fill="#3a2e22" opacity="0.32"/>`;
    }
    if (p.note) s += T(p.note, 0, h / 2 + 22, 14, { font: 'type', fill: '#e8cfa0' });
    return s;
  }
  /* A dossier card for a real historical figure: a generic silhouette (or a real photo via img), name, role, years, a tag. */
  function figureSil(p, color) {
    let s = `<path d="M-86 120C-84 50 -50 34 -20 26V8C-40 -2 -46 -30 -46 -52C-46 -88 -26 -108 0 -108C26 -108 46 -88 46 -52C46 -30 40 -2 20 8V26C50 34 84 50 86 120Z" fill="${color}"/>`;
    const hat = p.hat;
    if (hat === 'karakul') s += `<path d="M-40 -84L-36 -122Q0 -130 36 -122L40 -84Q0 -92 -40 -84Z" fill="${color}"/>`;
    else if (hat === 'turban') s += `<path d="M-50 -76Q-56 -128 0 -132Q56 -128 50 -76Q0 -96 -50 -76Z" fill="${color}"/><path d="M-44 -100Q0 -116 44 -100" stroke="${mix(color, '#fff', 0.15)}" stroke-width="3" fill="none"/>`;
    else if (hat === 'topi') s += `<path d="M-38 -90Q-38 -118 0 -118Q38 -118 38 -90Q0 -98 -38 -90Z" fill="${color}"/>`;
    else if (hat === 'fez') s += `<path d="M-32 -88L-26 -132H26L32 -88Q0 -96 -32 -88Z" fill="${color}"/>`;
    else if (hat === 'boat') s += `<path d="M-46 -84L-30 -116H30L46 -84Q0 -94 -46 -84Z" fill="${color}"/>`;
    if (p.beard) s += `<path d="M-38 -40Q-40 20 0 34Q40 20 38 -40Q0 -10 -38 -40Z" fill="${color}"/>`;
    if (p.glasses) s += `<circle cx="-17" cy="-54" r="11" fill="none" stroke="#d8c8a8" stroke-opacity="0.55" stroke-width="2.5"/><circle cx="17" cy="-54" r="11" fill="none" stroke="#d8c8a8" stroke-opacity="0.55" stroke-width="2.5"/><path d="M-6 -54H6" stroke="#d8c8a8" stroke-opacity="0.55" stroke-width="2"/>`;
    return s;
  }
  function dossier(p, t, seed) {
    const w = p.w || 280, h = p.h || 380, ph = h * 0.6, c = p.color || GOLD;
    let s = paperSheet(w, h, seed, '#d9ccae');
    const g = nid('ds'), cl = nid('dc');
    s += `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a8462"/><stop offset="1" stop-color="#4a3a28"/></linearGradient>`;
    s += `<clipPath id="${cl}"><rect x="${-w / 2 + 18}" y="${-h / 2 + 18}" width="${w - 36}" height="${f1(ph)}"/></clipPath><rect x="${-w / 2 + 18}" y="${-h / 2 + 18}" width="${w - 36}" height="${f1(ph)}" fill="url(#${g})"/>`;
    s += `<g clip-path="url(#${cl})">`;
    if (p.img) s += `<image href="${esc(X.base + p.img)}" x="${-w / 2 + 18}" y="${-h / 2 + 18}" width="${w - 36}" height="${f1(ph)}" preserveAspectRatio="xMidYMid slice" filter="url(#sepiaF)"/>`;
    else s += `<g transform="translate(0 ${f1(-h / 2 + 18 + ph - 120 * 0.78)}) scale(0.78)">${figureSil(p, '#1b1510')}</g>` + glow(-w * 0.2, -h / 2 + 50, 120, '#f0d9a8', 0.25);
    s += `</g>`;
    s += `<path d="M${-w / 2 + 6} ${-h / 2 + 30}l26 -26M${w / 2 - 6} ${-h / 2 + 30}l-26 -26" stroke="#2a2018" stroke-width="10" opacity="0.5"/>`;   // photo corners
    const ty = -h / 2 + 18 + ph + 32;
    const ns = Math.min(26, 26 * (w - 30) / Math.max(1, TW(p.name || '', 26, 700, 'serif')));
    s += T(p.name || '', 0, ty, ns, { font: 'serif', weight: 700, fill: '#1d1712' });
    if (p.role) s += T(p.role, 0, ty + 28, 14, { font: 'sans', weight: 800, fill: '#4a3a28', lh: 1.15 });
    if (p.years) s += T(p.years, 0, ty + (String(p.role || '').includes('\n') ? 64 : 50), 13, { font: 'type', fill: '#6b5434' });
    if (p.tag) { const tw = TW(p.tag, 18, 400, 'bebas') + 24; s += `<g transform="translate(${f1(w / 2 - tw / 2 - 10)} ${f1(-h / 2 + 34)}) rotate(4)"><rect x="${f1(-tw / 2)}" y="-14" width="${f1(tw)}" height="28" rx="3" fill="${p.tagColor || RED}"/>${T(p.tag, 0, 1, 18, { font: 'bebas', ls: 2, fill: '#fff6e6' })}</g>`; }
    return s;
  }
  /* A real photograph (public domain or freely licensed, stored in the episode folder) with a slow Ken Burns move. */
  function photo(p, t, seed, age) {
    const w = p.w || 640, h = p.h || 420, z = p.zoom || 1, cl = nid('ph');
    let s = `<rect x="${-w / 2 + 8}" y="${-h / 2 + 12}" width="${w}" height="${h}" fill="#000" opacity="0.5"/>`;
    s += `<clipPath id="${cl}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${cl})"><g transform="translate(${f1((p.px || 0))} ${f1(p.py || 0)}) scale(${f1(z * 1000) / 1000})">`;
    s += `<image href="${esc(X.base + p.src)}" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"${p.sepia === false ? '' : ' filter="url(#sepiaF)"'}/></g></g>`;
    if (p.frame !== false) s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="none" stroke="#e8dcc0" stroke-width="6"/>`;
    if (p.credit) s += T(p.credit, w / 2, h / 2 + 18, 12, { font: 'type', anchor: 'end', fill: '#bfae8c' });
    if (p.caption) s += T(p.caption, -w / 2, h / 2 + 18, 15, { font: 'sans', weight: 800, anchor: 'start' });
    return s;
  }

  // ---------- claims, quotes, type ----------
  const LEVELS = {
    strong: ['WELL SUPPORTED', '#5fbf9a', 4], partial: ['SUPPORTED, WITH CAVEATS', '#a8c66c', 3], debated: ['DEBATED BY HISTORIANS', '#e3a857', 2],
    contested: ['CONTESTED', '#e0703e', 1], weak: ['THIN EVIDENCE', '#e0393e', 0],
  };
  /* A claim and how well it is supported. level: strong | partial | debated | contested | weak. */
  function verdict(p, t, seed, age) {
    const w = p.w || 620, lines = String(p.claim || '').split('\n'), h = 84 + lines.length * 32 + (p.by ? 26 : 0), L = LEVELS[p.level] || LEVELS.debated, on = p.on == null ? 1 : p.on;
    let s = `<path d="${rrect(-w / 2 + 6, -h / 2 + 10, w, h, 8)}" fill="#000" opacity="0.45"/><path d="${rrect(-w / 2, -h / 2, w, h, 8)}" fill="#14110d" stroke="#3a3226"/>`;
    s += `<rect x="${-w / 2}" y="${-h / 2}" width="8" height="${h}" fill="${L[1]}" opacity="${f1(on)}"/>`;
    s += T(p.kicker || 'CLAIM', -w / 2 + 30, -h / 2 + 24, 15, { font: 'bebas', anchor: 'start', fill: '#8a7e68', ls: 3 });
    s += T(p.claim || '', -w / 2 + 30, -h / 2 + 50 + (lines.length - 1) * 16, 23, { font: 'serif', italic: true, anchor: 'start', lh: 1.35 });
    let y = -h / 2 + 50 + lines.length * 32 + 6;
    if (p.by) { s += T(p.by, -w / 2 + 30, y - 6, 13, { font: 'type', anchor: 'start', fill: '#b8a888' }); y += 24; }
    for (let i = 0; i < 4; i++) s += `<rect x="${f1(-w / 2 + 30 + i * 30)}" y="${f1(y - 6)}" width="24" height="10" rx="2" fill="${i < L[2] * on ? L[1] : '#3a3226'}"/>`;
    s += `<g opacity="${f1(on)}">${T(L[0], -w / 2 + 160, y, 20, { font: 'bebas', anchor: 'start', fill: L[1], ls: 2 })}</g>`;
    return s;
  }
  /* A cinematic quote: serif italic with thin rules and an attribution, no box. Keep quotes short. */
  function cquote(p, t, seed, age) {
    const size = p.size || 34, w = p.w || 760, c = p.color || GOLD, lines = String(p.text).split('\n'), hh = lines.length * size * 1.3;
    let s = `<path d="M${-w / 2} ${f1(-hh / 2 - 26)}H${w / 2}" stroke="${c}" stroke-opacity="0.6"/>`;
    s += T('“' + p.text + '”', 0, 0, size, { font: 'serif', italic: true, lh: 1.3 });
    s += `<path d="M${-w / 2} ${f1(hh / 2 + 22)}H${w / 2}" stroke="${c}" stroke-opacity="0.6"/>`;
    if (p.by) s += T(p.by, 0, hh / 2 + 52, 17, { font: 'type', fill: tint(c, 0.3) });
    return s;
  }
  /* Typewriter super: location and date slates, typed key lines. */
  function typer(p, t, seed, age) {
    const size = p.size || 28, cps = p.cps || 24, str = String(p.text), n = p.reveal != null ? p.reveal * str.length : (age || 0) * cps;
    const shown = typed(str, n), font = p.font || 'type';
    let s = T(shown, 0, 0, size, { font, anchor: p.anchor || 'middle', fill: p.color || '#f4ecdc', ls: p.ls, weight: p.weight, italic: p.italic });
    if (p.cursor !== false && n < str.length + 12 && Math.sin((age || 0) * 9) > 0 && !str.includes('\n')) {
      const tw = TW(shown, size, p.weight, font), x = p.anchor === 'start' ? tw : p.anchor === 'end' ? 0 : tw / 2;
      s += `<rect x="${f1(x + 4)}" y="${f1(-size * 0.45)}" width="${f1(size * 0.5)}" height="${f1(size * 0.9)}" fill="${p.color || '#f4ecdc'}" opacity="0.7"/>`;
    }
    return s;
  }
  function rule(p) { const w = p.w || 400, d = p.draw == null ? 1 : p.draw; return `<path d="M${f1(-w / 2)} 0H${f1(-w / 2 + w * d)}" stroke="${p.color || RED}" stroke-width="${p.width || 3}"/>`; }
  /* A big year numeral; key "value" to roll it (no thousands separator). */
  function year(p) {
    const size = p.size || 140, c = p.color || '#f4ecdc', v = String(Math.round(p.value || 0));
    return glow(0, 0, size * 1.6, p.glowColor || GOLD, 0.18) + T(v, 0, 0, size, { font: 'serif', weight: 900, fill: c, ls: 4 }) + (p.label ? T(p.label, 0, size * 0.72, 18, { font: 'type', fill: '#cdbb98' }) : '');
  }
  /* A seance table: candle, a cigarette fixed on a wire stand, curling smoke, and an empty chair behind. */
  function seance(p, t, seed) {
    const k = p.size || 1, sm = p.smoke == null ? 1 : p.smoke;
    let s = `<g transform="scale(${k})">`;
    if (p.chair !== 0) s += `<g opacity="${f1(p.chair == null ? 1 : p.chair)}"><path d="M-90 -40V-330Q-90 -350 -70 -350H70Q90 -350 90 -330V-40Z" fill="#100c08"/><path d="M-70 -320H70V-120H-70Z" fill="#1a140e"/></g>`;
    s += `<ellipse cx="0" cy="10" rx="330" ry="60" fill="#000" opacity="0.5"/>`;
    s += `<path d="M-310 -40Q0 -90 310 -40L330 60Q0 110 -330 60Z" fill="#2a1d14"/><ellipse cx="0" cy="-40" rx="310" ry="52" fill="#4a3322"/><ellipse cx="0" cy="-42" rx="300" ry="48" fill="#5a3e28"/>`;
    s += glow(-150, -60, 260, '#ffb35a', 0.32 * (0.9 + 0.1 * Math.sin(t * 13)));
    // candle
    const fl = 1 + 0.12 * Math.sin(t * 11) + 0.06 * Math.sin(t * 23);
    s += `<rect x="-166" y="-130" width="32" height="90" rx="4" fill="#efe2c4"/><ellipse cx="-150" cy="-130" rx="16" ry="5" fill="#fff4dc"/><path d="M-150 -132v-8" stroke="#2a1d14" stroke-width="2"/>`;
    s += glow(-150, -155, 70, '#ffcf70', 0.75) + `<path d="M-150 ${f1(-140 - 30 * fl)}C-143 -150 -141 -142 -150 -138C-159 -142 -157 -150 -150 ${f1(-140 - 30 * fl)}Z" fill="#ffe7a3"/>`;
    // wire stand and cigarette
    s += `<path d="M90 -42V-128M70 -42H110M90 -128L132 -138" stroke="#9a9a9a" stroke-width="2.5" fill="none"/><path d="M128 -142L196 -150" stroke="#f2ede2" stroke-width="7" stroke-linecap="round"/><path d="M128 -142L144 -144" stroke="#c9a46a" stroke-width="7"/>`;
    const ember = 0.6 + 0.4 * Math.sin(t * 2.3) ** 2;
    s += glow(198, -150, 26, '#ff6a2a', 0.9 * ember) + `<circle cx="198" cy="-150" r="4.5" fill="#ff7a3a" opacity="${f1(ember)}"/>`;
    for (let i = 0; i < 4; i++) {   // smoke wisps
      let d = '', op = 0.22 * sm;
      for (let j = 0; j <= 24; j++) {
        const u = j / 24, y = -154 - u * 300, x = 200 + Math.sin(u * 7 + t * (0.8 + i * 0.2) + i * 1.7) * (8 + u * 46) + u * 20 * (i - 1.5);
        d += (j ? 'L' : 'M') + f1(x) + ' ' + f1(y);
      }
      s += `<path d="${d}" stroke="#d8d4cc" stroke-width="${2.2 + i * 0.6}" fill="none" stroke-linecap="round" opacity="${f1(op)}"/>`;
    }
    return s + '</g>';
  }
  /* People as roles: a row of plain silhouettes with an optional banner. */
  function figures(p, t, seed) {
    const n = p.n || 12, cols = p.cols || n, w = p.w || 600, rowh = p.rowh || 60, k = p.size || 1, r = rng(seed + 'fg');
    let s = '';
    const rows = Math.ceil(n / cols);
    for (let i = n - 1; i >= 0; i--) {
      const row = Math.floor(i / cols), col = i % cols, x = -w / 2 + (col + 0.5 + (row % 2) * 0.5) * w / cols, y = -row * rowh * 0.6, sc = k * (1 - row * 0.08);
      const c = mix(p.color || '#2a241c', '#000', row / Math.max(1, rows) * 0.4), sway = Math.sin(t * 1.5 + i) * 2;
      s += `<g transform="translate(${f1(x + sway)} ${f1(y)}) scale(${f1(sc * 100) / 100})"><circle cx="0" cy="-92" r="17" fill="${c}"/><path d="M-30 0V-50Q-30 -72 0 -72Q30 -72 30 -50V0Z" fill="${c}"/>${r() < (p.caps || 0) ? `<path d="M-16 -104Q0 -118 16 -104Z" fill="${c}"/>` : ''}</g>`;
    }
    if (p.banner) { const bw = TW(p.banner, 22, 400, 'bebas') + 40; s += `<g transform="translate(0 ${f1(-rowh * rows * 0.6 - 120)})"><path d="M${f1(-bw / 2)} -20H${f1(bw / 2)}V20H${f1(-bw / 2)}Z" fill="${p.bannerColor || '#e8dcc0'}"/><path d="M${f1(-bw / 2)} 20V70M${f1(bw / 2)} 20V70" stroke="#3a2e22" stroke-width="3"/>${T(p.banner, 0, 1, 22, { font: 'bebas', fill: '#1d1712', ls: 2 })}</g>`; }
    return s;
  }
  /* Source line: in the cinema look it is written into the bottom letterbox bar. */
  const baseCite = X.DRAW.cite;
  function cite(p, t, seed, age) {
    if (!cinema()) return baseCite(p, t, seed, age);
    X.frame.cites.push({ text: (p.prefix == null ? 'Source: ' : p.prefix) + p.text, op: clamp((age || 0) / 0.6) });
    return '';
  }
  function slate(p, t, seed, age) { X.frame.slate = { text: p.text, n: (age || 0) * (p.cps || 30) }; return ''; }
  /* A clothbound book: serif title wrapped to the cover, author underneath, gold rules. */
  function wrapWords(str, size, maxW, font, weight) {
    const out = []; let cur = '';
    for (const w of String(str).split(' ')) { const t2 = cur ? cur + ' ' + w : w; if (cur && TW(t2, size, weight, font) > maxW) { out.push(cur); cur = w; } else cur = t2; }
    if (cur) out.push(cur); return out;
  }
  function tome(p, t, seed) {
    const w = p.w || 180, h = p.h || 250, c = p.color || '#5a1a1a';
    let s = `<ellipse cx="6" cy="${f1(h / 2 + 12)}" rx="${f1(w * 0.6)}" ry="12" fill="#000" opacity="0.45"/><g transform="rotate(${p.tilt == null ? -3 : p.tilt})">`;
    s += `<rect x="${f1(-w / 2 + 8)}" y="${f1(-h / 2 + 6)}" width="${w}" height="${h}" rx="3" fill="#e8dcc0"/>`;
    const g = nid('tm');
    s += `<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tint(c, 0.12)}"/><stop offset="1" stop-color="${shade(c, 0.35)}"/></linearGradient><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="3" fill="url(#${g})"/>`;
    s += `<rect x="${-w / 2}" y="${-h / 2}" width="14" height="${h}" fill="${shade(c, 0.4)}"/>`;
    s += `<rect x="${f1(-w / 2 + 24)}" y="${f1(-h / 2 + 14)}" width="${f1(w - 38)}" height="${f1(h - 28)}" fill="none" stroke="${GOLD}" stroke-opacity="0.6"/>`;
    const size = p.size || Math.max(14, Math.min(22, w / 8)), lines = wrapWords(p.title || '', size, w - 56, 'serif', 700);
    s += T(lines.join('\n'), 7, -h * 0.12, size, { font: 'serif', weight: 700, fill: '#f3e3bf', lh: 1.15 });
    s += `<path d="M${f1(-w * 0.18 + 7)} ${f1(h * 0.12)}H${f1(w * 0.18 + 7)}" stroke="${GOLD}" stroke-opacity="0.8"/>`;
    if (p.author) s += T(wrapWords(p.author, 12, w - 56, 'type').join('\n'), 7, h * 0.3, 12, { font: 'type', fill: '#e0cfa8' });
    return s + '</g>';
  }
  /* A blade cut through a cinema screen: a jagged dark tear that opens along a line. */
  function slash(p, t, seed) {
    const dx = p.x2 - p.x, dy = p.y2 - p.y, len = Math.hypot(dx, dy), dr = p.draw == null ? 1 : clamp(p.draw), r = rng(seed + 'sl');
    if (dr <= 0) return '';
    const ux = dx / len, uy = dy / len, nx = -uy, ny = ux, n = 26, L2 = len * dr;
    const top = [], bot = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n, a = u * L2, wdt = (p.gap || 9) * Math.sin(Math.PI * Math.min(1, u * 1.1)) * (0.6 + 0.4 * r());
      top.push([ux * a + nx * wdt, uy * a + ny * wdt]); bot.push([ux * a - nx * wdt * (0.6 + 0.4 * r()), uy * a - ny * wdt * (0.6 + 0.4 * r())]);
    }
    const pts = top.concat(bot.reverse()).map(q => f1(q[0]) + ' ' + f1(q[1])).join('L');
    return `<path d="M${pts}Z" fill="#050403"/><path d="M${top.map(q => f1(q[0]) + ' ' + f1(q[1])).join('L')}" fill="none" stroke="#fff6e0" stroke-opacity="0.5" stroke-width="1.5"/>`;
  }
  /* An assembly as a hemicycle of seats: groups [{n, color, label}], reveal 0..1 fills seats left to right. */
  function hemicycle(p, t, seed) {
    const groups = p.groups || [], total = groups.reduce((a, g) => a + g.n, 0), R = p.r || 260, rows = p.rows || 8, rv = p.reveal == null ? 1 : p.reveal;
    const seats = [];
    const r0 = R * 0.38, step = (R - r0) / (rows - 1);
    const lens = Array.from({ length: rows }, (_, i) => r0 + i * step), sumL = lens.reduce((a, b) => a + b, 0);
    lens.forEach((r, i) => { const n = Math.max(1, Math.round(total * r / sumL)); for (let k = 0; k < n; k++) { const a = Math.PI * (1 - (k + 0.5) / n); seats.push({ a, r }); } });
    while (seats.length > total) seats.pop();
    while (seats.length < total) seats.push({ a: Math.PI / 2, r: R });
    seats.sort((u, v) => v.a - u.a || u.r - v.r);
    let s = '', gi = 0, used = 0;
    const dot = Math.min(10, (R - r0) / rows * 0.42);
    seats.forEach((st, i) => {
      while (gi < groups.length - 1 && i >= used + groups[gi].n) { used += groups[gi].n; gi++; }
      const on = clamp(rv * total * 1.05 - i), col = on > 0 ? groups[gi].color : '#2a261f';
      s += `<circle cx="${f1(Math.cos(st.a) * st.r)}" cy="${f1(-Math.sin(st.a) * st.r)}" r="${f1(dot)}" fill="${col}" opacity="${f1(0.35 + 0.65 * Math.max(on, 0))}"/>`;
    });
    let lx = -((groups.length - 1) * (p.legendGap || 220)) / 2;
    groups.forEach((g, i) => {
      const x = lx + i * (p.legendGap || 220);
      s += `<circle cx="${f1(x - 70)}" cy="50" r="8" fill="${g.color}"/>` + T(g.label || '', x - 56, 50, 16, { font: 'sans', weight: 800, anchor: 'start' });
      if (g.show !== false) s += T(String(Math.round(g.n * clamp(rv * 1.1))), x - 56, 76, 22, { font: 'serif', weight: 700, anchor: 'start', fill: g.color });
    });
    if (p.title) s += T(p.title, 0, -R - 34, 18, { font: 'bebas', ls: 4, fill: '#cdbb98' });
    return s;
  }
  /* A dark translucent panel to keep text legible over a map. */
  function panel(p) {
    const w = p.w || 400, h = p.h || 300;
    return `<path d="${rrect(-w / 2, -h / 2, w, h, p.r == null ? 10 : p.r)}" fill="${p.color || '#0b0a08'}" opacity="${p.o == null ? 0.88 : p.o}"/>`;
  }
  Object.assign(X.DRAW, { panel, hemicycle, tome, slash, samap, doc, paper, dossier, photo, verdict, cquote, typer, rule, year, seance, figures, cite, slate });

  // ---------- cards ----------
  const black = (t) => `<rect width="${W}" height="${H}" fill="#050403"/>` + dust(t, 30, 'cdust', '#d8c8a8', 0.1, { px: t * 4, py: 0 });
  X.CARDS.intertitle = (c, t, age, dur) => {
    let s = black(t);
    const lines = c.lines || [c.title || ''], total = lines.join('').length, cps = c.cps || Math.max(18, total / Math.max(1, dur - 2));
    let n = age * cps; const lh = (c.size || 30) * 1.6, y0 = 360 - (lines.length - 1) * lh / 2;
    lines.forEach((l, i) => { s += T(typed(l, n), 640, y0 + i * lh, c.size || 30, { font: 'type', fill: '#efe4cc' }); n -= l.length; });
    if (c.sub) s += T(c.sub, 640, y0 + lines.length * lh + 20, 16, { font: 'sans', weight: 700, fill: '#b5a688', ls: 3, op: f1(clamp((age - total / cps) / 0.8)) });
    return s;
  };
  X.CARDS.chapterx = (c, t, age, dur) => {
    const col = c.color || RED, push = 1 + age * 0.012;
    let s = black(t) + glow(640, 360, 600, col, 0.08);
    s += `<g transform="translate(640 360) scale(${f1(push * 1000) / 1000}) translate(-640 -360)">`;
    const k = clamp((age - 0.2) / 0.5), r = easeOut(clamp((age - 0.5) / 0.9)), ti = clamp((age - 0.8) / 0.9);
    s += T((c.kicker || '').toUpperCase(), 640, 250, 34, { font: 'bebas', fill: col, ls: 18, op: f1(k) });
    s += `<path d="M${f1(640 - 260 * r)} 290H${f1(640 + 260 * r)}" stroke="${col}" stroke-width="2"/>`;
    s += `<g opacity="${f1(ti)}" transform="translate(0 ${f1((1 - easeOut(ti)) * 16)})">${T(c.title, 640, 365, c.size || 64, { font: 'serif', weight: 700, fill: '#f4ecdc' })}</g>`;
    if (c.year) s += T(c.year, 640, 470, 22, { font: 'type', fill: '#b8a888', ls: 6, op: f1(clamp((age - 1.6) / 0.8)) });
    s += `</g>`;
    return s;
  };
  X.CARDS.titlex = (c, t, age, dur) => {
    let s = black(t);
    const V = window.GEO && window.GEO.sa;
    if (V) {
      const dr = easeOut(clamp(age / (dur * 0.7))), sp = clamp((age - dur * 0.45) / (dur * 0.35));
      s += `<g transform="translate(640 380) scale(0.95)" opacity="0.32">` + samap({ view: 'sa', nb: 0, draw: dr, split: sp, land: '#100d0a', pkColor: '#17251f', inColor: '#14110d' }, t, 'titlemap', age) + `</g>`;
    }
    s += glow(640, 340, 500, GOLD, 0.1);
    const k = clamp((age - 0.6) / 1.0), ti = clamp((age - 1.2) / 1.4);
    s += T(c.kicker || (X.EP.meta.show || ''), 640, 214, 22, { font: 'bebas', fill: GOLD, ls: 14, op: f1(k) });
    s += `<g opacity="${f1(ti)}">${T(c.title, 640, 330, c.size || 76, { font: 'serif', weight: 900, fill: '#f4ecdc', ls: 3 })}</g>`;
    s += `<path d="M${f1(640 - 200 * ti)} 395H${f1(640 + 200 * ti)}" stroke="${RED}" stroke-width="2"/>`;
    if (c.sub) s += T(c.sub, 640, 440, 24, { font: 'serif', italic: true, fill: '#d8c8a8', op: f1(clamp((age - 2.2) / 0.8)) });
    if (c.by) s += T(c.by, 640, 500, 16, { font: 'type', fill: '#9a8e78', op: f1(clamp((age - 2.8) / 0.8)) });
    return s;
  };
  /* Rolling credits: lines starting with "#" are headings. */
  X.CARDS.endx = (c, t, age, dur) => {
    let s = black(t);
    const lines = c.credits || [], lh = 30, total = lines.length * lh + 300, y0 = H + 40 - (total + H * 0.2) * clamp(age / Math.max(1, dur - 1.5));
    lines.forEach((l, i) => {
      const y = y0 + i * lh + (c.title ? 160 : 0); if (y < -40 || y > H + 40) return;
      const head = l.startsWith('#');
      s += T(head ? l.replace(/^#\s*/, '').toUpperCase() : l, 640, y, head ? 22 : 18, head ? { font: 'bebas', fill: GOLD, ls: 6 } : { font: 'sans', weight: 600, fill: '#d8ccb4' });
    });
    if (c.title) s += T(c.title, 640, y0 + 60, 48, { font: 'serif', weight: 900, fill: '#f4ecdc' });
    return s;
  };

  // ---------- post: grade, grain, letterbox ----------
  X.post.push((T0) => {
    if (!cinema()) return '';
    const fr = Math.floor(T0 * 24), r = rng('fl' + fr);
    let s = `<defs><filter id="grainF" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="${fr % 97}" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 1.6 -0.55"/></filter>`;
    s += `<filter id="sepiaF"><feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0  0.35 0.69 0.17 0 0  0.27 0.53 0.13 0 0  0 0 0 1 0"/></filter></defs>`;
    s += `<rect width="${W}" height="${H}" filter="url(#grainF)" opacity="0.22"/>`;
    s += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1((0.02 + r() * 0.035) * 1000) / 1000}"/>`;
    if (r() < 0.05) s += `<path d="M${f1(r() * W)} 0V${H}" stroke="#e8dcc0" stroke-opacity="0.08" stroke-width="1"/>`;   // a rare scratch
    s += `<rect width="${W}" height="${BAR}" fill="#000"/><rect y="${H - BAR}" width="${W}" height="${BAR}" fill="#000"/>`;
    const cs = X.frame.cites;
    if (cs.length) s += cs.map((c, i) => T(c.text, 40, H - BAR / 2 + (i - (cs.length - 1) / 2) * 17, 14, { font: 'sans', weight: 600, anchor: 'start', fill: '#a89c84', op: f1(c.op) })).join('');
    if (X.frame.slate) s += T(typed(X.frame.slate.text, X.frame.slate.n), W - 40, BAR / 2, 15, { font: 'type', anchor: 'end', fill: '#c9b48c', ls: 2 });
    return s;
  });

  // ---------- fonts to preload ----------
  X.fonts = ["400 30px 'Special Elite'", "400 30px 'Bebas Neue'", "700 30px 'Playfair Display'", "900 30px 'Playfair Display'", "italic 400 30px 'Playfair Display'", "400 30px 'Playfair Display'", "italic 700 30px 'Playfair Display'"];
})();
