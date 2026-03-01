"use client";

import { useState } from "react";
import {
  PlayCircle,
  FileText,
  HelpCircle,
  BookOpen,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LessonFormDialog } from "./LessonFormDialog";
import type { LessonFormData } from "@/lib/validators";

const LESSON_ICONS: Record<string, React.ReactNode> = {
  video: <PlayCircle className="h-3.5 w-3.5" />,
  document: <FileText className="h-3.5 w-3.5" />,
  quiz: <HelpCircle className="h-3.5 w-3.5" />,
  markdown: <BookOpen className="h-3.5 w-3.5" />,
};

interface LessonItem {
  id: string;
  title: string;
  type: "video" | "document" | "quiz" | "markdown";
  duration: string;
  order: number;
  isFree: boolean;
}

interface LessonEditorProps {
  lessons: LessonItem[];
  onAdd: (data: LessonFormData) => void;
  onEdit: (lessonId: string, data: LessonFormData) => void;
  onDelete: (lessonId: string) => void;
}

export function LessonEditor({
  lessons,
  onAdd,
  onEdit,
  onDelete,
}: LessonEditorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);

  function handleEdit(lesson: LessonItem) {
    setEditingLesson(lesson);
    setDialogOpen(true);
  }

  function handleDialogSubmit(data: LessonFormData) {
    if (editingLesson) {
      onEdit(editingLesson.id, data);
    } else {
      onAdd(data);
    }
    setEditingLesson(null);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) setEditingLesson(null);
  }

  return (
    <div className="space-y-2">
      {lessons
        .sort((a, b) => a.order - b.order)
        .map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/50 group"
          >
            <span className="text-muted-foreground">
              {LESSON_ICONS[lesson.type]}
            </span>
            <span className="text-sm flex-1">{lesson.title}</span>
            {lesson.isFree && (
              <Badge variant="outline" className="text-[10px] px-1.5">
                Free
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {lesson.duration}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleEdit(lesson)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onDelete(lesson.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground w-full justify-start"
        onClick={() => {
          setEditingLesson(null);
          setDialogOpen(true);
        }}
      >
        <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
        Add Lesson
      </Button>

      <LessonFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        mode={editingLesson ? "edit" : "create"}
        defaultValues={
          editingLesson
            ? {
                title: editingLesson.title,
                type: editingLesson.type,
                duration: editingLesson.duration,
                isFree: editingLesson.isFree,
              }
            : undefined
        }
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}
