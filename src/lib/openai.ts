import { OpenAI } from "openai";

import { OPENAI_API_KEY } from "../config/api-keys";

// Try to get API key from environment variables first, then from localStorage, then from config file
const apiKey =
  import.meta.env.VITE_OPENAI_API_KEY ||
  (window as any).OPENAI_API_KEY ||
  OPENAI_API_KEY ||
  "";

let openai = null;

export const getOpenAIClient = () => {
  if (!openai && apiKey) {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }
  return openai;
};

export const isOpenAIConfigured = () => {
  return !!apiKey;
};
