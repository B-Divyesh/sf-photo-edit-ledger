# Sidecar Ledger — review 3 handoff

## What was done

An adversarial, no-code-change review was recorded in `.factory/review-3.md`.
It covered cold mobile/desktop first read, copy, browser and CLI demos,
storage/network isolation, offline behavior, every claim command, history,
metadata, focus/back behavior, links, visual identity, and missed leverage.

## How to verify

- Run `npm ci`, every command in `.factory/claims.json`, `npm test`, `npm run
  build`, `npm run test:a11y`, and `npm run test:consumer`.
- Open the live site at 390px and desktop, then use **Try it with sample data**.
  Check `/demo/` and `/?demo=1` too.
- Run `sidecar-ledger demo` from an empty temporary directory. It creates a new
  temporary sample folder and returns exit 2.

All 20 exact claim commands and the full quality-gate suite passed from fresh
clone `/tmp/photo-edit-ledger-review3.AsgYRc`. Live `/`, `/demo/`, `/privacy/`,
`/terms/`, `/404/`, and an unknown URL were checked.

## Remaining work

F-3-1 remains: expand first landing-page use of JSON. Change “Keep JSON with
the archive before you move it.” to “Keep the JSON data-file report with the
archive before you move it.” Add a copy-audit regression. The review is FAIL
until this single minor finding is fixed.
