"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import type { Summary } from "@/types";

interface HistoryPanelProps {
  history: Summary[];
  onClear: () => void;
}

export function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  if (history.length === 0) return null;

  async function handleClear() {
    await db.summaries.clear();
    onClear();
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">📋 History</CardTitle>
            <p className="text-xs text-muted-foreground">Saved locally in your browser</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex items-center gap-1 text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 max-h-72 overflow-y-auto">
        {history.map((s) => (
          <div key={s.id} className="border rounded-lg p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate max-w-50">{s.filename}</span>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs capitalize">{s.mode}</Badge>
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Clock className="w-2 h-2" />{s.ttft}ms
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{s.summary}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}