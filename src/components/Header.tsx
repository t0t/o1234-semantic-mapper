import React from "react";
import { Button } from "./ui/button";
import { Menu, HelpCircle, Settings, Code } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  onHelpClick?: () => void;
  onSettingsClick?: () => void;
  onPromptConfigClick?: () => void;
}

const Header = ({
  title = "01234 Semantic Mapper",
  onMenuClick = () => {},
  onHelpClick = () => {},
  onSettingsClick = () => {},
  onPromptConfigClick = () => {},
}: HeaderProps) => {
  return (
    <header className="w-full h-16 bg-slate-900 text-white flex items-center justify-between px-4 shadow-md">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-white hover:bg-slate-800"
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onPromptConfigClick}
                className="text-white hover:bg-slate-800"
              >
                <Code size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configuración de Prompts</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettingsClick}
                className="text-white hover:bg-slate-800"
              >
                <Settings size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Entrenamiento del Modelo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onHelpClick}
                className="text-white hover:bg-slate-800"
              >
                <HelpCircle size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ayuda</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default Header;
