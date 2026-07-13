import type { ModeStatus } from "@/types";

export async function detectAvailableModes(): Promise<ModeStatus> {
  const [groq, ollama] = await Promise.all([
    checkGroq(),
    checkOllama(),
  ]);

  return {
    groq,
    ollama,
    browser: typeof window !== "undefined" && !!navigator.gpu,
  };
}

async function checkGroq(): Promise<boolean> {
  try {
    const res = await fetch("/api/groq/health");
    return res.ok;
  } catch {
    return false;
  }
}

async function checkOllama(): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:11434/api/tags", {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}