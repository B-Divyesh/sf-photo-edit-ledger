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

  for (const path of ['/', '/privacy/', '/terms/']) {
    await page.goto(`http://127.0.0.1:4174${path}`, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((item) => ['serious', 'critical'].includes(item.impact));
    if (serious.length) {
      throw new Error(`${path}: ${serious.map((item) => `${item.id}: ${item.nodes.map((node) => node.target.join(' ')).join(', ')}`).join('; ')}`);
    }
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
  await browser.close();
  console.log('axe: 0 serious/critical violations on /, /privacy/, and /terms/; mobile overflow and focus checks passed');
} finally {
  server.kill('SIGTERM');
}
