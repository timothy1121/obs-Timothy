from __future__ import annotations

import argparse
import sys
from pathlib import Path


DEFAULT_VAULT_ROOT = Path(r"C:\Users\26544\iCloudDrive\iCloud~md~obsidian")
DEFAULT_NOTE_DIR = DEFAULT_VAULT_ROOT / "Obsidian" / "原子卡片-要素"
INVALID_FILENAME_CHARS = '<>:"/\\|?*'


def safe_filename(title: str) -> str:
    name = title.strip()
    for char in INVALID_FILENAME_CHARS:
        name = name.replace(char, "-")
    name = name.strip().rstrip(".")
    if not name:
        raise ValueError("Title cannot be empty after filename sanitization.")
    return f"{name}.md"


def resolve_content(args: argparse.Namespace) -> str:
    if args.content_file:
        return Path(args.content_file).expanduser().read_text(encoding="utf-8")
    if args.content:
        return args.content
    data = sys.stdin.read()
    if data.strip():
        return data
    raise ValueError("No note content provided. Use --content, --content-file, or stdin.")


def resolve_destination(directory: Path, filename: str, if_exists: str) -> Path:
    target = directory / filename
    if not target.exists() or if_exists == "overwrite":
        return target
    if if_exists == "fail":
        raise FileExistsError(f"Note already exists: {target}")
    if if_exists == "skip":
        return target

    stem = target.stem
    suffix = target.suffix
    index = 2
    while True:
        candidate = directory / f"{stem} {index}{suffix}"
        if not candidate.exists():
            return candidate
        index += 1


def main() -> None:
    parser = argparse.ArgumentParser(description="Write a markdown note into an Obsidian folder.")
    parser.add_argument("--title", required=True, help="Note title. Used as the markdown filename.")
    parser.add_argument("--content", default="", help="Markdown content to write.")
    parser.add_argument("--content-file", default="", help="Path to a UTF-8 markdown/text file.")
    parser.add_argument("--directory", default=str(DEFAULT_NOTE_DIR), help="Target Obsidian folder.")
    parser.add_argument(
        "--if-exists",
        choices=["suffix", "overwrite", "fail", "skip"],
        default="suffix",
        help="Behavior when the target note already exists.",
    )
    args = parser.parse_args()

    directory = Path(args.directory).expanduser()
    directory.mkdir(parents=True, exist_ok=True)

    filename = safe_filename(args.title)
    content = resolve_content(args)
    if not content.endswith("\n"):
        content += "\n"

    target = resolve_destination(directory, filename, args.if_exists)
    if target.exists() and args.if_exists == "skip":
        print(target)
        return

    target.write_text(content, encoding="utf-8")
    print(target)


if __name__ == "__main__":
    main()
