import type { Todo } from './types'
import { formatLocalDate } from './date'

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

type DayActivity = {
  label: string
  shortLabel: string
  completed: boolean
}

export function getWeeklyActivity(todos: Todo[]): DayActivity[] {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  const uniqueDates = new Set(getUniqueCompletedDates(todos))

  const dayLabels: { label: string; shortLabel: string }[] = [
    { label: 'Monday', shortLabel: 'Mon' },
    { label: 'Tuesday', shortLabel: 'Tue' },
    { label: 'Wednesday', shortLabel: 'Wed' },
    { label: 'Thursday', shortLabel: 'Thu' },
    { label: 'Friday', shortLabel: 'Fri' },
    { label: 'Saturday', shortLabel: 'Sat' },
    { label: 'Sunday', shortLabel: 'Sun' },
  ]

  return dayLabels.map((day, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + mondayOffset + i)
    return {
      label: day.label,
      shortLabel: day.shortLabel,
      completed: uniqueDates.has(formatLocalDate(date)),
    }
  })
}
