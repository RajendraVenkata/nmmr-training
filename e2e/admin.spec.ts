import { test, expect } from "@playwright/test";

// Dev mode bypasses auth, so admin pages are accessible without login
// Admin sidebar has "New Course" link, AND main content has "New Course" button — use scoped locators

test.describe("Admin dashboard", () => {
  test("loads with stats and recent enrollments table", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Admin Dashboard" })
    ).toBeVisible();

    // Action buttons (in main content area, not sidebar)
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: /New Course/i }).first()).toBeVisible();
    await expect(main.getByRole("link", { name: /Manage Users/i })).toBeVisible();

    // Recent enrollments table
    await expect(page.getByText("Recent Enrollments")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Student" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Course" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Progress" })).toBeVisible();
  });
});

test.describe("Admin courses", () => {
  test("courses table loads with all courses", async ({ page }) => {
    await page.goto("/admin/courses");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Courses" })
    ).toBeVisible();

    // New course button (in main content, not sidebar)
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: /New Course/i }).first()).toBeVisible();

    // Course titles in table
    await expect(page.getByText("Introduction to Generative AI").first()).toBeVisible();
    await expect(page.getByText("Building AI Agents with LangChain").first()).toBeVisible();
  });
});

test.describe("Admin new course", () => {
  test("new course form loads", async ({ page }) => {
    await page.goto("/admin/courses/new");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Create New Course" })
    ).toBeVisible();

    // Form fields
    await expect(page.getByLabel(/Title/i).first()).toBeVisible();
  });
});

test.describe("Admin users", () => {
  test("user management table loads", async ({ page }) => {
    await page.goto("/admin/users");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Users" })
    ).toBeVisible();
    await expect(
      page.getByText("Manage platform users and their roles.")
    ).toBeVisible();
  });
});
