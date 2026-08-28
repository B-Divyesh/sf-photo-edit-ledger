# Sidecar Ledger — polish 1 handoff

Repair commit: `83144687f0101e3a71a5a3ec75f01832daee7fd6`<br>
Deployment: Azure Static Web Apps production deployment
`bdd77275-9853-4887-8d55-6a4f0fefb344`.

## Delivered

- A real bundled CLI demo: sidecar-ledger demo copies opinionated Lightroom to
  Immich sample files into a new temporary directory, runs the scanner, writes
  JSON, and prints both paths.
- A one-click isolated browser sample at /demo/ and /?demo=1. It carries the
  required banner, Reset demo, Start for real, and never reads or writes
  real-license browser storage.
- Claims manifest with 18 sandbox claim tests. The suite includes mutation
  hashes, opaque-value canary, exit-code matrix, offline service worker flow,
  demo request interception, and legal/price checks.
- Plain first-screen wording, README rewrite, catalog description, copy audit,
  self-hosted terminal recording, and demo documentation.
- Real demo, privacy, terms, and 404 routes; unique titles, canonical/OG/Twitter
  metadata, 1200×630 ceramic social card, touch icon, sitemap, response 404,
  route h1 focus and live announcement, and a shared page shell.
- Replaced the terminal recording's same-origin `<object>` with a normal SVG
  image. This preserves the recording without attempting to frame the site;
  the CSP continues to set `frame-ancestors 'none'`.

## Verification

From a disposable clean clone at `/tmp/photo-edit-ledger-clean.rTuz3C`, checked
out at `83144687f0101e3a71a5a3ec75f01832daee7fd6`:

    npm ci
    npm test
    npm run test:a11y
    cargo fmt --check
    cargo clippy --all-targets -- -D warnings
    npm run test:consumer
    npm run build
    cargo package --locked --list

All passed. The suite ran 8 Rust unit tests, 8 CLI integration tests, 12 site
tests, and all 17 tagged claims. Each manifest command was run against the
clean clone. The consumer test installed the packaged crate into a new Cargo
root. `npm run test:a11y` reported zero serious or critical Axe findings on
home, demo, legal, and 404 routes; it also passed 390px overflow, focus, demo
redirect, and offline service-worker interaction. `cargo fmt --check`,
`cargo clippy --all-targets -- -D warnings`, `cargo package --locked --list`,
and the production build passed.

The built site is at dist/site/. Initial home JavaScript is 3.37 kB raw
(1.42 kB gzip); CSS is 13.10 kB raw (3.81 kB gzip); local fonts total
74.42 kB; the 1200×630 social card is 92 kB. These are within the static
budgets.

## Production re-check

After deployment, cold direct checks returned:

| URL | HTTP | Title |
| --- | ---: | --- |
| https://photo-edit-ledger.sociobot.in/ | 200 | Sidecar Ledger — check photo metadata |
| https://photo-edit-ledger.sociobot.in/demo/ | 200 | Demo — Sidecar Ledger |
| https://photo-edit-ledger.sociobot.in/privacy/ | 200 | Privacy — Sidecar Ledger |
| https://photo-edit-ledger.sociobot.in/terms/ | 200 | Terms — Sidecar Ledger |
| https://photo-edit-ledger.sociobot.in/not-a-real-route | 404 | Page not found — Sidecar Ledger |

Fresh live Chromium checked title, lang, one h1, main, demo redirect, and the
isolated reset flow at 390px and 1440px. The live sample kept seeded real
license keys and a sentinel unchanged, made no Sociobot request, reset to
Lightroom → Immich, and had no iframe, object, or embed element. Cold home,
demo, privacy, and terms loads reported zero console errors. Live Axe found
zero serious or critical violations across home, demo, privacy, terms, and
404. The browser reports the expected failed-document message only when a
deliberately unknown URL returns its required HTTP 404; no asset is missing.

Evidence: `.factory/evidence/live-home/verify.json`,
`.factory/evidence/live-home/screenshot-mobile.png`,
`.factory/evidence/live-demo/verify.json`, and
`.factory/evidence/live-demo/screenshot-mobile.png`. The complete finding map
is in `.factory/polish-1.md`.

## Known gaps

None. The ready-to-publish crate remains
target/package/sidecar-ledger-0.1.0.crate; publishing itself is intentionally
left to the factory registry owner.
