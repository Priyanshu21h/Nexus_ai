const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434";

export type OllamaModel = "qwen2.5-coder:7b" | "qwen3-vl:4b";

export async function summarizeWithOllama(
  text: string,
  model: OllamaModel = "qwen2.5-coder:7b"
): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt: `Summarize this document in bullet points:\n\n${text}`,
      stream: false,
    }),
  });

  if (!response.ok) throw new Error("Ollama not running. Start with: ollama serve");

  const data = await response.json();
  return data.response ?? "No summary generated.";
}