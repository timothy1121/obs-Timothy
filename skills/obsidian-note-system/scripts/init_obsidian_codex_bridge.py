from __future__ import annotations

import argparse
from pathlib import Path


DEFAULT_VAULT_ROOT = Path(r"C:\Users\26544\iCloudDrive\iCloud~md~obsidian")


OVERVIEW = """# Codex 协作说明

这个目录用于连接 Obsidian、Codex 和 `obsidian-note-system`。

## 入口

- [[指令笔记]]：单次请求
- [[Inbox]]：持续任务
- [[Results]]：Codex 执行结果
- [[Archive]]：默认归档区
- [[Logs]]：运行记录

## 支持动作

- `query`：查询知识库
- `create`：新增笔记
- `update`：修改笔记
- `refine`：优化笔记
- `archive`：归档笔记
- `delete`：永久删除笔记

## 删除规则

默认只归档，不永久删除。

只有明确写出 `永久删除`、`彻底删除` 或 `delete permanently` 时，才执行永久删除。
"""


COMMAND_NOTE = """# 指令笔记

在这里写给 Codex 的单次请求。

## Codex Request

action: query
target:
scope: whole-vault
request:

## Codex Result

status: pending
"""


def write_if_missing(path: Path, content: str) -> None:
    if not path.exists():
        path.write_text(content, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Initialize the Obsidian/Codex bridge in a vault.")
    parser.add_argument("vault", nargs="?", default=str(DEFAULT_VAULT_ROOT), help="Obsidian vault root")
    args = parser.parse_args()

    vault = Path(args.vault).expanduser()
    if not vault.exists():
        raise FileNotFoundError(f"Vault root not found: {vault}")
    if not vault.is_dir():
        raise NotADirectoryError(f"Vault root is not a directory: {vault}")

    bridge = vault / "_Codex"
    bridge.mkdir(exist_ok=True)

    for name in ["Inbox", "Results", "Archive", "Logs"]:
        (bridge / name).mkdir(exist_ok=True)

    write_if_missing(bridge / "00-Codex协作说明.md", OVERVIEW)
    write_if_missing(bridge / "指令笔记.md", COMMAND_NOTE)

    print(bridge)


if __name__ == "__main__":
    main()
