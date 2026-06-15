# Obsidian / Codex / Skill Bridge

This bridge lets Obsidian, Codex, and `obsidian-note-system` cooperate through a file-based protocol.

## Official Vault

Default vault root:

```text
C:\Users\26544\iCloudDrive\iCloud~md~obsidian
```

The user has allowed whole-vault read and write operations.

## Bridge Folder

The bridge lives inside the vault:

```text
_Codex/
├── 00-Codex协作说明.md
├── 指令笔记.md
├── Inbox/
├── Results/
├── Archive/
└── Logs/
```

## Entrypoints

Use both entrypoints:

- `指令笔记.md`: one-off commands
- `Inbox/`: task cards for ongoing work

## Result Writing

Write results in both places when practical:

- append or update the original command note
- create a result note in `_Codex/Results/`

## Supported Actions

### query

Search the vault and answer with matching notes, paths, and short summaries.

### create

Create a new note using the correct note type and template.

### update

Modify an existing note while preserving source meaning, useful links, and note structure.

### refine

Optimize an existing note according to the six mother templates and governance rules.

### archive

Move a note to `_Codex/Archive/` instead of deleting it. This is the default destructive operation.

### delete

Permanently delete a note only when the user explicitly asks for permanent deletion.

Accepted explicit wording includes:

- `delete permanently`
- `永久删除`
- `彻底删除`

## Command Format

Use this format in `指令笔记.md` or an Inbox task:

```md
## Codex Request

action: query | create | update | refine | archive | delete
target: note title or path
scope: optional folder or whole-vault
request: detailed instruction

## Codex Result

status: pending
```

## Safety Rules

- Read operations can scan the whole vault.
- Write operations can affect the whole vault because the user has approved whole-vault access.
- Archive before delete unless the user explicitly asks for permanent deletion.
- Preserve backlinks and useful wiki links.
- Avoid generic template filler.
- For unclear destructive requests, ask before acting.
