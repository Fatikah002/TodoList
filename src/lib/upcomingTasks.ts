import type { Todo } from '@/lib/types'
import { parseLocalDate } from '@/lib/date'

export function getUpcomingTodos(todos: Todo[]): Todo[] {
  const activeTodos = todos.filter((todo) => !todo.archived)
  const now = new Date()

  return activeTodos
    .filter((todo) => {
      if (todo.completed) return false
      const d = parseLocalDate(todo.deadline)
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 8)
      nextWeek.setHours(0, 0, 0, 0)
      return d >= tomorrow && d < nextWeek
    })
    .sort(
      (a, b) => parseLocalDate(a.deadline).getTime() - parseLocalDate(b.deadline).getTime(),
    )
    .slice(0, 5)
}
