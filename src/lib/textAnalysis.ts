import { getOpenAIClient } from "./openai";
import {
  SYSTEM_PROMPT as DEFAULT_SYSTEM_PROMPT,
  ANALYSIS_PROMPT as DEFAULT_ANALYSIS_PROMPT,
  MODEL_CONFIG as DEFAULT_MODEL_CONFIG,
} from "./promptConfig";

// Define the structure for concept data
export interface Concept {
  id: string;
  name: string;
  level: number;
  levelName: string;
  description: string;
  reasoning: string;
  x: number;
  y: number;
  connections: Array<{
    targetId: string;
    relationship: string;
  }>;
  relatedConcepts: Array<{
    id: string;
    name: string;
    relationship: string;
  }>;
}

// Function to analyze text using OpenAI
export async function analyzeText(
  text: string,
  customExamples?: Array<{ input: string; output: string }>,
  customPrompt?: string,
): Promise<Concept[]> {
  const openai = getOpenAIClient();

  if (!openai) {
    throw new Error("OpenAI client is not configured");
  }

  try {
    // Get stored configuration or use defaults
    const storedSystemPrompt = localStorage.getItem("SYSTEM_PROMPT");
    const storedAnalysisPrompt = localStorage.getItem("ANALYSIS_PROMPT");
    const storedModelConfig = localStorage.getItem("MODEL_CONFIG");

    const SYSTEM_PROMPT = storedSystemPrompt || DEFAULT_SYSTEM_PROMPT;
    const ANALYSIS_PROMPT = storedAnalysisPrompt || DEFAULT_ANALYSIS_PROMPT;
    const MODEL_CONFIG = storedModelConfig
      ? JSON.parse(storedModelConfig)
      : DEFAULT_MODEL_CONFIG;

    // Check if the model supports response_format
    const modelConfig = { ...MODEL_CONFIG };
    const supportsJsonFormat = [
      "gpt-4-1106-preview",
      "gpt-4-0125-preview",
      "gpt-4-turbo-preview",
      "gpt-3.5-turbo-1106",
      "gpt-3.5-turbo-0125",
    ].includes(modelConfig.model);

    // Remove response_format if not supported
    if (!supportsJsonFormat) {
      delete modelConfig.response_format;
      console.log(
        `Model ${modelConfig.model} doesn't support response_format, removed it from request`,
      );
    }

    // Prepare messages array
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
    ];

    // Add examples if provided (few-shot learning)
    if (customExamples && customExamples.length > 0) {
      customExamples.forEach((example) => {
        if (example.input && example.output) {
          messages.push({
            role: "user",
            content: example.input,
          });
          messages.push({
            role: "assistant",
            content: `Analizaré este texto según el modelo 01234:\n\n${example.output}\n\nAhora traduciré este análisis al formato JSON requerido.`,
          });
        }
      });
    }

    // Add the current request
    messages.push({
      role: "user",
      content: customPrompt
        ? `${customPrompt}\n\n${text}`
        : `${ANALYSIS_PROMPT}${text}`,
    });

    const response = await openai.chat.completions.create({
      ...modelConfig,
      messages: messages,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from OpenAI");
    }

    try {
      const parsedResponse = JSON.parse(content);
      return parsedResponse.concepts || [];
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      throw new Error("Failed to parse the analysis results");
    }
  } catch (error) {
    console.error("Error analyzing text with OpenAI:", error);
    throw error;
  }
}
