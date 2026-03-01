"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Receipt } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEnrollmentsForUser, SAMPLE_USER_ID } from "@/data/sample-enrollments";
import { formatDate, formatPrice } from "@/lib/utils";

export default function PurchasesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || SAMPLE_USER_ID;
  const enrollments = getEnrollmentsForUser(userId);

  const sorted = [...enrollments].sort(
    (a, b) =>
      new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
  );

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Purchase History
      </h1>
      <p className="text-muted-foreground mb-6">
        View your course enrollments and purchase records.
      </p>

      {sorted.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">
            No purchases yet.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/courses/${enrollment.courseSlug}`}
                      className="font-medium hover:underline"
                    >
                      {enrollment.courseTitle}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {enrollment.courseInstructor}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(enrollment.enrolledAt)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {enrollment.coursePrice === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Free
                      </span>
                    ) : (
                      formatPrice(enrollment.coursePrice, enrollment.courseCurrency)
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        enrollment.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {enrollment.status === "completed"
                        ? "Completed"
                        : "Active"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
