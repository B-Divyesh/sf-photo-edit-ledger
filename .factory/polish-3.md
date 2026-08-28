# Polish 3 — cumulative finding ledger

Repaired candidate `c0feffe150bf1e3b71e362cd463bbea2dd8d4154` through
`6b45387d126fbe27891bb418edafcc2ee7c5b92f`. The source changes are the
plain-language JSON first-use repair and a Rustfmt-clean CLI source line.

## Evidence key

- **Clean suite:** `/tmp/photo-edit-ledger-polish3.OrsTub/clean-suite.log`.
  This is a detached clean clone at `6b45387`; `npm ci`, `cargo fmt --check`,
  `cargo clippy --all-targets -- -D warnings`, `npm test`, `npm run build`,
  `npm run install:browser`, `npm run test:a11y`, `npm run test:consumer`, and
  all 20 exact manifest commands passed. Each selected claim reported exactly
  one passing test.
- **Live review:** `.factory/evidence/polish-3/live-review.json`, cold
  Chromium against `https://photo-edit-ledger.sociobot.in/`. It checks all
  routes, metadata, Axe, the one-click demo, direct demo isolation, `?demo=1`,
  Back focus/announcement, 404, touch targets, and offline interaction.
- **Screenshots:**
  `.factory/evidence/polish-3/live-home/screenshot-mobile.png` and
  `.factory/evidence/polish-3/live-demo/screenshot-mobile.png`.
- **Factory URL checks:**
  `.factory/evidence/polish-3/live-home/verify.json` and
  `.factory/evidence/polish-3/live-demo/verify.json` have cold-load title,
  lang, main, image-alt, and console evidence. The live review also records
  `200` for `/`, `/demo/`, `/privacy/`, `/terms/`, `/404/`, and `404` for an
  unknown URL.
- **Performance:** `.factory/evidence/polish-3/lighthouse.json` records
  mobile 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO, LCP
  1.65 s, and CLS 0.006.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept **Try it with sample data** as the first primary action with its result text. | `landing page puts the sample action and plain wording first`; Home screenshot; live `/`. |
| F-1-2 | Kept the real browser route, banner/reset/exit controls, shipped CLI sample, recording, and `sidecar-ledger demo`. | `@claim:demo-cli-real`, `@claim:demo-isolated`; Demo screenshot; live `/demo/`. |
| F-1-3 | Kept demo as a license-free route with no real-storage reads or writes. | `@claim:demo-isolated`, `@claim:demo-private`; live-review storage/request trace at `/demo/`. |
| F-1-4 | Kept the 20-entry claim manifest and selector-correct tagged tests. | all 20 manifest commands in the clean-suite log. |
| F-1-5 | Kept the ceramic error page and HTTP 404 response override. | `404 config returns the ceramic error page`; live `/not-a-real-route` → 404. |
| F-1-6 | Kept the fixture-backed handoff-report wording. | `@claim:handoff-report`; live Home. |
| F-1-7 | Kept the local scan wording with an observable privacy test. | `@claim:read-only-local`, `@claim:cli-private`; live Home. |
| F-1-8 | Kept copied-input SHA-256 checks around a real scan. | `@claim:read-only-local`. |
| F-1-9 | Kept the schema-version JSON assertion. | `@claim:versioned-json`. |
| F-1-10 | Kept request interception across the full browser sample flow. | `@claim:demo-private`; live-review direct `/demo/` trace. |
| F-1-11 | Kept the bundled CLI demo running the real scanner. | `@claim:demo-cli-real`; live Demo screenshot. |
| F-1-12 | Kept unsupported catalog-overwrite advice removed. | copy-audit regression; live Home. |
| F-1-13 | Kept adjacent image/XMP discovery in the real fixture scan. | `@claim:handoff-report`. |
| F-1-14 | Kept non-mutation proof and a `connect` syscall interceptor. | `@claim:read-only-local`, `@claim:cli-private`. |
| F-1-15 | Kept the recording, sample counts, report path, and exit code synchronized. | `@claim:demo-cli-real`; Home screenshot. |
| F-1-16 | Kept a representative portable/lossy route assessment. | `@claim:handoff-report`. |
| F-1-17 | Kept opaque proprietary values out of the report. | `@claim:opaque-values`. |
| F-1-18 | Kept free MIT CLI/report proof. | `@claim:free-mit`; live Home. |
| F-1-19 | Kept exact $19 one-time price proof. | `@claim:paid-price`; live Home. |
| F-1-20 | Kept the approved Sociobot checkout endpoint and merchant copy. | `production billing and security routes`; live checkout returns 303 to Dodo. |
| F-1-21 | Kept active-to-revoked license transition coverage. | `@claim:merchant-refund`. |
| F-1-22 | Kept all six accessible, distinct migration step sets. | `@claim:migration-steps`; live Home. |
| F-1-23 | Kept the offline sample-report promise. | `@claim:offline-demo`; live-review offline `/demo/`. |
| F-1-24 | Kept the untested retry promise absent. | copy-audit regression. |
| F-1-25 | Kept README local/read-only wording tied to the scan test. | `@claim:read-only-local`. |
| F-1-26 | Kept README inventory/classification wording tied to the fixture. | `@claim:handoff-report`. |
| F-1-27 | Kept the no-upload statement backed by a real no-connect scan. | `@claim:cli-private`. |
| F-1-28 | Kept source-hash no-mutation assertion. | `@claim:read-only-local`. |
| F-1-29 | Kept the dated crates.io availability assertion removed. | README copy audit. |
| F-1-30 | Kept truthful local-checkout installation wording. | `@claim:checkout-install`. |
| F-1-31 | Kept machine-readable versioned JSON wording. | `@claim:versioned-json`. |
| F-1-32 | Kept the observable 0/2/1 exit-code matrix. | `@claim:exit-codes`. |
| F-1-33 | Kept untested stdout/stderr marketing absent. | README copy audit. |
| F-1-34 | Kept the versioned `schema_version` proof. | `@claim:versioned-json`. |
| F-1-35 | Kept exact six-profile coverage. | `@claim:profiles`. |
| F-1-36 | Kept field recognition and opaque-value protection. | `@claim:handoff-report`, `@claim:opaque-values`. |
| F-1-37 | Kept unknown-vocabulary exit 2 without opaque values. | `@claim:opaque-values`. |
| F-1-38 | Kept broad test-suite marketing removed. | README copy audit. |
| F-1-39 | Kept `npm test` as contributor documentation and ran it clean. | clean-suite `npm test`. |
| F-1-40 | Kept documented build outputs and asserted them. | `@claim:build-output`; clean-suite `npm run build`. |
| F-1-41 | Kept an explicit Chromium-install claim and test. | `@claim:browser-install`. |
| F-1-42 | Kept real no-network evidence instead of dependency-name inference. | `@claim:cli-private`. |
| F-1-43 | Kept token-only interception and non-home storage isolation. | `@claim:license-scope`; live direct `/demo/`, `/privacy/`, `/terms/`. |
| F-1-44 | Kept real privacy and terms routes. | `@claim:legal-routes`; live `/privacy/`, `/terms/`. |
| F-1-45 | Kept MIT metadata and ungated scan proof. | `@claim:free-mit`. |
| F-1-46 | Kept the short audience/result sentence. | copy-audit test; Home screenshot. |
| F-1-47 | Kept the short README output copy. | copy-audit test. |
| F-1-48 | Kept the short README exit-code copy. | copy-audit test. |
| F-1-49 | Kept the short README unknown-data copy. | copy-audit test. |
| F-1-50 | Kept the short browser-install copy. | copy-audit test. |
| F-1-51 | Kept scan, handoff report, photo edit settings, and migration steps consistent. | terminology table and copy-audit test. |
| F-1-52 | Kept the job-specific h1. | `landing page puts the sample action and plain wording first`; live `/`. |
| F-1-53 | Kept the concrete scan/no-change heading. | landing test; Home screenshot. |
| F-1-54 | Kept the metadata-field-result heading. | landing test; Home screenshot. |
| F-1-55 | Kept first-use technical expansions and plain wording. | copy-audit test; live Home. |
| F-1-56 | Kept an action that names the sample result. | landing test; live Home. |
| F-1-57 | Kept **Restore Pro access** wording. | `@claim:license-scope`; live Home. |
| F-1-58 | Kept complete per-route canonical, OG, Twitter, card, and touch metadata. | `complete route document`, `social card`; live-review every route. |
| F-1-59 | Kept one shared header/footer shell with external labels. | route/Axe sweep; live `/`, `/demo/`, `/privacy/`, `/terms/`, `/404/`. |
| F-1-60 | Kept h1 focus and live announcement on route change/Back. | `test:a11y`; live-review history result. |
| F-1-61 | Kept the three-step and privacy/limits landing sections. | landing test; Home screenshot. |
| F-1-62 | Kept `/demo/` in the sitemap. | `production billing and security routes`; live `/demo/`. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Kept unlocked Pro route selection wired to each of six real step sets. | `@claim:migration-steps`; live Home. |
| F-2-2 | Kept actual scanner execution beneath a no-`connect` interceptor. | `@claim:cli-private`. |
| F-2-3 | Kept the active entitlement visibly locked after an intercepted revoked verdict. | `@claim:merchant-refund`. |
| F-2-4 | Kept observed token-only license verification and non-home isolation. | `@claim:license-scope`; live direct demo/legal routes. |
| F-2-5 | Kept terminology normalized and technical first uses expanded. | copy-audit test; live Home. |
| F-2-6 | Kept full Twitter data and 404 `og:url` on every route. | `complete route document`, `social card`; live-review metadata. |
| F-2-7 | Kept separately listed/installable checkout and browser claims. | `@claim:checkout-install`, `@claim:browser-install`. |
| F-2-8 | Kept Node selector arguments before the test file. | all 20 clean-suite manifest commands selected one passing claim. |
| F-2-9 | Kept all banner and wordmark targets at least 44 px on mobile. | `test:a11y`; live-review target measurements; Demo screenshot. |
| F-2-10 | Kept GitHub and checkout departures explicitly labeled external. | route/Axe sweep; live Home. |
| F-2-11 | Kept the complete copy audit, terminology table, and regression coverage. | `copy audit covers public prose`; `.factory/copy-audit.md`. |

## Review 3 finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Replaced “Keep JSON…” with “Keep the JSON data-file report…” and added a first-use-only regression. | `landing expands JSON at its first use`; Home screenshot; live-review cold `/` check. |

## Result

No review finding remains open. The live deployment is Static Web Apps
deployment `26a2aad2-064c-4367-9e06-f17343ca61fb` at
`https://photo-edit-ledger.sociobot.in/`.
