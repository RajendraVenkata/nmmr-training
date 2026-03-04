import type { QuizData } from "@/types";

export const sampleQuizzes: Record<string, QuizData> = {
  // l4: Quiz: AI Fundamentals (Course 1, Module 1)
  l4: {
    title: "AI Fundamentals Quiz",
    description:
      "Test your understanding of core Generative AI concepts covered in Module 1.",
    passingScore: 70,
    shuffleQuestions: false,
    questions: [
      {
        questionText:
          "What is a Large Language Model (LLM)?",
        questionType: "multiple-choice",
        options: [
          { text: "A database for storing language data", isCorrect: false, order: 0 },
          { text: "A neural network trained on vast amounts of text data", isCorrect: true, order: 1 },
          { text: "A programming language for AI", isCorrect: false, order: 2 },
          { text: "A type of computer hardware", isCorrect: false, order: 3 },
        ],
        explanation:
          "An LLM is a neural network trained on billions of text documents that can generate human-like text, answer questions, and perform language tasks.",
        order: 0,
      },
      {
        questionText:
          "Which of the following are phases of LLM training?",
        questionType: "multi-select",
        options: [
          { text: "Pre-training", isCorrect: true, order: 0 },
          { text: "Fine-tuning", isCorrect: true, order: 1 },
          { text: "Compiling", isCorrect: false, order: 2 },
          { text: "Indexing", isCorrect: false, order: 3 },
        ],
        explanation:
          "LLMs are trained in two main phases: pre-training (learning from large text corpora) and fine-tuning (refining for specific tasks).",
        order: 1,
      },
      {
        questionText:
          "A 'token' in the context of LLMs is the basic unit of text that models process.",
        questionType: "true-false",
        options: [
          { text: "True", isCorrect: true, order: 0 },
          { text: "False", isCorrect: false, order: 1 },
        ],
        explanation:
          "Correct! Tokens are the fundamental building blocks. They can be words, subwords, or characters depending on the tokenization method.",
        order: 2,
      },
      {
        questionText:
          "What does the 'temperature' parameter control in LLM output?",
        questionType: "multiple-choice",
        options: [
          { text: "The speed of generation", isCorrect: false, order: 0 },
          { text: "The length of the response", isCorrect: false, order: 1 },
          { text: "The randomness/creativity of the output", isCorrect: true, order: 2 },
          { text: "The accuracy of facts", isCorrect: false, order: 3 },
        ],
        explanation:
          "Temperature controls randomness: lower values (e.g., 0.1) produce more deterministic output, while higher values (e.g., 1.0) produce more creative/varied responses.",
        order: 3,
      },
      {
        questionText:
          "What is the 'context window' of an LLM?",
        questionType: "multiple-choice",
        options: [
          { text: "The screen where you type prompts", isCorrect: false, order: 0 },
          { text: "The maximum amount of text a model can process at once", isCorrect: true, order: 1 },
          { text: "The time limit for each API call", isCorrect: false, order: 2 },
          { text: "The number of users who can access it simultaneously", isCorrect: false, order: 3 },
        ],
        explanation:
          "The context window is the maximum number of tokens the model can process in a single request, including both input and output.",
        order: 4,
      },
    ],
  },
};

export function getQuizData(lessonId: string): QuizData | null {
  return sampleQuizzes[lessonId] || null;
}
