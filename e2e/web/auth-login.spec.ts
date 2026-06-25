import { test, expect } from '@playwright/test'

// Login is the unauthenticated entry. We enter at '/', which the auth gate redirects to
// /auth/login (no token). Selectors use getByLabel/getByRole per the RNW E2E rule (T9).
const TEST_USER = { email: 'pallavi@hestia.app', password: 'password123' }

test.describe('Login (/auth/login)', () => {
  test('redirects unauthenticated root to the sign-in screen (U1/T10)', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/auth\/login/)
    await expect(page.getByText('Welcome back to your household.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('shows generic error on invalid credentials (T2/T8)', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel('Email').fill('nobody@hestia.app')
    await page.getByLabel('Password', { exact: true }).fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Invalid email or password. Please try again.')).toBeVisible()
  })

  test('Google/Apple are present but inert (U7/T14)', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByText('Google', { exact: true })).toBeVisible()
    await expect(page.getByText('Apple', { exact: true })).toBeVisible()
    await expect(page.getByText('soon').first()).toBeVisible()
  })

  test('successful login lands on the household home (U2/U6)', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel('Email').fill(TEST_USER.email)
    await page.getByLabel('Password', { exact: true }).fill(TEST_USER.password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    // The auth-gated landing is now the household calendar (HES-CAL) — Sign out remains reachable.
    await expect(page.getByText("This week's load")).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
  })
})
