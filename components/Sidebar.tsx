"use client";

import { useEffect, useState } from "react";
import {
  PanelLeft,
  X,
  Download,
  Trash2,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Clock,
  History,
} from "lucide-react";

import { useTheme } from "next-themes";
import { db } from "@/lib/db";
import type { Summary } from "@/types";

interface SidebarProps {
  history: Summary[];
  onHistoryChange: () => void;
  onSelectHistory: (s: Summary) => void;
}

const modeColor: Record<string, string> = {
  groq: "text-blue-400",
  browser: "text-green-400",
  ollama: "text-amber-400",
};

export function Sidebar({
  history,
  onHistoryChange,
  onSelectHistory,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  function handleDownloadAll() {
    if (history.length === 0) return;

    const content = history
      .map(
        (s, i) =>
          `--- Summary ${i + 1} ---\nFile: ${s.filename}\nMode: ${s.mode} : ${s.model}\nTTFT: ${s.ttft}ms\nDate: ${new Date(s.createdAt).toLocaleString()}\n\n${s.summary}\n`
      )
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `nexus-ai-history-${Date.now()}.txt`;

    a.click();

    URL.revokeObjectURL(url);
  }

  async function handleDeleteOne(
    id: number | undefined,
    e: React.MouseEvent
  ) {
    e.stopPropagation();

    if (!id) return;

    await db.summaries.delete(id);

    onHistoryChange();
  }

  async function handleClearAll() {
    await db.summaries.clear();

    onHistoryChange();
  }

  return (
    <>
      {/* Backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-50 flex">

        {/* Icon bar */}
        <div className="w-12 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-3 gap-1">

          {/* Expand */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
            title="Toggle sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
            title={
              mounted
                ? resolvedTheme === "dark"
                  ? "Light mode"
                  : "Dark mode"
                : "Theme"
            }
          >
            {!mounted ? null : resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* History */}
          <button
            onClick={() => setExpanded(true)}
            className="relative w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
            title="History"
          >
            <History className="w-4 h-4" />

            {history.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-400 rounded-full" />
            )}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Logo */}
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md">
            <span className="text-xs font-black text-zinc-900 leading-none">
              N
            </span>
          </div>
        </div>

        {/* Expanded panel */}
        <div
          className={`
            h-full bg-zinc-900 border-r border-zinc-800 flex flex-col
            transition-all duration-300 overflow-hidden
            ${expanded ? "w-56 opacity-100" : "w-0 opacity-0"}
          `}
        >

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800 shrink-0">
            <span className="text-sm font-semibold text-white">
              Nexus AI
            </span>

            <button
              onClick={() => setExpanded(false)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Themes */}
          <div className="border-b border-zinc-800 shrink-0">
            <button
              onClick={() => setThemesOpen(!themesOpen)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-2 text-zinc-300">

                {!mounted ? null : resolvedTheme === "dark" ? (
                  <Moon className="w-3.5 h-3.5" />
                ) : (
                  <Sun className="w-3.5 h-3.5" />
                )}

                <span className="text-sm">Themes</span>
              </div>

              {themesOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </button>

            {themesOpen && (
              <div className="px-3 pb-3 flex flex-col gap-1">

                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full
                    ${
                      resolvedTheme === "light"
                        ? "bg-white text-zinc-900 font-medium"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  Light
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full
                    ${
                      resolvedTheme === "dark"
                        ? "bg-zinc-700 text-white font-medium"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  Dark
                </button>

              </div>
            )}
          </div>

          {/* History list */}
          <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1">

            <p className="text-xs text-zinc-500 px-2 mb-2 uppercase tracking-widest">
              History
            </p>

            {history.length === 0 ? (
              <p className="text-xs text-zinc-600 text-center mt-8 px-4 leading-relaxed">
                No summaries yet. Start summarizing!
              </p>
            ) : (
              history.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectHistory(s);
                    setExpanded(false);
                  }}
                  className="group relative rounded-lg px-3 py-2.5 hover:bg-zinc-800 transition-colors cursor-pointer"
                >

                  {/* Delete */}
                  <button
                    onClick={(e) => handleDeleteOne(s.id, e)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-900/50"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>

                  {/* Filename */}
                  <p className="text-sm text-white truncate font-medium pr-5">
                    {s.filename}
                  </p>

                  {/* Mode */}
                  <p
                    className={`text-xs font-mono mt-0.5 ${
                      modeColor[s.mode] ?? "text-zinc-400"
                    }`}
                  >
                    {s.mode} : {s.model}
                  </p>

                  {/* TTFT */}
                  <div className="flex items-center justify-between mt-1">

                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {s.ttft}ms
                    </span>

                    <span className="text-xs text-zinc-600">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>

                  </div>

                  {/* Preview */}
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                    {s.summary}
                  </p>

                </div>
              ))
            )}
          </div>

          {/* Bottom actions */}
          <div className="border-t border-zinc-800 px-3 py-3 flex flex-col gap-2 shrink-0">

            <button
              onClick={handleDownloadAll}
              disabled={history.length === 0}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              Download All
            </button>

            <button
              onClick={handleClearAll}
              disabled={history.length === 0}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>

            <p className="text-xs text-zinc-600 text-center pt-1">
              Nexus AI · Tri-Hybrid Summarizer
            </p>

          </div>

        </div>
      </div>
    </>
  );
}