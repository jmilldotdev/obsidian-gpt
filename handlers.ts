import { GPTJSettings, AI21Settings, GPT3Settings } from "types";
import { pythonifyKeys } from "./util";

export const getGPTJCompletion = async (
  apiKey: string,
  prompt: string,
  settings: GPTJSettings
): Promise<string | null> => {
  const apiUrl = "https://nlp-server.exafunction.com/text_completion";
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  const body = {
    prompt,
    ...pythonifyKeys(settings),
    remove_input: "true",
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
  return res ? res.text : null;
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
  return res ? res.completions[0].data.text : null;
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
  return res ? res.choices[0].text : null;
};

export const getGPT3Edit = async (
  apiKey: string,
  prompt: string,
  instruction: string,
  settings: GPT3Settings
): Promise<string> => {
  const apiUrl = `https://api.openai.com/v1/engines/text-davinci-edit-001/edits`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  const { temperature, topP } = settings;
  let body = {
    input: prompt,
    instruction,
    temperature,
    top_p: topP,
  };
  console.log(body);
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
  return res ? res.choices[0].text : null;
};
