import { Editor, MarkdownView, Plugin, WorkspaceLeaf } from "obsidian";
import { getAI21Completion } from "src/models/ai21";
import {
  ChatMessage,
  ChatRole,
  getChatGPTCompletion,
} from "src/models/chatGPT";
import { getCohereCompletion } from "src/models/cohere";
import { getGPT3Completion } from "src/models/gpt3";
import {
  gettingCompletionNotice,
  errorGettingCompletionNotice,
} from "src/notices";
import GPTSettingTab from "src/SettingsTab";
import {
  CurrentLineContents,
  DEFAULT_SETTINGS,
  GPTPluginSettings,
  SupportedModels,
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
    const { ai21, chatgpt, gpt3, cohere } = this.settings.models;
    let completion: string;
    const notice = gettingCompletionNotice(this.settings.activeModel);
    if (this.settings.activeModel === SupportedModels.AI21) {
      completion = await getAI21Completion(
        ai21.apiKey,
        selection,
        ai21.settings
      );
    } else if (this.settings.activeModel === SupportedModels.GPT3) {
      completion = await getGPT3Completion(
        gpt3.apiKey,
        selection,
        gpt3.settings
      );
    } else if (this.settings.activeModel === SupportedModels.COHERE) {
      completion = await getCohereCompletion(
        cohere.apiKey,
        selection,
        cohere.settings
      );
    } else if (this.settings.activeModel === SupportedModels.CHATGPT) {
      const messages: ChatMessage[] = [
        {
          role: "system",
          content: chatgpt.settings.systemMessage,
        },
        {
          role: "user",
          content: selection,
        },
      ];
      completion = await getChatGPTCompletion(
        gpt3.apiKey,
        messages,
        chatgpt.settings
      );
      if (completion) {
        completion = "\n\n" + completion;
      }
    }
    notice.hide();
    return completion;
  }

  async getChatCompletion(selection: string) {
    const { chatgpt, gpt3 } = this.settings.models;
    const messagesText = selection.split(this.settings.chatSeparator);
    let messages: ChatMessage[] = [
      {
        role: "system",
        content: chatgpt.settings.systemMessage,
      },
      ...messagesText.map((message, idx) => {
        return {
          role: idx % 2 === 0 ? "user" : ("assistant" as ChatRole),
          content: message.trim(),
        };
      }),
    ];
    const notice = gettingCompletionNotice(this.settings.activeModel);
    const completion = await getChatGPTCompletion(
      gpt3.apiKey,
      messages,
      chatgpt.settings
    );
    notice.hide();
    return completion;
  }

  handleGetCompletionError() {
    errorGettingCompletionNotice();
  }

  formatCompletion(
    prompt: string,
    completion: string,
    isChatCompletion = false
  ) {
    const {
      tagCompletions,
      tagCompletionsHandlerTags,
      tagPrompts,
      tagPromptsHandlerTags,
      tagChatCompletions,
      tagChatCompletionsHandlerTags,
      tagChatPrompts,
      tagChatPromptsHandlerTags,
    } = this.settings;
    
    if (isChatCompletion) {
      if (tagChatCompletions) {
        completion = `${tagChatCompletionsHandlerTags.openingTag}${completion}${tagChatCompletionsHandlerTags.closingTag}`;
      }

      if (tagChatPrompts) {
        prompt = `${tagChatPromptsHandlerTags.openingTag}${prompt}${tagChatPromptsHandlerTags.closingTag}`;
      }

      prompt += "\n\n" + this.settings.chatSeparator + "\n\n";
      completion += "\n\n" + this.settings.chatSeparator + "\n\n";
    } else {
      if (tagCompletions) {
        completion = `${tagCompletionsHandlerTags.openingTag}${completion}${tagCompletionsHandlerTags.closingTag}`;
      }

      if (tagPrompts) {
        prompt = `${tagPromptsHandlerTags.openingTag}${prompt}${tagPromptsHandlerTags.closingTag}`;
      }
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

  async chatCompletionHandler(editor: Editor) {
    const selection: string = this.getSelectedText(editor);
    if (selection) {
      const completion = await this.getChatCompletion(selection);
      if (!completion) {
        this.handleGetCompletionError();
        return;
      }
      editor.replaceSelection(
        this.formatCompletion(selection, completion, true)
      );
      return;
    } else {
      const noteContents = this.getNoteContents(editor);
      const completion = await this.getChatCompletion(noteContents);
      if (!completion) {
        this.handleGetCompletionError();
        return;
      }
      editor.setValue(this.formatCompletion(noteContents, completion, true));
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
    console.log(settings);
    Object.values(SupportedModels).forEach((model) => {
      if (!settings.models[model]) {
        console.log("populating default settings for", model);
        settings.models[model] = {
          settings: DEFAULT_SETTINGS.models[model].settings as never,
          apiKey: "",
        };
      }
    });
    if (!settings.chatSeparator) {
      settings.chatSeparator = DEFAULT_SETTINGS.chatSeparator;
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
      id: "chat-completion",
      name: "Chat Completion",
      editorCallback: (editor: Editor) => this.chatCompletionHandler(editor),
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
