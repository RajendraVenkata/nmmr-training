"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2, PlayCircle } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
  price: number;
}

export function EnrollButton({ courseId, courseSlug, price }: EnrollButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");

  // Check if already enrolled when user is authenticated
  useEffect(() => {
    if (status !== "authenticated") {
      setEnrolled(false);
      return;
    }

    setChecking(true);
    fetch("/api/enrollments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.some(
            (e: { courseId: string }) => e.courseId === courseId
          );
          setEnrolled(found);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [courseId, status]);

  const label = price === 0 ? "Enroll for Free" : "Buy Now";

  async function handleEnroll() {
    setError("");

    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/courses/${courseSlug}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (res.status === 409) {
        // Already enrolled — go to course player
        router.push(`/dashboard/courses/${courseSlug}`);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to enroll");
        return;
      }

      router.push(`/dashboard/courses/${courseSlug}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Already enrolled — show "Continue Learning"
  if (enrolled) {
    return (
      <div>
        <Button
          size="lg"
          className="w-full mb-3"
          onClick={() => router.push(`/dashboard/courses/${courseSlug}`)}
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          Continue Learning
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          You are already enrolled in this course
        </p>
      </div>
    );
  }

  return (
    <div>
      <Button
        size="lg"
        className="w-full mb-3"
        onClick={handleEnroll}
        disabled={loading || checking || status === "loading"}
      >
        {(loading || checking) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {checking
          ? "Checking..."
          : status === "authenticated"
            ? label
            : "Sign in to Enroll"}
      </Button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
