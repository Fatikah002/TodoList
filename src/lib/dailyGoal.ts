import type { Todo } from './types'

function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

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
  if (count >= 5) return 5
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
