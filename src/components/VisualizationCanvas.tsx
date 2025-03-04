import React, { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { ZoomIn, ZoomOut, Move, RotateCw, Download } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface VisualizationCanvasProps {
  concepts?: Array<{
    id: string;
    name: string;
    level: number;
    x: number;
    y: number;
    connections: Array<{
      targetId: string;
      relationship: string;
    }>;
  }>;
  onConceptClick?: (conceptId: string) => void;
  isLoading?: boolean;
}

const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({
  concepts = [],
  onConceptClick = () => {},
  isLoading = false,
}) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showEffects, setShowEffects] = useState(false);
  // Level colors for the 01234 model
  const levelColors = [
    "#6366F1", // Potentiality - Indigo
    "#EC4899", // Unity - Pink
    "#F59E0B", // Duality - Amber
    "#10B981", // Connection - Emerald
    "#3B82F6", // Manifestation - Blue
  ];

  // Level names for the 01234 model
  const levelNames = [
    "Potencialidad",
    "Unidad",
    "Dualidad",
    "Conexión",
    "Manifestación",
  ];

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (concepts.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas dimensions to fit container
      const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth - 16; // Subtract padding
          canvas.height = container.clientHeight - 16; // Subtract padding
          renderCanvas();
        }
      };

      // Add resize listener
      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      // Function to render canvas content
      function renderCanvas() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply transformations
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);

        // Draw connections first (so they appear behind nodes)
        concepts.forEach((concept) => {
          concept.connections.forEach((connection) => {
            const target = concepts.find((c) => c.id === connection.targetId);
            if (target) {
              // Scale coordinates to fit canvas
              const sourceX = (concept.x / 800) * canvas.width;
              const sourceY = (concept.y / 600) * canvas.height;
              const targetX = (target.x / 800) * canvas.width;
              const targetY = (target.y / 600) * canvas.height;

              ctx.beginPath();
              ctx.moveTo(sourceX, sourceY);
              ctx.lineTo(targetX, targetY);
              ctx.strokeStyle = "#CBD5E1"; // Light gray line
              ctx.lineWidth = 1;
              ctx.stroke();

              // Draw relationship text
              const midX = (sourceX + targetX) / 2;
              const midY = (sourceY + targetY) / 2;

              // Add white background to make text more readable
              const relationshipText = connection.relationship;
              const textWidth = ctx.measureText(relationshipText).width;
              ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
              ctx.fillRect(
                midX - textWidth / 2 - 4,
                midY - 12,
                textWidth + 8,
                16,
              );

              // Draw text
              ctx.fillStyle = "#334155"; // Darker text color
              ctx.font = "bold 11px sans-serif";
              ctx.textAlign = "center";
              ctx.fillText(relationshipText, midX, midY - 5);
            }
          });
        });

        // Draw nodes
        concepts.forEach((concept) => {
          // Scale coordinates to fit canvas
          const scaledX = (concept.x / 800) * canvas.width;
          const scaledY = (concept.y / 600) * canvas.height;

          // Draw circle
          ctx.beginPath();
          ctx.arc(scaledX, scaledY, 35, 0, 2 * Math.PI);
          ctx.fillStyle = levelColors[concept.level] || "#94A3B8";
          ctx.fill();
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Add level indicator
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.beginPath();
          ctx.arc(scaledX + 25, scaledY - 25, 12, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = levelColors[concept.level] || "#94A3B8";
          ctx.font = "bold 12px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(concept.level.toString(), scaledX + 25, scaledY - 25);

          // Draw concept name
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Handle long concept names
          const maxLength = 15;
          let displayName = concept.name;
          if (displayName.length > maxLength) {
            displayName = displayName.substring(0, maxLength - 3) + "...";
          }
          ctx.fillText(displayName, scaledX, scaledY);
        });

        // Add visual effects if enabled
        if (showEffects) {
          // Add subtle glow effect to nodes
          concepts.forEach((concept) => {
            const scaledX = (concept.x / 800) * canvas.width;
            const scaledY = (concept.y / 600) * canvas.height;

            // Create radial gradient for glow effect
            const gradient = ctx.createRadialGradient(
              scaledX,
              scaledY,
              35,
              scaledX,
              scaledY,
              60,
            );
            gradient.addColorStop(0, `${levelColors[concept.level]}33`); // Semi-transparent
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.beginPath();
            ctx.arc(scaledX, scaledY, 60, 0, 2 * Math.PI);
            ctx.fillStyle = gradient;
            ctx.fill();
          });
        }

        // Restore canvas state
        ctx.restore();
      }

      // Clean up event listener on unmount
      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, [concepts, levelColors]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleToggleEffects = () => {
    setShowEffects((prev) => !prev);
  };

  const handleExport = () => {
    if (!canvasRef.current || concepts.length === 0) return;

    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = "01234-concept-map.png";
    link.href = dataUrl;
    link.click();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging || concepts.length === 0) return;
    if (concepts.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Adjust for pan and zoom
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    // Check if a node was clicked
    for (const concept of concepts) {
      // Scale coordinates to match the canvas
      const scaledX = (concept.x / 800) * canvas.width;
      const scaledY = (concept.y / 600) * canvas.height;

      const dx = scaledX - x;
      const dy = scaledY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= 35) {
        // 35 is the radius of the node
        onConceptClick(concept.id);
        break;
      }
    }
  };

  return (
    <Card className="w-full h-full bg-slate-50 rounded-none border-0 relative overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : concepts.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <p className="text-lg font-medium">No concepts to visualize</p>
          <p className="text-sm">
            Enter text and click "Analyze Concepts" to begin
          </p>
        </div>
      ) : (
        <div className="w-full h-full p-4 overflow-hidden relative">
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleZoomIn}
                    className="bg-white shadow-md"
                  >
                    <ZoomIn size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleZoomOut}
                    className="bg-white shadow-md"
                  >
                    <ZoomOut size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleReset}
                    className="bg-white shadow-md"
                  >
                    <RotateCw size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleToggleEffects}
                    className={`${showEffects ? "bg-indigo-100" : "bg-white"} shadow-md`}
                  >
                    <Move size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Visual Effects</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleExport}
                    className="bg-white shadow-md"
                    disabled={concepts.length === 0}
                  >
                    <Download size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export as PNG</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="absolute bottom-6 right-6 z-10 bg-white px-3 py-1 rounded-md shadow-md text-xs">
            Zoom: {Math.round(scale * 100)}%
          </div>

          <canvas
            ref={canvasRef}
            className="w-full h-full bg-white rounded-lg border border-slate-200"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{
              display: "block",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default VisualizationCanvas;
