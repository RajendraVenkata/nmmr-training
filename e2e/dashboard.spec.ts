import { test, expect } from "@playwright/test";

// Dev mode bypasses auth, so dashboard pages are accessible without login
// Sidebar is hidden lg:block — Playwright default viewport (1280x720) triggers lg breakpoint

test.describe("Dashboard overview", () => {
  test("loads with stats and recent enrollments", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Welcome message
    await expect(page.getByText(/Welcome back/i)).toBeVisible();

    // Stats section
    await expect(page.getByText("Enrolled Courses")).toBeVisible();
    await expect(page.getByText("Completed", { exact: true })).toBeVisible();
    await expect(page.getByText("Hours Learned")).toBeVisible();

    // Recent enrollments
    await expect(page.getByText("Recent Enrollments")).toBeVisible();
  });
});

test.describe("Dashboard courses", () => {
  test("my courses page loads", async ({ page }) => {
    await page.goto("/dashboard/courses");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "My Courses" })
    ).toBeVisible();
  });
});

test.describe("Dashboard profile", () => {
  test("profile page loads", async ({ page }) => {
    await page.goto("/dashboard/profile");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Profile Settings" })
    ).toBeVisible();
    await expect(page.getByText("Account Information", { exact: true })).toBeVisible();
  });
});

test.describe("Dashboard purchases", () => {
  test("purchases page loads", async ({ page }) => {
    await page.goto("/dashboard/purchases");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Purchase History" })
    ).toBeVisible();
  });
});

test.describe("Dashboard sidebar navigation", () => {
  test("sidebar links are visible and navigate", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Sidebar navigation links (in aside element)
    const sidebar = page.locator("aside");
    await expect(sidebar.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "My Courses" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Profile" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Purchases" })).toBeVisible();

    // Navigate via sidebar
    await sidebar.getByRole("link", { name: "My Courses" }).click();
    await expect(page).toHaveURL("/dashboard/courses");

    await page.locator("aside").getByRole("link", { name: "Profile" }).click();
    await expect(page).toHaveURL("/dashboard/profile");
  });
});
