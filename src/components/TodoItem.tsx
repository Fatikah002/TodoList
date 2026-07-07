import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2 } from 'lucide-react'
import type { Todo } from '@/lib/types'

type TodoItemProps = {
  todo: Todo
  onDelete: (id: number) => void
  onToggle: (id: number) => void
}

export function TodoItem({ todo, onDelete, onToggle }: TodoItemProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
          />
          <div className="flex flex-col">
            <span
              className={
                todo.completed
                  ? 'font-bold line-through text-muted-foreground'
                  : 'font-bold'
              }
            >
              {todo.title}
            </span>
            <span
              className={
                todo.completed
                  ? 'text-sm line-through text-muted-foreground'
                  : 'text-sm text-muted-foreground'
              }
            >
              {todo.category}
            </span>
            <span
              className={
                todo.completed ? 'line-through text-muted-foreground' : ''
              }
            >
              {todo.deadline}
            </span>
          </div>
        </div>

        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(todo.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
