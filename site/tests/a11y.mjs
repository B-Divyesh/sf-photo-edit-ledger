import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const vite = fileURLToPath(new URL('../../node_modules/vite/bin/vite.js', import.meta.url));
const server = spawn(process.execPath, [vite, '--config', 'site/vite.config.js', 'preview', '--host', '127.0.0.1', '--port', '4174'], { cwd: root, stdio: 'ignore' });

try {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { if ((await fetch('http://127.0.0.1:4174')).ok) break; } catch {}
    await delay(100);
  }
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404/']) {
    await page.goto(`http://127.0.0.1:4174${path}`, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((item) => ['serious', 'critical'].includes(item.impact));
    if (serious.length) {
      throw new Error(`${path}: ${serious.map((item) => `${item.id}: ${item.nodes.map((node) => node.target.join(' ')).join(', ')}`).join('; ')}`);
    }
  }

  await page.goto('http://127.0.0.1:4174/demo/', { waitUntil: 'networkidle' });
  for (const selector of ['#reset-demo', '.demo-banner a', 'header .wordmark', 'footer .wordmark']) {
    const box = await page.locator(selector).boundingBox();
    if (!box || box.width < 44 || box.height < 44) throw new Error(`${selector} is smaller than the 44px touch target`);
  }

  await page.goto('http://127.0.0.1:4174/', { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) throw new Error('homepage has horizontal overflow at 390px');
  await page.keyboard.press('Tab');
  const focusVisible = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement);
    return style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) >= 2;
  });
  if (!focusVisible) throw new Error('first keyboard target has no visible focus outline');
  if (errors.length) throw new Error(`browser console errors: ${errors.join('; ')}`);

  await page.goto('http://127.0.0.1:4174/privacy/', { waitUntil: 'networkidle' });
  if (await page.evaluate(() => document.activeElement?.tagName) !== 'H1') throw new Error('route navigation did not focus its h1');
  await page.goto('http://127.0.0.1:4174/?demo=1', { waitUntil: 'networkidle' });
  if (!page.url().endsWith('/demo/')) throw new Error('?demo=1 did not enter the isolated demo route');

  // A new incognito context gives this regression a fresh service-worker and
  // Cache Storage profile. The second online reload becomes SW-controlled;
  // the following offline reload must retain both the module and stylesheet.
  const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const offlinePage = await offlineContext.newPage();
  const offlineErrors = [];
  offlinePage.on('pageerror', (error) => offlineErrors.push(String(error)));
  offlinePage.on('console', (message) => {
    if (message.type() === 'error') offlineErrors.push(message.text());
  });
  await offlinePage.goto('http://127.0.0.1:4174/demo/', { waitUntil: 'networkidle' });
  await offlinePage.evaluate(() => navigator.serviceWorker.ready);
  await offlinePage.reload({ waitUntil: 'networkidle' });
  await offlinePage.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await offlineContext.setOffline(true);
  await offlinePage.reload({ waitUntil: 'domcontentloaded' });
  await offlinePage.waitForSelector('#route-title');
  await offlinePage.selectOption('#source', 'darktable');
  const routeTitle = await offlinePage.locator('#route-title').textContent();
  if (routeTitle !== 'darktable → Immich') {
    throw new Error(`offline route demo did not stay interactive: ${routeTitle}`);
  }
  if (offlineErrors.length) {
    throw new Error(`offline reload console errors: ${offlineErrors.join('; ')}`);
  }
  await offlineContext.close();
  await browser.close();
  console.log('axe: 0 serious/critical violations on all routes; mobile, focus, demo redirect, and fresh-profile offline PWA checks passed');
} finally {
  server.kill('SIGTERM');
}
