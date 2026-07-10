import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash2, CalendarDays } from 'lucide-react'
import type { Todo } from '@/lib/types'
import { useState } from 'react'
import { TodoDialog } from '@/components/TodoDialog'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

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
            initialData={{
              title: todo.title,
              detail: todo.detail,
              category: todo.category,
              deadline: todo.deadline,
            }}
            onSubmit={(data) => {
              onUpdate({
                ...todo,
                ...data,
              })
              setIsEditing(false)
            }}
          />
        </CardContent>
      </Card>
    )
  }

  const badgeColor: { [key: string]: string } = {
  Pekerjaan: "bg-blue-100 text-blue-700",
  Pribadi: "bg-purple-100 text-purple-700",
  Belanja: "bg-orange-100 text-orange-700",
  Lainnya: "bg-gray-100 text-gray-700",
}

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

          <div >
            <h3
              className={`text-base font-semibold ${
                todo.completed
                  ? 'line-through text-muted-foreground'
                  : 'text-foreground'
              }`}
            >
              {todo.title}
            </h3>

            {todo.detail && (
              <p
                className={`text-sm ${
                  todo.completed
                    ? 'line-through text-muted-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {todo.detail}
              </p>
            )}

            <div className="flex flex-wrap items-center  gap-3 mt-1">
              <Badge
                className={`w-fit ${
                  badgeColor[todo.category] ?? badgeColor.Lainnya
                }`}
              >
                {todo.category}
              </Badge>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>
                  {format(new Date(todo.deadline), 'dd MMM yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 text-slate-600" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(todo.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}