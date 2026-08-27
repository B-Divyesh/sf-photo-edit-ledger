use clap::{Parser, Subcommand, error::ErrorKind};
use serde::Serialize;
use sidecar_ledger::{ScanOptions, Tool, render_human, scan};
use std::fs::OpenOptions;
use std::io::Write;
use std::path::PathBuf;
use std::process::ExitCode;

#[derive(Parser)]
#[command(name = "sidecar-ledger", version, about = "Preflight photo/XMP handoffs without touching your archive", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Inventory a folder and assess metadata portability
    Scan {
        /// Folder containing images and adjacent .xmp sidecars
        path: PathBuf,
        /// Tool that currently owns the metadata
        #[arg(long, value_enum)]
        from: Tool,
        /// Destination editor or library
        #[arg(long, value_enum)]
        to: Tool,
        /// Emit a versioned JSON manifest
        #[arg(long)]
        json: bool,
        /// Write the report to this new file instead of stdout
        #[arg(long, value_name = "FILE")]
        output: Option<PathBuf>,
    },
    /// List built-in capability declarations
    Tools {
        /// Emit JSON for scripting
        #[arg(long)]
        json: bool,
    },
}

#[derive(Serialize)]
struct ToolDescription {
    id: Tool,
    label: &'static str,
    capability_version: &'static str,
}

fn main() -> ExitCode {
    let cli = match Cli::try_parse() {
        Ok(cli) => cli,
        Err(error) => {
            let code = match error.kind() {
                ErrorKind::DisplayHelp | ErrorKind::DisplayVersion => ExitCode::SUCCESS,
                _ => ExitCode::from(1),
            };
            error.print().expect("write clap diagnostic");
            return code;
        }
    };
    match run(cli) {
        Ok(code) => code,
        Err(error) => {
            eprintln!("sidecar-ledger: {error}");
            ExitCode::from(1)
        }
    }
}

fn run(cli: Cli) -> Result<ExitCode, Box<dyn std::error::Error>> {
    match cli.command {
        Command::Scan {
            path,
            from,
            to,
            json,
            output,
        } => {
            let manifest = scan(&ScanOptions {
                root: path,
                source: from,
                destination: to,
            })?;
            let report = if json {
                serde_json::to_string_pretty(&manifest)? + "\n"
            } else {
                render_human(&manifest)
            };
            if let Some(path) = output {
                let mut file = OpenOptions::new()
                    .write(true)
                    .create_new(true)
                    .open(&path)
                    .map_err(|error| {
                        if error.kind() == std::io::ErrorKind::AlreadyExists {
                            format!("refusing to overwrite existing report: {}", path.display())
                        } else {
                            format!("could not create report {}: {error}", path.display())
                        }
                    })?;
                file.write_all(report.as_bytes())?;
                eprintln!("Wrote {} (source archive unchanged)", path.display());
            } else {
                print!("{report}");
            }
            Ok(if manifest.needs_attention {
                ExitCode::from(2)
            } else {
                ExitCode::SUCCESS
            })
        }
        Command::Tools { json } => {
            let tools = [
                Tool::Lightroom,
                Tool::Darktable,
                Tool::Immich,
                Tool::ImmichReadonly,
                Tool::Snapseed,
                Tool::GenericXmp,
            ]
            .into_iter()
            .map(|tool| ToolDescription {
                id: tool,
                label: tool.label(),
                capability_version: tool.profile().version,
            })
            .collect::<Vec<_>>();
            if json {
                println!("{}", serde_json::to_string_pretty(&tools)?);
            } else {
                println!(
                    "BUILT-IN CAPABILITY DECLARATIONS ({})",
                    tools[0].capability_version
                );
                for tool in tools {
                    println!("{:<18} {}", tool.id, tool.label);
                }
            }
            Ok(ExitCode::SUCCESS)
        }
    }
}
