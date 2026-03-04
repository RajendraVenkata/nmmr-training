"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  User,
  Receipt,
  Users,
  PlusCircle,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV, ADMIN_NAV } from "@/lib/constants";
import type { NavItem } from "@/types";

const ICON_MAP: Record<string, React.ReactNode> = {
  "/dashboard": <LayoutDashboard className="h-4 w-4" />,
  "/dashboard/courses": <BookOpen className="h-4 w-4" />,
  "/dashboard/profile": <User className="h-4 w-4" />,
  "/dashboard/purchases": <Receipt className="h-4 w-4" />,
  "/admin": <LayoutDashboard className="h-4 w-4" />,
  "/admin/courses": <BookOpen className="h-4 w-4" />,
  "/admin/labs": <Terminal className="h-4 w-4" />,
  "/admin/users": <Users className="h-4 w-4" />,
};

interface SidebarProps {
  type: "dashboard" | "admin";
  className?: string;
}

export function Sidebar({ type, className }: SidebarProps) {
  const pathname = usePathname();
  const items: NavItem[] = type === "admin" ? ADMIN_NAV : DASHBOARD_NAV;

  return (
    <aside className={cn("w-64 shrink-0 border-r bg-muted/30 p-4 hidden lg:block", className)}>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== `/${type === "admin" ? "admin" : "dashboard"}` &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-muted",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {ICON_MAP[item.href]}
              {item.label}
            </Link>
          );
        })}

        {type === "admin" && (
          <Link
            href="/admin/courses/new"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors mt-4",
              "border border-dashed border-muted-foreground/30 hover:bg-muted text-muted-foreground"
            )}
          >
            <PlusCircle className="h-4 w-4" />
            New Course
          </Link>
        )}
      </nav>
    </aside>
  );
}
