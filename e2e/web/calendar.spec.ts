import { test, expect } from '@playwright/test'

/**
 * Household Calendar (HES-CAL) — web week dashboard. The `web` project is pre-authenticated
 * (global-setup storageState), so '/' lands on the calendar. Selectors use getByRole/getByLabel/
 * getByText per the RNW E2E rule. Backend must be seeded with "The Hearth" (V003).
 */
test.describe('Household Calendar (web)', () => {
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
    const header = page.locator('text=/\\w+ \\d+ . \\d+, \\d{4}/').first()
    await expect(header).toBeVisible({ timeout: 15000 })
    const before = await header.textContent()

    await page.getByRole('button', { name: 'Next week' }).click()

    await expect
      .poll(async () => (await header.textContent()) !== before, { timeout: 5000 })
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

  test('F1 — renders at a mobile viewport without errors', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.getByText('Standup').first()).toBeVisible({ timeout: 15000 })
  })
})
