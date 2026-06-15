# Contributing

Thanks for contributing to `obs-Timothy`.

## Contribution scope

欢迎改进这些内容：

- `obsidian-note-system` 的说明、规则和脚本
- `template-vault` 的稳定结构
- 初始化流程
- 模板可用性
- 文档清晰度

不建议随意改动这些内容：

- 把母版库变成具体内容库
- 用一个通用模板替代全部笔记类型
- 删除 `Input / Internalization / Output` 主工作流
- 删除 `素材` 这一层

## Governance principles

提交改动时，请尽量保持这些原则：

- 先判断知识类型，再决定结构
- 一张卡只解决一个核心对象
- 中文简洁
- 机制优先
- 忠实原意
- 保留 `关联知识`
- 素材不强行升格
- 母版库只保留稳定结构、说明页和模板页

## Template rules

正式层保持 6 类母模板：

1. 对象类
2. 机制类
3. 结构类
4. 执行类
5. 证据类
6. 表达类

非正式层：

7. 素材

如果改动模板，请优先保证：

- 类型判断更清晰
- 结构更稳定
- 不引入空泛模板话术
- 不破坏已有母版库的初始化用途

## Scripts

如果改动脚本，请至少确认：

- `bootstrap_obsidian_vault.py` 能从仓库自带 `template-vault` 初始化成功
- `find_obsidian_note.ps1` 能在指定 `-Root` 下正常搜索

## Commit guidance

建议提交信息简短、直接，例如：

- `Refine README`
- `Fix bootstrap fallback`
- `Adjust template-vault structure`

## Pull requests

提交 PR 时，建议说明：

- 改了什么
- 为什么改
- 是否影响模板结构
- 是否影响初始化脚本
