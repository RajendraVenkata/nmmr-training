"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  courseFormSchema,
  type CourseFormData,
} from "@/lib/validators";
import { COURSE_CATEGORIES, COURSE_DIFFICULTIES } from "@/lib/constants";

interface CourseFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CourseFormData>;
  courseId?: string;
  thumbnailUrl?: string | null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function CourseForm({ mode, defaultValues, courseId, thumbnailUrl }: CourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [thumbnail, setThumbnail] = useState<{
    base64: string;
    mimeType: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(courseFormSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      longDescription: "",
      category: "GenAI",
      difficulty: "beginner",
      price: 0,
      currency: "INR",
      instructor: "",
      status: "draft",
      ...defaultValues,
    },
  });

  const title = watch("title");

  useEffect(() => {
    if (mode === "create" && title) {
      setValue("slug", slugify(title));
    }
  }, [title, mode, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let thumbnailRef: string | undefined;

      if (thumbnail) {
        const imgRes = await fetch("/api/admin/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64: thumbnail.base64,
            mimeType: thumbnail.mimeType,
            purpose: "thumbnail",
            filename: `${data.slug}-thumbnail`,
            altText: `${data.title} thumbnail`,
          }),
        });
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          thumbnailRef = imgData.image.id;
        }
      }

      const payload = {
        ...data,
        price: Number(data.price) || 0,
        ...(thumbnailRef ? { thumbnailRef } : {}),
      };

      if (mode === "create") {
        const res = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create course");
      } else if (courseId) {
        const res = await fetch(`/api/admin/courses/${courseId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update course");
      }

      toast({
        title: mode === "create" ? "Course created" : "Course updated",
        description:
          mode === "create"
            ? "Your new course has been created as a draft."
            : "Course details have been saved.",
      });
      if (mode === "create") {
        router.push("/admin/courses");
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Course title, description, and metadata.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="e.g. Introduction to AI" />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="auto-generated-from-title"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              URL-friendly identifier. Auto-generated from title.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief course overview (shown on cards)"
              rows={2}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description (Markdown)</Label>
            <Textarea
              id="longDescription"
              {...register("longDescription")}
              placeholder="Detailed course description with markdown support..."
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              {...register("instructor")}
              placeholder="Instructor name"
            />
            {errors.instructor && (
              <p className="text-sm text-destructive">
                {errors.instructor.message}
              </p>
            )}
          </div>

          <ImageUploader
            label="Course Thumbnail"
            currentImageUrl={
              thumbnail
                ? `data:${thumbnail.mimeType};base64,${thumbnail.base64}`
                : thumbnailUrl || null
            }
            onUpload={(data) =>
              setThumbnail({ base64: data.base64, mimeType: data.mimeType })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Settings</CardTitle>
          <CardDescription>Category, difficulty, pricing, and status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                defaultValue={defaultValues?.category || "GenAI"}
                onValueChange={(v) =>
                  setValue("category", v as CourseFormData["category"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                defaultValue={defaultValues?.difficulty || "beginner"}
                onValueChange={(v) =>
                  setValue("difficulty", v as CourseFormData["difficulty"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_DIFFICULTIES.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.difficulty && (
                <p className="text-sm text-destructive">
                  {errors.difficulty.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                min={0}
                placeholder="0 for free"
              />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                defaultValue={defaultValues?.status || "draft"}
                onValueChange={(v) =>
                  setValue("status", v as CourseFormData["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1.5" />
          )}
          {mode === "create" ? "Create Course" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
