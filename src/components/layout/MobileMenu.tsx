"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { GraduationCap, Menu, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NAV_ITEMS, COMPANY } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            {COMPANY.name}
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "px-3 py-3 text-sm font-medium rounded-md transition-colors",
                "hover:bg-muted",
                pathname === item.href
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Separator className="my-6" />

        {session?.user ? (
          <div className="flex flex-col gap-1 px-3">
            <div className="mb-3">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            {session.user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
            <Separator className="my-2" />
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-3">
            <Button variant="outline" asChild className="w-full">
              <Link href="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/register" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
