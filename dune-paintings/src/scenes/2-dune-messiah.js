// II. DUNE MESSIAH — "The Blind Emperor."
// Twelve years after his victory, emperor of a holy war he could not stop, Paul Muad'Dib is blinded. By Fremen law
// the blind are given to the desert, and he walks out alone, leaving the citadel and the god the people made of him.
// A man walking out of his own legend: the only freedom left to a prophet is to step out of the prophecy.
(function () {
  D.scenes = D.scenes || {};
  D.scenes['2-dune-messiah'] = {
    title: 'Dune Messiah — The Blind Emperor', W: 2400, H: 1350, seed: 1969,
    draw(K) {
      const { W, H } = K;
      // dusk: indigo zenith, rose and gold at the horizon
      K.bg(K.lin(0, 0, 0, 900, ['#0a0c2a', '#2a1a4a', '#7a2a5a', '#e0605a', '#ffb070']));
      K.stars(380, [0, 0, W, 520], ['#ffffff', '#ffe8d8', '#c8d8ff']);
      // a thin crescent moon high up
      K.fill(K.ell(1960, 190, 46, 46), '#fff2e0', 0.9); K.fill(K.ell(1978, 180, 44, 44), '#16123a');
      // the great setting sun, half drowned in the dunes
      K.glow(1500, 840, 1100, '#ff7a4a', 0.5);
      K.fill(K.ell(1500, 840, 250, 250), K.rad(1500, 800, 20, 250, ['#fff4d0', '#ffd890', '#ffa860']));
      K.glow(1500, 840, 420, '#ffd8a0', 0.6);
      for (let i = 0; i < 5; i++) K.blur(() => K.fill(K.ell(1500 + K.R(-300, 300), 700 + i * 30, K.R(300, 520), K.R(5, 12)), D.rgba('#7a2a5a', 0.45)), 4);
      // the citadel of Arrakeen far behind him on the left: a monumental block against the dusk, lights in its slits
      const cit = K.poly([[60, 860], [90, 640], [150, 640], [170, 540], [300, 520], [430, 520], [450, 590], [560, 590], [580, 640], [680, 650], [720, 860]]);
      K.fill(cit, K.lin(0, 520, 0, 860, ['#3a1a3a', '#2a1028', '#1a0a1a']));
      K.brush(cit, { n: 120, angle: () => Math.PI / 2, len: [30, 120], w: [1, 3], colors: ['#5a2a4a', '#1a0814'], alpha: [0.1, 0.3] });
      for (let i = 0; i < 30; i++) { const x = K.R(170, 640), y = K.R(610, 830); K.fill(K.poly([[x, y], [x + 4, y], [x + 4, y + 12], [x, y + 12]]), '#ffc070', 0.9); }
      K.glow(400, 700, 260, '#ff9050', 0.2);
      K.fill(cit, K.lin(0, 520, 0, 860, [D.rgba('#ff8a7a', 0.12), D.rgba('#ff8a7a', 0.35)]));
      // haze across the far dunes
      K.duneField({ y: 870, n: 10, w: [150, 300], h: [15, 45], lightDir: -1, colors: ['#c06a7a', '#8a3a5a', '#5a1a3a'], shadow: '#3a0a2a', shadowAlpha: 0.5, crest: '#ffc0a0', crestAlpha: 0.5, strokes: 80, gradH: 200 });
      K.blur(() => K.fill(K.poly([[0, 800], [W, 800], [W, 940], [0, 940]]), K.lin(0, 800, 0, 940, [D.rgba('#ff9a8a', 0), D.rgba('#ff9a8a', 0.4), D.rgba('#ff9a8a', 0)])), 22);
      K.duneField({ y: 1000, n: 6, w: [260, 520], h: [30, 90], lightDir: -1, colors: ['#9a3a5a', '#5a1a3a', '#2a0a20'], shadow: '#140414', shadowAlpha: 0.6, crest: '#ffb090', crestAlpha: 0.6, strokes: 160, gradH: 300 });
      // the open flat he walks across, and his single line of footprints from the city
      const flat = K.duneField({ y: 1350, humps: [[1200, 2600, 260]], lightDir: -1, colors: ['#7a2a4a', '#4a1430', '#1a0612'], strokes: 260, ripples: 120, gradH: 340, texture: ['#ff9a8a', '#c05a6a', '#3a0a20'] });
      const fx = 1420, fy = flat.Y(fx);
      // footprints
      for (let k = 0; k < 40; k++) { const t = k / 40, x = 420 + (fx - 420) * t, y = flat.Y(x) + 6 + (1 - t) * 40, w = 2 + t * 4; K.fill(K.ell(x + (k % 2 ? 4 : -4), y, w * 1.4, w * 0.6), '#14040e', 0.7); }
      // the sun's glare laid along the sand toward him
      K.blur(() => K.fill(K.ell(1500, 1080, 520, 60), K.rad(1500, 1080, 0, 520, [D.rgba('#ffc890', 0.25), D.rgba('#ffc890', 0)]), 1, 'lighter'), 20);
      // his long shadow thrown back toward the city
      K.fill(K.poly([[fx - 6, fy], [fx + 6, fy], [fx - 420, fy + 60], [fx - 440, fy + 54]]), D.rgba('#0a0208', 0.6));
      // Paul from behind, walking into the sun with a Fremen staff
      K.figure(fx, fy + 2, 150, { ink: '#0e0410', rim: '#ffd0a0', rimSide: 1, hood: true, wind: -0.45, staff: true });
      K.sand(160, [0, 900, W, H], ['#ffb0a0', '#ffd0b0', '#c06a7a'], -0.03);
      K.finish({ bloom: 46, bloomAlpha: 0.32, vignette: '#0a0410', vignetteAlpha: 0.6, grain: 16 });
    },
  };
})();
