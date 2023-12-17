import { RequestParam, request } from "obsidian";
import { GPTPluginSettings, ORRequest, ORResponse } from "src/types";

const parseResponseText = (response: ORResponse): string => {
  const choice = response.choices[0];
  // @ts-ignore
  const { text, message } = choice;
  if (text) {
    return text;
  } else if (message) {
    return message.content;
  }
  throw new Error("No text or message found in response");
};

export const getCompletion = async (
  prompt: string,
  settings: GPTPluginSettings
): Promise<string> => {
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
  const headers = {
    Authorization: `Bearer ${settings.openRouter.apiKey}`,
    "Content-Type": "application/json",
  };
  const { apiKey, ...openRouter } = settings.openRouter;
  const data: Partial<ORRequest> = {
    ...openRouter,
    prompt,
  };
  const requestParam: RequestParam = {
    url: apiUrl,
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(data),
    headers,
  };
  const res: ORResponse = await request(requestParam)
    .then((response) => {
      return JSON.parse(response);
    })
    .catch((err) => {
      console.error(err);
    });
  const text = parseResponseText(res);
  return text;
};

interface ORModel {
  id: string;
}

interface ORModelsResponse {
  data: ORModel[];
}

export const refetchModels = async (): Promise<string[]> => {
  const apiUrl = "https://openrouter.ai/api/v1/models";
  const requestParam: RequestParam = {
    url: apiUrl,
    method: "GET",
    contentType: "application/json",
  };
  const res: ORModelsResponse = await request(requestParam)
    .then((response) => {
      return JSON.parse(response);
    })
    .catch((err) => {
      console.error(err);
    });
  const models = res.data.map((model) => model.id).sort();
  return models;
};
