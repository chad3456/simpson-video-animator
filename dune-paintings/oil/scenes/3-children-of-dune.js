// III. CHILDREN OF DUNE — The Golden Path (oil). Dawn. Leto II, his skin covered in sandtrout, stands on the summit
// of a great dune. From his feet a thin road of gold winds away across the desert toward the sunrise: the path of
// thousands of years he has chosen. To the left the land is turning green under rain; far to the right the back of
// the last worm arches out of the sand.
(function () {
  const sun = (() => { const v = [0.3, 0.06, 0.95]; const l = Math.hypot(...v); return v.map((x) => x / l); })();
  const U = {
    uCamPos: [-9.0, 47.0, -27.0], uCamTarget: [40.0, 22.0, 600.0], uFov: 1.1,
    uSun: sun, uSunCol: [1.7, 1.25, 0.75], uSkyZen: [0.04, 0.16, 0.2], uSkyHor: [0.95, 0.85, 0.6], uFogCol: [0.75, 0.72, 0.58], uAmb: [0.32, 0.42, 0.45],
    uFogDen: 0.00045, uSunSize: 0.0011, uCloudCov: 0.5, uCloudH: 2000, uStars: 0.5, uDuneScale: 1.0,
  };
  const LETO = [0.0, 40.0, 0.0];
  SC['3-children-of-dune'] = {
    W: 2400, H: 1350, uniforms: U,
    code: GLSL_CAP + `
const vec3 LETO = vec3(0.0, 40.0, 0.0);
float modH(vec2 p, float h) {
  vec2 q = (p - vec2(0.0, -8.0)) * vec2(0.5, 1.0);
  float w = 1.0 - smoothstep(70.0, 170.0, length(q));
  if (w <= 0.0) return h;
  float cz = 4.0 * sin(p.x * 0.025);
  float dz = p.y - cz;
  float crest = 40.0 - 0.0016 * p.x * p.x;
  float hf = dz < 0.0 ? crest + dz * 0.3 : crest - dz * 0.5;
  float nf = smoothstep(2.0, 14.0, length(p - LETO.xz));
  hf = max(hf, crest - 50.0) + ((fbm3(p * 0.05) - 0.5) * 2.0 + (fbm3(p * 0.3) - 0.5) * 0.25) * nf;
  return mix(h, hf, w);
}
${GLSL_FIG('sdLeto', LETO, 0.25, { robe: true, robeWind: -0.12, stride: 0.05 })}
float sdWormBack(vec3 p) {
  vec3 q = p - vec3(720.0, 18.0, 1500.0);
  float bb = length(q) - 160.0; if (bb > 10.0) return bb;
  float ca = cos(0.5), sa = sin(0.5); q.xz = mat2(ca, -sa, sa, ca) * q.xz;
  vec2 t = vec2(length(q.xy) - 80.0, q.z);
  return length(t) - 15.0 + (noise(q.xy * 0.2) - 0.5) * 1.5 + 0.6 * smoothstep(0.75, 1.0, fract(atan(q.y, q.x) * 12.0));
}
float sdObj(vec3 p, out int id) {
  float dl = sdLeto(p), dw = sdWormBack(p);
  if (dl < dw) { id = 2; return dl; }
  id = 1; return dw;
}
float pathDist(vec2 p) {
  vec2 P[11] = vec2[11](vec2(0.0, 1.0), vec2(9.0, 28.0), vec2(24.0, 80.0), vec2(46.0, 170.0), vec2(4.0, 290.0), vec2(80.0, 450.0), vec2(55.0, 650.0), vec2(150.0, 900.0), vec2(120.0, 1200.0), vec2(250.0, 1600.0), vec2(330.0, 2300.0));
  float d = 1e9;
  for (int i = 0; i < 10; i++) { vec2 a = P[i], b = P[i + 1], pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); d = min(d, length(pa - ba * h)); }
  return d;
}
vec3 sandAlbedo(vec3 p) {
  vec3 sand = vec3(0.86, 0.56, 0.32) * (0.92 + 0.16 * fbm3(p.xz * 0.02));
  float green = smoothstep(-40.0, -320.0, p.x + (fbm3(p.xz * 0.004) - 0.5) * 500.0);
  vec3 veg = mix(vec3(0.22, 0.36, 0.16), vec3(0.4, 0.5, 0.22), fbm3(p.xz * 0.05));
  green *= smoothstep(150.0, 400.0, p.z);
  return mix(sand, veg, green * 0.85);
}
vec3 sandEmissive(vec3 p) {
  float dcam = length(p - uCamPos);
  float w = 0.25 + dcam * 0.0028;
  float d = pathDist(p.xz);
  float core = smoothstep(w, 0.0, d), halo = exp(-d / (w * 6.0));
  return vec3(1.0, 0.72, 0.25) * (core * 2.6 + halo * 0.5);
}
vec3 shadeObj(int id, vec3 p, vec3 n, vec3 rd, float sh) {
  float dif = max(dot(n, uSun), 0.0), sky = 0.5 + 0.5 * n.y;
  float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  if (id == 2) {
    // the sandtrout membrane: near-black with a cold metallic sheen and a mottled surface
    float mot = noise(p.xy * 40.0 + p.z * 30.0);
    vec3 alb = mix(vec3(0.03, 0.035, 0.05), vec3(0.12, 0.14, 0.2), mot);
    float spec = pow(max(dot(reflect(rd, n), uSun), 0.0), 18.0);
    return alb * (uSunCol * dif * sh + uAmb * sky * 0.6) + vec3(0.6, 0.75, 1.0) * spec * 0.6 * sh + uSunCol * rim * 0.45 * (0.3 + 0.7 * max(dot(rd, uSun), 0.0));
  }
  vec3 alb = vec3(0.5, 0.36, 0.27);
  return alb * (uSunCol * dif * sh + uAmb * sky * 0.6);
}`,
    post(ctx, W, H, scale) {
      // veils of rain falling from the clouds over the greening west
      ctx.save(); ctx.filter = `blur(${10 * scale}px)`;
      ctx.filter = `blur(${28 * scale}px)`;
      for (let i = 0; i < 5; i++) {
        const x = (0.0 + i * 0.07 + Math.random() * 0.03) * W, y0 = H * 0.22, y1 = H * 0.5;
        const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(95,110,115,0.22)'); g.addColorStop(1, 'rgba(95,110,115,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x + 170 * scale, y0); ctx.lineTo(x + 120 * scale, y1); ctx.lineTo(x - 60 * scale, y1); ctx.fill();
      }
      ctx.restore();
    },
    oil: { sizes: [28, 15, 8, 4.5, 2.6], threshold: 6, ground: '#4a3a2a', impasto: 0.45, contrast: 1.15, sat: 1.1 },
  };
})();
