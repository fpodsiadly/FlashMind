"use client";

import { create } from "zustand";
import { Language, QuestionAnswer, QuizQuestion } from "@/app/utils/types";

type QuizStatus = "idle" | "loading" | "playing" | "finished";

type QuizStore = {
  language: Language;
  status: QuizStatus;
  roundDuration: number;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  streak: number;
  bestStreak: number;
  multiplier: number;
  bestMultiplier: number;
  answers: QuestionAnswer[];
  selectedAnswer: string | null;
  answered: boolean;
  startedAt: number | null;
  setLanguage: (language: Language) => void;
  setLoading: () => void;
  startRound: (questions: QuizQuestion[]) => void;
  submitAnswer: (answer: string, timeSpentSecond: number) => void;
  nextQuestion: () => void;
  finishRound: () => void;
  resetRound: () => void;
};

const calculateMultiplier = (streak: number) => {
  const levels = Math.floor(streak / 3);
  return Math.min(1 + levels * 0.25, 3);
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  language: "en",
  status: "idle",
  roundDuration: 75,
  questions: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  multiplier: 1,
  bestMultiplier: 1,
  answers: [],
  selectedAnswer: null,
  answered: false,
  startedAt: null,
  setLanguage: (language) => set({ language }),
  setLoading: () => set({ status: "loading" }),
  startRound: (questions) =>
    set({
      questions,
      status: "playing",
      currentIndex: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      multiplier: 1,
      bestMultiplier: 1,
      answers: [],
      selectedAnswer: null,
      answered: false,
      startedAt: Date.now(),
    }),
  submitAnswer: (answer, timeSpentSecond) => {
    const state = get();
    if (state.status !== "playing" || state.answered) {
      return;
    }

    const question = state.questions[state.currentIndex];
    const isCorrect = answer === question.correctAnswer;
    const nextStreak = isCorrect ? state.streak + 1 : 0;
    const nextMultiplier = calculateMultiplier(nextStreak);
    const gained = isCorrect ? Math.round(10 * state.multiplier + Math.max(0, 8 - timeSpentSecond / 10)) : 0;

    set({
      answered: true,
      selectedAnswer: answer,
      streak: nextStreak,
      bestStreak: Math.max(state.bestStreak, nextStreak),
      multiplier: nextMultiplier,
      bestMultiplier: Math.max(state.bestMultiplier, nextMultiplier),
      score: state.score + gained,
      answers: [
        ...state.answers,
        {
          questionIndex: state.currentIndex,
          question: question.question,
          category: question.category,
          difficulty: question.difficulty,
          selectedAnswer: answer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          timeSpentSecond,
        },
      ],
    });
  },
  nextQuestion: () => {
    const state = get();
    const isLast = state.currentIndex >= state.questions.length - 1;

    if (isLast) {
      set({ status: "finished", answered: false, selectedAnswer: null });
      return;
    }

    set({
      currentIndex: state.currentIndex + 1,
      selectedAnswer: null,
      answered: false,
    });
  },
  finishRound: () => set({ status: "finished" }),
  resetRound: () =>
    set({
      status: "idle",
      questions: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      multiplier: 1,
      bestMultiplier: 1,
      answers: [],
      selectedAnswer: null,
      answered: false,
      startedAt: null,
    }),
}));
