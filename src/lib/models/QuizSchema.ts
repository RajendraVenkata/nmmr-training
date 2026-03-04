import { Schema } from "mongoose";

// ============================================================
// Quiz Sub-Schemas (embedded in LessonContent.quizData)
// ============================================================

export interface IOption {
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface IQuestion {
  questionText: string;
  questionType: "multiple-choice" | "multi-select" | "true-false";
  options: IOption[];
  explanation: string;
  order: number;
}

export interface IQuizData {
  title: string;
  description: string;
  passingScore: number;
  shuffleQuestions: boolean;
  questions: IQuestion[];
}

export const OptionSchema = new Schema<IOption>(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

export const QuestionSchema = new Schema<IQuestion>(
  {
    questionText: { type: String, required: true },
    questionType: {
      type: String,
      enum: ["multiple-choice", "multi-select", "true-false"],
      required: true,
    },
    options: [OptionSchema],
    explanation: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

export const QuizDataSchema = new Schema<IQuizData>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    passingScore: { type: Number, default: 70, min: 0, max: 100 },
    shuffleQuestions: { type: Boolean, default: false },
    questions: [QuestionSchema],
  },
  { _id: false }
);
