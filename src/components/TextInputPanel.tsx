import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Play, Loader2, AlertCircle } from "lucide-react";
import { isOpenAIConfigured } from "../lib/openai";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TextInputPanelProps {
  onAnalyze?: (text: string) => void;
  isProcessing?: boolean;
  defaultText?: string;
}

const TextInputPanel: React.FC<TextInputPanelProps> = ({
  onAnalyze = () => {},
  isProcessing = false,
  defaultText = "Enter your text here to analyze and visualize concepts based on the 01234 Model. The system will identify key concepts and categorize them into the five fundamental levels: Potentiality, Unity, Duality, Connection, and Manifestation.",
}) => {
  const [text, setText] = useState<string>(defaultText);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleAnalyze = () => {
    if (text.trim() && !isProcessing && isOpenAIConfigured()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="w-full bg-slate-50 p-6 border-b border-slate-200">
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">
                Text Input
              </h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleAnalyze}
                      disabled={
                        !text.trim() || isProcessing || !isOpenAIConfigured()
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : !isOpenAIConfigured() ? (
                        <>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          No API Key Found
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Analyze Concepts
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Analyze text to generate concept visualization</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Enter your text here..."
              className="min-h-[150px] resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isProcessing}
            />

            <div className="text-xs text-slate-500 italic">
              Enter text to analyze and visualize concepts based on the 01234
              Model. The system will identify key concepts and categorize them
              into the five fundamental levels.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TextInputPanel;
