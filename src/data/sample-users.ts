import type { UserRole, AuthProvider } from "@/types";

export interface SampleUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  provider: AuthProvider;
  createdAt: string;
  enrollmentsCount: number;
}

export const sampleUsers: SampleUser[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@nmmr.tech",
    role: "admin",
    provider: "credentials",
    createdAt: "2025-06-01T10:00:00Z",
    enrollmentsCount: 0,
  },
  {
    id: "sample-user-1",
    name: "Ananya Gupta",
    email: "ananya@example.com",
    role: "learner",
    provider: "google",
    createdAt: "2025-09-15T08:30:00Z",
    enrollmentsCount: 4,
  },
  {
    id: "user-3",
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    role: "learner",
    provider: "credentials",
    createdAt: "2025-10-20T14:00:00Z",
    enrollmentsCount: 2,
  },
  {
    id: "user-4",
    name: "Sneha Reddy",
    email: "sneha.r@example.com",
    role: "learner",
    provider: "google",
    createdAt: "2025-11-05T11:00:00Z",
    enrollmentsCount: 3,
  },
  {
    id: "user-5",
    name: "Karthik Nair",
    email: "karthik.nair@example.com",
    role: "learner",
    provider: "credentials",
    createdAt: "2025-12-01T09:00:00Z",
    enrollmentsCount: 1,
  },
  {
    id: "user-6",
    name: "Meera Patel",
    email: "meera.p@example.com",
    role: "learner",
    provider: "google",
    createdAt: "2026-01-15T16:30:00Z",
    enrollmentsCount: 2,
  },
];

export function getAllUsers() {
  return sampleUsers;
}

export function getUserById(id: string) {
  return sampleUsers.find((u) => u.id === id);
}

export function searchUsers(query: string) {
  const q = query.toLowerCase();
  return sampleUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
  );
}
