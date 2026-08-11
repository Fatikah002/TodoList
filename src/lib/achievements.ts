import type { Todo } from './types'
import { calculateStreak } from './streak'
import { isOverdue } from './date'

export type AccentColor =
  | 'green'
  | 'orange'
  | 'purple'
  | 'gold'
  | 'blue'
  | 'indigo'
  | 'teal'
  | 'amber'

export type AchievementFilter = 'All' | 'In Progress' | 'Completed' | 'Locked'

export type Achievement = {
  id: string
  title: string
  description: string
  target: number
  unit?: string
  rewardXp: number
  accentColor: AccentColor
  iconType: 'trophy' | 'flame' | 'hourglass' | 'star' | 'sun' | 'calendar' | 'rocket' | 'crown'
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'task_crusher',
    title: 'Task Crusher',
    description: 'Complete 10 tasks',
    target: 10,
    unit: 'tasks',
    rewardXp: 100,
    accentColor: 'green',
    iconType: 'trophy',
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Maintain a 7-day streak',
    target: 7,
    unit: 'days',
    rewardXp: 150,
    accentColor: 'orange',
    iconType: 'flame',
  },
  {
    id: 'no_more_overdue',
    title: 'No More Overdue',
    description: 'Complete all overdue tasks',
    target: 1,
    unit: 'task',
    rewardXp: 100,
    accentColor: 'purple',
    iconType: 'hourglass',
  },
  {
    id: 'consistency_pro',
    title: 'Consistency Pro',
    description: 'Complete 20 tasks',
    target: 20,
    unit: 'tasks',
    rewardXp: 200,
    accentColor: 'gold',
    iconType: 'star',
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a task before 09:00',
    target: 1,
    unit: 'task',
    rewardXp: 100,
    accentColor: 'blue',
    iconType: 'sun',
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Complete 5 tasks on weekends',
    target: 5,
    unit: 'tasks',
    rewardXp: 150,
    accentColor: 'indigo',
    iconType: 'calendar',
  },
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first task',
    target: 1,
    unit: 'task',
    rewardXp: 50,
    accentColor: 'teal',
    iconType: 'rocket',
  },
  {
    id: 'task_master',
    title: 'Task Master',
    description: 'Complete 50 tasks',
    target: 50,
    unit: 'tasks',
    rewardXp: 500,
    accentColor: 'amber',
    iconType: 'crown',
  },
]

export function getAchievementProgress(
  achievement: Achievement,
  todos: Todo[],
): number {
  const completedTodos = todos.filter((t) => t.completed && !t.archived)

  switch (achievement.id) {
    case 'task_crusher':
    case 'consistency_pro':
    case 'first_step':
    case 'task_master':
      return Math.min(completedTodos.length, achievement.target)

    case 'streak_master': {
      const currentStreak = calculateStreak(todos)
      return Math.min(currentStreak, achievement.target)
    }

    case 'no_more_overdue': {
      const activeOverdue = todos.filter(
        (t) => !t.archived && isOverdue(t.completed, t.deadline, t.dueTime),
      ).length

      const completedOverdue = completedTodos.filter((t) => {
        if (!t.completedAt) return false
        const completedDate = new Date(t.completedAt)
        const deadlineDate = t.dueTime
          ? new Date(`${t.deadline}T${t.dueTime}:00`)
          : new Date(`${t.deadline}T23:59:59`)
        return completedDate > deadlineDate
      }).length

      if (completedOverdue > 0 && activeOverdue === 0) {
        return 1
      }
      return 0
    }

    case 'early_bird': {
      const earlyCompleted = completedTodos.some((t) => {
        if (!t.completedAt) return false
        const hour = new Date(t.completedAt).getHours()
        return hour < 9
      })
      return earlyCompleted ? 1 : 0
    }

    case 'weekend_warrior': {
      const weekendCompleted = completedTodos.filter((t) => {
        if (!t.completedAt) return false
        const day = new Date(t.completedAt).getDay()
        return day === 0 || day === 6
      }).length
      return Math.min(weekendCompleted, achievement.target)
    }

    default:
      return 0
  }
}

const UNLOCKED_KEY = 'unlocked_achievements'

export function getUnlockedAchievementIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveUnlockedAchievementId(id: string): string[] {
  if (typeof window === 'undefined') return []
  const current = getUnlockedAchievementIds()
  if (!current.includes(id)) {
    const updated = [...current, id]
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(updated))
    return updated
  }
  return current
}

export function getAchievementsXp(unlockedIds: string[]): number {
  return ACHIEVEMENTS.filter((a) => unlockedIds.includes(a.id)).reduce(
    (sum, a) => sum + a.rewardXp,
    0,
  )
}
