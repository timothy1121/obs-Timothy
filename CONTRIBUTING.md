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
- `init_obsidian_codex_bridge.py` 能在指定 vault 中创建 `_Codex` 协作目录

## Plugin rules

如果改动 `plugins/obs-timothy-bridge`，请至少确认：

- `main.js` 能通过 JavaScript 语法检查
- `manifest.json` 可以被 Obsidian 识别
- shell execution 默认关闭
- 插件默认只创建任务，不默认执行危险操作

## Bridge rules

如果改动 Obsidian / Codex 桥接协议，请保留这些约束：

- 支持 `指令笔记.md` 和 `Inbox/` 两个入口
- 支持 `Results/` 回写结果
- 默认归档，不默认永久删除
- 永久删除必须有明确指令
- 不破坏全库读写能力

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
