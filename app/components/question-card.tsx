"use client";

import { motion } from "framer-motion";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { QuizQuestion } from "@/app/utils/types";
import { cn } from "@/app/utils/cn";

const difficultyLabel: Record<QuizQuestion["difficulty"], string> = {
    easy: "łatwy",
    medium: "średni",
    hard: "trudny",
};

export function QuestionCard({
    language,
    question,
    selectedAnswer,
    answered,
    onSelect,
    index,
    total,
}: {
    language: "en" | "pl";
    question: QuizQuestion;
    selectedAnswer: string | null;
    answered: boolean;
    onSelect: (value: string) => void;
    index: number;
    total: number;
}) {
    const currentDifficultyLabel =
        language === "pl"
            ? difficultyLabel[question.difficulty]
            : question.difficulty;

    return (
        <motion.div key={question.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
                <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge>{question.category}</Badge>
                        <Badge className="capitalize">{currentDifficultyLabel}</Badge>
                        <Badge>
                            {index + 1}/{total}
                        </Badge>
                    </div>
                    <h2 className="text-xl font-semibold text-indigo-50 sm:text-2xl">{question.question}</h2>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {question.options.map((option, optionIdx) => {
                            const label = ["A", "B", "C", "D"][optionIdx] ?? "";
                            const isCorrect = option === question.correctAnswer;
                            const isSelected = selectedAnswer === option;

                            return (
                                <motion.div
                                    key={option}
                                    animate={
                                        answered && isSelected
                                            ? isCorrect
                                                ? { scale: [1, 1.02, 1], boxShadow: "0 0 20px rgba(44, 231, 164, 0.45)" }
                                                : { scale: [1, 1.02, 1], boxShadow: "0 0 20px rgba(255, 77, 148, 0.45)" }
                                            : {}
                                    }
                                >
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        disabled={answered}
                                        onClick={() => onSelect(option)}
                                        className={cn(
                                            "h-16 w-full justify-start gap-3 rounded-xl px-5 text-left text-base",
                                            answered && isCorrect && "border-emerald-300/60 bg-emerald-500/25",
                                            answered && isSelected && !isCorrect && "border-pink-300/60 bg-pink-500/25",
                                        )}
                                    >
                                        <span className="font-black text-indigo-200">{label}</span>
                                        <span className="line-clamp-2">{option}</span>
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
