const { App, Modal, Notice, Plugin, PluginSettingTab, Setting } = require("obsidian");
const childProcess = require("child_process");

const DEFAULT_SETTINGS = {
  bridgeFolder: "_Codex",
  commandNoteName: "指令笔记.md",
  enableShellExecution: false,
  codexCommand: "",
  defaultScope: "whole-vault"
};

const ACTIONS = ["query", "create", "update", "refine", "archive", "delete"];

module.exports = class ObsTimothyBridgePlugin extends Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

    this.addRibbonIcon("terminal-square", "obs-Timothy Bridge", async () => {
      await this.openCommandNote();
    });

    this.addCommand({
      id: "open-command-note",
      name: "Open Codex command note",
      callback: async () => this.openCommandNote()
    });

    this.addCommand({
      id: "new-bridge-task",
      name: "New Codex bridge task",
      callback: async () => this.openTaskModal()
    });

    for (const action of ACTIONS) {
      this.addCommand({
        id: `new-${action}-task`,
        name: `New Codex ${action} task`,
        callback: async () => this.openTaskModal(action)
      });
    }

    this.addCommand({
      id: "open-results-folder",
      name: "Open Codex results folder",
      callback: async () => this.openResultsIndex()
    });

    this.addCommand({
      id: "run-local-codex-command",
      name: "Run configured local Codex command",
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

  async openCommandNote() {
    await this.ensureBridge();
    await this.openFile(`${this.settings.bridgeFolder}/${this.settings.commandNoteName}`);
  }

  async openResultsIndex() {
    await this.ensureBridge();
    await this.openFile(`${this.settings.bridgeFolder}/Results/00-结果索引.md`);
  }

  async openFile(path) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!file) {
      new Notice(`File not found: ${path}`);
      return;
    }
    await this.app.workspace.getLeaf(false).openFile(file);
  }

  async openTaskModal(action = "query") {
    await this.ensureBridge();
    new CodexTaskModal(this.app, this, action).open();
  }

  async createTask(action, target, request) {
    await this.ensureBridge();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeTarget = target.trim() || "未命名任务";
    const filename = `${timestamp}-${action}.md`;
    const path = `${this.settings.bridgeFolder}/Inbox/${filename}`;
    const content = [
      `# Codex Task - ${action}`,
      "",
      "## Codex Request",
      "",
      `action: ${action}`,
      `target: ${safeTarget}`,
      `scope: ${this.settings.defaultScope}`,
      "request:",
      request.trim() || "请处理这个任务。",
      "",
      "## Codex Result",
      "",
      "status: pending",
      ""
    ].join("\n");

    await this.app.vault.create(path, content);
    await this.openFile(path);
    new Notice(`Created Codex task: ${filename}`);
  }

  async runLocalCodexCommand() {
    if (!this.settings.enableShellExecution) {
      new Notice("Shell execution is disabled in obs-Timothy Bridge settings.");
      return;
    }

    const command = this.settings.codexCommand.trim();
    if (!command) {
      new Notice("No Codex command configured.");
      return;
    }

    await this.ensureBridge();
    const cwd = this.getVaultBasePath();
    const resolved = command
      .replaceAll("{vault}", cwd)
      .replaceAll("{bridge}", `${cwd}\\${this.settings.bridgeFolder}`);

    const logPath = `${this.settings.bridgeFolder}/Logs/${new Date().toISOString().replace(/[:.]/g, "-")}.md`;
    new Notice("Running configured Codex command...");

    childProcess.exec(resolved, { cwd }, async (error, stdout, stderr) => {
      const content = [
        "# Codex Command Log",
        "",
        "## Command",
        "",
        "```text",
        resolved,
        "```",
        "",
        "## Exit",
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
      new Notice(error ? "Codex command finished with errors." : "Codex command finished.");
    });
  }

  getVaultBasePath() {
    const adapter = this.app.vault.adapter;
    return adapter && adapter.basePath ? adapter.basePath : "";
  }

  getOverviewContent() {
    return `# Codex 协作说明

这个目录用于连接 Obsidian、Codex 和 \`obsidian-note-system\`。

## 入口

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

class CodexTaskModal extends Modal {
  constructor(app, plugin, action) {
    super(app);
    this.plugin = plugin;
    this.action = action;
    this.target = "";
    this.request = "";
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "New Codex bridge task" });

    new Setting(contentEl)
      .setName("Action")
      .addDropdown((dropdown) => {
        for (const action of ACTIONS) {
          dropdown.addOption(action, action);
        }
        dropdown.setValue(this.action);
        dropdown.onChange((value) => {
          this.action = value;
        });
      });

    new Setting(contentEl)
      .setName("Target")
      .addText((text) => {
        text.setPlaceholder("note title or path");
        text.onChange((value) => {
          this.target = value;
        });
      });

    new Setting(contentEl)
      .setName("Request")
      .addTextArea((text) => {
        text.setPlaceholder("Describe what Codex should do.");
        text.inputEl.rows = 6;
        text.onChange((value) => {
          this.request = value;
        });
      });

    new Setting(contentEl)
      .addButton((button) => {
        button
          .setButtonText("Create task")
          .setCta()
          .onClick(async () => {
            await this.plugin.createTask(this.action, this.target, this.request);
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
      .setName("Bridge folder")
      .setDesc("Folder used for Obsidian/Codex task exchange.")
      .addText((text) => {
        text.setValue(this.plugin.settings.bridgeFolder);
        text.onChange(async (value) => {
          this.plugin.settings.bridgeFolder = value.trim() || DEFAULT_SETTINGS.bridgeFolder;
          await this.plugin.saveData(this.plugin.settings);
        });
      });

    new Setting(containerEl)
      .setName("Default scope")
      .setDesc("Scope written into new task cards.")
      .addText((text) => {
        text.setValue(this.plugin.settings.defaultScope);
        text.onChange(async (value) => {
          this.plugin.settings.defaultScope = value.trim() || DEFAULT_SETTINGS.defaultScope;
          await this.plugin.saveData(this.plugin.settings);
        });
      });

    new Setting(containerEl)
      .setName("Enable shell execution")
      .setDesc("Allows this plugin to run the configured local command. Keep disabled unless you understand the risk.")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.enableShellExecution);
        toggle.onChange(async (value) => {
          this.plugin.settings.enableShellExecution = value;
          await this.plugin.saveData(this.plugin.settings);
        });
      });

    new Setting(containerEl)
      .setName("Codex command")
      .setDesc("Local command to run. Supports {vault} and {bridge} placeholders.")
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
