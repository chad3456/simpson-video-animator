/* Lamplight: theatre renderer, sound, and the shared timing logic.
   The cloth is 1600 x 900 units. A lamp at distance z behind the cloth throws
   the shadow of a puppet held at depth d (0 = pressed on the cloth) enlarged by
   z / (z - d) and softened by the size of the flame. */
(function (root) {
  const LL = root.LL || (root.LL = {});
  const W = (LL.W = 1600), H = (LL.H = 900);
  const clamp = (LL.clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)));
  const lerp = (LL.lerp = (a, b, f) => a + (b - a) * f);
  LL.seg = (p, a, b) => clamp((p - a) / (b - a));
  LL.ease = (f) => (f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2);
  LL.easeOut = (f) => 1 - Math.pow(1 - f, 3);
  LL.flicker = (t) => 0.9 + 0.05 * Math.sin(t * 7.3) + 0.03 * Math.sin(t * 17.1 + 1) + 0.02 * Math.sin(t * 31.7 + 2);

  // ------------------------------------------------------------------ theatre
  class Theatre {
    constructor(canvas) {
      this.cv = canvas;
      this.g = canvas.getContext('2d');
      this.off = document.createElement('canvas');
      this.sil = document.createElement('canvas');
      this.hasFilter = typeof this.g.filter === 'string';
      this.resize(canvas.width, canvas.height);
    }
    resize(w, h) {
      this.cv.width = w; this.cv.height = h;
      this.off.width = this.sil.width = w;
      this.off.height = this.sil.height = h;
      this.k = w / W;
      this.zoom(1.14, 800, 468);
      this.og = this.off.getContext('2d');
      this.sg = this.sil.getContext('2d');
      this.cloth = this.makeCloth();
    }
    zoom(Z, cx, cy) {
      this.Z = Z; this.k2 = this.k * Z;
      this.ox = this.k * (W / 2 - Z * cx); this.oy = this.k * (H / 2 - Z * cy);
    }
    makeCloth() {
      const c = document.createElement('canvas');
      c.width = c.height = 384;
      const g = c.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, 384, 384);
      let s = 7;
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < 384; i += 3) {
        g.fillStyle = `rgba(120,80,50,${0.03 + rnd() * 0.05})`; g.fillRect(0, i, 384, 1);
        g.fillStyle = `rgba(120,80,50,${0.03 + rnd() * 0.05})`; g.fillRect(i, 0, 1, 384);
      }
      for (let i = 0; i < 900; i++) {
        g.fillStyle = `rgba(90,60,30,${rnd() * 0.08})`;
        g.fillRect(rnd() * 384, rnd() * 384, 1 + rnd() * 2, 1);
      }
      return this.g.createPattern(c, 'repeat');
    }

    // scene: { lamp:{x,y,z,on}, t, items:[], tint, ambient, shake, flash, fx:[], view, caption, title }
    render(sc) {
      if (sc.view === 'back') return this.renderBack(sc);
      const { g, k } = this;
      const cw = this.cv.width, ch = this.cv.height;
      const L = sc.lamp, t = sc.t;
      const z = clamp(L.z == null ? 1 : L.z, 0.2, 1.6);
      const sx = sc.shake ? Math.sin(t * 61) * sc.shake * 10 * k : 0;
      const sy = sc.shake ? Math.cos(t * 47) * sc.shake * 8 * k : 0;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      if (this.hasFilter) g.filter = 'none';
      g.fillStyle = '#0a0402'; g.fillRect(0, 0, cw, ch);
      g.setTransform(this.k2, 0, 0, this.k2, this.ox + sx, this.oy + sy);
      // --- light on the cloth
      const I = clamp(L.on) * LL.flicker(t) * (sc.dim == null ? 1 : sc.dim);
      if (I > 0.001) {
        const R = 1000 * Math.pow(z, 0.8);
        const gr = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, R);
        gr.addColorStop(0, `rgba(255,238,200,${I})`);
        gr.addColorStop(0.25, `rgba(252,200,125,${I * 0.95})`);
        gr.addColorStop(0.55, `rgba(200,110,45,${I * 0.55})`);
        gr.addColorStop(1, `rgba(50,16,5,${I * 0.18})`);
        g.globalCompositeOperation = 'lighter';
        g.fillStyle = gr; g.fillRect(-400, -300, W + 800, H + 600);
      }
      if (sc.ambient) {
        g.globalCompositeOperation = 'lighter';
        g.fillStyle = `rgba(255,205,130,${sc.ambient * 0.85})`;
        g.fillRect(-400, -300, W + 800, H + 600);
      }
      if (sc.tint) {
        g.globalCompositeOperation = 'multiply';
        g.fillStyle = sc.tint; g.fillRect(-400, -300, W + 800, H + 600);
      }
      g.globalCompositeOperation = 'multiply';
      g.setTransform(1, 0, 0, 1, sx, sy);
      g.globalAlpha = 0.7; g.fillStyle = this.cloth; g.fillRect(-20, -20, cw + 40, ch + 40);
      g.globalAlpha = 1;
      // --- puppets, batched by depth
      this.drawItems(sc.items || [], L, z, sx, sy, 'front', t);
      // --- additive light effects
      g.setTransform(this.k2, 0, 0, this.k2, this.ox + sx, this.oy + sy);
      g.globalCompositeOperation = 'lighter';
      for (const f of sc.fx || []) { g.save(); f(g, t); g.restore(); }
      g.globalCompositeOperation = 'source-over';
      if (sc.flash) {
        g.globalCompositeOperation = 'lighter';
        g.fillStyle = `rgba(255,240,210,${sc.flash})`; g.fillRect(-50, -50, W + 100, H + 100);
        g.globalCompositeOperation = 'source-over';
      }
      this.frame(t, I);
      if (sc.caption) this.caption(sc.caption, sc.captionA == null ? 1 : sc.captionA);
    }

    drawItems(items, L, z, sx, sy, view, t) {
      const { g, og, sg, k } = this;
      const cw = this.cv.width, ch = this.cv.height;
      const list = items.filter((it) => it && (it.alpha == null || it.alpha > 0.003));
      list.sort((a, b) => (b.d || 0) - (a.d || 0));
      let i = 0;
      while (i < list.length) {
        const d0 = Math.min(list[i].d || 0, z - 0.06), ink = list[i].ink || 0, al = list[i].alpha == null ? 1 : list[i].alpha;
        let j = i;
        og.setTransform(1, 0, 0, 1, 0, 0);
        og.globalCompositeOperation = 'source-over'; og.globalAlpha = 1;
        og.clearRect(0, 0, cw, ch);
        const s = z / (z - d0);
        while (j < list.length) {
          const it = list[j];
          const dj = Math.min(it.d || 0, z - 0.06);
          if (j > i && (Math.abs(dj - d0) > 1e-4 || (it.ink || 0) !== ink || (it.alpha == null ? 1 : it.alpha) !== al)) break;
          const k2 = this.k2;
          og.setTransform(k2 * s, 0, 0, k2 * s, k2 * L.x * (1 - s) + this.ox + sx, k2 * L.y * (1 - s) + this.oy + sy);
          og.translate(it.x || 0, it.y || 0);
          if (it.rot) og.rotate(it.rot);
          const sc = it.s || 1;
          og.scale(it.flip ? -sc : sc, sc);
          og.lineCap = 'round';
          it.draw(og, t);
          j++;
        }
        const blur = this.hasFilter ? Math.min(28, (55 * d0) / (z - d0)) * k * (list[i].sharp || 1) : 0;
        g.setTransform(1, 0, 0, 1, 0, 0);
        if (blur > 0.4) g.filter = `blur(${blur.toFixed(1)}px)`;
        if (view === 'front') {
          if (ink < 1) {
            g.globalCompositeOperation = 'multiply';
            g.globalAlpha = (1 - ink) * al;
            g.drawImage(this.off, 0, 0);
          }
          if (ink > 0) {
            sg.setTransform(1, 0, 0, 1, 0, 0);
            sg.globalCompositeOperation = 'source-over';
            sg.clearRect(0, 0, cw, ch);
            sg.drawImage(this.off, 0, 0);
            sg.globalCompositeOperation = 'source-in';
            sg.fillStyle = '#140804'; sg.fillRect(0, 0, cw, ch);
            g.globalCompositeOperation = 'multiply';
            g.globalAlpha = ink * al * 0.94;
            g.drawImage(this.sil, 0, 0);
          }
        } else {
          // back of the cloth: only soft shadows show through
          sg.setTransform(1, 0, 0, 1, 0, 0);
          sg.globalCompositeOperation = 'source-over';
          sg.clearRect(0, 0, cw, ch);
          sg.drawImage(this.off, 0, 0);
          sg.globalCompositeOperation = 'source-in';
          sg.fillStyle = '#2a1206'; sg.fillRect(0, 0, cw, ch);
          g.globalCompositeOperation = 'multiply';
          g.globalAlpha = 0.55 * al;
          g.drawImage(this.sil, 0, 0);
        }
        g.globalAlpha = 1;
        if (this.hasFilter) g.filter = 'none';
        g.globalCompositeOperation = 'source-over';
        i = j;
      }
    }

    // the stage around the cloth: a patterned valance and a dark vignette
    frame(t, I) {
      const { g, k } = this;
      g.setTransform(k, 0, 0, k, 0, 0);
      g.globalCompositeOperation = 'source-over';
      const vg = g.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(6,2,0,0.72)');
      g.fillStyle = vg; g.fillRect(0, 0, W, H);
      // valance
      const lit = 0.25 + I * 0.35;
      g.fillStyle = `rgb(${Math.round(70 * lit + 20)},${Math.round(14 * lit + 4)},${Math.round(10 * lit + 3)})`;
      g.fillRect(0, 0, W, 34);
      g.fillStyle = `rgba(220,160,50,${0.35 + lit * 0.4})`;
      for (let x = 0; x < W; x += 40) {
        g.beginPath(); g.moveTo(x, 34); g.lineTo(x + 20, 52); g.lineTo(x + 40, 34); g.closePath(); g.fill();
      }
      g.fillStyle = `rgba(20,6,2,0.9)`;
      for (let x = 20; x < W; x += 40) { g.beginPath(); g.arc(x, 17, 4, 0, 6.28); g.fill(); }
      g.fillStyle = '#060201';
      g.fillRect(0, H - 10, W, 10);
    }

    caption(text, a) {
      const { g, k } = this;
      g.setTransform(k, 0, 0, k, 0, 0);
      g.globalCompositeOperation = 'source-over';
      g.font = 'italic 500 38px "Cormorant Garamond", Georgia, serif';
      g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      const lines = wrap(g, text, 1180);
      const y0 = H - 46 - (lines.length - 1) * 44;
      const grd = g.createLinearGradient(0, H - 70 - lines.length * 44, 0, H);
      grd.addColorStop(0, 'rgba(8,3,1,0)');
      grd.addColorStop(0.45, `rgba(8,3,1,${0.62 * a})`);
      grd.addColorStop(1, `rgba(8,3,1,${0.8 * a})`);
      g.fillStyle = grd; g.fillRect(0, H - 90 - lines.length * 44, W, 90 + lines.length * 44);
      g.fillStyle = `rgba(255,236,200,${a})`;
      g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 8 * k;
      lines.forEach((ln, i) => g.fillText(ln, W / 2, y0 + i * 44));
      g.shadowBlur = 0;
    }

    // ---------------------------------------------------------- backstage
    renderBack(sc) {
      const { g, og, k } = this;
      const cw = this.cv.width, ch = this.cv.height;
      const L = sc.lamp, t = sc.t;
      const z = clamp(L.z == null ? 1 : L.z, 0.2, 1.6);
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (this.hasFilter) g.filter = 'none';
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      g.fillStyle = '#070301'; g.fillRect(0, 0, cw, ch);
      // the back of the cloth, mirrored, lit through
      const I = clamp(L.on) * LL.flicker(t);
      const mx = W - L.x;
      g.setTransform(k, 0, 0, k, 0, 0);
      const gr = g.createRadialGradient(mx, L.y, 0, mx, L.y, 1100 * Math.pow(z, 0.8));
      gr.addColorStop(0, `rgba(255,214,150,${I * 0.85})`);
      gr.addColorStop(0.5, `rgba(190,100,40,${I * 0.5})`);
      gr.addColorStop(1, `rgba(40,14,4,${I * 0.2})`);
      g.globalCompositeOperation = 'lighter';
      g.fillStyle = gr; g.fillRect(70, 60, W - 140, H - 170);
      if (sc.ambient) { g.fillStyle = `rgba(255,205,130,${sc.ambient * 0.6})`; g.fillRect(70, 60, W - 140, H - 170); }
      g.globalCompositeOperation = 'multiply';
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalAlpha = 0.8; g.fillStyle = this.cloth; g.fillRect(70 * k, 60 * k, (W - 140) * k, (H - 170) * k); g.globalAlpha = 1;
      // shadows on the cloth (mirrored)
      const mirrored = (sc.items || []).map((it) => it && Object.assign({}, it, { x: W - (it.x || 0), flip: !it.flip, rot: -(it.rot || 0) }));
      const ML = { x: mx, y: L.y };
      this.drawItems(mirrored, ML, z, 0, 0, 'back', t);
      // cloth edges and the bamboo frame
      g.setTransform(k, 0, 0, k, 0, 0);
      g.globalCompositeOperation = 'source-over';
      g.strokeStyle = '#3a200c'; g.lineWidth = 14;
      g.strokeRect(70, 60, W - 140, H - 170);
      // the puppets themselves, solid leather seen from the puppeteer's side, on sticks
      const pz = 0.62; // puppets sit nearer to the camera than the cloth
      for (const it of mirrored.filter((x) => x && x.puppet && (x.alpha == null || x.alpha > 0.05))) {
        const s0 = (it.s || 1) * 1.08;
        g.save();
        g.translate(W / 2 + (it.x - W / 2) * 1.08, H * 0.5 + (it.y - H * 0.5) * 1.08 + 30);
        if (it.rot) g.rotate(it.rot);
        // stick
        g.save();
        g.scale(it.flip ? -s0 : s0, s0);
        const sx0 = 0, sy0 = -220;
        g.restore();
        g.save(); g.scale(it.flip ? -s0 : s0, s0);
        g.globalAlpha = it.alpha == null ? 1 : it.alpha;
        it.draw(g, t);
        g.restore();
        // leather sheen and darkness away from the lamp
        g.restore();
        const px = W / 2 + (it.x - W / 2) * 1.08, py = H * 0.5 + (it.y - H * 0.5) * 1.08 + 30;
        g.strokeStyle = '#4a2a10'; g.lineWidth = 5;
        g.beginPath(); g.moveTo(px, py - 220 * s0); g.lineTo(px + 60, H + 40); g.stroke();
        g.lineWidth = 3;
        g.beginPath(); g.moveTo(px + 40 * s0, py - 150 * s0); g.lineTo(px + 140, H + 40); g.stroke();
      }
      // warm grade so the puppets read as lit by one flame
      g.setTransform(k, 0, 0, k, 0, 0);
      const lx = clamp(mx, 260, W - 260), ly = H - 230 + 120 * (1 - z);
      g.globalCompositeOperation = 'multiply';
      const sh = g.createRadialGradient(lx, ly, 50, lx, ly, 1300);
      sh.addColorStop(0, 'rgba(255,220,170,1)');
      sh.addColorStop(0.5, 'rgba(200,120,70,1)');
      sh.addColorStop(1, 'rgba(40,16,8,1)');
      g.fillStyle = sh; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'source-over';
      // puppeteers' arms reaching up to the sticks
      g.fillStyle = 'rgba(10,4,2,0.92)';
      for (const it of mirrored.filter((x) => x && x.puppet && (x.alpha == null || x.alpha > 0.05)).slice(0, 4)) {
        const px = W / 2 + (it.x - W / 2) * 1.08 + 60;
        g.beginPath(); g.ellipse(px, H + 30, 46, 120, 0.25, 0, 6.28); g.fill();
      }
      // the lamp, close to the camera
      if (L.on > 0.01) {
        g.save(); g.translate(lx, ly + 90);
        const s = 2.4;
        g.scale(s, s);
        LL.K.shape(g, [[-40, -6], [40, -6], [26, 16], [-26, 16]], '#a8742a', { lw: 3 });
        LL.K.shape(g, [[-12, 16], [12, 16], [18, 60], [-18, 60]], '#8a5a20', { lw: 3, smooth: false });
        g.restore();
        g.globalCompositeOperation = 'lighter';
        const fl = g.createRadialGradient(lx, ly + 60, 0, lx, ly + 60, 420);
        fl.addColorStop(0, `rgba(255,220,150,${0.75 * L.on})`);
        fl.addColorStop(0.2, `rgba(255,150,60,${0.35 * L.on})`);
        fl.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = fl; g.fillRect(0, 0, W, H);
        g.globalCompositeOperation = 'source-over';
        LL.K.flame(g, lx, ly + 76, 34 * L.on, t);
      }
      const vg = g.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.75)');
      g.fillStyle = vg; g.fillRect(0, 0, W, H);
      g.font = 'italic 500 26px "Cormorant Garamond", Georgia, serif';
      g.fillStyle = 'rgba(255,220,170,0.7)'; g.textAlign = 'left';
      g.fillText('behind the screen', 40, 50);
      if (sc.caption) this.caption(sc.caption, sc.captionA == null ? 1 : sc.captionA);
    }
  }
  LL.Theatre = Theatre;

  function wrap(g, text, maxW) {
    const words = text.split(/\s+/), out = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (g.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t;
    }
    if (cur) out.push(cur);
    return out;
  }
  LL.wrap = wrap;

  // ------------------------------------------------------------------ timing
  LL.stepAt = function (act, p) {
    for (const s of act.steps) if (p >= s.from - 1e-9 && p < s.to - 1e-9) return s;
    return act.steps[act.steps.length - 1];
  };

  // Film schedule: given narration durations (seconds) keyed "a.i", lay every act out in time.
  LL.schedule = function (acts, durs, opt = {}) {
    const gap = opt.gap || 0.7;
    const out = { acts: [], lines: [], sfx: [], total: 0 };
    let T = opt.lead || 0.5;
    acts.forEach((act, ai) => {
      const bps = new Set([0, 1]);
      act.steps.forEach((s) => { bps.add(s.from); bps.add(s.to); });
      act.lines.forEach((l) => bps.add(l.p));
      const pts = [...bps].sort((a, b) => a - b);
      const knots = [[T, 0]];
      let busy = T;
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const st = LL.stepAt(act, a);
        const base = ((b - a) / (st.to - st.from)) * (st.film || st.dur || 5);
        const li = act.lines.findIndex((l) => Math.abs(l.p - a) < 1e-9);
        if (li >= 0) {
          const d = durs[`${ai}.${li}`] || act.lines[li].text.split(' ').length * 0.42;
          out.lines.push({ act: ai, i: li, t: T, dur: d, text: act.lines[li].text });
          busy = T + d + gap;
        }
        const nextHasLine = act.lines.some((l) => Math.abs(l.p - b) < 1e-9) || b === 1;
        let dur = base;
        if (nextHasLine) dur = Math.max(base, busy - T);
        T += dur;
        knots.push([T, b]);
      }
      T += act.tail || 0.6;
      knots.push([T, 1]);
      const start = knots[0][0];
      out.acts.push({ i: ai, start, end: T, knots });
      (act.sfx || []).forEach((s) => out.sfx.push({ t: LL.timeAtP(knots, s.p), name: s.name, act: ai }));
    });
    out.total = T + (opt.tail || 2);
    return out;
  };
  LL.timeAtP = function (knots, p) {
    for (let i = 0; i < knots.length - 1; i++) {
      const [t0, p0] = knots[i], [t1, p1] = knots[i + 1];
      if (p <= p1 + 1e-9 && p1 > p0) return t0 + ((p - p0) / (p1 - p0)) * (t1 - t0);
    }
    return knots[knots.length - 1][0];
  };
  LL.pAt = function (sched, t) {
    let A = sched.acts[0];
    for (const a of sched.acts) if (t >= a.start) A = a;
    const k = A.knots;
    if (t <= k[0][0]) return { act: A.i, p: 0 };
    for (let i = 0; i < k.length - 1; i++) {
      const [t0, p0] = k[i], [t1, p1] = k[i + 1];
      if (t <= t1) return { act: A.i, p: t1 > t0 ? p0 + ((t - t0) / (t1 - t0)) * (p1 - p0) : p1 };
    }
    return { act: A.i, p: 1 };
  };

  // default lamp for the film: wander, or chase the step's target
  LL.filmLamp = function (act, p, t) {
    const st = LL.stepAt(act, p);
    const f = (p - st.from) / (st.to - st.from);
    let L = { x: 800 + Math.sin(t * 0.31) * 110, y: 420 + Math.sin(t * 0.23 + 1) * 50, z: 1, on: 1 };
    if (act.lampRest) Object.assign(L, act.lampRest(p, t));
    if (st.target) {
      const tg = st.target(p, t);
      L.x = tg.x + (st.offset ? st.offset[0] : 30); L.y = tg.y + (st.offset ? st.offset[1] : 20);
    }
    if (st.type === 'near') L.z = lerp(1, 0.3, LL.ease(clamp(f * 1.1)));
    if (act.lamp) Object.assign(L, act.lamp(p, t, L));
    return L;
  };

  // ------------------------------------------------------------------ sound
  // One synth for both the live page (AudioContext) and the film (OfflineAudioContext).
  class Sound {
    constructor(ctx) {
      this.ctx = ctx;
      this.master = ctx.createGain();
      this.master.gain.value = 0.78;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 3;
      this.master.connect(comp); comp.connect(ctx.destination);
      this.music = ctx.createGain(); this.music.gain.value = 0.85; this.music.connect(this.master);
      this.fx = ctx.createGain(); this.fx.gain.value = 0.8; this.fx.connect(this.master);
      this.voice = ctx.createGain(); this.voice.gain.value = 1.0; this.voice.connect(this.master);
      // a little room
      this.verb = ctx.createConvolver();
      this.verb.buffer = this.impulse(2.6);
      const vg = ctx.createGain(); vg.gain.value = 0.32;
      this.verb.connect(vg); vg.connect(this.master);
      this.noiseBuf = this.makeNoise();
      this.sa = 138.59; // C#3
      this.cursor = 0;
    }
    impulse(sec) {
      const sr = this.ctx.sampleRate, n = Math.floor(sr * sec);
      const b = this.ctx.createBuffer(2, n, sr);
      for (let c = 0; c < 2; c++) {
        const d = b.getChannelData(c);
        let s = 3 + c;
        for (let i = 0; i < n; i++) { s = (s * 16807) % 2147483647; d[i] = ((s / 2147483647) * 2 - 1) * Math.pow(1 - i / n, 3); }
      }
      return b;
    }
    makeNoise() {
      const sr = this.ctx.sampleRate, n = sr * 2;
      const b = this.ctx.createBuffer(1, n, sr), d = b.getChannelData(0);
      let s = 11;
      for (let i = 0; i < n; i++) { s = (s * 16807) % 2147483647; d[i] = (s / 2147483647) * 2 - 1; }
      return b;
    }
    out(node, dest, wet) {
      node.connect(dest || this.music);
      if (wet) { const w = this.ctx.createGain(); w.gain.value = wet; node.connect(w); w.connect(this.verb); }
    }
    noise(t, dur, f, q, gain, type, dest, wet) {
      const c = this.ctx, src = c.createBufferSource();
      src.buffer = this.noiseBuf;
      const bp = c.createBiquadFilter(); bp.type = type || 'bandpass'; bp.frequency.value = f; bp.Q.value = q || 1;
      const gn = c.createGain();
      gn.gain.setValueAtTime(0.0001, t);
      gn.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.01, dur * 0.2));
      gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(bp); bp.connect(gn); this.out(gn, dest || this.fx, wet);
      src.start(t, Math.random() * 1.5); src.stop(t + dur + 0.05);
      return bp;
    }
    tone(t, f, dur, gain, type, dest, wet, a) {
      const c = this.ctx, o = c.createOscillator(), gn = c.createGain();
      o.type = type || 'sine'; o.frequency.value = f;
      gn.gain.setValueAtTime(0.0001, t);
      gn.gain.exponentialRampToValueAtTime(gain, t + (a || 0.01));
      gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(gn); this.out(gn, dest, wet);
      o.start(t); o.stop(t + dur + 0.05);
      return o;
    }
    // tanpura pluck: sawtooth through a buzzing bandpass (the jawari)
    pluck(t, f, gain) {
      const c = this.ctx, o = c.createOscillator(), bp = c.createBiquadFilter(), gn = c.createGain(), lp = c.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = f;
      bp.type = 'bandpass'; bp.Q.value = 6;
      bp.frequency.setValueAtTime(f * 9, t); bp.frequency.exponentialRampToValueAtTime(f * 3, t + 3.5);
      lp.type = 'lowpass'; lp.frequency.value = 2400;
      gn.gain.setValueAtTime(0.0001, t);
      gn.gain.exponentialRampToValueAtTime(gain, t + 0.04);
      gn.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
      const o2 = c.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f; const g2 = c.createGain(); g2.gain.value = 0.6;
      o2.connect(g2); g2.connect(gn);
      o.connect(bp); bp.connect(lp); lp.connect(gn); this.out(gn, this.music, 0.3);
      o.start(t); o.stop(t + 4.3); o2.start(t); o2.stop(t + 4.3);
    }
    flute(t, f, dur, gain) {
      const c = this.ctx, o = c.createOscillator(), gn = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
      o.type = 'sine'; o.frequency.value = f;
      lfo.frequency.value = 5.2; lg.gain.value = f * 0.006; lfo.connect(lg); lg.connect(o.frequency);
      gn.gain.setValueAtTime(0.0001, t);
      gn.gain.exponentialRampToValueAtTime(gain, t + 0.09);
      gn.gain.setValueAtTime(gain, t + Math.max(0.1, dur - 0.15));
      gn.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.25);
      const o3 = c.createOscillator(); o3.type = 'triangle'; o3.frequency.value = f * 2; const g3 = c.createGain(); g3.gain.value = 0.12; o3.connect(g3); g3.connect(gn);
      o.connect(gn); this.out(gn, this.music, 0.55);
      o.start(t); o.stop(t + dur + 0.3); lfo.start(t); lfo.stop(t + dur + 0.3); o3.start(t); o3.stop(t + dur + 0.3);
      this.noise(t, dur * 0.6, f * 2, 2, gain * 0.08, 'bandpass', this.music);
    }
    drum(t, kind, gain) {
      gain = gain || 1;
      if (kind === 'tha') { // dry slap
        this.noise(t, 0.08, 1800, 1.4, 0.35 * gain, 'bandpass', this.music);
        this.tone(t, 180, 0.12, 0.25 * gain, 'sine', this.music);
      } else if (kind === 'thom') { // deep bass head
        const o = this.tone(t, 110, 0.6, 0.7 * gain, 'sine', this.music, 0.15);
        o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(62, t + 0.4);
      } else if (kind === 'dhin') { // ringing treble
        this.tone(t, this.sa * 2, 0.9, 0.22 * gain, 'sine', this.music, 0.2);
        this.tone(t, this.sa * 2 * 2.76, 0.4, 0.06 * gain, 'sine', this.music);
        this.noise(t, 0.04, 3000, 1, 0.15 * gain, 'bandpass', this.music);
      } else if (kind === 'bell') {
        this.tone(t, 2637, 0.5, 0.05 * gain, 'sine', this.music, 0.4);
        this.noise(t, 0.12, 7000, 3, 0.08 * gain, 'highpass', this.music);
      } else if (kind === 'clack') { // the puppeteer's wooden clappers
        this.noise(t, 0.05, 2400, 3, 0.6 * gain, 'bandpass', this.fx, 0.2);
        this.tone(t, 820, 0.05, 0.25 * gain, 'triangle', this.fx);
      }
    }
    sfx(t, name) {
      const N = (...a) => this.noise(...a), T = (...a) => this.tone(...a);
      switch (name) {
        case 'strike': // a match on the wick
          N(t, 0.25, 3000, 1, 0.4, 'highpass', this.fx);
          for (let i = 0; i < 6; i++) N(t + 0.05 + i * 0.04, 0.03, 4000, 2, 0.2, 'bandpass', this.fx);
          N(t + 0.18, 1.4, 400, 0.6, 0.35, 'lowpass', this.fx, 0.4);
          break;
        case 'arrow':
          { const f = N(t, 0.5, 900, 2, 0.4, 'bandpass', this.fx, 0.2); f.frequency.exponentialRampToValueAtTime(3000, t + 0.4); }
          this.drum(t + 0.48, 'clack', 1);
          break;
        case 'crack':
          N(t, 0.12, 2500, 0.7, 1, 'bandpass', this.fx, 0.6);
          N(t, 2.4, 160, 0.7, 0.9, 'lowpass', this.fx, 0.8);
          { const o = T(t, 70, 2.2, 0.8, 'sine', this.fx, 0.5); o.frequency.exponentialRampToValueAtTime(34, t + 2); }
          break;
        case 'boom':
          N(t, 1.6, 120, 0.7, 0.8, 'lowpass', this.fx, 0.6);
          { const o = T(t, 60, 1.6, 0.6, 'sine', this.fx, 0.4); o.frequency.exponentialRampToValueAtTime(30, t + 1.4); }
          break;
        case 'whoosh':
          { const f = N(t, 1.2, 300, 1.5, 0.45, 'bandpass', this.fx, 0.4); f.frequency.exponentialRampToValueAtTime(2200, t + 0.7); f.frequency.exponentialRampToValueAtTime(500, t + 1.2); }
          break;
        case 'wings':
          for (let i = 0; i < 4; i++) N(t + i * 0.22, 0.18, 500, 1, 0.35, 'lowpass', this.fx);
          break;
        case 'hit':
          this.drum(t, 'clack', 1.2); N(t, 0.3, 700, 1, 0.4, 'bandpass', this.fx, 0.3); this.drum(t, 'thom', 0.6);
          break;
        case 'fall':
          { const o = T(t, 600, 1.4, 0.12, 'sine', this.fx, 0.5); o.frequency.exponentialRampToValueAtTime(150, t + 1.3); }
          this.drum(t + 1.3, 'thom', 0.8);
          break;
        case 'chime':
          [1, 1.5, 2, 3].forEach((m, i) => T(t + i * 0.07, this.sa * 4 * m, 2.2, 0.06, 'sine', this.fx, 0.7));
          break;
        case 'jewel':
          T(t, this.sa * 8 * 1.5, 1.2, 0.05, 'sine', this.fx, 0.7);
          T(t + 0.05, this.sa * 8 * 2, 1.0, 0.03, 'sine', this.fx, 0.7);
          break;
        case 'splash':
          N(t, 0.6, 900, 0.8, 0.4, 'bandpass', this.fx, 0.3); this.drum(t, 'thom', 0.4);
          break;
        case 'roar':
          { const o = T(t, 90, 2, 0.25, 'sawtooth', this.fx, 0.5); o.frequency.exponentialRampToValueAtTime(55, t + 1.8); }
          N(t, 2, 300, 0.8, 0.3, 'lowpass', this.fx, 0.5);
          break;
        case 'grow':
          { const o = T(t, 60, 4, 0.35, 'sawtooth', this.fx, 0.6, 1.5); o.frequency.exponentialRampToValueAtTime(130, t + 3.8); }
          break;
        case 'gong':
          [1, 2.4, 3.9, 5.2].forEach((m, i) => T(t, 98 * m, 5 - i, 0.18 / (i + 1), 'sine', this.fx, 0.8));
          break;
        case 'blow':
          N(t, 1.2, 600, 0.8, 0.3, 'lowpass', this.fx, 0.3);
          break;
      }
    }
    voiceAt(t, buf, gain) {
      const s = this.ctx.createBufferSource(); s.buffer = buf;
      const g = this.ctx.createGain(); g.gain.value = gain || 1;
      s.connect(g); g.connect(this.voice);
      const w = this.ctx.createGain(); w.gain.value = 0.12; g.connect(w); w.connect(this.verb);
      s.start(t);
      return s;
    }
    // Music for [t0, t1): drone always, a flute phrase now and then, drums when the mood asks.
    // mood: { scale:[semitones], drums:0..1, tempo, flute:0..1, drone:0..1, low }
    music_(t0, t1, mood, rng) {
      const sa = this.sa;
      const order = [1.5, 2, 2, 1]; // Pa, Sa', Sa', Sa
      const step = 1.15;
      let n = Math.ceil(t0 / step);
      for (; n * step < t1; n++) {
        const t = n * step;
        const dr = mood.drone == null ? 1 : mood.drone;
        if (dr > 0) this.pluck(t, sa * order[n % 4] * (mood.low ? 0.5 : 1), 0.11 * dr);
      }
      if (mood.drums > 0) {
        const beat = 60 / (mood.tempo || 96);
        const pat = mood.pattern || ['thom', 'tha', 'dhin', 'tha', 'thom', 'thom', 'dhin', 'tha'];
        let b = Math.ceil(t0 / beat);
        for (; b * beat < t1; b++) {
          const k = pat[b % pat.length];
          if (k) this.drum(b * beat, k, mood.drums);
          if (mood.bells && b % 2 === 0) this.drum(b * beat, 'bell', mood.bells);
        }
      }
      if (mood.flute > 0 && mood.scale) {
        const ph = 9.2;
        let m = Math.ceil((t0 - 1) / ph);
        for (; m * ph + 1 < t1; m++) {
          const ts = m * ph + 1;
          let r = (Math.sin(m * 12.9898 + (mood.seed || 0) * 78.233) * 43758.5453) % 1;
          r = Math.abs(r);
          if (r > 0.75) continue;
          const sc = mood.scale;
          let deg = Math.floor(r * sc.length);
          let tt = ts;
          const notes = 4 + Math.floor(r * 4);
          for (let i = 0; i < notes; i++) {
            const dur = [0.5, 0.75, 0.5, 1.2, 0.4, 1.6][(m + i) % 6];
            const semis = sc[((deg % sc.length) + sc.length) % sc.length] + 12 * Math.floor(deg / sc.length);
            this.flute(tt, sa * 2 * Math.pow(2, semis / 12), dur, 0.09 * mood.flute);
            tt += dur;
            deg += [1, -1, 2, -1, 1, -2, 1][(m * 3 + i) % 7];
          }
        }
      }
    }
  }
  LL.Sound = Sound;
})(typeof window !== 'undefined' ? window : globalThis);
