/* Ramayana paintings: the WebGL stage. Five flat SVG layers (sky, set, figures, foreground, flow mask) are
   rasterised to textures and composited with depth parallax, then painted over by a stack of shaders:
   hand-cut edge wobble + line boil, flowing water, gouache mottling, dry-brush, pigment pooling, gold-leaf
   shimmer, god rays, lamp glows, living fire + embers, drifting motes, a pointer lantern, paper grain, vignette. */
(function () {
  const R = window.R;
  const VS = 'attribute vec2 a;varying vec2 vUv;void main(){vUv=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
  const NOISE = `
precision highp float;
varying vec2 vUv;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*noise(p);p=p*2.03+17.1;a*=.5;}return s;}
`;
  // pass A: composite the layers
  const FA = NOISE + `
uniform sampler2D uSky,uBg,uMid,uFg,uMask;
uniform vec2 uPar;uniform float uT,uZoom,uBoil,uWob,uFlow,uAsp;
vec2 wob(vec2 uv,float seed){
  vec2 q=uv*vec2(uAsp,1.);
  float k=floor(uT*7.)*1.37;
  vec2 lo=vec2(noise(q*22.+seed),noise(q*22.+seed+31.7))-.5;
  vec2 hi=vec2(noise(q*110.+seed+k),noise(q*110.+seed+9.3+k*1.7))-.5;
  return lo*.0026*uWob+hi*.0011*uBoil;
}
void main(){
  vec2 c=(vUv-.5)/uZoom+.5;
  vec2 u0=c+uPar*.12+wob(vUv,1.)*.6;
  vec2 u1=c+uPar*.42+wob(vUv,5.);
  vec2 u2=c+uPar*.72+wob(vUv,11.);
  vec2 u3=c+uPar*1.05+wob(vUv,17.);
  float m=texture2D(uMask,u1).r;
  vec2 fl=vec2(sin(u1.y*86.+uT*1.5+sin(u1.x*13.)*2.)*.0042,cos(u1.x*46.+uT*1.1+sin(u1.y*31.))*.0026)*m*uFlow;
  vec4 sky=texture2D(uSky,u0);
  vec4 bg=texture2D(uBg,u1+fl);
  vec4 mid=texture2D(uMid,u2);
  vec4 fg=texture2D(uFg,u3);
  vec3 col=sky.rgb;
  col=col*(1.-bg.a)+bg.rgb;
  col=col*(1.-mid.a)+mid.rgb;
  col=col*(1.-fg.a)+fg.rgb;
  gl_FragColor=vec4(col,m*(1.-mid.a)*(1.-fg.a));
}`;
  // pass B: paint, light and paper
  const FB = NOISE + `
uniform sampler2D uC;
uniform vec2 uRes,uMouse;uniform float uT,uAsp;
uniform float uGrain,uGouache,uEdge,uFoil,uRaysOn,uGlowOn,uFireOn,uMotes,uVig,uLantern,uFlow;
uniform vec4 uGlowP[4];uniform vec3 uGlowC[4];uniform vec4 uFireP[4];
uniform vec4 uRay;uniform vec3 uRayC;uniform vec4 uTint;
float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}
vec3 screen(vec3 a,vec3 b){return 1.-(1.-a)*(1.-clamp(b,0.,1.));}
float mote(vec2 p,float sc,float sp){
  vec2 q=p*sc+vec2(uT*sp*.35,uT*sp*.55+sin(uT*.2+p.x*3.)*.2);
  vec2 id=floor(q),f=fract(q)-.5;float h=hash(id);
  vec2 o=vec2(hash(id+3.1),hash(id+7.7))-.5;
  float d=length(f-o*.6);
  return step(.84,h)*smoothstep(.075,0.,d)*(.5+.5*sin(uT*(1.+h*2.)+h*40.));
}
void main(){
  vec2 uv=vUv;vec2 p=vec2(uv.x*uAsp,uv.y);
  vec4 src=texture2D(uC,uv);vec3 c=src.rgb;
  vec2 px=1.4/uRes;
  float lx=lum(texture2D(uC,uv+vec2(px.x,0.)).rgb)-lum(texture2D(uC,uv-vec2(px.x,0.)).rgb);
  float ly=lum(texture2D(uC,uv+vec2(0.,px.y)).rgb)-lum(texture2D(uC,uv-vec2(0.,px.y)).rgb);
  float e=clamp(length(vec2(lx,ly))*3.2,0.,1.);
  // night / mood wash, laid before any light so lamps and fires punch through it
  c=mix(c,c*uTint.rgb,uTint.a);
  // gouache: blotchy pigment, directional brush streaks, dry-brush speckle, pooling at the cut edges
  float m1=fbm(p*4.2),m2=fbm(p*13.+7.);
  c*=1.+((m1-.5)*.22+(m2-.5)*.12)*uGouache;
  float st=noise(vec2(p.x*7.+m1*3.,p.y*150.+m2*4.));
  c*=1.+(st-.5)*.075*uGouache;
  float dry=smoothstep(.74,.96,noise(p*250.)*.62+m2*.5);
  c=mix(c,c+(vec3(.96,.92,.8)-c)*.34,dry*.5*uGouache);
  c*=1.-e*.3*uEdge;
  c+=e*.05*uEdge*(noise(p*400.)-.3);
  // water: glitter and slow light bands where the flow mask shows
  float wv=src.a*uFlow;
  float sp=pow(noise(vec2(p.x*38.+uT*.6,p.y*96.-uT*.45)),16.)*14.;
  c+=wv*min(sp,1.)*.16;
  c*=1.+wv*.07*sin(p.y*120.+uT*1.8+sin(p.x*20.+uT*.3)*2.);
  // gold leaf: keyed on the reserved leaf colour, it shimmers and answers the pointer
  vec2 md=p-vec2(uMouse.x*uAsp,uMouse.y);
  float k=smoothstep(.17,.045,distance(src.rgb,vec3(.965,.745,.173)));
  float sweep=pow(sin((p.x*1.3+p.y)*9.-uT*.9+length(md)*5.)*.5+.5,6.);
  float glit=step(.986,hash(floor(p*330.)+floor(uT*5.)));
  c+=k*uFoil*(sweep*.2+glit*.5+exp(-dot(md,md)*10.)*.26)*vec3(1.,.93,.62);
  // god rays
  if(uRaysOn>0.&&uRay.z>0.){
    vec2 d=p-vec2(uRay.x*uAsp,uRay.y);float r=length(d);vec2 nr=d/max(r,1e-4);
    float ry=noise(nr*3.6+vec2(uT*.07,-uT*.05))*.55+noise(nr*9.+vec2(-uT*.09,uT*.06)+5.)*.45;
    ry=smoothstep(.44,.8,ry)*exp(-r*1.5)*smoothstep(.02,.16,r);
    c=screen(c,uRayC*ry*uRay.z*.75*uRaysOn);
  }
  // lamp / halo glows
  for(int i=0;i<4;i++){
    vec4 g=uGlowP[i];if(g.w>0.){vec2 d=p-vec2(g.x*uAsp,g.y);
      float a=exp(-dot(d,d)/(g.z*g.z)*1.9)*g.w*(.9+.1*sin(uT*1.7+float(i)*2.1));
      c=screen(c,uGlowC[i]*a*uGlowOn);}
  }
  // living fire with rising embers
  for(int i=0;i<4;i++){
    vec4 f=uFireP[i];if(f.w>0.){vec2 d=(p-vec2(f.x*uAsp,f.y))/f.z;
      float sh=exp(-(d.x*d.x*2.2+(d.y<0.?d.y*d.y*7.:d.y*d.y*.75)));
      float fl=fbm(vec2(d.x*4.,d.y*3.-uT*1.9));
      c=screen(c,vec3(1.,.5,.12)*sh*(.35+.95*fl)*f.w*.62*uFireOn);
      vec2 q=vec2(d.x*7.+sin(d.y*3.+uT)*.4,d.y*7.-uT*1.3);vec2 id=floor(q);vec2 ff=fract(q)-.5;
      float em=step(.9,hash(id))*smoothstep(.16,0.,length(ff))*exp(-(d.x*d.x*1.2+max(d.y,0.)*.9))*step(-.2,d.y);
      c+=vec3(1.,.72,.3)*em*f.w*uFireOn;}
  }
  // drifting motes of dust and pollen
  c+=(mote(p,8.,.11)+mote(p+3.3,15.,.07)*.7+mote(p+8.1,27.,.05)*.5)*uMotes*vec3(1.,.95,.76)*.45;
  // the viewer's lantern
  c*=1.+uLantern*.17*exp(-dot(md,md)*7.);
  // paper tooth and fibres
  float g1=noise(p*uRes.y/2.1),g2=noise(p*uRes.y/7.+11.);
  c*=1.-uGrain*((g1-.5)*.11+(g2-.5)*.09);
  c+=uGrain*smoothstep(.93,1.,noise(vec2(p.x*34.,p.y*uRes.y*.55)))*.035;
  // vignette
  float v=smoothstep(1.22,.34,length((uv-.5)*vec2(1.08,1.22)));
  c*=mix(1.,.62+.38*v,uVig);
  gl_FragColor=vec4(c,1.);
}`;

  R.SHADERS = [
    ['wob', 'Hand-cut edges'], ['boil', 'Line boil'], ['gouache', 'Gouache & dry-brush'], ['edge', 'Pigment pooling'], ['flow', 'Flowing water'],
    ['foil', 'Gold leaf'], ['rays', 'God rays'], ['glow', 'Lamp glow'], ['fire', 'Fire & embers'], ['motes', 'Drifting motes'],
    ['lantern', 'Pointer lantern'], ['parallax', 'Depth parallax'], ['grain', 'Paper grain'], ['vig', 'Vignette'],
  ];
  const DEPTH = (R.DEPTH = { sky: 0.12, bg: 0.42, mid: 0.72, fg: 1.05 });

  R.Stage = function (canvas) {
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false, premultipliedAlpha: false, alpha: false });
    if (!gl) throw new Error('WebGL unavailable');
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const prog = (fs) => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.bindAttribLocation(p, 0, 'a'); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); const u = {}; const N = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); for (let i = 0; i < N; i++) { const info = gl.getActiveUniform(p, i); u[info.name.replace('[0]', '')] = gl.getUniformLocation(p, info.name); } return { p, u }; };
    const A = prog(FA), B = prog(FB);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const mkTex = () => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; };
    const names = ['sky', 'bg', 'mid', 'fg', 'mask'], tex = {}; names.forEach((k) => (tex[k] = mkTex()));
    const fboTex = mkTex(), fbo = gl.createFramebuffer(); let fw = 0, fh = 0;
    const self = this; self.fx = null; self.on = {}; R.SHADERS.forEach((s) => (self.on[s[0]] = 1));
    const scratch = document.createElement('canvas'), sctx = scratch.getContext('2d');

    self.load = async function (P, tw, th) {
      scratch.width = tw; scratch.height = th;
      for (const k of names) {
        const url = URL.createObjectURL(new Blob([P.svg(k, tw, th)], { type: 'image/svg+xml' }));
        const img = new Image(); img.src = url; await img.decode(); URL.revokeObjectURL(url);
        sctx.clearRect(0, 0, tw, th); if (k === 'mask') { sctx.fillStyle = '#000'; sctx.fillRect(0, 0, tw, th); }
        sctx.drawImage(img, 0, 0, tw, th);
        gl.bindTexture(gl.TEXTURE_2D, tex[k]); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scratch);
      }
      self.fx = P.fx;
    };
    self.size = function (w, h) {
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      if (fw !== w || fh !== h) { fw = w; fh = h; gl.bindTexture(gl.TEXTURE_2D, fboTex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTex, 0); }
    };
    // scene px (y down) -> screen uv (y up) for something riding on a layer of the given depth
    self.toUv = (x, y, depth, par, zoom) => [((x / R.W - 0.5 - par[0] * depth) * zoom + 0.5), ((1 - y / R.H - 0.5 - par[1] * depth) * zoom + 0.5)];
    self.draw = function (t, mouse, o = {}) {
      const w = canvas.width, h = canvas.height, on = self.on, fx = self.fx || { glow: [], fire: [] };
      const zoom = o.still ? 1 : 1.035, k = on.parallax && !o.still ? 1 : 0;
      const par = [-(mouse[0] - 0.5) * 0.022 * k, (mouse[1] - 0.5) * 0.014 * k];
      self.par = par; self.zoom = zoom;
      gl.viewport(0, 0, w, h);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.useProgram(A.p);
      names.forEach((nm, i) => { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, tex[nm]); });
      gl.uniform1i(A.u.uSky, 0); gl.uniform1i(A.u.uBg, 1); gl.uniform1i(A.u.uMid, 2); gl.uniform1i(A.u.uFg, 3); gl.uniform1i(A.u.uMask, 4);
      gl.uniform2f(A.u.uPar, par[0], par[1]); gl.uniform1f(A.u.uT, t); gl.uniform1f(A.u.uZoom, zoom); gl.uniform1f(A.u.uAsp, w / h);
      gl.uniform1f(A.u.uBoil, on.boil ? 1 : 0); gl.uniform1f(A.u.uWob, on.wob ? 1 : 0); gl.uniform1f(A.u.uFlow, on.flow ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.useProgram(B.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fboTex); gl.uniform1i(B.u.uC, 0);
      gl.uniform2f(B.u.uRes, w, h); gl.uniform2f(B.u.uMouse, mouse[0], 1 - mouse[1]); gl.uniform1f(B.u.uT, t); gl.uniform1f(B.u.uAsp, w / h);
      const U = (n, v) => gl.uniform1f(B.u[n], v);
      U('uGrain', on.grain ? 1 : 0); U('uGouache', on.gouache ? 1 : 0); U('uEdge', on.edge ? 1 : 0); U('uFoil', on.foil ? 1 : 0); U('uRaysOn', on.rays ? 1 : 0);
      U('uGlowOn', on.glow ? 1 : 0); U('uFireOn', on.fire ? 1 : 0); U('uMotes', on.motes ? (fx.motes != null ? fx.motes : 1) : 0); U('uVig', on.vig ? 1 : 0); U('uLantern', on.lantern && !o.still ? 1 : 0); U('uFlow', on.flow ? 1 : 0);
      const gp = new Float32Array(16), gc = new Float32Array(12), fp = new Float32Array(16);
      fx.glow.forEach((g, i) => { const uv = self.toUv(g[0], g[1], DEPTH.mid, par, zoom); gp.set([uv[0], uv[1], g[2] / R.H, g[3]], i * 4); gc.set(R.rgb(g[4]), i * 3); });
      fx.fire.forEach((f, i) => { const uv = self.toUv(f[0], f[1], DEPTH.mid, par, zoom); fp.set([uv[0], uv[1], f[2] / R.H, f[3]], i * 4); });
      gl.uniform4fv(B.u.uGlowP, gp); gl.uniform3fv(B.u.uGlowC, gc); gl.uniform4fv(B.u.uFireP, fp);
      if (fx.rays) { const uv = self.toUv(fx.rays[0], fx.rays[1], DEPTH.bg, par, zoom); gl.uniform4f(B.u.uRay, uv[0], uv[1], fx.rays[2], 0); const rc = R.rgb(fx.rays[3]); gl.uniform3f(B.u.uRayC, rc[0], rc[1], rc[2]); } else gl.uniform4f(B.u.uRay, 0, 0, 0, 0);
      if (fx.tint) { const tc = R.rgb(fx.tint[0]); gl.uniform4f(B.u.uTint, tc[0], tc[1], tc[2], fx.tint[1]); } else gl.uniform4f(B.u.uTint, 1, 1, 1, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
  };
})();
