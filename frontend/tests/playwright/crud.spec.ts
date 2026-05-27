import { test, expect } from "@playwright/test";

test("comments CRUD flow and 404 page", async ({ page }) => {
  // Initial empty list
  await page.route("**/comments?**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );

  // Create comment
  await page.route("**/comments", (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ id: "c1", postId: "post-1", content: "Hello" }),
    }),
  );

  await page.goto("/");
  await page.click("text=Comments");
  await page.fill('input[placeholder="Write a comment"]', "Hello");
  await page.click('button:has-text("Post")');

  await expect(page.locator("text=Hello")).toBeVisible();

  // Test 404 route
  await page.goto("/some/unknown/route");
  await expect(page.locator("text=404 — Page not found")).toBeVisible();
});
