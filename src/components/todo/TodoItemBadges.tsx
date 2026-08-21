import { Badge } from '@/components/ui/badge'
import { Flag, Repeat, Archive } from 'lucide-react'
import type { Todo } from '@/lib/types'
import { getCategoryMeta } from '@/lib/categories'

const PRIORITY_COLORS: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-50 text-green-600',
}

type TodoItemBadgesProps = {
  todo: Todo
  archivedView?: boolean
}

export function TodoItemBadges({ todo, archivedView }: TodoItemBadgesProps) {
  const categoryMeta = getCategoryMeta(todo.category)

  return (
    <div className="mt-1 flex flex-wrap items-center gap-3">
      <Badge className={`${categoryMeta.lightBg} ${categoryMeta.textColor}`}>
        {todo.category}
      </Badge>

      {todo.priority !== 'None' && (
        <Badge className={PRIORITY_COLORS[todo.priority] ?? 'bg-gray-100 text-gray-900'}>
          <Flag className="mr-1 h-4 w-4" />
          {todo.priority}
        </Badge>
      )}

      {archivedView && (
        <Badge className="bg-gray-100 text-gray-500">
          <Archive className="mr-1 h-4 w-4" />
          Archived
        </Badge>
      )}

      {todo.repeat !== 'none' && (
        <Badge className="bg-teal-100 text-teal-700">
          <Repeat className="mr-1 h-4 w-4" />
          {todo.repeat.charAt(0).toUpperCase() + todo.repeat.slice(1)}
        </Badge>
      )}
    </div>
  )
}
