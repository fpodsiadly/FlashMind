import { decodeText } from "@/app/utils/decode";
import { Difficulty, QuizQuestion, RawTriviaQuestion } from "@/app/utils/types";

type OpenTdbResponse = {
  response_code: number;
  results: RawTriviaQuestion[];
};

const difficultyWeight: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

function shuffle<T>(items: T[]) {
  return [...items]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export async function fetchTriviaQuestions(): Promise<QuizQuestion[]> {
  const res = await fetch("https://opentdb.com/api.php?amount=50&type=multiple", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Open Trivia DB questions");
  }

  const data = (await res.json()) as OpenTdbResponse;

  return data.results.map((item, idx) => {
    const options = shuffle([item.correct_answer, ...item.incorrect_answers]).map((option) => decodeText(option));

    return {
      id: `${idx}-${decodeText(item.question).slice(0, 12)}`,
      category: decodeText(item.category),
      difficulty: item.difficulty,
      question: decodeText(item.question),
      options,
      correctAnswer: decodeText(item.correct_answer),
    };
  });
}

export function pickAdaptiveQuestions(
  questions: QuizQuestion[],
  strongCategories: Set<string>,
  size = 20,
): QuizQuestion[] {
  const scored = questions
    .map((question) => {
      const difficultyBonus = difficultyWeight[question.difficulty];
      const categoryBonus = strongCategories.has(question.category) ? difficultyBonus * 1.2 : (4 - difficultyBonus) * 0.65;

      return {
        question,
        score: Math.random() + categoryBonus,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, size)
    .map((entry) => entry.question);

  return shuffle(scored);
}
