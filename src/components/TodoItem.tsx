import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Trash2,
  CalendarDays,
  TriangleAlert,
  EllipsisVertical,
  Flag,
  Repeat,
  Archive,
  RotateCcw,
  Trash,
} from 'lucide-react'
import type { Todo } from '@/lib/types'
import { useState } from 'react'
import { TodoDetailDialog } from '@/components/TodoDetailDialog'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { format } from 'date-fns'
import { getDeadlineStatus } from '@/lib/deadline'
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

type TodoItemProps = {
  todo: Todo
  onDelete: (id: number) => void
  onToggle: (id: number) => void
  onUpdate: (updatedTodo: Todo) => void
  onArchive?: (id: number) => void
  onRestore?: (id: number) => void
  onDeletePermanent?: (id: number) => void
  selectMode?: boolean
  isSelected?: boolean
  onToggleSelect?: (id: number) => void
  archivedView?: boolean
}

export function TodoItem({
  todo,
  onDelete,
  onToggle,
  onUpdate,
  onArchive,
  onRestore,
  onDeletePermanent,
  selectMode = false,
  isSelected = false,
  onToggleSelect,
  archivedView = false,
}: TodoItemProps) {
  const [showDetail, setShowDetail] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const getBadgeColor = (type: 'category' | 'priority', value: string) => {
    if (type === 'category') {
      switch (value) {
        case 'Work':
          return 'bg-blue-100 text-blue-700'
        case 'Personal':
          return 'bg-purple-100 text-purple-700'
        case 'Shopping':
          return 'bg-orange-100 text-orange-700'
        default:
          return 'bg-gray-100 text-gray-700'
      }
    }

    switch (value) {
      case 'High':
        return 'bg-red-100 text-red-700'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'Low':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const status =
    !todo.completed && todo.deadline ? getDeadlineStatus(todo.deadline, todo.dueTime) : null

  return (
    <>
      <Card
        onClick={() =>
          selectMode
            ? onToggleSelect?.(todo.id)
            : setShowDetail(true)
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
        <CardContent className="flex items-start justify-between">
          <div className="flex flex-1 gap-3">
            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => onToggle(todo.id)}
                disabled={selectMode || archivedView}
                className="mt-1 h-5 w-5"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start gap-1">
                <h3
                  className={`text-base font-semibold ${
                    todo.completed
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {todo.title}
                </h3>

                {status && (
                  <TriangleAlert className="h-5 w-5 text-orange-500" />
                )}
              </div>

              <p className="text-gray-500">{todo.detail}</p>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <Badge className={getBadgeColor('category', todo.category)}>
                  {todo.category}
                </Badge>

                {todo.priority !== 'None' && (
                  <Badge className={getBadgeColor('priority', todo.priority)}>
                    <Flag className="mr-1 h-4 w-4" />
                    {todo.priority}
                  </Badge>
                )}

                {archivedView && (
                  <Badge className="bg-gray-200 text-gray-600">
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

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>
                    {format(new Date(todo.deadline), 'dd MMM yyyy')}
                    {todo.dueTime && ` ${todo.dueTime}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!selectMode && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <EllipsisVertical className="h-5 w-5 text-slate-600" />
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
                        setShowDelete(true)
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
                        onValueChange={(value) =>
                          onUpdate({
                            ...todo,
                            priority: value as Todo['priority'],
                          })
                        }
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
                      <Archive className="mr-2 h-4 w-4 text-slate-500" />
                      Archive
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDelete(true)
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
          )}
        </CardContent>
      </Card>

      <TodoDetailDialog
        open={showDetail}
        onClose={() => setShowDetail(false)}
        todo={todo}
        onUpdate={onUpdate}
      />

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {archivedView ? 'Delete Permanently' : 'Delete Todo'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {archivedView
                ? 'This will permanently delete this todo. This action cannot be undone.'
                : 'Are you sure you want to delete this todo?'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (archivedView) {
                  onDeletePermanent?.(todo.id)
                } else {
                  onDelete(todo.id)
                }
                setShowDelete(false)
              }}
            >
              {archivedView ? 'Delete Permanently' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
