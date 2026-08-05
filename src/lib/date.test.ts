import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatLocalDate, isSameDay, isOverdue } from './date'

describe('formatLocalDate', () => {
  it('formats date as YYYY-MM-DD with zero-padding', () => {
    expect(formatLocalDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('handles December 31', () => {
    expect(formatLocalDate(new Date(2026, 11, 31))).toBe('2026-12-31')
  })

  it('handles single-digit month and day', () => {
    expect(formatLocalDate(new Date(2026, 2, 9))).toBe('2026-03-09')
  })
})

describe('isSameDay', () => {
  it('returns true for same date strings', () => {
    expect(isSameDay('2026-01-15', '2026-01-15')).toBe(true)
  })

  it('returns false for different date strings', () => {
    expect(isSameDay('2026-01-15', '2026-01-16')).toBe(false)
  })

  it('returns false when deadline is one day before selectedDate', () => {
    expect(isSameDay('2026-01-14', '2026-01-15')).toBe(false)
  })
})

describe('isOverdue', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns false when todo is completed', () => {
    expect(isOverdue(true, '2020-01-01')).toBe(false)
  })

  it('returns true for past deadline without dueTime', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T10:00:00'))

    expect(isOverdue(false, '2026-01-01')).toBe(true)
  })

  it('returns false for future deadline without dueTime', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T10:00:00'))

    expect(isOverdue(false, '2099-12-31')).toBe(false)
  })

  it('returns true for past deadline with dueTime', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T15:00:00'))

    expect(isOverdue(false, '2026-01-01', '14:00')).toBe(true)
  })

  it('returns false for completed todo even with past deadline', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T10:00:00'))

    expect(isOverdue(true, '2026-01-01', '14:00')).toBe(false)
  })
})
