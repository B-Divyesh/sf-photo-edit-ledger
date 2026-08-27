# Sidecar Ledger — verification handoff

## FAIL — do not release this candidate

Verified 2026-08-27 against commit
`5bc7ffd5d111b6ce0452cb33116e31d85607e33d` and
`https://photo-edit-ledger.sociobot.in/`.

The live homepage is byte-for-byte identical to `dist/site/index.html` built
from this commit (SHA-256
`90787cda70bf490e832b0446cd7884ea52abfa71e811eab63082504971d4bbb6`).
The static deployment itself is healthy, but the CLI can confidently issue an
incorrect handoff contract, which defeats the researched job-to-be-done.

See `.factory/verification.md` for reproducible evidence and the complete
test matrix.

## Blocking defects

- **HIGH — arbitrary `rdf:Description` structure is reported as a photographer
  description.** A sidecar containing only a Camera Raw adjustment was reported
  with a portable `description` field. The parser mistakes RDF's structural
  `rdf:Description` element for `dc:description`/`xmp:Description`, creating
  an invented portable result in the very report a photographer must trust.
- **HIGH — malformed XMP can receive a clean portable verdict.** An XMP file
  containing `<x:xmpmeta><unclosed>` returned exit `0`, no read warning, and
  `needs_attention: false`. The report therefore claims a corrupt sidecar is
  safe to hand off.
- **HIGH — the public install command cannot work.** The website tells users
  `cargo install sidecar-ledger`, while `cargo search sidecar-ledger --limit 5`
  returned no registry package. The repository README instead documents the
  working `cargo install --path .` route. The deployment currently gives an
  unusable install path.

## Release-impacting follow-ups

- **MEDIUM — invalid option values exit 2, not the documented exit 1 for
  invalid input.** `--from not-a-tool` is rejected by clap with exit 2.
- **MEDIUM — uppercase `.XMP` sidecars are not paired on case-sensitive
  filesystems.** `C.DNG` plus `C.XMP` produces one image without a sidecar and
  one orphan; lowercase extension detection is inconsistent with matching.
- **MEDIUM — the live $19 buy link and verification client use the staging
  `pilot-api.sociobot.in` endpoint.** The production billing endpoint required
  by the contract is `api.sociobot.in`; an audit HEAD request to the current
  pilot checkout URL returned 404. Do not present this as a live paid checkout.
- **LOW — `npm run test:a11y` only works after a site build exists.** On a clean
  checkout it starts Vite preview before `dist/site` has been generated and
  falsely reports missing title/lang; `npm run build && npm run test:a11y`
  passes. Make the test self-building or document/order it correctly.

## How to verify after fixes

```sh
npm ci
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
npm run test:a11y
```

Also install the packaged crate into a fresh Cargo root, run normal,
malformed, missing-sidecar, uppercase-extension, overwrite-protection, and
invalid-option cases, then compare the rebuilt `dist/site/index.html` to the
deployed page before release.
