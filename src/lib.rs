//! Sidecar Ledger's small public API.
//!
//! Most callers should use [`scan`] with a [`ScanOptions`] value, then serialize
//! the returned [`Manifest`] or render it with [`render_human`]. Scans open files
//! read-only and never attempt to interpret proprietary adjustment values.

mod profile;
mod scan;

pub use profile::{Assessment, Capability, FieldKind, Profile, Tool};
pub use scan::{AssetRecord, Counts, Manifest, ScanError, ScanOptions, scan};

/// Render a compact terminal handoff contract.
pub fn render_human(manifest: &Manifest) -> String {
    let mut out = String::new();
    out.push_str("SIDECAR LEDGER / HANDOFF CONTRACT\n");
    out.push_str(&format!(
        "Route: {} -> {}  |  capability set {}\n",
        manifest.source.label(),
        manifest.destination.label(),
        manifest.capability_version
    ));
    out.push_str(&format!(
        "Inventory: {} images, {} sidecars, {} paired, {} orphaned\n\n",
        manifest.counts.images,
        manifest.counts.sidecars,
        manifest.counts.paired,
        manifest.counts.orphan_sidecars
    ));

    if manifest.counts.images == 0 && manifest.counts.sidecars == 0 {
        out.push_str("EMPTY  No supported images or XMP sidecars were found.\n");
        out.push_str("       Check the folder or include RAW/DNG/JPEG/TIFF/HEIF files.\n");
        return out;
    }

    out.push_str("FIELD             VERDICT    SEEN  CONTRACT\n");
    out.push_str("----------------  ---------  ----  ---------------------------------------\n");
    for item in &manifest.assessments {
        out.push_str(&format!(
            "{:<16}  {:<9}  {:>4}  {}\n",
            item.field.label(),
            item.capability.label(),
            item.seen_in,
            item.reason
        ));
    }
    if manifest.assessments.is_empty() {
        out.push_str("metadata fields   UNKNOWN       0  No recognized sidecar fields found.\n");
    }

    if !manifest.errors.is_empty() {
        out.push_str("\nREAD WARNINGS\n");
        for error in &manifest.errors {
            out.push_str(&format!("- {}: {}\n", error.path, error.message));
        }
    }
    out.push_str("\nNEXT STEPS\n");
    for recommendation in &manifest.recommendations {
        out.push_str(&format!("- {recommendation}\n"));
    }
    out.push_str(&format!(
        "\nVerdict: {}. Source files were not changed.\n",
        if manifest.needs_attention {
            "ATTENTION"
        } else {
            "PORTABLE"
        }
    ));
    out
}
