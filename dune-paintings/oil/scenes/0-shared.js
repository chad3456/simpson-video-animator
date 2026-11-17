// Shared GLSL snippets for the oil scenes: capsules and a robed human figure.
window.GLSL_FIG = (name, pos, yaw, o) => {
  o = o || {};
  const f = (v) => (Number.isInteger(v) ? v.toFixed(1) : String(v));
  const P = `vec3(${pos.map(f).join(',')})`;
  const stride = o.stride || 0.0;
  return `
float ${name}(vec3 p) {
  vec3 q = p - ${P};
  float cy = cos(${f(yaw)}), sy = sin(${f(yaw)});
  q.xz = mat2(cy, -sy, sy, cy) * q.xz;   // local frame: figure faces +z, its right is +x
  float bb = length(q - vec3(0.0, 1.0, 0.0)) - 2.4;
  if (bb > 0.5) return bb;
  float st = ${f(stride)};
  float d = sdCap(q, vec3(-0.1, -0.05, -st), vec3(-0.09, 0.9, 0.0), 0.065);
  d = min(d, sdCap(q, vec3(0.11, -0.05, st), vec3(0.09, 0.9, 0.0), 0.065));
  d = min(d, sdCap(q, vec3(0.0, 0.92, 0.0), vec3(0.0, 1.38, 0.0), 0.16));
  d = min(d, sdCap(q, vec3(-0.2, 1.38, 0.0), vec3(-0.25, 0.86, 0.04), 0.05));
  d = min(d, sdCap(q, vec3(0.2, 1.38, 0.0), vec3(${o.staff ? '0.3, 1.0, 0.12' : '0.26, 0.88, 0.02'}), 0.05));
  d = min(d, length((q - vec3(0.0, 1.6, 0.0)) * vec3(1.0, 0.85, 1.0)) - 0.12);
  ${o.hood ? 'd = min(d, length((q - vec3(0.0, 1.58, -0.03)) * vec3(1.0, 0.8, 1.0)) - 0.15);' : ''}
  ${o.staff ? 'd = min(d, sdCap(q, vec3(0.32, -0.05, 0.25), vec3(0.3, 1.75, 0.1), 0.022));' : ''}
  ${o.cloak ? `
  vec3 c = q - vec3(0.0, 0.0, -0.13);
  float wx = ${f(o.windX || 1.0)};
  float xx = c.x * wx;
  float top = 1.46 - max(0.0, xx) * 0.3;
  float bot = 0.18 + max(0.0, xx) * 0.35;
  float wave = 0.07 * sin(xx * 6.0 + c.y * 2.5) + 0.04 * sin(c.y * 9.0);
  float slab = abs(c.z - wave + max(0.0, xx) * 0.12) - 0.02;
  float region = max(max(c.y - top, bot - c.y), max(-0.24 - xx, xx - ${f(o.cloakLen || 1.1)}));
  d = min(d, max(slab, region));` : ''}
  ${o.robe ? `
  // a long robe falling from the shoulders, its hem pushed by the wind
  vec3 rq = q; float hy = clamp(rq.y, 0.1, 1.45); float tt = (1.45 - hy) / 1.35;
  vec2 cxz = vec2(${f(o.robeWind || 0.0)} * tt * tt, -0.02);
  float rr = mix(0.2, 0.36, tt) + 0.02 * sin(atan(rq.z - cxz.y, rq.x - cxz.x) * 7.0 + rq.y * 4.0) * tt;
  float robe = length(rq.xz - cxz) - rr;
  robe = max(robe, max(rq.y - 1.47, 0.1 - rq.y));
  d = min(d, robe * 0.8);` : ''}
  return d;
}`;
};
window.GLSL_CAP = `float sdCap(vec3 p, vec3 a, vec3 b, float r) { vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
float sdBox(vec3 p, vec3 b) { vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0); }`;
