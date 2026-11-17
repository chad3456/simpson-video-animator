// Shared GLSL for the realistic Dune references: noise, dunes, sky, clouds, lighting.
// Each scene supplies SCENE code (see scenes/*.js) defining:
//   float modH(vec2 p, float h)       reshape the terrain height locally (designed foreground, footprints)
//   float sdObj(vec3 p, out int id)   signed distance to scene objects (worm, figure, city)
//   vec3  shadeObj(int id, vec3 p, vec3 n, vec3 rd, float sh)
//   vec3  sandAlbedo(vec3 p)
//   vec3  sandEmissive(vec3 p)
precision highp float;
uniform vec2 uRes;
uniform vec3 uCamPos, uCamTarget;
uniform float uFov;
uniform vec3 uSun;          // direction toward the sun
uniform vec3 uSunCol, uSkyZen, uSkyHor, uFogCol, uAmb;
uniform float uFogDen, uSunSize, uCloudCov, uCloudH, uStars, uDuneScale;
out vec4 fragColor;

float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), u.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p) { float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6); for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; } return v; }
float fbm3(vec2 p) { float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6); for (int i = 0; i < 3; i++) { v += a * noise(p); p = m * p; a *= 0.5; } return v; }

// asymmetric dune profile: long linear windward rise, sharp crest, steep lee
float duneProfile(float s) {
  float f = fract(s);
  if (f < 0.76) { float u = f / 0.76; return u - 0.12 * sin(u * 3.14159); }
  float v = (f - 0.76) / 0.24; return 1.0 - v * (1.35 - 0.35 * v);
}
float dunesH(vec2 p) {
  p *= uDuneScale;
  float warp = (fbm3(p * 0.004) - 0.5) * 160.0;
  float s1 = (p.x + warp + 50.0 * sin(p.y * 0.0055)) / 170.0;
  float amp1 = 20.0 * (0.45 + 0.9 * fbm3(p * 0.0025 + 7.0));
  float h = duneProfile(s1) * amp1;
  float warp2 = (fbm3(p * 0.012 + 3.0) - 0.5) * 40.0;
  float s2 = (p.x * 0.85 + p.y * 0.5 + warp2) / 46.0;
  h += duneProfile(s2) * 3.2 * (0.4 + fbm3(p * 0.01));
  h += fbm3(p * 0.0011) * 50.0;
  return h / uDuneScale;
}

SCENE_CODE

float terrainH(vec2 p) { return modH(p, dunesH(p)); }

// map: x = distance-ish, y = id (0 terrain, >0 objects)
vec2 map(vec3 p) {
  float dt = (p.y - terrainH(p.xz)) * 0.42;
  int id; float d = sdObj(p, id);
  return d < dt ? vec2(d, float(id)) : vec2(dt, 0.0);
}
vec3 normalT(vec3 p, float t) {
  float e = 0.02 + t * 0.0015;
  float h = terrainH(p.xz);
  vec3 n = normalize(vec3(h - terrainH(p.xz + vec2(e, 0)), e, h - terrainH(p.xz + vec2(0, e))));
  // wind ripples, fading with distance
  float rf = clamp(1.0 - t / 260.0, 0.0, 1.0);
  if (rf > 0.0) {
    vec2 q = p.xz * 1.4; float w = q.x * 0.9 + q.y * 0.35 + fbm3(q * 0.25) * 3.0;
    float sw = fract(w); float slope = sw < 0.7 ? 0.25 : -0.6;   // asymmetric ripple: gentle stoss, steep lee
    n = normalize(n + vec3(slope * 0.45 * rf * 0.9, 0.0, slope * 0.45 * rf * 0.35 + 0.03 * rf * (noise(q * 2.0) - 0.5)));
  }
  return n;
}
vec3 normalO(vec3 p) { int id; vec2 e = vec2(0.003, 0);
  return normalize(vec3(sdObj(p + e.xyy, id) - sdObj(p - e.xyy, id), sdObj(p + e.yxy, id) - sdObj(p - e.yxy, id), sdObj(p + e.yyx, id) - sdObj(p - e.yyx, id))); }

float softShadow(vec3 ro, vec3 rd) {
  float res = 1.0, t = 0.3;
  for (int i = 0; i < 48; i++) {
    vec3 p = ro + rd * t;
    float h = p.y - terrainH(p.xz);
    int id; float d = min(h, sdObj(p, id));
    res = min(res, 10.0 * d / t);
    t += clamp(d * 0.8, 0.2, 40.0);
    if (res < 0.001 || t > 1500.0) break;
  }
  return clamp(res, 0.0, 1.0);
}

vec3 skyCol(vec3 rd) {
  float y = max(rd.y, 0.0);
  vec3 col = mix(uSkyHor, uSkyZen, pow(y, 0.33));
  float sd = max(dot(rd, uSun), 0.0);
  col += uSunCol * (pow(sd, 6.0) * 0.35 + pow(sd, 60.0) * 0.6);
  col += uSunCol * 6.0 * smoothstep(1.0 - uSunSize, 1.0 - uSunSize * 0.6, sd);
  // stars
  if (uStars > 0.0 && rd.y > 0.0) { vec2 sp = rd.xz / (rd.y + 0.4) * 900.0; float st = hash12(floor(sp)); col += vec3(1.0, 0.95, 0.9) * smoothstep(0.9985, 1.0, st) * uStars * smoothstep(0.0, 0.3, rd.y); }
  // clouds on a plane
  if (uCloudCov > 0.0 && rd.y > 0.01) {
    vec3 cp = rd * (uCloudH / rd.y);
    vec2 q = cp.xz * 0.00025;
    float c = fbm(q + vec2(fbm(q * 2.0), 0.0) * 0.6);
    c = smoothstep(1.0 - uCloudCov, 1.0 - uCloudCov + 0.35, c);
    float lit = clamp(0.5 + 0.8 * (fbm(q + uSun.xz * 0.02) - fbm(q)) * 4.0, 0.0, 1.0);
    vec3 cc = mix(uSkyHor * 0.6 + uAmb * 0.3, uSunCol * 1.1 + uSkyHor * 0.3, lit);
    col = mix(col, cc, c * smoothstep(0.0, 0.12, rd.y) * 0.9);
  }
  return col;
}

vec3 fogApply(vec3 col, float t, vec3 rd) {
  float f = 1.0 - exp(-t * uFogDen);
  float sd = max(dot(rd, uSun), 0.0);
  vec3 fc = uFogCol + uSunCol * pow(sd, 8.0) * 0.5;
  return mix(col, fc, f);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 ro = uCamPos;
  vec3 fw = normalize(uCamTarget - ro), rt = normalize(cross(vec3(0, 1, 0), fw)), up = cross(fw, rt);
  vec3 rd = normalize(fw * uFov + uv.x * rt + uv.y * up);
  float t = 0.0; vec2 hit = vec2(1e9, -1.0); bool found = false;
  for (int i = 0; i < 560; i++) {
    vec3 p = ro + rd * t;
    vec2 m = map(p);
    if (m.x < 0.0015 * t + 0.002) { hit = m; found = true; break; }
    t += max(m.x, 0.004 + t * 0.0006);
    if (t > 6000.0 || p.y > 900.0) break;
  }
  // grazing rays that run out of steps over flat ground are ground, not sky
  if (!found && t < 6000.0 && (ro + rd * t).y < 900.0) { hit = map(ro + rd * t); found = true; }
  vec3 col;
  if (!found) {
    col = skyCol(rd);
  } else {
    vec3 p = ro + rd * t;
    float sh = softShadow(p + vec3(0, 0.05, 0), uSun);
    if (hit.y < 0.5) {
      vec3 n = normalT(p, t);
      vec3 alb = sandAlbedo(p) * (0.9 + 0.2 * noise(p.xz * 0.5));
      float dif = max(dot(n, uSun), 0.0);
      float wrap = max(dot(n, uSun) * 0.5 + 0.5, 0.0);
      float sky = 0.5 + 0.5 * n.y;
      float bounce = max(dot(n, normalize(vec3(-uSun.x, 0.3, -uSun.z))), 0.0);
      col = alb * (uSunCol * dif * sh * 1.25 + uAmb * sky * 0.55 + uSunCol * bounce * 0.12 + uSunCol * wrap * 0.06);
      float spec = pow(max(dot(reflect(rd, n), uSun), 0.0), 30.0) * sh;
      col += uSunCol * spec * 0.06 * smoothstep(0.0, 0.3, dot(n, -rd));
      col += sandEmissive(p);
    } else {
      vec3 n = normalO(p);
      col = shadeObj(int(hit.y + 0.5), p, n, rd, sh);
    }
    col = fogApply(col, t, rd);
  }
  // filmic tone map
  col = col / (1.0 + col * 0.35);
  col = pow(max(col, 0.0), vec3(0.4545));
  fragColor = vec4(col, 1.0);
}
