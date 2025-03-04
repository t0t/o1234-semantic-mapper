import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Save, RotateCcw, Plus, Trash } from "lucide-react";
import { Switch } from "./ui/switch";

interface PromptTrainingPanelProps {
  onSave?: (config: {
    customPrompt: string;
    examples: Array<{
      input: string;
      output: string;
    }>;
    useCustomPrompt: boolean;
  }) => void;
  onClose?: () => void;
}

const PromptTrainingPanel: React.FC<PromptTrainingPanelProps> = ({
  onSave = () => {},
  onClose = () => {},
}) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [examples, setExamples] = useState<
    Array<{ input: string; output: string }>
  >([{ input: "", output: "" }]);

  const handleAddExample = () => {
    setExamples([...examples, { input: "", output: "" }]);
  };

  const handleRemoveExample = (index: number) => {
    const newExamples = [...examples];
    newExamples.splice(index, 1);
    setExamples(newExamples);
  };

  const handleExampleInputChange = (index: number, value: string) => {
    const newExamples = [...examples];
    newExamples[index].input = value;
    setExamples(newExamples);
  };

  const handleExampleOutputChange = (index: number, value: string) => {
    const newExamples = [...examples];
    newExamples[index].output = value;
    setExamples(newExamples);
  };

  const handleReset = () => {
    setCustomPrompt("");
    setUseCustomPrompt(false);
    setExamples([{ input: "", output: "" }]);
  };

  const handleSave = () => {
    onSave({
      customPrompt,
      examples,
      useCustomPrompt,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Entrenamiento del Modelo 01234</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reiniciar
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Configuración
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="examples">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="examples">
              Ejemplos de Entrenamiento
            </TabsTrigger>
            <TabsTrigger value="custom-prompt">
              Prompt Personalizado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="examples" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Ejemplos de Entrenamiento
                </h3>
                <Button variant="outline" size="sm" onClick={handleAddExample}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Ejemplo
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Proporciona ejemplos de textos y cómo quieres que sean
                analizados. El modelo aprenderá de estos ejemplos.
              </p>
            </div>

            {examples.map((example, index) => (
              <div key={index} className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Ejemplo {index + 1}</h4>
                  {examples.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveExample(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`example-input-${index}`}>
                    Texto de Entrada
                  </Label>
                  <Textarea
                    id={`example-input-${index}`}
                    value={example.input}
                    onChange={(e) =>
                      handleExampleInputChange(index, e.target.value)
                    }
                    placeholder="Introduce un texto de ejemplo..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`example-output-${index}`}>
                    Análisis Deseado (Texto Natural)
                  </Label>
                  <Textarea
                    id={`example-output-${index}`}
                    value={example.output}
                    onChange={(e) =>
                      handleExampleOutputChange(index, e.target.value)
                    }
                    placeholder="Describe en texto natural cómo quieres que se analice este texto. Por ejemplo: 'El concepto principal es X y debe estar en el nivel 2 porque representa una dualidad. Está relacionado con el concepto Y que debe estar en el nivel 3...' etc."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="custom-prompt" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="use-custom-prompt"
                checked={useCustomPrompt}
                onCheckedChange={setUseCustomPrompt}
              />
              <Label htmlFor="use-custom-prompt">
                Usar prompt personalizado
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customPrompt">Prompt Personalizado</Label>
              <Textarea
                id="customPrompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[300px]"
                placeholder="Escribe tu prompt personalizado aquí..."
                disabled={!useCustomPrompt}
              />
              <p className="text-xs text-gray-500">
                Crea un prompt personalizado que explique exactamente cómo
                quieres que se analicen los textos. Asegúrate de incluir
                instrucciones detalladas sobre cómo identificar y categorizar
                conceptos.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PromptTrainingPanel;
