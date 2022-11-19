import { AI21Settings, defaultAI21Settings } from "src/models/ai21";
import { GPT3Settings, defaultGPT3Settings } from "src/models/gpt3";

export const VIEW_TYPE_MODEL_SETTINGS = "gptModelSettings";

export enum SupportedModels {
  GPT3 = "GPT-3",
  AI21 = "AI21",
}

export interface Models {
  gpt3: {
    apiKey: string;
    settings: GPT3Settings;
  };
  ai21: {
    apiKey: string;
    settings: AI21Settings;
  };
}

export interface HandlerTags {
  openingTag: string;
  closingTag: string;
}

export interface GPTPluginSettings {
  activeModel: SupportedModels;
  models: Models;
  tagCompletions: boolean;
  tagCompletionsHandlerTags: HandlerTags;
  tagPrompts: boolean;
  tagPromptsHandlerTags: HandlerTags;
  insertToken: string;
}

export const DEFAULT_SETTINGS: GPTPluginSettings = {
  activeModel: SupportedModels.GPT3,
  models: {
    gpt3: {
      apiKey: "",
      settings: defaultGPT3Settings,
    },
    ai21: {
      apiKey: "",
      settings: defaultAI21Settings,
    },
  },
  tagCompletions: false,
  tagCompletionsHandlerTags: {
    openingTag: "<Completion>",
    closingTag: "</Completion>",
  },
  tagPrompts: false,
  tagPromptsHandlerTags: {
    openingTag: "<Prompt>",
    closingTag: "</Prompt>",
  },
  insertToken: "[insert]",
};

// Utils

export interface CurrentLineContents {
  lineNumber: number;
  lineContents: string;
}
