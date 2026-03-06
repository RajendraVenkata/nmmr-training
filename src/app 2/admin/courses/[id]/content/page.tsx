"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ModuleEditor } from "@/components/admin/ModuleEditor";
import { sampleCourses } from "@/data/sample-courses";
import type { ModuleFormData, LessonFormData } from "@/lib/validators";

interface LessonState {
  id: string;
  title: string;
  type: "video" | "document" | "quiz" | "markdown";
  duration: string;
  order: number;
  isFree: boolean;
}

interface ModuleState {
  id: string;
  title: string;
  order: number;
  lessons: LessonState[];
}

let nextModuleId = 100;
let nextLessonId = 1000;

export default function ContentManagementPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const course = sampleCourses.find((c) => c.id === id);
  const { toast } = useToast();

  const [modules, setModules] = useState<ModuleState[]>(
    () =>
      course?.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => ({ ...l })),
      })) || []
  );

  if (!course) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Course Not Found</h1>
        <p className="text-muted-foreground">
          The course you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Courses
          </Link>
        </Button>
      </div>
    );
  }

  function handleAddModule(data: ModuleFormData) {
    const newModule: ModuleState = {
      id: `m-new-${nextModuleId++}`,
      title: data.title,
      order: modules.length + 1,
      lessons: [],
    };
    setModules((prev) => [...prev, newModule]);
    toast({ title: "Module added", description: `"${data.title}" has been added.` });
  }

  function handleEditModule(moduleId: string, data: ModuleFormData) {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, title: data.title } : m))
    );
    toast({ title: "Module updated" });
  }

  function handleDeleteModule(moduleId: string) {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
    toast({ title: "Module deleted" });
  }

  function handleAddLesson(moduleId: string, data: LessonFormData) {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const newLesson: LessonState = {
          id: `l-new-${nextLessonId++}`,
          title: data.title,
          type: data.type,
          duration: data.duration,
          order: m.lessons.length + 1,
          isFree: data.isFree,
        };
        return { ...m, lessons: [...m.lessons, newLesson] };
      })
    );
    toast({ title: "Lesson added", description: `"${data.title}" has been added.` });
  }

  function handleEditLesson(
    moduleId: string,
    lessonId: string,
    data: LessonFormData
  ) {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          lessons: m.lessons.map((l) =>
            l.id === lessonId
              ? {
                  ...l,
                  title: data.title,
                  type: data.type,
                  duration: data.duration,
                  isFree: data.isFree,
                }
              : l
          ),
        };
      })
    );
    toast({ title: "Lesson updated" });
  }

  function handleDeleteLesson(moduleId: string, lessonId: string) {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        return { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) };
      })
    );
    toast({ title: "Lesson deleted" });
  }

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Course Content
          </h1>
          <p className="text-muted-foreground mt-1">{course.title}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">{modules.length} modules</Badge>
        <Badge variant="secondary">{totalLessons} lessons</Badge>
      </div>

      <ModuleEditor
        modules={modules}
        onAddModule={handleAddModule}
        onEditModule={handleEditModule}
        onDeleteModule={handleDeleteModule}
        onAddLesson={handleAddLesson}
        onEditLesson={handleEditLesson}
        onDeleteLesson={handleDeleteLesson}
      />
    </div>
  );
}
