import { useState, useEffect } from "react";
import { getAllSummaries, saveSummary } from "@/lib/db";
import type { Summary } from "@/types";

export function useHistory() {
  const [history, setHistory] = useState<Summary[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const all = await getAllSummaries();
    setHistory(all);
  }

  async function save(data: Omit<Summary, "id">) {
    await saveSummary(data);
    await load();
  }

  return { history, save, reload: load };
}