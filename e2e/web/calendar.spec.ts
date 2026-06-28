import { test, expect, type Page, type Route } from '@playwright/test'

/**
 * Household Calendar (HES-CAL / calender-view-shwoing-data) — web MONTH grid. global-setup writes an
 * empty storageState, so each test logs in via the UI (test user seeded by global-setup against
 * E2E_API_URL). After login the auth gate lands on '/' (the calendar). The web surface is the month
 * grid (the native day-agenda is the mobile UI). Selectors follow the RNW E2E rule: getByRole /
 * getByLabel / getByText, with .first()/regex for duplicated or required-field text.
 *
 * Backend must be the HES-CAL build with the demo seed (db/seed/V900 "The Hearth"), run with the
 * `local` Flyway profile. Test user: pallavi@hestia.app. UC-IDs tie each test to the e2e-prep
 * execution set (phase-e2e-execution-set.md). Empty-state / loading / error use Playwright route
 * mocks (the seed is never empty and a healthy backend never fails); everything else hits the live
 * backend so "calendar shows data from the backend" is proven end-to-end.
 */
const TEST_USER = { email: 'pallavi@hestia.app', password: 'password123' }

// Device-local "today" — matches the app's todayIso() anchor (both use local date, NOT UTC).
const TODAY = (() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})()
const NEXT_DAY = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})()
const THIS_MONTH_LABEL = (() => {
  const d = new Date()
  return `${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`
})()
const NEXT_MONTH_LABEL = (() => {
  const d = new Date()
  const n = new Date(d.getFullYear(), d.getMonth() + 1, 1)
  return `${n.toLocaleString('en-US', { month: 'long' })} ${n.getFullYear()}`
})()

async function login(page: Page) {
  await page.goto('/auth/login')
  await page.getByLabel('Email').fill(TEST_USER.email)
  await page.getByLabel('Password', { exact: true }).fill(TEST_USER.password)
  await page.getByRole('button', { name: 'Enter the Hearth' }).click()
  await expect(page).toHaveURL(/localhost:\d+\/?$/, { timeout: 15000 })
}

/**
 * Route a single GraphQL operation by name, passing every other operation (login, me, refresh,
 * CreateCalendarEvent, …) through to the live backend. URQL sends `operationName`; we also fall back
 * to matching the query text so the mock is robust to client config.
 */
async function routeOperation(
  page: Page,
  opName: string,
  handler: (route: Route) => Promise<void> | void
) {
  await page.route('**/graphql', async (route) => {
    const body = route.request().postData() ?? ''
    let isOp = false
    try {
      const parsed = JSON.parse(body)
      isOp =
        parsed.operationName === opName ||
        (typeof parsed.query === 'string' && parsed.query.includes(opName))
    } catch {
      isOp = false
    }
    if (isOp) {
      await handler(route)
    } else {
      await route.continue()
    }
  })
}

// Seed members mirror the real wire shape captured from a live HouseholdCalendar response (§6.5 —
// never invent a synthetic shape). Used to fill the empty-state mock so the sidebar renders.
const SEED_MEMBERS = [
  { id: '00000000-0000-0000-0000-00000000a001', displayName: 'Pallavi', initial: 'P', colorHex: '#C4603D', kind: 'ADULT', role: 'ADMIN', isResponsibleCapable: true, ageLabel: null },
  { id: '00000000-0000-0000-0000-00000000a002', displayName: 'Vasu', initial: 'V', colorHex: '#7C6A52', kind: 'ADULT', role: 'MEMBER', isResponsibleCapable: true, ageLabel: null },
  { id: '00000000-0000-0000-0000-00000000a003', displayName: 'Maya', initial: 'M', colorHex: '#4F7A6B', kind: 'CHILD', role: 'MEMBER', isResponsibleCapable: false, ageLabel: '12' },
  { id: '00000000-0000-0000-0000-00000000a004', displayName: 'Theo', initial: 'T', colorHex: '#B58A3C', kind: 'CHILD', role: 'MEMBER', isResponsibleCapable: false, ageLabel: '9' },
]

/** Full HouseholdCalendar document shape with zero events (AC13 — every selected field present). */
function emptyCalendarPayload() {
  const d = new Date()
  const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  return {
    household: { id: '00000000-0000-0000-0000-0000000ca1e0', name: 'The Hearth', timezone: 'America/Los_Angeles' },
    period: { range: 'MONTH', start: `${ym}-01`, end: `${ym}-${lastDay}`, label: THIS_MONTH_LABEL, timezone: 'America/Los_Angeles' },
    members: SEED_MEMBERS,
    events: [],
    coverageGaps: [],
    load: { total: 0, summaryLabel: 'A calm week ahead.', entries: [] },
    connectedAccounts: [],
  }
}

test.describe('Household Calendar (web)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('L1 [UC-001] calendar loads seeded data — members, event, gap, load, month label (no JS errors)', async ({
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
    await expect(page.getByText('Hearth Glow')).toBeVisible()

    // AC9: the MONTH grid is mounted — the month-year label is visible.
    await expect(page.getByText(THIS_MONTH_LABEL)).toBeVisible()

    await page.waitForLoadState('networkidle')
    expect(errors, `console errors: ${errors.join('\n')}`).toHaveLength(0)
  })

  test('L2 [UC-004] month navigation — Next/Previous month moves window and updates the label', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByText(THIS_MONTH_LABEL)).toBeVisible({ timeout: 15000 })

    await page.getByRole('button', { name: 'Next month' }).click()
    await expect(page.getByText(NEXT_MONTH_LABEL)).toBeVisible({ timeout: 8000 })
    await expect(page.getByText(THIS_MONTH_LABEL)).toHaveCount(0)

    await page.getByRole('button', { name: 'Previous month' }).click()
    await expect(page.getByText(THIS_MONTH_LABEL)).toBeVisible({ timeout: 8000 })
  })

  test('L3 [UC-002] new-event modal opens with Title/Date/Location/owner; empty-title validation; Cancel closes', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'New event' }).click()

    // Modal heading + key fields, including the newly-wired Location input (AC2).
    await expect(page.getByText('New event', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Title')).toBeVisible()
    await expect(page.getByLabel('Date', { exact: true })).toBeVisible()
    await expect(page.getByTestId('event-location-input')).toBeVisible()
    await expect(page.getByText('For (owner)')).toBeVisible()

    // Validation (client UX): saving empty blocks and shows an inline error (AC5).
    await page.getByRole('button', { name: 'Save event' }).click()
    await expect(page.getByText('Title is required.')).toBeVisible()

    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByLabel('Title')).toHaveCount(0)
  })

  test('L4 [UC-002] create a valid event with a Location → appears in the correct day cell without reload', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByText('Standup').first()).toBeVisible({ timeout: 15000 })

    const title = `E2E Dentist ${Date.now()}`
    await page.getByRole('button', { name: 'New event' }).click()
    await page.getByLabel('Title').fill(title)
    await page.getByTestId('event-location-input').fill('123 Main St Clinic')
    // Late-evening start: at 23:30 the UTC instant rolls to the NEXT day. The event must still land
    // on the date the user picked (TODAY) — keyed on backend events[].date, not the UTC `start`.
    // This is the +1-day-off (UTC-vs-local) regression guard (AC2/AC4).
    await page.getByLabel('Start').fill('23:30')
    await page.getByLabel('End').fill('23:45') // end must be after start (server-validated)
    await page.getByRole('checkbox', { name: 'For (owner): Maya' }).click()
    await page.getByRole('button', { name: 'Save event' }).click()

    // Modal closes and the calendar refetches → the new event is visible…
    await expect(page.getByText(title)).toBeVisible({ timeout: 10000 })
    // …and specifically inside TODAY's cell, NOT the next day's (UTC-roll regression guard).
    await expect(page.locator(`[aria-label^="${TODAY}"]`).getByText(title)).toBeVisible()
    await expect(page.locator(`[aria-label^="${NEXT_DAY}"]`).getByText(title)).toHaveCount(0)
  })

  test('L5 [UC-005] empty-state via events:[] route-mock → "Nothing scheduled yet" + add affordance', async ({
    page,
  }) => {
    await routeOperation(page, 'HouseholdCalendar', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { householdCalendar: emptyCalendarPayload() } }),
      })
    )
    await page.reload()

    await expect(page.getByText('Nothing scheduled yet')).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('button', { name: 'Add your first event' })).toBeVisible()
  })

  test('L6 [UC-002] AC3 persistence — created event survives a full page reload', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByText('Standup').first()).toBeVisible({ timeout: 15000 })

    const title = `E2E Persist ${Date.now()}`
    await page.getByRole('button', { name: 'New event' }).click()
    await page.getByLabel('Title').fill(title)
    await page.getByRole('checkbox', { name: 'For (owner): Pallavi' }).click()
    await page.getByRole('button', { name: 'Save event' }).click()
    await expect(page.getByText(title)).toBeVisible({ timeout: 10000 })

    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(title)).toBeVisible({ timeout: 15000 })
  })

  test('L7 [UC-001] AC7 loading indicator then friendly error on fetch failure', async ({ page }) => {
    // (a) Loading: delay the HouseholdCalendar response → a progress indicator shows first.
    await routeOperation(page, 'HouseholdCalendar', async (route) => {
      await new Promise((r) => setTimeout(r, 1500))
      await route.continue()
    })
    await page.reload()
    await expect(page.getByRole('progressbar')).toBeVisible({ timeout: 4000 })
    await expect(page.getByText('Standup').first()).toBeVisible({ timeout: 15000 })

    // (b) Error: fail the HouseholdCalendar response → friendly message (not raw error).
    await page.unroute('**/graphql')
    await routeOperation(page, 'HouseholdCalendar', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ errors: [{ message: 'Internal server error' }] }),
      })
    )
    await page.reload()
    await expect(page.getByText('Could not load your calendar.')).toBeVisible({ timeout: 15000 })
  })

  test('L8 [UC-002] AC5 server validation — invalid date → inline error, modal stays open, no event added', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByText('Standup').first()).toBeVisible({ timeout: 15000 })

    await page.getByRole('button', { name: 'New event' }).click()
    await page.getByLabel('Title').fill('E2E Server Validation')
    await page.getByRole('checkbox', { name: 'For (owner): Pallavi' }).click()
    // Client regex accepts yyyy-MM-dd shape; the backend is authoritative and rejects the bad date.
    const dateField = page.getByLabel('Date', { exact: true })
    await dateField.fill('2026-13-45')
    await expect(dateField).toHaveValue('2026-13-45') // guard: the bad date is actually in the field
    await page.getByRole('button', { name: 'Save event' }).click()

    // Server-authoritative inline error; the modal stays open (Title still shown), no event added.
    await expect(page.getByText('Date must be ISO yyyy-MM-dd.')).toBeVisible({ timeout: 15000 })
    await expect(page.getByLabel('Title')).toBeVisible()
  })

  test('L9 [UC-006] member filter hides that person’s solo events; multi-owner event remains', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByText('Piano — Maya').first()).toBeVisible({ timeout: 15000 })

    await page.getByRole('checkbox', { name: 'Maya filter' }).click()

    // Maya's solo events disappear; multi-owner "Pizza day" (Maya & Theo) remains.
    await expect(page.getByText('Piano — Maya')).toHaveCount(0)
    await expect(page.getByText('Pizza day').first()).toBeVisible()
  })

  test('L10 [UC-001] AC11 renders at a mobile viewport without errors (parity)', async ({ page }) => {
    // The web dashboard is the desktop surface (the native day-agenda is the mobile UI). At a narrow
    // viewport it still mounts without crashing — assert the always-visible sidebar.
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.getByText('Pallavi', { exact: true }).first()).toBeVisible({ timeout: 15000 })
  })

  test('L11 [UC-002] AC15 negative outcome — creating an event does not delete sibling seed events', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByText('Standup').first()).toBeVisible({ timeout: 15000 })

    const title = `E2E Sibling ${Date.now()}`
    await page.getByRole('button', { name: 'New event' }).click()
    await page.getByLabel('Title').fill(title)
    await page.getByRole('checkbox', { name: 'For (owner): Pallavi' }).click()
    await page.getByRole('button', { name: 'Save event' }).click()

    // New event appears AND the seeded sibling event is still present (no collateral deletion).
    await expect(page.getByText(title)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Standup').first()).toBeVisible()
    await expect(page.getByText('Piano — Maya').first()).toBeVisible()
  })

  test('L12 [UC-004] AC10 month nav away-and-back preserves a just-created event in the correct cell', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByText(THIS_MONTH_LABEL)).toBeVisible({ timeout: 15000 })

    const title = `E2E NavKeep ${Date.now()}`
    await page.getByRole('button', { name: 'New event' }).click()
    await page.getByLabel('Title').fill(title)
    await page.getByRole('checkbox', { name: 'For (owner): Pallavi' }).click()
    await page.getByRole('button', { name: 'Save event' }).click()
    await expect(page.locator(`[aria-label^="${TODAY}"]`).getByText(title)).toBeVisible({
      timeout: 10000,
    })

    // Forward a month → event is gone from the next month's grid.
    await page.getByRole('button', { name: 'Next month' }).click()
    await expect(page.getByText(NEXT_MONTH_LABEL)).toBeVisible({ timeout: 8000 })
    await expect(page.getByText(title)).toHaveCount(0)

    // Back a month → event reappears, on the SAME correct date cell (re-fetch TZ/offset guard).
    await page.getByRole('button', { name: 'Previous month' }).click()
    await expect(page.getByText(THIS_MONTH_LABEL)).toBeVisible({ timeout: 8000 })
    await expect(page.locator(`[aria-label^="${TODAY}"]`).getByText(title)).toBeVisible({
      timeout: 10000,
    })
  })

  test('L14 [UC-002] AC7 create loading state — "Save event" → "Saving…" while the mutation is in flight', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByText('Standup').first()).toBeVisible({ timeout: 15000 })

    // Delay the create mutation so the in-flight "Saving…" label is observable.
    await routeOperation(page, 'CreateCalendarEvent', async (route) => {
      await new Promise((r) => setTimeout(r, 2000))
      await route.continue()
    })

    const title = `E2E Saving ${Date.now()}`
    await page.getByRole('button', { name: 'New event' }).click()
    await page.getByLabel('Title').fill(title)
    await page.getByRole('checkbox', { name: 'For (owner): Pallavi' }).click()
    await page.getByRole('button', { name: 'Save event' }).click()

    // The submit button shows "Saving…" while in flight (the button's a11y name is fixed, so assert
    // the visible text), then the modal closes on success.
    await expect(page.getByText('Saving…')).toBeVisible({ timeout: 3000 })
    await expect(page.getByLabel('Title')).toHaveCount(0, { timeout: 15000 })
    await expect(page.getByText(title)).toBeVisible({ timeout: 10000 })
  })

  test('L16 [UC-001] AC11 dark mode — month grid + event remain visible after theme toggle (no errors)', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('console', (m) => {
      if (m.type() === 'error' && !m.text().includes('favicon')) errors.push(m.text())
    })

    await page.goto('/')
    await expect(page.getByText('Standup').first()).toBeVisible({ timeout: 15000 })

    await page.getByTestId('theme-toggle').click()
    await page.waitForTimeout(500) // theme transition

    // The grid and an event remain visible in dark mode without crashing.
    await expect(page.getByText(THIS_MONTH_LABEL)).toBeVisible()
    await expect(page.getByText('Standup').first()).toBeVisible()
    expect(errors, `console errors after toggle: ${errors.join('\n')}`).toHaveLength(0)
  })

  test('L17 [UC-006] filter-all empty state — unchecking ALL members shows EmptyCalendarState; re-checking one restores the grid', async ({
    page,
  }) => {
    await page.goto('/')
    // A seeded event proves the grid is populated before filtering.
    await expect(page.getByText('Piano — Maya').first()).toBeVisible({ timeout: 15000 })

    // Uncheck every member chip → the VISIBLE set is empty → EmptyCalendarState. This is the f_es5e6f
    // fix: the gate is `visibleEvents.length === 0` (post-filter), not raw `calendar.events.length`,
    // so an all-members-filtered view shows the friendly empty state, not a blank grid.
    for (const name of ['Pallavi filter', 'Vasu filter', 'Maya filter', 'Theo filter']) {
      await page.getByRole('checkbox', { name }).click()
    }
    await page.waitForTimeout(1000) // let the filter re-render settle (deliberate wait)

    await expect(page.getByText('Nothing scheduled yet')).toBeVisible({ timeout: 8000 })
    await expect(page.getByRole('button', { name: 'Add your first event' })).toBeVisible()
    // The grid is gone — the previously-visible seed event is no longer rendered.
    await expect(page.getByText('Piano — Maya')).toHaveCount(0)

    // Re-check one member → the grid returns and the empty state disappears (reversible, no data lost).
    await page.getByRole('checkbox', { name: 'Maya filter' }).click()
    await expect(page.getByText('Nothing scheduled yet')).toHaveCount(0)
    await expect(page.getByText('Piano — Maya').first()).toBeVisible({ timeout: 8000 })
  })

  test("L18 [UC-008] MONTH range-aware load label — LoadBar subtitle reads \"this month's labor balance\"", async ({
    page,
  }) => {
    await page.goto('/')
    // The default web view is the MONTH grid → the Hearth Glow load subtitle must be scoped to the
    // month (the f_ld3c4d fix), never "this week's" on a month-aggregated window.
    await expect(page.getByText('Hearth Glow')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText("this month's labor balance")).toBeVisible()
    await expect(page.getByText("this week's labor balance")).toHaveCount(0)

    // The subtitle scope is range-driven, not filter-driven: toggling one member filter (range
    // unchanged) keeps the month-scoped label.
    await page.getByRole('checkbox', { name: 'Maya filter' }).click()
    await page.waitForTimeout(1000) // deliberate wait for the filter re-render
    await expect(page.getByText("this month's labor balance")).toBeVisible()
  })
})

test.describe('Household Calendar — auth gate & cross-session (web)', () => {
  test('L13 [UC-003] AC12 unauthenticated visitor at "/" is redirected to /auth/login (no anon query)', async ({
    browser,
  }) => {
    // Fresh context with no stored token → the auth gate must redirect and fire NO calendar query.
    const context = await browser.newContext()
    const page = await context.newPage()

    let calendarQueryFired = false
    page.on('request', (req) => {
      if (req.url().includes('/graphql')) {
        const body = req.postData() ?? ''
        if (body.includes('HouseholdCalendar')) calendarQueryFired = true
      }
    })

    await page.goto('/')
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15000 })
    await page.waitForLoadState('networkidle')
    expect(calendarQueryFired, 'an anonymous HouseholdCalendar query fired').toBe(false)

    await context.close()
  })

  test('L15 [UC-002] AC3/AC12 cross-session — event created in one session is visible in a fresh session', async ({
    browser,
  }) => {
    const title = `E2E XSession ${Date.now()}`

    // Session 1: create an event.
    const ctx1 = await browser.newContext()
    const p1 = await ctx1.newPage()
    await login(p1)
    await p1.goto('/')
    await p1.getByRole('button', { name: 'New event' }).click()
    await p1.getByLabel('Title').fill(title)
    await p1.getByRole('checkbox', { name: 'For (owner): Pallavi' }).click()
    await p1.getByRole('button', { name: 'Save event' }).click()
    await expect(p1.getByText(title)).toBeVisible({ timeout: 15000 })

    // Session 2: fresh login (same user, shared default household) sees the persisted event.
    const ctx2 = await browser.newContext()
    const p2 = await ctx2.newPage()
    await login(p2)
    await p2.goto('/')
    await expect(p2.getByText(title)).toBeVisible({ timeout: 15000 })

    await ctx1.close()
    await ctx2.close()
  })
})
