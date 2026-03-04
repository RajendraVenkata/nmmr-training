"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { QuizData, QuizQuestion, QuizOption } from "@/types";

interface QuizBuilderProps {
  value: QuizData;
  onChange: (value: QuizData) => void;
}

function emptyOption(order: number): QuizOption {
  return { text: "", isCorrect: false, order };
}

function emptyQuestion(order: number): QuizQuestion {
  return {
    questionText: "",
    questionType: "multiple-choice",
    options: [emptyOption(0), emptyOption(1), emptyOption(2), emptyOption(3)],
    explanation: "",
    order,
  };
}

export function QuizBuilder({ value, onChange }: QuizBuilderProps) {
  const [expandedQ, setExpandedQ] = useState<number | null>(0);

  function updateQuiz(updates: Partial<QuizData>) {
    onChange({ ...value, ...updates });
  }

  function updateQuestion(index: number, updates: Partial<QuizQuestion>) {
    const questions = [...value.questions];
    questions[index] = { ...questions[index], ...updates };
    updateQuiz({ questions });
  }

  function addQuestion() {
    const questions = [
      ...value.questions,
      emptyQuestion(value.questions.length),
    ];
    updateQuiz({ questions });
    setExpandedQ(questions.length - 1);
  }

  function removeQuestion(index: number) {
    const questions = value.questions
      .filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, order: i }));
    updateQuiz({ questions });
    if (expandedQ === index) setExpandedQ(null);
  }

  function updateOption(
    qIndex: number,
    oIndex: number,
    updates: Partial<QuizOption>
  ) {
    const questions = [...value.questions];
    const options = [...questions[qIndex].options];
    options[oIndex] = { ...options[oIndex], ...updates };
    questions[qIndex] = { ...questions[qIndex], options };
    updateQuiz({ questions });
  }

  function addOption(qIndex: number) {
    const questions = [...value.questions];
    const options = [
      ...questions[qIndex].options,
      emptyOption(questions[qIndex].options.length),
    ];
    questions[qIndex] = { ...questions[qIndex], options };
    updateQuiz({ questions });
  }

  function removeOption(qIndex: number, oIndex: number) {
    const questions = [...value.questions];
    const options = questions[qIndex].options
      .filter((_, i) => i !== oIndex)
      .map((o, i) => ({ ...o, order: i }));
    questions[qIndex] = { ...questions[qIndex], options };
    updateQuiz({ questions });
  }

  return (
    <div className="space-y-6">
      {/* Quiz metadata */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Quiz Title</Label>
          <Input
            value={value.title}
            onChange={(e) => updateQuiz({ title: e.target.value })}
            placeholder="e.g. AI Fundamentals Quiz"
          />
        </div>
        <div className="space-y-2">
          <Label>Passing Score (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={value.passingScore}
            onChange={(e) =>
              updateQuiz({ passingScore: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={value.description}
          onChange={(e) => updateQuiz({ description: e.target.value })}
          placeholder="Brief description of this quiz"
          rows={2}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={value.shuffleQuestions}
          onCheckedChange={(checked) =>
            updateQuiz({ shuffleQuestions: checked === true })
          }
        />
        <Label className="font-normal">Shuffle question order</Label>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            Questions ({value.questions.length})
          </h3>
          <Button type="button" size="sm" onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-1" />
            Add Question
          </Button>
        </div>

        {value.questions.map((q, qIdx) => (
          <Card key={qIdx}>
            <CardHeader
              className="cursor-pointer py-3"
              onClick={() =>
                setExpandedQ(expandedQ === qIdx ? null : qIdx)
              }
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  Q{qIdx + 1}:{" "}
                  {q.questionText || (
                    <span className="text-muted-foreground italic">
                      Untitled question
                    </span>
                  )}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeQuestion(qIdx);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {expandedQ === qIdx && (
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Textarea
                    value={q.questionText}
                    onChange={(e) =>
                      updateQuestion(qIdx, {
                        questionText: e.target.value,
                      })
                    }
                    placeholder="Enter your question"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={q.questionType}
                    onValueChange={(v) =>
                      updateQuestion(qIdx, {
                        questionType: v as QuizQuestion["questionType"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">
                        Multiple Choice
                      </SelectItem>
                      <SelectItem value="multi-select">
                        Multi-Select
                      </SelectItem>
                      <SelectItem value="true-false">True / False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <Label>Options</Label>
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        checked={opt.isCorrect}
                        onCheckedChange={(checked) =>
                          updateOption(qIdx, oIdx, {
                            isCorrect: checked === true,
                          })
                        }
                      />
                      <Input
                        value={opt.text}
                        onChange={(e) =>
                          updateOption(qIdx, oIdx, {
                            text: e.target.value,
                          })
                        }
                        placeholder={`Option ${oIdx + 1}`}
                        className="flex-1"
                      />
                      {q.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeOption(qIdx, oIdx)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {q.options.length < 6 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(qIdx)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Option
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Check the box next to the correct answer(s).
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Explanation (shown after answering)</Label>
                  <Textarea
                    value={q.explanation}
                    onChange={(e) =>
                      updateQuestion(qIdx, {
                        explanation: e.target.value,
                      })
                    }
                    placeholder="Explain why the correct answer is correct"
                    rows={2}
                  />
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
