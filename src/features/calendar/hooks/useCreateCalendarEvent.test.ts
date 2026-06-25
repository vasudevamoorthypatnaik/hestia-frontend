import { renderHook, act } from '@testing-library/react-native'
import { useCreateCalendarEvent } from './useCreateCalendarEvent'
import type { CreateCalendarEventInput } from '@/__generated__/graphql'

const mockExecute = jest.fn()
jest.mock('@/__generated__/graphql', () => ({
  useCreateCalendarEventMutation: () => [{ fetching: false }, mockExecute],
}))

const input: CreateCalendarEventInput = {
  title: 'Dentist',
  date: '2026-06-25',
  startTime: '15:00',
  endTime: '15:45',
  allDay: false,
  ownerMemberIds: ['m1'],
  responsibleMemberId: 'a1',
  needsDriver: false,
  location: null,
}

describe('useCreateCalendarEvent', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns true on a successful create', async () => {
    mockExecute.mockResolvedValue({ data: { createCalendarEvent: { event: { id: 'e1' } } } })
    const { result } = renderHook(() => useCreateCalendarEvent())
    let ok = false
    await act(async () => {
      ok = await result.current.create(input)
    })
    expect(ok).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('surfaces the server error message on failure', async () => {
    mockExecute.mockResolvedValue({ error: { graphQLErrors: [{ message: 'Title is required.' }] } })
    const { result } = renderHook(() => useCreateCalendarEvent())
    let ok = true
    await act(async () => {
      ok = await result.current.create(input)
    })
    expect(ok).toBe(false)
    expect(result.current.error).toBe('Title is required.')
  })
})
