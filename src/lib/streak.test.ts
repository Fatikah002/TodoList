import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  calculateStreak,
  getUniqueCompletedDates,
  getWeeklyActivity,
  subtractDays,
} from './streak'
import { formatLocalDate } from './date'
import type { Todo } from './types'

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: crypto.randomUUID(),
    title: 'Test',
    detail: '',
    category: 'Work',
    priority: 'None',
    deadline: '2026-08-10',
    dueTime: '',
    completed: false,
    repeat: 'none',
    archived: false,
    ...overrides,
  }
}

describe('formatLocalDate', () => {
  it('formats as YYYY-MM-DD', () => {
    expect(formatLocalDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('zero-pads month and day', () => {
    expect(formatLocalDate(new Date(2026, 2, 9))).toBe('2026-03-09')
  })
})

describe('subtractDays', () => {
  it('subtracts days correctly', () => {
    expect(subtractDays('2026-08-10', 1)).toBe('2026-08-09')
  })

  it('handles month boundary', () => {
    expect(subtractDays('2026-03-01', 1)).toBe('2026-02-28')
  })
})

describe('getUniqueCompletedDates', () => {
  it('returns empty array when no todos completed', () => {
    const todos = [makeTodo({ completed: false })]
    expect(getUniqueCompletedDates(todos)).toEqual([])
  })

  it('returns empty array when completedAt is missing', () => {
    const todos = [makeTodo({ completed: true })]
    expect(getUniqueCompletedDates(todos)).toEqual([])
  })

  it('deduplicates same-day completions', () => {
    const todos = [
      makeTodo({
        completed: true,
        completedAt: '2026-08-10T09:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-10T14:00:00',
      }),
    ]
    expect(getUniqueCompletedDates(todos)).toEqual(['2026-08-10'])
  })

  it('returns multiple dates sorted descending', () => {
    const todos = [
      makeTodo({
        completed: true,
        completedAt: '2026-08-08T10:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-10T10:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-09T10:00:00',
      }),
    ]
    expect(getUniqueCompletedDates(todos)).toEqual([
      '2026-08-10',
      '2026-08-09',
      '2026-08-08',
    ])
  })
})

describe('calculateStreak', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 when no todos are completed', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [makeTodo({ completed: false })]
    expect(calculateStreak(todos)).toBe(0)
  })

  it('returns 0 when completedAt is missing', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [makeTodo({ completed: true })]
    expect(calculateStreak(todos)).toBe(0)
  })

  it('returns 1 when one todo completed today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        completed: true,
        completedAt: '2026-08-10T09:00:00',
      }),
    ]
    expect(calculateStreak(todos)).toBe(1)
  })

  it('returns 1 when multiple todos completed same day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        completed: true,
        completedAt: '2026-08-10T09:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-10T14:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-10T18:00:00',
      }),
    ]
    expect(calculateStreak(todos)).toBe(1)
  })

  it('returns streak for multiple consecutive days', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        completed: true,
        completedAt: '2026-08-10T09:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-09T09:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-08T09:00:00',
      }),
    ]
    expect(calculateStreak(todos)).toBe(3)
  })

  it('breaks streak when there is a gap', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        completed: true,
        completedAt: '2026-08-10T09:00:00',
      }),
      // gap: no completion on 2026-08-09
      makeTodo({
        completed: true,
        completedAt: '2026-08-08T09:00:00',
      }),
    ]
    expect(calculateStreak(todos)).toBe(1)
  })

  it('returns 1 when only yesterday is completed (today not yet)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        completed: true,
        completedAt: '2026-08-09T09:00:00',
      }),
    ]
    expect(calculateStreak(todos)).toBe(1)
  })

  it('counts consecutive days from yesterday when today is empty', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        completed: true,
        completedAt: '2026-08-09T09:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-08T09:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-07T09:00:00',
      }),
    ]
    expect(calculateStreak(todos)).toBe(3)
  })

  it('returns 0 when only old days completed with gap from today/yesterday', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        completed: true,
        completedAt: '2026-08-05T09:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-04T09:00:00',
      }),
    ]
    expect(calculateStreak(todos)).toBe(0)
  })

  it('does not count uncompleted todos', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        completed: false,
        completedAt: '2026-08-10T09:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-09T09:00:00',
      }),
    ]
    expect(calculateStreak(todos)).toBe(1)
  })

  it('handles 7-day streak', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = Array.from({ length: 7 }, (_, i) => {
      const day = String(10 - i).padStart(2, '0')
      return makeTodo({
        completed: true,
        completedAt: `2026-08-${day}T09:00:00`,
      })
    })
    expect(calculateStreak(todos)).toBe(7)
  })
})

describe('getWeeklyActivity', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 7 days with no completions when no todos completed', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [makeTodo({ completed: false })]
    const result = getWeeklyActivity(todos)
    expect(result).toHaveLength(7)
    expect(result.every((d) => d.completed)).toBe(false)
  })

  it('marks today as completed when todo finished today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        completed: true,
        completedAt: '2026-08-10T09:00:00',
      }),
    ]
    const result = getWeeklyActivity(todos)
    const today = result.find((d) => d.completed)
    expect(today).toBeDefined()
    expect(today?.shortLabel).toBe('Mon')
  })

  it('marks correct days in the week', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        completed: true,
        completedAt: '2026-08-11T09:00:00',
      }),
      makeTodo({
        completed: true,
        completedAt: '2026-08-13T09:00:00',
      }),
    ]
    const result = getWeeklyActivity(todos)
    const completedDays = result.filter((d) => d.completed)
    expect(completedDays.map((d) => d.shortLabel)).toEqual(['Tue', 'Thu'])
  })

  it('returns correct day labels in order', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const result = getWeeklyActivity([])
    expect(result.map((d) => d.shortLabel)).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ])
  })
})
