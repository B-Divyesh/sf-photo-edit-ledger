use clap::ValueEnum;
use serde::Serialize;
use std::fmt;

pub const CAPABILITY_VERSION: &str = "2026.08";

/// A built-in, versioned application capability declaration.
#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, ValueEnum)]
#[serde(rename_all = "kebab-case")]
pub enum Tool {
    Lightroom,
    Darktable,
    Immich,
    ImmichReadonly,
    Snapseed,
    GenericXmp,
}

impl Tool {
    pub fn label(self) -> &'static str {
        match self {
            Self::Lightroom => "Adobe Lightroom",
            Self::Darktable => "darktable",
            Self::Immich => "Immich (writable library)",
            Self::ImmichReadonly => "Immich (read-only library)",
            Self::Snapseed => "Snapseed",
            Self::GenericXmp => "Generic XMP workflow",
        }
    }

    pub fn profile(self) -> Profile {
        Profile {
            tool: self,
            version: CAPABILITY_VERSION,
        }
    }
}

impl fmt::Display for Tool {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{}",
            self.to_possible_value().expect("variant").get_name()
        )
    }
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Ord, PartialOrd, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum FieldKind {
    Rating,
    Description,
    Keywords,
    ColorLabel,
    Adjustments,
    UnknownMetadata,
}

impl FieldKind {
    pub fn label(self) -> &'static str {
        match self {
            Self::Rating => "rating",
            Self::Description => "description",
            Self::Keywords => "keywords",
            Self::ColorLabel => "color label",
            Self::Adjustments => "edit adjustments",
            Self::UnknownMetadata => "unrecognized metadata",
        }
    }
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Capability {
    Portable,
    Lossy,
    Unknown,
}

impl Capability {
    pub fn label(self) -> &'static str {
        match self {
            Self::Portable => "PORTABLE",
            Self::Lossy => "LOSSY",
            Self::Unknown => "UNKNOWN",
        }
    }
}

#[derive(Clone, Debug, Serialize)]
pub struct Assessment {
    pub field: FieldKind,
    pub source_capability: Capability,
    pub destination_capability: Capability,
    pub capability: Capability,
    pub seen_in: usize,
    pub reason: String,
}

#[derive(Clone, Copy, Debug, Serialize)]
pub struct Profile {
    pub tool: Tool,
    pub version: &'static str,
}

impl Profile {
    pub fn assess(self, field: FieldKind, namespaces: &[String]) -> (Capability, String) {
        use Capability::{Lossy, Portable, Unknown};
        use FieldKind::{Adjustments, ColorLabel, Description, Keywords, Rating, UnknownMetadata};
        let result = match self.tool {
            Tool::Lightroom => match field {
                Rating | Description | Keywords | ColorLabel => {
                    (Portable, "read and written through standard XMP")
                }
                Adjustments
                    if namespaces
                        .iter()
                        .all(|n| matches!(n.as_str(), "crs" | "lr")) =>
                {
                    (
                        Portable,
                        "Camera Raw adjustment block stays native to this route",
                    )
                }
                Adjustments => (
                    Unknown,
                    "foreign adjustment namespace is preserved as opaque data",
                ),
                UnknownMetadata => (
                    Unknown,
                    "unrecognized XMP namespace is kept opaque and has no declared mapping",
                ),
            },
            Tool::Darktable => match field {
                Rating | Description | Keywords | ColorLabel => {
                    (Portable, "mapped through standard XMP fields")
                }
                Adjustments if namespaces.iter().all(|n| n == "darktable") => (
                    Portable,
                    "darktable history stack stays native to this route",
                ),
                Adjustments => (Unknown, "foreign adjustment namespace is not translated"),
                UnknownMetadata => (
                    Unknown,
                    "unrecognized XMP namespace has no declared mapping",
                ),
            },
            Tool::Immich => match field {
                Rating | Description | Keywords => {
                    (Portable, "ingested from a writable library sidecar")
                }
                ColorLabel => (
                    Unknown,
                    "no stable round-trip color-label mapping is declared",
                ),
                Adjustments => (
                    Lossy,
                    "develop recipes are not rendered or translated by Immich",
                ),
                UnknownMetadata => (
                    Unknown,
                    "unrecognized XMP namespace has no declared mapping",
                ),
            },
            Tool::ImmichReadonly => match field {
                Rating | Description | Keywords | ColorLabel => (
                    Lossy,
                    "sidecar can be read, but library changes cannot be written back and may be overwritten on extraction",
                ),
                Adjustments => (
                    Lossy,
                    "develop recipes are neither applied nor writable in a read-only library",
                ),
                UnknownMetadata => (
                    Unknown,
                    "unrecognized XMP namespace has no declared mapping",
                ),
            },
            Tool::Snapseed => match field {
                Rating | Description | Keywords | ColorLabel => (
                    Unknown,
                    "sidecar field round-trip is not declared by Snapseed",
                ),
                Adjustments => (
                    Lossy,
                    "another editor's non-destructive recipe is not reproduced",
                ),
                UnknownMetadata => (
                    Unknown,
                    "unrecognized XMP namespace has no declared mapping",
                ),
            },
            Tool::GenericXmp => match field {
                Rating | Description | Keywords | ColorLabel => {
                    (Portable, "represented by a standard XMP field")
                }
                Adjustments => (
                    Unknown,
                    "proprietary namespace is preserved but cannot be interpreted",
                ),
                UnknownMetadata => (
                    Unknown,
                    "unrecognized XMP namespace is opaque and has no declared mapping",
                ),
            },
        };
        (result.0, result.1.to_owned())
    }
}
