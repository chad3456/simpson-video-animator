/* Yuddha Kanda: paintings 89-100 */
(function () {
  const R = window.R, C = R.C, W = R.W, H = R.H, F = R.F, put = R.put, pat = R.pat, S = R.S;
  const { path, line, circ, ell, g, rect } = R;
  const K = 'Yuddha Kanda';
  const TAIL = [[-12, -4], [-60, 30], [-120, 20], [-170, -30], [-180, -100], [-140, -140], [-110, -110]];
  const flipX = (svg, x) => g(svg, `translate(${2 * x},0) scale(-1,1)`);

  R.add({ n: 89, slug: 'vibhishana-takes-refuge', kanda: K, ref: 'Yuddha 10–13', title: '“I do not turn away one who asks”',
    text: 'Kicked from the council for saying “Give her back”, Vibhishana crosses the sea with four companions and hangs in the sky above the monkey camp: “I am Ravana’s brother. I have left sons and wife; I come to Rama for refuge.” Sugriva wants him killed as a spy. Rama hears everyone, then: “If a man comes to me once and says ‘I am yours’, I give him safety from all beings. That is my vow. Even if it were Ravana.”' }, (P) => {
    S.sea(P, { seed: 611, hy: 420, time: 'dusk', sky: { bands: 6, motes: 10, disc: [1330, 320, 70, C.cream, C.gold] } });
    P.bg(path('M-80,620 C300,560 800,600 1700,700 L1700,960 L-80,960 Z', C.sand) + path('M-80,660 C300,600 800,640 1700,740 L1700,960 L-80,960 Z', pat('dots', C.paper, C.sand, 1.5)));
    P.bg(R.cloud(1180, 400, 2.2, C.rose, C.pink));
    put(P, 'mid', 'vibhishana', { x: 1180, y: 400, s: 1.1, face: -1, pose: 'namaste', head: { eye: 'sad' }, ny: 30 }, 'He keeps his distance in the air until he is told he may come down.');
    P.mid(F('rakshasa', { x: 1030, y: 412, s: 0.8, face: -1, pose: 'namaste', args: [C.sRak, C.teal], head: { horns: 0, mouth: 'neutral', eye: 'open' } }) + F('rakshasa', { x: 1320, y: 408, s: 0.8, face: -1, pose: 'namaste', args: [C.sPurple, C.teal], head: { horns: 0, mouth: 'neutral', eye: 'open' } }) + F('rakshasa', { x: 1420, y: 416, s: 0.74, face: -1, pose: 'namaste', args: [C.sGreen, C.teal], head: { horns: 0, mouth: 'neutral', eye: 'open' } }) + F('rakshasa', { x: 940, y: 420, s: 0.74, face: -1, pose: 'namaste', args: [C.slate, C.teal], head: { horns: 0, mouth: 'neutral', eye: 'open' } }));
    put(P, 'mid', 'ramaX', { x: 640, y: 880, s: 2, pose: 'bless', hold: { L: { k: 'bow', len: 106, rot: -6 } }, head: { eye: 'soft', mouth: 'smile' }, ny: -130 }, 'The raised palm: abhaya, “do not fear”. He consecrates him king of Lanka on the spot, with sea water.');
    put(P, 'mid', 'sugriva', { x: 330, y: 880, s: 1.44, pose: ['point', { aR: [120, 130] }], head: { eye: 'angry', mouth: 'open' } }, '“A brother who deserts his brother in danger: whom will he not betray?”');
    put(P, 'mid', 'hanuman', { x: 150, y: 884, s: 1.3, pose: 'namaste' }, '“I watched his face and voice. There is no deceit in him.”');
    put(P, 'mid', 'lakshmanaX', { x: 900, y: 880, s: 1.5, face: -1, pose: ['stand', { aR: [40, 110] }], hold: { L: { k: 'bow', len: 96, rot: 8 } } });
    P.fg(R.crowd({ x0: 1040, x1: 1560, y: 1000, n: 5, s: 0.9, kinds: ['vanara'], poses: ['point', 'recoil', 'stand'], face: -1, seed: 11 }));
    P.fx.tint = [C.peach, 0.14]; P.glow(1330, 320, 200, C.cream, 0.4);
  });

  R.add({ n: 90, slug: 'the-ocean-yields', kanda: K, ref: 'Yuddha 14–15', title: 'The ocean yields',
    text: 'For three nights Rama lies on darbha grass by the shore, his arm for a pillow, asking the Ocean for passage. The Ocean does not show himself. “Lakshmana, patience, forgiveness, soft speech: the virtueless take them for weakness. Bring my bow. The monkeys shall cross on foot over dry sand.” The first arrows set the deep on fire. Then the lord of rivers rises from the midst of his waters, palms joined.' }, (P) => {
    S.sea(P, { seed: 614, hy: 440, time: 'storm', sky: { bands: 7, motes: 0 }, water: { col: C.indigo, c2: C.blue, c3: C.ink, amp: 40, wl: 420, bands: 12, curls: 26 } });
    P.sky(R.bolt(1100, -20, 420, C.white, 3) + R.cloud(500, 130, 2.6, C.ink, C.slate) + R.cloud(1300, 110, 2.4, C.ink, C.slate) + R.speed(520, 480, { seed: 3, n: 30, col: C.gold, r0: 240, w: 7, a0: -0.5, a1: 0.3 }));
    P.bg(R.flame(900, 600, 1.2, 3) + R.flame(1300, 700, 1.5, 5) + R.flame(700, 760, 1, 8) + R.flame(1500, 560, 0.9, 2));
    P.bg(R.burst(1160, 420, 120, { seed: 4, col: C.pale, n: 50, len: 2.6 }));
    put(P, 'mid', 'janaka', { x: 1160, y: 700, s: 1.6, face: -1, label: 'Sagara, the Ocean', skin: C.sea, pose: 'plead', head: { haircol: C.pale, mustcol: C.white, beardcol: C.white, beard: 'long', halo: 54 }, cloth: { upper: 0, sleeve: 0, lc: C.aqua, lpat: pat('wave', C.aqua, C.white, 1), sash: C.white, belt: C.gold, garland: C.white }, ny: -140 }, '“Earth, wind, sky, water and fire keep to their nature. Mine is to be deep. But let Nala build; I will bear his bridge.”');
    P.mid(R.band(680, 30, 300, C.indigo, { x0: 900, x1: 1420, h: 80 }) + R.motes(5, [920, 640, 1400, 760], 10, [C.white], { min: 14, max: 30 }));
    P.mid(R.arrows(6, 620, 430, 1000, 520, 6, { s: 0.9, len: 110, tip: C.gold, fl: C.saffron, spread: 50 }));
    P.bg(path('M-80,700 C200,660 420,700 560,820 C620,880 600,960 -80,960 Z', C.sand));
    put(P, 'mid', 'ramaX', { x: 330, y: 880, s: 2, pose: 'archer', hold: { R: { k: 'bow', len: 116 } }, head: { eye: 'angry', halo: 62 }, ny: -130 }, 'His eyes are red. The sun dims, the mountains shake; Lakshmana catches hold of the bow: “Enough.”');
    put(P, 'mid', 'lakshmanaX', { x: 120, y: 890, s: 1.4, pose: ['reach', { lean: 6 }], head: { eye: 'fear' } });
    P.fg(R.fish(800, 860, 1.2, C.orange, C.gold, -40) + R.fish(1380, 880, 1, C.leaf, C.lime, 200) + R.makara(1540, 900, 1, { flip: -1, rot: 10 }) + R.snake(1060, 860, 0.9, { col: C.teal, col2: C.aqua, rot: -30 }));
    P.fx.tint = [C.pale, 0.18]; P.fire(900, 540, 100, 0.8).fire(1300, 620, 120, 0.8).glow(1160, 420, 220, C.pale, 0.4);
  });

  R.add({ n: 91, slug: 'the-bridge', kanda: K, ref: 'Yuddha 15', title: 'Nala’s bridge',
    text: 'Nala, son of the gods’ own architect, takes charge. Monkeys by the hundred thousand tear up sala, ashvakarna, bamboo, mango and whole hilltops; they haul them with ropes and machines and throw them in. Fourteen yojanas the first day, twenty the second, then twenty-one, twenty-two, twenty-three. On the fifth day it reaches the far shore: a hundred yojanas, straight as the parting in a woman’s hair.' }, (P) => {
    R.sky(P, { time: 'paper', seed: 615, bands: 3, motes: 10, h: 300 });
    R.water(P, 'bg', 150, H, { seed: 16, amp: 60, wl: 800, bands: 13, curls: 30, ticks: 60, col: C.azure, c2: C.pale, c3: C.blue });
    P.bg(path('M-80,600 C120,560 300,640 360,760 C400,860 300,960 -80,960 Z', C.sand) + path('M-80,640 C100,600 270,670 320,770 C350,850 270,960 -80,960 Z', pat('dots', C.paper, C.sand, 1.5)));
    const road = [[150, 720], [420, 640], [700, 690], [900, 560], [1100, 420], [1040, 280], [1250, 200], [1480, 240]];
    P.bg(R.causeway(road, 130, { k: 1.2 }));
    P.bg(g(R.lanka(0, 0, 1, { lamps: 1 }), 'translate(1500,250) scale(.3)'));
    P.note(1500, 100, 'Lanka').note(900, 480, 'A hundred yojanas of stone and timber');
    const pts = [0.12, 0.2, 0.3, 0.38, 0.47, 0.56, 0.66, 0.74, 0.84]; const L = road.length - 1; const f = R.rng(5);
    pts.forEach((t, i) => { const k = Math.min(L - 1, Math.floor(t * L)), u = t * L - k, x = road[k][0] + (road[k + 1][0] - road[k][0]) * u, y = road[k][1] + (road[k + 1][1] - road[k][1]) * u; const sc = 0.62 - t * 0.26; P.mid(F('vanara', { x, y: y + 20, s: sc, pose: i % 2 ? 'lift' : 'carry', args: [f.pick([C.brown, C.clay, C.tan, C.amber, C.umber])], hold: i % 2 ? {} : { R: { k: i % 4 ? 'rock' : 'tree', s: 0.9 } } }) + (i % 2 ? g(R.item(i % 3 ? 'rock' : 'tree'), `translate(${x},${y + 20 - sc * 330}) scale(${sc * 1.4})`) : '')); });
    put(P, 'mid', 'vanara', { x: 330, y: 700, s: 0.9, label: 'Nala', args: [C.sand], pose: ['point', { aR: [110, 110] }], head: { gear: 'band' } }, 'Vishvakarma’s son: “I have my father’s skill. I did not speak of it unasked.”');
    put(P, 'mid', 'ramaX', { x: 190, y: 800, s: 1.2, pose: 'stand', hold: { R: { k: 'bow', len: 96, rot: 6 } } }, 'He and Lakshmana cross on the shoulders of Hanuman and Angada.');
    put(P, 'mid', 'lakshmanaX', { x: 80, y: 810, s: 1.1, pose: 'stand', note: false });
    P.mid(R.fish(620, 420, 1.1, C.orange, C.gold, -10) + R.fish(1280, 640, 1.4, C.leaf, C.lime, 14, -1) + R.fish(760, 850, 1, C.white, C.pale, 6) + R.swan(1420, 520, 0.9));
    P.fg(R.makara(1500, 900, 1.3, { flip: -1, rot: 8 }) + R.motes(8, [400, 760, 1300, 890], 10, [C.white], { min: 14, max: 32 }));
  });

  R.add({ n: 92, slug: 'angadas-embassy', kanda: K, ref: 'Yuddha 31', title: 'Angada’s last warning',
    text: 'Before the first arrow, Rama follows the law of kings and sends an envoy. Angada leaps the wall into Ravana’s hall: “I am Vali’s son. Give back Vaidehi and bow to Rama, or the world will be without rakshasas and Vibhishana will rule here.” Four guards seize his arms. He lets them hang on, springs to the palace roof, shakes them off like birds, kicks down the golden pinnacle, shouts his name and is gone.' }, (P) => {
    R.sky(P, { time: 'dusk', seed: 631, bands: 7, motes: 0 });
    P.sky(R.speed(760, 330, { seed: 4, n: 50, col: C.cream, r0: 220, w: 7 }));
    P.bg(R.palace(800, 960, 1300, 520, { tiers: 2, domes: 0, wall: C.gold, trim: C.crimson, roof: C.gold, win: C.maroon, aw: 110, lamps: 1 }) + R.dome(380, 440, 1.3) + R.dome(1220, 440, 1.3));
    P.bg(g(R.dome(0, 0, 1.5), 'translate(900,380) rotate(34)') + R.impact(790, 600, 110, [C.white, C.gold, C.white], 5, 13) + R.rocks(4, 600, 1000, 470, 5, C.amber, 26));
    P.note(940, 180, 'The palace pinnacle', 'It comes down like a Himalayan peak struck by the thunderbolt.');
    put(P, 'mid', 'angada', { x: 760, y: 600, s: 1.5, pose: ['leap', { aR: [150, 176], aL: [-140, -170] }], tail: TAIL, head: { eye: 'angry', mouth: 'open' }, ny: 10 }, 'Young, quick-tempered, and his father’s son.');
    P.mid(F('rakshasa', { x: 540, y: 330, s: 0.8, rot: -120, pose: 'fall', args: [C.sGreen, C.ink] }) + F('rakshasa', { x: 1010, y: 300, s: 0.8, rot: 130, pose: 'fall', args: [C.sPurple, C.plum] }) + F('rakshasa', { x: 470, y: 560, s: 0.76, rot: -70, pose: 'fall', args: [C.sRed, C.ink] }) + F('rakshasa', { x: 1090, y: 520, s: 0.76, rot: 80, pose: 'fall', args: [C.slate, C.olive] }));
    P.note(1010, 240, 'Four guards', 'They held on a moment too long.');
    put(P, 'fg', 'ravana', { x: 1330, y: 1010, s: 1.6, face: -1, heads: 10, pose: ['strike', { aR: [130, 160], aL: [60, 120] }], head: { eye: 'angry', mouth: 'open' }, ny: -160 }, '“Seize him! Kill him!”');
    P.fg(R.crowd({ x0: 60, x1: 700, y: 1000, n: 5, s: 0.9, kinds: ['rakshasa'], poses: ['recoil', 'point', 'strike'], face: 1, seed: 31 }));
    P.glow(790, 430, 200, C.gold, 0.4);
  });

  R.add({ n: 93, slug: 'serpent-arrows', kanda: K, ref: 'Yuddha 35–40', title: 'Serpent arrows, and Garuda',
    text: 'On the first night of battle Indrajit, invisible by sorcery, shoots arrows that are snakes. They bind Rama and Lakshmana in every limb and the brothers lie still on a bed of shafts. Sita is flown over the field in the Pushpaka to see. Then a wind rises, the sea heaves, and Garuda arrives in a blaze of gold. The serpents flee at his shadow. He strokes the brothers’ faces with his wings and they stand, whole.' }, (P) => {
    R.sky(P, { time: 'deep', seed: 640, bands: 6, stars: 16, motes: 6 });
    P.sky(R.burst(820, 300, 240, { seed: 3, col: C.gold, n: 80, len: 2.6, w: 10 }) + circ(820, 300, 226, C.straw));
    P.bg(g(R.lanka(0, 0, 1, { lamps: 1 }), 'translate(1400,700) scale(.5)') + R.ground(700, C.umber, { stripes: 4, tufts: 4, c2: C.ink, c3: C.clay }));
    P.mid(R.bird(790, 340, 1.5, { col: C.vermilion, col2: C.gold, col3: C.cream, crown: 1, wings: [-76, 64], head: C.cream, seed: 2 }));
    P.note(880, 60, 'Garuda', 'Vishnu’s mount, enemy of all serpents. “I am your friend, your breath outside your body.”');
    const sn = [[200, 620, 150, C.green], [420, 780, 170, C.teal], [1180, 600, 20, C.leaf], [1400, 800, 0, C.olive], [640, 880, 190, C.sGreen], [1060, 880, -10, C.teal], [120, 840, 160, C.leaf]];
    sn.forEach((q, i) => P.mid(R.snake(q[0], q[1], 0.9, { rot: q[2], col: q[3], col2: C.lime, len: 3 + (i % 2) })));
    P.note(300, 560, 'The naga arrows', 'Sons of Kadru, turned into shafts by Indrajit’s spell, now running for the sea.');
    put(P, 'mid', 'ramaX', { x: 680, y: 880, s: 1.6, pose: ['kneelOne', { aR: [150, 170], aL: [-20, 30], head: -20 }], head: { eye: 'wide' }, ny: -40 }, 'He wakes first, sees Lakshmana, and thinks him dead: “What use is Sita to me, or life?”');
    put(P, 'mid', 'lakshmanaX', { x: 980, y: 870, s: 1.4, face: -1, pose: ['sit', { aR: [140, 160], head: -18 }], head: { eye: 'wide' } });
    P.fg(R.crowd({ x0: 1140, x1: 1560, y: 980, n: 4, s: 0.9, kinds: ['vanara'], poses: ['cheer', 'armsUp'], face: -1, seed: 40, each: (i) => ({ hold: i % 2 ? { R: { k: 'torch', seed: i } } : {} }) }) + R.crowd({ x0: 40, x1: 300, y: 990, n: 3, s: 0.9, kinds: ['vanara'], poses: ['armsUp', 'cheer'], face: 1, seed: 44 }));
    P.fx.tint = [C.pale, 0.24]; P.glow(820, 300, 320, C.gold, 0.5).rays(820, 300, 0.7, C.straw);
  });

  R.add({ n: 94, slug: 'kumbhakarna', kanda: K, ref: 'Yuddha 48–55', title: 'Kumbhakarna wakes',
    text: 'Ravana, beaten from the field, orders his brother woken: six months asleep under Brahma’s curse. They sound conches, beat him with clubs, drive elephants over him, and pile up meat and vats of blood for when he stirs. He tells Ravana plainly that he was wrong, then goes to fight for him anyway. He strides over the wall scooping monkeys into his mouth, until Rama’s arrows take his arms, his legs, and his head.' }, (P) => {
    S.field(P, { seed: 648, gy: 760, time: 'fire', lx: 1340, ls: 0.7, sky: { bands: 7, motes: 0 } });
    P.sky(R.smoke(300, 400, 2.4, C.maroon, 3, 4));
    put(P, 'mid', 'kumbhakarna', { x: 860, y: 1260, s: 3.5, face: -1, pose: ['stride', { aR: [96, 150], aL: [-50, -120], lean: 4 }], head: { eye: 'angry', mouth: 'open' }, hold: { L: { k: 'trident', s: 1, rot: 10 } }, ny: 420 }, 'He drank and ate enough for an army before going out; the gods thought he was Time itself.');
    P.mid(F('vanara', { x: 610, y: 230, s: 0.6, rot: 20, pose: 'fall', args: [C.tan], head: { eye: 'fear' } }) + F('vanara', { x: 540, y: 150, s: 0.5, rot: -30, pose: 'fall', args: [C.clay], head: { eye: 'fear' } }));
    P.note(580, 80, 'Monkeys by the fistful', 'Some climb out again through his ears and nostrils.');
    P.mid(R.elephant(1380, 860, 0.7, { flip: -1 }) + R.crowd({ x0: 1200, x1: 1560, y: 880, n: 4, s: 0.6, kinds: ['rakshasa'], poses: ['armsUp', 'strike'], face: -1, seed: 5 }));
    P.note(1380, 640, 'The waking party', 'Ten thousand of them, with drums, clubs and elephants.');
    put(P, 'mid', 'ramaX', { x: 190, y: 880, s: 1.2, pose: 'archerUp', hold: { R: { k: 'bow', len: 98 } }, head: { eye: 'angry' } }, 'The Vayavya weapon for one arm, Indra’s for the other, crescent arrows for the legs.');
    put(P, 'mid', 'lakshmanaX', { x: 60, y: 890, s: 1.1, pose: 'archerUp', hold: { R: { k: 'bow', len: 92 } }, note: false });
    P.mid(R.arrows(7, 320, 620, 620, 380, 8, { s: 0.8, len: 110, spread: 80, tip: C.gold }));
    P.fg(R.crowd({ x0: 280, x1: 640, y: 960, n: 5, s: 0.8, kinds: ['vanara'], poses: ['run', 'recoil', 'throw'], face: (x, i) => (i % 2 ? -1 : 1), seed: 48, each: (i) => ({ hold: i % 2 ? { R: 'rock' } : {} }) }));
    P.fx.tint = [C.peach, 0.14];
  });

  R.add({ n: 95, slug: 'the-mountain-of-herbs', kanda: K, ref: 'Yuddha 60–61', title: 'The mountain of herbs',
    text: 'Indrajit’s Brahma-weapon lays the whole army low, Rama and Lakshmana with it. In the dark Jambavan asks only one thing: “Does Hanuman live? Then we all may. Go to Himalaya, between the peaks Rishabha and Kailasa. Four herbs grow on the hill there, shining.” The herbs hide from him. So he tears up the whole summit and brings it back through the night, and the scent alone raises the fallen.' }, (P) => {
    R.sky(P, { time: 'night', seed: 661, bands: 6, stars: 34, motes: 12, moon: [260, 190, 70] });
    P.sky(R.hills(4, 760, 6, [C.pale, C.ice, C.sky], { snow: C.white, h0: 200, h1: 420, w0: 360, w1: 620, step: 0.2 }));
    P.bg(R.ground(770, C.umber, { stripes: 3, tufts: 4, c2: C.ink, c3: C.clay }) + g(R.lanka(0, 0, 1, { lamps: 1 }), 'translate(1420,780) scale(.34)'));
    P.mid(circ(1130, 210, 170, C.gold, { opacity: 0.25 }) + R.ring(1130, 210, 170, C.cream, 3) + R.herbHill(1130, 300, 1.5) + R.motes(5, [960, 40, 1300, 300], 18, [C.gold, C.white, C.lime], { kind: 'star', min: 10, max: 22 }));
    P.note(1130, 20, 'The herb-bearing hill', 'Mritasanjivani restores life; vishalyakarani draws out arrows; sandhani knits bone; suvarnakarani restores colour.');
    put(P, 'mid', 'hanuman', { x: 760, y: 420, s: 2, rot: 70, pose: ['fly', { aR: [176, 250], aL: [110, 130] }], tail: TAIL, head: { eye: 'open' }, nx: 420, ny: 440 }, 'He takes the mountain back afterwards, and sets it where it was.');
    let dead = ''; const f = R.rng(6); for (let i = 0; i < 9; i++) dead += F('vanara', { x: 80 + i * 150 + f.r(-20, 20), y: 850 + (i % 3) * 30, s: 0.7, rot: i % 2 ? 90 : -90, face: i % 2 ? -1 : 1, pose: 'lie', head: { eye: 'closed' }, args: [f.pick([C.brown, C.clay, C.tan, C.umber])] });
    P.mid(dead);
    put(P, 'mid', 'jambavan', { x: 430, y: 800, s: 1, pose: ['sit', { aR: [130, 150], head: -20 }], head: { eye: 'closed' } }, 'Wounded and half blind: “I cannot see you, child; I know your voice.”');
    put(P, 'mid', 'vibhishana', { x: 300, y: 800, s: 1, pose: ['stand', { aR: [50, 110] }], hold: { R: { k: 'torch', seed: 4 } } }, 'He and Hanuman search the field by torchlight.');
    P.fx.tint = [C.pale, 0.3]; P.glow(1130, 210, 260, C.gold, 0.6).glow(260, 190, 150, C.cream, 0.4).fire(330, 620, 50, 0.7);
  });

  R.add({ n: 96, slug: 'the-fall-of-indrajit', kanda: K, ref: 'Yuddha 72–78', title: 'Lakshmana and Indrajit',
    text: 'Vibhishana knows where his nephew gets his invisibility: a rite under a banyan at Nikumbhila. He leads Lakshmana there before it can be finished. Three days and nights they fight, uncle shouting advice, Hanuman carrying the prince. At last Lakshmana fits Indra’s arrow and speaks over it: “If Rama, Dasharatha’s son, is righteous, true to his word and unrivalled in valour, kill Ravana’s son.” It does.' }, (P) => {
    R.sky(P, { time: 'plum', seed: 678, bands: 7, motes: 0 });
    P.sky(R.speed(800, 400, { seed: 6, n: 70, col: C.gold, r0: 200, w: 9 }));
    P.bg(R.ground(770, C.umber, { stripes: 3, tufts: 6, c2: C.ink, c3: C.clay }) + R.tree('banyan', 1380, 780, 2, { c: C.ink, c2: C.plum, tc: C.ink }) + R.altar(1160, 790, 0.9, 4, false) + R.smoke(1160, 720, 1, C.ash, 4, 3));
    P.note(1380, 330, 'The banyan of Nikumbhila', 'The sacrifice that makes him unseen, left half done.');
    P.mid(line('M560,372 L1180,372', C.amber, 12) + line('M560,372 L1180,372', C.gold, 7) + line('M560,372 L1180,372', C.white, 2) + R.impact(1196, 372, 120, [C.white, C.gold, C.vermilion, C.white], 4, 14));
    P.mid(flipX(R.chariot(1230, 800, 1.15, { team: 2, gallop: 1, col: C.ink, flag: C.aqua, hcol: C.slate, hcol2: C.ink, horse: { mane: C.aqua }, riders: F('indrajit', { x: 10, y: -78, s: 0.78, face: 1, pose: ['recoil', { head: -30 }], head: { eye: 'closed', mouth: 'open' }, hold: { L: { k: 'bow', len: 70, rot: 30 } } }) }), 1230));
    P.note(1220, 480, 'Indrajit', 'Meghanada, who once bound Indra. He never loses a fight he can make invisible.');
    put(P, 'mid', 'hanuman', { x: 400, y: 880, s: 1.7, pose: ['stride', { aR: [-30, -90], aL: [-50, -100] }], head: { eye: 'angry' }, ny: 30 });
    put(P, 'mid', 'lakshmanaX', { x: 400, y: 580, s: 1.4, pose: ['archer', { draw: 0, lL: [-70, 60], lR: [70, -60], aL: [-80, 20] }], hold: { R: { k: 'bow', len: 100 } }, head: { eye: 'angry' }, ny: 10 }, 'He does not sleep or eat until it is done.');
    put(P, 'mid', 'vibhishana', { x: 130, y: 880, s: 1.3, pose: ['point', { aR: [110, 110] }], hold: { L: 'gada' } }, '“Now. Before he reaches the tree.”');
    P.fg(R.crowd({ x0: 620, x1: 1000, y: 950, n: 4, s: 0.8, kinds: ['rakshasa'], pose: () => 'fall', each: (i, f) => ({ rot: f.r(70, 110) * (i % 2 ? 1 : -1), y: 900 + f.r(-10, 10) }), eye: 'closed', seed: 78 }));
    P.glow(1196, 372, 220, C.gold, 0.5);
  });

  R.add({ n: 97, slug: 'rama-and-ravana', kanda: K, ref: 'Yuddha 87–96', title: 'Rama and Ravana',
    text: 'The gods will not watch Rama fight on foot. Indra’s charioteer Matali brings down the chariot with its green horses, the armour, and the great bow. Then the two go at each other so that the sea stands still and the sun turns pale. There is nothing to compare it to: sky is like sky, ocean like ocean, the battle of Rama and Ravana like the battle of Rama and Ravana. Heads fall and grow back, a hundred times.' }, (P) => {
    R.sky(P, { time: 'fire', seed: 690, bands: 0, motes: 0, base: C.crimson });
    P.sky(path(`M-80,-80 H800 V${H + 80} H-80 Z`, C.navy) + R.band(240, 60, 700, C.indigo, { x1: 800, h: 90 }) + R.band(560, 50, 600, C.blue, { x1: 800, h: 70 }) + R.band(240, 60, 700, C.vermilion, { x0: 800, h: 90 }) + R.band(560, 50, 600, C.maroon, { x0: 800, h: 70 }));
    P.sky(R.speed(800, 420, { seed: 9, n: 120, col: C.gold, r0: 150, w: 10 }) + R.impact(800, 420, 170, [C.white, C.gold, C.white], 7, 18));
    P.bg(R.cloud(260, 110, 1.6, C.pale, C.sky) + F('indra', { x: 200, y: 110, s: 0.4, pose: 'namaste' }) + F('brahma', { x: 300, y: 114, s: 0.38, pose: 'bless' }) + F('sage', { x: 120, y: 116, s: 0.36, pose: 'armsUp' }));
    P.bg(R.ground(800, C.umber, { stripes: 3, tufts: 0, c2: C.ink, c3: C.clay }));
    P.mid(R.arrows(3, 560, 400, 760, 420, 7, { s: 0.9, len: 110, tip: C.gold, fl: C.gold, spread: 60 }) + g(R.arrows(4, 560, 400, 760, 420, 7, { s: 0.9, len: 110, tip: C.ash, fl: C.crimson, spread: 60 }), 'translate(1600,0) scale(-1,1)'));
    P.mid(R.chariot(330, 830, 1.2, { team: 3, gallop: 1, col: C.green, flag: C.gold, hcol: C.leaf, hcol2: C.lime, horse: { mane: C.gold, cloth: C.gold }, riders: F('matali', { x: 64, y: -78, s: 0.62, pose: 'reach' }) + F('ramaX', { x: -10, y: -78, s: 0.9, pose: 'archer', hold: { R: { k: 'bow', len: 90 } }, head: { eye: 'angry', halo: 50 }, cloth: { upper: 'armor', uc: C.gold, upat: pat('scale', C.gold, C.amber, 0.6) } }) }));
    P.note(330, 450, 'Rama', 'In Indra’s armour, on Indra’s chariot.').note(430, 560, 'Matali', '“Why do you fight him as if you did not know how? Use the weapon of Brahma.”');
    P.mid(flipX(R.chariot(1270, 830, 1.2, { team: 3, gallop: 1, col: C.ink, flag: C.crimson, hcol: C.slate, hcol2: C.ink, horse: { mane: C.crimson, mood: 'angry' }, riders: F('ravana', { x: -10, y: -78, s: 0.9, heads: 10, arms: 3, pose: 'archer', hold: { R: { k: 'bow', len: 90 } }, head: { eye: 'angry', mouth: 'fang' }, hs: 0.95 }) }), 1270));
    P.note(1270, 380, 'Ravana', 'Each head that falls is replaced before it lands.');
    P.mid(g(R.headP({ skin: C.sRak, gear: 'crown', hair: 'long', must: 1, eye: 'closed' }).front, 'translate(1010,700) rotate(120) scale(.9)') + g(R.headP({ skin: C.sRak, gear: 'crown', hair: 'long', must: 1, eye: 'closed' }).front, 'translate(1120,760) rotate(-70) scale(.8)'));
    P.fg(rect(-80, -10, W + 160, 50, C.ink) + rect(-80, H - 40, W + 160, 50, C.ink));
    P.glow(800, 420, 260, C.cream, 0.5);
  });

  R.add({ n: 98, slug: 'the-death-of-ravana', kanda: K, ref: 'Yuddha 97–99', title: 'Enmity ends with death',
    text: 'The arrow Brahma made, with the wind in its feathers and the sun in its tip, enters Ravana’s heart, passes through, and returns to the quiver. The bow drops from his hand. Mandodari comes: “You conquered the three worlds, and then your own senses conquered you.” Vibhishana hesitates to perform the rites for such a man. Rama: “Hostility ends at death. Our purpose is done. He is now as much mine as yours.”' }, (P) => {
    S.field(P, { seed: 697, gy: 740, time: 'dusk', lx: 1300, ls: 0.74, sky: { bands: 7, motes: 10, disc: [300, 300, 90, C.cream, C.gold] } });
    P.bg(flipX(g(R.wheel(0, 0, 60, C.gold, C.crimson), 'translate(1250,760) rotate(24)') + rect(1160, 700, 200, 60, pat('flower', C.ink, C.gold, 0.9), { rx: 8, transform: 'rotate(-12 1260 730)' }), 1300));
    put(P, 'mid', 'ravana', { x: 1180, y: 870, s: 1.7, face: -1, heads: 10, pose: ['sit', { aR: [16, 30], aL: [-40, -10], lean: -16, head: 22 }], head: { eye: 'closed', mouth: 'neutral' }, cape: null }, 'He falls like Vritra under the thunderbolt, and the earth shakes.');
    P.mid(g(R.item('arrow', { len: 150, tip: C.gold, fl: C.gold }), 'translate(1190,560) rotate(178)') + circ(1186, 726, 9, C.crimson) + g(R.item('bow', { len: 90 }), 'translate(980,900) rotate(80)'));
    put(P, 'mid', 'mandodari', { x: 1450, y: 880, s: 1.3, face: -1, pose: ['kneel', { aR: [96, 80], aL: [84, 90], both: 1, lean: 24, head: 10 }], head: { eye: 'closed' } }, '“It was not Rama. It was the day you looked at Sita.”');
    put(P, 'mid', 'vibhishana', { x: 730, y: 860, s: 1.4, pose: 'grief', head: { eye: 'closed' } }, 'He weeps for the brother who threw him out.');
    put(P, 'mid', 'ramaX', { x: 420, y: 880, s: 2, pose: ['stand', { aR: [70, 100], aL: [-10, 0] }], hold: { L: { k: 'bow', len: 110, rot: -8 } }, head: { eye: 'soft' }, ny: -130 }, 'No triumph in his face. He asks that the rites be done properly.');
    put(P, 'mid', 'lakshmanaX', { x: 200, y: 890, s: 1.5, pose: 'stand', hold: { R: { k: 'bow', len: 96, rot: 6 } } });
    P.fg(R.petals(5, [100, 60, 1500, 700], 40, [C.white, C.gold, C.pink]) + '');
    P.note(800, 200, 'Flowers fall', 'The gods’ drums sound; a cool wind rises.');
    P.fx.tint = [C.peach, 0.16]; P.glow(300, 300, 240, C.cream, 0.4).rays(300, 300, 0.5, C.cream);
  });

  R.add({ n: 99, slug: 'the-fire', kanda: K, ref: 'Yuddha 102–106', title: 'The fire gives her back',
    text: 'Before everyone, Rama says cruel things: that he fought for his name, that she has lived in another man’s house. Sita answers him with dignity and asks Lakshmana to build a pyre. She walks into it. The gods descend; Brahma tells Rama who he is. And the Fire rises in a body, carrying her unburnt, her garland fresh: “Here is your Vaidehi. There is no fault in her.” “I knew,” Rama says. “The world had to see.”' }, (P) => {
    R.sky(P, { time: 'deep', seed: 704, bands: 6, stars: 14, motes: 8 });
    P.sky(R.burst(800, 400, 300, { seed: 5, col: C.gold, n: 90, len: 2.4, w: 10 }) + circ(800, 400, 284, C.saffron) + circ(800, 400, 220, C.gold));
    P.sky(R.cloud(250, 150, 1.8, C.ice, C.pale) + R.cloud(1350, 150, 1.8, C.ice, C.pale) + F('brahma', { x: 200, y: 150, s: 0.46, pose: 'bless' }) + F('indra', { x: 300, y: 154, s: 0.44, pose: 'namaste' }) + F('shiva', { x: 1300, y: 150, s: 0.46, face: -1, pose: 'bless' }) + F('dasharatha', { x: 1410, y: 152, s: 0.44, face: -1, pose: 'bless', head: { halo: 40 } }));
    P.note(250, 40, 'Brahma and Indra', '“You are Narayana. Sita is Lakshmi.”').note(1380, 40, 'Shiva, and Dasharatha', 'The old king comes from heaven to see his sons, and forgives Kaikeyi.');
    P.bg(R.ground(790, C.umber, { stripes: 3, tufts: 0, c2: C.ink, c3: C.clay }));
    let logs = ''; for (let r = 0; r < 3; r++) for (let i = 0; i < 8 - r; i++) logs += rect(600 + r * 24 + i * 52, 800 - r * 26, 48, 24, pat('bark', r % 2 ? C.brown : C.umber, C.ink, 0.8), { rx: 8, stroke: C.ink, 'stroke-width': 1.5 });
    P.mid(logs + R.flame(660, 760, 1.9, 3) + R.flame(940, 760, 1.9, 6) + R.flame(800, 780, 2.6, 9));
    put(P, 'mid', 'agni', { x: 760, y: 720, s: 1.9, front: 1, pose: ['stand', { aR: { t: [60, -60] }, aL: { t: [-40, -60], bend: -1 } }], head: { halo: 66, mouth: 'smile' }, ny: -160 }, 'The witness of the world, who knows what is done in secret.');
    put(P, 'mid', 'sita', { x: 880, y: 700, s: 1.5, face: -1, pose: 'namaste', head: { eye: 'soft' }, cloth: { garland: C.white }, ny: -60 }, 'In red, with ornaments of molten gold, her hair dark and curling, her garland unwithered.');
    P.mid(R.flame(720, 830, 1.2, 4) + R.flame(900, 834, 1.3, 8));
    put(P, 'mid', 'ramaX', { x: 280, y: 880, s: 1.7, pose: ['stand', { head: 14 }], hold: { L: { k: 'bow', len: 104, rot: -8 } }, head: { eye: 'closed' }, ny: -100 }, 'He has stood through it with his eyes on the ground and tears on his face.');
    put(P, 'mid', 'lakshmanaX', { x: 1300, y: 880, s: 1.5, face: -1, pose: 'grief', head: { eye: 'closed' } }, 'He built the pyre, because both of them told him to.');
    put(P, 'mid', 'hanuman', { x: 1460, y: 886, s: 1.3, face: -1, pose: 'kneelNamaste' });
    P.fx.tint = [C.pale, 0.16]; P.fire(800, 640, 300, 1).glow(800, 400, 320, C.gold, 0.45).rays(800, 400, 0.6, C.straw);
  });

  R.add({ n: 100, slug: 'the-king-comes-home', kanda: K, ref: 'Yuddha 110–116', title: 'The king comes home',
    text: 'The Pushpaka carries them north over the bridge, Kishkindha, Panchavati, Chitrakuta; Rama names each place for Sita as it passes. At Nandigrama Bharata, thin in bark, sets the sandals back on his brother’s feet. Vasishtha pours the water of four seas. Sita gives Hanuman her own pearl necklace. And for the years of Rama’s rule, the poet says, no widow wept, no one feared sickness or thieves, the rains came on time, and the old did not have to bury the young.' }, (P) => {
    S.court(P, { inner: 'gold', arches: [[800, 1060, 660, 13], [170, 250, 400, 7], [1430, 250, 400, 7]], wall: C.crimson, wall2: C.red, border: C.gold, trim: C.cream, fcol: C.mustard, fcol2: C.pink, floor: C.straw, carpet: C.crimson, cw: 900, seed: 716, top: 100 });
    P.sky(R.burst(800, 360, 200, { seed: 3, col: C.cream, n: 80, len: 3, w: 9 }) + g(R.vimana(0, 0, 1, { win: C.maroon }), 'translate(800,236) scale(.46)') + R.petals(4, [520, 120, 1080, 560], 40));
    P.note(800, 60, 'The Pushpaka', 'Sent back to Kubera once it has brought them home.');
    P.bg(R.throne(800, 760, 2.1, { col: C.red }) + R.steps(800, 760, 620, 4, C.cream, C.red) + g(R.item('umbrella', { col: C.white }), 'translate(930,560) scale(1.7)'));
    put(P, 'mid', 'rama', { x: 740, y: 742, s: 1.5, pose: ['throne', { aR: [62, 168], aL: [-20, 30], handR: 'palm' }], head: { halo: 64, mouth: 'smile', eye: 'soft' }, hold: { L: { k: 'bow', len: 90, rot: -10 } }, cloth: { garland: C.white }, ny: -110 }, 'Fourteen years to the day. Rama rajya begins.');
    put(P, 'mid', 'sita', { x: 900, y: 742, s: 1.36, face: -1, pose: ['throne', { aR: [56, 110], aL: [-10, 40] }], head: { eye: 'soft', mouth: 'smile' }, hold: { R: { k: 'lotus', s: 0.9 } }, ny: -70 });
    put(P, 'mid', 'bharata', { x: 1100, y: 800, s: 1.24, face: -1, pose: ['stand', { aR: [60, 160] }], hold: { R: { k: 'umbrella', s: 0.01 } }, head: { mouth: 'smile' } }, 'He holds the white umbrella. He counted every day.');
    put(P, 'mid', 'shatrughna', { x: 1250, y: 806, s: 1.16, face: -1, pose: ['stand', { aR: [60, 150] }], hold: { R: 'chamara' } });
    put(P, 'mid', 'lakshmana', { x: 520, y: 800, s: 1.24, pose: ['stand', { aR: [60, 150] }], hold: { R: 'chamara' }, head: { mouth: 'smile' } }, 'Offered the rank of heir, he declines.');
    put(P, 'mid', 'vasishtha', { x: 360, y: 806, s: 1.2, pose: ['offer', { aR: [110, 140], aL: [90, 130] }], hold: { R: { k: 'pot', col: C.gold, s: 1.3, tilt: 150 } } }, 'He pours the consecration water, as Brihaspati did for Indra.');
    put(P, 'mid', 'hanuman', { x: 660, y: 900, s: 1.26, pose: ['kneelOne', { aR: [80, 110], aL: [60, 100], both: 1 }], head: { mouth: 'smile', eye: 'soft' }, cloth: { garland: C.white }, ny: 40 }, 'Sita looks at Rama, then gives the necklace to the one who found her.');
    put(P, 'mid', 'sugriva', { x: 180, y: 780, s: 1, pose: 'namaste' });
    put(P, 'mid', 'vibhishana', { x: 1430, y: 780, s: 1, face: -1, pose: 'namaste' });
    P.fg(R.crowd({ x0: 40, x1: 520, y: 1040, n: 5, s: 0.92, kinds: ['man', 'woman', 'vanara', 'girl'], poses: ['cheer', 'namaste', 'armsUp'], face: 1, seed: 100 }) + R.crowd({ x0: 1040, x1: 1560, y: 1040, n: 5, s: 0.92, kinds: ['woman', 'man', 'vanara', 'girl'], poses: ['cheer', 'namaste', 'armsUp'], face: -1, seed: 101 }) + R.streamers(7, [60, 120, 1540, 800], 40, [C.cream, C.white, C.straw]) + R.torch(60, 800, 1.4) + R.torch(1540, 800, 1.4, -1));
    P.glow(800, 420, 320, C.cream, 0.4).rays(800, 360, 0.6, C.cream);
  });
})();
