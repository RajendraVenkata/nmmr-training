import { test, expect } from "@playwright/test";

test.describe("Login page", () => {
  test("loads with form and Google button", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Welcome Back")).toBeVisible();
    await expect(
      page.getByText("Sign in to continue your learning journey")
    ).toBeVisible();

    // Google sign-in button
    await expect(page.getByText(/Google/i).first()).toBeVisible();

    // Email/password form
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    // Link to register
    await expect(page.getByText("Don't have an account?")).toBeVisible();
    await expect(page.getByRole("link", { name: "Create one" })).toBeVisible();
  });

  test("link navigates to register page", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: "Create one" }).click();
    await expect(page).toHaveURL("/register");
  });
});

test.describe("Register page", () => {
  test("loads with form and Google button", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Create Your Account")).toBeVisible();
    await expect(
      page.getByText("Start your AI learning journey today")
    ).toBeVisible();

    // Google sign-in button
    await expect(page.getByText(/Google/i).first()).toBeVisible();

    // Registration form fields
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible();

    // Link to login
    await expect(page.getByText("Already have an account?")).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });

  test("link navigates to login page", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/login");
  });
});
