"use client";

import { Cloud, Shield, Zap, AlertTriangle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Mode, OllamaModel } from "@/types";

interface ModeSelectorProps {
  mode: Mode;
  ollamaModel: OllamaModel;
  onModeChange: (mode: Mode) => void;
  onModelChange: (model: OllamaModel) => void;
}

export function ModeSelector({
  mode,
  ollamaModel,
  onModeChange,
  onModelChange,
}: ModeSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as Mode)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="groq" className="flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Cloud
          </TabsTrigger>
          <TabsTrigger value="browser" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Browser
          </TabsTrigger>
          <TabsTrigger value="ollama" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Local
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Ollama model picker */}
      {mode === "ollama" && (
        <select
          value={ollamaModel}
          onChange={(e) => onModelChange(e.target.value as OllamaModel)}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
        >
          <option value="qwen2.5-coder:7b">Qwen 2.5 Coder 7B — Smart</option>
          <option value="qwen3-vl:4b">Qwen 3 VL 4B — Fast</option>
        </select>
      )}

      {/* Mode description + browser warning */}
      {mode === "browser" ? (
        <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Lower accuracy · Full privacy · No data leaves browser · Works offline
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center">
          {mode === "groq" && "Fastest — requires internet. Uses Groq LPU cloud."}
          {mode === "ollama" && "Power mode — uses your local Qwen model via Ollama."}
        </p>
      )}
    </div>
  );
}