/* Toon engine: renders an episode (episode.json + timeline.json) as SVG frames.
   Everything is procedural (no image assets), so any new cast member is just a "look" object.
   window.Toon.load(ep, tl, svgEl); window.Toon.renderAt(seconds) draws one frame. */
(function () {
  const W = 1280, H = 720, GROUND = 640;
  const SKIN = '#FFD43B', INK = '#1d1d1d';
  let EP = null, TL = null, SVG = null, SEG = {};

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const hash = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 9973; return h / 9973; };
  const easeOutBack = k => { const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };

  // ---------------- characters ----------------
  function brows(emote, color) {
    const eyes = [[6, -1], [36, 1]]; // x, side (inner end direction)
    return eyes.map(([x, side]) => {
      let y = -128, tilt = 0;
      if (emote === 'happy') y = -133;
      if (emote === 'deadpan') y = -122;
      if (emote === 'smug') { if (side < 0) y = -140; else { y = -122; tilt = 3; } }
      if (emote === 'angry') tilt = 7;
      if (emote === 'worried' || emote === 'sad') tilt = -6;
      if (emote === 'shocked') y = -138;
      const innerX = side < 0 ? x + 15 : x - 15, outerX = side < 0 ? x - 15 : x + 15;
      return `<path d="M${outerX},${y - tilt * 0.3} L${innerX},${y + tilt}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;
    }).join('');
  }

  function eyes(st) {
    const big = st.emote === 'shocked' ? 4 : 0;
    return [[6, -100, 21], [36, -102, 22]].map(([x, y, r]) => {
      if (st.blink) return `<path d="M${x - r},${y} Q${x},${y + 8} ${x + r},${y}" stroke="${INK}" stroke-width="4" fill="none"/>`;
      const pr = st.emote === 'shocked' ? 3.5 : 5.5;
      const lid = st.emote === 'deadpan' || st.emote === 'smug' ? 0.55 : st.emote === 'angry' ? 0.3 : 0;
      return `<circle cx="${x}" cy="${y}" r="${r + big}" fill="#fff" stroke="${INK}" stroke-width="4"/>` +
        `<circle cx="${x + 6 * st.look}" cy="${y + (lid ? 6 : 2)}" r="${pr}" fill="${INK}"/>` +
        (lid ? `<path d="M${x - r - 2},${y - r * (1 - 2 * lid)} A${r + 2},${r + 2} 0 ${lid > 0.5 ? 1 : 0} 1 ${x + r + 2},${y - r * (1 - 2 * lid)} Z" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>` : '');
    }).join('');
  }

  function mouth(st, look) {
    const o = st.mouth, e = st.emote;
    if (o < 0.06) {
      if (look.smile && e !== 'shocked') // the anchorman's permanent grin
        return `<path d="M10,-48 Q34,-22 58,-50 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
          `<path d="M18,-44 L52,-46" stroke="#bbb" stroke-width="1.5"/>`;
      const d = { happy: 'M12,-46 Q34,-28 56,-48', sad: 'M14,-34 Q34,-48 54,-34', angry: 'M14,-38 Q34,-44 54,-40',
        worried: 'M14,-38 Q24,-44 34,-38 Q44,-32 54,-40', shocked: 'M26,-40 Q34,-46 42,-40 Q34,-30 26,-40',
        deadpan: 'M16,-40 L52,-40', smug: 'M14,-40 Q36,-36 58,-52' }[e] || 'M14,-40 Q34,-36 54,-42';
      return `<path d="${d}" stroke="${look.lipstick || INK}" stroke-width="${look.lipstick ? 6 : 4}" fill="none" stroke-linecap="round"/>`;
    }
    const ry = 3 + o * 16, rx = 15 + (e === 'happy' ? 6 : 0) + o * 3 + Math.sin(st.t * 23) * 3, cy = -40 + o * 5;
    return `<ellipse cx="34" cy="${cy}" rx="${rx}" ry="${ry}" fill="#5b1416" stroke="${look.lipstick || INK}" stroke-width="${look.lipstick ? 6 : 4}"/>` +
      (look.smile ? `<rect x="${34 - rx + 5}" y="${cy - ry + 1}" width="${2 * rx - 10}" height="${Math.min(7, ry)}" fill="#fff"/>` : '') +
      (o > 0.3 ? `<ellipse cx="38" cy="${cy + ry * 0.55}" rx="${rx * 0.55}" ry="${ry * 0.35}" fill="#e05666"/>` : '');
  }

  function hairBack(look) {
    const c = look.hairColor;
    switch (look.hair) {
      case 'bouffant':
        return [[0, -178, 62], [-44, -154, 46], [42, -158, 42], [-58, -104, 32], [-54, -64, 24], [60, -118, 24]]
          .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${INK}" stroke-width="4"/>`).join('');
      case 'pigtails':
        return `<circle cx="-64" cy="-112" r="24" fill="${c}" stroke="${INK}" stroke-width="4"/>` +
          `<circle cx="58" cy="-150" r="21" fill="${c}" stroke="${INK}" stroke-width="4"/>` +
          `<path d="M-50,-124 l-12,-14 l4,22 z M-50,-124 l14,-12 l-4,22 z" fill="${look.bow}" stroke="${INK}" stroke-width="3"/>` +
          `<path d="M44,-148 l-6,-18 l16,10 z M44,-148 l18,-2 l-12,14 z" fill="${look.bow}" stroke="${INK}" stroke-width="3"/>`;
      case 'curly':
        return [[-50, -132], [-30, -160], [0, -168], [30, -162], [52, -140], [-58, -98], [-56, -62], [-44, -30], [58, -110]]
          .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${22 + (i % 3) * 3}" fill="${c}" stroke="${INK}" stroke-width="3"/>`).join('');
      default: return '';
    }
  }

  function hairFront(look) {
    const c = look.hairColor;
    switch (look.hair) {
      case 'helmet':
        return `<path d="M-50,-58 Q-60,-152 0,-164 Q58,-170 56,-126 Q34,-150 -4,-140 Q-30,-130 -36,-92 L-40,-58 Z" fill="${c}" stroke="${INK}" stroke-width="4"/>` +
          `<path d="M-10,-152 Q20,-160 40,-150" stroke="#fff" stroke-opacity=".35" stroke-width="4" fill="none"/>`;
      case 'flop':
        return `<path d="M-48,-86 Q-58,-162 4,-162 Q62,-162 60,-116 Q42,-136 22,-130 Q32,-120 18,-112 Q-8,-132 -30,-118 Q-40,-108 -42,-82 Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
      case 'pigtails':
        return `<path d="M-48,-84 Q-52,-162 0,-162 Q52,-162 50,-120 Q20,-140 -10,-128 Q-34,-118 -40,-82 Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
      case 'bald':
        return `<ellipse cx="-44" cy="-86" rx="13" ry="24" fill="${c}" stroke="${INK}" stroke-width="3"/>` +
          `<ellipse cx="-8" cy="-136" rx="16" ry="6" fill="#fff" opacity=".45"/>`;
      case 'curly':
        return [[-30, -150], [0, -156], [28, -148], [-42, -126]]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="18" fill="${c}" stroke="${INK}" stroke-width="3"/>`).join('');
      case 'bouffant':
        return `<circle cx="34" cy="-142" r="18" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
      default: return '';
    }
  }

  function head(look, st) {
    let s = hairBack(look);
    s += `<rect x="-46" y="-152" width="94" height="162" rx="45" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>`;
    s += `<ellipse cx="-34" cy="-72" rx="9" ry="14" fill="${SKIN}" stroke="${INK}" stroke-width="4"/><path d="M-36,-78 q5,6 0,12" stroke="${INK}" stroke-width="2.5" fill="none"/>`;
    if (look.stubble) s += `<path d="M0,-26 Q4,6 24,7 Q44,5 46,-28 Q30,-16 14,-22 Z" fill="#b8902a" opacity=".35"/>`;
    if (look.beard) s += `<path d="M-38,-66 Q-36,14 18,16 Q64,14 64,-34 L54,-30 Q34,-12 12,-26 L-24,-62 Z" fill="${look.beard}" stroke="${INK}" stroke-width="4"/>`;
    s += eyes(st);
    s += brows(st.emote, look.hair === 'bald' ? '#8a8a8a' : look.hairColor);
    if (look.glasses) s += `<g fill="#fff" fill-opacity=".12" stroke="${INK}" stroke-width="4"><circle cx="6" cy="-100" r="26"/><circle cx="38" cy="-102" r="26"/></g><path d="M-20,-100 L-36,-96" stroke="${INK}" stroke-width="4"/>`;
    s += `<ellipse cx="58" cy="-78" rx="13" ry="9" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>`;
    if (look.mustache) s += `<path d="M14,-62 Q36,-72 60,-62 Q56,-48 36,-54 Q18,-48 14,-62 Z" fill="${look.hairColor}" stroke="${INK}" stroke-width="3"/>`;
    s += mouth(st, look);
    s += hairFront(look);
    return s;
  }

  // hand-held props, drawn with the hand at (0,0)
  const ITEMS = {
    beer: `<g transform="rotate(180)"><rect x="-11" y="-20" width="22" height="38" rx="4" fill="#c62828" stroke="${INK}" stroke-width="3"/><rect x="-11" y="-6" width="22" height="9" fill="#fff"/><text x="0" y="2" font-family="Bangers" font-size="9" text-anchor="middle" fill="#c62828">BREWSKI</text><rect x="-9" y="-24" width="18" height="5" fill="#bdbdbd" stroke="${INK}" stroke-width="2"/></g>`,
    keys: `<g><circle cx="0" cy="10" r="9" fill="none" stroke="#f9a825" stroke-width="4"/><path d="M4,16 l10,18 l-4,2 l2,4 l-4,2 l-6,-12 M-6,16 l-6,20 l5,1 l-1,5" stroke="#f9a825" stroke-width="5" fill="none" stroke-linecap="round"/></g>`,
    sponge: `<g transform="rotate(-10)"><rect x="-18" y="-4" width="36" height="24" rx="4" fill="#ffee58" stroke="${INK}" stroke-width="3"/><rect x="-18" y="-4" width="36" height="8" fill="#43a047"/><circle cx="-6" cy="12" r="2.5" fill="#c0a000"/><circle cx="8" cy="14" r="2" fill="#c0a000"/></g>`,
    martini: `<g transform="rotate(180)"><path d="M-18,-30 L18,-30 L0,-8 Z" fill="#b3e5fc" stroke="${INK}" stroke-width="3"/><line x1="0" y1="-8" x2="0" y2="14" stroke="${INK}" stroke-width="3"/><line x1="-9" y1="14" x2="9" y2="14" stroke="${INK}" stroke-width="3"/><circle cx="5" cy="-22" r="4" fill="#7cb342" stroke="${INK}" stroke-width="2"/></g>`
  };

  function arm(color, angle, item) {
    return `<g transform="rotate(${angle})"><rect x="-12" y="-6" width="24" height="78" rx="11" fill="${color}" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="-8" y="66" width="16" height="34" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>` +
      (item && ITEMS[item] ? `<g transform="translate(0,112)">${ITEMS[item]}</g>` : '') +
      `<circle cx="0" cy="108" r="14" fill="${SKIN}" stroke="${INK}" stroke-width="4"/></g>`;
  }

  function armAngles(act, t, speaking) {
    const w = Math.sin(t * 6), b = Math.sin(t * 1.7);
    if (!speaking) return [10 + 2 * b, 10 + 2 * b];
    switch (act) {
      case 'armsup': return [140 + 10 * w, 150 + 10 * w];
      case 'point': return [32 + 4 * b, 95 + 3 * w];
      case 'shrug': return [62 + 6 * w, 62 + 6 * w];
      case 'facepalm': return [14, 158];
      default: return [14 + 6 * w, 26 + 14 * w];
    }
  }

  function person(c, look, st) {
    const Hh = look.height || 1, kid = Hh < 0.85, headS = kid ? 0.9 : 1;
    const [backA, frontA] = armAngles(st.act, st.t, st.speaking);
    let body = '';
    body += `<g transform="translate(-46,-240)">${arm(look.vest ? look.shirt : look.shirt, -backA)}</g>`;
    if (look.skirt) {
      body += `<rect x="-24" y="-70" width="13" height="62" fill="${SKIN}" stroke="${INK}" stroke-width="3"/><rect x="11" y="-70" width="13" height="62" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>`;
      body += `<path d="M-46,-134 L46,-134 L62,-62 L-62,-62 Z" fill="${look.pants}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    } else {
      body += `<rect x="-38" y="-126" width="34" height="118" fill="${look.pants}" stroke="${INK}" stroke-width="4"/><rect x="4" y="-126" width="34" height="118" fill="${look.pants}" stroke="${INK}" stroke-width="4"/>`;
    }
    body += `<ellipse cx="-18" cy="-8" rx="24" ry="10" fill="#2a2a2a"/><ellipse cx="26" cy="-8" rx="26" ry="10" fill="#2a2a2a"/>`;
    body += `<rect x="-13" y="-274" width="26" height="30" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>`;
    body += `<path d="M-52,-250 Q-60,-180 -46,-112 L46,-112 Q60,-180 52,-250 Q0,-264 -52,-250 Z" fill="${look.shirt}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    if (look.vest) body += `<path d="M-50,-246 L-14,-160 L14,-160 L50,-246 Q58,-180 46,-112 L-46,-112 Q-58,-180 -50,-246 Z" fill="${look.vest}" stroke="${INK}" stroke-width="4"/>`;
    if (look.tie) body += `<path d="M-22,-254 L0,-196 L22,-254 Z" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M-6,-250 L6,-250 L10,-176 L0,-164 L-10,-176 Z" fill="${look.tie}" stroke="${INK}" stroke-width="3"/>`;
    if (look.bowtie) body += `<path d="M0,-250 L-22,-262 L-22,-238 Z M0,-250 L22,-262 L22,-238 Z" fill="${look.bowtie}" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="-250" r="5" fill="${look.bowtie}" stroke="${INK}" stroke-width="2"/>`;
    if (look.pearls) for (let i = -4; i <= 4; i++) body += `<circle cx="${i * 6}" cy="${-252 + Math.abs(i) * -1.5 + 6}" r="4" fill="#fff" stroke="#999" stroke-width="1"/>`;
    if (look.sash) body += `<path d="M-50,-244 L-30,-252 L50,-150 L46,-122 Z" fill="#ffeb3b" stroke="${INK}" stroke-width="3"/><text x="0" y="-186" font-family="Bangers" font-size="18" fill="${INK}" transform="rotate(52 0 -186)" text-anchor="middle">${esc(look.sash)}</text>`;
    body += `<g transform="translate(46,-240)">${arm(look.shirt, -frontA, st.hold)}</g>`;

    const bob = st.speaking ? Math.sin(st.t * 9) * 2.5 : Math.sin(st.t * 1.7) * 1;
    const tilt = st.speaking ? Math.sin(st.t * 4.3) * 3 : 0;
    const hd = `<g transform="translate(0,${-268 * Hh + bob}) scale(${headS}) rotate(${tilt})">${head(look, st)}</g>`;
    return `<g transform="scale(${Hh})">${body}</g>${hd}`;
  }

  function raccoon(st) {
    const hop = st.speaking ? -Math.abs(Math.sin(st.t * 11)) * 16 : 0, o = st.mouth;
    return `<g transform="translate(0,${hop})">` +
      `<g transform="rotate(${-30 + Math.sin(st.t * 3) * 8} -40 -40)"><ellipse cx="-80" cy="-50" rx="58" ry="20" fill="#8a8f98" stroke="${INK}" stroke-width="4"/>` +
      [-108, -84, -60].map(x => `<rect x="${x}" y="-69" width="10" height="38" fill="#33363c"/>`).join('') + `</g>` +
      `<ellipse cx="0" cy="-62" rx="50" ry="62" fill="#8a8f98" stroke="${INK}" stroke-width="4"/>` +
      `<ellipse cx="10" cy="-56" rx="28" ry="42" fill="#cfd2d8"/>` +
      `<ellipse cx="-22" cy="-6" rx="20" ry="9" fill="#33363c"/><ellipse cx="26" cy="-6" rx="20" ry="9" fill="#33363c"/>` +
      `<path d="M-16,-164 l-10,-34 l26,18 z M30,-170 l6,-34 l14,30 z" fill="#8a8f98" stroke="${INK}" stroke-width="4"/>` +
      `<circle cx="12" cy="-140" r="42" fill="#8a8f98" stroke="${INK}" stroke-width="4"/>` +
      `<ellipse cx="18" cy="-146" rx="40" ry="14" fill="#202226"/>` +
      `<circle cx="4" cy="-146" r="9" fill="#fff"/><circle cx="32" cy="-146" r="9" fill="#fff"/>` +
      `<circle cx="${6 + 2 * st.look}" cy="-146" r="4" fill="${INK}"/><circle cx="${34 + 2 * st.look}" cy="-146" r="4" fill="${INK}"/>` +
      `<ellipse cx="42" cy="-122" rx="18" ry="12" fill="#e7e9ec" stroke="${INK}" stroke-width="3"/><circle cx="56" cy="-126" r="6" fill="${INK}"/>` +
      (o > 0.06 ? `<ellipse cx="40" cy="-110" rx="9" ry="${3 + o * 9}" fill="#5b1416" stroke="${INK}" stroke-width="3"/>` : '') +
      (st.hold && ITEMS[st.hold] ? `<g transform="translate(46,-70) rotate(${st.hold === 'keys' ? Math.sin(st.t * 12) * 15 : 180})">${ITEMS[st.hold]}</g><circle cx="46" cy="-74" r="11" fill="#5f646c" stroke="${INK}" stroke-width="3"/>` : '') +
      `</g>`;
  }

  function character(id, place, st) {
    const c = EP.cast[id];
    const inner = c.kind === 'raccoon' ? raccoon(st) : person(c, c.look, st);
    const f = place.facing || 1, s = place.s || 1;
    const jx = st.speaking && st.emote === 'angry' ? Math.sin(st.t * 40) * 1.6 : 0;
    return `<g transform="translate(${place.x + jx},${GROUND + (place.y || 0) + (st.yOff || 0)}) scale(${s * f},${s})">${inner}</g>`;
  }

  // ---------------- props ----------------
  function dial(x, v, t, label) {
    const cx = x, cy = 380, R = 110;
    const ang = a => Math.PI - (a / 11) * Math.PI;
    let ticks = '';
    for (let i = 0; i <= 11; i++) {
      const a = ang(i), x1 = cx + Math.cos(a) * (R - 18), y1 = cy - Math.sin(a) * (R - 18), x2 = cx + Math.cos(a) * R, y2 = cy - Math.sin(a) * R;
      ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="4"/>`;
      if ([0, 5, 10].includes(i)) ticks += `<text x="${cx + Math.cos(a) * (R - 36)}" y="${cy - Math.sin(a) * (R - 36) + 7}" font-family="Bangers" font-size="22" text-anchor="middle" fill="${INK}">${i}</text>`;
    }
    const a = ang(v), hot = v > 10.2;
    return `<g>` +
      `<rect x="${cx - 16}" y="${cy}" width="32" height="${GROUND - cy - 40}" fill="#9e9e9e" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="${cx - 80}" y="${GROUND - 60}" width="160" height="60" rx="10" fill="#607d8b" stroke="${INK}" stroke-width="4"/>` +
      `<text x="${cx}" y="${GROUND - 22}" font-family="Bangers" font-size="22" text-anchor="middle" fill="#fff">EMPATHY-O-MATIC</text>` +
      `<path d="M${cx - R - 14},${cy} A${R + 14},${R + 14} 0 0 1 ${cx + R + 14},${cy} Z" fill="${hot ? '#ffcdd2' : '#fff8e1'}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${cx + Math.cos(ang(10)) * R},${cy - Math.sin(ang(10)) * R} A${R},${R} 0 0 1 ${cx + R},${cy} L${cx},${cy} Z" fill="#e53935" opacity=".85"/>` +
      `<text x="${cx + R + 18}" y="${cy - 14}" font-family="Bangers" font-size="22" fill="#e53935">${esc(label || '11: UH-OH')}</text>` +
      ticks +
      `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * (R - 8)}" y2="${cy - Math.sin(a) * (R - 8)}" stroke="${hot ? '#b71c1c' : INK}" stroke-width="7" stroke-linecap="round"/>` +
      `<circle cx="${cx}" cy="${cy}" r="12" fill="${INK}"/>` +
      (hot ? `<circle cx="${cx}" cy="${cy - R - 30}" r="12" fill="${Math.sin(t * 14) > 0 ? '#ff1744' : '#7f0000'}" stroke="${INK}" stroke-width="3"/>` : '') +
      `</g>`;
  }

  function phone(x, likes, k) {
    const n = Math.floor(k * 1000000).toLocaleString('en-US');
    return `<g transform="translate(${x},250) rotate(8)"><rect width="150" height="250" rx="22" fill="#263238" stroke="${INK}" stroke-width="5"/>` +
      `<rect x="12" y="20" width="126" height="200" rx="8" fill="#e3f2fd"/>` +
      `<text x="75" y="70" font-family="Bangers" font-size="22" text-anchor="middle" fill="#37474f">I CARE MORE</text><text x="75" y="94" font-family="Bangers" font-size="22" text-anchor="middle" fill="#37474f">THAN YOU</text>` +
      `<text x="75" y="160" font-size="50" text-anchor="middle" fill="#e91e63">♥</text>` +
      `<text x="75" y="200" font-family="Bangers" font-size="24" text-anchor="middle" fill="#e91e63">${n}</text></g>`;
  }

  // ---------------- backgrounds: return [behind, infront] ----------------
  const BG = {
    newsroom(st) {
      const g = st.graphic;
      return [
        `<rect width="${W}" height="${H}" fill="#123a7a"/>` +
        Array.from({ length: 9 }, (_, i) => `<rect x="${i * 150 - 20}" y="0" width="70" height="${H}" fill="#1a4b96" opacity=".6"/>`).join('') +
        `<circle cx="1040" cy="210" r="120" fill="#ffd43b" stroke="#fff" stroke-width="8"/>` +
        `<text x="1040" y="200" font-family="Bangers" font-size="70" text-anchor="middle" fill="#123a7a">KNN</text>` +
        `<text x="1040" y="250" font-family="Bangers" font-size="24" text-anchor="middle" fill="#123a7a">KINDLETON NEWS</text>` +
        (g ? `<g transform="translate(90,120)"><rect width="440" height="230" rx="12" fill="#fff" stroke="${INK}" stroke-width="6"/>` +
          `<rect width="440" height="44" rx="12" fill="#e53935"/><text x="20" y="32" font-family="Bangers" font-size="28" fill="#fff">KNN EXCLUSIVE</text>` +
          `<text x="220" y="${st.graphicSub ? 150 : 165}" font-family="Bangers" font-size="${g.length > 14 ? 50 : 64}" text-anchor="middle" fill="${INK}">${esc(g)}</text>` +
          (st.graphicSub ? `<text x="220" y="205" font-family="Nunito" font-weight="700" font-size="24" text-anchor="middle" fill="#555">${esc(st.graphicSub)}</text>` : '') + `</g>` : ''),
        `<path d="M200,520 L1080,520 L1130,${H} L150,${H} Z" fill="#8d5524" stroke="${INK}" stroke-width="6"/>` +
        `<rect x="190" y="505" width="900" height="30" rx="6" fill="#a1683a" stroke="${INK}" stroke-width="6"/>` +
        `<rect x="540" y="560" width="200" height="60" rx="8" fill="#ffd43b" stroke="${INK}" stroke-width="4"/><text x="640" y="602" font-family="Bangers" font-size="34" text-anchor="middle" fill="#123a7a">KNN</text>` +
        `<rect x="0" y="${H - 44}" width="${W}" height="44" fill="#e53935"/>` +
        `<text x="${W - ((st.t * 110) % (W + 1400))}" y="${H - 12}" font-family="Bangers" font-size="28" fill="#fff">BREAKING: TOWN DECLARES ITSELF NICEST ON EARTH • RACCOON SIGHTINGS UP 400% • LOCAL MAN STILL CANNOT SAY NO • WEATHER: WARM AND FUZZY</text>`];
    },
    townsquare(st) {
      const cl = x => `<g transform="translate(${((x + st.t * 12) % 1500) - 150},0)"><ellipse cx="0" cy="110" rx="70" ry="30" fill="#fff"/><ellipse cx="45" cy="95" rx="50" ry="32" fill="#fff"/><ellipse cx="-40" cy="100" rx="40" ry="24" fill="#fff"/></g>`;
      return [
        `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ec8f2"/><stop offset="1" stop-color="#bdeeff"/></linearGradient></defs>` +
        `<rect width="${W}" height="${H}" fill="url(#sky)"/>` + cl(100) + cl(650) + cl(1100) +
        `<rect x="0" y="330" width="${W}" height="200" fill="#9ccc65"/>` +
        [[40, 220, '#f48fb1'], [180, 260, '#80cbc4'], [940, 240, '#ffcc80'], [1080, 200, '#ce93d8']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="130" height="${560 - y}" fill="${c}" stroke="${INK}" stroke-width="4"/><rect x="${x + 25}" y="${y + 30}" width="30" height="36" fill="#b3e5fc" stroke="${INK}" stroke-width="3"/><rect x="${x + 75}" y="${y + 30}" width="30" height="36" fill="#b3e5fc" stroke="${INK}" stroke-width="3"/>`).join('') +
        `<g><rect x="420" y="170" width="440" height="390" fill="#f5e6c8" stroke="${INK}" stroke-width="5"/><path d="M400,175 L640,60 L880,175 Z" fill="#c62828" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="640" cy="130" r="34" fill="#fff" stroke="${INK}" stroke-width="4"/><line x1="640" y1="130" x2="640" y2="106" stroke="${INK}" stroke-width="4"/><line x1="640" y1="130" x2="658" y2="136" stroke="${INK}" stroke-width="4"/>` +
        [460, 540, 700, 780].map(x => `<rect x="${x}" y="220" width="40" height="240" fill="#e0cfa9" stroke="${INK}" stroke-width="3"/>`).join('') +
        `<text x="640" y="205" font-family="Bangers" font-size="28" text-anchor="middle" fill="${INK}">KINDLETON TOWN HALL</text></g>` +
        `<path d="M300,300 Q640,350 980,300 L980,250 Q640,300 300,250 Z" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="640" y="300" font-family="Bangers" font-size="40" text-anchor="middle" fill="#d81b60">♥ HAPPY EMPATHY DAY ♥</text>` +
        `<rect x="0" y="540" width="${W}" height="${H - 540}" fill="#bdbdbd"/><rect x="0" y="540" width="${W}" height="10" fill="#9e9e9e"/>`,
        ''];
    },
    livingroom(st) {
      return [
        `<rect width="${W}" height="${H}" fill="#f8bbd0"/>` +
        Array.from({ length: 22 }, (_, i) => `<rect x="${i * 60}" y="0" width="22" height="520" fill="#f48fb1" opacity=".45"/>`).join('') +
        `<rect x="0" y="500" width="${W}" height="24" fill="#8d6e63" stroke="${INK}" stroke-width="3"/>` +
        `<rect x="0" y="524" width="${W}" height="${H - 524}" fill="#a1887f"/>` +
        `<rect x="120" y="200" width="150" height="330" fill="#6d4c41" stroke="${INK}" stroke-width="5"/><circle cx="245" cy="370" r="9" fill="#ffd43b" stroke="${INK}" stroke-width="3"/>` +
        `<rect x="640" y="110" width="200" height="150" fill="#b3e5fc" stroke="${INK}" stroke-width="6"/><line x1="740" y1="110" x2="740" y2="260" stroke="${INK}" stroke-width="5"/><line x1="640" y1="185" x2="840" y2="185" stroke="${INK}" stroke-width="5"/>` +
        `<g transform="translate(400,130)"><rect width="140" height="100" fill="#fff59d" stroke="${INK}" stroke-width="5"/><text x="70" y="62" font-size="44" text-anchor="middle" fill="#e53935">♥</text><text x="70" y="88" font-family="Bangers" font-size="16" text-anchor="middle" fill="${INK}">LIVE LAUGH LET IN</text></g>` +
        `<g transform="translate(900,330)"><rect x="0" y="40" width="300" height="130" rx="30" fill="#26a69a" stroke="${INK}" stroke-width="5"/><rect x="20" y="0" width="260" height="90" rx="26" fill="#2bbbad" stroke="${INK}" stroke-width="5"/><rect x="10" y="168" width="20" height="24" fill="#5d4037"/><rect x="270" y="168" width="20" height="24" fill="#5d4037"/></g>` +
        `<g transform="translate(1180,170)"><rect x="-6" y="60" width="12" height="300" fill="#8d6e63"/><path d="M-50,60 L50,60 L30,0 L-30,0 Z" fill="#ffe082" stroke="${INK}" stroke-width="4"/></g>`,
        ''];
    },
    chalkboard(st) {
      const lines = st.board || [];
      return [
        `<rect width="${W}" height="${H}" fill="#efe0c0"/><rect x="0" y="520" width="${W}" height="${H - 520}" fill="#8d6e63"/>` +
        `<rect x="60" y="70" width="640" height="380" fill="#a1683a" stroke="${INK}" stroke-width="6"/><rect x="80" y="90" width="600" height="340" fill="#2f5d3a"/>` +
        lines.map((l, i) => `<text x="${i === 0 ? 380 : 110}" y="${150 + i * (lines.length > 4 ? 56 : 66)}" font-family="${i === 0 ? 'Bangers' : 'Nunito'}" font-weight="800" font-size="${i === 0 ? 50 : 38}" ${i === 0 ? 'text-anchor="middle"' : ''} fill="#f5f5f5" opacity=".95">${esc(l)}</text>`).join('') +
        `<rect x="70" y="448" width="620" height="14" fill="#a1683a" stroke="${INK}" stroke-width="3"/>` +
        `<rect x="920" y="120" width="270" height="70" rx="8" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="1055" y="166" font-family="Bangers" font-size="30" text-anchor="middle" fill="#c62828">KINDLETON U.</text>`,
        `<g transform="translate(870,470)"><rect width="140" height="170" fill="#795548" stroke="${INK}" stroke-width="5"/><rect x="-10" y="-14" width="160" height="22" fill="#8d6e63" stroke="${INK}" stroke-width="5"/></g>`];
    },
    bar(st) {
      const neon = Math.sin(st.t * 9) > -0.85 ? 1 : 0.35;
      let bottles = '';
      for (let i = 0; i < 16; i++) { const c = ['#2e7d32', '#6d4c41', '#c62828', '#f9a825', '#1565c0'][i % 5]; const x = 380 + i * 34, y = i % 2 ? 196 : 296;
        bottles += `<rect x="${x}" y="${y}" width="20" height="44" rx="5" fill="${c}" stroke="${INK}" stroke-width="3"/><rect x="${x + 6}" y="${y - 16}" width="8" height="18" fill="${c}" stroke="${INK}" stroke-width="3"/>`; }
      return [
        `<rect width="${W}" height="${H}" fill="#3e2a1f"/>` +
        Array.from({ length: 14 }, (_, i) => `<rect x="${i * 96}" y="0" width="4" height="${H}" fill="#2a1b13"/>`).join('') +
        `<rect x="350" y="240" width="580" height="12" fill="#795548" stroke="${INK}" stroke-width="3"/><rect x="350" y="340" width="580" height="12" fill="#795548" stroke="${INK}" stroke-width="3"/>` + bottles +
        `<g opacity="${neon}"><text x="640" y="120" font-family="Bangers" font-size="74" text-anchor="middle" fill="#ff4081" stroke="#ffd1e3" stroke-width="2">THE MORAL HAZARD</text>` +
        `<text x="640" y="160" font-family="Bangers" font-size="26" text-anchor="middle" fill="#80deea">COCKTAILS • REGRET • KARAOKE THURSDAYS</text></g>` +
        `<g transform="translate(1040,190)"><rect width="170" height="110" fill="#fff8e1" stroke="${INK}" stroke-width="4"/><text x="85" y="40" font-family="Bangers" font-size="22" text-anchor="middle" fill="${INK}">HAPPY HOUR</text><text x="85" y="72" font-family="Bangers" font-size="18" text-anchor="middle" fill="#c62828">ALL FEELINGS</text><text x="85" y="96" font-family="Bangers" font-size="18" text-anchor="middle" fill="#c62828">HALF PRICE</text></g>` +
        `<rect x="0" y="560" width="${W}" height="${H - 560}" fill="#2a1b13"/>`,
        `<rect x="0" y="470" width="${W}" height="30" fill="#8d5524" stroke="${INK}" stroke-width="5"/><rect x="0" y="500" width="${W}" height="${H - 500}" fill="#5d3a1a" stroke="${INK}" stroke-width="5"/>` +
        Array.from({ length: 7 }, (_, i) => `<rect x="${i * 190 + 30}" y="520" width="120" height="${H - 520}" fill="#4e3015" stroke="${INK}" stroke-width="3"/>`).join('')];
    },
    tvstudio(st) {
      const pod = (x, label, c) => `<g transform="translate(${x - 90},440)"><path d="M0,0 L180,0 L160,200 L20,200 Z" fill="${c}" stroke="${INK}" stroke-width="5"/><text x="90" y="70" font-family="Bangers" font-size="34" text-anchor="middle" fill="#fff">${label}</text></g>`;
      return [
        `<rect width="${W}" height="${H}" fill="#1a1033"/>` +
        `<rect x="0" y="0" width="640" height="${H}" fill="#c62828" opacity=".55"/><rect x="640" y="0" width="640" height="${H}" fill="#1565c0" opacity=".55"/>` +
        `<path d="M200,0 L120,${H} L380,${H} Z M1080,0 L900,${H} L1160,${H} Z" fill="#fff" opacity=".07"/>` +
        `<text x="640" y="110" font-family="Bangers" font-size="90" text-anchor="middle" fill="#fff" stroke="${INK}" stroke-width="4">HEART vs HEAD</text>` +
        `<text x="200" y="230" font-size="120" text-anchor="middle" fill="#ff8a80" opacity=".6">♥</text>` +
        `<rect x="0" y="600" width="${W}" height="${H - 600}" fill="#0d0820"/>`,
        pod(330, 'HEAD', '#37474f') + pod(950, 'HEART', '#ad1457')];
    }
  };

  // ---------------- effects ----------------
  function hearts(k, t) {
    let s = '';
    for (let i = 0; i < 26; i++) {
      const x = (hash('h' + i) * W), sp = 120 + hash('s' + i) * 180, y = H + 40 - ((k * sp + hash('o' + i) * 400) % (H + 120));
      s += `<text x="${x + Math.sin(t * 3 + i) * 20}" y="${y}" font-size="${30 + hash('z' + i) * 40}" fill="${i % 3 ? '#ff4081' : '#ff8a80'}" opacity=".9">♥</text>`;
    }
    return s;
  }

  function burst(text, k) {
    const sc = easeOutBack(clamp(k * 3, 0, 1));
    let pts = '';
    for (let i = 0; i < 24; i++) { const r = i % 2 ? 90 : 150, a = i / 24 * Math.PI * 2; pts += `${Math.cos(a) * r * 1.5},${Math.sin(a) * r} `; }
    return `<g transform="translate(980,180) scale(${sc}) rotate(-8)"><polygon points="${pts}" fill="#ffeb3b" stroke="${INK}" stroke-width="6"/><text x="0" y="22" font-family="Bangers" font-size="70" text-anchor="middle" fill="#e53935" stroke="${INK}" stroke-width="2">${esc(text)}</text></g>`;
  }

  // ---------------- cards & captions ----------------
  function card(seg, k, t) {
    let rays = '';
    for (let i = 0; i < 24; i++) rays += `<path d="M0,0 L${Math.cos(i / 24 * 6.283) * 1600},${Math.sin(i / 24 * 6.283) * 1600} L${Math.cos((i + .5) / 24 * 6.283) * 1600},${Math.sin((i + .5) / 24 * 6.283) * 1600} Z" fill="${i % 2 ? '#ffb300' : '#ffd43b'}"/>`;
    const sc = easeOutBack(clamp(k * 2.2, 0, 1));
    const big = seg.title.length < 14;
    return `<rect width="${W}" height="${H}" fill="#ffd43b"/><g transform="translate(640,360) rotate(${t * 8})">${rays}</g>` +
      `<g transform="translate(640,${seg.sub ? 330 : 380}) scale(${sc})"><text text-anchor="middle" font-family="Bangers" font-size="${big ? 170 : 96}" fill="#fff" stroke="${INK}" stroke-width="${big ? 10 : 7}" paint-order="stroke">${esc(seg.title)}</text></g>` +
      (seg.sub ? wrap(seg.sub, 60).map((l, i) => `<text x="640" y="${440 + i * 44}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="${INK}" opacity="${clamp(k * 4 - 0.6, 0, 1)}">${esc(l)}</text>`).join('') : '');
  }

  function wrap(text, n) {
    const out = []; let cur = '';
    for (const w of text.split(' ')) { if ((cur + ' ' + w).trim().length > n) { out.push(cur.trim()); cur = w; } else cur += ' ' + w; }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  function caption(who, text) {
    const lines = wrap(text, 64), y0 = H - 30 - lines.length * 40;
    const wMax = Math.max(...lines.map(l => l.length)) * 16.5 + 60;
    return `<rect x="${640 - wMax / 2}" y="${y0 - 36}" width="${wMax}" height="${lines.length * 40 + 46}" rx="14" fill="#000" opacity=".5"/>` +
      `<g font-family="Nunito" font-weight="800" text-anchor="middle">` +
      `<text x="640" y="${y0 - 8}" font-family="Bangers" font-size="26" fill="#ffd43b" stroke="${INK}" stroke-width="5" paint-order="stroke">${esc(who)}</text>` +
      lines.map((l, i) => `<text x="640" y="${y0 + 30 + i * 40}" font-size="33" fill="#fff" stroke="${INK}" stroke-width="7" paint-order="stroke">${esc(l)}</text>`).join('') + `</g>`;
  }

  // ---------------- scene state ----------------
  function sceneState(seg, idx) {
    // carry board/graphic/dial values forward through the scene up to line idx
    const st = { board: null, graphic: null, graphicSub: null, dialFrom: seg.props && seg.props.dial ? seg.props.dial.value : 0, dialTo: null };
    st.dialTo = st.dialFrom;
    for (let i = 0; i <= idx; i++) {
      const l = seg.lines[i];
      if (l.board) st.board = l.board;
      if (l.graphic) { st.graphic = l.graphic; st.graphicSub = l.sub || null; }
      if (l.dial !== undefined) { st.dialFrom = st.dialTo; st.dialTo = l.dial; if (i < idx) st.dialFrom = l.dial; }
    }
    return st;
  }

  function camera(seg, line, idx, speakerPlace, speakerH) {
    const n = Object.keys(seg.chars).length;
    if (line.cam === 'wide') return { z: 1, cx: 640, cy: 360 };
    const close = line.cam === 'close' || (n > 1 ? idx % 3 !== 0 : idx % 2 === 1);
    if (!close || !speakerPlace) return { z: n > 1 ? 1 : 1.06, cx: 640, cy: 360 };
    const z = line.cam === 'close' && n === 1 ? 1.6 : n > 1 ? 1.45 : 1.3;
    const headY = GROUND - 330 * (speakerPlace.s || 1) * speakerH;
    return { z, cx: speakerPlace.x, cy: headY + 120 };
  }

  // background townsfolk for big public scenes
  const CROWD_LOOKS = [
    { hair: 'flop', hairColor: '#333', shirt: '#ef5350', pants: '#37474f' }, { hair: 'curly', hairColor: '#795548', shirt: '#26a69a', pants: '#455a64', skirt: true },
    { hair: 'bald', hairColor: '#999', shirt: '#5c6bc0', pants: '#3e2723', mustache: true }, { hair: 'helmet', hairColor: '#ffca28', shirt: '#ff7043', pants: '#263238' },
    { hair: 'bouffant', hairColor: '#8e24aa', shirt: '#9ccc65', pants: '#9ccc65', skirt: true }, { hair: 'pigtails', hairColor: '#212121', bow: '#ff4081', shirt: '#29b6f6', pants: '#29b6f6', skirt: true, height: 0.75 },
    { hair: 'flop', hairColor: '#b71c1c', shirt: '#fdd835', pants: '#1565c0', glasses: true }, { hair: 'curly', hairColor: '#3e2723', shirt: '#ab47bc', pants: '#424242', beard: '#3e2723' }
  ];
  function crowd(t, cheering, mood) {
    let s = '';
    const xs = [70, 150, 235, 420, 500, 760, 840, 1180, 1250, 330, 680, 1010];
    xs.forEach((x, i) => {
      const look = CROWD_LOOKS[i % CROWD_LOOKS.length];
      const hop = cheering ? -Math.abs(Math.sin(t * 7 + i)) * 18 : Math.sin(t * 1.5 + i) * 1.5;
      const back = i >= 9;
      s += `<g transform="translate(${x},${(back ? 560 : 590) + hop}) scale(${(back ? 0.36 : 0.44) * (i % 2 ? -1 : 1)},${back ? 0.36 : 0.44})">` +
        person(null, look, { t: t + i, speaking: cheering, act: cheering ? 'armsup' : '', mouth: cheering ? 0.7 : 0, look: 1, blink: ((t + i) % 4.1) < 0.13, emote: mood }) + `</g>`;
    });
    return s;
  }

  function renderAt(t) {
    const shots = TL.shots;
    let i = shots.findIndex(s => t < s.end + 0.0001 && t >= s.start - 0.0001);
    if (i < 0) { // in a gap: hold the previous shot's last frame
      i = 0; for (let j = 0; j < shots.length; j++) if (shots[j].start <= t) i = j;
    }
    const shot = shots[i], seg = SEG[shot.seg];
    const local = Math.max(0, t - shot.start), dur = shot.end - shot.start, k = clamp(local / dur, 0, 1);
    let out = `<defs><filter id="drain"><feColorMatrix type="saturate" values="0.08"/></filter></defs>`;

    if (shot.type === 'card') {
      SVG.innerHTML = out + card(seg, local / dur, t);
      return;
    }
    const line = seg.lines[shot.idx];
    const st = sceneState(seg, shot.idx);
    st.t = t;
    st.dialLabel = seg.props && seg.props.dial && seg.props.dial.label;
    const [behind, front] = BG[seg.bg](st);
    let chars = '';
    const sceneLocal = shot.idx === 0 ? local : 99;
    for (const [id, place0] of Object.entries(seg.chars)) {
      const speaking = id === line.who && local <= dur;
      let m = 0;
      if (speaking && shot.env) {
        const e = shot.env[Math.min(shot.env.length - 1, Math.floor(local * TL.envFps))] || 0;
        m = e < 0.12 ? 0 : e < 0.4 ? 0.35 : e < 0.7 ? 0.7 : 1;
      }
      // walk-on entrance during the scene's first shot
      let place = place0, walk = 0;
      if (place0.enter && sceneLocal < 0.9) {
        const ke = 1 - Math.pow(1 - sceneLocal / 0.9, 3);
        const off = place0.enter === 'left' ? -(place0.x + 160) : (W - place0.x + 160);
        place = Object.assign({}, place0, { x: place0.x + off * (1 - ke) });
        walk = -Math.abs(Math.sin(sceneLocal * 16)) * 12 * (1 - ke);
      }
      const speakerX = seg.chars[line.who] ? seg.chars[line.who].x : place.x;
      const lookDir = (speaking ? 1 : Math.sign((speakerX - place.x) * (place.facing || 1)) || 1);
      const blink = ((t + hash(id) * 5) % 3.9) < 0.13;
      const yOff = (speaking && line.act === 'bounce' ? -Math.abs(Math.sin(local * 9)) * 26 : 0) + walk;
      const react = (line.react || {})[id];
      const hold = (line.hold && line.hold[id]) || place0.hold;
      chars += character(id, place, {
        t: t + hash(id) * 10, speaking, mouth: m, look: lookDir, blink, yOff, hold,
        emote: speaking ? (line.emote || 'neutral') : (react || 'neutral'),
        act: line.act
      });
    }
    let props = '';
    if (seg.props && seg.props.dial) {
      const kk = clamp(local / 1.4, 0, 1), wob = st.dialTo !== st.dialFrom ? Math.sin(kk * 18) * (1 - kk) * 0.6 : 0;
      const v = lerp(st.dialFrom, st.dialTo, line.dial !== undefined ? easeOutBack(kk) : 1) + wob;
      props += dial(seg.props.dial.x, clamp(v, -0.3, 11.4), t, st.dialLabel);
    }
    if (seg.props && seg.props.phone) props += phone(seg.chars.mayor.x + 150, seg.props.phone.likes, clamp(k * 1.3, 0, 1));
    const extras = seg.crowd ? crowd(t, line.fx === 'hearts', line.fx === 'drain' ? 'deadpan' : 'happy') : '';

    const sp = seg.chars[line.who], spH = (EP.cast[line.who].look || {}).height || 0.5;
    const cam = camera(seg, line, shot.idx, sp, spH);
    const z = cam.z * (1 + 0.035 * k);
    let tx = clamp(640 - cam.cx * z, W - W * z, 0), ty = clamp(360 - cam.cy * z, H - H * z, 0);
    if (line.fx === 'shake' && local > 0.7 && local < 1.6) { tx += Math.sin(t * 90) * 14; ty += Math.cos(t * 77) * 10; }

    let world = behind + extras + props + chars + front;
    if (line.fx === 'hearts') world += hearts(local, t);
    const BURST = { chomp: 'CHOMP!', crash: 'CRASH!', chitter: 'CHITTER!' };
    if (EP.cast[line.who].kind && line.sfx) world += burst(BURST[line.sfx] || '!', local / dur);
    out += `<g transform="translate(${tx},${ty}) scale(${z})" ${line.fx === 'drain' ? 'filter="url(#drain)"' : ''}>${world}</g>`;
    out += caption(EP.cast[line.who].name, line.text);
    out += `<text x="${W - 24}" y="40" text-anchor="end" font-family="Bangers" font-size="26" fill="#fff" stroke="${INK}" stroke-width="5" paint-order="stroke" opacity=".85">${esc(EP.meta.show)}</text>`;
    if (EP.meta.rating === 'adult') out += `<text x="${W - 24}" y="66" text-anchor="end" font-family="Bangers" font-size="20" fill="#fff" stroke="${INK}" stroke-width="5" paint-order="stroke" opacity=".8">TV-MA L</text>`;

    // iris wipe: opens on a scene's first shot, closes in the gap after its last shot
    const last = shot.idx === seg.lines.length - 1, gapT = t - shot.end;
    let r = null;
    if (shot.idx === 0 && local < 0.35) r = 820 * Math.pow(local / 0.35, 1.5);
    if (last && gapT > 0) r = 820 * Math.max(0, 1 - gapT / ((EP.meta.gap || 0.3) * 0.95));
    if (r !== null && r < 819) out += `<path fill-rule="evenodd" fill="#000" d="M0,0H${W}V${H}H0Z M${640 - r},330 a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0Z"/>`;
    SVG.innerHTML = out;
  }

  function load(ep, tl, svg) {
    EP = ep; TL = tl; SVG = svg; SEG = {};
    for (const s of ep.sequence) SEG[s.id] = s;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  }

  window.Toon = { load, renderAt, get duration() { return TL ? TL.duration : 0; } };
})();
