# Sidecar Ledger — build handoff

Work order: `photo-edit-ledger-build-1`  
Version: `0.1.0`  
Completed: 2026-08-27

## What shipped

- A Rust `sidecar-ledger` binary with `scan` and `tools` commands, useful help,
  stable JSON, human output, explicit report-file writes, and meaningful exit
  codes (`0` portable, `2` review findings, `1` failure).
- Recursive RAW/DNG/JPEG/TIFF/HEIF/PNG and XMP inventory, including common and
  double-extension sidecar pairs, missing sidecars, orphan sidecars, and parse
  warnings.
- Field detection for ratings, descriptions, keywords, color labels, and
  proprietary adjustment namespaces. Adjustment values are never included in
  output. Each assessment records source, destination, and combined capability.
- Built-in versioned profiles for Lightroom, darktable, writable Immich,
  read-only Immich, Snapseed, and generic XMP.
- No archive write path. The only write option is an explicit `--output`; it
  uses create-new semantics and refuses to overwrite an existing report.
- A Vite landing/docs site with install guidance, interactive capability demo,
  deterministic recorded fixture result, offline state, service worker,
  responsive 390px layout, privacy page, and terms page.
- A $19 one-time Pro route pack. Core risk checks and export stay free. Checkout,
  return-token capture, local storage, at-most-daily verification, optimistic
  cached unlock, offline handling, revocation, and paste-to-restore follow the
  Sociobot billing contract.
- An original generated ceramic sidecar still-life at
  `site/public/ceramic-sidecars.webp` (61 KB). Prompt and generator provenance
  are recorded beside the asset and in `.factory/design.md`.

## Build and verification

Exact work-order build command:

```sh
npm install
npm run build
```

Outputs:

- Static deploy root: `dist/site/` (`dist/site/index.html` exists)
- Release binary: `target/release/sidecar-ledger` (1.3 MB on linux/amd64)
- Publishable crate: `target/package/sidecar-ledger-0.1.0.crate`

Commands run successfully:

```sh
npm test
cargo clippy --all-targets -- -D warnings
npm run build
npm run test:a11y
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/evidence
CHROME_PATH=/opt/pw-browsers/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell npx lighthouse http://127.0.0.1:4173 --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' --only-categories=performance,accessibility,best-practices,seo
```

Verification results:

- Rust: 6 tests passed (unit + process-level CLI)
- Site: 5 tests passed
- Axe 4.13: 0 serious/critical violations on `/`, `/privacy/`, and `/terms/`
- Browser smoke: no console/page errors, one H1, title/lang/main/alt present;
  desktop and 390×844 screenshots reviewed
- Keyboard/mobile: visible ≥2px focus; no horizontal overflow at 390px
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100
- FCP 1.5s; LCP 1.8s; TBT 0ms; CLS 0; Speed Index 1.5s
- Initial app payload: 7.13 KB JS, 11.08 KB CSS, 74.42 KB fonts, 61 KB hero
- `cargo package --locked` verified the publishable crate

## Operational notes / known gaps

- Capability declarations are intentionally conservative snapshots labeled
  `2026.08`; application updates require evidence review and a version bump.
- The CLI reads XMP sidecars, not embedded image metadata or proprietary catalog
  databases. A missing sidecar is therefore reported as attention, not guessed.
- Image pixels are never decoded; the tiny image files in tests are deliberate
  placeholders.
- The website currently uses the required staging endpoint at
  `https://pilot-api.sociobot.in`. At product registration/release, the factory
  must switch `apiBase` and the checkout link to `https://api.sociobot.in`.
- Registry credentials are factory-owned. Publish later with `cargo publish`
  after reviewing `cargo package --list`; no publish was attempted here.
