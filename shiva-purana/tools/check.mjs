// Validate an episode.json against the figure kit, sets and effects: unknown poses, figures, sets, fx kinds and
// camera targets are reported with the scene and line. Usage: node shiva-purana/tools/check.mjs <episode.json>
import fs from 'fs';
import path from 'path';
const here = path.dirname(new URL(import.meta.url).pathname);
global.window = {}; global.document = { createElement: () => ({ getContext: () => ({}) }) };
for (const f of ['figures.js', 'sets.js', 'fx.js']) (0, eval)(fs.readFileSync(path.join(here, '../engine', f), 'utf8'));
const { CAST, POSES, ITEMS } = window.CBFig, { SETS } = window.CBSets, FX = window.CBFx;
const ep = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const EMOS = new Set(['smile', 'joy', 'angry', 'rage', 'fear', 'sad', 'calm', 'serene', 'sly', 'meditate', 'neutral', 'shock']);
let bad = 0; const warn = (...a) => { bad++; console.log(...a); };
for (const s of ep.sequence) {
  if (s.type !== 'scene') continue;
  if (!SETS[s.set]) warn(`${s.id}: unknown set ${s.set}`);
  const ids = new Set((s.els || []).map(e => e.id));
  const checkProps = (where, p, el) => {
    if (p.pose && !POSES[p.pose]) warn(`${where}: unknown pose ${p.pose}`);
    if (p.emo && !EMOS.has(p.emo)) warn(`${where}: unknown emo ${p.emo}`);
    for (const k of ['item', 'itemL']) if (p[k] && p[k] !== 'none' && !ITEMS[p[k]]) warn(`${where}: unknown item ${p[k]}`);
  };
  for (const el of s.els || []) {
    const fig = el.fig || el.id;
    if (!CAST[fig] && !FX[el.kind]) warn(`${s.id}: ${el.id} is neither a figure nor an effect (kind=${el.kind})`);
    checkProps(`${s.id}/${el.id}`, el, el);
    for (const [i, ks] of Object.entries(el.keys || {})) for (const k of ks) checkProps(`${s.id}/${el.id}@${i}`, k, el);
  }
  const cams = [s.cam, ...s.lines.map(l => l.cam)].filter(Boolean);
  for (const c of cams) for (const spec of String(c).split('|')) {
    const [kind, arg] = spec.split(':');
    if (arg == null) { if (kind !== 'wide' && !ids.has(kind)) warn(`${s.id}: camera ${spec} has no target`); continue; }
    if (kind === 'at') continue;
    for (const id of arg.split(',')) if (!ids.has(id)) warn(`${s.id}: camera ${spec} names missing ${id}`);
  }
  s.lines.forEach((l, i) => { if (l.who && !ep.cast[l.who]) warn(`${s.id}#${i}: unknown speaker ${l.who}`); });
}
console.log(bad ? `${bad} problems` : 'ok');
