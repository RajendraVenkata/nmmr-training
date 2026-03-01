"use client";

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
import { getAdminStats, getRecentEnrollments } from "@/data/sample-admin";

export default function AdminDashboardPage() {
  const stats = getAdminStats();
  const recentEnrollments = getRecentEnrollments(5);

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

      <AdminStats stats={stats} />

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
        </CardContent>
      </Card>
    </div>
  );
}
