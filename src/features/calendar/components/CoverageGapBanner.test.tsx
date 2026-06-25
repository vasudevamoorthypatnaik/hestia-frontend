import { render, screen } from '@testing-library/react-native'
import { CoverageGapBanner } from './CoverageGapBanner'
import type { CoverageGapVM } from '@/features/calendar/types'

const gap: CoverageGapVM = {
  eventId: 'e8',
  label: "Fri 3:30 — Maya's pickup has no responsible adult.",
  shortLabel: 'Fri 3:30 — Maya pickup unassigned',
} as CoverageGapVM

describe('CoverageGapBanner', () => {
  it('shows the first gap short label', () => {
    render(<CoverageGapBanner gaps={[gap]} />)
    expect(screen.getByText('Fri 3:30 — Maya pickup unassigned')).toBeTruthy()
  })

  it('renders nothing when there are no gaps', () => {
    const { toJSON } = render(<CoverageGapBanner gaps={[]} />)
    expect(toJSON()).toBeNull()
  })
})
