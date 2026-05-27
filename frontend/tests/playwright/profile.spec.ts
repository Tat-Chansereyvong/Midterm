import { test, expect } from "@playwright/test";

test("profile update flow", async ({ page }) => {
  // pretend user is logged in by pre-setting localStorage token
  await page.addInitScript(() => localStorage.setItem("token", "fake-token"));

  // mock GET and PATCH /users/me in a single handler
  await page.route("**/users/me", (route) => {
    const req = route.request();
    const method = req.method().toLowerCase();
    if (method === "get") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "u1", username: "first_user", email: "first@example.com", bio: "" }),
      });
      return;
    }
    if (method === "patch") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "u1", username: "first_user", email: "first@example.com", bio: "I build APIs" }),
      });
      return;
    }
    route.continue();
  });

  // navigate via UI so client-side routing + init scripts take effect
  await page.goto("/");
  await page.click('text=Profile');
  await page.waitForSelector('#bio', { timeout: 5000 });
  await page.fill("#bio", "I build APIs");
  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/users/me') && resp.request().method().toLowerCase() === 'patch'),
    page.click('button:has-text("Save changes")'),
  ]);
  await expect(page.getByRole('status')).toContainText("Profile updated");
});
