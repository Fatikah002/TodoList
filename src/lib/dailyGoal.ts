import type { Todo } from './types'
import { formatLocalDate } from './date'

const MAX_DAILY_GOAL = 5

function getTodayTodos(todos: Todo[]): Todo[] {
  const today = formatLocalDate(new Date())
  return todos.filter(
    (todo) => !todo.archived && todo.deadline === today,
  )
}

export function getDailyGoalTarget(todos: Todo[]): number {
  const todayTodos = getTodayTodos(todos)
  const count = todayTodos.length
  if (count === 0) return 0
  if (count >= MAX_DAILY_GOAL) return MAX_DAILY_GOAL
  return count
}

export function getDailyGoalProgress(todos: Todo[]): number {
  const today = formatLocalDate(new Date())
  const todayTodos = getTodayTodos(todos)
  return todayTodos.filter(
    (todo) =>
      todo.completed &&
      todo.completedAt &&
      formatLocalDate(new Date(todo.completedAt)) === today,
  ).length
}

export type DailyGoalInfo = {
  target: number
  progress: number
  percentage: number
  isComplete: boolean
  isEmpty: boolean
}

export function getDailyGoalInfo(todos: Todo[]): DailyGoalInfo {
  const target = getDailyGoalTarget(todos)
  const rawProgress = getDailyGoalProgress(todos)
  const progress = Math.min(rawProgress, target)
  const percentage = target === 0 ? 0 : Math.round((progress / target) * 100)

  return {
    target,
    progress,
    percentage: Math.min(percentage, 100),
    isComplete: target > 0 && progress >= target,
    isEmpty: target === 0,
  }
}
