import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { assessRoute, recipes } from '../src/data.js';

const pages = [
  ['index.html', 'Sidecar Ledger — check photo metadata'],
  ['demo/index.html', 'Demo — Sidecar Ledger'],
  ['privacy/index.html', 'Privacy — Sidecar Ledger'],
  ['terms/index.html', 'Terms — Sidecar Ledger'],
  ['404/index.html', 'Page not found — Sidecar Ledger']
];

for (const [page, title] of pages) {
  test(page + ' has a complete route document', async () => {
    const html = await readFile(new URL('../' + page, import.meta.url), 'utf8');
    assert.match(html, /<html lang="en">/);
    assert.match(html, new RegExp('<title>' + title + '</title>'));
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.match(html, /<main(?:\s|>)/);
    assert.match(html, /class="skip-link"/);
    assert.match(html, /rel="canonical"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /name="twitter:card"/);
    assert.match(html, /apple-touch-icon/);
    assert.match(html, /Built by Param Factory · v0\.1\.0/);
  });
}

test('landing page puts the sample action and plain wording first', async () => {
  const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(home, /Check photo metadata before switching tools/);
  assert.match(home, /Try it with sample data/);
  assert.match(home, /Opens a sample Lightroom → Immich report\. Nothing is saved\./);
  assert.match(home, /<h2 id="how-title">Scan a folder, then keep the report<\/h2>/);
  assert.match(home, /Keep your originals and test a small copy/);
});

test('terminal recording is an image, never a framed same-origin document', async () => {
  const [home, config] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8')
  ]);
  assert.match(home, /<img class="recording-image" src="\/demo-scan\.svg"/);
  assert.doesNotMatch(home, /<(?:iframe|object|embed)\b/i);
  assert.match(config, /frame-ancestors 'none'/);
});

test('demo has its required isolated controls and no license panel', async () => {
  const demo = await readFile(new URL('../demo/index.html', import.meta.url), 'utf8');
  assert.match(demo, /Demo — sample data, nothing is saved/);
  assert.match(demo, /Reset demo/);
  assert.match(demo, /Start for real/);
  assert.doesNotMatch(demo, /sb_license|buy-link|license-token/);
});

test('404 config returns the ceramic error page instead of the home page', async () => {
  const [config, page] = await Promise.all([
    readFile(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8'),
    readFile(new URL('../404/index.html', import.meta.url), 'utf8')
  ]);
  assert.match(config, /"404"\s*:\s*\{\s*"rewrite"\s*:\s*"\/404\/index\.html",\s*"statusCode"\s*:\s*404/);
  assert.match(page, /Return home/);
});

test('read-only Immich route warns on all sample fields', () => {
  const report = assessRoute('lightroom', 'immich-readonly');
  assert.equal(report.verdict, 'attention');
  assert.ok(report.fields.every((field) => field.state === 'lossy'));
});

test('six distinct migration routes have their own steps', () => {
  for (const route of ['lightroom:immich', 'lightroom:snapseed', 'darktable:immich', 'darktable:snapseed', 'immich:lightroom', 'generic-xmp:immich']) {
    assert.ok(Array.isArray(recipes[route]), route);
    assert.equal(recipes[route].length, 4);
  }
});

test('production billing and security routes use the approved endpoint', async () => {
  const [home, client, config, sitemap] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/main.js', import.meta.url), 'utf8'),
    readFile(new URL('../public/staticwebapp.config.json', import.meta.url), 'utf8'),
    readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
  ]);
  const liveApi = 'https://api.sociobot.in/api/v1';
  assert.match(home, new RegExp(liveApi + '/products/photo-edit-ledger/checkout'));
  assert.match(client, new RegExp("const apiBase = '" + liveApi + "'"));
  assert.match(config, /connect-src 'self' https:\/\/api\.sociobot\.in/);
  assert.match(sitemap, /https:\/\/photo-edit-ledger\.sociobot\.in\/demo\//);
  for (const value of [home, client, config]) assert.doesNotMatch(value, /pilot-api\.sociobot\.in/);
});
