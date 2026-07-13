import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function summarizeWithGroq(text: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a document summarizer. Give clear, concise summaries.",
      },
      {
        role: "user",
        content: `Summarize this document in bullet points:\n\n${text}`,
      },
    ],
    max_tokens: 1024,
  });

  return response.choices[0]?.message?.content ?? "No summary generated.";
}