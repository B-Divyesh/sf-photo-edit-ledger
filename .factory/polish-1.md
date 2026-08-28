# Polish 1 — finding ledger

Candidate repaired: 69f56a66f7147b88650cfd0e1ae77eec577e516d.

Local screenshots: .factory/evidence/local-home-390.png and
.factory/evidence/local-demo-390.png. Browser evidence comes from npm run
test:a11y and the tagged claim suite.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the first action with Try it with sample data and outcome text. | site test landing check; home screenshot |
| F-1-2 | Added shipped examples, CLI demo, terminal recording, /demo/, and demo docs. | claim demo-cli-real; CLI demo test |
| F-1-3 | Made /demo/ separate, in-memory, and license-free. | claims demo-isolated and demo-private |
| F-1-4 | Added claims manifest and tagged sandbox tests. | 18 claims pass |
| F-1-5 | Added ceramic 404 page and platform response override. | site 404 config test |
| F-1-6 | Rewrote hero as a plain handoff-report claim. | claim handoff-report |
| F-1-7 | Retained local operation only as a tested claim. | claim read-only-local |
| F-1-8 | Retained read-only behavior with copied-input hashes. | claim read-only-local |
| F-1-9 | Retained versioned JSON with schema assertion. | claim versioned-json |
| F-1-10 | Replaced browser-demo wording and intercepted its full request flow. | claim demo-private |
| F-1-11 | The CLI demo runs the scanner over bundled examples. | claim demo-cli-real |
| F-1-12 | Replaced unsupported overwrite warning with clear read-only destination advice. | route browser checks |
| F-1-13 | Kept filename/XMP discovery as a tested scan result. | claim handoff-report |
| F-1-14 | Removed pixel/timestamp/network marketing copy; retained tested no-mutation claim. | claim read-only-local |
| F-1-15 | Replaced static pretend recording with real CLI sample output and recording. | claim demo-cli-real |
| F-1-16 | Kept declared route field results and tested a lossy mapping. | claim handoff-report |
| F-1-17 | Kept opaque-value protection and added a canary assertion. | claim opaque-values |
| F-1-18 | Kept MIT/free statement with package license and ungated scan proof. | claim free-mit |
| F-1-19 | Kept exact $19 one-time price in public copy. | claim paid-price |
| F-1-20 | Restored merchant-of-record copy and approved checkout endpoint. | claim merchant-refund |
| F-1-21 | Restored refund revocation copy; invalid verdict locks Pro. | claim merchant-refund |
| F-1-22 | Added six named migration routes and route data. | claim migration-steps; site six-routes test |
| F-1-23 | Kept offline sample promise with SW offline reload test. | claim offline-demo |
| F-1-24 | Removed the untested retry promise. | copy audit |
| F-1-25 | Rewrote README local/read-only statement. | claim read-only-local |
| F-1-26 | Rewrote README output statement in two sentences. | claim handoff-report |
| F-1-27 | Rewrote README privacy statement as tested local/no-mutation behavior. | claims read-only-local, demo-private |
| F-1-28 | Removed timestamp promise; source mutation remains hash-tested. | claim read-only-local |
| F-1-29 | Removed dated crates.io availability statement. | README audit |
| F-1-30 | Removed untestable prebuilt-artifact statement. | README audit |
| F-1-31 | Retained machine-readable JSON with schema test. | claim versioned-json |
| F-1-32 | Split exit-code copy and tested all three exits. | claim exit-codes |
| F-1-33 | Removed untested stdout/stderr marketing sentence. | README audit |
| F-1-34 | Retained schema version as a tested JSON claim. | claim versioned-json |
| F-1-35 | Retained six profiles with exact list assertion. | claim profiles |
| F-1-36 | Simplified field/vocabulary wording and retained opaque canary proof. | claims handoff-report, opaque-values |
| F-1-37 | Retained unknown-vocabulary behavior without opaque values. | claim opaque-values |
| F-1-38 | Removed broad test-suite marketing sentence. | README audit |
| F-1-39 | Kept test command as contributor documentation; suite includes claims. | npm test |
| F-1-40 | Kept build output statement and checks outputs. | claim build-output |
| F-1-41 | Shortened Chromium instruction; browser install runs in a11y gate. | npm run test:a11y |
| F-1-42 | Rewrote as local/no-mutation claim with dependency and hash check. | claim read-only-local |
| F-1-43 | Kept optional license scope with same-origin demo and exact verify source test. | claim license-scope |
| F-1-44 | Kept legal routes and direct title/status checks. | claim legal-routes |
| F-1-45 | Kept MIT claim with license metadata check. | claim free-mit |
| F-1-46 | Replaced 29-word hero copy with a 16-word audience sentence. | copy audit |
| F-1-47 | Split README core-output sentence. | copy audit |
| F-1-48 | Split README exit-code sentence. | copy audit |
| F-1-49 | Split README namespace sentence. | copy audit |
| F-1-50 | Shortened browser-install sentence. | copy audit |
| F-1-51 | Standardized scan, handoff report, photo edit settings, and migration steps. | terminology table |
| F-1-52 | Changed h1 to Check photo metadata before switching tools. | site test; home screenshot |
| F-1-53 | Changed install heading to Scan filenames and XMP without changing them. | site test |
| F-1-54 | Changed field heading to Read one result for every metadata field. | home screenshot |
| F-1-55 | Replaced unexplained specialist vocabulary with plain field/data language. | copy audit |
| F-1-56 | Replaced trial actions with explicit sample-data action and report demo. | F-1-1 evidence |
| F-1-57 | Changed restore action to Restore Pro access. | claim license-scope |
| F-1-58 | Added route canonical, OG/Twitter, 1200×630 card, and touch icon metadata. | complete-route site tests |
| F-1-59 | Applied same header/footer information to home, demo, legal, and 404 pages. | a11y route sweep |
| F-1-60 | Each page focuses its h1 and announces route title. | a11y focus check |
| F-1-61 | Added three-step How it works and privacy/limits section. | site test; home screenshot |
| F-1-62 | Added /demo/ to sitemap. | production-route site test |

Earlier verification findings (RDF scaffolding, malformed XMP, uppercase
sidecars, invalid input, XML language metadata, offline shell, and production
checkout) remain covered by Rust integration tests, test-consumer, and browser
offline checks.
