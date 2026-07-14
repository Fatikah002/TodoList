import { Card, CardContent } from '@/components/ui/card'
import type { Todo } from '@/lib/types'
import { CircularProgress } from './CircularProgress'

type DailyProgressProps = {
  todos: Todo[]
  selectedDate: string
}

export function DailyProgress({ todos, selectedDate }: DailyProgressProps) {
  const total = todos.length

  const completed = todos.filter((todo) => todo.completed).length

  const pending = todos.filter((todo) => !todo.completed).length

  const overdue = todos.filter(
    (todo) => !todo.completed && todo.deadline < selectedDate,
  ).length

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
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
              <div className="text-center">
                <p className="text-lg font-bold text-green-500">{completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-orange-500">{pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-red-500">{overdue}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
