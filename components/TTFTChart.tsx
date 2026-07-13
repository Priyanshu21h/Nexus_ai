"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Summary } from "@/types";

interface TTFTChartProps {
  history: Summary[];
}

const modeColor: Record<string, string> = {
  groq:    "bg-blue-500",
  browser: "bg-green-500",
  ollama:  "bg-amber-500",
};

export function TTFTChart({ history }: TTFTChartProps) {
  if (history.length === 0) return null;

  const maxTTFT = Math.max(...history.map((s) => s.ttft));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">⚡ Time to First Token (ms)</CardTitle>
        <p className="text-xs text-muted-foreground">Lower = faster</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {history.slice(0, 5).map((s, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground truncate max-w-45">
                {s.filename}
              </span>
              <span className="font-mono font-medium">{s.ttft}ms</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full ${modeColor[s.mode] ?? "bg-gray-400"}`}
                style={{ width: `${(s.ttft / maxTTFT) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground capitalize">{s.mode} · {s.model}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}