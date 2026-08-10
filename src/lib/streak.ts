import type { Todo } from './types'

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function subtractDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + 'T00:00:00')
  date.setDate(date.getDate() - days)
  return formatLocalDate(date)
}

export function getUniqueCompletedDates(todos: Todo[]): string[] {
  const dates = new Set<string>()
  for (const todo of todos) {
    if (todo.completed && todo.completedAt) {
      const d = formatLocalDate(new Date(todo.completedAt))
      dates.add(d)
    }
  }
  return Array.from(dates).sort().reverse()
}

export function calculateStreak(todos: Todo[]): number {
  const uniqueDates = getUniqueCompletedDates(todos)
  if (uniqueDates.length === 0) return 0

  const today = formatLocalDate(new Date())

  if (uniqueDates[0] > today) return 0

  let streak = 0
  let expected = today

  if (uniqueDates[0] !== today) {
    if (uniqueDates[0] === subtractDays(today, 1)) {
      expected = subtractDays(today, 1)
    } else {
      return 0
    }
  }

  for (const dateStr of uniqueDates) {
    if (dateStr === expected) {
      streak++
      expected = subtractDays(expected, 1)
    } else if (dateStr < expected) {
      break
    }
  }

  return streak
}
