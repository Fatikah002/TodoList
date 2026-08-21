import { toast } from 'sonner'
import { Trash2, CalendarDays, Flag, Archive, RotateCcw, Trash, EllipsisVertical } from 'lucide-react'
import type { Todo } from '@/lib/types'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu'

type TodoItemDropdownProps = {
  todo: Todo
  archivedView?: boolean
  onUpdate: (todo: Todo) => void
  onRestore?: (id: string) => void
  onArchive?: (id: string) => void
  onDelete: () => void
}

export function TodoItemDropdown({
  todo,
  archivedView,
  onUpdate,
  onRestore,
  onArchive,
  onDelete,
}: TodoItemDropdownProps) {
  return (
    <div className="flex min-h-full flex-col items-end justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <EllipsisVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44"
          onClick={(e) => e.stopPropagation()}
        >
          {archivedView ? (
            <>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onRestore?.(todo.id)
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4 text-blue-500" />
                Restore
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Permanently
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Priority</DropdownMenuLabel>

                <DropdownMenuRadioGroup
                  value={todo.priority}
                  onValueChange={(value) => {
                    onUpdate({
                      ...todo,
                      priority: value as Todo['priority'],
                    })
                    toast.success('Priority updated!')
                  }}
                >
                  <DropdownMenuRadioItem value="High">
                    <Flag className="mr-2 h-4 w-4 text-red-500" />
                    High
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="Medium">
                    <Flag className="mr-2 h-4 w-4 text-yellow-500" />
                    Medium
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="Low">
                    <Flag className="mr-2 h-4 w-4 text-green-500" />
                    Low
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="None">
                    <Flag className="mr-2 h-4 w-4 text-gray-400" />
                    None
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onArchive?.(todo.id)
                }}
              >
                <Archive className="mr-2 h-4 w-4 text-gray-500" />
                Archive
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <CalendarDays className="h-3.5 w-3.5" />
        <span>
          {format(new Date(todo.deadline), 'dd MMM yyyy')}
          {todo.dueTime && ` ${todo.dueTime}`}
        </span>
      </div>
    </div>
  )
}
