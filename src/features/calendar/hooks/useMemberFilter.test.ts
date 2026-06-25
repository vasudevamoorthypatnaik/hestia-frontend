import { renderHook, act } from '@testing-library/react-native'
import { useMemberFilter } from './useMemberFilter'
import type { CalendarEventVM, MemberVM } from '@/features/calendar/types'

const member = (id: string): MemberVM =>
  ({ id, displayName: id, initial: id[0]!, colorHex: '#000', kind: 'ADULT', role: 'MEMBER', isResponsibleCapable: true, ageLabel: null }) as MemberVM

const event = (id: string, ownerIds: string[]): CalendarEventVM =>
  ({ id, ownerMembers: ownerIds.map((o) => ({ id: o })) }) as unknown as CalendarEventVM

describe('useMemberFilter', () => {
  it('hides and re-shows a member, filtering their events out', () => {
    const members = [member('a'), member('b')]
    const { result } = renderHook(() => useMemberFilter(members))

    expect(result.current.isVisible('a')).toBe(true)

    act(() => result.current.toggle('a'))
    expect(result.current.isVisible('a')).toBe(false)

    const events = [event('e1', ['a']), event('e2', ['b'])]
    expect(result.current.filterEvents(events).map((e) => e.id)).toEqual(['e2'])

    act(() => result.current.toggle('a'))
    expect(result.current.filterEvents(events)).toHaveLength(2)
  })

  it('keeps a multi-owner event while any owner is still visible', () => {
    const { result } = renderHook(() => useMemberFilter([member('a'), member('b')]))
    act(() => result.current.toggle('a'))
    const shared = [event('e1', ['a', 'b'])]
    expect(result.current.filterEvents(shared)).toHaveLength(1)
  })
})
