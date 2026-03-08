"use client";

import {
  CheckCircle2,
  Circle,
  FileText,
  HelpCircle,
  BookOpen,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface CourseForSidebar {
  title: string;
  modules: {
    id: string;
    title: string;
    order: number;
    lessons: {
      id: string;
      title: string;
      type: string;
      duration: string;
      order: number;
    }[];
  }[];
}

interface CoursePlayerSidebarProps {
  course: CourseForSidebar;
  currentLessonId: string;
  completedLessons: Set<string>;
  onSelectLesson: (lessonId: string) => void;
  progress: number;
}

const lessonIcons: Record<string, React.ReactNode> = {
  markdown: <BookOpen className="h-3.5 w-3.5" />,
  document: <FileText className="h-3.5 w-3.5" />,
  quiz: <HelpCircle className="h-3.5 w-3.5" />,
  image: <ImageIcon className="h-3.5 w-3.5" />,
};

export function CoursePlayerSidebar({
  course,
  currentLessonId,
  completedLessons,
  onSelectLesson,
  progress,
}: CoursePlayerSidebarProps) {
  const sortedModules = [...course.modules].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm truncate">{course.title}</h3>
        <div className="flex items-center gap-3 mt-2">
          <Progress value={progress} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground font-medium">
            {progress}%
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {sortedModules.map((module) => {
          const sortedLessons = [...module.lessons].sort(
            (a, b) => a.order - b.order
          );

          return (
            <div key={module.id}>
              <div className="px-4 py-2.5 bg-muted/50 border-b">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {module.title}
                </p>
              </div>
              <div>
                {sortedLessons.map((lesson) => {
                  const isActive = lesson.id === currentLessonId;
                  const isComplete = completedLessons.has(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson.id)}
                      className={cn(
                        "w-full flex items-start gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted/50 border-b border-border/50",
                        isActive && "bg-primary/5 border-l-2 border-l-primary"
                      )}
                    >
                      <span className="mt-0.5 shrink-0">
                        {isComplete ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm leading-tight",
                            isActive
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground/70">
                          {lessonIcons[lesson.type]}
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
