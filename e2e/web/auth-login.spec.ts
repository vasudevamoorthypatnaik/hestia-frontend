import { test, expect } from '@playwright/test'

// Login is the unauthenticated entry. We enter at '/', which the auth gate redirects to
// /auth/login (no token). Selectors use getByLabel/getByRole per the RNW E2E rule (T2).
const TEST_USER = { email: 'pallavi@hestia.app', password: 'password123' }

test.describe('Login (/auth/login)', () => {
  test('redirects unauthenticated root to the sign-in screen (U1/U3)', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/auth\/login/)
    // Warm Hearth hero tagline + welcome copy + renamed CTA (string-rename contract).
    await expect(page.getByText("Keep the hearth glowing, even when you're apart.")).toBeVisible()
    await expect(page.getByText('Welcome Home')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Enter the Hearth' })).toBeVisible()
  })

  test('shows generic error on invalid credentials (T2/U7)', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel('Email').fill('nobody@hestia.app')
    await page.getByLabel('Password', { exact: true }).fill('wrongpassword')
    await page.getByRole('button', { name: 'Enter the Hearth' }).click()
    await expect(page.getByText('Invalid email or password. Please try again.')).toBeVisible()
  })

  test('Google/Apple are present but inert (T7)', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByText('Google', { exact: true })).toBeVisible()
    await expect(page.getByText('Apple', { exact: true })).toBeVisible()
    await expect(page.getByText('soon').first()).toBeVisible()
  })

  test('password show/hide toggle is present (U5)', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByRole('button', { name: 'Show password' })).toBeVisible()
  })

  test('successful login lands on the household home (U6/U7)', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel('Email').fill(TEST_USER.email)
    await page.getByLabel('Password', { exact: true }).fill(TEST_USER.password)
    await page.getByRole('button', { name: 'Enter the Hearth' }).click()
    // The auth-gated landing is the household calendar — the Hearth Glow footer + Sign out appear.
    await expect(page.getByText('Hearth Glow')).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
  })
})
