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
echo "consumer package install and documented invalid-input exit contract passed"
