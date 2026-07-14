import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Edit,
  Trash2,
  CalendarDays,
  TriangleAlert,
  EllipsisVertical,
  Flag,
} from 'lucide-react'
import type { Todo } from '@/lib/types'
import { useState } from 'react'
import { TodoDialog } from '@/components/TodoDialog'
import { Badge } from '@/components/ui/badge'
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
}

export function TodoItem({
  todo,
  onDelete,
  onToggle,
  onUpdate,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4">
          <TodoDialog
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            title="Edit Todo"
            submitLabel="Save"
            showPriority={false}
            initialData={{
              title: todo.title,
              detail: todo.detail,
              category: todo.category,
              priority: todo.priority,
              deadline: todo.deadline,
            }}
            onSubmit={(data) => {
              onUpdate({
                ...todo,
                ...data,
                priority: data.priority as Todo['priority'],
              })
              setIsEditing(false)
            }}
          />
        </CardContent>
      </Card>
    )
  }

  const getBadgeColor = (type: 'category' | 'priority', value: string) => {
    if (type === 'category') {
      switch (value) {
        case 'Pekerjaan':
          return 'bg-blue-100 text-blue-700'
        case 'Pribadi':
          return 'bg-purple-100 text-purple-700'
        case 'Belanja':
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
    !todo.completed && todo.deadline ? getDeadlineStatus(todo.deadline) : null

  return (
    <Card
      className={`transition-all duration-200 ${
        todo.completed
          ? 'bg-muted/40 opacity-75'
          : 'hover:shadow-md hover:border-green-300'
      }`}
    >
      <CardContent className="flex items-start justify-between">
        <div className="flex flex-1 gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            className="mt-1 h-5 w-5"
          />

          <div>
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

              {status && <TriangleAlert className="h-5 w-5 text-orange-500 " />}
            </div>

            <p className="text-gray-500">{todo.detail}</p>
            <div className="flex flex-wrap items-center  gap-3 mt-1">
              <Badge className={getBadgeColor('category', todo.category)}>
                {todo.category}
              </Badge>
              {todo.priority !== 'None' && (
                <Badge className={getBadgeColor('priority', todo.priority)}>
                  <Flag className="h-4 w-4 mr-1" />
                  {todo.priority}
                </Badge>
              )}

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{format(new Date(todo.deadline), 'dd MMM yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="h-5 w-5 text-slate-600" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Priority</DropdownMenuLabel>

              <DropdownMenuRadioGroup
                value={todo.priority}
                onValueChange={(value) =>
                  onUpdate({ ...todo, priority: value as Todo['priority'] })
                }
              >
                <DropdownMenuRadioItem value="High">
                  <Flag className="mr-2 h-4 w-4 text-red-500 " />
                  High
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="Medium">
                  <Flag className="mr-2 h-4 w-4 text-yellow-500 " />
                  Medium
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="Low">
                  <Flag className="mr-2 h-4 w-4 text-green-500 " />
                  Low
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem value="None">
                  <Flag className="mr-2 h-4 w-4 text-gray-400" />
                  None
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(todo.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}
