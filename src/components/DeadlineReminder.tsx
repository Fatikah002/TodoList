import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TriangleAlert } from 'lucide-react'
import type { Todo } from '@/lib/types'

type Props = {
  todos: Todo[]
}

type DeadlineStatus = 'late' | 'today' | 'tomorrow' | 'in2days'

const statusOrder: DeadlineStatus[] = [
  'late',
  'today',
  'tomorrow',
  'in2days',
]

const statusMeta: Record<
  DeadlineStatus,
  {
    title: string
    label: string
    className: string
  }
> = {
  late: {
    title: 'Terlambat',
    label: 'Terlambat',
    className: 'border-red-200 bg-red-50 text-red-700',
  },
  today: {
    title: 'Hari ini',
    label: 'Hari ini',
    className: 'border-orange-200 bg-orange-50 text-orange-700',
  },
  tomorrow: {
    title: 'Besok',
    label: 'Besok',
    className: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  },
  in2days: {
    title: '2 hari lagi',
    label: '2 hari lagi',
    className: 'border-blue-200 bg-blue-50 text-blue-700',
  },
}

function getDeadlineStatus(daysUntilDeadline: number): DeadlineStatus | null {
  if (daysUntilDeadline < 0) return 'late'
  if (daysUntilDeadline === 0) return 'today'
  if (daysUntilDeadline === 1) return 'tomorrow'
  if (daysUntilDeadline === 2) return 'in2days'
  return null
}

export function DeadlineReminder({ todos }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const remindersByStatus = todos.reduce<Record<DeadlineStatus, Todo[]>>(
    (groups, todo) => {
      if (todo.completed) return groups

      const deadline = new Date(todo.deadline)
      if (Number.isNaN(deadline.getTime())) return groups

      deadline.setHours(0, 0, 0, 0)

      const daysUntilDeadline = Math.round(
        (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      )
      const status = getDeadlineStatus(daysUntilDeadline)

      if (status) {
        groups[status].push(todo)
      }

      return groups
    },
    { late: [], today: [], tomorrow: [], in2days: [] },
  )

  const reminderGroups = statusOrder
    .map((status) => ({ status, items: remindersByStatus[status] }))
    .filter((group) => group.items.length > 0)

  if (reminderGroups.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {reminderGroups.map(({ status, items }) => {
        const meta = statusMeta[status]

        return (
          <Alert key={status} className={meta.className}>
            <TriangleAlert className="h-4 w-4" />

            <AlertTitle>{meta.title}</AlertTitle>

            <AlertDescription>
              <ul className="list-disc pl-5">
                {items.map((todo) => (
                  <li key={todo.id}>
                    {todo.title} ({todo.deadline})
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}