/* Film the drawing being made. Runs the same drawing code and hands a frame to ffmpeg every so many marks.
   node genstyle/homecoming/timelapse.js [out.mp4] [seconds of drawing] [audio.wav]      (needs ffmpeg on the PATH) */
'use strict';
const path = require('path'), { spawn } = require('child_process');
require('./scene.js'); require('./foreground.js'); require('./draw.js');
const out = process.argv[2] || path.join(__dirname, 'homecoming-timelapse.mp4'), secs = +(process.argv[3] || 44), audio = process.argv[4], fps = 30, hold = 6;
// first pass: how much work is the whole drawing?
let total = 0; makeArt(1, null, (r) => { total += 1 + r; }).run();
const frames = Math.round(secs * fps), per = total / frames;
const args = ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', '1920x1080', '-r', String(fps), '-i', '-'];
if (audio) args.push('-i', audio, '-c:a', 'aac', '-b:a', '160k', '-shortest');
args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
// second pass: the same drawing (same seed, same marks), paused for a photograph at even intervals
let acc = 0, n = 0, art; const queue = [];
const snap = () => { queue.push(Buffer.from(art.pixels().buffer)); n++; };
art = makeArt(1, (m) => process.stdout.write('  ' + m + '\n'), (r) => { acc += 1 + r; if (acc >= per) { acc -= per; snap(); flush(); } });
function flush() { while (queue.length) ff.stdin.write(queue.shift()); }
art.paper(); for (let i = 0; i < 20; i++) snap(); flush();           // a breath of blank paper first
art.steps.forEach((s) => { s[1](); art.__log && 0; process.stdout.write('  ' + s[0] + '\n'); });
for (let i = 0; i < hold * fps; i++) snap(); flush();                 // and a long look at the end
ff.stdin.end(); ff.on('close', (c) => console.log('wrote', out, n, 'frames', c));
