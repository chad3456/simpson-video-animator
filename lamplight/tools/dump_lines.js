// prints every narration line as JSON: [{key, text}]
global.window = undefined;
require('../kit.js'); require('../engine.js'); const LL = require('../story.js');
const out = [];
LL.ACTS.forEach((a, ai) => a.lines.forEach((l, li) => out.push({ key: `${ai}.${li}`, text: l.say || l.text })));
console.log(JSON.stringify(out, null, 1));
