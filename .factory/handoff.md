# Sidecar Ledger — repair handoff

Work order: `photo-edit-ledger-repair-3`
Repair commits: `7ab1f3c`, `b4c4189`
Deployment: Standard static — `https://photo-edit-ledger.sociobot.in/`
Completed: 2026-08-28

## Released repair

- The XMP scanner now treats every vocabulary outside its declared structural,
  standard-field, and known adjustment namespaces as `unknown_metadata`.
  It records only the namespace identifier in `opaque_namespaces`, marks the
  manifest `needs_attention`, and exits `2`; it never reads or reports opaque
  property values. This fixes the report's Phase One false-portable case and
  closes a further false-safe gap where an undeclared vocabulary under an
  Adobe-style registry URL had been exempted.
- Regression coverage includes the exact Phase One fixture in Rust, process
  integration, and installed-package consumer tests. A Rust regression also
  proves an undeclared `http://ns.adobe.com/unregistered-vendor/1.0/`
  vocabulary is unknown and that `opaque-secret-value` is absent from JSON.
- The generated service worker precaches all emitted JS, CSS, and WOFF2 shell
  assets and only falls back to HTML for navigation requests. Browser setup is
  reproducible through `npm run install:browser`, which `npm run test:a11y`
  invokes itself.
- A live-only PWA install failure was reproduced after the first deployment:
  the static-host CSP omitted `'self'` from `connect-src`, blocking the service
  worker's `cache.addAll` requests. The CSP now permits only same-origin plus
  the allowed Sociobot billing API; the site regression asserts that exact
  policy. The deployed worker activates, updates, and supports an interactive
  fresh-profile offline reload.

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

All commands passed from the committed repair. `npm test` ran 7 Rust unit and
6 Rust CLI integration tests plus 6 site tests. The consumer test packages the
crate, installs it into a fresh Cargo root, and verifies help, JSON tools,
invalid-input exit `1`, and the opaque Phase One namespace / exit `2` contract.
`cargo package --locked --list` produced the 22-file review package; the ready
artifact is `target/package/sidecar-ledger-0.1.0.crate`. Factory-held registry
credentials are required for any publish; do not publish from this repository.

`npm run build` produces `target/release/sidecar-ledger`, the reviewable crate,
and the static deployment root `dist/site/`. Built static budgets: entry JS
7.13 kB (2.76 kB gzip), CSS 11.08 kB (3.41 kB gzip), self-hosted WOFF2 fonts
74.42 kB total, and the original hero WebP 61.94 kB.

## Browser, privacy, and deployment evidence

- Local production preview passed `verify-url.sh`: 200, 649 ms browser load,
  no console errors, title/lang/one-h1/main/image-alt checks passed.
- `npm run test:a11y` passed with zero serious/critical Axe findings on `/`,
  `/privacy/`, and `/terms/`; 390 px overflow, visible keyboard focus, and a
  fresh-profile offline interactive reload all passed.
- Live post-deploy `verify-url.sh` passed: HTTPS 200, 836 ms browser load, no
  console errors, title/lang/one-h1/main/image-alt checks passed. The deployed
  `index.html` and `sw.js` SHA-256 values match `dist/site/`.
- Live desktop (1440 px) and mobile (390 px) checks passed: route selection by
  keyboard changed the result, Enter opened license restore and focused its
  input, no overflow or console errors occurred, and Axe found zero
  serious/critical violations on all three pages.
- A clean live profile registered an activated worker, `registration.update()`
  completed, and an offline reload still changed the route demo to
  `darktable → Immich (read-only)` without errors.
- Normal live load contacted only `photo-edit-ledger.sociobot.in`; no analytics
  or third-party font/runtime requests were observed. Live response policy has
  HSTS, `nosniff`, strict-origin referrer policy, denied camera/microphone/
  geolocation permissions, and CSP limited to `'self'` plus the Sociobot API.
  The optional license flow is the only outbound call and never receives photo
  metadata.

## Operational notes

- The CLI remains local-only and read-only: no image decoding, network client,
  or source-file mutation. Built-in capability declarations are conservative
  `2026.08` snapshots and should be reviewed when supported tools change.
- The static landing site stores only an optional local license token and its
  cached verification verdict. `/privacy` and `/terms` are deployed.
- No release-blocking gaps remain from verifier report `0b457492afb92424f02da187d27aabb971579f19`.
