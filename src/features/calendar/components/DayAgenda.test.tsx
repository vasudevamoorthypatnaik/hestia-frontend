import { render, screen, fireEvent } from '@testing-library/react-native'
import { DayAgenda } from './DayAgenda'
import type { CalendarEventVM } from '@/features/calendar/types'

const oneEvent: CalendarEventVM = {
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
} as CalendarEventVM

describe('DayAgenda', () => {
  it('renders the day’s events when present', () => {
    render(<DayAgenda events={[oneEvent]} onAddEvent={jest.fn()} />)
    expect(screen.getByText('Soccer — Maya')).toBeTruthy()
  })

  it('shows the shared empty state with an add affordance when there are no events (AC6/AC11)', () => {
    const onAddEvent = jest.fn()
    render(<DayAgenda events={[]} onAddEvent={onAddEvent} />)
    expect(screen.getByText('Nothing scheduled yet')).toBeTruthy()
    fireEvent.press(screen.getByLabelText('Add your first event'))
    expect(onAddEvent).toHaveBeenCalledTimes(1)
  })
})
