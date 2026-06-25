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
