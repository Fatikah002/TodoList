import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TodoForm } from '@/components/TodoForm'

type TodoDialogProps = {
  isOpen: boolean
  onClose: () => void

  title: string

  showPriority?: boolean

  initialData?: {
    title: string
    detail: string
    category: string
    priority: string
    deadline: string
  }

  submitLabel: string

  onSubmit: (data: {
    title: string
    detail: string
    category: string
    priority: string
    deadline: string
  }) => void
}

export function TodoDialog({
  isOpen,
  onClose,
  title,
  initialData,
  showPriority,
  submitLabel,
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