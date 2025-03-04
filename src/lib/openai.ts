import { OpenAI } from "openai";
import { getApiKey } from "./env";

// Initialize with null, will be created on demand
let openai = null;

export const getOpenAIClient = () => {
  const apiKey = getApiKey();

  // Create a new client if we don't have one or if the API key has changed
  if (!openai && apiKey) {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }
  return openai;
};

export const isOpenAIConfigured = () => {
  return !!getApiKey();
};
