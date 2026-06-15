from __future__ import annotations

import argparse
import os
import shutil
from pathlib import Path


DEFAULT_TEMPLATE_ROOT = Path(r"C:\Users\26544\Desktop\Obsidian")
ENV_TEMPLATE_ROOT = "OBSIDIAN_NOTE_SYSTEM_TEMPLATE_ROOT"
SKILL_TEMPLATE_ROOT = Path(__file__).resolve().parents[1] / "template-vault"


def copy_template(source: Path, destination: Path) -> None:
    for item in source.iterdir():
        target = destination / item.name
        if item.is_dir():
            shutil.copytree(item, target)
        else:
            shutil.copy2(item, target)


def is_non_empty_directory(path: Path) -> bool:
    return path.exists() and path.is_dir() and any(path.iterdir())


def resolve_template_root() -> Path:
    env_value = os.environ.get(ENV_TEMPLATE_ROOT, "").strip()
    if env_value:
        candidate = Path(env_value).expanduser()
        if candidate.exists():
            return candidate
        raise FileNotFoundError(f"Template root from {ENV_TEMPLATE_ROOT} not found: {candidate}")

    if SKILL_TEMPLATE_ROOT.exists():
        return SKILL_TEMPLATE_ROOT

    if DEFAULT_TEMPLATE_ROOT.exists():
        return DEFAULT_TEMPLATE_ROOT

    raise FileNotFoundError(
        f"Template root not found. Checked {SKILL_TEMPLATE_ROOT} and {DEFAULT_TEMPLATE_ROOT}. "
        f"Set {ENV_TEMPLATE_ROOT} to override the template path."
    )


def resolve_target_root(base: Path) -> Path:
    primary = base / "Obsidian"
    if not primary.exists():
        return primary
    if not is_non_empty_directory(primary):
        return primary

    index = 1
    while True:
        suffix = "Obsidian-新建" if index == 1 else f"Obsidian-新建-{index}"
        candidate = base / suffix
        if not candidate.exists():
            return candidate
        if not is_non_empty_directory(candidate):
            return candidate
        index += 1


def main() -> None:
    parser = argparse.ArgumentParser(description="Bootstrap an Obsidian note vault from the desktop template.")
    parser.add_argument("target", help="Target directory that will contain the Obsidian folder")
    args = parser.parse_args()

    template_root = resolve_template_root()
    base = Path(args.target).expanduser()
    base.mkdir(parents=True, exist_ok=True)
    root = resolve_target_root(base)
    root.mkdir(parents=True, exist_ok=True)

    copy_template(template_root, root)
    print(root)


if __name__ == "__main__":
    main()
