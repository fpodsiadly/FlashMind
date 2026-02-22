import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchTriviaQuestions, pickAdaptiveQuestions } from "@/app/services/opentdb";
import { translateText } from "@/app/services/translation";
import { Language, QuizQuestion } from "@/app/utils/types";

export const dynamic = "force-dynamic";

async function findStrongCategories() {
  const answers = await prisma.quizAnswer.findMany({
    select: {
      category: true,
      isCorrect: true,
    },
  });

  const stats = new Map<string, { total: number; correct: number }>();

  for (const answer of answers) {
    const current = stats.get(answer.category) ?? { total: 0, correct: 0 };
    current.total += 1;
    current.correct += answer.isCorrect ? 1 : 0;
    stats.set(answer.category, current);
  }

  return new Set(
    [...stats.entries()]
      .filter(([, value]) => value.total >= 5 && value.correct / value.total >= 0.7)
      .map(([category]) => category),
  );
}

async function translateQuestion(question: QuizQuestion, lang: Language): Promise<QuizQuestion> {
  if (lang === "en") {
    return question;
  }

  const translatedQuestion = await translateText(question.question, lang);
  const translatedOptions = await Promise.all(question.options.map((option) => translateText(option, lang)));
  const correctIndex = question.options.findIndex((option) => option === question.correctAnswer);

  return {
    ...question,
    question: translatedQuestion,
    options: translatedOptions,
    correctAnswer: translatedOptions[correctIndex] ?? translatedOptions[0],
  };
}

export async function GET(request: NextRequest) {
  try {
    const lang = (request.nextUrl.searchParams.get("lang") ?? "en") as Language;
    const strongCategories = await findStrongCategories();
    const allQuestions = await fetchTriviaQuestions();
    const selected = pickAdaptiveQuestions(allQuestions, strongCategories, 20);

    const translated = await Promise.all(selected.map((question) => translateQuestion(question, lang)));

    return NextResponse.json({ questions: translated });
  } catch {
    return NextResponse.json({ message: "Could not fetch questions" }, { status: 500 });
  }
}
