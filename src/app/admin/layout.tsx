"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard requiredRole="admin">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar type="admin" />

        <div className="lg:hidden fixed bottom-4 left-4 z-40">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full shadow-md"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>Admin Panel</SheetTitle>
              </SheetHeader>
              <div onClick={() => setMobileOpen(false)}>
                <Sidebar type="admin" className="block border-r-0" />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
