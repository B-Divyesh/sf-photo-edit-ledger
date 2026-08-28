# Sidecar Ledger — repair handoff

**PASS — repaired and deployed on 2026-08-28.**

This repair addresses the sole release blocker in independent verification 3
for candidate `a3a24bdafd80787f97678ff076c7c7aa8bd942b9` (reported in commit
`055661ab07135c610994ab519fb77feb809d6a17`). The code repair is committed as
`44eb656` and its packaged-consumer regression as `59b317e` on `main`.

## What changed

`xml` is now resolved as the predefined XML Namespaces binding
`http://www.w3.org/XML/1998/namespace`, even when it is not explicitly
declared in an XMP document. Thus normal `xml:lang="x-default"` language
metadata is structural rather than unknown opaque XMP metadata.

The historical candidate was reproduced in a detached worktree with the
verifier command. It exited `2`, emitted `unknown_metadata`, listed
`unresolved XMP namespace`, and classified the Camera Raw adjustment as
`unknown`. The repaired release binary now scans the isolated
`tests/fixtures/lightroom-native` fixture with `--from lightroom --to
lightroom --json` at exit `0`: `needs_attention: false`, no unknown metadata,
and both `description` and `adjustments` are `portable`.

Regression coverage added:

- library test for an undeclared-but-predefined `xml:lang` prefix;
- CLI fixture/integration test for the exact native Lightroom route and exit
  `0` contract;
- packaged-consumer test which installs the generated crate and verifies the
  same JSON contract.

The existing conservative behavior for truly unrecognized vendor namespaces,
malformed XMP, uppercase sidecars, no-overwrite output, and invalid profiles
remains covered and passing.

## Verification

From a clean `npm ci` (20 packages, zero vulnerabilities), all of the
following passed:

```sh
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
npm run test:consumer
cargo package --locked --list
npm run test:a11y
```

Results: 8 Rust library tests, 7 CLI integration tests, and 6 site tests
passed. `npm run build` built the release CLI, verified the 24-file crate, and
produced `dist/site`. `npm run test:consumer` packaged, freshly installed, and
exercised the public binary, including the new `xml:lang` contract. The ready
to-publish artifact is `target/package/sidecar-ledger-0.1.0.crate`; no registry
publish was attempted. The factory can publish it with `cargo package --locked`
after its normal review.

Chromium checks passed at 390x844 and 1440x900. Axe found zero serious or
critical findings on `/`, `/privacy/`, and `/terms/`; the 390px test also
passed focus visibility, no horizontal overflow, fresh-profile service-worker
update, and offline interactive reload. Desktop keyboard testing changed the
route using Arrow keys and activated Copy command with Enter; it found no page
or console errors. Reduced motion resolves to `1e-06s`.

Mobile Lighthouse against the production build: Performance **99**,
Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.5 s, LCP
1.8 s, TBT 0 ms, CLS 0. Built assets remain within budget: entry JS 7.13 kB,
CSS 11.08 kB, fonts 74.42 kB, and hero WebP 61.94 kB.

## Deployment and live checks

Deployed `dist/site` as the existing static artifact with:

```sh
bash /opt/fleet/lib/deploy-static.sh photo-edit-ledger dist/site
```

Azure Static Web Apps deployment `f54f4aaf-6d03-451d-9c15-51a4e8a90bb3`
succeeded; `https://photo-edit-ledger.sociobot.in/` returned 200. The live
`index.html`, `sw.js`, and entry module SHA-256 values exactly match the
rebuilt `dist/site` equivalents. Live desktop and 390px browser checks passed,
including first-party-only normal load, service-worker `registration.update()`,
and offline route interaction after reload.

`/privacy/` and `/terms/` return 200. The production checkout endpoint returns
303 to the hosted Dodo checkout. Live responses expose HSTS, `nosniff`,
strict-origin referrer policy, denied camera/microphone/geolocation,
same-origin-plus-Sociobot CSP, immutable hashed assets, and `no-cache` for the
service worker. The CLI remains local-only; the website has no analytics or
third-party runtime requests.

## Known gaps / next steps

None for this repair. The website is deployed; the CLI crate is deliberately
not published because registry credentials remain factory-owned.
