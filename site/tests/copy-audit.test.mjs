import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const audited = [
  'Check photo metadata before switching tools',
  'For photographers moving RAW files between tools, it shows which metadata and photo edit settings will survive.',
  'Opens a sample Lightroom → Immich report. Nothing is saved.',
  'Read image filenames and nearby XMP metadata sidecar files.',
  'The command-line program does not edit photos or upload metadata.',
  'The command-line program, field results, and JSON data-file report stay free under the MIT License.',
  'Sidecar Ledger checks photo metadata before you switch tools.',
  'It scans a folder and its XMP metadata sidecar files.',
  'It does not upload photos or metadata.',
  'To install from a local checkout, use a current stable Rust toolchain:',
  'npm run install:browser installs Chromium for browser checks.',
  'The optional website license check runs on the landing page only.'
];
const banned = /\b(leverage|seamless|effortless|robust|powerful|intuitive|reimagine|supercharge|delightful|journey|ecosystem|AI-powered)\b/i;

test('copy audit covers public prose with short, plain language', async () => {
  const [audit, home, readme] = await Promise.all([
    readFile(new URL('../../.factory/copy-audit.md', import.meta.url), 'utf8'),
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../../README.md', import.meta.url), 'utf8')
  ]);
  for (const phrase of audited) {
    const normalized = (value) => value.replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
    assert.ok(normalized(audit).includes(normalized(phrase)), `audit omits: ${phrase}`);
    assert.ok(normalized(home).includes(normalized(phrase)) || normalized(readme).includes(normalized(phrase)), `source lacks audited phrase: ${phrase}`);
    assert.ok(phrase.replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(/\s+/).length <= 22, `over 22 words: ${phrase}`);
  }
  assert.doesNotMatch(`${home}\n${readme}`, banned);
});
