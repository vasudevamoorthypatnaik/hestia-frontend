import { render, screen } from '@testing-library/react-native'
import { MonthGrid } from './MonthGrid.web'
import { addDaysIso, addMonthsIso, startOfMonthIso, todayIso } from '@/features/calendar/types'
import type { CalendarEventVM } from '@/features/calendar/types'

function event(overrides: Partial<CalendarEventVM>): CalendarEventVM {
  return {
    id: 'e1',
    title: 'Soccer — Maya',
    start: '2026-06-23T23:00:00Z',
    end: null,
    allDay: false,
    timeLabel: '4:00 – 5:30',
    dayOfWeek: 2,
    date: '2026-06-23',
    colorHex: '#B6843C',
    location: null,
    needsDriver: false,
    isCoverageGap: false,
    ownerMembers: [{ id: 'm', displayName: 'Maya', initial: 'M', colorHex: '#B6843C' }],
    responsibleMember: { id: 'a', displayName: 'Vasu', initial: 'V', colorHex: '#5B7C99' },
    ...overrides,
  } as CalendarEventVM
}

describe('MonthGrid', () => {
  it('renders the Mon–Sun weekday header', () => {
    render(<MonthGrid events={[]} periodStart="2026-06-01" periodEnd="2026-06-30" />)
    for (const label of ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']) {
      expect(screen.getByText(label)).toBeTruthy()
    }
  })

  it('places an event on its concrete calendar date cell (keyed by events[].date)', () => {
    render(
      <MonthGrid
        events={[event({ date: '2026-06-23', title: 'Soccer — Maya' })]}
        periodStart="2026-06-01"
        periodEnd="2026-06-30"
      />
    )
    // The event tile renders, and its cell announces one event for that exact date.
    expect(screen.getByText('Soccer — Maya')).toBeTruthy()
    expect(screen.getByLabelText('2026-06-23, 1 event')).toBeTruthy()
    // A different day in the same month stays empty (no spurious placement).
    expect(screen.getByLabelText('2026-06-24')).toBeTruthy()
  })

  it('stacks multiple events on the same date and pluralizes the cell label', () => {
    render(
      <MonthGrid
        events={[
          event({ id: 'e1', date: '2026-06-23', title: 'Soccer — Maya' }),
          event({ id: 'e2', date: '2026-06-23', title: 'Dentist — Vasu' }),
        ]}
        periodStart="2026-06-01"
        periodEnd="2026-06-30"
      />
    )
    expect(screen.getByText('Soccer — Maya')).toBeTruthy()
    expect(screen.getByText('Dentist — Vasu')).toBeTruthy()
    expect(screen.getByLabelText('2026-06-23, 2 events')).toBeTruthy()
  })

  it('renders leading/trailing out-of-month days to complete the weeks', () => {
    // June 30 2026 is a Tuesday, so the final week trails into July 1–5.
    render(<MonthGrid events={[]} periodStart="2026-06-01" periodEnd="2026-06-30" />)
    expect(screen.getByLabelText('2026-07-01')).toBeTruthy()
  })

  it('renders the grid without crashing when there are no events', () => {
    render(<MonthGrid events={[]} periodStart="2026-06-01" periodEnd="2026-06-30" />)
    expect(screen.getByText('MON')).toBeTruthy()
    expect(screen.queryByText('Soccer — Maya')).toBeNull()
  })

  it('includes the current day in the grid when the displayed month is today (today-highlight path)', () => {
    const today = todayIso()
    const periodStart = startOfMonthIso(today)
    const periodEnd = addDaysIso(startOfMonthIso(addMonthsIso(today, 1)), -1)
    render(<MonthGrid events={[]} periodStart={periodStart} periodEnd={periodEnd} />)
    // Today's cell is present (exercises the isToday branch deterministically).
    expect(screen.getByLabelText(today)).toBeTruthy()
  })
})
