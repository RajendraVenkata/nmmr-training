"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "learner" | "admin";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // In dev without a DB, skip auth redirects so dashboard UI can be previewed
    if (process.env.NODE_ENV === "development") return;

    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${window.location.pathname}`);
    }

    if (
      status === "authenticated" &&
      requiredRole === "admin" &&
      session?.user?.role !== "admin"
    ) {
      router.push("/dashboard");
    }
  }, [status, session, requiredRole, router]);

  if (status === "loading") {
    if (process.env.NODE_ENV === "development") {
      return <>{children}</>;
    }

    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    // In dev, render children so dashboard can be previewed without auth
    if (process.env.NODE_ENV === "development") {
      return <>{children}</>;
    }
    return null;
  }

  if (
    requiredRole === "admin" &&
    session?.user?.role !== "admin"
  ) {
    return null;
  }

  return <>{children}</>;
}
