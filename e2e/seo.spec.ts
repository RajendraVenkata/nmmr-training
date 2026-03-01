import { test, expect } from "@playwright/test";

test.describe("Sitemap", () => {
  test("sitemap.xml contains expected URLs", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);

    const body = await response.text();

    // Static routes
    expect(body).toContain("/courses");
    expect(body).toContain("/about");
    expect(body).toContain("/contact");
    expect(body).toContain("/privacy-policy");
    expect(body).toContain("/terms-of-service");

    // Dynamic course routes
    expect(body).toContain("/courses/introduction-to-generative-ai");
    expect(body).toContain("/courses/building-ai-agents-with-langchain");
    expect(body).toContain("/courses/prompt-engineering-masterclass");
  });
});

test.describe("Robots.txt", () => {
  test("disallows dashboard, admin, and api", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain("Disallow: /dashboard/");
    expect(body).toContain("Disallow: /admin/");
    expect(body).toContain("Disallow: /api/");
    expect(body).toContain("Sitemap:");
  });
});

test.describe("Page metadata", () => {
  test("homepage has correct title and meta description", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("NMMR Training - AI & GenAI Courses");

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      "content",
      /Learn Generative AI/
    );
  });

  test("course detail page has correct title", async ({ page }) => {
    await page.goto("/courses/introduction-to-generative-ai");

    await expect(page).toHaveTitle(
      "Introduction to Generative AI | NMMR Training"
    );
  });

  test("about page has correct title", async ({ page }) => {
    await page.goto("/about");

    await expect(page).toHaveTitle("About Us | NMMR Training");
  });

  test("course detail page has OG tags", async ({ page }) => {
    await page.goto("/courses/introduction-to-generative-ai");

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute(
      "content",
      "Introduction to Generative AI"
    );

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", "website");
  });
});

test.describe("JSON-LD structured data", () => {
  test("Organization schema present on homepage", async ({ page }) => {
    await page.goto("/");

    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    const content = await jsonLd.textContent();
    expect(content).toBeTruthy();

    const data = JSON.parse(content!);
    expect(data["@type"]).toBe("Organization");
    expect(data.name).toBe("NMMR Technologies Private Limited");
  });

  test("Course schema present on course detail page", async ({ page }) => {
    await page.goto("/courses/introduction-to-generative-ai");

    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThanOrEqual(2); // Organization + Course

    // Find the Course schema
    let courseFound = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      if (content) {
        const data = JSON.parse(content);
        if (data["@type"] === "Course") {
          courseFound = true;
          expect(data.name).toBe("Introduction to Generative AI");
          break;
        }
      }
    }
    expect(courseFound).toBe(true);
  });
});
