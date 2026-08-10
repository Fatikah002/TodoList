import { describe, it, expect } from 'vitest'
import {
  calculateTotalXp,
  getLevel,
  getXpForLevel,
  getXpForNextLevel,
  getProgressInfo,
} from './xp'
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

describe('calculateTotalXp', () => {
  it('returns 0 when no completed todos', () => {
    const todos = [makeTodo({ completed: false })]
    expect(calculateTotalXp(todos)).toBe(0)
  })

  it('returns 0 when completed but no completedAt', () => {
    const todos = [makeTodo({ completed: true })]
    expect(calculateTotalXp(todos)).toBe(0)
  })

  it('awards 5 XP for None priority', () => {
    const todos = [
      makeTodo({ completed: true, completedAt: '2026-08-10T09:00:00', priority: 'None' }),
    ]
    expect(calculateTotalXp(todos)).toBe(5)
  })

  it('awards 10 XP for Low priority', () => {
    const todos = [
      makeTodo({ completed: true, completedAt: '2026-08-10T09:00:00', priority: 'Low' }),
    ]
    expect(calculateTotalXp(todos)).toBe(10)
  })

  it('awards 20 XP for Medium priority', () => {
    const todos = [
      makeTodo({ completed: true, completedAt: '2026-08-10T09:00:00', priority: 'Medium' }),
    ]
    expect(calculateTotalXp(todos)).toBe(20)
  })

  it('awards 30 XP for High priority', () => {
    const todos = [
      makeTodo({ completed: true, completedAt: '2026-08-10T09:00:00', priority: 'High' }),
    ]
    expect(calculateTotalXp(todos)).toBe(30)
  })

  it('sums XP from multiple completed todos', () => {
    const todos = [
      makeTodo({ completed: true, completedAt: '2026-08-10T09:00:00', priority: 'High' }),
      makeTodo({ completed: true, completedAt: '2026-08-10T10:00:00', priority: 'Medium' }),
      makeTodo({ completed: true, completedAt: '2026-08-10T11:00:00', priority: 'Low' }),
    ]
    expect(calculateTotalXp(todos)).toBe(60)
  })

  it('ignores uncompleted todos', () => {
    const todos = [
      makeTodo({ completed: false, priority: 'High' }),
      makeTodo({ completed: true, completedAt: '2026-08-10T09:00:00', priority: 'Low' }),
    ]
    expect(calculateTotalXp(todos)).toBe(10)
  })
})

describe('getLevel', () => {
  it('returns level 1 for 0 XP', () => {
    expect(getLevel(0)).toBe(1)
  })

  it('returns level 1 for 99 XP', () => {
    expect(getLevel(99)).toBe(1)
  })

  it('returns level 2 for 100 XP', () => {
    expect(getLevel(100)).toBe(2)
  })

  it('returns level 3 for 300 XP', () => {
    expect(getLevel(300)).toBe(3)
  })

  it('returns level 5 for 1000 XP', () => {
    expect(getLevel(1000)).toBe(5)
  })

  it('returns correct level for mid-range XP', () => {
    expect(getLevel(450)).toBe(3)
  })
})

describe('getXpForLevel', () => {
  it('returns 0 for level 1', () => {
    expect(getXpForLevel(1)).toBe(0)
  })

  it('returns 100 for level 2', () => {
    expect(getXpForLevel(2)).toBe(100)
  })

  it('returns 300 for level 3', () => {
    expect(getXpForLevel(3)).toBe(300)
  })
})

describe('getXpForNextLevel', () => {
  it('returns 100 for level 1', () => {
    expect(getXpForNextLevel(1)).toBe(100)
  })

  it('returns 300 for level 2', () => {
    expect(getXpForNextLevel(2)).toBe(300)
  })
})

describe('getProgressInfo', () => {
  it('returns correct info for level 1 with 0 XP', () => {
    const todos = [makeTodo({ completed: false })]
    const info = getProgressInfo(todos)
    expect(info.totalXp).toBe(0)
    expect(info.level).toBe(1)
    expect(info.xpInCurrentLevel).toBe(0)
    expect(info.xpForCurrentLevel).toBe(0)
    expect(info.xpForNextLevel).toBe(100)
    expect(info.xpToNextLevel).toBe(100)
    expect(info.percentage).toBe(0)
  })

  it('calculates correct percentage mid-level', () => {
    const todos = [
      makeTodo({ completed: true, completedAt: '2026-08-10T09:00:00', priority: 'High' }),
      makeTodo({ completed: true, completedAt: '2026-08-10T10:00:00', priority: 'High' }),
    ]
    const info = getProgressInfo(todos)
    expect(info.totalXp).toBe(60)
    expect(info.level).toBe(1)
    expect(info.percentage).toBe(60)
    expect(info.xpToNextLevel).toBe(40)
  })

  it('caps percentage at 100', () => {
    const todos = Array.from({ length: 20 }, () =>
      makeTodo({ completed: true, completedAt: '2026-08-10T09:00:00', priority: 'High' }),
    )
    const info = getProgressInfo(todos)
    expect(info.percentage).toBeLessThanOrEqual(100)
  })
})
