import { createFileRoute } from '@tanstack/react-router'
import { TodoItem } from '#/components/todo/TodoItem'
import { Button } from '@/components/ui/button'
import { useTodos } from '@/hooks/useTodos'
import { useState } from 'react'
import { SquareCheckBig, Trash } from 'lucide-react'
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

export const Route = createFileRoute('/archived')({
  component: ArchivedPage,
})

function ArchivedPage() {
  const { todos, restoreTodo, deletePermanently, deleteManyArchived } =
    useTodos()
  const archivedTodos = todos.filter((todo) => todo.archived)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [showBulkDelete, setShowBulkDelete] = useState(false)


 return (
  <div className="mx-auto w-full max-w-5xl px-4 py-6">

    {/* Toolbar */}
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">

      {selectMode ? (
        <>
          <Button
            variant="ghost"
            onClick={() => {
              setSelectMode(false)
              setSelectedIds([])
            }}
          >
            Cancel
          </Button>

          <span className="text-sm font-medium text-gray-500">
            {selectedIds.length} selected
          </span>

          <Button
            variant="destructive"
            disabled={selectedIds.length === 0}
            onClick={() => setShowBulkDelete(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Permanently
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          onClick={() => setSelectMode(true)}
          className="rounded-xl"
        >
          <SquareCheckBig className="mr-2 h-4 w-4" />
          Select
        </Button>
      )}

    </div>

    {/* List */}
    {archivedTodos.length === 0 ? (
      <div className="flex flex-col items-center justify-center rounded-2xl  py-20">

        <Trash className="mb-4 h-12 w-12 text-gray-500/50" />

        <h2 className="text-lg font-semibold text-gray-900">
          No Archived Tasks
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Tasks you archive will appear here.
        </p>

      </div>
    ) : (
      <div className="space-y-3">
        {archivedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={() => {}}
            onToggle={() => {}}
            onUpdate={() => {}}
            onRestore={restoreTodo}
            onDeletePermanent={deletePermanently}
            selectMode={selectMode}
            isSelected={selectedIds.includes(todo.id)}
            onToggleSelect={(id) =>
              setSelectedIds((prev) =>
                prev.includes(id)
                  ? prev.filter((x) => x !== id)
                  : [...prev, id],
              )
            }
            archivedView
          />
        ))}
      </div>
    )}

    {/* Dialog */}
    <AlertDialog
      open={showBulkDelete}
      onOpenChange={setShowBulkDelete}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Permanently
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to permanently delete{" "}
            {selectedIds.length} selected task
            {selectedIds.length > 1 && "s"}?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => {
              deleteManyArchived(selectedIds)
              setSelectedIds([])
              setSelectMode(false)
              setShowBulkDelete(false)
            }}
          >
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  </div>
)
}
