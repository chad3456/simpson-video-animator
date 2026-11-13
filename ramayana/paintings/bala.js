/* Bala Kanda: paintings 1-18 */
(function () {
  const R = window.R, C = R.C, W = R.W, H = R.H, F = R.F, put = R.put, pat = R.pat, S = R.S;
  const { path, line, circ, ell, g, rect } = R;
  const K = 'Bala Kanda';
  const lerp = (pts, t) => { const L = pts.length - 1, i = Math.min(L - 1, Math.floor(t * L)), u = t * L - i; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]; };

  R.add({ n: 1, slug: 'the-first-verse', kanda: K, ref: 'Bala 2', title: 'Grief becomes a verse',
    text: 'On the bank of the Tamasa a Nishada hunter shoots the male of a pair of krouncha birds at their loving. Valmiki hears the hen cry and a curse leaves his lips in four even feet of eight syllables. “What is this that I have uttered?” Out of shoka, sorrow, the shloka is born, and Brahma bids him tell Rama’s story in it.' }, (P) => {
    S.forest(P, { time: 'dawn', seed: 11, gy: 640, far: 8, kinds: ['round', 'tier', 'sal', 'bloom'], flowers: 16, sky: { sun: [1230, 190, 64, C.cream, 2.6] } });
    R.water(P, 'bg', 770, H, { seed: 4, bands: 4, curls: 9 });
    P.bg(R.tree('banyan', 800, 668, 1.3, { c: C.forest }));
    const rib = [[1205, 470], [1120, 380], [1010, 330], [880, 250], [720, 200], [560, 216], [420, 150], [250, 120], [90, 150]];
    P.bg(line(R.smooth(rib), C.cream, 34, { opacity: 0.92 }) + line(R.smooth(rib), C.gold, 40, { opacity: 0.35 }));
    let marks = ''; for (let i = 0; i < 32; i++) { const p = lerp(rib, 0.04 + (i + Math.floor(i / 8) * 0.9) / 36); marks += i % 2 ? circ(p[0], p[1], 6, C.vermilion) : rect(p[0] - 3, p[1] - 10, 6, 20, C.navy, { rx: 3 }); }
    P.bg(marks);
    P.mid(R.crane(905, 322, 1.25, { wing: 1, rot: -24 }));
    P.mid(R.crane(742, 560, 1.2, { wing: 1, rot: 148 }) + g(R.item('arrow', { len: 110 }), 'translate(735,505) rotate(-118)') + circ(742, 520, 9, C.red) + circ(760, 548, 5, C.red) + circ(724, 570, 4, C.red));
    P.note(905, 190, 'The krouncha hen', 'She circles and cries for her mate.').note(742, 610, 'Her mate', 'Struck down while the pair were at play.');
    put(P, 'mid', 'hunter', { x: 236, y: 716, s: 1.08, pose: ['archer', { draw: 0, aL: [-60, 20] }], hold: { R: { k: 'bow', rot: -14 } } }, '“Since you killed one of a loving pair, you will find no rest for long years.”');
    put(P, 'mid', 'valmiki', { x: 1270, y: 752, s: 1.26, face: -1, pose: 'bless', head: { eye: 'sad', mouth: 'open' } }, 'Compassion and anger rise in him together, and come out as metre.');
    P.mid(F('sageBald', { x: 1432, y: 756, s: 1.02, face: -1, pose: ['stand', { aR: [26, 64] }], hold: { R: 'pot' } }));
    P.note(1432, 500, 'Bharadvaja', 'The disciple carries the water pot and learns the verse by heart.');
    P.fg(R.tree('reed', 60, 900, 1.5) + R.tree('reed', 1540, 905, 1.4) + R.lotusPad(520, 850, 1.2) + R.lotusPad(1060, 866, 1));
    P.rays(1230, 190, 0.6, C.straw);
  });

  R.add({ n: 2, slug: 'the-man-of-all-virtues', kanda: K, ref: 'Bala 1', title: 'Is there a man of all virtues?',
    text: 'Valmiki asks Narada who in this world is truthful, grateful, firm in his vows, master of his anger and yet terrible in battle. Narada answers with one name from the line of Ikshvaku: Rama, deep as the ocean, steady as the Himalaya, in valour like Vishnu and in forgiveness like the earth.' }, (P) => {
    R.sky(P, { time: 'night', seed: 12, bands: 7, motes: 34, mcols: [C.gold, C.cream, C.white], h: 760 });
    P.sky(R.colossus(800, 620, 1.06, { col: C.mustard, col2: C.amber }));
    P.sky(R.burst(800, 420, 118, { seed: 4, len: 3.3, n: 60 }));
    P.bg(R.motes(9, [300, 120, 1300, 640], 36, [C.white], { kind: 'ring', min: 10, max: 34, w: 4 }));
    P.bg(R.ground(790, C.crimson, { stripes: 2, tufts: 0, amp: 4, c2: C.maroon, c3: C.red }) + R.carpet(800, 790, 420, 130, C.vermilion, C.gold));
    put(P, 'mid', 'rama', { x: 800, y: 800, s: 1.3, front: 1, pose: ['bless', { aL: [-14, -2] }], head: { halo: 66, mouth: 'smile' }, hold: { L: { k: 'bow', rot: 8, len: 105 } }, ny: -50 }, 'Truthful, grateful, steady in every vow: the answer to Valmiki’s question.');
    put(P, 'mid', 'narada', { x: 300, y: 812, s: 1.14, pose: ['point', { aR: [118, 128], aL: [-20, 30] }], hold: { L: { k: 'veena', rot: -30 } } }, 'The wandering sage who knows the three worlds names Rama.');
    put(P, 'mid', 'valmiki', { x: 1290, y: 822, s: 1.14, face: -1, pose: 'sitNamaste' }, 'The poet, foremost among sages, listens.');
    P.fg(R.crowd({ x0: 80, x1: 560, y: 930, n: 5, s: 0.74, kinds: ['sage', 'sageBald', 'man', 'woman'], poses: ['bow'], eye: 'closed', face: 1, seed: 5 }) + R.crowd({ x0: 1040, x1: 1520, y: 930, n: 5, s: 0.74, kinds: ['sage', 'man', 'woman', 'sageBald'], poses: ['bow'], eye: 'closed', face: -1, seed: 6 }));
    P.glow(800, 420, 250, C.cream, 0.45).rays(800, 420, 0.85, C.straw);
  });

  R.add({ n: 3, slug: 'ayodhya-on-the-sarayu', kanda: K, ref: 'Bala 5–6', title: 'Ayodhya on the Sarayu',
    text: 'In the land of Kosala, on the bank of the Sarayu, stands the city Manu himself built: twelve yojanas long, its royal road sprinkled with water and strewn with flowers, ringed by a deep moat, crowded with elephants, horses and seven-storeyed mansions. Here Dasharatha rules as Indra rules Amaravati.' }, (P) => {
    R.sky(P, { time: 'gold', seed: 8, bands: 5, sun: [1330, 150, 62, C.white, 2.8], h: 420 });
    P.sky(R.city(31, -40, W + 40, 520, { n: 12, s: 0.95 }));
    P.bg(R.city(47, -60, W + 60, 610, { n: 8, s: 1.2 }) + R.palace(800, 610, 440, 430, { tiers: 3, domes: 3, wall: C.cream, trim: C.red, roof: C.gold, ds: 1, aw: 70 }));
    let wall = rect(-80, 578, W + 160, 86, pat('brick', C.rose, C.cream, 1.3)) + rect(-80, 570, W + 160, 12, C.red);
    for (let x = -60; x < W + 60; x += 58) wall += rect(x, 548, 34, 24, C.rose) + (x % 3 === 0 ? g(R.item('flag', { col: [C.red, C.saffron, C.azure][Math.abs(x) % 3] }), `translate(${x + 17},520) scale(.42)`) : '');
    P.bg(wall + R.gate(800, 664, 0.46, { col: C.clay, dark: C.navy }));
    R.water(P, 'bg', 664, H, { seed: 6, bands: 7, curls: 16 });
    const boat = (x, y, s, sd, fl = 1) => R.boat(x, y, s, { flip: fl, riders: R.crowd({ x0: -120, x1: 120, y: -40, n: 4, s: 0.5, seed: sd, poses: ['stand', 'namaste', 'point'], face: 1 }) });
    P.mid(boat(430, 800, 0.8, 3) + boat(1190, 760, 0.62, 9, -1) + R.swan(760, 842, 0.9) + R.swan(850, 872, 0.75) + R.lotusPad(240, 872, 1.1) + R.lotusPad(1420, 868, 1.2) + R.lotusPad(980, 706, 0.6));
    P.mid(R.elephant(1010, 664, 0.42, { howdah: 1 }) + R.horse(560, 664, 0.42, { col: C.cream }) + R.horse(640, 664, 0.4, { col: C.tan }));
    P.note(800, 150, 'The palace of Dasharatha').note(800, 560, 'The gate and the moat').note(420, 690, 'The Sarayu');
    P.fg(R.tree('palm', 40, 930, 1.5) + R.tree('palm', 1560, 940, 1.6, { flip: -1 }) + R.parrots(4, [200, 60, 1400, 260], 9));
    P.rays(1330, 150, 0.5, C.cream);
  });

  R.add({ n: 4, slug: 'the-gods-ask-vishnu', kanda: K, ref: 'Bala 14–15', title: 'The gods ask Vishnu to be born a man',
    text: 'Ravana has Brahma’s boon that no god, gandharva, yaksha or rakshasa can kill him. In his contempt he never asked for safety from men. So the gods gather at Dasharatha’s sacrifice and beg Vishnu, who arrives on Garuda with conch, discus and mace, to divide himself in four and take birth as the king’s sons.' }, (P) => {
    R.sky(P, { time: 'deep', seed: 22, bands: 6, stars: 26, motes: 14 });
    P.sky(R.burst(800, 330, 150, { seed: 5, col: C.gold, len: 3.4, n: 54 }) + circ(800, 330, 132, C.straw));
    P.bg(R.cloud(260, 250, 1.3, C.indigo, C.blue) + R.cloud(1380, 210, 1.5, C.indigo, C.blue));
    P.mid(R.bird(800, 430, 1.22, { col: C.vermilion, col2: C.gold, col3: C.cream, crown: 1, wings: [-74, 58], head: C.cream }));
    P.mid(R.chakra(1010, 190, 34) + g(R.item('conch'), 'translate(596,196) scale(2)') + g(R.item('gada'), 'translate(1010,400) rotate(160) scale(.8)') + g(R.item('lotus'), 'translate(600,400) rotate(-30) scale(1.2)'));
    put(P, 'mid', 'rama', { x: 792, y: 400, s: 1.04, front: 1, label: 'Vishnu', pose: ['sitBless', { aL: [-30, -100] }], arms: 1, armItems: false, head: { halo: 64, mouth: 'smile' }, cloth: { lc: C.mustard, garland: C.vermilion }, ny: 30 }, 'He promises to live on earth for eleven thousand years.');
    P.note(990, 470, 'Garuda');
    P.bg(R.cloud(300, 800, 2.2, C.pale, C.sky) + R.cloud(1300, 810, 2.3, C.pale, C.sky) + R.cloud(800, 860, 2.6, C.ice, C.pale));
    put(P, 'mid', 'brahma', { x: 360, y: 790, s: 1.08, pose: 'plead' }, 'The grandfather, whose boon made Ravana unassailable.');
    put(P, 'mid', 'indra', { x: 520, y: 800, s: 1.02, pose: 'namaste' });
    put(P, 'mid', 'agni', { x: 1130, y: 800, s: 1.02, face: -1, pose: 'namaste' });
    P.mid(F('sage', { x: 1270, y: 800, s: 0.98, face: -1, pose: 'plead' }) + F('narada', { x: 240, y: 800, s: 0.96, pose: 'namaste' }) + F('shiva', { x: 1400, y: 800, s: 1, face: -1, pose: 'namaste' }));
    P.mid(circ(800, 760, 88, C.maroon) + R.ring(800, 760, 88, C.vermilion, 6) + g(F('ravana', { front: 1, heads: 10, pose: 'armsUp', hs: 0.8, cape: null }), 'translate(800,838) scale(.42)'));
    P.note(800, 650, 'Ravana, the affliction of the worlds', 'Safe from every being he thought worth fearing.');
    P.fg(R.cloud(120, 900, 2, C.white) + R.cloud(1500, 900, 2, C.white));
    P.glow(800, 330, 260, C.gold, 0.5).rays(800, 330, 0.7, C.straw);
  });

  R.add({ n: 5, slug: 'the-vessel-from-the-fire', kanda: K, ref: 'Bala 15', title: 'The vessel from the fire',
    text: 'Rishyashringa pours the oblation for sons, and out of the sacrificial fire rises a being of blazing radiance, dark, robed in red, with a lion’s mane, holding in both arms a golden vessel with a silver lid. “This payasam was made by the gods. Give it to your wives.” Dasharatha takes it like a poor man finding treasure, and shares it among Kousalya, Sumitra and Kaikeyi.' }, (P) => {
    R.sky(P, { time: 'dusk', seed: 15, bands: 6, motes: 16 });
    let tent = ''; [140, 480, 1120, 1460].forEach((x) => (tent += R.pillar(x, 760, 620, 34, C.vermilion, C.gold)));
    P.bg(tent + R.drape(-40, W + 40, 120, C.crimson, C.gold, 6, 60) + rect(-80, 60, W + 160, 66, pat('zig', C.mustard, C.red, 1.6)));
    P.bg(R.ground(760, C.ochre, { stripes: 3, tufts: 0, c2: C.clay, c3: C.straw }));
    P.mid(R.fig({ x: 800, y: 800, s: 2.05, front: 1, skin: C.sDark, neck: 3, pose: { aL: { t: [-14, -40], bend: -1 }, aR: { t: [14, -40] }, lL: [-5, -3], lR: [5, 3] }, hold: { R: { k: 'bowl', s: 1.5 } }, head: { haircol: C.vermilion, must: 1, mustcol: C.vermilion, eye: 'wide', gear: 'crown', sclera: C.straw, lip: C.red }, cloth: { lc: C.red, lpat: pat('swirl', C.red, C.vermilion), sash: C.vermilion, belt: C.gold } }));
    P.note(800, 150, 'The being sent by Prajapati', 'Tall as a mountain peak, bright as the sun, with the gods’ own food in his arms.');
    P.mid(R.altar(800, 846, 2.5, 8));
    put(P, 'mid', 'dasharatha', { x: 400, y: 800, s: 1.12, pose: ['kneelOne', { aR: [80, 70], aL: [64, 76], both: 1 }], head: { eye: 'wide' } }, 'Childless and ageing, he circles the being and takes the vessel on his head.');
    P.mid(F('sage', { x: 1180, y: 810, s: 1.08, face: -1, pose: 'sitBless', head: { haircol: C.brown, beard: 'short' } }));
    P.note(1180, 560, 'Rishyashringa', 'The deer-born sage who conducts the rite for sons.');
    put(P, 'mid', 'vasishtha', { x: 1330, y: 810, s: 1, face: -1, pose: 'sitNamaste' });
    put(P, 'mid', 'kausalya', { x: 244, y: 790, s: 0.94, pose: 'namaste' }, 'She receives half.');
    put(P, 'mid', 'sumitra', { x: 150, y: 796, s: 0.92, pose: 'namaste' }, 'She receives two portions, and bears twins.');
    put(P, 'mid', 'kaikeyi', { x: 60, y: 800, s: 0.92, pose: 'namaste' });
    P.fg(R.smoke(520, 300, 1.5, C.ash, 4, 4) + R.smoke(1060, 260, 1.3, C.ash, 9, 4));
    P.fire(800, 700, 240, 1).glow(800, 430, 320, C.saffron, 0.4);
  });

  R.add({ n: 6, slug: 'four-sons', kanda: K, ref: 'Bala 17', title: 'Four sons are born',
    text: 'In the twelfth month, in Chaitra, on the ninth lunar day, with five planets exalted, Kousalya bears Rama. Kaikeyi bears Bharata; Sumitra bears Lakshmana and Shatrughna. Gandharvas sing, apsaras dance, flowers fall from the sky, and Ayodhya’s streets fill with dancers and musicians.' }, (P) => {
    R.sky(P, { time: 'night', seed: 14, bands: 5, stars: 18, motes: 10, h: 420 });
    [[300, 150], [520, 230], [800, 120], [1080, 230], [1300, 150]].forEach((p, i) => P.sky(R.burst(p[0], p[1], 20, { seed: i + 2, col: C.gold, n: 14, len: 2.6, w: 3 }) + R.ring(p[0], p[1], 38, C.cream, 2.5)));
    P.bg(rect(-80, 280, W + 160, 56, pat('zig', C.mustard, C.red, 1.6)) + R.drape(-40, W + 40, 336, C.red, C.gold, 8, 44) + R.pillar(70, 760, 440, 40, C.teal) + R.pillar(1530, 760, 440, 40, C.teal));
    P.bg(R.ground(752, C.rose, { stripes: 2, tufts: 0, c2: C.pink, c3: C.cream }) + R.carpet(800, 756, 1500, 150, C.magenta, C.gold, 0.94));
    const cradle = (x, sk, name, note) => { P.mid(line(`M${x - 62},336 L${x - 56},560 M${x + 62},336 L${x + 56},560`, C.gold, 4) + path(`M${x - 74},556 Q${x},660 ${x + 74},556 Z`, pat('flower', C.gold, C.red, 0.9), { stroke: C.amber, 'stroke-width': 2 }) + rect(x - 80, 548, 160, 14, C.red, { rx: 6 }) + R.baby(x - 8, 560, 1.5, sk) + circ(x, 640, 8, C.red)); P.note(x, 520, name, note || ''); };
    cradle(330, C.sBlue, 'Rama', 'Kousalya’s son, born under Punarvasu: half of Vishnu.'); cradle(650, C.sBlue, 'Bharata', 'Kaikeyi’s son, born under Pushya.'); cradle(960, C.sWheat, 'Lakshmana', 'Sumitra’s elder twin.'); cradle(1260, C.sWheat, 'Shatrughna', 'Sumitra’s younger twin.');
    put(P, 'mid', 'kausalya', { x: 190, y: 770, s: 1.06, pose: ['reach', { lean: 6 }], head: { mouth: 'smile', eye: 'soft' } });
    put(P, 'mid', 'kaikeyi', { x: 500, y: 772, s: 1.04, pose: ['reach', { lean: 6 }], head: { mouth: 'smile' } });
    put(P, 'mid', 'sumitra', { x: 1110, y: 772, s: 1.04, pose: 'cheer', head: { mouth: 'smile' } });
    put(P, 'mid', 'dasharatha', { x: 1440, y: 776, s: 1.06, face: -1, pose: 'armsUp', head: { mouth: 'smile' } }, 'He gives away cattle and gold without counting.');
    P.fg(R.crowd({ x0: 80, x1: 1520, y: 1010, n: 12, s: 0.9, kinds: ['girl', 'woman', 'man', 'girl'], poses: ['dance', 'cheer', 'armsUp'], seed: 31, jy: 14 }));
    P.fg(R.petals(6, [60, 60, 1540, 700], 44) + R.streamers(3, [60, 340, 1540, 760], 26, [C.cream, C.straw]));
    P.glow(330, 560, 150, C.cream, 0.5);
  });

  R.add({ n: 7, slug: 'vishvamitra-asks-for-rama', kanda: K, ref: 'Bala 17–20', title: 'Vishvamitra asks for Rama',
    text: '“Give me Rama for ten nights. Maricha and Subahu foul my altar with flesh and blood.” Dasharatha, who has sworn to grant whatever the sage asks, turns faint: “My lotus-eyed Rama is not yet sixteen. Take me and my army instead.” Vishvamitra’s anger shakes the earth until Vasishtha persuades the king to keep his word.' }, (P) => {
    S.court(P, { inner: 'gold', arches: [[1060, 520, 560, 9], [330, 380, 470, 7]], wall: C.teal, wall2: C.sea, border: C.vermilion, fcol: C.cream, fcol2: C.vermilion, floor: C.rose, carpet: C.crimson, cx: 760, cw: 1100, lamps: [680, 1420], seed: 6 });
    P.bg(R.throne(1060, 742, 1.12, { col: C.navy }) + R.steps(1060, 742, 300, 3, C.cream, C.red));
    put(P, 'mid', 'dasharatha', { x: 1046, y: 700, s: 1.12, face: -1, pose: ['throne', { aR: [70, 150], aL: [40, 120], both: 1, lean: -10, head: -8 }], head: { eye: 'fear', mouth: 'open' } }, 'Bound by his promise, and sick with fear for his son.');
    put(P, 'mid', 'vishvamitra', { x: 380, y: 800, s: 1.42, pose: 'point', hold: { L: { k: 'staff' } }, head: { eye: 'angry' } }, 'Once a king himself, now a brahmarshi; he could curse the demons but will not spend his austerities in anger.');
    put(P, 'mid', 'vasishtha', { x: 1290, y: 790, s: 1.08, face: -1, pose: 'bless' }, '“You are Dharma in a body. Do not break your word.”');
    put(P, 'mid', 'rama', { x: 640, y: 800, s: 0.9, hs: 1.12, pose: 'namaste', head: { halo: 0 }, hold: {} }, 'Not yet sixteen.');
    put(P, 'mid', 'lakshmana', { x: 740, y: 804, s: 0.86, hs: 1.12, pose: 'stand', hold: { R: { k: 'bow', len: 70, rot: 10 } } });
    P.fg(R.crowd({ x0: 100, x1: 1500, y: 1000, n: 10, s: 0.86, kinds: ['man', 'soldier', 'man', 'guard'], poses: ['namaste', 'stand', 'recoil'], seed: 12, cx: 800 }));
    P.glow(1060, 420, 250, C.straw, 0.35);
  });

  R.add({ n: 8, slug: 'bala-and-atibala', kanda: K, ref: 'Bala 21', title: 'Bala and Atibala, by the Sarayu',
    text: 'The two princes follow the sage, bows in hand, quivers on their backs, like two three-headed serpents. Half a yojana along the southern bank of the Sarayu, Vishvamitra says, “Rama, touch water,” and gives him the spells Bala and Atibala, so that neither hunger, thirst nor fatigue will touch him. They sleep that night on a bed of grass.' }, (P) => {
    R.sky(P, { time: 'paper', seed: 9, bands: 4, motes: 14, disc: [1340, 150, 60, C.vermilion, C.saffron] });
    R.water(P, 'bg', 300, H, { seed: 12, amp: 54, wl: 900, bands: 11, curls: 22, ticks: 40, col: C.azure, c2: C.pale, c3: C.blue });
    const road = [[-80, 800], [200, 720], [460, 742], [700, 660], [960, 640], [1230, 560], [1420, 470], [1700, 430]];
    P.bg(line(R.smooth(road), C.navy, 176, { 'stroke-linecap': 'butt', transform: 'translate(0,16)' }) + line(R.smooth(road), pat('dots', C.paper, C.sand, 1.4), 156, { 'stroke-linecap': 'butt' }));
    P.bg(R.grove(5, 980, 1640, 470, 6, { kinds: ['tier', 'cypress', 'round'], s0: 0.6, s1: 0.9 }) + R.grove(8, -40, 420, 700, 4, { kinds: ['round', 'tier'], s0: 0.7, s1: 1 }));
    P.bg(R.fish(420, 500, 0.9, C.orange, C.gold, -12) + R.fish(1040, 800, 1.1, C.leaf, C.lime, 14, -1) + R.fish(760, 420, 0.6, C.white, C.pale, 6) + R.swan(1240, 780, 1) + R.swan(1330, 820, 0.8));
    put(P, 'mid', 'vishvamitra', { x: 1040, y: 650, s: 1.08, face: -1, pose: 'bless', hold: { L: { k: 'staff' } } }, 'He gives the two spells, daughters of Brahma.');
    put(P, 'mid', 'rama', { x: 810, y: 690, s: 1, hs: 1.08, pose: 'kneelNamaste', head: { halo: 0 } }, 'He touches water and receives the mantras with joined hands.');
    put(P, 'mid', 'lakshmana', { x: 600, y: 726, s: 0.98, hs: 1.08, pose: 'walk', hold: { R: { k: 'bow', len: 78, rot: 12 } } });
    P.mid(g(R.item('bow', { len: 78 }), 'translate(770,700) rotate(64)'));
    P.fg(R.makara(40, 900, 1.2, { rot: -8 }) + R.motes(4, [200, 760, 1500, 890], 9, [C.white], { min: 14, max: 30 }));
  });

  R.add({ n: 9, slug: 'tataka', kanda: K, ref: 'Bala 23–25', title: 'Tataka in the dead forest',
    text: 'The twang of Rama’s bowstring brings Tataka roaring out of the waste she has made of two rich provinces. She raises a storm of dust and rains boulders on the brothers. Rama, unwilling to kill a woman, first cripples her with arrows and Lakshmana cuts at her; when she vanishes into sorcery and dusk draws near, Vishvamitra says, “Enough pity.” One arrow through the chest ends her.' }, (P) => {
    S.forest(P, { seed: 19, gy: 742, far: 7, kinds: ['bare', 'bare', 'sal'], cols: [C.umber, C.maroon, C.plum], gcol: C.maroon, g2: C.umber, g3: C.clay, hcols: [C.plum, C.maroon, C.crimson], fronds: false, tufts: 8, sky: { time: 'dusk', disc: [330, 250, 84, C.vermilion, C.crimson], bands: 7, motes: 10 } });
    P.bg(R.smoke(900, 660, 2.6, C.ochre, 5, 5) + R.smoke(1330, 700, 2.4, C.clay, 7, 5) + R.smoke(640, 720, 1.6, C.sand, 2, 3));
    put(P, 'mid', 'tataka', { x: 1090, y: 860, s: 2.5, face: -1, pose: ['throw', { head: 8 }], hold: { R: { k: 'rock', s: 1.5 } }, ny: -260 }, 'A yaksha’s daughter with the strength of a thousand elephants, cursed into a man-eater.');
    let rk = ''; [[720, 300, 1.2, 20], [600, 420, 0.9, -30], [520, 250, 0.7, 60], [820, 470, 0.8, 100], [430, 380, 0.6, 10], [660, 170, 0.6, 44]].forEach((q) => (rk += g(R.item('rock'), `translate(${q[0]},${q[1]}) rotate(${q[3]}) scale(${q[2]})`) + line(`M${q[0] + 40},${q[1] - 10} l${70 * q[2]},${-26 * q[2]} M${q[0] + 44},${q[1] + 14} l${60 * q[2]},${-18 * q[2]}`, C.cream, 3, { opacity: 0.7 })));
    P.mid(rk + R.arrows(4, 470, 560, 900, 330, 7, { spread: 70, s: 0.8, len: 100, fl: C.white }));
    put(P, 'mid', 'rama', { x: 356, y: 812, s: 1.1, hs: 1.06, pose: 'archerUp', head: { halo: 0 }, hold: { R: { k: 'bow', len: 92 } } }, 'He aims at her arms first; he would rather not kill a woman.');
    put(P, 'mid', 'lakshmana', { x: 200, y: 826, s: 1.04, hs: 1.06, pose: 'archerUp', hold: { R: { k: 'bow', len: 88 } } });
    put(P, 'mid', 'vishvamitra', { x: 78, y: 830, s: 1, pose: 'point' }, '“Kill her before twilight, when rakshasas grow strong.”');
    P.fg(R.tree('bare', 1500, 930, 1.9, { tc: C.ink }) + R.tree('bare', 30, 960, 1.5, { tc: C.ink }) + R.rocks(3, 500, 1500, 905, 6, C.umber, 34));
    P.fx.tint = [C.peach, 0.25]; P.glow(330, 250, 220, C.vermilion, 0.4);
  });

  R.add({ n: 10, slug: 'the-divine-weapons', kanda: K, ref: 'Bala 26–27', title: 'The weapons present themselves',
    text: 'Pleased with Tataka’s slayer, Vishvamitra faces east and gives Rama every celestial weapon he owns: the staff of Dharma, the wheel of Time, Vishnu’s discus, Indra’s vajra, Shiva’s trident, the Brahma-head. As he chants, the weapons arrive in shining bodies, join their palms and say, “We are your servants, Raghava.” Rama touches them: “Stay in my mind.”' }, (P) => {
    S.forest(P, { seed: 27, gy: 760, far: 8, kinds: ['tier', 'round', 'sal', 'cypress'], cols: [C.forest, C.teal, C.moss], gcol: C.forest, hcols: [C.indigo, C.navy], sky: { time: 'night', stars: 20, bands: 5, motes: 8, moon: [220, 150, 46, 1] } });
    const items = ['trident', 'sword', 'gada', 'spear', 'axe', 'arrow', 'bow', 'arrow', 'gada', 'sword', 'trident']; let ring = '';
    items.forEach((k, i) => { const a = Math.PI * (1.08 + (i / (items.length - 1)) * 0.84), x = 860 + Math.cos(a) * 560, y = 720 + Math.sin(a) * 520; ring += circ(x, y, 62, C.gold, { opacity: 0.22 }) + R.ring(x, y, 62, C.gold, 4) + R.ring(x, y, 50, C.cream, 2) + g(R.item(k, { len: 60 }), `translate(${x},${y + (k === 'bow' ? 0 : 40)}) scale(${k === 'bow' ? 0.5 : 0.5})`) + g(path('M-9,0 Q0,-8 9,0 Q0,5 -9,0 Z', C.white) + circ(0, -1, 3, C.ink), `translate(${x - 26},${y + 34}) scale(.9)`) + g(path('M-9,0 Q0,-8 9,0 Q0,5 -9,0 Z', C.white) + circ(0, -1, 3, C.ink), `translate(${x + 26},${y + 34}) scale(.9)`); });
    P.bg(ring + R.chakra(860, 150, 44));
    P.note(860, 90, 'Vishnu’s discus').note(420, 330, 'The celestial weapons', 'Each comes in a body of light and bows to its new master.');
    put(P, 'mid', 'vishvamitra', { x: 520, y: 812, s: 1.3, pose: 'bless' }, 'He holds nothing back, and later teaches the spells of recall as well.');
    put(P, 'mid', 'rama', { x: 900, y: 830, s: 1.26, hs: 1.06, face: -1, pose: 'sitNamaste', head: { halo: 60 } }, 'Purified, facing east, he receives them one by one.');
    put(P, 'mid', 'lakshmana', { x: 1180, y: 826, s: 1.06, hs: 1.06, face: -1, pose: 'kneelNamaste' });
    P.fx.tint = [C.pale, 0.3]; P.glow(860, 420, 420, C.gold, 0.4).glow(900, 600, 160, C.cream, 0.4);
  });

  R.add({ n: 11, slug: 'maricha-and-subahu', kanda: K, ref: 'Bala 29', title: 'Six nights’ watch: Maricha and Subahu',
    text: 'For six days and nights the brothers guard the altar without sleeping. On the sixth, the fire flares and the sky fills with rakshasas pouring down blood. Rama’s Manava weapon lifts Maricha and flings him a hundred yojanas, senseless, into the ocean; the Agneya burns through Subahu’s chest; the Vayavya sweeps away the rest. “I have done my teacher’s bidding.”' }, (P) => {
    R.sky(P, { time: 'storm', seed: 33, bands: 7, motes: 0 });
    P.sky(R.cloud(420, 150, 2.4, C.ink, C.slate) + R.cloud(1080, 120, 2.8, C.ink, C.slate) + R.cloud(760, 260, 1.8, C.smoke, C.slate) + R.rain(5, C.red, 90, -0.2));
    R.water(P, 'bg', 600, 700, { seed: 3, bands: 3, curls: 5, ticks: 10 });
    P.bg(R.ground(690, C.moss, { stripes: 3, tufts: 20, c2: C.forest, c3: C.olive }) + R.hut(170, 740, 1.3) + R.hut(380, 720, 1) + R.grove(8, -40, 560, 716, 4, { kinds: ['tier', 'round'], s0: 0.8, s1: 1.1 }));
    P.mid(line('M740,520 Q1100,60 1420,420', C.cream, 5, { 'stroke-dasharray': '4 16', opacity: 0.9 }) + R.impact(1436, 606, 60, [C.white, C.pale], 4, 10));
    put(P, 'mid', 'maricha', { x: 1420, y: 470, s: 0.92, rot: 110, pose: 'fall', nx: 0, ny: 200 }, 'Thrown a hundred yojanas, alive, into the sea. He will remember this arrow.');
    P.mid(F('rakshasa', { x: 990, y: 330, s: 1.2, rot: -150, pose: 'fall', args: [C.sRed, C.ink], head: { eye: 'closed' } }) + R.impact(980, 250, 74, [C.gold, C.saffron, C.white], 6, 12) + g(R.item('arrow', { len: 150, tip: C.gold, fl: C.saffron }), 'translate(900,340) rotate(62)'));
    P.note(990, 150, 'Subahu', 'The fire-weapon strikes him in the chest.');
    P.mid(R.altar(560, 800, 1.3, 4) + F('sage', { x: 420, y: 800, s: 0.9, pose: 'sitNamaste' }) + F('sageBald', { x: 320, y: 806, s: 0.86, pose: 'sitNamaste' }));
    put(P, 'mid', 'vishvamitra', { x: 660, y: 806, s: 0.94, face: -1, pose: 'sitBless' }, 'Under a vow of silence until the rite is complete.');
    put(P, 'mid', 'rama', { x: 800, y: 850, s: 1.28, hs: 1.06, pose: 'archerUp', head: { halo: 0 }, hold: { R: { k: 'bow', len: 96 } } }, 'Six nights without sleep, bow in hand.');
    put(P, 'mid', 'lakshmana', { x: 1010, y: 860, s: 1.16, hs: 1.06, pose: 'archerUp', hold: { R: { k: 'bow', len: 92 } } });
    P.fg(R.crowd({ x0: 1150, x1: 1560, y: 250, n: 4, s: 0.6, kinds: ['rakshasa'], pose: () => 'fall', each: (i, f) => ({ rot: f.r(-140, 140) }), seed: 6 }));
    P.fire(560, 720, 130, 0.9).glow(980, 250, 160, C.saffron, 0.6);
  });

  R.add({ n: 12, slug: 'the-descent-of-ganga', kanda: K, ref: 'Bala 41–43', title: 'The descent of Ganga',
    text: 'On the way to Mithila the sage tells of Bhagiratha, who stood on the tip of one toe for a year so that Ganga might come down and wash the ashes of Sagara’s sixty thousand sons. Proud Ganga fell meaning to sweep Shiva into the underworld; he caught her in his matted hair and she wandered there for years before he let her down in seven streams.' }, (P) => {
    R.sky(P, { time: 'night', seed: 41, bands: 5, stars: 24, motes: 6, h: 500 });
    P.sky(R.hills(6, 760, 6, [C.pale, C.ice, C.sky], { snow: C.white, h0: 260, h1: 520, w0: 380, w1: 640, step: 0.2 }));
    const fall = [[1560, -60], [1400, 10], [1200, 40], [1040, 60], [950, 90]], run = [[860, 150], [760, 330], [640, 560], [470, 640], [330, 760], [260, 930]];
    const river = (pts, w) => line(R.smooth(pts), C.navy, w + 16, { 'stroke-linecap': 'butt' }) + line(R.smooth(pts), C.azure, w, { 'stroke-linecap': 'butt' }) + line(R.smooth(pts), C.pale, w * 0.5, { 'stroke-dasharray': '50 34', 'stroke-linecap': 'butt', opacity: 0.8 }) + line(R.smooth(pts), C.white, w * 0.16, { 'stroke-dasharray': '18 40', opacity: 0.9 });
    P.bg(river(fall, 120)); P.mask(line(R.smooth(fall), '#ff0000', 120, { 'stroke-linecap': 'butt' }));
    P.bg(R.fish(1330, 0, 0.6, C.gold, C.saffron, 196) + R.motes(5, [900, 0, 1560, 260], 14, [C.white], { min: 10, max: 26 }));
    put(P, 'mid', 'shiva', { x: 900, y: 690, s: 1.9, front: 1, skin: C.pale, pose: ['stand', { aR: [40, 150], aL: [-12, -4] }], hold: { L: { k: 'trident', rot: -6 } }, head: { hair: 'jata', halo: 0, tilak: 'tri', mouth: 'smile' }, ny: -180 }, 'He takes the whole weight of the river on his head to spare the earth.');
    P.mid(ell(900, 92, 84, 60, C.umber) + R.spiral(900, 92, 52, C.azure, 12, 2.2) + R.spiral(900, 92, 52, C.white, 3, 2.2, 1, 0.5) + path('M960,60 q30,-26 24,-52 q-34,14 -40,44 Z', C.cream));
    P.mid(river(run, 96)); P.mask(line(R.smooth(run), '#ff0000', 96, { 'stroke-linecap': 'butt' }));
    P.mid(R.fish(690, 500, 0.5, C.orange, C.gold, 130) + R.swan(520, 610, 0.7, { flip: -1 }));
    put(P, 'mid', 'bharata', { x: 300, y: 620, s: 0.98, label: 'Bhagiratha', face: 1, skin: C.sWheat, pose: ['armsUp', { lL: [44, -84] }], head: { gear: 'crown', hair: 'jata' }, cloth: { lc: C.clay, sash: 0, belt: C.umber } }, 'A king turned ascetic, standing on one toe, arms raised, living on air.');
    P.mid(ell(380, 866, 150, 40, C.ash) + ell(300, 850, 70, 26, C.grey) + ell(470, 856, 60, 22, C.smoke) + R.smoke(380, 830, 1, C.ash, 4, 3));
    P.note(430, 800, 'The ashes of Sagara’s sons', 'Burnt by the sage Kapila’s glance; only Ganga’s water can raise them to heaven.');
    P.fg(R.hills(9, 980, 4, [C.indigo, C.navy], { h0: 120, h1: 200 }));
    P.fx.tint = [C.pale, 0.2]; P.glow(900, 92, 200, C.pale, 0.5);
  });

  R.add({ n: 13, slug: 'ahalya', kanda: K, ref: 'Bala 47–48', title: 'Ahalya is seen again',
    text: 'Near Mithila stands an old hermitage, empty of sages. Here Goutama cursed his wife Ahalya, deceived by Indra, to lie for thousands of years on ashes, eating air, unseen by any creature, until Rama should come. As Rama steps in she becomes visible, blazing like a flame veiled in smoke. The brothers touch her feet; she welcomes them as guests, and Goutama returns to her.' }, (P) => {
    S.forest(P, { seed: 52, gy: 730, far: 8, kinds: ['bloom', 'round', 'tier', 'bare'], cols: [C.leaf, C.green, C.olive], flowers: 18, gcol: C.lime, g2: C.leaf, g3: C.straw, sky: { time: 'noon', bands: 4 } });
    P.bg(R.hut(250, 740, 1.5, { roof: C.smoke, wall: C.ash }) + R.vine(180, 470, 230, C.leaf, 3, C.pink) + R.vine(330, 520, 180, C.leaf, 5, C.white));
    P.bg(R.burst(830, 480, 110, { seed: 7, n: 40, len: 2.8, col: C.gold }) + R.smoke(700, 780, 1.6, C.ash, 3, 4) + R.smoke(980, 790, 1.5, C.ash, 8, 4));
    P.mid(F('woman', { x: 830, y: 800, s: 1.34, face: -1, pose: 'bless', args: [C.white, C.ash, C.sFair], head: { eye: 'soft', mouth: 'smile', nosering: 0, earring: false }, neck: 0, bangle: false }));
    P.note(830, 450, 'Ahalya', 'Made by Brahma himself; hidden from every eye until this moment.');
    put(P, 'mid', 'rama', { x: 560, y: 816, s: 1.12, hs: 1.06, pose: 'prostrate', head: { halo: 0 }, ny: 90 }, 'His arrival ends the curse; he bows to her as to an elder.');
    put(P, 'mid', 'lakshmana', { x: 400, y: 824, s: 1.06, hs: 1.06, pose: 'kneelNamaste' });
    put(P, 'mid', 'vishvamitra', { x: 1140, y: 810, s: 1.16, face: -1, pose: 'point' }, '“Enter, and deliver her.”');
    P.mid(F('sage', { x: 1400, y: 800, s: 1, face: -1, pose: 'walk', head: { haircol: C.ash, beardcol: C.ash, mustcol: C.ash }, hold: { R: 'staff' } }));
    P.note(1400, 540, 'Goutama', 'He knew the hour by his own austerities and comes home.');
    P.fg(R.petals(9, [100, 40, 1500, 640], 40) + R.fronds(12, 'T', { n: 6, s: 0.8, cols: [C.green, C.leaf] }));
    P.glow(830, 480, 240, C.cream, 0.55).rays(830, 480, 0.5, C.cream);
  });

  R.add({ n: 14, slug: 'sita-from-the-furrow', kanda: K, ref: 'Bala 65', title: 'Sita, risen from the furrow',
    text: 'Janaka tells his guests how he was ploughing the ground to clear it for a sacrifice when a baby girl rose from the furrow behind the ploughshare. He named her Sita, “furrow”, raised her as his own, and set her bride-price at valour alone: she would go to the man who could string the bow that Shiva left with his ancestors.' }, (P) => {
    R.sky(P, { time: 'dawn', seed: 61, bands: 5, sun: [800, 250, 80, C.white, 3] });
    P.sky(R.hills(3, 600, 5, [C.rose, C.pink, C.peach], { h0: 80, h1: 170 }));
    P.bg(R.city(14, 980, 1640, 596, { n: 5, s: 0.7 }) + R.grove(4, -40, 500, 610, 5, { kinds: ['round', 'tier', 'palm'], s0: 0.6, s1: 0.9 }));
    let field = R.ground(600, C.clay, { stripes: 0, tufts: 0, amp: 5 }); for (let i = 0; i < 9; i++) field += R.band(628 + i * 34, 5, 700, i % 2 ? C.brown : C.ochre, { h: 12 + i, ph: i * 0.7 });
    P.bg(field);
    P.mid(ell(800, 812, 150, 40, C.umber) + ell(800, 806, 120, 28, C.brown) + circ(800, 720, 110, C.gold, { opacity: 0.35 }) + R.ring(800, 720, 110, C.cream, 3) + R.baby(784, 760, 3.4, C.sFair, C.red));
    P.note(800, 660, 'Sita', 'Not born of a womb: the earth gives her to the king.');
    put(P, 'mid', 'janaka', { x: 520, y: 830, s: 1.24, pose: ['kneelOne', { aR: [84, 70], aL: [70, 80], both: 1 }], head: { eye: 'wide', mouth: 'smile' } }, 'Seeradhvaja Janaka, plough in hand, clearing the sacrificial field.');
    P.mid(line('M1010,820 L1180,720 L1290,700', C.amber, 9) + line('M1010,820 L1180,720 L1290,700', C.gold, 5) + path('M990,838 L1040,800 L1030,830 Z', C.ice, { stroke: C.slate, 'stroke-width': 2 }) + R.bull(1330, 800, 1.1) + R.bull(1400, 780, 1.05, { col: C.cream, cloth: C.teal }));
    P.note(1100, 700, 'The golden plough');
    P.mid(F('sage', { x: 240, y: 800, s: 0.92, pose: 'armsUp' }) + F('sageBald', { x: 130, y: 806, s: 0.9, pose: 'namaste' }));
    P.fg(R.petals(3, [200, 60, 1400, 600], 30) + R.tree('plantain', 60, 930, 1.4) + R.tree('plantain', 1560, 940, 1.3, { flip: -1 }));
    P.glow(800, 760, 190, C.gold, 0.6).rays(800, 250, 0.6, C.cream);
  });

  R.add({ n: 15, slug: 'rama-breaks-the-bow-of-shiva', kanda: K, ref: 'Bala 66', title: 'Rama breaks the bow of Shiva',
    text: 'Five thousand men drag in the iron casket on its eight wheels. With Vishvamitra’s leave Rama lifts the bow as if in play, strings it and draws; it snaps in the middle with a crack like a mountain splitting. The earth shakes and every man falls senseless, except Vishvamitra, Janaka and the two princes of Raghu’s line.' }, (P) => {
    R.sky(P, { time: 'night', seed: 31, bands: 6, motes: 0 });
    P.sky(R.burst(1050, 372, 150, { seed: 8, len: 5.2, n: 80, w: 12 }) + R.speed(1050, 372, { seed: 2, n: 60, col: C.gold, r0: 420, w: 10 }));
    P.bg(R.motes(3, [200, 40, 1560, 700], 46, [C.white, C.gold], { kind: 'ring', min: 12, max: 44, w: 4 }));
    P.bg(R.arcade(-80, 520, 60, 770, [[250, 320, 540, 7]], { fill: pat('flower', C.indigo, C.blue, 1.2), border: C.red }) + R.frieze(0, 64, C.mustard, C.pink));
    P.bg(R.ground(766, C.mustard, { stripes: 3, tufts: 0, c2: C.amber, c3: C.straw }) + R.casket(1090, 812, 0.92, true));
    put(P, 'bg', 'janaka', { x: 140, y: 752, s: 0.96, pose: 'armsUp', head: { eye: 'wide', mouth: 'open' } }, 'He had vowed Sita to whoever could string this bow; kings had failed even to lift it.');
    put(P, 'bg', 'vishvamitra', { x: 256, y: 756, s: 0.96, pose: 'bless' }, 'He alone is unmoved.');
    put(P, 'bg', 'lakshmana', { x: 368, y: 760, s: 0.94, pose: 'namaste', head: { mouth: 'smile' } });
    P.mid(R.greatBow(1010, 372, 1.25, { snap: 30 }));
    put(P, 'mid', 'rama', { x: 760, y: 836, s: 2.12, pose: ['archer', { draw: 0, lean: -6 }], head: { halo: 60 }, ny: -330 }, 'He lifts, strings and draws in one motion; the bow breaks in the middle.');
    P.fg(R.crowd({ x0: 60, x1: 620, y: 905, n: 7, s: 0.72, kinds: ['soldier', 'man', 'guard'], pose: (i, f) => ['fall', { lean: f.r(-30, 30) }], each: (i, f) => ({ rot: f.r(60, 110) * (i % 2 ? 1 : -1), y: 884 + f.r(-20, 10) }), eye: 'closed', seed: 14 }));
    P.fg(R.crowd({ x0: 1180, x1: 1560, y: 906, n: 5, s: 0.72, kinds: ['soldier', 'man'], pose: () => 'recoil', face: 1, eye: 'closed', seed: 19, each: (i, f) => ({ rot: f.r(-40, -15) }) }));
    P.glow(1050, 372, 300, C.cream, 0.75).rays(1050, 372, 1, C.straw);
  });

  R.add({ n: 16, slug: 'the-wedding-in-mithila', kanda: K, ref: 'Bala 72', title: 'The wedding in Mithila',
    text: '“This is Sita, my daughter. Take her hand in yours.” Janaka gives Sita to Rama before the fire that Vasishtha has kindled, and in the same hour Lakshmana weds Urmila, Bharata weds Mandavi and Shatrughna weds Shrutakirti. Flowers rain from the sky and the drums of the gods sound.' }, (P) => {
    S.court(P, { arches: [[800, 580, 580, 9], [240, 310, 450, 7], [1360, 310, 450, 7]], seed: 5 });
    P.bg(R.torch(70, 770, 1.45) + R.torch(1530, 770, 1.45, -1));
    put(P, 'mid', 'janaka', { x: 150, y: 720, s: 0.92, pose: 'offer' }, 'He pours the water of gift and gives his daughters.');
    put(P, 'mid', 'lakshmana', { x: 252, y: 724, s: 0.9, pose: 'offer', head: { mouth: 'smile' } });
    P.mid(F('woman', { x: 348, y: 724, s: 0.86, face: -1, pose: 'offer', args: [C.teal, C.gold, C.sFair], head: { eye: 'soft' } }));
    P.note(348, 500, 'Urmila', 'Janaka’s younger daughter, given to Lakshmana.');
    put(P, 'mid', 'bharata', { x: 1236, y: 724, s: 0.86, pose: 'offer' });
    P.mid(F('woman', { x: 1312, y: 724, s: 0.82, face: -1, pose: 'offer', args: [C.orange, C.red, C.sWheat], head: { eye: 'soft' } }));
    put(P, 'mid', 'shatrughna', { x: 1400, y: 724, s: 0.84, pose: 'offer' });
    P.mid(F('woman', { x: 1474, y: 724, s: 0.8, face: -1, pose: 'offer', args: [C.pink, C.magenta, C.sFair], head: { eye: 'soft' } }));
    P.note(1390, 470, 'Mandavi and Shrutakirti', 'Kushadhvaja’s daughters, wed to Bharata and Shatrughna.');
    put(P, 'mid', 'vasishtha', { x: 590, y: 770, s: 0.84, pose: 'sitBless' }, 'He kindles the fire and conducts the rite.');
    put(P, 'mid', 'sita', { x: 712, y: 716, s: 1.28, pose: ['offer', { aR: [70, 86], aL: [56, 80] }], head: { eye: 'soft', mouth: 'smile' } }, 'Born of the furrow, daughter of Videha.');
    put(P, 'mid', 'rama', { x: 906, y: 716, s: 1.38, face: -1, pose: ['offer', { aR: [66, 84], aL: [50, 78] }], head: { mouth: 'smile', eye: 'soft' }, cloth: { garland: C.vermilion } }, 'He takes her hand as the fire witnesses.');
    P.mid(R.altar(808, 810, 0.95, 6));
    P.fg(R.crowd({ x0: 60, x1: 1540, y: 1060, n: 13, s: 0.98, kinds: ['man', 'woman', 'girl', 'woman', 'man'], poses: ['cheer', 'dance', 'armsUp', 'namaste'], seed: 23, jy: 16 }));
    P.fg(R.streamers(8, [40, 120, 1560, 860], 46, [C.cream, C.white, C.straw]) + R.petals(4, [60, 110, 1540, 640], 34));
    P.fire(808, 738, 110, 0.9).glow(808, 520, 330, C.straw, 0.3);
  });

  R.add({ n: 17, slug: 'parashurama', kanda: K, ref: 'Bala 73–75', title: 'The other Rama',
    text: 'On the road home the sky darkens, birds scream and a whirlwind fells the trees. Out of it strides Rama of the axe, Jamadagni’s son, destroyer of kings, with Vishnu’s bow: “You broke Shiva’s old bow. String this one.” Dasharatha’s son takes it, strings it, fits an arrow, and the old warrior stands drained of his fire. The arrow is loosed on the worlds his austerities had won.' }, (P) => {
    R.sky(P, { time: 'storm', seed: 71, bands: 8, motes: 0 });
    P.sky(R.bolt(820, -20, 520, C.white, 3) + R.bolt(300, -20, 300, C.cream, 8) + R.cloud(300, 120, 2.6, C.ink, C.slate) + R.cloud(1250, 130, 2.8, C.ink, C.slate));
    P.bg(R.ground(730, C.slate, { stripes: 4, tufts: 0, c2: C.ink, c3: C.smoke }) + R.tree('bare', 180, 740, 1.3, { rot: 34, tc: C.ink }) + R.tree('sal', 1500, 740, 1.1, { rot: -30, c: C.forest }));
    P.bg(g(R.chariot(0, 0, 1, { gallop: 1, riders: F('dasharatha', { x: 0, y: -78, s: 0.6, pose: 'recoil', head: { eye: 'fear' } }) }), 'translate(690,726) scale(.5)') + R.crowd({ x0: 520, x1: 1080, y: 740, n: 7, s: 0.4, kinds: ['soldier'], pose: () => 'recoil', seed: 4, face: -1 }));
    P.note(720, 520, 'Dasharatha', '“My son is a boy. You have laid down your weapons. Spare him.”');
    P.bg(R.smoke(800, 720, 2.6, C.smoke, 6, 5));
    put(P, 'mid', 'parashurama', { x: 400, y: 850, s: 1.86, pose: ['recoil', { aL: [-100, -150] }], hold: { L: { k: 'axe', rot: -30 } }, head: { eye: 'wide' }, ny: -120 }, 'Twenty-one times he emptied the earth of kshatriyas. Now he knows Vishnu when he sees him.');
    put(P, 'mid', 'rama', { x: 1190, y: 850, s: 1.86, face: -1, pose: 'archer', head: { halo: 60, eye: 'angry' }, hold: { R: { k: 'bow', len: 118 } }, ny: -250 }, '“You are a brahmana and Vishvamitra’s kin; I will not take your life. Choose what this arrow destroys.”');
    P.fg(R.rain(8, C.pale, 110, -0.5) + R.rocks(5, 0, 1600, 912, 7, C.ink, 30));
    P.fx.tint = [C.pale, 0.2]; P.glow(800, 500, 240, C.cream, 0.35).glow(1190, 380, 200, C.gold, 0.3);
  });

  R.add({ n: 18, slug: 'seasons-of-love-in-ayodhya', kanda: K, ref: 'Bala 76', title: 'Seasons of love in Ayodhya',
    text: 'The brides come home to Ayodhya. For many seasons Rama lives with Sita, his mind always on her, his heart given over to her. She is dear to him because his father chose her; dearer still for her virtues and her beauty. Her husband lives twice over in her heart, and each knows without speaking what the other’s heart is saying.' }, (P) => {
    R.sky(P, { time: 'night', seed: 81, bands: 6, stars: 26, motes: 12, moon: [1240, 190, 86] });
    P.sky(R.city(17, -40, W + 40, 640, { n: 10, s: 0.8, win: C.gold, lamps: 1, walls: [C.indigo, C.blue, C.violet, C.plum], trims: [C.navy, C.teal], roofs: [C.gold] }));
    P.bg(rect(-80, 640, W + 160, 60, pat('zig', C.rose, C.red, 1.6)) + rect(-80, 630, W + 160, 14, C.gold) + R.ground(696, C.plum, { stripes: 2, tufts: 0, c2: C.maroon, c3: C.magenta, amp: 3 }));
    for (let x = 60; x < W; x += 150) P.bg(R.diya(x, 630, 1.1));
    P.bg(R.tree('bloom', 250, 700, 1.9, { c: C.forest, fcols: [C.white, C.pink] }) + line('M300,330 Q700,250 1010,300', C.umber, 14) + R.vine(1000, 300, 150, C.leaf, 4, C.pink));
    P.bg(line('M640,300 L640,640 M960,290 L960,640', C.gold, 5) + R.squig(640, 320, 640, 620, 8, 40, C.vermilion, 3) + R.squig(960, 310, 960, 620, 8, 40, C.vermilion, 3));
    put(P, 'mid', 'rama', { x: 716, y: 712, s: 1.14, pose: ['throne', { aR: [62, 96], aL: [-20, 30] }], head: { eye: 'soft', mouth: 'smile', halo: 0 }, hold: { R: { k: 'lotus', s: 0.9 } } }, 'His heart rests wholly in her.');
    put(P, 'mid', 'sita', { x: 892, y: 712, s: 1.08, face: -1, pose: ['throne', { aR: [56, 110], aL: [-10, 40] }], head: { eye: 'soft', mouth: 'smile' } }, 'Like Shri beside Vishnu.');
    P.mid(rect(600, 632, 400, 22, pat('diag', C.red, C.crimson), { rx: 8, stroke: C.gold, 'stroke-width': 3 }) + R.peacock(1330, 640, 0.95, { flip: -1 }));
    R.water(P, 'bg', 800, H, { seed: 9, bands: 3, curls: 5, ticks: 12, col: C.indigo, c2: C.blue, c3: C.navy });
    P.fg(R.lotusPad(300, 860, 1.4) + R.lotusPad(700, 884, 1.1, C.white) + R.lotusPad(1100, 856, 1.3) + R.lotusPad(1440, 880, 1.2, C.white) + R.petals(12, [300, 200, 1200, 600], 16, [C.white, C.pink]));
    P.fx.tint = [C.pale, 0.25]; P.glow(1240, 190, 190, C.cream, 0.5).glow(800, 520, 220, C.straw, 0.35);
  });
})();
