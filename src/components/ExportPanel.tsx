import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Download, Share2, Copy, Check } from "lucide-react";

interface ExportPanelProps {
  onExportImage?: () => void;
  onGenerateShareLink?: () => Promise<string>;
  isVisualizationEmpty?: boolean;
}

const ExportPanel = ({
  onExportImage = () => {},
  onGenerateShareLink = async () =>
    "https://infallible-galileo4-vu684.dev-2.tempolabs.ai/shared/visualization/123",
  isVisualizationEmpty = false,
}: ExportPanelProps) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleExportImage = () => {
    onExportImage();
  };

  const handleShareClick = async () => {
    const link = await onGenerateShareLink();
    setShareLink(link);
    setIsShareDialogOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full h-[60px] bg-gray-100 border-t border-gray-200 flex items-center justify-center px-4">
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportImage}
                disabled={isVisualizationEmpty}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export as Image
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download visualization as PNG image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareClick}
              disabled={isVisualizationEmpty}
              className="flex items-center gap-2"
            >
              <Share2 size={16} />
              Share Visualization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Visualization</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2 mt-4">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  value={shareLink}
                  readOnly
                  className="w-full"
                />
              </div>
              <Button size="sm" className="px-3" onClick={handleCopyLink}>
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                <span className="sr-only">Copy</span>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Anyone with this link will be able to view this visualization.
            </p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ExportPanel;
