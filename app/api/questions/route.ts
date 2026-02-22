import { NextRequest, NextResponse } from "next/server";
import { fetchTriviaQuestions, pickAdaptiveQuestions } from "@/app/services/opentdb";
import { translateText } from "@/app/services/translation";
import { Language, QuizQuestion } from "@/app/utils/types";

export const dynamic = "force-dynamic";

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
    const allQuestions = await fetchTriviaQuestions();
    const selected = pickAdaptiveQuestions(allQuestions, new Set<string>(), 20);

    const translated = await Promise.all(selected.map((question) => translateQuestion(question, lang)));

    return NextResponse.json({ questions: translated });
  } catch {
    return NextResponse.json({ message: "Could not fetch questions" }, { status: 500 });
  }
}
