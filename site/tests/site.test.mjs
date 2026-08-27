import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { assessRoute } from '../src/data.js';

const pages = ['index.html', 'privacy/index.html', 'terms/index.html'];

for (const page of pages) {
  test(`${page} has the required document structure`, async () => {
    const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.match(html, /<main(?:\s|>)/);
    assert.match(html, /class="skip-link"/);
  });
}

test('read-only Immich route warns on all sample fields', () => {
  const report = assessRoute('lightroom', 'immich-readonly');
  assert.equal(report.verdict, 'attention');
  assert.ok(report.fields.every((field) => field.state === 'lossy'));
});

test('generic XMP keeps standard fields and marks adjustments unknown', () => {
  const report = assessRoute('lightroom', 'generic-xmp');
  assert.equal(report.fields.find((field) => field.key === 'rating').state, 'portable');
  assert.equal(report.fields.find((field) => field.key === 'adjustments').state, 'unknown');
});
