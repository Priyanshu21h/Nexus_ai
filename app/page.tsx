"use client";

import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ModeSelector } from "@/components/ModeSelector";
import { SummaryCard } from "@/components/SummaryCard";
import { TTFTChart } from "@/components/TTFTChart";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSummarize } from "@/hooks/useSummarize";
import { useHistory } from "@/hooks/useHistory";
import type { Mode, OllamaModel, SummarizeResult, Summary } from "@/types";
import { Loader2, Sparkles } from "lucide-react";

export default function Home() {
  const [text, setText] = useState("");
  const [filename, setFilename] = useState("");
  const [mode, setMode] = useState<Mode>("groq");
  const [ollamaModel, setOllamaModel] = useState<OllamaModel>("qwen2.5-coder:7b");
  const [result, setResult] = useState<SummarizeResult | null>(null);

  const { summarize, loading, error } = useSummarize();
  const { history, save, reload } = useHistory();

  async function handleSummarize() {
    if (!text.trim()) return;
    const res = await summarize(text, mode, ollamaModel);
    if (!res) return;
    setResult(res);
    await save({
      filename: filename || "Untitled",
      mode: res.mode,
      model: res.model,
      summary: res.summary,
      ttft: res.ttft,
      createdAt: new Date(),
    });
  }

  function handleSelectHistory(s: Summary) {
    setResult({
      summary: s.summary,
      ttft: s.ttft,
      mode: s.mode as Mode,
      model: s.model,
    });
    setFilename(s.filename);
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Sidebar — manages its own open/close state */}
      <Sidebar
        history={history}
        onHistoryChange={reload}
        onSelectHistory={handleSelectHistory}
      />

      {/* All page content offset by narrow bar width (48px = w-12) */}
      <div className="ml-12">

        {/* Header */}
        <div className="border-b px-6 py-3 flex items-center justify-between sticky top-0 bg-background z-30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h1 className="text-base font-semibold tracking-tight">Nexus AI</h1>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Tri-Hybrid Summarizer
            </span>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Cloud · Browser · Local
          </span>
        </div>

        {/* Main content */}
        <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">

          <ModeSelector
            mode={mode}
            ollamaModel={ollamaModel}
            onModeChange={setMode}
            onModelChange={setOllamaModel}
          />

          <FileUpload
            onTextExtracted={(t, f) => { setText(t); setFilename(f); }}
            isLoading={loading}
          />

          <Card>
            <CardContent className="pt-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Or paste your text here..."
                rows={5}
                className="w-full text-sm bg-transparent resize-none outline-none placeholder:text-muted-foreground"
              />
            </CardContent>
          </Card>

          <Button
            onClick={handleSummarize}
            disabled={loading || !text.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Summarizing...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" />Summarize</>
            )}
          </Button>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {result && <SummaryCard result={result} />}
          {history.length > 0 && <TTFTChart history={history} />}

        </main>
      </div>
    </div>
  );
}