// I. DUNE — The Sleeper Must Awaken (oil). Dawn; a sandworm rises half a kilometre away and a lone figure on the
// crest stands his ground. Camera low behind him; the sun low ahead-left so he is rimmed with light.
(function () {
  const project = (U, W, H, p) => {
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const nrm = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); }, cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const fw = nrm(sub(U.uCamTarget, U.uCamPos)), rt = nrm(cross([0, 1, 0], fw)), up = cross(fw, rt);
    const d = sub(p, U.uCamPos), z = dot(d, fw);
    return [W / 2 + (dot(d, rt) / z) * U.uFov * H, H / 2 - (dot(d, up) / z) * U.uFov * H];
  };
  window.PROJECT = project;
  const U = {
    uCamPos: [2.0, 31.5, -22.0], uCamTarget: [-10.0, 62.0, 400.0], uFov: 1.05,
    uSun: (() => { const v = [-0.62, 0.075, 0.78]; const l = Math.hypot(...v); return v.map((x) => x / l); })(),
    uSunCol: [1.75, 1.12, 0.72], uSkyZen: [0.16, 0.22, 0.42], uSkyHor: [1.0, 0.7, 0.5], uFogCol: [0.92, 0.66, 0.52], uAmb: [0.36, 0.36, 0.52],
    uFogDen: 0.00042, uSunSize: 0.0009, uCloudCov: 0.42, uCloudH: 2600, uStars: 0, uDuneScale: 1.0,
  };
  SC['1-dune'] = {
    W: 2400, H: 1350, uniforms: U,
    code: `
const vec3 FIG = vec3(-8.0, 30.0, -0.955);
float modH(vec2 p, float h) {
  vec2 q = (p - vec2(-8.0, -6.0)) * vec2(0.55, 1.0);
  float w = 1.0 - smoothstep(60.0, 150.0, length(q));
  if (w <= 0.0) return h;
  float cz = 6.0 * sin(p.x * 0.02);
  float dz = p.y - cz;
  float crest = 30.0 - 0.0014 * (p.x + 8.0) * (p.x + 8.0);
  float hf = dz < 0.0 ? crest + dz * 0.3 : crest - dz * 0.62;
  float nf = smoothstep(2.0, 14.0, length(p - FIG.xz));
  hf = max(hf, crest - 40.0) + ((fbm3(p * 0.05) - 0.5) * 2.0 + (fbm3(p * 0.3) - 0.5) * 0.25) * nf;
  return mix(h, hf, w);
}
float sdCap(vec3 p, vec3 a, vec3 b, float r) { vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
float sdFigure(vec3 p) {
  vec3 q = p - FIG;
  float bb = length(q - vec3(0.4, 1.0, 0.0)) - 2.2;
  if (bb > 0.5) return bb;
  float d = sdCap(q, vec3(-0.1, -0.05, 0.0), vec3(-0.09, 0.9, 0.0), 0.065);
  d = min(d, sdCap(q, vec3(0.13, -0.05, 0.1), vec3(0.09, 0.9, 0.0), 0.065));
  d = min(d, sdCap(q, vec3(0.0, 0.92, 0.0), vec3(0.0, 1.38, 0.0), 0.16));
  d = min(d, sdCap(q, vec3(-0.2, 1.38, 0.0), vec3(-0.25, 0.86, 0.04), 0.05));
  d = min(d, sdCap(q, vec3(0.2, 1.38, 0.0), vec3(0.26, 0.88, 0.02), 0.05));
  d = min(d, length((q - vec3(0.0, 1.6, 0.0)) * vec3(1.0, 0.85, 1.0)) - 0.12);
  // hood
  d = min(d, length((q - vec3(0.0, 1.58, -0.03)) * vec3(1.0, 0.8, 1.0)) - 0.15);
  // cloak streaming downwind (+x), rippling
  vec3 c = q - vec3(0.0, 0.0, -0.13);
  float xx = c.x;
  float top = 1.46 - max(0.0, xx) * 0.3;
  float bot = 0.22 + max(0.0, xx) * 0.35;
  float wave = 0.07 * sin(xx * 6.0 + c.y * 2.5) + 0.04 * sin(c.y * 9.0);
  float slab = abs(c.z - wave + max(0.0, xx) * 0.12) - 0.02;
  float region = max(max(c.y - top, bot - c.y), max(-0.24 - xx, xx - 1.25));
  d = min(d, max(slab, region));
  return d;
}
vec3 wormPt(float t) { vec3 a = vec3(215.0, -90.0, 640.0), b = vec3(235.0, 125.0, 590.0), c = vec3(150.0, 170.0, 470.0); return mix(mix(a, b, t), mix(b, c, t), t); }
float sdWorm(vec3 p, out float s, out int part) {
  part = 1; s = 0.0;
  float bb = length(p - vec3(190.0, 60.0, 570.0)) - 240.0;
  if (bb > 20.0) return bb;
  float d = 1e9; vec3 prev = wormPt(0.0);
  for (int i = 1; i <= 18; i++) {
    float t = float(i) / 18.0; vec3 cur = wormPt(t);
    vec3 pa = p - prev, ba = cur - prev; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float u = (float(i - 1) + h) / 18.0;
    float dd = length(pa - ba * h) - mix(50.0, 42.0, u);
    if (dd < d) { d = dd; s = u; }
    prev = cur;
  }
  // segment grooves and leathery bumps
  d += 0.9 * smoothstep(0.78, 1.0, fract(s * 46.0));
  d += (noise(p.xy * 0.09 + p.z * 0.05) - 0.5) * 1.6 + (noise(p.yz * 0.35) - 0.5) * 0.5;
  // open maw at the head
  vec3 H = wormPt(1.0), A = normalize(wormPt(1.0) - wormPt(0.94));
  vec3 ph = p - H; float ax = dot(ph, A);
  d = max(d, ax);
  float rr = length(ph - A * ax);
  d = max(d, -max(rr - 34.0, -ax - 90.0));
  // rings of crystal teeth around the inner wall
  vec3 uu = normalize(cross(A, vec3(0.0, 1.0, 0.0))), vv = cross(A, uu);
  float th = atan(dot(ph, vv), dot(ph, uu));
  float sec = 6.2831853 / 40.0;
  float thr = mod(th + sec * 0.5, sec) - sec * 0.5;
  vec3 lq = vec3(rr * cos(thr), rr * sin(thr), ax);
  float td = 1e9;
  for (int k = 0; k < 3; k++) {
    float row = -3.0 - float(k) * 9.0;
    vec3 a0 = vec3(34.0, 0.0, row), b0 = vec3(24.0 + float(k) * 1.5, 0.0, row + 3.5);
    vec3 pa = lq - a0, ba = b0 - a0; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    td = min(td, length(pa - ba * h) - mix(1.5, 0.15, h));
  }
  // a thick fleshy lip around the opening
  vec2 tq = vec2(rr - 36.0, ax + 3.0); float lip = length(tq) - 6.5 + (noise(vec2(th * 6.0, 1.0)) - 0.5) * 2.0;
  d = min(d, lip);
  if (td < d) { part = 3; return td; }
  return d;
}
float sdObj(vec3 p, out int id) {
  float s; int part;
  float dw = sdWorm(p, s, part);
  float df = sdFigure(p);
  if (df < dw) { id = 2; return df; }
  id = part; return dw;
}
vec3 sandAlbedo(vec3 p) { return vec3(0.86, 0.52, 0.3) * (0.92 + 0.16 * fbm3(p.xz * 0.02)); }
vec3 sandEmissive(vec3 p) { return vec3(0.0); }
vec3 shadeObj(int id, vec3 p, vec3 n, vec3 rd, float sh) {
  float dif = max(dot(n, uSun), 0.0), sky = 0.5 + 0.5 * n.y;
  float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  if (id == 2) {
    vec3 alb = vec3(0.06, 0.05, 0.055);
    return alb * (uSunCol * dif * sh + uAmb * sky * 0.6) + uSunCol * rim * 0.5 * (0.4 + 0.6 * max(dot(rd, uSun), 0.0));
  }
  vec3 H = wormPt(1.0), A = normalize(wormPt(1.0) - wormPt(0.94));
  vec3 ph = p - H; float ax = dot(ph, A); float rr = length(ph - A * ax);
  float inside = (rr < 35.5 && ax > -95.0) ? 1.0 : 0.0;
  if (id == 3) {
    vec3 alb = vec3(0.92, 0.86, 0.78);
    return alb * (uSunCol * dif * sh * 0.8 + uAmb * 0.55) + vec3(1.0, 0.6, 0.3) * 0.6 * exp(ax * 0.02);
  }
  float s; int part; sdWorm(p, s, part);
  float groove = smoothstep(0.7, 1.0, fract(s * 46.0));
  vec3 alb = mix(vec3(0.5, 0.36, 0.27), vec3(0.3, 0.2, 0.17), groove);
  alb = mix(alb, vec3(0.8, 0.56, 0.38), smoothstep(0.4, 0.9, n.y) * 0.6);
  vec3 col = alb * (uSunCol * dif * sh * 1.1 + uAmb * sky * 0.6) + uSunCol * rim * 0.4 * (0.3 + 0.7 * max(dot(rd, uSun), 0.0));
  if (inside > 0.5) { vec3 flesh = vec3(0.2, 0.07, 0.06) * (0.6 + 0.6 * dif) * (0.7 + 0.3 * sin(ax * 1.2)); vec3 fire = vec3(1.0, 0.45, 0.15) * 1.6; col = mix(flesh, fire, smoothstep(-15.0, -85.0, ax)); }
  return col;
}`,
    post(ctx, W, H, scale) {
      const P = (p) => window.PROJECT(U, W, H, p);
      // dust thrown up around the worm's base and sand pouring off its body
      const base = P([215, 25, 610]);
      ctx.save(); ctx.filter = `blur(${14 * scale}px)`;
      for (let i = 0; i < 60; i++) { const x = base[0] + (Math.random() - 0.5) * 640 * scale, y = base[1] + (Math.random() - 0.6) * 150 * scale - Math.random() * Math.random() * 300 * scale; const r = (30 + Math.random() * 110) * scale; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(236,184,140,0.35)'); g.addColorStop(1, 'rgba(240,190,150,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
      ctx.restore();
      ctx.save(); ctx.lineCap = 'round';
      for (let i = 0; i < 90; i++) { const t = 0.35 + Math.random() * 0.55; const a = [215, -90, 640], b = [235, 125, 590], c = [150, 170, 470]; const m = (u, v, k) => u.map((x, j) => x + (v[j] - x) * k); const w = m(m(a, b, t), m(b, c, t), t); const p0 = P([w[0] + (Math.random() - 0.5) * 70, w[1] + Math.random() * 10, w[2] - 30]); ctx.strokeStyle = `rgba(${230 + Math.random() * 25 | 0},${180 + Math.random() * 40 | 0},${130 + Math.random() * 40 | 0},${0.05 + Math.random() * 0.15})`; ctx.lineWidth = (1 + Math.random() * 2.5) * scale; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p0[0] + (Math.random() * 6) * scale, p0[1] + (60 + Math.random() * 200) * scale); ctx.stroke(); }
      ctx.restore();
    },
    oil: { sizes: [28, 15, 8, 4.5, 2.6], threshold: 6, ground: '#6a3a28', impasto: 0.45, contrast: 1.18, sat: 1.12 },
  };
})();
