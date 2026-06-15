# Bootstrap Content

初始化时固定要求：

1. 先询问用户知识库新建地址
2. 在该地址下创建 `Obsidian`
3. 将模板源复制到新位置
4. 保留模板中的：
   - `Input`
   - `Internalization`
   - `Output`
   - 根说明文件
   - 各目录说明文件
   - 模板目录中的模板文件
   - `.obsidian` 中的稳定默认配置
5. 如果目标位置已经有一个非空的 `Obsidian` 文件夹，不与其静默合并，而是自动创建：
   - `Obsidian-新建`
   - 或 `Obsidian-新建-2`、`Obsidian-新建-3`……

## 模板源规则

- 优先使用 skill 目录内的 `template-vault`
- 如果不存在，再使用默认模板源：`C:\Users\26544\Desktop\Obsidian`
- 如果设置环境变量 `OBSIDIAN_NOTE_SYSTEM_TEMPLATE_ROOT`，则优先使用该路径
- 如果环境变量存在但路径无效，脚本直接报错

初始化逻辑以模板目录为准，而不是再用脚本硬编码重新生成说明文本。
