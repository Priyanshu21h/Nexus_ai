let summarizer: any = null;

export async function summarizeInBrowser(text: string): Promise<string> {
  if (!summarizer) {
    const { pipeline } = await import("@huggingface/transformers");

    summarizer = await pipeline(
      "summarization",
      "Xenova/distilbart-cnn-12-6", // ← already updated here
      { device: "webgpu" }
    );
  }

  const truncated = text.slice(0, 2000);

  const result = await summarizer(truncated, {
    max_new_tokens: 300,
    min_new_tokens: 80,
    no_repeat_ngram_size: 3,
  });

  return result[0]?.summary_text ?? "No summary generated.";
}

export function clearBrowserModel() {
  summarizer = null;
}