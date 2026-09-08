// Smoke test: load the app from file:// (as the Android WebView does) and render key routes.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'node:path';
const url = 'file://' + path.resolve('app/www/index.html');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await (await browser.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(url); await page.waitForSelector('.hero');
let ok = 0;
for (const h of ['/program/2026-09-09', '/session/3LOr1A', '/search?q=quench', '/people', '/explore/network', '/plan/interests']) { await page.goto(url + '#' + h); await page.waitForTimeout(200); const t = await page.locator('#view').textContent(); if (t.length > 200) ok++; }
await page.evaluate(() => { toggleStar('3LOr1A'); }); const stored = await page.evaluate(() => localStorage.getItem('asc26_stars'));
console.log('routes ok', ok, '/ 6; localStorage on file://:', stored, '; errors:', errors.length ? errors : 'none');
await browser.close();
