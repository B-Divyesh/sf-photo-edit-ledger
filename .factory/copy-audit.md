# Copy audit — polish 2

The landing page and README were audited against the live source. Counts use
word tokens; arrows, code, and separators are not words. No audited sentence
exceeds 22 words or uses a banned marketing word.

| Concept | Term used |
| --- | --- |
| Inspection action | scan |
| Output | handoff report |
| Editor-specific adjustments | photo edit settings |
| Optional paid guidance | migration steps |
| XMP | XMP metadata sidecar file |
| JSON | JSON data-file report |
| CLI | command-line program |

## Landing page

| Text | Words |
| --- | ---: |
| Check photo metadata before switching tools | 6 |
| For photographers moving RAW files between tools, it shows which metadata and photo edit settings will survive. | 17 |
| Try it with sample data | 5 |
| Opens a sample Lightroom Immich report. Nothing is saved. | 9 |
| Runs on your computer | 4 |
| Sample works offline | 3 |
| Core scan free Pro 19 once | 6 |
| A photo and sidecar, checked together. | 7 |
| Scan a folder, then keep the report | 7 |
| Read image filenames and nearby XMP metadata sidecar files. | 9 |
| See portable, lossy, or unknown results. | 6 |
| Keep JSON with the archive before you move it. | 9 |
| Scan filenames and sidecar files without changing them | 8 |
| Sidecar Ledger reads image filenames and nearby XMP metadata sidecar files. | 10 |
| It does not change source files. | 6 |
| The command-line program does not edit photos or upload metadata. | 9 |
| It reports declared support, not a promise that every app version behaves the same. | 14 |
| Keep your originals and test a small copy | 8 |
| The command-line program, field results, and JSON data-file report stay free under the MIT License. | 15 |
| An optional 19 one-time purchase adds browser migration steps. | 10 |
| Sociobot/Dodo is the merchant of record. Refunds revoke Pro access. | 11 |
| Six route-specific migration steps | 4 |
| Buy Pro 19 once opens secure checkout | 7 |
| Check photo metadata before switching tools. | 6 |

## README

| Text | Words |
| --- | ---: |
| Sidecar Ledger checks photo metadata before you switch tools. | 9 |
| It scans a folder and its XMP metadata sidecar files. | 10 |
| The handoff report marks each field as portable, lossy, or unknown. | 11 |
| The command-line scan runs locally and does not change source files. | 11 |
| It does not upload photos or metadata. | 7 |
| To install from a local checkout, use a current stable Rust toolchain. | 12 |
| Run the shipped Lightroom to Immich sample in a temporary folder. | 11 |
| The command copies the sample, runs the real scanner, and prints the JSON data-file handoff report path. | 17 |
| Exit 2 means the sample needs review. | 7 |
| Exit 0 means portable. | 4 |
| Exit 2 means review losses or unknowns. | 7 |
| Exit 1 means the input could not be scanned. | 9 |
| Unknown metadata returns exit 2. | 5 |
| The report names its vocabulary but never prints its values. | 10 |
| npm run build creates the release binary, package, and static site in dist/site. | 13 |
| npm run install:browser installs Chromium for browser checks. | 8 |
| The optional website license check runs on the landing page only. | 11 |
| It never receives photo metadata. | 5 |
| The command-line scan and JSON handoff reports are free under the MIT License. | 13 |
