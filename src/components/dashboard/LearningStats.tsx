"use client";

import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LearningStatsProps {
  enrolledCount: number;
  completedCount: number;
  totalHours: string;
}

const stats = (props: LearningStatsProps) => [
  {
    label: "Enrolled Courses",
    value: props.enrolledCount,
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Completed",
    value: props.completedCount,
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    label: "Hours Learned",
    value: props.totalHours,
    icon: Clock,
    color: "text-primary",
    bgColor: "bg-primary/5",
  },
];

export function LearningStats(props: LearningStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats(props).map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 pt-6">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.bgColor}`}
            >
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
