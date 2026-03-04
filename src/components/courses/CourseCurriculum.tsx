"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, HelpCircle, BookOpen, ImageIcon, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Lesson {
  id: string;
  title: string;
  type: "markdown" | "document" | "quiz" | "image";
  duration: string;
  order: number;
  isFree: boolean;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseCurriculumProps {
  modules: Module[];
}

const lessonIcons = {
  markdown: BookOpen,
  document: FileText,
  quiz: HelpCircle,
  image: ImageIcon,
};

export function CourseCurriculum({ modules }: CourseCurriculumProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([modules[0]?.id])
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Course Curriculum</h3>
        <p className="text-sm text-muted-foreground">
          {modules.length} modules &middot; {totalLessons} lessons
        </p>
      </div>

      <div className="space-y-2">
        {modules
          .sort((a, b) => a.order - b.order)
          .map((mod) => {
            const isExpanded = expandedModules.has(mod.id);
            return (
              <div key={mod.id} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium text-sm">{mod.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {mod.lessons.length} lessons
                  </span>
                </button>

                {isExpanded && (
                  <div className="border-t">
                    {mod.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((lesson) => {
                        const Icon = lessonIcons[lesson.type];
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between px-4 py-2.5 pl-10 text-sm hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span>{lesson.title}</span>
                              {lesson.isFree && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  Preview
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="text-xs">{lesson.duration}</span>
                              {!lesson.isFree && (
                                <Lock className="h-3 w-3" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
