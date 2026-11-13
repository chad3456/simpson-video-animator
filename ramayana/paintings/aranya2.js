/* Aranya Kanda, part two: paintings 51-62 */
(function () {
  const R = window.R, C = R.C, W = R.W, H = R.H, F = R.F, put = R.put, pat = R.pat, S = R.S;
  const { path, line, circ, ell, g, rect } = R;
  const K = 'Aranya Kanda';
  const eye = (x, y, k, col = C.cream, pupil = C.ink, mood) => g(path('M-30,0 Q0,-24 32,-2 Q0,16 -30,0 Z', col) + circ(2, -3, 9, pupil) + line('M-34,2 Q0,-28 36,-4', C.ink, 4) + (mood ? line('M-34,-22 L34,-12', C.ink, 6) : ''), `translate(${x},${y}) scale(${k})`);

  R.add({ n: 51, slug: 'the-mendicant-at-the-door', kanda: K, ref: 'Aranya 44–45', title: 'The mendicant at the door',
    text: 'The moment Lakshmana is gone, Ravana steps out as a wandering ascetic: ochre robe, topknot, umbrella, sandals, staff and water pot. The wind drops; the leaves stop moving; the quick Godavari slows in fear. He praises her, limb by limb, in a way no holy man would. Sita, bound by the law of hospitality, offers him a seat and water for his feet, and keeps glancing at the forest path.' }, (P) => {
    S.forest(P, { seed: 344, gy: 740, far: 6, kinds: ['tier', 'round', 'bloom'], cols: [C.olive, C.moss, C.forest], gcol: C.ochre, g2: C.clay, g3: C.straw, sky: { time: 'gold', bands: 5, motes: 0 }, hcols: [C.amber, C.ochre] });
    P.bg(R.sil(g(F('ravana', { front: 1, heads: 10, arms: 9, armItems: false, pose: 'stand', cape: null }), 'translate(1130,800) scale(2.7)'), C.maroon, 0.42));
    P.note(1130, 150, 'His true shadow', 'Ten necks, twenty arms. The trees know; nothing in the forest stirs.');
    P.bg(R.hut(310, 760, 2.1));
    put(P, 'mid', 'sitaX', { x: 560, y: 850, s: 1.44, pose: ['offer', { aR: [70, 96], aL: [56, 92] }], hold: { R: { k: 'pot', s: 1.3, col: C.tan } }, head: { eye: 'wide' }, ny: -50 }, 'A guest is a guest. She tells him who she is, and whose wife.');
    P.mid(rect(700, 830, 110, 16, pat('thatch', C.olive, C.lime, 1), { rx: 6 }));
    put(P, 'mid', 'ravanaMonk', { x: 1040, y: 860, s: 1.7, face: -1, pose: ['stand', { aR: [40, 150], aL: [-20, 30] }], hold: { R: { k: 'umbrella', s: 0.62, col: C.saffron, rot: -6 }, L: { k: 'pot', s: 1.2 } }, head: { mouth: 'smile', eye: 'soft' }, ny: -100 }, 'Chanting the Veda, like a well covered with grass.');
    P.mid(line('M1160,860 V470', C.umber, 7));
    P.fg(R.fronds(3, 'R', { n: 5, cols: [C.moss, C.olive] }) + R.fronds(4, 'L', { n: 3, cols: [C.moss, C.olive] }));
    P.fx.motes = 0;
  });

  R.add({ n: 52, slug: 'ravana-revealed', kanda: K, ref: 'Aranya 46–47', title: 'Ravana throws off the disguise',
    text: '“I am Ravana, lord of Lanka, before whom gods tremble. Be my chief queen; five thousand women will serve you.” Sita answers that he is a jackal asking for a lioness, a man trying to pocket the sun. He strikes his palms together and the ascetic is gone: ten heads, twenty arms, eyes red as copper, in a robe the colour of blood, tall as a blue thundercloud over the leaf hut.' }, (P) => {
    R.sky(P, { time: 'storm', seed: 347, bands: 8, motes: 0 });
    P.sky(R.burst(1000, 300, 260, { seed: 3, col: C.vermilion, n: 70, len: 2.6, w: 12 }) + circ(1000, 300, 250, C.crimson) + R.bolt(360, -20, 420, C.white, 4) + R.bolt(1480, -30, 300, C.cream, 6));
    P.bg(R.ground(800, C.umber, { stripes: 3, tufts: 8, c2: C.ink, c3: C.clay }) + R.hut(210, 820, 1.5) + R.tree('bare', 60, 820, 1.5, { tc: C.ink }) + R.tree('bare', 1540, 810, 1.3, { tc: C.ink }));
    put(P, 'mid', 'ravana', { x: 1000, y: 1010, s: 2.5, front: 1, heads: 10, arms: 9, hs: 1.12, pose: ['stand', { aR: [60, 150], aL: [-60, -150], lL: [-12, -6], lR: [12, 6] }], head: { eye: 'angry', mouth: 'fang' }, headMoods: [{ mouth: 'fang' }, { eye: 'wide' }, { mouth: 'fang', skin: C.slate }, {}, { mouth: 'frown' }, { mouth: 'fang' }, { eye: 'wide', skin: C.slate }, {}, { mouth: 'fang' }], cloth: { lc: C.crimson, lpat: pat('rings', C.crimson, C.gold, 0.7) }, cape: C.vermilion, ny: -330 }, 'The form he hides from no one for long.');
    P.mid(path('M560,870 C600,820 700,830 740,880 C700,900 600,900 560,870 Z', C.saffron, { stroke: C.amber, 'stroke-width': 3 }) + g(R.item('umbrella', { col: C.saffron }), 'translate(720,880) rotate(100) scale(.6)'));
    P.note(650, 820, 'The cast-off robe');
    put(P, 'mid', 'sitaX', { x: 390, y: 880, s: 1.24, pose: ['point', { aR: [110, 120] }], head: { eye: 'angry', mouth: 'open' } }, '“You wish to cross the sea with a stone tied to your neck.”');
    P.fg(R.smoke(700, 900, 1.6, C.smoke, 3, 3) + R.smoke(1360, 900, 1.8, C.ink, 6, 3));
    P.fx.tint = [C.rose, 0.16]; P.glow(1000, 300, 320, C.vermilion, 0.4);
  });

  R.add({ n: 53, slug: 'the-abduction', kanda: K, ref: 'Aranya 47, 50', aside: 'Valmiki’s Ravana carries her off in a golden sky-chariot “like a vimana”, yoked to mules; the Pushpaka itself appears in paintings 80 and 100', title: 'Sita is carried into the sky',
    text: 'With his left hand he seizes her by the hair, with his right beneath the thighs, and lifts her onto the golden chariot that has come at his thought, mules braying. It climbs. “Rama! Lakshmana! Trees of Janasthana, river Godavari, deer and birds, tell Rama!” Her anklet falls like lightning; flowers shower from her hair; the lotuses droop, the sun dims, and the wind itself seems to say there is no dharma left.' }, (P) => {
    R.sky(P, { time: 'dusk', seed: 350, bands: 8, motes: 10, disc: [300, 250, 80, C.straw, C.cream] });
    P.sky(R.speed(1100, 330, { seed: 6, n: 46, col: C.cream, r0: 300, w: 6, a0: 2.2, a1: 3.6 }));
    R.water(P, 'bg', 800, H, { seed: 4, bands: 4, curls: 6 });
    P.bg(R.grove(4, -60, W + 60, 800, 10, { kinds: ['tier', 'round', 'bloom', 'sal'], cols: [C.forest, C.green, C.moss], s0: 0.9, s1: 1.3 }) + R.hut(170, 800, 0.9));
    P.bg(R.deer(700, 806, 0.8, { look: -1 }) + R.deer(800, 812, 0.7) + R.deer(1240, 810, 0.75, { flip: -1 }));
    const riders = F('ravana', { x: 20, y: -78, s: 0.92, heads: 10, face: 1, pose: ['hug', { aR: { t: [-40, -70], bend: -1 }, aL: { t: [-50, -30], bend: -1 } }], head: { eye: 'angry', mouth: 'smile' }, hs: 0.95 }) + F('sitaX', { x: -84, y: -100, s: 0.86, face: -1, rot: -24, pose: ['reach', { aR: [110, 130], aL: [96, 140], lean: 20 }], head: { eye: 'fear', mouth: 'open' } });
    P.mid(g([0, 1, 2, 3].map((i) => R.spiral(-200 + i * 150, 40 + (i % 2) * 20, 40, C.cream, 9, 1.7, i % 2 ? 1 : -1, 2)).join('') + R.chariot(0, 0, 1, { beast: 'mule', team: 2, gallop: 1, col: C.gold, flag: C.crimson, riders }), 'translate(960,560) rotate(-16) scale(1.5)'));
    P.note(1040, 70, 'Ravana', 'One hand in her hair, the other under her thighs.').note(800, 220, 'Sita', 'She calls on every tree by name.').note(1440, 300, 'Mules with pishacha faces');
    const f = R.rng(3); let trail = '';
    for (let i = 0; i < 26; i++) { const t = i / 26, x = 760 - t * 460 + f.r(-30, 30), y = 470 + t * t * 300 + f.r(-20, 20); trail += f() < 0.3 ? R.ring(x, y, f.r(5, 9), C.gold, 3) : f() < 0.5 ? circ(x, y, 4, C.red) : g(R.item('flower', { col: f.pick([C.white, C.vermilion, C.pink]) }), `translate(${x},${y}) scale(${f.r(0.6, 1.1)})`); }
    P.mid(trail + g(R.ring(0, 0, 14, C.gold, 6) + circ(0, -14, 5, C.red), 'translate(330,700)'));
    P.note(330, 660, 'Her anklet', 'Flowers, pearls and a jewelled anklet fall along the way.');
    P.fg(R.fronds(5, 'L', { n: 4 }) + R.fronds(6, 'R', { n: 3 }));
    P.glow(300, 250, 200, C.straw, 0.35);
  });

  R.add({ n: 54, slug: 'jatayu-against-ravana', kanda: K, ref: 'Aranya 48–49', title: 'Jatayu against Ravana',
    text: '“I am sixty thousand years old, Ravana, and you are young, armed, in a chariot. You will not take her while I live.” The old vulture tears the armour from him, snaps two bows, kills the mules, pulls down the charioteer, smashes the car and its royal umbrella, and rips ten arms from his left side; they grow back like snakes from an anthill. Ravana drops to the ground with Sita on his hip and draws his sword.' }, (P) => {
    R.sky(P, { time: 'night', seed: 349, bands: 0, motes: 0, base: C.navy });
    P.sky(path(`M-80,-80 H${W * 0.72} L${W * 0.3},${H + 80} H-80 Z`, C.vermilion) + path(`M${W * 0.72 - 60},-80 H${W * 0.72 + 40} L${W * 0.3 + 40},${H + 80} H${W * 0.3 - 60} Z`, C.gold) + R.band(200, 60, 800, C.crimson, { x1: 700, h: 70 }) + R.band(640, 50, 700, C.saffron, { x1: 500, h: 60 }) + R.band(260, 60, 900, C.indigo, { x0: 900, h: 90 }) + R.band(620, 50, 700, C.blue, { x0: 760, h: 70 }));
    P.sky(R.speed(800, 430, { seed: 5, n: 110, col: C.white, r0: 250, w: 11 }) + R.speed(800, 430, { seed: 8, n: 50, col: C.gold, r0: 320, w: 7 }));
    P.bg(R.impact(800, 430, 190, [C.white, C.gold, C.white], 9, 16));
    P.bg(g(R.wheel(0, 0, 60, C.gold, C.crimson), 'translate(1380,760) rotate(20)') + R.horse(1180, 880, 0.8, { long: 1, col: C.grey, mane: C.ink, cloth: false, rot: 160, gallop: 1 }) + g(R.item('bow', { len: 80 }), 'translate(980,800) rotate(70)') + g(R.item('umbrella', { col: C.white }), 'translate(1500,560) rotate(140) scale(.5)') + F('rakshasa', { x: 1440, y: 400, s: 0.6, rot: 130, pose: 'fall', args: [C.sGreen, C.ink] }));
    P.note(1380, 690, 'The chariot, in pieces');
    P.mid(R.bird(520, 400, 1.75, { col: C.clay, col2: C.gold, col3: C.cream, wings: [-84, 26], mood: 'angry', seed: 4, rot: 14 }));
    P.note(600, 110, 'Jatayu', 'King of vultures, with talons for weapons and a debt of friendship to Dasharatha.');
    put(P, 'mid', 'ravana', { x: 1170, y: 800, s: 1.7, face: -1, heads: 10, arms: 5, pose: ['strike', { aR: [150, 196], aL: { t: [-30, -40], bend: -1 } }], hold: { R: { k: 'sword', along: 1, s: 1.3 } }, head: { eye: 'angry', mouth: 'fang' }, ny: -180 }, 'Wounded, chariot gone; the sword comes out.');
    put(P, 'mid', 'sitaX', { x: 1290, y: 700, s: 0.9, rot: 30, pose: ['reach', { lean: 10 }], head: { eye: 'fear', mouth: 'open' }, ny: 60 }, 'Held on his left hip.');
    const f = R.rng(12); let fe = ''; for (let i = 0; i < 16; i++) fe += g(path('M0,0 C10,-12 10,-34 0,-46 C-10,-34 -10,-12 0,0 Z', f.pick([C.clay, C.gold, C.cream])) + line('M0,-4 V-40', C.umber, 1.5), `translate(${f.r(300, 1100)},${f.r(500, 860)}) rotate(${f.r(0, 360)}) scale(${f.r(0.7, 1.4)})`);
    P.fg(fe + rect(-80, -10, W + 160, 56, C.ink) + rect(-80, H - 46, W + 160, 56, C.ink));
    P.glow(800, 430, 260, C.cream, 0.5);
  });

  R.add({ n: 55, slug: 'jatayu-falls', kanda: K, ref: 'Aranya 49–50', title: 'Jatayu falls',
    text: 'The sword takes his wings, then his feet, then his flanks. The king of birds drops to the forest floor like a great tree, with a little life left in him. Sita runs to him and holds him as she would her own kin, crying. Ravana comes for her again; she clings to the trunks of trees. He takes her by the hair and rises, and Brahma, watching, says only: “It is done.”' }, (P) => {
    S.forest(P, { seed: 351, gy: 720, far: 7, kinds: ['sal', 'tier', 'round'], cols: [C.forest, C.moss, C.teal], gcol: C.moss, g2: C.forest, g3: C.olive, sky: { time: 'dusk', bands: 7, motes: 6 }, hcols: [C.plum, C.maroon] });
    P.sky(R.sil(g(F('ravana', { heads: 10, arms: 4, armItems: false, pose: ['reach', { lean: 30 }], cape: null }), 'translate(1260,640) scale(-3,3)'), C.ink, 0.5));
    P.note(1100, 180, 'He returns for her');
    const wing = (x, y, rot, k) => g([0, 1, 2, 3, 4, 5, 6].map((i) => g(path('M0,0 C26,-70 26,-180 0,-240 C-26,-180 -26,-70 0,0 Z', i % 2 ? C.gold : C.clay, { stroke: C.umber, 'stroke-width': 1.5 }), `rotate(${-50 + i * 16})`)).join('') + circ(0, 0, 34, C.crimson), `translate(${x},${y}) rotate(${rot}) scale(${k})`);
    P.mid(wing(330, 850, -70, 1) + wing(1330, 860, 80, 0.9));
    P.note(330, 700, 'A severed wing');
    P.mid(R.bird(760, 730, 1.5, { col: C.clay, col2: C.gold, col3: C.cream, cut: 'both', wings: [-100, 110], rot: 24, seed: 6 }) + line('M930,560 Q960,548 992,560', C.ink, 6));
    put(P, 'mid', 'sitaX', { x: 1120, y: 850, s: 1.44, face: -1, pose: ['kneel', { aR: [96, 80], aL: [80, 96], both: 1, lean: 22, head: 10 }], head: { eye: 'closed' }, ny: 10 }, '“He came to save me and lies here killed for my sake.”');
    P.note(820, 420, 'Jatayu', 'He holds on to life until Rama comes, so that someone can say which way she went.');
    const f = R.rng(5); let fe = ''; for (let i = 0; i < 22; i++) fe += g(path('M0,0 C10,-12 10,-34 0,-46 C-10,-34 -10,-12 0,0 Z', f.pick([C.clay, C.gold, C.cream])), `translate(${f.r(100, 1500)},${f.r(200, 840)}) rotate(${f.r(0, 360)}) scale(${f.r(0.6, 1.2)})`);
    P.fg(fe + R.fronds(2, 'L', { n: 4, cols: [C.forest, C.ink] }));
    P.fx.tint = [C.peach, 0.2];
  });

  R.add({ n: 56, slug: 'a-bundle-of-jewels', kanda: K, ref: 'Aranya 52', title: 'A bundle of jewels',
    text: 'Chariot gone, Ravana flies south with Sita in his arms, a yellow streak of silk across his dark body like lightning on a cloud. Over a mountain she sees five great monkeys sitting on the peak. With no one else to tell, she strips off her ornaments, knots them in her upper cloth, and lets the bundle fall among them. In his hurry he does not notice. They watch, unblinking, until she is out of sight.' }, (P) => {
    R.sky(P, { time: 'noon', seed: 352, bands: 6, motes: 8 });
    P.sky(R.cloud(300, 200, 1.6, C.white) + R.cloud(1380, 330, 1.4, C.white) + R.cloud(900, 120, 1.1, C.ice));
    R.water(P, 'bg', 760, H, { seed: 5, bands: 5, curls: 9 });
    P.bg(R.peak(380, 960, 900, 600, C.teal, { c2: C.sea, lean: 20, step: 0.13 }) + R.peak(900, 960, 700, 320, C.green, { c2: C.lime, lean: -30 }) + R.grove(5, 700, W + 40, 770, 6, { kinds: ['bloom', 'tier', 'round'], s0: 0.5, s1: 0.8 }) + R.lotusPad(1240, 830, 1) + R.lotusPad(1420, 860, 1.2, C.white));
    P.note(1320, 730, 'Pampa').note(400, 300, 'The mountain of the vanaras');
    put(P, 'mid', 'ravana', { x: 760, y: 250, s: 1.3, rot: 72, heads: 10, pose: ['fly', { aR: [100, 60], aL: [90, 50] }], head: { eye: 'angry' }, hs: 0.9, nx: 330, ny: 250 }, 'Flying as fast as thought, looking only ahead.');
    put(P, 'mid', 'sitaX', { x: 880, y: 330, s: 0.92, rot: 100, face: 1, pose: ['reach', { aR: [150, 170], aL: [-20, 20] }], head: { eye: 'sad' }, neck: 0, nx: 220, ny: 300 }, 'Her hair streams loose; her last jewels are in the bundle.');
    P.mid(line('M1010,420 C960,470 760,440 640,520', C.cream, 4, { 'stroke-dasharray': '6 14' }) + g(path('M-26,0 C-30,-30 30,-30 26,0 C30,26 -30,26 -26,0 Z', pat('flower', C.mustard, C.red, 0.8), { stroke: C.amber, 'stroke-width': 2 }) + path('M-8,-22 L0,-40 L8,-22 Z', C.mustard) + R.ring(-34, 14, 7, C.gold, 3) + circ(30, 24, 4, C.red) + R.ring(10, 36, 5, C.gold, 3), 'translate(640,520) rotate(20) scale(1.3)'));
    P.note(640, 460, 'Ornaments, tied in silk', 'Sugriva will keep them in a cave, and show them to a stranger with a bow.');
    [[250, 440, 'sugriva', 1], [370, 420, 'hanuman', 1], [150, 500, 'vanara', 1], [470, 470, 'vanara', -1], [560, 520, 'vanara', -1]].forEach((q, i) => { const o = { x: q[0], y: q[1], s: 0.78, face: 1, pose: ['sit', { aR: [130, 150], head: -24 }] }; if (q[2] === 'vanara') P.mid(F('vanara', Object.assign(o, { args: [[C.brown, C.clay, C.tan][i % 3]] }))); else put(P, 'mid', q[2], o, q[2] === 'hanuman' ? 'One of the five; he will see her again.' : 'Exiled from Kishkindha, hiding from his brother.'); });
    P.fg(R.fronds(7, 'L', { n: 3 }) + R.parrots(4, [1000, 500, 1500, 680], 5));
  });

  R.add({ n: 57, slug: 'twelve-months', kanda: K, ref: 'Aranya 53–54', title: 'Twelve months',
    text: 'In Lanka he walks her through halls of ivory, crystal and gold. “All this, and I, are yours.” Sita sets a blade of grass between them and speaks to that instead of to him: “You have stolen Rama’s wife as a dog steals the offering. You are already dead.” Ravana names his term. “Twelve months. After that the cooks will cut you up for my morning meal.” The rakshasis lead her to the ashoka grove.' }, (P) => {
    S.court(P, { inner: 'night', arches: [[1100, 520, 560, 9], [330, 340, 480, 7]], wall: C.amber, wall2: C.gold, wpat: 'scale', border: C.crimson, trim: C.gold, fcol: C.maroon, fcol2: C.gold, floor: C.gold, floor2: C.amber, carpet: false, seed: 354, top: 110 });
    for (let i = 0; i < 12; i++) { const x = 130 + i * 122, ph = i / 11; P.bg(circ(x, 54, 30, C.navy) + circ(x, 54, 24, C.cream) + circ(x + 48 * (ph - 0.5) * 1.6, 54, 24, C.navy) + R.ring(x, 54, 30, C.gold, 3)); }
    P.note(800, 110, 'Twelve moons', 'The term he gives her. Ten will have passed when Hanuman comes.');
    P.sky(R.grove(4, 880, 1340, 720, 4, { kinds: ['ashoka'], cols: [C.forest, C.teal], s0: 0.8, s1: 1.1 }));
    let heap = ''; const f = R.rng(8); for (let i = 0; i < 40; i++) { const x = f.r(60, 520), y = 800 - f.r(0, 1) * (130 - Math.abs(x - 290) * 0.5); heap += f() < 0.5 ? R.ring(x, y, f.r(8, 14), C.gold, 5) : circ(x, y, f.r(5, 9), f.pick([C.red, C.aqua, C.white, C.gold])); }
    P.mid(heap + g(R.item('crown'), 'translate(300,690) scale(1.6)') + g(R.item('pot', { col: C.gold }), 'translate(120,790) scale(2)') + g(R.item('pot', { col: C.gold }), 'translate(460,796) scale(1.7)'));
    put(P, 'mid', 'ravana', { x: 700, y: 860, s: 1.76, heads: 10, pose: ['point', { aR: [-100, -96], aL: [40, 110] }], head: { eye: 'angry', mouth: 'smile' }, ny: -180 }, 'He offers a kingdom, then sets a date.');
    P.mid(g(R.item('grass'), 'translate(960,850) scale(2.4)') + R.ring(960, 800, 46, C.cream, 2));
    P.note(960, 730, 'A blade of grass', 'She will not address him directly; the grass stands between.');
    put(P, 'mid', 'sitaX', { x: 1180, y: 860, s: 1.5, face: 1, pose: ['sit', { aR: [20, 50], head: 8 }], head: { eye: 'closed' }, ny: -30 }, 'She thinks of Rama and does not look up.');
    P.fg(F('rakshasi', { x: 1440, y: 900, s: 1.3, face: -1, hold: { R: { k: 'spear' } }, pose: ['stand', { aR: [40, 120] }] }) + F('rakshasi', { x: 1560, y: 930, s: 1.3, face: -1, args: [C.sGreen, C.maroon], hold: { R: { k: 'trident' } }, pose: ['stand', { aR: [40, 120] }] }));
    P.glow(290, 720, 200, C.gold, 0.4);
  });

  R.add({ n: 58, slug: 'rama-asks-the-trees', kanda: K, ref: 'Aranya 58–60', title: 'Rama asks the trees',
    text: 'The hut is empty. He runs from tree to tree: “Kadamba, have you seen her who loved your flowers? Bilva? Arjuna? Ashoka, remover of sorrow, remove mine.” He asks the deer, the elephant, the tiger. He asks the Godavari, and the river, afraid of Ravana, says nothing. Then the deer rise together, turn their faces south, and look up at the sky. Lakshmana understands them first.' }, (P) => {
    S.forest(P, { seed: 358, gy: 720, far: 0, gcol: C.olive, g2: C.moss, g3: C.ochre, sky: { time: 'rose', bands: 6, motes: 8 }, hcols: [C.plum, C.violet], flowers: 6, fronds: false });
    R.water(P, 'bg', 810, H, { seed: 3, bands: 3, curls: 5, col: C.slate, c2: C.smoke, c3: C.indigo });
    P.bg(R.hut(200, 740, 1.6));
    [[520, 'bloom', 1.5], [860, 'round', 1.7], [1120, 'ashoka', 1.3]].forEach((q, i) => { P.bg(R.tree(q[1], q[0], 740, q[2], { c: [C.green, C.forest, C.moss][i], fl: C.vermilion })); P.bg(g(line('M-22,0 Q-10,10 4,0', C.ink, 4) + line('M24,0 Q36,10 50,0', C.ink, 4) + line('M0,30 Q14,22 28,30', C.ink, 3.5), `translate(${q[0] - 14},${740 - q[2] * (q[1] === 'ashoka' ? 210 : 190)}) scale(${q[2] * 0.8})`)); });
    P.note(520, 380, 'Kadamba').note(860, 330, 'Arjuna').note(1120, 360, 'Ashoka', '“Sorrowless” tree. It keeps its eyes shut.');
    put(P, 'mid', 'ramaX', { x: 700, y: 840, s: 1.66, pose: ['plead', { aR: [110, 150], aL: [80, 140], lean: 6, head: -14 }], head: { eye: 'sad', mouth: 'open' }, ny: -90 }, 'His anger, when it comes, threatens the whole creation; Lakshmana talks him down.');
    put(P, 'mid', 'lakshmanaX', { x: 400, y: 840, s: 1.4, pose: ['point', { aR: [96, 100] }], hold: { L: { k: 'bow', len: 94, rot: -8 } }, head: { eye: 'sad' } }, '“Look at the deer.”');
    P.mid(R.deer(1300, 830, 1.2, {}) + R.deer(1420, 820, 1, {}) + R.deer(1520, 840, 1.1, {}) + line('M1380,640 l60,-60 M1440,580 l-26,4 M1440,580 l-4,26', C.cream, 5));
    P.note(1420, 560, 'South, and up', 'The deer point with their whole bodies the way she was taken.');
    P.mid(g(R.item('garland', { col: C.vermilion }), 'translate(560,836) rotate(80) scale(1.2)') + R.petals(4, [300, 800, 900, 870], 14, [C.white, C.vermilion]));
    P.fg(R.tree('reed', 60, 930, 1.3) + R.tree('reed', 1560, 930, 1.3));
  });

  R.add({ n: 59, slug: 'rites-for-a-bird', kanda: K, ref: 'Aranya 63–64', title: 'Funeral rites for a bird',
    text: 'They find Jatayu dying and Rama, half-mad, takes him for the one who ate her. The bird speaks with blood in his throat: “Ravana took her, and my life. South.” He dies with the name on his beak. Rama, who could not perform his own father’s last rites, builds the pyre himself and gives the vulture what a son gives: fire, the offering of food, and water at the Godavari.' }, (P) => {
    S.forest(P, { seed: 363, gy: 700, far: 7, kinds: ['sal', 'tier', 'round'], cols: [C.navy, C.forest, C.indigo], gcol: C.forest, g2: C.navy, g3: C.moss, sky: { time: 'deep', bands: 6, stars: 14, motes: 4 }, hcols: [C.navy, C.indigo], fronds: false });
    R.water(P, 'bg', 800, H, { seed: 4, bands: 4, curls: 7, col: C.indigo, c2: C.blue, c3: C.navy });
    let pyre = ''; for (let r = 0; r < 4; r++) for (let i = 0; i < 6 - r; i++) pyre += rect(960 + r * 22 + i * 44, 760 - r * 26, 40, 24, pat('bark', r % 2 ? C.brown : C.umber, C.ink, 0.8), { rx: 8, stroke: C.ink, 'stroke-width': 1.5 });
    P.mid(pyre + R.flame(1090, 690, 1.9, 4) + R.flame(990, 720, 1, 7) + R.flame(1200, 720, 1.1, 9));
    P.mid(R.sil(R.bird(1090, 330, 1, { wings: [-60, 50], rot: -30 }), C.straw, 0.85) + R.motes(5, [960, 120, 1240, 560], 14, [C.gold, C.cream], { kind: 'ring', min: 8, max: 22 }) + R.smoke(1090, 520, 1.3, C.smoke, 5, 3));
    P.note(1090, 180, 'Jatayu’s spirit', '“Go to the worlds of those who give land, who keep the fires, who do not turn back in battle.”');
    put(P, 'mid', 'ramaX', { x: 560, y: 850, s: 1.6, pose: ['kneelOne', { aR: [70, 60], aL: [56, 64], both: 1, lean: 16, head: 10 }], head: { eye: 'sad' }, ny: 0 }, 'He pours water from his joined hands for the bird as for a father.');
    P.mid(line('M690,700 q6,60 2,110', C.pale, 5, { 'stroke-dasharray': '3 12' }) + R.ring(700, 830, 30, C.pale, 3) + R.ring(700, 830, 54, C.pale, 2));
    put(P, 'mid', 'lakshmanaX', { x: 1380, y: 790, s: 1.24, face: -1, pose: 'carry', hold: { R: { k: 'staff', rot: 76 } }, head: { eye: 'sad' } });
    P.fg(R.tree('reed', 100, 930, 1.4) + R.lotusPad(300, 880, 1.1, C.white) + R.lotusPad(1300, 890, 1));
    P.fx.tint = [C.pale, 0.34]; P.fire(1090, 620, 220, 1).glow(1090, 500, 300, C.saffron, 0.45);
  });

  R.add({ n: 60, slug: 'kabandha', kanda: K, ref: 'Aranya 65–69', title: 'Kabandha',
    text: 'A thing with no head and no neck: a trunk like a storm cloud, a fanged mouth in its belly, one fiery eye in its chest, and arms a yojana long that rake the forest for food. It has both brothers in its fists before they see it. They shear the arms off at the shoulder. Burnt at his own request, he rises as a shining gandharva: “Find Sugriva on Rishyamuka, by Pampa. Make him your friend before the fire.”' }, (P) => {
    S.forest(P, { seed: 365, gy: 780, far: 6, kinds: ['sal', 'bare', 'tier'], cols: [C.forest, C.ink, C.moss], gcol: C.moss, g2: C.ink, g3: C.forest, sky: { time: 'green', bands: 6, motes: 4 }, hcols: [C.ink, C.navy], fronds: false });
    P.sky(R.burst(800, 170, 80, { seed: 3, col: C.straw, n: 40, len: 2.6 }) + R.cloud(800, 250, 1.4, C.ice, C.pale));
    put(P, 'bg', 'narada', { x: 800, y: 240, s: 0.72, label: 'Kabandha, released', pose: ['point', { aR: [84, 96] }], head: { hair: 'long', gear: 'mukut', halo: 44 }, hold: {}, cloth: { lc: C.gold, sash: C.cream, garland: C.white } }, 'Once Danu’s handsome son, cursed for his pride. He tells them where to go next.');
    const arm = (sd) => { const d = `M${800 + sd * 150},520 C${800 + sd * 420},360 ${800 + sd * 640},520 ${800 + sd * 520},700 C${800 + sd * 470},770 ${800 + sd * 380},760 ${800 + sd * 380},700`; return line(d, C.ink, 78) + line(d, C.slate, 70) + line(d, C.sRak, 70, { 'stroke-dasharray': '10 40', 'stroke-linecap': 'butt', opacity: 0.6 }); };
    P.mid(arm(-1) + arm(1));
    P.mid(ell(800, 600, 250, 270, C.slate, { stroke: C.ink, 'stroke-width': 5 }) + ell(800, 600, 250, 270, pat('fur', C.slate, C.ink, 2), { opacity: 0.6 }) + eye(800, 440, 2.6, C.gold, C.crimson, 1) + path('M620,610 Q800,560 980,610 Q960,800 800,810 Q640,800 620,610 Z', C.maroon, { stroke: C.ink, 'stroke-width': 5 }) + [0, 1, 2, 3, 4, 5, 6].map((i) => path(`M${650 + i * 46},600 l16,54 l16,-54 Z`, C.white) + path(`M${672 + i * 40},800 l14,-46 l14,46 Z`, C.white)).join('') + path('M700,740 Q800,690 900,740 Q800,790 700,740 Z', C.vermilion));
    P.note(800, 330, 'One eye, in the chest').note(800, 830, 'A mouth in the belly');
    put(P, 'mid', 'ramaX', { x: 400, y: 850, s: 1.26, pose: ['strike', { aR: [150, 200] }], hold: { R: { k: 'sword', along: 1, s: 1.2 } }, head: { eye: 'angry' } }, 'He cuts the right arm.');
    put(P, 'mid', 'lakshmanaX', { x: 1200, y: 850, s: 1.26, face: -1, pose: ['strike', { aR: [150, 200] }], hold: { R: { k: 'sword', along: 1, s: 1.2 } }, head: { eye: 'angry' } }, 'He cuts the left.');
    P.mid(R.impact(330, 560, 70, [C.white, C.gold], 3, 10) + R.impact(1270, 560, 70, [C.white, C.gold], 5, 10));
    P.fg(R.fronds(8, 'L', { n: 4, cols: [C.ink, C.forest] }) + R.fronds(9, 'R', { n: 4, cols: [C.ink, C.forest] }));
    P.glow(800, 170, 180, C.straw, 0.5);
  });

  R.add({ n: 61, slug: 'shabari', kanda: K, ref: 'Aranya 70', title: 'Shabari has waited',
    text: 'On the western shore of Pampa an old woman of the forest people has kept a hermitage alone since her teachers, the disciples of Matanga, rose to heaven. They told her Rama would come. She touches the brothers’ feet, sets before them the fruits and roots she has gathered along the lake, and shows them the grove: altars still warm, garlands unfaded. Then, with his leave, she walks into her fire and goes to her teachers.' }, (P) => {
    S.forest(P, { seed: 370, gy: 710, far: 6, kinds: ['bloom', 'round', 'tier', 'bloom'], flowers: 16, gcol: C.lime, g2: C.leaf, g3: C.straw, sky: { time: 'dawn', bands: 5, sun: [1300, 170, 56, C.white, 2.6] } });
    R.water(P, 'bg', 600, 720, { seed: 6, bands: 3, curls: 5, ticks: 10 });
    P.bg(R.ground(700, C.lime, { stripes: 2, tufts: 20, flowers: 12, c2: C.leaf, c3: C.straw }) + R.hut(240, 740, 1.5) + R.altar(1260, 740, 0.9, 5) + R.altar(1440, 730, 0.7, 2, false));
    [1150, 1340, 1460].forEach((x, i) => P.bg(g(R.item('garland', { col: [C.vermilion, C.pink, C.gold][i] }), `translate(${x},${420 + i * 20}) scale(1.4)`)));
    P.note(1340, 380, 'Garlands that do not fade', 'Strung by the old sages with hands that trembled from fasting.');
    put(P, 'mid', 'ramaX', { x: 880, y: 850, s: 1.5, face: -1, pose: ['sit', { aR: [70, 110] }], head: { eye: 'soft', mouth: 'smile' }, ny: -30 }, '“Have your austerities prospered? Is your anger governed?”');
    put(P, 'mid', 'lakshmanaX', { x: 1100, y: 856, s: 1.34, face: -1, pose: 'sitNamaste' });
    P.mid(F('woman', { x: 560, y: 860, s: 1.56, pose: ['offer', { lean: 14 }], args: [C.ochre, C.umber, C.sDark], head: { old: 1, hair: 'bun', haircol: C.white, gear: 0, eye: 'soft', mouth: 'smile', nosering: 0, earring: false, tilak: 0 }, neck: 0, bangle: false, cloth: { lpat: pat('bark', C.ochre, C.brown, 0.8), upper: 'blouse', uc: C.clay, pallu: 0, mala: 1 } }));
    P.note(560, 430, 'Shabari', 'Perfected by long service; she asks only to follow her teachers.');
    P.mid(g(ell(0, 0, 60, 14, C.leaf, { stroke: C.forest, 'stroke-width': 2 }) + [[-30, -8, C.vermilion], [-10, -12, C.plum], [10, -10, C.saffron], [30, -8, C.red], [0, -22, C.gold], [-20, -22, C.maroon], [20, -22, C.lime]].map((q) => circ(q[0], q[1], 10, q[2])).join(''), 'translate(700,640)'));
    P.note(700, 600, 'Fruits and roots of Pampa');
    P.fg(R.petals(4, [200, 100, 1400, 600], 22) + R.fronds(2, 'L', { n: 3 }));
    P.fire(1260, 680, 80, 0.7).rays(1300, 170, 0.5, C.cream);
  });

  R.add({ n: 62, slug: 'spring-on-pampa', kanda: K, ref: 'Aranya 71 · Kishkindha 1', title: 'Spring on Pampa',
    text: 'The lake is clear as crystal, red, white and blue with lotuses, loud with geese; the wind off the Malaya hill shakes flowers down like rain. For a man alone it is unbearable. “Look, Lakshmana: the peacock dances and his hen dances after him. No rakshasa has carried off his love. Go back to Bharata. I cannot live without her.” On the hill above, a monkey king sees two armed men and trembles.' }, (P) => {
    R.sky(P, { time: 'day', seed: 371, bands: 5, motes: 26, mcols: [C.white, C.pink, C.gold] });
    P.sky(R.peak(1260, 560, 760, 440, C.teal, { c2: C.sea, lean: -20, step: 0.13 }) + R.peak(300, 560, 600, 240, C.green, { c2: C.lime }));
    P.sky(R.sil(F('vanara', { x: 1240, y: 150, s: 0.34, pose: 'sit' }) + F('vanara', { x: 1300, y: 164, s: 0.32, face: -1, pose: 'stand' }) + F('vanara', { x: 1190, y: 170, s: 0.3, pose: 'point' }), C.navy, 0.85));
    P.note(1250, 60, 'Rishyamuka', 'Sugriva takes them for assassins sent by Vali.');
    P.bg(R.grove(5, -60, W + 60, 560, 9, { kinds: ['bloom', 'bloom', 'tier', 'round'], cols: [C.leaf, C.green, C.forest], s0: 0.8, s1: 1.2, fcols: [C.pink, C.white, C.vermilion, C.gold] }));
    R.water(P, 'bg', 560, H, { seed: 7, bands: 8, curls: 14, ticks: 30, col: C.sea, c2: C.aqua, c3: C.teal });
    P.bg(path('M-80,760 C200,700 520,720 760,800 C900,850 900,960 -80,960 Z', C.lime) + R.petals(3, [40, 760, 700, 890], 16, [C.white, C.pink]));
    P.bg(R.lotusPad(900, 640, 1) + R.lotusPad(1080, 700, 1.3, C.white) + R.lotusPad(1300, 640, 1.1, C.azure) + R.lotusPad(1460, 760, 1.4) + R.lotusPad(1200, 820, 1.5, C.white) + R.lotusPad(980, 860, 1.2, C.azure) + R.swan(1380, 700, 1) + R.swan(1120, 780, 0.9, { flip: -1 }) + R.swan(1500, 660, 0.8));
    P.mid(R.peacock(170, 800, 1.2) + R.peacock(330, 826, 0.8, { flip: -1 }));
    P.note(240, 560, 'The peacock and his hen');
    put(P, 'mid', 'ramaX', { x: 560, y: 880, s: 1.7, pose: 'sitGrief', head: { eye: 'closed' }, ny: -30 }, 'Every beautiful thing here is a wound.');
    put(P, 'mid', 'lakshmanaX', { x: 800, y: 880, s: 1.46, face: -1, pose: ['stand', { aR: [60, 110] }], hold: { L: { k: 'bow', len: 96, rot: 8 } }, head: { eye: 'sad' } }, '“Grief destroys courage. Put it away; let us find the one who took her.”');
    P.fg(R.petals(9, [60, 60, 1540, 760], 44, [C.pink, C.white, C.vermilion]) + R.fronds(4, 'T', { n: 6, s: 0.8, cols: [C.leaf, C.green] }));
  });
})();
