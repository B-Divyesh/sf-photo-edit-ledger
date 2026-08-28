# Adversarial first-read review 3 — Sidecar Ledger

**Verdict: FAIL**

Reviewed 2026-08-28 at `c0feffe150bf1e3b71e362cd463bbea2dd8d4154`, using
fresh 390×844 and 1440×900 Chromium contexts, clean clone
`/tmp/photo-edit-ledger-review3.AsgYRc`, and a fresh CLI temp directory. No
product code was changed.

## Cold first screen

Before scrolling, both widths answered all three questions.

- **What:** Checks which photo metadata and photo edit settings will survive
  when switching tools.
- **For whom:** Photographers moving RAW files between tools.
- **First action:** **Try it with sample data**; **“Opens a sample Lightroom →
  Immich report. Nothing is saved.”** says what happens next.

The six-word h1, **“Check photo metadata before switching tools,”** and the
17-word audience sentence are direct. The three short facts are present. The
cold first-read check passes.

## Findings

### Minor

#### F-3-1 — JSON is unexplained at its first landing-page use

**Location / quote:** Home → How it works → step 03: **“Keep JSON with the
archive before you move it.”**

**Why it fails:** “JSON” is a technical format name, and this is its first
occurrence on the landing page. The later expansion “JSON data-file report”
does not help a visitor reading this step in order. This misses the
plain-words first-use expansion rule.

**Fix:** Use **“Keep the JSON data-file report with the archive before you move
it.”** Add a copy-audit regression that requires this first-use expansion.

## Copy audit

Word counts use visible word tokens; arrows and separators do not add words.
No sentence exceeds 22 words. No banned marketing adjective appears. All
buttons name the result; navigation items are links. F-3-1 is the sole flag.

### Landing sentences

| Words | Text | Check |
| ---: | --- | --- |
| 17 | For photographers moving RAW files between tools, it shows which metadata and photo edit settings will survive. | Plain audience/result. |
| 6 | Opens a sample Lightroom → Immich report. | Plain outcome. |
| 3 | Nothing is saved. | `demo-isolated`. |
| 7 | A photo and sidecar, checked together. | Clear caption. |
| 9 | Read image filenames and nearby XMP metadata sidecar files. | XMP expanded at first use. |
| 6 | See portable, lossy, or unknown results. | Terms defined below. |
| 9 | Keep JSON with the archive before you move it. | **F-3-1.** |
| 10 | Sidecar Ledger reads image filenames and nearby XMP metadata sidecar files. | `handoff-report`. |
| 6 | It does not change source files. | `read-only-local`. |
| 18 | Terminal recording of sidecar-ledger demo. It scans two images and one sidecar, writes a temporary JSON handoff report, and exits 2 for review. | Descriptive alt; `demo-cli-real`. |
| 14 | sidecar-ledger demo copies the sample to a temporary folder and prints its report path. | `demo-cli-real`. |
| 10 | The destination has a declared way to keep the field. | Defines Portable. |
| 8 | Keep a backup or render before the move. | Defines Lossy. |
| 8 | Test one representative photo before the full move. | Defines Unknown. |
| 5 | Unknown edit data stays private. | `opaque-values`. |
| 11 | The report names the data vocabulary but never displays its contents. | `opaque-values`. |
| 9 | The command-line program does not edit photos or upload metadata. | `read-only-local`, `cli-private`. |
| 14 | It reports declared support, not a promise that every app version behaves the same. | Clear limitation. |
| 8 | Read the privacy policy and terms of use. | Working legal links. |
| 15 | The command-line program, field results, and JSON data-file report stay free under the MIT License. | `free-mit`. |
| 10 | An optional $19 one-time purchase adds browser migration steps. | `paid-price`, `migration-steps`. |
| 6 | Sociobot/Dodo is the merchant of record. | `merchant-refund`. |
| 4 | Refunds revoke Pro access. | `merchant-refund`. |
| 7 | Privacy and terms explain the optional license. | Legal links checked. |
| 6 | Check photo metadata before switching tools. | Consistent footer line. |

Headings and labels were also checked: **Local photo metadata scan**; **How it
works**; **Scan a folder, then keep the report**; **Scan filenames and sidecar
files without changing them**; **Read one result for every metadata field**;
**Privacy and limits**; **Keep your originals and test a small copy**;
**Optional Pro migration steps**; and **Six route-specific migration steps**.
They make sense in a heading list. Terms are consistent: scan, handoff report,
photo edit settings, and migration steps. Actions **Try it with sample data**,
**Buy Pro**, **Restore Pro access**, **Verify license**, and **Remove license
from this browser** name their results. The two-sentence support heading,
**“Keep the scan free. Buy migration steps once.”**, has counts 4 and 4 and is
plain, result-oriented copy.

### README sentences

| Words | Text | Check |
| ---: | --- | --- |
| 9 | Sidecar Ledger checks photo metadata before you switch tools. | Plain job statement. |
| 10 | It scans a folder and its XMP metadata sidecar files. | `handoff-report`. |
| 11 | The handoff report marks each field as portable, lossy, or unknown. | `handoff-report`. |
| 11 | The command-line scan runs locally and does not change source files. | `read-only-local`. |
| 7 | It does not upload photos or metadata. | `cli-private`. |
| 12 | To install from a local checkout, use a current stable Rust toolchain. | `checkout-install`. |
| 11 | Run the shipped Lightroom to Immich sample in a temporary folder. | Clear demo instruction. |
| 17 | The command copies the sample, runs the real scanner, and prints the JSON data-file handoff report path. | `demo-cli-real`. |
| 7 | Exit 2 means the sample needs review. | `exit-codes`. |
| 4 | Exit 0 means portable. | `exit-codes`. |
| 7 | Exit 2 means review losses or unknowns. | `exit-codes`. |
| 9 | Exit 1 means the input could not be scanned. | `exit-codes`. |
| 10 | Supported profiles are lightroom, darktable, immich, immich-readonly, snapseed, and generic-xmp. | `profiles`. |
| 5 | Unknown metadata returns exit 2. | `opaque-values`. |
| 10 | The report names its vocabulary but never prints its values. | `opaque-values`. |
| 11 | Open the isolated browser sample at https://photo-edit-ledger.sociobot.in/demo/ or https://photo-edit-ledger.sociobot.in/?demo=1. | Working demo instruction. |
| 13 | npm run build creates the release binary, package, and static site in dist/site/. | `build-output`. |
| 8 | npm run install:browser installs Chromium for browser checks. | `browser-install`. |
| 11 | The optional website license check runs on the landing page only. | `license-scope`. |
| 5 | It never receives photo metadata. | `license-scope`. |
| 13 | The command-line scan and JSON handoff reports are free under the MIT License. | `free-mit`. |

README headings — **Install**, **Try the bundled sample**, **Scan a folder**,
**Develop and verify**, and **Privacy and license** — are clear alone. The
demo URL line is an instruction, not an unlisted claim.

## Demo and sandbox

Home → **Try it with sample data** opened `/demo/`. Its first screen already
showed the Lightroom → Immich sample: two photo files, one XMP metadata
sidecar, five field results, and Attention. The persistent **“Demo — sample
data, nothing is saved”** banner includes **Reset demo** and **Start for real**.

With pre-seeded real license, verdict, and sentinel storage, `/demo/` preserved
each value exactly. A route change followed by Reset restored Lightroom →
Immich without changing those keys. The flow requested only
`photo-edit-ledger.sociobot.in`; no files or metadata left the browser.
`/?demo=1` redirects in a browser to `/demo/`. After service-worker control,
offline reload remained interactive with no console errors.

From a separate temporary directory, the clean-clone release binary ran
`sidecar-ledger demo`, created `/tmp/sidecar-ledger-demo-*`, wrote
`lightroom-to-immich.json`, printed both paths, and exited 2 as documented.

## Claims and quality gates

All 20 exact commands in `.factory/claims.json` passed individually from the
clean clone, and each selected one tagged claim test. `npm test`, `npm run
build`, `npm run test:a11y`, and `npm run test:consumer` also passed. The build
created `dist/site/`. Claim-like statements on Home, README, Privacy, and Terms
all map to a manifest entry; no unlisted claim was found.

## Structure, links, and identity

Live Home, Demo, Privacy, Terms, and 404 had one h1, one main, route titles,
descriptions, canonical URLs, favicon/Apple touch icons, OG data, and full
Twitter tags. The unknown URL returned the designed page with HTTP 404. Home →
Demo → Back restored Home, focused `#hero-title`, and announced the route.
Internal links returned 200; GitHub returned 200; checkout returned 303 to
Dodo. Normal Home/Demo loads had no console errors. Header/footer, skip link,
focus states, reduced motion, and 390px layout passed. The ceramic archive art,
cold worktable palette, ledger rules, and mono/body type pairing are distinct,
not a generic SaaS template.

## Earlier findings

Every earlier review, polish ledger, and handoff was read. All prior findings
were confirmed fixed live and in code; none is reopened. This includes every
F-1-1 through F-1-62 and F-2-1 through F-2-11: the sample path, real CLI demo,
isolated storage, manifest and selector behavior, privacy/refund interception,
six paid routes, terminology, social metadata, touch targets, external labels,
copy-audit coverage, 404, route focus, links, and offline operation all pass.
F-3-1 is a new first-use JSON wording gap.

## Missed leverage

No missing AI feature is found: deterministic local XMP inventory and profile
comparison do not need a model, and AI would weaken the private, inspectable
workflow. The brief's machine-readable export exists as the JSON handoff
report; cloud sync is not implied by this local-first CLI.

## What would make this perfect

Fix F-3-1 and add its copy-audit regression. Then rerun this full cold-read,
demo, claim, offline, history, routing, crawl, and accessibility review. PASS
requires zero findings.
