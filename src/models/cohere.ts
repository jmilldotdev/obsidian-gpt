import { pythonifyKeys } from "src/util";

export enum CohereModelType {
  Small = "small",
  Medium = "medium",
  Large = "large",
  XLarge = "xlarge",
}

export interface CohereSettings {
  modelType: CohereModelType;
  maxTokens: number;
  temperature: number;
  p: number;
  k: number;
  presencePenalty: number;
  frequencyPenalty: number;
  stopSequences: string[];
}

export const defaultCohereSettings: CohereSettings = {
  modelType: CohereModelType.XLarge,
  maxTokens: 16,
  temperature: 1.0,
  p: 1.0,
  k: 0,
  presencePenalty: 0,
  frequencyPenalty: 0,
  stopSequences: [],
};

export const getCohereCompletion = async (
  apiKey: string,
  prompt: string,
  settings: CohereSettings,
  suffix?: string
): Promise<string> => {
  const apiUrl = `https://api.cohere.ai/generate`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Cohere-Version": "2021-11-08",
  };
  const { modelType, ...params } = settings;
  let body = {
    prompt,
    model: modelType,
    ...pythonifyKeys(params),
    stop:
      settings.stopSequences.length > 0 ? settings.stopSequences : undefined,
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
  console.log(res);
  return res?.generations?.[0]?.text ?? null;
};
