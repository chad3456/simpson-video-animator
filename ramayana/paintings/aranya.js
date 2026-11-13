/* Aranya Kanda, part one: paintings 38-50 */
(function () {
  const R = window.R, C = R.C, W = R.W, H = R.H, F = R.F, put = R.put, pat = R.pat, S = R.S;
  const { path, line, circ, ell, g, rect } = R;
  const K = 'Aranya Kanda';

  R.add({ n: 38, slug: 'viradha', kanda: K, ref: 'Aranya 2–3', title: 'Viradha seizes Sita',
    text: 'Hardly inside the Dandaka forest, a rakshasa tall as a hilltop blocks the path, wrapped in a bloody tiger skin, three lions and four tigers spitted on his spear. He snatches Sita into his arms: “Two ascetics with one woman? She will be my wife.” Weapons cannot kill him by Brahma’s boon, so the brothers break his arms and bury him alive in a pit, as he himself asks.' }, (P) => {
    S.forest(P, { seed: 302, gy: 760, far: 8, kinds: ['sal', 'bare', 'tier', 'sal'], cols: [C.forest, C.navy, C.moss], gcol: C.forest, g2: C.navy, g3: C.moss, hcols: [C.navy, C.indigo], sky: { time: 'teal', bands: 6, motes: 8 } });
    put(P, 'mid', 'rakshasa', { x: 1000, y: 900, s: 2.7, face: -1, label: 'Viradha', args: [C.sRed, C.amber], pose: ['stand', { aR: [80, 150], aL: [-60, -160] }], head: { mouth: 'open', fang: 1 }, cloth: { lower: 'short', lc: C.amber, lpat: pat('diag', C.amber, C.ink, 1.6), sash: C.amber, spatt: pat('diag', C.amber, C.ink, 1.4) }, hold: { L: { k: 'spear', rot: 8, s: 1.3 } }, ny: -330 }, 'Once the gandharva Tumburu, cursed by Kubera; Rama’s hand will free him.');
    P.mid(R.lion(1245, 110, 0.5, { flip: -1 }) + R.lion(1250, 190, 0.44, { col: C.amber }));
    put(P, 'mid', 'sitaX', { x: 730, y: 330, s: 0.92, rot: -30, face: -1, pose: 'fall', head: { eye: 'fear', mouth: 'open' }, ny: 80 }, 'She shakes like a plantain in a gale.');
    put(P, 'mid', 'ramaX', { x: 330, y: 850, s: 1.26, pose: 'archerUp', hold: { R: { k: 'bow', len: 98 } }, head: { eye: 'angry' } }, '“Lakshmana, look: Kaikeyi’s wish is fulfilled sooner than she hoped.”');
    put(P, 'mid', 'lakshmanaX', { x: 150, y: 860, s: 1.2, pose: 'archerUp', hold: { R: { k: 'bow', len: 94 } }, head: { eye: 'angry' } });
    P.mid(R.arrows(4, 480, 620, 860, 420, 7, { spread: 70, s: 0.8, len: 100 }));
    P.fg(R.fronds(5, 'L', { n: 4, cols: [C.navy, C.forest] }) + R.fronds(6, 'R', { n: 4, cols: [C.navy, C.forest] }));
    P.fx.tint = [C.aqua, 0.15];
  });

  R.add({ n: 39, slug: 'the-vow-in-dandaka', kanda: K, ref: 'Aranya 4–5', title: 'The vow in Dandaka',
    text: 'The sage Sharabhanga, having seen Rama, enters his own fire and rises young to Brahma’s world. Then ascetics of every order gather: those who live on moonbeams, on water, on leaves, who stand in rivers. They show him a white hill of bones. “These were sages, eaten by rakshasas along the Pampa and the Mandakini. You are our king, even here.” Rama answers: “I came for my father’s word; I stay for yours.”' }, (P) => {
    S.forest(P, { seed: 305, gy: 740, far: 7, kinds: ['tier', 'sal', 'round'], cols: [C.forest, C.green, C.moss], gcol: C.olive, sky: { time: 'dawn', bands: 5, sun: [330, 200, 60, C.white, 2.6] } });
    P.bg(R.altar(330, 740, 1.2, 5) + R.sil(F('sage', { x: 330, y: 560, s: 0.9, pose: 'armsUp' }), C.cream, 0.9) + R.motes(3, [240, 240, 420, 480], 8, [C.gold, C.white], { kind: 'ring', min: 10, max: 22 }));
    P.note(330, 330, 'Sharabhanga', 'He turned back Indra’s chariot to wait for Rama, then gave up his old body to the fire.');
    let bones = path('M980,850 C1000,700 1100,640 1200,640 C1320,640 1420,720 1440,850 Z', C.bone, { stroke: C.ash, 'stroke-width': 3 }); const f = R.rng(5);
    for (let i = 0; i < 30; i++) { const x = f.r(1020, 1400), y = f.r(690, 840); bones += f() < 0.35 ? circ(x, y, 13, C.white, { stroke: C.ash, 'stroke-width': 2 }) + circ(x - 4, y - 1, 2.6, C.ink) + circ(x + 4, y - 1, 2.6, C.ink) : g(line('M-16,0 H16', C.white, 6) + circ(-17, -3, 4, C.white) + circ(-17, 3, 4, C.white) + circ(17, -3, 4, C.white) + circ(17, 3, 4, C.white), `translate(${x},${y}) rotate(${f.r(0, 180)})`); }
    P.mid(bones); P.note(1210, 600, 'The bones of the sages', '“See what is done to us, who have laid down the rod and cannot fight.”');
    put(P, 'mid', 'ramaX', { x: 760, y: 860, s: 1.9, pose: 'bless', hold: { L: { k: 'bow', len: 104, rot: -4 } }, head: { eye: 'open' }, ny: -110 }, 'The raised palm is a promise: he will clear the forest of those who prey on the helpless.');
    put(P, 'mid', 'sitaX', { x: 540, y: 850, s: 1.2, pose: 'stand', head: { eye: 'sad' } }, 'Later she asks him, gently, whether carrying weapons among hermits is wise.');
    put(P, 'mid', 'lakshmanaX', { x: 420, y: 856, s: 1.26, pose: 'stand', hold: { R: { k: 'bow', len: 94, rot: 6 } } });
    P.fg(R.crowd({ x0: 880, x1: 1560, y: 980, n: 7, s: 0.94, kinds: ['sage', 'sageBald', 'sage'], poses: ['plead', 'point', 'namaste', 'kneelNamaste'], face: -1, seed: 31 }));
    P.fire(330, 680, 110, 0.9).rays(330, 200, 0.5, C.cream);
  });

  R.add({ n: 40, slug: 'agastya', kanda: K, ref: 'Aranya 10–11', title: 'Agastya’s armoury',
    text: 'Ten years pass among the hermitages. Then they come to Agastya, who once drank the ocean and made the Vindhya mountain bow. The small sage rises to meet his guest and hands him what the gods left in his keeping: Vishnu’s bow, worked in gold and diamonds by Vishvakarma, the unfailing arrow of Brahma, two quivers that never empty, and a sword in a golden sheath. “Live at Panchavati, two yojanas on.”' }, (P) => {
    S.forest(P, { seed: 311, gy: 730, far: 8, kinds: ['bloom', 'tier', 'round', 'plantain'], flowers: 16, gcol: C.leaf, g2: C.green, g3: C.lime, sky: { time: 'gold', bands: 5 } });
    [[200, C.red, 'Agni'], [400, C.azure, 'Vishnu'], [1250, C.gold, 'Indra'], [1440, C.cream, 'Brahma']].forEach((q, i) => { P.bg(rect(q[0] - 46, 520, 92, 214, pat('brick', C.rose, C.cream, 1), { stroke: C.clay, 'stroke-width': 2 }) + path(R.archD(q[0] - 30, 730, 60, 130, 5), C.navy) + R.dome(q[0], 520, 0.74, q[1], C.red) + R.diya(q[0], 728, 1.1)); P.note(q[0], 380, 'Shrine of ' + q[2]); });
    P.bg(R.burst(830, 400, 90, { seed: 3, col: C.cream, n: 44, len: 3 }));
    P.mid(g(R.item('bow', { len: 150 }), 'translate(870,470) rotate(8) scale(1.5)') + g(R.item('sword'), 'translate(700,640) rotate(-150) scale(1.6)'));
    [[610, 560], [660, 590]].forEach((q) => P.mid(g(rect(-16, -70, 32, 100, pat('zig', C.crimson, C.gold, 1), { rx: 10, stroke: C.gold, 'stroke-width': 3 }) + [-9, 0, 9].map((x) => g(R.item('arrow', { len: 44 }), `translate(${x},-66) scale(.6)`)).join(''), `translate(${q[0]},${q[1]}) rotate(-14)`)));
    P.note(900, 250, 'The bow of Vishnu').note(630, 460, 'Indra’s quivers', 'Full of arrows bright as fire, and never empty.');
    put(P, 'mid', 'agastya', { x: 680, y: 850, s: 1.5, pose: ['offer', { aR: [110, 130], aL: [90, 124] }], head: { mouth: 'smile' }, ny: 40 }, 'Small in body; the south is safe because he lives in it.');
    put(P, 'mid', 'ramaX', { x: 1060, y: 860, s: 1.5, face: -1, pose: ['kneelOne', { aR: [100, 120], aL: [84, 116], both: 1 }], ny: 0 }, 'He takes the weapons with which he will keep his vow.');
    put(P, 'mid', 'sitaX', { x: 1300, y: 850, s: 1.1, face: -1, pose: 'namaste' }, 'Agastya praises her: she chose hardship with her husband.');
    put(P, 'mid', 'lakshmanaX', { x: 1430, y: 856, s: 1.14, face: -1, pose: 'namaste' });
    P.fg(R.petals(5, [200, 100, 1400, 600], 22) + R.fronds(7, 'L', { n: 3 }));
    P.glow(830, 420, 240, C.gold, 0.5).rays(830, 400, 0.6, C.cream);
  });

  R.add({ n: 41, slug: 'jatayu-and-panchavati', kanda: K, ref: 'Aranya 13–14', title: 'Jatayu, and a house at Panchavati',
    text: 'On the road they meet a vulture so vast they take him for a rakshasa. “Child, I am Jatayu, your father’s friend. This forest is thick with night-rangers; I will watch over Sita when you and Lakshmana are away.” At Panchavati, where the Godavari runs through lotuses, Lakshmana raises a hut of clay walls, bamboo rafters and thatch. Rama embraces him: “In you, our father lives.”' }, (P) => {
    S.forest(P, { seed: 313, gy: 720, far: 6, kinds: ['round', 'tier', 'bloom', 'palm'], flowers: 14, gcol: C.lime, g2: C.leaf, g3: C.straw, sky: { time: 'day', bands: 5 }, fronds: false });
    R.water(P, 'bg', 800, H, { seed: 3, bands: 4, curls: 8 });
    P.bg(R.tree('banyan', 330, 730, 2, { c: C.forest }) + R.hut(1240, 740, 1.7) + R.tree('plantain', 1450, 740, 1.2) + R.tree('plantain', 1060, 740, 1));
    P.mid(R.bird(380, 330, 1.25, { col: C.clay, col2: C.gold, col3: C.cream, wings: [-30, 34], seed: 2 }));
    P.note(430, 130, 'Jatayu', 'King of vultures, son of Aruna, the Sun’s charioteer; he was Dasharatha’s friend.');
    put(P, 'mid', 'ramaX', { x: 700, y: 800, s: 1.26, face: -1, pose: 'namaste', head: { mouth: 'smile' } }, 'He honours the bird as he would his father.');
    put(P, 'mid', 'sitaX', { x: 840, y: 800, s: 1.14, face: -1, pose: 'namaste' });
    put(P, 'mid', 'lakshmanaX', { x: 1010, y: 806, s: 1.2, pose: ['carry', {}], hold: { R: { k: 'staff', rot: 60 } } }, 'He digs, cuts bamboo, ties the thatch, then bathes in the Godavari and brings lotuses.');
    P.mid(R.deer(1420, 800, 0.9, { flip: -1 }) + R.deer(1500, 810, 0.7, { flip: -1, look: -1 }));
    P.fg(R.lotusPad(260, 860, 1.4) + R.lotusPad(620, 880, 1.1, C.white) + R.lotusPad(1000, 866, 1.3) + R.lotusPad(1380, 884, 1.2, C.white) + R.swan(820, 868, 0.9));
    P.note(700, 880, 'Godavari');
  });

  R.add({ n: 42, slug: 'shurpanakha', kanda: K, ref: 'Aranya 16', title: 'Shurpanakha falls in love',
    text: 'Ravana’s sister, wandering the wood, sees Rama and is struck by desire. Valmiki sets them side by side: his face fair, hers foul; his waist slim, hers a pot; his hair fine, hers copper wire; his voice sweet, hers a croak. “I am Shurpanakha, who takes any shape she likes. Leave this sunken-bellied human. I will eat her, and you and I will roam Dandaka together.”' }, (P) => {
    S.forest(P, { seed: 316, gy: 730, far: 6, kinds: ['bloom', 'round', 'tier'], flowers: 20, gcol: C.lime, g2: C.leaf, g3: C.straw, sky: { time: 'rose', bands: 5 } });
    P.bg(R.hut(360, 750, 2) + R.vine(210, 400, 240, C.leaf, 4, C.pink));
    P.bg(R.sil(g(F('woman', { pose: 'dance', args: [C.pink, C.red, C.sFair] }), 'translate(1270,800) scale(2.3)'), C.pink, 0.55) + R.motes(4, [1050, 150, 1500, 600], 10, [C.white, C.pink], { kind: 'ring', min: 10, max: 30 }));
    P.note(1300, 200, 'As she imagines herself', 'A shape-shifter, in her own mind she is the loveliest of women.');
    put(P, 'mid', 'sitaX', { x: 420, y: 830, s: 1.2, pose: ['sit', { aR: [30, 100] }], head: { eye: 'wide' } }, 'She draws back toward the door.');
    put(P, 'mid', 'ramaX', { x: 640, y: 836, s: 1.4, pose: ['sit', { aR: [70, 130], aL: [-16, 30] }], head: { mouth: 'smile', eye: 'soft' } }, 'He answers lightly: “I am married. Try my brother; he has no wife here.”');
    put(P, 'mid', 'shurpanakha', { x: 1020, y: 860, s: 1.86, face: -1, pose: ['offer', { aR: [96, 140], aL: [-40, 60], lean: 14, head: -8 }], head: { eye: 'bliss', mouth: 'smile' }, hold: { R: { k: 'lotus', s: 1.2 } }, ny: -110 }, 'Pot-bellied, copper-haired, claw-nailed, and entirely sincere.');
    put(P, 'mid', 'lakshmanaX', { x: 1400, y: 850, s: 1.2, face: -1, pose: ['stand', { aR: [40, 130] }], head: { mouth: 'smile' }, hold: { L: { k: 'bow', len: 90, rot: 6 } } }, '“I am only his servant. Would you be a servant’s wife?”');
    let hearts = ''; [[860, 300, 1.3], [800, 420, 0.9], [900, 200, 0.8], [760, 250, 0.6]].forEach((q) => (hearts += g(path('M0,10 C-26,-12 -12,-32 0,-16 C12,-32 26,-12 0,10 Z', C.vermilion), `translate(${q[0]},${q[1]}) scale(${q[2] * 1.6})`)));
    P.fg(hearts + R.petals(7, [300, 80, 1500, 700], 24, [C.pink, C.white]));
  });

  R.add({ n: 43, slug: 'nose-and-ears', kanda: K, ref: 'Aranya 17', title: 'The sword at Panchavati',
    text: 'Mocked back and forth between the brothers, she decides the rival must go and rushes at Sita like a meteor at a star. Rama stops the game at once. “Never jest with the cruel. Lakshmana, mark this one.” Lakshmana draws his sword and takes off her ears and nose. She runs howling into the forest, arms thrown up, to her brother Khara and his fourteen thousand.' }, (P) => {
    R.sky(P, { time: 'fire', seed: 317, bands: 7, motes: 0 });
    P.sky(R.speed(930, 400, { seed: 4, n: 80, col: C.gold, r0: 230, w: 12 }) + R.speed(930, 400, { seed: 9, n: 30, col: C.white, r0: 300, w: 6 }));
    P.bg(R.ground(770, C.maroon, { stripes: 3, tufts: 8, c2: C.ink, c3: C.crimson }) + R.hut(170, 790, 1.7) + R.tree('bare', 1500, 780, 1.6, { tc: C.ink }));
    put(P, 'mid', 'sitaX', { x: 250, y: 850, s: 1.2, pose: 'recoil', face: -1, head: { eye: 'fear', mouth: 'open' } }, 'Seized by terror, like a doe in a snare.');
    put(P, 'mid', 'ramaX', { x: 440, y: 860, s: 1.5, pose: ['guard', { aR: [80, 60], aL: [-60, -100], lean: 4 }], head: { eye: 'angry' }, ny: -40 }, 'One arm bars the way to Sita; the other signals his brother.');
    put(P, 'mid', 'shurpanakha', { x: 1150, y: 870, s: 1.9, face: -1, pose: ['recoil', { aR: [-100, -170], aL: [-130, 170], lean: -22 }], head: { eye: 'fear', mouth: 'open' }, ny: -120 }, 'Her scream fills the forest like a monsoon cloud breaking.');
    P.mid(R.impact(960, 420, 96, [C.white, C.gold, C.vermilion, C.white], 6, 13) + [[1010, 500, 9], [1040, 560, 7], [980, 590, 6], [1070, 470, 5], [930, 540, 5]].map((q) => circ(q[0], q[1], q[2], C.crimson)).join(''));
    put(P, 'mid', 'lakshmanaX', { x: 760, y: 870, s: 1.7, pose: ['slash', { aR: [118, 86] }], head: { eye: 'angry' }, hold: { R: { k: 'sword', along: 1, s: 1.3 } }, ny: -100 }, 'He strikes while Rama watches, as he was told.');
    P.fg(line('M560,260 Q840,120 1010,400', C.white, 9, { opacity: 0.9 }) + line('M540,300 Q830,170 1000,420', C.gold, 4, { opacity: 0.9 }));
    P.glow(960, 420, 200, C.gold, 0.5);
  });

  R.add({ n: 44, slug: 'one-against-fourteen-thousand', kanda: K, ref: 'Aranya 19–29', title: 'One against fourteen thousand',
    text: 'Khara marches from Janasthana with Dushana, three-headed Trishiras and fourteen thousand rakshasas, under a red sky with jackals howling. Rama sends Lakshmana to a cave with Sita and stands alone. Gods and sages crowd the sky to watch. He draws arrows so fast no one sees his hand move; in the time it takes to milk a cow, the host is down. Last comes Khara, mace in hand, and an arrow given by Indra.' }, (P) => {
    R.sky(P, { time: 'fire', seed: 325, bands: 8, motes: 0, disc: [800, 430, 250, C.gold, C.saffron] });
    P.sky(R.burst(800, 430, 250, { seed: 2, col: C.straw, n: 90, len: 3.4, w: 6 }));
    P.bg(R.cloud(260, 110, 1.5, C.rose, C.pink) + R.cloud(1340, 100, 1.6, C.rose, C.pink) + R.crowd({ x0: 150, x1: 380, y: 124, n: 3, s: 0.34, kinds: ['sage', 'man'], poses: ['namaste', 'armsUp'], face: 1, seed: 3 }) + F('indra', { x: 1340, y: 110, s: 0.38, face: -1, pose: 'namaste' }) + F('brahma', { x: 1420, y: 114, s: 0.36, face: -1, pose: 'bless' }));
    P.note(1380, 30, 'The gods watch', '“How can one man fight fourteen thousand?”');
    P.bg(R.ground(760, C.maroon, { stripes: 4, tufts: 0, c2: C.ink, c3: C.crimson }));
    const f = R.rng(7); let host = '';
    for (let i = 0; i < 26; i++) { const a = Math.PI * (1 + (i + f.r(0, 0.8)) / 26), r = f.r(430, 700), x = 800 + Math.cos(a) * r * 1.2, y = 800 + Math.sin(a) * r * 0.62 + 60; host += F('rakshasa', { x, y: Math.min(y, 880), s: f.r(0.5, 0.8), face: x < 800 ? 1 : -1, rot: f.r(-80, 80), pose: f.pick(['fall', 'recoil', 'strike', 'fall']), args: [f.pick([C.sGreen, C.sRak, C.sPurple, C.sRed, C.slate]), f.pick([C.ink, C.plum, C.olive])], hold: f() < 0.4 ? { R: f.pick(['sword', 'spear', 'gada']) } : {}, head: { eye: f() < 0.5 ? 'closed' : 'fear' } }); }
    P.bg(host);
    let vol = ''; for (let i = 0; i < 44; i++) { const a = Math.PI * (1.02 + (i / 44) * 0.96) + f.r(-0.03, 0.03), r0 = f.r(170, 240), r1 = r0 + f.r(100, 380); vol += g(R.item('arrow', { len: r1 - r0, fl: C.gold, tip: C.white }), `translate(${800 + Math.cos(a) * r0},${470 + Math.sin(a) * r0 * 0.8}) rotate(${(a * 180) / Math.PI + 90}) scale(.9)`); }
    P.mid(vol);
    P.mid(g(R.chariot(0, 0, 1, { gallop: 1, team: 2, col: C.ink, flag: C.crimson, riders: F('khara', { x: 0, y: -78, s: 0.66, face: 1, pose: 'strike', hold: { R: 'gada' } }) }), 'translate(1500,850) scale(-1.05,1.05)'));
    P.note(1470, 560, 'Khara', 'Shurpanakha’s brother, lord of Janasthana. His chariot shines like the sun; it will not save him.');
    put(P, 'mid', 'ramaX', { x: 760, y: 860, s: 1.9, pose: 'archer', hold: { R: { k: 'bow', len: 112 } }, head: { eye: 'angry', halo: 62 }, ny: -100 }, 'Alone, in armour like the fire, arrows leaving the bow in an unbroken line.');
    P.fg(R.crowd({ x0: 60, x1: 640, y: 930, n: 6, s: 0.8, kinds: ['rakshasa'], pose: () => 'fall', each: (i, ff) => ({ rot: ff.r(70, 110) * (i % 2 ? 1 : -1), y: 890 + ff.r(-10, 10) }), eye: 'closed', seed: 41 }));
    P.glow(800, 430, 300, C.gold, 0.45).rays(800, 430, 0.8, C.straw);
  });

  R.add({ n: 45, slug: 'ravana-enthroned', kanda: K, ref: 'Aranya 30–32', title: 'Dashagriva on the throne of Lanka',
    text: 'Shurpanakha flies across the sea and finds her brother on a golden seat on the roof of his palace, blazing like a fire fed with ghee: ten necks, twenty arms, a chest scarred by Indra’s thunderbolt and the tusks of Airavata. “You sit drunk among your women while one man on foot has emptied Janasthana. And he has a wife, Ravana, such as no god or gandharva has.”' }, (P) => {
    S.court(P, { inner: 'fire', arches: [[800, 900, 640, 11], [170, 240, 400, 7], [1430, 240, 400, 7]], wall: C.maroon, wall2: C.crimson, wpat: 'scale', border: C.gold, trim: C.red, fcol: C.gold, fcol2: C.red, floor: C.amber, floor2: C.gold, carpet: C.crimson, cw: 700, seed: 330, top: 70 });
    P.sky(R.burst(800, 330, 200, { seed: 3, col: C.gold, n: 70, len: 2.6, w: 9 }));
    [420, 560, 1040, 1180].forEach((x) => P.bg(R.pillar(x, 740, 600, 54, C.gold, C.red)));
    P.bg(R.throne(800, 760, 1.9, { col: C.maroon }) + R.steps(800, 760, 520, 4, C.gold, C.red));
    put(P, 'mid', 'ravana', { x: 800, y: 770, s: 1.62, front: 1, heads: 10, arms: 9, armItems: false, pose: ['throne', { aR: [50, 110], aL: [-50, -110], lL: [-64, 8], lR: [64, -8] }], hs: 1.3, head: { eye: 'angry', gear: 'crown' }, headMoods: [{ skin: C.sGreen, mouth: 'fang' }, { skin: C.sPurple, eye: 'wide' }, { skin: C.sRed, mouth: 'fang' }, { skin: C.slate, eye: 'closed' }, { skin: C.olive, mouth: 'frown' }, { skin: C.sPurple, mouth: 'fang' }, { skin: C.sRed, eye: 'wide' }, { skin: C.sGreen, mouth: 'smile' }, { skin: C.slate, mouth: 'fang' }], cape: null, ny: -190 }, 'Ten-necked, twenty-armed; he lifted Kailasa and made the three worlds wail, which is what “Ravana” means.');
    put(P, 'mid', 'shurpanakha', { x: 330, y: 850, s: 1.26, pose: ['point', { aR: [110, 120] }], head: { eye: 'angry', mouth: 'open' } }, 'Earless and noseless, she tells it her own way: “I tried to bring her to you.”');
    P.mid(F('rakshasi', { x: 150, y: 760, s: 0.9, pose: ['stand', { aR: [60, 150] }], hold: { R: { k: 'chamara' } } }) + F('rakshasi', { x: 1450, y: 760, s: 0.9, face: -1, pose: ['stand', { aR: [60, 150] }], hold: { R: { k: 'chamara' } }, args: [C.sGreen, C.plum] }));
    P.fg(R.crowd({ x0: 1000, x1: 1540, y: 990, n: 5, s: 0.9, kinds: ['rakshasa'], poses: ['namaste', 'stand'], face: -1, seed: 6, each: () => ({ hold: {} }) }) + R.lampHang(300, -40, 150, 1.6) + R.lampHang(1300, -40, 150, 1.6));
    P.glow(800, 330, 300, C.gold, 0.4).fire(300, 150, 60, 0.6).fire(1300, 150, 60, 0.6);
  });

  R.add({ n: 46, slug: 'ten-heads-ten-vices', kanda: K, ref: 'Aranya 30', aside: 'The ten vices are a later devotional reading, not Valmiki’s; he calls him only Dashagriva, the ten-necked', title: 'Ten heads, ten vices',
    text: 'Valmiki’s Ravana is no fool: a scholar of the Vedas, an ascetic who offered his own heads to Brahma, a king whose city is the wonder of the world. Tradition has read his ten heads as the ten appetites that ruled that learning: lust, anger, delusion, greed, pride, envy, selfishness, injustice, cruelty and ego. On the tenth day of the autumn festival all ten are burnt in effigy.' }, (P) => {
    R.sky(P, { time: 'deep', seed: 346, bands: 7, motes: 14, mcols: [C.gold, C.vermilion] });
    P.sky(R.burst(800, 520, 300, { seed: 6, col: C.crimson, n: 80, len: 2.4, w: 12 }) + circ(800, 520, 290, C.maroon));
    const V = [
      ['Krodha · anger', C.sRed, 'angry', 'fang', 'His rage burns the messenger’s tail and his own city with it.'],
      ['Lobha · greed', C.sGreen, 'wide', 'smile', 'He took Lanka and the Pushpaka from his own brother Kubera.'],
      ['Mada · pride', C.sPurple, 'closed', 'smile', 'He asked Brahma for safety from gods and demons, and scorned to mention men.'],
      ['Matsarya · envy', C.olive, 'sad', 'frown', 'He cannot bear to hear Rama praised.'],
      ['Kama · lust', C.pink, 'soft', 'smile', 'The wish that brings him to Panchavati, against every warning.'],
      ['Ahankara · ego', C.sRak, 'angry', 'neutral', 'The central head. “I am Ravana.”'],
      ['Moha · delusion', C.violet, 'wide', 'open', 'He takes the golden deer’s lie for a plan and his doom for a prize.'],
      ['Swartha · selfishness', C.teal, 'angry', 'smile', 'A whole people is spent for one man’s want.'],
      ['Anyaya · injustice', C.slate, 'closed', 'frown', 'He kicks Vibhishana out of the council for speaking the law.'],
      ['Amanavata · cruelty', C.umber, 'angry', 'fang', 'A year’s grace for Sita, and then the kitchen knives.'],
    ];
    let body = path('M420,900 C440,700 600,600 800,600 C1000,600 1160,700 1180,900 Z', pat('scale', C.crimson, C.gold, 1.4), { stroke: C.maroon, 'stroke-width': 4 }) + line('M560,640 Q800,820 1040,640', C.gold, 12) + circ(800, 742, 22, C.red, { stroke: C.gold, 'stroke-width': 5 });
    P.mid(body);
    const slots = [[120, 640, 1.3], [230, 500, 1.55], [360, 380, 1.8], [560, 290, 2.05], [1040, 290, 2.05], [800, 400, 2.9], [1240, 380, 1.8], [1370, 500, 1.55], [1480, 640, 1.3]];
    // eight flanking heads, lust rising above the crown, ego in the centre
    const draw = (vi, x, y, k, rot) => { const v = V[vi], h = R.headF({ skin: v[1], eye: v[2], mouth: v[3], must: 1, gear: 'crown', gem: vi % 2 ? C.aqua : C.red, sclera: C.straw, hair: 'long' }); P.mid(g(h.back + h.front, `translate(${x},${y}) rotate(${rot}) scale(${k})`)); P.note(x, y - 64 * k, v[0], v[4]); };
    [[0, 0, -30], [1, 1, -22], [2, 2, -14], [3, 3, -6], [9, 4, 6], [6, 6, 14], [7, 7, 22], [8, 8, 30]].forEach((q) => draw(q[0], slots[q[1]][0], slots[q[1]][1], slots[q[1]][2], q[2]));
    draw(4, 800, 150, 1.5, 0);
    draw(5, 800, 440, 3, 0);
    P.fg(R.flame(120, 940, 1.5, 3) + R.flame(1480, 940, 1.5, 7) + R.flame(420, 960, 1, 5) + R.flame(1180, 960, 1, 9));
    P.fire(120, 800, 150, 0.9).fire(1480, 800, 150, 0.9).glow(800, 440, 260, C.vermilion, 0.3);
  });

  R.add({ n: 47, slug: 'maricha-sees-rama-everywhere', kanda: K, ref: 'Aranya 33–39', title: 'Maricha sees Rama in every tree',
    text: 'Ravana crosses the sea in his mule-yoked sky-chariot to an ashram on the far shore where Maricha, once flung a hundred yojanas by a boy’s arrow, lives on roots in bark and black antelope skin. “Go back. I see Rama behind every tree, a thousand Ramas, bow in hand. Words that begin with the letter ‘R’, ratna, ratha, frighten me.” Ravana gives him a simpler choice: die there by Rama, or here by me.' }, (P) => {
    S.sea(P, { seed: 333, hy: 400, time: 'dusk', sky: { bands: 6, disc: [1300, 300, 70, C.vermilion, C.crimson] } });
    P.bg(R.ground(640, C.sand, { stripes: 2, tufts: 10, c2: C.tan, c3: C.cream, amp: 14 }));
    const xs = [120, 300, 470, 640, 820];
    xs.forEach((x, i) => { P.bg(R.tree(i % 2 ? 'sal' : 'tier', x, 700 + (i % 2) * 30, 1.5 + (i % 3) * 0.2, { c: C.forest })); P.bg(R.sil(F('ramaX', { x: x + 30, y: 720 + (i % 2) * 30, s: 1.24 + (i % 3) * 0.14, pose: 'archer', hold: { R: { k: 'bow', len: 90 } } }), C.sBlue, 0.75)); });
    P.note(470, 300, 'A thousand Ramas', 'Wherever he looks he sees him: in bark, bow drawn, like Death with a noose.');
    P.bg(R.hut(1010, 690, 1) + g(R.chariot(0, 0, 1, { beast: 'mule', team: 2, col: C.gold, flag: C.crimson }), 'translate(1300,700) scale(.62)'));
    P.note(1360, 520, 'The sky-chariot', 'Golden, yoked to mules with the faces of pishachas.');
    put(P, 'mid', 'marichaMonk', { x: 760, y: 860, s: 1.5, face: -1, pose: ['recoil', { aR: [-60, 140], aL: [-90, 120] }], head: { eye: 'fear', mouth: 'open' }, ny: -40 }, '“Easy to find, O king, are men who say pleasant things.”');
    put(P, 'mid', 'ravana', { x: 1140, y: 870, s: 1.6, face: -1, heads: 10, pose: ['point', { aR: [84, 96] }], head: { eye: 'angry' }, ny: -110 }, '“Become a golden deer with silver spots. Lead him away. The rest is mine.”');
    P.fg(R.tree('reed', 60, 920, 1.5) + R.rocks(4, 1300, 1600, 910, 4, C.plum, 40));
    P.fx.tint = [C.peach, 0.18]; P.glow(1300, 300, 200, C.vermilion, 0.4);
  });

  R.add({ n: 48, slug: 'the-golden-deer', kanda: K, ref: 'Aranya 40–41', title: 'The golden deer',
    text: 'It grazes by the hut: hide of gold flecked with silver, antler-tips of sapphire, belly pale as a lotus petal, nibbling shoots and glancing back. Sita, gathering flowers, has never wanted anything so much: alive as a playmate, or its skin to sit on. Lakshmana says flatly, “No such deer exists. That is Maricha.” Rama takes his bow: “Then I will kill Maricha. Guard her until I return.”' }, (P) => {
    S.forest(P, { seed: 340, gy: 730, far: 7, kinds: ['bloom', 'round', 'tier', 'bloom'], flowers: 26, gcol: C.leaf, g2: C.green, g3: C.lime, sky: { time: 'noon', bands: 4, motes: 20 } });
    P.bg(R.hut(230, 750, 1.6) + R.burst(1090, 600, 130, { seed: 4, col: C.straw, n: 44, len: 2.2 }));
    P.mid(circ(1090, 620, 170, C.gold, { opacity: 0.2 }) + R.deer(1090, 800, 2.5, { col: C.gold, spots: C.white, look: -1, horn: C.amber, jewel: C.azure }));
    P.note(1100, 420, 'The deer', 'Maricha’s last shape. Other deer sniff it and scatter.');
    P.mid(R.deer(1440, 780, 0.8, { flip: -1, run: 1 }) + R.deer(1520, 800, 0.7, { flip: -1, run: 1 }));
    put(P, 'mid', 'sitaX', { x: 560, y: 840, s: 1.4, pose: ['reach', { aR: [96, 80], aL: [70, 90] }], head: { eye: 'wide', mouth: 'smile' }, ny: -40 }, '“Aryaputra, come and look! Bring it to me.”');
    P.mid(g(R.item('pot', { col: C.tan }), 'translate(470,838) scale(1.6)') + R.petals(3, [430, 780, 520, 810], 6, [C.vermilion, C.white]));
    put(P, 'mid', 'ramaX', { x: 380, y: 850, s: 1.44, pose: ['stand', { aR: [50, 110] }], hold: { L: { k: 'bow', len: 100, rot: -6 } }, head: { eye: 'soft' } }, 'Charmed himself, and sure of his arrow either way.');
    put(P, 'mid', 'lakshmanaX', { x: 200, y: 860, s: 1.3, pose: ['point', { aR: [70, 130] }], head: { eye: 'angry' } }, 'The only one not fooled.');
    P.fg(R.fronds(4, 'R', { n: 4 }) + R.petals(8, [600, 100, 1500, 700], 20));
    P.glow(1090, 620, 220, C.gold, 0.5);
  });

  R.add({ n: 49, slug: 'marichas-cry', kanda: K, ref: 'Aranya 42', title: '“Ah, Sita! Ah, Lakshmana!”',
    text: 'The deer shows itself and vanishes, draws him on, lets him near, bounds away, until the hut is far behind. Out of patience, Rama fits the arrow Brahma made. It splits the deer’s heart. Maricha leaps the height of a palm tree, falls in his own vast shape, and with his last breath does what he was sent to do: he cries out in Rama’s voice.' }, (P) => {
    S.forest(P, { seed: 342, gy: 760, far: 8, kinds: ['sal', 'tier', 'round'], cols: [C.forest, C.teal, C.moss], gcol: C.forest, sky: { time: 'teal', bands: 6, motes: 6 }, hcols: [C.navy, C.indigo] });
    [130, 220, 320, 430].forEach((r, i) => P.bg(R.ring(1080, 330, r, C.cream, 6 - i) + R.ring(1080, 330, r + 16, C.gold, 2)));
    P.bg(R.hut(130, 770, 0.6) + F('sitaX', { x: 210, y: 772, s: 0.44, pose: 'recoil', head: { eye: 'fear' } }) + F('lakshmanaX', { x: 60, y: 774, s: 0.46, hold: { R: { k: 'bow', len: 70 } } }));
    P.note(170, 600, 'The hut, far behind', 'The cry reaches it. Sita hears her husband calling for help.');
    P.mid(R.sil(R.deer(1000, 640, 2, { run: 1 }), C.gold, 0.55) + g(R.item('arrow', { len: 170, tip: C.gold, fl: C.saffron }), 'translate(880,560) rotate(64)') + R.impact(1040, 470, 60, [C.gold, C.white], 3, 10));
    put(P, 'mid', 'maricha', { x: 1160, y: 560, s: 1.9, rot: 54, face: -1, pose: ['fall', { head: -30 }], head: { eye: 'closed', mouth: 'open' }, nx: 60, ny: 330 }, 'He dies as a rakshasa, mountain-sized, earrings and gold garland returned.');
    put(P, 'mid', 'ramaX', { x: 470, y: 870, s: 1.6, pose: ['archer', { draw: 0, aL: [-70, 30] }], hold: { R: { k: 'bow', len: 104 } }, head: { eye: 'fear' }, ny: -70 }, 'His hair stands on end. “Lakshmana was right. What will Sita do when she hears that?”');
    P.fg(R.fronds(8, 'L', { n: 4, cols: [C.navy, C.forest] }) + R.fronds(9, 'R', { n: 4, cols: [C.navy, C.forest] }));
    P.glow(1080, 330, 200, C.cream, 0.4);
  });

  R.add({ n: 50, slug: 'words-like-arrows', kanda: K, ref: 'Aranya 43', title: 'Words like heated arrows',
    text: '“Go! That was your brother.” Lakshmana does not move: no one in the three worlds can harm Rama; the voice is sorcery. Then Sita, frantic, says the unforgivable: that he hangs back because he wants her, that he is Bharata’s spy. He covers his ears. “May the gods of the forest protect you, wide-eyed one. The omens are terrible.” There is no line drawn on the ground in Valmiki; he simply bows and goes.' }, (P) => {
    S.forest(P, { seed: 343, gy: 740, far: 7, kinds: ['tier', 'round', 'sal'], cols: [C.moss, C.forest, C.olive], gcol: C.olive, sky: { time: 'storm', bands: 6, motes: 0 }, hcols: [C.slate, C.smoke] });
    for (let i = 0; i < 7; i++) { const x = 720 + i * 130, y = 380 + (i % 3) * 70; P.bg(g(path('M-30,0 Q0,-22 32,-2 Q0,14 -30,0 Z', C.cream) + circ(2, -3, 9, C.forest) + line('M-34,2 Q0,-26 36,-4', C.ink, 4), `translate(${x},${y}) scale(${i % 2 ? 1 : -1},1)`)); }
    P.note(1100, 300, 'The forest watches', 'He leaves her in the keeping of the trees and their gods.');
    P.bg(R.hut(300, 760, 2));
    P.bg(R.sil(F('ravanaMonk', { x: 1500, y: 720, s: 0.8, face: -1, hold: { R: { k: 'umbrella', s: 0.5 } } }), C.maroon, 0.85));
    P.note(1500, 500, 'Someone is waiting', 'For exactly this.');
    put(P, 'mid', 'sitaX', { x: 520, y: 850, s: 1.6, pose: ['point', { aR: [100, 96], aL: [-40, 60], lean: 8 }], head: { eye: 'angry', mouth: 'open' }, ny: -90 }, 'She threatens to drown herself in the Godavari, or take poison, or walk into fire.');
    let barbs = ''; [[760, 380, 10], [800, 450, -4], [770, 520, 6]].forEach((q) => (barbs += g(R.item('arrow', { len: 120, tip: C.vermilion, fl: C.crimson }), `translate(${q[0]},${q[1]}) rotate(${90 + q[2]})`)));
    P.mid(barbs);
    put(P, 'mid', 'lakshmanaX', { x: 1060, y: 860, s: 1.6, pose: ['walk', { aR: { t: [20, -118], bend: -1 }, aL: { t: [-12, -118] }, both: 1, head: 14, lean: 8 }], head: { eye: 'closed' }, hold: {}, ny: -90 }, 'Palms over his ears, looking back again and again as he goes.');
    P.mid(g(R.item('bow', { len: 90 }), 'translate(1170,640) rotate(14)'));
    P.fg(R.fronds(2, 'L', { n: 4 }) + R.fronds(3, 'R', { n: 5, cols: [C.forest, C.ink] }));
    P.fx.tint = [C.pale, 0.18];
  });
})();
