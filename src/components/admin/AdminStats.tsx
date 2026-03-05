"use client";

import { Users, BookOpen, GraduationCap, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminDashboardStats } from "@/types";

interface AdminStatsProps {
  stats: AdminDashboardStats;
}

const statConfig = [
  {
    key: "totalUsers" as const,
    label: "Total Users",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    key: "totalCourses" as const,
    label: "Total Courses",
    icon: BookOpen,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
  {
    key: "totalEnrollments" as const,
    label: "Enrollments",
    icon: GraduationCap,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  {
    key: "revenue" as const,
    label: "Revenue",
    icon: IndianRupee,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    format: (v: number) =>
      `₹${v.toLocaleString("en-IN")}`,
  },
];

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statConfig.map((cfg) => {
        const Icon = cfg.icon;
        const value = stats[cfg.key];
        const display = cfg.format ? cfg.format(value) : value;

        return (
          <Card key={cfg.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {cfg.label}
              </CardTitle>
              <div className={`p-2 rounded-md ${cfg.bgColor}`}>
                <Icon className={`h-4 w-4 ${cfg.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{display}</p>
              {cfg.key === "totalCourses" && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.publishedCourses} published, {stats.draftCourses} drafts
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
