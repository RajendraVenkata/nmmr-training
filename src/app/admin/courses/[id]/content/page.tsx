"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ModuleEditor } from "@/components/admin/ModuleEditor";
import type { ModuleFormData, LessonFormData } from "@/lib/validators";

interface LessonState {
  id: string;
  title: string;
  type: "markdown" | "document" | "quiz" | "image";
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

interface CourseData {
  _id: string;
  title: string;
  modules: {
    _id: string;
    title: string;
    order: number;
    lessons: {
      _id: string;
      title: string;
      type: "markdown" | "document" | "quiz" | "image";
      duration: string;
      order: number;
      isFree: boolean;
    }[];
  }[];
}

let nextModuleId = 100;
let nextLessonId = 1000;

export default function ContentManagementPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { toast } = useToast();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [modules, setModules] = useState<ModuleState[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/courses/${id}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) {
          setCourse(data);
          setModules(
            (data.modules || []).map(
              (m: CourseData["modules"][number]) => ({
                id: m._id,
                title: m.title,
                order: m.order,
                lessons: (m.lessons || []).map((l) => ({
                  id: l._id,
                  title: l.title,
                  type: l.type,
                  duration: l.duration,
                  order: l.order,
                  isFree: l.isFree,
                })),
              })
            )
          );
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Loading course content...</p>
      </div>
    );
  }

  if (notFound || !course) {
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
    setIsDirty(true);
    toast({ title: "Module added", description: `"${data.title}" has been added.` });
  }

  function handleEditModule(moduleId: string, data: ModuleFormData) {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, title: data.title } : m))
    );
    setIsDirty(true);
    toast({ title: "Module updated" });
  }

  function handleDeleteModule(moduleId: string) {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
    setIsDirty(true);
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
    setIsDirty(true);
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
    setIsDirty(true);
    toast({ title: "Lesson updated" });
  }

  function handleDeleteLesson(moduleId: string, lessonId: string) {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        return { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) };
      })
    );
    setIsDirty(true);
    toast({ title: "Lesson deleted" });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        modules: modules.map((m, mi) => ({
          ...(m.id.startsWith("m-new-") ? {} : { _id: m.id }),
          title: m.title,
          order: mi + 1,
          lessons: m.lessons.map((l, li) => ({
            ...(l.id.startsWith("l-new-") ? {} : { _id: l.id }),
            title: l.title,
            type: l.type,
            duration: l.duration,
            order: li + 1,
            isFree: l.isFree,
          })),
        })),
      };

      const res = await fetch(`/api/admin/courses/${id}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      const data = await res.json();
      setIsDirty(false);
      toast({
        title: "Content saved",
        description: `${data.modulesCount} modules, ${data.lessonsCount} lessons saved successfully.`,
      });

      // Reload to get fresh IDs from MongoDB
      const courseRes = await fetch(`/api/admin/courses/${id}`);
      if (courseRes.ok) {
        const courseData = await courseRes.json();
        if (courseData && !courseData.error) {
          setCourse(courseData);
          setModules(
            (courseData.modules || []).map(
              (m: CourseData["modules"][number], mi: number) => ({
                id: m._id,
                title: m.title,
                order: mi + 1,
                lessons: (m.lessons || []).map((l, li) => ({
                  id: l._id,
                  title: l.title,
                  type: l.type,
                  duration: l.duration,
                  order: li + 1,
                  isFree: l.isFree,
                })),
              })
            )
          );
        }
      }
    } catch (error) {
      toast({
        title: "Error saving",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{modules.length} modules</Badge>
          <Badge variant="secondary">{totalLessons} lessons</Badge>
          {isDirty && (
            <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700">
              Unsaved changes
            </Badge>
          )}
        </div>
        <Button onClick={handleSave} disabled={!isDirty || saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1.5" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <ModuleEditor
        courseId={id}
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
