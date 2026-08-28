# Sidecar Ledger — review 4 handoff

## Work completed

Performed an adversarial first-read review of the live Sidecar Ledger site and
the repository at `4d2281e4d6653b309d198a865a0cd7a5f0a737cf`. The full report
is `.factory/review-4.md`. No product code was modified.

The verdict is **FAIL** with four findings and no blocking finding:

- F-4-1: desktop first screen pushes the action note and required facts below
  900 px.
- F-4-2: Terms contains an unlisted claim that privacy controls and
  accessibility features stay free.
- F-4-3: the real CLI prints “1 sidecars” while its landing recording prints
  “1 sidecar.”
- F-4-4: README has no deployment guidance.

## Verification performed

From the clean clone `/tmp/photo-edit-ledger-review4-clean`:

- `npm ci`
- every one of the 20 exact `test` commands in `.factory/claims.json`; each
  selected one tagged test and passed
- `npm run build`
- `npm run test:a11y`
- `npm run test:consumer`
- `cargo fmt --check`
- `cargo clippy --all-targets -- -D warnings`

The build produced `dist/site/`, the release binary, and the packaged crate.
The browser suite reported zero serious/critical Axe violations. The release
CLI demo was also run from a fresh temp directory and exited 2 after creating
its isolated sample and JSON report.

Live Chromium checks covered 390×844 and 1440×900 cold loads, one-click demo,
seeded storage isolation, Reset, `?demo=1`, same-origin request interception,
offline reload and interaction, route metadata, designed 404, browser Back and
focus, touch targets, console output, and all links. All passed except the
desktop first-screen placement recorded in F-4-1. Earlier findings F-1-1
through F-1-62, F-2-1 through F-2-11, and F-3-1 were individually rechecked;
none is reopened.

## Next steps

Resolve F-4-1 through F-4-4, then repeat the entire review checklist. The
current build remains buildable and all automated gates pass, but the review
cannot pass while any finding remains.
