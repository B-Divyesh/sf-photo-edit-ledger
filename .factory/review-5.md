# Adversarial first-read review 5 — Sidecar Ledger

**Verdict: PASS**

Reviewed 2026-08-28 at `a3a67b3d55aef88e93a7cee502a0ca13a3814dde` against
<https://photo-edit-ledger.sociobot.in/>. This review used fresh Chromium
profiles at 390×844 and 1440×900, a separate clean clone at
`/tmp/photo-edit-ledger-review5.GJSDHa/repo`, and a separate CLI working
directory. No product code was changed.

There are zero findings. In particular, no declared claim failed or remained
untested, and no unlisted product claim was found on the landing page, README,
Privacy, or Terms pages.

## Cold first screen

Before scrolling, both fresh contexts gave the following answers.

- **What it does:** checks which photo metadata and photo edit settings survive
  when changing tools.
- **For whom:** photographers moving RAW files between tools.
- **What to click first:** **Try it with sample data**. The adjacent outcome is
  **“Opens a sample Lightroom → Immich report. Nothing is saved.”**

The exact h1 is **“Check photo metadata before switching tools”** and the
17-word audience sentence is **“For photographers moving RAW files between
tools, it shows which metadata and photo edit settings will survive.”** At
390×844, the action note and all three facts end at 830 px. At 1440×900, the
action note ends at 699 px and all three facts end at 785 px. The cold-read
requirement passes at both sizes.

## Copy audit

Counts are visible word tokens; arrows and separators are not words. Commands,
select options, and repeated wordmarks are labels rather than prose sentences.
No item exceeds 22 words, uses a banned marketing adjective, changes a core
term, or is a button with an ambiguous result. The current terminology is
**scan**, **handoff report**, **photo edit settings**, **migration steps**,
**XMP metadata sidecar file**, **JSON data-file report**, and **command-line
program**.

### Landing page

| Words | Text | Result |
| ---: | --- | --- |
| 2 | Sidecar Ledger | Wordmark. |
| 1 each | Demo; Install; Privacy; Terms | Navigation links. |
| 4 | Local photo metadata scan | Clear eyebrow. |
| 6 | Check photo metadata before switching tools | Job-specific h1. |
| 17 | For photographers moving RAW files between tools, it shows which metadata and photo edit settings will survive. | Clear audience and result. |
| 5 | Try it with sample data | Result-naming action. |
| 6; 3 | Opens a sample Lightroom → Immich report. Nothing is saved. | Clear outcome and isolation. |
| 4; 3; 6 | Runs on your computer; Sample works offline; Core scan free · Pro $19 once | Tested facts. |
| 17 | Two ceramic archive plates representing a photograph and its metadata sidecar, joined by a thin registration line. | Useful image alt. |
| 7 | A photo and sidecar, checked together. | Clear caption. |
| 3; 7 | How it works; Scan a folder, then keep the report | Clear headings. |
| 3; 9 | Scan a folder; Read image filenames and nearby XMP metadata sidecar files. | XMP expanded first use. |
| 3; 6 | Review each field; See portable, lossy, or unknown results. | Clear step. |
| 3; 12 | Save the report; Keep the JSON data-file report with the archive before you move it. | JSON expanded first use. |
| 4 | One command-line program · v0.1.0 | Clear product label. |
| 8 | Scan filenames and sidecar files without changing them | Concrete heading. |
| 10; 6 | Sidecar Ledger reads image filenames and nearby XMP metadata sidecar files. It does not change source files. | `handoff-report`, `read-only-local`. |
| 2; 8 | local shell; Exit 0: portable · 2: review · 1: input error | Clear status legend. |
| 2; 5 | Bundled sample; Watch the real sample scan | Clear recording heading. |
| 5; 18 | Terminal recording of sidecar-ledger demo. It scans two images and one sidecar, writes a temporary JSON handoff report, and exits 2 for review. | `demo-cli-real`. |
| 14 | sidecar-ledger demo copies the sample to a temporary folder and prints its report path. | `demo-cli-real`. |
| 2; 7 | Field results; Read one result for every metadata field | Clear heading. |
| 1; 10 | Portable; The destination has a declared way to keep the field. | Defined result. |
| 1; 8 | Lossy; Keep a backup or render before the move. | Defined result. |
| 1; 8 | Unknown; Test one representative photo before the full move. | Defined result. |
| 5; 11 | Unknown edit data stays private. The report names the data vocabulary but never displays its contents. | `opaque-values`. |
| 3; 8 | Privacy and limits; Keep your originals and test a small copy | Clear heading. |
| 9; 14 | The command-line program does not edit photos or upload metadata. It reports declared support, not a promise that every app version behaves the same. | Tested claim and explicit limit. |
| 8 | Read the privacy policy and terms of use. | Legal routes work. |
| 4; 4 | Optional Pro migration steps; Keep the scan free. Buy migration steps once. | Clear paid-tier heading. |
| 15; 10 | The command-line program, field results, and JSON data-file report stay free under the MIT License. An optional $19 one-time purchase adds browser migration steps. | `free-mit`, `paid-price`, `migration-steps`. |
| 6; 4; 7 | Sociobot/Dodo is the merchant of record. Refunds revoke Pro access. Privacy and terms explain the optional license. | `merchant-refund`, `legal-routes`. |
| 4 | Six route-specific migration steps | Tested paid output. |
| 7 | Buy Pro · $19 once — opens secure checkout | Result-naming external action. |
| 2; 3; 2; 2 | Already purchased? Restore Pro access; License token; Verify license | Clear license control labels. |
| 3; 4; 5 | Your migration steps; Choose a migration route; Remove license from this browser | Clear unlocked controls. |
| 6; 5 | Check photo metadata before switching tools. Built by Param Factory · v0.1.0 | Consistent footer. |

Conditional landing UI is also fully audited below. Each item is below the
22-word cap and uses the same terms as the landing page.

```text
 6 License verified within the last day.
 6 Offline — using the last verified license.
 6 Connect once to verify this license.
 2 Checking license…
 2 License active.
 4 License no longer active.
 8 Check the token or purchase a new license.
 5 Could not reach license verification.
 5 Your free tools still work.
 5 Could not verify right now.
 7 Check your connection and try again.
 5 Checking license in the background…
 5 License removed from this browser.
 9 Write metadata to an XMP metadata sidecar in Lightroom.
 8 Back up the catalog and original photos together.
 9 Import a 20-photo sample, then compare ratings and captions.
 7 Export finished master renders for virtual-copy variants.
 8 Render a TIFF for visual edits before transfer.
10 Do not expect Camera Raw photo edit settings in Snapseed.
 7 Keep the original DNG and XMP metadata sidecar together.
 5 Write darktable sidecars before copying.
 6 Keep .xmp files with matching filenames.
 7 Render critical history stacks for visual parity.
 7 Run a new scan after the transfer.
 6 Keep darktable sidecars with each original.
 6 Test one album in Snapseed.
 7 Keep the source archive as the edit record.
 6 Export a representative folder with sidecars.
 7 Keep the Immich library intact until review.
 5 Import the sample into Lightroom.
 5 Compare captions, keywords, and ratings.
 7 Copy originals and XMP metadata sidecars together.
 7 Archive the JSON data file handoff report.
 4 Test one destination album.
 6 Keep rendered copies for critical edits.
```

### README

| Words | Text | Result |
| ---: | --- | --- |
| 9 | Sidecar Ledger checks photo metadata before you switch tools. | Clear job. |
| 10; 11 | It scans a folder and its XMP metadata sidecar files. The handoff report marks each field as portable, lossy, or unknown. | `handoff-report`. |
| 11; 7 | The command-line scan runs locally and does not change source files. It does not upload photos or metadata. | `read-only-local`, `cli-private`. |
| 12 | To install from a local checkout, use a current stable Rust toolchain. | `checkout-install`. |
| 11; 17; 7 | Run the shipped Lightroom to Immich sample in a temporary folder. The command copies the sample, runs the real scanner, and prints the JSON data-file handoff report path. Exit 2 means the sample needs review. | `demo-cli-real`, `exit-codes`. |
| 11 | Open the isolated browser sample at https://photo-edit-ledger.sociobot.in/demo/ or https://photo-edit-ledger.sociobot.in/?demo=1. | Direct demo instruction. |
| 4; 7; 9 | Exit 0 means portable. Exit 2 means review losses or unknowns. Exit 1 means the input could not be scanned. | `exit-codes`. |
| 10 | Supported profiles are lightroom, darktable, immich, immich-readonly, snapseed, and generic-xmp. | `profiles`. |
| 5; 10 | Unknown metadata returns exit 2. The report names its vocabulary but never prints its values. | `opaque-values`. |
| 13; 8 | npm run build creates the release binary, package, and static site in dist/site/. npm run install:browser installs Chromium for browser checks. | `build-output`, `browser-install`. |
| 6; 6; 6; 8 | Run npm run build before release. Publish dist/site/ as the static site. Use target/package/sidecar-ledger-0.1.0.crate for the command-line release. The Param Factory handles deployment infrastructure, DNS, and billing. | Clear deployment guidance. |
| 11; 5 | The optional website license check runs on the landing page only. It never receives photo metadata. | `license-scope`. |
| 6 | Read the privacy policy and terms. | `legal-routes`. |
| 13 | The command-line scan and JSON handoff reports are free under the MIT License. | `free-mit`. |

README headings — **Install**, **Try the bundled sample**, **Scan a folder**,
**Develop and verify**, **Deploy**, and **Privacy and license** — make sense
when read alone. No copy finding is required.

## Demo and sandbox verification

Home → **Try it with sample data** opened `/demo/` in one click. The first
screen already presented the product in use: Lightroom → Immich, two photo
files, one XMP metadata sidecar file, field results, an Attention verdict, and
the bundled CLI command.

The persistent banner was **“Demo — sample data, nothing is saved”** with
**Reset demo** and **Start for real**. After selecting darktable, Reset restored
Lightroom → Immich. A fresh context pre-seeded with real license, cached
verdict, and sentinel values retained all three byte-for-byte after entry,
route change, and Reset; demo wrote no `demo:` key because its state is
in-memory. Direct `?demo=1` enters `/demo/`.

Network interception recorded only the product origin throughout the demo.
The one Sociobot request occurred on Home before clicking Demo, from the
deliberately seeded real license; no license request occurred after the
`/demo/` navigation. After service-worker control, offline reload still showed
the sample and changed the route to Lightroom → Snapseed without a console
error.

The clean-clone release binary also ran `sidecar-ledger demo` from a separate
temporary working directory. It created a distinct `/tmp/sidecar-ledger-demo-*`
directory, copied the shipped sample, printed its report path, wrote
`lightroom-to-immich.json`, and returned exit 2. The self-hosted terminal
recording contains that exact real inventory line.

## Claims and quality gates

All 20 exact commands in `.factory/claims.json` passed individually after
`npm ci` in the clean clone. Each selected exactly one tagged test.

| Claim | Result |
| --- | --- |
| handoff-report; read-only-local; cli-private; versioned-json | PASS |
| demo-cli-real; opaque-values; exit-codes; profiles | PASS |
| demo-isolated; demo-private; offline-demo; license-scope | PASS |
| paid-price; merchant-refund; migration-steps; legal-routes | PASS |
| free-mit; build-output; checkout-install; browser-install | PASS |

`npm test`, `npm run test:a11y`, and `npm run test:consumer` also passed from
that clone. The build created the release binary, `.crate`, and `dist/site/`.
The accessibility run reported zero serious or critical Axe issues, and the
production JS entry is 1.37 kB gzip. The recorded claim tests cover real
scanner no-connect interception, source hash preservation, demo storage
isolation, full-demo request interception, offline interaction, token-only
license verification, paid entitlement revocation, and all six paid routes.

The landing, README, Privacy, and Terms claims all map to a manifest entry.
Legal caveats such as testing a copy before deleting an archive are guidance,
not untestable performance promises. No unlisted claim is found.

## Structure, accessibility, links, and identity

Live Home, Demo, Privacy, Terms, `/404/`, and a deliberately unknown URL were
checked. Each normal route has `lang=en`, one h1, a main landmark, a concise
description, canonical, Open Graph/Twitter data, favicon, Apple touch icon,
skip link, and the shared header/footer. The unknown URL returned the designed
ledger 404 with HTTP 404 and **Return home**. No normal route recorded a
console error.

The header-to-Privacy navigation moved focus to the Privacy h1 and announced
**“Privacy — Sidecar Ledger”**. Browser Back restored the Home h1 focus and
announcement. The internal route/link crawl returned 200 for every product
link; GitHub returned 200 and the labelled checkout link returned the expected
303 to Dodo. The temporary unknown URL discovered during the 404 test is not a
site link and is excluded from the dead-link result.

The live 390 px layout had no overflow and all demo/banner/wordmark targets
met the 44 px rule. The ceramic archive artwork, cold worktable palette,
asymmetric ceramic tiles, ledger rules, self-hosted mono/body pairing, and
reduced-motion state changes match `.factory/design.md` and do not resemble a
generic SaaS template.

## Earlier finding verification

All earlier reviews, polish ledgers, and the prior handoff were read. Each
historical finding was rechecked in current source/tests and on the deployed
site.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | The explicit sample action and outcome are visible on both first screens. |
| F-1-2 | Real `/demo/`, banner, Reset/exit, shipped sample, recording, CLI demo, and docs exist. |
| F-1-3 | Demo does not read or write seeded real storage and has no license path. |
| F-1-4 | The 20-entry manifest has one individually selectable tagged test per claim. |
| F-1-5 | Unknown URLs return the designed 404 with HTTP 404. |
| F-1-6 | Shipped fixture proves inventory and field classification. |
| F-1-7 | Local scanner behavior is exercised. |
| F-1-8 | Source hashes remain unchanged across a real scan. |
| F-1-9 | JSON `schema_version: "1"` is asserted. |
| F-1-10 | Full browser-demo trace is same-origin. |
| F-1-11 | Bundled CLI demo invokes the real scanner. |
| F-1-12 | Unsupported overwrite warning remains absent. |
| F-1-13 | Fixture verifies image and adjacent XMP discovery. |
| F-1-14 | Hash and no-connect checks replace the broad old assertion. |
| F-1-15 | Sample counts, output path, exit 2, and recording agree exactly. |
| F-1-16 | Portable/lossy profile evidence is exercised. |
| F-1-17 | Opaque canary values remain absent from report output. |
| F-1-18 | MIT and ungated CLI/report behavior is asserted. |
| F-1-19 | Exact $19 once price is checked. |
| F-1-20 | Checkout uses Sociobot and redirects to Dodo. |
| F-1-21 | Active-to-revoked entitlement visibly locks Pro. |
| F-1-22 | All six distinct paid route step sets render. |
| F-1-23 | Offline demo reload remains interactive. |
| F-1-24 | Untested retry wording remains absent. |
| F-1-25 | README local/read-only wording maps to the scan test. |
| F-1-26 | README inventory/report behavior maps to the fixture test. |
| F-1-27 | Real scanner no-connect proof covers no-upload behavior. |
| F-1-28 | No-mutation hash proof remains; timestamp promise remains absent. |
| F-1-29 | Dated crates.io availability wording remains absent. |
| F-1-30 | Untested prebuilt-PATH wording is absent; checkout install is tested. |
| F-1-31 | Versioned machine-readable output is asserted. |
| F-1-32 | Observable exit 0/2/1 matrix passes. |
| F-1-33 | Unsupported stream-marketing wording remains absent. |
| F-1-34 | Versioned JSON field is asserted. |
| F-1-35 | Exact six-profile list is asserted. |
| F-1-36 | Recognized fields and opaque-value protection are tested. |
| F-1-37 | Unknown vocabulary returns 2 without revealing its value. |
| F-1-38 | Broad untestable test-suite marketing remains absent. |
| F-1-39 | Contributor `npm test` command passes in the clean clone. |
| F-1-40 | Documented build artifacts are created. |
| F-1-41 | Browser installation has its own claim/test. |
| F-1-42 | Real no-network evidence replaces dependency inference. |
| F-1-43 | Token-only request and non-Home isolation are observed. |
| F-1-44 | Privacy and Terms are direct working routes. |
| F-1-45 | Repository and package license are MIT. |
| F-1-46 | Hero audience sentence is 17 words. |
| F-1-47 | README output sentence is split and short. |
| F-1-48 | README exit-code wording is split and short. |
| F-1-49 | README unknown-data wording is short. |
| F-1-50 | Browser-install wording is eight words. |
| F-1-51 | Core terms are consistent. |
| F-1-52 | H1 names the photo-metadata job. |
| F-1-53 | Scan/no-change heading is concrete. |
| F-1-54 | Field-result heading works out of context. |
| F-1-55 | Technical first uses are expanded. |
| F-1-56 | Sample action names its result. |
| F-1-57 | License control says Restore Pro access. |
| F-1-58 | Every route has complete social/product metadata. |
| F-1-59 | Shared shell, legal links, factory identity, and version appear on every route. |
| F-1-60 | Forward and Back focus and announce the h1. |
| F-1-61 | Three-step and privacy/limits landing sections remain present. |
| F-1-62 | Sitemap lists `/demo/`. |
| F-2-1 | Unlocked Pro selector renders six distinct route-specific step sets. |
| F-2-2 | Real scanner runs beneath a no-connect interceptor. |
| F-2-3 | Revoked fixture visibly removes paid content. |
| F-2-4 | Intercepted fake-token request proves method, URL, payload, and route scope. |
| F-2-5 | Plain terms and technical first-use expansions remain in live copy. |
| F-2-6 | Demo/legal/404 have complete Twitter data and 404 has `og:url`. |
| F-2-7 | Checkout install and browser install claims each pass. |
| F-2-8 | Every manifest selector runs one matching test. |
| F-2-9 | Demo banner and wordmarks meet the 44 px target rule. |
| F-2-10 | GitHub and checkout departures are labelled external/secure. |
| F-2-11 | Complete copy audit and terminology regression coverage exist. |
| F-3-1 | First landing JSON use is JSON data-file report. |
| F-4-1 | All first-screen facts fit at 1440×900. |
| F-4-2 | Terms uses the exact tested free scope. |
| F-4-3 | CLI singular grammar and recording output agree. |
| F-4-4 | README documents build outputs and factory deployment scope. |

No historical finding is reopened.

## Missed leverage

No missing AI feature is found. The brief calls for deterministic local XMP
inventory and profile comparison. An AI interpretation layer would make the
result less inspectable and would conflict with the local-first privacy model.
The implied machine-readable export exists as the JSON handoff report; cloud
sync is not implied by this CLI job.

## What would make this perfect

Keep the current standard: retain the one-click isolated sample, keep every
visitor-facing claim tied to an observable test, and rerun this complete
cold-read, demo, CLI, offline, claim, route, link, and accessibility review
whenever copy or behavior changes. No concrete product change is currently
required.
