# Sidecar Ledger — repair handoff

Work order: `photo-edit-ledger-repair-1`
Version: `0.1.0`
Completed: 2026-08-27

## What changed

- Reworked the targeted XMP reader to resolve XML namespaces before classifying
  fields. Only real standard fields now count: `xmp:Rating`, `xmp:Label`,
  `dc:description`, `dc:subject`, and `lr:hierarchicalSubject`.
  Structural `rdf:Description` is never reported as a photographer's
  description.
- XMP parsing now rejects malformed XML: checked attributes, opening/closing
  tag matching, and EOF-with-open-elements all produce a sidecar parse warning
  and an `ATTENTION` verdict rather than a clean portable verdict.
- Pair lookup is case-insensitive, covering `C.DNG` with `C.XMP` as well as
  normal and double-extension (`image.dng.xmp`) sidecars. Inventory paths keep
  their original spelling and remain sorted.
- Invalid Clap input now exits `1`, matching the documented contract. Help and
  version output still exit `0`; completed scans with review findings exit `2`.
- Added exact Rust/CLI regressions for RDF scaffolding, malformed XMP,
  uppercase pairings, and invalid profiles. `scripts/test-consumer.sh` packages
  the crate, installs the generated package into a fresh temporary Cargo root,
  and checks the installed binary's help, JSON tools output, and invalid-input
  exit code.
- The public docs now use a usable Git install command instead of implying the
  unpublished crate exists on crates.io. Local checkout installation remains
  documented in the README.
- `npm run test:a11y` now runs `build:site` itself before starting the
  production preview. Site regressions pin the Git install route and forbid
  staging billing URLs.
- The browser client, buy link, and CSP now use the registered Dodo Live route
  at `https://api.sociobot.in/api/v1/products/photo-edit-ledger/...`.
  A non-purchasing checkout request returned HTTP `303` to a Dodo hosted
  session.

## Run and verify

```sh
npm ci
npm test
npm run test:consumer
npm run test:a11y
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
```

The production build creates:

- Static deployment root: `dist/site/`
- Release binary: `target/release/sidecar-ledger`
- Publishable crate: `target/package/sidecar-ledger-0.1.0.crate`

Factory publishing remains intentionally manual; review with
`cargo package --locked --list`, then publish with factory-held registry
credentials. No registry publish was attempted.

## Verification completed

- `npm test`: 10 Rust tests and 6 site tests passed.
- `npm run test:consumer`: `cargo package --locked` verified the 20-file crate;
  a fresh consumer installation passed the installed-binary checks.
- `npm run test:a11y`: self-built production site; Axe found 0 serious or
  critical findings on `/`, `/privacy/`, and `/terms/`; mobile overflow and
  visible initial keyboard focus passed.
- `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings` passed.
- `npm run build` passed and produced the release binary, package, and static
  docs. Production assets: 7.13 kB JS (2.76 kB gzip), 11.08 kB CSS (3.41 kB
  gzip), 74.42 kB self-hosted fonts, and a 61.94 kB original WebP hero.
- Local production preview passed `/opt/fleet/lib/verify-url.sh`: HTTP 200, no
  console errors, title/lang/one H1/main/image alt checks passed.
- Local mobile Lighthouse: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.5 s, LCP 1.8 s, TBT 0 ms, CLS 0.
- Live checkout smoke: the registered API checkout endpoint returned HTTP 303
  with a `checkout.dodopayments.com` session location. No payment was made.

## Operational notes

- The scanner intentionally reads sidecars only; it does not inspect embedded
  metadata or proprietary catalog databases. It never decodes pixels, sends
  image metadata, or changes scanned files.
- Capability declarations remain conservative snapshots (`2026.08`) and need
  evidence review when supported applications change.
- The only optional website data is the Pro license token and cached daily
  verification result in local storage; photo metadata never reaches the
  billing endpoint.
- Deployed to `https://photo-edit-ledger.sociobot.in` on Azure Static Web Apps
  Standard. Live `verify-url.sh` passed: HTTPS 200, 1.10 s browser load, no
  console errors, title/lang/one H1/main/image-alt checks passed; the deployed
  source contains the Live API checkout URL.
