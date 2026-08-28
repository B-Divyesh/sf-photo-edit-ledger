# Independent verification 4 — Sidecar Ledger

**Verdict: PASS**

- Candidate tested: `572d02f61d89568e5299789f4767f379e3d9448f`
- Branch: `main`; worktree clean before verification
- Live target: `https://photo-edit-ledger.sociobot.in/`
- Date: 2026-08-28
- Scope: researched brief, CLI publishing contract, landing PWA, and live deployment. No product code was modified.

## Result

The candidate meets the required local-first preflight job. It inventories an
archive and adjacent XMP, reports portable/lossy/unknown fields in human and
stable JSON output, keeps proprietary adjustment values opaque, and does not
mutate the scanned archive. The prior XML release blocker is fixed: a native
Lightroom `xml:lang` sidecar now returns exit 0 with portable description and
adjustments, rather than a false unknown-metadata risk.

The live deployment is an exact rebuilt-candidate match, not the historical
deployment-only failure. The production checkout returned `303` to Dodo.

## Clean install, quality gates, and artifact

From the clean candidate checkout, all passed:

```sh
npm ci
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm test
npm run build
npm run install:browser
npm run test:a11y
npm run test:consumer
cargo package --locked --list
```

`npm test` and the exact `npm run build` passed 8 Rust library tests, 7 CLI
integration tests, and 6 site tests. The build produced `dist/site`, the
release binary, and verified a 24-file crate. `npm run test:consumer` packaged
the crate, installed it into a fresh temporary Cargo root, and exercised the
installed public binary's help, tools JSON, invalid-input exit code,
opaque-vocabulary behavior, and `xml:lang` regression; it passed. No registry
publish was attempted. The ready-to-publish artifact is
`target/package/sidecar-ledger-0.1.0.crate` (27.6 KiB compressed).

## CLI end-to-end evidence

Fresh temporary inputs were used. SHA-256 checks of normal input files before
and after scanning were identical.

| Case | Exit | Observed result |
| --- | ---: | --- |
| Native Lightroom → Lightroom | 0 | Description and adjustments portable; no unknown metadata. |
| Lightroom → Immich read-only | 2 | Rating, description, keywords, color label, and adjustments all lossy. |
| Malformed unclosed XMP | 2 | One parse error and `needs_attention: true`; no false-safe manifest. |
| Repaired malformed XMP | 0 | Rating portable, demonstrating recovery. |
| `C.DNG` + `C.XMP` | 0 | 1 image, 1 sidecar, 1 pair; no orphans. |
| Empty folder | 2 | Explicit empty attention state. |
| Invalid `--from` | 1 | Clear `invalid value` diagnostic. |
| Existing `--output` | 1 | Overwrite refused; sentinel unchanged. |

The public `--help` is useful and `tools --json` reported the six documented
profiles. Packaged-consumer testing also confirmed proprietary values are not
printed in the report.

## Browser, PWA, accessibility, and performance

`npm run test:a11y` passed. Axe found **0 serious/critical** issues on `/`,
`/privacy/`, and `/terms/`; it also passed 390×844 overflow, focus, and
fresh-profile offline checks.

Fresh live Chromium checks at 1440×900 and 390×844 found one `h1`, one `main`,
valid title/lang/image alt text, no horizontal overflow, no console/page
errors, and a visible `2px solid` keyboard focus outline. Keyboard Arrow
selection changed the route and Enter activated Copy command (the unavailable
clipboard fallback selected the command). Normal first load requested only
`photo-edit-ledger.sociobot.in`. With reduced motion, the query matched and
animation durations were `1e-06s`. A fresh live service worker gained control,
completed `registration.update()`, and retained title plus interactive route
selection after offline reload.

Mobile Lighthouse against production preview: **99 Performance, 100
Accessibility, 100 Best Practices, 100 SEO**; FCP 1.5 s, LCP 1.8 s, TBT 0 ms,
CLS 0. Built budgets pass: initial JS 7.13 kB (2.76 kB gzip), CSS 11.08 kB
(3.41 kB gzip), self-hosted fonts 74.42 kB, and hero WebP 61.94 kB.

## Privacy, headers, and live identity

Source inspection found no CLI network client or archive write path. The only
website request code is opt-in license verification to the documented Sociobot
API after a stored/pasted license. Normal live loads had no third-party
requests; the site has no analytics. Privacy and terms routes return 200.

Live responses include HSTS, `nosniff`, strict-origin referrer policy, denied
camera/microphone/geolocation, and a same-origin-plus-Sociobot CSP. Hashed
assets have `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.

Rebuilt and live SHA-256 values match for home, `sw.js`, all linked home
assets, privacy, and terms. Home:
`f46a180e8c2c42fbafd41627d24e4c73247c03cb2557068cb72af9ccdd452811`.
Service worker:
`db41449241594aa249778da362e34a308bf10baaef5cad77ab4505056856aa19`.

## Defects by severity

None identified. The historical staging checkout and XML namespace defects are
not reproducible in this candidate or matching live deployment.

## Handoff

The factory retains registry credentials. It may publish the verified crate
through its normal process after `cargo package --locked` review.
