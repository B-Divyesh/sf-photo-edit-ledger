# Sidecar Ledger

Sidecar Ledger checks photo metadata before you switch tools.

It scans a folder and its XMP metadata sidecar files. The handoff report marks
each field as portable, lossy, or unknown.

The command-line scan runs locally and does not change source files. It does
not upload photos or metadata.

## Install

To install from a local checkout, use a current stable Rust toolchain:

```sh
cargo install --path . --locked
sidecar-ledger --help
```

## Try the bundled sample

Run the shipped Lightroom to Immich sample in a temporary folder:

```sh
sidecar-ledger demo
```

The command copies the sample, runs the real scanner, and prints the JSON
data-file handoff report path. Exit 2 means the sample needs review.

Open the isolated browser sample at
`https://photo-edit-ledger.sociobot.in/demo/` or
`https://photo-edit-ledger.sociobot.in/?demo=1`.

## Scan a folder

```sh
sidecar-ledger scan ~/Pictures/Trip --from lightroom --to immich
sidecar-ledger scan ~/Pictures/Trip --from darktable --to immich-readonly --json
sidecar-ledger tools --json
```

Exit 0 means portable. Exit 2 means review losses or unknowns. Exit 1 means
the input could not be scanned.

Supported profiles are `lightroom`, `darktable`, `immich`, `immich-readonly`,
`snapseed`, and `generic-xmp`.

Unknown metadata returns exit 2. The report names its vocabulary but never
prints its values.

## Develop and verify

```sh
npm ci
npm test
npm run install:browser
npm run test:a11y
npm run build
npm run test:consumer
```

`npm run build` creates the release binary, package, and static site in
`dist/site/`. `npm run install:browser` installs Chromium for browser checks.

## Privacy and license

The optional website license check runs on the landing page only. It never
receives photo metadata. Read the [privacy policy](https://photo-edit-ledger.sociobot.in/privacy/)
and [terms](https://photo-edit-ledger.sociobot.in/terms/).

The command-line scan and JSON handoff reports are free under the [MIT License](LICENSE).
