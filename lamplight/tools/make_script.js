// writes script.md from story.js and build/timeline.json
global.window = undefined;
require('../kit.js'); require('../engine.js'); const LL = require('../story.js');
const fs = require('fs'), path = require('path');
const T = JSON.parse(fs.readFileSync(path.join(__dirname, '../build/timeline.json')));
const tc = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const out = ['# Lamplight: a Ramayana in shadow', '',
  `Film, ${tc(T.total)}. Narrated by an old shadow-puppet player whose family has carried the puppets for eleven generations. The look follows Tholu Bommalata, the translucent coloured leather puppets of Andhra Pradesh, played behind a cloth by the light of one lamp. The story follows Valmiki's Ramayana, with one folk story (the squirrel at the bridge) that the puppet players always tell.`, '',
  'In the live version the viewer holds the lamp. The lines marked **[you]** are the moments that wait for the viewer; in the film the puppeteer does them. Shots marked *behind the screen* cut to the puppeteer\'s side of the cloth.', ''];
LL.ACTS.forEach((a, ai) => {
  const A = T.acts[ai];
  out.push(`## ${ai === 0 ? 'Prologue' : `Act ${ai}`}. ${a.title} (${a.dev}) · ${tc(A.start)}`, '');
  const ev = [];
  a.lines.forEach((l, li) => ev.push({ p: l.p, s: `${l.text}` , t: T.lines.find((x) => x.act === ai && x.i === li).t }));
  a.steps.filter((s) => s.type !== 'auto').forEach((s) => ev.push({ p: s.from + 1e-4, s: `**[you]** ${s.hint}. *(${{ hold: 'press and hold', tap: 'tap', reach: 'move the light', near: 'press and hold to bring the lamp close', sweep: 'sweep the light' }[s.type]})*` }));
  (a.backstage || []).forEach(([b]) => ev.push({ p: b, s: '*Cut: behind the screen.*' }));
  ev.sort((x, y) => x.p - y.p).forEach((e) => out.push(e.t != null ? `**${tc(e.t)}** ${e.s}` : e.s, ''));
});
out.push('---', '', 'Voice: Kokoro (open-weight TTS). Music: a procedural tanpura drone, bansuri-like flute in a different raga for each act, mridangam strokes and the wooden clappers the players stamp for every blow. All puppets are drawn in code.');
fs.writeFileSync(path.join(__dirname, '../script.md'), out.join('\n'));
console.log('ok');
