import { test, expect } from '@playwright/test'

test('profile update flow', async ({ page }) => {
  // pretend user is logged in by pre-setting localStorage token
  await page.addInitScript(() => localStorage.setItem('token', 'fake-token'))

  // mock GET /users/me
  await page.route('**/users/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', username: 'first_user', email: 'first@example.com', bio: '' }),
    }),
  )

  // mock PATCH /users/me
  await page.route('**/users/me', (route) => {
    const req = route.request()
    if (req.method().toLowerCase() === 'patch') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', username: 'first_user', email: 'first@example.com', bio: 'I build APIs' }),
      })
      return
    }
    route.continue()
  })

  await page.goto('/users/me')
  await page.fill('#bio', 'I build APIs')
  await page.click('button:has-text("Save changes")')

  await expect(page.locator('role=status')).toContainText('Profile updated')
})
