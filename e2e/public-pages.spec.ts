import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads with hero section and key content", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Hero content
    await expect(page.getByRole("heading", { name: "Master AI Skills That Matter" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse Courses" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Create Free Account" })).toBeVisible();

    // Categories section
    await expect(page.getByText("What You'll Learn")).toBeVisible();
    await expect(page.getByText("Generative AI").first()).toBeVisible();
    await expect(page.getByText("Agentic AI").first()).toBeVisible();

    // Value props
    await expect(page.getByText("Why Learn With Us")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Industry-Focused" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hands-On Projects" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Expert Instructors" })).toBeVisible();

    // CTA section
    await expect(page.getByText("Ready to Start Learning?")).toBeVisible();
  });
});

test.describe("Courses page", () => {
  test("displays course grid with search", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Browse Courses").first()).toBeVisible();

    // Search input exists
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();

    // Published courses are shown
    await expect(page.getByText("Introduction to Generative AI").first()).toBeVisible();
    await expect(page.getByText("Building AI Agents with LangChain").first()).toBeVisible();
    await expect(page.getByText("Prompt Engineering Masterclass").first()).toBeVisible();

    // Course count text
    await expect(page.getByText("Showing 6 courses")).toBeVisible();
  });

  test("search filters courses", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder(/search/i).fill("RAG");
    await expect(page.getByText("Showing 1 course")).toBeVisible();
    await expect(page.getByText("RAG Systems: From Theory to Production")).toBeVisible();
  });
});

test.describe("Course detail page", () => {
  test("shows course info, pricing, and curriculum", async ({ page }) => {
    await page.goto("/courses/introduction-to-generative-ai");
    await page.waitForLoadState("networkidle");

    // Title
    await expect(
      page.getByRole("heading", { name: "Introduction to Generative AI" })
    ).toBeVisible();

    // Instructor (appears in meta area and instructor section — use first)
    await expect(page.getByText("Dr. Priya Sharma").first()).toBeVisible();

    // Duration and lessons
    await expect(page.getByText("6 hours").first()).toBeVisible();
    await expect(page.getByText("12 lessons").first()).toBeVisible();

    // Price (free course)
    await expect(page.getByText("Free").first()).toBeVisible();
    await expect(page.getByText("Enroll for Free")).toBeVisible();

    // Curriculum modules (use first to avoid description text matches)
    await expect(page.getByText("Getting Started with AI").first()).toBeVisible();
    await expect(page.getByText("Understanding Large Language Models").first()).toBeVisible();

    // What you'll learn
    await expect(page.getByText("What You'll Learn")).toBeVisible();
  });

  test("paid course shows price", async ({ page }) => {
    await page.goto("/courses/building-ai-agents-with-langchain");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Buy Now")).toBeVisible();
    // Price is displayed (₹4,999)
    await expect(page.getByText(/4,999/)).toBeVisible();
  });
});

test.describe("About page", () => {
  test("loads with team and values", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: /About NMMR Technologies/i })
    ).toBeVisible();

    // Mission & Vision
    await expect(page.getByText("Our Mission")).toBeVisible();
    await expect(page.getByText("Our Vision")).toBeVisible();

    // Values
    await expect(page.getByText("Our Values")).toBeVisible();
    await expect(page.getByText("Innovation First")).toBeVisible();
    await expect(page.getByText("Learner-Centric")).toBeVisible();

    // Team
    await expect(page.getByText("Meet Our Instructors")).toBeVisible();
    await expect(page.getByText("Dr. Priya Sharma").first()).toBeVisible();
    await expect(page.getByText("Rajesh Kumar").first()).toBeVisible();
    await expect(page.getByText("Vikram Patel").first()).toBeVisible();

    // Stats
    await expect(page.getByText("500+")).toBeVisible();
  });
});

test.describe("Contact page", () => {
  test("loads with form and contact info", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Get in Touch" })
    ).toBeVisible();

    // Contact info (scoped to main content to avoid footer duplicates)
    const main = page.locator("#main-content");
    await expect(main.getByText("training@nmmr.tech")).toBeVisible();
    await expect(main.getByText("Hyderabad, Telangana, India")).toBeVisible();

    // Form fields
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Subject")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send Message" })).toBeVisible();
  });
});

test.describe("Legal pages", () => {
  test("privacy policy loads", async ({ page }) => {
    await page.goto("/privacy-policy");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Privacy Policy", level: 1 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Information We Collect/i })
    ).toBeVisible();
  });

  test("terms of service loads", async ({ page }) => {
    await page.goto("/terms-of-service");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Terms of Service", level: 1 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Acceptance of Terms/i })
    ).toBeVisible();
  });
});

test.describe("404 page", () => {
  test("shows for invalid URLs", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.getByText("Go Home")).toBeVisible();
    await expect(page.getByText("Browse Courses").first()).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("header links navigate between pages", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to Courses
    await page.locator("header").getByRole("link", { name: "Courses" }).click();
    await expect(page).toHaveURL("/courses");
    await expect(page.getByText("Browse Courses").first()).toBeVisible();

    // Navigate to About
    await page.locator("header").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL("/about");

    // Navigate to Contact
    await page.locator("header").getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/contact");
  });
});

test.describe("Dark mode", () => {
  test("toggle switches theme", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Theme toggle has sr-only text "Toggle theme"
    const themeToggle = page.getByRole("button", { name: "Toggle theme" });
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();

    // After clicking, the html element should have a class set by next-themes
    const html = page.locator("html");
    const classAttr = await html.getAttribute("class");
    expect(classAttr).toBeTruthy();
  });
});
