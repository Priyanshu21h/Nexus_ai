import { useState } from "react";
import type { Mode, OllamaModel, SummarizeResult } from "@/types";

export function useSummarize() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function summarize(
    text: string,
    mode: Mode,
    ollamaModel?: OllamaModel
  ): Promise<SummarizeResult | null> {
    setLoading(true);
    setError(null);
    const start = performance.now();

    try {
      let summary = "";
      let model = "";

      if (mode === "groq") {
        const res = await fetch("/api/groq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();
        summary = data.summary;
        model = "llama-3.3-70b-versatile";

      } else if (mode === "ollama") {
        const { summarizeWithOllama } = await import("@/lib/ollama");
        model = ollamaModel ?? "qwen2.5-coder:7b";
        summary = await summarizeWithOllama(text, model as OllamaModel);

      } else {
        const { summarizeInBrowser } = await import("@/lib/browserAI");
        summary = await summarizeInBrowser(text);
        model = "DistilBART (browser)";
      }

      const ttft = Math.round(performance.now() - start);
      return { summary, ttft, mode, model };

    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { summarize, loading, error };
}