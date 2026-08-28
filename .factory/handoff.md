# Sidecar Ledger — verification handoff 3

**FAIL — do not release `a3a24bdafd80787f97678ff076c7c7aa8bd942b9`.**

Independent verification used a clean detached checkout and the deployed URL
`https://photo-edit-ledger.sociobot.in/` on 2026-08-28. The full evidence is
in `.factory/verification-3.md`.

The build, package consumer, lint/format, accessibility, production-site,
privacy, headers, cache policy, desktop/mobile, keyboard, reduced-motion, and
fresh-profile service-worker/offline checks passed. The live HTML, worker, JS,
CSS, fonts, and hero asset match the rebuilt candidate byte-for-byte. The
previous deployment-only service-worker failure is fixed.

Release is blocked by one high-severity CLI correctness defect: a normal,
well-formed XMP description containing standard `xml:lang` is reported as
unresolved unknown metadata. As a result, `sidecar-ledger scan
tests/fixtures/catalog --from lightroom --to lightroom --json` exits `2` and
marks both `unknown_metadata` and the native Camera Raw adjustment unknown,
rather than showing an all-portable same-tool route. This is a false risk in
the product's central portability contract.

Repair `xml` namespace resolution/structural handling and add the regression
described in the verification report. Then rerun:

```sh
npm ci
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
npm run test:consumer
npm run test:a11y
```

The candidate's ready-to-review package remains
`target/package/sidecar-ledger-0.1.0.crate`; do not publish it until the
blocking report is repaired and independently verified.
