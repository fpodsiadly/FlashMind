"use client";

import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export function ResultsCard({
  score,
  correctCount,
  incorrectCount,
  bestStreak,
  bestMultiplier,
  onReset,
}: {
  score: number;
  correctCount: number;
  incorrectCount: number;
  bestStreak: number;
  bestMultiplier: number;
  onReset: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold neon-title">Round Complete</h2>
      </CardHeader>
      <CardContent className="space-y-3 text-indigo-50">
        <p className="text-lg">Score: {score}</p>
        <p>
          Correct: {correctCount} | Wrong: {incorrectCount}
        </p>
        <p>
          Best streak: {bestStreak} | Best multiplier: x{bestMultiplier.toFixed(2)}
        </p>
        <Button className="w-full" onClick={onReset}>
          Play Again
        </Button>
      </CardContent>
    </Card>
  );
}
