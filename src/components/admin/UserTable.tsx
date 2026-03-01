"use client";

import { useState } from "react";
import { Search, ShieldCheck, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { SampleUser } from "@/data/sample-users";
import type { UserRole } from "@/types";

interface UserTableProps {
  users: SampleUser[];
}

export function UserTable({ users }: UserTableProps) {
  const [search, setSearch] = useState("");
  const [roleChangeUser, setRoleChangeUser] = useState<SampleUser | null>(null);
  const { toast } = useToast();

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  function handleRoleChange() {
    if (!roleChangeUser) return;
    const newRole: UserRole =
      roleChangeUser.role === "admin" ? "learner" : "admin";
    toast({
      title: "Role updated",
      description: `${roleChangeUser.name} is now ${newRole === "admin" ? "an admin" : "a learner"}.`,
    });
    setRoleChangeUser(null);
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Enrollments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-sm">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="capitalize text-xs"
                    >
                      {user.role === "admin" && (
                        <ShieldCheck className="h-3 w-3 mr-1" />
                      )}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm capitalize text-muted-foreground">
                    {user.provider}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {user.enrollmentsCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setRoleChangeUser(user)}
                    >
                      {user.role === "admin" ? (
                        <>
                          <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                          Make Admin
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!roleChangeUser}
        onOpenChange={() => setRoleChangeUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              {roleChangeUser?.role === "admin" ? (
                <>
                  Remove admin privileges from{" "}
                  <strong>{roleChangeUser?.name}</strong>? They will become a
                  regular learner.
                </>
              ) : (
                <>
                  Grant admin privileges to{" "}
                  <strong>{roleChangeUser?.name}</strong>? They will have full
                  access to the admin panel.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleChangeUser(null)}
            >
              Cancel
            </Button>
            <Button
              variant={
                roleChangeUser?.role === "admin" ? "destructive" : "default"
              }
              onClick={handleRoleChange}
            >
              {roleChangeUser?.role === "admin"
                ? "Remove Admin"
                : "Grant Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
