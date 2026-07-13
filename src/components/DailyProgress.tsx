import { Card, CardContent } from '@/components/ui/card'
import type { Todo } from '@/lib/types'
import { CircularProgress } from './CircularProgress'

type DailyProgressProps = {
  todos: Todo[]
  selectedDate: string
}

export function DailyProgress({ todos, selectedDate }: DailyProgressProps) {
  const todayTodos = todos.filter((todo) => todo.deadline === selectedDate)

  const total = todayTodos.length

  const completed = todayTodos.filter((todo) => todo.completed).length

  const pending = total - completed

  const overdue = todos.filter(
    (todo) => !todo.completed && todo.deadline < selectedDate,
  ).length

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <Card className="w-full rounded-3xl shadow-md">
      <CardContent className="space-y-6 p-6">
        <h2 className="text-lg font-semibold">Progress Today</h2>

        <CircularProgress percentage={percentage} />

        <p className="text-center text-sm text-muted-foreground">
          {completed} of {total} tasks completed
        </p>

        <div className="grid grid-cols-3 gap-2 border-t pt-5">
          <div className="text-center">
            <p className="text-xl font-bold text-green-500 sm:text-2xl">
              {completed}
            </p>

            <p className="text-xs text-muted-foreground sm:text-sm">
              Completed
            </p>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-orange-500 sm:text-2xl">
              {pending}
            </p>

            <p className="text-xs text-muted-foreground sm:text-sm">Pending</p>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-red-500 sm:text-2xl">
              {overdue}
            </p>

            <p className="text-xs text-muted-foreground sm:text-sm">Overdue</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
