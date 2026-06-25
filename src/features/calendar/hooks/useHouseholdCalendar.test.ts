import { renderHook, act } from '@testing-library/react-native'

const mockTokenRef: { current: string | null } = { current: 'token-123' }
const mockUseHouseholdCalendarQuery = jest.fn()

jest.mock('@/__generated__/graphql', () => ({
  useHouseholdCalendarQuery: (opts: unknown) => mockUseHouseholdCalendarQuery(opts),
}))

jest.mock('@/shared/auth/token', () => ({
  subscribeToTokenChanges: () => () => {},
  getTokenChangeVersion: () => 0,
  getAccessTokenSync: () => mockTokenRef.current,
}))

import { useHouseholdCalendar } from './useHouseholdCalendar'

describe('useHouseholdCalendar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseHouseholdCalendarQuery.mockReturnValue([{ data: undefined, fetching: false, error: undefined }])
  })

  it('pauses the query while there is no auth token (TAC-6)', () => {
    mockTokenRef.current = null
    renderHook(() => useHouseholdCalendar('WEEK'))
    expect(mockUseHouseholdCalendarQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ pause: true })
    )
  })

  it('runs the query and passes the range + an anchor when a token exists', () => {
    mockTokenRef.current = 'token-123'
    renderHook(() => useHouseholdCalendar('WEEK'))
    const opts = mockUseHouseholdCalendarQuery.mock.calls.at(-1)![0]
    expect(opts.pause).toBe(false)
    expect(opts.variables.period.range).toBe('WEEK')
    expect(opts.variables.period.anchor).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('shifts the anchor by a week when navigating', () => {
    mockTokenRef.current = 'token-123'
    const { result } = renderHook(() => useHouseholdCalendar('WEEK'))
    const first = mockUseHouseholdCalendarQuery.mock.calls.at(-1)![0].variables.period.anchor

    act(() => result.current.shiftPeriod(1))
    const after = mockUseHouseholdCalendarQuery.mock.calls.at(-1)![0].variables.period.anchor
    expect(after).not.toEqual(first)
  })
})
