"use client";

import { UserTable } from "@/components/admin/UserTable";
import { getAllUsers } from "@/data/sample-users";

export default function AdminUsersPage() {
  const users = getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage platform users and their roles.
        </p>
      </div>

      <UserTable users={users} />
    </div>
  );
}
