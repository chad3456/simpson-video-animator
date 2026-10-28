/* Mahagatha renderer: painted Pichwai sets, miniature-style figures with lip-sync, keyframed staging, cameras,
   transitions, title cards and Hindi captions.
   Contract shared with the other shows: await Toon.load(ep, tl, svgEl); Toon.renderAt(seconds); Toon.duration.
   Static painted layers are rasterised once at load; figures and effects are drawn live every frame. */
(function () {
  const W = 1280, H = 720;
  const DEV = "Tiro, 'Noto Sans Devanagari', serif", DISPLAY = "Yatra, Tiro, serif";
  const { figure, creature, CAST, f1, shade, GOLD, GOLD_HI, GOLD_LO, RUBY, PEARL, LINE, lotusBud } = window.PWFig;
  const { SETS, border, grain, swirls, rng } = window.PWSets;
  const FX = window.PWFx;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const SCALE = 2;
  let EP, TL, SVG, SEGS = [], RASTER = {}, L = {}, OVERLAY = null, uid = 0;

  // ---------- text helpers ----------
  let mctx;
  function textW(s, size, font) { if (!mctx) mctx = document.createElement('canvas').getContext('2d'); mctx.font = `${size}px ${font}`; return mctx.measureText(s).width; }
  function wrap(s, size, maxW, font) {
    const words = String(s).split(/\s+/); const out = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (textW(t, size, font) > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
    if (cur) out.push(cur); return out;
  }
  function text(s, x, y, size, o = {}) {
    return `<text x="${f1(x)}" y="${f1(y)}" font-family="${o.font || DEV}" font-size="${size}" fill="${o.fill || '#fbf3df'}" text-anchor="${o.anchor || 'middle'}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 5}" paint-order="stroke" stroke-linejoin="round"` : ''}${o.op != null ? ` opacity="${f1(o.op * 100) / 100}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${esc(s)}</text>`;
  }

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
    const url = await rasterize(layers.back);
    RASTER[k] = { back: imgEl(url, L.bgs) };
    if (layers.front) RASTER[k].front = imgEl(await rasterize(layers.front), L.fronts);
  }

  const STATIC_DEFS = `<defs>
    <radialGradient id="pwGlow"><stop offset="0" stop-color="#fff3b0" stop-opacity="1"/><stop offset="0.4" stop-color="#ffe680" stop-opacity="0.5"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></radialGradient>
    <radialGradient id="pwFireGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.9"/><stop offset="0.5" stop-color="#f26a1e" stop-opacity="0.35"/><stop offset="1" stop-color="#f26a1e" stop-opacity="0"/></radialGradient>
    <linearGradient id="pwPillarGlow" x1="0" x2="1"><stop offset="0" stop-color="#f6b52a" stop-opacity="0"/><stop offset="0.5" stop-color="#ffe9a0" stop-opacity="0.8"/><stop offset="1" stop-color="#f6b52a" stop-opacity="0"/></linearGradient>
    <radialGradient id="pwAura"><stop offset="0" stop-color="#fff6cf" stop-opacity="0.85"/><stop offset="1" stop-color="#fff6cf" stop-opacity="0"/></radialGradient>
    <linearGradient id="pwCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120a06" stop-opacity="0"/><stop offset="0.45" stop-color="#120a06" stop-opacity="0.62"/><stop offset="1" stop-color="#120a06" stop-opacity="0.78"/></linearGradient>
  </defs>`;

  // ---------- staging: element props over time ----------
  const NUM = v => typeof v === 'number';
  function keyList(el) {
    if (el._keys) return el._keys;
    el._keys = Object.entries(el.keys || {}).flatMap(([i, k]) => (Array.isArray(k) ? k : [k]).map(kk => [Number(i), kk])).sort((a, b) => a[0] - b[0] || (a[1].d || 0) - (b[1].d || 0));
    return el._keys;
  }
  const SKIP = new Set(['t', 'd', 'ease']);
  function propsAt(el, g, T) {
    const p = Object.assign({}, el);
    delete p.keys; delete p._keys;
    for (const [i, k] of keyList(el)) {
      const ln = g.lines[i]; if (!ln) continue;
      const start = ln.start + (k.d || 0); if (T < start) break;
      const dur = k.t ?? 0.8, ph = dur > 0 ? clamp((T - start) / dur) : 1, e = (k.ease === 'linear' ? ph : ease(ph));
      for (const [prop, v] of Object.entries(k)) {
        if (SKIP.has(prop)) continue;
        const prev = p[prop];
        if (NUM(v) && NUM(prev ?? (prop === 'o' ? 1 : 0))) p[prop] = lerp(prev ?? (prop === 'o' ? 1 : 0), v, e);
        else if (Array.isArray(v) && Array.isArray(prev)) p[prop] = v.map((x, j) => NUM(x) ? lerp(prev[j], x, e) : x);
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
    if (T < tin) return { vis: 0, age: 0, tin };
    let v = el.anim === 'none' || (!el.in && !el.d && !el.anim) ? 1 : clamp((T - tin) / (el.inDur || 0.7));
    if (el.out != null) {
      const oLn = g.lines[el.out]; const tout = (oLn ? oLn.start : g.end) + (el.od || 0);
      if (T > tout) v = Math.min(v, 1 - clamp((T - tout) / (el.outDur || 0.6)));
    }
    return { vis: v, age: T - tin, tin };
  }

  // ---------- figures ----------
  function figH(p) { return (p.seat === 'lotus' ? 270 : p.seat === 'kneel' ? 330 : 430) * (p.s || 1); }
  function headAt(p) { const h = figH(p); return [p.x + (p.face || 1) * 8 * (p.s || 1), p.y - h * 0.9]; }
  function blinkAt(T, seed) {
    const per = 3.2 + (seed % 7) * 0.35, ph = (T + seed * 0.77) % per;
    return ph < 0.13 ? Math.sin(ph / 0.13 * Math.PI) : 0;
  }
  function envAt(line, T) {
    if (!line || !line.env || !line.env.length) return 0;
    const i = Math.floor((T - line.start) * (TL.envFps || 30));
    return i >= 0 && i < line.env.length ? line.env[i] : 0;
  }
  function drawChar(el, p, T, age, vis, speaking, line) {
    const base = CAST[p.fig || el.id] || CAST[el.id];
    if (!base) return '';
    const o = Object.assign({}, base, p.look || {});
    if (p.halo === false) o.halo = false;
    if (p.heads) o.heads = Math.round(p.heads);
    if (p.arms) o.arms = Math.round(p.arms);
    if (p.upper) o.upper = p.upper;
    if (p.halo === true && !o.halo) o.halo = true;
    const st = {
      t: T, pose: p.pose || 'rest', pose2: p.pose2, poseMix: p.poseMix, emo: p.emo, look: p.gaze, seat: p.seat, fly: p.fly || 0, walk: p.walk,
      lean: (p.lean || 0) + (p.fly ? Math.sin(T * 1.1) * 2 : 0), open: speaking ? envAt(line, T) : 0, blink: p.emo === 'meditate' ? 0 : blinkAt(T, (o.seed || 1) * 3.1),
      item: p.item, itemFar: p.itemFar, prop: p.prop, heads10: p.heads10 != null ? Math.round(p.heads10) : undefined, nod: speaking ? Math.sin(T * 5) * envAt(line, T) * 2 : 0
    };
    const s = p.s || 1, face = p.face || 1;
    const bob = p.fly ? Math.sin(T * 1.6 + (o.seed || 0)) * 8 : 0;
    let anim = '', op = vis * (p.o ?? 1);
    let sc = s;
    if (vis < 1) {
      if (p.anim === 'grow' || p.anim === 'materialize') sc = s * (0.2 + 0.8 * easeOut(vis));
      if (p.anim === 'rise') anim = `translate(0 ${f1((1 - easeOut(vis)) * 80)})`;
      if (p.anim === 'drop') anim = `translate(0 ${f1(-(1 - easeOut(vis)) * 300)})`;
      if (p.anim === 'left') anim = `translate(${f1(-(1 - easeOut(vis)) * 500)} 0)`;
      if (p.anim === 'right') anim = `translate(${f1((1 - easeOut(vis)) * 500)} 0)`;
    }
    let out = '';
    const auraR = (p.aura || 0);
    if (auraR > 0 || (p.anim === 'materialize' && vis < 1)) {
      const r = figH(p) * 0.75 * Math.max(auraR, p.anim === 'materialize' ? (1 - vis) * 1.6 : 0);
      out += `<circle cx="${f1(p.x)}" cy="${f1(p.y - figH(p) * 0.5)}" r="${f1(r)}" fill="url(#pwAura)" opacity="${f1(Math.min(1, op + 0.2))}"/>`;
    }
    if (p.shadow !== false && !p.fly && !p.noShadow) out += `<ellipse cx="${f1(p.x + 10 * s)}" cy="${f1(p.y + 2)}" rx="${f1(70 * s)}" ry="${f1(10 * s)}" fill="#1a0c04" opacity="${f1(0.18 * op)}"/>`;
    let body;
    if (o.split) {   // two cast looks joined back to back down the body's axis (Ardhanarishvara)
      const a = Object.assign({}, CAST[o.split[0]], { halo: o.halo ?? true }), b = Object.assign({}, CAST[o.split[1]], { halo: false });
      const cut = o.cut || 0;
      body = `<clipPath id="pwHalfB" clipPathUnits="userSpaceOnUse"><rect x="${-400}" y="-900" width="${400 + cut}" height="1200"/></clipPath>` +
        `<clipPath id="pwHalfA" clipPathUnits="userSpaceOnUse"><rect x="${cut}" y="-900" width="400" height="1200"/></clipPath>` +
        `<g clip-path="url(#pwHalfB)"><g transform="scale(-1 1)">${figure(b, Object.assign({}, st, { blink: st.blink, pose: p.pose2b || st.pose }))}</g></g>` +
        `<g clip-path="url(#pwHalfA)">${figure(a, st)}</g>` + `<line x1="${cut}" y1="-640" x2="${cut}" y2="0" stroke="#d9a520" stroke-width="2" opacity="0.6"/>`;
    } else body = figure(o, st);
    out += `<g transform="translate(${f1(p.x)} ${f1(p.y + bob)}) ${anim} rotate(${f1(p.rot || 0)}) scale(${f1(sc * face * 1000) / 1000} ${f1(sc * 1000) / 1000})" opacity="${f1(op * 1000) / 1000}">${body}</g>`;
    return out;
  }
  function drawCreature(el, p, T, age, vis) {
    const s = p.s || 1, face = p.face || 1, op = vis * (p.o ?? 1);
    const bob = p.fly ? Math.sin(T * 2) * 10 : 0;
    let sc = s; if (vis < 1 && (p.anim === 'grow' || p.anim === 'materialize')) sc = s * (0.2 + 0.8 * easeOut(vis));
    return `<g transform="translate(${f1(p.x)} ${f1(p.y + bob)}) rotate(${f1(p.rot || 0)}) scale(${f1(sc * face * 1000) / 1000} ${f1(sc * 1000) / 1000})" opacity="${f1(op * 1000) / 1000}">${creature(p.kind, { t: T, fly: p.fly }, p)}</g>`;
  }
  function drawFx(el, p, T, age, vis) {
    const f = FX[p.kind]; if (!f) return '';
    p._uid = el._uid || (el._uid = ++uid);
    const s = p.s || 1, op = vis * (p.o ?? 1);
    let sc = s; if (vis < 1 && (p.anim === 'grow' || p.anim === 'pop')) sc = s * easeOut(vis);
    return `<g transform="translate(${f1(p.x || 0)} ${f1(p.y || 0)}) rotate(${f1(p.rot || 0)}) scale(${f1(sc * 1000) / 1000})" opacity="${f1(op * 1000) / 1000}">${f(p, T, age, el._uid)}</g>`;
  }

  // ---------- camera ----------
  function camFor(spec, g, T, states) {
    if (!spec || spec === 'wide') return { cx: 640, cy: 360, z: 1 };
    if (typeof spec === 'object') return { cx: spec[0], cy: spec[1], z: spec[2] || 1 };
    const [kind, arg] = spec.split(':');
    if (kind === 'at') { const [x, y, z] = arg.split(',').map(Number); return { cx: x, cy: y, z: z || 1 }; }
    const ids = (arg || '').split(',').filter(Boolean);
    const P = ids.map(id => states[id]).filter(Boolean);
    if (!P.length) return { cx: 640, cy: 360, z: 1 };
    if (kind === 'two' || P.length > 1) {
      const xs = P.map(p => p.x), tops = P.map(p => p.y - figH(p)), bots = P.map(p => p.y);
      const x0 = Math.min(...xs) - 160, x1 = Math.max(...xs) + 160, y0 = Math.min(...tops) - 30, y1 = Math.max(...bots) + 20;
      const z = clamp(Math.min(W / (x1 - x0), H / (y1 - y0)), 1, 2.6);
      return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, z };
    }
    const p = P[0], h = figH(p), [hx, hy] = headAt(p), dir = p.face || 1;
    if (kind === 'full') { const z = clamp(H / (h * 1.25), 1, 3); return { cx: p.x + dir * 30 * (p.s || 1), cy: p.y - h * 0.5, z }; }
    if (kind === 'mid') { const z = clamp(H / (h * 0.75), 1, 4); return { cx: p.x + dir * 40 * (p.s || 1), cy: p.y - h * 0.68, z }; }
    if (kind === 'close') { const z = clamp(H / (h * 0.42), 1, 6); return { cx: hx + dir * 50 * (p.s || 1), cy: hy + h * 0.06, z }; }
    if (kind === 'ecu') { const z = clamp(H / (h * 0.2), 1, 9); return { cx: hx + dir * 24 * (p.s || 1), cy: hy, z }; }
    return { cx: 640, cy: 360, z: 1 };
  }
  function clampCam(c) {
    const hw = W / 2 / c.z, hh = H / 2 / c.z;
    return { cx: clamp(c.cx, hw, W - hw), cy: clamp(c.cy, hh, H - hh), z: c.z };
  }

  // ---------- load ----------
  async function load(ep, tl, svg) {
    EP = ep; TL = tl; SVG = svg;
    SVG.setAttribute('viewBox', `0 0 ${W} ${H}`);
    SVG.innerHTML = STATIC_DEFS + `<rect width="${W}" height="${H}" fill="#000"/><g id="world"><g id="bgs"></g><g id="live"></g><g id="fronts"></g><g id="live2"></g></g><g id="screen"></g><g id="over"></g><g id="hud"></g>`;
    for (const k of ['world', 'bgs', 'live', 'fronts', 'live2', 'screen', 'over', 'hud']) L[k] = SVG.querySelector('#' + k);
    const byId = {}; ep.sequence.forEach(s => byId[s.id] = s);
    SEGS = [];
    for (const sh of tl.shots) {
      let g = SEGS[SEGS.length - 1];
      if (!g || g.seg.id !== sh.seg) { g = { seg: byId[sh.seg], start: sh.start, lines: [] }; SEGS.push(g); }
      if (sh.type === 'line') g.lines[sh.idx] = sh; else g.card = sh;
    }
    SEGS.forEach((g, i) => { g.end = i + 1 < SEGS.length ? SEGS[i + 1].start : tl.duration; if (i === 0) g.start = 0; g.segStart = g.start; });
    // scenes start where the previous segment ended
    for (let i = 1; i < SEGS.length; i++) SEGS[i].start = SEGS[i - 1].end = Math.min(SEGS[i].start, SEGS[i].lines.find(Boolean)?.start ?? SEGS[i].start);
    for (const g of SEGS) {
      const s = g.seg;
      if (s.type === 'scene') await ensure(s.set, s.ctx || {});
      else if (s.style === 'open') { await ensure('temple', {}); await ensure('ocean', {}); }
      else await ensure('card', { col: s.bg || (s.style === 'chapter' ? '#7e1f4c' : '#1c2a5e') });
      if (s.type === 'scene') (s.els || []).forEach(el => { if (!el.kind) el.kind = CAST[el.fig || el.id] ? (CAST[el.fig || el.id].creature ? 'creature' : 'char') : 'fx'; });
    }
    const ov = await rasterize(grain(5) + border(), 1);
    OVERLAY = imgEl(ov, L.over); OVERLAY.style.display = '';
  }

  // ---------- scenes ----------
  let lastSeg = null;
  function showRaster(set, c, which = 'back') {
    for (const k in RASTER) { const r = RASTER[k]; if (r.back) r.back.style.display = 'none'; if (r.front) r.front.style.display = 'none'; }
    const r = RASTER[ctxKey(set, c)]; if (r) { r.back.style.display = ''; if (r.front) r.front.style.display = ''; }
  }
  function lineAt(g, T) {
    let k = -1;
    for (let i = 0; i < g.lines.length; i++) if (g.lines[i] && g.lines[i].start <= T) k = i;
    return k;
  }
  function scene(g, T) {
    const s = g.seg;
    showRaster(s.set, s.ctx || {});
    const k = Math.max(0, lineAt(g, T));
    const ln = s.lines[k] || {}, sh = g.lines[k];
    // element states
    const states = {}, draws = [];
    (s.els || []).forEach((el, order) => {
      const v = visibility(el, g, T); if (v.vis <= 0) return;
      const p = propsAt(el, g, T); p.anim = el.anim;
      states[el.id] = p;
      draws.push([el, p, v, order]);
    });
    // camera
    let cam = camFor(ln.cam || s.cam, g, T, states);
    if (ln.camMove && k > 0) {
      let j = k - 1; while (j > 0 && !s.lines[j].cam) j--;
      const prev = camFor(s.lines[j].cam || s.cam, g, T, states);
      const ph = ease(clamp((T - sh.start) / (ln.camT || 1.6)));
      cam = { cx: lerp(prev.cx, cam.cx, ph), cy: lerp(prev.cy, cam.cy, ph), z: lerp(prev.z, cam.z, ph) };
    }
    const shotStart = sh ? sh.start : g.start, shotEnd = sh ? sh.end : g.end;
    const drift = clamp((T - shotStart) / Math.max(4, shotEnd - shotStart + 1));
    cam.z *= 1 + (ln.push ?? s.push ?? 0.035) * drift;
    if (ln.pan) cam.cx += ln.pan * drift;
    cam = clampCam(cam);
    let shx = 0, shy = 0;
    const shake = ln.shake ? ln.shake * Math.exp(-(T - shotStart) * 1.2) : 0;
    if (shake) { shx = Math.sin(T * 61) * shake; shy = Math.cos(T * 47) * shake; }
    L.world.setAttribute('transform', `translate(${f1(640 + shx)} ${f1(360 + shy)}) scale(${(cam.z).toFixed(4)}) translate(${f1(-cam.cx)} ${f1(-cam.cy)})`);
    // draw
    draws.sort((a, b) => (a[1].z || 0) - (b[1].z || 0) || a[3] - b[3]);
    let live = '', top = '', screen = '';
    for (const [el, p, v] of draws) {
      const speaking = ln.who && (ln.who === el.id || ln.who === el.group || (EP.cast[ln.who] && (EP.cast[ln.who].twin || EP.cast[ln.who].duet || []).includes(el.id))) && sh && !sh.silent;
      let svg = '';
      if (el.kind === 'char') svg = drawChar(el, p, T, v.age, v.vis, speaking, sh);
      else if (el.kind === 'creature') svg = drawCreature(el, Object.assign({}, p, { kind: el.creature || (CAST[el.fig || el.id] || {}).creature }), T, v.age, v.vis);
      else svg = drawFx(el, p, T, v.age, v.vis);
      if (p.screen) screen += svg; else if ((p.z || 0) >= 50) top += svg; else live += svg;
    }
    L.live.innerHTML = live; L.live2.innerHTML = top; L.screen.innerHTML = screen;
    // grade / tint
    let hud = '';
    const tint = s.tint; if (tint) hud += `<rect width="${W}" height="${H}" fill="${tint[0]}" opacity="${tint[1]}"/>`;
    if (ln.flash && sh) { const a = 1 - clamp((T - sh.start) / 0.6); if (a > 0) hud += `<rect width="${W}" height="${H}" fill="${ln.flash === true ? '#fffbe8' : ln.flash}" opacity="${f1(a * 100) / 100}"/>`; }
    // captions
    if (ln.text && sh && !sh.silent && EP.meta.captions !== false) hud += caption(ln, sh, T);
    if (s.caption && T - g.start < 5) hud += placeCard(s.caption, T - g.start);
    return hud;
  }
  function caption(ln, sh, T) {
    const a = clamp((T - sh.start) / 0.15) * clamp((sh.end + 0.25 - T) / 0.2);
    if (a <= 0) return '';
    const who = ln.who && EP.cast[ln.who] && !EP.cast[ln.who].narrator ? (EP.cast[ln.who].label || (CAST[EP.cast[ln.who].fig || ln.who] || {}).name || '') : '';
    const size = 29, lines = wrap(ln.text, size, 1040, DEV);
    // long lines page through: show 2 rows at a time, timed by length
    const pages = []; for (let i = 0; i < lines.length; i += 2) pages.push(lines.slice(i, i + 2));
    const total = lines.reduce((n, l) => n + l.length, 0) || 1; let acc = 0, page = pages[0];
    const ph = clamp((T - sh.start) / Math.max(0.5, sh.end - sh.start));
    for (const pg of pages) { const n = pg.reduce((m, l) => m + l.length, 0); if (ph * total >= acc) page = pg; acc += n; }
    const yb = H - 40, lh = size * 1.32;
    let s = `<rect x="0" y="${H - 150}" width="${W}" height="150" fill="url(#pwCap)" opacity="${f1(a)}"/>`;
    page.forEach((l, i) => { s += text(l, 640, yb - (page.length - 1 - i) * lh, size, { fill: '#fbf3df', stroke: '#1a0c06', sw: 5, op: a }); });
    if (who) s += text(who, 640, yb - page.length * lh - 4, 22, { font: DEV, fill: GOLD_HI, stroke: '#1a0c06', sw: 4, op: a });
    return s;
  }
  function placeCard(txt, age) {
    const a = clamp(age / 0.6) * clamp((5 - age) / 0.6);
    const w = textW(txt, 26, DEV) + 60;
    return `<g opacity="${f1(a)}"><rect x="${f1(40)}" y="40" width="${f1(w)}" height="44" fill="#7e1f22" stroke="${GOLD}" stroke-width="2"/>${text(txt, 40 + w / 2, 71, 26, { fill: GOLD_HI })}</g>`;
  }

  // ---------- cards ----------
  function ornamentFrame(x, y, w, h, col = GOLD) {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${col}" stroke-width="4"/><rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" fill="none" stroke="${col}" stroke-width="1.5"/>`;
    for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) s += `<circle cx="${cx}" cy="${cy}" r="12" fill="${col}" stroke="${LINE}" stroke-width="1.5"/><circle cx="${cx}" cy="${cy}" r="5" fill="${RUBY}"/>`;
    return s;
  }
  function card(g, T) {
    const s = g.seg, age = T - g.start, dur = g.end - g.start;
    const fadeIn = clamp(age / 0.8), fadeOut = clamp((dur - age) / 0.8);
    let world = '', hud = '';
    L.live2.innerHTML = '';
    if (s.style === 'open') {
      // the temple wall; the camera dollies into the painted cloth and the cloth comes alive
      const push = ease(clamp((age - 2) / (dur - 4)));
      showRaster('temple', {});
      const z = lerp(1, 1.64, push), cy = lerp(360, 330, push);
      L.world.setAttribute('transform', `translate(640 360) scale(${z.toFixed(4)}) translate(-640 ${f1(-cy)})`);
      world = `<g transform="translate(150 392)">${FX.diya({ size: 1.1, _uid: 1 }, T)}</g><g transform="translate(1130 392)">${FX.diya({ size: 1.1, _uid: 2 }, T)}</g>`;
      world += `<g transform="translate(640 330)">${FX.sparkle({ n: 40, w: 760, h: 480, seed: 5 }, T, age)}</g>`;
      const ta = clamp((age - 4) / 1.5) * fadeOut;
      hud += `<g opacity="${f1(ta)}">${text(EP.meta.series || 'महागाथा', 640, 330, 132, { font: DISPLAY, fill: GOLD_HI, stroke: '#3a0c10', sw: 12 })}${text(EP.meta.seriesSub || 'पुराणों की कथाएँ', 640, 410, 40, { fill: '#fbf3df', stroke: '#3a0c10', sw: 6 })}</g>`;
      hud += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1(1 - fadeIn)}"/>`;
    } else if (s.style === 'title') {
      showRaster('card', { col: s.bg || '#1c2a5e' });
      L.world.setAttribute('transform', `translate(640 360) scale(${(1 + 0.04 * age / dur).toFixed(4)}) translate(-640 -360)`);
      world += `<g transform="translate(640 360)" opacity="0.35">${FX.mandala({ r: 330, colors: ['#7e1f4c', GOLD_LO, '#1c2a5e', '#a3285e', GOLD_LO, '#2e5a7a'] }, T)}</g>`;
      world += `<g transform="translate(640 360)">${FX.petals({ n: 46, seed: 8 }, T, age)}</g>`;
      const a = clamp((age - 0.6) / 1.2) * fadeOut;
      hud += `<g opacity="${f1(a)}"><rect x="290" y="170" width="700" height="380" fill="#7e1f22" opacity="0.92"/>${ornamentFrame(290, 170, 700, 380)}`;
      hud += text(s.kicker || '', 640, 250, 36, { fill: GOLD_HI, ls: 2 });
      hud += text(s.title || '', 640, 370, 104, { font: DISPLAY, fill: GOLD_HI, stroke: '#3a0c10', sw: 8 });
      if (s.sub) hud += text(s.sub, 640, 460, 32, { fill: '#fbf3df' });
      hud += `</g>`;
      hud += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1(1 - fadeIn)}"/>`;
    } else if (s.style === 'chapter') {
      showRaster('card', { col: s.bg || '#7e1f4c' });
      L.world.setAttribute('transform', `translate(640 360) scale(${(1 + 0.05 * age / dur).toFixed(4)}) translate(-640 -360)`);
      const un = easeOut(clamp(age / 1.0));
      world += `<g transform="translate(640 360)" opacity="0.25">${FX.mandala({ r: 300 }, T)}</g>`;
      hud += `<g opacity="${f1(fadeOut)}"><g transform="translate(640 360) scale(${f1(un * 100) / 100} 1)"><rect x="-520" y="-110" width="1040" height="220" fill="#1c2a5e" stroke="${GOLD}" stroke-width="4"/><rect x="-506" y="-96" width="1012" height="192" fill="none" stroke="${GOLD}" stroke-width="1.4"/></g>`;
      const a = clamp((age - 0.7) / 0.8);
      hud += `<g opacity="${f1(a)}">${text(s.kicker || '', 640, 312, 30, { fill: GOLD_HI, ls: 1 })}${text(s.title || '', 640, 394, 76, { font: DISPLAY, fill: '#fbf3df', stroke: '#0e1533', sw: 6 })}</g>`;
      for (const x of [170, 1110]) hud += `<g opacity="${f1(a)}" transform="translate(${x} 380)">${lotusBud(0, 0, 1.3, 1)}</g>`;
      hud += `</g>`;
    } else if (s.style === 'end' || s.style === 'text' || s.style === 'next') {
      showRaster('card', { col: s.bg || '#1c2a5e' });
      L.world.setAttribute('transform', 'translate(0 0)');
      world += `<g transform="translate(640 360)" opacity="0.2">${FX.mandala({ r: 420 }, T)}</g>`;
      const a = fadeIn * fadeOut;
      hud += `<g opacity="${f1(a)}">`;
      if (s.title) hud += text(s.title, 640, s.style === 'next' ? 200 : 170, s.style === 'next' ? 48 : 72, { font: DISPLAY, fill: GOLD_HI, stroke: '#3a0c10', sw: 7 });
      if (s.sub) hud += text(s.sub, 640, s.style === 'next' ? 270 : 240, 34, { fill: '#fbf3df' });
      (s.credits || []).forEach((c, i) => { hud += text(c, 640, 320 + i * 44, 28, { fill: '#fbf3df', op: clamp((age - 0.8 - i * 0.4) / 0.8) }); });
      hud += '</g>';
    }
    L.live.innerHTML = world;
    L.screen.innerHTML = '';
    // voiced lines over a card get captions
    const k = lineAt(g, T); if (k >= 0 && s.lines && s.lines[k] && s.lines[k].text && g.lines[k] && !g.lines[k].silent) hud += caption(s.lines[k], g.lines[k], T);
    return hud;
  }

  // ---------- transitions ----------
  function transition(T) {
    let s = '';
    for (let i = 1; i < SEGS.length; i++) {
      const b = SEGS[i].start, kind = SEGS[i].seg.trans || (SEGS[i].seg.type === 'card' || SEGS[i - 1].seg.type === 'card' ? 'fade' : 'mandala');
      const half = kind === 'mandala' ? 0.6 : kind === 'cut' ? 0 : 0.45;
      if (!half || Math.abs(T - b) > half) continue;
      const ph = 1 - Math.abs(T - b) / half;
      if (kind === 'fade') s += `<rect width="${W}" height="${H}" fill="#0a0604" opacity="${f1(ease(ph) * 100) / 100}"/>`;
      else if (kind === 'white') s += `<rect width="${W}" height="${H}" fill="#fffbe8" opacity="${f1(ease(ph) * 100) / 100}"/>`;
      else if (kind === 'mandala') {
        const r = ease(ph) * 820;
        s += `<g transform="translate(640 360) rotate(${f1((T - b) * 90)})">${FX.mandala({ r }, T)}</g>`;
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
