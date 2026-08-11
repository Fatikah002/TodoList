import type { Todo } from './types'
import { getUnlockedAchievementIds, getAchievementsXp } from './achievements'

const XP_PER_TASK: Record<string, number> = {
  High: 30,
  Medium: 20,
  Low: 10,
  None: 5,
}

const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800,
  9100, 10500,
]



export function calculateTotalXp(todos: Todo[], unlockedAchievementIds?: string[]): number {
  let total = 0
  for (const todo of todos) {
    if (todo.completed && todo.completedAt) {
      total += XP_PER_TASK[todo.priority] ?? XP_PER_TASK.None
    }
  }

  const unlockedIds = unlockedAchievementIds ?? getUnlockedAchievementIds()
  total += getAchievementsXp(unlockedIds)

  return total
}

export function getLevel(totalXp: number): number {
  let level = 1
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
    } else {
      break
    }
  }
  return level
}

export function getXpForLevel(level: number): number {
  if (level <= 1) return 0
  if (level > LEVEL_THRESHOLDS.length) {
    const last = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
    return last + (level - LEVEL_THRESHOLDS.length) * 1500
  }
  return LEVEL_THRESHOLDS[level - 1]
}

export function getXpForNextLevel(level: number): number {
  return getXpForLevel(level + 1)
}

export type ProgressInfo = {
  totalXp: number
  level: number
  xpInCurrentLevel: number
  xpForCurrentLevel: number
  xpForNextLevel: number
  xpToNextLevel: number
  percentage: number
}

export function getProgressInfo(todos: Todo[], unlockedAchievementIds?: string[]): ProgressInfo {
  const totalXp = calculateTotalXp(todos, unlockedAchievementIds)
  const level = getLevel(totalXp)
  const xpForCurrentLevel = getXpForLevel(level)
  const xpForNextLevel = getXpForNextLevel(level)
  const xpInCurrentLevel = totalXp - xpForCurrentLevel
  const range = xpForNextLevel - xpForCurrentLevel
  const percentage = range === 0 ? 100 : Math.min(Math.round((xpInCurrentLevel / range) * 100), 100)
  const xpToNextLevel = xpForNextLevel - totalXp

  return {
    totalXp,
    level,
    xpInCurrentLevel,
    xpForCurrentLevel,
    xpForNextLevel,
    xpToNextLevel,
    percentage,
  }
}
