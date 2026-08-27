# Independent verification — Sidecar Ledger

**Verdict: FAIL**

- Candidate: `5bc7ffd5d111b6ce0452cb33116e31d85607e33d`
- Branch: `main`; checkout was clean before verification.
- Live target: `https://photo-edit-ledger.sociobot.in/`
- Date: 2026-08-27
- Scope: original researched brief and the builder work order. No product code
  was modified during verification.

## Executive result

The candidate builds, packages, and presents a polished local-first website.
However, its scanner can invent a portable description from RDF scaffolding and
can silently accept malformed XMP as fully portable. Those are false-safe
answers for the product's central promise—an evidence-backed preflight before a
photographer moves an archive—so this is a release **FAIL**.

## Reproducible CLI/consumer results

I ran `cargo package --locked`, then installed the resulting
`target/package/sidecar-ledger-0.1.0` into a fresh temporary Cargo root with:

```sh
cargo install --path target/package/sidecar-ledger-0.1.0 --root <fresh-root> --locked
```

The installed public binary had helpful `--help`, and its documented JSON,
human, `tools`, and explicit new-report-file paths ran. Input SHA-256 values
for normal, boundary, and malformed test folders were identical before and
after scans; an existing report stayed `sentinel` and was refused.

| Case | Result | Evidence |
| --- | --- | --- |
| Normal | Pass | One DNG + well-formed XMP with standard fields, generic-XMP to generic-XMP: exit 0; 1 image/1 sidecar/1 pair; all observed fields portable; `source_files_changed: false`. |
| Lossy boundary | Pass, with a false field | Lightroom Camera Raw adjustment to Immich: exit 2 and `adjustments: lossy`, but it also reported `description: portable` despite no description metadata. This is the `rdf:Description` parser defect below. |
| Malformed XMP | **Fail** | One DNG + `<x:xmpmeta><unclosed>`: exit 0, empty `errors`, `needs_attention: false`, `source_files_changed: false`. It must be a parse warning/attention result. |
| Recovery | Pass only after external repair | Replacing the malformed contents with a well-formed rating sidecar then returned exit 0, one pair, no errors. The preceding false-safe result remains blocking. |
| Uppercase extension | **Fail** | `C.DNG` + `C.XMP`: exit 2, `paired: 0`, `images_without_sidecar: 1`, `orphan_sidecars: 1`. Discovery normalizes extension case but candidate matching does not. |
| Existing report | Pass | Explicit `--output` refuses overwrite with exit 1 and retains existing contents. |
| Missing folder | Pass | Clear OS error and exit 1. |
| Invalid profile | **Fail vs documented contract** | `--from not-a-tool` exits 2. README promises exit 1 for invalid input. |

### Root causes observed in source

1. `src/scan.rs::inspect_name` treats every element whose local name is
   `description` as a metadata description; `rdf:Description` is merely RDF
   structure.
2. The XML event loop accepts EOF with unclosed elements and does not check
   balanced XML before emitting its report.
3. `sidecar_candidates` only creates lowercase `.xmp` paths while sidecar
   discovery uses case-insensitive extension classification.

## Build, package, tests, lint

Executed from the candidate checkout:

```sh
npm ci
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
npm run test:a11y
cargo package --locked --list
```

- `npm ci`: completed; 20 packages audited, 0 vulnerabilities.
- `npm test`: **pass** — 6 Rust unit/process tests and 5 site tests.
- `cargo fmt --check`: **pass**.
- `cargo clippy --all-targets -- -D warnings`: **pass**.
- Exact production `npm run build`: **pass** — release binary, crate package
  verification, and `dist/site/` all produced.
- `npm run test:a11y`: **pass after build** — axe reports zero serious/critical
  findings on `/`, `/privacy/`, and `/terms/`; mobile overflow and initial
  focus checks pass. It is not independently clean-checkout runnable because
  it uses Vite preview without first producing `dist/site` (LOW defect).
- Packaged crate lists 19 expected source/license/readme/test files and
  excludes site artifacts.

## Website/PWA/a11y/performance

Production build budgets are within contract: JS 7.13 kB (2.77 kB gzip), CSS
11.08 kB (3.41 kB gzip), self-hosted fonts 74.42 kB, hero WebP 61.94 kB.

Local mobile Lighthouse (production preview) scored Performance **99**,
Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.5 s, LCP
1.8 s, TBT 0 ms, CLS 0.

Live-browser checks at desktop 1440px and 390x844px:

- one `h1`, title, `lang=en`, main landmark, image alt; no horizontal overflow;
- keyboard-only route selection changed Lightroom → Immich and the generated
  command; copy command activated with Enter; sampled focus targets had a
  visible 2px solid outline;
- reduced-motion reports a 0.001 ms effective animation duration;
- no browser console errors or page errors;
- local production PWA registered `/sw.js`, `registration.update()` completed,
  and an offline reload retained title and H1;
- visual review of desktop and 390px screenshots found a coherent responsive
  layout without clipped controls.

## Privacy, network, security, and deployment identity

Source inspection finds no CLI network client or archive write path. The CLI
does not print opaque adjustment values. A normal landing-page load requested
only its own origin (HTML, local assets, self-hosted fonts, WebP); there are no
analytics or third-party runtime requests. The only designed outbound request
is optional license verification to the Sociobot billing API after a stored or
submitted token, consistent with the privacy policy.

The live response contains HSTS, `nosniff`, strict-origin referrer policy,
camera/microphone/geolocation permissions denial, and a restrictive CSP. Hashed
assets are `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.

The live home HTML and rebuilt candidate `dist/site/index.html` have the same
SHA-256:

```
90787cda70bf490e832b0446cd7884ea52abfa71e811eab63082504971d4bbb6
```

so the deployed site matches the candidate. `/privacy/`, `/terms/`, and SPA
fallback route all returned 200. The live payment link is nevertheless a
staging `pilot-api.sociobot.in` link, not the contract's production
`api.sociobot.in` route; `HEAD` on its checkout URL returned 404.

## Defects by severity

### HIGH

1. False portable description from `rdf:Description` scaffolding.
2. Malformed XMP silently yields a clean portable report.
3. Landing-page `cargo install sidecar-ledger` command is unavailable:
   `cargo search sidecar-ledger --limit 5` returned no package, while the
   README's local-path installation is the only currently working route.

### MEDIUM

1. Invalid CLI option uses exit 2 rather than the README's invalid-input exit
   1 contract.
2. Uppercase XMP sidecars are falsely shown as missing/orphaned on Linux.
3. Production deployment exposes a staging billing endpoint; checkout is not
   release-ready.

### LOW

1. `npm run test:a11y` has an undeclared prerequisite on `npm run build`.

## Required next steps

Correct XML namespace-aware field identification and malformed-document
handling; add regression tests for these exact inputs, uppercase sidecars, and
exit-code contract. Make public install instructions truthful until a registry
release exists. Switch/validate the production billing endpoint before showing
a live price. Then repeat the clean install, test, package, browser, PWA, live
identity, and security checks above.
