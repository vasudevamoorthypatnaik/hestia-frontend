import { render, screen } from '@testing-library/react-native'
import { EventCard } from './EventCard'
import type { CalendarEventVM } from '@/features/calendar/types'

const base: CalendarEventVM = {
  id: 'e1',
  title: 'Soccer — Maya',
  start: '2026-06-23T23:00:00Z',
  end: null,
  allDay: false,
  timeLabel: '4:00 – 5:30',
  dayOfWeek: 2,
  date: '2026-06-23',
  colorHex: '#B6843C',
  location: 'Lincoln Park',
  needsDriver: true,
  isCoverageGap: false,
  ownerMembers: [{ id: 'm', displayName: 'Maya', initial: 'M', colorHex: '#B6843C' }],
  responsibleMember: { id: 'a', displayName: 'Vasu', initial: 'V', colorHex: '#5B7C99' },
} as CalendarEventVM

describe('EventCard', () => {
  it('renders title, time label (with driver), and responsible adult', () => {
    render(<EventCard event={base} />)
    expect(screen.getByText('Soccer — Maya')).toBeTruthy()
    expect(screen.getByText('4:00 – 5:30 🚗')).toBeTruthy()
    expect(screen.getByText('Vasu')).toBeTruthy()
  })

  it('renders a coverage gap as Unassigned', () => {
    const gap = { ...base, isCoverageGap: true, responsibleMember: null, title: 'Pickup — Maya' } as CalendarEventVM
    render(<EventCard event={gap} />)
    expect(screen.getByText('Unassigned')).toBeTruthy()
  })
})
