/* Anime renderer: painted sets, cel-shaded characters, cinematic shots, inserts, title sequences and subtitles.
   Same contract as the other engines: await Toon.load(ep, tl, svgEl); Toon.renderAt(seconds) draws one frame.
   Static painted layers are rasterised once at load (so they can be lush), then shown as images under the live
   layers (characters, water, washer drums, weather, signs). See anime/SKILL.md for the episode schema. */
(function () {
  const W = 1280, H = 720;
  const SANS = 'Nunito, sans-serif', SERIF = "'EB Garamond', Georgia, serif", HAND = 'Caveat, cursive', JP = 'Mincho, serif';
  const { SETS, sky, rad, erad, lin, wallText, drum, washer, petals, weather, mix, rng, hash } = window.AnimeSets;
  const CH = window.AnimeChars;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const f1 = v => Math.round(v * 10) / 10;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let EP, TL, SVG, SEGS = [], RASTER = {}, LAYERS = {}, uid = 0;
  const nid = p => 'a' + p + (uid++);
  const SCALE = 1.6;   // raster resolution multiplier; close-ups soften the painted backdrop like a shallow depth of field

  function text(s, x, y, size, o = {}) {
    const lines = String(s).split('\n'), lh = size * (o.lh || 1.2);
    const y0 = y - (lines.length - 1) * lh / 2;
    return lines.map((l, i) => `<text x="${f1(x)}" y="${f1(y0 + i * lh)}" font-family="${o.font || SANS}" font-size="${size}" font-weight="${o.weight || 700}"${o.italic ? ' font-style="italic"' : ''} fill="${o.fill || '#fffaf0'}" text-anchor="${o.anchor || 'middle'}" dominant-baseline="central"${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.op != null ? ` opacity="${f1(o.op * 100) / 100}"` : ''}${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 5}" paint-order="stroke" stroke-linejoin="round"` : ''}>${esc(l)}</text>`).join('');
  }
  let mctx;
  function textW(s, size, font = SANS, weight = 700, italic = false) {
    if (!mctx) mctx = document.createElement('canvas').getContext('2d');
    mctx.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${font}`; return mctx.measureText(s).width;
  }
  function wrap(s, size, maxW, font, weight, italic) {
    const words = String(s).split(/\s+/); const out = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (textW(t, size, font, weight, italic) > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
    if (cur) out.push(cur); return out;
  }

  // ---------- scene context ----------
  function ctxOf(seg) {
    const m = EP.meta;
    return { time: seg.time || 'night', weather: seg.weather || null, season: seg.season || m.season || 'autumn', gap: seg.gap ?? m.gap_bench ?? 200,
      washers: seg.washers, dryer: seg.dryer, clock: seg.clock, signFixed: seg.signFixed, moonPhase: seg.moonPhase, petals: seg.petals, leaves: seg.leaves, station: seg.station };
  }
  const rkey = (set, c, layer) => `${set}|${layer}|${c.time}|${c.weather || ''}|${c.season}`;

  // ---------- rasterise painted layers ----------
  async function rasterize(svgBody) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * SCALE}" height="${H * SCALE}" viewBox="0 0 ${W} ${H}">${svgBody}</svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const img = new Image(); img.src = url; await img.decode();
    const cv = document.createElement('canvas'); cv.width = W * SCALE; cv.height = H * SCALE;
    cv.getContext('2d').drawImage(img, 0, 0); URL.revokeObjectURL(url);
    const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
    return URL.createObjectURL(blob);
  }
  async function ensure(set, c) {
    const S = SETS[set]; if (!S) return;
    for (const layer of ['back', 'front']) {
      if (!S[layer]) continue;
      const k = rkey(set, c, layer); if (RASTER[k]) continue;
      RASTER[k] = 'pending';
      const url = await rasterize(S[layer](c));
      const im = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      im.setAttribute('href', url); im.setAttribute('width', W); im.setAttribute('height', H); im.setAttribute('preserveAspectRatio', 'none');
      im.style.display = 'none';
      (layer === 'back' ? LAYERS.bgs : LAYERS.fronts).appendChild(im);
      await new Promise(r => { if (im.complete) r(); im.addEventListener('load', r, { once: true }); setTimeout(r, 1500); });
      RASTER[k] = im;
    }
  }

  // ---------- per-line state folding ----------
  const DEFAULT_LOOK = { mio: ['other', 'other'], itsuki: ['front', 'down'] };
  function foldStates(seg) {
    const chars = seg.chars || {};
    const ids = Object.keys(chars);
    let cur = {}; ids.forEach(id => cur[id] = Object.assign({ emo: 'neutral' }, chars[id]));
    let cat = seg.cat ? Object.assign({}, seg.cat) : null;
    const out = [];
    (seg.lines || []).forEach(ln => {
      const next = {};
      ids.forEach(id => next[id] = Object.assign({}, cur[id], { act: null, look: null }));
      if (ln.cs) for (const [id, v] of Object.entries(ln.cs)) { if (!next[id]) { next[id] = { emo: 'neutral' }; ids.push(id); } Object.assign(next[id], v); }
      if (ln.who && next[ln.who]) { if (ln.emo) next[ln.who].emo = ln.emo; if (ln.act) next[ln.who].act = ln.act; if (ln.look) next[ln.who].look = ln.look; }
      if (ln.react) for (const [id, v] of Object.entries(ln.react)) if (next[id]) { if (typeof v === 'string') next[id].emo = v; else Object.assign(next[id], v); }
      if (ln.cat !== undefined) cat = ln.cat ? Object.assign({}, cat || {}, ln.cat) : null;
      out.push({ chars: next, cat });
      ids.forEach(id => { cur[id] = Object.assign({}, next[id]); });
    });
    seg._ids = ids;
    return out;
  }
  function lookVec(look, dir) {
    switch (look) {
      case 'other': return { tu: 0.42 * dir, gx: 0.65 * dir, gy: 0.05, tilt: 0 };
      case 'front': return { tu: 0.12 * dir, gx: 0.15 * dir, gy: 0.1, tilt: 0 };
      case 'cam': return { tu: 0, gx: 0, gy: 0, tilt: 0 };
      case 'down': return { tu: 0.22 * dir, gx: 0.25 * dir, gy: 0.85, tilt: 3 * dir };
      case 'book': return { tu: 0.05 * dir, gx: 0.05 * dir, gy: 1, tilt: 2 * dir };
      case 'away': return { tu: -0.5 * dir, gx: -0.7 * dir, gy: 0.15, tilt: -2 * dir };
      case 'up': return { tu: 0.15 * dir, gx: 0.2 * dir, gy: -0.95, tilt: -4 * dir };
      case 'left': return { tu: -0.45, gx: -0.7, gy: 0, tilt: 0 };
      case 'right': return { tu: 0.45, gx: 0.7, gy: 0, tilt: 0 };
      default: return { tu: 0, gx: 0, gy: 0, tilt: 0 };
    }
  }

  // ---------- load ----------
  async function load(ep, tl, svg) {
    EP = ep; TL = tl; SVG = svg;
    SVG.setAttribute('viewBox', `0 0 ${W} ${H}`);
    SVG.innerHTML = `<rect width="${W}" height="${H}" fill="#000"/><g id="world"><g id="bgs"></g><g id="mid"></g><g id="fronts"></g><g id="mid2"></g></g><g id="hud"></g>`;
    LAYERS = { world: SVG.querySelector('#world'), bgs: SVG.querySelector('#bgs'), mid: SVG.querySelector('#mid'), fronts: SVG.querySelector('#fronts'), mid2: SVG.querySelector('#mid2'), hud: SVG.querySelector('#hud') };
    const byId = {}; ep.sequence.forEach(s => byId[s.id] = s);
    SEGS = [];
    for (const sh of tl.shots) {
      let g = SEGS[SEGS.length - 1];
      if (!g || g.seg.id !== sh.seg) { g = { seg: byId[sh.seg], start: sh.start, lines: [] }; SEGS.push(g); }
      if (sh.type === 'line') g.lines[sh.idx] = sh; else g.card = sh;
    }
    SEGS.forEach((g, i) => { g.end = i + 1 < SEGS.length ? SEGS[i + 1].start : tl.duration; if (i === 0) g.start = 0; });
    // which painted layers do we need?
    const need = [];
    const m = ep.meta, base = { time: 'night', weather: null, season: m.season || 'autumn', gap: m.gap_bench ?? 200 };
    for (const g of SEGS) {
      const s = g.seg;
      if (s.type === 'scene') {
        s._states = foldStates(s);
        const c = ctxOf(s); s._ctx = c;
        need.push([s.set, c]);
        for (const ln of s.lines || []) { const sh = ln.shot || ''; if (sh === 'ext' || sh.startsWith('ext')) need.push(['laundry_ext', c]); if (sh === 'sky') need.push(['sky', c]); }
      } else {
        const c = Object.assign({}, base, { time: s.time || 'night', season: s.season || base.season, weather: s.weather || null }); s._ctx = c;
        if (s.style === 'op') { need.push(['sky', c], ['laundry_ext', c], ['laundry_int', c], ['bridge', c]); }
        if (s.style === 'ed') need.push(['bridge', c]);
        if (s.style === 'title' || s.style === 'eyecatch' || s.style === 'next') need.push(['card', c]);
      }
    }
    for (const [set, c] of need) await ensure(set, c);
  }

  // ---------- camera ----------
  function headPos(seg, id, slot) {
    const d = CH.D[id]; if (!d || !slot) return [640, 360];
    const s = slot.s || 1, U = d.H / 100;
    const hipY = slot.pose === 'sit' ? 0 : -47 * U;
    const shY = hipY - 33.5 * U, headY = shY - 5.5 * U - d.r * 0.82;
    return [slot.x, slot.y + headY * s, d.r * s];
  }
  function shotCam(seg, k, shot, slots, st, age, dur) {
    const drift = ease(clamp(age / Math.max(dur, 0.1)));
    let cx = 640, cy = 360, z = 1;
    const ids = seg._ids.filter(id => st.chars[id] && slots[st.chars[id].slot]);
    const hp = id => headPos(seg, id, slots[st.chars[id].slot]);
    const [kind, who] = shot.split(':');
    if (kind === 'wide' || !ids.length) { z = 1.0 + 0.025 * drift; cx = 640 + (seg.pan || 0) * drift; cy = 360; }
    else if (kind === 'two' || kind === 'mid') {
      const ps = ids.slice(0, 2).map(hp);
      const xs = ps.map(p => p[0]), ys = ps.map(p => p[1]);
      const span = Math.max(...xs) - Math.min(...xs);
      z = clamp(1280 / (span + (kind === 'mid' ? 760 : 560)), 1.05, 2.0) * (1 + 0.03 * drift);
      cx = (Math.max(...xs) + Math.min(...xs)) / 2; cy = Math.min(...ys) + (ps[0][2] || 27) * 3.4;
    } else if (kind === 'close' || kind === 'mcu' || kind === 'ecu') {
      const id = who && st.chars[who] ? who : ids[0];
      const [hx, hy, r] = hp(id);
      const zz = kind === 'ecu' ? 4.6 : kind === 'close' ? 3.0 : 2.1;
      z = zz * (27 / (r || 27)) * (1 + 0.035 * drift);
      // rule of thirds: leave room in the direction the face looks
      const other = ids.find(i => i !== id), dir = other ? Math.sign(hp(other)[0] - hx) || 1 : (hx < 640 ? 1 : -1);
      cx = hx + dir * (kind === 'ecu' ? 40 : 120) / z * 1.5; cy = hy + r * (kind === 'ecu' ? 0.2 : kind === 'close' ? 0.62 : 1.9);
    }
    // keep the frame inside the set
    const hw = W / 2 / z, hh = H / 2 / z;
    cx = clamp(cx, hw, W - hw); cy = clamp(cy, hh, H - hh);
    return { cx, cy, z };
  }
  function autoShot(seg, k) {
    const ln = seg.lines[k]; if (ln.shot) return ln.shot;
    const ids = seg._ids;
    if (k === 0) return 'wide';
    if (!ln.who || !ids.includes(ln.who)) return ids.length > 1 ? 'two' : 'mcu:' + ids[0];
    if (ids.length < 2) return (k % 3 === 0 ? 'mcu:' : 'close:') + ln.who;
    const words = (ln.text || '').split(/\s+/).length;
    if (k % 5 === 0 || (!ln.text && !ln.thought)) return 'two';
    return words > 9 || ln.thought ? 'close:' + ln.who : (k % 2 ? 'close:' + ln.who : 'two');
  }

  // ---------- inserts (full-frame cutaways) ----------
  function paper(x, y, w, h, col = '#f6efdc') { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>`; }
  function typeset(str, x, y, w, size, o = {}) {
    const paras = String(str).split('\n'); let s = '', yy = y;
    for (const p of paras) {
      const lines = wrap(p, size, w, o.font || SERIF, o.weight || 400, o.italic);
      for (const l of lines) { s += text(l, x, yy, size, { font: o.font || SERIF, weight: o.weight || 400, fill: o.fill || '#2a2420', anchor: 'start', italic: o.italic, op: o.op }); yy += size * (o.lh || 1.45); }
      yy += size * 0.4;
    }
    return s;
  }
  function insert(ins, T, age, dur, c) {
    const kind = ins.kind; let s = '';
    const push = 1 + 0.04 * ease(clamp(age / Math.max(dur, 1)));
    const wrapCam = body => `<g transform="translate(640 360) scale(${f1(push * 1000) / 1000}) translate(-640 -360)">${body}</g>`;
    if (kind === 'book' || kind === 'manuscript') {
      const lit = c.time === 'night' ? '#fff3d8' : '#fffaf0';
      s += `<rect width="${W}" height="${H}" fill="#2a2018"/>` + erad0(640, 360, 760, 460, '#ffd9a0', 0.25);
      if (kind === 'book') {
        s += `<path d="M100 70Q370 40 640 90Q910 40 1180 70L1200 680Q910 650 640 700Q370 650 80 680Z" fill="#6a2a22"/>`;
        s += `<path d="M120 80Q380 54 636 100V690Q380 646 104 668Z" fill="${lit}"/><path d="M644 100Q900 54 1160 80L1176 668Q900 646 644 690Z" fill="${mix(lit, '#e8dcc0', 0.3)}"/>`;
        s += `<path d="M600 100Q620 400 640 690" stroke="#000" stroke-opacity="0.12" stroke-width="40"/>`;
        s += text(ins.title || '', 370, 124, 15, { font: SERIF, italic: true, fill: '#8a7a64', ls: 2 }) + text(String(ins.page || 1 + (hash(ins.text || '') % 300)), 910, 124, 15, { font: SERIF, fill: '#8a7a64' });
        s += typeset(ins.text || '', 175, 190, 400, 27, { lh: 1.5 });
        if (ins.right) s += typeset(ins.right, 700, 190, 400, 27, { lh: 1.5 });
        if (ins.underline) { const n = ins.underline; for (let i = 0; i < n; i++) s += `<path d="M175 ${206 + i * 40}q200 4 ${f1(380 - i * 30)} -2" stroke="#5a5a6a" stroke-width="1.6" fill="none" opacity="0.7"/>`; }
        if (ins.note) {
          const by = ins.noteBy === 'mio' ? '#3a4aa0' : '#5a5250';
          const rl = ins.right ? wrap(ins.right, 27, 400, SERIF, 400).length : 0;   // keep the pencil note below the right page's text
          const nx = ins.right ? 712 : 720, ny = ins.right ? Math.max(330, 190 + rl * 40.5 + 50) : 230, rot = ins.right ? -2 : -4;
          s += `<g transform="rotate(${rot} ${nx} ${ny})">` + typeset(ins.note, nx, ny, 400, 30, { font: HAND, weight: 600, fill: by, lh: 1.15 }) + `</g>`;
        }
      } else {
        s += `<g transform="rotate(-1.5 640 360)"><rect x="250" y="50" width="780" height="640" fill="#fbf8f0"/><rect x="262" y="62" width="780" height="640" fill="#000" opacity="0.08"/></g><g transform="rotate(-1.5 640 360)">`;
        if (ins.title) s += text(ins.title, 640, 130, 30, { font: SERIF, weight: 600, fill: '#2a2420' });
        s += typeset(ins.text || '', 330, ins.title ? 200 : 130, 620, 25, { font: SERIF, lh: 1.6 });
        if (ins.note) s += typeset(ins.note, 330, 600, 600, 30, { font: HAND, fill: '#3a4aa0', weight: 600 });
        s += `</g>`;
      }
      s = wrapCam(s);
      s += `<rect width="${W}" height="${H}" fill="${c.time === 'night' ? '#20304a' : '#000'}" opacity="${c.time === 'night' ? 0.12 : 0}"/>`;
      return s;
    }
    if (kind === 'notebook') {
      s += `<rect width="${W}" height="${H}" fill="#7a6a58"/>` + erad0(640, 360, 700, 460, '#ffffff', 0.3);
      s += `<g transform="rotate(${ins.rot ?? -2} 640 360)"><rect x="220" y="40" width="840" height="660" rx="6" fill="#fbfaf2"/>`;
      for (let y = 120; y < 690; y += 44) s += `<path d="M240 ${y}H1040" stroke="#b8c8e0" stroke-width="1.4"/>`;
      s += `<path d="M330 40V700" stroke="#e8a0a0" stroke-width="2"/>`;
      for (let y = 70; y < 700; y += 44) s += `<circle cx="248" cy="${y}" r="7" fill="#7a6a58"/>`;
      if (ins.title) s += text(ins.title, 360, 92, 22, { font: SANS, weight: 800, fill: '#7a8aa0', anchor: 'start' });
      const reveal = ins.typeOn ? clamp(age / Math.max(1, dur * 0.85)) : 1;
      const full = ins.text || '';
      const nsz = full.split('\n').length > 9 ? 28 : 34;   // long lists get a smaller hand so they fit the page
      s += typeset(full.slice(0, Math.ceil(full.length * reveal)), 350, 148, 660, nsz, { font: HAND, weight: 600, fill: ins.hand === 'itsuki' ? '#2a2a3a' : '#3a4aa0', lh: 1.29 });
      s += `</g>`;
      return wrapCam(s);
    }
    if (kind === 'washer' || kind === 'dryer') {
      s += `<rect width="${W}" height="${H}" fill="#e8ebe4"/>` + erad0(640, 200, 800, 300, '#ffffff', 0.5);
      s += `<circle cx="640" cy="380" r="300" fill="#c7ccc6" stroke="#8d938d" stroke-width="6"/><circle cx="640" cy="380" r="250" fill="#26303a"/>`;
      s += drum(T, 640, 380, 250, ins.colors || ['#e8e2d0', '#5a7fa8', '#f2c14e', '#e8e2d0', '#b8323a', '#7a8a6a'], kind === 'dryer' ? 2.6 : 1.6, 'ins');
      s += `<path d="M420 230A250 250 0 0 1 700 140" stroke="#fff" stroke-width="16" fill="none" opacity="0.25"/>`;
      return wrapCam(s);
    }
    if (kind === 'cans') {
      s += bgPaint(c);
      s += `<rect y="430" width="${W}" height="80" fill="#8a5f3c"/><rect y="420" width="${W}" height="22" fill="#a87a50"/><path d="M0 432H${W}" stroke="#c4986a" stroke-width="3"/><rect y="510" width="${W}" height="210" fill="#2a2420" opacity="0.7"/>`;
      const g = ins.gap ?? 200;
      const item = (x, k) => k === 'basket' ? basket(x, 430, 2.2) : k ? `<g transform="translate(${x} 430) scale(2.6)">${CH.can(0, -24, 10, k, x => x, T, true)}</g>` : '';
      s += item(640 - g, ins.left) + item(640 + g, ins.right);
      return wrapCam(s);
    }
    if (kind === 'sign') {
      s += `<rect width="${W}" height="${H}" fill="#eceee8"/>` + `<g transform="rotate(-3 640 360)"><rect x="300" y="200" width="680" height="300" fill="#fffbe6" stroke="#d9cfa0" stroke-width="3"/><rect x="580" y="180" width="120" height="40" fill="#e8e0b0" opacity="0.85"/>` +
        text('DRYER 10 MINUTS', 640, 310, 72, { font: HAND, weight: 700, fill: '#c0392b' }) + text('100 YEN', 640, 410, 80, { font: HAND, weight: 700, fill: '#c0392b' }) +
        (ins.fixed ? (() => {   // a proofreader's caret between T and S, with the missing E in blue pencil
          const cx = 640 - textW('DRYER 10 MINUTS', 72, HAND, 700) / 2 + textW('DRYER 10 MINUT', 72, HAND, 700);
          return `<path d="M${f1(cx - 12)} 374L${f1(cx)} 352L${f1(cx + 12)} 374" stroke="#2a3a8a" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + text('E', cx, 236, 56, { font: HAND, weight: 700, fill: '#2a3a8a' });
        })() : '') +
        (ins.pencil ? `<g transform="translate(${f1(900 + Math.sin(T * 3) * 6)} 330) rotate(-35)"><rect x="-8" y="-150" width="16" height="190" fill="#f2c14e" stroke="#3a2622" stroke-width="2"/><path d="M-8 40L0 62L8 40Z" fill="#e8c8a0" stroke="#3a2622" stroke-width="2"/></g>` : '') + `</g>`;
      return wrapCam(s);
    }
    if (kind === 'cat') {
      s += `<rect width="${W}" height="${H}" fill="#eceee8"/><rect y="420" width="${W}" height="300" fill="#d7dbd4"/><rect y="414" width="${W}" height="10" fill="#b8bdb4"/>`;
      s += `<g transform="translate(640 430) scale(4)">${CH.cat(ins.pose || 'sleep', T)}</g>`;
      return wrapCam(s);
    }
    if (kind === 'phone') {
      s += `<rect width="${W}" height="${H}" fill="#1a1c24"/>` + erad0(640, 360, 400, 400, '#8ab4ff', 0.25);
      s += `<rect x="470" y="60" width="340" height="620" rx="40" fill="#2a2c34" stroke="#4a4c54" stroke-width="4"/><rect x="490" y="90" width="300" height="560" rx="20" fill="${ins.bg || '#e8f0fa'}"/>`;
      if (ins.call) { s += text(ins.call, 640, 230, 30, { weight: 800, fill: '#1a2a3a' }) + text(ins.sub || 'calling...', 640, 280, 22, { fill: '#5a6a7a' }) + `<circle cx="580" cy="560" r="34" fill="#d9534f"/><circle cx="700" cy="560" r="34" fill="#4caf50"/>` + `<circle cx="640" cy="160" r="${f1(40 + Math.sin(T * 6) * 4)}" fill="#c8d8ea"/>`; }
      else { s += text(ins.head || '', 640, 140, 22, { weight: 900, fill: '#3a4a5a' }); s += typeset(ins.text || '', 515, 210, 250, 24, { font: SANS, weight: 700, fill: '#1a2a3a', lh: 1.35 }); }
      return wrapCam(s);
    }
    if (kind === 'cover') {
      s += `<rect width="${W}" height="${H}" fill="#3a3430"/>` + erad0(640, 360, 600, 420, '#ffe0b0', 0.3);
      s += `<rect x="470" y="70" width="340" height="520" fill="${ins.color || '#e8e2d4'}" stroke="#2a2420" stroke-width="2"/><rect x="480" y="80" width="320" height="500" fill="none" stroke="#8a7a64" stroke-width="1.4"/>`;
      s += text(ins.title || '', 640, 250, 34, { font: SERIF, weight: 600, fill: '#2a2420', lh: 1.15 }) + `<path d="M590 330H690" stroke="#8a7a64"/>` + text(ins.author || '', 640, 380, 24, { font: SERIF, italic: true, fill: '#4a4038' });
      if (ins.label) s += `<rect x="740" y="520" width="60" height="50" fill="#fff" stroke="#8a7a64"/>` + text(ins.label, 770, 545, 14, { fill: '#2a2420', weight: 800 });
      if (ins.caption) s += text(ins.caption, 640, 650, 22, { font: SERIF, italic: true, fill: '#e8dcc8' });
      return wrapCam(s);
    }
    if (kind === 'photo') {
      s += `<rect width="${W}" height="${H}" fill="#5a4030"/>` + erad0(640, 360, 600, 400, '#ffd8a0', 0.35);
      s += `<rect x="380" y="90" width="520" height="540" rx="10" fill="#4a3020"/><rect x="410" y="120" width="460" height="480" fill="#efe6d0"/>`;
      s += `<rect x="430" y="140" width="420" height="440" fill="#c8d8c0"/>` + rad(640, 300, 260, '#fff8e0', 0.5);
      s += `<g transform="translate(560 580) scale(0.95)">${CH.draw('genzo', { pose: 'stand', season: 'autumn', emo: 'warm', tu: 0.2, gx: 0.2, gy: 0, talk: 0, blink: 0, seed: 3, lx: -0.3 }, 0)}</g>`;
      s += `<g transform="translate(720 580) scale(0.55)">${CH.draw('mio', { pose: 'stand', season: 'summer', emo: 'grin', tu: -0.2, gx: -0.2, gy: 0, talk: 0, blink: 0, seed: 5, lx: -0.3 }, 0)}</g>`;
      s += `<rect x="410" y="120" width="460" height="480" fill="#d8b878" opacity="0.18"/>`;
      return wrapCam(s);
    }
    if (kind === 'hands') {
      s += bgPaint(c) + `<rect y="380" width="${W}" height="140" fill="#8a5f3c"/><rect y="370" width="${W}" height="24" fill="#a87a50"/>`;
      const g = ins.gap ?? 160;
      for (const [x, skin, sl, flip] of [[640 - g, '#f8dbc6', ins.mioSleeve || '#b8323a', 1], [640 + g, '#f2d5bf', ins.itsukiSleeve || '#2e3752', -1]]) {
        s += `<g transform="translate(${x} 380) scale(${flip} 1)"><path d="M-400 -10Q-200 -30 -60 -20L-60 30Q-200 40 -400 40Z" fill="${sl}" stroke="#3a2622" stroke-width="3"/>` +
          `<path d="M-70 -18Q0 -30 40 -8Q60 4 40 14Q0 26 -70 28Z" fill="${skin}" stroke="#3a2622" stroke-width="3"/><path d="M20 -10q12 4 16 14M0 -16q14 6 16 22" stroke="#c89a8a" stroke-width="2" fill="none"/></g>`;
      }
      return wrapCam(s);
    }
    if (kind === 'text') {
      s += `<rect width="${W}" height="${H}" fill="#0c0e18"/>` + text(ins.text || '', 640, 360, 34, { font: SERIF, italic: true, fill: '#e8e0cc' });
      return s;
    }
    if (kind === 'window') {
      s += bgPaint(c) + `<rect width="${W}" height="${H}" fill="#0a1020" opacity="0.4"/>`;
      for (let i = 0; i < 14; i++) { const r = rng('bk' + i); s += rad(r() * W, 200 + r() * 400, 30 + r() * 60, ['#ffd98a', '#ff9a6a', '#cfe8ff'][i % 3], 0.5, 0.5); }
      s += window.AnimeSets.rainOn(T, 0, 0, W, H, 'win2', 0.5, 120, 20, 0.05);
      for (let i = 0; i < 30; i++) { const r = rng('drop' + i); const yy = (r() * H + T * (10 + r() * 30)) % H; s += `<circle cx="${f1(r() * W)}" cy="${f1(yy)}" r="${f1(3 + r() * 6)}" fill="#cfe0ff" opacity="0.35"/>`; }
      return wrapCam(s);
    }
    return `<rect width="${W}" height="${H}" fill="#000"/>`;
  }
  function erad0(cx, cy, rx, ry, col, op) { return window.AnimeSets.erad(cx, cy, rx, ry, col, op); }
  function bgPaint(c) { const k = rkey('laundry_int', c, 'back'); return RASTER[k] && RASTER[k].getAttribute ? `<image href="${RASTER[k].getAttribute('href')}" width="${W}" height="${H}" transform="translate(-640 -500) scale(2)" opacity="0.9"/>` : `<rect width="${W}" height="${H}" fill="#e8e4d4"/>`; }
  function basket(x, y, sc = 1) {
    let s = `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-34 0L-30 -34H30L34 0Z" fill="#7ab0c8" stroke="#3a2622" stroke-width="1.4"/>`;
    for (let i = -2; i <= 2; i++) s += `<rect x="${i * 11 - 3}" y="-28" width="6" height="18" rx="3" fill="#5a90a8"/>`;
    s += `<path d="M-28 -34Q-10 -50 6 -38Q20 -48 30 -34Z" fill="#f2efe6" stroke="#3a2622" stroke-width="1.2"/><path d="M-4 -40q8 -10 18 -2" fill="#e2a83a"/></g>`;
    return s;
  }

  // ---------- characters in a set ----------
  function drawCast(seg, k, T, ctx, slots, light, onlyIds) {
    const st = seg._states[k], g = seg._g;
    const ln = seg.lines[k], shot = g.lines[k];
    let s = '';
    const cc = c => light.amt ? mix(c, light.amb, light.amt) : c;
    const ids = (onlyIds || seg._ids).filter(id => st.chars[id] && slots[st.chars[id].slot]);
    const xs = {}; ids.forEach(id => xs[id] = slots[st.chars[id].slot].x);
    // items on the bench (baskets, cans)
    for (const it of seg.items || []) {
      if (it.from != null && k < it.from) continue;
      const sl = slots[it.slot] || it; if (!sl) continue;
      const sc = (sl.s || 1);
      if (it.kind === 'basket') s += basket(sl.x + (it.dx || 0) * sc, sl.y, sc * (it.size || 1));
      if (it.kind === 'can') s += `<g transform="translate(${f1(sl.x + (it.dx || 0) * sc)} ${f1(sl.y)}) scale(${f1(sc)})">${CH.can(0, -10, 4, it.can || 'coffee', cc, T, it.steam)}</g>`;
    }
    const cat = st.cat;
    const catSvg = () => { const sl = slots[cat.slot]; if (!sl) return ''; return `<g transform="translate(${f1(sl.x + (cat.dx || 0))} ${f1(sl.y)}) scale(${f1((sl.s || 1) * (cat.s || 0.7))})">${CH.cat(cat.pose || 'sleep', T, cc, 1)}</g>`; };
    if (cat && cat.slot !== 'cat_bench') s += catSvg();
    for (const id of ids) {
      const cs = st.chars[id], sl = slots[cs.slot];
      const other = ids.find(o => o !== id);
      const dir = other ? Math.sign(xs[other] - xs[id]) || 1 : (cs.dir || (sl.x < 640 ? 1 : -1));
      const speaking = ln.who === id && !ln.thought && !ln.vo && ln.text;
      const defaults = DEFAULT_LOOK[id] || ['other', 'other'];
      const lookName = cs.look || (speaking ? defaults[0] : (cs.idleLook || defaults[1]));
      const lv = lookVec(lookName, dir);
      // ease from the previous line's look
      let pv = lv;
      if (k > 0) { const pst = seg._states[k - 1].chars[id]; if (pst) { const pln = seg.lines[k - 1]; const pspk = pln.who === id && !pln.thought; const pd = DEFAULT_LOOK[id] || ['other', 'other']; pv = lookVec(pst.look || (pspk ? pd[0] : (pst.idleLook || pd[1])), dir); } }
      const q = ease(clamp((T - shot.start) / 0.45));
      const L = { tu: lerp(pv.tu, lv.tu, q), gx: lerp(pv.gx, lv.gx, q), gy: lerp(pv.gy, lv.gy, q), tilt: lerp(pv.tilt, lv.tilt, q) };
      let talk = 0;
      if (speaking && shot.env && shot.env.length) { const i = Math.floor((T - shot.start) * (TL.envFps || 30)); talk = i >= 0 && i < shot.env.length ? shot.env[i] : 0; }
      const seed = hash(id) % 97;
      const per = 3.2 + (seed % 13) / 10, ph = (T + seed) % per;
      const blink = ph < 0.13 ? 1 - Math.abs(ph - 0.065) / 0.065 : 0;
      const actAge = T - shot.start, actDur = shot.end - shot.start + 0.3;
      let actP = cs.act ? clamp(actAge / 0.4) * clamp((actDur - actAge + 0.6) / 0.4) : 0;
      if (cs.act && cs.holdAct) actP = 1;
      const act = cs.act || cs.pose2 || null; if (!cs.act && cs.pose2) actP = 1;
      const state = { pose: cs.pose || sl.pose || 'sit', season: ctx.season, emo: cs.emo, tu: L.tu, gx: L.gx, gy: L.gy, tilt: L.tilt + (cs.tilt || 0), lean: cs.lean || 0, side: dir,
        talk: speaking ? talk : 0, talking: !!speaking, blink, act, actP, actT0: shot.start, prop: cs.prop, umbrellaColor: cs.umbrellaColor, umbrellaOpen: !!cs.open, bookColor: cs.bookColor, bookOpen: cs.bookOpen, canKind: cs.can, cc, lx: light.lx ?? -0.3, seed, blushX: cs.blush || 0 };
      const sc = (sl.s || 1) * (cs.s || 1);
      if (!cs.noShadow) { const U = (CH.D[id] ? CH.D[id].H : 400) / 100, fy = (state.pose === 'sit' ? 33.3 * U : 0) * sc; s += `<ellipse cx="${f1(sl.x + (cs.dx || 0))}" cy="${f1(sl.y + (cs.dy || 0) + fy)}" rx="${f1(13 * U * sc)}" ry="${f1(2.6 * U * sc)}" fill="#1a1430" opacity="0.22"/>`; }
      s += `<g transform="translate(${f1(sl.x + (cs.dx || 0))} ${f1(sl.y + (cs.dy || 0))}) scale(${f1(sc * 1000) / 1000})">${CH.draw(id, state, T)}</g>`;
      // winter breath when speaking outdoors
      if (speaking && ctx.season === 'winter' && seg.set !== 'laundry_int' && !seg.set.startsWith('room') && talk > 0.3) {
        const [hx, hy, r] = headPos(seg, id, sl);
        s += `<ellipse cx="${f1(hx + dir * r * 1.1)}" cy="${f1(hy + r * 0.75 * (sl.s || 1))}" rx="${f1(r * 0.5 * talk)}" ry="${f1(r * 0.25 * talk)}" fill="#ffffff" opacity="${f1(0.35 * talk)}"/>`;
      }
    }
    if (cat && cat.slot === 'cat_bench') s += catSvg();
    return s;
  }

  // ---------- captions ----------
  function caption(seg, k, T, shot) {
    const ln = seg.lines[k]; if (!ln || !ln.text || EP.meta.captions === false) return '';
    if (T > shot.end + 0.25) return '';
    const th = !!ln.thought;
    const size = th ? 31 : 28, font = th ? SERIF : SANS, weight = th ? 500 : 800;
    const lines = wrap(th ? `(${ln.text})` : ln.text, size, 960, font, weight, th);
    // long lines are paged two caption lines at a time, each page held in proportion to its length
    let shown = lines;
    if (lines.length > 2) {
      const pages = []; for (let i = 0; i < lines.length; i += 2) pages.push(lines.slice(i, i + 2));
      const lens = pages.map(p => p.join(' ').length), tot = lens.reduce((a, b) => a + b, 0);
      const f = clamp((T - shot.start) / Math.max(0.1, shot.end - shot.start)) * tot;
      let acc = 0, pi = 0; while (pi < pages.length - 1 && f > acc + lens[pi]) acc += lens[pi++];
      shown = pages[pi];
    }
    const op = clamp((T - shot.start) / 0.12) * clamp((shot.end + 0.25 - T) / 0.15);
    let s = '';
    shown.forEach((l, i) => s += text(l, 640, H - 52 - (shown.length - 1 - i) * (size * 1.25), size, { font, weight, italic: th, fill: th ? '#e8f0ff' : (ln.who === 'itsuki' ? '#fff8e6' : ln.who === 'mio' ? '#fffaf0' : '#f0f0f0'), stroke: '#141018', sw: 6, op }));
    return s;
  }

  // ---------- cards ----------
  function showLayers(bgKey, frontKey) {
    for (const im of LAYERS.bgs.children) im.style.display = im === bgKey ? '' : 'none';
    for (const im of LAYERS.fronts.children) im.style.display = im === frontKey ? '' : 'none';
  }
  function worldCam(cx, cy, z) { LAYERS.world.setAttribute('transform', `translate(${W / 2} ${H / 2}) scale(${f1(z * 1000) / 1000}) translate(${f1(-cx)} ${f1(-cy)})`); }
  function useSet(set, c) {
    const b = RASTER[rkey(set, c, 'back')], fr = RASTER[rkey(set, c, 'front')];
    showLayers(b && b.style ? b : null, fr && fr.style ? fr : null);
  }
  const LOGO = 'Dostoevsky at the Coin Laundry';
  function logo(x, y, size, op, sub = true) {
    return `<g opacity="${f1(op * 100) / 100}">` + text(LOGO, x, y, size, { font: SERIF, weight: 500, fill: '#fff8e6', stroke: '#1a1830', sw: 7, ls: 1 }) +
      (sub ? text('コインランドリーのドストエフスキー', x, y + size * 0.95, size * 0.38, { font: JP, weight: 400, fill: '#f2e6c8', stroke: '#1a1830', sw: 4, ls: 4 }) : '') + `</g>`;
  }
  function drawCard(g, T) {
    const c = g.seg, age = T - g.start, dur = g.end - g.start, ctx = c._ctx;
    let mid = '', hud = '';
    const fade = Math.min(clamp(age / 0.6), clamp((g.end - T) / 0.6));
    if (c.style === 'op') {
      // a slow painted montage under the main theme
      const parts = [['sky', 0, 7], ['laundry_ext', 7, 14.5], ['washer', 14.5, 21.5], ['laundry_int', 21.5, 29], ['cat', 29, 35.5], ['bridge', 35.5, dur]];
      const part = parts.find(p => age >= p[1] && age < p[2]) || parts[parts.length - 1];
      const pa = age - part[1], pd = part[2] - part[1], u = ease(clamp(pa / pd));
      const pf = Math.min(clamp(pa / 0.7), clamp((part[2] - age) / 0.7));
      if (part[0] === 'washer' || part[0] === 'cat') {
        showLayers(null, null); worldCam(640, 360, 1);
        hud += insert({ kind: part[0], pose: 'sleep' }, T, pa, pd, ctx);
      } else {
        useSet(part[0], ctx);
        const cams = { sky: [640, lerp(260, 420, u), 1.35], laundry_ext: [lerp(560, 700, u), 380, lerp(1.0, 1.12, u)], laundry_int: [640, 400, lerp(1.25, 1.1, u)], bridge: [640, 360, lerp(1.08, 1.0, u)] };
        const [cx, cy, z] = cams[part[0]]; worldCam(cx, cy, z);
        const S = SETS[part[0]];
        mid += S.dyn ? S.dyn(ctx, T) : '';
        if (part[0] === 'bridge') {
          const fake = { _ids: ['mio', 'itsuki'], lines: [{}], _states: [{ chars: { mio: { slot: 'railL', emo: 'soft', look: 'up' }, itsuki: { slot: 'railR', emo: 'neutral', look: 'up' } }, cat: null }], _g: { lines: [{ start: g.start, end: g.end, env: [] }] }, items: [], set: 'bridge' };
          mid += drawCast(fake, 0, T, ctx, S.slots(Object.assign({}, ctx, { gap: EP.meta.gap_bench ?? 200 })), S.light(ctx));
        }
        if (part[0] === 'laundry_int') {
          const fake = { _ids: [], lines: [{}], _states: [{ chars: {}, cat: { slot: 'cat_dryer', pose: 'sleep' } }], _g: { lines: [{ start: g.start, end: g.end, env: [] }] }, items: [{ kind: 'basket', slot: 'benchL' }, { kind: 'basket', slot: 'benchR' }], set: 'laundry_int' };
          mid += drawCast(fake, 0, T, ctx, S.slots(Object.assign({}, ctx, { gap: (EP.meta.gap_bench ?? 200) + 40 })), S.light(ctx));
        }
      }
      if (age > 15.5 && age < 21) hud += logo(640, 360, 66, clamp((age - 15.5) / 1.2) * clamp((21 - age) / 0.8));
      if (part[0] === 'bridge') hud += logo(640, 150, 54, clamp((age - 37) / 1.5));
      const credits = [[1.5, 'An original animated series'], [8, 'Inspired by the works of Fyodor Dostoevsky'], [22.5, 'Mio Takanashi  ·  Itsuki Kanzaki'], [30, 'and Fyodor, the laundry cat']];
      for (const [t0, l] of credits) if (age > t0 && age < t0 + 5.5) hud += text(l, 640, 640, 24, { font: SERIF, italic: true, fill: '#fff8e6', stroke: '#141018', sw: 5, op: clamp((age - t0) / 0.8) * clamp((t0 + 5.5 - age) / 0.8) });
      hud += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1((1 - pf) * 0.9 * 100) / 100}"/>`;
    } else if (c.style === 'title' || c.style === 'eyecatch' || c.style === 'next') {
      useSet('card', ctx); worldCam(640, 360, 1 + 0.03 * age / dur);
      mid += SETS.card.dyn(ctx, T);
      if (c.style === 'title') {
        hud += text(c.kanji || '', 640, 190, 46, { font: JP, weight: 400, fill: '#f2e6c8', op: clamp((age - 0.3) / 0.8), ls: 10 });
        hud += text(c.kicker || '', 640, 262, 22, { font: SANS, weight: 800, fill: '#d8cfe8', ls: 8, op: clamp((age - 0.6) / 0.8) });
        hud += text(c.title, 640, 345, 74, { font: SERIF, weight: 500, fill: '#fff8e6', stroke: '#141030', sw: 6, op: clamp((age - 0.9) / 1.0) });
        hud += text(c.sub || '', 640, 440, 30, { font: SERIF, italic: true, fill: '#e8dcc8', op: clamp((age - 1.6) / 1.0) });
      } else if (c.style === 'eyecatch') {
        hud += `<g transform="translate(640 470) scale(2.4)">${CH.cat(c.pose || (EP.meta.episode % 2 ? 'sit' : 'sleep'), T)}</g>`;
        hud += logo(640, 170, 54, clamp(age / 0.6), true);
      } else {
        hud += text('Next time', 640, 120, 30, { font: SERIF, italic: true, fill: '#e8dcc8', op: clamp(age / 0.6) });
        hud += text(c.title || '', 640, 330, 64, { font: SERIF, weight: 500, fill: '#fff8e6', stroke: '#141030', sw: 6, op: clamp((age - 0.4) / 0.8) });
        hud += text(c.sub || '', 640, 420, 28, { font: SERIF, italic: true, fill: '#e8dcc8', op: clamp((age - 0.9) / 0.8) });
      }
      hud += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1((1 - fade) * 100) / 100}"/>`;
    } else if (c.style === 'ed') {
      useSet('bridge', ctx);
      const u = ease(clamp(age / dur));
      worldCam(lerp(760, 800, u), lerp(330, 345, u), lerp(1.25, 1.32, u));
      mid += SETS.bridge.dyn(ctx, T);
      const fake = { _ids: ['mio', 'itsuki'], lines: [{}], _states: [{ chars: { mio: { slot: 'railL', emo: 'soft', look: 'up' }, itsuki: { slot: 'railR', emo: 'soft', look: 'up', pose2: 'rail' } }, cat: null }], _g: { lines: [{ start: g.start, end: g.end, env: [] }] }, items: [], set: 'bridge' };
      const gp = (EP.meta.gap_bench ?? 200) * 0.7;
      mid += drawCast(fake, 0, T, ctx, { railL: { x: 900 - gp / 2, y: 640, pose: 'stand' }, railR: { x: 960 + gp / 2, y: 640, pose: 'stand' } }, SETS.bridge.light(ctx));
      LAYERS.mid2.innerHTML = SETS.bridge.dynFront ? SETS.bridge.dynFront(ctx, T) : '';
      // scrolling credits on a soft panel
      const cr = c.credits || [];
      hud += `<rect x="0" y="0" width="470" height="${H}" fill="#0a0e1e" opacity="0.55"/>`;
      const y0 = H + 40 - (age / dur) * (cr.length * 52 + H * 0.6);
      cr.forEach((l, i) => { const y = y0 + i * 52; if (y > -30 && y < H + 30) hud += text(l.replace(/^#/, ''), 235, y, l.startsWith('#') ? 26 : 21, { font: l.startsWith('#') ? SERIF : SANS, weight: l.startsWith('#') ? 600 : 700, italic: l.startsWith('#'), fill: l.startsWith('#') ? '#f2e6c8' : '#e8ecf8' }); });
      if (c.quote && age > dur - 9) {
        const qo = clamp((age - (dur - 9)) / 1.5) * clamp((g.end - T) / 0.8);
        hud += `<rect width="${W}" height="${H}" fill="#06080f" opacity="${f1(qo * 0.75)}"/>`;
        const ql = wrap(c.quote, 34, 900, SERIF, 500, true);
        ql.forEach((l, i) => hud += text(l, 640, 330 - (ql.length - 1) * 22 + i * 44, 34, { font: SERIF, weight: 500, italic: true, fill: '#fff8e6', op: qo }));
        hud += text(c.quoteBy || '', 640, 330 + ql.length * 22 + 40, 22, { font: SERIF, fill: '#c8bca8', op: qo });
      }
      hud += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1((1 - fade) * 100) / 100}"/>`;
      LAYERS.mid.innerHTML = mid; LAYERS.hud.innerHTML = hud; return;
    } else {   // plain text card (time skips)
      showLayers(null, null); worldCam(640, 360, 1);
      hud += `<rect width="${W}" height="${H}" fill="#07080e"/>` + text(c.title || '', 640, 340, 38, { font: SERIF, italic: true, fill: '#e8e0cc', op: fade }) + (c.sub ? text(c.sub, 640, 400, 24, { font: SERIF, fill: '#a8a090', op: fade }) : '');
    }
    LAYERS.mid.innerHTML = mid; LAYERS.mid2.innerHTML = ''; LAYERS.hud.innerHTML = hud;
  }

  // ---------- scenes ----------
  function drawScene(g, T) {
    const seg = g.seg, ctx = seg._ctx; seg._g = g;
    let k = 0; for (let i = 0; i < g.lines.length; i++) if (g.lines[i] && T >= g.lines[i].start) k = i;
    const sh = g.lines[k] || { start: g.start, end: g.end };
    const ln = seg.lines[k];
    const shotEnd = (k + 1 < g.lines.length && g.lines[k + 1]) ? g.lines[k + 1].start : g.end;
    const age = T - sh.start, dur = shotEnd - sh.start;
    const shot = autoShot(seg, k);
    let mid = '', mid2 = '', hud = '';
    const fade = Math.min(clamp((T - g.start) / (seg.fadeIn ?? 0.5)), clamp((g.end - T) / (seg.fadeOut ?? 0.5)));
    if (shot.startsWith('insert') || ln.insert) {
      showLayers(null, null); worldCam(640, 360, 1);
      hud += insert(ln.insert || { kind: shot.split(':')[1] }, T, age, dur, ctx);
    } else if (shot === 'sky' || shot === 'ext' || shot.startsWith('ext:')) {
      const set = shot === 'sky' ? 'sky' : 'laundry_ext';
      useSet(set, ctx);
      const u = ease(clamp(age / Math.max(dur, 0.1)));
      const extCams = { ext: [lerp(600, 680, u), 380, lerp(1.0, 1.06, u)], 'ext:bench': [960, 450, lerp(1.9, 2.0, u)], 'ext:sign': [420, 340, lerp(1.8, 1.9, u)] };
      const [cx, cy, z] = set === 'sky' ? [640, lerp(330, 300, u), 1.2] : (extCams[shot] || extCams.ext);
      worldCam(cx, cy, z);
      mid += SETS[set].dyn(ctx, T);
      if (set === 'laundry_ext' && seg.set === 'laundry_ext') mid += drawCast(seg, k, T, ctx, SETS[set].slots(ctx), SETS[set].light(ctx));
      if (set === 'laundry_ext' && seg.extCast) {   // the two of them seen through the window, tiny
        const fake = Object.assign({}, seg, { set: 'laundry_ext' });
        mid += drawCast(fake, k, T, ctx, { benchL: { x: 380, y: 560, s: 0.32, pose: 'sit' }, benchR: { x: 470, y: 560, s: 0.32, pose: 'sit' } }, { amb: '#e8ffe0', amt: 0.2 });
      }
    } else {
      const S = SETS[seg.set];
      useSet(seg.set, ctx);
      const slots = S.slots(ctx);
      const cam = shotCam(seg, k, shot, slots, seg._states[k], age, dur);
      worldCam(cam.cx, cam.cy, cam.z);
      mid += S.dyn ? S.dyn(ctx, T) : '';
      mid += drawCast(seg, k, T, ctx, slots, S.light(ctx));
      mid2 += S.dynFront ? S.dynFront(ctx, T) : '';
      if (seg.set === 'laundry_int' && seg.vignette !== false) hud += window.AnimeSets.erad(640, 360, 900, 560, '#000', 0) ;
    }
    // shared mood overlays
    if (seg.tint) hud += `<rect width="${W}" height="${H}" fill="${seg.tint}" opacity="${seg.tintOp || 0.15}" style="mix-blend-mode:multiply"/>`;
    if (seg.memory) hud += `<rect width="${W}" height="${H}" fill="#f2d8a0" opacity="0.18"/>` + window.AnimeSets.erad(640, 360, 760, 480, '#000', 0) + `<rect width="${W}" height="${H}" fill="none" stroke="#fff4dc" stroke-width="60" opacity="0.25"/>`;
    hud += vignette(seg.set === 'laundry_int' ? 0.28 : 0.45);
    if (seg.style === 'next') {
      hud += text('Next time', 640, 110, 28, { font: SERIF, italic: true, fill: '#e8dcc8' }) + text(seg.nextTitle || '', 640, 300, 60, { font: SERIF, weight: 500, fill: '#fff8e6', stroke: '#141030', sw: 6 }) + text(seg.nextSub || '', 640, 384, 26, { font: SERIF, italic: true, fill: '#e8dcc8' });
    }
    if (seg.caption) hud += text(seg.caption, 60, 60, 22, { font: SERIF, italic: true, anchor: 'start', fill: '#fff8e6', stroke: '#141018', sw: 5, op: clamp((T - g.start - 0.6) / 0.8) * clamp((g.start + 6 - T) / 0.8) });
    hud += caption(seg, k, T, sh);
    hud += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1((1 - fade) * 100) / 100}"/>`;
    LAYERS.mid.innerHTML = mid; LAYERS.mid2.innerHTML = mid2; LAYERS.hud.innerHTML = hud;
  }
  function vignette(op) { const id = nid('vg'); return `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${op}"/></radialGradient><rect width="${W}" height="${H}" fill="url(#${id})"/>`; }

  function renderAt(T) {
    if (!SEGS.length) return;
    uid = 0; CH.setUid(0); window.AnimeSets.resetIds();
    let g = SEGS[0];
    for (const x of SEGS) if (T >= x.start) g = x;
    if (g.seg.type === 'card') drawCard(g, T); else drawScene(g, T);
  }

  window.Toon = { load, renderAt, get duration() { return TL ? TL.duration : 0; } };
})();
