import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cp, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../..', import.meta.url));
const vite = fileURLToPath(new URL('../../node_modules/vite/bin/vite.js', import.meta.url));
const base = 'http://127.0.0.1:4175';
const apiBase = 'https://api.sociobot.in/api/v1';
let server;

function cli(args, options = {}) {
  return spawnSync('cargo', ['run', '--quiet', '--', ...args], { cwd: root, encoding: 'utf8', ...options });
}
function hash(text) { return createHash('sha256').update(text).digest('hex'); }
function apiUrl(token) { return `${apiBase}/products/photo-edit-ledger/verify?license=${encodeURIComponent(token)}`; }
async function freshPage(context) {
  const page = await context.newPage();
  await page.addInitScript(() => {
    const original = Storage.prototype.getItem;
    window.__storageReads = [];
    Storage.prototype.getItem = function(key) { window.__storageReads.push(String(key)); return original.call(this, key); };
  });
  return page;
}

before(async () => {
  server = spawn(process.execPath, [vite, '--config', 'site/vite.config.js', 'preview', '--host', '127.0.0.1', '--port', '4175'], { cwd: root, stdio: 'ignore' });
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await fetch(base)).ok) return; } catch {}
    await delay(100);
  }
  throw new Error('preview server did not start');
});
after(() => server?.kill('SIGTERM'));

test('@claim:handoff-report', () => {
  const output = cli(['scan', 'tests/fixtures/catalog', '--from', 'lightroom', '--to', 'immich', '--json']);
  assert.equal(output.status, 2);
  const report = JSON.parse(output.stdout);
  assert.equal(report.counts.images, 2); assert.equal(report.counts.paired, 1);
  assert.ok(report.assessments.some((item) => item.field === 'adjustments' && item.capability === 'lossy'));
  assert.ok(report.assessments.some((item) => item.capability === 'portable'));
});

test('@claim:read-only-local', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'sidecar-ledger-claim-')); const fixture = join(folder, 'catalog');
  await cp(join(root, 'tests/fixtures/catalog'), fixture, { recursive: true });
  const beforeHashes = await Promise.all((await readdir(fixture)).sort().map(async (name) => [name, hash(await readFile(join(fixture, name)))]));
  assert.equal(cli(['scan', fixture, '--from', 'lightroom', '--to', 'immich', '--json']).status, 2);
  const afterHashes = await Promise.all((await readdir(fixture)).sort().map(async (name) => [name, hash(await readFile(join(fixture, name)))]));
  assert.deepEqual(afterHashes, beforeHashes);
});

test('@claim:cli-private', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'sidecar-ledger-network-')); const audit = join(sandbox, 'connect.log');
  const guard = join(sandbox, 'net-audit.so');
  const compile = spawnSync('gcc', ['-shared', '-fPIC', '-o', guard, join(root, 'site/tests/fixtures/net-audit.c')], { encoding: 'utf8' });
  assert.equal(compile.status, 0, compile.stderr);
  const scan = spawnSync(join(root, 'target/debug/sidecar-ledger'), ['scan', join(root, 'tests/fixtures/catalog'), '--from', 'lightroom', '--to', 'immich', '--json'], { encoding: 'utf8', env: { ...process.env, LD_PRELOAD: guard, SIDECAR_LEDGER_NETWORK_AUDIT: audit } });
  assert.equal(scan.status, 2, scan.stderr);
  assert.equal(existsSync(audit) ? await readFile(audit, 'utf8') : '', '', 'scanner made no connect syscall');
});

test('@claim:versioned-json', () => {
  const output = cli(['scan', 'tests/fixtures/lightroom-native', '--from', 'lightroom', '--to', 'lightroom', '--json']);
  assert.equal(output.status, 0); assert.equal(JSON.parse(output.stdout).schema_version, '1');
});

test('@claim:demo-cli-real', async () => {
  const output = cli(['demo']); assert.equal(output.status, 2); assert.match(output.stdout, /Inventory: 2 images, 1 sidecars, 1 paired/);
  const path = output.stderr.match(/JSON handoff report: (.+)/)?.[1]; assert.ok(path && existsSync(path));
  assert.equal(JSON.parse(await readFile(path, 'utf8')).counts.paired, 1);
  const recording = await readFile(join(root, 'site/public/demo-scan.svg'), 'utf8');
  for (const line of ['sidecar-ledger demo', 'Inventory: 2 images, 1 sidecar, 1 paired', 'Verdict: ATTENTION', 'exit 2']) assert.match(recording, new RegExp(line));
});

test('@claim:opaque-values', () => {
  const output = cli(['scan', 'tests/fixtures/proprietary', '--from', 'generic-xmp', '--to', 'generic-xmp', '--json']);
  assert.equal(output.status, 2); assert.match(output.stdout, /http:\/\/www\.phaseone\.com\//); assert.doesNotMatch(output.stdout, /opaque-secret-value/);
});

test('@claim:exit-codes', () => {
  assert.equal(cli(['scan', 'tests/fixtures/lightroom-native', '--from', 'lightroom', '--to', 'lightroom']).status, 0);
  assert.equal(cli(['scan', 'tests/fixtures/catalog', '--from', 'lightroom', '--to', 'immich']).status, 2);
  assert.equal(cli(['scan', 'tests/fixtures/catalog', '--from', 'invalid', '--to', 'immich']).status, 1);
});

test('@claim:profiles', () => {
  const output = cli(['tools', '--json']); assert.equal(output.status, 0);
  assert.deepEqual(JSON.parse(output.stdout).map((item) => item.id), ['lightroom', 'darktable', 'immich', 'immich-readonly', 'snapseed', 'generic-xmp']);
});

test('@claim:demo-isolated', async () => {
  const browser = await chromium.launch(); const context = await browser.newContext(); const page = await freshPage(context);
  await page.addInitScript(() => { localStorage.setItem('sb_license:photo-edit-ledger', 'real-token'); localStorage.setItem('sb_license:photo-edit-ledger:verdict', JSON.stringify({ valid: false, checkedAt: 1 })); localStorage.setItem('real:sentinel', 'keep'); });
  await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' }); await page.selectOption('#source', 'darktable'); await page.click('#reset-demo');
  assert.deepEqual(await page.evaluate(() => ({ token: localStorage.getItem('sb_license:photo-edit-ledger'), verdict: localStorage.getItem('sb_license:photo-edit-ledger:verdict'), sentinel: localStorage.getItem('real:sentinel'), demoKeys: Object.keys(localStorage).filter((key) => key.startsWith('demo:')) })), { token: 'real-token', verdict: JSON.stringify({ valid: false, checkedAt: 1 }), sentinel: 'keep', demoKeys: [] });
  assert.equal(await page.locator('#route-title').textContent(), 'Lightroom → Immich'); await browser.close();
});

test('@claim:demo-private', async () => {
  const browser = await chromium.launch(); const context = await browser.newContext(); const page = await context.newPage(); const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' }); await page.selectOption('#destination', 'snapseed'); await page.click('#copy-command');
  assert.ok(requests.every((url) => new URL(url).origin === base)); await browser.close();
});

test('@claim:offline-demo', async () => {
  const browser = await chromium.launch(); const context = await browser.newContext(); const page = await context.newPage();
  await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' }); await page.evaluate(() => navigator.serviceWorker.ready); await page.reload({ waitUntil: 'networkidle' }); await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true); await page.reload({ waitUntil: 'domcontentloaded' }); await page.selectOption('#source', 'darktable'); assert.equal(await page.locator('#route-title').textContent(), 'darktable → Immich'); await browser.close();
});

test('@claim:license-scope', async () => {
  const browser = await chromium.launch(); const context = await browser.newContext(); const calls = [];
  await context.route(apiUrl('fixture-token'), async (route) => { calls.push({ url: route.request().url(), method: route.request().method(), postData: route.request().postData() }); await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) }); });
  const page = await freshPage(context);
  await page.addInitScript(() => { localStorage.setItem('sb_license:photo-edit-ledger', 'fixture-token'); localStorage.setItem('sb_license:photo-edit-ledger:verdict', JSON.stringify({ valid: true, checkedAt: 1 })); });
  await page.goto(base, { waitUntil: 'networkidle' }); assert.deepEqual(calls, [{ url: apiUrl('fixture-token'), method: 'GET', postData: null }]);
  for (const path of ['/demo/', '/privacy/', '/terms/']) {
    const routePage = await freshPage(context); await routePage.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    assert.ok(!(await routePage.evaluate(() => window.__storageReads)).includes('sb_license:photo-edit-ledger'), `${path} did not read the real token`);
  }
  assert.equal(calls.length, 1); await browser.close();
});

test('@claim:paid-price', async () => {
  const [home, terms] = await Promise.all([fetch(base).then((r) => r.text()), fetch(`${base}/terms/`).then((r) => r.text())]);
  assert.match(home, /Buy Pro · \$19 once — opens secure checkout/); assert.match(terms, /Pro costs \$19 once/);
});

test('@claim:merchant-refund', async () => {
  const browser = await chromium.launch(); const context = await browser.newContext(); let release; const gate = new Promise((resolve) => { release = resolve; });
  await context.route(apiUrl('paid-token'), async (route) => { await gate; await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'revoked' }) }); });
  const page = await context.newPage(); await page.addInitScript(() => { localStorage.setItem('sb_license:photo-edit-ledger', 'paid-token'); localStorage.setItem('sb_license:photo-edit-ledger:verdict', JSON.stringify({ valid: true, checkedAt: 1 })); });
  await page.goto(base, { waitUntil: 'domcontentloaded' }); await page.locator('#unlocked-view').waitFor({ state: 'visible' }); assert.equal(await page.locator('#recipe-route').count(), 1);
  release(); await page.locator('#locked-view').waitFor({ state: 'visible' }); assert.equal(await page.locator('#unlocked-view').isHidden(), true); await browser.close();
});

test('@claim:migration-steps', async () => {
  const browser = await chromium.launch(); const context = await browser.newContext(); const token = 'route-token';
  await context.route(apiUrl(token), (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) }));
  const page = await context.newPage(); await page.addInitScript((value) => { localStorage.setItem('sb_license:photo-edit-ledger', value); localStorage.setItem('sb_license:photo-edit-ledger:verdict', JSON.stringify({ valid: true, checkedAt: 1 })); }, token);
  await page.goto(base, { waitUntil: 'networkidle' }); await page.locator('#unlocked-view').waitFor({ state: 'visible' });
  const visibleSteps = new Set();
  for (const route of ['lightroom:immich', 'lightroom:snapseed', 'darktable:immich', 'darktable:snapseed', 'immich:lightroom', 'generic-xmp:immich']) { await page.selectOption('#recipe-route', route); const steps = await page.locator('#recipe-content li').allTextContents(); assert.equal(steps.length, 4); visibleSteps.add(steps.join('|')); }
  assert.equal(visibleSteps.size, 6); await browser.close();
});

test('@claim:legal-routes', async () => {
  for (const [path, title] of [['/privacy/', 'Privacy — Sidecar Ledger'], ['/terms/', 'Terms — Sidecar Ledger']]) { const response = await fetch(`${base}${path}`); assert.equal(response.status, 200); assert.match(await response.text(), new RegExp(`<title>${title}</title>`)); }
});

test('@claim:free-mit', async () => {
  const cargo = await readFile(join(root, 'Cargo.toml'), 'utf8'); const license = await readFile(join(root, 'LICENSE'), 'utf8');
  assert.match(cargo, /^license = "MIT"$/m); assert.match(license, /Permission is hereby granted, free of charge/); assert.equal(cli(['scan', 'tests/fixtures/lightroom-native', '--from', 'lightroom', '--to', 'lightroom', '--json']).status, 0);
});

test('@claim:build-output', () => { for (const path of ['dist/site/index.html', 'dist/site/demo/index.html', 'target/release/sidecar-ledger', 'target/package/sidecar-ledger-0.1.0.crate']) assert.ok(existsSync(join(root, path)), `${path} exists`); });

test('@claim:checkout-install', async () => {
  const installRoot = await mkdtemp(join(tmpdir(), 'sidecar-ledger-install-'));
  const result = spawnSync('cargo', ['install', '--path', root, '--root', installRoot, '--locked'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr); assert.ok(existsSync(join(installRoot, 'bin', 'sidecar-ledger')));
});

test('@claim:browser-install', () => {
  const result = spawnSync('npm', ['run', 'install:browser'], { cwd: root, encoding: 'utf8' }); assert.equal(result.status, 0, result.stderr);
});
