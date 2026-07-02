import { addMonthsIso, startOfMonthIso } from './types'

describe('addMonthsIso (MONTH navigation helper)', () => {
  it('advances by one month within the same year', () => {
    expect(addMonthsIso('2026-06-15', 1)).toBe('2026-07-15')
  })

  it('goes back by one month within the same year', () => {
    expect(addMonthsIso('2026-06-15', -1)).toBe('2026-05-15')
  })

  it('rolls forward across the year boundary', () => {
    expect(addMonthsIso('2026-12-10', 1)).toBe('2027-01-10')
  })

  it('rolls backward across the year boundary', () => {
    expect(addMonthsIso('2026-01-10', -1)).toBe('2025-12-10')
  })

  it('clamps the day to the target month length (Jan 31 + 1mo -> Feb 28)', () => {
    expect(addMonthsIso('2026-01-31', 1)).toBe('2026-02-28')
  })

  it('returns the same date when shifting by zero months', () => {
    expect(addMonthsIso('2026-06-15', 0)).toBe('2026-06-15')
  })
})

describe('startOfMonthIso', () => {
  it('returns the first day of the month for a mid-month date', () => {
    expect(startOfMonthIso('2026-06-15')).toBe('2026-06-01')
  })

  it('returns the same date when already the first of the month', () => {
    expect(startOfMonthIso('2026-06-01')).toBe('2026-06-01')
  })

  it('handles the last day of the month', () => {
    expect(startOfMonthIso('2026-12-31')).toBe('2026-12-01')
  })
})
