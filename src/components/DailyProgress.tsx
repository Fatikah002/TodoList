import { Card, CardContent } from '@/components/ui/card'
import type { Todo } from '@/lib/types'
import { CircularProgress } from './CircularProgress'
import { isSameDay, isOverdue } from '@/lib/date'

type DailyProgressProps = {
  todos: Todo[]
  selectedDate: string
}

export function DailyProgress({ todos, selectedDate }: DailyProgressProps) {
  const scopedTodos = todos.filter((todo) =>
    isSameDay(todo.deadline, selectedDate),
  )

  const total = scopedTodos.length

  const completed = scopedTodos.filter((todo) => todo.completed).length

  const pending = scopedTodos.filter((todo) => !todo.completed).length

  const overdue = scopedTodos.filter((todo) =>
    isOverdue(todo.completed, todo.deadline),
  ).length

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  const stats = [
    {
      label: 'Completed',
      count: completed,
      color: 'text-green-500',
    },
    {
      label: 'Pending',
      count: pending,
      color: 'text-orange-500',
    },
    {
      label: 'Overdue',
      count: overdue,
      color: 'text-red-500',
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
              {stats.map((stat) => (
                <div key={stat.label} className="px-1 py-1 text-center">
                  <p className={`text-lg font-bold ${stat.color}`}>
                    {stat.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
