import { Language, QuizQuestion, QuizRoundHistory, QuizRoundPayload } from "@/app/utils/types";

export async function fetchQuestions(language: Language): Promise<QuizQuestion[]> {
  const response = await fetch(`/api/questions?lang=${language}`);
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  const data = (await response.json()) as { questions: QuizQuestion[] };
  return data.questions;
}

export async function fetchRounds(): Promise<QuizRoundHistory[]> {
  const response = await fetch("/api/rounds?limit=8");
  if (!response.ok) {
    throw new Error("Failed to fetch rounds");
  }
  const data = (await response.json()) as { rounds: QuizRoundHistory[] };
  return data.rounds;
}

export async function saveRound(payload: QuizRoundPayload): Promise<{ id: string }> {
  const response = await fetch("/api/rounds", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save round");
  }

  return (await response.json()) as { id: string };
}
