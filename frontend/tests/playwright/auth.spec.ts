import { test, expect } from "@playwright/test";

test("registration and profile flow", async ({ page }) => {
  // Mock register response
  await page.route("**/auth/register", (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ accessToken: "fake-token" }),
    }),
  );

  // Mock profile after register
  await page.route("**/users/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        username: "first_user",
        email: "first@example.com",
        bio: "",
      }),
    }),
  );

  await page.goto("/");
  await page.click("text=Register");
  await page.fill('input[name="username"]', "first_user");
  await page.fill('input[name="email"]', "first@example.com");
  await page.fill('input[name="password"]', "Password123");
  await page.click('button:has-text("Create account")');

  await page.waitForURL("**/users/me");
  await expect(page.locator("text=first@example.com")).toBeVisible();
});

test("login and profile flow", async ({ page }) => {
  await page.route("**/auth/login", (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ accessToken: "fake-token" }),
    }),
  );

  await page.route("**/users/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        username: "first_user",
        email: "first@example.com",
        bio: "",
      }),
    }),
  );

  await page.goto("/");
  await page.click("text=Login");
  await page.fill('input[name="email"]', "first@example.com");
  await page.fill('input[name="password"]', "Password123");
  await page.click('button:has-text("Sign in")');

  await page.waitForURL("**/users/me");
  await expect(page.locator("text=first@example.com")).toBeVisible();
});
