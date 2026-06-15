const { Modal, Notice, Plugin, PluginSettingTab, Setting } = require("obsidian");
const childProcess = require("child_process");

const DEFAULT_SETTINGS = {
  bridgeFolder: "_Codex",
  commandNoteName: "指令笔记.md",
  enableShellExecution: false,
  codexCommand: "",
  defaultScope: "whole-vault"
};

module.exports = class ObsTimothyBridgePlugin extends Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

    this.addRibbonIcon("message-square", "问 Codex", async () => {
      await this.askCodex();
    });

    this.addCommand({
      id: "ask-codex",
      name: "Codex: 问一下",
      callback: async () => this.askCodex()
    });

    this.addCommand({
      id: "refine-current-note",
      name: "Codex: 优化当前笔记",
      callback: async () => this.createCurrentNoteTask(
        "refine",
        "优化这篇笔记，保持原意，按合适的知识类型和模板整理，保留有价值的双链。"
      )
    });

    this.addCommand({
      id: "structure-current-note",
      name: "Codex: 整理当前笔记结构",
      callback: async () => this.createCurrentNoteTask(
        "update",
        "按知识类型重新整理这篇笔记结构，去掉空泛内容，保留原意和关键信息。"
      )
    });

    this.addCommand({
      id: "link-current-note",
      name: "Codex: 补充当前笔记关联",
      callback: async () => this.createCurrentNoteTask(
        "update",
        "为这篇笔记补充合理的关联知识和 Obsidian 双链，避免生硬堆砌。"
      )
    });

    this.addCommand({
      id: "open-latest-result",
      name: "Codex: 查看最新结果",
      callback: async () => this.openLatestResult()
    });

    this.addCommand({
      id: "run-local-codex-command",
      name: "Codex: 执行本机命令",
      callback: async () => this.runLocalCodexCommand()
    });

    this.addSettingTab(new ObsTimothyBridgeSettingTab(this.app, this));
    await this.ensureBridge();
  }

  async ensureBridge() {
    const root = this.settings.bridgeFolder;
    await this.ensureFolder(root);
    await this.ensureFolder(`${root}/Inbox`);
    await this.ensureFolder(`${root}/Results`);
    await this.ensureFolder(`${root}/Archive`);
    await this.ensureFolder(`${root}/Logs`);

    await this.writeIfMissing(`${root}/00-Codex协作说明.md`, this.getOverviewContent());
    await this.writeIfMissing(`${root}/${this.settings.commandNoteName}`, this.getCommandNoteContent());
    await this.writeIfMissing(`${root}/Results/00-结果索引.md`, "# Codex 结果索引\n\n这里汇总 Codex 执行结果。\n");
  }

  async ensureFolder(path) {
    if (!(await this.app.vault.adapter.exists(path))) {
      await this.app.vault.createFolder(path);
    }
  }

  async writeIfMissing(path, content) {
    if (!(await this.app.vault.adapter.exists(path))) {
      await this.app.vault.create(path, content);
    }
  }

  async askCodex() {
    await this.ensureBridge();
    new SimpleAskModal(this.app, async (question) => {
      await this.createTask("query", "全库", question || "请查询知识库。");
    }).open();
  }

  async createCurrentNoteTask(action, request) {
    await this.ensureBridge();
    const file = this.app.workspace.getActiveFile();
    if (!file || file.extension !== "md") {
      new Notice("请先打开一篇 Markdown 笔记。");
      return;
    }

    await this.createTask(action, file.path, request);
  }

  async createTask(action, target, request) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeTitle = this.toSafeFilename(target || "任务");
    const filename = `${timestamp}-${action}-${safeTitle}.md`;
    const path = `${this.settings.bridgeFolder}/Inbox/${filename}`;
    const content = [
      `# Codex 任务 - ${action}`,
      "",
      "## Codex Request",
      "",
      `action: ${action}`,
      `target: ${target || "全库"}`,
      `scope: ${this.settings.defaultScope}`,
      "request:",
      request || "请处理这个任务。",
      "",
      "## Codex Result",
      "",
      "status: pending",
      ""
    ].join("\n");

    await this.app.vault.create(path, content);
    await this.openFile(path);
    new Notice("已创建 Codex 任务。回到 Codex 后说：处理 Obsidian 任务。");
  }

  async openLatestResult() {
    await this.ensureBridge();
    const folder = this.app.vault.getAbstractFileByPath(`${this.settings.bridgeFolder}/Results`);
    if (!folder || !folder.children || folder.children.length === 0) {
      await this.openFile(`${this.settings.bridgeFolder}/Results/00-结果索引.md`);
      return;
    }

    const latest = folder.children
      .filter((child) => child.extension === "md")
      .sort((a, b) => b.stat.mtime - a.stat.mtime)[0];

    if (latest) {
      await this.app.workspace.getLeaf(false).openFile(latest);
    } else {
      await this.openFile(`${this.settings.bridgeFolder}/Results/00-结果索引.md`);
    }
  }

  async openFile(path) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!file) {
      new Notice(`找不到文件：${path}`);
      return;
    }
    await this.app.workspace.getLeaf(false).openFile(file);
  }

  async runLocalCodexCommand() {
    if (!this.settings.enableShellExecution) {
      new Notice("本机命令执行已关闭。请先在插件设置里开启。");
      return;
    }

    const command = this.settings.codexCommand.trim();
    if (!command) {
      new Notice("未配置 Codex 命令。");
      return;
    }

    await this.ensureBridge();
    const cwd = this.getVaultBasePath();
    const resolved = command
      .replaceAll("{vault}", cwd)
      .replaceAll("{bridge}", `${cwd}\\${this.settings.bridgeFolder}`);

    const logPath = `${this.settings.bridgeFolder}/Logs/${new Date().toISOString().replace(/[:.]/g, "-")}.md`;
    new Notice("正在执行本机 Codex 命令。");

    childProcess.exec(resolved, { cwd }, async (error, stdout, stderr) => {
      const content = [
        "# Codex 命令日志",
        "",
        "## 命令",
        "",
        "```text",
        resolved,
        "```",
        "",
        "## 状态",
        "",
        error ? `error: ${error.message}` : "ok",
        "",
        "## stdout",
        "",
        "```text",
        stdout || "",
        "```",
        "",
        "## stderr",
        "",
        "```text",
        stderr || "",
        "```",
        ""
      ].join("\n");

      await this.app.vault.create(logPath, content);
      new Notice(error ? "Codex 命令执行完成，但有错误。" : "Codex 命令执行完成。");
    });
  }

  getVaultBasePath() {
    const adapter = this.app.vault.adapter;
    return adapter && adapter.basePath ? adapter.basePath : "";
  }

  toSafeFilename(value) {
    return value
      .replace(/[\\/:*?"<>|#^\[\]]/g, "-")
      .replace(/\s+/g, "-")
      .slice(0, 40) || "任务";
  }

  getOverviewContent() {
    return `# Codex 协作说明

这个目录用于连接 Obsidian、Codex 和 \`obsidian-note-system\`。

## 常用方式

- 使用命令 \`Codex: 问一下\` 查询知识库
- 打开一篇笔记后，使用 \`Codex: 优化当前笔记\`
- 打开一篇笔记后，使用 \`Codex: 整理当前笔记结构\`
- 打开一篇笔记后，使用 \`Codex: 补充当前笔记关联\`
- 使用 \`Codex: 查看最新结果\` 查看结果

## 目录

- [[指令笔记]]：单次请求
- [[Inbox]]：持续任务
- [[Results]]：Codex 执行结果
- [[Archive]]：默认归档区
- [[Logs]]：运行记录

## 删除规则

默认只归档，不永久删除。

只有明确写出 \`永久删除\`、\`彻底删除\` 或 \`delete permanently\` 时，才执行永久删除。
`;
  }

  getCommandNoteContent() {
    return `# 指令笔记

在这里写给 Codex 的单次请求。

## Codex Request

action: query
target:
scope: ${this.settings.defaultScope}
request:

## Codex Result

status: pending
`;
  }
};

class SimpleAskModal extends Modal {
  constructor(app, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
    this.question = "";
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "问 Codex" });

    new Setting(contentEl)
      .setName("问题")
      .setDesc("输入一句话即可。")
      .addTextArea((text) => {
        text.setPlaceholder("例如：帮我找系统思维相关笔记，并总结关联。");
        text.inputEl.rows = 5;
        text.onChange((value) => {
          this.question = value;
        });
      });

    new Setting(contentEl)
      .addButton((button) => {
        button
          .setButtonText("创建任务")
          .setCta()
          .onClick(async () => {
            await this.onSubmit(this.question.trim());
            this.close();
          });
      });
  }

  onClose() {
    this.contentEl.empty();
  }
}

class ObsTimothyBridgeSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "obs-Timothy Bridge" });

    new Setting(containerEl)
      .setName("桥接目录")
      .setDesc("用于 Obsidian 与 Codex 交换任务的目录。")
      .addText((text) => {
        text.setValue(this.plugin.settings.bridgeFolder);
        text.onChange(async (value) => {
          this.plugin.settings.bridgeFolder = value.trim() || DEFAULT_SETTINGS.bridgeFolder;
          await this.plugin.saveData(this.plugin.settings);
        });
      });

    new Setting(containerEl)
      .setName("默认范围")
      .setDesc("写入任务卡的默认范围。")
      .addText((text) => {
        text.setValue(this.plugin.settings.defaultScope);
        text.onChange(async (value) => {
          this.plugin.settings.defaultScope = value.trim() || DEFAULT_SETTINGS.defaultScope;
          await this.plugin.saveData(this.plugin.settings);
        });
      });

    new Setting(containerEl)
      .setName("允许执行本机命令")
      .setDesc("允许插件执行配置的本机命令。默认关闭。")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.enableShellExecution);
        toggle.onChange(async (value) => {
          this.plugin.settings.enableShellExecution = value;
          await this.plugin.saveData(this.plugin.settings);
        });
      });

    new Setting(containerEl)
      .setName("Codex 命令")
      .setDesc("支持 {vault} 和 {bridge} 占位符。")
      .addTextArea((text) => {
        text.setValue(this.plugin.settings.codexCommand);
        text.inputEl.rows = 4;
        text.onChange(async (value) => {
          this.plugin.settings.codexCommand = value;
          await this.plugin.saveData(this.plugin.settings);
        });
      });
  }
}
