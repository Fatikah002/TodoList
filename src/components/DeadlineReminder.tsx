import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TriangleAlert, ChevronDown, ChevronUp } from 'lucide-react'
import type { Todo } from '@/lib/types'
import { format } from 'date-fns'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useState } from 'react'

type Props = { todos: Todo[] }
type DeadlineStatus = 'late' | 'today' | 'tomorrow' | 'in2days'

const statusOrder: DeadlineStatus[] = ['late', 'today', 'tomorrow', 'in2days']
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
function ReminderGroup({
  title,
  className,
  todos,
}: {
  title: string
  className: string
  todos: Todo[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Alert className={className}>
        <CollapsibleTrigger className="w-full">
          <button className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-4 w-4" />
              <span className="font-semibold">
                ({todos.length}) {title}
              </span>
            </div>

            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <AlertDescription className="mt-2">
            <ul className="space-y-1">
              {todos.map((todo) => (
                <li className="ml-6" key={todo.id}>
                  - {todo.title} {' '}
                  ({format(new Date(todo.deadline), 'dd MMM yyyy')})
                </li>
              ))}
            </ul>
          </AlertDescription>
        </CollapsibleContent>
      </Alert>
    </Collapsible>
  )
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
          <ReminderGroup
            key={status}
            title={meta.title}
            className={meta.className}
            todos={items}
          />
        )
      })}
    </div>
  )
}
