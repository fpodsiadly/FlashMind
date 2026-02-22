"use client";

import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { fetchQuestions } from "@/app/services/client-api";
import { useQuizStore } from "@/app/hooks/use-quiz-store";
import { useQuizTimer } from "@/app/hooks/use-quiz-timer";
import { LanguageToggle } from "@/app/components/language-toggle";
import { QuestionCard } from "@/app/components/question-card";
import { ResultsCard } from "@/app/components/results-card";
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
        answers,
        roundDuration,
    } = useQuizStore();

    const startMutation = useMutation({ mutationFn: fetchQuestions });

    const question = questions[currentIndex];
    const questionKey = useMemo(() => currentIndex * 100 + answers.length, [currentIndex, answers.length]);

    const timer = useQuizTimer(roundDuration, questionKey, () => {
        if (status === "playing" && question && !answered) {
            submitAnswer("", roundDuration);
        }
    });

    const handleStart = async () => {
        setLoading();
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
                    <p className="text-sm text-indigo-200">Simple quiz • 20 questions • neon dark mode</p>
                </div>
                <LanguageToggle value={language} onChange={setLanguage} />
            </header>

            <div className="space-y-4">
                {status === "idle" && (
                    <Card>
                        <CardContent className="space-y-4 p-6">
                            <p className="text-indigo-100">Ready for a simple 20-question round?</p>
                            <Button className="w-full sm:w-auto" size="lg" onClick={handleStart} disabled={startMutation.isPending}>
                                {startMutation.isPending ? "Loading..." : "Start Quiz"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {status === "playing" && question && (
                    <>
                        <Card>
                            <CardContent className="grid gap-3 p-5 sm:grid-cols-1">
                                <div>
                                    <p className="text-xs uppercase text-indigo-200">Score</p>
                                    <p className="text-2xl font-bold">{score}</p>
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
                        onReset={resetRound}
                    />
                )}
            </div>
        </main>
    );
}
