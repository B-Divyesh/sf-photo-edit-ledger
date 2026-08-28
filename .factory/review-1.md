# Adversarial first-read review 1 — Sidecar Ledger

**Verdict: FAIL**

Reviewed 2026-08-28 at commit `d25298b05bfc846399414755852bebd311d617c2`
against `https://photo-edit-ledger.sociobot.in/`, in fresh Chromium contexts at
390×844 and 1440×900. General tests pass, but blocking demo, claims, and routing
requirements do not.

## Cold first screen

- **What:** inventories a photo folder and XMP sidecars, then predicts which
  metadata and edits survive a move between named tools.
- **For whom:** photographers moving RAW archives among Lightroom, darktable,
  Immich, or Snapseed.
- **What to click:** unclear. The prominent action is **“Install the CLI”**;
  nearby actions are **“Test a route”** and **“Try a route.”** None says sample
  data opens or what appears next.

The first two answers require the 29-word sentence “Before you move a RAW
archive between Lightroom, darktable, Immich, or Snapseed, inventory its XMP
sidecars and get an honest contract for every rating, description, keyword,
and edit recipe.” The third answer is unavailable. This is blocking.

## Blocking findings

### F-1-1 — No clear one-click sample action

The first screen says “Install the CLI,” “Test a route,” and “Try a route.” A
phone visitor cannot identify a safe first step. Make the primary action **Try
it with sample data** and add **Opens a sample Lightroom → Immich report.
Nothing is saved.** Keep installation secondary.

### F-1-2 — The CLI has no compliant demo

`/demo` returns the normal home page and home title. The inline `#demo` has no
demo banner, **Reset demo**, or **Start for real**. In a fresh temporary
directory, `sidecar-ledger demo` exits 1 with “unrecognized subcommand
'demo'.” “Read the recorded sample scan” is static copy, not a recording.

Ship realistic `examples/`, add `sidecar-ledger demo` that copies them to a
temporary directory, runs the real scanner, and prints the output path. Add a
self-hosted recording, a real `/demo`, required controls, `.factory/demo.md`,
and README instructions.

### F-1-3 — The displayed demo is not isolated from real browser state

The demo and license UI share the landing page and normal
`sb_license:photo-edit-ledger*` storage. With a fake seeded token and verdict
`{valid:false,checkedAt:1}`, opening the page and using the demo caused one
Sociobot request and rewrote that real verdict timestamp. A separate sentinel
and route selection remained unchanged, but there is no demo namespace or
lifecycle. Implement `/demo` with only `demo:` or in-memory state, suppress
license reads there, discard demo state on exit/reset, and test that seeded
real storage and outbound requests remain unchanged.

### F-1-4 — No claim manifest or tagged claim tests

`.factory/claims.json` is absent from a clean clone. `rg '@claim:'` finds no
tests. Thus no listed command exists and every public claim below is unlisted.
Add the manifest, give each retained claim exactly one tagged sandbox test, and
remove claims that cannot be tested.

### F-1-5 — Unknown URLs masquerade as valid pages

`/not-a-real-route` returns HTTP 200 with the home title and h1 because every
unknown navigation rewrites to `index.html`. Add a designed ceramic-style 404,
return status 404, provide **Return home**, and add a direct-request test.

## Major findings: unlisted claims

Each row is a distinct finding. Manual or general-suite evidence does not
replace the required manifest entry and one observable sandbox test.

| ID | Exact public claim | Required fix |
| --- | --- | --- |
| F-1-6 | Hero: “Before you move a RAW archive between Lightroom, darktable, Immich, or Snapseed, inventory its XMP sidecars and get an honest contract for every rating, description, keyword, and edit recipe.” | Test fixture inventory and field report; say “handoff report.” |
| F-1-7 | Hero: “Runs locally” | Test process/network behavior. |
| F-1-8 | Hero: “Read-only scans” | Hash all sample inputs before/after. |
| F-1-9 | Hero: “Versioned JSON” | Assert valid JSON and schema version. |
| F-1-10 | Demo: “capability declarations only—no files leave your device.” | Intercept the full fixed demo flow. |
| F-1-11 | Demo: “The CLI performs the real folder inventory.” | Test the shipped demo's exact inventory. |
| F-1-12 | Route note: “Read-only extraction can overwrite catalog changes.” | Add reproducible profile evidence or soften it to advice. |
| F-1-13 | Install: “Sidecar Ledger reads filenames and adjacent XMP.” | Test image/sidecar discovery. |
| F-1-14 | Install: “It never decodes image pixels, calls a network, or changes source timestamps.” | Split and test reads, network, hashes, and timestamps. |
| F-1-15 | Recorded sample: “Fixture: 2 images · 1 paired sidecar · Lightroom → Immich”; “Portable — rating, description, keywords”; “Unknown — color label”; “Lossy — Camera Raw adjustments”; “Exit 2…” | Assert every displayed count, state, and exit code. |
| F-1-16 | “The destination has a declared mapping… and the source can represent it.” | Test representative mapping semantics. |
| F-1-17 | “Proprietary develop recipes are named by namespace, never reverse-engineered or printed with their values.” | Use an opaque canary and assert it never appears. |
| F-1-18 | “The CLI, every risk verdict, and JSON export remain free under MIT.” | Test no-license access and license metadata. |
| F-1-19 | “A $19 one-time purchase unlocks curated migration recipes…” | Stub billing and assert price/entitlement. |
| F-1-20 | “Sociobot/Dodo is the merchant of record.” | Verify the approved checkout redirect. |
| F-1-21 | “Refunds… revoke the license automatically.” | Test a refunded entitlement or remove this promise. |
| F-1-22 | “Six practical route recipes” | Test six named distinct recipes; source has three specific arrays plus a generic fallback. |
| F-1-23 | Offline bar: “The demo still works” | Register the existing offline scenario as a claim. |
| F-1-24 | Offline bar: “license checks will retry later.” | Observe offline→online retry or remove the clause. |
| F-1-25 | README: “Sidecar Ledger is a local, read-only preflight for photographers moving RAW or DNG files between editors and self-hosted libraries.” | Map to network and mutation tests. |
| F-1-26 | README: “It inventories a folder and its XMP sidecars, compares declared tool capabilities, and produces a handoff contract: what is portable, what is lossy, and what remains unknown.” | Test inventory and classification end to end. |
| F-1-27 | README: “It does not edit photographs, translate proprietary adjustment recipes, or upload any image or metadata.” | Split and test writes, output, and network. |
| F-1-28 | README: “Scans do not change source files or timestamps.” | Register hash and timestamp assertions. |
| F-1-29 | README: “The crate is not yet published on crates.io.” | Check registry state or use dated wording. |
| F-1-30 | README: “Prebuilt release artifacts can be placed anywhere on your PATH…” | Test a released binary on PATH or remove. |
| F-1-31 | README: “Produce stable JSON…” | Assert parsing and compatibility. |
| F-1-32 | README: “Exit codes are `0` for a fully portable scan, `2` when losses or unknowns need attention, and `1` for invalid input or an unreadable scan.” | Register an exit-code matrix. |
| F-1-33 | README: “Human reports go to stdout, diagnostics to stderr.” | Test both streams. |
| F-1-34 | README: “JSON output has a versioned `schema_version`.” | Assert field and compatibility. |
| F-1-35 | README: “Supported built-in profiles are `lightroom`, `darktable`, `immich`, `immich-readonly`, `snapseed`, and `generic-xmp`.” | Compare `tools --json` to the list. |
| F-1-36 | README: “Sidecar Ledger recognizes XMP ratings, descriptions, labels, keywords, and tool-specific adjustment namespaces while keeping opaque adjustment values out of the report.” | Split into recognition and canary-secrecy tests. |
| F-1-37 | README: “Any unrecognized metadata namespace is reported as `unknown` and returns exit 2; the report names the vocabulary but never prints its opaque values.” | Register the existing regression as this claim. |
| F-1-38 | README: “The test suite runs this documented route and verifies inventory counts, classifications, JSON compatibility, errors, and the no-mutation guarantee.” | Name exact tests/assertions or remove. |
| F-1-39 | README: “`npm test` runs Rust tests plus browser-site tests.” | Add a build-contract check or keep in contributor docs only. |
| F-1-40 | README: “`npm run build` produces the release binary, packages the crate, and builds the static site into `dist/site/` (with `index.html` at that root).” | Assert all named outputs from a clean clone. |
| F-1-41 | README: “`npm run install:browser` explicitly downloads the Chromium binary used by the accessibility and offline-PWA check, so that check works from a clean clone.” | Register and run that clean-clone claim. |
| F-1-42 | README: “The CLI is local-only and has no telemetry, network client, or write path to the scanned archive.” | Test dependencies/network and filesystem mutation. |
| F-1-43 | README: “The optional website license check is isolated to the landing page and never receives photo metadata.” | Intercept calls and assert route scope/payload. |
| F-1-44 | README: “Details live at `/privacy` and `/terms` on the website.” | Test status, titles, and links. |
| F-1-45 | README: “Released under the MIT License.” | Assert repository and package licenses. |

## Copy and structure findings

### F-1-46 — Hero sentence exceeds 22 words

The 29-word hero sentence mixes audience, four tools, input, action, output,
and five fields. Rewrite: **For photographers moving RAW files between tools,
it shows which metadata and edits will survive.**

### F-1-47 — README core-output sentence exceeds 22 words

The 27-word “It inventories a folder…” sentence should be: **It inventories a
folder and its XMP sidecars. The report marks each field as portable, lossy, or
unknown.**

### F-1-48 — README exit-code sentence exceeds 22 words

The 25-word sentence should be: **Exit 0 means portable. Exit 2 means review
losses or unknowns. Exit 1 means the input could not be scanned.**

### F-1-49 — README namespace sentence exceeds 22 words

The 23-word sentence should be: **Unknown metadata returns exit 2. The report
names its vocabulary but never prints its values.**

### F-1-50 — README browser sentence exceeds 22 words

The 23-word sentence should be: **`npm run install:browser` downloads Chromium.
Run it before the accessibility and offline checks in a clean clone.**

### F-1-51 — Core terms change names

“Metadata preflight,” “handoff,” “honest contract,” “route preflight,”
“boundary,” and “report” overlap. “Edit recipe,” “Edit adjustments,” and
“develop recipes” overlap, while paid instructions are also “migration
recipes,” “field notes,” and a “route pack.” Use **scan**, **handoff report**,
**photo edit settings**, and **migration steps** consistently.

### F-1-52 — The h1 does not name the job out of context

“Know what survives the handoff” hides photos and metadata. Use **Check photo
metadata before switching tools**.

### F-1-53 — Vague marketing heading

“A preflight small enough to trust” neither establishes size nor trust. Use
**Scan filenames and XMP without changing them**.

### F-1-54 — Contextless heading

“Evidence, not false translation” does not name the evidence. Use **Read one
result for every metadata field**.

### F-1-55 — Unexplained specialist language

“Opaque,” “develop recipes,” “namespace,” “capability declarations,” and
“catalog authoritative” are unexplained. For example, replace the opaque note
with **The report names unknown edit data but never displays its contents.**

### F-1-56 — Trial actions do not name the result

“Try a route” and “Test a route” use internal terminology. Use **Open a sample
handoff report** (after adding the required primary wording from F-1-1).

### F-1-57 — License button uses an ambiguous pronoun

The single button “Have a license? Restore it” should be **Restore Pro access**,
with “Already purchased?” as nearby text.

### F-1-58 — Route metadata is incomplete

Home, Privacy, and Terms have descriptions and an SVG favicon, but no canonical,
Open Graph, Twitter card, 1200×630 product image declaration, apple-touch icon,
or route tests for them. Add all route-specific metadata.

### F-1-59 — Header/footer shell changes by route

Home header is “Try a route / Install / Pro”; legal headers differ. Legal
footers omit the home one-liner and Source. All footers omit “Built by Param
Factory” and version/build id. Use one shared shell.

### F-1-60 — Route changes do not focus or announce the h1

After navigating to Privacy and after browser Back,
`document.activeElement` was `BODY`; no route live region exists. Focus the new
h1, announce it, and test forward/back behavior.

### F-1-61 — Required landing sections are missing

There is no three-step “How it works” sequence and no clear “What it does not
do / privacy” section. Add **Scan a folder / Review each field / Save the
report**, followed by concise limitations/privacy.

### F-1-62 — Sitemap omits the promised real demo

The sitemap lists only home, privacy, and terms. Add the real `/demo`; configure
and test the 404 without listing it as normal content.

## Copy audit

Counts are whitespace-delimited after Markdown punctuation. Repeated wordmarks
are counted once. Options and source commands are labels, not sentences.

### Landing page (every visible sentence, heading, and action)

```text
 2 Sidecar Ledger (header/footer)
 3 Try a route [F-1-1,F-1-56]       1 Install       1 Pro
 3 Local metadata preflight [F-1-51]
 5 Know what survives the handoff. [F-1-52]
29 Before you move a RAW archive between Lightroom, darktable, Immich, or Snapseed, inventory its XMP sidecars and get an honest contract for every rating, description, keyword, and edit recipe. [F-1-6,F-1-46,F-1-51]
 3 Install the CLI                    3 Test a route [F-1-1,F-1-56]
 2 Runs locally [F-1-7]              2 Read-only scans [F-1-8]
 2 Versioned JSON [F-1-9]
 2 One image.  2 One sidecar.  3 One checked boundary. [F-1-51]
 2 Route preflight [F-1-51]
 8 Inspect the boundary before the archive crosses it. [F-1-51]
12 This browser demo uses capability declarations only—no files leave your device. [F-1-10,F-1-55]
 7 The CLI performs the real folder inventory. [F-1-11]
 2 Current tool      1 Destination      5 Sample XMP · capability set 2026.08 [F-1-4]
 3 Lightroom → Immich (read-only)
 2 Rating — Lossy   2 Description — Lossy   2 Keywords — Lossy
 3 Color label — Lossy   3 Edit adjustments — Lossy [F-1-51]
 6 Read-only extraction can overwrite catalog changes. [F-1-12]
 9 Keep the editor catalog authoritative and preserve every sidecar. [F-1-55]
 6 Run this route on your folder [F-1-51]      2 Copy command
 3 Single binary · v0.1.0 [F-1-4]
 6 A preflight small enough to trust. [F-1-53]
 7 Sidecar Ledger reads filenames and adjacent XMP. [F-1-13]
12 It never decodes image pixels, calls a network, or changes source timestamps. [F-1-14]
 5 Read the recorded sample scan [F-1-2]
 8 Fixture: 2 images · 1 paired sidecar · Lightroom → Immich [F-1-15]
 4 Portable — rating, description, keywords [F-1-15]
 3 Unknown — color label [F-1-15]    4 Lossy — Camera Raw adjustments [F-1-15]
12 Exit 2: review the missing sidecar and render critical edits before moving. [F-1-15]
 4 What the report promises [F-1-51]
 4 Evidence, not false translation. [F-1-54]
 1 Portable
15 The destination has a declared mapping for the field and the source can represent it. [F-1-16,F-1-55]
 1 Lossy
 9 The boundary drops or cannot durably write the field. [F-1-51]
 8 You get a concrete backup or render recommendation. [F-1-4]
 1 Unknown      5 No trustworthy mapping is declared. [F-1-4]
10 Sidecar Ledger says so and asks for a representative test. [F-1-4]
 3 Opaque stays opaque. [F-1-55]
14 Proprietary develop recipes are named by namespace, never reverse-engineered or printed with their values. [F-1-17,F-1-55]
 4 Optional Pro route pack [F-1-51]
 5 Keep the safety tool open. [F-1-51]   5 Buy the field notes once. [F-1-51]
12 The CLI, every risk verdict, and JSON export remain free under MIT. [F-1-18]
19 A $19 one-time purchase unlocks curated migration recipes: route-specific backup sequences, validation checklists, and post-import checks in this browser. [F-1-19,F-1-51]
 7 Sociobot/Dodo is the merchant of record. [F-1-20]
 9 Refunds are handled there and revoke the license automatically. [F-1-21]
 4 See privacy and terms.      4 Six practical route recipes [F-1-22,F-1-51]
 2 Lightroom → Immich   2 Lightroom → Snapseed   2 darktable → Immich
 4 Buy Pro · $19 once [F-1-19]
 3 Have a license? [F-1-57]   2 Restore it [F-1-57]
 2 License token   2 Verify license   4 Your migration field notes [F-1-51]
 5 Remove license from this browser
 6 Local proof before a photo handoff. [F-1-51]
 1 Privacy   1 Terms   1 Source
```

Conditional copy: “You’re offline. The demo still works; license checks will
retry later.” is 11 words and is flagged by F-1-23/F-1-24.

### README (every prose sentence)

```text
19 Sidecar Ledger is a local, read-only preflight for photographers moving RAW or DNG files between editors and self-hosted libraries. [F-1-25,F-1-51]
27 It inventories a folder and its XMP sidecars, compares declared tool capabilities, and produces a handoff contract: what is portable, what is lossy, and what remains unknown. [F-1-26,F-1-47,F-1-51]
15 It does not edit photographs, translate proprietary adjustment recipes, or upload any image or metadata. [F-1-27]
 8 Scans do not change source files or timestamps. [F-1-28]
 8 The crate is not yet published on crates.io. [F-1-29]
11 Install the current public source with a current stable Rust toolchain:
 7 For a checkout you already have locally:
15 Prebuilt release artifacts can be placed anywhere on your PATH when the factory publishes them. [F-1-30]
18 The crate starts at 0.1.0; registry publishing is intentionally left to the factory after cargo package --locked review. [F-1-4]
 9 Preflight a Lightroom handoff into a writable Immich library: [F-1-51]
11 Produce stable JSON for a script or archive the report explicitly: [F-1-31]
 6 List the built-in, versioned capability declarations: [F-1-35,F-1-55]
25 Exit codes are 0 for a fully portable scan, 2 when losses or unknowns need attention, and 1 for invalid input or an unreadable scan. [F-1-32,F-1-48]
 8 Human reports go to stdout, diagnostics to stderr. [F-1-33]
 7 JSON output has a versioned schema_version. [F-1-34]
11 Supported built-in profiles are lightroom, darktable, immich, immich-readonly, snapseed, and generic-xmp. [F-1-35]
21 Sidecar Ledger recognizes XMP ratings, descriptions, labels, keywords, and tool-specific adjustment namespaces while keeping opaque adjustment values out of the report. [F-1-36,F-1-55]
23 Any unrecognized metadata namespace is reported as unknown and returns exit 2; the report names the vocabulary but never prints its opaque values. [F-1-37,F-1-49,F-1-55]
10 The fixture under tests/fixtures/catalog documents the public behavior: [F-1-38]
19 The test suite runs this documented route and verifies inventory counts, classifications, JSON compatibility, errors, and the no-mutation guarantee. [F-1-38]
 8 npm test runs Rust tests plus browser-site tests. [F-1-39]
22 npm run build produces the release binary, packages the crate, and builds the static site into dist/site/ (with index.html at that root). [F-1-40]
 7 Use npm run dev for the site.
23 npm run install:browser explicitly downloads the Chromium binary used by the accessibility and offline-PWA check, so that check works from a clean clone. [F-1-41,F-1-50]
17 The CLI is local-only and has no telemetry, network client, or write path to the scanned archive. [F-1-42]
16 The optional website license check is isolated to the landing page and never receives photo metadata. [F-1-43]
 9 Details live at /privacy and /terms on the website. [F-1-44]
 5 Copyright 2026 Sidecar Ledger contributors.
 5 Released under the MIT License. [F-1-45]
```

README headings are “Sidecar Ledger” (2), “Install” (1), “Usage” (1),
“Example” (1), “Develop and verify” (3), and “Privacy and licensing” (3); they
make sense in context. Commands are not prose sentences.

## Verification and sandbox evidence

- First **Test a route** click shows a realistic precomputed Lightroom →
  Immich table, but not a real folder inventory or isolated demo.
- A release-binary scan of a copied fixture in a fresh temporary directory
  returned exit 2; all input SHA-256 hashes were unchanged.
- Fresh-profile first load used only the product origin. After service-worker
  control, an offline reload stayed interactive with no console errors.
- `npm test`: pass (8 Rust unit, 7 CLI integration, 6 site tests).
- `npm run build`: pass; release binary, package, and `dist/site/` produced.
- `npm run test:a11y`: pass; no serious/critical Axe findings.
- Factory `verify-url.sh`: pass for title/lang/h1/main/alt/console basics.
- `npx @axe-core/cli` against live with matched Chrome/driver: 0 violations.
- Link crawl: all present links resolve; approved checkout reaches Dodo.

There were no claim commands to run because the required manifest is absent.
The general results above do not supply claim traceability.

## History verification

No earlier `review-*` or `polish-*` file exists. I read the prior handoff and
all verification records. Fresh named tests confirm the earlier RDF false
description, malformed XML, uppercase sidecar, invalid exit, proprietary XMP,
and `xml:lang` defects are fixed. Fresh offline reload confirms that regression
is fixed. The browser bootstrap now works. Live checkout uses `api.sociobot.in`
and reaches Dodo. Git-source installation replaces the unavailable registry
command. None of those findings regressed.

## Structure and visual summary

Home, Privacy, and Terms return 200 and have route-appropriate titles,
`lang=en`, one h1, main, skip link, description, SVG favicon, and focus styles.
Links work, console is clean, reduced motion and 390px layout pass. The local
fonts, ceramic artwork, cold palette, tile shapes, ledger rules, and restrained
motion are distinct rather than a generic SaaS template.

Failures remain in F-1-2/F-1-5 and F-1-58–F-1-62: real routes, 404, metadata,
shared shell, route focus, and required information order.

## What would make this perfect

Resolve every finding: ship the real temporary-directory CLI demo and isolated
`/demo`; turn every retained promise into a tagged claim test; simplify and
standardize copy; add the 404, route metadata, shared shell, focus behavior,
and missing landing sections. Re-run this entire checklist from fresh browser
and clone contexts. PASS requires zero findings and zero untested claims.
