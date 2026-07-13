import Dexie, { type Table } from "dexie";

export interface Summary {
  id?: number;
  filename: string;
  mode: "groq" | "ollama" | "browser";
  model: string;
  summary: string;
  ttft: number; // time to first token in ms
  createdAt: Date;
}

class NexusDB extends Dexie {
  summaries!: Table<Summary>;

  constructor() {
    super("NexusAI");
    this.version(1).stores({
      summaries: "++id, filename, mode, createdAt",
    });
  }
}

export const db = new NexusDB();

export async function saveSummary(data: Omit<Summary, "id">) {
  return await db.summaries.add(data);
}

export async function getAllSummaries() {
  return await db.summaries.orderBy("createdAt").reverse().toArray();
}