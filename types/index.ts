export type Mode = "groq" | "ollama" | "browser";

export type OllamaModel = "qwen2.5-coder:7b" | "qwen3-vl:4b";

export interface Summary {
  id?: number;
  filename: string;
  mode: Mode;
  model: string;
  summary: string;
  ttft: number;
  createdAt: Date;
}

export interface SummarizeResult {
  summary: string;
  ttft: number;
  mode: Mode;
  model: string;
}

export interface ModeStatus {
  groq: boolean;
  ollama: boolean;
  browser: boolean;
}