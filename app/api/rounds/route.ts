import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { QuizRoundPayload } from "@/app/utils/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 10);
  const rounds = await prisma.quizRound.findMany({
    orderBy: { createdAt: "desc" },
    take: Math.min(20, Math.max(1, limit)),
    select: {
      id: true,
      language: true,
      score: true,
      correctCount: true,
      incorrectCount: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ rounds });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as QuizRoundPayload;

  const created = await prisma.quizRound.create({
    data: {
      language: body.language,
      score: body.score,
      totalQuestions: body.totalQuestions,
      correctCount: body.correctCount,
      incorrectCount: body.incorrectCount,
      streakBest: body.streakBest,
      multiplierBest: body.multiplierBest,
      durationSeconds: body.durationSeconds,
      answers: {
        create: body.answers.map((answer) => ({
          questionIndex: answer.questionIndex,
          category: answer.category,
          difficulty: answer.difficulty,
          question: answer.question,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: answer.correctAnswer,
          isCorrect: answer.isCorrect,
          timeSpentSecond: answer.timeSpentSecond,
        })),
      },
    },
    select: { id: true },
  });

  return NextResponse.json(created, { status: 201 });
}
