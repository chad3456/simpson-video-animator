import { execSync } from 'node:child_process';
const { chromium } = await import('playwright').catch(() => import(execSync('npm root -g').toString().trim() + '/playwright/index.js')).then(m => m.default || m);
const [,, file, out, w='1920', h='1080'] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:+w,height:+h}});
p.on('pageerror', e => console.error('PAGE ERROR', e.message)); p.on('console', m => m.type()==='error' && console.error(m.text()));
await p.goto('file://' + process.cwd() + '/' + file); await p.waitForFunction(() => window.done || !document.querySelector('script[src="art.js"]'), null, {timeout: 120000}).catch(e=>console.error('timeout')); await p.waitForTimeout(300);
await p.screenshot({ path: out }); await b.close();
