export type Language = "en" | "pl";

export type Difficulty = "easy" | "medium" | "hard";

export type RawTriviaQuestion = {
  category: string;
  type: "multiple";
  difficulty: Difficulty;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export type QuizQuestion = {
  id: string;
  category: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: string;
};

export type QuestionAnswer = {
  questionIndex: number;
  question: string;
  category: string;
  difficulty: Difficulty;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpentSecond: number;
};
