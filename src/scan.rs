use crate::profile::{Assessment, CAPABILITY_VERSION, Capability, FieldKind, Tool};
use quick_xml::Reader;
use quick_xml::events::Event;
use serde::Serialize;
use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};

const IMAGE_EXTENSIONS: &[&str] = &[
    "3fr", "arw", "cr2", "cr3", "dng", "erf", "heic", "heif", "jpeg", "jpg", "nef", "orf", "pef",
    "png", "raf", "raw", "rw2", "srw", "tif", "tiff",
];

#[derive(Clone, Debug)]
pub struct ScanOptions {
    pub root: PathBuf,
    pub source: Tool,
    pub destination: Tool,
}

#[derive(Clone, Debug, Default, Serialize)]
pub struct Counts {
    pub images: usize,
    pub sidecars: usize,
    pub paired: usize,
    pub images_without_sidecar: usize,
    pub orphan_sidecars: usize,
}

#[derive(Clone, Debug, Serialize)]
pub struct AssetRecord {
    pub image: String,
    pub sidecar: Option<String>,
    pub fields: Vec<FieldKind>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub opaque_namespaces: Vec<String>,
}

#[derive(Clone, Debug, Serialize)]
pub struct ScanError {
    pub path: String,
    pub message: String,
}

#[derive(Clone, Debug, Serialize)]
pub struct Manifest {
    pub schema_version: &'static str,
    pub capability_version: &'static str,
    pub generated_at_unix: u64,
    pub root: String,
    pub source: Tool,
    pub destination: Tool,
    pub counts: Counts,
    pub assessments: Vec<Assessment>,
    pub assets: Vec<AssetRecord>,
    pub orphan_sidecars: Vec<String>,
    pub errors: Vec<ScanError>,
    pub recommendations: Vec<String>,
    pub needs_attention: bool,
    pub source_files_changed: bool,
}

#[derive(Default)]
struct XmpSummary {
    fields: BTreeSet<FieldKind>,
    namespaces: BTreeSet<String>,
    unknown_namespaces: BTreeSet<String>,
}

#[derive(Clone, Debug, Default)]
struct NamespaceScope {
    prefixes: BTreeMap<String, String>,
    default: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
struct QualifiedName {
    namespace: Option<String>,
    local: String,
    prefix: Option<String>,
}

const DC_NAMESPACE: &str = "http://purl.org/dc/elements/1.1/";
const XMP_NAMESPACE: &str = "http://ns.adobe.com/xap/1.0/";
const LIGHTROOM_NAMESPACE: &str = "http://ns.adobe.com/lightroom/1.0/";
const CAMERA_RAW_NAMESPACE: &str = "http://ns.adobe.com/camera-raw-settings/1.0/";
const DARKTABLE_NAMESPACES: &[&str] = &["http://darktable.sf.net/", "http://darktable.org/"];
const SNAPSEED_NAMESPACES: &[&str] = &[
    "http://snapseed.com/1.0/",
    "http://ns.google.com/photos/1.0/",
];
const RDF_NAMESPACE: &str = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const XML_NAMESPACE: &str = "http://www.w3.org/XML/1998/namespace";
const XMP_META_NAMESPACE: &str = "adobe:ns:meta/";

pub fn scan(options: &ScanOptions) -> io::Result<Manifest> {
    let metadata = fs::metadata(&options.root)?;
    if !metadata.is_dir() {
        return Err(io::Error::new(
            io::ErrorKind::InvalidInput,
            "scan path is not a directory",
        ));
    }

    let mut files = Vec::new();
    collect_files(&options.root, &mut files)?;
    files.sort();

    let images: Vec<PathBuf> = files.iter().filter(|p| is_image(p)).cloned().collect();
    let sidecars: Vec<PathBuf> = files
        .iter()
        .filter(|p| extension(p).as_deref() == Some("xmp"))
        .cloned()
        .collect();
    let mut sidecar_set = BTreeMap::new();
    for sidecar in &sidecars {
        // XMP discovery is case-insensitive, so pairing must be too. Keep the
        // sorted first path if a case-sensitive filesystem contains duplicates.
        sidecar_set
            .entry(path_key(sidecar))
            .or_insert_with(|| sidecar.clone());
    }
    let mut used_sidecars = BTreeSet::new();
    let mut assets = Vec::new();
    let mut errors = Vec::new();
    let mut field_counts: BTreeMap<FieldKind, usize> = BTreeMap::new();
    let mut all_namespaces = BTreeSet::new();

    for image in &images {
        let sidecar = sidecar_candidates(image)
            .into_iter()
            .find_map(|candidate| sidecar_set.get(&path_key(&candidate)).cloned());
        let mut fields = Vec::new();
        let mut namespaces = Vec::new();
        if let Some(path) = &sidecar {
            used_sidecars.insert(path.clone());
            match parse_xmp(path) {
                Ok(summary) => {
                    fields = summary.fields.into_iter().collect();
                    namespaces = summary
                        .namespaces
                        .into_iter()
                        .chain(summary.unknown_namespaces)
                        .collect();
                    for field in &fields {
                        *field_counts.entry(*field).or_default() += 1;
                    }
                    all_namespaces.extend(namespaces.iter().cloned());
                }
                Err(error) => errors.push(ScanError {
                    path: relative(&options.root, path),
                    message: format!("could not parse XMP: {error}"),
                }),
            }
        }
        assets.push(AssetRecord {
            image: relative(&options.root, image),
            sidecar: sidecar.as_ref().map(|p| relative(&options.root, p)),
            fields,
            opaque_namespaces: namespaces,
        });
    }

    let orphan_sidecars: Vec<String> = sidecars
        .iter()
        .filter(|p| !used_sidecars.contains(*p))
        .map(|p| relative(&options.root, p))
        .collect();

    // Orphan sidecars still contribute to the field-level inventory.
    for sidecar in sidecars.iter().filter(|p| !used_sidecars.contains(*p)) {
        match parse_xmp(sidecar) {
            Ok(summary) => {
                for field in summary.fields {
                    *field_counts.entry(field).or_default() += 1;
                }
                all_namespaces.extend(summary.namespaces);
            }
            Err(error) => errors.push(ScanError {
                path: relative(&options.root, sidecar),
                message: format!("could not parse XMP: {error}"),
            }),
        }
    }

    let namespace_list: Vec<String> = all_namespaces.into_iter().collect();
    let assessments: Vec<Assessment> = field_counts
        .into_iter()
        .map(|(field, seen_in)| {
            let (source_capability, source_reason) =
                options.source.profile().assess(field, &namespace_list);
            let (destination_capability, destination_reason) =
                options.destination.profile().assess(field, &namespace_list);
            let capability = combine(source_capability, destination_capability);
            let reason = if source_capability == Capability::Portable {
                destination_reason
            } else {
                format!("source: {source_reason}; destination: {destination_reason}")
            };
            Assessment {
                field,
                source_capability,
                destination_capability,
                capability,
                seen_in,
                reason,
            }
        })
        .collect();

    let counts = Counts {
        images: images.len(),
        sidecars: sidecars.len(),
        paired: used_sidecars.len(),
        images_without_sidecar: images.len().saturating_sub(used_sidecars.len()),
        orphan_sidecars: orphan_sidecars.len(),
    };
    let mut recommendations = recommendations(&counts, &assessments, &errors, options.destination);
    if recommendations.is_empty() {
        recommendations
            .push("Keep the originals and sidecars together during the transfer.".into());
        recommendations
            .push("Re-run this preflight after import to verify the resulting folder.".into());
    }
    let needs_attention = counts.images == 0
        || counts.images_without_sidecar > 0
        || counts.orphan_sidecars > 0
        || !errors.is_empty()
        || assessments
            .iter()
            .any(|a| a.capability != Capability::Portable);

    Ok(Manifest {
        schema_version: "1",
        capability_version: CAPABILITY_VERSION,
        generated_at_unix: SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs(),
        root: options.root.to_string_lossy().into_owned(),
        source: options.source,
        destination: options.destination,
        counts,
        assessments,
        assets,
        orphan_sidecars,
        errors,
        recommendations,
        needs_attention,
        source_files_changed: false,
    })
}

fn combine(source: Capability, destination: Capability) -> Capability {
    match (source, destination) {
        (Capability::Lossy, _) | (_, Capability::Lossy) => Capability::Lossy,
        (Capability::Unknown, _) | (_, Capability::Unknown) => Capability::Unknown,
        _ => Capability::Portable,
    }
}

fn recommendations(
    counts: &Counts,
    assessments: &[Assessment],
    errors: &[ScanError],
    destination: Tool,
) -> Vec<String> {
    let mut result = Vec::new();
    if counts.images_without_sidecar > 0 {
        result.push(format!(
            "{} image(s) have no adjacent XMP; export sidecars from the source or preserve the source catalog before moving.",
            counts.images_without_sidecar
        ));
    }
    if counts.orphan_sidecars > 0 {
        result.push(format!(
            "{} XMP sidecar(s) have no matching image; check renames and copy completeness.",
            counts.orphan_sidecars
        ));
    }
    if !errors.is_empty() {
        result.push("Repair or replace unreadable sidecars, then run the scan again.".into());
    }
    if assessments
        .iter()
        .any(|a| a.field == FieldKind::Adjustments && a.capability != Capability::Portable)
    {
        result.push("Render critical edited versions (for example, 16-bit TIFF) while keeping originals and opaque sidecars.".into());
    }
    if destination == Tool::ImmichReadonly {
        result.push("Treat this Immich library as view-only; keep the editor catalog as the authority for ratings and descriptions.".into());
    }
    if assessments
        .iter()
        .any(|a| a.capability == Capability::Unknown)
    {
        result.push(
            "Test a representative copy in the destination before moving the full archive.".into(),
        );
    }
    result
}

fn collect_files(dir: &Path, out: &mut Vec<PathBuf>) -> io::Result<()> {
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        let file_type = entry.file_type()?;
        if file_type.is_dir() {
            collect_files(&path, out)?;
        } else if file_type.is_file() {
            out.push(path);
        }
    }
    Ok(())
}

fn extension(path: &Path) -> Option<String> {
    path.extension()?.to_str().map(str::to_ascii_lowercase)
}

fn is_image(path: &Path) -> bool {
    extension(path).is_some_and(|ext| IMAGE_EXTENSIONS.contains(&ext.as_str()))
}

fn sidecar_candidates(image: &Path) -> [PathBuf; 2] {
    [
        image.with_extension("xmp"),
        PathBuf::from(format!("{}.xmp", image.display())),
    ]
}

fn path_key(path: &Path) -> String {
    path.to_string_lossy().to_ascii_lowercase()
}

fn relative(root: &Path, path: &Path) -> String {
    path.strip_prefix(root)
        .unwrap_or(path)
        .to_string_lossy()
        .replace('\\', "/")
}

fn parse_xmp(path: &Path) -> Result<XmpSummary, Box<dyn std::error::Error>> {
    let mut reader = Reader::from_file(path)?;
    reader.config_mut().trim_text(true);
    let mut buffer = Vec::new();
    let mut summary = XmpSummary::default();
    let mut scopes = vec![NamespaceScope::default()];
    let mut elements = Vec::new();

    loop {
        match reader.read_event_into(&mut buffer)? {
            Event::Start(event) => {
                let name = String::from_utf8_lossy(event.name().as_ref()).into_owned();
                let scope = namespace_scope(scopes.last().expect("base namespace scope"), &event)?;
                let element = resolve_name(&name, &scope, false);
                inspect_name(&element, &mut summary);
                inspect_attributes(&event, &scope, &mut summary)?;
                scopes.push(scope);
                elements.push(element);
            }
            Event::Empty(event) => {
                let name = String::from_utf8_lossy(event.name().as_ref()).into_owned();
                let scope = namespace_scope(scopes.last().expect("base namespace scope"), &event)?;
                inspect_name(&resolve_name(&name, &scope, false), &mut summary);
                inspect_attributes(&event, &scope, &mut summary)?;
            }
            Event::End(event) => {
                let name = String::from_utf8_lossy(event.name().as_ref()).into_owned();
                let closing = resolve_name(
                    &name,
                    scopes.last().expect("namespace scope for open element"),
                    false,
                );
                let opening = elements
                    .pop()
                    .ok_or_else(|| malformed_xmp("closing tag without an opening tag"))?;
                if opening != closing {
                    return Err(malformed_xmp(format!(
                        "mismatched closing tag: expected </{}> but found </{}>",
                        opening.local, closing.local
                    )));
                }
                scopes.pop();
            }
            Event::Eof => {
                if !elements.is_empty() {
                    return Err(malformed_xmp(format!(
                        "unexpected end of document with {} unclosed element(s)",
                        elements.len()
                    )));
                }
                break;
            }
            _ => {}
        }
        buffer.clear();
    }
    Ok(summary)
}

fn namespace_scope(
    parent: &NamespaceScope,
    event: &quick_xml::events::BytesStart<'_>,
) -> Result<NamespaceScope, Box<dyn std::error::Error>> {
    let mut scope = parent.clone();
    for attribute in event.attributes().with_checks(true) {
        let attribute = attribute?;
        let key = String::from_utf8_lossy(attribute.key.as_ref());
        let value = String::from_utf8_lossy(attribute.value.as_ref()).into_owned();
        if key == "xmlns" {
            scope.default = Some(value);
        } else if let Some(prefix) = key.strip_prefix("xmlns:") {
            scope.prefixes.insert(prefix.to_owned(), value);
        }
    }
    Ok(scope)
}

fn inspect_attributes(
    event: &quick_xml::events::BytesStart<'_>,
    scope: &NamespaceScope,
    summary: &mut XmpSummary,
) -> Result<(), Box<dyn std::error::Error>> {
    for attribute in event.attributes().with_checks(true) {
        let attribute = attribute?;
        let name = String::from_utf8_lossy(attribute.key.as_ref());
        if name != "xmlns" && !name.starts_with("xmlns:") {
            inspect_name(&resolve_name(&name, scope, true), summary);
        }
    }
    Ok(())
}

fn resolve_name(name: &str, scope: &NamespaceScope, attribute: bool) -> QualifiedName {
    let (prefix, local) = match name.split_once(':') {
        Some((prefix, local)) => (Some(prefix.to_owned()), local.to_owned()),
        None => (None, name.to_owned()),
    };
    let namespace = match &prefix {
        Some(prefix) => scope.prefixes.get(prefix).cloned(),
        None if !attribute => scope.default.clone(),
        None => None,
    };
    QualifiedName {
        namespace,
        local: local.to_ascii_lowercase(),
        prefix,
    }
}

fn inspect_name(name: &QualifiedName, summary: &mut XmpSummary) {
    let namespace = name.namespace.as_deref();
    match (namespace, name.local.as_str()) {
        (Some(XMP_NAMESPACE), "rating") => {
            summary.fields.insert(FieldKind::Rating);
        }
        (Some(DC_NAMESPACE), "description") => {
            summary.fields.insert(FieldKind::Description);
        }
        (Some(DC_NAMESPACE), "subject") | (Some(LIGHTROOM_NAMESPACE), "hierarchicalsubject") => {
            summary.fields.insert(FieldKind::Keywords);
        }
        (Some(XMP_NAMESPACE), "label") => {
            summary.fields.insert(FieldKind::ColorLabel);
        }
        _ => {}
    }
    if standard_field(name) {
        return;
    }
    if let Some(namespace) = namespace
        && let Some(namespace_name) = adjustment_namespace(namespace)
    {
        summary.fields.insert(FieldKind::Adjustments);
        summary.namespaces.insert(namespace_name.into());
    } else if let Some(namespace) = namespace {
        if !is_recognized_standard_namespace(namespace) {
            summary.fields.insert(FieldKind::UnknownMetadata);
            // Namespace identifiers identify the XMP vocabulary only. Never
            // inspect or serialize the attribute/text value in that vocabulary.
            summary.unknown_namespaces.insert(namespace.into());
        }
    } else if name.prefix.is_some() {
        // quick-xml is intentionally non-validating. An undeclared prefix is
        // also unsafe to call portable, but do not echo the opaque field name.
        summary.fields.insert(FieldKind::UnknownMetadata);
        summary
            .unknown_namespaces
            .insert("unresolved XMP namespace".into());
    }
}

fn is_recognized_standard_namespace(namespace: &str) -> bool {
    matches!(
        namespace,
        DC_NAMESPACE | XMP_NAMESPACE | LIGHTROOM_NAMESPACE | CAMERA_RAW_NAMESPACE | RDF_NAMESPACE
            | XML_NAMESPACE | XMP_META_NAMESPACE
    ) || DARKTABLE_NAMESPACES.contains(&namespace)
        || SNAPSEED_NAMESPACES.contains(&namespace)
        // Adobe's published XMP schemas use this registry prefix. Specific
        // develop schemas above are still classified as opaque adjustments.
        || namespace.starts_with("http://ns.adobe.com/")
        || namespace.starts_with("http://iptc.org/std/")
        || namespace.starts_with("http://ns.useplus.org/")
}

fn standard_field(name: &QualifiedName) -> bool {
    matches!(
        (name.namespace.as_deref(), name.local.as_str()),
        (Some(XMP_NAMESPACE), "rating" | "label")
            | (Some(DC_NAMESPACE), "description" | "subject")
            | (Some(LIGHTROOM_NAMESPACE), "hierarchicalsubject")
    )
}

fn adjustment_namespace(namespace: &str) -> Option<&'static str> {
    match namespace {
        CAMERA_RAW_NAMESPACE => Some("crs"),
        LIGHTROOM_NAMESPACE => Some("lr"),
        namespace if DARKTABLE_NAMESPACES.contains(&namespace) => Some("darktable"),
        namespace if SNAPSEED_NAMESPACES.contains(&namespace) => Some("snapseed"),
        _ => None,
    }
}

fn malformed_xmp(message: impl Into<String>) -> Box<dyn std::error::Error> {
    Box::new(io::Error::new(io::ErrorKind::InvalidData, message.into()))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    #[test]
    fn recognizes_double_extension_sidecars_without_changing_files() {
        let dir = tempfile::tempdir().unwrap();
        fs::write(dir.path().join("frame.dng"), b"raw").unwrap();
        let xmp = dir.path().join("frame.dng.xmp");
        let mut file = fs::File::create(&xmp).unwrap();
        write!(file, r#"<x:xmpmeta xmlns:x="adobe:ns:meta/" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"><rdf:RDF xmlns:rdf="x"><rdf:Description xmp:Rating="5" crs:Exposure2012="1.0" /></rdf:RDF></x:xmpmeta>"#).unwrap();
        let before = fs::metadata(&xmp).unwrap().modified().unwrap();
        let result = scan(&ScanOptions {
            root: dir.path().into(),
            source: Tool::Lightroom,
            destination: Tool::Immich,
        })
        .unwrap();
        let after = fs::metadata(&xmp).unwrap().modified().unwrap();
        assert_eq!(result.counts.paired, 1);
        assert!(
            result
                .assessments
                .iter()
                .any(|a| a.field == FieldKind::Rating)
        );
        assert!(
            result
                .assessments
                .iter()
                .any(|a| a.field == FieldKind::Adjustments && a.capability == Capability::Lossy)
        );
        assert_eq!(before, after);
        assert!(!result.source_files_changed);
    }

    #[test]
    fn empty_folder_is_an_attention_state() {
        let dir = tempfile::tempdir().unwrap();
        let result = scan(&ScanOptions {
            root: dir.path().into(),
            source: Tool::GenericXmp,
            destination: Tool::GenericXmp,
        })
        .unwrap();
        assert!(result.needs_attention);
        assert_eq!(result.counts.images, 0);
        assert!(crate::render_human(&result).contains("EMPTY"));
    }

    #[test]
    fn rdf_description_scaffolding_is_not_a_photographer_description() {
        let dir = tempfile::tempdir().unwrap();
        fs::write(dir.path().join("boundary.dng"), b"raw").unwrap();
        fs::write(
            dir.path().join("boundary.xmp"),
            r#"<x:xmpmeta xmlns:x="adobe:ns:meta/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"><rdf:RDF><rdf:Description crs:Exposure2012="1.0" /></rdf:RDF></x:xmpmeta>"#,
        )
        .unwrap();

        let result = scan(&ScanOptions {
            root: dir.path().into(),
            source: Tool::Lightroom,
            destination: Tool::Immich,
        })
        .unwrap();

        assert!(
            result
                .assessments
                .iter()
                .any(|assessment| assessment.field == FieldKind::Adjustments)
        );
        assert!(
            !result
                .assessments
                .iter()
                .any(|assessment| assessment.field == FieldKind::Description)
        );
    }

    #[test]
    fn malformed_xmp_is_a_parse_warning_and_attention_state() {
        let dir = tempfile::tempdir().unwrap();
        fs::write(dir.path().join("broken.dng"), b"raw").unwrap();
        fs::write(dir.path().join("broken.xmp"), "<x:xmpmeta><unclosed>").unwrap();

        let result = scan(&ScanOptions {
            root: dir.path().into(),
            source: Tool::GenericXmp,
            destination: Tool::GenericXmp,
        })
        .unwrap();

        assert!(result.needs_attention);
        assert_eq!(result.errors.len(), 1);
        assert!(result.errors[0].message.contains("could not parse XMP"));
    }

    #[test]
    fn uppercase_xmp_extension_pairs_with_uppercase_image_extension() {
        let dir = tempfile::tempdir().unwrap();
        fs::write(dir.path().join("C.DNG"), b"raw").unwrap();
        fs::write(
            dir.path().join("C.XMP"),
            r#"<x:xmpmeta xmlns:x="adobe:ns:meta/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:xmp="http://ns.adobe.com/xap/1.0/"><rdf:RDF><rdf:Description xmp:Rating="5" /></rdf:RDF></x:xmpmeta>"#,
        )
        .unwrap();

        let result = scan(&ScanOptions {
            root: dir.path().into(),
            source: Tool::GenericXmp,
            destination: Tool::GenericXmp,
        })
        .unwrap();

        assert_eq!(result.counts.paired, 1);
        assert_eq!(result.counts.images_without_sidecar, 0);
        assert_eq!(result.counts.orphan_sidecars, 0);
        assert!(result.errors.is_empty());
    }

    #[test]
    fn unrecognized_xmp_namespace_is_unknown_without_its_opaque_value() {
        let dir = tempfile::tempdir().unwrap();
        fs::write(dir.path().join("capture.dng"), b"raw").unwrap();
        fs::write(
            dir.path().join("capture.xmp"),
            r#"<x:xmpmeta xmlns:x="adobe:ns:meta/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:c1="http://www.phaseone.com/"><rdf:RDF><rdf:Description c1:Adjustment="opaque-secret-value" /></rdf:RDF></x:xmpmeta>"#,
        )
        .unwrap();

        let result = scan(&ScanOptions {
            root: dir.path().into(),
            source: Tool::GenericXmp,
            destination: Tool::GenericXmp,
        })
        .unwrap();

        assert!(result.needs_attention);
        assert!(result.assessments.iter().any(|assessment| {
            assessment.field == FieldKind::UnknownMetadata
                && assessment.capability == Capability::Unknown
        }));
        assert_eq!(
            result.assets[0].opaque_namespaces,
            vec!["http://www.phaseone.com/"]
        );
        let json = serde_json::to_string(&result).unwrap();
        assert!(!json.contains("opaque-secret-value"));
    }
}
