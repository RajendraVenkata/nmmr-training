"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { DocumentEditor } from "@/components/admin/DocumentEditor";
import { QuizBuilder } from "@/components/admin/QuizBuilder";
import { ImageLessonEditor } from "@/components/admin/ImageLessonEditor";
import type { QuizData } from "@/types";

interface LessonInfo {
  id: string;
  title: string;
  type: "markdown" | "document" | "quiz" | "image";
  duration: string;
}

interface CourseInfo {
  _id: string;
  title: string;
}

const emptyQuiz: QuizData = {
  title: "",
  description: "",
  passingScore: 70,
  shuffleQuestions: false,
  questions: [],
};

export default function LessonContentEditPage({
  params,
}: {
  params: { id: string; lessonId: string };
}) {
  const { id: courseId, lessonId } = params;
  const { toast } = useToast();

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [lesson, setLesson] = useState<LessonInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Content state
  const [markdownContent, setMarkdownContent] = useState("");
  const [quizData, setQuizData] = useState<QuizData>(emptyQuiz);
  const [imageData, setImageData] = useState({
    base64: "",
    mimeType: "",
    altText: "",
    caption: "",
  });

  useEffect(() => {
    async function load() {
      try {
        // Fetch course to get lesson info
        const courseRes = await fetch(`/api/admin/courses/${courseId}`);
        if (!courseRes.ok) return;
        const courseData = await courseRes.json();
        setCourse({ _id: courseData._id, title: courseData.title });

        // Find the lesson
        let foundLesson: LessonInfo | null = null;
        for (const mod of courseData.modules || []) {
          for (const l of mod.lessons || []) {
            if (l._id === lessonId) {
              foundLesson = {
                id: l._id,
                title: l.title,
                type: l.type,
                duration: l.duration,
              };
              break;
            }
          }
          if (foundLesson) break;
        }
        setLesson(foundLesson);

        // Fetch existing content
        const contentRes = await fetch(
          `/api/admin/courses/${courseId}/lessons/${lessonId}/content`
        );
        if (contentRes.ok) {
          const content = await contentRes.json();
          if (
            content.type === "markdown" ||
            content.type === "document"
          ) {
            setMarkdownContent(content.markdownContent || "");
          } else if (content.type === "quiz" && content.quizData) {
            setQuizData(content.quizData);
          } else if (content.type === "image" && content.imageData) {
            setImageData(content.imageData);
          }
        }
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId, lessonId]);

  async function handleSave() {
    if (!lesson) return;
    setSaving(true);

    try {
      const body: Record<string, unknown> = { type: lesson.type };

      if (lesson.type === "markdown" || lesson.type === "document") {
        body.markdownContent = markdownContent;
      } else if (lesson.type === "quiz") {
        body.quizData = quizData;
      } else if (lesson.type === "image") {
        body.imageData = imageData;
      }

      const res = await fetch(
        `/api/admin/courses/${courseId}/lessons/${lessonId}/content`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        toast({
          title: "Save failed",
          description: err.error || "Failed to save content",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Content saved successfully" });
    } catch {
      toast({
        title: "Save failed",
        description: "Network error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Not Found</h1>
        <p className="text-muted-foreground">
          Course or lesson not found.
        </p>
        <Button asChild variant="outline">
          <Link href={`/admin/courses/${courseId}/content`}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Content
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/admin/courses/${courseId}/content`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Edit Lesson Content
          </h1>
          <p className="text-muted-foreground mt-1">
            {course.title} &rsaquo; {lesson.title}
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1.5" />
          )}
          Save Content
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary">{lesson.type}</Badge>
        <Badge variant="outline">{lesson.duration}</Badge>
      </div>

      {/* Editor based on type */}
      {lesson.type === "markdown" && (
        <MarkdownEditor
          value={markdownContent}
          onChange={setMarkdownContent}
        />
      )}

      {lesson.type === "document" && (
        <DocumentEditor
          value={markdownContent}
          onChange={setMarkdownContent}
        />
      )}

      {lesson.type === "quiz" && (
        <QuizBuilder value={quizData} onChange={setQuizData} />
      )}

      {lesson.type === "image" && (
        <ImageLessonEditor
          value={imageData}
          onChange={setImageData}
        />
      )}
    </div>
  );
}
