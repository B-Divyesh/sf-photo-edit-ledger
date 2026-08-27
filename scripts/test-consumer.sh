#!/usr/bin/env bash
set -euo pipefail

# Exercise exactly what a consumer receives from cargo package, not this tree's
# debug binary. The temporary install root is removed even when a check fails.
cargo package --locked
consumer_root=$(mktemp -d)
trap 'rm -rf "$consumer_root"' EXIT
package_dir="target/package/sidecar-ledger-0.1.0"
cargo install --path "$package_dir" --root "$consumer_root" --locked
binary="$consumer_root/bin/sidecar-ledger"

"$binary" --help >/dev/null
"$binary" tools --json >/dev/null
set +e
"$binary" scan tests/fixtures/catalog --from not-a-tool --to immich >/dev/null 2>"$consumer_root/invalid.stderr"
status=$?
set -e
test "$status" -eq 1
rg -q 'invalid value' "$consumer_root/invalid.stderr"

vendor_fixture="$consumer_root/vendor-xmp"
mkdir "$vendor_fixture"
printf 'raw fixture bytes' > "$vendor_fixture/capture.dng"
printf '%s' '<x:xmpmeta xmlns:x="adobe:ns:meta/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:c1="http://www.phaseone.com/"><rdf:RDF><rdf:Description c1:Adjustment="opaque-secret-value" /></rdf:RDF></x:xmpmeta>' > "$vendor_fixture/capture.xmp"
set +e
"$binary" scan "$vendor_fixture" --from generic-xmp --to generic-xmp --json > "$consumer_root/vendor.json"
status=$?
set -e
test "$status" -eq 2
rg -q '"field": "unknown_metadata"' "$consumer_root/vendor.json"
rg -q 'http://www.phaseone.com/' "$consumer_root/vendor.json"
! rg -q 'opaque-secret-value' "$consumer_root/vendor.json"
echo "consumer package install, invalid-input, and opaque-namespace contracts passed"
