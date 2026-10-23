/* Lumen explainer renderer: flat-vector scenes, soft shading, glows, parallax and particles, drawn as SVG for any time t.
   Same contract as the toon engine: window.Toon.load(ep, tl, svgEl); window.Toon.renderAt(seconds) draws one frame.
   episode.json scenes list "els" (elements) that appear on a narration line ("in"), change on later lines ("keys")
   and leave on another ("out"). See explainer/SKILL.md for the schema. */
(function () {
  const W = 1280, H = 720, FONT = 'Nunito, system-ui, sans-serif';
  const INK = '#0d1330', WHITE = '#fffaf0';
  let EP, TL, SVG, SEGS = [], uid = 0;
  const nid = p => p + (uid++);

  // ---------- math ----------
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const back = p => { const c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const f1 = v => Math.round(v * 10) / 10;
  function hash(str) { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let s = hash(seed) || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }

  // ---------- colour ----------
  const rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, c => c + c); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const hex = a => '#' + a.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, p) => { const x = rgb(a), y = rgb(b); return hex(x.map((v, i) => lerp(v, y[i], p))); };
  const shade = (c, p) => mix(c, '#0b1030', p);   // shadows are cool and coloured, never grey
  const tint = (c, p) => mix(c, '#fff6e6', p);    // highlights are warm

  const PAL = {
    midnight: { top: '#070b26', bot: '#1a2766', glow: '#4a64e0', fx: '#a9bcff' },
    dusk: { top: '#24154a', bot: '#ff8a65', glow: '#ffd08a', fx: '#ffe3c0', hills: ['#b0567f', '#7d3a78', '#552a68', '#331a4c'] },
    teal: { top: '#082a38', bot: '#0f6b6d', glow: '#3fd6c2', fx: '#c4fff5' },
    plum: { top: '#170929', bot: '#55206b', glow: '#c266ff', fx: '#f2d0ff' },
    ember: { top: '#220812', bot: '#76212f', glow: '#ff7a59', fx: '#ffd3bd' },
    day: { top: '#2f8fe0', bot: '#c4ecff', glow: '#fff4c8', fx: '#ffffff', hills: ['#a8e0b0', '#78c98a', '#4fae73', '#2f8f60'] },
  };
  const pal = bg => PAL[(bg && bg.pal) || 'midnight'] || PAL.midnight;

  // ---------- text measure ----------
  let mctx;
  function textW(s, size, weight = 800) {
    if (!mctx) mctx = document.createElement('canvas').getContext('2d');
    mctx.font = `${weight} ${size}px ${FONT}`;
    return mctx.measureText(s).width;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function text(s, x, y, size, o = {}) {
    const lines = String(s).split('\n'), lh = size * (o.lh || 1.12);
    const y0 = y - (lines.length - 1) * lh / 2;
    return lines.map((l, i) => `<text x="${f1(x)}" y="${f1(y0 + i * lh)}" font-family="${FONT}" font-size="${size}" font-weight="${o.weight || 800}" fill="${o.fill || WHITE}" text-anchor="${o.anchor || 'middle'}" dominant-baseline="central"${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}>${esc(l)}</text>`).join('');
  }

  // ---------- shapes ----------
  const circ = (cx, cy, r) => `M${f1(cx - r)} ${f1(cy)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0Z`;
  const ell = (cx, cy, rx, ry) => `M${f1(cx - rx)} ${f1(cy)}a${f1(rx)} ${f1(ry)} 0 1 0 ${f1(2 * rx)} 0a${f1(rx)} ${f1(ry)} 0 1 0 ${f1(-2 * rx)} 0Z`;
  const rrect = (x, y, w, h, r) => `M${f1(x + r)} ${f1(y)}h${f1(w - 2 * r)}a${r} ${r} 0 0 1 ${r} ${r}v${f1(h - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${r}h${f1(-(w - 2 * r))}a${r} ${r} 0 0 1 ${-r} ${-r}v${f1(-(h - 2 * r))}a${r} ${r} 0 0 1 ${r} ${-r}Z`;
  const heartPath = r => `M0 ${f1(0.95 * r)}C${f1(-1.3 * r)} ${f1(0.1 * r)} ${f1(-1.15 * r)} ${f1(-1.05 * r)} 0 ${f1(-0.5 * r)}C${f1(1.15 * r)} ${f1(-1.05 * r)} ${f1(1.3 * r)} ${f1(0.1 * r)} 0 ${f1(0.95 * r)}Z`;

  /* Signature flat shading: the shape in its shadow tone, the base colour shifted up-left and clipped to the shape
     (leaving a crescent of shade bottom-right), plus an optional soft highlight. */
  function solid(d, color, off = 8, hl = null) {
    const c = nid('k');
    return `<clipPath id="${c}"><path d="${d}"/></clipPath><path d="${d}" fill="${shade(color, 0.35)}"/>` +
      `<g clip-path="url(#${c})"><path d="${d}" fill="${color}" transform="translate(${f1(-off)} ${f1(-off)})"/>` +
      (hl ? `<ellipse cx="${f1(hl[0])}" cy="${f1(hl[1])}" rx="${f1(hl[2])}" ry="${f1(hl[3])}" fill="${tint(color, 0.55)}" opacity="0.5" transform="rotate(-30 ${f1(hl[0])} ${f1(hl[1])})"/>` : '') + `</g>`;
  }
  function glow(cx, cy, r, color, op = 0.5) {
    const g = nid('g');
    return `<radialGradient id="${g}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="0.45" stop-color="${color}" stop-opacity="${op * 0.35}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="url(#${g})"/>`;
  }
  const shadow = (rx, ry, op = 0.28) => `<ellipse cx="0" cy="0" rx="${f1(rx)}" ry="${f1(ry)}" fill="#050818" opacity="${op}"/>`;

  // ---------- backgrounds ----------
  function vgrad(top, bot) { const g = nid('v'); return [`url(#${g})`, `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>`]; }
  function vignette(op = 0.45) { const g = nid('vg'); return `<radialGradient id="${g}" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${op}"/></radialGradient><rect width="${W}" height="${H}" fill="url(#${g})"/>`; }
  function stars(T, n, seed, color, par, cam) {
    const r = rng(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const x = r() * (W + 200) - 100 - cam.px * par, y = r() * (H + 100) - 50 - cam.py * par, rad = 0.6 + r() * r() * 2.2;
      const tw = 0.45 + 0.55 * Math.abs(Math.sin(T * (0.6 + r() * 1.6) + r() * 6));
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad)}" fill="${color}" opacity="${f1(tw * (0.4 + rad / 4))}"/>`;
      if (rad > 2.2) s += `<path d="M${f1(x - rad * 3)} ${f1(y)}H${f1(x + rad * 3)}M${f1(x)} ${f1(y - rad * 3)}V${f1(y + rad * 3)}" stroke="${color}" stroke-width="0.8" opacity="${f1(tw * 0.5)}"/>`;
    }
    return s;
  }
  function dust(T, n, seed, color, par, cam, big = false) {
    const r = rng(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const sp = 6 + r() * 14, x0 = r() * W, y0 = r() * H, rad = big ? 18 + r() * 60 : 1 + r() * 2.5;
      const x = ((x0 + Math.sin(T * 0.3 + i) * 20 - cam.px * par) % W + W) % W;
      const y = (((y0 - T * sp - cam.py * par) % (H + 120)) + H + 120) % (H + 120) - 60;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad)}" fill="${color}" opacity="${f1(big ? 0.05 + r() * 0.08 : 0.2 + r() * 0.4)}"/>`;
    }
    return s;
  }
  function hills(i, T, color, cam, base, amp, seed) {
    const r = rng(seed), par = 0.15 + i * 0.22, ph = [r() * 6, r() * 6, r() * 6], fq = [0.004 + r() * 0.003, 0.009 + r() * 0.006, 0.02];
    let d = `M-200 ${H + 10}`;
    for (let x = -200; x <= W + 200; x += 20) {
      const y = base + amp * (Math.sin(x * fq[0] + ph[0]) * 0.6 + Math.sin(x * fq[1] + ph[1]) * 0.3 + Math.sin(x * fq[2] + ph[2]) * 0.1);
      d += `L${x} ${f1(y)}`;
    }
    d += `L${W + 200} ${H + 10}Z`;
    return `<path d="${d}" fill="${color}" transform="translate(${f1(-cam.px * par)} ${f1(-cam.py * par * 0.5)})"/>`;
  }
  function background(bg, T, cam) {
    const kind = (bg && bg.kind) || 'studio', P = pal(bg);
    const [fill, def] = vgrad(P.top, P.bot);
    let s = def + `<rect x="-20" y="-20" width="${W + 40}" height="${H + 40}" fill="${fill}"/>`;
    if (kind === 'space') {
      s += glow(250 - cam.px * 0.1, 200, 420, P.glow, 0.22) + glow(1050 - cam.px * 0.1, 520, 380, '#c266ff', 0.14);
      s += stars(T, 170, 'stars', '#ffffff', 0.08, cam) + stars(T, 40, 'stars2', P.fx, 0.18, cam);
    } else if (kind === 'land') {
      const sunY = 300 - cam.py * 0.1;
      s += glow(880 - cam.px * 0.1, sunY, 520, P.glow, 0.55) + `<circle cx="${f1(880 - cam.px * 0.1)}" cy="${f1(sunY)}" r="70" fill="${tint(P.glow, 0.5)}" opacity="0.85"/>`;
      if ((bg.pal || '') === 'dusk') s += stars(T, 50, 'duskstars', '#ffffff', 0.05, { px: cam.px, py: cam.py - 0 }).replace(/cy="(\d+)/g, (m, v) => `cy="${Math.min(+v, 260)}`);
      const C = P.hills;
      s += hills(0, T, C[0], cam, 420, 50, 'h0') + hills(1, T, C[1], cam, 470, 40, 'h1') + hills(2, T, C[2], cam, 525, 30, 'h2');
      s += dust(T, 30, 'pollen', P.fx, 0.3, cam);
      s += hills(3, T, C[3], cam, 585, 10, 'h3');
    } else if (kind === 'city') {
      s += glow(980, 160, 260, P.glow, 0.3) + `<circle cx="980" cy="160" r="46" fill="${tint(P.glow, 0.7)}" opacity="0.9"/>`;
      s += stars(T, 90, 'citystars', '#ffffff', 0.05, cam);
      ['#3a1854', '#2a1040', '#1a0a2c'].forEach((c, i) => {
        const r = rng('city' + i), par = 0.15 + i * 0.25; let b = '';
        for (let x = -150; x < W + 150;) {
          const w = 40 + r() * 70, h = 120 + r() * (200 - i * 40) + (i === 0 ? 90 : 0), y = H - h - (2 - i) * 30;
          b += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h + 60)}" fill="${c}"/>`;
          for (let wy = y + 14; wy < H - 20; wy += 22) for (let wx = x + 8; wx < x + w - 10; wx += 16)
            if (r() < 0.22 - i * 0.05) b += `<rect x="${f1(wx)}" y="${f1(wy)}" width="7" height="10" rx="1.5" fill="${P.glow}" opacity="${f1(0.35 + r() * 0.5)}"/>`;
          x += w + 4 + r() * 10;
        }
        s += `<g transform="translate(${f1(-cam.px * par)} ${f1(-cam.py * par)})">${b}</g>`;
      });
    } else if (kind === 'deep') {
      s += glow(640 - cam.px * 0.1, 360, 560, P.glow, 0.18) + dust(T, 26, 'bokeh', P.fx, 0.2, cam, true) + dust(T, 50, 'deepdust', P.fx, 0.35, cam);
    } else {   // studio: one soft key light and floating dust
      s += glow(640 - cam.px * 0.1, 330, 620, P.glow, 0.28) + dust(T, 55, 'studiodust', P.fx, 0.3, cam);
    }
    return s + vignette(kind === 'land' ? 0.3 : 0.5);
  }

  // ---------- characters ----------
  /* Pebble: the house creature. A soft egg with a leaf sprout, dot eyes and a tiny mouth. Origin at its feet. */
  function pebble(p, t, seed) {
    const r = 46 * (p.size || 1), col = p.color || '#ffb347', mood = p.mood || 'neutral';
    const ph = (hash(seed) % 100) / 16, rr = rng(seed);
    const squash = 1 + 0.03 * Math.sin(t * 2.6 + ph);
    const by = -r * 0.95 - 3;
    const body = `M0 ${f1(-1.1 * r)}C${f1(0.64 * r)} ${f1(-1.1 * r)} ${f1(r)} ${f1(-0.45 * r)} ${f1(r)} ${f1(0.2 * r)}C${f1(r)} ${f1(0.75 * r)} ${f1(0.6 * r)} ${f1(0.95 * r)} 0 ${f1(0.95 * r)}C${f1(-0.6 * r)} ${f1(0.95 * r)} ${f1(-r)} ${f1(0.75 * r)} ${f1(-r)} ${f1(0.2 * r)}C${f1(-r)} ${f1(-0.45 * r)} ${f1(-0.64 * r)} ${f1(-1.1 * r)} 0 ${f1(-1.1 * r)}Z`;
    let s = shadow(r * 0.95, r * 0.16);
    s += `<g transform="rotate(${f1(p.tilt || 0)}) scale(${f1(1 / Math.sqrt(squash) * 100) / 100} ${f1(squash * 100) / 100})">`;
    // feet
    s += `<ellipse cx="${f1(-r * 0.38)}" cy="-3" rx="${f1(r * 0.22)}" ry="${f1(r * 0.12)}" fill="${shade(col, 0.45)}"/><ellipse cx="${f1(r * 0.38)}" cy="-3" rx="${f1(r * 0.22)}" ry="${f1(r * 0.12)}" fill="${shade(col, 0.45)}"/>`;
    s += `<g transform="translate(0 ${f1(by)})">`;
    if (p.spiky) {
      let sp = '';
      for (let i = 0; i < 7; i++) { const a = -2.6 + i * 0.36, x = Math.cos(a) * r * 0.95, y = Math.sin(a) * r * 1.0 - r * 0.05; sp += `<path d="M${f1(x - Math.sin(a) * r * 0.16)} ${f1(y + Math.cos(a) * r * 0.16)}L${f1(Math.cos(a) * r * 1.42)} ${f1(Math.sin(a) * r * 1.42)}L${f1(x + Math.sin(a) * r * 0.16)} ${f1(y - Math.cos(a) * r * 0.16)}Z" fill="${shade(col, 0.3)}"/>`; }
      s += sp;
    }
    // sprout (sways)
    const sw = Math.sin(t * 1.8 + ph) * 10;
    if (!p.hood && !p.cap) s += `<g transform="translate(0 ${f1(-1.06 * r)}) rotate(${f1(sw)})"><path d="M0 0Q${f1(r * 0.08)} ${f1(-r * 0.25)} 0 ${f1(-r * 0.38)}" stroke="${shade(col, 0.25)}" stroke-width="${f1(r * 0.07)}" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="${f1(r * 0.16)}" cy="${f1(-r * 0.42)}" rx="${f1(r * 0.2)}" ry="${f1(r * 0.09)}" fill="${tint(col, 0.15)}" transform="rotate(-30 ${f1(r * 0.16)} ${f1(-r * 0.42)})"/></g>`;
    s += solid(body, col, r * 0.16, [-r * 0.4, -r * 0.55, r * 0.32, r * 0.16]);
    if (p.hood) {   // a plain dark hood: an anonymous figure, never a marker of any group
      const hc = typeof p.hood === 'string' ? p.hood : '#2b2f45';
      s += `<path d="M${f1(-r * 1.02)} ${f1(0.25 * r)}C${f1(-r * 1.05)} ${f1(-0.7 * r)} ${f1(-0.6 * r)} ${f1(-1.2 * r)} 0 ${f1(-1.2 * r)}C${f1(0.6 * r)} ${f1(-1.2 * r)} ${f1(r * 1.05)} ${f1(-0.7 * r)} ${f1(r * 1.02)} ${f1(0.25 * r)}L${f1(r * 0.7)} ${f1(0.25 * r)}C${f1(r * 0.7)} ${f1(-0.45 * r)} ${f1(r * 0.4)} ${f1(-0.62 * r)} 0 ${f1(-0.62 * r)}C${f1(-r * 0.4)} ${f1(-0.62 * r)} ${f1(-r * 0.7)} ${f1(-0.45 * r)} ${f1(-r * 0.7)} ${f1(0.25 * r)}Z" fill="${hc}"/>`;
    }
    if (p.cap) {   // a flat peaked cap with a small badge (police, gendarme, firefighter)
      const cc = typeof p.cap === 'string' ? p.cap : '#1f3a8a';
      s += `<path d="${rrect(-r * 0.62, -r * 1.32, r * 1.24, r * 0.36, r * 0.12)}" fill="${cc}"/><path d="M${f1(-r * 0.75)} ${f1(-r * 0.96)}h${f1(r * 1.5)}l${f1(-r * 0.12)} ${f1(r * 0.14)}h${f1(-r * 1.26)}Z" fill="${shade(cc, 0.4)}"/>` +
        `<circle cx="0" cy="${f1(-r * 1.14)}" r="${f1(r * 0.1)}" fill="#f2c14e"/>`;
    }
    // arms
    const armY = r * 0.25;
    if (p.hold === 'heart') {
      s += `<path d="M${f1(r * 0.85)} ${f1(armY)}q${f1(r * 0.3)} ${f1(-r * 0.15)} ${f1(r * 0.45)} ${f1(-r * 0.5)}" stroke="${shade(col, 0.2)}" stroke-width="${f1(r * 0.14)}" stroke-linecap="round" fill="none"/>`;
      s += `<g transform="translate(${f1(r * 1.35)} ${f1(-r * 0.45)}) scale(${f1(1 + 0.08 * Math.max(0, Math.sin(t * 6)))})">${glow(0, 0, r * 0.8, '#ff5a7a', 0.5)}${solid(heartPath(r * 0.32), '#ff5a7a', r * 0.06)}</g>`;
    }
    // face
    const ey = -r * 0.12, ex = r * 0.3, ew = r * 0.19, eh = r * 0.23;
    const look = Array.isArray(p.look) ? p.look : [0, 0];
    const blinkT = (t + ph * 3) % (3.2 + (hash(seed) % 7) / 4), blink = blinkT < 0.13;
    const big = mood === 'shocked' ? 1.25 : 1;
    for (const sx of [-1, 1]) {
      const cx = sx * ex + look[0] * r * 0.06;
      if (blink) { s += `<path d="M${f1(cx - ew)} ${f1(ey)}h${f1(2 * ew)}" stroke="${INK}" stroke-width="${f1(r * 0.06)}" stroke-linecap="round"/>`; continue; }
      s += `<ellipse cx="${f1(cx)}" cy="${f1(ey)}" rx="${f1(ew * big)}" ry="${f1(eh * big)}" fill="#ffffff"/>`;
      const pr = r * (mood === 'shocked' ? 0.08 : 0.115);
      s += `<circle cx="${f1(cx + look[0] * ew * 0.4)}" cy="${f1(ey + look[1] * eh * 0.35 + r * 0.03)}" r="${f1(pr)}" fill="${INK}"/><circle cx="${f1(cx + look[0] * ew * 0.4 - pr * 0.35)}" cy="${f1(ey + look[1] * eh * 0.35 - pr * 0.1)}" r="${f1(pr * 0.38)}" fill="#fff"/>`;
      if (mood === 'smug' || mood === 'deadpan' || mood === 'calm')   // heavy lids
        s += `<path d="M${f1(cx - ew * 1.15)} ${f1(ey - eh * 1.2)}h${f1(ew * 2.3)}v${f1(eh * (mood === 'calm' ? 0.95 : 1.15))}h${f1(-ew * 2.3)}Z" fill="${col}"/><path d="M${f1(cx - ew * 1.05)} ${f1(ey - eh * (mood === 'calm' ? 0.25 : 0.05))}h${f1(ew * 2.1)}" stroke="${shade(col, 0.4)}" stroke-width="${f1(r * 0.04)}" stroke-linecap="round"/>`;
      if (mood === 'sad' || mood === 'worried')
        s += `<path d="M${f1(cx - sx * ew * 0.9)} ${f1(ey - eh * 1.25)}L${f1(cx + sx * ew * 0.8)} ${f1(ey - eh * 1.6)}" stroke="${shade(col, 0.55)}" stroke-width="${f1(r * 0.06)}" stroke-linecap="round"/>`;
    }
    const my = r * 0.28, mw = r * 0.2;
    const M = {
      happy: `<path d="M${f1(-mw * 1.3)} ${f1(my - r * 0.04)}Q0 ${f1(my + r * 0.3)} ${f1(mw * 1.3)} ${f1(my - r * 0.04)}Z" fill="${INK}"/><path d="M${f1(-mw * 0.6)} ${f1(my + r * 0.1)}Q0 ${f1(my + r * 0.22)} ${f1(mw * 0.6)} ${f1(my + r * 0.1)}" fill="#ff6f8a"/>`,
      calm: `<path d="M${f1(-mw)} ${f1(my)}Q0 ${f1(my + r * 0.13)} ${f1(mw)} ${f1(my)}" stroke="${INK}" stroke-width="${f1(r * 0.06)}" fill="none" stroke-linecap="round"/>`,
      neutral: `<path d="M${f1(-mw * 0.6)} ${f1(my + r * 0.03)}h${f1(mw * 1.2)}" stroke="${INK}" stroke-width="${f1(r * 0.06)}" stroke-linecap="round"/>`,
      deadpan: `<path d="M${f1(-mw * 0.8)} ${f1(my + r * 0.03)}h${f1(mw * 1.6)}" stroke="${INK}" stroke-width="${f1(r * 0.06)}" stroke-linecap="round"/>`,
      sad: `<path d="M${f1(-mw)} ${f1(my + r * 0.1)}Q0 ${f1(my - r * 0.06)} ${f1(mw)} ${f1(my + r * 0.1)}" stroke="${INK}" stroke-width="${f1(r * 0.06)}" fill="none" stroke-linecap="round"/>`,
      worried: `<path d="M${f1(-mw)} ${f1(my + r * 0.06)}q${f1(mw * 0.5)} ${f1(-r * 0.07)} ${f1(mw)} 0t${f1(mw)} 0" stroke="${INK}" stroke-width="${f1(r * 0.06)}" fill="none" stroke-linecap="round"/>`,
      shocked: `<ellipse cx="0" cy="${f1(my + r * 0.06)}" rx="${f1(r * 0.1)}" ry="${f1(r * 0.13)}" fill="${INK}"/>`,
      smug: `<path d="M${f1(-mw)} ${f1(my + r * 0.04)}Q${f1(mw * 0.3)} ${f1(my + r * 0.1)} ${f1(mw * 1.2)} ${f1(my - r * 0.08)}" stroke="${INK}" stroke-width="${f1(r * 0.06)}" fill="none" stroke-linecap="round"/>`,
    };
    s += M[mood] || M.neutral;
    if (mood === 'happy' || mood === 'calm') s += `<ellipse cx="${f1(-r * 0.55)}" cy="${f1(r * 0.18)}" rx="${f1(r * 0.13)}" ry="${f1(r * 0.07)}" fill="#ff6f8a" opacity="0.35"/><ellipse cx="${f1(r * 0.55)}" cy="${f1(r * 0.18)}" rx="${f1(r * 0.13)}" ry="${f1(r * 0.07)}" fill="#ff6f8a" opacity="0.35"/>`;
    if (mood === 'worried' || mood === 'shocked') s += `<path d="M${f1(r * 0.78)} ${f1(-r * 0.62)}q${f1(r * 0.08)} ${f1(r * 0.16)} 0 ${f1(r * 0.22)}q${f1(-r * 0.08)} ${f1(-r * 0.06)} 0 ${f1(-r * 0.22)}Z" fill="#9fe3ff" opacity="0.9"/>`;
    s += `</g></g>`;
    return s;
  }

  function crowd(p, t, seed, age) {
    const n = p.n || 5, cols = p.cols || n, rows = Math.ceil(n / cols), w = p.w || 600, rh = p.rowh || 0;
    const cols3 = p.colors || ['#7ad3ff'], pos = [];
    for (let i = 0; i < n; i++) {
      const c = i % cols, row = Math.floor(i / cols);
      const x = cols === 1 ? 0 : -w / 2 + c * w / (cols - 1) + (row % 2 ? w / (cols - 1) / 2 : 0) * (rows > 1 ? 1 : 0), y = row * rh;
      pos.push([x, y, i]);
    }
    const order = pos.slice().sort((a, b) => (p.from === 'left' ? a[0] - b[0] : Math.hypot(a[0], a[1] - rh * (rows - 1) / 2) - Math.hypot(b[0], b[1] - rh * (rows - 1) / 2)));
    const rank = {}; order.forEach((q, k) => rank[q[2]] = k / Math.max(1, n - 1));
    let s = '';
    for (const [x, y, i] of pos) {
      if (p.skip === i) continue;
      const a = clamp((age - i * 0.07) / 0.5); if (a <= 0) continue;
      const inf = p.infect != null && rank[i] < p.infect - 0.0001;
      const infAge = p.infect != null ? (p.infect - rank[i]) * 6 : 1;
      const pop = inf && infAge < 0.4 ? 1 + 0.25 * Math.sin(infAge / 0.4 * Math.PI) : 1;
      const col = inf ? p.infectColor : cols3[i % cols3.length];
      const mood = inf ? 'happy' : (p.mood || 'neutral');
      s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(back(a) * pop * 100) / 100})">${pebble({ size: p.size || 0.8, color: col, mood, hood: p.hood, cap: p.cap, look: [Math.sin(i * 2.1) * 0.6, 0] }, t, seed + i)}</g>`;
      if (inf && infAge < 1) s += glow(x, y - 40 * (p.size || 0.8), 60 * (p.size || 0.8), p.infectColor, 0.5 * (1 - infAge));
    }
    return s;
  }

  // ---------- objects ----------
  function heart(p, t) {
    const r = 70 * (p.size || 1), heat = p.heat || 0, crack = p.crack || 0;
    const col = mix(p.color || '#ff5a7a', '#ff3b1f', heat * 0.6);
    const period = 1.1 - 0.55 * heat, ph = (t % period) / period;
    const beat = 1 + (0.07 + heat * 0.05) * (Math.exp(-ph * 14) + 0.6 * Math.exp(-Math.max(0, ph - 0.18) * 14) * (ph > 0.18));
    const shake = heat > 0.5 ? (heat - 0.5) * 6 : 0, jx = Math.sin(t * 47) * shake, jy = Math.cos(t * 39) * shake;
    let s = glow(0, 0, r * (2.4 + heat), heat > 0.4 ? '#ff7a3d' : col, 0.42 + heat * 0.25);
    if (heat > 0.3) {   // embers rising off an overheated heart
      const rr = rng('ember');
      for (let i = 0; i < 16; i++) {
        const sp = 0.6 + rr(), life = (t * sp + rr()) % 1, x = (rr() - 0.5) * r * 1.6 + Math.sin(t * 3 + i) * 8, y = -r * 0.6 - life * r * 1.8;
        s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2 + rr() * 4 * (1 - life))}" fill="${i % 2 ? '#ffd166' : '#ff7a3d'}" opacity="${f1((1 - life) * (heat - 0.3) * 1.4)}"/>`;
      }
    }
    const half = crack * 7;
    const d = heartPath(r);
    if (crack > 0) {
      const ca = nid('ca'), cb = nid('cb');
      const z = `M0 ${f1(-0.5 * r)}L${f1(-0.12 * r)} ${f1(-0.15 * r)}L${f1(0.1 * r)} ${f1(0.1 * r)}L${f1(-0.08 * r)} ${f1(0.4 * r)}L0 ${f1(0.95 * r)}`;
      s += `<clipPath id="${ca}"><path d="${z}L${f1(-2 * r)} ${f1(r)}L${f1(-2 * r)} ${f1(-r)}Z"/></clipPath><clipPath id="${cb}"><path d="${z}L${f1(2 * r)} ${f1(r)}L${f1(2 * r)} ${f1(-r)}Z"/></clipPath>`;
      s += `<g transform="translate(${f1(jx)} ${f1(jy)}) scale(${f1(beat * 100) / 100})"><g clip-path="url(#${ca})" transform="translate(${f1(-half)} 0) rotate(${f1(-crack * 6)})">${solid(d, col, r * 0.12, [-r * 0.45, -r * 0.45, r * 0.3, r * 0.15])}</g>` +
        `<g clip-path="url(#${cb})" transform="translate(${f1(half)} 0) rotate(${f1(crack * 6)})">${solid(d, col, r * 0.12, [-r * 0.45, -r * 0.45, r * 0.3, r * 0.15])}</g></g>`;
    } else {
      s += `<g transform="translate(${f1(jx)} ${f1(jy)}) scale(${f1(beat * 100) / 100})">${solid(d, col, r * 0.12, [-r * 0.45, -r * 0.45, r * 0.3, r * 0.15])}</g>`;
    }
    return s;
  }

  function brain(p, t) {
    const k = 80 * (p.size || 1), col = p.color || '#ff9ec4';
    let s = glow(0, 0, k * 2.2, col, 0.3);
    const d = `M${f1(-k)} ${f1(0.1 * k)}C${f1(-1.1 * k)} ${f1(-0.6 * k)} ${f1(-0.5 * k)} ${f1(-0.95 * k)} 0 ${f1(-0.75 * k)}C${f1(0.5 * k)} ${f1(-0.95 * k)} ${f1(1.1 * k)} ${f1(-0.6 * k)} ${f1(k)} ${f1(0.1 * k)}C${f1(0.95 * k)} ${f1(0.6 * k)} ${f1(0.5 * k)} ${f1(0.75 * k)} ${f1(0.15 * k)} ${f1(0.6 * k)}L${f1(0.2 * k)} ${f1(0.95 * k)}L${f1(-0.05 * k)} ${f1(0.95 * k)}L${f1(-0.1 * k)} ${f1(0.62 * k)}C${f1(-0.6 * k)} ${f1(0.75 * k)} ${f1(-0.95 * k)} ${f1(0.6 * k)} ${f1(-k)} ${f1(0.1 * k)}Z`;
    s += solid(d, col, k * 0.1, [-k * 0.45, -k * 0.5, k * 0.3, k * 0.13]);
    const st = `stroke="${shade(col, 0.3)}" stroke-width="${f1(k * 0.06)}" fill="none" stroke-linecap="round"`;
    s += `<path d="M0 ${f1(-0.72 * k)}C${f1(0.08 * k)} ${f1(-0.3 * k)} ${f1(-0.08 * k)} ${f1(0.1 * k)} 0 ${f1(0.5 * k)}" ${st}/>`;
    s += `<path d="M${f1(-0.7 * k)} ${f1(-0.3 * k)}q${f1(0.2 * k)} ${f1(0.1 * k)} ${f1(0.35 * k)} 0t${f1(0.3 * k)} ${f1(0.05 * k)}M${f1(-0.75 * k)} ${f1(0.2 * k)}q${f1(0.25 * k)} ${f1(-0.12 * k)} ${f1(0.45 * k)} ${f1(0.02 * k)}M${f1(0.2 * k)} ${f1(-0.4 * k)}q${f1(0.2 * k)} ${f1(0.12 * k)} ${f1(0.45 * k)} 0M${f1(0.25 * k)} ${f1(0.1 * k)}q${f1(0.2 * k)} ${f1(-0.12 * k)} ${f1(0.5 * k)} ${f1(0.05 * k)}" ${st}/>`;
    for (let i = 0; i < 3; i++) { const a = t * 1.5 + i * 2.1; s += `<circle cx="${f1(Math.cos(a) * k * 1.25)}" cy="${f1(Math.sin(a) * k * 0.9 - k * 0.1)}" r="${f1(k * 0.05)}" fill="#fff" opacity="0.7"/>`; }
    return s;
  }

  function book(p) {
    const w = p.w || 220, h = p.h || 300, col = p.color || '#f2c14e';
    let s = shadow(w * 0.6, 16).replace('cy="0"', `cy="${f1(h / 2 + 10)}"`);
    s += `<g transform="rotate(-4)">`;
    s += `<path d="${rrect(-w / 2 + 10, -h / 2 + 8, w, h, 10)}" fill="#efe6d2"/><path d="${rrect(-w / 2 + 5, -h / 2 + 4, w, h, 10)}" fill="#fbf4e2"/>`;
    s += solid(rrect(-w / 2, -h / 2, w, h, 10), col, 7);
    s += `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="18" height="${h}" rx="6" fill="${shade(col, 0.25)}"/>`;
    s += `<g transform="translate(8 ${f1(-h * 0.08)})">${solid(heartPath(w * 0.14), '#ff5a7a', 4)}<path d="M${f1(-w * 0.1)} ${f1(w * 0.04)}h${f1(w * 0.2)}" stroke="#0d1330" stroke-width="3" opacity="0.6"/></g>`;
    s += text(p.title || '', 8, -h * 0.32, w * 0.13, { fill: INK, weight: 900 });
    s += text(p.author || '', 8, h * 0.36, w * 0.075, { fill: shade(col, 0.6), weight: 800, ls: 2 });
    return s + `</g>`;
  }

  function rings(p, t, seed, age) {
    const labels = p.labels || [], cols = p.colors || [], n = labels.length, R = p.r || 280;
    let s = glow(0, 0, R * 1.3, cols[0] || '#ffb347', 0.18);
    for (let i = n - 1; i >= 0; i--) {
      const r = R * (0.2 + 0.8 * i / Math.max(1, n - 1)), a = back(clamp((age - (i) * 0.25) / 0.7));
      if (a <= 0) continue;
      s += `<g transform="scale(${f1(a * 100) / 100})">${solid(circ(0, 0, r), cols[i] || '#334', r * 0.04, i === 0 ? [-r * 0.35, -r * 0.4, r * 0.3, r * 0.15] : null)}</g>`;
    }
    for (let i = n - 1; i >= 1; i--) {
      const r = R * (0.2 + 0.8 * i / Math.max(1, n - 1)), rp = R * (0.2 + 0.8 * (i - 1) / Math.max(1, n - 1));
      const o = clamp((age - i * 0.25 - 0.4) / 0.4);
      s += text(labels[i], 0, -(r + rp) / 2, 22, { op: f1(o), fill: i === n - 1 ? '#c9d3ff' : INK, weight: 900 });
    }
    const o0 = clamp((age - 0.3) / 0.4);
    if (o0 > 0) s += `<g transform="translate(0 ${f1(R * 0.12)}) scale(${f1(back(o0) * 100) / 100})">${pebble({ size: R / 300 * 0.7, color: '#ffd166', mood: 'happy' }, t, seed)}</g>`;
    return s;
  }

  function curve(p, t) {
    const w = p.w || 800, h = p.h || 360, L = p.labels || {};
    const x0 = -w / 2, y0 = h / 2;
    const pt = u => [x0 + u * w, y0 - h * 0.85 * (1 - Math.pow(2 * u - 1, 2))];
    let s = '';
    const zone = (a, b, c, op) => `<rect x="${f1(x0 + a * w)}" y="${f1(-h / 2)}" width="${f1((b - a) * w)}" height="${h}" fill="${c}" opacity="${op}" rx="12"/>`;
    s += zone(0, 0.25, '#7ad3ff', 0.08) + zone(0.35, 0.65, '#7bdc8c', 0.14) + zone(0.75, 1, '#ff5a7a', 0.1);
    s += `<path d="M${f1(x0)} ${f1(-h / 2 - 10)}V${f1(y0)}H${f1(x0 + w + 10)}" stroke="#ffffff" stroke-opacity="0.65" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    let d = '', len = 0, prev = null;
    for (let i = 0; i <= 60; i++) { const q = pt(i / 60); d += (i ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); if (prev) len += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; }
    const dr = p.draw == null ? 1 : p.draw;
    s += `<path d="${d}" stroke="#ffd166" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="${f1(len)}" stroke-dashoffset="${f1(len * (1 - dr))}"/>`;
    s += text(L.x || '', 0, y0 + 40, 22, { fill: '#c4fff5', weight: 700 });
    s += `<g transform="translate(${f1(x0 - 26)} 0) rotate(-90)">${text(L.y || '', 0, 0, 22, { fill: '#c4fff5', weight: 700 })}</g>`;
    if (dr > 0.9) {
      const o = f1(clamp((dr - 0.9) * 10));
      s += text(L.left || '', x0 + 0.125 * w, -h / 2 + 26, 22, { op: o, fill: '#9fe3ff' }) + text(L.mid || '', 0, -h / 2 - 22, 22, { op: o, fill: '#a8f0b4' }) + text(L.right || '', x0 + 0.875 * w, -h / 2 + 26, 22, { op: o, fill: '#ffb3c1' });
    }
    if (p.dot != null) {
      const q = pt(clamp(p.dot)), c = Math.abs(p.dot - 0.5) < 0.15 ? '#7bdc8c' : (p.dot < 0.5 ? '#7ad3ff' : '#ff5a7a');
      s += glow(q[0], q[1], 60, c, 0.7) + solid(circ(q[0], q[1], 18), c, 4) + `<circle cx="${f1(q[0] - 5)}" cy="${f1(q[1] - 5)}" r="5" fill="#fff" opacity="0.7"/>`;
    }
    return s;
  }

  function meter(p, t) {
    const r = p.r || 170, v = clamp(p.value || 0), sw = r * 0.16;
    const arc = (a0, a1, rad) => { const p0 = [Math.cos(a0) * rad, Math.sin(a0) * rad], p1 = [Math.cos(a1) * rad, Math.sin(a1) * rad]; return `M${f1(p0[0])} ${f1(p0[1])}A${rad} ${rad} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${f1(p1[0])} ${f1(p1[1])}`; };
    let s = glow(0, -r * 0.3, r * 1.6, v > 0.8 ? '#ff5a3d' : '#5ec8e5', 0.25 + 0.2 * v);
    s += solid(`M${-r - sw} 0A${r + sw} ${r + sw} 0 0 1 ${r + sw} 0Z`, '#1b2550', 6);
    const segs = [[0, 0.33, '#5ec8e5'], [0.33, 0.66, '#7bdc8c'], [0.66, 0.85, '#ffd166'], [0.85, 1, '#ff5a7a']];
    for (const [a, b, c] of segs) s += `<path d="${arc(Math.PI + a * Math.PI + 0.02, Math.PI + b * Math.PI - 0.02, r)}" stroke="${c}" stroke-width="${f1(sw)}" fill="none"/>`;
    for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; s += `<path d="M${f1(Math.cos(a) * (r - sw * 0.9))} ${f1(Math.sin(a) * (r - sw * 0.9))}L${f1(Math.cos(a) * (r - sw * 1.4))} ${f1(Math.sin(a) * (r - sw * 1.4))}" stroke="#fff" stroke-opacity="0.5" stroke-width="3" stroke-linecap="round"/>`; }
    const jit = v > 0.92 ? Math.sin(t * 40) * 2.5 : 0;
    const ang = -90 + v * 180 + jit;
    s += `<g transform="rotate(${f1(ang)})"><path d="M-9 0L0 ${f1(-r * 0.92)}L9 0Z" fill="#fffaf0"/></g>` + solid(circ(0, 0, 18), '#fffaf0', 3);
    if (p.label) s += text(p.label, 0, 42, 26, { weight: 900, ls: 3, fill: '#fffaf0' });
    s += text('0', -r, 30, 20, { fill: '#9fb4d8' }) + text('MAX', r, 30, 20, { fill: '#9fb4d8' });
    return s;
  }

  function label(p) {
    const size = p.size || 22, w = textW(p.text, size, 800) + size * 1.4, h = size * 1.9;
    return `<path d="${rrect(-w / 2 + 3, -h / 2 + 5, w, h, h / 2)}" fill="#050818" opacity="0.3"/>` + solid(rrect(-w / 2, -h / 2, w, h, h / 2), p.color || '#ffd166', 3) +
      text(p.text, 0, 1, size, { fill: p.fg || INK, weight: 800 });
  }

  // ---------- icon glyphs (unit size ~1, drawn white inside a badge) ----------
  const G = {
    heart: c => `<path d="${heartPath(0.62)}" fill="#fff" transform="translate(0 0.05)"/>`,
    cross: c => `<path d="M-0.22 -0.7h0.44v0.48h0.48v0.44h-0.48v0.48h-0.44v-0.48h-0.48v-0.44h0.48Z" fill="#fff"/>`,
    dna: c => { let s = ''; for (let i = 0; i <= 8; i++) { const y = -0.75 + i * 0.19, x = Math.sin(i * 0.8) * 0.45; s += `<path d="M${f1(x * 100) / 100} ${y}L${f1(-x * 100) / 100} ${y}" stroke="#fff" stroke-width="0.07" opacity="0.7"/><circle cx="${x}" cy="${y}" r="0.09" fill="#fff"/><circle cx="${-x}" cy="${y}" r="0.09" fill="${tint(c, 0.6)}"/>`; } return s; },
    fruit: c => `<circle cx="0" cy="0.12" r="0.55" fill="#fff"/><path d="M0 -0.4q0.05 -0.25 0.25 -0.35" stroke="#fff" stroke-width="0.1" fill="none" stroke-linecap="round"/><ellipse cx="0.3" cy="-0.55" rx="0.22" ry="0.1" fill="${tint(c, 0.6)}"/>`,
    gift: c => `<rect x="-0.6" y="-0.25" width="1.2" height="0.85" rx="0.08" fill="#fff"/><rect x="-0.7" y="-0.45" width="1.4" height="0.3" rx="0.08" fill="#fff"/><rect x="-0.1" y="-0.45" width="0.2" height="1.05" fill="${c}"/><path d="M0 -0.45c-0.3 -0.4 -0.6 -0.2 -0.3 0M0 -0.45c0.3 -0.4 0.6 -0.2 0.3 0" stroke="#fff" stroke-width="0.12" fill="none"/>`,
    target: c => `<circle r="0.7" fill="#fff"/><circle r="0.48" fill="${c}"/><circle r="0.26" fill="#fff"/><circle r="0.1" fill="${c}"/>`,
    alarm: c => `<path d="M-0.6 0.35v-0.25a0.6 0.6 0 0 1 1.2 0v0.25l0.12 0.18h-1.44Z" fill="#fff"/><circle cy="0.66" r="0.13" fill="#fff"/><path d="M-0.85 -0.55l-0.15 -0.12M0.85 -0.55l0.15 -0.12M0 -0.85v-0.15" stroke="#fff" stroke-width="0.1" stroke-linecap="round"/>`,
    fear: c => `<path d="M0 -0.7L0.72 0.55H-0.72Z" fill="#fff" stroke="#fff" stroke-width="0.12" stroke-linejoin="round"/><rect x="-0.07" y="-0.3" width="0.14" height="0.48" rx="0.07" fill="${c}"/><circle cy="0.36" r="0.08" fill="${c}"/>`,
    fire: c => `<path d="M0 0.7C-0.55 0.7 -0.65 0.2 -0.45 -0.15C-0.35 0.1 -0.2 0.1 -0.2 0.05C-0.3 -0.3 -0.05 -0.6 0.1 -0.75C0.1 -0.4 0.6 -0.2 0.55 0.2C0.52 0.55 0.3 0.7 0 0.7Z" fill="#fff"/><path d="M0 0.62C-0.22 0.62 -0.28 0.4 -0.15 0.18C0 0.3 0.05 0.1 0.08 0C0.25 0.2 0.25 0.62 0 0.62Z" fill="${tint(c, 0.5)}"/>`,
    calc: c => { let s = `<rect x="-0.5" y="-0.72" width="1" height="1.44" rx="0.12" fill="#fff"/><rect x="-0.38" y="-0.6" width="0.76" height="0.32" rx="0.05" fill="${c}"/>`; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += `<rect x="${-0.38 + j * 0.27}" y="${-0.16 + i * 0.27}" width="0.2" height="0.2" rx="0.04" fill="${shade(c, 0.2)}"/>`; return s; },
    spark: c => `<path d="M0 -0.75Q0.1 -0.1 0.75 0Q0.1 0.1 0 0.75Q-0.1 0.1 -0.75 0Q-0.1 -0.1 0 -0.75Z" fill="#fff"/>`,
    folder: c => `<path d="M-0.7 -0.45h0.45l0.12 0.13h0.83v0.85h-1.4Z" fill="#fff"/><rect x="-0.7" y="-0.18" width="1.4" height="0.72" rx="0.06" fill="${tint(c, 0.7)}"/>`,
    lock: c => `<path d="M-0.32 -0.1v-0.25a0.32 0.32 0 0 1 0.64 0v0.25" stroke="#fff" stroke-width="0.14" fill="none"/><rect x="-0.5" y="-0.12" width="1" height="0.78" rx="0.12" fill="#fff"/><circle cy="0.22" r="0.1" fill="${c}"/>`,
    globe: c => `<circle r="0.68" fill="#fff"/><path d="M-0.4 -0.35q0.25 0.05 0.3 0.25t-0.2 0.35q-0.1 0.2 0.05 0.35M0.25 -0.6q0.05 0.25 0.3 0.3t0.12 0.4" stroke="${c}" stroke-width="0.14" fill="none" stroke-linecap="round"/>`,
    gavel: c => `<g transform="rotate(-35)"><rect x="-0.4" y="-0.55" width="0.8" height="0.36" rx="0.08" fill="#fff"/><rect x="-0.07" y="-0.2" width="0.14" height="0.85" rx="0.06" fill="#fff"/></g><rect x="-0.6" y="0.55" width="0.8" height="0.15" rx="0.05" fill="#fff"/>`,
    flask: c => `<path d="M-0.15 -0.7h0.3v0.45l0.45 0.8a0.15 0.15 0 0 1 -0.13 0.22h-0.94a0.15 0.15 0 0 1 -0.13 -0.22l0.45 -0.8Z" fill="#fff"/><path d="M-0.38 0.3h0.76l0.2 0.37h-1.16Z" fill="${tint(c, 0.4)}"/>`,
    people: c => `<circle cx="-0.32" cy="-0.28" r="0.2" fill="#fff"/><circle cx="0.32" cy="-0.28" r="0.2" fill="#fff"/><path d="M-0.68 0.5a0.36 0.36 0 0 1 0.72 0ZM-0.04 0.5a0.36 0.36 0 0 1 0.72 0Z" fill="#fff"/><circle cx="0" cy="-0.05" r="0.18" fill="${tint(c, 0.6)}"/>`,
    building: c => `<path d="M-0.7 0.6h1.4M-0.6 -0.2h1.2L0 -0.65Z" stroke="#fff" stroke-width="0.12" fill="#fff" stroke-linejoin="round"/>${[-0.45, -0.15, 0.15, 0.45].map(x => `<rect x="${x - 0.07}" y="-0.12" width="0.14" height="0.66" fill="#fff"/>`).join('')}`,
    scales: c => `<path d="M0 -0.7v1.2M-0.4 0.5h0.8M-0.6 -0.45h1.2" stroke="#fff" stroke-width="0.11" stroke-linecap="round"/><path d="M-0.85 0.05a0.25 0.12 0 0 0 0.5 0ZM0.35 0.05a0.25 0.12 0 0 0 0.5 0Z" fill="#fff"/><path d="M-0.6 -0.45L-0.85 0.05M-0.6 -0.45L-0.35 0.05M0.6 -0.45L0.35 0.05M0.6 -0.45L0.85 0.05" stroke="#fff" stroke-width="0.05"/>`,
    shield: c => `<path d="M0 -0.75L0.6 -0.5V0C0.6 0.4 0.3 0.62 0 0.75C-0.3 0.62 -0.6 0.4 -0.6 0V-0.5Z" fill="#fff"/><path d="M-0.25 0l0.18 0.18l0.35 -0.38" stroke="${c}" stroke-width="0.13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    coin: c => `<circle r="0.68" fill="#fff"/><circle r="0.5" fill="${tint(c, 0.25)}"/><path d="M0.15 -0.25h-0.22a0.12 0.12 0 0 0 0 0.25h0.14a0.12 0.12 0 0 1 0 0.25h-0.22M0 -0.35v0.7" stroke="#fff" stroke-width="0.09" fill="none" stroke-linecap="round"/>`,
    chain: c => `<g transform="rotate(-35)"><rect x="-0.75" y="-0.2" width="0.75" height="0.4" rx="0.2" stroke="#fff" stroke-width="0.13" fill="none"/><rect x="0.05" y="-0.2" width="0.75" height="0.4" rx="0.2" stroke="#fff" stroke-width="0.13" fill="none" transform="translate(0.05 0) rotate(8)"/></g><path d="M-0.05 0.15l0.1 -0.3" stroke="${c}" stroke-width="0.16"/>`,
    brain: c => `<path d="M-0.05 -0.62C-0.45 -0.75 -0.8 -0.45 -0.72 -0.1C-0.85 0.15 -0.65 0.5 -0.3 0.45C-0.2 0.62 0 0.6 -0.05 0.45ZM0.05 -0.62C0.45 -0.75 0.8 -0.45 0.72 -0.1C0.85 0.15 0.65 0.5 0.3 0.45C0.2 0.62 0 0.6 0.05 0.45Z" fill="#fff"/><path d="M-0.55 -0.2q0.2 0.05 0.3 -0.12M0.55 -0.2q-0.2 0.05 -0.3 -0.12M-0.5 0.2q0.2 -0.1 0.35 0.05M0.5 0.2q-0.2 -0.1 -0.35 0.05" stroke="${c}" stroke-width="0.07" fill="none" stroke-linecap="round"/>`,
    star: c => `<path d="M0 -0.75L0.2 -0.25L0.72 -0.22L0.32 0.12L0.45 0.65L0 0.36L-0.45 0.65L-0.32 0.12L-0.72 -0.22L-0.2 -0.25Z" fill="#fff" stroke="#fff" stroke-width="0.06" stroke-linejoin="round"/><circle r="0.14" fill="${c}"/>`,
    syringe: c => `<g transform="rotate(45)"><rect x="-0.16" y="-0.5" width="0.32" height="0.9" rx="0.05" fill="#fff"/><rect x="-0.1" y="-0.1" width="0.2" height="0.45" fill="${tint(c, 0.4)}"/><path d="M-0.28 -0.5h0.56M0 -0.5v-0.25M-0.15 -0.75h0.3M0 0.4v0.35" stroke="#fff" stroke-width="0.08" stroke-linecap="round"/></g>`,
    clock: c => `<circle r="0.68" fill="#fff"/><path d="M0 -0.45V0L0.3 0.18" stroke="${c}" stroke-width="0.12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    cap: c => `<path d="M0 -0.5L0.85 -0.12L0 0.26L-0.85 -0.12Z" fill="#fff"/><path d="M-0.5 0.05v0.35q0.5 0.3 1 0v-0.35L0 0.26Z" fill="#fff"/><path d="M0.7 -0.05v0.45" stroke="#fff" stroke-width="0.07"/><circle cx="0.7" cy="0.45" r="0.08" fill="#fff"/>`,
    plane: c => `<g transform="rotate(-35)"><path d="M0 -0.8q0.12 0 0.12 0.2v0.35l0.68 0.38v0.15l-0.68 -0.18v0.42l0.22 0.16v0.12l-0.34 -0.08l-0.34 0.08v-0.12l0.22 -0.16v-0.42l-0.68 0.18v-0.15l0.68 -0.38v-0.35q0 -0.2 0.12 -0.2Z" fill="#fff" transform="translate(-0.0 0.05)"/></g>`,
    receipt: c => `<path d="M-0.45 -0.72h0.9v1.4l-0.15 -0.1l-0.15 0.1l-0.15 -0.1l-0.15 0.1l-0.15 -0.1l-0.15 0.1l-0.15 -0.1l-0.15 0.1Z" fill="#fff"/><path d="M-0.28 -0.45h0.56M-0.28 -0.22h0.56M-0.28 0.01h0.3M-0.28 0.3h0.56" stroke="${c}" stroke-width="0.08" stroke-linecap="round"/>`,
    mic: c => `<rect x="-0.22" y="-0.72" width="0.44" height="0.8" rx="0.22" fill="#fff"/><path d="M-0.42 -0.1a0.42 0.42 0 0 0 0.84 0M0 0.32v0.3M-0.25 0.62h0.5" stroke="#fff" stroke-width="0.1" fill="none" stroke-linecap="round"/>`,
    leaf: c => `<path d="M-0.55 0.55C-0.65 -0.2 -0.1 -0.7 0.65 -0.65C0.65 0.1 0.15 0.65 -0.55 0.55Z" fill="#fff"/><path d="M-0.55 0.55L0.35 -0.35" stroke="${c}" stroke-width="0.08" stroke-linecap="round"/>`,
    medal: c => `<path d="M-0.35 -0.75L-0.05 -0.1M0.35 -0.75L0.05 -0.1" stroke="#fff" stroke-width="0.16" stroke-linecap="round"/><circle cy="0.25" r="0.45" fill="#fff"/><circle cy="0.25" r="0.3" fill="${tint(c, 0.35)}"/><path d="M0 0.08L0.06 0.2L0.18 0.21L0.09 0.29L0.12 0.41L0 0.34L-0.12 0.41L-0.09 0.29L-0.18 0.21L-0.06 0.2Z" fill="#fff"/>`,
    ballot: c => `<rect x="-0.62" y="-0.05" width="1.24" height="0.72" rx="0.08" fill="#fff"/><rect x="-0.3" y="-0.75" width="0.6" height="0.8" rx="0.05" fill="${tint(c, 0.7)}" transform="rotate(8)"/><rect x="-0.35" y="0.04" width="0.7" height="0.1" rx="0.05" fill="${c}"/>`,
    book: c => `<path d="M0 -0.45C-0.3 -0.65 -0.6 -0.6 -0.75 -0.5V0.55C-0.6 0.45 -0.3 0.42 0 0.6C0.3 0.42 0.6 0.45 0.75 0.55V-0.5C0.6 -0.6 0.3 -0.65 0 -0.45Z" fill="#fff"/><path d="M0 -0.45V0.6" stroke="${c}" stroke-width="0.07"/>`,
    home: c => `<path d="M-0.65 -0.05L0 -0.65L0.65 -0.05" stroke="#fff" stroke-width="0.13" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-0.45 -0.1V0.6H0.45V-0.1L0 -0.5Z" fill="#fff"/><rect x="-0.12" y="0.22" width="0.24" height="0.38" rx="0.04" fill="${c}"/>`,
    x: c => `<path d="M-0.4 -0.4L0.4 0.4M0.4 -0.4L-0.4 0.4" stroke="#fff" stroke-width="0.18" stroke-linecap="round"/>`,
    eye: c => `<path d="M-0.75 0Q0 -0.65 0.75 0Q0 0.65 -0.75 0Z" fill="#fff"/><circle r="0.26" fill="${c}"/><circle r="0.11" fill="${INK}"/><circle cx="-0.08" cy="-0.08" r="0.05" fill="#fff"/>`,
    bowling: c => `<path d="M-0.2 -0.7a0.15 0.15 0 0 1 0.3 0q0.05 0.25 -0.03 0.35q0.3 0.35 0.2 0.8h-0.62q-0.1 -0.45 0.2 -0.8q-0.08 -0.1 -0.05 -0.35Z" fill="#fff" transform="translate(-0.25 0)"/><circle cx="0.35" cy="0.3" r="0.32" fill="#fff"/><circle cx="0.27" cy="0.2" r="0.05" fill="${c}"/><circle cx="0.42" cy="0.18" r="0.05" fill="${c}"/>`,
    hash: c => `<path d="M-0.22 -0.7L-0.38 0.7M0.3 -0.7L0.14 0.7M-0.65 -0.25H0.7M-0.72 0.25H0.62" stroke="#fff" stroke-width="0.16" stroke-linecap="round"/>`,
    camera: c => `<rect x="-0.72" y="-0.38" width="1.0" height="0.76" rx="0.14" fill="#fff"/><path d="M0.34 -0.12L0.74 -0.36V0.36L0.34 0.12Z" fill="#fff"/><circle cx="-0.22" cy="0" r="0.18" fill="${c}"/>`,
    car: c => `<path d="M-0.75 0.25V0.02L-0.5 -0.08L-0.32 -0.42H0.32L0.5 -0.08L0.75 0.02V0.25Z" fill="#fff"/><circle cx="-0.42" cy="0.32" r="0.17" fill="${shade(c, 0.3)}"/><circle cx="0.42" cy="0.32" r="0.17" fill="${shade(c, 0.3)}"/><path d="M-0.24 -0.32H0.24L0.36 -0.1H-0.36Z" fill="${tint(c, 0.5)}"/>`,
    phone: c => `<rect x="-0.38" y="-0.72" width="0.76" height="1.44" rx="0.14" fill="#fff"/><rect x="-0.28" y="-0.55" width="0.56" height="1.0" rx="0.05" fill="${tint(c, 0.4)}"/><circle cy="0.58" r="0.07" fill="${c}"/>`,
    quote: c => `<path d="M-0.62 0.45V0.02Q-0.62 -0.5 -0.15 -0.6V-0.38Q-0.36 -0.3 -0.38 -0.08H-0.12V0.45ZM0.12 0.45V0.02Q0.12 -0.5 0.6 -0.6V-0.38Q0.38 -0.3 0.36 -0.08H0.62V0.45Z" fill="#fff"/>`,
    glove: c => `<path d="M-0.45 0.15V-0.3A0.35 0.35 0 0 1 -0.1 -0.65H0.25A0.4 0.4 0 0 1 0.6 -0.25V0.2A0.35 0.35 0 0 1 0.3 0.5H-0.2A0.3 0.3 0 0 1 -0.45 0.15Z" fill="#fff"/><path d="M-0.45 -0.05h-0.15a0.15 0.15 0 0 0 0 0.3h0.2" fill="#fff"/><rect x="-0.25" y="0.5" width="0.6" height="0.25" rx="0.05" fill="${tint(c, 0.5)}"/>`,
  };
  function icon(p, t) {
    const r = p.r || 60, c = p.color || '#5ec8e5', g = G[p.glyph] || G.spark;
    let s = shadow(r * 0.8, r * 0.14).replace('cy="0"', `cy="${f1(r * 1.15)}"`) + glow(0, 0, r * 1.9, c, 0.35);
    s += solid(circ(0, 0, r), c, r * 0.1, [-r * 0.4, -r * 0.45, r * 0.32, r * 0.15]);
    s += `<g transform="scale(${f1(r * 0.62)})">${g(c)}</g>`;
    if (p.label) s += text(p.label, 0, r + 30, Math.max(18, r * 0.36), { weight: 800 });
    return s;
  }
  function card(p, t) {
    const w = p.w || 300, h = p.h || 210, c = p.color || '#5ec8e5';
    let s = `<path d="${rrect(-w / 2 + 6, -h / 2 + 10, w, h, 22)}" fill="#050818" opacity="0.3"/>`;
    s += solid(rrect(-w / 2, -h / 2, w, h, 22), shade(c, 0.45), 6) + `<path d="${rrect(-w / 2, -h / 2, w, 10, 5)}" fill="${c}"/>`;
    s += `<g transform="translate(0 ${f1(-h * 0.17)})">${icon({ r: 42, glyph: p.glyph, color: c }, t)}</g>`;
    const ts = Math.min(26, 26 * (w - 30) / Math.max(1, textW(p.title || '', 26, 900)));   // shrink long titles to fit
    s += text(p.title || '', 0, h * 0.28, f1(ts), { weight: 900 });
    return s;
  }
  function phone(p, t, seed, age) {
    let s = shadow(110, 16).replace('cy="0"', 'cy="200"');
    s += solid(rrect(-95, -180, 190, 360, 30), '#1d2240', 6) + `<path d="${rrect(-82, -160, 164, 320, 18)}" fill="#c266ff"/>`;
    const g = nid('pg'); s += `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8fab"/><stop offset="1" stop-color="#7a3cff"/></linearGradient><path d="${rrect(-82, -160, 164, 320, 18)}" fill="url(#${g})"/>`;
    const pulse = 1 + 0.08 * Math.max(0, Math.sin(t * 8));
    s += `<g transform="translate(0 -30) scale(${f1(pulse * 100) / 100})">${solid(heartPath(46), '#fff', 4)}</g>`;
    s += text(Math.round(p.likes || 0).toLocaleString('en-US'), 0, 60, 38, { weight: 900 }) + text('likes', 0, 98, 20, { fill: '#ffe3f0', weight: 700 });
    const rr = rng('ph');
    for (let i = 0; i < 12; i++) {
      const life = ((t * 0.5 + rr()) % 1), x = 60 + rr() * 140 + Math.sin(t * 2 + i) * 12, y = -40 - life * 260;
      s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1((0.4 + rr() * 0.4) * 100) / 100})" opacity="${f1(Math.sin(life * Math.PI))}"><path d="${heartPath(20)}" fill="${i % 2 ? '#ff5a7a' : '#ff8fab'}"/></g>`;
    }
    return s;
  }
  function arrow(p) {
    const dx = p.x2 - p.x, dy = p.y2 - p.y, bend = p.bend == null ? -0.2 : p.bend;
    const cx = dx / 2 - dy * bend, cy = dy / 2 + dx * bend;
    let len = 0, prev = [0, 0];
    for (let i = 1; i <= 30; i++) { const u = i / 30, x = 2 * (1 - u) * u * cx + u * u * dx, y = 2 * (1 - u) * u * cy + u * u * dy; len += Math.hypot(x - prev[0], y - prev[1]); prev = [x, y]; }
    const dr = p.draw == null ? 1 : p.draw, c = p.color || '#fff';
    let s = `<path d="M0 0Q${f1(cx)} ${f1(cy)} ${f1(dx)} ${f1(dy)}" stroke="${c}" stroke-width="${p.width || 7}" fill="none" stroke-linecap="round" stroke-dasharray="${f1(len)}" stroke-dashoffset="${f1(len * (1 - dr))}"/>`;
    if (dr > 0.97) { const a = Math.atan2(dy - cy, dx - cx) * 180 / Math.PI; s += `<g transform="translate(${f1(dx)} ${f1(dy)}) rotate(${f1(a)})"><path d="M4 0L-18 -13L-14 0L-18 13Z" fill="${c}"/></g>`; }
    return s;
  }
  function mirror(p, t, seed) {
    const c = nid('m');
    let s = glow(0, 0, 320, '#9fe3ff', 0.25);
    s += solid(ell(0, 0, 175, 230), '#f2c14e', 8, [-80, -140, 50, 20]);
    s += `<clipPath id="${c}"><path d="${ell(0, 0, 150, 205)}"/></clipPath><path d="${ell(0, 0, 150, 205)}" fill="#bfe9ff"/>`;
    s += `<g clip-path="url(#${c})"><rect x="-160" y="-210" width="320" height="420" fill="#8fd3ff" opacity="0.5"/>` +
      `<g transform="translate(0 150) scale(-1.4 1.4)">${pebble({ size: 1, color: '#ffb347', mood: 'happy' }, t, seed)}</g>` +
      `<ellipse cx="0" cy="-50" rx="55" ry="14" fill="none" stroke="#ffd166" stroke-width="9"/>` +
      `<path d="M-120 -200L-40 -200L-160 30L-160 -100Z" fill="#fff" opacity="0.25"/><path d="M60 -210L100 -210L-30 210L-70 210Z" fill="#fff" opacity="0.15"/></g>`;
    for (let i = 0; i < 4; i++) { const a = t * 2 + i * 1.6, sc = 0.5 + 0.5 * Math.abs(Math.sin(a)); s += `<g transform="translate(${f1(Math.cos(i * 1.7) * 140)} ${f1(Math.sin(i * 2.3) * 180)}) scale(${f1(sc * 18)})"><path d="M0 -1Q0.1 -0.1 1 0Q0.1 0.1 0 1Q-0.1 0.1 -1 0Q-0.1 -0.1 0 -1Z" fill="#fff"/></g>`; }
    return s;
  }
  function house(p, t) {
    const c = p.color || '#f2c14e';
    let s = solid(`M-330 160C-250 -20 250 -20 330 160Z`, '#6a3a7a', 10);
    s += `<g transform="translate(0 4)">`;
    s += solid(rrect(-90, -110, 180, 120, 6), '#fff1d6', 6) + solid(`M-110 -105L0 -190L110 -105Z`, '#d9534f', 6);
    s += `<rect x="-20" y="-55" width="40" height="65" rx="6" fill="${shade(c, 0.4)}"/>` + [-60, 40].map(x => `<rect x="${x}" y="-80" width="28" height="28" rx="4" fill="#ffd166"/>`).join('');
    s += `<rect x="38" y="-188" width="22" height="46" fill="#a33"/></g>`;
    if (p.gate) {
      let g = `<rect x="-200" y="-4" width="400" height="12" rx="4" fill="#2a1f3d"/><rect x="-200" y="-64" width="400" height="10" rx="4" fill="#2a1f3d"/>`;
      for (let x = -195; x <= 195; x += 26) g += `<rect x="${x}" y="-80" width="8" height="90" rx="3" fill="#2a1f3d"/><path d="M${x - 3} -80L${x + 4} -92L${x + 11} -80Z" fill="#2a1f3d"/>`;
      s += `<g transform="translate(0 40)">${g}</g>`;
    }
    return s;
  }
  function dominoes(p) {
    const n = p.n || 8, gap = p.gap || 100, c = p.color || '#f2c14e', fall = (p.fall || 0) * (n + 0.5);
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = -((n - 1) * gap) / 2 + i * gap, a = clamp(fall - i, 0, 1), ang = easeOut(a) * (i === n - 1 ? 88 : 62);
      s += `<g transform="translate(${f1(x + 22)} 0) rotate(${f1(ang)}) translate(-22 0)">${shadow(28, 6, 0.25).replace('cx="0"', 'cx="22"')}${solid(rrect(0, -150, 44, 150, 8), i % 2 ? c : tint(c, 0.2), 5)}<circle cx="22" cy="-110" r="6" fill="${INK}"/><circle cx="22" cy="-40" r="6" fill="${INK}"/></g>`;
    }
    return s;
  }
  function dots(p, t, seed, age) {
    const n = p.n || 100, cols = p.cols || 10, gap = p.gap || 30, sz = p.size || 10, rows = Math.ceil(n / cols), alt = Math.round(p.alt || 0);
    const r = rng(seed + 'alt'), altSet = new Set(); while (altSet.size < Math.min(alt, n)) altSet.add(Math.floor(r() * n));
    let s = '';
    for (let i = 0; i < n; i++) {
      const cx = -((cols - 1) * gap) / 2 + (i % cols) * gap, cy = -((rows - 1) * gap) / 2 + Math.floor(i / cols) * gap;
      const a = clamp((age - i * 0.012) / 0.3); if (a <= 0) continue;
      const on = altSet.has(i), c = on ? p.altColor : p.color;
      s += (on ? glow(cx, cy, sz * 3, c, 0.6) : '') + `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(sz * back(a) * (on ? 1.25 : 1))}" fill="${c}"/>`;
    }
    return s;
  }
  function scale(p, t) {
    const tilt = (p.tilt || 0) * 14 + Math.sin(t * 1.4) * 1.2;
    let s = shadow(150, 16).replace('cy="0"', 'cy="210"') + solid(rrect(-14, -150, 28, 350, 10), '#f2c14e', 5) + solid(rrect(-110, 180, 220, 30, 12), '#f2c14e', 5);
    s += `<g transform="translate(0 -150) rotate(${f1(tilt)})">` + solid(rrect(-260, -12, 520, 24, 12), '#ffd166', 4);
    for (const [sx, g, c] of [[-1, p.left, '#ff5a7a'], [1, p.right, '#5ec8e5']]) {
      s += `<g transform="translate(${sx * 240} 0) rotate(${f1(-tilt)})"><path d="M0 0L-70 140M0 0L70 140" stroke="#fff" stroke-opacity="0.6" stroke-width="3"/>${solid('M-95 140h190a95 40 0 0 1 -190 0Z', '#e0e6ff', 5)}` +
        `<g transform="translate(0 80)">${icon({ r: 52, glyph: g, color: c }, t)}</g></g>`;
    }
    return s + `</g>` + solid(circ(0, -150, 22), '#fffaf0', 3);
  }
  function planet(p, t) {
    const r = p.r || 400, c = p.color || '#2fb39a', cl = nid('pl');
    let s = glow(0, 0, r * 1.35, tint(c, 0.4), 0.45);
    s += `<clipPath id="${cl}"><path d="${circ(0, 0, r)}"/></clipPath>` + solid(circ(0, 0, r), c, r * 0.05);
    let land = '';
    const rr = rng('land');
    for (let i = 0; i < 12; i++) {   // continents drift slowly across the visible cap
      const x = ((rr() * 2.4 * r + t * 6) % (2.4 * r)) - 1.2 * r, y = -r + r * (0.04 + rr() * 0.3), w = 60 + rr() * 160;
      land += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(w * (0.22 + rr() * 0.12))}" fill="${p.land || '#7bdc8c'}" opacity="0.75"/>`;
    }
    s += `<g clip-path="url(#${cl})">${land}<path d="${circ(-r * 0.12, -r * 0.12, r)}" fill="none" stroke="${tint(c, 0.6)}" stroke-width="${f1(r * 0.03)}" opacity="0.5"/></g>`;
    return s;
  }
  function particles(p, t, seed, age) {
    const n = p.n || 12, w = p.w || 400, h = p.h || 200, rr = rng(seed + 'pt');
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = rr(), b = rr(), sp = 0.5 + rr() * 0.6;
      if (p.kind === 'hearts') {
        const life = ((age * sp * 0.6 + a) % 1), dir = p.dir || 1;
        const x = dir * (-w / 2 + life * w), y = Math.sin(life * Math.PI) * -h * 0.6 + (b - 0.5) * 30;
        s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(0.5 + b * 0.5)})" opacity="${f1(Math.sin(life * Math.PI))}">${solid(heartPath(16), '#ff5a7a', 2)}</g>`;
      } else if (p.kind === 'alerts') {
        const start = a * 3, k = clamp((age - start) / 0.35); if (k <= 0) continue;
        const x = (rr() - 0.5) * w, y = (rr() - 0.5) * h, bob = Math.sin(t * 3 + i) * 4;
        s += `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${f1(back(k) * 100) / 100})">${solid(rrect(-30, -24, 60, 48, 14), i % 3 ? '#ff5a7a' : '#ffb347', 3)}<path d="M-6 24L0 34L6 24Z" fill="${i % 3 ? '#ff5a7a' : '#ffb347'}"/>${text('!', 0, 0, 30, { weight: 900 })}</g>`;
      } else {   // sparkle
        const tw = Math.abs(Math.sin(t * (1 + sp) + a * 6));
        s += `<g transform="translate(${f1((a - 0.5) * w)} ${f1((b - 0.5) * h)}) scale(${f1(tw * 10)})"><path d="M0 -1Q0.1 -0.1 1 0Q0.1 0.1 0 1Q-0.1 0.1 -1 0Q-0.1 -0.1 0 -1Z" fill="${p.color || '#fff'}"/></g>`;
      }
    }
    return s;
  }
  function shapeEl(p) {
    const c = p.color || '#5ec8e5', w = p.w || 100, h = p.h || 100;
    const d = p.shape === 'rect' ? rrect(-w / 2, -h / 2, w, h, p.round || 12) : circ(0, 0, p.r || w / 2);
    return (p.glow ? glow(0, 0, (p.r || w / 2) * 2, c, 0.4) : '') + solid(d, c, (p.r || w / 2) * 0.1);
  }
  function textEl(p) {
    return text(p.text, 2, 3, p.size || 40, { fill: '#050818', weight: p.weight || 900, op: 0.35 }) + text(p.text, 0, 0, p.size || 40, { fill: p.color || WHITE, weight: p.weight || 900 });
  }

  /* Bar chart: bars grow in one after another. values[], labels[], colors[], max, unit, w, h, grow 0..1. */
  function bars(p, t, seed, age) {
    const v = p.values || [], n = v.length, w = p.w || 640, h = p.h || 320, mx = p.max || Math.max(...v, 1);
    const gap = w / Math.max(1, n), bw = Math.min(140, gap * 0.62), cols = p.colors || [];
    let s = `<path d="M${f1(-w / 2 - 10)} ${f1(h / 2)}H${f1(w / 2 + 10)}" stroke="#fff" stroke-opacity="0.6" stroke-width="4" stroke-linecap="round"/>`;
    v.forEach((val, i) => {
      const g = easeOut(clamp((age - 0.2 - i * 0.25) / 0.9)) * (p.grow == null ? 1 : p.grow), bh = Math.max(2, h * val / mx * g);
      const x = -w / 2 + gap * (i + 0.5), c = cols[i] || ['#5ec8e5', '#ffd166', '#ff5a7a', '#7bdc8c', '#c792ea'][i % 5];
      s += solid(rrect(x - bw / 2, h / 2 - bh, bw, bh, Math.min(12, bh / 2)), c, bw * 0.08);
      const shown = p.fmt === 'int' ? Math.round(val * g).toLocaleString('en-US') : (p.dp != null ? (val * g).toFixed(p.dp) : (Math.round(val * g * 10) / 10).toString());
      if (g > 0.05) s += text(shown + (p.unit || ''), x, h / 2 - bh - 26, 28, { weight: 900, op: f1(clamp(g * 3)) });
      if (p.labels && p.labels[i]) s += text(p.labels[i], x, h / 2 + 34, 20, { weight: 800, fill: '#c9d3ff' });
    });
    if (p.title) s += text(p.title, 0, -h / 2 - 50, 24, { weight: 800, fill: '#c9d3ff' });
    return s;
  }

  /* Small original animals for fables and zoology asides. kind: ant frog scorpion cricket hummingbird cassowary snake worm. */
  function critter(p, t, seed) {
    const k = p.kind || 'ant', c = p.color || '#ff7a59', sz = p.size || 1, ph = (hash(seed) % 100) / 16, d = shade(c, 0.4);
    const eye = (x, y, r) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#fff"/><circle cx="${f1(x + r * 0.2)}" cy="${f1(y)}" r="${f1(r * 0.55)}" fill="${INK}"/>`;
    let s = '';
    if (k === 'ant') {
      const walk = Math.sin(t * 9 + ph) * 8;
      for (let i = 0; i < 3; i++) { const x = -10 + i * 16, a = (i % 2 ? walk : -walk); s += `<path d="M${x} -30L${f1(x - 14 + a)} -14L${f1(x - 20 + a)} 0M${x} -30L${f1(x + 14 - a)} -14L${f1(x + 20 - a)} 0" stroke="${d}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
      s += solid(ell(-34, -34, 22, 16), c, 3) + solid(ell(0, -34, 14, 11), c, 2) + solid(ell(30, -40, 16, 14), c, 3) + eye(36, -44, 5);
      s += `<path d="M38 -52Q46 -74 58 -72M32 -53Q34 -76 44 -80" stroke="${d}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    } else if (k === 'frog') {
      const breathe = 1 + 0.04 * Math.sin(t * 3 + ph);
      s += shadow(70, 10) + `<g transform="scale(${f1(breathe * 100) / 100} 1)">` + solid(ell(0, -40, 70, 42), c, 6, [-25, -60, 22, 9]) + `</g>`;
      s += solid(circ(-34, -78, 20), c, 3) + solid(circ(34, -78, 20), c, 3) + eye(-34, -80, 11) + eye(34, -80, 11);
      s += `<path d="M-30 -42Q0 -26 30 -42" stroke="${d}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      s += solid(ell(-58, -6, 24, 9), d, 2) + solid(ell(58, -6, 24, 9), d, 2);
    } else if (k === 'scorpion') {
      const sway = Math.sin(t * 2 + ph) * 6;
      for (let i = 0; i < 4; i++) { const x = -30 + i * 18; s += `<path d="M${x} -24L${x - 10} -6L${x - 14} 0M${x} -24L${x + 4} -6" stroke="${d}" stroke-width="4" fill="none" stroke-linecap="round"/>`; }
      s += solid(ell(-5, -28, 48, 18), c, 3, [-20, -36, 14, 5]);
      const tip = [f1(-6 + sway), -122];
      s += `<path d="M-46 -30C-90 -40 -84 -120 -40 -126S${tip[0] - 4} -128 ${tip[0]} ${tip[1]}" stroke="${d}" stroke-width="15" fill="none" stroke-linecap="round" transform="translate(3 3)"/>`;
      s += `<path d="M-46 -30C-90 -40 -84 -120 -40 -126S${tip[0] - 4} -128 ${tip[0]} ${tip[1]}" stroke="${c}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
      for (let i = 1; i < 5; i++) { const u = i / 5, x = (1 - u) ** 3 * -46 + 3 * (1 - u) ** 2 * u * -90 + 3 * (1 - u) * u * u * -84 + u ** 3 * -40, y = (1 - u) ** 3 * -30 + 3 * (1 - u) ** 2 * u * -40 + 3 * (1 - u) * u * u * -120 + u ** 3 * -126; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="3" fill="${tint(c, 0.3)}"/>`; }
      s += `<path d="M${tip[0] - 4} ${tip[1] - 8}Q${tip[0] + 16} ${tip[1] - 6} ${tip[0] + 12} ${tip[1] + 14}Q${tip[0] + 4} ${tip[1] + 4} ${tip[0] - 4} ${tip[1] + 6}Z" fill="${d}"/>`;
      for (const sy of [-1, 1]) s += `<path d="M38 -28Q60 ${-28 + sy * 14} 70 ${-28 + sy * 22}" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>` + solid(ell(78, -28 + sy * 24, 14, 9), c, 2);
      s += eye(28, -38, 4) + eye(38, -36, 4);
    } else if (k === 'cricket') {
      const hop = Math.max(0, Math.sin(t * 3 + ph)) * 4;
      s += `<g transform="translate(0 ${f1(-hop)})"><path d="M-10 -34L-48 -70L-60 0M10 -30L20 -10L14 0M-4 -30L-12 -8L-18 0" stroke="${d}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += solid(ell(-6, -36, 46, 16), c, 3, [-20, -44, 14, 4]) + solid(circ(40, -40, 14), c, 2) + eye(44, -44, 5);
      s += `<path d="M48 -50Q80 -110 120 -100M44 -52Q60 -110 90 -120" stroke="${d}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
    } else if (k === 'hummingbird') {
      const flap = Math.sin(t * 60) ;
      s += `<g transform="translate(0 -90)">` + `<path d="M-6 -10Q-40 ${f1(-60 * flap)} -70 ${f1(-40 * flap)}Q-40 ${f1(-10 * flap)} -6 0Z" fill="${tint(c, 0.4)}" opacity="0.75"/>`;
      s += solid(ell(0, 0, 30, 16), c, 3, [-8, -6, 10, 4]) + `<path d="M-26 4L-52 14L-46 0Z" fill="${d}"/>` + solid(circ(26, -8, 12), c, 2) + `<path d="M36 -8L84 -4L36 -2Z" fill="${INK}"/>` + eye(28, -10, 3.5) + `</g>`;
    } else if (k === 'cassowary') {
      const bob = Math.sin(t * 2 + ph) * 3;
      s += shadow(80, 12) + `<path d="M-20 -90L-30 -6L-44 0M20 -90L28 -6L42 0" stroke="#7a6a3a" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += solid(ell(0, -140, 80, 66), '#1d2240', 7, [-30, -170, 26, 10]);
      s += `<g transform="translate(0 ${f1(bob)})"><path d="M40 -170Q60 -230 56 -270" stroke="#3fa9f5" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M50 -200q8 20 -2 34" stroke="#ff5a5a" stroke-width="10" fill="none" stroke-linecap="round"/>`;
      s += solid(circ(58, -280, 18), '#3fa9f5', 3) + `<path d="M48 -296Q60 -330 74 -298Z" fill="#c9a24a"/><path d="M72 -282L100 -276L72 -270Z" fill="#2a1f10"/>` + eye(62, -284, 4.5) + `</g>`;
    } else if (k === 'snake') {
      let dd = ''; for (let i = 0; i <= 24; i++) { const x = -120 + i * 10, y = -16 + Math.sin(i * 0.5 - t * 3 + ph) * 12; dd += (i ? 'L' : 'M') + x + ' ' + f1(y); }
      s += `<path d="${dd}" stroke="${d}" stroke-width="22" fill="none" stroke-linecap="round" transform="translate(3 4)"/><path d="${dd}" stroke="${c}" stroke-width="20" fill="none" stroke-linecap="round"/>`;
      const hy = -16 + Math.sin(24 * 0.5 - t * 3 + ph) * 12; s += solid(ell(128, hy, 20, 14), c, 2) + eye(134, hy - 5, 4) + `<path d="M146 ${f1(hy)}l12 -3m-12 3l12 3" stroke="#ff5a7a" stroke-width="2"/>`;
    } else {   // worm: a thin, wriggling hairworm
      let dd = ''; for (let i = 0; i <= 40; i++) { const x = -100 + i * 5, y = -20 + Math.sin(i * 0.45 + t * 4 + ph) * 10; dd += (i ? 'L' : 'M') + x + ' ' + f1(y); }
      s += `<path d="${dd}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    }
    return `<g transform="scale(${p.flip ? -sz : sz} ${sz})">${s}</g>`;
  }

  /* An attributed quote card: short text, who said it. */
  function quote(p) {
    const size = p.size || 30, lines = String(p.text).split('\n'), w = p.w || Math.max(...lines.map(l => textW(l, size, 800))) + 110, h = lines.length * size * 1.2 + (p.by ? 90 : 60), c = p.color || '#5ec8e5';
    let s = `<path d="${rrect(-w / 2 + 6, -h / 2 + 10, w, h, 24)}" fill="#050818" opacity="0.3"/>` + solid(rrect(-w / 2, -h / 2, w, h, 24), shade(c, 0.55), 6);
    s += `<path d="${rrect(-w / 2, -h / 2, 12, h, 6)}" fill="${c}"/>` + text('“', -w / 2 + 40, -h / 2 + 34, 64, { fill: c, weight: 900 });
    s += text(p.text, 10, p.by ? -18 : 0, size, { weight: 800 });
    if (p.by) s += text('— ' + p.by, 10, h / 2 - 30, 20, { weight: 700, fill: tint(c, 0.5) });
    return s;
  }

  // ---------- news and civic elements (stylised; no logos, no real people) ----------
  /* Flames: soft flickering tongues with a glow and rising smoke. Origin at the base. */
  function flames(p, t, seed) {
    const k = p.size || 1, n = p.n || 5, w = (p.w || 120) * k, rr = rng(seed + 'fl');
    let s = glow(0, -50 * k, 150 * k, '#ff7a3d', 0.45);
    for (let i = 0; i < 7; i++) {   // smoke puffs drift up and fade
      const life = (t * 0.25 + rr()) % 1, x = (rr() - 0.5) * w + Math.sin(t + i) * 10 * k + life * 30 * k, y = -90 * k - life * 220 * k, r0 = (18 + life * 46) * k;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r0)}" fill="#3a2f4a" opacity="${f1(0.35 * Math.sin(life * Math.PI))}"/>`;
    }
    const tongue = (x, h, wd, c, ph) => {
      const fl = 1 + 0.12 * Math.sin(t * 9 + ph) + 0.06 * Math.sin(t * 17 + ph * 2), hh = h * fl, sway = Math.sin(t * 5 + ph) * wd * 0.3;
      return `<path d="M${f1(x - wd)} 0C${f1(x - wd)} ${f1(-hh * 0.45)} ${f1(x - wd * 0.2 + sway)} ${f1(-hh * 0.6)} ${f1(x + sway)} ${f1(-hh)}C${f1(x + wd * 0.35 + sway)} ${f1(-hh * 0.6)} ${f1(x + wd)} ${f1(-hh * 0.45)} ${f1(x + wd)} 0Z" fill="${c}"/>`;
    };
    for (let i = 0; i < n; i++) { const x = -w / 2 + (i + 0.5) * w / n; s += tongue(x, (70 + rr() * 50) * k, w / n * 0.75, '#ff5a3d', i * 1.3); }
    for (let i = 0; i < n; i++) { const x = -w / 2 + (i + 0.5) * w / n; s += tongue(x, (45 + rr() * 30) * k, w / n * 0.5, '#ffb347', i * 2.1 + 1); }
    for (let i = 0; i < n; i++) { const x = -w / 2 + (i + 0.5) * w / n; s += tongue(x, (22 + rr() * 16) * k, w / n * 0.28, '#fff0b8', i * 0.7 + 2); }
    for (let i = 0; i < 10; i++) {   // sparks
      const life = (t * (0.6 + rr()) + rr()) % 1, x = (rr() - 0.5) * w * 1.2 + Math.sin(t * 4 + i) * 8, y = -40 * k - life * 160 * k;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1((1.5 + rr() * 2.5) * k)}" fill="#ffd166" opacity="${f1(1 - life)}"/>`;
    }
    return s;
  }
  const burn = (c, b) => mix(c, '#241c30', clamp(b || 0) * 0.85);
  function car(p, t, seed) {
    const c = burn(p.color || '#5ec8e5', p.burnt), k = p.size || 1;
    let s = `<g transform="scale(${k})">` + shadow(120, 14);
    s += solid(`M-120 -22V-58Q-118 -70 -100 -72L-70 -76L-42 -116Q-36 -124 -24 -124H44Q56 -124 64 -114L90 -76L108 -72Q122 -68 122 -54V-22Z`, c, 6, [-70, -70, 30, 8]);
    s += `<path d="M-34 -80L-14 -112H18V-80ZM28 -80V-112H48Q54 -112 58 -106L76 -80Z" fill="${p.burnt ? '#120c18' : '#bfe9ff'}" opacity="${p.burnt ? 0.9 : 0.85}"/>`;
    s += `<rect x="96" y="-64" width="18" height="8" rx="4" fill="${p.burnt ? '#3a3040' : '#ffe6a3'}"/>`;
    for (const x of [-72, 72]) s += `<circle cx="${x}" cy="-20" r="24" fill="#151a2e"/><circle cx="${x}" cy="-20" r="10" fill="${p.burnt ? '#3a3040' : '#9fb4d8'}"/>`;
    s += `</g>`;
    if (p.fire) s += `<g transform="translate(0 ${f1(-60 * k)}) scale(${f1(clamp(p.fire) * 1000) / 1000})">${flames({ size: 0.7 * k, w: 220, n: 5 }, t, seed)}</g>`;
    return s;
  }
  function van(p, t, seed) {
    const c = burn(p.color || '#eef2ff', p.burnt), k = p.size || 1;
    let s = `<g transform="scale(${k})">` + shadow(150, 16);
    s += solid(`M-150 -24V-150Q-150 -162 -138 -162H70Q84 -162 92 -150L130 -96L146 -88Q152 -84 152 -74V-24Z`, c, 6);
    s += `<path d="M78 -150L114 -98H52V-150Z" fill="#14203d" opacity="0.9"/><rect x="-150" y="-80" width="302" height="18" fill="${burn('#1f3a8a', p.burnt)}"/><rect x="-150" y="-62" width="302" height="6" fill="${burn('#ff5a5a', p.burnt)}"/>`;
    for (const x of [-96, 96]) s += `<circle cx="${x}" cy="-22" r="25" fill="#151a2e"/><circle cx="${x}" cy="-22" r="10" fill="#9fb4d8"/>`;
    if (!p.burnt) { const on = Math.sin(t * 9) > 0; s += `<rect x="-30" y="-176" width="60" height="16" rx="6" fill="${on ? '#5ec8ff' : '#2a4a9a'}"/>` + (on ? glow(0, -170, 90, '#5ec8ff', 0.6) : ''); }
    s += `</g>`;
    if (p.fire) s += `<g transform="translate(0 ${f1(-90 * k)}) scale(${f1(clamp(p.fire) * 1000) / 1000})">${flames({ size: 0.75 * k, w: 280, n: 6 }, t, seed)}</g>`;
    return s;
  }
  /* A town hall in the French civic style: pediment, clock, columns and a tricolour. Origin at the base. */
  function townhall(p, t, seed) {
    const k = p.size || 1, b = p.burnt || 0, stone = burn(p.color || '#f3e3c3', b);
    let s = `<g transform="scale(${k})">` + shadow(230, 18);
    s += solid(rrect(-210, -200, 420, 200, 6), stone, 7);
    s += solid(`M-230 -196L0 -290L230 -196Z`, burn('#d9c29a', b), 6);
    s += `<circle cx="0" cy="-232" r="26" fill="${burn('#fffaf0', b)}"/><path d="M0 -232V-250M0 -232L12 -226" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    for (let i = 0; i < 6; i++) { const x = -175 + i * 70; s += `<rect x="${x - 11}" y="-180" width="22" height="170" rx="4" fill="${burn('#fff6e0', b)}"/>`; }
    for (let i = 0; i < 5; i++) { const x = -140 + i * 70; s += `<rect x="${x - 18}" y="-150" width="36" height="56" rx="16" fill="${b ? '#120c18' : '#ffd166'}" opacity="${b ? 0.85 : 0.75}"/>`; }
    s += `<rect x="-28" y="-80" width="56" height="80" rx="24" fill="${burn('#6a3a2a', b)}"/>`;
    s += `<rect x="-3" y="-370" width="6" height="84" fill="#c9d3ff"/>`;
    const wv = Math.sin(t * 3) * 4;
    s += `<path d="M3 -368h28q4 ${f1(wv)} 0 ${f1(36)}h-28Z" fill="#2851c6"/><path d="M31 -368h28q4 ${f1(wv)} 0 ${f1(36)}h-28q4 ${f1(-wv)} 0 ${f1(-36)}Z" fill="#fffaf0"/><path d="M59 -368h28q4 ${f1(wv)} 0 ${f1(36)}h-28q4 ${f1(-wv)} 0 ${f1(-36)}Z" fill="#e8414f"/>`;
    if (p.sign) s += text(p.sign, 0, -186, 18, { fill: INK, weight: 900, ls: 4 });
    s += `</g>`;
    if (p.fire) s += `<g transform="translate(${f1(-60 * k)} ${f1(-180 * k)}) scale(${f1(clamp(p.fire) * 1000) / 1000})">${flames({ size: 1.4 * k, w: 220, n: 6 }, t, seed)}</g>`;
    return s;
  }
  const fmtNum = v => Math.round(v).toLocaleString('en-US');
  /* A big counting number with a label and an optional source line underneath. Key "value" to count up. */
  function stat(p) {
    const size = p.size || 96, c = p.color || '#ffd166';
    let s = glow(0, 0, size * 2.2, c, 0.25);
    const str = (p.prefix || '') + fmtNum(p.value || 0) + (p.suffix || '');
    s += text(str, 3, 4, size, { fill: '#050818', weight: 900, op: 0.35 }) + text(str, 0, 0, size, { fill: c, weight: 900 });
    if (p.label) s += text(p.label, 0, size * 0.78, Math.max(20, size * 0.26), { weight: 800 });
    if (p.src) s += text(p.src, 0, size * 0.78 + Math.max(20, size * 0.26) * 1.25 + 4, 16, { weight: 700, fill: '#9fb4d8' });
    return s;
  }
  /* Source chip: small, calm, always readable. */
  function cite(p) {
    const size = p.size || 16, str = (p.prefix == null ? 'Source: ' : p.prefix) + p.text, w = textW(str, size, 700) + size * 1.6, h = size * 1.9;
    return `<path d="${rrect(-w / 2, -h / 2, w, h, h / 2)}" fill="#050818" opacity="0.55"/>` + text(str, 0, 1, size, { fill: p.color || '#c9d3ff', weight: 700 });
  }
  /* Grouped bar chart (men vs women and the like): groups [{label, vals:[...]}], series [{name, color}], grow 0..1. */
  function gbars(p, t) {
    const G2 = p.groups || [], S = p.series || [{ name: '', color: '#5ec8e5' }], w = p.w || 760, h = p.h || 300, max = p.max || 100, gr = p.grow == null ? 1 : p.grow;
    const gw = w / Math.max(1, G2.length), bw = Math.min(70, gw * 0.7 / S.length);
    let s = `<path d="M${-w / 2} ${h / 2}H${w / 2}" stroke="#fff" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>`;
    G2.forEach((g, i) => {
      const cx = -w / 2 + gw * (i + 0.5);
      g.vals.forEach((v, j) => {
        const x = cx + (j - (S.length - 1) / 2) * (bw + 10), q = easeOut(clamp(gr * 1.4 - i * 0.15 - j * 0.08)), bh = Math.max(2, h * 0.86 * v / max * q);
        s += solid(rrect(x - bw / 2, h / 2 - bh, bw, bh, Math.min(10, bw / 3)), S[j].color, 4);
        if (q > 0.6) s += text(fmtNum(v * q) + (p.unit == null ? '%' : p.unit), x, h / 2 - bh - 20, 24, { weight: 900, op: f1(clamp((q - 0.6) * 2.5)) });
      });
      s += text(g.label, cx, h / 2 + 30, 20, { weight: 800, fill: '#e6ebff' });
    });
    let lx = -((S.length - 1) * 150) / 2;
    for (const se of S) { if (se.name) s += `<circle cx="${f1(lx - 40)}" cy="${f1(-h / 2 - 30)}" r="9" fill="${se.color}"/>` + text(se.name, lx + 10, -h / 2 - 30, 20, { weight: 800 }); lx += 150; }
    return s;
  }
  /* A social feed panel with generic posts (no platform logos). posts [{tag, text, color, stamp}], shown = how many, stamps 0..1. */
  function feed(p, t, seed, age) {
    const w = p.w || 380, posts = p.posts || [], ph = p.ph || 96, gap = 14, h = p.h || (posts.length * (ph + gap) + 70);
    const shown = p.shown == null ? posts.length : p.shown;
    let s = `<path d="${rrect(-w / 2 + 6, -h / 2 + 10, w, h, 26)}" fill="#050818" opacity="0.35"/>` + solid(rrect(-w / 2, -h / 2, w, h, 26), '#1b2147', 5);
    s += text(p.app || 'FEED', -w / 2 + 26, -h / 2 + 30, 18, { anchor: 'start', weight: 900, ls: 3, fill: '#9fb4d8' });
    posts.forEach((q, i) => {
      const a = clamp(Math.min(shown - i, (age - i * 0.45) / 0.4)); if (a <= 0) return;
      const y = -h / 2 + 62 + i * (ph + gap), c = q.color || '#5ec8e5', dy = (1 - easeOut(a)) * 20;
      s += `<g opacity="${f1(a)}" transform="translate(0 ${f1(dy)})"><path d="${rrect(-w / 2 + 16, y, w - 32, ph, 16)}" fill="#262d5c"/>`;
      s += `<circle cx="${f1(-w / 2 + 44)}" cy="${f1(y + 28)}" r="14" fill="${c}"/>` + text(q.tag || '', -w / 2 + 68, y + 28, 19, { anchor: 'start', weight: 900, fill: c });
      s += text(q.text || '', -w / 2 + 34, y + 64, 16, { anchor: 'start', weight: 700, fill: '#e6ebff', lh: 1.25 });
      if (q.stamp && (p.stamps || 0) > i / Math.max(1, posts.length)) {
        const sw = textW(q.stamp, 20, 900) + 26, sa = back(clamp(((p.stamps || 0) - i / posts.length) * 4));
        s += `<g transform="translate(${f1(w / 2 - 30 - sw / 2)} ${f1(y + 30)}) rotate(-8) scale(${f1(sa * 100) / 100})"><path d="${rrect(-sw / 2, -17, sw, 34, 8)}" fill="none" stroke="#ff5a7a" stroke-width="4"/>${text(q.stamp, 0, 1, 20, { weight: 900, fill: '#ff5a7a', ls: 2 })}</g>`;
      }
      s += `</g>`;
    });
    return s;
  }
  /* France as a soft hexagon ("l'Hexagone") with towns that light up as unrest spreads (spread 0..1). */
  function hexmap(p, t, seed) {
    const R = p.r || 230, sp = p.spread || 0, rr = rng(seed + 'hx'), n = p.n || 70;
    const pts = [[0, -1], [0.88, -0.52], [0.84, 0.48], [0.1, 1], [-0.8, 0.6], [-0.95, -0.35]].map(([x, y]) => [x * R, y * R]);
    let d = ''; pts.forEach((q, i) => { const nx = pts[(i + 1) % 6], m = [(q[0] + nx[0]) / 2, (q[1] + nx[1]) / 2]; d += (i ? '' : `M${f1(m[0])} ${f1(m[1])}`); const n2 = pts[(i + 1) % 6], n3 = pts[(i + 2) % 6]; d += `Q${f1(n2[0])} ${f1(n2[1])} ${f1((n2[0] + n3[0]) / 2)} ${f1((n2[1] + n3[1]) / 2)}`; });
    let s = glow(0, 0, R * 1.5, sp > 0.3 ? '#ff7a3d' : '#5ec8e5', 0.18 + 0.2 * sp) + solid(d + 'Z', p.color || '#2a3a7a', 10, [-R * 0.4, -R * 0.45, R * 0.3, R * 0.12]);
    const paris = [R * 0.12, -R * 0.55];
    const towns = [];
    for (let i = 0; i < n; i++) { let x, y; do { x = (rr() * 2 - 1) * R * 0.85; y = (rr() * 2 - 1) * R * 0.85; } while (Math.hypot(x, y) > R * 0.8); towns.push([x, y, Math.hypot(x - paris[0], y - paris[1]) / (R * 1.9) + rr() * 0.25]); }
    towns.push([paris[0], paris[1], 0]);
    for (const [x, y, d0] of towns) {
      const on = sp > d0, q = on ? clamp((sp - d0) * 8) : 0;
      if (on) s += glow(x, y, 26 * q + 6, '#ff7a3d', 0.7);
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(on ? 4 + 3 * q : 3)}" fill="${on ? '#ffd166' : '#8fa3e0'}" opacity="${on ? 1 : 0.6}"/>`;
    }
    (p.cities || []).forEach((c, i) => {   // named cities {name, u, v, note, left} in hexagon units (Paris is about 0.12, -0.55); key `lit` to light them in order
      const x = c.u * R, y = c.v * R, on = clamp((p.lit == null ? 99 : p.lit) - i), col = c.color || '#ff7a59';
      if (on > 0) s += glow(x, y, 22 + 30 * on, col, 0.75 * on);
      s += solid(circ(x, y, 6 + 4 * on), on > 0.5 ? col : '#8fa3e0', 2) + text(c.name, x + (c.left ? -14 : 14), y - 2, 17, { anchor: c.left ? 'end' : 'start', weight: 900, op: f1(0.5 + 0.5 * on) });
      if (c.note && on > 0.5) s += text(c.note, x + (c.left ? -14 : 14), y + 18, 14, { anchor: c.left ? 'end' : 'start', weight: 700, fill: '#ffd8a8', op: f1(on) });
    });
    s += solid(circ(paris[0], paris[1], 9), '#fffaf0', 2) + text(p.city || 'Paris', paris[0] + 16, paris[1] - 4, 18, { anchor: 'start', weight: 900 });
    if (p.pin) s += `<g transform="translate(${f1(paris[0] - 14)} ${f1(paris[1] + 14)})">${glow(0, 0, 40, '#ff5a7a', 0.8)}<circle r="7" fill="#ff5a7a"/></g>` + text(p.pin, paris[0] + 2, paris[1] + 24, 16, { anchor: 'start', weight: 800, fill: '#ffb3c1' });
    return s;
  }

  // ---------- investigation elements ----------
  /* Evidence stamp: what kind of claim is on screen. kind: fact reporting analysis disputed unsupported (or text + color). */
  const STAMPS = { fact: ['ON THE RECORD', '#7bdc8c'], reporting: ['HER REPORTING', '#5ec8e5'], analysis: ["NOMANI'S ANALYSIS", '#ffb347'], disputed: ['DISPUTED', '#ff8fab'], unsupported: ['NOT SUPPORTED', '#ff5a7a'] };
  function stamp(p, t, seed, age) {
    const [txt, col] = STAMPS[p.kind] || [p.text || 'NOTE', p.color || '#ffd166'], size = p.size || 22, c = p.color || col;
    const w = textW(p.text || txt, size, 900) + (p.text || txt).length * 2 + size * 1.6, h = size * 2.1, a = back(clamp(age / 0.35)), sc = 1.6 - 0.6 * a;
    return `<g transform="rotate(${p.rot == null ? -6 : 0}) scale(${f1(sc * 100) / 100})" opacity="${f1(clamp(age / 0.2))}">` + glow(0, 0, w * 0.7, c, 0.18) +
      `<path d="${rrect(-w / 2, -h / 2, w, h, 10)}" fill="#050818" fill-opacity="0.45" stroke="${c}" stroke-width="4"/>` + text(p.text || txt, 0, 1, size, { weight: 900, fill: c, ls: 2 }) + `</g>`;
  }
  /* Two movements as overlapping circles; key "join" 0..1 to slide them together. left/right/mid labels. */
  function venn(p, t) {
    const r = p.r || 170, j = p.join == null ? 0.5 : p.join, dx = r * (1.25 - 0.75 * j), lc = p.lc || '#ff5a5a', rc = p.rc || '#3fcf8e';
    let s = glow(-dx, 0, r * 1.6, lc, 0.25) + glow(dx, 0, r * 1.6, rc, 0.25);
    s += `<circle cx="${f1(-dx)}" cy="0" r="${r}" fill="${lc}" opacity="0.62"/><circle cx="${f1(dx)}" cy="0" r="${r}" fill="${rc}" opacity="0.62"/>`;
    s += `<circle cx="${f1(-dx)}" cy="0" r="${r}" fill="none" stroke="${tint(lc, 0.4)}" stroke-width="4"/><circle cx="${f1(dx)}" cy="0" r="${r}" fill="none" stroke="${tint(rc, 0.4)}" stroke-width="4"/>`;
    if (p.left) s += text(p.left, -dx - r * 0.35, 0, p.size || 26, { weight: 900 });
    if (p.right) s += text(p.right, dx + r * 0.35, 0, p.size || 26, { weight: 900 });
    if (p.mid && j > 0.6) s += text(p.mid, 0, 0, (p.size || 26) * 0.8, { weight: 900, fill: '#fff6e6', op: f1(clamp((j - 0.6) * 4)) });
    return s;
  }
  /* A network map. nodes [{name, u, v, color, r}] in px from the origin; edges [[a, b, "solid"|"dash"]]; key "draw" 0..1 for edges, "shown" for nodes. */
  function web(p, t, seed, age) {
    const N = p.nodes || [], E = p.edges || [], dr = p.draw == null ? 1 : p.draw, shown = p.shown == null ? N.length : p.shown;
    let s = '';
    E.forEach(([a, b, st], i) => {
      const A = N[a], B = N[b]; if (!A || !B || a >= shown || b >= shown) return;
      const q = clamp(dr * E.length - i); if (q <= 0) return;
      const x2 = A.u + (B.u - A.u) * q, y2 = A.v + (B.v - A.v) * q, dash = st === 'dash';
      s += `<path d="M${f1(A.u)} ${f1(A.v)}L${f1(x2)} ${f1(y2)}" stroke="${dash ? '#ffb347' : '#e6ebff'}" stroke-opacity="${dash ? 0.85 : 0.6}" stroke-width="${dash ? 3 : 4}"${dash ? ' stroke-dasharray="10 9"' : ''} stroke-linecap="round"/>`;
    });
    N.forEach((n, i) => {
      const q = back(clamp((shown - i) * 1.5)); if (q <= 0) return;
      const r = (n.r || 34) * q, c = n.color || '#5ec8e5', bob = Math.sin(t * 1.3 + i) * 3;
      s += `<g transform="translate(${f1(n.u)} ${f1(n.v + bob)})">` + glow(0, 0, r * 2, c, 0.3) + solid(circ(0, 0, r), c, r * 0.12, [-r * 0.35, -r * 0.4, r * 0.3, r * 0.14]);
      s += text(n.name, 0, (n.below === false ? -1 : 1) * (r + 20), n.fs || 18, { weight: 900, op: f1(clamp(q)) }) + `</g>`;
    });
    return s;
  }
  /* A horizontal timeline. events [{year, text, color}]; key "shown" to reveal them in order. */
  function tline(p, t, seed, age) {
    const ev = p.events || [], w = p.w || 1000, n = ev.length, shown = p.shown == null ? n : p.shown;
    let s = `<path d="M${-w / 2} 0H${w / 2}" stroke="#fff" stroke-opacity="0.5" stroke-width="5" stroke-linecap="round"/>`;
    ev.forEach((e, i) => {
      const x = -w / 2 + (n === 1 ? w / 2 : i * w / (n - 1)), q = clamp(shown - i), up = i % 2 === 0, c = e.color || '#ffd166';
      s += solid(circ(x, 0, 8 + 6 * q), q > 0.5 ? c : '#5a6aa0', 2);
      if (q <= 0) return;
      s += `<g opacity="${f1(q)}">` + glow(x, 0, 40, c, 0.5 * q) + text(e.year, x, up ? -38 : 38, 26, { weight: 900, fill: c });
      s += text(e.text, x, up ? -92 : 96, 17, { weight: 800, fill: '#e6ebff', lh: 1.2 }) + `</g>`;
    });
    return s;
  }

  const DRAW = { pebble, crowd, heart, brain, book, rings, curve, meter, label, icon, card, phone, arrow, mirror, house, dominoes, dots, scale, planet, particles, shape: shapeEl, text: textEl, bars, critter, quote,
    flames, car, van, townhall, stat, cite, gbars, feed, hexmap, stamp, venn, web, tline };

  // ---------- timing ----------
  function load(ep, tl, svg) {
    EP = ep; TL = tl; SVG = svg;
    SVG.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const byId = {}; ep.sequence.forEach(s => byId[s.id] = s);
    SEGS = [];
    for (const sh of tl.shots) {
      let g = SEGS[SEGS.length - 1];
      if (!g || g.seg.id !== sh.seg) { g = { seg: byId[sh.seg], start: sh.start, lines: [] }; SEGS.push(g); }
      if (sh.type === 'line') g.lines[sh.idx] = sh; else g.card = sh;
    }
    SEGS.forEach((g, i) => { g.end = i + 1 < SEGS.length ? SEGS[i + 1].start : tl.duration; if (i === 0) g.start = 0; });
  }
  function mixVal(a, b, q) {
    if (typeof b === 'number' && typeof a === 'number') return lerp(a, b, q);
    if (Array.isArray(b) && Array.isArray(a)) return b.map((v, i) => lerp(a[i] ?? v, v, q));
    if (typeof b === 'string' && typeof a === 'string' && b[0] === '#' && a[0] === '#') return mix(a, b, q);
    return q > 0.15 ? b : a;
  }

  // ---------- cards ----------
  function drawCard(g, T) {
    const c = g.seg, age = T - g.start, dur = g.end - g.start, out = clamp((g.end - T) / 0.45);
    const cam = { px: age * 6, py: 0 };
    let s = '';
    if (c.style === 'chapter') {
      const col = c.color || '#5ec8e5';
      const [fill, def] = vgrad(shade(col, 0.82), shade(col, 0.6));
      s += def + `<rect width="${W}" height="${H}" fill="${fill}"/>` + glow(640, 300, 520, col, 0.35) + dust(T, 60, 'card' + c.id, tint(col, 0.6), 0.3, cam) + vignette(0.5);
      const a = back(clamp(age / 0.6)), ring = easeOut(clamp((age - 0.2) / 1.2));
      const circum = 2 * Math.PI * 118;
      s += `<g transform="translate(640 280)"><circle r="118" fill="none" stroke="${tint(col, 0.4)}" stroke-width="6" stroke-dasharray="${f1(circum)}" stroke-dashoffset="${f1(circum * (1 - ring))}" transform="rotate(-90)" stroke-linecap="round"/>` +
        `<g transform="scale(${f1(a * 100) / 100})">${icon({ r: 90, glyph: c.glyph, color: col }, T)}</g></g>`;
      const to = clamp((age - 0.35) / 0.5);
      s += `<g opacity="${f1(to)}" transform="translate(0 ${f1((1 - easeOut(to)) * 20)})">` + text((c.kicker || '').toUpperCase(), 640, 455, 22, { fill: tint(col, 0.5), ls: 6, weight: 800 }) + text(c.title, 640, 510, 54, { weight: 900 }) + `</g>`;
    } else if (c.style === 'end') {
      s += background({ kind: 'space', pal: 'midnight' }, T, cam);
      s += text(c.title || 'LUMEN', 640, 150, 64, { weight: 900, ls: 14, op: f1(clamp(age / 0.8)) });
      (c.credits || []).forEach((l, i) => { const o = clamp((age - 0.8 - i * 0.4) / 0.6); s += text(l, 640, 260 + i * 46, 24, { weight: 700, fill: '#c9d3ff', op: f1(o) }); });
      s += text(EP.meta.disclaimer || '', 640, 560, 18, { weight: 600, fill: '#8f9cd0', op: f1(clamp((age - 3) / 0.8)) });
      s += `<g transform="translate(640 690)">${pebble({ size: 0.8, color: '#ffb347', mood: 'happy', tilt: Math.sin(T * 3) * 6 }, T, 'endpip')}</g>`;
    } else {   // title
      s += background({ kind: 'space', pal: 'plum' }, T, cam);
      const a = clamp(age / 1.2);
      s += `<g transform="translate(640 330) scale(${f1((0.8 + 0.2 * easeOut(a)) * 100) / 100})" opacity="${f1(0.35 + 0.3 * a)}">${c.glyph ? icon({ r: 170, glyph: c.glyph, color: c.color || '#c266ff' }, T) : heart({ size: 2.4, color: '#ff5a7a' }, T)}</g>`;
      s += text((EP.meta.show || '').split('').join(' '), 640, 200, 24, { weight: 800, fill: '#f2d0ff', ls: 6, op: f1(clamp((age - 0.3) / 0.6)) });
      const to = clamp((age - 0.6) / 0.8);
      s += `<g opacity="${f1(to)}" transform="translate(0 ${f1((1 - easeOut(to)) * 30)})">${text(c.title, 643, 345, 78, { weight: 900, fill: '#050818', op: 0.35 })}${text(c.title, 640, 340, 78, { weight: 900 })}</g>`;
      s += text(c.sub || '', 640, 430, 26, { weight: 700, fill: '#f2d0ff', op: f1(clamp((age - 1.4) / 0.6)) });
    }
    if (out < 1) s += `<rect width="${W}" height="${H}" fill="#050818" opacity="${f1(1 - out)}"/>`;
    if (age < 0.3) s += `<rect width="${W}" height="${H}" fill="#050818" opacity="${f1(1 - age / 0.3)}"/>`;
    return s;
  }

  // ---------- scenes ----------
  function drawScene(g, T) {
    const sc = g.seg, dur = g.end - g.start, age = T - g.start, u = ease(clamp(age / dur));
    const cam0 = sc.cam || {}, z = cam0.zoom ? lerp(cam0.zoom[0], cam0.zoom[1], u) : lerp(1, 1.04, u);
    const pan = cam0.pan ? [lerp(cam0.pan[0][0], cam0.pan[1][0], u), lerp(cam0.pan[0][1], cam0.pan[1][1], u)] : [0, 0];
    const settle = 1 + 0.05 * (1 - easeOut(clamp(age / 0.8)));
    const cam = { px: pan[0], py: pan[1] };
    const lineAbs = k => (g.lines[k] ? g.lines[k].start : (k >= g.lines.length ? g.end : g.start));
    let s = `<g transform="translate(${W / 2} ${H / 2}) scale(${f1((1 + (z * settle - 1) * 0.35) * 1000) / 1000}) translate(${-W / 2} ${-H / 2})">${background(sc.bg, T, cam)}</g>`;
    s += `<g transform="translate(${W / 2} ${H / 2}) scale(${f1(z * settle * 1000) / 1000}) translate(${f1(-W / 2 - pan[0])} ${f1(-H / 2 - pan[1])})">`;
    for (const el of sc.els || []) {
      const appear = lineAbs(el.in || 0) + (el.d || 0) + (el.in ? 0 : 0.15);
      if (T < appear) continue;
      const p = { ...el };
      const ks = Object.keys(el.keys || {}).map(Number).sort((a, b) => a - b);
      for (const k of ks) {
        const kv = el.keys[k], at = lineAbs(k) + (kv.d || 0);
        if (T < at) continue;
        const q = ease(clamp((T - at) / (kv.t || 0.8)));
        for (const [name, v] of Object.entries(kv)) if (name !== 'd' && name !== 't') p[name] = mixVal(p[name], v, q);
      }
      const a = T - appear, kind = el.anim || 'pop';
      let sc2 = 1, op = 1, dx = 0, dy = 0;
      if (kind === 'pop') { sc2 = back(clamp(a / 0.55)); op = clamp(a / 0.15); }
      else if (kind === 'fade') op = ease(clamp(a / 0.7));
      else if (kind === 'rise') { dy = (1 - easeOut(clamp(a / 0.8))) * 70; op = clamp(a / 0.4); }
      else if (kind === 'drop') { dy = -(1 - back(clamp(a / 0.7))) * 140; op = clamp(a / 0.2); }
      else if (kind === 'left' || kind === 'right') { dx = (kind === 'left' ? -1 : 1) * (1 - easeOut(clamp(a / 0.8))) * 260; op = clamp(a / 0.3); }
      else if (kind === 'grow') sc2 = 1;
      if (el.out != null && el.out < g.lines.length) {
        const ot = lineAbs(el.out) + (el.dOut || 0);
        if (T > ot) { const q = clamp((T - ot) / 0.4); op *= 1 - q; sc2 *= 1 - 0.3 * easeOut(q); if (q >= 1) continue; }
      }
      if (el.float) dy += Math.sin(T * 1.4 + hash(el.id) % 7) * el.float;
      const fn = DRAW[el.type]; if (!fn) continue;
      const body = fn(p, T, sc.id + el.id, a);
      s += `<g transform="translate(${f1(p.x + dx)} ${f1(p.y + dy)}) scale(${f1((p.s || 1) * sc2 * 1000) / 1000})${p.rot ? ` rotate(${f1(p.rot)})` : ''}" opacity="${f1(op * (p.o == null ? 1 : p.o) * 100) / 100}">${body}</g>`;
    }
    s += `</g>`;
    if (EP.meta.captions) {
      const ln = g.lines.findIndex(l => l && T >= l.start && T <= l.end + 0.2);
      const L = ln >= 0 && sc.lines[ln].text;
      if (L) s += `<rect x="140" y="${H - 74}" width="${W - 280}" height="50" rx="12" fill="#050818" opacity="0.55"/>` + text(L.length > 95 ? L.slice(0, 92) + '...' : L, W / 2, H - 49, 22, { weight: 700 });
    }
    const fin = clamp(age / 0.3), fout = clamp((g.end - T) / 0.22);
    const dip = Math.min(fin, fout);
    if (dip < 1) s += `<rect width="${W}" height="${H}" fill="#050818" opacity="${f1((1 - dip) * 100) / 100}"/>`;
    return s;
  }

  function renderAt(T) {
    if (!SEGS.length) return;
    uid = 0;
    let g = SEGS[0];
    for (const x of SEGS) if (T >= x.start) g = x;
    SVG.innerHTML = g.seg.type === 'card' ? drawCard(g, T) : drawScene(g, T);
  }

  window.Toon = { load, renderAt, get duration() { return TL ? TL.duration : 0; } };
})();
