"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Users, ArrowRight } from "lucide-react";
import { AdminStats } from "@/components/admin/AdminStats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminDashboardStats, AdminRecentEnrollment } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentEnrollments, setRecentEnrollments] = useState<AdminRecentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (Array.isArray(data.recentEnrollments))
          setRecentEnrollments(data.recentEnrollments);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your training platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/admin/courses/new">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              New Course
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/users">
              <Users className="h-4 w-4 mr-1.5" />
              Manage Users
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading stats...</p>
      ) : stats ? (
        <AdminStats stats={stats} />
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>Latest course enrollments.</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/courses">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : recentEnrollments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No enrollments yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">
                          {enrollment.userName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enrollment.userEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {enrollment.courseTitle}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {enrollment.progress}%
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          enrollment.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="capitalize text-xs"
                      >
                        {enrollment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
