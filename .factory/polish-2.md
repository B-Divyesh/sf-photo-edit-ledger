# Polish 2 — finding ledger

Candidate repaired from `5f443c6aef0e8dc824cfd18ab0801758d723d85b`.
Local evidence: `npm test`, `npm run build`, `npm run test:a11y`, and every
command in `.factory/claims.json` pass. Browser evidence is recorded by the
Playwright claim and accessibility tests; live evidence is added in the handoff
after deployment.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the first-screen sample action and its outcome text. | `landing page puts the sample action and plain wording first` |
| F-1-2 | Kept the real CLI and browser demos, banner, reset, exit, sample files, and docs. | `@claim:demo-cli-real`, `@claim:demo-isolated` |
| F-1-3 | Kept demo separate from real storage and license access. | `@claim:demo-isolated`, `@claim:license-scope` |
| F-1-4 | Expanded the manifest to 20 isolated, selector-correct claim tests. | every `.factory/claims.json` command |
| F-1-5 | Kept the static 404 response override and ceramic 404 page. | `404 config returns the ceramic error page` |
| F-1-6 | Kept the fixture-backed scan and handoff-report claim. | `@claim:handoff-report` |
| F-1-7 | Kept local-only scan proof and added syscall-level privacy proof. | `@claim:read-only-local`, `@claim:cli-private` |
| F-1-8 | Kept source hash comparison around a real scan. | `@claim:read-only-local` |
| F-1-9 | Kept schema-version JSON assertion. | `@claim:versioned-json` |
| F-1-10 | Kept same-origin interception through the full browser demo flow. | `@claim:demo-private` |
| F-1-11 | Kept bundled CLI demo running the real scanner. | `@claim:demo-cli-real` |
| F-1-12 | Kept unsupported overwrite advice removed. | copy audit and route fixture tests |
| F-1-13 | Kept image/XMP sidecar discovery in the real fixture scan. | `@claim:handoff-report` |
| F-1-14 | Kept no-mutation proof and added `connect` syscall interception. | `@claim:read-only-local`, `@claim:cli-private` |
| F-1-15 | Kept recording and CLI counts, report path, and exit status in sync. | `@claim:demo-cli-real` |
| F-1-16 | Kept representative portable/lossy route assessment. | `@claim:handoff-report` |
| F-1-17 | Kept opaque-value canary regression test. | `@claim:opaque-values` |
| F-1-18 | Kept MIT/free scan proof. | `@claim:free-mit` |
| F-1-19 | Kept exact one-time price proof. | `@claim:paid-price` |
| F-1-20 | Kept approved checkout endpoint and merchant wording. | `production billing and security routes` |
| F-1-21 | Added active-to-revoked entitlement transition assertion. | `@claim:merchant-refund` |
| F-1-22 | Connected six paid routes to an accessible selector and route data. | `@claim:migration-steps` |
| F-1-23 | Kept service-worker offline demo proof. | `@claim:offline-demo` |
| F-1-24 | Kept the untested retry promise absent. | copy audit |
| F-1-25 | Kept local/read-only README wording backed by tests. | `@claim:read-only-local` |
| F-1-26 | Kept end-to-end inventory/classification wording backed by fixture. | `@claim:handoff-report` |
| F-1-27 | Added the separate no-upload privacy claim. | `@claim:cli-private` |
| F-1-28 | Kept no-mutation source-hash check. | `@claim:read-only-local` |
| F-1-29 | Kept dated registry availability wording absent. | README audit |
| F-1-30 | Replaced untestable PATH promise with local-checkout install. | `@claim:checkout-install` |
| F-1-31 | Kept machine-readable versioned output. | `@claim:versioned-json` |
| F-1-32 | Kept observable exit-code matrix. | `@claim:exit-codes` |
| F-1-33 | Kept unsupported stream-marketing copy absent. | README audit |
| F-1-34 | Kept JSON schema proof. | `@claim:versioned-json` |
| F-1-35 | Kept exact six-profile list proof. | `@claim:profiles` |
| F-1-36 | Kept recognition and opaque-value safeguards. | `@claim:handoff-report`, `@claim:opaque-values` |
| F-1-37 | Kept unknown metadata behavior without values. | `@claim:opaque-values` |
| F-1-38 | Kept broad test-suite marketing absent. | README audit |
| F-1-39 | Kept test command as contributor documentation. | `npm test` |
| F-1-40 | Kept build artifact proof. | `@claim:build-output` |
| F-1-41 | Added a dedicated Chromium installation claim. | `@claim:browser-install` |
| F-1-42 | Added real no-connection test instead of dependency-name inference. | `@claim:cli-private` |
| F-1-43 | Added intercepted token-only request and non-home storage checks. | `@claim:license-scope` |
| F-1-44 | Kept legal direct-route checks. | `@claim:legal-routes` |
| F-1-45 | Kept MIT metadata assertion. | `@claim:free-mit` |
| F-1-46 | Kept short first-screen audience copy. | `copy audit covers public prose` |
| F-1-47 | Kept short README output copy. | `copy audit covers public prose` |
| F-1-48 | Kept short README exit-code copy. | `copy audit covers public prose` |
| F-1-49 | Kept short unknown-data copy. | `copy audit covers public prose` |
| F-1-50 | Kept short browser-install copy. | `copy audit covers public prose` |
| F-1-51 | Standardized scan, handoff report, photo edit settings, and migration steps. | `copy audit covers public prose` |
| F-1-52 | Kept job-specific h1. | landing test |
| F-1-53 | Kept concrete scan heading. | landing test |
| F-1-54 | Kept field-result heading. | landing test |
| F-1-55 | Expanded technical first uses and removed contract/preflight/develop-recipe wording. | copy audit, `rg` audit |
| F-1-56 | Kept explicit sample action. | landing test |
| F-1-57 | Kept Restore Pro access wording. | `@claim:license-scope` |
| F-1-58 | Completed all route social metadata and 1200×630 verification. | `complete route document`, `social card` |
| F-1-59 | Kept shared shell and labeled external links. | route/a11y sweep |
| F-1-60 | Kept h1 focus and live announcement. | `test:a11y` |
| F-1-61 | Kept three-step and privacy sections. | landing test |
| F-1-62 | Kept demo in sitemap. | production route test |
| F-2-1 | Paid panel now selects and renders each of six actual route-specific step sets. | `@claim:migration-steps` |
| F-2-2 | Added `cli-private`: real binary under a `connect` syscall interceptor. | `@claim:cli-private` |
| F-2-3 | Locked Pro content after intercepted invalid/refunded verdict. | `@claim:merchant-refund` |
| F-2-4 | Intercepted a real token-only GET and verified no non-home token reads/API calls. | `@claim:license-scope` |
| F-2-5 | Removed stale terms, expanded XMP/JSON/CLI first uses, and changed footer wording. | copy-audit test, `rg` audit |
| F-2-6 | Added full Twitter tags and 404 `og:url`; checked social-card dimensions. | `complete route document`, `social card` |
| F-2-7 | Added checkout-install and browser-install claims/tests. | `@claim:checkout-install`, `@claim:browser-install` |
| F-2-8 | Selector runner puts Node options before the test file. | each manifest command runs one named test |
| F-2-9 | Raised banner/wordmark mobile hit areas to 44px and asserted boxes. | `test:a11y` |
| F-2-10 | Labeled GitHub and checkout departures as external. | route source inspection, a11y sweep |
| F-2-11 | Rebuilt complete audit with terminology and regression test. | `copy audit covers public prose` |
