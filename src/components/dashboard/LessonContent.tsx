"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  HelpCircle,
  ImageIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizPlayer } from "./QuizPlayer";
import { ImageLesson } from "./ImageLesson";
import { TerminalBlock } from "@/components/terminal/TerminalBlock";
import type { LessonType, QuizData } from "@/types";

interface LessonContentProps {
  courseSlug: string;
  courseId: string;
  lesson: {
    id: string;
    title: string;
    type: LessonType;
    duration: string;
    hasContent?: boolean;
  };
  enrollmentId: string;
  token: string;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onNext: (() => void) | null;
  onPrevious: (() => void) | null;
}

interface ContentData {
  type: string;
  markdownContent?: string;
  quizData?: QuizData;
  imageData?: {
    imageUrl: string;
    altText: string;
    caption?: string;
  };
}

function ContentPlaceholder({ type }: { type: LessonType }) {
  const icons: Record<string, React.ReactNode> = {
    markdown: <FileText className="h-16 w-16 text-muted-foreground/50" />,
    document: <FileText className="h-16 w-16 text-muted-foreground/50" />,
    quiz: <HelpCircle className="h-16 w-16 text-muted-foreground/50" />,
    image: <ImageIcon className="h-16 w-16 text-muted-foreground/50" />,
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
        {icons[type]}
        <p className="text-sm text-muted-foreground text-center">
          Content is not yet available for this lesson.
        </p>
      </CardContent>
    </Card>
  );
}

function MarkdownSection({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none">
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

/**
 * Renders markdown content, splitting on :::terminal labId::: blocks
 * and rendering TerminalBlock components inline.
 */
function MarkdownContent({
  content,
  courseId,
  token,
}: {
  content: string;
  courseId: string;
  token: string;
}) {
  // Split content on :::terminal <labId>::: blocks
  const terminalRegex = /:::terminal\s+([\w-]+)\s*:::/g;
  const parts: Array<{ type: "markdown" | "terminal"; content: string }> = [];
  let lastIndex = 0;

  let match;
  while ((match = terminalRegex.exec(content)) !== null) {
    // Add markdown before the terminal block
    if (match.index > lastIndex) {
      const mdContent = content.substring(lastIndex, match.index).trim();
      if (mdContent) {
        parts.push({ type: "markdown", content: mdContent });
      }
    }
    // Add terminal block
    parts.push({ type: "terminal", content: match[1] });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining markdown after last terminal block
  if (lastIndex < content.length) {
    const remaining = content.substring(lastIndex).trim();
    if (remaining) {
      parts.push({ type: "markdown", content: remaining });
    }
  }

  // If no terminal blocks found, render plain markdown
  if (parts.length === 0) {
    return <MarkdownSection content={content} />;
  }

  return (
    <div className="space-y-4">
      {parts.map((part, index) =>
        part.type === "terminal" ? (
          <TerminalBlock
            key={`terminal-${index}`}
            labId={part.content}
            courseId={courseId}
            token={token}
          />
        ) : (
          <MarkdownSection key={`md-${index}`} content={part.content} />
        )
      )}
    </div>
  );
}

export function LessonContent({
  courseSlug,
  courseId,
  lesson,
  enrollmentId,
  token,
  isCompleted,
  onMarkComplete,
  onNext,
  onPrevious,
}: LessonContentProps) {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setContent(null);
    setError(false);

    if (!lesson.hasContent) return;

    setLoading(true);
    fetch(`/api/courses/${courseSlug}/lessons/${lesson.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => setContent(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [courseSlug, lesson.id, lesson.hasContent]);

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

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm text-destructive">
              Failed to load lesson content.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setError(false);
                setLoading(true);
                fetch(`/api/courses/${courseSlug}/lessons/${lesson.id}`)
                  .then((res) => {
                    if (!res.ok) throw new Error("Failed");
                    return res.json();
                  })
                  .then((data) => setContent(data))
                  .catch(() => setError(true))
                  .finally(() => setLoading(false));
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && !content && (
        <ContentPlaceholder type={lesson.type} />
      )}

      {!loading && !error && content && (
        <>
          {(content.type === "markdown" || content.type === "document") &&
            content.markdownContent && (
              <MarkdownContent
                content={content.markdownContent}
                courseId={courseId}
                token={token}
              />
            )}

          {content.type === "quiz" && content.quizData && (
            <QuizPlayer
              quiz={content.quizData}
              enrollmentId={enrollmentId}
              lessonId={lesson.id}
              onPass={onMarkComplete}
            />
          )}

          {content.type === "image" && content.imageData && (
            <ImageLesson
              imageUrl={content.imageData.imageUrl}
              altText={content.imageData.altText}
              caption={content.imageData.caption}
            />
          )}
        </>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
        <div>
          {isCompleted ? (
            <Badge className="bg-green-500/10 text-green-600 gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </Badge>
          ) : lesson.type !== "quiz" ? (
            <Button onClick={onMarkComplete} variant="outline" size="sm">
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Mark as Complete
            </Button>
          ) : null}
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
