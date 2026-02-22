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

export const useQuizStore = create<QuizStore>((set, get) => ({
  language: "en",
  status: "idle",
  roundDuration: 75,
  questions: [],
  currentIndex: 0,
  score: 0,
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
    const gained = isCorrect ? 10 : 0;

    set({
      answered: true,
      selectedAnswer: answer,
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
      answers: [],
      selectedAnswer: null,
      answered: false,
      startedAt: null,
    }),
}));
