import SettingsItemView from "SettingsItemView";
import { Editor, Notice, Plugin, WorkspaceLeaf } from "obsidian";
import {
  getAI21Completion,
  getGPT3Completion,
  getGPTJCompletion,
} from "./handlers";
import {
  VIEW_TYPE_MODEL_SETTINGS,
  GPTPluginSettings,
  DEFAULT_SETTINGS,
  SupportedModels,
  CurrentLineContents,
} from "./types";
import GPTSettingTab from "./SettingsTab";

export default class GPTPlugin extends Plugin {
  settings: GPTPluginSettings;
  private view: SettingsItemView;

  getSelectedText(editor: Editor) {
    let selectedText: string;

    if (editor.somethingSelected()) {
      selectedText = editor.getSelection().trim();
      return selectedText;
    }
  }

  getCurrentLineContents(editor: Editor) {
    const lineNumber = editor.getCursor().line;
    const lineContents = editor.getLine(lineNumber);
    const currentLineContents: CurrentLineContents = {
      lineNumber,
      lineContents,
    };
    return currentLineContents;
  }

  async getCompletion(selection: string): Promise<string | null> {
    const { modelSettings } = this.settings;
    let completion: string;
    const notice = new Notice(
      `Getting ${this.settings.activeModel} Completion`,
      10000
    );
    if (this.settings.activeModel === SupportedModels.GPTJ) {
      completion = await getGPTJCompletion(
        this.settings.gptJApiKey,
        selection,
        modelSettings.gptJSettings
      );
    } else if (this.settings.activeModel === SupportedModels.AI21) {
      completion = await getAI21Completion(
        this.settings.ai21ApiKey,
        selection,
        modelSettings.ai21Settings
      );
    } else if (this.settings.activeModel === SupportedModels.GPT3) {
      completion = await getGPT3Completion(
        this.settings.gpt3ApiKey,
        selection,
        modelSettings.gpt3Settings
      );
    }
    notice.hide();
    return completion;
  }

  handleGetCompletionError() {
    new Notice(
      "Error getting completion. Check your internet settings or API key."
    );
  }

  formatCompletion(prompt: string, completion: string) {
    const {
      tagCompletions,
      tagCompletionsHandlerTags,
      tagPrompts,
      tagPromptsHandlerTags,
    } = this.settings;

    if (tagCompletions) {
      completion = `${tagCompletionsHandlerTags.openingTag}${completion}${tagCompletionsHandlerTags.closingTag}`;
    }

    if (tagPrompts) {
      prompt = `${tagPromptsHandlerTags.openingTag}${prompt}${tagPromptsHandlerTags.closingTag}`;
    }

    return prompt + completion;
  }

  async getCompletionHandler(editor: Editor) {
    const selection: string = this.getSelectedText(editor);
    if (selection) {
      const completion = await this.getCompletion(selection);
      if (!completion) {
        this.handleGetCompletionError();
        return;
      }
      editor.replaceSelection(this.formatCompletion(selection, completion));
      return;
    }
    const currentLineContents = this.getCurrentLineContents(editor);
    if (currentLineContents) {
      const completion = await this.getCompletion(
        currentLineContents.lineContents
      );
      if (!completion) {
        this.handleGetCompletionError();
        return;
      }
      const formatted = this.formatCompletion(
        currentLineContents.lineContents,
        completion
      );
      editor.setLine(currentLineContents.lineNumber, formatted);
      return;
    }
  }

  initLeaf(): void {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE_MODEL_SETTINGS).length) {
      return;
    }
    this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE_MODEL_SETTINGS,
    });
  }

  async onload() {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_MODEL_SETTINGS,
      (leaf: WorkspaceLeaf) =>
        (this.view = new SettingsItemView(leaf, this.settings, this))
    );

    this.initLeaf();

    this.addCommand({
      id: "get-completion",
      name: "Get Completion",
      editorCallback: (editor: Editor) => this.getCompletionHandler(editor),
    });

    this.addCommand({
      id: "show-model-settings",
      name: "Show Model Settings",
      checkCallback: (checking: boolean) => {
        if (checking) {
          return (
            this.app.workspace.getLeavesOfType(VIEW_TYPE_MODEL_SETTINGS)
              .length === 0
          );
        }
        this.initLeaf();
      },
    });

    this.addSettingTab(new GPTSettingTab(this.app, this));
  }

  onunload(): void {
    this.app.workspace
      .getLeavesOfType(VIEW_TYPE_MODEL_SETTINGS)
      .forEach((leaf) => leaf.detach());
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
