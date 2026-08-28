# Independent verification 3 — Sidecar Ledger

**Verdict: FAIL**

- Candidate: `a3a24bdafd80787f97678ff076c7c7aa8bd942b9`
- Tested branch/URL: `main` / `https://photo-edit-ledger.sociobot.in/`
- Date: 2026-08-28
- Method: detached clean clone, local release binary and consumer package,
  rebuilt production site, and fresh live-browser checks. No product code was
  changed during verification.

## Release decision

Do not release this candidate as the portable preflight promised in the brief.
It handles genuinely proprietary XMP conservatively now, but a valid standard
XMP `xml:lang` attribute is interpreted as an **unresolved XMP namespace**.
Consequently, an ordinary Lightroom sidecar with a `dc:description` is reported
as having `unknown_metadata`; even a `lightroom -> lightroom` scan exits `2`
instead of the expected portable result. It also causes the Camera Raw
adjustment field on that route to be marked `unknown` rather than portable.

That is a high-severity false risk in the core job: the tool is meant to tell a
photographer which fields will survive a handoff. `xml` is predefined by the
XML Namespaces specification and must be resolved to
`http://www.w3.org/XML/1998/namespace`, not treated as opaque metadata.

The earlier deployment-only service-worker failure is **not reproduced**. The
live deployment matches the rebuilt candidate byte-for-byte and passes fresh
service-worker update and offline-interactive reload checks.

## Clean-checkout quality gates

A clean detached clone was made from this repository at the candidate SHA, then
`npm ci` was run before the commands below.

```sh
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
npm run test:consumer
cargo package --locked --list
npm run test:a11y
```

All commands passed.

- `npm test`: 7 Rust library tests, 6 Rust CLI integration tests, and 6 site
  tests passed.
- `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings` passed.
- The exact `npm run build` passed: it reran the test suite, built the release
  binary, verified `cargo package --locked`, and emitted `dist/site/`.
- `npm run test:consumer` created the 22-file / 100.9 KiB unpacked crate,
  installed it into a fresh Cargo root, and exercised the installed binary's
  help, JSON tools listing, invalid-profile exit `1`, and opaque Phase One
  namespace/exit `2` behavior.
- `npm run test:a11y` installed its declared Chromium dependency and passed:
  no axe serious/critical results on `/`, `/privacy/`, or `/terms/`; 390px
  overflow, focus, and fresh-profile offline PWA checks passed.

The ready-to-review artifact is
`target/package/sidecar-ledger-0.1.0.crate`; publishing was not attempted.

## Independent CLI evidence

All cases used `target/release/sidecar-ledger`. SHA-256 hashes of every copied
normal-case image and sidecar were identical before and after scanning.

| Case | Result | Assessment |
| --- | --- | --- |
| Lightroom -> Immich fixture | Exit 2; expected standard fields portable, color label unknown, Camera Raw adjustment lossy, plus spurious unknown metadata. | Fails as an exact classification result |
| Phase One proprietary sidecar | Exit 2; `unknown_metadata`; namespace `http://www.phaseone.com/`; opaque value absent. | Pass |
| Empty directory | Exit 2 and attention state. | Pass |
| Image without sidecar | Exit 2 and missing-sidecar inventory. | Pass |
| Malformed XMP | Exit 2 with a parse warning and recovery recommendation. | Pass |
| Uppercase `C.DNG` + `C.XMP`, rating 0 | Correctly paired; portable generic-XMP result and exit 0. | Pass |
| Invalid `--from bogus` | Exit 1 with Clap invalid-value diagnostic. | Pass |
| Existing `--output` | Exit 1; existing file remained exactly `keep`. | Pass |
| Lightroom -> Lightroom, ordinary fixture | Exit 2; adjustments and `unknown_metadata` both unknown. | **Fail** |

Reproduction of the blocker:

```sh
target/release/sidecar-ledger scan tests/fixtures/catalog \
  --from lightroom --to lightroom --json
```

The well-formed fixture declares standard XMP, DC, RDF, and Camera Raw
vocabularies and uses the normal `xml:lang="x-default"` on a description.
Observed output includes:

```json
{
  "field": "unknown_metadata",
  "capability": "unknown"
}
```

and the asset lists `"unresolved XMP namespace"`. `xml:lang` is structural
language metadata, not an unrecognized photographer field. Because its
synthetic namespace is added to the common namespace list, the Lightroom
profile also rejects the otherwise-native Camera Raw declaration as foreign.

### Required repair

Resolve the `xml` prefix without an explicit declaration to `XML_NAMESPACE`
(or recognize `xml:lang` as structural before generic unknown handling), so it
does not contaminate the adjustment namespace set used for profile evaluation.
Add an end-to-end fixture/assertion for a `dc:description`
with `xml:lang` proving `lightroom -> lightroom` has no spurious unknown field
and reports its native Camera Raw adjustment portable. Re-run this verification
against the repaired commit and deployment.

## Live deployment, privacy, accessibility, and PWA evidence

The candidate's rebuilt deployment files exactly match the live files by
SHA-256:

| File | SHA-256 |
| --- | --- |
| `index.html` | `f46a180e8c2c42fbafd41627d24e4c73247c03cb2557068cb72af9ccdd452811` |
| `sw.js` | `db41449241594aa249778da362e34a308bf10baaef5cad77ab4505056856aa19` |
| `assets/main-4PzQ6_yC.js` | `e40adc79d65919db9f7e45fd109dc7ef409ced09af6246f2f60053d9fbc90882` |
| `assets/styles-BWwvt-D1.css` | `1ac00214fb0c4fff2a20ca20c08591c64739db64c8693b7bc895d433f7cfd468` |

Fresh Playwright checks on the live site found:

- HTTP 200, correct title, `lang=en`, exactly one h1, and a main landmark.
- Desktop 1440px and 390x844 mobile had no horizontal overflow or page/console
  errors. Keyboard selection changed the demo to `darktable -> Immich
  (read-only)`; the focused copy control and initial mobile link expose a
  `2px solid rgb(23, 33, 30)` outline.
- Axe returned zero serious/critical violations on `/`, `/privacy/`, and
  `/terms/`. Reduced motion yields `animation-duration: 1e-06s`,
  `transition-duration: 1e-06s`, and `scroll-behavior: auto`.
- In a fresh browser context the worker was active and controlling the page;
  `registration.update()` completed. After offline reload, changing the route
  still produced `darktable -> Immich (read-only)` with no errors.
- A normal page load requested only the product origin. Source inspection finds
  no CLI HTTP dependency or telemetry. The only page `fetch` is the optional
  license verification request to the allowed Sociobot API and it carries only
  the license token, never photo data.
- `/privacy/` and `/terms/` exist. The checkout endpoint returns a 303 to the
  hosted Dodo checkout without embedding a payment provider.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy, denied
  camera/microphone/geolocation, and a CSP restricted to same origin plus
  `https://api.sociobot.in`. Hashed assets are immutable for one year and
  `sw.js` is `no-cache`.

## Built budgets

- Initial JS: 7,976 B total (7,127 B entry), below 200 KB.
- CSS: 11,077 B, below 50 KB.
- Self-hosted WOFF2: 74,420 B total, below 120 KB.
- Original hero WebP: 61,944 B, below 300 KB.

## Defects by severity

### HIGH

1. Valid `xml:lang` is classified as unresolved/unknown metadata. This makes
   common descriptive XMP report attention and exit `2` for a same-tool
   Lightroom handoff, and downgrades native Camera Raw adjustments to unknown.

### MEDIUM / LOW

None found in the tested candidate. The prior live service-worker deployment
defect is fixed in this deployment.
