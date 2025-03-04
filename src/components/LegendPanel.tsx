import React from "react";
import { Card } from "./ui/card";

interface LegendPanelProps {
  levels?: {
    name: string;
    color: string;
    description: string;
  }[];
}

const LegendPanel = ({
  levels = [
    {
      name: "Potentiality",
      color: "#6366F1",
      description: "The realm of pure possibility",
    },
    { name: "Unity", color: "#EC4899", description: "The state of oneness" },
    {
      name: "Duality",
      color: "#F59E0B",
      description: "The principle of opposites",
    },
    {
      name: "Connection",
      color: "#10B981",
      description: "The network of relationships",
    },
    {
      name: "Manifestation",
      color: "#3B82F6",
      description: "The physical expression",
    },
  ],
}: LegendPanelProps) => {
  return (
    <Card className="p-4 bg-white shadow-md rounded-lg w-full max-w-[200px]">
      <h3 className="text-sm font-medium mb-2">01234 Model Legend</h3>
      <div className="space-y-2">
        {levels.map((level, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: level.color }}
            />
            <div className="text-xs">
              <span className="font-medium">{level.name}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LegendPanel;
