import { useCallback, useState } from 'react'
import { useSyncExternalStore } from 'react'
import { useHouseholdCalendarQuery, type CalendarRange } from '@/__generated__/graphql'
import {
  subscribeToTokenChanges,
  getTokenChangeVersion,
  getAccessTokenSync,
} from '@/shared/auth/token'
import { addDaysIso, todayIso, type CalendarVM } from '@/features/calendar/types'

interface UseHouseholdCalendarResult {
  calendar: CalendarVM | null
  fetching: boolean
  error: boolean
  /** ISO yyyy-MM-dd anchor of the shown period. */
  anchor: string
  /** Move the window: +1/-1 (week when range=WEEK, day when range=DAY). */
  shiftPeriod: (direction: number) => void
  /** Reset to the current week/today. */
  resetToToday: () => void
  /** Force a fresh fetch (e.g. after creating an event). */
  refetch: () => void
  hasToken: boolean
}

/**
 * Household calendar query for a given range. The query is PAUSED until an auth token is hydrated
 * (TAC-6) — mirrors UserProfileProvider so the anonymous app issues zero authenticated requests.
 * Period navigation re-queries the backend (which recomputes the window, gaps, and load).
 */
export function useHouseholdCalendar(range: CalendarRange): UseHouseholdCalendarResult {
  // Re-render on login/logout so `pause` re-evaluates the instant a token appears.
  useSyncExternalStore(subscribeToTokenChanges, getTokenChangeVersion, getTokenChangeVersion)
  const hasToken = !!getAccessTokenSync()

  const [anchor, setAnchor] = useState<string>(() => todayIso())

  const [{ data, fetching, error }, reexecuteQuery] = useHouseholdCalendarQuery({
    variables: { period: { anchor, range } },
    pause: !hasToken,
  })

  const refetch = useCallback(
    () => reexecuteQuery({ requestPolicy: 'network-only' }),
    [reexecuteQuery]
  )

  const shiftPeriod = useCallback(
    (direction: number) => {
      setAnchor((prev) => addDaysIso(prev, range === 'WEEK' ? direction * 7 : direction))
    },
    [range]
  )

  const resetToToday = useCallback(() => setAnchor(todayIso()), [])

  return {
    calendar: data?.householdCalendar ?? null,
    fetching: hasToken && fetching,
    error: !!error,
    anchor,
    shiftPeriod,
    resetToToday,
    refetch,
    hasToken,
  }
}
