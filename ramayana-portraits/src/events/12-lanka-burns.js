// Sundara Kanda — bound and paraded with his tail set alight, Hanuman breaks free, leaps on to the city's gate and runs
// across the golden mansions and turrets of Lanka, setting them ablaze "like the fire of destruction".
(function () {
  RP.events['12-lanka-burns'] = {
    title: 'Hanuman Sets Golden Lanka Ablaze',
    W: 1800, H: 1200, seed: 8008,
    layers: RP.eventLayers,
    accents: ['#fff3a0', '#ffd23a', '#ff3a1a', '#3a1aff', '#ffffff'],
    flow: RP.flows.rising(1.2),
    turbulence: 0.9,
    draw(K) {
      const { W, H } = K;
      K.bg(K.lin(0, 0, 0, H, ['#0e0a3a', '#2a0a5a', '#7a0a4a', '#e0401a', '#ffb02a']));
      K.blob(1500, 180, 380, '#1a1a7a', 0.7);
      K.blob(250, 120, 300, '#3a1a8a', 0.6);
      // smoke rolling up from the city
      [[600, 560, 260], [1100, 500, 300], [1500, 560, 240]].forEach(([x, y, r]) => K.blob(x, y, r, '#3a1a3a', 0.55));
      // Mount Trikuta, the dark hill Lanka stands on
      K.mountain([[-50, 1200], [-50, 900], [300, 860], [700, 840], [1100, 850], [1500, 830], [1850, 880], [1850, 1200]], ['#5a1a6a', '#3a0a4a', '#1a0630', '#0a0418'], 0.3);
      // the golden city of Lanka: gilded towers, domes and mansions, back row then front row
      const gold = ['#fffbd8', '#ffe04a', '#e8a818', '#7a4a08'];
      for (let i = 0; i < 11; i++) K.palace(80 + i * 165 + K.R(-20, 20), 900, K.R(100, 130), K.R(150, 230), { roof: i % 2 ? 'shikhara' : 'dome', colors: gold, roofColors: gold, window: '#5a1a0a', flag: '#ff2a3a', focus: 0.5 });
      for (let i = 0; i < 9; i++) K.palace(150 + i * 195 + K.R(-20, 20), 1080, K.R(150, 190), K.R(130, 200), { roof: i % 3 === 1 ? 'shikhara' : 'dome', colors: gold, roofColors: gold, window: '#4a0a0a', flag: '#ff2a3a', focus: 0.55 });
      K.fill(K.poly([[0, 1080], [W, 1080], [W, H], [0, H]]), K.lin(0, 1080, 0, H, ['#ffd23a', '#c8701a', '#5a1a0a']));
      // red fire bursting from the mansions
      const fire = ['#fff0a0', '#ff8a1a', '#e8201a', '#8a0a2a', 'rgba(60,8,40,0.5)'];
      [[230, 900], [610, 1080], [830, 900], [1180, 1080], [1420, 900], [1650, 1080], [60, 1080], [1000, 900]].forEach(([x, y], i) => K.flame(x + K.R(-20, 20), y - K.R(60, 140), K.R(110, 170), K.R(240, 380), fire, K.R(-50, 30)));
      // Hanuman flying high above the burning city, his blazing tail streaming behind
      const tail = [[470, 400], [340, 450], [220, 400], [150, 300], [200, 210]];
      K.strokeRef(tail, 26, '#e8701a');
      K.flowStroke(tail, 50);
      const han = K.vanara({
        x: 480, y: 440, h: 620, rot: 1.15, turn: 0.3, gaze: 1, tilak: true, crownSmall: true, tail: false,
        pose: { legs: 'fly', armL: [0.1, 0.05], armR: [2.95, 0.05] },
        fur: ['#ffc85a', '#f07a1a', '#b0301a', '#4a1020'], cloth: ['#ff4a3a', '#d0101a', '#7a0a2a', '#2a0a1a'], scarf: ['#fff27a', '#ffc21a', '#ff8a10', '#c0401a'],
      });
      K.overlay((pen) => {
        const tp = RP.sampleCurve(tail, 12);
        for (let i = 0; i < tp.length; i++) { const p = tp[i], f = 0.5 + i / tp.length; pen.line([[p[0] + K.R(-8, 8), p[1] + 6], [p[0] + K.R(-40, 20), p[1] - K.R(50, 110) * f], [p[0] + K.R(-60, 10), p[1] - K.R(90, 170) * f]], { w: K.R(16, 30), color: K.pick(['#fff3a0', '#ffd23a', '#ff7a1a', '#ff3a1a']), taper: 1, alpha: 0.9 }); }
        // embers trailing his flight
        for (let k = 0; k < 40; k++) pen.dab(K.R(100, 900), K.R(150, 600), K.R(3, 7), K.pick(['#fff3a0', '#ffb02a', '#ff5a1a']), 0.9);
        // rakshasas fleeing along the rooftops
        for (let k = 0; k < 10; k++) {
          const x = K.R(80, 1750), y = K.R(1100, 1170);
          pen.line([[x, y], [x + 8, y - 34]], { w: 12, color: '#2a0a3a', taper: 0.4 });
          pen.dab(x + 9, y - 44, 9, '#3a5a3a');
          pen.line([[x + 8, y - 30], [x + 26, y - 50]], { w: 5, color: '#2a0a3a' });
        }
      });
      K.sparks(140, [0, 500, W, H]);
    },
  };
})();
