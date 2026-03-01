"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { moduleFormSchema, type ModuleFormData } from "@/lib/validators";

interface ModuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<ModuleFormData>;
  onSubmit: (data: ModuleFormData) => void;
}

export function ModuleFormDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSubmit,
}: ModuleFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: { title: "", ...defaultValues },
  });

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Module" : "Edit Module"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new module for this course."
              : "Update the module title."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="moduleTitle">Module Title</Label>
              <Input
                id="moduleTitle"
                {...register("title")}
                placeholder="e.g. Getting Started"
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
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
              {mode === "create" ? "Add Module" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
