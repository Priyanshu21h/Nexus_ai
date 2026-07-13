import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a document summarizer. Give clear, concise bullet point summaries.",
        },
        {
          role: "user",
          content: `Summarize this document in bullet points:\n\n${text}`,
        },
      ],
      max_tokens: 1024,
    });

    const summary = response.choices[0]?.message?.content ?? "No summary.";
    return NextResponse.json({ summary });

  } catch (err) {
    return NextResponse.json({ error: "Groq failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}