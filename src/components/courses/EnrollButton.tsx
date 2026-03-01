"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
  price: number;
}

export function EnrollButton({ courseId, courseSlug, price }: EnrollButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div>
      <Button
        size="lg"
        className="w-full mb-3"
        onClick={handleEnroll}
        disabled={loading || status === "loading"}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {status === "authenticated" ? label : "Sign in to Enroll"}
      </Button>
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
