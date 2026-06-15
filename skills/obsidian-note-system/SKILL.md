---
name: obsidian-note-system
description: Use when the user wants to create or rewrite notes in Obsidian, initialize a new note system, classify Chinese notes by type, apply atomic note templates, turn raw material into structured notes, or standardize note structure with Input, Internalization, Output, the six mother templates, and note governance rules.
---

# Obsidian Note System

## Overview

Use this skill as the main entry point for creating, rewriting, organizing, and initializing Chinese notes in Obsidian.

## Workflow

1. If the user wants to initialize a new note system, ask for the target path and run `scripts/bootstrap_obsidian_vault.py`.
2. If the user wants to create or rewrite notes, judge the note type first.
3. If the note is still raw, keep it as `素材`.
4. If the note is stable enough, choose the correct mother template and write the note in that structure.
5. Preserve `关联知识`, source meaning, and useful wiki links.

## Rules

- Trigger on note-creation-related work in Obsidian.
- Treat Input, Internalization, and Output as the default top-level workflow.
- Govern formal notes with the six mother templates and keep raw material as `素材`.
- Keep one note focused on one core object.
- Do not force every note into one universal structure.
- Prefer concise Chinese, mechanism-first wording, and source-faithful content.
- Do not generate a full template pack during initialization unless the user explicitly asks.
- During initialization, use the desktop template vault as the source of truth.
- If the target location already contains a non-empty `Obsidian`, create a new sibling folder instead of merging into it.
- Treat the desktop template vault as a template library, not as a content vault.
- Keep `.obsidian` limited to stable default configuration only.

## Resources

- `references/workflow.md` for Input / Internalization / Output
- `references/templates.md` for the six mother templates and the material layer
- `references/rules.md` for writing and governance rules
- `references/type-judgment.md` for note-type classification
- `references/bootstrap.md` for the initialization template-copy rules
- `scripts/bootstrap_obsidian_vault.py` for vault initialization
- `scripts/find_obsidian_note.ps1` for note lookup under a chosen vault root
