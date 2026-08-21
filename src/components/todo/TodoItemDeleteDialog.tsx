import { toast } from 'sonner'
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

type TodoItemDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  archivedView?: boolean
  onConfirm: () => void
}

export function TodoItemDeleteDialog({
  open,
  onOpenChange,
  archivedView,
  onConfirm,
}: TodoItemDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {archivedView ? 'Delete Permanently' : 'Delete Todo'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {archivedView
              ? 'This will permanently delete this todo. This action cannot be undone.'
              : 'Are you sure you want to delete this todo?'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm()
              toast.error(archivedView ? 'Todo deleted permanently' : 'Todo deleted')
            }}
          >
            {archivedView ? 'Delete Permanently' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
