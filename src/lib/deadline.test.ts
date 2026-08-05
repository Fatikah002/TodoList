import { describe, it, expect, vi, afterEach } from 'vitest'
import { getDeadlineStatus } from './deadline'

describe('getDeadlineStatus', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "late" for past deadline without dueTime', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T10:00:00'))

    expect(getDeadlineStatus('2026-01-01')).toBe('late')
  })

  it('returns "today" for today deadline without dueTime', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T10:00:00'))

    expect(getDeadlineStatus('2026-01-15')).toBe('today')
  })

  it('returns "tomorrow" for tomorrow deadline without dueTime', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T10:00:00'))

    expect(getDeadlineStatus('2026-01-16')).toBe('tomorrow')
  })

  it('returns null for future deadline (>1 day away)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T10:00:00'))

    expect(getDeadlineStatus('2099-12-31')).toBeNull()
  })

  it('returns null for invalid date string', () => {
    expect(getDeadlineStatus('invalid-date')).toBeNull()
  })

  it('returns "late" when today is past dueTime', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T15:00:00'))

    expect(getDeadlineStatus('2026-01-15', '14:00')).toBe('late')
  })

  it('returns "today" when today is before dueTime', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T10:00:00'))

    expect(getDeadlineStatus('2026-01-15', '14:00')).toBe('today')
  })
})
