"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { QuizData } from "@/types";

interface QuizPlayerProps {
  quiz: QuizData;
  enrollmentId: string;
  lessonId: string;
  onPass: () => void;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
  results: {
    questionIndex: number;
    correct: boolean;
    explanation?: string;
  }[];
}

export function QuizPlayer({
  quiz,
  enrollmentId,
  lessonId,
  onPass,
}: QuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const sortedQuestions = [...quiz.questions].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  function handleSingleSelect(questionIndex: number, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionIndex]: [optionIndex] }));
  }

  function handleMultiSelect(questionIndex: number, optionIndex: number) {
    setAnswers((prev) => {
      const current = prev[questionIndex] || [];
      const exists = current.includes(optionIndex);
      return {
        ...prev,
        [questionIndex]: exists
          ? current.filter((i) => i !== optionIndex)
          : [...current, optionIndex],
      };
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        lessonId,
        answers: sortedQuestions.map((q, qi) => ({
          questionIndex: qi,
          selectedOptions: answers[qi] || [],
        })),
      };

      const res = await fetch(`/api/enrollments/${enrollmentId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        if (data.passed) {
          onPass();
        }
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setAnswers({});
    setResult(null);
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = sortedQuestions.length;

  if (result) {
    const percentage = Math.round(
      (result.score / result.totalQuestions) * 100
    );
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {result.passed ? "Congratulations!" : "Try Again"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">
                {percentage}%
              </div>
              <p className="text-muted-foreground">
                {result.score} of {result.totalQuestions} correct
              </p>
              <Badge
                variant={result.passed ? "default" : "destructive"}
                className="text-sm"
              >
                {result.passed ? "Passed" : "Not Passed"}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Passing score: {quiz.passingScore}%
              </p>
            </div>

            <Progress value={percentage} className="h-3" />

            <div className="space-y-4 pt-4">
              {sortedQuestions.map((q, qi) => {
                const qResult = result.results.find(
                  (r) => r.questionIndex === qi
                );
                return (
                  <div
                    key={qi}
                    className={`p-4 rounded-lg border ${
                      qResult?.correct
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {qResult?.correct ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{q.questionText}</p>
                        {qResult?.explanation && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {qResult.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!result.passed && (
              <div className="text-center pt-4">
                <Button onClick={handleRetry}>Retry Quiz</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{quiz.title}</h3>
        {quiz.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {quiz.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Passing score: {quiz.passingScore}% &middot; {totalQuestions} questions
        </p>
      </div>

      <div className="space-y-6">
        {sortedQuestions.map((question, qi) => (
          <Card key={qi}>
            <CardHeader className="pb-3">
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-muted-foreground shrink-0">
                  Q{qi + 1}.
                </span>
                <CardTitle className="text-sm font-medium">
                  {question.questionText}
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] w-fit">
                {question.questionType === "multiple-choice"
                  ? "Single answer"
                  : question.questionType === "multi-select"
                  ? "Multiple answers"
                  : "True / False"}
              </Badge>
            </CardHeader>
            <CardContent>
              {question.questionType === "multiple-choice" ||
              question.questionType === "true-false" ? (
                <RadioGroup
                  value={answers[qi]?.[0]?.toString() || ""}
                  onValueChange={(v) =>
                    handleSingleSelect(qi, parseInt(v))
                  }
                >
                  {question.options
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((opt, oi) => (
                      <div
                        key={oi}
                        className="flex items-center space-x-2 py-1"
                      >
                        <RadioGroupItem
                          value={oi.toString()}
                          id={`q${qi}-o${oi}`}
                        />
                        <Label
                          htmlFor={`q${qi}-o${oi}`}
                          className="font-normal cursor-pointer"
                        >
                          {opt.text}
                        </Label>
                      </div>
                    ))}
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  {question.options
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((opt, oi) => (
                      <div
                        key={oi}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`q${qi}-o${oi}`}
                          checked={answers[qi]?.includes(oi) || false}
                          onCheckedChange={() =>
                            handleMultiSelect(qi, oi)
                          }
                        />
                        <Label
                          htmlFor={`q${qi}-o${oi}`}
                          className="font-normal cursor-pointer"
                        >
                          {opt.text}
                        </Label>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {answeredCount} of {totalQuestions} answered
        </p>
        <Button
          onClick={handleSubmit}
          disabled={submitting || answeredCount < totalQuestions}
        >
          {submitting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
          {submitting ? "Submitting..." : "Submit Quiz"}
        </Button>
      </div>
    </div>
  );
}
