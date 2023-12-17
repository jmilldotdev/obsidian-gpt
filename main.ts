import { Editor, Plugin, WorkspaceLeaf } from "obsidian";
import {
  gettingCompletionNotice,
  errorGettingCompletionNotice,
} from "src/notices";
import { getCompletion, refetchModels } from "src/openrouter";
import GPTSettingTab from "src/SettingsTab";
import {
  CurrentLineContents,
  DEFAULT_SETTINGS,
  GPTPluginSettings,
  ORRequest,
  VIEW_TYPE_MODEL_SETTINGS,
} from "src/types";
import SettingsItemView from "src/ui/SettingsItemView";

export default class GPTPlugin extends Plugin {
  settings: GPTPluginSettings;

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

  getNoteContents(editor: Editor) {
    const noteContents = editor.getValue();
    return noteContents;
  }

  getSuffix(selection: string) {
    if (selection.includes(this.settings.insertToken)) {
      const prompt = selection.split(this.settings.insertToken)[0];
      const suffix = selection.split(this.settings.insertToken)[1];
      return { prompt, suffix };
    }
    return { prompt: selection };
  }

  async getCompletion(selection: string): Promise<string | null> {
    let completion: string;
    const notice = gettingCompletionNotice("test");
    completion = await getCompletion(selection, this.settings);
    notice.hide();
    return completion;
  }

  handleGetCompletionError() {
    errorGettingCompletionNotice();
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

  ensureLeafExists(active: boolean = false): void {
    let { workspace } = this.app;

    let preferredSidebar = "right";

    let leaf: WorkspaceLeaf;
    let existingPluginLeaves = workspace.getLeavesOfType(
      VIEW_TYPE_MODEL_SETTINGS
    );

    if (existingPluginLeaves.length > 0) {
      leaf = existingPluginLeaves[0];
    } else {
      leaf =
        preferredSidebar === "left"
          ? workspace.getLeftLeaf(false)
          : workspace.getRightLeaf(false);
      workspace.revealLeaf(leaf);
      leaf.setViewState({ type: VIEW_TYPE_MODEL_SETTINGS });
    }

    if (active) {
      workspace.setActiveLeaf(leaf);
    }
  }

  async populateSettingDefaults() {
    // ensure that each model's default settings are populated
    const settings = this.settings;
    if (!settings.openRouter) {
      console.log("populating default settings for openrouter");
      settings.openRouter = DEFAULT_SETTINGS.openRouter;
    }
    if (!settings.availableModels || !settings.availableModels.length) {
      console.log("populating available models");
      const models = await refetchModels();
      this.settings.availableModels = models;
    }
    await this.saveData(settings);
  }

  async onload() {
    await this.loadSettings();
    await this.populateSettingDefaults();

    this.registerView(
      VIEW_TYPE_MODEL_SETTINGS,
      (leaf: WorkspaceLeaf) => new SettingsItemView(leaf, this.settings, this)
    );

    this.addCommand({
      id: "get-completion",
      name: "Get Completion",
      editorCallback: (editor: Editor) => this.getCompletionHandler(editor),
    });

    this.addCommand({
      id: "show-model-settings",
      name: "Show Model Settings",
      callback: () => {
        this.ensureLeafExists(true);
      },
    });

    this.addSettingTab(new GPTSettingTab(this.app, this));

    this.app.workspace.onLayoutReady(() => {
      this.ensureLeafExists(false);
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
