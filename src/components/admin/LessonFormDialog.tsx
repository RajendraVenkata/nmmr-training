"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { lessonFormSchema, type LessonFormData } from "@/lib/validators";

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<LessonFormData>;
  onSubmit: (data: LessonFormData) => void;
}

export function LessonFormDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSubmit,
}: LessonFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      type: "markdown",
      content: "",
      duration: "",
      isFree: false,
      ...defaultValues,
    },
  });

  const isFree = watch("isFree");

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Lesson" : "Edit Lesson"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new lesson to this module."
              : "Update lesson details."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lessonTitle">Lesson Title</Label>
              <Input
                id="lessonTitle"
                {...register("title")}
                placeholder="e.g. What is AI?"
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  defaultValue={defaultValues?.type || "markdown"}
                  onValueChange={(v) =>
                    setValue("type", v as LessonFormData["type"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  {...register("duration")}
                  placeholder="e.g. 15 min"
                />
                {errors.duration && (
                  <p className="text-sm text-destructive">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Short Description / Preview
              </Label>
              <Textarea
                id="content"
                {...register("content")}
                placeholder="Brief summary of this lesson (optional, max 500 chars)"
                rows={2}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                Full content is edited separately via the &quot;Edit Content&quot; button after saving.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isFree"
                checked={isFree}
                onCheckedChange={(checked) =>
                  setValue("isFree", checked === true)
                }
              />
              <Label htmlFor="isFree" className="font-normal">
                Free preview (visible without enrollment)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Add Lesson" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
