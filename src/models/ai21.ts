import { pythonifyKeys } from "src/util";

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

export const getAI21Completion = async (
  apiKey: string,
  prompt: string,
  settings: AI21Settings
): Promise<string | null> => {
  const apiUrl = `https://api.ai21.com/studio/v1/${settings.modelType}/complete`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  const { modelType, ...params } = settings;
  const body = {
    prompt,
    ...pythonifyKeys(params),
    stop: settings.stop.length > 0 ? settings.stop : null,
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
  return res?.completions?.[0]?.data?.text ?? null;
};
