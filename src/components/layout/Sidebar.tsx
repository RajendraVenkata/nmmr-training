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
  PanelLeftClose,
  PanelLeftOpen,
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ type, className, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const items: NavItem[] = type === "admin" ? ADMIN_NAV : DASHBOARD_NAV;

  return (
    <aside
      className={cn(
        "shrink-0 border-r bg-muted/30 p-4 hidden lg:flex flex-col transition-all duration-200",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Collapse toggle */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="mb-4 flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      )}

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
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-muted",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {ICON_MAP[item.href]}
              {!collapsed && item.label}
            </Link>
          );
        })}

        {type === "admin" && (
          <Link
            href="/admin/courses/new"
            title={collapsed ? "New Course" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors mt-4",
              "border border-dashed border-muted-foreground/30 hover:bg-muted text-muted-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            <PlusCircle className="h-4 w-4" />
            {!collapsed && "New Course"}
          </Link>
        )}
      </nav>
    </aside>
  );
}
