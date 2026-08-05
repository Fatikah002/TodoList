import type { Todo } from '@/lib/types'

export function getUpcomingTodos(todos: Todo[]): Todo[] {
  const activeTodos = todos.filter((todo) => !todo.archived)
  const now = new Date()

  return activeTodos
    .filter((todo) => {
      if (todo.completed) return false
      const d = new Date(todo.deadline)
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 8)
      nextWeek.setHours(0, 0, 0, 0)
      return d >= tomorrow && d < nextWeek
    })
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )
    .slice(0, 5)
}
