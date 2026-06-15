# obs-Timothy

一个面向 Obsidian 的中文原子笔记开源方案，包含两部分：

- `obsidian-note-system`：用于 Codex 的技能目录
- `template-vault`：用于初始化知识库的母版库

核心目标：

- 用 `Input / Internalization / Output` 管理知识流转
- 用 6 类母模板治理正式笔记
- 把 `素材` 保留为非正式层
- 用稳定母版库初始化新的 Obsidian 知识库

## 目录结构

```text
obs-Timothy/
└── skills/
    └── obsidian-note-system/
        ├── SKILL.md
        ├── agents/
        ├── references/
        ├── scripts/
        └── template-vault/
```

## 包含内容

### 1. Skill

`skills/obsidian-note-system/`

用于：

- 初始化 Obsidian 知识库
- 创建或改写中文笔记
- 按 6 类母模板分类
- 保持 `Input / Internalization / Output` 一致

### 2. Template Vault

`skills/obsidian-note-system/template-vault/`

包含：

- `00-原子笔记总纲`
- `01-母版使用说明`
- `02-快速开始`
- `Input`
- `Internalization`
- `Output`
- 收敛后的 `.obsidian` 默认配置

## 笔记规则

正式层使用 6 类母模板：

1. 对象类
2. 机制类
3. 结构类
4. 执行类
5. 证据类
6. 表达类

非正式层：

7. 素材

核心规则：

- 先判断知识类型，再决定结构
- 一张卡只解决一个核心对象
- 不强迫所有笔记套同一个结构
- 保留 `关联知识`
- 中文简洁
- 机制优先
- 忠实原意

## 安装方式

把 `skills/obsidian-note-system` 复制到你的 Codex skills 目录中，例如：

```text
~/.codex/skills/obsidian-note-system
```

## 使用方式

### 初始化知识库

运行：

```text
python scripts/bootstrap_obsidian_vault.py <target>
```

脚本会在目标目录下创建：

- `Obsidian`
- 或在已存在非空 `Obsidian` 时创建 `Obsidian-新建`

### 模板源优先级

初始化脚本按下面顺序查找模板源：

1. 环境变量 `OBSIDIAN_NOTE_SYSTEM_TEMPLATE_ROOT`
2. skill 目录内的 `template-vault`
3. 本机默认目录 `C:\Users\26544\Desktop\Obsidian`

### 搜索笔记

`find_obsidian_note.ps1` 支持：

- 显式传入 `-Root`
- 或用环境变量 `OBSIDIAN_NOTE_SYSTEM_VAULT_ROOT`

示例：

```text
powershell -File scripts/find_obsidian_note.ps1 -Title "系统思维" -Root "D:\my-vault"
```

## 适用场景

- 中文原子笔记治理
- Obsidian 母版库初始化
- 把素材整理成结构化正式卡
- 在 Codex 中复用同一套笔记工作流

## 开源协议

MIT License
