import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import type { Todo } from '@/lib/types'
import { useState } from 'react'
import { TodoForm } from '@/components/TodoForm'

type TodoDetailDialogProps = {
  open: boolean
  onClose: () => void
  todo: Todo
  onUpdate: (updatedTodo: Todo) => void
}

export function TodoDetailDialog({
  open,
  onClose,
  todo,
  onUpdate,
}: TodoDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleClose = () => {
    setIsEditing(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Todo' : todo.title}</DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <TodoForm
            initialData={{
              title: todo.title,
              detail: todo.detail,
              category: todo.category,
              priority: todo.priority,
              deadline: todo.deadline,
              dueTime: todo.dueTime,
              repeat: todo.repeat,
            }}
            submitLabel="Save Changes"
            showPriority={true}
            showRepeat={true}
            showCancel={true}
            onCancel={() => setIsEditing(false)}
            onSubmit={(data) => {
              onUpdate({
                ...todo,
                ...data,
              })
              setIsEditing(false)
              onClose()
            }}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Detail</h4>
              <p>{todo.detail}</p>
            </div>

            <div>
              <h4 className="font-medium">Category</h4>
              <p>{todo.category}</p>
            </div>

            <div>
              <h4 className="font-medium">Priority</h4>
              <p>{todo.priority}</p>
            </div>

            <div>
              <h4 className="font-medium">Deadline</h4>
              <p>{todo.deadline}{todo.dueTime && ` ${todo.dueTime}`}</p>
            </div>

            { todo.repeat !== 'none' && (
              <div>
                <h4 className="font-medium">Repeat</h4>
                <p>{todo.repeat.charAt(0).toUpperCase() + todo.repeat.slice(1)}</p>
              </div>
            )}

            <Button
              onClick={() => setIsEditing(true)}
              className="w-full gap-2 bg-green-500 text-white hover:bg-green-600"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
