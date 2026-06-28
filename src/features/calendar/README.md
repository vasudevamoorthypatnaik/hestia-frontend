# Calendar feature (HES-CAL)

The **Household Calendar** — a read-over-layer on the household's events, plus manual event
creation. Proves the PRD "household layer" wedge (owner vs responsible adult, coverage gaps,
weekly load) without rebuilding a full calendar engine.

## Surfaces
- **Web** (`CalendarScreen.web.tsx`): **month grid** dashboard — member/connected-accounts sidebar,
  Mon–Sun month grid (`MonthGrid.web.tsx`, `range: MONTH`), coverage-gap banner, "Hearth Glow"
  balance bar, `+ New event` modal. A friendly empty state appears when the month has no events.
- **Mobile** (`CalendarScreen.tsx`): single-day agenda — member filter chips, coverage-gap banner,
  timeline, bottom nav (Calendar active; Capture/Load inert), `+` opens the create form. The same
  empty-state affordance shows when a day has nothing scheduled.

> **Layout-density divergence (allowed):** web uses a month grid, mobile keeps the day agenda. Data,
> create flow, validation, and empty-state affordance are identical across platforms (`10_cross-platform-patterns §2.2`).

Metro resolves the platform variant from the shared route `app/(tabs)/index.tsx` (the calendar is
the auth-gated landing).

## Backend-driven (presentation-layer rule)
Everything computed comes from the `householdCalendar` query: per-event `colorHex`, `timeLabel`,
`isCoverageGap`, the `coverageGaps` list, the weekly `load` split (counts + percents), and the
period window/label. The frontend only renders. Member filtering and period-arrow navigation are
the only client-side logic (pure UI state).

## Data flow
`useHouseholdCalendar(range)` → generated `useHouseholdCalendarQuery` (PAUSED until an auth token
hydrates — no anonymous request, TAC-6). Period navigation re-queries the backend, which recomputes
the window in the household timezone. Creating an event → `useCreateCalendarEvent` →
`createCalendarEvent` mutation; on success the modal's `onCreated` callback triggers the screen's
`refetch()` (network-only) so the new event is guaranteed to appear.

## Files
- `api/*.graphql` — query + mutation documents (codegen → `@/__generated__/graphql`).
- `types.ts` — view-model aliases from generated types + runtime enum value objects
  (`CalendarRangeValues` incl. `Month`, `MemberKindValues`, `MemberRoleValues`, `SyncStatusValues`) +
  ISO date helpers (`todayIso`, `addDaysIso`, `addMonthsIso`, `startOfMonthIso`).
- `hooks/` — `useHouseholdCalendar` (query + period state; `shiftPeriod` moves ±1 month/week/day by
  range), `useMemberFilter` (show/hide), `useCreateCalendarEvent`.
- `components/` — `EventCard`, `MonthGrid.web` (month grid keyed by `events[].date`), `DayAgenda`,
  `EmptyCalendarState` (shared "add your first event" affordance), `MemberFilterChips`, `MemberDot`,
  `CoverageGapBanner`, `LoadBar`, `HouseholdSidebar.web`, `CalendarBottomNav`, `NewEventForm`
  (incl. optional **Location** field), `NewEventModal[.web]`.
- `screens/` — `CalendarScreen.web.tsx`, `CalendarScreen.tsx`.

## Scope (this slice)
In: view (color-by-person, owner vs responsible, coverage gaps, load), member filter, period nav,
manual event creation (web modal + mobile form), light/dark.
Out: smart capture, full Mental Load tab, sync-health screens, event edit/delete, assign/claim
(buttons rendered but inert), real Google/Apple sync (seeded "The Hearth" household).

## Tests
Jest/RTL: `useMemberFilter`, `useHouseholdCalendar` (pause + nav), `useCreateCalendarEvent`,
`EventCard`, `CoverageGapBanner`, `LoadBar`, `NewEventForm` (validation + submit). Playwright E2E
(`e2e/web/calendar.spec.ts`, web week view + mobile-viewport day view) is added in the E2E phase.

## Backend
`hestia-backend` module `hestia-event` (`com.hestia.event`): `householdCalendar` query +
`createCalendarEvent` mutation, Flyway `V002` (schema) + `V003` (idempotent seed). Events seeded as
(day-of-week, minute-of-day) and projected onto the requested week so the demo always looks current.

## HES-REDESIGN — Warm Hearth reskin (frontend-only)
Pure visual reskin to the Warm Hearth design system — **no backend / GraphQL / codegen change**
(every element already had its data). What changed:
- **Tokens + fonts:** all calendar components migrated to the Warm Hearth Material token set
  (primary / surface-container-* / on-surface / outline / secondary / error) with `dark:` variants;
  Quicksand headlines + Be Vietnam Pro body. Member event colors still come from backend `colorHex`.
- **`LoadBar` → "Hearth Glow":** header renamed to **"Hearth Glow"** (visible-string change — E2E
  updated); shows a per-member soft warm bar + a Balanced/Lopsided pill (Balanced when no adult
  >60%). Guards: returns null on empty entries OR `total === 0` (no divide-by-zero); single-member
  100% renders cleanly. Covered by `LoadBar.test.tsx`.
- **Icons:** sidebar nav + bottom nav use `@expo/vector-icons` MaterialIcons (calendar/mail/balance)
  instead of unicode glyphs.
- **NewEventModal (web + native):** reskinned tokens ONLY — overlay structure / pointer-events /
  `if (!visible) return null` pattern preserved (web-modal click-interception gotcha, FM8).
- Coverage-gap banner "Assign"/"Claim" stays inert (deferred — needs a new mutation).

## calender-view-shwoing-data — month grid, empty state, location
The calendar was already wired end-to-end to the real backend (`useHouseholdCalendar` →
`HouseholdCalendar` query → persisted rows) and the create round-trip already persisted + refetched.
This slice adds:
- **Month grid (web):** new `MonthGrid.web.tsx` renders Mon–Sun weeks spanning the backend MONTH
  window (`period.start` = 1st, `period.end` = last day), with leading/trailing out-of-month days, a
  today highlight, and each event placed on its concrete cell by `events[].date`. The web screen now
  requests `range: MONTH` and the nav arrows move ±1 month. **The MONTH window/label is computed in
  the backend** (`CalendarRange.MONTH`); the client only renders + tracks the anchor month.
- **Empty state:** new shared `EmptyCalendarState.tsx` ("Nothing scheduled yet" + an "Add your first
  event" button) opens the same New-event flow. Wired into the web month (no events that month) and
  the mobile day agenda (no events that day), so both platforms share the affordance (AC6/AC11).
- **Location field:** `NewEventForm` gains an optional Location input, threaded through to the
  `createCalendarEvent` mutation's `location` (previously hardcoded `null`). The backend already
  accepted/persisted/returned `location`.
- `WeekGrid.web.tsx` was removed — the web surface now uses the month grid (no week/month toggle in
  scope), so the week strip was orphaned dead code.

### PR-review follow-ups (range-aware "Hearth Glow" + filter-aware empty state)
- **`LoadBar` scope label:** the subtitle no longer hardcodes "this week's labor balance". It takes an
  optional `range` prop and reads `"this month's"` / `"today's"` / `"this week's"` to match the window
  the backend aggregated the load over (`CalendarScreen.web` passes `calendar.period.range`). This
  pairs with the backend nudge fix (`summaryLabel` is now range-scoped). Presentation-only.
- **Empty state honors the member filter:** the web screen now gates the empty state on
  `filterEvents(calendar.events).length === 0` (computed once as `visibleEvents`), so unchecking every
  member shows `EmptyCalendarState` instead of a blank grid.
