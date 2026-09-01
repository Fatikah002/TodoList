import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { TodoForm } from '@/components/todo/TodoForm'
import type { TodoFormData } from '@/lib/schemas'

type TodoDialogProps = {
  isOpen: boolean
  onClose: () => void

  title: string

  showPriority?: boolean
  showRepeat?: boolean

  initialData?: TodoFormData

  submitLabel: string

  onSubmit: (data: TodoFormData) => void
}

export function TodoDialog({
  isOpen,
  onClose,
  title,
  initialData,
  submitLabel,
  showPriority,
  showRepeat,
  onSubmit,
}: TodoDialogProps) {
  const isEditing = !!initialData

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edit the details of your todo' : 'Fill in the details to create a new todo'}
          </DialogDescription>
        </DialogHeader>

        <TodoForm
          initialData={initialData}
          submitLabel={submitLabel}
          showPriority={showPriority}
          showRepeat={showRepeat}
          onSubmit={(data) => {
            onSubmit(data)
            onClose()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
