import { useCallback, useMemo, useState } from 'react'
import type { CalendarEventVM, MemberVM } from '@/features/calendar/types'

interface UseMemberFilterResult {
  /** Member ids currently hidden. */
  hidden: Set<string>
  isVisible: (memberId: string) => boolean
  toggle: (memberId: string) => void
  /** Keep an event if ANY of its owners is still visible. */
  filterEvents: (events: readonly CalendarEventVM[]) => CalendarEventVM[]
}

/**
 * Pure UI state for the member filter chips (show/hide a person's events). This is presentation-only
 * filtering — no business logic — so it legitimately lives in the frontend.
 */
export function useMemberFilter(_members: readonly MemberVM[]): UseMemberFilterResult {
  const [hidden, setHidden] = useState<Set<string>>(() => new Set())

  const isVisible = useCallback((memberId: string) => !hidden.has(memberId), [hidden])

  const toggle = useCallback((memberId: string) => {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(memberId)) {
        next.delete(memberId)
      } else {
        next.add(memberId)
      }
      return next
    })
  }, [])

  const filterEvents = useCallback(
    (events: readonly CalendarEventVM[]) =>
      events.filter((e) =>
        e.ownerMembers.length === 0
          ? true
          : e.ownerMembers.some((o) => !hidden.has(o.id))
      ),
    [hidden]
  )

  return useMemo(
    () => ({ hidden, isVisible, toggle, filterEvents }),
    [hidden, isVisible, toggle, filterEvents]
  )
}
