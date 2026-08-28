# Sidecar Ledger — polish 2 handoff

## Delivered

Repair commit: `ed823145eeff3b4f01b60d92b593dd75781dc9d9` (`main`, pushed).

- Connected the paid UI to six real route-specific migration step sets with an
  accessible selector.
- Added observable privacy/refund/license tests: a `connect` syscall guard for
  the real CLI, intercepted token-only license checks, and active-to-revoked
  Pro locking.
- Expanded claims to 20 individually selectable commands. The runner passes
  Node's selector before the test file, so each command runs its named claim.
- Completed non-home social metadata, 404 metadata, external-link labels,
  44px mobile targets, copy audit coverage, and product terminology cleanup.
- Preserved the glacial ceramic visual system, isolated `/demo/` and `?demo=1`
  behavior, real 404s, shared legal shell, and offline sample path.

## Verification

Clean clone: `/tmp/photo-edit-ledger-polish2.2xYaBp`.

- `npm ci`, all 20 commands in `.factory/claims.json`, `npm test`,
  `npm run build`, `npm run test:a11y`, and `npm run test:consumer` passed.
- Local `npm test` passed: 16 Rust tests, 15 site/copy tests, and 20 claims.
- Local `npm run test:a11y` passed with zero serious/critical Axe violations;
  it also verifies 390px overflow, focus, demo redirect, offline interaction,
  and all affected 44px touch targets.
- `npm run build` produced `dist/site/`, the release binary, and the crate.
- Deployed with `/opt/fleet/lib/deploy-static.sh photo-edit-ledger dist/site`.
- Cold live check passed for `/`, `/demo/`, `/privacy/`, `/terms/`, and an
  unknown URL. Titles, `lang=en`, one main, expected h1, and console checks are
  recorded in `.factory/evidence/polish-2/live/verify.json`; the unknown URL
  returned HTTP 404 with the designed page.
- Live Axe: zero serious/critical violations on all five URLs.
- Live Lighthouse: performance 100, accessibility 100. Evidence:
  `.factory/evidence/polish-2/live/lighthouse.json`.
- Mobile screenshots: `.factory/evidence/polish-2/live/home-mobile.png` and
  `.factory/evidence/polish-2/live/demo-mobile.png`.

## Publish/deploy

Do not publish from this worker. The ready package command is `cargo package
--locked`. The static site is deployed at
`https://photo-edit-ledger.sociobot.in/`.

## Remaining work

None known.
