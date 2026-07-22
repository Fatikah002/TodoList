import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CircularProgress } from './CircularProgress'
import type { Todo } from '@/lib/types'
import { isSameDay, isOverdue } from '@/lib/date'

type DailyProgressProps = {
  todos: Todo[]
  selectedDate: string
  showAllTasks: boolean
}

export function DailyProgress({
  todos,
  selectedDate,
  showAllTasks,
}: DailyProgressProps) {
  const activeTodos = todos.filter((todo) => !todo.archived)

  const scopedTodos = showAllTasks
    ? activeTodos
    : activeTodos.filter((todo) => isSameDay(todo.deadline, selectedDate))

  const total = scopedTodos.length

  const completed = scopedTodos.filter((todo) => todo.completed).length

  const overdue = scopedTodos.filter((todo) =>
    isOverdue(todo.completed, todo.deadline, todo.dueTime),
  ).length

  const pending = scopedTodos.filter(
    (todo) => !todo.completed && !isOverdue(todo.completed, todo.deadline, todo.dueTime),
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
      color: 'text-amber-500',
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
        <h2 className="mb-4 text-lg font-semibold">
          {showAllTasks ? 'Task Overview' : 'Today'}
        </h2>

        <div className="flex items-center justify-between gap-4">
          <CircularProgress percentage={percentage} />

          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {completed} of {total} tasks completed
            </p>

            {showAllTasks && (
              <p className="mt-1 text-xs text-muted-foreground">
                Total Tasks: <span className="font-semibold">{total}</span>
              </p>
            )}

            <div className="mt-4 flex justify-between">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={`text-lg font-bold ${stat.color}`}>
                    {stat.count}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {total === 0 && (
            <Alert className="border-slate-200 bg-slate-50">
              <AlertDescription className="text-slate-600">
                {showAllTasks
                  ? 'No tasks available.'
                  : 'No tasks scheduled for this day.'}
              </AlertDescription>
            </Alert>
          )}

          {overdue > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                <span className="font-semibold">{overdue}</span> overdue task
                {overdue > 1 ? 's' : ''}. Please catch up.
              </AlertDescription>
            </Alert>
          )}

          {pending > 0 && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="text-amber-700">
                You have <span className="font-semibold">{pending}</span>{' '}
                pending task{pending > 1 ? 's' : ''}.
              </AlertDescription>
            </Alert>
          )}

          {total > 0 && overdue === 0 && pending === 0 && (
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
