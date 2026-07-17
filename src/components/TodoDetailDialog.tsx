import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { Todo } from "@/lib/types"

type TodoDetailDialogProps = {
  open: boolean
  onClose: () => void
  todo: Todo
}

export function TodoDetailDialog({
  open,
  onClose,
  todo,
}: TodoDetailDialogProps) {
  return (
    
   <Dialog open={open} onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{todo.title}</DialogTitle>
    </DialogHeader>

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
        <p>{todo.deadline}</p>
      </div>

      {todo.repeat !== 'none' && (
        <div>
          <h4 className="font-medium">Repeat</h4>
          <p>{todo.repeat.charAt(0).toUpperCase() + todo.repeat.slice(1)}</p>
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>
  )
}