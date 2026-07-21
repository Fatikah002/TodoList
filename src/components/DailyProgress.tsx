import { Card, CardContent } from '@/components/ui/card'
import type { Todo } from '@/lib/types'
import { CircularProgress } from './CircularProgress'
import { isSameDay, isOverdue } from '@/lib/date'
import { Alert, AlertDescription } from '@/components/ui/alert'

type DailyProgressProps = {
  todos: Todo[]
  selectedDate: string
}

export function DailyProgress({ todos, selectedDate }: DailyProgressProps) {
  const dailyTodos = todos.filter((todo) =>
    isSameDay(todo.deadline, selectedDate),
  )

  const total = dailyTodos.length

  const completed = dailyTodos.filter((todo) => todo.completed).length

  const pending = dailyTodos.filter((todo) => !todo.completed).length

  const overdue = dailyTodos.filter((todo) =>
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
        <h2 className="mb-4 text-lg font-semibold">Daily Progress</h2>

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
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          {total === 0 ? (
            <Alert className="border-slate-200 bg-slate-50">
              <AlertDescription className="text-slate-600">
                No tasks scheduled for this day.
              </AlertDescription>
            </Alert>
          ) : overdue > 0 ? (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                <span className="font-semibold">{overdue}</span> task
                {overdue > 1 ? 's are' : ' is'} overdue! Please catch up.
              </AlertDescription>
            </Alert>
          ) : pending > 0 ? (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="text-amber-700">
                You have <span className="font-semibold">{pending}</span>{' '}
                pending task
                {pending > 1 ? 's' : ''} to complete.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-emerald-200 bg-emerald-50">
              <AlertDescription className="text-emerald-700">
                All caught up! Great job.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
