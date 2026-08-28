# Sidecar Ledger — polish 4 handoff

## Delivered

Product repairs are in `98016b29f3132d65405c7565bef4f0e2f7694657` and
`b31044c5585774f2e78238455f8d5fc3ce17160e`.

- Rebalanced the desktop hero so the action explanation and all three facts
  stay inside a 1440×900 first screen; the browser suite now enforces that
  bound.
- Made the CLI inventory grammar singular-aware and made the demo claim prove
  that the self-hosted terminal recording repeats the real CLI inventory line.
- Reduced the Terms free-feature sentence to its tested MIT scope and extended
  that claim test to inspect the rendered Terms page.
- Added practical README deployment instructions for `dist/site/` and the
  packaged crate, without assigning infrastructure, DNS, or billing work to
  repository users.
- Preloaded the two self-hosted fonts on Home, removing the Lighthouse layout
  shift introduced by the larger first-screen measure.
- Rebuilt the complete copy audit and updated the verb-first catalog sentence.

The static site was deployed by the factory work-order deployer as Azure Static
Web Apps deployment `fda9b751-4453-4b4a-a8d6-536a3fd914bd`:
<https://photo-edit-ledger.sociobot.in/>.

## Exact verification

Fresh clone: `/tmp/photo-edit-ledger-polish4-final.4tFqoC/repo` at
`b31044c5585774f2e78238455f8d5fc3ce17160e`.

All passed from that clone:

```sh
npm ci
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm test
npm run build
npm run test:a11y
npm run test:consumer
```

`npm test` passed 16 Rust tests, 17 site/copy tests, and all 20 claim tests.
Every exact `test` command in `.factory/claims.json` was then run separately
and passed: `handoff-report`, `read-only-local`, `cli-private`,
`versioned-json`, `demo-cli-real`, `opaque-values`, `exit-codes`, `profiles`,
`demo-isolated`, `demo-private`, `offline-demo`, `license-scope`,
`paid-price`, `merchant-refund`, `migration-steps`, `legal-routes`,
`free-mit`, `build-output`, `checkout-install`, and `browser-install`.

`npm run build` produced `dist/site/`, `target/release/sidecar-ledger`, and
`target/package/sidecar-ledger-0.1.0.crate`. The consumer check installed that
packaged crate into a fresh prefix and exercised its public binary.

Local mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best
Practices, 100 SEO; LCP 1.83 s and CLS 0. See
`.factory/evidence/polish-4/lighthouse-summary.json`.

## Live recheck

Cold production Home and Demo checks report no console errors, `lang=en`, one
`h1`, a main landmark, and complete image/button labels:

- `.factory/evidence/polish-4/live-home/verify.json`
- `.factory/evidence/polish-4/live-demo/verify.json`
- `.factory/evidence/polish-4/live-review.json`

The final cold browser review verified the 1440×900 hero bound, one-click
Demo, banner/Reset/Start for real controls, seeded-storage isolation,
same-origin demo requests, `?demo=1` → `/demo/`, Back focus, Terms free scope,
exact recording inventory line, legal routes, and an unknown-route HTTP 404.
Live Axe had zero serious or critical violations on Home, Demo, Privacy, Terms,
and 404. Screenshots are in `.factory/evidence/polish-4/live-home/` and
`.factory/evidence/polish-4/live-demo/`.

## Handoff status

No known gaps or open review findings. The ready-to-publish CLI artifact is
`target/package/sidecar-ledger-0.1.0.crate`; do not publish it from this worker.
