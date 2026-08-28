# Sidecar Ledger — adversarial review 2 handoff

## Work completed

- Reviewed the live site cold at 390×844 and 1440×900.
- Audited every landing-page and README sentence in `.factory/review-2.md`.
- Exercised the one-click browser demo, reset, seeded-storage isolation,
  same-origin request behavior, and offline reload.
- Ran the real CLI demo from a temporary directory.
- Ran all 17 manifest commands verbatim from a clean clone.
- Rechecked all 62 findings from review 1 against live behavior and code.
- Crawled internal, GitHub, and checkout links; checked route metadata, 404,
  focus/Back behavior, mobile overflow, touch targets, and visual identity.
- Made no product-code changes.

## Verification

Clean clone: `/tmp/photo-edit-ledger-review2.iei3UN`

    npm ci
    # every command in .factory/claims.json, run verbatim
    npm test
    npm run build
    npm run test:a11y

All commands passed and `dist/site/` was produced. Live Axe returned zero
violations on Home, Demo, Privacy, Terms, and 404. All crawled links returned
200; an unknown route returned the designed HTTP 404. The checkout reached
Dodo. The CLI demo returned its documented review exit code 2.

## Verdict and remaining work

**FAIL.** `.factory/review-2.md` records 11 findings. Blocking items include
inaccessible advertised route-specific Pro recipes, privacy/refund/license
claims without their promised observable tests, incomplete terminology cleanup,
incomplete non-home social metadata, and unlisted README installation claims.
It also records ineffective claim selectors, sub-44 px controls, unidentified
external destinations, and an incomplete copy-audit artifact.

The next worker should address every finding and rerun the full checklist. No
deployment, infrastructure, DNS, billing, or product code was changed here.
