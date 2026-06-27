import type {
  CalendarRange,
  HouseholdCalendarQuery,
  MemberKind,
  MemberRole,
  SyncStatus,
} from '@/__generated__/graphql'

/**
 * View-model aliases derived from the generated query type — components consume ONLY these,
 * never hand-written GraphQL shapes (TAC-5).
 */
export type CalendarVM = NonNullable<HouseholdCalendarQuery['householdCalendar']>
export type CalendarEventVM = CalendarVM['events'][number]
export type MemberVM = CalendarVM['members'][number]
export type CalendarLoadVM = CalendarVM['load']
export type CoverageGapVM = CalendarVM['coverageGaps'][number]
export type ConnectedAccountVM = CalendarVM['connectedAccounts'][number]

/**
 * Runtime value objects for GraphQL enums. The generated enums are compile-time string-literal
 * unions only (no runtime object), so accessing them as values needs these constants.
 * See CLAUDE.md "GraphQL Enum Types vs Runtime Values".
 */
export const CalendarRangeValues = {
  Day: 'DAY' as CalendarRange,
  Week: 'WEEK' as CalendarRange,
  Month: 'MONTH' as CalendarRange,
} as const

export const MemberKindValues = {
  Adult: 'ADULT' as MemberKind,
  Child: 'CHILD' as MemberKind,
} as const

export const MemberRoleValues = {
  Admin: 'ADMIN' as MemberRole,
  Member: 'MEMBER' as MemberRole,
  None: 'NONE' as MemberRole,
} as const

export const SyncStatusValues = {
  Synced: 'SYNCED' as SyncStatus,
  Disconnected: 'DISCONNECTED' as SyncStatus,
} as const

/** Today's date as a local ISO yyyy-MM-dd (no timezone shift). */
export function todayIso(): string {
  return toIsoDate(new Date())
}

/** Format a Date as local yyyy-MM-dd. */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Add (or subtract) whole days to an ISO yyyy-MM-dd, returning ISO yyyy-MM-dd. */
export function addDaysIso(iso: string, days: number): string {
  const parts = iso.split('-')
  const y = parseInt(parts[0] ?? '1970', 10)
  const m = parseInt(parts[1] ?? '1', 10)
  const d = parseInt(parts[2] ?? '1', 10)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}

/**
 * Add (or subtract) whole months to an ISO yyyy-MM-dd (for MONTH period navigation). The day is
 * clamped to the target month's length (e.g. Jan 31 +1mo -> Feb 28) so the result is always a real
 * date. Only the month matters to the backend (it resolves the window from the 1st), but clamping
 * keeps this a correct general helper.
 */
export function addMonthsIso(iso: string, months: number): string {
  const parts = iso.split('-')
  const y = parseInt(parts[0] ?? '1970', 10)
  const m = parseInt(parts[1] ?? '1', 10)
  const d = parseInt(parts[2] ?? '1', 10)
  const base = new Date(y, m - 1 + months, 1)
  const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
  return toIsoDate(new Date(base.getFullYear(), base.getMonth(), Math.min(d, lastDay)))
}

/** First day (yyyy-MM-01) of the month containing the given ISO yyyy-MM-dd. */
export function startOfMonthIso(iso: string): string {
  const parts = iso.split('-')
  const y = parseInt(parts[0] ?? '1970', 10)
  const m = parseInt(parts[1] ?? '1', 10)
  return toIsoDate(new Date(y, m - 1, 1))
}
