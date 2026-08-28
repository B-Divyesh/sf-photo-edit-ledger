# Sidecar Ledger demo

## Browser sample

Open /demo/ or /?demo=1. The first screen shows a Lightroom to Immich sample
with two photo files and one XMP sidecar.

The banner says **Demo — sample data, nothing is saved**. **Reset demo**
returns the route controls to Lightroom → Immich. **Start for real** returns
to /. The route stores no browser data; it never reads the real
sb_license:photo-edit-ledger keys and has no license request path.

## CLI sample

Run:

    sidecar-ledger demo

The command materialises examples/lightroom-to-immich/ in a newly-created
temporary directory, runs the real scanner from Lightroom to Immich, writes
lightroom-to-immich.json, and prints both paths. It exits 2 because the
sample intentionally includes one photo without a sidecar and photo edit
settings that need review.

The included sample has:

- alpine-dawn.dng with alpine-dawn.xmp
- unpaired-nef.nef without a sidecar

The source examples remain read-only. Each CLI invocation uses a distinct
temporary directory.
