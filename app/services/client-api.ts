import { Language, QuizQuestion } from "@/app/utils/types";

export async function fetchQuestions(language: Language): Promise<QuizQuestion[]> {
  const response = await fetch(`/api/questions?lang=${language}`);
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  const data = (await response.json()) as { questions: QuizQuestion[] };
  return data.questions;
}
