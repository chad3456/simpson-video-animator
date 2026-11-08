// Sundara Kanda — bound and paraded with his tail set alight, Hanuman breaks free, leaps on to the city's gate and runs
// across the golden mansions and turrets of Lanka, setting them ablaze "like the fire of destruction".
(function () {
  RP.events['08-lanka-burns'] = {
    title: 'Hanuman Sets Golden Lanka Ablaze',
    W: 1800, H: 1200, seed: 8008,
    layers: RP.eventLayers,
    accents: ['#fff3a0', '#ffd23a', '#ff3a1a', '#3a1aff', '#ffffff'],
    flow: RP.flows.rising(1.2),
    turbulence: 0.9,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#140a3a', '#4a0a4a', '#c0102a', '#ff6a1a', '#ffc22a']));
      K.blob(400, 200, 400, '#2a1a8a', 0.6);
      // the golden city: towers and palaces
      for (let i = 0; i < 9; i++) {
        const x = 90 + i * 205 + K.R(-30, 30), h = K.R(260, 520), w = K.R(150, 200);
        K.palace(x, 1200, w, h, { roof: i % 2 ? 'shikhara' : 'dome', colors: ['#fff3a0', '#ffc22a', '#c86a1a', '#5a1a1a'], window: '#3a0a1a', lit: true, flag: '#3a1a6a', focus: 0.3 });
      }
      // flames climbing the city
      // flames climbing between the towers
      for (let i = 0; i < 16; i++) K.flame(60 + i * 115 + K.R(-30, 30), 1220, K.R(90, 170), K.R(260, 560), null, K.R(-50, 50));
      // Hanuman mid-leap across the rooftops, blazing tail streaming behind
      const tail = [[1080, 640], [1250, 700], [1420, 600], [1560, 470], [1700, 420]];
      K.strokeRef(tail, 34, '#e8701a');
      K.flowStroke(tail, 60);
      K.blob(1700, 420, 200, '#ffd23a', 0.9);
      const han = K.vanara({
        x: 900, y: 980, h: 760, rot: -0.35, turn: -0.4, gaze: -1, brow: 1, tilak: true, crownSmall: true,
        pose: { legs: 'leap', armL: [2.6, 0.2], armR: [1.2, 0.8] }, tail: false,
        fur: ['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'], cloth: ['#ff4a3a', '#d0101a', '#7a0a2a', '#2a0a1a'],
      });
      // the gada raised in his hand
      const [hx, hy] = han.handL;
      K.strokeRef([[hx + 30, hy + 60], [hx - 40, hy - 120]], 18, '#a0501a');
      K.fill(K.ell(hx - 55, hy - 160, 60, 70, -0.4), K.rad(hx - 70, hy - 180, 5, 80, ['#fff8c0', '#ffc22a', '#c0601a', '#5a2010']));
      K.focus(K.ell(hx - 55, hy - 160, 60, 70, -0.4), 0.8);
      K.overlay((pen) => {
        const tp = RP.sampleCurve(tail, 3); for (let i = 0; i < tp.length; i += 2) { const p = tp[i]; pen.line([p, [p[0] - K.R(10, 50), p[1] - K.R(50, 110) * (0.4 + i / tp.length)]], { w: K.R(14, 28), color: K.pick(['#fff3a0', '#ffd23a', '#ff7a1a']), taper: 1, alpha: 0.9 }); }
        // rakshasas fleeing on the rooftops
        for (let k = 0; k < 9; k++) {
          const x = K.R(80, 1750), y = K.R(820, 1000);
          if (Math.abs(x - 900) < 260) continue;
          pen.line([[x, y], [x + 8, y - 34]], { w: 12, color: '#2a0a3a', taper: 0.4 });
          pen.dab(x + 9, y - 44, 9, '#3a5a3a');
          pen.line([[x + 8, y - 30], [x + 26, y - 50]], { w: 5, color: '#2a0a3a' });
        }
      });
      K.sparks(160, [0, 200, W, H]);
    },
  };
})();
