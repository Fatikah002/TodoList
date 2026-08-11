import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import type { Todo } from '@/lib/types'

type TodayTasksSectionProps = {
  todos: Todo[]
  onToggleTodo: (id: string) => void
}

export function TodayTasksSection({
  todos,
  onToggleTodo,
}: TodayTasksSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex h-[200px] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
          Today's Tasks
        </h2>

        <Link
          to="/todos"
          search={
            {
              view: 'today',
              status: 'all',
              priority: 'all',
              category: 'All',
              sort: 'none',
            } as const
          }
          className="flex items-center gap-1 text-xs font-medium text-green-600 transition-colors hover:text-green-600"
        >
          View All
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {todos.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-500">
            No tasks scheduled for today
          </p>
        ) : (
          todos
            .sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''))
            .slice(0, 5)
            .map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggleTodo(todo.id)}
                    className="h-4 w-4"
                  />
                  <p
                    className={`flex-1 truncate text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                  >
                    {todo.title}
                  </p>
                </div>

                <p className="shrink-0 whitespace-nowrap text-xs text-gray-500">
                  {todo.dueTime || 'No due time'}
                </p>
              </div>
            ))
        )}
      </div>
    </section>
  )
}
