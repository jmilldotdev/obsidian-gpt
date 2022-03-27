import { Notice } from "obsidian";

export const gettingCompletionNotice = (modelName: string) => {
  return new Notice(`Getting ${modelName} Completion`, 10000);
};

export const gettingInsertionNotice = (modelName: string) => {
  return new Notice(`Getting ${modelName} Insertion`, 10000);
};

export const gettingEditNotice = (modelName: string) => {
  return new Notice(`Getting ${modelName} Edit`, 10000);
};

export const errorGettingCompletionNotice = () => {
  return new Notice(
    "Error getting completion. Check your internet settings or API key."
  );
};

export const editNotSupportedNotice = () => {
  return new Notice("Edit not supported for this model.");
};
