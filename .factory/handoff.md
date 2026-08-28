# Sidecar Ledger — polish 3 handoff

## Released repair

Commit `8582be1` expands the first landing-page use of JSON to **JSON
data-file report**. It adds a regression that requires that expansion at the
first visible use. Commit `6b45387` makes the CLI source pass the current
`cargo fmt --check` gate. The catalog description is now the verb-first,
59-character sentence: “Check photo metadata before moving an archive between
tools.”

All cumulative findings from reviews 1–3 are mapped in
`.factory/polish-3.md`. No finding remains open.

## Exact verification evidence

Fresh detached clone `/tmp/photo-edit-ledger-polish3.OrsTub` at
`6b45387d126fbe27891bb418edafcc2ee7c5b92f` passed, in this order:

- `npm ci`
- `cargo fmt --check`
- `cargo clippy --all-targets -- -D warnings`
- `npm test`
- `npm run build`
- `npm run install:browser`
- `npm run test:a11y`
- `npm run test:consumer`
- every one of the 20 exact `test` commands in `.factory/claims.json`

The full log is `/tmp/photo-edit-ledger-polish3.OrsTub/clean-suite.log`. Each
claim selector reported one passing tagged test; the log ends with
`== CLEAN SUITE PASS ==`. The build produced `target/release/sidecar-ledger`,
`target/package/sidecar-ledger-0.1.0.crate`, and `dist/site/`.

The factory static deployment completed as
`26a2aad2-064c-4367-9e06-f17343ca61fb`. Cold live verification at
`https://photo-edit-ledger.sociobot.in/` found no console errors, a title,
`lang`, one h1, a main landmark, and no missing image alt text. The saved
reports are `.factory/evidence/polish-3/live-home/verify.json`,
`.factory/evidence/polish-3/live-demo/verify.json`, and
`.factory/evidence/polish-3/live-review.json`.

The live review rechecked the first screen, Home → Demo one-click path, direct
demo storage/network isolation, banner/reset/exit, `?demo=1`, offline sample
interaction, browser Back focus and announcement, 44px mobile targets, legal
routes, complete social metadata, and an unknown URL returning HTTP 404. Axe
had zero serious/critical violations on Home, Demo, Privacy, Terms, and 404.
Mobile Lighthouse is 99 Performance and 100 for Accessibility, Best Practices,
and SEO; LCP is 1.65 s and CLS is 0.006
(`.factory/evidence/polish-3/lighthouse.json`).

## Run or publish

Run `npm ci && npm test && npm run build && npm run test:a11y && npm run
test:consumer`. The ready-to-publish CLI crate is produced by `cargo package
--locked`; it was not published from this worker.

## Remaining work

None.
