import { test, expect } from "@playwright/test";

test("comments create -> edit -> delete flow", async ({ page }) => {
  // initial empty list
  await page.route("**/comments?**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );

  // create comment returns created entity
  await page.route("**/comments", (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: "c1",
        postId: "post-1",
        content: "Original comment",
      }),
    }),
  );

  // handle PATCH and DELETE for specific comment paths
  await page.route("**/comments/*", (route) => {
    const req = route.request();
    const method = req.method().toLowerCase();
    if (method === "patch") {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "c1", postId: "post-1", content: "Edited comment" }),
      });
      return;
    }
    if (method === "delete") {
      route.fulfill({ status: 200 });
      return;
    }
    route.continue();
  });

  await page.goto("/");
  await page.click("text=Comments");

  // create
  await page.fill('input[placeholder="Write a comment"]', "Original comment");
  await page.click('button:has-text("Post")');
  await expect(page.locator("text=Original comment")).toBeVisible();

  // edit: accept prompt with new value and wait for PATCH response
  page.once("dialog", async (dialog) => dialog.accept("Edited comment"));
  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/comments/') && resp.request().method().toLowerCase() === 'patch'),
    page.click('button:has-text("Edit")'),
  ]);
  await expect(page.locator("text=Edited comment")).toBeVisible();

  // delete
  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/comments/') && resp.request().method().toLowerCase() === 'delete'),
    page.click('button:has-text("Delete")'),
  ]);
  await expect(page.locator("text=Edited comment")).not.toBeVisible();
});
