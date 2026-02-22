"use client";

import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export function ResultsCard({
    language,
    score,
    correctCount,
    incorrectCount,
    onReset,
}: {
    language: "en" | "pl";
    score: number;
    correctCount: number;
    incorrectCount: number;
    onReset: () => void;
}) {
    const t =
        language === "pl"
            ? {
                title: "Runda zakończona",
                score: "Wynik",
                correct: "Poprawne",
                wrong: "Błędne",
                playAgain: "Zagraj ponownie",
            }
            : {
                title: "Round Complete",
                score: "Score",
                correct: "Correct",
                wrong: "Wrong",
                playAgain: "Play Again",
            };

    return (
        <Card>
            <CardHeader>
                <h2 className="text-2xl font-bold neon-title">{t.title}</h2>
            </CardHeader>
            <CardContent className="space-y-3 text-indigo-50">
                <p className="text-lg">
                    {t.score}: {score}
                </p>
                <p>
                    {t.correct}: {correctCount} | {t.wrong}: {incorrectCount}
                </p>
                <Button className="w-full" onClick={onReset}>
                    {t.playAgain}
                </Button>
            </CardContent>
        </Card>
    );
}
