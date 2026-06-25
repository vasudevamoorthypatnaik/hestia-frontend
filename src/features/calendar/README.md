# Calendar feature (HES-CAL)

The **Household Calendar** — a read-over-layer on the household's events, plus manual event
creation. Proves the PRD "household layer" wedge (owner vs responsible adult, coverage gaps,
weekly load) without rebuilding a full calendar engine.

## Surfaces
- **Web** (`CalendarScreen.web.tsx`): Mon–Sun week dashboard — member/connected-accounts sidebar,
  7-column week grid, coverage-gap banner, "This week's load" balance bar, `+ New event` modal.
- **Mobile** (`CalendarScreen.tsx`): single-day agenda — member filter chips, coverage-gap banner,
  timeline, bottom nav (Calendar active; Capture/Load inert), `+` opens the create form.

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
  (`CalendarRangeValues`, `MemberKindValues`, `MemberRoleValues`, `SyncStatusValues`) + ISO date helpers.
- `hooks/` — `useHouseholdCalendar` (query + period state), `useMemberFilter` (show/hide), `useCreateCalendarEvent`.
- `components/` — `EventCard`, `WeekGrid.web`, `DayAgenda`, `MemberFilterChips`, `MemberDot`,
  `CoverageGapBanner`, `LoadBar`, `HouseholdSidebar.web`, `CalendarBottomNav`, `NewEventForm`,
  `NewEventModal[.web]`.
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
