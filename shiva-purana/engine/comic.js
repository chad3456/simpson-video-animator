/* Shiva Purana renderer: a moving comic book. Painted backgrounds, inked figures with lip-sync, keyframed staging,
   cinematic cameras, comic panels (full, split, triple, inset), yellow narration captions, speech / thought / shout /
   divine balloons, SFX lettering, cover-style title cards and ink transitions. One episode.json carries both
   languages; meta.lang picks the lettering ('en' or 'hi').
   Contract shared with the other shows: await Toon.load(ep, tl, svgEl); Toon.renderAt(seconds); Toon.duration. */
(function () {
  const W = 1280, H = 720, G = 12;   // page gutter
  const { figure, creature, CAST, f1, shade, INK, GOLD, GOLD_L, GOLD_D, RUBY } = window.CBFig;
  const { SETS, ramp } = window.CBSets;
  const FX = window.CBFx;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const back = p => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const SCALE = 2;
  let EP, TL, SVG, SEGS = [], RASTER = {}, L = {}, uid = 0, LANG = 'en';
  let LET, SFXF, TITLEF;
  const T_ = (o, k) => (LANG !== 'en' && o[k + '_' + LANG] != null ? o[k + '_' + LANG] : o[k]);

  // ---------- text ----------
  let mctx;
  function textW(s, size, font) { if (!mctx) mctx = document.createElement('canvas').getContext('2d'); mctx.font = `${size}px ${font}`; return mctx.measureText(s).width; }
  function wrap(s, size, maxW, font) {
    const words = String(s).split(/\s+/); const out = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (textW(t, size, font) > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
    if (cur) out.push(cur); return out;
  }
  function text(s, x, y, size, o = {}) {
    return `<text x="${f1(x)}" y="${f1(y)}" font-family="${o.font || LET}" font-size="${size}" fill="${o.fill || INK}" text-anchor="${o.anchor || 'middle'}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 5}" paint-order="stroke" stroke-linejoin="round"` : ''}${o.op != null ? ` opacity="${f1(o.op * 100) / 100}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.weight ? ` font-weight="${o.weight}"` : ''}>${esc(s)}</text>`;
  }
  // pages of wrapped rows, shown in turn over the line's duration (weighted by length)
  function pageAt(lines, rowsPer, ph) {
    const pages = []; for (let i = 0; i < lines.length; i += rowsPer) pages.push(lines.slice(i, i + rowsPer));
    const total = lines.reduce((n, l) => n + l.length, 0) || 1; let acc = 0, page = pages[0] || [];
    for (const pg of pages) { const n = pg.reduce((m, l) => m + l.length, 0); if (ph * total >= acc) page = pg; acc += n; }
    return page;
  }

  // ---------- defs ----------
  const STATIC_DEFS = `<defs>
    <pattern id="cbDots" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="3.5" cy="3.5" r="1.5" fill="#120a14" opacity="0.55"/></pattern>
    <pattern id="cbScreen" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(15)"><circle cx="2.5" cy="2.5" r="0.9" fill="#000"/></pattern>
    <radialGradient id="cbGlow"><stop offset="0" stop-color="#fff8d0" stop-opacity="0.95"/><stop offset="0.45" stop-color="#ffe68a" stop-opacity="0.45"/><stop offset="1" stop-color="#fff0a0" stop-opacity="0"/></radialGradient>
    <radialGradient id="cbFireGlow"><stop offset="0" stop-color="#ffe08a" stop-opacity="0.95"/><stop offset="0.5" stop-color="#ff6a1a" stop-opacity="0.4"/><stop offset="1" stop-color="#ff3a0a" stop-opacity="0"/></radialGradient>
    <radialGradient id="cbWarm"><stop offset="0" stop-color="#ffb84a" stop-opacity="0.7"/><stop offset="1" stop-color="#7a2a0a" stop-opacity="0"/></radialGradient>
    <linearGradient id="cbPillarGlow" x1="0" x2="1"><stop offset="0" stop-color="#ff8a1a" stop-opacity="0"/><stop offset="0.5" stop-color="#ffd25a" stop-opacity="0.85"/><stop offset="1" stop-color="#ff8a1a" stop-opacity="0"/></linearGradient>
    <radialGradient id="cbVig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient>
  </defs>`;

  // ---------- rasterise ----------
  async function rasterize(body, scale = SCALE) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * scale}" height="${H * scale}" viewBox="0 0 ${W} ${H}">${STATIC_DEFS}${body}</svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const img = new Image(); img.src = url; await img.decode();
    const cv = document.createElement('canvas'); cv.width = W * scale; cv.height = H * scale;
    cv.getContext('2d').drawImage(img, 0, 0); URL.revokeObjectURL(url);
    const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
    return URL.createObjectURL(blob);
  }
  function imgEl(url, parent) {
    const im = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    im.setAttribute('href', url); im.setAttribute('width', W); im.setAttribute('height', H); im.setAttribute('preserveAspectRatio', 'none');
    im.style.display = 'none'; parent.appendChild(im); return im;
  }
  const ctxKey = (set, c) => set + '|' + JSON.stringify(c || {});
  async function ensure(set, c) {
    const k = ctxKey(set, c); if (RASTER[k]) return;
    const S = SETS[set]; if (!S) { console.warn('no set', set); return; }
    const layers = S(c || {});
    RASTER[k] = { back: imgEl(await rasterize(layers.back), L.bgs) };
    if (layers.front) RASTER[k].front = imgEl(await rasterize(layers.front), L.fronts);
  }
  function showRaster(set, c) {
    for (const k in RASTER) { const r = RASTER[k]; r.back.style.display = 'none'; if (r.front) r.front.style.display = 'none'; }
    const r = RASTER[ctxKey(set, c)]; if (r) { r.back.style.display = ''; if (r.front) r.front.style.display = ''; }
  }

  // ---------- staging ----------
  const NUM = v => typeof v === 'number';
  function keyList(el) {
    if (el._keys) return el._keys;
    el._keys = Object.entries(el.keys || {}).flatMap(([i, k]) => (Array.isArray(k) ? k : [k]).map(kk => [Number(i), kk])).sort((a, b) => a[0] - b[0] || (a[1].d || 0) - (b[1].d || 0));
    return el._keys;
  }
  const SKIP = new Set(['t', 'd', 'ease']);
  function propsAt(el, g, T) {
    const p = Object.assign({}, el); delete p.keys; delete p._keys;
    for (const [i, k] of keyList(el)) {
      const ln = g.lines[i]; if (!ln) continue;
      const start = ln.start + (k.d || 0); if (T < start) break;
      const dur = k.t ?? 0.8, ph = dur > 0 ? clamp((T - start) / dur) : 1, e = (k.ease === 'linear' ? ph : ease(ph));
      for (const [prop, v] of Object.entries(k)) {
        if (SKIP.has(prop)) continue;
        const prev = p[prop];
        if (NUM(v) && NUM(prev ?? (prop === 'o' ? 1 : 0))) p[prop] = lerp(prev ?? (prop === 'o' ? 1 : 0), v, e);
        else if (prop === 'pose' && prev && prev !== v && ph < 1) { p.pose = prev; p.pose2 = v; p.poseMix = e; }
        else p[prop] = v;
      }
      if (k.pose && ph >= 1) { delete p.pose2; p.poseMix = 0; }
    }
    return p;
  }
  function visibility(el, g, T) {
    const inLn = g.lines[el.in || 0];
    const tin = (el.in ? (inLn ? inLn.start : g.start) : g.start) + (el.d || 0);
    if (T < tin) return { vis: 0, age: 0 };
    let v = el.anim === 'none' || (!el.in && !el.d && !el.anim) ? 1 : clamp((T - tin) / (el.inDur || 0.6));
    if (el.out != null) {
      const oLn = g.lines[el.out]; const tout = (oLn ? oLn.start : g.end) + (el.od || 0);
      if (T > tout) v = Math.min(v, 1 - clamp((T - tout) / (el.outDur || 0.5)));
    }
    return { vis: v, age: T - tin };
  }

  // ---------- figures ----------
  function figH(p) { return (p.seat === 'lotus' ? 280 : p.seat === 'kneel' ? 340 : 430) * (p.s || 1); }
  function headAt(p) { const lift = p.seat === 'lotus' ? 160 : p.seat === 'kneel' ? 90 : 0; return [p.x, p.y + (-384 + lift) * (p.s || 1) + (p.fly ? Math.sin(0) : 0)]; }
  function blinkAt(T, seed) { const per = 3.4 + (seed % 7) * 0.4, ph = (T + seed * 0.77) % per; return ph < 0.14 ? Math.sin(ph / 0.14 * Math.PI) : 0; }
  function envAt(line, T) {
    if (!line || !line.env || !line.env.length) return 0;
    const i = Math.floor((T - line.start) * (TL.envFps || 30));
    return i >= 0 && i < line.env.length ? line.env[i] : 0;
  }
  function drawChar(el, p, T, vis, speaking, line) {
    const base = CAST[p.fig || el.id]; if (!base) return '';
    const o = Object.assign({}, base, p.look || {});
    if (p.halo === false) o.halo = false; else if (p.halo) o.halo = p.halo;
    const st = {
      t: T, pose: p.pose, pose2: p.pose2, poseMix: p.poseMix, emo: p.emo, look: p.gaze, seat: p.seat, walk: p.walk, turn: p.turn,
      lean: (p.lean || 0), open: speaking ? envAt(line, T) : 0, blink: p.emo === 'meditate' ? 0 : blinkAt(T, (o.seed || 1) * 3.1),
      item: p.item, itemL: p.itemL, thirdOpen: p.third, nod: speaking ? Math.sin(T * 5) * envAt(line, T) * 1.6 : 0
    };
    const s = p.s || 1, face = p.face || 1;
    const bob = p.fly ? Math.sin(T * 1.6 + (o.seed || 0)) * 8 : 0;
    let anim = '', op = vis * (p.o ?? 1), sc = s;
    if (vis < 1) {
      if (p.anim === 'grow' || p.anim === 'materialize') sc = s * (0.15 + 0.85 * easeOut(vis));
      if (p.anim === 'rise') anim = `translate(0 ${f1((1 - easeOut(vis)) * 80)})`;
      if (p.anim === 'drop') anim = `translate(0 ${f1(-(1 - easeOut(vis)) * 400)})`;
      if (p.anim === 'left') anim = `translate(${f1(-(1 - easeOut(vis)) * 600)} 0)`;
      if (p.anim === 'right') anim = `translate(${f1((1 - easeOut(vis)) * 600)} 0)`;
    }
    let out = '';
    if (p.aura || (p.anim === 'materialize' && vis < 1)) {
      const r = figH(p) * 0.8 * Math.max(p.aura || 0, p.anim === 'materialize' ? (1 - vis) * 1.6 : 0);
      out += `<circle cx="${f1(p.x)}" cy="${f1(p.y - figH(p) * 0.55)}" r="${f1(r)}" fill="url(#${p.auraWarm ? 'cbFireGlow' : 'cbGlow'})" opacity="${f1(Math.min(1, op + 0.2))}"/>`;
    }
    if (!p.fly && p.shadow !== false) out += `<ellipse cx="${f1(p.x)}" cy="${f1(p.y + 2)}" rx="${f1(80 * s)}" ry="${f1(11 * s)}" fill="#0a0610" opacity="${f1(0.3 * op)}"/>`;
    out += `<g transform="translate(${f1(p.x)} ${f1(p.y + bob)}) ${anim} rotate(${f1(p.rot || 0)}) scale(${f1(sc * face * 1000) / 1000} ${f1(sc * 1000) / 1000})" opacity="${f1(op * 1000) / 1000}">${figure(o, st)}</g>`;
    return out;
  }
  function drawCreature(el, p, T, vis) {
    const s = p.s || 1, face = p.face || 1, op = vis * (p.o ?? 1);
    const bob = p.fly ? Math.sin(T * 2) * 10 : 0;
    let sc = s; if (vis < 1 && (p.anim === 'grow' || p.anim === 'materialize')) sc = s * (0.2 + 0.8 * easeOut(vis));
    let anim = '';
    if (vis < 1 && p.anim === 'left') anim = `translate(${f1(-(1 - easeOut(vis)) * 600)} 0)`;
    if (vis < 1 && p.anim === 'right') anim = `translate(${f1((1 - easeOut(vis)) * 600)} 0)`;
    return (p.shadow !== false && !p.fly ? `<ellipse cx="${f1(p.x)}" cy="${f1(p.y + 2)}" rx="${f1(120 * s)}" ry="${f1(12 * s)}" fill="#0a0610" opacity="${f1(0.3 * op)}"/>` : '') +
      `<g transform="translate(${f1(p.x)} ${f1(p.y + bob)}) ${anim} rotate(${f1(p.rot || 0)}) scale(${f1(sc * face * 1000) / 1000} ${f1(sc * 1000) / 1000})" opacity="${f1(op * 1000) / 1000}">${creature(p.kind, { t: T }, p)}</g>`;
  }
  function drawFx(el, p, T, age, vis) {
    const f = FX[p.kind]; if (!f) return '';
    p._uid = el._uid || (el._uid = ++uid);
    const s = p.s || 1, op = vis * (p.o ?? 1);
    let sc = s; if (vis < 1 && (p.anim === 'grow' || p.anim === 'pop')) sc = s * (p.anim === 'pop' ? back(vis) : easeOut(vis));
    return `<g transform="translate(${f1(p.x || 0)} ${f1(p.y || 0)}) rotate(${f1(p.rot || 0)}) scale(${f1(sc * 1000) / 1000})" opacity="${f1(op * 1000) / 1000}">${f(p, T, age, el._uid)}</g>`;
  }

  // ---------- cameras ----------
  function camFor(spec, states) {
    if (!spec || spec === 'wide') return { cx: 640, cy: 360, z: 1 };
    let [kind, arg] = spec.split(':');
    if (arg == null && states[kind]) { arg = kind; kind = 'mid'; }   // a bare id frames a mid shot
    if (kind === 'at') { const [x, y, z] = arg.split(',').map(Number); return { cx: x, cy: y, z: z || 1 }; }
    const ids = (arg || '').split(',').filter(Boolean);
    const Pp = ids.map(id => states[id]).filter(Boolean);
    if (!Pp.length) return { cx: 640, cy: 360, z: 1 };
    if (kind === 'two' || Pp.length > 1) {
      const xs = Pp.map(p => p.x), tops = Pp.map(p => p.y - figH(p) - 30), bots = Pp.map(p => p.y);
      const x0 = Math.min(...xs) - 170, x1 = Math.max(...xs) + 170, y0 = Math.min(...tops) - 20, y1 = Math.max(...bots) + 20;
      const z = clamp(Math.min(W / (x1 - x0), H / (y1 - y0)), 1, 2.8);
      return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, z };
    }
    const p = Pp[0], h = figH(p), [hx, hy] = headAt(p);
    const dir = p.face || 1;
    if (kind === 'full') { const z = clamp(H / (h * 1.22), 1, 3.2); return { cx: p.x, cy: p.y - h * 0.5, z }; }
    if (kind === 'mid') { const z = clamp(H / (h * 0.72), 1, 4.5); return { cx: p.x + dir * 20 * (p.s || 1), cy: p.y - h * 0.66, z }; }
    if (kind === 'close') { const z = clamp(H / (h * 0.4), 1, 7); return { cx: hx + dir * 34 * (p.s || 1), cy: hy + h * 0.07, z }; }
    if (kind === 'ecu') { const z = clamp(H / (h * 0.19), 1, 10); return { cx: hx + dir * 10 * (p.s || 1), cy: hy - 6 * (p.s || 1), z }; }
    if (kind === 'low') { const z = clamp(H / (h * 1.0), 1, 3.5); return { cx: p.x, cy: p.y - h * 0.42, z, low: true }; }
    return { cx: 640, cy: 360, z: 1 };
  }
  function clampCam(c, w = W, h = H) {
    const hw = w / 2 / c.z, hh = h / 2 / c.z;
    return Object.assign({}, c, { cx: clamp(c.cx, Math.min(hw, 640), Math.max(W - hw, 640)), cy: clamp(c.cy, Math.min(hh, 360), Math.max(H - hh, 360)) });
  }
  // panel layouts: clip polygons + the centre each camera is framed into
  function layout(kind, n) {
    const g = G, x0 = g, y0 = g, x1 = W - g, y1 = H - g;
    if (kind === 'inset') return [{ pts: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] }, { pts: [[820, 430], [1248, 430], [1248, 690], [820, 690]], inset: true }];
    if (n === 2 || kind === 'split') return [{ pts: [[x0, y0], [668, y0], [612, y1], [x0, y1]] }, { pts: [[668 + g, y0], [x1, y0], [x1, y1], [612 + g, y1]] }];
    if (n >= 3 || kind === 'triple') return [{ pts: [[x0, y0], [440, y0], [400, y1], [x0, y1]] }, { pts: [[440 + g, y0], [860, y0], [820, y1], [400 + g, y1]] }, { pts: [[860 + g, y0], [x1, y0], [x1, y1], [820 + g, y1]] }];
    return [{ pts: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] }];
  }
  const ptsD = pts => 'M' + pts.map(p => `${f1(p[0])},${f1(p[1])}`).join('L') + 'Z';
  const bbox = pts => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };

  // ---------- load ----------
  async function load(ep, tl, svg) {
    EP = ep; TL = tl; SVG = svg; LANG = (ep.meta && ep.meta.lang) || 'en';
    LET = LANG === 'hi' ? "Kalam, 'Noto Sans Devanagari', sans-serif" : "Kalam, 'Comic Neue', sans-serif";
    SFXF = LANG === 'hi' ? "Rozha, Kalam, serif" : "Bangers, Impact, sans-serif";
    TITLEF = LANG === 'hi' ? "Rozha, Kalam, serif" : "Bangers, Impact, sans-serif";
    SVG.setAttribute('viewBox', `0 0 ${W} ${H}`);
    SVG.innerHTML = STATIC_DEFS + `<defs><g id="W"><g id="bgs"></g><g id="live"></g><g id="fronts"></g><g id="live2"></g></g></defs><rect id="page" width="${W}" height="${H}" fill="#f3e6c6"/><g id="pagebg"></g><g id="panels"></g><g id="hud"></g><g id="over"></g>`;
    for (const k of ['bgs', 'live', 'fronts', 'live2', 'panels', 'hud', 'over', 'pagebg']) L[k] = SVG.querySelector('#' + k);
    const byId = {}; ep.sequence.forEach(s => byId[s.id] = s);
    SEGS = [];
    for (const sh of tl.shots) {
      let g = SEGS[SEGS.length - 1];
      if (!g || g.seg.id !== sh.seg) { g = { seg: byId[sh.seg], start: sh.start, lines: [] }; SEGS.push(g); }
      if (sh.type === 'line') g.lines[sh.idx] = sh; else g.card = sh;
    }
    SEGS.forEach((g, i) => { g.end = i + 1 < SEGS.length ? SEGS[i + 1].start : tl.duration; if (i === 0) g.start = 0; });
    for (let i = 1; i < SEGS.length; i++) SEGS[i].start = SEGS[i - 1].end = Math.min(SEGS[i].start, SEGS[i].lines.find(Boolean)?.start ?? SEGS[i].start);
    for (const g of SEGS) {
      const s = g.seg;
      if (s.type === 'scene') await ensure(s.set, s.ctx || {});
      else await ensure('card', { col: s.bg || ({ open: '#1a0a2a', title: '#c8281e', chapter: '#1a3a7a', end: '#1a0a2a', next: '#2a1a4a' }[s.style] || '#c8281e') });
      if (s.type === 'scene') (s.els || []).forEach(el => { if (!el.kind) el.kind = CAST[el.fig || el.id] ? (CAST[el.fig || el.id].creature ? 'creature' : 'char') : 'fx'; });
    }
    // page paper: cream with a faint dot screen; the print overlay adds grain and a vignette over everything
    L.pagebg.innerHTML = `<rect width="${W}" height="${H}" fill="url(#cbScreen)" opacity="0.06"/>`;
    const ov = await rasterize(grainSvg(), 1);
    const im = imgEl(ov, L.over); im.style.display = '';
  }
  function grainSvg() {
    let s = `<rect width="${W}" height="${H}" fill="url(#cbVig)"/>`;
    let x = 12345;
    const r = () => ((x = (x * 1103515245 + 12345) >>> 0) / 4294967296);
    for (let i = 0; i < 2200; i++) s += `<rect x="${f1(r() * W)}" y="${f1(r() * H)}" width="1.3" height="1.3" fill="${r() > 0.5 ? '#fff' : '#000'}" opacity="${f1(0.05 + r() * 0.08)}"/>`;
    return s;
  }

  function lineAt(g, T) { let k = -1; for (let i = 0; i < g.lines.length; i++) if (g.lines[i] && g.lines[i].start <= T) k = i; return k; }

  // ---------- scene ----------
  function scene(g, T) {
    const s = g.seg;
    showRaster(s.set, s.ctx || {});
    const k = Math.max(0, lineAt(g, T));
    const ln = s.lines[k] || {}, sh = g.lines[k];
    const states = {}, draws = [];
    (s.els || []).forEach((el, order) => {
      const v = visibility(el, g, T); if (v.vis <= 0) return;
      const p = propsAt(el, g, T); p.anim = el.anim;
      states[el.id] = p; draws.push([el, p, v, order]);
    });
    // draw the world once (it is shown through every panel)
    draws.sort((a, b) => (a[1].z || 0) - (b[1].z || 0) || a[3] - b[3]);
    let live = '', top = '';
    const speakerIds = new Set();
    if (ln.who) { speakerIds.add(ln.who); const c = EP.cast[ln.who]; if (c && (c.twin || c.duet)) (c.twin || c.duet).forEach(i => speakerIds.add(i)); }
    for (const [el, p, v] of draws) {
      const speaking = speakerIds.has(el.id) && sh && !sh.silent;
      let svg = '';
      if (el.kind === 'char') svg = drawChar(el, p, T, v.vis, speaking, sh);
      else if (el.kind === 'creature') svg = drawCreature(el, Object.assign({}, p, { kind: el.creature || (CAST[el.fig || el.id] || {}).creature }), T, v.vis);
      else svg = drawFx(el, p, T, v.age, v.vis);
      if ((p.z || 0) >= 50) top += svg; else live += svg;
    }
    L.live.innerHTML = live; L.live2.innerHTML = top;
    // cameras (one per panel)
    const camSpecs = String(ln.cam || s.cam || 'wide').split('|');
    const panels = layout(ln.panel || s.panel, camSpecs.length);
    const shotStart = sh ? sh.start : g.start, shotEnd = sh ? sh.end : g.end;
    const drift = clamp((T - shotStart) / Math.max(4, shotEnd - shotStart + 1));
    let prevCam = null;
    if (ln.camMove && k > 0) { let j = k - 1; while (j > 0 && !s.lines[j].cam) j--; prevCam = camFor(String(s.lines[j].cam || s.cam || 'wide').split('|')[0], states); }
    let out = '';
    const pop = ln.camMove ? 0 : clamp((T - shotStart) / 0.22);
    const shake = ln.shake ? ln.shake * Math.exp(-(T - shotStart) * 1.4) : 0;
    const screenHeads = {};
    panels.forEach((pn, i) => {
      const spec = camSpecs[Math.min(i, camSpecs.length - 1)];
      const [bx0, by0, bx1, by1] = bbox(pn.pts), pw = bx1 - bx0, ph = by1 - by0;
      let cam = camFor(spec, states);
      if (i === 0 && prevCam) { const e = ease(clamp((T - shotStart) / (ln.camT || 1.6))); cam = { cx: lerp(prevCam.cx, cam.cx, e), cy: lerp(prevCam.cy, cam.cy, e), z: lerp(prevCam.z, cam.z, e) }; }
      // a panel narrower than the frame shows the same zoom but fits its target
      const fit = Math.max(pw / W, ph / H);
      let z = cam.z * (pn.inset ? 1.6 : 1) * (1 + (ln.push ?? s.push ?? 0.04) * drift) * (1 + 0.03 * (1 - easeOut(pop)));
      z = Math.max(z, fit);
      let cx = cam.cx + (ln.pan || 0) * drift, cy = cam.cy;
      const hw = pw / 2 / z, hh = ph / 2 / z;
      cx = clamp(cx, Math.min(hw, 640), Math.max(W - hw, 640)); cy = clamp(cy, Math.min(hh, 360), Math.max(H - hh, 360));
      const ox = (bx0 + bx1) / 2 + (shake ? Math.sin(T * 61 + i) * shake : 0), oy = (by0 + by1) / 2 + (shake ? Math.cos(T * 47) * shake : 0);
      const rot = ln.dutch || s.dutch || 0;
      const tr = `translate(${f1(ox)} ${f1(oy)}) rotate(${rot}) scale(${z.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
      const id = 'pc' + i;
      out += `<clipPath id="${id}"><path d="${ptsD(pn.pts)}"/></clipPath><g clip-path="url(#${id})"><rect x="${bx0}" y="${by0}" width="${pw}" height="${ph}" fill="#000"/><use href="#W" transform="${tr}"/>`;
      if (s.tint) out += `<rect x="${bx0}" y="${by0}" width="${pw}" height="${ph}" fill="${s.tint[0]}" opacity="${s.tint[1]}"/>`;
      if (ln.tint) { const [c, a] = String(ln.tint).split(','); out += `<rect x="${bx0}" y="${by0}" width="${pw}" height="${ph}" fill="${c}" opacity="${a}"/>`; }
      if (ln.speed || s.speed) out += `<g transform="translate(${f1(ox)} ${f1(oy)})">${FX.speedlines({ n: 70, op: 0.3, r0: Math.min(pw, ph) * 0.42, col: ln.speedCol || '#000', seed: k + 3 }, T)}</g>`;
      out += `</g><path d="${ptsD(pn.pts)}" fill="none" stroke="${INK}" stroke-width="${pn.inset ? 6 : 5}" stroke-linejoin="round"/>`;
      // where each visible head lands on screen (for balloon tails)
      for (const id2 in states) {
        const p = states[id2]; if (!CAST[p.fig || id2] || CAST[p.fig || id2].creature) continue;
        const [hx, hy] = headAt(p);
        const c0 = Math.cos(rot * Math.PI / 180), s0 = Math.sin(rot * Math.PI / 180);
        const dx = (hx - cx) * z, dy = (hy - cy) * z;
        const sx = ox + dx * c0 - dy * s0, sy = oy + dx * s0 + dy * c0;
        const inside = sx > bx0 + 10 && sx < bx1 - 10 && sy > by0 - 40 && sy < by1;
        if (inside && !screenHeads[id2]) screenHeads[id2] = { x: sx, y: sy, z: z * (p.s || 1), panel: [bx0, by0, bx1, by1], face: p.face || 1 };
      }
    });
    L.panels.innerHTML = out;
    // HUD: flashes, captions, balloons, sfx lettering
    let hud = '';
    if (ln.flash && sh) { const a = 1 - clamp((T - sh.start) / 0.6); if (a > 0) hud += `<rect width="${W}" height="${H}" fill="${ln.flash === true ? '#fffbe8' : ln.flash}" opacity="${f1(a * 100) / 100}"/>`; }
    if (sh && !sh.silent && T_(ln, 'text')) hud += lettering(ln, sh, T, screenHeads, panels);
    if (ln.bang && sh) hud += bang(ln, sh, T);
    if (T_(s, 'caption') && T - g.start < 5) hud += placeCard(T_(s, 'caption'), T - g.start);
    return hud;
  }

  // ---------- lettering ----------
  function lettering(ln, sh, T, heads, panels) {
    const a = clamp((T - sh.start) / 0.12) * clamp((sh.end + 0.3 - T) / 0.18);
    if (a <= 0) return '';
    const txt = T_(ln, 'text');
    const c = EP.cast[ln.who] || {};
    const ph = clamp((T - sh.start) / Math.max(0.5, sh.end - sh.start));
    if (c.narrator || ln.caption) return captionBox(txt, ph, a, ln.capPos || 'top');
    const head = heads[ln.who] || (c.twin || c.duet ? heads[(c.twin || c.duet)[0]] : null);
    const kind = ln.balloon || (ln.think ? 'thought' : ln.shout || ln.emo === 'rage' ? 'shout' : c.divine || ln.sky ? 'divine' : 'speech');
    return balloon(txt, ph, a, head, kind, c, ln);
  }
  function captionBox(txt, ph, a, pos) {
    const size = LANG === 'hi' ? 27 : 25, maxW = 560, lh = size * 1.34;
    const rows = wrap(txt, size, maxW, LET), page = pageAt(rows, 3, ph);
    const w = Math.max(...page.map(r => textW(r, size, LET))) + 40, h = page.length * lh + 22;
    const x = pos === 'right' ? W - G - 16 - w : G + 16, y = pos === 'bottom' ? H - G - 16 - h : G + 16;
    let s = `<g opacity="${f1(a)}"><rect x="${f1(x + 5)}" y="${f1(y + 5)}" width="${f1(w)}" height="${f1(h)}" fill="${INK}" opacity="0.5"/><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="#ffe46a" stroke="${INK}" stroke-width="3.4"/>`;
    page.forEach((r, i) => { s += text(r, x + 20, y + 14 + size * 0.95 + i * lh, size, { anchor: 'start', fill: '#1a1008' }); });
    return s + '</g>';
  }
  function balloon(txt, ph, a, head, kind, c, ln) {
    const size = LANG === 'hi' ? 27 : 25, maxW = kind === 'shout' ? 400 : 430, lh = size * 1.3;
    const rows = wrap(txt, size, maxW, LET), page = pageAt(rows, 3, ph);
    const tw = Math.max(...page.map(r => textW(r, size, LET))), th = page.length * lh;
    const bw = tw + (kind === 'thought' ? 80 : 56), bh = th + (kind === 'thought' ? 52 : 38);
    // place the balloon above and to the side of the speaker's head, inside the frame
    let cx, cy, tx = null, ty = null;
    if (head) {
      const side = head.x < 640 ? 1 : -1;
      const off = 60 + Math.min(220, head.z * 46);
      cx = head.x + side * (bw / 2 + 20) * 0.7;
      cy = head.y - off - bh / 2;
      if (cy - bh / 2 < G + 14) { cy = G + 14 + bh / 2; cx = head.x + side * (bw / 2 + Math.min(260, 60 + head.z * 40)); }
      tx = head.x + side * Math.min(30, 8 * head.z); ty = head.y - Math.min(60, 14 * head.z);
    } else { cx = ln.side === 'left' ? 360 : ln.side === 'right' ? 920 : 640; cy = G + 30 + bh / 2; }
    cx = clamp(cx, G + 16 + bw / 2, W - G - 16 - bw / 2); cy = clamp(cy, G + 14 + bh / 2, H - G - 20 - bh / 2);
    const fill = kind === 'divine' ? '#fff3c4' : '#ffffff';
    let s = `<g opacity="${f1(a)}">`;
    // tail
    if (tx != null && kind !== 'thought') {
      const dx = tx - cx, dy = ty - cy, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
      const ex = cx + ux * (bw / 2) * 0.8, ey = cy + uy * (bh / 2) * 0.8;
      const ttx = cx + dx * 0.82, tty = cy + dy * 0.82;
      const nx = -uy, ny = ux;
      if (d > 40) s += `<path d="M${f1(ex + nx * 16)},${f1(ey + ny * 16)}L${f1(ttx)},${f1(tty)}L${f1(ex - nx * 16)},${f1(ey - ny * 16)}Z" fill="${fill}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`;
    }
    if (kind === 'thought') {
      let d = ''; const n = 12;
      for (let i = 0; i < n; i++) { const t0 = i / n * Math.PI * 2, t1 = (i + 1) / n * Math.PI * 2, tm = (t0 + t1) / 2; d += `${i ? '' : `M${f1(cx + Math.cos(t0) * bw / 2)},${f1(cy + Math.sin(t0) * bh / 2)}`}Q${f1(cx + Math.cos(tm) * bw * 0.62)},${f1(cy + Math.sin(tm) * bh * 0.66)} ${f1(cx + Math.cos(t1) * bw / 2)},${f1(cy + Math.sin(t1) * bh / 2)}`; }
      s += `<path d="${d}Z" fill="${fill}" stroke="${INK}" stroke-width="3.2"/>`;
      if (tx != null) for (let i = 1; i <= 3; i++) { const k = i / 4; s += `<circle cx="${f1(lerp(cx, tx, 0.45 + k * 0.4))}" cy="${f1(lerp(cy + bh / 2, ty, k))}" r="${f1(12 - i * 3)}" fill="#fff" stroke="${INK}" stroke-width="2.6"/>`; }
    } else if (kind === 'shout') {
      let d = ''; const n = 22;
      for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2, r = i % 2 ? 1.0 : 1.2; d += `${i ? 'L' : 'M'}${f1(cx + Math.cos(t) * bw / 2 * r)},${f1(cy + Math.sin(t) * bh / 2 * r)}`; }
      s += `<path d="${d}Z" fill="#fff" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"/>`;
    } else if (kind === 'divine') {
      s += `<rect x="${f1(cx - bw / 2 - 8)}" y="${f1(cy - bh / 2 - 8)}" width="${f1(bw + 16)}" height="${f1(bh + 16)}" rx="10" fill="url(#cbGlow)" opacity="0.9"/>`;
      s += `<rect x="${f1(cx - bw / 2)}" y="${f1(cy - bh / 2)}" width="${f1(bw)}" height="${f1(bh)}" rx="8" fill="${fill}" stroke="${GOLD_D}" stroke-width="4"/><rect x="${f1(cx - bw / 2 + 6)}" y="${f1(cy - bh / 2 + 6)}" width="${f1(bw - 12)}" height="${f1(bh - 12)}" rx="5" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
    } else {
      s += `<rect x="${f1(cx - bw / 2)}" y="${f1(cy - bh / 2)}" width="${f1(bw)}" height="${f1(bh)}" rx="${f1(Math.min(bh / 2, 34))}" fill="${fill}" stroke="${INK}" stroke-width="3.4"/>`;
      // cover the tail's root so the balloon reads as one shape
      if (tx != null) { const dx = tx - cx, dy = ty - cy, d = Math.hypot(dx, dy) || 1; s += `<circle cx="${f1(cx + dx / d * bw * 0.36)}" cy="${f1(cy + dy / d * bh * 0.32)}" r="15" fill="${fill}"/>`; }
    }
    const y0 = cy - th / 2 + size * 0.95;
    page.forEach((r, i) => { s += text(r, cx, y0 + i * lh, size, { fill: '#120c08', weight: kind === 'shout' ? 700 : null }); });
    // a small name tag for speakers we cannot see
    if (!head && c.label) { const nm = (LANG === 'hi' ? c.label_hi || c.label : c.label); s += text(nm, cx - bw / 2 + 8, cy - bh / 2 - 8, 19, { anchor: 'start', fill: '#ffe46a', stroke: INK, sw: 5, font: TITLEF }); }
    return s + '</g>';
  }
  function bang(ln, sh, T) {
    const age = T - sh.start - (ln.bangAt || 0); if (age < 0 || age > (ln.bangDur || 1.8)) return '';
    const raw = String(ln.bang).split('|'), word = LANG === 'hi' && raw[1] ? raw[1] : raw[0];
    const [bx, by] = String(ln.bangPos || '980,170').split(',').map(Number);
    const sc = back(clamp(age / 0.28)) * (1 + 0.02 * Math.sin(age * 30)), op = clamp(((ln.bangDur || 1.8) - age) / 0.3);
    const size = LANG === 'hi' ? 92 : 110;
    let s = `<g transform="translate(${bx} ${by}) rotate(${ln.bangRot ?? -8}) scale(${f1(sc * 100) / 100})" opacity="${f1(op)}">`;
    s += FX.burst({ r: Math.max(150, textW(word, size, SFXF) * 0.62), n: 16, col: ln.bangBg || '#ffe23a' }, T, 1);
    s += text(word, 6, size * 0.36 + 6, size, { font: SFXF, fill: INK });
    s += text(word, 0, size * 0.36, size, { font: SFXF, fill: ln.bangCol || '#e8281e', stroke: INK, sw: 9, ls: 2 });
    return s + '</g>';
  }
  function placeCard(txt, age) {
    const a = clamp(age / 0.4) * clamp((5 - age) / 0.5);
    const size = 22, w = textW(txt, size, TITLEF) + 40;
    return `<g opacity="${f1(a)}"><rect x="${W - G - 20 - w}" y="${H - G - 58}" width="${f1(w)}" height="38" fill="${INK}"/>${text(txt, W - G - 20 - w / 2, H - G - 32, size, { font: TITLEF, fill: '#ffe46a', ls: 1 })}</g>`;
  }

  // ---------- cards ----------
  function masthead(x, y, size) {
    const t = LANG === 'hi' ? 'शिव पुराण' : 'SHIVA PURANA';
    let s = '';
    for (let i = 8; i > 0; i--) s += text(t, x + i * 1.2, y + i * 1.5, size, { font: TITLEF, fill: '#5a0a0a', ls: LANG === 'hi' ? 0 : 4 });
    s += text(t, x, y, size, { font: TITLEF, fill: '#ffd22e', stroke: INK, sw: 10, ls: LANG === 'hi' ? 0 : 4 });
    return s;
  }
  function coverFigs(list, T, y0 = 700, s0 = 1) {
    let out = ''; const n = list.length;
    list.forEach((id, i) => {
      const o = CAST[id]; if (!o) return;
      const x = n === 1 ? 640 : 300 + i * (680 / (n - 1)), sc = (n === 1 ? 1.25 : i === Math.floor(n / 2) ? 1.12 : 0.92) * s0;
      out += `<g transform="translate(${x} ${y0 + (i === Math.floor(n / 2) ? 20 : 0)}) scale(${(i < n / 2 - 0.5 ? 1 : -1) * sc} ${sc})">${o.creature ? creature(o.creature, { t: T }, {}) : figure(o, { t: T, pose: o.pose, emo: 'calm' })}</g>`;
    });
    return out;
  }
  function card(g, T) {
    const s = g.seg, age = T - g.start, dur = g.end - g.start;
    const fadeIn = clamp(age / 0.6), fadeOut = clamp((dur - age) / 0.6);
    const bg = s.bg || ({ open: '#1a0a2a', title: '#c8281e', chapter: '#1a3a7a', end: '#1a0a2a', next: '#2a1a4a' }[s.style] || '#c8281e');
    showRaster('card', { col: bg });
    L.live2.innerHTML = '';
    let world = '', hud = '';
    if (s.style === 'open') {
      world += `<g transform="translate(640 330)">${FX.rays({ n: 22, r: 900, col: '#ffb02e', op: 0.35, speed: 0.06 }, T)}</g>`;
      world += `<g transform="translate(640 360)">${FX.sparkle({ n: 50, w: 1200, h: 700, seed: 3 }, T)}</g>`;
      const up = easeOut(clamp(age / 2.4));
      world += `<g transform="translate(0 ${f1((1 - up) * 160)})">${coverFigs(s.figs ? String(s.figs).split(',') : ['shiva'], T, 760, 1.15)}</g>`;
      const ta = clamp((age - 1.6) / 0.8) * fadeOut;
      hud += `<g opacity="${f1(ta)}" transform="translate(640 ${LANG === 'hi' ? 150 : 140}) scale(${f1(back(clamp((age - 1.6) / 0.5)) * 100) / 100}) translate(-640 -140)">${masthead(640, 150, LANG === 'hi' ? 120 : 130)}</g>`;
      hud += `<g opacity="${f1(clamp((age - 2.6) / 0.8) * fadeOut)}"><rect x="420" y="196" width="440" height="44" fill="${INK}"/>${text(T_(s, 'sub') || (LANG === 'hi' ? 'महादेव की कथाएँ' : 'TALES OF MAHADEVA'), 640, 228, 30, { font: TITLEF, fill: '#ffe46a', ls: 3 })}</g>`;
      hud += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1(1 - fadeIn)}"/>`;
    } else if (s.style === 'title') {
      // an issue cover
      world += `<g transform="translate(640 470)">${FX.rays({ n: 26, r: 1000, col: '#ffd22e', op: 0.5, speed: 0.03 }, T)}</g><g transform="translate(640 470)">${FX.glow({ r: 380, warm: true, op: 0.8 }, T)}</g>`;
      if (s.figs) world += coverFigs(String(s.figs).split(','), T, 790, 1.0);
      const a = clamp((age - 0.3) / 0.6) * fadeOut;
      hud += `<g opacity="${f1(a)}">`;
      hud += `<rect x="${G}" y="${G}" width="${W - 2 * G}" height="170" fill="${INK}"/>` + masthead(640, 112, LANG === 'hi' ? 92 : 100);
      hud += text(T_(s, 'kicker') || '', 640, 160, 26, { font: TITLEF, fill: '#ffe46a', ls: 2 });
      // issue badge
      hud += `<g transform="translate(110 260) rotate(-10)"><circle r="62" fill="#ffe46a" stroke="${INK}" stroke-width="5"/>${text(LANG === 'hi' ? 'अंक' : 'ISSUE', 0, -14, 22, { font: TITLEF })}${text('#' + (EP.meta.num || ''), 0, 34, 54, { font: "Bangers, Impact, sans-serif" })}</g>`;
      const tt = T_(s, 'title') || '', ts = Math.min(LANG === 'hi' ? 100 : 112, 1100 / Math.max(1, textW(tt, 100, TITLEF)) * 100);
      const ty = 640;
      hud += `<g transform="translate(640 ${ty}) rotate(-3) scale(${f1(back(clamp((age - 0.5) / 0.45)) * 100) / 100})">${text(tt, 6, 8, ts, { font: TITLEF, fill: INK })}${text(tt, 0, 0, ts, { font: TITLEF, fill: '#ffffff', stroke: INK, sw: 10, ls: LANG === 'hi' ? 0 : 2 })}</g>`;
      if (T_(s, 'sub')) hud += `<g opacity="${f1(clamp((age - 1.2) / 0.6))}"><rect x="${f1(640 - textW(T_(s, 'sub'), 26, LET) / 2 - 22)}" y="${ty + 22}" width="${f1(textW(T_(s, 'sub'), 26, LET) + 44)}" height="42" fill="#ffe46a" stroke="${INK}" stroke-width="3"/>${text(T_(s, 'sub'), 640, ty + 52, 26)}</g>`;
      hud += '</g>';
      hud += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1(1 - fadeIn)}"/>`;
    } else if (s.style === 'chapter') {
      world += `<g transform="translate(640 360)">${FX.speedlines({ n: 80, op: 0.3, r0: 200, col: '#000', seed: 5 }, T)}</g>`;
      const un = easeOut(clamp(age / 0.5));
      hud += `<g opacity="${f1(fadeOut)}"><g transform="translate(640 360) rotate(-4) scale(${f1(un * 100) / 100} 1)"><rect x="-560" y="-96" width="1120" height="192" fill="#ffe46a" stroke="${INK}" stroke-width="6"/><rect x="-546" y="-82" width="1092" height="164" fill="none" stroke="${INK}" stroke-width="2"/></g>`;
      const a = clamp((age - 0.4) / 0.4);
      hud += `<g opacity="${f1(a)}" transform="translate(640 360) rotate(-4) translate(-640 -360)">${text(T_(s, 'kicker') || '', 640, 318, 30, { font: TITLEF, fill: '#c8281e', ls: 2 })}${text(T_(s, 'title') || '', 640, 400, LANG === 'hi' ? 70 : 78, { font: TITLEF, fill: INK, ls: LANG === 'hi' ? 0 : 2 })}</g></g>`;
    } else {   // end / next / text
      world += `<g transform="translate(640 360)">${FX.rays({ n: 18, r: 900, col: '#ffffff', op: 0.08, speed: 0.04 }, T)}</g>`;
      const a = fadeIn * fadeOut;
      hud += `<g opacity="${f1(a)}">`;
      if (s.style === 'next') {
        hud += `<g transform="translate(640 150) rotate(-3)"><rect x="-300" y="-46" width="600" height="80" fill="#ffe46a" stroke="${INK}" stroke-width="5"/>${text(LANG === 'hi' ? 'अगले अंक में…' : 'NEXT ISSUE…', 0, 16, 50, { font: TITLEF, fill: '#c8281e', ls: 2 })}</g>`;
        if (T_(s, 'title')) hud += text(T_(s, 'title'), 640, 290, LANG === 'hi' ? 76 : 84, { font: TITLEF, fill: '#ffffff', stroke: INK, sw: 9, ls: 2 });
        if (T_(s, 'sub')) hud += text(T_(s, 'sub'), 640, 352, 28, { fill: '#ffe9b0', font: LET });
      } else {
        if (T_(s, 'title')) hud += text(T_(s, 'title'), 640, 180, 72, { font: TITLEF, fill: '#ffd22e', stroke: INK, sw: 9, ls: 2 });
        if (T_(s, 'sub')) hud += text(T_(s, 'sub'), 640, 240, 30, { fill: '#ffe9b0', font: LET });
        const cr = (LANG === 'hi' && s.credits_hi) ? s.credits_hi : (s.credits || []);
        cr.forEach((c, i) => { hud += text(c, 640, 320 + i * 44, 27, { fill: '#f6eedc', op: clamp((age - 0.6 - i * 0.3) / 0.6), font: LET }); });
      }
      hud += '</g>';
    }
    L.live.innerHTML = world;
    // the card fills a single full panel
    const pn = layout('full', 1)[0];
    L.panels.innerHTML = `<clipPath id="pc0"><path d="${ptsD(pn.pts)}"/></clipPath><g clip-path="url(#pc0)"><use href="#W"/></g><path d="${ptsD(pn.pts)}" fill="none" stroke="${INK}" stroke-width="5"/>`;
    const k = lineAt(g, T);
    if (k >= 0 && s.lines && s.lines[k] && T_(s.lines[k], 'text') && g.lines[k] && !g.lines[k].silent) hud += captionBox(T_(s.lines[k], 'text'), clamp((T - g.lines[k].start) / Math.max(0.5, g.lines[k].end - g.lines[k].start)), clamp((T - g.lines[k].start) / 0.12) * clamp((g.lines[k].end + 0.3 - T) / 0.18), 'bottom');
    return hud;
  }

  // ---------- transitions ----------
  function transition(T) {
    let s = '';
    for (let i = 1; i < SEGS.length; i++) {
      const b = SEGS[i].start, kind = SEGS[i].seg.trans || (SEGS[i].seg.type === 'card' || SEGS[i - 1].seg.type === 'card' ? 'fade' : 'wipe');
      const half = kind === 'cut' ? 0 : kind === 'flash' ? 0.3 : 0.42;
      if (!half || Math.abs(T - b) > half) continue;
      const ph = 1 - Math.abs(T - b) / half;
      if (kind === 'fade') s += `<rect width="${W}" height="${H}" fill="#08040c" opacity="${f1(ease(ph) * 100) / 100}"/>`;
      else if (kind === 'flash') s += `<rect width="${W}" height="${H}" fill="#fffbe8" opacity="${f1(ease(ph) * 100) / 100}"/>`;
      else if (kind === 'ink') { const r = (1 - ease(ph)) * 900; s += `<path d="M0,0H${W}V${H}H0Z M${640 - r},360a${f1(r)},${f1(r)} 0 1,0 ${f1(2 * r)},0a${f1(r)},${f1(r)} 0 1,0 ${f1(-2 * r)},0Z" fill="${INK}" fill-rule="evenodd"/>`; }
      else {   // wipe: a slanted black page edge sweeps across
        const x = T < b ? lerp(-200, 640, ease(ph)) : lerp(640, 1480, 1 - ease(ph));
        const w2 = 900 * ease(ph);
        s += `<path d="M${f1(x - w2)},0L${f1(x + w2 + 120)},0L${f1(x + w2)},${H}L${f1(x - w2 - 120)},${H}Z" fill="${INK}"/>`;
      }
    }
    return s;
  }

  // ---------- main ----------
  function renderAt(T) {
    let g = SEGS[SEGS.length - 1];
    for (const x of SEGS) if (T >= x.start && T < x.end) { g = x; break; }
    let hud = g.seg.type === 'card' ? card(g, T) : scene(g, T);
    hud += transition(T);
    L.hud.innerHTML = hud;
  }
  window.Toon = { load, renderAt, get duration() { return TL.duration; } };
})();
