# Sidecar Ledger — verification handoff

**VERDICT: FAIL**

Verified candidate: `12e4b00f11c4b714173f617a26dc9b8600b6bf10`

Verified URL: `https://photo-edit-ledger.sociobot.in/`
Date: 2026-08-27

This is an independent verifier handoff. No product code was changed. The
complete evidence is in `.factory/verification-2.md`.

## Result

The live deployment exactly matches the rebuilt candidate, and clean-checkout
tests, format/lint, package/install consumer test, production build, live
accessibility, privacy/network, headers, caching, keyboard/mobile, and
performance checks otherwise passed. Do not release because the core CLI can
report a well-formed XMP sidecar containing unrecognized proprietary metadata
as fully portable (exit 0 with no unknown field).

## What was verified

```sh
npm ci
npm test
npm run test:consumer
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --locked --list
npx playwright install chromium
npm run test:a11y
```

The publishable crate was installed from `target/package` into a fresh Cargo
consumer root and its public CLI was exercised. Production output is
`dist/site/`; the ready-to-review crate is
`target/package/sidecar-ledger-0.1.0.crate`. The factory, not this verification
worker, owns any registry publishing.

## Required work before retry

1. Report non-standard/unrecognized XMP namespaces conservatively as unknown
   without exposing opaque values; make it an attention/exit-2 result and add
   a regression test.
2. Precache the real JS/CSS/font shell or make service-worker fallback
   asset-aware. A fresh-profile offline reload currently logs module MIME
   errors and loses interactivity.
3. Make Playwright browser installation explicit so `npm run test:a11y` works
   from a clean clone without manual environment repair.

After those changes, rebuild and repeat the verification against both the new
commit and the deployed URL.
