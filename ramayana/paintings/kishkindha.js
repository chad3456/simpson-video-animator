/* Kishkindha Kanda: paintings 63-73 */
(function () {
  const R = window.R, C = R.C, W = R.W, H = R.H, F = R.F, put = R.put, pat = R.pat, S = R.S;
  const { path, line, circ, ell, g, rect } = R;
  const K = 'Kishkindha Kanda';
  const cave = (x, y, w, h, col = C.ink) => path(`M${x - w / 2},${y} C${x - w / 2},${y - h * 1.2} ${x + w / 2},${y - h * 1.2} ${x + w / 2},${y} Z`, col);

  R.add({ n: 63, slug: 'hanuman-meets-rama', kanda: K, ref: 'Kishkindha 2–3', title: 'Hanuman comes down the mountain',
    text: 'Sugriva sends his minister to find out who the two archers are. Hanuman puts off his monkey shape for a mendicant’s, bows, and speaks: who are you, with arms like gate-bars and bows like rainbows, lighting up this shore? Rama turns to Lakshmana, delighted. “No one who has not mastered the three Vedas speaks like this. Not one word out of place, not a flaw in his face as he says it.”' }, (P) => {
    R.sky(P, { time: 'dawn', seed: 402, bands: 5, motes: 14, sun: [300, 180, 60, C.white, 2.6] });
    P.sky(R.peak(1220, 640, 820, 520, C.sea, { c2: C.aqua, lean: 30, step: 0.12 }) + R.peak(500, 640, 600, 280, C.green, { c2: C.lime }));
    P.sky(R.sil(F('sugriva', { x: 1260, y: 150, s: 0.4, pose: 'sit' }) + F('vanara', { x: 1330, y: 166, s: 0.34, face: -1 }), C.navy, 0.85));
    P.note(1280, 40, 'Sugriva watches', 'From the one hill his brother Vali cannot set foot on.');
    P.bg(R.grove(5, -60, W + 60, 640, 8, { kinds: ['bloom', 'tier', 'round'], s0: 0.7, s1: 1.1 }) + R.ground(630, C.lime, { stripes: 2, tufts: 16, flowers: 10, c2: C.leaf, c3: C.straw }));
    R.water(P, 'bg', 760, H, { seed: 5, bands: 4, curls: 8, col: C.sea, c2: C.aqua, c3: C.teal });
    P.bg(g(F('hanuman', { pose: 'bow' }), 'translate(980,772) scale(1.5,-1.1)', { opacity: 0.6 }));
    P.note(1030, 880, 'His reflection', 'The lake shows who is bowing: Vayu’s son, wearing a borrowed shape.');
    put(P, 'mid', 'hanumanMonk', { x: 980, y: 764, s: 1.56, face: -1, pose: 'bow', head: { mouth: 'smile' }, ny: 20 }, 'He praises them, then tells the truth: “I am a monkey, Sugriva’s minister. I can go where I please in any form.”');
    put(P, 'mid', 'ramaX', { x: 560, y: 764, s: 1.76, pose: ['bless', { aL: [-12, 0] }], hold: { L: { k: 'bow', len: 104, rot: -6 } }, head: { eye: 'soft', mouth: 'smile' }, ny: -110 }, 'He hears the grammar before he hears the message.');
    put(P, 'mid', 'lakshmanaX', { x: 330, y: 764, s: 1.5, pose: ['stand', { aR: [50, 120] }], hold: { L: { k: 'bow', len: 96, rot: -8 } } }, 'He answers for his brother: “We are looking for Sugriva too.”');
    P.fg(R.lotusPad(300, 860, 1.3) + R.lotusPad(600, 884, 1, C.white) + R.lotusPad(1400, 866, 1.3) + R.tree('reed', 60, 920, 1.4) + R.petals(4, [200, 100, 1400, 600], 16, [C.white, C.pink]));
    P.rays(300, 180, 0.55, C.cream);
  });

  R.add({ n: 64, slug: 'friendship-before-the-fire', kanda: K, ref: 'Kishkindha 4–5', title: 'Friendship before the fire',
    text: 'Hanuman takes his own form again and carries the brothers up Rishyamuka on his shoulders. Sugriva holds out his hand: “If you want my friendship, here is my arm.” Hanuman twirls two sticks into flame; Rama and the monkey king walk round it and are bound. They sit together on a branch of flowering sala. In that moment, the left eyes of Sita, of Vali and of Ravana begin to throb.' }, (P) => {
    R.sky(P, { time: 'dusk', seed: 405, bands: 6, motes: 10 });
    P.sky(R.peak(800, 900, 1900, 760, C.teal, { c2: C.sea, step: 0.1 }));
    P.bg(cave(1340, 760, 380, 360, C.ink) + cave(1340, 760, 300, 290, C.navy) + R.grove(4, -60, 700, 740, 4, { kinds: ['sal', 'bloom', 'tier'], s0: 0.9, s1: 1.3 }) + R.ground(740, C.moss, { stripes: 3, tufts: 14, c2: C.forest, c3: C.olive }));
    P.mid(line('M330,790 Q600,740 860,800', C.umber, 20) + [380, 470, 560, 650, 740].map((x, i) => circ(x, 770 - (i % 2) * 14, 22, pat('leafs', C.green, C.lime)) + g(R.item('flower', { col: C.white }), `translate(${x},${750 - (i % 2) * 14})`)).join(''));
    put(P, 'mid', 'ramaX', { x: 600, y: 850, s: 1.7, pose: ['stand', { aR: { t: [112, -60] }, aL: [-12, 0] }], head: { mouth: 'smile' }, ny: -100 }, '“Helping one another is the fruit of friendship. I will kill Vali.”');
    put(P, 'mid', 'sugriva', { x: 1010, y: 850, s: 1.66, face: -1, pose: ['stand', { aR: { t: [112, -62] }, aL: [-12, 0] }], head: { mouth: 'smile' }, ny: -100 }, 'Robbed of kingdom and wife by his brother; he promises to find Sita.');
    P.mid(R.altar(806, 880, 0.9, 6, false) + line('M770,836 L840,820 M776,820 L836,840', C.umber, 7) + R.flame(806, 834, 0.8, 5));
    put(P, 'mid', 'hanuman', { x: 1290, y: 860, s: 1.2, face: -1, pose: 'kneelNamaste', head: { mouth: 'smile' } }, 'He kindles the fire and sets it between them as witness.');
    put(P, 'mid', 'lakshmanaX', { x: 330, y: 856, s: 1.3, pose: 'stand', hold: { R: { k: 'bow', len: 96, rot: 6 } } });
    P.fg(R.crowd({ x0: 1380, x1: 1580, y: 960, n: 2, s: 0.9, kinds: ['vanara'], poses: ['sit'], face: -1, seed: 3 }) + R.petals(5, [300, 200, 1300, 700], 16, [C.white, C.gold]));
    P.fx.tint = [C.peach, 0.14]; P.fire(806, 790, 110, 1).glow(806, 640, 260, C.saffron, 0.4);
  });

  R.add({ n: 65, slug: 'the-anklets', kanda: K, ref: 'Kishkindha 6', title: '“I know the anklets”',
    text: 'Sugriva fetches from the cave a yellow cloth knotted round a handful of jewels: “A woman carried through the sky dropped this among us, crying ‘Rama’.” Rama holds it to his chest and cannot see for tears. “Lakshmana, look. Are these hers?” “I do not know the armlets, nor the earrings. The anklets I know, from bowing at her feet every day.”' }, (P) => {
    R.sky(P, { time: 'plum', seed: 406, bands: 6, motes: 8 });
    P.sky(cave(800, 1000, 2100, 900, C.ink) + cave(800, 1000, 1900, 800, C.navy) + cave(800, 1000, 1700, 700, C.indigo));
    P.bg(R.ground(780, C.slate, { stripes: 3, tufts: 0, c2: C.ink, c3: C.smoke }) + R.rocks(4, 0, 300, 790, 3, C.slate, 60) + R.rocks(7, 1300, 1600, 790, 3, C.slate, 60));
    P.bg(R.burst(690, 500, 90, { seed: 2, col: C.gold, n: 36, len: 2.2 }));
    put(P, 'mid', 'ramaX', { x: 620, y: 880, s: 1.86, pose: ['kneel', { aR: { t: [30, -56], bend: -1 }, aL: { t: [36, -52] }, both: 1, head: 16, lean: 8 }], head: { eye: 'closed' }, ny: 20 }, 'He breathes like an angry snake in its hole, then weeps.');
    P.mid(g(path('M-40,10 C-50,-40 50,-40 40,10 C50,40 -50,40 -40,10 Z', pat('flower', C.mustard, C.red, 0.9), { stroke: C.amber, 'stroke-width': 3 }) + R.ring(-20, -6, 12, C.gold, 5) + R.ring(18, 4, 10, C.gold, 5) + circ(0, -18, 6, C.red) + circ(26, -14, 5, C.white), 'translate(690,566) scale(1.3)') + path('M654,430 q-8,14 0,22 q8,-8 0,-22 Z M664,470 q-8,14 0,22 q8,-8 0,-22 Z', C.pale));
    put(P, 'mid', 'lakshmanaX', { x: 1010, y: 880, s: 1.6, face: -1, pose: ['kneel', { aR: [70, 110], aL: [50, 100], both: 1, head: 12 }], head: { eye: 'sad' }, ny: 10 }, 'Fourteen years he has looked no higher than her feet.');
    P.mid(g(R.ring(-16, 0, 15, C.gold, 7) + R.ring(16, 4, 15, C.gold, 7) + circ(-16, -15, 5, C.red) + circ(16, -11, 5, C.red), 'translate(890,640) scale(1.4)'));
    P.note(890, 590, 'Her anklets');
    put(P, 'mid', 'sugriva', { x: 1300, y: 870, s: 1.3, face: -1, pose: ['offer', { lean: 10 }], head: { eye: 'sad' } }, '“I do not know where that rakshasa lives, but I swear you will have her back.”');
    put(P, 'mid', 'hanuman', { x: 1460, y: 876, s: 1.14, face: -1, pose: 'namaste' });
    P.fx.tint = [C.pale, 0.2]; P.glow(690, 540, 200, C.gold, 0.6);
  });

  R.add({ n: 66, slug: 'seven-sala-trees', kanda: K, ref: 'Kishkindha 11–12', title: 'One arrow, seven trees',
    text: 'Sugriva still doubts: Vali once hurled the corpse of the buffalo-demon Dundubhi a full yojana, and could shake seven great sala trees at once. Rama tips the dry skeleton with his toe and sends it ten yojanas. Then he draws. The gold-shafted arrow passes through all seven trunks, through the mountain behind them, down through the earth, and comes back to his quiver.' }, (P) => {
    R.sky(P, { time: 'gold', seed: 411, bands: 6, motes: 10 });
    P.sky(R.peak(1380, 760, 700, 520, C.clay, { c2: C.ochre, step: 0.13 }) + R.peak(200, 760, 600, 260, C.amber, { c2: C.straw }));
    P.bg(R.ground(750, C.olive, { stripes: 3, tufts: 14, c2: C.moss, c3: C.ochre }));
    const ys = 430; P.sky(R.speed(520, ys, { seed: 4, n: 30, col: C.white, r0: 60, w: 5, a0: -0.2, a1: 0.2 }));
    for (let i = 0; i < 7; i++) { const x = 640 + i * 108, k = 1.5 - i * 0.07; P.bg(R.tree('sal', x, 770 - i * 6, k, { c: i % 2 ? C.forest : C.green })); }
    P.mid(line(`M560,${ys} L1560,${ys - 24}`, C.amber, 9) + line(`M560,${ys} L1560,${ys - 24}`, C.gold, 5) + line(`M560,${ys + 4} L1560,${ys - 20}`, C.white, 1.5));
    for (let i = 0; i < 7; i++) { const x = 640 + i * 108, y = ys - i * 2.6; P.mid(R.impact(x, y, 30 - i * 2, [C.white, C.gold], i + 2, 9) + R.ring(x, y, 44 - i * 3, C.cream, 3)); }
    P.mid(g(R.item('arrow', { len: 60, tip: C.white, fl: C.red }), 'translate(1560,406) rotate(88.6) scale(1.3)'));
    P.note(960, 330, 'Seven sala trees', 'Then the hill, then the seven underworlds, and back.');
    put(P, 'mid', 'ramaX', { x: 330, y: 860, s: 1.76, pose: ['archer', { draw: 0, aL: [-80, 20] }], hold: { R: { k: 'bow', len: 110 } }, head: { eye: 'open' }, ny: -110 }, 'He does it to give a frightened friend confidence, not for display.');
    put(P, 'mid', 'sugriva', { x: 130, y: 870, s: 1.2, pose: 'bow', head: { eye: 'wide' } }, 'His head touches the ground, earrings swinging.');
    P.bg(g(ell(0, 0, 60, 34, C.bone, { stroke: C.ash, 'stroke-width': 3 }) + path('M-50,-10 C-90,-40 -100,-80 -70,-100 C-76,-70 -60,-44 -34,-28 Z M50,-10 C90,-40 100,-80 70,-100 C76,-70 60,-44 34,-28 Z', C.bone, { stroke: C.ash, 'stroke-width': 3 }) + circ(-20, -4, 9, C.ink) + circ(20, -4, 9, C.ink) + line('M-60,30 q30,40 0,80 M-30,36 q30,40 0,80 M0,38 q30,40 0,80 M30,36 q30,40 0,80', C.bone, 8), 'translate(250,200) rotate(-30) scale(.8)') + line('M330,300 Q300,260 280,240', C.cream, 4, { 'stroke-dasharray': '4 12' }));
    P.note(250, 110, 'Dundubhi’s bones', 'Flicked ten yojanas with a toe.');
    P.fg(R.fronds(3, 'L', { n: 3 }));
    P.glow(640, 430, 120, C.gold, 0.5);
  });

  R.add({ n: 67, slug: 'two-brothers', kanda: K, ref: 'Kishkindha 12–16', title: 'Two brothers, one face',
    text: 'Sugriva roars at the gate of Kishkindha and Vali comes out like the sun over a hill. They fight with fists, knees, trees and rocks, alike as the twin Ashvins, and Rama, arrow on the string, cannot tell which to shoot. Sugriva limps back, beaten and bitter. Lakshmana winds a flowering gajapushpi creeper round his neck, and he goes to roar again. Tara begs her husband not to answer it.' }, (P) => {
    R.sky(P, { time: 'fire', seed: 412, bands: 7, motes: 0 });
    P.sky(R.peak(1100, 800, 1300, 640, C.maroon, { c2: C.crimson, step: 0.11 }) + R.speed(800, 470, { seed: 2, n: 50, col: C.gold, r0: 330, w: 8 }));
    P.bg(R.gate(1330, 770, 0.8, { col: C.clay, dark: C.ink }) + R.ground(760, C.clay, { stripes: 3, tufts: 6, c2: C.brown, c3: C.ochre }) + R.smoke(640, 800, 1.7, C.sand, 3, 3) + R.smoke(1000, 810, 1.6, C.sand, 7, 3));
    put(P, 'bg', 'tara', { x: 1330, y: 770, s: 0.8, face: -1, pose: 'plead', head: { eye: 'sad' } }, '“He has found an ally. Make peace with your brother.” Vali goes anyway.');
    put(P, 'mid', 'vali', { x: 930, y: 860, s: 1.8, face: -1, pose: ['strike', { aR: [140, 190], aL: { t: [110, -70] } }], head: { eye: 'angry', mouth: 'open' }, ny: -130 }, 'Indra’s son, wearing Indra’s golden garland, which no enemy can face.');
    put(P, 'mid', 'sugriva', { x: 660, y: 860, s: 1.76, pose: ['strike', { aR: [130, 80], aL: { t: [110, -66] } }], head: { eye: 'angry', mouth: 'open', gear: 'mukut' }, fur: C.amber, chest: C.straw, cloth: { lc: C.crimson, lpat: pat('rings', C.crimson, C.gold, 0.7), garland: C.white }, ny: -130 }, 'The same build, the same crown, the same gait. Only the creeper in bloom marks him.');
    P.mid(R.impact(800, 470, 90, [C.white, C.gold, C.white], 4, 12) + g(R.item('rock'), 'translate(1120,330) rotate(30) scale(1.2)') + g(R.item('tree'), 'translate(470,430) rotate(-60) scale(.8)'));
    P.fg(R.tree('sal', 190, 960, 2.1, { c: C.forest }) + R.fronds(5, 'L', { n: 4, cols: [C.forest, C.ink] }));
    put(P, 'fg', 'ramaX', { x: 330, y: 900, s: 1.3, pose: 'archer', hold: { R: { k: 'bow', len: 100 } }, head: { eye: 'open' } }, 'Behind a tree, waiting for certainty.');
    put(P, 'fg', 'lakshmanaX', { x: 70, y: 910, s: 1.1, pose: 'stand', note: false });
    P.glow(800, 470, 180, C.gold, 0.4);
  });

  R.add({ n: 68, slug: 'the-death-of-vali', kanda: K, ref: 'Kishkindha 16–23', title: 'Vali’s question',
    text: 'The arrow takes him in the chest and he falls like Indra’s banner cut down, the golden garland still holding his breath and splendour in him. “I was fighting another. What dharma is this, Rama, to shoot from hiding?” Rama answers him as a king answers: for the brother’s wife he took. Vali listens, and yields. He gives the garland to Sugriva and his son Angada into Rama’s keeping. Tara will not let go of him.' }, (P) => {
    R.sky(P, { time: 'dusk', seed: 417, bands: 7, motes: 6, disc: [1300, 300, 90, C.vermilion, C.crimson] });
    P.sky(R.peak(300, 780, 900, 520, C.plum, { c2: C.violet, step: 0.12 }));
    P.bg(R.grove(3, -60, 760, 740, 5, { kinds: ['sal', 'tier', 'bare'], cols: [C.forest, C.moss, C.ink], s0: 1, s1: 1.4 }) + R.ground(730, C.clay, { stripes: 3, tufts: 8, c2: C.brown, c3: C.ochre }));
    put(P, 'mid', 'vali', { x: 940, y: 836, s: 1.8, rot: -78, pose: ['lie', { aR: [70, 110], head: -20 }], head: { eye: 'sad', mouth: 'open' }, nx: -420, ny: 330 }, 'He dies a king, settling his affairs.');
    P.mid(g(R.item('arrow', { len: 150, tip: C.gold, fl: C.vermilion }), 'translate(560,560) rotate(196)') + circ(548, 716, 10, C.crimson) + circ(570, 736, 6, C.crimson));
    put(P, 'mid', 'tara', { x: 1100, y: 870, s: 1.44, face: -1, pose: ['kneel', { aR: [96, 80], aL: [84, 90], both: 1, lean: 26, head: 12 }], head: { eye: 'closed' }, ny: 30 }, '“You did not listen. Now Sugriva has what he wanted, and I have this.”');
    put(P, 'mid', 'angada', { x: 1260, y: 870, s: 0.96, face: -1, pose: 'kneelGrief', hs: 1.15, head: { eye: 'closed' } }, 'Still a boy. “Treat him as your own,” Vali tells Sugriva.');
    put(P, 'mid', 'sugriva', { x: 1440, y: 850, s: 1.34, face: -1, pose: 'grief', head: { eye: 'closed' } }, 'The victory tastes of ash; he asks to enter the fire himself.');
    put(P, 'mid', 'ramaX', { x: 190, y: 850, s: 1.5, pose: ['stand', { aR: [40, 110] }], hold: { L: { k: 'bow', len: 104, rot: -6 } }, head: { eye: 'sad' }, ny: -90 }, '“The younger brother’s wife is as a daughter. For that, the king’s punishment.”');
    P.fg(R.fronds(8, 'L', { n: 3, cols: [C.forest, C.ink] }) + '');
    P.fx.tint = [C.peach, 0.2]; P.glow(1300, 300, 220, C.vermilion, 0.4);
  });

  R.add({ n: 69, slug: 'the-rains', kanda: K, ref: 'Kishkindha 27', title: 'The rains on Mount Malyavat',
    text: 'Sugriva is crowned and the monsoon closes the roads. Rama and Lakshmana wait it out in a cave. “The sky has drunk the sea through the sun’s rays for nine months and now gives birth. One could climb to the sun on that stair of clouds. See the lightning writhe in the dark cloud’s arms, as Vaidehi must in Ravana’s.” Four months of rain; every night of it he counts.' }, (P) => {
    R.sky(P, { time: 'storm', seed: 427, bands: 8, motes: 0 });
    P.sky(R.cloud(420, 190, 3.4, C.ink, C.slate) + R.cloud(1100, 150, 3.8, C.ink, C.slate) + R.cloud(780, 330, 2.6, C.smoke, C.slate));
    P.sky(R.sil(g(F('sitaX', { pose: ['reach', { lean: 14 }], face: -1 }), 'translate(1060,470) rotate(-18) scale(1.5)'), C.gold, 0.95) + R.bolt(1010, 300, 260, C.gold, 5) + R.bolt(1150, 250, 200, C.white, 9));
    P.note(1060, 150, 'Lightning in the cloud', 'He sees her in it: bright, struggling, held.');
    P.bg(R.peak(360, 900, 1100, 700, C.forest, { c2: C.teal, step: 0.11, lean: -30 }) + cave(380, 800, 460, 420, C.ink) + cave(380, 800, 380, 350, C.navy));
    R.water(P, 'bg', 800, H, { seed: 6, bands: 5, curls: 12, col: C.clay, c2: C.ochre, c3: C.brown, curl: C.cream });
    P.bg(R.grove(4, 760, W + 60, 800, 6, { kinds: ['bloom', 'tier', 'round'], cols: [C.forest, C.green, C.teal], s0: 0.8, s1: 1.2 }));
    put(P, 'mid', 'ramaX', { x: 330, y: 800, s: 1.5, pose: ['sit', { aR: [40, 90], head: -18 }], head: { eye: 'sad' }, ny: -40 }, 'Sleepless; the season of lovers is the cruellest for him.');
    put(P, 'mid', 'lakshmanaX', { x: 520, y: 800, s: 1.24, face: -1, pose: 'sit' }, '“Wait for autumn. The enemy will not escape you.”');
    P.mid(R.peacock(900, 800, 1.1) + R.peacock(1100, 806, 0.9, { flip: -1 }) + R.crane(1380, 780, 0.8) + R.crane(1470, 790, 0.7, { flip: -1 }));
    P.note(1000, 600, 'Peacocks dancing', 'The swollen rivers run red with mountain earth.');
    P.fg(R.rain(9, C.pale, 220, -0.3) + R.fronds(5, 'R', { n: 4, cols: [C.forest, C.teal] }));
    P.fx.tint = [C.pale, 0.22]; P.glow(1060, 420, 200, C.gold, 0.5);
  });

  R.add({ n: 70, slug: 'lakshmana-in-kishkindha', kanda: K, ref: 'Kishkindha 30–35', title: 'Autumn, and a broken promise',
    text: 'The skies clear, the rivers show their sandbanks, and no army comes. Sugriva is drunk in his inner rooms with Ruma and Tara. Lakshmana walks into Kishkindha with his bow strung; the twang of it sobers the king at once. Sugriva sends Tara out first, unsteady, her girdle loose. “Even sages lose themselves to desire; forgive a monkey. The call has already gone to every mountain.”' }, (P) => {
    S.court(P, { inner: 'gold', arches: [[1180, 640, 580, 9], [330, 300, 520, 7]], wall: C.plum, wall2: C.violet, wpat: 'swirl', border: C.gold, trim: C.vermilion, fcol: C.teal, fcol2: C.gold, floor: C.straw, carpet: false, seed: 430, top: 96, lamps: [640, 1560] });
    P.sky(R.sil(R.grove(3, 120, 540, 730, 3, { kinds: ['bloom', 'tier'], s0: 0.9, s1: 1.2 }), C.amber, 0.6));
    P.mid(R.bed(1220, 800, 1.5, C.magenta));
    put(P, 'mid', 'sugriva', { x: 1180, y: 660, s: 1.2, face: -1, pose: ['throne', { aR: [-60, -150], aL: [60, 150], lean: -12 }], head: { eye: 'fear', mouth: 'open' }, cloth: { garland: C.vermilion } }, 'Four months of kingship after years of exile; he forgot what he owed.');
    P.mid(F('tara', { x: 1380, y: 700, s: 0.9, face: -1, pose: 'recoil', fur: C.tan, cloth: { lc: C.pink, lpat: pat('dots', C.pink, C.gold, 0.8), uc: C.teal } }) + g(R.item('pot', { col: C.gold }), 'translate(1000,800) rotate(70) scale(1.6)') + g(R.item('bowl'), 'translate(1440,820) scale(1.2)') + path('M1010,810 q40,20 90,6 q-40,30 -90,-6 Z', C.maroon));
    P.note(1380, 500, 'Ruma').note(1000, 760, 'Spilled wine');
    put(P, 'mid', 'tara', { x: 720, y: 850, s: 1.44, face: -1, pose: ['namaste', { lean: 10, lL: [-12, -8], lR: [14, 6] }], head: { eye: 'soft' }, ny: -40 }, 'Clever as well as beautiful: she turns his anger by agreeing with it.');
    put(P, 'mid', 'lakshmanaX', { x: 380, y: 860, s: 1.8, pose: ['stand', { aR: [60, 120] }], hold: { R: { k: 'bow', len: 112, rot: 6 } }, head: { eye: 'angry' }, ny: -110 }, '“The road Vali went by is not closed, Sugriva.”');
    P.fg(R.crowd({ x0: 60, x1: 240, y: 960, n: 2, s: 0.9, kinds: ['vanara'], poses: ['recoil'], face: -1, seed: 4 }) + R.streamers(5, [600, 150, 1560, 500], 12, [C.vermilion, C.gold], 6));
    P.glow(1180, 420, 260, C.straw, 0.35);
  });

  R.add({ n: 71, slug: 'the-ring', kanda: K, ref: 'Kishkindha 38–43', title: 'A ring with his name on it',
    text: 'They come like clouds: monkeys white as the moon, red as the dawn, dark as rain, in tens of millions from Himalaya, Vindhya and the sea-coast. Sugriva sends them out to the four quarters, a month to search. The south goes to Angada, Jambavan and Hanuman. Rama draws from his finger the ring engraved with his name and gives it to Hanuman. “By this she will know you came from me.”' }, (P) => {
    R.sky(P, { time: 'noon', seed: 440, bands: 5, motes: 12 });
    P.sky(R.hills(3, 560, 5, [C.sea, C.teal, C.green], { h0: 160, h1: 320 }));
    const hues = [C.white, C.amber, C.brown, C.clay, C.tan, C.umber, C.saffron, C.sand];
    for (let r = 0; r < 4; r++) P.bg(R.crowd({ x0: -40, x1: W + 40, y: 600 + r * 50, n: 22 - r * 3, s: 0.34 + r * 0.08, kinds: ['vanara'], poses: ['stand', 'cheer', 'armsUp', 'sit'], cols: hues, seed: 40 + r, cx: 800, each: (i, f) => ({ args: [f.pick(hues)] }) }));
    for (let i = 0; i < 8; i++) P.bg(g(R.item('flag', { col: [C.red, C.saffron, C.teal, C.gold][i % 4] }), `translate(${100 + i * 200},${520 + (i % 2) * 40}) scale(.6)`));
    P.note(800, 420, 'The vanara host', 'Sugriva recites the geography of the whole earth to each party.');
    P.bg(R.ground(800, C.lime, { stripes: 2, tufts: 10, c2: C.leaf, c3: C.straw }));
    P.mid(circ(800, 610, 86, C.gold, { opacity: 0.35 }) + R.ring(800, 610, 86, C.cream, 3) + g(R.item('ring'), 'translate(800,636) scale(4.4)'));
    P.note(800, 510, 'The signet ring', 'Marked with the letters of Rama’s name.');
    put(P, 'mid', 'ramaX', { x: 560, y: 900, s: 2, pose: ['stand', { aR: { t: [116, -82] }, aL: [-12, 0] }], head: { eye: 'soft', mouth: 'smile' }, ny: -130 }, '“I rely on you, Hanuman. Your leader says you are the one who will do it.”');
    put(P, 'mid', 'hanuman', { x: 1020, y: 900, s: 1.76, face: -1, pose: ['kneelOne', { aR: { t: [100, -70] }, aL: { t: [96, -60] }, both: 1 }], head: { mouth: 'smile' }, ny: -40 }, 'He sets the ring on his head, touches Rama’s feet and leaves at a run.');
    put(P, 'mid', 'sugriva', { x: 1320, y: 890, s: 1.3, face: -1, pose: ['point', { aR: [110, 100] }] }, '“Whoever comes back within a month and says ‘I have seen Sita’ shall share my kingdom.”');
    put(P, 'mid', 'lakshmanaX', { x: 280, y: 890, s: 1.4, pose: 'stand', hold: { R: { k: 'bow', len: 96, rot: 6 } } });
    P.glow(800, 610, 150, C.gold, 0.6);
  });

  R.add({ n: 72, slug: 'sampati', kanda: K, ref: 'Kishkindha 55–58', title: 'Sampati looks across the sea',
    text: 'The month is spent and the southern party has found nothing but the shore. They lie down on darbha grass to starve rather than face Sugriva. A huge wingless vulture creeps from a cave, glad of the meal, and hears them name Jatayu. “He was my younger brother. I burnt my wings shielding him from the sun.” With a vulture’s sight he looks south: “A hundred yojanas. Lanka. She sits there in yellow silk, among rakshasis.”' }, (P) => {
    S.sea(P, { seed: 455, hy: 520, time: 'day', sky: { bands: 5, motes: 8, disc: [250, 180, 60, C.gold, C.saffron] } });
    P.sky(g(R.lanka(0, 0, 1, { lamps: 1 }), 'translate(1380,520) scale(.22)') + R.burst(1380, 440, 20, { seed: 2, col: C.gold, n: 16, len: 3, w: 3 }));
    P.sky(line('M770,300 L1330,440', C.cream, 4, { 'stroke-dasharray': '4 14' }));
    P.note(1380, 360, 'Lanka', 'On the Trikuta peak, a hundred yojanas of water away.');
    P.bg(path('M-80,560 C200,520 520,560 760,640 C900,700 900,960 -80,960 Z', C.sand) + path('M-80,600 C200,560 500,600 720,670 C840,720 840,960 -80,960 Z', pat('dots', C.paper, C.sand, 1.5)));
    P.bg(path('M-80,960 L-80,330 L80,250 L260,300 L330,430 L250,560 L300,700 L160,960 Z', pat('stone', C.slate, C.ash, 1.2), { stroke: C.ink, 'stroke-width': 3 }) + cave(120, 620, 200, 200, C.ink));
    P.mid(R.bird(560, 380, 1.45, { col: C.slate, col2: C.ash, col3: C.cream, cut: 'both', wings: [-70, 60], seed: 3 }));
    P.note(600, 150, 'Sampati', 'As he speaks, new wings begin to sprout, as a sage once promised.');
    P.mid(rect(380, 800, 800, 16, pat('thatch', C.olive, C.lime, 1), { rx: 8 }));
    put(P, 'mid', 'angada', { x: 640, y: 800, s: 1.1, pose: ['sit', { aR: [110, 130], head: -20 }], head: { eye: 'wide' } }, 'Crown prince and leader of the party; a moment ago he was choosing to die.');
    put(P, 'mid', 'hanuman', { x: 840, y: 800, s: 1.2, pose: ['kneelOne', { aR: [120, 140], head: -16 }], head: { eye: 'wide' } });
    put(P, 'mid', 'jambavan', { x: 1040, y: 800, s: 1.2, face: -1, pose: 'stand' }, 'Oldest of them; he was there when Vishnu took three steps.');
    P.mid(F('vanara', { x: 460, y: 794, s: 0.9, rot: -90, pose: 'lie', head: { eye: 'closed' } }) + F('vanara', { x: 1320, y: 800, s: 0.86, face: -1, pose: 'sitGrief', args: [C.clay] }) + F('vanara', { x: 1200, y: 806, s: 0.9, face: -1, pose: 'sit', args: [C.tan] }));
    P.fg(R.fish(1300, 820, 0.9, C.orange, C.gold, 8, -1) + R.makara(1540, 900, 0.8, { flip: -1 }));
    P.glow(1380, 440, 80, C.gold, 0.6);
  });

  R.add({ n: 73, slug: 'jambavan-rouses-hanuman', kanda: K, ref: 'Kishkindha 64–66', title: 'Jambavan rouses Hanuman',
    text: 'Who can leap a hundred yojanas? One says ten, another thirty, ninety; Angada could cross but not return. Hanuman sits apart, silent. Old Jambavan turns to him: “Why do you say nothing? You are the Wind’s son. As a child you leapt at the sun for a fruit and Indra’s bolt broke your jaw; that is your name.” Hanuman remembers himself, and begins to grow.' }, (P) => {
    S.sea(P, { seed: 464, hy: 600, time: 'dawn', sky: { bands: 6, motes: 10 } });
    P.sky(R.burst(900, 330, 280, { seed: 4, col: C.cream, n: 80, len: 2.4, w: 10 }) + circ(900, 330, 264, C.straw));
    P.bg(R.peak(900, 960, 1500, 420, C.green, { c2: C.lime, step: 0.13 }) + R.grove(5, 300, 1500, 700, 6, { kinds: ['bloom', 'tier'], s0: 0.5, s1: 0.8 }));
    P.note(1400, 560, 'Mount Mahendra');
    P.bg(circ(210, 210, 150, C.navy) + R.ring(210, 210, 150, C.gold, 6) + circ(290, 150, 50, C.vermilion) + R.burst(290, 150, 44, { seed: 3, col: C.saffron, n: 20, len: 1.7, w: 4 }) + F('hanuman', { x: 150, y: 300, s: 0.44, rot: 40, pose: 'fly', hs: 1.5, head: { gear: 0 } }) + R.bolt(360, 80, 90, C.white, 3));
    P.note(210, 30, 'The child and the sun', 'He took it for a ripe fruit. Indra’s thunderbolt struck his jaw: hanu.');
    put(P, 'mid', 'hanuman', { x: 900, y: 980, s: 3, pose: ['stand', { aR: [118, 150], aL: [-30, -100], lL: [-14, -8], lR: [16, 8] }], head: { mouth: 'open', eye: 'wide' }, tail: [[-12, -4], [-70, 10], [-120, -50], [-110, -150], [-60, -210], [-20, -180], [-40, -150]], ny: -420 }, '“I can leap beyond the sea and back, and pull up Lanka by the roots.”');
    put(P, 'mid', 'jambavan', { x: 420, y: 880, s: 1.26, pose: ['point', { aR: [130, 140] }] }, '“Rise, tiger among monkeys. The whole army is looking at you.”');
    put(P, 'mid', 'angada', { x: 250, y: 890, s: 1.1, pose: 'cheer' });
    P.fg(R.crowd({ x0: 1240, x1: 1580, y: 940, n: 4, s: 0.84, kinds: ['vanara'], poses: ['cheer', 'armsUp', 'namaste'], face: -1, seed: 6 }) + R.crowd({ x0: 30, x1: 180, y: 960, n: 2, s: 0.8, kinds: ['vanara'], poses: ['armsUp'], face: 1, seed: 9 }));
    P.glow(900, 300, 300, C.cream, 0.4).rays(900, 330, 0.7, C.cream);
  });
})();
