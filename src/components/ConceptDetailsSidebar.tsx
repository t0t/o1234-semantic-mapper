import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Info, X } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

interface ConceptDetailsSidebarProps {
  selectedConcept?: {
    id: string;
    name: string;
    level: number;
    levelName: string;
    description: string;
    reasoning: string;
    relatedConcepts: Array<{
      id: string;
      name: string;
      relationship: string;
    }>;
  };
  onClose?: () => void;
}

const levelColors = {
  0: "bg-purple-100 text-purple-800",
  1: "bg-blue-100 text-blue-800",
  2: "bg-green-100 text-green-800",
  3: "bg-yellow-100 text-yellow-800",
  4: "bg-red-100 text-red-800",
};

const levelNames = {
  0: "Potentiality",
  1: "Unity",
  2: "Duality",
  3: "Connection",
  4: "Manifestation",
};

const ConceptDetailsSidebar = ({
  selectedConcept = {
    id: "concept-1",
    name: "Example Concept",
    level: 2,
    levelName: "Duality",
    description:
      "This is an example concept that demonstrates the structure of the concept details sidebar.",
    reasoning:
      "This concept is categorized as Duality because it represents a fundamental opposition or complementary pair within the analyzed text. The NLP analysis detected patterns of contrast and balance.",
    relatedConcepts: [
      {
        id: "concept-2",
        name: "Related Concept 1",
        relationship: "complements",
      },
      { id: "concept-3", name: "Related Concept 2", relationship: "contrasts" },
      {
        id: "concept-4",
        name: "Related Concept 3",
        relationship: "influences",
      },
    ],
  },
  onClose = () => console.log("Close sidebar"),
}: ConceptDetailsSidebarProps) => {
  if (!selectedConcept) {
    return (
      <div className="w-[350px] h-full bg-white border-l border-gray-200 p-4 flex flex-col">
        <div className="text-center text-gray-500 mt-10">
          <Info className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2">
            Select a concept from the visualization to view details
          </p>
        </div>
      </div>
    );
  }

  const levelColorClass =
    levelColors[selectedConcept.level as keyof typeof levelColors] ||
    "bg-gray-100 text-gray-800";

  return (
    <div className="w-[350px] h-full bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Concept Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">
                  {selectedConcept.name}
                </CardTitle>
                <Badge className={levelColorClass}>
                  {selectedConcept.levelName ||
                    levelNames[
                      selectedConcept.level as keyof typeof levelNames
                    ]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {selectedConcept.description}
              </p>

              <Tabs defaultValue="reasoning" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
                  <TabsTrigger value="relationships">Relationships</TabsTrigger>
                </TabsList>
                <TabsContent value="reasoning" className="mt-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">
                      Categorization Reasoning
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedConcept.reasoning}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="relationships" className="mt-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Related Concepts</h4>
                    {selectedConcept.relatedConcepts.map((concept) => (
                      <div
                        key={concept.id}
                        className="bg-gray-50 p-3 rounded-md"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex justify-between items-center cursor-pointer">
                                <span className="font-medium">
                                  {concept.name}
                                </span>
                                <Badge variant="outline">
                                  {concept.relationship}
                                </Badge>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to view this concept</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Separator className="my-2" />
                        <p className="text-xs text-gray-500">
                          Click to view details
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConceptDetailsSidebar;
