import { test, expect } from '@playwright/test'

/**
 * Register + Forgot-password are reskinned navigable placeholders (HES-REDESIGN A5): Warm Hearth
 * shell, NO credential inputs / NO submit (functional flows are a separate feature). These specs
 * assert the reskin renders, the zero-attack-surface invariant holds, and back-navigation works.
 */
test.describe('Register (/auth/register)', () => {
  test('renders the Warm Hearth create-household shell with no credential inputs', async ({ page }) => {
    await page.goto('/auth/register')
    await expect(page.getByText('Create your household')).toBeVisible()
    await expect(page.getByText('Registration is coming soon')).toBeVisible()
    // Zero attack surface: no password field, no create/submit button.
    await expect(page.locator('input[type="password"]')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Create account' })).toHaveCount(0)
  })

  test('"Sign in" link returns to login', async ({ page }) => {
    await page.goto('/auth/register')
    await page.getByRole('link', { name: 'Back to sign in' }).click()
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})

test.describe('Forgot password (/auth/forgot-password)', () => {
  test('renders the reskinned reset placeholder', async ({ page }) => {
    await page.goto('/auth/forgot-password')
    await expect(page.getByText('Reset your password')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toHaveCount(0)
  })

  test('"Back to sign in" link returns to login', async ({ page }) => {
    await page.goto('/auth/forgot-password')
    await page.getByRole('link', { name: 'Back to sign in' }).click()
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})
