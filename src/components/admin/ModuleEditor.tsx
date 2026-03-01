"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LessonEditor } from "./LessonEditor";
import { ModuleFormDialog } from "./ModuleFormDialog";
import type { ModuleFormData, LessonFormData } from "@/lib/validators";

interface LessonItem {
  id: string;
  title: string;
  type: "video" | "document" | "quiz" | "markdown";
  duration: string;
  order: number;
  isFree: boolean;
}

interface ModuleItem {
  id: string;
  title: string;
  order: number;
  lessons: LessonItem[];
}

interface ModuleEditorProps {
  modules: ModuleItem[];
  onAddModule: (data: ModuleFormData) => void;
  onEditModule: (moduleId: string, data: ModuleFormData) => void;
  onDeleteModule: (moduleId: string) => void;
  onAddLesson: (moduleId: string, data: LessonFormData) => void;
  onEditLesson: (
    moduleId: string,
    lessonId: string,
    data: LessonFormData
  ) => void;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
}

export function ModuleEditor({
  modules,
  onAddModule,
  onEditModule,
  onDeleteModule,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}: ModuleEditorProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map((m) => m.id))
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null);

  function toggleModule(id: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleEditModule(mod: ModuleItem) {
    setEditingModule(mod);
    setDialogOpen(true);
  }

  function handleDialogSubmit(data: ModuleFormData) {
    if (editingModule) {
      onEditModule(editingModule.id, data);
    } else {
      onAddModule(data);
    }
    setEditingModule(null);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) setEditingModule(null);
  }

  return (
    <div className="space-y-4">
      {modules
        .sort((a, b) => a.order - b.order)
        .map((mod) => {
          const isExpanded = expandedModules.has(mod.id);
          return (
            <Card key={mod.id}>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => toggleModule(mod.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <CardTitle className="text-sm flex-1">
                    {mod.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {mod.lessons.length} lesson
                    {mod.lessons.length !== 1 ? "s" : ""}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleEditModule(mod)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => onDeleteModule(mod.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0 pb-3 px-4">
                  <LessonEditor
                    lessons={mod.lessons}
                    onAdd={(data) => onAddLesson(mod.id, data)}
                    onEdit={(lessonId, data) =>
                      onEditLesson(mod.id, lessonId, data)
                    }
                    onDelete={(lessonId) => onDeleteLesson(mod.id, lessonId)}
                  />
                </CardContent>
              )}
            </Card>
          );
        })}

      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={() => {
          setEditingModule(null);
          setDialogOpen(true);
        }}
      >
        <PlusCircle className="h-4 w-4 mr-1.5" />
        Add Module
      </Button>

      <ModuleFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        mode={editingModule ? "edit" : "create"}
        defaultValues={
          editingModule ? { title: editingModule.title } : undefined
        }
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}
