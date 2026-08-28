# Adversarial first-read review 2 — Sidecar Ledger

**Verdict: FAIL**

Reviewed 2026-08-28 at commit `5f443c6aef0e8dc824cfd18ab0801758d723d85b`
against `https://photo-edit-ledger.sociobot.in/`, using fresh Chromium
contexts at 390×844 and 1440×900. The first read, demo, main quality gates,
link crawl, and all 17 listed claim commands pass. The product still has
blocking honesty, claim-evidence, terminology, and metadata findings. Under
this review's rules, a prior finding that is only half-fixed is blocking.

## Cold first screen

Before scrolling, my answers were:

- **What:** checks which photo metadata and photo edit settings will survive
  when I switch tools.
- **For whom:** photographers moving RAW files between tools.
- **First click:** **Try it with sample data**. The adjacent text says,
  **“Opens a sample Lightroom → Immich report. Nothing is saved.”**

The exact supporting copy is **“Check photo metadata before switching tools”**
and **“For photographers moving RAW files between tools, it shows which
metadata and photo edit settings will survive.”** All three answers are clear
on both mobile and desktop. This part passes.

## Blocking findings

### F-2-1 — Paid six-route guidance is advertised but not available (reopens F-1-22)

Landing page: **“An optional $19 one-time purchase adds browser-based migration
steps”** and **“Six practical migration steps,”** followed by six named routes.
`site/src/data.js` does contain six route-specific arrays, but the unlocked Pro
UI in `site/src/main.js` never imports or reads them. `renderRecipe()` always
shows the same four generic steps, and the paid panel has no route selector.
The claim test only counts six locked-page `<li>` elements; it never unlocks
Pro or observes route-specific guidance.

A buyer is shown six routes but cannot use any of the six recipes. Connect the
paid panel to `recipes[selectedRoute]`, provide an accessible route selector,
and add a claim test that unlocks Pro with a fixture entitlement and confirms
different visible steps for all six routes.

### F-2-2 — The no-upload claim has no matching intercepted CLI test (reopens F-1-27 and F-1-42)

Landing: **“The CLI does not edit photos or upload metadata.”** README:
**“It does not upload photos or metadata.”** The `read-only-local` manifest
entry promises only local execution and no source changes. Its test hashes
files and searches `Cargo.lock` for three HTTP crates; it does not intercept
network activity, and it does not list the upload promise.

This is a privacy claim a visitor may rely on. Add a `cli-private` claim entry
and run the real sample scan under network syscall interception, asserting no
connection attempt and unchanged inputs. A dependency-name regex is not an
observable privacy test.

### F-2-3 — Refund revocation is not tested as an observable outcome (reopens F-1-21)

Landing: **“Refunds revoke Pro access.”** Terms add **“after the next license
check.”** The `merchant-refund` test asserts those strings, the checkout URL,
and regexes in `main.js`. It never starts with an unlocked entitlement, returns
a refunded/invalid fixture verdict, or confirms that the Pro content becomes
locked. The manifest's stated sandbox says “invalid-license handling,” but the
test does not exercise it.

Use a routed fixture response: seed an active license, visibly unlock Pro,
return `{valid:false}`, trigger the next check, and assert that paid content is
unavailable. Keep the live checkout-resolution check separate.

### F-2-4 — License privacy is asserted from source text, not the promised interception (reopens F-1-43)

README: **“The optional website license check runs on the landing page only. It
never receives photo metadata.”** The `license-scope` manifest says its sandbox
is **“intercepted fake-token verification.”** Its test opens Home without a
token, then regexes the source. No verification request is made, so its URL,
method, and payload are never observed.

Seed or submit a fake token, intercept the request, and assert that only the
encoded token is sent. Also open `/demo/` and the legal routes with seeded real
storage and assert that none reads the token or calls the API.

### F-2-5 — Product terms are still inconsistent and specialist wording remains (reopens F-1-51 and F-1-55)

The landing page and README call the output a **“handoff report,”** but the real
CLI demo prints **“SIDECAR LEDGER / HANDOFF CONTRACT.”** CLI/package copy still
uses **“preflight”** and scan output still says **“develop recipes.”** The
landing page also uses unexplained **“XMP,” “JSON,” “CLI,” “binary,” “MIT,”**
and **“capability set.”** Its footer says **“Local proof before a photo
handoff,”** an unlisted certainty claim that conflicts with the warning that
the report is not a promise.

Use the agreed terms everywhere: **scan**, **handoff report**, **photo edit
settings**, and **migration steps**. Expand the first use of technical terms,
for example **“XMP metadata sidecar files”** and **“JSON data file.”** Replace
the footer with **“Check photo metadata before switching tools.”**

### F-2-6 — Non-home social metadata is incomplete (reopens F-1-58)

Live `/demo/`, `/privacy/`, `/terms/`, and the 404 contain only
`twitter:card`; they omit `twitter:title`, `twitter:description`, and
`twitter:image`. The 404 also omits `og:url`. Home contains the full set. The
route test calls a document complete after checking only `twitter:card`, so it
cannot catch the regression.

Add route-specific Twitter title, description, and image tags on every route,
add `og:url` to 404, and make the metadata test assert every required value and
the 1200×630 image dimensions.

### F-2-7 — README installation claims remain unlisted (reopens F-1-41)

README says **“Install from this public source with a current stable Rust
toolchain”** and **“npm run install:browser downloads Chromium for browser
checks.”** Neither claim has a `.factory/claims.json` entry. The general
consumer and accessibility runs are useful, but the published claim manifest
does not make either promise traceable.

Add clean-clone claim entries for the documented Git installation and browser
installation, or rewrite these as contributor prerequisites without promising
an outcome. Each retained claim needs its own tagged observable test.

## Other findings

### F-2-8 — Manifest commands do not select the named claim

Every manifest command has the form `node --test
site/tests/claims.test.mjs --test-name-pattern=…`. In the clean clone, each of
the 17 commands ran all 17 tests with **0 filtered out**. The named test does
run and pass, but failures cannot be attributed cleanly and the command repeats
the whole suite.

Put `--test-name-pattern` before the test file, or create a package script that
forwards the selector in Node's option position. Add a check that each manifest
command reports one matching test and 16 filtered tests.

### F-2-9 — Demo and wordmark touch targets are below 44 px

At 390 px, **Reset demo** and **Start for real** are 38 px high. The header
wordmark is 32 px high, and the footer wordmark is 15 px high. This conflicts
with the attached accessibility and site-structure 44 px minimum. The CSS
explicitly overrides the general control rule with `.demo-banner button,
.demo-banner a { min-height: 38px; }`.

Give these controls a minimum 44×44 px hit area without increasing visible
type size. Add a mobile bounding-box assertion; Axe does not report this rule.

### F-2-10 — External destinations are not identified

The footer **“Source”** link leaves for GitHub, and **“Buy Pro · $19 once”**
leaves for a Dodo checkout through the Sociobot API. Neither says it opens an
external site, as required by the site-structure contract.

Use labels or adjacent accessible text such as **“Source on GitHub (external)”**
and **“Buy Pro · $19 once — opens secure checkout.”**

### F-2-11 — The repository copy audit is incomplete and one count is wrong

`.factory/copy-audit.md` says the landing and README were audited, but lists
only seven first-screen strings. It omits the remaining landing copy and all
README sentences. It counts the 17-word audience sentence as 16 words.

Regenerate that file from the current landing page and README, include the full
audit below, and make the count/test fail on omissions, banned words, or more
than 22 words.

## Copy audit

Counts use word tokens; standalone arrows and separators are not words.
Repeated wordmarks and footer navigation labels are listed once. Shell commands
and select options are interface data rather than sentences. No sentence is
over 22 words. Buttons name their result; the flags are jargon, unsupported
claims, marketing wording, or inconsistent terms.

### Landing page

```text
 2 Sidecar Ledger
 1 Demo                         1 Install                      1 Privacy
 2 You’re offline.              5 The sample report still works.
 4 Local photo metadata scan
 6 Check photo metadata before switching tools
17 For photographers moving RAW files between tools, it shows which metadata and photo edit settings will survive.
 5 Try it with sample data
 6 Opens a sample Lightroom → Immich report.    3 Nothing is saved.
 4 Runs on your computer        3 Sample works offline
 6 Core scan free · Pro $19 once
17 Two ceramic archive plates representing a photograph and its metadata sidecar, joined by a thin registration line.
 6 A photo and sidecar, checked together.
 3 How it works                 7 Scan a folder, then keep the report
 3 Scan a folder                7 Read image filenames and nearby XMP sidecars. [jargon F-2-5]
 3 Review each field            6 See portable, lossy, or unknown results.
 3 Save the report              9 Keep JSON with the archive before you move it. [jargon F-2-5]
 3 Single binary · v0.1.0 [jargon F-2-5]
 7 Scan filenames and XMP without changing them [jargon F-2-5]
 8 Sidecar Ledger reads image filenames and adjacent XMP. [jargon F-2-5]
 6 It does not change source files.
 2 local shell
 8 Exit 0: portable · 2: review · 1: input error
 2 Bundled sample               5 Watch the real sample scan
 5 Terminal recording of sidecar-ledger demo.
18 It scans two images and one sidecar, writes a temporary JSON handoff report, and exits 2 for review. [jargon F-2-5]
14 sidecar-ledger demo copies the sample to a temporary folder and prints its report path.
 2 Field results                7 Read one result for every metadata field
 1 Portable                    10 The destination has a declared way to keep the field.
 1 Lossy                        8 Keep a backup or render before the move.
 1 Unknown                      8 Test one representative photo before the full move.
 5 Unknown edit data stays private.
11 The report names the data vocabulary but never displays its contents.
 3 Privacy and limits           8 Keep your originals and test a small copy
 9 The CLI does not edit photos or upload metadata. [unlisted privacy claim F-2-2; jargon F-2-5]
14 It reports declared support, not a promise that every app version behaves the same.
 8 Read the privacy policy and terms of use.
 4 Optional Pro migration steps
 4 Keep the scan free.          4 Buy migration steps once.
11 The CLI, field results, and JSON report stay free under MIT. [jargon F-2-5]
 9 An optional $19 one-time purchase adds browser-based migration steps. [misleading F-2-1]
 6 Sociobot/Dodo is the merchant of record. [legal jargon]
 4 Refunds revoke Pro access. [untested outcome F-2-3]
 7 Privacy and terms explain the optional license.
 4 Six practical migration steps [marketing adjective and misleading F-2-1]
 2 Lightroom → Immich           2 Lightroom → Snapseed
 2 darktable → Immich           2 darktable → Snapseed
 2 Immich → Lightroom           3 Generic XMP → Immich [jargon F-2-5]
 4 Buy Pro · $19 once           2 Already purchased?
 3 Restore Pro access           2 License token
 2 Verify license               3 Your migration steps
 5 Remove license from this browser
 6 Local proof before a photo handoff. [vague/unlisted certainty F-2-5]
 1 Terms                        1 Source
 5 Built by Param Factory · v0.1.0
```

The result-naming action check passes for **Try it with sample data**, **Buy
Pro**, **Restore Pro access**, **Verify license**, and **Remove license from
this browser**. Navigation nouns are links, not action buttons.

### README

```text
 2 Sidecar Ledger
 9 Sidecar Ledger checks photo metadata before you switch tools.
 8 It inventories a folder and its XMP sidecars. [jargon F-2-5]
11 The handoff report marks each field as portable, lossy, or unknown.
10 The CLI runs locally and does not change source files. [jargon F-2-5]
 7 It does not upload photos or metadata. [unlisted privacy claim F-2-2]
 1 Install
11 Install from this public source with a current stable Rust toolchain: [unlisted claim F-2-7]
 6 For a checkout you already have:
 4 Try the bundled sample
11 Run the shipped Lightroom to Immich sample in a temporary folder:
16 The command copies the sample, runs the real scanner, and prints the JSON handoff report path. [jargon F-2-5]
 7 Exit 2 means the sample needs review.
11 Open the isolated browser sample at https://photo-edit-ledger.sociobot.in/demo/ or https://photo-edit-ledger.sociobot.in/?demo=1.
 3 Scan a folder
 4 Exit 0 means portable.       7 Exit 2 means review losses or unknowns.
 9 Exit 1 means the input could not be scanned.
10 Supported profiles are lightroom, darktable, immich, immich-readonly, snapseed, and generic-xmp.
 5 Unknown metadata returns exit 2.
10 The report names its vocabulary but never prints its values.
 3 Develop and verify
13 npm run build creates the release binary, package, and static site in dist/site/.
 8 npm run install:browser downloads Chromium for browser checks. [unlisted claim F-2-7]
 3 Privacy and license
11 The optional website license check runs on the landing page only. [untested path F-2-4]
 5 It never receives photo metadata. [untested payload F-2-4]
 6 Read the privacy policy and terms.
13 The CLI and its JSON handoff reports are free under the MIT License. [jargon F-2-5]
```

## Demo and sandbox evidence

- Home → **Try it with sample data** opened `/demo/` in one click.
- The first demo screen already showed two photos, one XMP sidecar, five field
  results, an attention verdict, and a concrete Lightroom → Immich action.
- The persistent banner, **Reset demo**, and **Start for real** were present.
- Direct `/demo/` with seeded `sb_license:*` keys and `real:sentinel` made only
  same-origin requests. Route changes and Reset left every seeded value exact.
- Reset restored Lightroom → Immich. An offline service-worker reload remained
  interactive and changed the visible route to darktable → Immich.
- From `/tmp/sidecar-ledger-review2-demo.tO5uCv`, the clean-clone release binary
  ran `sidecar-ledger demo`, created a distinct `/tmp/sidecar-ledger-demo-*`
  sample and JSON report, printed both paths, and exited 2 as documented.

The demo requirement itself passes.

## Claim manifest results

All commands were run verbatim after `npm ci` in the disposable clean clone
`/tmp/photo-edit-ledger-review2.iei3UN`.

| Claim id | Result |
| --- | --- |
| handoff-report | PASS |
| read-only-local | PASS |
| versioned-json | PASS |
| demo-cli-real | PASS |
| opaque-values | PASS |
| exit-codes | PASS |
| profiles | PASS |
| demo-isolated | PASS |
| demo-private | PASS |
| offline-demo | PASS |
| license-scope | PASS, but does not execute its stated fake-token sandbox; F-2-4 |
| paid-price | PASS |
| merchant-refund | PASS, but does not observe refund revocation; F-2-3 |
| migration-steps | PASS, but counts locked labels rather than paid route output; F-2-1 |
| legal-routes | PASS |
| free-mit | PASS |
| build-output | PASS |

Each documented selector ran the entire 17-test file; see F-2-8. The landing
and README unlisted claims are in F-2-2 and F-2-7. Therefore the review still
has untested claims despite zero nonzero command exits.

## Structure, links, and accessibility

Home, Demo, Privacy, Terms, and the designed 404 have `lang=en`, one h1, one
main, route-specific titles and descriptions, canonicals, OG images, favicons,
Apple touch icons, skip links, shared header/footer content, h1 focus, and live
announcements. Browser Back restored Home and focused its h1. Unknown URLs
returned the designed page with HTTP 404. Mobile width had no horizontal
overflow. The sitemap lists all four public routes; robots and security headers
are present. The metadata exception is F-2-6.

The crawl returned 200 for every internal page, GitHub Source, and the checkout
link; checkout resolved to `checkout.dodopayments.com`. No dead link was found.
The external-label issue is F-2-10.

Live Axe returned zero violations on all five routes. The clean-clone
`npm test`, `npm run build`, and `npm run test:a11y` all passed; `dist/site/`
was produced. The manual target measurement still fails F-2-9.

The pale ceramic archive art, paired-tile mark, mono/body type pairing, ledger
rules, restrained motion, and cold worktable palette are recognisably specific
to this product. It does not look like a generic SaaS template.

## Earlier finding verification

Every earlier finding was checked against the live site and current code.

| Earlier id | Current verification |
| --- | --- |
| F-1-1 | Fixed: one clear first action and adjacent result text. |
| F-1-2 | Fixed: real CLI demo, browser route, banner, reset, exit, and docs. |
| F-1-3 | Fixed: direct demo preserved seeded real storage and stayed same-origin. |
| F-1-4 | Partial: manifest/tags exist, but three tests do not prove their stated observable sandbox and selectors run all tests; F-2-1/F-2-3/F-2-4/F-2-8. |
| F-1-5 | Fixed: unknown route returned designed HTTP 404. |
| F-1-6 | Fixed: handoff report fixture test passed. |
| F-1-7 | Fixed for the listed local-execution claim; no-upload remains F-2-2. |
| F-1-8 | Fixed: copied-input hashes remained exact. |
| F-1-9 | Fixed: schema version assertion passed. |
| F-1-10 | Fixed: full demo request trace stayed same-origin. |
| F-1-11 | Fixed: CLI demo ran the real scanner. |
| F-1-12 | Fixed: unsupported overwrite warning was removed. |
| F-1-13 | Fixed: fixture inventory checks adjacent XMP discovery. |
| F-1-14 | Fixed for mutation; upload/network wording remains F-2-2. |
| F-1-15 | Fixed: shipped sample count, result, JSON path, and exit 2 passed. |
| F-1-16 | Fixed: representative portable/lossy mapping passed. |
| F-1-17 | Fixed: opaque canary did not appear. |
| F-1-18 | Fixed: MIT metadata and ungated CLI scan passed. |
| F-1-19 | Fixed: $19 once appears on Home and Terms. |
| F-1-20 | Fixed: live checkout resolved through Sociobot to Dodo. |
| F-1-21 | Reopened: refund revocation is source-regexed, not observed; F-2-3. |
| F-1-22 | Reopened: six recipes exist in data but paid UI renders one generic recipe; F-2-1. |
| F-1-23 | Fixed: live and local offline demo remained interactive. |
| F-1-24 | Fixed: retry promise remains removed. |
| F-1-25 | Fixed: README uses the current local/read-only wording. |
| F-1-26 | Fixed: inventory/report behavior passed end to end. |
| F-1-27 | Reopened: no-upload copy lacks network interception; F-2-2. |
| F-1-28 | Fixed: timestamp promise removed; mutation remains hash-tested. |
| F-1-29 | Fixed: crates.io availability claim remains removed. |
| F-1-30 | Fixed: prebuilt PATH claim remains removed. |
| F-1-31 | Fixed: versioned machine-readable JSON passed. |
| F-1-32 | Fixed: all three exit codes passed. |
| F-1-33 | Fixed: stdout/stderr marketing claim remains removed. |
| F-1-34 | Fixed: `schema_version` passed. |
| F-1-35 | Fixed: the exact six-profile list passed. |
| F-1-36 | Fixed: field recognition and opaque-value checks passed. |
| F-1-37 | Fixed: unknown vocabulary exits 2 without printing its value. |
| F-1-38 | Fixed: broad test-suite marketing sentence remains removed. |
| F-1-39 | Fixed: `npm test` passed the stated Rust and browser suites. |
| F-1-40 | Fixed: clean `npm run build` produced every named output. |
| F-1-41 | Reopened: browser-install outcome remains public but unlisted; F-2-7. |
| F-1-42 | Reopened: privacy wording still lacks an intercepted CLI test; F-2-2. |
| F-1-43 | Reopened: fake-token verification is not exercised; F-2-4. |
| F-1-44 | Fixed: Privacy and Terms returned 200 with correct titles. |
| F-1-45 | Fixed: repository and package licenses are MIT. |
| F-1-46 | Fixed: hero sentence is 17 words. |
| F-1-47 | Fixed: README output is split into short sentences. |
| F-1-48 | Fixed: README exit codes are split into short sentences. |
| F-1-49 | Fixed: README unknown-data wording is 10 words. |
| F-1-50 | Fixed: browser-install wording is 8 words; its claim gap is F-2-7. |
| F-1-51 | Reopened: CLI still says handoff contract/preflight; F-2-5. |
| F-1-52 | Fixed: h1 names the job. |
| F-1-53 | Fixed: install heading names the scan and no-change result. |
| F-1-54 | Fixed: field-results heading makes sense alone. |
| F-1-55 | Reopened: specialist terms and “develop recipes” persist; F-2-5. |
| F-1-56 | Fixed: sample action names the result. |
| F-1-57 | Fixed: button says Restore Pro access. |
| F-1-58 | Reopened: route Twitter metadata and 404 `og:url` are incomplete; F-2-6. |
| F-1-59 | Fixed: shared header/footer information is consistent. |
| F-1-60 | Fixed: forward and Back focused and announced the h1. |
| F-1-61 | Fixed: three-step and privacy/limits sections are present. |
| F-1-62 | Fixed: sitemap includes `/demo/`. |

## Missed leverage

F-2-1 is the obvious missing value: the six already-authored, route-specific
migration recipes need to be usable after purchase. No AI feature is warranted
for deterministic XMP inventory and capability matching; adding one would
weaken the local, inspectable workflow. JSON already supplies the brief's
machine-readable export, and cloud sync is not implied by this local-first CLI.

## What would make this perfect

Expose and test all six paid route recipes; add the missing intercepted privacy
and refund tests plus unlisted installation claims; make claim selectors
selective; use one plain terminology set; complete every route's social tags;
raise direct touch targets to 44 px; identify external destinations; and
regenerate the full copy audit. Then rerun this entire cold-read, sandbox,
claim, history, routing, crawl, and accessibility review from clean contexts.

