import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  getDailyGoalTarget,
  getDailyGoalProgress,
  getDailyGoalInfo,
} from './dailyGoal'
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

const TODAY = '2026-08-10'

describe('getDailyGoalTarget', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 when no tasks today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [makeTodo({ deadline: '2026-08-11' })]
    expect(getDailyGoalTarget(todos)).toBe(0)
  })

  it('returns count when 1-4 tasks today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = Array.from({ length: 3 }, () =>
      makeTodo({ deadline: TODAY }),
    )
    expect(getDailyGoalTarget(todos)).toBe(3)
  })

  it('returns 5 when 5+ tasks today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = Array.from({ length: 8 }, () =>
      makeTodo({ deadline: TODAY }),
    )
    expect(getDailyGoalTarget(todos)).toBe(5)
  })

  it('returns exactly 5 for exactly 5 tasks', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = Array.from({ length: 5 }, () =>
      makeTodo({ deadline: TODAY }),
    )
    expect(getDailyGoalTarget(todos)).toBe(5)
  })

  it('ignores archived todos', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({ deadline: TODAY }),
      makeTodo({ deadline: TODAY, archived: true }),
    ]
    expect(getDailyGoalTarget(todos)).toBe(1)
  })
})

describe('getDailyGoalProgress', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 when no tasks completed today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({ deadline: TODAY, completed: false }),
      makeTodo({ deadline: TODAY, completed: false }),
    ]
    expect(getDailyGoalProgress(todos)).toBe(0)
  })

  it('counts completed tasks with today completedAt', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        deadline: TODAY,
        completed: true,
        completedAt: `${TODAY}T09:00:00`,
      }),
      makeTodo({
        deadline: TODAY,
        completed: true,
        completedAt: `${TODAY}T14:00:00`,
      }),
    ]
    expect(getDailyGoalProgress(todos)).toBe(2)
  })

  it('does not count completed with wrong completedAt date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        deadline: TODAY,
        completed: true,
        completedAt: '2026-08-09T09:00:00',
      }),
    ]
    expect(getDailyGoalProgress(todos)).toBe(0)
  })

  it('does not count uncompleted tasks', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({ deadline: TODAY, completed: false }),
      makeTodo({
        deadline: TODAY,
        completed: true,
        completedAt: `${TODAY}T09:00:00`,
      }),
    ]
    expect(getDailyGoalProgress(todos)).toBe(1)
  })

  it('resets on new day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        deadline: TODAY,
        completed: true,
        completedAt: `${TODAY}T09:00:00`,
      }),
    ]
    expect(getDailyGoalProgress(todos)).toBe(1)

    vi.setSystemTime(new Date(2026, 7, 11, 12, 0, 0))

    expect(getDailyGoalProgress(todos)).toBe(0)
  })
})

describe('getDailyGoalInfo', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns empty state when no tasks today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [makeTodo({ deadline: '2026-08-11' })]
    const info = getDailyGoalInfo(todos)
    expect(info.isEmpty).toBe(true)
    expect(info.target).toBe(0)
    expect(info.percentage).toBe(0)
  })

  it('calculates correct percentage', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        deadline: TODAY,
        completed: true,
        completedAt: `${TODAY}T09:00:00`,
      }),
      makeTodo({ deadline: TODAY, completed: false }),
      makeTodo({ deadline: TODAY, completed: false }),
    ]
    const info = getDailyGoalInfo(todos)
    expect(info.target).toBe(3)
    expect(info.progress).toBe(1)
    expect(info.percentage).toBe(33)
    expect(info.isComplete).toBe(false)
  })

  it('marks complete when all tasks done', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        deadline: TODAY,
        completed: true,
        completedAt: `${TODAY}T09:00:00`,
      }),
      makeTodo({
        deadline: TODAY,
        completed: true,
        completedAt: `${TODAY}T14:00:00`,
      }),
    ]
    const info = getDailyGoalInfo(todos)
    expect(info.isComplete).toBe(true)
    expect(info.percentage).toBe(100)
  })

  it('caps percentage at 100', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        deadline: TODAY,
        completed: true,
        completedAt: `${TODAY}T09:00:00`,
      }),
    ]
    const info = getDailyGoalInfo(todos)
    expect(info.percentage).toBeLessThanOrEqual(100)
  })

  it('does not count completedAt from different day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 10, 12, 0, 0))

    const todos = [
      makeTodo({
        deadline: TODAY,
        completed: true,
        completedAt: '2026-08-09T09:00:00',
      }),
      makeTodo({ deadline: TODAY, completed: false }),
    ]
    const info = getDailyGoalInfo(todos)
    expect(info.progress).toBe(0)
    expect(info.percentage).toBe(0)
  })
})
