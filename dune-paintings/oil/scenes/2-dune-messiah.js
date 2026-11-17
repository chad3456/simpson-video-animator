// II. DUNE MESSIAH — The Blind Emperor (oil). Dusk. Paul, blinded, walks alone across an open pan of sand toward the
// setting sun, a Fremen staff in his hand, a single line of footprints behind him leading back to the citadel of
// Arrakeen, whose windows are lighting up far away on the left.
(function () {
  const sun = (() => { const v = [0.5, 0.035, 0.86]; const l = Math.hypot(...v); return v.map((x) => x / l); })();
  const U = {
    uCamPos: [6.0, 6.6, 13.0], uCamTarget: [40.0, 40.0, 400.0], uFov: 1.1,
    uSun: sun, uSunCol: [1.7, 0.78, 0.46], uSkyZen: [0.03, 0.03, 0.12], uSkyHor: [0.85, 0.34, 0.3], uFogCol: [0.55, 0.26, 0.3], uAmb: [0.28, 0.24, 0.42],
    uFogDen: 0.00045, uSunSize: 0.0016, uCloudCov: 0.25, uCloudH: 2400, uStars: 1.0, uDuneScale: 1.0,
  };
  const PAUL = [14.0, 5.0, 26.0];
  SC['2-dune-messiah'] = {
    W: 2400, H: 1350, uniforms: U,
    code: GLSL_CAP + `
const vec2 PAUL = vec2(${PAUL[0].toFixed(1)}, ${PAUL[2].toFixed(1)});
const vec2 CITY = vec2(-1300.0, 2300.0);
float footprints(vec2 p) {
  vec2 a = PAUL, b = vec2(-260.0, 420.0);
  vec2 ab = b - a, ap = p - a; float L = length(ab); vec2 dir = ab / L;
  float t = dot(ap, dir); if (t < 0.3 || t > L) return 0.0;
  vec2 nrm = vec2(-dir.y, dir.x); float side = dot(ap, nrm);
  float k = floor(t / 0.78); float s = mod(k, 2.0) < 1.0 ? -0.14 : 0.14;
  vec2 c = vec2((k + 0.5) * 0.78, s); vec2 lp = vec2(t, side) - c;
  float fp = exp(-(lp.x * lp.x / 0.035 + lp.y * lp.y / 0.008));
  return fp * (1.0 - smoothstep(60.0, 260.0, t));
}
float modH(vec2 p, float h) {
  // an open pan of hard sand between the dunes
  float w = 1.0 - smoothstep(170.0, 420.0, length((p - vec2(0.0, 120.0)) * vec2(0.7, 1.0)));
  if (w <= 0.0) return h;
  float hf = 5.0 + (fbm3(p * 0.01) - 0.5) * 3.0 * smoothstep(5.0, 30.0, length(p - PAUL)) + (fbm3(p * 0.2) - 0.5) * 0.12;
  hf -= footprints(p) * 0.07;
  return mix(h, hf, w);
}
${GLSL_FIG('sdPaul', PAUL, -0.55, { robe: true, robeWind: -0.18, hood: true, staff: true, stride: 0.16 })}
float sdCity(vec3 p) {
  vec3 q = p - vec3(CITY.x, 0.0, CITY.y);
  float bb = length(q) - 520.0; if (bb > 30.0) return bb;
  float d = sdBox(q - vec3(0.0, 90.0, 0.0), vec3(200.0, 120.0, 130.0));
  d = min(d, sdBox(q - vec3(-120.0, 170.0, -20.0), vec3(70.0, 200.0, 70.0)));
  d = min(d, sdBox(q - vec3(110.0, 150.0, 30.0), vec3(90.0, 160.0, 60.0)));
  d = min(d, sdBox(q - vec3(250.0, 50.0, 40.0), vec3(80.0, 80.0, 90.0)));
  d = min(d, sdBox(q - vec3(-280.0, 60.0, 10.0), vec3(90.0, 95.0, 80.0)));
  return d;
}
float sdObj(vec3 p, out int id) {
  float dp = sdPaul(p), dc = sdCity(p);
  if (dp < dc) { id = 2; return dp; }
  id = 4; return dc;
}
vec3 sandAlbedo(vec3 p) { return vec3(0.82, 0.5, 0.34) * (0.92 + 0.16 * fbm3(p.xz * 0.02)); }
vec3 sandEmissive(vec3 p) { return vec3(0.0); }
vec3 shadeObj(int id, vec3 p, vec3 n, vec3 rd, float sh) {
  float dif = max(dot(n, uSun), 0.0), sky = 0.5 + 0.5 * n.y;
  float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  if (id == 2) {
    vec3 alb = vec3(0.07, 0.05, 0.06);
    return alb * (uSunCol * dif * sh + uAmb * sky * 0.6) + uSunCol * rim * 0.55 * (0.3 + 0.7 * max(dot(rd, uSun), 0.0));
  }
  vec3 alb = vec3(0.3, 0.2, 0.22);
  vec3 col = alb * (uSunCol * dif * sh * 0.8 + uAmb * sky * 0.5);
  // lit windows in narrow vertical slits
  vec2 g = vec2(abs(n.x) > 0.5 ? p.z : p.x, p.y);
  vec2 cell = floor(g / vec2(9.0, 13.0)); vec2 f = fract(g / vec2(9.0, 13.0));
  float on = step(0.86, hash12(cell)) * step(0.4, f.x) * step(f.x, 0.6) * step(0.25, f.y) * step(f.y, 0.75) * step(8.0, p.y);
  col += vec3(1.0, 0.62, 0.3) * on * 2.2;
  return col;
}`,
    post(ctx, W, H, scale) {
      // a thin crescent moon high in the dusk sky, its dark part the colour of the sky behind it
      const x = W * 0.8, y = H * 0.12, r = 30 * scale;
      const px = ctx.getImageData(x + r * 3 | 0, y | 0, 1, 1).data;
      ctx.save();
      const g = ctx.createRadialGradient(x, y, r, x, y, r * 4); g.addColorStop(0, 'rgba(255,230,210,0.16)'); g.addColorStop(1, 'rgba(255,230,210,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,244,226,0.95)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      ctx.fillStyle = `rgb(${px[0]},${px[1]},${px[2]})`; ctx.beginPath(); ctx.arc(x + r * 0.4, y - r * 0.2, r * 0.9, 0, 7); ctx.fill();
      ctx.restore();
    },
    oil: { sizes: [28, 15, 8, 4.5, 2.6], threshold: 6, ground: '#3a1a28', impasto: 0.45, contrast: 1.15, sat: 1.1 },
  };
})();
