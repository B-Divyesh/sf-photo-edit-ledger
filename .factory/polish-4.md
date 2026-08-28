# Polish 4 — complete finding ledger

Product repair commits: `98016b29f3132d65405c7565bef4f0e2f7694657` and
`b31044c5585774f2e78238455f8d5fc3ce17160e`. Production deployment:
`fda9b751-4453-4b4a-a8d6-536a3fd914bd` at
`https://photo-edit-ledger.sociobot.in/`.

## Evidence key

- **C — clean product commit:** fresh `--no-local` clone at
  `/tmp/photo-edit-ledger-polish4-final.4tFqoC/repo`, commit `b31044c`.
  `npm ci`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`,
  `npm test`, `npm run build`, `npm run test:a11y`, and `npm run test:consumer`
  passed. Every one of the 20 exact commands in `.factory/claims.json` also
  passed individually.
- **H — live Home:** `npm run test:a11y` includes the 1440×900 first-screen
  bound; [desktop screenshot](evidence/polish-4/live-home/screenshot-1440x900.png),
  [cold-load report](evidence/polish-4/live-home/verify.json), and
  `https://photo-edit-ledger.sociobot.in/`.
- **D — live Demo:** `@claim:demo-isolated`, `@claim:demo-private`, and
  `@claim:offline-demo`; [mobile screenshot](evidence/polish-4/live-demo/screenshot-390x844.png),
  [cold-load report](evidence/polish-4/live-demo/verify.json), and
  `https://photo-edit-ledger.sociobot.in/demo/`.
- **R — live routes:** `site.test.mjs` complete-route/404 tests and live route
  results in [live-review.json](evidence/polish-4/live-review.json): Privacy,
  Terms, and 404 return the expected title/status; unknown URL returns 404.
- **P — performance:** [lighthouse-summary.json](evidence/polish-4/lighthouse-summary.json)
  reports mobile 100/100/100/100, LCP 1.83 s, CLS 0 after the self-hosted font
  preloads. `npm run test:a11y` reports zero serious/critical Axe violations.

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the result-naming **Try it with sample data** first action and outcome copy. | `landing page puts the sample action and plain wording first`; H. |
| F-1-2 | Kept `/demo/`, banner/reset/exit, shipped sample, recording, docs, and real `sidecar-ledger demo`. | `@claim:demo-cli-real`, `@claim:demo-isolated`; D. |
| F-1-3 | Kept Demo in-memory and license-free; Reset does not read/write real storage. | `@claim:demo-isolated`, `@claim:demo-private`; D. |
| F-1-4 | Kept 20 manifest entries with one tagged test each; reran every exact command. | C; `.factory/claims.json`; H/D screenshots. |
| F-1-5 | Kept the ceramic 404 response override and Return home route. | `404 config returns the ceramic error page`; R. |
| F-1-6 | Kept fixture inventory and portable/lossy handoff report. | `@claim:handoff-report`; H. |
| F-1-7 | Kept local-execution proof. | `@claim:read-only-local`; H. |
| F-1-8 | Kept copied-source hash proof around a real scan. | `@claim:read-only-local`; H. |
| F-1-9 | Kept parsed `schema_version: "1"` output. | `@claim:versioned-json`; H. |
| F-1-10 | Kept full Demo request interception. | `@claim:demo-private`; D. |
| F-1-11 | Kept bundled CLI demo using the real scanner. | `@claim:demo-cli-real`; D. |
| F-1-12 | Kept unsupported catalog-overwrite statement removed. | copy-audit test; H. |
| F-1-13 | Kept adjacent image/XMP discovery. | `@claim:handoff-report`; H. |
| F-1-14 | Kept hash and no-connection privacy evidence. | `@claim:read-only-local`, `@claim:cli-private`; H. |
| F-1-15 | Made CLI singular/plural grammar correct and require the recording inventory line to equal actual demo output. | `@claim:demo-cli-real`; D and R. |
| F-1-16 | Kept declared portable/lossy mapping evidence. | `@claim:handoff-report`; D. |
| F-1-17 | Kept opaque-value canary secrecy. | `@claim:opaque-values`; H. |
| F-1-18 | Kept MIT and ungated CLI proof. | `@claim:free-mit`; H. |
| F-1-19 | Kept exact $19 one-time price. | `@claim:paid-price`; H. |
| F-1-20 | Kept approved Sociobot checkout and merchant copy. | `@claim:merchant-refund`; live checkout GET → 303 Dodo; H. |
| F-1-21 | Kept active-to-revoked visible lock transition. | `@claim:merchant-refund`; H. |
| F-1-22 | Kept six selectable, distinct paid migration step sets. | `@claim:migration-steps`; H. |
| F-1-23 | Kept service-worker offline Demo interaction. | `@claim:offline-demo`; D. |
| F-1-24 | Kept untested retry promise absent. | copy-audit test; H. |
| F-1-25 | Kept README local/read-only scope. | `@claim:read-only-local`; H. |
| F-1-26 | Kept README scan/classification scope. | `@claim:handoff-report`; H. |
| F-1-27 | Kept no-upload scan proof. | `@claim:cli-private`; H. |
| F-1-28 | Kept source files unchanged proof. | `@claim:read-only-local`; H. |
| F-1-29 | Kept dated registry claim absent. | copy audit; H. |
| F-1-30 | Kept documented local checkout installation. | `@claim:checkout-install`; H. |
| F-1-31 | Kept versioned machine-readable output. | `@claim:versioned-json`; H. |
| F-1-32 | Kept observable 0/2/1 exit-code matrix. | `@claim:exit-codes`; H. |
| F-1-33 | Kept unsupported stream claim absent. | copy audit; H. |
| F-1-34 | Kept versioned JSON field. | `@claim:versioned-json`; H. |
| F-1-35 | Kept exact six profile list. | `@claim:profiles`; H. |
| F-1-36 | Kept recognized metadata fields and opaque-value protection. | `@claim:handoff-report`, `@claim:opaque-values`; H. |
| F-1-37 | Kept unknown vocabulary exit without values. | `@claim:opaque-values`; H. |
| F-1-38 | Kept broad test-suite marketing absent. | copy audit; H. |
| F-1-39 | Kept contributor test command and ran it clean. | `npm test`; C. |
| F-1-40 | Kept build-output proof. | `@claim:build-output`, `npm run build`; C. |
| F-1-41 | Kept Chromium-install claim/test. | `@claim:browser-install`; C. |
| F-1-42 | Kept actual no-`connect` proof. | `@claim:cli-private`; H. |
| F-1-43 | Kept token-only Home check and non-Home isolation. | `@claim:license-scope`; D. |
| F-1-44 | Kept direct Privacy and Terms pages. | `@claim:legal-routes`; R. |
| F-1-45 | Kept MIT metadata. | `@claim:free-mit`; H. |
| F-1-46 | Kept 17-word audience sentence. | copy audit; H. |
| F-1-47 | Kept short README output sentences. | copy audit; H. |
| F-1-48 | Kept short README exit-code sentences. | copy audit; H. |
| F-1-49 | Kept short README unknown-data sentence. | copy audit; H. |
| F-1-50 | Kept short browser-install sentence. | copy audit; H. |
| F-1-51 | Kept scan/handoff report/photo edit settings/migration steps terminology. | copy audit; H/D. |
| F-1-52 | Kept job-naming h1. | landing test; H. |
| F-1-53 | Kept concrete filename/sidecar heading. | landing test; H. |
| F-1-54 | Kept field-result heading. | landing test; H. |
| F-1-55 | Kept expanded technical first uses. | copy audit; H. |
| F-1-56 | Kept explicit result-naming sample action. | landing test; H. |
| F-1-57 | Kept **Restore Pro access** wording. | `@claim:license-scope`; H. |
| F-1-58 | Kept complete route title/canonical/social metadata. | complete-route tests; R. |
| F-1-59 | Kept shared shell, external labels, footer build identity. | route sweep; R. |
| F-1-60 | Kept h1 focus and live announcement through history. | `npm run test:a11y`; H. |
| F-1-61 | Kept three-step and privacy/limits landing sections. | landing test; H. |
| F-1-62 | Kept Demo in sitemap. | production-route test; D. |

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Kept unlocked selector connected to all six route-specific step lists. | `@claim:migration-steps`; H. |
| F-2-2 | Kept real scanner under `connect`-syscall interception. | `@claim:cli-private`; H. |
| F-2-3 | Kept revoked entitlement visibly locking Pro content. | `@claim:merchant-refund`; H. |
| F-2-4 | Kept intercepted token-only verification and non-Home isolation. | `@claim:license-scope`; D. |
| F-2-5 | Kept plain, consistent terminology and complete audit. | copy-audit test; H. |
| F-2-6 | Kept complete Twitter/OG tags and 404 URL. | complete-route/social-card tests; R. |
| F-2-7 | Kept checkout and browser installation claims. | `@claim:checkout-install`, `@claim:browser-install`; C. |
| F-2-8 | Kept correctly positioned Node test selector. | all 20 individual claim commands; C. |
| F-2-9 | Kept all banner and wordmark controls at least 44px. | `npm run test:a11y`; D. |
| F-2-10 | Kept external GitHub and checkout labels. | route sweep; H. |
| F-2-11 | Rebuilt the full copy audit, including conditional and legal wording. | copy-audit test; H. |

## Review 3

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Kept first JSON use expanded as **JSON data-file report**. | `landing expands JSON at its first use`; H. |

## Review 4

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Balanced the desktop ceramic tiles, widened the h1 measure, and added a 1440×900 bound for the action note and all three facts. | `npm run test:a11y`; H and R. |
| F-4-2 | Rewrote Terms to the tested free scope and made `free-mit` assert that rendered Terms wording. | `@claim:free-mit`; R at `/terms/`. |
| F-4-3 | Singularized CLI count labels and made the demo claim compare its inventory line exactly with the self-hosted recording. | `@claim:demo-cli-real`; D and R. |
| F-4-4 | Added README deployment guidance for `dist/site/`, the packaged crate, and factory-owned infrastructure. | `README identifies the deployable site and command-line artifacts`; H. |

## Result

No finding remains open. The product retains the glacial ceramic visual system;
the change balances its paired archive tiles rather than replacing the design.
