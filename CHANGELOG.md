# Changelog

All notable changes to this project will be documented in this file.

## v0.2.0 - Obsidian plugin bridge

### Added

- `obs-timothy-bridge` Obsidian desktop plugin
- ribbon entry for opening the Codex command note
- commands for creating `query`, `create`, `update`, `refine`, `archive`, and `delete` bridge tasks
- command for opening the results index
- optional local shell command execution
- plugin settings for bridge folder, default scope, shell execution, and local command

### Safety

- shell execution is disabled by default
- local command must be explicitly configured
- destructive note handling remains governed by the bridge protocol

## v0.1.0 - Initial open-source release

### Added

- `obsidian-note-system` main skill
- `template-vault` mother vault for Obsidian initialization
- file-based Obsidian / Codex / skill bridge protocol
- `init_obsidian_codex_bridge.py` for creating the `_Codex` bridge folder
- `Input / Internalization / Output` workflow definition
- six mother templates and `素材` layer
- `bootstrap_obsidian_vault.py` for vault initialization
- `find_obsidian_note.ps1` for note lookup inside a chosen vault root
- stable `.obsidian` default configuration

### Normalized

- note governance rules
- template-vault homepage and quick-start structure
- compatibility guidance toward `obsidian-note-system`

### Open-source packaging

- repository README
- MIT license
- basic git ignore
