import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TodoForm } from '@/components/TodoForm'
import type { Todo } from '@/lib/types'

type TodoDialogProps = {
  isOpen: boolean
  onClose: () => void

  title: string

  showPriority?: boolean

  initialData?: {
    title: string
    detail: string
    category: string
    priority: Todo['priority']
    deadline: string
  }

  submitLabel: string

  onSubmit: (data: {
    title: string
    detail: string
    category: string
    priority: Todo['priority']
    deadline: string
  }) => void
}

export function TodoDialog({
  isOpen,
  onClose,
  title,
  initialData,
  submitLabel,
  showPriority,
  onSubmit,
}: TodoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <TodoForm
          initialData={initialData}
          submitLabel={submitLabel}
          showPriority={showPriority}
          onSubmit={(data) => {
            onSubmit(data)
            onClose()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}