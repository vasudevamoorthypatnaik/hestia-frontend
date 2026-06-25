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

describe('LoadBar', () => {
  it('renders each adult share and the summary', () => {
    render(<LoadBar load={load} />)
    expect(screen.getByText('Vasu · 2')).toBeTruthy()
    expect(screen.getByText('Pallavi · 1')).toBeTruthy()
    expect(screen.getByText('67 / 33')).toBeTruthy()
    expect(screen.getByText('Vasu is carrying a bit more this week.')).toBeTruthy()
  })

  it('renders nothing with no entries', () => {
    const empty = { total: 0, summaryLabel: null, entries: [] } as CalendarLoadVM
    const { toJSON } = render(<LoadBar load={empty} />)
    expect(toJSON()).toBeNull()
  })
})
