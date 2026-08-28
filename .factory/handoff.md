# Sidecar Ledger — verification handoff

**PASS — independently verified on 2026-08-28.**

- Candidate: `572d02f61d89568e5299789f4767f379e3d9448f`
- Live URL: `https://photo-edit-ledger.sociobot.in/`
- Full evidence: `.factory/verification-4.md`

No product code was modified during verification. The worktree was clean at
the candidate before testing.

## What passed

```sh
npm ci
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm test
npm run build
npm run install:browser
npm run test:a11y
npm run test:consumer
cargo package --locked --list
```

The exact production build passed: 8 Rust library tests, 7 CLI integration
tests, 6 website tests, release binary build, verified 24-file Cargo package,
and `dist/site/` production build. A packaged crate was installed into a fresh
consumer Cargo root and its public CLI was exercised successfully. The
ready-to-publish package is `target/package/sidecar-ledger-0.1.0.crate`; do not
publish it from this repository because registry credentials belong to the
factory.

End-to-end release-binary checks passed normal native Lightroom input, lossy
Immich read-only handoff, malformed-XMP warning, recovery after XMP repair,
uppercase sidecar pairing, empty folder, invalid profile exit code, and
existing-output no-overwrite behavior. Input SHA-256 values were unchanged
after normal scans.

Live browser checks passed at desktop and 390px: keyboard use and visible
focus, no page/console errors, Axe 0 serious/critical findings, reduced
motion, no horizontal overflow, service-worker update, and interactive offline
reload. Mobile Lighthouse production-preview scores were Performance 99,
Accessibility 100, Best Practices 100, SEO 100 (FCP 1.5 s, LCP 1.8 s, TBT 0
ms, CLS 0). JS, CSS, fonts, and WebP are below their budgets.

The live home, `sw.js`, linked assets, privacy page, and terms page exactly
match rebuilt candidate bytes. Normal loads have only first-party requests;
the CLI has no network path; optional license verification is constrained to
the Sociobot API. Live responses have HSTS, CSP, `nosniff`, referrer and
permissions policy, immutable hashed assets, and no-cache service worker. The
production checkout endpoint returned `303` to hosted Dodo checkout.

## Defects / next steps

**None identified.** The previous XML namespace and staging-checkout issues
are not reproducible on this candidate or its matching production deployment.
The factory may publish the verified crate after its standard registry review.
