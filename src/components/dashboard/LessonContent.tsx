"use client";

import {
  PlayCircle,
  FileText,
  HelpCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LessonType } from "@/types";

interface LessonContentProps {
  lesson: {
    id: string;
    title: string;
    type: LessonType;
    duration: string;
  };
  content: string;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onNext: (() => void) | null;
  onPrevious: (() => void) | null;
}

function VideoPlaceholder() {
  return (
    <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center gap-3 border">
      <PlayCircle className="h-16 w-16 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground text-center px-4">
        Video player will be available when course content is uploaded.
      </p>
    </div>
  );
}

function DocumentPlaceholder() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
        <FileText className="h-16 w-16 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground text-center">
          Document viewer will be available when content is uploaded.
        </p>
      </CardContent>
    </Card>
  );
}

function QuizPlaceholder() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
        <HelpCircle className="h-16 w-16 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground text-center">
          Interactive quiz will be available once questions are configured.
        </p>
      </CardContent>
    </Card>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (match) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg !my-4 text-sm"
                >
                  {codeString}
                </SyntaxHighlighter>
              );
            }

            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function LessonContent({
  lesson,
  content,
  isCompleted,
  onMarkComplete,
  onNext,
  onPrevious,
}: LessonContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs capitalize">
            {lesson.type}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {lesson.duration}
          </span>
        </div>
        <h2 className="text-xl font-bold">{lesson.title}</h2>
      </div>

      {lesson.type === "video" && <VideoPlaceholder />}
      {lesson.type === "document" && <DocumentPlaceholder />}
      {lesson.type === "quiz" && <QuizPlaceholder />}
      {lesson.type === "markdown" && <MarkdownContent content={content} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
        <div>
          {isCompleted ? (
            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </Badge>
          ) : (
            <Button onClick={onMarkComplete} variant="outline" size="sm">
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Mark as Complete
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious ?? undefined}
            disabled={!onPrevious}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            size="sm"
            onClick={onNext ?? undefined}
            disabled={!onNext}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
