import type { QuizData } from "@/types";

export const sampleQuizzes: Record<string, QuizData> = {
  // B1 — AI Foundations Quiz (placed on a conceptual lesson in Module B1.4)
  l32: {
    title: "AI Fundamentals Quiz",
    description:
      "Test your understanding of core AI and LLM concepts covered in Foundations of AI & LLMs.",
    passingScore: 70,
    shuffleQuestions: false,
    questions: [
      {
        questionText:
          "What is a Large Language Model (LLM)?",
        questionType: "multiple-choice",
        options: [
          { text: "A database for storing language data", isCorrect: false, order: 0 },
          { text: "A neural network trained on vast amounts of text data that generates human-like text", isCorrect: true, order: 1 },
          { text: "A programming language for AI", isCorrect: false, order: 2 },
          { text: "A type of computer hardware", isCorrect: false, order: 3 },
        ],
        explanation:
          "An LLM is a neural network trained on billions of text documents that can generate human-like text, answer questions, and perform language tasks.",
        order: 0,
      },
      {
        questionText:
          "What does the 'context window' of an LLM refer to?",
        questionType: "multiple-choice",
        options: [
          { text: "The screen where you type prompts", isCorrect: false, order: 0 },
          { text: "The maximum amount of text (tokens) a model can process at once", isCorrect: true, order: 1 },
          { text: "The time limit for each API call", isCorrect: false, order: 2 },
          { text: "The number of users who can access it simultaneously", isCorrect: false, order: 3 },
        ],
        explanation:
          "The context window is the maximum number of tokens the model can process in a single request, including both input and output. Modern models range from 4K to over 1M tokens.",
        order: 1,
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
          "Temperature controls randomness: 0.0 produces deterministic output, while higher values (e.g., 1.0+) produce more creative and varied responses.",
        order: 2,
      },
      {
        questionText:
          "Which of the following are components of the ReAct agent pattern?",
        questionType: "multi-select",
        options: [
          { text: "Thought (reasoning about the next step)", isCorrect: true, order: 0 },
          { text: "Action (calling a tool)", isCorrect: true, order: 1 },
          { text: "Observation (receiving tool results)", isCorrect: true, order: 2 },
          { text: "Compilation (building the code)", isCorrect: false, order: 3 },
        ],
        explanation:
          "The ReAct pattern interleaves Thought → Action → Observation in a loop until the agent reaches a final answer.",
        order: 3,
      },
      {
        questionText:
          "RAG (Retrieval Augmented Generation) allows LLMs to answer questions using your private data without retraining the model.",
        questionType: "true-false",
        options: [
          { text: "True", isCorrect: true, order: 0 },
          { text: "False", isCorrect: false, order: 1 },
        ],
        explanation:
          "Correct! RAG retrieves relevant documents at query time and includes them in the prompt, allowing the LLM to answer based on your data without fine-tuning.",
        order: 4,
      },
    ],
  },
};

export function getQuizData(lessonId: string): QuizData | null {
  return sampleQuizzes[lessonId] || null;
}
