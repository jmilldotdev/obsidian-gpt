import GPTPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

class GPTSettingTab extends PluginSettingTab {
  plugin: GPTPlugin;

  constructor(app: App, plugin: GPTPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Obsidian GPT settings" });

    containerEl.createEl("h3", { text: "API Keys" });

    new Setting(containerEl)
      .setName("Exafunction API Key")
      .setDesc("Enter your Exafunction API Key")
      .addText((text) =>
        text
          .setPlaceholder("API Key")
          .setValue(this.plugin.settings.gptJApiKey)
          .onChange(async (value) => {
            this.plugin.settings.gptJApiKey = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("AI21 API Key")
      .setDesc("Enter your AI21 API Key")
      .addText((text) =>
        text
          .setPlaceholder("API Key")
          .setValue(this.plugin.settings.ai21ApiKey)
          .onChange(async (value) => {
            this.plugin.settings.ai21ApiKey = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", { text: "Completion & Prompt Tags" });

    new Setting(containerEl)
      .setName("Tag Completions?")
      .setDesc(
        "Optionally put a tag around text which was generated via completion"
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.tagCompletions)
          .onChange(async (value) => {
            this.plugin.settings.tagCompletions = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl).setName("Opening Completion Tag").addText((text) =>
      text
        .setPlaceholder("<Completion>")
        .setValue(this.plugin.settings.tagCompletionsHandlerTags.openingTag)
        .onChange(async (value) => {
          this.plugin.settings.tagCompletionsHandlerTags.openingTag = value;
          await this.plugin.saveSettings();
        })
    );

    new Setting(containerEl).setName("Closing Completion Tag").addText((text) =>
      text
        .setPlaceholder("</Completion>")
        .setValue(this.plugin.settings.tagCompletionsHandlerTags.closingTag)
        .onChange(async (value) => {
          this.plugin.settings.tagCompletionsHandlerTags.closingTag = value;
          await this.plugin.saveSettings();
        })
    );

    new Setting(containerEl)
      .setName("Tag Prompts?")
      .setDesc("Optionally put a tag around text which was used as prompt")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.tagPrompts)
          .onChange(async (value) => {
            this.plugin.settings.tagPrompts = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl).setName("Opening Prompt Tag").addText((text) =>
      text
        .setPlaceholder("<Prompt>")
        .setValue(this.plugin.settings.tagPromptsHandlerTags.openingTag)
        .onChange(async (value) => {
          this.plugin.settings.tagPromptsHandlerTags.openingTag = value;
          await this.plugin.saveSettings();
        })
    );

    new Setting(containerEl).setName("Closing Prompt Tag").addText((text) =>
      text
        .setPlaceholder("</Prompt>")
        .setValue(this.plugin.settings.tagPromptsHandlerTags.closingTag)
        .onChange(async (value) => {
          this.plugin.settings.tagPromptsHandlerTags.closingTag = value;
          await this.plugin.saveSettings();
        })
    );
  }
}

export default GPTSettingTab;
