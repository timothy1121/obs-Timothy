---
name: obsidian-note-system
description: Use when the user wants to create, rewrite, query, optimize, archive, delete, or govern notes in Obsidian; initialize a note system; connect Codex with an Obsidian vault; classify Chinese notes by type; or standardize notes with Input, Internalization, Output, the six mother templates, and note governance rules.
---

# Obsidian Note System

## Overview

Use this skill as the main entry point for creating, querying, rewriting, organizing, initializing, and governing Chinese notes in Obsidian.

It also defines the file-based bridge between Obsidian, Codex, and this skill.

## Workflow

1. If the user wants to initialize a new note system, ask for the target path and run `scripts/bootstrap_obsidian_vault.py`.
2. If the user wants to connect Codex with an existing Obsidian vault, run `scripts/init_obsidian_codex_bridge.py`.
3. If the user wants to create, rewrite, query, update, refine, archive, or delete notes, use the chosen vault root and follow `references/bridge.md`.
4. If the user wants to create or rewrite a note, judge the note type first.
5. If the note is still raw, keep it as `素材`.
6. If the note is stable enough, choose the correct mother template and write the note in that structure.
7. Preserve `关联知识`, source meaning, and useful wiki links.

## Rules

- Trigger on note-creation-related work in Obsidian.
- Trigger on requests that connect Obsidian, Codex, and this skill.
- Treat Input, Internalization, and Output as the default top-level workflow.
- Govern formal notes with the six mother templates and keep raw material as `素材`.
- Keep one note focused on one core object.
- Do not force every note into one universal structure.
- Prefer concise Chinese, mechanism-first wording, and source-faithful content.
- During initialization, use the template vault as the source of truth.
- If the target location already contains a non-empty `Obsidian`, create a new sibling folder instead of merging into it.
- Treat the template vault as a template library, not as a content vault.
- Keep `.obsidian` limited to stable default configuration only.

## Bridge Rules

- Official vault root: `C:\Users\26544\iCloudDrive\iCloud~md~obsidian`
- Codex can read and write the whole vault when the user asks.
- Obsidian can request Codex work through the bridge folder.
- Supported actions: `query`, `create`, `update`, `refine`, `archive`, `delete`.
- Default destructive behavior is `archive`, not permanent delete.
- Permanent delete requires explicit user wording such as `delete permanently` or `永久删除`.
- Results should be written both to the original command note and to the bridge results folder when practical.

## Resources

- `references/workflow.md` for Input / Internalization / Output
- `references/templates.md` for the six mother templates and the material layer
- `references/rules.md` for writing and governance rules
- `references/type-judgment.md` for note-type classification
- `references/bootstrap.md` for the initialization template-copy rules
- `references/bridge.md` for Obsidian / Codex / skill bridge rules
- `scripts/bootstrap_obsidian_vault.py` for vault initialization
- `scripts/init_obsidian_codex_bridge.py` for creating the bridge folder in an existing vault
- `scripts/find_obsidian_note.ps1` for note lookup under a chosen vault root
