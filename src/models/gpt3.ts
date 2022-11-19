import { pythonifyKeys } from "src/util";

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

export const getGPT3Completion = async (
  apiKey: string,
  prompt: string,
  settings: GPT3Settings,
  suffix?: string
): Promise<string> => {
  const apiUrl = `https://api.openai.com/v1/engines/${settings.modelType}/completions`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  const { modelType, ...params } = settings;
  let body = {
    prompt,
    ...pythonifyKeys(params),
    stop: settings.stop.length > 0 ? settings.stop : undefined,
    suffix: suffix ? suffix : undefined,
  };
  const res: any = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.error(err);
    });
  return res?.choices?.[0]?.text ?? null;
};
