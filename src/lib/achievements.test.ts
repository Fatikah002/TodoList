import { describe, expect, it } from 'vitest'
import {
  ACHIEVEMENTS,
  getAchievementProgress,
  getAchievementsXp,
} from './achievements'
import type { Todo } from './types'

describe('achievements domain logic', () => {
  const dummyTodos: Todo[] = [
    {
      id: '1',
      title: 'Task 1',
      detail: '',
      category: 'Work',
      priority: 'High',
      deadline: '2026-08-11',
      dueTime: '10:00',
      completed: true,
      completedAt: '2026-08-11T08:30:00.000Z',
      repeat: 'none',
      archived: false,
    },
    {
      id: '2',
      title: 'Task 2',
      detail: '',
      category: 'Work',
      priority: 'Medium',
      deadline: '2026-08-11',
      dueTime: '12:00',
      completed: true,
      completedAt: '2026-08-11T07:15:00',
      repeat: 'none',
      archived: false,
    },
  ]

  it('calculates Task Crusher progress correctly', () => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'task_crusher')!
    const progress = getAchievementProgress(achievement, dummyTodos)
    expect(progress).toBe(2)
  })

  it('calculates Early Bird progress correctly for tasks completed before 9am', () => {
    const achievement = ACHIEVEMENTS.find((a) => a.id === 'early_bird')!
    const progress = getAchievementProgress(achievement, dummyTodos)
    expect(progress).toBe(1)
  })

  it('calculates total achievements XP correctly', () => {
    const totalXp = getAchievementsXp(['task_crusher', 'early_bird'])
    expect(totalXp).toBe(200)
  })
})
