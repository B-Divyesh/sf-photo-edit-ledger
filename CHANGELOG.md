# Changelog

All notable changes follow Keep a Changelog; versions follow Semantic Versioning.

## [Unreleased]

### Fixed

- Classify unrecognized XMP namespaces as unknown without exposing opaque
  metadata values, with the documented attention exit status. Do not exempt an
  otherwise undeclared vocabulary merely because it uses an Adobe/IPTC-style
  registry URL.
- Precache the final static shell so offline reloads retain module, stylesheet,
  and self-hosted font assets.
- Make Chromium installation explicit before browser accessibility checks.

## [0.1.0] - 2026-08-27

### Added

- Read-only recursive image and XMP inventory.
- Built-in handoff capability profiles for six common workflow boundaries.
- Human and versioned JSON reports with meaningful exit codes.
- Static documentation, live route demo, privacy, terms, and optional paid presets.
