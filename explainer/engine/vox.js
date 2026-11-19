/* Diagram kit for LUMEN collage documentaries: an original editorial-explainer vocabulary of
   ink-blue grounds with dashed registration grids, paper tables that fill row by row, philosophy maps whose
   arrows draw themselves, and trait bars. Loaded after collage.js; registers through Toon.ext. */
(function () {
  const X = window.Toon.ext;
  const { W, H, clamp, lerp, easeOut, back, f1, rng, mix, esc, nid } = X;
  const HEAD = "'Archivo Black', Impact, sans-serif", BODY = "'Libre Franklin', Arial, sans-serif", MARK = "'Permanent Marker', cursive", SERIF = "'Playfair Display', Georgia, serif";
  const FONTS = { head: HEAD, body: BODY, mark: MARK, serif: SERIF };
  const INK = '#1d1b19', RED = '#d23a2e', YEL = '#ffd23f', PAPER = '#fbf7ee', BLUE = '#2443c9';

  function T(s, x, y, size, o = {}) {
    const lines = String(s).split('\n'), lh = size * (o.lh || 1.18), y0 = y - (lines.length - 1) * lh / 2, font = FONTS[o.font] || o.font || BODY;
    return lines.map((l, i) => `<text x="${f1(x)}" y="${f1(y0 + i * lh)}" font-family="${font}" font-size="${size}" font-weight="${o.weight || 600}"${o.italic ? ' font-style="italic"' : ''} fill="${o.fill || INK}" text-anchor="${o.anchor || 'middle'}" dominant-baseline="central"${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}>${esc(l)}</text>`).join('');
  }
  const TW = (s, size, weight, font) => X.textW(s, size, weight || 600, FONTS[font] || font || BODY);
  function torn(w, h, seed, jag = 4, step = 10) {
    const r = rng('vt' + seed), pts = [];
    const side = (x0, y0, x1, y1) => { const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / step)); for (let i = 0; i < n; i++) { const q = i / n; pts.push([lerp(x0, x1, q) + (r() - 0.5) * jag, lerp(y0, y1, q) + (r() - 0.5) * jag]); } };
    side(-w / 2, -h / 2, w / 2, -h / 2); side(w / 2, -h / 2, w / 2, h / 2); side(w / 2, h / 2, -w / 2, h / 2); side(-w / 2, h / 2, -w / 2, -h / 2);
    return 'M' + pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join('L') + 'Z';
  }
  const drop = (d, o = 0.24, dx = 5, dy = 7) => `<path d="${d}" transform="translate(${dx} ${dy})" fill="#14110c" opacity="${o}"/>`;
  const ageDraw = (p, age, per = 1) => p.draw != null ? p.draw : clamp(((age || 0) - (p.delay || 0.3)) / per);

  // ---------- ink palette and dashed registration grid ----------
  Object.assign(X.PAL, {
    ink: { top: '#2443c9', bot: '#1d36a6', glow: '#5b78ff', fx: '#6b84ff', line: '#5d76e6' },
    inknight: { top: '#121420', bot: '#191c2c', glow: '#2a3160', fx: '#3a4270', line: '#3a4065' },
  });
  const basePaper = X.BG.paperc;
  X.BG.paperc = (bg, t, cam, P) => {
    let s = basePaper(bg, t, cam, P);
    if (bg.dash) {
      const c = bg.dashColor || (['ink', 'inknight', 'night', 'slate', 'oxblood'].includes(bg.pal) ? 'rgba(255,255,255,0.32)' : 'rgba(30,30,40,0.28)');
      const xs = bg.dashX || [213, 640, 1067], ys = bg.dashY || [180, 540], ox = -cam.px * 0.08, oy = -cam.py * 0.08;
      for (const x of xs) s += `<path d="M${f1(x + ox)} -20V${H + 20}" stroke="${c}" stroke-width="1.2" stroke-dasharray="3 7"/>`;
      for (const y of ys) s += `<path d="M-20 ${f1(y + oy)}H${W + 20}" stroke="${c}" stroke-width="1.2" stroke-dasharray="3 7"/>`;
      for (const x of xs) for (const y of ys) s += `<path d="M${f1(x + ox - 7)} ${f1(y + oy)}H${f1(x + ox + 7)}M${f1(x + ox)} ${f1(y + oy - 7)}V${f1(y + oy + 7)}" stroke="${c.replace(/0\.\d+\)/, '0.8)')}" stroke-width="1.6"/>`;
    }
    return s;
  };

  // ---------- table ----------
  /* Paper table that fills row by row. cols [..], rows [[..]], colW [..], shown (rows revealed, tweenable),
     hi (row index ringed in marker), size, head color, strike [[r,c]..] (cells struck through). */
  function vtable(p, t, seed, age) {
    const cols = p.cols || [], rows = p.rows || [], size = p.size || 22, colW = p.colW || cols.map(() => (p.w || 900) / cols.length);
    const w = colW.reduce((a, b) => a + b, 0), lineN = rows.map(r => Math.max(...r.map(c => String(c).split('\n').length))), rh = lineN.map(n => size * (1.25 * n + 0.9)), hh = size * 2.1;
    const h = hh + rh.reduce((a, b) => a + b, 0), x0 = -w / 2, y0 = -h / 2;
    const shown = p.shown != null ? p.shown : rows.length, e = torn(w + 24, h + 24, seed, 4, 12);
    let s = drop(e) + `<path d="${e}" fill="${p.paper || PAPER}"/>`;
    s += `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(w)}" height="${f1(hh)}" fill="${p.headColor || INK}"/>`;
    let cx = x0;
    cols.forEach((c, i) => { s += T(String(c).toUpperCase(), cx + (p.align === 'start' ? 14 : colW[i] / 2), y0 + hh / 2, size * 0.78, { font: 'head', weight: 400, fill: p.headText || '#f4ecdc', ls: 1.5, anchor: p.align === 'start' ? 'start' : 'middle' }); cx += colW[i]; });
    let y = y0 + hh;
    rows.forEach((r, ri) => {
      const k = clamp(shown - ri); if (k <= 0) { y += rh[ri]; return; }
      const ky = (1 - easeOut(k)) * 12;
      if (ri % 2 === 1) s += `<rect x="${f1(x0)}" y="${f1(y)}" width="${f1(w)}" height="${f1(rh[ri])}" fill="${p.stripe || '#efe7d6'}" opacity="${f1(k * 0.8)}"/>`;
      let cx2 = x0;
      r.forEach((c, ci) => {
        const first = ci === 0 && p.firstBold !== false;
        s += `<g opacity="${f1(k)}" transform="translate(0 ${f1(ky)})">` + T(c, cx2 + (p.align === 'start' ? 14 : colW[ci] / 2), y + rh[ri] / 2, first ? size * 0.95 : size * 0.86, { weight: first ? 800 : 550, fill: (p.colColors && p.colColors[ci]) || INK, anchor: p.align === 'start' ? 'start' : 'middle', font: first && p.firstFont ? p.firstFont : 'body' }) + `</g>`;
        if (p.strike && p.strike.some(([a, b]) => a === ri && b === ci) && k >= 1) s += `<path d="M${f1(cx2 + 18)} ${f1(y + rh[ri] / 2)}L${f1(cx2 + colW[ci] - 18)} ${f1(y + rh[ri] / 2 - 4)}" stroke="${RED}" stroke-width="5" stroke-linecap="round"/>`;
        cx2 += colW[ci];
      });
      s += `<path d="M${f1(x0)} ${f1(y + rh[ri])}H${f1(x0 + w)}" stroke="#cbbfa5" stroke-width="1" opacity="${f1(k)}"/>`;
      y += rh[ri];
    });
    let cx3 = x0; for (let i = 0; i < cols.length - 1; i++) { cx3 += colW[i]; s += `<path d="M${f1(cx3)} ${f1(y0 + hh)}V${f1(y0 + h)}" stroke="#cbbfa5" stroke-width="1"/>`; }
    if (p.hi != null && p.hi >= 0 && p.hi < rows.length) {
      const yy = y0 + hh + rh.slice(0, p.hi).reduce((a, b) => a + b, 0), q = clamp(p.hiDraw == null ? 1 : p.hiDraw);
      const per = 2 * (w + rh[p.hi]) * q;
      s += `<rect x="${f1(x0 - 6)}" y="${f1(yy - 3)}" width="${f1(w + 12)}" height="${f1(rh[p.hi] + 6)}" rx="10" fill="none" stroke="${p.hiColor || RED}" stroke-width="5" stroke-dasharray="${f1(per)} 99999"/>`;
    }
    if (p.title) s += T(p.title, 0, y0 - 34, p.titleSize || 26, { font: 'head', weight: 400, fill: p.titleColor || INK });
    return s;
  }

  // ---------- philosophy map ----------
  /* nodes [{id, x, y, text, color, fg, size, shape: 'pill'|'box'|'dot'}], edges [[from, to, label, bend]],
     draw 0..1 reveals nodes and arrows in order; hi [ids] get a marker ring. Coordinates are relative. */
  function vmap(p, t, seed, age) {
    const nodes = p.nodes || [], edges = p.edges || [], N = nodes.length + edges.length, d = ageDraw(p, age, p.dur || Math.max(1.5, N * 0.45));
    const byId = Object.fromEntries(nodes.map(n => [n.id, n])), dims = {};
    nodes.forEach(n => { const sz = n.size || p.size || 22, lines = String(n.text).split('\n'); dims[n.id] = { w: Math.max(...lines.map(l => TW(l, sz, 750))) + sz * 1.5, h: lines.length * sz * 1.2 + sz * 0.9, sz }; });
    // order: node, then edges leading out of it, interleaved by array order
    const order = []; nodes.forEach(n => { order.push(['n', n.id]); edges.forEach((e, i) => { if (e[0] === n.id) order.push(['e', i]); }); });
    const at = {}; order.forEach(([k, id], i) => at[k + id] = clamp(d * order.length - i));
    let s = '';
    edges.forEach((e, i) => {
      const q = at['e' + i] || 0; if (q <= 0) return;
      const A = byId[e[0]], B = byId[e[1]]; if (!A || !B) return;
      const da = dims[A.id], db = dims[B.id];
      const ang = Math.atan2(B.y - A.y, B.x - A.x), clip = (dd) => Math.min(dd.w / 2 / Math.max(0.01, Math.abs(Math.cos(ang))), dd.h / 2 / Math.max(0.01, Math.abs(Math.sin(ang)))) + 10;
      const ax = A.x + Math.cos(ang) * clip(da), ay = A.y + Math.sin(ang) * clip(da), bx = B.x - Math.cos(ang) * clip(db), by = B.y - Math.sin(ang) * clip(db);
      const bend = e[3] == null ? 0.12 : e[3], mx = (ax + bx) / 2 - (by - ay) * bend, my = (ay + by) / 2 + (bx - ax) * bend, pts = [];
      for (let k = 0; k <= 24; k++) { const u = k / 24 * q; pts.push([(1 - u) * (1 - u) * ax + 2 * (1 - u) * u * mx + u * u * bx, (1 - u) * (1 - u) * ay + 2 * (1 - u) * u * my + u * u * by]); }
      const col = e[4] || p.arrow || RED;
      s += `<path d="M${pts.map(pt => f1(pt[0]) + ' ' + f1(pt[1])).join('L')}" stroke="${col}" stroke-width="${p.aw || 5}" fill="none" stroke-linecap="round"${e[5] ? ' stroke-dasharray="2 10"' : ''}/>`;
      if (q > 0.95) { const a2 = Math.atan2(by - my, bx - mx), L = 18; s += `<path d="M${f1(bx - L * Math.cos(a2 - 0.5))} ${f1(by - L * Math.sin(a2 - 0.5))}L${f1(bx)} ${f1(by)}L${f1(bx - L * Math.cos(a2 + 0.5))} ${f1(by - L * Math.sin(a2 + 0.5))}" stroke="${col}" stroke-width="${p.aw || 5}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
      if (e[2] && q > 0.6) { const lx = 0.25 * ax + 0.5 * mx + 0.25 * bx, ly = 0.25 * ay + 0.5 * my + 0.25 * by; s += T(e[2], lx, ly - 4, p.lsize || 19, { font: 'mark', weight: 400, fill: p.lcolor || col, op: f1(clamp((q - 0.6) / 0.4)) }); }
    });
    nodes.forEach(n => {
      const q = at['n' + n.id] || 0; if (q <= 0) return;
      const { w, h, sz } = dims[n.id], sc = back(clamp(q * 1.4)), col = n.color || PAPER, e = n.shape === 'box' ? torn(w, h, seed + n.id, 3, 10) : null;
      s += `<g transform="translate(${f1(n.x)} ${f1(n.y)}) rotate(${f1(n.rot || 0)}) scale(${f1(sc)})">`;
      if (n.shape === 'box') s += drop(e, 0.22, 4, 5) + `<path d="${e}" fill="${col}"/>`;
      else s += `<rect x="${f1(-w / 2 + 4)}" y="${f1(-h / 2 + 6)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h / 2)}" fill="#000" opacity="0.2"/><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h / 2)}" fill="${col}"/>`;
      s += T(n.text, 0, 1, sz, { weight: 750, fill: n.fg || INK });
      if ((p.hi || []).includes(n.id)) s += `<ellipse cx="0" cy="0" rx="${f1(w / 2 + 16)}" ry="${f1(h / 2 + 14)}" fill="none" stroke="${p.hiColor || YEL}" stroke-width="5" transform="rotate(-3)"/>`;
      s += `</g>`;
    });
    return s;
  }

  // ---------- trait bars ----------
  /* items [{label, v 0..1, color}], w (bar length), shown 0..N (bars fill in order), size, max label */
  function vbars(p, t, seed, age) {
    const items = p.items || [], size = p.size || 22, gap = p.gap || size * 2.3, bw = p.w || 420, lw = p.lw || Math.max(...items.map(i => TW(i.label, size, 700))) + 24;
    const shown = p.shown != null ? p.shown : ageDraw(p, age, 1.2) * items.length, h = items.length * gap;
    let s = '';
    if (p.title) s += T(p.title, (lw + bw) / 2 - lw, -h / 2 - size * 1.4, size * 1.1, { font: 'head', weight: 400, fill: p.titleColor || INK });
    items.forEach((it, i) => {
      const y = -h / 2 + i * gap + gap / 2, k = easeOut(clamp(shown - i)), x = -lw;
      s += T(it.label, x + lw - 16, y, size, { anchor: 'end', weight: 700, fill: p.labelColor || INK, op: f1(clamp((shown - i) * 3)) });
      s += `<rect x="0" y="${f1(y - size * 0.55)}" width="${bw}" height="${f1(size * 1.1)}" rx="${f1(size * 0.2)}" fill="${p.track || 'rgba(0,0,0,0.12)'}"/>`;
      s += `<rect x="0" y="${f1(y - size * 0.55)}" width="${f1(bw * (it.v || 0) * k)}" height="${f1(size * 1.1)}" rx="${f1(size * 0.2)}" fill="${it.color || RED}"/>`;
      if (it.note && k > 0.9) s += T(it.note, bw * (it.v || 0) + 12, y, size * 0.75, { anchor: 'start', font: 'mark', weight: 400, fill: p.noteColor || INK });
    });
    return s;
  }

  // ---------- equation ----------
  /* A hand-set equation: parts [{text, color, bg}], revealed one by one (shown), with optional strike on index. */
  function veq(p, t, seed, age) {
    const parts = p.parts || [], size = p.size || 48, pad = size * 0.35, ws = parts.map(q => TW(q.text, size, 400, 'head') + pad * 2 + 10);
    const total = ws.reduce((a, b) => a + b, 0), shown = p.shown != null ? p.shown : ageDraw(p, age, 1.0) * parts.length;
    let x = -total / 2, s = '';
    parts.forEach((q, i) => {
      const k = clamp(shown - i), cx = x + ws[i] / 2; x += ws[i]; if (k <= 0) return;
      const sc = back(clamp(k * 1.3));
      s += `<g transform="translate(${f1(cx)} 0) scale(${f1(sc)}) rotate(${f1(q.rot || 0)})">`;
      if (q.bg) { const e = torn(ws[i] - 10, size * 1.5, seed + i, 3, 9); s += drop(e, 0.2, 3, 5) + `<path d="${e}" fill="${q.bg}"/>`; }
      s += T(q.text, 0, 2, size, { font: 'head', weight: 400, fill: q.color || INK }) + `</g>`;
      if (p.strike === i && p.strikeDraw) s += `<path d="M${f1(cx - ws[i] / 2 + 6)} ${f1(size * 0.4)}L${f1(cx - ws[i] / 2 + 6 + (ws[i] - 12) * clamp(p.strikeDraw))} ${f1(-size * 0.4)}" stroke="${RED}" stroke-width="8" stroke-linecap="round"/>`;
    });
    return s;
  }


  // ---------- real photographs ----------
  /* A real archival image. src (relative to the episode dir), iw/ih natural size.
     mode 'print': torn white-bordered print, image covers w x h (focus fx, fy).  mode 'cut': a background-removed
     cut-out PNG (sticker edge baked in) drawn at w x h, optional coloured torn backing (back, bw, bh, bx, by).
     mode 'full': full-bleed plate behind everything, dim overlay (dim, dimColor).
     kb: slow push-in amount over kbT seconds; drift [dx, dy]; tint: multiply colour; ring {x,y,rx,ry} marker circle;
     name/role strips as on cut-outs; cross: red X drawn 0..1; tape (default true for print). */
  function photo(p, t, seed, age) {
    const CL = X.cl, mode = p.mode || 'print', href = esc((X.base || '') + p.src);
    const kq = clamp((age || 0) / (p.kbT || 9)), z = 1 + (p.kb == null ? 0.06 : p.kb) * kq, dr = p.drift || [0, 0];
    let s = '';
    if (mode === 'cut') {
      const w = p.w, h = p.h;
      if (p.back) { const bw = p.bw || w * 0.9, bh = p.bh || h * 0.8, e = torn(bw, bh, seed + 'bk', 6, 12); s += `<g transform="translate(${f1(p.bx || 0)} ${f1(p.by == null ? h * 0.06 : p.by)}) rotate(${f1(p.brot == null ? -3 : p.brot)})">` + drop(e, 0.25) + `<path d="${e}" fill="${p.back}"/>`;
        if (p.backHT !== false) { const [ht, def] = CL.halftone(mix(p.back, '#000', 0.22), 9, 2.4); s += def + `<path d="${e}" fill="url(#${ht})" opacity="0.6"/>`; }
        s += `</g>`; }
      s += `<g transform="translate(${f1(dr[0] * kq)} ${f1(dr[1] * kq)}) scale(${f1(z * 1000) / 1000})"><image href="${href}" x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}"/>`;
      s += `</g>`;
    } else {
      const full = mode === 'full', w = full ? W + 8 : p.w, h = full ? H + 8 : p.h, bd = full ? 0 : (p.border == null ? 12 : p.border);
      const cl = nid('ph'), inner = full ? `M${-w / 2} ${-h / 2}H${w / 2}V${h / 2}H${-w / 2}Z` : torn(w, h, seed + 'in', p.jag == null ? 3 : p.jag, 10);
      if (!full) { const e = torn(w + bd * 2, h + bd * 2, seed, 5, 11); s += drop(e, 0.3, 6, 9) + `<path d="${e}" fill="${p.paper || '#f4efe4'}"/>`; }
      const iw = p.iw || w, ih = p.ih || h, sc = Math.max(w / iw, h / ih) * z, dw = iw * sc, dh = ih * sc;
      const x = -w / 2 - (dw - w) * (p.fx == null ? 0.5 : p.fx) + dr[0] * kq, y = -h / 2 - (dh - h) * (p.fy == null ? 0.5 : p.fy) + dr[1] * kq;
      s += `<clipPath id="${cl}"><path d="${inner}"/></clipPath><g clip-path="url(#${cl})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#2a2620"/><image href="${href}" x="${f1(x)}" y="${f1(y)}" width="${f1(dw)}" height="${f1(dh)}" preserveAspectRatio="none"/>`;
      if (p.tint) s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${p.tint}" style="mix-blend-mode:multiply" opacity="${p.tintO == null ? 0.85 : p.tintO}"/>`;
      if (p.dim) s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${p.dimColor || '#0d0b09'}" opacity="${p.dim}"/>`;
      if (!full && p.vig !== false) { const g = nid('pv'); s += `<radialGradient id="${g}" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a1208" stop-opacity="0.38"/></radialGradient><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#${g})"/>`; }
      s += `</g>`;
      if (!full && p.tape !== false) s += CL.tape(-w * 0.3, -h / 2 - bd + 4, -18, 70, seed + 'a') + CL.tape(w * 0.3, -h / 2 - bd + 4, 16, 70, seed + 'b');
    }
    if (p.ring) { const r = p.ring, d = r.draw != null ? r.draw : clamp(((age || 0) - (r.delay || 0.8)) / 0.7), pts = [];
      for (let i = 0; i <= 40; i++) { const a = -2.2 + i / 40 * Math.PI * 2.15; pts.push([r.x + Math.cos(a) * r.rx * (1 + 0.04 * Math.sin(i)), r.y + Math.sin(a) * r.ry]); }
      s += `<path d="${CL.polyD(CL.wob(pts, seed + 'ring', 3), d)}" stroke="${r.color || RED}" stroke-width="${r.sw || 7}" stroke-linecap="round" fill="none"/>`; }
    if (p.cross != null) { const d = clamp(p.cross), w = p.w || 300, h = p.h || 300; s += `<path d="${CL.polyD(CL.wob([[-w * 0.42, -h * 0.4], [w * 0.42, h * 0.38]], seed + 'x1', 6), d * 2)}" stroke="${RED}" stroke-width="12" stroke-linecap="round" fill="none"/><path d="${CL.polyD(CL.wob([[w * 0.42, -h * 0.4], [-w * 0.42, h * 0.38]], seed + 'x2', 6), clamp(d * 2 - 1))}" stroke="${RED}" stroke-width="12" stroke-linecap="round" fill="none"/>`; }
    if (p.name) {
      const fs = p.nameSize || 24, nw = TW(p.name.toUpperCase(), fs, 400, 'head') + 30, ny = p.nameY != null ? p.nameY : (p.h || 300) / 2 - 6;
      const nk = clamp(((age || 0) - (p.nameDelay || 0.4)) / 0.35);
      s += `<g transform="translate(${f1(p.nameX || 0)} ${f1(ny)}) rotate(${f1(p.nameRot == null ? -2 : p.nameRot)}) scale(${f1(back(nk))})"><path d="${torn(nw, fs * 1.7, seed + 'n', 2, 8)}" fill="${p.nameBg || INK}"/>${T(p.name.toUpperCase(), 0, 1, fs, { font: 'head', fill: p.nameColor || '#f6f1e6', weight: 400 })}</g>`;
      if (p.role) { const rs = p.roleSize || 17, rw = TW(p.role, rs, 650) + 24, rk = clamp(((age || 0) - (p.nameDelay || 0.4) - 0.2) / 0.35); s += `<g transform="translate(${f1(p.nameX || 0)} ${f1(ny + fs * 1.6)}) rotate(1.5) scale(${f1(back(rk))})"><path d="${torn(rw, rs * 1.8, seed + 'r', 2, 8)}" fill="${p.roleColor || YEL}"/>${T(p.role, 0, 1, rs, { weight: 650, fill: INK })}</g>`; }
    }
    return s;
  }

  /* A handwritten note on lined or graph paper (marker or ink hand), written out line by line. */
  function note(p, t, seed, age) {
    const lines = String(p.text).split('\n'), size = p.size || 30, lh = size * 1.45, w = p.w || 460, h = p.h || lines.length * lh + size * 2.2;
    const e = torn(w, h, seed, 4, 11), font = p.font || MARK, d = p.draw != null ? p.draw : clamp(((age || 0) - (p.delay || 0.3)) / (p.speed || lines.length * 0.7));
    let s = drop(e, 0.25) + `<path d="${e}" fill="${p.paper || '#fbf6e2'}"/>`;
    const y0 = -h / 2 + size * 1.25;
    for (let y = y0 + lh * 0.45; y < h / 2 - 6; y += lh) s += `<path d="M${-w / 2 + 6} ${f1(y)}H${w / 2 - 6}" stroke="#9fb6d8" stroke-width="1.1" opacity="0.7"/>`;
    if (p.margin !== false) s += `<path d="M${-w / 2 + 44} ${-h / 2 + 4}V${h / 2 - 4}" stroke="#e08b8b" stroke-width="1.4" opacity="0.8"/>`;
    const total = lines.reduce((a, l) => a + l.length, 0); let left = d * total;
    const cl = nid('nt'); s += `<defs><clipPath id="${cl}">`;
    lines.forEach((l, i) => { const lw = TW(l, size, 400, font), q = Math.max(0, Math.min(1, left / Math.max(1, l.length))); left -= l.length; s += `<rect x="${-w / 2 + 56}" y="${f1(y0 + i * lh - size)}" width="${f1(lw * q + 4)}" height="${f1(size * 1.4)}"/>`; });
    s += `</clipPath></defs><g clip-path="url(#${cl})">`;
    lines.forEach((l, i) => { s += T(l, -w / 2 + 56, y0 + i * lh, size, { font, weight: 400, anchor: 'start', fill: (p.colors && p.colors[i]) || p.color || '#1f2d6b' }); });
    s += `</g>`;
    if (p.tape !== false) s += X.cl.tape(0, -h / 2 + 2, -4, 90, seed + 't');
    return s;
  }


  // ---------- space: star field and orbit trails ----------
  /* A field of pinpoint stars over w x h (centred), twinkling. n, seed, color; lit: [{i, color, r, label}] marks star i
     with a ring; dark 0..1 dims every unlit star (the "lights going out" beat); flash: index of a star that flares
     and dies as flashT goes 0..1. */
  function stars(p, t, seed, age) {
    const n = p.n || 160, w = p.w || W, h = p.h || H, r = rng('st' + (p.seed || seed)), lit = p.lit || [];
    let s = '';
    const pts = []; for (let i = 0; i < n; i++) pts.push([(r() - 0.5) * w, (r() - 0.5) * h, 0.6 + r() * 1.8, r() * 6.28, 0.6 + r() * 1.6]);
    pts.forEach(([x, y, rr, ph, sp], i) => {
      if (lit.some(l => l.i === i)) return;
      const tw = 0.55 + 0.45 * Math.sin(t * sp + ph), o = (1 - (p.dark || 0) * 0.92) * tw;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${p.color || '#f4ecdc'}" opacity="${f1(o)}"/>`;
    });
    lit.forEach(l => {
      const q = pts[l.i % n], x = l.x != null ? l.x - (p.x || 0) : q[0], y = l.y != null ? l.y - (p.y || 0) : q[1]  /* lit x, y are canvas coords */, c = l.color || YEL, rr = l.r || 5;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr * 3)}" fill="${c}" opacity="0.25"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${c}"/>`;
      if (l.ring) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr * 4)}" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="6 6"/>`;
      if (l.label) s += T(l.label, x + (l.lx || 0), y + (l.ly == null ? -rr * 5 : l.ly), l.size || 20, { font: 'mark', weight: 400, fill: l.lcolor || c });
    });
    if (p.flash != null && p.flashT > 0) {
      const q = pts[p.flash % n], k = clamp(p.flashT), big = Math.sin(Math.PI * k) * 60;
      s += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(big)}" fill="#fff6dc" opacity="${f1(0.9 * (1 - k * 0.6))}"/><circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(big * 2)}" fill="${RED}" opacity="${f1(0.35 * (1 - k))}"/>`;
    }
    return s;
  }

  /* Orbit trails: paths [[[x,y],...], ...] (relative), colors [], draw 0..1 reveals each trail; heads glow. */
  function trails(p, t, seed, age) {
    const paths = p.paths || [], d = p.draw != null ? p.draw : 1, cols = p.colors || [YEL, RED, '#7fc8ff'];
    let s = '';
    paths.forEach((pts, i) => {
      const m = Math.max(2, Math.floor(pts.length * clamp(d))), tail = p.tail || pts.length, a = Math.max(0, m - tail), c = cols[i % cols.length];
      s += `<path d="M${pts.slice(a, m).map(q => f1(q[0]) + ' ' + f1(q[1])).join('L')}" stroke="${c}" stroke-width="${p.sw || 3}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
      const hd = pts[m - 1]; s += `<circle cx="${f1(hd[0])}" cy="${f1(hd[1])}" r="${(p.hr || 12) * 2.2}" fill="${c}" opacity="0.22"/><circle cx="${f1(hd[0])}" cy="${f1(hd[1])}" r="${p.hr || 12}" fill="${c}"/>`;
    });
    return s;
  }

  Object.assign(X.DRAW, { vtable, vmap, vbars, veq, photo, note, stars, trails });
})();
