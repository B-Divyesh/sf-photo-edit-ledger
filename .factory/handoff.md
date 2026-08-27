# Sidecar Ledger — repair handoff

Work order: `photo-edit-ledger-repair-2`
Code repair commit: `065f345f57c60903b0db693837d322d2acc75e93`
Deployment class: Standard static

## Released repair

- Unrecognized XMP namespaces now add the `unknown_metadata` field to the JSON
  manifest, preserve only the namespace identifier in `opaque_namespaces`, and
  produce `needs_attention: true` / CLI exit `2`. Opaque property and text
  values are never read into the report.
- Added direct Rust, installed-package consumer, and fixture regressions using
  a Phase One namespace plus an `opaque-secret-value`; all assert that the
  value is absent while the unknown classification and exit status are present.
- The build now creates `sw.js` from the final Vite output and precaches every
  emitted JS, CSS, and WOFF2 shell asset. Its fetch fallback applies only to
  navigations, so a missing asset can never be served as HTML.
- `npm run install:browser` explicitly installs Playwright Chromium and
  `npm run test:a11y` invokes it. The browser check uses a fresh profile,
  takes the page offline, reloads, checks console errors, and changes the demo
  route to prove the JavaScript remains interactive.

## Run and verify

```sh
npm ci
npm test
npm run test:consumer
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --locked --list
npm run test:a11y
```

All commands passed from the committed tree. `npm run build` produces the
release binary, `target/package/sidecar-ledger-0.1.0.crate`, and the Standard
static deployment root at `dist/site/`. The package consumer test installs
that generated crate into a fresh Cargo root before exercising its CLI.

Local production `verify-url.sh` passed: HTTP 200, 774 ms browser load, no
console errors, title/lang/one-h1/main/image-alt checks passed. The browser
suite found zero serious or critical Axe findings on `/`, `/privacy/`, and
`/terms/`, and passed 390 px mobile overflow, keyboard focus, and fresh-profile
offline PWA checks.

Mobile Lighthouse against the production build: Performance 99, Accessibility
100, Best Practices 100, SEO 100; FCP 1.5 s, LCP 1.8 s, TBT 0 ms, CLS 0.
Built assets remain within budget: entry JS 7.13 kB, CSS 11.08 kB, self-hosted
fonts 74.42 kB, hero WebP 61.94 kB.

## Operational notes

- Publish review command: `cargo package --locked --list`. Do not publish the
  crate from this worker; registry credentials remain factory-owned.
- The CLI remains local-only and read-only. It does not decode pixels, upload
  image metadata, or mutate scanned source files.
- The only optional website storage is the locally stored Pro license and its
  cached verification verdict; the static PWA shell contains no tracking.
- Deployed as Standard static to `https://photo-edit-ledger.sociobot.in/`.
  The live host serves the generated asset-aware worker (`sidecar-ledger-shell-
  a45qdk`), and a live `verify-url.sh` check passed: HTTPS 200, 930 ms browser
  load, no console errors, and title/lang/one-h1/main/image-alt checks passed.
