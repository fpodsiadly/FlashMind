"use client";

import { useEffect, useMemo, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { fetchQuestions, saveRound } from "@/app/services/client-api";
import { useQuizStore } from "@/app/hooks/use-quiz-store";
import { useQuizTimer } from "@/app/hooks/use-quiz-timer";
import { LanguageToggle } from "@/app/components/language-toggle";
import { QuestionCard } from "@/app/components/question-card";
import { ResultsCard } from "@/app/components/results-card";
import { HistoryPanel } from "@/app/components/history-panel";
import { FeatureHooks } from "@/app/components/feature-hooks";
import { TimerBar } from "@/app/components/timer-bar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

export default function HomePage() {
  const {
    language,
    setLanguage,
    status,
    setLoading,
    startRound,
    questions,
    currentIndex,
    answered,
    selectedAnswer,
    submitAnswer,
    nextQuestion,
    finishRound,
    resetRound,
    score,
    streak,
    multiplier,
    bestStreak,
    bestMultiplier,
    answers,
    roundDuration,
    startedAt,
  } = useQuizStore();

  const saveMutation = useMutation({ mutationFn: saveRound });
  const startMutation = useMutation({ mutationFn: fetchQuestions });
  const persistedRound = useRef(false);

  const question = questions[currentIndex];
  const questionKey = useMemo(() => currentIndex * 100 + answers.length, [currentIndex, answers.length]);

  const timer = useQuizTimer(roundDuration, questionKey, () => {
    if (status === "playing" && question && !answered) {
      submitAnswer("", roundDuration);
    }
  });

  useEffect(() => {
    if (status === "finished" && !persistedRound.current && startedAt) {
      persistedRound.current = true;
      const correctCount = answers.filter((item) => item.isCorrect).length;
      const incorrectCount = answers.length - correctCount;
      saveMutation.mutate({
        language,
        score,
        totalQuestions: questions.length,
        correctCount,
        incorrectCount,
        streakBest: bestStreak,
        multiplierBest: bestMultiplier,
        durationSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
        answers,
      });
    }
  }, [status, language, score, questions.length, bestStreak, bestMultiplier, answers, saveMutation, startedAt]);

  const handleStart = async () => {
    setLoading();
    persistedRound.current = false;
    const fetched = await startMutation.mutateAsync(language);
    startRound(fetched);
  };

  const handleOptionSelect = (option: string) => {
    submitAnswer(option, roundDuration - timer.remaining);
  };

  const handleContinue = () => {
    if (currentIndex >= questions.length - 1) {
      finishRound();
      return;
    }
    nextQuestion();
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black neon-title">FlashMind</h1>
          <p className="text-sm text-indigo-200">Adaptive quiz • 20 questions • neon dark mode</p>
        </div>
        <LanguageToggle value={language} onChange={setLanguage} />
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          {status === "idle" && (
            <Card>
              <CardContent className="space-y-4 p-6">
                <p className="text-indigo-100">Ready for a 20-question round with adaptive difficulty and streak multipliers?</p>
                <Button className="w-full sm:w-auto" size="lg" onClick={handleStart} disabled={startMutation.isPending}>
                  {startMutation.isPending ? "Loading..." : "Start Quiz"}
                </Button>
              </CardContent>
            </Card>
          )}

          {status === "playing" && question && (
            <>
              <Card>
                <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase text-indigo-200">Score</p>
                    <p className="text-2xl font-bold">{score}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-indigo-200">Streak</p>
                    <p className="text-2xl font-bold">{streak}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-indigo-200">Multiplier</p>
                    <p className="text-2xl font-bold">x{multiplier.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>

              <TimerBar remaining={timer.remaining} progress={timer.progress} />

              <AnimatePresence mode="wait">
                <QuestionCard
                  key={question.id}
                  question={question}
                  selectedAnswer={selectedAnswer}
                  answered={answered}
                  onSelect={handleOptionSelect}
                  index={currentIndex}
                  total={questions.length}
                />
              </AnimatePresence>

              {answered && (
                <Button className="w-full" size="lg" onClick={handleContinue}>
                  {currentIndex >= questions.length - 1 ? "Finish Round" : "Next Question"}
                </Button>
              )}
            </>
          )}

          {status === "finished" && (
            <ResultsCard
              score={score}
              correctCount={answers.filter((item) => item.isCorrect).length}
              incorrectCount={answers.filter((item) => !item.isCorrect).length}
              bestStreak={bestStreak}
              bestMultiplier={bestMultiplier}
              onReset={resetRound}
            />
          )}
        </section>

        <aside className="space-y-4">
          <HistoryPanel />
          <FeatureHooks />
        </aside>
      </div>
    </main>
  );
}
