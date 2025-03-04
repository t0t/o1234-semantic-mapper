import React, { useState, useEffect } from "react";
import Header from "./Header";
import TextInputPanel from "./TextInputPanel";
import VisualizationCanvas from "./VisualizationCanvas";
import ConceptDetailsSidebar from "./ConceptDetailsSidebar";
import ExportPanel from "./ExportPanel";
import LegendPanel from "./LegendPanel";
import PromptConfigPanel from "./PromptConfigPanel";
import PromptTrainingPanel from "./PromptTrainingPanel";
import { isOpenAIConfigured } from "../lib/openai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const MainLayout: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<any>(null);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [promptConfigDialogOpen, setPromptConfigDialogOpen] = useState(false);
  const [promptTrainingDialogOpen, setPromptTrainingDialogOpen] =
    useState(false);
  const [apiKey, setApiKey] = useState("");
  const [trainingConfig, setTrainingConfig] = useState({
    customPrompt: "",
    examples: [] as Array<{ input: string; output: string }>,
    useCustomPrompt: false,
  });

  useEffect(() => {
    // Check if OpenAI API key is configured
    if (!isOpenAIConfigured()) {
      setApiKeyDialogOpen(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    // In a real app, you would save this to localStorage or a secure storage
    // and then reload the page or update the OpenAI client
    localStorage.setItem("OPENAI_API_KEY", apiKey);
    window.location.reload();
  };

  const handleAnalyzeText = async (text: string) => {
    setIsProcessing(true);

    try {
      // Import the analyzeText function dynamically to avoid circular dependencies
      const { analyzeText } = await import("../lib/textAnalysis");

      // Call the OpenAI API to analyze the text with custom examples/prompt if available
      const customExamples =
        trainingConfig.examples.length > 0
          ? trainingConfig.examples
          : undefined;
      const customPrompt = trainingConfig.useCustomPrompt
        ? trainingConfig.customPrompt
        : undefined;

      const analyzedConcepts = await analyzeText(
        text,
        customExamples,
        customPrompt,
      );

      // Update the state with the analyzed concepts
      setConcepts(analyzedConcepts);
    } catch (error) {
      console.error("Error analyzing text:", error);
      // Show an error message to the user (you could add a toast notification here)
      alert("Error analyzing text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConceptClick = (conceptId: string) => {
    const concept = concepts.find((c) => c.id === conceptId);
    setSelectedConcept(concept || null);
  };

  const handleCloseSidebar = () => {
    setSelectedConcept(null);
  };

  const handlePromptConfigSave = async (config: any) => {
    try {
      // Import the promptConfig module
      const promptConfig = await import("../lib/promptConfig");

      // Update the module variables
      promptConfig.SYSTEM_PROMPT = config.systemPrompt;
      promptConfig.ANALYSIS_PROMPT = config.analysisPrompt;
      promptConfig.MODEL_CONFIG = config.modelConfig;

      console.log("New prompt configuration saved:", config);
      setPromptConfigDialogOpen(false);

      // Notify the user
      alert(
        "Configuración guardada correctamente. Se aplicará en el próximo análisis de texto.",
      );
    } catch (error) {
      console.error("Error saving prompt configuration:", error);
      alert(
        "Error al guardar la configuración. Por favor, inténtalo de nuevo.",
      );
    }
  };

  const handlePromptTrainingSave = async (config: any) => {
    // Save the training configuration to state
    setTrainingConfig(config);
    console.log("Training configuration saved:", config);
    setPromptTrainingDialogOpen(false);

    // Notify the user
    alert(
      "Configuración de entrenamiento guardada. Se aplicará en el próximo análisis de texto.",
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50">
      <Header
        onPromptConfigClick={() => setPromptConfigDialogOpen(true)}
        onSettingsClick={() => setPromptTrainingDialogOpen(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TextInputPanel
          onAnalyze={handleAnalyzeText}
          isProcessing={isProcessing}
        />

        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 relative">
            <VisualizationCanvas
              concepts={concepts}
              onConceptClick={handleConceptClick}
              isLoading={isProcessing}
            />

            <div className="absolute top-4 right-4">
              <LegendPanel />
            </div>
          </div>

          {selectedConcept && (
            <ConceptDetailsSidebar
              selectedConcept={selectedConcept}
              onClose={handleCloseSidebar}
            />
          )}
        </div>

        <ExportPanel isVisualizationEmpty={concepts.length === 0} />
      </div>

      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OpenAI API Key Required</DialogTitle>
            <DialogDescription>
              To analyze text and generate concept visualizations, please enter
              your OpenAI API key.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">
                API Key
              </Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim().startsWith("sk-")}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={promptConfigDialogOpen}
        onOpenChange={setPromptConfigDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>01234 Model Analysis Configuration</DialogTitle>
            <DialogDescription>
              Customize the prompts and model settings used for text analysis
            </DialogDescription>
          </DialogHeader>
          <PromptConfigPanel
            onSave={handlePromptConfigSave}
            onClose={() => setPromptConfigDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={promptTrainingDialogOpen}
        onOpenChange={setPromptTrainingDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Entrenamiento del Modelo 01234</DialogTitle>
            <DialogDescription>
              Personaliza cómo el modelo analiza los textos mediante ejemplos y
              prompts personalizados
            </DialogDescription>
          </DialogHeader>
          <PromptTrainingPanel
            onSave={handlePromptTrainingSave}
            onClose={() => setPromptTrainingDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainLayout;
