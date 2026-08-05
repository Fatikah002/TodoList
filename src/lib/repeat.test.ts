import { describe, it, expect } from 'vitest'
import { getNextDeadline } from './repeat'

describe('getNextDeadline', () => {
  describe('none - returns same deadline', () => {
    it('returns the same date when repeat is none', () => {
      expect(getNextDeadline('2026-01-15', 'none')).toBe('2026-01-15')
    })
  })

  describe('daily - adds 1 day', () => {
    it('adds 1 day to the deadline', () => {
      expect(getNextDeadline('2026-01-15', 'daily')).toBe('2026-01-16')
    })

    it('handles month boundary', () => {
      expect(getNextDeadline('2026-01-31', 'daily')).toBe('2026-02-01')
    })

    it('handles year boundary', () => {
      expect(getNextDeadline('2026-12-31', 'daily')).toBe('2027-01-01')
    })
  })

  describe('weekly - adds 7 days', () => {
    it('adds 7 days to the deadline', () => {
      expect(getNextDeadline('2026-01-15', 'weekly')).toBe('2026-01-22')
    })

    it('handles month boundary', () => {
      expect(getNextDeadline('2026-01-28', 'weekly')).toBe('2026-02-04')
    })
  })

  describe('monthly - adds 1 month', () => {
    it('adds 1 month to the deadline', () => {
      expect(getNextDeadline('2026-01-15', 'monthly')).toBe('2026-02-15')
    })

    it('handles year boundary', () => {
      expect(getNextDeadline('2026-12-15', 'monthly')).toBe('2027-01-15')
    })

    it('rolls back to last day when next month has fewer days (Jan 31 -> Feb 28)', () => {
      expect(getNextDeadline('2026-01-31', 'monthly')).toBe('2026-02-28')
    })

    it('rolls back to last day when next month has fewer days (Mar 31 -> Apr 30)', () => {
      expect(getNextDeadline('2026-03-31', 'monthly')).toBe('2026-04-30')
    })

    it('preserves day in leap year (Jan 31 -> Feb 29)', () => {
      expect(getNextDeadline('2024-01-31', 'monthly')).toBe('2024-02-29')
    })
  })
})
