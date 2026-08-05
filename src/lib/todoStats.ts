import type { Todo } from '@/lib/types'
import { isSameDay, isOverdue } from '@/lib/date'
import type { TodoStats } from '@/components/dashboard/StatsGrid'

export function calculateTodoStats(
  todos: Todo[],
  options?: { selectedDate?: string; showAllTasks?: boolean },
): TodoStats {
  const activeTodos = todos.filter((todo) => !todo.archived)

  const scopedTodos =
    options?.showAllTasks || !options?.selectedDate
      ? activeTodos
      : activeTodos.filter((todo) =>
          isSameDay(todo.deadline, options?.selectedDate ?? ''),
        )

  const total = scopedTodos.length
  const completed = scopedTodos.filter((todo) => todo.completed).length
  const overdue = scopedTodos.filter((todo) =>
    isOverdue(todo.completed, todo.deadline, todo.dueTime),
  ).length
  const pending = total - completed - overdue

  return { total, completed, pending, overdue }
}
