"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Pencil, FolderOpen, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { AdminCourseItem } from "@/types";

interface CourseTableProps {
  courses: AdminCourseItem[];
}

const statusColors: Record<string, string> = {
  published: "bg-green-500/10 text-green-600 dark:text-green-400",
  draft: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  archived: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
};

export function CourseTable({ courses }: CourseTableProps) {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  const courseToDelete = courses.find((c) => c.id === deleteId);

  function handleDelete() {
    if (!deleteId) return;
    fetch(`/api/admin/courses/${deleteId}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          toast({
            title: "Course deleted",
            description: `"${courseToDelete?.title}" has been deleted.`,
          });
          window.location.reload();
        }
      })
      .catch(() => {});
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Lessons</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{course.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.instructor}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs capitalize ${statusColors[course.status] || ""}`}
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {course.price === 0
                      ? "Free"
                      : `₹${course.price.toLocaleString("en-IN")}`}
                  </TableCell>
                  <TableCell className="text-sm">
                    {course.lessonsCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/admin/courses/${course.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/admin/courses/${course.id}/content`}>
                          <FolderOpen className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(course.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{courseToDelete?.title}&rdquo;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
