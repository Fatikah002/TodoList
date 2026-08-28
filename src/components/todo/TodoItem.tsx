import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { TriangleAlert } from 'lucide-react'
import type { Todo } from '@/lib/types'
import { useState } from 'react'
import { TodoDetailDialog } from '@/components/todo/TodoDetailDialog'
import { TodoItemBadges } from '@/components/todo/TodoItemBadges'
import { TodoItemDropdown } from '@/components/todo/TodoItemDropdown'
import { TodoItemDeleteDialog } from '@/components/todo/TodoItemDeleteDialog'
import { TodoItemArchiveDialog } from '@/components/todo/TodoItemArchiveDialog'
import { getDeadlineStatus } from '@/lib/deadline'

type TodoItemProps = {
  todo: Todo
  onDelete?: (id: string) => void
  onToggle?: (id: string) => void
  onUpdate?: (updatedTodo: Todo) => void
  onArchive?: (id: string) => void
  onUndoArchive?: (todo: Todo) => void
  onRestore?: (id: string) => void
  onDeletePermanent?: (id: string) => void
  selectMode?: boolean
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
  archivedView?: boolean
}

export function TodoItem({
  todo,
  onDelete,
  onToggle,
  onUpdate,
  onArchive,
  onUndoArchive,
  onRestore,
  onDeletePermanent,
  selectMode = false,
  isSelected = false,
  onToggleSelect,
  archivedView = false,
}: TodoItemProps) {
  const [showDetail, setShowDetail] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showArchive, setShowArchive] = useState(false)

  const status =
    !todo.completed && todo.deadline
      ? getDeadlineStatus(todo.deadline, todo.dueTime)
      : null

  return (
    <>
      <Card
        onClick={() =>
          selectMode ? onToggleSelect?.(todo.id) : setShowDetail(true)
        }
        className={`relative cursor-pointer transition-all duration-200 ${
          todo.completed
            ? 'bg-muted/40 opacity-75'
            : 'hover:border-green-300 hover:shadow-md'
        } ${
          isSelected
            ? 'border-primary bg-primary/10 ring-1 ring-primary/40 shadow-md'
            : ''
        }`}
      >
        <CardContent className="flex items-stretch justify-between gap-4">
          <div className="flex flex-1 gap-3">
            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => onToggle?.(todo.id)}
                disabled={selectMode || archivedView}
                className="mt-1 h-5 w-5"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start gap-1">
                <h3
                  className={`text-base font-semibold ${
                    todo.completed
                      ? 'line-through text-gray-500'
                      : 'text-gray-900'
                  }`}
                >
                  {todo.title}
                </h3>

                {status && (
                  <TriangleAlert className="h-5 w-5 text-orange-500" />
                )}
              </div>

              <p className="line-clamp-2 text-gray-500">{todo.detail}</p>

              <TodoItemBadges todo={todo} archivedView={archivedView} />
            </div>
          </div>

          {!selectMode && (
            <TodoItemDropdown
              todo={todo}
              archivedView={archivedView}
              onUpdate={onUpdate}
              onRestore={onRestore}
              onArchive={onArchive}
              onDelete={() => setShowDelete(true)}
            />
          )}
        </CardContent>
      </Card>

      <TodoDetailDialog
        open={showDetail}
        onClose={() => setShowDetail(false)}
        todo={todo}
        onUpdate={onUpdate}
      />

      <TodoItemDeleteDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        archivedView={archivedView}
        onConfirm={() => {
          if (archivedView) {
            onDeletePermanent?.(todo.id)
          } else {
            onDelete?.(todo.id)
          }
        }}
      />

      {onArchive && onUndoArchive && (
        <TodoItemArchiveDialog
          open={showArchive}
          onOpenChange={setShowArchive}
          todo={todo}
          onArchive={onArchive}
          onUndoArchive={onUndoArchive}
        />
      )}
    </>
  )
}
