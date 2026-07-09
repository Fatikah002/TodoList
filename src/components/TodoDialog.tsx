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

  initialData?: {
    title: string
    category: string
    deadline: string
  }

  submitLabel: string

  onSubmit: (data: {
    title: string
    category: string
    deadline: string
  }) => void
}

export function TodoDialog({
  isOpen,
  onClose,
  title,
  initialData,
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
          onSubmit={(data) => {
            onSubmit(data)
            onClose()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}