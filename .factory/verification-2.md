# Independent verification 2 — Sidecar Ledger

**Verdict: FAIL**

- Candidate tested: `12e4b00f11c4b714173f617a26dc9b8600b6bf10`
- Branch and target: `main`; `https://photo-edit-ledger.sociobot.in/`
- Date: 2026-08-27
- Method: fresh detached clone of the public repository, then independent CLI,
  package-consumer, production-site, deployment, accessibility, privacy, PWA,
  response-policy, and performance checks. No product code was changed.

## Release decision

Do not release this candidate. The scanner returns a clean, portable result
for a syntactically valid sidecar containing unrecognized proprietary metadata.
This is a false-safe result for the product's central job: warn a photographer
before metadata or edits can be lost at a tool boundary. It violates both the
brief's requirement to report unknown fields and its requirement to treat
proprietary edit metadata as opaque.

The deployed static site is an exact match for the rebuilt candidate. The
previous deployment-only concern is therefore not present, but it does not
alter the CLI release failure.

## Clean-checkout gates

Fresh clone and detached commit check:

```sh
git clone https://github.com/B-Divyesh/sf-photo-edit-ledger.git <clean-dir>
git -C <clean-dir> checkout --detach 12e4b00f11c4b714173f617a26dc9b8600b6bf10
npm ci
npm test
npm run test:consumer
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --locked --list
```

Results:

- `npm ci`: passed; 20 packages audited, zero vulnerabilities.
- `npm test`: passed: 5 Rust unit tests, 5 Rust CLI integration tests, and 6
  site tests.
- `npm run test:consumer`: passed. It packaged 20 files (92.8 KiB unpacked),
  installed `target/package/sidecar-ledger-0.1.0` into a fresh Cargo root, and
  exercised the installed binary's help, `tools --json`, and invalid-input
  exit-code contract.
- `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings`: passed.
- Exact `npm run build`: passed. It ran the tests, made the release binary,
  verified the publishable crate, and produced `dist/site/`.
- `npm run test:a11y` initially failed after only `npm ci` because Playwright's
  Chromium executable is not installed by the repository. After
  `npx playwright install chromium`, the intended test passed: no axe
  serious/critical findings on `/`, `/privacy/`, or `/terms/`; 390px overflow
  and initial focus checks passed.

## Independent CLI evidence

All cases used the built release binary. SHA-256 checksums of every input image
and XMP file before and after scans were identical. Existing output files were
refused and preserved verbatim.

| Case | Observed result | Status |
| --- | --- | --- |
| Normal Lightroom → Immich | One DNG plus XMP rating, description, keywords, color label, and Camera Raw adjustment; JSON reported the three standard fields portable, color label unknown, adjustment lossy, exit 2, and `source_files_changed: false`. | Pass |
| **Unrecognized vendor XMP** | One DNG plus a well-formed XMP `c1:Adjustment` in namespace `http://www.phaseone.com/`; generic-XMP → generic-XMP returned exit **0**, empty `assessments`, empty asset fields, no errors, `needs_attention: false`, and a portable verdict. | **Fail** |
| Malformed XMP | Unclosed XMP returned exit 2, a parse error, and `needs_attention: true`. | Pass |
| Uppercase pairing | `C.DNG` plus `C.XMP` paired correctly and found rating 0. | Pass |
| Empty folder / image without sidecar | Each returned exit 2 with the appropriate attention inventory/recommendation. | Pass |
| Invalid profile | Returned exit 1 and Clap's invalid-value diagnostic, as documented. | Pass |
| Existing `--output` | Returned exit 1; pre-existing file remained `sentinel`. | Pass |

### Blocking defect: unknown proprietary metadata is silently treated as safe

The scanner only classifies a small allow-list of adjustment namespaces. A
valid XMP sidecar from another editor can therefore contain opaque metadata
while `parse_xmp` records no field or namespace. With all image/sidecar counts
otherwise complete, `needs_attention` becomes false and the CLI exits 0.

This is not a harmless omission: a photographer is explicitly using this tool
to decide whether a handoff will preserve edits. The report must never call
that situation portable. Record an `unknown` opaque field/namespace (without
printing its value), include it in the JSON manifest, set attention/exit 2,
and add the regression fixture above. Consider a conservative unknown result
for any non-standard metadata namespace that is not structurally RDF/XMP/DC.

## Website, accessibility, and visual checks

The live site was checked at 1440px desktop and 390x844 mobile. Visual review
found the documented ceramic/archive system intact, responsive stacking without
clipped controls, and readable content. The candidate supplies one h1, title,
`lang=en`, and a main landmark.

- Keyboard only: changing source/destination selects produced
  `darktable → Generic XMP` and the matching generated command; Enter operated
  the restore control and focused the license field. The copy-command control
  had `rgb(23, 33, 30) solid 2px` visible focus.
- Reduced-motion context reported `animation-duration: 1e-06s` and
  `scroll-behavior: auto`.
- No page errors or error-console messages occurred during live desktop or
  mobile navigation.
- Axe on live `/`, `/privacy/`, and `/terms/` at both desktop and mobile found
  zero serious or critical violations.

## PWA result

`navigator.serviceWorker.ready` registered the live-equivalent local preview
at `/sw.js`, and `registration.update()` succeeded. However, from a fresh
browser profile, after the initial online load, forcing offline and reloading
caused two console errors:

```text
Failed to load module script: Expected a JavaScript-or-Wasm module script but
the server responded with a MIME type of "text/html".
```

The title and h1 remain available from cached HTML, but the JavaScript modules
are not in the precache and the service worker falls back to `/` for asset
requests. The interactive site is therefore broken on that offline reload.
Precache the hashed JS/CSS/font shell assets (or use an asset-aware strategy
that never returns navigation HTML for scripts) and add a fresh-profile offline
reload regression.

## Deployment identity, privacy, headers, and performance

The rebuilt candidate and live deployment are byte-identical for the checked
HTML, service worker, and entry JavaScript:

```text
f46a180e8c2c42fbafd41627d24e4c73247c03cb2557068cb72af9ccdd452811  index.html
eb4b9d6cb15023747a9525d555b3d787390630ba72d5281e74e54255842097fd  sw.js
e40adc79d65919db9f7e45fd109dc7ef409ced09af6246f2f60053d9fbc90882  main-4PzQ6_yC.js
```

- A normal live load requested only `https://photo-edit-ledger.sociobot.in`;
  no analytics, third-party fonts, or third-party runtime requests appeared.
  Source/dependency inspection found no CLI HTTP client or telemetry. The
  optional license flow alone uses local storage and the allowed Sociobot API;
  it does not receive image metadata.
- The live checkout endpoint returned `303` to a Dodo hosted checkout without
  initiating payment. It uses the production `api.sociobot.in` route, not the
  old pilot route.
- Live responses provide HSTS, nosniff, strict-origin referrer policy, denied
  camera/microphone/geolocation permissions, and a restrictive CSP. Hashed
  assets use `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- Built budgets: JS 7,976 B total (entry 7,127 B), CSS 11,077 B, self-hosted
  WOFF2 74,420 B, and hero WebP 61,944 B. All meet the stated budgets.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 92; FCP 1.4 s, LCP 1.7 s, TBT 0 ms, CLS 0.

## Defects by severity

### HIGH

1. Unrecognized, well-formed proprietary XMP is silently omitted and yields a
   portable exit-0 manifest. This can advise a photographer that an edit is
   safe to move when it is not.

### MEDIUM

1. Fresh-profile offline PWA reload serves HTML for uncached module assets,
   creates console errors, and leaves the interactive site unavailable offline.

### LOW

1. `npm run test:a11y` is not runnable immediately after the documented clean
   `npm ci`: the required Playwright browser is neither provisioned nor
   documented. Make browser installation an explicit CI/bootstrap step.

## Required next steps

Fix the conservative handling of all unrecognized metadata namespaces and add
an exact CLI regression. Repair service-worker precaching/offline asset
fallback, add a clean-profile offline reload test, and make the browser test
bootstrap reproducible. Re-run this full verification against the resulting
commit and deployment.
