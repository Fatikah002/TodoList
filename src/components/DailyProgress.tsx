import { Card, CardContent } from '@/components/ui/card'
import type { Todo } from '@/lib/types'
import type { StatusFilter } from '@/components/TodoFilter'
import { CircularProgress } from './CircularProgress'

type DailyProgressProps = {
  todos: Todo[]
  selectedDate: string
  statusFilter: StatusFilter
  onStatusClick: (status: StatusFilter) => void
}

export function DailyProgress({
  todos,
  selectedDate,
  statusFilter,
  onStatusClick,
}: DailyProgressProps) {
  const total = todos.length

  const completed = todos.filter((todo) => todo.completed).length

  const pending = todos.filter((todo) => !todo.completed).length

  const overdue = todos.filter(
    (todo) => !todo.completed && todo.deadline < selectedDate,
  ).length

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  const stats = [
    {
      label: 'Completed',
      count: completed,
      color: 'text-green-500',
      status: 'completed' as const,
    },
    {
      label: 'Pending',
      count: pending,
      color: 'text-orange-500',
      status: 'pending' as const,
    },
    {
      label: 'Overdue',
      count: overdue,
      color: 'text-red-500',
      status: 'overdue' as const,
    },
  ]

  return (
    <Card className="w-full rounded-3xl shadow-md">
      <CardContent className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Your Progress</h2>

        <div className="flex items-center justify-between gap-4">
          {/* Progress Circle */}
          <CircularProgress percentage={percentage} />

          {/* Summary */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {completed} of {total} tasks completed
            </p>

            <div className="mt-3 flex justify-between">
              {stats.map((stat) => {
                const isActive = statusFilter === stat.status

                return (
                  <button
                    key={stat.status}
                    onClick={() =>
                      onStatusClick(isActive ? 'all' : stat.status)
                    }
                    className={`cursor-pointer rounded-lg px-1 py-1  text-center transition-all ${
                      isActive
                        ? 'bg-muted ring-1 ring-green-500'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <p className={`text-lg font-bold ${stat.color}`}>
                      {stat.count}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
