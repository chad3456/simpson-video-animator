/* Cel-shaded anime characters for the anime engine, drawn procedurally as SVG.
   AnimeChars.draw(designId, st, T) -> svg string in local space.
     origin: the hips on the seat for pose "sit", the feet for "stand"/"walk"
     st: {pose, season, emo, tu (head turn -1..1), gx, gy (gaze), tilt (deg), lean (deg), talk 0..1, blink 0..1,
          act, actP 0..1, prop, prop2, cc (colour grading fn), lx (light side -1..1), seed}
   Warm brown line art, two-tone cel shading with lilac shadows, Ghibli-like proportions. */
(function () {
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const f1 = v => Math.round(v * 10) / 10;
  const rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, c => c + c); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const hex = a => '#' + a.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, p) => { const x = rgb(a), y = rgb(b); return hex(x.map((v, i) => lerp(v, y[i], p))); };
  let uid = 0; const nid = p => 'c' + p + (uid++);
  const SH = '#4a3a6a';                    // shadow hue
  const shadeOf = c => mix(c, SH, 0.3);
  const LINE = '#3a2622';

  // ---------- designs ----------
  const D = {
    itsuki: { H: 410, r: 27, skin: '#f2d5bf', hair: '#262838', hairHi: '#4a5272', hairStyle: 'messy', eye: 'narrow', iris: '#2a2630', glasses: true, shoulders: 12.6, hips: 10.4,
      outfit: { summer: { top: '#f4f2ec', bottom: '#4a4e5c', shoes: '#3a302c', rolled: true },
                autumn: { top: '#f1efe8', outer: '#8d8c86', outerType: 'cardigan', bottom: '#3d4150', shoes: '#3a302c' },
                winter: { top: '#f1efe8', outer: '#2e3752', outerType: 'coat', scarf: '#7c2b36', bottom: '#33363f', shoes: '#2a2422' },
                spring: { top: '#f1efe8', outer: '#a49f8c', outerType: 'jacket', bottom: '#3d4150', shoes: '#3a302c' } } },
    mio: { H: 350, r: 27.5, skin: '#f8dbc6', hair: '#7a4630', hairHi: '#b57452', hairStyle: 'bob', eye: 'big', iris: '#6a3a24', clip: '#f5c542', shoulders: 10.4, hips: 10.2,
      outfit: { summer: { top: '#fbfaf4', bottom: '#4f6d94', skirt: true, legs: 'skin', socks: '#ffffff', shoes: '#d9534f', tee: true },
                autumn: { top: '#e2a83a', outerType: 'hoodie', outer: '#e2a83a', bottom: '#3e4a66', skirt: true, legs: 'skin', socks: '#2a2a33', shoes: '#6a4a3a' },
                winter: { top: '#f2efe6', outer: '#b8323a', outerType: 'duffle', scarf: '#f2efe6', bottom: '#3e4a66', skirt: true, legs: '#2b2b36', shoes: '#5a3a2a' },
                spring: { top: '#f6f3ea', outer: '#e6d6ae', outerType: 'jacket', bottom: '#5a6e8a', skirt: true, legs: 'skin', socks: '#ffffff', shoes: '#c9504a' } } },
    hoshino: { H: 330, r: 27, skin: '#efd2bc', hair: '#c9c6c2', hairHi: '#eeece8', hairStyle: 'bun', eye: 'old', iris: '#3a3030', glasses: 'half', age: 1, shoulders: 11, hips: 11.5,
      outfit: { any: { top: '#7a8aa0', outer: '#5a6a5a', outerType: 'apron', bottom: '#4a4a52', shoes: '#3a302c' } } },
    fumiko: { H: 335, r: 27, skin: '#f0d4c0', hair: '#9a8f88', hairHi: '#c8bfb8', hairStyle: 'curly', eye: 'old', iris: '#3a3030', age: 0.8, shoulders: 11, hips: 11,
      outfit: { any: { top: '#f2e8e0', outer: '#d89aa8', outerType: 'cardigan', bottom: '#6a6070', shoes: '#c8b8a8', blanket: '#a8b890' } } },
    salaryman: { H: 400, r: 27, skin: '#f0cdb4', hair: '#1e1e26', hairHi: '#3a3a4a', hairStyle: 'short', eye: 'narrow', iris: '#2a2420', flush: 0.7, shoulders: 13, hips: 11,
      outfit: { any: { top: '#f0f0ea', outer: '#2c3346', outerType: 'jacket', tie: '#a03030', bottom: '#2c3346', shoes: '#1e1e1e' } } },
    genzo: { H: 360, r: 27, skin: '#ecd0b8', hair: '#e8e6e2', hairHi: '#ffffff', hairStyle: 'bald', eye: 'old', iris: '#3a3030', glasses: true, age: 1, beard: '#e0ddd8', shoulders: 11.5, hips: 11,
      outfit: { any: { top: '#e8e4d8', outer: '#6a5a4a', outerType: 'cardigan', bottom: '#4a4a52', shoes: '#3a302c' } } },
  };

  // ---------- expressions ----------
  // brow: raise (-1 angry .. 1 up); bw: worried (inner ends up); bt: tease (one brow up)
  const EMO = {
    neutral: { brow: 0.05, lid: 0.08, mouth: 'line', curve: 0.08 },
    smile: { brow: 0.15, lid: 0.18, mouth: 'smile', curve: 0.5 },
    soft: { brow: 0.1, bw: 0.35, lid: 0.38, mouth: 'smile', curve: 0.35, blush: 0.25 },
    grin: { brow: 0.35, eye: 'happy', mouth: 'grin', curve: 0.8 },
    laugh: { brow: 0.4, eye: 'happy', mouth: 'open', curve: 0.7, openMin: 0.55 },
    tease: { brow: 0.2, bt: 0.8, lid: 0.3, mouth: 'smirk', curve: 0.5 },
    blush: { brow: 0.1, bw: 0.7, lid: 0.15, mouth: 'wavy', blush: 1, sweat: 0 },
    flustered: { brow: 0.3, bw: 0.8, eye: 'dots', mouth: 'wavy', blush: 1, sweat: 1 },
    shy: { brow: 0, bw: 0.5, lid: 0.35, mouth: 'line', curve: 0.15, blush: 0.6 },
    worried: { brow: 0.2, bw: 0.85, lid: 0.08, mouth: 'line', curve: -0.15 },
    sad: { brow: 0, bw: 0.9, lid: 0.35, mouth: 'frown', curve: -0.35 },
    teary: { brow: 0, bw: 1, lid: 0.3, mouth: 'frown', curve: -0.25, tears: 0.5, shine: 1 },
    cry: { brow: 0, bw: 1, eye: 'shut', mouth: 'open', curve: -0.4, tears: 1, openMin: 0.3 },
    surprised: { brow: 0.8, eye: 'wide', mouth: 'o', lid: 0 },
    thinking: { brow: 0.2, bt: 0.6, lid: 0.25, mouth: 'line', curve: -0.05 },
    serious: { brow: -0.25, lid: 0.25, mouth: 'line', curve: -0.05 },
    annoyed: { brow: -0.45, lid: 0.45, mouth: 'line', curve: -0.2 },
    pout: { brow: -0.3, lid: 0.2, mouth: 'pout', blush: 0.4 },
    sleepy: { brow: 0, lid: 0.62, mouth: 'line', curve: 0.1 },
    glint: { brow: 0, lid: 0.1, mouth: 'line', curve: 0.0, glint: 1 },
    warm: { brow: 0.1, bw: 0.25, eye: 'happy', mouth: 'smile', curve: 0.45, blush: 0.2 },
  };

  // ---------- primitives ----------
  function cel(d, base, o = {}) {
    const lx = o.lx ?? -0.4, k = o.k ?? 6, c = nid('k');
    const lw = o.lw ?? 1.6;
    return `<clipPath id="${c}"><path d="${d}"/></clipPath><path d="${d}" fill="${o.shadow || shadeOf(base)}"/>` +
      `<g clip-path="url(#${c})"><path d="${d}" fill="${base}" transform="translate(${f1(-lx * k)} ${f1(-k * 0.55)})"/></g>` +
      (lw ? `<path d="${d}" fill="none" stroke="${o.line || LINE}" stroke-width="${lw}" stroke-linejoin="round"/>` : '');
  }
  function limb(pts, w, color, cc, o = {}) {   // a sleeve or leg: thick stroke with a darker outline
    const d = 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(o.curve ? ' ' : 'L');
    const path = o.curve ? `M${f1(pts[0][0])} ${f1(pts[0][1])}Q${f1(pts[1][0])} ${f1(pts[1][1])} ${f1(pts[2][0])} ${f1(pts[2][1])}` : d;
    return `<path d="${path}" fill="none" stroke="${LINE}" stroke-width="${f1(w + 3)}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${path}" fill="none" stroke="${cc(shadeOf(color))}" stroke-width="${f1(w)}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${path}" fill="none" stroke="${cc(color)}" stroke-width="${f1(w * 0.62)}" stroke-linecap="round" stroke-linejoin="round" transform="translate(${f1(-w * 0.12)} ${f1(-w * 0.1)})"/>`;
  }
  const ellD = (cx, cy, rx, ry) => `M${f1(cx - rx)} ${f1(cy)}a${f1(rx)} ${f1(ry)} 0 1 0 ${f1(2 * rx)} 0a${f1(rx)} ${f1(ry)} 0 1 0 ${f1(-2 * rx)} 0Z`;
  function hand(x, y, r, cc, skin) { return `<path d="${ellD(x, y, r * 1.05, r)}" fill="${cc(skin)}" stroke="${LINE}" stroke-width="1.3"/><path d="M${f1(x - r * 0.5)} ${f1(y + r * 0.2)}q${f1(r * 0.5)} ${f1(r * 0.4)} ${f1(r)} 0" stroke="${cc(shadeOf(skin))}" fill="none" stroke-width="1"/>`; }

  // ---------- face ----------
  function eye(cx, cy, w, h, st, side, dz, cc) {
    const e = st.e, lid = clamp(Math.max(e.lid || 0, st.blink)), kind = e.eye || 'open';
    let s = '';
    if (kind === 'happy' || (kind === 'shut')) {
      const up = kind === 'happy' ? -1 : 0.6;
      return `<path d="M${f1(cx - w)} ${f1(cy + h * 0.2)}Q${f1(cx)} ${f1(cy + h * 0.2 + up * h * 0.9)} ${f1(cx + w)} ${f1(cy + h * 0.2)}" stroke="${LINE}" stroke-width="${f1(w * 0.32)}" fill="none" stroke-linecap="round"/>`;
    }
    if (lid > 0.92) return `<path d="M${f1(cx - w)} ${f1(cy + h * 0.15)}Q${f1(cx)} ${f1(cy + h * 0.55)} ${f1(cx + w)} ${f1(cy + h * 0.1)}" stroke="${LINE}" stroke-width="${f1(w * 0.28)}" fill="none" stroke-linecap="round"/>`;
    const id = nid('e');
    const ew = kind === 'wide' ? w * 1.1 : w, eh = kind === 'wide' ? h * 1.15 : h;
    const white = ellD(cx, cy, ew, eh);
    s += `<clipPath id="${id}"><path d="${white}"/></clipPath><path d="${white}" fill="#fffdf6"/>`;
    const gx = st.gx * ew * 0.38, gy = st.gy * eh * 0.28;
    const ir = kind === 'dots' ? 0.25 : kind === 'wide' ? 0.55 : 0.78;
    s += `<g clip-path="url(#${id})"><ellipse cx="${f1(cx + gx)}" cy="${f1(cy + gy + eh * 0.08)}" rx="${f1(ew * ir)}" ry="${f1(eh * Math.min(0.92, ir * 1.15))}" fill="${cc(st.d.iris)}"/>` +
      (kind !== 'dots' ? `<ellipse cx="${f1(cx + gx)}" cy="${f1(cy + gy + eh * 0.32)}" rx="${f1(ew * ir * 0.7)}" ry="${f1(eh * 0.35)}" fill="${mix(st.d.iris, '#d9a070', 0.35)}" opacity="0.7"/>` +
        `<ellipse cx="${f1(cx + gx)}" cy="${f1(cy + gy + eh * 0.05)}" rx="${f1(ew * ir * 0.48)}" ry="${f1(eh * 0.5)}" fill="#120c10"/>` : '') +
      `<circle cx="${f1(cx + gx - ew * 0.28)}" cy="${f1(cy + gy - eh * 0.28)}" r="${f1(ew * (e.shine ? 0.34 : 0.24))}" fill="#fff"/>` +
      `<circle cx="${f1(cx + gx + ew * 0.25)}" cy="${f1(cy + gy + eh * 0.32)}" r="${f1(ew * 0.12)}" fill="#fff" opacity="0.85"/>` +
      (e.shine ? `<ellipse cx="${f1(cx + gx)}" cy="${f1(cy + gy + eh * 0.55)}" rx="${f1(ew * 0.6)}" ry="${f1(eh * 0.18)}" fill="#bfe0ff" opacity="0.6"/>` : '') +
      // eyelid
      (lid > 0.02 ? `<rect x="${f1(cx - ew * 1.2)}" y="${f1(cy - eh * 1.2)}" width="${f1(ew * 2.4)}" height="${f1(eh * 0.2 + eh * 2 * lid)}" fill="${cc(st.d.skin)}"/>` : '') + `</g>`;
    // upper lash line follows the lid
    const ly = cy - eh + eh * 2 * lid * 0.95;
    const outer = side * ew * 1.12, inner = -side * ew * 0.95;
    s += `<path d="M${f1(cx + inner)} ${f1(ly + eh * 0.3)}Q${f1(cx - side * ew * 0.1)} ${f1(ly - eh * 0.3)} ${f1(cx + outer)} ${f1(ly + eh * 0.22)}" stroke="${LINE}" stroke-width="${f1(st.d.eye === 'big' ? w * 0.3 : w * 0.28)}" fill="none" stroke-linecap="round"/>`;
    if (st.d.eye === 'big') s += `<path d="M${f1(cx + outer * 0.95)} ${f1(ly + eh * 0.2)}l${f1(side * ew * 0.2)} ${f1(-eh * 0.1)}" stroke="${LINE}" stroke-width="${f1(w * 0.16)}" stroke-linecap="round"/>`;
    s += `<path d="M${f1(cx - ew * 0.6)} ${f1(cy + eh * 1.02)}Q${f1(cx)} ${f1(cy + eh * 1.15)} ${f1(cx + ew * 0.6)} ${f1(cy + eh * 1.0)}" stroke="${LINE}" stroke-width="0.9" fill="none" opacity="0.55"/>`;
    return s;
  }
  function brow(cx, cy, w, side, st) {
    const e = st.e; let raise = (e.brow || 0) * 0.35 * w * 2;
    if (e.bt && side === 1) raise += e.bt * w * 0.55;
    const inner = -side * w, outer = side * w;
    const iy = cy - raise - (e.bw || 0) * w * 0.55 + Math.max(0, -(e.brow || 0)) * w * 0.4;
    const oy = cy - raise + (e.bw || 0) * w * 0.15 - Math.max(0, -(e.brow || 0)) * w * 0.2;
    return `<path d="M${f1(cx + inner)} ${f1(iy)}Q${f1(cx)} ${f1(Math.min(iy, oy) - w * 0.25)} ${f1(cx + outer)} ${f1(oy)}" stroke="${mix(st.d.hair, LINE, 0.4)}" stroke-width="${f1(w * 0.22)}" fill="none" stroke-linecap="round"/>`;
  }
  function mouth(x, y, w, st, cc) {
    const e = st.e; let kind = e.mouth || 'line';
    const open = Math.max(st.talk, e.openMin && st.talking ? e.openMin * (0.6 + 0.4 * st.talk) : 0, kind === 'grin' ? 0.55 : 0, kind === 'open' ? (e.openMin || 0.4) : 0);
    const cv = e.curve || 0;
    if (open > 0.08 && kind !== 'o' && kind !== 'pout') {
      const h = w * (0.25 + open * 0.85), ww = w * (0.55 + Math.max(0, cv) * 0.35);
      const top = y - h * 0.25 - cv * w * 0.1;
      const d = `M${f1(x - ww)} ${f1(top + cv * w * 0.12)}Q${f1(x)} ${f1(top + w * 0.08 - cv * w * 0.25)} ${f1(x + ww)} ${f1(top + cv * w * 0.12)}Q${f1(x + ww * 0.7)} ${f1(top + h)} ${f1(x)} ${f1(top + h)}Q${f1(x - ww * 0.7)} ${f1(top + h)} ${f1(x - ww)} ${f1(top + cv * w * 0.12)}Z`;
      const id = nid('m');
      return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="#5a2026"/><g clip-path="url(#${id})"><ellipse cx="${f1(x)}" cy="${f1(top + h)}" rx="${f1(ww * 0.7)}" ry="${f1(h * 0.45)}" fill="#d9707a"/>${kind === 'grin' ? `<rect x="${f1(x - ww)}" y="${f1(top - 2)}" width="${f1(ww * 2)}" height="${f1(h * 0.28 + 2)}" fill="#fff"/>` : ''}</g><path d="${d}" fill="none" stroke="${LINE}" stroke-width="1.2" stroke-linejoin="round"/>`;
    }
    if (kind === 'o') return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w * 0.28)}" ry="${f1(w * 0.36)}" fill="#5a2026" stroke="${LINE}" stroke-width="1.1"/>`;
    if (kind === 'wavy') return `<path d="M${f1(x - w * 0.55)} ${f1(y)}q${f1(w * 0.18)} ${f1(-w * 0.2)} ${f1(w * 0.36)} 0t${f1(w * 0.36)} 0t${f1(w * 0.36)} 0" stroke="${LINE}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    if (kind === 'pout') return `<path d="M${f1(x - w * 0.25)} ${f1(y)}q${f1(w * 0.12)} ${f1(-w * 0.18)} ${f1(w * 0.25)} 0q${f1(w * 0.12)} ${f1(-w * 0.18)} ${f1(w * 0.25)} 0" stroke="${LINE}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    if (kind === 'smirk') return `<path d="M${f1(x - w * 0.45)} ${f1(y + w * 0.04)}Q${f1(x + w * 0.05)} ${f1(y + w * 0.12)} ${f1(x + w * 0.5)} ${f1(y - w * 0.18)}" stroke="${LINE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    const ww = w * (kind === 'smile' ? 0.55 : 0.4);
    return `<path d="M${f1(x - ww)} ${f1(y - cv * w * 0.12)}Q${f1(x)} ${f1(y + cv * w * 0.3)} ${f1(x + ww)} ${f1(y - cv * w * 0.12)}" stroke="${LINE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
      (kind === 'smile' && cv > 0.3 ? `<path d="M${f1(x - ww * 0.4)} ${f1(y + cv * w * 0.12)}Q${f1(x)} ${f1(y + cv * w * 0.25)} ${f1(x + ww * 0.4)} ${f1(y + cv * w * 0.12)}" stroke="#c46a6a" stroke-width="1" fill="none" opacity="0.6"/>` : '');
  }

  // ---------- hair ----------
  function hairBack(st, r, tu, cc, T) {
    const d = st.d, col = cc(d.hair), sx = -tu * r * 0.12;
    switch (d.hairStyle) {
      case 'messy': {
        const p = `M${f1(sx - r * 1.12)} ${f1(r * 0.1)}C${f1(sx - r * 1.3)} ${f1(-r * 1.0)} ${f1(sx - r * 0.6)} ${f1(-r * 1.38)} ${f1(sx)} ${f1(-r * 1.32)}C${f1(sx + r * 0.7)} ${f1(-r * 1.4)} ${f1(sx + r * 1.32)} ${f1(-r * 0.95)} ${f1(sx + r * 1.12)} ${f1(r * 0.1)}L${f1(sx + r * 1.02)} ${f1(r * 0.55)}L${f1(sx + r * 0.8)} ${f1(r * 0.25)}L${f1(sx + r * 0.7)} ${f1(r * 0.62)}L${f1(sx - r * 0.7)} ${f1(r * 0.62)}L${f1(sx - r * 0.8)} ${f1(r * 0.25)}L${f1(sx - r * 1.02)} ${f1(r * 0.55)}Z`;
        return cel(p, col, { lx: st.lx, k: 5 });
      }
      case 'bob': {
        const sw = Math.sin(T * 1.1 + st.seed) * r * 0.03;
        const p = `M${f1(sx - r * 1.16)} ${f1(r * 0.2)}C${f1(sx - r * 1.32)} ${f1(-r * 0.9)} ${f1(sx - r * 0.7)} ${f1(-r * 1.38)} ${f1(sx)} ${f1(-r * 1.34)}C${f1(sx + r * 0.75)} ${f1(-r * 1.38)} ${f1(sx + r * 1.34)} ${f1(-r * 0.9)} ${f1(sx + r * 1.18)} ${f1(r * 0.2)}` +
          `C${f1(sx + r * 1.2 + sw)} ${f1(r * 0.6)} ${f1(sx + r * 1.28 + sw)} ${f1(r * 0.9)} ${f1(sx + r * 1.08 + sw)} ${f1(r * 1.02)}L${f1(sx + r * 0.6)} ${f1(r * 0.96)}L${f1(sx - r * 0.6)} ${f1(r * 0.96)}L${f1(sx - r * 1.08 + sw)} ${f1(r * 1.02)}C${f1(sx - r * 1.28 + sw)} ${f1(r * 0.9)} ${f1(sx - r * 1.2 + sw)} ${f1(r * 0.6)} ${f1(sx - r * 1.16)} ${f1(r * 0.2)}Z`;
        return cel(p, col, { lx: st.lx, k: 5 });
      }
      case 'bun': return cel(ellD(sx, -r * 0.3, r * 1.1, r * 1.02), col, { lx: st.lx, k: 4 }) + cel(ellD(sx * 2, -r * 1.25, r * 0.5, r * 0.42), col, { lx: st.lx, k: 4 });
      case 'curly': { let s = ''; for (let i = 0; i < 11; i++) { const a = Math.PI * (0.95 + i * 0.11); s += cel(ellD(sx + Math.cos(a) * r * 1.0, -r * 0.25 + Math.sin(a) * r * 0.95, r * 0.36, r * 0.34), col, { lx: st.lx, k: 3, lw: 1.2 }); } return cel(ellD(sx, -r * 0.35, r * 1.1, r * 1.0), col, { lx: st.lx, k: 4 }) + s; }
      case 'short': return cel(ellD(sx, -r * 0.35, r * 1.08, r * 1.02), col, { lx: st.lx, k: 4 });
      case 'bald': return cel(`M${f1(sx - r * 1.05)} ${f1(-r * 0.1)}q${f1(-r * 0.15)} ${f1(r * 0.4)} ${f1(r * 0.1)} ${f1(r * 0.6)}l${f1(r * 0.15)} ${f1(-r * 0.6)}Z`, col, { lw: 1 }) + cel(`M${f1(sx + r * 1.05)} ${f1(-r * 0.1)}q${f1(r * 0.15)} ${f1(r * 0.4)} ${f1(-r * 0.1)} ${f1(r * 0.6)}l${f1(-r * 0.15)} ${f1(-r * 0.6)}Z`, col, { lw: 1 });
    }
    return '';
  }
  function hairFront(st, r, tu, cc, T) {
    const d = st.d, col = cc(d.hair), hi = cc(d.hairHi), sx = tu * r * 0.22;
    let s = '';
    switch (d.hairStyle) {
      case 'messy': {
        // cap over the skull then a jagged fringe falling to the brows
        const tips = [[-1.08, 0.18], [-0.82, 0.02], [-0.55, 0.22], [-0.28, 0.0], [0.0, 0.2], [0.27, -0.05], [0.52, 0.16], [0.8, 0.0], [1.08, 0.2]];
        let p = `M${f1(sx - r * 1.14)} ${f1(r * 0.25)}C${f1(sx - r * 1.25)} ${f1(-r * 0.9)} ${f1(sx - r * 0.55)} ${f1(-r * 1.36)} ${f1(sx + r * 0.1)} ${f1(-r * 1.3)}C${f1(sx + r * 0.8)} ${f1(-r * 1.28)} ${f1(sx + r * 1.28)} ${f1(-r * 0.85)} ${f1(sx + r * 1.14)} ${f1(r * 0.25)}`;
        for (let i = tips.length - 1; i >= 0; i--) {
          const [tx, ty] = tips[i], nx = i > 0 ? (tips[i][0] + tips[i - 1][0]) / 2 : tx - 0.1;
          p += `L${f1(sx * 1.1 + tx * r)} ${f1(ty * r)}L${f1(sx * 1.1 + nx * r)} ${f1(-r * 0.42 + Math.abs(nx) * r * 0.25)}`;
        }
        p += 'Z';
        s += cel(p, col, { lx: st.lx, k: 5 });
        s += `<path d="M${f1(sx - r * 0.75)} ${f1(-r * 0.95)}Q${f1(sx)} ${f1(-r * 1.12)} ${f1(sx + r * 0.75)} ${f1(-r * 0.92)}" stroke="${hi}" stroke-width="${f1(r * 0.12)}" fill="none" stroke-linecap="round" opacity="0.8" stroke-dasharray="${f1(r * 0.3)} ${f1(r * 0.12)}"/>`;
        return s;
      }
      case 'bob': {
        const sw = Math.sin(T * 1.1 + st.seed) * r * 0.025;
        let p = `M${f1(sx - r * 1.18)} ${f1(r * 0.3)}C${f1(sx - r * 1.28)} ${f1(-r * 0.9)} ${f1(sx - r * 0.6)} ${f1(-r * 1.38)} ${f1(sx + r * 0.1)} ${f1(-r * 1.32)}C${f1(sx + r * 0.85)} ${f1(-r * 1.3)} ${f1(sx + r * 1.3)} ${f1(-r * 0.85)} ${f1(sx + r * 1.18)} ${f1(r * 0.3)}`;
        // side-swept fringe: long on the right, short on the left
        p += `C${f1(sx + r * 1.0)} ${f1(-r * 0.1)} ${f1(sx + r * 0.75)} ${f1(-r * 0.05)} ${f1(sx + r * 0.62)} ${f1(r * 0.05)}`;
        p += `C${f1(sx + r * 0.45)} ${f1(-r * 0.3)} ${f1(sx + r * 0.15)} ${f1(-r * 0.3)} ${f1(sx - r * 0.05)} ${f1(-r * 0.12)}`;
        p += `C${f1(sx - r * 0.2)} ${f1(-r * 0.42)} ${f1(sx - r * 0.55)} ${f1(-r * 0.5)} ${f1(sx - r * 0.72)} ${f1(-r * 0.28)}`;
        p += `C${f1(sx - r * 0.9)} ${f1(-r * 0.35)} ${f1(sx - r * 1.05)} ${f1(-r * 0.1)} ${f1(sx - r * 1.18)} ${f1(r * 0.3)}Z`;
        s += cel(p, col, { lx: st.lx, k: 5 });
        // locks framing the cheeks
        for (const side of [-1, 1]) {
          const bx = sx * 0.6 + side * r * 1.02;
          s += cel(`M${f1(bx - side * r * 0.12)} ${f1(-r * 0.2)}C${f1(bx + side * r * 0.1)} ${f1(r * 0.3)} ${f1(bx + side * r * 0.05 + sw)} ${f1(r * 0.75)} ${f1(bx - side * r * 0.12 + sw)} ${f1(r * 1.0)}C${f1(bx - side * r * 0.2)} ${f1(r * 0.7)} ${f1(bx - side * r * 0.3)} ${f1(r * 0.3)} ${f1(bx - side * r * 0.32)} ${f1(-r * 0.1)}Z`, col, { lx: st.lx, k: 3, lw: 1.3 });
        }
        s += `<path d="M${f1(sx - r * 0.8)} ${f1(-r * 0.92)}Q${f1(sx)} ${f1(-r * 1.15)} ${f1(sx + r * 0.8)} ${f1(-r * 0.9)}" stroke="${hi}" stroke-width="${f1(r * 0.13)}" fill="none" stroke-linecap="round" opacity="0.75" stroke-dasharray="${f1(r * 0.35)} ${f1(r * 0.1)}"/>`;
        // grandfather's star clip
        if (d.clip) { const cx = sx + r * 0.72, cy = -r * 0.5, R = r * 0.17; let sp = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.45 : R; sp += (i ? 'L' : 'M') + f1(cx + Math.cos(a) * rr) + ' ' + f1(cy + Math.sin(a) * rr); } s += `<path d="${sp}Z" fill="${cc(d.clip)}" stroke="${LINE}" stroke-width="1.1" stroke-linejoin="round"/>`; }
        return s;
      }
      case 'bun': return cel(`M${f1(sx - r * 1.1)} ${f1(r * 0.05)}C${f1(sx - r * 1.15)} ${f1(-r * 1.05)} ${f1(sx + r * 1.15)} ${f1(-r * 1.05)} ${f1(sx + r * 1.1)} ${f1(r * 0.05)}C${f1(sx + r * 0.7)} ${f1(-r * 0.55)} ${f1(sx + r * 0.2)} ${f1(-r * 0.62)} ${f1(sx)} ${f1(-r * 0.55)}C${f1(sx - r * 0.2)} ${f1(-r * 0.62)} ${f1(sx - r * 0.7)} ${f1(-r * 0.55)} ${f1(sx - r * 1.1)} ${f1(r * 0.05)}Z`, col, { lx: st.lx, k: 4 }) + `<path d="M${f1(sx - r * 0.6)} ${f1(-r * 0.85)}Q${f1(sx)} ${f1(-r * 1.0)} ${f1(sx + r * 0.6)} ${f1(-r * 0.85)}" stroke="${hi}" stroke-width="2" fill="none" opacity="0.7"/>`;
      case 'curly': { let p = ''; for (let i = 0; i < 7; i++) p += cel(ellD(sx + (i - 3) * r * 0.3, -r * 0.62 - Math.cos((i - 3) / 3) * r * 0.25, r * 0.28, r * 0.24), col, { lx: st.lx, k: 3, lw: 1.1 }); return p; }
      case 'short': return cel(`M${f1(sx - r * 1.08)} ${f1(-r * 0.05)}C${f1(sx - r * 1.1)} ${f1(-r * 1.15)} ${f1(sx + r * 1.1)} ${f1(-r * 1.15)} ${f1(sx + r * 1.08)} ${f1(-r * 0.05)}C${f1(sx + r * 0.9)} ${f1(-r * 0.5)} ${f1(sx + r * 0.2)} ${f1(-r * 0.62)} ${f1(sx - r * 0.3)} ${f1(-r * 0.45)}C${f1(sx - r * 0.6)} ${f1(-r * 0.6)} ${f1(sx - r * 0.9)} ${f1(-r * 0.45)} ${f1(sx - r * 1.08)} ${f1(-r * 0.05)}Z`, col, { lx: st.lx, k: 4 });
      case 'bald': return `<ellipse cx="${f1(sx - r * 0.3)}" cy="${f1(-r * 0.85)}" rx="${f1(r * 0.3)}" ry="${f1(r * 0.12)}" fill="#fff" opacity="0.35"/>`;
    }
    return s;
  }

  function head(st, T, cc) {
    const d = st.d, r = d.r, tu = st.tu, e = st.e;
    let s = '';
    s += hairBack(st, r, tu, cc, T);
    // ears
    for (const side of [-1, 1]) {
      const vis = clamp(0.6 - side * tu * 0.8, 0.15, 1);
      const ex = side * r * (0.98 - Math.max(0, side * tu) * 0.12) + tu * r * 0.05;
      s += `<path d="${ellD(ex, r * 0.22, r * 0.17 * vis, r * 0.26)}" fill="${cc(d.skin)}" stroke="${LINE}" stroke-width="1.2"/>`;
    }
    // face shape: soft jaw, chin follows the turn
    const L = -r * (1 - Math.max(0, -tu) * 0.1), R = r * (1 - Math.max(0, tu) * 0.1), cx = tu * r * 0.22;
    const chin = d.age ? 1.02 : d.eye === 'big' ? 1.0 : 1.06;
    const face = `M${f1(L)} ${f1(-r * 0.35)}C${f1(L - r * 0.02)} ${f1(r * 0.35)} ${f1(cx - r * 0.55)} ${f1(r * 0.92)} ${f1(cx)} ${f1(r * chin)}C${f1(cx + r * 0.55)} ${f1(r * 0.92)} ${f1(R + r * 0.02)} ${f1(r * 0.35)} ${f1(R)} ${f1(-r * 0.35)}C${f1(R)} ${f1(-r * 1.25)} ${f1(L)} ${f1(-r * 1.25)} ${f1(L)} ${f1(-r * 0.35)}Z`;
    s += cel(face, cc(d.skin), { lx: st.lx, k: 4, shadow: cc(mix(d.skin, '#c88a8a', 0.4)) });
    // shadow of the fringe on the forehead
    const fid = nid('f');
    s += `<clipPath id="${fid}"><path d="${face}"/></clipPath><g clip-path="url(#${fid})"><path d="M${f1(-r * 1.2)} ${f1(-r * 1.4)}H${f1(r * 1.2)}V${f1(d.hairStyle === 'bob' ? r * 0.02 : d.hairStyle === 'messy' ? r * 0.32 : -r * 0.3)}Q0 ${f1(-r * 0.1)} ${f1(-r * 1.2)} ${f1(d.hairStyle === 'bob' ? -r * 0.05 : r * 0.2)}Z" fill="${cc(mix(d.skin, '#b07a8a', 0.35))}" opacity="0.6"/></g>`;
    // blush
    const blush = Math.max(e.blush || 0, d.flush || 0, st.blushX || 0);
    if (blush > 0.02) for (const side of [-1, 1]) {
      const bx = side * r * 0.55 + tu * r * 0.18;
      s += `<ellipse cx="${f1(bx)}" cy="${f1(r * 0.5)}" rx="${f1(r * 0.26)}" ry="${f1(r * 0.12)}" fill="#ff7f8f" opacity="${f1(0.18 + 0.32 * blush)}"/>`;
      if (blush > 0.6) for (let k = 0; k < 3; k++) s += `<path d="M${f1(bx - r * 0.14 + k * r * 0.1)} ${f1(r * 0.56)}l${f1(r * 0.06)} ${f1(-r * 0.12)}" stroke="#e05a6a" stroke-width="1.1" opacity="0.7"/>`;
    }
    // age lines
    if (d.age) { for (const side of [-1, 1]) s += `<path d="M${f1(side * r * 0.32 + cx * 0.8)} ${f1(r * 0.45)}q${f1(side * r * 0.08)} ${f1(r * 0.2)} ${f1(side * r * 0.02)} ${f1(r * 0.35)}" stroke="${cc(mix(d.skin, '#8a5a4a', 0.5))}" stroke-width="1" fill="none"/><path d="M${f1(side * r * 0.62 + cx)} ${f1(r * 0.28)}q${f1(-side * r * 0.12)} ${f1(r * 0.08)} ${f1(-side * r * 0.24)} 0" stroke="${cc(mix(d.skin, '#8a5a4a', 0.5))}" stroke-width="0.9" fill="none"/>`; }
    // eyes
    const ew = d.eye === 'big' ? r * 0.21 : d.eye === 'old' ? r * 0.15 : r * 0.17;
    const eh = d.eye === 'big' ? r * 0.32 : d.eye === 'old' ? r * 0.13 : r * 0.2;
    const ey = d.eye === 'big' ? r * 0.18 : r * 0.14;
    for (const side of [-1, 1]) {
      const far = side * tu > 0 ? 1 - Math.abs(tu) * 0.3 : 1;
      const ex = side * r * 0.42 * (1 - Math.abs(tu) * 0.12) + tu * r * 0.26;
      s += eye(ex, ey, ew * far, eh, st, side, 0, cc);
      s += brow(ex, ey - eh - r * 0.2 - (d.hairStyle === 'messy' ? 0 : 0), ew * 1.15 * far, side, st);
    }
    // tears
    if (e.tears) for (const side of [-1, 1]) {
      const ex = side * r * 0.42 + tu * r * 0.26, ty = ey + eh * 0.9;
      if (e.tears >= 1) { const fl = (T * 0.8 + side) % 1; s += `<path d="M${f1(ex)} ${f1(ty)}q${f1(-r * 0.08)} ${f1(r * 0.35)} ${f1(-r * 0.02)} ${f1(r * 0.7)}" stroke="#a8d4ff" stroke-width="${f1(r * 0.09)}" fill="none" opacity="0.85" stroke-linecap="round"/><circle cx="${f1(ex - r * 0.02)}" cy="${f1(ty + r * 0.7 + fl * r * 0.3)}" r="${f1(r * 0.06)}" fill="#cfe8ff"/>`; }
      else s += `<path d="M${f1(ex + side * ew * 0.5)} ${f1(ty)}q${f1(side * r * 0.06)} ${f1(r * 0.12)} 0 ${f1(r * 0.16)}q${f1(-side * r * 0.06)} ${f1(-r * 0.04)} 0 ${f1(-r * 0.16)}Z" fill="#cfe8ff" stroke="#8ab8e8" stroke-width="0.8"/>`;
    }
    // nose and mouth
    const nx = tu * r * 0.4;
    s += `<path d="M${f1(nx + r * 0.02)} ${f1(r * 0.4)}l${f1(-r * 0.05 - tu * r * 0.04)} ${f1(r * 0.1)}l${f1(r * 0.07)} ${f1(r * 0.02)}" stroke="${cc(mix(d.skin, '#8a4a3a', 0.55))}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    s += mouth(tu * r * 0.3, r * 0.7, r * 0.3, st, cc);
    if (d.beard) s += cel(`M${f1(-r * 0.75 + cx)} ${f1(r * 0.5)}Q${f1(cx)} ${f1(r * 1.55)} ${f1(r * 0.75 + cx)} ${f1(r * 0.5)}Q${f1(cx)} ${f1(r * 0.95)} ${f1(-r * 0.75 + cx)} ${f1(r * 0.5)}Z`, cc(d.beard), { lw: 1 });
    s += hairFront(st, r, tu, cc, T);
    if (e.sweat) s += `<path d="M${f1(r * 0.9 + tu * r * 0.1)} ${f1(-r * 0.5)}q${f1(r * 0.12)} ${f1(r * 0.22)} 0 ${f1(r * 0.3)}q${f1(-r * 0.12)} ${f1(-r * 0.08)} 0 ${f1(-r * 0.3)}Z" fill="#cfe8ff" stroke="#6a9ad0" stroke-width="1"/>`;
    // glasses
    if (d.glasses) {
      const half = d.glasses === 'half';
      for (const side of [-1, 1]) {
        const far = side * tu > 0 ? 1 - Math.abs(tu) * 0.3 : 1;
        const ex = side * r * 0.42 * (1 - Math.abs(tu) * 0.12) + tu * r * 0.26, gw = r * 0.3 * far, gh = r * (half ? 0.17 : 0.26), gy = ey + (half ? r * 0.1 : r * 0.02);
        s += `<rect x="${f1(ex - gw)}" y="${f1(gy - gh)}" width="${f1(gw * 2)}" height="${f1(gh * 2)}" rx="${f1(gh * 0.9)}" fill="${e.glint ? '#f4f8ff' : '#dfefff'}" fill-opacity="${e.glint ? 0.92 : 0.08}" stroke="#3a2e2a" stroke-width="1.5"/>`;
        s += `<path d="M${f1(ex - gw * 0.5)} ${f1(gy - gh * 0.5)}l${f1(gw * 0.5)} ${f1(-gh * 0.3)}" stroke="#fff" stroke-width="${e.glint ? 3 : 1.4}" opacity="0.8" stroke-linecap="round"/>`;
      }
      const lx = -r * 0.42 * (1 - Math.abs(tu) * 0.12) + tu * r * 0.26 + r * 0.3, rx = r * 0.42 * (1 - Math.abs(tu) * 0.12) + tu * r * 0.26 - r * 0.3;
      s += `<path d="M${f1(lx)} ${f1(ey)}Q${f1((lx + rx) / 2)} ${f1(ey - r * 0.08)} ${f1(rx)} ${f1(ey)}" stroke="#3a2e2a" stroke-width="1.4" fill="none"/>`;
    }
    return s;
  }

  // ---------- props ----------
  const BOOKS = { default: '#7a2e2a' };
  function book(cx, cy, w, h, color, open, cc, tilt = 0) {
    if (open) {
      return `<g transform="rotate(${tilt} ${cx} ${cy})"><path d="M${f1(cx - w)} ${f1(cy - h * 0.5)}L${f1(cx)} ${f1(cy - h * 0.42)}L${f1(cx + w)} ${f1(cy - h * 0.5)}L${f1(cx + w * 1.04)} ${f1(cy + h * 0.55)}L${f1(cx)} ${f1(cy + h * 0.5)}L${f1(cx - w * 1.04)} ${f1(cy + h * 0.55)}Z" fill="${cc(color)}" stroke="${LINE}" stroke-width="1.3"/>` +
        `<path d="M${f1(cx - w * 0.95)} ${f1(cy - h * 0.55)}Q${f1(cx - w * 0.5)} ${f1(cy - h * 0.62)} ${f1(cx)} ${f1(cy - h * 0.45)}Q${f1(cx + w * 0.5)} ${f1(cy - h * 0.62)} ${f1(cx + w * 0.95)} ${f1(cy - h * 0.55)}L${f1(cx + w * 0.98)} ${f1(cy + h * 0.45)}Q${f1(cx + w * 0.5)} ${f1(cy + h * 0.38)} ${f1(cx)} ${f1(cy + h * 0.46)}Q${f1(cx - w * 0.5)} ${f1(cy + h * 0.38)} ${f1(cx - w * 0.98)} ${f1(cy + h * 0.45)}Z" fill="${cc('#f6efdc')}" stroke="${LINE}" stroke-width="1.1"/>` +
        Array.from({ length: 4 }, (_, i) => `<path d="M${f1(cx - w * 0.8)} ${f1(cy - h * 0.3 + i * h * 0.18)}h${f1(w * 0.6)}M${f1(cx + w * 0.2)} ${f1(cy - h * 0.3 + i * h * 0.18)}h${f1(w * 0.6)}" stroke="${cc('#b8ad94')}" stroke-width="1"/>`).join('') +
        `<path d="M${f1(cx)} ${f1(cy - h * 0.45)}V${f1(cy + h * 0.46)}" stroke="${cc('#c8bda4')}" stroke-width="1"/></g>`;
    }
    return `<g transform="rotate(${tilt} ${cx} ${cy})"><rect x="${f1(cx - w / 2)}" y="${f1(cy - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="2" fill="${cc(color)}" stroke="${LINE}" stroke-width="1.3"/><rect x="${f1(cx - w / 2 + 2)}" y="${f1(cy - h / 2)}" width="3" height="${f1(h)}" fill="${cc(mix(color, '#000', 0.25))}"/>` +
      `<rect x="${f1(cx - w * 0.3)}" y="${f1(cy - h * 0.3)}" width="${f1(w * 0.6)}" height="${f1(h * 0.08)}" fill="${cc('#e8d8a0')}" opacity="0.8"/><rect x="${f1(cx - w * 0.22)}" y="${f1(cy - h * 0.16)}" width="${f1(w * 0.44)}" height="${f1(h * 0.04)}" fill="${cc('#e8d8a0')}" opacity="0.6"/>` +
      `<rect x="${f1(cx + w * 0.1)}" y="${f1(cy - h / 2 - 5)}" width="4" height="8" fill="${cc('#f4f0e0')}"/><rect x="${f1(cx + w * 0.25)}" y="${f1(cy - h / 2 - 3)}" width="4" height="6" fill="${cc('#f2c14e')}"/></g>`;
  }
  function can(cx, cy, U, kind, cc, T, steam) {
    const w = 2.6 * U, h = 5 * U;
    const col = kind === 'tea' ? '#efe2c4' : '#2a2a2e', band = kind === 'tea' ? '#c0392b' : '#c9a24a';
    let s = `<rect x="${f1(cx - w / 2)}" y="${f1(cy - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(U * 0.5)}" fill="${cc(col)}" stroke="${LINE}" stroke-width="1.1"/><rect x="${f1(cx - w / 2)}" y="${f1(cy - h * 0.1)}" width="${f1(w)}" height="${f1(h * 0.22)}" fill="${cc(band)}"/><ellipse cx="${f1(cx)}" cy="${f1(cy - h / 2)}" rx="${f1(w / 2)}" ry="${f1(U * 0.4)}" fill="${cc('#c8ccd0')}" stroke="${LINE}" stroke-width="0.8"/>`;
    if (steam) for (let i = 0; i < 2; i++) { const ph = (T * 0.5 + i * 0.5) % 1; s += `<path d="M${f1(cx + i * 4 - 2)} ${f1(cy - h / 2 - 2 - ph * 14)}q4 -5 0 -10t0 -10" stroke="#ffffff" stroke-width="1.6" fill="none" opacity="${f1(0.5 * (1 - ph))}"/>`; }
    return s;
  }
  function phone(cx, cy, U, cc, lit = true) { return `<rect x="${f1(cx - 2.2 * U)}" y="${f1(cy - 4 * U)}" width="${f1(4.4 * U)}" height="${f1(8 * U)}" rx="${f1(U * 0.8)}" fill="${cc('#2a2c34')}" stroke="${LINE}" stroke-width="1.1"/><rect x="${f1(cx - 1.8 * U)}" y="${f1(cy - 3.4 * U)}" width="${f1(3.6 * U)}" height="${f1(6.6 * U)}" rx="${f1(U * 0.4)}" fill="${lit ? '#cfe4ff' : '#1a1c22'}"/>`; }

  // ---------- body ----------
  function outfit(d, season) { return d.outfit.any || d.outfit[season] || d.outfit.autumn; }

  function draw(id, st, T) {
    uid = st.uid0 || uid;
    const d = D[id]; if (!d) return '';
    st.d = d; st.e = Object.assign({}, EMO.neutral, EMO[st.emo] || {});
    if (st.act === 'laugh') st.e = Object.assign({}, st.e, EMO.laugh);
    const cc = st.cc || (c => c), U = d.H / 100, o = outfit(d, st.season), r = d.r;
    const sit = st.pose === 'sit', walk = st.pose === 'walk';
    const hipY = sit ? 0 : -47 * U;
    const breath = Math.sin(T * 1.7 + st.seed) * 0.35 * U;
    const shY = hipY - 33.5 * U + breath, sw = d.shoulders * U, hw = d.hips * U, ww = (d.hips - 1.6) * U;
    const ap = st.actP || 0;
    let lean = (st.lean || 0) + (st.act === 'lean' ? 7 * ap * (st.side || 1) : 0) + (st.act === 'laugh' ? Math.sin(T * 9) * 1.2 * ap : 0);
    let tilt = st.tilt || 0;
    if (st.act === 'nod') tilt += Math.max(0, Math.sin((T - st.actT0) * 7)) * 8 * ap;
    if (st.act === 'shake') st.tu += Math.sin((T - st.actT0) * 9) * 0.25 * ap;
    if (st.talking) tilt += Math.sin(T * 6.5 + st.seed) * 1.4 * st.talk;
    const sleeve = o.outer && o.outerType !== 'apron' && o.outerType !== 'hoodie' ? o.outer : o.outerType === 'hoodie' ? o.outer : o.top;
    const legsCol = o.skirt ? (o.legs === 'skin' ? d.skin : o.legs) : o.bottom;
    let back = '', legs = '', torso = '', arms = '', front = '';

    // ---- legs ----
    if (sit) {
      const footY = 33 * U, kneeY = 14.5 * U;
      // shins first (behind the lap), with the lap's shadow falling across their tops
      for (const side of [-1, 1]) {
        const kx = side * 7 * U;
        legs += limb([[kx, kneeY], [kx - side * 0.5 * U, footY - 2 * U]], (o.skirt ? 4.3 : 5.4) * U, legsCol, cc);
        if (o.socks) legs += limb([[kx - side * 0.5 * U, footY - 6.5 * U], [kx - side * 0.5 * U, footY - 2 * U]], 4.5 * U, o.socks, cc);
        legs += `<path d="M${f1(kx - 3 * U)} ${f1(kneeY)}h${f1(6 * U)}v${f1(3.2 * U)}h${f1(-6 * U)}Z" fill="${SH}" opacity="0.2"/>`;
        legs += cel(ellD(kx - side * 0.2 * U, footY, 3.9 * U, 2.1 * U), cc(o.shoes), { lw: 1.3, k: 2 });
      }
      // thighs, foreshortened toward the camera: the lap widens and drops to two big rounded knees
      const thigh = side => `M${f1(side * 0.2 * U)} ${f1(-2 * U)}L${f1(side * hw)} ${f1(-3 * U)}C${f1(side * (hw + 2.5 * U))} ${f1(2 * U)} ${f1(side * 12 * U)} ${f1(8 * U)} ${f1(side * 12 * U)} ${f1(12.5 * U)}C${f1(side * 12 * U)} ${f1(16.6 * U)} ${f1(side * 3 * U)} ${f1(16.8 * U)} ${f1(side * 2.2 * U)} ${f1(13 * U)}C${f1(side * 1.5 * U)} ${f1(8 * U)} ${f1(side * 0.5 * U)} ${f1(3 * U)} ${f1(side * 0.2 * U)} ${f1(-2 * U)}Z`;
      const lapLit = { lx: 0, k: 3 };   // light from above: the top of the lap is lit, the knees fall into shade
      if (o.skirt) {
        for (const side of [-1, 1]) legs += cel(thigh(side), cc(legsCol), lapLit);
        legs += cel(`M${f1(-hw - 1 * U)} ${f1(-4.5 * U)}L${f1(hw + 1 * U)} ${f1(-4.5 * U)}C${f1(hw + 2.6 * U)} ${f1(1 * U)} ${f1(12.6 * U)} ${f1(5 * U)} ${f1(12.8 * U)} ${f1(10.5 * U)}Q0 ${f1(13 * U)} ${f1(-12.8 * U)} ${f1(10.5 * U)}C${f1(-12.6 * U)} ${f1(5 * U)} ${f1(-hw - 2.6 * U)} ${f1(1 * U)} ${f1(-hw - 1 * U)} ${f1(-4.5 * U)}Z`, cc(o.bottom), lapLit) +
          [-0.6, -0.2, 0.2, 0.6].map(k => `<path d="M${f1(k * hw)} ${f1(-1 * U)}L${f1(k * 13 * U)} ${f1(10.2 * U + (1 - Math.abs(k)) * 1.6 * U)}" stroke="${cc(shadeOf(o.bottom))}" stroke-width="1.2"/>`).join('');
      } else for (const side of [-1, 1]) legs += cel(thigh(side), cc(o.bottom), lapLit) + `<ellipse cx="${f1(side * 7.2 * U)}" cy="${f1(10.5 * U)}" rx="${f1(3 * U)}" ry="${f1(2 * U)}" fill="#fff" opacity="0.12"/>`;
      if (o.outerType === 'coat' || o.outerType === 'duffle') for (const side of [-1, 1]) legs += cel(`M${f1(side * 0.2 * U)} ${f1(-3 * U)}L${f1(side * (hw + 1.2 * U))} ${f1(-3 * U)}C${f1(side * (hw + 2.8 * U))} ${f1(1 * U)} ${f1(side * 11.6 * U)} ${f1(4 * U)} ${f1(side * 11.6 * U)} ${f1((o.outerType === 'coat' ? 9 : 6.5) * U)}L${f1(side * 0.4 * U)} ${f1((o.outerType === 'coat' ? 10 : 7.5) * U)}Z`, cc(o.outer), lapLit);
      if (o.blanket) legs += cel(`M${f1(-hw - 2.5 * U)} ${f1(-1.5 * U)}Q0 ${f1(-3.5 * U)} ${f1(hw + 2.5 * U)} ${f1(-1.5 * U)}C${f1(hw + 4 * U)} ${f1(4 * U)} ${f1(13 * U)} ${f1(8 * U)} ${f1(12 * U)} ${f1(17 * U)}Q0 ${f1(19 * U)} ${f1(-12 * U)} ${f1(17 * U)}C${f1(-13 * U)} ${f1(8 * U)} ${f1(-hw - 4 * U)} ${f1(4 * U)} ${f1(-hw - 2.5 * U)} ${f1(-1.5 * U)}Z`, cc(o.blanket), lapLit) + `<path d="M${f1(-11 * U)} ${f1(7 * U)}Q0 ${f1(8.5 * U)} ${f1(11 * U)} ${f1(7 * U)}M${f1(-11.5 * U)} ${f1(12 * U)}Q0 ${f1(13.5 * U)} ${f1(11.5 * U)} ${f1(12 * U)}" stroke="${cc(shadeOf(o.blanket))}" stroke-width="2" fill="none"/>`;
    } else {
      const sg = walk ? Math.sin(T * 6.5 + st.seed) : 0;
      for (const side of [-1, 1]) {
        const step = side * sg * 3 * U;
        const fx = side * 4.6 * U + step * 0.3, fy = -1.2 * U - Math.max(0, side * sg) * 1.2 * U;
        if (o.skirt) {
          legs += limb([[side * 4 * U, hipY + 14 * U], [fx, fy - 1.5 * U]], 4.2 * U, legsCol, cc);
          if (o.socks) legs += limb([[fx, fy - 9 * U], [fx, fy - 1.5 * U]], 4.4 * U, o.socks, cc);
        } else legs += limb([[side * 4.8 * U, hipY + 2 * U], [side * 4.9 * U + step * 0.15, hipY + 24 * U], [fx, fy - 1.5 * U]], 6.4 * U, o.bottom, cc);
        legs += cel(ellD(fx + side * 0.8 * U, fy, 3.6 * U, 1.8 * U), cc(o.shoes), { lw: 1.3, k: 2 });
      }
      if (o.skirt) legs += cel(`M${f1(-hw)} ${f1(hipY - 3 * U)}L${f1(hw)} ${f1(hipY - 3 * U)}L${f1(hw + 3.5 * U)} ${f1(hipY + 15 * U)}Q0 ${f1(hipY + 17 * U)} ${f1(-hw - 3.5 * U)} ${f1(hipY + 15 * U)}Z`, cc(o.bottom), { lx: st.lx, k: 4 }) +
        [-0.55, 0, 0.55].map(k => `<path d="M${f1(k * hw)} ${f1(hipY)}L${f1(k * hw * 1.35)} ${f1(hipY + 15 * U)}" stroke="${cc(shadeOf(o.bottom))}" stroke-width="1.2"/>`).join('');
      else legs += cel(`M${f1(-hw)} ${f1(hipY - 3 * U)}H${f1(hw)}L${f1(hw + 0.5 * U)} ${f1(hipY + 6 * U)}H${f1(-hw - 0.5 * U)}Z`, cc(o.bottom), { lx: st.lx, k: 3 });
      if (o.outerType === 'coat' || o.outerType === 'duffle') legs += cel(`M${f1(-hw - U)} ${f1(hipY - 4 * U)}H${f1(hw + U)}L${f1(hw + 3 * U)} ${f1(hipY + (o.outerType === 'coat' ? 22 : 13) * U)}H${f1(-hw - 3 * U)}Z`, cc(o.outer), { lx: st.lx, k: 4 }) + `<path d="M0 ${f1(hipY - 4 * U)}V${f1(hipY + (o.outerType === 'coat' ? 22 : 13) * U)}" stroke="${LINE}" stroke-width="1.2"/>`;
    }

    // ---- torso ----
    const torsoD = `M${f1(-3.2 * U)} ${f1(shY - 0.6 * U)}C${f1(-sw * 0.7)} ${f1(shY - 0.4 * U)} ${f1(-sw - 0.6 * U)} ${f1(shY + 1.2 * U)} ${f1(-sw)} ${f1(shY + 5 * U)}C${f1(-sw + 0.5 * U)} ${f1(shY + 14 * U)} ${f1(-ww)} ${f1(hipY - 12 * U)} ${f1(-ww)} ${f1(hipY - 8 * U)}L${f1(-hw)} ${f1(hipY - 0.5 * U)}L${f1(hw)} ${f1(hipY - 0.5 * U)}L${f1(ww)} ${f1(hipY - 8 * U)}C${f1(ww)} ${f1(hipY - 12 * U)} ${f1(sw - 0.5 * U)} ${f1(shY + 14 * U)} ${f1(sw)} ${f1(shY + 5 * U)}C${f1(sw + 0.6 * U)} ${f1(shY + 1.2 * U)} ${f1(sw * 0.7)} ${f1(shY - 0.4 * U)} ${f1(3.2 * U)} ${f1(shY - 0.6 * U)}Z`;
    const neckTop = shY - 5.5 * U, headY = neckTop - r * 0.82;
    // hood behind the neck
    if (o.outerType === 'hoodie' || o.outerType === 'duffle') back += cel(ellD(0, shY - 1 * U, 7.5 * U, 3.6 * U), cc(shadeOf(o.outer)), { lw: 1.4, k: 2 });
    torso += `<path d="M${f1(-2.6 * U)} ${f1(neckTop)}L${f1(-2.8 * U)} ${f1(shY + U)}L${f1(2.8 * U)} ${f1(shY + U)}L${f1(2.6 * U)} ${f1(neckTop)}Z" fill="${cc(mix(d.skin, '#c88a8a', 0.3))}" stroke="${LINE}" stroke-width="1.2"/>`;
    const main = o.outer && o.outerType !== 'apron' ? o.outer : o.top;
    torso += cel(torsoD, cc(main), { lx: st.lx, k: 5 });
    if (o.outerType === 'cardigan' || o.outerType === 'jacket') {
      torso += `<path d="M${f1(-3 * U)} ${f1(shY - 0.4 * U)}L${f1(-1.6 * U)} ${f1(hipY - 1 * U)}L${f1(1.6 * U)} ${f1(hipY - 1 * U)}L${f1(3 * U)} ${f1(shY - 0.4 * U)}Z" fill="${cc(o.top)}" stroke="${LINE}" stroke-width="1.2"/>`;
      if (o.tie) torso += `<path d="M0 ${f1(shY + 0.5 * U)}l${f1(-1.2 * U)} ${f1(2 * U)}l${f1(1.2 * U)} ${f1(12 * U)}l${f1(1.2 * U)} ${f1(-12 * U)}Z" fill="${cc(o.tie)}" stroke="${LINE}" stroke-width="1" transform="rotate(8 0 ${f1(shY)})"/>`;
      if (o.outerType === 'cardigan') for (let i = 0; i < 4; i++) torso += `<circle cx="${f1(-2.3 * U)}" cy="${f1(shY + 8 * U + i * 6 * U)}" r="${f1(0.55 * U)}" fill="${cc('#d8d0c0')}"/>`;
      if (o.outerType === 'jacket') torso += `<path d="M${f1(-3 * U)} ${f1(shY - 0.4 * U)}l${f1(-2.5 * U)} ${f1(6 * U)}l${f1(2 * U)} ${f1(1 * U)}M${f1(3 * U)} ${f1(shY - 0.4 * U)}l${f1(2.5 * U)} ${f1(6 * U)}l${f1(-2 * U)} ${f1(1 * U)}" stroke="${LINE}" stroke-width="1.2" fill="none"/>`;
    } else if (o.outerType === 'hoodie') {
      torso += `<path d="M${f1(-7 * U)} ${f1(hipY - 12 * U)}H${f1(7 * U)}L${f1(8 * U)} ${f1(hipY - 3 * U)}H${f1(-8 * U)}Z" fill="${cc(shadeOf(o.outer))}" opacity="0.6" stroke="${LINE}" stroke-width="1"/>` +
        `<path d="M${f1(-1.5 * U)} ${f1(shY + 0.5 * U)}v${f1(7 * U)}M${f1(1.5 * U)} ${f1(shY + 0.5 * U)}v${f1(6 * U)}" stroke="${cc('#f4efe0')}" stroke-width="1.6" stroke-linecap="round"/>`;
    } else if (o.outerType === 'coat' || o.outerType === 'duffle') {
      torso += `<path d="M0 ${f1(shY + U)}V${f1(hipY)}" stroke="${LINE}" stroke-width="1.2"/>`;
      if (o.outerType === 'duffle') for (let i = 0; i < 3; i++) torso += `<rect x="${f1(-2 * U)}" y="${f1(shY + 7 * U + i * 7 * U)}" width="${f1(4 * U)}" height="${f1(1.1 * U)}" rx="${f1(0.5 * U)}" fill="${cc('#e8d8b0')}" stroke="${LINE}" stroke-width="0.8"/>`;
      else for (let i = 0; i < 3; i++) torso += `<circle cx="${f1(1.8 * U)}" cy="${f1(shY + 8 * U + i * 8 * U)}" r="${f1(0.6 * U)}" fill="${cc('#1a1e2a')}"/>`;
    } else if (o.outerType === 'apron') {
      torso += `<path d="M${f1(-6 * U)} ${f1(shY + 6 * U)}H${f1(6 * U)}L${f1(8 * U)} ${f1(hipY + 2 * U)}H${f1(-8 * U)}Z" fill="${cc(o.outer)}" stroke="${LINE}" stroke-width="1.2"/><path d="M${f1(-6 * U)} ${f1(shY + 6 * U)}L${f1(-3 * U)} ${f1(shY)}M${f1(6 * U)} ${f1(shY + 6 * U)}L${f1(3 * U)} ${f1(shY)}" stroke="${cc(o.outer)}" stroke-width="2.4"/>`;
    } else if (o.tee) {
      torso += `<path d="M${f1(-3 * U)} ${f1(shY - 0.4 * U)}Q0 ${f1(shY + 2.6 * U)} ${f1(3 * U)} ${f1(shY - 0.4 * U)}" stroke="${LINE}" stroke-width="1.2" fill="none"/><circle cx="${f1(3 * U)}" cy="${f1(shY + 10 * U)}" r="${f1(2 * U)}" fill="${cc('#f2c14e')}" opacity="0.85"/>`;
    } else {   // shirt collar
      torso += `<path d="M${f1(-3.2 * U)} ${f1(shY - 0.8 * U)}L${f1(-0.4 * U)} ${f1(shY + 3 * U)}L${f1(-4.4 * U)} ${f1(shY + 2.6 * U)}ZM${f1(3.2 * U)} ${f1(shY - 0.8 * U)}L${f1(0.4 * U)} ${f1(shY + 3 * U)}L${f1(4.4 * U)} ${f1(shY + 2.6 * U)}Z" fill="${cc(o.top)}" stroke="${LINE}" stroke-width="1.1"/><path d="M0 ${f1(shY + 3 * U)}V${f1(hipY - 2 * U)}" stroke="${cc(shadeOf(o.top))}" stroke-width="1.2"/>`;
    }
    if (o.scarf) {
      torso += cel(`M${f1(-5 * U)} ${f1(shY - 2.4 * U)}Q0 ${f1(shY - 0.4 * U)} ${f1(5 * U)} ${f1(shY - 2.4 * U)}L${f1(5.6 * U)} ${f1(shY + 2.2 * U)}Q0 ${f1(shY + 4.8 * U)} ${f1(-5.6 * U)} ${f1(shY + 2.2 * U)}Z`, cc(o.scarf), { lx: st.lx, k: 2 }) +
        cel(`M${f1(-3.6 * U)} ${f1(shY + 2 * U)}L${f1(-0.6 * U)} ${f1(shY + 2.6 * U)}L${f1(-1.4 * U)} ${f1(shY + 14 * U)}L${f1(-4.4 * U)} ${f1(shY + 13.4 * U)}Z`, cc(o.scarf), { lx: st.lx, k: 2 }) +
        `<path d="M${f1(-4.4 * U)} ${f1(shY + 13.4 * U)}l${f1(0.5 * U)} ${f1(1.4 * U)}m${f1(1 * U)} ${f1(-1.2 * U)}l${f1(0.4 * U)} ${f1(1.4 * U)}m${f1(1 * U)} ${f1(-1.2 * U)}l${f1(0.4 * U)} ${f1(1.4 * U)}" stroke="${cc(o.scarf)}" stroke-width="1.4"/>`;
    }

    // ---- arms and props ----
    const sh = side => [side * (sw - 2.4 * U), shY + 3.2 * U];
    const aw = (o.outer ? 5.4 : 4.8) * U, hr = 2.1 * U;
    const skin = d.skin;
    const A = (pts, side, curve) => limb(pts, aw, sleeve, cc, { curve });
    const fore = o.rolled ? (pts) => limb(pts.slice(-2), 3.6 * U, skin, cc) : () => '';
    const act = st.act, prop = st.prop;
    const bookCol = st.bookColor || '#7a2e2a';
    const hideP = act === 'hide' ? ap : 0;
    const sipP = act === 'sip' ? ap : 0;
    let propFront = '';
    if (sit || st.pose === 'stand' || walk) {
      const lapY = sit ? -4 * U : hipY - 6 * U;
      const swing = walk ? Math.sin(T * 6.5 + st.seed) * 4 * U : 0;
      for (const side of [-1, 1]) {
        const S = sh(side);
        let E = [side * (sw - 0.2 * U), shY + 15.5 * U], Hn = [side * 6.5 * U, sit ? 6 * U : lapY];
        if (!sit && !prop) { E = [side * (sw - 0.3 * U), shY + 15 * U]; Hn = [side * (sw - 1.6 * U) + swing * side * 0.2, shY + 29 * U + swing * side]; }
        if (prop === 'book' || prop === 'notebook' || prop === 'manuscript') { Hn = [side * 7.2 * U, lapY - 5 * U - hideP * (lapY - 5 * U - headY - r * 0.35)]; E = [side * (sw + 0.2 * U), shY + 15 * U - hideP * 8 * U]; }
        if (prop === 'can' && side === 1) { Hn = [lerp(4.5 * U, 1.4 * U, sipP), lerp(lapY - 3 * U, headY + r * 0.7, sipP)]; E = [sw + 1.2 * U, shY + lerp(16, 9, sipP) * U]; }
        if ((prop === 'tea2' || prop === 'can2') && side === -1) { Hn = [-4.2 * U, lapY - 3 * U]; }
        if (prop === 'phone' && side === 1) { Hn = [2.5 * U, lapY - 9 * U]; E = [sw + 1.2 * U, shY + 15 * U]; }
        if (prop === 'umbrella' && side === 1) { if (st.umbrellaOpen) { Hn = [sw * 0.35, shY + 4 * U]; E = [sw + 1.5 * U, shY + 12 * U]; } else { Hn = [sw - U, shY + 13 * U]; E = [sw + 1.2 * U, shY + 13 * U]; } }
        if (act === 'chin' && side === 1) { Hn = [r * 0.55, headY + r * 1.2]; E = [sw - 1 * U, sit ? 3 * U : hipY + 3 * U]; }
        if (act === 'wave' && side === 1) { const wv = Math.sin(T * 8) * 2 * U; Hn = [sw + 5 * U + wv, shY - 16 * U * ap]; E = [sw + 4 * U, shY + 4 * U - 6 * U * ap]; }
        if (act === 'point' && side === 1) { Hn = [sw + 10 * U * ap, shY + 8 * U]; E = [sw + 5 * U * ap, shY + 10 * U]; }
        if (act === 'rail') { Hn = [side * 7.5 * U, hipY - 4 * U]; E = [side * (sw + 1.2 * U), shY + 15 * U]; }
        if (act === 'cover' ) { Hn = [side * r * 0.35, headY + r * 0.35]; E = [side * (sw - 1 * U), shY + 10 * U]; }
        if (act === 'stretch') { Hn = [side * 6 * U, shY - 22 * U * ap]; E = [side * (sw + 1 * U), shY - 6 * U * ap]; }
        arms += A([S, E, Hn], side, true) + fore([S, E, Hn]);
        if (prop === 'can' && side === 1) propFront += can(Hn[0] - 0.4 * U, Hn[1] - 1.4 * U, U, st.canKind || 'coffee', cc, T, st.season === 'winter' || st.season === 'autumn');
        if ((prop === 'tea2') && side === -1) propFront += can(Hn[0] + 0.3 * U, Hn[1] - 1.4 * U, U, 'tea', cc, T, true);
        if (prop === 'phone' && side === 1) propFront += phone(Hn[0], Hn[1] - 2 * U, U, cc, true);
        if (prop === 'umbrella' && side === 1 && !st.umbrellaOpen) propFront += `<path d="M${f1(Hn[0])} ${f1(Hn[1])}V${f1(Hn[1] + 30 * U)}" stroke="${LINE}" stroke-width="2.4"/><path d="M${f1(Hn[0] - 3 * U)} ${f1(Hn[1] - 2 * U)}L${f1(Hn[0])} ${f1(Hn[1] + 30 * U)}L${f1(Hn[0] + 3 * U)} ${f1(Hn[1] - 2 * U)}Z" fill="${cc(st.umbrellaColor || '#2e3752')}" stroke="${LINE}" stroke-width="1.1"/>`;
        if (prop === 'umbrella' && side === 1 && st.umbrellaOpen) {
          const topY = headY - r * 2.1, cx0 = Hn[0] * 0.5, RX = r * 2.7, RY = r * 1.2, col = cc(st.umbrellaColor || '#2e3752');
          front += `<path d="M${f1(Hn[0])} ${f1(Hn[1] + 2 * U)}L${f1(cx0)} ${f1(topY - RY)}" stroke="${LINE}" stroke-width="2.2"/>` +
            `<path d="M${f1(cx0 - RX)} ${f1(topY + RY * 0.05)}Q${f1(cx0 - RX)} ${f1(topY - RY * 1.1)} ${f1(cx0)} ${f1(topY - RY)}Q${f1(cx0 + RX)} ${f1(topY - RY * 1.1)} ${f1(cx0 + RX)} ${f1(topY + RY * 0.05)}` +
            `Q${f1(cx0 + RX * 0.84)} ${f1(topY + RY * 0.28)} ${f1(cx0 + RX * 0.67)} ${f1(topY + RY * 0.05)}Q${f1(cx0 + RX * 0.5)} ${f1(topY + RY * 0.28)} ${f1(cx0 + RX * 0.33)} ${f1(topY + RY * 0.05)}Q${f1(cx0 + RX * 0.17)} ${f1(topY + RY * 0.28)} ${f1(cx0)} ${f1(topY + RY * 0.05)}Q${f1(cx0 - RX * 0.17)} ${f1(topY + RY * 0.28)} ${f1(cx0 - RX * 0.33)} ${f1(topY + RY * 0.05)}Q${f1(cx0 - RX * 0.5)} ${f1(topY + RY * 0.28)} ${f1(cx0 - RX * 0.67)} ${f1(topY + RY * 0.05)}Q${f1(cx0 - RX * 0.84)} ${f1(topY + RY * 0.28)} ${f1(cx0 - RX)} ${f1(topY + RY * 0.05)}Z" fill="${col}" stroke="${LINE}" stroke-width="1.4"/>` +
            [-0.67, -0.33, 0, 0.33, 0.67].map(k => `<path d="M${f1(cx0)} ${f1(topY - RY)}Q${f1(cx0 + k * RX * 0.8)} ${f1(topY - RY * 0.7)} ${f1(cx0 + k * RX)} ${f1(topY + RY * 0.05)}" stroke="${mix(st.umbrellaColor || '#2e3752', '#000', 0.35)}" stroke-width="1.1" fill="none"/>`).join('') +
            `<path d="M${f1(cx0 - RX * 0.6)} ${f1(topY - RY * 0.6)}Q${f1(cx0 - RX * 0.2)} ${f1(topY - RY * 1.0)} ${f1(cx0 + RX * 0.1)} ${f1(topY - RY * 0.95)}" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.25"/>`;
        }
        propFront += hand(Hn[0], Hn[1], hr, cc, skin);
        if (act === 'write' && side === 1) propFront += `<path d="M${f1(Hn[0])} ${f1(Hn[1])}l${f1(4 * U)} ${f1(-6 * U)}" stroke="#c9a24a" stroke-width="${f1(0.9 * U)}" stroke-linecap="round" transform="translate(${f1(Math.sin(T * 9) * 1.2 * U)} 0)"/>`;
      }
      if (prop === 'book' || prop === 'notebook' || prop === 'manuscript') {
        const by = lapY - 5.5 * U - hideP * (lapY - 5 * U - headY - r * 0.35);
        const open = hideP < 0.5 && st.bookOpen !== false;
        const col = prop === 'notebook' ? '#3a6a8a' : prop === 'manuscript' ? '#f4f0e4' : bookCol;
        const bk = hideP > 0.5 ? book(0, by, 2.3 * r, 2.6 * r, col, false, cc) : book(0, by, 8 * U, 8.5 * U, col, open && prop !== 'manuscript', cc, 0);
        propFront = bk + propFront;
      }
    }

    // ---- head ----
    const headG = `<g transform="translate(${f1(st.tu * 0.8 * U)} ${f1(headY)}) rotate(${f1(tilt)} 0 ${f1(r * 0.9)})">${head(st, T, cc)}</g>`;

    // stack: hood, legs, torso, (arms behind book when hiding), head, props/hands
    const upper = `<g transform="rotate(${f1(lean)} 0 ${f1(hipY)})">${back}${torso}${hideP > 0.5 ? '' : ''}${headG}${arms}${propFront}${front}</g>`;
    return `<g>${legs}${upper}</g>`;
  }

  // ---------- the laundry cat ----------
  function cat(pose, T, cc = (c => c), seed = 0) {
    const g = '#9b9aa2', w = '#f4f2ee', dk = '#6a6a74';
    let s = '';
    const br = 1 + Math.sin(T * 1.3 + seed) * 0.03;
    if (pose === 'sleep') {
      s += `<ellipse cx="0" cy="2" rx="40" ry="6" fill="#000" opacity="0.18"/>`;
      s += `<g transform="scale(1 ${f1(br * 100) / 100})">` + cel(`M-38 0C-42 -30 -10 -36 8 -32C30 -30 42 -18 38 0Z`, cc(g), { k: 4 }) + `</g>`;
      s += cel(`M14 -4C10 -26 34 -30 40 -14C42 -6 34 0 14 -4Z`, cc(g), { k: 3 });
      s += `<path d="M18 -20L20 -34L28 -24ZM32 -24L40 -33L40 -19Z" fill="${cc(g)}" stroke="${LINE}" stroke-width="1.2" stroke-linejoin="round"/>`;
      s += `<path d="M22 -10q4 3 8 0" stroke="${LINE}" stroke-width="1.4" fill="none"/><path d="M33 -12q3 3 6 0" stroke="${LINE}" stroke-width="1.4" fill="none"/>`;
      s += `<path d="M14 -4Q26 2 38 -6" fill="${cc(w)}" stroke="${LINE}" stroke-width="1"/>`;
      s += `<path d="M-36 -2Q-48 -10 -40 -20" stroke="${cc(g)}" stroke-width="7" fill="none" stroke-linecap="round" transform="rotate(${f1(Math.sin(T * 0.6) * 6)} -36 -2)"/>`;
      s += `<path d="M-20 -26q6 -4 12 0M-6 -30q6 -3 10 1" stroke="${dk}" stroke-width="2" fill="none"/>`;
      // z z z
      const zz = (T * 0.4) % 1;
      s += `<text x="${f1(40 + zz * 14)}" y="${f1(-40 - zz * 22)}" font-family="Nunito" font-weight="900" font-size="${f1(10 + zz * 6)}" fill="#ffffff" opacity="${f1(0.8 * (1 - zz))}">z</text>`;
    } else {
      s += `<ellipse cx="0" cy="2" rx="26" ry="5" fill="#000" opacity="0.18"/>`;
      s += cel(`M-22 0C-26 -30 -14 -50 0 -50C14 -50 26 -30 22 0Z`, cc(g), { k: 4 });
      s += `<path d="M-10 -2C-12 -20 -6 -36 0 -36C6 -36 12 -20 10 -2Z" fill="${cc(w)}"/>`;
      s += cel(`M-18 -62C-20 -80 18 -80 18 -62C18 -50 -18 -50 -18 -62Z`, cc(g), { k: 3 });
      s += `<path d="M-16 -70L-14 -88L-4 -76ZM16 -70L14 -88L4 -76Z" fill="${cc(g)}" stroke="${LINE}" stroke-width="1.2" stroke-linejoin="round"/>`;
      const bl = (T + seed) % 4 < 0.15;
      s += bl ? `<path d="M-9 -66h6M3 -66h6" stroke="${LINE}" stroke-width="1.6"/>` : `<ellipse cx="-6" cy="-66" rx="3" ry="3.6" fill="#b8d860"/><ellipse cx="6" cy="-66" rx="3" ry="3.6" fill="#b8d860"/><path d="M-6 -69v6M6 -69v6" stroke="#222" stroke-width="1.6"/>`;
      s += `<path d="M-2 -60l2 2l2 -2z" fill="#e08a9a"/><path d="M-14 -58h-10M-14 -56l-9 3M14 -58h10M14 -56l9 3" stroke="${LINE}" stroke-width="0.8"/>`;
      s += `<path d="M20 -4Q40 -8 36 -30" stroke="${cc(g)}" stroke-width="7" fill="none" stroke-linecap="round" transform="rotate(${f1(Math.sin(T * 1.2) * 10)} 20 -4)"/>`;
    }
    return s;
  }

  window.AnimeChars = { draw, cat, D, EMO, book, can, setUid: v => { uid = v; }, getUid: () => uid };
})();
