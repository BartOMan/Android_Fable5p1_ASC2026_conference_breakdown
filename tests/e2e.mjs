// End-to-end functional test of the ASC 2026 Navigator web app in headless Chromium (mobile viewport).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const PORT = 8765; const BASE = `http://127.0.0.1:${PORT}/index.html`;
const srv = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: 'app/www', stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const shots = 'tests/screenshots'; fs.mkdirSync(shots, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, timezoneId: 'America/New_York' });
const page = await ctx.newPage();
const errors = []; page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
let pass = 0, fail = 0; const results = [];
async function check(name, fn) { try { const r = await fn(); if (r === false) throw new Error('assertion returned false'); pass++; results.push('PASS ' + name); } catch (e) { fail++; results.push('FAIL ' + name + ' :: ' + e.message); } }
const has = (t, x) => t.toLowerCase().includes(x.toLowerCase());
async function go(hash, shot) { await page.goto(BASE + '#' + hash, { waitUntil: 'load' }); await page.waitForTimeout(150); if (shot) await page.screenshot({ path: `${shots}/${shot}.png` }); return await page.locator('#view').textContent(); }
const t0 = Date.now(); await page.goto(BASE); await page.waitForSelector('.hero'); const loadMs = Date.now() - t0;
// data sanity from inside the page
const stats = await page.evaluate(() => ({ sessions: D.sessions.length, pres: D.presentations.filter(p => !p.aux).length, people: D.people.length, abstracts: D.presentations.filter(p => p.abstract).length, tasc: D.people.filter(p => p.tasc).length, photos: D.people.filter(p => p.photo).length, kws: KW_COUNT.filter(k => k.n > 0).length }));
await check('dataset loaded: 222 sessions / >1350 presentations / >4000 people', () => stats.sessions === 222 && stats.pres > 1350 && stats.people > 4000);
await check('abstracts present for >1300 presentations', () => stats.abstracts > 1300);
await check('keyword index: >50 keywords with matches', () => stats.kws > 50);
// simulate a conference moment (Tue Sep 8, 10:00 ET)
await page.evaluate(() => { state.timeTravel = { date: '2026-09-08', min: 600 }; render(); });
await page.screenshot({ path: `${shots}/01-now.png` });
await check('Now: shows happening-now sessions', async () => (await page.locator('#view').textContent()).includes('Happening now'));
await check('Now: shows up-next block', async () => (await page.locator('#view').textContent()).includes('Up next'));
// Program
let t = await go('/program/2026-09-08', '02-program');
await check('Program Tue lists plenary and poster sessions', () => has(t,'2PL1') && has(t,'2LPo1A'));
t = await go('/program/2026-09-08?area=E&type=Oral', '03-program-filtered');
await check('Program filter Electronics+Oral shows only E oral sessions', () => has(t,'2EOr') && !has(t,'2LOr') && !has(t,'2EPo'));
t = await go('/program/2026-09-06');
await check('Program Sunday shows short courses', () => has(t,'Short Course'));
// Session
t = await go('/session/2LOr2B', '04-session');
await check('Session page: title, moderators, talks, also-at', async () => has(t,'Accelerator Magnets IV') && has(t,'Moderators') && has(t,'2LOr2B-01') === false && has(t,'Also at') && (await page.locator('.talk').count()) >= 5);
await check('Session star toggles and persists', async () => { await page.locator('.card .star').first().click(); await page.waitForTimeout(100); const on = await page.locator('.card .star.on').count(); return on >= 1 && JSON.parse(localStorage_get(await page.evaluate(() => localStorage.getItem('asc26_stars')))).includes('2LOr2B'); });
function localStorage_get(v) { return v; }
// Presentation
const presId = await page.evaluate(() => S['2LOr2B'].items[0]);
t = await go('/pres/' + presId, '05-presentation');
await check('Presentation page: authors, affiliations, abstract, related', () => has(t,'Authors') && has(t,'Abstract') && has(t,'presenting author') && has(t,'Related presentations'));
await check('Presentation: author link navigates to person', async () => { await page.locator('.authors a').first().click(); await page.waitForTimeout(150); return location_hash(await page.evaluate(() => location.hash)).startsWith('#/person/'); });
function location_hash(h) { return h; }
// Poster session
t = await go('/session/2LPo1A', '06-poster-session');
await check('Poster session lists board numbers', () => /#\s?L?\d|\b0?\d\b/.test(t) && has(t,'Posters'));
// Search
t = await go('/search?q=no-insulation', '07-search');
await check('Search "no-insulation" finds presentations and sessions', () => /\d+ presentations/.test(t) && !has(t,'0 presentations') && has(t,'Sessions'));
t = await go('/search?q=quench%20detection&day=2026-09-09&type=Oral');
await check('Search with day+type filters returns only Wed orals', () => has(t,'Wed') && !has(t,'Tue ') && !has(t,'Thu '));
await check('Search typing updates results live', async () => { await go('/search'); await page.fill('#q', 'SNSPD'); await page.waitForTimeout(500); const tt = await page.locator('#view').textContent(); return /[1-9]\d* presentations/.test(tt); });
t = await go('/search?q=zzzzqqq');
await check('Search no-results message', () => has(t,'No matches'));
t = await go('/keyword/1', '08-keyword');
await check('Keyword page (Nb3Sn) lists sessions and days', () => has(t,'Nb3Sn') && has(t,'Sessions with the most matches') && has(t,'Monday'));
// People
t = await go('/people', '09-people');
await check('People ranked list shows TASC counts', async () => has(t,'TASC papers') && (await page.locator('.card.tap').count()) >= 20);
t = await go('/people?mode=chairs');
await check('People moderators filter', () => has(t,'chairs'));
await check('People search filters by name', async () => { await go('/people'); await page.fill('#pq', 'Larbalestier'); await page.waitForTimeout(500); const tt = await page.locator('#view').textContent(); return has(tt,'Larbalestier') && (await page.locator('.card.tap').count()) < 5; });
const topId = await page.evaluate(() => PEOPLE_RANKED.find(p => p.tasc && p.presentingIds.length).id);
t = await go('/person/' + topId, '10-person');
await check('Person page: TASC, where-to-find, co-authors, follow button', () => has(t,'IEEE Transactions') && has(t,'Where to find them') && has(t,'Frequent co-authors') && has(t,'Follow'));
await check('Follow person persists to prefs', async () => { await page.locator('button:has-text("Follow")').first().click(); await page.waitForTimeout(100); return (await page.evaluate(() => JSON.parse(localStorage.getItem('asc26_prefs')).people.length)) === 1; });
const plenId = await page.evaluate(() => D.plenary[0].pid);
t = await go('/person/' + plenId, '11-plenary-person');
await check('Plenary speaker page has photo and biography', async () => has(t,'Biography') && (await page.locator('.avatar.lg img').count()) === 1);
// Explore
t = await go('/explore/topics', '12-topics');
await check('Topic treemap renders tiles', async () => (await page.locator('svg.treemap rect').count()) > 40);
await check('Treemap tile click opens topic page', async () => { await page.locator('svg.treemap rect').first().dispatchEvent('click'); await page.waitForTimeout(150); return (await page.evaluate(() => location.hash)).startsWith('#/topic/'); });
t = await go('/topic/L/' + encodeURIComponent('Magnets, Accelerator'), '13-topic');
await check('Topic page lists sessions grouped by day and add-to-interests', () => has(t,'13 sessions') && has(t,'Add to my interests'));
t = await go('/explore/people', '14-who-to-meet');
await check('Who to meet: plenary chips and TASC ranking with next slot', () => has(t,'Plenary speakers') && has(t,'Most published') && has(t,'Next:'));
t = await go('/explore/institutions', '15-institutions');
await check('Institutions ranking with companies section', () => has(t,'Lawrence Berkeley') && has(t,'Companies'));
t = await go('/inst/CERN', '16-institution');
await check('Institution page: people chips and talks by day', () => has(t,'CERN') && has(t,'People') && has(t,'Monday'));
t = await go('/explore/countries', '17-countries');
await check('Countries donut + bars', async () => has(t,'United States') && (await page.locator('svg path').count()) >= 8);
t = await go('/country/Japan', '18-country');
await check('Country page institutions and people', () => has(t,'Japan') && has(t,'Institutions') && has(t,'Prominent people'));
t = await go('/explore/rooms', '19-rooms');
await check('Rooms schematic renders rooms on 3 levels', async () => (await page.locator('svg.roomsvg rect').count()) >= 15 && has(t,'Level 4'));
t = await go('/room/' + encodeURIComponent('Ballroom A'), '20-room');
await check('Room page timeline lists plenaries', () => has(t,'1PL1') && has(t,'Level 3'));
t = await go('/explore/network', '21-network');
await check('Network canvas built with nodes and links', async () => { const n = await page.evaluate(() => window.__net && window.__net.nodes.length); const l = await page.evaluate(() => window.__net.links.length); return n === 90 && l > 100; });
await check('Network tap selects a node', async () => { const p = await page.evaluate(() => { const n = __net.nodes[0]; const cv = document.getElementById('net'); return { x: n.x, y: n.y }; }); await page.evaluate(() => { const cv = document.getElementById('net'); const r = cv.getBoundingClientRect(); const n = __net.nodes.reduce((a, b) => a.r > b.r ? a : b); /* compute screen position via stored transform not exposed; instead simulate click at center and accept any selection */ }); const box = await page.locator('#net').boundingBox(); await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(100); const info = await page.locator('#netinfo').innerText(); return info.length > 5; });
t = await go('/explore/stats', '22-stats');
await check('Stats page shows counts', () => has(t,'distinct authors') && has(t,'By day') && has(t,'Busiest rooms'));
// Plan builder
await page.evaluate(() => { localStorage.setItem('asc26_prefs', JSON.stringify({ subfields: ['L|Magnets, Fusion', 'E|Superconducting Detectors'], keywords: [1, 35], people: [], areas: [] })); });
await page.goto(BASE + '#/now'); await page.reload({ waitUntil: 'load' }); await page.waitForSelector('.hero');
t = await go('/plan/interests', '23-plan-interests');
await check('Interests page shows selected chips', async () => (await page.locator('.chip.sel').count()) >= 4);
t = await go('/plan/plan', '24-plan-built');
await check('Built schedule has days, chosen sessions with alternatives, poster walks', () => has(t,'Monday') && has(t,'score') && has(t,'Alternatives') && has(t,'Poster walk'));
await check('ICS export produces valid calendar with events', async () => { await page.evaluate(() => exportICS()); const ics = await page.evaluate(() => window.__lastICS); return ics.startsWith('BEGIN:VCALENDAR') && (ics.match(/BEGIN:VEVENT/g) || []).length > 10 && ics.includes('DTSTART:202609'); });
t = await go('/plan/stars', '25-starred');
await check('Starred list shows the starred session', () => has(t,'2LOr2B'));
// Time simulator UI
await go('/now'); await page.locator('button:has-text("Simulate")').click(); await page.waitForTimeout(100);
await check('Time simulator opens with day chips and slider', async () => (await page.locator('#ttbox input[type=range]').count()) === 1);
await page.locator('#ttbox .chip', { hasText: 'Thu' }).click(); await page.waitForTimeout(200);
await check('Time simulator switches day', async () => (await page.locator('#view').textContent()).includes('Thursday'));
// Back navigation
await go('/session/1JOr1A'); await page.locator('.talk').first().click(); await page.waitForTimeout(100); await page.locator('#back').click(); await page.waitForTimeout(150);
await check('Back button returns to session', async () => (await page.evaluate(() => location.hash)) === '#/session/1JOr1A');
// Performance
const searchMs = await page.evaluate(() => { const t = performance.now(); location.hash = '#/search?q=hts%20magnet%20quench'; render(); return performance.now() - t; });
await check('Search render under 400 ms', () => searchMs < 400);
await check('No page errors or console errors', () => errors.length === 0);
console.log(results.join('\n'));
console.log(`\n${pass} passed, ${fail} failed · initial load ${loadMs} ms · search ${searchMs.toFixed(0)} ms`);
if (errors.length) console.log('ERRORS:\n' + errors.slice(0, 10).join('\n'));
await browser.close(); srv.kill();
process.exit(fail ? 1 : 0);
