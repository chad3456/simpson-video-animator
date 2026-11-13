/* Sundara Kanda: paintings 74-88 */
(function () {
  const R = window.R, C = R.C, W = R.W, H = R.H, F = R.F, put = R.put, pat = R.pat, S = R.S;
  const { path, line, circ, ell, g, rect } = R;
  const K = 'Sundara Kanda';
  const eye = (x, y, k, col = C.cream, pupil = C.ink, mood) => g(path('M-30,0 Q0,-24 32,-2 Q0,16 -30,0 Z', col) + circ(2, -3, 9, pupil) + line('M-34,2 Q0,-28 36,-4', C.ink, 4) + (mood ? line('M-34,-22 L34,-12', C.ink, 6) : ''), `translate(${x},${y}) scale(${k})`);
  const TAIL = [[-12, -4], [-60, 30], [-120, 20], [-170, -30], [-180, -100], [-140, -140], [-110, -110]];
  // the ashoka grove at night: used by several paintings
  const grove = (P, o = {}) => {
    R.sky(P, Object.assign({ time: 'night', seed: o.seed || 5, bands: 5, stars: 18, motes: 8 }, o.sky || {}));
    P.bg(R.grove((o.seed || 5) + 1, -60, W + 60, o.gy || 730, o.n || 8, { kinds: ['ashoka', 'ashoka', 'bloom', 'tier'], cols: [C.forest, C.teal, C.green], s0: 0.9, s1: 1.4, fcols: [C.vermilion, C.gold] }));
    P.bg(R.ground(o.gy || 730, o.gcol || C.forest, { seed: o.seed, stripes: 3, tufts: 14, flowers: 14, c2: C.navy, c3: C.teal, fcols: [C.vermilion, C.saffron, C.white] }));
  };
  const SITA = { head: { eye: 'sad' } };

  R.add({ n: 74, slug: 'the-leap', kanda: K, ref: 'Sundara 1', title: 'The leap',
    text: 'He crouches on Mahendra and the mountain sweats water and red ore; snakes spit fire from its caves; sages rise into the air to watch. Then he is gone. Trees torn up by the wind of his thighs follow him out to sea like kin seeing off a traveller, and their flowers fall on the water like stars. His shadow lies on the waves ten yojanas wide and thirty long.' }, (P) => {
    S.sea(P, { seed: 501, hy: 560, time: 'day', sky: { bands: 6, motes: 10, disc: [1340, 150, 60, C.gold, C.saffron] } });
    P.sky(R.speed(60, 300, { seed: 3, n: 40, col: C.white, r0: 300, w: 7, a0: -0.25, a1: 0.25 }) + R.cloud(1300, 400, 1.6, C.white) + R.cloud(260, 120, 1.2, C.ice));
    P.bg(R.peak(-60, 900, 700, 620, C.green, { c2: C.lime, lean: -40, step: 0.13 }) + R.rocks(4, 120, 420, 600, 5, C.slate, 30) + R.sil(R.fig({ x: 880, y: 760, s: 2.4, rot: 80, kind: 'monkey', fur: C.navy, tail: TAIL, pose: 'fly', cloth: { lower: 'none' } }), C.navy, 0.35));
    P.note(900, 800, 'His shadow on the sea', 'A sea-demon will soon try to catch it.');
    P.bg(g(R.lanka(0, 0, 1, { lamps: 1 }), 'translate(1500,560) scale(.16)'));
    const f = R.rng(7); let wake = '';
    for (let i = 0; i < 9; i++) wake += R.tree(f.pick(['bloom', 'round', 'tier']), f.r(140, 520), f.r(260, 480), f.r(0.34, 0.6), { rot: f.r(40, 110), c: f.pick([C.green, C.leaf, C.forest]) });
    P.mid(wake + R.petals(5, [120, 180, 900, 520], 50, [C.white, C.pink, C.vermilion, C.gold]));
    P.note(330, 200, 'Trees in his wake', 'Pulled up by the wind of his passing; they follow a while, then fall.');
    put(P, 'mid', 'hanuman', { x: 700, y: 330, s: 2.1, rot: 80, pose: ['fly', { aR: [164, 172], aL: [120, 140] }], tail: TAIL, head: { eye: 'open', mouth: 'smile' }, nx: 480, ny: 420 }, 'Arms out like five-hooded serpents, tail curled like Indra’s banner.');
    P.fg(R.fish(300, 840, 1.1, C.orange, C.gold, -20) + R.fish(1200, 860, 1.2, C.leaf, C.lime, -14, -1) + R.makara(60, 900, 1, { rot: -14 }) + R.motes(4, [200, 640, 1500, 880], 12, [C.white], { min: 14, max: 32 }));
    P.glow(1340, 150, 150, C.gold, 0.4);
  });

  R.add({ n: 75, slug: 'mainaka', kanda: K, ref: 'Sundara 1', title: 'A mountain rises to offer rest',
    text: 'The Ocean owes the house of Ikshvaku a debt, and bids the golden mountain hidden in his depths to rise. Mainaka stands up through the waves, peaks blazing, and speaks in a man’s shape from his summit: “Rest on me. Your father the Wind once saved me when Indra was cutting the wings off the mountains.” Hanuman touches him with his palm. “I have promised not to stop on the way.”' }, (P) => {
    S.sea(P, { seed: 502, hy: 520, time: 'dawn', sky: { bands: 6, motes: 14 } });
    P.sky(R.burst(820, 300, 120, { seed: 2, col: C.cream, n: 50, len: 3 }));
    const wing = (sd) => g([0, 1, 2, 3, 4].map((i) => g(path('M0,0 C30,-60 30,-170 0,-230 C-30,-170 -30,-60 0,0 Z', i % 2 ? C.gold : C.amber, { stroke: C.ochre, 'stroke-width': 2 }), `rotate(${sd * (40 + i * 18)})`)).join(''), `translate(${820 + sd * 260},640)`);
    P.bg(wing(-1) + wing(1));
    P.bg(R.peak(820, 900, 760, 600, C.gold, { c2: C.amber, step: 0.11, fill: pat('stone', C.gold, C.amber, 1.4) }) + R.peak(600, 900, 420, 360, C.mustard, { c2: C.gold }) + R.peak(1060, 900, 440, 380, C.mustard, { c2: C.gold }));
    P.note(540, 470, 'Wings', 'Mountains once flew. Mainaka kept his by hiding in the sea.');
    P.bg(R.ring(820, 760, 520, C.white, 5) + R.ring(820, 760, 600, C.pale, 3) + R.motes(3, [300, 700, 1340, 880], 16, [C.white], { min: 14, max: 34 }));
    put(P, 'mid', 'janaka', { x: 800, y: 330, s: 0.8, label: 'Mainaka', skin: C.gold, pose: 'offer', head: { gear: 'mukut', beard: 0, must: 0, halo: 44 }, cloth: { upper: 0, lc: C.amber, sash: C.straw, belt: C.red, sleeve: 0 } }, 'Son of Himalaya, speaking from his own summit.');
    put(P, 'mid', 'hanuman', { x: 1240, y: 250, s: 1.7, rot: 62, face: -1, pose: ['fly', { aR: [170, 150], aL: [60, 20] }], tail: TAIL, head: { mouth: 'smile' }, nx: -330, ny: 330 }, 'He honours the offer with a touch and does not slow.');
    P.fg(R.fish(240, 820, 1, C.orange, C.gold, -8) + R.swan(1360, 800, 1) + R.lotusPad(1500, 860, 1.2));
    P.glow(820, 420, 300, C.gold, 0.4).rays(820, 300, 0.5, C.cream);
  });

  R.add({ n: 76, slug: 'surasa', kanda: K, ref: 'Sundara 1', title: 'Surasa’s mouth',
    text: 'The gods want to see what he is made of, and send Surasa, mother of serpents, to stand in his path as a rakshasi: “No one passes me without entering my mouth.” He grows; her jaws grow wider. Ten yojanas, twenty, fifty, ninety, a hundred. Then he shrinks to the size of a thumb, darts in and out between her teeth, and bows in mid-air. “I have entered your mouth. Farewell.”' }, (P) => {
    S.sea(P, { seed: 503, hy: 620, time: 'teal', sky: { bands: 7, motes: 8 }, water: { col: C.teal, c2: C.sea, c3: C.navy } });
    const scales = pat('scale', C.green, C.lime, 2);
    P.bg(path('M1700,960 C1500,900 1380,760 1400,600 C1420,470 1560,420 1700,440 Z', scales, { stroke: C.forest, 'stroke-width': 5 }));
    P.mid(path('M620,120 C820,20 1240,20 1500,200 C1640,300 1660,460 1560,520 C1400,470 1100,420 760,470 C700,330 660,220 620,120 Z', scales, { stroke: C.forest, 'stroke-width': 6 }) + path('M700,820 C860,900 1300,900 1540,700 C1600,640 1600,560 1560,520 C1360,600 1040,640 780,600 C740,680 710,760 700,820 Z', scales, { stroke: C.forest, 'stroke-width': 6 }));
    P.mid(path('M760,470 C1100,420 1400,470 1560,520 C1360,600 1040,640 780,600 Z', C.maroon) + path('M900,540 C1100,500 1300,520 1440,548 C1300,600 1100,610 900,570 Z', C.vermilion) + path('M900,552 L640,500 L660,560 L640,610 Z', C.vermilion, { opacity: 0 }));
    let teeth = ''; for (let i = 0; i < 9; i++) teeth += path(`M${780 + i * 80},${468 - i * 2 + (i > 4 ? (i - 4) * 12 : 0)} l26,${70 - i * 3} l26,${-66 + i * 3} Z`, C.white) + path(`M${800 + i * 78},${604 - (i > 4 ? (i - 4) * 16 : 0)} l24,${-60 + i * 3} l24,${58 - i * 3} Z`, C.white);
    P.mid(teeth + eye(1130, 210, 3, C.gold, C.crimson, 1) + line('M640,150 q-60,-20 -100,10 M660,200 q-70,0 -100,40', C.forest, 8) + line('M1000,560 C900,540 780,560 700,520 l-34,-22 M700,520 l-36,16', C.crimson, 9));
    P.note(1130, 90, 'Surasa', 'Mother of the nagas, sent to test him. Pleased, she blesses his errand.');
    P.mid(line(R.smooth([[330, 330], [520, 430], [760, 520], [900, 560], [820, 600], [600, 640], [420, 700]]), C.cream, 5, { 'stroke-dasharray': '4 14' }));
    put(P, 'mid', 'hanuman', { x: 400, y: 760, s: 0.62, rot: -120, face: -1, pose: 'fly', hs: 1.3, head: { mouth: 'smile' }, nx: -60, ny: 120 }, 'Thumb-sized, already out the other side.');
    P.mid(R.sil(R.fig({ x: 330, y: 330, s: 1.5, rot: 70, kind: 'monkey', fur: C.orange, tail: TAIL, pose: 'fly', cloth: { lower: 'none' } }), C.orange, 0.3));
    P.note(280, 150, 'As he was a moment ago', 'Ninety yojanas tall, and her mouth a hundred.');
    P.fg(R.motes(6, [100, 680, 700, 880], 8, [C.white], { min: 14, max: 30 }));
    P.fx.tint = [C.aqua, 0.12];
  });

  R.add({ n: 77, slug: 'simhika', kanda: K, ref: 'Sundara 1', title: 'The shadow-catcher',
    text: 'Something has hold of him; he flies like a ship against the wind. Below, a huge shape lifts from the water with his shadow in its grip. This is Simhika, of whom Sugriva warned, who eats what she catches by its shadow. Her mouth opens like the underworld. He makes himself small as a bolt, drops into it, tears out her heart with his nails, and is up in the sky again before she sinks.' }, (P) => {
    S.sea(P, { seed: 504, hy: 380, time: 'storm', sky: { bands: 6, motes: 0 }, water: { col: C.navy, c2: C.indigo, c3: C.ink, bands: 12 } });
    P.sky(R.cloud(300, 130, 2, C.smoke, C.slate) + R.cloud(1300, 110, 2.2, C.smoke, C.slate));
    put(P, 'mid', 'hanuman', { x: 620, y: 230, s: 1.4, rot: 84, pose: ['fly', { aR: [150, 120], aL: [100, 60], head: 20 }], tail: TAIL, head: { eye: 'wide' }, nx: 330, ny: 240 }, 'Held fast by nothing he can see, until he looks down.');
    P.bg(R.sil(R.fig({ x: 660, y: 640, s: 1.7, rot: 84, kind: 'monkey', fur: C.ink, tail: TAIL, pose: ['fly', { aR: [150, 120], aL: [100, 60] }], cloth: { lower: 'none' } }), C.ink, 0.7));
    P.bg(line('M760,330 L900,560 M700,320 L780,560 M860,300 L1040,560', C.pale, 3, { 'stroke-dasharray': '3 14', opacity: 0.7 }));
    P.note(900, 520, 'The shadow', 'She draws him down by it as by a rope.');
    P.mid(path('M940,960 C900,800 960,640 1140,600 C1340,560 1520,660 1560,960 Z', C.sPurple, { stroke: C.ink, 'stroke-width': 5 }) + path('M1000,960 C1000,860 1080,800 1220,800 C1360,800 1440,860 1450,960 Z', C.maroon) + [0, 1, 2, 3, 4, 5].map((i) => path(`M${1030 + i * 68},816 l22,60 l22,-60 Z`, C.white)).join('') + eye(1110, 700, 2, C.gold, C.crimson, 1) + g(eye(0, 0, 2, C.gold, C.crimson, 1), 'translate(1370,700) scale(-1,1)') + path('M980,620 L920,520 L1010,580 L1000,470 L1080,570 L1110,470 L1150,580 L1230,480 L1250,580 L1340,490 L1340,590 L1440,520 L1420,620 Z', C.ink));
    const claw = (x, y, rot) => g(line('M0,0 C-30,-90 -40,-200 0,-290', C.ink, 62) + line('M0,0 C-30,-90 -40,-200 0,-290', C.sPurple, 54) + [-40, -14, 12, 38].map((a) => g(path('M-12,0 L0,-70 L12,0 Z', C.sPurple, { stroke: C.ink, 'stroke-width': 3 }) + path('M-5,-52 L0,-84 L5,-52 Z', C.bone), `translate(0,-290) rotate(${a})`)).join(''), `translate(${x},${y}) rotate(${rot})`);
    P.mid(claw(560, 960, 14) + claw(880, 980, -22));
    P.note(1240, 440, 'Simhika', 'She has been hungry a long time.');
    P.fg(R.motes(3, [100, 500, 1500, 880], 14, [C.pale], { min: 12, max: 30 }) + R.rain(4, C.pale, 60, -0.4));
    P.fx.tint = [C.pale, 0.2];
  });

  R.add({ n: 78, slug: 'lanka-by-moonlight', kanda: K, ref: 'Sundara 2–4', title: 'Lanka by moonlight',
    text: 'He lands on the Trikuta peak and looks: walls of gold, gateways of lapis and crystal, moats thick with lotuses, banners like creepers, a city hung in the sky. No army could take it. He waits for the sun to set, makes himself small, and steps onto the rampart with his left foot first. The moon comes up as if to light his way, white as a conch, like a swan in a silver cage.' }, (P) => {
    R.sky(P, { time: 'night', seed: 505, bands: 6, stars: 30, motes: 10, moon: [1180, 180, 96] });
    P.sky(R.peak(800, 900, 1900, 640, C.plum, { c2: C.violet, step: 0.1 }) + R.peak(200, 900, 800, 460, C.indigo, { c2: C.violet }) + R.peak(1420, 900, 800, 480, C.indigo, { c2: C.violet }));
    P.bg(R.city(51, -40, W + 40, 600, { n: 13, s: 1.1, walls: [C.gold, C.mustard, C.amber, C.straw], trims: [C.crimson, C.red], roofs: [C.gold], win: C.maroon, lamps: 1 }) + R.palace(700, 600, 380, 440, { tiers: 3, domes: 3, wall: C.gold, trim: C.crimson, roof: C.gold, win: C.maroon, ds: 1, lamps: 1 }));
    let wall = rect(-80, 590, W + 160, 110, pat('brick', C.amber, C.gold, 1.5)) + rect(-80, 580, W + 160, 14, C.crimson);
    for (let x = -60; x < W + 60; x += 64) wall += rect(x, 554, 38, 28, C.amber);
    P.bg(wall + R.gate(1180, 700, 0.5, { col: C.amber, dark: C.maroon }));
    for (let i = 0; i < 9; i++) P.bg(g(R.item('flag', { col: i % 2 ? C.crimson : C.gold }), `translate(${90 + i * 180},${540}) scale(.4)`));
    R.water(P, 'bg', 700, H, { seed: 6, bands: 5, curls: 9, col: C.indigo, c2: C.blue, c3: C.navy });
    P.mid(R.sil(F('hanuman', { x: 420, y: 556, s: 0.34, pose: 'tiptoe' }), C.ink, 0.95) + R.ring(420, 520, 44, C.cream, 2.5));
    P.note(420, 450, 'Hanuman', 'Small, on the wall, at nightfall.');
    P.mid(F('rakshasa', { x: 1090, y: 700, s: 0.5, hold: { R: { k: 'torch', seed: 2 } }, pose: ['stand', { aR: [40, 110] }] }) + F('rakshasa', { x: 1270, y: 700, s: 0.5, face: -1, args: [C.sPurple, C.ink], hold: { R: { k: 'spear' } }, pose: ['stand', { aR: [40, 110] }] }));
    P.fg(R.lotusPad(240, 820, 1.4) + R.lotusPad(620, 860, 1.2, C.white) + R.lotusPad(1000, 830, 1.3) + R.lotusPad(1400, 870, 1.4, C.white) + R.swan(820, 800, 0.9));
    P.fx.tint = [C.pale, 0.24]; P.glow(1180, 180, 220, C.cream, 0.55).fire(1104, 610, 40, 0.8);
  });

  R.add({ n: 79, slug: 'the-sleeping-palace', kanda: K, ref: 'Sundara 6–9', title: 'The sleeping palace',
    text: 'He searches house by house and comes to Ravana’s own, and in it the Pushpaka, the flying palace taken from Kubera, built by Vishvakarma, moving at its master’s thought. Past midnight the great hall is a lotus pond of sleeping women, drums and vinas dropped beside them. Ravana sleeps like a dark cloud on a crystal dais. Seeing Mandodari, golden and jewelled, Hanuman leaps for joy: Sita! Then he thinks again. Sita would not sleep.' }, (P) => {
    S.court(P, { inner: 'deep', arches: [[800, 520, 640, 9]], wall: C.indigo, wall2: C.blue, wpat: 'rings', border: C.gold, trim: C.aqua, fcol: C.navy, fcol2: C.gold, floor: C.teal, floor2: C.navy, floor3: C.sea, carpet: false, seed: 506, top: 80, lamps: [200, 1400], lampLen: 130 });
    P.sky(R.motes(4, [520, 150, 1080, 700], 16, [C.gold, C.cream], { kind: 'star', min: 8, max: 20 }) + g(R.vimana(0, 0, 1, { win: C.maroon, wall: C.straw, inner: C.rose }), 'translate(800,560) scale(.74)'));
    P.note(800, 150, 'The Pushpaka', 'Yoked with swans, hung with bells, bright as a hill of gold.');
    P.mid(R.bed(520, 800, 1.7, C.crimson));
    put(P, 'mid', 'ravana', { x: 770, y: 652, s: 1.4, rot: -90, heads: 10, pose: ['lie', { aR: [60, 120] }], head: { eye: 'closed', mouth: 'neutral' }, cape: null, nx: -300, ny: 250 }, 'Asleep after love and wine, his arms like Indra’s banners, scarred by the thunderbolt.');
    P.mid(R.bed(1220, 820, 1.2, C.teal));
    put(P, 'mid', 'mandodari', { x: 1040, y: 716, s: 1.1, rot: 90, face: -1, pose: 'lie', head: { eye: 'closed' }, nx: 250, ny: 200 }, 'Ravana’s queen. For one breath Hanuman takes her for Sita.');
    let sl = ''; const f = R.rng(6); [[120, 880], [700, 890], [900, 870], [1060, 890], [1480, 880]].forEach((q, i) => { const c1 = f.pick([C.pink, C.aqua, C.magenta, C.gold]); sl += F('woman', { x: q[0], y: q[1], s: 0.72, rot: i % 2 ? 90 : -90, face: i % 2 ? -1 : 1, pose: 'lie', head: { eye: 'closed', gear: 0 }, args: [c1, C.gold, f.pick([C.sFair, C.sWheat, C.sTan])] }); });
    P.fg(sl + g(R.item('veena'), 'translate(980,880) rotate(70) scale(.9)') + g(R.item('pot', { col: C.gold }), 'translate(380,884) rotate(80) scale(1.4)') + g(R.item('bowl'), 'translate(1300,890) scale(1)'));
    P.mid(R.pillar(950, 760, 620, 50, C.gold, C.aqua));
    put(P, 'mid', 'hanuman', { x: 962, y: 330, s: 0.5, face: -1, pose: 'climb', head: { eye: 'wide' }, hs: 1.3, ny: 60 }, '“To look at other men’s wives asleep… but my mind is not stirred; and where else would one look for a woman?”');
    P.fx.tint = [C.pale, 0.3]; P.fire(200, 250, 50, 0.7).fire(1400, 250, 50, 0.7).glow(800, 400, 260, C.gold, 0.25);
  });

  R.add({ n: 80, slug: 'under-the-shimshapa', kanda: K, ref: 'Sundara 12–15', title: 'Under the shimshapa tree',
    text: 'Only the ashoka grove is left unsearched. From the top of a golden-leaved shimshapa he sees her at last: thin with fasting, in one worn yellow cloth, on the bare ground, sighing; like the sliver of the new moon, like a flame wrapped in smoke, like a doe strayed from the herd among hounds. Round her squat the guards: one-eyed, one-eared, ears like winnowing fans, faces of boar and camel.' }, (P) => {
    grove(P, { seed: 512, sky: { moon: [1380, 150, 50, 1] } });
    P.bg(R.palace(1320, 740, 380, 330, { tiers: 2, domes: 3, wall: C.pale, trim: C.gold, roof: C.gold, win: C.navy, aw: 44 }));
    P.note(1320, 330, 'The thousand-pillared shrine');
    P.bg(R.tree('banyan', 640, 760, 2.3, { c: C.olive, c2: C.gold, tc: C.umber }));
    P.mid(R.ring(640, 700, 150, C.cream, 3) + circ(640, 700, 150, C.gold, { opacity: 0.16 }));
    put(P, 'mid', 'sitaL', { x: 640, y: 800, s: 1.3, pose: 'sitGrief', head: { eye: 'closed' }, ny: -20 }, 'Ten months a prisoner. Her single braid has not been undone since Panchavati.');
    put(P, 'mid', 'hanuman', { x: 560, y: 330, s: 0.5, pose: 'sit', hs: 1.3, head: { eye: 'wide' }, ny: 70 }, 'Hidden in the leaves, the size of a cat. “Because of her, Rama grieves; and rightly.”');
    const ring = [[250, 820, 1, C.sGreen, 'sit', 'spear'], [400, 880, 1, C.sPurple, 'sit', 0], [900, 880, -1, C.sRed, 'sit', 'gada'], [1060, 830, -1, C.sRak, 'stand', 'trident'], [120, 760, 1, C.slate, 'stand', 'sword'], [1200, 880, -1, C.sGreen, 'sit', 0]];
    ring.forEach((q, i) => P[i < 4 ? 'mid' : 'fg'](F('rakshasi', { x: q[0], y: q[1], s: 1.06, face: q[2], pose: q[4], args: [q[3], [C.olive, C.plum, C.maroon][i % 3]], head: { horns: i % 2, eye: i % 3 ? 'angry' : 'closed', earring: 'big' }, hold: q[5] ? { R: q[5] } : {} })));
    P.note(980, 620, 'The guards', 'Ravana’s orders: frighten her, coax her, break her.');
    P.fg(R.fronds(3, 'L', { n: 3, cols: [C.forest, C.navy] }) + R.petals(6, [200, 200, 1400, 760], 22, [C.vermilion, C.saffron]));
    P.fx.tint = [C.pale, 0.3]; P.glow(640, 680, 190, C.straw, 0.5);
  });

  R.add({ n: 81, slug: 'ravana-in-the-grove', kanda: K, ref: 'Sundara 16–20', title: 'Ravana comes before dawn',
    text: 'In the last watch of the night, woken by the chanting of his brahma-rakshasas and by the thought of her, Ravana comes with a hundred women carrying lamps of scented oil, fans and a gold pitcher. Sita covers herself with her knees and arms. He pleads, boasts, offers; she answers through a blade of grass. “Two months remain,” he says, and raises his hand to strike. A young queen draws him away, laughing.' }, (P) => {
    grove(P, { seed: 516, sky: { bands: 6 } });
    P.bg(R.tree('banyan', 1240, 760, 2, { c: C.olive, c2: C.gold, tc: C.umber }));
    P.bg(R.crowd({ x0: 40, x1: 520, y: 770, n: 6, s: 0.86, kinds: ['woman'], pose: () => ['stand', { aR: [60, 150] }], face: 1, seed: 16, each: (i, f) => ({ hold: { R: i % 2 ? { k: 'torch', seed: i } : { k: 'chamara' } }, head: { gear: 0, hair: 'bun' } }) }));
    P.note(280, 500, 'The women of the inner palace', 'Sleepy, garlands slipping, lighting his way with lamps.');
    put(P, 'mid', 'ravana', { x: 760, y: 870, s: 2.05, heads: 10, pose: ['strike', { aR: [130, 170], aL: [40, 100], lL: [-20, -26], lR: [26, 6] }], head: { eye: 'angry', mouth: 'open' }, ny: -220 }, 'He has never before had to ask.');
    P.mid(F('mandodari', { x: 520, y: 860, s: 1.2, pose: ['reach', { aR: [100, 90], aL: [80, 96] }], head: { mouth: 'smile', gear: 'tiara' }, args: [], cloth: { lc: C.pink, lpat: pat('rings', C.pink, C.gold, 0.7), pallu: C.rose, uc: C.gold } }));
    P.note(520, 580, 'Dhanyamalini', '“Come, play with me instead. Why trouble with one who does not want you?”');
    P.mid(g(R.item('grass'), 'translate(1040,860) scale(2.4)') + R.ring(1040, 810, 44, C.cream, 2));
    put(P, 'mid', 'sitaL', { x: 1250, y: 860, s: 1.4, face: -1, pose: ['sit', { aR: { t: [26, -40], bend: -1 }, aL: { t: [30, -30] }, both: 1, lean: 14, head: 10 }], head: { eye: 'closed' }, ny: -30 }, '“As a place where a brahmana has taught the Veda is not for a dog, I am not for you.”');
    put(P, 'mid', 'hanuman', { x: 1180, y: 350, s: 0.46, face: -1, pose: 'sit', hs: 1.3, head: { eye: 'angry' }, ny: 70 }, 'Watching from the branches, holding himself back.');
    P.fg(R.fronds(5, 'R', { n: 4, cols: [C.forest, C.navy] }));
    P.fx.tint = [C.pale, 0.3]; P.fire(124, 520, 50, 0.8).fire(316, 520, 50, 0.8).fire(508, 524, 50, 0.8).glow(300, 520, 300, C.saffron, 0.4);
  });

  R.add({ n: 82, slug: 'trijatas-dream', kanda: K, ref: 'Sundara 22–25', title: 'Trijata’s dream',
    text: 'When he has gone the guards close in: “Marry him, or we share you out for breakfast.” Sita looks for a rope, and thinks of her braid. Then old Trijata wakes. “Eat me instead. I have dreamed: Rama in white garlands on a chariot of ivory drawn by swans, Sita standing on a white hill in the sea. And Ravana, shaven, in red, drinking oil, riding a donkey south. Lanka fell into the ocean.”' }, (P) => {
    grove(P, { seed: 525, gy: 760, sky: { bands: 4, stars: 8 } });
    P.sky(path('M260,60 C120,60 80,240 220,300 C180,440 420,520 560,440 C700,540 980,540 1100,430 C1260,520 1500,440 1460,290 C1580,200 1480,40 1320,70 C1220,-20 960,-20 860,60 C720,-30 420,-30 260,60 Z', C.ice) + path('M280,90 C160,90 130,230 250,280 C220,400 420,470 550,400 C700,490 960,490 1090,390 C1240,470 1450,400 1420,280 C1520,200 1440,70 1310,100 C1210,20 970,20 870,90 C730,10 430,10 280,90 Z', C.pale));
    P.sky(R.elephant(470, 380, 0.8, { col: C.white, cloth: C.cream }) + F('ramaX', { x: 450, y: 196, s: 0.64, pose: 'sit', cloth: { lc: C.white, lpat: 0, sash: C.white, spatt: 0, garland: C.white }, head: { halo: 40, mouth: 'smile' } }) + F('lakshmanaX', { x: 380, y: 204, s: 0.56, pose: 'sit', cloth: { lc: C.white, lpat: 0, sash: C.white, spatt: 0 } }));
    P.sky(R.peak(800, 400, 220, 170, C.white, { c2: C.ice }) + F('sitaX', { x: 800, y: 236, s: 0.56, face: -1, pose: 'reach', cloth: { lc: C.white, lpat: 0, pallu: C.white, ppat: 0, pleatc: C.white }, head: { veil: C.white } }) + R.ring(800, 230, 110, C.gold, 3));
    P.sky(R.horse(1180, 400, 0.9, { long: 1, col: C.grey, mane: C.ink, cloth: false, rot: 16 }) + F('ravana', { x: 1150, y: 320, s: 0.62, rot: 16, pose: ['throne', { aR: [60, 150] }], cape: null, head: { hair: 'bald', gear: 0, must: 0, eye: 'fear' }, cloth: { upper: 0, lc: C.red, lpat: 0, sash: 0, garland: C.red }, hold: { R: { k: 'pot', col: C.umber } } }) + line('M1300,330 l70,90 M1370,420 l-6,-30 M1370,420 l-30,-6', C.crimson, 6));
    P.sky(g(R.lanka(0, 0, 1), 'translate(1260,470) rotate(18) scale(.2)') + R.band(470, 10, 120, C.azure, { x0: 1080, x1: 1440, h: 26 }));
    P.note(450, 90, 'Rama, in white', 'On an elephant like a hill, then in the Pushpaka, heading north.').note(800, 120, 'Sita on the white mountain', 'She rises and touches the sun and moon.').note(1200, 180, 'Ravana rides south', 'Shaven-headed, red-garlanded, laughing and weeping: the direction of Death.');
    put(P, 'mid', 'trijata', { x: 760, y: 870, s: 1.6, pose: ['point', { aR: [150, 150], aL: [-30, 40] }], head: { eye: 'wide', mouth: 'open' }, ny: -90 }, 'Vibhishana’s kin, old and kind. The others go quiet.');
    put(P, 'mid', 'sitaL', { x: 1150, y: 870, s: 1.34, face: -1, pose: ['sit', { head: -14 }], head: { eye: 'sad' } }, 'Her left eye throbs, her left arm; a bird calls sweetly from the branch. Good omens.');
    P.fg(R.crowd({ x0: 80, x1: 520, y: 950, n: 4, s: 1.04, kinds: ['rakshasi'], poses: ['recoil', 'kneelNamaste', 'sit'], face: 1, eye: 'fear', seed: 7 }) + F('rakshasi', { x: 1440, y: 950, s: 1.04, face: -1, pose: 'recoil', head: { eye: 'fear' }, args: [C.sGreen, C.plum] }));
    P.fx.tint = [C.pale, 0.2]; P.glow(800, 250, 420, C.pale, 0.3);
  });

  R.add({ n: 83, slug: 'the-ring-is-given', kanda: K, ref: 'Sundara 29–34', title: 'Hanuman gives her the ring',
    text: 'How to speak without frightening her? From the branch, softly, in human speech, he tells the story of Dasharatha’s son: the exile, the deer, the search. She looks up and sees a small monkey the colour of ashoka flowers, and fears another trick of Ravana’s. He comes down, palms joined, and describes Rama mark by mark. Then: “See, this ring bears his name.” She takes it, and it is as if she had her husband’s hand.' }, (P) => {
    grove(P, { seed: 534, gy: 750, sky: { bands: 5, moon: [260, 170, 56] } });
    P.bg(R.tree('banyan', 1250, 780, 2.5, { c: C.olive, c2: C.gold, tc: C.umber }) + R.burst(820, 560, 50, { seed: 3, col: C.gold, n: 30, len: 2.4, w: 4 }));
    P.bg(R.sil(F('rakshasi', { x: 200, y: 760, s: 0.9, rot: -90, pose: 'lie' }) + F('rakshasi', { x: 430, y: 750, s: 0.86, pose: 'sitGrief' }), C.navy, 0.75));
    P.note(300, 620, 'The guards doze', 'It is the dead hour before dawn.');
    put(P, 'mid', 'sitaL', { x: 1080, y: 900, s: 2.1, face: -1, pose: ['sit', { aR: { t: [92, -66] }, aL: { t: [96, -56] }, both: 1, lean: 8 }], head: { eye: 'soft', mouth: 'smile' }, ny: -80 }, 'Joy and grief at once: “He has not forgotten me. But why has he not come?”');
    P.mid(circ(820, 560, 70, C.gold, { opacity: 0.4 }) + R.ring(820, 560, 70, C.cream, 3) + g(R.item('ring'), 'translate(820,584) scale(3.6)'));
    P.note(820, 470, 'Rama’s ring', 'She presses it to her head, then to her heart.');
    put(P, 'mid', 'hanuman', { x: 560, y: 900, s: 1.6, pose: ['kneelOne', { aR: { t: [128, -64] }, aL: { t: [120, -52] }, both: 1, lean: 8 }], head: { eye: 'soft', mouth: 'smile' }, ny: -20 }, '“He does not sleep; if he sleeps he wakes saying ‘Sita’. He will come. I have seen the sea, and it can be crossed.”');
    P.fg(R.petals(6, [200, 100, 1500, 800], 30, [C.vermilion, C.saffron, C.white]) + R.fronds(7, 'L', { n: 3, cols: [C.forest, C.navy] }) + R.vine(1500, -20, 380, C.leaf, 3, C.vermilion) + R.vine(1400, -40, 260, C.leaf, 7, C.vermilion));
    P.fx.tint = [C.pale, 0.24]; P.glow(820, 560, 170, C.gold, 0.4).glow(260, 170, 140, C.cream, 0.4);
  });

  R.add({ n: 84, slug: 'the-crest-jewel', kanda: K, ref: 'Sundara 35–38', title: 'The crest-jewel',
    text: '“Climb on my back; I will carry you over the sea tonight.” She smiles at the little monkey, and he shows her his real size, a mountain with copper face and diamond teeth. Still she refuses: let Rama come, kill Ravana and take her back himself; that alone is worthy of him. She unties from her cloth the jewel she wore in her hair, and tells a secret only Rama knows: the crow at Chitrakuta, and the blade of grass.' }, (P) => {
    grove(P, { seed: 538, gy: 770, sky: { bands: 5, time: 'deep' } });
    P.sky(R.sil(g(F('hanuman', { pose: ['stand', { aR: [60, 150] }] }), 'translate(520,960) scale(3.4)'), C.saffron, 0.4));
    P.note(520, 60, 'His true size', 'Shown for a moment, to prove he could do it.');
    P.bg(circ(1330, 230, 170, C.peach) + R.ring(1330, 230, 170, C.gold, 6) + R.peak(1280, 400, 260, 150, C.green, { c2: C.lime }) + F('ramaX', { x: 1280, y: 330, s: 0.5, pose: ['throw', { lean: 0 }], hold: { R: { k: 'grass', s: 2 } } }) + g(R.crane(0, 0, 0.5, { col: C.ink, wing: 1, rot: -20 }), 'translate(1420,160)') + line('M1310,210 Q1370,170 1400,150', C.gold, 4, { 'stroke-dasharray': '4 8' }) + R.impact(1404, 150, 24, [C.gold, C.white], 2, 8));
    P.note(1330, 30, 'The crow at Chitrakuta', 'It clawed her; Rama charged a blade of grass with Brahma’s weapon and it chased the bird through three worlds.');
    put(P, 'mid', 'sitaL', { x: 1000, y: 880, s: 1.7, face: -1, pose: ['stand', { aR: { t: [100, -70] }, aL: [-12, 10] }], head: { eye: 'soft' }, ny: -110 }, '“Tell him: one month I can keep alive. Not more.”');
    P.mid(circ(790, 620, 60, C.aqua, { opacity: 0.4 }) + R.ring(790, 620, 60, C.white, 3) + g(R.item('jewel'), 'translate(790,636) scale(3)'));
    P.note(790, 540, 'Chudamani', 'A pearl from the sea, set in gold: her father’s wedding gift, worn in her hair.');
    put(P, 'mid', 'hanuman', { x: 600, y: 890, s: 1.5, pose: ['stand', { aR: { t: [112, -74] }, aL: { t: [104, -62] }, both: 1, lean: 10, head: 10 }], head: { eye: 'soft' }, ny: -70 }, 'He takes it, circles her with reverence, and decides not to leave quietly.');
    P.fg(R.fronds(4, 'R', { n: 4, cols: [C.forest, C.navy] }) + R.petals(5, [300, 400, 1300, 860], 16, [C.vermilion, C.white]));
    P.fx.tint = [C.pale, 0.22]; P.glow(790, 620, 190, C.aqua, 0.55);
  });

  R.add({ n: 85, slug: 'the-grove-destroyed', kanda: K, ref: 'Sundara 39–45', title: 'The grove destroyed',
    text: 'Conciliation, gifts and division are no use with rakshasas; that leaves force, and a look at their strength. He tears up the pleasure-grove, tree by tree, sparing only Sita’s, and takes his stand on the gateway with an iron bar. “Victory to Rama! I am Hanuman, servant of the king of Kosala.” Eighty thousand guards, Jambumali, seven ministers’ sons, five generals. Then Ravana sends his own boy, Aksha, in a chariot with eight horses.' }, (P) => {
    R.sky(P, { time: 'dawn', seed: 541, bands: 7, motes: 0, sun: [250, 200, 60, C.white, 2.6] });
    P.sky(R.speed(800, 300, { seed: 4, n: 50, col: C.white, r0: 330, w: 8 }));
    P.bg(R.ground(770, C.moss, { stripes: 3, tufts: 10, c2: C.forest, c3: C.olive }));
    const f = R.rng(9); let wreck = '';
    for (let i = 0; i < 8; i++) wreck += R.tree(f.pick(['ashoka', 'bloom', 'tier']), f.r(60, 1540), f.r(780, 880), f.r(0.6, 0.9), { rot: f.pick([80, -80, 100, -96, 70]), c: f.pick([C.forest, C.green]) });
    P.bg(wreck + R.tree('banyan', 150, 780, 1.3, { c: C.olive, c2: C.gold }));
    P.note(150, 480, 'One tree left standing', 'The shimshapa, with Sita under it.');
    P.bg(rect(620, 400, 80, 380, pat('brick', C.amber, C.gold, 1.2), { stroke: C.ochre, 'stroke-width': 2 }) + rect(900, 400, 80, 380, pat('brick', C.amber, C.gold, 1.2), { stroke: C.ochre, 'stroke-width': 2 }) + rect(580, 350, 440, 60, pat('zig', C.gold, C.crimson, 1.6), { stroke: C.ochre, 'stroke-width': 2 }) + path(R.archD(700, 780, 200, 300, 7), C.maroon) + R.dome(640, 350, 0.6) + R.dome(960, 350, 0.6));
    put(P, 'mid', 'hanuman', { x: 800, y: 352, s: 1.5, pose: ['strike', { aR: [150, 200], aL: [-60, -20], lL: [-30, -20], lR: [34, 10] }], tail: TAIL, head: { eye: 'angry', mouth: 'open' }, hold: { R: { k: 'staff', along: 1, s: 1.5 } }, ny: 30 }, 'On the arch of the gate, an iron bar in his fist, shouting his name and his master’s.');
    P.mid(g(R.chariot(0, 0, 1, { gallop: 1, team: 3, col: C.gold, flag: C.crimson, riders: F('indrajit', { x: 0, y: -78, s: 0.66, pose: 'archer', hold: { R: { k: 'bow', len: 70 } }, head: { gem: C.red, must: 0 }, hs: 1.1 }) }), 'translate(1420,640) rotate(-14) scale(-1,1)'));
    P.note(1400, 360, 'Aksha', 'Ravana’s young son, brave enough that Hanuman is sorry to kill him.');
    P.mid(R.arrows(5, 1240, 500, 960, 360, 6, { s: 0.7, len: 90, spread: 60 }));
    P.fg(R.crowd({ x0: 80, x1: 1500, y: 930, n: 9, s: 0.84, kinds: ['rakshasa'], pose: (i, ff) => ff.pick(['fall', 'recoil', 'fall', 'run']), each: (i, ff) => ({ rot: ff.r(-100, 100), y: 880 + ff.r(-40, 30), hold: ff() < 0.4 ? { R: 'spear' } : {} }), seed: 43 }));
    P.rays(250, 200, 0.5, C.cream);
  });

  R.add({ n: 86, slug: 'before-ravana', kanda: K, ref: 'Sundara 46–50', title: 'The envoy in ropes',
    text: 'Indrajit binds him with Brahma’s weapon; Hanuman, who has that god’s promise it will hold him only a moment, lets himself be led, to see Ravana and speak. And seeing him he thinks: what form, what steadiness, what splendour. Were it not for his adharma he could be guardian of heaven. He delivers Rama’s message. Ravana orders him killed. Vibhishana stands: “An envoy is never put to death.”' }, (P) => {
    S.court(P, { inner: 'fire', arches: [[1130, 900, 640, 11], [250, 300, 440, 7]], wall: C.maroon, wall2: C.crimson, wpat: 'scale', border: C.gold, trim: C.red, fcol: C.gold, fcol2: C.red, floor: C.amber, floor2: C.gold, carpet: C.crimson, cx: 1130, cw: 600, seed: 546, top: 70 });
    P.bg(R.pillar(700, 760, 620, 54, C.gold, C.red) + R.pillar(1540, 760, 620, 54, C.gold, C.red) + R.throne(1130, 770, 1.7, { col: C.maroon }) + R.steps(1130, 770, 460, 4, C.gold, C.red));
    put(P, 'mid', 'ravana', { x: 1130, y: 780, s: 1.44, front: 1, heads: 10, arms: 9, armItems: false, hs: 1.3, pose: ['throne', { aR: [80, 100], aL: [-50, -110], lL: [-64, 8], lR: [64, -8] }], head: { eye: 'angry', mouth: 'open' }, headMoods: [{ skin: C.sGreen, mouth: 'fang' }, { skin: C.sPurple }, { skin: C.sRed, mouth: 'fang' }, { skin: C.slate }, { skin: C.olive }, { skin: C.sPurple, mouth: 'fang' }, { skin: C.sRed }, { skin: C.sGreen }, { skin: C.slate, mouth: 'fang' }], cape: null, ny: -180 }, '“Who are you? Whose? Why have you come?”');
    put(P, 'mid', 'hanuman', { x: 480, y: 870, s: 1.8, pose: ['stand', { aR: [8, 6], aL: [-8, -6] }], tail: TAIL, head: { eye: 'open', mouth: 'neutral' }, ny: -130 }, '“Give Sita back. You have studied dharma; you know how this ends.”');
    P.mid([0, 1, 2, 3].map((i) => line(`M410,${500 + i * 44} Q480,${520 + i * 44} 552,${500 + i * 44}`, C.sand, 9) + line(`M410,${500 + i * 44} Q480,${520 + i * 44} 552,${500 + i * 44}`, C.umber, 2, { 'stroke-dasharray': '4 6' })).join('') + line('M552,560 Q640,600 700,680', C.sand, 7));
    put(P, 'mid', 'indrajit', { x: 250, y: 870, s: 1.3, pose: ['stand', { aR: [40, 110] }], hold: { L: { k: 'bow', len: 96, rot: -8 } } }, 'His brahmastra fell away the moment the rakshasas added common rope.');
    put(P, 'mid', 'vibhishana', { x: 820, y: 880, s: 1.36, pose: ['plead', { aR: [110, 150] }], head: { eye: 'sad' } }, 'Ravana’s youngest brother, the one voice for law in that court.');
    P.fg(R.crowd({ x0: 60, x1: 380, y: 1000, n: 3, s: 0.9, kinds: ['rakshasa'], poses: ['stand', 'strike'], face: 1, seed: 8 }));
    P.glow(1130, 360, 300, C.gold, 0.35);
  });

  R.add({ n: 87, slug: 'lanka-burns', kanda: K, ref: 'Sundara 51–53', title: 'Lanka burns',
    text: '“Monkeys prize their tails. Burn it and send him home.” They wrap it in oiled rags and parade him through the streets, which suits him: he studies the fortifications. Sita, told of it, prays to the fire: “If I have been faithful, be cool to Hanuman.” The flame burns cold on him. He slips his ropes, leaps to a rooftop, and goes house to house with his tail alight, sparing only Vibhishana’s.' }, (P) => {
    R.sky(P, { time: 'fire', seed: 551, bands: 8, motes: 0 });
    P.sky(R.smoke(300, 300, 2.6, C.maroon, 3, 4) + R.smoke(900, 260, 3, C.ink, 5, 4) + R.smoke(1400, 320, 2.4, C.maroon, 8, 4));
    P.bg(R.city(52, -60, W + 60, 760, { n: 11, s: 1.3, walls: [C.gold, C.mustard, C.amber], trims: [C.crimson, C.maroon], roofs: [C.gold], win: C.vermilion }));
    const f = R.rng(4); let fl = ''; for (let i = 0; i < 12; i++) fl += R.flame(60 + i * 136 + f.r(-30, 30), f.r(380, 700), f.r(0.9, 1.7), i + 2);
    P.bg(fl);
    const arc = [[160, 520], [330, 300], [560, 240], [800, 330], [980, 300], [1140, 240]];
    P.mid(line(R.smooth(arc), C.crimson, 46, { opacity: 0.8 }) + line(R.smooth(arc), C.saffron, 30) + line(R.smooth(arc), C.gold, 16) + line(R.smooth(arc), C.white, 5) + R.flame(1140, 250, 0.9, 9));
    put(P, 'mid', 'hanuman', { x: 1280, y: 520, s: 1.6, rot: 30, pose: ['leap', { aR: [140, 170], aL: [-80, -30] }], tail: [[-12, -4], [-60, -30], [-110, -90], [-120, -170], [-90, -200]], head: { eye: 'angry', mouth: 'open' }, ny: -100 }, 'The fire does not hurt him. Afterwards he is sick with fear that he may have burnt Sita too.');
    P.note(560, 170, 'The tail', 'Wrapped in cloth, soaked in oil, and now a torch as long as a street.');
    P.bg(R.palace(1420, 780, 220, 260, { tiers: 2, domes: 1, wall: C.pale, trim: C.teal, roof: C.aqua, win: C.navy }));
    P.note(1420, 480, 'Vibhishana’s house', 'The one roof he leaves alone.');
    P.fg(R.crowd({ x0: 60, x1: 1500, y: 960, n: 10, s: 0.8, kinds: ['rakshasa', 'rakshasi', 'rakshasa'], poses: ['run', 'recoil', 'armsUp'], face: (x) => (x < 700 ? -1 : 1), eye: 'fear', seed: 53 }) + R.flame(200, 930, 1.4, 3) + R.flame(1200, 940, 1.2, 6));
    P.fx.motes = 2; P.fire(300, 520, 260, 1).fire(900, 520, 280, 1).fire(1400, 600, 200, 0.8).fire(1140, 240, 120, 1).glow(800, 500, 500, C.vermilion, 0.3);
  });

  R.add({ n: 88, slug: 'seen-is-sita', kanda: K, ref: 'Sundara 62–64 · Yuddha 1', title: '“Seen: Sita”',
    text: 'The southern party comes home roaring, and wrecks Sugriva’s honey-grove on the way for sheer joy. Hanuman bows to Rama and says the important word first: “Seen. I have seen the lady.” He lays the jewel in his hand. Rama holds it against his chest and weeps. “This was her father’s gift at our wedding. I have nothing to give that matches what you have done. Take this: all I have.” And he embraces him.' }, (P) => {
    R.sky(P, { time: 'day', seed: 562, bands: 5, motes: 16 });
    P.sky(R.burst(760, 420, 240, { seed: 3, col: C.cream, n: 70, len: 2.6, w: 9 }) + circ(760, 420, 226, C.white));
    P.bg(R.peak(300, 800, 900, 480, C.teal, { c2: C.sea, step: 0.13 }) + R.peak(1300, 800, 900, 420, C.green, { c2: C.lime }) + R.grove(4, -60, W + 60, 760, 7, { kinds: ['bloom', 'tier', 'round'], s0: 0.7, s1: 1 }) + R.ground(750, C.lime, { stripes: 2, tufts: 14, flowers: 14, c2: C.leaf, c3: C.straw }));
    put(P, 'mid', 'ramaX', { x: 660, y: 890, s: 2.1, pose: ['hug', { aR: [84, 30], aL: [70, 100] }], head: { eye: 'closed', mouth: 'smile' }, ny: -150 }, 'A king with no kingdom gives the only thing he owns.');
    put(P, 'mid', 'hanuman', { x: 900, y: 890, s: 1.84, face: -1, pose: ['hug', { aR: [80, 30], aL: [64, 100], head: 8 }], head: { eye: 'closed', mouth: 'smile' }, ny: -110 }, 'He did what he was sent to do, and more than he was sent to do.');
    P.mid(circ(770, 560, 40, C.aqua, { opacity: 0.5 }) + g(R.item('jewel'), 'translate(770,572) scale(2.2)'));
    P.note(770, 500, 'The crest-jewel');
    put(P, 'mid', 'lakshmanaX', { x: 330, y: 880, s: 1.5, pose: 'namaste', head: { mouth: 'smile' } });
    put(P, 'mid', 'sugriva', { x: 1240, y: 880, s: 1.44, face: -1, pose: 'cheer', head: { mouth: 'smile' } });
    put(P, 'mid', 'angada', { x: 1420, y: 884, s: 1.2, face: -1, pose: 'armsUp' });
    P.fg(R.crowd({ x0: 40, x1: 1560, y: 1040, n: 12, s: 0.84, kinds: ['vanara'], poses: ['cheer', 'armsUp', 'dance'], seed: 62 }) + R.petals(5, [100, 60, 1500, 600], 30));
    P.glow(760, 440, 300, C.cream, 0.4).rays(760, 420, 0.55, C.cream);
  });
})();
