/* Ayodhya Kanda: paintings 19-37 */
(function () {
  const R = window.R, C = R.C, W = R.W, H = R.H, F = R.F, put = R.put, pat = R.pat, S = R.S;
  const { path, line, circ, ell, g, rect } = R;
  const K = 'Ayodhya Kanda';
  const BARK = { head: { hair: 'long' } }; // bark already on, hair not yet matted (before the Ganga)
  const mix = (a, b) => Object.assign({}, a, b, { head: Object.assign({}, a.head || {}, b.head || {}) });

  R.add({ n: 19, slug: 'the-prince-the-people-love', kanda: K, ref: 'Ayodhya 1–2', title: 'The prince the people love',
    text: 'Valmiki pauses to describe him: Rama never speaks first in anger and answers harshness gently; he remembers one kindness and forgets a hundred wrongs; he sits with the old to learn, and in archery not even his father is his equal. When Dasharatha asks the assembly whom they want as heir, they answer with one voice, and tell the king why.' }, (P) => {
    R.sky(P, { time: 'gold', seed: 3, bands: 6, motes: 18 });
    P.sky(R.burst(1120, 420, 250, { seed: 5, col: C.straw, len: 2.4, n: 70, w: 9 }) + circ(1120, 420, 236, C.cream));
    P.bg(R.frieze(0, 70, C.red, C.gold, { edge: C.gold, dot: C.cream }) + R.frieze(830, 70, C.red, C.gold, { edge: C.gold, dot: C.cream }));
    const med = (x, y, col, name, note, inner) => { P.bg(circ(x, y, 132, C.red) + circ(x, y, 122, col) + R.ring(x, y, 122, C.gold, 4) + R.ring(x, y, 132, C.gold, 3) + inner); P.note(x, y - 120, name, note); };
    med(190, 250, C.navy, 'Master of the bow', 'Skilled in every weapon, on elephant, horse and chariot; yet he never fights without cause.', F('rama', { x: 150, y: 350, s: 0.62, pose: 'archer', hold: { R: { k: 'bow', len: 80 } }, head: { halo: 0 } }));
    med(480, 250, C.teal, 'Student of the old', 'Between bouts of arms he sits with those old in years, learning and conduct.', F('vasishtha', { x: 420, y: 350, s: 0.54, pose: 'sitBless' }) + F('rama', { x: 540, y: 352, s: 0.54, face: -1, pose: 'sitNamaste', head: { halo: 0 } }));
    med(190, 580, C.crimson, 'Friend of the poor', 'He asks after the townspeople as a father asks after his sons, and grieves at their griefs.', F('rama', { x: 140, y: 680, s: 0.6, pose: 'offer', head: { halo: 0 }, hold: { R: 'bowl' } }) + F('man', { x: 250, y: 684, s: 0.52, face: -1, pose: 'kneelNamaste', args: [C.ochre, C.cream, C.sBrown] }));
    med(480, 580, C.plum, 'Slow to anger', 'He does not answer harsh words with harsh words, and he does not lie, even in jest.', F('man', { x: 420, y: 680, s: 0.56, pose: 'point', args: [C.olive, C.red, C.sDark], head: { eye: 'angry', mouth: 'open' } }) + F('rama', { x: 540, y: 680, s: 0.6, face: -1, pose: 'bless', head: { halo: 0, mouth: 'smile' } }));
    put(P, 'mid', 'rama', { x: 1090, y: 1340, s: 3.3, pose: ['stand', { aR: [20, 150], aL: [-12, 0] }], head: { halo: 0, eye: 'soft', mouth: 'smile' }, hold: { R: { k: 'lotus', s: 0.9 } }, cloth: { garland: C.vermilion }, ny: 480 }, 'Dark as a blue lotus, long-armed, broad-chested; the people watch him as they watch the rising moon.');
    P.fg(R.crowd({ x0: 640, x1: 1560, y: 1040, n: 9, s: 0.86, kinds: ['man', 'woman', 'man', 'girl', 'soldier'], poses: ['cheer', 'namaste', 'armsUp'], face: (x) => (x < 1090 ? 1 : -1), seed: 8 }) + R.petals(5, [640, 80, 1560, 700], 26));
    P.glow(1120, 380, 300, C.cream, 0.35).rays(1120, 420, 0.5, C.cream);
  });

  R.add({ n: 20, slug: 'manthara', kanda: K, ref: 'Ayodhya 7–9', title: 'Manthara climbs to the roof',
    text: 'From the palace roof Kaikeyi’s old servant sees the streets watered, the flags up, the brahmanas with garlands. A nurse tells her why: tomorrow Rama is made heir. She runs to Kaikeyi, who gives her a jewel for the good news. Manthara throws it down. “Fool. Kousalya’s son rises and yours becomes his servant.” By nightfall the queen’s joy has turned.' }, (P) => {
    S.court(P, { inner: 'dusk', arches: [[1120, 640, 560, 9]], wall: C.plum, wall2: C.magenta, border: C.vermilion, fcol: C.maroon, fcol2: C.gold, floor: C.magenta, carpet: false, seed: 21, lamps: [300, 620], top: 90 });
    P.sky(R.city(5, 760, 1500, 640, { n: 6, s: 0.8, lamps: 1 }) + R.motes(3, [820, 120, 1420, 420], 12, [C.gold, C.cream]));
    for (let i = 0; i < 7; i++) P.sky(g(R.item('flag', { col: [C.saffron, C.red, C.gold][i % 3] }), `translate(${860 + i * 90},${480 - (i % 3) * 30}) scale(.5)`));
    P.bg(R.sil(g(F('manthara', { pose: 'tiptoe' }), 'translate(520,760) scale(3.6)'), C.ink, 0.55));
    P.bg(R.sil(R.snake(380, 250, 2.2, { rot: 150, len: 4 }), C.ink, 0.5));
    P.mid(R.bed(1080, 800, 1.5, C.teal));
    put(P, 'mid', 'kaikeyi', { x: 1090, y: 664, s: 1.28, face: -1, pose: ['throne', { aR: [60, 130], aL: [-20, 40] }], head: { eye: 'wide' } }, 'A moment ago she called Rama as dear to her as Bharata.');
    put(P, 'mid', 'manthara', { x: 760, y: 806, s: 1.36, pose: ['point', { lean: 26, aR: [70, 120], head: 8 }], head: { mouth: 'open' }, ny: 40 }, 'Brought from Kekaya with the bride; she reminds her of two boons the king once promised.');
    P.mid(g(R.item('jewel'), 'translate(900,800) rotate(40) scale(1.2)') + R.motes(2, [860, 760, 960, 800], 4, [C.gold], { kind: 'dot', min: 10, max: 18 }));
    P.note(900, 770, 'The thrown jewel', 'Kaikeyi’s reward for good news, flung to the floor.');
    P.fg(R.drape(-40, 700, 96, C.maroon, C.gold, 3, 80));
    P.fx.tint = [C.rose, 0.2]; P.glow(300, 230, 150, C.saffron, 0.5).glow(1120, 500, 260, C.saffron, 0.25);
  });

  R.add({ n: 21, slug: 'two-boons', kanda: K, ref: 'Ayodhya 9–12', title: 'Two boons',
    text: 'Dasharatha finds his youngest queen on the bare floor of the anger chamber, her ornaments flung off like stars fallen from the sky. He swears by Rama to give whatever she asks. She asks: let Bharata be consecrated with what has been made ready for Rama, and let Rama go to the Dandaka forest for fourteen years in bark and deerskin. The king falls like a tree cut at the root.' }, (P) => {
    S.court(P, { inner: 'deep', arches: [[330, 400, 470, 7]], wall: C.ink, wall2: C.plum, wpat: 'rings', border: C.maroon, fcol: C.plum, fcol2: C.magenta, floor: C.slate, carpet: false, seed: 31, top: 80 });
    P.sky(g(R.chariot(0, 0, 1, { gallop: 1, riders: F('dasharatha', { x: -10, y: -78, s: 0.56, pose: 'fall', rot: 40, head: { haircol: C.black, beardcol: C.black, mustcol: C.black, eye: 'closed' } }) + F('kaikeyi', { x: 40, y: -78, s: 0.56, pose: 'reach' }) }), 'translate(250,660) scale(.62)') + R.arrows(4, 520, 420, 300, 520, 6, { s: 0.5 }) + R.motes(6, [120, 340, 540, 480], 8, [C.gold]));
    P.note(330, 330, 'The old debt', 'In a war of gods and asuras she drove the wounded king from the field. He promised two boons; she kept them.');
    P.bg(R.lampHang(1380, 80, 220, 1.6));
    put(P, 'mid', 'kaikeyi', { x: 860, y: 790, s: 1.66, face: 1, pose: ['stand', { aR: [150, 178], aL: [-16, -6] }], head: { eye: 'angry', gear: 0, hair: 'long' }, neck: 0, bangle: false, ny: -90 }, 'Hair loose, jewels off, two fingers raised.');
    P.mid(g(circ(-9, 0, 7, C.sFair) + circ(9, 0, 7, C.sFair), 'translate(986,318)') + R.ring(968, 250, 26, C.gold, 5) + R.ring(1030, 262, 26, C.gold, 5));
    put(P, 'mid', 'dasharatha', { x: 1420, y: 800, s: 1.5, face: -1, rot: 90, pose: ['lie', { aR: [120, 150], aL: [40, 80] }], head: { eye: 'closed', gear: 0 }, nx: -200, ny: 300 }, '“Take my life. Do not ask for this.”');
    P.mid(g(R.item('crown'), 'translate(1110,850) rotate(70) scale(1.4)'));
    let strew = ''; const f = R.rng(9); for (let i = 0; i < 16; i++) strew += f() < 0.5 ? R.ring(f.r(560, 1100), f.r(800, 880), f.r(8, 16), C.gold, 4) : circ(f.r(560, 1100), f.r(800, 880), f.r(4, 7), f.pick([C.red, C.white, C.gold]));
    P.mid(strew); P.note(700, 800, 'Her ornaments', 'Thrown off, like planets scattered at dawn.');
    P.fx.tint = [C.pale, 0.3]; P.glow(1380, 330, 230, C.saffron, 0.6).glow(1000, 260, 90, C.gold, 0.5);
  });

  R.add({ n: 22, slug: 'no-change-in-his-face', kanda: K, ref: 'Ayodhya 16', title: 'No change in his face',
    text: 'Summoned on the morning of his consecration, Rama finds his father silent and withered and hears the sentence from Kaikeyi instead. He does not flinch. “So be it. I will go to the forest in matted hair and bark, to keep the king’s promise. I have no wish to live for wealth; know me to be like the sages, devoted to dharma alone.” Those who watch see no change in his face.' }, (P) => {
    R.sky(P, { time: 'gold', seed: 4, bands: 4, motes: 0 });
    P.sky(rect(800, -80, 900, 1100, C.ink) + R.band(300, 60, 900, C.plum, { x0: 800, h: 90 }) + R.band(520, 50, 800, C.navy, { x0: 800, h: 70 }));
    P.bg(R.arcade(-80, W + 80, 90, 760, [[380, 520, 600, 9], [1250, 420, 500, 7]], { fill: pat('flower', C.crimson, C.red, 1.3), border: C.gold, trim: C.cream }) + R.frieze(0, 94, C.cream, C.red));
    P.bg(R.ground(756, C.straw, { stripes: 2, tufts: 0, amp: 3, c2: C.mustard, c3: C.cream }));
    P.sky(R.throne(300, 720, 1.05, { col: C.red }) + g(R.item('umbrella'), 'translate(300,700) scale(1.5)') + [0, 1, 2, 3].map((i) => g(R.item('pot', { col: C.gold }), `translate(${470 + i * 44},${700 - (i % 2) * 20}) scale(1.4)`)).join(''));
    P.note(300, 250, 'Everything made ready', 'The white umbrella, the golden pots of water from every river, the empty lion throne.');
    P.sky(R.sil(R.grove(7, 1040, 1480, 730, 4, { kinds: ['sal', 'bare', 'tier'], s0: 1, s1: 1.3 }), C.forest, 0.9));
    put(P, 'mid', 'dasharatha', { x: 1440, y: 800, s: 1.14, face: -1, pose: 'sitGrief', head: { eye: 'closed' } }, 'He says only “Rama” and cannot look at him.');
    put(P, 'mid', 'kaikeyi', { x: 1180, y: 800, s: 1.3, face: 1, pose: ['point', { aR: [100, 96] }], head: { eye: 'angry' } }, 'She speaks for the king, and points the way.');
    put(P, 'mid', 'rama', { x: 700, y: 1010, s: 2.5, pose: 'namaste', head: { eye: 'soft', mouth: 'smile', halo: 0 }, ny: 220 }, 'Losing a kingdom dims him no more than night dims the moon.');
    put(P, 'mid', 'lakshmana', { x: 180, y: 820, s: 1.1, pose: ['stand', { aR: [40, 120] }], head: { eye: 'angry' }, hold: { L: { k: 'bow', len: 84, rot: -8 } } }, 'He follows a step behind, eyes full.');
    P.glow(380, 400, 300, C.cream, 0.4);
  });

  R.add({ n: 23, slug: 'where-you-are-is-heaven', kanda: K, ref: 'Ayodhya 23–27', title: '“With you it is heaven”',
    text: 'Rama tells Sita to stay and serve his mothers. He lists the forest’s terrors: lions, thorns, snakes that move like rivers, hunger, the wind at night. She answers, first in love and then in anger: “A wife shares her husband’s fate. With you it is heaven; without you it is hell. I will walk ahead and crush the thorns.” He yields: “I did not know your whole heart.”' }, (P) => {
    R.sky(P, { time: 'deep', seed: 7, bands: 5, motes: 0, h: 800 });
    P.sky(path(`M800,-80 H${W + 80} V${H + 80} H800 Z`, C.peach) + R.band(240, 50, 700, C.rose, { x0: 800, h: 80 }) + R.band(470, 40, 600, C.straw, { x0: 800, h: 70 }));
    P.bg(R.grove(5, -40, 720, 760, 5, { kinds: ['bare', 'sal', 'bare'], cols: [C.ink, C.plum, C.forest], s0: 1.1, s1: 1.5 }) + R.snake(420, 640, 1.5, { col: C.plum, col2: C.magenta }) + R.lion(200, 760, 1.2));
    P.bg(R.sil(R.crowd({ x0: 60, x1: 300, y: 430, n: 2, s: 0.9, kinds: ['rakshasa'], poses: ['strike'], face: 1, seed: 2 }), C.maroon, 0.8));
    P.bg(R.grove(9, 880, W + 40, 760, 5, { kinds: ['bloom', 'round', 'tier', 'plantain'], cols: [C.leaf, C.green, C.lime], s0: 1, s1: 1.4 }) + R.deer(1350, 770, 1.3, { flip: -1 }) + R.peacock(1140, 770, 0.9, { flip: -1 }) + R.parrots(4, [900, 120, 1500, 360], 7));
    P.bg(R.ground(756, C.slate, { x1: 800, stripes: 2, tufts: 6 }));
    P.bg(path(`M800,750 H${W + 80} V${H + 80} H800 Z`, C.lime) + R.petals(3, [840, 770, 1560, 890], 18));
    P.bg(line('M800,-20 V920', C.gold, 10) + R.squig(800, 0, 800, 900, 12, 60, C.red, 4));
    put(P, 'mid', 'rama', { x: 640, y: 850, s: 1.72, pose: ['point', { aR: [118, 100], aL: [-10, 10] }], head: { halo: 0, eye: 'sad' }, hold: {}, ny: -100 }, '“The forest is all hardship. Stay.”');
    put(P, 'mid', 'sita', { x: 990, y: 850, s: 1.62, face: -1, pose: ['plead', { aR: [84, 150], aL: [40, 110] }], head: { eye: 'angry', mouth: 'open' }, ny: -90 }, '“What did my father think, giving me to a woman in a man’s body?” Then she weeps, and wins.');
    P.note(250, 300, 'What he fears for her').note(1300, 300, 'What she sees');
    P.fg(R.fronds(4, 'R', { n: 4, cols: [C.green, C.leaf] }) + R.fronds(5, 'L', { n: 4, cols: [C.ink, C.plum] }));
  });

  R.add({ n: 24, slug: 'lakshmanas-anger', kanda: K, ref: 'Ayodhya 18–20', title: 'Lakshmana’s anger',
    text: '“The king is old, besotted and in a woman’s grip. Before anyone hears of this, take the kingdom; I will stand beside you with my bow and kill whoever sides with Bharata, even our father.” Kousalya begs Rama not to leave her. Rama holds his brother’s wrist: “It is not in my power to cross my father’s word. Give up this ignoble thought. Dharma is the highest thing in the world.”' }, (P) => {
    S.court(P, { inner: 'fire', arches: [[800, 900, 620, 11]], wall: C.maroon, wall2: C.crimson, border: C.gold, fcol: C.ink, fcol2: C.red, floor: C.clay, carpet: C.navy, cw: 1200, seed: 44, top: 70 });
    P.sky(R.speed(900, 380, { seed: 3, n: 46, col: C.gold, r0: 240, w: 9 }));
    put(P, 'mid', 'kausalya', { x: 250, y: 830, s: 1.3, pose: 'sitGrief', head: { eye: 'closed' } }, '“As a cow follows her calf, I will follow you.”');
    put(P, 'mid', 'rama', { x: 720, y: 870, s: 1.8, pose: ['reach', { aR: [96, 84], aL: [-8, 6], lean: 0, both: 0, lL: [-6, -4], lR: [8, 4] }], head: { halo: 0, eye: 'soft' }, hold: {}, ny: -110 }, 'Calm as before; he has already let the kingdom go.');
    put(P, 'mid', 'lakshmana', { x: 1140, y: 870, s: 1.8, face: -1, pose: ['strike', { aR: [140, 200], aL: [60, 96] }], head: { eye: 'angry', mouth: 'open' }, hold: { R: { k: 'bow', len: 100, rot: 30, nodraw: 1 } }, ny: -110 }, 'Breathing like a snake in a hole, eyes on his bow.');
    P.fg(R.drape(-40, W + 40, 60, C.vermilion, C.gold, 5, 70) + R.streamers(6, [900, 100, 1560, 500], 12, [C.gold, C.vermilion], 6));
    P.glow(1140, 300, 220, C.vermilion, 0.3);
  });

  R.add({ n: 25, slug: 'bark', kanda: K, ref: 'Ayodhya 33–34', title: 'Bark for a princess',
    text: 'Kaikeyi herself brings the bark. Rama and Lakshmana lay aside their fine cloth and put it on. Sita, in silk, holds her piece like a doe looking at a snare and asks her husband how forest sages wear it; he ties it over her silk with his own hands. The women of the palace cry out, and Vasishtha turns on Kaikeyi: “Sita was no part of your boon.”' }, (P) => {
    S.court(P, { inner: 'rose', arches: [[800, 640, 560, 9], [210, 300, 430, 7], [1390, 300, 430, 7]], wall: C.forest, wall2: C.green, wpat: 'leafs', border: C.vermilion, fcol: C.cream, fcol2: C.teal, floor: C.sand, carpet: C.teal, seed: 52 });
    put(P, 'mid', 'dasharatha', { x: 210, y: 730, s: 0.96, pose: 'sitGrief', head: { eye: 'closed' } }, '“Shame on me,” he says, and orders her dressed in jewels for all fourteen years.');
    put(P, 'mid', 'kaikeyi', { x: 420, y: 800, s: 1.22, pose: 'offer', head: { eye: 'angry' } }, 'She holds out the bark without a tremor.');
    P.mid(g(rect(-34, -8, 68, 22, pat('bark', C.clay, C.umber, 0.8), { rx: 5, stroke: C.umber, 'stroke-width': 2 }) + rect(-30, -22, 60, 18, pat('bark', C.ochre, C.brown, 0.8), { rx: 5, stroke: C.umber, 'stroke-width': 2 }), 'translate(520,640)'));
    put(P, 'mid', 'sita', { x: 790, y: 810, s: 1.5, pose: ['offer', { aR: [50, 96], aL: [36, 100] }], head: { eye: 'sad' }, ny: -60 }, 'She has never touched bark in her life.');
    P.mid(path('M750,560 C790,540 850,560 866,600 L850,700 C800,690 770,640 750,560 Z', pat('bark', C.ochre, C.brown, 0.9), { stroke: C.umber, 'stroke-width': 2 }));
    put(P, 'mid', 'ramaX', mix(BARK, { x: 1000, y: 810, s: 1.56, face: -1, pose: ['reach', { aR: [96, 70], aL: [84, 60], lean: 6 }], head: { eye: 'soft' }, ny: -60 }), 'He fastens the bark over her silk himself.');
    put(P, 'mid', 'vasishtha', { x: 1300, y: 806, s: 1.2, face: -1, pose: 'point', head: { eye: 'angry', mouth: 'open' } }, '“You go beyond all bounds, disgrace of your line.”');
    put(P, 'mid', 'lakshmanaX', mix(BARK, { x: 1440, y: 790, s: 1.06, face: -1, pose: 'stand', hold: { R: { k: 'bow', len: 84, rot: 6 } } }));
    P.fg(R.crowd({ x0: 80, x1: 1520, y: 1040, n: 11, s: 0.9, kinds: ['woman', 'girl', 'woman'], poses: ['grief', 'plead', 'armsUp'], eye: 'sad', seed: 15 }));
  });

  R.add({ n: 26, slug: 'leaving-ayodhya', kanda: K, ref: 'Ayodhya 35–36', title: 'Leaving Ayodhya',
    text: 'Sumantra brings the chariot. Sita mounts first, then the brothers with their bows, swords and armour. The whole city runs after them, hanging on the sides: “Hold the horses. Let us see his face.” The old king stumbles out on foot with Kousalya, crying “Stop!” while Rama says “Drive on.” The dust the people’s tears had laid rises again behind the wheels.' }, (P) => {
    R.sky(P, { time: 'dusk', seed: 26, bands: 7, motes: 12, disc: [1400, 230, 76, C.cream, C.gold] });
    P.sky(R.city(12, -60, 760, 640, { n: 5, s: 1.3 }) + R.palace(260, 640, 420, 420, { tiers: 3, domes: 3, wall: C.rose, trim: C.crimson, roof: C.gold, ds: 1 }));
    P.bg(R.gate(520, 720, 0.9, { col: C.clay, dark: C.navy }) + R.ground(712, C.sand, { stripes: 3, tufts: 0, c2: C.tan, c3: C.cream }) + R.tree('palm', 1560, 716, 1.2) + R.tree('round', 1330, 712, 0.8) + R.tree('tier', 1220, 712, 0.7));
    P.bg(R.smoke(700, 720, 1.5, C.cream, 2, 3) + R.smoke(900, 740, 1.2, C.bone, 5, 3));
    put(P, 'mid', 'kausalya', { x: 470, y: 800, s: 1.04, pose: ['run', { aR: [80, 80], aL: [70, 86], both: 1 }], head: { eye: 'sad', mouth: 'open' } }, 'She runs like a cow after her tethered calf.');
    put(P, 'mid', 'dasharatha', { x: 640, y: 806, s: 1.14, pose: ['reach', { lean: 30, lL: [-40, -70], lR: [50, 30] }], head: { eye: 'sad', mouth: 'open', gear: 0 } }, '“As long as I can see the dust of his chariot.” He watches till it is gone, then falls.');
    const riders = F('sumantra', { x: 62, y: -78, s: 0.6, pose: ['reach', { lean: 4 }] }) + F('lakshmanaX', mix(BARK, { x: -58, y: -78, s: 0.62, pose: 'stand', hold: { R: { k: 'bow', len: 70, rot: 4 } } })) + F('sitaX', { x: -18, y: -78, s: 0.58, face: -1, pose: 'grief' }) + F('ramaX', mix(BARK, { x: 22, y: -78, s: 0.66, face: -1, pose: 'namaste', head: { eye: 'sad' } }));
    P.mid(R.chariot(1060, 812, 1.36, { gallop: 1, team: 3, riders, col: C.crimson, flag: C.gold }));
    P.note(1090, 560, 'Rama', 'He joins his palms to the people and cannot bear to look at his parents.').note(1034, 590, 'Sita').note(980, 560, 'Lakshmana').note(1150, 570, 'Sumantra', 'The king’s charioteer, told “Stop” and “Drive” in the same breath.');
    P.fg(R.crowd({ x0: 40, x1: 900, y: 990, n: 10, s: 0.92, kinds: ['man', 'woman', 'girl', 'man', 'soldier'], poses: ['reach', 'run', 'plead', 'grief'], face: 1, eye: 'sad', seed: 27, jy: 20 }) + R.crowd({ x0: 1020, x1: 1560, y: 1020, n: 5, s: 0.9, kinds: ['man', 'woman'], poses: ['reach', 'armsUp'], face: 1, eye: 'sad', seed: 9 }));
    P.fx.tint = [C.peach, 0.18]; P.glow(1400, 230, 220, C.gold, 0.4).rays(1400, 230, 0.45, C.straw);
  });

  R.add({ n: 27, slug: 'the-night-on-the-tamasa', kanda: K, ref: 'Ayodhya 40–41', title: 'The night on the Tamasa',
    text: 'The townspeople will not turn back; old brahmanas with heads white as swans walk behind the chariot. They all camp on the bank of the Tamasa. Rama drinks only water. Before dawn, while the people sleep, he wakes Sumantra: they drive north first to confuse the trail, then double back. The citizens wake to wheel-ruts that lead nowhere.' }, (P) => {
    R.sky(P, { time: 'night', seed: 40, bands: 6, stars: 28, motes: 6, moon: [300, 170, 60, 1] });
    P.sky(R.hills(3, 560, 5, [C.indigo, C.navy, C.blue], { h0: 100, h1: 220 }));
    P.bg(R.grove(6, -40, W + 40, 540, 9, { kinds: ['tier', 'round', 'sal'], cols: [C.forest, C.teal, C.navy], s0: 0.7, s1: 1 }));
    R.water(P, 'bg', 540, 700, { seed: 8, bands: 4, curls: 8, ticks: 16, col: C.indigo, c2: C.blue, c3: C.navy });
    P.bg(R.ground(690, C.forest, { stripes: 3, tufts: 20, c2: C.navy, c3: C.teal }));
    const riders = F('sumantra', { x: 62, y: -78, s: 0.6, pose: 'reach' }) + F('lakshmanaX', mix(BARK, { x: -56, y: -78, s: 0.62 })) + F('sitaX', { x: -14, y: -78, s: 0.58 }) + F('ramaX', mix(BARK, { x: 26, y: -78, s: 0.66, face: -1, pose: ['point', { aR: [96, 90] }] }));
    P.mid(R.chariot(1150, 640, 0.86, { team: 2, riders, col: C.crimson }) + line('M1050,650 C900,690 760,640 600,700 M1060,662 C900,706 770,660 610,716', C.cream, 3, { 'stroke-dasharray': '10 12', opacity: 0.6 }));
    P.note(1160, 400, 'Rama', '“They would give their lives sooner than leave us. While they sleep, let us go.”');
    let sl = ''; const f = R.rng(14); for (let i = 0; i < 9; i++) { const x = 120 + i * 168 + f.r(-20, 20), y = 800 + (i % 3) * 36, k = f.pick(['man', 'woman', 'sage', 'man', 'girl']); sl += F(k, { x, y, s: 0.72, rot: i % 2 ? -90 : 90, face: i % 2 ? 1 : -1, pose: 'lie', head: { eye: 'closed' }, args: k === 'sage' ? [] : [f.pick([C.teal, C.plum, C.olive, C.crimson]), f.pick([C.cream, C.rose]), f.pick([C.sTan, C.sBrown, C.sWheat])] }); }
    P.fg(sl + R.tree('round', 60, 930, 1.6, { c: C.forest }) + R.tree('tier', 1540, 940, 1.5, { c: C.teal }));
    P.note(520, 760, 'The people of Ayodhya', 'Asleep under the trees, worn out with grief.');
    P.fx.tint = [C.pale, 0.34]; P.glow(300, 170, 150, C.cream, 0.5);
  });

  R.add({ n: 28, slug: 'guha-keeps-watch', kanda: K, ref: 'Ayodhya 44–45', title: 'Guha keeps watch',
    text: 'At Shringaverapura on the Ganga, Guha, king of the Nishadas and Rama’s friend, comes with food and bedding. Rama embraces him but takes only water, and fodder for his father’s horses. He and Sita sleep on the ground under an ingudi tree. Lakshmana will not lie down. All night he and Guha stand with their bows, talking of the prince who should be on a palace bed.' }, (P) => {
    R.sky(P, { time: 'night', seed: 44, bands: 5, stars: 22, motes: 8 });
    R.water(P, 'bg', 430, 640, { seed: 2, bands: 5, curls: 9, col: C.indigo, c2: C.blue, c3: C.navy });
    P.bg(R.boat(1250, 560, 0.7, { col: C.umber }) + R.boat(1420, 600, 0.5, { col: C.brown, flip: -1 }));
    P.bg(R.ground(630, C.forest, { stripes: 3, tufts: 18, c2: C.navy, c3: C.moss }) + R.tree('banyan', 560, 700, 2.1, { c: C.forest, c2: C.teal }));
    P.mid(ell(560, 842, 300, 34, C.olive) + rect(270, 820, 580, 16, pat('thatch', C.olive, C.lime, 1), { rx: 8 }));
    put(P, 'mid', 'sitaX', { x: 760, y: 792, s: 1, rot: 90, face: -1, pose: 'lie', head: { eye: 'closed' }, nx: -100, ny: 240 });
    put(P, 'mid', 'ramaX', mix(BARK, { x: 410, y: 800, s: 1.16, rot: -90, pose: 'lie', head: { eye: 'closed' }, nx: 110, ny: 110 }), 'Asleep on grass, his arm for a pillow.');
    put(P, 'mid', 'lakshmanaX', mix(BARK, { x: 1010, y: 820, s: 1.3, face: -1, pose: 'stand', hold: { R: { k: 'bow', len: 96, rot: -6 } } }), '“How can I sleep while he lies on the ground?”');
    put(P, 'mid', 'guha', { x: 1210, y: 826, s: 1.26, face: -1, pose: ['stand', { aR: [36, 100] }], hold: { L: { k: 'bow', len: 90, rot: 8 } } }, '“No one on earth is dearer to me than Rama. I swear it.”');
    P.mid(F('hunter', { x: 1420, y: 830, s: 1.04, face: -1, hold: { R: { k: 'torch', seed: 3 } }, pose: ['stand', { aR: [40, 110] }] }) + F('hunter', { x: 120, y: 836, s: 1.04, hold: { R: { k: 'torch', seed: 5 } }, pose: ['stand', { aR: [40, 110] }] }) + R.horse(1500, 700, 0.6, { flip: -1 }));
    P.fg(R.tree('reed', 40, 910, 1.4) + R.tree('reed', 1560, 920, 1.5));
    P.fx.tint = [C.pale, 0.36]; P.fire(1376, 660, 70, 0.9).fire(164, 664, 70, 0.9).glow(1376, 640, 150, C.saffron, 0.5).glow(164, 644, 150, C.saffron, 0.5);
  });

  R.add({ n: 29, slug: 'crossing-the-ganga', kanda: K, ref: 'Ayodhya 46', title: 'Crossing the Ganga',
    text: 'At daybreak the brothers ask for the milky sap of a banyan and twist their hair into the matted locks of ascetics. Sumantra begs to come; Rama sends him back to comfort the king. In midstream Sita joins her palms: “Goddess Ganga, bring him home after fourteen years and I will worship you with a hundred thousand cows.” On the far bank they walk in file, Lakshmana ahead, Sita between.' }, (P) => {
    R.sky(P, { time: 'dawn', seed: 46, bands: 5, motes: 10, h: 300, sun: [1250, 120, 54, C.white, 2.6] });
    P.sky(R.grove(3, 700, W + 60, 250, 8, { kinds: ['tier', 'round', 'palm'], s0: 0.5, s1: 0.8 }));
    R.water(P, 'bg', 240, H, { seed: 16, amp: 30, wl: 620, bands: 12, curls: 26, ticks: 50, col: C.azure, c2: C.pale, c3: C.blue });
    P.bg(path('M-80,300 C200,300 420,420 440,560 C460,720 300,860 -80,960 Z', C.sand) + path('M-80,330 C170,330 380,440 400,560 C420,700 270,830 -80,930 Z', pat('dots', C.paper, C.sand, 1.5)));
    P.bg(g(R.chariot(0, 0, 1, { team: 2, canopy: false, col: C.crimson }), 'translate(90,520) scale(.6)') + R.tree('banyan', 150, 380, 0.8));
    put(P, 'mid', 'sumantra', { x: 300, y: 700, s: 1.02, pose: 'grief', head: { eye: 'closed' } }, 'Sent home with an empty chariot; the horses weep as they turn.');
    put(P, 'mid', 'guha', { x: 180, y: 760, s: 1, pose: 'namaste' });
    const riders = F('hunter', { x: -170, y: -44, s: 0.7, pose: ['drag', { lean: 20 }], hold: { R: { k: 'staff', rot: 30 } } }) + F('lakshmanaX', { x: -70, y: -44, s: 0.8, pose: 'sit' }) + F('sitaX', { x: 20, y: -44, s: 0.82, pose: 'kneelNamaste', head: { eye: 'closed' } }) + F('ramaX', { x: 110, y: -44, s: 0.9, face: -1, pose: 'sit', head: { eye: 'soft' } });
    P.mid(R.boat(900, 640, 1.5, { riders, col: C.brown }));
    P.note(920, 440, 'Sita', 'Her prayer to the river, with palms joined, in midstream.').note(1066, 420, 'Rama').note(790, 440, 'Lakshmana');
    P.mid(R.fish(620, 800, 1, C.orange, C.gold, 8) + R.fish(1300, 760, 1.2, C.leaf, C.lime, -10, -1) + R.swan(1380, 480, 0.9) + R.swan(1450, 520, 0.7) + R.lotusPad(560, 420, 0.8) + R.lotusPad(1180, 380, 0.7, C.white));
    P.fg(R.makara(1500, 900, 1, { flip: -1, rot: 6 }) + R.motes(8, [500, 700, 1300, 880], 8, [C.white], { min: 14, max: 30 }));
    P.rays(1250, 120, 0.5, C.cream);
  });

  R.add({ n: 30, slug: 'two-rivers', kanda: K, ref: 'Ayodhya 48–49', title: 'Where two rivers meet',
    text: 'Smoke rising where Ganga meets Yamuna tells them they have reached Prayaga and the hermitage of Bharadvaja. The sage asks them to stay; Rama fears the townsfolk would find him so near, and asks for a lonelier place. “Ten krosha on: Chitrakuta.” The brothers lash logs and bamboo into a raft, lay a seat of reeds for Sita, and cross the dark Yamuna; she bows to the great fig tree on the far bank.' }, (P) => {
    R.sky(P, { time: 'paper', seed: 48, bands: 3, motes: 8 });
    const A = [[-80, 150], [300, 200], [620, 330], [840, 470]], B = [[-80, 760], [260, 700], [600, 600], [840, 470]], D = [[840, 470], [1100, 430], [1380, 520], [1700, 480]];
    const riv = (pts, w, c1, c2) => line(R.smooth(pts), C.navy, w + 20, { 'stroke-linecap': 'butt', transform: 'translate(0,8)' }) + line(R.smooth(pts), c1, w, { 'stroke-linecap': 'butt' }) + line(R.smooth(pts), c2, w * 0.36, { 'stroke-dasharray': '70 50', 'stroke-linecap': 'butt', opacity: 0.8 });
    P.bg(riv(D, 250, C.blue, C.azure) + riv(A, 170, C.pale, C.white) + riv(B, 190, C.indigo, C.blue));
    P.mask(line(R.smooth(D), '#ff0000', 250, { 'stroke-linecap': 'butt' }) + line(R.smooth(A), '#ff0000', 170, { 'stroke-linecap': 'butt' }) + line(R.smooth(B), '#ff0000', 190, { 'stroke-linecap': 'butt' }));
    P.bg(R.motes(5, [0, 130, 800, 300], 7, [C.azure], { min: 12, max: 26 }) + R.motes(6, [0, 600, 800, 800], 8, [C.pale], { min: 12, max: 26 }) + R.motes(7, [880, 400, 1600, 560], 9, [C.white], { min: 12, max: 26 }));
    P.note(250, 140, 'Ganga', 'Pale and quick.').note(250, 650, 'Yamuna', 'Dark and deep.');
    P.bg(R.grove(4, 120, 600, 480, 4, { kinds: ['tier', 'round', 'bloom'], s0: 0.7, s1: 0.95 }) + R.hut(470, 470, 0.8) + R.hut(360, 450, 0.6) + R.altar(580, 474, 0.5, 3) + R.smoke(580, 420, 0.8, C.ash, 4, 4));
    P.mid(F('sage', { x: 660, y: 470, s: 0.62, pose: 'bless', head: { haircol: C.ash, beardcol: C.ash } })); P.note(660, 310, 'Bharadvaja', 'He points them to Chitrakuta, where the langurs play.');
    const raft = rect(-150, -14, 300, 26, pat('stripes', C.tan, C.brown, 1.6), { rx: 8, stroke: C.umber, 'stroke-width': 2 }) + line('M-150,-4 H150', C.lime, 4, { 'stroke-dasharray': '8 12' });
    P.mid(g(F('lakshmanaX', { x: -100, y: -12, s: 0.78, pose: ['drag', { lean: 16 }], hold: { R: { k: 'staff', rot: 26 } } }) + F('sitaX', { x: 0, y: -12, s: 0.78, pose: 'sitNamaste' }) + F('ramaX', { x: 96, y: -12, s: 0.84, pose: ['stand', { aR: [50, 100] }], hold: { L: { k: 'bow', len: 78, rot: -6 } } }) + raft, 'translate(450,720) rotate(-12)'));
    P.note(450, 500, 'The raft', 'Dry logs, bamboo and sweet-smelling reeds, built in an hour.');
    P.bg(R.tree('banyan', 920, 800, 1.3, { c: C.forest }) + R.peak(1380, 330, 380, 240, C.green, { c2: C.lime }) + R.peak(1230, 330, 240, 150, C.leaf, { c2: C.lime }) + R.grove(8, 1100, 1600, 340, 5, { kinds: ['bloom', 'tier'], s0: 0.5, s1: 0.7 }));
    P.note(920, 520, 'Shyama, the fig tree', 'Sita asks its blessing to keep her vow.').note(1380, 80, 'Chitrakuta');
    P.fg(R.fish(1180, 480, 0.7, C.orange, C.gold, -6) + R.fish(200, 730, 0.6, C.leaf, C.lime, 12) + R.swan(1420, 500, 0.7));
  });

  R.add({ n: 31, slug: 'chitrakuta', kanda: K, ref: 'Ayodhya 50, 88–89', title: 'Chitrakuta: “I do not miss the city”',
    text: 'Rama shows Sita the mountain, its veins of mineral red and silver, its mango and jambu and flowering asana, kinnaras at play in the caves; then the Mandakini with its swans and sandbanks. “Bathing in this river thrice a day, eating honey and roots, with you beside me and Lakshmana at hand, I do not long for Ayodhya or the kingdom. Think of the mountain as the city and the river as the Sarayu.”' }, (P) => {
    R.sky(P, { time: 'rose', seed: 50, bands: 6, motes: 20, disc: [1300, 240, 90, C.cream, C.gold] });
    P.sky(R.peak(420, 760, 900, 620, C.sea, { c2: C.aqua, lean: 40, step: 0.12 }) + R.peak(1050, 760, 700, 430, C.teal, { c2: C.sea, lean: -30, step: 0.14 }) + R.peak(100, 760, 500, 380, C.green, { c2: C.lime }));
    P.sky(line('M520,250 C560,380 500,500 560,640', C.white, 26) + line('M520,250 C560,380 500,500 560,640', C.pale, 10) + R.motes(2, [480, 600, 640, 690], 6, [C.white], { min: 12, max: 24 }));
    P.bg(R.grove(4, -60, W + 60, 690, 8, { kinds: ['bloom', 'round', 'tier', 'bloom'], cols: [C.leaf, C.green, C.forest], s0: 0.9, s1: 1.3, fcols: [C.white, C.pink, C.vermilion] }));
    R.water(P, 'bg', 700, H, { seed: 5, bands: 5, curls: 10, ticks: 20, col: C.sea, c2: C.aqua, c3: C.teal });
    P.bg(R.hut(250, 706, 0.9) + F('lakshmanaX', { x: 380, y: 706, s: 0.6, pose: ['carry', {}], hold: { R: { k: 'staff', rot: 70 } } }));
    P.note(380, 560, 'Lakshmana', 'He builds the leaf-thatched hut and offers the first oblation.');
    P.mid(path('M520,860 C560,790 1120,780 1180,860 C1100,900 600,900 520,860 Z', pat('stone', C.sand, C.cream, 1.2), { stroke: C.tan, 'stroke-width': 3 }));
    put(P, 'mid', 'ramaX', { x: 730, y: 836, s: 1.86, pose: ['throne', { aR: { t: [84, -128], bend: -1 }, aL: [-16, 30] }], head: { eye: 'soft', mouth: 'smile' }, hold: { R: { k: 'flower', col: C.vermilion, s: 1.5 } }, ny: -60 }, 'He tucks a forest flower into her hair.');
    put(P, 'mid', 'sitaX', { x: 1000, y: 836, s: 1.74, face: -1, pose: ['throne', { aR: [50, 120], aL: [-14, 40], head: 8 }], head: { eye: 'bliss', mouth: 'smile' }, ny: -50 }, 'Happier here, she says, than on any palace roof.');
    P.mid(R.swan(1300, 800, 1.1, { flip: -1 }) + R.swan(1400, 826, 1) + R.deer(1380, 720, 0.9, { flip: -1, look: -1 }) + R.deer(1470, 716, 0.7, { flip: -1 }));
    P.note(1350, 690, 'Mandakini', 'Swans and cranes on the sandbanks; the trees shed flowers into the current.');
    P.fg(R.lotusPad(180, 850, 1.5) + R.lotusPad(420, 884, 1.1, C.white) + R.lotusPad(1500, 880, 1.3) + R.petals(9, [300, 100, 1500, 760], 36, [C.white, C.pink, C.vermilion]) + R.fronds(5, 'T', { n: 5, s: 0.8, cols: [C.leaf, C.green] }) + R.parrots(4, [700, 120, 1200, 300], 5));
    P.glow(1300, 240, 240, C.cream, 0.5).glow(870, 480, 240, C.rose, 0.3).rays(1300, 240, 0.5, C.cream);
  });

  R.add({ n: 32, slug: 'the-arrow-in-the-dark', kanda: K, ref: 'Ayodhya 57–58', title: 'The arrow in the dark',
    text: 'On the sixth night after Rama left, Dasharatha tells Kousalya what he has hidden all his life. As a young prince proud of shooting by sound, he heard a gurgle on the Sarayu’s bank at night and loosed an arrow at what he took for an elephant drinking. It was a boy ascetic filling a pot for his blind parents. The old father’s curse: “You too will die grieving for a son.”' }, (P) => {
    R.sky(P, { time: 'night', seed: 57, bands: 6, stars: 20, motes: 4, moon: [1380, 130, 50, 1] });
    P.bg(R.grove(5, -40, W + 40, 560, 9, { kinds: ['sal', 'tier', 'round'], cols: [C.navy, C.forest, C.indigo], s0: 0.9, s1: 1.4 }));
    R.water(P, 'bg', 600, H, { seed: 6, bands: 6, curls: 9, ticks: 20, col: C.indigo, c2: C.blue, c3: C.navy });
    P.bg(path('M-80,560 C400,540 900,600 1700,560 L1700,700 C1100,760 500,700 -80,740 Z', C.forest) + R.hut(1380, 640, 0.8, { roof: C.slate, wall: C.smoke }));
    P.mid(F('sage', { x: 1260, y: 660, s: 0.7, face: -1, pose: 'sit', head: { eye: 'closed', haircol: C.ash, beardcol: C.ash } }) + F('woman', { x: 1480, y: 660, s: 0.64, face: -1, pose: 'sit', args: [C.ash, C.slate, C.sTan], head: { eye: 'closed', old: 1 } }));
    P.note(1370, 480, 'The blind parents', 'Waiting for water, listening for their son’s step.');
    P.mid(F('sageBald', { x: 760, y: 730, s: 1.12, rot: 76, face: -1, pose: 'fall', head: { eye: 'closed', old: 0, tilak: 0 } }) + g(R.item('arrow', { len: 120 }), 'translate(720,640) rotate(150)') + g(R.item('pot'), 'translate(880,740) rotate(80) scale(1.5)') + R.ring(900, 760, 30, C.pale, 3) + R.ring(900, 760, 54, C.pale, 2));
    P.note(780, 560, 'The boy', '“Whom have I wronged, living on roots in the forest?”');
    put(P, 'mid', 'bharata', { x: 300, y: 770, s: 1.36, label: 'Dasharatha, young', skin: C.sWheat, pose: 'recoil', head: { eye: 'fear', mouth: 'open' }, hold: { L: { k: 'bow', len: 96, rot: -20 } } }, 'He had come to the river to hunt by sound in the rains.');
    P.fg(path('M-80,-80 H420 C360,200 380,520 300,980 H-80 Z', C.ink, { opacity: 0.001 }) + R.tree('reed', 520, 910, 1.6) + R.tree('reed', 1100, 920, 1.5) + R.fronds(3, 'L', { n: 4, cols: [C.navy, C.forest] }));
    P.fx.tint = [C.pale, 0.38]; P.glow(1380, 130, 130, C.cream, 0.5).glow(760, 700, 150, C.pale, 0.3);
  });

  R.add({ n: 33, slug: 'the-king-is-dead', kanda: K, ref: 'Ayodhya 58–59', title: '“Rama… Kousalya… I cannot see”',
    text: 'Past midnight, with the two queens beside him, the king’s breath stops on his son’s name. At dawn the bards come as always to sing him awake, and the women who touch his bed find it cold. The palace that had been all drums and song the week before fills with one long cry; the body is laid in a vat of oil until Bharata can come.' }, (P) => {
    S.court(P, { inner: 'dawn', arches: [[1300, 380, 480, 7], [300, 380, 480, 7]], wall: C.slate, wall2: C.smoke, wpat: 'rings', border: C.ash, trim: C.bone, fcol: C.smoke, fcol2: C.ash, floor: C.ash, carpet: false, seed: 58, top: 80 });
    P.sky(R.crowd({ x0: 1180, x1: 1420, y: 700, n: 3, s: 0.62, kinds: ['man'], poses: ['cheer', 'namaste'], face: -1, seed: 2 }) + g(R.item('veena'), 'translate(1260,600) rotate(30) scale(.7)') + R.parrots(3, [1160, 380, 1440, 520], 4));
    P.note(1300, 430, 'The bards at dawn', 'They sing his praises to wake him, as on every other morning.');
    P.sky(g(R.item('umbrella', { col: C.white }), 'translate(300,700) scale(1.3)'));
    P.mid(R.bed(800, 800, 2, C.slate));
    put(P, 'mid', 'dasharatha', { x: 520, y: 606, s: 1.5, rot: -90, pose: 'lie', head: { eye: 'closed', gear: 0 }, cloth: { upper: 'tunic', uc: C.white, upat: 0, sleeve: C.white, lc: C.white, lpat: 0 }, nx: 330, ny: 240 }, 'He dies at midnight, remembering the arrow and the curse.');
    put(P, 'mid', 'kausalya', { x: 1150, y: 830, s: 1.2, face: -1, pose: 'sitGrief', head: { eye: 'closed' } }, 'Asleep at last from weeping; she wakes to this.');
    put(P, 'mid', 'sumitra', { x: 420, y: 836, s: 1.16, pose: 'sitGrief', head: { eye: 'closed' } });
    P.mid(g(R.item('crown'), 'translate(800,880) rotate(-80) scale(1.3)') + R.diya(960, 846, 2) + R.smoke(966, 800, 0.8, C.ash, 3, 4));
    P.note(960, 760, 'The lamp', 'Burnt down to smoke.');
    P.fg(R.drape(-40, W + 40, 74, C.slate, C.ash, 5, 70));
    P.fx.tint = [C.pale, 0.3]; P.glow(1300, 520, 230, C.peach, 0.5);
  });

  R.add({ n: 34, slug: 'bharata-returns', kanda: K, ref: 'Ayodhya 65–68, 72', title: 'Bharata refuses a kingdom',
    text: 'Called home from his grandfather’s city with no reason given, Bharata rides into an Ayodhya without drums, garlands or swept streets. His mother greets him as king and tells him how she arranged it. “Murderess of your husband! You have dug a hole for our whole line. I will bring my brother back and be his servant.” Shatrughna drags Manthara across the floor until Bharata stops him.' }, (P) => {
    S.court(P, { inner: 'storm', arches: [[420, 520, 560, 9]], wall: C.crimson, wall2: C.maroon, border: C.ink, trim: C.ash, fcol: C.ink, fcol2: C.slate, floor: C.clay, carpet: false, seed: 66, top: 80 });
    P.sky(R.throne(420, 720, 1.05, { col: C.slate }) + path('M330,430 Q420,380 510,430 L520,640 Q420,660 320,640 Z', C.white, { opacity: 0.9 }));
    P.note(420, 300, 'The empty throne', 'Draped in white. No one has sat on it for a fortnight.');
    put(P, 'mid', 'kaikeyi', { x: 720, y: 830, s: 1.44, pose: 'offer', head: { mouth: 'smile' }, ny: -40 }, '“The kingdom is yours, without a thorn in it.”');
    P.mid(g(R.item('crown'), 'translate(850,548) scale(1.3)'));
    put(P, 'mid', 'bharata', { x: 1130, y: 840, s: 1.78, face: -1, pose: ['recoil', { aR: [-60, -150], aL: [-90, 170] }], head: { eye: 'angry', mouth: 'open' }, ny: -110 }, 'Dark as Rama, and as fixed on what is right.');
    put(P, 'mid', 'shatrughna', { x: 1420, y: 840, s: 1.1, face: -1, pose: 'drag', head: { eye: 'angry' } });
    put(P, 'mid', 'manthara', { x: 1300, y: 850, s: 1, rot: 80, face: -1, pose: 'fall', head: { eye: 'fear', mouth: 'open' }, nx: -60, ny: 200 }, 'Decked in Kaikeyi’s gift jewels, which scatter over the floor.');
    P.fg(R.drape(600, W + 40, 76, C.ink, C.ash, 4, 80));
    P.glow(420, 420, 250, C.pale, 0.3);
  });

  R.add({ n: 35, slug: 'brothers-at-chitrakuta', kanda: K, ref: 'Ayodhya 93–97', title: 'Brothers at Chitrakuta',
    text: 'Bharata leaves the army a krosha off and climbs on foot. He sees the hut, the bows gleaming like rainbows, the altar; and Rama on the ground in black antelope skin with matted hair. He runs, stumbles, and cannot get past the word “Arya”. Rama lifts him onto his lap and asks first of all after their father. Then he hears the answer.' }, (P) => {
    S.forest(P, { seed: 93, gy: 730, far: 6, kinds: ['bloom', 'round', 'tier', 'sal'], flowers: 10, gcol: C.leaf, g2: C.green, g3: C.lime, sky: { time: 'noon', bands: 4 }, hcols: [C.sea, C.teal], nh: 3, hill: { h0: 260, h1: 420 } });
    P.sky(R.sil(R.crowd({ x0: 1040, x1: 1580, y: 520, n: 12, s: 0.28, kinds: ['soldier'], poses: ['stand'], face: -1, seed: 4 }) + R.elephant(1200, 520, 0.3, { flip: -1, howdah: 1 }) + R.elephant(1420, 524, 0.28, { flip: -1 }), C.navy, 0.5));
    for (let i = 0; i < 6; i++) P.sky(g(R.item('flag', { col: C.vermilion }), `translate(${1080 + i * 90},${470 - (i % 2) * 14}) scale(.3)`));
    P.note(1300, 380, 'The army of Ayodhya', 'Left at a distance; Lakshmana had taken it for an attack.');
    P.bg(R.hut(330, 740, 1.5) + R.altar(600, 746, 0.7, 3) + g(R.item('bow', { len: 80 }), 'translate(200,640) rotate(10)') + g(R.item('bow', { len: 80 }), 'translate(456,650) rotate(-8)'));
    put(P, 'mid', 'sitaX', { x: 300, y: 800, s: 1, pose: 'stand', head: { eye: 'sad' } });
    put(P, 'mid', 'lakshmanaX', { x: 480, y: 810, s: 1.1, pose: 'stand', hold: { R: { k: 'bow', len: 90, rot: 8 } } }, 'A moment ago he was up a sala tree, ready to fight.');
    put(P, 'mid', 'ramaX', { x: 800, y: 850, s: 1.6, pose: ['sit', { aR: [70, 60], aL: [40, 70], both: 1, lean: 14 }], head: { eye: 'sad' }, ny: -40 }, '“Where is our father, that you have come to the forest?”');
    put(P, 'mid', 'bharataX', { x: 1160, y: 856, s: 1.5, face: -1, pose: 'prostrate', head: { eye: 'closed' }, ny: 140 }, 'Thin, in bark, his throat dry: “The kingdom is yours. Come home.”');
    put(P, 'mid', 'shatrughna', { x: 1400, y: 850, s: 1.1, face: -1, pose: 'kneelNamaste', head: { gear: 0, hair: 'jata', eye: 'closed' }, cloth: { lc: C.ochre, sash: C.clay, belt: C.umber } });
    P.fire(600, 690, 70, 0.7);
  });

  R.add({ n: 36, slug: 'the-sandals-rule', kanda: K, ref: 'Ayodhya 104–107', title: 'The sandals rule',
    text: 'Rama will not break their father’s word, and Bharata will not take the throne. So Bharata sets down a pair of gold-worked sandals: “Step on these.” Rama does, and hands them back. Bharata carries them on his head to Nandigrama, sets them on the throne under the white umbrella, and for fourteen years, in bark and matted hair, reports every act of state to them first. “If you are not back the day the term ends, I will enter fire.”' }, (P) => {
    S.court(P, { inner: 'gold', arches: [[800, 860, 600, 11]], wall: C.teal, wall2: C.sea, wpat: 'rings', border: C.gold, trim: C.red, fcol: C.cream, fcol2: C.teal, floor: C.sand, carpet: C.crimson, cw: 600, seed: 104, top: 70 });
    P.sky(R.burst(800, 420, 110, { seed: 3, col: C.cream, n: 50, len: 3 }));
    P.bg(R.throne(800, 730, 1.3, { col: C.red }) + R.steps(800, 730, 360, 4, C.cream, C.red) + g(R.item('umbrella', { col: C.white }), 'translate(800,640) scale(1.9)'));
    P.mid(ell(800, 594, 80, 20, pat('diag', C.red, C.crimson), { stroke: C.gold, 'stroke-width': 3 }) + g(R.item('sandals'), 'translate(800,580) scale(2.6)'));
    P.note(800, 500, 'Rama’s sandals', 'The kingdom is held in trust by a pair of shoes.');
    put(P, 'mid', 'bharataX', { x: 480, y: 850, s: 1.4, pose: ['stand', { aR: [60, 150] }], head: { eye: 'soft' }, hold: { R: { k: 'chamara', rot: 20 } }, ny: -60 }, 'Regent, ascetic, fan-bearer to the sandals.');
    put(P, 'mid', 'shatrughna', { x: 1130, y: 850, s: 1.3, face: -1, pose: 'namaste' });
    put(P, 'mid', 'vasishtha', { x: 1330, y: 846, s: 1.14, face: -1, pose: 'bless' });
    P.mid(F('man', { x: 250, y: 850, s: 1.06, pose: 'bow', args: [C.teal, C.cream, C.sTan] }) + F('soldier', { x: 120, y: 856, s: 1.04, pose: 'namaste' }) + F('man', { x: 1480, y: 856, s: 1.04, face: -1, pose: 'bow', args: [C.plum, C.cream, C.sBrown] }));
    P.glow(800, 560, 200, C.gold, 0.5).rays(800, 420, 0.5, C.cream);
  });

  R.add({ n: 37, slug: 'anasuya', kanda: K, ref: 'Ayodhya 109–111', title: 'Anasuya’s gifts',
    text: 'Too many memories crowd Chitrakuta now, so they move south to the hermitage of Atri. His wife Anasuya, so old she trembles like a plantain in the wind, takes Sita aside, praises her for following her husband, and gives her a garland that will not fade, garments, ornaments and a salve. Sita tells her the story of her own wedding until the sun sets and the birds come home.' }, (P) => {
    S.forest(P, { seed: 109, gy: 740, far: 7, kinds: ['tier', 'round', 'plantain', 'bloom'], cols: [C.forest, C.green, C.moss], gcol: C.moss, sky: { time: 'dusk', bands: 6, motes: 12, moon: [1340, 170, 54] }, hcols: [C.plum, C.violet] });
    P.sky(R.parrots(7, [200, 80, 1200, 300], 12, C.ink));
    P.bg(R.hut(1320, 750, 1.3) + R.altar(1080, 752, 0.6, 2));
    put(P, 'bg', 'ramaX', { x: 1120, y: 760, s: 0.74, face: -1, pose: 'sitNamaste' });
    P.bg(F('sage', { x: 1230, y: 760, s: 0.74, face: -1, pose: 'sitBless', head: { haircol: C.white, beardcol: C.white, mustcol: C.white } }) + F('lakshmanaX', { x: 1010, y: 760, s: 0.72, face: -1, pose: 'sitNamaste' }));
    P.note(1230, 590, 'Atri', 'He receives Rama as a son.');
    P.mid(F('woman', { x: 520, y: 850, s: 1.72, pose: ['offer', { aR: [86, 110], aL: [70, 104], lean: 10 }], args: [C.cream, C.saffron, C.sTan], head: { old: 1, haircol: C.white, eye: 'soft', mouth: 'smile', nosering: 0 }, neck: 0 }));
    P.note(520, 380, 'Anasuya', 'Her austerities once made the Ganga flow in a ten-year drought.');
    P.mid(g(R.item('garland', { col: C.vermilion }), 'translate(700,470) scale(2.4)'));
    put(P, 'mid', 'sitaX', { x: 860, y: 856, s: 1.5, face: -1, pose: 'kneelNamaste', head: { eye: 'bliss', mouth: 'smile' }, ny: 30 }, 'That evening Rama sees her wearing the gifts and is glad.');
    P.mid(g(R.item('pot', { col: C.gold }), 'translate(330,850) scale(2)') + g(R.item('jewel'), 'translate(250,846) scale(1.5)') + rect(150, 826, 70, 26, pat('flower', C.red, C.gold, 0.8), { rx: 5 }) + rect(158, 806, 54, 22, pat('dots', C.teal, C.gold, 0.8), { rx: 5 }));
    P.fg(R.petals(8, [200, 200, 1100, 700], 20, [C.white, C.vermilion]));
    P.fx.tint = [C.peach, 0.2]; P.glow(700, 520, 200, C.gold, 0.35).fire(1080, 706, 60, 0.7);
  });
})();
