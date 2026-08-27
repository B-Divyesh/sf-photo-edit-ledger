use std::process::Command;

fn binary() -> Command {
    Command::new(env!("CARGO_BIN_EXE_sidecar-ledger"))
}

#[test]
fn documented_json_route_is_machine_readable_and_signals_risk() {
    let output = binary()
        .args([
            "scan",
            "tests/fixtures/catalog",
            "--from",
            "lightroom",
            "--to",
            "immich",
            "--json",
        ])
        .output()
        .unwrap();
    assert_eq!(output.status.code(), Some(2));
    let json: serde_json::Value = serde_json::from_slice(&output.stdout).unwrap();
    assert_eq!(json["schema_version"], "1");
    assert_eq!(json["counts"]["images"], 2);
    assert_eq!(json["counts"]["paired"], 1);
    assert_eq!(json["source_files_changed"], false);
    assert!(
        json["assessments"]
            .as_array()
            .unwrap()
            .iter()
            .any(|item| item["field"] == "adjustments" && item["capability"] == "lossy")
    );
}

#[test]
fn tools_command_is_successful_json() {
    let output = binary().args(["tools", "--json"]).output().unwrap();
    assert!(output.status.success());
    let json: serde_json::Value = serde_json::from_slice(&output.stdout).unwrap();
    assert_eq!(json.as_array().unwrap().len(), 6);
}

#[test]
fn missing_folder_is_a_clear_error() {
    let output = binary()
        .args([
            "scan",
            "tests/fixtures/does-not-exist",
            "--from",
            "lightroom",
            "--to",
            "immich",
        ])
        .output()
        .unwrap();
    assert_eq!(output.status.code(), Some(1));
    assert!(String::from_utf8_lossy(&output.stderr).contains("No such file"));
}

#[test]
fn output_never_overwrites_an_existing_report() {
    let dir = tempfile::tempdir().unwrap();
    let report = dir.path().join("handoff.json");
    std::fs::write(&report, "keep me").unwrap();
    let output = binary()
        .args([
            "scan",
            "tests/fixtures/catalog",
            "--from",
            "lightroom",
            "--to",
            "immich",
            "--json",
            "--output",
            report.to_str().unwrap(),
        ])
        .output()
        .unwrap();
    assert_eq!(output.status.code(), Some(1));
    assert_eq!(std::fs::read_to_string(report).unwrap(), "keep me");
}
