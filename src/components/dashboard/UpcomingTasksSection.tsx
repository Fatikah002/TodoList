import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import type { Todo } from '@/lib/types'

type UpcomingTasksSectionProps = {
  todos: Todo[]
}

export function UpcomingTasksSection({ todos }: UpcomingTasksSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md flex min-h-[200px] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
          Upcoming Tasks
        </h2>

        <Link
          to="/todos"
          search={() => ({ view: 'all' as const, upcoming: true, status: 'all' as const, priority: 'all' as const, category: 'All', sort: 'none' as const })}
          className="flex items-center gap-1 text-xs font-medium text-green-600 transition-colors hover:text-green-600"
        >
          View All
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {todos.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-500">
            No upcoming task
          </p>
        ) : (
          todos.map((todo) => {
            const d = new Date(todo.deadline)

            return (
              <div
                key={todo.id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="text-sm font-bold">
                    {format(d, 'd MMM')}
                  </span>

                  <p className="flex-1 truncate text-sm font-medium text-gray-900">
                    {todo.title}
                  </p>
                </div>

                <p className="shrink-0 whitespace-nowrap text-xs text-gray-500">
                  {todo.dueTime || 'No due time'}
                </p>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
