import { render, screen } from '@testing-library/react-native'
import { LoadBar } from './LoadBar'
import type { CalendarLoadVM } from '@/features/calendar/types'

const load: CalendarLoadVM = {
  total: 3,
  summaryLabel: 'Vasu is carrying a bit more this week.',
  entries: [
    { member: { id: 'a2', displayName: 'Vasu', initial: 'V', colorHex: '#5B7C99' }, count: 2, percent: 67 },
    { member: { id: 'a1', displayName: 'Pallavi', initial: 'P', colorHex: '#C4603D' }, count: 1, percent: 33 },
  ],
} as CalendarLoadVM

describe('LoadBar (Hearth Glow)', () => {
  it('renders the Hearth Glow header, each adult share, and the summary', () => {
    render(<LoadBar load={load} />)
    expect(screen.getByText('Hearth Glow')).toBeTruthy()
    expect(screen.getByText('Vasu · 2')).toBeTruthy()
    expect(screen.getByText('Pallavi · 1')).toBeTruthy()
    expect(screen.getByText('Vasu is carrying a bit more this week.')).toBeTruthy()
  })

  it('shows the "Lopsided" pill when one adult carries >60%', () => {
    render(<LoadBar load={load} />)
    expect(screen.getByText('● Lopsided')).toBeTruthy()
  })

  it('shows the "Balanced" pill when no adult exceeds 60%', () => {
    const balanced = {
      total: 2,
      summaryLabel: null,
      entries: [
        { member: { id: 'a2', displayName: 'Vasu', initial: 'V', colorHex: '#5B7C99' }, count: 1, percent: 50 },
        { member: { id: 'a1', displayName: 'Pallavi', initial: 'P', colorHex: '#C4603D' }, count: 1, percent: 50 },
      ],
    } as CalendarLoadVM
    render(<LoadBar load={balanced} />)
    expect(screen.getByText('● Balanced')).toBeTruthy()
  })

  it('renders a single member at 100% without crashing (single-member guard)', () => {
    const single = {
      total: 1,
      summaryLabel: null,
      entries: [
        { member: { id: 'a1', displayName: 'Pallavi', initial: 'P', colorHex: '#C4603D' }, count: 1, percent: 100 },
      ],
    } as CalendarLoadVM
    render(<LoadBar load={single} />)
    expect(screen.getByText('Pallavi · 1')).toBeTruthy()
    expect(screen.getByText('● Lopsided')).toBeTruthy()
  })

  it('renders nothing with no entries', () => {
    const empty = { total: 0, summaryLabel: null, entries: [] } as CalendarLoadVM
    const { toJSON } = render(<LoadBar load={empty} />)
    expect(toJSON()).toBeNull()
  })

  it('renders nothing when total is 0 even if entries exist (divide-by-zero guard)', () => {
    const zero = {
      total: 0,
      summaryLabel: null,
      entries: [
        { member: { id: 'a1', displayName: 'Pallavi', initial: 'P', colorHex: '#C4603D' }, count: 0, percent: 0 },
      ],
    } as CalendarLoadVM
    const { toJSON } = render(<LoadBar load={zero} />)
    expect(toJSON()).toBeNull()
  })
})
