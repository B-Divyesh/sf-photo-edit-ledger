# Sidecar Ledger

Sidecar Ledger is a local, read-only preflight for photographers moving RAW or
DNG files between editors and self-hosted libraries. It inventories a folder
and its XMP sidecars, compares declared tool capabilities, and produces a
handoff contract: what is portable, what is lossy, and what remains unknown.

It does **not** edit photographs, translate proprietary adjustment recipes, or
upload any image or metadata. Scans do not change source files or timestamps.

## Install

The crate is not yet published on crates.io. Install the current public source
with a current stable Rust toolchain:

```sh
cargo install --git https://github.com/B-Divyesh/sf-photo-edit-ledger.git --locked
sidecar-ledger --help
```

For a checkout you already have locally:

```sh
cargo install --path . --locked
sidecar-ledger --help
```

Prebuilt release artifacts can be placed anywhere on your `PATH` when the
factory publishes them. The crate starts at `0.1.0`; registry publishing is
intentionally left to the factory after `cargo package --locked` review.

## Usage

Preflight a Lightroom handoff into a writable Immich library:

```sh
sidecar-ledger scan ~/Pictures/Trip --from lightroom --to immich
```

Produce stable JSON for a script or archive the report explicitly:

```sh
sidecar-ledger scan ~/Pictures/Trip --from darktable --to immich-readonly --json
sidecar-ledger scan ~/Pictures/Trip --from lightroom --to snapseed \
  --output handoff.json --json
```

List the built-in, versioned capability declarations:

```sh
sidecar-ledger tools
sidecar-ledger tools --json
```

Exit codes are `0` for a fully portable scan, `2` when losses or unknowns need
attention, and `1` for invalid input or an unreadable scan. Human reports go to
stdout, diagnostics to stderr. JSON output has a versioned `schema_version`.

Supported built-in profiles are `lightroom`, `darktable`, `immich`,
`immich-readonly`, `snapseed`, and `generic-xmp`. Sidecar Ledger recognizes
XMP ratings, descriptions, labels, keywords, and tool-specific adjustment
namespaces while keeping opaque adjustment values out of the report. Any
unrecognized metadata namespace is reported as `unknown` and returns exit 2;
the report names the vocabulary but never prints its opaque values.

## Example

The fixture under `tests/fixtures/catalog` documents the public behavior:

```sh
cargo run -- scan tests/fixtures/catalog --from lightroom --to immich --json
```

The test suite runs this documented route and verifies inventory counts,
classifications, JSON compatibility, errors, and the no-mutation guarantee.

## Develop and verify

```sh
npm install
npm test
npm run install:browser
npm run test:a11y
npm run build
```

`npm test` runs Rust tests plus browser-site tests. `npm run build` produces the
release binary, packages the crate, and builds the static site into
`dist/site/` (with `index.html` at that root). Use `npm run dev` for the site.
`npm run install:browser` explicitly downloads the Chromium binary used by the
accessibility and offline-PWA check, so that check works from a clean clone.

## Privacy and licensing

The CLI is local-only and has no telemetry, network client, or write path to
the scanned archive. The optional website license check is isolated to the
landing page and never receives photo metadata. Details live at `/privacy` and
`/terms` on the website.

Copyright 2026 Sidecar Ledger contributors. Released under the [MIT License](LICENSE).
