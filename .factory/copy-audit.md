# Copy audit — polish 4

This is the current source audit for the landing page, README, Terms, and
conditional browser text. Counts use visible word tokens; route arrows,
punctuation, code formatting, and separators do not add words. No sentence is
over 22 words or uses a banned marketing word.

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

| Words | Text |
| ---: | --- |
| 2 | Sidecar Ledger |
| 2 | You’re offline. |
| 5 | The sample report still works. |
| 4 | Local photo metadata scan |
| 6 | Check photo metadata before switching tools |
| 17 | For photographers moving RAW files between tools, it shows which metadata and photo edit settings will survive. |
| 5 | Try it with sample data |
| 6 | Opens a sample Lightroom → Immich report. |
| 3 | Nothing is saved. |
| 4 | Runs on your computer |
| 3 | Sample works offline |
| 6 | Core scan free · Pro $19 once |
| 7 | A photo and sidecar, checked together. |
| 3 | How it works |
| 7 | Scan a folder, then keep the report |
| 3 | Scan a folder |
| 9 | Read image filenames and nearby XMP metadata sidecar files. |
| 3 | Review each field |
| 6 | See portable, lossy, or unknown results. |
| 3 | Save the report |
| 12 | Keep the JSON data-file report with the archive before you move it. |
| 4 | One command-line program · v0.1.0 |
| 8 | Scan filenames and sidecar files without changing them |
| 10 | Sidecar Ledger reads image filenames and nearby XMP metadata sidecar files. |
| 6 | It does not change source files. |
| 2 | local shell |
| 8 | Exit 0: portable · 2: review · 1: input error |
| 2 | Bundled sample |
| 5 | Watch the real sample scan |
| 5 | Terminal recording of sidecar-ledger demo. |
| 18 | It scans two images and one sidecar, writes a temporary JSON handoff report, and exits 2 for review. |
| 14 | sidecar-ledger demo copies the sample to a temporary folder and prints its report path. |
| 2 | Field results |
| 7 | Read one result for every metadata field |
| 10 | The destination has a declared way to keep the field. |
| 8 | Keep a backup or render before the move. |
| 8 | Test one representative photo before the full move. |
| 5 | Unknown edit data stays private. |
| 11 | The report names the data vocabulary but never displays its contents. |
| 3 | Privacy and limits |
| 8 | Keep your originals and test a small copy |
| 9 | The command-line program does not edit photos or upload metadata. |
| 14 | It reports declared support, not a promise that every app version behaves the same. |
| 8 | Read the privacy policy and terms of use. |
| 4 | Optional Pro migration steps |
| 4 | Keep the scan free. |
| 4 | Buy migration steps once. |
| 15 | The command-line program, field results, and JSON data-file report stay free under the MIT License. |
| 10 | An optional $19 one-time purchase adds browser migration steps. |
| 6 | Sociobot/Dodo is the merchant of record. |
| 4 | Refunds revoke Pro access. |
| 7 | Privacy and terms explain the optional license. |
| 4 | Six route-specific migration steps |
| 7 | Buy Pro · $19 once — opens secure checkout |
| 2 | Already purchased? |
| 3 | Restore Pro access |
| 2 | License token |
| 2 | Verify license |
| 3 | Your migration steps |
| 4 | Choose a migration route |
| 5 | Remove license from this browser |
| 6 | Check photo metadata before switching tools. |
| 5 | Built by Param Factory · v0.1.0 |

## Conditional landing text

| Words | Text |
| ---: | --- |
| 6 | License verified within the last day. |
| 6 | Offline — using the last verified license. |
| 6 | Connect once to verify this license. |
| 2 | Checking license… |
| 2 | License active. |
| 4 | License no longer active. |
| 8 | Check the token or purchase a new license. |
| 5 | Could not reach license verification. |
| 5 | Your free tools still work. |
| 5 | Could not verify right now. |
| 7 | Check your connection and try again. |
| 5 | Checking license in the background… |
| 5 | License removed from this browser. |
| 9 | Write metadata to an XMP metadata sidecar in Lightroom. |
| 8 | Back up the catalog and original photos together. |
| 9 | Import a 20-photo sample, then compare ratings and captions. |
| 7 | Export finished master renders for virtual-copy variants. |
| 8 | Render a TIFF for visual edits before transfer. |
| 10 | Do not expect Camera Raw photo edit settings in Snapseed. |
| 7 | Keep the original DNG and XMP metadata sidecar together. |
| 5 | Write darktable sidecars before copying. |
| 6 | Keep .xmp files with matching filenames. |
| 7 | Render critical history stacks for visual parity. |
| 7 | Run a new scan after the transfer. |
| 6 | Keep darktable sidecars with each original. |
| 6 | Test one album in Snapseed. |
| 7 | Keep the source archive as the edit record. |
| 6 | Export a representative folder with sidecars. |
| 7 | Keep the Immich library intact until review. |
| 5 | Import the sample into Lightroom. |
| 5 | Compare captions, keywords, and ratings. |
| 7 | Copy originals and XMP metadata sidecars together. |
| 7 | Archive the JSON data file handoff report. |
| 4 | Test one destination album. |
| 6 | Keep rendered copies for critical edits. |

## README

| Words | Text |
| ---: | --- |
| 9 | Sidecar Ledger checks photo metadata before you switch tools. |
| 10 | It scans a folder and its XMP metadata sidecar files. |
| 11 | The handoff report marks each field as portable, lossy, or unknown. |
| 11 | The command-line scan runs locally and does not change source files. |
| 7 | It does not upload photos or metadata. |
| 12 | To install from a local checkout, use a current stable Rust toolchain. |
| 11 | Run the shipped Lightroom to Immich sample in a temporary folder. |
| 17 | The command copies the sample, runs the real scanner, and prints the JSON data-file handoff report path. |
| 7 | Exit 2 means the sample needs review. |
| 11 | Open the isolated browser sample at https://photo-edit-ledger.sociobot.in/demo/ or https://photo-edit-ledger.sociobot.in/?demo=1. |
| 4 | Exit 0 means portable. |
| 7 | Exit 2 means review losses or unknowns. |
| 9 | Exit 1 means the input could not be scanned. |
| 10 | Supported profiles are lightroom, darktable, immich, immich-readonly, snapseed, and generic-xmp. |
| 5 | Unknown metadata returns exit 2. |
| 10 | The report names its vocabulary but never prints its values. |
| 13 | npm run build creates the release binary, package, and static site in dist/site/. |
| 8 | npm run install:browser installs Chromium for browser checks. |
| 6 | Run npm run build before release. |
| 6 | Publish dist/site/ as the static site. |
| 6 | Use target/package/sidecar-ledger-0.1.0.crate for the command-line release. |
| 8 | The Param Factory handles deployment infrastructure, DNS, and billing. |
| 11 | The optional website license check runs on the landing page only. |
| 5 | It never receives photo metadata. |
| 6 | Read the privacy policy and terms. |
| 13 | The command-line scan and JSON handoff reports are free under the MIT License. |

## Terms

| Words | Text |
| ---: | --- |
| 10 | Sidecar Ledger is a scan aid, not a backup service. |
| 7 | Its field results describe tested profile data. |
| 11 | Test a representative copy before moving or deleting an archive. |
| 9 | Keep verified backups of originals and XMP metadata sidecar files. |
| 8 | Review the handoff report before a move. |
| 10 | The command-line program is read-only, but later commands may not be. |
| 8 | The program is available under the MIT License. |
| 10 | You may use, inspect, modify, and redistribute it under that license. |
| 4 | Pro costs $19 once. |
| 6 | It adds route-specific browser migration steps. |
| 13 | The command-line scan and JSON data-file reports stay free under the MIT License. |
| 6 | Sociobot/Dodo is the merchant of record. |
| 9 | Refunds revoke Pro access after the next license check. |
| 7 | Profile data may be corrected as applications change. |
| 12 | To the extent permitted by law, the product is provided as is without warranty. |
