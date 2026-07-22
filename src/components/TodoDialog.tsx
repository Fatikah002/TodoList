import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TodoForm } from '@/components/TodoForm'
import type { Todo, RepeatType } from '@/lib/types'

type TodoDialogProps = {
  isOpen: boolean
  onClose: () => void

  title: string

  showPriority?: boolean
  showRepeat?: boolean

  initialData?: {
    title: string
    detail: string
    category: string
    priority: Todo['priority']
    deadline: string
    dueTime: string
    repeat: RepeatType
  }

  submitLabel: string

  onSubmit: (data: {
    title: string
    detail: string
    category: string
    priority: Todo['priority']
    deadline: string
    dueTime: string
    repeat: RepeatType
  }) => void
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