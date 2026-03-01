import { test, expect } from "@playwright/test";

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

test.describe("Responsive — Mobile (375px)", () => {
  test.use({ viewport: VIEWPORTS.mobile });

  test("homepage renders on mobile", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Master AI Skills That Matter")).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse Courses" }).first()).toBeVisible();
  });

  test("mobile menu button is visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Mobile menu button has sr-only text "Open menu"
    const menuButton = page.getByRole("button", { name: "Open menu" });
    await expect(menuButton).toBeVisible();
  });

  test("course grid renders on mobile", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Browse Courses").first()).toBeVisible();
    await expect(page.getByText("Introduction to Generative AI").first()).toBeVisible();
  });
});

test.describe("Responsive — Tablet (768px)", () => {
  test.use({ viewport: VIEWPORTS.tablet });

  test("homepage renders on tablet", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Master AI Skills That Matter")).toBeVisible();
    await expect(page.getByText("What You'll Learn")).toBeVisible();
  });

  test("courses page shows grid", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Showing 6 courses")).toBeVisible();
  });
});

test.describe("Responsive — Desktop (1280px)", () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test("homepage renders fully on desktop", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Master AI Skills That Matter")).toBeVisible();
    await expect(page.getByText("What You'll Learn")).toBeVisible();
    await expect(page.getByText("Why Learn With Us")).toBeVisible();
    await expect(page.getByText("Ready to Start Learning?")).toBeVisible();
  });

  test("navigation links are visible (no hamburger)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Desktop should show inline nav links in header
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Courses" })).toBeVisible();
    await expect(header.getByRole("link", { name: "About" })).toBeVisible();
    await expect(header.getByRole("link", { name: "Contact" })).toBeVisible();
  });

  test("dashboard sidebar is visible on desktop", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const sidebar = page.locator("aside");
    await expect(sidebar.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "My Courses" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Profile" })).toBeVisible();
  });
});
