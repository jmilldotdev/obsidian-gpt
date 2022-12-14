import { request, RequestParam } from "obsidian";
import { pythonifyKeys } from "src/util";

export enum GPT3ModelType {
  Ada = "text-ada-001",
  Babbage = "text-babbage-001",
  Curie = "text-curie-001",
  TextDaVinci = "text-davinci-003",
  DaVinci = "davinci",
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
  const apiUrl = `https://api.openai.com/v1/completions`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  const { modelType, ...params } = settings;
  let body = {
    prompt,
    model: modelType,
    ...pythonifyKeys(params),
    stop: settings.stop.length > 0 ? settings.stop : undefined,
    suffix: suffix ? suffix : undefined,
  };
  const requestParam: RequestParam = {
    url: apiUrl,
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(body),
    headers,
  };
  const res: any = await request(requestParam)
    .then((response) => {
      return JSON.parse(response);
    })
    .catch((err) => {
      console.error(err);
    });
  return res?.choices?.[0]?.text ?? null;
};
