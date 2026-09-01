import { toast } from 'sonner'
import type { Todo } from '@/lib/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type TodoItemArchiveDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  todo: Todo
  onArchive: (id: string) => void
  onUndoArchive: (todo: Todo) => void
}

export function TodoItemArchiveDialog({
  open,
  onOpenChange,
  todo,
  onArchive,
  onUndoArchive,
}: TodoItemArchiveDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive Todo</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to archive this todo? You can restore it later
            from the archived section.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="default"
            className="bg-amber-400 text-amber-900 hover:bg-amber-500 focus:ring-amber-500"
            onClick={() => {
              onArchive(todo.id)
              toast.warning('Todo archived', {
                classNames: {
                  toast: '!bg-amber-50 !text-amber-700 !border-amber-200',
                },
                action: {
                  label: 'Undo',
                  onClick: () => onUndoArchive({ ...todo, archived: false }),
                },
              })
            }}
          >
            Archive
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
