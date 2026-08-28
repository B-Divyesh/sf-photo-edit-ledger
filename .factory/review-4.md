# Adversarial first-read review 4 — Sidecar Ledger

**Verdict: FAIL**

Reviewed 2026-08-28 at `4d2281e4d6653b309d198a865a0cd7a5f0a737cf`
against `https://photo-edit-ledger.sociobot.in/`, using fresh Chromium
contexts at 390×844 and 1440×900, clean clone
`/tmp/photo-edit-ledger-review4-clean`, and a separate CLI working directory.
No product code was changed. There are no blocking findings, but PASS requires
zero findings.

## Findings

### Major

#### F-4-1 — The required facts fall below the desktop first screen

**Location / quote:** Home at 1440×900. The h1 **“Check photo metadata before
switching tools”** occupies about 471 px vertically. The action note ends at
912 px and the fact list starts at 948 px, below the 900 px viewport:
**“Runs on your computer”**, **“Sample works offline”**, and **“Core scan free ·
Pro $19 once.”**

**Why it fails:** The action itself is visible, so the three cold-read
questions can still be answered and this is not blocking. However, the
plain-words and site-structure contracts require the action outcome and three
facts in the first screen. The desktop h1's `max-width: 10ch` forces six tall
lines and pushes that required evidence below the fold.

**Concrete fix:** Widen the desktop h1 measure or reduce its desktop size and
hero spacing so the full action note and fact list end above 900 px. Add a
1440×900 bounding-box test for `.action-note` and `.trust-list`; retain the
current mobile layout.

#### F-4-2 — Terms makes an unlisted free-feature claim

**Location / quote:** `/terms/` → Optional Pro access: **“The command-line
program, field results, JSON data-file output, privacy controls, and
accessibility features stay free.”**

**Why it fails:** `free-mit` lists and tests only the free command-line scan and
JSON handoff reports. No claims entry lists or tests that website privacy
controls and accessibility features remain ungated. This is an unlisted claim
under the claims contract.

**Concrete fix:** Rewrite the sentence to the tested scope, for example:
**“The command-line scan and JSON data-file reports stay free under the MIT
License.”** Alternatively, add one exact claim entry and tagged test that
proves every retained feature is available before and after license state
changes.

### Minor

#### F-4-3 — The real CLI demo and its landing recording disagree

**Location / quote:** A release binary run from a fresh temp directory prints
**“Inventory: 2 images, 1 sidecars, 1 paired, 0 orphaned.”** The landing's
**“Watch the real sample scan”** recording prints **“Inventory: 2 images, 1
sidecar, 1 paired, 0 orphaned.”**

**Why it fails:** “1 sidecars” is a visible grammar defect, and the page calls
the polished SVG a recording of the real command even though its line is not
the command's exact output. The claim test currently preserves the mismatch by
expecting plural text from the process and singular text from the recording.

**Concrete fix:** Pluralize image and sidecar counts correctly in CLI output,
then make `@claim:demo-cli-real` compare the recording's inventory line with
the real demo line rather than asserting two different strings.

#### F-4-4 — README omits deployment guidance

**Location:** `README.md` ends its workflow documentation at **“Develop and
verify”** and does not say how the built artifacts are deployed.

**Why it fails:** The repository contract requires the README to explain how
to run, test, and deploy the product. A maintainer can build `dist/site/` but
cannot tell from the README what is publishable or that factory deployment,
not repository code, owns infrastructure.

**Concrete fix:** Add a **Deploy** section: run `npm run build`, publish
`dist/site/` as the static site, use the packaged crate for CLI release, and
state that the Param Factory handles infrastructure, DNS, and billing.

## Cold first screen

Before scrolling, both widths gave these answers:

- **What:** checks which photo metadata and photo edit settings survive a move
  between tools.
- **For whom:** photographers moving RAW files between tools.
- **First click:** **Try it with sample data**, which opens a sample Lightroom
  → Immich report.

The exact h1 and lead are **“Check photo metadata before switching tools”**
and **“For photographers moving RAW files between tools, it shows which
metadata and photo edit settings will survive.”** Mobile shows the complete
action note and all three facts by 830 px. Desktop shows the action, but the
second line of its note crosses the 900 px edge and the facts start at 948 px;
see F-4-1.

## Copy audit

Counts use visible word tokens; arrows and separators are not words. No
landing or README sentence exceeds 22 words or uses a banned marketing word.
XMP, JSON, command-line program, handoff report, photo edit settings, and
migration steps are expanded or used consistently. F-4-3 is outside these two
copy surfaces but fails the real CLI demo's plain-language check.

### Landing-page sentences

| Words | Exact text | Flag |
| ---: | --- | --- |
| 2 | You’re offline. | None. |
| 5 | The sample report still works. | Tested by `offline-demo`. |
| 17 | For photographers moving RAW files between tools, it shows which metadata and photo edit settings will survive. | None. |
| 6 | Opens a sample Lightroom → Immich report. | Desktop placement: F-4-1. |
| 3 | Nothing is saved. | Desktop placement: F-4-1; tested by `demo-isolated`. |
| 17 | Two ceramic archive plates representing a photograph and its metadata sidecar, joined by a thin registration line. | Purposeful alt text. |
| 7 | A photo and sidecar, checked together. | None. |
| 9 | Read image filenames and nearby XMP metadata sidecar files. | XMP expanded. |
| 6 | See portable, lossy, or unknown results. | Terms defined later. |
| 12 | Keep the JSON data-file report with the archive before you move it. | JSON expanded at first use. |
| 10 | Sidecar Ledger reads image filenames and nearby XMP metadata sidecar files. | `handoff-report`. |
| 6 | It does not change source files. | `read-only-local`. |
| 5 | Terminal recording of sidecar-ledger demo. | Recording mismatch: F-4-3. |
| 18 | It scans two images and one sidecar, writes a temporary JSON handoff report, and exits 2 for review. | `demo-cli-real`. |
| 14 | sidecar-ledger demo copies the sample to a temporary folder and prints its report path. | `demo-cli-real`. |
| 10 | The destination has a declared way to keep the field. | Defines Portable. |
| 8 | Keep a backup or render before the move. | Defines Lossy. |
| 8 | Test one representative photo before the full move. | Defines Unknown. |
| 5 | Unknown edit data stays private. | `opaque-values`. |
| 11 | The report names the data vocabulary but never displays its contents. | `opaque-values`. |
| 9 | The command-line program does not edit photos or upload metadata. | `read-only-local`, `cli-private`. |
| 14 | It reports declared support, not a promise that every app version behaves the same. | Clear limitation. |
| 8 | Read the privacy policy and terms of use. | `legal-routes`. |
| 4 | Keep the scan free. | `free-mit`. |
| 4 | Buy migration steps once. | `paid-price`, `migration-steps`. |
| 15 | The command-line program, field results, and JSON data-file report stay free under the MIT License. | `free-mit`. |
| 10 | An optional $19 one-time purchase adds browser migration steps. | `paid-price`, `migration-steps`. |
| 6 | Sociobot/Dodo is the merchant of record. | `merchant-refund`. |
| 4 | Refunds revoke Pro access. | `merchant-refund`. |
| 7 | Privacy and terms explain the optional license. | `legal-routes`, `license-scope`. |
| 6 | Check photo metadata before switching tools. | Consistent footer line. |

### Landing headings, facts, and actions

| Words | Exact text | Check |
| ---: | --- | --- |
| 2 | Sidecar Ledger | Wordmark. |
| 1 each | Demo; Install; Privacy; Terms | Navigation nouns, not action buttons. |
| 4 | Local photo metadata scan | Concrete eyebrow. |
| 6 | Check photo metadata before switching tools | Job-naming h1. |
| 5 | Try it with sample data | Result-naming action. |
| 4 | Runs on your computer | F-4-1 placement; `read-only-local`. |
| 3 | Sample works offline | F-4-1 placement; `offline-demo`. |
| 6 | Core scan free · Pro $19 once | F-4-1 placement; `free-mit`, `paid-price`. |
| 3 | How it works | Section label. |
| 7 | Scan a folder, then keep the report | Clear h2. |
| 3 each | Scan a folder; Review each field; Save the report | Verb-led step headings. |
| 4 | One command-line program · v0.1.0 | Concrete product label. |
| 8 | Scan filenames and sidecar files without changing them | Clear h2. |
| 2 | local shell | Terminal label. |
| 8 | Exit 0: portable · 2: review · 1: input error | Tested status legend. |
| 2 | Bundled sample | Section label. |
| 5 | Watch the real sample scan | F-4-3. |
| 2 | Field results | Section label. |
| 7 | Read one result for every metadata field | Clear h2. |
| 1 each | Portable; Lossy; Unknown | Defined immediately below. |
| 3 | Privacy and limits | Clear section label. |
| 8 | Keep your originals and test a small copy | Clear h2. |
| 4 | Optional Pro migration steps | Clear section label. |
| 4 | Six route-specific migration steps | Exact h3. |
| 7 | Buy Pro · $19 once — opens secure checkout | Result-naming external action. |
| 2 | Already purchased? | Clear prompt. |
| 3 | Restore Pro access | Result-naming action. |
| 2 | License token | Bound form label. |
| 2 | Verify license | Result-naming action. |
| 3 | Your migration steps | Clear unlocked heading. |
| 4 | Choose a migration route | Bound select label. |
| 5 | Remove license from this browser | Result-naming action. |
| 5 | Built by Param Factory · v0.1.0 | Build identity. |

### Conditional landing-page sentences

These strings appear after a license check or after Pro access is restored.
All remain within the 22-word cap and avoid banned marketing language.

| Words | Exact text | Check |
| ---: | --- | --- |
| 6 | License verified within the last day. | Clear cached-verdict status. |
| 6 | Offline — using the last verified license. | Clear offline status. |
| 6 | Connect once to verify this license. | Names the next action. |
| 2 | Checking license… | Clear progress status. |
| 2 | License active. | Clear result. |
| 4 | License no longer active. | Clear result. |
| 8 | Check the token or purchase a new license. | Names next actions. |
| 5 | Could not reach license verification. | Says what failed. |
| 5 | Your free tools still work. | Clear fallback; covered by the free CLI behavior. |
| 5 | Could not verify right now. | Says what failed. |
| 7 | Check your connection and try again. | Names the next action. |
| 5 | Checking license in the background… | Clear progress status. |
| 5 | License removed from this browser. | Clear result. |
| 9 | Write metadata to an XMP metadata sidecar in Lightroom. | XMP expanded. |
| 8 | Back up the catalog and original photos together. | Plain migration step. |
| 9 | Import a 20-photo sample, then compare ratings and captions. | Plain migration step. |
| 7 | Export finished master renders for virtual-copy variants. | Plain migration step. |
| 8 | Keep the Lightroom catalog as the edit record. | Plain migration step. |
| 8 | Export a rendered 16-bit TIFF for visual editing. | Technical format is necessary. |
| 10 | Do not expect Camera Raw photo edit settings in Snapseed. | Plain limitation. |
| 9 | Keep the original DNG and XMP metadata sidecar together. | XMP expanded. |
| 5 | Write darktable sidecars before copying. | Plain migration step. |
| 6 | Keep .xmp files with matching filenames. | Plain migration step. |
| 7 | Render critical history stacks for visual parity. | Plain migration step. |
| 7 | Run a new scan after the transfer. | Verb-led next step. |
| 6 | Keep darktable sidecars with each original. | Plain migration step. |
| 8 | Render a TIFF for visual edits before transfer. | Plain migration step. |
| 6 | Test one album in Snapseed. | Plain migration step. |
| 7 | Keep the source archive as the edit record. | Plain migration step. |
| 6 | Export a representative folder with sidecars. | Plain migration step. |
| 7 | Keep the Immich library intact until review. | Plain migration step. |
| 5 | Import the sample into Lightroom. | Plain migration step. |
| 5 | Compare captions, keywords, and ratings. | Plain migration step. |
| 7 | Copy originals and XMP metadata sidecars together. | XMP expanded. |
| 7 | Archive the JSON data file handoff report. | Understandable technical instruction. |
| 4 | Test one destination album. | Plain migration step. |
| 6 | Keep rendered copies for critical edits. | Plain migration step. |

### README sentences

| Words | Exact text | Flag |
| ---: | --- | --- |
| 9 | Sidecar Ledger checks photo metadata before you switch tools. | None. |
| 10 | It scans a folder and its XMP metadata sidecar files. | XMP expanded; `handoff-report`. |
| 11 | The handoff report marks each field as portable, lossy, or unknown. | `handoff-report`. |
| 11 | The command-line scan runs locally and does not change source files. | `read-only-local`. |
| 7 | It does not upload photos or metadata. | `cli-private`. |
| 12 | To install from a local checkout, use a current stable Rust toolchain. | `checkout-install`. |
| 11 | Run the shipped Lightroom to Immich sample in a temporary folder. | Clear demo instruction. |
| 17 | The command copies the sample, runs the real scanner, and prints the JSON data-file handoff report path. | `demo-cli-real`. |
| 7 | Exit 2 means the sample needs review. | `exit-codes`. |
| 11 | Open the isolated browser sample at https://photo-edit-ledger.sociobot.in/demo/ or https://photo-edit-ledger.sociobot.in/?demo=1. | Working instruction. |
| 4 | Exit 0 means portable. | `exit-codes`. |
| 7 | Exit 2 means review losses or unknowns. | `exit-codes`. |
| 9 | Exit 1 means the input could not be scanned. | `exit-codes`. |
| 10 | Supported profiles are lightroom, darktable, immich, immich-readonly, snapseed, and generic-xmp. | `profiles`. |
| 5 | Unknown metadata returns exit 2. | `opaque-values`. |
| 10 | The report names its vocabulary but never prints its values. | `opaque-values`. |
| 13 | npm run build creates the release binary, package, and static site in dist/site/. | `build-output`. |
| 8 | npm run install:browser installs Chromium for browser checks. | `browser-install`. |
| 11 | The optional website license check runs on the landing page only. | `license-scope`. |
| 5 | It never receives photo metadata. | `license-scope`. |
| 6 | Read the privacy policy and terms. | `legal-routes`. |
| 13 | The command-line scan and JSON handoff reports are free under the MIT License. | `free-mit`. |

README headings **Sidecar Ledger**, **Install**, **Try the bundled sample**,
**Scan a folder**, **Develop and verify**, and **Privacy and license** make
sense in a heading list. The missing **Deploy** section is F-4-4. Shell
commands are instructions rather than prose sentences.

## Demo and sandbox verification

- Home → **Try it with sample data** opened `/demo/` in one click.
- The first demo screen already showed two photo files, one XMP metadata
  sidecar, five field results, an Attention verdict, and Lightroom → Immich.
- **Demo — sample data, nothing is saved**, **Reset demo**, and **Start for
  real** were present. Both controls measured 44 px high.
- With seeded real token, verdict, and sentinel keys, route changes and Reset
  preserved every value byte-for-byte. Reset restored Lightroom → Immich.
- The demo requested only the product origin. `/?demo=1` reached `/demo/`.
- After service-worker control, an offline reload returned the sample and a
  route change rendered darktable → Immich without console errors.
- The release CLI was invoked from
  `/tmp/sidecar-ledger-review4-demo.3DMVEC`. It left that working directory
  empty, created a distinct `/tmp/sidecar-ledger-demo-*` folder, wrote the JSON
  report, printed both paths, and exited 2. Its grammar/recording mismatch is
  F-4-3.

## Claims verification

All 20 exact `test` commands in `.factory/claims.json` passed from the clean
clone after `npm ci`. Each command selected exactly one tagged test and
reported one pass. No declared claim is untested. Landing and README claims
map to the manifest; the extra Terms sentence in F-4-2 does not.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `handoff-report` | PASS | Two images, one pair, portable and lossy results. |
| `read-only-local` | PASS | Copied fixture hashes matched before and after scan. |
| `cli-private` | PASS | Real scanner made no intercepted `connect` syscall. |
| `versioned-json` | PASS | Parsed output has `schema_version: "1"`. |
| `demo-cli-real` | PASS | Real demo created sample/report paths and exited 2. |
| `opaque-values` | PASS | Namespace named; secret canary absent. |
| `exit-codes` | PASS | Portable 0, review 2, invalid input 1. |
| `profiles` | PASS | Exact six-profile JSON list. |
| `demo-isolated` | PASS | Seeded real storage remained exact after Reset. |
| `demo-private` | PASS | Full browser demo flow stayed same-origin. |
| `offline-demo` | PASS | Offline reload remained interactive. |
| `license-scope` | PASS | One token-only Home request; none on demo/legal routes. |
| `paid-price` | PASS | Home and Terms both state $19 once. |
| `merchant-refund` | PASS | Revoked fixture changed unlocked Pro to locked. |
| `migration-steps` | PASS | Six selectors rendered six distinct four-step sets. |
| `legal-routes` | PASS | Privacy and Terms returned 200 with correct titles. |
| `free-mit` | PASS | MIT files and ungated CLI scan verified. |
| `build-output` | PASS | Release binary, crate, and static site exist. |
| `checkout-install` | PASS | Fresh-prefix `cargo install` produced the binary. |
| `browser-install` | PASS | Pinned Playwright Chromium install command succeeded. |

`npm run build`, `npm run test:a11y`, `npm run test:consumer`, `cargo fmt
--check`, and `cargo clippy --all-targets -- -D warnings` also passed in the
clean clone. The build produced `dist/site/`; home JS is 1.37 kB gzip.

## Structure, routing, accessibility, and identity

Home, Demo, Privacy, Terms, `/404/`, and an unknown URL were checked live.
Each has `lang=en`, one h1, main/header/footer landmarks, a description,
canonical, favicon, Apple touch icon, OG data, and all Twitter fields. Route
titles are correct. The unknown URL returns the designed ledger page with HTTP
404. Browser Back restored Home, focused `#hero-title`, and updated the live
announcement. The 12-link crawl found no dead link; checkout returned 303 to
Dodo and GitHub returned 200.

There were zero serious or critical Axe violations on all routes, no Home or
Demo console errors, no mobile overflow, and no demo control below 44 px.
Reduced-motion rules are present. F-4-1 is the remaining first-viewport layout
failure.

The ceramic archive still life, paired-tile mark, cold worktable palette,
mono/body type pairing, ledger rules, asymmetric shapes, and restrained motion
remain product-specific rather than a generic SaaS template.

## Earlier finding verification

Every earlier review, polish ledger, and handoff was read. Each prior finding
was checked against the live site and current source/tests.

| Earlier id | Current verification |
| --- | --- |
| F-1-1 | Fixed: the result-naming sample action is visible at both widths; F-4-1 concerns the separate desktop fact strip. |
| F-1-2 | Fixed: browser route, banner, reset/exit, CLI demo, sample, recording, and docs exist. |
| F-1-3 | Fixed: direct demo preserved seeded real storage and made no license request. |
| F-1-4 | Fixed: 20 manifest entries each selected one passing tagged test. |
| F-1-5 | Fixed: unknown URL returned the designed HTTP 404. |
| F-1-6 | Fixed: fixture inventory and field classification passed. |
| F-1-7 | Fixed: local scan and intercepted no-network tests passed. |
| F-1-8 | Fixed: copied input hashes remained exact. |
| F-1-9 | Fixed: JSON schema version is asserted. |
| F-1-10 | Fixed: full demo request trace stayed same-origin. |
| F-1-11 | Fixed: bundled demo ran the real scanner. |
| F-1-12 | Fixed: unsupported overwrite claim remains absent. |
| F-1-13 | Fixed: image and adjacent sidecar discovery passed. |
| F-1-14 | Fixed: hash and no-`connect` checks passed. |
| F-1-15 | Fixed: sample counts, state, report path, and exit 2 agree; F-4-3 is a new grammar/exact-recording defect. |
| F-1-16 | Fixed: representative portable/lossy assessment passed. |
| F-1-17 | Fixed: opaque canary remains absent from output. |
| F-1-18 | Fixed: MIT metadata and ungated scan passed. |
| F-1-19 | Fixed: exact $19 one-time price is tested. |
| F-1-20 | Fixed: checkout uses Sociobot and redirects to Dodo. |
| F-1-21 | Fixed: active-to-revoked Pro transition is observed. |
| F-1-22 | Fixed: six distinct paid route step sets render. |
| F-1-23 | Fixed: live and local offline demo stayed interactive. |
| F-1-24 | Fixed: untested retry promise remains absent. |
| F-1-25 | Fixed: README local/read-only wording is tested. |
| F-1-26 | Fixed: README inventory/classification wording is tested. |
| F-1-27 | Fixed: real scanner ran under connection interception. |
| F-1-28 | Fixed: source hashes remain unchanged; timestamp promise is absent. |
| F-1-29 | Fixed: dated registry claim remains absent. |
| F-1-30 | Fixed: untested PATH claim remains absent; checkout install is tested. |
| F-1-31 | Fixed: versioned machine-readable JSON passed. |
| F-1-32 | Fixed: all three exit codes passed. |
| F-1-33 | Fixed: stream-marketing claim remains absent. |
| F-1-34 | Fixed: `schema_version` proof passed. |
| F-1-35 | Fixed: exact six-profile list passed. |
| F-1-36 | Fixed: recognized fields and opaque-value safeguard passed. |
| F-1-37 | Fixed: unknown vocabulary exits 2 without its value. |
| F-1-38 | Fixed: broad test-suite marketing remains absent. |
| F-1-39 | Fixed: `npm test` passed as part of the clean build. |
| F-1-40 | Fixed: all documented build artifacts were produced. |
| F-1-41 | Fixed: browser install has its own passing claim. |
| F-1-42 | Fixed: syscall interception replaces dependency inference. |
| F-1-43 | Fixed: token-only request and non-Home isolation were observed. |
| F-1-44 | Fixed: Privacy and Terms direct routes passed. |
| F-1-45 | Fixed: repository/package MIT metadata passed. |
| F-1-46 | Fixed: hero audience sentence is 17 words. |
| F-1-47 | Fixed: README output copy is split and short. |
| F-1-48 | Fixed: README exit-code copy is split and short. |
| F-1-49 | Fixed: unknown-data copy is short. |
| F-1-50 | Fixed: browser-install sentence is eight words. |
| F-1-51 | Fixed: scan, handoff report, photo edit settings, and migration steps remain consistent. |
| F-1-52 | Fixed: h1 names photo metadata and the job. |
| F-1-53 | Fixed: scan/no-change h2 is concrete. |
| F-1-54 | Fixed: field-result h2 makes sense alone. |
| F-1-55 | Fixed: first technical uses are expanded. |
| F-1-56 | Fixed: sample action names its result. |
| F-1-57 | Fixed: action says Restore Pro access. |
| F-1-58 | Fixed: every route has complete social metadata and product art. |
| F-1-59 | Fixed: shared shell information appears on every route. |
| F-1-60 | Fixed: forward and Back focused/announced route h1s. |
| F-1-61 | Fixed: three-step and privacy/limits sections remain present. |
| F-1-62 | Fixed: sitemap includes Demo. |
| F-2-1 | Fixed: unlocked UI exposes all six distinct route recipes. |
| F-2-2 | Fixed: real CLI scan has no intercepted connection attempt. |
| F-2-3 | Fixed: revoked fixture visibly locks Pro. |
| F-2-4 | Fixed: fake-token request method, URL, body, and route scope are observed. |
| F-2-5 | Fixed: agreed terms and first-use expansions remain in source and live copy. |
| F-2-6 | Fixed: Demo/legal/404 Twitter fields and 404 `og:url` are present. |
| F-2-7 | Fixed: checkout and browser installation have passing claims. |
| F-2-8 | Fixed: every exact selector ran one test, not the whole file. |
| F-2-9 | Fixed: banner and wordmark targets are at least 44 px. |
| F-2-10 | Fixed: GitHub and checkout are labeled external/secure. |
| F-2-11 | Fixed for its audited phrases and terminology; this review supplies the required full current sentence list. |
| F-3-1 | Fixed: the first landing use is “JSON data-file report,” with a regression test. |

No earlier finding is reopened. F-4-1 through F-4-4 are new findings.

## Missed leverage

No missing AI feature is justified. The core job is deterministic local XMP
inventory and profile comparison; a model would weaken the private,
inspectable workflow. The brief's machine-readable export exists as the JSON
handoff report, and cloud sync is not implied by this local-first CLI.

## What would make this perfect

Fit the complete action explanation and all three facts into the desktop first
screen; remove or test the extra free-feature claim in Terms; make the real CLI
demo's singular count match its recording; and document deployment in the
README. Then rerun the complete cold-read, demo, claim, temp-directory CLI,
history, route, link, copy, and accessibility checks. PASS requires no
remaining finding.
