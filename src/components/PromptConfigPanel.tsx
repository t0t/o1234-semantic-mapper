import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Save, RotateCcw } from "lucide-react";
import * as promptConfig from "../lib/promptConfig";

interface PromptConfigPanelProps {
  onSave?: (config: {
    systemPrompt: string;
    analysisPrompt: string;
    modelConfig: {
      model: string;
      temperature: number;
      max_tokens: number;
      response_format?: { type: string };
    };
  }) => void;
  onClose?: () => void;
}

const PromptConfigPanel: React.FC<PromptConfigPanelProps> = ({
  onSave = () => {},
  onClose = () => {},
}) => {
  // Get stored values from localStorage or use defaults
  const [systemPrompt, setSystemPrompt] = useState(
    localStorage.getItem("SYSTEM_PROMPT") || promptConfig.SYSTEM_PROMPT,
  );
  const [analysisPrompt, setAnalysisPrompt] = useState(
    localStorage.getItem("ANALYSIS_PROMPT") || promptConfig.ANALYSIS_PROMPT,
  );

  // Parse model config from localStorage or use defaults
  const storedModelConfig = localStorage.getItem("MODEL_CONFIG");
  const parsedModelConfig = storedModelConfig
    ? JSON.parse(storedModelConfig)
    : promptConfig.MODEL_CONFIG;

  const [model, setModel] = useState(parsedModelConfig.model);
  const [temperature, setTemperature] = useState(
    parsedModelConfig.temperature.toString(),
  );
  const [maxTokens, setMaxTokens] = useState(
    parsedModelConfig.max_tokens.toString(),
  );

  const handleReset = () => {
    setSystemPrompt(promptConfig.SYSTEM_PROMPT);
    setAnalysisPrompt(promptConfig.ANALYSIS_PROMPT);
    setModel(promptConfig.MODEL_CONFIG.model);
    setTemperature(promptConfig.MODEL_CONFIG.temperature.toString());
    setMaxTokens(promptConfig.MODEL_CONFIG.max_tokens.toString());
  };

  const handleSave = () => {
    // Check if the model supports response_format
    const supportsJsonFormat = [
      "gpt-4-1106-preview",
      "gpt-4-0125-preview",
      "gpt-4-turbo-preview",
      "gpt-3.5-turbo-1106",
      "gpt-3.5-turbo-0125",
    ].includes(model);

    const modelConfig: {
      model: string;
      temperature: number;
      max_tokens: number;
      response_format?: { type: string };
    } = {
      model,
      temperature: parseFloat(temperature),
      max_tokens: parseInt(maxTokens, 10),
    };

    // Only add response_format if the model supports it
    if (supportsJsonFormat) {
      modelConfig.response_format = { type: "json_object" };
    }

    onSave({
      systemPrompt,
      analysisPrompt,
      modelConfig,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>01234 Model Analysis Configuration</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prompts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="model">Model Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="prompts" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="min-h-[100px]"
                placeholder="Enter the system prompt that sets the AI's role"
              />
              <p className="text-xs text-gray-500">
                This prompt sets the AI's role and expertise for the analysis.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="analysisPrompt">Analysis Prompt</Label>
              <Textarea
                id="analysisPrompt"
                value={analysisPrompt}
                onChange={(e) => setAnalysisPrompt(e.target.value)}
                className="min-h-[300px]"
                placeholder="Enter the main analysis prompt"
              />
              <p className="text-xs text-gray-500">
                This is the main prompt that explains the 01234 model and
                instructs the AI on how to analyze the text.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="model" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="gpt-4"
              />
              <p className="text-xs text-gray-500">
                The OpenAI model to use (e.g., gpt-4, gpt-3.5-turbo)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="0.7"
              />
              <p className="text-xs text-gray-500">
                Controls randomness: 0 is deterministic, 1 is very random (0-1)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                min="100"
                max="4000"
                step="100"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                placeholder="2000"
              />
              <p className="text-xs text-gray-500">
                Maximum number of tokens in the response
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PromptConfigPanel;
