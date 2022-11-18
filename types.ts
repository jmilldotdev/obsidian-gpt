export const VIEW_TYPE_MODEL_SETTINGS = "gptModelSettings";

// GPT-3

export enum GPT3ModelType {
  Ada = "text-ada-001",
  Babbage = "text-babbage-001",
  Curie = "text-curie-001",
  DaVinci = "text-davinci-002",
}

export interface GPT3Settings {
  modelType: GPT3ModelType;
  maxTokens: number;
  temperature: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
  stop: string[];
}

export const defaultGPT3Settings: GPT3Settings = {
  modelType: GPT3ModelType.DaVinci,
  maxTokens: 16,
  temperature: 1.0,
  topP: 1.0,
  presencePenalty: 0,
  frequencyPenalty: 0,
  stop: [],
};

// AI21

export enum AI21ModelType {
  Jurassic1Large = "j1-large",
  Jurassic1Jumbo = "j1-jumbo",
}

export interface AI21Settings {
  modelType: AI21ModelType;
  maxTokens: number;
  temperature: number;
  topP: number;
  stop: string[];
}

export const defaultAI21Settings: AI21Settings = {
  modelType: AI21ModelType.Jurassic1Jumbo,
  maxTokens: 16,
  temperature: 1.0,
  topP: 1.0,
  stop: [],
};

// Plugin

export enum SupportedModels {
  GPT3 = "GPT-3",
  AI21 = "AI21",
}

export interface ModelSettings {
  gpt3Settings: GPT3Settings;
  ai21Settings: AI21Settings;
}

export interface HandlerTags {
  openingTag: string;
  closingTag: string;
}

export interface GPTPluginSettings {
  gpt3ApiKey: string;
  ai21ApiKey: string;
  activeModel: SupportedModels;
  modelSettings: ModelSettings;
  tagCompletions: boolean;
  tagCompletionsHandlerTags: HandlerTags;
  tagPrompts: boolean;
  tagPromptsHandlerTags: HandlerTags;
  insertToken: string;
}

export const DEFAULT_SETTINGS: GPTPluginSettings = {
  gpt3ApiKey: "",
  ai21ApiKey: "",
  activeModel: SupportedModels.GPT3,
  modelSettings: {
    gpt3Settings: defaultGPT3Settings,
    ai21Settings: defaultAI21Settings,
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
