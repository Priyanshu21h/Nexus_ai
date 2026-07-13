"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Shield, Zap, Clock, Copy, Check, Download } from "lucide-react";
import type { SummarizeResult } from "@/types";

interface SummaryCardProps {
  result: SummarizeResult;
}

const modeConfig = {
  groq:    { icon: Cloud,  label: "Cloud",   color: "bg-blue-500/10 text-blue-500" },
  browser: { icon: Shield, label: "Browser", color: "bg-green-500/10 text-green-500" },
  ollama:  { icon: Zap,    label: "Local",   color: "bg-amber-500/10 text-amber-500" },
};

export function SummaryCard({ result }: SummaryCardProps) {
  const [copied, setCopied] = useState(false);
  const { icon: Icon, label, color } = modeConfig[result.mode];

  function handleCopy() {
    navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExport() {
    const blob = new Blob([result.summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary-${result.mode}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Summary</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`flex items-center gap-1 ${color}`}>
              <Icon className="w-3 h-3" />
              {label}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {result.ttft}ms
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{result.model}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {result.summary}
        </div>
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            {copied
              ? <><Check className="w-3 h-3" /> Copied</>
              : <><Copy className="w-3 h-3" /> Copy</>
            }
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            Export .txt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}