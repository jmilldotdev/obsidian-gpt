import { Notice } from "obsidian";

export const gettingCompletionNotice = (modelName: string) => {
  return new Notice(`Getting ${modelName} Completion`, 10000);
};

export const errorGettingCompletionNotice = () => {
  return new Notice(
    "Error getting completion. Check your internet settings or API key."
  );
};
