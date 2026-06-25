import { test, expect, type Page } from '@playwright/test'

/**
 * Household Calendar (HES-CAL) — web week dashboard. global-setup writes empty storageState, so
 * each test logs in (test user seeded by global-setup against E2E_API_URL). After login the auth
 * gate lands on '/' (the calendar). Selectors use getByRole/getByLabel/getByText per the RNW rule.
 * Backend must be the HES-CAL build with the demo seed (db/seed/V900 "The Hearth"), i.e. run with
 * the `local`/`test` Flyway profile. Uses the global-setup test user pallavi@hestia.app.
 */
const TEST_USER = { email: 'pallavi@hestia.app', password: 'password123' }

async function login(page: Page) {
  await page.goto('/auth/login')
  await page.getByLabel('Email').fill(TEST_USER.email)
  await page.getByLabel('Password', { exact: true }).fill(TEST_USER.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/localhost:\d+\/?$/, { timeout: 15000 })
}

test.describe('Household Calendar (web)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('A1 — calendar loads with seeded household, events, gap, and load (no JS errors)', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('console', (m) => {
      if (m.type() === 'error' && !m.text().includes('favicon')) errors.push(m.text())
    })

    await page.goto('/')

    // Members in the sidebar
    await expect(page.getByText('Pallavi', { exact: true }).first()).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Vasu', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Maya', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Theo', { exact: true }).first()).toBeVisible()

    // A seeded event, the coverage-gap banner, and the load bar (all backend-computed)
    await expect(page.getByText('Standup').first()).toBeVisible()
    await expect(page.getByText(/unassigned/i).first()).toBeVisible()
    await expect(page.getByText("This week's load")).toBeVisible()

    expect(errors, `console errors: ${errors.join('\n')}`).toHaveLength(0)
  })

  test('B1 — member filter hides that person’s solo events', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Piano — Maya').first()).toBeVisible({ timeout: 15000 })

    await page.getByRole('checkbox', { name: 'Maya filter' }).click()

    // Maya's solo events disappear; multi-owner "Pizza day" (Maya & Theo) remains.
    await expect(page.getByText('Piano — Maya')).toHaveCount(0)
    await expect(page.getByText('Pizza day').first()).toBeVisible()
  })

  test('C1 — period navigation moves the week window', async ({ page }) => {
    await page.goto('/')
    // The period header is the only element ending in a 4-digit year (e.g. "Jun 22 – 28, 2026").
    const header = page.getByText(/\d+,\s*\d{4}$/).first()
    await expect(header).toBeVisible({ timeout: 15000 })
    const before = (await header.textContent())?.trim()

    await page.getByRole('button', { name: 'Next week' }).click()

    await expect
      .poll(async () => (await header.textContent())?.trim() !== before, { timeout: 8000 })
      .toBe(true)
  })

  test('D1 — New event modal opens with the create form, and cancels', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'New event' }).click()

    await expect(page.getByText('New event', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Title')).toBeVisible()
    await expect(page.getByText('For (owner)')).toBeVisible()

    // Validation: saving empty blocks and shows an error.
    await page.getByRole('button', { name: 'Save event' }).click()
    await expect(page.getByText('Title is required.')).toBeVisible()

    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByLabel('Title')).toHaveCount(0)
  })

  test('D2 — creating an event makes it appear on the calendar', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Standup').first()).toBeVisible({ timeout: 15000 })

    const title = `E2E Dentist ${Date.now()}`
    await page.getByRole('button', { name: 'New event' }).click()
    await page.getByLabel('Title').fill(title)
    await page.getByRole('checkbox', { name: 'For (owner): Maya' }).click()
    await page.getByRole('button', { name: 'Save event' }).click()

    // Modal closes and the calendar refetches → the new event is visible in the current week.
    await expect(page.getByText(title)).toBeVisible({ timeout: 10000 })
  })

  test('F1 — renders at a mobile viewport without errors', async ({ page }) => {
    // The web dashboard is the desktop surface (the native day-agenda is the mobile UI). At a
    // narrow viewport it still mounts without crashing — assert the always-visible sidebar.
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.getByText('Pallavi', { exact: true }).first()).toBeVisible({ timeout: 15000 })
  })
})
